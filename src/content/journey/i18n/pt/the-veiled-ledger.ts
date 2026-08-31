import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Zero-knowledge e tokens confidenciais",
  tagline: "Zero-knowledge e tokens confidenciais: prova sem revelação.",
  steps: [
    {
      kind: "theory",
      body: `## Transparência é um recurso — até vazar

Tudo que você construiu até agora é radicalmente público: todo saldo, todo pagamento, toda contraparte, para sempre.

Para finanças isso costuma ser *o* ponto de venda — reservas auditáveis, trilhas verificáveis. Mas, quando aplicado a negócios reais, corta o outro lado:

- Pague salários on‑chain e **cada funcionário pode ler o salário de todos os outros**.
- Pague um fornecedor e seus **concorrentes leem seus preços e volumes**.
- Mova o tesouro e o mercado antecipa sua intenção.

Dinheiro sério precisa de *silêncio seletivo*. A questão é como um livro‑feito‑público pode guardar segredos sem se tornar um segredo total.`,
    },
    {
      kind: "diagram",
      body: "O mesmo pagamento, visto dos dois lados:",
      caption: "Nada disso é criptografado hoje. Cada linha é pública por projeto — o que é a funcionalidade, e o vazamento.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "explorer",
            label: "o que qualquer um lê",
            tone: "bad",
          },
          {
            id: "you",
            label: "o que você quis compartilhar",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "o valor",
            cells: [
              {
                text: "o número exato, para sempre",
                tone: "bad",
              },
              {
                text: "que um pagamento aconteceu",
                tone: "good",
              },
            ],
          },
          {
            label: "a contraparte",
            cells: [
              {
                text: "o endereço dela, e tudo mais que ela já fez",
                tone: "bad",
              },
              {
                text: "nada sobre ela",
                tone: "good",
              },
            ],
          },
          {
            label: "sua folha",
            cells: [
              {
                text: "cada salário, comparável lado a lado",
                tone: "bad",
              },
              {
                text: "não é da conta de ninguém",
                tone: "good",
              },
            ],
          },
          {
            label: "seu caixa",
            cells: [
              {
                text: "seu saldo, até o stroop",
                tone: "bad",
              },
              {
                text: "não é da conta de ninguém",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Prova sem divulgação

A resposta vem do presente mais estranho da criptografia: a **prova de conhecimento zero**.

Uma prova ZK convence um verificador de que uma afirmação é verdadeira — *"este valor oculto é positivo, e meu saldo oculto o cobre"* — sem revelar **nada mais**: nem o valor, nem o saldo.

A prova é um pequeno bloco de matemática que qualquer pessoa pode checar de forma barata, e a verificação não requer confiança no provedor. Se verifica, a afirmação vale. Ponto final.

Coloque esse verificador dentro das regras do livro‑feito e a cadeia pode impor honestidade sobre números que nunca tem permissão de ver.`,
    },
    {
      kind: "theory",
      body: `## O reino forja as ferramentas

A verificação on‑chain precisa de matemática pesada específica como **funções de host** — e a Stellar entregou isso em camadas:

- **CAP‑59** trouxe operações de curva **BLS12‑381**, permitindo verificação de provas **Groth16** dentro de contratos Soroban.
- **Protocolos 25 e 26** adicionaram a curva **BN254** e o **hash Poseidon** — um hash projetado para ser barato *dentro* de circuitos ZK.

Essa segunda onda foi o que virou a balança: tornou **sistemas de pagamento privado práticos** na Stellar. Os primitivos são de nível de protocolo, então qualquer contrato verifica provas na velocidade nativa — sem penalidade de mil vezes o custo para fazer criptografia honestamente.`,
    },
    {
      kind: "quiz",
      question: `O que um verificador ZK on‑chain aprende quando aceita uma prova?`,
      options: [
        "Apenas que a afirmação provada é verdadeira — os valores ocultos permanecem ocultos",
        "Os valores subjacentes, que ele verifica e depois descarta",
        "Nada — a aceitação é apenas marketing probabilístico",
      ],
      answer: 0,
      explain: `Essa assimetria é todo o truque: a validade se torna pública enquanto os dados permanecem privados. O livro‑feito pode impor “ninguém gasta o que não tem” sem jamais ler um saldo.`,
    },
    {
      kind: "theory",
      body: `## Tokens Confidenciais: ocultando os valores

**Tokens Confidenciais** chegaram à pré‑visualização para desenvolvedores em **junho de 2026**, criados pela **OpenZeppelin e Nethermind**. O design é elegantemente discreto:

- Um **contrato wrapper** sobre qualquer token **SEP‑41** existente — USDC via seu Contrato de Ativo Stellar, tokens nativos do contrato, qualquer coisa que siga o padrão.
- Ao envolver seus tokens, seu **saldo e os valores transferidos ficam ocultos**, protegidos por provas de conhecimento zero.
- **Endereços permanecem públicos**: o explorador ainda vê *quem* transacionou com *quem* — apenas não vê *quanto*.

Construído para partes que se conhecem, mas precisam manter os números privados: folha de pagamento, faturas de fornecedores, liquidação B2B.`,
    },
    {
      kind: "theory",
      body: `## O véu que você não puxou

É aqui que as pessoas relaxam cedo demais. Você embrulhou a folha de pagamento num Token Confidencial, os valores apagaram, e o problema parece resolvido.

Veja o que um observador ainda tem. Um endereço paga quarenta endereços. Faz isso todo dia primeiro, e de novo no dia quinze. Dois daqueles quarenta pararam de receber em março, e três novos começaram em abril. Um deles recebe do seu endereço e do endereço de uma segunda empresa.

Ninguém descobriu um único salário — e um observador agora sabe seu número de funcionários, seu ciclo de pagamento, sua rotatividade, suas contratações, e quais dos seus funcionários fazem bico. **Os valores nunca foram a única coisa que o ledger estava dizendo.**

Isso não é um defeito dos Tokens Confidenciais; é o formato do que eles prometem. Um véu cobre o campo que você escolheu, e todo campo descoberto continua falando — horário, frequência, e acima de tudo o **grafo** de quem toca quem.

E é exatamente por isso que um segundo sistema, mais fundo, precisou existir.`,
    },
    {
      kind: "fill",
      prompt: `O que um Token Confidencial pode envolver?`,
      file: "veil.txt",
      before: `token confidencial  =  wrapper ZK sobre qualquer token  `,
      after: ` — valores ocultos, endereços públicos`,
      choices: ["SEP-41", "SEP-24", "SEP-10", "SEP-1"],
      answer: 0,
      explain: `O padrão de interface do token é o ponto de conexão: qualquer coisa que siga SEP‑41 pode ser envolvida — incluindo ativos clássicos como USDC via seu Contrato de Ativo Stellar. A camada de privacidade compõe com tudo que você já conhece.`,
    },
    { kind: "rustBranch", lessonSlug: "stellar-protocol-27-1",
      body: `Nada disso foi uma biblioteca que alguém publicou. BLS12-381, BN254, Poseidon — cada um chegou como um **CAP dentro de uma versão nomeada do protocolo**, e é por isso que um contrato verifica uma prova em velocidade nativa em vez de pagar uma penalidade de mil vezes para fazer criptografia direito. O ato de protocolo da Campanha é onde você vê uma versão aterrissar de verdade.` },
    { kind: "theory", body: `## A metade que parece impossível

Você já tem um véu para os números. Para folha de pagamento, faturas e liquidação entre partes que já se conhecem, esse é o requisito inteiro — os valores eram o segredo.

Mas às vezes os valores não são o segredo. Às vezes *quem pagou quem* é a parte sensível: uma doação, um fornecedor que você prefere que os concorrentes não descubram, uma transferência pessoal em trilhos públicos.

Esconder isso é o véu mais fundo, e ele vem com uma objeção óbvia — a que todo profissional de compliance levanta no primeiro minuto, e que vale levar a sério em vez de espantar com a mão.

**A seguir:** o segundo véu, e a resposta a essa objeção.` },
  ],
  testOut: [
    { question: `Qual é o problema de um ledger totalmente transparente, para uma empresa?`,
      options: ["Saldos e valores são públicos para sempre, então qualquer um deduz salários, margens e condições de fornecedor a partir de pagamentos comuns","Transações podem ser rastreadas e revertidas por observadores","Dados públicos deixam o ledger mais lento de consultar em escala"], answer: 0 },
    { question: `O que uma prova de conhecimento zero permite a um verificador concluir?`,
      options: ["Que uma afirmação sobre valores ocultos é verdadeira, sem aprender mais nada sobre esses valores","Que o provador é uma parte confiável, verificada por um terceiro","Que os valores ocultos caem dentro de uma faixa escolhida pelo verificador"], answer: 0 },
    { question: `Por que essas primitivas precisaram chegar como funções de host no protocolo?`,
      options: ["Para contratos verificarem provas em velocidade nativa — fazer a mesma matemática em código de contrato teria uma penalidade esmagadora","Porque contratos não têm permissão de fazer criptografia","Para só contratos auditados poderem usá-las"], answer: 0 },
    { question: `Um Token Confidencial embrulha um token existente. O que muda, e o que não muda?`,
      options: ["Saldos e valores de transferência ficam ocultos; os endereços que transacionam continuam públicos","Os endereços ficam ocultos; os valores continuam públicos","Os dois ficam ocultos, e é isso que o torna confidencial"], answer: 0 },
  ],
};
