import type { LessonStep } from "@/content/steps";

// FR · Errors That Survive Production.
//
// Overlay for ../../steps/rust-error-handling.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustErrorHandlingStepsFr: Record<string, LessonStep[]> = {
  "rust-error-handling-1": [
    {
      kind: "theory",
      body: `\`Result<T, E>\` est un enum ordinaire. Le langage n'a rien de spécial pour lui, à part un seul opérateur.

\`\`\`rust
enum Result<T, E> { Ok(T), Err(E) }
\`\`\`

\`?\` est cet opérateur. Appliqué à un \`Result\`, il unwrap le \`Ok\` et **retourne tôt** sur un \`Err\` :

\`\`\`rust
let n: i64 = raw.trim().parse()?;
\`\`\`

ce qui est exactement :

\`\`\`rust
let n: i64 = match raw.trim().parse() {
    Ok(v) => v,
    Err(e) => return Err(From::from(e)),
};
\`\`\``,
    },
    {
      kind: "theory",
      body: `Deux détails de ce desugaring valent le détour.

**\`From::from(e)\`.** \`?\` convertit l'erreur en sortant. C'est ce qui permet à une fonction qui renvoie \`Result<T, MyError>\` d'utiliser \`?\` sur une \`ParseIntError\` — tant qu'il existe un \`MyError: From<ParseIntError>\`. C'est tout le mécanisme derrière la gestion d'erreurs ergonomique en Rust, et c'est la leçon d'après la prochaine.

**Le retour anticipé.** \`?\` ne peut apparaître que dans une fonction qui renvoie \`Result\` (ou \`Option\`, ou un autre type \`Try\`). Ce n'est pas un unwrap qui panique — c'est un opérateur de contrôle de flux, et l'échec continue de remonter jusqu'à ce que quelqu'un le gère.`,
    },
    {
      kind: "quiz",
      question: "Qu'est-ce que `?` fait que `.unwrap()` ne fait pas ?",
      options: [
        "Il renvoie l'erreur depuis la fonction englobante, convertie avec `From` — c'est l'appelant qui décide de la suite",
        "Il retente l'opération une fois avant d'abandonner",
        "Il logue l'erreur et continue avec une valeur par défaut",
      ],
      answer: 0,
      explain:
        "`unwrap` termine le processus. `?` remonte la décision d'un frame, et c'est la seule chose qui permet à une bibliothèque de rester utilisable dans le service de quelqu'un d'autre.",
    },
    {
      kind: "fill",
      prompt:
        "Propage l'échec du parse à l'appelant au lieu de paniquer dessus.",
      file: "main.rs",
      before: "let n: i64 = raw.trim().parse()",
      after: ";",
      choices: ["?", ".unwrap()", ".expect(\"bad\")"],
      answer: 0,
      explain:
        "Les trois compilent. Seul `?` laisse le choix à l'appelant — et dans un handler de requête, les deux autres transforment une mauvaise entrée en task plantée.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `?` refuse-t-il de compiler dans un `fn main()` sans type de retour ?",
      options: [
        "`?` retourne tôt avec un `Err`, et une fonction qui renvoie `()` n'a rien pour le renvoyer",
        "`main` est un cas spécial et n'autorise jamais la propagation d'erreur",
        "`?` exige un import explicite de `use std::ops::Try`",
      ],
      answer: 0,
      explain:
        "Le correctif, c'est de donner un type de retour à main : `fn main() -> Result<(), Box<dyn Error>>`. Rust affiche alors le `Debug` de l'erreur et sort avec un code non nul.",
    },
    {
      kind: "editor",
      intro: `### Propage, ne panique pas

Écris \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` qui trim l'entrée, la parse en \`i64\` avec \`?\` et renvoie le double de la valeur.

Dans \`main\`, appelle-la deux fois — avec \`" 21 "\` et avec \`"x"\` — et fais un \`match\` sur chaque résultat, en affichant \`ok: <v>\` ou \`err: <e>\`.

Sortie attendue :

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

La deuxième ligne est le texte \`Display\` de \`ParseIntError\` lui-même.`,
    },
  ],

  "rust-error-handling-2": [
    {
      kind: "theory",
      body: `\`Result<T, String>\` est l'endroit où la gestion d'erreurs vient mourir. Une \`String\` ne se match pas, ne porte aucun champ structuré, et force chaque appelant à parser de l'anglais pour décider quoi faire.

Modélise plutôt l'échec comme un enum — une variante par chose qui peut vraiment mal tourner :

\`\`\`rust
#[derive(Debug)]
enum TxError {
    Empty,
    TooLarge { limit: u32, got: u32 },
}
\`\`\`

Maintenant l'appelant peut faire un \`match\` sur la variante, et \`TooLarge\` porte les nombres dont une ligne de log ou un corps d'erreur HTTP a vraiment besoin.`,
    },
    {
      kind: "theory",
      body: `Deux habitudes rendent ça rentable.

**Mets les données dans la variante.** \`TooLarge { limit, got }\` ne coûte rien et répond à la première question de l'opérateur. \`TooLarge\` tout seul l'oblige à aller lire le code pour trouver la limite.

**Garde l'enum fermé et petit.** Une variante par *décision que l'appelant pourrait prendre différemment*, pas une par ligne de code qui peut échouer. Dix variantes qui veulent toutes dire « la requête était malformée », c'est une API pire qu'un seul \`Malformed { field: String }\`.

Dans un vrai crate tu dériverais \`Display\` et \`Error\` avec \`thiserror\` plutôt que de les écrire à la main. Elle génère exactement ce que les deux prochaines leçons écrivent manuellement — ça vaut le coup de le faire à la main une fois, pour savoir ce que la macro fabrique.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `Result<T, String>` est-il un mauvais choix comme type d'erreur public d'une bibliothèque ?",
      options: [
        "Les appelants ne peuvent pas matcher dessus, donc se remettre d'un échec précis revient à matcher de la prose anglaise",
        "Les erreurs `String` allouent, ce qui est trop lent pour n'importe quel service de production",
        "`String` n'implémente pas `std::error::Error`, donc `?` ne peut pas du tout être utilisé",
      ],
      answer: 0,
      explain:
        "L'allocation est réelle mais rarement décisive — un chemin d'échec est rarement chaud. Ce qui fait vraiment mal, c'est de perdre la capacité à *brancher* sur l'échec.",
    },
    {
      kind: "fill",
      prompt:
        "Donne à la variante les nombres dont un opérateur aura besoin, sans recherche séparée.",
      file: "main.rs",
      before: "enum TxError {\n    Empty,\n    TooLarge ",
      after: ",\n}",
      choices: ["{ limit: u32, got: u32 }", "(String)", ""],
      answer: 0,
      explain:
        "Des champs nommés sur une variante se lisent mieux au point de construction qu'une variante tuple : `TooLarge { limit: 100, got: size }` n'a pas besoin de commentaire.",
    },
    {
      kind: "quiz",
      question:
        "Combien de variantes un enum d'erreur de validation de requête devrait-il avoir ?",
      options: [
        "Une par décision que l'appelant pourrait prendre différemment — pas une par ligne faillible",
        "Une par appel à `?` dans le module, pour que chaque échec soit traçable",
        "Exactement une, portant un champ message",
      ],
      answer: 0,
      explain:
        "L'enum est une API. Sa forme doit suivre ce que les appelants ont besoin de distinguer, et le détail qui ne sert qu'aux humains va dans les champs.",
    },
    {
      kind: "editor",
      intro: `### Modélise l'échec, ne le stringifie pas

1. Définis \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`.
2. Écris \`fn validate(size: u32) -> Result<u32, TxError>\` : \`0\` donne \`Empty\`, tout ce qui dépasse \`100\` donne \`TooLarge\` avec la limite \`100\`, tout le reste donne \`Ok(size)\`.
3. Affiche le \`{:?}\` de \`validate(50)\`, \`validate(0)\` et \`validate(150)\`.

Sortie attendue :

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\``,
    },
  ],

  "rust-error-handling-3": [
    {
      kind: "theory",
      body: `\`?\` appelle \`From::from\` sur l'erreur au moment où elle sort. Implémente \`From\` une fois, et chaque \`?\` du module convertit gratuitement :

\`\`\`rust
impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::BadNumber(e)
    }
}
\`\`\`

Maintenant ceci compile, alors que \`parse\` renvoie une \`ParseIntError\` et que la fonction renvoie une \`ConfigError\` :

\`\`\`rust
fn read_port(raw: &str) -> Result<u16, ConfigError> {
    let port: u16 = raw.parse()?;    // convertie en sortant
    Ok(port)
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `N'implémente jamais \`Into\` à la main. \`std\` a un blanket \`impl<T, U: From<T>> Into<U> for T\`, donc implémenter \`From\` te donne \`Into\` automatiquement — et l'inverse n'est pas vrai.

Pour une \`Option\` au milieu d'une chaîne de \`Result\`, fais le pont explicitement :

\`\`\`rust
let raw = raw.ok_or(ConfigError::Missing)?;
\`\`\`

\`ok_or\` transforme \`None\` en \`Err(...)\` ; \`ok_or_else\` prend une closure et c'est celle à utiliser quand construire l'erreur n'est pas gratuit. Son miroir, \`.ok()\`, jette l'erreur d'un \`Result\` et te donne une \`Option\` — pratique, et à regarder avec méfiance, puisque ça balance la raison.`,
    },
    {
      kind: "quiz",
      question:
        "Tu as implémenté `From<ParseIntError> for ConfigError`. Qu'est-ce que tu obtiens d'autre ?",
      options: [
        "`Into<ConfigError> for ParseIntError`, via le blanket impl de std — et la conversion par `?` à chaque call site",
        "Rien d'autre ; `Into` doit être implémenté séparément",
        "`TryFrom` dans la direction opposée, automatiquement",
      ],
      answer: 0,
      explain:
        "C'est pour ça que la consigne est toujours « implémente From, jamais Into ». Implémenter `Into` directement ne te donne aucun `From`, et `?` cherche `From`.",
    },
    {
      kind: "fill",
      prompt:
        "Transforme une valeur absente en ta propre erreur pour que `?` puisse la transporter plus loin.",
      file: "main.rs",
      before: "let raw = raw.",
      after: "(ConfigError::Missing)?;",
      choices: ["ok_or", "unwrap_or", "expect"],
      answer: 0,
      explain:
        "`ok_or` mappe `Option<T>` vers `Result<T, E>`. `unwrap_or` substituerait une valeur par défaut et cacherait le fait que la valeur était absente.",
    },
    {
      kind: "quiz",
      question: "Quand faut-il prendre `ok_or_else` plutôt que `ok_or` ?",
      options: [
        "Quand construire la valeur d'erreur n'est pas gratuit — `ok_or` évalue son argument d'avance, même sur le chemin `Some`",
        "Quand l'`Option` est `None` plus souvent que `Some`",
        "Quand le type d'erreur n'implémente pas `Clone`",
      ],
      answer: 0,
      explain:
        "Même règle que `unwrap_or` contre `unwrap_or_else`. Si l'argument est une simple variante unitaire, `ok_or` suffit et se lit mieux ; s'il alloue ou formate, prends la closure.",
    },
    {
      kind: "editor",
      intro: `### Laisse ? faire la conversion

1. Définis \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`.
2. Implémente \`From<ParseIntError> for ConfigError\` qui produit \`BadNumber\`.
3. Écris \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\` : \`ok_or\` sur le cas \`Missing\`, puis \`parse()?\` — sans aucune conversion explicite nulle part.
4. Affiche le \`{:?}\` de trois appels : \`Some("8080")\`, \`None\`, \`Some("no")\`.

Sortie attendue :

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\``,
    },
  ],

  "rust-error-handling-4": [
    {
      kind: "theory",
      body: `Une erreur doit deux messages différents à deux lecteurs différents.

**\`Debug\`** — pour toi, dans un log ou un échec de test. Dérive-le. Il montre la structure, noms de champs compris, et n'est jamais montré à un utilisateur.

**\`Display\`** — pour un humain, dans une ligne de log ou une réponse d'API. Écris-le à la main. Une phrase, en minuscules, sans point final, sans préfixe « Error: » (l'appelant ajoute le contexte autour).

\`\`\`rust
impl fmt::Display for TimeoutError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "request timed out after {}ms", self.ms)
    }
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `\`impl std::error::Error for TimeoutError {}\` — souvent un bloc vide — est ce qui fait du type une *erreur* plutôt qu'une struct qui se trouve être affichable.

Il exige \`Debug + Display\`, et en échange débloque l'écosystème : ton type peut être boxé en \`Box<dyn Error>\`, renvoyé depuis \`fn main()\`, transporté par \`anyhow\`, et chaîné avec \`source()\`.

\`\`\`rust
let boxed: Box<dyn Error> = Box::new(TimeoutError { ms: 250 });
println!("{boxed}");        // utilise ton Display
\`\`\`

\`Box<dyn Error>\` est le bon type d'erreur au sommet d'une application, là où tu n'as plus l'intention de matcher sur la variante. Une **bibliothèque** doit garder son enum concret, pour que ses appelants puissent encore le faire.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `std::error::Error` exige-t-il à la fois `Debug` et `Display` ?",
      options: [
        "Ils servent des lecteurs différents : `Debug` montre la structure à un développeur, `Display` écrit une phrase pour un log ou un utilisateur",
        "`Debug` sert sur le chemin de succès et `Display` sur le chemin d'échec",
        "C'est historique ; `Display` seul suffirait aujourd'hui",
      ],
      answer: 0,
      explain:
        "Ça a aussi une conséquence pratique : `fn main() -> Result<(), E>` affiche le `Debug`, pas le `Display` — ce qui surprend ceux qui n'ont écrit qu'un joli `Display`.",
    },
    {
      kind: "fill",
      prompt: "Déclare le type comme une erreur, en héritant des méthodes par défaut.",
      file: "main.rs",
      before: "impl Error for TimeoutError ",
      after: "",
      choices: ["{}", "{ fn description(&self) -> &str { \"\" } }", ";"],
      answer: 0,
      explain:
        "Chaque méthode de `Error` a une implémentation par défaut, donc un bloc vide est complet. `description` est dépréciée — `Display` l'a remplacée.",
    },
    {
      kind: "quiz",
      question:
        "Quand `Box<dyn Error>` est-il le bon type d'erreur, et quand est-il mauvais ?",
      options: [
        "Bon au sommet d'une application, là où personne ne matche dessus ; mauvais pour une bibliothèque, dont les appelants ont encore besoin de distinguer les échecs",
        "Bon partout — il est strictement plus flexible qu'un enum concret",
        "Mauvais partout : il alloue sur chaque chemin d'erreur",
      ],
      answer: 0,
      explain:
        "C'est la même frontière qu'entre `anyhow` et `thiserror`. Effacer le type est une commodité que tu ne peux dépenser que pour ton propre compte, jamais pour celui de tes appelants.",
    },
    {
      kind: "editor",
      intro: `### Les deux messages qu'une erreur te doit

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`.
2. Implémente \`fmt::Display\` qui affiche \`request timed out after <ms>ms\`.
3. Implémente \`std::error::Error\` avec un bloc vide.
4. Dans \`main\`, affiche une instance avec \`{}\` et avec \`{:?}\`, puis boxe une deuxième (\`ms: 250\`) en \`Box<dyn Error>\` et affiche-la.

Sortie attendue :

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\``,
    },
  ],

  "rust-error-handling-5": [
    {
      kind: "theory",
      body: `Une erreur d'une seule ligne est souvent inutile à elle seule. *« could not load config »* n'apprend à un opérateur rien qu'il ne savait déjà.

\`Error::source\` est la façon standard d'attacher la raison :

\`\`\`rust
impl Error for LoadFailed {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        Some(&self.cause)
    }
}
\`\`\`

Chaque couche ajoute *ce qu'elle essayait de faire* et garde la couche du dessous intacte. Parcourir la chaîne produit alors toute l'histoire, de l'intention jusqu'au syscall.`,
    },
    {
      kind: "theory",
      body: `Le parcours est une simple boucle :

\`\`\`rust
let mut cause = err.source();
while let Some(e) = cause {
    println!("  caused by: {e}");
    cause = e.source();
}
\`\`\`

La règle qui rend ça rentable : **le \`Display\` de chaque couche décrit sa propre intention, jamais la couche du dessous.** Si \`LoadFailed\` affiche « could not load config: permission denied », la chaîne dit maintenant « permission denied » deux fois, et la duplication grandit à chaque niveau.

C'est ce que le \`.context("could not load config")\` d'\`anyhow\` construit automatiquement, et c'est pour ça qu'une bonne ligne de log Rust peut clore une investigation au lieu d'en ouvrir une.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi le `Display` d'une erreur enveloppante ne doit-il pas inclure le message de sa source ?",
      options: [
        "La chaîne est affichée couche par couche, donc l'y intégrer répète le même texte à chaque niveau",
        "`Display` n'a pas le droit d'appeler d'autres impls de `Display`",
        "La source peut ne pas encore exister quand `Display` s'exécute",
      ],
      answer: 0,
      explain:
        "Chaque couche qui inline sa cause transforme une chaîne de N niveaux en O(N²) de texte. Chaque couche énonce sa propre intention ; la chaîne fournit le reste.",
    },
    {
      kind: "fill",
      prompt: "Expose l'échec sous-jacent pour que la chaîne puisse être parcourue.",
      file: "main.rs",
      before: "impl Error for LoadFailed {\n    fn ",
      after: "(&self) -> Option<&(dyn Error + 'static)> {\n        Some(&self.cause)\n    }\n}",
      choices: ["source", "cause", "inner"],
      answer: 0,
      explain:
        "`cause` était l'ancien nom et est déprécié. `source` est celui que tout l'écosystème parcourt.",
    },
    {
      kind: "quiz",
      question:
        "Un opérateur voit `could not load config` sans plus de détail. Qu'est-ce qui manque le plus probablement ?",
      options: [
        "L'erreur enveloppante n'implémente pas `source()`, donc la chaîne s'arrête à la première couche",
        "L'erreur a été loguée avec `{}` au lieu de `{:?}`",
        "Le niveau de log est trop bas pour montrer les erreurs imbriquées",
      ],
      answer: 0,
      explain:
        "`source()` a une implémentation par défaut qui renvoie `None`, donc l'oublier échoue en silence — la chaîne s'arrête, tout simplement, et rien ne te prévient.",
    },
    {
      kind: "editor",
      intro: `### Garde la cause attachée

1. \`#[derive(Debug)] struct Io(String)\` avec un \`Display\` qui affiche \`io failure: <texte>\`, et un impl \`Error\` vide.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` avec un \`Display\` qui affiche exactement \`could not load config\` — sans mention de la cause.
3. Implémente \`Error\` pour \`LoadFailed\` avec \`source()\` qui renvoie \`Some(&self.cause)\`.
4. Dans \`main\`, construis-en une avec la cause \`permission denied\`, affiche-la, puis parcours la chaîne en affichant \`"  caused by: <e>"\` pour chaque niveau.

Sortie attendue :

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\``,
    },
  ],

  "rust-error-handling-6": [
    {
      kind: "theory",
      body: `La ligne, ce n'est pas « les panics, c'est mal ». C'est une question sur *à qui* appartient la faute que la condition représente.

**Une condition** est quelque chose que le monde extérieur a le droit de faire : une entrée malformée, un fichier manquant, un timeout, une connexion fermée. Ce n'est pas un bug. Ça reçoit un \`Result\`.

**Un bug** est un invariant violé que ton propre code était censé maintenir : un index que la fonction elle-même a calculé et qui sort des bornes, une machine à états qui atteint un bras inaccessible. Continuer au-delà, c'est calculer sur des données que tu as déjà prouvées fausses. Ça reçoit un \`panic!\`.`,
    },
    {
      kind: "theory",
      body: `Dans un handler de requête, cette distinction devient une propriété de disponibilité.

Un \`unwrap()\` sur une entrée utilisateur transforme une requête malformée en panic. Selon le runtime, ça déroule une seule task — et renvoie un 500 nu sans aucun log utile — ou ça aborte le processus en emportant toutes les requêtes en vol. Dans les deux cas, un attaquant qui l'a trouvé tient un déni de service.

Règles pratiques :

- \`unwrap\`/\`expect\` sur quoi que ce soit dérivé d'une entrée : **jamais** dans un handler.
- \`expect("...")\` au démarrage, là où l'alternative est de tourner mal configuré : **ok**, et mieux qu'un \`Result\` que personne ne lit.
- \`assert!\` pour un invariant, avec un message nommant ce qui a été violé : **bien**, et ça documente l'hypothèse.
- Dans les tests : \`unwrap\` à volonté. Un test qui échoue *doit* faire du bruit.`,
    },
    {
      kind: "quiz",
      question:
        "Un handler fait `let id = params.get(\"id\").unwrap();`. Quel est le vrai risque ?",
      options: [
        "Toute requête sans `id` fait paniquer la task — un déni de service que n'importe qui peut déclencher exprès",
        "La réponse est plus lente parce que dérouler la stack coûte cher",
        "Aucun, tant que le client se comporte bien",
      ],
      answer: 0,
      explain:
        "Une entrée absente est une condition, pas un bug. La troisième réponse, c'est le raisonnement qui envoie ça en prod : le client est exactement la partie du système que tu ne contrôles pas.",
    },
    {
      kind: "fill",
      prompt:
        "Lis un index qui peut légitimement être hors bornes, sans paniquer.",
      file: "main.rs",
      before: "data.",
      after: "(i).copied()",
      choices: ["get", "index", "iter().nth"],
      answer: 0,
      explain:
        "`get` renvoie `Option<&T>` ; `.copied()` transforme `Option<&i64>` en `Option<i64>`. `data[i]` panique, ce qui n'est correct que quand être hors bornes serait un bug.",
    },
    {
      kind: "quiz",
      question:
        "Où `expect(\"DATABASE_URL must be set\")` est-il un choix défendable ?",
      options: [
        "Au démarrage — l'alternative est un processus qui tourne mal configuré, et le message nomme exactement ce qui manque",
        "Nulle part ; `expect`, c'est `unwrap` avec des étapes en plus",
        "Dans un handler de requête, tant que le message est descriptif",
      ],
      answer: 0,
      explain:
        "Échouer vite au boot est une feature : le processus n'atteint jamais le load balancer. Le même appel dans un handler, c'est un crash par requête.",
    },
    {
      kind: "editor",
      intro: `### Condition ou bug

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — une valeur potentiellement absente est une **condition**. Utilise \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — l'appelant garantit les bornes, donc une violation est un **bug**. \`assert!\` avec un message nommant l'index et la longueur, puis indexe directement.
3. Dans \`main\`, avec \`vec![10, 20, 30]\` : affiche \`checked_index\` à \`1\` et à \`9\` avec \`{:?}\`, puis \`invariant_index\` à \`2\`.

Sortie attendue :

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\``,
    },
  ],
};
