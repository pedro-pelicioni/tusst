import type { LessonStep } from "@/content/steps";

// FR · Lifetimes.
//
// Overlay for ../../steps/rust-lifetimes.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustLifetimesStepsFr: Record<string, LessonStep[]> = {
  "rust-lifetimes-1": [
    {
      kind: "theory",
      body: `Une annotation de lifetime ne fait rien vivre plus longtemps. C'est une **contrainte que l'appelant doit satisfaire**, et le compilateur la vérifie à chaque call site.

\`\`\`rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str
\`\`\`

Lis-la comme une phrase sur l'appelant, pas sur la fonction : *« donne-moi deux références, et je t'en rends une qui reste valide tant que les deux entrées le sont. »*

Rien n'est alloué. Rien n'est prolongé. \`'a\` est juste un nom pour une région de code, inventé pour pouvoir lier la valeur de retour à un argument.`,
    },
    {
      kind: "theory",
      body: `La mauvaise lecture classique, c'est de croire que \`'a\` sur les deux paramètres oblige les deux arguments à vivre *aussi longtemps* l'un que l'autre. Non.

Quand la fonction est appelée avec des références de lifetimes différents, le compilateur choisit pour \`'a\` le **plus court** des deux — et chaque slot \`'a\` est alors satisfait, parce qu'une référence qui vit plus longtemps est toujours utilisable là où on en demande une qui vit moins.

\`\`\`rust
let long = String::from("soroban");
{
    let short = String::from("rpc");
    let winner = longest(&long, &short);
    println!("{winner}");     // ok — 'a est la portée interne
}
// \`winner\` ne peut pas s'échapper de ce bloc : 'a s'est terminé avec \`short\`
\`\`\`

Le résultat n'est contraint que par la région choisie par le compilateur — c'est pour ça que ça compile dans le bloc et que c'est rejeté en dehors.`,
    },
    {
      kind: "quiz",
      question:
        "`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str` est appelée avec une référence qui vit pendant tout le programme et une autre qui vit trois lignes. Qu'est-ce que `'a` ?",
      options: [
        "La plus courte des deux régions — et la référence renvoyée n'est valide qu'à l'intérieur",
        "La plus longue des deux, parce que `'a` doit couvrir les deux arguments",
        "C'est une erreur de compilation : les deux arguments doivent avoir le même lifetime",
      ],
      answer: 0,
      explain:
        "Les lifetimes se comportent comme du sous-typage : un `&'long T` se coerce en `&'short T`. Le compilateur choisit la plus grande région où toutes les contraintes tiennent, c'est-à-dire l'intersection — la plus courte.",
    },
    {
      kind: "fill",
      prompt:
        "Lie la valeur de retour aux entrées pour que l'appelant sache combien de temps elle reste valide.",
      file: "main.rs",
      before: "fn longest<'a>(a: &'a str, b: &'a str) -> ",
      after: " {",
      choices: ["&'a str", "&str", "String"],
      answer: 0,
      explain:
        "`&str` tout seul ne compile pas ici : avec deux références en entrée, le compilateur ne peut pas deviner à laquelle la sortie emprunte. `String` compilerait, mais force une allocation dont la fonction n'a pas besoin.",
    },
    {
      kind: "quiz",
      question:
        "Que coûte réellement `<'a>` dans une signature de fonction, à l'exécution ?",
      options: [
        "Rien. Les lifetimes sont effacés après le borrow checking et n'émettent aucun code",
        "Un mot machine de plus par référence, pour transporter le tag de région",
        "Une vérification de bornes à chaque déréférencement de la référence annotée",
      ],
      answer: 0,
      explain:
        "Les lifetimes n'existent que pendant la compilation. C'est pour ça que le borrow checker peut être strict gratuitement — il n'y a aucune représentation à l'exécution à payer.",
    },
    {
      kind: "editor",
      intro: `### Lie une sortie à ses entrées

Écris \`fn longest<'a>(a: &'a str, b: &'a str) -> &'a str\` qui renvoie l'argument le plus long (renvoie \`a\` en cas d'égalité).

Dans \`main\`, appelle-la avec une \`&String\` contenant \`soroban\` et le littéral \`"rpc"\`, et affiche le gagnant.

Sortie attendue :

\`\`\`text
longest: soroban
\`\`\``,
    },
  ],

  "rust-lifetimes-2": [
    {
      kind: "theory",
      body: `La plupart des signatures n'ont besoin d'aucune annotation, parce que trois **règles d'élision** les remplissent. Les connaître te dit exactement quand tu dois en écrire une toi-même.

1. Chaque lifetime d'entrée élidé reçoit son propre paramètre distinct.
2. S'il y a **exactement un** lifetime d'entrée, il est assigné à chaque lifetime de sortie élidé.
3. Si l'une des entrées est \`&self\` ou \`&mut self\`, c'est **le sien** qui est assigné à chaque lifetime de sortie élidé.

\`\`\`rust
fn first_word(s: &str) -> &str        // règle 2 — une entrée, pas d'ambiguïté
fn rest(&self) -> &str                // règle 3 — la sortie emprunte à self
\`\`\``,
    },
    {
      kind: "theory",
      body: `Les règles sont volontairement bêtes : elles ne devinent jamais. Quand deux références d'entrée pourraient plausiblement être la source de la sortie, l'élision abandonne tout simplement et tu reçois une erreur qui réclame une annotation.

\`\`\`rust
fn pick(a: &str, b: &str) -> &str     // erreur : missing lifetime specifier
\`\`\`

Cette erreur, ce n'est pas le compilateur qui fait des manières. \`a\` et \`b\` peuvent avoir des lifetimes complètement différents, et la réponse change ce que l'appelant a le droit de faire du résultat. Toi seul sais de laquelle vient la sortie — donc toi seul peux l'écrire.`,
    },
    {
      kind: "quiz",
      question:
        "`fn head(&self, other: &str) -> &str` compile sans annotation. Quel lifetime reçoit le `&str` renvoyé ?",
      options: [
        "Celui de `self` — la règle 3 l'emporte dès qu'une méthode a un receveur `&self`",
        "Celui de `other`, parce que c'est la dernière référence de la liste de paramètres",
        "Le plus court entre `self` et `other`, choisi à chaque call site",
      ],
      answer: 0,
      explain:
        "La règle 3 existe précisément parce que les méthodes qui renvoient une vue sur `self` sont de très loin le cas le plus courant. Si tu voulais vraiment renvoyer un borrow de `other`, tu dois annoter — sinon l'élision te donne silencieusement la mauvaise chose, et l'erreur apparaît au call site.",
    },
    {
      kind: "fill",
      prompt:
        "Cette méthode renvoie une vue sur le buffer de la struct elle-même. Complète l'en-tête de l'impl.",
      file: "main.rs",
      before: "struct Parser<'a> { input: &'a str }\n\nimpl",
      after: " Parser<'a> {\n    fn rest(&self) -> &str { self.input }\n}",
      choices: ["<'a>", "<'static>", ""],
      answer: 0,
      explain:
        "Une struct avec un paramètre de lifetime doit aussi le déclarer sur le bloc impl — `impl<'a> Parser<'a>`. À l'intérieur du bloc, `rest` n'a besoin d'aucune annotation : la règle 3 couvre.",
    },
    {
      kind: "quiz",
      question: "Quand l'élision t'oblige-t-elle à écrire un lifetime explicite ?",
      options: [
        "Quand il y a deux références d'entrée ou plus, pas de `&self`, et que la fonction renvoie une référence",
        "Dès que la fonction renvoie une référence",
        "Dès que la fonction a plus d'un paramètre",
      ],
      answer: 0,
      explain:
        "Les trois conditions doivent tenir ensemble. Une seule référence d'entrée est couverte par la règle 2, un receveur `&self` par la règle 3, et renvoyer une valeur possédée ne demande aucun lifetime.",
    },
    {
      kind: "editor",
      intro: `### Laisse l'élision faire son boulot

1. Écris \`fn first_word(s: &str) -> &str\` qui renvoie tout ce qui précède le premier espace (la string entière s'il n'y en a pas). Aucune annotation — la règle 2 couvre.
2. Définis \`struct Parser<'a> { input: &'a str }\` avec \`impl<'a> Parser<'a>\` et une méthode \`rest(&self) -> &str\` qui renvoie \`self.input\`.
3. Affiche \`first_word("submit tx now")\`, puis \`rest()\` sur un parser construit sur \`"ledger 42"\`.

Sortie attendue :

\`\`\`text
word: submit
rest: ledger 42
\`\`\``,
    },
  ],

  "rust-lifetimes-3": [
    {
      kind: "theory",
      body: `Quand deux entrées ont des lifetimes vraiment sans rapport, donne-leur des noms séparés. Celui qui compte, c'est celui de la **sortie**.

\`\`\`rust
fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str
\`\`\`

Ça dit quelque chose de précis et d'utile : le résultat emprunte à \`text\` et **pas** à \`sep\`. L'appelant peut donc drop \`sep\` immédiatement et continuer à utiliser le résultat.

Tout rabattre sur \`'a\` compilerait aussi — et lierait silencieusement le résultat à \`sep\` en plus, forçant l'appelant à garder en vie quelque chose à quoi la fonction n'a jamais rien emprunté.`,
    },
    {
      kind: "theory",
      body: `C'est ça, le vrai coût de la sur-annotation : elle ne rend pas la fonction fausse, elle la rend **inutilement restrictive**, et la restriction est subie par chaque appelant.

\`\`\`rust
let cut = {
    let sep = String::from(":");
    prefix(&text, &sep)      // \`sep\` meurt à l'accolade fermante
};
println!("{cut}");           // toujours ok — \`cut\` n'emprunte qu'à \`text\`
\`\`\`

Avec \`fn prefix<'a>(text: &'a str, sep: &'a str) -> &'a str\`, ce code exact cesse de compiler, pour une raison que le lecteur ne peut pas voir depuis le call site. Les signatures sont une surface d'API ; les lifetimes font partie du contrat.`,
    },
    {
      kind: "quiz",
      question:
        "`prefix` passe de `<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str` à `<'a>(text: &'a str, sep: &'a str) -> &'a str`. Les appelants se mettent à casser. Pourquoi ?",
      options: [
        "Le résultat est maintenant lié aussi à `sep`, donc il ne peut pas survivre à un séparateur à vie courte",
        "Un seul paramètre de lifetime ne peut pas être utilisé sur plus d'un argument",
        "La fonction renvoie maintenant un borrow de `sep` au lieu de `text`",
      ],
      answer: 0,
      explain:
        "`'a` devient l'intersection des régions des deux entrées, donc la sortie hérite de la plus courte. Le corps n'a pas changé ; seule la promesse faite à l'appelant a rétréci.",
    },
    {
      kind: "fill",
      prompt:
        "Le résultat est une slice de `text` uniquement. Annote le type de retour en conséquence.",
      file: "main.rs",
      before: "fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> ",
      after: " {",
      choices: ["&'a str", "&'b str", "&'static str"],
      answer: 0,
      explain:
        "`&'b str` serait un mensonge que le borrow checker attrape dans le corps : la slice renvoyée pointe dans `text`, pas dans `sep`.",
    },
    {
      kind: "quiz",
      question:
        "Une fonction prend deux références et renvoie une `String` possédée. De combien d'annotations de lifetime a-t-elle besoin ?",
      options: [
        "Aucune. L'élision nomme les entrées, et une valeur de retour possédée n'emprunte à rien",
        "Deux — chaque paramètre référence doit être annoté explicitement",
        "Une, partagée par les deux paramètres",
      ],
      answer: 0,
      explain:
        "Les annotations ne sont jamais forcées que par une sortie qui est elle-même une référence. Si tu renvoies des données possédées, les lifetimes des entrées cessent d'être le problème de qui que ce soit.",
    },
    {
      kind: "editor",
      intro: `### Deux lifetimes, dont un sans importance

Écris \`fn prefix<'a, 'b>(text: &'a str, sep: &'b str) -> &'a str\` qui renvoie tout ce qui, dans \`text\`, précède la première occurrence de \`sep\` (ou \`text\` en entier s'il n'apparaît pas).

Dans \`main\`, construis \`let text = String::from("GA7Q:250:live");\`, puis dans un **bloc interne** crée un séparateur \`String\` contenant \`":"\`, appelle \`prefix\` et lie le résultat en dehors du bloc. Affiche-le une fois le bloc terminé.

Sortie attendue :

\`\`\`text
prefix: GA7Q
\`\`\`

Si ça compile, tu as prouvé que le résultat n'emprunte pas au séparateur.`,
    },
  ],

  "rust-lifetimes-4": [
    {
      kind: "theory",
      body: `Une struct peut contenir des références, et il lui faut alors un paramètre de lifetime :

\`\`\`rust
struct Frame<'a> {
    method: &'a str,
    params: &'a str,
}
\`\`\`

Le paramètre est une promesse : **une instance de \`Frame\` ne peut pas survivre au buffer dans lequel elle pointe.** Le compilateur l'impose, donc la struct ne peut jamais se retrouver avec un pointeur pendant vers une allocation libérée.

C'est la forme de tout parser zero-copy. Au lieu d'allouer une \`String\` par champ, tu distribues des slices d'un buffer que quelqu'un d'autre possède.`,
    },
    {
      kind: "theory",
      body: `Le compromis mérite d'être énoncé clairement, parce qu'il décide de toute ton API.

**Emprunté (champs \`&'a str\`).** Aucune allocation par champ, donc parser une grosse requête est presque gratuit. Le coût : la struct est attachée — elle ne peut pas être rangée dans un cache à vie longue, envoyée à un autre thread qui survit au buffer, ni renvoyée depuis la fonction qui possède l'entrée.

**Possédé (champs \`String\`).** Ça alloue, mais la valeur est autonome, \`'static\`, et va n'importe où.

Pour un service RPC qui décode une requête, l'utilise et la drop dans un seul handler, emprunté est le bon choix et le gain est réel. Pour tout ce que tu retiens au-delà de la requête, paie l'allocation.`,
    },
    {
      kind: "quiz",
      question:
        "Un handler parse une requête en un `Frame<'a>` emprunté au buffer de la requête, puis essaie de le pousser dans un `Vec` qui vit dans l'état de l'application. Que se passe-t-il ?",
      options: [
        "Ça ne compile pas — le `Vec` survit au buffer, donc le borrow ne peut pas être stocké là",
        "Ça compile, et les slices du frame deviennent pendantes une fois le buffer libéré",
        "Ça compile, et Rust copie automatiquement les octets sous-jacents dans le Vec",
      ],
      answer: 0,
      explain:
        "C'est exactement l'erreur que le paramètre de lifetime existe pour produire, et elle te dit quelque chose de vrai : retenir ces données exige de les posséder. Convertis en `String` à la frontière où le lifetime se termine.",
    },
    {
      kind: "fill",
      prompt: "Déclare une struct qui emprunte deux slices au même buffer.",
      file: "main.rs",
      before: "struct Frame",
      after: " {\n    method: &'a str,\n    params: &'a str,\n}",
      choices: ["<'a>", "<'static>", "<T>"],
      answer: 0,
      explain:
        "`<'static>` compilerait mais n'accepterait que des références valides pendant tout le programme — en pratique, seulement des littéraux. C'est la réaction excessive classique à une erreur de lifetime.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `fn parse(raw: &'a str) -> Frame<'a>` est-elle la bonne signature pour le constructeur ?",
      options: [
        "Elle déclare que les slices du frame pointent dans `raw`, donc le compilateur lie leurs lifetimes",
        "Elle force `raw` à être copié dans le frame, ce qui rend le frame indépendant",
        "C'est purement stylistique — `fn parse(raw: &str) -> Frame` veut dire la même chose",
      ],
      answer: 0,
      explain:
        "La troisième option est assez proche pour être dangereuse : l'élision *remplirait* effectivement ça à l'identique ici (une référence d'entrée, règle 2). L'écrire vaut quand même le coup — la signature documente que la valeur de retour est une vue, pas une copie.",
    },
    {
      kind: "editor",
      intro: `### Une vue zero-copy

1. Définis \`struct Frame<'a> { method: &'a str, params: &'a str }\`.
2. Dans \`impl<'a> Frame<'a>\`, écris \`fn parse(raw: &'a str) -> Frame<'a>\` qui coupe au premier \`'|'\` — le texte avant est \`method\`, le texte après est \`params\`. Sans \`'|'\`, \`method\` est l'entrée entière et \`params\` est \`""\`.
3. Dans \`main\`, parse une \`String\` contenant \`getLedgerEntries|[42]\` et affiche les deux champs.

Sortie attendue :

\`\`\`text
method: getLedgerEntries
params: [42]
\`\`\`

Aucune allocation de \`String\` nulle part dans \`parse\`.`,
    },
  ],

  "rust-lifetimes-5": [
    {
      kind: "theory",
      body: `\`'static\` veut dire deux choses différentes selon l'endroit où il apparaît, et les confondre est l'une des sources de confusion les plus courantes en Rust async.

**Comme lifetime de référence — \`&'static T\`** — ça veut dire : cette référence est valide pendant toute l'exécution du programme. Les littéraux de string sont éligibles, parce qu'ils sont gravés dans le binaire.

\`\`\`rust
let s: &'static str = "baked into the binary";
\`\`\`

C'est une affirmation forte, et très peu de valeurs à l'exécution peuvent la faire.`,
    },
    {
      kind: "theory",
      body: `**Comme bound — \`T: 'static\`** — ça veut dire quelque chose de bien plus faible : ce type ne contient **aucune référence avec un lifetime plus court que le programme**. Ça ne veut *pas* dire que la valeur vit pour toujours.

Une \`String\` possédée satisfait \`T: 'static\` sans effort. Elle n'emprunte à rien, donc rien ne pourrait devenir pendant. Elle est quand même droppée à la fin de sa portée, comme n'importe quelle autre valeur.

\`\`\`rust
fn spawn_like<T: Send + 'static>(value: T) -> T { value }

let owned = String::from("owned at runtime");
spawn_like(owned);      // ok : String: 'static
\`\`\`

C'est pour ça que \`thread::spawn\` et \`tokio::spawn\` exigent \`'static\`. La task peut survivre à la fonction qui l'a créée, donc elle n'a pas le droit de garder un borrow des locales de cette fonction. Les données possédées sont les bienvenues ; le bound parle d'*emprunt*, pas de *durée*.`,
    },
    {
      kind: "quiz",
      question:
        "`thread::spawn` exige `F: 'static`. Ça veut dire que la closure doit vivre pendant tout le programme ?",
      options: [
        "Non — ça veut dire que la closure ne peut rien emprunter qui vive moins longtemps que le programme. Elle est droppée quand le thread se termine",
        "Oui — les closures spawnées fuient et ne sont jamais droppées",
        "Oui, et c'est pour ça que chaque closure spawnée doit être `move` et n'utiliser que des littéraux",
      ],
      answer: 0,
      explain:
        "Le bound restreint ce qui peut être *capturé*, pas combien de temps la valeur dure. C'est pour ça que des closures `move` qui capturent des `String` possédées le satisfont sans difficulté.",
    },
    {
      kind: "fill",
      prompt:
        "Borne un générique pour qu'il puisse être confié à un autre thread : aucun emprunt à vie courte, transfert sûr.",
      file: "main.rs",
      before: "fn spawn_like<T: ",
      after: ">(value: T) -> T {",
      choices: ["Send + 'static", "&'static", "Sync"],
      answer: 0,
      explain:
        "`Send` autorise le transfert entre threads ; `'static` garantit qu'aucun borrow ne pourrait devenir pendant une fois que le frame qui a fait le spawn a retourné. `Sync`, c'est *partager* une référence entre threads — une autre question.",
    },
    {
      kind: "quiz",
      question:
        "Tu tombes sur `error: borrowed value does not live long enough` sur une task spawnée. Quel correctif est en général le bon ?",
      options: [
        "Donner à la task des données possédées — clone dedans, ou move un `Arc`",
        "Ajouter `&'static` au type de la valeur empruntée",
        "Faire fuir la valeur avec `Box::leak` pour qu'elle devienne `'static`",
      ],
      answer: 0,
      explain:
        "`Box::leak` produit techniquement un `&'static` et est parfois correct pour une valeur qui dure vraiment tout le processus — mais y recourir pour faire taire une erreur de borrow signifie allouer de la mémoire que tu ne récupéreras jamais, une fois par appel.",
    },
    {
      kind: "editor",
      intro: `### Deux sens, un seul programme

1. Lie un \`&'static str\` avec l'annotation de type explicite, contenant \`baked into the binary\`, et affiche-le.
2. Écris \`fn spawn_like<T: Send + 'static>(value: T) -> T\` qui renvoie juste son argument.
3. Fais passer une \`String\` possédée contenant \`owned at runtime\` à travers et affiche le résultat — ce qui prouve que \`String\` satisfait \`'static\`.

Sortie attendue :

\`\`\`text
literal: baked into the binary
bound: owned at runtime
\`\`\``,
    },
  ],
};
