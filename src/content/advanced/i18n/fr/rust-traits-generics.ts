import type { LessonStep } from "@/content/steps";

// FR · Traits, Generics & Dispatch.
//
// Overlay for ../../steps/rust-traits-generics.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustTraitsGenericsStepsFr: Record<string, LessonStep[]> = {
  "rust-traits-generics-1": [
    {
      kind: "theory",
      body: `Un trait est un ensemble de méthodes qu'un type promet de fournir. Ce n'est pas une classe de base : pas d'héritage, pas de champs partagés, pas de constructeur.

\`\`\`rust
trait Health {
    fn name(&self) -> String;

    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

\`name\` est obligatoire. \`status\` a une **implémentation par défaut**, écrite à partir des méthodes obligatoires — celui qui implémente l'obtient gratis et peut la surcharger.`,
    },
    {
      kind: "theory",
      body: `Le pattern *une ou deux méthodes obligatoires plus un tas de défauts* est ce qui garde la bibliothèque standard utilisable. \`Iterator\` exige exactement une méthode, \`next\`, et te donne soixante-dix et quelques adaptateurs par-dessus.

Conçois tes propres traits pareil. Garde la surface obligatoire aussi petite que l'abstraction le permet, puis construis le confort par-dessus sous forme de défauts :

\`\`\`rust
impl Health for Db {
    fn name(&self) -> String { String::from("db") }
    // status() vient gratis
}

impl Health for Rpc {
    fn name(&self) -> String { String::from("rpc") }
    fn status(&self) -> String { format!("{}: degraded", self.name()) }
}
\`\`\``,
    },
    {
      kind: "quiz",
      question:
        "Un trait a une méthode obligatoire et une méthode par défaut. Que doit écrire celui qui l'implémente ?",
      options: [
        "Seulement la méthode obligatoire — le défaut est hérité, et le surcharger est optionnel",
        "Les deux, parce qu'un impl de trait doit être exhaustif",
        "Seulement la méthode par défaut ; les méthodes obligatoires sont fournies par le compilateur",
      ],
      answer: 0,
      explain:
        "C'est exactement pour ça que les défauts existent : ils laissent un trait grandir en surface utile sans casser chaque implémenteur existant à chaque fois.",
    },
    {
      kind: "fill",
      prompt:
        "Donne au trait une méthode par défaut construite à partir de la méthode obligatoire.",
      file: "main.rs",
      before: "trait Health {\n    fn name(&self) -> String;\n\n    fn status(&self) -> String {\n        format!(\"{}: ok\", ",
      after: ")\n    }\n}",
      choices: ["self.name()", "Self::name", "name()"],
      answer: 0,
      explain:
        "Un corps par défaut peut appeler n'importe quelle autre méthode du trait via `self` — c'est ce qui le rend composable. `Self::name` sans receveur ne saurait pas à quelle instance s'adresser.",
    },
    {
      kind: "quiz",
      question: "Pourquoi Rust n'a-t-il pas d'accès aux champs à travers un trait ?",
      options: [
        "Les traits décrivent un comportement, pas un layout — les implémenteurs peuvent stocker leurs données sous des formes complètement différentes",
        "Si, il en a ; `trait T { field: u32 }` est une syntaxe valide",
        "Les champs sont accessibles, mais seulement depuis le corps des méthodes par défaut",
      ],
      answer: 0,
      explain:
        "C'est la rupture délibérée avec l'héritage. S'il te faut quelque chose qui ressemble à un accès de champ, ajoute un getter au trait — comme ça un type qui calcule cette valeur à la volée peut l'implémenter aussi.",
    },
    {
      kind: "editor",
      intro: `### Une méthode obligatoire, une par défaut

1. Définis \`trait Health\` avec \`fn name(&self) -> String\` obligatoire et un \`fn status(&self) -> String\` par défaut qui renvoie \`"<name>: ok"\`.
2. Définis les unit structs \`Db\` et \`Rpc\`.
3. \`Db\` n'implémente que \`name\` (renvoyant \`db\`). \`Rpc\` implémente \`name\` (renvoyant \`rpc\`) **et** surcharge \`status\` pour renvoyer \`"<name>: degraded"\`.
4. Affiche le status de chacun.

Sortie attendue :

\`\`\`text
db: ok
rpc: degraded
\`\`\``,
    },
  ],

  "rust-traits-generics-2": [
    {
      kind: "theory",
      body: `Un paramètre générique sans bound est presque inutile : le corps ne peut faire que ce qui marche pour *tous* les types, c'est-à-dire presque rien.

Un **bound** rachète de la capacité en restreignant l'entrée :

\`\`\`rust
fn describe_all<T: Display>(items: &[T]) -> String
\`\`\`

Maintenant le corps peut appeler \`.to_string()\`, parce que \`Display\` garantit qu'elle existe. Le bound est un contrat à double sens : l'appelant doit fournir un type \`Display\`, et en échange le corps peut compter dessus.`,
    },
    {
      kind: "theory",
      body: `\`where\` déplace les bounds sous la signature. Ce n'est pas que cosmétique — certains bounds ne peuvent tout simplement pas s'écrire inline :

\`\`\`rust
fn process<T>(items: &[T]) -> String
where
    T: Display + Clone,
    for<'a> &'a T: IntoIterator,
{ ... }
\`\`\`

La discipline à garder : **borne exactement ce que le corps utilise, et rien de plus.** Un \`T: Clone\` inutile sur une fonction qui ne clone jamais ne la rend pas plus sûre — il rejette des appelants qui avaient un type non-\`Clone\` parfaitement valable. Sur-borner, c'est la version générique de sur-annoter un lifetime.`,
    },
    {
      kind: "quiz",
      question:
        "Un helper prend `items: &[T]` et ne fait jamais que formater chaque élément. Quel bound est le bon ?",
      options: [
        "`T: Display` — le minimum dont le corps a réellement besoin",
        "`T: Display + Clone + Debug`, pour garder la fonction flexible pour l'avenir",
        "Aucun bound, et appelle `.to_string()` — elle existe sur tous les types",
      ],
      answer: 0,
      explain:
        "Ajouter des bounds n'ajoute pas de flexibilité ; ça en retire, du côté de l'appelant. Et `.to_string()` vient *de* `Display` via un blanket impl — sans le bound, cette méthode n'existe pas.",
    },
    {
      kind: "fill",
      prompt:
        "Borne le paramètre pour que le corps puisse formater chaque élément, avec une clause `where`.",
      file: "main.rs",
      before: "fn describe_all<T>(items: &[T]) -> String\nwhere\n    T: ",
      after: ",\n{",
      choices: ["Display", "ToString + Clone", "Sized"],
      answer: 0,
      explain:
        "`ToString` compilerait aussi — la std l'implémente en blanket pour tout `T: Display` — mais `Display` est le trait qui exprime la capacité, et il permet au corps d'écrire dans un buffer au lieu d'allouer une `String` par élément. Le `+ Clone` est la vraie erreur : le corps ne clone jamais.",
    },
    {
      kind: "quiz",
      question: "Que signifie `impl Trait` en position d'argument ?",
      options: [
        "C'est un raccourci pour un paramètre générique anonyme — `fn f(x: impl Display)` est `fn f<T: Display>(x: T)`",
        "Ça crée un trait object, en mettant l'argument dans une box au runtime",
        "Ça veut dire que l'argument doit être exactement l'unique implémenteur de ce trait",
      ],
      answer: 0,
      explain:
        "La seule vraie différence : avec `impl Trait` le type n'a pas de nom, donc l'appelant ne peut pas le passer en turbofish. Tout le reste — monomorphization, dispatch statique — est identique.",
    },
    {
      kind: "editor",
      intro: `### Borne exactement ce que tu utilises

Écris \`fn describe_all<T>(items: &[T]) -> String\` avec une clause \`where T: Display\`, en joignant chaque élément avec \`", "\`.

Appelle-la deux fois dans \`main\` : une fois avec \`&[1, 2, 3]\`, une fois avec \`&["a", "b"]\`.

Sortie attendue :

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

Importe \`std::fmt::Display\`. Construis la string avec \`push_str\`, pas avec \`join\` — le but est de voir le bound à l'œuvre.`,
    },
  ],

  "rust-traits-generics-3": [
    {
      kind: "theory",
      body: `Les deux permettent à un trait d'être générique sur un type. Ils ne veulent pas dire la même chose :

\`\`\`rust
trait Source      { type Item;    fn next_item(&mut self) -> Option<Self::Item>; }
trait Source<T>   {               fn next_item(&mut self) -> Option<T>; }
\`\`\`

Avec un **associated type**, un type implémente \`Source\` **une fois**, et choisit \`Item\` dans le cadre de cette unique implémentation.

Avec un **paramètre générique**, un type peut implémenter \`Source<u32>\`, \`Source<String>\`, \`Source<Frame>\` — autant de fois qu'il veut.`,
    },
    {
      kind: "theory",
      body: `Cette différence décide lequel tu veux, et il y a un test propre : **y a-t-il exactement une réponse sensée par type implémenteur ?**

\`Iterator\` utilise un associated type parce qu'un \`Counter\` produit une seule sorte de chose. Si \`Item\` était un paramètre générique, \`counter.next()\` serait ambigu à chaque call site et tu écrirais du turbofish à vie.

\`From\` utilise un paramètre générique pour la raison inverse : un type doit légitimement convertir *depuis* plein d'autres, et \`impl From<u8> for Wide\` à côté de \`impl From<u16> for Wide\` est exactement ce qu'il faut.

Les associated types se lisent aussi mieux en aval : \`fn drain<S: Source>(s: S) -> Vec<S::Item>\` nomme la sortie sans second paramètre.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `Iterator` utilise-t-il `type Item` plutôt que `trait Iterator<T>` ?",
      options: [
        "Un itérateur donné produit exactement une sorte d'élément, donc un second impl ne ferait que créer de l'ambiguïté à chaque call site",
        "Les associated types compilent plus vite que les paramètres génériques",
        "Les paramètres génériques ne sont pas autorisés sur les traits de la bibliothèque standard",
      ],
      answer: 0,
      explain:
        "Teste le contrefactuel : avec `Iterator<T>`, `v.iter().next()` ne pourrait pas inférer `T` et chaque appel aurait besoin d'une annotation. L'associated type rend la réponse unique.",
    },
    {
      kind: "fill",
      prompt:
        "Nomme le type de sortie dans une signature en aval sans ajouter un second paramètre.",
      file: "main.rs",
      before: "fn drain<S: Source>(mut s: S) -> Vec<",
      after: "> {",
      choices: ["S::Item", "S", "Source::Item"],
      answer: 0,
      explain:
        "`S::Item` est l'associated type projeté depuis le `S` concret. `Source::Item` n'a pas de `Self` d'où projeter, donc le compilateur ne peut pas le résoudre.",
    },
    {
      kind: "quiz",
      question:
        "Tu conçois un trait `Converter` et un type doit convertir depuis `u8`, `u16` et `u32`. Quelle forme convient ?",
      options: [
        "Un paramètre générique — le type a besoin de trois impls séparés, un par source",
        "Un associated type, avec un enum couvrant les trois",
        "L'un ou l'autre ; les deux sont interchangeables dans tous les cas",
      ],
      answer: 0,
      explain:
        "Plusieurs impls par type, c'est précisément ce qu'un paramètre générique autorise et qu'un associated type interdit. C'est la même raison pour laquelle `From<T>` est générique.",
    },
    {
      kind: "editor",
      intro: `### Une réponse par type

1. Définis \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`.
2. Définis \`struct Counter { n: u32 }\` et implémente \`Source\` avec \`type Item = u32\`, en produisant \`1\`, \`2\`, \`3\` puis \`None\`.
3. Écris \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` qui collecte tout ce que la source produit.
4. Affiche le vecteur drainé avec \`{:?}\`.

Sortie attendue :

\`\`\`text
items: [1, 2, 3]
\`\`\``,
    },
  ],

  "rust-traits-generics-4": [
    {
      kind: "theory",
      body: `Une fonction générique n'est pas une seule fonction. Le compilateur la **monomorphise** : pour chaque type concret avec lequel elle est appelée, il tamponne une copie spécialisée séparée.

\`\`\`rust
fn emit<T: Debug>(label: &str, value: T) { ... }

emit("count", 42u32);        // émet emit::<u32>
emit("name", "rpc");         // émet emit::<&str>
emit("flags", vec![true]);   // émet emit::<Vec<bool>>
\`\`\`

Trois call sites, trois vraies fonctions dans le binaire. Chacune connaît son type concret, donc chaque appel de méthode à l'intérieur est un **appel direct** — aucune indirection, entièrement inlinable.`,
    },
    {
      kind: "theory",
      body: `C'est ça que « abstraction à coût zéro » veut dire ici : la version générique compile vers les mêmes instructions que tu aurais écrites à la main.

Les coûts sont réels mais se déplacent ailleurs :

- **Taille du binaire.** Chaque instanciation est du code dupliqué. Une bibliothèque très générique appelée avec vingt types produit vingt copies.
- **Temps de compilation.** C'est la plus grosse raison isolée pour laquelle les builds Rust sont lents.

Le deal vaut presque toujours le coup dans un hot path, et souvent pas pour un registre de plugins ou une collection hétérogène — c'est à ça que servent les trait objects.`,
    },
    {
      kind: "quiz",
      question:
        "Une fonction générique est appelée avec trois types concrets différents. Combien de copies y a-t-il dans le binaire ?",
      options: [
        "Trois — une instanciation spécialisée par type concret utilisé",
        "Une, avec le type passé en argument caché au runtime",
        "Une, plus une vtable par type",
      ],
      answer: 0,
      explain:
        "Les instanciations sont générées à la demande : un generic jamais appelé n'est jamais compilé du tout, et c'est pour ça qu'un helper générique inutilisé ne coûte rien.",
    },
    {
      kind: "fill",
      prompt: "Borne la valeur pour qu'elle puisse être affichée avec le formateur `{:?}`.",
      file: "main.rs",
      before: "fn emit<T: ",
      after: ">(label: &str, value: T) {",
      choices: ["Debug", "Display", "Sized"],
      answer: 0,
      explain:
        "`{:?}` c'est `Debug` ; `{}` c'est `Display`. Ce sont des traits séparés exprès — `Debug` est pour les devs et peut être dérivé, `Display` est pour les utilisateurs et ne l'est jamais.",
    },
    {
      kind: "quiz",
      question:
        "Quand le dispatch dynamique est-il le meilleur choix malgré l'appel indirect ?",
      options: [
        "Quand tu as besoin d'une collection hétérogène, ou que tu veux empêcher la taille du code de grossir avec le nombre d'implémenteurs",
        "Dès que la fonction est appelée plus d'une fois",
        "Dès que le trait a plus d'une méthode",
      ],
      answer: 0,
      explain:
        "`Vec<Box<dyn Check>>` n'a pas d'équivalent générique — un `Vec<T>` contient un seul type. C'est le cas où les trait objects ne sont pas un compromis mais la seule option.",
    },
    {
      kind: "editor",
      intro: `### Trois call sites, trois fonctions

Écris \`fn emit<T: Debug>(label: &str, value: T)\` qui affiche \`"<label>: <value:?>"\`.

Appelle-la trois fois : avec \`42u32\`, avec \`"rpc"\`, et avec \`vec![true, false]\`.

Sortie attendue :

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Note les guillemets autour de \`rpc\` — c'est \`Debug\`, pas \`Display\`, et la différence est tout l'intérêt.`,
    },
  ],

  "rust-traits-generics-5": [
    {
      kind: "theory",
      body: `Un generic te donne un type par instanciation. Quand tu as besoin de **plusieurs types différents dans une même collection**, il te faut un trait object :

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` n'est pas un type de taille connue, donc il apparaît toujours derrière un pointeur — \`Box<dyn Check>\`, \`&dyn Check\`, \`Arc<dyn Check>\`. Ce pointeur est **gros** (fat pointer) : deux mots, un vers les données et un vers la vtable.`,
    },
    {
      kind: "theory",
      body: `La vtable est une petite table statique, une par paire (type, trait), qui contient un pointeur de fonction par méthode plus la taille et le drop glue.

Appeler \`c.run()\` sur un \`&dyn Check\` veut donc dire : charger le pointeur de vtable, charger le slot de \`run\`, appeler à travers. Le coût, c'est une indirection en plus et — la partie qui compte vraiment dans une boucle chaude — **l'appel ne peut pas être inliné**, parce que la cible est inconnue jusqu'au runtime.

Pour un registre de health checks invoqué une fois par seconde, ce coût est immesurable et la flexibilité vaut tout. Pour un comparateur appelé un million de fois dans un tri, c'est la différence que tu cherchais.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `&dyn Check` fait-il deux mots de large alors que `&Ping` n'en fait qu'un ?",
      options: [
        "Il porte un pointeur vers les données *et* un pointeur vers la vtable de ce type concret",
        "Il stocke les données inline, donc la taille varie selon l'implémenteur",
        "Il porte un compteur de références à côté du pointeur de données",
      ],
      answer: 0,
      explain:
        "C'est pour ça que tu ne peux pas recaster un `&dyn Trait` en `&T` gratuitement, et que `Box<dyn Trait>` sait quel destructeur appeler : les deux infos vivent dans la vtable.",
    },
    {
      kind: "fill",
      prompt: "Stocke deux types concrets différents dans une même collection.",
      file: "main.rs",
      before: "let checks: Vec<",
      after: "> = vec![Box::new(Ping), Box::new(Disk)];",
      choices: ["Box<dyn Check>", "dyn Check", "Check"],
      answer: 0,
      explain:
        "`Vec<dyn Check>` ne compile pas : `Vec` exige un élément `Sized`, et `dyn Check` n'a pas de taille connue à la compilation. C'est le `Box` qui lui en donne une.",
    },
    {
      kind: "quiz",
      question:
        "Le vrai coût du dispatch dynamique dans une boucle serrée n'est généralement pas le chargement de pointeur en plus. C'est quoi ?",
      options: [
        "L'appel ne peut pas être inliné, ce qui bloque aussi les optimisations que l'inlining aurait permises",
        "Chaque appel alloue une nouvelle vtable sur le heap",
        "Le lookup de la vtable exige un lock, donc les appels concurrents se disputent",
      ],
      answer: 0,
      explain:
        "Les vtables sont des données statiques, allouées une fois à la compilation — jamais par appel. La barrière d'optimisation est le coût honnête, et il est facile à sous-estimer.",
    },
    {
      kind: "editor",
      intro: `### Un registre hétérogène

1. Définis \`trait Check { fn run(&self) -> String; }\`.
2. Définis les unit structs \`Ping\` et \`Disk\` qui l'implémentent, en renvoyant \`ping ok\` et \`disk ok\`.
3. Construis un \`Vec<Box<dyn Check>>\` qui contient un de chaque, itère dessus en affichant chaque résultat, puis affiche le compte.

Sortie attendue :

\`\`\`text
ping ok
disk ok
count: 2
\`\`\``,
    },
  ],

  "rust-traits-generics-6": [
    {
      kind: "theory",
      body: `Tous les traits ne peuvent pas devenir un \`dyn Trait\`. Un trait est **object safe** seulement si chaque méthode peut être appelée via une vtable — c'est-à-dire en ne sachant rien du type concret à part son adresse.

Deux règles causent presque tous les échecs réels :

1. **Pas de méthodes génériques.** \`fn build<T: Encode>(&self, v: T)\` aurait besoin d'un slot de vtable par \`T\` possible, et l'ensemble est non borné.
2. **Pas de \`Self\` en position de retour.** \`fn clone_me(&self) -> Self\` ne peut pas marcher : l'appelant n'a aucune idée de ce qu'est \`Self\` ni de sa taille.`,
    },
    {
      kind: "theory",
      body: `Les deux ont le même fix : remplacer le trou de compilation par un trou de runtime.

\`\`\`rust
trait Sink { fn accept<T: Encode>(&self, v: T) -> String; }   // pas object safe
trait Sink { fn accept(&self, v: &dyn Encode) -> String; }    // object safe
\`\`\`

Tu as échangé une indirection contre la possibilité même de stocker un \`Box<dyn Sink>\` — en général le bon deal, puisqu'un trait que tu veux comme objet est un trait que tu voulais pour sa flexibilité.

Quand il te faut les deux, le pattern standard c'est deux traits : un générique pour le fast path, et un object safe implémenté en blanket par-dessus.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi une méthode générique rend-elle un trait non object safe ?",
      options: [
        "Une vtable est une table fixe construite à la compilation, et une méthode générique aurait besoin d'un nombre non borné de slots",
        "Les méthodes génériques ne peuvent pas prendre `&self`",
        "Le compilateur pourrait le supporter mais l'interdit pour garder les vtables petites",
      ],
      answer: 0,
      explain:
        "La vtable est construite par paire (type, trait) au moment où le trait object est créé. Elle ne peut pas savoir de quelles instanciations un appelant futur aura besoin.",
    },
    {
      kind: "fill",
      prompt:
        "Rends la méthode object safe : prends la valeur comme trait object au lieu d'un generic.",
      file: "main.rs",
      before: "trait Sink {\n    fn accept(&self, value: ",
      after: ") -> String;\n}",
      choices: ["&dyn Encode", "impl Encode", "T"],
      answer: 0,
      explain:
        "`impl Encode` en position d'argument est du sucre pour un paramètre générique, donc il échoue à l'object safety pour exactement la même raison que le generic explicite.",
    },
    {
      kind: "quiz",
      question:
        "`Clone` n'est pas object safe. Laquelle de ses exigences en est responsable ?",
      options: [
        "`fn clone(&self) -> Self` renvoie `Self` par valeur, et l'appelant ne peut pas connaître la taille de ce type",
        "`Clone` est implémenté par trop de types pour qu'une seule vtable les énumère",
        "`clone` prend `&self`, et les méthodes object safe doivent prendre `self`",
      ],
      answer: 0,
      explain:
        "C'est pour ça qu'un `Box<dyn Trait>` ne peut pas simplement être cloné, et que les crates qui contournent ça définissent un `fn clone_box(&self) -> Box<dyn Trait>` — un type de retour de taille connue.",
    },
    {
      kind: "editor",
      intro: `### Garde le trait utilisable comme objet

1. Définis \`trait Encode { fn encode(&self) -> String; }\`.
2. Définis \`struct Num(i64)\` qui l'implémente comme le texte décimal du nombre.
3. Définis \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — note le \`&dyn\`, c'est ce qui le garde object safe.
4. Définis la unit struct \`Log\` qui implémente \`Sink\`, en renvoyant \`"log:<encoded>"\`.
5. Dans \`main\`, stocke-la comme \`Box<dyn Sink>\` et fais-lui accepter un \`Num(42)\`.

Sortie attendue :

\`\`\`text
log:42
\`\`\`

Si \`accept\` avait été générique, l'étape 5 ne compilerait pas.`,
    },
  ],

  "rust-traits-generics-7": [
    {
      kind: "theory",
      body: `Un **blanket impl** implémente un trait pour tout type qui satisfait un bound, en un seul bloc :

\`\`\`rust
impl<T: Display> Loggable for T {
    fn log_line(&self) -> String {
        format!("[log] {}", self)
    }
}
\`\`\`

Maintenant \`42.log_line()\` et \`"rpc down".log_line()\` marchent tous les deux, et tout type que quiconque écrira un jour en implémentant \`Display\` aussi.

La bibliothèque standard s'en sert massivement. \`ToString\` est un blanket impl sur \`Display\` ; \`Into<U>\` est un blanket impl sur \`From<T>\`. C'est pour ça qu'implémenter \`From\` te donne \`Into\` gratis et que tu ne dois jamais implémenter \`Into\` à la main.`,
    },
    {
      kind: "theory",
      body: `L'**orphan rule** est la limite : tu ne peux implémenter un trait pour un type que si tu possèdes le trait, ou si tu possèdes le type. Les deux étrangers, c'est interdit.

\`\`\`rust
impl Display for Vec<u8> { ... }   // interdit : les deux sont à la std
\`\`\`

La raison, c'est la cohérence. Si deux crates pouvaient chacun ajouter cet impl, ajouter une dépendance pourrait changer lequel s'applique — ou rendre le programme ambigu et l'empêcher de compiler pour des raisons qui ne sont dans aucun des deux.

Le contournement, c'est le newtype : \`struct Bytes(Vec<u8>);\` est *ton* type, donc tu peux tout implémenter dessus. Ça ne coûte rien au runtime — une tuple struct à un seul champ a exactement le même layout que son champ.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi tu ne peux pas faire `impl Display for Vec<u8>` dans ton propre crate ?",
      options: [
        "L'orphan rule : le trait et le type sont tous les deux étrangers, donc deux crates pourraient ajouter des impls en conflit",
        "`Vec<u8>` implémente déjà `Display` dans la bibliothèque standard",
        "Les blanket impls de `std` réclament tous les types à l'avance",
      ],
      answer: 0,
      explain:
        "La cohérence est une propriété globale. Sans la règle, le fait que ton programme compile ou non pourrait dépendre d'une dépendance transitive que tu n'as jamais nommée.",
    },
    {
      kind: "fill",
      prompt:
        "Implémente ton trait pour tout type qui peut déjà être affiché.",
      file: "main.rs",
      before: "impl<T: Display> Loggable for ",
      after: " {",
      choices: ["T", "dyn Display", "Self"],
      answer: 0,
      explain:
        "`for T` avec le bound sur les generics de l'impl, c'est la forme blanket. `for dyn Display` ne couvrirait que le trait object, pas les types concrets.",
    },
    {
      kind: "quiz",
      question:
        "Il te faut `serde::Serialize` sur un type venant d'un autre crate. C'est quoi le move standard ?",
      options: [
        "L'envelopper dans un newtype à toi et implémenter le trait dessus",
        "Forker l'autre crate et y ajouter l'impl",
        "L'implémenter quand même — l'orphan rule ne s'applique qu'à `std`",
      ],
      answer: 0,
      explain:
        "Le newtype est gratuit au runtime et local en scope. (Serde propose aussi `#[serde(remote)]` exactement pour ce cas, qui génère pour toi le code en forme de newtype.)",
    },
    {
      kind: "editor",
      intro: `### Un impl, tous les types Display

1. Définis \`trait Loggable { fn log_line(&self) -> String; }\`.
2. Écris un blanket \`impl<T: Display> Loggable for T\` qui renvoie \`"[log] <value>"\`.
3. Appelle \`.log_line()\` sur l'entier \`42\` et sur la string \`"rpc down"\` — deux types, zéro impl en plus.

Sortie attendue :

\`\`\`text
[log] 42
[log] rpc down
\`\`\``,
    },
  ],
};
