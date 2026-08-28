// La Forge — index /labs (labs guidés + carte de l'IDE libre) et le chrome du
// player de lab. Le contenu des étapes vit dans src/content/labs (EN-first).
export const labs = {
  metaTitle: "La Forge — TUSST",
  metaDescription:
    "Labs Stellar guidés : de grands boutons qui financent des wallets, ouvrent des trustlines et déploient des contrats sur le vrai testnet — pendant que tu apprends ce que chaque pression a fait.",
  kicker: "la forge",
  title: "La Forge Est Ouverte",
  intro:
    "Des labs guidés où chaque grand bouton fait quelque chose de réel sur le testnet — wallets financés, trustlines ouvertes, paiements réglés — et le texte raconte exactement ce qui vient de se passer sur le ledger.",
  liveHeading: "// labs",
  soonHeading: "// en cours de forge",
  freeMode: {
    title: "Mode libre — l'IDE",
    blurb:
      "L'atelier Soroban complet dans ton navigateur : écris du Rust, compile, déploie sur testnet, invoque. Sans rails, sans murs.",
    cta: "Ouvrir l'IDE",
    badge: "sans connexion · sans setup",
  },
  card: {
    minutes: "{minutes} min",
    xp: "{xp} xp",
    soon: "en cours de forge",
    completed: "terminé",
    start: "Entrer dans le lab",
    resume: "Reprendre",
    replay: "Rejouer",
  },
  difficulty: {
    novice: "novice",
    adept: "adepte",
    master: "maître",
  },
  player: {
    exit: "Quitter le lab",
    wallet: {
      none: "pas encore de sceau",
      yours: "ton sceau",
      copy: "Copier l'adresse",
      copied: "Copié",
    },
    phases: {
      prepare: "préparation",
      sign: "signature",
      submit: "envoi au réseau",
      confirm: "confirmation sur le ledger",
    },
    viewTx: "Voir la transaction sur l'explorer",
    viewAccount: "Voir ton compte sur l'explorer",
    retry: "Frapper encore",
    errors: {
      testnetBusy: "Les esprits du testnet sont occupés — frappe encore dans un instant.",
      walletRequired: "Forge d'abord tes clés — reviens d'un écran.",
      missingState: "Une étape précédente manque — reviens et termine-la.",
    },
    checkpoint: {
      title: "Réclame ta récompense",
      cta: "Lire le ledger & réclamer l'XP",
      verifying: "consultation du ledger…",
      anonymous:
        "Ta partie vit dans ce navigateur. Connecte-toi et la Forge vérifiera tout on-chain — des preuves, pas des promesses — avant de payer ton XP.",
      signIn: "Se connecter pour réclamer",
      failed:
        "Le ledger n'est pas d'accord — il manque des exploits : {checks}. Termine les étapes ci-dessus et réclame à nouveau.",
      checkNames: {
        "account-exists": "un compte vivant",
        trustline: "la trustline USDC",
        "payment-sent": "un paiement envoyé",
      },
    },
    done: {
      kicker: "lab terminé",
      xpEarned: "+{xp} xp",
      levelUp: "Niveau {level} atteint !",
      xpTotal: "{xp} xp au total",
      already: "Déjà réclamé — le ledger s'en souvient.",
      backToForge: "Retour à la Forge",
      openIde: "Continuer dans l'IDE",
    },
  },
};
