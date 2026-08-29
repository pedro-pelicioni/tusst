import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Tisser le Graph",
  tagline: "Ingénierie du graph : de nombreux petits golems, un plan tissé.",
  steps: [
    {
      kind: "theory",
      body: `## Quand une boucle ne suffit pas

Certaines quêtes débordent d'un seul esprit : *audit ce contrat, corrige ce que tu trouves, mets à jour la doc, prépare la migration.* Tout mettre dans un seul contexte et la qualité se dilue à chaque étape — le dernier chapitre t'a expliqué pourquoi.

Le mouvement est ancien : **décomposer**. Construis un **graph** d'étapes :

- **Nœuds** — petites tâches ciblées, chacune avec son *propre banc curé*.
- **Arêtes** — ce qui circule entre elles : une spéc, un diff, un rapport.

Tu as fait ça pour coder toute ta vie — petites fonctions, responsabilités uniques, entrées et sorties explicites. Maintenant fais‑le pour le travail lui‑même.`,
    },
    {
      kind: "theory",
      body: `## Fan out, fan in

L'indépendance est le mot préféré du planificateur.

**Fan-out** : trois SDK candidats à évaluer ? Trois nœuds, en parallèle — chacun sur son propre banc, aucun n'a besoin des autres, aucune fuite de contexte entre eux.

**Fan-in** : un nœud *synthèse* reçoit les trois rapports, les pèse contre tes critères, et recommande.

La discipline consiste à repérer la vraie indépendance : le travail parallèle doit partager **aucun état** — des nœuds qui courent pour éditer le même fichier ne forment pas un graph, c'est une bagarre. C'est la pensée de dépendance, le genre que tu appliques déjà aux pipelines de données, maintenant appliquée aux esprits.`,
    },
    {
      kind: "quiz",
      question: `Quel ensemble de sous-tâches est sûr à fan out en parallèle ?`,
      options: [
        "Évaluer trois bibliothèques candidates contre la même checklist — travail indépendant, pas d'état partagé",
        "Écrire un script de migration et exécuter ce même script — les superposer fait gagner du temps",
        "Trois golems éditant le même module en même temps, pour le finir trois fois plus vite",
      ],
      answer: 0,
      explain: `Exécuter avant que les données soient prêtes viole une dépendance, et modifier un fichier partagé multiplie les conflits de fusion. Le test est simple et fiable : si le nœud A ne lit ni la sortie ni l'état du nœud B, ils peuvent s'exécuter en parallèle.`,
    },
    {
      kind: "theory",
      body: `## Le forgeron et le réfuteur

Le chapitre du harnais t'a averti : l'auto‑revue partage les points aveugles de l'auto. Un graph corrige cela *structuralement*.

Ajoute un **nœud vérificateur** : un golem forge ; un *autre* nœud — contexte frais, sans attachement aux choix déjà faits — est chargé de **réfuter** : trouver où le diff viole la spéc, chasser les cas limites, essayer de le casser.

La description du poste compte. "Revois ça" invite un haussement d'épaules. *"Trouve ce qui ne va pas avec ça"* oriente l'esprit vers les trous. Les paires adversariales attrapent ce que l'auto‑revue structurale ne peut pas — c'est la raison pour laquelle les vrais forges associent un créateur à un inspecteur.`,
    },
    {
      kind: "fill",
      prompt: `Donne au deuxième golem son vrai travail :`,
      file: "graph.toml",
      before: `verifier.goal = "`,
      after: ` le diff du nœud forgeron"`,
      choices: ["réfuter", "approuver", "résumer", "réécrire"],
      answer: 0,
      explain: `Un vérificateur chargé d'approuver trouvera un moyen d'approuver. "Summarize" produit du prose, pas de l'inspection ; "rewrite" ne fait qu'un second forgeron avec ses propres points aveugles. La réfutation est le seul objectif qui oriente le nœud vers les trous.`,
    },
    {
      kind: "theory",
      body: `## Orchestration vs. autonomie

Sépare proprement les deux jobs du graph :

- **Les arêtes sont déterministes.** Le code simple décide ce qui tourne quand, ce qui circule où, à quoi ressemble un retry — un flux de contrôle que tu peux lire, tester et rejouer.
- **Le jugement vit à l'intérieur des nœuds.** Dans son boîte, le modèle apporte toute la maîtrise à sa tâche unique.

Égarer la séparation — laisser le modèle improviser quel pas vient ensuite — et les échecs ne sont plus reproductibles : chaque exécution est une nouvelle aventure à travers un graph différent. Garde la structure ennuyeuse et les esprits contenus : **fiabilité du squelette, intelligence des organes.**`,
    },
    {
      kind: "quiz",
      question: `Dans un graph bien construit, où vit le jugement du modèle ?`,
      options: [
        "À l'intérieur des nœuds — tandis que les arêtes entre eux restent du code déterministe que tu peux tester et rejouer",
        "Dans les arêtes — laisser le modèle improviser quel nœud tourne ensuite garde le système flexible",
        "Nulle part — un pipeline sérieux est déterministe de bout en bout, sinon ce n'est pas de l'ingénierie",
      ],
      answer: 0,
      explain: `Un flux de contrôle improvisé signifie des échecs non reproductibles — tu ne peux pas déboguer un chemin qui ne se produit jamais de la même façon deux fois. Et un pipeline sans jugement n'importe où n'avait pas besoin de golems. Squelette déterministe, organes jugeants : chaque type de fiabilité à son endroit.`,
    },
    {
      kind: "theory",
      body: `## Bulkheads pour le raisonnement

Le cadeau le plus silencieux du graph est **la containment**.

Dans un seul prompt gigantesque, une seule confusion à l'étape deux empoisonne tout après — même contexte, pas de bulkheads, l'erreur s'accumule poliment jusqu'à la fin.

Dans un graph, un nœud échoué **échoue seul**. Son contexte est quarantainé ; ses propres évaluations captent l'échec à *sa* frontière — la boussole du dernier chapitre, maintenant postée par nœud ; l'orchestrateur le retry ou le contourne. C'est ce que les pipelines et les outils multi‑agents existent pour te donner — étapes nommées, transferts typés, retries — et c'est la leçon de rayon de blast du keep, un niveau plus haut.`,
    },
    {
      kind: "quiz",
      question: `La tâche : renommer une fonction et ses sites d'appel dans un seul fichier. Que prends‑tu ?`,
      options: [
        "Une boucle simple — ou juste ton éditeur ; les coûts de coordination d'un graph dépasseraient la tâche elle‑même",
        "Un graph — plus de golems signifie plus de qualité, sur les petites tâches et les grandes aussi",
        "Un graph — les petites tâches sont exactement l'endroit pour pratiquer pour les grandes",
      ],
      answer: 0,
      explain: `Chaque nœud coûte une mise en place : contexte à curer, arêtes à définir, échecs à router. Sur une petite tâche, l'ossature dépasse le travail — un conseil de guerre convoqué pour piquer une mouche. Tâche simple, boucle simple ; le graph ne paie son prix que quand la décomposition le justifie.`,
    },
    {
      kind: "theory",
      body: `## Le craft, assemblé

Regarde ce qu'il y a sur ton ceinture maintenant : **spéc** qui disent ce que signifie le bon ; **essais** qui le vérifient pour toujours ; **frontières** qui gardent les mots honnêtes ; un **keep** qui contient le changement ; un **harnais** qui contient le golem ; **mots** qui façonnent ce qu'il voit ; **boucles** qui lui permettent de se corriger ; et un **graph** qui tisse de nombreuses esprits en un plan.

Aucun de ces éléments ne sera porté par l'IA pour toi. Tous les rendent l'IA digne de dix d'elle‑même.

Prochaine étape : retour au royaume — porte le craft dans la Forge et dépense‑le sur le vrai réseau.`,
    },
  ],
} satisfies JourneyConceptText;
