import type { LessonStep } from "@/content/steps";

// PT · Indexers e Sistemas Distribuídos.

export const backendIndexersDistsysStepsPt: Record<string, LessonStep[]> = {
  "backend-indexers-distsys-1": [
    {
      kind: "theory",
      body: `Um indexer são quatro coisas, e nada além disso.

| parte | função |
| --- | --- |
| source | eventos de ledger ordenados, replayable a partir de qualquer ponto |
| cursor | o número de sequência do último evento que você terminou |
| processor | faz o fold de um evento no estado |
| store | guarda o estado dobrado **e** o cursor |

A última linha é a que importa. Se o cursor mora numa variável local ele é uma barra de progresso; se mora no mesmo store que o dado ele é um checkpoint, e um checkpoint é a única coisa que sobrevive a um \`SIGKILL\`.

\`\`\`rust
struct Store {
    balances: Vec<(&'static str, i64)>,
    cursor: u64,
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Retomar é um **filtro**, não um seek:

\`\`\`rust
if e.seq <= store.cursor {
    continue;
}
\`\`\`

Esse único predicado é toda a história do restart. É também por isso que o contrato do source é "replayable a partir de um ponto arbitrário" — um feed que você só consegue consumir uma vez te obriga a tornar o cursor e o efeito atômicos, e isso você não consegue fazer entre dois sistemas.

O processor é um fold. Mesmo source, mesmo cursor inicial, mesmo estado final — que é o que transforma re-indexar de incidente em operação de rotina, dessas que você roda numa terça-feira.

A ordem de iteração do store precisa ser determinística, senão a saída não é reproduzível, e um indexer não reproduzível não pode ser comparado com um rebuild. É por isso que o store aqui é um \`Vec\` de pares e não um \`HashMap\`: a ordem de iteração de \`HashMap\` é aleatorizada por processo, de propósito.`,
    },
    {
      kind: "quiz",
      question:
        "O store guarda saldos já dobrados. Dá para reconstruir o cursor varrendo esse store depois de um crash?",
      options: [
        "Não — o fold descartou os números de sequência, então o maior que você processou não é recuperável a partir dos saldos",
        "Sim — pegue o maior número de sequência guardado em cada linha de conta",
        "Sim — a quantidade de eventos aplicados é igual ao cursor, então basta contar as linhas",
      ],
      answer: 0,
      explain:
        "O cursor não é um cache de algo que o dado já sabe. Ele é estado independente, que é exatamente por que precisa ser escrito.",
    },
    {
      kind: "fill",
      prompt:
        "Pule todo evento que o store já dobrou. O checkpoint nomeia o último evento **terminado**, então esse evento em si não pode ser reprocessado.",
      file: "main.rs",
      before: "for e in source {\n        if ",
      after: " {\n            continue;\n        }",
      choices: [
        "e.seq <= store.cursor",
        "e.seq < store.cursor",
        "e.seq == store.cursor",
      ],
      explain:
        "`<` reaplica o evento do checkpoint a cada restart — uma duplicata exatamente na emenda, que é o tipo mais difícil de enxergar. `==` pula um evento e reprocessa todos os abaixo dele.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Guardar o progresso em memória e reiniciar da sequência 0 depois de um crash é seguro quando:",
      options: [
        "todo efeito do processor é idempotente, então reprocessar a história inteira converge para o mesmo estado",
        "o ledger é append-only, já que nada abaixo da head pode mudar",
        "o restart acontece rápido o bastante para nenhum evento novo ter chegado",
      ],
      answer: 0,
      explain:
        "Append-only não diz nada sobre os seus efeitos colaterais: um `+= delta` aplicado duas vezes está errado por mais imutável que a fonte seja. Idempotência são as próximas três lições.",
    },
    {
      kind: "editor",
      intro: `### Indexe um ledger, seja morto, retome

1. \`Store::apply\` soma \`e.delta\` em \`e.account\`, empurrando a conta se ela ainda não existir.
2. \`run\` pula eventos com seq menor ou igual a \`store.cursor\`, aplica no máximo \`budget\` dos demais, avança \`store.cursor\` para \`e.seq\` depois de cada apply, e imprime a linha de trace.
3. Em \`main\`: rode 1 com budget 5 (o crash), imprima o checkpoint, depois rode 2 sem limite, e então imprima a tabela de contas.

Saída esperada:

\`\`\`text
run 1: resume from cursor=0
  seq=1 alice   100
  seq=2 bob      50
  seq=3 alice   -30
  seq=4 carol    20
  seq=5 bob      -5
  checkpoint cursor=5
-- process killed, store survives --
run 2: resume from cursor=5
  seq=6 alice    60
  seq=7 carol    15
  seq=8 bob      25
  checkpoint cursor=8
account balance
alice       130
bob          70
carol        35
\`\`\`

A linha de trace é \`"  seq={} {:<6}{:>5}"\`; a linha da tabela é \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-2": [
    {
      kind: "theory",
      body: `Todo passo de um indexer são **duas escritas** — o efeito no store, e o commit do cursor. Um crash pode cair entre elas, e a ordem das duas decide qual modo de falha você recebe. Não existe terceira opção sem uma transação cobrindo as duas.

**Cursor primeiro** dá at-most-once. O checkpoint diz que \`seq=3\` terminou, o saldo nunca mexeu, nenhum restart relê aquilo. A execução termina com \`total=120\` contra um esperado de \`150\` e não reporta erro nenhum.

**Efeito primeiro** dá at-least-once. O efeito entrou, o checkpoint não, então o restart reprocessa \`seq=3\` e chega a \`180\`. Errado — mas errado numa direção que uma dedupe key conserta.`,
    },
    {
      kind: "theory",
      body: `| ordem | crash entre as escritas | recuperável? |
| --- | --- | --- |
| cursor primeiro | evento pulado em silêncio | não — re-index completo |
| efeito primeiro | evento aplicado duas vezes | sim — dedupe pelo id do evento |

At-least-once é, portanto, a garantia de entrega sobre a qual você **constrói**, não uma que você tolera. "Exactly-once" num message broker significa entrega at-least-once mais processamento idempotente no consumidor; o broker está te vendendo a metade que você ainda tem que escrever.

Se o efeito e o cursor moram no mesmo banco, uma transação cobrindo os dois elimina o problema por inteiro. A questão de ordem é o que você enfrenta no momento em que eles não moram — linhas no Postgres, cursor no Redis — e essa separação normalmente foi introduzida por motivo de latência, por alguém que não sabia estar escolhendo um modo de falha.`,
    },
    {
      kind: "quiz",
      question:
        "\"Commita o cursor primeiro, aí você nunca faz o trabalho duas vezes.\" O que há de errado nisso?",
      options: [
        "Você nunca faz duas vezes porque às vezes não faz nenhuma — o evento pulado é irrecuperável e é reportado como sucesso",
        "Não há nada de errado; é a ordem correta, e duplicatas são a falha mais séria",
        "Só está errado porque a escrita do cursor é mais lenta que a escrita do efeito",
      ],
      answer: 0,
      explain:
        "O processo sai com 0, o log está limpo, e o total está faltando um evento. Você descobre por um job de reconciliação, semanas depois, se é que você tem um.",
    },
    {
      kind: "fill",
      prompt:
        "Efeito primeiro: o commit do cursor é a **última** escrita do braço, depois do ponto de crash. Commite a sequência que você realmente acabou de aplicar.",
      file: "main.rs",
      before:
        "store.total += e.amount;\n            store.applies += 1;\n            if e.seq == crash_at {\n                return true;\n            }\n            ",
      after: "\n        }",
      choices: [
        "store.cursor = e.seq;",
        "store.cursor += 1;",
        "store.cursor = e.seq - 1;",
      ],
      explain:
        "`+= 1` assume que os números de sequência são contíguos — um único buraco no feed e o cursor fica atrasado para sempre. `- 1` relê o evento que você acabou de terminar a cada restart.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Por que um evento perdido e um evento duplicado não são bugs simétricos?",
      options: [
        "A duplicata é recuperável a partir de dado que você ainda tem; a perda exige uma fonte que talvez você já não consiga reprocessar",
        "São simétricos — os dois deixam o total errado pelo valor de um evento",
        "A duplicata é pior, porque corrompe estado enquanto a perda apenas atrasa",
      ],
      answer: 0,
      explain:
        "Uma duplicata é um bug que você conserta para frente com uma dedupe key. Uma perda é um bug que só se conserta relendo a história — supondo que a janela de retenção não tenha passado.",
    },
    {
      kind: "editor",
      intro: `### Meça as duas ordens contra um mesmo crash

1. \`drain\` percorre os eventos acima de \`store.cursor\`. Sob \`CursorFirst\` ele commita o cursor **antes** do efeito; sob \`EffectFirst\`, **depois**. Devolve \`true\` ao chegar em \`e.seq == crash_at\`, deixando o estado pela metade.
2. Em \`main\`, rode as duas ordens com \`crash_at = 3\`, reinicie cada uma depois do crash (\`crash_at = 0\` nunca casa), e então imprima a tabela de resumo e as duas linhas de veredito.

Saída esperada:

\`\`\`text
cursor-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=3
  seq=4 total=70 cursor=4
  seq=5 total=120 cursor=5
effect-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=2
  seq=3 total=90 cursor=3
  seq=4 total=130 cursor=4
  seq=5 total=180 cursor=5
ordering      applies  total  expected
cursor-first        4    120       150
effect-first        6    180       150
cursor-first lost seq=3: no restart can recover it
effect-first applied seq=3 twice: dedupe can recover it
\`\`\`

A linha de trace só é impressa quando o passo completa; a linha de resumo é \`"{:<14}{:>7}{:>7}{:>10}"\`.`,
    },
  ],

  "backend-indexers-distsys-3": [
    {
      kind: "theory",
      body: `At-least-once significa que três coisas distintas podem acontecer com o seu consumidor, e as três aparecem no slice \`delivered\` desta lição:

- o mesmo id de evento chega **duas vezes** (id 2),
- eventos chegam **fora de ordem** (id 3 antes do id 2),
- o stream inteiro é **reentregue** depois de um restart (pass 2).

Idempotência é propriedade do *processor*, não do transporte. Mantenha o conjunto de ids de evento aplicados no mesmo store que o dado, cheque antes do efeito, e registre como parte da mesma escrita.

\`\`\`rust
fn apply_idempotent(&mut self, e: Event) {
    if self.seen.contains(&e.id) {
        return;
    }
    self.seen.push(e.id);
    self.credit(e.account, e.amount);
}
\`\`\`

O processor ingênuo sobe de 265 para 530 ao longo de duas passadas. O idempotente fica em 225 — o total exactly-once — nas duas.`,
    },
    {
      kind: "theory",
      body: `**A dedupe key tem que ser o id de evento atribuído pelo produtor.** Fazer hash do payload confunde dois eventos legitimamente idênticos: bob é pago 40 duas vezes aqui, de propósito, e um hash de payload derruba o segundo e o dinheiro junto.

**Independência de ordem e independência de duplicata são propriedades separadas.** Creditar um saldo é comutativo, então reordenar não custa nada nesta lição. Uma operação de \`set\` não é comutativa, e precisa de uma guarda de versão ou sequência — "aplique só se \`e.version > row.version\`" — em cima do dedupe.

**O seen-set aqui é ilimitado e não pode ser em produção.** Limite com um índice único no id do evento (o insert falha, a transação faz rollback, o efeito nunca entra), ou com uma janela ancorada no cursor, já que nada abaixo do checkpoint pode legitimamente reaparecer.`,
    },
    {
      kind: "quiz",
      question:
        "Seu broker anuncia entrega exactly-once. O que ainda precisa ser escrito no consumidor?",
      options: [
        "O dedupe do lado do consumidor — exactly-once é entrega at-least-once mais processamento idempotente, e o broker só fornece a primeira metade",
        "Nada, desde que o consumidor dê ack em cada mensagem antes de processá-la",
        "Só uma política de retry; a transação do broker cobre as escritas do consumidor",
      ],
      answer: 0,
      explain:
        "A transação de um broker cobre o log dele. Ela não cobre uma escrita no seu banco, então no instante em que o seu efeito sai do broker a garantia acaba.",
    },
    {
      kind: "fill",
      prompt:
        "Faça dedupe pela identidade do evento atribuída pelo produtor, não pelo que ele por acaso diz.",
      file: "main.rs",
      before: "fn apply_idempotent(&mut self, e: Event) {\n        if self.seen.contains(",
      after: ") {\n            return;\n        }",
      choices: ["&e.id", "&e.amount", "&e.account"],
      explain:
        "Dedupe pelo valor e o segundo 40 legítimo para bob some. Dedupe pela conta e você aplica exatamente um evento por conta, para sempre.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Por que um hash do payload do evento é uma dedupe key ruim para um feed de pagamentos?",
      options: [
        "Duas transferências legitimamente idênticas dão o mesmo hash, então a segunda é descartada em silêncio",
        "Hashear é lento demais para rodar em todo evento em volume de produção",
        "Hashes de payload colidem com frequência suficiente para confundir eventos não relacionados",
      ],
      answer: 0,
      explain:
        "A falha não é colisão no sentido criptográfico — os dois eventos são mesmo byte a byte idênticos. E ainda assim são dois pagamentos diferentes.",
    },
    {
      kind: "editor",
      intro: `### Torne o processor idempotente

1. \`apply_naive\` credita incondicionalmente.
2. \`apply_idempotent\` retorna cedo quando \`e.id\` já está em \`self.seen\`; caso contrário registra o id e credita.
3. Em \`main\`, alimente \`delivered\` nos dois stores **duas vezes**, imprimindo uma linha por passada, depois o total exactly-once, a tabela de saldos do idempotente e o tamanho do seen-set.

Saída esperada:

\`\`\`text
pass  naive  idempotent
   1    265         225
   2    530         225
exactly-once total: 225
account balance
alice       125
bob          40
carol        60
distinct event ids retained: 4
\`\`\`

A linha de passada é \`"{:>4}{:>7}{:>12}"\`; a linha de saldo é \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-4": [
    {
      kind: "theory",
      body: `O **parent hash** de um bloco, não a altura dele, é o que diz se ele estende a sua cadeia.

\`\`\`text
genesis - a1 - a2 - a3 - a4 - a5          <- indexed head
               \\
                b3 - b4 - b5 - b6         <- arrives, parent = a2
\`\`\`

\`b3\` chega na altura 3 enquanto a head é \`a5\`. Só pela altura, isso parece uma duplicata, ou um feed que voltou no tempo. Pelo \`parent\` não há ambiguidade: ele forka abaixo da head, então três blocos seus estão órfãos agora.

O rollback roda **da head para baixo**, aplicando o inverso do efeito de cada bloco, e para no ponto de fork. A ordem reversa importa no momento em que os efeitos deixam de comutar; desfazer para frente produz um store que nenhum branch jamais teve.`,
    },
    {
      kind: "theory",
      body: `Desfazer exige que você tenha guardado o suficiente para inverter. Guardar os blocos aplicados ao lado dos saldos é a versão barata — um indexer de verdade mantém um undo log ou snapshots por altura, porque "recomputa desde o genesis" não é tempo de resposta.

**Confirmado não é final.** Os 20 da carol foram creditados na altura 4 e ficaram de pé por dois blocos; depois do reorg o saldo dela é 0 e a linha sobrevive apenas como evidência. Finalidade é a profundidade a partir da qual você *deixa de estar disposto a desfazer* — uma política que você escolhe, não uma propriedade que o bloco carrega.

É disso que o par pending-versus-confirmed está te protegendo. Tudo que você expôs como confirmado acima do fork agora tem que ser retratado rio abaixo, e é por isso que um indexer emite eventos de reorg e não apenas updates de linha: um consumidor que só vê o saldo novo não tem como distinguir uma correção de um pagamento.`,
    },
    {
      kind: "quiz",
      question:
        "A head é `a5`. `b6` chega na altura 6 num branch que forka em `a2`. Por que não simplesmente avançar para a cadeia mais longa?",
      options: [
        "Aplicar `b3..b6` em cima de `a5` mantém os efeitos de `a3`, `a4` e `a5`, produzindo um estado que cadeia nenhuma teve",
        "Tudo bem, desde que o branch seja estritamente mais longo — essa é a regra da cadeia mais longa",
        "Tudo bem, mas só depois de reverificar as assinaturas de `b3..b6`",
      ],
      answer: 0,
      explain:
        "A regra da cadeia mais longa diz qual branch é canônico. Ela não diz nada sobre como levar o seu store até lá, e o seu store está segurando os efeitos de três blocos que aquele branch nunca conteve.",
    },
    {
      kind: "fill",
      prompt:
        "Ache o ponto de fork: o bloco da sua cadeia que o branch que chegou nomeia como parent.",
      file: "main.rs",
      before: "let fork = ix\n        .chain\n        .iter()\n        .position(|b| ",
      after: ")\n        .map(|i| ix.chain[i].height)\n        .unwrap_or(0);",
      choices: [
        "b.hash == branch[0].parent",
        "b.height == branch[0].height",
        "b.parent == branch[0].parent",
      ],
      explain:
        "Casar por altura acha `a3` — o bloco que está sendo orfanado — e faz rollback até 3, deixando `a3` aplicado. Casar parent com parent acha o irmão `a3` pelo mesmo motivo: os dois nomeiam `a2`.",
      answer: 0,
    },
    {
      kind: "quiz",
      question: "O que \"seis confirmações\" te dá de verdade?",
      options: [
        "Um custo de reversão alto o bastante para você escolher parar de desfazer — um argumento econômico, não uma garantia",
        "Uma garantia de protocolo de que um bloco naquela profundidade não pode mais ser substituído",
        "Uma garantia em operação normal, inválida apenas se a cadeia for atacada",
      ],
      answer: 0,
      explain:
        "Seis é um limiar que alguém escolheu. O seu indexer continua precisando de um caminho de rollback, porque o número que tornava aquilo antieconômico ontem é um parâmetro de mercado.",
    },
    {
      kind: "editor",
      intro: `### Faça rollback até o fork, reaplique o branch

1. \`apply\` credita o bloco, empurra ele na cadeia, e imprime a linha de apply.
2. \`rollback_to\` retira os blocos acima de \`height\` da head para baixo, creditando o delta **inverso** de cada um e imprimindo uma linha de rollback.
3. Em \`main\`: indexe a cadeia canônica e reporte; ache o fork localizando \`branch[0].parent\` na cadeia; faça rollback; aplique o branch; reporte; imprima a linha final sobre a carol.

Saída esperada:

\`\`\`text
  apply    a1 height=1 alice +100
  apply    a2 height=2 bob +50
  apply    a3 height=3 alice +30
  apply    a4 height=4 carol +20
  apply    a5 height=5 bob +10
head=a5 height=5
  alice    130
  bob       60
  carol     20
b3 arrives: parent=a2, our head=a5 -> reorg
  rollback a5 height=5 bob -10
  rollback a4 height=4 carol -20
  rollback a3 height=3 alice -30
  fork point height=2 hash=a2
  apply    b3 height=3 alice +5
  apply    b4 height=4 dave +70
  apply    b5 height=5 bob +10
  apply    b6 height=6 alice +15
head=b6 height=6
  alice    120
  bob       60
  carol      0
  dave      70
carol was credited in a4 and confirmed for 2 blocks; that credit is now gone
\`\`\`

As duas linhas de trace usam \`{:+}\` para o delta, então o sinal é sempre impresso.`,
    },
  ],

  "backend-indexers-distsys-5": [
    {
      kind: "theory",
      body: `Uma coluna de status com seis valores string não é uma máquina de estados. A máquina é a **relação de transição**:

\`\`\`rust
fn allowed(from: Status, to: Status) -> bool {
    match (from, to) {
        (Status::Received, Status::Validating) => true,
        (Status::Validating, Status::Submitted) => true,
        (Status::Submitted, Status::Pending) => true,
        (Status::Pending, Status::Confirmed) => true,
        // ... every state may fail ...
        _ => false,
    }
}
\`\`\`

O valor dela está inteiramente no que ela devolve **false**. O catch-all \`_ => false\` é o projeto, não formalidade: toda aresta que você não escreveu é recusada por construção, então acrescentar um sétimo status depois falha fechado em vez de liberar em silêncio uma dúzia de transições novas.`,
    },
    {
      kind: "theory",
      body: `**Estados terminais são os que não têm braço de saída.** \`Confirmed\` e \`Failed\` reportam 0 transições de saída cada, que é como um webhook duplicado e atrasado tentando mover uma transação confirmada de volta para \`Pending\` é rejeitado em vez de ressuscitá-la.

**Uma transição rejeitada tem que deixar o estado intocado e ser contada.** Três das sete propostas aqui são recusadas e a transação mesmo assim termina em \`Confirmed\`. Uma rejeição não logada é um incidente que você vai investigar do zero mais tarde, porque a única evidência de que aconteceu foi um branch que retornou cedo.

**\`Submitted → Confirmed\` é recusada** mesmo sendo o desfecho que todo mundo quer. Pular \`Pending\` significa que não há registro de a transação ter estado na mempool, e um cliente que faz polling por \`Pending\` nunca a vê — então a lógica de retry dele, o timer dele e a UI dele se apoiam todos numa aresta que nunca disparou.`,
    },
    {
      kind: "quiz",
      question:
        "A transação termina `Confirmed` de qualquer jeito. O que custa pular `Submitted → Pending → Confirmed`?",
      options: [
        "O audit trail, e todo consumidor que observa a aresta intermediária em vez do estado final",
        "Nada mensurável — estados intermediários existem para a UI, e o estado terminal é o que vale",
        "Só as métricas de tempo entre os dois estados",
      ],
      answer: 0,
      explain:
        "A pergunta da reconciliação não é \"está confirmada\" e sim \"como ela chegou lá\". Sem a linha intermediária, uma transação que nunca foi transmitida e uma que foi minerada em um segundo ficam idênticas.",
    },
    {
      kind: "fill",
      prompt:
        "Feche a tabela de transições. Toda aresta não escrita acima tem que ser recusada, e estados terminais têm que continuar terminais.",
      file: "main.rs",
      before: "(Status::Pending, Status::Failed) => true,\n        ",
      after: "\n    }",
      choices: ["_ => false,", "(_, Status::Failed) => true,", "_ => true,"],
      explain:
        "`(_, Status::Failed) => true` se lê como \"qualquer coisa pode falhar\" e libera calado `Confirmed → Failed`, destruindo a terminalidade. `_ => true` inverte a máquina numa tabela do que você por acaso proíbe.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Onde mora a checagem de transição — no handler da API, ou junto do estado?",
      options: [
        "Junto do estado, porque o handler de reorg, o job de backfill e o fix manual escrevem todos a mesma coluna e nenhum deles passa pelo handler",
        "No handler da API, já que é ali que chega toda requisição externa e onde o erro precisa ser devolvido",
        "Nos dois, duplicada, para o handler poder devolver um 409 sem round trip",
      ],
      answer: 0,
      explain:
        "Uma regra imposta em um de vários pontos de entrada não é uma regra, é uma convenção. Os escritores que a contornam são exatamente os que rodam sem supervisão às 3 da manhã.",
    },
    {
      kind: "editor",
      intro: `### Codifique a máquina, e faça ela rejeitar

1. \`allowed\` casa em \`(from, to)\`: um braço por aresta legal, \`_ => false\` para todo o resto. \`Confirmed\` e \`Failed\` **não** ganham braço de saída.
2. \`Tx::transition\` aplica o movimento se \`allowed\`, senão incrementa \`rejected\` e deixa o estado intocado — imprimindo a linha from/to/veredito nos dois casos.
3. Em \`main\`, dispare todas as transições propostas, imprima a linha final, e então conte as arestas de saída de cada estado terminal.

Saída esperada:

\`\`\`text
from        -> to          verdict
Received    -> Validating  accepted
Validating  -> Submitted   accepted
Submitted   -> Confirmed   REJECTED
Submitted   -> Pending     accepted
Pending     -> Confirmed   accepted
Confirmed   -> Failed      REJECTED
Confirmed   -> Pending     REJECTED
final=Confirmed rejected=3
Confirmed has 0 outgoing transitions
Failed has 0 outgoing transitions
\`\`\`

A linha de veredito é \`"{:<11} -> {:<11} accepted"\` / \`... REJECTED\`.`,
    },
  ],

  "backend-indexers-distsys-6": [
    {
      kind: "theory",
      body: `A garantia de sobreposição é estritamente \`R + W > N\`. Não \`>=\`.

| N | R | W | R+W | sobrepõe | write sobrevive a | read sobrevive a |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | 1 | 1 | 2 | não | 2 | 2 |
| 3 | 2 | 2 | 4 | sim | 1 | 1 |
| 3 | 1 | 3 | 4 | sim | 0 | 2 |
| 3 | 3 | 1 | 4 | sim | 2 | 0 |
| 5 | 2 | 3 | 5 | **não** | 2 | 3 |
| 5 | 3 | 3 | 6 | sim | 2 | 2 |

A quinta linha é a configuração que as pessoas colocam em produção acreditando ser segura. R+W é igual a N, então um quorum de leitura de dois nós pode ser inteiramente disjunto dos três que aceitaram a escrita. Ele devolve dado stale, sem erro e sem nenhuma forma de o chamador perceber.`,
    },
    {
      kind: "theory",
      body: `R e W são dois botões que se compensam **entre si**, não contra alguma "consistência" abstrata. Com N=3, \`W=1\` tolera duas falhas de nó na escrita e zero na leitura; \`W=3\` inverte isso. A latência segue a mesma curva, porque cada quorum espera pelo membro mais lento — então subir W sobe o p99 especificamente no caminho de escrita.

Uma partição não pede licença. Com N=5, W=3 e um split 3|2, o lado majoritário ainda reúne quorum e commita a versão 2; o lado minoritário tem dois nós alcançáveis e não chega nem a R=3 nem a W=3, então recusa os dois.

Essa recusa **é** a escolha CP, e você a fez quando escolheu R e W. Servir a versão 1 stale de n4/n5 teria sido a escolha AP — disponível, e errada. CAP não é uma propriedade da rede; é qual dessas duas linhas você colocou em produção.

Números de versão, não timestamps de relógio de parede, é o que torna a leitura resolvível: o leitor pega a maior versão entre as respostas que conseguiu.`,
    },
    {
      kind: "quiz",
      question: "Por que `R + W >= N` não é a regra de quorum?",
      options: [
        "Na igualdade os dois quoruns podem ser disjuntos — N=5, R=2, W=3 tem um conjunto de leitura que não toca nenhum dos três nós que aceitaram a escrita",
        "É a regra, sim; a forma estrita é uma convenção conservadora com um nó de folga",
        "Ela erra por um só para N par, onde não existe maioria",
      ],
      answer: 0,
      explain:
        "Casa dos pombos: R+W > N força pelo menos um nó a estar nos dois conjuntos. Com R+W = N sobra exatamente espaço para eles se evitarem, e a leitura stale é silenciosa.",
    },
    {
      kind: "fill",
      prompt:
        "Escreva a condição de sobreposição. Ela tem que forçar pelo menos um nó a estar no conjunto de leitura e no de escrita.",
      file: "main.rs",
      before: "let overlaps = ",
      after: ";",
      choices: ["r + w > n", "r + w >= n", "w > n / 2"],
      explain:
        "`>=` admite a linha N=5/R=2/W=3 acima. `w > n / 2` é a regra de maioria do lado da *escrita* — ela faz escritas concorrentes serializarem, mas não diz nada sobre um leitor enxergá-las.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Durante a partição 3|2, o lado minoritário pode continuar servindo leituras \"só um pouquinho atrasadas\"?",
      options: [
        "Só se você colocar R em 2 ou menos, que é o trade tornado explícito — e aí as leituras do lado majoritário também perdem a garantia de sobreposição",
        "Sim — leituras são seguras durante uma partição; só escritas precisam de quorum",
        "Sim, desde que marque a resposta como possivelmente stale",
      ],
      answer: 0,
      explain:
        "R é um número só para o cluster inteiro. Você não consegue baixá-lo para a minoria particionada e mantê-lo alto em todo o resto, e é por isso que a escolha se faz no momento da configuração e não durante o incidente.",
    },
    {
      kind: "editor",
      intro: `### Calcule a sobreposição, depois particione o cluster

1. \`write\` recusa a menos que o lado alcançável consiga reunir W nós; caso contrário grava versão e valor em todos eles.
2. \`read\` recusa a menos que o lado consiga reunir R nós; caso contrário devolve a **maior versão** vista.
3. Em \`main\`: imprima a tabela de quorum para \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\`, depois rode uma partição 3|2 com N=5, R=3, W=3 — escreva versão 2 / valor 250 em cada lado, leia de cada lado, e imprima a linha final sobre AP.

Saída esperada:

\`\`\`text
 N  R  W  R+W  overlaps  write survives  read survives
 3  1  1    2  no                     2              2
 3  2  2    4  yes                    1              1
 3  1  3    4  yes                    0              2
 3  3  1    4  yes                    2              0
 5  2  3    5  no                     2              3
 5  3  3    6  yes                    2              2
N=5 R=3 W=3, partition {n1,n2,n3} | {n4,n5}
  majority write v=2: ok
  minority write v=2: refused
  majority read: version=2 value=250
  minority read: refused
  minority still holds version=1 on n4,n5: serving that read is the AP choice
\`\`\`

A linha da tabela é \`"{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}"\`; as colunas de sobrevivência são \`n - w\` e \`n - r\`.`,
    },
  ],

  "backend-indexers-distsys-7": [
    {
      kind: "theory",
      body: `Um relógio de Lamport são duas regras: incremente seu contador a cada evento, e ao receber uma mensagem eleve seu contador a pelo menos o stamp do remetente antes de incrementar.

Isso garante que \`a → b\` implica \`L(a) < L(b)\`. É tudo que o relógio jamais prometeu, e a **recíproca é falsa**:

| par | lamport | causalidade |
| --- | --- | --- |
| a2, b2 | 2 < 3 | happens-before |
| c1, a2 | 1 < 2 | concorrentes |
| b1, c1 | 1 = 1 | concorrentes |

\`c1\` tem um stamp menor que \`a2\` e não há caminho causal entre os dois. Então "last write wins pelo timestamp de Lamport" é escolher um vencedor arbitrário entre escritas concorrentes e apresentar isso como resposta.`,
    },
    {
      kind: "theory",
      body: `Um **vector clock** mantém um contador por nó, incrementa só a própria componente, e tira o máximo elemento a elemento ao receber.

\`\`\`rust
fn happens_before(a: &[u64; 3], b: &[u64; 3]) -> bool {
    let mut strict = false;
    for i in 0..3 {
        if a[i] > b[i] { return false; }
        if a[i] < b[i] { strict = true; }
    }
    strict
}
\`\`\`

\`a ≤ b\` componente a componente com pelo menos uma estritamente menor significa \`a → b\`. Nenhuma das direções significa **concorrentes** — um veredito que Lamport estruturalmente não consegue produzir.

O custo está no formato do stamp: O(1) por evento para Lamport, O(nós) para vetores. É por isso que vetores não sobrevivem ao contato com um sistema que adiciona nós livremente, e por isso que a detecção de conflito costuma ser escopada por chave e não pelo cluster inteiro.

Concorrente é uma resposta de verdade, não uma indecisão. Detectar isso é o que te permite expor versões irmãs, um merge, ou uma pergunta ao usuário, em vez de descartar em silêncio uma de duas escritas que nunca se viram.`,
    },
    {
      kind: "quiz",
      question: "`L(a) < L(b)`. O que isso te diz sobre causalidade?",
      options: [
        "Nada — é compatível com `a → b` e com `a` e `b` serem concorrentes, como mostra a linha c1/a2",
        "Que `a` aconteceu antes de `b`, que é a garantia dada pelos relógios de Lamport",
        "Que `a` aconteceu antes de `b`, a não ser que os dois eventos estejam no mesmo nó",
      ],
      answer: 0,
      explain:
        "A implicação vale numa direção só: causalidade implica stamps ordenados, nunca o contrário. A contrapositiva ainda serve — `L(a) >= L(b)` prova que `a` não causou `b`.",
    },
    {
      kind: "fill",
      prompt:
        "A regra de recebimento de um vector clock: tome o máximo elemento a elemento entre o seu vetor e o do remetente, componente por componente.",
      file: "main.rs",
      before: "for k in 0..3 {\n                if ",
      after:
        " {\n                    vector[e.node][k] = vector_of[src][k];\n                }\n            }",
      choices: [
        "vector_of[src][k] > vector[e.node][k]",
        "vector_of[src][k] != vector[e.node][k]",
        "vector_of[src][k] > vector[e.node][e.node]",
      ],
      explain:
        "`!=` copia o valor do remetente mesmo quando o seu é maior, descartando história que você já tinha observado. Comparar contra `vector[e.node][e.node]` compara toda componente contra o seu próprio contador.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "O NTP mantém a frota dentro de alguns milissegundos. Por que não ordenar eventos pelo relógio de parede?",
      options: [
        "O skew rotineiramente excede o intervalo que você está tentando ordenar, e nenhum limite sobre ele é imponível — um receive pode carregar um timestamp anterior ao do send",
        "Relógios de parede servem para ordenar; relógios lógicos existem só para economizar os bytes de um timestamp",
        "Porque timestamps têm resolução de milissegundo, e empates não podem ser desempatados",
      ],
      answer: 0,
      explain:
        "Uma pausa de VM, um leap-second smear ou um peer NTP ruim move um relógio mais do que os microssegundos que separam duas escritas na mesma chave. Relógios lógicos existem porque esse limite não é imponível.",
    },
    {
      kind: "editor",
      intro: `### Carimbe um trace com os dois relógios

1. \`happens_before\` é verdadeiro quando toda componente de \`a\` é \`<=\` a de \`b\` e pelo menos uma é estritamente menor.
2. Percorra os eventos em ordem. Numa entrega, eleve o contador de Lamport deste nó até o stamp do remetente e tome o máximo elemento a elemento do vetor do remetente; então incremente o contador de Lamport do nó e a própria componente dele. Registre os dois stamps por evento e imprima a tabela.
3. Imprima as linhas de veredito para os pares \`(a2,b2)\`, \`(c1,a2)\` e \`(b1,c1)\` — índices de evento \`(1,3)\`, \`(4,1)\` e \`(2,4)\`.

Saída esperada:

\`\`\`text
ev  node  lamport  vector
a1  A     1        [1,0,0]
a2  A     2        [2,0,0]
b1  B     1        [0,1,0]
b2  B     3        [2,2,0]
c1  C     1        [0,0,1]
b3  B     4        [2,3,0]
c2  C     5        [2,3,2]
pair    lamport  vector verdict
a2,b2   2 < 3    happens-before
c1,a2   1 < 2    concurrent
b1,c1   1 = 1    concurrent
a smaller lamport stamp does not mean caused-by: see c1,a2
\`\`\`

A letra do nó vem de \`["A", "B", "C"][e.node]\`; a linha de trace é \`"{}  {}     {}        [{},{},{}]"\` e a linha de veredito é \`"{},{}   {} {} {}    {}"\`.`,
    },
  ],
};
