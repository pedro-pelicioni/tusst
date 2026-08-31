import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Langue Commune",
  tagline: "SEP : implémentez une fois, et chaque porte s'ouvre.",
  steps: [
    { kind: "theory", body: `## L'arithmétique qui impose un standard

Comptez les intégrations. Dix portefeuilles, dix portes, chaque paire exigeant son propre flux de dépôt, sa propre connexion, sa propre façon de réclamer une photo de passeport : **cent intégrations sur mesure** — et cent vingt et une dès qu'un onzième apparaît d'un côté ou de l'autre.

Ce n'est pas un mode de défaillance hypothétique. C'est ce qui est arrivé à la génération précédente de plomberie des paiements, et c'est pourquoi envoyer de l'argent à l'étranger a historiquement voulu dire demander à une banque de demander à une banque.

Il n'y a que deux sorties du N×M. L'une est le monopole : tout le monde s'intègre à l'unique porte qui a gagné, à ses conditions. L'autre est un **standard** — un document public qui dit exactement comment n'importe quel portefeuille parle à n'importe quelle porte, pour que les deux camps construisent contre le document plutôt que l'un contre l'autre.

Stellar a pris la seconde route, et les documents ont un nom.` },
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
      body: `## Les portes fonctionnelles : 24, 31, 41

- **SEP-24** — dépôt et retrait *interactifs*. Ton portefeuille ouvre l'interface web hébergée par l’ancre ; celle-ci gère les formulaires KYC et les coordonnées bancaires ; les jetons arrivent une fois le virement validé. C'est la rampe d'accès quotidienne destinée aux utilisateurs.
- **SEP-31** — paiements transfrontaliers entre *entreprises* : une ancre d'origine et une ancre de destination règlent la transaction sur Stellar tout en gérant chacune son infrastructure locale.
- **SEP-41** — un vieux compagnon : l’interface **token** standard pour les contrats Soroban, celui que tout Stellar Asset Contract utilise.

Rampes pour les gens, rails pour les institutions, un dialecte de jeton pour les contrats.`,
    },
    { kind: "theory", body: `## Un standard n'est pas un label de confiance

Voici la confusion qu'il vaut mieux couper à la racine, car c'est celle qui coûte de l'argent aux gens.

Une porte qui implémente SEP-1, SEP-10 et SEP-24 vous a dit exactement une chose : **sa plomberie fonctionne**. Elle publie un fichier disant qui elle prétend être. Elle sait vérifier une signature. Elle sait dérouler un flux de dépôt que votre portefeuille sait ouvrir.

Elle ne vous a rien dit sur l'existence des dollars, sur le fait que l'entité soit licenciée quelque part, sur la ségrégation de la conservation, ni sur la présence de quelqu'un au bout du fil quand vous voudrez rembourser. N'importe qui peut héberger un \`stellar.toml\`. Le fichier est une revendication d'identité, pas un certificat de bonne tenue — le SEP-1 rend un émetteur **identifiable**, ce qui est une condition préalable à la confiance et non un substitut.

Lisez donc les standards pour ce qu'ils sont : ils rendent l'écosystème *interopérable*, pas *sûr*. Le premier est un problème de protocole, résolu. Le second est de la diligence, et il reste le vôtre.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## L'épreuve de l'examinateur : choisissez la langue

Vous construisez un portefeuille pour un corridor :

> Des utilisateurs au Brésil détiennent des BRL dans une banque. Ils veulent envoyer de l'argent à de la famille au Portugal, qui retire des euros sur un compte local. Vous intégrerez un anchor brésilien et un anchor portugais, dont vous ne contrôlez aucun.

Écrivez le **plan d'intégration comme une suite de standards**. Pour chaque étape : quel SEP, ce qu'il vous apporte, et ce qui casserait si vous le sautiez. Puis nommez une chose de ce corridor qu'aucun SEP ne résoudra pour vous.

Standards et comportement uniquement — pas d'endpoints, pas d'appels de SDK, pas de code.`,
      rubric: `1. Nomme les standards dans un ordre qui fonctionne, en commençant par découvrir qui est l'anchor avant de s'authentifier auprès de lui.
2. Pour chaque standard nommé, énonce concrètement ce qu'il apporte — pas seulement son numéro ou son titre.
3. Énonce ce qui casserait si au moins une des étapes était sautée.
4. Nomme au moins un problème réel du corridor que les standards ne résolvent pas (risque de change, licences, liquidité à l'une des portes, refus de KYC, échec de remboursement…).
5. Standards et comportement uniquement — pas de chemins d'endpoint, pas de noms de méthode de SDK, pas de code.`,
      minChars: 180 },
    { kind: "theory", body: `## Où s'achève le royaume classique

Faites le compte de ce que vous savez désormais lire : le consensus, les enveloppes, les comptes et les actifs, les marchés à l'intérieur du registre, le paiement qui traverse les monnaies, les portes aux deux bords, et les standards qui font coopérer ces portes.

Chacune de ces choses est de la **machinerie intégrée au protocole**. Vous l'avez configurée, vous l'avez payée, vous y avez fait transiter de la valeur — mais vous n'en avez rien écrit. Les règles étaient déjà là, décidées par des gens qui ne sont pas vous.

**Ensuite :** la part du royaume que vous programmez vous-même, où un contrat est une chose que vous déployez et où même son stockage a un pouls.` },
  ],
  testOut: [
    { question: `Quel problème un SEP existe-t-il pour résoudre ?`,
      options: ["La plomberie sur mesure N×M — avec un standard public, n'importe quel portefeuille fonctionne avec n'importe quelle porte qui l'implémente","La lenteur de règlement entre portefeuilles et anchors","L'absence d'un registre central d'anchors approuvés"], answer: 0 },
    { question: `Que prouve exactement l'authentification SEP-10 à un anchor ?`,
      options: ["Que vous contrôlez la clé secrète du compte — en signant une transaction-défi jamais soumise au registre","Votre identité légale, le SEP-10 réalisant lui-même le KYC","Que le compte détient assez de XLM pour couvrir les frais de l'anchor"], answer: 0 },
    { question: `Où un portefeuille trouve-t-il la carte d'identité on-chain d'un domaine ?`,
      options: ["Dans un stellar.toml à un chemin bien connu du domaine — le SEP-1, le plus simple de tous les standards","Dans un contrat de registre maintenu par la SDF sur mainnet","Dans les entrées manage_data du compte émetteur"], answer: 0 },
    { question: `Quel standard est la rampe interactive de dépôt et retrait du quotidien, pour les humains ?`,
      options: ["Le SEP-24 — le portefeuille ouvre le flux hébergé de l'anchor, qui gère le KYC et les coordonnées bancaires","Le SEP-31, qui règle les paiements transfrontaliers entre entreprises","Le SEP-41, l'interface de jeton que parlent les contrats Soroban"], answer: 0 },
  ],
};
