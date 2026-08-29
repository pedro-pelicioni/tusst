import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Pense avant de forger",
  tagline: "Les spécifications sont la compétence que l’IA ne peut pas faire pour toi.",
  steps: [
    {
      kind: "theory",
      body: `## Le piège du code à l'instinct

Une IA peut forger un contrat qui semble fonctionnel en trente secondes. Il compile. Il s'exécute. Il *démontre* même bien.

Et c'est exactement le piège : quand le code est bon marché, **"semble correct" et "est correct" deviennent indiscernables** — à moins que tu n'aies écrit, avant de commencer à forger, ce que signifie *correct*.

Cette chose écrite est une **spécification**. À l'ère des co-programmeurs IA, la spécification est la partie de l'ingénierie qui reste la tienne.`,
    },
    {
      kind: "theory",
      body: `## Ce qu'est réellement une spécification

Une spécification décrit **le comportement**, pas l'implémentation :

- **Ce qui doit se produire** — "le déposant peut récupérer les fonds après la date limite."
- **Ce qui ne doit jamais se produire** — "le solde du contrat ne doit jamais tomber en dessous de la somme des dépôts ouverts."
- **Les bords** — "et si la date limite est exactement *maintenant* ? et si le montant est zéro ?"

Elle ne dit **pas** quel boucle, quel clé de stockage ou quel crate. Deux implémentations très différentes peuvent toutes deux respecter la même spécification — cette liberté est ce qui rend les spécifications durables et compatibles IA.`,
    },
    {
      kind: "quiz",
      question: `Tu écris la spécification pour un contrat d'entiercement. Quelle phrase **appartient à la spécification** ?`,
      options: [
        "Les fonds ne peuvent être libérés que lorsque les deux parties ont signé.",
        "Stocke le dépôt dans une carte persistante indexée par un compteur u64.",
        "Utilise soroban-sdk 26 et l'extension pausable d'OpenZeppelin.",
      ],
      answer: 0,
      explain: `Le comportement appartient à la spécification ; l’implémentation reste en dehors. L’organisation du stockage et le choix des crates relèvent de l’implémentation ; la spécification décrit ce qui doit être vrai.`,
    },
    {
      kind: "theory",
      body: `## L'ambiguïté est là où les bugs vivent

Prenons une exigence apparemment innocente :

> "Le vendeur est remboursé après la date limite."

Trois ingénieurs — ou trois exécutions IA — le liront de trois façons :

1. Remboursé **automatiquement**, ou remboursé **lorsqu'ils demandent** ?
2. Après que la date limite **s'est passée**, ou **à** la date limite exactement ?
3. Le **montant total**, ou moins les frais ?

Aucune de ces lectures n'est une erreur de codage. Ce sont des **trous de spécification** — et chacun d'eux arrive comme un bug portant une suite de tests verte.`,
    },
    {
      kind: "quiz",
      question: `Voici une spécification, et trois implémentations forgées. **Laquelle respecte la spécification ?**

**SPEC — Escrow v1**
1. Le vendeur dépose une fois ; le montant est fixé à la création.
2. Les fonds sont libérés au vendeur uniquement lorsque **les deux** parties ont approuvé.
3. Après la date limite, **le vendeur** peut retirer les fonds **si la libération n'a pas eu lieu**.

---

**A** — libère au vendeur quand *l'une* des parties approuve ; après la date limite, le vendeur peut retirer.

**B** — libère au vendeur uniquement quand les deux approuvent ; après la date limite, *quiconque* peut déclencher le retrait, et les fonds vont au vendeur.

**C** — libère uniquement quand les deux approuvent ; après la date limite, le vendeur peut retirer — *même si la libération a déjà eu lieu*, en utilisant le solde restant du contrat.`,
      options: [
        "B — libération à deux parties honorée, et le remboursement atteint le vendeur selon la règle de la date limite",
        "A — ça semble plus pratique pour le vendeur",
        "C — le vendeur devrait toujours pouvoir sortir",
      ],
      answer: 0,
      explain: `A viole la règle 2 (l'un ≠ les deux). C viole la garde de la règle 3 ("si la libération n'a pas eu lieu") — il double dépense l'entiercement. B change *qui peut déclencher* le remboursement, ce que la spécification n'a jamais limité — les fonds atteignent toujours le vendeur, donc la spécification est honorée. Noter cette dernière distinction est toute la compétence.`,
    },
    {
      kind: "theory",
      body: `## Invariants : l'anneau de fer de la spécification

Les lignes les plus fortes d'une spécification sont les **invariants** — déclarations qui doivent rester vraies *à tout moment*, peu importe quelle fonction a été exécutée :

> solde de l'entiercement = dépôts ouverts − libérations − remboursements

Un invariant ne se soucie pas de la créativité de l'implémentation. S'il se rompt une fois, le code est incorrect. Quand tu rencontreras plus tard le **TDD** (chapitres suivants), tu transformeras ces lignes en tests exécutables — une spécification que la machine re-vérifie à chaque forge.`,
    },
    {
      kind: "fill",
      prompt: `Complète l'invariant de l'entiercement :`,
      file: "SPEC.md",
      before: `solde(séquestre) == dépôts − versements − `,
      after: ``,
      choices: ["remboursements", "frais", "bénéfice", "gas"],
      answer: 0,
      explain: `L'argent quitte l'entiercement exactement de deux façons — libérations au vendeur, remboursements au vendeur. Si ces trois termes ne s'équilibrent pas, quelqu'un a forgé un trou.`,
    },
    {
      kind: "quiz",
      question: `Ton IA partenaire a implémenté la spécification parfaitement. Tous les tests passent. En production, un vendeur retire *pendant* la transaction de libération et l'entiercement paie deux fois — un cas que ta spécification n'a jamais mentionné.

À qui revient le bug ?`,
      options: [
        "Le bug de la spécification — et donc le tien : l'artefact que tu possèdes avait un trou",
        "Le bug de l'IA — elle aurait dû deviner la règle manquante",
        "À personne — le comportement indéfini est acceptable",
      ],
      answer: 0,
      explain: `C'est le deal de l'ingénierie à l'ère IA : la machine forge à la lettre de la spécification, donc la lettre de la spécification est ta responsabilité. Renforce la spécification, reforge, et les deux lectures disparaissent.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## Le procès de l'examinateur : spécifie un pot de pourboires de guilde

Il est temps de forger une spécification de ta propre main. La commission :

> La guilde veut un **pot de pourboires** sur chaîne. N'importe qui peut y déposer des pourboires. Seul le **gardien** de la guilde peut récupérer ce qui est à l'intérieur. La guilde est paranoïaque à propos de deux choses : que le gardien prenne *plus* que le pot contient, et que les pourboires restent bloqués pour toujours si le gardien disparaît.

Écris la spécification — **seulement le comportement**, comme ce chapitre l'a enseigné : ce qui doit se produire, ce qui ne doit jamais se produire, et les bords. Un examinateur IA l'évaluera selon la grille ci-dessous (et elle note exactement comme le golem forge : à la lettre).`,
      rubric: `1. Seul le comportement — pas de dispositions de stockage, de crates ou de signatures de fonction.
2. La règle de dépôt et la règle de collecte sont chacune énoncées sans ambiguïté (qui peut agir, sur quoi).
3. Au moins un **invariant** qui doit rester vrai en tout temps.
4. Au moins un **cas limite** est abordé (pourboire à zéro, collecte de pot vide, collecte à solde exact…).
5. La préoccupation du "gardien disparaît" est résolue par un comportement déclaré (tout design raisonnable est accepté — la grille exige une décision, pas une spécificité).`,
      minChars: 120,
    },
    {
      kind: "theory",
      body: `## Ta route à partir d'ici

Chaque chapitre de ce Voyage fonctionne comme celui-ci : une discipline que l'IA ne portera pas pour toi, pratiquée sur **Stellar** — un vrai réseau avec une vraie machinerie.

Et chaque fois qu'un concept te pousse à curieux du métal lui-même, cherche la porte **"Voir en Rust"** : elle mène à la Campagne optionnelle, où les mêmes idées sont forgées à la main, affrontement par affrontement.

Ensuite : le royaume que tu vas construire — et comment des milliers de machines s'accordent sans un roi.`,
    },
  ],
} satisfies JourneyConceptText;
