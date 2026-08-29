import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "O Baú do Tesouro",
    tagline: "Tranque ouro num baú que só o beneficiário nomeado abre.",
  },
  steps: {
    intro: {
      body: `## Ouro que ainda não é de ninguém

Todo saldo que você viu até aqui pertence a uma conta. Um **saldo reclamável** não pertence a ninguém: é uma entrada própria no ledger, guardando um valor, nomeando quem pode pegá-lo e sob qual condição.

Quem enviou não tem mais o ouro. Quem vai receber também não tem — não até estender a mão. No meio do caminho, ele fica no ledger, visível para todos, sacável por exatamente um endereço.

É assim que custódia, airdrop, vesting e "toma, pega quando puder" são construídos sem uma linha de contrato.`,
    },
    "forge-keys": {
      title: "Traga suas chaves",
      body: `O mesmo par de chaves que a Forja usa. Se você já forjou um em outro lab, isto simplesmente o retoma.`,
      cta: "Preparar as chaves",
      successBody: `Trabalhando como \`{address}\`.`,
    },
    fund: {
      title: "Funde a conta",
      body: `Um saldo reclamável custa uma reserva a quem o cria — o ledger cobra por toda entrada que precisa guardar. Você precisa de XLM antes de poder trancar qualquer coisa.`,
      cta: "Chamar o Friendbot",
      successBody: `Fundeado: {balance} XLM.

Guarde esse número. Em dois passos ele estará menor do que o valor trancado — porque o próprio baú tem aluguel.`,
    },
    "quiz-nature": {
      question: `Você tranca 5 XLM num saldo reclamável para um amigo. Antes de ele reivindicar, o saldo de quem contém esses 5 XLM?`,
      options: [
        "De ninguém — fica como entrada própria no ledger até o beneficiário pegar",
        "Ainda o seu, só que marcado como reservado",
        "Já o do seu amigo, ele só não percebeu",
      ],
      explain: `É isso que o diferencia de um pagamento pendente. A entrada existe, os fundos estão comprometidos, e a única conta que pode movê-los é a que está nomeada nela.`,
    },
    lock: {
      title: "Tranque o baú",
      body: `Cinco XLM, reclamáveis por você. Nomear a si mesmo é o jeito honesto de aprender o mecanismo — tudo funciona igual quando o beneficiário é outra pessoa.

A condição aqui é **incondicional**: reclamável assim que existe. A Stellar também deixa você dizer "não antes desta hora", que é como um cronograma de vesting ou uma abertura à meia-noite se escreve.`,
      cta: "Trancar 5 XLM",
      successBody: `O baú está no ledger.

Seu saldo em XLM caiu mais do que cinco: o extra é a **reserva** da própria entrada. Reivindique o saldo depois e essa reserva volta — o ledger aluga espaço, não vende.`,
    },
    "balance-id": {
      prompt: `## Encontre o seu próprio baú

O motor nunca te entregou o id do baú — hash de transação não é id de saldo. Então vá ler o ledger.

Abra a **Forja → ledger**, escolha *saldos reclamáveis* e ponha o seu próprio endereço no campo de beneficiário. Seu baú é a entrada com \`5.0000000\`. Copie o \`id\` dela — 72 caracteres hexadecimais — e cole aqui.`,
      placeholder: "0000000000…",
      hint: "72 caracteres hexadecimais, começando com vários zeros.",
    },
    claim: {
      title: "Abra o baú",
      body: `Você é o beneficiário nomeado, e a condição está satisfeita. Pegue o ouro de volta.`,
      cta: "Reivindicar o saldo",
      successBody: `Reivindicado. A entrada sumiu do ledger, os cinco XLM voltaram para o seu saldo — e a meia reserva que pagava o aluguel dela também.

Rode a consulta do ledger de novo: o baú não existe mais. O que resta é a *operação* no seu histórico, que é exatamente o que prova que você fez isso.`,
    },
    "quiz-predicate": {
      question: `Você quer um baú que sua sócia só possa abrir **depois do cliff de vesting**, daqui a um ano. O que muda?`,
      options: [
        "O predicado do beneficiário — \"não antes daquela data\" no lugar de incondicional",
        "Você precisa publicar um contrato para segurar isso",
        "Nada — é só pedir educadamente para ela esperar",
      ],
      explain: `Predicados se compõem: antes/depois de um instante, e/ou/não de outros predicados. Uma classe inteira de custódia nunca precisa de contrato — e o que não tem contrato não pode ter bug de contrato.`,
    },
    "claim-xp": {
      body: `Você trancou valor numa entrada que não era de ninguém, achou ela lendo o ledger com as próprias mãos, e pegou de volta.

O servidor vai conferir no seu histórico de operações aquele \`create_claimable_balance\`. Ele não aceita sua palavra — nunca aceita.`,
    },
  },
} satisfies LabTextOverlay;
