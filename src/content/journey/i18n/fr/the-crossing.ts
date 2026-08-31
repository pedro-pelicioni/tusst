import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Traversée",
  tagline: "Envoyez une monnaie, livrez-en une autre — atomiquement, en une opération.",
  steps: [
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
    { kind: "widget", component: "path-payment",
      body: `**Envoyez un paiement à travers les monnaies** et regardez quelle route le protocole choisit à mesure que le montant grandit — puis exigez plus qu'aucune ne peut livrer, et regardez l'ensemble tout simplement ne pas avoir lieu.` },
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
    { kind: "theory", body: `## La borne, c'est toute la conception

Tout ce qui précède tient à un nombre que vous fournissez : le minimum que vous acceptez, ou le maximum que vous dépensez. Les deux façons de se tromper sont silencieuses.

**Trop serré** et vos paiements cessent simplement d'avoir lieu. Sans bruit — un path payment qui ne peut pas satisfaire sa borne s'annule, ce qui ressemble exactement à un paiement que personne n'a envoyé. Quelque part une file se remplit de virements « qui ne sont pas passés », et la cause est une tolérance que quelqu'un a fixée une fois sans jamais y revenir.

**Trop lâche** et vous avez signé un chèque en blanc à ce que la route coûtera à l'instant où votre enveloppe atterrira. Le protocole honorera un prix désastreux avec la même fidélité qu'un bon ; la borne était la seule chose qui disait non.

L'habitude qui marche n'est pas astucieuse, elle est disciplinée : **cotez d'abord, puis fixez la borne à partir de cette cotation, plus une tolérance choisie exprès.** Une borne recopiée d'un exemple, ou laissée à un chiffre rond parce qu'il paraissait raisonnable, est un nombre dont personne n'est responsable — et c'est lui qui décide si vos utilisateurs sont payés.` },
    { kind: "theory", body: `## La propriété qui rend la chose utilisable

Chaque partie de ceci pouvait mal tourner. La route pouvait être mince, le prix pouvait bouger entre l'instant de la signature et celui de l'exécution, un saut pouvait ne pas se remplir.

Et la réponse à tout cela est la même, et c'est elle qui fait du path payment une chose sur laquelle on peut bâtir un métier : **soit le chemin entier s'exécute à la clôture du registre, soit rien du tout ne s'exécute.**

Il n'existe aucun état où vos BRL sont partis, sont devenus des XLM, et se sont arrêtés là. Pas de solde à moitié converti immobilisé dans une monnaie que personne n'a demandée. Pas de ticket de support qui commence par *« l'argent est quelque part au milieu ».*

Ce n'est pas un raffinement. C'est la différence entre un rail de paiement et une expérience scientifique — et c'est pourquoi la borne que vous fixez n'est pas une préférence mais le contrat : *livrez au moins ceci, ou ne touchez pas à mes fonds.*` },
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
  testOut: [
    { question: `Que fait \`path_payment_strict_send\` qu'un simple paiement ne peut pas faire ?`,
      options: ["Envoyer un actif et en livrer un autre, en passant par carnets et pools au sein d'une seule opération atomique","Envoyer vers plusieurs destinations à la fois","Programmer un paiement pour un registre futur"], answer: 0 },
    { question: `Une facture fait exactement 900 EURC et votre trésorerie détient des USDC. Quelle opération convient ?`,
      options: ["path_payment_strict_receive — fixez les 900 EURC livrés, plafonnez les USDC dépensés","path_payment_strict_send — envoyez environ 900 USDC et espérez que le taux tombe juste","Deux transactions : échanger sur le DEX, puis un paiement simple"], answer: 0 },
    { question: `Aucune route ne peut livrer dans la borne que vous avez fixée. Qu'arrive-t-il à vos fonds ?`,
      options: ["Absolument rien — le chemin entier s'exécute ou rien ne s'exécute, donc aucun solde à moitié converti nulle part","Ils se convertissent jusqu'où la route est allée, et le reste revient au registre suivant","Ils sont retenus par le protocole jusqu'à l'ouverture d'une route"], answer: 0 },
    { question: `Pourquoi une application ne devrait-elle pas coder en dur la route d'un paiement ?`,
      options: ["La meilleure route dépend du montant — le carnet le plus mince affiche souvent le meilleur taux et s'effondre sous la taille","Les routes sont privées et ne peuvent pas être inspectées avant l'envoi","Le protocole facture davantage une route que vous avez spécifiée vous-même"], answer: 0 },
  ],
};
