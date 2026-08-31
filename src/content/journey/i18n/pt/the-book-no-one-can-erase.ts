import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "O que é uma blockchain",
  tagline: "O que é uma blockchain, sem uma sigla sequer.",
  steps: [
    {
      kind: "theory",
      body: `## Comece pela comanda do bar

Você e onze amigos bebem no mesmo bar toda semana. Ninguém paga na hora — o dono anota tudo num caderno: *Ana deve 3, Bruno deve 5, Ana pagou 3 de volta.*

O caderno funciona. Mas tem uma fraqueza, e não é a conta: **só o dono segura o caderno.** Se uma página for reescrita numa noite qualquer, não existe nada com que comparar.

Tudo neste capítulo nasce de corrigir essa única fraqueza. Não precisa de matemática — só de um arranjo melhor do caderno.`,
    },
    {
      kind: "theory",
      body: `## Correção 1: todo mundo guarda uma cópia

Então você muda a regra. Cada linha que o dono escreve, os doze copiam no próprio caderno, no mesmo instante.

Agora reescrever uma página é quase inútil. Altere a sua cópia e os outros onze simplesmente discordam de você — e a maioria obviamente está certa. O dono deixou de ser *o* caderno e virou *um dos* cadernos.

Essa é a ideia inteira de um **livro-razão compartilhado**: não é um arquivo mágico, é só uma lista de movimentações que gente demais segura ao mesmo tempo para que qualquer um consiga editá-la em silêncio.`,
    },
    {
      kind: "diagram",
      body: `A diferença inteira, em três linhas:`,
      caption: "Nada disso é criptografia — é só aritmética sobre quantas cópias existem.",
      view: {
        kind: "compare",
        columns: [
          { id: "one", label: "um caderno só", tone: "bad" },
          { id: "many", label: "doze cópias", tone: "good" },
        ],
        rows: [
          {
            label: "reescrever uma página",
            cells: [
              { text: "ninguém percebe", tone: "bad" },
              { text: "onze cópias discordam", tone: "good" },
            ],
          },
          {
            label: "em quem confiar",
            cells: [
              { text: "no dono do caderno", tone: "bad" },
              { text: "em ninguém em particular", tone: "good" },
            ],
          },
          {
            label: "perder o caderno",
            cells: [
              { text: "acabou tudo", tone: "bad" },
              { text: "sobram onze cópias", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Correção 2: amarre as páginas umas nas outras

Ainda sobra uma brecha. O que impede alguém de reescrever uma página *do ano passado*, lá no fundo do caderno, onde ninguém olha?

Então você cria um hábito: no topo de cada página nova, você copia um pequeno resumo da página anterior. A página 40 carrega uma impressão digital da 39, que carrega uma da 38, e assim por diante até a primeira.

Agora mexer numa página antiga muda a impressão digital dela — que deixa de bater com a anotada na página seguinte, que deixa de bater com a próxima. **Uma edição lá atrás quebra todas as páginas que vieram depois**, de forma barulhenta, para todo mundo que tem uma cópia.

Páginas amarradas às páginas anteriores. Esse é o "chain" de blockchain — e sim, é literalmente só isso que a palavra significa.`,
    },
    {
      kind: "widget",
      component: "ledger-tamper",
      body: `Aqui está esse livro, encadeado. **Altere qualquer página** e veja o que acontece com as seguintes.`,
    },
    {
      kind: "quiz",
      question: `Alguém com uma cópia do livro compartilhado reescreve, em silêncio, uma linha de três anos atrás. O que acontece?`,
      options: [
        "Todo mundo percebe: a página editada não bate mais com a impressão digital registrada na página seguinte",
        "Nada — páginas antigas estão longe demais para alguém ficar conferindo",
        "O livro se conserta sozinho e a edição desaparece silenciosamente",
      ],
      answer: 0,
      explain: `É exatamente para isso que as páginas são amarradas. O histórico não é protegido por uma tranca ou uma senha — ele é protegido pelo fato de que alterá-lo *aparece*. A cópia de todo mundo continua com as impressões digitais originais, e a sua para de bater.`,
    },
    {
      kind: "theory",
      body: `## Correção 3: quem escreve a próxima página?

Doze cópias resolvem entre amigos. Agora imagine milhares de desconhecidos, espalhados pelo mundo, nenhum deles confiando no outro — e uma linha nova chegando a cada poucos segundos.

Quem tem o direito de anotar? Se todos escreverem ao mesmo tempo, qual versão é a verdadeira?

Toda rede desse tipo existe para responder a essa única pergunta, e a resposta é o que as diferencia entre si. Algumas fazem uma loteria decidida por poder de computação bruto. **A Stellar faz uma votação:** cada participante nomeia quem considera confiável, e uma linha vira realidade quando esses círculos se sobrepõem o bastante para concordar.

A consequência prática é a parte que vale guardar: uma página nova a cada **5 segundos, mais ou menos**, e uma taxa por movimentação tão pequena que se mede em frações de centavo.`,
    },
    {
      kind: "quiz",
      question: `Por que um livro-razão compartilhado precisa de uma regra sobre *quem escreve a próxima página*?`,
      options: [
        "Porque milhares de desconhecidos recebem movimentações ao mesmo tempo e precisam terminar com o mesmo livro",
        "Porque escrever é caro e alguém precisa pagar pelo papel",
        "Porque só o autor original do livro tem permissão para acrescentar linhas",
      ],
      answer: 0,
      explain: `O difícil é a concordância, não o armazenamento. Copiar uma lista é fácil; fazer milhares de máquinas que não confiam umas nas outras concordarem sobre a *mesma* lista, na mesma ordem, é o problema que toda rede dessas foi construída para resolver. Você vai desmontar isso direito no Reino — e até quebrar de propósito.`,
    },
    {
      kind: "fill",
      prompt: `Complete a frase que define a coisa:`,
      file: "NOTES.md",
      before: `Uma blockchain é uma lista de movimentações que muita gente segura ao mesmo tempo, em que cada página carrega uma impressão digital da anterior — de modo que alterar o histórico `,
      after: ` .`,
      choices: [
        "fica imediatamente visível para todos",
        "custa uma pequena taxa",
        "exige uma senha",
        "é impossível pela matemática",
      ],
      answer: 0,
      explain: `Cuidado com a última — é o mito. O histórico não é *impossível* de alterar; é impossível de alterar **em silêncio**. Todo o resto se apoia nessa distinção.`,
    },
    {
      kind: "theory",
      body: `## Então o que é a Stellar?

Um desses livros — construído especificamente para **valor circulando entre pessoas**.

Não é um computador mundial de propósito geral, nem uma máquina de especulação: é um livro-razão desenhado para que mandar dinheiro através de uma fronteira custe uma fração de centavo, liquide em uns cinco segundos, e funcione igual mandando dez centavos ou dez milhões.

Tudo que você vai encontrar mais adiante — contas, pagamentos, tokens, contratos — é uma linha, ou uma regra sobre linhas, nesse mesmo livro compartilhado.

**A seguir:** se o livro é público e qualquer um pode escrever nele, o que impede um desconhecido de gastar o *seu* dinheiro? A resposta é uma chave — e ela não tem nada a ver com senha.`,
    },
  ],
  testOut: [
    {
      question: `Doze amigos guardam, cada um, a própria cópia do livro da taverna. O que esse arranjo realmente garante?`,
      options: [
        "Ninguém precisa confiar no taverneiro — uma edição silenciosa deixa de bater com as outras onze cópias",
        "O livro fica impossível de perder, mas o taverneiro ainda pode reescrevê-lo",
        "Escrever fica mais rápido, porque doze pessoas dividem o trabalho",
      ],
      answer: 0,
    },
    {
      question: `Cada página ainda carrega um resumo curto da página anterior. O que isso acrescenta que as cópias sozinhas não dão?`,
      options: [
        "Editar uma página ANTIGA quebra todas as páginas que vieram depois, em vez de só aquela",
        "Comprime o livro, então páginas antigas ocupam menos espaço",
        "Permite ler o livro de trás para frente sem perder o lugar",
      ],
      answer: 0,
    },
    {
      question: `Por que um livro compartilhado precisa de uma regra sobre quem escreve a próxima página?`,
      options: [
        "Milhares de estranhos recebem movimentos ao mesmo tempo e precisam terminar com o mesmo livro, na mesma ordem",
        "Porque papel é caro e alguém precisa se responsabilizar por ele",
        "Porque só quem começou o livro pode acrescentar a ele",
      ],
      answer: 0,
    },
    {
      question: `Nos termos deste capítulo, o que é a Stellar?`,
      options: [
        "Um desses livros compartilhados, construído especificamente para valor circulando entre pessoas",
        "Uma empresa que guarda o livro e cobra para escrever nele",
        "Um computador de propósito geral que por acaso guarda um livro",
      ],
      answer: 0,
    },
  ],
};
