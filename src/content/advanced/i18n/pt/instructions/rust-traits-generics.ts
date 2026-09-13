// PT · editor instructions — Traits, Generics & Dispatch.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-traits-generics.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustTraitsGenericsInstructionsPt: Record<string, { instructions: string }> = {
  "rust-traits-generics-1": {
    instructions: `## Um método obrigatório, um default

Uma trait pode fornecer corpos de método default escritos em cima dos métodos obrigatórios. Quem implementa ganha esses de graça e pode sobrescrevê-los.

\`\`\`rust
trait Health {
    fn name(&self) -> String;
    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

### Sua tarefa

1. Defina \`Health\` como acima.
2. Defina as unit structs \`Db\` e \`Rpc\`.
3. \`Db\` implementa só \`name\`, devolvendo \`db\`.
4. \`Rpc\` implementa \`name\` (devolvendo \`rpc\`) **e** sobrescreve \`status\` para devolver \`"<name>: degraded"\`.
5. Imprima o status de cada.

Saída esperada:

\`\`\`text
db: ok
rpc: degraded
\`\`\`

### Dicas

- Uma unit struct se escreve \`struct Db;\` e se usa como o valor \`Db\`.
- \`format!\` monta uma \`String\` do mesmo jeito que \`println!\` monta uma linha.
`,
  },

  "rust-traits-generics-2": {
    instructions: `## Restrinja exatamente o que você usa

Um bound é um contrato de mão dupla: quem chama precisa fornecer um tipo que o satisfaça, e em troca o corpo pode contar com ele.

Restrinja ao **mínimo** que o corpo precisa. Um \`T: Clone\` desnecessário numa função que nunca clona não adiciona segurança — só rejeita quem chamava com um tipo não-\`Clone\` perfeitamente bom.

### Sua tarefa

Escreva \`fn describe_all<T>(items: &[T]) -> String\` com cláusula \`where T: Display\`, juntando os elementos com \`", "\`.

Chame com \`&[1, 2, 3]\` e com \`&["a", "b"]\`.

Saída esperada:

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

### Dicas

- \`use std::fmt::Display;\`
- Monte a string com \`push_str\`, não com \`join\` — o ponto é ver o bound sendo usado.
- \`.iter().enumerate()\` te dá o índice, então você pode pular o separador no primeiro elemento.
`,
  },

  "rust-traits-generics-3": {
    instructions: `## Uma resposta por tipo

Um **tipo associado** é escolhido uma vez, no único impl para um dado tipo. Um **parâmetro genérico** permite vários impls por tipo.

O teste: *existe exatamente uma resposta sensata por tipo que implementa?* \`Iterator::Item\` é associado porque um contador produz um único tipo de coisa. \`From<T>\` é genérico porque um tipo deve converter a partir de vários.

### Sua tarefa

1. \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`
2. \`struct Counter { n: u32 }\` implementando \`Source\` com \`type Item = u32;\` e \`fn next_item(&mut self) -> Option<u32>\` — o tipo resolvido, não \`Option<Self::Item>\` — produzindo \`1\`, \`2\`, \`3\` e depois \`None\`.
3. \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` coletando tudo que a fonte produzir.
4. Imprima o vetor drenado com \`{:?}\`.

Saída esperada:

\`\`\`text
items: [1, 2, 3]
\`\`\`

### Dicas

- \`while let Some(item) = s.next_item()\` drena de forma limpa.
- Repare em \`Vec<S::Item>\` — o tipo associado projetado a partir do \`S\` concreto.
`,
  },

  "rust-traits-generics-4": {
    instructions: `## Três call sites, três funções

O compilador **monomorfiza** um genérico: carimba uma cópia especializada por tipo concreto com que ele é chamado. Cada cópia conhece seu tipo, então toda chamada dentro dela é direta e inlineável — é isso que "custo zero" significa aqui.

Os custos se movem para o tamanho do binário e o tempo de compilação.

### Sua tarefa

Escreva \`fn emit<T: Debug>(label: &str, value: T)\` imprimindo \`"<label>: <value:?>"\`.

Chame com \`42u32\`, com \`"rpc"\` e com \`vec![true, false]\` — três instanciações.

Saída esperada:

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Repare nas aspas em torno de \`rpc\`: isso é formatação \`Debug\`, não \`Display\`, e a diferença é o ponto.

### Dicas

- \`use std::fmt::Debug;\`
- O formatador é \`{:?}\`.
`,
  },

  "rust-traits-generics-5": {
    instructions: `## Um registro heterogêneo

Um \`Vec<T>\` guarda um tipo só. Quando você precisa de vários, precisa de um trait object:

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` não tem tamanho em tempo de compilação, então sempre vive atrás de um ponteiro — e esse ponteiro é **gordo**: uma palavra para o dado, uma para a vtable.

### Sua tarefa

1. \`trait Check { fn run(&self) -> String; }\`
2. Unit structs \`Ping\` e \`Disk\` implementando a trait, devolvendo \`ping ok\` e \`disk ok\`.
3. Monte um \`Vec<Box<dyn Check>>\` com uma de cada, itere imprimindo cada resultado, e depois imprima a contagem.

Saída esperada:

\`\`\`text
ping ok
disk ok
count: 2
\`\`\`

### Dicas

- Itere com \`for c in &checks\` para o vetor não ser consumido antes do \`.len()\`.
`,
  },

  "rust-traits-generics-6": {
    instructions: `## Mantenha a trait usável como objeto

Uma trait é **object safe** só se todo método puder ser despachado por uma vtable. Duas regras causam quase toda falha real:

1. **Sem métodos genéricos** — uma vtable é uma tabela fixa, e um genérico precisaria de um número ilimitado de slots.
2. **Sem \`Self\` na posição de retorno** — quem chama não tem como saber o tamanho desse tipo.

A correção para as duas é mover o buraco do tempo de compilação para o runtime: receba \`&dyn Trait\` em vez de um genérico.

### Sua tarefa

1. \`trait Encode { fn encode(&self) -> String; }\`
2. \`struct Num(i64)\` implementando como o texto decimal do número.
3. \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — o \`&dyn\` é o que a mantém object safe.
4. Unit struct \`Log\` implementando \`Sink\`, devolvendo \`"log:<encoded>"\`.
5. Guarde como \`Box<dyn Sink>\` e aceite um \`Num(42)\`.

Saída esperada:

\`\`\`text
log:42
\`\`\`

Se \`accept\` fosse genérico, o passo 5 não compilaria.
`,
  },

  "rust-traits-generics-7": {
    instructions: `## Um impl, todo tipo Display

Um **blanket impl** cobre de uma vez todo tipo que satisfaz um bound:

\`\`\`rust
impl<T: Display> Loggable for T { ... }
\`\`\`

A biblioteca padrão se apoia nisso: \`ToString\` é um blanket impl sobre \`Display\`, e \`Into<U>\` sobre \`From<T>\` — é por isso que você implementa \`From\` e ganha \`Into\` de graça.

A **orphan rule** é o limite: você só pode implementar uma trait para um tipo se for dono da trait ou dono do tipo. O contorno é um newtype, que não custa nada em runtime.

### Sua tarefa

1. \`trait Loggable { fn log_line(&self) -> String; }\`
2. Um blanket \`impl<T: Display> Loggable for T\` devolvendo \`"[log] <value>"\`.
3. Chame \`.log_line()\` em \`42\` e em \`"rpc down"\` — dois tipos, zero impls extras.

Saída esperada:

\`\`\`text
[log] 42
[log] rpc down
\`\`\`
`,
  },
};
