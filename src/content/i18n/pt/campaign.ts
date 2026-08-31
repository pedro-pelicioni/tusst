import type { ActText, CardText, SkirmishText } from "../types";

// Localized campaign narrative. Card NAMES and act numerals stay as-is.
export const actText: Record<string, ActText> = {
  "rust-fundamentals": {
    title: "Fundamentos de Rust",
    territory: "sintaxe, tipos, ownership",
    overlord: null,
    synopsis:
      "O térreo da linguagem: impressão, bindings e mutabilidade, tipos, funções, e as regras de ownership e borrowing das quais todo o resto depende.",
  },
  "control-flow": {
    title: "Controle de fluxo",
    territory: "ramificações, match, laços",
    overlord: null,
    synopsis:
      "Ramificação e repetição em Rust, incluindo `match` exaustivo — o mecanismo que torna seguro tratar `Option` e `Result` mais adiante.",
  },
  "rust-standard-library": {
    title: "A biblioteca padrão",
    territory: "coleções, iteradores, structs",
    overlord: null,
    synopsis:
      "Os tipos que você vai usar todo dia: `Vec`, `HashMap`, strings e slices, iteradores, e dar comportamento aos seus próprios tipos com `impl`.",
  },
  "mastering-option": {
    title: "Option<T>",
    territory: "a ausência, modelada como tipo",
    overlord: null,
    synopsis:
      "Rust não tem null. `Option<T>` transforma 'pode não haver nada aqui' num caso que o compilador te obriga a tratar.",
  },
  "mastering-result": {
    title: "Result<T, E>",
    territory: "a falha, modelada como valor",
    overlord: null,
    synopsis:
      "Erros são valores, não exceções. Faça match, converta e propague com `?` em vez de desenrolar uma pilha.",
  },
  "stellar-101": {
    title: "Stellar 101",
    territory: "contas, lumens, trustlines, pagamentos",
    overlord: null,
    synopsis:
      "Como a rede funciona de verdade: o que é uma conta, o que um lumen paga, por que segurar um asset é opt-in, e como um pagamento é montado e enviado.",
  },
  "soroban-smart-contracts": {
    title: "Smart contracts Soroban",
    territory: "contratos, storage, autorização",
    overlord: null,
    synopsis:
      "Escrever, guardar estado e proteger um contrato Soroban em Rust — as três coisas que todo contrato real precisa.",
  },
  "stellar-protocol-27": {
    title: "Protocol 27",
    territory: "smart accounts e delegação de auth",
    overlord: null,
    synopsis:
      "O upgrade atual: smart accounts que definem a própria política de auth, delegação via CAP-0071, assinaturas vinculadas a endereço, e o caminho de migração.",
  },
};

