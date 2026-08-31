import type { LessonStep } from "@/content/steps";

// PT · Macros, unsafe, FFI e dinheiro.

export const rustSystemsEdgesStepsPt: Record<string, LessonStep[]> = {
  "rust-systems-edges-1": [
    {
      kind: "theory",
      body: `Tudo em Rust é **privado por padrão**, e a árvore de módulos é o que torna uma invariante imposta em vez de meramente documentada.

\`\`\`rust
mod ledger {
    pub struct Balance { stroops: i64 }   // tipo público, campo privado
}
\`\`\`

Fora de \`ledger\`, ninguém consegue construir um \`Balance\` com um literal, ler \`stroops\` direto, nem mutá-lo. A única entrada é o construtor que você expôs — então "um saldo nunca é negativo" deixa de ser comentário e vira propriedade do tipo.`,
    },
    {
      kind: "theory",
      body: `Quatro níveis de visibilidade, na ordem em que você deveria recorrer a eles:

| escrito | visível para |
| --- | --- |
| *(nada)* | este módulo e os descendentes |
| \`pub(crate)\` | qualquer lugar deste crate |
| \`pub(super)\` | o módulo pai |
| \`pub\` | qualquer um, inclusive outros crates |

\`pub(crate)\` é o subutilizado. É o nível certo para um helper que vários módulos compartilham mas que nunca deve aparecer na sua API pública — e, diferente de \`pub\`, mudá-lo depois não é uma quebra para quem te usa.

A convenção de layout: \`mod\` declara, \`use\` importa, \`super::\` sobe, \`crate::\` parte da raiz. Um \`lib.rs\` que é quase só linhas de \`pub mod\` e \`pub use\` é a API pública inteira num arquivo legível, que é exatamente o que ele deveria ser.`,
    },
    {
      kind: "quiz",
      question:
        "`pub struct Balance { stroops: i64 }` — o que código de fora do módulo consegue fazer com ele?",
      options: [
        "Só o que as funções públicas do módulo permitirem — o campo é privado, então nada de construção por literal e nada de leitura direta",
        "Tudo; `pub` na struct torna os campos públicos também",
        "Nada; o tipo é inutilizável fora do módulo dele",
      ],
      answer: 0,
      explain:
        "A privacidade de campo é por campo e o padrão é privado. É o mecanismo por trás de todo tipo 'parse, don't validate' em Rust — o construtor é a única porta.",
    },
    {
      kind: "fill",
      prompt:
        "Exponha um helper ao crate inteiro sem adicioná-lo à API pública.",
      file: "main.rs",
      before: "    ",
      after: " fn raw(&self) -> i64 {",
      choices: ["pub(crate)", "pub", "pub(super)"],
      answer: 0,
      explain:
        "`pub(crate)` o mantém fora da superfície publicada, então ele pode mudar sem release quebrado. `pub(super)` só alcançaria o módulo pai.",
    },
    {
      kind: "quiz",
      question:
        "Por que tornar um helper `pub` em vez de `pub(crate)` importa além de estilo?",
      options: [
        "`pub` faz parte do seu contrato de semver — removê-lo ou mudá-lo depois é uma release quebrada",
        "Itens `pub` são compilados separadamente e deixam o build mais lento",
        "`pub` desabilita inlining através das fronteiras de módulo",
      ],
      answer: 0,
      explain:
        "Todo item `pub` é uma promessa a estranhos. A visibilidade mais estreita que compila é a que te deixa livre para mudar de ideia.",
    },
    {
      kind: "editor",
      intro: `### Torne a invariante inquebrável

1. \`mod ledger\` contendo \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — o **campo continua privado**.
2. Em \`impl Balance\`: \`pub fn new(stroops: i64) -> Option<Balance>\` devolvendo \`None\` para valor negativo, \`pub fn stroops(&self) -> i64\`, e \`pub(crate) fn raw(&self) -> i64\`.
3. Em \`main\`, faça \`use ledger::Balance;\` e imprima \`new(250)\` mapeado para os stroops, \`new(-1)\` do mesmo jeito, e \`raw()\` num saldo válido.

Saída esperada:

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

Não há como construir um \`Balance\` negativo a partir do \`main\`. Esse é o ponto.`,
    },
  ],

  "rust-systems-edges-2": [
    {
      kind: "theory",
      body: `\`macro_rules!\` casa **sintaxe** e expande para mais sintaxe, antes da checagem de tipos. Ele faz o que uma função não pode:

- receber um número variável de argumentos
- aceitar argumentos de tipos diferentes na mesma posição
- capturar o *texto-fonte* de uma expressão (é assim que o \`assert_eq!\` imprime os dois lados)

\`\`\`rust
macro_rules! metric {
    ($name:expr, $value:expr) => { format!("{}={}", $name, $value) };
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Dois mecanismos fazem a maior parte do trabalho.

**Fragment specifiers** dizem que tipo de sintaxe cada captura aceita: \`expr\`, \`ident\`, \`ty\`, \`literal\`, \`block\`, \`pat\`, \`tt\`. Usar o mais estreito dá erros melhores — \`$n:ident\` rejeita uma expressão inteira no ponto de chamada da macro, em vez de lá no fundo da expansão.

**Repetição.** \`$( ... ),+\` casa um ou mais grupos separados por vírgula, e o mesmo \`$( ... )+\` no corpo emite uma cópia por casamento:

\`\`\`rust
($name:expr, $value:expr, $($k:expr => $v:expr),+) => {{
    let mut out = format!("{}={}", $name, $value);
    $( out.push_str(&format!(",{}={}", $k, $v)); )+
    out
}};
\`\`\`

Repare nas chaves duplas: \`{{ ... }}\` faz a expansão ser uma expressão de bloco, então ela pode conter statements e ainda assim avaliar para um valor.

A disciplina: **tente uma função primeiro.** Uma macro é mais difícil de ler, mais difícil de depurar, e invisível ao go-to-definition do \`rust-analyzer\`. Use uma quando o que você precisa genuinamente não puder ser função — argumentos variádicos, ou captura de texto-fonte.`,
    },
    {
      kind: "quiz",
      question: "O que uma macro `macro_rules!` faz que uma função não faz?",
      options: [
        "Receber um número variável de argumentos, misturar tipos numa posição, e capturar o texto-fonte de uma expressão",
        "Rodar mais rápido, por ser expandida em tempo de compilação",
        "Acessar campos privados de tipos de outros módulos",
      ],
      answer: 0,
      explain:
        "Velocidade não é motivo: uma macro expande para código que o otimizador vê exatamente como veria uma função inlinada. Variádicos e captura de fonte são as motivações reais, e as únicas.",
    },
    {
      kind: "fill",
      prompt: "Case um ou mais pares chave/valor separados por vírgula.",
      file: "main.rs",
      before: "($name:expr, $value:expr, $($k:expr => $v:expr)",
      after: ") => {{",
      choices: [",+", "*", ";?"],
      answer: 0,
      explain:
        "`,+` significa 'um ou mais, separados por vírgula'. `,*` permitiria zero, o que aqui colide com a regra de dois argumentos logo acima.",
    },
    {
      kind: "quiz",
      question: "Por que `{{ ... }}` é usado no corpo de uma expansão de macro?",
      options: [
        "As chaves internas fazem a expansão ser uma expressão de bloco, então ela pode conter statements e ainda avaliar para um valor",
        "Elas escapam as chaves para que apareçam literalmente na saída",
        "É sintaxe obrigatória em qualquer macro com repetição",
      ],
      answer: 0,
      explain:
        "O par externo delimita a expansão; o interno é um bloco Rust de verdade. Sem ele, uma expansão com vários statements não pode ser usada onde se espera um valor.",
    },
    {
      kind: "editor",
      intro: `### Uma macro que uma função não substituiria

Escreva \`macro_rules! metric\` com duas regras:

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → o mesmo, e depois \`",<k>=<v>"\` acrescentado por par.

Chame duas vezes: com \`("requests", 42)\`, e com \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Saída esperada:

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

Duas aridades diferentes, e a segunda é variádica — que é exatamente por que isso não pode ser uma função.`,
    },
  ],

  "rust-systems-edges-3": [
    {
      kind: "theory",
      body: `\`#[derive(...)]\` é uma **macro procedural**: ela recebe o token stream do seu tipo e devolve código gerado, que é compilado junto.

\`#[derive(Debug)]\` escreve um impl de \`Debug\` que imprime cada campo pelo nome. \`#[derive(Clone)]\` escreve um \`clone\` que clona cada campo. \`#[derive(PartialEq)]\` compara cada campo. \`#[derive(Default)]\` preenche cada campo com o default **dele próprio** — \`0\`, \`false\`, \`String::new()\`.

Nada é caso especial no compilador. A saída é Rust comum, e o \`cargo expand\` te mostra.`,
    },
    {
      kind: "theory",
      body: `Duas consequências para guardar.

**Um derive só consegue fazer o que as entradas permitem.** \`#[derive(Clone)]\` numa struct com um campo não-\`Clone\` falha — e o erro aponta para o derive, que é por que essas mensagens soam estranhas nas primeiras vezes.

**Atributos configuram o código gerado.** \`#[serde(rename = "type")]\`, \`#[serde(default)]\`, \`#[serde(skip)]\` são lidos pelo derive do Serde enquanto ele gera o impl. Não são features do compilador; são argumentos para uma macro.

Os três tipos de macro procedural, para o vocabulário ficar resolvido: **derive** (\`#[derive(Serialize)]\`), **atributo** (\`#[tokio::main]\`, que reescreve seu \`fn main\` num que inicia um runtime), e **tipo-função** (\`sqlx::query!\`, que acessa o banco em tempo de compilação para checar seu SQL). Os três são crates Rust comuns que rodam durante a compilação.`,
    },
    {
      kind: "quiz",
      question: "O que o `#[tokio::main]` de fato faz?",
      options: [
        "É uma macro de atributo que reescreve seu `async fn main` num `main` síncrono que monta um runtime e chama `block_on`",
        "Marca a função para o compilador linkar o runtime do Tokio",
        "É um builtin do compilador que habilita suporte a async",
      ],
      answer: 0,
      explain:
        "O `cargo expand` mostra a reescrita por inteiro — e é o mesmo `Runtime::new().block_on(...)` que você teria escrito. Saber disso torna óbvio o panic de 'cannot start a runtime from within a runtime'.",
    },
    {
      kind: "fill",
      prompt:
        "Dê à struct comparação por valor e um construtor zerado.",
      file: "main.rs",
      before: "#[derive(Debug, Clone, ",
      after: ")]\nstruct Config {",
      choices: ["PartialEq, Default", "Eq, New", "Copy, Default"],
      answer: 0,
      explain:
        "`Copy` falharia aqui: a struct guarda uma `String`, que é dona de uma alocação na heap e portanto não pode ser `Copy`.",
    },
    {
      kind: "quiz",
      question:
        "`#[derive(Clone)]` numa struct não compila. Qual é quase sempre a causa?",
      options: [
        "Um dos campos não é `Clone`, e o derive só consegue gerar o que as entradas suportam",
        "Falta `#[derive(Copy)]` na struct, que `Clone` exige",
        "A struct tem um parâmetro de lifetime, que derives não suportam",
      ],
      answer: 0,
      explain:
        "A dependência corre na direção oposta — `Copy` exige `Clone`, nunca o contrário. E derives lidam com lifetimes sem problema.",
    },
    {
      kind: "editor",
      intro: `### Veja o que um derive gera

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`.
2. Monte uma com endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, e faça \`clone()\`.
3. Imprima a original com \`{:?}\`, se as duas são iguais, e \`Config::default()\` com \`{:?}\`.

Saída esperada:

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Quatro impls, nenhum escrito por você — e cada um é Rust comum que você poderia ter escrito à mão.`,
    },
  ],

  "rust-systems-edges-4": [
    {
      kind: "theory",
      body: `\`unsafe\` não desliga o borrow checker. Ele destrava exatamente cinco capacidades:

1. dereferenciar um ponteiro cru
2. chamar uma função \`unsafe\`
3. acessar um \`static mut\`
4. implementar uma trait \`unsafe\`
5. acessar um campo de union

Todo o resto — ownership, borrowing, lifetimes, checagem de tipos — vale dentro de um bloco \`unsafe\` exatamente como fora.`,
    },
    {
      kind: "theory",
      body: `O que \`unsafe\` realmente significa é **"estou afirmando uma invariante que o compilador não consegue checar."** Então a habilidade em jogo — aquela pela qual quem revisa código de sistemas é pago — é enunciar essa invariante com precisão.

A convenção é um comentário \`// SAFETY:\` em todo bloco \`unsafe\`, dizendo *por que* a afirmação vale:

\`\`\`rust
// SAFETY: mid <= len, então as duas faixas estão na mesma alocação e não
// se sobrepõem — logo as duas &mut slices nunca fazem alias.
unsafe {
    (from_raw_parts_mut(ptr, mid), from_raw_parts_mut(ptr.add(mid), len - mid))
}
\`\`\`

Duas regras decorrem. **Mantenha o bloco o menor possível** — uma operação, não um corpo de função inteiro, para o leitor saber exatamente qual linha carrega a afirmação. E **uma função segura contendo \`unsafe\` está prometendo que a invariante vale para toda entrada possível**; se quem chama consegue quebrá-la com código seguro comum, a própria função precisa ser marcada \`unsafe\`.

O \`split_at_mut\` da biblioteca padrão é exatamente este programa: uma API que o borrow checker não consegue expressar, tornada segura por um argumento que o autor escreveu.`,
    },
    {
      kind: "quiz",
      question: "O que um bloco `unsafe` de fato muda?",
      options: [
        "Ele permite cinco operações específicas, como dereferenciar um ponteiro cru — ownership, borrowing e checagem de tipos não são afetados",
        "Ele desliga o borrow checker para o código contido",
        "Ele permite data races e pula checagens de limite",
      ],
      answer: 0,
      explain:
        "É o equívoco mais comum. Erros de borrow dentro de um bloco `unsafe` continuam sendo erros de borrow — `unsafe` é uma chave bem mais estreita do que a reputação sugere.",
    },
    {
      kind: "fill",
      prompt: "Documente a invariante que este bloco está afirmando.",
      file: "main.rs",
      before: "// ",
      after: ": mid <= len, então as duas faixas estão nos limites e não se sobrepõem.\nunsafe {",
      choices: ["SAFETY", "NOTE", "UNSAFE"],
      answer: 0,
      explain:
        "`// SAFETY:` é a convenção de todo o ecossistema, e o lint `undocumented_unsafe_blocks` do clippy procura exatamente esse prefixo.",
    },
    {
      kind: "quiz",
      question:
        "Quando uma função que contém um bloco `unsafe` precisa ser marcada `unsafe fn`?",
      options: [
        "Quando quem chama poderia quebrar a invariante usando só código seguro — aí a obrigação passa a ser de quem chama",
        "Sempre — qualquer função contendo `unsafe` precisa ser `unsafe`",
        "Nunca — marcar o bloco basta",
      ],
      answer: 0,
      explain:
        "É o projeto inteiro das abstrações seguras. `Vec::push` usa `unsafe` internamente e é seguro, porque nenhum chamador seguro consegue violar as invariantes dele. `slice::get_unchecked` é `unsafe` porque quem chama pode passar qualquer índice.",
    },
    {
      kind: "editor",
      intro: `### Uma API segura sobre um núcleo unsafe

Escreva \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` devolvendo duas metades mutáveis que não se sobrepõem — algo que o borrow checker não consegue expressar, e que a \`std\` oferece como \`split_at_mut\`.

Use \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\`, e um comentário \`// SAFETY:\` dizendo por que as duas slices nunca fazem alias.

Em \`main\`, divida \`[1, 2, 3, 4, 5, 6]\`, escreva \`100\` no primeiro elemento da metade esquerda e \`200\` no primeiro da direita, imprima as duas metades, e depois imprima o array inteiro.

Saída esperada:

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\``,
    },
  ],

  "rust-systems-edges-5": [
    {
      kind: "theory",
      body: `Um ponteiro cru — \`*const T\` ou \`*mut T\` — é um endereço simples. Ele não carrega lifetime, nem ownership, nem garantia de aliasing, e pode ser nulo ou desalinhado.

Criar um é **seguro**. Dereferenciar não é:

\`\`\`rust
let p: *mut i64 = &mut value;    // seguro — é só um endereço
unsafe { *p += 1; }              // unsafe — você está afirmando que é válido
\`\`\`

Essa separação é deliberada: segurar um endereço nunca pode corromper nada. Ler por ele pode.`,
    },
    {
      kind: "theory",
      body: `Dereferenciar afirma quatro coisas de uma vez, e as quatro são responsabilidade sua:

**Não nulo.** \`ptr::null()\` existe e \`is_null()\` checa — um ponteiro cru não tem nicho de \`Option\` em que se apoiar.
**Alinhado.** Um \`*mut i64\` precisa estar numa fronteira de 8 bytes. Uma leitura desalinhada é comportamento indefinido mesmo em hardware que tolera.
**Apontando para um valor vivo.** O original não pode ter sido dropado nem movido.
**Sem alias com um \`&mut\` vivo.** Essa é a que as pessoas perdem. O otimizador de Rust assume que \`&mut T\` é único, e escrever por um ponteiro cru que se sobrepõe a um \`&mut\` vivo quebra essa premissa — a miscompilação pode aparecer bem longe da linha ofensora.

\`ptr.add(n)\` faz aritmética de ponteiro em unidades de \`T\`, e exige que o resultado fique dentro da mesma alocação — um além do fim é permitido, qualquer coisa além é indefinido mesmo que você nunca leia.

A orientação prática: se você está apelando para ponteiros crus fora de FFI ou de uma estrutura de dados que o borrow checker genuinamente não consegue expressar, quase certamente existe um caminho seguro. Rode \`cargo miri test\` quando apelar — ele detecta a maioria dessas violações em runtime.`,
    },
    {
      kind: "quiz",
      question:
        "Por que criar um ponteiro cru é seguro e dereferenciar não é?",
      options: [
        "Segurar um endereço nunca pode corromper nada; ler ou escrever por ele afirma uma validade que o compilador não consegue checar",
        "A criação é checada em tempo de compilação, a dereferência em runtime",
        "Criar um ponteiro cru também é unsafe; o compilador simplesmente não impõe",
      ],
      answer: 0,
      explain:
        "É por isso que `&raw const x` e casts são operações seguras. A obrigação se prende ao ponto de uso, que é também onde o comentário `// SAFETY:` pertence.",
    },
    {
      kind: "fill",
      prompt: "Avance um ponteiro em dois elementos, não em dois bytes.",
      file: "main.rs",
      before: "unsafe { println!(\"offset 2: {}\", *base.",
      after: "(2)); }",
      choices: ["add", "offset_bytes", "wrapping_byte_add"],
      answer: 0,
      explain:
        "`add` conta em unidades de `T`, então `base.add(2)` num `*const i64` avança 16 bytes. O resultado precisa ficar dentro da mesma alocação.",
    },
    {
      kind: "quiz",
      question:
        "Qual violação de ponteiro cru mais provavelmente produz um bug que aparece longe da causa?",
      options: [
        "Escrever por um ponteiro cru que faz alias com um `&mut` vivo — o otimizador assumiu unicidade e miscompila em outro lugar",
        "Dereferenciar um ponteiro nulo, que quebra na hora",
        "Ler um elemento além do fim de um array",
      ],
      answer: 0,
      explain:
        "Uma dereferência nula dá segfault na linha. Uma violação de aliasing é silenciosa, e o código errado que o otimizador emitiu pode estar em outra função inteiramente — que é justamente para isso que o `cargo miri` existe.",
    },
    {
      kind: "editor",
      intro: `### Lide com endereços de propósito

1. Pegue \`let mut value = 42i64;\` e um \`*mut i64\` para ele. Num bloco \`unsafe\` com comentário \`// SAFETY:\`, incremente pelo ponteiro e imprima o valor lido de volta por ele. Depois imprima o binding original — mesmo valor.
2. Pegue \`let arr = [10i64, 20, 30];\` e o \`as_ptr()\` dele. Imprima o elemento no offset \`2\` via \`add\`.
3. Monte um \`std::ptr::null::<i64>()\` e imprima \`is_null()\` — chamada segura, sem bloco.

Saída esperada:

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\``,
    },
  ],

  "rust-systems-edges-6": [
    {
      kind: "theory",
      body: `Uma **ABI** é a convenção de chamada em nível de máquina: como argumentos são passados, como valores retornam, como uma struct é disposta na memória. A ABI própria de Rust é deliberadamente instável, então cruzar para C ou C++ significa optar pela deles.

Dois atributos fazem isso:

\`\`\`rust
#[repr(C)]                        // disponha esta struct como C disporia
pub struct Point { x: i64, y: i64 }

#[no_mangle]                      // mantenha o nome do símbolo como escrito
pub extern "C" fn point_sum(p: *const Point) -> i64
\`\`\`

Sem \`#[repr(C)]\`, Rust pode reordenar campos para compactar. Sem \`#[no_mangle]\`, o linker vê um símbolo mangled que nenhum chamador C encontra.`,
    },
    {
      kind: "theory",
      body: `A parte difícil de FFI não é sintaxe, é **ownership cruzando uma fronteira que o compilador não enxerga**.

\`\`\`rust
Box::into_raw(Box::new(Point { x, y }))   // ownership sai do Rust
drop(Box::from_raw(p))                    // ownership volta, liberado uma vez
\`\`\`

Entre essas duas chamadas, nada em Rust está rastreando aquele ponteiro. As regras que tornam isso sobrevivível:

**Todo \`into_raw\` precisa de exatamente um \`from_raw\` correspondente.** Zero vaza; dois é double free. Entregue a função de liberação junto com o construtor, e documente o par.

**Libere com o mesmo alocador que alocou.** Memória do \`Box\` de Rust precisa voltar para o Rust, nunca para o \`free\` do C, e vice-versa.

**Nunca deixe um panic cruzar a fronteira.** Desenrolar por frames de C é comportamento indefinido; capture com \`catch_unwind\` na borda e devolva um código de erro.

**Valide tudo que chega.** Um ponteiro vindo do C pode ser nulo, desalinhado ou pendurado — cheque o que der, e ponha o resto na documentação de \`# Safety\` da função.

Na prática, use \`cxx\` (uma ponte Rust/C++ checada) ou \`bindgen\` (gera declarações a partir de headers C) em vez de escrever declarações à mão. Os dois eliminam erros de transcrição, que são os que de fato mordem.`,
    },
    {
      kind: "quiz",
      question: "O que `#[repr(C)]` garante?",
      options: [
        "Os campos são dispostos na ordem de declaração com as regras de padding do C, para um programa C conseguir ler a struct",
        "A struct só pode ser usada a partir de código C",
        "Todo campo é convertido para um tipo C no acesso",
      ],
      answer: 0,
      explain:
        "A representação padrão de Rust pode reordenar campos para reduzir padding. É uma boa otimização e uma otimização fatal se algo do outro lado espera um layout fixo.",
    },
    {
      kind: "fill",
      prompt: "Entregue o ownership de um valor da heap através da fronteira.",
      file: "main.rs",
      before: "    Box::",
      after: "(Box::new(Point { x, y }))",
      choices: ["into_raw", "leak", "as_ref"],
      answer: 0,
      explain:
        "`into_raw` abre mão do ownership e devolve o ponteiro, que o `from_raw` pode reclamar depois. `Box::leak` também abre mão do ownership, mas devolve um `&'static mut` que nunca pode ser liberado.",
    },
    {
      kind: "quiz",
      question: "Por que um panic nunca pode cruzar uma fronteira de FFI?",
      options: [
        "Desenrolar por frames de stack de C é comportamento indefinido — capture na borda e devolva um código de erro",
        "C não consegue exibir a mensagem de panic",
        "O panic seria engolido em silêncio e o erro perdido",
      ],
      answer: 0,
      explain:
        'Funções `extern "C"` abortam em vez de desenrolar no Rust atual, o que transforma UB em crash. Embrulhar o corpo em `catch_unwind` e devolver um status é a versão que quem chama consegue tratar.',
    },
    {
      kind: "editor",
      intro: `### Ownership através da fronteira

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — precisa ser \`pub\`, já que as funções exportadas o mencionam.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — devolva \`0\` para nulo, senão \`x + y\`, com comentário \`// SAFETY:\`.
3. \`point_new(x, y) -> *mut Point\` via \`Box::into_raw\`, e \`point_free(p: *mut Point)\` via \`Box::from_raw\`, com checagem de nulo.
4. Em \`main\`: monte um ponto \`(3, 4)\`, imprima a soma, imprima o ponto pelo ponteiro cru, libere, imprima \`size_of::<Point>()\`, e depois imprima \`point_sum\` de um ponteiro nulo.

Saída esperada:

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Um \`into_raw\`, um \`from_raw\`. Esse par é o contrato inteiro.`,
    },
  ],

  "rust-systems-edges-7": [
    {
      kind: "theory",
      body: `**Um saldo nunca é um float.** \`f64\` não representa \`0.1\` com exatidão, então a aritmética acumula erro — e num livro-razão, erro é dinheiro que não bate.

\`\`\`rust
0.1f64 + 0.2f64 == 0.3     // false
\`\`\`

A resposta universal é **ponto fixo**: guarde a menor unidade indivisível como inteiro. A Stellar conta *stroops*, a \`10_000_000\` por XLM. A maioria das moedas conta centavos. Não há arredondamento, porque não há nada para arredondar.`,
    },
    {
      kind: "theory",
      body: `Inteiros não perdem precisão em silêncio, mas eles **estouram** — e em builds de release a checagem é removida, então \`i64::MAX + 1\` dá a volta para \`i64::MIN\` sem aviso. Um build de debug dá panic; produção não. Essa diferença já causou incidentes reais.

Então seja explícito. Rust dá quatro famílias, e a escolha é uma decisão de projeto:

| método | no estouro |
| --- | --- |
| \`checked_add\` | \`None\` — você trata |
| \`saturating_add\` | trava no máximo |
| \`wrapping_add\` | dá a volta |
| \`overflowing_add\` | \`(valor, bool)\` |

**Para dinheiro, sempre \`checked_\`.** Um saldo que estoura é um erro que quem chama precisa ver, não um valor para travar ou dar a volta. \`checked_mul(..)?.checked_add(..)\` encadeia limpo com \`?\` dentro de uma função que devolve \`Option\` ou \`Result\`.

\`saturating_\` é certo para uma métrica que não pode dar a volta; \`wrapping_\` para um hash ou número de sequência onde dar a volta é o comportamento pretendido. Nenhum dos dois chega perto de um saldo.`,
    },
    {
      kind: "quiz",
      question: "Por que um saldo monetário nunca pode ser guardado num `f64`?",
      options: [
        "Ponto flutuante binário não representa a maioria das frações decimais com exatidão, então a aritmética acumula erro que o livro-razão não consegue reconciliar",
        "`f64` é mais lento que `i64` em hardware moderno",
        "`f64` tem um intervalo menor que `i64`",
      ],
      answer: 0,
      explain:
        "`f64` na verdade tem um intervalo muito maior. Intervalo nunca foi o problema — exatidão é, e `0.1 + 0.2 != 0.3` é a prova de uma linha.",
    },
    {
      kind: "fill",
      prompt:
        "Multiplique de modo que um estouro vire um valor que quem chama precisa tratar.",
      file: "main.rs",
      before: "xlm.",
      after: "(STROOPS_PER_XLM)?.checked_add(fraction)",
      choices: ["checked_mul", "saturating_mul", "wrapping_mul"],
      answer: 0,
      explain:
        "`saturating_mul` travaria em silêncio no `i64::MAX` — inventando um saldo que ninguém tem. Para dinheiro, o estouro precisa chegar a quem chama.",
    },
    {
      kind: "quiz",
      question:
        "Um serviço calcula saldos com `+` simples e funciona bem em staging, e então produz um saldo negativo em produção. O que aconteceu?",
      options: [
        "As checagens de estouro ficam ligadas em debug e são removidas em release — a mesma expressão deu panic em staging e deu a volta em produção",
        "O banco devolveu um valor corrompido",
        "Builds de release usam uma largura de inteiro diferente",
      ],
      answer: 0,
      explain:
        "É por isso que `overflow-checks = true` no perfil de release é uma configuração defensável para código financeiro, e por que `checked_` na própria aritmética é ainda melhor.",
    },
    {
      kind: "editor",
      intro: `### Dinheiro em inteiros

1. \`const STROOPS_PER_XLM: i64 = 10_000_000;\`
2. \`fn to_stroops(xlm: i64, fraction: i64) -> Option<i64>\` usando \`checked_mul(..)?\` e depois \`checked_add(..)\`.
3. Imprima \`to_stroops(2, 5_000_000)\` e \`to_stroops(i64::MAX, 0)\` com \`{:?}\`.
4. Imprima \`100i64.checked_sub(30)\` e \`10i64.checked_sub(i64::MIN)\` com \`{:?}\`.
5. Imprima \`i64::MAX.saturating_add(1)\` e \`i64::MAX.wrapping_add(1)\`.
6. Imprima se \`0.1f64 + 0.2f64 == 0.3\`.

Saída esperada:

\`\`\`text
2.5 XLM: Some(25000000)
overflow: None
checked_sub ok: Some(70)
checked_sub under: None
saturating: 9223372036854775807
wrapping: -9223372036854775808
float equality: false
\`\`\`

A última linha é o motivo de as seis primeiras importarem.`,
    },
  ],
};
