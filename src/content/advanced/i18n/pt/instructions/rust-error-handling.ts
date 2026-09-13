// PT · editor instructions — Errors That Survive Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-error-handling.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustErrorHandlingInstructionsPt: Record<string, { instructions: string }> = {
  "rust-error-handling-1": {
    instructions: `## Propague, não dê panic

O \`?\` desembrulha o \`Ok\` e retorna cedo no \`Err\`, convertendo o erro com \`From\` no caminho de saída. É um operador de controle de fluxo, não um unwrap — a falha continua subindo até alguém tratá-la.

### Sua tarefa

Escreva \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` que faz trim da entrada, parseia como \`i64\` **com \`?\`** e devolve o dobro do valor.

Em \`main\`, chame com \`" 21 "\` e com \`"x"\`, fazendo \`match\` em cada resultado e imprimindo \`ok: <v>\` ou \`err: <e>\`.

Saída esperada:

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

A segunda linha é o texto de \`Display\` do próprio \`ParseIntError\` — não é você que escreve.

### Dicas

- \`raw.trim().parse()\` infere o tipo alvo a partir da anotação do binding.
- \`Ok(n * 2)\` é o caminho de sucesso.
`,
  },

  "rust-error-handling-2": {
    instructions: `## Modele a falha, não a transforme em string

\`Result<T, String>\` não pode ser casado num match e não carrega dado estruturado. Modele a falha como um enum, uma variante por coisa que realmente pode dar errado, com o dado que um operador vai precisar já dentro da variante.

### Sua tarefa

1. \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`
2. \`fn validate(size: u32) -> Result<u32, TxError>\`: \`0\` → \`Empty\`; acima de \`100\` → \`TooLarge\` com limite \`100\`; caso contrário \`Ok(size)\`.
3. Imprima o \`{:?}\` de \`validate(50)\`, \`validate(0)\`, \`validate(150)\`.

Saída esperada:

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\`

### Dicas

- \`return Err(...)\` cedo em cada caso de falha, depois \`Ok(size)\` como cauda.
`,
  },

  "rust-error-handling-3": {
    instructions: `## Deixe o ? fazer a conversão

O \`?\` chama \`From::from\` no erro ao sair da função. Implemente \`From\` uma vez, e todo \`?\` do módulo converte de graça.

Nunca implemente \`Into\` à mão — o blanket impl da std te dá isso a partir de \`From\`, e o \`?\` procura por \`From\`.

### Sua tarefa

1. \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`
2. \`impl From<ParseIntError> for ConfigError\` produzindo \`BadNumber\`.
3. \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\`: \`ok_or\` no caso \`Missing\`, depois \`parse()?\` — **sem** nenhuma conversão explícita em lugar nenhum.
4. Imprima o \`{:?}\` de \`read_port(Some("8080"))\`, \`read_port(None)\`, \`read_port(Some("no"))\`.

Saída esperada:

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\`

### Dicas

- \`use std::num::ParseIntError;\`
- \`raw.ok_or(ConfigError::Missing)?\` transforma o \`Option\` num \`Result\` e o desembrulha.
`,
  },

  "rust-error-handling-4": {
    instructions: `## As duas mensagens que um erro deve

**\`Debug\`** é para um desenvolvedor, num log ou numa falha de teste — derive.
**\`Display\`** é para um humano, uma frase, minúscula, sem ponto final — escreva à mão.

\`impl std::error::Error\` (muitas vezes um bloco vazio) é o que faz do tipo um *erro*: destrava \`Box<dyn Error>\`, \`?\` para tipos apagados e encadeamento com \`source()\`.

### Sua tarefa

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`
2. \`impl fmt::Display\` imprimindo \`request timed out after <ms>ms\`.
3. \`impl Error for TimeoutError {}\` — vazio.
4. Em \`main\`: imprima uma instância (\`ms: 5000\`) com \`{}\` e com \`{:?}\`, depois ponha uma segunda (\`ms: 250\`) numa box como \`Box<dyn Error>\` e imprima.

Saída esperada:

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\`

### Dicas

- \`use std::error::Error;\` e \`use std::fmt;\`
- A assinatura é \`fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result\`.
`,
  },

  "rust-error-handling-5": {
    instructions: `## Mantenha a causa anexada

\`Error::source\` anexa o motivo. Cada camada enuncia **a própria intenção** e mantém a camada de baixo intacta — nunca embutindo a causa no próprio \`Display\`, senão uma corrente de N níveis imprime o mesmo texto N vezes.

### Sua tarefa

1. \`#[derive(Debug)] struct Io(String)\` — \`Display\` imprime \`io failure: <texto>\`, impl vazio de \`Error\`.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` — \`Display\` imprime exatamente \`could not load config\`, sem menção à causa.
3. \`impl Error for LoadFailed\` com \`source()\` devolvendo \`Some(&self.cause)\`.
4. Em \`main\`: construa uma com causa \`permission denied\`, imprima, e depois percorra a corrente imprimindo \`"  caused by: <e>"\` em cada nível.

Saída esperada:

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\`

### Dicas

- O percurso da corrente é \`let mut cause = err.source(); while let Some(e) = cause { ...; cause = e.source(); }\`
- O tipo de retorno de \`source\` é \`Option<&(dyn Error + 'static)>\`.
`,
  },

  "rust-error-handling-6": {
    instructions: `## Condição ou bug

**Uma condição** é algo que o mundo externo tem permissão de fazer — entrada malformada, um timeout, uma conexão fechada. Não é um bug. Recebe um \`Result\` ou um \`Option\`.

**Um bug** é uma invariante violada que o seu próprio código deveria manter. Continuar além dele significa computar sobre dados que você já provou errados. Recebe um \`panic!\` ou um \`assert!\`.

Num handler, um \`unwrap\` sobre entrada é uma negação de serviço que qualquer um dispara de propósito.

### Sua tarefa

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — uma condição. Use \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — quem chama garante o intervalo, então violar é um bug. \`assert!\` com mensagem nomeando o índice e o tamanho, depois indexe direto.
3. Em \`main\`, com \`vec![10, 20, 30]\`: imprima \`checked_index\` em \`1\` e em \`9\` com \`{:?}\`, depois \`invariant_index\` em \`2\`.

Saída esperada:

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\`

### Dicas

- \`.get()\` dá \`Option<&i64>\`; \`.copied()\` transforma em \`Option<i64>\`.
- \`assert!(cond, "…{}…", value)\` aceita argumentos de formato.
`,
  },
};
