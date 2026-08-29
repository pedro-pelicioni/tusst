import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Rivières de Valeur",
  tagline: "Paiements, paiements par chemin, le DEX et les AMM.",
  steps: [
    {
      kind: "theory",
      body: `## Rivières, pas de coffres

Tu as déjà décortiqué un simple \`payment\` : un actif, A vers B, final en ~5 secondes. C’est un canal — droit, utile, ennuyeux.

La partie intéressante, c’est que le grand livre de Stellar n’est pas qu’un coffre de soldes. Il porte un **échange de devises complet à l’intérieur du protocole** : carnets d’ordres, pools de liquidité et opérations de paiement qui *échangent pendant qu’ils voyagent*.

Pas d’échange externe, pas de pont, pas de détour enveloppé — la conversion est une puissance native du grand livre. Ce chapitre suit l’eau : d’abord les offres, puis les pools, puis l’opération qui fait que les transferts semblent magiques.`,
    },
    {
      kind: "theory",
      body: `## Un carnet d’ordres *sur* le grand livre

Le **DEX Stellar** n’est pas un contrat que quelqu’un a déployé — c’est la machinerie du protocole.

- \`manage_sell_offer\` / \`manage_buy_offer\` placent une offre : *"Je donne X, je veux Y, à ce prix."*
- Chaque offre est une **entrée du grand livre**, située dans le carnet d’ordres comme tout autre état.
- **Le matching se produit à la clôture du grand livre** : quand les offres se croisent, le protocole exécute l’échange dans le cadre du consensus lui‑même.

Chaque paire d’actifs obtient un carnet d’ordres automatiquement — pas de listes, pas de permission d’un opérateur de marché. Deux trustlines et une offre, et tu *es* le marché.`,
    },
    {
      kind: "quiz",
      question: `Qui associe une offre d’achat à une offre de vente sur le DEX Stellar ?`,
      options: [
        "Le protocole lui‑même, à la clôture du grand livre — les offres sont des entrées du grand livre et le matching fait partie du consensus",
        "Un contrat intelligent d’engine de matching maintenu par la SDF",
        "Des relayers hors chaîne qui soumettent des paires appariées pour une commission",
      ],
      answer: 0,
      explain: `C’est la rare chaîne où l’échange vit *dans* le protocole. Pas de matcher déployé signifie pas de matcher à pirater, à soudoyer ou à arnaquer — et les échanges se règlent avec la même finalité que les paiements.`,
    },
    {
      kind: "theory",
      body: `## Pools : l’eau qui reste

Les carnets d’ordres ont besoin de traders actifs qui quotent les prix. **Les pools de liquidité** n’ont besoin que de dépôts :

- N’importe qui dépose une paire d’actifs dans un **pool à produit constant** — la même courbe x · y = k qu’Uniswap a popularisée.
- Les échanges poussent le ratio ; l’arbitrage le ramène ; les déposants gagnent une petite commission sur chaque swap.
- Sur Stellar, ces pools sont des **entrées natives du grand livre** — pas de contrats — gérées avec \`liquidity_pool_deposit\` et \`liquidity_pool_withdraw\`.

Les carnets et les pools coexistent sur un pied d’égalité, et — comme tu es sur le point de voir — un seul paiement peut boire des deux.`,
    },
    {
      kind: "quiz",
      question: `En quoi les pools de liquidité natives de Stellar diffèrent-ils des AMM de style Uniswap ?`,
      options: [
        "Ils sont des fonctionnalités du protocole — des entrées du grand livre gérées par des opérations, pas de contrats déployés",
        "Ils utilisent un matching interne de carnet d’ordres au lieu d’une courbe de prix",
        "Ils ne supportent que les paires qui incluent XLM",
      ],
      answer: 0,
      explain: `Même mathématiques à produit constant, mais chez toi : le pool vit dans le protocole lui‑même, toute paire d’actifs est bienvenue. Les AMM basés sur contrat existent aussi, une couche au-dessus — tu rencontreras leurs noms bientôt.`,
    },
    {
      kind: "theory",
      body: `## Paiements par chemin : la fonction décisive

\`path_payment_strict_send\` fait quelque chose que presque aucune autre chaîne ne fait nativement : **envoyer un actif, livrer un autre** — atomiquement, en une seule opération.

Tu envoies USDC. Le réseau le route à travers les carnets d’ordres et les pools de liquidité — peut‑être USDC → XLM → EURC — et ta grand-mère reçoit EURC. Une seule transaction. Si aucune route ne peut livrer dans tes limites, **rien ne se passe du tout** : aucun fonds n’est bloqué à mi‑swap.

Deux variantes :

- **Strict send** — fixe ce que tu paies ; la destination reçoit ce que la route fournit (au-dessus de ton minimum).
- **Strict receive** — fixe ce qu’ils reçoivent ; tu paies ce que ça coûte (en dessous de ton maximum).`,
    },
    {
      kind: "quiz",
      question: `Une facture est exactement de 900 EURC et ton trésor détient USDC. Quelle opération convient ?`,
      options: [
        "path_payment_strict_receive — fixer les 900 EURC livrés, plafonner l'USDC que tu vas dépenser",
        "path_payment_strict_send — envoyer environ 900 USDC et espérer que le taux arrive près de l’équilibre",
        "Deux transactions : échanger USDC contre EURC sur le DEX, puis un paiement simple",
      ],
      answer: 0,
      explain: `Strict receive existe exactement pour les cas où la facture est fixe. Et une opération atomique bat un swap‑puis‑envoi : pas de dérive de prix entre les étapes, pas de poussière restante, pas d’état à moitié terminé à nettoyer.`,
    },
    {
      kind: "fill",
      prompt: `Trace la rivière — que se passe-t-il entre l’envoi et la livraison dans un paiement par chemin ?`,
      file: "remittance.txt",
      before: `envoyer 100 USDC  →  `,
      after: `  →  livrer EURC — une transaction atomique`,
      choices: [
        "passer par des carnets d’ordres et des pools de liquidité",
        "utiliser des tokens enveloppés sur une autre chaîne",
        "attendre au bureau de change d’une ancre",
        "mettre le paiement aux enchères auprès de bots market makers",
      ],
      answer: 0,
      explain: `Le routage est sur‑ledger et atomique : le protocole parcourt les offres et les pools pour trouver la livraison, et soit tout le chemin s’exécute à la clôture du grand livre, soit rien ne se passe.`,
    },
    {
      kind: "theory",
      body: `## Pourquoi les constructeurs de transferts viennent ici

Les rails anciens : un transfert transfrontalier saute entre des banques correspondantes pendant **2–5 jours** et perd quelques pourcentages en frais en cours de route.

La rivière : les dollars deviennent USDC à une extrémité, un **paiement par chemin** convertit et livre EURC en environ **cinq secondes** pour un frais mesuré en fractions de cent, et les euros sortent de l’autre extrémité.

La conversion FX — historiquement l’étape coûteuse et opaque — devient un saut transparent à travers des carnets d’ordres publics et des pools. Le règlement inter‑devise en secondes est le cas d’usage que Stellar visait dès le premier jour.`,
    },
    {
      kind: "theory",
      body: `## La couche au-dessus de la rivière

Au-dessus de la machinerie native, l’écosystème intègre Soroban : **Soroswap**, **Phoenix** et **Aquarius** exécutent des protocoles AMM comme contrats intelligents, et les agrégateurs routent chaque échange à travers les carnets natifs, les pools natifs et les pools de contrats à la recherche du meilleur prix. Tu n’as pas besoin de leurs internals encore — sache simplement que la rivière a à la fois une roche de fond et un port animé construit dessus.

Une question reste ouverte : où les *vrais* dollars et euros entrent et sortent ? C’est le business des ancres — les portes du royaume, et le prochain chapitre.`,
    },
  ],
} satisfies JourneyConceptText;
