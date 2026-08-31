import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Máquinas que cumprem promessas",
  tagline: "O que é um contrato inteligente: uma regra que se executa sozinha, nada além disso.",
  steps: [
    {
      kind: "theory",
      body: `## A máquina de refrigerante já fazia isso

Uma máquina de refrigerante é uma promessa sem pessoa por trás: *coloque 3, aperte B4, receba o salgadinho.* Ela não gosta de você, não confere seu nome, não decide se hoje é um bom dia para honrar o acordo. A regra é a máquina.

Compare com uma promessa guardada por uma pessoa — um locador devolvendo a caução, um marketplace liberando o pagamento quando a encomenda chega. Essas promessas também são reais, mas dependem de alguém *escolher* cumpri-las, e de existir onde reclamar se não cumprir.

Um **contrato** num livro-razão compartilhado é o primeiro arranjo: a máquina de refrigerante, para dinheiro e regras, morando dentro do livro do Capítulo I.`,
    },
    {
      kind: "theory",
      body: `## O que ele é, de fato

Tire o mistério e um contrato é três coisas bem comuns:

- **Um lugar no livro que guarda valor.** Ele pode ter fundos como uma conta tem, e tem um endereço como qualquer conta.
- **Um conjunto fixo de regras** — "se isso, então aquilo" — escritas uma vez e publicadas para qualquer um ler.
- **Nenhuma mão.** Ele age só quando alguém o cutuca com uma instrução assinada, e quando age, segue suas regras exatamente.

Ninguém "roda" o contrato. Não há servidor para desligar, empresa para acionar, nem operador com poder de override. Uma vez no livro, milhares de máquinas o executam de forma idêntica e concordam com o resultado.`,
    },
    {
      kind: "diagram",
      body: "A máquina inteira, de ponta a ponta:",
      caption: "Quatro passos, e a pessoa aparece só no primeiro.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "poke",
            label: "chega uma instrução assinada",
            note: "Nada acontece até alguém cutucar. Um contrato não tem mãos próprias.",
            tone: "accent",
          },
          {
            id: "rules",
            label: "ele confere as regras",
            note: "As mesmas regras que qualquer um pode ler. Sem julgamento, sem exceção, sem dia ruim.",
            tone: "neutral",
          },
          {
            id: "move",
            label: "ele move valor",
            note: "Ele tem fundos como uma conta tem, e só os move do jeito que as regras dizem.",
            tone: "teal",
          },
          {
            id: "book",
            label: "a linha está no livro",
            note: "Permanente, pública e impossível de desfazer — inclusive quando a regra estava errada.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Qual arranjo do dia a dia chega mais perto de como um contrato se comporta?`,
      options: [
        "Uma máquina de refrigerante: regras fixas, nenhum julgamento, age só quando alguém coloca algo nela",
        "Um atendente prestativo: lê a situação e decide o que é justo caso a caso",
        "Um contrato de papel assinado: está escrito, mas quem faz cumprir depois é a justiça",
      ],
      answer: 0,
      explain: `O atendente tem julgamento e o papel precisa de quem execute. Um contrato não tem nem um nem outro — a execução *é* o cumprimento. Essa é a força dele e, como você vai ver agora, também a lâmina.`,
    },
    {
      kind: "theory",
      body: `## O que ele não consegue fazer (esta lista importa mais)

Quem está começando superestima contratos de quatro maneiras específicas, e vale desaprender todas agora:

- **Ele não sabe nada do mundo lá fora.** Nem a cotação do dólar hoje, nem se a encomenda chegou, nem a previsão do tempo. Alguém precisa *enviar* essa informação a ele — e escolher quem tem permissão para isso é uma decisão de consequências reais.
- **Ele não muda de ideia.** Nada de "mas obviamente eu quis dizer…". Ele faz o que está escrito, ao pé da letra.
- **Ele não pode ser desfeito.** Uma movimentação que ele fez é uma linha no livro. Não existe desfazer.
- **Ele não é privado.** As regras dele e cada movimentação que já fez são públicas, para sempre, para quem quiser olhar.`,
    },
    {
      kind: "quiz",
      question: `Um contrato foi escrito para liberar fundos "depois do prazo". Quem o escreveu queria dizer, no fundo, *o comprador pede e recebe*; o contrato como está escrito libera para quem pedir primeiro. No primeiro dia, um desconhecido pede antes e recebe.

O que deu errado?`,
      options: [
        "A regra escrita foi honrada — a intenção que nunca chegou ao papel simplesmente não existia",
        "O contrato falhou e deveria ser revertido",
        "O desconhecido quebrou uma regra e pode ser denunciado",
      ],
      answer: 0,
      explain: `Nada falhou, e essa é a parte incômoda. A máquina cumpriu a promessa que recebeu, não a que estava na cabeça de quem a escreveu. Intenções não escritas não têm força nenhuma aqui.`,
    },
    {
      kind: "fill",
      prompt: `Complete a frase que um builder deve levar deste capítulo:`,
      file: "NOTES.md",
      before: `Um contrato cumpre `,
      after: ` .`,
      choices: [
        "a promessa que você escreveu, não a que você quis dizer",
        "a proteção dos seus fundos contra qualquer bug possível",
        "um registro privado que só você consegue ler",
        "a promessa que um juiz considerar mais justa",
      ],
      answer: 0,
      explain: `Todo incidente caro desta indústria é uma variação dessa única linha. E é por isso que o próximo trecho da estrada não começa por código.`,
    },
    {
      kind: "labLink",
      labSlug: "treasure-chest",
      body: `Dá para ver uma dessas máquinas cumprindo uma promessa na testnet real, agora. O laboratório **O Baú do Tesouro** da Forja tranca fundos numa entrada do livro-razão que não pertence a ninguém — até que o único reclamante nomeado a pegue. Sem agente de custódia, sem empresa segurando o dinheiro, sem ninguém que *pudesse* mudar de ideia. A regra libera, ou nada libera.`,
    },
    {
      kind: "theory",
      body: `## Por que este é o último capítulo fácil

Você já tem o térreo inteiro: um livro que ninguém edita em silêncio, uma chave que prova quem você é, e máquinas que cumprem promessas escritas exatamente como foram escritas.

Repare no que isso soma. Se a máquina faz precisamente o que foi escrito — e não pode ser contestada, corrigida ou desfeita — então **escrever é o trabalho**. Não digitar: uma IA digita mais rápido que você e nunca cansa. Decidir, cravar, definir o "o que precisa ser verdade aqui, e o que nunca pode acontecer".

**A seguir, na estrada do Ofício:** como escrever isso direito, antes de existir uma linha de código. E na estrada do Reino: o maquinário da própria Stellar, de como milhares de máquinas concordam até os contratos que você acabou de conhecer — dessa vez por dentro.`,
    },
  ],
  testOut: [
    {
      question: `O que diferencia um contrato de uma promessa guardada por uma pessoa?`,
      options: [
        "Ele executa as próprias regras, sem ninguém escolhendo se vai cumprir",
        "Ele está escrito, e uma promessa falada não está",
        "Ele pode ser cobrado na justiça, e uma promessa não",
      ],
      answer: 0,
    },
    {
      question: `Quem roda um contrato publicado?`,
      options: [
        "Ninguém em particular — milhares de máquinas o executam de forma idêntica e concordam com o resultado",
        "O autor, num servidor que ele mantém no ar para isso",
        "Os operadores da rede, se revezando",
      ],
      answer: 0,
    },
    {
      question: `Quando um contrato age?`,
      options: [
        "Só quando alguém o cutuca com uma instrução assinada",
        "Continuamente, checando as condições dele em segundo plano",
        "Uma vez por dia, quando a rede varre as regras guardadas",
      ],
      answer: 0,
    },
    {
      question: `O autor consegue desligar um contrato já publicado?`,
      options: [
        "Não, a menos que as próprias regras publicadas do contrato digam que sim",
        "Sim — o autor sempre guarda um override",
        "Só pedindo aos operadores da rede que o removam",
      ],
      answer: 0,
    },
  ],
};
