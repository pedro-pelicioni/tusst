import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Pense avant de forger",
  tagline:
    "Les spécifications sont la compétence que l’IA ne peut pas exercer à ta place.",
  steps: [
    {
      kind: "theory",
      body: `## Le piège du code à l'instinct

Une IA peut forger en trente secondes un contrat qui semble fonctionner. Il compile. Il s'exécute. La *démo* est même convaincante.

Et c'est exactement le piège : quand le code est bon marché, **"semble correct" et "est correct" deviennent indiscernables** — à moins que tu n'aies écrit, avant de commencer à forger, ce que signifie *correct*.

Cette définition couchée par écrit est une **spécification**. À l'ère des co-programmeurs IA, la spécification est la part de l'ingénierie qui reste entre tes mains.`,
    },
    {
      kind: "theory",
      body: `## Ce qu'est réellement une spécification

Une spécification décrit **le comportement**, pas l'implémentation :

- **Ce qui doit se produire** — "le déposant peut récupérer les fonds après la date limite."
- **Ce qui ne doit jamais se produire** — "le solde du contrat ne doit jamais tomber en dessous de la somme des dépôts ouverts."
- **Les cas limites** — "et si la date limite tombe exactement *maintenant* ? et si le montant est nul ?"

Elle ne précise volontairement **pas** quelle boucle, quel format de stockage ni quelle bibliothèque utiliser. Deux implémentations très différentes peuvent respecter la même spécification — cette liberté rend les spécifications durables et adaptées au travail avec l'IA.`,
    },
    {
      kind: "quiz",
      question: `Tu écris la spécification pour un contrat d'entiercement. Quelle phrase **appartient à la spécification** ?`,
      options: [
        "Les fonds ne peuvent être libérés que lorsque les deux parties ont signé.",
        "Numérote chaque dépôt et conserve-les dans leur ordre d'arrivée.",
        "Construis-le avec la version la plus récente du kit de contrats et son bouton de pause déjà prêt.",
      ],
      answer: 0,
      explain: `Le comportement appartient à la spécification ; l’implémentation reste en dehors. L’organisation du stockage et le choix des outils relèvent de l’implémentation ; la spécification décrit ce qui doit être vrai.`,
    },
    {
      kind: "diagram",
      body: "La ligne que ce quiz vient de tracer, en général :",
      caption: "Deux implémentations de la même spécification peuvent n'avoir aucun air de famille. Cette liberté est précisément l'intérêt.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "spec",
            label: "appartient à la spécification",
            tone: "good",
          },
          {
            id: "forge",
            label: "appartient à la forge",
            tone: "neutral",
          },
        ],
        rows: [
          {
            label: "un exemple",
            cells: [
              {
                text: "les fonds ne sont libérés que si les deux parties ont signé",
                tone: "good",
              },
              {
                text: "garder les dépôts dans une liste numérotée",
                tone: "neutral",
              },
            ],
          },
          {
            label: "à qui elle est",
            cells: [
              {
                text: "à vous — elle survit à chaque réécriture",
                tone: "good",
              },
              {
                text: "à celui qui forge, cette fois-ci",
                tone: "neutral",
              },
            ],
          },
          {
            label: "quand elle change",
            cells: [
              {
                text: "quand le comportement doit changer",
                tone: "good",
              },
              {
                text: "dès qu'une voie plus rapide apparaît",
                tone: "neutral",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## L'ambiguïté est là où les bugs vivent

Prenons une exigence apparemment innocente :

> "L'acheteur est remboursé après la date limite."

Trois ingénieurs — ou trois exécutions IA — le liront de trois façons :

1. Est-il remboursé **automatiquement** ou **lorsqu'il le demande** ?
2. Le remboursement est-il possible une fois la date limite **dépassée**, ou **dès l'instant précis** où elle arrive ?
3. Le **montant total**, ou moins les frais ?

Aucune de ces interprétations n'est une erreur de programmation. Ce sont des **lacunes dans la spécification** — et chacune peut finir en production sous la forme d'un bug malgré une suite de tests au vert.`,
    },
    {
      kind: "quiz",
      question: `Voici une spécification, et trois implémentations forgées. **Laquelle respecte la spécification ?**

**SPEC — Escrow v1**
1. L'acheteur effectue un seul dépôt ; le montant est fixé à la création.
2. Les fonds ne sont libérés au vendeur que lorsque **l'acheteur et le vendeur** ont tous deux donné leur accord.
3. Après la date limite, **l'acheteur** peut retirer les fonds **si leur libération n'a pas encore eu lieu**.

---

**A** — libère les fonds au vendeur dès que *l'une* des parties donne son accord ; après la date limite, l'acheteur peut les retirer.

**B** — ne libère les fonds au vendeur que lorsque les deux parties donnent leur accord ; après la date limite, *n'importe qui* peut déclencher le retrait, mais les fonds reviennent à l'acheteur.

**C** — ne libère les fonds que lorsque les deux parties donnent leur accord ; après la date limite, l'acheteur peut les retirer — *même s'ils ont déjà été libérés* — en puisant dans le solde restant du contrat.`,
      options: [
        "B — l'accord des deux parties est respecté et le remboursement revient bien à l'acheteur selon la règle de la date limite",
        "A — ça semble plus pratique pour le vendeur",
        "C — l'acheteur devrait toujours pouvoir récupérer les fonds",
      ],
      answer: 0,
      explain: `A enfreint la règle 2 (l'un ≠ les deux). C enfreint la condition de la règle 3 ("si leur libération n'a pas encore eu lieu") et dépense deux fois les fonds sous séquestre. B change *qui peut déclencher* le remboursement, ce que la spécification ne limite pas ; les fonds reviennent toujours à l'acheteur, donc la spécification est respectée. Savoir repérer cette dernière nuance est précisément la compétence travaillée ici.`,
    },
    {
      kind: "theory",
      body: `## Invariants : l'anneau de fer de la spécification

Les lignes les plus fortes d'une spécification sont les **invariants** — déclarations qui doivent rester vraies *à tout moment*, peu importe quelle fonction a été exécutée :

> solde de l'entiercement = dépôts ouverts − libérations − remboursements

Un invariant ne se soucie pas de l'ingéniosité de l'implémentation. S'il est violé ne serait-ce qu'une fois, le code est incorrect. Lorsque tu aborderas le **TDD** dans les prochains chapitres, tu transformeras ces lignes en tests exécutables — une spécification que la machine vérifie à nouveau à chaque forge.`,
    },
    {
      kind: "fill",
      prompt: `Complète l'invariant de l'entiercement :`,
      file: "SPEC.md",
      before: `solde(séquestre) == dépôts − versements − `,
      after: ``,
      choices: ["remboursements", "frais", "bénéfice", "gas"],
      answer: 0,
      explain: `L'argent quitte le séquestre de deux façons exactement : par une libération au vendeur ou par un remboursement à l'acheteur. Si ces trois termes ne s'équilibrent pas, quelqu'un a laissé une faille dans la forge.`,
    },
    {
      kind: "quiz",
      question: `Ton IA partenaire a parfaitement implémenté la spécification. Tous les tests passent. En production, un acheteur retire les fonds *pendant* la transaction de libération et le séquestre paie deux fois — un cas que ta spécification n'a jamais mentionné.

À qui revient le bug ?`,
      options: [
        "C'est un bug de la spécification — et donc le tien : l'artefact dont tu es responsable comportait une lacune",
        "C'est un bug de l'IA — elle aurait dû deviner la règle manquante",
        "À personne — le comportement indéfini est acceptable",
      ],
      answer: 0,
      explain: `Voici le contrat de l'ingénierie à l'ère de l'IA : la machine forge à la lettre de la spécification ; le contenu de cette spécification relève donc de ta responsabilité. Précise-la, forge à nouveau et les deux interprétations disparaissent.`,
    },
    {
      kind: "exercise",
      mode: "spec-write",
      brief: `## L'épreuve de l'examinateur : rédige la spécification d'une cagnotte de pourboires de guilde

Il est temps de forger ta propre spécification. Voici la commande :

> La guilde veut un **pot de pourboires** sur chaîne. N'importe qui peut y déposer des pourboires. Seul le **gardien** de la guilde peut récupérer ce qui est à l'intérieur. La guilde est paranoïaque à propos de deux choses : que le gardien prenne *plus* que le pot contient, et que les pourboires restent bloqués pour toujours si le gardien disparaît.

Rédige la spécification en décrivant **uniquement le comportement**, comme ce chapitre te l'a appris : ce qui doit se produire, ce qui ne doit jamais se produire et les cas limites. Un examinateur IA l'évaluera selon la grille ci-dessous — il corrige exactement comme le golem forge : à la lettre.`,
      rubric: `1. Uniquement le comportement — aucun agencement de stockage, bibliothèque ou signature de fonction.
2. La règle de dépôt et la règle de collecte sont chacune énoncées sans ambiguïté (qui peut agir, sur quoi).
3. Au moins un **invariant** qui doit rester vrai en tout temps.
4. Au moins un **cas limite** est abordé (pourboire à zéro, collecte de pot vide, collecte à solde exact…).
5. La crainte de voir le gardien disparaître est résolue par un comportement explicite (toute conception raisonnable est acceptée — la grille exige une décision, pas une solution particulière).`,
      minChars: 120,
    },
    {
      kind: "theory",
      body: `## Ta route à partir d'ici

Chaque chapitre de ce Voyage suit le même principe : tu pratiques sur **Stellar** — un véritable réseau doté de mécanismes bien réels — une discipline que l'IA ne peut pas exercer à ta place.

Et chaque fois qu'un concept éveille ta curiosité pour le métal sous la surface, cherche la porte **"Voir en Rust"** : elle mène à la Campagne facultative, où les mêmes idées sont forgées à la main, affrontement après affrontement.

Ensuite : le royaume que tu vas construire — et comment des milliers de machines s'accordent sans un roi.`,
    },
  ],
  testOut: [
    { question: `Pourquoi une spécification est-elle la part d'ingénierie qui reste la vôtre à l'ère de l'IA ?`,
      options: ["Quand le code est bon marché, « a l'air juste » et « est juste » deviennent indiscernables, sauf si vous avez écrit d'abord ce que juste veut dire","Parce que les modèles ne savent pas lire les spécifications, un humain doit donc les porter","Parce qu'une spécification s'écrit plus vite que du code et fait gagner du temps"], answer: 0 },
    { question: `Que décrit une spécification ?`,
      options: ["Le comportement — ce qui doit arriver, ce qui ne doit jamais arriver, et les cas limites","L'implémentation, assez précisément pour que n'importe quel dev produise le même code","La disposition du stockage et les signatures des fonctions publiques"], answer: 0 },
    { question: `Deux implémentations très différentes satisfont votre spécification. Qu'est-ce que cela signifie ?`,
      options: ["La spécification fait son travail — elle contraint le comportement et laisse l'implémentation libre","La spécification est trop vague et il lui manque du détail d'implémentation","L'une des deux implémentations est forcément fausse"], answer: 0 },
    { question: `Laquelle de ces phrases appartient à une spécification ?`,
      options: ["« Le solde du contrat ne descend jamais sous la somme des dépôts ouverts »","« Stocker les dépôts dans une map persistante indexée par adresse »","« Utiliser le SDK le plus récent et garder le code propre »"], answer: 0 },
  ],
} satisfies JourneyConceptText;
