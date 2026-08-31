import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Le Registre Voilé",
  tagline: "Zero-knowledge et jetons confidentiels : preuve sans divulgation.",
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
    { kind: "theory", body: `## Le voile que vous n'avez pas tiré

C'est ici qu'on se détend trop tôt. Vous avez enveloppé la paie dans un jeton confidentiel, les montants se sont éteints, et le problème paraît réglé.

Regardez ce qu'un observateur possède encore. Une adresse paie quarante adresses. Elle le fait le premier de chaque mois, puis de nouveau le quinze. Deux de ces quarante ont cessé de recevoir en mars, et trois nouvelles ont commencé en avril. L'une d'elles reçoit de votre adresse et de celle d'une seconde entreprise.

Personne n'a appris un seul salaire — et un observateur connaît désormais votre effectif, votre cycle de paie, votre attrition, vos embauches, et lesquels de vos salariés cumulent. **Les montants n'ont jamais été la seule chose que le registre disait.**

Ce n'est pas un défaut des jetons confidentiels ; c'est la forme de ce qu'ils promettent. Un voile couvre le champ que vous avez choisi, et chaque champ découvert continue de parler — l'horaire, la fréquence, et surtout le **graphe** de qui touche qui.

C'est très exactement pourquoi un second système, plus profond, devait exister.` },
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
    { kind: "rustBranch", lessonSlug: "stellar-protocol-27-1",
      body: `Rien de tout cela n'était une bibliothèque publiée par quelqu'un. BLS12-381, BN254, Poseidon — chacun est arrivé comme un **CAP dans une version nommée du protocole**, et c'est pourquoi un contrat vérifie une preuve à vitesse native au lieu de payer une pénalité au millième pour faire de la cryptographie honnêtement. L'acte protocole de la Campagne est l'endroit où l'on voit une version atterrir pour de vrai.` },
    { kind: "theory", body: `## La moitié qui semble impossible

Vous avez désormais un voile pour les nombres. Pour la paie, les factures, le règlement entre parties qui se connaissent déjà, c'est toute l'exigence — les chiffres étaient le secret.

Mais parfois les chiffres ne sont pas le secret. Parfois *qui a payé qui* est la partie sensible : un don, un fournisseur que vous préféreriez que vos concurrents ignorent, un virement personnel sur des rails publics.

Masquer cela, c'est le voile le plus profond, et il arrive avec une objection évidente — celle que tout responsable conformité soulève dès la première minute, et qu'il vaut mieux prendre au sérieux que balayer d'un revers de main.

**Ensuite :** le second voile, et la réponse à cette objection.` },
  ],
  testOut: [
    { question: `Quel est le problème d'un registre entièrement transparent, pour une entreprise ?`,
      options: ["Les soldes et les montants sont publics à jamais : n'importe qui déduit salaires, marges et conditions fournisseurs à partir de paiements ordinaires","Les transactions peuvent être retracées et annulées par des observateurs","Les données publiques rendent le registre plus lent à interroger à grande échelle"], answer: 0 },
    { question: `Que permet de conclure à un vérificateur une preuve à divulgation nulle ?`,
      options: ["Qu'une affirmation portant sur des valeurs masquées est vraie, sans rien apprendre d'autre sur ces valeurs","Que le prouveur est une partie de confiance, vérifiée par un tiers","Que les valeurs masquées tombent dans un intervalle choisi par le vérificateur"], answer: 0 },
    { question: `Pourquoi ces primitives devaient-elles arriver comme fonctions hôtes du protocole ?`,
      options: ["Pour que les contrats vérifient les preuves à vitesse native — les mêmes calculs en code de contrat coûteraient une pénalité écrasante","Parce que les contrats n'ont pas le droit de faire de la cryptographie","Pour que seuls les contrats audités puissent les utiliser"], answer: 0 },
    { question: `Un jeton confidentiel enveloppe un jeton existant. Qu'est-ce qui change, et qu'est-ce qui ne change pas ?`,
      options: ["Les soldes et les montants de transfert deviennent masqués ; les adresses qui transigent restent publiques","Les adresses deviennent masquées ; les montants restent publics","Les deux deviennent masqués, et c'est ce qui le rend confidentiel"], answer: 0 },
  ],
};
