import type { LabTextOverlay } from "../localize";

export const labText = {
  "meta": {
    "title": "Smart Wallet avec passkey",
    "tagline": "Un portefeuille sans phrase de récupération : ton appareil signe."
  },
  "steps": {
    "intro": {
      "body": "## La clé que tu ne vois jamais\n\nUn portefeuille Stellar classique commence par un secret `S…`. Un **portefeuille avec passkey** commence dans le matériel sécurisé de ton téléphone ou de ton ordinateur. WebAuthn demande à ce matériel de créer une clé **secp256r1** et ne révèle que la partie publique ; Face ID, Touch ID, un code PIN ou une clé de sécurité déverrouillent chaque signature.\n\nAujourd’hui, tu vas enregistrer une vraie passkey, déployer un contrat **smart account** sur testnet et répondre avec elle à un nouveau défi d’authentification. Aucune phrase de récupération ne sera affichée — parce qu’elle n’existe pas."
    },
    "forge-deployer": {
      "title": "Prépare le compte de lancement",
      "body": "Un contrat ne peut pas payer les frais de sa propre création. La Forge a donc besoin d’un petit compte **G** classique pour le déployer. Si tu en as déjà créé un, il sera réutilisé ; sinon, une nouvelle paire de clés réservée à testnet sera créée dans ce navigateur.\n\nCe compte de lancement **ne signe pas** au nom de la smart wallet. Il paie seulement les frais et fournit le salt du déploiement — rien de plus.",
      "cta": "Préparer le compte de lancement",
      "successBody": "Compte de lancement prêt :\n\n`{address}`\n\nSon secret reste dans ce navigateur. La passkey que tu vas créer restera séparée, dans le matériel sécurisé."
    },
    "fund-deployer": {
      "title": "Finance le lancement",
      "body": "Déployer un contrat Soroban consomme du XLM de testnet pour les frais de l’enveloppe et les ressources du ledger. Friendbot finance le compte de lancement ; s’il existe déjà, la Forge le réutilise simplement.",
      "cta": "Financer avec Friendbot",
      "successBody": "{balance} XLM financent maintenant le compte de lancement. C’est suffisant pour déployer la smart wallet sans relayer et sans donner le moindre pouvoir à la clé de lancement."
    },
    "quiz-secret": {
      "question": "Où se trouve la partie privée d’une passkey ?",
      "options": [
        "Dans le matériel sécurisé de l’authentificateur ; l’application reçoit des signatures, jamais la clé privée",
        "Chiffrée dans la base de données de TUSST afin que le serveur puisse signer plus tard",
        "Dans le contrat smart account, sous forme de données publiques du ledger"
      ],
      "explain": "Exactement. Le navigateur transmet un défi à l’authentificateur. Le réseau voit une clé publique et une signature ; TUSST ne reçoit jamais la moindre clé privée."
    },
    "create-passkey-wallet": {
      "title": "Enregistre la passkey et déploie le portefeuille",
      "body": "Ton appareil ouvrira sa demande native de passkey. Après ton approbation, la Forge construit un **smart account de Protocol 27** dont cette identité est le signataire par défaut, puis le compte de lancement paie directement les frais de déploiement via RPC.\n\nLe code du compte est le Wasm canonique fondé sur OpenZeppelin et publié avec `smart-account-kit@0.6.2`.",
      "cta": "Créer la passkey et déployer le portefeuille",
      "successBody": "Ton portefeuille sans phrase de récupération est actif sur testnet :\n\n`{contract}`\n\nL’adresse commence par **C** parce que le portefeuille est un contrat. Sa règle d’autorisation pointe vers la passkey que tu viens de créer — pas vers le compte G qui a payé le déploiement."
    },
    "quiz-authority": {
      "question": "Le compte G a payé le déploiement de la smart wallet. Son secret peut-il autoriser les dépenses du nouveau compte C ?",
      "options": [
        "Non — payer le déploiement n’en fait pas un signataire ; les règles de la smart account décident",
        "Oui — le payeur des frais possède définitivement chaque contrat qu’il déploie",
        "Seulement jusqu’à la prochaine clôture du ledger"
      ],
      "explain": "Exact. Le compte source, le payeur des frais, le salt du deployer et le signataire de la smart account jouent des rôles distincts. Le signataire par défaut de ce portefeuille est l’identité WebAuthn."
    },
    "authenticate-passkey": {
      "title": "Laisse la passkey signer",
      "body": "Le déploiement a enregistré une clé publique, mais un portefeuille n’est utile que si le réseau accepte ses signatures. La Forge finance le nouveau compte C avec du XLM de testnet, prépare un **virement de 1 XLM vers ton compte de lancement** et demande à l’identité liée à `{contract}` de l’autoriser.\n\nApprouve la demande de l’appareil. Cette fois, la signature part sur le réseau et `__check_auth` doit l’accepter.",
      "cta": "Signer et envoyer 1 XLM avec la passkey",
      "successBody": "Le virement a été effectué. Ton matériel sécurisé a signé, le vérificateur WebAuthn a validé la preuve secp256r1 et `__check_auth` a autorisé la smart wallet à envoyer **1 XLM**.\n\nCette transaction prouve publiquement que la passkey contrôle `{contract}` — pas seulement qu’une boîte de dialogue s’est ouverte dans le navigateur."
    },
    "quiz-cap71": {
      "question": "Qu’est-ce que la CAP-71 de Protocol 27 a simplifié pour les smart accounts ?",
      "options": [
        "La délégation propre de l’authentification, qui réduit le poids et le coût des flux d’autorisation à plusieurs signataires",
        "La transformation automatique de chaque compte G classique en passkey",
        "La suppression de tous les frais de transaction du réseau"
      ],
      "explain": "La délégation fait partie de l’infrastructure du protocole : une autorité peut confier l’authentification à une autre sans transporter l’ancien format d’autorisation complet dans chaque transaction. Cela aide les smart accounts ; cela ne supprime pas les frais et ne transforme pas les comptes classiques."
    },
    "claim": {
      "body": "La Forge va maintenant consulter testnet : le compte G de lancement doit exister, l’adresse C doit correspondre au **code canonique du smart account de Protocol 27**, et cette smart wallet doit encore détenir du XLM natif après le virement signé par la passkey. Ce n’est qu’alors que le ledger libérera les XP du lab."
    }
  }
} satisfies LabTextOverlay;
