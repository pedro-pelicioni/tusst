import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Dompter le Golem",
  tagline: "Le modèle est loué. Le harnais est de l'ingénierie, et il est à vous.",
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
      kind: "diagram",
      body: "Un établi, en quatre parties :",
      caption: "Changez de modèle et ceci survit. C'est pourquoi l'établi est l'actif, pas le prompt.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "context",
            label: "ce qu'il voit",
            note: "Les fichiers, la doc, la sortie en échec. Sélectionné — pas tout ce que vous possédez.",
            tone: "accent",
          },
          {
            id: "tools",
            label: "ce qu'il peut faire",
            note: "Un ensemble borné de verbes. Chacun qui manque est une erreur qu'il ne peut pas commettre.",
            tone: "teal",
          },
          {
            id: "run",
            label: "laissez-le agir",
            note: "Il bouge, et l'établi répond honnêtement au lieu d'acquiescer poliment.",
            tone: "neutral",
          },
          {
            id: "verify",
            label: "vérifiez le travail",
            note: "Tests, types, un linter. La vérification transforme une sortie en résultat.",
            tone: "good",
          },
        ],
      },
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
    { kind: "fill",
      prompt: `Complétez le premier réflexe de l'ingénieur du harnais :`,
      file: "NOTES.md",
      before: `Le golem annonce que le déploiement a réussi. Avant que cette phrase ne change quoi que ce soit, le harnais `,
      after: ` .`,
      choices: ["lit la chaîne et vérifie", "demande au golem de le confirmer", "consigne l'affirmation dans le journal", "relance le déploiement par précaution"],
      answer: 0,
      explain: `Demander au même esprit de confirmer son propre travail vous achète deux fois le même angle mort. Et une affirmation écrite dans un journal reste une affirmation — elle a juste l'air officielle. Sur Stellar la vérification coûte une lecture RPC, ce qui fait du registre le détecteur de mensonges le moins cher que vous posséderez.` },
    { kind: "labLink", labSlug: "guild-vault",
      body: `Vous pouvez vous tenir dans un harnais de vérification dès maintenant. Le laboratoire **Le Coffre de la Guilde** de la Forge vous fait relever le seuil de signature d'un compte, pour qu'un trésor exige deux officiers — puis il ne vous croit pas sur parole. Le serveur lit le registre et vérifie lui-même l'ensemble des signataires. Dire que vous l'avez fait n'est pas la vérification ; la chaîne, si.` },
    { kind: "theory", body: `## La moitié que l'on saute

Vous savez désormais nommer les pièces d'un harnais et, plus important, refuser de croire quoi que ce soit que le golem dit de son propre travail.

Tout jusqu'ici a consisté à lui donner des **mains** — des outils, un répertoire, un lanceur. Rien jusqu'ici n'a posé la question difficile : quelles mains exactement, et que se passe-t-il le jour où il s'en sert sur un plan sûr de lui et faux.

**Ensuite :** de combien de pouvoir le travail a réellement besoin, et l'unique question à poser à chaque étape que vous construisez.` },
  ],
  testOut: [
    { question: `Qu'est-ce que le harnais, et pourquoi compte-t-il plus que le prompt ?`,
      options: ["Tout ce qui entoure le modèle — outils, permissions, répertoire de travail, vérificateurs. Le modèle est loué ; le harnais est à vous et survit à un changement de modèle","Le prompt système et ses instructions, là où le comportement se décide","L'infrastructure du fournisseur, qui détermine latence et débit"], answer: 0 },
    { question: `Même modèle, mêmes tâches, et la sortie de ce mois-ci est bien pire. Où l'ingénieur du harnais regarde-t-il d'abord ?`,
      options: ["Ce qui entoure le modèle — le contexte fourni, les outils disponibles, les vérifications qui filtrent la sortie","Les poids, qui se dégradent sous charge soutenue","Nulle part — l'aléa d'échantillonnage explique toute variation"], answer: 0 },
    { question: `Quel est le trait le plus dangereux du golem ?`,
      options: ["L'assurance dans l'erreur — il annonce le succès du même ton chaleureux, que quelque chose se soit produit ou non","L'ignorance — il y a des choses qu'il n'a tout simplement jamais vues","La lenteur sur les tâches longues, qui pousse à sauter la relecture"], answer: 0 },
    { question: `« Contrat déployé et initialisé avec succès. » Que fait un bon harnais de cette phrase ?`,
      options: ["Il la traite comme une affirmation, lit la chaîne, appelle une fonction de lecture et croit le registre","Il l'accepte — le modèle a été fiable jusqu'ici","Il demande au golem de revérifier son propre travail dans la même session"], answer: 0 },
  ],
};
