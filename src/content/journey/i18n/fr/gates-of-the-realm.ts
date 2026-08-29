import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Portes du Royaume",
  tagline: "Ancrages & SEPs — où le grand livre rencontre le monde réel.",
  steps: [
    {
      kind: "theory",
      body: `## Ancrages : les portes

Les rivières du chapitre précédent déplacent les actifs *ledger*. Mais ton salaire reste dans une banque. Le pont est un **ancrage** : une entreprise réglementée qui **émet des actifs adossés à la monnaie fiduciaire** et gère les **rampe d’entrée/sortie**.

Donne des dollars à un ancrage et il te verse l’équivalent en jetons depuis son compte émetteur — la même mécanique que tu as apprise il y a deux chapitres : un émetteur, des trustlines, des drapeaux d’authentification pour la conformité. Récupère les jetons et il te renvoie les dollars.

Chaque actif fiduciaire sérieux sur Stellar est derrière une porte comme celle‑ci. Les ancrages sont là où le grand livre touche le sol.`,
    },
    {
      kind: "theory",
      body: `## SEPs : la langue commune

Il existe de nombreux portefeuilles et de nombreux ancrages. Sans normes, chaque paire aurait besoin d’une intégration sur mesure — N×M, pour toujours.

La réponse de Stellar est le **SEP** : *Stellar Ecosystem Proposal*. Les SEPs sont des normes publiques définissant exactement comment portefeuilles, ancrages et services communiquent. Implémente un SEP une fois et ton portefeuille fonctionnera avec **tout ancrage** qui l’implémente aussi — flux de dépôt, authentification, identité, tout.

Cette culture d’interopérabilité avant tout est l’une des superpuissances silencieuses de Stellar : les utilisateurs choisissent n’importe quelle porte, et toutes les portes partagent une même forme de clé.`,
    },
    {
      kind: "theory",
      body: `## SEP-1 et SEP-10 : identité et preuve

Deux petites normes portent toute la porte :

- **SEP-1** — chaque domaine sérieux publie un \`stellar.toml\` : sa **carte d’identité on‑chain**. Quels actifs il émet, quels comptes sont officiels, où vivent ses services. Les portefeuilles le lisent pour distinguer le véritable émetteur d’un imposteur portant le même code d’actif.
- **SEP-10** — **authentification web** : l’ancrage envoie une *transaction de défi*, tu la signes avec la clé de ton compte et la renvoies. Propriété prouvée, session accordée — et le défi **n’est jamais soumis** au grand livre.

Connecte‑toi avec une signature : pas de mot de passe, pas d’e‑mail.`,
    },
    {
      kind: "quiz",
      question: `Que prouve exactement l’authentification web SEP-10 à un ancrage ?`,
      options: [
        "Que tu contrôles la clé secrète du compte — en signant une transaction de défi qui ne touche jamais le grand livre",
        "Ta véritable identité légale — SEP-10 effectue lui‑même la vérification KYC",
        "Que ton compte possède assez de XLM pour payer les frais de l’ancrage",
      ],
      answer: 0,
      explain: `SEP-10 est purement la possession de clé. L’identité légale est une norme distincte (SEP-12) que les ancrages exécutent *après* que tu sois authentifié — signature d’abord, papiers ensuite.`,
    },
    {
      kind: "theory",
      body: `## Les portes fonctionnelles : 24, 31, 41

- **SEP-24** — dépôt et retrait *interactifs*. Ton portefeuille ouvre la vue web hébergée par l’ancrage ; l’ancrage gère les formulaires KYC et les détails bancaires ; les jetons arrivent quand le virement est clair. La rampe quotidienne pour les humains.
- **SEP-31** — paiements transfrontaliers entre *entreprises* : un ancrage expéditeur et un ancrage récepteur se règlent sur Stellar tout en gérant chacun ses rails locaux.
- **SEP-41** — un vieux compagnon : l’interface **token** standard pour les contrats Soroban, celui que tout Stellar Asset Contract utilise.

Rampes pour les gens, rails pour les institutions, un dialecte de jeton pour les contrats.`,
    },
    {
      kind: "fill",
      prompt: `Où un portefeuille trouve-t‑il la carte d’identité d’un domaine ?`,
      file: "discovery.txt",
      before: `https://anchor.example/`,
      after: `  →  actifs, comptes officiels et endpoints de service`,
      choices: [
        ".well-known/stellar.toml",
        "api/v2/anchor-manifest.json",
        "stellar/config.xml",
        "identity.pdf",
      ],
      answer: 0,
      explain: `SEP-1, la norme la plus simple de toutes : un fichier TOML à un chemin bien connu. Prouve que tu possèdes le domaine, liste tes comptes émetteurs dans le fichier, et les portefeuilles peuvent afficher « émis par anchor.example » comme fait, pas comme intuition.`,
    },
    {
      kind: "theory",
      body: `## Une remise, porte à porte

Regarde Ana à Chicago payer sa mère à Lisbonne :

1. Le portefeuille d’Ana lit le \`stellar.toml\` de l’ancrage US (SEP-1), s’authentifie (SEP-10), et ouvre un dépôt (SEP-24). Ses dollars deviennent USDC sur‑ledger.
2. Un **paiement de chemin** traverse la rivière : USDC sort, EURC arrive — secondes, frais sous cent.
3. Le portefeuille de la mère retire via un ancrage européen (encore SEP-24). Les euros arrivent sur son compte bancaire.

Deux portes réglementées, un passage de rivière atomique au milieu. La chaîne n’a jamais vu un « dollar » — seulement des actifs que les portes promettent d’honorer.`,
    },
    {
      kind: "quiz",
      question: `Dans cette remise porte à porte, quel élément a effectué la conversion de devise ?`,
      options: [
        "Le paiement de chemin — acheminant USDC vers EURC via les carnets d’ordres et pools sur‑ledger",
        "Le bureau FX interne de l’ancrage expéditeur, hors du grand livre",
        "Un contrat de pont qui verrouillait l'USDC et frappait l'EURC",
      ],
      answer: 0,
      explain: `Les portes ne font que traduire entre l’argent bancaire et les actifs du grand livre. Le FX lui‑même se produit en transit, sur les marchés publics, à un prix que tout le monde peut vérifier — la partie des rails de remise hérités ne peut pas offrir.`,
    },
    {
      kind: "theory",
      body: `## Portes pratiques : testanchor

Tu n’as pas besoin d’une licence bancaire pour construire contre tout ça. Le SDF exécute **testanchor** sur testnet — un ancrage entièrement fonctionnel parlant SEP-1, SEP-10 et SEP-24 avec de l’argent de démonstration. Oriente ton code portefeuille vers lui et répète toute la danse dépôt‑et‑retrait avant qu’un seul dollar réel ne soit impliqué.

Portes, rivières, confiance — tout jusqu’à présent a été le *royaume classique*, la machinerie intégrée dans le protocole. Le prochain chapitre nous fait passer à la partie que tu programmes toi‑même : **Soroban**, où les contrats sont vivants et même le stockage a un battement de cœur.`,
    },
  ],
} satisfies JourneyConceptText;
