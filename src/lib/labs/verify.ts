import "server-only";

import { createHash } from "node:crypto";
import {
  Address,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  rpc,
  scValToNative,
} from "@stellar/stellar-sdk";
import { TESTNET } from "@/lib/stellar/network";
import type { VerifySpec } from "@/content/labs/types";

// Server-side, on-chain verification of a lab run. The client claims nothing:
// completion XP is granted only after these checks pass against public
// testnet endpoints for the presented address. Verification happens at claim
// time — a later testnet reset never retro-invalidates stored completions.

interface HorizonAccount {
  balances?: Array<{
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
  }>;
  signers?: Array<{ key: string; weight: number }>;
  thresholds?: {
    low_threshold: number;
    med_threshold: number;
    high_threshold: number;
  };
}

interface HorizonOperationsPage {
  _embedded?: {
    records?: Array<{ type: string; source_account?: string }>;
  };
}

interface HorizonPaymentsPage {
  _embedded?: {
    records?: Array<{ type: string; from?: string }>;
  };
}

async function horizonJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${TESTNET.horizonUrl}${path}`, {
    // Always read the live chain — a cached miss would eat a real completion.
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`horizon ${res.status}`);
  return (await res.json()) as T;
}

async function fetchAccount(address: string): Promise<HorizonAccount | null> {
  return horizonJson<HorizonAccount>(
    `/accounts/${encodeURIComponent(address)}`,
  );
}

export interface VerifyOutcome {
  passed: boolean;
  failed: string[];
}

// Simulate `func(address)` on the contract and check the result is > 0.
// The contractId is client-provided, but a positive token balance for the
// claimant's own address on a real deployed contract is exactly the deed
// being verified — same trust shape as the Horizon transaction checks.
async function tokenBalancePositive(
  address: string,
  contractId: string,
  func: string,
): Promise<boolean> {
  try {
    const server = new rpc.Server(TESTNET.rpcUrl);
    const account = await server.getAccount(address);
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: TESTNET.passphrase,
    })
      .addOperation(
        new Contract(contractId).call(func, new Address(address).toScVal()),
      )
      .setTimeout(60)
      .build();
    const sim = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(sim)) return false;
    const retval = (sim as rpc.Api.SimulateTransactionSuccessResponse).result?.retval;
    if (!retval) return false;
    const value = scValToNative(retval) as bigint | number;
    return BigInt(value) > BigInt(0);
  } catch {
    return false;
  }
}

async function smartAccountCodeMatches(
  contractId: string,
  expectedWasmHash: string,
): Promise<boolean> {
  try {
    const server = new rpc.Server(TESTNET.rpcUrl);
    const wasm = await server.getContractWasmByContractId(contractId);
    const actual = createHash("sha256").update(wasm).digest("hex");
    return actual === expectedWasmHash.toLowerCase();
  } catch {
    return false;
  }
}

async function smartAccountNativeBalancePositive(
  contractId: string,
  nativeTokenContract: string,
): Promise<boolean> {
  try {
    const server = new rpc.Server(TESTNET.rpcUrl);
    const { result } = await server.queryContract<bigint>(
      nativeTokenContract,
      "balance",
      { id: contractId },
      TESTNET.passphrase,
    );
    return BigInt(result) > BigInt(0);
  } catch {
    return false;
  }
}

export async function verifyOnChain(
  address: string,
  specs: VerifySpec[],
  artifacts?: { contractId?: string },
): Promise<VerifyOutcome> {
  const failed: string[] = [];
  const account = await fetchAccount(address);

  for (const spec of specs) {
    switch (spec.check) {
      case "account-exists": {
        if (!account) failed.push(spec.check);
        break;
      }
      case "trustline": {
        const ok = account?.balances?.some(
          (b) =>
            b.asset_code === spec.assetCode &&
            b.asset_issuer === spec.assetIssuer,
        );
        if (!ok) failed.push(spec.check);
        break;
      }
      case "payment-sent": {
        const page = await horizonJson<HorizonPaymentsPage>(
          `/accounts/${encodeURIComponent(address)}/payments?order=desc&limit=100`,
        );
        const ok = page?._embedded?.records?.some(
          (r) => r.type === "payment" && r.from === address,
        );
        if (!ok) failed.push(spec.check);
        break;
      }
      case "claimable-balance-created": {
        const page = await horizonJson<HorizonOperationsPage>(
          `/accounts/${encodeURIComponent(address)}/operations?order=desc&limit=100`,
        );
        const ok = page?._embedded?.records?.some(
          (r) => r.type === "create_claimable_balance",
        );
        if (!ok) failed.push(spec.check);
        break;
      }
      case "account-thresholds": {
        // The signer count and the threshold together are the deed: either
        // alone is meaningless (a second signer at weight 0 changes nothing,
        // and a raised threshold with one signer just locks you out).
        const signers = account?.signers?.length ?? 0;
        const med = account?.thresholds?.med_threshold ?? 0;
        if (signers < spec.minSigners || med < spec.minMedThreshold) {
          failed.push(spec.check);
        }
        break;
      }
      case "token-balance-positive": {
        const contractId = artifacts?.contractId;
        const ok =
          !!contractId &&
          (await tokenBalancePositive(address, contractId, spec.func));
        if (!ok) failed.push(spec.check);
        break;
      }
      case "smart-account-code": {
        const contractId = artifacts?.contractId;
        const ok =
          !!contractId &&
          (await smartAccountCodeMatches(contractId, spec.wasmHash));
        if (!ok) failed.push(spec.check);
        break;
      }
      case "smart-account-native-balance": {
        const contractId = artifacts?.contractId;
        const ok =
          !!contractId &&
          (await smartAccountNativeBalancePositive(
            contractId,
            spec.nativeTokenContract,
          ));
        if (!ok) failed.push(spec.check);
        break;
      }
    }
  }

  return { passed: failed.length === 0, failed };
}
