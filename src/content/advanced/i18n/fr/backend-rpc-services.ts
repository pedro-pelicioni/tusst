import type { LessonStep } from "@/content/steps";

// FR · RPC Services at Scale.
//
// Overlay for ../../steps/backend-rpc-services.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendRpcServicesStepsFr: Record<string, LessonStep[]> = {
  "backend-rpc-services-1": [
    {
      kind: "theory",
      body: `Une Request JSON-RPC 2.0, c'est quatre membres : \`jsonrpc\`, \`method\`, un \`params\` optionnel et un \`id\` optionnel. Une Response transporte **soit** \`result\` **soit** \`error\` — jamais les deux, jamais aucun.

\`\`\`json
{"jsonrpc": "2.0", "method": "sum", "params": [1, 2], "id": 3}
{"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": 3}
\`\`\`

Cinq codes sont réservés, et ils partitionnent l'espace des échecs dans l'ordre où tu les vérifies :

| code | sens | ce que l'appelant apprend |
| --- | --- | --- |
| -32700 | Parse error | les bytes n'étaient pas du JSON |
| -32600 | Invalid Request | ça a parsé, mais ce n'est pas un objet Request |
| -32601 | Method not found | cet endpoint n'existe pas |
| -32602 | Invalid params | il existe — réessaie avec d'autres arguments |
| -32603 | Internal error | ce n'est pas toi, c'est le serveur |

\`-32000\` à \`-32099\` est laissé aux erreurs serveur propres à l'application : \`-32001 Request timeout\`, \`-32002 Server busy\`, et tout ce que ton contrat documente en plus.`,
    },
    {
      kind: "theory",
      body: `JSON-RPC ne dit **rien** sur HTTP. La même enveloppe voyage en HTTP/1.1, HTTP/2 ou sur un socket brut sans changer, et c'est le transport en dessous qui décide de ta concurrence, pas le protocole.

**HTTP/1.1 keep-alive** donne une requête en vol par connexion. N appels concurrents demandent un pool de N connexions, et le head-of-line blocking est par connexion — une réponse lente ne bloque que ce socket-là.

**HTTP/2** multiplexe plein de streams sur une seule connexion, donc un pool de 2–4 connexions sature un backend. Le prix : un seul événement de perte TCP bloque maintenant tous les streams qui partagent cette connexion.

Dimensionner un pool, c'est de l'arithmétique, pas du goût. Un pool de 8 contre un service limité à 200 connexions, avec 30 instances client, ça fait 240 connexions — et les 40 dernières sont une tempête de connexions refusées qui ressemble à une panne.

Deux détails de l'enveloppe qui mordent plus tard : l'\`id\` doit revenir **byte pour byte identique** (un id string revient en string), et l'ordre n'est pas garanti. L'id est la seule corrélation que le protocole te donne.`,
    },
    {
      kind: "quiz",
      question:
        "Un client appelle `sbutract` — une typo pour une méthode que le serveur n'a pas. Quel code, et pourquoi la distinction compte ?",
      options: [
        "-32601 Method not found : le nom n'est pas enregistré. -32602 est pour une méthode qui *existe* et dont les arguments ne typent pas",
        "-32602 Invalid params, parce que le nom de la méthode est lui-même un mauvais paramètre de la requête",
        "-32603 Internal error, puisque le serveur n'a pas pu terminer l'appel",
      ],
      answer: 0,
      explain:
        "Les confondre coûte à l'appelant le seul bit qui sépare « cet endpoint n'existe pas » de « réessaie avec d'autres arguments ». Un client qui voit -32602 va continuer à retry un endpoint qui n'existera jamais.",
    },
    {
      kind: "fill",
      prompt: "Un nom de méthode que le serveur ne connaît pas a son propre code.",
      file: "main.rs",
      before: "return Reply { code: ",
      after: ', message: "Method not found", id: r.id.clone() };',
      choices: ["-32601", "-32602", "-32600"],
      answer: 0,
      explain:
        "-32602 dirait que les arguments étaient faux pour une méthode qui existe ; -32600 dirait que l'objet requête lui-même était malformé. Aucun des deux n'est vrai ici — l'enveloppe était bonne et le nom n'était pas enregistré.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi -32700 et -32600 répondent avec `id: null` alors que -32601, -32602 et -32603 renvoient en écho l'id reçu ?",
      options: [
        "L'id n'est pas fiable tant que tu ne tiens pas un objet Request valide — le corps peut ne pas avoir parsé, ou le membre id peut être du mauvais type",
        "Null sert pour toute réponse d'erreur ; seuls les résultats réussis portent un id",
        "L'id n'est renvoyé que quand le handler a tourné, donc -32601 et -32602 envoient null aussi",
      ],
      answer: 0,
      explain:
        "« Renvoie toujours l'id que tu as reçu » est l'idée fausse. Sur un parse error il peut n'y avoir aucun id, et sur un objet Request invalide le membre peut être un objet ou un array. Une fois la requête validée, les trois codes restants renvoient l'écho.",
    },
    {
      kind: "editor",
      intro: `### Classe une requête entrante

Remplis \`classify\`. Fais les cinq vérifications dans l'ordre — parse, forme de la requête, méthode, params, handler — et réponds à chacune avec son code.

1. \`well_formed == false\` → \`-32700\` \`"Parse error"\`, id \`Id::Null\`.
2. \`version\` différent de \`Some("2.0")\`, ou \`method\` absent → \`-32600\` \`"Invalid Request"\`, id \`Id::Null\`.
3. Une méthode absente de \`methods\` → \`-32601\` \`"Method not found"\`, en renvoyant l'id.
4. \`params_ok == false\` → \`-32602\` \`"Invalid params"\`, en renvoyant l'id.
5. \`handler_ok == false\` → \`-32603\` \`"Internal error"\`, en renvoyant l'id.
6. Sinon \`Reply { code: 0, message: "result", id }\`.

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

Deux lignes répondent \`null\` et quatre renvoient l'écho — la coupure, c'est la leçon.`,
    },
  ],

  "backend-rpc-services-2": [
    {
      kind: "theory",
      body: `Le membre \`id\` est un interrupteur. Un objet Request **sans id** est une **notification** : le serveur exécute le handler et NE DOIT PAS envoyer d'objet réponse — pas de result, pas même une erreur.

C'est le contrat, pas une optimisation. Un client qui a envoyé une notification ne lit pas en attendant une réponse, et en écrire une désynchronise une connexion pipelinée : chaque réponse suivante est appariée à la mauvaise requête.

La spec est soigneuse sur une distinction que les gens aplatissent :

| corps | sens |
| --- | --- |
| \`{"jsonrpc":"2.0","method":"log"}\` | notification — pas de réponse |
| \`{"jsonrpc":"2.0","method":"log","id":null}\` | un appel dont l'id se trouve être null — réponds avec \`"id":null\` |

Un id **absent** et un id explicitement **null** sont des requêtes différentes.`,
    },
    {
      kind: "theory",
      body: `Un batch est un array JSON d'objets Request. Le serveur PEUT traiter les membres dans n'importe quel ordre et en concurrence, et l'array de réponse ne contient que les membres qui ont produit une réponse. Trois conséquences cassent les serveurs naïfs :

- Un **array vide** n'est pas un objet Request. Il reçoit un seul \`-32600\` avec \`id: null\`.
- Un batch de **notifications seulement** ne produit **aucun corps de réponse** — pas \`[]\`, rien.
- Un **membre malformé** répond avec \`id: null\`, parce que le serveur ne peut pas savoir si ce membre allait être une notification.

Et la règle d'ordre que le côté client doit honorer : apparie les réponses aux requêtes **par id**, jamais par position. L'array que tu reçois est plus court que celui que tu as envoyé et peut arriver dans n'importe quel ordre.`,
    },
    {
      kind: "quiz",
      question:
        "Un client envoie un batch de cinq notifications. Qu'est-ce qu'un serveur correct met sur le fil ?",
      options: [
        "Rien du tout — pas de corps de réponse, parce qu'aucun membre n'a produit d'objet réponse",
        "`[]`, un array vide, puisque le batch était valide et n'a simplement produit aucun résultat",
        "Cinq objets `{\"jsonrpc\":\"2.0\",\"result\":null}`, un par membre",
      ],
      answer: 0,
      explain:
        "Renvoyer `[]` est un vrai bug d'interop : un client strict traite un array vide comme une violation de protocole, parce que la spec dit que le serveur ne renvoie rien quand il n'y a rien à renvoyer. L'array de *requête* vide est le cas qui reçoit -32600 — pas la *réponse* vide.",
    },
    {
      kind: "fill",
      prompt:
        "Une notification exécute son handler puis produit la chose qui n'atteint jamais le fil.",
      file: "main.rs",
      before: "Frame::Notify { method } => {\n    effects.push(method);\n    ",
      after: "\n}",
      choices: ["None", 'Some(String::new())', 'Some("[]".to_string())'],
      answer: 0,
      explain:
        "`Some(String::new())` écrit un corps de longueur zéro, ce qui reste une écriture — et `handle_batch` le compterait comme une réponse et émettrait un `[]`. `None` est ce qui fait disparaître complètement le membre de la réponse du batch.",
    },
    {
      kind: "quiz",
      question:
        "Six frames arrivent à travers les batches de l'exercice, mais seulement trois corps de réponse sortent. Que dit ce ratio sur les notifications ?",
      options: [
        "L'effet de bord tourne quand même pour chaque notification — ce qui est supprimé, c'est la réponse, pas le travail",
        "Les notifications sont fire-and-forget, donc le serveur peut laisser tomber le handler sous charge",
        "Les trois réponses manquantes ont été perdues parce que leurs handlers ont échoué",
      ],
      answer: 0,
      explain:
        "« Fire-and-forget veut dire que le serveur peut sauter » est l'idée fausse, et elle transforme une écriture durable en no-op silencieux. Le compteur de l'exercice existe pour rendre la distinction comptable : six invocations de handler, trois corps.",
    },
    {
      kind: "editor",
      intro: `### Les frames qui ne reçoivent pas de réponse

Remplis \`handle_one\` et \`handle_batch\`.

1. \`Frame::Malformed\` → \`Some(error_obj(-32600, "Invalid Request", "null"))\`.
2. \`Frame::Notify { method }\` → pousse la méthode dans \`effects\`, renvoie \`None\`.
3. \`Frame::Call { method, id }\` → une méthode autre que \`"add"\` est \`-32601\` en renvoyant l'id ; sinon pousse la méthode et renvoie l'objet résultat avec \`"result":7\`.
4. \`handle_batch\` → une slice vide est un seul \`-32600\` avec un id null. Sinon passe par \`filter_map\` avec \`handle_one\`, renvoie \`None\` quand rien n'a répondu, sinon les réponses jointes par \`,\` entre crochets.

Sortie attendue :

\`\`\`text
single call              {"jsonrpc":"2.0","result":7,"id":1}
single notification      (no response)
empty batch              {"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}
batch of notifications   (no response)
mixed batch              [{"jsonrpc":"2.0","result":7,"id":2},{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null},{"jsonrpc":"2.0","error":{"code":-32601,"message":"Method not found"},"id":3}]
handlers run: 6
\`\`\`

Six handlers, trois corps.`,
    },
  ],

  "backend-rpc-services-3": [
    {
      kind: "theory",
      body: `Les handlers ont des corps différents mais doivent partager une seule signature, donc chacun est un trait object :

\`\`\`rust
type Handler = Box<dyn Fn(&[i64]) -> Result<i64, RpcError>>;
struct Router { routes: HashMap<&'static str, Handler> }
\`\`\`

Le box n'est pas de la cérémonie — c'est ce qui permet à des closures de types concrets différents de vivre dans une même collection. Le coût est une indirection de pointeur par appel, face à un lookup de hash déjà dominé par la lecture du socket.

Un \`match\` écrit à la main sur le nom de la méthode compile vers le même dispatch. Ce qu'il ne peut pas faire, c'est être **étendu au runtime** : aucun module qui enregistre ses propres méthodes au démarrage, pas de \`rpc.discover\`, pas de métriques par méthode énumérées depuis la table, et chaque nouvelle méthode recompile le fichier qui possède le match.

Un piège de sortie déterministe : l'ordre d'itération d'une \`HashMap\` n'est pas spécifié et varie d'un processus à l'autre. Toute liste de méthodes doit être triée avant d'être affichée ou hashée.`,
    },
    {
      kind: "theory",
      body: `Valider à la frontière, c'est ce que \`-32602\` veut dire. Dans un vrai service, c'est Serde qui fait ce boulot :

\`\`\`rust
#[derive(Deserialize)]
struct SumParams { values: Vec<i64> }
\`\`\`

Ça transforme « le JSON n'avait pas la forme que mon handler suppose » en échec typé à la frontière, avant qu'aucun code métier ne tourne. Les représentations d'enum untagged et internally-tagged décident comment une union de params est appariée à la forme sur le fil.

La coupure qui compte :

| échec | code | la faute à qui |
| --- | --- | --- |
| mauvaise arité, mauvais type, champ manquant | -32602 | l'appelant |
| le handler a tourné et a explosé | -32603 | le serveur |

Et \`-32603\` ne doit jamais faire fuiter un message interne. \`"Internal error"\` sur le fil, l'id de la requête et la stack trace dans les logs — un message d'erreur est un canal d'exfiltration pour les noms de tables, les chemins de fichiers et le texte des requêtes SQL.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi préférer une `HashMap` de handlers en box à un `match` sur la string de la méthode ?",
      options: [
        "La table peut être remplie au démarrage par des modules indépendants et énumérée au runtime ; un `match` rend les deux impossibles",
        "La `HashMap` dispatche en O(1) alors qu'un `match` sur des strings est une chaîne linéaire de comparaisons",
        "Les closures en box évitent la monomorphization qui ferait autrement gonfler le binaire",
      ],
      answer: 0,
      explain:
        "Un `match` sur des littéraux string est compilé en arbre de décision par longueur et préfixe, donc l'argument de performance, c'est presque kif-kif. Enregistrabilité et introspection sont la vraie différence, et c'est ce dont une frontière de plugin a besoin.",
    },
    {
      kind: "fill",
      prompt:
        "Rends la liste des méthodes identique à chaque exécution, quelle qu'ait été la seed du hash.",
      file: "main.rs",
      before:
        "let mut names: Vec<&'static str> = self.routes.keys().copied().collect();\nnames.",
      after: "();\nnames",
      choices: ["sort", "dedup", "reverse"],
      answer: 0,
      explain:
        "`dedup` ne retire que les doublons *adjacents*, ce qui sur une entrée non triée est presque un no-op, et les clés sont uniques de toute façon. `reverse` inverse un ordre qui était déjà arbitraire.",
    },
    {
      kind: "quiz",
      question:
        "`div` est appelé avec `[10, 0]`. Les params ont typé ; le handler a divisé par zéro. Quel code ?",
      options: [
        "-32603 Internal error — on est entré dans le handler et il a échoué",
        "-32602 Invalid params, parce que ce sont les paramètres qui ont causé l'échec",
        "-32600 Invalid Request, puisque la requête n'aurait jamais pu réussir",
      ],
      answer: 0,
      explain:
        "La réponse tentante est -32602 : les params l'ont bien causé. Mais -32602 est réservé à la vérification de forme et d'arité qui se fait *avant* d'entrer dans le handler. Une fois dans le handler, chaque échec est le tien.",
    },
    {
      kind: "editor",
      intro: `### Un routeur de handlers en box

1. \`register\` insère le handler en box dans \`self.routes\` sous son nom.
2. \`dispatch\` cherche la méthode ; \`None\` est \`-32601\` \`"Method not found"\`.
3. \`method_names\` collecte les clés et les **trie**.
4. Enregistre deux handlers dans \`main\` :
   - \`"sum"\` → \`Ok(params.iter().sum())\`.
   - \`"div"\` → \`-32602\` quand \`params.len() != 2\`, \`-32603\` quand le diviseur est zéro, sinon \`Ok(params[0] / params[1])\`.

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

Trois échecs différents, trois codes différents, un seul lookup de table.`,
    },
  ],

  "backend-rpc-services-4": [
    {
      kind: "theory",
      body: `Tout l'écosystème Tower, c'est deux traits.

\`\`\`rust
trait Service { fn call(&mut self, req: &Req) -> Resp; }
trait Layer<S> { type Svc; fn layer(&self, inner: S) -> Self::Svc; }
\`\`\`

\`Service\`, c'est requête en entrée, réponse en sortie. \`Layer\` prend un service et renvoie un service. C'est toute l'abstraction — timeout, retry, limite de concurrence, auth, tracing, load balancing sont tous une struct qui tient un \`S\` interne, et qui implémente \`Service\` en faisant quelque chose puis en appelant \`self.inner.call(req)\`.

Le vrai Tower ajoute \`poll_ready\` — le canal de backpressure, où un service dit « pas maintenant » **avant** que tu lui tendes une requête — plus des types associés Response, Error et Future. La forme, c'est ce que tu construis ici.`,
    },
    {
      kind: "theory",
      body: `\`TimeoutLayer.layer(CountLayer.layer(Backend))\` construit un oignon. Le timeout est le plus externe, donc une requête hors budget est rejetée sans que le backend soit jamais atteint, et le compteur affiche **3 sur 5**. Inverse les deux et les cinq atteignent le backend, le timeout ne bornant plus que la réponse.

Une pile de layers est un ordre total sur des préoccupations transversales, et tu devrais pouvoir la défendre :

| décision | au-dessus | en dessous |
| --- | --- | --- |
| auth vs rate limit | le trafic non authentifié consomme quand même du quota | ton limiter fait de la crypto pour du trafic poubelle |
| tracing vs retry | un span par appel logique | un span par tentative |
| timeout vs limite de concurrence | l'attente en file compte dans le budget | seul le temps de service compte |

Aucune n'a de réponse universelle. Toutes ont une réponse pour ton service.`,
    },
    {
      kind: "quiz",
      question:
        "Le layer de timeout rejette une requête à 100ms. Qu'est-il arrivé au travail que le backend avait déjà commencé ?",
      options: [
        "Il va jusqu'au bout — le timeout drop la future interne, ce qui libère ce thread mais pas la query déjà en vol",
        "Il est annulé et sa connexion est libérée à l'instant où le timeout se déclenche",
        "Il est pollé une fois de plus avec un flag d'annulation, et se déroule proprement",
      ],
      answer: 0,
      explain:
        "C'est pour ça qu'un timeout ne protège pas une base de données d'une query lente : dropper la future rend le thread de l'appelant, mais le travail côté serveur continue. Le borner demande un statement timeout de l'autre côté, pas un layer de ce côté-ci.",
    },
    {
      kind: "fill",
      prompt: "Le layer de comptage enregistre l'appel, puis le passe plus loin.",
      file: "main.rs",
      before: "self.calls += 1;\n",
      after: "\n",
      choices: [
        "self.inner.call(req)",
        "Resp::Ok(req.cost_ms)",
        "Backend.call(req)",
      ],
      answer: 0,
      explain:
        "La deuxième répond elle-même à la requête, donc rien en dessous du compteur ne tourne jamais. La troisième appelle un `Backend` tout neuf au lieu du service qu'on lui a confié — ce qui jette en silence tous les layers en dessous dans la pile.",
    },
    {
      kind: "quiz",
      question:
        "`CountLayer.layer(TimeoutLayer.layer(Backend))` à la place. Qu'affiche le compteur, et qu'est-ce qui a changé ?",
      options: [
        "5 — le compteur est maintenant le plus externe, donc il voit chaque requête, y compris les deux que le timeout rejette",
        "3 — pareil, puisque le timeout rejette toujours les deux mêmes requêtes",
        "0 — le compteur n'enveloppe plus le backend, donc il ne compte rien",
      ],
      answer: 0,
      explain:
        "L'ordre détermine ce que chaque layer *voit*. Les deux mêmes requêtes échouent dans les deux cas ; ce qui bouge, c'est la mesure — et c'est exactement pour ça que « requêtes reçues » et « requêtes servies » sont des métriques différentes et veulent des positions différentes dans la pile.",
    },
    {
      kind: "editor",
      intro: `### Service et Layer

Écris quatre impls.

1. \`impl<S: Service> Service for Counted<S>\` — incrémente \`self.calls\`, puis délègue à \`self.inner.call(req)\`.
2. \`impl<S> Layer<S> for CountLayer\`, \`type Svc = Counted<S>\`, qui construit \`Counted { inner, calls: 0 }\`.
3. \`impl<S: Service> Service for Timeout<S>\` — quand \`req.cost_ms > self.limit_ms\`, renvoie \`Resp::Err(-32001, "Request timeout")\` **sans** appeler le service interne.
4. \`impl<S> Layer<S> for TimeoutLayer\`, \`type Svc = Timeout<S>\`, qui fait passer \`limit_ms\`.

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

Rien ne dort : le coût est une donnée sur la requête et le timeout est une comparaison. La dernière ligne est la preuve que l'ordre est une décision de design.`,
    },
  ],

  "backend-rpc-services-5": [
    {
      kind: "theory",
      body: `Une limite de concurrence est le seul bouton qui borne vraiment un service. Threads, connexions, handles de base de données — quelque chose est fini, et si tu ne choisis pas le nombre, la machine le choisit pour toi, mal : un pool de 500 threads qui passe sa vie en context switches, ou un pool épuisé par une seule dépendance lente pendant que tous les autres endpoints dessus s'éteignent.

Un layer de limite tient un compte de permits. Quand les permits sont épuisés, il doit choisir entre deux politiques, et ce choix est cette leçon :

- **shed** — rejeter immédiatement avec un code documenté de la plage \`-32000..-32099\`
- **queue** — retenir la requête jusqu'à ce qu'un permit se libère

Les deux font échouer les mêmes requêtes ici. Une seule des deux dépense le temps du backend pour le faire.`,
    },
    {
      kind: "theory",
      body: `Mettre en file ne crée pas de capacité. Ça convertit du rejet en latence.

La loi de Little, c'est \`L = λW\` : à un taux d'arrivée au-dessus de la capacité de service, longueur de file et attente croissent sans borne. Une requête qui attend 150ms derrière un pool plein puis tourne 150ms a brûlé du temps de backend pour produire une réponse à 300ms pour un client dont la deadline était 200ms — un client qui a déjà retry, doublant λ.

C'est la panne métastable que tout le monde a vue une fois. Le service n'est pas down. Il est à 100 % d'utilisation, à servir du travail qui sera jeté à l'arrivée, et il ne se rétablira pas tant que les retries continuent.

Shed tôt garde les requêtes admises rapides et garde l'échec lisible : un \`-32002\` documenté, un \`retry_after\`, un contrat client qui dit retryable-avec-backoff, et un compte de rejets que tu peux mettre sur un dashboard. La backpressure est la même idée un niveau plus haut — une file bornée dont le remplissage est un signal qui remonte jusqu'au producteur.`,
    },
    {
      kind: "quiz",
      question:
        "La file devant un service saturé est doublée pour absorber les bursts. Qu'est-ce que ça achète ?",
      options: [
        "Une latence plus haute à laquelle les requêtes échouent — ça convertit des échecs rapides en échecs lents et retarde le rétablissement",
        "Plus de disponibilité, puisque des requêtes qui auraient été rejetées réussissent maintenant",
        "Rien de mesurable, parce que la profondeur de la file n'affecte le taux de service dans aucun des deux cas",
      ],
      answer: 0,
      explain:
        "Une file plus grande n'aide qu'un burst court par rapport au taux de service. Contre une surcharge soutenue, elle augmente l'attente jusqu'à ce que chaque requête admise rate sa deadline — l'exercice montre des comptes de succès identiques avec 320ms de travail backend condamné comme seule différence.",
    },
    {
      kind: "fill",
      prompt:
        "Avant d'admettre quoi que ce soit, vire les slots dont le travail est déjà terminé.",
      file: "main.rs",
      before: "busy_until.",
      after: "(|finish| *finish > now);",
      choices: ["retain", "iter", "drain"],
      answer: 0,
      explain:
        "`iter` construit un iterator paresseux et ne mute rien, donc le pool se remplirait et ne se libérerait jamais. `drain` prend un range, pas un prédicat, et viderait le pool en bloc.",
    },
    {
      kind: "quiz",
      question:
        "Un client soutient que le shedding est pire pour lui : un rejet est un échec, alors qu'une requête en file peut encore réussir. Quelle est la réponse ?",
      options: [
        "Un rejet à 0ms est une réponse retryable dans son budget ; un timeout à 310ms est un échec qui a en plus consommé le serveur. Ce n'est pas le même échec",
        "Il a raison, et le fix est une deadline client plus longue pour que les requêtes en file aient le temps d'atterrir",
        "Il a raison pour un client isolé, mais le shedding est choisi quand même parce que le coût serveur pèse plus que l'expérience client",
      ],
      answer: 0,
      explain:
        "C'est la deadline du client lui-même qui tranche. Une requête qui ne peut pas finir dans le budget a déjà échoué ; la mettre en file ne fait que cacher quand. Le shedding rend le budget au client pendant qu'il est encore dépensable — sur un retry, un fallback ou une réponse dégradée.",
    },
    {
      kind: "editor",
      intro: `### Shed ou queue

Complète \`simulate\`. Pour chaque arrivée, dans l'ordre :

1. \`now = req.at_ms\` ; \`retain\` seulement les entrées de \`busy_until\` encore \`> now\`.
2. Plein **et** \`shed_early\` → compte un rejet, affiche wait \`0\`, latency \`0\`, backend \`"no"\`, \`"-32002 Server busy"\`, continue.
3. Sinon démarre à \`now\` si un slot est libre, sinon au temps de fin **le plus tôt** — retire ce slot.
4. \`finish = start + req.cost_ms\`, \`latency = finish - now\`, pousse \`finish\`.
5. \`latency > DEADLINE_MS\` → compte un rejet, ajoute \`req.cost_ms\` à \`doomed_ms\`, \`"-32001 Request timeout"\` ; sinon \`"ok"\`. Backend \`"yes"\` dans les deux cas.

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

Les deux mêmes succès, les trois mêmes échecs, 320ms de temps backend comme seule chose que la file a achetée.`,
    },
  ],

  "backend-rpc-services-6": [
    {
      kind: "theory",
      body: `Un token bucket tient jusqu'à \`capacity\` tokens et se remplit à un taux fixe. Une requête coûte un token ; une requête qui ne peut pas payer est rejetée. Deux propriétés en découlent, et c'est pour ça que c'est la bonne forme pour un quota d'API :

- il autorise un burst de \`capacity\`, puis se cale exactement sur le taux de refill
- il n'a jamais de frontière de fenêtre — une fenêtre fixe de 60/minute laisse un client envoyer 120 requêtes en deux secondes à cheval sur la couture

Le détail d'implémentation qui compte : **ne lance pas de timer de refill.** Remplis paresseusement à l'accès depuis \`(now - last_seen) * rate\`, plafonné à la capacité.

\`\`\`rust
let earned = (now_ms - self.last_ms) * REFILL_PER_MS;
self.tokens = (self.tokens + earned).min(CAPACITY);
\`\`\`

Une ligne d'arithmétique, pas de tâche de fond, deux entiers d'état par client. Les milli-tokens gardent tout en entiers pour qu'il n'y ait pas de dérive flottante, et \`(deficit + rate - 1) / rate\` est la division plafond qui transforme un manque en \`retry_after\` que le client peut honorer.`,
    },
    {
      kind: "theory",
      body: `Le bucket est par **clé**, et choisir la clé, *c'est* la politique. Id client, API key, tenant, IP — et une clé sur l'IP derrière un NAT ou un CDN rate-limite un bureau entier comme un seul client.

Cet état est aussi la raison pour laquelle une flotte RPC n'est que presque stateless. Fais tourner ce limiter in-process sur 10 nœuds derrière un load balancer round-robin et une limite de 5/s devient 50/s — et elle change à chaque fois que la flotte autoscale. Les options sont les vraies :

| approche | coût |
| --- | --- |
| diviser la limite par le nombre de nœuds | faux dès qu'un nœud meurt ou est ajouté |
| centraliser dans Redis | un aller-retour réseau dans le chemin de la requête, et une dépendance dure |
| compteurs distribués approximatifs | correct en moyenne, dépasse exprès |

Tout le *reste* du service devrait rester vraiment stateless : pas d'affinité de session, pas d'état utilisateur en mémoire. Alors n'importe quel nœud sert n'importe quelle requête et un rolling deploy n'est pas une migration de données.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi remplir paresseusement à l'accès plutôt que faire tiquer chaque bucket depuis une tâche de fond ?",
      options: [
        "Un ticker, c'est O(clients) de travail par tick pour des buckets que personne n'utilise ; le refill paresseux est O(1) par requête et arithmétiquement identique",
        "Une tâche de fond ne peut pas muter la map de buckets sans lock, et le refill paresseux évite le lock",
        "Le refill paresseux est plus précis, parce qu'un ticker quantifie les tokens à l'intervalle du tick",
      ],
      answer: 0,
      explain:
        "L'argument du lock est réel mais secondaire — il t'en faut un dans les deux cas. L'argument de précision est faux : un ticker à 1ms est exact aussi, il dépense juste du CPU proportionnel au nombre de clés inactives pour l'être.",
    },
    {
      kind: "fill",
      prompt: "Crédite le temps écoulé, mais jamais au-dessus de ce que le bucket contient.",
      file: "main.rs",
      before: "self.tokens = (self.tokens + earned).",
      after: "(CAPACITY);",
      choices: ["min", "max", "rem_euclid"],
      answer: 0,
      explain:
        "`max` mettrait un plancher au bucket à capacity, donc un client inactif une seconde aurait un budget infini. Sans le clamp du tout, un client inactif une heure arrive avec 18 000 tokens et la limite de burst ne veut plus rien dire.",
    },
    {
      kind: "quiz",
      question:
        "Le limiter tourne in-process, ne tient que deux entiers par client, et le service est décrit comme horizontalement scalable. Qu'est-ce qui cloche dans cette description ?",
      options: [
        "Les buckets par nœud multiplient la limite configurée par le nombre de nœuds et dérivent avec l'autoscaling — la limite dans ta doc d'API n'est pas celle que tu appliques",
        "Rien — le rate limiting par nœud est exact tant que le load balancer est round-robin",
        "L'état des buckets rend les nœuds stateful, donc un rolling deploy va perdre des requêtes en vol",
      ],
      answer: 0,
      explain:
        "Un rolling deploy qui perd l'état des buckets est inoffensif — les clients reviennent avec des buckets pleins, ce qui se trompe en faveur du client. La multiplication, c'est le bug : 10 nœuds qui appliquent 5/s chacun, c'est 50/s, et 30 nœuds, c'est 150/s, en silence, le jour où tu scales.",
    },
    {
      kind: "editor",
      intro: `### Un token bucket par client

1. \`Bucket::new\` démarre un client plein : \`tokens: CAPACITY\`, \`last_ms: 0\`.
2. \`refill(now_ms)\` crédite \`(now_ms - self.last_ms) * REFILL_PER_MS\`, plafonne à \`CAPACITY\`, stocke \`last_ms\`.
3. \`take\` soustrait \`COST\` et renvoie \`Ok(self.tokens)\` quand il y en a assez ; sinon renvoie \`Err\` portant \`(deficit + REFILL_PER_MS - 1) / REFILL_PER_MS\` — les millisecondes jusqu'à ce qu'un token entier existe. Un refus ne dépense rien.

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

Un burst de cinq, puis exactement le taux de refill. À t=1500 alice est à la capacité, pas au-dessus.`,
    },
  ],

  "backend-rpc-services-7": [
    {
      kind: "theory",
      body: `\`offset=3&limit=3\` veut dire « compte trois lignes depuis le début de la collection **telle qu'elle existe maintenant** ». C'est une promesse que tu ne peux pas tenir sur plus d'une requête.

Supprime une ligne entre la page 1 et la page 2 et chaque ligne après elle descend d'un cran. La page 2 commence une ligne trop tard, et une ligne que le client n'a jamais vue est sautée **pour toujours** — pas d'erreur, pas de trou dans la sortie, rien sur quoi alerter. Un insert produit le bug miroir : un doublon.

Un cursor est un token opaque qui encode la position de la dernière ligne dans un ordre total stable :

\`\`\`sql
SELECT * FROM rows WHERE id > $cursor ORDER BY id LIMIT 3
\`\`\`

La page suivante est définie par le contenu, pas par un compte, donc les modifications avant le cursor ne peuvent pas le décaler. Deux détails de contrat : trie sur quelque chose d'**unique** — \`created_at\` seul perd les lignes qui partagent un timestamp, donc la clé est \`(created_at, id)\` — et garde le token opaque (le tuple en base64) pour pouvoir changer ce qu'il y a dedans sans casser les clients.

La terminaison fait partie du contrat : \`next_cursor\` est **absent** sur la dernière page. C'est ça, et pas une page vide, qui dit à un client qu'il a fini.

L'argument de coût pour les cursors — qu'\`OFFSET\` est en O(offset + limit) et qu'un keyset seek est en O(log n + limit) à n'importe quelle profondeur — est le sujet de *La couche de données*, leçon 4. Cette leçon porte sur l'autre moitié : ce que les deux contrats promettent à un client dont la collection change sous ses pieds.`,
    },
    {
      kind: "theory",
      body: `Le reste du contrat, en trois parties.

**Versioning.** Les changements additifs — un nouveau champ optionnel, une nouvelle méthode — n'ont pas besoin de version. Un champ retiré ou un type modifié, si. Le mécanisme le moins cher en JSON-RPC est le nom de la méthode lui-même : \`user.get\` et \`user.get.v2\`, ce qui versionne par endpoint au lieu de geler toute l'API sur son consommateur le plus lent. Déprécie à une date publiée avec des métriques d'usage par client, pas sur un espoir.

**Request IDs.** Génères-en un à la frontière si le client n'en a pas envoyé, renvoie-le dans chaque réponse, et mets-le dans chaque ligne de log et chaque appel downstream. C'est la seule chose qui te laisse reconstruire le chemin d'une requête à travers une flotte, et ça coûte un header.

**Schémas d'erreur.** Le membre \`data\` d'une erreur JSON-RPC est là où va le détail lisible par machine — quel champ a échoué, \`retryable: true\`, un \`retry_after_ms\`. Il devrait être aussi stable que tes types de succès, parce que les clients branchent dessus.`,
    },
    {
      kind: "quiz",
      question:
        "Un ingénieur défend la pagination par OFFSET : le tri est déterministe, donc les pages sont déterministes. Qu'est-ce qui cloche ?",
      options: [
        "Le déterminisme du tri n'est pas le problème — c'est la collection qui mute sous un parcours multi-requêtes, et un delete avant l'offset saute une ligne en silence",
        "Le tri n'est pas déterministe, parce que les égalités sur la clé de tri sont ordonnées arbitrairement par le planner",
        "Rien ne cloche tant que la requête tourne dans une seule transaction repeatable-read",
      ],
      answer: 0,
      explain:
        "Le départage des égalités est un vrai bug, séparé, et une transaction snapshot longue durée corrige bien la justesse, au prix de garder une vue de lecture ouverte pendant le temps de réflexion du client. Aucun des deux n'est l'argument : le parcours par offset est faux même avec un tri unique parfait, parce que le compte sur lequel il repose a changé.",
    },
    {
      kind: "fill",
      prompt:
        "Le cursor suivant est la position de la dernière ligne que cette page a livrée.",
      file: "main.rs",
      before: "let next = if page.len() == limit { page.",
      after: "().copied() } else { None };",
      choices: ["last", "first", "iter().next"],
      answer: 0,
      explain:
        "`first` (et `iter().next`) rend un cursor que le client a déjà dépassé, donc la page suivante relivre tout ce qui suit la ligne un — une boucle infinie qui a l'air d'avancer.",
    },
    {
      kind: "quiz",
      question:
        "Un client pagine jusqu'à recevoir une page vide. Qu'est-ce qui casse ?",
      options: [
        "Il fait un aller-retour gaspillé à chaque parcours, et il casse dès qu'une page est courte pour n'importe quelle autre raison — un contrat correct signale la terminaison par un next_cursor absent",
        "Rien — une page vide est le signal standard de terminaison pour la pagination par cursor",
        "Il compte la dernière page en double, parce que la réponse vide porte encore un cursor",
      ],
      answer: 0,
      explain:
        "Les pages sont courtes pour d'autres raisons que la fin : un filtre appliqué après le limit, une ligne que l'appelant n'est pas autorisé à voir, un enregistrement soft-deleted. Un client qui traite courte-mais-pas-vide comme « continue » s'en sort ; un qui la traite comme la fin, non — c'est pour ça que le signal, c'est le cursor, pas la longueur de la page.",
    },
    {
      kind: "editor",
      intro: `### Prouve qu'OFFSET perd une ligne

1. \`page_by_offset\` → \`skip(offset).take(limit)\`, en comptant depuis le début de la table qu'on lui tend, quelle qu'elle soit.
2. \`page_by_cursor\` → les ids strictement supérieurs au cursor (tous quand \`after\` est \`None\`), \`take(limit)\`, en renvoyant la page plus son cursor suivant : le **dernier** id de la page quand \`page.len() == limit\`, et \`None\` quand la page était courte.
3. \`missed\` → les lignes survivantes qui ne sont apparues sur aucune page.

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

La ligne 4 est encore dans la table et n'est apparue sur aucune page. C'est ça le bug, nommé.`,
    },
  ],
};
