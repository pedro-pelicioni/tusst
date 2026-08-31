// PT · editor instructions for the Advanced Path.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth — the same split the campaign uses in
// `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const ptAdvancedInstructions: Record<string, { instructions: string }> = {
  "rust-ownership-deep-1": {
    instructions: `## Onde um valor realmente vive

\`std::mem::size_of::<T>()\` é uma constante de **tempo de compilação**: informa quantos bytes \`T\` ocupa num stack frame. Ele não sabe nada sobre a heap, porque o tamanho na heap é um valor de runtime.

- \`size_of::<i32>()\` → \`4\`. O valor inteiro são esses 4 bytes.
- \`size_of::<String>()\` → \`24\` num alvo 64 bits. Isso é o *handle*: ponteiro, comprimento, capacidade. Os caracteres estão em outro lugar.
- \`name.len()\` → os bytes efetivamente guardados na heap.

### Sua tarefa

Imprima os três, nessa ordem.

Saída esperada:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

### Dicas

- \`use std::mem::size_of;\` deixa você escrever \`size_of::<i32>()\` direto.
- A string é \`"stellar"\` — sete bytes ASCII.
`,
  },

  "rust-ownership-deep-2": {
    instructions: `## Move, copy, clone

Atribuição faz exatamente uma de duas coisas:

- O tipo é \`Copy\` (todo campo é \`Copy\`, e não há impl de \`Drop\`) → os bits são duplicados, os dois bindings continuam usáveis.
- Caso contrário → o ownership **move**, e o binding de origem está morto.

\`.clone()\` é o jeito explícito de pedir a cópia profunda que o \`=\` se recusou a fazer em silêncio.

### Sua tarefa

Demonstre os três comportamentos:

1. Ligue \`10\` a \`a\`, depois \`a\` a \`b\`. Imprima os dois — \`i32\` é \`Copy\`, então isso é legal.
2. Construa um \`String\` com \`ledger\`, faça \`clone()\` para \`s2\`, imprima os dois.
3. Mova \`s2\` para \`s3\` e imprima \`s3\`.

Saída esperada:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\`
`,
  },

  "rust-ownership-deep-3": {
    instructions: `## Tire um campo, guarde o resto

Ownership é rastreado **por campo**. Mover um campo para fora de uma struct deixa a struct parcialmente movida: esse campo está morto, os outros continuam legíveis.

\`\`\`rust
let id = acct.id;              // move só este campo
println!("{}", acct.balance);  // continua ok
\`\`\`

A struct não pode mais ser usada *como um todo* — nada de repassar, nada de \`{:?}\` — mas ler um campo intacto é permitido.

### Sua tarefa

1. Defina \`struct Account { id: String, balance: i64 }\`.
2. Construa uma com id \`GA7Q\` e balance \`250\`.
3. Mova **apenas** \`id\` para um binding próprio.
4. Imprima o id, depois o balance ainda guardado na struct.

Saída esperada:

\`\`\`text
id: GA7Q
balance: 250
\`\`\`
`,
  },

  "rust-ownership-deep-4": {
    instructions: `## Encerre o borrow antes de mutar

Um borrow dura até o **último uso**, não até o fim do bloco. Então um erro de aliasing normalmente se resolve terminando com o borrow mais cedo — ou extraindo dele um resumo próprio — em vez de clonar.

\`\`\`rust
let total: i32 = ledger.iter().sum();  // borrow começa e acaba neste statement
ledger.push(total);                    // &mut está livre para ser pego agora
\`\`\`

### Sua tarefa

Dado \`let mut ledger = vec![10, 20, 30];\`:

1. Some as entradas em \`total\` com um iterador.
2. Faça \`push\` de \`total\` em \`ledger\`.
3. Imprima o vetor com \`{:?}\`, depois o total.

Saída esperada:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\`
`,
  },

  "rust-ownership-deep-5": {
    instructions: `## Deref coercion e reborrowing

**Deref coercion** converte \`&String\` em \`&str\` num call site, de graça. É por isso que um parâmetro deve ser \`&str\`: ele aceita tanto um \`String\` emprestado quanto um literal.

**Reborrowing** é o que torna \`&mut T\` usável mais de uma vez. \`&mut T\` não é \`Copy\`, então passar um deveria movê-lo — em vez disso o compilador passa \`&mut *handle\`, um borrow novo e mais curto que expira quando a função retorna.

### Sua tarefa

1. Escreva \`fn describe(s: &str) -> usize\` devolvendo o comprimento, e chame com um \`&String\` contendo \`soroban\`.
2. Escreva \`fn bump(n: &mut i64)\` que soma \`1\`.
3. Faça \`let mut seq = 41;\` e pegue \`let handle = &mut seq;\`.
4. Chame \`bump\` duas vezes: uma passando \`handle\` (reborrow implícito), outra passando \`&mut *handle\` (explícito).
5. Imprima o \`seq\` final.

Saída esperada:

\`\`\`text
len: 7
seq: 43
\`\`\`
`,
  },

  "rust-ownership-deep-6": {
    instructions: `## Ordem de drop e RAII

Quando um valor sai de escopo, Rust roda o impl de \`Drop\` dele. Não existe \`finally\` e não há nada para esquecer.

**Locais caem na ordem inversa da declaração** — último declarado, primeiro liberado. (*Campos* de struct caem na ordem de declaração; a assimetria é deliberada.)

Esse é o mecanismo inteiro por trás de \`MutexGuard\`: envolver uma seção crítica em \`{ }\` libera o lock na chave que fecha.

### Sua tarefa

1. Defina \`struct Guard(&'static str)\`.
2. Implemente \`Drop\` para ela, imprimindo \`release <nome>\`.
3. Em \`main\`: crie um guard chamado \`outer\`, depois abra um bloco com um guard chamado \`inner\` e \`println!("inside")\`. Depois do bloco, imprima \`outside\`.

Saída esperada:

\`\`\`text
inside
release inner
outside
release outer
\`\`\`
`,
  },
};
