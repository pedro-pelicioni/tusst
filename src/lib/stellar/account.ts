"use client";

// The Ledger Sheet's read model: one Horizon account, flattened into the
// numbers that make classic operations legible.
//
// The reserve line is the point. `create-account`, `change-trust` and
// `set-options` all fail with op_low_reserve for the same invisible reason —
// every subentry an account owns locks another half XLM — and the Forge never
// showed that number anywhere.

import { Horizon } from "@stellar/stellar-sdk";
import { TESTNET } from "./network";

// Protocol constants. The reserve is NOT simply "2 + subentries": an account
// that sponsors another ledger entry (a claimable balance, say) pays for it
// without that entry ever showing up in its own subentry_count. Verified on
// testnet — creating a claimable balance moved the balance and left
// subentry_count at 0, so the naive formula overstated what was spendable.
//
//   minBalance = (2 + subEntries + sponsoring − sponsored) × baseReserve
const BASE_RESERVE_XLM = 0.5;
const BASE_ENTRIES = 2;

export interface AccountBalanceRow {
  isNative: boolean;
  assetCode: string;
  issuer?: string;
  balance: string;
  limit?: string;
}

export interface AccountSummary {
  address: string;
  sequence: string;
  subentryCount: number;
  /** ledger entries this account pays the reserve for on someone else's behalf */
  sponsoringCount: number;
  /** entries of this account whose reserve somebody else pays */
  sponsoredCount: number;
  /** XLM that cannot be spent while the account owns what it owns */
  minimumReserve: string;
  nativeBalance: string;
  /** native balance minus the minimum reserve, floored at zero */
  spendable: string;
  balances: AccountBalanceRow[];
  signers: { key: string; weight: number; type: string }[];
  thresholds: { low: number; med: number; high: number };
  homeDomain?: string;
}

/** `null` means the account is not funded yet — not an error, a state. */
export async function fetchAccountSummary(
  address: string,
): Promise<AccountSummary | null> {
  const horizon = new Horizon.Server(TESTNET.horizonUrl);
  let account: Awaited<ReturnType<typeof horizon.loadAccount>>;
  try {
    account = await horizon.loadAccount(address);
  } catch {
    return null;
  }

  const balances: AccountBalanceRow[] = account.balances.map((b) => {
    if (b.asset_type === "native") {
      return { isNative: true, assetCode: "XLM", balance: b.balance };
    }
    const row = b as { asset_code?: string; asset_issuer?: string; limit?: string };
    return {
      isNative: false,
      assetCode: row.asset_code ?? b.asset_type,
      issuer: row.asset_issuer,
      balance: b.balance,
      limit: row.limit,
    };
  });

  const nativeBalance = balances.find((b) => b.isNative)?.balance ?? "0";
  const sponsoring = account.num_sponsoring ?? 0;
  const sponsored = account.num_sponsored ?? 0;
  const entries = BASE_ENTRIES + account.subentry_count + sponsoring - sponsored;
  const reserve = Math.max(entries, BASE_ENTRIES) * BASE_RESERVE_XLM;
  const spendable = Math.max(Number(nativeBalance) - reserve, 0);

  return {
    address,
    sequence: account.sequence,
    subentryCount: account.subentry_count,
    sponsoringCount: sponsoring,
    sponsoredCount: sponsored,
    minimumReserve: reserve.toFixed(1),
    nativeBalance,
    spendable: spendable.toFixed(7),
    balances,
    signers: account.signers.map((s) => ({
      key: s.key,
      weight: s.weight,
      type: s.type,
    })),
    thresholds: {
      low: account.thresholds.low_threshold,
      med: account.thresholds.med_threshold,
      high: account.thresholds.high_threshold,
    },
    homeDomain: account.home_domain,
  };
}
