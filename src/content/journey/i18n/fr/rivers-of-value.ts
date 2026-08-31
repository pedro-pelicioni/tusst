import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Rivières de Valeur",
  tagline: "Un bureau de change qui vit dans le protocole lui-même.",
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
    { kind: "theory", body: `## Le même ordre, deux lieux

Carnets et pools ne sont pas des rivaux avec un vainqueur. Ils échouent dans des directions opposées, et le registre porte les deux exprès.

Disons que vous voulez 5 000 USDC de XLM.

**Le carnet d'ordres** vous remplit contre ce que les gens ont réellement affiché. Si un teneur de marché cote serré, vous obtenez un prix que personne ne battrait — de vraies offres, de vrais prix, aucune courbe. Si personne ne regarde cette paire ce matin, le carnet est mince ou vide, et vous êtes mal rempli, ou pas du tout. La qualité d'un carnet, c'est l'attention de quelqu'un.

**Le pool** cote toujours. Il n'a ni opinion, ni horaires, ni jour de congé — la courbe tarifie votre ordre que quelqu'un soit éveillé ou non. Ce qu'il facture pour cette fiabilité, c'est le slippage : vous payez le privilège de pouvoir échanger à trois heures du matin contre personne.

Le résumé honnête est donc ennuyeux : **le carnet est meilleur quand quelqu'un s'en occupe, et le pool est meilleur quand personne ne s'en occupe.** C'est précisément pour cela que les agrégateurs existent, et pourquoi vous ne devriez pas choisir le lieu à la main.` },
    { kind: "widget", component: "amm-pool",
      body: `La courbe se ressent mieux qu'elle ne se lit. **Vendez dans le pool** — puis portez le même ordre dans un pool moins profond et regardez ce que le prix vous fait.` },
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
    { kind: "fill",
      prompt: `Complétez ce qu'un pool à produit constant promet réellement :`,
      file: "NOTES.md",
      before: `Un pool vous cotera toujours un prix. Ce qu'il ne promet pas, c'est que le prix reste immobile — plus votre ordre est gros face au pool, `,
      after: ` .`,
      choices: ["plus le prix que vous finissez par payer est mauvais", "plus les frais qu'on vous prend sont bas", "plus l'échange met de temps à se régler", "plus l'ordre risque d'être refusé"],
      answer: 0,
      explain: `Le pool ne peut ni s'épuiser ni vous refuser — c'est tout l'intérêt de la courbe. Ce qu'il fait à la place, c'est vous facturer davantage chaque unité à mesure que vous videz un côté : un gros ordre dans un petit pool s'exécute parfaitement, et cher.` },
    { kind: "theory", body: `## Vous ne ferez jamais cela à la main

Vous savez maintenant qu'il y a un marché dans le registre : des carnets qui s'apparient à la clôture, des pools qui cotent depuis une courbe, et un prix qui bouge quand vous vous appuyez dessus.

Et voici ce qui rend tout cela utile : **vous n'interagirez presque jamais directement avec quoi que ce soit de tout ça.** Vous ne placerez pas d'offre, ne parcourrez pas le carnet, ne choisirez pas de pool. Vous énoncerez ce que vous envoyez et ce qui doit arriver — et autre chose fera les courses.

**Ensuite :** l'opération qui dépense toute cette machinerie en votre nom, en une seule étape atomique.` },
  ],
  testOut: [
    { question: `Qui apparie une offre d'achat et une offre de vente sur le DEX Stellar ?`,
      options: ["Le protocole lui-même, à la clôture du registre — les offres sont des entrées du registre et l'appariement fait partie du consensus","Un contrat moteur d'appariement maintenu par la SDF","Des relais hors chaîne qui soumettent les paires appariées contre une commission"], answer: 0 },
    { question: `Que faut-il pour créer un marché pour une nouvelle paire d'actifs sur le DEX ?`,
      options: ["Deux trustlines et une offre — chaque paire obtient un carnet automatiquement, sans cotation ni permission","Une demande auprès de la SDF, qui sélectionne les paires échangeables","Déployer un contrat de marché pour cette paire"], answer: 0 },
    { question: `Un carnet d'ordres a besoin de traders actifs qui cotent. De quoi un pool de liquidité a-t-il besoin à la place ?`,
      options: ["De dépôts seulement — la courbe à produit constant cote un prix à chaque instant sans que personne ne surveille","D'un bot teneur de marché, que le pool rémunère sur les frais","D'un oracle qui lui fournit le prix externe courant"], answer: 0 },
    { question: `Votre ordre est gros face au pool. Que se passe-t-il ?`,
      options: ["Il s'exécute, à un prix de plus en plus mauvais — la courbe facture davantage chaque unité à mesure que vous videz un côté","Il est refusé, car le pool ne peut pas le couvrir","Il est mis en file jusqu'à ce qu'assez de liquidité soit déposée"], answer: 0 },
  ],
};
