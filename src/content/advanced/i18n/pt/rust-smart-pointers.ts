import type { LessonStep } from "@/content/steps";

// PT · Smart pointers e mutabilidade interior.

export const rustSmartPointersStepsPt: Record<string, LessonStep[]> = {
  "rust-smart-pointers-1": [
    {
      kind: "theory",
      body: `\`Box<T>\` é o smart pointer mais simples: uma alocação na heap, um dono, liberada quando a box cai. Ele não acrescenta contagem de referências nem checagem em runtime.

O uso que o define é dar a um **tipo recursivo um tamanho conhecido**:

\`\`\`rust
enum Expr {
    Num(i64),
    Add(Expr, Expr),        // erro: recursive type has infinite size
}
\`\`\`

Para dispor \`Expr\` na memória, o compilador precisa saber o tamanho de \`Expr\` — o que exige saber o tamanho de \`Expr\`. Uma box quebra o laço: ela tem sempre a largura de um ponteiro, aponte para o que apontar.`,
    },
    {
      kind: "theory",
      body: `\`\`\`rust
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),   // ok — dois ponteiros
}
\`\`\`

É assim que toda árvore, lista e AST é construída em Rust, e é o que \`Box<dyn Trait>\` também está fazendo: \`dyn Trait\` não tem tamanho conhecido, então vive atrás de um ponteiro.

Casar através de uma box não exige nada de especial — \`match e { Expr::Add(a, b) => ... }\` te dá \`&Box<Expr>\`, e a deref coercion permite passar direto para uma função que recebe \`&Expr\`.

O custo é uma alocação por nó e um salto de ponteiro por passo de travessia. Para uma AST isso é nada. Para uma estrutura quente com milhões de nós, é o motivo pelo qual existem arena allocators.`,
    },
    {
      kind: "quiz",
      question: "Por que um enum recursivo precisa de um `Box` em volta do próprio tipo?",
      options: [
        "O compilador precisa calcular um tamanho fixo para o tipo, e uma variante aninhada diretamente torna esse tamanho infinito",
        "Recursão só é permitida sobre dados alocados na heap em Rust",
        "Sem `Box` o enum seria copiado a cada match",
      ],
      answer: 0,
      explain:
        "Uma `Box` tem a largura de um ponteiro independentemente do que aponta, então o cálculo de tamanho termina. A alocação na heap é consequência, não o objetivo.",
    },
    {
      kind: "fill",
      prompt: "Torne a variante recursiva representável.",
      file: "main.rs",
      before: "enum Expr {\n    Num(i64),\n    Add(",
      after: ", Box<Expr>),\n}",
      choices: ["Box<Expr>", "Expr", "&Expr"],
      answer: 0,
      explain:
        "`&Expr` também teria a largura de um ponteiro, mas empresta — o enum precisaria de um parâmetro de lifetime e não poderia ser dono dos filhos.",
    },
    {
      kind: "quiz",
      question:
        "O que `Box<T>` acrescenta sobre guardar um `T` diretamente, além da alocação na heap?",
      options: [
        "Nada — sem contagem de referências, sem checagem de borrow em runtime, ownership único como sempre",
        "Ownership compartilhado, como um `Rc` leve",
        "Mutabilidade interior, para o valor poder ser alterado por uma referência compartilhada",
      ],
      answer: 0,
      explain:
        "`Box` é o único smart pointer sem semântica extra. É por isso que ele é o padrão certo sempre que você precisa de indireção e nada mais.",
    },
    {
      kind: "editor",
      intro: `### Uma árvore de expressão

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`.
2. \`fn eval(e: &Expr) -> i64\` casando as duas variantes e recorrendo no \`Add\`.
3. Em \`main\`, monte \`2 + (3 + 4)\` como árvore, imprima o valor avaliado, e depois imprima a árvore com \`{:?}\`.

Saída esperada:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

Repare que o \`Debug\` da \`Box\` é transparente — ele imprime o que ela aponta.`,
    },
  ],

  "rust-smart-pointers-2": [
    {
      kind: "theory",
      body: `\`Rc<T>\` é **ownership compartilhado com contagem de referências**, para uma única thread. Todo \`Rc::clone\` incrementa um contador; todo drop decrementa. O valor é liberado quando a contagem chega a zero.

\`\`\`rust
let config = Rc::new(String::from("timeout=30s"));
let a = Rc::clone(&config);        // contagem: 2
let b = Rc::clone(&config);        // contagem: 3
drop(b);                           // contagem: 2
\`\`\`

\`Rc::clone(&x)\` é idiomático em vez de \`x.clone()\`, e o motivo é legibilidade: fica óbvio no call site que aquilo é um incremento barato de contador, não uma cópia profunda dos dados.`,
    },
    {
      kind: "theory",
      body: `Duas propriedades decidem quando \`Rc\` é a ferramenta certa.

**Ele é imutável.** \`Rc<T>\` te dá \`&T\` e nada mais. Vários donos cada um com \`&mut T\` quebrariam a regra de aliasing, então mutar exige combiná-lo com \`RefCell\` — a próxima lição.

**Ele não é \`Send\`.** O contador é um inteiro comum com incrementos não atômicos, então duas threads clonando ao mesmo tempo o corromperiam. O compilador rejeita isso em tempo de compilação, e é por isso que a versão multithread, \`Arc\`, existe como tipo separado: você paga o contador atômico só quando de fato compartilha entre threads.

Use \`Rc\` para um grafo ou árvore onde nós têm vários pais, ou para configuração compartilhada por muitos donos single-thread. Apele para ele *depois* de tentar borrows simples — um \`&T\` não custa nada e normalmente basta.`,
    },
    {
      kind: "quiz",
      question:
        "Por que `Rc::clone(&x)` é preferido a `x.clone()` se os dois compilam para a mesma coisa?",
      options: [
        "Ele faz o call site dizer 'isto é um incremento de contador', não 'isto copia os dados a fundo'",
        "`x.clone()` faz uma cópia profunda do valor interno",
        "`x.clone()` não incrementa a contagem de referências",
      ],
      answer: 0,
      explain:
        "É pura convenção de legibilidade, e valiosa: `clone()` numa struct grande normalmente significa alocação, então distinguir o caso barato de relance vale os caracteres a mais.",
    },
    {
      kind: "fill",
      prompt: "Leia quantos donos seguram o valor no momento.",
      file: "main.rs",
      before: 'println!("count: {}", Rc::',
      after: "(&config));",
      choices: ["strong_count", "len", "count"],
      answer: 0,
      explain:
        "`strong_count` é a contagem de donos. A contraparte `weak_count` rastreia handles `Weak` não-possessivos, que não mantêm o valor vivo.",
    },
    {
      kind: "quiz",
      question: "Por que `Rc<T>` deliberadamente não é `Send`?",
      options: [
        "O contador usa incrementos não atômicos, então duas threads clonando ao mesmo tempo o corromperiam",
        "O valor apontado é sempre alocado na heap, e a heap é local à thread",
        "Ele é `Send`, mas só quando `T: Sync`",
      ],
      answer: 0,
      explain:
        "É uma separação deliberada e não um descuido: código single-thread não deveria pagar por atomics. `Arc` é o mesmo tipo com contador atômico.",
    },
    {
      kind: "editor",
      intro: `### Conte os donos

1. Embrulhe uma \`String\` com \`timeout=30s\` num \`Rc\` e imprima \`Rc::strong_count\`.
2. Faça dois clones com \`Rc::clone\`, imprima a contagem de novo, e imprima o valor por um deles.
3. Faça \`drop\` de um clone e imprima a contagem mais uma vez.

Saída esperada:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\``,
    },
  ],

  "rust-smart-pointers-3": [
    {
      kind: "theory",
      body: `\`RefCell<T>\` move a checagem de borrow do **tempo de compilação para o runtime**. A regra é a mesma — vários borrows compartilhados ou um exclusivo — mas agora é contada em runtime, e violá-la causa **panic** em vez de erro de compilação.

\`\`\`rust
let cell = RefCell::new(Vec::new());
cell.borrow_mut().push("started");    // &mut, liberado no fim do statement
println!("{}", cell.borrow().len());  // & — ok, o borrow mut já acabou
\`\`\`

Isso é **mutabilidade interior**: mutar através de um \`&self\`. É o que permite a um \`Rc<RefCell<T>>\` dar a vários donos a capacidade de escrever.`,
    },
    {
      kind: "theory",
      body: `O panic é o preço, e é real — um crash em runtime em troca de um padrão que o compilador não conseguia verificar. Dois hábitos deixam isso administrável.

**Mantenha os guards de vida curta.** \`cell.borrow_mut().push(x)\` libera no fim do statement. \`let g = cell.borrow_mut();\` segura até o fim do escopo, e qualquer \`borrow()\` no meio dá panic. É a mesma armadilha de \`Drop\` versus NLL do \`MutexGuard\`.

**Use \`try_borrow_mut\` quando um conflito for plausível.** Ele devolve um \`Result\` em vez de dar panic, o que transforma um crash numa decisão.

\`\`\`rust
let held = log.borrow();
log.try_borrow_mut().is_ok()    // false — há um borrow compartilhado aberto
\`\`\`

\`Cell<T>\` é o irmão mais barato para tipos \`Copy\`: \`get\`/\`set\` sem rastrear borrow e sem possibilidade de panic, porque ele nunca entrega uma referência.`,
    },
    {
      kind: "quiz",
      question: "O que `RefCell` muda em relação às regras normais de borrow?",
      options: [
        "Nada nas regras — só *quando* elas são checadas, movendo da compilação para o runtime, onde violar dá panic",
        "Permite vários borrows mutáveis simultâneos",
        "Torna o valor seguro para compartilhar entre threads",
      ],
      answer: 0,
      explain:
        "A última alternativa é uma confusão comum e perigosa: `RefCell` é `!Sync`, então não pode ser compartilhado entre threads de jeito nenhum. `Mutex` é a contraparte multithread.",
    },
    {
      kind: "fill",
      prompt:
        "Tente um borrow exclusivo sem arriscar panic caso já exista um aberto.",
      file: "main.rs",
      before: "log.",
      after: "().is_ok()",
      choices: ["try_borrow_mut", "borrow_mut", "get_mut"],
      answer: 0,
      explain:
        "`borrow_mut` dá panic no conflito. `get_mut` recebe `&mut self`, então exige acesso exclusivo ao próprio `RefCell` — exatamente o que você não tem quando ele está dentro de um `Rc`.",
    },
    {
      kind: "quiz",
      question:
        "Um serviço dá panic intermitente com 'already borrowed: BorrowMutError'. Qual a causa usual?",
      options: [
        "Um guard `Ref` está sendo segurado através de uma chamada que empresta de novo — o guard vive até o fim do escopo, não até o último uso",
        "Duas threads estão emprestando o `RefCell` ao mesmo tempo",
        "O `RefCell` foi criado antes do `Rc` que o guarda",
      ],
      answer: 0,
      explain:
        "Não podem ser threads: `RefCell` é `!Sync`, então o compilador já impediu isso. É quase sempre um guard segurado mais tempo que o pretendido — delimite com um bloco, ou clone o valor para fora.",
    },
    {
      kind: "editor",
      intro: `### Borrow checado em runtime

1. Monte um \`Rc<RefCell<Vec<String>>>\` com um vetor vazio.
2. Por um **clone** do \`Rc\`, empurre \`started\` e depois \`ready\` — cada um no próprio statement, para o guard ser liberado a cada vez.
3. Imprima o tamanho, e depois a primeira entrada.
4. Segure um borrow compartilhado numa variável, imprima se \`try_borrow_mut()\` dá certo, depois faça \`drop\` da variável e imprima de novo.

Saída esperada:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\``,
    },
  ],

  "rust-smart-pointers-4": [
    {
      kind: "theory",
      body: `Contagem de referências tem uma falha clássica: o **ciclo**. Se A é dono de B e B é dono de A, nenhuma contagem chega a zero e a memória nunca é liberada. Rust não impede isso — é vazamento, não unsoundness, e o borrow checker não tem nada a dizer a respeito.

O formato padrão onde isso aparece é uma árvore com links para o pai:

\`\`\`text
root.children  ->  Rc<Node>   (forte)
leaf.parent    ->  Rc<Node>   (forte)  // ciclo: nada nunca é liberado
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`Weak<T>\` quebra isso. Um handle fraco **não** é dono do valor e não o mantém vivo:

\`\`\`rust
parent: RefCell<Weak<Node>>          // Rc::downgrade(&root)
children: RefCell<Vec<Rc<Node>>>     // forte, como antes
\`\`\`

Como um \`Weak\` pode apontar para algo já liberado, você não lê por ele diretamente. \`upgrade()\` devolve \`Option<Rc<T>>\` — \`Some\` se o valor ainda vive, \`None\` se já foi. Esse \`Option\` é a história de segurança inteira.

A regra para levar: **ownership desce, referências sobem.** Pais são donos fortes dos filhos; filhos apontam de volta fracamente. O mesmo vale para listas de observers e caches — o cache guarda \`Weak\`, então cachear algo nunca o mantém vivo sozinho.`,
    },
    {
      kind: "quiz",
      question: "Por que `Weak::upgrade()` devolve `Option<Rc<T>>` e não `Rc<T>`?",
      options: [
        "O valor pode já ter sido dropado — um handle fraco não o mantém vivo, então ele pode ter sumido",
        "O upgrade pode falhar se a contagem forte estiver no máximo",
        "Ele devolve `None` enquanto outra thread segura o valor",
      ],
      answer: 0,
      explain:
        "Esse `Option` é o ponto inteiro do `Weak`: ele torna 'a coisa que eu aponto pode ter sumido' um valor que você é obrigado a tratar, em vez de um ponteiro pendurado.",
    },
    {
      kind: "fill",
      prompt: "Crie um handle não-possessivo de volta para o pai.",
      file: "main.rs",
      before: "parent: RefCell::new(Rc::",
      after: "(&root)),",
      choices: ["downgrade", "clone", "new"],
      answer: 0,
      explain:
        "`Rc::downgrade` produz um `Weak` e incrementa só a contagem fraca. `Rc::clone` incrementaria a forte e recriaria o ciclo.",
    },
    {
      kind: "quiz",
      question:
        "Um cache guarda `Rc<Entry>` e a memória cresce sem limite mesmo depois de todo usuário terminar. Qual a correção?",
      options: [
        "Guardar `Weak<Entry>` no cache, para que cachear uma entrada não a mantenha viva sozinho",
        "Chamar `drop` no cache periodicamente",
        "Trocar `Rc` por `Box`, que libera de forma determinística",
      ],
      answer: 0,
      explain:
        "Um cache que guarda referências fortes não é um cache, é um vazamento com tabela de consulta. `Weak` deixa as entradas morrerem quando os donos de verdade terminam, e `upgrade()` te diz quando isso aconteceu.",
    },
    {
      kind: "editor",
      intro: `### Ownership desce, referências sobem

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`.
2. Monte um \`root\` com pai \`Weak::new()\` vazio, e depois um \`leaf\` cujo pai é \`Rc::downgrade(&root)\`.
3. Empurre um clone de \`leaf\` nos filhos de \`root\`.
4. Imprima a contagem forte de \`root\`, depois a contagem fraca.
5. Faça \`upgrade()\` do pai do leaf e imprima o nome com \`{:?}\`, mapeando para uma \`String\` clonada.

Saída esperada:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

A contagem forte do root fica em 1 — é o ciclo não se formando.`,
    },
  ],

  "rust-smart-pointers-5": [
    {
      kind: "theory",
      body: `\`Cow<'a, T>\` — clone on write — é um enum com duas variantes:

\`\`\`rust
enum Cow<'a, T> {
    Borrowed(&'a T),
    Owned(T::Owned),
}
\`\`\`

Ele permite a uma função devolver dado emprestado no caminho comum e dado próprio só quando de fato precisou mudar algo:

\`\`\`rust
fn sanitize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))   // alocou: mudamos
    } else {
        Cow::Borrowed(input)                  // de graça: nada a fazer
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Quem chama não se importa com qual variante recebeu — \`Cow<str>\` faz deref para \`&str\`, então lê como uma string dos dois jeitos.

O ganho aparece quando o caminho que modifica é raro. Sanitizar um milhão de identificadores dos quais doze têm espaço faz doze alocações, onde devolver \`String\` incondicionalmente faria um milhão.

A casa mais comum dele é a borda de parsing: decodificar percent-encoding de uma URL, desescapar um header, normalizar um valor de config. Quando a entrada já está boa — o que quase sempre é o caso — nada é copiado.

Duas notas menores. \`.into_owned()\` força a forma própria quando você precisa guardar. E se o caminho que modifica for o comum, largue o \`Cow\`: você está pagando um discriminante de enum e um branch para evitar uma alocação que quase sempre acontece.`,
    },
    {
      kind: "quiz",
      question: "Quando o `Cow` realmente compensa?",
      options: [
        "Quando o caminho que modifica é raro, então a maioria das chamadas devolve um borrow e não aloca nada",
        "Sempre — ele é estritamente mais barato que devolver `String`",
        "Quando a entrada é grande, independentemente de com que frequência é modificada",
      ],
      answer: 0,
      explain:
        "Se toda chamada modifica, o `Cow` adiciona um discriminante e um branch e depois aloca do mesmo jeito. É uma aposta no caso comum, e uma aposta ruim custa um pouco.",
    },
    {
      kind: "fill",
      prompt: "Devolva a entrada intocada, sem alocar.",
      file: "main.rs",
      before: "        Cow::",
      after: "(input)",
      choices: ["Borrowed", "Owned", "From"],
      answer: 0,
      explain:
        "`Cow::Owned(input.to_string())` compilaria e estaria correto — e alocaria exatamente no caminho que esse tipo inteiro existe para manter de graça.",
    },
    {
      kind: "quiz",
      question:
        "Quem chama precisa guardar o resultado de uma função que devolve `Cow` numa struct de vida longa. O que precisa acontecer?",
      options: [
        "Chamar `.into_owned()` — a variante emprestada está amarrada ao lifetime da entrada e não pode ser guardada",
        "Nada; `Cow` é `'static` por construção",
        "Embrulhar num `Rc` para estender o lifetime",
      ],
      answer: 0,
      explain:
        "É o momento em que a alocação adiada é finalmente paga, e pagá-la aqui está certo: o valor agora está sendo retido em vez de usado e descartado.",
    },
    {
      kind: "editor",
      intro: `### Aloque só quando precisar

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — se a entrada tiver espaço, devolva \`Cow::Owned\` com espaços trocados por \`_\`; senão devolva \`Cow::Borrowed\`.
2. Chame com \`"get_events"\` e com \`"get events now"\`.
3. Para cada, imprima o valor e se é a variante emprestada, usando \`matches!(&value, Cow::Borrowed(_))\` calculado antes num binding próprio.

Saída esperada:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\``,
    },
  ],

  "rust-smart-pointers-6": [
    {
      kind: "theory",
      body: `\`Deref\` é o que faz um smart pointer parecer com aquilo que ele embrulha. Implementá-lo te dá duas coisas de uma vez:

- o operador \`*\`
- **deref coercion** — \`&Wrapper<T>\` é aceito onde se espera \`&T\`, e \`wrapper.method()\` encontra os métodos de \`T\`

\`\`\`rust
impl<T> Deref for Tracked<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.inner }
}
\`\`\`

É exatamente assim que \`Box\`, \`Rc\`, \`Arc\`, \`String\` (para \`str\`) e \`Vec\` (para \`[T]\`) funcionam. Não há mágica de compilador em nenhum deles.`,
    },
    {
      kind: "theory",
      body: `A resolução de métodos procura no próprio tipo **primeiro**, e só então segue o \`Deref\` para fora. Ou seja, um método inerente do wrapper sombreia um método de mesmo nome no alvo — que é por que o \`Rc\` usa funções associadas (\`Rc::clone(&x)\`, \`Rc::strong_count(&x)\`) em vez de métodos: elas não podem sombrear nada em \`T\`.

A orientação da biblioteca padrão é estreita e vale respeitar: **implemente \`Deref\` só para smart pointers.** Usá-lo para simular herança — um \`Dog\` que faz deref para um \`Animal\` — produz resolução de métodos surpreendente e mensagens de erro que apontam para o tipo errado.

\`DerefMut\` é o mesmo para \`&mut\`, e exige \`Deref\`. Repare que \`deref\` é uma chamada de método de verdade: colocar trabalho dentro dele, como o exercício faz, significa que ele roda a cada coerção implícita.`,
    },
    {
      kind: "quiz",
      question:
        "Por que o `Rc` expõe `Rc::strong_count(&x)` como função associada e não como método?",
      options: [
        "Um método sombrearia qualquer método de mesmo nome no tipo embrulhado, já que os métodos do wrapper são encontrados primeiro",
        "Funções associadas são mais rápidas que métodos",
        "Métodos não podem ser chamados em tipos que implementam `Deref`",
      ],
      answer: 0,
      explain:
        "A convenção `Rc::clone(&x)` tem esse mesmo segundo motivo além da legibilidade: como função associada, ela nunca pode sombrear acidentalmente `T::clone`.",
    },
    {
      kind: "fill",
      prompt: "Nomeie o tipo para o qual este wrapper faz deref.",
      file: "main.rs",
      before: "impl<T> Deref for Tracked<T> {\n    type ",
      after: " = T;",
      choices: ["Target", "Item", "Output"],
      answer: 0,
      explain:
        "`Target` é o associated type de `Deref`. `Item` pertence a `Iterator` e `Output` às traits de operador, como `Add`.",
    },
    {
      kind: "quiz",
      question:
        "Por que implementar `Deref` para modelar herança é considerado antipadrão?",
      options: [
        "A resolução de métodos procura no alvo em silêncio, então chamadas e mensagens de erro apontam para um tipo que o leitor nunca nomeou",
        "É erro de compilação fora da biblioteca padrão",
        "`Deref` só pode ser implementado para tipos que guardam um ponteiro",
      ],
      answer: 0,
      explain:
        "Compila perfeitamente. O custo é legibilidade: um leitor não consegue dizer de qual tipo veio um método, e a mensagem de erro também não quando dá ruim.",
    },
    {
      kind: "editor",
      intro: `### Construa um smart pointer

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` com \`fn new(inner: T) -> Self\` e \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` com \`type Target = T\`, incrementando \`reads\` antes de devolver \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` devolvendo \`&mut self.inner\` (sem contar).
4. Em \`main\`, embrulhe \`vec![1, 2, 3]\`, imprima \`.len()\` pela coerção, faça \`push(4)\` pelo \`DerefMut\`, imprima \`*v\` com \`{:?}\`, e depois imprima a contagem de leituras.

Saída esperada:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Duas leituras: \`.len()\` e \`*v\`. O \`push\` passa por \`deref_mut\`, e \`reads()\` é inerente, então nunca coage.`,
    },
  ],
};
