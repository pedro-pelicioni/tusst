import type { LessonStep } from "@/content/steps";

// FR · Smart Pointers & Interior Mutability.
//
// Overlay for ../../steps/rust-smart-pointers.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustSmartPointersStepsFr: Record<string, LessonStep[]> = {
  "rust-smart-pointers-1": [
    {
      kind: "theory",
      body: `\`Box<T>\` est le smart pointer le plus simple : une allocation sur le heap, un seul propriétaire, libérée quand la box est drop. Aucun comptage de références, aucune vérification au runtime.

Son usage définitoire, c'est de donner à un **type récursif une taille connue** :

\`\`\`rust
enum Expr {
    Num(i64),
    Add(Expr, Expr),        // erreur : recursive type has infinite size
}
\`\`\`

Pour disposer \`Expr\` en mémoire, le compilateur doit savoir quelle taille fait \`Expr\` — ce qui exige de savoir quelle taille fait \`Expr\`. Une box casse la boucle : elle fait toujours la largeur d'un pointeur, quoi qu'elle pointe.`,
    },
    {
      kind: "theory",
      body: `\`\`\`rust
enum Expr {
    Num(i64),
    Add(Box<Expr>, Box<Expr>),   // ok — deux pointeurs
}
\`\`\`

C'est comme ça que chaque arbre, liste et AST est construit en Rust, et c'est aussi ce que fait \`Box<dyn Trait>\` : \`dyn Trait\` n'a pas de taille connue, donc il vit derrière un pointeur.

Faire un match à travers une box ne demande rien de spécial — \`match e { Expr::Add(a, b) => ... }\` te donne \`&Box<Expr>\`, et la deref coercion te laisse le passer directement à une fonction qui prend \`&Expr\`.

Le coût, c'est une allocation par nœud et un saut de pointeur par étape de parcours. Pour un AST, c'est rien. Pour une structure de données chaude avec des millions de nœuds, c'est la raison pour laquelle les arena allocators existent.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi un enum récursif a-t-il besoin d'un `Box` autour de son propre type ?",
      options: [
        "Le compilateur doit calculer une taille fixe pour le type, et une variante imbriquée directement rend cette taille infinie",
        "En Rust, la récursion n'est autorisée que sur des données allouées sur le heap",
        "Sans `Box`, l'enum serait copié à chaque match",
      ],
      answer: 0,
      explain:
        "Une `Box` fait la largeur d'un pointeur quoi qu'elle pointe, donc le calcul de taille termine. L'allocation sur le heap est une conséquence, pas le but.",
    },
    {
      kind: "fill",
      prompt: "Rends la variante récursive représentable.",
      file: "main.rs",
      before: "enum Expr {\n    Num(i64),\n    Add(",
      after: ", Box<Expr>),\n}",
      choices: ["Box<Expr>", "Expr", "&Expr"],
      answer: 0,
      explain:
        "`&Expr` ferait aussi la largeur d'un pointeur, mais il emprunte — l'enum aurait besoin d'un paramètre de lifetime et ne pourrait pas posséder ses enfants.",
    },
    {
      kind: "quiz",
      question:
        "Qu'est-ce que `Box<T>` ajoute par rapport à un `T` tenu directement, à part l'allocation sur le heap ?",
      options: [
        "Rien — pas de compteur de références, pas de vérification de borrow au runtime, ownership unique comme d'habitude",
        "Un ownership partagé, comme un `Rc` allégé",
        "De la mutabilité intérieure, pour modifier la valeur à travers une référence partagée",
      ],
      answer: 0,
      explain:
        "`Box` est le seul smart pointer sans sémantique en plus. C'est pour ça que c'est le bon défaut dès que tu as besoin d'indirection et de rien d'autre.",
    },
    {
      kind: "editor",
      intro: `### Un arbre d'expression

1. \`#[derive(Debug)] enum Expr { Num(i64), Add(Box<Expr>, Box<Expr>) }\`.
2. \`fn eval(e: &Expr) -> i64\` qui match les deux variantes et récurse sur \`Add\`.
3. Dans \`main\`, construis \`2 + (3 + 4)\` sous forme d'arbre, affiche la valeur évaluée, puis affiche l'arbre avec \`{:?}\`.

Sortie attendue :

\`\`\`text
value: 9
tree: Add(Num(2), Add(Num(3), Num(4)))
\`\`\`

Note que le \`Debug\` de \`Box\` est transparent — il affiche ce qu'elle pointe.`,
    },
  ],

  "rust-smart-pointers-2": [
    {
      kind: "theory",
      body: `\`Rc<T>\`, c'est de l'**ownership partagé par comptage de références**, pour un seul thread. Chaque \`Rc::clone\` incrémente un compteur ; chaque drop le décrémente. La valeur est libérée quand le compteur tombe à zéro.

\`\`\`rust
let config = Rc::new(String::from("timeout=30s"));
let a = Rc::clone(&config);        // compteur : 2
let b = Rc::clone(&config);        // compteur : 3
drop(b);                           // compteur : 2
\`\`\`

\`Rc::clone(&x)\` est idiomatique plutôt que \`x.clone()\`, et la raison, c'est la lisibilité : ça rend évident au call site qu'il s'agit d'un incrément de compteur pas cher, pas d'une copie profonde des données.`,
    },
    {
      kind: "theory",
      body: `Deux propriétés décident quand \`Rc\` est le bon outil.

**Il est immuable.** \`Rc<T>\` te donne \`&T\` et rien d'autre. Plusieurs propriétaires tenant chacun un \`&mut T\` casseraient la règle d'aliasing, donc muter exige de le combiner avec \`RefCell\` — la leçon suivante.

**Il n'est pas \`Send\`.** Le compteur est un simple entier avec des incréments non atomiques, donc deux threads qui clonent en même temps le corrompraient. Le compilateur rejette ça à la compilation, et c'est pour ça que la version multi-thread, \`Arc\`, existe comme type séparé : tu ne paies le compteur atomique que quand tu partages vraiment entre threads.

Utilise \`Rc\` pour un graphe ou un arbre où les nœuds ont plusieurs parents, ou pour une configuration partagée par plein de propriétaires sur un seul thread. Va le chercher *après* avoir essayé les borrows simples — un \`&T\` ne coûte rien et suffit en général.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi préférer `Rc::clone(&x)` à `x.clone()` alors que les deux compilent vers la même chose ?",
      options: [
        "Ça fait dire au call site « c'est un incrément de compteur », pas « ça copie les données en profondeur »",
        "`x.clone()` fait une copie profonde de la valeur interne",
        "`x.clone()` n'incrémente pas le compteur de références",
      ],
      answer: 0,
      explain:
        "Une pure convention de lisibilité, mais précieuse : `clone()` sur une grosse struct veut en général dire une allocation, donc distinguer le cas pas cher d'un coup d'œil vaut bien les quelques caractères en plus.",
    },
    {
      kind: "fill",
      prompt: "Lis combien de propriétaires tiennent la valeur en ce moment.",
      file: "main.rs",
      before: 'println!("count: {}", Rc::',
      after: "(&config));",
      choices: ["strong_count", "len", "count"],
      answer: 0,
      explain:
        "`strong_count` est le compteur des propriétaires. Son pendant `weak_count` suit les handles `Weak` non possédants, qui ne gardent pas la valeur en vie.",
    },
    {
      kind: "quiz",
      question: "Pourquoi `Rc<T>` n'est-il délibérément pas `Send` ?",
      options: [
        "Son compteur utilise des incréments non atomiques, donc deux threads qui clonent en même temps le corrompraient",
        "La valeur qu'il pointe est toujours allouée sur le heap, et le heap est local au thread",
        "Il est `Send`, mais seulement quand `T: Sync`",
      ],
      answer: 0,
      explain:
        "C'est une séparation délibérée, pas un oubli : le code mono-thread ne devrait pas payer pour des atomics. `Arc` est le même type avec un compteur atomique.",
    },
    {
      kind: "editor",
      intro: `### Compte les propriétaires

1. Enveloppe une \`String\` contenant \`timeout=30s\` dans un \`Rc\` et affiche \`Rc::strong_count\`.
2. Fais deux clones avec \`Rc::clone\`, affiche à nouveau le compteur, et affiche la valeur à travers l'un d'eux.
3. \`drop\` un clone et affiche le compteur une fois de plus.

Sortie attendue :

\`\`\`text
count: 1
after clones: 3
value: timeout=30s
after drop: 2
\`\`\``,
    },
  ],

  "rust-smart-pointers-3": [
    {
      kind: "theory",
      body: `\`RefCell<T>\` déplace la vérification de borrow de la **compilation au runtime**. La règle ne change pas — plusieurs borrows partagés ou un seul borrow exclusif — mais elle est maintenant comptée au runtime, et la violer **panique** au lieu de refuser de compiler.

\`\`\`rust
let cell = RefCell::new(Vec::new());
cell.borrow_mut().push("started");    // &mut, libéré à la fin de l'instruction
println!("{}", cell.borrow().len());  // & — ok, le borrow mut est parti
\`\`\`

C'est ça, la **mutabilité intérieure** : muter à travers un \`&self\`. C'est ce qui permet à \`Rc<RefCell<T>>\` de donner à plusieurs propriétaires la possibilité d'écrire.`,
    },
    {
      kind: "theory",
      body: `Le panic est le prix, et il est bien réel — un crash au runtime en échange d'un pattern que le compilateur ne pouvait pas vérifier. Deux habitudes le gardent sous contrôle.

**Garde les guards à vie courte.** \`cell.borrow_mut().push(x)\` libère à la fin de l'instruction. \`let g = cell.borrow_mut();\` tient jusqu'à la fin de la portée, et tout \`borrow()\` entre les deux panique. C'est le même piège \`Drop\` contre NLL que \`MutexGuard\`.

**Utilise \`try_borrow_mut\` quand un conflit est plausible.** Il renvoie un \`Result\` au lieu de paniquer, ce qui transforme un crash en décision.

\`\`\`rust
let held = log.borrow();
log.try_borrow_mut().is_ok()    // false — un borrow partagé est encore ouvert
\`\`\`

\`Cell<T>\` est le petit frère moins cher pour les types \`Copy\` : \`get\`/\`set\` sans suivi de borrow et sans aucune possibilité de panic, parce qu'il ne distribue jamais de référence.`,
    },
    {
      kind: "quiz",
      question:
        "Qu'est-ce que `RefCell` change par rapport aux règles de borrow normales ?",
      options: [
        "Rien aux règles — seulement *quand* elles sont vérifiées, en passant de la compilation au runtime, où une violation panique",
        "Il autorise plusieurs borrows mutables simultanés",
        "Il rend la valeur sûre à partager entre threads",
      ],
      answer: 0,
      explain:
        "La dernière option est une confusion courante et dangereuse : `RefCell` est `!Sync`, donc il ne peut pas du tout être partagé entre threads. `Mutex` est son pendant multi-thread.",
    },
    {
      kind: "fill",
      prompt:
        "Tente un borrow exclusif sans risquer un panic si un autre est déjà ouvert.",
      file: "main.rs",
      before: "log.",
      after: "().is_ok()",
      choices: ["try_borrow_mut", "borrow_mut", "get_mut"],
      answer: 0,
      explain:
        "`borrow_mut` panique en cas de conflit. `get_mut` prend `&mut self`, donc il exige un accès exclusif au `RefCell` lui-même — exactement ce que tu n'as pas quand il est à l'intérieur d'un `Rc`.",
    },
    {
      kind: "quiz",
      question:
        "Un service panique par intermittence avec 'already borrowed: BorrowMutError'. Quelle est la cause habituelle ?",
      options: [
        "Un guard `Ref` est tenu à travers un appel qui emprunte à nouveau — le guard vit jusqu'à la fin de la portée, pas jusqu'à sa dernière utilisation",
        "Deux threads empruntent le `RefCell` en même temps",
        "Le `RefCell` a été créé avant le `Rc` qui le contient",
      ],
      answer: 0,
      explain:
        "Ça ne peut pas être des threads : `RefCell` est `!Sync`, donc le compilateur l'a déjà empêché. C'est presque toujours un guard tenu plus longtemps que prévu — délimite-le avec un bloc, ou clone la valeur vers l'extérieur.",
    },
    {
      kind: "editor",
      intro: `### Le borrow, vérifié au runtime

1. Construis un \`Rc<RefCell<Vec<String>>>\` contenant un vecteur vide.
2. À travers un **clone** du \`Rc\`, push \`started\` puis \`ready\` — chacun dans sa propre instruction, pour que le guard soit libéré à chaque fois.
3. Affiche la longueur, puis la première entrée.
4. Tiens un borrow partagé dans un binding, affiche si \`try_borrow_mut()\` réussit, puis \`drop\` le binding et affiche-le à nouveau.

Sortie attendue :

\`\`\`text
entries: 2
first: started
mut while shared: false
mut after release: true
\`\`\``,
    },
  ],

  "rust-smart-pointers-4": [
    {
      kind: "theory",
      body: `Le comptage de références a un échec classique : le **cycle**. Si A possède B et B possède A, aucun des deux compteurs n'atteint jamais zéro et la mémoire n'est jamais libérée. Rust n'empêche pas ça — c'est une fuite, pas de l'unsoundness, et le borrow checker n'a rien à en dire.

La forme standard où ça apparaît, c'est un arbre avec des liens vers le parent :

\`\`\`rust
root.children  ->  Rc<Node>   (strong)
leaf.parent    ->  Rc<Node>   (strong)  // cycle : rien n'est jamais libéré
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`Weak<T>\` le casse. Un handle weak ne possède **pas** la valeur et ne la garde pas en vie :

\`\`\`rust
parent: RefCell<Weak<Node>>          // Rc::downgrade(&root)
children: RefCell<Vec<Rc<Node>>>     // strong, comme avant
\`\`\`

Comme un \`Weak\` peut pointer vers quelque chose de déjà libéré, tu ne peux pas lire à travers directement. \`upgrade()\` renvoie \`Option<Rc<T>>\` — \`Some\` si la valeur est encore en vie, \`None\` si elle a disparu. Cette \`Option\`, c'est toute l'histoire de la sûreté.

La règle à retenir : **l'ownership descend, les références remontent.** Les parents possèdent leurs enfants en strong ; les enfants pointent vers le parent en weak. Pareil pour les listes d'observers et les caches — le cache tient des \`Weak\`, donc mettre quelque chose en cache ne le garde jamais en vie tout seul.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `Weak::upgrade()` renvoie-t-il `Option<Rc<T>>` plutôt que `Rc<T>` ?",
      options: [
        "La valeur a peut-être déjà été drop — un handle weak ne la garde pas en vie, donc elle a pu disparaître",
        "L'upgrade peut échouer si le compteur strong est à son maximum",
        "Il renvoie `None` tant qu'un autre thread tient la valeur",
      ],
      answer: 0,
      explain:
        "Cette `Option` est tout l'intérêt de `Weak` : elle transforme « ce que je pointe a peut-être disparu » en une valeur que tu es obligé de gérer, plutôt qu'en un pointeur pendant.",
    },
    {
      kind: "fill",
      prompt: "Crée un handle non possédant qui remonte vers le parent.",
      file: "main.rs",
      before: "parent: RefCell::new(Rc::",
      after: "(&root)),",
      choices: ["downgrade", "clone", "new"],
      answer: 0,
      explain:
        "`Rc::downgrade` produit un `Weak` et n'incrémente que le compteur weak. `Rc::clone` incrémenterait le compteur strong et recréerait le cycle.",
    },
    {
      kind: "quiz",
      question:
        "Un cache tient des `Rc<Entry>` et la mémoire grossit sans limite même une fois que chaque utilisateur a terminé. Quel est le correctif ?",
      options: [
        "Tenir des `Weak<Entry>` dans le cache, pour que mettre une entrée en cache ne la garde pas en vie à lui seul",
        "Appeler `drop` sur le cache périodiquement",
        "Remplacer `Rc` par `Box`, qui libère de façon déterministe",
      ],
      answer: 0,
      explain:
        "Un cache qui tient des références strong n'est pas un cache, c'est une fuite avec une table de lookup. `Weak` laisse les entrées mourir quand leurs vrais propriétaires ont fini, et `upgrade()` te dit quand c'est arrivé.",
    },
    {
      kind: "editor",
      intro: `### L'ownership descend, les références remontent

1. \`struct Node { name: String, parent: RefCell<Weak<Node>>, children: RefCell<Vec<Rc<Node>>> }\`.
2. Construis un \`root\` avec un parent \`Weak::new()\` vide, puis une \`leaf\` dont le parent est \`Rc::downgrade(&root)\`.
3. Push un clone de \`leaf\` dans les enfants de \`root\`.
4. Affiche le compteur strong de \`root\`, puis son compteur weak.
5. \`upgrade()\` le parent de la leaf et affiche le nom du parent avec \`{:?}\`, en le mappant vers une \`String\` clonée.

Sortie attendue :

\`\`\`text
root strong: 1
root weak: 1
leaf's parent: Some("root")
\`\`\`

Le compteur strong de root reste à 1 — c'est le cycle qui ne se forme pas.`,
    },
  ],

  "rust-smart-pointers-5": [
    {
      kind: "theory",
      body: `\`Cow<'a, T>\` — clone on write — est un enum à deux variantes :

\`\`\`rust
enum Cow<'a, T> {
    Borrowed(&'a T),
    Owned(T::Owned),
}
\`\`\`

Il permet à une fonction de renvoyer des données empruntées sur le chemin courant et des données possédées seulement quand elle a vraiment dû changer quelque chose :

\`\`\`rust
fn sanitize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))   // alloué : on l'a modifié
    } else {
        Cow::Borrowed(input)                  // gratuit : rien à faire
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `L'appelant se fiche de la variante qu'il reçoit — \`Cow<str>\` se deref en \`&str\`, donc ça se lit comme une string dans les deux cas.

Le gain apparaît quand le chemin qui modifie est rare. Assainir un million d'identifiants dont douze contiennent un espace fait douze allocations, là où renvoyer \`String\` inconditionnellement en fait un million.

Son habitat le plus courant, c'est la frontière du parsing : percent-décoder une URL, déséchapper un header, normaliser une valeur de config. Quand l'entrée est déjà correcte — ce qui est en général le cas — rien n'est copié.

Deux notes plus petites. \`.into_owned()\` force la forme possédée quand tu dois la stocker. Et si le chemin qui modifie est le cas courant, laisse tomber le \`Cow\` : tu paies un discriminant d'enum et un branchement pour éviter une allocation qui a lieu presque toujours.`,
    },
    {
      kind: "quiz",
      question: "Quand est-ce que `Cow` est vraiment rentable ?",
      options: [
        "Quand le chemin qui modifie est rare, donc la plupart des appels renvoient un borrow et n'allouent rien",
        "Toujours — c'est strictement moins cher que renvoyer `String`",
        "Quand l'entrée est grosse, peu importe la fréquence des modifications",
      ],
      answer: 0,
      explain:
        "Si chaque appel modifie, `Cow` ajoute un discriminant et un branchement, puis alloue quand même. C'est un pari sur le cas courant, et un mauvais pari coûte un peu.",
    },
    {
      kind: "fill",
      prompt: "Renvoie l'entrée telle quelle, sans allouer.",
      file: "main.rs",
      before: "        Cow::",
      after: "(input)",
      choices: ["Borrowed", "Owned", "From"],
      answer: 0,
      explain:
        "`Cow::Owned(input.to_string())` compilerait et serait correct — et allouerait exactement sur le chemin que ce type tout entier existe pour garder gratuit.",
    },
    {
      kind: "quiz",
      question:
        "Un appelant doit stocker le résultat d'une fonction qui renvoie un `Cow` dans une struct à vie longue. Que doit-il se passer ?",
      options: [
        "Appeler `.into_owned()` — la variante empruntée est liée au lifetime de l'entrée et ne peut pas être stockée",
        "Rien ; `Cow` est `'static` par construction",
        "L'envelopper dans un `Rc` pour étendre son lifetime",
      ],
      answer: 0,
      explain:
        "C'est le moment où l'allocation différée est enfin payée, et la payer ici est la bonne chose : la valeur est maintenant retenue plutôt qu'utilisée puis jetée.",
    },
    {
      kind: "editor",
      intro: `### N'alloue que quand il le faut

1. \`fn sanitize(input: &str) -> Cow<'_, str>\` — si l'entrée contient un espace, renvoie \`Cow::Owned\` avec les espaces remplacés par \`_\` ; sinon renvoie \`Cow::Borrowed\`.
2. Appelle-la avec \`"get_events"\` et avec \`"get events now"\`.
3. Pour chacune, affiche la valeur et si c'est la variante empruntée, en utilisant \`matches!(&value, Cow::Borrowed(_))\` calculé d'abord dans son propre binding.

Sortie attendue :

\`\`\`text
clean: get_events borrowed: true
dirty: get_events_now borrowed: false
\`\`\``,
    },
  ],

  "rust-smart-pointers-6": [
    {
      kind: "theory",
      body: `\`Deref\` est ce qui fait qu'un smart pointer ressemble à ce qu'il enveloppe. L'implémenter te donne deux choses d'un coup :

- l'opérateur \`*\`
- la **deref coercion** — \`&Wrapper<T>\` est accepté là où \`&T\` est attendu, et \`wrapper.method()\` trouve les méthodes de \`T\`

\`\`\`rust
impl<T> Deref for Tracked<T> {
    type Target = T;
    fn deref(&self) -> &T { &self.inner }
}
\`\`\`

C'est exactement comme ça que \`Box\`, \`Rc\`, \`Arc\`, \`String\` (vers \`str\`) et \`Vec\` (vers \`[T]\`) fonctionnent. Il n'y a aucune magie du compilateur dans aucun d'eux.`,
    },
    {
      kind: "theory",
      body: `La résolution de méthode cherche **d'abord** dans le type lui-même, puis suit \`Deref\` vers l'extérieur. Donc une méthode inhérente sur le wrapper masque une méthode du même nom sur la cible — c'est pour ça que \`Rc\` utilise des fonctions associées (\`Rc::clone(&x)\`, \`Rc::strong_count(&x)\`) plutôt que des méthodes : elles ne doivent rien masquer sur \`T\`.

La consigne de la bibliothèque standard est étroite et mérite d'être respectée : **n'implémente \`Deref\` que pour des smart pointers.** L'utiliser pour simuler de l'héritage — un \`Dog\` qui deref vers un \`Animal\` — produit une résolution de méthode surprenante et des messages d'erreur qui pointent vers le mauvais type.

\`DerefMut\` est la même chose pour \`&mut\`, et exige \`Deref\`. Note que \`deref\` est un vrai appel de méthode : y mettre du travail, comme le fait l'exercice, veut dire qu'il tourne à chaque coercion implicite.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `Rc` expose-t-il `Rc::strong_count(&x)` comme fonction associée plutôt que comme méthode ?",
      options: [
        "Une méthode masquerait toute méthode du même nom sur le type enveloppé, puisque les méthodes propres au wrapper sont trouvées en premier",
        "Les fonctions associées sont plus rapides que les méthodes",
        "On ne peut pas appeler de méthodes sur des types qui implémentent `Deref`",
      ],
      answer: 0,
      explain:
        "La convention `Rc::clone(&x)` a ce même second motif en plus de la lisibilité : comme fonction associée, elle ne peut jamais masquer `T::clone` par accident.",
    },
    {
      kind: "fill",
      prompt: "Nomme le type vers lequel ce wrapper se déréférence.",
      file: "main.rs",
      before: "impl<T> Deref for Tracked<T> {\n    type ",
      after: " = T;",
      choices: ["Target", "Item", "Output"],
      answer: 0,
      explain:
        "`Target` est le type associé de `Deref`. `Item` appartient à `Iterator` et `Output` aux traits d'opérateur comme `Add`.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi implémenter `Deref` pour modéliser de l'héritage est-il considéré comme un anti-pattern ?",
      options: [
        "La résolution de méthode cherche silencieusement dans la cible, donc les appels et les messages d'erreur pointent vers un type que le lecteur n'a jamais nommé",
        "C'est une erreur de compilation en dehors de la bibliothèque standard",
        "`Deref` ne peut être implémenté que pour des types qui tiennent un pointeur",
      ],
      answer: 0,
      explain:
        "Ça compile parfaitement. Le coût, c'est la lisibilité : un lecteur ne peut pas dire de quel type vient une méthode, et le message d'erreur non plus quand ça casse.",
    },
    {
      kind: "editor",
      intro: `### Construis un smart pointer

1. \`struct Tracked<T> { inner: T, reads: Cell<u32> }\` avec \`fn new(inner: T) -> Self\` et \`fn reads(&self) -> u32\`.
2. \`impl<T> Deref for Tracked<T>\` avec \`type Target = T\`, qui incrémente \`reads\` avant de renvoyer \`&self.inner\`.
3. \`impl<T> DerefMut for Tracked<T>\` qui renvoie \`&mut self.inner\` (sans compter).
4. Dans \`main\`, enveloppe \`vec![1, 2, 3]\`, affiche \`.len()\` à travers la coercion, \`push(4)\` à travers \`DerefMut\`, affiche \`*v\` avec \`{:?}\`, puis affiche le compteur de lectures.

Sortie attendue :

\`\`\`text
len: 3
after push: [1, 2, 3, 4]
reads: 2
\`\`\`

Deux lectures : \`.len()\` et \`*v\`. \`push\` passe par \`deref_mut\`, et \`reads()\` est inhérente donc elle ne coerce jamais.`,
    },
  ],
};
