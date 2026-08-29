import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "La boucle sans fin",
  tagline: "Boucles agentiques : agir, observer, corriger — et savoir quand s’arrêter.",
  steps: [
    {
      kind: "theory",
      body: `## Du souhait à la boucle

Un prompt unique est un souhait : décrire, recevoir, espérer. La **boucle agentique** remplace l’espoir par un cycle :

> **agir → observer → corriger → agir à nouveau**

Le golem écrit du code, *exécute* le, lit la plainte du compilateur, corrige, exécute à nouveau — la façon dont tu travailles, au tempo de la machine. La qualité d’un prompt unique n’est plus intéressante dès que le golem peut voir ses propres résultats.

Mais une boucle est de la machinerie, pas de la magie. Elle a des parties qui peuvent être bien ou mal conçues — et chaque écran suivant est l’une de ces parties.`,
    },
    {
      kind: "theory",
      body: `## Observation : les yeux de la boucle

Une boucle ne s’améliore que dans la mesure où ses **observations** sont vraies. La correction a besoin d’un signal pour corriger *vers* :

- **codes de sortie** — la commande a-t-elle échoué ?
- **sortie de test** — quel essai, quelle assertion, quelle ligne ?
- **état en chaîne** — que contient réellement le registre après l’exécution ?

Signaux, pas vibrations. « La sortie semble raisonnable » ne corrige rien, car elle ne peut jamais être fausse. Chaque vérificateur que tu as intégré dans le cadre gagne maintenant des intérêts : intégré à la boucle, il devient les yeux que le golem utilise — **à chaque itération**.`,
    },
    {
      kind: "quiz",
      question: `Quelle observation peut réellement guider une boucle ?`,
      options: [
        "Le rapport du lanceur de tests : 3 réussis, 1 échoué — refund_after_deadline, assertion à la ligne 41",
        "Le résumé de clôture du golem : tout semble correct maintenant",
        "Le fait que le code se soit compilé à la première tentative — preuve forte que la logique est correcte",
      ],
      answer: 0,
      explain: `Compiler signifie que les types s’alignent, pas que le comportement est souhaité — et un résumé de soi est l’esprit qui note son propre devoir. Un signal de direction doit être externe, précis et capable d’être une mauvaise nouvelle. « 1 échoué, ligne 41 » est un titre ; « tout semble correct » est le temps.`,
    },
    {
      kind: "theory",
      body: `## Chaque boucle a besoin d’un frein

Une boucle non surveillée ne converge pas — elle **dépense**. Une boucle sans arrêt est une facture, et parfois une panne. Installe les freins *avant* la première rotation :

- **Critères de réussite** — les vérifications qui signifient *terminé*, décidées à l’avance.
- **Budget** — jetons, minutes, dollars : ce qui s’épuise en premier.
- **Itérations maximales** — un plafond, toujours.
- **Détection de non-progrès** — la même erreur deux fois signifie *changer de stratégie ou escalader*, jamais « encore, mais plus fort ».

La règle du royaume : ne commence jamais une boucle sans avoir décidé comment t’arrêter.`,
    },
    {
      kind: "quiz",
      question: `Itération 40, et la boucle a rencontré la même évaluation échouée avec le même message d’erreur depuis l’itération 12. Que doit faire le cadre ?`,
      options: [
        "S’arrêter et escalader à un humain — répéter sans progrès est une condition d’arrêt, pas de persistance",
        "Continuer — l’itération est le but même d’une boucle, et l’essai 41 pourrait être celui",
        "Augmenter la température du modèle pour qu’il soit plus créatif sur la correction",
      ],
      answer: 0,
      explain: `Vingt‑huit échecs identiques sont un message : la boucle manque de quelque chose — contexte, permission, spécification correcte — que plus d’itérations ne peuvent fournir. Randomiser plus dur ne fait que disperser les erreurs au même prix. Détecte le non-progrès, arrête, et remets la trace à un humain.`,
    },
    {
      kind: "fill",
      prompt: `Installe le frein avant que la boucle ne tourne :`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: ["budget.max_iterations", "usize::MAX", "evals.len()", "iterations + 1"],
      answer: 0,
      explain: `usize::MAX est « pas de frein — on en parlera sur la facture ». Une borne qui évolue avec le compteur (iterations + 1) ne s’applique jamais. Et evals.len() confond le nombre de vérifications avec la durée à continuer. Le plafond est un budget que tu as choisi délibérément.`,
    },
    {
      kind: "theory",
      body: `## Evals : la boussole

Comment savoir que l’itération 7 a battu l’itération 6 ? Pas par le sentiment. **Evals** sont un ensemble *fixe* de vérifications — tests, lint, build, une assertion en chaîne — exécutées **chaque itération**, donc chaque tentative est mesurée contre la même règle.

*Fixe* est le mot porteur de charge. Si les vérifications changent entre les tentatives, « progrès » devient inmesurable — tu compares des scores d’examens différents.

Avec une boussole, la boucle sait *pour un fait* si elle a bougé : 4 verts sur 7 deviennent 6 sur 7. Sans, elle ne sait que qu’elle a bougé. Le progrès est **mesuré, pas ressenti**.`,
    },
    {
      kind: "theory",
      body: `## Les retours instables empoisonnent la boucle

Un test qui échoue aléatoirement — timing, ordre, port partagé — est une nuisance pour les humains. On soupire et on relance. Pour une boucle, c’est **empoisonnement**, car la boucle *agit sur chaque signal*.

Un rouge fantôme arrive → le golem « corrige » du code qui n’était jamais cassé → le changement arrive → prochaine itération, un nouveau fantôme → une autre correction. La boucle apprend maintenant des superstitions, chacune s’accumulant, toutes du bruit.

La règle : **rends les retours déterministes avant de les brancher dans une boucle.** Un essai instable est pire qu’aucun essai — le silence ne trompe personne ; le bruit trompe sans relâche.`,
    },
    {
      kind: "quiz",
      question: `Un test échoue aléatoirement une fois sur cinq, pour des raisons de timing. Pour un humain, c’est une nuisance. Que devient‑c‑à pour une boucle ?`,
      options: [
        "Empoisonnement — la boucle considère chaque échec fantôme comme vérité et « corrige » un code sain, accumulant l’erreur à chaque passage",
        "La même nuisance — à travers de nombreuses itérations, le hasard s’égalise",
        "Légèrement utile — les échecs supplémentaires appliquent une pression supplémentaire pour rendre le code plus robuste",
      ],
      answer: 0,
      explain: `Rien ne s’égalise, car chaque signal faux déclenche un vrai changement de code que la prochaine itération construit. Les humains discountent le bruit ; les boucles l’agissent. La détermination n’est pas un luxe du cadre ; c’est une précondition pour boucler.`,
    },
    {
      kind: "theory",
      body: `## La bonne altitude

Où se tient l’humain pendant que la boucle tourne ? Pas à l’intérieur — revoir chaque frappe signifie *tu* es la boucle, au tempo du golem. Et pas non plus au-dessus des nuages, en tamponnant ce qui arrive.

La bonne altitude est la **frontière** : révise le *diff* par rapport à la *spécification*. Les evals ont-ils passé ? Le changement respecte‑t‑il les règles du Chapitre I ? Quelque chose a-t‑il bougé sans raison ? Fais confiance aux instruments de la boucle pour les petits détails ; garde le jugement humain pour ce que les instruments ne voient pas.

Prochaine discipline : quand une boucle ne suffit pas — plusieurs petits golems, un plan tissé.`,
    },
  ],
} satisfies JourneyConceptText;
