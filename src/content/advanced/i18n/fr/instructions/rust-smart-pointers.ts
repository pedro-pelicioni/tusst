// FR · editor instructions — Smart Pointers & Interior Mutability.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-smart-pointers.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSmartPointersInstructionsFr: Record<string, { instructions: string }> = {
  "rust-smart-pointers-1": {
    instructions: `## Un arbre d'expression

\`Box<T>\`, c'est une allocation sur le heap avec un seul propriétaire. Son usage définitoire, c'est de donner à un type récursif une **taille connue** — une box fait la largeur d'un pointeur quoi qu'elle pointe, donc le calcul de taille termine.

### Ta tâche

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`
2. \`fn eval(e: &Expr) -> i64\` qui match les deux variantes et récurse sur \`Add\`.
3. Construis \`2 + (3 + 4)\` sous forme d'arbre, affiche la valeur évaluée, puis affiche l'arbre avec \`{:?}\`.

Sortie attendue :

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

Le \`Debug\` de \`Box\` est transparent — il affiche ce qu'elle pointe, pas la box.

### Indices

- Dans \`match e\`, le bras \`Num(n)\` lie \`n: &i64\`, donc renvoie \`*n\`.
- Le bras \`Add(a, b)\` lie des \`&Box<Expr>\`, qui se coercent en \`&Expr\` à l'appel récursif.
`,
  },

  "rust-smart-pointers-2": {
    instructions: `## Compte les propriétaires

\`Rc<T>\`, c'est de l'ownership partagé par comptage de références pour un **seul thread**. \`Rc::clone\` incrémente un compteur ; la valeur est libérée quand il tombe à zéro.

Écris \`Rc::clone(&x)\`, pas \`x.clone()\` — ça dit au call site qu'il s'agit d'un incrément de compteur, pas d'une copie profonde.

### Ta tâche

1. Enveloppe une \`String\` contenant \`timeout=30s\` dans un \`Rc\`, affiche \`Rc::strong_count\`.
2. Fais deux clones avec \`Rc::clone\`, affiche à nouveau le compteur, et affiche la valeur à travers l'un d'eux.
3. \`drop\` un clone et affiche le compteur une fois de plus.

Sortie attendue :

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\`

### Indices

- \`use std::rc::Rc;\`
- \`Rc::strong_count(&config)\` prend une référence.
`,
  },

  "rust-smart-pointers-3": {
    instructions: `## Le borrow, vérifié au runtime

\`RefCell<T>\` garde les règles de borrow et déplace la *vérification* au runtime, où une violation **panique**. C'est ce qui autorise la mutation à travers un \`&self\` — la mutabilité intérieure — et ce qui fait de \`Rc<RefCell<T>>\` une valeur partagée et modifiable.

Garde les guards courts : \`cell.borrow_mut().push(x)\` libère à la fin de l'instruction, alors que \`let g = cell.borrow_mut();\` tient jusqu'à la fin de la portée.

### Ta tâche

1. Construis un \`Rc<RefCell<Vec<String>>>\` contenant un vecteur vide.
2. À travers un **clone** du \`Rc\`, push \`started\` puis \`ready\` — chacun dans sa propre instruction.
3. Affiche la longueur, puis la première entrée.
4. Tiens un borrow partagé dans un binding, affiche si \`try_borrow_mut()\` réussit, \`drop\` le binding, et affiche-le à nouveau.

Sortie attendue :

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\`

### Indices

- \`use std::cell::RefCell;\` et \`use std::rc::Rc;\`
- \`RefCell::new(Vec::<String>::new())\` annote le vecteur vide.
`,
  },

  "rust-smart-pointers-4": {
    instructions: `## L'ownership descend, les références remontent

Deux \`Rc\` qui se pointent l'un l'autre forment un **cycle** — aucun compteur n'atteint zéro et la mémoire fuit. \`Weak<T>\` le casse : un handle weak ne possède pas la valeur, donc \`upgrade()\` renvoie \`Option<Rc<T>>\`.

La règle : les parents possèdent leurs enfants en strong, les enfants pointent vers le parent en weak.

### Ta tâche

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`
2. Construis \`root\` avec \`Weak::new()\` comme parent, puis \`leaf\` dont le parent est \`Rc::downgrade(&root)\`.
3. Push un clone de \`leaf\` dans les enfants de \`root\`.
4. Affiche le compteur strong de root, puis son compteur weak.
5. \`upgrade()\` le parent de la leaf et affiche le nom avec \`{:?}\`, en le mappant vers une \`String\` clonée.

Sortie attendue :

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

Le compteur strong de root qui reste à 1, c'est le cycle qui ne se forme pas.

### Indices

- \`use std::rc::{Rc, Weak};\`
- \`leaf.parent.borrow().upgrade()\` donne \`Option<Rc<Node>>\` ; \`.map(|p| p.name.clone())\` le transforme en \`Option<String>\`.
`,
  },

  "rust-smart-pointers-5": {
    instructions: `## N'alloue que quand il le faut

\`Cow<'a, T>\` est un enum : \`Borrowed(&'a T)\` ou \`Owned(T::Owned)\`. Il permet à une fonction de renvoyer des données empruntées sur le chemin courant et de n'allouer que quand elle a vraiment changé quelque chose.

C'est rentable quand le chemin qui modifie est **rare** — assainir un million d'identifiants dont douze doivent changer fait douze allocations, pas un million.

### Ta tâche

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — si l'entrée contient un espace, renvoie \`Cow::Owned\` avec les espaces remplacés par \`_\` ; sinon \`Cow::Borrowed\`.
2. Appelle-la avec \`"get_events"\` et avec \`"get events now"\`.
3. Pour chacune, calcule \`matches!(&value, Cow::Borrowed(_))\` dans son propre binding, puis affiche la valeur et ce flag.

Sortie attendue :

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\`

### Indices

- \`use std::borrow::Cow;\`
- \`input.replace(' ', "_")\` renvoie une \`String\`.
- Calcule le flag avant le \`println!\` pour que rien ne soit move en plein formatage.
`,
  },

  "rust-smart-pointers-6": {
    instructions: `## Construis un smart pointer

\`Deref\` te donne l'opérateur \`*\` **et** la deref coercion — \`wrapper.method()\` trouve les méthodes de la cible. C'est tout ce que font \`Box\`, \`Rc\`, \`String\` et \`Vec\` ; il n'y a aucune magie du compilateur.

La résolution de méthode cherche d'abord dans le wrapper, puis suit \`Deref\`. C'est pour ça que \`Rc\` utilise \`Rc::clone(&x)\` plutôt qu'une méthode — une méthode inhérente masquerait celle de la cible.

### Ta tâche

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` avec \`fn new(inner: T) -> Self\` et \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` avec \`type Target = T;\`, donc \`fn deref(&self) -> &T\` — qui incrémente \`reads\` avant de renvoyer \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` qui renvoie \`&mut self.inner\` — sans compter.
4. Dans \`main\` : enveloppe \`vec![1, 2, 3]\`, affiche \`.len()\` à travers la coercion, \`push(4)\` à travers \`DerefMut\`, affiche \`*v\` avec \`{:?}\`, puis affiche le compteur de lectures.

Sortie attendue :

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Deux lectures : \`.len()\` et \`*v\`. \`push\` passe par \`deref_mut\`, et \`reads()\` est inhérente donc elle ne coerce jamais.

### Indices

- \`use std::cell::Cell;\` et \`use std::ops::{Deref, DerefMut};\`
- On utilise \`Cell\` plutôt qu'un simple \`u32\` parce que \`deref\` n'a que \`&self\`.
`,
  },
};
