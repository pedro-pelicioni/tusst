import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Le Grand Livre Masqué",
  tagline: "Jetons confidentiels, paiements privés — la confidentialité avec une colonne vertébrale de conformité.",
  steps: [
    {
      kind: "theory",
      body: `## La transparence est une fonction — jusqu’à ce qu’elle fuit

Tout ce que tu as construit jusqu’ici est radicalement public : chaque solde, chaque paiement, chaque contrepartie, pour toujours.

Pour la finance, c’est souvent le point de vente — réserves auditable, rails vérifiables. Mais contre un vrai business, ça coupe dans l’autre sens :

- Paye les salaires en chaîne et **chaque employé peut lire chaque autre salaire**.
- Paye un fournisseur et tes **concurrents lisent tes prix et volumes**.
- Déplace le trésor et le marché anticipe ton intention.

Les grosses sommes ont besoin d’un *silence sélectif*. La question est comment un grand livre public peut garder des secrets sans en devenir un.`,
    },
    {
      kind: "theory",
      body: `## Preuve sans divulgation

La réponse vient du cadeau le plus étrange de la cryptographie : la **preuve à connaissance nulle**.

Une preuve ZK convainc un vérificateur qu’une déclaration est vraie — *« cette somme cachée est positive, et mon solde caché la couvre »* — tout en révélant **rien d’autre** : ni le montant, ni le solde.

La preuve est un petit blob de maths que tout le monde peut vérifier à moindre coût, et la vérification ne nécessite aucune confiance envers le vérificateur. Si elle passe, la déclaration tient. Point final.

Place un tel vérificateur dans les règles du grand livre, et la chaîne peut imposer l’honnêteté sur les chiffres qu’elle n’est jamais autorisée à voir.`,
    },
    {
      kind: "theory",
      body: `## Le royaume forge les outils

La vérification en chaîne nécessite des maths lourdes spécifiques comme **fonctions hôtes** — et Stellar l’a livré en couches :

- **CAP‑59** a introduit les opérations de courbe **BLS12‑381**, permettant la vérification de preuves **Groth16** dans les contrats Soroban.
- **Protocoles 25 et 26** ont ajouté la courbe **BN254** et le hachage **Poseidon** — un hachage conçu pour être bon marché *à l’intérieur* des circuits ZK.

Cette deuxième vague a fait pencher la balance : elle a rendu les **systèmes de paiement privé pratiques** sur Stellar. Les primitives sont de niveau protocole, donc tout contrat vérifie les preuves à vitesse native — pas de pénalité de coût mille fois plus élevé pour faire de la cryptographie honnêtement.`,
    },
    {
      kind: "quiz",
      question: `Que apprend un vérificateur ZK en chaîne lorsqu’il accepte une preuve ?`,
      options: [
        "Seulement que la déclaration prouvée est vraie — les valeurs cachées restent cachées",
        "Les valeurs sous-jacentes, qu’il vérifie puis jette",
        "Rien du tout — l’acceptation est un marketing probabiliste",
      ],
      answer: 0,
      explain: `Cette asymétrie est toute la subtilité : la validité devient publique tandis que les données restent privées. Le grand livre peut imposer « personne ne dépense ce qu’il n’a pas » sans jamais lire un solde.`,
    },
    {
      kind: "theory",
      body: `## Jetons confidentiels : masquer les montants

**Jetons confidentiels** ont atteint la prévisualisation développeur en **juin 2026**, créés par **OpenZeppelin et Nethermind**. Le design est élégamment discret :

- Un **contrat enveloppe** sur n’importe quel jeton **SEP‑41** — USDC via son contrat d’actif Stellar, jetons natifs de contrat, tout ce qui parle le standard.
- Enveloppe tes jetons et ton **solde et les montants de transfert deviennent cachés**, protégés par des preuves à connaissance nulle.
- **Les adresses restent publiques** : l’explorateur voit encore *qui* a transigé avec qui — juste pas *combien*.

Conçu pour les parties qui se connaissent mais doivent garder les chiffres privés : paie, factures fournisseurs, règlement B2B.`,
    },
    {
      kind: "theory",
      body: `## Paiements privés Stellar : masquer les contreparties

Un voile de plus. **Paiements privés Stellar (SPP)**, créés par **Nethermind**, ont atteint la prévisualisation développeur sur testnet en **août 2026**.

Au lieu d’envelopper un jeton, les utilisateurs **déposent des actifs dans un pool partagé**. Les transferts se font ensuite *à l’intérieur* du pool — et un observateur extérieur ne peut plus relier l’expéditeur au récepteur. Pas seulement les montants : les **contreparties elles‑mêmes sont cachées**.

Où les jetons confidentiels conviennent aux parties qui se connaissent, SPP couvre les cas où *qui a payé qui* est lui‑même le secret — dons, relations fournisseurs sensibles, finances personnelles sur rails publics.`,
    },
    {
      kind: "theory",
      body: `## La colonne vertébrale de conformité

« Privé » sans limites est la cauchemar d’un officier des sanctions, et ces conceptions refusent d’y aller. SPP combine confidentialité avec **garanties de conformité intégrées** :

- **Participation conditionnée KYC** — rejoindre le pool nécessite une identité vérifiée.
- **Contrôles d’accès au niveau identité** — les permissions s’attache à *qui tu es*, pas seulement à quelle clé tu possèdes.
- **Capacité de gel au niveau compte** — les mauvais acteurs peuvent être arrêtés même à l’intérieur du voile.

L’objectif en une ligne : **confidentialité pour les utilisateurs, pas pour le crime**. Transferts confidentiels *et* conformes sur rails publics — cette combinaison, pas la simple secret, est ce que les institutions attendaient.`,
    },
    {
      kind: "quiz",
      question: `Un explorateur regarde un transfert de Jeton confidentiel et un transfert de pool SPP. Que voit‑il dans chacun ?`,
      options: [
        "CT : les deux adresses mais pas le montant ; SPP : pas même les contreparties — valeur déplacée dans le pool partagé",
        "Les deux cachent montants et adresses de façon identique — SPP est juste le plus économique",
        "CT cache les adresses mais montre les montants ; SPP montre tout aux spectateurs KYC",
      ],
      answer: 0,
      explain: `Deux couches, deux voiles. Les jetons confidentiels cachent *combien* entre parties connues ; le pool partagé de SPP cache aussi *qui*. Choisis la couche qui correspond à ce que ton cas d’usage doit garder secret.`,
    },
    {
      kind: "fill",
      prompt: `Qu’est‑ce qu’un Jeton confidentiel peut envelopper ?`,
      file: "veil.txt",
      before: `jeton confidentiel  =  enveloppe ZK sur n’importe quel  `,
      after: `  jeton — montants cachés, adresses publiques`,
      choices: ["SEP‑41", "SEP‑24", "SEP‑10", "SEP‑1"],
      answer: 0,
      explain: `Le standard d’interface de jeton est l’ancrage : tout ce qui parle SEP‑41 peut être enveloppé — y compris les actifs classiques comme USDC via leur contrat d’actif Stellar. La couche de confidentialité se compose avec tout ce que tu connais déjà.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `Sur l’enclume de la Forge : un laboratoire **Jetons confidentiels**, où tu envelopperas un jeton testnet et verras les montants disparaître de l’explorateur tandis que les transferts continuent de se régler correctement. Sa carte indique *en cours de forge* — cette frontière est en train d’être martelée pendant que tu lis.

Remarque à quel point ces dates sont jeunes. Naviguer dans une technologie aussi fraîche signifie lire le pouls du protocole lui‑même — le dernier chapitre te montre comment.`,
    },
  ],
} satisfies JourneyConceptText;
