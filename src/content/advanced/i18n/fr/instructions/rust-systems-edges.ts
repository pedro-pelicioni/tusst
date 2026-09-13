// FR · editor instructions — Macros, Unsafe, FFI & Money.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-systems-edges.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustSystemsEdgesInstructionsFr: Record<string, { instructions: string }> = {
  "rust-systems-edges-1": {
    instructions: `## Rends l'invariant incassable

Tout est privé par défaut, et \`pub\` sur une struct ne rend **pas** ses champs publics. C'est ce qui transforme « un solde n'est jamais négatif » d'un commentaire en une propriété du type : le constructeur est la seule porte.

| écrit | visible par |
| --- | --- |
| *(rien)* | ce module et ses descendants |
| \`pub(crate)\` | n'importe où dans ce crate |
| \`pub(super)\` | le module parent |
| \`pub\` | tout le monde, y compris les autres crates |

### Ta tâche

1. \`mod ledger\` contenant \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — le champ **reste privé**.
2. Dans \`impl Balance\` : \`pub fn new(stroops: i64) -> Option<Balance>\` (\`None\` si négatif), \`pub fn stroops(&self) -> i64\`, et \`pub(crate) fn raw(&self) -> i64\`.
3. Dans \`main\`, \`use ledger::Balance;\` puis affiche \`new(250)\` mappé sur ses stroops, \`new(-1)\` de la même façon, et \`raw()\` sur un solde valide de \`10\`.

Sortie attendue :

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

### Indices

- \`Balance::new(250).map(|b| b.stroops())\` donne un \`Option<i64>\`.
`,
  },

  "rust-systems-edges-2": {
    instructions: `## Une macro qu'une fonction n'aurait pas pu remplacer

\`macro_rules!\` matche de la syntaxe et s'expanse en syntaxe, avant la vérification des types. Elle fait ce qu'une fonction ne peut pas : des arguments variadiques, des types mélangés à une même position, et la capture du texte source d'une expression.

La répétition : \`$( ... ),+\` matche un ou plusieurs groupes séparés par des virgules, et la même forme dans le corps émet une copie par match. \`{{ ... }}\` fait de l'expansion une expression de bloc, donc elle peut contenir des statements et quand même produire une valeur.

### Ta tâche

Écris \`macro_rules! metric\` avec deux règles :

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → la même chose, puis \`",<k>=<v>"\` ajouté pour chaque couple.

Appelle-la avec \`("requests", 42)\` et avec \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Sortie attendue :

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

### Indices

- Le corps de la seconde règle a besoin d'un \`let mut out = format!(...)\`, puis d'un \`out.push_str(...)\` répété, puis de \`out\` en queue.
- Mets la règle à deux arguments en premier ; les règles de macro sont matchées dans l'ordre.
`,
  },

  "rust-systems-edges-3": {
    instructions: `## Regarde ce qu'un derive génère

\`#[derive(...)]\` est une macro procédurale : elle lit les tokens de ton type et renvoie du Rust ordinaire. Rien n'est un cas spécial dans le compilateur, et \`cargo expand\` te montre la sortie.

\`Debug\` affiche chaque champ par son nom. \`Clone\` clone chaque champ. \`PartialEq\` compare chaque champ. \`Default\` remplit chaque champ avec **son propre** défaut.

### Ta tâche

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`
2. Construis-en une avec endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, et fais-en un \`clone()\`.
3. Affiche l'originale avec \`{:?}\`, si les deux sont égales, et \`Config::default()\` avec \`{:?}\`.

Sortie attendue :

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Quatre impls, aucun écrit par toi.
`,
  },

  "rust-systems-edges-4": {
    instructions: `## Une API safe sur un cœur unsafe

\`unsafe\` déverrouille cinq capacités — déréférencer un pointeur brut, appeler une fn \`unsafe\`, toucher un \`static mut\`, implémenter un trait \`unsafe\`, lire le champ d'une union. Ownership, borrowing et vérification des types sont **inchangés**.

Ce que ça veut dire, c'est « j'affirme un invariant que le compilateur ne peut pas vérifier », donc chaque bloc reçoit un commentaire \`// SAFETY:\` qui dit pourquoi l'affirmation tient.

Une fonction safe contenant \`unsafe\` promet que l'invariant tient pour *toute* entrée. C'est ce qui rend \`split_at_mut\` safe.

### Ta tâche

Écris \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` qui renvoie deux moitiés mutables sans chevauchement, avec \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\` et un commentaire \`// SAFETY:\`.

Dans \`main\`, découpe \`[1, 2, 3, 4, 5, 6]\`, écris \`100\` dans le premier élément de la moitié gauche et \`200\` dans celui de la droite, affiche les deux moitiés, puis affiche le tableau entier.

Sortie attendue :

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\`

### Indices

- Lis \`len()\` et \`mid\` **avant** de prendre le pointeur, pour qu'aucun borrow ne soit vivant par-dessus.
- \`ptr.add(mid)\` avance de \`mid\` éléments.
`,
  },

  "rust-systems-edges-5": {
    instructions: `## Manipule des adresses délibérément

Un pointeur brut est une simple adresse : pas de lifetime, pas d'ownership, pas de garantie d'aliasing. **En créer un est safe ; le déréférencer ne l'est pas.**

Un déréférencement affirme quatre choses à la fois — non null, aligné, pointant vers une valeur vivante, et sans aliaser un \`&mut\` vivant. La dernière est celle que les gens ratent, et ses bugs surgissent loin de la ligne fautive.

### Ta tâche

1. \`let mut value = 42i64;\` et un \`*mut i64\` dessus. Dans un bloc \`unsafe\` avec un commentaire \`// SAFETY:\`, incrémente via le pointeur et affiche la valeur relue à travers lui. Puis affiche le binding original.
2. \`let arr = [10i64, 20, 30];\` et son \`as_ptr()\`. Affiche l'élément à l'offset \`2\` via \`add\`.
3. Construis \`std::ptr::null::<i64>()\` et affiche \`is_null()\` — un appel safe, pas besoin de bloc.

Sortie attendue :

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\`

### Indices

- \`let p: *mut i64 = &mut value;\` coerce la référence en pointeur brut.
- \`add\` compte en unités de \`T\`, donc \`add(2)\` sur un \`*const i64\` avance de 16 octets.
`,
  },

  "rust-systems-edges-6": {
    instructions: `## L'ownership à travers la frontière

L'ABI de Rust est volontairement instable, donc passer côté C veut dire adopter la leur : \`#[repr(C)]\` pour le layout, \`#[no_mangle]\` et \`extern "C"\` pour le symbole et la convention d'appel.

Le dur, c'est l'ownership qui traverse une frontière que le compilateur ne peut pas voir. Chaque \`Box::into_raw\` a besoin d'exactement un \`Box::from_raw\` correspondant — zéro, c'est une fuite ; deux, c'est un double free.

### Ta tâche

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — elle doit être \`pub\`, puisque les fonctions exportées la mentionnent.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — \`0\` pour null, sinon \`x + y\`, avec un commentaire \`// SAFETY:\`.
3. \`point_new(x, y) -> *mut Point\` via \`Box::into_raw\`, et \`point_free(p: *mut Point)\` via \`Box::from_raw\`, avec vérification de null.
4. Dans \`main\` : construis \`(3, 4)\`, affiche sa somme, affiche le point via le pointeur brut, libère-le, affiche \`size_of::<Point>()\`, puis \`point_sum\` d'un pointeur null.

Sortie attendue :

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Un \`into_raw\`, un \`from_raw\`. Cet appariement, c'est tout le contrat.

### Indices

- \`std::ptr::null()\` pour le dernier appel.
- Libère le point **avant** d'afficher la taille, sinon l'ordre des borrows va t'embrouiller.
`,
  },

  "rust-systems-edges-7": {
    instructions: `## L'argent en entiers

Un solde n'est jamais un float — \`f64\` ne peut pas représenter exactement la plupart des fractions décimales, et dans un ledger cette erreur, c'est de l'argent qui ne se réconcilie pas. Stocke la plus petite unité indivisible sous forme d'entier : stroops, centimes, satoshis.

Les entiers ne perdent pas de précision, mais ils **débordent** — et la vérification est compilée hors du binaire en release. Sois explicite :

| méthode | en cas de débordement |
| --- | --- |
| \`checked_add\` | \`None\` — tu gères |
| \`saturating_add\` | bloque au maximum |
| \`wrapping_add\` | boucle |

Pour l'argent, toujours \`checked_\`.

### Ta tâche

1. \`const STROOPS_PER_XLM: i64 = 10_000_000;\`
2. \`fn to_stroops(xlm: i64, fraction: i64) -> Option<i64>\` avec \`checked_mul(..)?\` puis \`checked_add(..)\`.
3. Affiche \`to_stroops(2, 5_000_000)\` et \`to_stroops(i64::MAX, 0)\` avec \`{:?}\`.
4. Affiche \`100i64.checked_sub(30)\` et \`10i64.checked_sub(i64::MIN)\` avec \`{:?}\`.
5. Affiche \`i64::MAX.saturating_add(1)\` et \`i64::MAX.wrapping_add(1)\`.
6. Affiche si \`0.1f64 + 0.2f64 == 0.3\`.

Sortie attendue :

\`\`\`text
2.5 XLM: Some(25000000)
overflow: None
checked_sub ok: Some(70)
checked_sub under: None
saturating: 9223372036854775807
wrapping: -9223372036854775808
float equality: false
\`\`\`

La dernière ligne, c'est la raison pour laquelle les six premières comptent.
`,
  },
};
