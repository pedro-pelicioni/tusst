// Login page.
export const auth = {
  metaTitle: "Iniciar sesión — TUSST",
  kicker: "tu viaje empieza aquí",
  signIn: "Entra al reino",
  tagline: "Inicia sesión para guardar tu héroe, tu XP y cada misión que superes.",
  note: "Sin contraseña, sin formularios: un clic y ya estás en el mapa.",
  backHome: "← Volver al inicio",
  privacyLink: "Cómo tratamos tus datos",
  continueTo: "Te llevaremos de vuelta a donde estabas.",
  errors: {
    title: "La puerta no se abrió",
    OAuthAccountNotLinked:
      "Este email ya está vinculado a otro método de acceso. Usa el proveedor con el que te registraste la primera vez.",
    OAuthCallbackError: "El proveedor no respondió. Inténtalo de nuevo en un momento.",
    OAuthSignin: "No pudimos iniciar el acceso con ese proveedor. Inténtalo de nuevo.",
    AccessDenied: "El proveedor denegó el acceso. Inténtalo de nuevo o usa el otro proveedor.",
    Configuration: "El inicio de sesión está mal configurado de nuestro lado. Inténtalo de nuevo en unos minutos.",
    Verification: "Ese enlace de acceso expiró o ya fue usado. Solicita uno nuevo.",
    default: "Algo salió mal al iniciar sesión. Inténtalo de nuevo.",
  },
  continueWithGitHub: "Continuar con GitHub",
  continueWithDiscord: "Continuar con Discord",
  emailPlaceholder: "tu@email.com",
  emailMagicLink: "Envíame un enlace mágico",
  devLogin: "acceso dev",
  devNamePlaceholder: "elige un nombre",
  devContinue: "Continuar",
  noProviders:
    "No hay proveedores de autenticación configurados. Define AUTH_DEV_LOGIN=true en desarrollo local (o las variables de entorno de GitHub / Discord / email) para habilitar el inicio de sesión.",
};
