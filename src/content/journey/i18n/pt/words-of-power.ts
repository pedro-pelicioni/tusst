import type { Concept } from "../types";

export const wordsOfPower: Concept = {
  meta: {
    slug: "words-of-power",
    title: "Palavras de Poder",
    tagline: "Prompt & engenharia de contexto — o que o golem realmente vê.",
    numeral: "VI",
    arc: "craft",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/words-of-power.webp",
    glyph: "🪶",
  },
  steps: [
    {
      kind: "theory",
      body: `## O banco é o mundo inteiro

O golem não conhece seu repositório. Ele não lembra de ontem e não pode ver o arquivo que você *não* anexou. Seu universo inteiro é a **janela de contexto** — o texto que está à sua frente agora.

Essa é a regra mais profunda de prompting, e não é mística: **você decide o que existe.** Tudo que está no banco é o mundo; tudo que está fora do banco nunca aconteceu.

Então a pergunta por trás de todo prompt não é "como devo formular isso?" mas *"o que o golem precisa ver para acertar?"*`,
    },
    {
      kind: "theory",
      body: `## Anatomia de um prompt

Um prompt funcional é um pequeno documento de engenharia com quatro partes:

1. **Papel & instruções** — qual tarefa está sendo feita e como: "Você está implementando um caso de uso no domínio de pagamentos."
2. **Restrições** — o que deve e o que não deve: "API pública inalterada. Sem novas dependências. Sem panics."
3. **Exemplos** — um exemplo de *bom*, para que a qualidade seja mostrada ao invés de descrita.
4. **O pedido** — a tarefa real, declarada por último, precisa e única.

A maioria dos prompts ruins não está mal *redigida* — eles estão **faltando uma parte**, geralmente as restrições ou o exemplo.`,
    },
    {
      kind: "quiz",
      question: `Qual instrução realmente melhora o código do golem?`,
      options: [
        "Validar o valor: rejeitar zero e negativos com um erro tipado; nunca panic; manter a API pública inalterada",
        "Por favor, escreva código realmente limpo, profissional, de alta qualidade, pronto para produção",
        "Você é o maior programador que já existiu — codifique de acordo",
      ],
      answer: 0,
      explain: `O golem não pode falhar em "alta qualidade" — qualquer saída plausivelmente se enquadra. Ele *pode* falhar em "nunca panic", e esse é o ponto: critérios de aceitação criam a possibilidade de erro, que é o que orienta o modelo. Especificidade supera polidez — e bajulação.`,
    },
    {
      kind: "theory",
      body: `## Mostre, não conte

Adjetivos descrevem qualidade; **exemplos a definem**. Um exemplo trabalhado supera três parágrafos de adjetivos, porque o golem é uma máquina de continuação de padrões — então dê a ele um padrão que valha a pena continuar.

Quer testes no seu estilo de código? Cole **um teste ideal** e diga "assim". Quer mensagens de erro que carreguem um código e uma dica de remediação? Mostre *um*.

O Capítulo I ensinou que requisitos em prosa vazam ambiguidade. O mesmo vale no banco: um exemplo é uma especificação mínima que é *copiada* ao invés de interpretada — e copiar perde muito menos do que interpretar.`,
    },
    {
      kind: "theory",
      body: `## Engenharia de contexto: curadoria, não acumulação

Prompt engineering pergunta *como formular*. **Context engineering** faz a pergunta mais importante: *o que vai para o banco?*

Para um bug no caminho de reembolso, o golem precisa de:

- o **módulo de reembolso** — o código realmente em jogo,
- a **especificação** de reembolsos — artefato do Capítulo I,
- o **teste que falha** — artefato do Rite, nomeando exatamente o que "corrigido" significa.

Não do repositório inteiro. Não das notas de migração do mês passado. A habilidade é *seleção*: duas centenas de linhas certas valem mais que a obra completa do seu código.`,
    },
    {
      kind: "theory",
      body: `## Degradação de contexto

Aqui está a parte contraintuitiva: contexto irrelevante não apenas desperdiça espaço — ele **prejudica ativamente**.

- Um arquivo distrator convida o golem a "ajudá-lo" a tocá‑lo.
- Vocabulários mistos puxam o modelo errado de Conta — pesadelo do Capítulo III, auto‑infligido.
- Docs obsoletos e código morto ensinam comportamentos antigos como se fossem atuais.
- E quanto maior o banco, mais fina a atenção: sua restrição crucial agora compete com dez mil tokens de ruído.

Curadoria corta nos dois sentidos. **Remover do banco é tão poderoso quanto adicionar**.`,
    },
    {
      kind: "quiz",
      question: `Você está enviando o golem para corrigir um bug no caminho de reembolso. O que vai para o banco?`,
      options: [
        "O módulo de reembolso, as regras de reembolso da especificação e o teste que falha — e pouco mais",
        "Todo o repositório, para que nenhum detalhe potencialmente relevante falte",
        "Apenas a mensagem de erro — qualquer contexto de código enviesaria sua perspectiva fresca",
      ],
      answer: 0,
      explain: `Passar fome e se afogar são ambos modos de falha: pouco contexto força adivinhações, enquanto contexto indiscriminado entope o sinal e convida a edições que você nunca pediu. Curadoria — o módulo relevante, a especificação, o teste — é a própria arte.`,
    },
    {
      kind: "fill",
      prompt: `O prompt mais afiado que você tem é aquele que já escreveu:`,
      file: "prompt.md",
      before: `Faça este `,
      after: ` passar, sem mudar suas asserções.`,
      choices: ["teste", "build", "demo", "deploy"],
      answer: 0,
      explain: `Um teste que falha é um critério de aceitação executável — comportamento, bordas e conclusão em uma forma que não pode ser mal interpretada. Builds, demos e deploys também podem falhar, mas só um teste traz asserções: sua especificação com dentes, agora fazendo o papel de prompt.`,
    },
    {
      kind: "theory",
      body: `## Iteração é aperfeiçoamento de especificação

A primeira saída está errada. Tudo bem — isso são dados. O movimento amador é rolar os dados novamente; o movimento do engenheiro é **ler a falha e encontrar a instrução que falta**.

Golem ignorou um caso de borda? Suas restrições nunca o mencionaram. Estilo errado? Você explicou ao invés de mostrar. Tocou arquivos que não deveria? O banco estava bagunçado, ou a borda não foi declarada.

Cada falha nomeia um buraco nas suas palavras — corrija o *prompt*, não apenas a saída, exatamente como o Capítulo I ensinou a apertar uma especificação.

Próxima disciplina: colocar as palavras em movimento — o loop que age, observa e corrige.`,
    },
  ],
};
