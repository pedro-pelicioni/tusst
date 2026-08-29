import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Frontières du royaume",
  tagline: "DDD & context limités, cartographiés sur Stellar lui‑même.",
  steps: [
    {
      kind: "theory",
      body: `## Un mot, trois sens

Demande à trois équipes de Stellar ce qu’est un **Account** :

- L’équipe *wallet* : "un détenteur de solde — quelqu’un qui possède des lumens et des actifs."
- L’équipe *anchor* : "un sujet KYC — quelqu’un qu’on doit identifier avant de déplacer de l’argent."
- L’équipe *exchange* : "un participant au carnet d’ordres — quelqu’un avec des offres ouvertes."

Même mot. Même G‑adresse, même. **Trois modèles différents.** La plupart des bugs de « mauvaise communication » sont exactement ça : deux personnes utilisent un mot pour deux concepts, chacune convaincue que l’autre est d’accord.

Le Design Orienté Domaine commence ici : rend la langue précise *à dessein*.`,
    },
    {
      kind: "theory",
      body: `## Langage omniprésent, contextes limités

Au sein d’une équipe et d’une partie du système, le DDD exige un **langage omniprésent** : un mot, une seule signification, utilisé *partout* — conversation, spécification et code. Si la spécification dit « release », la fonction est \`release\`, pas \`transfer_out\`.

Mais aucune langue ne règle tout le royaume. Un **contexte limité** est la frontière où la signification d’un mot est autorisée à changer : dans *Payments*, un Account est un détenteur de solde ; en traversant vers *Compliance*, la même adresse devient un sujet KYC.

La frontière n’est pas un échec de conception. **La frontière est la conception.**`,
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
      explain: `Un modèle partagé agrandit les champs et règles de chaque contexte jusqu’à ce que aucun contexte ne puisse évoluer sans casser un autre. Deux modèles légers qui partagent un ID ne sont pas une duplication — ce sont deux vérités sur une même adresse, chacune possédée là où elle est comprise.`,
    },
    {
      kind: "theory",
      body: `## Entités et objets de valeur

Deux sortes de choses vivent dans tout contexte :

- Une **entité** possède une identité qui survit au changement. Un **Account** Stellar est le même compte après mille paiements — son adresse est son identité ; ses soldes ne sont que l’état.
- Un **objet de valeur** *est* sa valeur. Un **Asset** Stellar est un code plus un émetteur : deux \`USDC\` du même émetteur sont interchangeables — indistinguables, en fait. Change l’émetteur et tu n’as pas modifié l’actif ; tu détiens un *différent* actif.

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

Certains objets n’ont de sens **qu’ensemble**, protégés par une racine qui applique les règles. Ce cluster est un **agrégat**.

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
      choices: ["ensemble", "indépendamment", "dans l’ordre des frais", "par poids de signature"],
      answer: 0,
      explain: `L’atomicité est la promesse globale de l’agrégat. L’ordre des frais et le poids de signature sont des concepts réels de Stellar — mais ils décident *si et quand* une enveloppe s’applique, jamais *quelles parties* de celle‑ci.`,
    },
    {
      kind: "theory",
      body: `## Ponts entre contextes : l’ancre

Les contextes doivent encore communiquer. **La cartographie de contexte** consiste à nommer les frontières et à construire des ponts délibérés — traduction à la limite, pour que la langue d’une partie ne fuit pas dans l’autre.

Les **ancres** Stellar sont ce modèle avec un modèle métier. D’un côté : le *contexte bancaire* — IBANs, jours ouvrés, conformité. De l’autre : le *contexte grand‑livre* — trustlines, actifs, finalité de 5 s. L’ancre **traduire** : un virement entrant devient des jetons émis ; un jeton racheté devient un paiement bancaire.

Aucun des deux mondes n’a dû adopter le modèle de l’autre. C’est une frontière saine : traversée par traduction, jamais par fuite.`,
    },
    {
      kind: "theory",
      body: `## Pourquoi le golem a besoin de ta carte

Un LLM a lu un million de bases de code où « account », « transfer » et « balance » signifiaient tous choses différentes. Laisse tes frontières non déclarées et il **mélangera les vocabulaires à mi‑fichier** — une règle KYC dérivant dans ton modèle de paiements, l’idée d’Account d’une bourse se superposant à celle de ton portefeuille — chaque ligne localement plausible.

Alors, écris la frontière sur le banc : *« Nous sommes dans le contexte Payments. Account signifie détenteur de solde. Compliance est un modèle séparé — référence‑le par adresse uniquement. »* Un contexte déclaré est une clôture que le golem respecte.

La prochaine discipline : dans un même contexte, où chaque pièce *vit* ? Entrez le garde.`,
    },
  ],
} satisfies JourneyConceptText;
