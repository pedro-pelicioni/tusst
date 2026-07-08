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
    challenges: 76,
    estHours: 12.1,
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
    challenges: 15,
    estHours: 2.8,
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
    challenges: 55,
    estHours: 9.7,
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
    challenges: 0,
    estHours: null,
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
    challenges: 0,
    estHours: null,
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
    challenges: 0,
    estHours: null,
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
    challenges: 0,
    estHours: null,
    tags: ["soroban", "rust", "contracts"],
    badge: null,
    status: "locked",
  },
];

export const activeTrackCount = tracks.filter((t) => t.status === "active").length;
export const totalChallenges = tracks.reduce((sum, t) => sum + t.challenges, 0);

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}
