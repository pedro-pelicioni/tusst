import type { LessonStep } from "@/content/steps";

// Localized lesson steps — PART 2 (lessons 17+ in steps.ts order).
// Same rules as steps1.ts.
export const steps2: Record<string, LessonStep[]> = {
  "mastering-option-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Dans la plupart des royaumes, « rien » est une embuscade — un null qui te fait planter à minuit. Le marais fait autrement : **l'absence fait partie du type**.

\`\`\`rust
enum Option<T> {
    Some(T),   // il Y A une valeur, enveloppée à l'intérieur
    None,      // il n'y a rien — déclaré honnêtement
}
\`\`\`

Tu as croisé Option sur l'étagère de l'Amasseur. Maintenant, tu vas la maîtriser.`,
    },
    {
      kind: "theory",
      body: `Une fonction qui pourrait ne pas avoir de réponse l'annonce dans sa signature :

\`\`\`rust
fn find(present: bool) -> Option<i32> {
    if present { Some(7) } else { None }
}
\`\`\`

Remarque : pas de point-virgule sur \`Some(7)\` / \`None\` — le \`if/else\` est une expression, et son résultat est renvoyé.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `find` renvoie-t-elle `Option<i32>` plutôt qu'un simple `i32` ?",
      options: [
        "C'est honnête — il peut ne pas y avoir de réponse, et le type le dit",
        "Option est plus rapide que i32",
        "Toutes les fonctions Rust doivent renvoyer Option",
      ],
      answer: 0,
      explain: "Le type force chaque appelant à gérer le cas None. Fini les embuscades de minuit.",
    },
    {
      kind: "fill",
      prompt: "Enveloppe la valeur trouvée — le villageois 7 existe.",
      file: "main.rs",
      before: "if present { ",
      after: "(7) } else { None }",
      choices: ["Some", "Ok", "Value"],
      answer: 0,
      explain: "Some enveloppe la présence ; None déclare l'absence. (Ok appartient à Result — prochain acte.)",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — Some, ou None ?

Complète \`find\` : si \`present\` est vrai, renvoie \`Some(7)\`, sinon \`None\` — et supprime le \`todo!()\`.

Sortie attendue :

\`\`\`text
Some(7)
\`\`\``,
    },
  ],

  "mastering-option-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `\`.unwrap()\` arrache la valeur hors d'une Option :

\`\`\`rust
let x = Some(5).unwrap();   // → 5. très bien.
let y = ghost.unwrap();     // ghost est None → 💥 PANIC
\`\`\`

Sur \`None\`, unwrap **panique** — tout le programme sombre. Les pierres tombales de ce marais racontent toutes la même histoire.`,
    },
    {
      kind: "theory",
      body: `Les survivants portent un **défaut** :

\`\`\`rust
let value = ghost.unwrap_or(0);   // Some(x) → x · None → 0
\`\`\`

Tu as déjà utilisé cet idiome deux fois — sur l'étagère de l'Amasseur, et il te protégera encore dans la forteresse Soroban. C'est la rune la plus utile du marais.`,
    },
    {
      kind: "quiz",
      question: "`let ghost: Option<i32> = None;` — que fait `ghost.unwrap()` ?",
      options: [
        "Panique — le programme plante",
        "Renvoie 0",
        "Renvoie None",
      ],
      answer: 0,
      explain: "Ne fais jamais unwrap sur ce que tu n'as pas vérifié. Le marais est plein de ceux qui l'ont fait.",
    },
    {
      kind: "fill",
      prompt: "Extrais en sécurité : 0 par défaut si le fantôme est None.",
      file: "main.rs",
      before: "let value = ghost.",
      after: "(0);",
      choices: ["unwrap_or", "unwrap", "or_else"],
      answer: 0,
      explain: "unwrap_or ne panique jamais — l'absence devient ton défaut.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — ne jamais unwrap à l'aveugle

\`ghost\` est \`None\`. Extrais une valeur en sécurité :

1. \`let value = ghost.unwrap_or(0);\` — aucun \`.unwrap()\` nulle part.
2. Affiche \`value: {}\`.

Sortie attendue :

\`\`\`text
value: 0
\`\`\``,
    },
  ],

  "mastering-option-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Un \`match\` complet sur une Option fonctionne — mais quand seul le cas \`Some\` t'intéresse, le marais a un raccourci :

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);
}
\`\`\`

\`if let\` questionne et déballe en un seul geste : *si le motif correspond, nomme la valeur et entre.*`,
    },
    {
      kind: "theory",
      body: `Et il se compose avec \`else\`, comme un \`if\` ordinaire :

\`\`\`rust
if let Some(light) = lantern {
    println!("light: {}", light);   // light est le i32 déballé
} else {
    println!("darkness");
}
\`\`\`

Dans la première branche, \`light\` est une valeur nue — pas d'Option, pas d'unwrap, pas de danger.`,
    },
    {
      kind: "quiz",
      question: "Dans `if let Some(light) = lantern { ... }`, qu'est-ce que `light` à l'intérieur des accolades ?",
      options: [
        "La valeur déballée — un simple i32",
        "Toujours une Option<i32>",
        "Un booléen",
      ],
      answer: 0,
      explain: "Le motif a retiré le Some — à l'intérieur, tu tiens la valeur elle-même.",
    },
    {
      kind: "fill",
      prompt: "Interroge la lanterne : s'il y a de la lumière, prends-la par son nom.",
      file: "main.rs",
      before: "if let ",
      after: "(light) = lantern {\n    println!(\"light: {}\", light);\n}",
      choices: ["Some", "Option", "Has"],
      answer: 0,
      explain: "if let Some(light) — le motif nomme la valeur enveloppée.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — interroge le marais lui-même

La lanterne contient \`Some(3)\` :

1. \`if let Some(light) = lantern\` → affiche \`light: {}\`
2. \`else\` → affiche \`darkness\`

Sortie attendue :

\`\`\`text
light: 3
\`\`\``,
    },
  ],

  /* ───────────────────── Act V · Result ───────────────────── */

  "mastering-result-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Le marais t'a enseigné *l'absence*. La Haute Cour juge **l'échec** — et l'échec énonce toujours sa raison :

