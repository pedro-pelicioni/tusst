// App pages: path (the Hall reuses `home`), campaign, cards, tracks/[slug], profile.
export const pages = {
  campaign: {
    kicker: "the optional road",
    title: "Rust Campaign",
    optionalNote:
      "The mastery track. Every act is optional — and every act makes you sharper. The Journey links here whenever you want the Rust beneath a concept.",
  },
  path: {
    kicker: "campaign",
    title: "Rust to Soroban",
    championCards: "Collection cards",
    claimed: "{percent}% claimed",
    actReward: "section reward",
    rewardStats: "{type} · power {power}",
    skirmishesForgingSoon: "lessons in preparation — soon",
    startLearning: "Start learning",
    viewChampions: "View your cards",
  },
  cards: {
    metaTitle: "Card Collection — TUSST",
    metaDescription:
      "Collectible cards, one per campaign section. Finish a section's last lesson to claim its card.",
    kicker: "// collection",
    title: "Card Collection",
    intro:
      "Eight cards, one per campaign section. Finish a section's last lesson and its card joins your collection. Purely cosmetic — they carry no advantage, and nothing on this page gates any content.",
    bossCard: "boss card",
    actLink: "Section {numeral} — {title}",
    unassigned: "unassigned",
    footnote:
      "cards are cosmetic only — they carry no advantage and gate nothing. rare prints are awarded for finishing a section without a wrong answer.",
  },
  track: {
    backToPath: "campaign",
    trackLabel: "track / {level}",
    level: {
      beginner: "beginner",
      intermediate: "intermediate",
      advanced: "advanced",
    },
    act: "Section {numeral}",
    overlord: "{overlord}",
    actReward: "section reward",
    rewardStats: "{type} · power {power}",
    progress: "progress",
    lessonsHeading: "// lessons",
    forgingTitle: "lessons in preparation",
    forgingBefore:
      "Your onboarding unlocked this section, but its lessons are still being written. Head back to the",
    forgingLink: "campaign",
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
    forgeborn: "builder",
    lvlXp: "lvl {level} · {xp} xp",
    since: "since {date}",
    goldCoinAlt: "Gold coin",
    goldCaption: "gold · earned one lesson at a time",
    stats: {
      skirmishesWon: "lessons completed",
      actsCleared: "sections cleared",
      championCards: "collection cards",
    },
    campaignHeading: "// campaign",
    status: {
      cleared: "cleared",
      locked: "locked",
    },
    continueCampaign: "Continue the campaign",
    viewChampions: "View your cards",
  },
};
