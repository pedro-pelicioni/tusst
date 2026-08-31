import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Le Battement et la Facture",
  tagline: "L'état se loue, et un appel se mesure — il ne s'enchérit pas.",
  steps: [
    {
      kind: "theory",
      body: `## L’état a un battement de cœur

La plupart des chaînes laissent l’état s’accumuler à l’infini — chaque nœud traîne chaque entrée abandonnée depuis 2019. Stellar refuse : **chaque entrée Soroban a un TTL** (time‑to‑live), compté en registres, et le loyer l’étend.

Quand le TTL expire :

- **Temporaire** : les entrées sont supprimées. Disparues.
- **Persistant** et **instance** : elles sont **archivées** — évincées du registre actif, mais rétablissables plus tard avec une preuve, revenant exactement comme avant.

C’est l’**archivage d’état**, et aucune autre grande chaîne ne le fait. Le registre actif reste léger, les validateurs restent bon marché, l’historique reste récupérable.`,
    },
    { kind: "widget", component: "state-archival",
      body: `Les trois étagères se ressemblent tant que l'horloge tourne. **Laissez passer les registres** sur chacune et regardez ce qui arrive à zéro — cet instant est toute la différence entre elles.` },
    { kind: "theory", body: `## Un contrat, trois étagères

Les étagères abstraites deviennent une décision de conception dès qu'on a des données réelles. Prenez un simple contrat de séquestre :

- **L'adresse de l'administrateur et le taux de frais** vont sur le stockage **d'instance**. Ils appartiennent au contrat lui-même, sont lus à presque chaque appel, et si le contrat est archivé ils doivent partir avec lui — il n'y a rien à sauver d'un taux dont le contrat n'existe plus.
- **Chaque séquestre ouvert** va sur le stockage **persistant**. Il y a l'argent de quelqu'un dedans. Si son TTL expire, l'entrée doit rester récupérable, car « on a oublié » n'est pas une réponse acceptable à « où est mon argent ».
- **Une cotation éphémère** que l'appelant consulte avant de s'engager va sur le stockage **temporaire**. Elle ne vaut plus rien dans dix minutes et personne ne devrait payer de loyer pour la garder.

Remarquez la question qui a tranché chaque cas. Pas « à quel point est-ce important ? » — le taux de frais est critique et va pourtant sur l'instance. La question est : **que devrait-il advenir de ceci si personne n'y touche pendant longtemps ?** Le garder avec le contrat, le garder récupérable, ou le laisser partir.

Inverser cela produit une défaillance silencieuse. Des entrées de séquestre en stockage temporaire ne lèvent aucune erreur le jour où on les écrit. Elles fonctionnent parfaitement, pendant des mois.` },
    {
      kind: "quiz",
      question: `Ton contrat suit le solde de chaque utilisateur. Quel niveau de stockage choisirais‑tu ?`,
      options: [
        "Persistant — les soldes doivent survivre à tout laps de TTL et être rétablis depuis l’archive",
        "Temporaire — c’est le moins cher, et les utilisateurs peuvent redéposer si ça expire",
        "Instance — les soldes appartiennent au contrat, donc ils voyagent avec lui",
      ],
      answer: 0,
      explain: `La suppression du stockage temporaire est *définitive* : perdre un solde de cette manière revient à provoquer un rug pull par négligence. Le stockage d’instance est chargé à chaque appel ; y placer les données de chaque utilisateur fait donc payer tout le monde.`,
    },
    {
      kind: "fill",
      prompt: `Place le solde sur la bonne étagère.`,
      file: "token/src/lib.rs",
      before: `env.storage().`,
      after: `().set(&user, &balance);`,
      choices: ["persistent", "temporary", "instance", "eternal"],
      answer: 0,
      explain: `Le soroban-sdk expose directement les trois niveaux : \`env.storage().persistent()\`, \`.temporary()\` et \`.instance()\`. Il n’existe pas de niveau \`eternal\` : c’est précisément le principe du système de loyer.`,
    },
    {
      kind: "theory",
      body: `## Des frais mesurés, pas enchéris

Sur les chaînes où le gas se négocie aux enchères, tu dois surenchérir pour obtenir de l'espace dans un bloc et espérer que tout se passe bien ; une seule opération très demandée peut faire grimper les coûts pour tous.

Soroban **mesure** à la place. Une transaction déclare ses **ressources** — instructions CPU, mémoire, lectures/écritures de registre, octets — et les frais sont *calculés* à partir de ces besoins mesurés, plus le loyer pour le stockage touché. Déclare honnêtement (la simulation le fait pour toi) et la partie remboursable de tout excès revient.

Le résultat est un coût que tu peux citer à l’avance : « cette action coûte environ un cent » reste vrai même quand le réseau est occupé.`,
    },
    {
      kind: "theory",
      body: `## Simule d’abord, signe exactement ce que tu as simulé

Chaque client Soroban suit un même rythme :

1. **Simule** l’appel contre un nœud RPC — pas de signature, pas de coût.
2. La simulation renvoie l'**empreinte** — les entrées du registre que l’appel va lire ou écrire — ainsi que l'estimation des ressources et les autorisations nécessaires.
3. Tu **signes exactement ce que tu as simulé**, puis tu soumets la transaction.

La transaction signée porte son empreinte, donc les validateurs connaissent son univers complet avant de l’exécuter ; rien en dehors de l’empreinte ne peut être touché. Saute la simulation et tu devines des nombres que le réseau rejettera simplement.`,
    },
    {
      kind: "quiz",
      question: `Pourquoi le flux Soroban simule avant de signer ?`,
      options: [
        "La simulation calcule l’empreinte et les besoins en ressources, donc tu signes une transaction avec des bornes exactes et imposables",
        "C’est un dry‑run de courtoisie pour le débogage — les apps de production le sautent",
        "La simulation pré‑exécute l’appel pour que les validateurs n’aient pas à le faire à nouveau",
      ],
      answer: 0,
      explain: `Les validateurs ré‑exécutent toujours — mais uniquement dans l’empreinte déclarée. La simulation est le moyen pour une transaction d’apprendre ses propres bornes ; le registre les applique ensuite à la lettre.`,
    },
  ],
  testOut: [
    { question: `Le TTL d'une entrée temporaire atteint zéro. Qu'advient-il de la donnée ?`,
      options: ["Elle est supprimée — il n'existe aucune restauration pour le stockage temporaire, à aucun prix","Elle est archivée et peut être restaurée moyennant des frais, comme toute autre entrée","Elle est conservée mais passe en lecture seule jusqu'à prolongation"], answer: 0 },
    { question: `Le TTL d'une entrée persistante atteint zéro. Que se passe-t-il ?`,
      options: ["Elle est archivée, pas supprimée — les appels qui en ont besoin échouent jusqu'à restauration, et restaurer coûte des frais","Elle est supprimée, comme une entrée temporaire","Le contrat est mis en pause jusqu'à réécriture de l'entrée"], answer: 0 },
    { question: `Pourquoi le protocole facture-t-il un loyer sur l'état ?`,
      options: ["Parce que l'état coûte du stockage à chaque validateur pour toujours : des frais d'écriture uniques laisseraient n'importe qui imposer un coût continu illimité","Pour décourager les contrats de stocker quoi que ce soit on-chain","Pour financer l'exploitation des validateurs, payée par les frais d'archivage"], answer: 0 },
    { question: `À quoi sert de simuler un appel de contrat avant de le signer ?`,
      options: ["La simulation renvoie les ressources et l'empreinte exactes dont l'appel a besoin, et vous signez cela — les frais sont mesurés plutôt que devinés","Elle analyse la source du contrat à la recherche de vulnérabilités connues","Elle réserve une place dans le prochain registre pour que l'appel ne soit pas évincé"], answer: 0 },
  ],
};