\`\`\`rust
enum Result<T, E> {
    Ok(T),    // ça a marché — voici la valeur
    Err(E),   // ça a échoué — voici POURQUOI
}
\`\`\`

Là où \`Option\` dit « rien », \`Result\` dit « voici ce qui a mal tourné ».`,
    },
    {
      kind: "theory",
      body: `Une fonction qui peut échouer renvoie un Result — et statue explicitement :

\`\`\`rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}
\`\`\`

Pas de crash, pas de mauvaise réponse silencieuse — un verdict, consigné au registre.`,
    },
    {
      kind: "quiz",
      question: "Quand une fonction devrait-elle renvoyer `Result` plutôt qu'`Option` ?",
      options: [
        "Quand l'appelant a besoin de savoir POURQUOI ça a échoué",
        "Quand elle n'échoue jamais",
        "Result et Option sont interchangeables",
      ],
      answer: 0,
      explain: "None est muet ; Err porte la raison. Les cours tiennent registre.",
    },
    {
      kind: "fill",
      prompt: "Statue sur l'échec : la division par zéro est une erreur.",
      file: "main.rs",
      before: "if b == 0 {\n    ",
      after: "(String::from(\"division by zero\"))\n} else {\n    Ok(a / b)\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Err(raison) — l'échec avec son pourquoi attaché.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — les deux verdicts

Complète \`divide\` (et supprime le \`todo!()\`) :

1. \`b == 0\` → \`Err(String::from("division by zero"))\`
2. Sinon → \`Ok(a / b)\`

Sortie attendue :

\`\`\`text
Ok(5)
\`\`\``,
    },
  ],

  "mastering-result-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Un verdict scellé arrive. Tu ne devines pas — tu fais un \`match\`, et le compilateur s'assure que **les deux** issues sont gérées :

\`\`\`rust
match verdict {
    Ok(v) => println!("granted: {}", v),
    Err(e) => println!("denied: {}", e),
}
\`\`\`

Les motifs déballent en même temps qu'ils correspondent : \`v\` est la valeur, \`e\` est la raison.`,
    },
    {
      kind: "theory",
      body: `Au-dessus de la porte du tribunal : \`#[must_use]\`.

Cela signifie que Rust **t'avertit** si tu reçois un Result et l'ignores — un verdict non lu est un bug en embuscade. Chaque Result doit être lu, matché, ou délibérément transmis. La Cour n'oublie rien.`,
    },
    {
      kind: "quiz",
      question: "Que fait le compilateur si tu appelles une fonction renvoyant un Result et que tu ignores le verdict ?",
      options: [
        "Il t'avertit — Result est #[must_use]",
        "Rien — ignorer ne pose aucun problème",
        "Il refuse de compiler, toujours",
      ],
      answer: 0,
      explain: "L'avertissement de Result inutilisé, c'est la devise de la Cour appliquée dans le code.",
    },
    {
      kind: "fill",
      prompt: "Gère la branche d'échec — déballe la raison sous le nom `e`.",
      file: "main.rs",
      before: "match verdict {\n    Ok(v) => println!(\"granted: {}\", v),\n    ",
      after: "(e) => println!(\"denied: {}\", e),\n}",
      choices: ["Err", "None", "Fail"],
      answer: 0,
      explain: "Ok et Err — deux branches, deux cas gérés. Le compilateur n'accepte rien de moins.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — lire le jugement

La cour te remet \`Ok(42)\`. Matche les deux verdicts :

1. \`Ok(v)\` → affiche \`granted: {}\`
2. \`Err(e)\` → affiche \`denied: {}\`

Sortie attendue :

\`\`\`text
granted: 42
\`\`\``,
    },
  ],

  "mastering-result-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Matcher chaque Result là où il apparaît noie ta logique sous le cérémonial. Certaines cours ne statuent pas — elles **transmettent l'affaire à l'échelon supérieur**.

La plus petite rune du royaume :

\`\`\`rust
let n = parse("21")?;
\`\`\`

Ce \`?\` signifie : *sur Ok, déballe et continue. Sur Err, renvoie l'erreur à mon appelant — immédiatement.*`,
    },
    {
      kind: "theory",
      body: `Une condition : \`?\` ne fonctionne qu'à l'intérieur d'une fonction qui **renvoie elle-même un Result** — l'erreur a besoin d'un endroit où aller :

\`\`\`rust
fn double_first() -> Result<i32, String> {
    let n = parse("21")?;   // Err sortirait ici, vers le haut
    Ok(n * 2)               // le chemin heureux reste net
}
\`\`\`

C'est ainsi que le vrai code Rust reste lisible : les erreurs remontent la pente, la logique reste plate.`,
    },
    {
      kind: "quiz",
      question: "Que fait `?` quand le Result est `Err` ?",
      options: [
        "Il renvoie immédiatement le Err depuis la fonction courante",
        "Il panique",
        "Il le convertit en None",
      ],
      answer: 0,
      explain: "Une seule marque, et le jugement remonte vers celui qui t'a appelé.",
    },
    {
      kind: "fill",
      prompt: "Propage : déballe sur Ok, renvoie vers le haut sur Err.",
      file: "main.rs",
      before: "let n = parse(\"21\")",
      after: ";\nOk(n * 2)",
      choices: ["?", ".unwrap()", "!"],
      answer: 0,
      explain: "? propage ; unwrap panique. Au tribunal, on ne panique jamais.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — la marque de la propagation

Complète \`double_first\` (et supprime le \`todo!()\`) :

1. \`let n = parse("21")?;\`
2. Renvoie \`Ok(n * 2)\`.

Sortie attendue :

\`\`\`text
Ok(42)
\`\`\``,
    },
  ],

  /* ───────────────── Act VI · Stellar 101 (conceptual) ───────────────── */

  "stellar-101-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Bienvenue dans le ciel, Forgeborn. **Stellar** est un registre public — un livre de comptes partagé qu'aucun pouvoir ne contrôle seul, qui règle les paiements en ~5 secondes.

