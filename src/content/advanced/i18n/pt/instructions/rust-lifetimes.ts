// PT · editor instructions — Lifetimes.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-lifetimes.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustLifetimesInstructionsPt: Record<string, { instructions: string }> = {
  "rust-lifetimes-1": {
    instructions: `## Amarre uma saída às suas entradas

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Leia como uma promessa a quem chama: *me dê duas referências, e a que eu devolvo é válida enquanto as duas entradas forem.* Nada é alocado e nada é estendido — \`'a\` só deixa o compilador ligar a saída às entradas.

### Sua tarefa

Implemente \`longest\`, devolvendo o argumento mais longo (devolva \`a\` quando os comprimentos forem iguais).

Chame em \`main\` com um \`&String\` contendo \`soroban\` e o literal \`"rpc"\`.

Saída esperada:

\`\`\`text
longest: soroban
\`\`\`

### Dicas

- \`.len()\` num \`&str\` dá o comprimento em bytes.
- Um \`if\`/\`else\` é uma expressão — pode ser a cauda da função.
`,
  },

  "rust-lifetimes-2": {
    instructions: `## Deixe a elisão trabalhar

Três regras preenchem os lifetimes que você não escreveu:

1. Cada referência de entrada omitida ganha seu próprio parâmetro de lifetime.
2. Com **exatamente um** lifetime de entrada, ele é atribuído a toda saída omitida.
3. Com um receptor \`&self\`, o lifetime de **self** é atribuído a toda saída omitida.

### Sua tarefa

1. \`fn first_word(s: &str) -> &str\` — tudo antes do primeiro espaço, ou a string inteira se não houver. Pela regra 2, nenhuma anotação é necessária.
2. \`struct Parser<'a> { input: &'a str }\` com \`impl<'a> Parser<'a>\` e \`fn rest(&self) -> &str\` devolvendo \`self.input\`. A regra 3 cobre o método.
3. Imprima \`first_word("submit tx now")\` e depois \`rest()\` num parser sobre \`"ledger 42"\`.

Saída esperada:

\`\`\`text
word: submit
rest: ledger 42
\`\`\`

### Dicas

- \`s.find(' ')\` devolve \`Option<usize>\` — o índice em bytes da primeira ocorrência.
- \`&s[..i]\` fatia até esse índice.
`,
  },

  "rust-lifetimes-3": {
    instructions: `## Dois lifetimes, um deles irrelevante

Quando duas entradas não têm relação, dê nomes separados. O que importa é qual deles aparece na **saída**:

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Isso diz a quem chama que o resultado empresta de \`text\` e não de \`sep\` — então \`sep\` pode ser descartado imediatamente.

### Sua tarefa

Implemente \`prefix\`: tudo em \`text\` antes da primeira ocorrência de \`sep\`, ou \`text\` inteiro se não ocorrer.

Em \`main\`:

1. \`let text = String::from("GA7Q:250:live");\`
2. Num **bloco interno**, crie um separador \`String\` com \`":"\`, chame \`prefix\` e deixe o bloco avaliar para o resultado.
3. Imprima o resultado *depois* do bloco — onde o separador já não existe.

Saída esperada:

\`\`\`text
prefix: GA7Q
\`\`\`

Se compilar, você provou que o resultado não empresta do separador.
`,
  },

  "rust-lifetimes-4": {
    instructions: `## Uma visão zero-copy

Uma struct que guarda referências precisa de um parâmetro de lifetime, que promete que a struct não pode sobreviver ao buffer para o qual aponta:

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

Esse é o formato de todo parser zero-copy: fatias do buffer de outra pessoa em vez de uma \`String\` por campo.

### Sua tarefa

1. Defina \`Frame<'a>\` como acima.
2. Em \`impl<'a> Frame<'a>\`, escreva \`fn parse(raw: &'a str) -> Frame<'a>\` que quebra no primeiro \`'|'\`. O texto antes vira \`method\`, o depois vira \`params\`. Sem \`'|'\`, \`method\` é a entrada inteira e \`params\` é \`""\`.
3. Em \`main\`, parseie uma \`String\` com \`getLedgerEntries|[42]\` e imprima os dois campos.

Saída esperada:

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

Nenhuma alocação de \`String\` em lugar nenhum dentro de \`parse\`.
`,
  },

  "rust-lifetimes-5": {
    instructions: `## 'static significa duas coisas diferentes

**\`&'static T\`** — uma referência válida durante o programa inteiro. Literais de string se qualificam; quase nada computado em runtime se qualifica.

**\`T: 'static\`** — um bound que diz que o tipo **não contém referências de vida curta**. Uma \`String\` própria satisfaz isso trivialmente, e continua sendo dropada no fim do escopo. É o bound que \`thread::spawn\` e \`tokio::spawn\` exigem: uma task pode sobreviver a quem fez o spawn, então não pode emprestar as locais dele.

### Sua tarefa

1. Ligue um \`&'static str\` **com a anotação de tipo explícita**, contendo \`baked into the binary\`, e imprima.
2. Escreva \`fn spawn_like<T: Send + 'static>(value: T) -> T\` que só devolve o argumento.
3. Passe uma \`String\` própria com \`owned at runtime\` por ela e imprima o resultado — provando que uma \`String\` própria satisfaz \`'static\`.

Saída esperada:

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\`
`,
  },
};
