import type { LessonStep } from "@/content/steps";

// FR · Running It in Production.
//
// Overlay for ../../steps/backend-production.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendProductionStepsFr: Record<string, LessonStep[]> = {
  "backend-production-1": [
    {
      kind: "theory",
      body: `Trois types d'instrument, et chacun répond à une question différente.

Un **counter** est monotone — il ne fait que monter, et seul un restart du processus le remet à zéro. Sa valeur instantanée ne veut rien dire ; tu lis son *taux*.

\`\`\`text
rate(http_requests_total[5m])
\`\`\`

Un **gauge** est un niveau à un instant donné qui bouge dans les deux sens : connexions actives, profondeur de file, taille du pool, requêtes en vol.

Un **histogram** est un ensemble de counters de bucket cumulatifs plus \`_sum\` et \`_count\`. Tu y observes des valeurs et tu en tires des distributions.

Ces trois-là sont ceux à utiliser. Prometheus livre aussi un **summary**, qui calcule ses quantiles dans le processus et les exporte comme des nombres finis — et les quantiles, contrairement aux comptes de bucket, ne s'additionnent pas, donc un summary est infusionnable à l'échelle d'une flotte. C'est tout le sujet de la leçon suivante, et la raison pour laquelle l'histogram est le choix par défaut.

Se tromper de type n'est pas une faute de style — un counter ne peut pas te dire la concurrence, et un gauge ne peut pas te dire le taux.`,
    },
    {
      kind: "theory",
      body: `Deux pièges, et les deux mordent en production.

**Un gauge n'est jamais vu qu'au moment du scrape**, typiquement toutes les 15–30 s. Tout ce qui se passe entre deux scrapes est invisible. Dans l'exercice, le vrai pic de 14 requêtes en vol n'est jamais observé, parce que chaque scrape tombe dans un creux et rapporte 5. Si c'est le pic qui compte — épuisement du pool, niveau haut de la file — exporte un gauge « max depuis le dernier scrape » à côté de l'instantané, ou utilise un histogram.

**Chaque valeur distincte de label est une série temporelle à part.** Un label \`user_id\` sur un histogram à 9 buckets avec 100k utilisateurs, c'est 900 000 séries, et c'est comme ça que tu fais tomber ton propre backend de métriques. Les labels sont pour des ensembles bornés : route, méthode, classe de status.`,
    },
    {
      kind: "quiz",
      question: "Un gauge de requêtes en vol est scrapé toutes les 15 s. La plus haute valeur relevée de toute la journée est 5. Qu'est-ce que ça établit sur le vrai pic ?",
      options: [
        "Seulement qu'un scrape a vu 5 — tout ce qui est monté et redescendu entre deux scrapes n'a jamais été échantillonné, donc le vrai pic peut être bien plus haut",
        "Le vrai pic était 5 : un gauge exporte le maximum atteint depuis le scrape précédent",
        "Le vrai pic était 5, parce qu'une requête vit plus longtemps que l'intervalle de scrape, donc rien ne peut se cacher entre deux échantillons",
      ],
      answer: 0,
      explain: "Un gauge simple rapporte la valeur à l'instant où on le lit, pas un max sur l'intervalle — ça, c'est un instrument à part que tu dois exporter délibérément. La troisième option est l'argument que les gens avancent vraiment, et il échoue exactement quand ça compte : les rafales de requêtes courtes sont précisément les pics qui épuisent un pool.",
    },
    {
      kind: "fill",
      prompt: "Affecte une observation à un bucket. Les buckets Prometheus sont `le` — inférieur **ou égal** à la borne.",
      file: "main.rs",
      before: "while i < BOUNDS.len() && v ",
      after: " BOUNDS[i] {\n    i += 1;\n}",
      choices: ["> ", ">= ", "< "],
      answer: 0,
      explain: "Avec `>=`, une valeur égale à la borne saute par-dessus son propre bucket : une requête de 10 ms atterrit dans `le<=50` et le compte de `le<=10` sous-rapporte en silence. `<` parcourt dans le mauvais sens et met tout dans le premier bucket.",
    },
    {
      kind: "quiz",
      question: "Un service exporte `http_request_duration_sum` et `http_request_duration_count`, et rien d'autre. À quelle question ne peut-il pas répondre ?",
      options: [
        "Combien de requêtes ont pris plus de 100 ms — c'est un compte de bucket, et une somme plus un compte ne peuvent pas le reconstruire",
        "La latence moyenne sur les cinq dernières minutes — on ne peut pas prendre le rate d'une somme et d'un compte sur une fenêtre",
        "Le temps total que le service a passé à servir des requêtes — `_sum` est un compte de requêtes, pas un total de durées",
      ],
      answer: 0,
      explain: "La moyenne, c'est exactement ce que ces deux-là te donnent : `rate(_sum[5m]) / rate(_count[5m])`. Dans l'exercice la moyenne est de 42.2 ms alors que 15 requêtes sur 20 ont fini en moins de 10 ms — la moyenne est réelle, et elle est aussi inutile pour la queue de distribution.",
    },
    {
      kind: "editor",
      intro: `### Trois instruments sur une même charge

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

Le vrai pic du gauge est 14 et chaque scrape le rate. La moyenne est de 42.2 ms et 15 requêtes sur 20 ont fini en moins de 10 ms.`,
    },
  ],

  "backend-production-2": [
    {
      kind: "theory",
      body: `Prometheus expose \`_bucket{le="..."}\` comme des comptes **cumulatifs**, plus \`_sum\` et \`_count\`.

La moyenne est exacte : \`_sum / _count\`. Un quantile ne l'est pas. Tu calcules un rang, tu parcours les comptes cumulés jusqu'à le franchir, et tu rapportes la borne supérieure de ce bucket :

\`\`\`text
rang = ceil(q · n)
parcourir les comptes cumulés jusqu'à cum >= rang
réponse = la borne supérieure de ce bucket
\`\`\`

Donc un p99 rapporté à 2000 ms veut seulement dire « quelque part entre 500 et 2000 ms ». **Tes bornes de bucket sont la résolution de ta réponse**, et c'est pour ça qu'elles doivent encadrer ton SLO. Resserrer un SLO, c'est ajouter des bornes, pas ajouter des échantillons.`,
    },
    {
      kind: "theory",
      body: `Les percentiles ne sont pas linéaires. Tu ne peux pas en faire la moyenne entre instances, et tu ne peux pas non plus en prendre le max. **Additionner les comptes de bucket est valide**, parce que chaque bucket est un counter — c'est toute la raison pour laquelle les histograms Prometheus ont cette forme, et pourquoi la query à l'échelle de la flotte somme les buckets *avant* de calculer le quantile :

\`\`\`text
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_bucket[5m])))
\`\`\`

L'exercice rend l'erreur visible dans les deux sens. Une instance chargée et saine (1000 req) et une instance calme et malade (100 req) donnent une moyenne des p99 de 1012.5 contre un vrai 2000, et une moyenne des p95 de 1005 contre un vrai 500. Faire la moyenne a sous-estimé l'un et doublé l'autre, parce que la moyenne non pondérée ignore qu'api-1 porte 91 % du trafic.

La moyenne fusionnée est de 42 ms et le p99 fusionné de 2000 ms — un écart de 48x. Une moyenne à 42 ms ne réveille jamais personne ; un utilisateur sur cent attend deux secondes. Criterion te donne la même distribution pour un benchmark, et un flamegraph te dit *où* est passé le temps de la queue une fois que l'histogram t'a dit qu'elle existe.`,
    },
    {
      kind: "quiz",
      question: "Douze instances exportent chacune un p99. Quel est le p99 de la flotte ?",
      options: [
        "Aucun des p99 par instance ne peut être combiné — somme d'abord les buckets entre instances, puis calcule le quantile à partir des comptes fusionnés",
        "Leur maximum : le p99 est une mesure de pire cas, donc la pire instance fixe celui de la flotte",
        "Leur moyenne, pondérée par le nombre de requêtes de chaque instance — une moyenne de quantiles pondérée par les requêtes est exacte",
      ],
      answer: 0,
      explain: "La moyenne pondérée est la mauvaise réponse sophistiquée, et elle reste fausse : pondérer corrige le déséquilibre de trafic, mais un quantile d'un mélange n'est aucune moyenne des quantiles des parties. Seuls les buckets s'additionnent.",
    },
    {
      kind: "fill",
      prompt: "Fusionne les histograms de deux instances en un seul.",
      file: "main.rs",
      before: "for i in 0..9 {\n    merged.counts[i] = ",
      after: ";\n}",
      choices: ["a.counts[i] + b.counts[i]", "(a.counts[i] + b.counts[i]) / 2", "a.counts[i].max(b.counts[i])"],
      answer: 0,
      explain: "Chaque bucket est un counter, donc la fusion est une addition. Faire la moyenne divise par deux le nombre d'observations de la flotte et rapporte une distribution que personne n'a vécue ; prendre le max ne compte rien en double et jette entièrement la queue de l'instance calme.",
    },
    {
      kind: "quiz",
      question: "Tes buckets sont `..., 500, 2000, +Inf` et le dashboard rapporte p99 = 2000 ms. Qu'est-ce qu'il t'a dit ?",
      options: [
        "Que 99 % des requêtes ont fini en moins de 2000 ms — le vrai p99 est quelque part au-dessus de 500 ms, et 2000 est une borne que tu as choisie, pas une mesure",
        "Que les 1 % de requêtes les plus lentes ont pris chacune environ 2000 ms",
        "Qu'une requête sur cent a pris exactement 2000 ms — l'histogram stocke la valeur observée à ce rang",
      ],
      answer: 0,
      explain: "Un histogram à buckets ne garde aucun échantillon, seulement des comptes. Tout p99 entre 500 et 2000 rapporte 2000 ; pour résoudre un SLO à 900 ms, tu ajoutes une borne à 1000 ms.",
    },
    {
      kind: "editor",
      intro: `### Fusionne deux instances sans mentir

1. Implémente \`count()\`, \`mean()\` (\`_sum / _count\`) et \`quantile(q)\` — rang \`ceil(q · n)\`, parcours les comptes cumulés, renvoie la borne supérieure du bucket franchi.
2. Construis \`api-1\` et \`api-2\` à partir des comptes dans les commentaires du starter, puis \`merged\` en **additionnant les buckets** et en additionnant les sommes.
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

Faire la moyenne des p95 double la vérité ; faire la moyenne des p99 la divise par deux.`,
    },
  ],

  "backend-production-3": [
    {
      kind: "theory",
      body: `Une ligne de log, c'est du key=value, pas une phrase.

\`\`\`rust
error!("failed to load user {} for org {}", uid, org);
\`\`\`

Ça, c'est une seule string opaque. Tu ne peux ni l'agréger, ni l'indexer, ni alerter dessus sans une regex qui casse la prochaine fois que quelqu'un retouche la formulation. Ça, c'est un enregistrement :

\`\`\`text
level=error event=user_load_failed user_id=91 org_id=4 err=timeout
\`\`\`

Chaque champ est une dimension interrogeable, le texte du message est stable, et la même ligne se sérialise en JSON pour un pipeline d'ingestion sans rien changer. C'est ce que \`tracing\` te donne par rapport à \`log\` : un \`Subscriber\` formate des champs structurés plutôt qu'une string pré-rendue, et \`#[instrument]\` attache automatiquement les champs d'un span à chaque event à l'intérieur.`,
    },
    {
      kind: "theory",
      body: `Un log de production, c'est beaucoup de requêtes entrelacées. Dans l'exercice, les seq 01–12 alternent entre deux request IDs et **aucune ligne n'est adjacente à la ligne avec laquelle elle va**. Un request ID généré en bordure et transporté à travers chaque couche — et sur le réseau en tant que \`traceparent\` vers les services en aval — c'est ce qui retransforme ce stream en histoire.

Ajoute \`depth\`, ou un vrai parent de span, et tu peux reconstruire l'arbre avec les durées. Note ce qui en tombe :

\`\`\`text
root 46ms, children 44ms, unaccounted 2ms
\`\`\`

Ces 2 ms, c'est le travail propre du handler. C'est le nombre qui te dit s'il faut optimiser ton code ou ta dépendance, et tu ne peux l'obtenir d'aucune des deux durées prise seule.

Règle de cardinalité : un request ID est très bien comme **champ** de log, et catastrophique comme **label** de métrique.`,
    },
    {
      kind: "quiz",
      question: "L'équipe n'a pas de correlation ID mais logge `user_id` et `endpoint` sur chaque ligne. Pourquoi ce n'est pas équivalent ?",
      options: [
        "Deux requêtes concurrentes du même utilisateur vers le même endpoint produisent des lignes entrelacées qu'aucun filtre ne peut séparer",
        "`user_id` et `endpoint` sont des champs à haute cardinalité, donc le backend de logs refuse de les indexer",
        "Les lignes de log d'une requête sont contiguës dans le stream, donc un filtre est inutile de toute façon",
      ],
      answer: 0,
      explain: "Ça se dégrade exactement quand tu en as besoin : sous charge, avec un client qui retry, pendant l'incident. Les deux autres options sont fausses sur le backend de logs (les champs sont bon marché ; ce sont les *labels* de métrique qui ne le sont pas) et fausses sur le stream (l'entrelacement est le cas par défaut).",
    },
    {
      kind: "fill",
      prompt: "Somme les spans enfants, pour séparer le temps propre du handler de celui de ses appelés.",
      file: "main.rs",
      before: "EVENTS.iter()\n    .filter(|e| e.0 == \"7f3a\" && e.3 == \"end\" && ",
      after: ")\n    .map(|e| e.4)\n    .sum()",
      choices: ["e.2 == 1", "e.2 == 0", "e.2 >= 0"],
      answer: 0,
      explain: "La profondeur 0 est la racine — le span même que tu soustrais. L'inclure rapporte 0 ms non attribués et cache le coût propre du handler ; tout inclure donne 90 ms d'enfants dans une racine de 46 ms.",
    },
    {
      kind: "quiz",
      question: "Un span racine fait 46 ms et ses deux spans enfants totalisent 44 ms. Que fait le handler lui-même ?",
      options: [
        "2 ms de travail — les spans enfants sont le temps des appelés, et la différence est le temps propre de l'appelant",
        "44 ms de travail — les enfants sont les opérations propres du handler, instrumentées",
        "46 ms de travail — le span racine mesure tout ce que fait le handler, enfants compris",
      ],
      answer: 0,
      explain: "Confondre les deux t'envoie optimiser le mauvais processus. 2 ms de temps propre face à 41 ms dans `db.query`, ça veut dire que la réponse est un index ou une réécriture de la query, pas un handler plus rapide.",
    },
    {
      kind: "editor",
      intro: `### Reconstruis une requête à partir d'un stream entrelacé

1. \`fn emit(...) -> String\` construit une ligne structurée : \`seq\` complété par des zéros sur deux chiffres, \`level\`, \`req\`, \`span\`, \`depth\`, \`event\` — plus \`dur_ms\` **seulement sur un end**, et \`level=warn\` quand un end dépasse 40 ms.
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

2 ms non attribués, c'est le travail propre du handler. 41 des 46 ms sont dans \`db.query\`.`,
    },
  ],

  "backend-production-4": [
    {
      kind: "theory",
      body: `Un intervalle de retry fixe est pire que pas de retry du tout : il frappe une dépendance en difficulté exactement au mauvais moment, et de façon répétée. Le backoff exponentiel — \`base · 2^attempt\`, plafonné — étale les tentatives.

Mais **le backoff seul synchronise**. Si 500 clients échouent au même instant, ils retry tous à t+100 ms, puis tous à t+300 ms : une ruée (thundering herd) sur un planning bien rangé. Le full jitter les décorrèle :

\`\`\`text
delay = uniform(0, min(cap, base · 2^attempt))
\`\`\`

Le plafond compte aussi. Un doublement sans plafond à partir d'une base de 100 ms atteint \`100 << 13\` = 819 200 ms — treize minutes et demie — à la tentative 13, et un client qui a depuis longtemps abandonné l'utilisateur tient encore un slot de connexion.

Le LCG de l'exercice est seedé de façon déterministe, exprès — une politique de retry que tu ne peux pas reproduire est une politique de retry que tu ne peux pas tester. Note la tentative 1 qui tire 1 ms de jitter : le full jitter peut vraiment renvoyer presque zéro, et c'est pour ça que certains systèmes préfèrent le jitter décorrélé avec un plancher.`,
    },
    {
      kind: "theory",
      body: `Les retries multiplient la charge exactement quand le système a le moins de capacité pour l'absorber. Avec 3 retries sur un appel qui a 62 % de chances d'échouer, l'exercice fait passer la charge offerte de 40 tentatives à 115 — **2.88x d'amplification visant une dépendance déjà à terre**. C'est la forme de la plupart des pannes en cascade : la logique de retry transforme une dépendance dégradée en dépendance morte.

Un **retry budget** règle ça côté client. Les retries ne peuvent consommer qu'une fraction fixe du volume de requêtes — 10 % ici, implémenté comme un token bucket qui gagne 10 centi-tokens par appel et paie 100 par retry. L'amplification tombe à 1.07x, 72 des 75 retries sont refusés, et la dépendance a de la place pour se rétablir.

Deux règles non négociables : ne retry que les opérations idempotentes, et ne retry jamais un 4xx. La dépendance a répondu correctement ; c'est la requête qui est fausse, et elle sera tout aussi fausse la deuxième fois.`,
    },
    {
      kind: "quiz",
      question: "Chaque client utilise un backoff exponentiel. Pourquoi une ruée peut-elle quand même se former ?",
      options: [
        "Les clients qui ont échoué ensemble reculent des mêmes montants, donc ils arrivent ensemble à chaque retry — le backoff change le moment où la ruée arrive, pas le fait qu'elle arrive",
        "Le backoff plafonne le délai, et une fois que chaque client est au plafond, ils retry à la fréquence du plafond pour toujours",
        "La croissance exponentielle dépasse le rétablissement de la dépendance, donc la ruée se forme après que la dépendance est déjà saine",
      ],
      answer: 0,
      explain: "C'est le jitter qui casse la corrélation. L'option des clients au plafond décrit un vrai état stationnaire, mais la ruée est déjà synchronisée bien avant le plafond — elle l'est dès le premier retry.",
    },
    {
      kind: "fill",
      prompt: "Transforme un backoff en délai full-jitter.",
      file: "main.rs",
      before: "let b = backoff(attempt);\nlet delay = ",
      after: ";",
      choices: ["rng.below(b + 1)", "b / 2 + rng.below(b / 2 + 1)", "b + rng.below(b + 1)"],
      answer: 0,
      explain: "Le full jitter est uniforme sur tout l'intervalle `[0, b]`. Le deuxième choix est le jitter *equal* — une vraie variante AWS avec un plancher à `b/2`, qui divise l'étalement par deux et donc décorrèle moins. Le troisième ajoute du jitter par-dessus le backoff, ce qui retarde chaque client sans les décorréler du tout.",
    },
    {
      kind: "quiz",
      question: "Chaque client est plafonné à 3 retries par appel. Pourquoi ce n'est pas une borne sur la charge que voit la dépendance ?",
      options: [
        "Un plafond par appel borne un appel et ne dit rien du volume : à 100 % de taux d'échec, la flotte délivre quand même 4x son trafic normal",
        "Le plafond est par client, et les clients ne se voient pas entre eux, donc le total est non borné même à un taux d'échec bas",
        "Les retries contournent le plafond quand la première tentative expire en timeout au lieu de renvoyer une erreur",
      ],
      answer: 0,
      explain: "L'amplification est une propriété de la flotte, donc la borne doit être exprimée par rapport au volume de la flotte. Un budget de 10 % des requêtes tient à n'importe quel taux d'échec ; un plafond de 3 ne tient qu'à un taux d'échec que tu ne contrôles pas.",
    },
    {
      kind: "editor",
      intro: `### Borne l'amplification

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

2.88x devient 1.07x, et 72 des 75 retries ne quittent jamais le client.`,
    },
  ],

  "backend-production-5": [
    {
      kind: "theory",
      body: `Trois états, et les transitions entre eux sont tout le mécanisme.

**Closed** — les appels passent. Une série d'échecs qui atteint le seuil le déclenche.
**Open** — aucun appel n'est fait du tout. L'appelant échoue immédiatement avec l'erreur propre du breaker, en microsecondes au lieu d'un timeout de connexion de 30 secondes.
**Half-open** — atteint après un cooldown. Exactement une sonde (\`probe\`) est laissée passer. Un succès ferme le breaker et efface la série d'échecs ; un échec le rouvre et relance le cooldown.

L'exercice affiche tout le parcours : déclenchement à t=5, sondes à t=9, 13 et 17, fermeture à 17. Note ce que le breaker t'achète pendant que la dépendance est encore à terre — 9 ticks sur 22 court-circuités, soit 9 threads ou slots de connexion jamais bloqués sur un appel condamné.

C'est le vrai point. **Un breaker protège l'appelant de l'épuisement de ressources au moins autant qu'il protège l'appelé.**`,
    },
    {
      kind: "theory",
      body: `Les paramètres, et où ils déraillent.

**Un seuil sur les échecs consécutifs est simple mais nerveux.** Les bibliothèques de production utilisent plutôt un taux d'échec glissant — « plus de 50 % des 100 derniers appels, minimum 20 appels » — parce que ça ne se déclenche pas sur une paire malchanceuse et ne reste pas fermé sous un taux d'échec stable à 40 %.

**Half-open doit admettre une seule sonde, pas reprendre le trafic normal.** Fermer directement en pleine charge re-inonde une dépendance qui vient de revenir avec un cache froid, et redéclenche le breaker aussitôt.

**Tous les échecs ne comptent pas.** Un timeout de connexion ou un 503, oui ; un 400, non — la dépendance a répondu correctement et elle répondra pareil la prochaine fois.

Lié, et à garder bien distinct : une probe de **liveness** répond à « l'orchestrateur doit-il me redémarrer » et ne doit dépendre de rien en aval, sinon une seule dépendance malade redémarre toute ta flotte. Une probe de **readiness** répond à « le load balancer doit-il router vers moi » et peut légitimement en dépendre.`,
    },
    {
      kind: "quiz",
      question: "Le cooldown expire. Pourquoi le breaker passe-t-il en half-open plutôt que directement en closed ?",
      options: [
        "Fermer envoie toute la charge dans une dépendance que personne n'a testée ; half-open dépense exactement une requête pour le découvrir d'abord",
        "Half-open existe pour remettre à zéro le compteur d'échecs, ce que closed ne peut pas faire pendant qu'une série est en cours",
        "Le cooldown est un minimum, et half-open garde le breaker ouvert jusqu'à ce que la dépendance se déclare elle-même saine",
      ],
      answer: 0,
      explain: "La dépendance en train de se rétablir est le cas fragile : caches froids, pools de connexions froids, un backlog à écouler. Une sonde est une question bon marché ; une reconnexion en ruée est ce qui la remet à terre.",
    },
    {
      kind: "fill",
      prompt: "La sonde half-open a échoué. Rouvre le breaker.",
      file: "main.rs",
      before: "} else if state == State::HalfOpen {\n    state = State::Open;\n    opened_at = ",
      after: ";\n}",
      choices: ["t", "opened_at", "0"],
      answer: 0,
      explain: "Le cooldown doit repartir de *cet* échec. Garder l'`opened_at` d'origine laisse le cooldown déjà expiré, donc le breaker repasse en half-open dès le tick suivant et sonde une dépendance morte à chaque tick — exactement le martèlement que le breaker existe pour empêcher. `0`, c'est le même bug, en permanent.",
    },
    {
      kind: "quiz",
      question: "Que protège un circuit breaker en premier ?",
      options: [
        "L'appelant — ses threads et ses slots de connexion arrêtent d'être consommés par des appels qui vont expirer de toute façon",
        "L'appelé — délester la charge est ce qui permet à une dépendance en difficulté de se rétablir",
        "L'utilisateur — une erreur rapide est une meilleure expérience qu'une erreur lente",
      ],
      answer: 0,
      explain: "Épargner la dépendance et échouer vite sont deux bénéfices réels, mais ce sont des conséquences. Un appelant sans breaker meurt de la maladie de l'appelé : chaque worker garé sur un timeout de 30 secondes, et une panne dans une dépendance devient une panne dans ton service.",
    },
    {
      kind: "editor",
      intro: `### Parcours la machine à états

Affiche \`t\`, l'état à l'entrée, l'action, le résultat et l'état suivant, pour les 22 ticks.

- **closed** — appel. \`THRESHOLD\` échecs consécutifs le font passer en open, en enregistrant \`opened_at\`.
- **open** — court-circuit ; aucun appel du tout. \`COOLDOWN\` ticks après \`opened_at\`, passe en half-open.
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

13 appels au lieu de 22, et les deux sondes ratées ont coûté une requête chacune plutôt qu'une ruée.`,
    },
  ],

  "backend-production-6": [
    {
      kind: "theory",
      body: `Quatre phases, dans cet ordre.

**1. Arrêter d'accepter.** Sur SIGTERM, bascule la probe de readiness en échec et ferme le listener, pour que le load balancer arrête de router de nouvelles requêtes ici pendant que le processus est encore vivant. La readiness doit basculer *avant* que le listener ferme dans un vrai cluster — le LB a besoin de quelques secondes pour s'en apercevoir, et c'est pour ça que les handlers de shutdown en production dorment avant de fermer quoi que ce soit.

**2. Drainer.** Continue à servir ce qui est déjà en vol. La courbe de drain de l'exercice est 5 → 4 → 2 → 1 au fur et à mesure que les requêtes se terminent.

**3. Deadline.** Le drain ne peut pas être illimité : une seule requête bloquée tiendrait le pod pour toujours, et la grace period de l'orchestrateur, elle, n'attendra pas. Kubernetes te donne 30 s, puis envoie SIGKILL.

**4. Fermeture forcée** de ce qui reste, en loggant quelles requêtes tu as tuées — la requête 8 ici, l'outlier à 20 ticks.`,
    },
    {
      kind: "theory",
      body: `Ce que ça t'achète, et ce que ça ne t'achète pas.

Sortir immédiatement sur SIGTERM tue 5 requêtes en vol. Drainer en tue 1. Cette différence, c'est le deploy qui apparaît comme un pic de p99 et une rafale de 502, contre le deploy que personne ne remarque — multiplié par chaque pod d'un rolling update.

Les requêtes rejetées sont un comportement correct, pas des erreurs : un 503 avec la connexion qui se ferme est un signal au balancer de router ailleurs.

Deux choses que le graceful shutdown ne te donne **pas**. Il ne te donne pas l'**idempotence** — une requête tuée à la deadline peut avoir à moitié commit, donc le travail lui-même doit être sûr à retry. Et il ne sauve pas le **travail long** : un job de 10 minutes n'a rien à faire derrière une requête, il a sa place dans une file dont le consommateur peut être interrompu et repris.

Les rollbacks relèvent de la même famille de raisonnement. Un rollback doit être aussi automatique qu'un deploy, parce que c'est la seule remédiation dont tu comprends déjà le rayon d'impact.`,
    },
    {
      kind: "quiz",
      question: "Fermer le listener et basculer la readiness en échec, est-ce équivalent, ou l'ordre compte-t-il ?",
      options: [
        "Readiness d'abord : fermer le socket pendant que le balancer croit encore en ce pod refuse des connexions qu'il est activement en train de router ici",
        "Listener d'abord : un socket ouvert est ce qui fait que le balancer continue à router, donc le fermer est ce qui draine vraiment le trafic",
        "Équivalent — les deux rendent le pod injoignable, et le balancer découvre l'un ou l'autre à son prochain health check",
      ],
      answer: 0,
      explain: "Ils drainent deux choses différentes. La bascule de readiness draine le *routage* ; la fermeture du listener draine le *socket*. Fais le socket d'abord et chaque requête que le balancer envoie dans les secondes avant de s'en apercevoir se prend un connection refused, ce qui est exactement la rafale de 502 que tu voulais éviter.",
    },
    {
      kind: "fill",
      prompt: "N'admets une arrivée que tant que le serveur accepte encore.",
      file: "main.rs",
      before: "for _ in 0..arrived {\n    if ",
      after: " && next_id < SERVICE.len() { /* admit */ } else { rejected += 1; }\n}",
      choices: ["accepting", "t < SIGTERM_AT + DEADLINE", "in_flight.len() < 5"],
      answer: 0,
      explain: "Le deuxième choix continue d'admettre pendant toute la fenêtre de drain — tu acceptes du travail que tu as déjà promis de fermer de force à la deadline. Le troisième est une limite de concurrence : une bonne chose à avoir, et pas un substitut, puisqu'il admet joyeusement de nouvelles requêtes après SIGTERM dès qu'il y a de la place.",
    },
    {
      kind: "quiz",
      question: "La deadline de drain est décrite comme un filet de sécurité qui ne devrait jamais se déclencher, donc elle est fixée à 60 s. Qu'est-ce qui cloche ?",
      options: [
        "Elle se déclenche précisément sur les requêtes déjà pathologiques, et 60 s dépasse la grace period de 30 s de Kubernetes — SIGKILL arrive en premier et le drain ne se termine jamais",
        "Une longue deadline garde les connexions du pod ouvertes, donc le balancer continue à router vers lui pendant les 60 s complètes",
        "La deadline est par requête, donc une deadline de 60 s laisse 60 s de nouveau travail s'accumuler avant qu'elle s'applique",
      ],
      answer: 0,
      explain: "Une deadline plus longue que la grace period de l'orchestrateur est une deadline qui n'existe pas, et tu obtiens le shutdown brutal que tu essayais d'éviter. Choisis-la sous la grace period, et attends-toi à ce qu'elle se déclenche — les requêtes qu'elle tue sont celles qui n'allaient jamais finir.",
    },
    {
      kind: "editor",
      intro: `### Drainer, deadline, fermeture forcée

À chaque tick : admets les arrivées du tick seulement tant que tu acceptes (sinon compte un 503), décrémente chaque requête en vol, retire celles qui atteignent 0, et affiche la ligne.

- À \`SIGTERM_AT\` : arrête d'accepter, bascule la readiness en \`503\`, et retiens combien étaient en vol.
- Arrête-toi quand \`in_flight\` est vide (un drain propre), ou quand \`DEADLINE\` ticks se sont écoulés depuis SIGTERM — puis ferme de force ce qui reste, en affichant les ids.
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

Une requête tuée au lieu de cinq, et celle qui est tuée est l'outlier à 20 ticks qui n'allait jamais finir.`,
    },
  ],

  "backend-production-7": [
    {
      kind: "theory",
      body: `\`\`\`text
L = λ · W
\`\`\`

**L** est le nombre de requêtes *dans le système* — en cours de service plus en file. **λ** est le taux d'arrivée. **W** est le temps qu'une requête passe dans le système.

Ça tient pour n'importe quel système stable, sans aucune hypothèse sur la distribution des arrivées. C'est pour ça que c'est le seul résultat de théorie des files qui vaille la peine d'être mémorisé.

Lis-la de trois façons.

**En avant** — 1200 rps avec une cible à 250 ms demandent 300 slots concurrents.
**À rebours** — 32 workers à 20 ms de service chacun, c'est 32/0.020 = 1600 rps de capacité, point final ; aucun tuning n'en tire plus sans changer l'un de ces deux nombres.
**De côté** — un dashboard qui montre 40 en vol, 1200 rps et 20 ms de latence te montre un nombre faux, parce que 1200 · 0.020 fait 24.`,
    },
    {
      kind: "theory",
      body: `Sous la capacité, la latence n'est que le temps de service et la file est vide. Au-delà, les arrivées dépassent les départs et **le backlog grandit linéairement et sans borne**. À 1800 rps contre 1600, une seconde de surcharge laisse 200 en file, chacune attendant 200/1600 = 125 ms en plus de ses 20 ms de travail. La latence ne se dégrade pas gracieusement ; elle se dégrade au rythme de l'excédent.

Donc fixe la limite délibérément. Avec une cible à 50 ms et 1600 rps de capacité, L = 1600 · 0.050 = 80 dans le système : 32 en service, 48 peuvent attendre en file. **Admets 80. Rejette la 81e avec un 503 immédiat**, parce qu'une requête admise au-delà ne peut de toute façon pas tenir 50 ms et occupera un slot en échouant à le faire.

C'est ce qu'un test de charge mesure. Monte en rampe pour trouver la capacité (soutenu), dépasse pour trouver le mode de défaillance (saturation), envoie un échelon pour voir si le rétablissement est gracieux (pic). Regarde la latence de queue, pas la moyenne — la moyenne d'un système qui sature reste respectable étonnamment longtemps.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi 100 % d'utilisation n'est-il pas le point de fonctionnement efficace ?",
      options: [
        "À 100 % il n'y a aucune marge pour absorber la variance des arrivées, donc la moindre rafale construit une file qui ne se vide jamais complètement et la latence grimpe pendant que le débit a encore l'air bon",
        "À 100 % le scheduler passe l'essentiel de son temps en context switches, donc le débit effectif tombe sous la capacité",
        "100 % d'utilisation est efficace — la convention des 60–70 % concerne la place à laisser pour un réplica en panne, pas la latence",
      ],
      answer: 0,
      explain: "Les arrivées ne sont pas régulièrement espacées. Avec zéro marge, chaque rafale laisse un résidu que la période calme suivante n'a aucune capacité de réserve pour écouler, et W grimpe alors que λ n'a pas changé — la file est le seul terme qui peut bouger.",
    },
    {
      kind: "fill",
      prompt: "Transforme une cible de latence en limite de concurrence. `concurrency` prend des secondes.",
      file: "main.rs",
      before: "let l_max = concurrency(capacity(), ",
      after: ");",
      choices: ["TARGET_MS / 1000.0", "TARGET_MS", "SERVICE_S"],
      answer: 0,
      explain: "Passer des millisecondes face à un taux par seconde donne L = 80 000 — l'erreur d'unités qui fait passer la loi de Little pour fausse. Passer `SERVICE_S` donne L = 32, soit le nombre de workers : l'idée reçue que la limite est la taille du pool et qu'aucune file n'est permise.",
    },
    {
      kind: "quiz",
      question: "Le service sature, donc la file de requêtes est agrandie de 100 à 10 000. Qu'est-ce que ça change ?",
      options: [
        "Rien à la capacité : ça convertit un problème de disponibilité en problème de latence, ce qui gagne du temps sur une rafale et ne fait qu'échouer lentement au lieu de vite sous une surcharge soutenue",
        "Ça augmente la capacité effective, puisque moins de requêtes sont rejetées par seconde et que les workers ne sont jamais inactifs à en attendre une",
        "Ça baisse le p99, parce que les requêtes qui auraient été rejetées se terminent maintenant au lieu d'être retry par le client",
      ],
      answer: 0,
      explain: "Une file est un buffer, pas un serveur. Face à une surcharge soutenue, chaque requête attend maintenant puis échoue, ce qui est strictement pire qu'échouer immédiatement. Une limite de concurrence est ce qui fait du délestage une décision plutôt qu'un accident.",
    },
    {
      kind: "editor",
      intro: `### D'une cible de latence à une limite d'admission

1. \`capacity()\` vaut \`WORKERS / SERVICE_S\`. \`concurrency(lambda, w_s)\` vaut \`lambda * w_s\` — la loi de Little, écrite une fois.
2. Pour chaque taux offert, affiche L, l'utilisation, le backlog après une seconde de surcharge, la latence résultante (\`SERVICE_S + backlog / capacity()\`) et un verdict \`ok\`, \`at capacity\` ou \`saturated\`.
3. Affiche les workers nécessaires pour servir le pic au temps de service actuel.
4. Transforme \`TARGET_MS\` en limite de concurrence — \`L = capacité · cible\` — découpe-la en en-service et en-file, et affiche combien de temps la surcharge met à remplir la file.

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

Au-delà de 1600 rps, la file est le seul terme qui peut absorber l'excédent, et elle le fait linéairement.`,
    },
  ],
};
