import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Le rite rouge-vert",
  tagline: "TDD : tests d'abord, forge ensuite.",
  steps: [
    {
      kind: "theory",
      body: `## La spécification se dote de dents

Dans le chapitre I, tu as appris à définir ce que signifie *être correct*. Un **test** rend cette définition exécutable : la machine peut vérifier la spécification en quelques millisecondes, à chaque forge.

C’est plus important avec l’IA, pas moins. Un golem peut débattre avec ta prose, réinterpréter ton intention, « améliorer » tes exigences. Il ne peut pas débattre avec \`assert_eq!\`. **Les tests sont la spécification que la machine ne peut pas contester** — le seul endroit où une réponse plausible et une réponse correcte ne sont plus confondues.

Écris-les **d’abord** : chaque forge suivante disposera ainsi de critères d'évaluation dès sa naissance.`,
    },
    {
      kind: "theory",
      body: `## Le rite : rouge, vert, refactorisation

Le TDD est un rite à trois temps, et l’ordre est le point :

1. **Rouge** — écris un petit test pour un comportement qui n’existe pas encore. Lance‑le. **Regarde‑le échouer.**
2. **Vert** — écris le code le plus simple qui le fait passer. Pas le plus astucieux. Le plus simple.
3. **Refactorisation** — le filet est désormais en place ; améliore le code. Les tests te protègent pendant que tu réorganises les éléments.

Le rouge prouve que le test peut attraper le bug qu’il protège. Le vert prouve que le comportement existe. Le refactor est l’endroit où le bon code est réellement créé — *en toute sécurité*.`,
    },
    {
      kind: "diagram",
      body: "Trois mouvements, pour toujours :",
      caption: "L'ordre EST la discipline : un test écrit après le code prouve seulement que le code fait ce qu'il fait.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          {
            id: "red",
            label: "rouge",
            note: "Écrivez l'épreuve d'abord et regardez-la échouer. Un test qui n'a jamais échoué ne prouve rien.",
            tone: "bad",
          },
          {
            id: "green",
            label: "vert",
            note: "Le plus petit changement qui la fait passer. Pas l'élégant — le plus petit.",
            tone: "good",
          },
          {
            id: "refactor",
            label: "refactoriser",
            note: "Maintenant rendez-le bon, l'épreuve tenant le comportement immobile pendant que vous déplacez.",
            tone: "accent",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Ton partenaire IA livre une fonctionnalité *et* son nouveau test. Tu lances la suite : tout est vert dès la première tentative. Que dois-tu encore restituer au rite ?`,
      options: [
        "Annuler la fonctionnalité (ou la rétablir) et regarder le nouveau test devenir rouge — un test qui n’a jamais échoué peut ne rien tester",
        "Rien — vert dès le premier passage est le meilleur résultat possible",
        "Relancer la suite quelques fois de plus pour s’assurer que le vert est stable",
      ],
      answer: 0,
      explain: `Quand le même golem forge à la fois le code et ses tests, un test qui affirme trop peu reste vert pour toujours. Le rouge est la seule preuve qu’un test a des dents — une rupture délibérée te montre qu’il mord.`,
    },
    {
      kind: "theory",
      body: `## Anatomie d’un bon test

Un bon test unitaire se lit en trois temps — **préparer, agir, vérifier** :

- **Préparer** — construis le contexte : un contrat d’entiercement contenant un dépôt et une date limite déjà dépassée.
- **Agir** — fais *une* chose : l’acheteur appelle le remboursement.
- **Vérifier** — contrôle *un* comportement : le solde de l’acheteur a augmenté du montant du dépôt.

Un comportement par test, et un nom qui le décrit : \`refund_after_deadline_returns_deposit\`. Quand ce test échoue, l’échec *est* le diagnostic — pas d’archéologie nécessaire.`,
    },
    {
      kind: "quiz",
      question: `Un seul test dépose, approuve, libère, rembourse, et affirme sur quatre comportements différents. Ce soir il est rouge. Quel est le vrai problème de ce test ?`,
      options: [
        "Quand il échoue tu ne sais pas quel comportement a échoué — un test à plusieurs comportements transforme chaque échec en archéologie",
        "Rien — plus d’assertions par test signifie toujours plus de protection",
        "Il est trop lent — la solution est de le fusionner avec d’autres tests en un seul encore plus grand",
      ],
      answer: 0,
      explain: `La couverture n’est pas le problème — le diagnostic l’est. Quatre tests ciblés attrapent les mêmes bugs, et celui qui devient rouge *nomme* le comportement cassé gratuitement.`,
    },
    {
      kind: "theory",
      body: `## De l’exemple aux invariants

Un test fondé sur un exemple vérifie un point précis : *cette* entrée produit *cette* sortie. **Le raisonnement par propriétés** établit une loi qui doit rester vraie pour *toute* entrée.

Tes invariants du chapitre I sont exactement ces lois :

> solde de l’entiercement = dépôts − libérations − remboursements

Vérifie-le après *chaque* opération effectuée par tes tests — dépôt, libération, remboursement, ordres inhabituels — et tu obtiens un filet de sécurité couvrant tout l’espace d’état, pas une simple clôture autour d’un exemple. Chaque invariant de ta spécification mérite au moins une assertion vérifiée en permanence.`,
    },
    {
      kind: "fill",
      prompt: `Transforme l’invariant du chapitre I en un test exécutable :`,
      file: "escrow_test.rs",
      before: `assert_eq!(escrow.balance(), deposits - releases - `,
      after: `);`,
      choices: ["refunds", "fees", "interest", "gas"],
      answer: 0,
      explain: `Le même anneau de fer qu'au chapitre I, désormais doté de dents : l’argent ne quitte l’entiercement que sous forme de libération ou de remboursement. Formulé comme une assertion, il est vérifié automatiquement à chaque forge.`,
    },
    {
      kind: "theory",
      body: `## Accepter le travail du golem sans peur

Voici le gain. Une IA te remet 300 lignes. Sans tests, tes options sont *lire chaque ligne très attentivement* ou *faire confiance*. Les deux échouent à l’échelle.

Avec une suite écrite d’abord, l’acceptation est mécanique : **rouge — rejeter**, avec l’échec comme retour. **Vert — accepter**, et lire pour le style à ton rythme.

Le même filet permet de refactoriser sans crainte — qu'il s'agisse de ton travail ou de celui du golem. « Réécris ce module en gardant les tests au vert » n'est une instruction sûre *que parce que* les tests existaient déjà et que le golem n'a pas pu les adapter à son propre code.`,
    },
    {
      kind: "quiz",
      question: `Le golem annonce fièrement **100 % de couverture de lignes**. Qu’as‑tu réellement appris ?`,
      options: [
        "Chaque ligne a été exécutée pendant les tests — ce qui ne dit rien sur la quantité de comportements que les assertions vérifient réellement",
        "Le code est correct — chaque ligne a été exercée et a passé",
        "La suite est terminée — après 100 % il ne reste rien d’utile à tester",
      ],
      answer: 0,
      explain: `La couverture compte les lignes exécutées, pas les promesses tenues. Une suite peut toucher chaque ligne et affirmer presque rien. Poursuis les comportements et les invariants ; laisse la couverture être un sous‑produit, jamais l’objectif.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "rust-fundamentals-1",
      body: `Un secret sur la Campagne : **chaque escarmouche est évaluée par des tests cachés** — tu forges, les tests jugent, rouge ou vert. La Campagne transforme le TDD en jeu, et tu participes au rite depuis ta première escarmouche. Prochaine discipline : tracer les frontières où les mots changent de sens — la carte dont dépend chaque spécification.`,
    },
  ],
} satisfies JourneyConceptText;
