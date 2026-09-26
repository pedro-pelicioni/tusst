// PT · editor instructions — Indexers & Distributed Systems.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-indexers-distsys.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendIndexersDistsysInstructionsPt: Record<string, { instructions: string }> = {
  "backend-indexers-distsys-1": {
    instructions: `## Indexe um ledger, seja morto, retome

Um indexer são quatro coisas: uma **fonte** de eventos de ledger ordenados, um **cursor** nomeando o último que você terminou, um **processor** que dobra cada evento no estado, e um **store** guardando os dois. O cursor vive no store — é isso que faz dele um checkpoint em vez de uma variável.

Retomar é um filtro, não um seek: \`e.seq <= store.cursor\` é pulado. O store é um \`Vec\` de pares e não um \`HashMap\` porque a ordem de iteração precisa ser determinística para a saída ser reproduzível.

O parâmetro \`budget\` faz as vezes do crash.

### Sua tarefa

1. \`Store::apply\` soma \`e.delta\` em \`e.account\`, empurrando a conta se ela ainda não existir.
2. \`run\` pula eventos com seq menor ou igual a \`store.cursor\`, aplica no máximo \`budget\` dos demais, avança \`store.cursor\` para \`e.seq\` depois de cada apply, e imprime a linha de trace.
3. Em \`main\`: rode 1 com budget 5, imprima o checkpoint, imprima a linha do kill, depois rode 2 com \`usize::MAX\`, imprima o checkpoint, e então imprima a tabela de contas.

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

### Dicas

- Linha de trace: \`println!("  seq={} {:<6}{:>5}", e.seq, e.account, e.delta);\`
- Linha da tabela: \`println!("{:<8}{:>7}", account, balance);\`
- Conte os eventos aplicados num \`done\` local e dê \`break\` quando chegar a \`budget\` — o \`continue\` dos eventos já processados tem que vir primeiro, senão o budget é gasto em pulos.
`,
  },

  "backend-indexers-distsys-2": {
    instructions: `## Meça as duas ordens contra um mesmo crash

Todo passo de indexer são duas escritas — o efeito no store e o commit do cursor — e um crash pode cair entre elas.

**Cursor-first** é at-most-once: o checkpoint diz que \`seq=3\` está feito, o saldo nunca se moveu, e nenhum restart o relê. **Effect-first** é at-least-once: o efeito caiu, o checkpoint não, então o restart faz replay de \`seq=3\`. Um desses é recuperável a partir de dados que você ainda tem em mãos.

### Sua tarefa

1. \`drain\` percorre os eventos acima de \`store.cursor\`. Sob \`Order::CursorFirst\` ele commita o cursor **antes** do efeito; sob \`Order::EffectFirst\`, **depois**. Devolve \`true\` ao chegar em \`e.seq == crash_at\`, deixando o estado pela metade, e imprime a linha de trace só para os passos que completam.
2. Em \`main\`, para cada ordem: construa um \`Store\` novo, imprima o rótulo, drene com \`crash_at = 3\` e, se crashou, imprima a linha de restart e drene de novo com \`crash_at = 0\`.
3. Então imprima a tabela de resumo e as duas linhas de veredito.

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

### Dicas

- Trace: \`println!("  seq={} total={} cursor={}", e.seq, store.total, store.cursor);\`
- Linha de resumo: \`println!("{:<14}{:>7}{:>7}{:>10}", label(*order), applies, total, expected);\`
- \`for order in [Order::CursorFirst, Order::EffectFirst]\` itera um array por valor porque \`Order\` é \`Copy\`.
- Colete \`(order, store.total, store.applies)\` num \`Vec\` para a tabela ser impressa depois das duas execuções.
`,
  },

  "backend-indexers-distsys-3": {
    instructions: `## Torne o processor idempotente

At-least-once significa que o mesmo id de evento pode chegar duas vezes, eventos podem chegar fora de ordem, e o stream inteiro pode ser reentregue depois de um restart. As três coisas acontecem em \`delivered\`.

Idempotência é uma propriedade do processor, não do transporte: guarde os ids de evento aplicados no mesmo store que os dados, cheque antes do efeito, registre como parte da mesma escrita. A chave de dedupe tem que ser o id de evento atribuído pelo produtor: os ids 2 e 5 são pagamentos de 40 para bob idênticos byte a byte e os dois têm que cair, enquanto o id 2 chegando duas vezes tem que cair uma vez só. Um hash do payload não consegue distinguir esses dois casos.

### Sua tarefa

1. \`apply_naive\` credita incondicionalmente.
2. \`apply_idempotent\` retorna cedo quando \`e.id\` já está em \`self.seen\`; caso contrário registra o id e credita.
3. Em \`main\`, alimente \`delivered\` nos dois stores duas vezes, imprimindo uma linha por passada, depois imprima o total exactly-once, a tabela de saldos do idempotente e o tamanho do seen-set.

Saída esperada:

\`\`\`text
pass  naive  idempotent
   1    305         265
   2    610         265
exactly-once total: 265
account balance
alice       125
bob          80
carol        60
distinct event ids retained: 5
\`\`\`

### Dicas

- Linha de passada: \`println!("{:>4}{:>7}{:>12}", pass, naive.total(), safe.total());\`
- \`unique.iter().map(|e| e.amount).sum::<i64>()\` dá o total exactly-once.
- O seen-set aqui é ilimitado. Em produção é um índice único no id do evento, ou uma janela chaveada pelo cursor.
`,
  },

  "backend-indexers-distsys-4": {
    instructions: `## Faça rollback até o fork, reaplique o branch

O **hash do pai** de um bloco, não a altura, é o que diz se ele estende a sua cadeia. \`b3\` chega na altura 3 com pai \`a2\` enquanto a head é \`a5\` — só pela altura isso parece uma duplicata ou um buraco.

O rollback roda da head para baixo, aplicando o inverso do efeito de cada bloco, e para no ponto de fork. A ordem reversa importa assim que os efeitos deixam de ser comutativos.

### Sua tarefa

1. \`apply\` credita o bloco, empurra ele na cadeia, e imprime a linha de apply.
2. \`rollback_to\` retira os blocos acima de \`height\` da head para baixo, creditando o delta inverso de cada um e imprimindo uma linha de rollback.
3. Em \`main\`: indexe a cadeia canônica e chame \`report\`; imprima a linha de reorg; ache o fork localizando \`branch[0].parent\` na cadeia e pegando a altura daquele bloco; chame \`rollback_to\` com ela; imprima a linha do ponto de fork; aplique o branch; \`report\`; imprima a linha final sobre a carol.

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

### Dicas

- \`println!("  apply    {} height={} {} {:+}", b.hash, b.height, b.account, b.delta);\` — \`{:+}\` sempre imprime o sinal.
- \`while let Some(b) = self.chain.last().copied()\` te dá a head sem segurar um borrow durante o \`pop\`.
- \`self.chain.iter().position(|b| b.hash == branch[0].parent).map(|i| self.chain[i].height).unwrap_or(0)\`.
`,
  },

  "backend-indexers-distsys-5": {
    instructions: `## Codifique a máquina, e faça ela rejeitar

Uma coluna de status com seis valores string não é uma máquina de estados. A máquina é a relação de transição \`allowed(from, to)\`, e o valor dela está inteiramente naquilo para que ela devolve false.

O catch-all \`_ => false\` é o design: toda aresta que você não escreveu é recusada por construção. Estados terminais são os que não têm braço de saída — \`Confirmed\` e \`Failed\` não ganham nenhum, e é assim que um webhook duplicado atrasado não consegue ressuscitar uma transação confirmada.

\`Submitted -> Confirmed\` é recusado mesmo sendo o resultado que todo mundo quer: pular \`Pending\` destrói o registro de a transação ter passado pelo mempool.

### Sua tarefa

1. \`allowed\` casa em \`(from, to)\`. Arestas legais: \`Received -> Validating\`, \`Validating -> Submitted\`, \`Submitted -> Pending\`, \`Pending -> Confirmed\`, e \`-> Failed\` a partir de cada um de \`Received\`, \`Validating\`, \`Submitted\` e \`Pending\`. Todo o resto é \`_ => false\`.
2. \`Tx::transition\` aplica o movimento se \`allowed\`, senão incrementa \`rejected\` e deixa o estado intocado — imprimindo a linha from/to/veredito nos dois casos.
3. Em \`main\`, imprima o cabeçalho, dispare todas as transições propostas, imprima a linha final, e então conte as arestas de saída de \`Confirmed\` e \`Failed\`.

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

### Dicas

- Linha de veredito: \`println!("{:<11} -> {:<11} accepted", name(from), name(to));\`
- Conte as arestas de saída filtrando os seis status por \`allowed\`: \`[..].iter().filter(|t| allowed(*s, **t)).count()\`.
- Capture \`let from = self.status;\` antes de mutar, para a linha imprimir o estado de onde você saiu.
`,
  },

  "backend-indexers-distsys-6": {
    instructions: `## Calcule a sobreposição, depois particione o cluster

A garantia de sobreposição é estritamente \`R + W > N\`. A linha \`N=5, R=2, W=3\` soma exatamente 5 e **não** sobrepõe — um quorum de leitura de dois pode ser totalmente disjunto dos três nós que receberam a escrita, e devolve dado velho sem erro nenhum.

Com N=5, W=3 e uma partição 3|2, o lado majoritário ainda reúne quorum; o lado minoritário não chega nem a R=3 nem a W=3 e recusa os dois. Essa recusa é a escolha CP, e você a fez quando escolheu R e W.

Leituras se resolvem por **número de versão**, não por timestamp de relógio de parede.

### Sua tarefa

1. \`write\` devolve false a menos que o lado alcançável tenha pelo menos \`w\` nós; caso contrário grava \`version\` e \`value\` em todos eles e devolve true.
2. \`read\` devolve \`None\` a menos que o lado tenha pelo menos \`r\` nós; caso contrário devolve o maior \`(version, value)\` visto.
3. Em \`main\`: imprima a tabela de quorum para \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\` — N, R, W, R+W, se \`r + w > n\`, e as falhas que cada quorum ainda tolera (\`n - w\` na escrita, \`n - r\` na leitura). Depois rode a partição 3|2 com R=3, W=3: tente uma escrita de versão 2 / valor 250 em cada lado, leia de cada lado, e imprima a linha final sobre AP.

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

### Dicas

- Linha da tabela: \`println!("{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}", n, r, w, r + w, if overlaps { "yes" } else { "no" }, n - w, n - r);\`
- As chaves literais da linha de partição são escapadas como \`{{\` e \`}}\`.
- \`minority.iter().map(|n| n.id).collect::<Vec<_>>().join(",")\` monta a lista de nós.
- \`read\` dobra numa tupla \`best: (u32, i64)\`, substituindo-a sempre que \`n.version > best.0\` — a maior versão vence, e um timestamp de relógio de parede não seria uma ordem total entre nós.
`,
  },

  "backend-indexers-distsys-7": {
    instructions: `## Carimbe um trace com os dois relógios

Um relógio de Lamport são duas regras: incremente seu contador a cada evento, e ao receber uma mensagem eleve seu contador até pelo menos o do remetente antes de incrementar. Isso garante que \`a -> b\` implica \`L(a) < L(b)\` — e nada mais. \`c1\` tem L=1, \`a2\` tem L=2, e os dois são concorrentes.

Um vector clock mantém um contador por nó e toma o máximo elemento a elemento ao receber. \`a <= b\` componente a componente com pelo menos uma estritamente menor significa \`a -> b\`; nenhuma das duas direções significa **concorrente**, um veredito que Lamport estruturalmente não consegue produzir.

### Sua tarefa

1. \`happens_before\` devolve true quando toda componente de \`a\` é \`<=\` a de \`b\` e pelo menos uma é estritamente menor.
2. Percorra os eventos em ordem. Numa entrega (\`Some(src)\`), eleve o contador de Lamport deste nó até \`lamport_of[src]\` se ele for maior, e tome o máximo elemento a elemento de \`vector_of[src]\`. Então incremente o contador de Lamport do nó e a própria componente dele no vetor. Registre os dois stamps em \`lamport_of[i]\` / \`vector_of[i]\` e imprima a linha.
3. Imprima as linhas de veredito para os pares de índice de evento \`(1,3)\`, \`(4,1)\` e \`(2,4)\` — isto é, \`a2,b2\`, \`c1,a2\` e \`b1,c1\` — com o sinal da comparação de Lamport e o veredito do vetor. Feche com a linha de resumo.

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

### Dicas

- Linha de trace: \`println!("{}  {}     {}        [{},{},{}]", e.label, ["A", "B", "C"][e.node], lamport_of[i], vector_of[i][0], vector_of[i][1], vector_of[i][2]);\`
- Linha de veredito: \`println!("{},{}   {} {} {}    {}", ...)\` com o sinal calculado como \`"<"\`, \`">"\` ou \`"="\`.
- \`for (i, e) in events.iter().enumerate()\` te dá o índice sob o qual registrar os stamps.
- Dois pares de arrays: os relógios **vivos** \`lamport: [u64; 3]\` e \`vector: [[u64; 3]; 3]\`, indexados por nó — \`lamport[e.node] += 1\`, \`vector[e.node][e.node] += 1\` — e os stamps por evento \`lamport_of\` / \`vector_of\`, indexados por evento, para os quais você copia o relógio vivo depois de incrementar.
`,
  },
};
