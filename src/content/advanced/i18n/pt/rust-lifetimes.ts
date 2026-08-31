import type { LessonStep } from "@/content/steps";

// PT · Lifetimes.

export const rustLifetimesStepsPt: Record<string, LessonStep[]> = {
  "rust-lifetimes-1": [
    {
      kind: "theory",
      body: `Uma anotação de lifetime não faz nada viver mais tempo. Ela é uma **restrição que quem chama precisa satisfazer**, e o compilador verifica isso em cada call site.

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Leia como uma frase sobre quem chama, não sobre a função: *"me dê duas referências, e eu devolvo uma que é válida enquanto as duas entradas forem."*

Nada é alocado. Nada é estendido. \`'a\` é só um nome para uma região de código, inventado para amarrar o retorno a um argumento.`,
    },
    {
      kind: "theory",
      body: `A leitura errada mais comum é achar que \`'a\` nos dois parâmetros obriga os dois argumentos a viverem *igualmente*. Não obriga.

Quando a função é chamada com referências de lifetimes diferentes, o compilador escolhe \`'a\` como a **menor** das duas — e aí todo slot \`'a\` fica satisfeito, porque uma referência que vive mais sempre serve onde se pede uma que vive menos.

\`\`\`rust
let long = String::from("soroban");
{
    let short = String::from("rpc");
    let winner = longest(&long, &short);
    println!("{winner}");     // ok — 'a é o escopo interno
}
// \`winner\` não pode escapar deste bloco: 'a terminou junto com \`short\`
\`\`\`

O resultado só é restringido pela região que o compilador escolheu — por isso isso compila dentro do bloco e é rejeitado fora dele.`,
    },
    {
      kind: "quiz",
      question:
        "`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str` é chamada com uma referência que vive o programa inteiro e outra que vive três linhas. O que é `'a`?",
      options: [
        "A menor das duas regiões — e a referência devolvida só é válida dentro dela",
        "A maior das duas, porque `'a` precisa cobrir os dois argumentos",
        "É erro de compilação: os dois argumentos precisam ter o mesmo lifetime",
      ],
      answer: 0,
      explain:
        "Lifetimes funcionam como subtipagem: um `&'long T` coage para `&'short T`. O compilador escolhe a maior região onde toda restrição vale, que é a interseção — ou seja, a menor.",
    },
    {
      kind: "fill",
      prompt:
        "Amarre o valor de retorno às entradas para que quem chama saiba por quanto tempo ele vale.",
      file: "main.rs",
      before: "fn longest<'a>(a: &'a str, b: &'a str) -> ",
      after: " {",
      choices: ["&'a str", "&str", "String"],
      answer: 0,
      explain:
        "`&str` sozinho não compila aqui: com duas referências de entrada o compilador não tem como adivinhar de qual delas a saída empresta. `String` compilaria, mas força uma alocação que a função não precisa.",
    },
    {
      kind: "quiz",
      question: "Quanto custa `<'a>` numa assinatura, em tempo de execução?",
      options: [
        "Nada. Lifetimes são apagados depois da checagem de borrow e não emitem código nenhum",
        "Uma palavra de máquina a mais por referência, para carregar a tag da região",
        "Uma checagem de limites a cada dereferência da referência anotada",
      ],
      answer: 0,
      explain:
        "Lifetimes existem só durante a compilação. É por isso que o borrow checker pode ser rigoroso de graça — não há representação em runtime para pagar.",
    },
    {
      kind: "editor",
      intro: `### Amarre uma saída às suas entradas

Escreva \`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str\` devolvendo o argumento mais longo (devolva \`a\` em caso de empate).

Em \`main\`, chame com um \`&String\` contendo \`soroban\` e o literal \`"rpc"\`, e imprima o vencedor.

Saída esperada:

\`\`\`text
longest: soroban
\`\`\``,
    },
  ],

  "rust-lifetimes-2": [
    {
      kind: "theory",
      body: `A maioria das assinaturas dispensa anotação, porque três **regras de elisão** preenchem tudo. Conhecê-las te diz exatamente quando você precisa escrever à mão.

1. Cada lifetime de entrada omitido ganha seu próprio parâmetro.
2. Se existe **exatamente um** lifetime de entrada, ele é atribuído a todo lifetime de saída omitido.
3. Se uma das entradas é \`&self\` ou \`&mut self\`, **o dela** é atribuído a todo lifetime de saída omitido.

\`\`\`rust
fn first_word(s: &str) -> &str        // regra 2 — uma entrada, sem ambiguidade
fn rest(&self) -> &str                // regra 3 — a saída empresta de self
\`\`\``,
    },
    {
      kind: "theory",
      body: `As regras são propositalmente burras: elas nunca adivinham. Quando duas referências de entrada poderiam plausivelmente ser a origem da saída, a elisão simplesmente desiste e você recebe um erro pedindo a anotação.

\`\`\`rust
fn pick(a: &str, b: &str) -> &str     // erro: missing lifetime specifier
\`\`\`

Esse erro não é o compilador sendo chato. \`a\` e \`b\` podem ter lifetimes completamente diferentes, e a resposta muda o que quem chama pode fazer com o resultado. Só você sabe de qual delas a saída veio — então só você pode escrever isso.`,
    },
    {
      kind: "quiz",
      question:
        "`fn head(&self, other: &str) -> &str` compila sem anotação. Qual lifetime o `&str` devolvido recebe?",
      options: [
        "O de `self` — a regra 3 tem precedência sempre que o método tem receptor `&self`",
        "O de `other`, por ser a última referência da lista de parâmetros",
        "O menor entre `self` e `other`, escolhido em cada call site",
      ],
      answer: 0,
      explain:
        "A regra 3 existe justamente porque métodos que devolvem uma visão de `self` são o caso esmagadoramente comum. Se você queria devolver um borrow de `other`, precisa anotar — senão a elisão te dá silenciosamente a coisa errada, e o erro aparece no call site.",
    },
    {
      kind: "fill",
      prompt:
        "Este método devolve uma visão do buffer da própria struct. Complete o cabeçalho do impl.",
      file: "main.rs",
      before: "struct Parser<'a> { input: &'a str }\n\nimpl",
      after: " Parser<'a> {\n    fn rest(&self) -> &str { self.input }\n}",
      choices: ["<'a>", "<'static>", ""],
      answer: 0,
      explain:
        "Uma struct com parâmetro de lifetime precisa dele declarado também no bloco impl — `impl<'a> Parser<'a>`. Dentro do bloco, `rest` dispensa anotação: a regra 3 cobre.",
    },
    {
      kind: "quiz",
      question: "Quando a elisão te obriga a escrever um lifetime explícito?",
      options: [
        "Quando há duas ou mais referências de entrada, nenhum `&self`, e a função devolve uma referência",
        "Sempre que a função devolve uma referência",
        "Sempre que a função tem mais de um parâmetro",
      ],
      answer: 0,
      explain:
        "As três condições precisam valer juntas. Uma referência de entrada é coberta pela regra 2, um receptor `&self` pela regra 3, e devolver um valor próprio não precisa de lifetime nenhum.",
    },
    {
      kind: "editor",
      intro: `### Deixe a elisão trabalhar

1. Escreva \`fn first_word(s: &str) -> &str\` devolvendo tudo antes do primeiro espaço (a string inteira se não houver). Sem anotação — a regra 2 cobre.
2. Defina \`struct Parser<'a> { input: &'a str }\` com \`impl<'a> Parser<'a>\` e um método \`rest(&self) -> &str\` devolvendo \`self.input\`.
3. Imprima \`first_word("submit tx now")\` e depois \`rest()\` num parser sobre \`"ledger 42"\`.

Saída esperada:

\`\`\`text
word: submit
rest: ledger 42
\`\`\``,
    },
  ],

  "rust-lifetimes-3": [
    {
      kind: "theory",
      body: `Quando duas entradas têm lifetimes genuinamente independentes, dê nomes separados. O que importa é qual deles aparece na **saída**.

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Isso diz algo preciso e útil: o resultado empresta de \`text\` e **não** de \`sep\`. Quem chama pode, portanto, descartar \`sep\` imediatamente e continuar usando o resultado.

Colapsar os dois em \`'a\` também compilaria — e amarraria silenciosamente o resultado a \`sep\` também, obrigando quem chama a manter vivo algo de que a função nunca emprestou.`,
    },
    {
      kind: "theory",
      body: `Esse é o custo real de anotar demais: não torna a função errada, torna-a **desnecessariamente restritiva**, e a restrição é sentida por todo mundo que chama.

\`\`\`rust
let cut = {
    let sep = String::from(":");
    prefix(&text, &sep)      // \`sep\` morre na chave que fecha
};
println!("{cut}");           // ainda ok — \`cut\` só empresta de \`text\`
\`\`\`

Com \`fn prefix<'a>(text: &'a str, sep: &'a str) -> &'a str\` esse mesmo código para de compilar, por um motivo que não se vê do call site. Assinaturas são superfície de API; lifetimes fazem parte do contrato.`,
    },
    {
      kind: "quiz",
      question:
        "`prefix` muda de `<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str` para `<'a>(text: &'a str, sep: &'a str) -> &'a str`. Quem chama começa a quebrar. Por quê?",
      options: [
        "O resultado agora está amarrado também a `sep`, então não pode sobreviver a um separador de vida curta",
        "Um único parâmetro de lifetime não pode ser usado em mais de um argumento",
        "A função agora devolve um borrow de `sep` em vez de `text`",
      ],
      answer: 0,
      explain:
        "`'a` vira a interseção das regiões das duas entradas, então a saída herda a menor. O corpo não mudou; só a promessa a quem chama ficou menor.",
    },
    {
      kind: "fill",
      prompt: "O resultado é uma fatia apenas de `text`. Anote o retorno de acordo.",
      file: "main.rs",
      before: "fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> ",
      after: " {",
      choices: ["&'a str", "&'b str", "&'static str"],
      answer: 0,
      explain:
        "`&'b str` seria uma mentira que o borrow checker pega no corpo: a fatia devolvida aponta para dentro de `text`, não de `sep`.",
    },
    {
      kind: "quiz",
      question:
        "Uma função recebe duas referências e devolve uma `String` própria. Quantas anotações de lifetime ela precisa?",
      options: [
        "Nenhuma. A elisão nomeia as entradas, e um retorno próprio não empresta de nada",
        "Duas — todo parâmetro que é referência precisa ser anotado explicitamente",
        "Uma, compartilhada pelos dois parâmetros",
      ],
      answer: 0,
      explain:
        "Anotações só são forçadas por uma saída que é ela mesma uma referência. Se você devolve dado próprio, os lifetimes das entradas deixam de ser problema de alguém.",
    },
    {
      kind: "editor",
      intro: `### Dois lifetimes, um deles irrelevante

Escreva \`fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str\` devolvendo tudo em \`text\` antes da primeira ocorrência de \`sep\` (ou \`text\` inteiro se não ocorrer).

Em \`main\`, monte \`let text = String::from("GA7Q:250:live");\`, depois num **bloco interno** crie um separador \`String\` com \`":"\`, chame \`prefix\` e ligue o resultado fora do bloco. Imprima depois do bloco ter terminado.

Saída esperada:

\`\`\`text
prefix: GA7Q
\`\`\`

Se compilar, você provou que o resultado não empresta do separador.`,
    },
  ],

  "rust-lifetimes-4": [
    {
      kind: "theory",
      body: `Uma struct pode guardar referências, e aí ela precisa de um parâmetro de lifetime:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

O parâmetro é uma promessa: **uma instância de \`Frame\` não pode sobreviver ao buffer para o qual aponta.** O compilador impõe isso, então a struct nunca fica segurando um ponteiro pendurado para uma alocação liberada.

Esse é o formato de todo parser zero-copy. Em vez de alocar uma \`String\` por campo, você entrega fatias de um buffer de outra pessoa.`,
    },
    {
      kind: "theory",
      body: `Vale enunciar o trade com clareza, porque ele decide sua API inteira.

**Emprestado (campos \`&'a str\`).** Sem alocação por campo, então parsear uma requisição grande é quase de graça. O custo: a struct fica amarrada — não pode ser guardada num cache de vida longa, mandada para outra thread que sobreviva ao buffer, nem retornada da função que é dona da entrada.

**Próprio (campos \`String\`).** Aloca, mas o valor é autocontido, é \`'static\`, e vai a qualquer lugar.

Para um serviço RPC que decodifica uma requisição, usa e descarta dentro de um handler, emprestado é a decisão certa e o ganho é real. Para qualquer coisa que você retém depois da requisição, pague a alocação.`,
    },
    {
      kind: "quiz",
      question:
        "Um handler parseia a requisição em `Frame<'a>` emprestado do buffer, e tenta empurrar isso num `Vec` que vive no estado da aplicação. O que acontece?",
      options: [
        "Não compila — o `Vec` sobrevive ao buffer, então o borrow não pode ser guardado ali",
        "Compila, e as fatias do frame ficam penduradas quando o buffer é liberado",
        "Compila, e Rust copia os bytes para dentro do Vec automaticamente",
      ],
      answer: 0,
      explain:
        "Esse é exatamente o erro que o parâmetro de lifetime existe para produzir, e ele está te dizendo algo verdadeiro: reter esse dado exige ser dono dele. Converta para `String` na fronteira onde o lifetime acaba.",
    },
    {
      kind: "fill",
      prompt: "Declare uma struct que empresta duas fatias do mesmo buffer.",
      file: "main.rs",
      before: "struct Frame",
      after: " {\n    method: &'a str,\n    params: &'a str,\n}",
      choices: ["<'a>", "<'static>", "<T>"],
      answer: 0,
      explain:
        "`<'static>` compilaria mas só aceitaria referências válidas pelo programa inteiro — na prática, só literais. É a reação exagerada clássica a um erro de lifetime.",
    },
    {
      kind: "quiz",
      question:
        "Por que `fn parse(raw: &'a str) -> Frame<'a>` é a assinatura certa para o construtor?",
      options: [
        "Ela declara que as fatias do frame apontam para dentro de `raw`, então o compilador amarra os destinos dos dois",
        "Ela força `raw` a ser copiado para dentro do frame, tornando o frame independente",
        "É só estilo — `fn parse(raw: &str) -> Frame` significa a mesma coisa",
      ],
      answer: 0,
      explain:
        "A terceira alternativa chega perto o bastante de ser perigosa: a elisão *preencheria* isso de forma idêntica aqui (uma referência de entrada, regra 2). Escrever explicitamente ainda vale — a assinatura documenta que o retorno é uma visão, não uma cópia.",
    },
    {
      kind: "editor",
      intro: `### Uma visão zero-copy

1. Defina \`struct Frame<'a> { method: &'a str, params: &'a str }\`.
2. Em \`impl<'a> Frame<'a>\`, escreva \`fn parse(raw: &'a str) -> Frame<'a>\` que quebra no primeiro \`'|'\` — o texto antes vira \`method\`, o depois vira \`params\`. Sem \`'|'\`, \`method\` é a entrada inteira e \`params\` é \`""\`.
3. Em \`main\`, parseie uma \`String\` com \`getLedgerEntries|[42]\` e imprima os dois campos.

Saída esperada:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

Nenhuma alocação de \`String\` dentro de \`parse\`.`,
    },
  ],

  "rust-lifetimes-5": [
    {
      kind: "theory",
      body: `\`'static\` significa duas coisas diferentes dependendo de onde aparece, e confundir as duas é uma das maiores fontes de confusão em async Rust.

**Como lifetime de referência — \`&'static T\`** — significa: esta referência é válida durante toda a execução do programa. Literais de string se qualificam, porque estão assados dentro do binário.

\`\`\`rust
let s: &'static str = "baked into the binary";
\`\`\`

Essa é uma afirmação forte, e pouquíssimos valores de runtime conseguem fazê-la.`,
    },
    {
      kind: "theory",
      body: `**Como bound — \`T: 'static\`** — significa algo bem mais fraco: este tipo **não contém nenhuma referência com lifetime menor que o do programa**. Ele *não* significa que o valor vive para sempre.

Uma \`String\` própria satisfaz \`T: 'static\` facilmente. Ela não empresta de nada, então não há nada que possa ficar pendurado. E continua sendo dropada no fim do escopo, como qualquer valor.

\`\`\`rust
fn spawn_like<T: Send + 'static>(value: T) -> T { value }

let owned = String::from("owned at runtime");
spawn_like(owned);      // ok: String: 'static
\`\`\`

É por isso que \`thread::spawn\` e \`tokio::spawn\` exigem \`'static\`. A task pode sobreviver à função que a criou, então não pode segurar um borrow das locais dessa função. Dado próprio é bem-vindo; o bound é sobre *emprestar*, não sobre *durar*.`,
    },
    {
      kind: "quiz",
      question:
        "`thread::spawn` exige `F: 'static`. Isso significa que a closure precisa viver o programa inteiro?",
      options: [
        "Não — significa que a closure não pode emprestar nada de vida menor que a do programa. Ela é dropada quando a thread termina",
        "Sim — closures spawnadas vazam e nunca são dropadas",
        "Sim, e é por isso que toda closure spawnada precisa ser `move` e usar só literais",
      ],
      answer: 0,
      explain:
        "O bound restringe o que pode ser *capturado*, não quanto tempo o valor dura. É por isso que closures `move` capturando `String`s próprias satisfazem o bound sem dificuldade.",
    },
    {
      kind: "fill",
      prompt:
        "Restrinja um generic para que ele possa ser entregue a outra thread: sem borrows de vida curta, seguro de transferir.",
      file: "main.rs",
      before: "fn spawn_like<T: ",
      after: ">(value: T) -> T {",
      choices: ["Send + 'static", "&'static", "Sync"],
      answer: 0,
      explain:
        "`Send` permite a transferência entre threads; `'static` garante que não há borrow que possa ficar pendurado quando o frame que fez o spawn retornar. `Sync` é sobre *compartilhar* uma referência entre threads — outra pergunta.",
    },
    {
      kind: "quiz",
      question:
        "Você bate em `error: borrowed value does not live long enough` numa task spawnada. Qual correção costuma ser a certa?",
      options: [
        "Dar à task dado próprio — clone para dentro dela, ou mova um `Arc`",
        "Adicionar `&'static` ao tipo do valor emprestado",
        "Vazar o valor com `Box::leak` para que ele vire `'static`",
      ],
      answer: 0,
      explain:
        "`Box::leak` tecnicamente produz um `&'static` e ocasionalmente é correto para um valor que realmente dura o processo inteiro — mas apelar para ele só para calar um erro de borrow significa alocar memória que você nunca recupera, uma vez por chamada.",
    },
    {
      kind: "editor",
      intro: `### Dois significados, um programa

1. Ligue um \`&'static str\` **com a anotação de tipo explícita**, contendo \`baked into the binary\`, e imprima.
2. Escreva \`fn spawn_like<T: Send + 'static>(value: T) -> T\` que só devolve o argumento.
3. Passe uma \`String\` própria com \`owned at runtime\` por ela e imprima o resultado — provando que \`String\` satisfaz \`'static\`.

Saída esperada:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\``,
    },
  ],
};
