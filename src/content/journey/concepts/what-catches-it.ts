import type { Concept } from "../types";

// Craft VIII — least privilege and designed failure paths, split out of
// Taming the Golem. The widget is the payload: capability and blast radius
// are two different meters, and the grants people add "just in case" are
// exactly the ones that move only the second.

export const whatCatchesIt: Concept = {
  meta: {
    slug: "what-catches-it",
    title: "What Catches It",
    tagline: "Least privilege & failure paths: every tool is a blast radius.",
    numeral: "VIII",
    arc: "craft",
    level: 2,
    requires: ["taming-the-golem"],
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/what-catches-it.webp",
    glyph: "🪤",
  },
  steps: [
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
      kind: "widget",
      component: "blast-radius",
      body: `Two meters, and they do not move together. **Grant the golem what a fix-and-prove task needs**, then keep adding — and watch which bar responds.`,
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
      body: `## The grant nobody remembers making

Over-granting is rarely a decision. It is a Tuesday afternoon.

The golem needs to check a balance, so it gets network access — narrowly, for that. A week later it needs to install a dependency, so the network stays open. Someone is debugging a mainnet issue and drops a real key into the environment "just for this run", and nobody removes it, because removing it is a task and nothing is currently broken.

Now go back and ask the question the harness exists to answer: *when this is wrong, what catches it?* An open network plus a real key plus a confidently wrong plan is not a hypothetical risk profile. It is three ordinary Tuesdays, stacked.

The audit is cheap and nobody runs it: **list what the golem holds today, and for each one, name the task that needed it.** Anything without a name in that column is a grant nobody remembers making.`,
    },
    {
      kind: "quiz",
      question: `You add open network access and write-anywhere to a golem that already reads the repo, runs tests, writes in one directory and holds testnet keys. What did those two grants buy?`,
      options: [
        "Almost no new capability, and a large jump in blast radius",
        "A large jump in both — that is the trade you accepted",
        "Mostly capability, since network access unlocks nearly every task",
      ],
      answer: 0,
      explain: `This is the shape worth internalizing: capability saturates early and blast radius does not. The first few grants do nearly all the useful work, which means the ones added "just in case" are almost always pure exposure. Grant for the task in front of you, not for the task you might imagine later.`,
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
      kind: "diagram",
      body: "A wish and a designed path, side by side:",
      caption:
        "Both look like caution in a code review. Only one of them does anything on the day it matters.",
      view: {
        kind: "compare",
        columns: [
          { id: "wish", label: "a wish", tone: "bad" },
          { id: "designed", label: "a designed path", tone: "good" },
        ],
        rows: [
          {
            label: "what it is",
            cells: [
              { text: "\"be careful and double-check\"", tone: "bad" },
              { text: "a red suite that blocks the merge", tone: "good" },
            ],
          },
          {
            label: "when the golem is wrong",
            cells: [
              { text: "it proceeds, confidently", tone: "bad" },
              { text: "it stops at the tripwire", tone: "good" },
            ],
          },
          {
            label: "who finds out",
            cells: [
              { text: "whoever hits the bug", tone: "bad" },
              { text: "a human, with the diff and the failure", tone: "good" },
            ],
          },
          {
            label: "when",
            cells: [
              { text: "in production, later", tone: "bad" },
              { text: "before anything merges", tone: "good" },
            ],
          },
        ],
      },
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

**Next:** the words themselves — what the golem actually sees on the bench.`,
    },
  ],
  testOut: [
    {
      question: `Why grant testnet keys rather than mainnet ones to an automated loop?`,
      options: [
        "A golem should hold only keys whose total loss you can shrug at — friendbot lumens are free, a treasury key is an incident with a countdown",
        "Mainnet keys are rejected by most SDKs in automated contexts",
        "Testnet transactions are faster, so the loop iterates sooner",
      ],
      answer: 0,
    },
    {
      question: `Which of these is a designed failure path?`,
      options: [
        "A red suite blocks the auto-merge, and a human receives the diff plus the failing output",
        "The prompt firmly instructs the golem to be careful and double-check everything",
        "The loop retries the same task without limit until something passes",
      ],
      answer: 0,
    },
    {
      question: `What is the one question to ask of every step in a harness?`,
      options: [
        "When this is wrong, what catches it?",
        "How often does this step fail in practice?",
        "Can this step be made faster or cheaper?",
      ],
      answer: 0,
    },
    {
      question: `You grant the golem open network access and a directory it can write to anywhere. What did that actually buy?`,
      options: [
        "Almost no extra capability, and a large amount of blast radius — the classic shape of a \"just in case\" grant",
        "Roughly proportional gains in both capability and risk",
        "More capability than risk, since most tasks eventually need both",
      ],
      answer: 0,
    },
  ],
};
