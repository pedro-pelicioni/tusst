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

## Overworld — the RPG surfaces (`/path`, `/journey`, `/campaign`, battle skin)

Masters go into `art-src/v2/overworld/` (gitignored) and `npm run assets:pixel`
(`scripts/pixel-assets.mjs`) cuts them into `public/v2/overworld/`. These are
**16-bit pixel art**, not the painterly preamble above — every prompt in this
section is self-contained. Every slot has a stand-in (CSS sea + region blobs
for the maps, the `CharacterAvatar` diamond for a hero sprite, an initial for
a portrait, a sigil glyph for a boss), so ship in any order.

> **Status 2026-09-23:** all 6 hero sheets and 4 of the 11 bosses are in.
>
> The account WAS in a Higgsfield "grace period" that capped generation at
> **5 per UTC day** — every 6th submission that day was refused with *"You've
> reached the daily generation limit for your grace period"* and cost nothing,
> and the quota reset at **00:00 UTC** (confirmed twice: refused at 23:56 UTC,
> all five accepted at 00:01). **Lifted on 2026-09-23** when the plan was
> upgraded: a batch submitted at 00:16 UTC — minutes after that day's five were
> already spent — went through 3/3. The refusal text is kept here only so it
> stays recognisable if a plan ever lapses.
>
> | Run | Slots | Credits |
> | --- | --- | --- |
> | 2026-09-22 | 5 hero sheets (`gpt_image_2_5`, 3 each) | 432.77 → 417.77 |
> | 2026-09-23 | `hero-stropillusion-forms` + bosses `foundations`, `craft`, `realm`, `rust-fundamentals` | 417.77 → 407.02 |
> | 2026-09-23 | the 3 Armory sheets (`gpt_image_2_5`) — see the Armory section | 407.02 → … |
>
> **Still missing (7 act bosses):** `control-flow`, `rust-standard-library`,
> `mastering-option`, `mastering-result`, `stellar-101`,
> `soroban-smart-contracts`, `stellar-protocol-27`. Prompts are in the boss
> table below; ~2 credits each. Each one falls back to a glyph in the fortress
> node and the battle arena until its master lands.

### Maps (Phase 2 — already generated)

| master | output | size | budget |
|---|---|---|---|
| `journey-island.png` | `v2/overworld/journey-island.webp` | 2560 wide, 3:2 | 1400 KB |
| `campaign-island.png` | `v2/overworld/campaign-island.webp` | 2560 wide, 3:2 | 1400 KB |
| `world-map.png` | `v2/overworld/world-map.webp` | 2560 wide, 16:9 | 1200 KB |
| (`journey-island.png`) | `landing/hero/island.webp` | 2560 wide, lossy scene | 420 KB |

`kind: "pixel"`: nearest-neighbour downscale, near-lossless WebP first, lossy
fallback when over budget (all three maps currently take the fallback).

### Hero sheets ×3 — 8 forms + 8 bust portraits (`/journey`, `/campaign`, HUD, `/hero`)

The app addresses each sheet as a **4×2 grid of 256 px cells**
(`sheetPosition` in `src/lib/hero.ts`), cell `n` = form `n` = level `n+1`.

**Model / settings:** `gpt_image_2_5`, `quality: "high"`, `resolution: "2k"`,
`background: "transparent"`, aspect **`16:9`** (the model offers no 2:1; the
output is 2688×1520 and the `regrid` step re-cells it). Reference: the
champion card `public/cards/<id>.png` uploaded via `media_upload` and passed
as `image_references`.

> **THE FACE IS A BRAND CONSTANT — pin it in every hero prompt.** The Stroop
> species has a dark dome head, a curled hook antenna, two glowing amber eyes
> and a **glowing amber upturned crescent smile** (`public/mascot/*.png` is the
> canonical face). The champion cards paint it mid-battle-cry with a dark open
> mouth, which is right for a painting of someone shouting and *wrong* for a
> bust: stripped of the raised sword and the action pose, the same mouth reads
> as dismayed. `stroowarrior` was generated from the card alone on 2026-09-22
> and came out sad-looking in all 8 cells on both sheets; `stroopkeeper` got
> the smile and looks right. Re-drawn 2026-09-23 with the keeper's portrait
> sheet passed as a SECOND reference for the face and the card kept only for
> armour and palette, plus an explicit "never an open dark oval mouth" clause.
> Do the same for any future hero, and check the mouth before accepting a
> result.

