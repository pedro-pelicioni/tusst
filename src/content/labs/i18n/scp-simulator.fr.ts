import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "SCP : Le Conseil des Nœuds",
    tagline: "Construis des quorums, observe la convergence du consensus, brise‑le intentionnellement.",
  },
  steps: {
    "intro": {
      body: `## Le conseil décide

Pas de minage. Pas de staking. Stellar ferme un grand livre toutes les ~5 secondes parce que ses validateurs exécutent le **Stellar Consensus Protocol** : chaque nœud nomme un petit **conseil** (son *quorum slice*) et avance quand suffisamment de membres de ce conseil avancent.

Devant toi se trouve un mini‑réseau — sept validateurs répartis sur trois organisations. Tu vas les faire s’accorder… puis briser cet accord.`,
    },
    "sim-first-close": {
      body: `### Première étape : fais-les s’accorder

Clique sur **Proposer un grand livre** et regarde l’acceptation se répandre, conseil par conseil, jusqu’à ce que chaque siège s’allume — c’est la clôture d’un grand livre.

Ferme-en quelques‑uns. Ressens le rythme.`,
    },
    "quiz-local": {
      question: `Tu as vu l’acceptation se propager nœud par nœud. Qu’est‑ce qui fait que chaque nœud s’allume ?`,
      options: [
        "Il suffisait que suffisamment de son propre conseil l’ait déjà accepté",
        "Il a reçu la permission d’un coordinateur central",
        "Il a gagné à une loterie aléatoire pondérée par la mise",
      ],
      explain: `Tout local : un nœud n’a pas besoin du recensement du réseau, juste de son conseil. Les conseils qui se chevauchent transforment la confiance locale en accord global.`,
    },
    "sim-break-it": {
      body: `### Maintenant : brise‑le

Désactive un nœud et propose un ledger : le réseau ne bronche pas. Désactive-en davantage, concentrés dans une même région de confiance, et trouve le moment où les survivants **s’arrêtent**.

Remarque ce qu’ils *ne* font pas : ils ne se divisent jamais en deux histoires concurrentes.`,
    },
    "quiz-safety": {
      question: `Tu as désactivé une part suffisante du conseil et les survivants se sont arrêtés au lieu de continuer. Pourquoi est‑ce le comportement *conçu* pour un réseau de paiements ?`,
      options: [
        "Un paiement retardé peut être repris ; un paiement annulé après confirmation ne le peut pas",
        "Le gel économise de l’électricité pendant les pannes",
        "Il donne aux nœuds tombés le temps d’être remplacés par des mineurs",
      ],
      explain: `Sécurité avant vivacité : SCP s’arrête plutôt que de forker. Un paiement confirmé doit le rester ; lorsque l’accord est impossible, Stellar attend.`,
    },
    "quiz-recovery": {
      question: `Tu relèves les nœuds tombés. Que se passe‑t‑il avec les sièges bloqués ?`,
      options: [
        "Leurs conseils peuvent être satisfaits à nouveau — le réseau reprend la clôture des grands livres",
        "Ils doivent re‑télécharger la chaîne depuis le bloc de genèse",
        "Rien ; un réseau bloqué reste bloqué pour toujours",
      ],
      explain: `Teste‑le dans le simulateur : relève les tombés, propose, et le rythme revient. Les blocages sont des pauses, pas des morts.`,
    },
    "claim": {
      body: `Tu as fermé des grands livres, arrêté un réseau puis l’as remis en marche — le cycle complet de l’accord fédéré, en une seule séance. Termine le lab et récupère tes XP.`,
    },
  },
} satisfies LabTextOverlay;
