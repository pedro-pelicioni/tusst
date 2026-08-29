import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Le rite rouge-vert",
  tagline: "TDD : tests d'abord, forge ensuite.",
  steps: [
    {
      kind: "theory",
      body: `## La spécification qui croît des dents

Dans le chapitre I, tu as appris à écrire ce que *c’est bien*. Un **test** est cette phrase rendue exécutable — une spécification que la machine re-vérifie en millisecondes, à chaque fois, pour toujours.

C’est plus important avec l’IA, pas moins. Un golem peut débattre avec ta prose, réinterpréter ton intention, « améliorer » tes exigences. Il ne peut pas débattre avec \`assert_eq!\`. **Les tests sont la spécification que la machine ne peut pas contester** — le seul endroit où une réponse plausible et une réponse correcte ne sont plus confondues.

Écris-les **d’abord**, et chaque forge qui suit est notée dès la naissance.`,
    },
    {
      kind: "theory",
      body: `## Le rite : rouge, vert, refactor

Le TDD est un rite à trois temps, et l’ordre est le point :

1. **Rouge** — écris un petit test pour un comportement qui n’existe pas encore. Lance‑le. **Regarde‑le échouer.**
2. **Vert** — écris le code le plus simple qui le fait passer. Pas le plus astucieux. Le plus simple.
3. **Refactor** — maintenant, avec le filet en place, rends‑le propre. Les tests protègent ton dos pendant que tu bouges les choses.

Le rouge prouve que le test peut attraper le bug qu’il protège. Le vert prouve que le comportement existe. Le refactor est l’endroit où le bon code est réellement créé — *en toute sécurité*.`,
    },
    {
      kind: "quiz",
      question: `Ton partenaire IA livre une fonctionnalité *et* un nouveau test pour elle. Tu lances la suite : tout est vert dès la première tentative. Que dois‑tu encore rendre au rite ?`,
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
      body: `## Anatomie d’un bon essai

Un bon test unitaire se lit en trois mouvements — **arranger, agir, affirmer** :

- **Arranger** — construis le monde : un dépôt d’entiercement qui détient un dépôt, une date limite déjà dépassée.
- **Agir** — fais *une* chose : l’acheteur appelle le remboursement.
- **Affirmer** — vérifie *un* comportement : le solde de l’acheteur a augmenté du dépôt.

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

Un test d’exemple fixe un point : *cette* entrée, *cette* sortie. **La pensée de type propriété** fixe une loi : quelque chose qui doit rester vrai pour *toute* entrée.

Tes invariants du chapitre I sont exactement ces lois :

> solde de l’entiercement = dépôts − libérations − remboursements

Affirme‑le après *chaque* opération que tes tests effectuent — dépôt, libération, remboursement, ordres étranges — et tu as construit un fil de sécurité à travers tout l’espace d’état, pas une clôture autour d’un seul exemple. Chaque invariant de ta spécification mérite au moins une assertion qui ne cesse jamais d’être vérifiée.`,
    },
    {
      kind: "fill",
      prompt: `Transforme l’invariant du chapitre I en un essai exécutable :`,
      file: "escrow_test.rs",
      before: `assert_eq!(escrow.balance(), deposits - releases - `,
      after: `);`,
      choices: ["refunds", "fees", "interest", "gas"],
      answer: 0,
      explain: `Le même anneau de fer du chapitre I, maintenant avec des dents : l’argent quitte l’entiercement uniquement comme libérations ou remboursements. Écrit comme une assertion, la machine le re‑vérifie à chaque forge — gratuit, pour toujours.`,
    },
    {
      kind: "theory",
      body: `## Accepter le travail du golem sans peur

Voici le gain. Une IA te remet 300 lignes. Sans tests, tes options sont *lire chaque ligne très attentivement* ou *faire confiance*. Les deux échouent à l’échelle.

Avec une suite écrite d’abord, l’acceptation est mécanique : **rouge — rejeter**, avec l’échec comme retour. **Vert — accepter**, et lire pour le style à ton rythme.

Le même filet rend le refactoring sans peur — le tien *et* celui du golem. « Réécris ce module, garde les tests verts » est une instruction sûre *seulement parce que* les essais existent et que le golem n’a pas eu la chance de les écrire pour s’adapter à son propre code.`,
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
      body: `Un secret sur la Campagne : **chaque escarmouche est notée par des essais cachés** — tu forges, les essais jugent, rouge ou vert. La Campagne *est* le TDD joué comme un jeu, et tu es dans le rite depuis ta première escarmouche. La prochaine discipline : dessiner les frontières où un mot change de sens — la carte sur laquelle chaque spécification dépend.`,
    },
  ],
} satisfies JourneyConceptText;
