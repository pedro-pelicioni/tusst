import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Le Donjon Propre",
  tagline: "Une loi : les dépendances de code source pointent vers l'intérieur, uniquement.",
  steps: [
    {
      kind: "theory",
      body: `## Le bastion et ses murs

L'architecture répond sans cesse à la même question : **quel élément a le droit de dépendre de quel autre ?**

Imagine un bastion. Dans le **cercle intérieur** vivent tes *entités* et *cas d'utilisation* — les règles qui rendent ton dApp à toi : qui peut libérer des fonds, quand un remboursement est dû. Dans le **cercle extérieur** vit le monde changeant : l'UI, la base de données, le SDK de la chaîne, le portefeuille.

La **règle de dépendance** est la seule loi du bastion : *les dépendances de code source pointent vers l'intérieur, uniquement.* Le cercle extérieur peut nommer l'intérieur. Le cercle intérieur ne nomme jamais — *jamais* — l'extérieur.`,
    },
    {
      kind: "theory",
      body: `## Pourquoi vers l'intérieur ?

Parce que les deux cercles vieillissent différemment. Les frameworks changent : de nouvelles versions majeures des SDK paraissent, les bibliothèques d'interface gagnent puis perdent en popularité et les bases de données sont remplacées. **Les règles métier survivent à tous ces changements** — « les deux parties doivent approuver » restera vrai quel que soit le framework qui les hébergera dans cinq ans.

Si ton domaine importe le SDK de la chaîne, chaque évolution majeure du SDK devient une *migration du domaine* : ton code le plus stable se retrouve prisonnier de la dépendance qui change le plus vite. Oriente les flèches vers l'intérieur et ces changements restent dans le cercle extérieur, où ils coûtent moins cher.

Le bastion est le point. Les frameworks sont le mobilier.`,
    },
    {
      kind: "diagram",
      body: "Le donjon, de l'extérieur vers l'intérieur :",
      caption: "Chaque flèche pointe vers l'intérieur. Le domaine n'apprend jamais le nom d'une base de données.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "infra",
            label: "infrastructure",
            note: "Postgres, Horizon, le système de fichiers, l'horloge. Remplaçables par définition.",
            tone: "neutral",
          },
          {
            id: "adapters",
            label: "adaptateurs",
            note: "Traduisent le monde extérieur dans les formes que l'intérieur parle déjà.",
            tone: "teal",
          },
          {
            id: "app",
            label: "application",
            note: "Cas d'usage : la séquence de mouvements du domaine qui répond à une requête.",
            tone: "accent",
          },
          {
            id: "domain",
            label: "domaine",
            note: "Les règles qui resteraient vraies sur papier. Il n'importe rien.",
            tone: "gold",
          },
        ],
      },
    },
    { kind: "widget", component: "dependency-rule",
      body: `La loi a une forme, et la prose ne sait pas la dessiner. **Activez quelques imports** et regardez où tombent les licites — puis percez un mur exprès et lisez ce que cela vous coûte.` },
    { kind: "theory", body: `## Chaque brèche était raisonnable

Personne n'enfreint la règle par malice. On l'enfreint un mardi, pour une bonne raison, avec une échéance sur le dos.

Le cas d'usage du séquestre a besoin de la séquence courante du registre pour savoir si l'échéance est passée. Le nombre est à un appel de \`server.ledgers()\`. Écrire un port pour cela, c'est une interface, un adaptateur, un faux pour les tests — vingt minutes pour un nombre qui est *juste là*. Alors le SDK est importé dans le domaine, avec un commentaire promettant de nettoyer plus tard.

Huit mois après, cet unique import a fait trois choses. Le domaine ne compile plus sans client réseau. Les tests du cas d'usage exigent un nœud qui tourne, donc ils sont devenus lents, donc on a cessé de les lancer. Et la version majeure du SDK est sortie, ce qui signifie désormais une migration **du domaine**.

Les vingt minutes étaient réelles. Les intérêts aussi.

La règle gagne sa place précisément les jours où elle ressemble à de la bureaucratie — car le jour où elle semblera nécessaire, le coût aura déjà été payé.` },
    {
      kind: "quiz",
      question: `Voici trois imports d'une dApp Stellar. Lequel **viole la règle de dépendance** ?`,
      options: [
        "domain/escrow.ts importe @stellar/stellar-sdk pour construire une transaction",
        "adapters/horizon.ts importe l'interface PaymentsPort depuis le domaine, afin de l'implémenter",
        "ui/ReleaseButton.tsx importe le cas d'utilisation release depuis le domaine, afin de l'appeler",
      ],
      answer: 0,
      explain: `Les deux autres sont le cercle extérieur qui nomme l'intérieur — la règle fonctionne exactement comme conçue. Le domaine qui importe le SDK est l'intérieur qui nomme l'extérieur : maintenant les pièces les plus profondes du bastion tremblent chaque fois qu'un fournisseur publie une version majeure.`,
    },
    {
      kind: "quiz",
      question: `Où se trouve l'odeur ?`,
      options: [
        "Un composant React qui décide lui‑même si les fonds d'entiercement peuvent être libérés, puis rend le bouton",
        "Un cas d'utilisation qui dépend d'une interface PaymentsPort et orchestre la libération",
        "Un adaptateur qui traduit les codes d'erreur Horizon vers les types d'erreur propres au domaine",
      ],
      answer: 0,
      explain: `Une règle métier vivant dans l'UI est invisible à tes tests de cœur et se duplique dans l'écran suivant qui en a besoin. Son jumeau miroir est le SQL dans le domaine — le cercle intérieur qui atteint vers l'extérieur. Règles vers le cœur, traduction vers le bord.`,
    },
    { kind: "fill",
      prompt: `Le test est mécanique — ouvrez un fichier du domaine et lisez ses imports :`,
      file: "domain/release-escrow.ts",
      before: `Un nom de framework ou d'éditeur dans cette liste d'imports signifie qu'`,
      after: ` .`,
      choices: ["un mur a été percé", "le fichier a besoin d'un commentaire explicatif", "l'import devrait être chargé paresseusement", "la version du framework est obsolète"],
      answer: 0,
      explain: `Celui-ci ne demande aucun jugement, et c'est bien l'idée : c'est un grep. Un fichier du domaine qui nomme \`@stellar/stellar-sdk\`, un ORM ou un hook React a déjà perdu le débat, aussi raisonnable qu'ait été la raison sur le moment.` },
    { kind: "theory", body: `## La loi, et le mécanisme manquant

Vous savez désormais dire dans quel sens chaque flèche doit pointer, et vérifier n'importe quel fichier en quelques secondes.

Ce que vous ne savez pas encore dire, c'est comment l'anneau intérieur **fait** quoi que ce soit. Il n'a pas le droit de nommer le SDK de la chaîne — mais un paiement doit tout de même partir. Il ne doit rien savoir d'une base de données — mais le séquestre doit bien être rangé quelque part. Une loi qui rend la chose utile impossible n'est pas une loi que l'on respecte.

**Ensuite :** les portes que le donjon perce dans ses propres murs, et qui a le droit de se tenir de l'autre côté.` },
  ],
  testOut: [
    { question: `Énoncez la règle de dépendance.`,
      options: ["Les dépendances de code source pointent uniquement vers l'intérieur — l'anneau extérieur peut nommer l'intérieur, jamais l'inverse","Chaque couche peut dépendre de la couche immédiatement en dessous, et pas au-delà","Les dépendances pointent vers le module qui change le moins souvent"], answer: 0 },
    { question: `Pourquoi vers l'intérieur plutôt que vers l'extérieur ?`,
      options: ["Les frameworks s'agitent et les règles métier leur survivent — pointer vers l'extérieur rend votre code le plus lent otage de votre dépendance la plus rapide","Les modules internes sont plus petits, donc ils compilent plus vite sans imports","C'est une convention qui facilite le tracé automatique des graphes de dépendances"], answer: 0 },
    { question: `Quel import enfreint la règle ?`,
      options: ["domain/escrow.ts important le SDK de la chaîne pour construire une transaction","adapters/horizon.ts important une interface du domaine afin de l'implémenter","ui/ReleaseButton.tsx important un cas d'usage afin de l'appeler"], answer: 0 },
    { question: `Un composant React décide si les fonds du séquestre peuvent être libérés, puis affiche le bouton. Où est le problème ?`,
      options: ["Une règle métier dans l'UI est invisible aux tests du cœur, et le prochain écran qui en aura besoin la dupliquera","Nulle part — décider près du rendu garde le code ensemble","Uniquement la performance : la vérification se rejoue à chaque rendu"], answer: 0 },
  ],
};
