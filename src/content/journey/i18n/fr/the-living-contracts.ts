import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Les contrats vivants",
  tagline: "Soroban : Wasm, stockage à durée limitée et frais prévisibles.",
  steps: [
    {
      kind: "theory",
      body: `## Les contrats entrent dans le royaume

**Soroban** est la plateforme de contrats intelligents de Stellar. Un contrat est écrit en **Rust, compilé en WebAssembly**, téléversé sur le registre puis exécuté dans un environnement isolé. Toutes ses capacités — stockage, cryptographie, appel d’autres contrats — passent par les **fonctions hôtes** fournies par le protocole.

Et voici la partie élégante : appeler un contrat ne nécessite aucun nouveau format de transaction. L’enveloppe que tu as décortiquée contient une seule opération — \`invoke_host_function\` — et à l’intérieur se trouve l’appel : quel contrat, quelle fonction, quels arguments.

Même enveloppe, mêmes signatures, même clôture en cinq secondes environ. Le monde classique et celui des contrats partagent le même système circulatoire.`,
    },
    {
      kind: "theory",
      body: `## Trois étagères de stockage

Soroban donne à un contrat trois niveaux de stockage — choisis par entrée, tarifés différemment :

- **Temporaire** — peu coûteux et éphémère, il disparaît définitivement à expiration. Il convient aux devis, aux nonces et aux états limités dans le temps.
- **Persistant** — destiné aux soldes utilisateurs et aux registres de propriété. Il survit à l’expiration grâce à l’*archivage* présenté à l'étape suivante.
- **Instance** — petit état attaché au contrat lui‑même : adresse d’administration, configuration, métadonnées nécessaires à chaque appel.

Choisir la mauvaise étagère est une erreur de débutant coûteuse : un stockage d'instance trop volumineux alourdit chaque appel, tandis qu'un solde placé en stockage temporaire finit tout simplement par disparaître. Le choix de l'étagère fait partie intégrante de la conception.`,
    },
    {
      kind: "diagram",
      body: "Trois étagères, trois durées de vie :",
      caption: "L'état est loué, pas possédé. Un contrat que personne ne touche finit par ne plus payer son loyer et ses données refroidissent.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "instance",
            label: "instance",
            note: "Les réglages du contrat lui-même, qui vivent et meurent avec lui.",
            tone: "gold",
          },
          {
            id: "persistent",
            label: "persistant",
            note: "Soldes des utilisateurs et tout ce qui doit survivre. Archivé si le loyer expire — récupérable, pas perdu.",
            tone: "accent",
          },
          {
            id: "temporary",
            label: "temporaire",
            note: "Bon marché et éphémère, pour ce qui a le droit de disparaître : nonces, sessions, limites de débit.",
            tone: "teal",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## L’état a un battement de cœur

La plupart des chaînes laissent l’état s’accumuler à l’infini — chaque nœud traîne chaque entrée abandonnée depuis 2019. Stellar refuse : **chaque entrée Soroban a un TTL** (time‑to‑live), compté en registres, et le loyer l’étend.

Quand le TTL expire :

- **Temporaire** : les entrées sont supprimées. Disparues.
- **Persistant** et **instance** : elles sont **archivées** — évincées du registre actif, mais rétablissables plus tard avec une preuve, revenant exactement comme avant.

C’est l’**archivage d’état**, et aucune autre grande chaîne ne le fait. Le registre actif reste léger, les validateurs restent bon marché, l’historique reste récupérable.`,
    },
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
    {
      kind: "theory",
      body: `## L’interface voyage avec le contrat

Un contrat Soroban compilé n’est pas un objet binaire mystérieux. Le build intègre sa **spécification** directement dans le Wasm : chaque fonction, argument et type devient lisible par la machine.

Les outils l'exploitent directement : la CLI peut afficher l’interface d’un contrat déployé, et les clients **génèrent automatiquement des liaisons entièrement typées** à partir du Wasm on-chain. Plus besoin de rechercher un fichier ABI JSON, ni de craindre un écart de version entre le contrat et sa documentation : le registre *est* la documentation.

Tu peux ainsi appeler un contrat que tu n’as jamais vu avec des types vérifiés à la compilation. Voilà l’expérience de développement offerte par cette spécification embarquée.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `La Forge propose déjà un laboratoire pour cela : ouvre l’**OpenZeppelin Token Wizard**, configure un véritable contrat de jeton OZ et compile-le dans le runner Soroban de la Forge — spécification et étagères de stockage comprises. Lorsque le runner te rendra le Wasm, tu comprendras la théorie qui sous-tend chacun de ses octets.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `L'acte VII de la Campagne met le vérificateur de la Forge à l’œuvre sur tous ces concepts : tu écris le Rust, compiles le Wasm et observes \`invoke_host_function\` transporter *ton* code jusqu'au registre. Cette immersion complète t'attend quand tu le souhaites.

Au chapitre suivant, changement de perspective : certains contrats deviennent si puissants qu'ils cessent d'être de simples applications pour devenir **le compte lui-même**.`,
    },
  ],
} satisfies JourneyConceptText;
