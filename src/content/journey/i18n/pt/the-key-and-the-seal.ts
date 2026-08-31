import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "A chave e o selo",
  tagline: "Sua conta é uma chave. Assinar é selar. A ideia é essa.",
  steps: [
    {
      kind: "theory",
      body: `## Uma senha é uma promessa que outra pessoa guarda

Quando você entra no seu banco, digita uma senha e o banco *confere*. Cada parte dessa frase esconde uma dependência: o banco guarda a lista, o banco decide que você é você, o banco pode te bloquear, e se a lista do banco vazar, sua senha vaza junto.

O livro compartilhado do capítulo anterior não tem banco nenhum dentro dele. Não existe ninguém sentado atrás para conferir coisa alguma.

Então ele usa algo melhor: não um segredo que você *conta* a alguém, mas um segredo que você *prova ter* — **sem nunca mostrá-lo**.`,
    },
    {
      kind: "theory",
      body: `## Uma chave, duas metades

Sua conta é um par de metades que combinam, criadas juntas, no seu próprio dispositivo:

- A metade **pública** é o seu endereço. Ela se parece com \`GABC…7XQ\`. Compartilhe à vontade — é para lá que as pessoas te mandam coisas, exatamente como um endereço de e-mail. Publicar não é risco; é a função dela.
- A metade **secreta** nunca sai das suas mãos. Ela se parece com \`SDXY…4KP\`. É o que *move* aquilo que o endereço guarda.

Duas metades, uma relação: a metade pública sempre pode ser derivada da secreta, e **nunca o contrário**. Essa mão única é o que sustenta o arranjo inteiro.

Um jeito útil de guardar: seu endereço é a caixa de correio que todo mundo vê; sua chave secreta é a única que abre.`,
    },
    {
      kind: "quiz",
      question: `Um marketplace pede "seu endereço Stellar" para poder te pagar. Qual metade você envia?`,
      options: [
        "A pública, que começa com G — é um endereço, feito para ser compartilhado",
        "A secreta, que começa com S — senão o pagamento não chega",
        "Nenhuma: endereços são privados e pagamentos se combinam por e-mail",
      ],
      answer: 0,
      explain: `Receber não exige nada além do seu endereço. Se alguém afirmar que um pagamento precisa da sua chave secreta, o próprio pedido é a fraude — e agora você reconhece de cara.`,
    },
    {
      kind: "theory",
      body: `## Assinar: um selo que ninguém falsifica

É aqui que a metade secreta mostra serventia. Para mover algo, você escreve a instrução — *"envie 10 para o Bruno"* — e seu dispositivo a **sela** com a sua chave secreta.

O selo tem três propriedades, e vale ler devagar:

1. **Só a sua chave poderia tê-lo feito.** Ninguém falsifica.
2. **Qualquer um consegue conferir** contra o seu endereço público, sem nunca ver a metade secreta.
3. **Ele cobre exatamente aquela instrução.** Mude um dígito do valor e o selo se desfaz.

Isso é uma **assinatura**. A rede não te conhece, não confia em você e não precisa — ela só verifica se o selo combina com o endereço de onde o dinheiro está saindo.`,
    },
    {
      kind: "widget",
      component: "seal-sign",
      body: `Experimente. Escreva algo, sele — e depois mude um único caractere e veja o selo deixar de bater.`,
    },
    {
      kind: "theory",
      body: `## A parte em que as pessoas perdem tudo

Como não existe banco atrás do livro, também não existe "esqueci minha senha", nem canal de atendimento, nem estorno. Isso corta dos dois lados, e ser honesto sobre a lâmina importa mais do que entusiasmo:

- **Perdeu a chave secreta → os fundos ficam ali para sempre, visíveis para todos, alcançáveis por ninguém.** Eles não estão "dentro" da chave; a chave é apenas a única coisa capaz de movê-los.
- **Outra pessoa pegou a chave secreta → ela é você.** Não há a quem recorrer, porque para a rede nada de errado aconteceu: um selo válido moveu fundos válidos.

Daí a única regra que sobrevive a todo golpe já aplicado nesse meio: **ninguém legítimo jamais precisa da sua chave secreta.** Nem suporte, nem sorteio, nem "validação de carteira", nem admin de grupo. Nem uma vez, nem nunca.`,
    },
    {
      kind: "quiz",
      question: `Alguém te chama como "suporte da rede", diz que sua conta travou e pede a chave secreta (ou as suas 24 palavras de recuperação) para destravar. O que está acontecendo de fato?`,
      options: [
        "É roubo — chave secreta nunca é necessária a ninguém além de você, e entregá-la é entregar a conta",
        "É rotina — o suporte precisa da chave para assinar o desbloqueio no seu lugar",
        "É seguro, desde que você troque a chave logo depois",
      ],
      answer: 0,
      explain: `Não existe terceira resposta. Toda variação dessa mensagem — suporte, airdrop, "validação de carteira", um desconhecido simpático — é o mesmo roubo com outra fantasia. A regra não tem exceções para decorar, e é exatamente por isso que funciona.`,
    },
    {
      kind: "fill",
      prompt: `Complete a regra que mantém uma conta segura:`,
      file: "NOTES.md",
      before: `Compartilhe a chave pública à vontade; a chave secreta `,
      after: ` .`,
      choices: [
        "nunca sai do seu dispositivo",
        "só é entregue ao suporte verificado",
        "é enviada por e-mail para você mesmo, como backup",
        "vai publicada junto com a transação",
      ],
      answer: 0,
      explain: `E "mandar por e-mail para si mesmo" é a alternativa-armadilha: uma caixa de entrada é uma cópia da sua chave dentro do prédio de outra empresa, protegida por uma senha. Faça backup de chave offline, no papel ou num dispositivo — ou não faça.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Chega de teoria — vá criar uma. **Sua Primeira Carteira**, na Forja, gera um par de chaves de verdade, funda a conta na rede de testes da Stellar e mostra a conta aparecendo como uma linha no livro compartilhado, segundos depois de você assinar. Rede de teste, dinheiro de mentira, maquinário real.`,
    },
    {
      kind: "theory",
      body: `## O que você já tem na mão

Uma conta é um par de chaves. Um endereço é a metade que se compartilha. Uma assinatura é o selo que só a sua metade secreta faz e qualquer um confere. Perder essa metade é definitivo, e ninguém honesto vai te pedir por ela.

**A seguir:** o livro guarda mais do que saldos. Ele guarda *regras* — e essas regras se executam sozinhas, sem ninguém no meio decidindo se vai honrá-las.`,
    },
  ],
  testOut: [
    {
      question: `O que uma assinatura de fato prova?`,
      options: [
        "Que quem tem a chave privada aprovou exatamente esta mensagem",
        "Que a mensagem partiu de um dispositivo confiável",
        "Que a rede conferiu a identidade do remetente antes de aceitar",
      ],
      answer: 0,
    },
    {
      question: `Um estranho tem o seu endereço público. O que ele consegue fazer com isso?`,
      options: [
        "Te mandar valor e conferir suas assinaturas — nada além disso",
        "Gastar da sua conta, se também souber quando você assinou pela última vez",
        "Deduzir sua chave privada, com tempo suficiente",
      ],
      answer: 0,
    },
    {
      question: `Por que uma chave não é só uma senha com passos a mais?`,
      options: [
        "Uma senha é mostrada a um serviço que a confere; uma chave nunca sai do seu lado e produz uma prova no lugar",
        "Uma chave é mais longa, então exige mais tentativas para adivinhar",
        "Uma senha pode ser resetada pelo suporte, e uma chave é resetada pela rede",
      ],
      answer: 0,
    },
    {
      question: `Você muda um caractere da mensagem depois de assiná-la. O que acontece?`,
      options: [
        "A assinatura para de bater — ela cobre a mensagem inteira, não um pedaço",
        "Nada, desde que a mudança seja menor que a assinatura",
        "A assinatura se atualiza para cobrir o texto novo",
      ],
      answer: 0,
    },
  ],
};
