// PT · editor instructions — Threads, Send/Sync & Shared State.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-concurrency.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustConcurrencyInstructionsPt: Record<string, { instructions: string }> = {
  "rust-concurrency-1": {
    instructions: `## Espalhe e recolha

\`thread::spawn\` devolve um \`JoinHandle<T>\`; \`join()\` bloqueia e te entrega o valor de retorno da closure dentro de um \`Result\` — \`Err\` significa que aquela thread deu panic.

A closure precisa ser \`'static\`, então \`move\` é quase sempre obrigatório.

### Sua tarefa

1. Spawne quatro threads, uma por \`id\` em \`0..4u32\`, cada uma devolvendo \`id * id\`.
2. Colete os handles num \`Vec\`.
3. Dê join **na ordem de spawn** num \`Vec<u32>\`, imprima com \`{:?}\`, e depois imprima a soma.

Saída esperada:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

A ordem de execução não é determinística; dar join em ordem torna o resultado determinístico mesmo assim.

### Dicas

- \`use std::thread;\`
- \`results.iter().sum::<u32>()\` anota a soma inline.
`,
  },

  "rust-concurrency-2": {
    instructions: `## Prove as propriedades

**\`Send\`** — o valor pode ser *movido* para outra thread.
**\`Sync\`** — o valor pode ser *compartilhado por referência* entre threads (\`T: Sync\` ⟺ \`&T: Send\`).

As duas são auto traits: um tipo as ganha quando todos os campos dele as têm.

Os casos instrutivos: \`Rc\` não é nenhuma das duas (contagem não atômica). \`Cell\` é \`Send\` mas **não** \`Sync\` — mover a cell é tranquilo, compartilhar \`&Cell\` dá race no \`set\`.

### Sua tarefa

1. \`fn assert_send<T: Send>(_: &T) -> &'static str\` devolvendo \`"Send"\`, e \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` devolvendo \`"Sync"\`.
2. Mostre que \`Arc<u32>\` satisfaz as duas.
3. Crie um \`Rc<u32>\` com \`42\` e só imprima o valor — passá-lo para \`assert_send\` não compilaria, e essa é a lição.
4. Mostre que \`Cell<u32>\` satisfaz \`Send\`. **Não** chame \`assert_sync\` nela.

Saída esperada:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\`

### Dicas

- \`use std::rc::Rc;\`, \`use std::sync::Arc;\`, \`use std::cell::Cell;\`
- Os helpers nunca movem nada — o *bound* é o que força a prova.
`,
  },

  "rust-concurrency-3": {
    instructions: `## Compartilhe uma tabela com quatro workers

\`Arc<T>\` é \`Rc<T>\` com contagem de referências atômica, que é o que o torna \`Send + Sync\`. Sozinho ele dá acesso **compartilhado somente leitura** — mutação precisa de um \`Mutex\` ou \`RwLock\` interno.

O padrão idiomático é sombrear o binding dentro do laço: \`let table = Arc::clone(&table);\` antes da closure \`move\`.

### Sua tarefa

1. Monte um \`Arc<Vec<u64>>\` com \`(1..=1000).collect()\`; imprima \`Arc::strong_count\`.
2. Spawne quatro threads. Cada uma pega o próprio \`Arc::clone\` e soma uma fatia de 250 elementos com \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Dê join, somando as parciais, e imprima o total.
4. Imprima a contagem forte de novo — ela voltou a 1.

Saída esperada:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\`

### Dicas

- Anote o collect: \`let table: Arc<Vec<u64>> = Arc::new((1..=1000).collect());\`
- \`chunk\` é um \`usize\` vindo de \`0..4usize\`.
`,
  },

  "rust-concurrency-4": {
    instructions: `## Oito threads, um contador

\`Mutex<T>\` é **dono** do dado — não há como alcançar o valor sem travar. O guard faz deref para \`&mut T\` e libera no drop; não existe \`unlock()\`.

\`lock()\` devolve um \`Result\` por causa do **poisoning**: uma thread que dá panic segurando o lock o marca, e todo \`lock()\` posterior devolve \`Err\`.

Mantenha a seção crítica curta. \`Drop\` roda no fim do **escopo**, não no último uso.

### Sua tarefa

1. Monte um \`Arc<Mutex<u64>>\` começando em \`0\`.
2. Spawne oito threads. Cada uma pega o próprio \`Arc::clone\` e, mil vezes, trava e incrementa — o guard delimitado a uma única iteração.
3. Dê join nas oito, e imprima a contagem final e se o mutex está \`is_poisoned()\`.

Saída esperada:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

### Dicas

- \`use std::sync::{Arc, Mutex};\`
- \`*counter.lock().unwrap()\` lê o valor no fim.
`,
  },

  "rust-concurrency-5": {
    instructions: `## Muitos leitores, um escritor

\`RwLock<T>\` permite muitos guards \`read()\` concorrentes ou um único guard \`write()\` exclusivo.

**Não** é um upgrade de graça: custa mais por operação que \`Mutex\`, e só ganha quando as leituras dominam de verdade *e* são lentas o bastante para se sobrepor. Starvation do escritor é um risco real, e a política de justiça vem do SO, não da std.

O padrão é \`Mutex\`; mude para \`RwLock\` com um profile na mão.

### Sua tarefa

1. Monte um \`Arc<RwLock<Vec<u64>>>\` com \`vec![10, 20, 30]\`.
2. Spawne quatro threads leitoras, cada uma pegando \`read()\` e devolvendo \`.len()\`.
3. Dê join, somando os tamanhos devolvidos, e imprima o total.
4. Pegue \`write()\` e empurre \`40\`, e depois imprima o vetor por um \`read()\` novo.

Saída esperada:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\`

### Dicas

- \`use std::sync::{Arc, RwLock};\`
- \`*cache.read().unwrap()\` faz deref do guard para o \`{:?}\`.
`,
  },

  "rust-concurrency-6": {
    instructions: `## Ordene os locks

Um deadlock precisa de duas threads adquirindo dois locks em **ordens opostas**. Rust impede data races em tempo de compilação; ele não impede deadlocks, porque esperar para sempre é seguro em memória.

A correção é uma **ordem global de locks**: escolha uma ordenação total sobre os seus locks e adquira sempre nessa ordem, seja qual for a direção da operação em si.

### Sua tarefa

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — ordene as duas contas por \`id\`, trave a menor primeiro, e depois aplique débito e crédito nos lados certos.
3. Monte as contas \`1\` (saldo \`100\`) e \`2\` (saldo \`50\`) em \`Arc\`s.
4. Spawne 100 threads: 50 transferindo \`1\` de a para b, 50 transferindo \`1\` de b para a. Dê join em todas.
5. Imprima cada saldo e o total.

Saída esperada:

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Sem a ordenação, este programa dá deadlock. Com ela, o líquido é zero e o total se conserva.

### Dicas

- \`let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };\`
- Depois de travar, cheque \`from.id == first.id\` para saber qual guard debitar.
`,
  },

  "rust-concurrency-7": {
    instructions: `## Conte sem lock, eleja um vencedor

Um atomic é lido-modificado-escrito pelo hardware sem lock nenhum. \`compare_exchange\` só define o valor se ele for igual ao que você esperava agora — \`Ok(previous)\` se você ganhou, \`Err(actual)\` se perdeu.

\`Ordering\` não é um botão de velocidade; ele restringe como as operações de memória ao redor podem ser reordenadas:

- **\`Relaxed\`** — atômico só neste valor. Certo para um contador de estatística.
- **\`Release\`/\`Acquire\`** — publica o dado escrito antes de um store para quem fizer o load.
- **\`SeqCst\`** — uma única ordem total com que todas as threads concordam. O mais seguro, o mais lento.

### Sua tarefa

1. \`Arc<AtomicU64>\` em \`0\`. Spawne oito threads, cada uma fazendo \`fetch_add(1, Ordering::Relaxed)\` mil vezes. Dê join e imprima o valor com um load \`Acquire\`.
2. Um \`AtomicBool\` em \`false\`. Chame \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **duas vezes** e imprima cada resultado com \`{:?}\`.

Saída esperada:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — ganhamos, e o valor que substituímos era \`false\`. \`Err(true)\` — perdemos, e aqui está o que encontramos.

### Dicas

- \`use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};\`
`,
  },

  "rust-concurrency-8": {
    instructions: `## Junte tudo, depois sinta a backpressure

Um channel move **ownership** entre threads. \`mpsc\` é multi-produtor, consumidor único: clone o sender, mantenha um receiver.

O iterador do receiver só termina quando **todo** sender se foi — inclusive o original em \`main\`, e é por isso que \`drop(tx)\` não é opcional.

\`channel()\` é ilimitado: produtores nunca esperam, e um consumidor lento vira um kill por falta de memória. \`sync_channel(n)\` é limitado, e esse bloqueio **é** a backpressure.

### Sua tarefa

1. \`mpsc::channel::<u64>()\`. Spawne três produtores; o produtor \`id\` envia \`id * 10 + n\` para \`n\` em \`0..3\`. **Solte o sender original**, depois colete o receiver num \`Vec<u64>\`, ordene, e imprima o vetor e o tamanho.
2. \`mpsc::sync_channel::<u64>(1)\`. Envie um valor, imprima se um segundo \`try_send\` **falha**, depois faça \`recv()\` e imprima o que saiu.

Saída esperada:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Ordenar é o que torna o fan-in determinístico — a ordem de chegada não é.

### Dicas

- \`use std::sync::mpsc;\`
- \`rx.iter().collect()\` drena o channel até todo sender ter ido embora.
`,
  },
};
