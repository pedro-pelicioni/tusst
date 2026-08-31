import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Des machines qui tiennent parole",
  tagline: "Un contrat est une règle qui s'exécute seule — rien de plus mystique.",
  steps: [
    {
      kind: "theory",
      body: `## Le distributeur automatique le faisait déjà

Un distributeur automatique est une promesse sans personne derrière : *mettez 3, appuyez sur B4, recevez les chips.* Il ne vous apprécie pas, ne vérifie pas votre nom, ne décide pas si aujourd'hui est un bon jour pour honorer l'accord. La règle, c'est la machine.

Comparez à une promesse tenue par une personne — un propriétaire qui rend une caution, une place de marché qui libère un paiement à la livraison. Ces promesses sont réelles aussi, mais elles dépendent de quelqu'un qui *choisit* de les tenir, et d'un endroit où se plaindre s'il ne le fait pas.

Un **contrat** sur un registre partagé, c'est le premier cas : le distributeur automatique, pour de l'argent et des règles, installé dans le livre du Chapitre I.`,
    },
    {
      kind: "theory",
      body: `## Ce que c'est vraiment

Ôtez le mystère et un contrat, ce sont trois choses ordinaires :

- **Un endroit du livre qui détient de la valeur.** Il peut posséder des fonds comme un compte, et il a une adresse comme n'importe quel compte.
- **Un ensemble figé de règles** — « si ceci, alors cela » — écrites une fois puis publiées, lisibles par tous.
- **Aucune main.** Il n'agit que lorsqu'on le pousse avec une instruction signée, et lorsqu'il agit, il suit ses règles à la lettre.

Personne ne le « fait tourner ». Aucun serveur à éteindre, aucune société à contacter, aucun opérateur avec un droit de dérogation. Une fois dans le livre, des milliers de machines l'exécutent à l'identique et s'accordent sur le résultat.`,
    },
    {
      kind: "diagram",
      body: "La machine entière, de bout en bout :",
      caption: "Quatre étapes, et la personne n'apparaît que dans la première.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "poke",
            label: "une instruction signée arrive",
            note: "Rien ne se passe tant que personne ne le pousse. Un contrat n'a pas de mains.",
            tone: "accent",
          },
          {
            id: "rules",
            label: "il vérifie ses règles",
            note: "Les mêmes règles que tout le monde peut lire. Aucun jugement, aucune exception.",
            tone: "neutral",
          },
          {
            id: "move",
            label: "il déplace de la valeur",
            note: "Il détient des fonds comme un compte, et ne les déplace que selon ses règles.",
            tone: "teal",
          },
          {
            id: "book",
            label: "la ligne est dans le livre",
            note: "Permanente, publique et impossible à défaire — y compris quand la règle était fausse.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Quel arrangement du quotidien ressemble le plus au comportement d'un contrat ?`,
      options: [
        "Un distributeur automatique : règles figées, aucun jugement, il n'agit que si l'on y met quelque chose",
        "Un vendeur serviable : il lit la situation et décide au cas par cas ce qui est juste",
        "Un accord signé sur papier : écrit, mais qu'un tribunal fera respecter plus tard",
      ],
      answer: 0,
      explain: `Le vendeur a du jugement et le papier a besoin d'une autorité pour l'appliquer. Un contrat n'a ni l'un ni l'autre — l'exécution *est* l'application. C'est sa force et, comme vous allez le voir, son tranchant le plus vif.`,
    },
    {
      kind: "theory",
      body: `## Ce qu'il ne peut pas faire (cette liste compte davantage)

Les débutants surestiment les contrats de quatre façons précises, et il vaut mieux les désapprendre dès maintenant :

- **Il ne sait rien du monde extérieur.** Ni le cours du dollar aujourd'hui, ni si le colis est arrivé, ni la météo. Quelqu'un doit lui *envoyer* cette information — et choisir qui a le droit de le faire est une décision aux conséquences bien réelles.
- **Il ne peut pas changer d'avis.** Pas de « mais évidemment je voulais dire… ». Il fait ce qui est écrit, à la lettre.
- **Il ne peut pas être défait.** Un mouvement qu'il a effectué est une ligne du livre. Il n'y a pas d'annulation.
- **Il n'est pas privé.** Ses règles et chacun de ses mouvements sont publics, pour toujours, pour qui veut regarder.`,
    },
    {
      kind: "quiz",
      question: `Un contrat est écrit pour libérer des fonds « après l'échéance ». Son auteur voulait dire, dans sa tête, *l'acheteur demande et reçoit* ; le contrat tel qu'il est écrit libère au premier qui demande. Dès le premier jour, un inconnu demande en premier et reçoit.

Qu'est-ce qui a échoué ?`,
      options: [
        "La règle écrite a été honorée — l'intention qui n'a jamais été écrite n'existait tout simplement pas",
        "Le contrat a dysfonctionné et devrait être annulé",
        "L'inconnu a enfreint une règle et peut être signalé",
      ],
      answer: 0,
      explain: `Rien n'a dysfonctionné, et c'est là le point inconfortable. La machine a tenu la promesse qu'on lui a donnée, pas celle qui était dans la tête de son auteur. Les intentions non écrites n'ont ici aucune force.`,
    },
    {
      kind: "fill",
      prompt: `Complétez la phrase à retenir de ce chapitre :`,
      file: "NOTES.md",
      before: `Un contrat tient `,
      after: ` .`,
      choices: [
        "la promesse que vous avez écrite, pas celle que vous vouliez dire",
        "vos fonds à l'abri de tous les bugs possibles",
        "un registre privé que vous seul pouvez lire",
        "la promesse qu'un tribunal jugera la plus équitable",
      ],
      answer: 0,
      explain: `Chaque incident coûteux de cette industrie est une variation de cette seule ligne. C'est pourquoi le tronçon suivant de la route ne commence pas par du code.`,
    },
    {
      kind: "labLink",
      labSlug: "treasure-chest",
      body: `Vous pouvez voir l'une de ces machines tenir une promesse sur le vrai testnet, dès maintenant. Le laboratoire **Le Coffre au Trésor** de la Forge enferme des fonds dans une entrée du registre qui n'appartient à personne — jusqu'à ce que l'unique réclamant nommé la prenne. Pas d'agent séquestre, pas d'entreprise qui retient l'argent, personne qui *pourrait* changer d'avis. La règle libère, ou rien ne libère.`,
    },
    {
      kind: "theory",
      body: `## Pourquoi c'est le dernier chapitre facile

Vous tenez maintenant tout le rez-de-chaussée : un livre que personne ne modifie en silence, une clé qui prouve qui vous êtes, et des machines qui tiennent des promesses écrites exactement telles qu'elles ont été écrites.

Regardez ce que cela donne. Si la machine fait précisément ce qui a été écrit — sans discussion, sans correction, sans retour en arrière — alors **l'écriture est le métier**. Pas la frappe : une IA tape plus vite que vous et ne fatigue jamais. Mais décider, trancher, fixer le « qu'est-ce qui doit être vrai ici, et qu'est-ce qui ne doit jamais arriver ».

**Ensuite, sur la route de l'Artisanat :** comment écrire cela correctement, avant qu'une seule ligne de code n'existe. Et sur la route du Royaume : la machinerie de Stellar elle-même, de la façon dont des milliers de machines s'accordent jusqu'aux contrats que vous venez de rencontrer — cette fois de l'intérieur.`,
    },
  ],
  testOut: [
    { question: `Qu'est-ce qui distingue un contrat d'une promesse tenue par une personne ?`,
      options: ["Il exécute ses propres règles, sans que personne ne choisisse de les honorer","Il est écrit, alors qu'une promesse orale ne l'est pas","Il peut être réclamé en justice, contrairement à une promesse"], answer: 0 },
    { question: `Qui exécute un contrat publié ?`,
      options: ["Personne en particulier — des milliers de machines l'exécutent à l'identique et s'accordent sur le résultat","L'auteur, sur un serveur qu'il garde allumé pour cela","Les opérateurs du réseau, à tour de rôle"], answer: 0 },
    { question: `Quand un contrat agit-il ?`,
      options: ["Uniquement quand quelqu'un le sollicite avec une instruction signée","En continu, en vérifiant ses conditions en arrière-plan","Une fois par jour, quand le réseau balaie les règles stockées"], answer: 0 },
    { question: `L'auteur peut-il éteindre un contrat déjà publié ?`,
      options: ["Non, sauf si les règles publiées du contrat le prévoient elles-mêmes","Oui — l'auteur garde toujours une dérogation","Seulement en demandant aux opérateurs du réseau de le retirer"], answer: 0 },
  ],
};
