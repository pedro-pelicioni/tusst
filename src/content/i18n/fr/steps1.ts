import type { LessonStep } from "@/content/steps";

// Localized lesson steps — PART 1 (lessons 1–16 in steps.ts order).
// Keyed by lesson slug; a missing slug falls back to the English steps.
// Translate ONLY prose (body, question, options, prompt, explain, intro).
// Never touch code blocks' code, answer indexes, files, or option order.
export const steps1: Record<string, LessonStep[]> = {
  "rust-fundamentals-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bienvenue en **Rust**, le langage que les anciens Forgeborn utilisaient pour tenir le ciel en place.

Tout programme Rust commence par la fonction \`main\` — le point d'entrée. Quand ton programme s'exécute, c'est \`main\` qui est appelée.

\`\`\`rust
fn main() {
    // tes runes vont ici
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Pour afficher du texte dans la console, Rust te donne la **macro** \`println!\`.

\`\`\`rust
println!("your text here");
\`\`\`

Le \`!\` signifie que c'est une *macro*, pas une fonction — tu apprendras plus tard pourquoi c'est important. Pour l'instant : tu vois un \`!\`, tu penses « macro ».`,
    },
    {
      kind: "quiz",
      question: "Que t'indique le `!` dans `println!` ?",
      options: [
        "C'est une macro, pas une fonction",
        "Le texte est affiché très fort",
        "La ligne ne peut jamais échouer",
      ],
      answer: 0,
      explain: "Le `!` marque l'invocation d'une macro — println! est la plus célèbre de Rust.",
    },
    {
      kind: "fill",
      prompt: "Complète la rune pour qu'elle affiche du texte dans la console.",
      file: "main.rs",
      before: "fn main() {\n    ",
      after: `("Hello, World!");\n}`,
      choices: ["println!", "print", "echo!"],
      answer: 0,
      explain: "println! affiche le texte suivi d'un saut de ligne.",
    },
    {
      kind: "quiz",
      question: "En Rust, les instructions se terminent par…",
      options: ["un point-virgule ;", "un point .", "rien — les sauts de ligne suffisent"],
      answer: 0,
      explain: "Le phare est pointilleux : chaque instruction se termine par `;`.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — prononce les mots d'éveil

Fais afficher au programme **exactement** :

\`\`\`text
Hello, World!
\`\`\`

Les majuscules comptent : H majuscule, W majuscule. Le texte va entre guillemets doubles, à l'intérieur des parenthèses — et n'oublie pas ton point-virgule.`,
    },
  ],

  "rust-fundamentals-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Les programmes ont besoin de **retenir** des valeurs pour les afficher ou les modifier. Pour ça, Rust a des **variables**, déclarées avec \`let\` :

\`\`\`rust
let score = 50;
\`\`\`

Comme des coffres étiquetés, les variables ont un contenu — et des noms qui nous disent ce qu'il y a dedans.`,
    },
    {
      kind: "theory",
      body: `Voici la vieille loi de l'armurerie : en Rust, les variables sont **immuables par défaut**. Une fois liée, la valeur ne peut plus changer.

\`\`\`rust
let x = 5;
x = 10; // ❌ erreur de compilation : impossible d'assigner deux fois
\`\`\`

Le compilateur — ton allié le plus intransigeant — refusera de forger ceci.`,
    },
    {
      kind: "quiz",
      question: "Que se passe-t-il quand tu compiles ceci ?\n\n`let x = 5; x = 10;`",
      options: [
        "Erreur de compilation — x est immuable",
        "x devient 10",
        "x devient 15",
      ],
      answer: 0,
      explain: "Une fois forgée, jamais changée — sauf si tu en déclares autrement.",
    },
    {
      kind: "theory",
      body: `Pour autoriser la réassignation, déclare ton intention à l'acier lui-même avec \`mut\` :

\`\`\`rust
let mut x = 5;
x = 10; // ✅ ça passe
\`\`\`

\`mut\` est une promesse faite à voix haute : *cette valeur va changer*.`,
    },
    {
      kind: "fill",
      prompt: "Rends `score` reforgeable — déclare-le mutable.",
      file: "main.rs",
      before: "let ",
      after: " score = 50;\nscore = 100;",
      choices: ["mut", "var", "flex"],
      answer: 0,
      explain: "let mut score = 50; — maintenant la réassignation compile.",
    },
    {
      kind: "quiz",
      question: "Quelle déclaration autorise une réassignation plus tard ?",
      options: ["let mut power = 7;", "let power = 7;", "immutable power = 7;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — reforge la lame

Le code de départ déclare \`score\` de façon immuable puis tente de le modifier — ça ne compilera pas. Répare-le :

1. Rends \`score\` **mutable**.
2. Garde la réassignation à \`100\`.
3. Affiche le score final avec \`println!("score: {}", score);\`

Sortie attendue :

\`\`\`text
score: 100
\`\`\``,
    },
  ],

  /* ───────────────────────── Act I · 3–6 ───────────────────────── */

  "rust-fundamentals-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Chaque valeur en Rust a un **type** — sa forme. Pense aux fioles de Ferrisia : chacune porte une étiquette indiquant ce qu'elle contient.

