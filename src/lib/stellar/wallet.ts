"use client";

import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";
import { TESTNET } from "./network";

// Wallet abstraction for the Forge. Two modes behind one interface:
//   * "local" — a keypair generated/imported in the browser, stored in
//     localStorage. Testnet convenience only (the UI says so loudly).
//   * "kit"   — a real wallet (Freighter, xBull, Albedo, …) via the Stellar
//     Wallets Kit; the extension signs, we never see the secret.
// Either way the server is never involved in signing.

export interface ForgeWallet {
  kind: "local" | "kit";
  address: string;
  signTransaction(xdr: string): Promise<string>;
  disconnect(): void;
}

const SECRET_KEY = "tusst:forge:secret";

// ---------------------------------------------------------------------------
// Local keypair mode
// ---------------------------------------------------------------------------

function localWalletFrom(keypair: Keypair): ForgeWallet {
  return {
    kind: "local",
    address: keypair.publicKey(),
    async signTransaction(xdr: string): Promise<string> {
      const tx = TransactionBuilder.fromXDR(xdr, TESTNET.passphrase);
      tx.sign(keypair);
      return tx.toXDR();
    },
    disconnect() {
      try {
        window.localStorage.removeItem(SECRET_KEY);
      } catch {
        // ignore
      }
    },
  };
}

export function loadLocalWallet(): ForgeWallet | null {
  try {
    const secret = window.localStorage.getItem(SECRET_KEY);
    if (!secret) return null;
    return localWalletFrom(Keypair.fromSecret(secret));
  } catch {
    return null;
  }
}

export function generateLocalWallet(): ForgeWallet {
  const keypair = Keypair.random();
  try {
    window.localStorage.setItem(SECRET_KEY, keypair.secret());
  } catch {
    // private mode — wallet lives for the session only
  }
  return localWalletFrom(keypair);
}

export function importLocalWallet(secret: string): ForgeWallet {
  const keypair = Keypair.fromSecret(secret.trim()); // throws on bad input
  try {
    window.localStorage.setItem(SECRET_KEY, keypair.secret());
  } catch {
    // ignore
  }
  return localWalletFrom(keypair);
}

export function exportLocalSecret(): string | null {
  try {
    return window.localStorage.getItem(SECRET_KEY);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Stellar Wallets Kit mode (browser-only; loaded lazily on first use)
// ---------------------------------------------------------------------------

let kitReady = false;

async function loadKit() {
  const [mod, moduleUtils] = await Promise.all([
    import("@creit.tech/stellar-wallets-kit"),
    import("@creit.tech/stellar-wallets-kit/modules/utils"),
  ]);
  if (!kitReady) {
    mod.StellarWalletsKit.init({
      modules: moduleUtils.defaultModules(),
      network: mod.Networks.TESTNET,
    });
    kitReady = true;
  }
  return mod;
}

export async function connectKitWallet(): Promise<ForgeWallet> {
  const mod = await loadKit();
  const { address } = await mod.StellarWalletsKit.authModal();
  return {
    kind: "kit",
    address,
    async signTransaction(xdr: string): Promise<string> {
      const { signedTxXdr } = await mod.StellarWalletsKit.signTransaction(xdr, {
        address,
        networkPassphrase: TESTNET.passphrase,
      });
      return signedTxXdr;
    },
    disconnect() {
      mod.StellarWalletsKit.disconnect().catch(() => {});
    },
  };
}

// ---------------------------------------------------------------------------
// Account helpers
// ---------------------------------------------------------------------------

export async function fundWithFriendbot(address: string): Promise<void> {
  const res = await fetch(
    `${TESTNET.friendbotUrl}?addr=${encodeURIComponent(address)}`,
  );
  if (!res.ok) {
    // Friendbot answers 400 when the account is already funded — treat as ok.
    // The message has two known shapes ("createAccountAlreadyExist" from the
    // underlying tx error, "account already funded" from friendbot itself).
    const body = await res.text().catch(() => "");
    const alreadyFunded =
      body.includes("createAccountAlreadyExist") ||
      body.toLowerCase().includes("already funded");
    if (!alreadyFunded) {
      throw new Error("friendbot funding failed — try again");
    }
  }
}

/** Native XLM balance, or null when the account doesn't exist yet. */
export async function fetchXlmBalance(address: string): Promise<string | null> {
  const res = await fetch(
    `${TESTNET.horizonUrl}/accounts/${encodeURIComponent(address)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("could not reach Horizon");
  const data = (await res.json()) as {
    balances?: Array<{ asset_type: string; balance: string }>;
  };
  return data.balances?.find((b) => b.asset_type === "native")?.balance ?? "0";
}
