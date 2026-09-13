// PT · editor instructions — RPC Services at Scale.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-rpc-services.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendRpcServicesInstructionsPt: Record<string, { instructions: string }> = {
  "backend-rpc-services-1": {
    instructions: `## Classifique uma requisição de entrada

Uma Request JSON-RPC 2.0 é \`{"jsonrpc": "2.0", "method": ..., "params": ..., "id": ...}\`. Uma Response carrega **ou** \`result\` **ou** \`error\`, nunca os dois. Cinco códigos são reservados:

| código | significado | quando |
| --- | --- | --- |
| -32700 | Parse error | os bytes não são JSON |
| -32600 | Invalid Request | fez parse, mas não é um objeto Request |
| -32601 | Method not found | o nome não está registrado |
| -32602 | Invalid params | o método existe, os argumentos não passam na checagem de tipos |
| -32603 | Internal error | o handler rodou e falhou |

\`-32000\` a \`-32099\` fica reservado para os erros do seu próprio servidor.

A regra do id pega gente desprevenida: ecoe o id **byte a byte** assim que tiver um objeto Request válido, e mande \`id: null\` quando não tiver — um parse error pode não ter produzido id nenhum, e uma requisição com formato errado pode ter um id do tipo errado.

### Sua tarefa

Preencha \`classify\`. Rode as cinco checagens em ordem — parse, formato da requisição, método, params, handler — e responda cada uma com o seu código.

1. \`well_formed == false\` é \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. Um \`version\` diferente de \`Some("2.0")\`, ou um \`method\` ausente, é \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. Um método que não está em \`methods\` é \`-32601\` \`"Method not found"\`, ecoando o id.
4. \`params_ok == false\` é \`-32602\` \`"Invalid params"\`, ecoando o id.
5. \`handler_ok == false\` é \`-32603\` \`"Internal error"\`, ecoando o id.
6. Caso contrário \`Reply { code: 0, message: "result", id }\` — \`main\` imprime o código \`0\` como \`-\`.

Saída esperada:

\`\`\`text
request                   code  message           id
truncated body          -32700  Parse error       null
jsonrpc 1.0             -32600  Invalid Request   null
no method member        -32600  Invalid Request   null
method sbutract         -32601  Method not found  3
sum of strings          -32602  Invalid params    "a3"
sum, handler panicked   -32603  Internal error    5
sum, healthy                 -  result            6
\`\`\`

### Dicas

- \`Id\` é \`Clone\`, então \`r.id.clone()\` ecoa o id.
- \`methods.contains(&r.method.unwrap())\` — o \`unwrap\` é seguro porque a checagem 2 já rejeitou método ausente.
- \`return\`s antecipados mantêm a ordem das checagens visível; essa ordem *é* a classificação.
`,
  },

  "backend-rpc-services-2": {
    instructions: `## Os frames que não recebem resposta

O membro id é uma chave seletora. Uma Request **sem id** é uma **notification**: o servidor roda o handler e NÃO DEVE mandar objeto de resposta, nem mesmo um erro. Um id \`null\` explícito é outra coisa — é uma chamada cujo id por acaso é null.

Um batch é um array JSON de objetos Request, e três regras dele quebram servidores ingênuos:

- Um **array vazio** não é um objeto Request, então recebe um único \`-32600\` com \`id: null\`.
- Um batch **só de notifications** não produz **corpo de resposta nenhum** — nem \`[]\`.
- Um **membro malformado** responde com \`id: null\`, porque o servidor não tem como saber se aquele membro ia ser uma notification.

A ordem também não é garantida: o cliente casa respostas com requisições pelo id, nunca pela posição.

### Sua tarefa

Preencha \`handle_one\` e \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → empurre o método em \`effects\` e devolva \`None\`. O efeito colateral ainda roda; só a resposta é suprimida.
3. \`Frame::Call { method, id }\` → um método diferente de \`"add"\` é \`Some(error_obj(-32601, "Method not found", &id.to_string()))\`; caso contrário empurre o método e devolva \`Some(format!("{{\\"jsonrpc\\":\\"2.0\\",\\"result\\":7,\\"id\\":{}}}", id))\`.
4. \`handle_batch\`: um slice vazio é um único \`-32600\` com id null. Caso contrário passe os frames por \`filter_map\` com \`handle_one\`, e devolva \`None\` quando ninguém respondeu, senão as respostas juntadas com \`,\` dentro de \`[\` \`]\`.

Saída esperada:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

### Dicas

- \`filter_map(|f| handle_one(f, effects))\` descarta exatamente os membros que devolveram \`None\`.
- \`replies.join(",")\` monta o corpo do array.
- Seis invocações de handler contra três corpos de resposta é o ponto inteiro: \`effects.len()\` conta trabalho feito, não respostas enviadas.
`,
  },

  "backend-rpc-services-3": {
    instructions: `## Um router de handlers boxed

Handlers têm corpos diferentes e precisam compartilhar uma assinatura só, então cada um é um trait object:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
\`\`\`

O box é o que deixa closures de tipos concretos diferentes morarem num mesmo \`HashMap\`. O custo é uma indireção de ponteiro por chamada, somada a um lookup de hash que já é ínfimo perto da leitura do socket. Um \`match\` escrito à mão no nome do método despacha igualmente rápido, mas não pode ser estendido na inicialização por um módulo independente, nem enumerado em runtime.

Separar as três falhas é a outra metade do trabalho. \`-32601\` é um nome que a tabela não tem. \`-32602\` é a checagem de formato e aridade que acontece **antes** de entrar no handler. \`-32603\` é um handler que chegou ao trabalho de verdade e falhou — e ele nunca deve vazar uma mensagem interna para o fio.

### Sua tarefa

1. \`register\` insere o handler boxed em \`self.routes\` sob o seu nome.
2. \`dispatch\` procura o método. \`Some(handler)\` chama; \`None\` é \`Err(RpcError { code: -32601, message: "Method not found" })\`.
3. \`method_names\` coleta as chaves e as **ordena** — a ordem de iteração de \`HashMap\` não é especificada e varia por processo.
4. Em \`main\`, registre dois handlers:
   - \`"sum"\` devolve \`Ok(params.iter().sum())\`.
   - \`"div"\` devolve \`-32602\` \`"Invalid params"\` quando \`params.len() != 2\`, \`-32603\` \`"Internal error"\` quando o divisor é zero, e caso contrário \`Ok(params[0] / params[1])\`.

Saída esperada:

\`\`\`text
methods: ["div", "sum"]
method     params     outcome
sum        [1, 2, 3]  result 6
div        [10, 2]    result 5
div        [10, 0]    -32603 Internal error
div        [10]       -32602 Invalid params
multiply   [3, 4]     -32601 Method not found
\`\`\`

### Dicas

- \`Box::new(|params: &[i64]| ...)\` — a closure precisa do tipo do parâmetro anotado para coagir em \`Handler\`.
- \`self.routes.keys().copied().collect()\` dá um \`Vec<&'static str>\` que você pode ordenar.
- Divisão por zero é \`-32603\`, não \`-32602\`: os params passaram na checagem de tipos, depois o handler falhou.
`,
  },

  "backend-rpc-services-4": {
    instructions: `## Service e Layer

O ecossistema Tower inteiro são duas traits. \`Service\` é um método — requisição entra, resposta sai. \`Layer<S>\` é um método — recebe um service, devolve um service. Todo middleware que você já usou é uma struct segurando um \`S\` interno que implementa \`Service\` fazendo alguma coisa e depois chamando \`self.inner.call(req)\`.

O Tower de verdade acrescenta \`poll_ready\` (o canal de backpressure: um service diz "agora não" *antes* de você lhe entregar uma requisição) e tipos associados de Response/Error/Future. O formato é o que você constrói aqui.

A ordem de composição é a decisão que o exercício mede. \`TimeoutLayer.layer(CountLayer.layer(Backend))\` põe o timeout por fora, então uma requisição acima do orçamento é rejeitada sem que o backend seja sequer acionado — e o contador marca 3 de 5.

### Sua tarefa

Escreva quatro impls.

1. \`impl<S: Service> Service for Counted<S>\` — incremente \`self.calls\`, depois delegue para \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\` com \`type Svc = Counted<S>\`, construindo \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — se \`req.cost_ms > self.limit_ms\`, devolva \`Resp::Err(-32001, "Request timeout")\` **sem** chamar o service interno; caso contrário delegue.
4. \`impl<S> Layer<S> for TimeoutLayer\` com \`type Svc = Timeout<S>\`, carregando \`limit_ms\` adiante.

Saída esperada:

\`\`\`text
method      cost_ms  outcome
ping              5  ok in 5ms
report          250  -32001 Request timeout
sum              90  ok in 90ms
export          400  -32001 Request timeout
ping             12  ok in 12ms
requests: 5, reached the backend: 3
\`\`\`

### Dicas

- \`stack.inner\` é o \`Counted\`, porque o timeout é a camada de fora — é isso que deixa o contador legível no final.
- Nada dorme. O custo é um dado na requisição; o timeout é uma comparação.
- Inverta as duas camadas e toda requisição chegaria ao backend. O contador é a evidência de que a ordem é uma decisão de projeto.
`,
  },

  "backend-rpc-services-5": {
    instructions: `## Shed ou queue

Um limite de concorrência é o único botão que de fato limita um serviço. Threads, conexões, handles de banco: alguma coisa é finita, e se você não escolhe o número, a máquina escolhe por você — e mal. Quando as permissões acabam o limitador tem exatamente duas opções, e esta simulação roda as duas contra tráfego idêntico.

A Lei de Little diz \`L = λW\`: com taxa de chegada acima da capacidade de serviço, o tamanho da fila e a espera crescem sem limite. Uma requisição que espera 150ms atrás de um pool cheio e depois roda 150ms queimou o tempo do backend para produzir uma resposta de 300ms para um cliente cujo prazo era 200ms — um cliente que já fez retry, dobrando λ. Essa é a falha metaestável: o serviço não está fora, está gastando toda a capacidade em trabalho que vai para o lixo.

### Sua tarefa

Complete \`simulate\`. Para cada chegada, em ordem:

1. Faça \`now = req.at_ms\` e \`retain\` só nas entradas de \`busy_until\` ainda \`> now\`.
2. Se \`busy_until.len() == CAPACITY\` e \`shed_early\`, conte uma rejeição e imprima a linha com wait \`0\`, latency \`0\`, backend \`"no"\`, outcome \`"-32002 Server busy"\`, e siga em frente.
3. Caso contrário escolha um tempo de início: \`now\` se houver slot livre, senão o **menor** tempo de término em \`busy_until\` — remova aquele slot e comece ali.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`; empurre \`finish\`.
5. Uma \`latency > DEADLINE_MS\` conta uma rejeição, soma \`req.cost_ms\` em \`doomed_ms\`, e sai como \`"-32001 Request timeout"\`; senão \`"ok"\`. Imprima a linha com backend \`"yes"\`.

Saída esperada:

\`\`\`text
policy: shed early
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0      0        0        no  -32002 Server busy
  4       0      0        0        no  -32002 Server busy
  5      10      0        0        no  -32002 Server busy
failed: 3, backend-ms spent on doomed work: 0

policy: queue everything
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0    150      300       yes  -32001 Request timeout
  4       0    150      300       yes  -32001 Request timeout
  5      10    290      310       yes  -32001 Request timeout
failed: 3, backend-ms spent on doomed work: 320
\`\`\`

### Dicas

- \`busy_until.iter().min()\` acha o slot que libera primeiro; \`position\` então o localiza para o \`remove\`.
- A coluna wait é \`start - now\`.
- Leia os dois totais um contra o outro: as mesmas três falhas de qualquer jeito, e 320ms de tempo de backend como a única coisa que enfileirar comprou.
`,
  },

  "backend-rpc-services-6": {
    instructions: `## Um token bucket por cliente

Um bucket guarda até \`capacity\` tokens e reabastece a uma taxa fixa; uma requisição custa um token e uma requisição que não consegue pagar é rejeitada. Duas propriedades decorrem disso: o bucket permite um burst de \`capacity\` e depois se assenta exatamente na taxa de refill. Uma janela fixa de 60/minuto deixa um cliente mandar 120 requisições atravessando a borda da janela; um bucket nunca deixa.

**Não** rode um timer de refill. Reabasteça preguiçosamente no acesso, a partir de \`(now - last_seen) * rate\`, limitado na capacidade: uma linha de aritmética, nenhuma task em background, dois inteiros de estado por cliente. Tudo aqui é em mili-tokens para a aritmética inteira continuar exata, e \`(deficit + rate - 1) / rate\` é a divisão com teto que transforma um déficit num \`retry_after\` que o cliente consegue honrar.

### Sua tarefa

1. \`Bucket::new\` começa um cliente cheio: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` credita \`(now_ms - self.last_ms) * REFILL_PER_MS\`, limita com \`.min(CAPACITY)\`, e guarda \`last_ms = now_ms\`.
3. \`take\` devolve \`Ok(self.tokens)\` depois de subtrair \`COST\` quando há tokens o bastante. Caso contrário calcule \`deficit = COST - self.tokens\` e devolva \`Err((deficit + REFILL_PER_MS - 1) / REFILL_PER_MS)\` — os milissegundos até existir um token inteiro. Uma negativa não gasta nada.

Saída esperada:

\`\`\`text
  t_ms client   before   after  outcome
     0 alice     5.000   4.000  allowed
     0 alice     4.000   3.000  allowed
     0 alice     3.000   2.000  allowed
     0 alice     2.000   1.000  allowed
     0 alice     1.000   0.000  allowed
     0 alice     0.000   0.000  -32005 Rate limit exceeded, retry_after_ms=200
   200 alice     1.000   0.000  allowed
   250 alice     0.250   0.250  -32005 Rate limit exceeded, retry_after_ms=150
   250 bob       5.000   4.000  allowed
  1500 alice     5.000   4.000  allowed
final alice: 4.000 tokens
final bob: 4.000 tokens
\`\`\`

### Dicas

- \`BTreeMap\` mantém a listagem final numa ordem fixa; um \`HashMap\` não manteria.
- \`bob\` chega em t=250 com o bucket cheio — o estado é por chave, e escolher a chave é a política.
- Em t=1500 alice está de volta na capacidade: 1250ms de crédito limitados a 5 tokens, não 6.25.
`,
  },

  "backend-rpc-services-7": {
    instructions: `## Prove que OFFSET perde uma linha

\`offset=3&limit=3\` significa "conte três linhas a partir do começo da coleção **como ela existe agora**". Entre a página 1 e a página 2 a coleção muda — uma linha é apagada e tudo depois dela desce uma posição, então a página 2 começa uma linha atrasada e uma linha que o cliente nunca viu é pulada para sempre. Um insert produz o bug espelhado: uma duplicata.

Um cursor codifica a posição da última linha numa ordem total estável (\`WHERE id > $cursor ORDER BY id LIMIT n\`), então a próxima página é definida pelo conteúdo, e não por uma contagem, e edições antes do cursor não conseguem deslocá-lo. Dois detalhes do contrato: ordene por algo único — \`created_at\` sozinho perde linhas que compartilham timestamp, então a chave é \`(created_at, id)\` — e torne o token opaco para poder mudar o que há dentro dele sem quebrar clientes.

A terminação também faz parte do contrato. O próximo cursor é **ausente** na última página; é isso, e não uma página vazia, que diz ao cliente que ele acabou.

### Sua tarefa

1. \`page_by_offset\` devolve \`ids.iter().skip(offset).take(limit)\` coletado — contando do começo da tabela que lhe for entregue, seja ela qual for.
2. \`page_by_cursor\` mantém os ids estritamente maiores que o cursor (todos eles quando \`after\` é \`None\`), pega \`limit\`, e devolve a página com o seu próximo cursor: o **último** id da página quando \`page.len() == limit\`, e \`None\` quando a página veio curta.
3. \`missed\` devolve as linhas sobreviventes que nunca apareceram em página nenhuma.

\`main\` apaga a linha 2 entre a página 1 e a página 2 para os dois clientes.

Saída esperada:

\`\`\`text
api=v1  page_size=3  row 2 is deleted between page 1 and page 2
client     req_id   argument     page
offset     a-1      offset=0     [1, 2, 3]
offset     a-2      offset=3     [5, 6, 7]
offset     a-3      offset=6     [8, 9]
cursor     b-1      after=start  [1, 2, 3]
cursor     b-2      after=3      [4, 5, 6]
cursor     b-3      after=6      [7, 8, 9]
rows still in the table: [1, 3, 4, 5, 6, 7, 8, 9]
offset client never saw: [4]
cursor client never saw: []
\`\`\`

### Dicas

- \`page.last().copied()\` dá um \`Option<u64>\` direto de um \`Vec<u64>\`.
- A linha 4 é a linha que o cliente de offset perde — ela ainda está na tabela e não apareceu em página nenhuma.
- A coluna \`req_id\` é a outra metade do contrato: gere um na borda, ecoe em toda resposta, e ponha em toda linha de log e em toda chamada downstream.
`,
  },
};