Les trois formes que tu utiliseras le plus :

- \`i32\` — un **nombre entier** : \`3\`, \`-7\`, \`2026\`
- \`f64\` — un **nombre décimal** : \`2.5\`, \`0.1\`
- \`bool\` — une **valeur oui/non** : \`true\` ou \`false\``,
    },
    {
      kind: "theory",
      body: `Rust peut généralement deviner le type — mais tu peux l'étiqueter toi-même, et la Citadelle préfère que tu le fasses :

\`\`\`rust
let torches: i32 = 3;
let weight: f64 = 2.5;
let is_lit: bool = true;
\`\`\`

Le motif est toujours le même : \`let name: type = value;\` — l'étiquette vient après le nom, derrière un deux-points.`,
    },
    {
      kind: "quiz",
      question: "Quel type convient à la valeur `4.5` ?",
      options: ["f64 — un nombre décimal", "i32 — un nombre entier", "bool — une valeur oui/non"],
      answer: 0,
      explain: "Tout ce qui a une virgule décimale demande un type à virgule flottante comme f64.",
    },
    {
      kind: "fill",
      prompt: "Étiquette la fiole : `is_open` contient `true` — une valeur oui/non.",
      file: "main.rs",
      before: "let is_open: ",
      after: " = true;",
      choices: ["bool", "i32", "yes"],
      answer: 0,
      explain: "true et false vivent dans le type bool.",
    },
    {
      kind: "quiz",
      question: "Où va l'étiquette de type ?\n\n`let age ___ = 12;`",
      options: [": i32 — après le nom, derrière un deux-points", "i32: — avant le nom", "as i32 — après la valeur"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — étiquette les fioles

Trois fioles sans étiquette reposent sur l'étagère. Ajoute le type à chacune :

1. \`age\` est un nombre entier → \`i32\`
2. \`price\` est un décimal → \`f64\`
3. \`is_open\` est oui/non → \`bool\`

Sortie attendue :

\`\`\`text
age: 12
price: 4.5
open: true
\`\`\``,
    },
  ],

  "rust-fundamentals-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Jusqu'ici tu écrivais ton code dans \`main\` — mais un programme tout entier dans \`main\`, c'est une forge avec une seule recette géante clouée au mur.

Une **fonction** est une recette que tu écris une fois et utilises pour toujours : elle prend des ingrédients, fait le travail et rend un résultat.

\`\`\`rust
fn double(x: i32) -> i32 {
    x * 2
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Lis la recette morceau par morceau :

- \`fn double\` — le **nom** de la recette
- \`(x: i32)\` — l'**ingrédient** et son type
- \`-> i32\` — le type de ce qui **revient**

Et le secret de la dernière ligne : \`x * 2\` n'a **pas de point-virgule**. En Rust, l'expression finale sans point-virgule *est* la valeur renvoyée.`,
    },
    {
      kind: "quiz",
      question: "Dans `fn double(x: i32) -> i32 { x * 2 }`, pourquoi `x * 2` n'a-t-il pas de point-virgule ?",
      options: [
        "C'est la valeur de retour — les expressions sans ; sont renvoyées",
        "Les points-virgules sont optionnels en Rust",
        "C'est une coquille",
      ],
      answer: 0,
      explain: "La dernière expression sans point-virgule est ce que la fonction renvoie.",
    },
    {
      kind: "fill",
      prompt: "Complète la signature de la recette : elle renvoie un `i32`.",
      file: "main.rs",
      before: "fn add(a: i32, b: i32) ",
      after: " i32 {\n    a + b\n}",
      choices: ["->", "=>", ":"],
      answer: 0,
      explain: "-> déclare le type de retour. (=> appartient aux bras de match.)",
    },
    {
      kind: "quiz",
      question: "Comment appelles-tu la recette `add` avec 2 et 3, en stockant le résultat ?",
      options: ["let sum = add(2, 3);", "let sum = add 2 3;", "call add(2, 3) into sum;"],
      answer: 0,
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — écris la recette

\`main\` appelle déjà \`add(2, 3)\` — mais la recette n'existe pas encore. Écris-la sous \`main\` :

1. Nom : \`add\`, paramètres \`a: i32\` et \`b: i32\`.
2. Renvoie un \`i32\`.
3. Renvoie \`a + b\` — **pas de point-virgule** sur cette ligne.

Sortie attendue :

\`\`\`text
2 + 3 = 5
\`\`\``,
    },
  ],

  "rust-fundamentals-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Maintenant la loi qui fait de Rust *Rust* — celle gravée sur la porte de la chambre forte :

