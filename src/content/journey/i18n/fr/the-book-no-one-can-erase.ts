import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Le livre que personne n'efface",
  tagline: "Ce qu'est une blockchain, raconté sans le moindre sigle.",
  steps: [
    {
      kind: "theory",
      body: `## Commençons par l'ardoise de la taverne

Onze amis et vous buvez chaque semaine dans la même taverne. Personne ne paie sur le moment — le tavernier note tout dans un livre : *Ana doit 3, Bruno doit 5, Ana a rendu 3.*

Le livre fonctionne. Mais il a une faiblesse, et ce n'est pas l'arithmétique : **le tavernier est le seul à le détenir.** Si une page est réécrite un soir tranquille, il n'y a rien à quoi la comparer.

Tout ce chapitre découle de la correction de cette seule faiblesse. Aucune mathématique nécessaire — juste une meilleure disposition du livre.`,
    },
    {
      kind: "theory",
      body: `## Correctif 1 : chacun garde une copie

Vous changez donc la règle. Chaque ligne écrite par le tavernier, vous la recopiez tous les douze dans votre propre livre, au même instant.

Réécrire une page devient presque inutile. Modifiez votre copie et les onze autres sont simplement en désaccord avec vous — et la majorité a manifestement raison. Le tavernier a cessé d'être *le* livre pour devenir *l'un des* livres.

C'est toute l'idée d'un **registre partagé** : pas un fichier magique, juste une liste de mouvements que trop de gens détiennent à la fois pour que l'un d'eux puisse la modifier discrètement.`,
    },
    {
      kind: "diagram",
      body: `Toute la différence, en trois lignes :`,
      caption: "Rien de tout cela n'est de la cryptographie — c'est de l'arithmétique sur le nombre de copies.",
      view: {
        kind: "compare",
        columns: [
          { id: "one", label: "un seul livre", tone: "bad" },
          { id: "many", label: "douze copies", tone: "good" },
        ],
        rows: [
          {
            label: "réécrire une page",
            cells: [
              { text: "personne ne le voit", tone: "bad" },
              { text: "onze copies sont en désaccord", tone: "good" },
            ],
          },
          {
            label: "à qui faire confiance",
            cells: [
              { text: "au tavernier", tone: "bad" },
              { text: "à personne en particulier", tone: "good" },
            ],
          },
          {
            label: "perdre le livre",
            cells: [
              { text: "tout est perdu", tone: "bad" },
              { text: "il reste onze copies", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Correctif 2 : enchaînez les pages

Il reste une faille. Qu'est-ce qui empêche quelqu'un de réécrire une page *de l'an dernier*, au fond du livre, là où personne ne regarde ?

Vous ajoutez donc une habitude : en tête de chaque nouvelle page, vous recopiez un court résumé de la précédente. La page 40 porte une empreinte de la 39, qui porte celle de la 38, et ainsi de suite jusqu'à la première.

Désormais, toucher une vieille page change son empreinte — qui ne correspond plus à celle notée sur la page suivante, qui ne correspond plus à la suivante. **Une modification dans le passé casse toutes les pages qui suivent**, bruyamment, pour tous ceux qui détiennent une copie.

Des pages enchaînées aux pages précédentes. Voilà le « chain » de blockchain — et oui, le mot ne veut rien dire de plus.`,
    },
    {
      kind: "widget",
      component: "ledger-tamper",
      body: `Voici ce livre, enchaîné. **Modifiez n'importe quelle page** et regardez ce qui arrive aux suivantes.`,
    },
    {
      kind: "quiz",
      question: `Quelqu'un qui détient une copie du livre partagé réécrit discrètement une ligne datant de trois ans. Que se passe-t-il ?`,
      options: [
        "Tout le monde le voit : la page modifiée ne correspond plus à l'empreinte inscrite sur la page suivante",
        "Rien — les vieilles pages sont trop lointaines pour que quiconque les vérifie",
        "Le livre se répare tout seul et la modification disparaît en silence",
      ],
      answer: 0,
      explain: `C'est tout l'intérêt d'enchaîner les pages. L'historique n'est pas protégé par une serrure ni par un mot de passe — il est protégé par le fait que le modifier *se voit*. La copie des autres conserve les empreintes d'origine, et la vôtre cesse de correspondre.`,
    },
    {
      kind: "theory",
      body: `## Correctif 3 : qui écrit la page suivante ?

Douze copies suffisent entre amis. Imaginez maintenant des milliers d'inconnus, dispersés dans le monde, qui ne se font pas confiance — et une nouvelle ligne qui arrive toutes les quelques secondes.

Qui a le droit de l'inscrire ? Si tous écrivent en même temps, quelle version est la vraie ?

Chaque réseau de ce type existe pour répondre à cette unique question, et la réponse est ce qui les distingue. Certains organisent une loterie tranchée par la puissance de calcul brute. **Stellar organise un vote :** chaque participant désigne ceux qu'il juge fiables, et une ligne devient réelle quand ces cercles se recoupent assez pour s'accorder.

La conséquence pratique mérite d'être retenue : une nouvelle page toutes les **5 secondes environ**, et des frais par mouvement si faibles qu'ils se mesurent en fractions de centime.`,
    },
    {
      kind: "quiz",
      question: `Pourquoi un registre partagé a-t-il besoin d'une règle sur *qui écrit la page suivante* ?`,
      options: [
        "Parce que des milliers d'inconnus reçoivent des mouvements en même temps et doivent aboutir au même livre",
        "Parce qu'écrire coûte cher et que quelqu'un doit payer le papier",
        "Parce que seul l'auteur d'origine du livre a le droit d'y ajouter des lignes",
      ],
      answer: 0,
      explain: `Le difficile, c'est l'accord, pas le stockage. Copier une liste est facile ; obtenir que des milliers de machines qui ne se font pas confiance s'accordent sur la *même* liste, dans le même ordre, est le problème que chacun de ces réseaux a été bâti pour résoudre. Vous le démonterez pour de bon dans le Royaume — et vous le casserez même exprès.`,
    },
    {
      kind: "fill",
      prompt: `Complétez la phrase qui définit la chose :`,
      file: "NOTES.md",
      before: `Une blockchain est une liste de mouvements que beaucoup de gens détiennent à la fois, où chaque page porte une empreinte de la précédente — de sorte que modifier l'historique `,
      after: ` .`,
      choices: [
        "est immédiatement visible par tous",
        "coûte de petits frais",
        "exige un mot de passe",
        "est impossible par les mathématiques",
      ],
      answer: 0,
      explain: `Méfiez-vous de la dernière : c'est le mythe. L'historique n'est pas *impossible* à modifier ; il est impossible à modifier **discrètement**. Tout le reste repose sur cette distinction.`,
    },
    {
      kind: "theory",
      body: `## Alors, qu'est-ce que Stellar ?

L'un de ces livres — bâti spécifiquement pour **la valeur qui circule entre les gens**.

Pas un ordinateur mondial généraliste, pas une machine à spéculer : un registre conçu pour qu'envoyer de l'argent au-delà d'une frontière coûte une fraction de centime, se règle en cinq secondes environ, et fonctionne pareil pour dix centimes ou dix millions.

Tout ce que vous rencontrerez plus loin — comptes, paiements, jetons, contrats — est une ligne, ou une règle sur les lignes, dans ce même livre partagé.

**Ensuite :** si le livre est public et que n'importe qui peut y écrire, qu'est-ce qui empêche un inconnu de dépenser *votre* argent ? La réponse est une clé — et elle n'a rien d'un mot de passe.`,
    },
  ],
};
