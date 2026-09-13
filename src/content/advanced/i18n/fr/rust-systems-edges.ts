import type { LessonStep } from "@/content/steps";

// FR · Macros, Unsafe, FFI & Money.
//
// Overlay for ../../steps/rust-systems-edges.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustSystemsEdgesStepsFr: Record<string, LessonStep[]> = {
  "rust-systems-edges-1": [
    {
      kind: "theory",
      body: `Tout en Rust est **privé par défaut**, et c'est l'arbre de modules qui rend un invariant applicable au lieu de simplement documenté.

\`\`\`rust
mod ledger {
    pub struct Balance { stroops: i64 }   // type public, champ privé
}
\`\`\`

Hors de \`ledger\`, personne ne peut construire un \`Balance\` avec un littéral, lire \`stroops\` directement, ni le muter. La seule entrée, c'est le constructeur que tu as exposé — donc « un solde n'est jamais négatif » cesse d'être un commentaire et devient une propriété du type.`,
    },
    {
      kind: "theory",
      body: `Quatre niveaux de visibilité, dans l'ordre où tu devrais les utiliser :

| écrit | visible par |
| --- | --- |
| *(rien)* | ce module et ses descendants |
| \`pub(crate)\` | n'importe où dans ce crate |
| \`pub(super)\` | le module parent |
| \`pub\` | tout le monde, y compris les autres crates |

\`pub(crate)\` est celui que les gens sous-utilisent. C'est le bon niveau pour un helper que plusieurs modules partagent mais qui ne doit jamais apparaître dans ton API publique — et contrairement à \`pub\`, le changer plus tard n'est pas un breaking change pour tes utilisateurs.

La convention de layout : \`mod\` déclare, \`use\` importe, \`super::\` remonte, \`crate::\` part de la racine. Un \`lib.rs\` qui n'est presque que des lignes \`pub mod\` et \`pub use\`, c'est toute l'API publique dans un seul fichier lisible — exactement ce qu'il devrait être.`,
    },
    {
      kind: "quiz",
      question:
        "`pub struct Balance { stroops: i64 }` — que peut faire le code extérieur au module avec ça ?",
      options: [
        "Uniquement ce que les fonctions publiques du module permettent — le champ est privé, donc pas de construction par littéral et pas de lecture directe",
        "Tout ; `pub` sur la struct rend ses champs publics aussi",
        "Rien du tout ; le type est inutilisable hors de son module",
      ],
      answer: 0,
      explain:
        "La visibilité des champs se décide champ par champ et vaut privé par défaut. C'est le mécanisme derrière chaque type « parse, don't validate » en Rust — le constructeur est la seule porte.",
    },
    {
      kind: "fill",
      prompt:
        "Expose un helper à tout le crate sans l'ajouter à l'API publique.",
      file: "main.rs",
      before: "    ",
      after: " fn raw(&self) -> i64 {",
      choices: ["pub(crate)", "pub", "pub(super)"],
      answer: 0,
      explain:
        "`pub(crate)` le garde hors de la surface publiée, donc il peut changer sans release cassante. `pub(super)` n'atteindrait que le module parent.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi rendre un helper `pub` plutôt que `pub(crate)` compte-t-il au-delà du style ?",
      options: [
        "`pub` fait partie de ton contrat semver — le retirer ou le changer plus tard est une release cassante",
        "Les items `pub` sont compilés séparément et ralentissent le build",
        "`pub` désactive l'inlining à travers les frontières de modules",
      ],
      answer: 0,
      explain:
        "Chaque item `pub` est une promesse faite à des inconnus. La visibilité la plus étroite qui compile est celle qui te laisse libre de changer d'avis.",
    },
    {
      kind: "editor",
      intro: `### Rends l'invariant incassable

1. \`mod ledger\` contenant \`#[derive(Debug)] pub struct Balance { stroops: i64 }\` — le **champ reste privé**.
2. Dans \`impl Balance\` : \`pub fn new(stroops: i64) -> Option<Balance>\` qui renvoie \`None\` pour une valeur négative, \`pub fn stroops(&self) -> i64\`, et \`pub(crate) fn raw(&self) -> i64\`.
3. Dans \`main\`, \`use ledger::Balance;\` puis affiche \`new(250)\` mappé sur ses stroops, \`new(-1)\` de la même façon, et \`raw()\` sur un solde valide.

Sortie attendue :

\`\`\`text
valid: Some(250)
invalid: None
crate-visible: 10
\`\`\`

Il n'y a aucun moyen de construire un \`Balance\` négatif depuis \`main\`. C'est tout l'intérêt.`,
    },
  ],

  "rust-systems-edges-2": [
    {
      kind: "theory",
      body: `\`macro_rules!\` matche de la **syntaxe** et s'expanse en plus de syntaxe, avant la vérification des types. Elle fait ce qu'une fonction ne peut pas :

- prendre un nombre variable d'arguments
- accepter des arguments de types différents à la même position
- capturer le *texte source* d'une expression (c'est comme ça que \`assert_eq!\` affiche les deux côtés)

\`\`\`rust
macro_rules! metric {
    ($name:expr, $value:expr) => { format!("{}={}", $name, $value) };
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `Deux mécanismes font l'essentiel du travail.

**Les fragment specifiers** disent quel genre de syntaxe chaque capture accepte : \`expr\`, \`ident\`, \`ty\`, \`literal\`, \`block\`, \`pat\`, \`tt\`. Utiliser le plus étroit donne de meilleures erreurs — \`$n:ident\` rejette une expression complète au call site de la macro, plutôt qu'au fin fond de l'expansion.

**La répétition.** \`$( ... ),+\` matche un ou plusieurs groupes séparés par des virgules, et le même \`$( ... )+\` dans le corps émet une copie par match :

\`\`\`rust
($name:expr, $value:expr, $($k:expr => $v:expr),+) => {{
    let mut out = format!("{}={}", $name, $value);
    $( out.push_str(&format!(",{}={}", $k, $v)); )+
    out
}};
\`\`\`

Note les doubles accolades : \`{{ ... }}\` fait de l'expansion une expression de bloc, donc elle peut contenir des statements et quand même s'évaluer en une valeur.

La discipline : **commence par une fonction.** Une macro est plus dure à lire, plus dure à déboguer, et invisible pour le go-to-definition de \`rust-analyzer\`. Utilises-en une quand ce dont tu as besoin ne peut vraiment pas être une fonction — des arguments variadiques, ou la capture de texte source.`,
    },
    {
      kind: "quiz",
      question: "Que peut faire une macro `macro_rules!` qu'une fonction ne peut pas ?",
      options: [
        "Prendre un nombre variable d'arguments, mélanger les types à une même position, et capturer le texte source d'une expression",
        "Tourner plus vite, parce qu'elle est expansée à la compilation",
        "Accéder aux champs privés de types d'autres modules",
      ],
      answer: 0,
      explain:
        "La vitesse n'est pas une raison : une macro s'expanse en du code que l'optimiseur voit exactement comme une fonction inlinée. Les variadiques et la capture de source sont les vraies motivations, et les seules.",
    },
    {
      kind: "fill",
      prompt: "Matche un ou plusieurs couples clé/valeur séparés par des virgules.",
      file: "main.rs",
      before: "($name:expr, $value:expr, $($k:expr => $v:expr)",
      after: ") => {{",
      choices: [",+", "*", ";?"],
      answer: 0,
      explain:
        "`,+` signifie « un ou plus, séparés par des virgules ». `,*` en autoriserait zéro, ce qui entre ici en collision avec la règle à deux arguments juste au-dessus.",
    },
    {
      kind: "quiz",
      question: "Pourquoi utilise-t-on `{{ ... }}` dans le corps d'une expansion de macro ?",
      options: [
        "Les accolades intérieures font de l'expansion une expression de bloc, donc elle peut contenir des statements et quand même s'évaluer en une valeur",
        "Elles échappent les accolades pour qu'elles apparaissent littéralement dans la sortie",
        "C'est une syntaxe obligatoire pour toute macro avec répétition",
      ],
      answer: 0,
      explain:
        "La paire extérieure délimite l'expansion ; la paire intérieure est un vrai bloc Rust. Sans elle, une expansion à plusieurs statements ne peut pas être utilisée là où une valeur est attendue.",
    },
    {
      kind: "editor",
      intro: `### Une macro qu'une fonction n'aurait pas pu remplacer

Écris \`macro_rules! metric\` avec deux règles :

1. \`($name:expr, $value:expr)\` → \`"<name>=<value>"\`.
2. \`($name:expr, $value:expr, $($k:expr => $v:expr),+)\` → la même chose, puis \`",<k>=<v>"\` ajouté pour chaque couple.

Appelle-la ensuite deux fois : avec \`("requests", 42)\`, et avec \`("latency", 95, "method" => "getEvents", "code" => 200)\`.

Sortie attendue :

\`\`\`text
requests=42
latency=95,method=getEvents,code=200
\`\`\`

Deux arités différentes, et la seconde est variadique — c'est exactement pour ça que ça ne peut pas être une fonction.`,
    },
  ],

  "rust-systems-edges-3": [
    {
      kind: "theory",
      body: `\`#[derive(...)]\` est une **macro procédurale** : elle reçoit le flux de tokens de ton type et renvoie du code généré, compilé avec lui.

\`#[derive(Debug)]\` écrit un impl de \`Debug\` qui affiche chaque champ par son nom. \`#[derive(Clone)]\` écrit un \`clone\` qui clone chaque champ. \`#[derive(PartialEq)]\` compare chaque champ. \`#[derive(Default)]\` remplit chaque champ avec **son propre** défaut — \`0\`, \`false\`, \`String::new()\`.

Rien n'est un cas spécial dans le compilateur. La sortie est du Rust ordinaire, et \`cargo expand\` te la montre.`,
    },
    {
      kind: "theory",
      body: `Deux conséquences à garder en tête.

**Un derive ne peut faire que ce que ses entrées permettent.** \`#[derive(Clone)]\` sur une struct avec un champ non-\`Clone\` échoue — et l'erreur pointe sur le derive, ce qui explique pourquoi ces messages semblent bizarres les premières fois.

**Les attributs configurent le code généré.** \`#[serde(rename = "type")]\`, \`#[serde(default)]\`, \`#[serde(skip)]\` sont lus par le derive de Serde pendant qu'il génère l'impl. Ce ne sont pas des features du compilateur ; ce sont des arguments passés à une macro.

Les trois sortes de macros procédurales, pour fixer le vocabulaire : **derive** (\`#[derive(Serialize)]\`), **attribut** (\`#[tokio::main]\`, qui réécrit ton \`fn main\` en un autre qui démarre un runtime), et **de type fonction** (\`sqlx::query!\`, qui va interroger la base à la compilation pour vérifier ton SQL). Les trois sont des crates Rust ordinaires qui tournent pendant la compilation.`,
    },
    {
      kind: "quiz",
      question: "Que fait réellement `#[tokio::main]` ?",
      options: [
        "C'est une macro d'attribut qui réécrit ton `async fn main` en un `main` synchrone qui construit un runtime et appelle `block_on`",
        "Elle marque la fonction pour que le compilateur linke le runtime Tokio",
        "C'est un builtin du compilateur qui active le support de l'async",
      ],
      answer: 0,
      explain:
        "`cargo expand` montre la réécriture en entier — et c'est le même `Runtime::new().block_on(...)` que tu aurais écrit. Le savoir rend le panic « cannot start a runtime from within a runtime » évident.",
    },
    {
      kind: "fill",
      prompt:
        "Donne à la struct une comparaison par valeur et un constructeur à zéro.",
      file: "main.rs",
      before: "#[derive(Debug, Clone, ",
      after: ")]\nstruct Config {",
      choices: ["PartialEq, Default", "Eq, New", "Copy, Default"],
      answer: 0,
      explain:
        "`Copy` échouerait ici : la struct contient une `String`, qui possède une allocation sur le heap et ne peut donc pas être `Copy`.",
    },
    {
      kind: "quiz",
      question:
        "`#[derive(Clone)]` sur une struct ne compile pas. Quelle est presque toujours la cause ?",
      options: [
        "L'un des champs n'est pas lui-même `Clone`, et le derive ne peut générer que ce que ses entrées supportent",
        "Il manque `#[derive(Copy)]` à la struct, que `Clone` exige",
        "La struct a un paramètre de lifetime, que les derives ne supportent pas",
      ],
      answer: 0,
      explain:
        "La dépendance va dans l'autre sens — `Copy` exige `Clone`, jamais l'inverse. Et les derives gèrent très bien les lifetimes.",
    },
    {
      kind: "editor",
      intro: `### Regarde ce qu'un derive génère

1. \`#[derive(Debug, Clone, PartialEq, Default)] struct Config { endpoint: String, retries: u32, verbose: bool }\`.
2. Construis-en une avec endpoint \`https://rpc\`, retries \`3\`, verbose \`false\`, et fais-en un \`clone()\`.
3. Affiche l'originale avec \`{:?}\`, si les deux sont égales, et \`Config::default()\` avec \`{:?}\`.

Sortie attendue :

\`\`\`text
debug: Config { endpoint: "https://rpc", retries: 3, verbose: false }
equal: true
default: Config { endpoint: "", retries: 0, verbose: false }
\`\`\`

Quatre impls, aucun écrit par toi — et chacun est du Rust ordinaire que tu aurais pu écrire toi-même.`,
    },
  ],

  "rust-systems-edges-4": [
    {
      kind: "theory",
      body: `\`unsafe\` ne désactive pas le borrow checker. Il déverrouille exactement cinq capacités :

1. déréférencer un pointeur brut
2. appeler une fonction \`unsafe\`
3. accéder à un \`static mut\`
4. implémenter un trait \`unsafe\`
5. accéder au champ d'une union

Tout le reste — ownership, borrowing, lifetimes, vérification des types — s'applique dans un bloc \`unsafe\` exactement comme à l'extérieur.`,
    },
    {
      kind: "theory",
      body: `Ce que \`unsafe\` veut vraiment dire, c'est **« j'affirme un invariant que le compilateur ne peut pas vérifier. »** Donc la compétence testée — celle pour laquelle un reviewer système est vraiment payé — c'est d'énoncer cet invariant avec précision.

La convention, c'est un commentaire \`// SAFETY:\` sur chaque bloc \`unsafe\`, qui dit *pourquoi* l'affirmation tient :

\`\`\`rust
// SAFETY: mid <= len, donc les deux plages sont dans la même allocation, et
// elles ne se chevauchent pas — les deux &mut slices n'aliasent donc jamais.
unsafe {
    (from_raw_parts_mut(ptr, mid), from_raw_parts_mut(ptr.add(mid), len - mid))
}
\`\`\`

Deux règles en découlent. **Garde le bloc aussi petit que possible** — une opération, pas tout un corps de fonction, pour que le lecteur sache exactement quelle ligne porte l'affirmation. Et **une fonction safe contenant \`unsafe\` promet que l'invariant tient pour toute entrée possible** ; si un appelant peut le casser avec du code safe ordinaire, la fonction elle-même doit être marquée \`unsafe\`.

Le \`split_at_mut\` de la bibliothèque standard est exactement ce programme : une API que le borrow checker ne peut pas exprimer, rendue safe par un argument que l'auteur a écrit noir sur blanc.`,
    },
    {
      kind: "quiz",
      question: "Que change réellement un bloc `unsafe` ?",
      options: [
        "Il autorise cinq opérations précises, comme déréférencer un pointeur brut — ownership, borrowing et vérification des types ne sont pas touchés",
        "Il désactive le borrow checker pour le code qu'il contient",
        "Il autorise les data races et saute les vérifications de bornes",
      ],
      answer: 0,
      explain:
        "C'est l'idée reçue la plus répandue. Les erreurs de borrow dans un bloc `unsafe` restent des erreurs de borrow — `unsafe` est une clé bien plus étroite que sa réputation ne le suggère.",
    },
    {
      kind: "fill",
      prompt: "Documente l'invariant que ce bloc affirme.",
      file: "main.rs",
      before: "// ",
      after: ": mid <= len, donc les deux plages sont dans les bornes et ne se chevauchent pas.\nunsafe {",
      choices: ["SAFETY", "NOTE", "UNSAFE"],
      answer: 0,
      explain:
        "`// SAFETY:` est la convention de tout l'écosystème, et le lint `undocumented_unsafe_blocks` de clippy cherche exactement ce préfixe.",
    },
    {
      kind: "quiz",
      question:
        "Quand une fonction contenant un bloc `unsafe` doit-elle elle-même être marquée `unsafe fn` ?",
      options: [
        "Quand un appelant pourrait casser l'invariant avec du code safe uniquement — l'obligation revient alors à l'appelant",
        "Toujours — toute fonction contenant `unsafe` doit être `unsafe`",
        "Jamais — marquer le bloc suffit",
      ],
      answer: 0,
      explain:
        "C'est toute la conception des abstractions safe. `Vec::push` utilise `unsafe` en interne et est safe, parce qu'aucun appelant safe ne peut violer ses invariants. `slice::get_unchecked` est `unsafe` parce qu'un appelant peut passer n'importe quel index.",
    },
    {
      kind: "editor",
      intro: `### Une API safe sur un cœur unsafe

Écris \`fn split_at_mid(data: &mut [i64]) -> (&mut [i64], &mut [i64])\` qui renvoie deux moitiés mutables sans chevauchement — quelque chose que le borrow checker ne peut pas exprimer, et que \`std\` fournit sous le nom \`split_at_mut\`.

Utilise \`as_mut_ptr\`, \`std::slice::from_raw_parts_mut\`, et un commentaire \`// SAFETY:\` qui dit pourquoi les deux slices n'aliasent jamais.

Dans \`main\`, découpe \`[1, 2, 3, 4, 5, 6]\`, écris \`100\` dans le premier élément de la moitié gauche et \`200\` dans le premier de la droite, affiche les deux moitiés, puis affiche le tableau entier.

Sortie attendue :

\`\`\`text
left: [100, 2, 3]
right: [200, 5, 6]
whole: [100, 2, 3, 200, 5, 6]
\`\`\``,
    },
  ],

  "rust-systems-edges-5": [
    {
      kind: "theory",
      body: `Un pointeur brut — \`*const T\` ou \`*mut T\` — est une simple adresse. Il ne porte ni lifetime, ni ownership, ni garantie d'aliasing, et il peut être null ou mal aligné.

En créer un est **safe**. Le déréférencer ne l'est pas :

\`\`\`rust
let p: *mut i64 = &mut value;    // safe — juste une adresse
unsafe { *p += 1; }              // unsafe — tu affirmes qu'il est valide
\`\`\`

Cette séparation est voulue : détenir une adresse ne peut jamais rien corrompre. Lire à travers, si.`,
    },
    {
      kind: "theory",
      body: `Déréférencer affirme quatre choses à la fois, et les quatre sont à ta charge :

**Non null.** \`ptr::null()\` existe et \`is_null()\` le vérifie — un pointeur brut n'a pas de niche \`Option\` sur laquelle s'appuyer.
**Aligné.** Un \`*mut i64\` doit se trouver sur une frontière de 8 octets. Une lecture mal alignée est un comportement indéfini, même sur du matériel qui la tolère.
**Pointant vers une valeur vivante.** L'original ne doit pas avoir été drop ni move.
**Sans aliaser un \`&mut\` vivant.** C'est celle que les gens ratent. L'optimiseur de Rust suppose qu'un \`&mut T\` est unique, et écrire via un pointeur brut qui chevauche un \`&mut\` vivant casse cette hypothèse — la mauvaise compilation peut apparaître loin de la ligne fautive.

\`ptr.add(n)\` fait de l'arithmétique de pointeur en unités de \`T\`, et exige que le résultat reste dans la même allocation — une position après la fin est permise, tout ce qui va au-delà est indéfini même si tu ne lis jamais.

Le conseil pratique : si tu vas chercher des pointeurs bruts hors du FFI ou d'une structure de données que le borrow checker ne peut vraiment pas exprimer, il y a presque certainement un moyen safe. Lance \`cargo miri test\` quand tu le fais — il détecte la plupart de ces violations à l'exécution.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi créer un pointeur brut est-il safe alors que le déréférencer ne l'est pas ?",
      options: [
        "Détenir une adresse ne peut jamais rien corrompre ; lire ou écrire à travers affirme une validité que le compilateur ne peut pas vérifier",
        "La création est vérifiée à la compilation, le déréférencement à l'exécution",
        "Créer un pointeur brut est aussi unsafe ; le compilateur ne l'impose simplement pas",
      ],
      answer: 0,
      explain:
        "C'est pour ça que `&raw const x` et les casts sont des opérations safe. L'obligation s'attache au point d'utilisation, qui est aussi là où le commentaire `// SAFETY:` a sa place.",
    },
    {
      kind: "fill",
      prompt: "Avance un pointeur de deux éléments, pas de deux octets.",
      file: "main.rs",
      before: "unsafe { println!(\"offset 2: {}\", *base.",
      after: "(2)); }",
      choices: ["add", "offset_bytes", "wrapping_byte_add"],
      answer: 0,
      explain:
        "`add` compte en unités de `T`, donc `base.add(2)` sur un `*const i64` avance de 16 octets. Le résultat doit rester dans la même allocation.",
    },
    {
      kind: "quiz",
      question:
        "Quelle violation de pointeur brut a le plus de chances de produire un bug qui apparaît loin de sa cause ?",
      options: [
        "Écrire via un pointeur brut qui aliase un `&mut` vivant — l'optimiseur a supposé l'unicité et compile mal ailleurs",
        "Déréférencer un pointeur null, qui plante immédiatement",
        "Lire un élément après la fin d'un tableau",
      ],
      answer: 0,
      explain:
        "Un déréférencement de null segfault sur la ligne même. Une violation d'aliasing est silencieuse, et le mauvais code émis par l'optimiseur peut se trouver dans une tout autre fonction — c'est exactement ce que `cargo miri` existe pour attraper.",
    },
    {
      kind: "editor",
      intro: `### Manipule des adresses délibérément

1. Prends \`let mut value = 42i64;\` et un \`*mut i64\` dessus. Dans un bloc \`unsafe\` avec un commentaire \`// SAFETY:\`, incrémente via le pointeur et affiche la valeur relue à travers lui. Puis affiche le binding original — même valeur.
2. Prends \`let arr = [10i64, 20, 30];\` et son \`as_ptr()\`. Affiche l'élément à l'offset \`2\` via \`add\`.
3. Construis un \`std::ptr::null::<i64>()\` et affiche \`is_null()\` — un appel safe, pas besoin de bloc.

Sortie attendue :

\`\`\`text
through raw: 43
through binding: 43
offset 2: 30
null is null: true
\`\`\``,
    },
  ],

  "rust-systems-edges-6": [
    {
      kind: "theory",
      body: `Une **ABI**, c'est la convention d'appel au niveau machine : comment les arguments sont passés, comment les valeurs sont renvoyées, comment une struct est disposée en mémoire. L'ABI propre à Rust est volontairement instable, donc passer côté C ou C++ veut dire adopter la leur.

Deux attributs s'en chargent :

\`\`\`rust
#[repr(C)]                        // dispose cette struct comme C le ferait
pub struct Point { x: i64, y: i64 }

#[no_mangle]                      // garde le nom du symbole tel qu'écrit
pub extern "C" fn point_sum(p: *const Point) -> i64
\`\`\`

Sans \`#[repr(C)]\`, Rust peut réordonner les champs pour mieux les tasser. Sans \`#[no_mangle]\`, le linker voit un symbole manglé qu'aucun appelant C ne peut trouver.`,
    },
    {
      kind: "theory",
      body: `Le dur dans le FFI, ce n'est pas la syntaxe, c'est **l'ownership qui traverse une frontière que le compilateur ne peut pas voir**.

\`\`\`rust
Box::into_raw(Box::new(Point { x, y }))   // l'ownership quitte Rust
drop(Box::from_raw(p))                    // l'ownership revient, libéré une seule fois
\`\`\`

Entre ces deux appels, rien en Rust ne suit ce pointeur. Les règles qui rendent ça survivable :

**Chaque \`into_raw\` a besoin d'exactement un \`from_raw\` correspondant.** Zéro, c'est une fuite ; deux, c'est un double free. Livre la fonction de libération avec le constructeur, et documente l'appariement.

**Libère avec le même allocateur que celui qui a alloué.** La mémoire d'un \`Box\` Rust doit revenir à Rust, jamais au \`free\` de C, et inversement.

**Ne laisse jamais un panic traverser la frontière.** Dérouler la stack à travers des frames C est un comportement indéfini ; attrape-le avec \`catch_unwind\` au bord et renvoie un code d'erreur.

**Valide tout ce qui arrive.** Un pointeur venu de C peut être null, mal aligné ou pendant — vérifie ce que tu peux, et mets le reste dans la documentation \`# Safety\` de la fonction.

En pratique, prends \`cxx\` (un pont Rust/C++ vérifié) ou \`bindgen\` (qui génère les déclarations depuis les en-têtes C) plutôt que d'écrire les déclarations à la main. Les deux éliminent les erreurs de transcription, qui sont celles qui font vraiment mal.`,
    },
    {
      kind: "quiz",
      question: "Que garantit `#[repr(C)]` ?",
      options: [
        "Les champs sont disposés dans l'ordre de déclaration avec les règles de padding de C, donc un programme C peut lire la struct",
        "La struct ne peut être utilisée que depuis du code C",
        "Chaque champ est converti en type C à l'accès",
      ],
      answer: 0,
      explain:
        "La représentation par défaut de Rust peut réordonner les champs pour réduire le padding. C'est une bonne optimisation, et une optimisation fatale si quelque chose de l'autre côté attend un layout fixe.",
    },
    {
      kind: "fill",
      prompt: "Fais sortir l'ownership d'une valeur du heap à travers la frontière.",
      file: "main.rs",
      before: "    Box::",
      after: "(Box::new(Point { x, y }))",
      choices: ["into_raw", "leak", "as_ref"],
      answer: 0,
      explain:
        "`into_raw` abandonne l'ownership et renvoie le pointeur, que `from_raw` peut récupérer plus tard. `Box::leak` abandonne aussi l'ownership mais renvoie un `&'static mut` qui ne pourra jamais être libéré.",
    },
    {
      kind: "quiz",
      question: "Pourquoi un panic ne doit-il jamais traverser une frontière FFI ?",
      options: [
        "Dérouler la stack à travers des frames C est un comportement indéfini — attrape-le au bord et renvoie un code d'erreur",
        "C ne peut pas afficher le message du panic",
        "Le panic serait avalé en silence et l'erreur perdue",
      ],
      answer: 0,
      explain:
        "Les fonctions `extern \"C\"` abortent au lieu de dérouler par défaut dans le Rust actuel, ce qui transforme l'UB en crash. Envelopper le corps dans `catch_unwind` et renvoyer un statut, c'est la version qu'un appelant peut vraiment gérer.",
    },
    {
      kind: "editor",
      intro: `### L'ownership à travers la frontière

1. \`#[repr(C)] #[derive(Debug)] pub struct Point { x: i64, y: i64 }\` — elle doit être \`pub\`, puisque les fonctions exportées la mentionnent.
2. \`#[no_mangle] pub extern "C" fn point_sum(p: *const Point) -> i64\` — renvoie \`0\` pour null, sinon \`x + y\`, avec un commentaire \`// SAFETY:\`.
3. \`point_new(x, y) -> *mut Point\` via \`Box::into_raw\`, et \`point_free(p: *mut Point)\` via \`Box::from_raw\`, avec vérification de null.
4. Dans \`main\` : construis un point \`(3, 4)\`, affiche sa somme, affiche le point lui-même via le pointeur brut, libère-le, affiche \`size_of::<Point>()\`, puis affiche \`point_sum\` d'un pointeur null.

Sortie attendue :

\`\`\`text
sum: 7
point: Point { x: 3, y: 4 }
layout size: 16
null sum: 0
\`\`\`

Un \`into_raw\`, un \`from_raw\`. Cet appariement, c'est tout le contrat.`,
    },
  ],

  "rust-systems-edges-7": [
    {
      kind: "theory",
      body: `**Un solde n'est jamais un float.** \`f64\` ne peut pas représenter \`0.1\` exactement, donc l'arithmétique accumule de l'erreur — et dans un ledger, une erreur, c'est de l'argent qui ne se réconcilie pas.

\`\`\`rust
0.1f64 + 0.2f64 == 0.3     // false
\`\`\`

La réponse universelle, c'est la **virgule fixe** : stocke la plus petite unité indivisible sous forme d'entier. Stellar compte en *stroops*, à \`10_000_000\` par XLM. La plupart des devises comptent en centimes. Pas d'arrondi, parce qu'il n'y a rien à arrondir.`,
    },
    {
      kind: "theory",
      body: `Les entiers ne perdent pas de précision en silence, mais ils **débordent** — et dans les builds release la vérification est compilée hors du binaire, donc \`i64::MAX + 1\` boucle sur \`i64::MIN\` sans prévenir. Un build debug panique ; la prod, non. Cette différence a causé de vrais incidents.

Donc sois explicite. Rust donne quatre familles, et le choix est une décision de design :

| méthode | en cas de débordement |
| --- | --- |
| \`checked_add\` | \`None\` — tu gères |
| \`saturating_add\` | bloque au maximum |
| \`wrapping_add\` | boucle |
| \`overflowing_add\` | \`(valeur, bool)\` |

**Pour l'argent, toujours \`checked_\`.** Un solde qui déborde est une erreur que l'appelant doit voir, pas une valeur à bloquer ou à faire boucler. \`checked_mul(..)?.checked_add(..)\` s'enchaîne proprement avec \`?\` dans une fonction qui renvoie \`Option\` ou \`Result\`.

\`saturating_\` convient à une métrique qui ne doit pas boucler ; \`wrapping_\` à un hash ou un numéro de séquence où boucler est le comportement voulu. Aucun des deux n'a sa place près d'un solde.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi un solde monétaire ne doit-il jamais être stocké dans un `f64` ?",
      options: [
        "La virgule flottante binaire ne peut pas représenter exactement la plupart des fractions décimales, donc l'arithmétique accumule une erreur que le ledger ne peut pas réconcilier",
        "`f64` est plus lent que `i64` sur le matériel moderne",
        "`f64` a une plage plus petite que `i64`",
      ],
      answer: 0,
      explain:
        "`f64` a en fait une plage bien plus grande. La plage n'a jamais été le problème — l'exactitude, si, et `0.1 + 0.2 != 0.3` en est la preuve en une ligne.",
    },
    {
      kind: "fill",
      prompt: "Multiplie de sorte qu'un débordement devienne une valeur que l'appelant doit gérer.",
      file: "main.rs",
      before: "xlm.",
      after: "(STROOPS_PER_XLM)?.checked_add(fraction)",
      choices: ["checked_mul", "saturating_mul", "wrapping_mul"],
      answer: 0,
      explain:
        "`saturating_mul` bloquerait en silence à `i64::MAX` — en inventant un solde que personne n'a. Pour l'argent, le débordement doit remonter jusqu'à l'appelant.",
    },
    {
      kind: "quiz",
      question:
        "Un service calcule des soldes avec un simple `+`, marche très bien en staging, puis produit un solde négatif en production. Que s'est-il passé ?",
      options: [
        "Les vérifications de débordement sont actives en debug et compilées hors du binaire en release — la même expression a paniqué en staging et a bouclé en production",
        "La base de données a renvoyé une valeur corrompue",
        "Les builds release utilisent une largeur d'entier différente",
      ],
      answer: 0,
      explain:
        "C'est pour ça que `overflow-checks = true` dans le profil release est un réglage défendable pour du code financier, et pourquoi `checked_` sur l'arithmétique elle-même est encore mieux.",
    },
    {
      kind: "editor",
      intro: `### L'argent en entiers

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

La dernière ligne, c'est la raison pour laquelle les six premières comptent.`,
    },
  ],
};
