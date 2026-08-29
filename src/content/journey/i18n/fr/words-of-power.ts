import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Mots de Pouvoir",
  tagline: "Ingénierie de prompt & contexte — ce que le golem voit réellement.",
  steps: [
    {
      kind: "theory",
      body: `## Le banc est le monde entier

Le golem ne connaît pas ton dépôt. Il ne se souvient pas d’hier, et il ne voit pas le fichier que tu *n’as pas* attaché. Son univers complet est la **fenêtre de contexte** — le texte qui se trouve devant lui en ce moment.

C’est la règle la plus profonde du prompting, et ce n’est pas mystique : **tu décides ce qui existe.** Tout ce qui est sur le banc est le monde ; tout ce qui est hors du banc n’a jamais eu lieu.

Donc la question derrière chaque prompt n’est pas « comment formuler ? » mais *« qu’est-ce que le golem doit voir pour bien faire ? »*`,
    },
    {
      kind: "theory",
      body: `## Anatomie d’un prompt

Un prompt fonctionnel est un petit document d’ingénierie en quatre parties :

1. **Rôle & instructions** — quel travail est effectué, et comment : « Tu implémentes un cas d’usage dans un domaine de paiements. »
2. **Contraintes** — les musts et must-nots : « API publique inchangée. Pas de nouvelles dépendances. Pas de panique. »
3. **Exemples** — un échantillon *bon*, afin que la qualité soit montrée plutôt que décrite.
4. **La demande** — la tâche réelle, énoncée en dernier, précise et unique.

La plupart des mauvais prompts ne sont pas mal *formulés* — ils **manquent une partie**, généralement les contraintes ou l’exemple.`,
    },
    {
      kind: "quiz",
      question: `Quelle instruction améliore réellement le code du golem ?`,
      options: [
        "Valide le montant : rejette zéro et les négatifs avec une erreur typée ; ne panique jamais ; garde l’API publique inchangée",
        "Écris un code vraiment propre, professionnel, de haute qualité, prêt pour la production",
        "Tu es le meilleur programmeur qui ait jamais vécu — code en conséquence",
      ],
      answer: 0,
      explain: `Le golem ne peut pas échouer « high-quality » — chaque sortie peut plausiblement répondre à ce critère. Il *peut* échouer « never panic », et c’est le point : les critères d’acceptation créent la possibilité d’être incorrect, ce qui guide un modèle. La spécificité l’emporte sur la politesse — et la flatterie.`,
    },
    {
      kind: "theory",
      body: `## Montre, ne raconte pas

Les adjectifs décrivent la qualité ; **les exemples la définissent.** Un exemple fonctionnel l’emporte sur trois paragraphes d’adjectifs, car le golem est une machine de continuation de motifs — donne-lui donc un motif à poursuivre.

Tu veux des tests dans ton style ? Colle **un test idéal** et dis « comme ça. » Tu veux des messages d’erreur qui portent un code et un indice de remédiation ? Montre *un*.

Le chapitre I t’a appris que les exigences en prose fuient l’ambiguïté. Le même principe s’applique sur le banc : un exemple est une petite spécification qui est *copiée* plutôt que interprétée — et copier perd beaucoup moins que l’interprétation.`,
    },
    {
      kind: "theory",
      body: `## Ingénierie de contexte : curation, pas accumulation

L’ingénierie de prompt demande *comment formuler*. **L’ingénierie de contexte** pose la question plus importante : *qu’est‑ce qui se trouve sur le banc ?*

Pour un bug dans le chemin de remboursement, le golem a besoin :

- du **module de remboursement** — le code réellement en jeu,
- de la **spécification** des remboursements — l’artifact du chapitre I,
- du **test échoué** — l’artifact du Rite, nommant exactement ce que « fixé » signifie.

Pas tout le dépôt. Pas les notes de migration du mois dernier. La compétence est *sélection *: les deux cents bonnes lignes l’emportent sur les œuvres complètes de ta base de code.`,
    },
    {
      kind: "theory",
      body: `## Pourriture de contexte

Voici la partie contre-intuitive : un contexte inutile ne gaspille pas seulement de l’espace — il **nuise activement**.

- Un fichier distrayant invite le golem à « aider » à le toucher.
- Des vocabulaires mixtes entraînent le mauvais modèle de compte — la nuitée du chapitre III, auto‑inflictée.
- Des docs obsolètes et du code mort enseignent un vieux comportement comme s’il était actuel.
- Et plus le banc est long, plus l’attention est fine : ta contrainte cruciale se bat maintenant avec dix mille tokens de bruit.

La curation coupe les deux sens. **Enlever du banc est aussi puissant que d’y ajouter.**`,
    },
    {
      kind: "quiz",
      question: `Tu envoies le golem pour corriger un bug dans le chemin de remboursement. Que mets‑tu sur le banc ?`,
      options: [
        "Le module de remboursement, les règles de remboursement de la spécification, et le test échoué — et peu d’autre",
        "Tout le dépôt, afin qu’aucun détail potentiellement pertinent ne manque",
        "Seulement le message d’erreur — tout contexte de code biaiserait sa perspective fraîche",
      ],
      answer: 0,
      explain: `La faim et l’étouffement sont tous deux des modes d’échec : trop peu de contexte force la supposition, tandis qu’un contexte indiscriminé entoure le signal et invite des modifications que tu n’as jamais demandées. La curation — le module pertinent, la spécification, l’essai — est le métier lui‑même.`,
    },
    {
      kind: "fill",
      prompt: `Le prompt le plus tranchant que tu possèdes est celui que tu as déjà écrit :`,
      file: "prompt.md",
      before: `Fais réussir ce `,
      after: ` en échec, sans changer ses assertions.`,
      choices: ["test", "build", "demo", "deploy"],
      answer: 0,
      explain: `Un test qui échoue est un critère d’acceptation exécutable — comportement, bords et achèvement dans une forme qui ne peut être mal interprétée. Les builds, les démos et les déploiements peuvent échouer aussi, mais seul un test porte des assertions : ta spécification avec des dents, maintenant en sous‑emploi comme prompt.`,
    },
    {
      kind: "theory",
      body: `## L’itération est le resserrement de la spécification

La première sortie est fausse. Pas de problème — c’est des données. Le mouvement amateur est de relancer les dés ; le mouvement de l’ingénieur est **de lire l’échec et de trouver l’instruction manquante**.

Le golem a ignoré un cas limite ? Tes contraintes ne l’ont jamais mentionné. Mauvais style ? Tu as dit au lieu de montrer. Touché des fichiers qu’il ne devait pas ? Le banc était encombré, ou la frontière n’était pas déclarée.

Chaque échec nomme un trou dans tes mots — répare le *prompt*, pas seulement la sortie, exactement comme le chapitre I t’a appris à resserrer une spécification.

La prochaine discipline : mettre les mots en mouvement — la boucle qui agit, observe et corrige.`,
    },
  ],
} satisfies JourneyConceptText;
