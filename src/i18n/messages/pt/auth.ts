// Página de login.
export const auth = {
  metaTitle: "Entrar — TUSST",
  kicker: "sua jornada começa aqui",
  signIn: "Entre no reino",
  tagline: "Entre para salvar seu herói, seu XP e cada missão que você concluir.",
  note: "Sem senha, sem formulário — um clique e você está no mapa.",
  backHome: "← Voltar para a página inicial",
  privacyLink: "Como tratamos seus dados",
  continueTo: "Você será levado de volta para onde estava.",
  errors: {
    title: "O portão não abriu",
    OAuthAccountNotLinked:
      "Este e-mail já está vinculado a outro método de login. Use o provedor com o qual você se cadastrou primeiro.",
    OAuthCallbackError: "O provedor não respondeu. Tente de novo em instantes.",
    OAuthSignin: "Não conseguimos iniciar o login com esse provedor. Tente de novo.",
    AccessDenied: "O provedor negou o acesso. Tente de novo ou use o outro provedor.",
    Configuration: "O login está mal configurado do nosso lado. Tente de novo em alguns minutos.",
    Verification: "Esse link de login expirou ou já foi usado. Peça um novo.",
    default: "Algo deu errado ao entrar. Tente de novo.",
  },
  continueWithGitHub: "Continuar com GitHub",
  continueWithDiscord: "Continuar com Discord",
  emailPlaceholder: "voce@email.com",
  emailMagicLink: "Me envie um link mágico por e-mail",
  devLogin: "login de dev",
  devNamePlaceholder: "escolha um nome",
  devContinue: "Continuar",
  noProviders:
    "Nenhum provedor de autenticação está configurado. Defina AUTH_DEV_LOGIN=true no dev local (ou as variáveis de ambiente de GitHub / Discord / e-mail) para habilitar o login.",
};
