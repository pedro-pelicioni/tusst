import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Ce Que Garde la Frontière",
  tagline: "DDD tactique : identité, valeur, et l'ensemble qui doit bouger d'un seul tenant.",
  steps: [
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
    { kind: "diagram",
      body: "Deux sortes de chose, et la question qui les sépare :",
      caption: "Demandez « si je l'échange contre une copie identique, quelque chose a-t-il changé ? » — non signifie valeur, oui signifie entité.",
      view: { kind: "compare",
        columns: [{ id: "entity", label: "entité", tone: "accent" }, { id: "value", label: "objet-valeur", tone: "teal" }],
        rows: [
          { label: "spécimen Stellar", cells: [{ text: "un compte (G…)", tone: "accent" }, { text: "un actif (code + émetteur)", tone: "teal" }] },
          { label: "ce qui rend deux égaux", cells: [{ text: "la même identité", tone: "accent" }, { text: "les mêmes champs", tone: "teal" }] },
          { label: "survit à un changement d'état", cells: [{ text: "oui — les soldes bougent, le compte demeure", tone: "accent" }, { text: "non — changez l'émetteur et c'est un autre actif", tone: "teal" }] },
          { label: "vous devez donc", cells: [{ text: "le suivre", tone: "accent" }, { text: "le comparer", tone: "teal" }] },
        ] } },
    {
      kind: "theory",
      body: `## Agrégats : la règle de l’enveloppe

Certains objets n’ont de sens **qu’ensemble**, protégés par une racine qui fait respecter les règles. Cet ensemble forme un **agrégat**.

Stellar te donne un spécimen parfait : l’**enveloppe de transaction**. Les opérations vivent *à l’intérieur* d’une transaction — signées ensemble, séquencées ensemble, et elles **réussissent ou échouent ensemble**. Tu ne peux pas extraire l’opération #3 et l’appliquer seule ; l’enveloppe est la seule porte, et elle contient les signatures et le numéro de séquence.

C’est le modèle d’agrégat en production : la cohérence est imposée *à la frontière*, rien à l’intérieur ne peut jamais être partiellement appliqué.`,
    },
    { kind: "theory", body: `## L'agrégat qui a mangé le système

La façon classique de se tromper ici est de dessiner l'agrégat **trop grand**.

Cela commence raisonnablement : ces choses doivent rester cohérentes, donc sous une même racine. Puis celles-là aussi. Bientôt la racine est « le Registre », tout changement doit passer par elle, et deux opérations sans rapport ne peuvent plus avancer en même temps parce qu'elles se disputent la même garde. La cohérence a été payée par une file d'attente.

Stellar montre la retenue. L'enveloppe est un agrégat — mais **petit** : jusqu'à cent opérations, le numéro de séquence d'un compte, et rien d'autre. Elle ne garde pas le registre ; elle garde une soumission. Les enveloppes de tous les autres avancent dans les mêmes cinq secondes, intactes.

La règle : un agrégat doit être le plus petit ensemble qui doit être **correct ensemble**, pas le plus grand ensemble qui se trouve être **lié**.` },
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
    { kind: "rustBranch", lessonSlug: "soroban-smart-contracts-1",
      body: `Ces deux formes cessent d'être abstraites dès que vous les stockez. Dans l'Acte VII de la Campagne, une entité est ce que vous récupérez par **clé** dans le stockage du contrat, et un objet-valeur est un \`#[contracttype]\` que vous comparez avec \`==\`. Se tromper d'appariement, c'est ainsi que le même actif finit rangé sous deux clés.` },
    { kind: "theory", body: `## À l'intérieur de la frontière, où cela vit-il ?

Vous savez désormais dire, pour un contexte : ce qui a une identité, ce qui n'est que sa valeur, et quel ensemble doit bouger d'un seul tenant.

Ce que vous ne savez pas encore dire, c'est où chaque chose **se place**. L'agrégat connaît-il la base de données ? Le client du registre a-t-il le droit d'aller dans les règles du domaine ? Ces questions ont une réponse, et c'est toujours la même.

**Ensuite :** le donjon, et l'unique règle qui décide dans quel sens chaque dépendance a le droit de pointer.` },
  ],
  testOut: [
    { question: `Deux USDC du même émetteur. La question « lequel est l'original » a-t-elle un sens ?`,
      options: ["Non — un actif est un objet-valeur ; l'égalité est champ à champ et il n'a pas d'identité propre","Oui — chaque jeton porte un numéro de série qui les distingue","Seulement s'ils sont détenus par des comptes différents"], answer: 0 },
    { question: `Un compte paie mille fois. Est-ce le même compte ?`,
      options: ["Oui — une entité garde son identité pendant que son état change dessous","Non — son solde le définit, donc un solde changé est un autre compte","Seulement si le numéro de séquence n'a pas bouclé"], answer: 0 },
    { question: `Qu'est-ce qui fait de l'enveloppe de transaction un agrégat d'école ?`,
      options: ["C'est la seule porte : signatures et séquence se lient à l'enveloppe, et son contenu passe ou échoue ensemble","C'est le plus gros objet du protocole, il contient donc tout le reste","Elle peut être découpée en ses opérations quand une seule est nécessaire"], answer: 0 },
    { question: `Quelle est la façon classique de mal dessiner un agrégat ?`,
      options: ["Trop grand — la cohérence finit payée par une file, car des travaux sans rapport se disputent une racine","Trop petit — chaque règle exige alors une transaction entre plusieurs racines","Sans racine, donc rien ne garantit les invariants"], answer: 0 },
  ],
};
