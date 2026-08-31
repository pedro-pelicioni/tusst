import type { LessonStep } from "@/content/steps";

// PT · Threads, Send/Sync e estado compartilhado.

export const rustConcurrencyStepsPt: Record<string, LessonStep[]> = {
  "rust-concurrency-1": [
    {
      kind: "theory",
      body: `\`thread::spawn\` inicia uma thread de SO de verdade e devolve um \`JoinHandle<T>\`, onde \`T\` é o que a closure devolver.

\`\`\`rust
let h = thread::spawn(move || id * id);
let value = h.join().unwrap();
\`\`\`

\`join()\` bloqueia até aquela thread terminar e te dá o valor de retorno — embrulhado num \`Result\`, porque a thread pode ter dado **panic**. \`Err\` é o panic; o \`unwrap()\` aqui o propaga para a thread pai.`,
    },
    {
      kind: "theory",
      body: `Duas coisas sobre \`spawn\` moldam tudo que você escreve com ele.

**A closure precisa ser \`'static\`.** A thread pode sobreviver à função que a criou, então não pode emprestar as locais dessa função. \`move\` é quase sempre obrigatório, e é por isso que compartilhar dado significa \`Arc\`, e não \`&\`.

**Threads soltas são mortas na saída.** Se \`main\` retorna sem dar join, as threads pendentes são encerradas onde estiverem — sem unwinding, sem destrutores. Coletar os handles e dar join em todos não é organização, é como você sabe que o trabalho terminou.

\`\`\`rust
for h in handles { results.push(h.join().unwrap()); }
\`\`\`

Dar join na ordem de spawn torna os *resultados* determinísticos mesmo com a *execução* não sendo — que é o que torna uma computação paralela testável.`,
    },
    {
      kind: "quiz",
      question: "Por que `join()` devolve um `Result`?",
      options: [
        "A thread pode ter dado panic, e o `Err` carrega o payload do panic em vez de perdê-lo",
        "A thread pode ainda estar rodando, e `Err` significa 'não terminou'",
        "O `Result` informa se o SO conseguiu alocar uma thread",
      ],
      answer: 0,
      explain:
        "Um panic numa thread spawnada não aborta o processo por padrão — ele encerra aquela thread. Sem checar o `Result` você trataria em silêncio um worker que quebrou como um que não fez trabalho nenhum.",
    },
    {
      kind: "fill",
      prompt:
        "Dê à thread a posse do valor capturado, para ela não precisar emprestar uma local.",
      file: "main.rs",
      before: "handles.push(thread::spawn(",
      after: "|| id * id));",
      choices: ["move ", "", "&"],
      answer: 0,
      explain:
        "Sem `move` a closure empresta `id`, e o compilador rejeita: a thread pode sobreviver à iteração do laço que é dona dele.",
    },
    {
      kind: "quiz",
      question:
        "`main` spawna quatro workers e retorna sem dar join em nenhum. O que acontece com eles?",
      options: [
        "São mortos na saída do processo, no meio do trabalho, sem unwinding e sem destrutores rodando",
        "O processo espera toda thread antes de sair",
        "São promovidos a daemon threads e continuam rodando depois da saída",
      ],
      answer: 0,
      explain:
        "É uma fonte real de escritas perdidas e saída truncada. Dê join nos handles, ou segure algo que os workers sinalizem antes de você retornar.",
    },
    {
      kind: "editor",
      intro: `### Espalhe e recolha

1. Spawne quatro threads, uma por \`id\` em \`0..4u32\`, cada uma devolvendo \`id * id\`.
2. Empurre cada \`JoinHandle\` num \`Vec\`.
3. Dê join **na ordem de spawn** num \`Vec<u32>\`, imprima com \`{:?}\`, e depois imprima a soma.

Saída esperada:

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

A ordem de execução não é determinística; dar join em ordem torna o *resultado* determinístico mesmo assim.`,
    },
  ],

  "rust-concurrency-2": [
    {
      kind: "theory",
      body: `Duas marker traits carregam toda a segurança de threads de Rust. Nenhuma tem métodos — são afirmações que o compilador verifica e depois impõe.

**\`Send\`** — o valor pode ser **movido** para outra thread.
**\`Sync\`** — o valor pode ser **compartilhado** por referência entre threads. Formalmente: \`T\` é \`Sync\` se e somente se \`&T\` é \`Send\`.

São **auto traits**: um tipo ganha as duas automaticamente quando todos os campos dele têm. Você quase nunca as implementa à mão, e fazer isso exige \`unsafe\` porque você está fazendo uma promessa que o compilador não consegue verificar.`,
    },
    {
      kind: "theory",
      body: `Os casos instrutivos são os tipos que têm uma e não a outra.

**\`Rc<T>\`: nenhuma.** A contagem de referências é um inteiro comum com incrementos não atômicos. Duas threads clonando ao mesmo tempo iriam correr e liberar o valor cedo demais — um use-after-free. \`Arc<T>\` é o mesmo tipo com contador atômico, e tem as duas.

**\`Cell<T>\`: \`Send\` mas não \`Sync\`.** Mover uma \`Cell\` inteira para outra thread é ok — só uma thread a tem. *Compartilhar* \`&Cell\` não é: \`set\` é uma escrita comum, então duas threads escrevendo ao mesmo tempo correm. É o par que faz a distinção clicar.

**\`MutexGuard\`: \`Sync\` mas não \`Send\`.** Algumas plataformas exigem que a thread que travou um mutex seja a que destrava, então o guard não pode atravessar threads.

Todo o resto decorre: \`Mutex<T>\` é \`Sync\` quando \`T: Send\`, que é exatamente por que \`Arc<Mutex<T>>\` é o tipo de estado mutável compartilhado.`,
    },
    {
      kind: "quiz",
      question: "Por que `Cell<T>` é `Send` mas não `Sync`?",
      options: [
        "Mover a cell inteira é ok porque só uma thread a segura; compartilhar `&Cell` não é, porque `set` é uma escrita sem sincronização",
        "`Cell` contém um lock, e locks não podem ser compartilhados",
        "Ela é `Sync`; só `RefCell` não é",
      ],
      answer: 0,
      explain:
        "É a ilustração mais limpa da divisão. `Send` é sobre entregar o valor; `Sync` é sobre duas threads tocarem nele ao mesmo tempo.",
    },
    {
      kind: "fill",
      prompt:
        "Restrinja um helper para que ele só aceite valores que podem ser movidos para outra thread.",
      file: "main.rs",
      before: "fn assert_send<T: ",
      after: ">(_: &T) -> &'static str {",
      choices: ["Send", "Sync", "Copy"],
      answer: 0,
      explain:
        "O helper nunca move nada de fato — ele existe para que o *bound* obrigue o compilador a provar a propriedade. Chamá-lo com um `Rc` é erro de compilação, e essa é a demonstração.",
    },
    {
      kind: "quiz",
      question:
        "Você recebe 'the trait `Send` is not implemented for `Rc<Config>`' numa task spawnada. Qual a correção?",
      options: [
        "Usar `Arc<Config>` — o mesmo ownership compartilhado com contagem atômica",
        "Embrulhar o `Rc` num `Mutex`, que torna qualquer tipo `Send`",
        "Adicionar `unsafe impl Send for Rc<Config>`",
      ],
      answer: 0,
      explain:
        "`Mutex` não salva: `Mutex<T>` só é `Send`/`Sync` quando `T` é `Send`. E o `unsafe impl` compilaria e depois correria — o compilador estava certo.",
    },
    {
      kind: "editor",
      intro: `### Prove as propriedades

1. Escreva \`fn assert_send<T: Send>(_: &T) -> &'static str\` devolvendo \`"Send"\`, e \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` devolvendo \`"Sync"\`.
2. Mostre que \`Arc<u32>\` satisfaz as duas.
3. Crie um \`Rc<u32>\` e só imprima o valor — passá-lo para \`assert_send\` não compilaria, e essa é a lição.
4. Mostre que \`Cell<u32>\` satisfaz \`Send\`. (Ela não é \`Sync\`, então não chame \`assert_sync\` nela.)

Saída esperada:

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\``,
    },
  ],

  "rust-concurrency-3": [
    {
      kind: "theory",
      body: `\`Arc<T>\` é \`Rc<T>\` com contagem de referências **atômica**. Essa única diferença é o que o torna \`Send + Sync\` (quando \`T\` é), e é a forma padrão de entregar o mesmo dado a várias threads.

\`\`\`rust
let table = Arc::new(big_vec);
for chunk in 0..4 {
    let table = Arc::clone(&table);      // um incremento atômico
    thread::spawn(move || { /* lê table */ });
}
\`\`\`

O \`let table = Arc::clone(&table);\` que sombreia dentro do laço é o idioma: ele clona o handle para esta iteração, e a closure \`move\` leva esse clone em vez do binding externo.`,
    },
    {
      kind: "theory",
      body: `\`Arc<T>\` sozinho dá **acesso compartilhado somente leitura** — ele entrega \`&T\`, nunca \`&mut T\`. Para uma tabela de consulta grande, uma config, ou um mapa de rotas compilado, é exatamente o que você quer e não precisa de lock nenhum.

O custo é honesto mas pequeno: um incremento atômico no clone e um decremento atômico no drop, cada um sendo uma operação sincronizada sobre uma linha de cache que todas as threads compartilham. Clonar um \`Arc\` num laço interno apertado é mensurável; clonar uma vez por task não é.

Para **mutação**, combine: \`Arc<Mutex<T>>\` ou \`Arc<RwLock<T>>\`. O \`Arc\` fornece ownership compartilhado entre threads, o tipo interno fornece acesso sincronizado. São ortogonais, e confundir os dois é a fonte mais comum de "por que isso não compila" em Rust concorrente iniciante.`,
    },
    {
      kind: "quiz",
      question:
        "O que `Arc<T>` sozinho permite que várias threads façam com o valor?",
      options: [
        "Ler — ele entrega só `&T`. Mutar exige um `Mutex` ou `RwLock` interno",
        "Ler e escrever; a contagem atômica sincroniza o acesso",
        "Nada até ser travado; todo acesso a um `Arc` pega um lock",
      ],
      answer: 0,
      explain:
        "A contagem atômica protege a *contagem*, não os dados. `Arc` e `Mutex` resolvem dois problemas diferentes e são compostos por esse motivo.",
    },
    {
      kind: "fill",
      prompt: "Dê à thread desta iteração o próprio handle para a tabela compartilhada.",
      file: "main.rs",
      before: "let table = Arc::",
      after: "(&table);",
      choices: ["clone", "new", "get_mut"],
      answer: 0,
      explain:
        "`Arc::new` alocaria uma segunda tabela, sem relação com a primeira. `get_mut` devolve `Some` só quando a contagem é 1, o que nunca é o caso aqui.",
    },
    {
      kind: "quiz",
      question:
        "Depois de quatro workers darem join, `Arc::strong_count` volta a 1. Por quê?",
      options: [
        "O clone de cada thread foi dropado quando a closure dela terminou, decrementando a contagem de volta",
        "`join` reseta a contagem para 1",
        "A contagem nunca passou de 1; clones dividem um único slot de contador",
      ],
      answer: 0,
      explain:
        "É o `Drop` fazendo o trabalho dele através das fronteiras de thread: cada clone movido morre junto com a closure que era dona dele.",
    },
    {
      kind: "editor",
      intro: `### Compartilhe uma tabela com quatro workers

1. Monte um \`Arc<Vec<u64>>\` com \`(1..=1000).collect()\`, imprima \`Arc::strong_count\`.
2. Spawne quatro threads. Cada uma pega o próprio \`Arc::clone\` e soma uma fatia de 250 elementos: \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Dê join, somando as parciais, e imprima o total.
4. Imprima a contagem forte de novo — ela voltou a 1.

Saída esperada:

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\``,
    },
  ],

  "rust-concurrency-4": [
    {
      kind: "theory",
      body: `\`Mutex<T>\` é **dono** dos próprios dados. Não existe forma de alcançar o valor sem travar, então "esqueci de pegar o lock" não é um bug que você consiga escrever.

\`\`\`rust
let mut guard = counter.lock().unwrap();
*guard += 1;
\`\`\`

\`lock()\` devolve \`Result<MutexGuard<T>, PoisonError<_>>\`. O guard faz deref para \`&mut T\`, e **libera o lock quando é dropado**. Não existe \`unlock()\`.`,
    },
    {
      kind: "theory",
      body: `O \`Result\` é o **poisoning**. Se uma thread dá panic segurando o lock, o mutex é marcado como envenenado e todo \`lock()\` posterior devolve \`Err\` — os dados podem ter ficado atualizados pela metade, e o compilador te obriga a reconhecer isso. \`PoisonError::into_inner()\` te dá os dados mesmo assim se você decidir que é seguro.

A regra que importa em produção: **mantenha a seção crítica curta, e nunca segure um guard atravessando uma chamada lenta.**

\`\`\`rust
let value = { cache.lock().unwrap().get(&key).cloned() };   // liberado aqui
expensive_io(value);                                        // sem lock preso
\`\`\`

A armadilha é que \`Drop\` roda no fim do **escopo**, não no último uso. Um guard que você parou de ler ainda está segurando o lock — então delimite de propósito com um bloco, ou tire o valor para fora e derrube o guard.`,
    },
    {
      kind: "quiz",
      question: "O que significa um `Mutex` envenenado?",
      options: [
        "Uma thread deu panic segurando o lock, então os dados podem estar atualizados pela metade e todo `lock()` posterior devolve `Err`",
        "Duas threads deram deadlock e o runtime quebrou o ciclo",
        "O lock ficou preso mais tempo que um timeout embutido",
      ],
      answer: 0,
      explain:
        "É um sinal de corretude, não de liveness. `into_inner()` te deixa pegar os dados assim que você decidir que a invariante sobreviveu.",
    },
    {
      kind: "fill",
      prompt: "Libere o lock assim que o valor sair.",
      file: "main.rs",
      before: "let value = { cache.lock().unwrap().get(&key).",
      after: "() };",
      choices: ["cloned", "as_ref", "unwrap"],
      answer: 0,
      explain:
        "`cloned()` copia o valor para fora para o guard poder morrer na chave que fecha. Devolver uma referência manteria o guard vivo para satisfazer o borrow.",
    },
    {
      kind: "quiz",
      question:
        "Um handler trava um cache, faz uma chamada HTTP e depois escreve o resultado — tudo num escopo só. Qual o sintoma sob carga?",
      options: [
        "A vazão desaba para uma requisição por vez: toda outra thread espera atrás da chamada de rede",
        "O mutex envenena porque a chamada demora demais",
        "Nada — o guard é liberado no último uso, antes da chamada",
      ],
      answer: 0,
      explain:
        "A última alternativa é exatamente o equívoco que coloca esse bug em produção. NLL encerra *borrows* no último uso; `Drop` roda no fim do *escopo*, e o lock fica preso nas duas chamadas.",
    },
    {
      kind: "editor",
      intro: `### Oito threads, um contador

1. Monte um \`Arc<Mutex<u64>>\` começando em \`0\`.
2. Spawne oito threads. Cada uma pega o próprio \`Arc::clone\` e, mil vezes, trava e incrementa — o guard delimitado a uma única iteração.
3. Dê join nas oito, e imprima a contagem final e se o mutex está \`is_poisoned()\`.

Saída esperada:

\`\`\`text
count: 8000
poisoned: false
\`\`\`

Oito mil incrementos sem escrita perdida — isso é o mutex, não sorte.`,
    },
  ],

  "rust-concurrency-5": [
    {
      kind: "theory",
      body: `\`RwLock<T>\` divide o lock em dois:

- \`read()\` — **muitos** leitores ao mesmo tempo
- \`write()\` — **um** escritor, excluindo todos os leitores

\`\`\`rust
let len = cache.read().unwrap().len();     // concorrente com outros leitores
cache.write().unwrap().push(40);           // exclusivo
\`\`\`

A API é no resto idêntica à do \`Mutex\`: guards, poisoning, liberação no drop.`,
    },
    {
      kind: "theory",
      body: `\`RwLock\` não é um upgrade de graça, e apelar para ele por padrão é um erro comum.

**Ele é mais lento que \`Mutex\` por operação.** Ele rastreia uma contagem de leitores além da flag de escrita, então um \`read()\` sem contenção custa mais que um \`lock()\` sem contenção.

**Ele só ganha quando as leituras genuinamente dominam e são lentas o bastante para se sobrepor.** Uma leitura que copia um inteiro termina antes de a segunda thread chegar; você pagou por uma concorrência que nunca usou. Uma leitura que percorre uma estrutura grande enquanto oito threads fazem o mesmo é onde compensa.

**Starvation de escritor é risco real.** Com uma implementação que prefere leitores e um fluxo contínuo deles, um escritor pode esperar indefinidamente. O \`RwLock\` da std prefere escritores nas plataformas principais, então um escritor esperando bloqueia leitores novos em vez de ficar na fila para sempre — mas a política é detalhe de implementação, não garantia documentada, então não construa em cima dela.

Use \`Mutex\` por padrão. Migre para \`RwLock\` quando um profile mostrar contenção de leitura, não quando a carga apenas *soar* como muita leitura.`,
    },
    {
      kind: "quiz",
      question:
        "Uma carga é descrita como 'quase só leitura', então trocam `Mutex` por `RwLock` e nada fica mais rápido. Por quê?",
      options: [
        "As leituras são curtas demais para se sobrepor — cada uma termina antes de a próxima thread chegar, então só o custo maior por operação foi pago",
        "`RwLock` serializa leituras a não ser que sejam explicitamente agrupadas",
        "As leituras precisam ser marcadas `#[inline]` para rodarem concorrentemente",
      ],
      answer: 0,
      explain:
        "Concorrência só ajuda quando as operações realmente se sobrepõem no tempo. Para uma leitura que termina em nanossegundos, a contabilidade extra é a única coisa que você comprou.",
    },
    {
      kind: "fill",
      prompt: "Pegue um lock compartilhado para vários leitores avançarem juntos.",
      file: "main.rs",
      before: "cache.",
      after: "().unwrap().len()",
      choices: ["read", "write", "lock"],
      answer: 0,
      explain:
        "`write()` excluiria os outros leitores e os serializaria — exatamente o que o `RwLock` existe para evitar.",
    },
    {
      kind: "quiz",
      question: "O que é starvation de escritor, e quem decide se acontece?",
      options: [
        "Um escritor esperando indefinidamente atrás de um fluxo contínuo de leitores — e a política de justiça vem da primitiva do SO, não da std",
        "Um escritor sendo envenenado pelo panic de um leitor; a std escolhe a política",
        "Um escritor perdendo os dados enquanto leitores seguram o lock; o compilador impede",
      ],
      answer: 0,
      explain:
        "Como a std delega à plataforma, o mesmo código pode se comportar diferente no Linux e no macOS. É um bom motivo para não depender da política.",
    },
    {
      kind: "editor",
      intro: `### Muitos leitores, um escritor

1. Monte um \`Arc<RwLock<Vec<u64>>>\` com \`vec![10, 20, 30]\`.
2. Spawne quatro threads leitoras, cada uma pegando \`read()\` e devolvendo \`.len()\`.
3. Dê join, somando os tamanhos devolvidos, e imprima o total.
4. Pegue \`write()\` e empurre \`40\`, e depois imprima o vetor por um \`read()\` novo.

Saída esperada:

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\``,
    },
  ],

  "rust-concurrency-6": [
    {
      kind: "theory",
      body: `Um deadlock precisa de duas threads e dois locks adquiridos em **ordens opostas**:

\`\`\`text
thread 1: trava A ─── quer B
thread 2: trava B ─── quer A
\`\`\`

Nenhuma avança e nenhuma dá timeout. Rust impede data races em tempo de compilação; ele **não** impede deadlocks, porque um deadlock não é unsoundness — é um bug de liveness, e o sistema de tipos não tem nada a dizer sobre isso.

Uma função de transferência é a forma canônica de escrever um sem querer: \`transfer(a, b)\` e \`transfer(b, a)\` rodando ao mesmo tempo adquirem em ordens opostas.`,
    },
    {
      kind: "theory",
      body: `A correção é uma **ordem global de locks**: escolha uma ordenação total sobre seus locks e adquira sempre nessa ordem, independentemente da direção da operação.

\`\`\`rust
let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };
let g1 = first.balance.lock().unwrap();
let g2 = second.balance.lock().unwrap();
\`\`\`

Agora toda thread adquire o menor id primeiro, então o ciclo não pode se formar. Qualquer chave estável serve — um id, um índice, até o endereço do ponteiro.

Duas táticas de apoio. **Segure um lock por vez** onde o algoritmo permitir, já que um único lock não dá deadlock consigo mesmo. E **\`try_lock\` com back-off** transforma um deadlock potencial numa nova tentativa — útil como rede de segurança, mas substituto ruim de uma ordenação, já que pode virar livelock.`,
    },
    {
      kind: "quiz",
      question:
        "Por que o sistema de tipos de Rust impede data races mas não deadlocks?",
      options: [
        "Um deadlock é bug de liveness, não unsoundness — nada é corrompido, o programa simplesmente para",
        "Deadlocks são impedidos, mas só em builds de release",
        "O borrow checker os impediria se `Mutex` fosse usado sem `Arc`",
      ],
      answer: 0,
      explain:
        "`Send`/`Sync` e as regras de borrow tornam impossível *observar dado rasgado*. Esperar para sempre é perfeitamente seguro em memória, e nenhuma análise estática da linguagem tenta pegar isso.",
    },
    {
      kind: "fill",
      prompt:
        "Imponha uma ordem global para que duas transferências opostas não formem ciclo.",
      file: "main.rs",
      before: "let (first, second) = if from.id ",
      after: " to.id { (from, to) } else { (to, from) };",
      choices: ["<", "==", "!="],
      answer: 0,
      explain:
        "Qualquer ordem total serve; o que importa é toda thread aplicar a *mesma*. Comparar por igualdade ou desigualdade não dá ordenação nenhuma.",
    },
    {
      kind: "quiz",
      question:
        "Por que `try_lock` com retry é uma resposta mais fraca que uma ordem global de locks?",
      options: [
        "Pode virar livelock — threads pegando e soltando repetidamente sem progresso — onde uma ordenação torna o ciclo impossível",
        "`try_lock` é unsafe e exige um bloco `unsafe`",
        "`try_lock` envenena o mutex quando falha",
      ],
      answer: 0,
      explain:
        "Retry é uma rede de segurança razoável, especialmente com back-off aleatorizado. Como estratégia principal, ele converte um travamento que você consegue depurar num spin que você não consegue.",
    },
    {
      kind: "editor",
      intro: `### Ordene os locks

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

Sem a ordenação, este programa dá deadlock. Com ela, o líquido é zero e o total se conserva.`,
    },
  ],

  "rust-concurrency-7": [
    {
      kind: "theory",
      body: `Um atomic é um único valor que o hardware consegue ler-modificar-escrever sem lock. Para um contador, é dramaticamente mais barato que \`Mutex<u64>\`:

\`\`\`rust
hits.fetch_add(1, Ordering::Relaxed);
\`\`\`

\`compare_exchange\` é a primitiva da qual tudo o mais é construído — escreva o valor **só se** ele for igual ao que você esperava:

\`\`\`rust
claimed.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
// Ok(false)  — ganhamos, era false e agora é true
// Err(true)  — outra pessoa ganhou; o valor é o que encontramos
\`\`\`

É assim que você elege exatamente um vencedor entre N threads sem lock nenhum.`,
    },
    {
      kind: "theory",
      body: `O argumento \`Ordering\` não é um botão de performance — ele restringe como as operações de memória ao redor podem ser reordenadas pelo compilador e pela CPU.

- **\`Relaxed\`** — atômico só sobre este valor. Nenhuma garantia de ordem sobre qualquer outra coisa. Correto para um contador de estatística que ninguém lê para tomar decisão.
- **\`Release\`** num store — tudo escrito antes dele fica visível para uma thread que depois fizer um load \`Acquire\` desse valor.
- **\`Acquire\`** num load — tudo que a thread que fez o release escreveu antes do store dela agora está visível para você.
- **\`AcqRel\`** — os dois, para um read-modify-write.
- **\`SeqCst\`** — além disso, uma ordem total única com que todas as threads concordam. A mais segura e a mais lenta.

A regra honesta: **\`Relaxed\` para contadores, \`Acquire\`/\`Release\` para publicar dado, \`SeqCst\` quando você não tem certeza.** Apelar para \`Relaxed\` para deixar uma flag "mais rápida" é como se envia um bug que só aparece em ARM, só sob carga, uma vez por semana.`,
    },
    {
      kind: "quiz",
      question:
        "Um worker escreve um buffer e depois seta uma flag `ready`; um leitor faz spin na flag e depois lê o buffer. Os dois usam `Relaxed`. O que pode dar errado?",
      options: [
        "O leitor pode ver `ready == true` antes das escritas do buffer ficarem visíveis, e ler lixo",
        "Nada — `Relaxed` ainda garante que a escrita acontece primeiro na ordem do programa",
        "A flag pode ser rasgada, mostrando um valor que não é nem true nem false",
      ],
      answer: 0,
      explain:
        "Esse é o padrão de publicação, e ele precisa de `Release` no store e `Acquire` no load. `Relaxed` torna cada *operação* atômica e não ordena nada em volta.",
    },
    {
      kind: "fill",
      prompt: "Incremente um contador de estatística com a ordering correta mais barata.",
      file: "main.rs",
      before: "hits.fetch_add(1, Ordering::",
      after: ");",
      choices: ["Relaxed", "SeqCst", "Acquire"],
      answer: 0,
      explain:
        "Nada mais depende da ordem deste contador, então `Relaxed` é correto e o mais barato. `Acquire` é legal num read-modify-write como `fetch_add`, mas aqui não ordena nada e custa mais — e `SeqCst` custa mais ainda.",
    },
    {
      kind: "quiz",
      question: "Qual é a descrição honesta de `SeqCst`?",
      options: [
        "A mais forte e a mais lenta — uma ordem total única com que toda thread concorda; o padrão certo quando você está na dúvida",
        "A mais rápida, já que a CPU otimiza melhor uma ordem total",
        "Idêntica a `AcqRel` com outro nome",
      ],
      answer: 0,
      explain:
        "Começar em `SeqCst` e enfraquecer com um benchmark na mão é uma forma sólida de trabalhar. Começar em `Relaxed` e torcer não é.",
    },
    {
      kind: "editor",
      intro: `### Conte sem lock, eleja um vencedor

1. Monte um \`Arc<AtomicU64>\` em \`0\`. Spawne oito threads, cada uma fazendo \`fetch_add(1, Ordering::Relaxed)\` mil vezes. Dê join e imprima o valor com um load \`Acquire\`.
2. Crie um \`AtomicBool\` em \`false\`. Chame \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **duas vezes** e imprima cada resultado com \`{:?}\`.

Saída esperada:

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — ganhamos, e o valor que substituímos era \`false\`. \`Err(true)\` — perdemos, e aqui está o que encontramos.`,
    },
  ],

  "rust-concurrency-8": [
    {
      kind: "theory",
      body: `Um channel move **ownership** entre threads. \`mpsc\` é multi-produtor, consumidor único: clone o sender quantas vezes precisar, mantenha um receiver.

\`\`\`rust
let (tx, rx) = mpsc::channel::<u64>();
for id in 0..3 {
    let tx = tx.clone();
    thread::spawn(move || { tx.send(id).unwrap(); });
}
drop(tx);                       // solte o original, ou o rx nunca termina
for value in rx { ... }
\`\`\`

Esse \`drop(tx)\` é o detalhe que as pessoas esquecem. O iterador do receiver termina quando **todo** sender sumiu — e o \`tx\` original no \`main\` é um deles.`,
    },
    {
      kind: "theory",
      body: `\`channel()\` é **ilimitado**. Um produtor nunca espera, o que soa bom e é a forma clássica de construir um vazamento de memória: se os consumidores são mais lentos que os produtores, a fila cresce até o processo ser morto.

\`sync_channel(n)\` é **limitado**. Assim que \`n\` mensagens estão no buffer, \`send\` bloqueia:

\`\`\`rust
let (tx, rx) = mpsc::sync_channel::<u64>(1);
tx.send(1).unwrap();
tx.try_send(2).is_err();     // true — cheio
\`\`\`

Esse bloqueio *é* **backpressure**: a profundidade da fila vira um sinal que sobe de volta até quem produz, então um sistema sobrecarregado reduz a entrada em vez de bufferizar até um OOM kill.

Para um serviço, prefira limitado. Uma fila ilimitada não remove o limite, só o move para um lugar onde você descobre por uma página no meio da noite em vez de por uma métrica.`,
    },
    {
      kind: "quiz",
      question:
        "Um laço `for value in rx` nunca termina mesmo com todo worker tendo acabado. Por quê?",
      options: [
        "O sender original no `main` nunca foi dropado, então o channel ainda tem um sender vivo",
        "O receiver precisa ser fechado explicitamente com `rx.close()`",
        "Os workers precisam chamar `tx.flush()` antes de sair",
      ],
      answer: 0,
      explain:
        "O iterador termina quando a contagem de senders chega a zero. Clonar para cada worker e esquecer o original deixa exatamente um sender vivo — na thread que está esperando.",
    },
    {
      kind: "fill",
      prompt: "Crie um channel limitado para os produtores sentirem backpressure.",
      file: "main.rs",
      before: "let (btx, brx) = mpsc::",
      after: "::<u64>(1);",
      choices: ["sync_channel", "channel", "bounded"],
      answer: 0,
      explain:
        "`channel()` é ilimitado e não recebe argumento de capacidade. `bounded` é o nome disso no Crossbeam — a std chama de `sync_channel`.",
    },
    {
      kind: "quiz",
      question:
        "O que de fato dá errado com uma fila ilimitada na frente de um consumidor lento?",
      options: [
        "A memória cresce sem limite até o processo ser morto por OOM — o limite continua existindo, só que é o da máquina",
        "Mensagens são descartadas em silêncio quando um limite interno é atingido",
        "Os senders começam a bloquear, que é o backpressure desejado",
      ],
      answer: 0,
      explain:
        "Ilimitado não significa 'sem limite', significa 'o limite é a RAM e você descobre sendo acordado'. Uma fila limitada torna o limite seu, e visível como latência.",
    },
    {
      kind: "editor",
      intro: `### Junte tudo, depois sinta a backpressure

1. \`mpsc::channel::<u64>()\`. Spawne três produtores; o produtor \`id\` envia \`id * 10 + n\` para \`n\` em \`0..3\`. **Solte o sender original**, depois colete o receiver num \`Vec<u64>\`, ordene, e imprima o vetor e o tamanho.
2. \`mpsc::sync_channel::<u64>(1)\`. Envie um valor, imprima se um segundo \`try_send\` **falha**, depois faça \`recv()\` e imprima o que saiu.

Saída esperada:

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Ordenar é o que torna o fan-in determinístico — a ordem de chegada não é.`,
    },
  ],
};