**Chaque valeur a exactement un propriétaire.**

\`\`\`rust
let sword = String::from("blade");
\`\`\`

Ici \`sword\` **possède** cette String. Un trésor, un gardien. Aucune exception.`,
    },
    {
      kind: "theory",
      body: `Confie le trésor à un autre nom, et la possession (ownership) **se déplace** :

\`\`\`rust
let a = String::from("gem");
let b = a;            // la gemme appartient désormais à b
println!("{}", a);    // ❌ erreur : a ne possède plus rien
\`\`\`

Ce n'est pas de la cruauté — c'est ainsi que Rust sait exactement qui doit nettoyer chaque valeur, sans ramasse-miettes et sans fuites.`,
    },
    {
      kind: "quiz",
      question: "Après `let b = a;` (où `a` est une String), que peux-tu faire avec `a` ?",
      options: [
        "Rien — la possession est passée à b",
        "L'utiliser normalement",
        "La lire, mais pas la modifier",
      ],
      answer: 0,
      explain: "La valeur s'est déplacée. Tends la main vers a et les sceaux te brûleront — à la compilation.",
    },
    {
      kind: "theory",
      body: `Parfois tu as vraiment besoin de **deux** trésors. Alors tu forges une vraie copie indépendante :

\`\`\`rust
let b = a.clone();   // ✅ deux Strings, deux propriétaires
\`\`\`

\`.clone()\` coûte un vrai travail — les forgerons l'utilisent délibérément, pas par habitude.`,
    },
    {
      kind: "fill",
      prompt: "Garde les deux noms utilisables : fais de `copy` une vraie copie plutôt qu'un déplacement.",
      file: "main.rs",
      before: "let sword = String::from(\"blade\");\nlet copy = sword",
      after: ";",
      choices: [".clone()", ".copy()", ".dup()"],
      answer: 0,
      explain: "clone() forge une String indépendante — les deux propriétaires survivent.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — la loi du gardien unique

Le code de départ déplace \`sword\` dans \`copy\`, puis tente d'utiliser \`sword\` à nouveau — les sceaux refusent. Répare-le en **clonant** au lieu de déplacer.

Sortie attendue :

\`\`\`text
original: Unbending Blade
copy: Unbending Blade
\`\`\``,
    },
  ],

  "rust-fundamentals-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Tout cloner mettrait la forge en faillite. Le Gardien des Emprunts enseigne une meilleure voie :

**Tu n'as pas à donner une valeur pour que quelqu'un la lise. Prête-la.**

Une **référence** (\`&\`) permet à une fonction d'*emprunter* une valeur — et elle revient dans ta main automatiquement quand c'est fini.`,
    },
    {
      kind: "theory",
      body: `Deux petites marques suffisent :

\`\`\`rust
fn inspect(item: &String) {  // ① emprunte, ne prend pas
    println!("{}", item);
}

let gem = String::from("ruby");
inspect(&gem);               // ② prête avec &
println!("{}", gem);         // ✅ toujours à toi
\`\`\`

\`&String\` dans la recette, \`&gem\` à l'appel. Prêté, lu, rendu.`,
    },
    {
      kind: "quiz",
      question: "Que signifie `&` dans `inspect(&gem)` ?",
      options: [
        "Prêter gem — inspect l'emprunte et la rend",
        "Déplacer gem dans inspect pour toujours",
        "Faire une copie complète de gem",
      ],
      answer: 0,
      explain: "Une référence emprunte. La possession ne quitte jamais tes mains.",
    },
    {
      kind: "fill",
      prompt: "Corrige la recette pour qu'elle *emprunte* le nom au lieu de le prendre.",
      file: "main.rs",
      before: "fn greet(who: ",
      after: ") {\n    println!(\"welcome, {}\", who);\n}",
      choices: ["&String", "String", "clone String"],
      answer: 0,
      explain: "&String emprunte — main garde la possession du nom.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — prête la lame

\`greet\` **prend** actuellement le nom, donc \`main\` le perd. Corrige les deux marques :

1. Le paramètre devient \`who: &String\`.
2. L'appel devient \`greet(&name);\`

Sortie attendue :

\`\`\`text
welcome, Forgeborn
goodbye, Forgeborn
\`\`\``,
    },
  ],

  /* ───────────────────────── Act II · control flow ───────────────────────── */

  "control-flow-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Jusqu'ici tes programmes filent tout droit, ligne après ligne. Mais le labyrinthe exige des **décisions**.

