import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Les Portes du Donjon",
  tagline: "Ports et adaptateurs — le domaine déclare la porte, le monde s'y ajuste.",
  steps: [
    {
      kind: "theory",
      body: `## Ports et adaptateurs

Comment le cercle intérieur *utilise* la chaîne sans la nommer ? Il déclare un **port** — une interface que le domaine possède, écrite dans le langage propre au domaine :

> PaymentsPort : envoyer un paiement, lire un solde, surveiller l'arrivée.

Au bord, **les adaptateurs** implémentent le port : un *adaptateur Horizon* aujourd'hui, un *adaptateur RPC Soroban* pour les contrats, un *adaptateur factice* pour les tests. Changer de fournisseur RPC ? Un nouvel adaptateur. Passer de testnet à mainnet ? Une configuration. **Le cœur ne l'entend jamais.**

Le domaine parle au port. Le monde se branche sur le port. C'est l'architecture hexagonale en une phrase.`,
    },
    { kind: "diagram",
      body: "Une requête, franchissant tous les murs :",
      caption: "La flèche s'inverse au port. Tout ce qui est à sa gauche est la langue du donjon ; tout ce qui est à droite est celle de quelqu'un d'autre.",
      view: { kind: "flow", layout: "row", play: true, nodes: [
        { id: "ui", label: "ui", note: "Extérieur. Recueille l'intention et appelle vers l'intérieur. N'a aucune règle propre.", tone: "neutral" },
        { id: "usecase", label: "cas d'usage", note: "Intérieur. Décide ce qui doit arriver, dans les mots du domaine.", tone: "accent" },
        { id: "port", label: "port", note: "Le bord intérieur — une interface que le DOMAINE possède et nomme. C'est la porte.", tone: "gold" },
        { id: "adapter", label: "adaptateur", note: "Extérieur. Implémente le port dans la langue de l'éditeur, et retraduit.", tone: "teal" },
        { id: "network", label: "réseau", note: "Horizon, RPC, une base, un faux en test. Interchangeable par construction.", tone: "good" },
      ] } },
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
    { kind: "theory", body: `## Le port qui fuit

Un port peut respecter la règle de dépendance et la trahir quand même. Regardez :

> \`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`

Rien ici n'importe un adaptateur — la flèche pointe toujours du bon côté, et le linter est content. Mais la *signature* parle la langue de l'éditeur. Le domaine pense désormais en \`TransactionBuilder\`, et chaque cas d'usage qui touche ce port a appris, en silence, un type Horizon.

Changez de fournisseur et l'interface change. Donc tous les appelants changent. Ce qui était exactement la chose que le port devait empêcher.

**Un port appartient au domaine, il doit donc s'écrire dans les mots du domaine :**

> \`PaymentsPort.send(to: AccountId, amount: Money): Promise<PaymentReceipt>\`

Tout le travail de l'adaptateur est la traduction entre ces deux vocabulaires. Si rien n'est traduit au bord, le bord ne fait rien — et la porte est un trou.` },
    {
      kind: "theory",
      body: `## L'île testable

Un cœur sans import de framework est une **île pure** : instancie-le dans un test, fournis-lui un adaptateur factice et vérifie son comportement. Aucun réseau, aucun nœud conteneurisé, aucun RPC instable — les tests du Rite rouge-vert s'exécutent en **quelques millisecondes**.

C'est un gain discret mais cumulatif : les équipes dont les bastions sont propres écrivent davantage de tests *parce qu'ils sont peu coûteux*, et des tests rapides permettent des boucles de rétroaction courtes — pour les humains comme pour les golems.

Les adaptateurs gagnent toujours leurs propres tests contre le réseau réel — une couche mince et honnête, testée séparément à sa propre vitesse plus lente.`,
    },
    { kind: "theory", body: `## Le changement, compté

Une équipe au donjon propre passe de Horizon à un fournisseur RPC Soroban. Voici le diff entier, fichier par fichier :

- **\`adapters/soroban-rpc.ts\`** — nouveau, ~120 lignes. Implémente \`PaymentsPort\`, traduit les erreurs du fournisseur vers les types d'erreur propres au domaine.
- **\`wiring/container.ts\`** — une ligne changée, choisissant quel adaptateur construire.
- **\`adapters/soroban-rpc.test.ts\`** — nouveau, testé contre le vrai réseau, à son propre rythme plus lent.

Et la liste des fichiers qui n'ont **pas** changé : chaque entité, chaque cas d'usage, chaque test du domaine. Non parce que quelqu'un a fait attention pendant la migration — mais parce que rien là-dedans ne pouvait nommer l'ancien fournisseur, pour commencer.

Voilà à quoi sert vraiment l'architecture. Pas à l'élégance : **la feuille de route d'un éditeur au prix d'un fichier et d'une ligne.**` },
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
    { kind: "exercise", mode: "spec-write",
      brief: `## L'épreuve de l'examinateur : déclarez les portes

Un cas d'usage, énoncé dans les mots du domaine :

> **Libérer un séquestre.** Quand les deux parties ont approuvé et que l'échéance n'est pas passée, le montant séquestré va au vendeur et le séquestre est clos. Si l'échéance est passée et qu'une seule partie a approuvé, il retourne à l'acheteur.

Déclarez les **ports** dont ce cas d'usage a besoin — les portes que le domaine possède. Pour chacun : à quoi il sert, et la forme de ce qui entre et de ce qui revient, **dans le vocabulaire du domaine**. Puis nommez un adaptateur que vous écririez pour chacun, et une chose que cet adaptateur doit traduire.`,
      rubric: `1. Déclare au moins deux ports, chacun avec un but énoncé.
2. Les entrées et sorties de chaque port sont nommées en termes de DOMAINE — pas de types d'éditeur, pas de noms de classe de SDK, pas de vocabulaire HTTP ou SQL.
3. Nomme au moins un adaptateur concret par port.
4. Énonce au moins une chose qu'un adaptateur doit traduire entre le vocabulaire de l'éditeur et celui du domaine.
5. La décision propre au cas d'usage (qui reçoit les fonds, et quand) reste dans le cas d'usage — elle n'est pas déléguée à un port.`,
      minChars: 180 },
    {
      kind: "theory",
      body: `## Petits murs, petits prompts

Voici ce que le bastion t'offre à l'ère de l'IA : **les modules bien délimités sont de bons prompts bien délimités.**

« Réécris l'adaptateur Horizon pour cibler le nouveau RPC : voici le port qu'il doit respecter et les tests qu'il doit réussir » est une tâche que le golem peut accomplir *dans une boîte* : un seul fichier de contexte, un contrat à satisfaire, des tests à réussir et des murs qui limitent le rayon d'impact. Il reconstruit une pièce sans jamais errer dans le bastion.

Prochaine discipline : le golem lui-même — et l'établi que tu dois construire autour de lui.`,
    },
  ],
  testOut: [
    { question: `Comment l'anneau intérieur utilise-t-il la chaîne sans la nommer ?`,
      options: ["Il déclare un port — une interface que le domaine possède et rédige dans ses propres mots — et un adaptateur l'implémente au bord","Il importe le SDK mais enveloppe chaque appel dans un try/catch pour contenir le couplage","Il appelle directement l'adaptateur, les adaptateurs étant l'affaire de l'anneau extérieur"], answer: 0 },
    { question: `\`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`. La flèche pointe vers l'intérieur. Qu'est-ce qui ne va toujours pas ?`,
      options: ["La signature parle la langue de l'éditeur : changer de fournisseur change l'interface, et tous les appelants avec elle","Rien — la règle de dépendance est respectée et c'est tout le test","Elle renvoie une Promise, ce qui couple le domaine au runtime asynchrone"], answer: 0 },
    { question: `Votre fournisseur RPC annonce sa fermeture. Dans un donjon à ports et adaptateurs, qu'est-ce qui change ?`,
      options: ["Un adaptateur, plus le câblage qui le sélectionne — le domaine et les cas d'usage ne changent pas du tout","Chaque cas d'usage qui envoie un paiement, puisque chacun appelle le fournisseur","Les entités du domaine, puisque l'endpoint y est stocké"], answer: 0 },
    { question: `Pourquoi un cœur sans framework rend-il la boucle du Rite moins coûteuse ?`,
      options: ["Il se construit dans un test avec un faux adaptateur et vérifie en millisecondes — sans réseau, sans conteneur, sans instabilité","Il compile en un binaire plus petit, donc le lanceur de tests démarre plus vite","Il supprime le besoin de tests d'adaptateurs, divisant la suite par deux"], answer: 0 },
  ],
};
