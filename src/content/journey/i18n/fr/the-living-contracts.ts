import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Les Contrats Vivants",
  tagline: "Soroban : Wasm, stockage qui expire, frais qui ont du sens.",
  steps: [
    {
      kind: "theory",
      body: `## Les contrats entrent dans le royaume

**Soroban** est la plateforme de contrats intelligents de Stellar. Un contrat est **Rust compilé en WebAssembly**, téléversé sur le registre et exécuté dans un hôte sandboxé — chaque pouvoir qu’il possède (stockage, cryptographie, appel d’autres contrats) arrive via les **fonctions d’hôte** fournies par le protocole.

Et voici la partie élégante : appeler un contrat ne nécessite aucun nouveau format de transaction. L’enveloppe que tu as décortiquée contient une seule opération — \`invoke_host_function\` — et à l’intérieur se trouve l’appel : quel contrat, quelle fonction, quels arguments.

Même enveloppe, mêmes signatures, même ~5‑secondes de clôture. Le royaume classique et le royaume du contrat partagent un même flux sanguin.`,
    },
    {
      kind: "theory",
      body: `## Trois étagères de stockage

Soroban donne à un contrat trois niveaux de stockage — choisis par entrée, tarifés différemment :

- **Temporaire** — bon marché, éphémère, disparaît à jamais une fois expiré. Devises, nonces, état limité dans le temps.
- **Persistant** — l’archive réelle : soldes utilisateurs, registres de propriété. Survient à l’expiration grâce à l’*archivage* (étape suivante).
- **Instance** — petit état attaché au contrat lui‑même : adresse d’administration, configuration, métadonnées nécessaires à chaque appel.

Choisir la mauvaise étagère est une taxe de débutant classique : le gonflement d’instance fait que chaque appel doit le porter, et les soldes temporaires disparaissent simplement. L’étagère *est* partie intégrante du design.`,
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
      explain: `La suppression temporaire est *permanente* — un solde disparu est un pull rug par négligence. Et le stockage d’instance se charge à chaque appel, donc mettre des données par utilisateur là‑là fait payer tout le monde.`,
    },
    {
      kind: "fill",
      prompt: `Place le solde sur la bonne étagère.`,
      file: "token/src/lib.rs",
      before: `env.storage().`,
      after: `().set(&user, &balance);`,
      choices: ["persistent", "temporary", "instance", "eternal"],
      answer: 0,
      explain: `Le soroban-sdk reflète les niveaux un à un : \`env.storage().persistent()\`, \`.temporary()\`, \`.instance()\`. Il n’y a pas de \`eternal\` — c’est le point central du design du loyer.`,
    },
    {
      kind: "theory",
      body: `## Des frais mesurés, pas enchéris

Sur les chaînes à enchère de gaz tu *enchères* pour l’espace de bloc et pries ; une seule offre peut multiplier les coûts de tout le monde.

Soroban **mesure** à la place. Une transaction déclare ses **ressources** — instructions CPU, mémoire, lectures/écritures de registre, octets — et les frais sont *calculés* à partir de ces besoins mesurés, plus le loyer pour le stockage touché. Déclare honnêtement (la simulation le fait pour toi) et la partie remboursable de tout excès revient.

Le résultat est un coût que tu peux citer à l’avance : « cette action coûte environ un cent » reste vrai même quand le réseau est occupé.`,
    },
    {
      kind: "theory",
      body: `## Simule d’abord, signe exactement ce que tu as simulé

Chaque client Soroban suit un même rythme :

1. **Simule** l’appel contre un nœud RPC — pas de signature, pas de coût.
2. La simulation renvoie le **empreinte** — précisément quelles entrées de registre l’appel lira et écrira — plus les estimations de ressources et l’authentification nécessaire.
3. Tu **signe exactement ce que tu as simulé** et soumets.

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

Un contrat Soroban compilé n’est pas un blob mystérieux. La build y intègre un **spec de contrat** dans le Wasm lui‑même : chaque fonction, argument et type, lisible par machine.

Les outils en tirent directement — le CLI peut afficher l’interface d’un contrat déployé, et les clients **auto‑génèrent des liaisons entièrement typées** à partir du Wasm en chaîne. Pas de chasse aux fichiers ABI JSON, pas de dérive de version entre le contrat et ses docs : le registre *est* la documentation.

Appelle un contrat que tu n’as jamais vu, avec des types vérifiés à la compilation. C’est l’expérience développeur que le spec offre.`,
    },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `La Forge propose déjà un lab pour cela : ouvre l’**OpenZeppelin Token Wizard**, configure un véritable contrat de token OZ et compile-le dans le runner Soroban de la Forge — spec, étagères de stockage et tout. Lorsque le runner te rendra ton Wasm, ce chapitre sera la théorie qui sous-tend chaque octet.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `Acte VII de la Campagne met le vérificateur de prêt à l’œuvre sur tout ça — tu écris le Rust, compile le Wasm, et vois \`invoke_host_function\` porter *ton* code sur le registre. L’immersion complète est là chaque fois que tu le veux.

Chapitre suivant, un twist : des contrats si capables qu’ils arrêtent d’être des apps — et deviennent le **compte lui‑même**.`,
    },
  ],
} satisfies JourneyConceptText;
