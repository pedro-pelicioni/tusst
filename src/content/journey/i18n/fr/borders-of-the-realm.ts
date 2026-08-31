import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Frontières du Royaume",
  tagline: "Un mot, trois sens — et les frontières qui rendent cela sûr.",
  steps: [
    {
      kind: "theory",
      body: `## Un mot, trois sens

Demande à trois équipes de Stellar ce qu’est un **Account** :

- L’équipe *wallet* : "un détenteur de solde — quelqu’un qui possède des lumens et des actifs."
- L’équipe *anchor* : "un sujet KYC — quelqu’un qu’on doit identifier avant de déplacer de l’argent."
- L’équipe *exchange* : "un participant au carnet d’ordres — quelqu’un avec des offres ouvertes."

Même mot. Même adresse G. **Trois modèles différents.** La plupart des bugs attribués à une « mauvaise communication » viennent précisément de là : deux personnes utilisent le même mot pour désigner deux concepts, chacune persuadée que l’autre parle de la même chose.

La conception pilotée par le domaine, ou DDD, commence ici : rends le langage précis *délibérément*.`,
    },
    {
      kind: "theory",
      body: `## Langage ubiquitaire, contextes délimités

Au sein d’une équipe et d’une partie du système, le DDD exige un **langage ubiquitaire** : un mot, une seule signification, utilisée *partout* — dans les conversations, la spécification et le code. Si la spécification dit « release », la fonction s'appelle \`release\`, pas \`transfer_out\`.

Mais aucun langage ne peut régir tout le royaume. Un **contexte délimité** marque la frontière à laquelle le sens d’un mot peut changer : dans *Payments*, un Account désigne un détenteur de solde ; dans *Compliance*, la même adresse représente un sujet soumis au KYC.

La frontière n’est pas un échec de conception. **La frontière est la conception.**`,
    },
    {
      kind: "diagram",
      body: "Le même mot, trois frontières :",
      caption: "Les lignes pointillées sont des traductions, pas du code partagé. Un contexte qui importe le modèle d'un autre n'a plus de frontière.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "pay",
            label: "PAIEMENTS",
            x: 22,
            y: 20,
            tone: "accent",
            shape: "box",
            note: "Ici un « compte » est une source, un numéro de séquence et un budget de frais.",
          },
          {
            id: "trade",
            label: "TRADING",
            x: 78,
            y: 20,
            tone: "teal",
            shape: "box",
            note: "Ici c'est un ensemble d'offres ouvertes et les actifs qui les libellent.",
          },
          {
            id: "custody",
            label: "GARDE",
            x: 50,
            y: 50,
            tone: "gold",
            shape: "box",
            note: "Et ici c'est un ensemble de signataires avec des seuils. Même mot, trois sens.",
          },
        ],
        edges: [
          {
            from: "pay",
            to: "trade",
            style: "dashed",
          },
          {
            from: "pay",
            to: "custody",
            style: "dashed",
          },
          {
            from: "trade",
            to: "custody",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `L’équipe Compliance te demande d’ajouter \`kyc_status\` et \`risk_score\` au modèle Account du contexte Payments — « c’est le même compte, après tout ». Quelle est la lecture DDD ?`,
      options: [
        "Garde des modèles séparés derrière des frontières distinctes, liés par l’adresse du compte — chaque contexte ne modélise que ce dont il a besoin",
        "Fusionne-les — un modèle Account partagé pour tout le système évite la duplication, ce qui est le plus grand mal",
        "Ajoute les champs mais les marque optionnels, pour que le code Payments puisse simplement les ignorer",
      ],
      answer: 0,
      explain: `Un modèle partagé accumule les champs et les règles de tous les contextes jusqu’à ce qu’aucun ne puisse évoluer sans en casser un autre. Deux modèles légers partageant un identifiant ne constituent pas une duplication : ce sont deux représentations d’une même adresse, chacune détenue par le contexte qui la comprend.`,
    },
    { kind: "fill",
      prompt: `Complétez la règle qui fait d'une frontière une frontière :`,
      file: "NOTES.md",
      before: `À l'intérieur d'un contexte, un mot a exactement un sens. À la frontière, ce sens a le droit de `,
      after: ` .`,
      choices: ["changer", "rester le même", "devenir facultatif", "être hérité par le contexte suivant"],
      answer: 0,
      explain: `Si le sens ne pouvait pas changer, vous n'auriez pas besoin d'une frontière — il vous faudrait un modèle unique partagé, précisément ce que les frontières existent pour empêcher. Une frontière est exactement l'endroit où « Compte » a le droit de vouloir dire autre chose, exprès, avec une traduction au passage.` },
    {
      kind: "theory",
      body: `## Ponts entre contextes : l’ancre

Les contextes doivent encore communiquer. **La cartographie de contexte** consiste à nommer les frontières et à construire des ponts délibérés — traduction à la limite, pour que la langue d’une partie ne fuit pas dans l’autre.

Les **ancres** Stellar incarnent ce modèle dans un véritable métier. D’un côté se trouve le *contexte bancaire* — IBAN, jours ouvrés, conformité. De l’autre, le *contexte du registre* — lignes de confiance, actifs, finalité en cinq secondes. L’ancre assure la **traduction** : un virement entrant devient une émission de jetons ; le rachat d'un jeton devient un paiement bancaire.

Aucun des deux mondes n’a dû adopter le modèle de l’autre. C’est une frontière saine : traversée par traduction, jamais par fuite.`,
    },
    { kind: "theory", body: `## La frontière qui se dissout en silence

Les frontières tombent rarement d'un coup. Elles s'érodent, et toujours par le même geste poli : *« ces deux contextes ne partagent qu'un tout petit peu. »*

Cela commence par un type. Paiements et Conformité ont tous deux besoin d'une adresse, alors ils importent un \`Account\` partagé — juste l'identifiant, rien d'autre. Puis Conformité y veut le statut. Puis Paiements veut un champ de Conformité pour un reçu. Six mois plus tard, le type partagé compte quatorze champs, dont la moitié n'a de sens dans aucun des deux contextes, et aucun des deux camps ne peut le modifier sans une réunion.

Le signe n'est pas la taille de ce qui est partagé. C'est **qui doit être consulté pour le changer**. Une frontière qu'on ne franchit pas sans traduction est une frontière. Une frontière qu'on franchit par un import est une décoration.

Le pont qui reste sain est celui où chaque camp garde son propre modèle et où quelque chose au milieu convertit — c'est exactement ce que fait un anchor, et exactement ce que ne fait pas un type partagé.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## L'épreuve de l'examinateur : tracez les frontières

Voici un système, décrit comme le décrirait un fondateur :

> Une application de transfert d'argent. Les utilisateurs s'inscrivent et passent une vérification d'identité. Ils alimentent un solde par virement bancaire, envoient de l'argent à des destinataires dans un autre pays, et le destinataire retire chez un partenaire local. Le support peut geler un compte et consulter la piste d'audit complète.

Nommez les **contextes délimités** que vous traceriez, et pour chacun : les mots dont le sens change à cette frontière, et comment les contextes se parlent. Modélisation uniquement — pas de schémas, pas de services, pas de noms de framework.`,
      rubric: `1. Nomme au moins trois contextes délimités plausibles, avec une ligne de responsabilité chacun.
2. Identifie au moins un mot qui signifie des choses réellement différentes dans deux de ces contextes, et dit ce qu'il signifie dans chacun.
3. Décrit comment au moins une paire de contextes communique — une traduction au bord, pas un modèle partagé.
4. Ne résout pas les différences en proposant un modèle unique pour tout le monde.
5. Modélisation uniquement — pas de schéma de base, pas de noms de service ni de framework, pas de code.`,
      minChars: 180 },
    { kind: "theory", body: `## Pourquoi le golem a besoin de votre carte

Un LLM a lu un million de bases de code où « compte », « transfert » et « solde » voulaient dire autre chose. Laissez vos frontières implicites et il **mélangera les vocabulaires en plein fichier** — une règle de KYC qui glisse dans votre modèle de paiements, l'idée de Compte d'une plateforme d'échange qui déteint sur celle de votre portefeuille — chaque ligne localement plausible.

Alors écrivez la frontière sur l'établi : *« Nous sommes dans le contexte Paiements. Compte signifie détenteur de solde. Conformité est un modèle distinct — référencez-le par adresse uniquement. »* Un contexte énoncé est une clôture que le golem respecte.

**Ensuite :** vous avez tracé les lignes. Ce qui vit réellement à l'intérieur de l'une d'elles — et quelles choses n'ont le droit de changer qu'ensemble.` },
  ],
  testOut: [
    { question: `Trois équipes définissent « Compte » différemment. Comment le DDD appelle-t-il l'endroit où le sens a le droit de changer ?`,
      options: ["Un contexte délimité — la frontière est la conception, pas un échec de celle-ci","Une collision de noms, à résoudre en renommant l'un d'eux","De la dette technique, à rembourser en unifiant le modèle"], answer: 0 },
    { question: `La Conformité demande d'ajouter \`kyc_status\` au Compte du contexte Paiements. Quelle est la lecture DDD ?`,
      options: ["Garder des modèles séparés derrière des frontières séparées, reliés par l'adresse — chaque contexte ne modélise que ce dont il a besoin","Les fusionner, la duplication étant le mal le plus grand","Ajouter les champs en facultatif pour que Paiements les ignore"], answer: 0 },
    { question: `Qu'est-ce qu'un anchor Stellar, dans le vocabulaire de ce chapitre ?`,
      options: ["Une carte de contextes devenue métier — elle traduit entre le contexte bancaire et le contexte du registre","Un modèle partagé que banques et registre acceptent d'adopter","Une couche de conformité qui surplombe les deux contextes"], answer: 0 },
    { question: `Pourquoi une frontière non énoncée fait-elle plus de mal quand c'est une IA qui écrit ?`,
      options: ["Elle a lu un million de bases où ces mots voulaient dire autre chose, et mélangera les vocabulaires en plein fichier","Elle ne sait pas lire les termes métier et exige des noms techniques","Elle refuse d'avancer tant que chaque terme n'est pas formellement défini"], answer: 0 },
  ],
};