\`if\` n'exécute le code que lorsqu'une condition est vraie :

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
}
\`\`\`

La condition (\`torches > 0\`) doit être un \`bool\` — une question vrai/faux. Pas besoin de parenthèses autour.`,
    },
    {
      kind: "theory",
      body: `\`else\` attrape tout ce que le \`if\` n'a pas pris :

\`\`\`rust
if torches > 0 {
    println!("The hall is lit");
} else {
    println!("Darkness...");
}
\`\`\`

Exactement une des deux portes s'ouvre. Jamais les deux, jamais aucune.`,
    },
    {
      kind: "quiz",
      question: "Avec `let torches = 0;`, qu'affiche le code ci-dessus ?",
      options: ["Darkness...", "The hall is lit", "Rien"],
      answer: 0,
      explain: "0 > 0 est faux, donc la porte else s'ouvre.",
    },
    {
      kind: "fill",
      prompt: "Complète la condition : n'entre dans la chambre forte que si `keys` est supérieur à 0.",
      file: "main.rs",
      before: "if keys ",
      after: " 0 {\n    println!(\"enter\");\n}",
      choices: [">", "=", "=>"],
      answer: 0,
      explain: "> demande « plus grand que ? ». Un seul = est une assignation, pas une question.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — les deux portes

La salle a \`torches = 3\`. Écris la décision :

1. **Si** \`torches > 0\` → affiche \`The hall is lit\`
2. **Sinon** → affiche \`Darkness...\`

Sortie attendue :

\`\`\`text
The hall is lit
\`\`\``,
    },
  ],

  "control-flow-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Une chaîne de \`if / else if / else\` devient vite maladroite. Pour « comparer une valeur à de nombreuses possibilités », Rust a quelque chose de plus tranchant : \`match\`.

\`\`\`rust
match number {
    1 => println!("one"),
    2 => println!("two"),
    _ => println!("many"),
}
\`\`\`

Chaque ligne est un **bras** : \`motif => quoi faire\`.`,
    },
    {
      kind: "theory",
      body: `Deux règles font de \`match\` le favori de l'Overlord :

1. **Chaque cas doit être couvert.** Le bras \`_\` signifie « tout le reste » — oublie-le et le compilateur refuse.
2. **Un match produit une valeur** que tu peux stocker :

\`\`\`rust
let word = match number {
    1 => "one",
    _ => "many",
};
\`\`\``,
    },
    {
      kind: "quiz",
      question: "Que signifie le bras `_` dans un match ?",
      options: [
        "Tout le reste — le cas fourre-tout",
        "Une valeur vide",
        "Sauter ce match",
      ],
      answer: 0,
      explain: "match doit couvrir chaque possibilité ; _ ramasse le reste.",
    },
    {
      kind: "fill",
      prompt: "Complète le bras : la porte `2` mène au centre.",
      file: "main.rs",
      before: "let path = match door {\n    1 => \"left\",\n    2 ",
      after: " \"center\",\n    _ => \"no door\",\n};",
      choices: ["=>", "->", ":"],
      answer: 0,
      explain: "Les bras de match utilisent => (les fonctions utilisent -> pour le type de retour).",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — chaque reflet nommé

\`door = 2\`. Construis le match :

1. \`1\` → \`"left"\`
2. \`2\` → \`"center"\`
3. \`_\` → \`"no door"\`
4. Stocke le résultat dans \`path\`, puis \`println!("{}", path);\`

Sortie attendue :

\`\`\`text
center
\`\`\``,
    },
  ],

  "control-flow-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Parfois tu dois répéter quelque chose jusqu'à ce que *toi* décides d'arrêter. La répétition la plus simple de Rust est \`loop\` — elle tourne **pour toujours** :

