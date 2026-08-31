// PT · Advanced Path curriculum metadata — track and lesson names as shown on
// /advanced and /advanced/[slug].
//
// CLIENT-SAFE. Keyed by the same slugs as the English source in
// ../../curriculum.ts, and PARTIAL: a missing key falls back to English, so
// this file can be filled in ahead of the lesson bodies without leaving a gap
// anywhere on the page.
//
// Termos técnicos do Rust não se traduzem — ownership, borrow, trait,
// lifetime, closure. Traduzi-los afasta o leitor da mensagem de erro real do
// compilador, que é onde ele vai encontrar a palavra de novo.

export interface AdvancedTrackText {
  title: string;
  description: string;
  serves: string;
  syllabus?: string[];
}

export const ptAdvancedTrackText: Record<string, AdvancedTrackText> = {
  "rust-ownership-deep": {
    title: "Ownership, moves e drops",
    description:
      "O modelo que o borrow checker realmente impõe. Onde um valor vive, quando ele move, quando é copiado no lugar disso, e o ponto exato em que é destruído.",
    serves: "programação de sistemas em Rust/C++",
  },
  "rust-lifetimes": {
    title: "Lifetimes",
    description:
      "As anotações deixam de ser ruído quando você as lê como uma restrição entre entradas e saídas. Elisão, structs que guardam referências, 'static, e o que um bound realmente promete.",
    serves: "programação de sistemas em Rust/C++",
  },
  "rust-traits-generics": {
    title: "Traits, generics e dispatch",
    description:
      "Como Rust reaproveita código sem herança. Bounds, associated types, blanket impls, e a diferença real de custo entre um generic e um dyn Trait.",
    serves: "programação de sistemas em Rust/C++",
  },
  "rust-error-handling": {
    title: "Erros que sobrevivem à produção",
    description:
      "Result de ponta a ponta: propagação, conversão, tipos de erro próprios que carregam a causa, e uma política explícita de quando um panic é correto e quando ele é um incidente.",
    serves: "ownership de infraestrutura de produção",
  },
  "rust-collections-iterators": {
    title: "Coleções, iteradores e closures",
    description:
      "Escolher o container por complexidade e não por hábito, e então expressar a transformação de forma lazy. Inclui a distinção Fn/FnMut/FnOnce, que decide o que uma closure pode capturar.",
    serves: "programação de sistemas em Rust/C++",
  },
  "rust-smart-pointers": {
    title: "Smart pointers e mutabilidade interior",
    description:
      "Box, Rc, RefCell, Cow e Weak — o que cada um compra, o que custa, e a distinção entre borrow em tempo de compilação e em runtime que decide qual você precisa de fato.",
    serves: "programação de sistemas em Rust/C++",
  },
  "rust-concurrency": {
    title: "Threads, Send/Sync e estado compartilhado",
    description:
      "O núcleo de qualquer serviço RPC sob carga real. Threads, as duas auto traits que tornam o compartilhamento seguro, Arc<Mutex<T>> e suas alternativas, atomics com memory ordering honesto, e channels.",
    serves: "serviços RPC/API em alta escala",
  },
  "rust-async-internals": {
    title: "Async a partir dos primeiros princípios",
    description:
      "Construído de baixo para cima a partir do poll loop, não de cima para baixo a partir de uma macro. Você escreve um Future à mão, monta um block_on funcional com um Waker de verdade, e só então olha o que o Tokio acrescenta.",
    serves: "serviços RPC/API em alta escala",
  },
  "rust-systems-edges": {
    title: "Macros, unsafe, FFI e dinheiro",
    description:
      "As quatro bordas que se espera de quem revisa código de sistemas: o que um derive expande, o que um bloco unsafe promete, o que custa cruzar para C++, e por que um float nunca guarda saldo.",
    serves: "programação de sistemas em Rust/C++",
  },
  "backend-rpc-services": {
    title: "Serviços RPC em escala",
    description:
      "O serviço na frente da rede: JSON-RPC 2.0 feito com exatidão, Serde na borda, camadas Tower para timeout e rate limiting, e as perguntas de arquitetura que uma entrevista realmente faz.",
    serves: "serviços RPC/API em alta escala",
  },
  "backend-data-layer": {
    title: "A camada de dados",
    description:
      "Arquitetura de banco como a vaga descreve: indexação e padrões de query primeiro, depois o lado Rust — pools, transações e prepared statements.",
    serves: "arquitetura, indexação e padrões de query de banco",
  },
  "backend-indexers-distsys": {
    title: "Indexers e sistemas distribuídos",
    description:
      "O caminho que uma transação percorre do cliente ao consenso e de volta, e o indexer que a torna consultável. Cursores, replay, idempotência e os modos de falha que só aparecem em escala.",
    serves: "infraestrutura blockchain em produção",
  },
  "backend-production": {
    title: "Rodando isso em produção",
    description:
      "O que separa um protótipo de uma infraestrutura pela qual alguém é acordado de madrugada: observabilidade, percentis honestos, teste de carga, shutdown gracioso e uma postura de confiabilidade que você consegue defender.",
    serves: "ownership de infraestrutura de produção",
  },
};

