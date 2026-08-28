import "server-only";

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

export async function verifyOnChain(
  address: string,
  specs: VerifySpec[],
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
    }
  }

  return { passed: failed.length === 0, failed };
}
