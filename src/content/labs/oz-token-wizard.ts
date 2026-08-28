import type { LabScenario } from "./types";
import { generateOzTokenFiles } from "./oz-token-files";

// Lab — "OpenZeppelin Token Wizard". The Forge's flagship technical lab:
// choose extensions, watch REAL Rust get assembled from OpenZeppelin's
// audited building blocks, compile it in the Forge's sandboxed runner,
// deploy the wasm to testnet with your own signature, and mint. Everything
// the IDE does free-form, guided — and the deployed contract shows up in
// the IDE's Interact panel afterward (shared deployments store).

export const ozTokenWizard: LabScenario = {
  meta: {
    slug: "oz-token-wizard",
    title: "OpenZeppelin Token Wizard",
    tagline: "Pick extensions, forge real Rust, deploy your own token.",
    difficulty: "adept",
    estMinutes: 15,
    status: "live",
    emblem: "/v2/labs/emblems/oz-token-wizard.webp",
    glyph: "⚒",
  },
  steps: [
    {
      kind: "narrate",
      id: "intro",
      body: `## Don't forge alone

Real smiths don't smelt their own iron for every blade. On Stellar, token contracts are forged from **OpenZeppelin's audited building blocks** — the same battle-tested libraries that secure billions across chains, ported to Soroban as \`stellar-tokens\`.

In the next few minutes you will **choose your extensions**, watch the Forge assemble **real Rust** from them, **compile it** in a sandboxed runner, **deploy the Wasm** to testnet under your own signature, and **mint** your first supply.

No mockups. The same pipeline the free-mode IDE uses.`,
    },
    {
      kind: "action",
      id: "sigil",
      title: "Summon your sigil",
      body: `Deploying costs a signature, and a signature needs your keypair. If you forged one in the wallet lab, the Forge summons it; if not, a fresh one is struck now.`,
      cta: "Summon the keypair",
      action: { type: "generate-keypair", target: "wallet" },
      successBody: `Your sigil answers:

\`{address}\`

Every transaction ahead — the deploy, the mint — will carry this signature.`,
    },
    {
      kind: "action",
      id: "fund",
      title: "Stoke the account",
      body: `Deploys and invocations pay small resource fees, so the account must be alive and funded. Friendbot tops it up — and if it's already funded, he simply nods.`,
      cta: "Stoke it (Friendbot)",
      action: { type: "friendbot" },
      successBody: `The account breathes — {balance} XLM at the ready. Fuel enough for a thousand deploys.`,
    },
    {
      kind: "input",
      id: "name",
      prompt: `## Name your creation

The token's **name** is human-facing metadata, stored on-chain at construction — wallets and explorers will show it.`,
      stateKey: "tokenName",
      placeholder: "Forge Gold",
      pattern: "^.{2,24}$",
      maxLength: 24,
      hint: "2–24 characters",
    },
    {
      kind: "input",
      id: "symbol",
      prompt: `## Give it a symbol

The short ticker — what shows in balances and trade pairs.`,
      stateKey: "tokenSymbol",
      placeholder: "FGOLD",
      pattern: "^[A-Za-z][A-Za-z0-9]{1,11}$",
      maxLength: 12,
      hint: "2–12 letters/digits, starts with a letter",
    },
    {
      kind: "input",
      id: "supply",
      prompt: `## Set the initial supply

Minted to **you** at construction, in whole tokens. Your token uses **7 decimals** — the Stellar convention — so the contract stores your number × 10⁷ under the hood.`,
      stateKey: "tokenSupply",
      placeholder: "1000",
      pattern: "^[1-9][0-9]{0,8}$",
      maxLength: 9,
      hint: "1 to 999,999,999 whole tokens",
    },
    {
      kind: "choice",
      id: "ext-pausable",
      prompt: `## Extension: Pausable?

A **pausable** token has an emergency brake: the owner can freeze transfers and mints while an incident is investigated, then unpause. Regulated issuers almost always want it; a meme coin may prefer the purity of no brakes.`,
      stateKey: "extPausable",
      options: [
        {
          label: "Yes — add the emergency brake",
          value: "yes",
          blurb: "Owner can pause/unpause every transfer, mint and burn.",
        },
        {
          label: "No — unstoppable by design",
          value: "no",
          blurb: "No pause switch exists. Nobody can freeze it, including you.",
        },
      ],
    },
    {
      kind: "choice",
      id: "ext-burnable",
      prompt: `## Extension: Burnable?

A **burnable** token lets holders destroy their own units, shrinking total supply — useful for redemption flows ("burn the voucher, receive the goods") and deflationary designs.`,
      stateKey: "extBurnable",
      options: [
        {
          label: "Yes — holders may burn",
          value: "yes",
          blurb: "Adds burn and burn_from from OpenZeppelin's burnable extension.",
        },
        {
          label: "No — supply only grows",
          value: "no",
          blurb: "No burn entrypoints are compiled in at all.",
        },
      ],
    },
    {
      kind: "quiz",
      id: "quiz-oz",
      question: `Why does the wizard assemble your token from OpenZeppelin's blocks instead of writing fresh Rust from scratch?`,
      options: [
        "Audited, widely-reviewed code with a standard interface beats novel code for the parts every token shares",
        "Writing a token from scratch is impossible in Rust",
        "OpenZeppelin contracts are the only code the Stellar network will accept",
      ],
      answer: 0,
      explain: `The network runs any valid Wasm — but token logic is exactly where a subtle bug costs real money, and where standards (SEP-41) make your token legible to every wallet and DEX. Novelty is for your product, not your token plumbing.`,
    },
    {
      kind: "action",
      id: "build",
      title: "Forge the Rust & compile",
      body: `The Forge now assembles **{name} ({symbol})** from your choices — real \`stellar-tokens\` Rust, pinned to the same audited versions the IDE uses — and compiles it to **WebAssembly** in a sandboxed runner. A real compile takes a minute or two; watch it work.`,
      cta: "Compile to Wasm",
      action: {
        type: "contract-build",
        files: (ctx) =>
          generateOzTokenFiles({
            pausable: ctx.state.extPausable === "yes",
            burnable: ctx.state.extBurnable === "yes",
          }),
      },
      successBody: `The runner returns your contract as a **Wasm blob** — Rust melted down and recast for the ledger's virtual machine.

Note what did NOT happen: your name, symbol and supply are not baked into the code. They travel as **constructor arguments** in the next step, so the same verified Wasm could birth a thousand different tokens.`,
    },
    {
      kind: "action",
      id: "deploy",
      title: "Deploy to the testnet",
      body: `Two transactions, both signed by you: first the Wasm is **uploaded** to the ledger, then a **contract instance** is created from it — and its \`__constructor\` runs once with your name, symbol, and supply, minting everything to your address.`,
      cta: "Deploy & run the constructor",
      action: {
        type: "contract-deploy",
        argsFrom: (ctx) => ({
          name: ctx.state.tokenName,
          symbol: ctx.state.tokenSymbol,
          owner: ctx.walletAddress ?? "",
          initial_supply: `${ctx.state.tokenSupply}0000000`,
        }),
      },
      successBody: `**{symbol} lives.** Contract address:

\`{contract}\`

That address now answers SEP-41 calls — \`balance\`, \`transfer\`, \`name\` — for any wallet, explorer, or contract that asks. It also just appeared in the Forge IDE's **Interact** panel: same forge, same deployments.`,
      explorer: "tx",
    },
    {
      kind: "action",
      id: "mint",
      title: "Mint a bonus round",
      body: `Your constructor already minted the initial supply to you. Now invoke the living contract directly: the Forge fetches its **spec from the chain**, builds a \`mint\` call, **simulates** it, and has you sign the real thing — the same simulate-then-sign flow every Soroban dApp uses.`,
      cta: "Mint 25 more {symbol}",
      action: {
        type: "contract-invoke",
        func: "mint",
        argsFrom: (ctx) => ({
          to: ctx.walletAddress ?? "",
          amount: "250000000",
        }),
      },
      successBody: `Minted — 25 more {symbol} in your balance, authorized because the contract checked \`owner.require_auth()\` and **you are the owner**.

Anyone else calling \`mint\` gets rejected by the same line. That's on-chain access control, enforced by code you chose.`,
      explorer: "tx",
    },
    {
      kind: "quiz",
      id: "quiz-sep41",
      question: `Your token implements SEP-41. What does that buy it?`,
      options: [
        "Every wallet, DEX and contract that speaks the standard interface can hold, display and move it — no custom integration",
        "A listing on every exchange, automatically",
        "Immunity from bugs — the standard is audited, so implementations are too",
      ],
      answer: 0,
      explain: `A standard is a shared language, not a marketing deal or a safety guarantee. SEP-41 means your token answers the calls the ecosystem already knows how to make — which is why the wizard built on the standard instead of inventing entrypoints.`,
    },
    {
      kind: "checkpoint",
      id: "claim",
      body: `The ledger holds your Wasm, your contract, and a balance minted to your sigil. The Forge will ask the chain itself — **simulating \`balance(you)\` on your contract** — before paying out. Proof, not promises.`,
    },
  ],
  verify: [
    { check: "account-exists" },
    { check: "token-balance-positive", func: "balance" },
  ],
};
