import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Portefeuilles sans phrases secrètes",
  tagline: "Comptes intelligents, passkeys et frais sponsorisés par quelqu’un d’autre.",
  steps: [
    {
      kind: "theory",
      body: `## Le problème des vingt-quatre mots

Les portefeuilles traditionnels accueillent un nouvel utilisateur avec un rituel : *écris ces 24 mots ; si tu les perds, ton argent disparaît pour toujours ; montre-les à n’importe qui et c’est encore plus vite.*\n\nLes gens réels échouent à ce test sans cesse — captures d’écran, notes dans le tiroir, sauvegardes qui n’ont jamais eu lieu. Des fortunes entières ont disparu à cause d’une note adhésive perdue. Et la plupart des utilisateurs n’atteignent même pas ce stade : **l’onboarding meurt à l’écran de phrase secrète**.\n\nSi les rails de la chaîne doivent transporter salaires et courses, la cérémonie de clé doit disparaître. Sur Stellar, c’est possible — car un compte n’a pas besoin d’être un simple couple clé/valeur.`,
    },
    {
      kind: "theory",
      body: `## Comptes qui sont des contrats\n\nUn compte classique s’authentifie d’une seule façon : le protocole vérifie les signatures ed25519 contre sa liste de signataires. Logique fixe, pour toujours.\n\nUn **compte intelligent** est différent : il *est* un contrat Soroban, et lorsqu’une transaction revendique son autorité, le protocole appelle la fonction \`__check_auth\` du contrat et demande : *« accepte‑tu ? »*\n\nLa règle de signature devient **le code que tu as écrit**. Vérifie une courbe différente. Exige deux appareils au-dessus d’un seuil. Tourne les clés après une brèche sans changer l’adresse. Quelle que soit la politique que tu peux exprimer en Rust, c’est maintenant une forme de signature.`,
    },
    {
      kind: "theory",
      body: `## Passkeys : la clé que tu ne peux pas perdre\n\nTon téléphone contient déjà un coffre‑fort : l’**enclave sécurisée**, un matériel qui signe avec des clés qui ne quittent jamais la puce, déverrouillé par Face ID ou une empreinte digitale. La norme web pour cela est **WebAuthn** — passkeys — et elle utilise la courbe **secp256r1**.\n\nStellar vérifie secp256r1 **nativement**, donc un compte intelligent peut accepter l’enclave de ton téléphone comme signataire directement : le matériel biométrique signe, la chaîne vérifie la signature passkey elle‑même.\n\nAucune phrase secrète n’existe à aucun moment. Le « portefeuille » est le même matériel qui protège déjà ton application bancaire — maintenant il signe les transactions du registre.`,
    },
    {
      kind: "quiz",
      question: `Dans un portefeuille intelligent passkey, qu’est‑ce qui remplace la phrase secrète ?`,
      options: [
        "Rien à mémoriser — une clé née dans le matériel sécurisé de l’appareil signe, et la chaîne la vérifie nativement",
        "Une phrase plus courte de six mots plus facile à retenir",
        "L’ancre, qui garde la phrase secrète pour toi en custodie",
      ],
      answer: 0,
      explain: `La clé privée ne quitte jamais l’enclave et n’a jamais été montrée à personne — il n’y a rien à écrire, à photographier ou à phishing. La récupération devient une question de politique (signataires supplémentaires, appareil gardien), pas un test de mémoire.`,
    },
    {
      kind: "theory",
      body: `## Politiques : signatures avec opinion\n\nUne fois la règle d’authentification en code, un signataire peut porter une **politique** :\n\n- **Limites de dépenses** — la passkey seule approuve jusqu’à 50 USDC par jour ; au-delà, un second facteur doit co‑signer.\n- **Contrats autorisés** — un signataire qui ne peut *que* parler à ton jeu, jamais au DEX.\n- **Clés de session** — accorde à une dapp sa propre clé limitée pour la soirée ; elle expire d’elle‑même.\n\nC’est ce que « programmable » achète réellement aux utilisateurs : des garde‑fous imposés par le registre, pas par une promesse dans les conditions d’utilisation de l’application.`,
    },
    {
      kind: "fill",
      prompt: `Quelle courbe permet à la chaîne de vérifier une signature d’enclave sécurisée de téléphone ?`,
      file: "auth-stack.txt",
      before: `Face ID  →  l’enclave sécurisée signe avec  `,
      after: `  →  vérifiée nativement sur le ledger`,
      choices: ["secp256r1", "secp256k1", "ed25519", "curve25519"],
      answer: 0,
      explain: `ed25519 est la courbe classique de Stellar et secp256k1 appartient à Bitcoin et Ethereum. Le matériel WebAuthn parle secp256r1 (a.k.a. P‑256), et le protocole le vérifie nativement — pas d’émulation lourde en‑contrat, pas d’explosion de coût.`,
    },
    {
      kind: "theory",
      body: `## Frais que quelqu’un d’autre paie\n\nUn mur reste : un nouvel utilisateur possède zéro XLM, et les transactions coûtent (minimes) des frais. Le dire « d’abord, achète XLM sur un échange » tue la magie.\n\nLa réponse de Stellar est **le sponsoring de frais** : un autre compte — généralement celui de l’application — enveloppe la transaction de l’utilisateur et **paie son frais**, et peut aussi sponsoriser les réserves. La première action on‑chain de l’utilisateur ne lui coûte rien et ne nécessite aucun financement préalable.\n\nPasskey + sponsoring : tape « créer compte », regarde Face ID, et tu effectues des transactions sur un registre public — pas de visite à l’échange, pas de cérémonie de phrase, pas de XLM en vue.`,
    },
    {
      kind: "theory",
      body: `## Protocole 27 « Zipper » : la délégation arrive\n\nLes comptes intelligents sont jeunes, et le protocole les pave activement. **Protocole 27 — « Zipper »**, en direct sur mainnet depuis **juillet 2026**, a livré **CAP‑71 : délégation d’authentification** pour les comptes intelligents.\n\nLa délégation permet à une autorité de confier le pouvoir de signature à une autre proprement, au niveau du protocole — ce qui **simplifie les configurations multisig** et **réduit les coûts de transaction** pour exactement les modèles de compte décrits dans ce chapitre.\n\nTraduction pour les bâtisseurs : portefeuilles multi‑appareils, récupération par gardien et conceptions lourdes en politique deviennent moins chers et plus simples à exécuter. Le protocole penche *vers* les comptes intelligents, pas seulement à les tolérer.`,
    },
    {
      kind: "quiz",
      question: `Qu’est‑ce que CAP‑71 dans le Protocole 27 « Zipper » a changé pour les comptes intelligents ?`,
      options: [
        "Délégation d’authentification — simplification du multisig et réduction des coûts de transaction",
        "Il a rendu toutes les transactions de comptes intelligents gratuites pour toujours",
        "Il a remplacé ed25519 par secp256r1 sur tout le réseau",
      ],
      answer: 0,
      explain: `La délégation relève de l’infrastructure, pas des feux d’artifice : moins de signatures à transporter, auth multi‑parties moins cher. Les comptes classiques ed25519 continuent de fonctionner exactement comme avant — les deux styles de compte coexistent.`,
    },
    {
      kind: "labLink",
      labSlug: "passkey-smart-wallet",
      body: `La Forge est prête : entre **Passkey Smart Wallet**, inscris une vraie passkey, déploie son contrat de compte intelligent sur testnet, et réponds à un nouveau défi WebAuthn avec ton propre appareil.\n\nLorsque le registre confirme que le code déployé est le Wasm canonique du compte intelligent, reviens sur la route. Elle se courbe quelque part de plus étrange : un registre où *les montants eux‑mêmes* portent un voile.`,
    },
  ],
} satisfies JourneyConceptText;
