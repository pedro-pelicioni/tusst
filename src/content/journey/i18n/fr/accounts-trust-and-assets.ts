import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Comptes, Confiance et Actifs",
  tagline: "Comptes, réserves et trustlines : pourquoi détenir un actif se choisit.",
  steps: [
    {
      kind: "theory",
      body: `## Un compte est une entrée de registre

Retire l'interface du portefeuille : un **compte Stellar** n'est plus qu'une entrée du registre répliqué — une clé publique, un solde XLM, quelques indicateurs et le **numéro de séquence** rencontré en décortiquant les enveloppes, qui empêche le rejeu des transactions.

Les lignes ne sont pas gratuites. Chaque validateur stocke chaque entrée, donc chaque entrée doit bloquer une **réserve de base** en XLM — actuellement 0,5 XLM, avec un nouveau compte qui doit détenir au moins deux (1 XLM) qu'il ne peut pas dépenser. Supprime les entrées et la réserve revient.

La réserve n'est pas des frais. C'est un **louer-avec-dépôt** : le registre reste léger parce que l'encombrement a un prix.`,
    },
    {
      kind: "theory",
      body: `## Lignes de confiance : les actifs sont opt-in

Sur de nombreuses chaînes, n'importe qui peut envoyer des jetons inutiles à ton adresse. Sur Stellar, ce n'est pas le cas : pour détenir un actif autre que XLM, ton compte doit d'abord ouvrir une **ligne de confiance** vers celui-ci.

Une ligne de confiance indique : *« J'accepte l'actif X de l'émetteur Y, jusqu'à cette **limite**. »* Elle est créée avec l'opération \`change_trust\`, elle est sa propre entrée de registre — elle bloque **une réserve de base** — et tant qu'elle n'existe pas, les paiements de cet actif vers toi échouent simplement.

Opt-in par conception : ton bilan ne contient que ce que tu as accepté de détenir.`,
    },
    {
      kind: "diagram",
      body: "Un actif émis, et qui a le droit d'y toucher :",
      caption: "Les lignes pointillées sont des trustlines — opt-in et réversibles. La ligne pleine n'existe que parce que ses deux extrémités ont accepté.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "issuer",
            label: "EMETTEUR",
            x: 50,
            y: 12,
            tone: "gold",
            shape: "box",
            note: "Fait exister l'actif simplement en le payant. Il n'y a ni mint ni table d'offre.",
          },
          {
            id: "ana",
            label: "ANA",
            x: 16,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "A ouvert une trustline — cet opt-in est ce qui lui permet de détenir l'actif.",
          },
          {
            id: "bruno",
            label: "BRUNO",
            x: 50,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "A aussi accepté, donc Ana peut le payer. Les deux extrémités ont besoin d'une trustline.",
          },
          {
            id: "caio",
            label: "CAIO",
            x: 84,
            y: 45,
            tone: "neutral",
            shape: "box",
            note: "N'en a jamais ouvert. Personne ne peut lui envoyer cet actif, quoi qu'il tente.",
          },
        ],
        edges: [
          {
            from: "issuer",
            to: "ana",
            label: "trustline",
            style: "dashed",
          },
          {
            from: "issuer",
            to: "bruno",
            style: "dashed",
          },
          {
            from: "ana",
            to: "bruno",
            label: "paiement",
            style: "solid",
          },
        ],
      },
    },
    { kind: "theory", body: `## La réserve, comptée

Les règles abstraites sur les réserves deviennent évidentes dès qu'on en additionne une. Voici un compte ordinaire, en service :

- **Le compte lui-même** — 2 réserves de base.
- **Trois trustlines** — USDC, EURC et le jeton local d'un anchor : 3 de plus.
- **Une offre ouverte** sur le DEX — 1 de plus.

Six entrées à **0,5 XLM chacune : 3 XLM immobilisés.** Si le compte détient 3,4 XLM, son solde dépensable est de 0,4 — et un paiement d'1 XLM échouera, avec un solde qui semble manifestement suffire.

Cette erreur a un nom dans toutes les files de support Stellar : *« j'ai des fonds mais le paiement dit provision insuffisante ».* Les fonds sont là. Ils ne sont simplement pas **disponibles**, car la disponibilité est le total moins la réserve, et la réserve a grandi chaque fois que le compte a accepté de détenir quelque chose de nouveau.

La bonne nouvelle : rien n'a été dépensé. Fermez l'offre et 0,5 XLM revient. Fermez une trustline devenue inutile et une autre revient. La réserve est une caution sur de l'espace de registre, rendue dès que vous cessez de l'occuper.` },
    { kind: "theory", body: `## Ce que le consentement empêche réellement

La trustline ressemble à de la paperasse jusqu'à ce qu'on imagine le registre sans elle.

Sur une chaîne où n'importe qui peut pousser un jeton vers n'importe quelle adresse, votre portefeuille est une boîte aux lettres publique où des inconnus écrivent. Des jetons arrivent sans qu'on les demande — certains en guise de marketing, d'autres nommés pour se faire passer pour un vrai actif, d'autres conçus pour que le simple fait d'interagir vous coûte quelque chose. Chaque portefeuille a alors besoin d'un filtre, chaque filtre d'une liste, et chaque liste est le jugement de quelqu'un sur ce que vous avez le droit de voir.

Stellar descend cette décision d'un cran, dans le protocole : **un actif ne peut pas atterrir sur un compte qui n'a pas ouvert de trustline vers lui.** Personne ne met quoi que ce soit sur votre compte sans votre consentement préalable, explicite et inscrit au registre.

La réserve est ce qui rend ce consentement honnête. Chaque trustline immobilise 0,5 XLM : en ouvrir une est donc un petit acte délibéré plutôt qu'une chose qu'un script fait dix mille fois — et la fermer rend la réserve.

La friction était l'objectif.` },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Tu as déjà fait ça de tes propres mains : le laboratoire **Ton premier portefeuille** de Forge soumet \`change_trust\` avec ta signature sur le testnet en direct — le moment où un nouvel actif apparaît dans ton solde est la naissance d'une ligne de confiance. Si tu as sauté ce laboratoire, c'est le chapitre idéal pour en ouvrir une en vrai.`,
    },
    { kind: "theory", body: `## Détenir, et créer

Vous savez désormais lire n'importe quel compte du registre : ce qu'il coûte d'exister, ce que chaque entrée ajoute à ce coût, et quels actifs il a accepté de détenir.

Tout jusqu'ici s'est joué du côté du détenteur. Retournez la pièce et un autre jeu de questions apparaît : comment un actif vient-il à exister, qui a le droit d'en créer un, et — la question à laquelle tout émetteur régulé doit répondre — l'émetteur peut-il contrôler qui le détient ensuite ?

**Ensuite :** l'autre côté de la trustline.` },
  ],
  testOut: [
    { question: `Qu'est-ce qu'un compte sur Stellar, structurellement ?`,
      options: ["Une entrée du registre avec un solde, un numéro de séquence et des signataires — dont l'existence coûte une réserve minimale","Un enregistrement dans un contrat système que le protocole appelle","Une clé publique ; le registre ne stocke rien tant qu'elle n'a pas servi"], answer: 0 },
    { question: `Pourquoi chaque entrée supplémentaire relève-t-elle le solde minimal d'un compte ?`,
      options: ["Chaque entrée coûte du stockage à chaque validateur : la réserve tarifie ce coût continu — et elle est rendue quand l'entrée disparaît","C'est une commission qui finance l'exploitation des validateurs","Cela décourage les comptes de détenir plus d'un actif"], answer: 0 },
    { question: `Quelqu'un vous envoie un actif dont vous n'avez jamais entendu parler. Que se passe-t-il ?`,
      options: ["Le paiement échoue — un actif ne peut pas atterrir sur un compte sans trustline ouverte vers lui","Il arrive et apparaît dans vos soldes jusqu'à ce que vous le retiriez","Le protocole le retient jusqu'à ce que vous acceptiez ou refusiez"], answer: 0 },
    { question: `À quoi vous engage réellement l'ouverture d'une trustline ?`,
      options: ["À immobiliser une réserve et à consentir, au registre, à détenir cet actif précis de cet émetteur précis","À faire confiance à l'émetteur pour ne pas geler votre solde","À payer des frais récurrents tant que vous détenez l'actif"], answer: 0 },
  ],
};
