import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Portefeuilles sans phrases secrètes",
  tagline:
    "Comptes intelligents, passkeys et frais sponsorisés par quelqu’un d’autre.",
  steps: [
    {
      kind: "theory",
      body: `## Le problème des vingt-quatre mots

Les portefeuilles traditionnels accueillent chaque nouvel utilisateur avec un rituel : *écris ces 24 mots ; si tu les perds, ton argent disparaît pour toujours ; si tu les montres à quelqu’un, il disparaît encore plus vite.*\n\nDans la réalité, ce test échoue sans cesse : captures d’écran, notes au fond d’un tiroir, sauvegardes jamais effectuées. Des fortunes entières se sont envolées avec un simple pense-bête égaré. Et la plupart des utilisateurs ne vont même pas jusque-là : **l'inscription s'arrête à l'écran de la phrase secrète**.\n\nSi les infrastructures blockchain doivent servir à verser des salaires ou payer des courses, ce rituel doit disparaître. Sur Stellar, c’est possible : un compte n’est pas forcément une simple paire de clés.`,
    },
    {
      kind: "theory",
      body: `## Des comptes qui sont aussi des contrats\n\nUn compte classique s’authentifie d’une seule façon : le protocole compare les signatures ed25519 à sa liste de signataires. Cette logique reste figée.\n\nUn **compte intelligent** fonctionne autrement : c'est un contrat Soroban. Lorsqu’une transaction revendique son autorité, le protocole appelle la fonction \`__check_auth\` du contrat et lui demande : *« acceptes-tu ? »*\n\nLa règle de signature devient **le code que tu as écrit**. Tu peux vérifier une autre courbe, exiger deux appareils au-delà d’un certain montant ou remplacer les clés après une compromission sans changer d’adresse. Toute politique exprimable en Rust peut désormais faire office de règle de signature.`,
    },
    {
      kind: "theory",
      body: `## Passkeys : la clé que tu ne peux pas perdre\n\nTon téléphone contient déjà un coffre‑fort : l’**enclave sécurisée**, un matériel qui signe avec des clés qui ne quittent jamais la puce, déverrouillé par Face ID ou une empreinte digitale. La norme web pour cela est **WebAuthn** — passkeys — et elle utilise la courbe **secp256r1**.\n\nStellar vérifie secp256r1 **nativement**, donc un compte intelligent peut accepter l’enclave de ton téléphone comme signataire directement : le matériel biométrique signe, la chaîne vérifie la signature passkey elle‑même.\n\nAucune phrase secrète n’existe à aucun moment. Le « portefeuille » est le même matériel qui protège déjà ton application bancaire — maintenant il signe les transactions du registre.`,
    },
    {
      kind: "diagram",
      body: "Le même compte, deux façons de le détenir :",
      caption: "La passkey ne quitte jamais le matériel sécurisé de l'appareil — c'est précisément pourquoi on ne peut pas vous l'hameçonner.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "seed",
            label: "vingt-quatre mots",
            tone: "bad",
          },
          {
            id: "passkey",
            label: "une passkey",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "où elle vit",
            cells: [
              {
                text: "une capture, une appli de notes, un tiroir",
                tone: "bad",
              },
              {
                text: "l'enclave sécurisée de l'appareil",
                tone: "good",
              },
            ],
          },
          {
            label: "comment on la perd",
            cells: [
              {
                text: "une photo du papier suffit",
                tone: "bad",
              },
              {
                text: "elle ne peut pas être copiée vers l'extérieur",
                tone: "good",
              },
            ],
          },
          {
            label: "pour signer",
            cells: [
              {
                text: "taper ou coller le tout",
                tone: "bad",
              },
              {
                text: "une empreinte",
                tone: "good",
              },
            ],
          },
          {
            label: "si l'appareil meurt",
            cells: [
              {
                text: "peu importe — les mots sont le compte",
                tone: "neutral",
              },
              {
                text: "ajoutez un second signataire avant ce jour-là",
                tone: "gold",
              },
            ],
          },
        ],
      },
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
      explain: `La clé privée ne quitte jamais l’enclave et n’est jamais montrée à personne : rien à écrire, à photographier ni à exposer à une tentative d'hameçonnage. La récupération devient une question de politique (signataires supplémentaires, appareil gardien), pas un test de mémoire.`,
    },
    {
      kind: "theory",
      body: `## Politiques : des signatures qui appliquent tes règles\n\nUne fois la règle d’authentification inscrite dans le code, chaque signataire peut être soumis à une **politique** :\n\n- **Limites de dépenses** — la passkey seule approuve jusqu’à 50 USDC par jour ; au-delà, un second facteur doit cosigner.\n- **Contrats autorisés** — un signataire qui ne peut interagir *qu'avec* ton jeu, jamais avec le DEX.\n- **Clés de session** — accorde à une dapp sa propre clé, limitée à une soirée ; elle expire d’elle-même.\n\nVoilà ce que la programmabilité apporte réellement aux utilisateurs : des garde-fous imposés par le registre, et non une simple promesse dans les conditions d’utilisation de l’application.`,
    },
    {
      kind: "fill",
      prompt: `Quelle courbe permet à la chaîne de vérifier une signature d’enclave sécurisée de téléphone ?`,
      file: "auth-stack.txt",
      before: `Face ID  →  l’enclave sécurisée signe avec  `,
      after: `  →  vérifiée nativement sur le registre`,
      choices: ["secp256r1", "secp256k1", "ed25519", "curve25519"],
      answer: 0,
      explain: `ed25519 est la courbe classique de Stellar et secp256k1 appartient à Bitcoin et Ethereum. Le matériel WebAuthn parle secp256r1 (a.k.a. P‑256), et le protocole le vérifie nativement — pas d’émulation lourde en‑contrat, pas d’explosion de coût.`,
    },
    {
      kind: "theory",
      body: `## Des frais payés par quelqu’un d’autre\n\nUn obstacle demeure : un nouvel utilisateur ne possède aucun XLM, alors que chaque transaction entraîne des frais, même minimes. Lui dire « commence par acheter des XLM sur une plateforme d'échange » brise toute la magie.\n\nStellar répond avec le **parrainage des frais** : un autre compte — généralement celui de l’application — enveloppe la transaction de l’utilisateur, **paie ses frais** et peut également parrainer les réserves. La première action on-chain de l’utilisateur ne coûte donc rien et ne nécessite aucun financement préalable.\n\nPasskey + parrainage : appuie sur « Créer un compte », valide avec Face ID et te voilà en train d'effectuer des transactions sur un registre public — sans passer par une plateforme d'échange, sans rituel de phrase secrète et sans avoir besoin de XLM.`,
    },
    {
      kind: "theory",
      body: `## Protocole 27 « Zipper » : la délégation arrive\n\nLes comptes intelligents sont encore jeunes, et le protocole évolue activement pour mieux les prendre en charge. **Le Protocole 27 — « Zipper »**, actif sur le réseau principal depuis **juillet 2026**, a introduit la **CAP‑71 : délégation d’authentification** pour les comptes intelligents.\n\nLa délégation permet à une autorité de transmettre proprement son pouvoir de signature à une autre, directement au niveau du protocole. Elle **simplifie les configurations multisignatures** et **réduit le coût des transactions** pour les modèles de compte décrits dans ce chapitre.\n\nConcrètement pour les bâtisseurs : portefeuilles multi-appareils, récupération par gardien et politiques d'autorisation complexes deviennent moins coûteux et plus simples à mettre en œuvre. Le protocole favorise désormais les comptes intelligents au lieu de simplement les tolérer.`,
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
      explain: `La délégation est une amélioration d'infrastructure, pas un effet spectaculaire : moins de signatures à transporter et une authentification multipartite moins coûteuse. Les comptes ed25519 classiques continuent de fonctionner comme avant ; les deux modèles coexistent.`,
    },
    {
      kind: "labLink",
      labSlug: "passkey-smart-wallet",
      body: `La Forge est prête : ouvre **Passkey Smart Wallet**, enregistre une véritable passkey, déploie son contrat de compte intelligent sur testnet et réponds à un nouveau défi WebAuthn avec ton propre appareil.\n\nLorsque le registre aura confirmé que le code déployé correspond au Wasm canonique du compte intelligent, reprends la route. Elle mène vers un territoire encore plus étrange : un registre où *les montants eux-mêmes* se couvrent d'un voile.`,
    },
  ],
  testOut: [
    { question: `Quel problème un smart account résout-il qu'une paire de clés classique ne résout pas ?`,
      options: ["L'autorisation devient programmable — le compte décide de ce qui vaut signature valide, au lieu qu'une clé soit l'unique réponse","Il supprime les frais de transaction pour le propriétaire du compte","Il permet à un compte de détenir des actifs sans trustline"], answer: 0 },
    { question: `Que remplace une passkey, et que ne remplace-t-elle pas ?`,
      options: ["Elle remplace la phrase de récupération qu'un humain doit mettre à l'abri ; elle ne supprime pas la nécessité pour le compte d'autoriser quelque chose","Elle remplace entièrement la signature du compte — un compte à passkey ne signe rien","Elle remplace les frais réseau, ces comptes étant parrainés par défaut"], answer: 0 },
    { question: `Le parrainage des frais permet à une application de faire quoi ?`,
      options: ["Payer les frais et réserves d'un utilisateur, pour que quelqu'un sans le moindre XLM puisse transiger","Abaisser les frais de base sous le minimum du protocole pour ses utilisateurs","Grouper les transactions de ses utilisateurs dans une enveloppe pour partager des frais"], answer: 0 },
    { question: `Pourquoi « personne n'a à noter douze mots » est-il une décision produit et pas un simple confort ?`,
      options: ["Les phrases de récupération sont la première source de perte irréversible pour les utilisateurs — les retirer supprime le mode de défaillance, pas seulement la friction","Parce que les listes de mots n'existent pas dans toutes les langues","Parce que conserver une phrase de récupération est interdit dans la plupart des juridictions"], answer: 0 },
  ],
} satisfies JourneyConceptText;