Chaque acteur y est un **compte** (un fort-étoile), contrôlé par une **paire de clés** : deux clés, nées ensemble, aux devoirs opposés.`,
    },
    {
      kind: "theory",
      body: `Les deux clés :

- **Clé publique** — commence par \`G\`. Ton adresse. Crie-la du haut des tours ; c'est ainsi que les autres te trouvent et te paient.
- **Clé secrète** — commence par \`S\`. Elle signe tout ce que tu fais. Ne la partage **jamais**, ne la colle jamais, ne la committe jamais. Si tu la perds → le compte est perdu à jamais. Pas de service d'assistance dans le ciel.

Et pour exister sur le registre, un compte détient une **réserve de base : 1 XLM** minimum.`,
    },
    {
      kind: "quiz",
      question: "Quelqu'un demande ton adresse pour t'envoyer des lumens. Quelle clé donnes-tu ?",
      options: [
        "La clé publique G... — elle est faite pour ça",
        "La clé secrète S... — elle prouve que le compte t'appartient",
        "Les deux, par précaution",
      ],
      answer: 0,
      explain: "G se partage. S signe — quiconque la détient POSSÈDE ton compte.",
    },
    {
      kind: "quiz",
      question: "Tu perds ta clé secrète (S...). Et maintenant ?",
      options: [
        "Le compte est irrécupérable — plus rien ne pourra signer pour lui",
        "Le support de Stellar peut la réinitialiser",
        "La clé publique peut la régénérer",
      ],
      answer: 0,
      explain: "Pas de gardien, pas de réinitialisation. La graine EST la propriété — garde-la au prix de ta vie.",
    },
    {
      kind: "fill",
      prompt: "Remplis la charte : quel sceau ouvre une clé **publique** ?",
      file: "star-chart.toml",
      before: "public_key_starts_with = \"",
      after: "\"",
      choices: ["G", "S", "X"],
      answer: 0,
      explain: "G pour l'adresse que tu partages ; S pour la graine que tu gardes.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — la charte du fort-étoile

Complète la charte : les deux sceaux, et la réserve de base (en XLM) dont un compte a besoin pour exister.

Sortie attendue :

\`\`\`text
star-keep chartered ✓
\`\`\``,
    },
  ],

  "stellar-101-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `La monnaie native du ciel est le **lumen (XLM)**. Sa plus petite étincelle est le **stroop** :

\`\`\`text
1 XLM = 10,000,000 stroops
\`\`\`

Dix millions. Tous les montants du registre sont en réalité comptés en stroops — les décimales sont pour les humains.`,
    },
    {
      kind: "theory",
      body: `Chaque transaction paie un petit péage — le **frais de base : 100 stroops** (0,00001 XLM).

Ce n'est pas un revenu. C'est de l'anti-spam : assez cher pour empêcher quiconque d'inonder le ciel de bruit, assez bon marché pour qu'un million de vrais paiements coûtent environ un dollar. Quand le trafic monte, les frais grimpent brièvement — une enchère pour l'espace.`,
    },
    {
      kind: "quiz",
      question: "Combien coûte, en gros, l'envoi d'un paiement sur Stellar ?",
      options: [
        "100 stroops — un centième de centime",
        "1 XLM par paiement",
        "Un pourcentage du montant envoyé",
      ],
      answer: 0,
      explain: "Fixe, minuscule, anti-spam. Le montant envoyé ne change pas le péage.",
    },
    {
      kind: "fill",
      prompt: "Combien de stroops font un lumen ?",
      file: "star-chart.toml",
      before: "stroops_per_lumen = ",
      after: "",
      choices: ["10_000_000", "1_000", "100"],
      answer: 0,
      explain: "Dix millions d'étincelles par lumen.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — le péage de la porte

Complète la plaque : les stroops par lumen, et le frais de base en stroops.

Sortie attendue :

\`\`\`text
toll paid ✓
\`\`\``,
    },
  ],

  "stellar-101-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Le ciel transporte plus que des lumens. **Tout compte peut émettre un actif** — dollars, or, billets, points. Un actif se définit par deux choses ensemble :

