// FR · editor instructions — Lifetimes.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-lifetimes.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustLifetimesInstructionsFr: Record<string, { instructions: string }> = {
  "rust-lifetimes-1": {
    instructions: `## Lie une sortie à ses entrées

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Lis-le comme une promesse faite à l'appelant : *donne-moi deux références, et celle que je te rends reste valide tant que les deux entrées le sont.* Rien n'est alloué et rien n'est prolongé — \`'a\` permet seulement au compilateur de relier la sortie aux entrées.

### Ta tâche

Implémente \`longest\`, qui renvoie l'argument le plus long (renvoie \`a\` quand les longueurs sont égales).

Appelle-la dans \`main\` avec une \`&String\` contenant \`soroban\` et le littéral \`"rpc"\`.

Sortie attendue :

\`\`\`text
longest: soroban
\`\`\`

### Indices

- \`.len()\` sur un \`&str\` donne la longueur en octets.
- Un \`if\`/\`else\` est une expression — il peut être la queue de la fonction.
`,
  },

  "rust-lifetimes-2": {
    instructions: `## Laisse l'élision faire son boulot

Trois règles remplissent les lifetimes que tu n'as pas écrits :

1. Chaque référence d'entrée élidée reçoit son propre paramètre de lifetime.
2. Avec **exactement un** lifetime d'entrée, il est assigné à chaque sortie élidée.
3. Avec un receveur \`&self\`, c'est le lifetime de **self** qui est assigné à chaque sortie élidée.

### Ta tâche

1. \`fn first_word(s: &str) -> &str\` — tout ce qui précède le premier espace, ou la string entière s'il n'y en a pas. Règle 2 : aucune annotation nécessaire.
2. \`struct Parser<'a> { input: &'a str }\` avec \`impl<'a> Parser<'a>\` et \`fn rest(&self) -> &str\` qui renvoie \`self.input\`. La règle 3 couvre la méthode.
3. Affiche \`first_word("submit tx now")\`, puis \`rest()\` sur un parser construit sur \`"ledger 42"\`.

Sortie attendue :

\`\`\`text
word: submit
rest: ledger 42
\`\`\`

### Indices

- \`s.find(' ')\` renvoie \`Option<usize>\` — l'index en octets de la première correspondance.
- \`&s[..i]\` découpe une slice jusqu'à cet index.
`,
  },

  "rust-lifetimes-3": {
    instructions: `## Deux lifetimes, dont un sans importance

Quand deux entrées n'ont aucun rapport, nomme-les séparément. Ce qui compte, c'est lequel apparaît sur la **sortie** :

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Ça dit à l'appelant que le résultat emprunte à \`text\` et pas à \`sep\` — donc \`sep\` peut être drop immédiatement.

### Ta tâche

Implémente \`prefix\` : tout ce qui, dans \`text\`, précède la première occurrence de \`sep\`, ou \`text\` en entier s'il n'apparaît pas.

Dans \`main\` :

1. \`let text = String::from("GA7Q:250:live");\`
2. Dans un **bloc interne**, crée un séparateur \`String\` contenant \`":"\`, appelle \`prefix\`, et laisse le bloc s'évaluer au résultat.
3. Affiche le résultat *après* le bloc — là où le séparateur n'existe plus.

Sortie attendue :

\`\`\`text
prefix: GA7Q
\`\`\`

Si ça compile, tu as prouvé que le résultat n'emprunte pas au séparateur.
`,
  },

  "rust-lifetimes-4": {
    instructions: `## Une vue zero-copy

Une struct qui contient des références a besoin d'un paramètre de lifetime, qui promet que la struct ne peut pas survivre au buffer dans lequel elle pointe :

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

C'est la forme de tout parser zero-copy : des slices du buffer de quelqu'un d'autre au lieu d'une \`String\` par champ.

### Ta tâche

1. Définis \`Frame<'a>\` comme ci-dessus.
2. Dans \`impl<'a> Frame<'a>\`, écris \`fn parse(raw: &'a str) -> Frame<'a>\` qui coupe au premier \`'|'\`. Le texte avant est \`method\`, le texte après est \`params\`. Sans \`'|'\`, \`method\` est l'entrée entière et \`params\` est \`""\`.
3. Dans \`main\`, parse une \`String\` contenant \`getLedgerEntries|[42]\` et affiche les deux champs.

Sortie attendue :

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

Aucune allocation de \`String\` nulle part à l'intérieur de \`parse\`.
`,
  },

  "rust-lifetimes-5": {
    instructions: `## 'static veut dire deux choses différentes

**\`&'static T\`** — une référence valide pendant tout le programme. Les littéraux de string sont éligibles ; presque rien de calculé à l'exécution ne l'est.

**\`T: 'static\`** — un bound qui signifie que le type ne contient **aucune référence à vie courte**. Une \`String\` possédée le satisfait trivialement, et elle est quand même droppée à la fin de sa portée. C'est le bound que \`thread::spawn\` et \`tokio::spawn\` exigent : une task peut survivre à ce qui l'a spawnée, donc elle n'a pas le droit d'emprunter ses locales.

### Ta tâche

1. Lie un \`&'static str\` **avec l'annotation de type explicite**, contenant \`baked into the binary\`, et affiche-le.
2. Écris \`fn spawn_like<T: Send + 'static>(value: T) -> T\` qui renvoie son argument tel quel.
3. Fais passer une \`String\` possédée contenant \`owned at runtime\` à travers, et affiche le résultat — ce qui prouve qu'une \`String\` possédée satisfait \`'static\`.

Sortie attendue :

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\`
`,
  },
};
