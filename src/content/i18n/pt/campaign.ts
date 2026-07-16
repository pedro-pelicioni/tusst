import type { ActText, CardText, SkirmishText } from "../types";

// Localized campaign narrative. Card NAMES and act numerals stay as-is.
export const actText: Record<string, ActText> = {
  "rust-fundamentals": {
    title: "A Cidadela Enferrujada",
    territory: "Capital em ruínas da arte rúnica",
    synopsis:
      "Você desperta nas ruínas oxidadas da Cidadela. Ferrisia, a Mãe-Caranguejo, ensina a você as palavras do despertar, a vinculação dos nomes e a lei da Lâmina Inflexível. Reacenda o farol, Forgeborn.",
  },
  "control-flow": {
    title: "O Salão dos Caminhos que se Bifurcam",
    territory: "Labirinto de espelhos",
    overlord: "O Suserano dos Espelhos",
    synopsis:
      "Um labirinto onde cada corredor corresponde a um destino diferente. O Suserano dos Espelhos aprisiona viajantes em loops infinitos. Ramifique com sabedoria, faça match de cada reflexo e quebre o loop eterno.",
  },
  "rust-standard-library": {
    title: "Os Cofres Infindáveis",
    territory: "Arquivo-masmorra sob o reino",
    overlord: "O Acumulador",
    synopsis:
      "Sob o reino dorme toda ferramenta que os antigos Stroopies já forjaram: sacolas que crescem, livros-razão encantados, correntes de espíritos preguiçosos que não trabalham até serem coletados. O Acumulador guarda tudo — e indexa tudo deslocado em um.",
  },
  "mastering-option": {
    title: "O Pântano Evanescente",
    territory: "Charcos assombrados do talvez",
    synopsis:
      "As coisas aqui podem ser ou não ser. Aldeões desaparecem em None; os tolos dão unwrap às cegas e nunca mais são vistos. No pântano você faz a única pergunta que importa: Some ou None?",
  },
  "mastering-result": {
    title: "O Julgamento dos Dois Destinos",
    territory: "A Alta Corte do reino",
    synopsis:
      "Toda runa é julgada aqui: Ok ou Err. O lema da Corte está talhado sobre a porta — #[must_use]. Aprenda a propagar o julgamento com ?, a se recuperar de um Err com elegância e a jamais entrar em pânico no tribunal.",
  },
  "stellar-101": {
    title: "O Portal da Constelação",
    territory: "O céu partido",
    synopsis:
      "Com cinco campeões reunidos, você ascende. Fortalezas-estelares para contas, selo-e-segredo para pares de chaves, pontes de luz para trustlines — e lumens fluindo de novo pela primeira vez desde o Pânico.",
  },
  "soroban-smart-contracts": {
    title: "O Covil do Beholder",
    territory: "Fortaleza dos erros não tratados",
    synopsis:
      "Além do Portal, ele espera, numa fortaleza erguida com cada erro jamais tratado. Forje runas Soroban, implante-as no céu vivo e volte os próprios contratos corrompidos do Beholder contra ele.",
  },
};

