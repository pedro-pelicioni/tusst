// FR · editor instructions — RPC Services at Scale.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-rpc-services.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendRpcServicesInstructionsFr: Record<string, { instructions: string }> = {
  "backend-rpc-services-1": {
    instructions: `## Classe une requête entrante

Une Request JSON-RPC 2.0, c'est \`{"jsonrpc": "2.0", "method": ..., "params": ..., "id": ...}\`. Une Response transporte **soit** \`result\` **soit** \`error\`, jamais les deux. Cinq codes sont réservés :

| code | sens | quand |
| --- | --- | --- |
| -32700 | Parse error | les bytes ne sont pas du JSON |
| -32600 | Invalid Request | ça a parsé, mais ce n'est pas un objet Request |
| -32601 | Method not found | le nom n'est pas enregistré |
| -32602 | Invalid params | la méthode existe, les arguments ne typent pas |
| -32603 | Internal error | le handler a tourné et a échoué |

\`-32000\` à \`-32099\` est laissé à tes propres erreurs serveur.

La règle de l'id piège tout le monde : renvoie l'id **byte pour byte** une fois que tu tiens un objet Request valide, et envoie \`id: null\` quand ce n'est pas le cas — un parse error peut n'avoir produit aucun id, et une requête mal formée peut avoir un id du mauvais type.

### Ta tâche

Remplis \`classify\`. Fais les cinq vérifications dans l'ordre — parse, forme de la requête, méthode, params, handler — et réponds à chacune avec son code.

1. \`well_formed == false\` est \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. Une \`version\` qui n'est pas \`Some("2.0")\`, ou un \`method\` absent, est \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. Une méthode absente de \`methods\` est \`-32601\` \`"Method not found"\`, en renvoyant l'id.
4. \`params_ok == false\` est \`-32602\` \`"Invalid params"\`, en renvoyant l'id.
5. \`handler_ok == false\` est \`-32603\` \`"Internal error"\`, en renvoyant l'id.
6. Sinon \`Reply { code: 0, message: "result", id }\` — \`main\` affiche le code \`0\` comme \`-\`.

Sortie attendue :

\`\`\`text
request                   code  message           id
truncated body          -32700  Parse error       null
jsonrpc 1.0             -32600  Invalid Request   null
no method member        -32600  Invalid Request   null
method sbutract         -32601  Method not found  3
sum of strings          -32602  Invalid params    "a3"
sum, handler panicked   -32603  Internal error    5
sum, healthy                 -  result            6
\`\`\`

### Indices

- \`Id\` est \`Clone\`, donc \`r.id.clone()\` le renvoie en écho.
- \`methods.contains(&r.method.unwrap())\` — l'\`unwrap\` est sûr parce que la vérification 2 a déjà rejeté une méthode absente.
- Des \`return\` anticipés gardent l'ordre des vérifications visible ; cet ordre *est* la classification.
`,
  },

  "backend-rpc-services-2": {
    instructions: `## Les deux frames qui ne reçoivent pas de réponse

Le membre id est un interrupteur. Une Request **sans id** est une **notification** : le serveur exécute le handler et NE DOIT PAS envoyer d'objet réponse, pas même une erreur. Un id \`null\` explicite est autre chose — c'est un appel dont l'id se trouve être null.

Un batch est un array JSON d'objets Request, et trois de ses règles cassent les serveurs naïfs :

- Un **array vide** n'est pas un objet Request, donc il reçoit un seul \`-32600\` avec \`id: null\`.
- Un batch de **notifications seulement** ne produit **aucun corps de réponse** — pas \`[]\`.
- Un **membre malformé** répond avec \`id: null\`, parce que le serveur ne peut pas savoir si ce membre allait être une notification.

L'ordre n'est pas garanti non plus : le client apparie les réponses aux requêtes par id, jamais par position.

### Ta tâche

Remplis \`handle_one\` et \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → pousse la méthode dans \`effects\` et renvoie \`None\`. L'effet de bord tourne quand même ; seule la réponse est supprimée.
3. \`Frame::Call { method, id }\` → une méthode autre que \`"add"\` est \`Some(error_obj(-32601, "Method not found", &id.to_string()))\` ; sinon pousse la méthode et renvoie \`Some(format!("{{\\"jsonrpc\\":\\"2.0\\",\\"result\\":7,\\"id\\":{}}}", id))\`.
4. \`handle_batch\` : une slice vide est un seul \`-32600\` avec un id null. Sinon passe les frames par \`filter_map\` avec \`handle_one\`, et renvoie \`None\` quand rien n'a répondu, sinon les réponses jointes par \`,\` entre \`[\` \`]\`.

Sortie attendue :

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

### Indices

- \`filter_map(|f| handle_one(f, effects))\` laisse tomber exactement les membres qui ont renvoyé \`None\`.
- \`replies.join(",")\` construit le corps de l'array.
- Six invocations de handler contre trois corps de réponse, c'est tout le propos : \`effects.len()\` compte le travail fait, pas les réponses envoyées.
`,
  },

  "backend-rpc-services-3": {
    instructions: `## Un routeur de handlers en box

Les handlers ont des corps différents et doivent partager une seule signature, donc chacun est un trait object :

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
\`\`\`

Le box est ce qui permet à des closures de types concrets différents de vivre dans une même \`HashMap\`. Le coût est une indirection de pointeur par appel, face à un lookup de hash déjà écrasé par la lecture du socket. Un \`match\` écrit à la main sur le nom de la méthode dispatche aussi vite, mais il ne peut pas être étendu au démarrage par un module indépendant, ni énuméré au runtime.

Séparer les trois échecs est l'autre moitié du boulot. \`-32601\`, c'est un nom que la table ne contient pas. \`-32602\`, c'est la vérification de forme et d'arité qui se fait **avant** d'entrer dans le handler. \`-32603\`, c'est un handler qui a atteint du vrai travail et a échoué — et il ne doit jamais faire fuiter un message interne sur le fil.

### Ta tâche

1. \`register\` insère le handler en box dans \`self.routes\` sous son nom.
2. \`dispatch\` cherche la méthode. \`Some(handler)\` l'appelle ; \`None\` est \`Err(RpcError { code: -32601, message: "Method not found" })\`.
3. \`method_names\` collecte les clés et les **trie** — l'ordre d'itération d'une \`HashMap\` n'est pas spécifié et varie d'un processus à l'autre.
4. Dans \`main\`, enregistre deux handlers :
   - \`"sum"\` renvoie \`Ok(params.iter().sum())\`.
   - \`"div"\` renvoie \`-32602\` \`"Invalid params"\` quand \`params.len() != 2\`, \`-32603\` \`"Internal error"\` quand le diviseur est zéro, et sinon \`Ok(params[0] / params[1])\`.

Sortie attendue :

\`\`\`text
methods: ["div", "sum"]
method     params     outcome
sum        [1, 2, 3]  result 6
div        [10, 2]    result 5
div        [10, 0]    -32603 Internal error
div        [10]       -32602 Invalid params
multiply   [3, 4]     -32601 Method not found
\`\`\`

### Indices

- \`Box::new(|params: &[i64]| ...)\` — la closure a besoin que le type de son paramètre soit annoté pour se coercer en \`Handler\`.
- \`self.routes.keys().copied().collect()\` donne un \`Vec<&'static str>\` que tu peux trier.
- La division par zéro est \`-32603\`, pas \`-32602\` : les params ont typé, puis le handler a échoué.
`,
  },

  "backend-rpc-services-4": {
    instructions: `## Service et Layer

Tout l'écosystème Tower, c'est deux traits. \`Service\`, c'est une méthode — requête en entrée, réponse en sortie. \`Layer<S>\`, c'est une méthode — prends un service, renvoie un service. Chaque middleware que tu as utilisé est une struct qui tient un \`S\` interne et implémente \`Service\` en faisant quelque chose puis en appelant \`self.inner.call(req)\`.

Le vrai Tower ajoute \`poll_ready\` (le canal de backpressure : un service dit « pas maintenant » *avant* que tu lui tendes une requête) et des types associés Response/Error/Future. La forme, c'est ce que tu construis ici.

L'ordre de composition est la décision que l'exercice mesure. \`TimeoutLayer.layer(CountLayer.layer(Backend))\` met le timeout le plus à l'extérieur, donc une requête hors budget est rejetée sans que le backend soit jamais atteint — et le compteur affiche 3 sur 5.

### Ta tâche

Écris quatre impls.

1. \`impl<S: Service> Service for Counted<S>\` — incrémente \`self.calls\`, puis délègue à \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\` avec \`type Svc = Counted<S>\`, qui construit \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — si \`req.cost_ms > self.limit_ms\`, renvoie \`Resp::Err(-32001, "Request timeout")\` **sans** appeler le service interne ; sinon délègue.
4. \`impl<S> Layer<S> for TimeoutLayer\` avec \`type Svc = Timeout<S>\`, qui fait passer \`limit_ms\`.

Sortie attendue :

\`\`\`text
method      cost_ms  outcome
ping              5  ok in 5ms
report          250  -32001 Request timeout
sum              90  ok in 90ms
export          400  -32001 Request timeout
ping             12  ok in 12ms
requests: 5, reached the backend: 3
\`\`\`

### Indices

- \`stack.inner\` est le \`Counted\`, parce que le timeout est le layer externe — c'est ce qui rend le compte lisible à la fin.
- Rien ne dort. Le coût est une donnée sur la requête ; le timeout est une comparaison.
- Inverse les deux layers et chaque requête atteindrait le backend. Le compteur est la preuve que l'ordre est une décision de design.
`,
  },

  "backend-rpc-services-5": {
    instructions: `## Shed ou queue

Une limite de concurrence est le seul bouton qui borne un service. Threads, connexions, handles de base de données : quelque chose est fini, et si tu ne choisis pas le nombre, la machine le choisit pour toi, mal. Quand les permits sont épuisés, le limiter a exactement deux options, et cette simulation fait tourner les deux contre un trafic identique.

La loi de Little dit \`L = λW\` : à un taux d'arrivée au-dessus de la capacité de service, longueur de file et attente croissent sans borne. Une requête qui attend 150ms derrière un pool plein puis tourne 150ms a brûlé du temps de backend pour produire une réponse à 300ms pour un client dont la deadline était 200ms — un client qui a déjà retry, doublant λ. C'est la panne métastable : le service n'est pas down, il dépense toute sa capacité sur du travail qui sera jeté.

### Ta tâche

Complète \`simulate\`. Pour chaque arrivée, dans l'ordre :

1. Pose \`now = req.at_ms\` et \`retain\` seulement les entrées de \`busy_until\` encore \`> now\`.
2. Si \`busy_until.len() == CAPACITY\` et \`shed_early\`, compte un rejet et affiche la ligne avec wait \`0\`, latency \`0\`, backend \`"no"\`, outcome \`"-32002 Server busy"\`, puis passe à la suivante.
3. Sinon choisis un temps de départ : \`now\` s'il y a un slot libre, sinon le temps de fin **le plus tôt** dans \`busy_until\` — retire ce slot et démarre là.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\` ; pousse \`finish\`.
5. Une \`latency > DEADLINE_MS\` compte un rejet, ajoute \`req.cost_ms\` à \`doomed_ms\`, et affiche \`"-32001 Request timeout"\` ; sinon \`"ok"\`. Affiche la ligne avec backend \`"yes"\`.

Sortie attendue :

\`\`\`text
policy: shed early
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0      0        0        no  -32002 Server busy
  4       0      0        0        no  -32002 Server busy
  5      10      0        0        no  -32002 Server busy
failed: 3, backend-ms spent on doomed work: 0

policy: queue everything
 id  arrive   wait  latency   backend  outcome
  1       0      0      150       yes  ok
  2       0      0      150       yes  ok
  3       0    150      300       yes  -32001 Request timeout
  4       0    150      300       yes  -32001 Request timeout
  5      10    290      310       yes  -32001 Request timeout
failed: 3, backend-ms spent on doomed work: 320
\`\`\`

### Indices

- \`busy_until.iter().min()\` trouve le slot libre le plus tôt ; \`position\` le localise ensuite pour \`remove\`.
- La colonne wait est \`start - now\`.
- Lis les deux totaux l'un contre l'autre : les trois mêmes échecs dans les deux cas, et 320ms de temps backend comme seule chose que la file a achetée.
`,
  },

  "backend-rpc-services-6": {
    instructions: `## Un token bucket par client

Un bucket tient jusqu'à \`capacity\` tokens et se remplit à un taux fixe ; une requête coûte un token et une requête qui ne peut pas payer est rejetée. Deux propriétés en découlent : le bucket autorise un burst de \`capacity\` puis se cale exactement sur le taux de refill. Une fenêtre fixe de 60/minute laisse un client envoyer 120 requêtes à cheval sur une frontière de fenêtre ; un bucket, jamais.

Ne lance **pas** de timer de refill. Remplis paresseusement à l'accès depuis \`(now - last_seen) * rate\`, plafonné à la capacité : une ligne d'arithmétique, pas de tâche de fond, deux entiers d'état par client. Tout ici est en milli-tokens pour que l'arithmétique entière reste exacte, et \`(deficit + rate - 1) / rate\` est la division plafond qui transforme un manque en \`retry_after\` que le client peut honorer.

### Ta tâche

1. \`Bucket::new\` démarre un client plein : \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` crédite \`(now_ms - self.last_ms) * REFILL_PER_MS\`, plafonne avec \`.min(CAPACITY)\`, et stocke \`last_ms = now_ms\`.
3. \`take\` renvoie \`Ok(self.tokens)\` après avoir soustrait \`COST\` quand il y a assez de tokens. Sinon calcule \`deficit = COST - self.tokens\` et renvoie \`Err((deficit + REFILL_PER_MS - 1) / REFILL_PER_MS)\` — les millisecondes jusqu'à ce qu'un token entier existe. Un refus ne dépense rien.

Sortie attendue :

\`\`\`text
  t_ms client   before   after  outcome
     0 alice     5.000   4.000  allowed
     0 alice     4.000   3.000  allowed
     0 alice     3.000   2.000  allowed
     0 alice     2.000   1.000  allowed
     0 alice     1.000   0.000  allowed
     0 alice     0.000   0.000  -32005 Rate limit exceeded, retry_after_ms=200
   200 alice     1.000   0.000  allowed
   250 alice     0.250   0.250  -32005 Rate limit exceeded, retry_after_ms=150
   250 bob       5.000   4.000  allowed
  1500 alice     5.000   4.000  allowed
final alice: 4.000 tokens
final bob: 4.000 tokens
\`\`\`

### Indices

- \`BTreeMap\` garde la liste finale dans un ordre fixe ; une \`HashMap\`, non.
- \`bob\` arrive à t=250 avec un bucket plein — l'état est par clé, et choisir la clé, c'est la politique.
- À t=1500 alice est revenue à la capacité : 1250ms de crédit plafonnés à 5 tokens, pas 6.25.
`,
  },

  "backend-rpc-services-7": {
    instructions: `## Prouve qu'OFFSET perd une ligne

\`offset=3&limit=3\` veut dire « compte trois lignes depuis le début de la collection **telle qu'elle existe maintenant** ». Entre la page 1 et la page 2 la collection change — une ligne est supprimée et tout ce qui la suit descend d'un cran, donc la page 2 commence une ligne trop tard et une ligne que le client n'a jamais vue est sautée pour toujours. Un insert produit le bug miroir : un doublon.

Un cursor encode la position de la dernière ligne dans un ordre total stable (\`WHERE id > $cursor ORDER BY id LIMIT n\`), donc la page suivante est définie par le contenu plutôt que par un compte, et les modifications avant le cursor ne peuvent pas le décaler. Deux détails de contrat : trie sur quelque chose d'unique — \`created_at\` seul perd les lignes qui partagent un timestamp, donc la clé est \`(created_at, id)\` — et rends le token opaque pour pouvoir changer ce qu'il y a dedans sans casser les clients.

La terminaison fait aussi partie du contrat. Le cursor suivant est **absent** sur la dernière page ; c'est ça, et pas une page vide, qui dit à un client qu'il a fini.

### Ta tâche

1. \`page_by_offset\` renvoie \`ids.iter().skip(offset).take(limit)\` collecté — en comptant depuis le début de la table qu'on lui tend, quelle qu'elle soit.
2. \`page_by_cursor\` garde les ids strictement supérieurs au cursor (tous quand \`after\` est \`None\`), prend \`limit\`, et renvoie la page avec son cursor suivant : le **dernier** id de la page quand \`page.len() == limit\`, et \`None\` quand la page était courte.
3. \`missed\` renvoie les lignes survivantes qui ne sont apparues sur aucune page.

\`main\` supprime la ligne 2 entre la page 1 et la page 2 pour les deux clients.

Sortie attendue :

\`\`\`text
api=v1  page_size=3  row 2 is deleted between page 1 and page 2
client     req_id   argument     page
offset     a-1      offset=0     [1, 2, 3]
offset     a-2      offset=3     [5, 6, 7]
offset     a-3      offset=6     [8, 9]
cursor     b-1      after=start  [1, 2, 3]
cursor     b-2      after=3      [4, 5, 6]
cursor     b-3      after=6      [7, 8, 9]
rows still in the table: [1, 3, 4, 5, 6, 7, 8, 9]
offset client never saw: [4]
cursor client never saw: []
\`\`\`

### Indices

- \`page.last().copied()\` donne un \`Option<u64>\` directement depuis un \`Vec<u64>\`.
- La ligne 4 est celle que le client offset perd — elle est encore dans la table et n'est apparue sur aucune page.
- La colonne \`req_id\` est l'autre moitié du contrat : génères-en un à la frontière, renvoie-le dans chaque réponse, et mets-le dans chaque ligne de log et chaque appel downstream.
`,
  },
};
