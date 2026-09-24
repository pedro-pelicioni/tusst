// Contracts on public testnet that the Forge knows by name.
//
// Two jobs, and the second one matters more than the first.
//
// It gives a learner somewhere to go before they own a deployment — the
// Explore panel is otherwise an empty box asking for 56 characters nobody
// has yet.
//
// And it carries what a contract's own spec cannot say. A spec loaded from
// the chain is a SELF-DESCRIPTION, and a self-description can mislead
// without lying. The Stellar Private Payments pool exports five token-shaped
// stubs left over from a MockToken: `balance(anyone)` answers 0, forever,
// with no error and no hint that it is a stub. A learner who had just
// deposited into that pool would read their own balance as zero and conclude
// the money was gone. Naming the decoys here is cheaper, and far more honest,
// than a heuristic that guesses from argument counts.
//
// Everything listed here is READ-ONLY material: none of these entries invites
// a signature. That is deliberate — the panel exists so people can look.

/** Keys of m.ide.known.entries — kept a union so the label lookup typechecks. */
export type KnownContractSlug =
  | "sppPoolXlm"
  | "sppPoolEurc"
  | "sppRegistry"
  | "sppAspMembership"
  | "sppAspNonMembership";

export interface KnownContract {
  id: string;
  /** key into m.ide.known.entries — the label is translated */
  slug: KnownContractSlug;
  /** functions that exist on-chain but do not mean what their names imply */
  decoys?: string[];
}

/**
 * Stellar Private Payments — Nethermind's privacy-pool developer preview.
 * Addresses from the project's own deployments/testnet/deployments.json,
 * each confirmed live on testnet RPC on 2026-08-29.
 *
 * No archive date lives here. One did (2026-09-02, read off the TTLs at the
 * time), the TTLs were extended, and every SPP contract kept showing an
 * "expired" banner while live until ~ledger 7.7M. The workbench now asks the
 * chain when a contract is loaded — see liveness.ts.
 */
export const KNOWN_CONTRACTS: readonly KnownContract[] = [
  {
    id: "CD2W5LURL6GXAJTZVADMRVZPXIZTTPJH5TBMMQ5G4A6XPCMUJ2OHXZ4L",
    slug: "sppPoolXlm",
    // The MockToken leak. All five answer, none of them mean anything.
    decoys: ["balance", "allowance", "approve", "transfer", "transfer_from"],
  },
  {
    id: "CBMRWHTPWJ73LAAPMZQ3Z3CIPD2N5NIBVTPQBG7I7ZEMMHWUHQLFNUVS",
    slug: "sppPoolEurc",
    decoys: ["balance", "allowance", "approve", "transfer", "transfer_from"],
  },
  {
    id: "CBLPKFROCJVAD33GEYNIJJSTHTBGEXQSWIUMUJZ3BRB4AO5A7RY5Z7EA",
    slug: "sppRegistry",
  },
  {
    id: "CBND3Z65TUMIUEZJ733RF3BFQFLRRESLOWTE2JCXE7FICECCXOD6DJSR",
    slug: "sppAspMembership",
  },
  {
    id: "CDSTXVEJMU3CYE667W5Q7HWKASFOR7ADXWPC5UG4ZP3KFMNUHJRREIO2",
    slug: "sppAspNonMembership",
  },
];

export function lookupKnownContract(id: string): KnownContract | undefined {
  const trimmed = id.trim();
  return KNOWN_CONTRACTS.find((c) => c.id === trimmed);
}
