// App pages: path (the Hall reuses `home`), campaign, cards, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "the optional road",
    title: "Rust Campaign — Forgeborn",
    optionalNote:
      "The mastery track. Every act is optional — and every act makes you sharper. The Journey links here whenever you want the Rust beneath a concept.",
  },
  path: {
    kicker: "campaign path",
    title: "Forgeborn — Rust to Soroban",
    championCards: "Champion cards",
    claimed: "{percent}% claimed",
    actReward: "act reward",
    rewardStats: "{type} · power {power}",
    skirmishesForgingSoon: "skirmishes being forged — soon",
    startLearning: "Start learning",
    viewChampions: "View your champions",
  },
  cards: {
    metaTitle: "Champions of the Realm — TUSST",
    metaDescription:
      "The champion cards of the Shattered Constellation. Complete an act's final skirmish to claim its champion.",
    kicker: "// the shattered constellation",
    title: "Champions of the Realm",
    intro:
      "Eight cards for eight acts, scattered by the Great Panic. Each act of the campaign ends with a final skirmish — clear it, and its champion joins your collection. The last card is not given. It is taken.",
    bossCard: "boss card",
    actLink: "Act {numeral} — {title}",
    unassigned: "unassigned",
    footnote:
      "cards are cosmetic progression — they carry no gameplay advantage. rare prints are awarded for flawless act completion. on-chain claiming arrives with the Soroban capstone.",
  },
  track: {
    backToPath: "campaign path",
    trackLabel: "track / {level}",
    level: {
      beginner: "beginner",
      intermediate: "intermediate",
      advanced: "advanced",
    },
    act: "Act {numeral}",
    overlord: "overlord: {overlord}",
    actReward: "act reward",
    rewardStats: "{type} · power {power}",
    progress: "progress",
    lessonsHeading: "// lessons",
    forgingTitle: "skirmishes being forged",
    forgingBefore:
      "Your onboarding unlocked this act, but its skirmishes are still being written. Head back to the",
    forgingLink: "campaign path",
    forgingAfter: "to keep fighting.",
    difficulty: {
      easy: "easy",
      medium: "medium",
      hard: "hard",
    },
    soon: "soon",
    challengesAvailable:
      "{count} of {total} challenges available · more are on the way.",
  },
  profile: {
    forgeborn: "forgeborn",
    lvlXp: "lvl {level} · {xp} xp",
    since: "since {date}",
    goldCoinAlt: "Gold coin — the Stroop drachma",
    goldCaption: "gold · earned one lesson at a time",
    stats: {
      skirmishesWon: "skirmishes won",
      actsCleared: "acts cleared",
      championCards: "champion cards",
    },
    campaignHeading: "// campaign",
    status: {
      cleared: "cleared",
      locked: "locked",
    },
    continueCampaign: "Continue the campaign",
    viewChampions: "View your champions",
  },
};
