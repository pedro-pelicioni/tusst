import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Le Squelette et les Organes",
  tagline: "Orchestration : des arêtes déterministes, le jugement dans les nœuds.",
  steps: [
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
    { kind: "fill",
      prompt: `Complétez la séparation qui rend un graphe débogable :`,
      file: "graph.toml",
      before: `Les arêtes sont du code `,
      after: ` ; le jugement vit à l'intérieur des nœuds.`,
      choices: ["déterministe", "généré par le modèle", "adaptatif", "auto-modifiable"],
      answer: 0,
      explain: `Toute autre réponse achète la même chose : une exécution que vous ne pouvez pas reproduire. Si le chemin dans le graphe est lui-même une sortie du modèle, deux exécutions du même échec ont emprunté deux routes différentes — et il n'y a rien à dérouler pas à pas, car ce qui a déraillé, c'est la carte.` },
    {
      kind: "theory",
      body: `## Des cloisons étanches pour le raisonnement

L'un des avantages les plus discrets du graphe est **le confinement des erreurs**.

Dans un prompt gigantesque, une confusion à la deuxième étape contamine tout ce qui suit : même contexte, aucune cloison étanche, et l'erreur s'accumule jusqu'à la fin.

Dans un graphe, un nœud qui échoue **échoue seul**. Son contexte reste isolé ; ses propres évaluations détectent l'échec à *sa* frontière — la boussole du chapitre précédent, placée cette fois dans chaque nœud. L'orchestrateur peut alors le relancer ou le contourner. C'est précisément ce qu'apportent les pipelines et les outils multi-agents : des étapes nommées, des transferts typés et des relances maîtrisées. On retrouve, un niveau plus haut, la leçon du bastion sur le rayon d'impact.`,
    },
    { kind: "diagram",
      body: "Une confusion à l'étape deux, deux architectures :",
      caption: "Même erreur, même modèle. La seule différence est qu'il y avait, ou non, quelque chose entre l'étape deux et l'étape cinq.",
      view: { kind: "compare",
        columns: [{ id: "mono", label: "un long prompt", tone: "bad" }, { id: "graph", label: "un graphe", tone: "good" }],
        rows: [
          { label: "où va l'erreur", cells: [{ text: "dans le contexte que lit chaque étape suivante", tone: "bad" }, { text: "nulle part — le contexte du nœud est le sien", tone: "good" }] },
          { label: "qui s'en aperçoit", cells: [{ text: "vous, à la fin, à la sortie", tone: "bad" }, { text: "les evals de ce nœud, à sa frontière", tone: "good" }] },
          { label: "ce que ça coûte", cells: [{ text: "chaque étape suivante, refaite", tone: "bad" }, { text: "un nœud, relancé ou contourné", tone: "good" }] },
          { label: "ce que vous pouvez déboguer", cells: [{ text: "une longue transcription", tone: "bad" }, { text: "le nœud défaillant, isolé", tone: "good" }] },
        ] } },
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
    { kind: "exercise", mode: "spec-write",
      brief: `## L'épreuve de l'examinateur : tissez-en un

Une quête qui ne tient pas sur un seul établi :

> Un contrat de jeton Soroban a besoin d'une passe de sécurité avant la mainnet. Auditez-le pour les classes de bugs courantes, corrigez ce qui est trouvé, mettez le README à jour pour refléter le comportement corrigé, et produisez une courte note de migration pour ceux qui sont déjà sur l'ancienne version.

Concevez le **graphe**. Nommez les nœuds et l'objet de chacun ; dites lesquels peuvent tourner en parallèle et pourquoi ils sont réellement indépendants ; dites où se place un vérificateur et quel est son objectif ; et nommez un nœud dont l'échec ne doit pas emporter le reste, et ce qui se passe quand il échoue.

Conception uniquement — pas de code d'orchestration, pas de noms d'outil ni de framework.`,
      rubric: `1. Nomme au moins quatre nœuds, chacun avec un objet unique énoncé.
2. Identifie quels nœuds peuvent tourner en parallèle ET justifie l'indépendance — aucun ne lit la sortie de l'autre ni ne touche à son état.
3. Place au moins un nœud vérificateur et énonce son objectif comme réfutation, non approbation.
4. Nomme au moins un nœud dont l'échec est contenu, et dit ce que l'orchestrateur en fait (relancer, contourner, arrêter et remonter).
5. Conception uniquement — pas de code d'orchestration, pas de noms de framework ni d'outil, et le flux de contrôle n'est pas laissé à l'improvisation d'un modèle.`,
      minChars: 200 },
    {
      kind: "theory",
      body: `## Le savoir-faire, assemblé

Regarde les outils désormais accrochés à ta ceinture : des **spécifications** qui définissent ce qui est correct ; des **tests** qui le vérifient durablement ; des **frontières** qui préservent le sens des mots ; un **bastion** qui contient le changement ; un **environnement contrôlé** qui contient le golem ; des **mots** qui façonnent ce qu'il voit ; des **boucles** qui lui permettent de se corriger ; enfin, un **graphe** qui rassemble de nombreux esprits autour d'un même plan.

Aucun de ces éléments ne sera pris en charge par l'IA à ta place. Ensemble, ils décuplent pourtant son efficacité.

Prochaine étape : retour au royaume — apporte ce savoir-faire dans la Forge et mets-le à l'épreuve sur le véritable réseau.`,
    },
  ],
  testOut: [
    { question: `Dans un graphe bien construit, où vit le jugement du modèle ?`,
      options: ["Dans les nœuds, tandis que les arêtes entre eux restent du code déterministe testable et rejouable","Dans les arêtes — laisser le modèle choisir le nœud suivant garde le système souple","Nulle part ; un pipeline sérieux est déterministe de bout en bout"], answer: 0 },
    { question: `Qu'est-ce qui déraille quand le modèle décide quelle étape vient ensuite ?`,
      options: ["Les échecs cessent d'être reproductibles — on ne débogue pas un chemin qui ne se produit jamais deux fois pareil","Rien, pourvu que chaque nœud garde ses propres evals","Cela coûte plus cher, la décision d'aiguillage étant un appel de plus"], answer: 0 },
    { question: `Un nœud échoue au milieu d'un graphe. Que devrait-il se passer ?`,
      options: ["Il échoue seul — son contexte est mis en quarantaine, ses propres evals le rattrapent, et l'orchestrateur relance ou contourne","Toute l'exécution s'interrompt, les résultats suivants reposant sur un échec","Le nœud suivant hérite de sa sortie partielle et continue"], answer: 0 },
    { question: `La tâche : renommer une fonction et ses appels dans un seul fichier. Vers quoi vous tournez-vous ?`,
      options: ["Une boucle simple, ou simplement votre éditeur — la coordination d'un graphe coûterait plus que la tâche","Un graphe, puisque plus de nœuds signifie plus de qualité quelle que soit la taille","Un graphe, car les petites tâches sont là où l'on s'entraîne pour les grandes"], answer: 0 },
  ],
};
