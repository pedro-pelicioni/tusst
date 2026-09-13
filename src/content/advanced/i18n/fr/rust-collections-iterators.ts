import type { LessonStep } from "@/content/steps";

// FR · Collections, Iterators & Closures.
//
// Overlay for ../../steps/rust-collections-iterators.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustCollectionsIteratorsStepsFr: Record<string, LessonStep[]> = {
  "rust-collections-iterators-1": [
    {
      kind: "theory",
      body: `\`Vec<T>\` est un tableau contigu qui grandit. Ses coûts valent la peine d'être connus précisément :

| opération | coût |
| --- | --- |
| \`push\` / \`pop\` à la fin | O(1) amorti |
| \`insert\` / \`remove\` au début | O(n) — tout se décale |
| index | O(1) |

« Amorti » couvre la croissance : quand le buffer est plein, \`Vec\` en alloue un plus grand (typiquement le double) et copie tout dedans. Moyenné sur beaucoup de push, c'est O(1), mais n'importe quel push *individuel* peut être celui qui coûte cher.`,
    },
    {
      kind: "theory",
      body: `Deux conséquences sur lesquelles tu peux agir.

**Si tu connais la taille, dis-le.** \`Vec::with_capacity(n)\` alloue une seule fois. Dans une boucle qui push un nombre connu d'éléments, ça supprime chaque réallocation et chaque copie — le gain de performance le moins cher du langage.

**Si tu fais push et pop aux deux bouts, utilise \`VecDeque<T>\`.** C'est un ring buffer : \`push_front\` et \`pop_front\` sont O(1), là où \`Vec::insert(0, x)\` est O(n). C'est la différence entre une file qui scale et une qui devient quadratique en silence.

\`\`\`rust
let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(2);
q.push_front(1);     // O(1) — un Vec décalerait chaque élément
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Une boucle push exactement 10 000 éléments connus dans un `Vec::new()`. Qu'est-ce que `with_capacity(10_000)` économise ?",
      options: [
        "Une bonne douzaine de réallocations, chacune copiant tout ce qui a été push jusque-là",
        "Rien — `Vec` alloue déjà sa taille finale au premier push",
        "La vérification de bornes à chaque push",
      ],
      answer: 0,
      explain:
        "Doubler de 4 jusqu'à 10 000, c'est environ onze étapes de croissance, et les dernières copient des milliers d'éléments chacune. Une seule allocation en amont supprime tout ça.",
    },
    {
      kind: "fill",
      prompt: "Ajoute en tête d'une file en temps constant.",
      file: "main.rs",
      before: "let mut q: VecDeque<i32> = VecDeque::new();\nq.",
      after: "(1);",
      choices: ["push_front", "insert", "push"],
      answer: 0,
      explain:
        "`VecDeque` est un ring buffer, donc une insertion en tête est un déplacement de pointeur. La même opération sur un `Vec` décale chaque élément.",
    },
    {
      kind: "quiz",
      question:
        "Une file de jobs fait `jobs.remove(0)` sur un `Vec` à chaque tick, avec des milliers de jobs. Quel est le symptôme ?",
      options: [
        "Le débit se dégrade avec la profondeur de la file — chaque pop décale tous les éléments restants",
        "La mémoire grandit sans limite parce que `remove` ne libère jamais",
        "Rien de mesurable ; `remove(0)` est optimisé en un simple déplacement de pointeur",
      ],
      answer: 0,
      explain:
        "La file quadratique classique. Invisible dans un test avec dix jobs, elle domine le profil à dix mille — remplace le `Vec` par un `VecDeque` et elle disparaît.",
    },
    {
      kind: "editor",
      intro: `### Le bon container, le bon coût

1. Construis un \`Vec<i32>\` avec \`Vec::with_capacity(4)\`, push \`1..=4\`, et affiche le vecteur avec \`{:?}\` et sa \`capacity()\` — elle doit toujours valoir exactement 4.
2. Construis un \`VecDeque<i32>\`, \`push_back\` \`2\` puis \`3\`, \`push_front\` \`1\`, affiche-le avec \`{:?}\`, puis affiche \`pop_front()\` avec \`{:?}\`.

Sortie attendue :

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\``,
    },
  ],

  "rust-collections-iterators-2": [
    {
      kind: "theory",
      body: `Les deux maps diffèrent sur un axe qui décide de tout le reste : **l'ordre**.

\`HashMap<K, V>\` — lookup, insertion et suppression en O(1) en moyenne. L'ordre d'itération est **arbitraire et délibérément randomisé** d'une exécution à l'autre. Exige \`K: Hash + Eq\`.

\`BTreeMap<K, V>\` — O(log n) pour les mêmes opérations. L'itération se fait **toujours dans l'ordre trié des clés**, et elle supporte les requêtes par plage : \`map.range("a".."m")\`. Exige \`K: Ord\`.`,
    },
    {
      kind: "theory",
      body: `Prends \`BTreeMap\` quand tu as besoin d'une itération triée, de scans par plage ou d'une sortie déterministe (un dump de config, un snapshot de test, un payload signé). Prends \`HashMap\` sinon — elle est plus rapide et c'est le bon défaut.

L'API \`entry\` est l'idiome à mémoriser pour les deux :

\`\`\`rust
*hits.entry(method).or_insert(0) += 1;
\`\`\`

Un seul lookup, pas deux. La version naïve — \`if map.contains_key(k) { ... } else { ... }\` — hashe la clé deux fois et emprunte la map deux fois, ce que le borrow checker va aussi te reprocher. \`or_insert_with(Vec::new)\` est le même pattern quand la valeur par défaut n'est pas gratuite à construire.`,
    },
    {
      kind: "quiz",
      question:
        "Deux `HashMap` contenant les mêmes entrées peuvent itérer dans des ordres différents, et le même programme peut varier d'une exécution à l'autre. Pourquoi est-ce délibéré ?",
      options: [
        "Le hachage randomisé protège des attaques par collision, et l'ordre instable empêche le code de dépendre d'un accident",
        "C'est un bug de la bibliothèque standard conservé pour la compatibilité",
        "L'ordre dépend de la quantité de mémoire libre à ce moment-là",
      ],
      answer: 0,
      explain:
        "Les deux moitiés comptent : un hash prévisible laisse un attaquant forcer toutes les clés dans le même bucket, et le code qui s'appuie discrètement sur l'ordre d'itération casse au moindre redimensionnement.",
    },
    {
      kind: "fill",
      prompt: "Incrémente un compteur, en le créant à zéro la première fois.",
      file: "main.rs",
      before: "*hits.",
      after: "(m).or_insert(0) += 1;",
      choices: ["entry", "get", "insert"],
      answer: 0,
      explain:
        "`entry` hashe une fois et te rend un slot que tu peux remplir ou modifier. `get` suivi de `insert` hashe deux fois et demande deux borrows séparés.",
    },
    {
      kind: "quiz",
      question:
        "Un service dump sa config en JSON, et le diff entre deux exécutions est bruyant alors que la config n'a pas changé. Quelle est la cause probable ?",
      options: [
        "Il sérialise depuis une `HashMap`, dont l'ordre d'itération varie à chaque exécution — une `BTreeMap` rendrait la sortie déterministe",
        "Le sérialiseur JSON n'est pas déterministe",
        "La config est lue avant d'être complètement chargée",
      ],
      answer: 0,
      explain:
        "Une sortie déterministe est la raison standard de payer le O(log n) de `BTreeMap`. Même chose pour tout ce qui est hashé ou signé, où la stabilité octet par octet est obligatoire.",
    },
    {
      kind: "editor",
      intro: `### L'ordre ou la vitesse

1. Avec une \`HashMap<&str, u32>\`, compte les occurrences dans \`["getEvents", "sendTx", "getEvents"]\` via l'API \`entry\`, puis affiche le compte de \`getEvents\`.
2. Avec une \`BTreeMap<&str, u32>\`, insère \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` dans cet ordre, puis collecte ses clés dans un \`Vec<&str>\` et affiche-les — triées, quel que soit l'ordre d'insertion.

Sortie attendue :

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-3": [
    {
      kind: "theory",
      body: `Trois façons d'itérer, et la différence tient à ce que chacune te remet :

| méthode | produit | collection après |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | intacte |
| \`.iter_mut()\` | \`&mut T\` | mutée sur place |
| \`.into_iter()\` | \`T\` | **consommée** |

\`\`\`rust
let doubled: Vec<i32> = data.iter().map(|n| n * 2).collect();  // data survit
for n in data.iter_mut() { *n += 10; }                          // data change
let owned: Vec<String> = data.into_iter().map(...).collect();   // data n'existe plus
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`for x in &collection\` est du sucre pour \`.iter()\`, \`for x in &mut collection\` pour \`.iter_mut()\`, et \`for x in collection\` pour \`.into_iter()\`.

C'est la dernière qui surprend : écrire \`for item in items\` **move** \`items\`, et la ligne suivante qui s'en sert ne compilera pas. Le fix est presque toujours un seul \`&\`.

Choisis \`into_iter\` délibérément, pas par accident. Quand tu transformes des données possédées en d'autres données possédées et que tu n'auras plus besoin de l'original — mapper un \`Vec<Row>\` en \`Vec<Response>\` — c'est exactement ce qu'il faut, et ça évite de cloner chaque élément.`,
    },
    {
      kind: "quiz",
      question:
        "`for item in items { ... }` compile, mais la ligne suivante qui utilise `items` non. Pourquoi ?",
      options: [
        "La boucle se désucre en `into_iter()`, qui a consommé la collection",
        "La boucle a emprunté `items` et le borrow dure jusqu'à la fin de la fonction",
        "`items` doit être déclaré `mut` pour être lu après une boucle",
      ],
      answer: 0,
      explain:
        "Un seul caractère le corrige : `for item in &items`. Ça vaut le coup de l'intérioriser, parce que le message d'erreur pointe sur la deuxième ligne alors que la cause est sur la première.",
    },
    {
      kind: "fill",
      prompt: "Modifie chaque élément du vecteur sur place.",
      file: "main.rs",
      before: "for n in data.",
      after: "() {\n    *n += 10;\n}",
      choices: ["iter_mut", "iter", "into_iter"],
      answer: 0,
      explain:
        "`iter_mut` produit des `&mut i32`, donc `*n += 10` écrit à travers. `iter` produirait des `&i32`, auxquels on ne peut rien assigner.",
    },
    {
      kind: "quiz",
      question:
        "Tu transformes un `Vec<Row>` en `Vec<Response>` et tu n'auras plus besoin des rows. Quelle est la bonne option ?",
      options: [
        "`into_iter()` — il move chaque row dans la closure de mapping, sans clone par élément",
        "`iter()` plus `.clone()` dans la closure, pour laisser l'original intact",
        "`iter_mut()`, en mutant chaque row en réponse",
      ],
      answer: 0,
      explain:
        "C'est là que `into_iter` mérite sa place. Sortir `iter().cloned()` par habitude ici alloue une fois par élément pour des données que tu allais drop.",
    },
    {
      kind: "editor",
      intro: `### Emprunter, muter, consommer

Avec \`let mut data = vec![1, 2, 3];\` :

1. \`.iter()\` et \`map\` pour doubler chaque élément dans un nouveau \`Vec<i32>\`, affiche-le — \`data\` survit.
2. \`.iter_mut()\` pour ajouter \`10\` à chacun sur place, affiche \`data\`.
3. \`.into_iter()\` et \`map\` pour transformer chacun en \`String\`, collecte dans un \`Vec<String>\`, affiche-le.

Sortie attendue :

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\``,
    },
  ],

  "rust-collections-iterators-4": [
    {
      kind: "theory",
      body: `Les adapters d'itérateur sont **lazy**. \`map\`, \`filter\` et \`filter_map\` construisent un nouvel itérateur et n'exécutent rien :

\`\`\`rust
let lazy = raw.iter().map(|s| s.len());   // zéro élément traité
\`\`\`

Le travail ne commence que quand quelque chose *consomme* l'itérateur : \`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`. Jusque-là tu assembles un pipeline, tu n'en fais pas tourner un.`,
    },
    {
      kind: "theory",
      body: `La laziness est ce qui rend le chaînage gratuit. \`filter\` puis \`map\` ne construit **pas** de \`Vec\` intermédiaire — chaque élément traverse toute la chaîne un par un, et le compilateur replie généralement le tout en une seule boucle sans allocation.

Elle permet aussi le court-circuit : \`.find(...)\` sur une chaîne d'un million d'éléments s'arrête au premier qui matche, et ceux d'après ne sont jamais touchés.

\`filter_map\` mérite qu'on s'y arrête. Il mappe et filtre en une passe, en ne gardant que les \`Some\` :

\`\`\`rust
.filter_map(|s| s.parse::<i64>().ok())    // parse, jette les échecs
\`\`\`

C'est la façon idiomatique de parser un batch où certaines entrées sont du bruit — et elle jette la raison de l'échec, donc utilise \`.map(...).collect::<Result<Vec<_>, _>>()\` à la place quand un échec doit faire échouer le batch.`,
    },
    {
      kind: "quiz",
      question:
        "`raw.iter().map(expensive).filter(pred)` est assigné à une variable et jamais consommé. Combien de fois `expensive` s'exécute-t-il ?",
      options: [
        "Zéro — les adapters construisent un pipeline et rien ne s'exécute tant qu'un consommateur ne demande pas d'éléments",
        "Une fois par élément, au moment où la chaîne est construite",
        "Une fois, sur le premier élément, pour inférer les types",
      ],
      answer: 0,
      explain:
        "C'est aussi pour ça que `Iterator` est `#[must_use]` : une chaîne non consommée est presque toujours un bug, et le compilateur te prévient.",
    },
    {
      kind: "fill",
      prompt: "Parse chaque entrée et jette silencieusement celles qui échouent.",
      file: "main.rs",
      before: "raw.iter().",
      after: "(|s| s.parse::<i64>().ok())",
      choices: ["filter_map", "map", "filter"],
      answer: 0,
      explain:
        "`filter_map` garde les `Some` et jette les `None` en une passe. `map` seul te laisserait avec un `Vec<Option<i64>>`.",
    },
    {
      kind: "quiz",
      question:
        "Quand `filter_map(|x| f(x).ok())` est-il le mauvais choix pour parser un batch ?",
      options: [
        "Quand une seule entrée invalide doit faire échouer tout le batch — il jette l'erreur avec l'élément",
        "Quand le batch est gros, parce que `filter_map` alloue par élément",
        "Quand la closure capture une variable du scope englobant",
      ],
      answer: 0,
      explain:
        "Jeter en silence les entrées malformées est une vraie décision, et souvent la mauvaise pour des données financières. `.collect::<Result<Vec<_>, _>>()` fait échouer le batch à la première erreur.",
    },
    {
      kind: "editor",
      intro: `### Rien ne tourne tant que tu ne demandes pas

Avec \`let raw = vec!["12", "x", "30", "", "8"];\` :

1. Enchaîne \`.iter()\`, \`filter_map\` qui parse chaque entrée en \`i64\` et garde les succès, puis \`filter\` qui ne garde que les valeurs \`>= 10\`. Collecte dans un \`Vec<i64>\` et affiche-le.
2. Construis une deuxième chaîne qui mappe chaque entrée vers son \`.len()\` et lie-la à une variable **sans** la consommer. Affiche \`nothing ran yet\`, puis collecte-la dans un \`Vec<usize>\` et affiche ça.

Sortie attendue :

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\``,
    },
  ],

  "rust-collections-iterators-5": [
    {
      kind: "theory",
      body: `\`fold\` transporte un accumulateur à travers toute la séquence. C'est le consommateur le plus général qui existe — \`sum\`, \`count\`, \`max\` et \`collect\` sont tous des folds sous le capot.

\`\`\`rust
let total = latencies.iter().fold(0u64, |acc, n| acc + n);
\`\`\`

Trois parties : la valeur initiale, l'accumulateur, l'élément courant. La closure renvoie le prochain accumulateur.

\`reduce\` est un \`fold\` sans valeur initiale — il prend le premier élément à la place, et renvoie donc une \`Option\`, parce qu'une séquence vide n'a pas de réponse :

\`\`\`rust
let worst = latencies.iter().copied().reduce(u64::max);   // Option<u64>
\`\`\``,
    },
    {
      kind: "theory",
      body: `L'accumulateur n'a pas à être un nombre. Construire une \`String\` est un fold dont l'accumulateur est la string en cours de construction :

\`\`\`rust
.fold(String::new(), |mut acc, n| {
    if !acc.is_empty() { acc.push('|'); }
    acc.push_str(&n.to_string());
    acc
})
\`\`\`

Note le \`|mut acc, ...|\` et le \`acc\` renvoyé — l'accumulateur est *move* à chaque étape, et c'est ce qui garde ça sans allocation par itération.

Ne force pas. Si une simple boucle \`for\` avec une locale mutable est plus claire, écris ça : le compilateur produit le même code, et la version fold d'un corps complexe est vraiment plus dure à lire.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `reduce` renvoie-t-il `Option<T>` alors que `fold` non ?",
      options: [
        "Il prend sa valeur initiale dans le premier élément, donc une séquence vide n'a aucun résultat à donner",
        "Il peut échouer si la closure panic",
        "Il est lazy, et l'`Option` signale s'il a été consommé",
      ],
      answer: 0,
      explain:
        "`fold` a toujours une réponse parce que tu as fourni l'élément neutre. `reduce` sur un itérateur vide est vraiment indéfini, et l'`Option` le dit.",
    },
    {
      kind: "fill",
      prompt: "Transporte un total courant à travers la séquence à partir d'un zéro explicite.",
      file: "main.rs",
      before: "latencies.iter().",
      after: "(0u64, |acc, n| acc + n)",
      choices: ["fold", "reduce", "scan"],
      answer: 0,
      explain:
        "`reduce` ne prend pas de valeur initiale. `scan` est la variante qui produit *chaque* accumulateur intermédiaire au lieu du dernier seulement.",
    },
    {
      kind: "quiz",
      question:
        "Laquelle de ces raisons est la raison honnête de préférer une boucle `for` à un `fold` ?",
      options: [
        "Le corps est assez complexe pour que le fold se lise moins bien — le code généré est le même dans les deux cas",
        "`fold` alloue une closure sur le heap à chaque appel",
        "Les boucles `for` sont plus rapides parce qu'elles évitent le protocole d'itérateur",
      ],
      answer: 0,
      explain:
        "Les deux compilent vers la même boucle. La lisibilité est toute la décision, et « plus fonctionnel » n'est pas automatiquement plus lisible.",
    },
    {
      kind: "editor",
      intro: `### Agréger de trois façons

Avec \`let latencies = vec![12u64, 40, 7, 95, 23];\` :

1. \`fold\` à partir de \`0u64\` vers un total, affiche-le.
2. \`.copied().reduce(u64::max)\` pour le pire cas, affiche avec \`{:?}\`.
3. \`fold\` à partir de \`String::new()\` en joignant les valeurs avec \`'|'\`, affiche-le.

Sortie attendue :

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\``,
    },
  ],

  "rust-collections-iterators-6": [
    {
      kind: "theory",
      body: `Une closure implémente l'un de trois traits, et **tu ne choisis pas** — le compilateur décide à partir de ce que le corps fait de ses captures.

| trait | le corps | appelable |
| --- | --- | --- |
| \`FnOnce\` | **consomme** une capture | une fois |
| \`FnMut\` | **mute** une capture | plusieurs fois, demande \`&mut\` |
| \`Fn\` | ne fait que **lire** les captures | plusieurs fois, depuis \`&\` |

Ils s'emboîtent : tout \`Fn\` est aussi \`FnMut\`, et tout \`FnMut\` est aussi \`FnOnce\`. Donc borner un paramètre sur \`Fn\` est la chose *la plus* restrictive que tu puisses demander.`,
    },
    {
      kind: "theory",
      body: `Ce qui veut dire que la règle pour écrire une signature est l'inverse de l'intuition :

**Borne sur le trait le plus lâche qui te laisse l'appeler aussi souvent que nécessaire.** \`FnOnce\` si tu l'appelles une fois, \`FnMut\` si tu l'appelles plusieurs fois et que ça ne te dérange pas qu'elle garde un état mutable, \`Fn\` seulement si tu dois l'appeler depuis plusieurs endroits à la fois — depuis plusieurs threads, par exemple.

\`\`\`rust
fn call_once<F: FnOnce() -> String>(f: F) -> String { f() }
fn call_mut<F: FnMut()>(mut f: F) { f(); f(); }
fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64 { f(1) + f(2) }
\`\`\`

Note le \`mut f\` dans le cas \`FnMut\` : l'appeler demande un borrow exclusif de la closure elle-même, parce que la closure possède l'état qu'elle mute.`,
    },
    {
      kind: "quiz",
      question:
        "Le corps d'une closure fait `count += 1` sur une locale capturée. Quels traits implémente-t-elle ?",
      options: [
        "`FnMut` et `FnOnce` — mais pas `Fn`, parce que l'appeler mute son état capturé",
        "Les trois — muter une capture n'affecte pas le trait",
        "`FnOnce` seulement, parce que la mutation consomme la capture",
      ],
      answer: 0,
      explain:
        "C'est pour ça qu'un paramètre borné `F: Fn()` rejette une closure compteur. Les traits décrivent ce que l'appel *fait*, pas ce que la closure renvoie.",
    },
    {
      kind: "fill",
      prompt:
        "Borne un callback qui sera invoqué deux fois et a le droit de garder un état mutable.",
      file: "main.rs",
      before: "fn call_fn_mut<F: ",
      after: ">(mut f: F) {",
      choices: ["FnMut()", "Fn()", "FnOnce()"],
      answer: 0,
      explain:
        "`FnOnce` ne peut pas être appelé deux fois, et `Fn` rejetterait toute closure qui mute une capture — ce qui exclut la plupart des callbacks utiles.",
    },
    {
      kind: "quiz",
      question:
        "Un paramètre de callback est borné `F: Fn()` et la closure d'un appelant ne compile pas. Quel est le fix habituel ?",
      options: [
        "Relâcher le bound en `FnMut` — sauf si le callback doit vraiment être appelé depuis plusieurs endroits à la fois",
        "Demander à l'appelant d'envelopper son état dans un `RefCell`",
        "Changer le paramètre en `&dyn Fn()`",
      ],
      answer: 0,
      explain:
        "`RefCell` marche, c'est vrai — il convertit la restriction à la compilation en restriction au runtime — mais y recourir pour satisfaire un bound trop serré, c'est résoudre le problème de ta propre API dans le code de l'appelant.",
    },
    {
      kind: "editor",
      intro: `### Le compilateur choisit le trait

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` qui renvoie \`f(1) + f(2)\`. Appelle-la avec une closure qui multiplie par un \`factor = 10\` capturé.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` qui appelle \`f()\` deux fois. Appelle-la avec une closure qui incrémente un \`count\` capturé, puis affiche \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` qui appelle \`f()\` une fois. Appelle-la avec une closure \`move\` qui renvoie une \`String\` capturée.

Sortie attendue :

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\``,
    },
  ],

  "rust-collections-iterators-7": [
    {
      kind: "theory",
      body: `Par défaut, une closure capture par référence — le minimum dont elle peut se contenter. C'est juste pour une closure utilisée immédiatement, et faux pour une qui **survit au scope où elle a été créée**.

\`move\` force chaque capture à être prise par valeur :

\`\`\`rust
fn make_greeter(name: String) -> Box<dyn Fn() -> String> {
    Box::new(move || format!("hello {name}"))
}
\`\`\`

Sans \`move\`, la closure garderait une référence vers \`name\`, qui meurt quand la fonction retourne. Avec, la closure possède \`name\` et peut aller n'importe où.`,
    },
    {
      kind: "theory",
      body: `Deux formes de retour pour une closure, et le choix est le même compromis générique-contre-objet qu'avant :

**\`impl Fn() -> T\`** — un seul type anonyme concret, dispatch statique, aucune allocation. Utilise-le quand la fonction renvoie exactement une closure.

**\`Box<dyn Fn() -> T>\`** — allouée sur le heap, dispatch dynamique. Nécessaire quand différentes branches renvoient des closures *différentes*, ou quand tu dois en stocker plusieurs dans une collection.

\`\`\`rust
fn make_counter(start: u32) -> impl FnMut() -> u32 {
    let mut n = start;
    move || { n += 1; n }
}
\`\`\`

Cette closure possède \`n\`. Chaque appel mute son propre état et il survit à chaque appel — c'est une machine à états sans aucune déclaration de struct.`,
    },
    {
      kind: "quiz",
      question:
        "Une fonction renvoie `impl Fn() -> String` par-dessus une `String` construite localement, sans `move`. Que se passe-t-il ?",
      options: [
        "Ça ne compile pas — la closure emprunte une locale qui meurt quand la fonction retourne",
        "Ça compile, et la closure renvoyée voit une string vide",
        "Ça compile ; Rust prolonge le lifetime de la locale pour l'aligner sur la closure",
      ],
      answer: 0,
      explain:
        "C'est l'un des rappels à `move` les plus courants du langage, et la suggestion du compilateur est exactement la bonne : ajoute `move`.",
    },
    {
      kind: "fill",
      prompt:
        "Renvoie une closure qui possède son état capturé, avec dispatch statique et sans allocation.",
      file: "main.rs",
      before: "fn make_counter(start: u32) -> ",
      after: " {\n    let mut n = start;\n    move || { n += 1; n }\n}",
      choices: ["impl FnMut() -> u32", "Box<dyn Fn() -> u32>", "fn() -> u32"],
      answer: 0,
      explain:
        "Elle doit être `FnMut` (elle mute `n`), et `impl` évite la box. `fn() -> u32` est un simple pointeur de fonction, qui ne peut transporter aucun état capturé.",
    },
    {
      kind: "quiz",
      question: "Quand dois-tu boxer une closure renvoyée au lieu d'utiliser `impl Fn` ?",
      options: [
        "Quand différentes branches renvoient des closures différentes — `impl Trait` nomme un seul type concret",
        "Dès que la closure est `move`",
        "Dès que la closure capture plus d'une variable",
      ],
      answer: 0,
      explain:
        "Chaque closure est son propre type anonyme, donc deux littéraux de closure sont deux types même s'ils ont l'air identiques. `impl Trait` ne peut représenter que l'un d'eux.",
    },
    {
      kind: "editor",
      intro: `### Des closures qui survivent à leur scope

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — possède \`n\`, l'incrémente et le renvoie à chaque appel.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — renvoie \`"hello <name>"\`.
3. Dans \`main\`, appelle le compteur trois fois dans des bindings séparés et affiche les trois sur une ligne, puis affiche la sortie du greeter pour \`rpc\`.

Sortie attendue :

\`\`\`text
11 12 13
hello rpc
\`\`\`

Le compteur démarre à \`10\`. Lie chaque appel à sa propre variable avant d'afficher — trois borrows \`&mut\` dans un seul \`println!\`, c'est une bagarre dont tu n'as pas besoin.`,
    },
  ],
};
