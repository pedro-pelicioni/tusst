import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Anatomie d’une transaction",
  tagline: "Enveloppe, opérations, frais, signatures — décortiqués en direct.",
  steps: [
    {
      kind: "theory",
      body: `## L'enveloppe

Tout ce qui change le grand livre Stellar voyage dans une seule forme — une **enveloppe de transaction** :

- **Compte source** — qui agit (et paie les frais).
- **Numéro de séquence** — le compteur de transactions de ce compte.
- **Frais** — ce que tu offres pour être inclus.
- **Opérations** — les verbes réels (de 1 à 100).
- **Signatures** — preuve que le compte source (et toute autre personne requise) a accepté.

Maîtrise cette structure et tu sauras lire chaque page d’explorateur, chaque appel de SDK et chaque erreur de transaction Stellar.`,
    },
    {
      kind: "diagram",
      body: "L'enveloppe, ouverte :",
      caption: "La signature couvre toute l'enveloppe. Changez un octet à l'intérieur et toutes les signatures cessent de correspondre.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "source",
            label: "compte source",
            note: "Qui paie les frais, et de qui le numéro de séquence avance.",
            tone: "neutral",
          },
          {
            id: "fee",
            label: "frais",
            note: "100 stroops par opération — un cent-millième de XLM chacun.",
            tone: "gold",
          },
          {
            id: "seq",
            label: "numéro de séquence",
            note: "Utilisé exactement une fois, pour toujours. C'est ce qui rend un rejeu impossible.",
            tone: "accent",
          },
          {
            id: "ops",
            label: "opérations",
            note: "Jusqu'à 100, appliquées dans l'ordre. Toutes passent, ou aucune.",
            tone: "teal",
            bands: [
              {
                id: "op1",
                label: "paiement",
                note: "Déplace un actif d'un compte vers un autre.",
                tone: "teal",
              },
              {
                id: "op2",
                label: "ouvrir une trustline",
                note: "Ouvre la ligne de confiance qui permet à la destination de le détenir.",
                tone: "teal",
              },
            ],
          },
          {
            id: "sigs",
            label: "signatures",
            note: "Une par signataire requis. N'importe qui les vérifie face à l'adresse source — personne ne les falsifie.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Opérations : les verbes

Une **opération** est un verbe atomique : \`payment\`, \`create_account\`, \`change_trust\`, \`manage_sell_offer\`, \`invoke_host_function\` (qui appelle les contrats intelligents)… il en existe environ 26.

Une seule enveloppe peut contenir **plusieurs opérations**, et elles se déroulent **atomiquement** : créer un compte *et* le financer *et* ouvrir sa ligne de confiance en un seul coup — ou rien ne se passe du tout.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Tu as rencontré ces verbes en vrai — ou tu es sur le point de le faire. Le laboratoire **Ton premier portefeuille** de la Forge exécute \`create_account\`, \`change_trust\` et \`payment\` avec ta propre signature sur le testnet réel. La théorie est plus claire avec tes propres hachages de transaction.`,
    },
    {
      kind: "quiz",
      question: `Ton enveloppe contient trois opérations : un paiement, une ligne de confiance et un second paiement qui s’avère sous-financé. Que se passe-t-il sur le grand livre ?`,
      options: [
        "Rien — une opération échouée fait échouer toute la transaction",
        "Les deux premières opérations — elle échoue à partir de la troisième",
        "Les trois — les échecs sont enregistrés comme avertissements",
      ],
      answer: 0,
      explain: `L’atomicité est la clé : une transaction est tout ou rien, c’est pourquoi les configurations multi-étapes (créer + financer + confiance) sont sûres à regrouper.`,
    },
    {
      kind: "theory",
      body: `## Numéros de séquence : ni rejeu ni concurrence

Chaque compte possède un compteur. Une transaction doit indiquer \`current + 1\`, et le grand livre l’incrémente à l’inclusion — donc :

- une transaction signée ne peut **jamais** être rejouée (son numéro est dépensé),
- deux transactions du même compte **ne peuvent pas** se concurrencer pour le même créneau.

Cette erreur \`tx_bad_seq\`, que tout développeur Stellar finit par rencontrer, signifie simplement que *quelqu'un d'autre a fait avancer ton compteur avant toi : reconstruis la transaction et signe-la de nouveau.*`,
    },
    {
      kind: "fill",
      prompt: `Place la chaîne de vie dans l’ordre — que se passe-t-il entre la construction et la soumission ?`,
      file: "lifecycle.txt",
      before: `construire l’enveloppe  →  `,
      after: `  →  soumettre  →  clôture du registre`,
      choices: ["la signer", "la miner", "la faire certifier", "la staker"],
      answer: 0,
      explain: `Construire, **signer**, soumettre, clôturer — environ cinq secondes de bout en bout. Ni minage ni attente de confirmations multiples : une seule clôture du registre apporte la finalité.`,
    },
    {
      kind: "quiz",
      question: `Pourquoi le réseau facture-t-il des frais (100 stroops = 0,00001 XLM) pour chaque opération ?`,
      options: [
        "Pour rendre le spam coûteux à grande échelle tout en restant invisible aux humains",
        "Pour payer les validateurs un salaire — c’est leur modèle économique",
        "Pour subventionner le Friendbot",
      ],
      answer: 0,
      explain: `Les frais sur Stellar sont un limiteur de débit, pas une source de revenus — les frais collectés sont recyclés par le protocole. Un million de transactions inutiles coûtent de l’argent réel ; ton paiement ne coûte qu’une erreur d’arrondi.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `Dans l’Acte VII de la Campagne, la même enveloppe transporte \`invoke_host_function\` — et la charge utile de l’opération est **ton propre Rust**. Quand tu es prêt à forger les verbes eux‑mêmes, la porte est ouverte.`,
    },
  ],
} satisfies JourneyConceptText;
