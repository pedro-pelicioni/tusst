import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Le bastion propre",
  tagline: "Architecture propre et hexagonale — chaque pièce à sa place.",
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
      choices: [
        "PaymentsPort",
        "HorizonClient",
        "SorobanServer",
        "FreighterApi",
      ],
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

Le contrôle est mécanique : ouvre un fichier du domaine et lis ses imports. Si tu y trouves le nom d'un framework, un mur a été franchi.`,
    },
    {
      kind: "theory",
      body: `## L'île testable

Un cœur sans import de framework est une **île pure** : instancie-le dans un test, fournis-lui un adaptateur factice et vérifie son comportement. Aucun réseau, aucun nœud conteneurisé, aucun RPC instable — les tests du Rite rouge-vert s'exécutent en **quelques millisecondes**.

C'est un gain discret mais cumulatif : les équipes dont les bastions sont propres écrivent davantage de tests *parce qu'ils sont peu coûteux*, et des tests rapides permettent des boucles de rétroaction courtes — pour les humains comme pour les golems.

Les adaptateurs gagnent toujours leurs propres tests contre le réseau réel — une couche mince et honnête, testée séparément à sa propre vitesse plus lente.`,
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
    {
      kind: "quiz",
      question: `Ton fournisseur RPC annonce une fermeture. Dans un bastion construit sur ports et adaptateurs, qu'est-ce qui doit changer ?`,
      options: [
        "Un adaptateur, plus le câblage qui le sélectionne — le domaine et les cas d'utilisation ne changent pas du tout",
        "Chaque cas d'utilisation qui envoie un paiement, puisque chacun d'eux appelle le fournisseur",
        "Les entités du domaine, puisque l'URL du point de terminaison est stockée sur elles",
      ],
      answer: 0,
      explain: `Voilà le bénéfice de cette architecture en une phrase : un changement de fournisseur ne coûte qu'un adaptateur. Si, dans ta base de code, la réponse honnête est « chaque cas d'utilisation », les flèches de dépendance pointent dans la mauvaise direction.`,
    },
    {
      kind: "theory",
      body: `## Petits murs, petits prompts

Voici ce que le bastion t'offre à l'ère de l'IA : **les modules bien délimités sont de bons prompts bien délimités.**

« Réécris l'adaptateur Horizon pour cibler le nouveau RPC : voici le port qu'il doit respecter et les tests qu'il doit réussir » est une tâche que le golem peut accomplir *dans une boîte* : un seul fichier de contexte, un contrat à satisfaire, des tests à réussir et des murs qui limitent le rayon d'impact. Il reconstruit une pièce sans jamais errer dans le bastion.

Prochaine discipline : le golem lui-même — et l'établi que tu dois construire autour de lui.`,
    },
  ],
} satisfies JourneyConceptText;
