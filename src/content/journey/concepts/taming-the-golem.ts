import type { Concept } from "../types";

// Craft VII — what a harness IS, and the one habit that makes it worth
// having: never believe the claim, re-check it. Least privilege and failure
// paths are Craft VIII, because "how to give the golem hands" and "what
// catches it when those hands are wrong" are separate lessons, and only the
// second one is the one that gets skipped.

export const tamingTheGolem: Concept = {
  meta: {
    slug: "taming-the-golem",
    title: "Taming the Golem",
    tagline: "Harness engineering: the model is rented, the harness is yours.",
    numeral: "VII",
    arc: "craft",
    level: 2,
    requires: ["the-keeps-own-doors"],
    status: "live",
    estMinutes: 11,
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
      kind: "diagram",
      body: "A harness, in four parts:",
      caption: "Swap the model and this survives. That is why the harness is the asset, not the prompt.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "context",
            label: "what it can see",
            note: "The files, the docs, the failing output. Curated — not everything you own.",
            tone: "accent",
          },
          {
            id: "tools",
            label: "what it can do",
            note: "A bounded set of verbs. Every one it lacks is a mistake it cannot make.",
            tone: "teal",
          },
          {
            id: "run",
            label: "let it act",
            note: "It moves, and the bench answers honestly instead of agreeing politely.",
            tone: "neutral",
          },
          {
            id: "verify",
            label: "check the work",
            note: "Tests, types, a linter. Verification is what turns output into a result.",
            tone: "good",
          },
        ],
      },
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
      kind: "fill",
      prompt: `Complete the harness engineer's first move:`,
      file: "NOTES.md",
      before: `The golem says the deploy succeeded. Before that sentence changes anything, the harness `,
      after: ` .`,
      choices: [
        "reads the chain and checks",
        "asks the golem to confirm it",
        "records the claim in the run log",
        "retries the deploy to be safe",
      ],
      answer: 0,
      explain: `Asking the same mind to confirm its own work buys you the same blind spot twice. And a claim written to a log is still a claim — it just looks official now. On Stellar the check costs one RPC read, which makes the ledger the cheapest lie detector you will ever own.`,
    },
    {
      kind: "labLink",
      labSlug: "guild-vault",
      body: `You can stand inside a verification harness right now. The Forge's **Guild Vault** lab has you raise an account's signing threshold so a treasury needs two officers — and then it does not take your word for it. The server reads the ledger and checks the signer set itself. Saying you did it is not the check; the chain is.`,
    },
    {
      kind: "theory",
      body: `## The half that gets skipped

You can now name the parts of a harness and, more importantly, refuse to believe anything the golem says about its own work.

Everything so far has been about giving it **hands** — tools, a directory, a runner. Nothing so far has asked the harder question: which hands, exactly, and what happens on the day it uses them on a confidently wrong plan.

**Next:** how much power the work actually needs, and the one question to ask of every step you build.`,
    },
  ],
  testOut: [
    {
      question: `What is the harness, and why does it matter more than the prompt?`,
      options: [
        "Everything around the model — tools, permissions, working directory, verifiers. The model is rented; the harness is yours and survives a model swap",
        "The system prompt and its instructions, which is where behavior is actually set",
        "The provider's infrastructure, which determines latency and throughput",
      ],
      answer: 0,
    },
    {
      question: `Same model, same tasks, and this month's output is far worse. Where does a harness engineer look first?`,
      options: [
        "At what surrounds the model — the context given, the tools available, the checks gating the output",
        "At the weights, which degrade under sustained load",
        "Nowhere — sampling randomness explains any swing",
      ],
      answer: 0,
    },
    {
      question: `What is the golem's most dangerous trait?`,
      options: [
        "Confidence while wrong — it reports success in the same warm tone whether or not anything happened",
        "Ignorance — there are things it has simply never seen",
        "Slowness on long tasks, which tempts people to skip review",
      ],
      answer: 0,
    },
    {
      question: `\"Contract deployed and initialized successfully.\" What does a good harness do with that sentence?`,
      options: [
        "Treats it as a claim, reads the chain, calls a view function, and believes the ledger",
        "Accepts it — the model has been reliable so far",
        "Asks the golem to double-check its own work in the same session",
      ],
      answer: 0,
    },
  ],
};
