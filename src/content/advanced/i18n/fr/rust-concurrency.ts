import type { LessonStep } from "@/content/steps";

// FR · Threads, Send/Sync & Shared State.
//
// Overlay for ../../steps/rust-concurrency.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustConcurrencyStepsFr: Record<string, LessonStep[]> = {
  "rust-concurrency-1": [
    {
      kind: "theory",
      body: `\`thread::spawn\` démarre un vrai thread de l'OS et renvoie un \`JoinHandle<T>\`, où \`T\` est ce que la closure renvoie.

\`\`\`rust
let h = thread::spawn(move || id * id);
let value = h.join().unwrap();
\`\`\`

\`join()\` bloque jusqu'à ce que ce thread se termine et te donne sa valeur de retour — enveloppée dans un \`Result\`, parce que le thread a pu **panic**. \`Err\`, c'est le panic ; le \`unwrap()\` ici le propage dans le thread parent.`,
    },
    {
      kind: "theory",
      body: `Deux choses sur \`spawn\` qui façonnent tout ce que tu écris avec.

**La closure doit être \`'static\`.** Le thread peut survivre à la fonction qui l'a créé, donc il n'a pas le droit d'emprunter les locales de cette fonction. \`move\` est presque toujours obligatoire, et c'est pour ça que partager des données veut dire \`Arc\`, pas \`&\`.

**Les threads détachés sont tués à la sortie.** Si \`main\` retourne sans join, les threads en cours sont terminés là où ils en sont — pas d'unwinding, pas de destructeurs. Collecter les handles et faire un join sur chacun, ce n'est pas de la propreté, c'est la seule façon de savoir que le travail est fini.

\`\`\`rust
for h in handles { results.push(h.join().unwrap()); }
\`\`\`

Faire les join dans l'ordre de spawn rend les *résultats* déterministes même si l'*exécution* ne l'était pas — et c'est ce qui rend un calcul parallèle testable.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `join()` renvoie-t-il un `Result` ?",
      options: [
        "Le thread a pu panic, et `Err` transporte le payload du panic au lieu de le perdre",
        "Le thread peut encore tourner, et `Err` veut dire « pas terminé »",
        "Le `Result` indique si l'OS a réussi à allouer un thread",
      ],
      answer: 0,
      explain:
        "Un panic dans un thread spawné n'abandonne pas le processus par défaut — il termine ce thread. Sans vérifier le `Result`, tu traiterais en silence un worker qui a planté comme un worker qui n'a rien fait.",
    },
    {
      kind: "fill",
      prompt:
        "Donne au thread l'ownership de la valeur capturée, pour qu'il n'ait pas besoin d'emprunter une locale.",
      file: "main.rs",
      before: "handles.push(thread::spawn(",
      after: "|| id * id));",
      choices: ["move ", "", "&"],
      answer: 0,
      explain:
        "Sans `move`, la closure emprunte `id`, et le compilateur refuse : le thread peut survivre à l'itération de boucle qui en est propriétaire.",
    },
    {
      kind: "quiz",
      question:
        "`main` spawne quatre workers et retourne sans faire de join sur aucun. Que leur arrive-t-il ?",
      options: [
        "Ils sont tués à la sortie du processus, en plein travail, sans unwinding et sans exécution des destructeurs",
        "Le processus attend chaque thread avant de sortir",
        "Ils sont promus threads daemon et continuent de tourner après la sortie",
      ],
      answer: 0,
      explain:
        "C'est une vraie source d'écritures perdues et de sortie tronquée. Fais un join sur les handles, ou garde quelque chose que les workers signalent avant de retourner.",
    },
    {
      kind: "editor",
      intro: `### Fan out, puis collecte

1. Spawne quatre threads, un par \`id\` dans \`0..4u32\`, chacun renvoyant \`id * id\`.
2. Pousse chaque \`JoinHandle\` dans un \`Vec\`.
3. Fais les join **dans l'ordre de spawn** dans un \`Vec<u32>\`, affiche-le avec \`{:?}\`, puis affiche la somme.

Sortie attendue :

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

L'ordre d'exécution n'est pas déterministe ; faire les join dans l'ordre rend quand même le *résultat* déterministe.`,
    },
  ],

  "rust-concurrency-2": [
    {
      kind: "theory",
      body: `Deux marker traits portent toute la sûreté des threads en Rust. Aucun n'a de méthode — ce sont des affirmations que le compilateur vérifie, puis fait respecter.

**\`Send\`** — la valeur peut être **déplacée** vers un autre thread.
**\`Sync\`** — la valeur peut être **partagée** par référence entre threads. Formellement : \`T\` est \`Sync\` si et seulement si \`&T\` est \`Send\`.

Ce sont des **auto traits** : un type les obtient automatiquement quand tous ses champs les ont. Tu ne les implémentes presque jamais à la main, et le faire exige \`unsafe\`, parce que tu fais une promesse que le compilateur ne peut pas vérifier.`,
    },
    {
      kind: "theory",
      body: `Les cas instructifs, ce sont les types qui ont l'un et pas l'autre.

**\`Rc<T>\` : aucun des deux.** Son compteur de références est un entier ordinaire avec des incréments non atomiques. Deux threads qui clonent en même temps feraient une race et libéreraient la valeur trop tôt — un use-after-free. \`Arc<T>\` est le même type avec un compteur atomique, et il a les deux.

**\`Cell<T>\` : \`Send\` mais pas \`Sync\`.** Déplacer une \`Cell\` entière vers un autre thread, c'est ok — un seul thread la détient. *Partager* \`&Cell\`, non : \`set\` est une écriture ordinaire, donc deux threads qui écrivent en même temps font une race. C'est la paire qui fait cliquer la distinction.

**\`MutexGuard\` : \`Sync\` mais pas \`Send\`.** Certaines plateformes exigent que le thread qui a verrouillé un mutex soit celui qui le déverrouille, donc le guard ne doit pas traverser les threads.

Tout le reste en découle : \`Mutex<T>\` est \`Sync\` quand \`T: Send\`, et c'est exactement pour ça que \`Arc<Mutex<T>>\` est le type de l'état mutable partagé.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `Cell<T>` est-il `Send` mais pas `Sync` ?",
      options: [
        "Déplacer la cell entière est ok parce qu'un seul thread la détient ; partager `&Cell` ne l'est pas, parce que `set` est une écriture non synchronisée",
        "`Cell` contient un lock, et les locks ne peuvent pas être partagés",
        "Il est `Sync` ; seul `RefCell` ne l'est pas",
      ],
      answer: 0,
      explain:
        "C'est l'illustration la plus propre de la séparation. `Send` parle de céder la valeur ; `Sync` parle de deux threads qui la touchent en même temps.",
    },
    {
      kind: "fill",
      prompt:
        "Borne un helper pour qu'il n'accepte que des valeurs qui peuvent être déplacées vers un autre thread.",
      file: "main.rs",
      before: "fn assert_send<T: ",
      after: ">(_: &T) -> &'static str {",
      choices: ["Send", "Sync", "Copy"],
      answer: 0,
      explain:
        "Le helper ne déplace jamais rien en réalité — il existe pour que le *bound* force le compilateur à prouver la propriété. L'appeler avec un `Rc` est une erreur de compilation, et c'est ça la démonstration.",
    },
    {
      kind: "quiz",
      question:
        "Tu obtiens 'the trait `Send` is not implemented for `Rc<Config>`' sur une task spawnée. Quel est le correctif ?",
      options: [
        "Utiliser `Arc<Config>` — le même ownership partagé avec un compteur de références atomique",
        "Envelopper le `Rc` dans un `Mutex`, ce qui rend n'importe quel type `Send`",
        "Ajouter `unsafe impl Send for Rc<Config>`",
      ],
      answer: 0,
      explain:
        "`Mutex` ne sauve rien : `Mutex<T>` n'est `Send`/`Sync` que quand `T` est `Send`. Et le `unsafe impl` compilerait, puis ferait une race — le compilateur avait raison.",
    },
    {
      kind: "editor",
      intro: `### Prouve les propriétés

1. Écris \`fn assert_send<T: Send>(_: &T) -> &'static str\` qui renvoie \`"Send"\`, et \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` qui renvoie \`"Sync"\`.
2. Montre que \`Arc<u32>\` satisfait les deux.
3. Crée un \`Rc<u32>\` et affiche juste sa valeur — le passer à \`assert_send\` ne compilerait pas, et c'est ça la leçon.
4. Montre que \`Cell<u32>\` satisfait \`Send\`. (Il n'est pas \`Sync\`, donc n'appelle pas \`assert_sync\` dessus.)

Sortie attendue :

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\``,
    },
  ],

  "rust-concurrency-3": [
    {
      kind: "theory",
      body: `\`Arc<T>\` est \`Rc<T>\` avec un compteur de références **atomique**. Cette seule différence est ce qui le rend \`Send + Sync\` (quand \`T\` l'est), et c'est la façon standard de confier les mêmes données à plusieurs threads.

\`\`\`rust
let table = Arc::new(big_vec);
for chunk in 0..4 {
    let table = Arc::clone(&table);      // un incrément atomique
    thread::spawn(move || { /* lit table */ });
}
\`\`\`

Le \`let table = Arc::clone(&table);\` qui shadow à l'intérieur de la boucle est l'idiome : il clone le handle pour cette itération, et la closure \`move\` prend ce clone plutôt que le binding extérieur.`,
    },
    {
      kind: "theory",
      body: `\`Arc<T>\` seul donne un **accès partagé en lecture seule** — il distribue des \`&T\`, jamais de \`&mut T\`. Pour une grosse table de lookup, une config ou une map de routes compilée, c'est exactement ce que tu veux, et ça n'a besoin d'aucun lock.

Le coût est honnête mais petit : un incrément atomique au clone et un décrément atomique au drop, chacun étant une opération synchronisée sur une ligne de cache que tous les threads partagent. Cloner un \`Arc\` dans une boucle interne serrée, ça se mesure ; le cloner une fois par task, non.

Pour la **mutation**, compose : \`Arc<Mutex<T>>\` ou \`Arc<RwLock<T>>\`. Le \`Arc\` fournit l'ownership partagé entre threads, le type interne fournit l'accès synchronisé. Ils sont orthogonaux, et confondre les deux est la source la plus courante de « pourquoi ça ne compile pas » en Rust concurrent débutant.`,
    },
    {
      kind: "quiz",
      question:
        "Que permet `Arc<T>` tout seul à plusieurs threads de faire avec la valeur ?",
      options: [
        "La lire — il ne distribue que des `&T`. La mutation exige un `Mutex` ou un `RwLock` interne",
        "La lire et l'écrire ; le compteur atomique synchronise l'accès",
        "Rien tant qu'il n'est pas verrouillé ; chaque accès à un `Arc` prend un lock",
      ],
      answer: 0,
      explain:
        "Le compteur atomique protège le *compteur*, pas les données. `Arc` et `Mutex` résolvent deux problèmes différents et se composent pour cette raison.",
    },
    {
      kind: "fill",
      prompt: "Donne au thread de cette itération son propre handle vers la table partagée.",
      file: "main.rs",
      before: "let table = Arc::",
      after: "(&table);",
      choices: ["clone", "new", "get_mut"],
      answer: 0,
      explain:
        "`Arc::new` allouerait une seconde table, sans rapport avec la première. `get_mut` ne renvoie `Some` que quand le compteur vaut 1, ce qui n'est jamais le cas ici.",
    },
    {
      kind: "quiz",
      question:
        "Après le join de quatre threads workers, `Arc::strong_count` vaut de nouveau 1. Pourquoi ?",
      options: [
        "Le clone de chaque thread a été drop quand sa closure s'est terminée, ce qui a décrémenté le compteur",
        "`join` remet le compteur à 1",
        "Le compteur n'a jamais dépassé 1 ; les clones partagent un seul slot de compteur",
      ],
      answer: 0,
      explain:
        "C'est `Drop` qui fait son boulot à travers les frontières de thread : chaque clone déplacé meurt avec la closure qui en était propriétaire.",
    },
    {
      kind: "editor",
      intro: `### Partage une table avec quatre workers

1. Construis un \`Arc<Vec<u64>>\` contenant \`(1..=1000).collect()\`, affiche \`Arc::strong_count\`.
2. Spawne quatre threads. Chacun prend son propre \`Arc::clone\` et somme une slice de 250 éléments : \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Fais les join, en additionnant les sommes partielles, et affiche le total.
4. Affiche de nouveau le strong count — il est revenu à 1.

Sortie attendue :

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\``,
    },
  ],

  "rust-concurrency-4": [
    {
      kind: "theory",
      body: `\`Mutex<T>\` **possède** ses données. Il n'y a aucun moyen d'atteindre la valeur sans verrouiller, donc « j'ai oublié de prendre le lock » n'est pas un bug que tu peux écrire.

\`\`\`rust
let mut guard = counter.lock().unwrap();
*guard += 1;
\`\`\`

\`lock()\` renvoie \`Result<MutexGuard<T>, PoisonError<_>>\`. Le guard se déréférence en \`&mut T\`, et **libère le lock quand il est drop**. Il n'y a pas de \`unlock()\`.`,
    },
    {
      kind: "theory",
      body: `Le \`Result\`, c'est le **poisoning**. Si un thread panic en tenant le lock, le mutex est marqué empoisonné et chaque \`lock()\` ultérieur renvoie \`Err\` — les données ont pu rester à moitié mises à jour, et le compilateur t'oblige à le reconnaître. \`PoisonError::into_inner()\` te donne quand même les données si tu décides que c'est sûr.

La règle qui compte en production : **garde la section critique courte, et ne tiens jamais un guard à travers un appel lent.**

\`\`\`rust
let value = { cache.lock().unwrap().get(&key).cloned() };   // libéré ici
expensive_io(value);                                        // aucun lock tenu
\`\`\`

Le piège, c'est que \`Drop\` s'exécute à la fin du **scope**, pas au dernier usage. Un guard que tu as arrêté de lire tient toujours le lock — donc délimite-le exprès avec un bloc, ou sors la valeur et drop le guard.`,
    },
    {
      kind: "quiz",
      question: "Que veut dire un `Mutex` empoisonné ?",
      options: [
        "Un thread a panic en tenant le lock, donc les données peuvent être à moitié mises à jour et chaque `lock()` ultérieur renvoie `Err`",
        "Deux threads ont fait un deadlock et le runtime a cassé le cycle",
        "Le lock a été tenu plus longtemps qu'un timeout intégré",
      ],
      answer: 0,
      explain:
        "C'est un signal de correction, pas de liveness. `into_inner()` te laisse quand même prendre les données une fois que tu as décidé que l'invariant a survécu.",
    },
    {
      kind: "fill",
      prompt: "Libère le lock dès que la valeur est sortie.",
      file: "main.rs",
      before: "let value = { cache.lock().unwrap().get(&key).",
      after: "() };",
      choices: ["cloned", "as_ref", "unwrap"],
      answer: 0,
      explain:
        "`cloned()` copie la valeur vers l'extérieur pour que le guard puisse mourir à l'accolade fermante. Renvoyer une référence garderait le guard vivant pour satisfaire le borrow.",
    },
    {
      kind: "quiz",
      question:
        "Un handler verrouille un cache, puis fait un appel HTTP, puis écrit le résultat — le tout dans un seul scope. Quel est le symptôme sous charge ?",
      options: [
        "Le débit s'effondre à une requête à la fois : tous les autres threads attendent derrière l'appel réseau",
        "Le mutex s'empoisonne parce que l'appel prend trop de temps",
        "Rien — le guard est libéré à son dernier usage, avant l'appel",
      ],
      answer: 0,
      explain:
        "La dernière option est exactement l'idée fausse qui met ce bug en production. NLL termine les *borrows* au dernier usage ; `Drop` s'exécute à la fin du *scope*, et le lock est tenu pendant les deux appels.",
    },
    {
      kind: "editor",
      intro: `### Huit threads, un compteur

1. Construis un \`Arc<Mutex<u64>>\` qui démarre à \`0\`.
2. Spawne huit threads. Chacun prend son propre \`Arc::clone\` et, mille fois, verrouille et incrémente — le guard délimité à une seule itération.
3. Fais les join sur les huit, puis affiche le compte final et si le mutex \`is_poisoned()\`.

Sortie attendue :

\`\`\`text
count: 8000
poisoned: false
\`\`\`

Huit mille incréments sans aucune mise à jour perdue — c'est le mutex, pas la chance.`,
    },
  ],

  "rust-concurrency-5": [
    {
      kind: "theory",
      body: `\`RwLock<T>\` coupe le lock en deux :

- \`read()\` — **plusieurs** lecteurs à la fois
- \`write()\` — **un** écrivain, qui exclut tous les lecteurs

\`\`\`rust
let len = cache.read().unwrap().len();     // concurrent avec les autres lecteurs
cache.write().unwrap().push(40);           // exclusif
\`\`\`

Pour le reste, l'API est identique à \`Mutex\` : guards, poisoning, libération au drop.`,
    },
    {
      kind: "theory",
      body: `\`RwLock\` n'est pas un upgrade gratuit, et le prendre par défaut est une erreur courante.

**Il est plus lent que \`Mutex\` par opération.** Il suit un compteur de lecteurs en plus du flag d'écriture, donc un \`read()\` sans contention coûte plus qu'un \`lock()\` sans contention.

**Il ne gagne que quand les lectures dominent vraiment et sont assez lentes pour se chevaucher.** Une lecture qui copie un entier se termine avant qu'un second thread n'arrive ; tu as payé pour une concurrence que tu n'as jamais utilisée. Une lecture qui parcourt une grosse structure pendant que huit threads font pareil, c'est là que ça paie.

**La starvation des écrivains est un risque réel.** Avec une implémentation qui préfère les lecteurs et un flux continu de lecteurs, un écrivain peut attendre indéfiniment. Le \`RwLock\` de std préfère les écrivains sur les plateformes majeures, donc un écrivain en attente bloque les nouveaux lecteurs au lieu de faire la queue derrière eux pour toujours — mais la politique est un détail d'implémentation, pas une garantie documentée, donc ne construis pas dessus.

\`Mutex\` par défaut. Passe à \`RwLock\` quand un profil montre de la contention en lecture, pas quand la charge a juste *l'air* d'être dominée par les lectures.`,
    },
    {
      kind: "quiz",
      question:
        "Une charge est décrite comme « surtout des lectures », donc `Mutex` est remplacé par `RwLock` et rien ne devient plus rapide. Pourquoi ?",
      options: [
        "Les lectures sont trop courtes pour se chevaucher — chacune se termine avant que le thread suivant n'arrive, donc seul le surcoût par opération est payé",
        "`RwLock` sérialise les lectures à moins qu'elles ne soient explicitement groupées en batch",
        "Les lectures doivent être marquées `#[inline]` pour s'exécuter en concurrence",
      ],
      answer: 0,
      explain:
        "La concurrence n'aide que quand les opérations se chevauchent réellement dans le temps. Pour une lecture qui se termine en nanosecondes, la comptabilité supplémentaire est la seule chose que tu as achetée.",
    },
    {
      kind: "fill",
      prompt: "Prends un lock partagé pour que plusieurs lecteurs avancent en même temps.",
      file: "main.rs",
      before: "cache.",
      after: "().unwrap().len()",
      choices: ["read", "write", "lock"],
      answer: 0,
      explain:
        "`write()` exclurait les autres lecteurs et les sérialiserait — exactement ce que `RwLock` existe pour éviter.",
    },
    {
      kind: "quiz",
      question: "Qu'est-ce que la starvation des écrivains, et qui décide si elle se produit ?",
      options: [
        "Un écrivain qui attend indéfiniment derrière un flux continu de lecteurs — et la politique d'équité vient de la primitive de l'OS, pas de std",
        "Un écrivain empoisonné par le panic d'un lecteur ; std choisit la politique",
        "Un écrivain qui perd ses données quand des lecteurs tiennent le lock ; le compilateur l'empêche",
      ],
      answer: 0,
      explain:
        "Comme std délègue à la plateforme, le même code peut se comporter différemment sous Linux et sous macOS. C'est une bonne raison de ne pas dépendre de la politique du tout.",
    },
    {
      kind: "editor",
      intro: `### Plusieurs lecteurs, un écrivain

1. Construis un \`Arc<RwLock<Vec<u64>>>\` contenant \`vec![10, 20, 30]\`.
2. Spawne quatre threads lecteurs, chacun prenant \`read()\` et renvoyant \`.len()\`.
3. Fais les join, en sommant les longueurs renvoyées, et affiche le total.
4. Prends \`write()\` et push \`40\`, puis affiche le vecteur à travers un nouveau \`read()\`.

Sortie attendue :

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\``,
    },
  ],

  "rust-concurrency-6": [
    {
      kind: "theory",
      body: `Un deadlock a besoin de deux threads et de deux locks acquis dans des **ordres opposés** :

\`\`\`text
thread 1: lock A ─── veut B
thread 2: lock B ─── veut A
\`\`\`

Aucun ne peut avancer et aucun n'expirera. Rust empêche les data races à la compilation ; il n'empêche **pas** les deadlocks, parce qu'un deadlock n'est pas unsound — c'est un bug de liveness, et le système de types n'a rien à en dire.

Une fonction de transfert est la façon canonique d'en écrire un par accident : \`transfer(a, b)\` et \`transfer(b, a)\` qui tournent en même temps acquièrent dans des ordres opposés.`,
    },
    {
      kind: "theory",
      body: `Le correctif est un **ordre global des locks** : choisis un ordre total sur tes locks et acquiers toujours dans cet ordre, quelle que soit la direction propre de l'opération.

\`\`\`rust
let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };
let g1 = first.balance.lock().unwrap();
let g2 = second.balance.lock().unwrap();
\`\`\`

Maintenant chaque thread acquiert l'id le plus bas en premier, donc le cycle ne peut pas se former. N'importe quelle clé stable convient — un id, un index, même l'adresse du pointeur.

Deux tactiques d'appoint. **Tiens un seul lock à la fois** là où l'algorithme le permet, puisqu'un lock seul ne peut pas faire de deadlock contre lui-même. Et **\`try_lock\` avec un back-off** transforme un deadlock potentiel en retry — utile comme filet de sécurité, mais mauvais substitut à un ordre, puisqu'il peut livelock à la place.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi le système de types de Rust empêche-t-il les data races mais pas les deadlocks ?",
      options: [
        "Un deadlock est un bug de liveness, pas de l'unsoundness — rien n'est corrompu, le programme s'arrête simplement",
        "Les deadlocks sont empêchés, mais seulement dans les builds release",
        "Le borrow checker les empêcherait si `Mutex` était utilisé sans `Arc`",
      ],
      answer: 0,
      explain:
        "`Send`/`Sync` et les règles de borrow rendent impossible d'*observer des données déchirées*. Attendre pour toujours est parfaitement memory-safe, et aucune analyse statique du langage n'essaie de l'attraper.",
    },
    {
      kind: "fill",
      prompt:
        "Impose un ordre global pour que deux transferts opposés ne puissent pas former un cycle.",
      file: "main.rs",
      before: "let (first, second) = if from.id ",
      after: " to.id { (from, to) } else { (to, from) };",
      choices: ["<", "==", "!="],
      answer: 0,
      explain:
        "N'importe quel ordre total convient ; ce qui compte, c'est que chaque thread applique le *même*. Comparer par égalité ou inégalité ne donne aucun ordre.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `try_lock` avec retry est-il une réponse plus faible qu'un ordre global des locks ?",
      options: [
        "Il peut livelock — les threads prennent et relâchent en boucle sans progresser — alors qu'un ordre rend le cycle impossible",
        "`try_lock` est unsafe et exige un bloc `unsafe`",
        "`try_lock` empoisonne le mutex en cas d'échec",
      ],
      answer: 0,
      explain:
        "Le retry est un filet de sécurité raisonnable, surtout avec un back-off randomisé. Comme stratégie principale, il convertit un blocage que tu peux déboguer en un spin que tu ne peux pas.",
    },
    {
      kind: "editor",
      intro: `### Ordonne les locks

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — ordonne les deux comptes par \`id\`, verrouille le plus bas en premier, puis applique le débit et le crédit des bons côtés.
3. Construis les comptes \`1\` (solde \`100\`) et \`2\` (solde \`50\`) dans des \`Arc\`.
4. Spawne 100 threads : 50 qui transfèrent \`1\` de a vers b, 50 qui transfèrent \`1\` de b vers a. Fais les join sur tous.
5. Affiche chaque solde et le total.

Sortie attendue :

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Sans l'ordre, ce programme deadlock. Avec, le net est zéro et le total est conservé.`,
    },
  ],

  "rust-concurrency-7": [
    {
      kind: "theory",
      body: `Un atomic est une valeur unique que le hardware peut lire-modifier-écrire sans lock. Pour un compteur, c'est radicalement moins cher que \`Mutex<u64>\` :

\`\`\`rust
hits.fetch_add(1, Ordering::Relaxed);
\`\`\`

\`compare_exchange\` est la primitive à partir de laquelle tout le reste est construit — écris la valeur **seulement si** elle vaut actuellement ce que tu attendais :

\`\`\`rust
claimed.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
// Ok(false)  — on a gagné, c'était false et c'est maintenant true
// Err(true)  — quelqu'un d'autre a gagné ; la valeur est ce qu'on a trouvé
\`\`\`

C'est comme ça que tu élis exactement un gagnant parmi N threads sans aucun lock.`,
    },
    {
      kind: "theory",
      body: `L'argument \`Ordering\` n'est pas un bouton de performance — il contraint la façon dont les opérations mémoire environnantes peuvent être réordonnées par le compilateur et par le CPU.

- **\`Relaxed\`** — atomique sur cette valeur seulement. Aucune garantie d'ordre sur quoi que ce soit d'autre. Correct pour un compteur de statistiques que personne ne lit pour prendre une décision.
- **\`Release\`** sur un store — tout ce qui a été écrit avant est visible pour un thread qui fait ensuite un load \`Acquire\` de cette valeur.
- **\`Acquire\`** sur un load — tout ce que le thread qui a fait le release a écrit avant son store est maintenant visible pour toi.
- **\`AcqRel\`** — les deux, pour un read-modify-write.
- **\`SeqCst\`** — en plus, un ordre total unique sur lequel tous les threads sont d'accord. Le plus sûr et le plus lent.

La règle honnête : **\`Relaxed\` pour les compteurs, \`Acquire\`/\`Release\` pour publier des données, \`SeqCst\` quand tu n'es pas sûr.** Prendre \`Relaxed\` pour rendre un flag « plus rapide », c'est comme ça que tu livres un bug qui n'apparaît que sur ARM, que sous charge, une fois par semaine.`,
    },
    {
      kind: "quiz",
      question:
        "Un worker écrit un buffer puis met un flag `ready` ; un lecteur spin sur le flag puis lit le buffer. Les deux utilisent `Relaxed`. Qu'est-ce qui peut mal tourner ?",
      options: [
        "Le lecteur peut voir `ready == true` avant que les écritures du buffer ne soient visibles, et lire n'importe quoi",
        "Rien — `Relaxed` garantit quand même que l'écriture arrive en premier dans l'ordre du programme",
        "Le flag peut être déchiré, et montrer une valeur qui n'est ni true ni false",
      ],
      answer: 0,
      explain:
        "C'est le pattern de publication, et il a besoin de `Release` sur le store et de `Acquire` sur le load. `Relaxed` rend chaque *opération* atomique et n'ordonne rien autour.",
    },
    {
      kind: "fill",
      prompt: "Incrémente un compteur de statistiques avec l'ordering correct le moins cher.",
      file: "main.rs",
      before: "hits.fetch_add(1, Ordering::",
      after: ");",
      choices: ["Relaxed", "SeqCst", "Acquire"],
      answer: 0,
      explain:
        "Rien d'autre ne dépend de l'ordre de ce compteur, donc `Relaxed` est à la fois correct et le moins cher. `Acquire` est légal sur un read-modify-write comme `fetch_add`, mais il n'ordonne rien ici et coûte plus — et `SeqCst` coûte encore plus.",
    },
    {
      kind: "quiz",
      question: "Quelle est la description honnête de `SeqCst` ?",
      options: [
        "Le plus fort et le plus lent — un ordre total unique sur lequel chaque thread est d'accord ; le bon défaut quand tu n'es pas sûr",
        "Le plus rapide, puisque le CPU optimise le mieux un ordre total",
        "Identique à `AcqRel` sous un autre nom",
      ],
      answer: 0,
      explain:
        "Commencer à `SeqCst` et affaiblir avec un benchmark en main est une façon saine de travailler. Commencer à `Relaxed` et croiser les doigts, non.",
    },
    {
      kind: "editor",
      intro: `### Compte sans lock, élis un gagnant

1. Construis un \`Arc<AtomicU64>\` à \`0\`. Spawne huit threads, chacun faisant \`fetch_add(1, Ordering::Relaxed)\` mille fois. Fais les join et affiche la valeur avec un load \`Acquire\`.
2. Crée un \`AtomicBool\` à \`false\`. Appelle \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **deux fois** et affiche chaque résultat avec \`{:?}\`.

Sortie attendue :

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — on a gagné, et la valeur remplacée était \`false\`. \`Err(true)\` — on a perdu, et voilà ce qu'on a réellement trouvé.`,
    },
  ],

  "rust-concurrency-8": [
    {
      kind: "theory",
      body: `Un channel déplace l'**ownership** entre threads. \`mpsc\`, c'est multi-producteur, consommateur unique : clone le sender autant de fois que nécessaire, garde un seul receiver.

\`\`\`rust
let (tx, rx) = mpsc::channel::<u64>();
for id in 0..3 {
    let tx = tx.clone();
    thread::spawn(move || { tx.send(id).unwrap(); });
}
drop(tx);                       // drop l'original, sinon rx ne termine jamais
for value in rx { ... }
\`\`\`

Ce \`drop(tx)\` est le détail que les gens ratent. L'itérateur du receiver se termine quand **chaque** sender a disparu — et le \`tx\` original dans \`main\` en fait partie.`,
    },
    {
      kind: "theory",
      body: `\`channel()\` est **non borné**. Un producteur n'attend jamais, ce qui a l'air bien et est la façon classique de construire une fuite mémoire : si les consommateurs sont plus lents que les producteurs, la file grossit jusqu'à ce que le processus soit tué.

\`sync_channel(n)\` est **borné**. Une fois \`n\` messages en buffer, \`send\` bloque :

\`\`\`rust
let (tx, rx) = mpsc::sync_channel::<u64>(1);
tx.send(1).unwrap();
tx.try_send(2).is_err();     // true — plein
\`\`\`

Ce blocage *est* la **backpressure** : la profondeur de la file devient un signal qui remonte jusqu'à celui qui produit, donc un système surchargé ralentit son entrée au lieu de bufferiser jusqu'à un kill par manque de mémoire.

Pour un service, préfère le borné. Une file non bornée ne supprime pas la limite, elle la déplace juste à un endroit où tu la découvres par une alerte plutôt que par une métrique.`,
    },
    {
      kind: "quiz",
      question:
        "Une boucle `for value in rx` ne se termine jamais alors que chaque worker a fini. Pourquoi ?",
      options: [
        "Le sender original dans `main` n'a jamais été drop, donc le channel a encore un sender vivant",
        "Le receiver doit être fermé explicitement avec `rx.close()`",
        "Les workers doivent appeler `tx.flush()` avant de sortir",
      ],
      answer: 0,
      explain:
        "L'itérateur se termine quand le nombre de senders atteint zéro. Cloner pour chaque worker et oublier l'original laisse exactement un sender vivant — dans le thread qui attend.",
    },
    {
      kind: "fill",
      prompt: "Crée un channel borné pour que les producteurs sentent la backpressure.",
      file: "main.rs",
      before: "let (btx, brx) = mpsc::",
      after: "::<u64>(1);",
      choices: ["sync_channel", "channel", "bounded"],
      answer: 0,
      explain:
        "`channel()` est non borné et ne prend pas d'argument de capacité. `bounded`, c'est le nom que Crossbeam lui donne — std l'appelle `sync_channel`.",
    },
    {
      kind: "quiz",
      question:
        "Qu'est-ce qui tourne vraiment mal avec une file non bornée devant un consommateur lent ?",
      options: [
        "La mémoire grossit sans limite jusqu'à ce que le processus soit tué par l'OOM — la limite existe toujours, c'est juste celle de la machine",
        "Les messages sont jetés en silence une fois une limite interne atteinte",
        "Les senders commencent à bloquer, ce qui est la backpressure voulue",
      ],
      answer: 0,
      explain:
        "Non borné ne veut pas dire « sans limite », ça veut dire « la limite, c'est la RAM, et tu l'apprends en te faisant réveiller par une alerte ». Une file bornée fait de la limite la tienne, et la rend visible sous forme de latence.",
    },
    {
      kind: "editor",
      intro: `### Fan in, puis sens la backpressure

1. \`mpsc::channel::<u64>()\`. Spawne trois producteurs ; le producteur \`id\` envoie \`id * 10 + n\` pour \`n\` dans \`0..3\`. **Drop le sender original**, puis collecte le receiver dans un \`Vec<u64>\`, trie-le, affiche-le ainsi que sa longueur.
2. \`mpsc::sync_channel::<u64>(1)\`. Envoie une valeur, affiche si un second \`try_send\` **échoue**, puis \`recv()\` et affiche ce qui est sorti.

Sortie attendue :

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Le tri est ce qui rend le fan-in déterministe — l'ordre d'arrivée ne l'est pas.`,
    },
  ],
};
