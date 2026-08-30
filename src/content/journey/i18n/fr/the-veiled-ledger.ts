import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Le grand livre voilé",
  tagline:
    "Jetons confidentiels et paiements privés — la confidentialité assortie de garde-fous de conformité.",
  steps: [
    {
      kind: "theory",
      body: `## La transparence est un atout — jusqu'à ce qu'elle en révèle trop

Tout ce que tu as construit jusqu’ici est radicalement public : chaque solde, chaque paiement, chaque contrepartie, pour toujours.

Dans la finance, c’est souvent l'argument décisif : des réserves auditables et une infrastructure vérifiable. Mais dans la vie réelle d'une entreprise, cette transparence a aussi son revers :

- Paye les salaires en chaîne et **chaque employé peut lire chaque autre salaire**.
- Paye un fournisseur et tes **concurrents lisent tes prix et volumes**.
- Déplace le trésor et le marché anticipe ton intention.

Les flux financiers importants ont besoin d’un *silence sélectif*. Toute la question est de savoir comment un registre public peut préserver certains secrets sans devenir lui-même opaque.`,
    },
    {
      kind: "diagram",
      body: "Le même paiement, vu des deux côtés :",
      caption: "Rien n'est chiffré ici aujourd'hui. Chaque ligne est publique par conception — c'est la fonctionnalité, et la fuite.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "explorer",
            label: "ce que n'importe qui lit",
            tone: "bad",
          },
          {
            id: "you",
            label: "ce que vous vouliez partager",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "le montant",
            cells: [
              {
                text: "le chiffre exact, pour toujours",
                tone: "bad",
              },
              {
                text: "qu'un paiement a eu lieu",
                tone: "good",
              },
            ],
          },
          {
            label: "la contrepartie",
            cells: [
              {
                text: "son adresse, et tout ce qu'elle a jamais fait",
                tone: "bad",
              },
              {
                text: "rien sur elle",
                tone: "good",
              },
            ],
          },
          {
            label: "votre paie",
            cells: [
              {
                text: "chaque salaire, comparable côte à côte",
                tone: "bad",
              },
              {
                text: "cela ne regarde personne",
                tone: "good",
              },
            ],
          },
          {
            label: "votre trésorerie",
            cells: [
              {
                text: "votre solde, au stroop près",
                tone: "bad",
              },
              {
                text: "cela ne regarde personne",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Preuve sans divulgation

La réponse vient du cadeau le plus étrange de la cryptographie : la **preuve à connaissance nulle**.

Une preuve ZK convainc un vérificateur qu’une affirmation est vraie — *« ce montant caché est positif et mon solde caché suffit à le couvrir »* — sans **rien révéler d’autre** : ni le montant, ni le solde.

La preuve est un petit objet mathématique que chacun peut vérifier à faible coût, sans avoir à faire confiance à celui qui l'a produite. Si elle est valide, l'affirmation tient. Point final.

Place un tel vérificateur dans les règles du grand livre, et la chaîne peut imposer l’honnêteté sur les chiffres qu’elle n’est jamais autorisée à voir.`,
    },
    {
      kind: "theory",
      body: `## Le royaume forge les outils

La vérification on-chain exige des calculs complexes exposés sous forme de **fonctions hôtes** — et Stellar les a introduits progressivement :

- **CAP‑59** a introduit les opérations de courbe **BLS12‑381**, permettant la vérification de preuves **Groth16** dans les contrats Soroban.
- **Protocoles 25 et 26** ont ajouté la courbe **BN254** et le hachage **Poseidon** — un hachage conçu pour être bon marché *à l’intérieur* des circuits ZK.

Cette deuxième vague a changé la donne en rendant les **systèmes de paiement privé réellement utilisables** sur Stellar. Ces primitives vivent au niveau du protocole : tous les contrats peuvent donc vérifier des preuves à vitesse native, sans payer un surcoût démesuré pour exécuter correctement la cryptographie.`,
    },
    {
      kind: "quiz",
      question: `Qu'apprend un vérificateur ZK on-chain lorsqu’il accepte une preuve ?`,
      options: [
        "Seulement que la déclaration prouvée est vraie — les valeurs cachées restent cachées",
        "Les valeurs sous-jacentes, qu’il vérifie puis jette",
        "Rien du tout — l’acceptation est un marketing probabiliste",
      ],
      answer: 0,
      explain: `Cette asymétrie est toute la subtilité : la validité devient publique tandis que les données restent privées. Le grand livre peut imposer « personne ne dépense ce qu’il n’a pas » sans jamais lire un solde.`,
    },
    {
      kind: "theory",
      body: `## Jetons confidentiels : masquer les montants

Les **Jetons confidentiels**, créés par **OpenZeppelin et Nethermind**, sont arrivés en préversion développeur en **juin 2026**. Leur conception s'intègre avec élégance à l'existant :

- Un **contrat enveloppe** peut recouvrir n’importe quel jeton **SEP‑41** — USDC via son contrat d’actif Stellar, jetons natifs de contrats, bref tout ce qui respecte la norme.
- Une fois tes jetons enveloppés, **ton solde et les montants transférés sont masqués** et protégés par des preuves à divulgation nulle de connaissance.
- **Les adresses restent publiques** : l’explorateur voit encore *qui* a transigé avec qui — juste pas *combien*.

Ce modèle convient aux parties qui se connaissent mais doivent garder les montants confidentiels : salaires, factures fournisseurs et règlements B2B.`,
    },
    {
      kind: "theory",
      body: `## Paiements privés Stellar : masquer les contreparties

Un voile de plus. **Paiements privés Stellar (SPP)**, créés par **Nethermind**, ont atteint la prévisualisation développeur sur testnet en **août 2026**.

Au lieu d’envelopper un jeton, les utilisateurs **déposent des actifs dans un pool partagé**. Les transferts se font ensuite *à l’intérieur* du pool — et un observateur extérieur ne peut plus relier l’expéditeur au récepteur. Pas seulement les montants : les **contreparties elles‑mêmes sont cachées**.

Alors que les jetons confidentiels conviennent aux parties qui se connaissent, SPP répond aux cas où *l'identité de celui qui paie et de celui qui reçoit* doit elle aussi rester secrète : dons, relations sensibles avec des fournisseurs ou finances personnelles sur une infrastructure publique.`,
    },
    {
      kind: "diagram",
      body: "Suis un paiement à travers le pool et regarde ce que l'explorateur conserve :",
      caption:
        "Les bords sont publics par construction. Tout ce que le pool protège se passe entre eux.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "deposit",
            label: "Dépôt",
            tone: "gold",
            note: "Visible. L'explorateur enregistre que ce compte a versé des fonds dans le pool, et combien. Rien n'est masqué ici — et rien n'a besoin de l'être.",
          },
          {
            id: "inside",
            label: "Dans le pool",
            tone: "accent",
            note: "Masqué. Les transferts entre membres du pool n'ont pas besoin d'apparaître on-chain : ni émetteur, ni destinataire, ni montant. C'est la part que le voile recouvre.",
          },
          {
            id: "withdraw",
            label: "Retrait",
            tone: "gold",
            note: "Visible à nouveau. Quelqu'un sort du pool avec une valeur — mais relier CETTE sortie à CETTE entrée-là est précisément ce que le pool casse.",
          },
          {
            id: "observer",
            label: "Ce qu'il reste à l'observateur",
            tone: "neutral",
            note: "Deux bords publics et une foule entre les deux. Plus le pool est grand, plus le lien entre une entrée et une sortie est faible.",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## La colonne vertébrale de conformité

Une confidentialité sans limites serait le cauchemar d’un responsable des sanctions ; ces systèmes refusent cette voie. SPP associe la confidentialité à des **garanties de conformité intégrées** :

- **Participation conditionnée KYC** — rejoindre le pool nécessite une identité vérifiée.
- **Contrôles d’accès liés à l'identité** — les permissions s’attachent à *qui tu es*, pas seulement à la clé que tu possèdes.
- **Capacité de gel au niveau compte** — les mauvais acteurs peuvent être arrêtés même à l’intérieur du voile.

Ces trois garde-fous sont appliqués par une pièce qu’il vaut la peine de connaître par son nom : l’**Association Set Provider (ASP)**. Un ASP publie un *ensemble* de dépôts dont il se porte garant — une allow list — ou ceux dont il refuse de se porter garant — une deny list. Pour retirer, tu prouves que tes fonds remontent à un dépôt situé dans cet ensemble, **sans révéler lequel**. SPP construit cela sur un association set fondé sur des clés, adossé à un registre public de clés pour que les participants puissent seulement être désignés.

Arrête-toi sur la conséquence, car c’est toute l’astuce : **le même retrait est à la fois privé et auditable**. Privé, parce que le lien avec ton dépôt précis n’est jamais publié. Auditable, parce que tu n’aurais pas pu retirer sans prouver ton appartenance à un ensemble cautionné. Des ASP différents peuvent servir des juridictions différentes — et c’est toi qui choisis la caution que tu portes.

L’objectif tient en une phrase : **la confidentialité pour les utilisateurs, pas pour le crime**. Des transferts à la fois confidentiels et conformes sur une infrastructure publique — c’est cette combinaison, et non le secret absolu, que les institutions attendaient.`,
    },
    {
      kind: "quiz",
      question: `Un explorateur regarde un transfert de Jeton confidentiel et un transfert de pool SPP. Que voit‑il dans chacun ?`,
      options: [
        "CT : les deux adresses mais pas le montant ; SPP : pas même les contreparties — valeur déplacée dans le pool partagé",
        "Les deux cachent montants et adresses de façon identique — SPP est juste le plus économique",
        "CT cache les adresses mais montre les montants ; SPP montre tout aux spectateurs KYC",
      ],
      answer: 0,
      explain: `Deux couches, deux voiles. Les jetons confidentiels cachent *combien* entre parties connues ; le pool partagé de SPP cache aussi *qui*. Choisis la couche qui correspond à ce que ton cas d’usage doit garder secret.`,
    },
    {
      kind: "fill",
      prompt: `Qu’est‑ce qu’un Jeton confidentiel peut envelopper ?`,
      file: "veil.txt",
      before: `jeton confidentiel  =  enveloppe ZK sur n’importe quel  `,
      after: `  jeton — montants cachés, adresses publiques`,
      choices: ["SEP‑41", "SEP‑24", "SEP‑10", "SEP‑1"],
      answer: 0,
      explain: `Le standard d’interface de jeton est l’ancrage : tout ce qui parle SEP‑41 peut être enveloppé — y compris les actifs classiques comme USDC via leur contrat d’actif Stellar. La couche de confidentialité se compose avec tout ce que tu connais déjà.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `Sur l’enclume de la Forge : un laboratoire **Jetons confidentiels**, où tu envelopperas un jeton testnet et verras les montants disparaître de l’explorateur tandis que les transferts continuent de se régler correctement. Sa carte indique *en cours de forge* — cette frontière est en train d’être martelée pendant que tu lis.

Remarque à quel point ces dates sont jeunes. Naviguer dans une technologie aussi fraîche signifie lire le pouls du protocole lui‑même — le dernier chapitre te montre comment.`,
    },
  ],
} satisfies JourneyConceptText;
