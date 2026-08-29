import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Rivières de Valeur",
  tagline: "Paiements, paiements par chemin, le DEX et les AMM.",
  steps: [
    {
      kind: "theory",
      body: `## Rivières, pas de coffres

Tu as déjà décortiqué un simple \`payment\` : un actif, A vers B, final en ~5 secondes. C’est un canal — droit, utile, ennuyeux.

Mais le registre Stellar n’est pas qu'un coffre contenant des soldes. Il intègre un **marché de change complet directement dans le protocole** : carnets d’ordres, pools de liquidité et opérations de paiement capables d'effectuer une conversion *en cours de route*.

Pas d’échange externe, pas de pont, pas de détour enveloppé — la conversion est une puissance native du grand livre. Ce chapitre suit l’eau : d’abord les offres, puis les pools, puis l’opération qui fait que les transferts semblent magiques.`,
    },
    {
      kind: "theory",
      body: `## Un carnet d’ordres *sur* le grand livre

Le **DEX Stellar** n’est pas un contrat que quelqu’un a déployé — c’est la machinerie du protocole.

- \`manage_sell_offer\` / \`manage_buy_offer\` placent une offre : *"Je donne X, je veux Y, à ce prix."*
- Chaque offre est une **entrée du grand livre**, située dans le carnet d’ordres comme tout autre état.
- **L'appariement a lieu à la clôture du registre** : lorsque les offres se croisent, le protocole exécute l’échange dans le cadre du consensus lui-même.

Chaque paire d’actifs dispose automatiquement d'un carnet d’ordres — aucune inscription ni autorisation d'un opérateur de marché. Deux lignes de confiance et une offre suffisent pour *faire* le marché.`,
    },
    {
      kind: "quiz",
      question: `Qui associe une offre d’achat à une offre de vente sur le DEX Stellar ?`,
      options: [
        "Le protocole lui-même, à la clôture du registre — les offres sont des entrées du registre et leur appariement fait partie du consensus",
        "Un contrat intelligent servant de moteur d'appariement et maintenu par la SDF",
        "Des relayers hors chaîne qui soumettent des paires appariées pour une commission",
      ],
      answer: 0,
      explain: `Stellar fait partie des rares réseaux où le marché vit *dans* le protocole. Sans moteur d'appariement déployé séparément, aucun intermédiaire de ce type ne peut être piraté, soudoyé ou manipulé ; les échanges bénéficient de la même finalité que les paiements.`,
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
        "Ils utilisent un appariement interne par carnet d’ordres plutôt qu’une courbe de prix",
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
      kind: "diagram",
      body: "Un paiement, trois monnaies, une transaction atomique :",
      caption: "Si un saut ne se remplit pas au prix fixé, rien ne se passe — aucun argent à moitié converti échoué en chemin.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "send",
            label: "vous envoyez des BRL",
            note: "Vous ne touchez jamais aux monnaies intermédiaires, et ne les détenez jamais.",
            tone: "accent",
          },
          {
            id: "hop1",
            label: "BRL → XLM",
            note: "Le carnet d'ordres remplit ce saut à ce que le marché propose à l'instant.",
            tone: "teal",
          },
          {
            id: "hop2",
            label: "XLM → EURC",
            note: "Et le suivant, au même instant, dans la même transaction.",
            tone: "teal",
          },
          {
            id: "recv",
            label: "il reçoit des EURC",
            note: "Montant garanti, ou tout est annulé. Il n'y a pas d'arrivée partielle.",
            tone: "good",
          },
        ],
      },
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
      explain: `Le routage s'effectue sur le registre de manière atomique : le protocole parcourt les offres et les pools pour trouver un chemin jusqu'à l'actif de destination. Soit tout le chemin s’exécute lors de la clôture du registre, soit rien ne se passe.`,
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

Au-dessus des mécanismes natifs, l’écosystème intègre Soroban : **Soroswap**, **Phoenix** et **Aquarius** exécutent des protocoles AMM sous forme de contrats intelligents, tandis que les agrégateurs recherchent le meilleur prix dans les carnets natifs, les pools natifs et les pools gérés par contrat. Tu n’as pas encore besoin d'en connaître le fonctionnement interne : retiens simplement que la rivière possède à la fois un socle rocheux et un port animé construit au-dessus.

Une question demeure : par où les *véritables* dollars et euros entrent-ils et sortent-ils ? C’est le rôle des ancres — les portes du royaume et le sujet du prochain chapitre.`,
    },
  ],
} satisfies JourneyConceptText;
