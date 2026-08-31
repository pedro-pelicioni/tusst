import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Aux frontières du protocole",
  tagline: "CAP, SEP et versions nommées : chevaucher un protocole vivant.",
  steps: [
    {
      kind: "theory",
      body: `## Un protocole qui évolue

Tout ce que tu as étudié — SCP, path payments, Soroban, fonctions hôtes ZK — est arrivé dans des **versions numérotées du protocole**, et d'autres continuent d'arriver.

Les mises à niveau de Stellar ne sont pas des hard forks chaotiques. **Les validateurs votent** : lorsque suffisamment de membres du réseau s'accordent, la mise à niveau s'active à un ledger choisi et tous les nœuds avancent **ensemble**. Un seul réseau avant, un seul réseau après.

SCP remplit ainsi deux fonctions : le consensus qui s'accorde sur les transactions s'accorde aussi sur *les règles elles-mêmes*. Une blockchain est un logiciel ; celle-ci publie ses versions en le sachant.`,
    },
    {
      kind: "theory",
      body: `## Deux courants de changement : les CAPs et les SEPs

Le changement passe par deux canaux, et cette distinction mérite d'être retenue :

- Les **CAPs** — *Core Advancement Proposals* — modifient le **protocole lui-même** : consensus, règles du ledger, nouvelles fonctions hôtes et mécanismes de frais. Elles nécessitent le vote des validateurs, car chaque nœud doit les exécuter à l'identique.
- Les **SEPs** — *Stellar Ecosystem Proposals* — définissent les standards **autour** de la chaîne : parcours entre wallets et anchors, interfaces de tokens et stellar.toml. Elles sont adoptées par leur mise en œuvre, pas par un vote.

La loi de la chaîne face aux usages du commerce. La CAP-59 t'a apporté les courbes ZK ; la SEP-24, les parcours de dépôt. Deux courants différents, tous deux publics et façonnés par des discussions ouvertes.`,
    },
    {
      kind: "diagram",
      body: "Comment un changement atteint le registre sur lequel vous construisez :",
      caption: "Personne ne met à jour votre code à votre place — mais personne ne change non plus les règles sous vos pieds du jour au lendemain.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "draft",
            label: "un CAP est rédigé",
            note: "N'importe qui peut en écrire un. Il plaide pour un changement du protocole lui-même.",
            tone: "neutral",
          },
          {
            id: "review",
            label: "revue à ciel ouvert",
            note: "Discuté, révisé, et souvent rejeté. C'est la partie lente, délibérément.",
            tone: "accent",
          },
          {
            id: "vote",
            label: "les validateurs votent",
            note: "Le réseau ne se met à jour que si assez de validateurs acceptent de l'exécuter.",
            tone: "teal",
          },
          {
            id: "you",
            label: "à vous",
            note: "Montez le SDK, rejouez vos tests, redéployez. La date est publique des mois à l'avance.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Tu veux (a) une nouvelle fonction hôte dans le protocole et (b) un nouveau parcours entre un wallet et un anchor. Quels documents dois-tu rédiger ?`,
      options: [
        "(a) une CAP, car elle modifie le cœur ; (b) une SEP, car il s'agit d'un standard de l'écosystème",
        "(a) une SEP, car les fonctions hôtes relèvent de l'écosystème ; (b) une CAP, car les anchors font partie du cœur",
        "Deux CAPs : les SEPs ne servent qu'à référencer des tokens",
      ],
      answer: 0,
      explain: `Voici le critère : chaque validateur doit-il l'exécuter à l'identique ? Alors cela relève du cœur et nécessite une CAP. S'il s'agit d'une convention que des services adoptent via HTTP, c'est une SEP.`,
    },
    {
      kind: "theory",
      body: `## Le rythme récent, avec des noms

Les mises à niveau portent désormais des noms, et le rythme est soutenu :

- **Protocol 26 "Yardstick"** — une version axée sur la précision et la fiabilité ; avec Protocol 25, elle a complété la boîte à outils ZK BN254 + Poseidon du chapitre précédent.
- **Protocol 27 "Zipper"** — arrivé sur mainnet en **juillet 2026**, avec la délégation d'authentification de la **CAP-71** pour les smart accounts.
- **Protocol 28 "Adapter"** — **testnet a été mis à niveau le 27 août 2026** ; le passage de mainnet est prévu pour le **16 septembre 2026**.

Environ une saison les sépare ; chacune a un nom et s'accompagne de guides de mise à niveau. Le royaume ne dérive pas vers l'avenir : il avance selon un calendrier publié.`,
    },
    {
      kind: "theory",
      body: `## Ce qu'une mise à niveau exige de toi

Une version du protocole est aussi une **version des outils**. Les versions majeures des SDK suivent celles du protocole : **js-stellar-sdk v17.0.0 est la version destinée à Protocol 28**. Quand le réseau passe à 28, tu adoptes le SDK conçu pour lui.

La routine à suivre :

1. Lis le **guide de mise à niveau** dès l'annonce de la version.
2. Mets à jour les SDK et le CLI dans une branche.
3. **Teste sur testnet pendant cette période** : testnet est mis à niveau plusieurs semaines avant mainnet précisément pour t'en laisser le temps.

Fin août 2026, cette période est **ouverte en ce moment même** : testnet exécute déjà 28 ; mainnet suivra le 16 septembre.`,
    },
    {
      kind: "quiz",
      question: `Nous sommes début septembre 2026 et ton application fonctionne sur mainnet (Protocol 27). Quelle est la démarche professionnelle ?`,
      options: [
        "Pointer l'environnement de staging vers testnet — déjà sous Protocol 28 —, passer au SDK v17 et corriger les problèmes avant la mise à niveau de mainnet le 16 septembre",
        "Ne rien faire : les mises à niveau de mainnet restent toujours entièrement compatibles avec les anciens SDK",
        "Geler tous les déploiements jusqu'à ce que le protocole soit stable depuis un an",
      ],
      answer: 0,
      explain: `La période pendant laquelle testnet passe en premier existe précisément pour cette répétition. La plupart des mises à niveau se déroulent sans heurt, mais si l'annonce de Protocol 28 précise que « les développeurs doivent mettre à jour leurs SDK », ce n'est pas sans raison.`,
    },
    {
      kind: "fill",
      prompt: `Épingle la version du SDK compatible avec Protocol 28.`,
      file: "package.json",
      before: `"@stellar/stellar-sdk": "`,
      after: `"`,
      choices: ["^17.0.0", "^16.2.0", "^28.0.0", "^2.8.0"],
      answer: 0,
      explain: `Les versions majeures suivent les protocoles, mais leurs numéros diffèrent : v17 est la version destinée à Protocol 28 (v17.0.1 est sortie le 25 août 2026), tandis que les versions majeures précédentes ciblent des protocoles antérieurs. Le titre de chaque version indique avec quelle version du réseau un SDK sait communiquer.`,
    },
    {
      kind: "theory",
      body: `## Surveiller la frontière

Suivre un protocole vivant est une habitude de lecture, pas un exploit héroïque :

- Le **blog développeurs de stellar.org** : annonces de mises à niveau, dates et guides expliquant ce que les équipes doivent faire.
- Le **dépôt des CAPs sur GitHub** : les propositions y apparaissent longtemps avant leur sortie ; le brouillon d'aujourd'hui sera peut-être la fonction hôte de l'année prochaine.
- Les **réunions ouvertes du protocole**, où les CAPs sont débattues en public.

Une demi-heure par mois suffit pour garder une longueur d'avance sur toutes les échéances de ce chapitre. Qui lit les notes de mise à niveau prend la vague ; qui les ignore se laisse distancer par les versions.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-protocol-27-1",
      body: `L'**Acte VIII** de la Campagne met ce chapitre en pratique : tu fais traverser une mise à niveau de protocole à un projet fonctionnel, en mettant à jour les SDK, en lisant les notes de version et en testant la nouvelle version comme le ferait une équipe professionnelle.

Le royaume est désormais cartographié : du consensus aux contrats, des portes aux voiles, d'une frontière à l'autre. Il reste la meilleure partie : **y construire quelque chose**. La Forge est ouverte.`,
    },
  ],
  testOut: [
    { question: `Qu'est-ce qu'un CAP, et en quoi diffère-t-il d'un SEP ?`,
      options: ["Un CAP modifie le protocole lui-même et sort dans une version numérotée ; un SEP normalise la façon dont les services se parlent et n'exige aucun changement de protocole","Un CAP est un brouillon et un SEP sa forme ratifiée","Un CAP régit les contrats et un SEP les opérations classiques"], answer: 0 },
    { question: `Pourquoi importe-t-il que les mises à jour du protocole soient numérotées et nommées ?`,
      options: ["Une fonctionnalité existe à partir d'une version précise : « Stellar prend-il cela en charge ? » signifie en réalité « sur quel protocole tourne ce réseau ? »","La numérotation fixe l'ordre dans lequel les validateurs appliquent les changements","Les versions nommées sont les seules que la SDF prend en charge en production"], answer: 0 },
    { question: `Une fonctionnalité est active sur testnet mais pas encore sur mainnet. Que vous dit cela ?`,
      options: ["La version du protocole a atteint testnet d'abord — développer dessus est acceptable, y amener de vrais utilisateurs non, tant que mainnet n'a pas suivi","La fonctionnalité a été rejetée et testnet est l'endroit où on la retire","Rien ; testnet et mainnet tournent toujours le même protocole"], answer: 0 },
    { question: `Pourquoi lire le journal des changements du protocole plutôt que la seule documentation ?`,
      options: ["La documentation décrit ce qui est vrai maintenant ; le journal est l'endroit où l'on voit ce qui va l'être, assez tôt pour s'y préparer","La documentation est souvent périmée et le journal la remplace","Le journal contient la seule référence d'API faisant autorité"], answer: 0 },
  ],
} satisfies JourneyConceptText;
