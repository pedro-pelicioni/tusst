import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Portes du Royaume",
  tagline: "Les anchors — là où le registre touche le sol.",
  steps: [
    {
      kind: "theory",
      body: `## Ancrages : les portes

Les rivières du chapitre précédent déplacent les actifs *sur le registre*. Mais ton salaire se trouve encore dans une banque. Le pont est une **ancre** : une entreprise réglementée qui **émet des actifs adossés à des monnaies fiduciaires** et gère les **rampes d'entrée et de sortie**.

Confie des dollars à une ancre et elle te verse l’équivalent en jetons depuis son compte émetteur — le même mécanisme qu'il y a deux chapitres : un émetteur, des lignes de confiance et des indicateurs d’autorisation pour la conformité. Rends les jetons et elle te restitue les dollars.

Chaque actif fiduciaire sérieux sur Stellar passe par une porte de ce type. Les ancres sont le point de contact entre le registre et l'économie réelle.`,
    },
    { kind: "theory", body: `## Ce que « adossé » promet réellement

Le jeton qu'émet un anchor n'est pas des dollars. C'est une **créance sur une entreprise** — et tout l'édifice repose sur le fait que cette entreprise l'honore.

Ce qui veut dire que les questions intéressantes sur n'importe quel actif fiat ne sont pas techniques :

- **Qui est l'émetteur, juridiquement ?** Une entité régulée dans une juridiction, ou un compte anonyme ?
- **Où est l'argent ?** En conservation ségréguée, ou sur le compte qui paie les salaires ?
- **Qui peut le prouver ?** Une attestation lisible, ou une promesse sur une page d'accueil ?
- **Que se passe-t-il s'ils s'arrêtent ?** Une voie de remboursement qui survit à l'entreprise, ou un jeton qui devient discrètement un souvenir ?

Le registre est honnête sur exactement une chose : il vous dira, précisément et pour toujours, *quel compte a émis cet actif*. Tout le reste est de la diligence — et c'est pourquoi un code d'actif seul ne signifie rien, et \`USDC\` du mauvais émetteur est un autre actif qui partage le nom par hasard.` },
    { kind: "quiz",
      question: `Un portefeuille affiche un solde de \`USDC\`. Que vous dit le code d'actif à lui seul ?`,
      options: ["Presque rien — un actif est un code *plus son émetteur*, et n'importe qui peut émettre un code affichant USDC","Qu'il s'agit du stablecoin dollar bien connu, les codes d'actif étant uniques sur le registre","Qu'une entité régulée a attesté de son adossement"],
      answer: 0,
      explain: `C'est la mélecture la plus coûteuse de l'écosystème, et le protocole n'y est pour rien : les codes d'actif n'ont jamais été uniques et n'ont jamais eu vocation à l'être. L'adresse de l'émetteur est l'identité ; le code est une étiquette. Un portefeuille qui vous montre l'un sans l'autre vous montre une rumeur.` },
    { kind: "fill",
      prompt: `Complétez ce qu'un actif est réellement :`,
      file: "NOTES.md",
      before: `Un actif sur Stellar est un code d'actif plus `,
      after: ` — et deux actifs qui ne partagent que le code sont deux actifs différents.`,
      choices: ["l'adresse de son émetteur", "la quantité en circulation", "le nom de domaine de l'anchor", "une inscription dans la liste d'actifs de la SDF"],
      answer: 0,
      explain: `Le domaine s'en approche et sert vraiment — c'est ainsi qu'un émetteur publie qui il est — mais c'est une affirmation superposée. L'identité que le protocole lui-même garantit, c'est le compte émetteur, et c'est la seule partie que personne ne peut usurper.` },
    { kind: "labLink", labSlug: "oz-token-wizard",
      body: `Un anchor est une entreprise enroulée autour d'un unique acte technique : **émettre un jeton**. Cet acte, vous pouvez l'accomplir. L'**Assistant Jetons OZ** de la Forge forge un vrai jeton sur testnet, avec vous comme émetteur — et ce qu'il ne vous donne pas, c'est tout ce qui fait d'un anchor un anchor : la licence, la conservation, les audits et la promesse de rembourser.` },
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
      kind: "diagram",
      body: "De l'argent bancaire entre, de l'argent bancaire sort — le registre ne tient que le milieu :",
      caption: "Les deux portes ne se rencontrent jamais. Chacune n'a qu'à faire confiance au registre entre elles.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "in",
            label: "la porte de départ",
            note: "Une ancre reçoit de l'argent réel et émet un jeton adossé à celui-ci.",
            tone: "gold",
          },
          {
            id: "ledger",
            label: "le registre",
            note: "Cinq secondes, une fraction de centime, et aucune banque correspondante en vue.",
            tone: "accent",
          },
          {
            id: "out",
            label: "la porte d'arrivée",
            note: "Une autre ancre brûle le jeton et paie en monnaie locale.",
            tone: "gold",
          },
          {
            id: "done",
            label: "de l'argent en main",
            note: "Le destinataire n'a jamais installé de portefeuille ni entendu le mot registre.",
            tone: "good",
          },
        ],
      },
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
    { kind: "theory", body: `## Les sigles devant lesquels vous venez de passer

Vous les avez vus dans la remise d'Ana et vous les avez sans doute laissés filer : SEP-1, SEP-10, SEP-24. Trois standards pour trois tâches — *qui est cet anchor*, *prouvez que c'est vous*, et *exécutez le dépôt*.

Ils n'étaient pas accessoires. Sans eux, le portefeuille d'Ana aurait besoin d'une intégration sur mesure avec son anchor, celui de sa mère d'une autre avec le sien, et chaque nouveau portefeuille repartirait de zéro. Deux portes n'ont coopéré que parce qu'elles s'étaient déjà entendues sur la façon de parler.

**Ensuite :** l'entente elle-même — les standards qui permettent à n'importe quel portefeuille de se présenter à n'importe quelle porte.` },
  ],
  testOut: [
    { question: `Qu'est-ce qu'un anchor ?`,
      options: ["Une entreprise régulée qui émet des actifs adossés à du fiat et exploite les rampes d'entrée et de sortie entre l'argent bancaire et le registre","Une fonctionnalité du protocole qui convertit automatiquement le fiat en actifs du registre","Un validateur spécialisé dans le trafic de paiements"], answer: 0 },
    { question: `Un portefeuille affiche \`USDC\`. Qu'établit le code d'actif à lui seul ?`,
      options: ["Presque rien — un actif est un code plus son émetteur, et n'importe quel compte peut émettre ce code","Qu'il s'agit du stablecoin dollar bien connu ; les codes sont uniques","Que quelqu'un a attesté de son adossement"], answer: 0 },
    { question: `Dans une remise de porte à porte, quelle pièce effectue la conversion de devise ?`,
      options: ["Le path payment, en passant par les carnets et pools du registre à un prix que chacun peut vérifier","Le bureau de change interne de l'anchor émetteur, hors registre","Un contrat-pont qui verrouille un actif et en frappe un autre"], answer: 0 },
    { question: `Pourquoi peut-on construire une intégration anchor complète sans licence bancaire ?`,
      options: ["La SDF exploite testanchor sur testnet — un anchor fonctionnel avec de l'argent fictif pour répéter toute la danse","Les anchors publient leurs identifiants de production pour le développement","On ne peut pas ; l'intégration anchor exige d'abord un accord signé"], answer: 0 },
  ],
};
