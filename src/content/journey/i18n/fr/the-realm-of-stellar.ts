import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Le Royaume de Stellar",
  tagline: "Comment des milliers de machines s’accordent sans un roi.",
  steps: [
    {
      kind: "theory",
      body: `## Accord sans roi

Chaque blockchain répond à une seule question : **comment des inconnus s’accordent sur la prochaine page du registre ?**

- Proof‑of‑Work répond avec *électricité* — celui qui brûle le plus, écrit.
- Proof‑of‑Stake répond avec *capital bloqué* — celui qui mise le plus, écrit.
- **Stellar répond avec confiance** : chaque nœud nomme les nœuds qu’il croit, et l’accord se propage à travers ces déclarations. Pas de minage, pas de mise — le **Stellar Consensus Protocol (SCP)**.

Le résultat : les registres se ferment en ~5 s, les frais coûtent des fractions de cent, et le réseau tourne sur des machines qu’une université peut se permettre.`,
    },
    {
      kind: "theory",
      body: `## Tranches de quorum : « mon conseil »

Chaque nœud déclare une **tranche de quorum** — un petit conseil de nœuds qu’il refuse de déplacer sans :

> « J’accepte un registre quand **assez de mon conseil** l’accepte. »

Les conseils se chevauchent : tes membres de conseil ont leurs propres conseils, et ces chaînes de confiance tissent l’ensemble du réseau. Un **quorum** est un ensemble de nœuds qui contient un conseil satisfait *pour chaque membre* — une fois qu’un quorum accepte, le registre se ferme.

Pas de liste globale. Pas de bureau d’admission. La confiance est déclarée localement et devient un accord global — de la même façon que les institutions humaines se fédèrent.`,
    },
    {
      kind: "widget",
      component: "scp-sim",
      body: `## Le Conseil des Nœuds

Sept validateurs, chacun faisant confiance à un petit conseil. **Propose un registre** et regarde l’acceptation se propager à travers les tranches. Puis fais ce que tout bon ingénieur fait à un protocole de consensus : **clique sur les nœuds pour les éliminer** et vois ce que font les survivants.

Essaie de trouver le point où le réseau *s’arrête* — et remarque qu’il s’arrête plutôt que de se diviser.`,
    },
    {
      kind: "quiz",
      question: `Dans le SCP, quand un seul nœud accepte un registre ?`,
      options: [
        "Quand assez de sa propre tranche de quorum l’a accepté",
        "Quand 51 % de tous les nœuds de la Terre l’a accepté",
        "Quand il résout un puzzle cryptographique en premier",
      ],
      answer: 0,
      explain: `Tout est local : un nœud bouge quand son *conseil* bouge. L’accord global émerge des conseils qui se chevauchent — aucun nœud n’a jamais besoin d’un recensement de tout le réseau.`,
    },
    { kind: "theory", body: `## Personne ne vous remet la liste

Voici la partie qui ressemble à un bug la première fois qu'on l'entend : **il n'existe pas de liste officielle des validateurs.** Aucun registre ne décide qui compte. Chaque participant nomme ceux dont il accepte de dépendre, et c'est là tout le processus d'inscription.

D'où l'objection évidente. Si chacun choisit son propre conseil, qu'est-ce qui empêche le réseau de se scinder en deux groupes qui s'accordent en interne et se contredisent entre eux ?

La réponse est le **recouvrement**. Deux participants n'ont la garantie d'aboutir à la même conclusion que si leurs cercles de confiance se croisent suffisamment — et en pratique ils se croisent, parce que chacun finit indépendamment par nommer la même poignée d'institutions bien tenues et publiquement responsables. La sûreté du réseau entier est une propriété émergente d'un grand nombre de choix séparés et intéressés sur qui mérite qu'on dépende de lui.

C'est réellement différent de « le protocole choisit », et la différence coupe des deux côtés. Personne ne peut s'ajouter à une liste pour gagner de l'influence. Et personne ne peut non plus vous remettre une bonne configuration — **choisir mal est une chose que vous avez le droit de faire.** D'où le conseil pratique, ennuyeux et juste, pour qui exploite un validateur : partez d'une configuration publiée et bien analysée, et comprenez tout écart avant de le faire.` },
    {
      kind: "theory",
      body: `## Sécurité avant vivacité

Tu l’as vu dans le simulateur : élimine trop de conseil et le réseau **attend**. Il ne devine pas. Il ne se divise pas en deux histoires.

C’est un compromis délibéré, et il a un nom :

- **Sécurité** — le réseau ne confirme jamais deux registres contradictoires.
- **Vivacité** — le réseau continue de confirmer *quelque chose*.

Quand il faut choisir, le SCP **s’arrête plutôt que de bifurquer**. Pour un réseau qui déplace de l’argent — salaires, transferts, trésoreries — un paiement suspendu vaut mieux qu’un paiement qui se *défait* plus tard.`,
    },
    {
      kind: "diagram",
      body: "Deux façons pour un réseau d'échouer — une seule vous reprend votre argent :",
      caption: "La sûreté avant la vivacité : SCP préfère se bloquer que se contredire.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "fork",
            label: "réseaux qui bifurquent",
            tone: "bad",
          },
          {
            id: "scp",
            label: "Stellar",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "quand l'accord échoue",
            cells: [
              {
                text: "deux histoires continuent côte à côte",
                tone: "bad",
              },
              {
                text: "le registre cesse simplement de se fermer",
                tone: "good",
              },
            ],
          },
          {
            label: "ce que vous attendez",
            cells: [
              {
                text: "assez de confirmations pour être probablement en sécurité",
                tone: "bad",
              },
              {
                text: "rien — un registre fermé est définitif",
                tone: "good",
              },
            ],
          },
          {
            label: "le pire cas",
            cells: [
              {
                text: "un paiement est annulé des heures plus tard",
                tone: "bad",
              },
              {
                text: "un paiement est retardé",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Un tiers des validateurs de la tranche de quorum de ton nœud passe hors ligne. Que fait ton nœud ?`,
      options: [
        "S’arrête — il refuse de confirmer les registres tant que sa tranche ne peut pas être satisfaite à nouveau",
        "Bifurque et conserve sa propre version de l’historique",
        "Passe au minage jusqu’à ce qu’ils reviennent",
      ],
      answer: 0,
      explain: `S’arrête, pas de bifurcation. Ton nœud attend son conseil ; si le reste du réseau contient encore des quorums fonctionnels, *ils* continuent de fermer les registres et ton nœud rattrape le temps quand son conseil revient.`,
    },
    {
      kind: "theory",
      body: `## Ce que cela offre aux bâtisseurs

Comme l’accord est bon marché, le réseau peut se permettre d’être **rapide et à frais réduits par défaut** :

- Les registres se ferment environ toutes les **5 secondes** — un paiement est *final*, pas « probablement final après 6 blocs ».
- Les frais de base sont **100 stroops** (0,00001 XLM) — le spam est cher à grande échelle, les humains ne le remarquent presque pas.
- La finalité est réelle : une fois dans le registre, il n’y a pas de re‑org à craindre.

Chaque lab de la Forge tourne sur ce rythme — tu l’as déjà senti si tu as vu une transaction se confirmer dans le laboratoire de portefeuille.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `La Campagne Acte VI — **La Porte de la Constellation** — parcourt ce même ciel en pratique : phrases secrètes du réseau, horizons, et tes premières cartes stellaires. Optionnel, et vaut le détour quand tu veux la carte derrière la théorie.`,
    },
  ],
  testOut: [
    { question: `Comment un participant décide-t-il de qui dépend son accord ?`,
      options: ["Il nomme sa propre tranche de quorum — il n'existe pas de liste officielle de validateurs, et l'inscription est ce nommage","Le protocole lui attribue un ensemble selon la mise","La SDF publie l'ensemble faisant autorité à chaque version du protocole"], answer: 0 },
    { question: `Si chacun choisit son conseil, qu'est-ce qui empêche le réseau de se scinder ?`,
      options: ["Le recouvrement — la sûreté tient quand les cercles de confiance se croisent assez, et en pratique ils se croisent car chacun nomme indépendamment les mêmes institutions bien tenues","Une règle de départage appliquée par le protocole en cas de désaccord","Un nombre minimal de validateurs que toute tranche doit contenir"], answer: 0 },
    { question: `SCP privilégie la sûreté sur la vivacité. Qu'est-ce que cela signifie quand le réseau va mal ?`,
      options: ["Il s'arrête plutôt que de risquer deux histoires contradictoires — s'arrêter se rattrape, diverger sur le passé non","Il continue de produire des registres et réconcilie ensuite toute bifurcation","Il élit un leader temporaire pour sortir de l'impasse"], answer: 0 },
    { question: `Qu'apporte concrètement à un constructeur un consensus sans minage ?`,
      options: ["Un registre toutes les quelques secondes, des frais en fractions de centime, et une clôture qui vaut finalité","Un débit supérieur au prix d'une finalité plus lente","Des transactions gratuites, puisqu'il n'y a pas de mineurs à payer"], answer: 0 },
  ],
} satisfies JourneyConceptText;
