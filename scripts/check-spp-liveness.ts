// Liveness check for the curated testnet contracts the Forge links to.
//
// Soroban state has a TTL. The Stellar Private Payments preview the Explore
// panel points at was deployed without any TTL extension, and a write does not
// bump it — so those contracts archive on a known day, after which every read
// fails and the panel has nothing to show. Content referencing them then goes
// quietly wrong, which is the worst way for content to be wrong.
//
// This is deliberately NOT part of `npm run build`: a third party's testnet
// deployment going away must never break our build. Run it before shipping
// anything that leans on those contracts, or on a schedule, and treat a
// failure as "go update the copy", not "go fix the code".
//
//   npm run check:spp

import { xdr } from "@stellar/stellar-sdk";
import { rpc } from "@stellar/stellar-sdk";
import { KNOWN_CONTRACTS } from "../src/lib/stellar/known-contracts";

const RPC_URL = "https://soroban-testnet.stellar.org";
/** Testnet closes a ledger roughly every 5 seconds. */
const SECONDS_PER_LEDGER = 5;

async function main() {
  const server = new rpc.Server(RPC_URL);
  const { sequence: latest } = await server.getLatestLedger();
  console.log(`testnet latestLedger ${latest}\n`);

  let dead = 0;
  let expiringSoon = 0;

  for (const known of KNOWN_CONTRACTS) {
    const short = `${known.id.slice(0, 6)}…${known.id.slice(-4)}`;
    try {
      const entry = await server.getContractData(
        known.id,
        xdr.ScVal.scvLedgerKeyContractInstance(),
      );
      const until = entry.liveUntilLedgerSeq;
      if (until === undefined) {
        console.log(`  ok       ${known.slug.padEnd(22)} ${short}  (no TTL reported)`);
        continue;
      }
      const days = ((until - latest) * SECONDS_PER_LEDGER) / 86_400;
      const when = new Date(Date.now() + (until - latest) * SECONDS_PER_LEDGER * 1000)
        .toISOString()
        .slice(0, 10);
      const label = days < 14 ? "EXPIRING" : "ok      ";
      if (days < 14) expiringSoon++;
      console.log(
        `  ${label} ${known.slug.padEnd(22)} ${short}  ${days.toFixed(1)} days left (~${when})` +
          (known.archivesOn && known.archivesOn !== when
            ? `  ← registry says ${known.archivesOn}, UPDATE IT`
            : ""),
      );
    } catch (e) {
      dead++;
      console.log(
        `  ARCHIVED ${known.slug.padEnd(22)} ${short}  ${
          e instanceof Error ? e.message.slice(0, 60) : "unreachable"
        }`,
      );
    }
  }

  console.log();
  if (dead > 0) {
    console.error(
      `${dead} of ${KNOWN_CONTRACTS.length} contracts are gone. The Explore presets and the ` +
        `Veiled Ledger chapter's hands-on step both point at them — update the copy or drop the presets.`,
    );
    process.exit(1);
  }
  if (expiringSoon > 0) {
    console.warn(`${expiringSoon} contract(s) expire within two weeks. Plan the copy change now.`);
  }
  console.log(`all ${KNOWN_CONTRACTS.length} curated contracts are live.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
