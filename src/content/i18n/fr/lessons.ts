import "server-only";

// Localized lesson `instructions` markdown (server-only, like the source).
// ONLY instructions are localized — starter code, expected output and the
// hidden grading checks stay locale-neutral in content/lessons.ts.
export const lessonText: Record<string, { instructions: string }> = {
  "rust-fundamentals-1": {
    instructions: `## Hello, World!

Chaque programme Rust commence à la fonction \`main\`. C'est le point d'entrée — quand ton programme s'exécute, c'est \`main\` qui est appelée.

Pour afficher du texte dans la console, Rust te donne la **macro** \`println!\` (le \`!\` signifie que c'est une macro, pas une fonction — tu apprendras plus tard pourquoi c'est important).

\`\`\`rust
println!("your text here");
\`\`\`

### Ta mission

Fais en sorte que le programme affiche exactement :

\`\`\`text
Hello, World!
\`\`\`

### Indices

- Le texte se place entre guillemets doubles, à l'intérieur des parenthèses.
- Les instructions en Rust se terminent par un point-virgule \`;\`.
- Les majuscules comptent : \`Hello, World!\` — H majuscule, W majuscule.
`,
  },

  "rust-fundamentals-2": {
    instructions: `## Variables et mutabilité

En Rust, les variables se déclarent avec \`let\` — et elles sont **immuables par défaut**. Une fois liée, la valeur ne peut plus changer :

\`\`\`rust
let x = 5;
x = 10; // ❌ erreur de compilation : impossible d'assigner deux fois à une variable immuable
\`\`\`

Pour autoriser la réassignation, marque la variable comme mutable avec \`mut\` :

\`\`\`rust
let mut x = 5;
x = 10; // ✅ ça passe
\`\`\`

### Ta mission

Le code de départ déclare \`score\` de façon immuable puis tente de le modifier — ça ne compilera pas. Répare-le :

1. Rends \`score\` **mutable**.
2. Garde la réassignation à \`100\`.
3. Affiche le score final avec \`println!("score: {}", score);\`

Sortie attendue :

\`\`\`text
score: 100
\`\`\`
`,
  },

  "rust-fundamentals-3": {
    instructions: `## Les types de données

Chaque valeur en Rust a un **type** — sa forme. Rust sait généralement le deviner, mais tu peux (et tu devrais souvent) l'étiqueter toi-même :

\`\`\`rust
let torches: i32 = 3;      // nombre entier
let weight: f64 = 2.5;     // nombre décimal
let is_lit: bool = true;   // valeur oui/non
\`\`\`

### Ta mission

Étiquette les trois fioles du code de départ avec leurs types :

1. \`age\` est un nombre entier → \`i32\`
2. \`price\` est un nombre décimal → \`f64\`
3. \`is_open\` est une valeur oui/non → \`bool\`

Sortie attendue :

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\`

### Indices

- Le type se place après le nom, séparé par deux-points : \`let name: type = value;\`
`,
  },

  "rust-fundamentals-4": {
    instructions: `## Les fonctions

Une **fonction** est une recette : elle prend des ingrédients (les paramètres), fait le travail et rend un résultat.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\`

- Les paramètres indiquent leurs types : \`x: i32\`.
- \`-> i32\` annonce le type qui est renvoyé.
- La dernière ligne **sans point-virgule** est la valeur retournée.

### Ta mission

\`main\` appelle déjà \`add(2, 3)\` — mais la recette n'existe pas encore. Écris-la sous \`main\` :

1. Nomme-la \`add\`, avec deux paramètres \`a: i32\` et \`b: i32\`.
2. Elle renvoie un \`i32\`.
3. Elle renvoie \`a + b\` (pas de point-virgule sur cette ligne !).

Sortie attendue :

\`\`\`text
2 + 3 = 5
\`\`\`
`,
  },

  "rust-fundamentals-5": {
    instructions: `## Les bases de l'ownership

La plus ancienne loi de Rust : **chaque valeur a exactement un propriétaire.** Quand tu assignes une \`String\` à une autre variable, la possession (ownership) *se déplace* — l'ancien nom ne peut plus être utilisé :

\`\`\`rust
let a = String::from("gem");
let b = a;            // l'ownership passe à b
println!("{}", a);    // ❌ erreur : a ne possède plus rien
\`\`\`

Si tu as vraiment besoin de deux exemplaires, forge une vraie copie avec \`.clone()\` :

\`\`\`rust
let b = a.clone();    // ✅ deux String indépendantes
\`\`\`

### Ta mission

Le code de départ déplace \`sword\` dans \`copy\`, puis tente de réutiliser \`sword\` — ça ne compilera pas. Répare-le en **clonant** au lieu de déplacer.

Sortie attendue :

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\`
`,
  },

  "rust-fundamentals-6": {
    instructions: `## Emprunt et références

Tu n'as pas besoin de *céder* une valeur pour que quelqu'un puisse la lire — tu peux la **prêter**. Une référence (\`&\`) permet à une fonction d'emprunter une valeur et de la rendre automatiquement :

\`\`\`rust
fn inspect(item: &String) {   // emprunte, ne prend pas
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);                // prête-la avec &
println!("{}", gem);          // ✅ toujours à toi
\`\`\`

### Ta mission

\`greet\` **prend actuellement possession** du nom, donc \`main\` ne peut plus l'utiliser ensuite. Répare :

1. Fais en sorte que \`greet\` emprunte : le paramètre devient \`who: &String\`.
2. Appelle-la avec une référence : \`greet(&name);\`

Sortie attendue :

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\`
`,
  },

  "control-flow-1": {
    instructions: `## if / else

Les programmes décident avec \`if\`. La condition doit être un \`bool\` — pas besoin de parenthèses :

\`\`\`rust
if torches > 0 {
    // s'exécute quand la condition est vraie
} else {
    // s'exécute sinon
}
\`\`\`

### Ta mission

La salle contient \`torches = 3\`. Écris la décision :

1. **Si** \`torches\` est supérieur à \`0\`, affiche \`The hall is lit\`.
2. **Sinon**, affiche \`Darkness...\`.

Sortie attendue :

\`\`\`text
The hall is lit
\`\`\`
`,
  },

  "control-flow-2": {
    instructions: `## Les expressions match

\`match\` compare une valeur à des motifs — et Rust **t'oblige à couvrir tous les cas**. Le motif \`_\` signifie « tout le reste » :

\`\`\`rust
let word = match number {
    1 => "one",
    2 => "two",
    _ => "many",
};
\`\`\`

Un \`match\` est une *expression* : il produit une valeur que tu peux stocker.

### Ta mission

La salle a trois portes et \`door = 2\`. Construis un \`match\` :

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. tout le reste (\`_\`) → \`"no door"\`
4. Stocke le résultat dans \`path\` et affiche-le.

Sortie attendue :

\`\`\`text
center
\`\`\`
`,
  },

  "control-flow-3": {
    instructions: `## loop

\`loop\` répète **pour toujours** — jusqu'à ce que tu t'en échappes avec \`break\` :

\`\`\`rust
loop {
    // tourne encore et encore...
    if enough {
        break; // ...jusqu'à ceci
    }
}
\`\`\`

### Ta mission

Échappe-toi du couloir sans fin :

1. Dans un \`loop\`, ajoute \`1\` à \`echoes\` à chaque passage.
2. Quand \`echoes\` atteint \`3\` (\`echoes == 3\`), \`break\`.
3. L'affichage final est déjà écrit pour toi.

Sortie attendue :

\`\`\`text
escaped after 3 echoes
\`\`\`
`,
  },

  "control-flow-4": {
    instructions: `## Les boucles while

\`while\` répète **tant qu'une condition tient** — elle vérifie avant chaque passage :

\`\`\`rust
while supplies > 0 {
    // un jour de plus...
}
\`\`\`

### Ta mission

Descends la galerie qui s'enfonce :

1. **Tant que** \`floors\` est supérieur à \`0\` : affiche \`floor {}\` (l'étage courant), puis soustrais \`1\` de \`floors\`.
2. Après la boucle, affiche \`Ground level!\`.

Sortie attendue :

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\`
`,
  },

  "control-flow-5": {
    instructions: `## Les boucles for

\`for\` parcourt une séquence — pas de compteur à gérer, aucun risque de dépassement :

\`\`\`rust
for n in 1..=5 {
    // n vaut 1, 2, 3, 4, 5
}
\`\`\`

\`1..=5\` est une **plage** (range) : de 1 **jusqu'à 5 inclus**. (Sans le \`=\`, \`1..5\` s'arrête à 4.)

### Ta mission

Traverse les cinq pierres du gué :

1. Utilise \`for\` avec la plage \`1..=5\`.
2. Affiche \`step {}\` pour chaque nombre.

Sortie attendue :

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\`
`,
  },

  "control-flow-6": {
    instructions: `## Contrôle de flux imbriqué

Le vrai coup de maître : une décision **à l'intérieur** d'une boucle. L'opérateur \`%\` donne le reste de la division — \`n % 3 == 0\` signifie « n est divisible par 3 » :

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\`

### Ta mission

Parcours les dix miroirs de l'Overlord :

1. \`for n in 1..=10\`
2. **Si** \`n\` est divisible par 3 (\`n % 3 == 0\`), affiche \`mirror\`.
3. **Sinon**, affiche le nombre \`n\`.

Sortie attendue :

\`\`\`text
1
2
mirror
4
5
mirror
7
8
mirror
10
\`\`\`
`,
  },

  "rust-standard-library-1": {
    instructions: `## Les bases de Vec

Un \`Vec\` est une liste extensible — la sacoche du royaume :

\`\`\`rust
let mut items = vec!["torch", "rope"];  // créer avec un contenu
items.push("map");                       // l'agrandir
items.len()                              // combien ? → 3
\`\`\`

### Ta mission

1. Crée une \`satchel\` **mutable** avec \`vec!["torch", "rope"]\`.
2. \`push\` \`"map"\` dedans.
3. Affiche \`items: {}\` avec \`satchel.len()\`.

Sortie attendue :

\`\`\`text
items: 3
\`\`\`
`,
  },

  "rust-standard-library-2": {
    instructions: `## Les itérateurs

Un **itérateur** parcourt une collection paresseusement — il ne fait aucun travail tant que tu ne demandes pas de résultat :

\`\`\`rust
let total: i32 = coins.iter().sum();
\`\`\`

\`.iter()\` démarre la chaîne ; \`.sum()\` la rassemble en une seule valeur. (L'étiquette de type sur \`total\` dit à \`sum\` quoi produire.)

### Ta mission

La sacoche contient \`coins = vec![5, 10, 25]\`.

1. Additionne-les avec \`.iter().sum()\` dans \`total: i32\`.
2. Affiche \`total: {}\`.

Sortie attendue :

\`\`\`text
total: 40
\`\`\`
`,
  },

  "rust-standard-library-3": {
    instructions: `## Indexation sûre avec .get

\`vault[5]\` sur un Vec de 2 éléments **fait planter** le programme. La question polie, c'est \`.get(5)\` — elle renvoie une \`Option\` : \`Some(&item)\` si l'emplacement existe, \`None\` sinon.

\`\`\`rust
let tool = vault.get(5).unwrap_or(&"nothing");
\`\`\`

\`unwrap_or\` fournit une valeur de repli quand la réponse est \`None\`. (Note le \`&\` — \`get\` distribue des références.)

### Ta mission

Le coffre contient 2 outils ; demande quand même l'emplacement \`5\` :

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Affiche \`found: {}\`.

Sortie attendue :

\`\`\`text
found: nothing
\`\`\`
`,
  },

  "rust-standard-library-4": {
    instructions: `## HashMap

Une \`HashMap\` lie des **clés à des valeurs** — demande par clé, obtiens la valeur instantanément :

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
ledger.insert("gold", 100);
println!("{}", ledger["gold"]);  // → 100
\`\`\`

Elle vit dans \`std::collections\`, donc il lui faut la ligne \`use\` en haut du fichier.

### Ta mission

1. Insère \`("gold", 100)\` et \`("silver", 250)\` dans le registre.
2. Affiche \`gold: {}\` en utilisant \`ledger["gold"]\`.

Sortie attendue :

\`\`\`text
gold: 100
\`\`\`
`,
  },

  "rust-standard-library-5": {
    instructions: `## Manipulation de String

Une \`String\` est du texte extensible. Deux sortilèges aujourd'hui :

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");              // ajouter du texte

let banner = format!("The {}", s);   // tisser des chaînes en une nouvelle
\`\`\`

\`format!\` fonctionne exactement comme \`println!\` — mais renvoie la String au lieu de l'afficher.

### Ta mission

1. Ajoute \`" of the Vaults"\` à \`title\` avec \`push_str\`.
2. Construis \`banner\` avec \`format!("The {}", title)\`.
3. Affiche la bannière.

Sortie attendue :

\`\`\`text
The Keeper of the Vaults
\`\`\`
`,
  },

  "rust-standard-library-6": {
    instructions: `## Les slices

Une **slice** est une fenêtre sur une portion d'une collection — aucune copie, juste une vue :

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

La plage inclut son début et **exclut** sa fin (\`1..4\` → emplacements 1, 2, 3). Affiche une slice avec le marqueur de débogage \`{:?}\`.

### Ta mission

1. Prends le milieu de l'étagère : \`&shelf[1..4]\`.
2. Affiche \`middle: {:?}\`.

Sortie attendue :

\`\`\`text
middle: [2, 3, 4]
\`\`\`
`,
  },

  "mastering-option-1": {
    instructions: `## Some ou None

\`Option<T>\` est la façon dont Rust dit *« il y a peut-être une valeur — ou pas »* :

\`\`\`rust
enum Option<T> {
    Some(T),   // il y a une valeur, enveloppée à l'intérieur
    None,      // il n'y a rien
}
\`\`\`

Une fonction qui pourrait ne pas avoir de réponse renvoie une \`Option\` :

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

### Ta mission

Complète \`find\` : si \`present\` est vrai, renvoie \`Some(7)\`, sinon \`None\`.

Sortie attendue :

\`\`\`text
Some(7)
\`\`\`
`,
  },

  "mastering-option-2": {
    instructions: `## Déballer en sécurité

\`.unwrap()\` arrache la valeur hors d'une Option — et **panique** (plante) sur \`None\`. Le marais est plein de ceux qui ont déballé sans réfléchir.

L'idiome sûr transporte une valeur par défaut :

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

### Ta mission

\`ghost\` vaut \`None\`. Extrais une valeur **en sécurité** :

1. \`let value = ghost.unwrap_or(0);\` — aucun \`.unwrap()\` nulle part.
2. Affiche \`value: {}\`.

Sortie attendue :

\`\`\`text
value: 0
\`\`\`
`,
  },

  "mastering-option-3": {
    instructions: `## if let

Quand seul le cas \`Some\` t'intéresse, \`if let\` déballe et nomme la valeur d'un seul geste :

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light est la valeur déballée
} else {
    println!("darkness");
}
\`\`\`

### Ta mission

La lanterne contient \`Some(3)\`. Interroge-la comme il se doit :

1. \`if let Some(light) = lantern\` → affiche \`light: {}\`.
2. \`else\` → affiche \`darkness\`.

Sortie attendue :

\`\`\`text
light: 3
\`\`\`
`,
  },

  "mastering-result-1": {
    instructions: `## Ok ou Err

Là où \`Option\` modélise *l'absence*, \`Result\` modélise **l'échec avec une raison** :

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // ça a marché — voici la valeur
    Err(E),   // ça a échoué — voici pourquoi
}
\`\`\`

### Ta mission

Complète \`divide\` :

1. Si \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Sinon → \`Ok(a / b)\`

Sortie attendue :

\`\`\`text
Ok(5)
\`\`\`
`,
  },

  "mastering-result-2": {
    instructions: `## Lire le verdict

On ne devine pas un \`Result\` — on le \`match\`, et le compilateur s'assure que **les deux** verdicts sont traités :

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

### Ta mission

La cour te remet \`Ok(42)\`. Lis-le :

1. \`Ok(v)\` → affiche \`granted: {}\`
2. \`Err(e)\` → affiche \`denied: {}\`

Sortie attendue :

\`\`\`text
granted: 42
\`\`\`
`,
  },

  "mastering-result-3": {
    instructions: `## L'opérateur ?

Traiter chaque \`Result\` là où il survient enterre la logique. Le signe \`?\` **propage** : sur \`Ok\` il déballe et continue ; sur \`Err\` il renvoie immédiatement l'erreur à *ton* appelant.

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // Err ? → renvoyée vers le haut, ici même
    Ok(n * 2)
}
\`\`\`

\`?\` ne fonctionne qu'à l'intérieur de fonctions qui renvoient elles-mêmes un \`Result\` (ou une \`Option\`).

### Ta mission

Complète \`double_first\` :

1. \`let n = parse("21")?;\`
2. Renvoie \`Ok(n * 2)\`.

Sortie attendue :

\`\`\`text
Ok(42)
\`\`\`
`,
  },

  "stellar-101-1": {
    instructions: `## Comptes et paires de clés

Chaque acteur sur Stellar est un **compte**, contrôlé par une **paire de clés** :

- **Clé publique** — commence par \`G\`. Ton adresse ; partage-la librement.
- **Clé secrète** — commence par \`S\`. Elle signe tout ; ne la partage **jamais**. Perds-la et le compte est perdu à jamais.

Un compte doit détenir un solde minimum (**base reserve**) de **1 XLM** pour exister sur le registre.

### Ta mission

Complète la charte du fort stellaire — remplis les trois valeurs.

Sortie attendue :

\`\`\`text
star-keep chartered ✓
\`\`\`
`,
  },

  "stellar-101-2": {
    instructions: `## Lumens et frais

L'actif natif est le **lumen (XLM)**, et sa plus petite unité est le **stroop** :

- \`1 XLM = 10_000_000 stroops\` (dix millions)
- Chaque transaction paie une petite commission — les frais de base sont de **100 stroops** (0,00001 XLM)

Ces frais ne sont pas un revenu — c'est un péage anti-spam qui garde le réseau rapide pour tout le monde.

### Ta mission

Remplis les deux nombres sur la plaque du péage.

Sortie attendue :

\`\`\`text
toll paid ✓
\`\`\`
`,
  },

  "stellar-101-3": {
    instructions: `## Trustlines et actifs

Au-delà de XLM, n'importe quel compte peut **émettre des actifs** (dollars, points, billets…). Un actif est identifié par deux choses :

- un **code d'actif** — p. ex. \`USDC\`
- l'**émetteur** — le compte (une adresse \`G...\`) qui l'a créé

Mais ton compte ne détient rien sans ton consentement : tu dois ouvrir une **trustline** vers un actif avant de pouvoir le recevoir. Pas de trustline, pas de solde.

### Ta mission

Ouvre le pont de lumière : remplis la trustline pour **USDC**.

Sortie attendue :

\`\`\`text
light-bridge opened ✓
\`\`\`
`,
  },

  "stellar-101-4": {
    instructions: `## Ton premier paiement

Une **opération de paiement** a besoin d'exactement trois choses :

1. **destination** — le compte destinataire (\`G...\`)
2. **asset** — ce que tu envoies (\`XLM\` pour le lumen natif)
3. **amount** — combien

Signe-la avec ta clé secrète, paie le péage d'environ 100 stroops, et en ~5 secondes c'est définitif. Pas de banques, pas de jours ouvrés.

### Ta mission

Trace le premier paiement depuis la Panique : **25 XLM**.

Sortie attendue :

\`\`\`text
lumens flowing ✓
\`\`\`
`,
  },

  "soroban-smart-contracts-1": {
    instructions: `## Ton premier contrat

Un contrat Soroban est une bibliothèque Rust compilée en WASM et gravée dans le registre. Trois choses en font un contrat :

- \`#![no_std]\` — pas d'OS, pas d'allocateur de tas, pas de bibliothèque standard. Le registre est la machine.
- \`#[contract]\` sur une struct unitaire — l'identité du contrat.
- \`#[contractimpl]\` sur le bloc impl — exporte ses \`pub fn\` comme entrées invocables. Chaque entrée prend \`Env\` en premier : ta poignée vers le stockage, les événements et les appels inter-contrats.

Les chaînes coûtent cher sur la chaîne ; les identifiants courts utilisent \`Symbol\` (≤ 9 caractères via \`symbol_short!\`).

### Ta mission

1. Marque le bloc impl avec \`#[contractimpl]\`.
2. Fais en sorte que \`hello\` renvoie \`symbol_short!("beacon")\`.

Résultat d'invocation attendu :

\`\`\`text
hello() → Symbol(beacon)
\`\`\`
`,
  },

  "soroban-smart-contracts-2": {
    instructions: `## Le stockage du contrat

Les contrats sont sans état entre les invocations — l'état vit dans le **registre**, derrière \`env.storage()\`. Pour l'état à l'échelle du contrat, utilise le stockage **instance** :

\`\`\`rust
let count: u32 = env.storage().instance().get(&KEY).unwrap_or(0);
env.storage().instance().set(&KEY, &count);
\`\`\`

\`get\` renvoie \`Option<T>\` — la clé peut n'avoir jamais été écrite (ou son loyer a expiré), donc \`unwrap_or(0)\` est l'idiome pour les compteurs. Les clés et les valeurs passent par référence.

### Ta mission

Implémente \`increment\` :

1. Lis le compteur courant depuis le stockage instance sous \`COUNTER\` (par défaut \`0\`).
2. Ajoute \`1\`.
3. Réécris-le avec \`set\`.
4. Renvoie le nouveau compteur.

Résultat d'invocation attendu :

\`\`\`text
increment() → 1
\`\`\`
`,
  },

  "soroban-smart-contracts-3": {
    instructions: `## L'autorisation

Chaque \`Address\` dans Soroban peut prouver qu'elle a approuvé un appel. Côté contrat, la vérification tient en une ligne :

\`\`\`rust
from.require_auth();
\`\`\`

Si la transaction n'a pas été signée (ou pré-autorisée) par \`from\`, l'invocation **trappe** — l'état reste intact. Oublier cette ligne sur une fonction qui déplace des fonds est le bug fatal classique : n'importe qui pourrait passer n'importe quelle adresse et tout vider.

### Ta mission

Garde le coffre-fort. Dans \`withdraw\`, exige l'autorisation de \`from\` **avant** que quoi que ce soit d'autre ne se produise.

Résultat d'invocation attendu :

\`\`\`text
withdraw: authorized ✓
\`\`\`
`,
  },
};
