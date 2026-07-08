# TUSST — The Ultimate Stellar Supreme Tutorial

An open-source, gamified platform for learning to build on **Stellar**. Inspired by
[RPCiege](https://rpciege.com) (card-collecting coding sieges) and
[FCA00C](https://fastcheapandoutofcontrol.com) (Fast, Cheap & Out of Control — gamified
Soroban challenges), TUSST starts with **Rust**
fundamentals and leads into **Soroban smart contracts** on the current Stellar testnet.

It exists to consolidate and modernize the fragmented Stellar learning experience
(Stellar Quest, RPCiege, Fast Cheap & Out of Control) into a single, maintained, self-hostable home.

## Status

**Phase 1 — track-listing homepage.** This is the first slice: the landing page and
track catalog (the visual identity), with no backend required. Auth, the lesson player,
the Docker execution sandbox, and the game layer land in later phases (see the project plan).

> Design note: the **gold / cosmetics economy is intentionally hidden** in the UI until a
> player completes their first lesson — so the product never primes "gold farming" up front.
> You will not find any currency, shop, or inventory surface in this phase by design.

## Tech

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — terminal/dark base with a cosmic Stellar accent
- **Prisma + PostgreSQL** — schema designed in `prisma/schema.prisma` (wired in Phase 2)
- **Forge — IDE Online** (`/ide`) — write, test and deploy Soroban contracts in the browser

Full system design, diagrams and deployment notes: **[ARCHITECTURE.md](ARCHITECTURE.md)**.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Structure

```
src/
  app/                 # routes (home, /tracks/[slug])
  components/          # Nav, TrackCard, Badge, ProgressBar, CharacterAvatar, Footer
  content/tracks.ts    # seeded track catalog (moves to DB in Phase 2)
prisma/schema.prisma   # full data model (design artifact, incl. hidden-gold mechanic)
```

## Roadmap (high level)

1. **Track-listing homepage** ← you are here
2. Auth (GitHub + email) + Postgres/Prisma + per-user progress
3. Lesson player (Monaco editor) + one Rust lesson end-to-end
4. Hardened Docker execution sandbox (`cargo test` against hidden tests)
5. Hidden-gold reveal + cosmetics economy
6. Skins / character progression + lore
7. Stellar / Soroban tracks + Soroban sandbox + capstone

## License

[Apache-2.0](LICENSE) — built toward a Stellar Community Fund proposal.
