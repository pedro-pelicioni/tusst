// PT · editor instructions — Running It in Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-production.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendProductionInstructionsPt: Record<string, { instructions: string }> = {
  "backend-production-1": {
    instructions: `## Counters, gauges e histograms

Um **counter** é monotônico e sem sentido como valor — o que você lê é a taxa dele. Um **gauge** é um nível num instante, que sobe e desce. Um **histogram** são contadores de bucket cumulativos mais \`_sum\` e \`_count\`.

Duas armadilhas. Um gauge só é visto na hora do scrape, então tudo que sobe e desce entre dois scrapes é invisível. E cada valor de label distinto é uma série temporal separada — labels são para conjuntos limitados, nunca para um id de usuário.

### Sua tarefa

1. Implemente \`Histogram\`: \`observe(v)\` soma \`v\` em \`sum\` e incrementa o primeiro bucket cujo limite é \`>= v\`; \`count()\` totaliza as observações; \`above(bound)\` lê a cauda a partir dos buckets.
2. Percorra os 12 ticks. O counter recebe \`ARRIVALS[t]\`; o gauge recebe \`ARRIVALS[t] - DEPARTURES[t]\`. Rastreie o pico real a cada tick e o pico que um scrape veria, coletando quando \`t % 3 == 2\`.
3. Observe cada latência, imprima a linha de buckets, depois a média e quantas passaram de 100 ms.

Saída esperada:

\`\`\`text
tick  accepted  active  scrape
   0         4       4  -
   1        10       9  -
   2        12       3  yes
   3        21      11  -
   4        26      14  -
   5        27       4  yes
   6        30       5  -
   7        37      11  -
   8        39       5  yes
   9        43       8  -
  10        46       9  -
  11        47       2  yes

counter accepted_total = 47 (monotonic)
gauge   active = 2, true peak = 14, peak seen by scrapes = 5

le<=10 le<=50 le<=100 le<=500 +Inf
    15      2       0       3    0
mean = 42.2 ms; over 100 ms = 3 of 20
\`\`\`

### Dicas

- \`observe\` percorre \`BOUNDS\` enquanto \`v > BOUNDS[i]\`, então um valor igual a um limite fica naquele bucket. O índice que sai do loop é \`4\` (o bucket \`+Inf\`) para qualquer coisa acima de \`500\`.
- \`above(100)\` acha o primeiro limite \`>= 100\` e soma todo bucket depois dele. Não guarde as amostras para ordenar — a questão é que os buckets já sabem.
- A coluna de scrape imprime \`"yes"\` ou \`"-"\`; o cabeçalho é \`tick  accepted  active  scrape\` com larguras \`{:>4}  {:>8}  {:>6}\`.
- Chame o gauge de \`active\`: \`Gauge\` carrega \`value\` e \`peak\`, e o pico real é mantido com \`if active.value > active.peak { active.peak = active.value; }\` a cada tick — não só num scrape.
`,
  },

  "backend-production-2": {
    instructions: `## Percentis a partir de buckets

A média é exata: \`_sum / _count\`. Um quantil não é — você calcula um rank, caminha pelas contagens cumulativas dos buckets até cruzá-lo, e reporta o **limite superior** daquele bucket. Seus limites são a resolução da sua resposta.

Percentis não são lineares, então p99s por instância não podem ser tirados na média nem no máximo. **Contagens de bucket podem ser somadas**, e é por isso que a consulta da frota soma os buckets antes de calcular o quantil.

### Sua tarefa

1. Implemente \`count()\`, \`mean()\` e \`quantile(q)\` — rank \`ceil(q · n)\`, caminhe pelas contagens cumulativas, devolva o limite superior do bucket que cruza (\`f64::INFINITY\` para \`+Inf\`).
2. Construa \`api-1\` e \`api-2\` a partir das contagens nos comentários do starter, depois \`merged\` somando os buckets e somando as somas.
3. Imprima a tabela de buckets, depois uma linha de count/sum/mean/p50/p95/p99 por histogram.
4. Imprima a média dos dois p95 contra o p95 mesclado real, e o mesmo para o p99.

Saída esperada:

\`\`\`text
le       api-1  api-2  merged
1         120      0     120
2         300      0     300
5         380      2     382
10        150      3     153
25         40     10      50
100         5     20      25
500         4     40      44
2000        1     25      26
+Inf        0      0       0

          count       sum    mean     p50     p95     p99
api-1      1000      4200     4.2       5      10      25
api-2       100     42000   420.0     500    2000    2000
merged     1100     46200    42.0       5     500    2000

mean of the p95s: 1005.0   true merged p95: 500
mean of the p99s: 1012.5   true merged p99: 2000
\`\`\`

### Dicas

- Um helper \`row(h: &Hist)\` mantém as três linhas idênticas: \`"{:<8} {:>6} {:>9.0} {:>7.1} {:>7.0} {:>7.0} {:>7.0}"\`.
- O rótulo da tabela de buckets é \`"+Inf"\` quando \`i == BOUNDS.len()\`, senão \`BOUNDS[i].to_string()\`.
- A linha de cabeçalho é impressa com a mesma format string das linhas de dados, com \`""\` na coluna do nome.
- Dentro de \`quantile\`, caminhe com um \`cum\` local: \`cum += self.counts[i]\`, e retorne assim que \`cum >= rank\`.
`,
  },

  "backend-production-3": {
    instructions: `## Logs estruturados e um ID de correlação

\`level=error event=user_load_failed user_id=91 org_id=4 err=timeout\` é um registro com dimensões consultáveis. Uma frase formatada é uma string opaca em que você só consegue passar regex.

Um log de produção são muitas requisições intercaladas, então um ID de requisição carregado por toda camada é o que transforma o stream de volta numa história só. Adicione \`depth\` e você ganha a árvore de spans — e raiz menos filhos é o tempo próprio do handler.

### Sua tarefa

1. \`fn emit(...) -> String\` monta uma linha: \`seq\` com zero à esquerda em dois dígitos, depois \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — mais \`dur_ms\` **só num end**, e \`level=warn\` quando um end passa de 40 ms.
2. Emita os 12 eventos em ordem, com seq começando em 1.
3. Filtre por \`req=7f3a\`. Para cada start, ache o end correspondente, e imprima o span indentado por \`depth * 2\` com a duração dele.
4. Imprima raiz, filhos e não contabilizado, depois quantas das 12 linhas casaram.

Saída esperada:

\`\`\`text
--- log stream (two requests interleaved) ---
seq=01 level=info req=7f3a span=http.request depth=0 event=start
seq=02 level=info req=7f3a span=auth.verify depth=1 event=start
seq=03 level=info req=b91c span=http.request depth=0 event=start
seq=04 level=info req=7f3a span=auth.verify depth=1 event=end dur_ms=3
seq=05 level=info req=b91c span=auth.verify depth=1 event=start
seq=06 level=info req=7f3a span=db.query depth=1 event=start
seq=07 level=info req=b91c span=auth.verify depth=1 event=end dur_ms=2
seq=08 level=info req=b91c span=db.query depth=1 event=start
seq=09 level=warn req=7f3a span=db.query depth=1 event=end dur_ms=41
seq=10 level=warn req=7f3a span=http.request depth=0 event=end dur_ms=46
seq=11 level=info req=b91c span=db.query depth=1 event=end dur_ms=7
seq=12 level=info req=b91c span=http.request depth=0 event=end dur_ms=11

--- filtered req=7f3a ---
http.request      46ms
  auth.verify      3ms
  db.query        41ms
root 46ms, children 44ms, unaccounted 2ms
lines matching req=7f3a: 6 of 12
\`\`\`

### Dicas

- \`"seq={:02} level={} req={} span={} depth={} event={}"\`, depois \`push_str\` do sufixo \`" dur_ms={}"\` num end.
- A linha da árvore usa larguras de runtime: \`"{:indent$}{:<w$}{:>4}ms"\` com \`indent = depth * 2\` e \`w = 16 - depth * 2\`.
- Os filhos são os eventos \`end\` em \`depth == 1\`; a raiz é \`depth == 0\`. Não some os dois.
- Ligue a duração da raiz a \`total\` e a soma dos filhos a \`child\`; o trabalho próprio do handler é \`total - child\`.
`,
  },

  "backend-production-4": {
    instructions: `## Backoff, jitter e um budget de retry

Backoff exponencial espalha os retries mas os **sincroniza**: clientes que falharam juntos tentam de novo juntos. Full jitter — um atraso sorteado uniformemente em \`[0, backoff]\` — é o que os descorrelaciona, e um teto impede um cliente de segurar um slot de conexão por 17 minutos.

Retries multiplicam a carga exatamente quando a capacidade está mais baixa. Um budget de retry limita a amplificação como fração do volume de requisições, no cliente, seja qual for a taxa de falha.

### Sua tarefa

1. Implemente o LCG: \`next()\` multiplica por \`6364136223846793005\` e soma \`1442695040888963407\` (com wrapping), devolvendo \`state >> 33\`; \`below(n)\` é \`next() % n\`, e \`0\` quando \`n\` é \`0\`.
2. Semeie com \`0x2545F491\` e imprima, para as tentativas \`0..5\`, o backoff com teto (\`BASE_MS << attempt\`, limitado a \`CAP_MS\`) ao lado de um sorteio de full jitter.
3. Conte o total de tentativas sem budget: toda chamada que falha consome \`MAX_RETRIES\`.
4. Conte de novo com budget: ganhe \`BUDGET_PER_CALL\` por chamada, pague \`RETRY_COST\` por retry, negue o retry quando não puder pagar. Imprima tentativas, amplificação e a divisão granted/denied nos dois casos.

Saída esperada:

\`\`\`text
attempt  backoff_ms  full_jitter_ms
      0         100              45
      1         200               1
      2         400             169
      3         800             501
      4        1000             517

40 calls, 25 of them failing, max 3 retries each
policy       attempts  amplification  granted  denied
no budget         115           2.88x       75       0
10% budget         43           1.07x        3      72
\`\`\`

### Dicas

- Sorteie o jitter com \`rng.below(b + 1)\` para o intervalo fechado inteiro ser alcançável — é por isso que a tentativa 1 mostra 1 ms.
- \`BASE_MS.saturating_mul(1u64 << attempt)\`, depois limite a \`CAP_MS\`.
- Calcule o atraso; nunca durma por ele. A lição é determinística de propósito.
- As duas linhas de política compartilham \`"{:<12} {:>8}  {:>13.2}x {:>8}  {:>6}"\`; o granted da linha sem budget é \`naive - CALLS\`.
- Guarde o saldo do budget num \`tokens\` local: \`tokens += BUDGET_PER_CALL\` por chamada, e \`tokens -= RETRY_COST\` para cada retry que você conceder.
`,
  },

  "backend-production-5": {
    instructions: `## Um circuit breaker como máquina de estados

**Closed** deixa as chamadas passarem; uma sequência de falhas o dispara. **Open** não faz chamada nenhuma — quem chamou falha em microssegundos em vez de num timeout de 30 segundos. Depois de um cooldown, **half-open** admite exatamente uma sonda: sucesso fecha e zera a sequência, falha reabre e reinicia o cooldown.

O breaker protege as threads e os slots de conexão de quem chamou pelo menos tanto quanto protege a dependência.

### Sua tarefa

Imprima \`t\`, o estado na entrada, a ação, o resultado e o próximo estado, para todos os 22 ticks.

- **closed** — chama. \`THRESHOLD\` falhas consecutivas levam a open, registrando \`opened_at\`.
- **open** — curto-circuito. \`COOLDOWN\` ticks depois de \`opened_at\`, vai para half-open.
- **half-open** — uma sonda. Sucesso fecha e zera a sequência; falha reabre e reinicia o cooldown.

Termine com o número de chamadas downstream feitas e o número de ticks em curto-circuito.

Saída esperada:

\`\`\`text
t   state      action         result    next
0   closed     call           ok        closed
1   closed     call           ok        closed
2   closed     call           ok        closed
3   closed     call           fail 1/3  closed
4   closed     call           fail 2/3  closed
5   closed     call           fail 3/3  open
6   open       short-circuit  -         open
7   open       short-circuit  -         open
8   open       short-circuit  -         open
9   half-open  probe          fail      open
10  open       short-circuit  -         open
11  open       short-circuit  -         open
12  open       short-circuit  -         open
13  half-open  probe          fail      open
14  open       short-circuit  -         open
15  open       short-circuit  -         open
16  open       short-circuit  -         open
17  half-open  probe          ok        closed
18  closed     call           ok        closed
19  closed     call           ok        closed
20  closed     call           ok        closed
21  closed     call           ok        closed

downstream calls: 13, short-circuited: 9 of 22 ticks
\`\`\`

### Dicas

- Aplique a transição de cooldown no *topo* do tick, depois tire o snapshot \`before = state\` — a linha imprime o estado na entrada e o estado na saída.
- A coluna de resultado é \`"fail {}/{}"\` para uma falha em closed, mas um \`"fail"\` seco para uma sonda que falhou, então ramifique em \`before == State::HalfOpen\`.
- \`t.saturating_sub(opened_at) >= COOLDOWN\` mantém t=0 seguro.
- Formato da linha: \`"{:<3} {:<10} {:<14} {:<9} {}"\`.
- A sequência de falhas é um \`consecutive\` local: uma falha o incrementa e dispara em \`consecutive >= THRESHOLD\`; qualquer sucesso faz \`consecutive = 0\`.
`,
  },

  "backend-production-6": {
    instructions: `## Graceful shutdown

Quatro fases, em ordem: parar de aceitar (a readiness falha primeiro, depois o listener fecha), drenar o que está em voo, limitar a drenagem com um deadline, force-close do resto.

Sair imediatamente no SIGTERM mata toda requisição em voo. Drenar mata só as que ainda estão rodando no deadline — e o deadline tem que ficar abaixo do grace period do orquestrador, senão o SIGKILL chega primeiro e não houve drenagem nenhuma.

### Sua tarefa

A cada tick: admita as chegadas do tick só enquanto estiver aceitando (senão conte um 503), decremente cada requisição em voo, retire as que chegam a 0, e imprima a linha.

- Em \`SIGTERM_AT\`: pare de aceitar, vire a readiness para \`503\`, e registre quantas estavam em voo.
- Pare quando \`in_flight\` estiver vazio (drenagem limpa), ou quando \`DEADLINE\` ticks tiverem passado desde o SIGTERM — aí force-close o que sobrou, imprimindo os ids com \`{:?}\`.
- Termine com completed, rejected e force-closed, depois o que uma saída imediata teria matado no lugar.

Saída esperada:

\`\`\`text
t   accepting  ready  arrived  admitted  in_flight  done
0   yes        200    2        2         2          0
1   yes        200    1        1         1          2
2   yes        200    3        3         3          3
3   yes        200    1        1         3          4
4   yes        200    2        2         5          4
5   no         503    2        0         4          5
6   no         503    0        0         2          7
7   no         503    0        0         2          7
8   no         503    0        0         1          8
9   no         503    0        0         1          8
10  no         503    0        0         1          8
11  no         503    0        0         1          8
12  no         503    0        0         1          8
13  no         503    0        0         1          8
deadline hit at t=13 -- force-closing [8]

completed 8, rejected 2 (503 after SIGTERM), force-closed 1
immediate exit at t=5 would have killed 5 in-flight instead
\`\`\`

### Dicas

- Faça \`for t in 0..20u32\` e saia com \`break\`; a execução termina em t=13.
- Decremente primeiro, depois \`in_flight.retain(|r| r.left > 0)\`; \`completed\` é a queda no tamanho.
- Chegadas além de \`ARRIVALS.len()\` são \`0\`, então as duas chegadas de t=5 são as únicas rejeições.
- Formato da linha: \`"{:<3} {:<10} {:<6} {:<8} {:<9} {:<10} {}"\`.
- Registre o tick do sinal como \`sigterm_tick\`; a drenagem termina quando \`t - sigterm_tick >= DEADLINE\`.
`,
  },

  "backend-production-7": {
    instructions: `## Lei de Little

\`L = λ · W\`. L são as requisições no sistema, λ a taxa de chegada, W o tempo no sistema. Vale para qualquer sistema estável, sem nenhuma suposição sobre a distribuição das chegadas.

Abaixo da capacidade, latência é tempo de serviço. Acima dela o backlog cresce linearmente e sem limite, então o alvo de latência é o que fixa o limite de concorrência: admita L, descarte a próxima imediatamente.

### Sua tarefa

1. \`capacity()\` é \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` é \`lambda * w_s\` — escreva a Lei de Little uma vez e reutilize.
2. Para cada taxa oferecida imprima L, utilização, o backlog depois de um segundo de sobrecarga, a latência resultante (\`SERVICE_S + backlog / capacity()\`) e um veredito de \`ok\`, \`at capacity\` ou \`saturated\`.
3. Imprima os workers necessários para servir o pico com o tempo de serviço atual.
4. Transforme \`TARGET_MS\` num limite de concorrência, divida entre em serviço e enfileiradas, e imprima quanto tempo a sobrecarga leva para encher a fila.

Saída esperada:

\`\`\`text
capacity = L / W = 32 / 0.020s = 1600 rps

offered      L  util%  backlog_1s  latency_ms  verdict
    400    8.0   25.0           0        20.0  ok
    800   16.0   50.0           0        20.0  ok
   1200   24.0   75.0           0        20.0  ok
   1600   32.0  100.0           0        20.0  at capacity
   1800   36.0  112.5         200       145.0  saturated
   2000   40.0  125.0         400       270.0  saturated

to serve 2000 rps at W = 20 ms you need L = 2000 * 0.020 = 40 workers
latency target 50 ms at 1600 rps: L = 1600 * 0.050 = 80 in system
  = 32 in service + 48 queued -> concurrency limit 80, shed beyond it
  at 1800 rps the queue passes 48 after 0.24s of overload
\`\`\`

### Dicas

- \`concurrency\` recebe **segundos**, então passe \`TARGET_MS / 1000.0\`.
- Abaixo da capacidade o backlog é \`0.0\` e a latência é \`SERVICE_S * 1000.0\`; o veredito é \`"at capacity"\` só quando a utilização chega a 100.
- A linha da tabela é \`"{:>7.0} {:>6.1} {:>6.1} {:>11.0} {:>11.1}  {}"\`.
- \`queue_max / overload\` a 1800 rps é \`48 / 200 = 0.24\` segundos.
`,
  },
};
