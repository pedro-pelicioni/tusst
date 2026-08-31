import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Main sur le Frein",
  tagline: "Boucles agentiques et garde-fous : sans règle d'arrêt ce n'est pas de l'autonomie, c'est une facture.",
  steps: [
    { kind: "theory", body: `## Toute boucle a besoin d'un frein

Une boucle non surveillée ne converge pas — elle **dépense**. Une boucle sans arrêt est une facture, et parfois une panne. Montez les freins *avant* le premier tour :

- **Critères de succès** — les vérifications qui signifient *terminé*, décidées d'avance.
- **Budget** — jetons, minutes, euros : ce qui s'épuise en premier.
- **Nombre maximal d'itérations** — un plafond dur, toujours.
- **Détection d'absence de progrès** — la même erreur deux fois signifie *change de stratégie ou remonte*, jamais « encore, mais plus fort ».

La règle du royaume : ne lancez jamais une boucle sans avoir décidé comment l'arrêter.` },
    { kind: "widget", component: "loop-brake",
      body: `Deux interrupteurs, quatre séries. **Faites tourner la boucle** avec les freins montés et un retour honnête, puis retirez une chose à la fois et voyez laquelle passe sans conséquence.` },
    { kind: "theory", body: `## Ce que ça coûte quand rien ne l'arrête

La facture est la partie visible, et c'est la plus petite.

Une boucle sans freins qui a passé la nuit sur un test menteur ne vous rend pas rien. Elle vous rend une branche : quarante commits, pour la plupart des modifications de code qui n'a jamais été cassé, chacune plausible isolément, toutes faites pour satisfaire un rouge qui n'a jamais été réel. Les evals ne sont toujours pas au vert — donc rien dans cette branche ne vous dit où le vrai travail s'est arrêté et où la superstition a commencé.

Le chemin le moins coûteux est désormais de jeter la nuit entière et de recommencer avec l'instabilité corrigée. C'est exactement ce que le frein d'absence de progrès vous aurait dit à l'itération quatre, pour le prix de quatre itérations.

Voilà la forme de la chose : **le frein ne vous fait pas économiser d'argent sur les bonnes séries. Il vous épargne l'archéologie sur les mauvaises.**` },
    { kind: "quiz", question: `Itération 40, et la boucle bute sur la même eval avec le même message d'erreur depuis l'itération 12. Que devrait faire le harnais ?`,
      options: [
        "S'arrêter et remonter à un humain — répéter sans progresser est une condition d'arrêt, pas de la persévérance",
        "Continuer — itérer est tout l'intérêt d'une boucle, et la tentative 41 sera peut-être la bonne",
        "Monter la température du modèle pour qu'il soit plus créatif dans la correction",
      ], answer: 0,
      explain: `Vingt-huit échecs identiques sont un message : il manque à la boucle quelque chose — du contexte, une permission, une spécification correcte — que davantage d'itérations ne fourniront pas. Randomiser plus fort achète de l'erreur éparpillée au même prix. Détectez l'absence de progrès, arrêtez, et confiez la trace à un humain.` },
    { kind: "fill", prompt: `Montez le frein avant que la boucle ne tourne :`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"], answer: 0,
      explain: `usize::MAX veut dire « pas de frein — on en reparlera sur la facture ». Une borne qui suit le compteur (iterations + 1) ne retient jamais rien. Et evals.len() confond le nombre de vérifications existantes avec la durée pendant laquelle insister. Le plafond est un budget que vous avez choisi exprès.` },
    { kind: "theory", body: `## Un retour instable empoisonne la boucle

Un test qui échoue au hasard — minutage, ordre, un port partagé — est une contrariété pour un humain. On soupire et on relance. Pour une boucle, c'est du **poison**, car la boucle *agit sur chaque signal*.

Un rouge fantôme arrive → le golem « corrige » du code qui n'a jamais été cassé → la modification est intégrée → à l'itération suivante, un nouveau fantôme → une autre correction. La boucle apprend des superstitions, chacune s'ajoutant à la précédente, toutes issues du bruit.

La règle : **rendez le retour déterministe avant de le brancher sur une boucle.** Une épreuve instable est pire qu'aucune épreuve — le silence ne trompe personne ; le bruit trompe sans se fatiguer.` },
    { kind: "quiz", question: `Un test échoue au hasard une fois sur cinq, pour une question de minutage. Pour un humain, c'est une gêne. Pour une boucle, c'est quoi ?`,
      options: [
        "Du poison — la boucle prend chaque échec fantôme pour la vérité et « corrige » du code sain, aggravant l'erreur à chaque passage",
        "La même gêne — sur de nombreuses itérations, le hasard se compense",
        "Légèrement utile — les échecs supplémentaires poussent le code à devenir plus robuste",
      ], answer: 0,
      explain: `Rien ne se compense, car chaque faux signal déclenche une modification réelle du code sur laquelle l'itération suivante s'appuie. Les humains escomptent le bruit ; les boucles agissent docilement dessus. Le déterminisme n'est pas un raffinement du harnais — c'est une condition préalable à toute boucle.` },
    { kind: "diagram", body: "La même tâche, lancée deux fois :",
      caption: "Le jour où tout va bien, les freins sont invisibles. C'est précisément pour cela qu'on les omet.",
      view: { kind: "compare",
        columns: [{ id: "braked", label: "avec freins", tone: "good" }, { id: "loose", label: "sans", tone: "bad" }],
        rows: [
          { label: "retour honnête", cells: [{ text: "converge ; les freins ne servent pas", tone: "good" }, { text: "converge ; résultat identique", tone: "neutral" }] },
          { label: "le retour ment", cells: [{ text: "s'arrête en trois tours, remonte l'alerte", tone: "good" }, { text: "court jusqu'au plafond qui n'existe pas", tone: "bad" }] },
          { label: "ce que vous payez", cells: [{ text: "un montant borné et connu", tone: "good" }, { text: "ce que ça aura pris, découvert après", tone: "bad" }] },
          { label: "dégâts au code", cells: [{ text: "pris tôt, peu de corrections fantômes", tone: "good" }, { text: "des modifications sur du code jamais cassé", tone: "bad" }] },
        ] } },
    { kind: "theory", body: `## La bonne altitude

Où se tient l'humain pendant que la boucle tourne ? Pas dedans — relire chaque frappe signifie que *vous* êtes la boucle, au tempo du golem. Et pas au-dessus des nuages non plus, à tamponner ce qui atterrit.

La bonne altitude, c'est la **frontière** : relisez le *diff* face à la *spécification*. Les evals passent-elles ? La modification respecte-t-elle les règles du Chapitre I ? Quelque chose a-t-il bougé sans avoir rien à faire là ? Faites confiance aux instruments de la boucle pour le menu ; gardez le jugement humain pour ce que les instruments ne voient pas.

**Ensuite :** quand une boucle ne suffit pas — beaucoup de petits golems, un plan tissé.` },
  ],
  testOut: [
    { question: `Une boucle échoue sur la même eval avec la même erreur depuis vingt-huit itérations. Que vous doit le harnais ?`,
      options: ["Un arrêt et une remontée — répéter sans progresser est une condition d'arrêt, pas de la persévérance","Davantage d'itérations, la prochaine tentative étant aussi probable qu'une autre","Une température plus élevée, pour que le modèle varie son approche"], answer: 0 },
    { question: `Pourquoi un test instable est-il pire pour une boucle que pour un humain ?`,
      options: ["La boucle agit sur chaque signal, donc un rouge fantôme devient une vraie modification de code sain","La boucle lance la suite plus souvent, donc elle tombe plus souvent sur l'instabilité","C'est le même problème ; les boucles ne font que le révéler plus tôt"], answer: 0 },
    { question: `Sur une série où le retour est honnête, qu'est-ce que les freins changent ?`,
      options: ["Rien du tout — c'est exactement pour cela qu'on les omet, et exactement pourquoi c'est une erreur","Ils réduisent de moitié le nombre d'itérations nécessaires","Ils améliorent la qualité finale en forçant une convergence plus précoce"], answer: 0 },
    { question: `Où l'humain doit-il se tenir pendant qu'une boucle tourne ?`,
      options: ["À la frontière — en relisant le diff face à la spécification, ni chaque frappe ni rien","Dans la boucle, en vérifiant chaque action avant qu'elle ne soit prise","Entièrement à l'extérieur ; une boucle supervisée n'est pas autonome"], answer: 0 },
  ],
};
