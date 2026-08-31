import type { LessonStep } from "@/content/steps";

// PT · Serviços RPC em escala.

export const backendRpcServicesStepsPt: Record<string, LessonStep[]> = {
  "backend-rpc-services-1": [
    {
      kind: "theory",
      body: `Um Request JSON-RPC 2.0 tem quatro membros: \`jsonrpc\`, \`method\`, um \`params\` opcional e um \`id\` opcional. Um Response carrega **ou** \`result\` **ou** \`error\` — nunca os dois, nunca nenhum.

\`\`\`json
{"jsonrpc": "2.0", "method": "sum", "params": [1, 2], "id": 3}
{"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": 3}
\`\`\`

Cinco códigos são reservados, e eles particionam o espaço de falha na ordem em que você os checa:

| código | significado | o que o chamador aprende |
| --- | --- | --- |
| -32700 | Parse error | os bytes não eram JSON |
| -32600 | Invalid Request | fez parse, mas não é um objeto Request |
| -32601 | Method not found | este endpoint não existe |
| -32602 | Invalid params | ele existe — tente de novo com outros argumentos |
| -32603 | Internal error | não é você, é o servidor |

\`-32000\` até \`-32099\` fica reservado para os erros de servidor da própria aplicação: \`-32001 Request timeout\`, \`-32002 Server busy\`, e o que mais o seu contrato documentar.`,
    },
    {
      kind: "theory",
      body: `JSON-RPC não diz **nada** sobre HTTP. O mesmo envelope viaja em HTTP/1.1, HTTP/2 ou um socket cru sem mudar, e o transporte por baixo é que decide a sua concorrência — não o protocolo.

**HTTP/1.1 com keep-alive** dá uma requisição em voo por conexão. N chamadas concorrentes exigem um pool de N conexões, e o head-of-line blocking é por conexão — uma resposta lenta trava só aquele socket.

**HTTP/2** multiplexa vários streams sobre uma conexão, então um pool de 2–4 conexões satura um backend. O preço é que um único evento de perda TCP agora trava todos os streams que dividem aquela conexão.

Dimensionar o pool é aritmética, não gosto. Um pool de 8 contra um serviço com limite de 200 conexões, com 30 instâncias de cliente, dá 240 conexões — e as últimas 40 são uma tempestade de conexão recusada que parece uma queda.

Dois detalhes do envelope que mordem depois: o \`id\` precisa voltar **byte a byte idêntico** (um id string volta como string), e a ordem não é garantida. O id é a única correlação que o protocolo te dá.`,
    },
    {
      kind: "quiz",
      question:
        "Um cliente chama `sbutract` — um erro de digitação de um método que o servidor não tem. Qual código, e por que a distinção importa?",
      options: [
        "-32601 Method not found: o nome não está registrado. -32602 é para um método que *existe* cujos argumentos não batem com os tipos",
        "-32602 Invalid params, porque o nome do método é ele próprio um parâmetro ruim da requisição",
        "-32603 Internal error, já que o servidor não conseguiu completar a chamada",
      ],
      answer: 0,
      explain:
        "Confundir os dois custa ao chamador o único bit que separa 'este endpoint não existe' de 'tente de novo com outros argumentos'. Um cliente que vê -32602 vai continuar dando retry num endpoint que nunca vai existir.",
    },
    {
      kind: "fill",
      prompt: "Um nome de método que o servidor não conhece tem código próprio.",
      file: "main.rs",
      before: "return Reply { code: ",
      after: ', message: "Method not found", id: r.id.clone() };',
      choices: ["-32601", "-32602", "-32600"],
      answer: 0,
      explain:
        "-32602 diria que os argumentos estavam errados para um método que existe; -32600 diria que o próprio objeto da requisição estava malformado. Nenhum dos dois é verdade aqui — o envelope estava bom e o nome não estava registrado.",
    },
    {
      kind: "quiz",
      question:
        "Por que -32700 e -32600 respondem com `id: null` enquanto -32601, -32602 e -32603 ecoam o id que receberam?",
      options: [
        "O id não é confiável enquanto você não tem um objeto Request válido em mãos — o corpo pode não ter feito parse, ou o membro id pode ser do tipo errado",
        "Null é usado em toda resposta de erro; só resultados bem-sucedidos carregam id",
        "O id só é ecoado quando o handler rodou, então -32601 e -32602 também mandam null",
      ],
      answer: 0,
      explain:
        "'Sempre ecoe o id que você recebeu' é a concepção errada. Num parse error pode não existir id nenhum, e num objeto Request inválido o membro pode ser um objeto ou um array. Depois que a requisição foi validada, os três códigos restantes ecoam.",
    },
    {
      kind: "editor",
      intro: `### Classifique uma requisição de entrada

Preencha \`classify\`. Rode as cinco checagens em ordem — parse, formato da requisição, método, params, handler — e responda cada uma com o seu código.

1. \`well_formed == false\` → \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. \`version\` diferente de \`Some("2.0")\`, ou \`method\` ausente → \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. Um método que não está em \`methods\` → \`-32601\` \`"Method not found"\`, ecoando o id.
4. \`params_ok == false\` → \`-32602\` \`"Invalid params"\`, ecoando o id.
5. \`handler_ok == false\` → \`-32603\` \`"Internal error"\`, ecoando o id.
6. Caso contrário \`Reply { code: 0, message: "result", id }\`.

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

Duas linhas respondem \`null\` e quatro ecoam — a divisão é a lição.`,
    },
  ],

  "backend-rpc-services-2": [
    {
      kind: "theory",
      body: `O membro \`id\` é uma chave de liga-desliga. Um objeto Request **sem id** é uma **notification**: o servidor roda o handler e NÃO PODE mandar objeto de resposta — nem result, nem sequer um error.

Isso é o contrato, não uma otimização. Um cliente que mandou uma notification não está lendo esperando resposta, e escrever uma dessincroniza uma conexão pipelined: toda resposta seguinte é casada com a requisição errada.

A spec é cuidadosa com uma distinção que as pessoas achatam:

| corpo | significado |
| --- | --- |
| \`{"jsonrpc":"2.0","method":"log"}\` | notification — sem resposta |
| \`{"jsonrpc":"2.0","method":"log","id":null}\` | uma chamada cujo id por acaso é null — responda com \`"id":null\` |

Um id **ausente** e um id explicitamente **null** são requisições diferentes.`,
    },
    {
      kind: "theory",
      body: `Um batch é um array JSON de objetos Request. O servidor PODE processar os membros em qualquer ordem e concorrentemente, e o array de resposta contém apenas os membros que produziram resposta. Três consequências quebram servidores ingênuos:

- Um **array vazio** não é um objeto Request. Ele recebe um \`-32600\` com \`id: null\`.
- Um batch **só de notifications** produz **nenhum corpo de resposta** — não é \`[]\`, é nada.
- Um **membro malformado** responde com \`id: null\`, porque o servidor não tem como saber se aquele membro seria uma notification.

E a regra de ordem que o lado cliente precisa honrar: case respostas com requisições **por id**, nunca por posição. O array que volta é menor que o que você mandou e pode vir em qualquer ordem.`,
    },
    {
      kind: "quiz",
      question:
        "Um cliente manda um batch de cinco notifications. O que um servidor correto coloca no fio?",
      options: [
        "Nada — nenhum corpo de resposta, porque nenhum membro produziu objeto de resposta",
        "`[]`, um array vazio, já que o batch era válido e simplesmente não produziu resultados",
        "Cinco objetos `{\"jsonrpc\":\"2.0\",\"result\":null}`, um por membro",
      ],
      answer: 0,
      explain:
        "Devolver `[]` é um bug de interoperabilidade de verdade: um cliente estrito trata array vazio como violação de protocolo, porque a spec diz que o servidor não devolve nada quando não há nada a devolver. O array de *requisição* vazio é o caso que leva -32600 — não o array de *resposta* vazio.",
    },
    {
      kind: "fill",
      prompt:
        "Uma notification roda seu handler e depois produz a coisa que nunca chega no fio.",
      file: "main.rs",
      before: "Frame::Notify { method } => {\n    effects.push(method);\n    ",
      after: "\n}",
      choices: ["None", 'Some(String::new())', 'Some("[]".to_string())'],
      answer: 0,
      explain:
        "`Some(String::new())` escreve um corpo de comprimento zero, o que ainda é uma escrita — e `handle_batch` contaria isso como resposta e emitiria um `[]`. `None` é o que faz o membro sumir por completo da resposta do batch.",
    },
    {
      kind: "quiz",
      question:
        "Seis frames chegam ao longo dos batches do exercício, mas só três corpos de resposta saem. O que essa razão diz sobre notifications?",
      options: [
        "O efeito colateral continua rodando para toda notification — o que é suprimido é a resposta, não o trabalho",
        "Notifications são fire-and-forget, então o servidor pode descartar o handler sob carga",
        "As três respostas que faltam foram descartadas porque seus handlers falharam",
      ],
      answer: 0,
      explain:
        "'Fire-and-forget significa que o servidor pode pular' é a concepção errada, e ela transforma uma escrita durável num no-op silencioso. O contador do exercício existe para tornar a distinção contável: seis invocações de handler, três corpos.",
    },
    {
      kind: "editor",
      intro: `### Os frames que não recebem resposta

Preencha \`handle_one\` e \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → empurre o método em \`effects\`, devolva \`None\`.
3. \`Frame::Call { method, id }\` → um método diferente de \`"add"\` é \`-32601\` ecoando o id; caso contrário empurre o método e devolva o objeto de resultado com \`"result":7\`.
4. \`handle_batch\` → um slice vazio é um único \`-32600\` com id null. Caso contrário passe por \`filter_map\` com \`handle_one\`, devolva \`None\` quando ninguém respondeu, senão as respostas juntadas com \`,\` dentro de colchetes.

Saída esperada:

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

Seis handlers, três corpos.`,
    },
  ],

  "backend-rpc-services-3": [
    {
      kind: "theory",
      body: `Handlers têm corpos diferentes mas precisam compartilhar uma assinatura, então cada um é um trait object:

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
struct Router { routes: HashMap<&'static str, Handler> }
\`\`\`

O box não é cerimônia — é o que permite que closures de tipos concretos diferentes vivam numa mesma coleção. O custo é uma indireção de ponteiro por chamada, contra um lookup de hash que já é dominado pela leitura do socket.

Um \`match\` escrito à mão sobre o nome do método compila para o mesmo dispatch. O que ele não consegue é ser **estendido em runtime**: nenhum módulo registrando os próprios métodos no startup, nenhum \`rpc.discover\`, nenhuma métrica por método enumerada a partir da tabela, e cada método novo recompila o arquivo dono do match.

Uma armadilha de saída determinística: a ordem de iteração de \`HashMap\` não é especificada e varia por processo. Qualquer listagem de métodos precisa ser ordenada antes de ser impressa ou hasheada.`,
    },
    {
      kind: "theory",
      body: `Validar na borda é o que \`-32602\` significa. Num serviço real o Serde faz esse trabalho:

\`\`\`rust
#[derive(Deserialize)]
struct SumParams { values: Vec<i64> }
\`\`\`

Isso transforma "o JSON não tinha o formato que meu handler assume" numa falha tipada na fronteira, antes de qualquer código de negócio rodar. As representações untagged e internally-tagged de enum decidem como uma união de params é casada com a forma que veio no fio.

A divisão que importa:

| falha | código | culpa de quem |
| --- | --- | --- |
| aridade errada, tipo errado, campo ausente | -32602 | do chamador |
| o handler rodou e explodiu | -32603 | do servidor |

E \`-32603\` nunca pode vazar mensagem interna. \`"Internal error"\` no fio, o id da requisição e o stack trace nos logs — uma mensagem de erro é um canal de exfiltração de nomes de tabela, caminhos de arquivo e texto de query.`,
    },
    {
      kind: "quiz",
      question:
        "Por que preferir um `HashMap` de handlers boxed a um `match` sobre a string do método?",
      options: [
        "A tabela pode ser populada no startup por módulos independentes e enumerada em runtime; um `match` torna as duas coisas impossíveis",
        "O `HashMap` faz dispatch em O(1) enquanto um `match` sobre strings é uma cadeia linear de comparações",
        "Closures boxed evitam a monomorfização que senão incharia o binário",
      ],
      answer: 0,
      explain:
        "Um `match` sobre literais de string é compilado numa árvore de decisão por comprimento e prefixo, então o argumento de performance é quase um empate. Registrabilidade e introspecção são a diferença real, e são o que uma fronteira de plugin precisa.",
    },
    {
      kind: "fill",
      prompt:
        "Faça a listagem de métodos ser idêntica em toda execução, qualquer que tenha sido a semente do hash.",
      file: "main.rs",
      before:
        "let mut names: Vec<&'static str> = self.routes.keys().copied().collect();\nnames.",
      after: "();\nnames",
      choices: ["sort", "dedup", "reverse"],
      answer: 0,
      explain:
        "`dedup` só remove duplicatas *adjacentes*, o que numa entrada não ordenada é quase um no-op, e as chaves já são únicas de qualquer jeito. `reverse` inverte uma ordem que já era arbitrária.",
    },
    {
      kind: "quiz",
      question:
        "`div` é chamado com `[10, 0]`. Os params passaram na checagem de tipo; o handler dividiu por zero. Qual código?",
      options: [
        "-32603 Internal error — o handler foi entrado e falhou",
        "-32602 Invalid params, porque os parâmetros são o que causou a falha",
        "-32600 Invalid Request, já que a requisição nunca poderia ter dado certo",
      ],
      answer: 0,
      explain:
        "A resposta tentadora é -32602: os params de fato causaram isso. Mas -32602 é reservado para a checagem de formato e aridade que acontece *antes* de o handler ser entrado. Uma vez dentro do handler, toda falha é sua.",
    },
    {
      kind: "editor",
      intro: `### Um router de handlers boxed

1. \`register\` insere o handler boxed em \`self.routes\` sob o seu nome.
2. \`dispatch\` procura o método; \`None\` é \`-32601\` \`"Method not found"\`.
3. \`method_names\` coleta as chaves e as **ordena**.
4. Registre dois handlers em \`main\`:
   - \`"sum"\` → \`Ok(params.iter().sum())\`.
   - \`"div"\` → \`-32602\` quando \`params.len() != 2\`, \`-32603\` quando o divisor é zero, senão \`Ok(params[0] / params[1])\`.

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

Três falhas diferentes, três códigos diferentes, um lookup de tabela.`,
    },
  ],

  "backend-rpc-services-4": [
    {
      kind: "theory",
      body: `Todo o ecossistema Tower são dois traits.

\`\`\`rust
trait Service { fn call(&mut self, req: &Req) -> Resp; }
trait Layer<S> { type Svc; fn layer(&self, inner: S) -> Self::Svc; }
\`\`\`

\`Service\` é requisição entra, resposta sai. \`Layer\` pega um service e devolve um service. Essa é a abstração inteira — timeout, retry, limite de concorrência, auth, tracing, load balancing são todos uma struct segurando um \`S\` interno, implementando \`Service\` fazendo alguma coisa e depois chamando \`self.inner.call(req)\`.

O Tower de verdade acrescenta \`poll_ready\` — o canal de backpressure, onde um service diz "agora não" **antes** de você entregar uma requisição a ele — além dos tipos associados Response, Error e Future. O formato é o que você constrói aqui.`,
    },
    {
      kind: "theory",
      body: `\`TimeoutLayer.layer(CountLayer.layer(Backend))\` monta uma cebola. O timeout é o mais externo, então uma requisição acima do orçamento é rejeitada sem o backend nunca ser entrado, e o contador marca **3 de 5**. Inverta os dois e todas as cinco chegam ao backend, com o timeout só limitando a resposta.

Uma pilha de layers é uma ordem total sobre preocupações transversais, e você deveria conseguir defendê-la:

| decisão | acima | abaixo |
| --- | --- | --- |
| auth vs rate limit | tráfego não autenticado ainda consome quota | seu limiter faz cripto para tráfego lixo |
| tracing vs retry | um span por chamada lógica | um span por tentativa |
| timeout vs limite de concorrência | a espera na fila conta contra o orçamento | só o tempo de serviço conta |

Nenhuma dessas tem resposta universal. Todas elas têm resposta para o seu serviço.`,
    },
    {
      kind: "quiz",
      question:
        "O layer de timeout rejeita uma requisição aos 100ms. O que aconteceu com o trabalho que o backend já tinha começado?",
      options: [
        "Nada cancela isso — um layer só decide se e quando chamar o service interno; numa pilha async o timeout dropa a future interna, e uma query já em voo numa conexão do pool continua até terminar",
        "O layer cancela a chamada interna, liberando a conexão imediatamente",
        "O service interno é pollado mais uma vez com uma flag de cancelamento e desmonta a pilha de forma limpa",
      ],
      answer: 0,
      explain:
        "É por isso que um timeout não protege um banco de uma query lenta: dropar a future devolve a thread do chamador mas o trabalho do lado do servidor continua. Limitar isso exige um statement timeout do outro lado, não um layer deste.",
    },
    {
      kind: "fill",
      prompt: "O layer de contagem registra a chamada e então a repassa.",
      file: "main.rs",
      before: "self.calls += 1;\n",
      after: "\n",
      choices: [
        "self.inner.call(req)",
        "Resp::Ok(req.cost_ms)",
        "Backend.call(req)",
      ],
      answer: 0,
      explain:
        "A segunda responde a requisição ela mesma, então nada abaixo do contador chega a rodar. A terceira chama um `Backend` novo em vez do service que lhe foi entregue — o que descarta em silêncio todo layer abaixo dele na pilha.",
    },
    {
      kind: "quiz",
      question:
        "`CountLayer.layer(TimeoutLayer.layer(Backend))` em vez disso. O que o contador marca, e o que mudou?",
      options: [
        "5 — o contador agora é o mais externo, então vê toda requisição, incluindo as duas que o timeout rejeita",
        "3 — o mesmo, já que o timeout continua rejeitando as mesmas duas requisições",
        "0 — o contador não envolve mais o backend, então não conta nada",
      ],
      answer: 0,
      explain:
        "A ordem determina o que cada layer *vê*. As mesmas duas requisições falham de qualquer jeito; o que se move é a medição — que é exatamente por que 'requisições recebidas' e 'requisições servidas' são métricas diferentes e querem posições diferentes na pilha.",
    },
    {
      kind: "editor",
      intro: `### Service e Layer

Escreva quatro impls.

1. \`impl<S: Service> Service for Counted<S>\` — incremente \`self.calls\`, depois delegue para \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\`, \`type Svc = Counted<S>\`, construindo \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — quando \`req.cost_ms > self.limit_ms\`, devolva \`Resp::Err(-32001, "Request timeout")\` **sem** chamar o service interno.
4. \`impl<S> Layer<S> for TimeoutLayer\`, \`type Svc = Timeout<S>\`, carregando \`limit_ms\` adiante.

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

Nada dorme: o custo é dado na requisição e o timeout é uma comparação. A última linha é a evidência de que a ordem é uma decisão de projeto.`,
    },
  ],

  "backend-rpc-services-5": [
    {
      kind: "theory",
      body: `Um limite de concorrência é o único botão que de fato limita um serviço. Threads, conexões, handles de banco — alguma coisa é finita, e se você não escolher o número a máquina escolhe por você, mal: um pool de 500 threads passando a vida em context switch, ou um pool exaurido por uma dependência lenta enquanto todo outro endpoint que divide esse pool apaga.

Um layer de limite segura uma contagem de permits. Quando os permits acabam ele precisa escolher entre duas políticas, e essa escolha é esta lição:

- **shed** — rejeitar imediatamente com um código documentado da faixa \`-32000..-32099\`
- **queue** — segurar a requisição até um permit liberar

As duas falham as mesmas requisições aqui. Só uma delas gasta o tempo do backend fazendo isso.`,
    },
    {
      kind: "theory",
      body: `Enfileirar não cria capacidade. Converte rejeição em latência.

A Lei de Little é \`L = λW\`: com taxa de chegada acima da capacidade de serviço, comprimento de fila e espera crescem sem limite. Uma requisição que espera 150ms atrás de um pool cheio e então roda 150ms queimou tempo do backend para produzir uma resposta de 300ms para um cliente cujo deadline era 200ms — um cliente que já deu retry, dobrando λ.

Essa é a falha metaestável que todo mundo já viu uma vez. O serviço não está fora do ar. Está a 100% de utilização, servindo trabalho que será descartado na chegada, e não vai se recuperar enquanto os retries continuarem.

Fazer shed cedo mantém rápidas as requisições admitidas e mantém a falha legível: um \`-32002\` documentado, um \`retry_after\`, um contrato de cliente que diz retryable-com-backoff, e uma contagem de rejeições que você pode pôr num dashboard. Backpressure é a mesma ideia um nível acima — uma fila limitada cuja lotação é um sinal que viaja de volta ao produtor.`,
    },
    {
      kind: "quiz",
      question:
        "A fila na frente de um serviço saturado é dobrada para absorver picos. O que isso compra?",
      options: [
        "Uma latência maior na qual as requisições falham — converte falhas rápidas em lentas e atrasa a recuperação",
        "Mais disponibilidade, já que requisições que seriam rejeitadas agora dão certo",
        "Nada mensurável, porque a profundidade da fila não afeta a taxa de serviço de jeito nenhum",
      ],
      answer: 0,
      explain:
        "Uma fila maior só ajuda num pico curto em relação à taxa de serviço. Contra sobrecarga sustentada ela eleva a espera até que toda requisição admitida perca o deadline — o exercício mostra contagens de sucesso idênticas com 320ms de trabalho condenado no backend como única diferença.",
    },
    {
      kind: "fill",
      prompt:
        "Antes de admitir qualquer coisa, largue os slots cujo trabalho já terminou.",
      file: "main.rs",
      before: "busy_until.",
      after: "(|finish| *finish > now);",
      choices: ["retain", "iter", "drain"],
      answer: 0,
      explain:
        "`iter` constrói um iterador preguiçoso e não muta nada, então o pool encheria e nunca liberaria. `drain` recebe um range, não um predicado, e esvaziaria o pool inteiro.",
    },
    {
      kind: "quiz",
      question:
        "Um cliente argumenta que shed é pior para ele: uma rejeição é uma falha, enquanto uma requisição enfileirada ainda pode dar certo. Qual a resposta?",
      options: [
        "Uma rejeição em 0ms é uma resposta retryable dentro do orçamento dele; um timeout em 310ms é uma falha que ainda por cima consumiu o servidor. As duas não são a mesma falha",
        "Ele tem razão, e a correção é um deadline de cliente maior para as requisições enfileiradas terem tempo de aterrissar",
        "Ele tem razão para um cliente isolado, mas shed é escolhido mesmo assim porque o custo do servidor pesa mais que a experiência do cliente",
      ],
      answer: 0,
      explain:
        "O deadline do próprio cliente é o que decide isso. Uma requisição que não pode completar dentro do orçamento já falhou; enfileirá-la só esconde quando. Shed devolve o orçamento ao cliente enquanto ele ainda é gastável — num retry, num fallback ou numa resposta degradada.",
    },
    {
      kind: "editor",
      intro: `### Shed ou queue

Complete \`simulate\`. Para cada chegada, em ordem:

1. \`now = req.at_ms\`; faça \`retain\` só nas entradas de \`busy_until\` ainda \`> now\`.
2. Cheio **e** \`shed_early\` → conte uma rejeição, imprima wait \`0\`, latency \`0\`, backend \`"no"\`, \`"-32002 Server busy"\`, continue.
3. Caso contrário comece em \`now\` se houver slot livre, senão no **menor** tempo de término — remova aquele slot.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`, empurre \`finish\`.
5. \`latency > DEADLINE_MS\` → conte uma rejeição, some \`req.cost_ms\` em \`doomed_ms\`, \`"-32001 Request timeout"\`; senão \`"ok"\`. Backend \`"yes"\` nos dois casos.

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

Os mesmos dois sucessos, as mesmas três falhas, 320ms de tempo de backend como a única coisa que enfileirar comprou.`,
    },
  ],

  "backend-rpc-services-6": [
    {
      kind: "theory",
      body: `Um token bucket guarda até \`capacity\` tokens e reabastece a uma taxa fixa. Uma requisição custa um token; uma requisição que não pode pagar é rejeitada. Duas propriedades saem daí, e são por que esse é o formato certo para uma quota de API:

- permite um burst de \`capacity\`, depois assenta exatamente na taxa de refill
- nunca tem fronteira de janela — uma janela fixa de 60/minuto deixa um cliente mandar 120 requisições em dois segundos em cima da emenda

O detalhe de implementação que importa: **não rode um timer de refill.** Reabasteça preguiçosamente no acesso, a partir de \`(now - last_seen) * rate\`, limitado pela capacidade.

\`\`\`rust
let earned = (now_ms - self.last_ms) * REFILL_PER_MS;
self.tokens = (self.tokens + earned).min(CAPACITY);
\`\`\`

Uma linha de aritmética, nenhuma task de fundo, dois inteiros de estado por cliente. Mili-tokens mantêm tudo em inteiros para não haver drift de ponto flutuante, e \`(deficit + rate - 1) / rate\` é a divisão com teto que transforma um déficit num \`retry_after\` que o cliente consegue honrar.`,
    },
    {
      kind: "theory",
      body: `O bucket é por **chave**, e escolher a chave *é* a política. Id de cliente, API key, tenant, IP — e chavear por IP atrás de um NAT ou de uma CDN limita um escritório inteiro como se fosse um cliente.

Esse estado também é a razão de uma frota RPC ser só quase stateless. Rode este limiter em processo em 10 nós atrás de um load balancer round-robin e um limite de 5/s vira 50/s — e muda toda vez que a frota faz autoscale. As opções são estas:

| abordagem | custo |
| --- | --- |
| dividir o limite pelo número de nós | errado no instante em que um nó morre ou é adicionado |
| centralizar no Redis | um round trip de rede no caminho da requisição, e uma dependência dura |
| contadores distribuídos aproximados | corretos na média, ultrapassam de propósito |

Todo o *resto* do serviço deve continuar genuinamente stateless: sem afinidade de sessão, sem estado de usuário em memória. Aí qualquer nó serve qualquer requisição e um rolling deploy não é uma migração de dados.`,
    },
    {
      kind: "quiz",
      question:
        "Por que reabastecer preguiçosamente no acesso em vez de tiquetaquear todo bucket a partir de uma task de fundo?",
      options: [
        "Um ticker é trabalho O(clientes) por tick para buckets que ninguém está usando; o refill preguiçoso é O(1) por requisição e aritmeticamente idêntico",
        "Uma task de fundo não consegue mutar o mapa de buckets com segurança sem um lock, e o refill preguiçoso evita o lock",
        "O refill preguiçoso é mais preciso, porque um ticker quantiza os tokens no intervalo do tick",
      ],
      answer: 0,
      explain:
        "O argumento do lock é real mas secundário — você precisa de um dos dois jeitos. O argumento de precisão é errado: um ticker de 1ms também é exato, ele só gasta CPU proporcional ao número de chaves ociosas para sê-lo.",
    },
    {
      kind: "fill",
      prompt: "Credite o tempo decorrido, mas nunca acima do que o bucket comporta.",
      file: "main.rs",
      before: "self.tokens = (self.tokens + earned).",
      after: "(CAPACITY);",
      choices: ["min", "max", "rem_euclid"],
      answer: 0,
      explain:
        "`max` colocaria um piso no bucket em capacity, então um cliente ocioso por um segundo teria orçamento infinito. Sem o clamp por completo, um cliente ocioso por uma hora chega com 18.000 tokens e o limite de burst não significa nada.",
    },
    {
      kind: "quiz",
      question:
        "O limiter roda em processo, guarda só dois inteiros por cliente, e o serviço é descrito como horizontalmente escalável. O que há de errado nessa descrição?",
      options: [
        "Buckets por nó multiplicam o limite configurado pelo número de nós e derivam com o autoscaling — o limite na sua doc de API não é o limite que você aplica",
        "Nada — limitar por nó é exato desde que o load balancer seja round-robin",
        "O estado do bucket torna os nós stateful, então um rolling deploy vai derrubar requisições em voo",
      ],
      answer: 0,
      explain:
        "Um rolling deploy perdendo o estado dos buckets é inofensivo — os clientes voltam com buckets cheios, o que erra a favor do cliente. A multiplicação é o bug: 10 nós aplicando 5/s cada dá 50/s, e 30 nós dá 150/s, em silêncio, no dia em que você escala.",
    },
    {
      kind: "editor",
      intro: `### Um token bucket por cliente

1. \`Bucket::new\` começa um cliente cheio: \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` credita \`(now_ms - self.last_ms) * REFILL_PER_MS\`, limita em \`CAPACITY\`, guarda \`last_ms\`.
3. \`take\` subtrai \`COST\` e devolve \`Ok(self.tokens)\` quando há o bastante; caso contrário devolve \`Err\` carregando \`(deficit + REFILL_PER_MS - 1) / REFILL_PER_MS\` — os milissegundos até existir um token inteiro. Uma negativa não gasta nada.

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

Um burst de cinco, depois exatamente a taxa de refill. Em t=1500 alice está na capacidade, não acima dela.`,
    },
  ],

  "backend-rpc-services-7": [
    {
      kind: "theory",
      body: `\`offset=3&limit=3\` significa "conte três linhas a partir do começo da coleção **como ela existe agora**". Essa é uma promessa que você não consegue cumprir por mais de uma requisição.

Apague uma linha entre a página 1 e a página 2 e toda linha depois dela desce uma posição. A página 2 começa uma linha tarde demais, e uma linha que o cliente nunca viu é pulada **para sempre** — sem erro, sem buraco na saída, sem nada para alertar. Um insert produz o bug espelhado: uma duplicata.

Um cursor é um token opaco que codifica a posição da última linha numa ordem total estável:

\`\`\`sql
SELECT * FROM rows WHERE id > $cursor ORDER BY id LIMIT 3
\`\`\`

A próxima página é definida por conteúdo, não por uma contagem, então edições antes do cursor não conseguem deslocá-lo. Dois detalhes do contrato: ordene por algo **único** — \`created_at\` sozinho perde linhas que compartilham timestamp, então a chave é \`(created_at, id)\` — e mantenha o token opaco (base64 da tupla) para você poder mudar o que tem dentro sem quebrar clientes.

Terminação faz parte do contrato: \`next_cursor\` é **ausente** na última página. Isso, e não uma página vazia, é como um cliente sabe que acabou.`,
    },
    {
      kind: "theory",
      body: `O resto do contrato, em três partes.

**Versionamento.** Mudanças aditivas — um campo opcional novo, um método novo — não precisam de versão. Um campo removido ou um tipo alterado precisa. O mecanismo mais barato em JSON-RPC é o próprio nome do método: \`user.get\` e \`user.get.v2\`, o que versiona por endpoint em vez de congelar a API inteira no seu consumidor mais lento. Deprecie numa data publicada com métricas de uso por cliente, não na esperança.

**Request IDs.** Gere um na borda se o cliente não mandou, ecoe em toda resposta, e coloque em toda linha de log e em toda chamada downstream. É a única coisa que te deixa reconstruir o caminho de uma requisição pela frota, e custa um header.

**Schemas de erro.** O membro \`data\` de um erro JSON-RPC é onde o detalhe legível por máquina pertence — qual campo falhou, \`retryable: true\`, um \`retry_after_ms\`. Ele deve ser tão estável quanto os seus tipos de sucesso, porque clientes ramificam em cima dele.`,
    },
    {
      kind: "quiz",
      question:
        "Um engenheiro defende paginação por OFFSET: a ordenação é determinística, logo as páginas são determinísticas. O que há de errado?",
      options: [
        "O determinismo da ordenação não é o problema — a coleção mutando durante uma caminhada de várias requisições é, e um delete antes do offset pula uma linha em silêncio",
        "A ordenação não é determinística, porque empates na chave de ordenação são ordenados arbitrariamente pelo planner",
        "Nada está errado desde que a query rode dentro de uma única transação repeatable-read",
      ],
      answer: 0,
      explain:
        "Desempate é um bug real e separado, e uma transação com snapshot de vida longa de fato conserta a correção ao custo de manter uma visão de leitura aberta durante o tempo de reflexão do cliente. Nenhum dos dois é o argumento: a caminhada por offset está errada mesmo com uma ordenação única perfeita, porque a contagem em que ela se baseia mudou.",
    },
    {
      kind: "fill",
      prompt:
        "O próximo cursor é a posição da última linha que esta página entregou.",
      file: "main.rs",
      before: "let next = if page.len() == limit { page.",
      after: "().copied() } else { None };",
      choices: ["last", "first", "iter().next"],
      answer: 0,
      explain:
        "`first` (e `iter().next`) devolve um cursor por onde o cliente já passou, então a próxima página reentrega tudo depois da linha um — um laço infinito que parece estar progredindo.",
    },
    {
      kind: "quiz",
      question:
        "Um cliente pagina até receber uma página vazia. O que quebra?",
      options: [
        "Ele faz um round trip desperdiçado a cada caminhada, e quebra no momento em que uma página vier curta por qualquer outro motivo — um contrato correto sinaliza terminação com um next_cursor ausente",
        "Nada — uma página vazia é o sinal padrão de terminação para paginação por cursor",
        "Ele conta a última página em dobro, porque a resposta vazia ainda carrega um cursor",
      ],
      answer: 0,
      explain:
        "Páginas vêm curtas por motivos que não são o fim: um filtro aplicado depois do limit, uma linha que o chamador não está autorizado a ver, um registro com soft delete. Um cliente que trata curta-mas-não-vazia como 'continue' está bem; um que trata isso como o fim, não — e é por isso que o cursor, não o comprimento da página, é o sinal.",
    },
    {
      kind: "editor",
      intro: `### Prove que OFFSET perde uma linha

1. \`page_by_offset\` → \`skip(offset).take(limit)\`, contando do começo da tabela que lhe for entregue.
2. \`page_by_cursor\` → ids estritamente maiores que o cursor (todos eles quando \`after\` é \`None\`), \`take(limit)\`, devolvendo a página mais o seu próximo cursor: o **último** id da página quando \`page.len() == limit\`, e \`None\` quando a página veio curta.
3. \`missed\` → as linhas sobreviventes que nunca apareceram em página nenhuma.

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

A linha 4 ainda está na tabela e não apareceu em nenhuma página. Esse é o bug, com nome.`,
    },
  ],
};
