import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Le Bastion Propre",
  tagline: "Architecture propre et hexagonale — chaque pièce à sa place.",
  steps: [
    {
      kind: "theory",
      body: `## Le bastion et ses murs

L'architecture est une décision prise à maintes reprises : **ce qui est autorisé à dépendre de quoi.**

Imagine un bastion. Dans le **cercle intérieur** vivent tes *entités* et *cas d'utilisation* — les règles qui rendent ton dApp à toi : qui peut libérer des fonds, quand un remboursement est dû. Dans le **cercle extérieur** vit le monde changeant : l'UI, la base de données, le SDK de la chaîne, le portefeuille.

La **règle de dépendance** est la seule loi du bastion : *les dépendances de code source pointent vers l'intérieur, uniquement.* Le cercle extérieur peut nommer l'intérieur. Le cercle intérieur ne nomme jamais — *jamais* — l'extérieur.`,
    },
    {
      kind: "theory",
      body: `## Pourquoi vers l'intérieur ?

Parce que les deux cercles vieillissent différemment. Les frameworks changent : les majeurs du SDK arrivent, les bibliothèques UI montent et tombent, les bases de données sont remplacées. **Les règles métier survivent à tout ça** — "les deux parties doivent approuver" restera vrai quel que soit le framework qui l'héberge dans cinq ans.

Si ton domaine importe le SDK de la chaîne, chaque changement majeur du SDK devient une *migration de domaine* — ton code le plus lent à changer est retenu prisonnier par ta dépendance la plus rapide. Oriente les flèches vers l'intérieur et le churn reste dans le cercle extérieur, où c'est bon marché.

Le bastion est le point. Les frameworks sont le mobilier.`,
    },
    {
      kind: "quiz",
      question: `Trois imports d'un dApp Stellar. Lequel **violation la règle de dépendance** ?`,
      options: [
        "domain/escrow.ts importe @stellar/stellar-sdk pour construire une transaction",
        "adapters/horizon.ts importe l'interface PaymentsPort depuis le domaine, afin de l'implémenter",
        "ui/ReleaseButton.tsx importe le cas d'utilisation release depuis le domaine, afin de l'appeler",
      ],
      answer: 0,
      explain: `Les deux autres sont le cercle extérieur qui nomme l'intérieur — la règle fonctionne exactement comme conçue. Le domaine qui importe le SDK est l'intérieur qui nomme l'extérieur : maintenant les pièces les plus profondes du bastion tremblent chaque fois qu'un fournisseur publie une version majeure.`,
    },
    {
      kind: "theory",
      body: `## Ports et adaptateurs

Comment le cercle intérieur *utilise* la chaîne sans la nommer ? Il déclare un **port** — une interface que le domaine possède, écrite dans le langage propre au domaine :

> PaymentsPort : envoyer un paiement, lire un solde, surveiller l'arrivée.

Au bord, **les adaptateurs** implémentent le port : un *adaptateur Horizon* aujourd'hui, un *adaptateur RPC Soroban* pour les contrats, un *adaptateur factice* pour les tests. Changer de fournisseur RPC ? Un nouvel adaptateur. Passer de testnet à mainnet ? Une configuration. **Le cœur ne l'entend jamais.**

Le domaine parle au port. Le monde se branche sur le port. C'est l'architecture hexagonale en une phrase.`,
    },
    {
      kind: "fill",
      prompt: `Le bastion parle au port, jamais au fournisseur :`,
      file: "domain/release-escrow.ts",
      before: `constructor(private payments: `,
      after: `) {}`,
      choices: ["PaymentsPort", "HorizonClient", "SorobanServer", "FreighterApi"],
      answer: 0,
      explain: `Les trois autres sont réels et utiles — et ils appartiennent aux adaptateurs, derrière le port. Le cas d'utilisation ne nomme que l'interface qu'il possède, c'est pourquoi un adaptateur factice peut se substituer pendant les tests et qu'un nouveau fournisseur RPC ne touche jamais ce fichier.`,
    },
    {
      kind: "theory",
      body: `## Où tout vit

Une requête traverse les murs comme ceci :

**UI** (extérieur) → **cas d'utilisation** (intérieur) → **port** (bord intérieur) → **adaptateur** (extérieur) → réseau.

- Composants React, routes, styles — **extérieur**.
- Postgres, ORM, migrations — **extérieur**.
- stellar-sdk, clients RPC, le pont portefeuille — **extérieur**.
- "Libération des fonds uniquement quand les deux sont approuvés" — **intérieur**, dans un module qui n'importe *rien* de la liste ci-dessus.

Le test d'odeur est mécanique : ouvre un fichier de domaine et lis ses imports. Un nom de framework dans cette liste signifie qu'un mur est franchi.`,
    },
    {
      kind: "theory",
      body: `## L'île testable

Un cœur sans imports de framework est une **île pure** : construis‑le en test, donne‑lui un adaptateur factice, affirme sur le comportement. Pas de réseau, pas de chaîne dockerisée, pas de RPC instable — les essais du Rite Rouge‑Vert, exécutés en **millisecondes**.

C'est le gain silencieux et cumulé : les équipes avec des bastions propres écrivent plus de tests *parce que les tests sont bon marché*, et les essais bon marché signifient des boucles serrées — pour les humains et les golems à la fois.

Les adaptateurs gagnent toujours leurs propres tests contre le réseau réel — une couche mince et honnête, testée séparément à sa propre vitesse plus lente.`,
    },
    {
      kind: "quiz",
      question: `Où se trouve l'odeur ?`,
      options: [
        "Un composant React qui décide lui‑même si les fonds d'entiercement peuvent être libérés, puis rend le bouton",
        "Un cas d'utilisation qui dépend d'une interface PaymentsPort et orchestre la libération",
        "Un adaptateur qui traduit les codes d'erreur Horizon en les types d'erreur propres au domaine",
      ],
      answer: 0,
      explain: `Une règle métier vivant dans l'UI est invisible à tes tests de cœur et se duplique dans l'écran suivant qui en a besoin. Son jumeau miroir est le SQL dans le domaine — le cercle intérieur qui atteint vers l'extérieur. Règles vers le cœur, traduction vers le bord.`,
    },
    {
      kind: "quiz",
      question: `Ton fournisseur RPC annonce une fermeture. Dans un bastion construit sur ports et adaptateurs, qu'est-ce qui doit changer ?`,
      options: [
        "Un adaptateur, plus le câblage qui le sélectionne — le domaine et les cas d'utilisation ne changent pas du tout",
        "Chaque cas d'utilisation qui envoie un paiement, puisque chacun d'eux appelle le fournisseur",
        "Les entités du domaine, puisque l'URL du point de terminaison est stockée sur elles",
      ],
      answer: 0,
      explain: `C'est le ROI de l'architecture en une ligne : le churn du fournisseur est tarifé à un adaptateur. Si la réponse honnête dans ton codebase est « chaque cas d'utilisation », les flèches de dépendance pointent dans la mauvaise direction.`,
    },
    {
      kind: "theory",
      body: `## Petits murs, petits prompts

Voici ce que le bastion t'offre à l'ère de l'IA : **les modules bien délimités sont de bons prompts bien délimités.**

« Réécris l'adaptateur Horizon pour cibler le nouveau RPC — voici le port qu'il doit satisfaire, voici ses tests » est une tâche qu'un golem accomplit *dans une boîte* : un seul fichier de contexte, un contrat à satisfaire, des essais à passer, et des murs qui limitent le rayon d'explosion. Le golem reconstruit une pièce sans jamais errer dans le bastion.

La prochaine discipline : le golem lui‑même — et le banc que tu dois construire autour de lui.`,
    },
  ],
} satisfies JourneyConceptText;