| master (`art-src/v2/overworld/`) | hero | role phrase in the prompt |
|---|---|---|
| `hero-stroowarrior-forms.png` / `-portraits.png` | STROOWARRIOR | the armored warrior from the reference painting (sword and shield) |
| `hero-stropillusion-forms.png` / `-portraits.png` | STROPILLUSION | the illusionist mage from the reference painting (staff, robes, arcane glow) |
| `hero-stroopkeeper-forms.png` / `-portraits.png` | STROOPKEEPER | the archivist scholar from the reference painting (tome, robes, lantern) |

**Forms prompt** (swap ROLE):

> 16-bit pixel art character sheet: the SAME chibi hero character shown 8
> times in a strict 4 by 2 grid, each figure centered in its own equal cell,
> full body, facing right, idle pose, same proportions and silhouette in every
> cell. The hero is ROLE. Left to right, top to bottom the outfit escalates
> from a humble apprentice (row 1: apprentice, squire, warrior, vanguard) to a
> legendary champion (row 2: knight, champion, warlord, radiant solar champion
> with a glowing halo and wings). Faithful to the reference painting's face,
> colors and species. Crisp pixel clusters, dark outlines, no text, no labels,
> no grid lines, no background scenery, transparent background.

**Portraits prompt** (swap ROLE):

> 16-bit pixel art bust portraits of the same hero (ROLE), 8 portraits in a
> strict 4 by 2 grid, equal square cells, each bust centered facing slightly
> left, the outfit escalating exactly like the character sheet (apprentice →
> squire → warrior → vanguard → knight → champion → warlord → radiant champion
> with halo), consistent face and colors, transparent background, no text, no
> grid lines.

If a result's grid is uneven or figures bleed into each other, retry once
adding: *"each of the 8 figures must be fully inside its own cell with
generous empty margin around it"*. None of the five 2026-09-22 results
needed it.

**Pipeline:** `kind: "alpha"` (the PNG already carries alpha — no key pass),
`regrid: { cols: 4, rows: 2, cell: 256, pad: 8 }`, `anchor: "bottom"` for
forms (feet on a shared floor so the walk bob and map anchor stay put) and
`"center"` for portraits. The regrid finds the emptiest cut line within ±20 %
of each nominal boundary, crops every figure to its alpha bbox and composites
the 8 into a fresh 1024×512 canvas at **one uniform scale** (the largest
figure — the winged final form — fits 240 px), so the hero keeps its size
from form to form. Near-lossless is tried first; all five took the lossy
fallback at 117–154 KB against a 160 KB budget. If a sheet lands over budget,
lower `alphaQuality` before `quality` — the forms jobs run at **78**, dropped
from 82 on 2026-09-23 when the re-drawn `stroowarrior` (its flame sword carries
a wide soft glow, and glow is what the alpha plane spends its bits on) landed
at 164 KB. At 78 all six sheets pass.

### Bosses ×11 — 512 wide keyed (`MissionNode`, `BattleFrame`)

3 journey region bosses + 8 act overlords. Slot ids are the region ids of
`src/content/overworld/journey-world.ts` and the act `trackSlug`s of
`src/content/campaign.ts` (the `boss` field on a fortress node).

**Model / settings:** `nano_banana_pro`, `resolution: "2k"`, aspect `1:1`,
no reference image. Submit as one `generate_image_batch` (11 requests) and
`jobs_wait`.

**Prompt shape:** `SUBJECT, 16-bit pixel art monster sprite, front view, full
body centered, crisp pixel clusters, dark outlines, dramatic rim light, flat
light gray #d4d4d4 background, no text, no watermark`

