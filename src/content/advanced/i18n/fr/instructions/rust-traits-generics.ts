// FR · editor instructions — Traits, Generics & Dispatch.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-traits-generics.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustTraitsGenericsInstructionsFr: Record<string, { instructions: string }> = {
  "rust-traits-generics-1": {
    instructions: `## Une méthode obligatoire, une par défaut

Un trait peut fournir des corps de méthode par défaut écrits à partir de ses méthodes obligatoires. Les implémenteurs les obtiennent gratis et peuvent les surcharger.

\`\`\`rust
trait Health {
    fn name(&self) -> String;
    fn status(&self) -> String {
        format!("{}: ok", self.name())
    }
}
\`\`\`

### Ta tâche

1. Définis \`Health\` comme ci-dessus.
2. Définis les unit structs \`Db\` et \`Rpc\`.
3. \`Db\` n'implémente que \`name\`, en renvoyant \`db\`.
4. \`Rpc\` implémente \`name\` (renvoyant \`rpc\`) **et** surcharge \`status\` pour renvoyer \`"<name>: degraded"\`.
5. Affiche les deux status.

Sortie attendue :

\`\`\`text
db: ok
rpc: degraded
\`\`\`

### Indices

- Une unit struct s'écrit \`struct Db;\` et s'utilise comme la valeur \`Db\`.
- \`format!\` construit une \`String\` de la même façon que \`println!\` construit une ligne.
`,
  },

  "rust-traits-generics-2": {
    instructions: `## Borne exactement ce que tu utilises

Un bound est un contrat à double sens : l'appelant doit fournir un type qui le satisfait, et en échange le corps peut compter dessus.

Borne le **minimum** dont le corps a besoin. Un \`T: Clone\` inutile sur une fonction qui ne clone jamais n'ajoute aucune sûreté — il rejette des appelants qui avaient un type non-\`Clone\` parfaitement valable.

### Ta tâche

Écris \`fn describe_all<T>(items: &[T]) -> String\` avec une clause \`where T: Display\`, en joignant chaque élément avec \`", "\`.

Appelle-la avec \`&[1, 2, 3]\` et avec \`&["a", "b"]\`.

Sortie attendue :

\`\`\`text
nums: 1, 2, 3
strs: a, b
\`\`\`

### Indices

- \`use std::fmt::Display;\`
- Construis le résultat avec \`push_str\`, pas avec \`join\` — le but est de voir le bound à l'œuvre.
- \`.iter().enumerate()\` te donne l'index, pour sauter le séparateur sur le premier élément.
`,
  },

  "rust-traits-generics-3": {
    instructions: `## Une réponse par type

Un **associated type** est choisi une fois, dans l'unique impl d'un type donné. Un **paramètre générique** autorise plusieurs impls par type.

Le test : *y a-t-il exactement une réponse sensée par type implémenteur ?* \`Iterator::Item\` est associé parce qu'un compteur produit une seule sorte de chose. \`From<T>\` est générique parce qu'un type doit pouvoir convertir depuis plusieurs.

### Ta tâche

1. \`trait Source { type Item; fn next_item(&mut self) -> Option<Self::Item>; }\`
2. \`struct Counter { n: u32 }\` qui implémente \`Source\` avec \`type Item = u32;\` et \`fn next_item(&mut self) -> Option<u32>\` — le type résolu, pas \`Option<Self::Item>\` — en produisant \`1\`, \`2\`, \`3\`, puis \`None\`.
3. \`fn drain<S: Source>(mut s: S) -> Vec<S::Item>\` qui collecte tout ce que la source produit.
4. Affiche le vecteur drainé avec \`{:?}\`.

Sortie attendue :

\`\`\`text
items: [1, 2, 3]
\`\`\`

### Indices

- \`while let Some(item) = s.next_item()\` le draine proprement.
- Note \`Vec<S::Item>\` — l'associated type projeté depuis le \`S\` concret.
`,
  },

  "rust-traits-generics-4": {
    instructions: `## Trois call sites, trois fonctions

Le compilateur **monomorphise** un generic : il tamponne une copie spécialisée par type concret avec lequel il est appelé. Chaque copie connaît son type, donc chaque appel à l'intérieur est direct et inlinable — c'est ça que « coût zéro » veut dire ici.

Les coûts se déplacent vers la taille du binaire et le temps de compilation.

### Ta tâche

Écris \`fn emit<T: Debug>(label: &str, value: T)\` qui affiche \`"<label>: <value:?>"\`.

Appelle-la avec \`42u32\`, avec \`"rpc"\`, et avec \`vec![true, false]\` — trois instanciations.

Sortie attendue :

\`\`\`text
count: 42
name: "rpc"
flags: [true, false]
\`\`\`

Note les guillemets autour de \`rpc\` : c'est le formatage \`Debug\`, pas \`Display\`, et la différence est tout l'intérêt.

### Indices

- \`use std::fmt::Debug;\`
- Le formateur est \`{:?}\`.
`,
  },

  "rust-traits-generics-5": {
    instructions: `## Un registre hétérogène

Un \`Vec<T>\` contient un seul type. Quand il t'en faut plusieurs, il te faut un trait object :

\`\`\`rust
let checks: Vec<Box<dyn Check>> = vec![Box::new(Ping), Box::new(Disk)];
\`\`\`

\`dyn Check\` n'a pas de taille connue à la compilation, donc il vit toujours derrière un pointeur — et ce pointeur est **gros** (fat pointer) : un mot vers les données, un vers la vtable.

### Ta tâche

1. \`trait Check { fn run(&self) -> String; }\`
2. Les unit structs \`Ping\` et \`Disk\` qui l'implémentent, en renvoyant \`ping ok\` et \`disk ok\`.
3. Construis un \`Vec<Box<dyn Check>>\` qui contient un de chaque, itère en affichant chaque résultat, puis affiche le compte.

Sortie attendue :

\`\`\`text
ping ok
disk ok
count: 2
\`\`\`

### Indices

- Itère avec \`for c in &checks\` pour que le vecteur ne soit pas consommé avant \`.len()\`.
`,
  },

  "rust-traits-generics-6": {
    instructions: `## Garde le trait utilisable comme objet

Un trait est **object safe** seulement si chaque méthode peut être dispatchée via une vtable. Deux règles causent presque tous les échecs réels :

1. **Pas de méthodes génériques** — une vtable est une table fixe, et un generic aurait besoin d'un nombre non borné de slots.
2. **Pas de \`Self\` en position de retour** — l'appelant ne peut pas connaître la taille de ce type.

Le fix pour les deux : déplacer le trou de la compilation vers le runtime, en prenant \`&dyn Trait\` au lieu d'un generic.

### Ta tâche

1. \`trait Encode { fn encode(&self) -> String; }\`
2. \`struct Num(i64)\` qui l'implémente comme le texte décimal du nombre.
3. \`trait Sink { fn accept(&self, value: &dyn Encode) -> String; }\` — le \`&dyn\` est ce qui le garde object safe.
4. La unit struct \`Log\` qui implémente \`Sink\`, en renvoyant \`"log:<encoded>"\`.
5. Stocke-la comme \`Box<dyn Sink>\` et fais-lui accepter un \`Num(42)\`.

Sortie attendue :

\`\`\`text
log:42
\`\`\`

Si \`accept\` avait été générique, l'étape 5 ne compilerait pas.
`,
  },

  "rust-traits-generics-7": {
    instructions: `## Un impl, tous les types Display

Un **blanket impl** couvre d'un coup tous les types qui satisfont un bound :

\`\`\`rust
impl<T: Display> Loggable for T { ... }
\`\`\`

La bibliothèque standard s'appuie dessus : \`ToString\` est un blanket impl sur \`Display\`, et \`Into<U>\` sur \`From<T>\` — c'est pour ça que tu implémentes \`From\` et que tu obtiens \`Into\` gratis.

L'**orphan rule** est la limite : tu ne peux implémenter un trait pour un type que si tu possèdes le trait ou si tu possèdes le type. Le contournement, c'est un newtype, qui ne coûte rien au runtime.

### Ta tâche

1. \`trait Loggable { fn log_line(&self) -> String; }\`
2. Un blanket \`impl<T: Display> Loggable for T\` qui renvoie \`"[log] <value>"\`.
3. Appelle \`.log_line()\` sur \`42\` et sur \`"rpc down"\` — deux types, zéro impl en plus.

Sortie attendue :

\`\`\`text
[log] 42
[log] rpc down
\`\`\`
`,
  },
};
