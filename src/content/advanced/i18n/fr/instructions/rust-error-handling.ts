// FR · editor instructions — Errors That Survive Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-error-handling.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustErrorHandlingInstructionsFr: Record<string, { instructions: string }> = {
  "rust-error-handling-1": {
    instructions: `## Propage, ne panique pas

\`?\` unwrap le \`Ok\` et retourne tôt sur un \`Err\`, en convertissant l'erreur avec \`From\` au passage. C'est un opérateur de contrôle de flux, pas un unwrap — l'échec continue de remonter jusqu'à ce que quelqu'un le gère.

### Ta tâche

Écris \`fn parse_amount(raw: &str) -> Result<i64, std::num::ParseIntError>\` qui trim l'entrée, la parse en \`i64\` **avec \`?\`**, et renvoie le double de la valeur.

Dans \`main\`, appelle-la avec \`" 21 "\` et avec \`"x"\`, en faisant un \`match\` sur chaque résultat et en affichant \`ok: <v>\` ou \`err: <e>\`.

Sortie attendue :

\`\`\`text
ok: 42
err: invalid digit found in string
\`\`\`

La deuxième ligne est le texte \`Display\` de \`ParseIntError\` lui-même — ce n'est pas toi qui l'écris.

### Indices

- \`raw.trim().parse()\` infère son type cible depuis l'annotation du binding.
- \`Ok(n * 2)\` est le chemin de succès.
`,
  },

  "rust-error-handling-2": {
    instructions: `## Modélise l'échec, ne le stringifie pas

\`Result<T, String>\` ne se match pas et ne porte aucune donnée structurée. Modélise l'échec comme un enum, une variante par chose qui peut vraiment mal tourner, avec les données dont un opérateur aura besoin déjà dans la variante.

### Ta tâche

1. \`#[derive(Debug)] enum TxError { Empty, TooLarge { limit: u32, got: u32 } }\`
2. \`fn validate(size: u32) -> Result<u32, TxError>\` : \`0\` → \`Empty\` ; au-dessus de \`100\` → \`TooLarge\` avec la limite \`100\` ; sinon \`Ok(size)\`.
3. Affiche le \`{:?}\` de \`validate(50)\`, \`validate(0)\`, \`validate(150)\`.

Sortie attendue :

\`\`\`text
Ok(50)
Err(Empty)
Err(TooLarge { limit: 100, got: 150 })
\`\`\`

### Indices

- \`return Err(...)\` tôt pour chaque cas d'échec, puis \`Ok(size)\` en queue.
`,
  },

  "rust-error-handling-3": {
    instructions: `## Laisse ? faire la conversion

\`?\` appelle \`From::from\` sur l'erreur au moment où elle quitte la fonction. Implémente \`From\` une fois et chaque \`?\` du module convertit gratuitement.

N'implémente jamais \`Into\` à la main — le blanket impl de std te le donne à partir de \`From\`, et \`?\` cherche \`From\`.

### Ta tâche

1. \`#[derive(Debug)] enum ConfigError { BadNumber(ParseIntError), Missing }\`
2. \`impl From<ParseIntError> for ConfigError\` qui produit \`BadNumber\`.
3. \`fn read_port(raw: Option<&str>) -> Result<u16, ConfigError>\` : \`ok_or\` sur le cas \`Missing\`, puis \`parse()?\` — **sans aucune** conversion explicite nulle part.
4. Affiche le \`{:?}\` de \`read_port(Some("8080"))\`, \`read_port(None)\`, \`read_port(Some("no"))\`.

Sortie attendue :

\`\`\`text
Ok(8080)
Err(Missing)
Err(BadNumber(ParseIntError { kind: InvalidDigit }))
\`\`\`

### Indices

- \`use std::num::ParseIntError;\`
- \`raw.ok_or(ConfigError::Missing)?\` transforme l'\`Option\` en \`Result\` et l'unwrap.
`,
  },

  "rust-error-handling-4": {
    instructions: `## Les deux messages qu'une erreur te doit

**\`Debug\`** est pour un développeur, dans un log ou un échec de test — dérive-le.
**\`Display\`** est pour un humain, une phrase, en minuscules, sans point final — écris-le.

\`impl std::error::Error\` (souvent un bloc vide) est ce qui fait du type une *erreur* : ça débloque \`Box<dyn Error>\`, le \`?\` vers des types effacés, et le chaînage par \`source()\`.

### Ta tâche

1. \`#[derive(Debug)] struct TimeoutError { ms: u64 }\`
2. \`impl fmt::Display\` qui affiche \`request timed out after <ms>ms\`.
3. \`impl Error for TimeoutError {}\` — vide.
4. Dans \`main\` : affiche une instance (\`ms: 5000\`) avec \`{}\` et avec \`{:?}\`, puis boxe une deuxième (\`ms: 250\`) en \`Box<dyn Error>\` et affiche-la.

Sortie attendue :

\`\`\`text
display: request timed out after 5000ms
debug: TimeoutError { ms: 5000 }
boxed: request timed out after 250ms
\`\`\`

### Indices

- \`use std::error::Error;\` et \`use std::fmt;\`
- La signature est \`fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result\`.
`,
  },

  "rust-error-handling-5": {
    instructions: `## Garde la cause attachée

\`Error::source\` attache la raison. Chaque couche énonce **sa propre intention** et garde la couche du dessous intacte — sans jamais inliner la cause dans son propre \`Display\`, sinon une chaîne de N niveaux affiche le même texte N fois.

### Ta tâche

1. \`#[derive(Debug)] struct Io(String)\` — le \`Display\` affiche \`io failure: <texte>\`, impl \`Error\` vide.
2. \`#[derive(Debug)] struct LoadFailed { cause: Io }\` — le \`Display\` affiche exactement \`could not load config\`, sans mention de la cause.
3. \`impl Error for LoadFailed\` avec \`source()\` qui renvoie \`Some(&self.cause)\`.
4. Dans \`main\` : construis-en une avec la cause \`permission denied\`, affiche-la, puis parcours la chaîne en affichant \`"  caused by: <e>"\` à chaque niveau.

Sortie attendue :

\`\`\`text
could not load config
  caused by: io failure: permission denied
\`\`\`

### Indices

- Le parcours de la chaîne, c'est \`let mut cause = err.source(); while let Some(e) = cause { ...; cause = e.source(); }\`
- Le type de retour de \`source\` est \`Option<&(dyn Error + 'static)>\`.
`,
  },

  "rust-error-handling-6": {
    instructions: `## Condition ou bug

**Une condition** est quelque chose que le monde extérieur a le droit de faire — une entrée malformée, un timeout, une connexion fermée. Pas un bug. Ça reçoit un \`Result\` ou une \`Option\`.

**Un bug** est un invariant violé que ton propre code était censé maintenir. Continuer au-delà, c'est calculer sur des données que tu as déjà prouvées fausses. Ça reçoit un \`panic!\` ou un \`assert!\`.

Dans un handler, un \`unwrap\` sur une entrée est un déni de service que n'importe qui peut déclencher exprès.

### Ta tâche

1. \`fn checked_index(data: &[i64], i: usize) -> Option<i64>\` — une condition. Utilise \`.get(i).copied()\`.
2. \`fn invariant_index(data: &[i64], i: usize) -> i64\` — l'appelant garantit les bornes, donc une violation est un bug. \`assert!\` avec un message nommant l'index et la longueur, puis indexe directement.
3. Dans \`main\`, avec \`vec![10, 20, 30]\` : affiche \`checked_index\` à \`1\` et à \`9\` avec \`{:?}\`, puis \`invariant_index\` à \`2\`.

Sortie attendue :

\`\`\`text
in range: Some(20)
out of range: None
invariant holds: 30
\`\`\`

### Indices

- \`.get()\` donne \`Option<&i64>\` ; \`.copied()\` en fait un \`Option<i64>\`.
- \`assert!(cond, "…{}…", value)\` accepte des arguments de format.
`,
  },
};
