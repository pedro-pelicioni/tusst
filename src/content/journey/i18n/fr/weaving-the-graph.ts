import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Tisser le graphe",
  tagline:
    "Ingénierie des graphes : de nombreux petits golems au service d’un même plan.",
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
    {
      kind: "theory",
      body: `## Orchestration et autonomie

Sépare clairement les deux rôles du graphe :

- **Les arêtes sont déterministes.** Du code simple décide ce qui s'exécute, à quel moment, ce qui circule et comment relancer une étape — un flux de contrôle que tu peux lire, tester et rejouer.
- **Le jugement réside dans les nœuds.** Dans sa propre boîte, le modèle consacre toutes ses capacités à une seule tâche.

Si tu brouilles cette séparation — en laissant le modèle improviser l'étape suivante — les échecs cessent d'être reproductibles : chaque exécution emprunte un graphe différent. Garde une structure prévisible et des esprits bien délimités : **un squelette fiable, des organes intelligents.**`,
    },
    {
      kind: "quiz",
      question: `Dans un graphe bien construit, où s'exerce le jugement du modèle ?`,
      options: [
        "À l'intérieur des nœuds — tandis que les arêtes entre eux restent du code déterministe que tu peux tester et rejouer",
        "Dans les arêtes — laisser le modèle improviser quel nœud tourne ensuite garde le système flexible",
        "Nulle part — un pipeline sérieux est déterministe de bout en bout, sinon ce n'est pas de l'ingénierie",
      ],
      answer: 0,
      explain: `Un flux de contrôle improvisé produit des échecs impossibles à reproduire : tu ne peux pas déboguer un chemin qui change à chaque exécution. À l'inverse, un pipeline dépourvu de tout jugement n'avait pas besoin de golems. Squelette déterministe, organes capables de juger : chaque forme d'intelligence reste à sa place.`,
    },
    {
      kind: "theory",
      body: `## Des cloisons étanches pour le raisonnement

L'un des avantages les plus discrets du graphe est **le confinement des erreurs**.

Dans un prompt gigantesque, une confusion à la deuxième étape contamine tout ce qui suit : même contexte, aucune cloison étanche, et l'erreur s'accumule jusqu'à la fin.

Dans un graphe, un nœud qui échoue **échoue seul**. Son contexte reste isolé ; ses propres évaluations détectent l'échec à *sa* frontière — la boussole du chapitre précédent, placée cette fois dans chaque nœud. L'orchestrateur peut alors le relancer ou le contourner. C'est précisément ce qu'apportent les pipelines et les outils multi-agents : des étapes nommées, des transferts typés et des relances maîtrisées. On retrouve, un niveau plus haut, la leçon du bastion sur le rayon d'impact.`,
    },
    {
      kind: "quiz",
      question: `La tâche : renommer une fonction et ses sites d'appel dans un seul fichier. Que prends‑tu ?`,
      options: [
        "Une boucle simple — voire seulement ton éditeur ; coordonner un graphe coûterait plus cher que la tâche elle-même",
        "Un graphe — davantage de golems signifie toujours davantage de qualité, quelle que soit la taille de la tâche",
        "Un graphe — les petites tâches sont l'endroit idéal pour s'entraîner aux grandes",
      ],
      answer: 0,
      explain: `Chaque nœud demande une mise en place : sélectionner le contexte, définir les arêtes et acheminer les échecs. Pour une petite tâche, l'ossature dépasse le travail — comme convoquer un conseil de guerre pour chasser une mouche. Tâche simple, boucle simple ; le graphe ne justifie son coût que lorsque la décomposition apporte un réel bénéfice.`,
    },
    {
      kind: "theory",
      body: `## Le savoir-faire, assemblé

Regarde les outils désormais accrochés à ta ceinture : des **spécifications** qui définissent ce qui est correct ; des **tests** qui le vérifient durablement ; des **frontières** qui préservent le sens des mots ; un **bastion** qui contient le changement ; un **environnement contrôlé** qui contient le golem ; des **mots** qui façonnent ce qu'il voit ; des **boucles** qui lui permettent de se corriger ; enfin, un **graphe** qui rassemble de nombreux esprits autour d'un même plan.

Aucun de ces éléments ne sera pris en charge par l'IA à ta place. Ensemble, ils décuplent pourtant son efficacité.

Prochaine étape : retour au royaume — apporte ce savoir-faire dans la Forge et mets-le à l'épreuve sur le véritable réseau.`,
    },
  ],
} satisfies JourneyConceptText;