| master (`art-src/v2/overworld/`) | slot | SUBJECT |
|---|---|---|
| `boss-foundations.png` | Journey · Foundations | a hulking stone golem covered in glowing teal runes |
| `boss-craft.png` | Journey · Craft | a three-headed green hydra coiled around broken gears |
| `boss-realm.png` | Journey · Realm | a spectral wraith holding a floating open ledger, violet flames |
| `boss-rust-fundamentals.png` | Act I | a rusted iron golem with chains |
| `boss-control-flow.png` | Act II | a serpent coiled into an infinite loop of segments |
| `boss-rust-standard-library.png` | Act III | a beast made of stacked ancient books and scrolls |
| `boss-mastering-option.png` | Act IV | a hooded phantom fading into void, one glowing eye |
| `boss-mastering-result.png` | Act V | a two-faced oracle statue, one side gold one side cracked |
| `boss-stellar-101.png` | Act VI | a sky leviathan made of stars and clouds |
| `boss-soroban-smart-contracts.png` | Act VII | a floating beholder-like eye monster with many smaller eyes, deep purple |
| `boss-stellar-protocol-27.png` | Act VIII | an armored herald knight with a banner of glowing glyphs |

**Pipeline:** `kind: "key"` with `keyStart: 30, keyFull: 92` (the same gray
key as the sigils), `trim: true`, `resize: { width: 512 }`, `alphaQuality:
88`, budget **90 KB** → `public/v2/overworld/bosses/<slot>.webp`. If the
model bleeds glow into the backdrop, cut harder (`keyStart: 56, keyFull:
118`) exactly like `the-fate-of-an-envelope` above.

## Armory — the three cosmetic sheets (`/armory`, profile loadout)

Masters go into `art-src/v2/overworld/` (gitignored) as `armory-weapons.png`,
`armory-equipment.png`, `armory-mascots.png`; `npm run assets:pixel` re-cells
them into `public/v2/armory/<slot>.webp`. **16-bit pixel art**, same register as
the hero sheets and bosses above.

Each sheet is a **4×2 grid of 256 px cells** — cell `n` is the item whose
`cell` is `n` in `src/content/armory.ts`, so **cell order is frozen**: the list
below IS the catalog order, and swapping two entries turns every owner's sword
into someone else's. Every slot falls back to a gilded rune plate
(`.ow-item-standin`), so `/armory` is fully playable with none of this art in
place — which is how it shipped.

> **Status 2026-09-23: all three sheets are in.** One `generate_image_batch` of
> three, accepted 3/3 straight after the plan upgrade lifted the daily cap, and
> every grid came back clean on the first try — `regrid` found its 8 figures in
> each sheet and re-celled all three to 1024×512, so the "uneven grid" retry
> note at the end of this section has still never been exercised here.

**Model / settings:** `gpt_image_2_5`, `quality: "high"`, `resolution: "2k"`,
`background: "transparent"`, aspect **`16:9`** — identical to the hero sheets
(the model has no 2:1; `regrid` re-cells the 2688×1520 output). No reference
image: these are props, not characters, and the palette is pinned in the prompt
instead.

**Pipeline:** `kind: "alpha"` (the master carries its own alpha — no key pass),
`regrid: { cols: 4, rows: 2, cell: 256, pad: 8, anchor: "center" }`,
`alphaQuality: 74`, budget **160 KB** → `public/v2/armory/<slot>.webp`.
`anchor: "center"` and not `"bottom"`: items are props that should sit in the
middle of their cell, and the single uniform scale across the sheet is what
keeps the dagger visibly smaller than the greatsword. **alphaQuality 74, not
the heroes' 82:** these sheets carry wide soft rim-light glows, which is
exactly what the alpha plane spends its bits on — at 82, `mascots` landed at
163 KB against the 160 KB budget while the other two passed. Lowering
alphaQuality before quality (the rule above) brought the three in at 86 / 128 /
140 KB.

### Prompt — `armory-weapons.png`

> 16-bit pixel art item sheet: 8 different fantasy WEAPONS shown in a strict 4
> by 2 grid, each weapon centered in its own equal cell, angled diagonally, the
> whole item fully inside its own cell with generous empty margin around it, no
> item touching another. Crisp pixel clusters, dark outlines, dramatic rim
> light. Left to right, top to bottom the weapons escalate in power from a
> humble apprentice tool to a legendary radiant relic: (1) a short rune-etched
> bronze dagger, (2) a plain iron shortsword, (3) a slender spear with a teal
> glowing tip, (4) a pair of crossed twin daggers with amber gems, (5) a heavy
> forge hammer with molten orange cracks, (6) an arcane violet wizard staff
> topped with a floating glyph, (7) a dark scythe whose blade is a curved
> ledger page, (8) a colossal golden greatsword wreathed in radiant solar
> light. Consistent palette of amber gold, teal and violet on dark steel. No
> text, no labels, no numbers, no grid lines, no background scenery,
> transparent background.