\`\`\`rust
loop {
    println!("again...");
}
\`\`\`

Pour toujours. À moins que tu ne t'échappes.`,
    },
    {
      kind: "theory",
      body: `\`break\` est le mot d'évasion — il sort de la boucle immédiatement :

\`\`\`rust
let mut count = 0;
loop {
    count += 1;      // += ajoute et stocke : count = count + 1
    if count == 3 {
        break;       // dehors !
    }
}
\`\`\`

Remarque \`==\` (une question : « égal ? ») contre \`=\` (un ordre : « stocke ceci »).`,
    },
    {
      kind: "quiz",
      question: "Qu'arrive-t-il à une `loop` sans `break` à l'intérieur ?",
      options: [
        "Elle tourne pour toujours — le programme n'avance jamais",
        "Elle tourne une fois",
        "Le compilateur ajoute un break automatiquement",
      ],
      answer: 0,
      explain: "Les voyageurs qui l'arpentent pour toujours finissent par faire partie du mur.",
    },
    {
      kind: "fill",
      prompt: "Échappe-toi quand le compte atteint 3.",
      file: "main.rs",
      before: "loop {\n    count += 1;\n    if count == 3 {\n        ",
      after: ";\n    }\n}",
      choices: ["break", "stop", "exit"],
      answer: 0,
      explain: "break sort de la boucle en pleine course.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — brise le couloir sans fin

1. Dans une \`loop\`, ajoute \`1\` à \`echoes\` à chaque passage (\`echoes += 1;\`).
2. Quand \`echoes == 3\`, \`break\`.

Sortie attendue :

\`\`\`text
escaped after 3 echoes
\`\`\``,
    },
  ],

  "control-flow-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`loop\` + \`if\` + \`break\` fonctionne, mais il existe une rune plus propre quand la condition de sortie est connue d'avance : \`while\`.

\`\`\`rust
while floors > 0 {
    println!("descending...");
    floors -= 1;
}
\`\`\`

**Tant que la condition tient, répète.** La vérification se fait *avant* chaque passage — si elle est fausse dès le départ, le corps ne s'exécute jamais.`,
    },
    {
      kind: "quiz",
      question: "Avec `let mut floors = 0;`, combien de fois `while floors > 0 { ... }` s'exécute-t-il ?",
      options: [
        "Zéro — la condition est vérifiée avant le premier passage",
        "Une fois, puis il s'arrête",
        "Pour toujours",
      ],
      answer: 0,
      explain: "while vérifie d'abord, agit ensuite. 0 > 0 est déjà faux.",
    },
    {
      kind: "theory",
      body: `Un danger : si la condition ne devient jamais fausse, \`while\` boucle pour toujours — exactement comme \`loop\`.

C'est pourquoi le corps **change** habituellement quelque chose dont la condition dépend :

\`\`\`rust
while floors > 0 {
    floors -= 1;   // ← la marée qui met fin à la boucle
}
\`\`\``,
    },
    {
      kind: "fill",
      prompt: "Continue de descendre tant qu'il reste des étages.",
      file: "main.rs",
      before: "",
      after: " floors > 0 {\n    println!(\"floor {}\", floors);\n    floors -= 1;\n}",
      choices: ["while", "until", "if"],
      answer: 0,
      explain: "while répète ; if ne décide qu'une seule fois.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — devance la marée

1. **Tant que** \`floors > 0\` : affiche \`floor {}\`, puis \`floors -= 1;\`
2. Après la boucle : affiche \`Ground level!\`

Sortie attendue :

\`\`\`text
floor 3
floor 2
floor 1
Ground level!
\`\`\``,
    },
  ],

  "control-flow-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Quand tu connais le chemin d'avance — « chaque nombre de 1 à 5 » — gérer ton propre compteur est indigne de toi. \`for\` parcourt la séquence pour toi :

\`\`\`rust
for n in 1..=5 {
    println!("step {}", n);
}
\`\`\`

À chaque passage, \`n\` prend la valeur suivante : 1, 2, 3, 4, 5. Aucun compteur à oublier, aucun moyen de dépasser.`,
    },
    {
      kind: "theory",
      body: `\`1..=5\` est une **plage** (range) — et le \`=\` compte :

- \`1..=5\` → 1, 2, 3, 4, **5** (inclusif)
- \`1..5\` → 1, 2, 3, 4 (s'arrête *avant* 5)

L'erreur de décalage d'un (off-by-one) est le plus vieux piège du labyrinthe. Le \`=\` est ta façon de le désamorcer.`,
    },
    {
      kind: "quiz",
      question: "Quels nombres produit `for n in 1..4` ?",
      options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"],
      answer: 0,
      explain: "Sans le =, la plage s'arrête avant sa fin.",
    },
    {
      kind: "fill",
      prompt: "Marche sur les pierres 1 à 5 — 5 **inclus**.",
      file: "main.rs",
      before: "for n in 1",
      after: "5 {\n    println!(\"step {}\", n);\n}",
      choices: ["..=", "..", "to"],
      answer: 0,
      explain: "..= inclut la dernière pierre.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — les pas comptés

Traverse les cinq pierres de gué :

1. \`for\` sur la plage \`1..=5\`
2. Affiche \`step {}\` pour chaque nombre.

Sortie attendue :

\`\`\`text
step 1
step 2
step 3
step 4
step 5
\`\`\``,
    },
  ],

  "control-flow-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Tu connais désormais toutes les runes — \`if\`, \`match\`, \`loop\`, \`while\`, \`for\`. Le dédale de l'Overlord exige que tu les **combines** : une décision *au sein* d'une répétition.

