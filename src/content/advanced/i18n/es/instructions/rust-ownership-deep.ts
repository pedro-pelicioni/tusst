// ES · editor instructions — Ownership, Moves & Drops.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-ownership-deep.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustOwnershipDeepInstructionsEs: Record<string, { instructions: string }> = {
  "rust-ownership-deep-1": {
    instructions: `## Dónde vive realmente un valor

\`std::mem::size_of::<T>()\` es una constante de **tiempo de compilación**: informa cuántos bytes ocupa \`T\` en un stack frame. No sabe nada de la heap, porque el tamaño en la heap es un valor de runtime.

- \`size_of::<i32>()\` → \`4\`. El valor entero son esos 4 bytes.
- \`size_of::<String>()\` → \`24\` en un target de 64 bits. Eso es el *handle*: puntero, longitud, capacidad. Los caracteres están en otro lado.
- \`name.len()\` → los bytes realmente guardados en la heap.

### Tu tarea

Imprime los tres, en ese orden.

Salida esperada:

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

### Pistas

- \`use std::mem::size_of;\` te deja escribir \`size_of::<i32>()\` directamente.
- La string es \`"stellar"\` — siete bytes ASCII.
`,
  },

  "rust-ownership-deep-2": {
    instructions: `## Move, copy, clone

La asignación hace exactamente una de dos cosas:

- El tipo es \`Copy\` (cada campo es \`Copy\`, y no tiene impl de \`Drop\`) → los bits se duplican, ambos bindings siguen usables.
- Si no → el ownership **se mueve**, y el binding de origen está muerto.

\`.clone()\` es la forma explícita de pedir la copia profunda que \`=\` se negó a hacer en silencio.

### Tu tarea

Demuestra los tres comportamientos:

1. Liga \`10\` a \`a\`, luego \`a\` a \`b\`. Imprime ambos — \`i32\` es \`Copy\`, así que esto es legal.
2. Construye un \`String\` con \`ledger\`, hazle \`clone()\` en \`s2\`, imprime ambos.
3. Mueve \`s2\` a \`s3\` e imprime \`s3\`.

Salida esperada:

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\`
`,
  },

  "rust-ownership-deep-3": {
    instructions: `## Saca un campo, conserva el resto

El ownership se rastrea **por campo**. Mover un campo fuera de una struct deja la struct parcialmente movida: ese campo está muerto, los demás siguen legibles.

\`\`\`rust
let id = acct.id;              // mueve solo este campo
println!("{}", acct.balance);  // sigue ok
\`\`\`

La struct ya no puede usarse *como un todo* — nada de pasarla, nada de \`{:?}\` — pero leer un campo intacto está permitido.

### Tu tarea

1. Define \`struct Account { id: String, balance: i64 }\`.
2. Construye una con id \`GA7Q\` y balance \`250\`.
3. Mueve **solo** \`id\` a su propio binding.
4. Imprime el id, luego el balance que la struct todavía guarda.

Salida esperada:

\`\`\`text
id: GA7Q
balance: 250
\`\`\`
`,
  },

  "rust-ownership-deep-4": {
    instructions: `## Termina el borrow antes de mutar

Un borrow dura hasta su **último uso**, no hasta el final del bloque. Así que un error de aliasing normalmente se arregla terminando con el borrow antes — o extrayendo de él un resumen propio — en lugar de clonar.

\`\`\`rust
let total: i32 = ledger.iter().sum();  // el borrow empieza y termina en esta sentencia
ledger.push(total);                    // &mut queda libre para tomarse ahora
\`\`\`

### Tu tarea

Dado \`let mut ledger = vec![10, 20, 30];\`:

1. Suma las entradas en \`total\` con un iterador.
2. Haz \`push\` de \`total\` en \`ledger\`.
3. Imprime el vector con \`{:?}\`, luego el total.

Salida esperada:

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\`
`,
  },

  "rust-ownership-deep-5": {
    instructions: `## Deref coercion y reborrowing

**Deref coercion** convierte \`&String\` en \`&str\` en un call site, gratis. Por eso un parámetro debería ser \`&str\`: acepta tanto un \`String\` prestado como un literal.

**Reborrowing** es lo que hace que \`&mut T\` sea usable más de una vez. \`&mut T\` no es \`Copy\`, así que pasar uno debería moverlo — en su lugar el compilador pasa \`&mut *handle\`, un borrow nuevo y más corto que expira cuando la función llamada retorna.

### Tu tarea

1. Escribe \`fn describe(s: &str) -> usize\` que devuelva la longitud, y llámala con un \`&String\` que contenga \`soroban\`.
2. Escribe \`fn bump(n: &mut i64)\` que sume \`1\`.
3. Liga \`let mut seq = 41;\` y toma \`let handle = &mut seq;\`.
4. Llama a \`bump\` dos veces: una pasando \`handle\` (reborrow implícito), otra pasando \`&mut *handle\` (explícito).
5. Imprime el \`seq\` final.

Salida esperada:

\`\`\`text
len: 7
seq: 43
\`\`\`
`,
  },

  "rust-ownership-deep-6": {
    instructions: `## Orden de drop y RAII

Cuando un valor sale de alcance, Rust corre su impl de \`Drop\`. No hay \`finally\` y no hay nada que olvidar.

**Las locales se dropean en orden inverso de declaración** — última declarada, primera liberada. (Los *campos* de una struct se dropean en orden de declaración; la asimetría es deliberada.)

Ese es el mecanismo entero detrás de \`MutexGuard\`: envolver una sección crítica en \`{ }\` libera el lock en la llave que cierra.

### Tu tarea

1. Define \`struct Guard(&'static str)\`.
2. Implementa \`Drop\` para ella, imprimiendo \`release <nombre>\`.
3. En \`main\`: crea un guard llamado \`outer\`, luego abre un bloque que contenga un guard llamado \`inner\` y \`println!("inside")\`. Después del bloque, imprime \`outside\`.

Salida esperada:

\`\`\`text
inside
release inner
outside
release outer
\`\`\`
`,
  },
};
