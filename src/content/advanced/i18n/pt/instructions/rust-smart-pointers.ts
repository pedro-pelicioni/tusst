// PT · editor instructions — Smart Pointers & Interior Mutability.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-smart-pointers.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSmartPointersInstructionsPt: Record<string, { instructions: string }> = {
  "rust-smart-pointers-1": {
    instructions: `## Uma árvore de expressão

\`Box<T>\` é uma alocação na heap com um único dono. O uso que a define é dar a um tipo recursivo um **tamanho conhecido** — uma box tem a largura de um ponteiro, aponte para o que apontar, então o cálculo de tamanho termina.

### Sua tarefa

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`
2. \`fn eval(e: &Expr) -> i64\` casando as duas variantes e recorrendo no \`Add\`.
3. Monte \`2 + (3 + 4)\` como árvore, imprima o valor avaliado, e depois imprima a árvore com \`{:?}\`.

Saída esperada:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

O \`Debug\` da \`Box\` é transparente — ele imprime o que ela aponta, não a box.

### Dicas

- No \`match e\`, o braço \`Num(n)\` liga \`n: &i64\`, então devolva \`*n\`.
- O braço \`Add(a, b)\` liga \`&Box<Expr>\`, que coage para \`&Expr\` na chamada recursiva.
`,
  },

  "rust-smart-pointers-2": {
    instructions: `## Conte os donos

\`Rc<T>\` é ownership compartilhado com contagem de referências para uma **única thread**. \`Rc::clone\` incrementa um contador; o valor é liberado quando ele chega a zero.

Escreva \`Rc::clone(&x)\`, não \`x.clone()\` — isso diz no call site que é um incremento de contador, não uma cópia profunda.

### Sua tarefa

1. Embrulhe uma \`String\` com \`timeout=30s\` num \`Rc\` e imprima \`Rc::strong_count\`.
2. Faça dois clones com \`Rc::clone\`, imprima a contagem de novo, e imprima o valor por um deles.
3. Faça \`drop\` de um clone e imprima a contagem mais uma vez.

Saída esperada:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\`

### Dicas

- \`use std::rc::Rc;\`
- \`Rc::strong_count(&config)\` recebe uma referência.
`,
  },

  "rust-smart-pointers-3": {
    instructions: `## Borrow checado em runtime

\`RefCell<T>\` mantém as regras de borrow e move a *checagem* para o runtime, onde uma violação dá **panic**. É isso que permite mutação através de um \`&self\` — mutabilidade interior — e o que faz de \`Rc<RefCell<T>>\` um valor compartilhado e gravável.

Mantenha os guards curtos: \`cell.borrow_mut().push(x)\` libera no fim do statement, enquanto \`let g = cell.borrow_mut();\` segura até o fim do escopo.

### Sua tarefa

1. Monte um \`Rc<RefCell<Vec<String>>>\` com um vetor vazio.
2. Por um **clone** do \`Rc\`, empurre \`started\` e depois \`ready\` — cada um no próprio statement.
3. Imprima o tamanho, e depois a primeira entrada.
4. Segure um borrow compartilhado numa variável, imprima se \`try_borrow_mut()\` dá certo, faça \`drop\` da variável e imprima de novo.

Saída esperada:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\`

### Dicas

- \`use std::cell::RefCell;\` e \`use std::rc::Rc;\`
- \`RefCell::new(Vec::<String>::new())\` anota o vetor vazio.
`,
  },

  "rust-smart-pointers-4": {
    instructions: `## Ownership desce, referências sobem

Dois \`Rc\`s apontando um para o outro formam um **ciclo** — nenhuma contagem chega a zero e a memória vaza. \`Weak<T>\` quebra isso: um handle fraco não é dono do valor, então \`upgrade()\` devolve \`Option<Rc<T>>\`.

A regra: pais são donos dos filhos com força, filhos apontam de volta com fraqueza.

### Sua tarefa

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`
2. Monte um \`root\` com \`Weak::new()\` como pai, e depois um \`leaf\` cujo pai é \`Rc::downgrade(&root)\`.
3. Empurre um clone de \`leaf\` nos filhos de \`root\`.
4. Imprima a contagem forte de \`root\`, depois a contagem fraca.
5. Faça \`upgrade()\` do pai do leaf e imprima o nome com \`{:?}\`, mapeando para uma \`String\` clonada.

Saída esperada:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

A contagem forte do root ficar em 1 é o ciclo não se formando.

### Dicas

- \`use std::rc::{Rc, Weak};\`
- \`leaf.parent.borrow().upgrade()\` dá \`Option<Rc<Node>>\`; \`.map(|p| p.name.clone())\` transforma em \`Option<String>\`.
`,
  },

  "rust-smart-pointers-5": {
    instructions: `## Aloque só quando precisar

\`Cow<'a, T>\` é um enum: \`Borrowed(&'a T)\` ou \`Owned(T::Owned)\`. Ele deixa uma função devolver dado emprestado no caminho comum e alocar só quando de fato mudou alguma coisa.

Compensa quando o caminho que modifica é **raro** — sanitizar um milhão de identificadores dos quais doze precisam mudar faz doze alocações, não um milhão.

### Sua tarefa

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — se a entrada tiver espaço, devolva \`Cow::Owned\` com espaços trocados por \`_\`; senão \`Cow::Borrowed\`.
2. Chame com \`"get_events"\` e com \`"get events now"\`.
3. Para cada, calcule \`matches!(&value, Cow::Borrowed(_))\` num binding próprio, e depois imprima o valor e essa flag.

Saída esperada:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\`

### Dicas

- \`use std::borrow::Cow;\`
- \`input.replace(' ', "_")\` devolve uma \`String\`.
- Calcule a flag antes do \`println!\` para nada ser movido no meio do format.
`,
  },

  "rust-smart-pointers-6": {
    instructions: `## Construa um smart pointer

\`Deref\` te dá o operador \`*\` **e** a deref coercion — \`wrapper.method()\` encontra os métodos do alvo. É só isso que \`Box\`, \`Rc\`, \`String\` e \`Vec\` fazem; não há mágica do compilador.

A resolução de métodos procura primeiro no wrapper, depois segue o \`Deref\`. É por isso que \`Rc\` usa \`Rc::clone(&x)\` em vez de um método — um método inerente sombrearia o do alvo.

### Sua tarefa

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` com \`fn new(inner: T) -> Self\` e \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` com \`type Target = T;\`, ou seja \`fn deref(&self) -> &T\` — incrementando \`reads\` antes de devolver \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` devolvendo \`&mut self.inner\` — sem contar.
4. Em \`main\`: embrulhe \`vec![1, 2, 3]\`, imprima \`.len()\` pela coerção, faça \`push(4)\` pelo \`DerefMut\`, imprima \`*v\` com \`{:?}\`, e depois imprima a contagem de leituras.

Saída esperada:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Duas leituras: \`.len()\` e \`*v\`. O \`push\` passa por \`deref_mut\`, e \`reads()\` é inerente, então nunca coage.

### Dicas

- \`use std::cell::Cell;\` e \`use std::ops::{Deref, DerefMut};\`
- Usa-se \`Cell\` em vez de um \`u32\` simples porque \`deref\` só tem \`&self\`.
`,
  },
};
