import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "A Pulsação e a Conta",
  tagline: "Arquivamento de estado e taxas: estado é alugado, e uma chamada é medida, não leiloada.",
  steps: [
    {
      kind: "theory",
      body: `## O estado tem um batimento cardíaco

A maioria das cadeias deixa o estado se acumular para sempre — cada nó carrega todas as entradas abandonadas desde 2019. A Stellar recusa: **todo entry do Soroban tem um TTL** (time‑to‑live), contado em ledgers, e o aluguel o estende.

Quando o TTL se esgota:

- Entradas **Temporary** são deletadas. Desaparecem.
- Entradas **Persistent** e **instance** são **arquivadas** — removidas do ledger ativo, mas restauráveis depois com uma prova, retornando exatamente como estavam.

Isso é **arquivo de estado**, e nenhuma outra grande cadeia faz isso. O ledger ativo permanece enxuto, os validadores ficam baratos, a história permanece recuperável.`,
    },
    { kind: "widget", component: "state-archival",
      body: `As três prateleiras parecem idênticas enquanto o relógio corre. **Deixe os ledgers passarem** em cada uma e veja o que acontece no zero — esse instante é a diferença inteira entre elas.` },
    {
      kind: "theory",
      body: `## Um contrato, três prateleiras

Prateleiras abstratas viram decisão de projeto no instante em que você tem dado real. Pegue um contrato de escrow simples:

- **O endereço do admin e a taxa** vão para armazenamento de **instância**. Eles pertencem ao próprio contrato, são lidos em quase toda chamada, e se o contrato for arquivado devem ir junto — não há o que salvar numa taxa cujo contrato não existe mais.
- **Cada escrow aberto** vai para armazenamento **persistente**. Tem dinheiro de alguém ali. Se o TTL vencer, a entrada precisa continuar recuperável, porque "a gente esqueceu" não é resposta aceitável para "cadê meu dinheiro".
- **Uma cotação de vida curta** que quem chama busca antes de se comprometer vai para armazenamento **temporário**. Ela não vale nada em dez minutos e ninguém deveria pagar aluguel para mantê-la.

Repare na pergunta que decidiu cada uma. Não é "quão importante é isto?" — a taxa é crítica e mesmo assim fica na instância. A pergunta é: **o que deveria acontecer com isto se ninguém tocar por muito tempo?** Manter junto do contrato, manter recuperável, ou deixar ir.

Inverter isso dá uma falha silenciosa. Entradas de escrow em armazenamento temporário não dão erro no dia em que você as escreve. Elas funcionam perfeitamente, por meses.`,
    },
    {
      kind: "quiz",
      question: `Seu contrato rastreia o saldo de token de cada usuário. Qual camada de armazenamento?`,
      options: [
        "Persistent — os saldos precisam sobreviver a qualquer lapsus de TTL e ser restauráveis a partir do arquivo",
        "Temporary — é o mais barato, e os usuários podem redepositar se expirar",
        "Instance — os saldos pertencem ao contrato, então viajam com ele",
      ],
      answer: 0,
      explain: `A exclusão temporária é *permanente* — um saldo desaparecido é um rug‑pull por negligência. E o armazenamento de instância carrega em cada chamada, então colocar dados de usuário lá faz todos pagarem por todos.`,
    },
    {
      kind: "fill",
      prompt: `Coloque o saldo na prateleira correta.`,
      file: "token/src/lib.rs",
      before: `env.storage().`,
      after: `().set(&user, &balance);`,
      choices: ["persistent", "temporary", "instance", "eternal"],
      answer: 0,
      explain: `O soroban-sdk espelha as camadas uma a uma: \`env.storage().persistent()\`, \`.temporary()\`, \`.instance()\`. Não existe \`eternal\` — esse é o ponto central do design de aluguel.`,
    },
    {
      kind: "theory",
      body: `## Taxas que são medidas, não leiloadas

Em cadeias de leilão de gás você *dá lances* por espaço de bloco e reza; um mint popular pode multiplicar os custos de todos.

Soroban **mede** em vez disso. Uma transação declara seus **recursos** — instruções de CPU, memória, leituras e escritas no ledger, bytes — e a taxa é *calculada* a partir dessas necessidades mensuradas, mais o aluguel do armazenamento que ela toca. Declare honestamente (a simulação faz isso por você) e a parte reembolsável de qualquer superestima volta para você.

O resultado é um custo que você pode cotar antecipadamente: “esta ação custa cerca de um centavo” continua verdadeiro mesmo quando a rede está ocupada.`,
    },
    {
      kind: "theory",
      body: `## Simule primeiro, assine exatamente isso

Todo cliente Soroban segue um ritmo:

1. **Simule** a chamada contra um nó RPC — sem assinatura, sem custo.
2. A simulação devolve o **footprint** — exatamente quais entradas do ledger a chamada lerá e escreverá — além das estimativas de recursos e da autorização necessária.
3. Você **assina exatamente o que simulou** e submete.

A transação assinada carrega seu footprint, então os validadores conhecem todo o seu mundo antes de executá‑la; nada fora do footprint pode ser tocado. Pular a simulação é adivinhar números que a rede simplesmente rejeitará.`,
    },
    {
      kind: "quiz",
      question: `Por que o fluxo Soroban simula antes de assinar?`,
      options: [
        "A simulação calcula o footprint e as necessidades de recursos, assim você assina uma transação com limites exatos e aplicáveis",
        "É um ensaio cortês para depuração — apps de produção o ignoram",
        "A simulação pré‑executa a chamada para que os validadores não precisem rodá‑la novamente",
      ],
      answer: 0,
      explain: `Os validadores sempre re‑executam — mas apenas dentro do footprint declarado. A simulação é como a transação aprende seus próprios limites; o ledger então os impõe ao byte.`,
    },
  ],
  testOut: [
    { question: `O TTL de uma entrada temporária chega a zero. O que acontece com o dado?`,
      options: ["Ele é apagado — não existe restauração para armazenamento temporário, a preço nenhum","Ele é arquivado e pode ser restaurado por uma taxa, como qualquer outra entrada","Ele é mantido mas fica somente leitura até ser renovado"], answer: 0 },
    { question: `O TTL de uma entrada persistente chega a zero. O que acontece?`,
      options: ["Ela é arquivada, não apagada — chamadas que precisam dela falham até alguém restaurar, e restaurar é uma taxa","Ela é apagada, igual a uma entrada temporária","O contrato é pausado até a entrada ser reescrita"], answer: 0 },
    { question: `Por que o protocolo cobra aluguel de estado?`,
      options: ["Porque estado custa armazenamento de todo validador para sempre, então uma taxa única de escrita deixaria qualquer um impor um custo contínuo sem limite","Para desencorajar contratos de guardar qualquer coisa on-chain","Para financiar a operação dos validadores, paga com taxas de arquivamento"], answer: 0 },
    { question: `Qual é o ponto de simular uma chamada de contrato antes de assiná-la?`,
      options: ["A simulação devolve os recursos e o footprint exatos que a chamada precisa, e você assina isso — então a taxa é medida em vez de chutada","Ela confere o fonte do contrato em busca de vulnerabilidades conhecidas","Ela reserva uma vaga no próximo ledger para a chamada não ser espremida para fora"], answer: 0 },
  ],
};
