// Seeded track catalog for TUSST (Phase 1).
// In later phases this moves to Postgres/Prisma; the shape mirrors the `Track` model.
// NOTE: no gold / economy data here by design — the currency layer stays hidden
// until the player completes their first lesson.

export type TrackLevel = "beginner" | "intermediate" | "advanced";
export type TrackStatus = "active" | "locked";
export type TrackBadge = "popular" | "new" | null;
export type TrackDomain = "rust" | "stellar";

export interface Track {
  index: string; // display index, e.g. "01"
  slug: string;
  title: string;
  description: string;
  level: TrackLevel;
  domain: TrackDomain;
  challenges: number;
  estHours: number | null; // null/0 => "~0m"
  tags: string[];
  badge: TrackBadge;
  status: TrackStatus;
}

export const tracks: Track[] = [
  {
    index: "01",
    slug: "rust-fundamentals",
    title: "Rust Fundamentals",
    description:
      "Master the basics of the Rust programming language, from syntax to ownership concepts.",
    level: "beginner",
    domain: "rust",
    challenges: 6,
    estHours: 1.5,
    tags: ["ownership", "syntax", "stdlib"],
    badge: "popular",
    status: "active",
  },
  {
    index: "02",
    slug: "control-flow",
    title: "Control Flow",
    description:
      "Learn how to control the flow of your Rust program using loops and conditional statements.",
    level: "beginner",
    domain: "rust",
    challenges: 6,
    estHours: 1.5,
    tags: ["if", "match", "loops"],
    badge: null,
    status: "active",
  },
  {
    index: "03",
    slug: "rust-standard-library",
    title: "Rust Standard Library",
    description:
      "Explore the Rust Standard Library and learn how to use its powerful features.",
    level: "intermediate",
    domain: "rust",
    challenges: 8,
    estHours: 2.4,
    tags: ["vec", "iter", "stdlib"],
    badge: "new",
    status: "active",
  },
  {
    index: "04",
    slug: "mastering-option",
    title: "Mastering Option<T>",
    description:
      "Learn how to use the Option<T> type to handle optional values in Rust.",
    level: "intermediate",
    domain: "rust",
    challenges: 3,
    estHours: 0.9,
    tags: ["option", "patterns"],
    badge: null,
    status: "locked",
  },
  {
    index: "05",
    slug: "mastering-result",
    title: "Mastering Result<T, E>",
    description:
      "Learn how to use the Result<T, E> type to handle errors in Rust.",
    level: "intermediate",
    domain: "rust",
    challenges: 3,
    estHours: 0.9,
    tags: ["result", "errors"],
    badge: null,
    status: "locked",
  },
  {
    index: "06",
    slug: "stellar-101",
    title: "Stellar 101",
    description:
      "Get started on the Stellar network: accounts, keypairs, Lumens, trustlines, and assets.",
    level: "beginner",
    domain: "stellar",
    challenges: 4,
    estHours: 1.2,
    tags: ["accounts", "assets", "lumens"],
    badge: null,
    status: "locked",
  },
  {
    index: "07",
    slug: "soroban-smart-contracts",
    title: "Soroban Smart Contracts",
    description:
      "Write, test, and deploy Soroban smart contracts in Rust on the current Stellar testnet.",
    level: "intermediate",
    domain: "stellar",
    challenges: 3,
    estHours: 1.2,
    tags: ["soroban", "rust", "contracts"],
    badge: null,
    status: "locked",
  },
  {
    index: "08",
    slug: "stellar-protocol-27",
    title: "Stellar Protocol 27: The Zipper",
    description:
      "Master the Protocol 27 upgrade: authentication delegation, address-bound signatures, and the migration path for every SDK.",
    level: "advanced",
    domain: "stellar",
    challenges: 6,
    estHours: 2.4,
    tags: ["protocol-27", "cap-71", "smart-accounts"],
    badge: "new",
    status: "locked",
  },
];

// `challenges` and `estHours` are the REAL authored lesson counts, not a
// roadmap. They were aspirational (76 for a 6-lesson track), which made the
// track page's progress bar read 8% for a student who had finished everything
// available — and now sits beside the Advanced Path, which counts honestly.
export const activeTrackCount = tracks.filter((t) => t.status === "active").length;
export const totalChallenges = tracks.reduce((sum, t) => sum + t.challenges, 0);

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}
