import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Ce Que le Golem Voit",
  tagline: "Context engineering : curation, pas accumulation.",
  steps: [
    {
      kind: "theory",
      body: `## Curation, pas accumulation

Le prompt engineering demande *comment formuler*. Le **context engineering** pose la question plus importante : *qu'est-ce qui arrive devant le golem, au juste ?*

Pour un bug dans le flux de remboursement, il lui faut trois choses :

- le **module de remboursement** — le code réellement en jeu,
- les **règles de remboursement de la spécification** — l'artefact du Chapitre I,
- le **test qui échoue** — l'artefact du Rite, qui nomme exactement ce que « corrigé » veut dire.

Pas le dépôt entier. Pas les notes de migration du mois dernier. La compétence, c'est la *sélection* : les deux cents bonnes lignes valent mieux que les œuvres complètes de votre code.`,
    },
    {
      kind: "theory",
      body: `## Un établi, monté

Le bug de remboursement, pour de vrai. Voici ce qui monte, avec une taille et une raison :

- \`refunds.rs\` (180 lignes) — le code qui est faux. Pas le module qui l'appelle ; celui qui décide.
- Les trois clauses de remboursement de la spécification (14 lignes) — pour que « correct » ait une définition qui ne soit pas l'avis du golem.
- \`test_refund_after_deadline\` et sa sortie d'échec (20 lignes) — la seule épreuve au rouge, et ce qu'elle a réellement affiché.

Et ce qui reste dehors, ce qui est la moitié difficile :

- \`payments.rs\`, même si les remboursements vivent sous les paiements — ce n'est pas là qu'est le bug, et **tout fichier sur l'établi est un fichier que le golem peut décider d'améliorer**.
- Les notes de migration de la version qui a introduit l'échéance. Elles décrivent un schéma qui a changé deux fois depuis, et le matériel périmé enseigne avec aplomb.
- Le reste de la suite de tests. Six cents lignes au vert ne disent rien sur celle qui est au rouge.

Environ 210 lignes, face à un dépôt de quarante mille. Ce rapport *est* le métier.`,
    },
    {
      kind: "diagram",
      body: "Ce que vous croyez avoir envoyé, et ce qui est réellement arrivé :",
      caption:
        "Le contexte est un budget, pas un contenant. Tout ce que vous ajoutez entre en concurrence avec tout ce que vous y avez déjà mis.",
      view: {
        kind: "compare",
        columns: [
          { id: "you", label: "ce que vous vouliez dire", tone: "neutral" },
          { id: "model", label: "ce qu'il a reçu", tone: "accent" },
        ],
        rows: [
          { label: "la tâche", cells: [{ text: "« corrige le bug »", tone: "neutral" }, { text: "trois mots, aucune sortie d'erreur, aucun fichier", tone: "accent" }] },
          { label: "le code", cells: [{ text: "« tout est dans le dépôt »", tone: "neutral" }, { text: "ce qui a tenu — en général la mauvaise moitié", tone: "accent" }] },
          { label: "le standard", cells: [{ text: "« tu connais notre style »", tone: "neutral" }, { text: "rien ; il n'a jamais vu vos commentaires de revue", tone: "accent" }] },
        ],
      },
    },
    {
      kind: "widget",
      component: "context-window",
      body: `Voici ce budget. **Chargez l'établi** et regardez deux chiffres bouger en même temps — combien de place il reste, et quelle part de ce qui s'y trouve concerne réellement la tâche.`,
    },
    {
      kind: "quiz",
      question: `Vous envoyez le golem corriger un bug dans le flux de remboursement. Qu'est-ce qui va sur l'établi ?`,
      options: [
        "Le module de remboursement, les règles de remboursement de la spécification et le test qui échoue — et guère plus",
        "Le dépôt entier, pour qu'aucun détail potentiellement pertinent ne manque",
        "Seulement le message d'erreur — tout contexte de code biaiserait son regard neuf",
      ],
      answer: 0,
      explain: `Affamer et noyer sont deux modes d'échec : trop peu de contexte force à deviner, et un contexte indiscriminé enterre le signal et invite à des modifications que vous n'avez jamais demandées. La curation — le module pertinent, la spécification, l'épreuve — est le métier lui-même.`,
    },
    {
      kind: "theory",
      body: `## Pourriture du contexte

Voici la partie contre-intuitive : un contexte hors sujet ne fait pas que gaspiller de la place — il **nuit activement**.

- Un fichier parasite invite le golem à y toucher « pour aider ».
- Des vocabulaires mélangés attirent le mauvais modèle de Compte — le cauchemar du Chapitre III, auto-infligé.
- Une doc périmée et du code mort enseignent l'ancien comportement comme s'il était courant.
- Et plus l'établi est long, plus l'attention s'amincit : votre unique contrainte cruciale rivalise désormais avec dix mille tokens de bruit.

La curation coupe dans les deux sens. **Retirer de l'établi est aussi puissant qu'y ajouter.**`,
    },
    {
      kind: "quiz",
      question: `Lequel de ceux-ci fait le plus de dégâts sur un établi encombré ?`,
      options: [
        "Une doc périmée décrivant l'ancien fonctionnement du module — elle enseigne l'ancien comportement comme courant",
        "Un long fichier sans rapport, qui finit simplement ignoré",
        "Des lignes vides en trop entre les sections du prompt",
      ],
      answer: 0,
      explain: `Le matériel sans rapport vous coûte de la place et de l'attention. Le matériel *contradictoire* vous coûte la justesse : le golem n'a aucun moyen de savoir laquelle des deux versions de la vérité est l'actuelle, et sûr-de-lui-et-faux est le mode d'échec coûteux.`,
    },
    {
      kind: "fill",
      prompt: `Complétez la phrase qui sépare cette discipline du prompting :`,
      file: "NOTES.md",
      before: `Le contexte est un budget, pas un contenant — c'est pourquoi retirer de l'établi est `,
      after: ` .`,
      choices: [
        "aussi puissant qu'y ajouter",
        "utile seulement quand on manque de place",
        "un dernier recours quand le modèle s'embrouille",
        "géré automatiquement par le modèle",
      ],
      answer: 0,
      explain: `C'est le chapitre entier en une ligne. Formuler est une compétence qui se travaille en un après-midi ; décider de ce que le golem ne voit jamais est la part qui reste difficile, et celle qui sépare un établi qui fonctionne d'un établi plein.`,
    },
    {
      kind: "theory",
      body: `## Pourquoi c'est le dernier chapitre tranquille

Jusqu'ici le golem a fait une chose à la fois : vous montez l'établi, vous écrivez la demande, vous lisez la réponse. La boucle, c'est encore vous.

À l'instant où il se met à agir sur sa propre sortie — lancer le test qu'il vient d'écrire, lire l'échec, réessayer — tout ceci se compose. Un établi simplement encombré devient un établi qui **grandit**, tout seul, à chaque pas qu'il fait.

**Ensuite :** la boucle qui agit, observe et corrige — et comment lui dire quand s'arrêter.`,
    },
  ],
  testOut: [
    { question: `Quelle question le context engineering pose-t-il que le prompt engineering ne pose pas ?`,
      options: ["Ce qui arrive devant le modèle, au juste — une question de sélection, pas de formulation","Comment rédiger l'instruction pour que le modèle ne puisse pas la mal lire","À quel modèle envoyer la tâche"], answer: 0 },
    { question: `Pourquoi un contexte hors sujet est-il pire qu'un simple gaspillage ?`,
      options: ["Un parasite invite à des modifications non demandées, et le matériel périmé enseigne l'ancien comportement comme courant","Il ralentit la réponse au point de casser le rythme de travail","Les modèles facturent plus les entrées longues, c'est donc purement un problème de coût"], answer: 0 },
    { question: `Envoyer le dépôt entier au lieu de trois fichiers pertinents vous donne quoi ?`,
      options: ["Ce qui a tenu dans le budget — et ce n'est pas vous qui choisissez quelle moitié","Une vue complète, au prix d'une réponse plus lente","Le même résultat, puisque les modèles ignorent ce qui n'est pas pertinent"], answer: 0 },
    { question: `Les deux modes d'échec portent un nom dans ce chapitre. Lesquels ?`,
      options: ["Affamer — trop peu, donc il devine ; et noyer — tant que le signal est enterré","Surapprentissage et sous-apprentissage","Démarrage à froid et pourriture du contexte"], answer: 0 },
  ],
};
