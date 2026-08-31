import type { LessonStep } from "@/content/steps";

// PT · Coleções, iteradores e closures.

export const rustCollectionsIteratorsStepsPt: Record<string, LessonStep[]> = {
  "rust-collections-iterators-1": [
    {
      kind: "theory",
      body: `\`Vec<T>\` é um array contíguo que cresce. Os custos dele valem ser sabidos com exatidão:

| operação | custo |
| --- | --- |
| \`push\` / \`pop\` no fim | O(1) amortizado |
| \`insert\` / \`remove\` no início | O(n) — tudo desloca |
| índice | O(1) |

"Amortizado" cobre o crescimento: quando o buffer enche, o \`Vec\` aloca um maior (tipicamente o dobro) e copia tudo. Na média de muitos pushes isso é O(1), mas qualquer push *individual* pode ser o caro.`,
    },
    {
      kind: "theory",
      body: `Duas consequências acionáveis.

**Se você sabe o tamanho, diga.** \`Vec::with_capacity(n)\` aloca uma vez. Num laço que empurra um número conhecido de itens, isso elimina toda realocação e toda cópia — o ganho de performance mais barato da linguagem.

**Se você empurra e tira dos dois lados, use \`VecDeque<T>\`.** É um ring buffer: \`push_front\` e \`pop_front\` são O(1), onde \`Vec::insert(0, x)\` é O(n). É a diferença entre uma fila que escala e uma que silenciosamente vira quadrática.

\`\`\`rust
let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(2);
q.push_front(1);     // O(1) — um Vec deslocaria todo elemento
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Um laço empurra exatamente 10 000 itens conhecidos num `Vec::new()`. O que `with_capacity(10_000)` economiza?",
      options: [
        "Cerca de uma dúzia de realocações, cada uma copiando tudo que já foi empurrado",
        "Nada — o `Vec` já aloca o tamanho final no primeiro push",
        "A checagem de limites de cada push",
      ],
      answer: 0,
      explain:
        "Dobrar de 4 até 10 000 são umas onze etapas de crescimento, e as últimas copiam milhares de elementos cada. Uma alocação antecipada remove tudo isso.",
    },
    {
      kind: "fill",
      prompt: "Adicione no início de uma fila em tempo constante.",
      file: "main.rs",
      before: "let mut q: VecDeque<i32> = VecDeque::new();\nq.",
      after: "(1);",
      choices: ["push_front", "insert", "push"],
      answer: 0,
      explain:
        "`VecDeque` é um ring buffer, então inserir na frente é mover um ponteiro. A mesma operação num `Vec` desloca todo elemento.",
    },
    {
      kind: "quiz",
      question:
        "Uma fila de jobs faz `jobs.remove(0)` num `Vec` a cada tick, com milhares de jobs. Qual o sintoma?",
      options: [
        "A vazão degrada conforme a fila cresce — cada pop desloca todo elemento restante",
        "A memória cresce sem limite porque `remove` nunca libera",
        "Nada mensurável; `remove(0)` é otimizado para um avanço de ponteiro",
      ],
      answer: 0,
      explain:
        "A fila quadrática clássica. É invisível num teste com dez jobs e domina o profile com dez mil — troque o `Vec` por um `VecDeque` e ela desaparece.",
    },
    {
      kind: "editor",
      intro: `### Container certo, custo certo

1. Monte um \`Vec<i32>\` com \`Vec::with_capacity(4)\`, empurre \`1..=4\`, e imprima o vetor com \`{:?}\` e a \`capacity()\` — deve continuar exatamente 4.
2. Monte um \`VecDeque<i32>\`, \`push_back\` de \`2\` e \`3\`, \`push_front\` de \`1\`, imprima com \`{:?}\`, e depois imprima \`pop_front()\` com \`{:?}\`.

Saída esperada:

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\``,
    },
  ],

  "rust-collections-iterators-2": [
    {
      kind: "theory",
      body: `Os dois mapas diferem num eixo que decide todo o resto: **ordenação**.

\`HashMap<K, V>\` — busca, inserção e remoção O(1) em média. A ordem de iteração é **arbitrária e deliberadamente aleatorizada** entre execuções. Exige \`K: Hash + Eq\`.

\`BTreeMap<K, V>\` — O(log n) para as mesmas operações. A iteração é **sempre em ordem de chave**, e suporta consultas por faixa: \`map.range("a".."m")\`. Exige \`K: Ord\`.`,
    },
    {
      kind: "theory",
      body: `Escolha \`BTreeMap\` quando precisar de iteração ordenada, varreduras por faixa ou saída determinística (um dump de config, um snapshot de teste, um payload assinado). Escolha \`HashMap\` no resto — é mais rápido e é o padrão certo.

A API \`entry\` é o idioma que vale memorizar para os dois:

\`\`\`rust
*hits.entry(method).or_insert(0) += 1;
\`\`\`

Uma busca, não duas. A versão ingênua — \`if map.contains_key(k) { ... } else { ... }\` — faz hash da chave duas vezes e pega o mapa emprestado duas vezes, o que o borrow checker também vai reclamar. \`or_insert_with(Vec::new)\` é o mesmo padrão quando o valor padrão não é de graça de construir.`,
    },
    {
      kind: "quiz",
      question:
        "Iterar o mesmo `HashMap` duas vezes no mesmo processo pode dar ordens diferentes. Por que isso é deliberado?",
      options: [
        "Hashing aleatorizado protege contra ataques de colisão, e a ordem instável impede que código dependa de um acidente",
        "É um bug da biblioteca padrão mantido por compatibilidade",
        "A ordem depende de quanta memória está livre na hora",
      ],
      answer: 0,
      explain:
        "As duas metades são o ponto: um hash previsível deixa um atacante forçar toda chave para o mesmo bucket, e código que depende sem querer da ordem de iteração quebra em qualquer redimensionamento.",
    },
    {
      kind: "fill",
      prompt: "Incremente um contador, criando-o em zero na primeira vez.",
      file: "main.rs",
      before: "*hits.",
      after: "(m).or_insert(0) += 1;",
      choices: ["entry", "get", "insert"],
      answer: 0,
      explain:
        "`entry` faz hash uma vez e devolve um slot que você pode preencher ou modificar. `get` seguido de `insert` faz hash duas vezes e precisa de dois borrows separados.",
    },
    {
      kind: "quiz",
      question:
        "Um serviço despeja a config como JSON, e o diff entre duas execuções vem barulhento sem nenhuma mudança de config. Qual a causa provável?",
      options: [
        "Ele está serializando de um `HashMap`, cuja ordem de iteração varia por execução — um `BTreeMap` tornaria a saída determinística",
        "O serializador de JSON não é determinístico",
        "A config está sendo lida antes de terminar de carregar",
      ],
      answer: 0,
      explain:
        "Saída determinística é o motivo padrão para pagar o O(log n) do `BTreeMap`. O mesmo vale para qualquer coisa que seja hasheada ou assinada, onde estabilidade byte a byte é obrigatória.",
    },
    {
      kind: "editor",
      intro: `### Ordem ou velocidade

1. Com um \`HashMap<&str, u32>\`, conte as ocorrências em \`["getEvents", "sendTx", "getEvents"]\` usando a API \`entry\`, e imprima a contagem de \`getEvents\`.
2. Com um \`BTreeMap<&str, u32>\`, insira \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` nessa ordem, colete as chaves num \`Vec<&str>\` e imprima — ordenadas, independentemente da ordem de inserção.

Saída esperada:

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-3": [
    {
      kind: "theory",
      body: `Três formas de iterar, e a diferença está no que cada uma te entrega:

| método | produz | coleção depois |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | intacta |
| \`.iter_mut()\` | \`&mut T\` | mutada no lugar |
| \`.into_iter()\` | \`T\` | **consumida** |

\`\`\`rust
let doubled: Vec<i32> = data.iter().map(|n| n * 2).collect();  // data sobrevive
for n in data.iter_mut() { *n += 10; }                          // data muda
let owned: Vec<String> = data.into_iter().map(...).collect();   // data acabou
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`for x in &collection\` é açúcar para \`.iter()\`, \`for x in &mut collection\` para \`.iter_mut()\`, e \`for x in collection\` para \`.into_iter()\`.

Essa última é a que surpreende: escrever \`for item in items\` **move** \`items\`, e a próxima linha que o usar não vai compilar. A correção quase sempre é um único \`&\`.

Escolha \`into_iter\` de propósito, não por acidente. Quando você está transformando dado próprio em outro dado próprio e não vai precisar do original — mapeando \`Vec<Row>\` em \`Vec<Response>\` — é exatamente o certo, e evita clonar cada elemento.`,
    },
    {
      kind: "quiz",
      question:
        "`for item in items { ... }` compila, mas a linha seguinte que usa `items` não. Por quê?",
      options: [
        "O laço expande para `into_iter()`, que consumiu a coleção",
        "O laço pegou `items` emprestado e o borrow dura até o fim da função",
        "`items` precisa ser declarado `mut` para ser lido depois de um laço",
      ],
      answer: 0,
      explain:
        "Um caractere resolve: `for item in &items`. Vale internalizar, porque a mensagem de erro aponta para a segunda linha e a causa está na primeira.",
    },
    {
      kind: "fill",
      prompt: "Modifique cada elemento do vetor no lugar.",
      file: "main.rs",
      before: "for n in data.",
      after: "() {\n    *n += 10;\n}",
      choices: ["iter_mut", "iter", "into_iter"],
      answer: 0,
      explain:
        "`iter_mut` produz `&mut i32`, então `*n += 10` escreve através dele. `iter` produziria `&i32`, ao qual não se pode atribuir.",
    },
    {
      kind: "quiz",
      question:
        "Você está transformando um `Vec<Row>` em `Vec<Response>` e não vai precisar das linhas de novo. Qual é o certo?",
      options: [
        "`into_iter()` — move cada linha para dentro da closure de mapeamento, sem clone por elemento",
        "`iter()` mais `.clone()` dentro da closure, para deixar o original intacto",
        "`iter_mut()`, mutando cada linha em resposta",
      ],
      answer: 0,
      explain:
        "É aqui que `into_iter` ganha seu lugar. Apelar para `iter().cloned()` por hábito aloca uma vez por elemento de dados que você ia descartar.",
    },
    {
      kind: "editor",
      intro: `### Emprestar, mutar, consumir

Com \`let mut data = vec![1, 2, 3];\`:

1. \`.iter()\` e \`map\` dobrando cada um num novo \`Vec<i32>\`, imprima — \`data\` sobrevive.
2. \`.iter_mut()\` somando \`10\` em cada no lugar, imprima \`data\`.
3. \`.into_iter()\` e \`map\` transformando cada um numa \`String\`, colete num \`Vec<String>\` e imprima.

Saída esperada:

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-4": [
    {
      kind: "theory",
      body: `Adapters de iterador são **lazy**. \`map\`, \`filter\` e \`filter_map\` constroem um iterador novo e não rodam nada:

\`\`\`rust
let lazy = raw.iter().map(|s| s.len());   // zero elementos processados
\`\`\`

O trabalho começa só quando algo *consome* o iterador: \`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`. Até lá você está montando um pipeline, não rodando um.`,
    },
    {
      kind: "theory",
      body: `A laziness é o que torna o encadeamento de graça. \`filter\` seguido de \`map\` **não** constrói um \`Vec\` intermediário — cada elemento atravessa a cadeia inteira um de cada vez, e o compilador normalmente colapsa isso num único laço sem alocação.

Ela também permite curto-circuito: \`.find(...)\` numa cadeia de um milhão de elementos para no primeiro que casa, e os posteriores nunca são tocados.

\`filter_map\` merece destaque. Ele mapeia e filtra numa passada, mantendo só os \`Some\`:

\`\`\`rust
.filter_map(|s| s.parse::<i64>().ok())    // parseia, descarta as falhas
\`\`\`

É a forma idiomática de parsear um lote em que algumas entradas são lixo — e ela descarta o motivo, então use \`.map(...).collect::<Result<Vec<_>, _>>()\` quando uma falha deve abortar o lote.`,
    },
    {
      kind: "quiz",
      question:
        "`raw.iter().map(expensive).filter(pred)` é atribuído a uma variável e nunca consumido. Quantas vezes `expensive` roda?",
      options: [
        "Zero — adapters montam um pipeline e nada executa até um consumidor pedir elementos",
        "Uma por elemento, quando a cadeia é construída",
        "Uma vez, no primeiro elemento, para inferir os tipos",
      ],
      answer: 0,
      explain:
        "É também por isso que `Iterator` é `#[must_use]`: uma cadeia não consumida é quase sempre um bug, e o compilador avisa.",
    },
    {
      kind: "fill",
      prompt: "Parseie cada entrada e descarte silenciosamente as que falharem.",
      file: "main.rs",
      before: "raw.iter().",
      after: "(|s| s.parse::<i64>().ok())",
      choices: ["filter_map", "map", "filter"],
      answer: 0,
      explain:
        "`filter_map` mantém os `Some` e descarta os `None` numa passada. `map` sozinho te deixaria com um `Vec<Option<i64>>`.",
    },
    {
      kind: "quiz",
      question:
        "Quando `filter_map(|x| f(x).ok())` é a escolha errada para parsear um lote?",
      options: [
        "Quando uma única entrada ruim deveria derrubar o lote inteiro — ele descarta o erro junto com o elemento",
        "Quando o lote é grande, porque `filter_map` aloca por elemento",
        "Quando a closure captura uma variável do escopo externo",
      ],
      answer: 0,
      explain:
        "Descartar entradas malformadas em silêncio é uma decisão real, e muitas vezes a errada para dado financeiro. `.collect::<Result<Vec<_>, _>>()` derruba o lote no primeiro erro.",
    },
    {
      kind: "editor",
      intro: `### Nada roda até você pedir

Com \`let raw = vec!["12", "x", "30", "", "8"];\`:

1. Encadeie \`.iter()\`, \`filter_map\` parseando cada um como \`i64\` e mantendo os que deram certo, depois \`filter\` mantendo só valores \`>= 10\`. Colete num \`Vec<i64>\` e imprima.
2. Monte uma segunda cadeia mapeando cada entrada para seu \`.len()\` e ligue a uma variável **sem** consumi-la. Imprima \`nothing ran yet\`, depois colete num \`Vec<usize>\` e imprima.

Saída esperada:

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\``,
    },
  ],

  "rust-collections-iterators-5": [
    {
      kind: "theory",
      body: `\`fold\` carrega um acumulador pela sequência inteira. É o consumidor mais geral que existe — \`sum\`, \`count\`, \`max\` e \`collect\` são todos folds por baixo.

\`\`\`rust
let total = latencies.iter().fold(0u64, |acc, n| acc + n);
\`\`\`

Três partes: o valor inicial, o acumulador, o elemento atual. A closure devolve o próximo acumulador.

\`reduce\` é o \`fold\` sem valor inicial — ele usa o primeiro elemento no lugar, e por isso devolve \`Option\`, já que uma sequência vazia não tem resposta:

\`\`\`rust
let worst = latencies.iter().copied().reduce(u64::max);   // Option<u64>
\`\`\``,
    },
    {
      kind: "theory",
      body: `O acumulador não precisa ser um número. Construir uma \`String\` é um fold cujo acumulador é a string sendo construída:

\`\`\`rust
.fold(String::new(), |mut acc, n| {
    if !acc.is_empty() { acc.push('|'); }
    acc.push_str(&n.to_string());
    acc
})
\`\`\`

Repare no \`|mut acc, ...|\` e no \`acc\` devolvido — o acumulador é *movido* a cada passo, que é o que mantém isso sem alocação por iteração.

Não force. Se um \`for\` simples com uma variável mutável é mais claro, escreva isso: o compilador produz o mesmo código, e a versão em fold de um corpo complexo é genuinamente mais difícil de ler.`,
    },
    {
      kind: "quiz",
      question: "Por que `reduce` devolve `Option<T>` e `fold` não?",
      options: [
        "Ele tira o valor inicial do primeiro elemento, então uma sequência vazia não tem resultado a dar",
        "Ele pode falhar se a closure der panic",
        "Ele é lazy, e o `Option` sinaliza se já foi consumido",
      ],
      answer: 0,
      explain:
        "`fold` sempre tem resposta porque você forneceu o elemento neutro. `reduce` sobre um iterador vazio é genuinamente indefinido, e o `Option` diz isso.",
    },
    {
      kind: "fill",
      prompt: "Carregue um total pela sequência a partir de um zero explícito.",
      file: "main.rs",
      before: "latencies.iter().",
      after: "(0u64, |acc, n| acc + n)",
      choices: ["fold", "reduce", "scan"],
      answer: 0,
      explain:
        "`reduce` não recebe valor inicial. `scan` é a variante que produz *todos* os acumuladores intermediários em vez de só o último.",
    },
    {
      kind: "quiz",
      question:
        "Qual é o motivo honesto para preferir um `for` a um `fold`?",
      options: [
        "O corpo é complexo o bastante para o fold ficar pior de ler — o código gerado é o mesmo dos dois jeitos",
        "`fold` aloca uma closure na heap por chamada",
        "Laços `for` são mais rápidos porque evitam o protocolo de iterador",
      ],
      answer: 0,
      explain:
        "Os dois compilam para o mesmo laço. Legibilidade é a decisão inteira, e 'mais funcional' não é automaticamente mais legível.",
    },
    {
      kind: "editor",
      intro: `### Agregue de três formas

Com \`let latencies = vec![12u64, 40, 7, 95, 23];\`:

1. \`fold\` a partir de \`0u64\` até um total, imprima.
2. \`.copied().reduce(u64::max)\` para o pior caso, imprima com \`{:?}\`.
3. \`fold\` a partir de \`String::new()\` juntando os valores com \`'|'\`, imprima.

Saída esperada:

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\``,
    },
  ],

  "rust-collections-iterators-6": [
    {
      kind: "theory",
      body: `Uma closure implementa uma de três traits, e **você não escolhe** — o compilador decide a partir do que o corpo faz com as capturas.

| trait | o corpo | pode ser chamada |
| --- | --- | --- |
| \`FnOnce\` | **consome** uma captura | uma vez |
| \`FnMut\` | **muta** uma captura | várias, precisa de \`&mut\` |
| \`Fn\` | só **lê** as capturas | várias, a partir de \`&\` |

Elas se aninham: toda \`Fn\` também é \`FnMut\`, e toda \`FnMut\` também é \`FnOnce\`. Ou seja, restringir um parâmetro por \`Fn\` é a coisa *mais* restritiva que você pode pedir.`,
    },
    {
      kind: "theory",
      body: `O que significa que a regra para escrever uma assinatura é o inverso da intuição:

**Restrinja pela trait mais frouxa que ainda permita chamar quantas vezes você precisa.** \`FnOnce\` se você chama uma vez, \`FnMut\` se chama repetidamente e não se incomoda que ela guarde estado mutável, \`Fn\` só se precisa chamar de vários lugares ao mesmo tempo — por exemplo, de várias threads.

\`\`\`rust
fn call_once<F: FnOnce() -> String>(f: F) -> String { f() }
fn call_mut<F: FnMut()>(mut f: F) { f(); f(); }
fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64 { f(1) + f(2) }
\`\`\`

Repare no \`mut f\` no caso \`FnMut\`: chamá-la exige um borrow exclusivo da própria closure, porque a closure é dona do estado que está mutando.`,
    },
    {
      kind: "quiz",
      question:
        "O corpo de uma closure faz `count += 1` numa variável local capturada. Quais traits ela implementa?",
      options: [
        "`FnMut` e `FnOnce` — mas não `Fn`, porque chamá-la muta o estado capturado",
        "As três — mutar uma captura não afeta a trait",
        "Só `FnOnce`, porque mutar consome a captura",
      ],
      answer: 0,
      explain:
        "É por isso que um parâmetro restrito por `F: Fn()` rejeita uma closure contadora. As traits descrevem o que *chamar* faz, não o que a closure devolve.",
    },
    {
      kind: "fill",
      prompt:
        "Restrinja um callback que será invocado duas vezes e pode guardar estado mutável.",
      file: "main.rs",
      before: "fn call_fn_mut<F: ",
      after: ">(mut f: F) {",
      choices: ["FnMut()", "Fn()", "FnOnce()"],
      answer: 0,
      explain:
        "`FnOnce` não pode ser chamada duas vezes, e `Fn` rejeitaria qualquer closure que mute uma captura — o que exclui a maioria dos callbacks úteis.",
    },
    {
      kind: "quiz",
      question:
        "Um parâmetro de callback está restrito por `F: Fn()` e a closure de quem chama não compila. Qual a correção usual?",
      options: [
        "Afrouxar o bound para `FnMut` — a não ser que o callback precise mesmo ser chamado de vários lugares ao mesmo tempo",
        "Pedir a quem chama que embrulhe o estado num `RefCell`",
        "Mudar o parâmetro para `&dyn Fn()`",
      ],
      answer: 0,
      explain:
        "`RefCell` até funciona — converte a restrição de compilação numa de runtime — mas apelar para ele para satisfazer um bound apertado demais é resolver o problema da sua API dentro do código de quem te usa.",
    },
    {
      kind: "editor",
      intro: `### O compilador escolhe a trait

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` devolvendo \`f(1) + f(2)\`. Chame com uma closure que multiplica por um \`factor = 10\` capturado.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` chamando \`f()\` duas vezes. Chame com uma closure que incrementa um \`count\` capturado, e depois imprima \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` chamando \`f()\` uma vez. Chame com uma closure \`move\` que devolve uma \`String\` capturada.

Saída esperada:

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\``,
    },
  ],

  "rust-collections-iterators-7": [
    {
      kind: "theory",
      body: `Por padrão uma closure captura por referência — o mínimo que ela consegue. Isso é certo para uma closure usada na hora, e errado para uma que **sobrevive ao escopo em que foi criada**.

\`move\` força toda captura a ser tomada por valor:

\`\`\`rust
fn make_greeter(name: String) -> Box<dyn Fn() -> String> {
    Box::new(move || format!("hello {name}"))
}
\`\`\`

Sem \`move\`, a closure guardaria uma referência a \`name\`, que morre quando a função retorna. Com ele, a closure é dona de \`name\` e pode ir a qualquer lugar.`,
    },
    {
      kind: "theory",
      body: `Duas formas de retornar uma closure, e a escolha é o mesmo trade generic-versus-objeto de antes:

**\`impl Fn() -> T\`** — um tipo anônimo concreto, dispatch estático, sem alocação. Use quando a função devolve exatamente uma closure.

**\`Box<dyn Fn() -> T>\`** — alocada na heap, dispatch dinâmico. Necessária quando ramos diferentes devolvem closures *diferentes*, ou quando você precisa guardar várias numa coleção.

\`\`\`rust
fn make_counter(start: u32) -> impl FnMut() -> u32 {
    let mut n = start;
    move || { n += 1; n }
}
\`\`\`

Essa closure é dona de \`n\`. Cada chamada muta o próprio estado e ele sobrevive a todas as chamadas — isso é uma máquina de estados sem declarar struct nenhuma.`,
    },
    {
      kind: "quiz",
      question:
        "Uma função devolve `impl Fn() -> String` sobre uma `String` construída localmente, sem `move`. O que acontece?",
      options: [
        "Não compila — a closure empresta uma variável local que morre quando a função retorna",
        "Compila, e a closure devolvida vê uma string vazia",
        "Compila; Rust estende o tempo de vida da local para casar com a closure",
      ],
      answer: 0,
      explain:
        "É um dos avisos de `move` mais comuns da linguagem, e a sugestão do compilador é exatamente a certa: adicione `move`.",
    },
    {
      kind: "fill",
      prompt:
        "Devolva uma closure que é dona do próprio estado, com dispatch estático e sem alocação.",
      file: "main.rs",
      before: "fn make_counter(start: u32) -> ",
      after: " {\n    let mut n = start;\n    move || { n += 1; n }\n}",
      choices: ["impl FnMut() -> u32", "Box<dyn Fn() -> u32>", "fn() -> u32"],
      answer: 0,
      explain:
        "Precisa ser `FnMut` (ela muta `n`), e `impl` evita a box. `fn() -> u32` é um ponteiro de função simples, que não carrega estado capturado nenhum.",
    },
    {
      kind: "quiz",
      question:
        "Quando é obrigatório pôr numa box a closure retornada em vez de usar `impl Fn`?",
      options: [
        "Quando ramos diferentes devolvem closures diferentes — `impl Trait` nomeia um único tipo concreto",
        "Sempre que a closure é `move`",
        "Sempre que a closure captura mais de uma variável",
      ],
      answer: 0,
      explain:
        "Toda closure é seu próprio tipo anônimo, então dois literais de closure são dois tipos mesmo que pareçam idênticos. `impl Trait` só pode representar um deles.",
    },
    {
      kind: "editor",
      intro: `### Closures que sobrevivem ao próprio escopo

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — é dona de \`n\`, incrementa e devolve a cada chamada.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — devolve \`"hello <name>"\`.
3. Em \`main\`, chame o contador três vezes em bindings separados e imprima os três numa linha, depois imprima a saída do greeter para \`rpc\`.

Saída esperada:

\`\`\`text
11 12 13
hello rpc
\`\`\`

O contador começa em \`10\`. Ligue cada chamada à própria variável antes de imprimir — três borrows \`&mut\` dentro de um \`println!\` é uma briga desnecessária.`,
    },
  ],
};
