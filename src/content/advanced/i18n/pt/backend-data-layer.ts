import type { LessonStep } from "@/content/steps";

// PT · A Camada de Dados.

export const backendDataLayerStepsPt: Record<string, LessonStep[]> = {
  "backend-data-layer-1": [
    {
      kind: "theory",
      body: `Um índice B-tree é uma estrutura ordenada. Buscar uma chave é uma **descida** pelos nós internos — O(log n) — seguida de uma **caminhada sequencial** pelo nível das folhas encadeadas enquanto o predicado se sustentar — O(k), onde k é o número de linhas devolvidas. Total: O(log n + k).

Um sequential scan é O(n) qualquer que seja o predicado. Para devolver uma linha entre mil, ele lê as mil e descarta 999.

\`\`\`text
seq scan     id BETWEEN 500 AND 500   →  1000 rows examined, 1 returned
index scan   id BETWEEN 500 AND 500   →     1 row  examined, 1 returned
\`\`\`

"Linhas examinadas" não é força de expressão. É o número que o planner orça, e o número que o \`EXPLAIN ANALYZE\` imprime como \`rows\` em cada nó. Esta lição também o imprime, para que a assintótica deixe de ser uma afirmação que você tem de aceitar de boa fé.`,
    },
    {
      kind: "theory",
      body: `O outro lado da conta.

Um índice é uma **segunda cópia ordenada** das colunas de chave mais um ponteiro para a linha. Todo \`INSERT\`, todo \`DELETE\` e todo \`UPDATE\` que toque numa coluna indexada tem de escrevê-lo também. Três índices numa tabela quente mais ou menos triplicam o write amplification e o volume de WAL que a replicação e o backup depois têm de carregar.

Ele também precisa ficar residente para ser barato. Um índice em que ninguém filtra, faz join ou ordena é custo puro, pago em toda escrita, para sempre.

E o índice nem sempre vence na leitura. O custo dele é **proporcional às linhas casadas**, e num engine real cada linha casada pode ser um fetch de página aleatória. Com 50% de seletividade o sequential scan é simplesmente mais barato, e o planner sabe disso. A lição 3 calcula exatamente onde as duas curvas se cruzam; por ora, guarde o fato de que existe um crossover.`,
    },
    {
      kind: "quiz",
      question:
        "Uma consulta numa tabela de 10 milhões de linhas casa 6 milhões delas. Existe um índice B-tree na coluna do predicado. Por que o planner ainda pode escolher um sequential scan?",
      options: [
        "O custo do index scan cresce com as linhas casadas, então passado um crossover ele excede o custo fixo do seq scan",
        "Índices B-tree só são consultados para predicados de igualdade, nunca para ranges",
        "O índice só é usado depois que a tabela ultrapassa o limiar de tamanho do planner",
      ],
      answer: 0,
      explain:
        "Um índice deixa rápida uma consulta *seletiva*. O seq scan paga um preço fixo pela tabela inteira; o índice paga por linha casada mais um fetch aleatório a cada vez. Seis milhões de linhas casadas está muito além do ponto em que o preço fixo é a pechincha.",
    },
    {
      kind: "fill",
      prompt:
        "Faça o index scan buscar a faixa de chaves em vez de percorrer o índice inteiro.",
      file: "main.rs",
      before: "for (_key, r) in ",
      after: " {",
      choices: [
        "idx.range(lo..=hi)",
        "idx.iter().filter(|(k, _)| **k >= lo && **k <= hi)",
        "idx.values().take((hi - lo + 1) as usize)",
      ],
      answer: 0,
      explain:
        "A versão com filter devolve as mesmas linhas e é a tentadora — mas examina todas as 1000 entradas para isso, o que é um sequential scan usando o nome de um índice. `take` lê a *quantidade* certa do *lugar* errado: as primeiras k entradas, não as que estão na faixa.",
    },
    {
      kind: "quiz",
      question:
        "Uma tabela dominada por leitura ganha um quarto índice. Qual é o custo que você acabou de aceitar?",
      options: [
        "Toda escrita nessa tabela agora mantém uma quarta estrutura ordenada, e o WAL a carrega",
        "Nada relevante — leituras dominam a carga, então a manutenção se amortiza",
        "Só o espaço em disco; a manutenção do índice acontece em background no checkpoint",
      ],
      answer: 0,
      explain:
        "A manutenção é por *escrita*, não por leitura, então uma razão leitura:escrita alta não amortiza nada — só significa que o custo cai sobre um número menor de statements. E esses statements costumam ser justamente os sensíveis a latência.",
    },
    {
      kind: "editor",
      intro: `### Conte as linhas que cada plano examina

1. \`seq_scan(rows, lo, hi) -> (Vec<u32>, usize)\` — toque em toda linha, conte cada uma tocada, colete o \`amount\` daquelas cujo \`id\` está na faixa.
2. \`index_scan(idx, lo, hi) -> (Vec<u32>, usize)\` — use \`idx.range(lo..=hi)\` e conte só as entradas que a faixa realmente visita.
3. Construa 1000 linhas (\`id\` 1..=1000, \`amount = id * 3\`) e um índice \`BTreeMap<u32, Row>\` sobre elas.
4. Rode os dois planos sobre \`500..=500\`, \`500..=509\` e \`500..=599\`, imprima a tabela e depois confirme que os dois planos devolveram linhas idênticas.

Saída esperada:

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

Mesma resposta, três ordens de grandeza de diferença no trabalho feito.`,
    },
  ],

  "backend-data-layer-2": [
    {
      kind: "theory",
      body: `Um índice em \`(tenant, status, created)\` é **uma** estrutura ordenada, chaveada pela tupla concatenada. Não são três índices, e não é simétrico nas colunas.

A ordenação é lexicográfica. Então as únicas faixas de chave contíguas que a estrutura contém são as fixadas por um **prefixo à esquerda**:

\`\`\`text
(tenant)                     ✓ contiguous
(tenant, status)             ✓ contiguous
(tenant, status, created)    ✓ contiguous
(status)                     ✗ not a prefix
(created)                    ✗ not a prefix
(status, created)            ✗ not a prefix
\`\`\`

Um predicado só em \`status\` não nomeia faixa contígua nenhuma — as entradas que casam estão espalhadas pelo índice inteiro, uma vez por tenant. Não há a que fazer seek, então o planner cai num sequential scan da tabela.`,
    },
    {
      kind: "theory",
      body: `Duas formas de um índice composto degradar aquém de um seek completo.

**Um buraco no meio.** \`tenant\` e \`created\` sem \`status\` dá um seek de prefixo em \`tenant\` mais um **filtro residual** sobre tudo que ele encontrar: examina toda linha daquele tenant e devolve só as que também casam. A distância entre examinadas e casadas é precisamente o \`Rows Removed by Filter\` do \`EXPLAIN ANALYZE\`, e é ali que a latência se esconde — o exercício imprime 100 examinadas para 30 casadas.

**Um range cedo demais.** Só a *última* coluna usada no seek pode ser um range. Um range em \`status\` transforma \`created\` em filtro em vez de chave de seek. Daí a regra: colunas de igualdade primeiro, coluna de range por último.

**Covering index.** Se o índice carrega toda coluna que a consulta lê, o heap nunca é tocado — um index-only scan.

A mesma troca existe um nível acima, no schema. Uma coluna desnormalizada é um join materializado que você pode então indexar: você compra custo de leitura com write amplification e a possibilidade de anomalias de atualização. Exatamente a barganha que um índice faz, em outra granularidade.`,
    },
    {
      kind: "quiz",
      question:
        "Dado um único índice em `(tenant, status, created)`, qual consulta consegue fazer seek numa faixa contígua dele?",
      options: [
        "`WHERE tenant = 3 AND status = 1` — um prefixo à esquerda",
        "`WHERE status = 1 AND created > 700` — as duas colunas estão no índice, então o índice consegue atender",
        "`WHERE created > 700` — a coluna de range é indexada, então a faixa é contígua",
      ],
      answer: 0,
      explain:
        "O critério não é pertencer; é a posição. As entradas de `status = 1` só são contíguas *dentro* de um tenant, então sem um predicado em `tenant` elas ficam espalhadas pela estrutura inteira. Atender `(status, created)` exige um segundo índice, com o custo de escrita dele.",
    },
    {
      kind: "fill",
      prompt:
        "Faça seek direto para o início de `tenant = 3, status = 1, created >= 700`.",
      file: "main.rs",
      before: "let (e, m) = index_scan(&idx, ",
      after: ", (3, 1, max), &all);",
      choices: ["(3, 1, 700)", "(3, 700, 1)", "(0, 0, 700)"],
      answer: 0,
      explain:
        "A chave é uma tupla na ordem do índice — `(tenant, status, created)` — e não na ordem em que os predicados foram escritos. `(0, 0, 700)` é a crença de que uma chave inicial só pode restringir a coluna de range; ela faria seek para a frente do índice e leria tudo.",
    },
    {
      kind: "quiz",
      question:
        "`EXPLAIN ANALYZE` mostra um Index Scan com `rows=30` e `Rows Removed by Filter: 70`. O que aconteceu?",
      options: [
        "O índice fez seek num prefixo, e um filtro residual descartou 70 das 100 linhas que ele examinou",
        "O índice devolveu 30 linhas e o executor descartou 70 duplicatas produzidas pelo scan",
        "70 linhas foram removidas por um join posterior, e o índice examinou exatamente as 30 que devolveu",
      ],
      answer: 0,
      explain:
        "Um index scan só examina o que devolve quando o seek usa um prefixo *completo*. Com um buraco, ele examina a faixa inteira do prefixo e filtra. Aquela linha é o custo da coluna faltante, quantificado — e a crença arrumadinha de que um índice só toca no que devolve é o que faz as pessoas lerem isso errado.",
    },
    {
      kind: "editor",
      intro: `### Prove a regra do prefixo à esquerda

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, com \`created\` servindo também de id da linha.
2. \`index_scan(idx, lo, hi, keep) -> (examined, matched)\` — percorra \`idx.range(lo..=hi)\`, conte toda entrada visitada e toda que \`keep\` deixar passar.
3. \`seq_scan(rows, keep) -> (examined, matched)\` — para os predicados que prefixo nenhum atende.
4. Construa 1000 linhas: \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\`, e um \`BTreeMap<Key, u32>\` sobre elas.
5. Rode as cinco consultas e imprima qual prefixo cada uma usou.

Saída esperada:

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

A quarta linha é o filtro residual. A quinta é o que um prefixo faltante custa de verdade.`,
    },
  ],

  "backend-data-layer-3": [
    {
      kind: "theory",
      body: `O planner não conhece milissegundos. Ele enumera planos candidatos e precifica cada um em unidades arbitrárias montadas a partir de um punhado de constantes:

\`\`\`text
seq_page_cost           1.0     one sequentially-read page
random_page_cost        4.0     one randomly-fetched page
cpu_tuple_cost          0.01    processing one row
cpu_index_tuple_cost    0.005   processing one index entry
\`\`\`

**Seq scan** = \`pages x seq_page_cost + rows x cpu_tuple_cost\`. Um preço fixo, independente de quantas linhas casam.

**Index scan** = descida + \`matched x (random_page_cost + cpu costs)\`. Um preço por linha casada.

Um é plano, o outro tem inclinação. Eles se cruzam, e o planner escolhe o que for menor na contagem estimada de linhas. É isso a seleção de plano, inteira. O \`cost=X..Y\` do \`EXPLAIN\` é exatamente esses números: custo de startup, depois custo total.`,
    },
    {
      kind: "theory",
      body: `Tudo acima depende de uma entrada que o planner tem de adivinhar: **quantas linhas vão casar**.

A seletividade vem das estatísticas — \`n_distinct\`, a lista de most-common-values e o histograma, todos coletados pelo \`ANALYZE\`. O plano nunca é melhor do que essa estimativa.

A falha clássica em produção é uma estatística velha ou ausente. O planner estima 10 linhas, recebe 200.000, e insiste num nested loop que deveria ter sido um hash join. Então, ao ler um \`EXPLAIN ANALYZE\`, compare \`rows\` estimadas contra \`rows\` reais **primeiro**: uma diferença de 1000x ali é o bug, e o plano é só o sintoma.

O crossover também chega muito mais cedo do que a intuição sugere. Com as constantes padrão o índice perde bem abaixo de 1% da tabela. "O índice não está sendo usado" quase sempre quer dizer "o predicado não é seletivo o bastante".

**Particionamento** muda a aritmética, não a fórmula: um predicado na chave de partição elimina partições inteiras antes da precificação (partition pruning), então o planner precifica uma tabela menor. **Sharding** é o mesmo corte entre máquinas — com a diferença de que ninguém planeja entre shards por você. O fan-out e o merge são código da sua aplicação.`,
    },
    {
      kind: "quiz",
      question:
        "Uma consulta que deveria usar um índice está fazendo seq scan. Qual ação ataca a causa real?",
      options: [
        "Comparar rows estimadas vs reais no `EXPLAIN ANALYZE` e então corrigir a estimativa ou a seletividade do predicado",
        "Rodar `REINDEX` na tabela — o índice degradou e o planner não confia mais nele",
        "Criar um segundo índice na mesma coluna para o planner ter uma alternativa a precificar",
      ],
      answer: 0,
      explain:
        "O planner não esqueceu o índice; ele o precificou e achou caro. Um índice duplicado recebe o mesmo preço. `REINDEX` conserta bloat, que é um problema real e não este — a alavanca é a estimativa de linhas (`ANALYZE`, estatísticas estendidas) ou o próprio predicado.",
    },
    {
      kind: "fill",
      prompt:
        "Precifique uma linha casada de um index scan: o fetch de página é aleatório, não sequencial.",
      file: "main.rs",
      before: "    INDEX_DEPTH * RANDOM_PAGE_COST\n        + matched * (",
      after: ")",
      choices: [
        "RANDOM_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "SEQ_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "CPU_TUPLE_COST + CPU_INDEX_COST",
      ],
      answer: 0,
      explain:
        "A ordem do índice não é a ordem do heap, então cada linha casada é um fetch para uma página arbitrária — esse 4x é a razão inteira de existir um crossover. Cobrar `seq_page_cost` empurraria o crossover quatro vezes para longe; não cobrar custo de página nenhum faria o índice sempre vencer, que é exatamente a crença que os números refutam.",
    },
    {
      kind: "quiz",
      question:
        "O banco roda em NVMe. O que baixar `random_page_cost` de 4.0 para 1.1 realmente faz?",
      options: [
        "Move o ponto de crossover de toda consulta do banco, deslocando os planos em direção a index scans de forma generalizada",
        "Nada mensurável — é um parâmetro de documentação que descreve o hardware para os operadores",
        "Aplica-se só a bitmap heap scans, onde os fetches aleatórios já vêm ordenados por página",
      ],
      answer: 0,
      explain:
        "A razão entre `random_page_cost` e `seq_page_cost` é o que fixa o crossover. Mudá-la reprecifica todo index scan que o planner um dia vai considerar — um dos ajustes de maior alavancagem do sistema, e o mais deixado num valor calibrado para discos giratórios.",
    },
    {
      kind: "editor",
      intro: `### Precifique os dois planos e ache o crossover

1. \`seq_cost() -> u64\` — páginas lidas sequencialmente, mais um custo de CPU por linha.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` fetches aleatórios para descer, depois um fetch de página aleatória mais custos de CPU por linha casada.
3. Para cada seletividade em \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` partes por milhão, derive \`matched = ROWS * ppm / 1_000_000\`, precifique os dois planos e imprima aquele que o planner escolheria.
4. Depois **encontre** o crossover varrendo \`m\` para cima até \`index_cost(m) >= seq_cost()\` — não deixe fixo no código.

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

371 linhas de 100.000. É aí que começa "o índice não está sendo usado".`,
    },
  ],

  "backend-data-layer-4": [
    {
      kind: "theory",
      body: `\`LIMIT 20 OFFSET 4980\` não pula para lugar nenhum. O servidor produz as linhas em ordem, descarta as primeiras 4980 e devolve as 20 seguintes. O custo é O(offset + limit) — a página 250 custa 250 vezes a página 1.

Um índice na coluna de ordenação remove a **ordenação**, não o **pulo**. As linhas chegam já ordenadas, e ainda assim são produzidas e jogadas fora uma a uma.

\`\`\`text
page   1   →  20 rows read,  20 returned
page  10   → 200 rows read,  20 returned
page 250   → 5000 rows read, 20 returned
\`\`\`

O número que importa é a varredura inteira, porque é isso que um export em background ou um cliente com scroll infinito de fato executa: 250 páginas custam 627.500 leituras de linha por \`OFFSET\` e 5.000 por cursor.`,
    },
    {
      kind: "theory",
      body: `Um **cursor** é a chave de ordenação da última linha. A próxima página é:

\`\`\`sql
WHERE (created_at, id) > ($1, $2)
ORDER BY created_at, id
LIMIT 20
\`\`\`

Isso é um predicado em que o índice consegue fazer seek, então toda página custa O(log n + limit) por mais fundo que esteja.

Há uma exigência: uma **ordem total**. \`ORDER BY created_at\` sozinho não é uma — empates fazem linhas aparecerem em duas páginas ou em nenhuma. Acrescente um desempate único (a primary key) e compare como tupla.

Isso é tanto uma correção de correção quanto de velocidade. Numa tabela recebendo inserts, o \`OFFSET\` silenciosamente pula e duplica linhas entre buscas de página, porque o offset é medido contra um resultado que mudou por baixo dele. Um cursor está ancorado numa linha, então não pode.

A troca é honesta: um cursor não consegue saltar para a página 47 nem mostrar contagem de páginas. Se a UI precisa de páginas numeradas sobre uma tabela grande, isso é uma decisão de produto com preço atrelado.

Entre shards o cursor é o que torna o fan-out viável — cada shard faz seek no próprio cursor e devolve \`limit\` linhas para o merge. Com \`OFFSET\`, todo shard precisa produzir \`offset + limit\` linhas e descartar quase todas.`,
    },
    {
      kind: "quiz",
      question:
        "A coluna do `ORDER BY` está indexada, e a página 900 de um export paginado ainda estoura o timeout. Por quê?",
      options: [
        "O índice fornece a ordenação, mas não o pulo — as 18.000 linhas anteriores continuam sendo produzidas e descartadas",
        "O índice não pode ser usado com `LIMIT`, então o planner cai num sort",
        "O resultado não cabe mais em `work_mem`, então o sort transborda para disco",
      ],
      answer: 0,
      explain:
        "É a crença que coloca em produção uma consulta rápida em staging, onde você só olha a página 1, e que estoura na página 900 em produção. O índice removeu a ordenação. Nada removeu o pulo.",
    },
    {
      kind: "fill",
      prompt:
        "Faça seek para a primeira linha estritamente após o último id que a página anterior devolveu.",
      file: "main.rs",
      before: "for (id, _) in idx.range((",
      after: ", Bound::Unbounded)) {",
      choices: [
        "Bound::Excluded(after)",
        "Bound::Included(after)",
        "Bound::Unbounded",
      ],
      answer: 0,
      explain:
        "`Included` devolve de novo a última linha da página anterior em toda página — o clássico off-by-one de keyset, e um que parece correto até alguém contar. `Unbounded` recomeça do início a cada vez, o que é `OFFSET 0` para sempre.",
    },
    {
      kind: "quiz",
      question: "O que torna um cursor keyset mais rápido que `OFFSET`?",
      options: [
        "Ele carrega a chave de ordenação da última linha, então vira um predicado `WHERE` em que o índice consegue fazer seek",
        "Ele é um offset codificado, e decodificá-lo no servidor evita reparsear a consulta",
        "Ele guarda em cache o resultado da página anterior no servidor, de onde a próxima continua",
      ],
      answer: 0,
      explain:
        "A codificação é embalagem, não mecanismo — um offset codificado se comporta exatamente como `OFFSET`. O que o torna rápido é que o valor do cursor pode ser comparado contra a chave do índice. Não há estado nenhum no servidor, que é também por que ele sobrevive a uma reconexão.",
    },
    {
      kind: "editor",
      intro: `### Conte o que o OFFSET lê

1. \`offset_page(rows, offset, limit) -> (Vec<u32>, usize)\` — leia desde o começo, conte toda linha lida **incluindo as puladas**, depois colete \`limit\` linhas.
2. \`cursor_page(idx, after, limit) -> (Vec<u32>, usize)\` — faça seek com \`Bound::Excluded(after)\` e leia exatamente \`limit\` linhas.
3. 5000 linhas, página de 20. Compare as páginas 1, 10, 50 e 250, e confira que as duas abordagens devolvem páginas idênticas.
4. Depois percorra todas as 250 páginas dos dois jeitos e imprima os totais.

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

125x menos linhas lidas, para a saída idêntica.`,
    },
  ],

  "backend-data-layer-5": [
    {
      kind: "theory",
      body: `As três anomalias clássicas são definidas, cada uma, pelo que uma **releitura** enxerga.

**Dirty read** — você observa um valor que outra transação escreveu e não commitou. Se ela der rollback, você agiu sobre um dado que nunca existiu.

**Non-repeatable read** — você lê a mesma linha duas vezes numa transação e obtém dois valores diferentes, porque outra transação commitou no meio.

**Phantom read** — você roda a mesma consulta de faixa duas vezes e a segunda devolve linhas que antes não estavam lá. As linhas que você já leu não mudaram; o *conjunto* mudou.

Os níveis de isolamento ANSI são definidos por quais dessas eles proíbem — não por como. Essa distinção é a lição: o nível é um contrato, o mecanismo é assunto do engine.`,
    },
    {
      kind: "theory",
      body: `O que as implementações de fato fazem.

**Read Committed** tira um snapshot novo por *statement*. **Repeatable Read** tira um por *transação*. Essa única diferença produz a segunda coluna da tabela que você está prestes a imprimir.

Os nomes dos níveis são um **piso, não uma especificação**. O \`REPEATABLE READ\` do Postgres é snapshot isolation e não permite phantoms, embora o ANSI permita que permitisse. O InnoDB do MySQL usa next-key locks e também bloqueia a maioria deles. Nunca porte uma suposição sobre anomalias entre engines com base no nome de um nível.

Snapshot isolation ainda permite **write skew**: duas transações leem cada uma um conjunto, cada uma checa um invariante, cada uma escreve uma linha *diferente*, e o invariante acaba violado embora nenhuma tenha visto conflito. Só o \`SERIALIZABLE\` de verdade (SSI no Postgres) o proíbe — e o proíbe **abortando** uma transação com um erro de serialização. Código serializable sem retry loop não é serializable na prática.

Locking é o lado do custo. Row locks são baratos e numerosos; page e table locks são grossos e baratos de rastrear. Alguns engines escalam row locks para table locks sob pressão de memória, e aí a concorrência desaba. Um predicado de faixa serializable precisa de um predicate ou gap lock cobrindo linhas que ainda não existem — que é por que ele é o nível caro.`,
    },
    {
      kind: "quiz",
      question:
        "Um relatório longo roda em `REPEATABLE READ`. O que isso garante?",
      options: [
        "O relatório vê um snapshot consistente; outras transações commitam livremente e ele simplesmente não as vê",
        "Nenhuma outra transação pode commitar mudanças nas linhas que o relatório lê até ele terminar",
        "As escritas do próprio relatório têm sucesso garantido no commit, já que o snapshot dele é fixo",
      ],
      answer: 0,
      explain:
        "Isolamento é sobre visibilidade, não sobre exclusão. Tratar uma transação longa como um lock é como as pessoas acabam segurando o horizonte do vacuum aberto por uma hora para proteger um dado que ninguém estava escrevendo — e uma escrita dessa transação ainda pode ser rejeitada no commit.",
    },
    {
      kind: "fill",
      prompt:
        "Read Committed tira um snapshot novo por statement — ele vê o que estiver commitado agora.",
      file: "main.rs",
      before: "        Level::ReadCommitted => ",
      after: ",",
      choices: [
        "store.committed.clone()",
        "snapshot.to_vec()",
        "store.pending.clone()",
      ],
      answer: 0,
      explain:
        "`snapshot.to_vec()` é a regra do Repeatable Read — um snapshot para a transação inteira — e trocar os dois é a confusão mais comum entre os níveis. `pending` sozinho mostraria só as escritas não commitadas e nada da tabela commitada.",
    },
    {
      kind: "quiz",
      question:
        "Um serviço muda de `READ COMMITTED` para `SERIALIZABLE` e não muda mais nada. Qual é o resultado provável?",
      options: [
        "Requisições passam a falhar sob contenção com erros de serialização, porque nada faz retry das transações abortadas",
        "O throughput cai mas a correção melhora estritamente, já que toda anomalia agora é impossível",
        "Nada muda no Postgres, onde o `READ COMMITTED` já fornece semântica serializable",
      ],
      answer: 0,
      explain:
        "`SERIALIZABLE` converte anomalias silenciosas em abortos barulhentos — uma melhoria só se quem chama faz retry. Sem retry loop, a aplicação fica menos correta do que era, porque agora devolve erros onde antes devolvia respostas um pouco erradas. (Padrões que vale saber: Read Committed no Postgres, Repeatable Read no MySQL.)",
    },
    {
      kind: "editor",
      intro: `### Derive a tabela de anomalias a partir de um trace

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — uma função, quatro regras. Read Uncommitted sobrepõe \`pending\` a \`committed\`; Read Committed devolve \`committed\`; Repeatable Read devolve o snapshot mais linhas que não existiam nele; Serializable devolve só o snapshot.
2. \`read(...)\` escolhe uma chave do conjunto visível; \`count_at_least(...)\` roda uma consulta de faixa sobre ele — é ali que o phantom aparece.
3. Trace três estágios: uma escrita pendente de \`200\` na chave 1, depois essa escrita commitada, depois uma nova linha 3 inserida.
4. Imprima as leituras e depois **derive** a tabela de anomalias a partir delas — não a afirme.

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

A escada é o ponto: cada nível proíbe uma anomalia a mais que o anterior.`,
    },
  ],

  "backend-data-layer-6": [
    {
      kind: "theory",
      body: `Uma transação é um **buffer de escrita mais uma regra de atomicidade**.

Dentro da transação, as leituras enxergam as suas próprias escritas não commitadas. Fora dela, nada as enxerga até o \`COMMIT\`. É isso, inteiro, o read-your-own-writes, e o exercício o implementa como um lookup que checa o buffer antes do store.

\`ROLLBACK\` portanto **não é um undo**. As mudanças nunca foram aplicadas em lugar nenhum que outra pessoa pudesse ver — o buffer é descartado, ou os registros não commitados do WAL simplesmente nunca são reaplicados. Dar rollback numa transação de um milhão de linhas não é proporcionalmente caro.

A durabilidade vem do write-ahead log: \`COMMIT\` é um \`fsync\` do registro de log, não das páginas de dados. Esse \`fsync\` é o piso duro da latência de escrita, que é por que commitar 1000 linhas numa transação bate 1000 transações, e por que group commit existe.

O que uma transação longa realmente custa não é trabalho de rollback. São os locks que ela segura e o horizonte de vacuum ou undo que ela prende, impedindo que versões antigas de linha sejam recuperadas.`,
    },
    {
      kind: "theory",
      body: `Um prepared statement é **estado no servidor**.

\`PREPARE\` parseia o SQL, monta um plano e o nomeia. \`EXECUTE\` manda *valores* de parâmetro pela conexão, não texto SQL. O reuso economiza o parse e normalmente o plano, o que para uma consulta OLTP curta é uma fração real do tempo total.

É também a defesa correta contra injection, por um motivo estrutural: os parâmetros chegam fora de banda e nunca são entregues ao parser. Escaping é um filtro que você pode errar; parameter binding é um canal que não consegue carregar sintaxe.

Duas pegadinhas.

**É por conexão.** Um pooler em transaction mode te entrega um backend diferente a cada transação, então o plano nomeado não está lá. É o motivo concreto de o transaction mode do pgbouncer e os prepared statements historicamente brigarem, e de os drivers re-prepararem depois de uma reconexão.

**Um plano reusado é um plano genérico**, escolhido sem conhecer os valores de parâmetro desta chamada. Numa coluna enviesada ele pode ser bem pior que um replanejado; o Postgres se protege precificando planos custom nas cinco primeiras execuções antes de decidir.

Deadlocks pertencem a este capítulo porque são uma falha de nível transacional. Duas transações atualizando as mesmas duas linhas em ordens opostas formam um ciclo; o engine o detecta e mata uma com erro de deadlock — ele não trava. Corrija ordenando as escritas por uma chave estável e mantendo as transações curtas, e faça todo chamador capaz de dar retry na vítima do deadlock.`,
    },
    {
      kind: "quiz",
      question:
        "Um job em lote escreve 2 milhões de linhas numa transação e então bate numa violação de constraint. Quanto custa o `ROLLBACK`?",
      options: [
        "Quase nada — as escritas nunca foram commitadas, então não há o que desfazer onde outros pudessem ver",
        "Aproximadamente o custo das escritas de novo, já que cada uma precisa ser revertida",
        "Nada no momento do rollback, mas uma reescrita completa da tabela no próximo checkpoint",
      ],
      answer: 0,
      explain:
        "A conclusão de sonoridade operacional sensata — 'então quebre escritas grandes em transações pequenas para manter o rollback barato' — tem o conselho certo e o motivo errado. Quebre por causa da duração dos locks e do horizonte de vacuum que a transação longa prende, não porque rollback seja caro.",
    },
    {
      kind: "fill",
      prompt:
        "A constraint falhou. Descarte as escritas bufferizadas em vez de aplicá-las e revertê-las.",
      file: "main.rs",
      before: "    if after < 0 {\n        ",
      after:
        ";\n        return Err(format!(\"CHECK balance >= 0 violated: {}\", after));\n    }",
      choices: ["txn.rollback()", "txn.set(from, a)", "txn.commit(db)"],
      answer: 0,
      explain:
        "`txn.set(from, a)` é a escrita compensatória — o que você faz quando não tem transação. Não há o que compensar: o store nunca foi tocado. `commit` aplica justamente a escrita que a checagem acabou de rejeitar.",
    },
    {
      kind: "quiz",
      question: "O que um prepared statement de fato reusa?",
      options: [
        "Estado de parse e plano no servidor, mantido por conexão e referenciado por nome",
        "Um template SQL no cliente, com os valores de parâmetro interpolados antes do envio",
        "Um resultado em cache no servidor, devolvido de novo quando os mesmos parâmetros chegam",
      ],
      answer: 0,
      explain:
        "Esse único fato explica as três propriedades de uma vez: é rápido porque não há o que reparsear, imune a injection porque valores nunca chegam ao parser, e quebrado sob um pooler em transaction mode porque a conexão que carrega o estado não é a que você recebe de volta.",
    },
    {
      kind: "editor",
      intro: `### Commite, dê rollback e prepare uma vez só

1. \`Db\` guarda \`rows\`, os \`plans\` compilados e um contador \`executions\`. \`prepare(sql)\` devolve o handle existente se aquele texto já foi compilado; \`execute(plan)\` só incrementa o contador.
2. \`Txn\` bufferiza escritas num \`BTreeMap<u32, i64>\`. \`get\` lê através do buffer e depois cai no store; \`set\` bufferiza; \`commit\` aplica toda escrita bufferizada; \`rollback\` joga o buffer fora.
3. \`transfer(...)\` debita, credita e então checa \`balance >= 0\` — commitando ou dando rollback conforme o caso.
4. Rode uma transferência de \`30\` (commita) e uma de \`500\` (viola a checagem). Prepare o mesmo SQL duas vezes e mostre que o handle é o mesmo.

Saída esperada:

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

Quatro execuções, um compile — e a transferência revertida não deixou traço no store.`,
    },
  ],

  "backend-data-layer-7": [
    {
      kind: "theory",
      body: `Um connection pool é uma **contagem fixa de slots mais uma fila**.

Abrir uma conexão Postgres custa um handshake TCP, TLS, autenticação e um processo backend forkado — de unidades a dezenas de milissegundos. Um pool amortiza isso mantendo N abertas e distribuindo-as: check out, use, check in.

Então a latência que o cliente observa é **espera na fila + tempo de consulta**. Quando o pool satura, o primeiro termo domina e o segundo não muda. É por isso que o \`pg_stat_statements\` mostra uma consulta rápida no mesmo instante em que o cliente vê uma requisição lenta: os dois números medem intervalos diferentes, e os dois estão certos.

A exaustão aparece como um timeout de checkout — \`PoolTimedOut\`, \`TimeoutError: QueuePool limit ... overflow\`. Isso é um sinal de capacidade sobre o seu serviço, não uma falha do banco.

A simulação torna isso concreto: com capacidade 1, a pior requisição espera 198 ms num pool cuja consulta mais longa dura 25 ms.`,
    },
    {
      kind: "theory",
      body: `Maior não é melhor.

Passada a concorrência útil do banco — grosso modo os cores mais o paralelismo de I/O efetivo — slots extras no pool não somam throughput. Eles tiram a fila do seu processo, onde ela é mensurável e limitada, e a colocam dentro do banco, onde vira contenção de lock e troca de contexto que degradam todo outro cliente. O exercício mostra isso sem rodeios: 8 slots e 16 slots produzem o mesmo makespan.

O teto real é multiplicativo: **instâncias x tamanho do pool vs \`max_connections\`**. Dez pods com pool de 20 são 200 conexões de um único serviço. Colapsar isso é para o que serve um pooler no lado do servidor (pgbouncer, pgcat), ao preço das restrições do transaction mode sobre estado de sessão.

A correção mais barata em geral não é um pool maior, e sim um **checkout mais curto**. Nunca segure uma conexão atravessando uma chamada HTTP, e nunca abra a transação antes de ter tudo que precisa para terminá-la.

Read replicas têm o próprio pool e o próprio lag. A replicação é assíncrona por padrão, então uma leitura disparada milissegundos depois da sua própria escrita pode legitimamente devolver o valor anterior. Read-your-writes significa rotear essa leitura para o primário, ou esperar a réplica alcançar o LSN que o seu commit devolveu. "É eventualmente consistente" não é um projeto; a regra de roteamento é.`,
    },
    {
      kind: "quiz",
      question:
        "O p99 de um endpoint pula de 30 ms para 400 ms. O banco reporta a mesma consulta com média de 4 ms, inalterada. O que olhar primeiro?",
      options: [
        "A espera de checkout de conexão — a latência do cliente inclui tempo de fila que o banco nunca vê",
        "O plano da consulta, já que um p99 de 400 ms com média de 4 ms significa que o plano virou para alguns valores de parâmetro",
        "Bloat de índice, que deixa algumas execuções lentas sem mover a média que o banco reporta",
      ],
      answer: 0,
      explain:
        "O reflexo de tunar a consulta é o que custa um dia sem mudar nada. O número do banco começa quando o statement chega numa conexão; o do cliente começa quando a requisição chega. Com o pool saturado, a diferença entre os dois é a regressão inteira.",
    },
    {
      kind: "fill",
      prompt:
        "Meça o que o cliente de fato experimenta antes de a consulta começar.",
      file: "main.rs",
      before: "        let wait = ",
      after: ";",
      choices: ["start - arrival", "free_at[slot] - arrival", "ms"],
      answer: 0,
      explain:
        "`ms` é a duração da própria consulta — o número que o banco reporta, e o que segue plano enquanto o p99 do cliente explode. `free_at[slot] - arrival` dá underflow quando o slot já estava livre antes de a requisição chegar, que é exatamente o caso sem contenção.",
    },
    {
      kind: "quiz",
      question:
        "Timeouts de checkout aparecem no pico de carga. Por que aumentar o tamanho do pool é o primeiro movimento errado?",
      options: [
        "Troca um erro limitado e visível por contenção dentro do banco — e, multiplicado pelas instâncias, por uma indisponibilidade de `too many connections` afetando todo serviço",
        "O tamanho do pool não pode ser mudado sem reiniciar a aplicação, então não é opção durante um incidente",
        "Um pool maior aumenta a memória por conexão, e esse é o único custo real",
      ],
      answer: 0,
      explain:
        "Um timeout num pool limitado é o sistema dizendo a verdade sobre a própria capacidade. Remover o limite não adiciona capacidade — ele muda a fila para um lugar onde você não a enxerga, e põe um recurso compartilhado em risco em nome de um serviço só.",
    },
    {
      kind: "editor",
      intro: `### Leia a espera de fila de um pool

1. \`service_times()\` — um LCG determinístico: seed \`1\`, \`next = seed * 1103515245 + 12345 mod 2^31\`, service \`= 5 + (next >> 16) % 21\`. Dezesseis deles.
2. \`simulate(capacity, service) -> (max wait, mean wait, timeouts, makespan)\` — requisições chegam a cada 3 ms e pegam o slot livre mais cedo. A espera é \`start - arrival\`; uma espera acima de \`CHECKOUT_TIMEOUT\` conta como timeout.
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

Nenhuma consulta ficou mais lenta entre capacidade 1 e capacidade 8. Só a espera mudou — e note que 16 slots não compram nada além de 8.`,
    },
  ],
};
