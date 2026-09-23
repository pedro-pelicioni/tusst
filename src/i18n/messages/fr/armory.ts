// L'Arsenal — la boutique que l'or caché finit par ouvrir.
// Les noms et les descriptions sont indexés par les ids de src/content/armory.ts,
// exactement comme les héros dans overworld.ts. Les ids ne se renomment jamais ici
// sans être renommés là-bas.

export const armory = {
  metaTitle: "L'Arsenal — TUSST",
  kicker: "l'arsenal",
  title: "Dépense ce que les leçons t'ont payé",
  intro:
    "Chaque leçon terminée verse 10 pièces d'or dans ta bourse. Voici ce qu'elles achètent — une lame, une pièce d'équipement, une créature sur tes talons. Rien de tout cela ne te rend plus fort. Tout cela te rend unique.",

  // Affiché à la place de la boutique tant que la couche monétaire reste cachée.
  locked: {
    title: "Les portes sont closes",
    body: "L'Arsenal ouvre après ta première leçon terminée. Va en terminer une, et les portes le sauront.",
    cta: "Choisir une leçon",
  },

  pouch: "{gold} or",
  collection: "{owned} sur {total} pièces",
  artPending: "Forgée, pas encore peinte — l'illustration de cette pièce arrive bientôt.",

  slots: {
    weapon: "armes",
    equipment: "équipement",
    mascot: "mascottes",
  },
  slotIntro: {
    weapon: "Ce que ton champion tient.",
    equipment: "Ce que ton champion porte.",
    mascot: "Qui marche sur les talons de ton champion.",
  },
  slotsNav: "Emplacements d'objets",

  rarity: {
    common: "qualité commune",
    uncommon: "qualité peu commune",
    rare: "qualité rare",
    epic: "qualité épique",
    legendary: "qualité légendaire",
  },

  buy: "Acheter",
  buying: "Paiement…",
  equip: "Équiper",
  equipping: "Équipement…",
  equipped: "En service",
  unequip: "Déséquiper",
  missing: "Il manque {missing} or",
  buyAria: "Acheter {name} pour {price} or",
  equipAria: "Équiper {name}",
  unequipAria: "Déséquiper {name}",

  loadout: {
    title: "Ta panoplie",
    empty: "Rien de porté pour l'instant. Tout ce qui suit s'ouvre avec l'or, pas avec les niveaux.",
    slotEmpty: "vide",
    open: "Ouvrir l'Arsenal",
  },

  err: {
    funds: "Pas encore assez d'or pour celle-là. Termine une autre leçon et reviens.",
    locked: "L'Arsenal ne t'est pas encore ouvert — termine d'abord une leçon.",
    "unknown-item": "Cette pièce n'est pas au catalogue.",
  },

  items: {
    // ── armes ──────────────────────────────────────────────────────────────
    "rune-dagger": {
      name: "Dague Runique",
      detail: "Premier acier. Petite, honnête, et assez tranchante pour débuter.",
    },
    "iron-shortsword": {
      name: "Épée Courte de Fer",
      detail: "Rien d'emprunté, rien de déplacé. La lame que tout écuyer finit par laisser derrière lui.",
    },
    "trustline-spear": {
      name: "Lance de Trustline",
      detail: "La portée, c'est la confiance. Elle ne frappe que ce qui a accepté de l'être.",
    },
    "twin-lumens": {
      name: "Lumens Jumeaux",
      detail: "Deux lames, un seul équilibre. Aucune ne bouge sans l'autre.",
    },
    "forge-hammer": {
      name: "Marteau de la Forge",
      detail: "En fusion aux jointures. Ce qu'il brise, il le brise en pièces que tu peux nommer.",
    },
    "soroban-staff": {
      name: "Bâton de Soroban",
      detail: "Un contrat au bout d'un bâton. Prononce les mots et le monde tient sa promesse.",
    },
    "ledger-scythe": {
      name: "Faux du Registre",
      detail: "Sa lame est une page. Ce qu'elle moissonne, personne ne l'effacera.",
    },
    "consensus-greatsword": {
      name: "Grande Épée du Consensus",
      detail: "Trop lourde pour une seule main. Elle ne s'abat que si tout le royaume est d'accord.",
    },

    // ── équipement ─────────────────────────────────────────────────────────
    patchcloak: {
      name: "Cape Rapiécée de l'Écuyer",
      detail: "Chaude, laide, et à toi. Tout Forgeborn commence rapiécé.",
    },
    "keeper-lantern": {
      name: "Lanterne du Gardien",
      detail: "Elle tient une lumière qui relit. Rien ne s'archive dans le noir.",
    },
    "runed-bracers": {
      name: "Brassards Runiques",
      detail: "Gravés des règles qui rattrapent l'erreur avant qu'elle te coûte.",
    },
    "sigil-pauldrons": {
      name: "Épaulières aux Sceaux",
      detail: "Un acier qui se souvient des portes qu'on t'a laissé franchir.",
    },
    "gem-cuirass": {
      name: "Cuirasse de Gemme",
      detail: "Une seule pierre au cœur, portant chaque état que tu as gardé.",
    },
    "starweave-cloak": {
      name: "Cape Tissée d'Étoiles",
      detail: "Tissée du graphe lui-même — le ciel se déplace quand tu te retournes.",
    },
    "golden-aegis": {
      name: "Égide du Donjon Impeccable",
      detail: "Un bouclier sans pièce en trop. Rien dessus n'est laissé sans compte.",
    },
    "protocol-crown": {
      name: "Couronne du Protocole",
      detail: "Les glyphes orbitent autour de la tête qui a enfin appris à les lire.",
    },

    // ── mascottes ──────────────────────────────────────────────────────────
    "ember-wyrmling": {
      name: "Dragonnet de Braise",
      detail: "Éclos dans les cendres de la forge. Il mâche tes erreurs de compilation.",
    },
    "rune-sprite": {
      name: "Lutin Runique",
      detail: "Petit, turquoise et insistant. Il pointe la ligne que tu as ratée.",
    },
    "lumen-moth": {
      name: "Papillon de Lumen",
      detail: "Il suit la valeur comme les papillons suivent la lumière — droit jusqu'au paiement.",
    },
    "golem-pup": {
      name: "Chiot-Golem",
      detail: "De la pierre, des runes et aucune manière. Il rapporte tout ce que tu alloues.",
    },
    "frost-drake": {
      name: "Drake de Givre",
      detail: "Il gèle un instant pour que tu puisses le lire. Et s'en montre insupportablement fier.",
    },
    "void-beholder": {
      name: "Beholder du Néant",
      detail: "Un grand œil, beaucoup de petits. Il voit ce que le golem voit.",
    },
    "sky-leviathan": {
      name: "Léviathan du Ciel",
      detail: "Un nouveau-né de nuage et d'étoile, déjà trop grand pour la pièce.",
    },
    "solar-dragon": {
      name: "Dragon Solaire",
      detail: "La dernière chose que forge la Forge. Il n'obéit qu'à un héros accompli.",
    },
  },
};
