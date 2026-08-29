import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Comptes, confiance et actifs",
  tagline: "Réserves, lignes de confiance et comment tout actif naît.",
  steps: [
    {
      kind: "theory",
      body: `## Un compte est une entrée de registre

Retire l'interface du portefeuille : un **compte Stellar** n'est plus qu'une entrée du registre répliqué — une clé publique, un solde XLM, quelques indicateurs et le **numéro de séquence** rencontré en décortiquant les enveloppes, qui empêche le rejeu des transactions.

Les lignes ne sont pas gratuites. Chaque validateur stocke chaque entrée, donc chaque entrée doit bloquer une **réserve de base** en XLM — actuellement 0,5 XLM, avec un nouveau compte qui doit détenir au moins deux (1 XLM) qu'il ne peut pas dépenser. Supprime les entrées et la réserve revient.

La réserve n'est pas des frais. C'est un **louer-avec-dépôt** : le registre reste léger parce que l'encombrement a un prix.`,
    },
    {
      kind: "theory",
      body: `## Lignes de confiance : les actifs sont opt-in

Sur de nombreuses chaînes, n'importe qui peut envoyer des jetons inutiles à ton adresse. Sur Stellar, ce n'est pas le cas : pour détenir un actif autre que XLM, ton compte doit d'abord ouvrir une **ligne de confiance** vers celui-ci.

Une ligne de confiance indique : *« J'accepte l'actif X de l'émetteur Y, jusqu'à cette **limite**. »* Elle est créée avec l'opération \`change_trust\`, elle est sa propre entrée de registre — elle bloque **une réserve de base** — et tant qu'elle n'existe pas, les paiements de cet actif vers toi échouent simplement.

Opt-in par conception : ton bilan ne contient que ce que tu as accepté de détenir.`,
    },
    {
      kind: "diagram",
      body: "Un actif émis, et qui a le droit d'y toucher :",
      caption: "Les lignes pointillées sont des trustlines — opt-in et réversibles. La ligne pleine n'existe que parce que ses deux extrémités ont accepté.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "issuer",
            label: "EMETTEUR",
            x: 50,
            y: 12,
            tone: "gold",
            shape: "box",
            note: "Fait exister l'actif simplement en le payant. Il n'y a ni mint ni table d'offre.",
          },
          {
            id: "ana",
            label: "ANA",
            x: 16,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "A ouvert une trustline — cet opt-in est ce qui lui permet de détenir l'actif.",
          },
          {
            id: "bruno",
            label: "BRUNO",
            x: 50,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "A aussi accepté, donc Ana peut le payer. Les deux extrémités ont besoin d'une trustline.",
          },
          {
            id: "caio",
            label: "CAIO",
            x: 84,
            y: 45,
            tone: "neutral",
            shape: "box",
            note: "N'en a jamais ouvert. Personne ne peut lui envoyer cet actif, quoi qu'il tente.",
          },
        ],
        edges: [
          {
            from: "issuer",
            to: "ana",
            label: "trustline",
            style: "dashed",
          },
          {
            from: "issuer",
            to: "bruno",
            style: "dashed",
          },
          {
            from: "ana",
            to: "bruno",
            label: "paiement",
            style: "solid",
          },
        ],
      },
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Tu as déjà fait ça de tes propres mains : le laboratoire **Ton premier portefeuille** de Forge soumet \`change_trust\` avec ta signature sur le testnet en direct — le moment où un nouvel actif apparaît dans ton solde est la naissance d'une ligne de confiance. Si tu as sauté ce laboratoire, c'est le chapitre idéal pour en ouvrir une en vrai.`,
    },
    {
      kind: "theory",
      body: `## Émettre un actif : il suffit de le payer

Il n'y a pas de rituel « déployer un token » dans Stellar classique. Un **actif est une paire** : un code court plus l'**adresse de l'émetteur** — \`USDC\` du compte Circle et \`USDC\` d'un inconnu sont des actifs différents.

Pour émettre, l'émetteur paie simplement l'actif depuis son propre compte à quelqu'un qui possède une ligne de confiance. Ce premier paiement *est* la frappe. L'offre est ce que l'émetteur a payé et n'a pas récupéré — le registre le suit automatiquement à travers les lignes de confiance.

Tout compte peut émettre. La rareté de la confiance, pas la permission, est ce qui donne de la valeur à un actif.`,
    },
    {
      kind: "quiz",
      question: `Qu'est-ce qu'il faut pour créer un nouvel actif sur Stellar classique ?`,
      options: [
        "L'émetteur le paie à un compte qui a ouvert une ligne de confiance — le premier paiement est la frappe",
        "Déployer et vérifier un contrat de token, puis enregistrer le ticker auprès de la SDF",
        "Mettre en jeu XLM proportionnel à l'offre prévue",
      ],
      answer: 0,
      explain: `Un actif est identifié par code + émetteur, donc il « existe » dès qu'il bouge pour la première fois. Les contrats n'entrent dans l'histoire que lorsque tu veux un comportement programmable — ou le pont SAC qui attend à la fin de ce chapitre.`,
    },
    {
      kind: "theory",
      body: `## Deux comptes, un actif : hygiène de l'émetteur

Les émetteurs sérieux répartissent les rôles :

- Le **compte d'émission** signe presque rien. Il frappe en payant le compte de distribution, puis retourne dormir — clés froides, surface d'attaque minimale.
- Le **compte de distribution** détient l'offre active et gère le trafic quotidien : clients, échanges, chemins chauds.

Si les clés de distribution fuitent, tu perds un solde — pas la presse à imprimer. Un émetteur peut aller encore plus loin : bloquer les signataires du compte d'émission afin que *personne* ne puisse jamais émettre à nouveau, fixant l'offre maximale pour toujours. Le registre lui-même devient l'audit.`,
    },
    {
      kind: "theory",
      body: `## Drapeaux d'autorisation : l'émetteur comme gardien

Les actifs du monde réel portent la loi du monde réel, donc un émetteur peut définir des drapeaux sur lui-même :

- **Auth required** — les lignes de confiance commencent non autorisées ; l'émetteur approuve chaque détenteur (portes KYC).
- **Auth revocable** — l'émetteur peut geler une ligne de confiance autorisée, arrêtant ce solde à froid.
- **Clawback** — l'émetteur peut récupérer l'actif entièrement (ordonnances judiciaires, fonds volés, paiements mal tapés).

Ces drapeaux expliquent pourquoi les institutions réglementées peuvent émettre sur un registre public : la conformité est imposée *par le protocole*, pas par une promesse dans un PDF.`,
    },
    {
      kind: "quiz",
      question: `Un émetteur réglementé apprend qu'un compte d'un détenteur a été piraté. Quel drapeau lui permet d'arrêter ce solde de bouger — maintenant ?`,
      options: [
        "Auth revocable — révoquer l'autorisation de la ligne de confiance et le solde est gelé sur place",
        "Auth required — il bloque rétroactivement les dépôts antérieurs du pirate",
        "Auth immutable — il verrouille tout l'actif pour tout le monde",
      ],
      answer: 0,
      explain: `Auth required ne bloque que les nouvelles lignes de confiance, et auth immutable ne promet simplement pas de changer les drapeaux. Geler arrête le mouvement ; **clawback** va un pas plus loin et récupère l'actif auprès de l'émetteur.`,
    },
    {
      kind: "fill",
      prompt: `Complète l'identité d'un actif classique — qu'est-ce qui fait que USDC *est le vrai* USDC ?`,
      file: "asset-identity.txt",
      before: `asset  =  asset code  +  `,
      after: `   (même code, émetteur différent → actif différent)`,
      choices: [
        "l'adresse du compte de l'émetteur",
        "le hachage Wasm du contrat",
        "un registre de ticker global",
        "l’URL du site de l’ancre",
      ],
      answer: 0,
      explain: `Il n'y a pas d'espace de noms à occuper. Les portefeuilles résolvent quel \`USDC\` est réel via l'adresse de l'émetteur — et, comme tu le verras aux Portes du Royaume, cet émetteur le prouve avec un fichier sur son propre domaine.`,
    },
    {
      kind: "theory",
      body: `## Le Stellar Asset Contract

Les actifs classiques et les contrats intelligents partagent un même royaume, et le pont est le **Stellar Asset Contract (SAC)**. Tout actif classique — XLM inclus — peut être *invocée* comme un contrat : un déploiement, zéro code à écrire, et l'actif parle désormais **SEP-41**, l'interface de token Soroban standard.

Même actif, même offre, même bilan — mais maintenant les contrats peuvent le détenir, le déplacer et y construire. USDC dans un pool de prêt et USDC dans la ligne de confiance de la grand-mère sont le *même USDC*.

Tout protocole Soroban sérieux s'appuie sur ce pont quotidiennement.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `L'Acte VI de la Campagne — **La Porte de la Constellation** — parcourt ce même terrain depuis Rust : comptes, soldes et lignes de confiance interrogés et forgés dans le code plutôt que dans la prose. Prends l'itinéraire quand tu veux avoir tes doigts sur les entrées du registre elles-mêmes.

Prochaine étape : actifs en *mouvement* — paiements qui traversent des devises en vol, et un échange intégré au protocole lui-même.`,
    },
  ],
} satisfies JourneyConceptText;
