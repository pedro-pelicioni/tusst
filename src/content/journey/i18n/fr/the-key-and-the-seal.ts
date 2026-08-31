import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La clé et le sceau",
  tagline: "Clés et signatures : votre compte est une clé, signer est un sceau.",
  steps: [
    {
      kind: "theory",
      body: `## Un mot de passe est une promesse tenue par quelqu'un d'autre

Quand vous vous connectez à votre banque, vous tapez un mot de passe et la banque le *vérifie*. Chaque partie de cette phrase cache une dépendance : la banque détient la liste, la banque décide que vous êtes vous, la banque peut vous bloquer, et si sa liste fuite, votre mot de passe aussi.

Le livre partagé du chapitre précédent ne contient aucune banque. Il n'y a personne assis derrière pour vérifier quoi que ce soit.

Il utilise donc mieux : non pas un secret que vous *confiez* à quelqu'un, mais un secret dont vous *prouvez la possession* — **sans jamais le montrer**.`,
    },
    {
      kind: "theory",
      body: `## Une clé, deux moitiés

Votre compte est une paire de moitiés assorties, créées ensemble, sur votre propre appareil :

- La moitié **publique** est votre adresse. Elle ressemble à \`GABC…7XQ\`. Partagez-la librement — c'est là qu'on vous envoie des choses, exactement comme une adresse e-mail. La publier n'est pas un risque ; c'est toute sa raison d'être.
- La moitié **secrète** ne quitte jamais vos mains. Elle ressemble à \`SDXY…4KP\`. C'est elle qui *déplace* ce que l'adresse détient.

Deux moitiés, une relation : la moitié publique peut toujours être dérivée de la secrète, et **jamais l'inverse**. Ce sens unique est ce sur quoi tout l'édifice repose.

Une image utile : votre adresse est la boîte aux lettres que tout le monde voit, votre clé secrète est la seule qui l'ouvre.`,
    },
    {
      kind: "quiz",
      question: `Une place de marché demande « votre adresse Stellar » pour vous payer. Quelle moitié envoyez-vous ?`,
      options: [
        "La publique, celle qui commence par G — c'est une adresse, faite pour être partagée",
        "La secrète, celle qui commence par S — sinon le paiement ne peut pas arriver",
        "Aucune : les adresses sont privées et les paiements se règlent par e-mail",
      ],
      answer: 0,
      explain: `Recevoir ne demande rien d'autre que votre adresse. Si quelqu'un prétend qu'un paiement exige votre clé secrète, la demande elle-même est l'arnaque — et vous la reconnaissez désormais du premier coup d'œil.`,
    },
    {
      kind: "theory",
      body: `## Signer : un sceau infalsifiable

C'est ici que la moitié secrète justifie son existence. Pour déplacer quelque chose, vous écrivez l'instruction — *« envoie 10 à Bruno »* — et votre appareil la **scelle** avec votre clé secrète.

Le sceau a trois propriétés, à lire lentement :

1. **Seule votre clé a pu le produire.** Personne ne le falsifie.
2. **N'importe qui peut le vérifier** face à votre adresse publique, sans jamais voir votre moitié secrète.
3. **Il couvre exactement cette instruction.** Changez un chiffre du montant et le sceau se défait.

Voilà une **signature**. Le réseau ne vous connaît pas, ne vous fait pas confiance et n'en a pas besoin — il vérifie simplement que le sceau correspond à l'adresse d'où l'argent sort.`,
    },
    {
      kind: "widget",
      component: "seal-sign",
      body: `Essayez. Écrivez quelque chose, scellez-le — puis changez un seul caractère et regardez le sceau cesser de correspondre.`,
    },
    {
      kind: "theory",
      body: `## Le moment où les gens perdent tout

Comme il n'y a pas de banque derrière le livre, il n'y a pas non plus de « mot de passe oublié », pas de service client, pas d'annulation. Cela tranche des deux côtés, et l'honnêteté sur ce fil vaut mieux que l'enthousiasme :

- **Clé secrète perdue → les fonds restent là pour toujours, visibles de tous, atteignables par personne.** Ils ne sont pas « dans » la clé ; la clé est simplement la seule chose capable de les déplacer.
- **Clé secrète obtenue par un autre → cette personne est vous.** Aucun recours n'existe, car pour le réseau rien d'anormal ne s'est produit : un sceau valide a déplacé des fonds valides.

D'où la seule règle qui survit à toutes les arnaques jamais montées dans ce milieu : **personne de légitime n'a jamais besoin de votre clé secrète.** Ni le support, ni un airdrop, ni une « validation de portefeuille », ni un admin de groupe. Pas une fois, jamais.`,
    },
    {
      kind: "quiz",
      question: `Quelqu'un vous écrit en se présentant comme « le support du réseau », dit que votre compte est bloqué et réclame votre clé secrète (ou vos 24 mots de récupération) pour le débloquer. Que se passe-t-il réellement ?`,
      options: [
        "C'est un vol — personne d'autre que vous n'a besoin d'une clé secrète, et la donner revient à donner le compte",
        "C'est la procédure — le support a besoin de la clé pour signer le déblocage à votre place",
        "C'est sans risque tant que vous changez la clé juste après",
      ],
      answer: 0,
      explain: `Il n'y a pas de troisième réponse. Chaque variante de ce message — support, airdrops, « validation de portefeuille », un inconnu sympathique — est le même vol sous un autre costume. La règle n'a aucune exception à mémoriser, et c'est exactement pour cela qu'elle marche.`,
    },
    {
      kind: "fill",
      prompt: `Complétez la règle qui garde un compte en sécurité :`,
      file: "NOTES.md",
      before: `Partagez la clé publique librement ; la clé secrète `,
      after: ` .`,
      choices: [
        "ne quitte jamais votre appareil",
        "n'est confiée qu'au support vérifié",
        "s'envoie par e-mail à soi-même en guise de sauvegarde",
        "est publiée avec la transaction",
      ],
      answer: 0,
      explain: `Et « se l'envoyer par e-mail » est la réponse piège : une boîte de réception est une copie de votre clé dans le bâtiment d'une autre entreprise, protégée par un mot de passe. Sauvegardez une clé hors ligne, sur papier ou sur un appareil — ou pas du tout.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Assez de théorie — allez en créer une. **Votre Premier Portefeuille**, dans la Forge, génère une vraie paire de clés, finance le compte sur le réseau de test de Stellar et vous montre le compte apparaître comme une ligne du livre partagé, quelques secondes après votre signature. Réseau de test, argent fictif, machinerie réelle.`,
    },
    {
      kind: "theory",
      body: `## Ce que vous tenez maintenant

Un compte est une paire de clés. Une adresse est la moitié qui se partage. Une signature est le sceau que seule votre moitié secrète peut produire et que n'importe qui peut vérifier. Perdre cette moitié est définitif, et personne d'honnête ne vous la demandera.

**Ensuite :** le livre peut contenir plus que des soldes. Il peut contenir des *règles* — et ces règles s'exécutent d'elles-mêmes, sans personne au milieu pour décider de les honorer.`,
    },
  ],
  testOut: [
    { question: `Que prouve réellement une signature ?`,
      options: ["Que le détenteur de la clé privée a approuvé exactement ce message","Que le message provient d'un appareil de confiance","Que le réseau a vérifié l'identité de l'expéditeur avant de l'accepter"], answer: 0 },
    { question: `Un inconnu possède votre adresse publique. Que peut-il en faire ?`,
      options: ["Vous envoyer de la valeur et vérifier vos signatures — rien d'autre","Dépenser depuis votre compte s'il sait aussi quand vous avez signé la dernière fois","Déduire votre clé privée, avec assez de temps"], answer: 0 },
    { question: `Pourquoi une clé n'est-elle pas simplement un mot de passe avec des étapes en plus ?`,
      options: ["Un mot de passe est montré à un service qui le vérifie ; une clé ne quitte jamais votre côté et produit une preuve à la place","Une clé est plus longue, il faut donc plus d'essais pour la deviner","Un mot de passe est réinitialisé par le support, et une clé par le réseau"], answer: 0 },
    { question: `Vous changez un caractère du message après l'avoir signé. Que se passe-t-il ?`,
      options: ["La signature cesse de correspondre — elle couvre le message entier, pas un morceau","Rien, tant que le changement est plus petit que la signature","La signature se met à jour pour couvrir le nouveau texte"], answer: 0 },
  ],
};
