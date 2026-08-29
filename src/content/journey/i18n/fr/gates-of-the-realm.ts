import type { JourneyConceptText } from "../types";

export const conceptText = {
  title: "Portes du Royaume",
  tagline: "Ancrages & SEPs — où le grand livre rencontre le monde réel.",
  steps: [
    {
      kind: "theory",
      body: `## Ancrages : les portes

Les rivières du chapitre précédent déplacent les actifs *sur le registre*. Mais ton salaire se trouve encore dans une banque. Le pont est une **ancre** : une entreprise réglementée qui **émet des actifs adossés à des monnaies fiduciaires** et gère les **rampes d'entrée et de sortie**.

Confie des dollars à une ancre et elle te verse l’équivalent en jetons depuis son compte émetteur — le même mécanisme qu'il y a deux chapitres : un émetteur, des lignes de confiance et des indicateurs d’autorisation pour la conformité. Rends les jetons et elle te restitue les dollars.

Chaque actif fiduciaire sérieux sur Stellar passe par une porte de ce type. Les ancres sont le point de contact entre le registre et l'économie réelle.`,
    },
    {
      kind: "theory",
      body: `## SEPs : la langue commune

Il existe de nombreux portefeuilles et de nombreuses ancres. Sans normes, chaque paire aurait besoin d’une intégration sur mesure — soit N×M intégrations à maintenir indéfiniment.

La réponse de Stellar tient dans les **SEP**, les *Stellar Ecosystem Proposals*. Ces normes publiques définissent précisément la manière dont portefeuilles, ancres et services communiquent. Implémente une SEP une fois et ton portefeuille fonctionnera avec **toute ancre** qui la respecte également — dépôt, authentification, identité et le reste.

Cette culture d’interopérabilité avant tout est l’une des superpuissances silencieuses de Stellar : les utilisateurs choisissent n’importe quelle porte, et toutes les portes partagent une même forme de clé.`,
    },
    {
      kind: "theory",
      body: `## SEP-1 et SEP-10 : identité et preuve

Deux petites normes portent toute la porte :

- **SEP-1** — chaque domaine sérieux publie un \`stellar.toml\` : sa **carte d’identité on‑chain**. Quels actifs il émet, quels comptes sont officiels, où vivent ses services. Les portefeuilles le lisent pour distinguer le véritable émetteur d’un imposteur portant le même code d’actif.
- **SEP-10** — **authentification web** : l’ancre envoie une *transaction de défi*, tu la signes avec la clé de ton compte et la lui renvoies. La possession du compte est prouvée, la session est accordée — et le défi **n’est jamais soumis** au registre.

Connecte‑toi avec une signature : pas de mot de passe, pas d’e‑mail.`,
    },
    {
      kind: "quiz",
      question: `Que prouve exactement l’authentification web SEP-10 à une ancre ?`,
      options: [
        "Que tu contrôles la clé secrète du compte — en signant une transaction de défi qui ne touche jamais le grand livre",
        "Ta véritable identité légale — SEP-10 effectue lui‑même la vérification KYC",
        "Que ton compte possède assez de XLM pour payer les frais de l’ancre",
      ],
      answer: 0,
      explain: `SEP-10 prouve uniquement la possession de la clé. L’identité légale relève d'une norme distincte, SEP-12, que les ancres appliquent *après* l'authentification — signature d’abord, justificatifs ensuite.`,
    },
    {
      kind: "theory",
      body: `## Les portes fonctionnelles : 24, 31, 41

- **SEP-24** — dépôt et retrait *interactifs*. Ton portefeuille ouvre l'interface web hébergée par l’ancre ; celle-ci gère les formulaires KYC et les coordonnées bancaires ; les jetons arrivent une fois le virement validé. C'est la rampe d'accès quotidienne destinée aux utilisateurs.
- **SEP-31** — paiements transfrontaliers entre *entreprises* : une ancre d'origine et une ancre de destination règlent la transaction sur Stellar tout en gérant chacune son infrastructure locale.
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
      body: `## Un transfert de bout en bout

Regarde Ana à Chicago payer sa mère à Lisbonne :

1. Le portefeuille d’Ana lit le \`stellar.toml\` de l’ancre américaine (SEP-1), s’authentifie (SEP-10) et ouvre un dépôt (SEP-24). Ses dollars deviennent des USDC sur le registre.
2. Un **paiement de chemin** traverse la rivière : USDC sort, EURC arrive — secondes, frais sous cent.
3. Le portefeuille de sa mère effectue un retrait auprès d'une ancre européenne, toujours via SEP-24. Les euros arrivent sur son compte bancaire.

Deux portes réglementées, un passage de rivière atomique au milieu. La chaîne n’a jamais vu un « dollar » — seulement des actifs que les portes promettent d’honorer.`,
    },
    {
      kind: "quiz",
      question: `Dans cette remise porte à porte, quel élément a effectué la conversion de devise ?`,
      options: [
        "Le paiement par chemin — il convertit les USDC en EURC via les carnets d’ordres et les pools du registre",
        "Le service de change interne de l’ancre d'origine, hors du registre",
        "Un contrat de pont qui verrouillait l'USDC et frappait l'EURC",
      ],
      answer: 0,
      explain: `Les portes ne font que traduire entre l’argent bancaire et les actifs du grand livre. Le FX lui‑même se produit en transit, sur les marchés publics, à un prix que tout le monde peut vérifier — la partie des rails de remise hérités ne peut pas offrir.`,
    },
    {
      kind: "theory",
      body: `## Portes pratiques : testanchor

Tu n’as pas besoin d’une licence bancaire pour développer cette intégration. La SDF exploite **testanchor** sur testnet — une ancre entièrement fonctionnelle qui prend en charge SEP-1, SEP-10 et SEP-24 avec de l’argent fictif. Oriente ton code de portefeuille vers elle et répète tout le parcours de dépôt et de retrait avant d'engager le moindre dollar réel.

Portes, rivières, confiance — tout jusqu’à présent a été le *royaume classique*, la machinerie intégrée dans le protocole. Le prochain chapitre nous fait passer à la partie que tu programmes toi‑même : **Soroban**, où les contrats sont vivants et même le stockage a un battement de cœur.`,
    },
  ],
} satisfies JourneyConceptText;
