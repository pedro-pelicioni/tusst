import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "OpenZeppelin Token Wizard",
    tagline: "Choisis des extensions, génère du vrai Rust et déploie ton propre token.",
  },
  steps: {
    "intro": {
      body: `## Ne forge pas seul

Les vrais forgerons ne fondent pas leur propre fer pour chaque lame. Sur Stellar, les contrats de token sont forgés à partir des **blocs audités d'OpenZeppelin** — les mêmes bibliothèques éprouvées qui sécurisent des milliards à travers les chaînes, portées à Soroban sous \`stellar-tokens\`.

Dans les prochaines minutes, tu **choisiras tes extensions**, regarderas la Forge assembler du **vrai Rust** à partir d'elles, **le compileras** dans un runner isolé, **déploieras le Wasm** sur le testnet sous ta propre signature, et **émettras** ton offre initiale.

Pas de maquettes. C’est le même pipeline que celui de l’IDE en mode libre.`,
    },
    "sigil": {
      title: "Invoque ton sigil",
      body: `Déployer coûte une signature, et une signature a besoin de ta paire de clés. Si tu en as forgé une dans le lab de wallet, la Forge la réutilise ; sinon, une nouvelle est frappée maintenant.`,
      cta: "Préparer la paire de clés",
      successBody: `Ton sigil répond :

\`{address}\`

Chaque transaction à venir — le déploiement et l’émission — portera cette signature.`,
    },
    "fund": {
      title: "Alimente le compte",
      body: `Les déploiements et invocations paient de petits frais de ressources, donc le compte doit être vivant et financé. Friendbot le finance ; s’il a déjà des fonds, la Forge le réutilise simplement.`,
      cta: "Financer avec Friendbot",
      successBody: `Le compte respire — {balance} XLM prêts à l'emploi. Suffisamment de carburant pour mille déploiements.`,
    },
    "name": {
      prompt: `## Nomme ta création

Le **nom** du token est une métadonnée visible par l'utilisateur, stockée sur chaîne à la construction — les wallets et explorateurs l'afficheront.`,
      placeholder: "Forge Gold",
      hint: "2–24 caractères",
    },
    "symbol": {
      prompt: `## Donne-lui un symbole

Le ticker court — ce qui apparaît dans les soldes et les paires de trading.`,
      placeholder: "FGOLD",
      hint: "2–12 lettres/chiffres, commence par une lettre",
    },
    "supply": {
      prompt: `## Fixe l'offre initiale

Émise pour **toi** par le constructeur, en tokens entiers. Ton token utilise **7 décimales** — la convention Stellar — donc le contrat stocke ton nombre × 10⁷ en arrière-plan.`,
      placeholder: "1000",
      hint: "1 à 999 999 999 tokens entiers",
    },
    "ext-pausable": {
      prompt: `## Extension : Pausable ?

Un token **pausable** possède un frein d'urgence : le propriétaire peut geler les transferts et les mints pendant l’analyse d’un incident, puis reprendre les opérations. Les émetteurs régulés le veulent presque toujours ; une meme coin peut préférer la pureté sans frein.`,
      options: [
        {
          label: "Oui — ajoute le frein d'urgence",
          value: "yes",
          blurb: "Le propriétaire peut mettre en pause / débloquer les transferts, les appels `mint` et les appels `burn`.",
        },
        {
          label: "Non — inarrêtable par conception",
          value: "no",
          blurb: "Aucun interrupteur de pause n'existe. Personne ne peut le geler, toi compris.",
        },
      ],
    },
    "ext-burnable": {
      prompt: `## Extension : Burnable ?

Un token **burnable** permet aux détenteurs de détruire leurs propres unités, réduisant l'offre totale — utile pour les flux de rachat (« brûle le bon, reçois les marchandises ») et les conceptions déflationnistes.`,
      options: [
        {
          label: "Oui — les détenteurs peuvent brûler",
          value: "yes",
          blurb: "Ajoute burn et burn_from de l'extension burnable d'OpenZeppelin.",
        },
        {
          label: "Non — l’offre ne fait que croître",
          value: "no",
          blurb: "Aucun point d'entrée de burn n'est compilé du tout.",
        },
      ],
    },
    "quiz-oz": {
      question: `Pourquoi le wizard assemble ton token à partir des blocs d'OpenZeppelin plutôt que d'écrire du Rust neuf à partir de zéro ?`,
      options: [
        "Code audité, largement revu, avec une interface standard, vaut mieux qu'un code nouveau pour les parties partagées par chaque token",
        "Écrire un token à partir de zéro est impossible en Rust",
        "Les contrats d'OpenZeppelin sont le seul code que le réseau Stellar acceptera",
      ],
      explain: `Le réseau exécute tout Wasm valide — mais la logique de token est exactement là où un bug subtil coûte de l'argent réel, et où les standards (SEP‑41) rendent ton token lisible par chaque wallet et DEX. La nouveauté est pour ton produit, pas pour l’infrastructure de base du token.`,
    },
    "build": {
      title: "Génère le Rust et compile",
      body: `La Forge assemble maintenant **{name} ({symbol})** à partir de tes choix — du vrai Rust avec \`stellar-tokens\`, ancré aux mêmes versions auditées que l'IDE utilise — et le compile en **WebAssembly** dans un runner isolé. Une vraie compilation prend une minute ou deux ; regarde ça fonctionner.`,
      cta: "Compile en Wasm",
      successBody: `Le runner renvoie ton contrat sous forme de **blob Wasm** — le Rust a été transformé pour la machine virtuelle du ledger.

Note ce qui n'a PAS eu lieu : ton nom, symbole et offre ne sont pas intégrés dans le code. Ils voyagent comme **arguments du constructeur** à l'étape suivante, donc le même Wasm vérifié pourrait donner naissance à mille tokens différents.`,
    },
    "deploy": {
      title: "Déploie sur le testnet",
      body: `Deux transactions, toutes deux signées par toi : d'abord le Wasm est **téléchargé** sur le ledger, puis une **instance de contrat** est créée à partir de celui‑ci — et son \`__constructor\` s'exécute une fois avec ton nom, symbole et offre, en émettant tout à ton adresse.`,
      cta: "Déploie et lance le constructeur",
      successBody: `**{symbol} vit.** Adresse du contrat :

\`{contract}\`

Cette adresse répond désormais aux appels SEP‑41 — \`balance\`, \`transfer\`, \`name\` — pour tout wallet, explorateur ou contrat qui demande. Elle est aussi apparue dans le panneau **Interact** de l’IDE de la Forge : la même Forge et les mêmes déploiements.`,
    },
    "mint": {
      title: "Émets une série supplémentaire",
      body: `Ton constructeur a déjà émis l’offre initiale pour toi. Maintenant invoque directement le contrat vivant : la Forge récupère sa **spec on-chain**, construit un appel \`mint\`, **le simule**, et te fait signer la vraie transaction — le même flux qui consiste à simuler puis signer que chaque dApp Soroban utilise.`,
      cta: "Émettre 25 {symbol} supplémentaires",
      successBody: `Émission réussie : 25 {symbol} supplémentaires dans ton solde. L’opération a été autorisée parce que le contrat a vérifié \`owner.require_auth()\` et **tu es le propriétaire**.

Tout autre appel à \`mint\` est rejeté par la même ligne. C'est le contrôle d'accès sur‑chaîne, appliqué par le code que tu as choisi.`,
    },
    "quiz-sep41": {
      question: `Ton token implémente SEP‑41. Que lui apporte‑t‑il ?`,
      options: [
        "Chaque wallet, DEX et contrat qui parle l'interface standard peut le détenir, afficher et déplacer — sans intégration personnalisée",
        "Une inscription sur chaque échange, automatiquement",
        "Immunité aux bugs — le standard est audité, donc les implémentations le sont aussi",
      ],
      explain: `Un standard est un langage commun, pas un accord marketing ou une garantie de sécurité. SEP‑41 signifie que ton token répond aux appels que l'écosystème connaît déjà — c'est pourquoi le wizard a construit sur le standard plutôt que d'inventer des points d'entrée.`,
    },
    "claim": {
      body: `Le ledger conserve ton Wasm, ton contrat et un solde de tokens émis pour ton sigil. La Forge consultera la chaîne elle-même — **simuler \`balance(you)\` sur ton contrat** — avant de libérer la récompense. Preuve, pas promesses.`,
    },
  },
} satisfies LabTextOverlay;
