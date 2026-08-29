import { LAB_TEXT } from "@/content/labs/i18n";

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
    badge: "sans connexion · sans configuration",
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
  sim: {
    ariaLabel: "Simulateur de quorum SCP",
    nodeAria: "Nœud {node}",
    propose: "Proposer un ledger",
    reset: "Réinitialiser le concile",
    running: "le concile délibère…",
    closed: "Ledger {n} clos ✓",
    stalled: "{count} siège(s) attendent leur concile — la sûreté avant la vivacité.",
    halted: "Aucun quorum ne peut se former — le réseau attend plutôt que bifurquer.",
    hint: "Appuie sur proposer et regarde l'acceptation se propager. Clique un nœud pour l'abattre (ou le relever).",
    ledgers: "ledgers clos : {n}",
  },
  content: LAB_TEXT.fr,
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
      passkey: "attente de ta passkey",
      queued: "dans la file de la forge",
      building: "compilation rust → wasm",
      sign: "signature",
      submit: "envoi au réseau",
      confirm: "confirmation sur le ledger",
    },
    viewTx: "Voir la transaction sur l'explorer",
    viewAccount: "Voir ton compte sur l'explorer",
    viewContract: "Voir le smart wallet sur l'explorer",
    retry: "Réessayer",
    errors: {
      testnetBusy: "Le testnet est chargé ; réessaie dans un instant.",
      walletRequired: "Forge d'abord tes clés — reviens d'un écran.",
      missingState: "Une étape précédente manque — reviens et termine-la.",
      forgeCold: "La forge est froide — le runner est injoignable. Réessaie dans un instant.",
      buildFailed: "La compilation a échoué : le runner a rejeté ce contrat. Réessaie.",
      buildTimeout: "La compilation a expiré : la forge était occupée. Réessaie.",
      localWalletRequired:
        "Ce rite a besoin de la clé testnet locale de la Forge pour payer le déploiement — forge-la à l'étape précédente.",
      passkeyUnavailable:
        "Les passkeys exigent un contexte sécurisé et WebAuthn. Ouvre ce lab en HTTPS sur un appareil compatible.",
      passkeyMismatch:
        "Cette passkey appartient à un autre smart wallet. Réessaie et choisis l'identifiant que tu viens de forger.",
      passkeyFailed:
        "La cérémonie de passkey n'a pas abouti. Approuve la demande de l'appareil puis réessaie.",
      smartWalletDeployFailed:
        "La passkey a été créée, mais son smart wallet n'a pas atteint le testnet. Réessaie dans un instant.",
      smartWalletFundFailed:
        "Le smart wallet a été déployé, mais Friendbot n'a pas pu le financer pour le test de signature. Réessaie dans un instant.",
      passkeyTransactionFailed:
        "Le transfert signé avec la passkey n'a pas atteint le testnet. Approuve la demande de l'appareil puis réessaie.",
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
        "token-balance-positive": "un solde de token sur ton contrat",
        "smart-account-code": "le contrat canonique de smart account",
        "smart-account-native-balance": "du XLM natif dans le smart wallet",
        "claimable-balance-created": "un coffre que vous avez verrouillé",
        "account-thresholds": "un coffre-fort exigeant deux signatures",
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
