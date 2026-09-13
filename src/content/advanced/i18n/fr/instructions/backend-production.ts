// FR · editor instructions — Running It in Production.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-production.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendProductionInstructionsFr: Record<string, { instructions: string }> = {
  "backend-production-1": {
    instructions: `## Counters, gauges et histograms

Un **counter** est monotone et sa valeur en soi ne veut rien dire — tu lis son taux. Un **gauge** est un niveau à un instant donné qui bouge dans les deux sens. Un **histogram** est un ensemble de counters de bucket cumulatifs plus \`_sum\` et \`_count\`.

Deux pièges. Un gauge n'est jamais vu qu'au moment du scrape, donc tout ce qui monte et redescend entre deux scrapes est invisible. Et chaque valeur distincte de label est une série temporelle à part — les labels sont pour des ensembles bornés, jamais pour un id utilisateur.

### Ta tâche

1. Implémente \`Histogram\` : \`observe(v)\` ajoute \`v\` à \`sum\` et incrémente le premier bucket dont la borne est \`>= v\` ; \`count()\` totalise les observations ; \`above(bound)\` lit la queue de distribution à partir des buckets.
2. Parcours les 12 ticks. Le counter prend \`ARRIVALS[t]\` ; le gauge prend \`ARRIVALS[t] - DEPARTURES[t]\`. Suis le vrai pic à chaque tick et le pic qu'un scrape verrait, en scrapant quand \`t % 3 == 2\`.
3. Observe chaque latence, affiche la ligne des buckets, puis la moyenne et combien ont dépassé 100 ms.

Sortie attendue :

\`\`\`text
tick  accepted  active  scrape
   0         4       4  -
   1        10       9  -
   2        12       3  yes
   3        21      11  -
   4        26      14  -
   5        27       4  yes
   6        30       5  -
   7        37      11  -
   8        39       5  yes
   9        43       8  -
  10        46       9  -
  11        47       2  yes

counter accepted_total = 47 (monotonic)
gauge   active = 2, true peak = 14, peak seen by scrapes = 5

le<=10 le<=50 le<=100 le<=500 +Inf
    15      2       0       3    0
mean = 42.2 ms; over 100 ms = 3 of 20
\`\`\`

### Indices

- \`observe\` parcourt \`BOUNDS\` tant que \`v > BOUNDS[i]\`, donc une valeur égale à une borne reste dans ce bucket. L'index qui sort de la boucle est \`4\` (le bucket \`+Inf\`) pour tout ce qui dépasse \`500\`.
- \`above(100)\` trouve la première borne \`>= 100\` et additionne chaque bucket après elle. Ne garde pas les échantillons pour les trier — l'intérêt, c'est que les buckets savent déjà.
- La colonne scrape affiche \`"yes"\` ou \`"-"\` ; l'en-tête est \`tick  accepted  active  scrape\` avec les largeurs \`{:>4}  {:>8}  {:>6}\`.
- Appelle le gauge \`active\` : \`Gauge\` porte à la fois \`value\` et \`peak\`, et le vrai pic est tenu à jour avec \`if active.value > active.peak { active.peak = active.value; }\` à chaque tick — pas seulement sur un scrape.
`,
  },

  "backend-production-2": {
    instructions: `## Des percentiles à partir des buckets

La moyenne est exacte : \`_sum / _count\`. Un quantile ne l'est pas — tu calcules un rang, tu parcours les comptes de bucket cumulés jusqu'à le franchir, et tu rapportes la **borne supérieure** de ce bucket. Tes bornes sont la résolution de ta réponse.

Les percentiles ne sont pas linéaires, donc les p99 par instance ne peuvent ni être moyennés ni maxés. **Les comptes de bucket, eux, s'additionnent**, et c'est pour ça que la requête de flotte additionne les buckets avant de calculer le quantile.

### Ta tâche

1. Implémente \`count()\`, \`mean()\` et \`quantile(q)\` — rang \`ceil(q · n)\`, parcours les comptes cumulés, renvoie la borne supérieure du bucket franchi (\`f64::INFINITY\` pour \`+Inf\`).
2. Construis \`api-1\` et \`api-2\` à partir des comptes dans les commentaires du starter, puis \`merged\` en additionnant les buckets et en additionnant les sommes.
3. Affiche la table des buckets, puis une ligne count/sum/mean/p50/p95/p99 par histogram.
4. Affiche la moyenne des deux p95 face au vrai p95 fusionné, et pareil pour le p99.

Sortie attendue :

\`\`\`text
le       api-1  api-2  merged
1         120      0     120
2         300      0     300
5         380      2     382
10        150      3     153
25         40     10      50
100         5     20      25
500         4     40      44
2000        1     25      26
+Inf        0      0       0

          count       sum    mean     p50     p95     p99
api-1      1000      4200     4.2       5      10      25
api-2       100     42000   420.0     500    2000    2000
merged     1100     46200    42.0       5     500    2000

mean of the p95s: 1005.0   true merged p95: 500
mean of the p99s: 1012.5   true merged p99: 2000
\`\`\`

### Indices

- Un helper \`row(h: &Hist)\` garde les trois lignes identiques : \`"{:<8} {:>6} {:>9.0} {:>7.1} {:>7.0} {:>7.0} {:>7.0}"\`.
- Le label de la table des buckets est \`"+Inf"\` quand \`i == BOUNDS.len()\`, sinon \`BOUNDS[i].to_string()\`.
- La ligne d'en-tête s'affiche avec la même format string que les lignes de données, avec \`""\` dans la colonne du nom.
- Dans \`quantile\`, parcours avec un \`cum\` local : \`cum += self.counts[i]\`, et renvoie dès que \`cum >= rank\`.
`,
  },

  "backend-production-3": {
    instructions: `## Logs structurés et un ID de corrélation

\`level=error event=user_load_failed user_id=91 org_id=4 err=timeout\` est un enregistrement avec des dimensions requêtables. Une phrase formatée est une seule string opaque que tu ne peux que regexer.

Un log de production, c'est plein de requêtes entrelacées, donc un ID de requête transporté à travers chaque couche est ce qui retransforme le stream en une seule histoire. Ajoute \`depth\` et tu obtiens l'arbre de spans — et root moins children, c'est le temps propre du handler.

### Ta tâche

1. \`fn emit(...) -> String\` construit une ligne : \`seq\` complété par des zéros sur deux chiffres, puis \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — plus \`dur_ms\` **seulement sur un end**, et \`level=warn\` quand un end dépasse 40 ms.
2. Émets les 12 events dans l'ordre, seq commençant à 1.
3. Filtre sur \`req=7f3a\`. Pour chaque start, trouve son end correspondant, et affiche le span indenté de \`depth * 2\` avec sa durée.
4. Affiche root, children et unaccounted, puis combien des 12 lignes ont matché.

Sortie attendue :

\`\`\`text
--- log stream (two requests interleaved) ---
seq=01 level=info req=7f3a span=http.request depth=0 event=start
seq=02 level=info req=7f3a span=auth.verify depth=1 event=start
seq=03 level=info req=b91c span=http.request depth=0 event=start
seq=04 level=info req=7f3a span=auth.verify depth=1 event=end dur_ms=3
seq=05 level=info req=b91c span=auth.verify depth=1 event=start
seq=06 level=info req=7f3a span=db.query depth=1 event=start
seq=07 level=info req=b91c span=auth.verify depth=1 event=end dur_ms=2
seq=08 level=info req=b91c span=db.query depth=1 event=start
seq=09 level=warn req=7f3a span=db.query depth=1 event=end dur_ms=41
seq=10 level=warn req=7f3a span=http.request depth=0 event=end dur_ms=46
seq=11 level=info req=b91c span=db.query depth=1 event=end dur_ms=7
seq=12 level=info req=b91c span=http.request depth=0 event=end dur_ms=11

--- filtered req=7f3a ---
http.request      46ms
  auth.verify      3ms
  db.query        41ms
root 46ms, children 44ms, unaccounted 2ms
lines matching req=7f3a: 6 of 12
\`\`\`

### Indices

- \`"seq={:02} level={} req={} span={} depth={} event={}"\`, puis \`push_str\` du suffixe \`" dur_ms={}"\` sur un end.
- La ligne de l'arbre utilise des largeurs calculées au runtime : \`"{:indent$}{:<w$}{:>4}ms"\` avec \`indent = depth * 2\` et \`w = 16 - depth * 2\`.
- Les children sont les events \`end\` à \`depth == 1\` ; le root est \`depth == 0\`. N'additionne pas les deux.
- Lie la durée du root à \`total\` et la somme des children à \`child\` ; le travail propre du handler est \`total - child\`.
`,
  },

  "backend-production-4": {
    instructions: `## Backoff, jitter et un budget de retry

Le backoff exponentiel espace les retries mais les **synchronise** : les clients qui ont échoué ensemble réessaient ensemble. Le full jitter — un délai tiré uniformément dans \`[0, backoff]\` — est ce qui les décorrèle, et un plafond empêche un client de tenir un slot de connexion pendant 17 minutes.

Les retries multiplient la charge exactement quand la capacité est au plus bas. Un budget de retry borne l'amplification à une fraction du volume de requêtes, côté client, quel que soit le taux d'échec.

### Ta tâche

1. Implémente le LCG : \`next()\` multiplie par \`6364136223846793005\` et ajoute \`1442695040888963407\` (en wrapping), et renvoie \`state >> 33\` ; \`below(n)\` vaut \`next() % n\`, et \`0\` quand \`n\` vaut \`0\`.
2. Seede avec \`0x2545F491\` et affiche, pour les tentatives \`0..5\`, le backoff plafonné (\`BASE_MS << attempt\`, plafonné à \`CAP_MS\`) à côté d'un tirage full-jitter.
3. Compte le total des tentatives sans budget : chaque appel qui échoue prend \`MAX_RETRIES\`.
4. Recompte-les avec un budget : gagne \`BUDGET_PER_CALL\` par appel, paie \`RETRY_COST\` par retry, refuse le retry quand tu ne peux pas payer. Affiche tentatives, amplification et la répartition accordés/refusés pour les deux.

Sortie attendue :

\`\`\`text
attempt  backoff_ms  full_jitter_ms
      0         100              45
      1         200               1
      2         400             169
      3         800             501
      4        1000             517

40 calls, 25 of them failing, max 3 retries each
policy       attempts  amplification  granted  denied
no budget         115           2.88x       75       0
10% budget         43           1.07x        3      72
\`\`\`

### Indices

- Tire le jitter avec \`rng.below(b + 1)\` pour que tout l'intervalle fermé soit atteignable — c'est pour ça que la tentative 1 affiche 1 ms.
- \`BASE_MS.saturating_mul(1u64 << attempt)\`, puis plafonne à \`CAP_MS\`.
- Calcule le délai ; ne le dors jamais. La leçon est déterministe exprès.
- Les deux lignes de politique partagent \`"{:<12} {:>8}  {:>13.2}x {:>8}  {:>6}"\` ; le nombre d'accordés de la ligne sans budget est \`naive - CALLS\`.
- Garde le solde du budget dans un \`tokens\` local : \`tokens += BUDGET_PER_CALL\` par appel, et \`tokens -= RETRY_COST\` pour chaque retry que tu accordes.
`,
  },

  "backend-production-5": {
    instructions: `## Un circuit breaker comme machine à états

**Closed** laisse passer les appels ; une série d'échecs le déclenche. **Open** ne fait aucun appel du tout — l'appelant échoue en microsecondes au lieu d'un timeout de 30 secondes. Après un cooldown, **half-open** admet exactement une sonde : un succès ferme le breaker et efface la série, un échec le rouvre et relance le cooldown.

Le breaker protège les threads et les slots de connexion de l'appelant au moins autant qu'il protège la dépendance.

### Ta tâche

Affiche \`t\`, l'état à l'entrée, l'action, le résultat et l'état suivant, pour les 22 ticks.

- **closed** — appel. \`THRESHOLD\` échecs consécutifs le font passer en open, en enregistrant \`opened_at\`.
- **open** — court-circuit. \`COOLDOWN\` ticks après \`opened_at\`, passe en half-open.
- **half-open** — une sonde. Un succès ferme le breaker et efface la série ; un échec le rouvre et relance le cooldown.

Termine avec le nombre d'appels en aval effectués et le nombre de ticks court-circuités.

Sortie attendue :

\`\`\`text
t   state      action         result    next
0   closed     call           ok        closed
1   closed     call           ok        closed
2   closed     call           ok        closed
3   closed     call           fail 1/3  closed
4   closed     call           fail 2/3  closed
5   closed     call           fail 3/3  open
6   open       short-circuit  -         open
7   open       short-circuit  -         open
8   open       short-circuit  -         open
9   half-open  probe          fail      open
10  open       short-circuit  -         open
11  open       short-circuit  -         open
12  open       short-circuit  -         open
13  half-open  probe          fail      open
14  open       short-circuit  -         open
15  open       short-circuit  -         open
16  open       short-circuit  -         open
17  half-open  probe          ok        closed
18  closed     call           ok        closed
19  closed     call           ok        closed
20  closed     call           ok        closed
21  closed     call           ok        closed

downstream calls: 13, short-circuited: 9 of 22 ticks
\`\`\`

### Indices

- Applique la transition de cooldown en *haut* du tick, puis prends un snapshot \`before = state\` — la ligne affiche l'état à l'entrée et l'état à la sortie.
- La colonne result vaut \`"fail {}/{}"\` pour un échec en closed mais un simple \`"fail"\` pour une sonde ratée, donc branche sur \`before == State::HalfOpen\`.
- \`t.saturating_sub(opened_at) >= COOLDOWN\` garde t=0 sûr.
- Format de ligne : \`"{:<3} {:<10} {:<14} {:<9} {}"\`.
- La série d'échecs est un \`consecutive\` local : un échec l'incrémente et déclenche à \`consecutive >= THRESHOLD\` ; n'importe quel succès remet \`consecutive = 0\`.
`,
  },

  "backend-production-6": {
    instructions: `## Graceful shutdown

Quatre phases, dans cet ordre : arrêter d'accepter (la readiness échoue d'abord, puis le listener ferme), drainer ce qui est en vol, borner le drain avec une deadline, fermer de force le reste.

Sortir immédiatement sur SIGTERM tue chaque requête en vol. Drainer ne tue que celles encore en cours à la deadline — et la deadline doit tenir sous la grace period de l'orchestrateur, sinon SIGKILL arrive en premier et il n'y a eu aucun drain du tout.

### Ta tâche

À chaque tick : admets les arrivées du tick seulement tant que tu acceptes (sinon compte un 503), décrémente chaque requête en vol, retire celles qui atteignent 0, et affiche la ligne.

- À \`SIGTERM_AT\` : arrête d'accepter, bascule la readiness en \`503\`, et retiens combien étaient en vol.
- Arrête-toi quand \`in_flight\` est vide (un drain propre), ou quand \`DEADLINE\` ticks se sont écoulés depuis SIGTERM — puis ferme de force ce qui reste, en affichant les ids avec \`{:?}\`.
- Termine avec completed, rejected et force-closed, puis ce qu'une sortie immédiate aurait tué à la place.

Sortie attendue :

\`\`\`text
t   accepting  ready  arrived  admitted  in_flight  done
0   yes        200    2        2         2          0
1   yes        200    1        1         1          2
2   yes        200    3        3         3          3
3   yes        200    1        1         3          4
4   yes        200    2        2         5          4
5   no         503    2        0         4          5
6   no         503    0        0         2          7
7   no         503    0        0         2          7
8   no         503    0        0         1          8
9   no         503    0        0         1          8
10  no         503    0        0         1          8
11  no         503    0        0         1          8
12  no         503    0        0         1          8
13  no         503    0        0         1          8
deadline hit at t=13 -- force-closing [8]

completed 8, rejected 2 (503 after SIGTERM), force-closed 1
immediate exit at t=5 would have killed 5 in-flight instead
\`\`\`

### Indices

- Boucle avec \`for t in 0..20u32\` et sors avec \`break\` ; le run se termine à t=13.
- Décrémente d'abord, puis \`in_flight.retain(|r| r.left > 0)\` ; \`completed\` est la baisse de longueur.
- Les arrivées au-delà de \`ARRIVALS.len()\` valent \`0\`, donc les deux arrivées de t=5 sont les seuls rejets.
- Format de ligne : \`"{:<3} {:<10} {:<6} {:<8} {:<9} {:<10} {}"\`.
- Enregistre le tick du signal dans \`sigterm_tick\` ; le drain se termine quand \`t - sigterm_tick >= DEADLINE\`.
`,
  },

  "backend-production-7": {
    instructions: `## La loi de Little

\`L = λ · W\`. L est le nombre de requêtes dans le système, λ le taux d'arrivée, W le temps passé dans le système. Ça tient pour n'importe quel système stable, sans aucune hypothèse sur la distribution des arrivées.

Sous la capacité, la latence, c'est le temps de service. Au-delà, le backlog grandit linéairement et sans borne, donc c'est la cible de latence qui fixe la limite de concurrence : admets L, rejette la suivante immédiatement.

### Ta tâche

1. \`capacity()\` vaut \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` vaut \`lambda * w_s\` — écris la loi de Little une fois et réutilise-la.
2. Pour chaque taux offert, affiche L, l'utilisation, le backlog après une seconde de surcharge, la latence résultante (\`SERVICE_S + backlog / capacity()\`) et un verdict \`ok\`, \`at capacity\` ou \`saturated\`.
3. Affiche les workers nécessaires pour servir le pic au temps de service actuel.
4. Transforme \`TARGET_MS\` en limite de concurrence, découpe-la en en-service et en-file, et affiche combien de temps la surcharge met à remplir la file.

Sortie attendue :

\`\`\`text
capacity = L / W = 32 / 0.020s = 1600 rps

offered      L  util%  backlog_1s  latency_ms  verdict
    400    8.0   25.0           0        20.0  ok
    800   16.0   50.0           0        20.0  ok
   1200   24.0   75.0           0        20.0  ok
   1600   32.0  100.0           0        20.0  at capacity
   1800   36.0  112.5         200       145.0  saturated
   2000   40.0  125.0         400       270.0  saturated

to serve 2000 rps at W = 20 ms you need L = 2000 * 0.020 = 40 workers
latency target 50 ms at 1600 rps: L = 1600 * 0.050 = 80 in system
  = 32 in service + 48 queued -> concurrency limit 80, shed beyond it
  at 1800 rps the queue passes 48 after 0.24s of overload
\`\`\`

### Indices

- \`concurrency\` prend des **secondes**, donc passe \`TARGET_MS / 1000.0\`.
- Sous la capacité, le backlog vaut \`0.0\` et la latence \`SERVICE_S * 1000.0\` ; le verdict est \`"at capacity"\` seulement quand l'utilisation atteint 100.
- La ligne de la table est \`"{:>7.0} {:>6.1} {:>6.1} {:>11.0} {:>11.1}  {}"\`.
- \`queue_max / overload\` à 1800 rps vaut \`48 / 200 = 0.24\` secondes.
`,
  },
};
