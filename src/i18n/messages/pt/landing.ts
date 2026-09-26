// Landing page (cenas ilustradas).
// Strings de marca (TUSST, tagline, lema e nomes dos campeões) ficam em
// inglês em todos os idiomas, de propósito.
export const landing = {
  metaDescription:
    "Desafios práticos e gamificados de programação. Domine Rust e depois publique contratos Soroban reais na Stellar. Sem configuração — é só programar.",
  metaImageAlt: "TUSST — uma aventura em pixel art para dominar Rust e Stellar",
  nav: {
    why: "Por quê",
    map: "O Mapa",
    champions: "Campeões",
    forge: "A Forja",
    enterRealm: "Entrar",
    openMenu: "Abrir menu de navegação",
    closeMenu: "Fechar menu de navegação",
  },
  hero: {
    kicker: "uma aventura em pixel art para dominar Rust e Stellar",
    subtitle: "The Ultimate Stellar Supreme Tutorial",
    tagline:
      "Domine Rust, depois forje contratos Soroban na Stellar — oito atos, oito campeões, um horror de muitos olhos.",
    ctaPrimary: "Começar a jornada",
    ctaContinue: "Continuar a jornada",
    ctaEnter: "Já tenho conta · entrar",
    ctaSecondary: "Abrir a Forja",
    ctaSecondaryBadge: "sem login",
    freeLine: "grátis · sem configuração · no navegador",
    scrollHint: "descer",
  },
  // Por que aprender do jeito antigo — a resposta a "pra que, se a IA escreve o código?".
  // Conta a verdade sobre o fenômeno, nunca sobre um caso: nenhum programa, time ou rede
  // é citado, e a Stellar só aparece como o motivo de a base importar.
  why: {
    eyebrow: "A IA já coda. Por que aprender a base?",
    titleTop: "A IA escreve o código.",
    titleBottom: "Quem assina é você.",
    lead: "Porque a IA escreve código, mas não assume a bronca. Não dá pra pegar no review um bug que você nem sabe que pode existir — e, na era da IA, revisar virou o seu trabalho. Quando um pagamento de verdade falha, ninguém aceita \"foi o prompt\": a pergunta cai no seu colo.",
    truthKicker: "O que o código rodando esconde",
    truth: "Em toda chain, tem gente subindo pra mainnet, captando investimento e guardando dinheiro dos outros sem saber o básico do que construiu. Fecha a aba da IA, pergunta por que funciona e vem o silêncio.",
    truthNote: "A culpa é do atalho, não das pessoas. Código rodando passa por entendimento, principalmente pra quem fez. Nada avisa o que você pulou, até o dinheiro ser de verdade e alguém perguntar por quê. Essa pergunta ninguém faz pra IA.",
    quizKicker: "Sua vez. Sem colar da IA.",
    quizNewcomer: "Travou nas três? Isso é ponto de partida, não sentença. Cada resposta é um capítulo grátis de uma trilha que começa do zero.",
    reveal: "Revelar a resposta",
    taughtIn: "Ensinado em",
    questions: [
      {
        topic: "Trustlines",
        q: "Seu app manda USDC pra conta recém-criada de um usuário. Falha. O que faltou?",
        a: "Uma trustline: o opt-in da conta, registrado no ledger, pra guardar um ativo de um emissor específico. A própria conta assina um change_trust, que bloqueia uma reserva base (0,5 XLM). Sem trustline, um pagamento clássico falha com op_no_trust: a conta nunca aceitou USDC.",
        chapterSlug: "accounts-trust-and-assets",
      },
      {
        topic: "Ciclo de vida da transação",
        q: "Seu app avisa: \"a transação falhou, nada foi cobrado\". Isso é verdade?",
        a: "Nem sempre. Barrada na porta (assinatura ruim, sequência errada, taxa baixa): não custa nada. Se entrou num ledger e uma operação falhou, os efeitos são revertidos, mas a taxa é cobrada e a sequência, gasta. Aquele envelope já era: monte outro e reassine.",
        chapterSlug: "the-fate-of-an-envelope",
      },
      {
        topic: "Arquivamento de estado",
        q: "Seu contrato guarda saldos de usuários. O TTL venceu. Cadê o dinheiro?",
        a: "Depende do armazenamento que você escolheu. Entradas persistentes e de instância são arquivadas, não perdidas: voltam intactas, é só pagar a taxa. Temporárias são apagadas, sem volta a preço nenhum. Guardou saldo ali? O registro de quanto é de quem sumiu de vez.",
        chapterSlug: "the-heartbeat-and-the-bill",
      },
    ],
    multiplier: "A IA multiplica o que você sabe. E mil vezes zero dá zero.",
    closing: "A TUSST também usa IA: mentor nas dicas, examinador nas specs. O inimigo nunca foi a ferramenta. É assinar sem entender. A Stellar move dinheiro de verdade: pagamentos, remessas, stablecoins. A TUSST forja a nova geração da Stellar: builders que respondem por cada linha.",
    cta: "Aprenda o que você assina",
  },
  carousel: {
    kicker: "O Elenco",
    heading: "Escolha seu herói",
    body: "Sete campeões andam pela ilha — um deles é você. Cada missão concluída rende XP, e cada nível faz seu herói evoluir por oito formas, de aprendiz a lenda. É só visual: sua escolha não trava nada.",
    formsLabel: "8 formas · evoluem com o seu nível",
    cta: "Escolher meu herói",
    previous: "Anterior",
    next: "Próximo",
  },
  map: {
    eyebrow: "O mapa-múndi",
    titleTop: "Três ilhas.",
    titleBottom: "Comece pela primeira.",
    body: "A Jornada do Construtor é a porta de entrada: os fundamentos, como a Stellar funciona de verdade e o ofício que a IA não faz por você — toda missão aberta desde o primeiro dia. A Ilha Enferrujada e o Porto ficam ali para quando você quiser ir mais fundo.",
    cta: "Abrir o mapa",
    tagStart: "Comece aqui",
    tagOptional: "Opcional",
    tagDeep: "Mais fundo",
    mapAlt: "O mapa-múndi da TUSST: a Ilha do Construtor, a Ilha Enferrujada, o Porto e a ilhota da Forja",
  },
  features: {
    forge: {
      eyebrow: "sem login · sem configuração",
      titleTop: "A Forja",
      titleBottom: "Está Aberta",
      body: "Uma ferraria Soroban completa no navegador: escreva, compile, teste e implante contratos reais na testnet — com o Corvo, o mentor de IA, grasnando dicas sempre que uma execução falha.",
      cta: "Abrir a Forja",
      ctaBadge: "sem login",
    },
  },
  cta: {
    titleTop: "A ilha te espera.",
    titleBottom: "Sua primeira missão também.",
    body: "Grátis, no navegador, sem configuração. A primeira missão leva uns dez minutos — e começa do zero.",
    button: "Começar a jornada",
    altPrefix: "Ou vá direto para a bigorna —",
    altLink: "abra a Forja",
    altSuffix: ", sem precisar de login.",
  },
  footer: {
    tagline: "the ultimate stellar supreme tutorial",
    motto: "nothing left unhandled",
  },
  a11y: {
    carouselLabel: "Heróis jogáveis",
    prevCard: "Herói anterior",
    nextCard: "Próximo herói",
    goToCard: "Ir para {name}",
    cardStatus: "{name} — herói {index} de {total}",
    formsList: "As oito formas de {name}",
  },
};
