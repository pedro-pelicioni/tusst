import type { LessonStep } from "@/content/steps";

// PT · Async a partir dos primeiros princípios.

export const rustAsyncInternalsStepsPt: Record<string, LessonStep[]> = {
  "rust-async-internals-1": [
    {
      kind: "theory",
      body: `Um \`Future\` é uma struct com um método. É a abstração inteira:

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` é uma pergunta: *"você já terminou?"* A resposta é \`Poll::Ready(valor)\` ou \`Poll::Pending\`.

Não há thread aqui, nem escalonador, nem mágica. Um future é uma máquina de estados que outra pessoa precisa chamar repetidamente.`,
    },
    {
      kind: "theory",
      body: `Duas peças da assinatura para nomear agora, e assim pararem de ser ruído.

**\`Pin<&mut Self>\`.** Um bloco \`async\` compila numa máquina de estados que pode guardar referências *para dentro de si mesma* — um borrow atravessando um \`.await\` vira uma struct auto-referencial. Mover um valor desses invalidaria esses ponteiros, então \`Pin\` é a promessa de que ele não vai se mover. Para um future escrito à mão sem auto-referências, \`Pin::new(&mut f)\` é de graça e sem drama.

**\`Context\`.** Hoje ele carrega exatamente uma coisa: o \`Waker\`. Quando um future devolve \`Pending\`, ele é responsável por providenciar que o waker seja chamado assim que houver progresso possível — é isso que impede o executor de girar em falso. A lição três constrói um.

A regra que sai só da assinatura: **\`poll\` nunca pode bloquear.** Ele precisa devolver \`Pending\` rápido e ser polled de novo depois, ou todo outro future compartilhando a thread para.`,
    },
    {
      kind: "quiz",
      question: "O que é um `Future`, mecanicamente?",
      options: [
        "Uma máquina de estados com um método `poll` que devolve `Ready(v)` ou `Pending` — nada o executa sozinho",
        "Um handle para uma thread que o runtime iniciou quando o future foi criado",
        "Um callback registrado no event loop do sistema operacional",
      ],
      answer: 0,
      explain:
        "Os futures de Rust são *baseados em poll*, diferente das promises de JavaScript, que são baseadas em push e começam a rodar na hora. Quase toda surpresa sobre async Rust decorre dessa única diferença.",
    },
    {
      kind: "fill",
      prompt: "Informe que o future terminou, carregando o valor.",
      file: "main.rs",
      before: "fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {\n    Poll::",
      after: "(self.0)\n}",
      choices: ["Ready", "Pending", "Done"],
      answer: 0,
      explain:
        "`Poll` tem exatamente duas variantes: `Ready(T)` e `Pending`. `Pending` não carrega nada — ainda não existe valor.",
    },
    {
      kind: "quiz",
      question: "Por que `poll` recebe `Pin<&mut Self>` em vez de `&mut self`?",
      options: [
        "Um bloco `async` pode guardar referências para o próprio estado, e movê-lo as invalidaria — `Pin` promete que ele não vai se mover",
        "`Pin` é um lock que impede duas threads de fazer poll ao mesmo tempo",
        "Ele mantém o future vivo até o runtime dropá-lo",
      ],
      answer: 0,
      explain:
        "É para isso que `Pin` existe. Para um future escrito à mão sem auto-referências, `Pin::new(&mut f)` não custa nada — você encontra `Pin` por causa do que o `async fn` gera.",
    },
    {
      kind: "editor",
      intro: `### Implemente Future à mão

1. \`struct Immediate(u32)\` implementando \`Future<Output = u32>\`, devolvendo \`Poll::Ready(self.0)\` de imediato.
2. \`struct Countdown { left: u32 }\` implementando \`Future<Output = u32>\`: enquanto \`left > 0\`, decremente e devolva \`Pending\`; em zero, devolva \`Ready(0)\`.
3. Em \`main\`, monte um \`Context\` a partir de \`Waker::noop()\` e faça poll em cada future à mão — \`Immediate\` uma vez, \`Countdown\` três vezes — imprimindo cada \`Poll\` com \`{:?}\`.

Saída esperada:

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

Não há executor neste programa. O executor é você.`,
    },
  ],

  "rust-async-internals-2": [
    {
      kind: "theory",
      body: `Chamar um \`async fn\` **não roda nada do corpo dele**. Ele constrói uma máquina de estados e te entrega, parada no estado zero:

\`\`\`rust
let fut = build();          // nada aconteceu
\`\`\`

O corpo só roda quando algo faz poll. Isso é o oposto de uma promise de JavaScript, que começa a executar no momento em que é criada.

É por isso que um future não aguardado é um aviso: \`Future\` é \`#[must_use]\`, e dropá-lo em silêncio significa que o trabalho que você pediu nunca aconteceu.`,
    },
    {
      kind: "theory",
      body: `A laziness é uma feature, e três comportamentos reais decorrem dela.

**Cancelamento é de graça.** Solte o future e o trabalho simplesmente não acontece. O runtime não precisa interromper nada — a lição depois da próxima cobre o que isso significa para limpeza.

**Composição é de graça.** \`select!\` pode montar cinco futures e fazer poll até um terminar, e depois soltar o resto. Se criá-los já os tivesse iniciado, isso seriam quatro operações desperdiçadas em vez de zero.

**Timeouts embrulham em vez de interromper.** \`timeout(d, fut)\` é só mais um future fazendo poll no interno até o prazo. Não há thread para matar.

O custo da laziness é o modo de falha: esqueça o \`.await\` e nada roda, nenhum erro aparece, e o aviso \`unused_must_use\` do compilador é a única coisa entre você e uma tarde muito confusa.`,
    },
    {
      kind: "quiz",
      question:
        "Escreve-se `let fut = fetch_data();` e esquece-se o `.await`. O que acontece?",
      options: [
        "Nada roda — o future é dropado sem poll, e só o aviso de `must_use` dá pista disso",
        "A requisição roda em background e o resultado é descartado",
        "É erro de compilação, já que futures precisam ser aguardados",
      ],
      answer: 0,
      explain:
        "'A requisição roda em background' é o que uma promise de JavaScript faz, e carregar essa intuição para Rust é o erro mais comum em async.",
    },
    {
      kind: "fill",
      prompt: "Fixe a máquina de estados de um bloco async para poder fazer poll à mão.",
      file: "main.rs",
      before: "let mut fut = ",
      after: "(build());",
      choices: ["Box::pin", "Box::new", "Pin::new"],
      answer: 0,
      explain:
        "`Pin::new` exige que o valor seja `Unpin`, o que um bloco `async` não é. `Box::pin` aloca e fixa num passo — exatamente o que o `.await` faz por você por baixo.",
    },
    {
      kind: "quiz",
      question: "Por que a laziness torna o cancelamento barato?",
      options: [
        "Trabalho que não rodou não precisa de interrupção — soltar o future é o cancelamento",
        "O runtime mantém um log de desfazer para cada future",
        "Futures cancelados recebem mais um poll para desenrolarem com elegância",
      ],
      answer: 0,
      explain:
        "Isso também explica por que o cancelamento não pode ser *async*: dropar é síncrono, então qualquer limpeza que precise aguardar tem de ser arranjada de outro jeito.",
    },
    {
      kind: "editor",
      intro: `### Prove que nada roda sozinho

1. \`struct Effect { ran: bool }\` implementando \`Future<Output = &'static str>\`: o \`poll\` seta \`ran = true\` e devolve \`Ready("side effect happened")\`.
2. \`async fn build() -> &'static str\` devolvendo \`"from an async fn"\`.
3. Em \`main\`: crie o \`Effect\` e imprima \`ran\` (false). Faça poll uma vez, imprima o \`Poll\` e o \`ran\` de novo (true). Depois chame \`build()\`, imprima que nada rodou, faça \`Box::pin\` e poll.

Saída esperada:

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\``,
    },
  ],

  "rust-async-internals-3": [
    {
      kind: "theory",
      body: `Um executor é um laço:

\`\`\`rust
loop {
    match future.as_mut().poll(&mut cx) {
        Poll::Ready(v) => return v,
        Poll::Pending  => /* espera até ser acordado */,
    }
}
\`\`\`

A única parte difícil é *"espera até ser acordado"*. Girar em falso funcionaria e queimaria um núcleo. Em vez disso o executor fornece um \`Waker\` no \`Context\` e então estaciona a thread — e o trabalho do future é chamar esse waker quando o progresso ficar possível.`,
    },
    {
      kind: "theory",
      body: `\`Waker\` é uma vtable construída à mão, porque ela é anterior ao \`dyn\` ser usável nessa posição:

\`\`\`rust
static VTABLE: RawWakerVTable =
    RawWakerVTable::new(clone_raw, wake_raw, wake_by_ref_raw, drop_raw);
\`\`\`

Quatro ponteiros de função sobre um \`*const ()\` apagado — sendo esse ponteiro um \`Arc\` que vazamos para ponteiro cru e reconstruímos em cada callback. O \`clone\` precisa incrementar a contagem, o \`drop\` precisa decrementar, e errar isso vaza ou libera duas vezes. É o único lugar de async Rust em que você genuinamente precisa de \`unsafe\`, e é por isso que todo projeto real usa um crate para isso.

A metade do estacionamento é um \`Mutex<bool>\` mais um \`Condvar\`: \`wait\` dorme até a flag ser setada, \`notify\` seta e acorda quem dorme. Escrever isso uma vez vale uma tarde — depois disso, \`block_on\` não é uma função misteriosa de um crate, são trinta linhas que você já escreveu.`,
    },
    {
      kind: "quiz",
      question: "Qual é o trabalho do `Waker`?",
      options: [
        "Deixar um future dizer ao executor 'me faça poll de novo' — sem ele o executor precisa girar em falso ou dormir para sempre",
        "Rodar o corpo do future numa thread de fundo",
        "Cancelar o future quando ele demora demais",
      ],
      answer: 0,
      explain:
        "É esse contrato que torna async eficiente: um future `Pending` não custa nada até algo acordá-lo, então dez mil conexões ociosas custam dez mil máquinas de estado estacionadas e zero CPU.",
    },
    {
      kind: "fill",
      prompt:
        "Fixe o future uma vez, na heap, para ele poder ser polled repetidamente no laço.",
      file: "main.rs",
      before: "let mut future = ",
      after: "(future);",
      choices: ["Box::pin", "Box::new", "Arc::new"],
      answer: 0,
      explain:
        "`block_on` aceita qualquer `F: Future`, incluindo um bloco async não-`Unpin`, então precisa fixá-lo. Box é o jeito mais simples; executores reais fixam na stack para evitar a alocação.",
    },
    {
      kind: "quiz",
      question:
        "Um future escrito à mão devolve `Pending` e nunca chama o waker. O que acontece num executor real?",
      options: [
        "Ele nunca é polled de novo — a task trava para sempre, sem erro e sem uso de CPU",
        "O executor faz poll de novo depois de um timeout padrão",
        "O runtime detecta o wake ausente e dá panic",
      ],
      answer: 0,
      explain:
        "É o bug clássico de future escrito à mão, e ele é invisível: a task simplesmente para. Nada te avisa, porque 'ainda não está pronto' e 'nunca vai ficar pronto' são idênticos de fora.",
    },
    {
      kind: "editor",
      intro: `### Escreva um block_on de verdade

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` com \`new() -> Arc<Signal>\`, \`wait(&self)\` (dorme até a flag ser setada, depois limpa) e \`notify(&self)\`.
2. Um \`static VTABLE: RawWakerVTable\` com quatro \`unsafe fn\` sobre um \`Arc<Signal>\` vazado para \`*const ()\`. \`clone\` incrementa a contagem, \`wake_by_ref\` notifica sem consumir, \`wake\` notifica e consome, \`drop\` decrementa.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` montando com \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, monte o contexto, e faça o laço: \`Ready\` retorna, \`Pending\` chama \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` cedendo três vezes e depois \`Ready(7)\`, e \`async fn work() -> u32\` aguardando e somando 1.
6. Rode \`block_on(async { 5u32 })\` e \`block_on(work())\`.

Saída esperada:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

É o exercício mais longo do caminho. Também é o que faz todo runtime posterior parecer código comum.`,
    },
  ],

  "rust-async-internals-4": [
    {
      kind: "theory",
      body: `A concorrência async é **cooperativa**. Uma task roda até devolver \`Pending\`, e só então outra task naquela thread pode rodar. Nada a preempta.

Então o modelo tem uma exigência: toda task precisa devolver \`Pending\` com regularidade. Uma task que calcula por 200ms dentro de um único \`poll\` segura a thread do runtime por 200ms, e toda outra task atribuída àquela thread espera — incluindo as cujos clientes estão dando timeout.`,
    },
    {
      kind: "theory",
      body: `O modo de falha tem nome — **bloquear o executor** — e três causas comuns:

- **I/O síncrono.** \`std::fs::read\`, um driver de banco bloqueante, \`std::thread::sleep\` dentro de um \`async fn\`.
- **Trabalho de CPU.** Hashing, compressão, um sort grande.
- **Um lock segurado atravessando um \`.await\`.** A task estaciona segurando o lock, e todo mundo fica na fila atrás de uma task que nem está rodando.

A correção é mover o trabalho para fora das threads async: \`tokio::task::spawn_blocking\` para I/O e chamadas bloqueantes curtas, um pool \`rayon\` dedicado para CPU pesada. A regra de bolso é que um poll deveria terminar em dezenas de microssegundos.

É também por isso que o sintoma é tão confuso. A latência sobe nos endpoints que compartilham a thread do runtime com o culpado, não no endpoint que está bloqueando — então o trace lento aponta para código inocente.`,
    },
    {
      kind: "quiz",
      question:
        "Um handler faz uma leitura síncrona de arquivo de 200ms dentro de um `async fn`. O que o operador vê?",
      options: [
        "A latência p99 sobe em *outros* endpoints que compartilham aquela thread do runtime — o handler culpado pode parecer bem",
        "Só aquele handler fica lento; o runtime isola as tasks umas das outras",
        "O runtime loga um aviso e move a task para um pool bloqueante",
      ],
      answer: 0,
      explain:
        "A pista falsa é o que torna isso caro de depurar. As métricas de task do Tokio (com `--cfg tokio_unstable`) e um histograma de duração de poll existem justamente para apontar o culpado real.",
    },
    {
      kind: "fill",
      prompt:
        "Devolva o controle ao executor para outras tasks conseguirem avançar.",
      file: "main.rs",
      before: "self.left -= 1;\ncx.waker().",
      after: "();\nPoll::Pending",
      choices: ["wake_by_ref", "wake", "clone"],
      answer: 0,
      explain:
        "`wake_by_ref` agenda outro poll sem consumir o waker, que é o que você quer quando o waker vive no `Context` que te entregaram.",
    },
    {
      kind: "quiz",
      question: "Onde uma computação de CPU de 500ms deveria rodar?",
      options: [
        "Num pool dedicado — `spawn_blocking` ou um pool `rayon` — nunca dentro de um poll numa thread worker async",
        "Dentro do `async fn`, já que o runtime vai preemptá-la depois de uma fatia",
        "Dividida em vários `async fn`, que o runtime intercala automaticamente",
      ],
      answer: 0,
      explain:
        "Não existe preempção com que contar. Dividir em vários `async fn` também não muda nada — sem um `.await` no meio, continua sendo um único poll ininterrupto.",
    },
    {
      kind: "editor",
      intro: `### Cooperativo, e o que acontece quando você não é

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` implementando \`Future<Output = ()>\`: registre \`"<name>:<left>"\`, e se \`left\` for zero devolva \`Ready\`, senão decremente, acorde, e devolva \`Pending\`.
2. \`struct Hog { name, log }\` cujo único \`poll\` registra três entradas e devolve \`Ready\` — todo o trabalho num turno só.
3. Faça poll em duas \`Task\`s (\`a\` e \`b\`, ambas \`left: 2\`) alternadamente até as duas terminarem, e imprima o log.
4. Com um log novo, faça poll num \`Hog\` até o fim, depois numa \`Task\` chamada \`starved\` (\`left: 1\`), e imprima esse log.

Saída esperada:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

O primeiro log intercala. O segundo não — o hog terminou tudo antes da outra task ter um único turno.`,
    },
  ],

  "rust-async-internals-5": [
    {
      kind: "theory",
      body: `Não existe \`cancel()\` em async Rust. **Cancelar é dropar o future.**

\`\`\`rust
{
    let mut req = Request { .. };
    poll(&mut req);          // começou
    poll(&mut req);          // ainda pendente
}                            // dropado aqui — cancelado
\`\`\`

A máquina de estados é destruída onde quer que estivesse suspensa. Toda variável local que ela segurava é dropada, na ordem de sempre. Esse é o mecanismo de limpeza inteiro.`,
    },
    {
      kind: "theory",
      body: `Duas consequências que decidem se um serviço está correto sob carga.

**Um future pode ser dropado em qualquer \`.await\`.** Quando um cliente desconecta ou um timeout dispara, a task para entre dois statements. Qualquer coisa feita pela metade fica pela metade — então uma operação de dois passos precisa ser idempotente, ou embrulhada de modo que uma nova tentativa possa repeti-la com segurança. Essa propriedade se chama **cancellation safety**, e a documentação das bibliotecas a declara explicitamente: \`tokio::sync::mpsc::Receiver::recv\` e \`AsyncReadExt::read\` são cancel-safe; \`read_exact\` não é, porque pode já ter movido bytes para o seu buffer quando é dropado.

**A limpeza precisa ser síncrona.** \`Drop\` não pode fazer \`.await\`, então um future não consegue aguardar um fechamento gracioso na saída. Os contornos padrão são fazer a limpeza sincronamente no \`Drop\`, ou entregar o trabalho a uma task solta que sobreviva à cancelada.

O formato prático: mantenha a região aguardada pequena, faça cada passo idempotente, e ponha o que precisa acontecer atrás de um guard de \`Drop\` em vez de depois do último \`.await\`.`,
    },
    {
      kind: "quiz",
      question: "Como uma task async em voo é cancelada em Rust?",
      options: [
        "O future dela é dropado — a máquina de estados é destruída onde estava suspensa, rodando o `Drop` de cada local",
        "O runtime manda um sinal de cancelamento que ela pode capturar e tratar",
        "Ela recebe um último poll com uma flag de cancelamento setada no `Context`",
      ],
      answer: 0,
      explain:
        "Como é um `Drop` comum, o cancelamento é síncrono e não pode ser aguardado. Esse único fato é a fonte de quase toda dificuldade de shutdown gracioso em async Rust.",
    },
    {
      kind: "fill",
      prompt:
        "Anexe uma limpeza que roda mesmo quando o future é cancelado no meio do voo.",
      file: "main.rs",
      before: "impl ",
      after: " for Request {\n    fn drop(&mut self) { /* release */ }\n}",
      choices: ["Drop", "Future", "Cancel"],
      answer: 0,
      explain:
        "`Drop` é o único gancho que roda no cancelamento. Código colocado depois do último `.await` não roda, porque a task nunca chega lá.",
    },
    {
      kind: "quiz",
      question:
        "Um handler debita uma conta, faz `.await` numa chamada de rede, e depois credita outra. O cliente desconecta durante o await. Qual é o estado?",
      options: [
        "Debitado e não creditado — o future foi dropado no meio do voo, e dinheiro sumiu",
        "Os dois passos revertem automaticamente quando o future cai",
        "O runtime termina o handler antes de honrar a desconexão",
      ],
      answer: 0,
      explain:
        "Isso é cancellation safety como bug de corretude, não como nota de estilo. A correção é uma transação, uma chave de idempotência, ou um guard de `Drop` que compensa — não torcer para o cliente ficar conectado.",
    },
    {
      kind: "editor",
      intro: `### Veja um cancelamento limpar a bagunça

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` empurrando \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` cujo \`poll\` empurra \`"poll <id>"\`, acorda, e devolve \`Pending\` para sempre.
4. Em \`main\`: dentro de um bloco, crie a request \`1\`, faça poll **duas vezes**, e deixe o bloco terminar — esse é o cancelamento. Empurre um marcador \`"---"\`. Depois crie a request \`2\`, faça poll uma vez, e faça \`drop\` explícito.
5. Imprima o log.

Saída esperada:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Nenhuma das duas requests devolveu \`Ready\`. As duas limparam a bagunça mesmo assim.`,
    },
  ],

  "rust-async-internals-6": [
    {
      kind: "theory",
      body: `Um timeout não é um sinal e não é uma thread. É um future que faz poll em duas coisas e devolve a que terminar primeiro:

\`\`\`rust
loop {
    if let Poll::Ready(v) = poll(&mut work)    { return v; }
    if let Poll::Ready(v) = poll(&mut deadline) { return v; }
}
\`\`\`

Isso é o \`select!\`, e \`timeout(d, fut)\` é o caso particular em que um dos lados é um timer. Nada é interrompido — **o perdedor é simplesmente dropado**, que pela lição anterior é exatamente o que é cancelar.`,
    },
    {
      kind: "theory",
      body: `Três coisas decorrem disso, e cada uma morde alguém eventualmente.

**Um ramo dropado é cancelado no meio do voo.** Se o ramo perdedor tinha feito metade de uma operação de dois passos, essa metade continua feita. Só ponha um future cancel-safe num ramo de \`select!\`, ou reestruture para o estado parcial não importar.

**A ordem de poll é uma questão de justiça.** Um \`select\` ingênuo que sempre faz poll no primeiro ramo primeiro mata de fome o segundo quando o primeiro costuma estar pronto. O \`tokio::select!\` aleatoriza a ordem dos ramos por padrão exatamente por isso — e deixa você desligar com \`biased;\` quando a prioridade é intencional.

**Toda chamada de saída precisa de um prazo.** Sem um, uma dependência travada vira a sua própria fila ilimitada: conexões se acumulam, a memória cresce, e a queda se propaga para quem chama você. Um timeout não é tratamento de erro, é como uma falha continua local.`,
    },
    {
      kind: "quiz",
      question: "O que acontece com o ramo perdedor de um `select!`?",
      options: [
        "Ele é dropado — cancelado onde estava suspenso, com qualquer trabalho parcial ficando como estava",
        "Ele continua rodando em background e o resultado é descartado",
        "Ele é polled até o fim primeiro, e depois ignorado",
      ],
      answer: 0,
      explain:
        "É por isso que a documentação do Tokio marca futures como cancel-safe ou não. Pôr um future não cancel-safe num ramo de `select!` é bug de corretude, não observação de performance.",
    },
    {
      kind: "fill",
      prompt: "Retorne assim que qualquer um dos lados terminar, sem esperar o outro.",
      file: "main.rs",
      before: "if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) {\n    ",
      after: " v;\n}",
      choices: ["return", "break", "continue"],
      answer: 0,
      explain:
        "Retornar na hora é o que dropa o outro future — o perdedor sai de escopo junto com a função. Esse drop *é* o cancelamento.",
    },
    {
      kind: "quiz",
      question: "Por que o `tokio::select!` aleatoriza qual ramo faz poll primeiro?",
      options: [
        "Para não matar de fome os ramos posteriores quando um anterior costuma estar pronto",
        "Para deixar a expansão da macro menor",
        "Para espalhar carga uniformemente entre as threads worker do runtime",
      ],
      answer: 0,
      explain:
        "Uma ordem fixa é uma ordem de prioridade, e prioridade não intencional é starvation. `biased;` volta à ordem determinística quando a prioridade é de propósito.",
    },
    {
      kind: "editor",
      intro: `### Corra dois futures um contra o outro

1. \`struct Ticks { label: &'static str, left: u32 }\` implementando \`Future<Output = &'static str>\`: em zero devolva \`Ready(self.label)\`, senão decremente, acorde, devolva \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` com os dois sendo \`Future<Output = &'static str> + Unpin\` — faça um laço fazendo poll em \`a\` e depois \`b\`, devolvendo o primeiro \`Ready\`.
3. Corra \`work\` (\`left: 2\`) contra \`timeout\` (\`left: 5\`), depois \`work\` (\`left: 9\`) contra \`timeout\` (\`left: 3\`).

Saída esperada:

\`\`\`text
work
timeout
\`\`\`

Em cada caso o perdedor é dropado no \`return\` — que é precisamente um cancelamento.`,
    },
  ],

  "rust-async-internals-7": [
    {
      kind: "theory",
      body: `Tudo que o Tokio oferece agora é um nome para algo que você já construiu.

| você escreveu | Tokio |
| --- | --- |
| o \`loop\` do \`block_on\` | \`#[tokio::main]\` / \`Runtime::block_on\` |
| empurrar um future numa fila | \`tokio::spawn\` |
| a própria entrada da fila | \`JoinHandle<T>\` |
| sua função \`race\` | \`tokio::select!\` |
| correr contra um contador | \`tokio::time::timeout\` |
| \`Signal\` + \`Condvar\` | o registro de wakers do reactor |
| "não bloqueie o poll" | \`tokio::task::spawn_blocking\` |

Não há um conceito a mais na lista. O que o Tokio acrescenta é escala e um reactor de I/O.`,
    },
    {
      kind: "theory",
      body: `As partes que genuinamente vale pegar da biblioteca em vez de escrever:

**Um reactor epoll/kqueue.** Seu \`Signal\` acordava numa condvar. Um runtime real registra um socket no SO e acorda exatamente a task cujo socket ficou legível. É isso que faz uma thread atender dez mil conexões.

**Um escalonador multithread com work stealing.** As tasks são distribuídas entre threads worker, e um worker ocioso rouba da fila de um ocupado. É daí que vem o bound \`Send + 'static\` do \`tokio::spawn\`: uma task pode migrar de thread em qualquer ponto de await.

**Uma timer wheel.** Sua race fazia poll num contador em laço apertado. O Tokio mantém uma única estrutura ordenada de timers e acorda cada task no prazo dela, então um milhão de timeouts pendentes custa quase nada.

Mantenha o modelo mental que você construiu. Quando uma task trava, a pergunta continua sendo *"quem deveria chamar o waker, e por que não chamou?"* — e agora você sabe o que isso significa.`,
    },
    {
      kind: "quiz",
      question:
        "Por que o `tokio::spawn` exige que o future seja `Send + 'static`?",
      options: [
        "O escalonador com work stealing pode mover a task entre threads worker, e ela pode sobreviver à função que a spawnou",
        "Toda task spawnada é serializada para ser enviada ao reactor",
        "`'static` garante que a task roda durante todo o tempo de vida do processo",
      ],
      answer: 0,
      explain:
        "`tokio::task::spawn_local` dispensa o `Send` justamente porque um `LocalSet` prende as tasks a uma thread — o bound é sobre migração, não sobre async.",
    },
    {
      kind: "fill",
      prompt:
        "Guarde futures heterogêneos numa fila só — a lista de tasks do mini-runtime.",
      file: "main.rs",
      before: "type Task = ",
      after: "<Box<dyn Future<Output = &'static str>>>;",
      choices: ["Pin", "Box", "Arc"],
      answer: 0,
      explain:
        "`Pin<Box<dyn Future>>` é o tipo canônico de task em box — `Box` pelo tamanho desconhecido, `Pin` porque `poll` exige. O tipo interno de task do Tokio é isso com mais contabilidade.",
    },
    {
      kind: "quiz",
      question:
        "Uma task em produção trava para sempre sem uso de CPU e sem erro. Qual é a primeira pergunta?",
      options: [
        "Quem deveria chamar o waker desta task, e por que não chamou?",
        "Que thread ela está bloqueando, e como preemptamos?",
        "Qual é o tamanho da stack dela, e ela estourou?",
      ],
      answer: 0,
      explain:
        "Zero de CPU descarta bloqueio — uma task bloqueada queima a thread dela. Uma task estacionada que nunca é acordada é silenciosa, e esse é exatamente o formato de um wake ausente.",
    },
    {
      kind: "editor",
      intro: `### Um mini runtime com spawn

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` com \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` empurrando \`Box::pin(f)\`, e \`run(&mut self)\` que tira da fila, faz poll, registra \`Ready\` e recoloca \`Pending\`.
3. \`struct Delayed { label: &'static str, left: u32 }\` cedendo \`left\` vezes antes de devolver o label.
4. Spawne \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` e \`async { "immediate" }\`, rode, e imprima a ordem de conclusão.

Saída esperada:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

A ordem de conclusão é por *prontidão*, não por ordem de spawn. Repare que este runtime recoloca na fila incondicionalmente e portanto ignora o waker por completo — que é a única coisa que o separa de um de verdade.`,
    },
  ],
};
