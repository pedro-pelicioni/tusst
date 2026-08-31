import type { LessonStep } from "@/content/steps";

// PT · Traits, generics e dispatch.

export const rustTraitsGenericsStepsPt: Record<string, LessonStep[]> = {
  "rust-traits-generics-1": [
    {
      kind: "theory",
      body: `Uma trait é um conjunto de métodos que um tipo promete oferecer. Ela não é uma classe base: não há herança, não há campos compartilhados e não há construtor.

\`\`\`rust
trait Health {
    fn name(&self) -> String;

    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

\`name\` é obrigatório. \`status\` tem uma **implementação default**, escrita em termos dos métodos obrigatórios — quem implementa ganha de graça e pode sobrescrever.`,
    },
    {
      kind: "theory",
      body: `O padrão de *um ou dois métodos obrigatórios mais um monte de defaults* é como a biblioteca padrão se mantém utilizável. \`Iterator\` exige exatamente um método, \`next\`, e te dá umas setenta adapters em cima disso.

Projete suas traits do mesmo jeito. Deixe a superfície obrigatória tão pequena quanto a abstração permitir, e construa a conveniência por cima como defaults:

\`\`\`rust
impl Health for Db {
    fn name(&self) -> String { String::from("db") }
    // status() vem de graça
}

impl Health for Rpc {
    fn name(&self) -> String { String::from("rpc") }
    fn status(&self) -> String { format!("{}: degraded", self.name()) }
}
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Uma trait tem um método obrigatório e um método default. O que quem implementa precisa escrever?",
      options: [
        "Só o obrigatório — o default é herdado, e sobrescrever é opcional",
        "Os dois, porque um impl de trait precisa ser exaustivo",
        "Só o default; os métodos obrigatórios são fornecidos pelo compilador",
      ],
      answer: 0,
      explain:
        "É exatamente para isso que os defaults existem: eles deixam uma trait crescer em superfície útil sem quebrar todo mundo que já a implementava a cada vez.",
    },
    {
      kind: "fill",
      prompt: "Dê à trait um método default construído a partir do obrigatório.",
      file: "main.rs",
      before: "trait Health {\n    fn name(&self) -> String;\n\n    fn status(&self) -> String {\n        format!(\"{}: ok\", ",
      after: ")\n    }\n}",
      choices: ["self.name()", "Self::name", "name()"],
      answer: 0,
      explain:
        "Um corpo default pode chamar qualquer outro método da trait através de `self` — é isso que o torna componível. `Self::name` sem receptor não saberia a qual instância perguntar.",
    },
    {
      kind: "quiz",
      question: "Por que Rust não tem acesso a campo através de uma trait?",
      options: [
        "Traits descrevem comportamento, não layout — quem implementa pode guardar os dados em formatos completamente diferentes",
        "Tem sim; `trait T { field: u32 }` é sintaxe válida",
        "Campos são acessíveis, mas só de dentro de corpos de método default",
      ],
      answer: 0,
      explain:
        "Essa é a ruptura deliberada com herança. Se você precisa de algo parecido com acesso a campo, adicione um getter à trait — aí um tipo que calcula esse valor na hora também consegue implementá-la.",
    },
    {
      kind: "editor",
      intro: `### Um método obrigatório, um default

1. Defina \`trait Health\` com \`fn name(&self) -> String\` obrigatório e um \`fn status(&self) -> String\` default devolvendo \`"<name>: ok"\`.
2. Defina as unit structs \`Db\` e \`Rpc\`.
3. \`Db\` implementa só \`name\` (devolvendo \`db\`). \`Rpc\` implementa \`name\` (devolvendo \`rpc\`) **e** sobrescreve \`status\` para devolver \`"<name>: degraded"\`.
4. Imprima o status de cada.

Saída esperada:

\`\`\`text
db: ok
rpc: degraded
\`\`\``,
    },
  ],

  "rust-traits-generics-2": [
    {
      kind: "theory",
      body: `Um parâmetro genérico sem bound é quase inútil: o corpo só pode fazer o que funciona para *todo* tipo, o que é quase nada.

Um **bound** compra capacidade de volta estreitando a entrada:

\`\`\`rust
fn describe_all<T: Display>(items: &[T]) -> String
\`\`\`

Agora o corpo pode chamar \`.to_string()\`, porque \`Display\` garante que existe. O bound é um contrato de mão dupla: quem chama precisa fornecer um tipo \`Display\`, e em troca o corpo pode contar com isso.`,
    },
    {
      kind: "theory",
      body: `\`where\` move os bounds para baixo da assinatura. Não é só cosmético — alguns bounds nem podem ser escritos inline:

\`\`\`rust
fn process<T>(items: &[T]) -> String
where
    T: Display + Clone,
    for<'a> &'a T: IntoIterator,
{ ... }
\`\`\`

A disciplina que vale manter: **restrinja exatamente o que o corpo usa, e nada além.** Um \`T: Clone\` desnecessário numa função que nunca clona não a torna mais segura — ele rejeita quem tinha um tipo não-\`Clone\` perfeitamente bom. Restringir demais é a versão genérica de anotar demais um lifetime.`,
    },
    {
      kind: "quiz",
      question:
        "Um helper recebe `items: &[T]` e só formata cada elemento. Qual bound está certo?",
      options: [
        "`T: Display` — o mínimo que o corpo de fato precisa",
        "`T: Display + Clone + Debug`, para manter a função flexível no futuro",
        "Nenhum bound, e chame `.to_string()` — ele existe em todo tipo",
      ],
      answer: 0,
      explain:
        "Adicionar bounds não adiciona flexibilidade; remove, do lado de quem chama. E `.to_string()` vem *de* `Display` por um blanket impl — sem o bound não existe esse método.",
    },
    {
      kind: "fill",
      prompt:
        "Restrinja o parâmetro para que o corpo possa formatar cada elemento, usando uma cláusula `where`.",
      file: "main.rs",
      before: "fn describe_all<T>(items: &[T]) -> String\nwhere\n    T: ",
      after: ",\n{",
      choices: ["Display", "ToString + Clone", "Sized"],
      answer: 0,
      explain:
        "`ToString` funcionaria mas está na direção errada: a biblioteca padrão implementa `ToString` para todo `T: Display`, então restringir por `Display` aceita estritamente mais tipos.",
    },
    {
      kind: "quiz",
      question: "O que `impl Trait` em posição de argumento significa?",
      options: [
        "É açúcar para um parâmetro genérico anônimo — `fn f(x: impl Display)` é `fn f<T: Display>(x: T)`",
        "Cria um trait object, colocando o argumento numa box em runtime",
        "Significa que o argumento precisa ser exatamente o único implementador daquela trait",
      ],
      answer: 0,
      explain:
        "A única diferença real: com `impl Trait` não há nome para o tipo, então quem chama não pode usar turbofish. Todo o resto — monomorfização, dispatch estático — é idêntico.",
    },
    {
      kind: "editor",
      intro: `### Restrinja exatamente o que você usa

Escreva \`fn describe_all<T>(items: &[T]) -> String\` com cláusula \`where T: Display\`, juntando os elementos com \`", "\`.

Chame duas vezes em \`main\`: uma com \`&[1, 2, 3]\`, outra com \`&["a", "b"]\`.

Saída esperada:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

Importe \`std::fmt::Display\`. Monte a string com \`push_str\`, não com \`join\` — o ponto é ver o bound sendo usado.`,
    },
  ],

  "rust-traits-generics-3": [
    {
      kind: "theory",
      body: `Os dois deixam uma trait ser genérica sobre um tipo. Eles significam coisas diferentes:

\`\`\`rust
trait Source      { type Item;    fn next_item(&mut self) -> Option<Self::Item>; }
trait Source<T>   {               fn next_item(&mut self) -> Option<T>; }
\`\`\`

Com um **associated type**, um tipo implementa \`Source\` **uma vez**, e escolhe \`Item\` como parte dessa única implementação.

Com um **parâmetro genérico**, um tipo pode implementar \`Source<u32>\`, \`Source<String>\`, \`Source<Frame>\` — quantas vezes quiser.`,
    },
    {
      kind: "theory",
      body: `Essa diferença decide qual você quer, e há um teste limpo: **existe exatamente uma resposta sensata por tipo implementador?**

\`Iterator\` usa associated type porque um \`Counter\` produz um único tipo de coisa. Se \`Item\` fosse parâmetro genérico, \`counter.next()\` seria ambíguo em todo call site e você viveria escrevendo turbofish.

\`From\` usa parâmetro genérico pelo motivo oposto: um tipo genuinamente deve converter *de* muitos outros, e \`impl From<u8> for Wide\` ao lado de \`impl From<u16> for Wide\` é exatamente o certo.

Associated types também leem melhor rio abaixo: \`fn drain<S: Source>(s: S) -> Vec<S::Item>\` nomeia a saída sem um segundo parâmetro.`,
    },
    {
      kind: "quiz",
      question:
        "Por que `Iterator` usa `type Item` em vez de `trait Iterator<T>`?",
      options: [
        "Um dado iterador produz exatamente um tipo de elemento, então um segundo impl só criaria ambiguidade em todo call site",
        "Associated types compilam mais rápido que parâmetros genéricos",
        "Parâmetros genéricos não são permitidos em traits da biblioteca padrão",
      ],
      answer: 0,
      explain:
        "Teste o contrafactual: com `Iterator<T>`, `v.iter().next()` não conseguiria inferir `T` e toda chamada precisaria de anotação. O associated type torna a resposta única.",
    },
    {
      kind: "fill",
      prompt:
        "Nomeie o tipo de saída numa assinatura rio abaixo sem adicionar um segundo parâmetro.",
      file: "main.rs",
      before: "fn drain<S: Source>(mut s: S) -> Vec<",
      after: "> {",
      choices: ["S::Item", "S", "Source::Item"],
      answer: 0,
      explain:
        "`S::Item` é o associated type projetado a partir do `S` concreto. `Source::Item` não tem um `Self` de onde projetar, então o compilador não consegue resolver.",
    },
    {
      kind: "quiz",
      question:
        "Você está projetando uma trait `Converter` e um tipo deve converter de `u8`, `u16` e `u32`. Qual formato serve?",
      options: [
        "Parâmetro genérico — o tipo precisa de três impls separados, um por origem",
        "Associated type, com um enum cobrindo os três",
        "Qualquer um; os dois são intercambiáveis em todo caso",
      ],
      answer: 0,
      explain:
        "Vários impls por tipo é precisamente o que um parâmetro genérico permite e um associated type proíbe. É o mesmo motivo pelo qual `From<T>` é genérica.",
    },
    {
      kind: "editor",
      intro: `### Uma resposta por tipo

1. Defina \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`.
2. Defina \`struct Counter { n: u32 }\` e implemente \`Source\` com \`type Item = u32\`, produzindo \`1\`, \`2\`, \`3\` e depois \`None\`.
3. Escreva \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` coletando tudo que a fonte produzir.
4. Imprima o vetor drenado com \`{:?}\`.

Saída esperada:

\`\`\`text
items: [1, 2, 3]
\`\`\``,
    },
  ],

  "rust-traits-generics-4": [
    {
      kind: "theory",
      body: `Uma função genérica não é uma função. O compilador faz **monomorfização**: para cada tipo concreto com que ela é chamada, ele carimba uma cópia especializada separada.

\`\`\`rust
fn emit<T: Debug>(label: &str, value: T) { ... }

emit("count", 42u32);        // emite emit::<u32>
emit("name", "rpc");         // emite emit::<&str>
emit("flags", vec![true]);   // emite emit::<Vec<bool>>
\`\`\`

Três call sites, três funções reais no binário. Cada uma conhece seu tipo concreto, então toda chamada de método lá dentro é uma **chamada direta** — sem indireção, totalmente inlineável.`,
    },
    {
      kind: "theory",
      body: `É isso que "abstração de custo zero" significa aqui: a versão genérica compila para as mesmas instruções que você teria escrito à mão.

Os custos são reais mas mudam de lugar:

- **Tamanho do binário.** Toda instanciação é código duplicado. Uma biblioteca muito genérica chamada com vinte tipos produz vinte cópias.
- **Tempo de compilação.** Esse é o maior motivo isolado de builds Rust lentos.

O trade quase sempre vale num caminho quente, e muitas vezes não vale num registro de plugins ou numa coleção heterogênea — que é para isso que existem trait objects.`,
    },
    {
      kind: "quiz",
      question:
        "Uma função genérica é chamada com três tipos concretos diferentes. Quantas cópias existem no binário?",
      options: [
        "Três — uma instanciação especializada por tipo concreto usado",
        "Uma, com o tipo passado como argumento oculto em runtime",
        "Uma, mais uma vtable por tipo",
      ],
      answer: 0,
      explain:
        "As instanciações são geradas sob demanda: um generic que nunca é chamado nem gera código, e é por isso que um helper genérico não usado não custa nada.",
    },
    {
      kind: "fill",
      prompt: "Restrinja o valor para que ele possa ser impresso com `{:?}`.",
      file: "main.rs",
      before: "fn emit<T: ",
      after: ">(label: &str, value: T) {",
      choices: ["Debug", "Display", "Sized"],
      answer: 0,
      explain:
        "`{:?}` é `Debug`; `{}` é `Display`. São traits separadas de propósito — `Debug` é para desenvolvedores e pode ser derivada, `Display` é para usuários e nunca é.",
    },
    {
      kind: "quiz",
      question:
        "Quando dispatch dinâmico é a melhor escolha, apesar da chamada indireta?",
      options: [
        "Quando você precisa de uma coleção heterogênea, ou quer impedir o código de crescer com o número de implementadores",
        "Sempre que a função é chamada mais de uma vez",
        "Sempre que a trait tem mais de um método",
      ],
      answer: 0,
      explain:
        "`Vec<Box<dyn Check>>` não tem equivalente genérico — um `Vec<T>` guarda um tipo só. Esse é o caso em que trait objects não são um compromisso, são a única opção.",
    },
    {
      kind: "editor",
      intro: `### Três call sites, três funções

Escreva \`fn emit<T: Debug>(label: &str, value: T)\` imprimindo \`"<label>: <value:?>"\`.

Chame três vezes: com \`42u32\`, com \`"rpc"\` e com \`vec![true, false]\`.

Saída esperada:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Repare nas aspas em torno de \`rpc\` — isso é \`Debug\`, não \`Display\`, e a diferença é o ponto.`,
    },
  ],

  "rust-traits-generics-5": [
    {
      kind: "theory",
      body: `Um generic te dá um tipo por instanciação. Quando você precisa de **vários tipos diferentes numa mesma coleção**, precisa de um trait object:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` não é um tipo de tamanho conhecido, então sempre aparece atrás de um ponteiro — \`Box<dyn Check>\`, \`&dyn Check\`, \`Arc<dyn Check>\`. Esse ponteiro é **gordo**: duas palavras, uma para o dado e uma para a vtable.`,
    },
    {
      kind: "theory",
      body: `A vtable é uma tabelinha estática, uma por par (tipo, trait), guardando um ponteiro de função por método mais o tamanho e o drop glue.

Chamar \`c.run()\` num \`&dyn Check\` significa, então: carregar o ponteiro da vtable, carregar o slot de \`run\`, chamar por ele. O custo é uma indireção a mais e — a parte que de fato importa num laço quente — **a chamada não pode ser inlineada**, porque o alvo é desconhecido até o runtime.

Para um registro de health checks invocado uma vez por segundo, esse custo é imperceptível e a flexibilidade vale tudo. Para um comparador chamado um milhão de vezes dentro de um sort, é a diferença que você estava procurando.`,
    },
    {
      kind: "quiz",
      question: "Por que `&dyn Check` tem duas palavras de largura e `&Ping` só uma?",
      options: [
        "Ele carrega um ponteiro para o dado *e* um ponteiro para a vtable daquele tipo concreto",
        "Ele guarda o dado inline, então o tamanho varia por implementador",
        "Ele carrega um contador de referências ao lado do ponteiro de dado",
      ],
      answer: 0,
      explain:
        "É por isso que você não pode converter um `&dyn Trait` de volta para `&T` de graça, e por que `Box<dyn Trait>` sabe qual destrutor chamar: as duas informações vivem na vtable.",
    },
    {
      kind: "fill",
      prompt: "Guarde dois tipos concretos diferentes numa mesma coleção.",
      file: "main.rs",
      before: "let checks: Vec<",
      after: "> = vec![Box::new(Ping), Box::new(Disk)];",
      choices: ["Box<dyn Check>", "dyn Check", "Check"],
      answer: 0,
      explain:
        "`Vec<dyn Check>` não compila: `Vec` exige um elemento `Sized`, e `dyn Check` não tem tamanho conhecido em tempo de compilação. É o `Box` que dá um a ele.",
    },
    {
      kind: "quiz",
      question:
        "O custo real do dispatch dinâmico num laço apertado normalmente não é a leitura extra de ponteiro. Qual é?",
      options: [
        "A chamada não pode ser inlineada, o que também bloqueia as otimizações que o inline teria habilitado",
        "Cada chamada aloca uma vtable nova na heap",
        "A consulta à vtable exige um lock, então chamadas concorrentes disputam",
      ],
      answer: 0,
      explain:
        "Vtables são dado estático, alocado uma vez em tempo de compilação — nunca por chamada. A barreira de otimização é o custo honesto, e é fácil de subestimar.",
    },
    {
      kind: "editor",
      intro: `### Um registro heterogêneo

1. Defina \`trait Check { fn run(&self) -> String; }\`.
2. Defina as unit structs \`Ping\` e \`Disk\` implementando a trait, devolvendo \`ping ok\` e \`disk ok\`.
3. Monte um \`Vec<Box<dyn Check>>\` com uma de cada, itere imprimindo cada resultado, e depois imprima a contagem.

Saída esperada:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\``,
    },
  ],

  "rust-traits-generics-6": [
    {
      kind: "theory",
      body: `Nem toda trait pode virar um \`dyn Trait\`. Uma trait é **object safe** só se todo método puder ser chamado por uma vtable — isto é, sem saber nada sobre o tipo concreto além do endereço dele.

Duas regras causam quase toda falha real:

1. **Sem métodos genéricos.** \`fn build<T: Encode>(&self, v: T)\` precisaria de um slot de vtable por \`T\` possível, e o conjunto é ilimitado.
2. **Sem \`Self\` em posição de retorno.** \`fn clone_me(&self) -> Self\` não funciona: quem chama não faz ideia do que é \`Self\` nem de que tamanho ele tem.`,
    },
    {
      kind: "theory",
      body: `As duas têm a mesma correção: troque o buraco de tempo de compilação por um de runtime.

\`\`\`rust
trait Sink { fn accept<T: Encode>(&self, v: T) -> String; }   // não é object safe
trait Sink { fn accept(&self, v: &dyn Encode) -> String; }    // é object safe
\`\`\`

Você trocou uma indireção pela capacidade de guardar \`Box<dyn Sink>\` — em geral o trade certo, já que uma trait que você quer como objeto é uma trait que você queria pela flexibilidade.

Quando precisa dos dois, o padrão padrão é duas traits: uma genérica para o caminho rápido, e uma object safe implementada em blanket por cima dela.`,
    },
    {
      kind: "quiz",
      question: "Por que um método genérico torna uma trait não object safe?",
      options: [
        "Uma vtable é uma tabela fixa construída em tempo de compilação, e um método genérico precisaria de um número ilimitado de slots",
        "Métodos genéricos não podem receber `&self`",
        "O compilador poderia suportar, mas proíbe para manter as vtables pequenas",
      ],
      answer: 0,
      explain:
        "A vtable é construída por par (tipo, trait) quando o trait object é criado. Ela não tem como saber de quais instanciações um chamador futuro vai precisar.",
    },
    {
      kind: "fill",
      prompt:
        "Torne o método object safe: receba o valor como trait object em vez de generic.",
      file: "main.rs",
      before: "trait Sink {\n    fn accept(&self, value: ",
      after: ") -> String;\n}",
      choices: ["&dyn Encode", "impl Encode", "T"],
      answer: 0,
      explain:
        "`impl Encode` em posição de argumento é açúcar para um parâmetro genérico, então falha em object safety exatamente pelo mesmo motivo que o generic explícito.",
    },
    {
      kind: "quiz",
      question:
        "`Clone` não é object safe. Qual das exigências dela é a responsável?",
      options: [
        "`fn clone(&self) -> Self` devolve `Self` por valor, e quem chama não tem como saber o tamanho desse tipo",
        "`Clone` tem uma supertrait, e supertraits quebram object safety",
        "`clone` recebe `&self`, e métodos object safe precisam receber `self`",
      ],
      answer: 0,
      explain:
        "É por isso que um `Box<dyn Trait>` não pode simplesmente ser clonado, e por que crates que contornam isso definem um `fn clone_box(&self) -> Box<dyn Trait>` — um tipo de retorno com tamanho conhecido.",
    },
    {
      kind: "editor",
      intro: `### Mantenha a trait usável como objeto

1. Defina \`trait Encode { fn encode(&self) -> String; }\`.
2. Defina \`struct Num(i64)\` implementando como o texto decimal do número.
3. Defina \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — repare no \`&dyn\`, que é o que a mantém object safe.
4. Defina a unit struct \`Log\` implementando \`Sink\`, devolvendo \`"log:<encoded>"\`.
5. Em \`main\`, guarde como \`Box<dyn Sink>\` e aceite um \`Num(42)\`.

Saída esperada:

\`\`\`text
log:42
\`\`\`

Se \`accept\` fosse genérico, o passo 5 não compilaria.`,
    },
  ],

  "rust-traits-generics-7": [
    {
      kind: "theory",
      body: `Um **blanket impl** implementa uma trait para todo tipo que satisfaz um bound, num bloco só:

\`\`\`rust
impl<T: Display> Loggable for T {
    fn log_line(&self) -> String {
        format!("[log] {}", self)
    }
}
\`\`\`

Agora \`42.log_line()\` e \`"rpc down".log_line()\` funcionam, e todo tipo que alguém vier a escrever implementando \`Display\` também.

A biblioteca padrão usa isso pesado. \`ToString\` é um blanket impl sobre \`Display\`; \`Into<U>\` é um blanket impl sobre \`From<T>\`. É por isso que implementar \`From\` te dá \`Into\` de graça e você nunca deve implementar \`Into\` à mão.`,
    },
    {
      kind: "theory",
      body: `A **orphan rule** é o limite: você só pode implementar uma trait para um tipo se for dono da trait ou dono do tipo. Os dois alheios é proibido.

\`\`\`rust
impl Display for Vec<u8> { ... }   // proibido: os dois são da std
\`\`\`

O motivo é coerência. Se dois crates pudessem adicionar esse impl, adicionar uma dependência mudaria qual deles se aplica — ou tornaria o programa ambíguo e pararia de compilar por razões que não estão em nenhum dos dois.

O contorno é o newtype: \`struct Bytes(Vec<u8>);\` é um tipo *seu*, então você pode implementar o que quiser nele. E não custa nada em runtime — uma tuple struct de um campo tem layout idêntico ao do campo.`,
    },
    {
      kind: "quiz",
      question: "Por que você não pode fazer `impl Display for Vec<u8>` no seu crate?",
      options: [
        "A orphan rule: a trait e o tipo são os dois alheios, então dois crates poderiam adicionar impls conflitantes",
        "`Vec<u8>` já implementa `Display` na biblioteca padrão",
        "Blanket impls na `std` reivindicam todo tipo de antemão",
      ],
      answer: 0,
      explain:
        "Coerência é uma propriedade global. Sem a regra, se o seu programa compila poderia depender de uma dependência transitiva que você nunca nomeou.",
    },
    {
      kind: "fill",
      prompt: "Implemente sua trait para todo tipo que já pode ser exibido.",
      file: "main.rs",
      before: "impl<T: Display> Loggable for ",
      after: " {",
      choices: ["T", "dyn Display", "Self"],
      answer: 0,
      explain:
        "`for T` com o bound nos generics do impl é a forma blanket. `for dyn Display` cobriria só o trait object, não os tipos concretos.",
    },
    {
      kind: "quiz",
      question:
        "Você precisa de `serde::Serialize` num tipo de outro crate. Qual é a jogada padrão?",
      options: [
        "Envolver num newtype que é seu e implementar a trait nele",
        "Fazer um fork do outro crate e adicionar o impl lá",
        "Implementar assim mesmo — a orphan rule só vale para a `std`",
      ],
      answer: 0,
      explain:
        "O newtype é de graça em runtime e local em escopo. (O Serde também oferece `#[serde(remote)]` exatamente para esse caso, gerando para você o código no formato newtype.)",
    },
    {
      kind: "editor",
      intro: `### Um impl, todo tipo Display

1. Defina \`trait Loggable { fn log_line(&self) -> String; }\`.
2. Escreva um blanket \`impl<T: Display> Loggable for T\` devolvendo \`"[log] <value>"\`.
3. Chame \`.log_line()\` no inteiro \`42\` e na string \`"rpc down"\` — dois tipos, zero impls extras.

Saída esperada:

\`\`\`text
[log] 42
[log] rpc down
\`\`\``,
    },
  ],
};