export const ptAdvancedLessonText: Record<
  string,
  { title: string; summary: string }
> = {
  // ownership
  "rust-ownership-deep-1": {
    title: "Stack, heap e quem é dono do quê",
    summary: "Leia o layout real de memória de um valor e diga que parte vive onde.",
  },
  "rust-ownership-deep-2": {
    title: "Move vs copy",
    summary: "Preveja se uma atribuição move ou copia — e prove que compila.",
  },
  "rust-ownership-deep-3": {
    title: "Moves parciais",
    summary: "Mova um campo para fora de uma struct e continue usando o resto, legalmente.",
  },
  "rust-ownership-deep-4": {
    title: "Regras de borrow na prática",
    summary: "Resolva erros de aliasing estreitando o escopo em vez de apelar para clone().",
  },
  "rust-ownership-deep-5": {
    title: "Reborrowing e deref coercion",
    summary: "Explique por que &mut T passa em um parâmetro &T, e por que String passa como &str.",
  },
  "rust-ownership-deep-6": {
    title: "Ordem de drop e RAII",
    summary: "Preveja a ordem de destruição e libere um recurso sem chamar close().",
  },
  // lifetimes
  "rust-lifetimes-1": {
    title: "O que um lifetime realmente diz",
    summary: "Leia 'a como uma relação entre argumentos, não como uma duração.",
  },
  "rust-lifetimes-2": {
    title: "Regras de elisão",
    summary: "Saiba quais assinaturas dispensam anotação, e por que a sua precisa.",
  },
  "rust-lifetimes-3": {
    title: "Múltiplos lifetimes",
    summary: "Anote uma função cuja saída empresta de apenas uma das duas entradas.",
  },
  "rust-lifetimes-4": {
    title: "Structs que guardam referências",
    summary: "Construa um parser zero-copy sobre um buffer que não é seu.",
  },
  "rust-lifetimes-5": {
    title: "'static: dois significados diferentes",
    summary: "Distinga um &'static str de um bound T: 'static — não são a mesma afirmação.",
  },
  // traits & generics
  "rust-traits-generics-1": {
    title: "Definindo e implementando uma trait",
    summary: "Escreva uma trait com método default e sobrescreva-o.",
  },
  "rust-traits-generics-2": {
    title: "Trait bounds e cláusulas where",
    summary: "Restrinja um generic o suficiente para o corpo compilar, sem restringir demais.",
  },
  "rust-traits-generics-3": {
    title: "Associated types vs parâmetros genéricos",
    summary: "Escolha certo entre os dois, e diga por que Iterator usa um e não o outro.",
  },
  "rust-traits-generics-4": {
    title: "Dispatch estático e monomorfização",
    summary: "Explique o que o compilador emite para uma função genérica, e o que isso custa.",
  },
  "rust-traits-generics-5": {
    title: "Trait objects e a vtable",
    summary: "Guarde tipos diferentes atrás de Box<dyn Trait> e nomeie o custo em runtime.",
  },
  "rust-traits-generics-6": {
    title: "Object safety",
    summary: "Preveja quais traits podem virar trait objects antes do compilador te avisar.",
  },
  "rust-traits-generics-7": {
    title: "Blanket impls e a orphan rule",
    summary: "Implemente uma trait para todo tipo que satisfaz um bound — e saiba quando não pode.",
  },
  // errors
  "rust-error-handling-1": {
    title: "Result e o operador ?",
    summary: "Propague a falha sem um único match.",
  },
  "rust-error-handling-2": {
    title: "Tipos de erro próprios",
    summary: "Modele suas falhas como um enum em vez de uma String.",
  },
  "rust-error-handling-3": {
    title: "From, Into e conversão automática",
    summary: "Faça o ? converter um erro alheio no seu, de graça.",
  },
  "rust-error-handling-4": {
    title: "Display, Debug e std::error::Error",
    summary: "Escreva as duas mensagens que um erro te deve: a do operador e a do log.",
  },
  "rust-error-handling-5": {
    title: "Encadeamento de erros e source()",
    summary: "Mantenha a causa anexada para que uma linha de log encerre uma investigação.",
  },
  "rust-error-handling-6": {
    title: "Quando panic! é a decisão certa",
    summary: "Trace a linha entre um bug e uma condição — e pare de dar unwrap atravessando ela.",
  },
  // collections
  "rust-collections-iterators-1": {
    title: "Vec, VecDeque e crescimento",
    summary: "Escolha entre eles pela ponta em que você faz push/pop, e pare de realocar num laço quente.",
  },
  "rust-collections-iterators-2": {
    title: "HashMap vs BTreeMap",
    summary: "Escolha por ordenação e complexidade, não pelo que você digitou da última vez.",
  },
  "rust-collections-iterators-3": {
    title: "iter, iter_mut e into_iter",
    summary: "Diga o que cada um te entrega, e o que faz com a coleção.",
  },
  "rust-collections-iterators-4": {
    title: "Adapters e laziness",
    summary: "Encadeie map/filter/filter_map e explique por que nada rodou até o collect.",
  },
  "rust-collections-iterators-5": {
    title: "fold, reduce e agregação sob medida",
    summary: "Troque um laço com acumulador mutável por uma única expressão.",
  },
  "rust-collections-iterators-6": {
    title: "Fn, FnMut e FnOnce",
    summary: "Preveja qual trait uma closure implementa a partir do que ela captura.",
  },
  "rust-collections-iterators-7": {
    title: "Closures move e capturas que escapam",
    summary: "Entregue uma closure a algo que sobrevive ao escopo dela, corretamente.",
  },
  // smart pointers
  "rust-smart-pointers-1": {
    title: "Box<T> e tipos recursivos",
    summary: "Dê a um enum recursivo um tamanho conhecido.",
  },
  "rust-smart-pointers-2": {
    title: "Rc<T> e ownership compartilhado",
    summary: "Compartilhe uma alocação entre vários donos numa única thread.",
  },
  "rust-smart-pointers-3": {
    title: "RefCell<T> e borrow em runtime",
    summary: "Mova a checagem de borrow da compilação para o runtime — e aceite o panic que isso compra.",
  },
  "rust-smart-pointers-4": {
    title: "Weak<T> e ciclos de referência",
    summary: "Construa um grafo pai/filho que realmente é liberado.",
  },
  "rust-smart-pointers-5": {
    title: "Cow<T> e alocar só quando for preciso",
    summary: "Devolva dado emprestado no caminho comum, e próprio no caminho raro.",
  },
  "rust-smart-pointers-6": {
    title: "Deref, DerefMut e ponteiros próprios",
    summary: "Faça seu wrapper se comportar como aquilo que ele embrulha.",
  },
  // concurrency
  "rust-concurrency-1": {
    title: "Criando e juntando threads",
    summary: "Rode trabalho em paralelo e colete todo resultado de forma determinística.",
  },
  "rust-concurrency-2": {
    title: "Send e Sync",
    summary: "Diga por que Rc não é Send e Arc é, partindo da definição e não da memória.",
  },
  "rust-concurrency-3": {
    title: "Arc<T>: ownership compartilhado entre threads",
    summary: "Compartilhe estado somente-leitura com N workers ao custo de um atomic.",
  },
  "rust-concurrency-4": {
    title: "Mutex, guards e poisoning",
    summary: "Mute estado compartilhado com segurança, e mantenha a seção crítica curta de propósito.",
  },
  "rust-concurrency-5": {
    title: "RwLock e estado com muita leitura",
    summary: "Escolha RwLock em vez de Mutex com evidência, e nomeie o risco de starvation que você assumiu.",
  },
  "rust-concurrency-6": {
    title: "Deadlocks e ordem de lock",
    summary: "Reproduza um deadlock e depois elimine-o com uma ordem global de locks.",
  },
  "rust-concurrency-7": {
    title: "Atomics e memory ordering",
    summary: "Use fetch_add e compare_exchange, e justifique Relaxed vs Acquire/Release.",
  },
  "rust-concurrency-8": {
    title: "Channels e backpressure",
    summary: "Monte produtor/consumidor com mpsc e explique o que um channel limitado compra.",
  },
  // async
  "rust-async-internals-1": {
    title: "Um Future é uma função poll",
    summary: "Implemente Future à mão e veja que não há mágica nenhuma nele.",
  },
  "rust-async-internals-2": {
    title: "Nada roda sem um executor",
    summary: "Prove que um future sem await não faz absolutamente nada, e diga por que isso é uma feature.",
  },
  "rust-async-internals-3": {
    title: "Construa o block_on",
    summary: "Escreva um executor de verdade: Waker, RawWaker e um laço de park/unpark.",
  },
  "rust-async-internals-4": {
    title: "Escalonamento cooperativo e chamadas bloqueantes",
    summary: "Explique por que uma única chamada bloqueante trava uma thread inteira do runtime.",
  },
  "rust-async-internals-5": {
    title: "Cancelamento é um drop",
    summary: "Faça a limpeza acontecer certo quando o cliente desconecta no meio da requisição.",
  },
  "rust-async-internals-6": {
    title: "Timeouts e select",
    summary: "Corra um future contra um prazo, e diga qual lado ganhou e o que vazou.",
  },
  "rust-async-internals-7": {
    title: "O que o Tokio acrescenta",
    summary: "Mapeie cada peça que você construiu ao equivalente no Tokio: spawn, JoinHandle, select!, spawn_blocking.",
  },
  // systems edges
  "rust-systems-edges-1": {
    title: "Módulos, visibilidade e layout de crate",
    summary: "Use mod, pub e pub(crate) para tornar uma invariante inquebrável de fora.",
  },
  "rust-systems-edges-2": {
    title: "macro_rules! e macros declarativas",
    summary: "Escreva uma macro que uma função não poderia ter substituído.",
  },
  "rust-systems-edges-3": {
    title: "Derive e macros procedurais",
    summary: "Diga o que #[derive(Debug, Clone)] de fato gera, e onde o Serde se encaixa.",
  },
  "rust-systems-edges-4": {
    title: "unsafe: o contrato",
    summary: "Enuncie a invariante que um bloco unsafe assume — a habilidade pela qual um revisor é pago.",
  },
  "rust-systems-edges-5": {
    title: "Ponteiros crus e aliasing",
    summary: "Lide com *const/*mut T e nomeie a garantia que você acabou de abrir mão.",
  },
  "rust-systems-edges-6": {
    title: 'FFI, extern "C" e a fronteira de ABI',
    summary: "Passe ownership por uma fronteira C sem vazar nem liberar duas vezes.",
  },
  "rust-systems-edges-7": {
    title: "Dinheiro em inteiros e aritmética checada",
    summary: "Trate saldo em inteiros de ponto fixo, e escolha entre checked, saturating e wrapping de propósito.",
  },
  // ── backend / infra ───────────────────────────────────────────────────
  "backend-rpc-services-1": {
    title: "O envelope JSON-RPC 2.0 e seus cinco códigos de erro",
    summary:
      "Classifique qualquer requisição de entrada no código de erro JSON-RPC certo, e saiba os dois casos em que o id da resposta precisa ser null em vez de ecoado.",
  },
  "backend-rpc-services-2": {
    title: "Notifications, batches e as requisições que você não deve responder",
    summary:
      "Implemente as duas regras que quebram servidores JSON-RPC ingênuos: uma notification não recebe resposta nenhuma, e um batch vazio é ele próprio uma requisição inválida.",
  },
  "backend-rpc-services-3": {
    title: "Uma tabela de dispatch de handlers em box",
    summary:
      "Construa um roteador a partir de um HashMap de closures em box, e separe as três falhas que uma chamada pode ter: método inexistente, argumentos ruins, handler que explodiu.",
  },
  "backend-rpc-services-4": {
    title: "Service e Layer: construindo o Tower a partir de duas traits",
    summary:
      "Escreva as duas traits de que o ecossistema Tower inteiro é feito, depois embrulhe um backend num timeout e prove que as requisições que estouraram o prazo nunca chegam nele.",
  },
  "backend-rpc-services-5": {
    title: "Limites de concorrência e load shedding",
    summary:
      "Simule a mesma sobrecarga sob duas políticas de admissão e leia o que enfileirar de fato custa: os mesmos sucessos, mais 320ms de tempo de backend gasto em respostas que ninguém pode usar.",
  },
  "backend-rpc-services-6": {
    title: "Um rate limiter token-bucket num relógio simulado",
    summary:
      "Implemente token buckets por cliente com refill preguiçoso, devolva um retry_after acionável, e veja por que o limite que você configura não é o limite que a sua frota impõe.",
  },
  "backend-rpc-services-7": {
    title: "Contratos de paginação: cursores, offsets e request IDs",
    summary:
      "Prove que paginação por OFFSET perde linhas em silêncio quando a coleção muda no meio do percurso, e escreva o contrato de cursor que não perde.",
  },
  "backend-data-layer-1": {
    title: "Index scan vs seq scan: linhas examinadas",
    summary:
      "Conte as linhas examinadas nos dois planos e diga qual deles os números favorecem.",
  },
  "backend-data-layer-2": {
    title: "Índices compostos e o leftmost prefix",
    summary:
      "Diga quais conjuntos de predicados um índice composto consegue servir, e quais ele apenas filtra.",
  },
  "backend-data-layer-3": {
    title: "O cost model por trás do EXPLAIN",
    summary:
      "Precifique um index scan contra um seq scan e preveja a escolha do planner.",
  },
  "backend-data-layer-4": {
    title: "Paginação por cursor vs OFFSET",
    summary:
      "Troque OFFSET por um cursor keyset e quantifique o que isso economiza.",
  },
  "backend-data-layer-5": {
    title: "Níveis de isolamento e as anomalias que cada um permite",
    summary:
      "Nomeie qual anomalia cada nível de isolamento permite, e prove com um trace.",
  },
  "backend-data-layer-6": {
    title: "Transações, rollback e prepared statements",
    summary:
      "Implemente commit e rollback, e diga o que um prepared statement de fato reaproveita.",
  },
  "backend-data-layer-7": {
    title: "Connection pools e para onde vai a latência",
    summary:
      "Leia o tempo de espera na fila numa simulação de pool e dimensione um pool com um motivo.",
  },
  "backend-indexers-distsys-1": {
    title: "O pipeline do indexer e um cursor que sobrevive a restart",
    summary:
      "Construa o pipeline de quatro estágios — fonte do ledger, cursor, processador, store — e reinicie no meio do stream sem perder nem repetir trabalho.",
  },
  "backend-indexers-distsys-2": {
    title: "Comite o cursor depois do efeito, nunca antes",
    summary:
      "Injete um crash entre as duas escritas e meça as duas ordens: cursor-primeiro perde um evento em silêncio, efeito-primeiro duplica um — e só uma das duas é recuperável.",
  },
  "backend-indexers-distsys-3": {
    title: "Idempotência sob entrega at-least-once",
    summary:
      "Processe um stream que duplica e reordena eventos, duas vezes seguidas, e chegue exatamente ao estado que um feed exactly-once perfeito teria produzido.",
  },
  "backend-indexers-distsys-4": {
    title: "Sobrevivendo a um reorg: volte até o fork, reaplique o ramo",
    summary:
      "Detecte que um bloco de entrada bifurca abaixo da sua head, desfaça os blocos órfãos em ordem decrescente de altura, e reaplique o ramo vencedor.",
  },
  "backend-indexers-distsys-5": {
    title: "Status de transação como máquina de estados que rejeita",
    summary:
      "Codifique Received/Validating/Submitted/Pending/Confirmed/Failed como uma tabela de transição cujo braço default recusa movimentos ilegais e deixa o estado intacto.",
  },
  "backend-indexers-distsys-6": {
    title: "Aritmética de quorum: R + W > N, e o que uma partição faz com isso",
    summary:
      "Calcule quais configurações (N, R, W) garantem que uma leitura enxergue a última escrita, depois rode uma partição 3|2 e veja o lado minoritário recusar leituras e escritas.",
  },
  "backend-indexers-distsys-7": {
    title: "Ordenando eventos sem relógio: Lamport e vector stamps",
    summary:
      "Carimbe um trace distribuído com os dois tipos de relógio e mostre o par em que o Lamport reporta uma ordem que a causalidade não sustenta.",
  },
  "backend-production-1": {
    title: "Counters, gauges e histograms",
    summary:
      "Escolha o instrumento certo para uma pergunta, e veja o que cada um não consegue responder.",
  },
  "backend-production-2": {
    title: "Percentis a partir de buckets, e por que você não pode tirar média deles",
    summary:
      "Calcule p50/p95/p99 a partir das contagens de bucket, e mescle duas instâncias sem mentir.",
  },
  "backend-production-3": {
    title: "Logs estruturados e um correlation ID",
    summary:
      "Passe um único ID por uma cadeia de chamadas e reconstrua uma requisição inteira a partir de um stream intercalado.",
  },
  "backend-production-4": {
    title: "Backoff, jitter e um retry budget",
    summary:
      "Limite a amplificação de retries com um budget, em vez de torcer para a dependência se recuperar.",
  },
  "backend-production-5": {
    title: "Um circuit breaker como máquina de estados",
    summary:
      "Pare de mandar tráfego para uma dependência morta, e volte a sondá-la sem causar uma estampida.",
  },
  "backend-production-6": {
    title: "Shutdown gracioso: drenar, prazo, fechar à força",
    summary:
      "Tire um pod de rotação e termine o trabalho em voo sem que um deploy derrube requisições.",
  },
  "backend-production-7": {
    title: "Little's Law: um alvo de latência é um limite de concorrência",
    summary:
      "Transforme um SLO de latência no número de requisições concorrentes que você pode admitir.",
  },
};
