import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Sua Primeira Carteira",
    tagline: "Crie um par de chaves, ative uma conta, abra uma trustline e envie XLM.",
  },
  steps: {
    "intro": {
      body: `## Todo herói precisa de um sigilo

No Stellar, sua identidade é um **par de chaves**: um endereço público que você mostra ao mundo (começa com \`G\`) e uma chave secreta que você guarda com a vida (começa com \`S\`).

Sem formulário. Sem e-mail. Sem permissão. Você *forja* uma identidade a partir de pura matemática — e, nos próximos minutos, ela terá fundos, aceitará um ativo e pagará outra conta. Tudo real, na **testnet**: o ambiente de treino da Stellar, onde as moedas não têm valor, mas a mecânica é a mesma.`,
    },
    "forge-keys": {
      title: "Forge suas chaves",
      body: `Um clique no martelo gera 32 bytes de aleatoriedade e deriva ambas as chaves a partir disso. O segredo fica **no seu navegador** — o TUSST nunca o vê, e nenhum servidor está envolvido em nada que você assine hoje.`,
      cta: "Forjar o par de chaves",
      successBody: `Seu sigilo foi forjado:

\`{address}\`

Esse endereço é público — compartilhe livremente. A chave secreta associada assina em seu nome; quem a possui controla a conta. Na testnet isso não tem consequência financeira. Na mainnet, proteja-a como um dragão protege seu ouro.`,
    },
    "friendbot": {
      title: "Desperte a conta",
      body: `No momento seu endereço é apenas matemática — **o ledger nunca ouviu falar dele**. Uma conta só existe quando alguém a financia além da *reserva base* (um pequeno depósito de XLM que paga pela entrada no ledger).

Na testnet, um espírito incansável chamado **Friendbot** financia quem pedir.`,
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
      title: "Crie um endereço companheiro",
      body: `Você não pode enviar um pagamento para o vazio — precisa de um **destino**. Vamos criar um segundo endereço: um pequeno santuário para receber seu primeiro pagamento.

Geraremos e *lançaremos a chave secreta no mar*. A conta existirá, receberá o que você enviar e não responderá a ninguém. Um monumento.`,
      cta: "Criar o endereço",
      successBody: `Endereço do santuário:

\`{companion}\`

Ele ainda não existe no ledger — igual ao seu antes do Friendbot. Mas desta vez **você** será quem o traz à vida.`,
    },
    "create-companion": {
      title: "Erga o santuário",
      body: `Uma operação \`create_account\` financia um novo endereço além da reserva base — exatamente o que o Friendbot fez por você. Agora você faz isso pelo santuário, usando **seu** saldo: 100 XLM de ouro de teste.`,
      cta: "Erga (envie 100 XLM)",
      successBody: `O santuário está ativo. Você acabou de realizar o mesmo rito que o Friendbot fez por você — **contas criam contas**. Essa é toda a hierarquia; não existe um registrador central.`,
    },
    "payment": {
      title: "Faça uma oferta",
      body: `O clássico. Uma operação \`payment\` move valor de uma conta para outra — liquidada em ~5 segundos, por uma taxa de cerca de **0.00001 XLM**. Essa é a transação que o Stellar foi construído em torno.`,
      cta: "Envie 25 XLM",
      successBody: `Oferta entregue — 25 XLM, final, irreversível, em registro público:

\`{tx}\`

Taxa, aumento de sequência, dois saldos atualizados, um fechamento de ledger. Cinco segundos. Essa é uma transferência Stellar.`,
    },
    "quiz-recap": {
      question: `Alguém quer enviar **USDC** para a conta do seu santuário. Ele chegará?`,
      options: [
        "Não — o santuário nunca abriu uma linha de confiança USDC, então o ledger o rejeita",
        "Sim — qualquer conta pode receber qualquer ativo",
        "Somente se pagarem uma taxa maior",
      ],
      explain: `Correto. As linhas de confiança são por conta, por ativo. Sua conta principal confia em USDC; o santuário só detém XLM nativo. E como seu segredo está no fundo do mar, ninguém pode abrir uma para ele.`,
    },
    "claim": {
      body: `O ledger registra tudo o que você acabou de fazer: uma conta criada, uma trustline aberta e um pagamento liquidado. Informe seu endereço, e a Forja consultará a própria cadeia — **prova, não promessa** — antes de liberar seu XP.`,
    },
  },
} satisfies LabTextOverlay;
