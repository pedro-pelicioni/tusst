import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Le Coffre au Trésor",
    tagline: "Verrouillez de l'or dans un coffre que seul son bénéficiaire ouvre.",
  },
  steps: {
    intro: {
      body: `## De l'or qui n'est encore à personne

Tous les soldes que vous avez vus jusqu'ici appartiennent à un compte. Un **solde réclamable** n'appartient à personne : c'est une entrée du registre à part entière, portant un montant, désignant qui peut le prendre, et sous quelle condition.

L'expéditeur n'a plus l'or. Le bénéficiaire ne l'a pas non plus — pas avant d'aller le chercher. Entre les deux, il repose dans le registre, visible de tous, retirable par exactement une adresse.

C'est ainsi que se construisent séquestre, airdrops, vesting et « tiens, prends-le quand tu veux » sans une ligne de contrat.`,
    },
    "forge-keys": {
      title: "Apportez vos clés",
      body: `La même paire de clés que la Forge utilise. Si vous en avez déjà forgé une dans un autre lab, ceci la reprend simplement.`,
      cta: "Préparer les clés",
      successBody: `Vous travaillez en tant que \`{address}\`.`,
    },
    fund: {
      title: "Financez le compte",
      body: `Un solde réclamable coûte une réserve à son créateur — le registre facture chaque entrée qu'il doit stocker. Il vous faut des XLM avant de pouvoir en verrouiller.`,
      cta: "Appeler Friendbot",
      successBody: `Financé : {balance} XLM.

Retenez ce nombre. Dans deux étapes il sera inférieur au montant verrouillé — parce que le coffre lui-même a un loyer.`,
    },
    "quiz-nature": {
      question: `Vous verrouillez 5 XLM dans un solde réclamable pour un ami. Avant qu'il ne le réclame, dans le solde de qui se trouvent ces 5 XLM ?`,
      options: [
        "De personne — cela reste une entrée du registre jusqu'à ce que le bénéficiaire la prenne",
        "Toujours le vôtre, simplement marqué comme réservé",
        "Déjà celui de votre ami, il ne l'a juste pas remarqué",
      ],
      explain: `Voilà ce qui le distingue d'un paiement en attente. L'entrée existe, les fonds sont engagés, et le seul compte qui peut les déplacer est celui qui y est nommé.`,
    },
    lock: {
      title: "Verrouillez le coffre",
      body: `Cinq XLM, réclamables par vous. Vous désigner vous-même est la façon honnête d'apprendre le mécanisme — tout fonctionne à l'identique quand le bénéficiaire est quelqu'un d'autre.

La condition ici est **inconditionnelle** : réclamable dès qu'elle existe. Stellar vous laisse aussi dire « pas avant telle heure », et c'est ainsi que s'écrit un calendrier de vesting ou une ouverture à minuit.`,
      cta: "Verrouiller 5 XLM",
      successBody: `Le coffre est dans le registre.

Votre solde XLM a baissé de plus de cinq : le surplus est la **réserve** de l'entrée elle-même. Réclamez le solde plus tard et cette réserve revient — le registre loue de l'espace, il ne le vend pas.`,
    },
    "balance-id": {
      prompt: `## Trouvez votre propre coffre

Le moteur ne vous a jamais donné l'identifiant du coffre — un hash de transaction n'est pas un identifiant de solde. Alors allez lire le registre.

Ouvrez la **Forge → registre**, choisissez *soldes réclamables* et mettez votre propre adresse dans le champ bénéficiaire. Votre coffre est l'entrée à \`5.0000000\`. Copiez son \`id\` — 72 caractères hexadécimaux — et collez-le ici.`,
      placeholder: "0000000000…",
      hint: "72 caractères hexadécimaux, commençant par plusieurs zéros.",
    },
    claim: {
      title: "Ouvrez le coffre",
      body: `Vous êtes le bénéficiaire désigné et la condition est remplie. Reprenez l'or.`,
      cta: "Réclamer le solde",
      successBody: `Réclamé. L'entrée a disparu du registre, les cinq XLM sont revenus dans votre solde — et la demi-réserve qui payait son loyer aussi.

Relancez la requête du registre : le coffre n'existe plus. Ce qui reste, c'est l'*opération* dans votre historique, et c'est précisément elle qui prouve que vous l'avez fait.`,
    },
    "quiz-predicate": {
      question: `Vous voulez un coffre que votre associée ne puisse ouvrir **qu'après le cliff de vesting**, dans un an. Qu'est-ce qui change ?`,
      options: [
        "Le prédicat du bénéficiaire — « pas avant cette date » au lieu d'inconditionnel",
        "Il faut déployer un contrat pour le détenir",
        "Rien — vous lui demandez poliment d'attendre",
      ],
      explain: `Les prédicats se composent : avant/après un instant, et/ou/non d'autres prédicats. Toute une classe de séquestre n'a jamais besoin de contrat — et ce qui n'a pas de contrat ne peut pas avoir de bug de contrat.`,
    },
    "claim-xp": {
      body: `Vous avez verrouillé de la valeur dans une entrée qui n'était à personne, vous l'avez trouvée en lisant le registre vous-même, et vous l'avez reprise.

Le serveur va chercher ce \`create_claimable_balance\` dans votre historique d'opérations. Il ne vous croit pas sur parole — jamais.`,
    },
  },
} satisfies LabTextOverlay;