export const skirmishText: Record<string, SkirmishText> = {
  "rust-fundamentals-1": {
    title: "Hello, World!",
    intro:
      "Todo programa Rust começa em `main`. Você vai imprimir uma linha exata e conhecer a macro `println!` — a ferramenta com que vai inspecionar tudo daqui pra frente.",
  },
  "rust-fundamentals-2": {
    title: "Variáveis e mutabilidade",
    intro:
      "Bindings são imutáveis por padrão. Você vai ver o erro de compilação que isso gera e corrigir com `mut` — o primeiro de muitos lugares onde Rust te obriga a declarar a intenção.",
  },
  "rust-fundamentals-3": {
    title: "Tipos de dados",
    intro:
      "Inteiros, floats, booleanos e caracteres — e quando o compilador precisa que você anote um tipo que ele não consegue inferir sozinho.",
  },
  "rust-fundamentals-4": {
    title: "Funções",
    intro:
      "Parâmetros, tipos de retorno e o retorno implícito de Rust: a última expressão sem ponto e vírgula é o valor. Essa única regra explica muita sintaxe adiante.",
  },
  "rust-fundamentals-5": {
    title: "Fundamentos de ownership",
    intro:
      "Todo valor tem exatamente um dono. Atribuir uma `String` move o valor, e o binding antigo morre — a ideia única sobre a qual o resto de Rust é construído.",
  },
  "rust-fundamentals-6": {
    title: "Borrowing e referências",
    intro:
      "Você não precisa entregar um valor para deixar uma função lê-lo. Empreste uma referência com `&` e ela volta — a alternativa cotidiana a clonar.",
  },
  "control-flow-1": {
    title: "if / else",
    intro:
      "Ramificação em Rust é expressão, não só comando — então um `if` pode produzir um valor que você liga direto a uma variável.",
  },
  "control-flow-2": {
    title: "Expressões match",
    intro:
      "`match` precisa ser exaustivo: o compilador rejeita qualquer caso esquecido. É esse mecanismo que torna seguro o tratamento de `Option` e `Result` mais adiante.",
  },
  "control-flow-3": {
    title: "loop",
    intro:
      "Um laço incondicional, e `break` com valor — a forma idiomática de repetir até algo dar certo.",
  },
  "control-flow-4": {
    title: "Laços while",
    intro:
      "Repetir enquanto uma condição vale. Você também vai ver por que `while let` existe e onde ele ganha do `while` puro.",
  },
  "control-flow-5": {
    title: "Laços for",
    intro:
      "Iterar sobre um range ou uma coleção — o laço que você realmente vai escrever, e o primeiro lugar onde iteradores aparecem.",
  },
  "control-flow-6": {
    title: "Controle de fluxo aninhado",
    intro:
      "Combinando ramificações e laços, e mantendo o resultado legível quando a lógica deixa de ser trivial.",
  },
  "rust-standard-library-1": {
    title: "Fundamentos de Vec",
    intro:
      "Um array que cresce: push, índice, e por que `Vec` é a coleção padrão em quase todo programa Rust.",
  },
  "rust-standard-library-2": {
    title: "Iteradores",
    intro:
      "`map`, `filter` e `collect` — e o fato de que nada roda até um consumidor pedir os elementos.",
  },
  "rust-standard-library-3": {
    title: "Option e map",
    intro:
      "Transformar um valor que pode não existir, sem dar unwrap antes.",
  },
  "rust-standard-library-4": {
    title: "HashMap",
    intro:
      "Busca por chave/valor, e a API `entry` que lê ou insere com um único hash.",
  },
  "rust-standard-library-5": {
    title: "Trabalhando com strings",
    intro:
      "`String` versus `&str`, por que você não indexa uma string por número, e o que UTF-8 tem a ver com isso.",
  },
  "rust-standard-library-6": {
    title: "Slices",
    intro:
      "Uma visão emprestada de parte de uma coleção — sem cópia, sem alocação.",
  },
  "rust-standard-library-7": {
    title: "Structs",
    intro:
      "Agrupar dados relacionados sob um nome, com o tipo de cada campo declarado.",
  },
  "rust-standard-library-8": {
    title: "impl e métodos",
    intro:
      "Ligar comportamento a um tipo, e a diferença entre `self`, `&self` e `&mut self`.",
  },
  "mastering-option-1": {
    title: "Some ou None",
    intro:
      "`Option<T>` transforma a ausência num caso que o compilador te obriga a tratar — é por isso que Rust não tem null.",
  },
  "mastering-option-2": {
    title: "Unwrap com segurança",
    intro:
      "`unwrap_or`, `unwrap_or_else` e `expect`, e a regra de quando `unwrap()` é aceitável em produção.",
  },
  "mastering-option-3": {
    title: "if let",
    intro:
      "Casar um caso e ignorar o resto, quando um `match` completo seria só ruído.",
  },
  "mastering-result-1": {
    title: "Ok ou Err",
    intro:
      "`Result<T, E>` carrega o valor ou o motivo da falha — e `#[must_use]` garante que você não o ignore em silêncio.",
  },
  "mastering-result-2": {
    title: "Fazendo match em Result",
    intro:
      "Tratar os dois braços explicitamente, e decidir a cada chamada se a falha é recuperável.",
  },
  "mastering-result-3": {
    title: "O operador ?",
    intro:
      "Propagar a falha para quem chamou com um caractere, em vez de um `match` em cada nível.",
  },
  "stellar-101-1": {
    title: "Contas e keypairs",
    intro:
      "Uma conta Stellar é uma chave pública. A chave secreta assina; a pública identifica. Todo o resto se apoia nisso.",
  },
  "stellar-101-2": {
    title: "Lumens e taxas",
    intro:
      "XLM, stroops, a reserva base e por que toda conta precisa manter um saldo mínimo.",
  },
  "stellar-101-3": {
    title: "Trustlines e assets",
    intro:
      "Segurar um asset não nativo é opt-in: você abre uma trustline antes, e isso é uma decisão deliberada do protocolo.",
  },
  "stellar-101-4": {
    title: "Seu primeiro pagamento",
    intro:
      "Montar, assinar e enviar um pagamento — o formato que toda operação Stellar compartilha.",
  },
  "soroban-smart-contracts-1": {
    title: "Seu primeiro contrato",
    intro:
      "`#[contract]`, `#[contractimpl]` e uma função exportada — o mínimo que um contrato Soroban precisa para existir.",
  },
  "soroban-smart-contracts-2": {
    title: "Storage de contrato",
    intro:
      "Storage instance, persistent e temporary: três prateleiras com tempos de vida e custos diferentes.",
  },
  "soroban-smart-contracts-3": {
    title: "Autorização",
    intro:
      "`require_auth` é a linha entre um contrato que qualquer um esvazia e um que só o dono movimenta.",
  },
  "stellar-protocol-27-1": {
    title: "Visão geral do Protocol 27",
    intro:
      "O que o upgrade muda, e por que a delegação de autenticação importa para quem constrói carteiras.",
  },
  "stellar-protocol-27-2": {
    title: "Smart accounts e __check_auth",
    intro:
      "Uma conta-contrato decide sozinha o que conta como assinatura válida — essa função é a política inteira.",
  },
  "stellar-protocol-27-3": {
    title: "Delegação de autenticação (CAP-0071)",
    intro:
      "Permitir que uma conta delegue sua checagem de auth a outra, e o que isso destrava para recuperação e chaves de sessão.",
  },
  "stellar-protocol-27-4": {
    title: "Segurança de assinatura e credenciais V2",
    intro:
      "Assinaturas vinculadas a endereço, e o ataque de replay que o formato de credencial V2 fecha.",
  },
  "stellar-protocol-27-5": {
    title: "Migrando para o Protocol 27",
    intro:
      "O que quebra, o que não quebra, e em que ordem mudar as coisas nos SDKs.",
  },
  "stellar-protocol-27-6": {
    title: "Juntando tudo: uma conta delegada",
    intro:
      "Implemente `__check_auth` de ponta a ponta: verifique a assinatura, honre o delegado e rejeite o replay.",
  },
};

