import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Anatomie d'une Transaction",
  tagline: "L'enveloppe de transaction : une seule forme porte tout ce qui modifie le registre.",
  steps: [
    {
      kind: "theory",
      body: `## L'enveloppe

Tout ce qui modifie le registre Stellar voyage dans une seule et même forme — une **enveloppe de transaction** :

- **Compte source** — qui agit (et paie les frais).
- **Numéro de séquence** — le compteur de transactions de ce compte.
- **Frais** — ce que vous proposez pour être inclus.
- **Opérations** — les vrais verbes (de 1 à 100).
- **Signatures** — la preuve que la source (et quiconque d'autre est requis) a consenti.

Il n'existe pas de seconde forme. Un paiement, l'émission d'un jeton, l'appel d'un contrat intelligent, un échange sur le DEX — ce sont tous cette enveloppe avec des verbes différents dedans. Apprenez-la une fois et chaque page d'explorateur et chaque appel du SDK sur Stellar deviennent lisibles au même instant.`,
    },
    {
      kind: "diagram",
      body: "L'enveloppe, ouverte :",
      caption:
        "La signature couvre l'enveloppe entière. Changez un seul octet à l'intérieur et toutes les signatures cessent de correspondre.",
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
            note: "Utilisé exactement une fois, à jamais. C'est ce qui rend un rejeu impossible.",
            tone: "accent",
          },
          {
            id: "ops",
            label: "opérations",
            note: "Jusqu'à 100, appliquées dans l'ordre. Toutes passent, ou aucune ne passe.",
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
                note: "Ouvre la ligne de confiance qui permet à la destination de détenir l'actif.",
                tone: "teal",
              },
            ],
          },
          {
            id: "sigs",
            label: "signatures",
            note: "Une par signataire requis. N'importe qui les vérifie contre l'adresse source — personne ne les falsifie.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Les opérations : les verbes

Une **opération** est un verbe atomique. Il y en a environ 26, en quelques familles :

- **Déplacer de la valeur** — \`payment\`, \`path_payment_strict_send\`, \`create_account\`.
- **Détenir de la valeur** — \`change_trust\`, \`set_trust_line_flags\`, \`clawback\`.
- **Échanger** — \`manage_sell_offer\`, \`liquidity_pool_deposit\`.
- **Gouverner le compte** — \`set_options\`, \`manage_data\`, \`account_merge\`.
- **Appeler du code** — \`invoke_host_function\`, celle qui atteint un contrat intelligent.

Un détail échappe à presque tout le monde pendant des mois : **chaque opération peut nommer son propre compte source**, différent de celui de l'enveloppe. Ce seul champ est ce qui rend la page suivante possible.`,
    },
    {
      kind: "quiz",
      question: `Votre enveloppe porte trois opérations : un paiement, une ligne de confiance, et un second paiement qui se révèle sans provision. Qu'est-ce qui atterrit sur le registre ?`,
      options: [
        "Rien — une opération échouée fait échouer toute la transaction",
        "Les deux premières opérations — l'échec commence à la troisième",
        "Les trois — les échecs sont enregistrés comme des avertissements",
      ],
      answer: 0,
      explain: `L'atomicité est le principe : une transaction est tout ou rien, c'est pourquoi les mises en place en plusieurs étapes (créer + approvisionner + faire confiance) peuvent être groupées sans risque.`,
    },
    {
      kind: "theory",
      body: `## Une enveloppe, trois verbes, deux signataires

Ana veut faire entrer Bruno sur Stellar et lui remettre 50 USDC. Regardez comme tout tient dans une seule enveloppe :

- **Source :** Ana. Son numéro de séquence avance ; c'est elle qui paie les frais.
- **Op 1 —** \`create_account\`, destination Bruno, solde initial de **2 XLM**.
- **Op 2 —** \`change_trust\` pour USDC, **source : Bruno**. Une trustline appartient à qui la détient, donc cette opération est celle de Bruno, pas celle d'Ana.
- **Op 3 —** \`payment\`, 50 USDC à Bruno.

**Frais :** 3 opérations × 100 stroops = **300 stroops**, soit 0,00003 XLM.

Et les 2 XLM de Bruno ? Un compte coûte 2 réserves de base, une trustline en coûte 1 de plus, à 0,5 XLM chacune : **1,5 XLM immobilisés**, 0,5 XLM libres. Les réserves ne sont pas des frais — elles lui reviennent s'il ferme un jour la trustline.`,
    },
    {
      kind: "quiz",
      question: `Dans cette enveloppe, pourquoi Bruno doit-il signer, alors qu'il ne fait que recevoir ?`,
      options: [
        "Parce que l'op 2 ouvre *sa* trustline, et qu'une opération est autorisée par son propre compte source",
        "Parce que tout compte nommé quelque part dans une transaction doit la signer",
        "Parce que le paiement dépasse son solde initial",
      ],
      answer: 0,
      explain: `Recevoir n'exige jamais votre signature — mais ouvrir la trustline qui vous permet de recevoir, si. Envoyez cette enveloppe sans la signature de Bruno et le réseau répond \`tx_bad_auth\` : absolument rien ne se produit, pas même l'op 1.`,
    },
    {
      kind: "fill",
      prompt: `Complétez la règle qui rend le groupage sûr :`,
      file: "NOTES.md",
      before: `Une enveloppe, jusqu'à 100 opérations, appliquées dans l'ordre — et si l'une d'elles échoue, `,
      after: ` .`,
      choices: [
        "aucune ne prend effet",
        "les autres prennent quand même effet",
        "celle qui a échoué est ignorée",
        "le réseau la réessaie automatiquement",
      ],
      answer: 0,
      explain: `Tout ou rien. C'est pourquoi « créer le compte *et* ouvrir sa trustline *et* l'approvisionner » est une seule enveloppe et non trois étapes pleines d'espoir — il n'existe aucun état où Bruno existe mais ne peut pas détenir ce que vous lui avez envoyé.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Cette enveloppe n'a rien d'hypothétique. Le laboratoire **Votre Premier Portefeuille** de la Forge exécute \`create_account\`, \`change_trust\` et \`payment\` avec votre propre signature sur le vrai testnet — les trois mêmes verbes, avec le hash de votre transaction à la fin.`,
    },
    {
      kind: "theory",
      body: `## Ce que vous savez déjà lire

Source, séquence, frais, opérations, signatures. Vous pouvez regarder n'importe quelle transaction sur n'importe quel explorateur Stellar et en nommer chaque partie, et vous savez pourquoi une mise en place en plusieurs étapes peut être groupée sans risque.

**Ensuite :** vous savez construire une enveloppe valide — mais ce qui lui arrive après l'envoi est une histoire à part entière. Pourquoi une transaction est refusée à la porte tandis qu'une autre est inscrite dans l'histoire comme un échec *et facturée pour l'occasion*, c'est le prochain chapitre.`,
    },
  ],
  testOut: [
    { question: `Combien de formes différentes peuvent porter une modification du registre Stellar ?`,
      options: ["Une — un paiement, un échange et un appel de contrat sont la même enveloppe avec des verbes différents","Trois — une pour les paiements, une pour les échanges, une pour les contrats","Une par type d'opération, environ 26"], answer: 0 },
    { question: `Une opération dans votre enveloppe nomme un compte source différent de celui de l'enveloppe. Qu'est-ce qui en découle ?`,
      options: ["Ce compte doit lui aussi signer l'enveloppe","L'opération est appliquée au nom de la source de l'enveloppe malgré tout","L'enveloppe est rejetée — les opérations doivent partager la source de l'enveloppe"], answer: 0 },
    { question: `Une enveloppe porte quatre opérations et la troisième échoue. Qu'est-ce qui atterrit sur le registre ?`,
      options: ["Aucune des quatre ne prend effet","Les deux premières — l'enveloppe s'arrête là où elle a cassé","Les quatre, la troisième étant marquée comme un avertissement"], answer: 0 },
    { question: `Les frais varient en fonction de quoi ?`,
      options: ["Du nombre d'opérations dans l'enveloppe","Du montant de valeur déplacé","Du temps que l'enveloppe a passé à attendre son inclusion"], answer: 0 },
  ],
};