\`\`\`rust
for n in 1..=6 {
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("{}", n);
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Le nouveau symbole \`%\` donne le **reste** d'une division :

- \`7 % 3\` → \`1\` (7 ÷ 3 = 2, reste **1**)
- \`9 % 3\` → \`0\` (division exacte)

Donc \`n % 3 == 0\` demande : *« n est-il divisible par 3 ? »* — la façon classique de trouver un miroir sur trois.`,
    },
    {
      kind: "quiz",
      question: "Combien vaut `10 % 3` ?",
      options: ["1 — le reste de 10 ÷ 3", "3 — le résultat de la division", "0 — la division est exacte"],
      answer: 0,
      explain: "10 = 3×3 + 1. L'opérateur % te tend ce 1.",
    },
    {
      kind: "fill",
      prompt: "Pose la question : `n` est-il divisible par 3 ?",
      file: "main.rs",
      before: "if n % 3 ",
      after: " 0 {\n    println!(\"mirror\");\n}",
      choices: ["==", "=", "%"],
      answer: 0,
      explain: "== compare. Un seul = tenterait d'assigner.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — le dédale de l'Overlord

Parcours les dix miroirs :

1. \`for n in 1..=10\`
2. **Si** \`n % 3 == 0\` → affiche \`mirror\`
3. **Sinon** → affiche le nombre \`n\`

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
\`\`\``,
    },
  ],

  /* ───────────────────── Act III · standard library ───────────────────── */

  "rust-standard-library-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Une variable contient **une** valeur. Mais les aventures produisent des *listes* : objets, pièces, noms. Pour ça, l'outil favori du royaume est le \`Vec\` — une sacoche qui grandit :

\`\`\`rust
let mut items = vec!["torch", "rope"];
\`\`\`

\`vec![...]\` la crée avec un contenu déjà dedans. Il lui faut \`mut\` si tu comptes la modifier — et tu comptes bien le faire.`,
    },
    {
      kind: "theory",
      body: `Deux gestes que tu utiliseras sans cesse :

\`\`\`rust
items.push("map");    // ajoute à la fin — la sacoche grandit
items.len()           // combien dedans ? → 3
\`\`\`

Et la règle des anciens dieux : les positions comptent **à partir de zéro**. \`items[0]\` est \`"torch"\`, \`items[1]\` est \`"rope"\`.`,
    },
    {
      kind: "quiz",
      question: "Après `let mut v = vec![10, 20]; v.push(30);` — combien vaut `v[0]` ?",
      options: ["10 — les positions comptent à partir de zéro", "30 — push le met en premier", "20 — le deuxième élément"],
      answer: 0,
      explain: "push ajoute à la FIN ; l'indexation commence à 0, comme les anciens dieux l'ont voulu.",
    },
    {
      kind: "fill",
      prompt: "Fais grandir la sacoche : ajoute `\"map\"` à la fin.",
      file: "main.rs",
      before: "let mut satchel = vec![\"torch\", \"rope\"];\nsatchel.",
      after: "(\"map\");",
      choices: ["push", "add", "append_one"],
      answer: 0,
      explain: "push ajoute un élément à la fin d'un Vec.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — remplis la sacoche

1. Crée une \`satchel\` **mutable** avec \`vec!["torch", "rope"]\`.
2. \`push\` \`"map"\`.
3. Affiche \`items: {}\` avec \`satchel.len()\`.

Sortie attendue :

\`\`\`text
items: 3
\`\`\``,
    },
  ],

  "rust-standard-library-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Voici les travailleurs les plus paresseux du royaume : les **itérateurs**. Un itérateur promet de parcourir une collection — puis ne fait *rien* jusqu'à ce que tu exiges un résultat.

