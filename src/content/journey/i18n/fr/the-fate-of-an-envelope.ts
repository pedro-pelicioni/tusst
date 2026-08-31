import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Le Destin d'une Enveloppe",
  tagline: "Soumise, incluse, échouée, facturée — quatre choses différentes.",
  steps: [
    {
      kind: "theory",
      body: `## Le compteur qui empêche les rejeux

Chaque compte porte un numéro de séquence. Une transaction doit déclarer \`actuel + 1\`, et le registre l'incrémente à l'inclusion — ainsi une transaction signée ne peut **jamais être rejouée** (son numéro est dépensé), et deux transactions du même compte **ne peuvent pas se disputer** la même place.

Ce dernier point a un tranchant pratique. Si votre backend signe deux transactions du même compte au même instant, les deux réclament \`actuel + 1\` — et exactement une l'emporte. L'autre revient avec \`tx_bad_seq\`, ce qui ne signifie *pas* « mal formée » ; cela signifie *quelqu'un a fait avancer votre compteur avant vous — reconstruisez et resignez*.

Le remède habituel n'est pas une boucle de réessais. C'est un **compte canal** : un compte distinct qui fournit les numéros de séquence, pour que les travaux parallèles ne se battent jamais pour un compteur unique.`,
    },
    {
      kind: "quiz",
      question: `Deux serveurs signent un paiement depuis le même compte dans la même seconde. Les deux sont soumis. Que se passe-t-il ?`,
      options: [
        "L'une est incluse ; l'autre est rejetée avec tx_bad_seq et doit être reconstruite",
        "Les deux sont incluses — le registre les ordonne automatiquement",
        "Les deux sont rejetées, car le compte est verrouillé tant qu'une transaction est en attente",
      ],
      answer: 0,
      explain: `Le compteur est l'arbitre. Rien n'est « verrouillé » et rien n'est mis en file pour vous — la seconde enveloppe nomme un numéro de séquence qui n'est plus le suivant, et on la refuse. Reconstruire est le remède ; un compte canal est le vaccin.`,
    },
    {
      kind: "fill",
      prompt: `Remettez le cycle de vie dans l'ordre — que se passe-t-il entre la construction et la soumission ?`,
      file: "lifecycle.txt",
      before: `construire l'enveloppe  →  `,
      after: `  →  soumettre  →  clôture du registre`,
      choices: ["la signer", "la miner", "la notarier", "la staker"],
      answer: 0,
      explain: `Construire, **signer**, soumettre, clôturer — environ cinq secondes de bout en bout. Pas de minage, pas d'attente de confirmations multiples : une clôture de registre est déjà la finalité.`,
    },
    {
      kind: "diagram",
      body: "Les cinq secondes, étape par étape :",
      caption:
        "La signature a lieu sur votre machine, hors ligne. Votre clé secrète ne voyage jamais — seule l'enveloppe finie voyage.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "build",
            label: "construire",
            note: "Assemblez source, séquence, frais et opérations. Rien n'a quitté votre machine.",
            tone: "neutral",
          },
          {
            id: "sign",
            label: "signer",
            note: "Chaque signataire requis scelle l'enveloppe localement. Les clés secrètes ne bougent pas.",
            tone: "accent",
          },
          {
            id: "submit",
            label: "soumettre",
            note: "Envoyée à un point d'accès RPC ou Horizon, qui la transmet aux validateurs.",
            tone: "teal",
          },
          {
            id: "validate",
            label: "valider",
            note: "Signatures, séquence et frais sont vérifiés. Échouez ici et elle n'atteint jamais le registre.",
            tone: "gold",
          },
          {
            id: "close",
            label: "clôture du registre",
            note: "~5 secondes. Une clôture est la finalité — il n'y a pas de seconde confirmation à attendre.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## L'erreur que tout le monde commet une fois

« Ma transaction a échoué, donc rien ne s'est passé et ça ne m'a rien coûté. »

La moitié de cette phrase est généralement fausse, parce que **deux choses très différentes s'appellent toutes deux « échec »** :

- **Refusée à la porte.** Mauvaise signature, mauvaise séquence, frais trop bas. L'enveloppe n'entre jamais. Rien n'est débité, rien n'est enregistré, votre compteur ne bouge pas.
- **Échouée dans le registre.** L'enveloppe était valide, elle *a donc été* incluse — puis une opération n'a pas fonctionné. Ses **effets** sont tous annulés, mais la transaction est inscrite dans l'histoire comme un échec, **les frais sont consommés et le numéro de séquence est dépensé.**`,
    },
    {
      kind: "diagram",
      body: "Deux mots qui sonnent tous les deux comme un échec :",
      caption:
        "La différence tient à ce que l'enveloppe ait été valide ou non. Valide mais condamnée vous coûte quand même.",
      view: {
        kind: "compare",
        columns: [
          { id: "rejected", label: "refusée à la porte", tone: "neutral" },
          { id: "failed", label: "échouée dans le registre", tone: "bad" },
        ],
        rows: [
          {
            label: "code typique",
            cells: [
              { text: "tx_bad_seq, tx_bad_auth", tone: "neutral" },
              { text: "op_underfunded, op_no_trust", tone: "bad" },
            ],
          },
          {
            label: "inscrite dans l'histoire",
            cells: [
              { text: "non", tone: "good" },
              { text: "oui, marquée comme échec", tone: "bad" },
            ],
          },
          {
            label: "frais débités",
            cells: [
              { text: "non", tone: "good" },
              { text: "oui", tone: "bad" },
            ],
          },
          {
            label: "numéro de séquence",
            cells: [
              { text: "intact", tone: "good" },
              { text: "dépensé — reconstruction requise", tone: "bad" },
            ],
          },
        ],
      },
    },
    {
      kind: "fill",
      prompt: `Complétez la règle qui piège presque tout le monde une fois :`,
      file: "NOTES.md",
      before: `Une transaction assez valide pour être incluse, mais dont l'opération a échoué, est inscrite au registre comme un échec — et ses frais `,
      after: ` .`,
      choices: [
        "sont débités quand même",
        "sont remboursés automatiquement",
        "ne sont jamais débités",
        "ne sont débités qu'au réessai",
      ],
      answer: 0,
      explain: `Ce qui coûte, c'est d'être incluse, pas de réussir. La conséquence pratique : une boucle de réessais qui traite toutes les erreurs de la même façon resoumettra allègrement une enveloppe qui a déjà brûlé son numéro de séquence. Lisez le code avant de réessayer.`,
    },
    {
      kind: "theory",
      body: `## Les frais : un limiteur de débit, pas une source de revenus

Les frais de base sont de **100 stroops par opération** — 0,00001 XLM, un arrondi pour un humain, de l'argent bien réel pour un million d'enveloppes-poubelle. Cette asymétrie *est* la conception.

- **Vous proposez un maximum, vous payez le minimum.** Les frais que vous fixez sont un plafond. Quand le registre a de la place, on vous débite les frais de base quelle qu'ait été votre enchère ; ce n'est que lorsque la demande dépasse la capacité que la tarification de pointe remplit le registre par enchère.
- **Quelqu'un d'autre peut payer.** Une **transaction fee-bump** enveloppe une enveloppe déjà signée et met un autre compte sur la facture, sans invalider une seule signature existante. C'est ainsi qu'une application parraine un utilisateur qui ne détient pas le moindre XLM.`,
    },
    {
      kind: "quiz",
      question: `Pourquoi le réseau prélève-t-il des frais (100 stroops = 0,00001 XLM) par opération ?`,
      options: [
        "Pour rendre le spam coûteux à grande échelle tout en restant invisible pour les humains",
        "Pour verser un salaire aux validateurs — c'est leur modèle économique",
        "Pour subventionner le Friendbot",
      ],
      answer: 0,
      explain: `Les frais sur Stellar sont un limiteur de débit, pas une source de revenus — les validateurs ne reçoivent ni récompense de bloc ni revenu de frais. Personne ne fait tourner un validateur pour les revenus, ce qui explique que les frais puissent rester aussi minuscules.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `Dans l'Acte VII de la Campagne, la même enveloppe porte \`invoke_host_function\` — et la charge utile de l'opération, c'est **votre propre Rust**. Tout ce qui précède s'y applique encore : même compteur, même cycle de vie, même distinction entre refusée et échouée.`,
    },
  ],
  testOut: [
    { question: `Qu'est-ce que le numéro de séquence empêche ?`,
      options: ["Qu'une transaction signée soit rejouée, et que deux transactions se disputent la même place","Que les frais soient débités deux fois lors d'un réessai","Qu'un compte détienne plus d'un actif à la fois"], answer: 0 },
    { question: `Votre transaction revient rejetée avec tx_bad_seq. Qu'est-ce que cela vous a coûté ?`,
      options: ["Rien — elle n'est jamais entrée dans le registre, donc ni frais ni compteur n'ont bougé","Les frais, car le réseau a quand même dû la vérifier","Les frais et le numéro de séquence, comme pour tout autre échec"], answer: 0 },
    { question: `Une transaction est incluse, mais son paiement se révèle sans provision. Qu'est-ce qui a été dépensé ?`,
      options: ["Les frais et le numéro de séquence, alors même que rien n'a bougé","Rien — des effets annulés signifient une transaction annulée","Seulement le numéro de séquence ; les frais sont remboursés en cas d'échec"], answer: 0 },
    { question: `Une application veut intégrer un utilisateur qui ne détient aucun XLM. Qu'est-ce qui rend cela possible ?`,
      options: ["Une transaction fee-bump, qui met un autre compte sur la facture sans toucher aux signatures existantes","Ramener les frais à zéro pour les nouveaux comptes","Le Friendbot, qui paie les frais sur mainnet pour les nouveaux utilisateurs"], answer: 0 },
  ],
};
