import type { LessonStep } from "@/content/steps";

// PT · Erros que sobrevivem à produção.

export const rustErrorHandlingStepsPt: Record<string, LessonStep[]> = {
  "rust-error-handling-1": [
    {
      kind: "theory",
      body: `\`Result<T, E>\` é um enum comum. Não há nada embutido na linguagem sobre ele, exceto um operador.

\`\`\`rust
enum Result<T, E> { Ok(T), Err(E) }
\`\`\`

\`?\` é esse operador. Aplicado a um \`Result\`, ele desembrulha o \`Ok\` e **retorna cedo** no \`Err\`:

\`\`\`rust
let n: i64 = raw.trim().parse()?;
\`\`\`

que é exatamente:

\`\`\`rust
let n: i64 = match raw.trim().parse() {
    Ok(v) => v,
    Err(e) => return Err(From::from(e)),
};
\`\`\``,
    },
    {
      kind: "theory",
      body: `Dois detalhes dessa expansão valem o preço.

**\`From::from(e)\`.** O \`?\` converte o erro no caminho de saída. É por isso que uma função que devolve \`Result<T, MyError>\` pode usar \`?\` num \`ParseIntError\` — desde que exista \`MyError: From<ParseIntError>\`. Esse é o mecanismo inteiro por trás do tratamento ergonômico de erros em Rust, e é a lição depois da próxima.

**O retorno cedo.** O \`?\` só pode aparecer numa função que devolve \`Result\` (ou \`Option\`, ou outro tipo \`Try\`). Ele não é um unwrap que dá panic — é um operador de controle de fluxo, e a falha continua subindo até alguém tratá-la.`,
    },
    {
      kind: "quiz",
      question: "O que o `?` faz que o `.unwrap()` não faz?",
      options: [
        "Ele devolve o erro para fora da função, convertendo com `From` — quem chama decide o que acontece",
        "Ele tenta a operação de novo uma vez antes de desistir",
        "Ele loga o erro e continua com um valor padrão",
      ],
      answer: 0,
      explain:
        "`unwrap` encerra o processo. `?` move a decisão um frame acima, que é a única coisa que permite a uma biblioteca continuar usável dentro do serviço de outra pessoa.",
    },
    {
      kind: "fill",
      prompt: "Propague a falha de parse para quem chamou, em vez de dar panic nela.",
      file: "main.rs",
      before: "let n: i64 = raw.trim().parse()",
      after: ";",
      choices: ["?", ".unwrap()", ".expect(\"bad\")"],
      answer: 0,
      explain:
        "Os três compilam. Só o `?` deixa uma escolha para quem chama — e num handler de requisição, os outros dois transformam uma entrada ruim numa task derrubada.",
    },
    {
      kind: "quiz",
      question:
        "Por que o `?` não compila dentro de um `fn main()` sem tipo de retorno?",
      options: [
        "O `?` retorna cedo com um `Err`, e uma função que devolve `()` não tem como devolvê-lo",
        "`main` é um caso especial e nunca permite propagação de erro",
        "O `?` exige um `use std::ops::Try` explícito",
      ],
      answer: 0,
      explain:
        "A correção é dar um tipo de retorno ao main: `fn main() -> Result<(), Box<dyn Error>>`. Rust então imprime o `Debug` do erro e sai com código diferente de zero.",
    },
    {
      kind: "editor",
      intro: `### Propague, não dê panic

Escreva \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` que faz trim da entrada, parseia como \`i64\` com \`?\` e devolve o dobro do valor.

Em \`main\`, chame duas vezes — com \`" 21 "\` e com \`"x"\` — e faça \`match\` em cada resultado, imprimindo \`ok: <v>\` ou \`err: <e>\`.

Saída esperada:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

A segunda linha é o texto de \`Display\` do próprio \`ParseIntError\`.`,
    },
  ],

  "rust-error-handling-2": [
    {
      kind: "theory",
      body: `\`Result<T, String>\` é onde o tratamento de erros vai morrer. Uma \`String\` não pode ser casada num match, não carrega campos estruturados, e obriga quem chama a parsear inglês para decidir o que fazer.

Modele a falha como um enum — uma variante por coisa que de fato pode dar errado:

\`\`\`rust
#[derive(Debug)]
enum TxError {
    Empty,
    TooLarge { limit: u32, got: u32 },
}
\`\`\`

Agora quem chama pode fazer \`match\` na variante, e \`TooLarge\` carrega os números que uma linha de log ou um corpo de erro HTTP realmente precisa.`,
    },
    {
      kind: "theory",
      body: `Dois hábitos fazem isso valer a pena.

**Coloque o dado dentro da variante.** \`TooLarge { limit, got }\` não custa nada e responde à primeira pergunta do operador. \`TooLarge\` sozinho obriga a pessoa a ir ler o código para descobrir o limite.

**Mantenha o enum fechado e pequeno.** Uma variante por *decisão que quem chama poderia tomar de forma diferente*, não uma por linha de código que pode falhar. Dez variantes que todas significam "a requisição estava malformada" são uma API pior que um \`Malformed { field: String }\`.

Num crate real você derivaria \`Display\` e \`Error\` com \`thiserror\` em vez de escrever à mão. Ele gera exatamente o que as duas próximas lições escrevem manualmente — vale fazer à mão uma vez, para saber o que a macro está fazendo.`,
    },
    {
      kind: "quiz",
      question:
        "Por que `Result<T, String>` é uma escolha ruim para o tipo de erro público de uma biblioteca?",
      options: [
        "Quem chama não consegue fazer match, então se recuperar de uma falha específica vira casar prosa em inglês",
        "Erros `String` alocam, o que é lento demais para qualquer serviço de produção",
        "`String` não implementa `std::error::Error`, então o `?` nem pode ser usado",
      ],
      answer: 0,
      explain:
        "A alocação é real mas raramente decisiva — um caminho de falha não costuma ser quente. Perder a capacidade de *ramificar* na falha é o que dói de verdade.",
    },
    {
      kind: "fill",
      prompt:
        "Dê à variante os números de que um operador vai precisar, sem uma consulta separada.",
      file: "main.rs",
      before: "enum TxError {\n    Empty,\n    TooLarge ",
      after: ",\n}",
      choices: ["{ limit: u32, got: u32 }", "(String)", ""],
      answer: 0,
      explain:
        "Campos nomeados numa variante leem melhor no ponto de construção que uma variante de tupla: `TooLarge { limit: 100, got: size }` dispensa comentário.",
    },
    {
      kind: "quiz",
      question:
        "Quantas variantes um enum de erro de validação de requisição deveria ter?",
      options: [
        "Uma por decisão que quem chama poderia tomar de forma diferente — não uma por linha falível",
        "Uma por chamada de `?` no módulo, para toda falha ser rastreável",
        "Exatamente uma, carregando um campo de mensagem",
      ],
      answer: 0,
      explain:
        "O enum é uma API. O formato dele deve seguir o que quem chama precisa distinguir, e o detalhe que serve só para humanos pertence aos campos.",
    },
    {
      kind: "editor",
      intro: `### Modele a falha, não a transforme em string

1. Defina \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`.
2. Escreva \`fn validate(size: u32) -> Result<u32, TxError>\`: \`0\` é \`Empty\`, acima de \`100\` é \`TooLarge\` com limite \`100\`, o resto é \`Ok(size)\`.
3. Imprima o \`{:?}\` de \`validate(50)\`, \`validate(0)\` e \`validate(150)\`.

Saída esperada:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\``,
    },
  ],

  "rust-error-handling-3": [
    {
      kind: "theory",
      body: `O \`?\` chama \`From::from\` no erro ao sair. Implemente \`From\` uma vez, e todo \`?\` do módulo converte de graça:

\`\`\`rust
impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadNumber(e)
    }
}
\`\`\`

Agora isto compila, mesmo com \`parse\` devolvendo \`ParseIntError\` e a função devolvendo \`ConfigError\`:

\`\`\`rust
fn read_port(raw: &str) -> Result<u16, ConfigError> {
    let port: u16 = raw.parse()?;    // convertido no caminho de saída
    Ok(port)
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Nunca implemente \`Into\` à mão. A \`std\` tem um blanket \`impl<T, U: From<T>> Into<U> for T\`, então implementar \`From\` te dá \`Into\` automaticamente — e o contrário não vale.

Para um \`Option\` no meio de uma cadeia de \`Result\`, faça a ponte explicitamente:

\`\`\`rust
let raw = raw.ok_or(ConfigError::Missing)?;
\`\`\`

\`ok_or\` transforma \`None\` em \`Err(...)\`; \`ok_or_else\` recebe uma closure e é o que usar quando construir o erro não é de graça. O espelho dele, \`.ok()\`, descarta o erro de um \`Result\` e te dá um \`Option\` — conveniente, e digno de desconfiança, já que joga fora o motivo.`,
    },
    {
      kind: "quiz",
      question:
        "Você implementou `From<ParseIntError> for ConfigError`. O que mais você ganha?",
      options: [
        "`Into<ConfigError> for ParseIntError`, do blanket impl da std — e conversão pelo `?` em todo call site",
        "Nada além disso; `Into` precisa ser implementado separadamente",
        "`TryFrom` na direção oposta, automaticamente",
      ],
      answer: 0,
      explain:
        "É por isso que a orientação é sempre 'implemente From, nunca Into'. Implementar `Into` direto não te dá `From` nenhum, e o `?` procura por `From`.",
    },
    {
      kind: "fill",
      prompt:
        "Transforme um valor ausente no seu próprio erro para que o `?` possa carregá-lo adiante.",
      file: "main.rs",
      before: "let raw = raw.",
      after: "(ConfigError::Missing)?;",
      choices: ["ok_or", "unwrap_or", "expect"],
      answer: 0,
      explain:
        "`ok_or` mapeia `Option<T>` para `Result<T, E>`. `unwrap_or` substituiria por um padrão e esconderia o fato de que o valor estava ausente.",
    },
    {
      kind: "quiz",
      question: "Quando usar `ok_or_else` em vez de `ok_or`?",
      options: [
        "Quando construir o valor de erro não é de graça — `ok_or` avalia o argumento de forma ansiosa, mesmo no caminho `Some`",
        "Quando o `Option` é `None` mais vezes que `Some`",
        "Quando o tipo de erro não implementa `Clone`",
      ],
      answer: 0,
      explain:
        "Mesma regra de `unwrap_or` versus `unwrap_or_else`. Se o argumento é uma variante unitária simples, `ok_or` está ótimo e lê melhor; se aloca ou formata, use a closure.",
    },
    {
      kind: "editor",
      intro: `### Deixe o ? fazer a conversão

1. Defina \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`.
2. Implemente \`From<ParseIntError> for ConfigError\` produzindo \`BadNumber\`.
3. Escreva \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\`: \`ok_or\` no caso \`Missing\`, depois \`parse()?\` — sem nenhuma conversão explícita.
4. Imprima o \`{:?}\` de três chamadas: \`Some("8080")\`, \`None\`, \`Some("no")\`.

Saída esperada:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\``,
    },
  ],

  "rust-error-handling-4": [
    {
      kind: "theory",
      body: `Um erro deve duas mensagens diferentes a dois leitores diferentes.

**\`Debug\`** — para você, num log ou numa falha de teste. Derive. Ele mostra a estrutura, incluindo nomes de campo, e nunca é mostrado a um usuário.

**\`Display\`** — para um humano, numa linha de log ou numa resposta de API. Escreva à mão. Uma frase, minúscula, sem ponto final, sem prefixo "Erro:" (quem chama adiciona o contexto em volta).

\`\`\`rust
impl fmt::Display for TimeoutError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "request timed out after {}ms", self.ms)
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`impl std::error::Error for TimeoutError {}\` — muitas vezes um bloco vazio — é o que faz o tipo ser um *erro*, e não uma struct que por acaso é imprimível.

Ele exige \`Debug + Display\` e, em troca, destrava o ecossistema: seu tipo pode ser posto numa box como \`Box<dyn Error>\`, retornado de \`fn main()\`, carregado pelo \`anyhow\` e encadeado com \`source()\`.

\`\`\`rust
let boxed: Box<dyn Error> = Box::new(TimeoutError { ms: 250 });
println!("{boxed}");        // usa o seu Display
\`\`\`

\`Box<dyn Error>\` é o tipo de erro certo no topo de uma aplicação, onde você já não pretende fazer match na variante. Uma **biblioteca** deve manter o enum concreto, para que quem a usa ainda possa.`,
    },
    {
      kind: "quiz",
      question: "Por que `std::error::Error` exige tanto `Debug` quanto `Display`?",
      options: [
        "Eles servem a leitores diferentes: `Debug` mostra a estrutura para o desenvolvedor, `Display` escreve uma frase para um log ou usuário",
        "`Debug` é usado no caminho de sucesso e `Display` no de falha",
        "É histórico; `Display` sozinho já bastaria hoje",
      ],
      answer: 0,
      explain:
        "Isso também tem uma consequência prática: `fn main() -> Result<(), E>` imprime o `Debug`, não o `Display` — o que surpreende quem só escreveu um `Display` bonito.",
    },
    {
      kind: "fill",
      prompt: "Declare o tipo como erro, herdando os métodos default.",
      file: "main.rs",
      before: "impl Error for TimeoutError ",
      after: "",
      choices: ["{}", "{ fn description(&self) -> &str { \"\" } }", ";"],
      answer: 0,
      explain:
        "Todo método de `Error` tem um default, então um bloco vazio já é completo. `description` está deprecado — `Display` o substituiu.",
    },
    {
      kind: "quiz",
      question:
        "Quando `Box<dyn Error>` é o tipo de erro certo, e quando é errado?",
      options: [
        "Certo no topo de uma aplicação, onde ninguém faz match nele; errado numa biblioteca, cujos usuários ainda precisam distinguir falhas",
        "Certo em todo lugar — é estritamente mais flexível que um enum concreto",
        "Errado em todo lugar: aloca em todo caminho de erro",
      ],
      answer: 0,
      explain:
        "É a mesma divisão entre `anyhow` e `thiserror`. Apagar o tipo é uma conveniência que você só pode gastar em nome próprio, nunca em nome de quem te usa.",
    },
    {
      kind: "editor",
      intro: `### As duas mensagens que um erro deve

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`.
2. Implemente \`fmt::Display\` imprimindo \`request timed out after <ms>ms\`.
3. Implemente \`std::error::Error\` com um bloco vazio.
4. Em \`main\`, imprima uma instância com \`{}\` e com \`{:?}\`, depois ponha uma segunda (\`ms: 250\`) numa box como \`Box<dyn Error>\` e imprima.

Saída esperada:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\``,
    },
  ],

  "rust-error-handling-5": [
    {
      kind: "theory",
      body: `Um erro de uma linha só costuma ser inútil sozinho. *"could not load config"* não diz ao operador nada que ele já não soubesse.

\`Error::source\` é a forma padrão de anexar o motivo:

\`\`\`rust
impl Error for LoadFailed {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.cause)
    }
}
\`\`\`

Cada camada acrescenta *o que ela estava tentando fazer* e mantém a camada de baixo intacta. Percorrer a corrente então produz a história inteira, da intenção até a syscall.`,
    },
    {
      kind: "theory",
      body: `Percorrer é um laço simples:

\`\`\`rust
let mut cause = err.source();
while let Some(e) = cause {
    println!("  caused by: {e}");
    cause = e.source();
}
\`\`\`

A regra que faz isso valer a pena: **o \`Display\` de cada camada descreve a intenção dela, nunca a camada de baixo.** Se \`LoadFailed\` imprime "could not load config: permission denied", a corrente passa a dizer "permission denied" duas vezes, e a duplicação cresce a cada nível.

É isso que o \`.context("could not load config")\` do \`anyhow\` monta automaticamente, e é por isso que uma boa linha de log em Rust pode encerrar uma investigação em vez de começar uma.`,
    },
    {
      kind: "quiz",
      question:
        "Por que o `Display` de um erro que embrulha outro não deve incluir a mensagem da causa?",
      options: [
        "A corrente é impressa camada por camada, então embutir a causa repete o mesmo texto em todo nível",
        "`Display` não tem permissão para chamar outros impls de `Display`",
        "A causa pode ainda não existir quando o `Display` roda",
      ],
      answer: 0,
      explain:
        "Toda camada que embute sua causa transforma uma corrente de N níveis em O(N²) de texto. Cada camada enuncia a própria intenção; a corrente fornece o resto.",
    },
    {
      kind: "fill",
      prompt: "Exponha a falha subjacente para que a corrente possa ser percorrida.",
      file: "main.rs",
      before: "impl Error for LoadFailed {\n    fn ",
      after: "(&self) -> Option<&(dyn Error + 'static)> {\n        Some(&self.cause)\n    }\n}",
      choices: ["source", "cause", "inner"],
      answer: 0,
      explain:
        "`cause` era o nome antigo e está deprecado. `source` é o que o ecossistema inteiro percorre.",
    },
    {
      kind: "quiz",
      question:
        "Um operador vê `could not load config` sem nenhum detalhe adicional. O que provavelmente está faltando?",
      options: [
        "O erro que embrulha não implementa `source()`, então a corrente termina na primeira camada",
        "O erro foi logado com `{}` em vez de `{:?}`",
        "O nível de log está baixo demais para mostrar erros aninhados",
      ],
      answer: 0,
      explain:
        "`source()` tem um default que devolve `None`, então esquecê-lo falha em silêncio — a corrente simplesmente para, e nada te avisa.",
    },
    {
      kind: "editor",
      intro: `### Mantenha a causa anexada

1. \`#[derive(Debug)] struct Io(String)\` com \`Display\` imprimindo \`io failure: <texto>\`, e um impl vazio de \`Error\`.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` com \`Display\` imprimindo exatamente \`could not load config\` — sem menção à causa.
3. Implemente \`Error\` para \`LoadFailed\` com \`source()\` devolvendo \`Some(&self.cause)\`.
4. Em \`main\`, construa uma com causa \`permission denied\`, imprima, e depois percorra a corrente imprimindo \`"  caused by: <e>"\` em cada nível.

Saída esperada:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\``,
    },
  ],

  "rust-error-handling-6": [
    {
      kind: "theory",
      body: `A linha não é "panics são ruins". É uma pergunta sobre de *quem* é o erro que a condição representa.

**Uma condição** é algo que o mundo externo tem permissão de fazer: entrada malformada, arquivo ausente, timeout, conexão fechada. Não é um bug. Recebe um \`Result\`.

**Um bug** é uma invariante violada que o seu próprio código deveria manter: um índice que a própria função calculou estar fora do intervalo, uma máquina de estados chegando num braço inalcançável. Continuar além dele significa computar sobre dados que você já provou errados. Recebe um \`panic!\`.`,
    },
    {
      kind: "theory",
      body: `Num handler de requisição, essa distinção vira uma propriedade de disponibilidade.

Um \`unwrap()\` sobre entrada do usuário transforma uma requisição malformada em panic. Dependendo do runtime, isso ou desenrola uma task — devolvendo um 500 pelado e nenhum log útil — ou aborta o processo levando junto toda requisição em voo. De qualquer forma, quem achou isso tem uma negação de serviço.

Regras práticas:

- \`unwrap\`/\`expect\` sobre qualquer coisa derivada de entrada: **nunca** num handler.
- \`expect("...")\` na inicialização, onde a alternativa é rodar mal configurado: **tudo bem**, e melhor que um \`Result\` que ninguém lê.
- \`assert!\` para uma invariante, com mensagem nomeando o que foi violado: **bom**, e documenta a premissa.
- Em testes: \`unwrap\` à vontade. Um teste que falha *deve* ser barulhento.`,
    },
    {
      kind: "quiz",
      question:
        "Um handler faz `let id = params.get(\"id\").unwrap();`. Qual é o risco real?",
      options: [
        "Qualquer requisição sem `id` dá panic na task — uma negação de serviço que qualquer um dispara de propósito",
        "A resposta fica mais lenta porque desenrolar a pilha é caro",
        "Nenhum, desde que o cliente se comporte bem",
      ],
      answer: 0,
      explain:
        "Entrada ausente é uma condição, não um bug. A terceira alternativa é o raciocínio que coloca isso em produção: o cliente é exatamente a parte do sistema que você não controla.",
    },
    {
      kind: "fill",
      prompt:
        "Leia um índice que legitimamente pode estar fora do intervalo, sem dar panic.",
      file: "main.rs",
      before: "data.",
      after: "(i).copied()",
      choices: ["get", "index", "iter().nth"],
      answer: 0,
      explain:
        "`get` devolve `Option<&T>`; `.copied()` transforma `Option<&i64>` em `Option<i64>`. `data[i]` dá panic, o que só está certo quando estar fora do intervalo seria um bug.",
    },
    {
      kind: "quiz",
      question:
        "Onde `expect(\"DATABASE_URL must be set\")` é uma escolha defensável?",
      options: [
        "Na inicialização — a alternativa é um processo rodando mal configurado, e a mensagem nomeia exatamente o que falta",
        "Em lugar nenhum; `expect` é `unwrap` com passos a mais",
        "Num handler de requisição, desde que a mensagem seja descritiva",
      ],
      answer: 0,
      explain:
        "Falhar cedo no boot é uma feature: o processo nunca chega ao load balancer. A mesma chamada dentro de um handler é um crash por requisição.",
    },
    {
      kind: "editor",
      intro: `### Condição ou bug

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — um valor possivelmente ausente é uma **condição**. Use \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — quem chama garante o intervalo, então violar é um **bug**. \`assert!\` com mensagem nomeando o índice e o tamanho, depois indexe direto.
3. Em \`main\`, com \`vec![10, 20, 30]\`: imprima \`checked_index\` em \`1\` e em \`9\` com \`{:?}\`, depois \`invariant_index\` em \`2\`.

Saída esperada:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\``,
    },
  ],
};
