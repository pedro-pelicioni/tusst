// Strings for the bespoke lesson simulators. Typed against ../en like every
// other UI module, so a missing key is a build error in all four locales.
export const visuals = {
  ledgerTamper: {
    title: "A chained ledger",
    hint: "Change any page. Every page after it stops matching — which is the whole of \"you cannot rewrite history quietly\".",
    pageLabel: "page {n}",
    prevLabel: "carries from the previous page",
    ownLabel: "this page's fingerprint",
    ok: "matches",
    broken: "does not match",
    reset: "restore the original pages",
    aria: "An editable chain of four ledger pages",
    pages: ["Ana owes 3.", "Bruno owes 5.", "Ana paid 3 back.", "Bruno owes 2 more."],
  },
  seal: {
    title: "Sign and verify",
    hint: "The seal is illustrative, not Ed25519 — but it breaks exactly the way a real signature does.",
    messageLabel: "message",
    messagePlaceholder: "send 10 to Bruno",
    keyLabel: "secret key (kept in this page)",
    sealLabel: "seal",
    sign: "seal it",
    valid: "the seal matches this message",
    invalid: "the seal does not match this message",
    none: "// write a message, then seal it",
    reset: "start over",
  },
};