\`\`\`rust
coins.iter()   // une chaîne d'esprits paresseux, en attente
\`\`\`

Tu les as déjà commandés sans le savoir : \`for n in 1..=5\` pilote un itérateur en dessous.`,
    },
    {
      kind: "theory",
      body: `La magie tient dans le fait de **terminer la chaîne**. Demande un résultat, et les esprits se mettent enfin au travail :

\`\`\`rust
let coins = vec![5, 10, 25];
let total: i32 = coins.iter().sum();   // → 40
\`\`\`

L'étiquette de type \`: i32\` sur \`total\` dit à \`.sum()\` quoi produire — ne l'oublie pas.`,
    },
    {
      kind: "quiz",
      question: "Que fait `coins.iter()` **tout seul**, sans `.sum()` derrière ?",
      options: [
        "Rien pour l'instant — les itérateurs sont paresseux jusqu'à la collecte",
        "Il additionne immédiatement les pièces",
        "Il copie tout le Vec",
      ],
      answer: 0,
      explain: "Ils ne lèvent pas le petit doigt avant la collecte. Cette paresse est ce qui rend les chaînes peu coûteuses.",
    },
    {
      kind: "fill",
      prompt: "Termine la chaîne : fais additionner le tout par les esprits.",
      file: "main.rs",
      before: "let total: i32 = coins.iter().",
      after: "();",
      choices: ["sum", "total", "add_all"],
      answer: 0,
      explain: ".sum() consomme la chaîne et renvoie une seule valeur.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — récolte la fortune

\`coins = vec![5, 10, 25]\`.

1. Additionne-les : \`let total: i32 = coins.iter().sum();\`
2. Affiche \`total: {}\`.

Sortie attendue :

\`\`\`text
total: 40
\`\`\``,
    },
  ],

  "rust-standard-library-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Le piège favori de l'Amasseur : un Vec de 2 éléments, et un aventurier qui tend la main vers la case 5.

\`\`\`rust
let vault = vec!["hammer", "chisel"];
vault[5]   // 💥 PANIC — le programme plante
\`\`\`

Les crochets *supposent* que la case existe. Les suppositions, dans les chambres fortes, sont fatales.`,
    },
    {
      kind: "theory",
      body: `La question polie, c'est \`.get()\` :

\`\`\`rust
vault.get(0)   // → Some(&"hammer")  — la case existe
vault.get(5)   // → None             — pas de crash, juste « rien ici »
\`\`\`

Cette réponse \`Some / None\` est une \`Option\` — ton premier aperçu du Marais Évanescent. Associe-lui un repli : \`vault.get(5).unwrap_or(&"nothing")\`.`,
    },
    {
      kind: "quiz",
      question: "`vault` a 2 éléments. Que renvoie `vault.get(5)` ?",
      options: [
        "None — un calme « rien ici »",
        "Il fait planter le programme",
        "Le dernier élément",
      ],
      answer: 0,
      explain: "get ne plante jamais — il répond Some(&item) ou None.",
    },
    {
      kind: "fill",
      prompt: "Demande la case 5 **poliment** — interdiction de planter.",
      file: "main.rs",
      before: "let tool = vault.",
      after: "(5).unwrap_or(&\"nothing\");",
      choices: ["get", "[]", "grab"],
      answer: 0,
      explain: "get(5) renvoie une Option ; unwrap_or fournit le repli.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — l'étagère qui peut être vide

La chambre forte a 2 outils. Demande quand même la case \`5\` — en toute sécurité :

1. \`let tool = vault.get(5).unwrap_or(&"nothing");\`
2. Affiche \`found: {}\`.

Sortie attendue :

\`\`\`text
found: nothing
\`\`\``,
    },
  ],

  "rust-standard-library-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Un Vec répond par **position**. Mais le registre de l'Amasseur répond par **nom** : demande « gold ? » et il répond « 100 ».

C'est une \`HashMap\` — des clés liées à des valeurs :

\`\`\`rust
use std::collections::HashMap;

let mut ledger = HashMap::new();
\`\`\`

Elle vit plus profond dans les chambres fortes (\`std::collections\`), donc il lui faut la ligne \`use\` en haut.`,
    },
    {
      kind: "theory",
      body: `Écrire et lire le registre :

\`\`\`rust
ledger.insert("gold", 100);     // lie clé → valeur
ledger.insert("silver", 250);

println!("{}", ledger["gold"]); // demande par clé → 100
\`\`\`

Les entrées ne gardent **aucun ordre particulier** — l'enchantement échange l'ordre contre des réponses instantanées.`,
    },
    {
      kind: "quiz",
      question: "Que se passe-t-il si tu fais `insert(\"gold\", 999)` alors que \"gold\" existe déjà ?",
      options: [
        "L'ancienne valeur est remplacée — une valeur par clé",
        "La map garde les deux valeurs",
        "Ça plante avec une erreur de doublon",
      ],
      answer: 0,
      explain: "Une clé se lie à exactement une valeur ; insérer à nouveau l'écrase.",
    },
    {
      kind: "fill",
      prompt: "Consigne le trésor : lie `\"gold\"` à `100`.",
      file: "main.rs",
      before: "ledger.",
      after: "(\"gold\", 100);",
      choices: ["insert", "push", "set"],
      answer: 0,
      explain: "Les HashMaps font insert(clé, valeur) — push appartient au Vec.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — le registre enchanté

1. Insère \`("gold", 100)\` et \`("silver", 250)\`.
2. Affiche \`gold: {}\` en utilisant \`ledger["gold"]\`.

Sortie attendue :

\`\`\`text
gold: 100
\`\`\``,
    },
  ],

  "rust-standard-library-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Tu as rencontré \`String\` dans la chambre forte de l'ownership — apprends maintenant à la faire **grandir** :

