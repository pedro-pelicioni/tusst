import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Sua Primeira Carteira",
    tagline: "Crie um par de chaves, ative uma conta, abra uma trustline e envie XLM.",
  },
  steps: {
    "intro": {
      body: `## Comece por um par de chaves

No Stellar, sua identidade é um **par de chaves**: um endereço público que você mostra ao mundo (começa com \`G\`) e uma chave secreta que você guarda com a vida (começa com \`S\`).

Sem formulário. Sem e-mail. Sem permissão. Você *forja* uma identidade a partir de pura matemática — e, nos próximos minutos, ela terá fundos, aceitará um ativo e pagará outra conta. Tudo real, na **testnet**: o ambiente de treino da Stellar, onde as moedas não têm valor, mas a mecânica é a mesma.`,
    },
    "forge-keys": {
      title: "Forge suas chaves",
      body: `Um clique no martelo gera 32 bytes de aleatoriedade e deriva ambas as chaves a partir disso. O segredo fica **no seu navegador** — o TUSST nunca o vê, e nenhum servidor está envolvido em nada que você assine hoje.`,
      cta: "Forjar o par de chaves",
      successBody: `Seu endereço:

\`{address}\`

Esse endereço é público — compartilhe livremente. A chave secreta associada assina em seu nome; quem a possui controla a conta. Na testnet isso não tem consequência financeira. Na mainnet, nunca compartilhe essa chave.`,
    },
    "friendbot": {
      title: "Desperte a conta",
      body: `No momento seu endereço é apenas matemática — **o ledger nunca ouviu falar dele**. Uma conta só existe quando alguém a financia além da *reserva base* (um pequeno depósito de XLM que paga pela entrada no ledger).

Na testnet, uma faucet chamada **Friendbot** financia quem pedir.`,
      cta: "Chame o Friendbot",
      successBody: `Friendbot respondeu — sua conta agora **existe no ledger** com {balance} XLM.

Duas coisas nasceram com ela: um **saldo** e um **número de sequência** que conta cada transação que você assinar. Veja em qualquer explorador — agora é registro público.`,
    },
    "quiz-reserve": {
      question: `Antes do Friendbot, enviar XLM para seu endereço exigiria uma operação especial \`create_account\`. Por que o Stellar faz novas contas manter uma **reserva base**?`,
      options: [
        "Ela paga pela entrada permanente da conta no ledger, mantendo contas de spam caras",
        "É uma taxa coletada pelos validadores como lucro",
        "É um seguro reembolsado pelo suporte do Stellar se você perder sua chave",
      ],
      explain: `Exatamente — cada entrada no ledger (conta, trustline ou oferta) bloqueia uma pequena reserva para que o ledger não seja inundado por spam gratuito. Apague a entrada e a reserva volta.`,
    },
    "trustline": {
      title: "Abra uma linha de confiança",
      body: `Sua conta detém XLM nativamente — mas qualquer outro ativo deve ser **convidado**. Uma *linha de confiança* é você dizendo ao ledger: "Eu aceito USDC emitido pela Circle, até este limite."

É por isso que ninguém pode airdropar tokens lixo em você no Stellar: **sem linha de confiança, sem tokens**. Esta transação também é sua primeira assinatura.`,
      cta: "Confie no USDC",
      successBody: `Trustline aberta — sua conta agora pode manter **USDC** (emitido pela Circle na testnet).

Observe o custo: uma taxa pequena (~0.00001 XLM) e mais uma reserva base bloqueada, porque uma linha de confiança é uma nova entrada no ledger. Seu número de sequência também subiu.`,
    },
    "shrine": {
      title: "Crie um segundo endereço",
      body: `Você não pode enviar um pagamento para o vazio — precisa de um **destino**. Vamos criar um segundo endereço para receber seu primeiro pagamento.

Vamos gerá-lo e *jogar a chave secreta fora*. A conta vai existir e guardar o que você enviar, mas ninguém jamais poderá assinar por ela.`,
      cta: "Criar o endereço",
      successBody: `O segundo endereço:

\`{companion}\`

Ele ainda não existe no ledger — igual ao seu antes do Friendbot. Mas desta vez **você** será quem o traz à vida.`,
    },
    "create-companion": {
      title: "Crie a conta",
      body: `Uma operação \`create_account\` financia um novo endereço além da reserva base — exatamente o que o Friendbot fez por você. Agora você faz isso pelo segundo endereço, usando **seu** saldo: 100 XLM de teste.`,
      cta: "Criar (enviar 100 XLM)",
      successBody: `Conta criada. Você acabou de fazer o que o Friendbot fez por você — **contas criam contas**. Essa é toda a hierarquia; não existe um registrador central.`,
    },
    "payment": {
      title: "Envie um pagamento",
      body: `O clássico. Uma operação \`payment\` move valor de uma conta para outra — liquidada em ~5 segundos, por uma taxa de cerca de **0.00001 XLM**. Essa é a transação que o Stellar foi construído em torno.`,
      cta: "Envie 25 XLM",
      successBody: `Pagamento enviado — 25 XLM, final, irreversível, em registro público:

\`{tx}\`

Taxa, aumento de sequência, dois saldos atualizados, um fechamento de ledger. Cinco segundos. Essa é uma transferência Stellar.`,
    },
    "quiz-recap": {
      question: `Alguém quer enviar **USDC** para a sua segunda conta. Ele chegará?`,
      options: [
        "Não — a segunda conta nunca abriu uma linha de confiança USDC, então o pagamento falha com op_no_trust",
        "Sim — qualquer conta pode receber qualquer ativo",
        "Somente se pagarem uma taxa maior",
      ],
      explain: `Correto. As linhas de confiança são por conta, por ativo. Sua conta principal confia em USDC; a segunda conta só tem XLM nativo. E como o segredo dela foi jogado fora, ninguém pode abrir uma para ela.`,
    },
    "claim": {
      body: `O ledger registra tudo o que você acabou de fazer: uma conta criada, uma trustline aberta e um pagamento liquidado. Informe seu endereço, e a Forja consultará a própria cadeia — **prova, não promessa** — antes de liberar seu XP.`,
    },
  },
} satisfies LabTextOverlay;
