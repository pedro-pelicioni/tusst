// Le Hall — accueil connecté sur /path : deux routes + la Forge.
export const home = {
  metaTitle: "Le Hall — TUSST",
  metaDescription:
    "Choisis ta route : le Voyage du Bâtisseur, les labs guidés de la Forge ou la campagne Rust optionnelle.",
  kicker: "le hall",
  title: "Choisis ta route, forgeborn",
  intro:
    "Deux routes partent de ce hall — et la Forge brûle pour les deux. Apprends le métier, presse de vrais boutons sur un vrai réseau et plonge dans Rust autant que tu veux.",
  continueCta: "Reprendre où tu t'étais arrêté",
  level: "niveau {level}",
  xpToNext: "{into} / {span} xp jusqu'au niveau {next}",
  doors: {
    journey: {
      label: "la route essentielle",
      title: "Voyage du Bâtisseur",
      blurb:
        "Spec-driven, TDD, clean architecture — et comment Stellar fonctionne vraiment. La discipline qu'une IA n'apprendra pas à ta place.",
      cta: "Suivre le Voyage",
      soon: "premiers chapitres à la forge",
    },
    campaign: {
      label: "la route optionnelle",
      title: "Campagne Rust",
      blurb:
        "Huit actes de maîtrise Rust → Soroban. Optionnelle, profonde, et valant chaque escarmouche.",
      cta: "Marcher en Campagne",
      progress: "{done}/{total} actes remportés",
    },
    forge: {
      label: "là où l'on pratique",
      title: "La Forge",
      blurb:
        "Des labs guidés aux boutons qui font de vraies choses sur le vrai testnet — plus l'IDE en mode libre. Sans connexion.",
      cta: "Entrer dans la Forge",
      progress: "{done} labs terminés",
    },
  },
};
