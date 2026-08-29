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
} satisfies JourneyConceptText;
