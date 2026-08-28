import type { Concept } from "../types";

// Chapter V (craft) — harness engineering: the model is rented, the harness is
// yours. Anatomy of a harness, verification over trust, least-privilege tools,
// designed failure paths — and TUSST's own graded runner unmasked as a
// verification harness the learner has been inside all along.

export const tamingTheGolem: Concept = {
  meta: {
    slug: "taming-the-golem",
    title: "Taming the Golem",
    tagline: "Harness engineering: give the AI a bench, not a wish.",
    numeral: "V",
    arc: "craft",
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/taming-the-golem.webp",
    glyph: "🗿",
  },
  steps: [
    {
      kind: "theory",
      body: `## A mind in a void

Strip everything away and an LLM does exactly one thing: **text in, text out**. It cannot run code, read your repo, or check the chain. Alone, it is a mind in a void — brilliant, blind, and unarmed.

Everything that turns that mind into a *worker* is the **harness**: the tools it may call, the files it may touch, the sandbox that contains it, the verifiers that judge its output.

And here is the part most people miss: the model is rented. **The harness is engineering — and it is yours.**`,
    },
    {
      kind: "theory",
      body: `## Anatomy of a harness

A working harness has named parts:

- **Model** — the mind.
- **Tool set** — what it can *do*: run tests, edit files, query a Stellar RPC.
- **Permissions** — what it may touch, and what it may not.
- **Working directory** — the world it sees.
- **Test runner** — the judge its output must face.
- **Reviewer step** — where a human (or another golem) inspects the diff.

Two teams with the same model and different harnesses get *wildly* different results. When output quality shifts, engineers debug the harness — not the horoscope.`,
    },
    {
      kind: "quiz",
      question: `Same model, same kind of task — but this month's results are far worse than last month's. Where does a harness engineer look first?`,
      options: [
        "At what surrounds the model — the context it was given, the tools it could run, the checks gating its output",
        "At the model's weights — they wear down under heavy use, like machinery",
        "Nowhere — sampling randomness explains any swing, so nothing is actionable",
      ],
      answer: 0,
      explain: `Weights don't wear, and randomness rarely explains a sustained drop. Harness parts drift constantly — a moved file, a silenced test runner, a widened permission — and every one of them is inspectable, diffable, and fixable. That's why owning the harness matters.`,
    },
    {
      kind: "theory",
      body: `## Verification beats trust

The golem's most dangerous trait isn't ignorance — it's **confidence while wrong**. It announces success in the same warm tone whether the deploy worked or never happened. Confidence is *style*, not signal.

So a harness never trusts; it **re-checks**, using judges that can't be sweet-talked:

- the **compiler** — does it even build?
- the **test suite** — your trials from the Rite, red or green
- the **linter** — did the standards hold?
- the **chain itself** — does the ledger say what the golem says?

Claims are data. Verifiers are truth.`,
    },
    {
      kind: "quiz",
      question: `The golem reports: "Contract deployed and initialized successfully." What does a well-built harness do with that sentence?`,
      options: [
        "Treats it as a claim — reads the chain, fetches the contract, calls a view function, and believes the ledger",
        "Accepts it — models are trained to be truthful, and this one has been reliable so far",
        "Asks the golem to carefully double-check its own work in the same session",
      ],
      answer: 0,
      explain: `Self-review by the same mind shares the same blind spots — if it believed the deploy worked, it will believe it again. Independent verifiers don't share anyone's blind spots, and on Stellar an RPC read costs milliseconds. The ledger is the cheapest lie detector you will ever own.`,
    },
    {
      kind: "theory",
      body: `## Least privilege: fewer teeth, please

A golem with \`rm -rf\` available is a golem that will *eventually* run it — not out of malice, but out of a confident wrong plan at 2 a.m. The remedy is old and proven: **least privilege**.

- Grant tools for *this task*, not tools in general.
- Prefer **read-only** access wherever writing isn't the job.
- Scope it to one directory; sandbox anything that executes.
- Hand it **testnet keys only** — never a key whose loss would actually hurt.

Power granted "just in case" is how incidents start. Every tool is a blast radius; grant accordingly.`,
    },
    {
      kind: "fill",
      prompt: `Scope the golem's power before it starts work:`,
      file: "harness.toml",
      before: `signing_keys = "`,
      after: `"`,
      choices: ["testnet", "mainnet", "all-networks", "treasury"],
      answer: 0,
      explain: `The rule of thumb: a golem holds only keys whose total loss you can shrug at. Testnet lumens are free from friendbot; a mainnet or treasury key inside an automated loop is an incident with a countdown on it.`,
    },
    {
      kind: "theory",
      body: `## Design the failure path

Amateurs design what happens when the golem is *right*. Engineers design what happens when it's **wrong** — because sometimes it will be.

- A failed check **blocks the merge**; it doesn't log a warning into the void.
- Retries have a **budget**, so a stuck golem becomes a stopped golem, not a bill.
- A human reviews **a diff with context**, never a fait accompli already in production.
- Rollback is a tested path, not a prayer.

For every step of the harness, ask one question: *"when this is wrong, what catches it?"* If the answer is "hopefully nothing goes wrong" — that's a wish, not a design.`,
    },
    {
      kind: "quiz",
      question: `Which of these is a **designed** failure path?`,
      options: [
        "A red test suite blocks the auto-merge, and a human receives the diff plus the failing output",
        "The prompt firmly instructs the golem to be extremely careful and to double-check everything",
        "The loop retries the same task, without limit, until the output finally passes",
      ],
      answer: 0,
      explain: `Instructions are hopes — useful, but nothing *catches* anything. Unlimited retries are a bill with no ceiling (a later chapter names the fix). A designed path has a tripwire, a stop, and a human with enough context to act.`,
    },
    {
      kind: "theory",
      body: `## You've been inside one all along

Look around: **TUSST is a harness.**

The Forge's graded runner is a verification harness — your solution executes in a sandbox, hidden trials judge it, and no amount of confident prose turns a red into a green. The on-chain labs go further: they don't ask *whether you say* you deployed — they **read the chain** and check.

That's the discipline in one image: build the bench so that being wrong is *detectable* and being right is *provable* — for golems and for humans.

Next discipline: the words themselves — what the golem actually sees on the bench.`,
    },
  ],
};
