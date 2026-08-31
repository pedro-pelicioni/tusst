import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Les Contrats Vivants",
  tagline: "Soroban : du Wasm sur le registre, et trois étagères pour l'état.",
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
      body: `## L’interface voyage avec le contrat

Un contrat Soroban compilé n’est pas un objet binaire mystérieux. Le build intègre sa **spécification** directement dans le Wasm : chaque fonction, argument et type devient lisible par la machine.

Les outils l'exploitent directement : la CLI peut afficher l’interface d’un contrat déployé, et les clients **génèrent automatiquement des liaisons entièrement typées** à partir du Wasm on-chain. Plus besoin de rechercher un fichier ABI JSON, ni de craindre un écart de version entre le contrat et sa documentation : le registre *est* la documentation.

Tu peux ainsi appeler un contrat que tu n’as jamais vu avec des types vérifiés à la compilation. Voilà l’expérience de développement offerte par cette spécification embarquée.`,
    },
    { kind: "quiz",
      question: `Vous stockez le nonce de session d'un utilisateur, sans valeur quelques minutes après son émission. Quelle étagère ?`,
      options: ["Temporaire — le loyer le plus bas, et l'oubli est exactement ce que vous voulez","Persistante, pour pouvoir la restaurer si un appel arrive en retard","D'instance, pour qu'elle disparaisse si le contrat est un jour archivé"],
      answer: 0,
      explain: `Faire correspondre l'étagère à la durée de vie réelle de la donnée est toute la décision de conception, et c'est celle qu'on rate dans la direction qui paraît prudente : mettre une donnée éphémère sur l'étagère persistante coûte plus cher pour toujours, pour une garantie dont la donnée n'a jamais eu besoin.` },
    { kind: "fill",
      prompt: `Complétez ce qu'un contrat déployé emporte avec lui :`,
      file: "NOTES.md",
      before: `Un appelant n'a pas besoin de votre documentation pour invoquer un contrat, car son `,
      after: ` se lit depuis le code déployé lui-même.`,
      choices: ["interface", "code source", "adresse de l'auteur", "rapport d'audit"],
      answer: 0,
      explain: `La source n'est pas sur le registre — le Wasm compilé l'est — et ni une adresse ni un audit ne disent à un outil quelles fonctions existent ni ce qu'elles prennent. C'est parce que l'interface voyage avec le code que l'outillage sait construire un appel vers un contrat que personne n'a documenté.` },
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
    { kind: "theory", body: `## Rien ici n'est gratuit

Vous savez désormais dire ce qu'est un contrat Soroban, où vivent ses données, et comment n'importe qui l'appelle sans votre documentation.

Ce que rien de tout cela ne vous a dit, c'est la part qui empêche les équipes de dormir : **l'état se loue, il ne se possède pas.** Chaque entrée sur chaque étagère a une horloge, et les étagères ne diffèrent que par une seule chose qui compte — ce qui arrive quand une horloge atteint zéro.

Se tromper là-dessus ne ressemble pas à un bug. Cela ressemble à un contrat qui a fonctionné six mois puis, un mardi, s'est mis à répondre que la donnée n'existe pas.

**Ensuite :** le battement, et la facture.` },
  ],
  testOut: [
    { question: `Qu'est-ce qu'un contrat Soroban, sur le registre ?`,
      options: ["Du Wasm compilé stocké sur le registre, avec une adresse, invoqué par une opération de transaction comme n'importe quel autre verbe","Un script que les validateurs interprètent depuis la source au moment de l'appel","Un service hors chaîne que le protocole appelle au besoin"], answer: 0 },
    { question: `Pourquoi Soroban propose-t-il trois sortes de stockage plutôt qu'une ?`,
      options: ["Des données différentes ont une valeur différente dans le temps, et les étagères les tarifent et les font expirer différemment","Chaque sorte est optimisée pour une taille de donnée différente","Les anciens contrats utilisent l'une et les nouveaux l'autre"], answer: 0 },
    { question: `Que signifie que l'interface voyage avec le contrat ?`,
      options: ["La spécification du contrat se lit depuis le code déployé lui-même, si bien que l'outillage peut l'appeler sans documentation externe","L'interface est inscrite dans un annuaire public maintenu par la SDF","L'appelant doit recevoir une bibliothèque cliente de l'auteur du contrat"], answer: 0 },
    { question: `Où voyage un appel de contrat ?`,
      options: ["Dans la même enveloppe de transaction que vous connaissez déjà, comme une opération invoke_host_function","Sur un canal séparé réservé aux contrats, avec son propre consensus","Directement vers un validateur en RPC, en contournant le registre"], answer: 0 },
  ],
};
