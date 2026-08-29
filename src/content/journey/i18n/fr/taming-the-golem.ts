import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Dompter le golem",
  tagline: "Ingénierie du harnais : donne à l’IA un établi, pas un simple vœu.",
  steps: [
    {
      kind: "theory",
      body: `## Un esprit dans le vide

Retire-lui tout et un LLM ne fait plus qu’une chose : **du texte entre, du texte sort**. Il ne peut ni exécuter du code, ni lire ton dépôt, ni vérifier la chaîne. Seul, c’est un esprit dans le vide — brillant, aveugle et désarmé.

Tout ce qui transforme cet esprit en *travailleur* constitue son **harnais** : les outils qu’il peut appeler, les fichiers qu’il peut modifier, le bac à sable qui le contient et les vérificateurs qui jugent son résultat.

Et voici ce que beaucoup oublient : le modèle est loué. **Le harnais, lui, relève de l’ingénierie — et il t’appartient.**`,
    },
    {
      kind: "theory",
      body: `## Anatomie d’un harnais

Un harnais efficace se compose d'éléments clairement identifiés :

- **Modèle** — l’esprit.
- **Ensemble d’outils** — ce qu’il peut *faire* : exécuter des tests, éditer des fichiers, interroger un RPC Stellar.
- **Permissions** — ce qu’il peut toucher, et ce qu’il ne peut pas.
- **Répertoire de travail** — le monde qu’il voit.
- **Exécuteur de tests** — le juge que son résultat doit affronter.
- **Étape de relecture** — où un humain (ou un autre golem) inspecte le diff.

Deux équipes utilisant le même modèle avec des harnais différents obtiennent des résultats *radicalement* différents. Lorsque la qualité change, les ingénieurs déboguent le harnais — pas l’horoscope.`,
    },
    {
      kind: "quiz",
      question: `Même modèle, même type de tâche — mais les résultats de ce mois sont nettement moins bons que ceux du mois dernier. Que vérifie en premier l'ingénieur responsable du harnais ?`,
      options: [
        "Ce qui entoure le modèle — le contexte qui lui a été donné, les outils qu’il pouvait exécuter, les vérifications qui bloquent son résultat",
        "Les poids du modèle — ils s’usent sous un usage intensif, comme une machine",
        "Nulle part — le hasard de l’échantillonnage explique toute fluctuation, donc rien n’est actionnable",
      ],
      answer: 0,
      explain: `Les poids ne s’usent pas, et le hasard explique rarement une baisse durable. Les composants du harnais dérivent constamment — fichier déplacé, runner de tests devenu silencieux, permission élargie — mais chacun peut être inspecté, comparé et corrigé. Voilà pourquoi il est essentiel de maîtriser son harnais.`,
    },
    {
      kind: "theory",
      body: `## La vérification vaut la confiance

Le trait le plus dangereux du golem n’est pas l’ignorance — c’est **la confiance quand il se trompe**. Il annonce le succès dans le même ton chaleureux que si le déploiement avait fonctionné ou n’avait jamais eu lieu. La confiance est un *style*, pas un signal.

Un bon harnais ne se contente donc jamais de croire : il **vérifie à nouveau**, à l'aide de juges insensibles à la flatterie :

- le **compilateur** — construit‑il vraiment ?
- la **suite de tests** — les tests du Rite, rouges ou verts
- le **linter** — les standards ont-ils été respectés ?
- la **chaîne elle‑même** — le registre dit-il ce que le golem dit ?

Les affirmations sont des données. Les vérificateurs sont la vérité.`,
    },
    {
      kind: "quiz",
      question: `Le golem annonce : « Contrat déployé et initialisé avec succès. » Que fait un harnais bien conçu de cette affirmation ?`,
      options: [
        "Il la traite comme une hypothèse — lit la chaîne, récupère le contrat, appelle une fonction de lecture et fait confiance au registre",
        "L’accepte — les modèles sont entraînés à être véridiques, et celui‑ci a été fiable jusqu’ici",
        "Demande au golem de vérifier soigneusement son propre travail dans la même session",
      ],
      answer: 0,
      explain: `La relecture par le même esprit partage les mêmes points aveugles — s’il croyait que le déploiement avait fonctionné, il le croira encore. Les vérificateurs indépendants ne partagent pas les points aveugles de personne, et sur Stellar une lecture RPC ne coûte que des millisecondes. Le registre est le détecteur de mensonge le moins cher que tu possèdes.`,
    },
    {
      kind: "theory",
      body: `## Moindre privilège : moins de dents, s’il te plaît

Un golem avec \`rm -rf\` disponible est un golem qui l’exécutera *à terme* — pas par malveillance, mais par un plan erroné confiant à 2 h du matin. Le remède est ancien et éprouvé : **moindre privilège**.

- Accorde des outils pour *cette tâche*, pas des outils en général.
- Privilégie l’accès **lecture‑seule** partout où l’écriture n’est pas la mission.
- Limite-le à un répertoire ; exécute chaque commande dans un bac à sable.
- Donne‑lui **les clés testnet uniquement** — jamais une clé dont la perte te ferait réellement mal.

Les incidents commencent souvent par un pouvoir accordé « au cas où ». Chaque outil élargit le rayon d'impact ; accorde-le en conséquence.`,
    },
    {
      kind: "fill",
      prompt: `Limite le pouvoir du golem avant qu’il ne commence le travail :`,
      file: "harness.toml",
      before: `signing_keys = "`,
      after: `"`,
      choices: ["testnet", "mainnet", "all-networks", "treasury"],
      answer: 0,
      explain: `La règle empirique : un golem ne possède que les clés dont la perte totale peut être ignorée. Les lumens testnet sont gratuits grâce à friendbot ; une clé mainnet ou trésorerie dans une boucle automatisée est un incident avec un compte à rebours.`,
    },
    {
      kind: "theory",
      body: `## Concevoir le chemin de l’échec

Les amateurs conçoivent ce qui se passe lorsque le golem a raison. Les ingénieurs conçoivent ce qui se passe lorsqu’il a **tort** — parce que cela arrivera.

- Une vérification qui échoue **bloque la fusion** ; elle ne se contente pas de consigner un avertissement ignoré.
- Les tentatives ont un **budget**, donc un golem bloqué devient un golem arrêté, pas une facture.
- Un humain examine **un diff avec contexte**, jamais un fait accompli déjà en production.
- Le retour arrière suit une procédure testée, pas une prière.

À chaque étape du harnais, pose-toi cette question : *« si le résultat est faux, qu'est-ce qui le détecte ? »* Si la réponse est « espérons qu'aucun problème ne survienne », tu as formulé un vœu, pas conçu un système.`,
    },
    {
      kind: "quiz",
      question: `Lequel de ces éléments est un chemin d’échec **conçu** ?`,
      options: [
        "Un ensemble de tests rouge bloque l’auto‑fusion, et un humain reçoit le diff plus la sortie échouée",
        "Le prompt instruit fermement le golem à être extrêmement prudent et à tout vérifier",
        "La boucle réessaie la même tâche, sans limite, jusqu’à ce que la sortie passe enfin",
      ],
      answer: 0,
      explain: `Les instructions expriment une intention — elles sont utiles, mais ne *détectent* aucun échec. Des tentatives illimitées produisent une facture sans plafond (un prochain chapitre présentera la solution). Un chemin d'échec bien conçu comporte un mécanisme de détection, un arrêt et un humain disposant d'assez de contexte pour agir.`,
    },
    {
      kind: "theory",
      body: `## Tu l'utilises depuis le début

Regarde autour de toi : **TUSST est un harnais.**

Le runner d'évaluation de la Forge est un harnais de vérification : ta solution s’exécute dans un bac à sable, des tests cachés la jugent et aucune déclaration pleine d'assurance ne transforme un échec en réussite. Les laboratoires on-chain vont plus loin : ils ne te demandent pas d'affirmer que tu as déployé — ils **lisent la chaîne** et le vérifient.

C’est toute la discipline en une image : construis l'établi de façon à rendre l’erreur *détectable* et la réussite *démontrable* — pour les golems comme pour les humains.

La prochaine discipline porte sur les mots eux-mêmes — ce que le golem voit réellement sur l'établi.`,
    },
  ],
} satisfies JourneyConceptText;
