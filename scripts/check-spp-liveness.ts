// Liveness check for the curated testnet contracts the Forge links to.
//
// Soroban state has a TTL, and the Stellar Private Payments preview the
// Explore panel points at is a third party's deployment: its TTL moves when
// they extend it, not when we ship. Since Protocol 23 an archived contract is
// not gone — reads still answer from simulation and the next write restores
// it first — so archival is a warning here. A contract whose instance entry has
// disappeared entirely is the real failure: the presets and the hands-on step
// in The Spine Beneath the Veil would then point at nothing.
//
// This is deliberately NOT part of `npm run build`: a third party's testnet
// deployment going away must never break our build. Run it before shipping
// anything that leans on those contracts, or on a schedule, and treat a
// failure as "go update the copy", not "go fix the code".
//
//   npm run check:spp

import { KNOWN_CONTRACTS } from "../src/lib/stellar/known-contracts";
import {
  SECONDS_PER_LEDGER,
  archiveStatus,
  fetchContractLiveness,
} from "../src/lib/stellar/liveness";

async function main() {
  let gone = 0;
  let unchecked = 0;
  let archived = 0;
  let expiringSoon = 0;

  for (const known of KNOWN_CONTRACTS) {
    const short = `${known.id.slice(0, 6)}…${known.id.slice(-4)}`;
    const name = known.slug.padEnd(22);
    try {
      const live = await fetchContractLiveness(known.id);
      if (!live) {
        gone++;
        console.log(`  GONE     ${name} ${short}  no instance entry`);
        continue;
      }
      const status = archiveStatus(live);
      if (status === "archived") {
        archived++;
        console.log(`  ARCHIVED ${name} ${short}  restorable; reads answer from simulation`);
        continue;
      }
      if (status === "soon") expiringSoon++;
      const days =
        ((live.liveUntilLedger - live.latestLedger) * SECONDS_PER_LEDGER) / 86_400;
      console.log(
        `  ${status === "soon" ? "EXPIRING" : "ok      "} ${name} ${short}  ` +
          `live until ledger ${live.liveUntilLedger}, ~${days.toFixed(0)} days ` +
          `(~${live.approxArchiveAt.toISOString().slice(0, 10)})`,
      );
    } catch (e) {
      // An RPC hiccup says nothing about the contract — don't call it gone.
      unchecked++;
      console.log(
        `  UNCHECKED ${name} ${short}  ${e instanceof Error ? e.message.slice(0, 60) : "unreachable"}`,
      );
    }
  }

  console.log();
  if (gone > 0) {
    console.error(
      `${gone} of ${KNOWN_CONTRACTS.length} contracts could not be found. The Explore presets and ` +
        `The Spine Beneath the Veil's hands-on step point at them — update the copy or drop the presets.`,
    );
    process.exit(1);
  }
  if (unchecked > 0) {
    console.error(`${unchecked} contract(s) could not be checked — the RPC failed. Run it again.`);
    process.exit(1);
  }
  if (archived > 0) {
    console.warn(`${archived} contract(s) are archived: still readable; the next write pays to restore them.`);
  }
  if (expiringSoon > 0) {
    console.warn(`${expiringSoon} contract(s) archive within 3 days.`);
  }
  console.log(`all ${KNOWN_CONTRACTS.length} curated contracts exist on testnet.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
