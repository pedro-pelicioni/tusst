// Landing page (scènes illustrées).
// Les chaînes de marque (TUSST, tagline, devise et noms des champions)
// restent en anglais dans toutes les langues, volontairement.
export const landing = {
  metaDescription:
    "Des défis de programmation pratiques et ludiques. Maîtrise Rust, puis déploie de vrais contrats Soroban sur Stellar. Sans configuration : code directement.",
  metaImageAlt: "TUSST — forge ton parcours de Rust à Stellar",
  nav: {
    campaign: "Campagne",
    champions: "Champions",
    boss: "Le Beholder",
    forge: "La Forge",
    enterRealm: "Entrer dans le Royaume",
    openMenu: "Ouvrir le menu de navigation",
    closeMenu: "Fermer le menu de navigation",
  },
  hero: {
    subtitle: "The Ultimate Stellar Supreme Tutorial",
    tagline:
      "Maîtrisez Rust, puis forgez des contrats Soroban sur Stellar — huit actes, huit champions, une horreur aux mille yeux.",
    ctaPrimary: "Commencer la Campagne",
    ctaSecondary: "Ouvrir la Forge",
    ctaSecondaryBadge: "sans connexion",
    freeLine: "gratuit · aucune installation · dans le navigateur",
    scrollHint: "descendre",
  },
  intro: {
    eyebrow: "Forgé sur Stellar",
    titleTop: "Une Campagne",
    titleBottom: "Rust Gamifiée",
    body: "TUSST te mène des premiers mots d'éveil jusqu'aux contrats vivants sur le testnet de Stellar. Chaque escarmouche repose sur du vrai code jugé par des épreuves cachées — le compilateur est ton allié le plus sévère, et Ferrisia, la Mère-Crabe, n'accorde aucune clémence.",
    badgeRust: "Rust d'abord",
    badgeSoroban: "Contrats Soroban",
    badgeBrowser: "dans le navigateur",
    badgeFree: "gratuit · sans installation",
  },
  carousel: {
    kicker: "La Collection",
    heading: "Champions du Royaume",
    body: "Huit cartes peintes pour huit actes. Remporte le combat final d'un acte et son champion rejoint ta collection — les parcours sans faute rapportent des versions rares.",
    previous: "Précédent",
    next: "Suivant",
    cards: {
      metaStroowarrior: "acte i · guerrier",
      metaStropillusion: "acte ii · illusionniste",
      metaStroopkeeper: "acte iii · archiviste",
      metaStroophantom: "acte iv · rare · spectre",
      metaStrooracle: "acte v · rare · oracle",
      metaAstrostroopie: "acte vi · rare · voyageur",
      metaStroopbeholder: "acte vii · boss · aberration",
      metaStroopzipper: "acte viii · boss · héraut",
    },
  },
  features: {
    campaign: {
      eyebrow: "La Campagne",
      titleTop: "Huit Actes.",
      titleBottom: "Un Ciel à Rallumer.",
      body: "De la Citadelle Rouillée au Ciel Réécrit : les actes se déverrouillent dans l'ordre et les escarmouches offrent des tentatives illimitées. Avance des fondamentaux de Rust, à travers l'histoire de Stellar, jusqu'aux contrats déployés sur le testnet actif.",
      cta: "Commencer à l'Acte I ›",
    },
    boss: {
      eyebrow: "Acte VII · le boss",
      titleTop: "L'Antre",
      titleBottom: "du Beholder",
      body: "Au-delà de la Porte, il attend, dans une forteresse bâtie de chaque erreur jamais traitée. Forgez des runes Soroban, déployez-les dans le ciel vivant et retournez ses contrats corrompus contre lui.",
      note: "sa carte n'est pas une récompense. c'est un trophée.",
    },
    forge: {
      eyebrow: "sans connexion · sans installation",
      titleTop: "La Forge",
      titleBottom: "Est Ouverte",
      body: "Une forge Soroban complète dans ton navigateur : écris, compile, teste et déploie de vrais contrats sur le testnet — avec le Corbeau, éclaireur du ciel réécrit, qui croasse un indice chaque fois qu'une exécution échoue.",
      cta: "Ouvrir la Forge",
      ctaBadge: "sans connexion",
    },
  },
  cta: {
    titleTop: "Le Ciel Attend,",
    titleBottom: "Forgeborn.",
    body: "Les anciens sont francs sur tes chances : ton compilateur t'insultera mille fois pour que le Beholder ne puisse pas te blesser une seule fois.",
    button: "Commencer la Campagne",
    altPrefix: "Ou filez droit à l'enclume —",
    altLink: "ouvrez la Forge",
    altSuffix: ", sans connexion requise.",
  },
  footer: {
    tagline: "the ultimate stellar supreme tutorial",
    motto: "nothing left unhandled",
  },
  a11y: {
    carouselLabel: "Champions du royaume",
    prevCard: "Champion précédent",
    nextCard: "Champion suivant",
    goToCard: "Aller à {name}",
    cardStatus: "{name} — carte {index} sur {total}",
  },
};
