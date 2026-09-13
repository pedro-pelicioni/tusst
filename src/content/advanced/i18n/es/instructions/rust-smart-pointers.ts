// ES · editor instructions — Smart Pointers & Interior Mutability.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-smart-pointers.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSmartPointersInstructionsEs: Record<string, { instructions: string }> = {
  "rust-smart-pointers-1": {
    instructions: `## Un árbol de expresiones

\`Box<T>\` es una asignación en la heap con un solo dueño. Su uso definitorio es darle a un tipo recursivo un **tamaño conocido** — una box mide un puntero apunte a lo que apunte, así que el cálculo del tamaño termina.

### Tu tarea

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`
2. \`fn eval(e: &Expr) -> i64\` haciendo match sobre las dos variantes y recurriendo en \`Add\`.
3. Construye \`2 + (3 + 4)\` como árbol, imprime el valor evaluado y luego imprime el árbol con \`{:?}\`.

Salida esperada:

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

El \`Debug\` de \`Box\` es transparente — imprime aquello a lo que apunta, no la box.

### Pistas

- En \`match e\`, el brazo \`Num(n)\` liga \`n: &i64\`, así que devuelve \`*n\`.
- El brazo \`Add(a, b)\` liga \`&Box<Expr>\`, que coerciona a \`&Expr\` en la llamada recursiva.
`,
  },

  "rust-smart-pointers-2": {
    instructions: `## Cuenta los dueños

\`Rc<T>\` es ownership compartido con conteo de referencias para un **solo thread**. \`Rc::clone\` incrementa un contador; el valor se libera cuando llega a cero.

Escribe \`Rc::clone(&x)\`, no \`x.clone()\` — dice en el call site que esto es un incremento de contador, no una copia profunda.

### Tu tarea

1. Envuelve una \`String\` con \`timeout=30s\` en un \`Rc\`, imprime \`Rc::strong_count\`.
2. Haz dos clones con \`Rc::clone\`, imprime el conteo otra vez e imprime el valor a través de uno de ellos.
3. Haz \`drop\` de un clon e imprime el conteo una vez más.

Salida esperada:

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\`

### Pistas

- \`use std::rc::Rc;\`
- \`Rc::strong_count(&config)\` recibe una referencia.
`,
  },

  "rust-smart-pointers-3": {
    instructions: `## Borrow chequeado en runtime

\`RefCell<T>\` conserva las reglas de borrow y mueve el *chequeo* a runtime, donde una violación hace **panic**. Eso es lo que permite mutar a través de un \`&self\` — mutabilidad interior — y lo que convierte a \`Rc<RefCell<T>>\` en un valor compartido y escribible.

Mantén los guards cortos: \`cell.borrow_mut().push(x)\` libera al final de la sentencia, mientras que \`let g = cell.borrow_mut();\` retiene hasta el final del scope.

### Tu tarea

1. Construye un \`Rc<RefCell<Vec<String>>>\` con un vector vacío.
2. A través de un **clon** del \`Rc\`, haz push de \`started\` y luego de \`ready\` — cada uno en su propia sentencia.
3. Imprime la longitud y luego la primera entrada.
4. Retén un borrow compartido en un binding, imprime si \`try_borrow_mut()\` tiene éxito, haz \`drop\` del binding e imprímelo otra vez.

Salida esperada:

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\`

### Pistas

- \`use std::cell::RefCell;\` y \`use std::rc::Rc;\`
- \`RefCell::new(Vec::<String>::new())\` anota el vector vacío.
`,
  },

  "rust-smart-pointers-4": {
    instructions: `## El ownership baja, las referencias suben

Dos \`Rc\` apuntándose entre sí forman un **ciclo** — ningún conteo llega a cero y la memoria se fuga. \`Weak<T>\` lo rompe: un handle débil no es dueño del valor, así que \`upgrade()\` devuelve \`Option<Rc<T>>\`.

La regla: los padres son dueños fuertes de los hijos, los hijos apuntan de vuelta débilmente.

### Tu tarea

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`
2. Construye \`root\` con \`Weak::new()\` como padre, y luego \`leaf\` cuyo padre es \`Rc::downgrade(&root)\`.
3. Haz push de un clon de \`leaf\` en los hijos de \`root\`.
4. Imprime el conteo fuerte de root, luego su conteo débil.
5. Haz \`upgrade()\` del padre del leaf e imprime el nombre con \`{:?}\`, mapeando a una \`String\` clonada.

Salida esperada:

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

Que el conteo fuerte de root se quede en 1 es el ciclo no formándose.

### Pistas

- \`use std::rc::{Rc, Weak};\`
- \`leaf.parent.borrow().upgrade()\` da \`Option<Rc<Node>>\`; \`.map(|p| p.name.clone())\` lo convierte en \`Option<String>\`.
`,
  },

  "rust-smart-pointers-5": {
    instructions: `## Asigna solo cuando toca

\`Cow<'a, T>\` es un enum: \`Borrowed(&'a T)\` u \`Owned(T::Owned)\`. Le permite a una función devolver datos prestados en el camino común y asignar solo cuando de verdad cambió algo.

Compensa cuando el camino que modifica es **raro** — sanitizar un millón de identificadores de los cuales doce necesitan cambios hace doce asignaciones, no un millón.

### Tu tarea

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — si la entrada contiene un espacio, devuelve \`Cow::Owned\` con los espacios reemplazados por \`_\`; si no, \`Cow::Borrowed\`.
2. Llámala con \`"get_events"\` y con \`"get events now"\`.
3. Para cada una, calcula \`matches!(&value, Cow::Borrowed(_))\` en su propio binding, y luego imprime el valor y esa bandera.

Salida esperada:

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\`

### Pistas

- \`use std::borrow::Cow;\`
- \`input.replace(' ', "_")\` devuelve una \`String\`.
- Calcula la bandera antes del \`println!\` para que nada se mueva a mitad del formato.
`,
  },

  "rust-smart-pointers-6": {
    instructions: `## Construye un smart pointer

\`Deref\` te da el operador \`*\` **y** la deref coercion — \`wrapper.method()\` encuentra los métodos del target. Eso es todo lo que hacen \`Box\`, \`Rc\`, \`String\` y \`Vec\`; no hay magia de compilador.

La resolución de métodos busca primero en el wrapper, y luego sigue \`Deref\`. Por eso \`Rc\` usa \`Rc::clone(&x)\` en lugar de un método — un método inherente ocultaría el del target.

### Tu tarea

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` con \`fn new(inner: T) -> Self\` y \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` con \`type Target = T;\`, así que \`fn deref(&self) -> &T\` — incrementando \`reads\` antes de devolver \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` devolviendo \`&mut self.inner\` — sin contar.
4. En \`main\`: envuelve \`vec![1, 2, 3]\`, imprime \`.len()\` a través de la coerción, haz \`push(4)\` a través de \`DerefMut\`, imprime \`*v\` con \`{:?}\`, y luego imprime el conteo de lecturas.

Salida esperada:

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Dos lecturas: \`.len()\` y \`*v\`. \`push\` pasa por \`deref_mut\`, y \`reads()\` es inherente, así que nunca coerciona.

### Pistas

- \`use std::cell::Cell;\` y \`use std::ops::{Deref, DerefMut};\`
- Se usa \`Cell\` en lugar de un \`u32\` a secas porque \`deref\` solo tiene \`&self\`.
`,
  },
};