- un **code d'actif** : \`USDC\`, \`EURC\`, ...
- son **émetteur** : le compte \`G...\` qui l'a créé

Même code, émetteur différent → actif entièrement différent. L'émetteur EST l'identité.`,
    },
    {
      kind: "theory",
      body: `Mais voici la règle du consentement dans le ciel : ton compte ne peut pas détenir un actif qu'il n'a pas explicitement accepté.

Une **trustline** est cette acceptation — un pont que tu ouvres de ton compte vers un actif d'un émetteur :

\`\`\`text
trustline = "J'accepte l'USDC, émis par G...CENTRE"
\`\`\`

Pas de trustline, pas de solde — les paiements dans cet actif ne peuvent tout simplement pas t'atteindre. (Chaque trustline ouverte augmente aussi légèrement ta réserve.)`,
    },
    {
      kind: "quiz",
      question: "Quelqu'un t'envoie des USDC mais tu n'as jamais ouvert de trustline vers cet actif. Que se passe-t-il ?",
      options: [
        "Le paiement échoue — pas de pont, pas de cargaison",
        "Il arrive en XLM à la place",
        "Il attend dans une file d'attente",
      ],
      answer: 0,
      explain: "Le ciel prend le consentement au sérieux : tu ne détiens rien que tu n'as pas accepté.",
    },
    {
      kind: "quiz",
      question: "Deux actifs nommés USDC tous les deux, venant de deux émetteurs différents. Est-ce le même actif ?",
      options: [
        "Non — code + émetteur définissent l'actif ; l'émetteur est l'identité",
        "Oui — c'est le code qui compte",
        "Seulement s'ils ont le même prix",
      ],
      answer: 0,
      explain: "N'importe qui peut nommer un actif USDC. C'est QUI l'a émis que tu dois croire.",
    },
    {
      kind: "fill",
      prompt: "L'émetteur d'un actif est toujours... quel genre de chose ?",
      file: "star-chart.toml",
      before: "asset_issuer_starts_with = \"",
      after: "\"   # les émetteurs sont des comptes",
      choices: ["G", "S", "USD"],
      answer: 0,
      explain: "Les émetteurs sont des comptes — identifiés par leur clé publique G...",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — ouvre le pont de lumière

Complète la trustline pour **USDC** : le code de l'actif, et le sceau par lequel commence toute adresse d'émetteur.

Sortie attendue :

\`\`\`text
light-bridge opened ✓
\`\`\``,
    },
  ],

  "stellar-101-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Tout converge. Une **opération de paiement** requiert exactement trois choses :

1. **destination** — le compte destinataire (\`G...\`)
2. **actif** — ce que tu envoies (\`XLM\` pour le lumen natif)
3. **montant** — combien

Tu la signes avec ta clé secrète, tu paies le péage de ~100 stroops, et en ~5 secondes elle est **définitive**. Pas de banques. Pas de jours ouvrés. Pas de frontières.`,
    },
    {
      kind: "theory",
      body: `Le voyage complet de ton paiement :

\`\`\`text
construis l'opération
  → signe avec ta clé S...
    → soumets au réseau
      → les validateurs s'accordent (~5s)
        → définitif. pour toujours. sur le registre.
\`\`\`

C'est le ciel que le Beholder a brisé — et celui que tu t'apprêtes à rallumer. Après cette Porte : Soroban, où le registre exécute *ton* Rust.`,
    },
    {
      kind: "quiz",
      question: "Qu'est-ce qui rend une opération de paiement valide à soumettre ?",
      options: [
        "Elle est signée avec la clé secrète de l'expéditeur",
        "La destination l'approuve d'abord",
        "Une banque la compense sous 2 jours ouvrés",
      ],
      answer: 0,
      explain: "La signature est l'autorité — voilà pourquoi la clé S... est sacrée.",
    },
    {
      kind: "fill",
      prompt: "Trace la cargaison : le code de l'actif natif.",
      file: "star-chart.toml",
      before: "asset = \"",
      after: "\"",
      choices: ["XLM", "USD", "STR"],
      answer: 0,
      explain: "XLM — le lumen, l'actif natif du ciel.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — première lumière à travers le ciel

Trace le paiement : le sceau de destination, le code de l'actif natif, et envoie **25**.

Sortie attendue :

\`\`\`text
lumens flowing ✓
\`\`\``,
    },
  ],

  /* ───────────────── Act VII · Soroban (assumes Rust mastery) ───────────────── */

  "soroban-smart-contracts-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Forgeborn, au-delà de la Porte, les règles changent. Un **contrat Soroban** est une bibliothèque Rust compilée en WASM et stockée sur le registre Stellar — où n'importe qui peut l'invoquer.

\`\`\`rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env};
\`\`\`

\`#![no_std]\` n'est pas une décoration : il n'y a ni OS, ni allocateur, ni \`std\` on-chain. Le registre est la machine, et le \`soroban_sdk\` est désormais ta bibliothèque standard.`,
    },
    {
      kind: "theory",
      body: `Deux attributs transforment du Rust ordinaire en contrat :

\`\`\`rust
#[contract]
pub struct HelloContract;      // l'identité du contrat

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env) -> Symbol { ... }
}
\`\`\`

\`#[contractimpl]\` exporte chaque \`pub fn\` comme point d'entrée invocable. Chacune prend \`Env\` en premier — ta poignée vers le stockage, les événements et les autres contrats.`,
    },
    {
      kind: "theory",
      body: `On-chain, chaque octet est un loyer. Les strings sont lourdes — alors les identifiants courts utilisent \`Symbol\`, un type compact du registre :

\`\`\`rust
use soroban_sdk::{symbol_short, Symbol};

let s: Symbol = symbol_short!("beacon");  // ≤ 9 caractères, [a-zA-Z0-9_]
\`\`\`

Là où un dev web renvoie \`"ok"\`, un dev Soroban renvoie \`symbol_short!("ok")\`.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi un contrat Soroban commence-t-il par `#![no_std]` ?",
      options: [
        "Il n'y a ni OS ni allocateur on-chain — la std complète ne peut pas y exister",
        "Cela accélère la compilation",
        "C'est un style optionnel — std fonctionne très bien on-chain",
      ],
      answer: 0,
      explain: "Le WASM sur le registre n'a aucun système d'exploitation sous lui. Le SDK remplace std.",
    },
    {
      kind: "fill",
      prompt: "Exporte le bloc impl comme interface publique du contrat.",
      file: "lib.rs",
      before: "#[contract]\npub struct HelloContract;\n\n",
      after: "\nimpl HelloContract {\n    pub fn hello(env: Env) -> Symbol { /* ... */ }\n}",
      choices: ["#[contractimpl]", "#[contract]", "#[export]"],
      answer: 0,
      explain: "#[contract] marque la struct ; #[contractimpl] exporte les fonctions.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — grave la première rune céleste

1. Marque le bloc impl avec \`#[contractimpl]\`.
2. Fais que \`hello\` renvoie \`symbol_short!("beacon")\` — et supprime le \`todo!()\`.

Invocation attendue :

\`\`\`text
hello() → Symbol(beacon)
\`\`\``,
    },
  ],

  "soroban-smart-contracts-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Les contrats ne gardent **aucune mémoire entre les invocations** — chaque variable locale meurt quand l'appel se termine. L'état vit dans le **registre**, derrière \`env.storage()\`.

