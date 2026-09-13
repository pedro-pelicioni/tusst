import type { LessonStep } from "@/content/steps";

// FR · The Data Layer.
//
// Overlay for ../../steps/backend-data-layer.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendDataLayerStepsFr: Record<string, LessonStep[]> = {
  "backend-data-layer-1": [
    {
      kind: "theory",
      body: `Un index B-tree est une structure ordonnée. Chercher une clé, c'est une **descente** à travers les nœuds internes — O(log n) — suivie d'un **parcours séquentiel** le long du niveau des feuilles chaînées, tant que le prédicat tient — O(k), où k est le nombre de lignes renvoyées. Total : O(log n + k).

Un sequential scan est O(n) quel que soit le prédicat. Pour renvoyer une ligne sur mille, il lit les mille et en jette 999.

\`\`\`text
seq scan     id BETWEEN 500 AND 500   →  1000 lignes examinées, 1 renvoyée
index scan   id BETWEEN 500 AND 500   →     1 ligne  examinée, 1 renvoyée
\`\`\`

« Lignes examinées » n'est pas une figure de style. C'est le nombre que le planner budgète, et le nombre que \`EXPLAIN ANALYZE\` affiche comme \`rows\` sur chaque nœud. Cette leçon l'affiche aussi, pour que l'asymptotique cesse d'être une affirmation à prendre sur parole.`,
    },
    {
      kind: "theory",
      body: `L'autre colonne du bilan.

Un index est une **seconde copie, ordonnée,** des colonnes de clé plus un pointeur vers la ligne. Chaque \`INSERT\`, chaque \`DELETE\` et chaque \`UPDATE\` qui touche une colonne indexée doit aussi l'écrire. Trois index sur une table chaude triplent en gros la write amplification et le volume de WAL que la réplication et le backup doivent ensuite porter.

Il doit aussi rester résident pour être bon marché. Un index sur lequel personne ne filtre, ne joint ni ne trie est du coût pur, payé à chaque écriture, pour toujours.

Et l'index ne gagne pas toujours en lecture non plus. Son coût est **proportionnel aux lignes qui matchent**, et dans un vrai moteur chaque ligne matchée peut être un fetch de page aléatoire. À 50 % de sélectivité, le sequential scan est tout simplement moins cher, et le planner le sait. La leçon 3 calcule exactement où les deux courbes se croisent ; pour l'instant, retiens juste qu'un crossover existe.`,
    },
    {
      kind: "quiz",
      question:
        "Une requête sur une table de 10 millions de lignes en matche 6 millions. Il y a un index B-tree sur la colonne du prédicat. Pourquoi le planner peut-il quand même choisir un sequential scan ?",
      options: [
        "Le coût de l'index scan grandit avec les lignes matchées, donc passé un crossover il dépasse le coût fixe du seq scan",
        "Les index B-tree ne sont consultés que pour des prédicats d'égalité, jamais pour des ranges",
        "L'index n'est utilisé qu'une fois que la table dépasse le seuil de taille du planner",
      ],
      answer: 0,
      explain:
        "Un index rend rapide une requête *sélective*. Le seq scan paie un prix fixe pour toute la table ; l'index paie par ligne matchée, plus un fetch aléatoire à chaque fois. Six millions de lignes matchées, c'est très loin au-delà du point où le prix fixe est la bonne affaire.",
    },
    {
      kind: "fill",
      prompt:
        "Fais faire à l'index scan un seek sur la plage de clés au lieu de parcourir tout l'index.",
      file: "main.rs",
      before: "for (_key, r) in ",
      after: " {",
      choices: [
        "idx.range(lo..=hi)",
        "idx.iter().filter(|(k, _)| **k >= lo && **k <= hi)",
        "idx.values().take((hi - lo + 1) as usize)",
      ],
      answer: 0,
      explain:
        "La version avec filter renvoie les mêmes lignes et c'est la tentante — mais elle examine les 1000 entrées pour y arriver, ce qui est un sequential scan déguisé en index. `take` lit le bon *nombre* au mauvais *endroit* : les k premières entrées, pas celles de la plage.",
    },
    {
      kind: "quiz",
      question:
        "Une table dominée par les lectures reçoit un quatrième index. Quel coût viens-tu d'accepter ?",
      options: [
        "Chaque écriture sur cette table maintient désormais une quatrième structure ordonnée, et le WAL la transporte",
        "Rien de significatif — les lectures dominent la charge, donc la maintenance est amortie",
        "Seulement l'espace disque ; la maintenance de l'index se fait en arrière-plan au moment du checkpoint",
      ],
      answer: 0,
      explain:
        "La maintenance est par *écriture*, pas par lecture, donc un ratio lecture:écriture élevé ne l'amortit pas — ça veut juste dire que le coût tombe sur un plus petit nombre de statements. Et ces statements sont d'habitude ceux qui sont sensibles à la latence.",
    },
    {
      kind: "editor",
      intro: `### Compte les lignes que chaque plan examine

1. \`seq_scan(rows, lo, hi) -> (Vec<u32>, usize)\` — touche chaque ligne, compte chacune touchée, collecte l'\`amount\` de celles dont l'\`id\` est dans la plage.
2. \`index_scan(idx, lo, hi) -> (Vec<u32>, usize)\` — utilise \`idx.range(lo..=hi)\` et ne compte que les entrées que la plage visite vraiment.
3. Construis 1000 lignes (\`id\` 1..=1000, \`amount = id * 3\`) et un index \`BTreeMap<u32, Row>\` par-dessus.
4. Lance les deux plans sur \`500..=500\`, \`500..=509\` et \`500..=599\`, affiche la table, puis confirme que les deux plans ont renvoyé des lignes identiques.

Sortie attendue :

\`\`\`text
      range  matched   seq rows   idx rows
  500..=500        1       1000          1
  500..=509       10       1000         10
  500..=599      100       1000        100
same rows returned: true
\`\`\`

Même réponse, trois ordres de grandeur d'écart en travail effectué.`,
    },
  ],

  "backend-data-layer-2": [
    {
      kind: "theory",
      body: `Un index sur \`(tenant, status, created)\` est **une seule** structure ordonnée, dont la clé est le tuple concaténé. Ce n'est pas trois index, et il n'est pas symétrique dans ses colonnes.

L'ordre est lexicographique. Donc les seules plages de clés contiguës que la structure contient sont celles que fixe un **leftmost prefix** :

\`\`\`text
(tenant)                     ✓ contigu
(tenant, status)             ✓ contigu
(tenant, status, created)    ✓ contigu
(status)                     ✗ pas un préfixe
(created)                    ✗ pas un préfixe
(status, created)            ✗ pas un préfixe
\`\`\`

Un prédicat sur \`status\` seul ne nomme aucune plage contiguë — les entrées qui matchent sont éparpillées dans tout l'index, une fois par tenant. Il n'y a nulle part où seek, donc le planner retombe sur un sequential scan de la table.`,
    },
    {
      kind: "theory",
      body: `Deux façons pour un index composite de dégrader en deçà d'un seek complet.

**Un trou au milieu.** \`tenant\` et \`created\` sans \`status\` donne un seek de préfixe sur \`tenant\` plus un **filtre résiduel** sur tout ce qu'il trouve : il examine chaque ligne de ce tenant et ne renvoie que celles qui matchent aussi. L'écart entre examinées et matchées est précisément le \`Rows Removed by Filter\` de \`EXPLAIN ANALYZE\`, et c'est là que la latence se cache — l'exercice affiche 100 examinées pour 30 matchées.

**Un range trop tôt.** Seule la *dernière* colonne utilisée dans le seek peut être un range. Un range sur \`status\` transforme \`created\` en filtre plutôt qu'en clé de seek. D'où la règle : colonnes d'égalité d'abord, colonne de range en dernier.

**Covering index.** Si l'index porte chaque colonne que la requête lit, le heap n'est jamais touché — un index-only scan.

Le même deal existe un niveau plus haut, dans le schema. Une colonne dénormalisée est un join matérialisé que tu peux ensuite indexer : tu achètes du coût de lecture avec de la write amplification et la possibilité d'anomalies de mise à jour. Exactement le marché que fait un index, à une autre granularité.`,
    },
    {
      kind: "quiz",
      question:
        "Avec un seul index sur `(tenant, status, created)`, quelle requête peut seek une plage contiguë de celui-ci ?",
      options: [
        "`WHERE tenant = 3 AND status = 1` — un leftmost prefix",
        "`WHERE status = 1 AND created > 700` — les deux colonnes sont dans l'index, donc l'index peut la servir",
        "`WHERE created > 700` — la colonne de range est indexée, donc la plage est contiguë",
      ],
      answer: 0,
      explain:
        "Le critère n'est pas l'appartenance ; c'est la position. Les entrées pour `status = 1` ne sont contiguës qu'*au sein* d'un tenant, donc sans prédicat sur `tenant` elles sont éparpillées dans toute la structure. Servir `(status, created)` demande un second index, avec son propre coût d'écriture.",
    },
    {
      kind: "fill",
      prompt:
        "Seek directement au début de `tenant = 3, status = 1, created >= 700`.",
      file: "main.rs",
      before: "let (e, m) = index_scan(&idx, ",
      after: ", (3, 1, max), &all);",
      choices: ["(3, 1, 700)", "(3, 700, 1)", "(0, 0, 700)"],
      answer: 0,
      explain:
        "La clé est un tuple dans l'ordre de l'index — `(tenant, status, created)` — pas dans l'ordre où les prédicats ont été écrits. `(0, 0, 700)`, c'est croire qu'une clé de départ ne peut contraindre que la colonne de range ; elle ferait un seek tout au début de l'index et lirait tout.",
    },
    {
      kind: "quiz",
      question:
        "`EXPLAIN ANALYZE` montre un Index Scan avec `rows=30` et `Rows Removed by Filter: 70`. Que s'est-il passé ?",
      options: [
        "L'index a fait un seek sur un préfixe, puis un filtre résiduel a jeté 70 des 100 lignes qu'il a examinées",
        "L'index a renvoyé 30 lignes et l'executor a jeté 70 doublons produits par le scan",
        "70 lignes ont été retirées par un join ultérieur, et l'index a examiné exactement les 30 qu'il a renvoyées",
      ],
      answer: 0,
      explain:
        "Un index scan n'examine que ce qu'il renvoie quand le seek utilise un préfixe *complet*. Avec un trou, il examine toute la plage du préfixe et filtre. Cette ligne, c'est le coût de la colonne manquante, chiffré — et la croyance bien rangée qu'un index ne touche que ce qu'il renvoie est ce qui la fait mal lire.",
    },
    {
      kind: "editor",
      intro: `### Prouve la règle du leftmost prefix

1. \`type Key = (u32, u32, u32);\` — \`(tenant, status, created)\`, avec \`created\` qui sert aussi d'id de ligne.
2. \`index_scan(idx, lo, hi, keep) -> (examined, matched)\` — parcours \`idx.range(lo..=hi)\`, compte chaque entrée visitée et chacune que \`keep\` laisse passer.
3. \`seq_scan(rows, keep) -> (examined, matched)\` — pour les prédicats qu'aucun préfixe ne peut servir.
4. Construis 1000 lignes : \`((id - 1) % 10, ((id - 1) / 10) % 3, id)\`, et un \`BTreeMap<Key, u32>\` par-dessus.
5. Lance les cinq requêtes et affiche quel préfixe chacune a utilisé.

Sortie attendue :

\`\`\`text
predicates              prefix used                examined  matched
tenant                  tenant                          100      100
tenant, status          tenant, status                   33       33
tenant, status, created tenant, status, created          10       10
tenant, created         tenant                          100       30
status, created         none - seq scan                1000      100
\`\`\`

La ligne quatre est le filtre résiduel. La ligne cinq est ce qu'un préfixe manquant coûte vraiment.`,
    },
  ],

  "backend-data-layer-3": [
    {
      kind: "theory",
      body: `Le planner ne connaît pas les millisecondes. Il énumère des plans candidats et chiffre chacun en unités arbitraires assemblées à partir d'une poignée de constantes :

\`\`\`text
seq_page_cost           1.0     une page lue séquentiellement
random_page_cost        4.0     une page fetchée aléatoirement
cpu_tuple_cost          0.01    traiter une ligne
cpu_index_tuple_cost    0.005   traiter une entrée d'index
\`\`\`

**Seq scan** = \`pages x seq_page_cost + rows x cpu_tuple_cost\`. Un prix fixe, indépendant du nombre de lignes qui matchent.

**Index scan** = descente + \`matched x (random_page_cost + cpu costs)\`. Un prix par ligne matchée.

L'un est plat, l'autre a une pente. Ils se croisent, et le planner prend celui qui est le plus bas au nombre de lignes estimé. C'est toute la sélection de plan. Le \`cost=X..Y\` de \`EXPLAIN\`, c'est exactement ces nombres : coût de démarrage, puis coût total.

Ce sont les valeurs par défaut livrées avec Postgres. L'exercice travaille dans les mêmes unités multipliées par 100 pour que rien ne dépende des floats, et arrondit \`cpu_index_tuple_cost\` à une unité — c'est le plus petit terme de la somme, et il déplace le crossover de moins de deux lignes sur cent mille.`,
    },
    {
      kind: "theory",
      body: `Tout ce qui précède dépend d'une entrée que le planner doit deviner : **combien de lignes vont matcher**.

La sélectivité vient des statistiques — \`n_distinct\`, la liste des most-common-values et l'histogramme, tous collectés par \`ANALYZE\`. Le plan n'est jamais meilleur que cette estimation.

La panne classique en production, c'est une statistique périmée ou absente. Le planner estime 10 lignes, en reçoit 200 000, et s'accroche à un nested loop qui aurait dû être un hash join. Donc quand tu lis un \`EXPLAIN ANALYZE\`, compare les \`rows\` estimées aux \`rows\` réelles **d'abord** : un écart de 1000x là, c'est le bug, et le plan n'en est que le symptôme.

Le crossover arrive aussi bien plus tôt que l'intuition ne le suggère. Avec les constantes par défaut, l'index perd bien en dessous de 1 % de la table. « L'index n'est pas utilisé » veut presque toujours dire « le prédicat n'est pas assez sélectif ».

**Le partitionnement** change l'arithmétique, pas la formule : un prédicat sur la clé de partition élimine des partitions entières avant le chiffrage (partition pruning), donc le planner chiffre une table plus petite. **Le sharding** est la même coupe, mais entre machines — à la différence près que rien ne planifie à travers les shards pour toi. Le fan-out et le merge, c'est le code de ton application.`,
    },
    {
      kind: "quiz",
      question:
        "Une requête qui devrait utiliser un index fait un seq scan. Quelle action s'attaque à la vraie cause ?",
      options: [
        "Comparer rows estimées vs réelles dans `EXPLAIN ANALYZE`, puis corriger l'estimation ou la sélectivité du prédicat",
        "`REINDEX` la table — l'index s'est dégradé et le planner ne lui fait plus confiance",
        "Créer un second index sur la même colonne pour que le planner ait une alternative à chiffrer",
      ],
      answer: 0,
      explain:
        "Le planner n'a pas oublié l'index ; il l'a chiffré et l'a trouvé plus cher. Un index en double reçoit le même prix. `REINDEX` corrige le bloat, qui est un vrai problème mais pas celui-ci — le levier, c'est l'estimation de lignes (`ANALYZE`, statistiques étendues) ou le prédicat lui-même.",
    },
    {
      kind: "fill",
      prompt:
        "Chiffre une ligne matchée d'un index scan : le fetch de page est aléatoire, pas séquentiel.",
      file: "main.rs",
      before: "    INDEX_DEPTH * RANDOM_PAGE_COST\n        + matched * (",
      after: ")",
      choices: [
        "RANDOM_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "SEQ_PAGE_COST + CPU_TUPLE_COST + CPU_INDEX_COST",
        "CPU_TUPLE_COST + CPU_INDEX_COST",
      ],
      answer: 0,
      explain:
        "L'ordre de l'index n'est pas l'ordre du heap, donc chaque ligne matchée est un fetch vers une page arbitraire — ce 4x est toute la raison pour laquelle un crossover existe. Facturer `seq_page_cost` repousserait le crossover d'un facteur quatre ; ne facturer aucun coût de page voudrait dire que l'index gagne toujours, ce qui est exactement la croyance que les chiffres réfutent.",
    },
    {
      kind: "quiz",
      question:
        "La base tourne sur NVMe. Que fait vraiment le fait de baisser `random_page_cost` de 4.0 à 1.1 ?",
      options: [
        "Ça déplace le point de crossover de chaque requête de la base, en poussant les plans vers les index scans partout",
        "Rien de mesurable — c'est un réglage de documentation qui décrit le matériel aux opérateurs",
        "Ça ne s'applique qu'aux bitmap heap scans, où les fetches aléatoires sont déjà triés par ordre de page",
      ],
      answer: 0,
      explain:
        "Le ratio entre `random_page_cost` et `seq_page_cost` est ce qui fixe le crossover. Le changer re-chiffre chaque index scan que le planner considérera un jour — un des réglages au plus fort levier du système, et celui qu'on laisse le plus souvent à une valeur calibrée pour des disques à plateaux.",
    },
    {
      kind: "editor",
      intro: `### Chiffre les deux plans et trouve le crossover

1. \`seq_cost() -> u64\` — pages lues séquentiellement, plus un coût CPU par ligne.
2. \`index_cost(matched: u64) -> u64\` — \`INDEX_DEPTH\` fetches aléatoires pour descendre, puis un fetch de page aléatoire plus les coûts CPU par ligne matchée.
3. Pour chaque sélectivité dans \`[100, 1_000, 3_000, 5_000, 10_000, 100_000]\` parties par million, dérive \`matched = ROWS * ppm / 1_000_000\`, chiffre les deux plans et affiche celui que le planner choisirait.
4. Puis **trouve** le crossover en balayant \`m\` vers le haut jusqu'à \`index_cost(m) >= seq_cost()\` — ne le code pas en dur.

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

371 lignes sur 100 000. C'est là que commence « l'index n'est pas utilisé ».`,
    },
  ],

  "backend-data-layer-4": [
    {
      kind: "theory",
      body: `\`LIMIT 20 OFFSET 4980\` ne saute nulle part. Le serveur produit les lignes dans l'ordre, jette les 4980 premières et renvoie les 20 suivantes. Le coût est O(offset + limit) — la page 250 coûte 250 fois la page 1.

Un index sur la colonne de tri supprime le **tri**, pas le **saut**. Les lignes arrivent déjà ordonnées, et sont quand même produites puis jetées une par une.

\`\`\`text
page   1   →  20 lignes lues,  20 renvoyées
page  10   → 200 lignes lues,  20 renvoyées
page 250   → 5000 lignes lues, 20 renvoyées
\`\`\`

Le nombre qui compte, c'est le crawl entier, parce que c'est ce qu'un export en arrière-plan ou un client à scroll infini exécute vraiment : 250 pages coûtent 627 500 lectures de ligne par \`OFFSET\` et 5 000 par cursor.`,
    },
    {
      kind: "theory",
      body: `Un **cursor**, c'est la clé de tri de la dernière ligne. La page suivante est :

\`\`\`sql
WHERE (created_at, id) > ($1, $2)
ORDER BY created_at, id
LIMIT 20
\`\`\`

C'est un prédicat sur lequel l'index peut seek, donc chaque page coûte O(log n + limit) quelle que soit sa profondeur.

Il a une exigence : un **ordre total**. \`ORDER BY created_at\` seul n'en est pas un — les égalités font apparaître des lignes sur deux pages ou sur aucune. Ajoute un tiebreak unique (la primary key) et compare comme un tuple.

C'est une correction de justesse autant que de vitesse. Sur une table qui reçoit des inserts, \`OFFSET\` saute et duplique silencieusement des lignes entre deux fetches de page, parce que l'offset est mesuré contre un résultat qui a changé sous lui. Un cursor est ancré à une ligne, donc il ne peut pas. *Services RPC à l'échelle*, leçon 7, compte les lignes qu'un client perd comme ça ; ici, la mesure, c'est le coût.

Le deal est honnête : un cursor ne peut pas sauter à la page 47 ni afficher un nombre de pages. Si l'UI a besoin de pages numérotées sur une grosse table, c'est une décision produit avec un prix attaché.

À travers les shards, le cursor est ce qui rend le fan-out abordable — chaque shard seek son propre cursor et renvoie \`limit\` lignes à merger. Avec \`OFFSET\`, chaque shard doit produire \`offset + limit\` lignes et en jeter presque toutes.`,
    },
    {
      kind: "quiz",
      question:
        "La colonne du `ORDER BY` est indexée, et la page 900 d'un export paginé part quand même en timeout. Pourquoi ?",
      options: [
        "L'index fournit l'ordre mais pas le saut — les 18 000 lignes précédentes sont toujours produites puis jetées",
        "L'index ne peut pas être utilisé avec `LIMIT`, donc le planner retombe sur un sort",
        "Le résultat ne tient plus dans `work_mem`, donc le tri déborde sur disque",
      ],
      answer: 0,
      explain:
        "C'est la croyance qui livre une requête rapide en staging, où tu ne regardes jamais que la page 1, et qui part en timeout en production à la page 900. L'index a supprimé le tri. Rien n'a supprimé le saut.",
    },
    {
      kind: "fill",
      prompt:
        "Seek à la première ligne strictement après le dernier id que la page précédente a renvoyé.",
      file: "main.rs",
      before: "for (id, _) in idx.range((",
      after: ", Bound::Unbounded)) {",
      choices: [
        "Bound::Excluded(after)",
        "Bound::Included(after)",
        "Bound::Unbounded",
      ],
      answer: 0,
      explain:
        "`Included` renvoie à nouveau la dernière ligne de la page précédente à chaque page — le off-by-one classique du keyset, et un qui a l'air correct jusqu'à ce que quelqu'un compte. `Unbounded` repart du début à chaque fois, ce qui est `OFFSET 0` pour toujours.",
    },
    {
      kind: "quiz",
      question: "Qu'est-ce qui rend un cursor keyset plus rapide qu'`OFFSET` ?",
      options: [
        "Il transporte la clé de tri de la dernière ligne, donc il devient un prédicat `WHERE` sur lequel l'index peut seek",
        "C'est un offset encodé, et le décoder côté serveur évite de re-parser la requête",
        "Il met en cache le résultat de la page précédente sur le serveur, et la page suivante repart de là",
      ],
      answer: 0,
      explain:
        "L'encodage, c'est de l'emballage, pas du mécanisme — un offset encodé se comporte exactement comme `OFFSET`. Ce qui le rend rapide, c'est que la valeur du cursor peut être comparée à la clé de l'index. Il n'y a aucun état côté serveur, et c'est aussi pour ça qu'il survit à une reconnexion.",
    },
    {
      kind: "editor",
      intro: `### Compte ce qu'OFFSET lit

1. \`offset_page(rows, offset, limit) -> (Vec<u32>, usize)\` — lis depuis le début, compte chaque ligne lue **y compris celles sautées**, puis collecte \`limit\` lignes.
2. \`cursor_page(idx, after, limit) -> (Vec<u32>, usize)\` — seek avec \`Bound::Excluded(after)\` et lis exactement \`limit\` lignes.
3. 5000 lignes, pages de 20. Compare les pages 1, 10, 50 et 250, et vérifie que les deux approches renvoient des pages identiques.
4. Puis crawle les 250 pages des deux façons et affiche les totaux.

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

125x moins de lignes lues, pour une sortie identique.`,
    },
  ],

  "backend-data-layer-5": [
    {
      kind: "theory",
      body: `Les trois anomalies classiques sont chacune définies par ce qu'une **relecture** voit.

**Dirty read** — tu observes une valeur qu'une autre transaction a écrite et pas encore commitée. Si elle fait rollback, tu as agi sur une donnée qui n'a jamais existé.

**Non-repeatable read** — tu lis la même ligne deux fois dans une transaction et tu obtiens deux valeurs différentes, parce qu'une autre transaction a commité entre les deux.

**Phantom read** — tu lances la même requête de plage deux fois et la seconde renvoie des lignes qui n'étaient pas là avant. Les lignes que tu avais déjà lues n'ont pas changé ; c'est l'*ensemble* qui a changé.

Les niveaux d'isolation ANSI sont définis par celles qu'ils interdisent — pas par comment. Cette distinction, c'est la leçon : le niveau est un contrat, le mécanisme est l'affaire du moteur.`,
    },
    {
      kind: "theory",
      body: `Ce que les implémentations font vraiment.

**Read Committed** prend un snapshot frais par *statement*. **Repeatable Read** en prend un par *transaction*. Cette seule différence produit la deuxième colonne de la table que tu vas afficher.

Les noms des niveaux sont un **plancher, pas une spécification**. Le \`REPEATABLE READ\` de Postgres est de la snapshot isolation et ne permet pas les phantoms, alors qu'ANSI le lui permettrait. L'InnoDB de MySQL utilise des next-key locks et en bloque aussi la plupart. Ne porte jamais une hypothèse sur les anomalies d'un moteur à l'autre sur la foi d'un nom de niveau.

La snapshot isolation permet encore le **write skew** : deux transactions lisent chacune un ensemble, vérifient chacune un invariant, écrivent chacune une ligne *différente*, et l'invariant finit violé sans qu'aucune ait vu de conflit. Seul le vrai \`SERIALIZABLE\` (SSI dans Postgres) l'interdit — et il l'interdit en **abortant** une transaction avec une serialization failure. Du code serializable sans retry loop n'est pas serializable en pratique.

Le locking, c'est le côté coût. Les row locks sont bon marché et nombreux ; les page locks et table locks sont grossiers et bon marché à suivre. Certains moteurs escaladent les row locks en table locks sous pression mémoire, et là la concurrence s'effondre. Un prédicat de plage serializable a besoin d'un predicate lock ou d'un gap lock couvrant des lignes qui n'existent pas encore — c'est pour ça que c'est le niveau cher.`,
    },
    {
      kind: "quiz",
      question:
        "Un rapport qui tourne longtemps s'exécute en `REPEATABLE READ`. Qu'est-ce que ça garantit ?",
      options: [
        "Le rapport voit un seul snapshot cohérent ; les autres transactions commitent librement et il ne les voit tout simplement pas",
        "Aucune autre transaction ne peut commiter de changements sur les lignes que le rapport lit tant qu'il n'a pas fini",
        "Les propres écritures du rapport sont garanties de réussir au commit, puisque son snapshot est figé",
      ],
      answer: 0,
      explain:
        "L'isolation, c'est une affaire de visibilité, pas d'exclusion. Traiter une longue transaction comme un lock, c'est comme ça qu'on finit par tenir l'horizon du vacuum ouvert pendant une heure pour protéger des données que personne n'écrivait — et une écriture de cette transaction peut quand même être rejetée au commit.",
    },
    {
      kind: "fill",
      prompt:
        "Read Committed prend un snapshot frais par statement — il voit tout ce qui est commité à l'instant.",
      file: "main.rs",
      before: "        Level::ReadCommitted => ",
      after: ",",
      choices: [
        "store.committed.clone()",
        "snapshot.to_vec()",
        "store.pending.clone()",
      ],
      answer: 0,
      explain:
        "`snapshot.to_vec()` est la règle de Repeatable Read — un snapshot pour toute la transaction — et intervertir les deux est la confusion la plus courante entre les niveaux. `pending` seul ne montrerait que les écritures non commitées et rien de la table commitée.",
    },
    {
      kind: "quiz",
      question:
        "Un service passe de `READ COMMITTED` à `SERIALIZABLE` et ne change rien d'autre. Quel est le résultat probable ?",
      options: [
        "Les requêtes se mettent à échouer sous contention avec des erreurs de sérialisation, parce que rien ne relance les transactions abortées",
        "Le throughput baisse mais la justesse s'améliore strictement, puisque toute anomalie est désormais impossible",
        "Rien ne change sur Postgres, où `READ COMMITTED` fournit déjà une sémantique serializable",
      ],
      answer: 0,
      explain:
        "`SERIALIZABLE` convertit des anomalies silencieuses en aborts bruyants — une amélioration seulement si l'appelant fait un retry. Sans retry loop, l'application est moins correcte qu'avant, parce qu'elle renvoie maintenant des erreurs là où elle renvoyait des réponses légèrement fausses. (Défauts à connaître : Read Committed dans Postgres, Repeatable Read dans MySQL.)",
    },
    {
      kind: "editor",
      intro: `### Dérive la table des anomalies à partir d'une trace

1. \`visible(level, store, snapshot) -> Vec<(u32, i64)>\` — une fonction, quatre règles. Read Uncommitted superpose \`pending\` à \`committed\` ; Read Committed renvoie \`committed\` ; Repeatable Read renvoie le snapshot plus les lignes qui n'y existaient pas ; Serializable renvoie le snapshot seul.
2. \`read(...)\` pioche une clé dans l'ensemble visible ; \`count_at_least(...)\` lance une requête de plage dessus — c'est là que le phantom apparaît.
3. Trace trois étapes : une écriture pending de \`200\` sur la clé 1, puis cette écriture commitée, puis une nouvelle ligne 3 insérée.
4. Affiche les lectures, puis **dérive** la table des anomalies à partir d'elles — ne l'affirme pas.

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

L'escalier, c'est le point : chaque niveau interdit une anomalie de plus que le précédent.`,
    },
  ],

  "backend-data-layer-6": [
    {
      kind: "theory",
      body: `Une transaction, c'est un **buffer d'écriture plus une règle d'atomicité**.

À l'intérieur de la transaction, les lectures voient tes propres écritures non commitées. À l'extérieur, rien ne les voit avant le \`COMMIT\`. C'est tout le read-your-own-writes, et l'exercice l'implémente comme un lookup qui vérifie le buffer avant le store.

\`ROLLBACK\` n'est donc **pas un undo**. Les changements n'ont jamais été appliqués nulle part où quelqu'un d'autre pouvait les voir — le buffer est jeté, ou les enregistrements non commités du WAL ne sont tout simplement jamais rejoués. Rollback une transaction d'un million de lignes n'est pas proportionnellement cher.

La durabilité vient du write-ahead log : \`COMMIT\` est un \`fsync\` de l'enregistrement de log, pas des pages de données. Ce \`fsync\` est le plancher dur de la latence d'écriture, et c'est pour ça que commiter 1000 lignes en une transaction bat 1000 transactions, et que le group commit existe.

Ce qu'une longue transaction coûte vraiment, ce n'est pas du travail de rollback. Ce sont les locks qu'elle tient et l'horizon de vacuum ou d'undo qu'elle épingle, si bien que les vieilles versions de ligne ne peuvent pas être récupérées.`,
    },
    {
      kind: "theory",
      body: `Un prepared statement, c'est de l'**état côté serveur**.

\`PREPARE\` parse le SQL, construit un plan et le nomme. \`EXECUTE\` envoie les *valeurs* des paramètres sur le fil, pas du texte SQL. La réutilisation économise le parse et généralement le plan, ce qui, pour une requête OLTP courte, est une vraie fraction du temps total.

C'est aussi la bonne défense contre l'injection, pour une raison structurelle : les paramètres arrivent hors bande et ne sont jamais donnés au parser. L'échappement est un filtre que tu peux rater ; le binding de paramètres est un canal qui ne peut pas transporter de syntaxe.

Deux pièges.

**C'est par connexion.** Un pooler en transaction mode te donne un backend différent à chaque transaction, donc le plan nommé n'est pas là. C'est la raison concrète pour laquelle le transaction mode de pgbouncer et les prepared statements se sont historiquement battus, et pour laquelle les drivers re-préparent après une reconnexion.

**Un plan réutilisé est un plan générique**, choisi sans connaître les valeurs de paramètres de cet appel. Sur une colonne biaisée, il peut être bien pire qu'un plan recalculé ; Postgres se couvre en chiffrant des plans custom pour les cinq premières exécutions avant de décider.

Les deadlocks ont leur place ici parce que c'est une panne au niveau transaction. Deux transactions qui mettent à jour les deux mêmes lignes dans des ordres opposés forment un cycle ; le moteur le détecte et en tue une avec une erreur de deadlock — il ne se bloque pas. Corrige ça en ordonnant les écritures sur une clé stable et en gardant les transactions courtes, et rends chaque appelant capable de relancer une victime de deadlock.`,
    },
    {
      kind: "quiz",
      question:
        "Un job en masse écrit 2 millions de lignes en une transaction, puis tombe sur une violation de contrainte. Que coûte le `ROLLBACK` ?",
      options: [
        "Presque rien — les écritures n'ont jamais été commitées, donc il n'y a rien à défaire là où d'autres pouvaient voir",
        "À peu près le coût des écritures une seconde fois, puisque chacune doit être inversée",
        "Rien au moment du rollback, mais une réécriture complète de la table au prochain checkpoint",
      ],
      answer: 0,
      explain:
        "La conclusion qui sonne opérationnellement raisonnable — « donc découpe les grosses écritures en petites transactions pour garder le rollback bon marché » — a le bon conseil et la mauvaise raison. Découpe-les à cause de la durée des locks et de l'horizon de vacuum que la longue transaction épingle, pas parce que le rollback est cher.",
    },
    {
      kind: "fill",
      prompt:
        "La contrainte a échoué. Jette les écritures bufferisées plutôt que de les appliquer puis les inverser.",
      file: "main.rs",
      before: "    if after < 0 {\n        ",
      after:
        ";\n        return Err(format!(\"CHECK balance >= 0 violated: {}\", after));\n    }",
      choices: ["txn.rollback()", "txn.set(from, a)", "txn.commit(db)"],
      answer: 0,
      explain:
        "`txn.set(from, a)` est l'écriture compensatoire — ce que tu fais quand tu n'as pas de transaction. Il n'y a rien à compenser : le store n'a jamais été touché. `commit` applique justement l'écriture que la vérification vient de rejeter.",
    },
    {
      kind: "quiz",
      question: "Que réutilise vraiment un prepared statement ?",
      options: [
        "De l'état de parse et de plan côté serveur, tenu par connexion et référencé par nom",
        "Un template SQL côté client, avec les valeurs de paramètres interpolées avant l'envoi",
        "Un résultat mis en cache sur le serveur, renvoyé à nouveau quand les mêmes paramètres arrivent",
      ],
      answer: 0,
      explain:
        "Ce seul fait explique les trois propriétés d'un coup : c'est rapide parce qu'il n'y a rien à re-parser, à l'épreuve de l'injection parce que les valeurs n'atteignent jamais le parser, et cassé sous un pooler en transaction mode parce que la connexion qui porte l'état n'est pas celle que tu récupères.",
    },
    {
      kind: "editor",
      intro: `### Commit, rollback, et prépare une seule fois

1. \`Db\` tient \`rows\`, les \`plans\` compilés et un compteur \`executions\`. \`prepare(sql)\` renvoie le handle existant si ce texte a déjà été compilé ; \`execute(plan)\` ne fait qu'incrémenter le compteur.
2. \`Txn\` bufferise les écritures dans un \`BTreeMap<u32, i64>\`. \`get\` lit à travers le buffer puis retombe sur le store ; \`set\` bufferise ; \`commit\` applique chaque écriture bufferisée ; \`rollback\` jette le buffer.
3. \`transfer(...)\` débite, crédite, puis vérifie \`balance >= 0\` — en commitant ou en faisant rollback selon le cas.
4. Lance un transfert de \`30\` (commit) et un transfert de \`500\` (viole la vérification). Prépare le même SQL deux fois et montre que le handle est le même.

Sortie attendue :

\`\`\`text
opening         a=100   b=50    total=150
after commit    a=70    b=80    total=150
rolled back: CHECK balance >= 0 violated: -430
after rollback  a=70    b=80    total=150
plans compiled: 1  same handle: true  executions: 4
\`\`\`

Quatre exécutions, une compilation — et le transfert annulé n'a laissé aucune trace dans le store.`,
    },
  ],

  "backend-data-layer-7": [
    {
      kind: "theory",
      body: `Un connection pool, c'est un **nombre fixe de slots plus une file**.

Ouvrir une connexion Postgres coûte un handshake TCP, du TLS, une authentification et un processus backend forké — de quelques millisecondes à quelques dizaines. Un pool amortit ça en en gardant N ouvertes et en les distribuant : check out, utilise, check in.

Donc la latence qu'un client observe, c'est **attente en file + temps de requête**. Quand le pool est saturé, le premier terme domine et le second ne bouge pas. C'est pour ça que \`pg_stat_statements\` montre une requête SQL rapide au moment même où le client voit une requête HTTP lente : les deux nombres mesurent des intervalles différents, et ils sont tous les deux justes.

L'épuisement se manifeste par un timeout de checkout — \`PoolTimedOut\`, \`TimeoutError: QueuePool limit ... overflow\`. C'est un signal de capacité sur ton service, pas une faute de la base.

La simulation le rend concret : à capacité 1, la pire requête attend 198 ms pour un pool dont la plus longue requête SQL dure 25 ms.`,
    },
    {
      kind: "theory",
      body: `Plus gros n'est pas mieux.

Passé la concurrence utile de la base — grosso modo les cœurs plus le parallélisme I/O effectif — les slots de pool supplémentaires n'ajoutent aucun throughput. Ils déplacent la file hors de ton processus, où elle est mesurable et bornée, vers la base, où elle devient de la contention de locks et des changements de contexte qui dégradent chaque autre client. L'exercice le montre sans détour : 8 slots et 16 slots produisent un makespan identique.

Le vrai plafond est multiplicatif : **instances x taille du pool vs \`max_connections\`**. Dix pods avec un pool de 20, c'est 200 connexions pour un seul service. Aplatir ça, c'est le rôle d'un pooler côté serveur (pgbouncer, pgcat), au prix des restrictions du transaction mode sur l'état de session.

Le correctif le moins cher n'est généralement pas un pool plus gros mais un **checkout plus court**. Ne tiens jamais une connexion à travers un appel HTTP, et n'ouvre jamais la transaction avant d'avoir tout ce qu'il faut pour la finir.

Les read replicas ont leur propre pool et leur propre lag. La réplication est asynchrone par défaut, donc une lecture lancée quelques millisecondes après ta propre écriture peut légitimement renvoyer la valeur d'avant. Read-your-writes, ça veut dire router cette lecture vers le primary, ou attendre que la replica atteigne le LSN que ton commit a renvoyé. « C'est eventually consistent » n'est pas un design ; la règle de routage, si.`,
    },
    {
      kind: "quiz",
      question:
        "Le p99 d'un endpoint saute de 30 ms à 400 ms. La base rapporte la même requête à 4 ms de moyenne, inchangée. Quelle est la première chose à regarder ?",
      options: [
        "L'attente de checkout de connexion — la latence du client inclut du temps de file que la base ne voit jamais",
        "Le plan de la requête, puisqu'un p99 à 400 ms sur une moyenne à 4 ms veut dire que le plan a basculé pour certaines valeurs de paramètres",
        "Le bloat d'index, qui ralentit certaines exécutions sans bouger la moyenne que la base rapporte",
      ],
      answer: 0,
      explain:
        "Le réflexe de tuner la requête, c'est ce qui coûte une journée pour rien. Le chrono de la base démarre quand le statement arrive sur une connexion ; celui du client démarre quand la requête HTTP arrive. Sous un pool saturé, l'écart entre les deux est toute la régression.",
    },
    {
      kind: "fill",
      prompt:
        "Mesure ce que le client subit vraiment avant que la requête ne commence.",
      file: "main.rs",
      before: "        let wait = ",
      after: ";",
      choices: ["start - arrival", "free_at[slot] - arrival", "ms"],
      answer: 0,
      explain:
        "`ms` est la durée de la requête elle-même — le nombre que la base rapporte, et celui qui reste plat pendant que le p99 du client explose. `free_at[slot] - arrival` fait un underflow quand le slot était déjà libre avant l'arrivée de la requête, ce qui est précisément le cas sans contention.",
    },
    {
      kind: "quiz",
      question:
        "Des timeouts de checkout apparaissent en pic de charge. Pourquoi augmenter la taille du pool est-il le mauvais premier geste ?",
      options: [
        "Ça échange une erreur bornée et visible contre de la contention dans la base — et, multiplié par les instances, contre une panne `too many connections` qui touche tous les services",
        "La taille du pool ne peut pas être changée sans redémarrer l'application, donc ce n'est pas une option pendant un incident",
        "Un pool plus gros augmente la mémoire par connexion, et c'est le seul vrai coût",
      ],
      answer: 0,
      explain:
        "Un timeout sur un pool borné, c'est le système qui dit la vérité sur sa capacité. Retirer la borne n'ajoute pas de capacité — ça déplace la file là où tu ne la vois pas, et ça met une ressource partagée en danger pour le compte d'un seul service.",
    },
    {
      kind: "editor",
      intro: `### Lis l'attente en file d'un pool

1. \`service_times()\` — un LCG déterministe : seed \`1\`, \`next = seed * 1103515245 + 12345 mod 2^31\`, service \`= 5 + (next >> 16) % 21\`. Seize d'entre eux.
2. \`simulate(capacity, service) -> (max wait, mean wait, timeouts, makespan)\` — les requêtes arrivent toutes les 3 ms et prennent le slot libéré le plus tôt. L'attente est \`start - arrival\` ; une attente au-delà de \`CHECKOUT_TIMEOUT\` compte comme un timeout.
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

Aucune requête n'est devenue plus lente entre capacité 1 et capacité 8. Seule l'attente a changé — et note que 16 slots n'apportent rien de plus que 8.`,
    },
  ],
};