export const cardText: Record<string, CardText> = {
  stroowarrior: {
    epithet: null,
    type: "Guerreiro",
    flavor:
      "Só quando o mundo treme é que o verdadeiro guerreiro revela sua luz inabalável.",
  },
  stropillusion: {
    epithet: "Explorador do Salão dos Espelhos",
    type: "Stropie · Ilusionista",
    flavor:
      "Reflexos enganam, segredos permanecem ocultos — ele dobra a realidade dentro dos espelhos infinitos.",
  },
  stroopkeeper: {
    epithet: "Guardião dos Cofres Sem Fim",
    type: "Stropie · Arquivista",
    flavor:
      "Toda ferramenta já forjada dorme em seus cofres — indexada a partir do zero, como os deuses antigos queriam.",
  },
  stroophantom: {
    epithet: "O Cavaleiro Que Talvez Não Seja",
    type: "Stropie · Espectro",
    flavor:
      "Pergunte se ele está lá. Nunca presuma. O pântano está cheio dos que deram unwrap.",
  },
  strooracle: {
    epithet: "Árbitra dos Dois Destinos",
    type: "Stropie · Oráculo",
    flavor:
      "Duas portas, um veredito. Ela nunca ignorou um Result, e não vai começar pelo seu.",
  },
  astrostroopie: {
    epithet: "Viajante do Portal da Constelação",
    type: "Stropie · Viajante",
    flavor:
      "Ele mapeou o céu pelas suas feridas e cruzou o Portal onde a luz havia falhado.",
  },
  stroopbeholder: {
    epithet: null,
    type: "Stropie · Aberração",
    flavor: "Das profundezas da ruína, seus muitos olhos veem apenas conquista.",
  },
  stroopzipper: {
    epithet: "Arauto do Céu Reescrito",
    type: "Stropie · Arauto",
    flavor:
      "O céu não se quebra quando muda — ele se fecha de novo, costura por costura luminosa.",
  },
};
