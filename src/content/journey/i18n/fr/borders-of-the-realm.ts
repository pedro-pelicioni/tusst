import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Frontières du royaume",
  tagline: "DDD et contextes délimités, appliqués à Stellar lui-même.",
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
    {
      kind: "theory",
      body: `## Entités et objets de valeur

Deux sortes de choses vivent dans tout contexte :

- Une **entité** possède une identité qui survit au changement. Un **Account** Stellar est le même compte après mille paiements — son adresse est son identité ; ses soldes ne sont que l’état.
- Un **objet-valeur** *est* défini par sa valeur. Un **Asset** Stellar associe un code à un émetteur : deux \`USDC\` du même émetteur sont interchangeables — en réalité, ils sont indiscernables. Change l’émetteur et tu n’as pas modifié l’actif ; tu obtiens un *autre* actif.

Les entités sont suivies. Les valeurs sont comparées. Mélanger les deux est la naissance des bugs fantômes.`,
    },
    {
      kind: "quiz",
      question: `Quel est un **objet de valeur** dans le domaine Stellar ?`,
      options: [
        "Un actif — code + émetteur ; deux avec les mêmes champs sont la même chose, sans identité propre",
        "Un compte — il conserve son identité tandis que ses soldes changent en dessous",
        "Un validateur — il reste le même nœud après redémarrages et changements d’IP",
      ],
      answer: 0,
      explain: `Les deux autres réponses décrivent des choses vraies — mais ce sont des *entités* : identité qui survit au changement. L’actif est purement de valeur : l’égalité se fait champ par champ, et « lequel est l’original ? » n’est même pas une question pertinente.`,
    },
    {
      kind: "theory",
      body: `## Agrégats : la règle de l’enveloppe

Certains objets n’ont de sens **qu’ensemble**, protégés par une racine qui fait respecter les règles. Cet ensemble forme un **agrégat**.

Stellar te donne un spécimen parfait : l’**enveloppe de transaction**. Les opérations vivent *à l’intérieur* d’une transaction — signées ensemble, séquencées ensemble, et elles **réussissent ou échouent ensemble**. Tu ne peux pas extraire l’opération #3 et l’appliquer seule ; l’enveloppe est la seule porte, et elle contient les signatures et le numéro de séquence.

C’est le modèle d’agrégat en production : la cohérence est imposée *à la frontière*, rien à l’intérieur ne peut jamais être partiellement appliqué.`,
    },
    {
      kind: "quiz",
      question: `Une transaction Stellar signée contient cinq opérations, et la troisième est la seule que tu veux. Cette opération peut-elle être appliquée au grand livre seule ?`,
      options: [
        "Non — les opérations ne s’appliquent que via leur enveloppe, et toute la transaction réussit ou échoue en bloc",
        "Oui — chaque opération porte sa propre signature, donc chacune peut se tenir seule",
        "Oui — à condition de payer des frais séparés pour cette seule opération",
      ],
      answer: 0,
      explain: `L’enveloppe est la racine d’agrégat : signatures et numéro de séquence se lient à la transaction, jamais par opération. C’est exactement ce qui rend les swaps multi‑opérations atomiques sûrs — il n’existe pas de monde où seule la moitié d’une opération arrive.`,
    },
    {
      kind: "fill",
      prompt: `Complète la loi de l’agrégat :`,
      file: "NOTES.md",
      before: `Ops dans une enveloppe réussissent ou échouent `,
      after: ` — la transaction est l’unité de cohérence.`,
      choices: [
        "ensemble",
        "indépendamment",
        "dans l’ordre des frais",
        "par poids de signature",
      ],
      answer: 0,
      explain: `L’atomicité est la promesse globale de l’agrégat. L’ordre des frais et le poids de signature sont des concepts réels de Stellar — mais ils décident *si et quand* une enveloppe s’applique, jamais *quelles parties* de celle‑ci.`,
    },
    {
      kind: "theory",
      body: `## Ponts entre contextes : l’ancre

Les contextes doivent encore communiquer. **La cartographie de contexte** consiste à nommer les frontières et à construire des ponts délibérés — traduction à la limite, pour que la langue d’une partie ne fuit pas dans l’autre.

Les **ancres** Stellar incarnent ce modèle dans un véritable métier. D’un côté se trouve le *contexte bancaire* — IBAN, jours ouvrés, conformité. De l’autre, le *contexte du registre* — lignes de confiance, actifs, finalité en cinq secondes. L’ancre assure la **traduction** : un virement entrant devient une émission de jetons ; le rachat d'un jeton devient un paiement bancaire.

Aucun des deux mondes n’a dû adopter le modèle de l’autre. C’est une frontière saine : traversée par traduction, jamais par fuite.`,
    },
    {
      kind: "theory",
      body: `## Pourquoi le golem a besoin de ta carte

Un LLM a lu un million de bases de code où « account », « transfer » et « balance » désignaient des choses différentes. Si tu ne déclares pas tes frontières, il **mélangera les vocabulaires au milieu d'un fichier** : une règle KYC dérivera dans ton modèle de paiements et la notion d'Account d'une plateforme d'échange se superposera à celle de ton portefeuille — chaque ligne paraissant pourtant plausible isolément.

Inscris donc clairement la frontière sur l'établi : *« Nous sommes dans le contexte Payments. Account désigne un détenteur de solde. Compliance possède un modèle distinct ; référence-le uniquement par son adresse. »* Un contexte explicite forme une clôture que le golem peut respecter.

Prochaine discipline : dans un même contexte, où chaque pièce doit-elle *vivre* ? Entre dans le bastion.`,
    },
  ],
} satisfies JourneyConceptText;
