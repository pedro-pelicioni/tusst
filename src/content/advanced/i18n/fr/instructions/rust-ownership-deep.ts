// FR · editor instructions — Ownership, Moves & Drops.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-ownership-deep.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustOwnershipDeepInstructionsFr: Record<string, { instructions: string }> = {
  "rust-ownership-deep-1": {
    instructions: `## Où une valeur vit réellement

\`std::mem::size_of::<T>()\` est une constante de **compile time** : elle donne combien de bytes \`T\` occupe dans un stack frame. Elle ne sait rien du heap, parce que la taille sur le heap est une valeur de runtime.

- \`size_of::<i32>()\` → \`4\`. La valeur entière, ce sont ces 4 bytes.
- \`size_of::<String>()\` → \`24\` sur une cible 64 bits. C'est le *handle* : pointeur, longueur, capacité. Les caractères sont ailleurs.
- \`name.len()\` → les bytes réellement tenus sur le heap.

### Ta tâche

Affiche les trois, dans cet ordre.

Sortie attendue :

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

### Indices

- \`use std::mem::size_of;\` te laisse écrire \`size_of::<i32>()\` directement.
- La string est \`"stellar"\` — sept bytes ASCII.
`,
  },

  "rust-ownership-deep-2": {
    instructions: `## Move, copy, clone

Une affectation fait exactement l'une de deux choses :

- Le type est \`Copy\` (chaque champ est \`Copy\`, et il n'a pas d'impl de \`Drop\`) → les bits sont dupliqués, les deux bindings restent utilisables.
- Sinon → l'ownership **move**, et le binding source est mort.

\`.clone()\` est la façon explicite de demander la copie profonde que \`=\` a refusé de faire en silence.

### Ta tâche

Montre les trois comportements :

1. Lie \`10\` à \`a\`, puis \`a\` à \`b\`. Affiche les deux — \`i32\` est \`Copy\`, donc c'est légal.
2. Construis une \`String\` contenant \`ledger\`, \`clone()\`-la dans \`s2\`, affiche les deux.
3. Move \`s2\` dans \`s3\` et affiche \`s3\`.

Sortie attendue :

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\`
`,
  },

  "rust-ownership-deep-3": {
    instructions: `## Prends un champ, garde le reste

L'ownership est suivi **par champ**. Move un champ hors d'une struct laisse la struct partiellement moved : ce champ est mort, les autres restent lisibles.

\`\`\`rust
let id = acct.id;              // move seulement ce champ
println!("{}", acct.balance);  // toujours ok
\`\`\`

La struct ne peut plus être utilisée *comme un tout* — pas question de la passer plus loin, ni de \`{:?}\` — mais lire un champ intact est autorisé.

### Ta tâche

1. Définis \`struct Account { id: String, balance: i64 }\`.
2. Construis-en une avec l'id \`GA7Q\` et le balance \`250\`.
3. Move **uniquement** \`id\` dans son propre binding.
4. Affiche l'id, puis le balance encore tenu par la struct.

Sortie attendue :

\`\`\`text
id: GA7Q
balance: 250
\`\`\`
`,
  },

  "rust-ownership-deep-4": {
    instructions: `## Termine le borrow avant de muter

Un borrow dure jusqu'à sa **dernière utilisation**, pas jusqu'à la fin du bloc. Donc une erreur d'aliasing se corrige en général en finissant avec le borrow plus tôt — ou en extrayant de lui un résumé possédé — plutôt qu'en clonant.

\`\`\`rust
let total: i32 = ledger.iter().sum();  // le borrow commence et se termine dans cette instruction
ledger.push(total);                    // &mut est libre d'être pris maintenant
\`\`\`

### Ta tâche

Étant donné \`let mut ledger = vec![10, 20, 30];\` :

1. Somme les entrées dans \`total\` avec un itérateur.
2. Push \`total\` dans \`ledger\`.
3. Affiche le vecteur avec \`{:?}\`, puis le total.

Sortie attendue :

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\`
`,
  },

  "rust-ownership-deep-5": {
    instructions: `## Deref coercion et reborrowing

**Deref coercion** convertit \`&String\` en \`&str\` au call site, gratuitement. C'est pour ça qu'un paramètre devrait être \`&str\` : il accepte aussi bien une \`String\` empruntée qu'un littéral.

**Reborrowing** est ce qui rend \`&mut T\` utilisable plus d'une fois. \`&mut T\` n'est pas \`Copy\`, donc en passer un devrait le move — à la place, le compilateur passe \`&mut *handle\`, un nouveau borrow plus court qui expire quand la fonction appelée retourne.

### Ta tâche

1. Écris \`fn describe(s: &str) -> usize\` qui renvoie la longueur, et appelle-la avec une \`&String\` contenant \`soroban\`.
2. Écris \`fn bump(n: &mut i64)\` qui ajoute \`1\`.
3. Lie \`let mut seq = 41;\` et prends \`let handle = &mut seq;\`.
4. Appelle \`bump\` deux fois : une fois en passant \`handle\` (reborrow implicite), une fois en passant \`&mut *handle\` (explicite).
5. Affiche le \`seq\` final.

Sortie attendue :

\`\`\`text
len: 7
seq: 43
\`\`\`
`,
  },

  "rust-ownership-deep-6": {
    instructions: `## Ordre de drop et RAII

Quand une valeur sort de son scope, Rust exécute son impl de \`Drop\`. Il n'y a pas de \`finally\` et rien à oublier.

**Les locales sont drop dans l'ordre inverse de déclaration** — dernière déclarée, première libérée. (Les *champs* d'une struct sont drop dans l'ordre de déclaration ; l'asymétrie est délibérée.)

C'est tout le mécanisme derrière \`MutexGuard\` : entourer une section critique de \`{ }\` libère le lock à l'accolade fermante.

### Ta tâche

1. Définis \`struct Guard(&'static str)\`.
2. Implémente \`Drop\` pour elle, en affichant \`release <nom>\`.
3. Dans \`main\` : crée un guard nommé \`outer\`, puis ouvre un bloc contenant un guard nommé \`inner\` et \`println!("inside")\`. Après le bloc, affiche \`outside\`.

Sortie attendue :

\`\`\`text
inside
release inner
outside
release outer
\`\`\`
`,
  },
};
