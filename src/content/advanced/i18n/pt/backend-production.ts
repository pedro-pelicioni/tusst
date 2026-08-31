import type { LessonStep } from "@/content/steps";

// PT · Rodando em produção.

export const backendProductionStepsPt: Record<string, LessonStep[]> = {
  "backend-production-1": [
    {
      kind: "theory",
      body: `Três tipos de instrumento, e cada um responde a uma pergunta diferente.

Um **counter** é monotônico — só sobe, e só é zerado por um restart do processo. O valor instantâneo dele não significa nada; você lê a *taxa*.

\`\`\`text
rate(http_requests_total[5m])
\`\`\`

Um **gauge** é um nível pontual que se move nos dois sentidos: conexões ativas, profundidade de fila, tamanho do pool, requisições em voo.

Um **histogram** é um conjunto de counters de bucket cumulativos mais \`_sum\` e \`_count\`. Você observa valores nele e consulta distribuições dele.

O Prometheus expõe exatamente esses três; as métricas numéricas do Sentry são os mesmos três. Errar o tipo não é um deslize de estilo — um counter não te diz concorrência, e um gauge não te diz taxa.`,
    },
    {
      kind: "theory",
      body: `Duas armadilhas, e as duas mordem em produção.

**Um gauge só é visto no instante do scrape**, tipicamente a cada 15–30 s. Tudo entre scrapes é invisível. No exercício o pico real de 14 requisições em voo nunca é observado, porque todo scrape cai num vale e reporta 5. Se o pico é o que importa — exaustão de pool, marca d'água de fila — exporte um gauge de máximo-desde-o-último-scrape ao lado do instantâneo, ou use um histogram.

**Cada valor distinto de label é uma série temporal separada.** Um label \`user_id\` num histogram de 9 buckets com 100 mil usuários são 900.000 séries, e é assim que você derruba o seu próprio backend de métricas. Labels são para conjuntos limitados: rota, método, classe de status.`,
    },
    {
      kind: "quiz",
      question: "Um gauge de requisições em voo é coletado a cada 15 s. A maior amostra registrada no dia inteiro é 5. O que isso estabelece sobre o pico real?",
      options: [
        "Apenas que algum scrape viu 5 — qualquer coisa que subiu e desceu entre dois scrapes nunca foi amostrada, então o pico real pode ser muito maior",
        "O pico real foi 5: um gauge exporta o máximo alcançado desde o scrape anterior",
        "O pico real foi 5, porque uma requisição vive mais que o intervalo de scrape, então nada consegue se esconder entre amostras",
      ],
      answer: 0,
      explain: "Um gauge comum reporta o valor no instante em que é lido, não um máximo sobre o intervalo — isso é um instrumento separado que você tem que exportar de propósito. A terceira opção é o argumento que as pessoas realmente fazem, e ele falha exatamente quando importa: rajadas de requisições curtas são justamente os picos que esgotam um pool.",
    },
    {
      kind: "fill",
      prompt: "Atribua uma observação a um bucket. Buckets do Prometheus são `le` — menor **ou igual** ao limite.",
      file: "main.rs",
      before: "while i < BOUNDS.len() && v ",
      after: " BOUNDS[i] {\n    i += 1;\n}",
      choices: ["> ", ">= ", "< "],
      answer: 0,
      explain: "Com `>=`, um valor igual ao limite pula o próprio bucket: uma requisição de 10 ms cai em `le<=50` e a contagem de `le<=10` sub-reporta em silêncio. `<` caminha para o lado errado e joga tudo no primeiro bucket.",
    },
    {
      kind: "quiz",
      question: "Um serviço exporta `http_request_duration_sum` e `http_request_duration_count` e nada mais. Que pergunta ele não consegue responder?",
      options: [
        "Quantas requisições passaram de 100 ms — isso é uma contagem de bucket, e uma soma com uma contagem não reconstroem uma",
        "A latência média nos últimos cinco minutos — uma soma e uma contagem não podem ser convertidas em taxa sobre uma janela",
        "O tempo total que o serviço passou servindo requisições — `_sum` é uma contagem de requisições, não um total de durações",
      ],
      answer: 0,
      explain: "A média é exatamente o que esses dois te dão: `rate(_sum[5m]) / rate(_count[5m])`. No exercício a média é 42,2 ms enquanto 15 das 20 requisições terminaram abaixo de 10 ms — a média é real e é igualmente inútil para a cauda.",
    },
    {
      kind: "editor",
      intro: `### Três instrumentos sobre uma carga

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

O pico real do gauge é 14 e todo scrape o perde. A média é 42,2 ms e 15 das 20 requisições terminaram abaixo de 10 ms.`,
    },
  ],

  "backend-production-2": [
    {
      kind: "theory",
      body: `O Prometheus expõe \`_bucket{le="..."}\` como contagens **cumulativas**, mais \`_sum\` e \`_count\`.

A média é exata: \`_sum / _count\`. Um quantil não é. Você calcula um rank, caminha pelas contagens cumulativas até cruzá-lo, e reporta o limite superior daquele bucket:

\`\`\`text
rank = ceil(q · n)
walk cumulative counts until cum >= rank
answer = that bucket's upper bound
\`\`\`

Então um p99 reportado de 2000 ms significa apenas "algo entre 500 e 2000 ms". **Os seus limites de bucket são a resolução da sua resposta**, e é por isso que eles precisam cercar o seu SLO. Apertar um SLO significa adicionar limites, não adicionar amostras.`,
    },
    {
      kind: "theory",
      body: `Percentis não são lineares. Você não pode tirar média deles entre instâncias, e também não pode pegar o máximo. **Somar contagens de bucket é válido**, porque todo bucket é um counter — essa é a razão inteira de os histograms do Prometheus terem esse formato, e por que a query de frota soma buckets *antes* de calcular o quantil:

\`\`\`text
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_bucket[5m])))
\`\`\`

O exercício torna o erro visível nas duas direções. Uma instância movimentada e saudável (1000 req) e uma parada e doente (100 req) dão média-dos-p99 = 1012,5 contra um valor real de 2000, e média-dos-p95 = 1005 contra um valor real de 500. A média subestimou um e dobrou o outro, porque a média não ponderada ignora que a api-1 carrega 91% do tráfego.

A média mesclada é 42 ms e o p99 mesclado é 2000 ms — uma diferença de 48x. Uma média de 42 ms nunca acorda ninguém; um usuário em cada cem está esperando dois segundos. O Criterion te dá a mesma distribuição para um benchmark, e um flamegraph te diz *onde* o tempo da cauda foi parar depois que o histogram já te disse que ela existe.`,
    },
    {
      kind: "quiz",
      question: "Doze instâncias exportam cada uma o seu p99. Qual é o p99 da frota?",
      options: [
        "Nenhum dos p99 por instância pode ser combinado — some os buckets entre as instâncias primeiro, depois calcule o quantil a partir das contagens mescladas",
        "O máximo entre eles: p99 é uma medida de pior caso, então a pior instância define o da frota",
        "A média deles, ponderada pela contagem de requisições de cada instância — uma média de quantis ponderada por requisições é exata",
      ],
      answer: 0,
      explain: "A média ponderada é a resposta errada sofisticada, e continua errada: a ponderação corrige o desvio de tráfego, mas o quantil de uma mistura não é média nenhuma dos quantis das partes. Só os buckets são aditivos.",
    },
    {
      kind: "fill",
      prompt: "Mescle os histograms de duas instâncias em um só.",
      file: "main.rs",
      before: "for i in 0..9 {\n    merged.counts[i] = ",
      after: ";\n}",
      choices: ["a.counts[i] + b.counts[i]", "(a.counts[i] + b.counts[i]) / 2", "a.counts[i].max(b.counts[i])"],
      answer: 0,
      explain: "Cada bucket é um counter, então a mesclagem é soma. Tirar a média corta pela metade a contagem de observações da frota e reporta uma distribuição que ninguém viveu; pegar o máximo não conta nada em dobro e joga fora inteira a cauda da instância parada.",
    },
    {
      kind: "quiz",
      question: "Seus buckets são `..., 500, 2000, +Inf` e o dashboard reporta p99 = 2000 ms. O que ele te disse?",
      options: [
        "Que 99% das requisições terminaram dentro de 2000 ms — o p99 real está em algum ponto acima de 500 ms, e 2000 é um limite que você escolheu, não uma medição",
        "Que o 1% mais lento das requisições levou aproximadamente 2000 ms cada",
        "Que uma requisição em cada cem levou exatamente 2000 ms — o histogram guarda o valor observado naquele rank",
      ],
      answer: 0,
      explain: "Um histogram por buckets não guarda amostra nenhuma, só contagens. Todo p99 entre 500 e 2000 reporta 2000; para resolver um SLO de 900 ms você adiciona um limite de 1000 ms.",
    },
    {
      kind: "editor",
      intro: `### Mescle duas instâncias sem mentir

1. Implemente \`count()\`, \`mean()\` (\`_sum / _count\`) e \`quantile(q)\` — rank \`ceil(q · n)\`, caminhe pelas contagens cumulativas, devolva o limite superior do bucket que cruza.
2. Construa \`api-1\` e \`api-2\` a partir das contagens nos comentários do starter, depois \`merged\` **somando os buckets** e somando as somas.
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

Tirar a média dos p95 dobra a verdade; tirar a média dos p99 a reduz à metade.`,
    },
  ],

  "backend-production-3": [
    {
      kind: "theory",
      body: `Uma linha de log é key=value, não uma frase.

\`\`\`rust
error!("failed to load user {} for org {}", uid, org);
\`\`\`

Isso é uma string opaca. Você não consegue agregar, indexar nem alertar em cima dela sem uma regex que quebra na próxima vez que alguém editar o texto. Isto é um registro:

\`\`\`text
level=error event=user_load_failed user_id=91 org_id=4 err=timeout
\`\`\`

Cada campo é uma dimensão consultável, o texto da mensagem é estável, e a mesma linha serializa para JSON num pipeline de ingestão sem mudar nada. É isso que o \`tracing\` te dá em cima do \`log\`: um \`Subscriber\` formata campos estruturados em vez de uma string já renderizada, e \`#[instrument]\` anexa os campos de um span a todo evento dentro dele automaticamente.`,
    },
    {
      kind: "theory",
      body: `Um log de produção é várias requisições intercaladas. No exercício, as seq 01–12 alternam entre dois request IDs e **nenhuma linha é vizinha da linha à qual pertence**. Um request ID gerado na borda e carregado por todas as camadas — e enviado pela rede como \`traceparent\` para serviços downstream — é o que transforma aquele fluxo de volta numa história.

Adicione \`depth\`, ou um span pai de verdade, e você reconstrói a árvore com durações. Repare no que cai fora:

\`\`\`text
root 46ms, children 44ms, unaccounted 2ms
\`\`\`

Esses 2 ms são o trabalho próprio do handler. É o número que te diz se você deve otimizar o seu código ou a sua dependência, e você não consegue obtê-lo de nenhuma das durações isoladamente.

Regra de cardinalidade: um request ID é ótimo como **campo** de log, e catastrófico como **label** de métrica.`,
    },
    {
      kind: "quiz",
      question: "O time não tem correlation ID mas loga `user_id` e `endpoint` em toda linha. Por que isso não é equivalente?",
      options: [
        "Duas requisições concorrentes do mesmo usuário para o mesmo endpoint produzem linhas intercaladas que filtro nenhum separa",
        "`user_id` e `endpoint` são campos de alta cardinalidade, então o backend de log se recusa a indexá-los",
        "As linhas de log de uma requisição são contíguas no fluxo, então um filtro é desnecessário desde o começo",
      ],
      answer: 0,
      explain: "Degrada exatamente quando você precisa: sob carga, com um cliente fazendo retry, durante o incidente. As outras duas opções são falsas sobre um backend de log (campos são baratos; são os *labels* de métrica que não são) e falsas sobre o fluxo (intercalar é o padrão).",
    },
    {
      kind: "fill",
      prompt: "Some os spans filhos, para separar o tempo próprio do handler do tempo dos callees.",
      file: "main.rs",
      before: "EVENTS.iter()\n    .filter(|e| e.0 == \"7f3a\" && e.3 == \"end\" && ",
      after: ")\n    .map(|e| e.4)\n    .sum()",
      choices: ["e.2 == 1", "e.2 == 0", "e.2 >= 0"],
      answer: 0,
      explain: "Depth 0 é a raiz — justamente o span do qual você está subtraindo. Incluí-lo reporta 0 ms não contabilizados e esconde o custo próprio do handler; incluir tudo dá 90 ms de filhos dentro de uma raiz de 46 ms.",
    },
    {
      kind: "quiz",
      question: "Um span raiz tem 46 ms e os seus dois spans filhos somam 44 ms. O que o handler em si está fazendo?",
      options: [
        "2 ms de trabalho — spans filhos são o tempo dos callees, e a diferença é o do próprio chamador",
        "44 ms de trabalho — os filhos são as operações do próprio handler, instrumentadas",
        "46 ms de trabalho — o span raiz mede tudo que o handler faz, filhos incluídos",
      ],
      answer: 0,
      explain: "Confundir os dois te manda otimizar o processo errado. 2 ms de tempo próprio contra 41 ms em `db.query` significa que a resposta é um índice ou uma reescrita de query, não um handler mais rápido.",
    },
    {
      kind: "editor",
      intro: `### Reconstrua uma requisição a partir de um fluxo intercalado

1. \`fn emit(...) -> String\` monta uma linha estruturada: \`seq\` com zero à esquerda em dois dígitos, \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — mais \`dur_ms\` **só num end**, e \`level=warn\` quando um end passa de 40 ms.
2. Emita os 12 eventos em ordem, com \`seq\` começando em 1.
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

2 ms não contabilizados são o trabalho próprio do handler. 41 dos 46 ms estão em \`db.query\`.`,
    },
  ],

  "backend-production-4": [
    {
      kind: "theory",
      body: `Um intervalo fixo de retry é pior que retry nenhum: ele bate numa dependência já sofrendo exatamente no pior momento, repetidamente. Backoff exponencial — \`base · 2^attempt\`, com teto — espalha as tentativas.

Mas **backoff sozinho sincroniza**. Se 500 clientes falham no mesmo instante, todos fazem retry em t+100 ms, depois todos em t+300 ms: uma thundering herd num cronograma organizado. Full jitter descorrelaciona:

\`\`\`text
delay = uniform(0, min(cap, base · 2^attempt))
\`\`\`

O teto também importa. Dobrar sem teto chega a 17 minutos na tentativa 13, e um cliente que já desistiu do usuário há muito tempo continua segurando um slot de conexão.

O LCG do exercício é semeado deterministicamente de propósito — uma política de retry que você não consegue reproduzir é uma política de retry que você não consegue testar. Repare na tentativa 1 sorteando 1 ms de jitter: full jitter genuinamente pode devolver quase zero, e é por isso que alguns sistemas preferem decorrelated jitter com um piso.`,
    },
    {
      kind: "theory",
      body: `Retries multiplicam a carga exatamente quando o sistema tem menos capacidade de absorvê-la. Com 3 retries numa chamada com 62% de chance de falhar, o exercício leva a carga oferecida de 40 tentativas para 115 — **2,88x de amplificação apontada para uma dependência que já está fora**. Essa é a forma da maioria das falhas em cascata: a lógica de retry converte uma dependência degradada numa dependência morta.

Um **retry budget** resolve isso no cliente. Retries podem consumir no máximo uma fração fixa do volume de requisições — 10% aqui, implementado como um token bucket que ganha 10 centi-tokens por chamada e paga 100 por retry. A amplificação cai para 1,07x, 72 dos 75 retries são negados, e a dependência ganha espaço para se recuperar.

Duas regras que não são negociáveis: só faça retry de operações idempotentes, e nunca faça retry de um 4xx. A dependência respondeu corretamente; a requisição é que está errada, e vai estar igualmente errada na segunda vez.`,
    },
    {
      kind: "quiz",
      question: "Todo cliente usa backoff exponencial. Por que uma thundering herd ainda pode se formar?",
      options: [
        "Clientes que falharam juntos recuam pelos mesmos valores, então chegam juntos a cada retry — backoff muda quando a manada chega, não se ela chega",
        "Backoff limita o atraso com um teto, e assim que todo cliente está no teto eles fazem retry na frequência do teto para sempre",
        "O crescimento exponencial supera a recuperação da dependência, então a manada se forma depois que a dependência já está saudável",
      ],
      answer: 0,
      explain: "Jitter é o que quebra a correlação. A opção dos clientes no teto descreve um regime estacionário real, mas a manada já está sincronizada muito antes do teto — ela está sincronizada desde o primeiro retry.",
    },
    {
      kind: "fill",
      prompt: "Transforme um backoff num atraso com full jitter.",
      file: "main.rs",
      before: "let b = backoff(attempt);\nlet delay = ",
      after: ";",
      choices: ["rng.below(b + 1)", "b / 2 + rng.below(b / 2 + 1)", "b + rng.below(b + 1)"],
      answer: 0,
      explain: "Full jitter é uniforme sobre o intervalo inteiro `[0, b]`. A segunda escolha é *equal* jitter — uma variante real da AWS com piso em `b/2`, que corta a dispersão pela metade e portanto descorrelaciona menos. A terceira soma jitter em cima do backoff, o que atrasa todo cliente sem descorrelacionar nada.",
    },
    {
      kind: "quiz",
      question: "Todo cliente está limitado a 3 retries por chamada. Por que isso não é um limite sobre a carga que a dependência enxerga?",
      options: [
        "Um teto por chamada limita uma chamada e não diz nada sobre volume: com 100% de taxa de falha a frota ainda entrega 4x o tráfego normal",
        "O teto é por cliente, e clientes não se enxergam, então o total é ilimitado mesmo com uma taxa de falha baixa",
        "Retries burlam o teto quando a primeira tentativa dá timeout em vez de devolver erro",
      ],
      answer: 0,
      explain: "Amplificação é uma propriedade da frota, então o limite tem que ser expresso contra o volume da frota. Um budget de 10% das requisições vale a qualquer taxa de falha; um teto de 3 só vale a uma taxa de falha que você não controla.",
    },
    {
      kind: "editor",
      intro: `### Limite a amplificação

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

2,88x vira 1,07x, e 72 dos 75 retries nunca saem do cliente.`,
    },
  ],

  "backend-production-5": [
    {
      kind: "theory",
      body: `Três estados, e as transições entre eles são o mecanismo inteiro.

**Closed** — as chamadas passam. Uma sequência de falhas que atinge o threshold abre o breaker.
**Open** — nenhuma chamada é feita. O chamador falha na hora com o erro do próprio breaker, em microssegundos em vez de um timeout de conexão de 30 segundos.
**Half-open** — alcançado depois de um cooldown. Exatamente uma sonda é liberada. Sucesso fecha o breaker e zera a sequência de falhas; falha reabre e reinicia o cooldown.

O exercício imprime a caminhada inteira: abre em t=5, sondas em t=9, 13 e 17, fecha em 17. Repare no que o breaker compra enquanto a dependência ainda está fora — 9 dos 22 ticks em curto-circuito, o que são 9 threads ou slots de conexão que nunca ficaram travados numa chamada condenada.

Esse é o ponto de verdade. **Um breaker protege o chamador da exaustão de recursos pelo menos tanto quanto protege o chamado.**`,
    },
    {
      kind: "theory",
      body: `Os parâmetros, e onde eles dão errado.

**Um threshold sobre falhas consecutivas é simples mas nervoso.** Bibliotecas de produção usam uma taxa de falha em janela deslizante — "mais de 50% das últimas 100 chamadas, mínimo de 20 chamadas" — porque isso não abre por um par azarado e não fica fechado sob uma taxa de falha estável de 40%.

**Half-open precisa admitir uma sonda, não retomar o tráfego normal.** Fechar direto para carga cheia inunda de novo uma dependência que acabou de voltar com o cache frio, e abre o breaker outra vez na hora.

**Nem toda falha conta.** Um timeout de conexão ou um 503 devem contar; um 400 não — a dependência respondeu corretamente e vai responder do mesmo jeito na próxima.

Relacionado, e vale manter separado: uma probe de **liveness** responde "o orquestrador deve me reiniciar" e não pode depender de nada downstream, ou uma dependência doente reinicia a sua frota inteira. Uma probe de **readiness** responde "o load balancer deve me rotear tráfego" e pode legitimamente depender.`,
    },
    {
      kind: "quiz",
      question: "O cooldown expira. Por que o breaker vai para half-open em vez de voltar direto para closed?",
      options: [
        "Fechar manda a carga cheia numa dependência que ninguém testou; half-open gasta exatamente uma requisição para descobrir antes",
        "Half-open existe para zerar o contador de falhas, o que closed não consegue fazer enquanto uma sequência está em andamento",
        "O cooldown é um mínimo, e half-open segura o breaker aberto até a dependência se declarar saudável",
      ],
      answer: 0,
      explain: "A dependência em recuperação é o caso frágil: caches frios, pools de conexão frios, um backlog para vencer. Uma sonda é uma pergunta barata; uma avalanche de reconexões é o que a derruba de novo.",
    },
    {
      kind: "fill",
      prompt: "A sonda de half-open falhou. Reabra o breaker.",
      file: "main.rs",
      before: "} else if state == State::HalfOpen {\n    state = State::Open;\n    opened_at = ",
      after: ";\n}",
      choices: ["t", "opened_at", "0"],
      answer: 0,
      explain: "O cooldown tem que recomeçar a partir *desta* falha. Manter o `opened_at` original deixa o cooldown já expirado, então o breaker vai para half-open de novo no tick seguinte e sonda uma dependência morta a cada tick — exatamente o martelar que o breaker existe para impedir. `0` é o mesmo bug, permanentemente.",
    },
    {
      kind: "quiz",
      question: "O que um circuit breaker protege primeiro?",
      options: [
        "O chamador — as threads e os slots de conexão dele deixam de ser consumidos por chamadas que vão dar timeout de qualquer jeito",
        "O chamado — descartar carga é o que permite a uma dependência sofrendo se recuperar",
        "O usuário — um erro rápido é uma experiência melhor que um erro lento",
      ],
      answer: 0,
      explain: "Poupar a dependência e falhar rápido são benefícios reais, mas são consequências. Um chamador sem breaker morre da doença do chamado: todo worker parado num timeout de 30 segundos, e uma indisponibilidade numa dependência vira uma indisponibilidade no seu serviço.",
    },
    {
      kind: "editor",
      intro: `### Percorra a máquina de estados

Imprima \`t\`, o estado na entrada, a ação, o resultado e o próximo estado, para todos os 22 ticks.

- **closed** — chama. \`THRESHOLD\` falhas consecutivas levam a open, registrando \`opened_at\`.
- **open** — curto-circuito; nenhuma chamada é feita. \`COOLDOWN\` ticks depois de \`opened_at\`, vai para half-open.
- **half-open** — uma sonda. Sucesso fecha o breaker e zera a sequência; falha reabre e reinicia o cooldown.

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

13 chamadas em vez de 22, e as duas sondas que falharam custaram uma requisição cada em vez de um estouro de boiada.`,
    },
  ],

  "backend-production-6": [
    {
      kind: "theory",
      body: `Quatro fases, nesta ordem.

**1. Pare de aceitar.** No SIGTERM, vire a probe de readiness para falha e feche o listener, para o load balancer parar de rotear requisições novas para cá enquanto o processo ainda está vivo. A readiness precisa virar *antes* de o listener fechar num cluster real — o LB leva alguns segundos para perceber, e é por isso que handlers de shutdown de produção dormem antes de fechar qualquer coisa.

**2. Drene.** Continue servindo o que já está em voo. A curva de drenagem do exercício é 5 → 4 → 2 → 1 conforme as requisições terminam.

**3. Deadline.** Drenar não pode ser ilimitado: uma requisição travada seguraria o pod para sempre, e o grace period do próprio orquestrador não vai esperar. O Kubernetes te dá 30 s e depois manda SIGKILL.

**4. Force-close** o que sobrou, e logue quais requisições você matou — a requisição 8 aqui, a outlier de 20 ticks.`,
    },
    {
      kind: "theory",
      body: `O que isso compra, e o que não compra.

Sair imediatamente no SIGTERM mata 5 requisições em voo. Drenar mata 1. Essa diferença é o deploy que aparece como um pico de p99 e uma rajada de 502s contra o deploy que ninguém percebe — multiplicado por cada pod de um rolling update.

As requisições rejeitadas são comportamento correto, não erros: um 503 com a conexão fechando é um sinal para o balancer rotear para outro lugar.

Duas coisas que o graceful shutdown **não** te dá. Ele não te dá **idempotência** — uma requisição morta no deadline pode ter feito meio commit, então o trabalho em si precisa ser seguro para retry. E ele não salva **trabalho de longa duração**: um job de 10 minutos não pertence a uma requisição, pertence a uma fila cujo consumidor pode ser interrompido e retomado.

Rollbacks são a mesma família de raciocínio. Um rollback precisa ser tão automático quanto um deploy porque é a única remediação cujo raio de dano você já entende.`,
    },
    {
      kind: "quiz",
      question: "É equivalente fechar o listener e virar a readiness para falha, ou a ordem importa?",
      options: [
        "Readiness primeiro: fechar o socket enquanto o balancer ainda acredita neste pod recusa conexões que ele está ativamente roteando para cá",
        "Listener primeiro: um socket aberto é o que mantém o balancer roteando, então fechá-lo é o que de fato drena o tráfego",
        "Equivalente — os dois deixam o pod inalcançável, e o balancer descobre qualquer um dos dois no próximo health check",
      ],
      answer: 0,
      explain: "Eles drenam duas coisas diferentes. A virada de readiness drena o *roteamento*; o fechamento do listener drena o *socket*. Faça o socket primeiro e toda requisição que o balancer mandar nos segundos antes de ele perceber leva connection refused, que é exatamente a rajada de 502 que você estava evitando.",
    },
    {
      kind: "fill",
      prompt: "Admita uma chegada só enquanto o servidor ainda está aceitando.",
      file: "main.rs",
      before: "for _ in 0..arrived {\n    if ",
      after: " && next_id < SERVICE.len() { /* admit */ } else { rejected += 1; }\n}",
      choices: ["accepting", "t < SIGTERM_AT + DEADLINE", "in_flight.len() < 5"],
      answer: 0,
      explain: "A segunda escolha continua admitindo durante toda a janela de drenagem — aceitando trabalho que você já prometeu force-close no deadline. A terceira é um limite de concorrência: uma coisa boa de se ter, e nenhum substituto, já que ela admite alegremente requisições novas depois do SIGTERM sempre que houver espaço.",
    },
    {
      kind: "quiz",
      question: "O deadline de drenagem é descrito como uma rede de segurança que nunca deveria disparar, então é ajustado para 60 s. O que há de errado nisso?",
      options: [
        "Ele dispara justamente nas requisições que já são patológicas, e 60 s excedem o grace period de 30 s do Kubernetes — o SIGKILL chega antes e a drenagem nunca termina",
        "Um deadline longo mantém as conexões do pod abertas, então o balancer continua roteando para ele pelos 60 s inteiros",
        "O deadline é por requisição, então um deadline de 60 s deixa acumular 60 s de trabalho novo antes de valer",
      ],
      answer: 0,
      explain: "Um deadline maior que o grace period do orquestrador é um deadline que não existe, e você ganha justamente o shutdown não-gracioso que estava tentando evitar. Escolha abaixo do grace period, e conte que ele vai disparar — as requisições que ele mata são as que nunca iam terminar.",
    },
    {
      kind: "editor",
      intro: `### Drenar, deadline, force-close

A cada tick: admita as chegadas do tick só enquanto estiver aceitando (senão conte um 503), decremente cada requisição em voo, retire as que chegam a 0, e imprima a linha.

- Em \`SIGTERM_AT\`: pare de aceitar, vire a readiness para \`503\`, e lembre quantas estavam em voo.
- Pare quando \`in_flight\` estiver vazio (drenagem limpa), ou quando \`DEADLINE\` ticks tiverem passado desde o SIGTERM — aí force-close o que sobrou, imprimindo os ids.
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

Uma requisição morta em vez de cinco, e a morta é a outlier de 20 ticks que nunca ia terminar.`,
    },
  ],

  "backend-production-7": [
    {
      kind: "theory",
      body: `\`\`\`text
L = λ · W
\`\`\`

**L** é o número de requisições *no sistema* — sendo servidas mais enfileiradas. **λ** é a taxa de chegada. **W** é o tempo que uma requisição passa no sistema.

Vale para qualquer sistema estável, sem nenhuma suposição sobre a distribuição das chegadas. É por isso que é o único resultado de teoria de filas que vale decorar.

Leia de três jeitos.

**Para frente** — 1200 rps com alvo de 250 ms precisa de 300 slots concorrentes.
**Para trás** — 32 workers a 20 ms de serviço cada são 32/0,020 = 1600 rps de capacidade, ponto final; tuning nenhum tira mais sem mudar um desses dois números.
**De lado** — um dashboard mostrando 40 em voo, 1200 rps e 20 ms de latência está te mostrando um número errado, porque 1200 · 0,020 é 24.`,
    },
    {
      kind: "theory",
      body: `Abaixo da capacidade, latência é só tempo de serviço e a fila fica vazia. Passando dela, as chegadas superam as saídas e **o backlog cresce linearmente e sem limite**. A 1800 rps contra 1600, um segundo de sobrecarga deixa 200 enfileiradas, cada uma esperando 200/1600 = 125 ms em cima dos seus 20 ms de trabalho. A latência não degrada com elegância; ela degrada na taxa do excesso.

Então defina o limite de propósito. Com alvo de 50 ms e 1600 rps de capacidade, L = 1600 · 0,050 = 80 no sistema: 32 em serviço, 48 podem enfileirar. **Admita 80. Descarte a 81ª com um 503 imediato**, porque uma requisição admitida além desse ponto não consegue cumprir 50 ms de qualquer jeito e vai ocupar um slot enquanto falha em cumprir.

É isso que um load test mede. Faça rampa para achar a capacidade (sustentada), ultrapasse para achar o modo de falha (saturação), aplique degrau para ver se a recuperação é graciosa (pico). Olhe a latência de cauda, não a média — a média de um sistema saturando fica respeitável por um tempo surpreendentemente longo.`,
    },
    {
      kind: "quiz",
      question: "Por que 100% de utilização não é o ponto de operação eficiente?",
      options: [
        "Em 100% não sobra folga para absorver variação nas chegadas, então qualquer rajada constrói uma fila que nunca drena por completo e a latência sobe enquanto o throughput ainda parece bom",
        "Em 100% o scheduler gasta a maior parte do tempo em context switches, então o throughput efetivo cai abaixo da capacidade",
        "100% de utilização é eficiente — a convenção de 60–70% é sobre deixar espaço para uma réplica que caiu, não sobre latência",
      ],
      answer: 0,
      explain: "Chegadas não são igualmente espaçadas. Com zero folga, toda rajada deixa um resíduo que o próximo período calmo não tem capacidade sobrando para consumir, e W sobe enquanto λ não muda — a fila é o único termo que pode se mexer.",
    },
    {
      kind: "fill",
      prompt: "Transforme um alvo de latência num limite de concorrência. `concurrency` recebe segundos.",
      file: "main.rs",
      before: "let l_max = concurrency(capacity(), ",
      after: ");",
      choices: ["TARGET_MS / 1000.0", "TARGET_MS", "SERVICE_S"],
      answer: 0,
      explain: "Passar milissegundos contra uma taxa por segundo dá L = 80.000 — o erro de unidade que faz a Lei de Little parecer errada. Passar `SERVICE_S` dá L = 32, que é a contagem de workers: a ideia equivocada de que o limite é o tamanho do pool e que enfileirar não é permitido de jeito nenhum.",
    },
    {
      kind: "quiz",
      question: "O serviço satura, então a fila de requisições é ampliada de 100 para 10.000. O que isso muda?",
      options: [
        "Nada em capacidade: converte um problema de disponibilidade num de latência, o que ganha tempo numa rajada e só faz a sobrecarga sustentada falhar devagar em vez de rápido",
        "Aumenta a capacidade efetiva, já que menos requisições são rejeitadas por segundo e os workers nunca ficam ociosos esperando uma chegar",
        "Reduz o p99, porque requisições que teriam sido descartadas agora terminam em vez de sofrerem retry do cliente",
      ],
      answer: 0,
      explain: "Uma fila é um buffer, não um servidor. Contra sobrecarga sustentada toda requisição agora espera e depois falha, o que é estritamente pior que falhar na hora. Um limite de concorrência é o que faz do descarte uma decisão em vez de um acidente.",
    },
    {
      kind: "editor",
      intro: `### De um alvo de latência a um limite de admissão

1. \`capacity()\` é \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` é \`lambda * w_s\` — a Lei de Little, escrita uma vez.
2. Para cada taxa oferecida imprima L, utilização, o backlog depois de um segundo de sobrecarga, a latência resultante (\`SERVICE_S + backlog / capacity()\`) e um veredito de \`ok\`, \`at capacity\` ou \`saturated\`.
3. Imprima os workers necessários para servir o pico com o tempo de serviço atual.
4. Transforme \`TARGET_MS\` num limite de concorrência — \`L = capacity · target\` — divida entre em serviço e enfileiradas, e imprima quanto tempo a sobrecarga leva para encher a fila.

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

Além de 1600 rps a fila é o único termo que pode absorver o excesso, e ela o faz linearmente.`,
    },
  ],
};