Pour l'état global du contrat (compteurs, config, admin), la bonne étagère est le **stockage d'instance** :

\`\`\`rust
env.storage().instance()
\`\`\`

Il partage la durée de vie du contrat lui-même — archivés et restaurés ensemble.`,
    },
    {
      kind: "theory",
      body: `Lire et écrire sont symétriques, et tout passe **par référence** :

\`\`\`rust
const COUNTER: Symbol = symbol_short!("COUNTER");

let count: u32 = env.storage().instance()
    .get(&COUNTER)
    .unwrap_or(0);

env.storage().instance().set(&COUNTER, &count);
\`\`\`

\`get\` renvoie une \`Option<T>\` — la clé peut n'avoir jamais été écrite, ou son loyer (TTL) peut avoir expiré. \`unwrap_or(0)\` est l'idiome du compteur.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `storage().get(&KEY)` renvoie-t-il une `Option<T>` plutôt que `T` ?",
      options: [
        "La clé peut n'avoir jamais été écrite — ou son TTL a expiré",
        "Toutes les fonctions du SDK renvoient Option par cohérence",
        "Pour forcer la gestion d'erreurs sur les incompatibilités de types",
      ],
      answer: 0,
      explain: "Le stockage du registre est loué, pas possédé. L'absence est un état normal — gère-la.",
    },
    {
      kind: "fill",
      prompt: "Prends 0 par défaut quand le compteur n'a jamais été écrit.",
      file: "lib.rs",
      before: "let count: u32 = env.storage().instance().get(&COUNTER).",
      after: ";",
      choices: ["unwrap_or(0)", "unwrap()", "expect(\"0\")"],
      answer: 0,
      explain: "unwrap() paniquerait au premier appel — unwrap_or(0) fait de l'absence un point de départ.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — fais que le registre se souvienne

Implémente \`increment\` :

1. Lis le compte depuis le stockage d'instance sous \`&COUNTER\` — défaut \`0\`.
2. Ajoute \`1\`.
3. \`set(&COUNTER, &count)\` pour le réécrire.
4. Renvoie le nouveau compte (et supprime le \`todo!()\`).

Invocation attendue :

\`\`\`text
increment() → 1
\`\`\``,
    },
  ],

  "soroban-smart-contracts-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `N'importe qui peut invoquer une fonction publique d'un contrat, en passant **n'importe quelle** \`Address\` en argument. Alors comment un coffre sait-il que l'appelant est vraiment qui il prétend être ?

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    from.require_auth();   // ← le sceau
    // ...
}
\`\`\`

\`require_auth()\` vérifie que \`from\` a réellement **signé** (ou pré-autorisé) cette invocation exacte. Sinon, l'appel **trap** — annulé, état intact.`,
    },
    {
      kind: "theory",
      body: `C'est la ligne dont l'absence a bâti la forteresse du Beholder. Sans elle :

\`\`\`rust
pub fn withdraw(env: Env, from: Address, amount: i128) {
    // pas de require_auth ← n'importe qui passe TON adresse et te vide
}
\`\`\`

La règle du royaume : **toute fonction qui déplace de la valeur ou change l'état de quelqu'un exige son auth — première ligne, avant toute chose.**`,
    },
    {
      kind: "quiz",
      question: "Que se passe-t-il quand `from.require_auth()` échoue ?",
      options: [
        "L'invocation trap — tout est annulé, l'état reste intact",
        "Elle renvoie false et la fonction continue",
        "Elle enregistre un avertissement sur le registre",
      ],
      answer: 0,
      explain: "Un échec d'auth n'est pas une condition à gérer — il tue l'invocation net.",
    },
    {
      kind: "fill",
      prompt: "Scelle le coffre : exige l'autorisation du signataire.",
      file: "lib.rs",
      before: "pub fn withdraw(env: Env, from: Address, amount: i128) {\n    from.",
      after: ";\n    // logique de transfert...\n}",
      choices: ["require_auth()", "verify()", "is_signed()"],
      answer: 0,
      explain: "require_auth() — la ligne la plus importante de Soroban.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — le sceau du signataire

Garde le coffre : dans \`withdraw\`, exige l'autorisation de \`from\` **avant** toute autre chose.

Une seule ligne. Le Beholder est tombé faute de l'avoir écrite.

Invocation attendue :

\`\`\`text
withdraw: authorized ✓
\`\`\``,
    },
  ],

  // ---- Acte VIII — Stellar Protocol 27 (« Le Zipper ») ---------------------

  "stellar-protocol-27-1": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Le Beholder n'est plus — et le ciel lui-même est en train de changer. Stellar se met à niveau **par consensus** : les validateurs votent pour armer une nouvelle version du protocole et, à un ledger programmé, le *réseau entier* bascule d'un seul coup. Pas de forks, pas de retardataires.

