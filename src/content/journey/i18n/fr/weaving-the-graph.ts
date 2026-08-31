import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Tisser le Graphe",
  tagline: "Graph engineering : beaucoup de petits golems, chacun sur son établi, un plan tissé.",
  steps: [
    {
      kind: "theory",
      body: `## Quand une boucle ne suffit pas

Certaines quêtes sont trop vastes pour un seul esprit : *audite ce contrat, corrige les problèmes, mets la documentation à jour et prépare la migration.* Si tu réunis tout dans un seul contexte, la qualité se dilue à chaque étape — le chapitre précédent t'a expliqué pourquoi.

La méthode est ancienne : **décomposer**. Construis un **graphe** d'étapes :

- **Nœuds** — de petites tâches ciblées, chacune avec son *propre contexte soigneusement sélectionné*.
- **Arêtes** — ce qui circule entre les nœuds : une spécification, un diff, un rapport.

Tu as fait ça pour coder toute ta vie — petites fonctions, responsabilités uniques, entrées et sorties explicites. Maintenant fais‑le pour le travail lui‑même.`,
    },
    {
      kind: "theory",
      body: `## Fan out, fan in

L'indépendance est le mot préféré du planificateur.

**Fan-out** : trois SDK candidats à évaluer ? Trois nœuds en parallèle — chacun dans son propre contexte, indépendant des autres et sans fuite de contexte entre eux.

**Fan-in** : un nœud de *synthèse* reçoit les trois rapports, les compare à tes critères et formule une recommandation.

La discipline consiste à repérer la véritable indépendance : les travaux parallèles ne doivent partager **aucun état**. Des nœuds qui se précipitent tous pour modifier le même fichier ne forment pas un graphe, mais une mêlée. C'est le même raisonnement sur les dépendances que tu appliques déjà aux pipelines de données, transposé ici aux esprits.`,
    },
    {
      kind: "diagram",
      body: "Un plan, trois ouvriers, un verdict :",
      caption: "Chaque ouvrier démarre propre. Cet isolement est l'intérêt — un mauvais tour chez l'un n'empoisonne jamais les autres.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "plan",
            label: "PLAN",
            x: 50,
            y: 12,
            tone: "accent",
            shape: "box",
            note: "Découpe le travail en morceaux qui n'ont pas besoin de se parler.",
          },
          {
            id: "a",
            label: "A",
            x: 18,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Contexte propre, budget propre. Il ne voit jamais les erreurs de B.",
          },
          {
            id: "b",
            label: "B",
            x: 50,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Tourne en même temps, sur le même brief, sur un autre morceau.",
          },
          {
            id: "c",
            label: "C",
            x: 82,
            y: 36,
            tone: "teal",
            shape: "box",
            note: "Trois tentatives bon marché valent mieux qu'une chère que vous ne pouvez pas vérifier.",
          },
          {
            id: "judge",
            label: "JUGE",
            x: 50,
            y: 56,
            tone: "gold",
            shape: "box",
            note: "Lit les trois et décide. C'est de là que vient réellement la qualité.",
          },
        ],
        edges: [
          {
            from: "plan",
            to: "a",
            style: "solid",
          },
          {
            from: "plan",
            to: "b",
            style: "solid",
          },
          {
            from: "plan",
            to: "c",
            style: "solid",
          },
          {
            from: "a",
            to: "judge",
            style: "dashed",
          },
          {
            from: "b",
            to: "judge",
            style: "dashed",
          },
          {
            from: "c",
            to: "judge",
            style: "dashed",
          },
        ],
      },
    },
    { kind: "widget", component: "fan-out",
      body: `Quatre tâches, deux étapes chacune, trois façons de les ordonnancer. **Changez les durées** et regardez quels deux ordonnancements cessent d'être la même chose.` },
    {
      kind: "quiz",
      question: `Quel ensemble de sous-tâches peut être réparti sans risque en parallèle ?`,
      options: [
        "Évaluer trois bibliothèques candidates selon la même liste de contrôle — travail indépendant, sans état partagé",
        "Écrire un script de migration et exécuter ce même script — les superposer fait gagner du temps",
        "Trois golems éditant le même module en même temps, pour le finir trois fois plus vite",
      ],
      answer: 0,
      explain: `Exécuter avant que les données soient prêtes viole une dépendance, et modifier un fichier partagé multiplie les conflits de fusion. Le test est simple et fiable : si le nœud A ne lit ni la sortie ni l'état du nœud B, ils peuvent s'exécuter en parallèle.`,
    },
    { kind: "quiz",
      question: `Cinq nœuds produisent chacun un constat, et chaque constat doit ensuite être vérifié. Quand est-il juste d'attendre **les cinq** constats avant de commencer **la moindre** vérification ?`,
      options: [
        "Uniquement quand l'étape de vérification a réellement besoin de l'ensemble d'un coup — pour dédupliquer entre constats, par exemple, ou pour tout sauter si le compte est nul",
        "Toujours — une frontière d'étape nette rend le pipeline plus facile à raisonner",
        "Jamais — attendre est toujours du temps perdu dans un système parallèle",
      ],
      answer: 0,
      explain: `Une barrière est un vrai outil avec un vrai coût : elle dépense le temps du nœud le plus lent sans rien faire des quatre autres. Elle mérite ce coût quand l'étape suivante porte vraiment sur l'*ensemble* — déduplication, sortie anticipée à zéro, comparaison entre résultats. « Ça se lit mieux » n'en est pas, et « je dois d'abord aplatir la liste » non plus.` },
    {
      kind: "theory",
      body: `## Le forgeron et le réfuteur

Le chapitre sur l'environnement contrôlé t'a prévenu : se relire soi-même laisse subsister ses propres angles morts. Un graphe corrige ce problème *par sa structure*.

Ajoute un **nœud vérificateur** : un golem forge ; un *autre* nœud — contexte frais, sans attachement aux choix déjà faits — est chargé de **réfuter** : trouver où le diff viole la spéc, chasser les cas limites, essayer de le casser.

La mission confiée au nœud compte. « Relis ça » invite à un simple acquiescement. *« Trouve ce qui ne va pas »* oriente l'esprit vers les failles. Une paire adversariale repère ce qu'une auto-évaluation ne peut pas voir ; c'est pourquoi les véritables ateliers associent un créateur à un inspecteur.`,
    },
    {
      kind: "fill",
      prompt: `Donne au deuxième golem son vrai travail :`,
      file: "graph.toml",
      before: `verifier.goal = "`,
      after: ` le diff du nœud forgeron"`,
      choices: ["réfuter", "approuver", "résumer", "réécrire"],
      answer: 0,
      explain: `Un vérificateur chargé d'approuver trouvera toujours un moyen d'approuver. « Résumer » produit de la prose, pas une inspection ; « réécrire » ne fait qu'ajouter un second forgeron avec ses propres angles morts. Seule la réfutation oriente réellement le nœud vers les failles.`,
    },
    { kind: "theory", body: `## Une forme n'est pas encore un système

Vous savez désormais prendre une quête trop grande pour un seul établi et la découper en nœuds assez petits pour être bien faits — et vous savez confier la vérification à un second esprit qui ne s'est jamais attaché aux choix du premier.

Ce que vous avez est une forme. Ce que vous n'avez pas encore est une machine sur laquelle quelqu'un peut compter. Qui décide quel nœud vient ensuite ? Qu'arrive-t-il aux autres nœuds quand l'un d'eux échoue ? Et — la question qui économise le plus d'argent — quand ne faut-il **pas** construire de graphe du tout ?

**Ensuite :** la partie qui rend la forme digne de confiance.` },
  ],
  testOut: [
    { question: `Pourquoi décomposer une grande quête en graphe de nœuds plutôt qu'en un long prompt ?`,
      options: ["Chaque nœud reçoit son propre établi trié, si bien que la qualité ne se dilue pas entre des étapes sans rapport","Les modèles facturent moins plusieurs requêtes courtes qu'une longue","Cela laisse le modèle choisir son ordre de travail, ce qui améliore les résultats"], answer: 0 },
    { question: `Quel est le test pour savoir si deux nœuds peuvent tourner en parallèle ?`,
      options: ["Le nœud A ne lit pas la sortie du nœud B et ne touche pas à son état","On s'attend à ce que les deux nœuds prennent à peu près le même temps","Aucun des deux n'écrit sur le réseau"], answer: 0 },
    { question: `Pourquoi donner au second golem l'objectif « réfuter » plutôt que « relire » ?`,
      options: ["Un nœud à qui l'on demande d'approuver trouvera le moyen d'approuver — la réfutation est le seul objectif qui vise les trous","La réfutation produit une sortie plus courte, donc moins coûteuse","La relecture exige le contexte d'origine, la réfutation non"], answer: 0 },
    { question: `Quatre tâches en parallèle, deux étapes chacune. Que coûte réellement d'attendre que toutes finissent l'étape un ?`,
      options: ["Le temps d'étape un de la tâche la plus lente, dépensé à ne rien faire des autres — et de nouveau à l'étape deux","Rien, tant que les tâches tournent en parallèle au sein de chaque étape","Seulement la surcharge de coordination de l'ordonnanceur"], answer: 0 },
  ],
};