export const skirmishText: Record<string, SkirmishText> = {
  "rust-fundamentals-1": {
    title: "As Palavras do Despertar",
    intro:
      "O farol da Cidadela está apagado desde o Grande Pânico, e só responde a uma runa falada. Ferrisia lhe entrega um cinzel. \"Toda runa já forjada começa em `main`\", ela diz. \"Fale, Forgeborn — e cuidado com os pontos e vírgulas. O farol é pedante.\"",
  },
  "rust-fundamentals-2": {
    title: "A Lâmina Inflexível",
    intro:
      "Na armaria, toda lâmina é imutável por força da antiga lei — uma vez forjada, jamais alterada. Para reforjar uma, você precisa declarar sua intenção ao próprio aço. O Guardião do Empréstimo observa da porta, de braços cruzados, esperando você tentar mudá-la sem `mut`.",
  },
  "rust-fundamentals-3": {
    title: "As Formas da Matéria",
    intro:
      "Ferrisia abre um armário de frascos rotulados: números inteiros, números quebrados, verdades e mentiras. \"A Cidadela recusa qualquer runa cuja forma não saiba nomear\", ela diz. \"Rotule seus frascos, Forgeborn — o farol só lê o que é tipado.\"",
  },
  "rust-fundamentals-4": {
    title: "A Receita do Ferreiro de Runas",
    intro:
      "Na parede da forja há uma receita: pegue dois lingotes, funda-os, devolva a liga. \"Uma receita escrita uma vez serve a mil forjas\", diz Ferrisia. \"Os ferreiros as chamavam de funções. Escreva a sua, e a forja a chamará pelo nome.\"",
  },
  "rust-fundamentals-5": {
    title: "A Lei do Guardião Único",
    intro:
      "A porta do cofre carrega a lei mais antiga da Cidadela: todo tesouro tem exatamente um guardião. Entregue um tesouro a outro e ele deixa de ser seu — tente alcançá-lo de novo e as proteções o queimarão. Esta noite você aprende por que os ferreiros antigos às vezes forjavam uma cópia verdadeira.",
  },
  "rust-fundamentals-6": {
    title: "A Lâmina Emprestada",
    intro:
      "O Guardião do Empréstimo finalmente fala: \"Não é preciso entregar uma lâmina para que outro leia sua inscrição. Empreste-a — uma referência — e ela volta à sua mão quando terminarem.\" Ele toca o sigilo `&` gravado em sua manopla. \"Esta marca. Aprenda-a.\"",
  },
  "control-flow-1": {
    title: "As Duas Portas",
    intro:
      "A primeira câmara do labirinto guarda duas portas e uma única tocha. \"Todo caminho aqui é uma pergunta\", sussurra um reflexo que é quase você. \"Se a tocha arde, uma porta. Senão, a outra. O labirinto só respeita o viajante que sabe decidir.\"",
  },
  "control-flow-2": {
    title: "O Salão de Todos os Reflexos",
    intro:
      "Um corredor de espelhos, cada um mostrando uma porta diferente que você poderia ter tomado. A regra do Suserano dos Espelhos é absoluta: nomeie o que vê em cada espelho — em todos — ou fique preso entre eles. A antiga arte rúnica chama isso de `match`, e ele não esquece nada.",
  },
  "control-flow-3": {
    title: "O Corredor Sem Fim",
    intro:
      "Este corredor se repete. O mesmo castiçal, a mesma rachadura na pedra, de novo e de novo. Viajantes que o percorrem para sempre tornam-se parte da parede. A única saída é contar seus ecos — e, quando a conta estiver certa, dar `break` no feitiço no meio do passo.",
  },
  "control-flow-4": {
    title: "A Galeria que Afunda",
    intro:
      "O piso desce um lance de cada vez, e a água está subindo. \"Enquanto houver andares acima da maré, continue descendo até o cofre\", diz o reflexo, sem ajudar em nada. Verifique a condição antes de cada passo — a galeria afoga os descuidados.",
  },
  "control-flow-5": {
    title: "Os Passos Contados",
    intro:
      "Cinco pedras de passagem cruzam o lago-espelho, numeradas de um a cinco. Pise em cada uma exatamente uma vez, em ordem, anunciando em voz alta — o lago escuta. Os ferreiros antigos tinham uma runa para percorrer um caminho conhecido sem contar nos dedos: `for`.",
  },
  "control-flow-6": {
    title: "O Labirinto do Suserano",
    intro:
      "A galeria final: dez espelhos, e o Suserano dos Espelhos escondido atrás de cada terceiro. Percorra a fileira; anuncie o número de cada espelho — mas, onde o Suserano se esconde, grite \"mirror\" em vez disso. Ramifique dentro do seu loop, Forgeborn. Quebre o coração do labirinto.",
  },
  "rust-standard-library-1": {
    title: "A Sacola Sem Fundo",
    intro:
      "O primeiro cofre guarda a ferramenta favorita dos Stroopies: uma sacola que cresce para caber tudo o que você empurrar para dentro. \"Um `Vec`\", diz o Stroopkeeper, destrancando a vitrine. \"Todo aventureiro carrega um. Poucos o respeitam. Ele conta a partir do zero, como os deuses antigos queriam.\"",
  },
  "rust-standard-library-2": {
    title: "A Corrente dos Espíritos Preguiçosos",
    intro:
      "Mais fundo, espíritos pendem em correntes — cada um segurando um valor, sem fazer absolutamente nada. \"Iteradores\", sussurra o Guardião. \"Os trabalhadores mais preguiçosos do reino. Não levantam um dedo até você coletar. Encadeie-os bem e eles somam uma fortuna em um só fôlego.\"",
  },
  "rust-standard-library-3": {
    title: "A Prateleira Que Pode Estar Vazia",
    intro:
      "A armadilha do Acumulador: uma prateleira com cinco espaços, e aventureiros que tentam alcançar o sexto. Antigamente, esse gesto derrubava o cofre inteiro. O `.get` da sacola pergunta com educação — e a resposta, Forgeborn, pode muito bem ser nada.",
  },
  "rust-standard-library-4": {
    title: "O Livro-Razão Encantado",
    intro:
      "Um livro que responde perguntas: pergunte \"ouro?\" e ele responde \"100\". Cada entrada é uma chave ligada a um valor, sem ordem alguma — o encantamento troca ordem por velocidade. Os ferreiros o chamavam de `HashMap`. O Acumulador o chama de sua memória.",
  },
  "rust-standard-library-5": {
    title: "A Inscrição Viva",
    intro:
      "Algumas inscrições são talhadas uma vez e nunca mudam — e algumas crescem, letra por letra, junto com sua história. Esta noite você trabalha com o tipo vivo: `String`, o texto do reino que cresce, e `format!`, o feitiço que tece muitos em um.",
  },
  "rust-standard-library-6": {
    title: "Uma Janela para o Tesouro",
    intro:
      "O Acumulador não deixará você levar o tesouro embora — mas deixa você olhar. Um slice é uma janela para um trecho do tesouro: sem cópia, sem roubo, só uma vista daqui até ali. Cuidado com as bordas; a janela inclui o começo e exclui o fim.",
  },
  "mastering-option-1": {
    title: "Some ou None?",
    intro:
      "O Stroophantom se materializa — ou não. Difícil dizer. \"No pântano, toda resposta vem embrulhada\", diz ele de algum lugar. \"`Some(thing)`, ou `None`. Outros reinos fingem que a ausência não existe e trombam com ela à meia-noite. Aqui, nós a colocamos no tipo.\"",
  },
  "mastering-option-2": {
    title: "Os Tolos Que Deram Unwrap",
    intro:
      "Lápides margeiam a trilha, cada uma talhada com a mesma última palavra: `.unwrap()`. \"Eles presumiram\", suspira o Fantasma. \"Em um `None`, o unwrap entra em pânico — o programa inteiro afunda. Carregue um valor padrão, e o pântano não poderá tocá-lo.\"",
  },
  "mastering-option-3": {
    title: "Pergunte ao Próprio Pântano",
    intro:
      "No coração do pântano, uma lanterna que pode ou não estar acesa. O Fantasma ensina a cortesia final: \"`if let Some(light)` — se houver algo, tome-o pelo nome e use-o. Se não, siga o caminho do else. Nunca presuma. Pergunte.\"",
  },
  "mastering-result-1": {
    title: "Os Dois Vereditos",
    intro:
      "A Strooracle preside, e sua corte conhece exatamente duas sentenças: `Ok(value)` e `Err(reason)`. \"O pântano lhe ensinou a ausência\", ela diz. \"Eu lhe ensino a falha — e a falha, Forgeborn, sempre declara seu motivo para os registros.\"",
  },
  "mastering-result-2": {
    title: "Lendo o Julgamento",
    intro:
      "Um pergaminho chega lacrado, com um veredito dentro. Nesta corte não se adivinham vereditos — faz-se `match` neles: um braço para `Ok`, um braço para `Err`, ambos tratados, nada ignorado. O lema sobre a porta brilha quando você entra: `#[must_use]`.",
  },
  "mastering-result-3": {
    title: "A Marca da Propagação",
    intro:
      "Nem toda corte precisa sentenciar; algumas remetem o caso à instância superior. A Oráculo lhe mostra a menor runa do reino: `?`. \"Em Ok, desembrulhe e siga. Em Err, devolva-o a quem chamou você — no mesmo instante. Uma marca, e o julgamento sobe a correnteza.\"",
  },
  "stellar-101-1": {
    title: "A Carta da Fortaleza-Estelar",
    intro:
      "Astrostroopie o recebe no Portal com uma carta e duas chaves. \"Toda alma no céu é uma fortaleza-estelar — uma conta. O selo `G` você pode gritar das torres; a semente `S` você guarda com a própria vida. Perder o primeiro é constrangedor. Perder a segunda é perder tudo.\"",
  },
  "stellar-101-2": {
    title: "O Pedágio do Portal",
    intro:
      "\"A moeda do céu é o lumen\", diz o Viajante, girando uma moeda que se parte em dez milhões de fagulhas. \"Cada fagulha, um stroop. Toda travessia paga um pequeno pedágio — cem stroops, mais ou menos conforme o tráfego — para que ninguém inunde o céu de ruído.\"",
  },
  "stellar-101-3": {
    title: "A Ponte de Luz",
    intro:
      "Além dos lumens, o céu transporta todo ativo que uma fortaleza-estelar ousar emitir — mas só por pontes que você mesmo constrói. \"Uma trustline\", diz Astrostroopie, \"é você dizendo ao céu: eu aceito ESTE ativo, DESTE emissor. Sem ponte, sem carga. O céu leva consentimento a sério.\"",
  },
  "stellar-101-4": {
    title: "Primeira Luz Através do Céu",
    intro:
      "Tudo converge: uma fortaleza-estelar de destino, um ativo, uma quantia. O Viajante se afasta do console. \"Lumens não cruzam este Portal desde o Pânico. Trace o pagamento, Forgeborn. Que haja tráfego.\"",
  },
  "soroban-smart-contracts-1": {
    title: "A Primeira Runa Celeste",
    intro:
      "O portão da fortaleza lê runas, não aço. Aqui o seu Rust não é mais um programa — é um contrato, talhado no céu vivo, onde toda estrela pode chamá-lo. Sem biblioteca padrão, sem sistema operacional: apenas `#![no_std]`, o Env e a sua palavra. Talhe a primeira runa celeste.",
  },
  "soroban-smart-contracts-2": {
    title: "O Livro-Razão Que Lembra",
    intro:
      "Dentro da fortaleza, um livro-razão escreve a si mesmo. Tudo o que o Beholder já contou está armazenado aqui — mas o armazenamento no céu é alugado, não possuído. Leia, incremente, escreva de volta. O livro-razão lembra o que o seu contrato mandar lembrar, e nada mais.",
  },
  "soroban-smart-contracts-3": {
    title: "O Selo do Signatário",
    intro:
      "A corrupção do Beholder começou com uma única função desprotegida — qualquer um podia sacar o que não era seu. Uma linha teria impedido. Exija o selo do signatário antes de mover um único lumen: `require_auth`. Volte o próprio cofre dele contra ele.",
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
    epithet: "Guardião dos Cofres Infindáveis",
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
};