\`\`\`rust
let mut s = String::from("Keeper");
s.push_str(" of keys");   // ajoute du texte à la fin
\`\`\`

\`push_str\` est le burin des inscriptions vivantes. (Son cousin \`push\` ajoute un seul caractère.)`,
    },
    {
      kind: "theory",
      body: `Et le sort de tissage — \`format!\` :

\`\`\`rust
let banner = format!("The {}", s);
\`\`\`

Il fonctionne **exactement** comme \`println!\` — mêmes emplacements \`{}\` — mais au lieu d'afficher, il te remet la nouvelle String à garder.`,
    },
    {
      kind: "quiz",
      question: "Quelle est la différence entre `println!(\"The {}\", s)` et `format!(\"The {}\", s)` ?",
      options: [
        "println! l'affiche ; format! renvoie la String à la place",
        "format! est plus rapide",
        "println! ne peut pas utiliser les emplacements {}",
      ],
      answer: 0,
      explain: "Même sort, destination différente — la console, ou tes mains.",
    },
    {
      kind: "fill",
      prompt: "Fais grandir l'inscription : ajoute `\" of the Vaults\"`.",
      file: "main.rs",
      before: "let mut title = String::from(\"Keeper\");\ntitle.",
      after: "(\" of the Vaults\");",
      choices: ["push_str", "push", "append"],
      answer: 0,
      explain: "push_str ajoute du texte ; push ajoute un seul caractère.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — l'inscription vivante

1. Ajoute \`" of the Vaults"\` à \`title\` avec \`push_str\`.
2. \`let banner = format!("The {}", title);\`
3. Affiche la bannière.

Sortie attendue :

\`\`\`text
The Keeper of the Vaults
\`\`\``,
    },
  ],

  "rust-standard-library-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `L'Amasseur ne laisse pas sortir le trésor — mais il te laisse **regarder**. Une **slice** est une fenêtre sur une portion de collection :

\`\`\`rust
let shelf = vec![1, 2, 3, 4, 5];
let window = &shelf[1..4];   // → [2, 3, 4]
\`\`\`

Aucune copie n'est faite. Le \`&\` la marque comme un emprunt — tu contemples l'étagère de l'Amasseur, tu ne l'emportes pas.`,
    },
    {
      kind: "theory",
      body: `Attention aux bords — même règle que les plages de \`for\` :

- \`1..4\` → cases 1, 2, 3 (**exclut** la fin)
- \`1..=4\` → cases 1, 2, 3, 4 (l'inclut)

Et pour afficher une slice entière, utilise le **marqueur de debug** \`{:?}\` :

\`\`\`rust
println!("{:?}", window);   // [2, 3, 4]
\`\`\``,
    },
    {
      kind: "quiz",
      question: "Pour `vec![10, 20, 30, 40]`, que vaut `&v[0..2]` ?",
      options: ["[10, 20] — la fin est exclue", "[10, 20, 30] — la fin est incluse", "[20, 30]"],
      answer: 0,
      explain: "0..2 couvre les cases 0 et 1. La fenêtre exclut sa fin.",
    },
    {
      kind: "fill",
      prompt: "Affiche la fenêtre — les slices ont besoin du marqueur de debug.",
      file: "main.rs",
      before: "println!(\"",
      after: "\", window);",
      choices: ["{:?}", "{}", "{window}"],
      answer: 0,
      explain: "{:?} est le marqueur de debug — les collections s'affichent avec lui.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — une fenêtre sur le trésor

1. Prends le milieu : \`let middle = &shelf[1..4];\`
2. Affiche \`middle: {:?}\`.

Sortie attendue :

\`\`\`text
middle: [2, 3, 4]
\`\`\``,
    },
  ],
};