| cell | item id | price |
|---|---|---|
| 0 | `rune-dagger` | 20 |
| 1 | `iron-shortsword` | 45 |
| 2 | `trustline-spear` | 70 |
| 3 | `twin-lumens` | 100 |
| 4 | `forge-hammer` | 140 |
| 5 | `soroban-staff` | 185 |
| 6 | `ledger-scythe` | 240 |
| 7 | `consensus-greatsword` | 320 |

### Prompt — `armory-equipment.png`

> 16-bit pixel art item sheet: 8 different fantasy ARMOR and EQUIPMENT pieces
> shown in a strict 4 by 2 grid, each piece centered in its own equal cell,
> front facing, the whole item fully inside its own cell with generous empty
> margin around it, no item touching another. Crisp pixel clusters, dark
> outlines, dramatic rim light. Left to right, top to bottom the gear escalates
> from humble apprentice kit to legendary regalia: (1) a patched brown
> apprentice cloak, (2) a brass keeper lantern with warm light, (3) a pair of
> rune-etched leather bracers, (4) steel pauldrons with teal sigils, (5) an
> engraved silver cuirass with a glowing amber gem, (6) a flowing violet cloak
> embroidered with stars, (7) a round golden aegis shield with a carved rune
> boss, (8) a radiant golden crown ringed by a halo of floating glyphs.
> Consistent palette of amber gold, teal and violet on dark steel and leather.
> No text, no labels, no numbers, no grid lines, no background scenery,
> transparent background.

| cell | item id | price |
|---|---|---|
| 0 | `patchcloak` | 20 |
| 1 | `keeper-lantern` | 40 |
| 2 | `runed-bracers` | 65 |
| 3 | `sigil-pauldrons` | 95 |
| 4 | `gem-cuirass` | 135 |
| 5 | `starweave-cloak` | 180 |
| 6 | `golden-aegis` | 235 |
| 7 | `protocol-crown` | 320 |

### Prompt — `armory-mascots.png`

> 16-bit pixel art creature sheet: 8 different chibi fantasy COMPANION
> CREATURES, mostly dragons, shown in a strict 4 by 2 grid, each creature full
> body facing right in an idle pose, centered in its own equal cell, fully
> inside its cell with generous empty margin around it, no creature touching
> another. Crisp pixel clusters, dark outlines, dramatic rim light. Left to
> right, top to bottom they escalate from a humble hatchling to a legendary
> beast: (1) a tiny orange ember wyrmling baby dragon, (2) a small glowing teal
> rune sprite, (3) a pale luminous moth with star-patterned wings, (4) a chubby
> stone golem pup covered in glowing teal runes, (5) a teal frost drake with
> icy crystal wings, (6) a small floating violet eye beholder creature with
> tiny extra eyes, (7) a baby sky leviathan made of clouds and stars, (8) a
> majestic radiant golden solar dragon with spread wings and a glowing halo.
> Consistent palette of amber gold, teal and violet. No text, no labels, no
> numbers, no grid lines, no background scenery, transparent background.

| cell | item id | price |
|---|---|---|
| 0 | `ember-wyrmling` | 30 |
| 1 | `rune-sprite` | 55 |
| 2 | `lumen-moth` | 80 |
| 3 | `golem-pup` | 110 |
| 4 | `frost-drake` | 150 |
| 5 | `void-beholder` | 200 |
| 6 | `sky-leviathan` | 260 |
| 7 | `solar-dragon` | 350 |

If a result's grid is uneven or two items bleed together, retry once adding
*"each of the 8 items must be fully inside its own cell with generous empty
margin around it, no item touching another"* — the `regrid` step throws rather
than guessing when it cannot find 8 separate figures, so a bad grid fails loudly
at `npm run assets:pixel` instead of shipping scrambled cells.
