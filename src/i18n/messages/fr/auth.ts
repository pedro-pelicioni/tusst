// Login page.
export const auth = {
  metaTitle: "Connexion — TUSST",
  kicker: "ton voyage commence ici",
  signIn: "Entrer dans le Royaume",
  tagline: "Connecte-toi pour sauvegarder ton héros, ton XP et chaque mission que tu termines.",
  note: "Pas de mot de passe, pas de formulaire — un clic et te voilà sur la carte.",
  backHome: "← Retour à l'accueil",
  continueTo: "On te ramènera là où tu en étais.",
  errors: {
    title: "La porte ne s'est pas ouverte",
    OAuthAccountNotLinked:
      "Cet email est déjà lié à une autre méthode de connexion. Utilise le fournisseur avec lequel tu t'es inscrit la première fois.",
    OAuthCallbackError: "Le fournisseur n'a pas répondu. Réessaie dans un instant.",
    OAuthSignin: "Impossible de lancer la connexion avec ce fournisseur. Réessaie.",
    AccessDenied: "Le fournisseur a refusé l'accès. Réessaie ou utilise l'autre fournisseur.",
    Configuration: "La connexion est mal configurée de notre côté. Réessaie dans quelques minutes.",
    Verification: "Ce lien de connexion a expiré ou a déjà été utilisé. Demande-en un nouveau.",
    default: "Un problème est survenu pendant la connexion. Réessaie.",
  },
  continueWithGitHub: "Continuer avec GitHub",
  continueWithDiscord: "Continuer avec Discord",
  emailPlaceholder: "toi@email.com",
  emailMagicLink: "Recevoir un lien magique par email",
  devLogin: "connexion dev",
  devNamePlaceholder: "choisis un nom",
  devContinue: "Continuer",
  noProviders:
    "Aucun fournisseur d'authentification n'est configuré. Définis AUTH_DEV_LOGIN=true en dev local (ou les variables d'env GitHub / Discord / email) pour activer la connexion.",
};
