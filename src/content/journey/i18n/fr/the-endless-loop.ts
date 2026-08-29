import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "La boucle sans fin",
  tagline:
    "Boucles agentiques : agir, observer, corriger — et savoir quand s’arrêter.",
  steps: [
    {
      kind: "theory",
      body: `## Du souhait à la boucle

Un prompt unique est un souhait : décrire, recevoir, espérer. La **boucle agentique** remplace l’espoir par un cycle :

> **agir → observer → corriger → agir à nouveau**

Le golem écrit du code, *l'exécute*, lit le message d'erreur du compilateur, corrige puis recommence — comme toi, mais au rythme de la machine. La qualité du prompt initial n'est plus le seul enjeu dès lors que le golem peut observer ses propres résultats.

Mais une boucle est un mécanisme, pas de la magie. Chacun de ses composants peut être bien ou mal conçu — et les écrans suivants vont les examiner un par un.`,
    },
    {
      kind: "theory",
      body: `## Observation : les yeux de la boucle

Une boucle ne peut s’améliorer que si ses **observations** sont fiables. Pour corriger sa trajectoire, elle a besoin de repères précis :

- **codes de sortie** — la commande a-t-elle échoué ?
- **sortie des tests** — quel test, quelle assertion, quelle ligne ?
- **état on-chain** — que contient réellement le registre après l’exécution ?

Il faut des signaux, pas des impressions. « Le résultat semble raisonnable » ne guide aucune correction, car cette appréciation ne peut jamais être réfutée. Chaque vérificateur intégré au harnais prend ici toute sa valeur : branché dans la boucle, il devient les yeux du golem — **à chaque itération**.`,
    },
    {
      kind: "diagram",
      body: "La boucle, et la seule sortie qui compte :",
      caption: "Une boucle sans règle d'arrêt n'est pas de l'autonomie — c'est un budget qui brûle.",
      view: {
        kind: "flow",
        layout: "cycle",
        play: true,
        nodes: [
          {
            id: "act",
            label: "agir",
            note: "Faites le plus petit pas que le plan autorise, puis arrêtez et regardez.",
            tone: "accent",
          },
          {
            id: "observe",
            label: "observer",
            note: "Lisez ce que le monde a répondu. Pas ce que vous espériez.",
            tone: "teal",
          },
          {
            id: "correct",
            label: "corriger",
            note: "Ajustez le plan, pas seulement le dernier mouvement.",
            tone: "gold",
          },
          {
            id: "stop",
            label: "arrêter ?",
            note: "Terminé, bloqué, ou hors budget. Décidez-le explicitement, à chaque tour.",
            tone: "good",
          },
        ],
      },
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
      explain: `Une compilation réussie prouve que les types concordent, pas que le comportement répond au besoin. Quant à l'auto-évaluation, elle revient à laisser l'élève noter sa propre copie. Un signal utile doit être externe, précis et capable d'annoncer une mauvaise nouvelle. « 1 test échoué, ligne 41 » est un diagnostic exploitable ; « tout semble correct » n'est qu'une impression.`,
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
      question: `À l'itération 40, la boucle rencontre toujours la même évaluation en échec et le même message d'erreur depuis l'itération 12. Que doit faire le harnais ?`,
      options: [
        "S’arrêter et escalader à un humain — répéter sans progrès est une condition d’arrêt, pas de persistance",
        "Continuer — l’itération est le but même d’une boucle, et la tentative 41 sera peut-être la bonne",
        "Augmenter la température du modèle pour qu’il soit plus créatif sur la correction",
      ],
      answer: 0,
      explain: `Vingt-huit échecs identiques transmettent un message clair : il manque à la boucle quelque chose — contexte, permission ou spécification correcte — que de nouvelles itérations ne fourniront pas. Ajouter davantage d'aléatoire ne fait que disperser les erreurs pour le même coût. Détecte l'absence de progrès, arrête la boucle et transmets la trace à un humain.`,
    },
    {
      kind: "fill",
      prompt: `Installe le frein avant que la boucle ne tourne :`,
      file: "loop.rs",
      before: `while !evals.pass() && iterations < `,
      after: ` {`,
      choices: [
        "budget.max_iterations",
        "usize::MAX",
        "evals.len()",
        "iterations + 1",
      ],
      answer: 0,
      explain: `usize::MAX est « pas de frein — on en parlera sur la facture ». Une borne qui évolue avec le compteur (iterations + 1) ne s’applique jamais. Et evals.len() confond le nombre de vérifications avec la durée à continuer. Le plafond est un budget que tu as choisi délibérément.`,
    },
    {
      kind: "theory",
      body: `## Evals : la boussole

Comment savoir si l’itération 7 est meilleure que l’itération 6 ? Certainement pas au ressenti. Les **évaluations** forment un ensemble *fixe* de vérifications — tests, lint, build, assertion on-chain — exécutées **à chaque itération**. Toutes les tentatives sont ainsi mesurées selon les mêmes règles.

Le mot essentiel est *fixe*. Si les vérifications changent d'une tentative à l'autre, le « progrès » devient impossible à mesurer : tu compares les notes d'examens différents.

Avec cette boussole, la boucle sait objectivement si elle avance : 4 vérifications réussies sur 7 deviennent 6 sur 7. Sans elle, la boucle sait seulement qu'elle a changé quelque chose. Le progrès est **mesuré, pas ressenti**.`,
    },
    {
      kind: "theory",
      body: `## Les retours instables empoisonnent la boucle

Un test qui échoue aléatoirement — timing, ordre, port partagé — est une nuisance pour les humains. On soupire et on relance. Pour une boucle, c’est **empoisonnement**, car la boucle *agit sur chaque signal*.

Un échec fantôme survient → le golem « corrige » un code qui n’était pas défectueux → la modification est conservée → à l’itération suivante, un autre fantôme apparaît → nouvelle correction. La boucle accumule alors des superstitions, autrement dit du bruit.

La règle : **rends les retours déterministes avant de les brancher dans une boucle.** Un test instable est pire que l'absence de test : le silence ne trompe personne, tandis que le bruit induit sans cesse en erreur.`,
    },
    {
      kind: "quiz",
      question: `Un test échoue aléatoirement une fois sur cinq à cause d'un problème de timing. Pour un humain, c’est une nuisance. Que devient-il pour une boucle ?`,
      options: [
        "Empoisonnement — la boucle considère chaque échec fantôme comme vérité et « corrige » un code sain, accumulant l’erreur à chaque passage",
        "La même nuisance — à travers de nombreuses itérations, le hasard s’égalise",
        "Légèrement utile — les échecs supplémentaires appliquent une pression supplémentaire pour rendre le code plus robuste",
      ],
      answer: 0,
      explain: `Rien ne s’équilibre, car chaque faux signal déclenche une véritable modification sur laquelle l’itération suivante s'appuie. Les humains savent filtrer le bruit ; les boucles l'appliquent aveuglément. Le déterminisme n’est pas un luxe du harnais, mais une condition préalable à toute boucle fiable.`,
    },
    {
      kind: "theory",
      body: `## La bonne altitude

Où se place l’humain pendant que la boucle tourne ? Pas à l’intérieur : relire chaque frappe signifie que *tu* es la boucle, au rythme du golem. Mais pas non plus au-dessus des nuages, à approuver aveuglément tout ce qui arrive.

La bonne altitude est la **frontière** : examine le *diff* à la lumière de la *spécification*. Les évaluations sont-elles toutes réussies ? La modification respecte-t-elle les règles du chapitre I ? Quelque chose a-t-il changé sans raison ? Appuie-toi sur les instruments de la boucle pour les détails mécaniques et réserve le jugement humain à ce qu'ils ne peuvent pas voir.

Prochaine discipline : quand une boucle ne suffit pas — plusieurs petits golems, un plan tissé.`,
    },
  ],
} satisfies JourneyConceptText;
