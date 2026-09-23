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
    metaTitle: "The Characters — TUSST",
    metaDescription:
      "The eight characters of the realm — seven you can play, one you fight. Each is met by finishing a campaign section.",
    kicker: "// the cast",
    title: "The Characters",
    intro:
      "Eight characters walk this realm, one waiting at the end of each campaign section. Seven of them you can be: pick one and they grow with you through eight forms, from apprentice to radiant champion. The eighth is not a companion.",
    bossCard: "boss",
    formsLabel: "eight forms",
    playCta: "Play as this character",
    bossNote: "Fought, not played.",
    actLink: "Section {numeral} — {title}",
    unassigned: "unassigned",
    footnote:
      "characters are cosmetic only — your choice carries no advantage and gates nothing. you meet each one by finishing its campaign section, and you can change who you play from your profile at any time.",
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
