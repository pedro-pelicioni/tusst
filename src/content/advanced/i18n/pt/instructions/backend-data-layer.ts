// PT · editor instructions — The Data Layer.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-data-layer.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendDataLayerInstructionsPt: Record<string, { instructions: string }> = {
  "backend-data-layer-1": {
    instructions: `## Index Scan vs Seq Scan: linhas examinadas

Um lookup em B-tree é uma descida — O(log n) — seguida de uma caminhada pelo nível das folhas — O(k). Um sequential scan é O(n) seja qual for o predicado: examina todas as 1000 linhas para devolver 1.

"Linhas examinadas" é o número que o \`EXPLAIN ANALYZE\` reporta como \`rows\` em cada nó. Imprima esse número, e a assintótica deixa de ser uma afirmação.

### Sua tarefa

1. \`seq_scan(rows: &[Row], lo: u32, hi: u32) -> (Vec<u32>, usize)\` — toque em toda linha, conte cada uma tocada, colete o \`amount\` daquelas cujo \`id\` cai em \`lo..=hi\`.
2. \`index_scan(idx: &BTreeMap<u32, Row>, lo: u32, hi: u32) -> (Vec<u32>, usize)\` — percorra a faixa no índice e conte só as entradas que a faixa realmente visita.
3. Em \`main\`, construa 1000 linhas (\`id\` 1..=1000, \`amount = id * 3\`) e um \`BTreeMap<u32, Row>\` chaveado por \`id\`.
4. Rode os dois planos sobre \`(500, 500)\`, \`(500, 509)\` e \`(500, 599)\`, imprima a tabela e depois imprima se os dois planos devolveram linhas idênticas.

Saída esperada:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

### Dicas

- \`idx.range(lo..=hi)\` produz \`(&u32, &Row)\` exatamente para as chaves na faixa — não visita o resto.
- O cabeçalho e cada linha usam \`"{:>11}  {:>7}  {:>9}  {:>9}"\`.
- \`format!("{}..={}", lo, hi)\` monta o rótulo da faixa para o \`{:>11}\` conseguir alinhar à direita.
- Mantenha a contagem num \`examined\` local e faça \`examined += 1\` no topo de cada corpo de loop — contar as entradas que o plano visita é a medição, então tem que acontecer antes do predicado, não depois.
`,
  },

  "backend-data-layer-2": {
    instructions: `## Índices compostos e o prefixo à esquerda

Um índice em \`(tenant, status, created)\` é **uma** estrutura chaveada pela tupla concatenada, ordenada lexicograficamente. As únicas faixas contíguas que ele contém são as fixadas por um prefixo à esquerda.

Um buraco no meio degrada para um seek de prefixo mais um filtro residual — \`Rows Removed by Filter\` no \`EXPLAIN\`. Um predicado sem prefixo utilizável ganha um sequential scan.

### Sua tarefa

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, com \`created\` servindo também de id da linha.
2. \`index_scan(idx, lo, hi, keep) -> (usize, usize)\` — percorra \`idx.range(lo..=hi)\`, contando toda entrada visitada e toda que \`keep\` deixar passar.
3. \`seq_scan(rows, keep) -> (usize, usize)\` — toque em toda linha, para os predicados que prefixo nenhum atende.
4. Construa 1000 linhas como \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\` para \`id\` em \`1..=1000\`, e um \`BTreeMap<Key, u32>\` sobre elas.
5. Rode estas cinco consultas — todas contra \`tenant = 3\`, \`status = 1\`, \`created >= 700\` — e reporte qual prefixo cada uma usou:

| predicados | seek de | seek até | keep |
| --- | --- | --- | --- |
| tenant | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&all\` |
| tenant, status | \`(3, 1, 0)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, status, created | \`(3, 1, 700)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, created | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&late\` |
| status, created | *sem prefixo* — \`seq_scan\` | | uma closure sobre \`k.1 == 1 && k.2 >= 700\` |

com \`let max = u32::MAX;\`, \`let all = \|_k: Key\| true;\` e \`let late = \|k: Key\| k.2 >= 700;\`. A quarta linha é o buraco no meio: o seek só consegue fixar \`tenant\`, e \`late\` filtra o resto.

Saída esperada:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

### Dicas

- O limite superior de um seek de prefixo preenche as colunas sem restrição com \`u32::MAX\`.
- \`keep\` é um \`&dyn Fn(Key) -> bool\`; passe \`&all\` quando o seek é exato e \`&late\` quando um filtro residual está fazendo o trabalho.
- \`report\` usa \`"{:<24}{:<26}{:>9}{:>9}"\`, e o cabeçalho também.
`,
  },

  "backend-data-layer-3": {
    instructions: `## O modelo de custo por trás do EXPLAIN

O planner enumera planos e precifica cada um em unidades arbitrárias construídas a partir de quatro constantes — \`seq_page_cost\`, \`random_page_cost\`, \`cpu_tuple_cost\`, \`cpu_index_tuple_cost\`. Um seq scan é um preço fixo; um index scan é um preço por linha casada. As curvas se cruzam, e o planner fica com a mais barata.

As constantes aqui estão escaladas para inteiros, então nada depende de floats.

### Sua tarefa

1. \`seq_cost() -> u64\` — \`ROWS / ROWS_PER_PAGE\` páginas a \`SEQ_PAGE_COST\`, mais \`ROWS * CPU_TUPLE_COST\`.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` fetches aleatórios para descer, depois, por linha casada, um fetch de página aleatória mais \`CPU_TUPLE_COST + CPU_INDEX_COST\`.
3. Para cada seletividade em \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` partes por milhão, derive \`matched\`, precifique os dois planos e imprima o plano que o planner escolheria.
4. Encontre o crossover varrendo \`m\` para cima até \`index_cost(m) >= seq_cost()\`. Não deixe fixo no código.

Saída esperada:

\`\`\`text
selectivity  matched   seq cost  index cost  plan
     0.010%       10     150000        5220  Index Scan
     0.100%      100     150000       41400  Index Scan
     0.300%      300     150000      121800  Index Scan
     0.500%      500     150000      202200  Seq Scan
     1.000%     1000     150000      403200  Seq Scan
    10.000%    10000     150000     4021200  Seq Scan
crossover: seq scan wins from 371 rows (0.371%)
\`\`\`

### Dicas

- \`matched = ROWS * ppm / 1_000_000\`, nessa ordem — dividir primeiro perde as seletividades pequenas.
- Cabeçalho e linhas compartilham \`"{:>11}{:>9}{:>11}{:>12}  {}"\`.
- O rótulo da linha de crossover é \`selectivity_label(crossover * 1_000_000 / ROWS)\`.
- Ligue os dois preços a \`seq\` e \`idx\` em cada linha; o plano é \`if idx < seq { "Index Scan" } else { "Seq Scan" }\`, então empate vai para o seq scan.
`,
  },

  "backend-data-layer-4": {
    instructions: `## Paginação por cursor vs OFFSET

\`LIMIT 20 OFFSET 4980\` não faz seek. O servidor produz as linhas em ordem e descarta as primeiras 4980. Um índice na coluna de ordenação elimina o sort, não o pulo.

Um cursor keyset é a chave de ordenação da última linha, o que transforma "a próxima página" num predicado em que o índice consegue fazer seek — O(log n + limit) em qualquer profundidade.

### Sua tarefa

1. \`offset_page(rows: &[u32], offset: usize, limit: usize) -> (Vec<u32>, usize)\` — leia desde o começo e conte **toda** linha lida, incluindo as que o offset descarta.
2. \`cursor_page(idx: &BTreeMap<u32, u32>, after: u32, limit: usize) -> (Vec<u32>, usize)\` — faça seek estritamente depois de \`after\` e leia exatamente \`limit\` linhas.
3. 5000 linhas, \`PAGE = 20\`. Compare as páginas 1, 10, 50 e 250, imprimindo as linhas lidas por cada abordagem, e acompanhe se as duas devolveram páginas idênticas.
4. Depois percorra todas as 250 páginas dos dois jeitos e imprima os dois totais.

Saída esperada:

\`\`\`text
 page  first id  offset rows read  cursor rows read
    1         1                20                20
   10       181               200                20
   50       981              1000                20
  250      4981              5000                20
full crawl of 250 pages: offset reads 627500, cursor reads 5000
same rows on every page: true
\`\`\`

### Dicas

- \`idx.range((Bound::Excluded(after), Bound::Unbounded))\` é o seek. \`Bound::Included\` devolve de novo a última linha da página anterior.
- O cursor da página 1 é \`0\`, que fica abaixo de todo id da tabela.
- A tabela usa \`"{:>5}{:>10}{:>18}{:>18}"\`.
- Conte num \`read\` local com \`read += 1\` por linha. **Não** recorra a \`.skip(offset)\` somando \`offset\` de volta: a questão toda é que as linhas descartadas são produzidas uma a uma, e um adaptador de iterador esconde exatamente o custo que a lição está medindo.
`,
  },

  "backend-data-layer-5": {
    instructions: `## Níveis de isolamento e as anomalias que eles permitem

Cada anomalia é definida pelo que uma releitura vê. Um **dirty read** vê uma escrita não commitada. Um **non-repeatable read** vê uma linha mudar entre duas leituras. Um **phantom read** vê o *conjunto* mudar entre duas consultas de faixa.

Os níveis ANSI são definidos por quais dessas eles proíbem. Read Committed tira um snapshot por statement; Repeatable Read tira um por transação.

### Sua tarefa

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — uma função, quatro regras. \`ReadUncommitted\` sobrepõe \`pending\` a \`committed\`; \`ReadCommitted\` devolve \`committed\`; \`RepeatableRead\` devolve o snapshot mais as linhas commitadas ausentes dele; \`Serializable\` devolve só o snapshot.
2. \`read(level, store, snapshot, key) -> i64\` escolhe uma chave do conjunto visível (\`0\` quando não existe).
3. \`count_at_least(level, store, snapshot, min) -> usize\` roda uma consulta de faixa sobre o conjunto visível.
4. Trace três estágios: uma escrita **pendente** de \`200\` na chave 1, depois essa escrita **commitada**, depois uma nova linha \`(3, 100)\` inserida. Registre as leituras de cada nível em cada estágio.
5. Imprima as leituras e depois **derive** a tabela de anomalias a partir delas — dirty read é \`read #1 == 200\`, non-repeatable read é \`read #2 != 100\`, phantom é \`rows >= 100\` diferente de \`2\`.

Saída esperada:

\`\`\`text
level                 read #1  read #2  rows >= 100
read uncommitted          200      200            3
read committed            100      200            3
repeatable read           100      100            3
serializable              100      100            2

anomaly                RU    RC    RR   SER
dirty read            yes    no    no    no
non-repeatable read   yes   yes    no    no
phantom read          yes   yes   yes    no
\`\`\`

### Dicas

- O snapshot é \`vec![(1, 100), (2, 100)]\` e nunca muda.
- Repeatable Read é a regra interessante: mantém os *valores* do snapshot mas ainda vê linhas que não existiam nele, e é por isso que mostra o phantom e não o non-repeatable read.
- \`"{:<20}{:>9}{:>9}{:>13}"\` para a primeira tabela, \`"{:<20}{:>5}{:>6}{:>6}{:>6}"\` para a segunda, e um \`println!();\` seco entre elas.
`,
  },

  "backend-data-layer-6": {
    instructions: `## Transações, rollback e prepared statements

Uma transação é um buffer de escritas mais uma regra de atomicidade: dentro dela, as leituras veem suas próprias escritas não commitadas; fora, ninguém vê nada até o \`COMMIT\`. \`ROLLBACK\`, portanto, não desfaz nada — ele descarta um buffer que nunca foi aplicado.

Um prepared statement é estado de parse e plano do lado do servidor, nomeado e reutilizado. \`EXECUTE\` envia valores, não texto SQL.

### Sua tarefa

1. \`Db\` guarda \`rows\`, um vetor \`plans\` e um contador \`executions\`. \`prepare(sql)\` devolve o handle existente se aquele texto exato já foi compilado; caso contrário, faz push e devolve o novo índice. \`execute(plan)\` só incrementa \`executions\`.
2. \`Txn\` bufferiza escritas num \`BTreeMap<u32, i64>\`. \`get\` lê através do buffer e depois cai no store; \`set\` bufferiza; \`commit\` aplica toda escrita bufferizada em \`db.rows\`; \`rollback\` joga o buffer fora.
3. \`transfer(db, plan, from, to, amount)\` — debite \`from\`, credite \`to\` (chamando \`execute\` para cada um), depois releia \`from\`. Se ficou negativo, dê rollback e devolva \`Err(format!("CHECK balance >= 0 violated: {}", after))\`. Caso contrário, commite.
4. Abra com \`a = 100\`, \`b = 50\`. Transfira \`30\` (commita), depois faça \`prepare\` do mesmo SQL de novo e transfira \`500\` (viola a checagem). Imprima os snapshots e as estatísticas de plano.

Saída esperada:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

### Dicas

- \`self.plans.iter().position(|p| *p == sql)\` encontra um plano já compilado.
- \`commit(self, db)\` recebe \`self\` por valor, então o buffer não pode ser usado depois — é o sistema de tipos impondo o ciclo de vida.
- \`-430\` é \`70 - 500\`: o débito é bufferizado antes de a checagem rodar, e é isso que dá sentido à checagem.
`,
  },

  "backend-data-layer-7": {
    instructions: `## Connection pools e para onde vai a latência

Um pool é um número fixo de slots mais uma fila. A latência observada pelo cliente é **espera na fila + tempo de consulta**, e é por isso que o banco reporta uma consulta rápida enquanto o cliente vê uma requisição lenta — os dois números medem intervalos diferentes.

Além da concorrência útil do banco, slots extras não adicionam throughput; eles realocam a fila para dentro do banco, onde ela vira contenção.

### Sua tarefa

1. \`service_times() -> Vec<u32>\` — um LCG determinístico. \`seed\` começa em \`1\`; a cada passo \`seed = (seed * 1103515245 + 12345) % 2147483648\`, e o tempo de serviço é \`5 + (seed >> 16) % 21\`. Produza \`REQUESTS\` deles.
2. \`simulate(capacity, service) -> (u32, u32, usize, u32)\` — a requisição \`i\` chega em \`i * ARRIVAL_GAP\` e pega o slot livre mais cedo. Devolva \`(max wait, mean wait, checkout timeouts, makespan)\`; uma espera acima de \`CHECKOUT_TIMEOUT\` conta como timeout.
3. Imprima os tempos de serviço e o trabalho total do banco, e depois uma linha por capacidade em \`[1, 2, 4, 8, 16]\`.

Saída esperada:

\`\`\`text
service times (ms): [22, 9, 17, 6, 18, 25, 20, 11, 5, 17, 24, 25, 17, 11, 16, 13]
total db work: 256 ms over 16 requests

 capacity  max wait  mean wait  timeouts  makespan
        1       198         96        11       256
        2        74         34         4       132
        4        17          5         0        75
        8         0          0         0        58
       16         0          0         0        58
\`\`\`

### Dicas

- Use \`wrapping_mul\` / \`wrapping_add\` num seed \`u64\` para a multiplicação não poder estourar sob \`-D warnings\`.
- \`free_at\` é \`vec![0u32; capacity]\`; uma requisição começa em \`max(free_at[slot], arrival)\`, e sua espera é \`start - arrival\`.
- A espera média é divisão inteira: \`total_wait / REQUESTS as u32\`.
- Nada aqui toca no relógio. A simulação tem que ser determinística.
`,
  },
};
