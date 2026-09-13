import type { LessonStep } from "@/content/steps";

// FR · Ownership, Moves & Drops.
//
// Overlay for ../../steps/rust-ownership-deep.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustOwnershipDeepStepsFr: Record<string, LessonStep[]> = {
  "rust-ownership-deep-1": [
    {
      kind: "theory",
      body: `Chaque valeur en Rust a exactement un propriétaire, et son type décide où ses bytes vivent réellement.

Un \`i32\` fait 4 bytes et vit entièrement dans le stack frame de la fonction qui le tient. Une \`String\`, c'est différent : le *handle* vit sur la stack et fait toujours la même taille, tandis que les caractères vivent sur le heap.

Ce handle, c'est trois mots — un pointeur, une longueur et une capacité :

\`\`\`rust
let name = String::from("stellar");
// stack:  [ ptr | len: 7 | cap: 7 ]   = 24 bytes sur une cible 64 bits
// heap:   s t e l l a r               = 7 bytes
\`\`\``,
    },
    {
      kind: "theory",
      body: `Cette séparation est la raison entière pour laquelle l'ownership existe.

Copier les 4 bytes d'un \`i32\` ne coûte rien, donc Rust les copie, point. Copier une \`String\` voudrait dire soit dupliquer l'allocation sur le heap (cher, et en silence), soit avoir deux handles qui pointent sur la même allocation (ce qui la libère deux fois).

Rust refuse les deux. À la place, il transfère le handle — et ce transfert, c'est exactement ce que « move » veut dire. Rien sur le heap n'est touché.

\`std::mem::size_of::<T>()\` donne la taille sur la **stack** d'un type, jamais le payload sur le heap derrière. Ça vaut le coup d'intégrer cette distinction tout de suite : c'est celle que les gens ratent en entretien.`,
    },
    {
      kind: "quiz",
      question:
        "`size_of::<String>()` renvoie 24 sur une cible 64 bits, que la string contienne 3 caractères ou 3 millions. Pourquoi ?",
      options: [
        "Il mesure le handle sur la stack — pointeur, longueur et capacité — pas le buffer sur le heap vers lequel il pointe",
        "Rust plafonne toute String à 24 bytes et déverse le reste dans une table annexe",
        "24 est la taille de la première ligne de cache que l'allocateur distribue",
      ],
      answer: 0,
      explain:
        "`size_of` est une constante de compile time, donc il ne peut décrire que ce que le compilateur sait : le layout fixe sur la stack. La longueur sur le heap est une valeur de runtime — c'est `.len()`.",
    },
    {
      kind: "fill",
      prompt:
        "Affiche le nombre de bytes que les données de la string occupent sur le heap — pas le handle.",
      file: "main.rs",
      before: 'let name = String::from("stellar");\nprintln!("heap bytes: {}", name.',
      after: ");",
      choices: ["len()", "capacity()", "size_of()"],
      answer: 0,
      explain:
        "`len()`, ce sont les bytes réellement utilisés. `capacity()`, ce sont les bytes réservés, qui peuvent être plus nombreux après une croissance — une vraie distinction, mais pas celle demandée ici.",
    },
    {
      kind: "quiz",
      question:
        "Une fonction prend `data: Vec<u8>` par valeur et est appelée dans une boucle chaude. Qu'est-ce qui est copié à chaque appel ?",
      options: [
        "24 bytes — le handle du vecteur. Le buffer sur le heap n'est pas touché, il est simplement repointé",
        "Le buffer entier, et c'est pour ça que passer par valeur dans une boucle coûte cher",
        "Rien — Rust passe chaque argument par référence sous le capot",
      ],
      answer: 0,
      explain:
        "Un move est bon marché : c'est un memcpy du handle. Le coût que les gens redoutent avec `par valeur`, c'est le *drop* à la fin de la fonction appelée, pas le transfert.",
    },
    {
      kind: "editor",
      intro: `### Mesure la séparation

Affiche la taille sur la stack d'un \`i32\`, la taille sur la stack d'une \`String\`, et les bytes sur le heap d'une string précise.

Sortie attendue :

\`\`\`text
i32 stack size: 4
String stack size: 24
heap bytes: 7
\`\`\`

Utilise \`std::mem::size_of\` pour les deux premiers et \`.len()\` pour le troisième.`,
    },
  ],

  "rust-ownership-deep-2": [
    {
      kind: "theory",
      body: `Une affectation fait l'une de deux choses, et le type décide laquelle.

Si le type implémente \`Copy\`, les bits sont dupliqués et les deux bindings restent utilisables. Sinon, l'ownership **move** et le binding source est mort — l'utiliser ensuite est une erreur de compilation, pas une surprise au runtime.

\`\`\`rust
let x = 10;
let y = x;
println!("{x}");        // ok — i32 est Copy

let s1 = String::from("hi");
let s2 = s1;
println!("{s1}");       // erreur : borrow of moved value: \`s1\`
\`\`\``,
    },
    {
      kind: "theory",
      body: `La règle qui décide quels types sont \`Copy\` n'est pas arbitraire : **un type ne peut être \`Copy\` que si chacun de ses champs l'est, et il ne doit pas implémenter \`Drop\`.**

Ça exclut exactement les types où dupliquer les bits serait faux. \`String\`, \`Vec<T>\` et \`Box<T>\` possèdent tous une allocation sur le heap et implémentent tous \`Drop\` — deux copies voudraient dire deux frees.

\`Clone\` est l'opt-in explicite pour la même chose : \`s1.clone()\` fait la copie profonde que \`=\` a refusé de faire en silence. La verbosité est voulue. Une allocation doit être visible dans le code.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi un type qui implémente `Drop` ne peut-il jamais implémenter aussi `Copy` ?",
      options: [
        "Copier les bits produirait deux propriétaires de la même ressource, et `drop` tournerait deux fois dessus",
        "`Drop` et `Copy` définissent tous les deux une méthode nommée `clone`, donc ils entrent en collision",
        "Il peut — la bibliothèque standard choisit simplement de ne pas le faire pour `String`",
      ],
      answer: 0,
      explain:
        "C'est une règle dure du compilateur, pas une convention. `Copy` veut dire « dupliquer les bits donne un duplicata complet » ; `Drop` veut dire « ces bits possèdent quelque chose qui doit être libéré une seule fois ». Les deux affirmations se contredisent.",
    },
    {
      kind: "fill",
      prompt:
        "Garde `s1` utilisable après avoir produit une seconde string indépendante.",
      file: "main.rs",
      before: 'let s1 = String::from("ledger");\nlet s2 = s1.',
      after: ';\nprintln!("{s1} {s2}");',
      choices: ["clone()", "as_str()", "to_owned().as_str()"],
      answer: 0,
      explain:
        "`clone()` alloue un second buffer, donc chaque handle possède ses propres données. `as_str()` ferait un borrow à la place — du Rust valide aussi, mais ça ne te donne pas une seconde `String`.",
    },
    {
      kind: "quiz",
      question:
        "`let t = (1i32, String::from(\"a\")); let u = t;` — quel est l'état de `t` ensuite ?",
      options: [
        "Entièrement moved. Un tuple n'est `Copy` que si chaque élément l'est, et `String` ne l'est pas",
        "Partiellement moved : `t.0` est encore lisible parce que `i32` est `Copy`",
        "Intact — les tuples sont toujours copiés élément par élément",
      ],
      answer: 0,
      explain:
        "Affecter le tuple entier move le tuple entier. Les moves partiels champ par champ existent, mais seulement quand tu nommes le champ — c'est la prochaine leçon.",
    },
    {
      kind: "editor",
      intro: `### Move, copy, clone

Montre les trois comportements dans un seul programme :

1. Lie \`10\` à \`a\`, puis \`a\` à \`b\`, et affiche les deux — c'est une copie.
2. Construis une \`String\` contenant \`ledger\`, fais-en un \`clone()\` et affiche les deux.
3. Move le clone dans un troisième binding et affiche-le.

Sortie attendue :

\`\`\`text
copy: 10 10
clone: ledger ledger
moved: ledger
\`\`\``,
    },
  ],

  "rust-ownership-deep-3": [
    {
      kind: "theory",
      body: `L'ownership est suivi **par champ**, pas seulement par valeur.

Move un champ hors d'une struct laisse la struct partiellement moved : le champ que tu as pris est mort, tous les autres restent lisibles.

\`\`\`rust
struct Account { id: String, balance: i64 }

let acct = Account { id: String::from("GA7Q"), balance: 250 };
let id = acct.id;              // move seulement ce champ
println!("{}", acct.balance);  // ok
println!("{}", acct.id);       // erreur : value moved
println!("{:?}", acct);        // erreur : \`acct\` n'est plus entière
\`\`\``,
    },
    {
      kind: "theory",
      body: `Deux limites à connaître avant de t'appuyer là-dessus.

**Une valeur partiellement moved ne peut pas être utilisée comme un tout.** Tu peux lire les champs qui restent, mais tu ne peux ni passer \`acct\` à une fonction, ni la retourner, ni la move à nouveau.

**Un type qui implémente \`Drop\` ne peut pas être partiellement moved, point.** Son \`drop\` va tourner sur la valeur entière, donc le compilateur ne peut pas tolérer un trou dedans. Si tu as besoin d'un champ d'un type comme ça, soit tu le \`clone()\`, soit tu utilises \`std::mem::take\`, qui met la valeur par défaut à la place et te rend l'original.`,
    },
    {
      kind: "quiz",
      question:
        "`let id = acct.id;` compile, mais ajouter `#[derive(Debug)]` puis `println!(\"{acct:?}\")` juste après ne compile pas. Pourquoi ?",
      options: [
        "Le formatage `Debug` lit la struct entière, et un champ ne contient plus de valeur valide",
        "`derive(Debug)` prend l'ownership de la struct sur laquelle il est appliqué",
        "Les moves partiels ne sont autorisés que sur les structs qui ne dérivent rien",
      ],
      answer: 0,
      explain:
        "La struct n'a pas disparu — elle a un trou. Tout ce qui a besoin d'elle en entier (Debug, la passer plus loin, la retourner) est rejeté ; lire un champ intact ne l'est pas.",
    },
    {
      kind: "fill",
      prompt:
        "`Session` implémente `Drop`, donc on ne peut pas move un champ hors d'elle. Prends le token et laisse une `String` vide à la place.",
      file: "main.rs",
      before: "let token = std::mem::",
      after: "(&mut session.token);",
      choices: ["take", "drop", "swap"],
      answer: 0,
      explain:
        "`take` remplace le champ par `Default::default()` et renvoie l'original — la valeur reste entière, donc `Drop` a encore quelque chose de valide sur quoi tourner. `swap` marche aussi, mais tu dois fournir le remplaçant toi-même.",
    },
    {
      kind: "quiz",
      question:
        "Tu as besoin d'un champ `String` d'une struct que tu dois aussi passer à une autre fonction ensuite. Qu'est-ce qui est correct ?",
      options: [
        "`clone()` le champ, ou `mem::take` si laisser une valeur vide derrière est acceptable",
        "Move le champ dehors et passer la struct plus loin — le compilateur rebouche le trou",
        "Envelopper la struct dans un `Box` d'abord ; le boxing rend les moves partiels entiers à nouveau",
      ],
      answer: 0,
      explain:
        "Le choix est un vrai compromis : `clone` coûte une allocation et garde l'original intact, `mem::take` est gratuit mais mute la source. Aucun des deux n'est toujours le bon.",
    },
    {
      kind: "editor",
      intro: `### Prends un champ, garde le reste

Définis \`struct Account { id: String, balance: i64 }\` et construis-en une avec l'id \`GA7Q\` et le balance \`250\`.

Move **uniquement** le champ \`id\` dans son propre binding, puis affiche l'id et le balance encore dans la struct.

Sortie attendue :

\`\`\`text
id: GA7Q
balance: 250
\`\`\``,
    },
  ],

  "rust-ownership-deep-4": [
    {
      kind: "theory",
      body: `Le borrow checker impose une règle : à tout instant, une valeur a **soit** un nombre quelconque de références partagées \`&T\`, **soit** exactement une référence exclusive \`&mut T\`. Jamais les deux.

Ce qui fait trébucher les gens, c'est le *à tout instant*. Un borrow dure jusqu'à sa **dernière utilisation**, pas jusqu'à la fin du bloc. Ça s'appelle NLL — non-lexical lifetimes — et ça veut dire que la plupart des erreurs d'aliasing se corrigent en déplaçant une ligne, pas en clonant.

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = &v[0];      // le borrow partagé commence
println!("{first}");    // ...et se termine ici, à sa dernière utilisation
v.push(4);              // ok — plus rien n'emprunte v
\`\`\``,
    },
    {
      kind: "theory",
      body: `Réordonner ne marche que si le *résultat* du borrow n'a pas besoin de survivre à la mutation. Quand il en a besoin, extrais d'abord la valeur hors du borrow :

\`\`\`rust
let mut v = vec![1, 2, 3];
let first = v[0];       // i32 est Copy — ça lit et ça termine le borrow
v.push(4);
println!("{first}");    // ok : \`first\` possède ses 4 bytes
\`\`\`

Pour un élément non-\`Copy\`, le même geste existe — \`.clone()\`, ou calculer un résumé comme \`.len()\` ou \`.iter().sum()\` — et ça doit être un choix délibéré, pas un réflexe. Dégainer \`clone()\` dès que le compilateur râle, c'est comme ça qu'un chemin chaud récupère en douce une allocation par itération.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `let n = &v[0]; v.push(4); println!(\"{n}\");` échoue, alors que déplacer le `println!` au-dessus du `push` compile ?",
      options: [
        "`push` peut réallouer le buffer, donc la référence pourrait devenir pendante — et le borrow est encore vivant parce qu'il est utilisé après",
        "`push` exige que le vecteur n'ait aucune référence à aucun point de tout le corps de la fonction",
        "La macro `println!` capture ses arguments par valeur, ce qui move hors d'un borrow",
      ],
      answer: 0,
      explain:
        "Les deux moitiés comptent : `push` a besoin d'un `&mut`, et le borrow partagé est encore vivant parce qu'une ligne plus bas l'utilise. Remonte cette ligne et le borrow se termine avant le `push` — c'est exactement ce que NLL t'offre.",
    },
    {
      kind: "fill",
      prompt:
        "Calcule un total sur le vecteur sans retenir un borrow au-delà de la ligne.",
      file: "main.rs",
      before: "let total: i32 = ledger.iter().",
      after: ";\nledger.push(total);",
      choices: ["sum()", "collect()", "count()"],
      answer: 0,
      explain:
        "`sum()` consomme l'itérateur et renvoie un `i32` possédé, donc le borrow de `ledger` est terminé à la fin de l'instruction — `push` est alors libre de prendre `&mut`.",
    },
    {
      kind: "quiz",
      question:
        "Laquelle de ces habitudes est la *pire* pour corriger une erreur du borrow checker dans une boucle chaude ?",
      options: [
        "Cloner la valeur empruntée, parce que ça convertit en silence une erreur de compilation en une allocation par itération",
        "Resserrer le scope du borrow pour qu'il se termine avant la mutation",
        "Extraire un résumé `Copy` des données avant de muter",
      ],
      answer: 0,
      explain:
        "`clone()` n'est pas interdit — parfois c'est vraiment le bon appel. Le mode de défaillance, c'est de l'utiliser *par réflexe*, ce qui fait taire le compilateur sans rendre le code correct ni rapide.",
    },
    {
      kind: "editor",
      intro: `### Termine le borrow avant de muter

Étant donné \`let mut ledger = vec![10, 20, 30];\` :

1. Somme les entrées dans \`total\` avec un itérateur.
2. Push \`total\` dans \`ledger\`.
3. Affiche le vecteur, puis le total.

Sortie attendue :

\`\`\`text
ledger: [10, 20, 30, 60]
total: 60
\`\`\``,
    },
  ],

  "rust-ownership-deep-5": [
    {
      kind: "theory",
      body: `Deux coercions tournent si souvent qu'elles deviennent invisibles — puis déroutantes la première fois qu'elles ne se déclenchent pas.

**Deref coercion.** \`&String\` devient \`&str\`, \`&Vec<T>\` devient \`&[T]\`, \`&Box<T>\` devient \`&T\`. Le compilateur insère la conversion au call site chaque fois que le type cible ne correspond pas mais qu'un impl de \`Deref\` fait le pont.

\`\`\`rust
fn describe(s: &str) -> usize { s.len() }

let owned = String::from("soroban");
describe(&owned);   // &String coercé en &str — pas d'allocation, pas de copie
\`\`\`

C'est pour ça que tu prends \`&str\` en paramètre et \`String\` dans un champ de struct : le paramètre accepte les deux, le champ possède ses données.`,
    },
    {
      kind: "theory",
      body: `**Reborrowing.** \`&mut T\` n'est pas \`Copy\` — il ne peut jamais y en avoir qu'un. Donc en passer un à une fonction devrait le move et laisser ton binding mort. Ce n'est pas le cas :

\`\`\`rust
let mut seq = 41;
let handle = &mut seq;
bump(handle);           // reborrow implicite : &mut *handle
bump(&mut *handle);     // la même chose, écrite en toutes lettres
\`\`\`

Le compilateur passe en silence \`&mut *handle\` — un *nouveau* borrow, plus court, dérivé du tien. Il expire quand la fonction appelée retourne, et ton handle est à nouveau vivant. Sans ça, chaque \`&mut\` serait à usage unique et le langage serait invivable.

Tu dois écrire le reborrow toi-même dans un cas courant : stocker un \`&mut\` dans une struct, ou le retourner, là où le compilateur ne peut pas inférer le lifetime plus court que tu voulais.`,
    },
    {
      kind: "quiz",
      question:
        "`fn bump(n: &mut i64)` est appelée deux fois de suite avec le même binding `&mut`, et ça compile. Pourquoi le premier appel n'est-il pas un move ?",
      options: [
        "Le compilateur insère un reborrow implicite, `&mut *handle`, qui expire quand l'appel retourne",
        "`&mut i64` est `Copy` parce que `i64` est `Copy`",
        "Les arguments de fonction sont toujours passés par référence, donc rien ne move",
      ],
      answer: 0,
      explain:
        "Le reborrowing est le mécanisme qui rend les références exclusives utilisables plus d'une fois. `&mut T` n'est jamais `Copy`, quel que soit `T`.",
    },
    {
      kind: "fill",
      prompt:
        "Écris le reborrow explicitement, pour que le second appel reçoive son propre borrow exclusif à courte durée de vie.",
      file: "main.rs",
      before: "bump(",
      after: "handle);",
      choices: ["&mut *", "&", "*"],
      answer: 0,
      explain:
        "`&mut *handle` déréférence pour atteindre la valeur, puis en prend un borrow exclusif tout neuf. `&handle` serait un borrow partagé *de la référence elle-même* — un autre type.",
    },
    {
      kind: "quiz",
      question:
        "Une fonction publique prend `name: String` et ne fait qu'appeler `.len()` dessus. Quelle devrait être la signature ?",
      options: [
        "`&str` — elle accepte `&String` par deref coercion et `&'static str` directement, et n'impose aucune allocation à l'appelant",
        "`String`, pour que la fonction possède ses données et ne puisse pas être affectée par l'appelant",
        "`&String`, qui est le type le plus précis et donc le plus rapide",
      ],
      answer: 0,
      explain:
        "`&String` est strictement pire que `&str` : elle accepte moins (un littéral ne se coerce pas *vers le haut*) et n'apporte rien. Prends `String` seulement quand tu as vraiment besoin de la stocker ou de la consommer.",
    },
    {
      kind: "editor",
      intro: `### Les deux coercions dans un seul programme

1. Écris \`fn describe(s: &str) -> usize\` qui renvoie la longueur de la string, et appelle-la avec une \`&String\` contenant \`soroban\`.
2. Écris \`fn bump(n: &mut i64)\` qui ajoute 1.
3. Lie \`let mut seq = 41;\`, prends \`let handle = &mut seq;\`, puis appelle \`bump\` deux fois — une fois en passant \`handle\`, une fois en passant un \`&mut *handle\` explicite.
4. Affiche la valeur finale de \`seq\`.

Sortie attendue :

\`\`\`text
len: 7
seq: 43
\`\`\``,
    },
  ],

  "rust-ownership-deep-6": [
    {
      kind: "theory",
      body: `Quand une valeur sort de son scope, Rust exécute son impl de \`Drop\` — pas de \`finally\`, pas de \`defer\`, pas de \`close()\` que tu pourrais oublier. C'est RAII : **acquérir la ressource, c'est construire la valeur ; la libérer, c'est la valeur qui se termine.**

\`\`\`rust
struct Guard(&'static str);

impl Drop for Guard {
    fn drop(&mut self) {
        println!("release {}", self.0);
    }
}
\`\`\`

Tu n'appelles jamais \`drop\` toi-même. \`std::mem::drop(value)\` existe, mais tout ce qu'il fait, c'est prendre l'ownership et laisser la valeur sortir du scope plus tôt.`,
    },
    {
      kind: "theory",
      body: `L'ordre est exact et vaut la peine d'être mémorisé, parce que c'est lui qui rend les lock guards et les connection pools sûrs :

**Les variables d'un scope sont drop dans l'ordre inverse de déclaration.** Dernière déclarée, première libérée — la stack se démonte comme elle a été montée. Les *champs* d'une struct, à l'inverse, sont drop dans l'ordre de déclaration.

\`\`\`rust
let _outer = Guard("outer");
{
    let _inner = Guard("inner");
}   // "release inner" ici
    // "release outer" à la fin de main
\`\`\`

C'est pour ça que \`MutexGuard\` n'a besoin d'aucun appel d'unlock, et pour ça qu'entourer une section critique d'un bloc \`{ }\` est une vraie technique et pas un choix de style : l'accolade fermante *est* l'unlock.`,
    },
    {
      kind: "quiz",
      question:
        "Trois guards `a`, `b`, `c` sont déclarés dans cet ordre dans un même scope. Qu'est-ce qui est affiché ?",
      options: [
        "c, puis b, puis a — ordre inverse de déclaration",
        "a, puis b, puis c — ordre de déclaration, comme les champs d'une struct",
        "L'ordre n'est pas spécifié et peut varier d'une version du compilateur à l'autre",
      ],
      answer: 0,
      explain:
        "Ordre inverse pour les locales, ordre direct pour les champs de struct. L'asymétrie est délibérée : une locale déclarée plus tard peut emprunter à une plus ancienne, donc elle doit mourir en premier.",
    },
    {
      kind: "fill",
      prompt:
        "Libère un lock guard plus tôt, sans attendre la fin de la fonction.",
      file: "main.rs",
      before: "let guard = lock.acquire();\n",
      after: "(guard);\nlong_running_work();",
      choices: ["drop", "guard.close", "std::mem::forget"],
      answer: 0,
      explain:
        "`drop` prend la valeur par ownership et la termine là. `mem::forget` fait l'inverse — il fait fuir la valeur exprès et le lock n'est jamais libéré.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi garder un `MutexGuard` pendant un appel lent est-il un problème, même dans des tests single-thread ?",
      options: [
        "Le guard vit jusqu'à la fin de son scope, donc le lock est tenu pendant tout l'appel — tous les autres threads bloquent derrière",
        "`Drop` ne peut pas tourner tant qu'un appel de fonction est sur la stack, donc le guard fuit",
        "Ce n'est pas un problème ; le compilateur libère le lock à la dernière utilisation du guard",
      ],
      answer: 0,
      explain:
        "C'est exactement le piège : NLL termine les *borrows* à la dernière utilisation, mais `Drop` tourne à la fin du *scope*. Un guard que tu as arrêté de lire tient toujours le lock. Délimite-le exprès avec un bloc.",
    },
    {
      kind: "editor",
      intro: `### Prouve l'ordre

Définis \`struct Guard(&'static str)\` avec un impl de \`Drop\` qui affiche \`release <nom>\`.

Dans \`main\`, crée un guard nommé \`outer\`, puis ouvre un bloc interne contenant un guard nommé \`inner\` et un \`println!("inside")\`. Après le bloc, affiche \`outside\`.

Sortie attendue :

\`\`\`text
inside
release inner
outside
release outer
\`\`\``,
    },
  ],
};
