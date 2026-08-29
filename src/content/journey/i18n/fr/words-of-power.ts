import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Mots de pouvoir",
  tagline:
    "Ingénierie des prompts et du contexte — ce que le golem voit réellement.",
  steps: [
    {
      kind: "theory",
      body: `## L'établi est son monde entier

Le golem ne connaît pas ton dépôt. Il ne se souvient pas d’hier, et il ne voit pas le fichier que tu *n’as pas* attaché. Son univers complet est la **fenêtre de contexte** — le texte qui se trouve devant lui en ce moment.

C’est la règle fondamentale de l'art du prompt, sans rien de mystique : **tu décides ce qui existe.** Ce qui se trouve sur l'établi constitue son monde ; ce qui n'y figure pas n'a jamais existé pour lui.

Donc la question derrière chaque prompt n’est pas « comment formuler ? » mais *« qu’est-ce que le golem doit voir pour bien faire ? »*`,
    },
    {
      kind: "theory",
      body: `## Anatomie d’un prompt

Un prompt efficace est un petit document d’ingénierie composé de quatre parties :

1. **Rôle & instructions** — quel travail est effectué, et comment : « Tu implémentes un cas d’usage dans un domaine de paiements. »
2. **Contraintes** — ce qui est obligatoire et ce qui est interdit : « API publique inchangée. Aucune nouvelle dépendance. Aucun panic. »
3. **Exemples** — un exemple de *bon résultat*, afin de montrer la qualité au lieu de la décrire.
4. **Demande** — la tâche réelle, énoncée en dernier, précise et unique.

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
      explain: `Le golem ne peut pas échouer au critère « haute qualité » : presque n'importe quel résultat peut prétendre y répondre. Il *peut* en revanche violer « ne jamais paniquer ». C'est précisément le but : les critères d’acceptation rendent l'erreur identifiable et guident ainsi le modèle. La précision l’emporte sur la politesse — et sur la flatterie.`,
    },
    {
      kind: "theory",
      body: `## Montre, ne raconte pas

Les adjectifs décrivent la qualité ; **les exemples la définissent.** Un exemple fonctionnel l’emporte sur trois paragraphes d’adjectifs, car le golem est une machine de continuation de motifs — donne-lui donc un motif à poursuivre.

Tu veux des tests dans ton style ? Colle **un test idéal** et dis « comme ça. » Tu veux des messages d’erreur qui portent un code et un indice de remédiation ? Montre *un*.

Le chapitre I t’a appris que les exigences rédigées en prose laissent filtrer l’ambiguïté. Le même principe s’applique sur l'établi : un exemple est une petite spécification qui peut être *imitée* plutôt qu'interprétée — et l'imitation perd beaucoup moins d'information que l'interprétation.`,
    },
    {
      kind: "theory",
      body: `## Ingénierie de contexte : curation, pas accumulation

L’ingénierie des prompts demande *comment formuler*. **L’ingénierie du contexte** pose une question plus importante : *qu'est-ce qui doit réellement se trouver sur l'établi ?*

Pour un bug dans le chemin de remboursement, le golem a besoin :

- du **module de remboursement** — le code réellement en jeu,
- de la **spécification** des remboursements — l’artefact du chapitre I,
- du **test en échec** — l’artefact du Rite, qui définit exactement ce que signifie « corrigé ».

Pas de tout le dépôt. Pas des notes de migration du mois dernier. La compétence réside dans la *sélection* : les deux cents lignes pertinentes valent mieux que l'intégralité de la base de code.`,
    },
    {
      kind: "diagram",
      body: "Ce que vous croyez avoir envoyé, et ce qui est réellement arrivé :",
      caption: "Le contexte est un budget, pas un récipient. Tout ce que vous ajoutez concurrence ce que vous y aviez déjà mis.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "you",
            label: "ce que vous vouliez dire",
            tone: "neutral",
          },
          {
            id: "model",
            label: "ce qu'il a reçu",
            tone: "accent",
          },
        ],
        rows: [
          {
            label: "la tâche",
            cells: [
              {
                text: "« corrige le bug »",
                tone: "neutral",
              },
              {
                text: "trois mots, aucune sortie d'erreur, aucun fichier",
                tone: "accent",
              },
            ],
          },
          {
            label: "le code",
            cells: [
              {
                text: "« tout est dans le dépôt »",
                tone: "neutral",
              },
              {
                text: "ce qui tenait — souvent la mauvaise moitié",
                tone: "accent",
              },
            ],
          },
          {
            label: "le standard",
            cells: [
              {
                text: "« tu connais notre style »",
                tone: "neutral",
              },
              {
                text: "rien ; il n'a jamais vu vos commentaires de revue",
                tone: "accent",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Pourriture de contexte

Voici ce qui paraît contre-intuitif : un contexte inutile ne gaspille pas seulement de la place — il **nuit activement**.

- Un fichier distrayant invite le golem à « aider » à le toucher.
- Des vocabulaires mélangés activent le mauvais modèle de compte — le cauchemar du chapitre III, provoqué par toi-même.
- Des docs obsolètes et du code mort enseignent un vieux comportement comme s’il était actuel.
- Et plus l'établi est encombré, plus l’attention se disperse : ta contrainte essentielle doit désormais rivaliser avec dix mille tokens de bruit.

La sélection fonctionne dans les deux sens. **Retirer un élément de l'établi peut être aussi puissant qu'en ajouter un.**`,
    },
    {
      kind: "quiz",
      question: `Tu charges le golem de corriger un bug dans le parcours de remboursement. Que places-tu sur l'établi ?`,
      options: [
        "Le module de remboursement, les règles correspondantes de la spécification et le test en échec — presque rien d'autre",
        "Tout le dépôt, afin qu’aucun détail potentiellement pertinent ne manque",
        "Seulement le message d’erreur — tout contexte de code biaiserait sa perspective fraîche",
      ],
      answer: 0,
      explain: `La famine et l'étouffement sont deux causes d'échec : trop peu de contexte oblige le modèle à deviner, tandis qu'un contexte indiscriminé noie le signal et invite des modifications non demandées. Sélectionner le module pertinent, la spécification et le test constitue le cœur du métier.`,
    },
    {
      kind: "fill",
      prompt: `Le prompt le plus tranchant que tu possèdes est celui que tu as déjà écrit :`,
      file: "prompt.md",
      before: `Fais réussir ce `,
      after: ` en échec, sans changer ses assertions.`,
      choices: ["test", "build", "demo", "deploy"],
      answer: 0,
      explain: `Un test en échec est un critère d’acceptation exécutable : il exprime le comportement, les cas limites et la définition du résultat attendu sous une forme impossible à mal interpréter. Les builds, démos et déploiements peuvent eux aussi échouer, mais seul un test contient des assertions : ta spécification s'est dotée de dents et sert désormais aussi de prompt.`,
    },
    {
      kind: "theory",
      body: `## L’itération est le resserrement de la spécification

Le premier résultat est incorrect. Ce n'est pas grave : **c'est une donnée**. L'amateur relance les dés ; l'ingénieur **lit l'échec et recherche l'instruction manquante**.

Le golem a ignoré un cas limite ? Tes contraintes ne le mentionnaient pas. Le style est mauvais ? Tu as décrit au lieu de montrer. Il a modifié des fichiers interdits ? L'établi était encombré ou la frontière n’était pas clairement définie.

Chaque échec révèle une lacune dans tes mots : corrige le *prompt*, pas seulement le résultat, exactement comme le chapitre I t’a appris à préciser une spécification.

La prochaine discipline : mettre les mots en mouvement — la boucle qui agit, observe et corrige.`,
    },
  ],
} satisfies JourneyConceptText;