Voilà ce qu'est un **protocol upgrade** : un unique basculement coordonné du ciel.`,
    },
    {
      kind: "theory",
      body: `Le **Protocol 27**, nom de code **« Zipper »**, est la mise à niveau de 2026 — et sa chronologie s'est déjà déroulée :

- Stellar Core stable — **5 juin 2026**
- SDKs — 5–11 juin · RPC & Galexie — 10 juin · Horizon — 12 juin
- **Testnet mise à niveau — 18 juin 2026**
- **Vote du Mainnet — 8 juillet 2026**

Le plan complet vit dans le [guide officiel de mise à niveau du Protocol 27](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide).`,
    },
    {
      kind: "theory",
      body: `Que change vraiment le Zipper ? Ses deux nouveautés phares vivent dans le [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) :

1. **Délégation d'authentification** — les custom accounts peuvent confier leur vérification d'auth à un autre contrat.
2. **Signatures liées à l'adresse** — un sceau qui n'ouvre que sa propre porte.

(Les mises à niveau précédentes ont livré les CAP-0055, 0060 et 0064 — le Zipper, lui, concerne la façon dont les comptes *prouvent qui ils sont*.) Suis les versions de chaque composant sur [Software Versions](https://developers.stellar.org/docs/networks/software-versions).`,
    },
    {
      kind: "quiz",
      question: "Comment un protocol upgrade de Stellar entre-t-il en vigueur ?",
      options: [
        "Les validateurs votent pour l'armer ; au ledger programmé, tout le réseau bascule d'un coup",
        "Chaque nœud se met à niveau quand il veut et les versions coexistent",
        "La Foundation appuie sur un bouton sur ses propres serveurs",
      ],
      answer: 0,
      explain: "Consensus, pas décret : le vote l'arme, un ledger fait basculer le ciel entier.",
    },
    {
      kind: "quiz",
      question: "Quand a eu lieu le vote du Mainnet pour le Protocol 27 ?",
      options: ["Le 8 juillet 2026", "Le 18 juin 2026", "Il n'a pas encore eu lieu"],
      answer: 0,
      explain: "Le Testnet a basculé le 18 juin ; le Mainnet a voté le 8 juillet 2026. Le Zipper est en ligne.",
    },
    {
      kind: "fill",
      prompt: "Arme le phare avec la version votée par les validateurs.",
      file: "lib.rs",
      before: "pub const PROTOCOL_VERSION: u32 = ",
      after: ";",
      choices: ["27", "26", "28"],
      answer: 0,
      explain: "Protocol 27 — le Zipper. (28, c'est là que meurent les credentials V1.)",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — allume le phare de la mise à niveau

Consigne les faits de la reforge :

1. \`PROTOCOL_VERSION\` — la version votée par le réseau.
2. \`CODENAME\` — en minuscules.
3. \`MAINNET_VOTE\` — \`YYYY-MM-DD\`.

Attendu :

\`\`\`text
beacon lit: protocol 27 (zipper) ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-2": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Dans l'Antre, tu as scellé un coffre avec \`require_auth()\`. Mais qui *vérifie* le sceau ?

Pour un compte normal, le protocole contrôle une signature ed25519 contre les clés du compte. Mais une \`Address\` dans Soroban peut aussi appartenir à un **contrat** — et alors quelque chose de remarquable se produit.`,
    },
    {
      kind: "theory",
      body: `Quand \`require_auth\` se déclenche pour une \`Address\` détenue par un contrat, l'hôte invoque le point d'entrée du contrat lui-même :

\`\`\`rust
pub fn __check_auth(
    env: Env,
    signature_payload: Hash<32>,
    signatures: ...,
    auth_contexts: Vec<Context>,
) { ... }
\`\`\`

Le compte **est** un contrat, et \`__check_auth\` est sa loi privée des signatures. Approuve en retournant ; rejette en trap.`,
    },
    {
      kind: "theory",
      body: `Chaque **custom account** n'est qu'un \`__check_auth\` différent :

- **Multisig** — exige 2 signatures sur 3
- **Social recovery** — laisse des amis de confiance faire tourner une clé perdue
- **Passkeys** — vérifie une signature WebAuthn au lieu d'ed25519
- **Account abstraction** — toute règle que tu peux écrire en Rust

Des bâtisseurs comme OpenZeppelin les forgeaient déjà ; [le Protocol 27 rend natives les parties difficiles](https://developers.stellar.org/meetings/2026/04/30#protocol-discussion-modular-custom-accounts-and-signature-security-in-protocol-27).`,
    },
    {
      kind: "quiz",
      question: "Qui invoque `__check_auth` ?",
      options: [
        "L'hôte Soroban, chaque fois que require_auth se déclenche pour une Address détenue par une custom account",
        "L'utilisateur, manuellement, avant chaque transaction",
        "Le compilateur, au moment du build",
      ],
      answer: 0,
      explain: "C'est le callback de l'hôte : ton contrat devient le juge de ses propres sceaux.",
    },
    {
      kind: "fill",
      prompt: "Nomme le point d'entrée que l'hôte appelle sur une custom account.",
      file: "lib.rs",
      before: "impl GuardianAccount {\n    pub fn ",
      after: "(env: Env, payload: Hash<32>, sig: BytesN<64>, ctx: Vec<Context>) {",
      choices: ["__check_auth", "check_auth", "require_auth"],
      answer: 0,
      explain: "Double underscore : __check_auth est le nom réservé que cherche l'hôte.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — le compte écrit sa propre loi

1. Exporte le bloc impl avec \`#[contractimpl]\`.
2. Renomme le placeholder en le point d'entrée que l'hôte appelle vraiment.

Attendu :

\`\`\`text
__check_auth: the account writes its own law ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-3": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Une couronne qui garde seule tous les coffres finit par se briser. Les vrais comptes veulent dire : *« que mon intendant réponde pour moi. »*

Avant le Zipper, aucun soutien du protocole — les bâtisseurs simulaient la délégation par de fragiles rondes de **pré-simulation** pour propager le contexte d'auth. Ça marchait. À peine. Parfois.`,
    },
    {
      kind: "theory",
      body: `Le Protocol 27 (CAP-0071-01) fait de la délégation une loi, avec deux nouvelles host functions :

\`\`\`rust
// UNIQUEMENT dans __check_auth :
delegate_account_auth(&delegate, &payload);

// et pour le contrat appelé :
get_delegated_signers_for_current_auth_check()
\`\`\`

La première confie la vérification d'auth en cours à la logique de signatures du délégué. La seconde révèle quels signataires délégués ont approuvé.`,
    },
    {
      kind: "theory",
      body: `Le format de transport a reçu la mise à niveau correspondante : le type de credential \`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES\` regroupe les signataires délégués et leurs signatures en **une seule** entrée d'autorisation.

Transactions plus petites, simulation plus simple — la délégation passe de bricolage fragile à motif pris en charge. Spec complète : [CAP-0071](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md) · [récap du CAP-71](https://developers.stellar.org/meetings/2026/04/30#cap-71-recap-authentication-delegation-for-custom-accounts).`,
    },
    {
      kind: "quiz",
      question: "Que permet `delegate_account_auth` à une custom account ?",
      options: [
        "Confier la vérification d'auth en cours à la logique de signatures d'un contrat délégué",
        "Transférer définitivement la propriété du compte",
        "Sauter entièrement la vérification des signatures",
      ],
      answer: 0,
      explain: "La couronne reste tienne — seule la *vérification* passe à l'intendant, appel par appel.",
    },
    {
      kind: "fill",
      prompt: "Confie cette vérification d'auth à l'intendant stocké — à la manière du Protocol 27.",
      file: "lib.rs",
      before: "// dans __check_auth :\n",
      after: "(&delegate, &signature_payload);",
      choices: ["delegate_account_auth", "require_auth", "get_delegated_signers_for_current_auth_check"],
      answer: 0,
      explain: "delegate_account_auth — appelable uniquement dans __check_auth, nouveau dans le Protocol 27.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — délègue la couronne

L'\`Address\` de l'intendant est déjà chargée. Appelle \`delegate_account_auth\` avec le délégué et le signature payload — et supprime le \`todo!()\`.

Attendu :

\`\`\`text
crown delegated: steward honored ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-4": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Le tour du Spectre de l'Écho, en termes simples — un **replay de signature**. Les audits de sécurité ont montré qu'il exige trois choses à la fois :

1. Un contrat de type admin qui **ne nomme pas l'adresse du signataire** dans le payload signé.
2. L'admin est **remplacé** par une autre adresse…
3. …et les deux adresses partagent la **même clé privée**.

Alors un sceau forgé pour l'ancienne porte ouvre la nouvelle. Mints dupliqués. Mouvements non autorisés.`,
    },
    {
      kind: "theory",
      body: `Cette combinaison exacte **ne s'est jamais produite on-chain** — mais l'ampleur des dégâts possibles justifiait un correctif du protocole.

Le **\`SOROBAN_CREDENTIALS_ADDRESS_V2\`** (CAP-0071-02) lie le signature payload à l'adresse pour laquelle il a été créé. Un écho volé ne correspond plus à une autre porte.

L'ancien \`SOROBAN_CREDENTIALS_ADDRESS\` reste valide **jusqu'au Protocol 28** — une fenêtre de migration, pas une falaise.`,
    },
    {
      kind: "theory",
      body: `En attendant de migrer, une protection provisoire pour les contrats de type admin : **inclus toi-même l'adresse du signataire dans le payload** — la rotation avec clé partagée ne peut alors plus être rejouée.

\`\`\`rust
let me: Address = env.current_contract_address();
// ajoute \`me\` au matériau signé
\`\`\`

Regarde l'analyse approfondie : [Stellar Developer Meeting — signature security](https://www.youtube.com/watch?v=5O1cDDGv7_o).`,
    },
    {
      kind: "quiz",
      question: "Quelle attaque les credentials V2 ferment-ils ?",
      options: [
        "Rejouer un signature payload valide contre un autre compte partageant la même clé de signature",
        "La force brute sur des clés privées ed25519",
        "Le front-running des transactions avant le ledger",
      ],
      answer: 0,
      explain: "Payloads liés à l'adresse : le sceau nomme sa porte, et l'écho meurt.",
    },
    {
      kind: "quiz",
      question: "Jusqu'à quand l'ancien SOROBAN_CREDENTIALS_ADDRESS reste-t-il valide ?",
      options: [
        "Jusqu'à la mise à niveau Protocol 28",
        "Il a cessé de fonctionner dès l'activation du Protocol 27",
        "Pour toujours — le V2 est optionnel",
      ],
      answer: 0,
      explain: "Une fenêtre de migration : adopte le V2 à ton rythme, mais avant le Protocol 28.",
    },
    {
      kind: "fill",
      prompt: "Prononce le credential qui lie le sceau à sa porte.",
      file: "lib.rs",
      before: "pub const CREDENTIALS: &str = \"SOROBAN_CREDENTIALS_",
      after: "\";",
      choices: ["ADDRESS_V2", "ADDRESS", "ADDRESS_WITH_DELEGATES"],
      answer: 0,
      explain: "V2 = payloads liés à l'adresse. (WITH_DELEGATES est le paquet de délégation de VIII.3.)",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — lie le sceau

1. Mets \`CREDENTIALS\` au nom V2.
2. Consigne jusqu'à quel protocole le V1 reste valide.
3. Dans \`binding_address\`, renvoie l'\`Address\` de ce contrat via \`env.current_contract_address()\` — supprime le \`todo!()\`.

Attendu :

\`\`\`text
seal bound to its door: the echo dies ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-5": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Rien ne franchit le ciel reforgé sans changer. La caravane des releases a voyagé dans un ordre strict :

**Core → SDKs → RPC & Galexie → Horizon → Testnet → Mainnet**

Chaque SDK — Rust, JavaScript, Go, Java, Python, iOS, PHP, .NET, Flutter, Elixir — a publié une version Protocol 27. Tous doivent être mis à niveau avant le basculement du Mainnet. Vérifie le tien sur [Software Versions](https://developers.stellar.org/docs/networks/software-versions).`,
    },
    {
      kind: "theory",
      body: `Le seul **breaking change** que ressentent la plupart des apps :

\`\`\`ts
// avant le Zipper :
import { xdr } from "@stellar/stellar-base";

// après — le paquet base a été consolidé :
import { xdr } from "@stellar/stellar-sdk";
\`\`\`

Renomme l'import, et la caravane repart. Le reste des notes de migration vit dans la [guidance officielle](https://developers.stellar.org/meetings/2026/04/30#migration-guidance).`,
    },
    {
      kind: "theory",
      body: `La checklist de migration du Forgeborn :

1. **Mets à niveau chaque SDK** et bibliothèque cliente.
2. **Renomme** les imports \`stellar-base\` en \`stellar-sdk\`.
3. **Planifie le passage aux credentials V2** avant le Protocol 28.
4. **Opérateurs de nœud** : Core, RPC, Galexie, Horizon — tout à niveau avant le vote.

Le [guide de mise à niveau](https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide) contient le manifeste complet.`,
    },
    {
      kind: "quiz",
      question: "Ton app JS importe depuis `@stellar/stellar-base`. Après le Protocol 27…",
      options: [
        "Change l'import — le paquet a été consolidé dans @stellar/stellar-sdk",
        "Rien ne change ; il est toujours publié séparément",
        "Tu dois réécrire l'app en Rust",
      ],
      answer: 0,
      explain: "Un seul rename. Le paquet base est entré dans le sdk et n'en est jamais ressorti.",
    },
    {
      kind: "fill",
      prompt: "Corrige l'import pour qu'il franchisse la Porte.",
      file: "app.ts",
      before: "import { xdr } from \"@stellar/stellar-",
      after: "\";",
      choices: ["sdk", "base", "core"],
      answer: 0,
      explain: "stellar-base a été consolidé dans stellar-sdk dans les releases Protocol 27.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — valide le manifeste de la caravane

1. \`JS_XDR_PACKAGE\` — le paquet qui a absorbé l'ancien base.
2. \`TESTNET_UPGRADE\` — \`YYYY-MM-DD\`.
3. \`UPGRADE_ALL_SDKS\` — *tous* les SDKs franchissent-ils la Porte ?

Attendu :

\`\`\`text
caravan cleared the Gate: nothing left behind ✓
\`\`\``,
    },
  ],

  "stellar-protocol-27-6": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Le Spectre vient pour ton coffre avec un sceau volé et un écho parfait. Déploie ce que tu as forgé à travers le Ciel Réécrit :

