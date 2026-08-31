# v2 Art Briefs — Higgsfield prompt pack

Masters go into `art-src/v2/` (gitignored) with the exact filenames below,
then `npm run assets:v2` cuts/compresses them into `public/v2/`. Every slot
has a CSS/glyph stand-in, so ship art in any order — nothing blocks.

> **Status 2026-08-28:** all 14 masters generated via the connected
> Higgsfield MCP (model `cinematic_studio_2_5`, 2K; cutouts through its
> background remover) and processed into `public/v2/`. To redo any slot,
> regenerate with the prompt below (or any tool), drop the master into
> `art-src/v2/`, and re-run `npm run assets:v2`. Note for keyed layers:
> if props touch the top edge, give that JOB `key: { bgCenter: true }` in
> `scripts/v2-assets.mjs` — background sampling moves to mid-height.

## Shared style preamble (paste before every prompt)

> Painterly dark-fantasy D&D illustration, cinematic wide shot, night palette
> of deep violets (#0b0716, #120b22) with warm gold accents (#d9b96a) and
> ember reds, dramatic rim light, volumetric god rays, soft film grain,
> matte-painting detail, no text, no letters, no watermark, no UI.

Rules that keep the pipeline happy:

- **matte scene** slots: full-bleed art, edge-to-edge, no border/frame.
- **keyed layer** slots: paint the subject on a **flat light-gray backdrop
  (#d4d4d4, perfectly even)** — the script cuts it by color distance. Subjects
  must not touch the top edge.
- **transparent** slots (emblems, sigils): export with the background already
  removed (PNG alpha). The script only trims and compresses.
- Respect the safe areas noted per slot — scrims darken top and bottom ~25%.

## The Hall — home (`/path`)

| # | file in `art-src/v2/` | master size | kind |
|---|---|---|---|
| 1 | `hall-bg.png` | 2560×1440 | matte scene |
| 2 | `hall-mid-raw.png` | 3840 wide | keyed layer |
| 3 | `door-journey.png` | 1200×1500 | matte scene |
| 4 | `door-campaign.png` | 1200×1500 | matte scene |
| 5 | `forge-vignette.png` | 1200×900 | matte scene |

**1 · hall-bg** — Interior of a great keep's hall at night: a long stone
gallery lit by a distant hearth, banners with abstract sigils (no letters),
two colossal archways side by side in the far wall glowing faintly — one
violet-blue, one warm gold — and to the right, lower, the mouth of a forge
workshop breathing ember light. Left third relatively calm/dark (safe area
for headline text).

**2 · hall-mid-raw** — On flat light-gray: a foreground row of hall props to
parallax over the backdrop — a stone column edge on the left, a hanging iron
chandelier chain, drifting hearth sparks. Sparse, mostly empty center.

**3 · door-journey** — A tall archway seen straight on, violet-blue light
spilling through; beyond it a winding night road under a shattered
constellation sky, waymarker stones glowing faintly. Mood: invitation,
clarity. Bottom 30% calm for the card's text block.

**4 · door-campaign** — Twin archway of #3, warm gold/ember light; beyond it
a battlefield ridge with eight distant banners planted along a switchback
trail up a rusted citadel. Mood: challenge, glory. Bottom 30% calm.

**5 · forge-vignette** — Not a door: an open smithy alcove — a massive anvil
on a stone plinth, teal-flame forge behind it (teal #45d6c4 flame accents
over gold coals), tongs and contract-scroll props. Mood: workshop, hands-on.

## The Forge — labs index (`/labs`)

| # | file | master size | kind |
|---|---|---|---|
| 6 | `forge-bg.png` | 2560×1440 | matte scene |
| 7 | `emblem-wallet-onboarding.png` | 800×800 | transparent |
| 8 | `emblem-oz-token-wizard.png` | 800×800 | transparent |
| 9 | `emblem-passkey-smart-wallet.png` | 800×800 | transparent |
| 10 | `emblem-scp-simulator.png` | 800×800 | transparent |

**6 · forge-bg** — A vast dwarven forge-hall at night: rows of anvil
stations under a star-pierced vaulted ceiling, one great teal-flamed furnace
as the focal point, gold sparks rising like the site's particles. Top-left
quadrant calmer (headline safe area).

**7 · emblem: wallet** — An ornate skeleton key fused with a wax-sealed coin
pouch, faint violet glow, isometric-ish 3/4 view, painted-relic style.

**8 · emblem: OZ wizard** — A blacksmith's hammer striking a glowing token
coin on an anvil, tiny gear-rune ring around the coin (nod to OpenZeppelin),
ember sparks.

**9 · emblem: passkey** — A rounded shield with a fingerprint whorl engraved
in glowing teal, no seed-phrase scroll — a snapped quill beneath it.

**10 · emblem: SCP** — A council circle of five rune-stones connected by
glowing threads of light (a quorum graph), one stone dimmed.

## The Journey — map (`/journey`, Phase B surfaces, slots ready now)

| # | file | master size | kind |
|---|---|---|---|
| 11 | `journey-bg.png` | 2560×1440 | matte scene |
| 12 | `sigil-1.png` | 640×640 | transparent |
| 13 | `sigil-2.png` | 640×640 | transparent |
| 14 | `sigil-3.png` | 640×640 | transparent |
| 15 | `sigil-4.png` | 640×640 | transparent |
| 16 | `sigil-5.png` | 640×640 | transparent |
| 17 | `sigil-6.png` | 640×640 | transparent |
| 18 | `sigil-7.png` | 640×640 | transparent |
| 19 | `sigil-8.png` | 640×640 | transparent |
| 20 | `sigil-9.png` | 640×640 | transparent |
| 21 | `sigil-10.png` | 640×640 | transparent |
| 22 | `sigil-11.png` | 640×640 | transparent |
| 23 | `sigil-12.png` | 640×640 | transparent |
| 24 | `sigil-13.png` | 640×640 | transparent |
| 25 | `sigil-14.png` | 640×640 | transparent |
| 26 | `sigil-15.png` | 640×640 | transparent |
| 27 | `sigil-16.png` | 640×640 | transparent |
| 28 | `sigil-17.png` | 640×640 | transparent |
| 29 | `sigil-18.png` | 640×640 | transparent |
| 30 | `sigil-19.png` | 640×640 | transparent |
| 31 | `sigil-20.png` | 640×640 | transparent |
| 32 | `sigil-21.png` | 640×640 | transparent |

**11 · journey-bg** — A night road winding through highlands toward the
horizon, waymarker obelisks at intervals each glowing a different soft color,
the shattered-constellation sky above (the landing's sky language). Center
column calm for the chapter rail.

**12 · sigil-1 (spec-driven)** — A quill crossing a blueprint scroll, violet
ink glow. **13 · sigil-2 (SCP)** — Miniature of emblem #10, simplified.
**14 · sigil-3 (tx anatomy)** — An envelope-shaped rune split open showing
three orbiting op-glyphs.

The Foundations trio (level 0) follows the same emblem language — one object,
centred, nothing else in frame:
**15 · sigil-4 (the ledger)** — A heavy open tome on a stone lectern, its two
pages formed of interlocking chain links glowing teal, violet ink-light rising
from the spine. **16 · sigil-5 (keys)** — An ornate antique key crossed over a
round wax seal stamped with an abstract rune, teal aura ring behind.
**17 · sigil-6 (contracts)** — A stone-and-brass clockwork gear ring enclosing
a small rolled oath-scroll, teal flame between the teeth.

The remaining fifteen chapters (29/08/2026), same emblem language — one
object, centred, nothing else in frame:
**18 · sigil-7 (accounts & assets)** — A gold coin standing on edge on a stone
ledger slab, three fine chains radiating to empty coin-sockets.
**19 · sigil-8 (bounded contexts)** — An unrolled map with three territories
divided by glowing violet/teal/gold boundaries, brass dividers across it.
**20 · sigil-9 (anchors)** — A lone stone gateway arch on a cliff edge, gold
light pouring through, sea mist below.
**21 · sigil-10 (payments & DEX)** — A river of liquid light forking into three
glowing channels through dark stone.
**22 · sigil-11 (harness)** — A stone golem's open hand on a workbench, a
leather harness of straps and brass rings buckled at the wrist.
**23 · sigil-12 (capstone)** — A finished blade across an anvil, edge still
glowing gold, tongs and a rolled scroll beside it.
**24 · sigil-13 (clean architecture)** — A cutaway keep from above, four
concentric ring walls, gold at the core cooling to violet outward.
**25 · sigil-14 (agentic loops)** — An ouroboros of brass gears biting its own
tail, teal flame running the inside of the ring.
**26 · sigil-15 (Soroban)** — A stone reliquary box, lid ajar, teal light and
embers breathing from the seam, brass clockwork on its face.
**27 · sigil-16 (protocol upgrades)** — Violet lightning striking a menhir
mid-transformation, older carvings visible beneath newer ones.
**28 · sigil-17 (TDD)** — Two runestones on an anvil, one ember-red and one
green, a taut thread of light strung between them.
**29 · sigil-18 (privacy)** — A lit candle behind a gauzy veil, flame legible
but softened, violet smoke curling above.
**30 · sigil-19 (passkeys)** — A dark steel shield with a fingerprint whorl
etched into the boss, violet light tracing the ridges.
**31 · sigil-20 (graph engineering)** — A loom of taut silver threads crossing
into a node-and-edge web, a violet light at each crossing.
**32 · sigil-21 (prompt engineering)** — A feather quill upright in a stone
inkwell, luminous violet script spiralling out of the nib.

## After generating

```bash
npm run assets:v2
```

The script reports each slot (missing masters are fine), enforces per-file
KB budgets, and writes to `public/v2/`. Commit only `public/v2/` outputs.

## The test-out seals — the skip buttons (`/journey`)

Added 30/08/2026 for the Duolingo-style "I already know this" shortcut. Unlike
the sigils, these two masters ship **with** their flat gray backdrop and are
cut by `kind: "key"` in the pipeline rather than `alpha`.

| # | file in `art-src/v2/` | master size | kind |
|---|---|---|---|
| 31 | `skip-chapter.png` | 1024×1024 | keyed layer |
| 32 | `skip-arc.png` | 1024×1024 | keyed layer |

Both have a glyph stand-in (`🗝` / `🜲`) in `SkipLink`, so a missing master
never costs the reader the shortcut.

**31 · skip-chapter** — the small key, for a single chapter's paper.

> Painterly dark-fantasy D&D illustration of a single object, centered,
> isolated on a perfectly even flat light-gray backdrop (#d4d4d4), subject well
> clear of all four edges. An ornate small brass key floating upright at a
> slight angle; its bow is a circular rune-ring etched with abstract geometric
> glyphs, the ward at the tip cut into a sharp forward-pointing chevron like a
> fast-forward arrow. Warm gold (#d9b96a) rim light along every edge, deep
> violet (#120b22) shadow pooling in the recesses, a single ember-red spark
> glinting at the tip. Dramatic rim light, soft film grain, matte-painting
> detail. No text, no letters, no numbers, no watermark, no UI, no background
> scenery, no hands.

**32 · skip-arc** — the heavier seal, for a whole arc's paper. Note the key
params: the master's warm bloom sits close to the gray backdrop in value, and
the default key leaves it as a milky halo on the dark map, so this slot cuts at
`keyStart: 62, keyFull: 120` and rides a lower `alphaQuality` to stay in budget.

> Painterly dark-fantasy D&D illustration of a single object, centered,
> isolated on a perfectly even flat light-gray backdrop (#d4d4d4), subject well
> clear of all four edges. A heavy circular gilded seal-medallion, like a wax
> seal pressed in gold: a thick ornate ring of braided metal enclosing a raised
> rune of three converging chevrons pointing forward. Aged brass and warm gold
> (#d9b96a) with ember-red enamel inlay in the grooves, deep violet (#120b22)
> shadow in the relief, faint volumetric glow behind the ring. Dramatic rim
> light, soft film grain, matte-painting detail, richer and heavier than a
> small key — this is a master seal. No text, no letters, no numbers, no
> watermark, no UI, no background scenery, no hands.

## The split-pass sigils (`/journey`)

Added 31/08/2026, when the two-arc curriculum grew from 20 to 32 live chapters.
Like the test-out seals — and unlike the original sigils — these masters ship
**with** their flat gray backdrop and are cut by `kind: "key"` rather than
`alpha`. Named by slug, same as every other sigil.

| file in `art-src/v2/` | chapter | subject |
|---|---|---|
| `sigil-what-the-border-holds.png` | Craft IV | open brass coffer holding a medallion, a plain gem, a bound cluster |
| `sigil-the-keeps-own-doors.png` | Craft VI | a lone carved stone doorway, warm light spilling through |
| `sigil-what-catches-it.png` | Craft VIII | a taut brass net with one fallen ember caught in it |
| `sigil-what-the-golem-sees.png` | Craft X | a lone stone window frame, one shaft of light, dust motes |
| `sigil-the-hand-on-the-brake.png` | Craft XII | a gauntlet clamping a brake lever onto a great cog, sparks |
| `sigil-the-skeleton-and-the-organs.png` | Craft XIV | a rigid brass armature cradling three glowing orbs |
| `sigil-the-fate-of-an-envelope.png` | Realm III | a sealed envelope, half gilded, half fraying into embers |
| `sigil-the-issuers-side.png` | Realm V | hammer poised over a blank gold disc on a small anvil |
| `sigil-the-crossing.png` | Realm VII | a ferry on luminous water, one coin half gold half silver |
| `sigil-the-common-tongue.png` | Realm IX | a keyring of a dozen keys, every one the same shape |
| `sigil-the-heartbeat-and-the-bill.png` | Realm XI | an hourglass whose falling sand is tiny gold coins |
| `sigil-the-spine-beneath-the-veil.png` | Realm XIV | a gilded spinal column half-wrapped in drifting gauze |

**Shared prompt shape** — the style preamble above, then:

> …of a single object, centered, isolated on a perfectly even flat light-gray
> backdrop (#d4d4d4), subject well clear of all four edges. **Keep every glow
> and haze tight against the object — the backdrop stays perfectly flat and
> uniform.** No text, no letters, no numbers, no watermark, no UI, no
> background scenery, no hands. SUBJECT: …

That bolded clause is load-bearing. Without it the model bleeds bloom into the
backdrop, the key pass turns it into a milky halo on the dark map, and the WebP
balloons past budget — which is exactly what happened to `skip-arc` and had to
be fixed with a far harder key.

**Per-slot tuning that was needed.** Four of the twelve blew the 100 KB budget
on residual soft alpha:

- `the-fate-of-an-envelope` — ember haze around the edge; cut hard at
  `keyStart: 56, keyFull: 118`, `alphaQuality: 70`. 194 KB → 66 KB.
- `what-catches-it` — a fine mesh net, so keying harder would have eaten the
  weave; fixed with compression instead (`width: 560`, `alphaQuality: 52`).
  140 KB → under budget.
- `the-common-tongue`, `the-heartbeat-and-the-bill` — `alphaQuality: 72` alone.
