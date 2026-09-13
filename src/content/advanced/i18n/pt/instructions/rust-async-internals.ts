// PT · editor instructions — Async From First Principles.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-async-internals.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustAsyncInternalsInstructionsPt: Record<string, { instructions: string }> = {
  "rust-async-internals-1": {
    instructions: `## Implemente Future à mão

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` pergunta "você já terminou?" e responde \`Ready(v)\` ou \`Pending\`. Nada executa um future sozinho.

### Sua tarefa

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

Não há executor neste programa. O executor é você.

### Dicas

- \`use std::task::{Context, Poll, Waker};\`
- \`Countdown::poll\` precisa de \`mut self: Pin<&mut Self>\` para decrementar.
- \`Pin::new(&mut f).poll(&mut cx)\` faz poll num future que não se moveu.
`,
  },

  "rust-async-internals-2": {
    instructions: `## Prove que nada roda sozinho

Chamar um \`async fn\` **não roda nada** do corpo dele — ele constrói uma máquina de estados parada no estado zero. O corpo só roda quando algo faz poll.

Isso é o oposto de uma promise de JavaScript, e é por isso que \`Future\` é \`#[must_use]\`: um future dropado sem await significa que o trabalho nunca aconteceu.

### Sua tarefa

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
\`\`\`

### Dicas

- Um bloco \`async\` não é \`Unpin\`, então precisa de \`Box::pin\`, não de \`Pin::new\`.
- Faça poll no future em box com \`fut.as_mut().poll(&mut cx)\`.
`,
  },

  "rust-async-internals-3": {
    instructions: `## Escreva um block_on de verdade

Um executor é um laço: faz poll e, em \`Pending\`, espera até ser acordado. O \`Waker\` é como um future diz "me faça poll de novo".

\`Waker\` é uma vtable construída à mão sobre um \`*const ()\` apagado — aqui, um \`Arc<Signal>\` vazado para ponteiro cru. O \`clone\` precisa incrementar o refcount e o \`drop\` precisa decrementar; é o único lugar de async Rust que genuinamente precisa de \`unsafe\`.

### Sua tarefa

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` com \`new() -> Arc<Signal>\`, \`wait(&self)\` (dorme até a flag ser setada, depois limpa) e \`notify(&self)\`.
2. Um \`static VTABLE: RawWakerVTable\` com quatro \`unsafe fn\`: \`clone\` incrementa a contagem, \`wake\` notifica e consome, \`wake_by_ref\` notifica sem consumir, \`drop\` decrementa.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` via \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, monte o contexto, e faça o laço: \`Ready\` retorna, \`Pending\` chama \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` cedendo três vezes e depois \`Ready(7)\`; \`async fn work() -> u32\` aguardando e somando 1.
6. Rode \`block_on(async { 5u32 })\` e \`block_on(work())\`.

Saída esperada:

\`\`\`text
simple: 5
yielding: 8
\`\`\`

É o exercício mais longo do caminho, e o que faz todo runtime posterior parecer código comum.

### Dicas

- \`Arc::into_raw\` / \`Arc::from_raw\` são o par vaza-e-reconstrói; use \`std::mem::forget\` quando não puder consumir o \`Arc\` reconstruído.
- \`Yield\` precisa chamar \`cx.waker().wake_by_ref()\` antes de devolver \`Pending\`, ou \`wait()\` dorme para sempre.
- \`Condvar::wait\` devolve o guard de volta para você: \`ready = self.cv.wait(ready).unwrap();\`
`,
  },

  "rust-async-internals-4": {
    instructions: `## Cooperativo, e o que acontece quando você não é

Uma task roda até devolver \`Pending\`. Nada a preempta. Então um \`poll\` que calcula por 200ms segura a thread do runtime por 200ms, e toda outra task naquela thread espera.

A parte confusa em produção: a latência sobe nos *outros* endpoints que compartilham aquela thread, então o trace lento aponta para código inocente.

### Sua tarefa

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` implementando \`Future<Output = ()>\`: registre \`"<name>:<left>"\`; se \`left\` for zero devolva \`Ready\`, senão decremente, acorde, e devolva \`Pending\`.
2. \`struct Hog { name: &'static str, log: Rc<RefCell<Vec<String>>> }\` cujo único \`poll\` registra três entradas (\`"<name>:0"\`, \`"<name>:1"\`, \`"<name>:2"\`) e devolve \`Ready\`.
3. Faça poll em duas \`Task\`s (\`a\` e \`b\`, ambas \`left: 2\`) alternadamente até as duas terminarem, e imprima o log.
4. Com um log novo, faça poll num \`Hog\` chamado \`hog\` até o fim, depois numa \`Task\` chamada \`starved\` (\`left: 1\`), e imprima esse log.

Saída esperada:

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

O primeiro log intercala. O segundo não.

### Dicas

- \`Poll::is_ready()\` é prático para o laço alternado.
- \`{:?}\` em \`log.borrow()\` imprime o \`Vec\` interno.
`,
  },

  "rust-async-internals-5": {
    instructions: `## Veja um cancelamento limpar a bagunça

Não existe \`cancel()\`. **Cancelar é dropar o future** — a máquina de estados é destruída onde quer que estivesse suspensa, e toda variável local que ela segurava é dropada na ordem de sempre.

Duas consequências: um future pode ser dropado em qualquer \`.await\`, então uma operação feita pela metade fica pela metade; e \`Drop\` não pode fazer \`.await\`, então a limpeza precisa ser síncrona.

### Sua tarefa

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` empurrando \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` cujo \`poll\` empurra \`"poll <id>"\`, acorda, e devolve \`Pending\` — para sempre.
4. Em \`main\`: dentro de um bloco, crie a request \`1\`, faça poll **duas vezes**, e deixe o bloco terminar — esse é o cancelamento. Empurre um marcador \`"---"\`. Depois crie a request \`2\`, faça poll uma vez, e faça \`drop\` explícito.
5. Imprima o log.

Saída esperada:

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Nenhuma das duas requests devolveu \`Ready\`. As duas limparam a bagunça mesmo assim.

### Dicas

- \`Poll\` é \`#[must_use]\`; ligue o resultado com \`let _ = ...\` para descartá-lo.
`,
  },

  "rust-async-internals-6": {
    instructions: `## Corra dois futures um contra o outro

Um timeout não é um sinal e não é uma thread — é um future que faz poll em duas coisas e devolve a que terminar primeiro. Isso é o \`select!\`, e **o perdedor é dropado**, que é exatamente um cancelamento.

### Sua tarefa

1. \`struct Ticks { label: &'static str, left: u32 }\` implementando \`Future<Output = &'static str>\`: em zero devolva \`Ready(self.label)\`, senão decremente, acorde, devolva \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` com os dois sendo \`Future<Output = &'static str> + Unpin\` — faça um laço fazendo poll em \`a\` e depois \`b\`, devolvendo o primeiro \`Ready\`.
3. Corra \`work\` (\`left: 2\`) contra \`timeout\` (\`left: 5\`), depois \`work\` (\`left: 9\`) contra \`timeout\` (\`left: 3\`).

Saída esperada:

\`\`\`text
work
timeout
\`\`\`

Em cada caso o perdedor é dropado no \`return\`.

### Dicas

- \`if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) { return v; }\`
- O bound \`Unpin\` é o que deixa \`race\` usar \`Pin::new\` em vez de box.
`,
  },

  "rust-async-internals-7": {
    instructions: `## Um mini runtime com spawn

Tudo que o Tokio oferece é um nome para algo que você já construiu: \`block_on\` é o seu laço, \`tokio::spawn\` é empurrar numa fila, \`select!\` é a sua \`race\`, \`timeout\` é uma corrida contra um timer.

O que o Tokio genuinamente acrescenta é um reactor epoll/kqueue, um escalonador com work stealing e uma timer wheel.

### Sua tarefa

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` com \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` empurrando \`Box::pin(f)\`, e \`run(&mut self)\` que tira da fila, faz poll, registra \`Ready\` e recoloca \`Pending\`.
3. \`struct Delayed { label: &'static str, left: u32 }\` cedendo \`left\` vezes antes de devolver o label.
4. Spawne \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` e \`async { "immediate" }\`, rode, e imprima a ordem de conclusão.

Saída esperada:

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

A ordem de conclusão é por *prontidão*, não por ordem de spawn. Este runtime recoloca na fila incondicionalmente e portanto ignora o waker por completo — que é a única coisa que o separa de um de verdade.

### Dicas

- \`use std::collections::VecDeque;\`
- \`while let Some(mut task) = self.queue.pop_front()\` conduz o laço.
`,
  },
};
