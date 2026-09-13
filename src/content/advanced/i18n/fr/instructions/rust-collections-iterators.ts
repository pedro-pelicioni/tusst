// FR · editor instructions — Collections, Iterators & Closures.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-collections-iterators.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustCollectionsIteratorsInstructionsFr: Record<string, { instructions: string }> = {
  "rust-collections-iterators-1": {
    instructions: `## Le bon container, le bon coût

\`Vec<T>\` est contigu : push/pop en O(1) à la **fin**, insert/remove en O(n) au **début**. \`with_capacity\` alloue une seule fois au lieu de doubler encore et encore.

\`VecDeque<T>\` est un ring buffer : O(1) aux **deux** bouts.

### Ta tâche

1. \`Vec::with_capacity(4)\`, push \`1..=4\`, affiche le vecteur avec \`{:?}\` et sa \`capacity()\` — toujours exactement 4.
2. Un \`VecDeque<i32>\` : \`push_back(2)\`, \`push_back(3)\`, \`push_front(1)\`. Affiche-le avec \`{:?}\`, puis affiche \`pop_front()\` avec \`{:?}\`.

Sortie attendue :

\`\`\`text
vec: [1, 2, 3, 4] cap: 4
deque: [1, 2, 3]
front: Some(1)
\`\`\`

### Indices

- \`use std::collections::VecDeque;\`
- \`for n in 1..=4\` est une plage inclusive.
`,
  },

  "rust-collections-iterators-2": {
    instructions: `## L'ordre ou la vitesse

\`HashMap\` — O(1) en moyenne, ordre d'itération **arbitraire** (randomisé à chaque exécution, exprès).
\`BTreeMap\` — O(log n), **toujours triée** par clé, supporte les requêtes par plage.

Choisis \`BTreeMap\` pour une itération triée, des plages ou une sortie déterministe. \`HashMap\` sinon.

L'API \`entry\` hashe une fois là où \`contains_key\` + \`insert\` hashe deux fois :

\`\`\`rust
*hits.entry(m).or_insert(0) += 1;
\`\`\`

### Ta tâche

1. Avec une \`HashMap<&str, u32>\`, compte les occurrences dans \`["getEvents", "sendTx", "getEvents"]\` via \`entry\`, puis affiche le compte de \`getEvents\`.
2. Avec une \`BTreeMap<&str, u32>\`, insère \`("rpc", 3)\`, \`("api", 1)\`, \`("db", 2)\` dans cet ordre, collecte ses \`keys()\` dans un \`Vec<&str>\`, et affiche-les.

Sortie attendue :

\`\`\`text
getEvents: 2
sorted keys: ["api", "db", "rpc"]
\`\`\`

### Indices

- \`use std::collections::{BTreeMap, HashMap};\`
- \`.keys().copied().collect()\` transforme les \`&&str\` en \`&str\`.
`,
  },

  "rust-collections-iterators-3": {
    instructions: `## Emprunter, muter, consommer

| méthode | produit | collection après |
| --- | --- | --- |
| \`.iter()\` | \`&T\` | intacte |
| \`.iter_mut()\` | \`&mut T\` | mutée sur place |
| \`.into_iter()\` | \`T\` | consommée |

\`for x in collection\` se désucre en \`into_iter()\` — c'est pour ça que la ligne suivante qui s'en sert ne compilera pas.

### Ta tâche

Avec \`let mut data = vec![1, 2, 3];\` :

1. \`.iter()\` + \`map\` pour doubler chaque élément dans un nouveau \`Vec<i32>\` ; affiche-le.
2. \`.iter_mut()\` pour ajouter \`10\` à chacun sur place ; affiche \`data\`.
3. \`.into_iter()\` + \`map\` pour transformer chacun en \`String\` ; collecte dans un \`Vec<String>\` et affiche-le.

Sortie attendue :

\`\`\`text
borrowed: [2, 4, 6]
mutated: [11, 12, 13]
consumed: ["11", "12", "13"]
\`\`\`
`,
  },

  "rust-collections-iterators-4": {
    instructions: `## Rien ne tourne tant que tu ne demandes pas

Les adapters (\`map\`, \`filter\`, \`filter_map\`) sont **lazy** — ils construisent un pipeline. Le travail ne commence qu'à un consommateur (\`collect\`, \`sum\`, \`count\`, \`for\`, \`fold\`, \`find\`).

C'est pour ça que le chaînage n'alloue rien entre les étapes : chaque élément traverse toute la chaîne un par un.

### Ta tâche

Avec \`let raw = vec!["12", "x", "30", "", "8"];\` :

1. \`.iter()\` → \`filter_map\` qui parse chaque entrée en \`i64\` et garde les succès → \`filter\` qui garde \`>= 10\` → collecte dans un \`Vec<i64>\` ; affiche-le.
2. Construis une deuxième chaîne qui mappe chaque entrée vers son \`.len()\` et lie-la **sans la consommer**. Affiche \`nothing ran yet\`, puis collecte dans un \`Vec<usize>\` et affiche ça.

Sortie attendue :

\`\`\`text
kept: [12, 30]
nothing ran yet
lengths: [2, 1, 2, 0, 1]
\`\`\`

### Indices

- \`s.parse::<i64>().ok()\` transforme le \`Result\` en l'\`Option\` que \`filter_map\` attend.
- \`.collect::<Vec<usize>>()\` annote le collect en ligne.
`,
  },

  "rust-collections-iterators-5": {
    instructions: `## Agréger de trois façons

\`fold\` transporte un accumulateur à travers la séquence à partir d'une valeur initiale explicite. \`reduce\` prend sa valeur initiale dans le premier élément, donc il renvoie une \`Option\`.

L'accumulateur n'a pas à être un nombre — construire une \`String\` est un fold dont l'accumulateur est la string.

### Ta tâche

Avec \`let latencies = vec![12u64, 40, 7, 95, 23];\` :

1. \`fold\` à partir de \`0u64\` vers un total ; affiche-le.
2. \`.copied().reduce(u64::max)\` pour le pire cas ; affiche avec \`{:?}\`.
3. \`fold\` à partir de \`String::new()\` en joignant les valeurs avec \`'|'\` ; affiche-le.

Sortie attendue :

\`\`\`text
total: 177
worst: Some(95)
summary: 12|40|7|95|23
\`\`\`

### Indices

- La closure du fold en \`String\` prend \`|mut acc, n|\` et renvoie \`acc\`.
- Protège le séparateur avec \`if !acc.is_empty()\`.
`,
  },

  "rust-collections-iterators-6": {
    instructions: `## Le compilateur choisit le trait

| trait | le corps | appelable |
| --- | --- | --- |
| \`FnOnce\` | consomme une capture | une fois |
| \`FnMut\` | mute une capture | plusieurs fois, demande \`&mut\` |
| \`Fn\` | ne fait que lire les captures | plusieurs fois, depuis \`&\` |

Ils s'emboîtent, donc \`Fn\` est le bound **le plus** restrictif que tu puisses demander. Borne sur le plus lâche qui te laisse l'appeler aussi souvent que nécessaire.

### Ta tâche

1. \`fn call_fn<F: Fn(i64) -> i64>(f: F) -> i64\` qui renvoie \`f(1) + f(2)\`. Appelle-la avec une closure qui multiplie par un \`factor = 10\` capturé.
2. \`fn call_fn_mut<F: FnMut()>(mut f: F)\` qui appelle \`f()\` deux fois. Appelle-la avec une closure qui incrémente un \`count\` capturé, puis affiche \`count\`.
3. \`fn call_fn_once<F: FnOnce() -> String>(f: F) -> String\` qui appelle \`f()\` une fois. Appelle-la avec une closure \`move\` qui renvoie une \`String\` capturée.

Sortie attendue :

\`\`\`text
Fn: 30
FnMut: 2
FnOnce: consumed
\`\`\`

### Indices

- Le paramètre \`FnMut\` doit être \`mut f: F\` — l'appeler emprunte la closure de façon exclusive.
- La \`String\` capturée contient \`consumed\`.
`,
  },

  "rust-collections-iterators-7": {
    instructions: `## Des closures qui survivent à leur scope

Une closure capture par référence par défaut. \`move\` force chaque capture à être prise **par valeur**, ce dont une closure renvoyée par une fonction a besoin.

\`impl Fn() -> T\` nomme un seul type anonyme concret : dispatch statique, aucune allocation. \`Box<dyn Fn() -> T>\` est obligatoire quand différentes branches renvoient des closures différentes, ou quand tu en stockes plusieurs ensemble.

### Ta tâche

1. \`fn make_counter(start: u32) -> impl FnMut() -> u32\` — possède \`n\`, l'incrémente et le renvoie à chaque appel.
2. \`fn make_greeter(name: String) -> Box<dyn Fn() -> String>\` — renvoie \`"hello <name>"\`.
3. Dans \`main\`, appelle le compteur trois fois dans des **bindings séparés**, affiche les trois sur une ligne, puis affiche la sortie du greeter pour \`rpc\`.

Sortie attendue :

\`\`\`text
11 12 13
hello rpc
\`\`\`

Le compteur démarre à \`10\`. Lie chaque appel avant d'afficher — trois borrows \`&mut\` dans un seul \`println!\`, c'est une bagarre dont tu n'as pas besoin.
`,
  },
};