- \`__check_auth\` — la loi de ton propre compte (VIII.2)
- \`delegate_account_auth\` — la couronne-intendante (VIII.3)
- les sceaux liés à l'adresse — le tueur d'échos (VIII.4)

Il est temps de combiner les trois en un seul compte.`,
    },
    {
      kind: "theory",
      body: `Le plan du \`ZipperAccount\`, dans \`__check_auth\` :

\`\`\`rust
// 1) la clé publique du signataire racine, depuis le storage :
let signer: BytesN<32> = env.storage().instance().get(&SIGNER).unwrap();

// 2) un sceau invalide doit trap :
env.crypto().ed25519_verify(&signer, &payload.into(), &signature);

// 3) le coup du Protocol 27 — confie le reste à l'intendant :
delegate_account_auth(...)
\`\`\`

La signature d'abord, la délégation ensuite. L'écho du Spectre meurt à l'étape 2 ; un intendant forgé meurt à l'étape 3.`,
    },
    {
      kind: "quiz",
      question: "Dans `__check_auth`, qu'est-ce qui défait le replay du Spectre de l'Écho ?",
      options: [
        "Vérifier un payload lié à ce compte — un écho volé ne correspondra pas à une autre adresse",
        "Signer deux fois plus vite que le Spectre",
        "Appeler require_auth sur soi-même, récursivement",
      ],
      answer: 0,
      explain: "Sceaux liés + signatures vérifiées : l'écho n'a plus aucune porte à ouvrir.",
    },
    {
      kind: "fill",
      prompt: "Un sceau invalide doit trap — vérifie la signature sur le payload.",
      file: "lib.rs",
      before: "env.crypto().",
      after: "(&signer, &signature_payload.into(), &signature);",
      choices: ["ed25519_verify", "sha256", "delegate_account_auth"],
      answer: 0,
      explain: "ed25519_verify trap sur une signature invalide — exactement ce qu'un sceau doit faire.",
    },
    {
      kind: "editor",
      intro: `### Le dernier écho du Spectre

Dans \`__check_auth\` :

1. Charge le signataire racine (\`BytesN<32>\`) depuis le storage sous \`SIGNER\`.
2. Vérifie la signature ed25519 sur le payload — \`env.crypto().ed25519_verify(...)\`.
3. Charge l'intendant sous \`DELEGATE\` et appelle \`delegate_account_auth\`.

Exporte le bloc impl. Aucun \`todo!()\` ne survit au final.

Attendu :

\`\`\`text
__check_auth: signature verified, steward honored — the echo is silent ✓
\`\`\``,
    },
  ],
};
