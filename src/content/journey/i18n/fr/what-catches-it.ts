import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Ce Qui le Rattrape",
  tagline: "Moindre privilège et chemins d'échec : chaque outil est un rayon de souffle.",
  steps: [
    {
      kind: "theory",
      body: `## Moindre privilège : moins de dents, s’il te plaît

Un golem avec \`rm -rf\` disponible est un golem qui l’exécutera *à terme* — pas par malveillance, mais par un plan erroné confiant à 2 h du matin. Le remède est ancien et éprouvé : **moindre privilège**.

- Accorde des outils pour *cette tâche*, pas des outils en général.
- Privilégie l’accès **lecture‑seule** partout où l’écriture n’est pas la mission.
- Limite-le à un répertoire ; exécute chaque commande dans un bac à sable.
- Donne‑lui **les clés testnet uniquement** — jamais une clé dont la perte te ferait réellement mal.

Les incidents commencent souvent par un pouvoir accordé « au cas où ». Chaque outil élargit le rayon d'impact ; accorde-le en conséquence.`,
    },
    { kind: "widget", component: "blast-radius",
      body: `Deux jauges, et elles n'avancent pas ensemble. **Accordez au golem ce dont une tâche corriger-et-prouver a besoin**, puis continuez d'ajouter — et regardez laquelle des deux répond.` },
    {
      kind: "fill",
      prompt: `Limite le pouvoir du golem avant qu’il ne commence le travail :`,
      file: "harness.toml",
      before: `signing_keys = "`,
      after: `"`,
      choices: ["testnet", "mainnet", "all-networks", "treasury"],
      answer: 0,
      explain: `La règle empirique : un golem ne possède que les clés dont la perte totale peut être ignorée. Les lumens testnet sont gratuits grâce à friendbot ; une clé mainnet ou trésorerie dans une boucle automatisée est un incident avec un compte à rebours.`,
    },
    { kind: "theory", body: `## Le droit que personne ne se souvient d'avoir donné

Trop accorder est rarement une décision. C'est un mardi après-midi.

Le golem doit vérifier un solde, on lui ouvre donc le réseau — étroitement, pour cela. Une semaine plus tard il doit installer une dépendance, le réseau reste donc ouvert. Quelqu'un débogue un souci de mainnet et dépose une vraie clé dans l'environnement « juste pour cette exécution », et personne ne la retire, car la retirer est une tâche et rien n'est cassé pour l'instant.

Revenez maintenant à la question à laquelle le harnais sert de réponse : *quand ceci a tort, qu'est-ce qui le rattrape ?* Réseau ouvert plus vraie clé plus plan sûr de lui et faux n'est pas un profil de risque hypothétique. Ce sont trois mardis ordinaires, empilés.

L'audit est bon marché et personne ne le fait : **listez ce que le golem détient aujourd'hui et, pour chaque élément, nommez la tâche qui l'a exigé.** Tout ce qui reste sans nom dans cette colonne est un droit que personne ne se souvient d'avoir donné.` },
    { kind: "quiz",
      question: `Vous ajoutez un réseau ouvert et l'écriture n'importe où à un golem qui lit déjà le dépôt, lance les tests, écrit dans un répertoire et détient des clés de testnet. Qu'ont acheté ces deux droits ?`,
      options: [
        "Presque aucune capacité nouvelle, et un bond important du rayon de souffle",
        "Un bond important des deux — c'est l'échange que vous avez accepté",
        "Surtout de la capacité, l'accès réseau débloquant presque toute tâche",
      ],
      answer: 0,
      explain: `Voici la forme à intérioriser : la capacité sature tôt, le rayon de souffle non. Les premiers droits font presque tout le travail utile, ce qui signifie que ceux ajoutés « au cas où » sont presque toujours de l'exposition pure. Accordez pour la tâche que vous avez devant vous, pas pour celle que vous pourriez imaginer plus tard.` },
    {
      kind: "theory",
      body: `## Concevoir le chemin de l’échec

Les amateurs conçoivent ce qui se passe lorsque le golem a raison. Les ingénieurs conçoivent ce qui se passe lorsqu’il a **tort** — parce que cela arrivera.

- Une vérification qui échoue **bloque la fusion** ; elle ne se contente pas de consigner un avertissement ignoré.
- Les tentatives ont un **budget**, donc un golem bloqué devient un golem arrêté, pas une facture.
- Un humain examine **un diff avec contexte**, jamais un fait accompli déjà en production.
- Le retour arrière suit une procédure testée, pas une prière.

À chaque étape du harnais, pose-toi cette question : *« si le résultat est faux, qu'est-ce qui le détecte ? »* Si la réponse est « espérons qu'aucun problème ne survienne », tu as formulé un vœu, pas conçu un système.`,
    },
    { kind: "diagram",
      body: "Un souhait et un chemin conçu, côte à côte :",
      caption: "Les deux ressemblent à de la prudence en revue de code. Un seul fait quelque chose le jour où cela compte.",
      view: { kind: "compare",
        columns: [{ id: "wish", label: "un souhait", tone: "bad" }, { id: "designed", label: "un chemin conçu", tone: "good" }],
        rows: [
          { label: "ce que c'est", cells: [{ text: "« sois prudent et revérifie »", tone: "bad" }, { text: "une suite au rouge qui bloque la fusion", tone: "good" }] },
          { label: "quand le golem a tort", cells: [{ text: "il continue, sûr de lui", tone: "bad" }, { text: "il s'arrête au fil-piège", tone: "good" }] },
          { label: "qui l'apprend", cells: [{ text: "celui qui tombe sur le bug", tone: "bad" }, { text: "un humain, avec le diff et l'échec", tone: "good" }] },
          { label: "quand", cells: [{ text: "en production, plus tard", tone: "bad" }, { text: "avant toute fusion", tone: "good" }] },
        ] } },
    {
      kind: "quiz",
      question: `Lequel de ces éléments est un chemin d’échec **conçu** ?`,
      options: [
        "Un ensemble de tests rouge bloque l’auto‑fusion, et un humain reçoit le diff plus la sortie échouée",
        "Le prompt instruit fermement le golem à être extrêmement prudent et à tout vérifier",
        "La boucle réessaie la même tâche, sans limite, jusqu’à ce que la sortie passe enfin",
      ],
      answer: 0,
      explain: `Les instructions expriment une intention — elles sont utiles, mais ne *détectent* aucun échec. Des tentatives illimitées produisent une facture sans plafond (un prochain chapitre présentera la solution). Un chemin d'échec bien conçu comporte un mécanisme de détection, un arrêt et un humain disposant d'assez de contexte pour agir.`,
    },
    { kind: "theory", body: `## Vous étiez dedans depuis le début

Regardez autour de vous : **TUSST est un harnais.**

Le lanceur noté de la Forge est un harnais de vérification — votre solution s'exécute dans un bac à sable, des épreuves cachées la jugent, et aucune prose assurée ne transforme un rouge en vert. Les laboratoires on-chain vont plus loin : ils ne demandent pas *si vous dites* avoir déployé — ils **lisent la chaîne** et vérifient.

Voilà la discipline en une image : construisez l'établi de sorte qu'avoir tort soit *détectable* et avoir raison soit *démontrable* — pour les golems comme pour les humains.

**Ensuite :** les mots eux-mêmes — ce que le golem voit réellement sur l'établi.` },
  ],
  testOut: [
    { question: `Pourquoi donner des clés de testnet plutôt que de mainnet à une boucle automatisée ?`,
      options: ["Un golem ne doit détenir que des clés dont la perte totale vous laisse indifférent — les lumens du friendbot sont gratuits, une clé de trésorerie est un incident à retardement","Les SDK refusent les clés mainnet en contexte automatisé","Les transactions de testnet sont plus rapides, la boucle itère donc plus tôt"], answer: 0 },
    { question: `Lequel de ceux-ci est un chemin d'échec conçu ?`,
      options: ["Une suite au rouge bloque la fusion automatique, et un humain reçoit le diff plus la sortie de l'échec","Le prompt enjoint fermement au golem d'être prudent et de tout revérifier","La boucle réessaie la même tâche sans limite jusqu'à ce que quelque chose passe"], answer: 0 },
    { question: `Quelle est l'unique question à poser à chaque étape d'un harnais ?`,
      options: ["Quand ceci a tort, qu'est-ce qui le rattrape ?","À quelle fréquence cette étape échoue-t-elle en pratique ?","Cette étape peut-elle être plus rapide ou moins coûteuse ?"], answer: 0 },
    { question: `Vous accordez au golem un réseau ouvert et le droit d'écrire n'importe où. Qu'est-ce que cela a acheté ?`,
      options: ["Presque aucune capacité de plus, et beaucoup de rayon de souffle — la forme classique du droit accordé « au cas où »","Des gains à peu près proportionnels en capacité et en risque","Plus de capacité que de risque, la plupart des tâches finissant par avoir besoin des deux"], answer: 0 },
  ],
};
