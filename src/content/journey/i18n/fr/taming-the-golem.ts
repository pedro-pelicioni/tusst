import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Domptage du Golem",
  tagline: "Ingénierie de la prise : donne à l’IA un banc, pas un vœu.",
  steps: [
    {
      kind: "theory",
      body: `## Un esprit dans le vide

Enlevez tout et un LLM ne fait qu’une seule chose : **texte en, texte sorti**. Il ne peut pas exécuter de code, lire ton dépôt ou vérifier la chaîne. Seul, c’est un esprit dans le vide — brillant, aveugle et désarmé.

Tout ce qui transforme cet esprit en *travailleur* est la **prise** : les outils qu’il peut appeler, les fichiers qu’il peut toucher, le bac à sable qui le contient, les vérificateurs qui jugent son résultat.

Et voici la partie que la plupart des gens oublient : le modèle est loué. **La prise est de l’ingénierie — et elle est à toi.**`,
    },
    {
      kind: "theory",
      body: `## Anatomie d’une prise

Une prise fonctionnelle a des parties nommées :

- **Modèle** — l’esprit.
- **Ensemble d’outils** — ce qu’il peut *faire* : exécuter des tests, éditer des fichiers, interroger un RPC Stellar.
- **Permissions** — ce qu’il peut toucher, et ce qu’il ne peut pas.
- **Répertoire de travail** — le monde qu’il voit.
- **Exécuteur de tests** — le juge que son résultat doit affronter.
- **Étape de relecture** — où un humain (ou un autre golem) inspecte le diff.

Deux équipes avec le même modèle et des prises différentes obtiennent des résultats *extrêmement* différents. Quand la qualité du résultat change, les ingénieurs déboguent la prise — pas l’horoscope.`,
    },
    {
      kind: "quiz",
      question: `Même modèle, même type de tâche — mais les résultats de ce mois sont bien plus mauvais que ceux du mois dernier. Où un ingénieur de prise regarde-t-il en premier ?`,
      options: [
        "Ce qui entoure le modèle — le contexte qui lui a été donné, les outils qu’il pouvait exécuter, les vérifications qui bloquent son résultat",
        "Les poids du modèle — ils s’usent sous un usage intensif, comme une machine",
        "Nulle part — le hasard de l’échantillonnage explique toute fluctuation, donc rien n’est actionnable",
      ],
      answer: 0,
      explain: `Les poids ne s’usent pas, et le hasard explique rarement une baisse soutenue. Les parties de la prise dérivent constamment — un fichier déplacé, un exécuteur de tests silencieux, une permission élargie — et chacune d’elles est inspectable, diffable et corrigible. C’est pourquoi posséder la prise compte.`,
    },
    {
      kind: "theory",
      body: `## La vérification vaut la confiance

Le trait le plus dangereux du golem n’est pas l’ignorance — c’est **la confiance quand il se trompe**. Il annonce le succès dans le même ton chaleureux que si le déploiement avait fonctionné ou n’avait jamais eu lieu. La confiance est un *style*, pas un signal.

Donc une prise ne fait jamais confiance ; elle **re-vérifie**, en utilisant des juges qui ne peuvent pas être flattés :

- le **compilateur** — construit‑il vraiment ?
- l’**ensemble de tests** — tes essais du Rite, rouges ou verts
- le **linter** — les standards ont-ils été respectés ?
- la **chaîne elle‑même** — le registre dit-il ce que le golem dit ?

Les affirmations sont des données. Les vérificateurs sont la vérité.`,
    },
    {
      kind: "quiz",
      question: `Le golem rapporte : « Contrat déployé et initialisé avec succès. » Que fait une prise bien construite avec cette phrase ?`,
      options: [
        "La traite comme une affirmation — lit la chaîne, récupère le contrat, appelle une fonction vue, et croit au registre",
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
- Limite‑le à un répertoire ; sandbox tout ce qui s’exécute.
- Donne‑lui **les clés testnet uniquement** — jamais une clé dont la perte te ferait réellement mal.

Le pouvoir accordé « juste au cas où » est la façon dont les incidents commencent. Chaque outil est un rayon d’explosion ; accorde‑le en conséquence.`,
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

Les amateurs conçoivent ce qui se passe quand le golem a raison. Les ingénieurs conçoivent ce qui se passe quand il a **faux** — parce qu’il le sera parfois.

- Une vérification échouée **bloque la fusion** ; elle ne logge pas un avertissement dans le vide.
- Les tentatives ont un **budget**, donc un golem bloqué devient un golem arrêté, pas une facture.
- Un humain examine **un diff avec contexte**, jamais un fait accompli déjà en production.
- Le rollback est un chemin testé, pas une prière.

Pour chaque étape de la prise, pose une question : *« quand c’est faux, qu’est‑ce qui le capture ? »* Si la réponse est « on espère qu’aucun problème ne survient » — c’est un vœu, pas une conception.`,
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
      explain: `Les instructions sont des espoirs — utiles, mais rien ne *capture* quoi‑que‑ce‑soit. Les tentatives illimitées sont une facture sans plafond (un chapitre suivant nomme la solution). Un chemin conçu a un tripwire, un arrêt, et un humain avec assez de contexte pour agir.`,
    },
    {
      kind: "theory",
      body: `## Tu as été dedans depuis le début

Regarde autour : **TUSST est une prise.**

Le runner gradué de la Forge est une prise de vérification — ta solution s’exécute dans un bac à sable, des essais cachés la jugent, et aucune quantité de prose confiante ne transforme un rouge en vert. Les laboratoires on‑chain vont plus loin : ils ne demandent pas *si tu dis* que tu as déployé — ils **lisent la chaîne** et vérifient.

C’est la discipline en une image : construis le banc pour que l’erreur soit *détectable* et la réussite soit *prouvable* — pour les golems et pour les humains.

La prochaine discipline : les mots eux‑mêmes — ce que le golem voit réellement sur le banc.`,
    },
  ],
} satisfies JourneyConceptText;
