import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Ton premier portefeuille",
    tagline: "Crée une paire de clés, active un compte, ouvre une trustline et envoie du XLM.",
  },
  steps: {
    "intro": {
      body: `## Chaque héros a besoin d’un sigil

Sur Stellar, ton identité est une **paire de clés** : une adresse publique que tu montres au monde (elle commence par \`G\`) et une clé secrète que tu gardes précieusement (elle commence par \`S\`).

Pas de formulaire. Pas d’e‑mail. Pas de permission. Tu *forges* une identité à partir de mathématiques pures — et dans les prochaines minutes elle détiendra des fonds, acceptera un actif et paiera un autre compte. Tout est réel, sur le **testnet** : les terrains d’entraînement de Stellar, où les pièces n’ont aucune valeur mais la machinerie est la même.`,
    },
    "forge-keys": {
      title: "Forge tes clés",
      body: `Un seul coup de marteau génère 32 octets de hasard et dérive les deux clés à partir de celui‑ci. Le secret reste **dans ton navigateur** — TUSST ne le voit jamais, et aucun serveur n’est impliqué dans ce que tu signes aujourd’hui.`,
      cta: "Forge la paire de clés",
      successBody: `Ton sigil est frappé :

\`{address}\`

Cette adresse est publique — partage‑la librement. La clé secrète qui la sous-tend signe en ton nom ; quiconque la détient contrôle le compte. Sur testnet, cela n’a aucune conséquence financière. Sur le mainnet, protège‑la comme un dragon.`,
    },
    "friendbot": {
      title: "Réveille le compte",
      body: `Actuellement ton adresse n’est encore que des mathématiques — **le grand livre ne l’a jamais entendue**. Un compte n’existe que lorsqu’on le finance au-delà de la *réserve de base* (un petit dépôt XLM qui paie son entrée dans le grand livre).

Sur le testnet, un esprit infatigable appelé **Friendbot** finance quiconque le demande.`,
      cta: "Appelle Friendbot",
      successBody: `Friendbot a répondu — ton compte existe maintenant **sur le grand livre** avec {balance} XLM.

Deux choses sont nées avec : un **solde** et un **numéro de séquence** qui compte chaque transaction que tu signeras. Recherche‑le sur n’importe quel explorateur — c’est maintenant un registre public.`,
    },
    "quiz-reserve": {
      question: `Avant Friendbot, envoyer du XLM à ton adresse aurait nécessité une opération spéciale \`create_account\`. Pourquoi Stellar impose-t‑il une *réserve de base* aux nouveaux comptes ?`,
      options: [
        "Elle paie l’entrée permanente du compte dans le grand livre, rendant coûteuse la création de comptes de spam",
        "Ce sont des frais collectés par les validateurs comme profit",
        "C’est une assurance remboursée par le support Stellar si tu perds ta clé",
      ],
      explain: `Exactement — chaque entrée du grand livre (compte, ligne de confiance, offre) verrouille une petite réserve afin que le grand livre ne soit pas inondé de déchets gratuits. Supprime l’entrée, récupère la réserve.`,
    },
    "trustline": {
      title: "Ouvre une ligne de confiance",
      body: `Ton compte détient du XLM nativement — mais tout autre actif doit être **invité**. Une *ligne de confiance* est ton message au grand livre : « J’accepte l’USDC émis par Circle, jusqu’à cette limite. »

C’est pourquoi personne ne peut t’envoyer des tokens indésirables sur Stellar : **pas de ligne de confiance, pas de jetons**. Cette transaction est aussi ta première signature.`,
      cta: "Accepter l’USDC",
      successBody: `Ligne de confiance ouverte — ton compte peut maintenant détenir **USDC** (émis par Circle sur testnet).

Remarque ce que ça a coûté : une petite commission (~0.00001 XLM) et une réserve de base supplémentaire verrouillée, car une ligne de confiance est une nouvelle entrée du grand livre. Ton numéro de séquence a aussi grimpé.`,
    },
    "shrine": {
      title: "Grave un sigil compagnon",
      body: `Tu ne peux pas envoyer un paiement dans le vide — tu as besoin d’une **destination**. Gravons une seconde adresse : un petit sanctuaire pour recevoir ta première offrande.

Nous allons le générer et *jeter la clé secrète dans la mer*. Le compte existera, détiendra ce que tu lui enverras, et ne répondra à personne. Un monument.`,
      cta: "Grave le sigil",
      successBody: `Le sigil du sanctuaire :

\`{companion}\`

Il n’existe pas encore sur le grand livre — pareil que le tien avant Friendbot. Mais cette fois, c’est **toi** qui lui donneras vie.`,
    },
    "create-companion": {
      title: "Érige le sanctuaire",
      body: `Une opération \`create_account\` finance une nouvelle adresse au-delà de la réserve de base — exactement ce que Friendbot a fait pour toi. Maintenant tu le fais pour le sanctuaire, depuis **ton** solde : 100 XLM d’or testnet.`,
      cta: "Érige‑le (envoie 100 XLM)",
      successBody: `Le sanctuaire se dresse. Tu viens d’effectuer le même rite que Friendbot : **les comptes créent des comptes**. C’est toute la hiérarchie ; il n’existe pas de registre central.`,
    },
    "payment": {
      title: "Fais une offrande",
      body: `Le classique. Une opération \`payment\` déplace de la valeur d’un compte à un autre — réglée en ~5 secondes, pour une commission d’environ **0.00001 XLM**. C’est la transaction autour de laquelle Stellar a été construit.`,
      cta: "Envoie 25 XLM",
      successBody: `Offrande livrée — 25 XLM, final, irréversible, dans le registre public :

\`{tx}\`

Commission, augmentation de séquence, deux soldes mis à jour, une clôture du ledger. Cinq secondes. C’est un paiement Stellar.`,
    },
    "quiz-recap": {
      question: `Quelqu’un veut envoyer **USDC** à ton compte sanctuaire. Arrivera‑t‑il ?`,
      options: [
        "Non — le sanctuaire n’a jamais ouvert de ligne de confiance USDC, donc le grand livre le refuse",
        "Oui — tout compte peut recevoir n’importe quel actif",
        "Seulement s’ils paient une commission plus élevée",
      ],
      explain: `Exact. Les lignes de confiance sont par compte, par actif. Ton compte principal fait confiance à l'USDC ; le sanctuaire ne détient que le XLM natif. Et comme son secret est au fond de la mer, personne ne pourra jamais en ouvrir une pour lui.`,
    },
    "claim": {
      body: `Le ledger enregistre tout ce que tu viens de faire : un compte créé, une ligne de confiance ouverte, un paiement réglé. Présente ton adresse, et la Forge consultera la chaîne elle-même — **preuve, pas promesses** — avant de libérer tes XP.`,
    },
  },
} satisfies LabTextOverlay;
