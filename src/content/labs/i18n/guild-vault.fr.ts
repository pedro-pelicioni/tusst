import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Le Coffre de la Guilde",
    tagline: "Seuils multisig — un trésor qui exige deux officiers.",
  },
  steps: {
    intro: {
      body: `## Une seule clé est un point unique de défaillance

Tout ce que vous avez signé jusqu'ici n'a demandé qu'une signature : la vôtre. Cela convient à un compte de jeu et devient imprudent pour un trésor — la clé qui déplace tout est aussi celle qu'on peut vous voler, que vous pouvez perdre, ou qu'on peut vous extorquer.

La réponse habituelle sur d'autres chaînes est de déployer un contrat multisig. Sur Stellar, vous ne déployez rien : **chaque compte possède déjà des signataires et des seuils**. Relever la barre est un réglage.`,
    },
    "forge-keys": {
      title: "Le premier officier",
      body: `Votre propre paire de clés — le compte qui deviendra le coffre.`,
      cta: "Préparer les clés",
      successBody: `Le coffre sera \`{address}\`.`,
    },
    fund: {
      title: "Financez le coffre",
      body: `Les signataires sont des sous-entrées, et les sous-entrées coûtent de la réserve. Un coffre sans XLM ne peut pas s'offrir un second officier.`,
      cta: "Appeler Friendbot",
      successBody: `Financé : {balance} XLM.`,
    },
    weights: {
      body: `## Des poids, pas des rôles

Stellar n'a pas la notion d'« admin ». Elle a de l'arithmétique.

Chaque signataire porte un **poids**. Chaque type d'opération est gardé par l'un de trois **seuils** — bas, moyen, haut. Une transaction est autorisée quand les poids de ses signatures atteignent le seuil de l'opération qu'elle porte.

- **Bas** — ouvrir une trustline, avancer la séquence.
- **Moyen** — paiements, offres, presque tout le quotidien.
- **Haut** — modifier les signataires et les seuils eux-mêmes.

Votre compte à l'instant : un signataire (la clé maîtresse) au poids 1, tous les seuils à 0. Une signature suffit à tout.`,
    },
    "second-officer": {
      title: "Nommez le second officier",
      body: `Une seconde paire de clés. Seule l'adresse **publique** compte ici — le coffre doit savoir qui peut cosigner, pas le secret de cette personne.`,
      cta: "Nommer un officier",
      successBody: `Le second officier est \`{companion}\`.

Cette adresse va être inscrite dans l'entrée même du coffre au registre, à côté de la vôtre.`,
    },
    "quiz-threshold": {
      question: `Vous ajoutez l'officier au poids 1 et fixez le seuil **moyen** à 2. Que peut faire votre clé maîtresse seule à partir de là ?`,
      options: [
        "Rien qui exige le moyen — un paiement demande désormais les deux signatures",
        "Tout, puisque la clé maîtresse passe toujours outre les seuils",
        "Seulement les opérations qu'elle avait signées avant le changement",
      ],
      explain: `Il n'y a pas de passe-droit. La clé maîtresse n'est qu'un signataire avec un poids, et si son poids seul n'atteint pas le seuil, sa signature seule ne suffit pas. C'est toute la propriété de sûreté — et tout le piège dont l'étape suivante se méfie.`,
    },
    "raise-the-bar": {
      title: "Relevez la barre",
      body: `Une seule opération fait tout : ajouter l'officier au poids 1, garder votre clé maîtresse au poids 1, et porter le **moyen** à 2.

Remarquez ce qui reste délibérément intact : le seuil **haut** demeure à 0, donc vous pouvez encore défaire cet arrangement avec une seule signature. Relever le haut en même temps que le moyen, c'est ainsi qu'on s'enferme dehors de son propre coffre, définitivement.`,
      cta: "Définir les seuils",
      successBody: `Le coffre est scellé.

Deux signataires, chacun au poids 1, et un seuil moyen de 2. Désormais un paiement depuis ce compte exige les **deux** officiers — et c'est le registre qui l'impose, pas votre document de procédure.

Ouvrez l'onglet **Compte** de la Forge sur cette adresse : les signataires et les seuils y sont, exactement tels que la chaîne les voit.`,
    },
    "quiz-lockout": {
      question: `Une guilde met le moyen **et** le haut à 3, avec trois officiers au poids 1. Un officier perd sa clé. Dans quel état se trouve ce coffre ?`,
      options: [
        "Gelé pour toujours — changer les signataires exige le haut, et le haut n'est plus atteignable",
        "Sans souci : les deux restants peuvent destituer la clé perdue",
        "Sans souci : la clé maîtresse peut toujours réinitialiser les signataires",
      ],
      explain: `C'est de loin la façon la plus courante dont meurt un vrai trésor. La règle qui vous protège du voleur protège tout aussi bien son absence. Gardez toujours une voie de récupération dont le seuil reste atteignable.`,
    },
    "claim-xp": {
      body: `Vous avez transformé un compte ordinaire en trésor deux-sur-deux sans déployer une ligne de code.

Le serveur va lire ce compte sur la chaîne et le vérifier lui-même : au moins deux signataires, seuil moyen au moins 2.`,
    },
  },
} satisfies LabTextOverlay;
