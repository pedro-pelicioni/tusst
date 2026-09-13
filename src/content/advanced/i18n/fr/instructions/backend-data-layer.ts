// FR · editor instructions — The Data Layer.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-data-layer.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendDataLayerInstructionsFr: Record<string, { instructions: string }> = {
  "backend-data-layer-1": {
    instructions: `## Index scan vs seq scan : lignes examinées

Une recherche dans un B-tree est une descente — O(log n) — suivie d'un parcours le long du niveau des feuilles — O(k). Un sequential scan est O(n) quel que soit le prédicat : il examine les 1000 lignes pour en renvoyer 1.

« Lignes examinées », c'est le nombre que \`EXPLAIN ANALYZE\` rapporte comme \`rows\` sur chaque nœud. Affiche-le, et l'asymptotique cesse d'être une affirmation.

### Ta tâche

1. \`seq_scan(rows: &[Row], lo: u32, hi: u32) -> (Vec<u32>, usize)\` — touche chaque ligne, compte chacune touchée, collecte l'\`amount\` de celles dont l'\`id\` tombe dans \`lo..=hi\`.
2. \`index_scan(idx: &BTreeMap<u32, Row>, lo: u32, hi: u32) -> (Vec<u32>, usize)\` — parcours la plage de l'index et ne compte que les entrées que la plage visite vraiment.
3. Dans \`main\`, construis 1000 lignes (\`id\` 1..=1000, \`amount = id * 3\`) et un \`BTreeMap<u32, Row>\` dont la clé est \`id\`.
4. Lance les deux plans sur \`(500, 500)\`, \`(500, 509)\` et \`(500, 599)\`, affiche la table, puis affiche si les deux plans ont renvoyé des lignes identiques.

Sortie attendue :

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

### Indices

- \`idx.range(lo..=hi)\` produit \`(&u32, &Row)\` pour exactement les clés de la plage — il ne visite pas le reste.
- L'en-tête et chaque ligne utilisent \`"{:>11}  {:>7}  {:>9}  {:>9}"\`.
- \`format!("{}..={}", lo, hi)\` construit le label de la plage pour que \`{:>11}\` puisse l'aligner à droite.
- Garde le compte dans un \`examined\` local et fais \`examined += 1\` en tête de chaque corps de boucle — compter les entrées que le plan visite, c'est la mesure, donc ça doit arriver avant le prédicat, pas après.
`,
  },

  "backend-data-layer-2": {
    instructions: `## Index composites et le leftmost prefix

Un index sur \`(tenant, status, created)\` est **une seule** structure dont la clé est le tuple concaténé, ordonnée lexicographiquement. Les seules plages contiguës qu'il contient sont celles que fixe un leftmost prefix.

Un trou au milieu dégrade en un seek de préfixe plus un filtre résiduel — \`Rows Removed by Filter\` dans \`EXPLAIN\`. Un prédicat sans préfixe utilisable reçoit un sequential scan.

### Ta tâche

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, avec \`created\` qui sert aussi d'id de ligne.
2. \`index_scan(idx, lo, hi, keep) -> (usize, usize)\` — parcours \`idx.range(lo..=hi)\`, en comptant chaque entrée visitée et chacune que \`keep\` laisse passer.
3. \`seq_scan(rows, keep) -> (usize, usize)\` — touche chaque ligne, pour les prédicats qu'aucun préfixe ne peut servir.
4. Construis 1000 lignes comme \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\` pour \`id\` dans \`1..=1000\`, et un \`BTreeMap<Key, u32>\` par-dessus.
5. Lance ces cinq requêtes — toutes contre \`tenant = 3\`, \`status = 1\`, \`created >= 700\` — et rapporte quel préfixe chacune a utilisé :

| prédicats | seek depuis | seek jusqu'à | keep |
| --- | --- | --- | --- |
| tenant | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&all\` |
| tenant, status | \`(3, 1, 0)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, status, created | \`(3, 1, 700)\` | \`(3, 1, max)\` | \`&all\` |
| tenant, created | \`(3, 0, 0)\` | \`(3, max, max)\` | \`&late\` |
| status, created | *pas de préfixe* — \`seq_scan\` | | une closure sur \`k.1 == 1 && k.2 >= 700\` |

avec \`let max = u32::MAX;\`, \`let all = \|_k: Key\| true;\` et \`let late = \|k: Key\| k.2 >= 700;\`. La ligne quatre est le trou au milieu : le seek ne peut fixer que \`tenant\`, et \`late\` filtre le reste.

Sortie attendue :

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

### Indices

- La borne supérieure d'un seek de préfixe remplit les colonnes non contraintes avec \`u32::MAX\`.
- \`keep\` est un \`&dyn Fn(Key) -> bool\` ; passe \`&all\` quand le seek est exact et \`&late\` quand c'est un filtre résiduel qui fait le travail.
- \`report\` utilise \`"{:<24}{:<26}{:>9}{:>9}"\`, et l'en-tête aussi.
`,
  },

  "backend-data-layer-3": {
    instructions: `## Le cost model derrière EXPLAIN

Le planner énumère des plans et chiffre chacun en unités arbitraires construites à partir de quatre constantes — \`seq_page_cost\`, \`random_page_cost\`, \`cpu_tuple_cost\`, \`cpu_index_tuple_cost\`. Un seq scan est un prix fixe ; un index scan est un prix par ligne matchée. Ils se croisent, et le planner prend le plus bas.

Les constantes ici sont mises à l'échelle en entiers pour que rien ne dépende des floats.

### Ta tâche

1. \`seq_cost() -> u64\` — \`ROWS / ROWS_PER_PAGE\` pages à \`SEQ_PAGE_COST\`, plus \`ROWS * CPU_TUPLE_COST\`.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` fetches aléatoires pour descendre, puis par ligne matchée un fetch de page aléatoire plus \`CPU_TUPLE_COST + CPU_INDEX_COST\`.
3. Pour chaque sélectivité dans \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` parties par million, dérive \`matched\`, chiffre les deux plans et affiche le plan que le planner choisirait.
4. Trouve le crossover en balayant \`m\` vers le haut jusqu'à \`index_cost(m) >= seq_cost()\`. Ne le code pas en dur.

Sortie attendue :

\`\`\`text
selectivity  matched   seq cost  index cost  plan
     0.010%       10     150000        5220  Index Scan
     0.100%      100     150000       41400  Index Scan
     0.300%      300     150000      121800  Index Scan
     0.500%      500     150000      202200  Seq Scan
     1.000%     1000     150000      403200  Seq Scan
    10.000%    10000     150000     4021200  Seq Scan
crossover: seq scan wins from 371 rows (0.371%)
\`\`\`

### Indices

- \`matched = ROWS * ppm / 1_000_000\`, dans cet ordre — diviser d'abord perd les petites sélectivités.
- L'en-tête et les lignes partagent \`"{:>11}{:>9}{:>11}{:>12}  {}"\`.
- Le label de la ligne du crossover est \`selectivity_label(crossover * 1_000_000 / ROWS)\`.
- Lie les deux prix comme \`seq\` et \`idx\` par ligne ; le plan est \`if idx < seq { "Index Scan" } else { "Seq Scan" }\`, donc une égalité revient au seq scan.
`,
  },

  "backend-data-layer-4": {
    instructions: `## Pagination par cursor vs OFFSET

\`LIMIT 20 OFFSET 4980\` ne fait pas de seek. Le serveur produit les lignes dans l'ordre et jette les 4980 premières. Un index sur la colonne de tri supprime le tri, pas le saut.

Un cursor keyset est la clé de tri de la dernière ligne, ce qui transforme « la page suivante » en un prédicat sur lequel l'index peut seek — O(log n + limit) à n'importe quelle profondeur.

### Ta tâche

1. \`offset_page(rows: &[u32], offset: usize, limit: usize) -> (Vec<u32>, usize)\` — lis depuis le début et compte **chaque** ligne lue, y compris celles que l'offset jette.
2. \`cursor_page(idx: &BTreeMap<u32, u32>, after: u32, limit: usize) -> (Vec<u32>, usize)\` — seek strictement après \`after\` et lis exactement \`limit\` lignes.
3. 5000 lignes, \`PAGE = 20\`. Compare les pages 1, 10, 50 et 250, en affichant les lignes lues pour chaque approche, et suis si les deux ont renvoyé des pages identiques.
4. Puis crawle les 250 pages des deux façons et affiche les deux totaux.

Sortie attendue :

\`\`\`text
 page  first id  offset rows read  cursor rows read
    1         1                20                20
   10       181               200                20
   50       981              1000                20
  250      4981              5000                20
full crawl of 250 pages: offset reads 627500, cursor reads 5000
same rows on every page: true
\`\`\`

### Indices

- \`idx.range((Bound::Excluded(after), Bound::Unbounded))\` est le seek. \`Bound::Included\` renvoie à nouveau la dernière ligne de la page précédente.
- Le cursor de la page 1 est \`0\`, qui est en dessous de tous les id de la table.
- La table utilise \`"{:>5}{:>10}{:>18}{:>18}"\`.
- Compte dans un \`read\` local avec \`read += 1\` par ligne. Ne va **pas** chercher \`.skip(offset)\` pour rajouter \`offset\` ensuite : tout le point, c'est que les lignes jetées sont produites une par une, et un adaptateur d'itérateur cache exactement le coût que la leçon mesure.
`,
  },

  "backend-data-layer-5": {
    instructions: `## Niveaux d'isolation et les anomalies que chacun permet

Chaque anomalie est définie par ce qu'une relecture voit. Un **dirty read** voit une écriture non commitée. Un **non-repeatable read** voit une ligne changer entre deux lectures. Un **phantom read** voit l'*ensemble* changer entre deux requêtes de plage.

Les niveaux ANSI sont définis par celles qu'ils interdisent. Read Committed prend un snapshot par statement ; Repeatable Read en prend un par transaction.

### Ta tâche

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — une fonction, quatre règles. \`ReadUncommitted\` superpose \`pending\` à \`committed\` ; \`ReadCommitted\` renvoie \`committed\` ; \`RepeatableRead\` renvoie le snapshot plus les lignes commitées qui en sont absentes ; \`Serializable\` renvoie le snapshot seul.
2. \`read(level, store, snapshot, key) -> i64\` pioche une clé dans l'ensemble visible (\`0\` si absente).
3. \`count_at_least(level, store, snapshot, min) -> usize\` lance une requête de plage sur l'ensemble visible.
4. Trace trois étapes : une écriture **pending** de \`200\` sur la clé 1, puis cette écriture **commitée**, puis une nouvelle ligne \`(3, 100)\` insérée. Note les lectures de chaque niveau à chaque étape.
5. Affiche les lectures, puis **dérive** la table des anomalies à partir d'elles — un dirty read, c'est \`read #1 == 200\`, un non-repeatable read, c'est \`read #2 != 100\`, un phantom, c'est \`rows >= 100\` différent de \`2\`.

Sortie attendue :

\`\`\`text
level                 read #1  read #2  rows >= 100
read uncommitted          200      200            3
read committed            100      200            3
repeatable read           100      100            3
serializable              100      100            2

anomaly                RU    RC    RR   SER
dirty read            yes    no    no    no
non-repeatable read   yes   yes    no    no
phantom read          yes   yes   yes    no
\`\`\`

### Indices

- Le snapshot est \`vec![(1, 100), (2, 100)]\` et ne change jamais.
- Repeatable Read est la règle intéressante : elle garde les *valeurs* du snapshot mais voit quand même les lignes qui n'y existaient pas, ce qui explique qu'elle montre le phantom et pas le non-repeatable read.
- \`"{:<20}{:>9}{:>9}{:>13}"\` pour la première table, \`"{:<20}{:>5}{:>6}{:>6}{:>6}"\` pour la seconde, et un \`println!();\` nu entre les deux.
`,
  },

  "backend-data-layer-6": {
    instructions: `## Transactions, rollback et prepared statements

Une transaction est un buffer d'écriture plus une règle d'atomicité : à l'intérieur, les lectures voient tes propres écritures non commitées ; à l'extérieur, personne ne les voit avant le \`COMMIT\`. \`ROLLBACK\` ne défait donc rien — il jette un buffer qui n'a jamais été appliqué.

Un prepared statement est de l'état de parse et de plan côté serveur, nommé et réutilisé. \`EXECUTE\` envoie des valeurs, pas du texte SQL.

### Ta tâche

1. \`Db\` tient \`rows\`, un vecteur \`plans\` et un compteur \`executions\`. \`prepare(sql)\` renvoie le handle existant si ce texte exact a déjà été compilé, sinon pousse et renvoie le nouvel index. \`execute(plan)\` ne fait qu'incrémenter \`executions\`.
2. \`Txn\` bufferise les écritures dans un \`BTreeMap<u32, i64>\`. \`get\` lit à travers le buffer puis retombe sur le store ; \`set\` bufferise ; \`commit\` applique chaque écriture bufferisée à \`db.rows\` ; \`rollback\` jette le buffer.
3. \`transfer(db, plan, from, to, amount)\` — débite \`from\`, crédite \`to\` (en appelant \`execute\` pour chacun), puis relis \`from\`. S'il est passé en négatif, fais rollback et renvoie \`Err(format!("CHECK balance >= 0 violated: {}", after))\`. Sinon, commit.
4. Ouvre avec \`a = 100\`, \`b = 50\`. Transfère \`30\` (commit), puis \`prepare\` le même SQL à nouveau et transfère \`500\` (viole la vérification). Affiche les snapshots et les statistiques de plan.

Sortie attendue :

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

### Indices

- \`self.plans.iter().position(|p| *p == sql)\` trouve un plan déjà compilé.
- \`commit(self, db)\` prend \`self\` par valeur, donc le buffer ne peut plus être utilisé ensuite — c'est le système de types qui fait respecter le cycle de vie.
- \`-430\`, c'est \`70 - 500\` : le débit est bufferisé avant que la vérification ne tourne, et c'est ce qui rend la vérification significative.
`,
  },

  "backend-data-layer-7": {
    instructions: `## Connection pools et où part la latence

Un pool est un nombre fixe de slots plus une file. La latence observée par le client, c'est **attente en file + temps de requête**, et c'est pour ça que la base rapporte une requête SQL rapide pendant que le client voit une requête HTTP lente — les deux nombres mesurent des intervalles différents.

Passé la concurrence utile de la base, les slots supplémentaires n'ajoutent aucun throughput ; ils déplacent la file dans la base, où elle devient de la contention.

### Ta tâche

1. \`service_times() -> Vec<u32>\` — un LCG déterministe. \`seed\` démarre à \`1\` ; à chaque pas \`seed = (seed * 1103515245 + 12345) % 2147483648\`, et le temps de service est \`5 + (seed >> 16) % 21\`. Produis-en \`REQUESTS\`.
2. \`simulate(capacity, service) -> (u32, u32, usize, u32)\` — la requête \`i\` arrive à \`i * ARRIVAL_GAP\` et prend le slot libéré le plus tôt. Renvoie \`(max wait, mean wait, checkout timeouts, makespan)\` ; une attente au-delà de \`CHECKOUT_TIMEOUT\` compte comme un timeout.
3. Affiche les temps de service et le travail total de la base, puis une ligne par capacité dans \`[1, 2, 4, 8, 16]\`.

Sortie attendue :

\`\`\`text
service times (ms): [22, 9, 17, 6, 18, 25, 20, 11, 5, 17, 24, 25, 17, 11, 16, 13]
total db work: 256 ms over 16 requests

 capacity  max wait  mean wait  timeouts  makespan
        1       198         96        11       256
        2        74         34         4       132
        4        17          5         0        75
        8         0          0         0        58
       16         0          0         0        58
\`\`\`

### Indices

- Utilise \`wrapping_mul\` / \`wrapping_add\` sur un seed \`u64\` pour que la multiplication ne puisse pas déborder sous \`-D warnings\`.
- \`free_at\` est \`vec![0u32; capacity]\` ; une requête démarre à \`max(free_at[slot], arrival)\`, et son attente est \`start - arrival\`.
- L'attente moyenne est une division entière : \`total_wait / REQUESTS as u32\`.
- Rien ici ne touche l'horloge. La simulation doit être déterministe.
`,
  },
};
