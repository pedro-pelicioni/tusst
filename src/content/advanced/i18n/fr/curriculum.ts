import type { AdvancedTrackText } from "../types";

// FR · Advanced Path curriculum metadata — track and lesson names as shown on
// /advanced and /advanced/[slug].
//
// CLIENT-SAFE. Keyed by the same slugs as the English source in
// ../../curriculum.ts, and PARTIAL: a missing key falls back to English.
//
// Rust terms are not translated — ownership, borrow, trait, lifetime,
// closure. Translating them pulls the reader away from the real compiler
// error, which is where they will meet the word again.

export const frAdvancedTrackText: Record<string, AdvancedTrackText> = {
  "rust-ownership-deep": {
    title: "Ownership, moves et drops",
    description:
      "Le modèle que le borrow checker impose réellement. Où vit une valeur, quand elle est déplacée, quand elle est copiée à la place, et le point exact où elle est détruite.",
    serves: "programmation système en Rust/C++",
  },
  "rust-lifetimes": {
    title: "Lifetimes",
    description:
      "Les annotations cessent d'être du bruit dès que tu les lis comme une contrainte entre entrées et sorties. Élision, structs qui gardent des références, 'static, et ce qu'un bound promet vraiment.",
    serves: "programmation système en Rust/C++",
  },
  "rust-traits-generics": {
    title: "Traits, generics et dispatch",
    description:
      "Comment Rust réutilise du code sans héritage. Bounds, associated types, blanket impls, et la vraie différence de coût entre un generic et un dyn Trait.",
    serves: "programmation système en Rust/C++",
  },
  "rust-error-handling": {
    title: "Des erreurs qui survivent à la production",
    description:
      "Result de bout en bout : propagation, conversion, types d'erreur maison qui portent la cause, et une politique explicite sur quand un panic est correct et quand c'est un incident.",
    serves: "ownership d'infrastructure de production",
  },
  "rust-collections-iterators": {
    title: "Collections, itérateurs et closures",
    description:
      "Choisir le container sur la complexité plutôt que par habitude, puis exprimer la transformation de façon lazy. Inclut la distinction Fn/FnMut/FnOnce, qui décide ce qu'une closure peut capturer.",
    serves: "programmation système en Rust/C++",
  },
  "rust-smart-pointers": {
    title: "Smart pointers et mutabilité intérieure",
    description:
      "Box, Rc, RefCell, Cow et Weak — ce que chacun t'achète, ce qu'il coûte, et la distinction entre borrow à la compilation et borrow au runtime qui décide lequel il te faut vraiment.",
    serves: "programmation système en Rust/C++",
  },
  "rust-concurrency": {
    title: "Threads, Send/Sync et état partagé",
    description:
      "Le cœur de tout service RPC sous charge réelle. Les threads, les deux auto traits qui rendent le partage sûr, Arc<Mutex<T>> et ses alternatives, les atomics avec un memory ordering honnête, et les channels.",
    serves: "services RPC/API à grande échelle",
  },
  "rust-async-internals": {
    title: "Async depuis les premiers principes",
    description:
      "Construit de bas en haut à partir de la poll loop, pas de haut en bas à partir d'une macro attribut. Tu écris une Future à la main, tu montes un block_on fonctionnel avec un vrai Waker, et seulement ensuite tu regardes ce que Tokio ajoute par-dessus.",
    serves: "services RPC/API à grande échelle",
  },
  "rust-systems-edges": {
    title: "Macros, unsafe, FFI et argent",
    description:
      "Les quatre bords qu'on attend d'un reviewer de code système : ce en quoi un derive s'expanse, ce qu'un bloc unsafe promet, ce que coûte le passage vers C++, et pourquoi un float ne doit jamais tenir un solde.",
    serves: "programmation système en Rust/C++",
  },
  "backend-rpc-services": {
    title: "Services RPC à l'échelle",
    description:
      "Le service en façade du réseau : JSON-RPC 2.0 fait exactement, Serde à la frontière, des couches Tower pour le timeout et le rate limiting, et les questions d'architecture qu'un entretien pose vraiment.",
    serves: "services RPC/API à grande échelle",
  },
  "backend-data-layer": {
    title: "La couche de données",
    description:
      "L'architecture de base de données telle que le poste la décrit : indexation et patterns de requête d'abord, puis le côté Rust — pools, transactions et prepared statements.",
    serves: "architecture, indexation et patterns de requête de base de données",
  },
  "backend-indexers-distsys": {
    title: "Indexers et systèmes distribués",
    description:
      "Le chemin qu'une transaction parcourt du client au consensus et retour, et l'indexer qui la rend interrogeable. Cursors, replay, idempotence et les modes de défaillance qui n'apparaissent qu'à l'échelle.",
    serves: "infrastructure blockchain en production",
  },
  "backend-production": {
    title: "Faire tourner ça en production",
    description:
      "Ce qui sépare un prototype d'une infrastructure pour laquelle quelqu'un se fait réveiller la nuit : observabilité, percentiles honnêtes, tests de charge, graceful shutdown et une posture de fiabilité que tu peux défendre.",
    serves: "ownership d'infrastructure de production",
  },
};

export const frAdvancedLessonText: Record<
  string,
  { title: string; summary: string }
> = {
  // ownership
  "rust-ownership-deep-1": {
    title: "Stack, heap et qui possède quoi",
    summary:
      "Lis le vrai layout mémoire d'une valeur et dis quelle partie vit où.",
  },
  "rust-ownership-deep-2": {
    title: "Move vs copy",
    summary:
      "Prédis si une affectation move ou copie — et prouve que ça compile.",
  },
  "rust-ownership-deep-3": {
    title: "Moves partiels",
    summary:
      "Move un champ hors d'une struct et continue d'utiliser le reste, légalement.",
  },
  "rust-ownership-deep-4": {
    title: "Les règles de borrow en pratique",
    summary:
      "Corrige des erreurs d'aliasing en resserrant le scope au lieu de dégainer clone().",
  },
  "rust-ownership-deep-5": {
    title: "Reborrowing et deref coercion",
    summary:
      "Explique pourquoi un &mut T passe dans un paramètre &T, et pourquoi une String passe comme &str.",
  },
  "rust-ownership-deep-6": {
    title: "Ordre de drop et RAII",
    summary:
      "Prédis l'ordre de destruction, et libère une ressource sans appeler close().",
  },
  // lifetimes
  "rust-lifetimes-1": {
    title: "Ce qu'un lifetime dit vraiment",
    summary:
      "Lis 'a comme une relation entre arguments, pas comme une durée.",
  },
  "rust-lifetimes-2": {
    title: "Règles d'élision",
    summary:
      "Sache quelles signatures se passent d'annotation, et pourquoi la tienne en a besoin.",
  },
  "rust-lifetimes-3": {
    title: "Lifetimes multiples",
    summary:
      "Annote une fonction dont la sortie borrow depuis une seule des deux entrées.",
  },
  "rust-lifetimes-4": {
    title: "Structs qui gardent des références",
    summary:
      "Construis une vue de parser zero-copy sur un buffer qui ne t'appartient pas.",
  },
  "rust-lifetimes-5": {
    title: "'static : deux sens différents",
    summary:
      "Distingue un &'static str d'un bound T: 'static — ce n'est pas la même affirmation.",
  },
  // traits & generics
  "rust-traits-generics-1": {
    title: "Définir et implémenter une trait",
    summary: "Écris une trait avec une méthode par défaut et surcharge-la.",
  },
  "rust-traits-generics-2": {
    title: "Trait bounds et clauses where",
    summary:
      "Contrains un generic juste assez pour que le corps compile, sans le sur-contraindre.",
  },
  "rust-traits-generics-3": {
    title: "Associated types vs paramètres génériques",
    summary:
      "Choisis correctement entre les deux, et dis pourquoi Iterator utilise l'un et pas l'autre.",
  },
  "rust-traits-generics-4": {
    title: "Dispatch statique et monomorphization",
    summary:
      "Explique ce que le compilateur émet pour une fonction générique, et ce que ça coûte.",
  },
  "rust-traits-generics-5": {
    title: "Trait objects et la vtable",
    summary:
      "Stocke des types hétérogènes derrière Box<dyn Trait> et nomme le coût au runtime.",
  },
  "rust-traits-generics-6": {
    title: "Object safety",
    summary:
      "Prédis quelles traits peuvent devenir des trait objects avant que le compilateur te le dise.",
  },
  "rust-traits-generics-7": {
    title: "Blanket impls et l'orphan rule",
    summary:
      "Implémente une trait pour tout type qui satisfait un bound — et sache quand tu n'as pas le droit.",
  },
  // errors
  "rust-error-handling-1": {
    title: "Result et l'opérateur ?",
    summary: "Propage l'échec sans un seul match.",
  },
  "rust-error-handling-2": {
    title: "Types d'erreur maison",
    summary: "Modélise tes échecs comme un enum plutôt qu'une String.",
  },
  "rust-error-handling-3": {
    title: "From, Into et conversion automatique",
    summary: "Fais convertir par ? une erreur étrangère en la tienne, gratuitement.",
  },
  "rust-error-handling-4": {
    title: "Display, Debug et std::error::Error",
    summary:
      "Écris les deux messages qu'une erreur te doit : celui de l'opérateur et celui du log.",
  },
  "rust-error-handling-5": {
    title: "Chaînage d'erreurs et source()",
    summary:
      "Garde la cause attachée pour qu'une ligne de log suffise à clore une investigation.",
  },
  "rust-error-handling-6": {
    title: "Quand panic! est la bonne décision",
    summary:
      "Trace la ligne entre un bug et une condition — et arrête de faire unwrap à travers.",
  },
  // collections
  "rust-collections-iterators-1": {
    title: "Vec, VecDeque et croissance",
    summary:
      "Choisis entre les deux selon le bout où tu fais push/pop, et arrête de réallouer dans une boucle chaude.",
  },
  "rust-collections-iterators-2": {
    title: "HashMap vs BTreeMap",
    summary:
      "Choisis sur l'ordre et la complexité, pas sur celui que tu as tapé la dernière fois.",
  },
  "rust-collections-iterators-3": {
    title: "iter, iter_mut et into_iter",
    summary:
      "Dis ce que chacun te remet, et ce qu'il fait à la collection.",
  },
  "rust-collections-iterators-4": {
    title: "Adapters et laziness",
    summary:
      "Enchaîne map/filter/filter_map et explique pourquoi rien n'a tourné avant collect.",
  },
  "rust-collections-iterators-5": {
    title: "fold, reduce et agrégation sur mesure",
    summary:
      "Remplace une boucle à accumulateur mutable par une seule expression.",
  },
  "rust-collections-iterators-6": {
    title: "Fn, FnMut et FnOnce",
    summary:
      "Prédis quelle trait une closure implémente à partir de ce qu'elle capture.",
  },
  "rust-collections-iterators-7": {
    title: "Closures move et captures qui s'échappent",
    summary:
      "Confie une closure à quelque chose qui survit à son scope, correctement.",
  },
  // smart pointers
  "rust-smart-pointers-1": {
    title: "Box<T> et types récursifs",
    summary: "Donne à un enum récursif une taille connue.",
  },
  "rust-smart-pointers-2": {
    title: "Rc<T> et ownership partagé",
    summary:
      "Partage une allocation entre plusieurs propriétaires sur un seul thread.",
  },
  "rust-smart-pointers-3": {
    title: "RefCell<T> et borrow au runtime",
    summary:
      "Déplace la vérification de borrow de la compilation au runtime — et accepte le panic que ça t'achète.",
  },
  "rust-smart-pointers-4": {
    title: "Weak<T> et cycles de références",
    summary: "Construis un graphe parent/enfant qui est vraiment libéré.",
  },
  "rust-smart-pointers-5": {
    title: "Cow<T> et n'allouer que quand il le faut",
    summary:
      "Renvoie une donnée empruntée sur le chemin courant, possédée sur le chemin rare.",
  },
  "rust-smart-pointers-6": {
    title: "Deref, DerefMut et pointeurs maison",
    summary:
      "Fais en sorte que ton wrapper se comporte comme ce qu'il enveloppe.",
  },
  // concurrency
  "rust-concurrency-1": {
    title: "Spawner et joindre des threads",
    summary:
      "Fais tourner du travail en parallèle et collecte chaque résultat de façon déterministe.",
  },
  "rust-concurrency-2": {
    title: "Send et Sync",
    summary:
      "Dis pourquoi Rc n'est pas Send et Arc l'est, à partir de la définition et pas de mémoire.",
  },
  "rust-concurrency-3": {
    title: "Arc<T> : ownership partagé entre threads",
    summary:
      "Partage un état en lecture seule avec N workers au prix d'un seul atomic.",
  },
  "rust-concurrency-4": {
    title: "Mutex, guards et poisoning",
    summary:
      "Mute un état partagé en sécurité, et garde la section critique courte exprès.",
  },
  "rust-concurrency-5": {
    title: "RwLock et état à forte lecture",
    summary:
      "Choisis RwLock plutôt que Mutex sur des preuves, et nomme le risque de starvation que tu as pris.",
  },
  "rust-concurrency-6": {
    title: "Deadlocks et ordre des locks",
    summary:
      "Reproduis un deadlock, puis élimine-le avec un ordre global des locks.",
  },
  "rust-concurrency-7": {
    title: "Atomics et memory ordering",
    summary:
      "Utilise fetch_add et compare_exchange, et justifie Relaxed vs Acquire/Release.",
  },
  "rust-concurrency-8": {
    title: "Channels et backpressure",
    summary:
      "Câble un producteur/consommateur avec mpsc et explique ce qu'un channel borné t'achète.",
  },
  // async
  "rust-async-internals-1": {
    title: "Une Future est une fonction poll",
    summary:
      "Implémente Future à la main et constate qu'il n'y a aucune magie dedans.",
  },
  "rust-async-internals-2": {
    title: "Rien ne tourne sans executor",
    summary:
      "Prouve qu'une future jamais awaitée ne fait strictement rien, et dis pourquoi c'est une feature.",
  },
  "rust-async-internals-3": {
    title: "Construis block_on",
    summary:
      "Écris un vrai executor : Waker, RawWaker et une boucle park/unpark.",
  },
  "rust-async-internals-4": {
    title: "Ordonnancement coopératif et appels bloquants",
    summary:
      "Explique pourquoi un seul appel bloquant fige un thread entier du runtime.",
  },
  "rust-async-internals-5": {
    title: "Une annulation est un drop",
    summary:
      "Rends le nettoyage correct quand un client se déconnecte en pleine requête.",
  },
  "rust-async-internals-6": {
    title: "Timeouts et select",
    summary:
      "Fais courir une future contre une deadline, et dis quel côté a gagné et ce qui a fui.",
  },
  "rust-async-internals-7": {
    title: "Ce que Tokio ajoute",
    summary:
      "Fais correspondre chaque pièce que tu as construite à son équivalent Tokio : spawn, JoinHandle, select!, spawn_blocking.",
  },
  // systems edges
  "rust-systems-edges-1": {
    title: "Modules, visibilité et layout de crate",
    summary:
      "Utilise mod, pub et pub(crate) pour rendre un invariant incassable de l'extérieur.",
  },
  "rust-systems-edges-2": {
    title: "macro_rules! et macros déclaratives",
    summary: "Écris une macro qu'une fonction n'aurait pas pu remplacer.",
  },
  "rust-systems-edges-3": {
    title: "Derive et macros procédurales",
    summary:
      "Dis ce que #[derive(Debug, Clone)] génère vraiment, et où Serde s'insère.",
  },
  "rust-systems-edges-4": {
    title: "unsafe : le contrat",
    summary:
      "Énonce l'invariant qu'un bloc unsafe suppose — la compétence pour laquelle un reviewer est payé.",
  },
  "rust-systems-edges-5": {
    title: "Pointeurs bruts et aliasing",
    summary:
      "Manipule *const/*mut T et nomme la garantie que tu viens d'abandonner.",
  },
  "rust-systems-edges-6": {
    title: 'FFI, extern "C" et la frontière ABI',
    summary:
      "Fais passer l'ownership à travers une frontière C sans fuite ni double libération.",
  },
  "rust-systems-edges-7": {
    title: "Argent en entiers et arithmétique checked",
    summary:
      "Gère un solde en entiers à virgule fixe, et choisis entre checked, saturating et wrapping en connaissance de cause.",
  },
  // ── backend / infra ───────────────────────────────────────────────────
  "backend-rpc-services-1": {
    title: "L'enveloppe JSON-RPC 2.0 et ses cinq codes d'erreur",
    summary:
      "Classe n'importe quelle requête entrante dans le bon code d'erreur JSON-RPC, et connais les deux cas où l'id de la réponse doit être null plutôt que renvoyé en écho.",
  },
  "backend-rpc-services-2": {
    title: "Notifications, batches et les requêtes auxquelles tu ne dois pas répondre",
    summary:
      "Implémente les deux règles qui cassent les serveurs JSON-RPC naïfs : une notification ne reçoit aucune réponse, et un batch vide est lui-même une requête invalide.",
  },
  "backend-rpc-services-3": {
    title: "Une table de dispatch de handlers en box",
    summary:
      "Construis un routeur à partir d'une HashMap de closures en box, et sépare les trois échecs qu'un appel peut avoir : méthode inconnue, mauvais arguments, handler qui a explosé.",
  },
  "backend-rpc-services-4": {
    title: "Service et Layer : construire Tower à partir de deux traits",
    summary:
      "Écris les deux traits dont tout l'écosystème Tower est fait, puis enveloppe un backend dans un timeout et prouve que les requêtes expirées ne l'atteignent jamais.",
  },
  "backend-rpc-services-5": {
    title: "Limites de concurrence et load shedding",
    summary:
      "Simule la même surcharge sous deux politiques d'admission et lis ce que la file d'attente coûte vraiment : les mêmes succès, plus 320 ms de temps backend dépensés en réponses que personne ne peut utiliser.",
  },
  "backend-rpc-services-6": {
    title: "Un rate limiter token-bucket sur une horloge simulée",
    summary:
      "Implémente des token buckets par client avec refill paresseux, renvoie un retry_after exploitable par le client, et vois pourquoi la limite que tu configures n'est pas celle que ta flotte impose.",
  },
  "backend-rpc-services-7": {
    title: "Contrats de pagination : cursors, offsets et request IDs",
    summary:
      "Prouve que la pagination par OFFSET perd des lignes en silence quand la collection change en cours de parcours, et écris le contrat de cursor qui n'en perd pas.",
  },
  "backend-data-layer-1": {
    title: "Index scan vs seq scan : lignes examinées",
    summary:
      "Compte les lignes examinées pour les deux plans et dis lequel les chiffres favorisent.",
  },
  "backend-data-layer-2": {
    title: "Index composites et le leftmost prefix",
    summary:
      "Dis quels ensembles de prédicats un index composite peut servir, et lesquels il ne fait que filtrer.",
  },
  "backend-data-layer-3": {
    title: "Le cost model derrière EXPLAIN",
    summary:
      "Chiffre un index scan face à un seq scan et prédis le choix du planner.",
  },
  "backend-data-layer-4": {
    title: "Pagination par cursor vs OFFSET",
    summary:
      "Remplace OFFSET par un cursor keyset et quantifie ce que ça économise.",
  },
  "backend-data-layer-5": {
    title: "Niveaux d'isolation et les anomalies que chacun permet",
    summary:
      "Nomme quelle anomalie chaque niveau d'isolation permet, et prouve-le avec une trace.",
  },
  "backend-data-layer-6": {
    title: "Transactions, rollback et prepared statements",
    summary:
      "Implémente commit et rollback, et dis ce qu'un prepared statement réutilise vraiment.",
  },
  "backend-data-layer-7": {
    title: "Connection pools et où part la latence",
    summary:
      "Lis le temps d'attente en file dans une simulation de pool et dimensionne un pool pour une raison.",
  },
  "backend-indexers-distsys-1": {
    title: "Le pipeline de l'indexer et un cursor qui survit au restart",
    summary:
      "Construis le pipeline à quatre étages — source ledger, cursor, processeur, store — et redémarre-le en plein stream sans perdre ni répéter de travail.",
  },
  "backend-indexers-distsys-2": {
    title: "Commit le cursor après l'effet, jamais avant",
    summary:
      "Injecte un crash entre les deux écritures et mesure les deux ordres : cursor d'abord perd un événement en silence, effet d'abord en duplique un — et un seul des deux est récupérable.",
  },
  "backend-indexers-distsys-3": {
    title: "Idempotence sous livraison at-least-once",
    summary:
      "Traite un stream qui duplique et réordonne des événements, deux fois de suite, et atterris exactement sur l'état qu'un feed exactly-once parfait aurait produit.",
  },
  "backend-indexers-distsys-4": {
    title: "Survivre à un reorg : rollback jusqu'au fork, réapplique la branche",
    summary:
      "Détecte qu'un bloc entrant fork sous ta head, défais les blocs orphelins par hauteur décroissante, et réapplique la branche gagnante.",
  },
  "backend-indexers-distsys-5": {
    title: "Le statut de transaction comme machine à états qui rejette",
    summary:
      "Encode Received/Validating/Submitted/Pending/Confirmed/Failed comme une table de transitions dont le bras par défaut refuse les mouvements illégaux et laisse l'état intact.",
  },
  "backend-indexers-distsys-6": {
    title: "Arithmétique de quorum : R + W > N, et ce qu'une partition en fait",
    summary:
      "Calcule quelles configurations (N, R, W) garantissent qu'une lecture voit la dernière écriture, puis lance une partition 3|2 et regarde le côté minoritaire refuser lectures et écritures.",
  },
  "backend-indexers-distsys-7": {
    title: "Ordonner des événements sans horloge : Lamport et vector stamps",
    summary:
      "Estampille une trace d'événements distribués avec les deux types d'horloge et montre la paire où Lamport rapporte un ordre que la causalité ne soutient pas.",
  },
  "backend-production-1": {
    title: "Counters, gauges et histograms",
    summary:
      "Choisis le bon instrument pour une question, et vois ce que chacun ne peut pas répondre.",
  },
  "backend-production-2": {
    title: "Percentiles à partir de buckets, et pourquoi tu ne peux pas en faire la moyenne",
    summary:
      "Calcule p50/p95/p99 à partir des comptes de bucket, et fusionne deux instances sans mentir.",
  },
  "backend-production-3": {
    title: "Logs structurés et un correlation ID",
    summary:
      "Fais passer un seul ID à travers une chaîne d'appels et reconstruis une requête entière à partir d'un stream entrelacé.",
  },
  "backend-production-4": {
    title: "Backoff, jitter et un retry budget",
    summary:
      "Borne l'amplification des retries avec un budget au lieu d'espérer que la dépendance se rétablisse.",
  },
  "backend-production-5": {
    title: "Un circuit breaker comme machine à états",
    summary:
      "Arrête d'envoyer du trafic vers une dépendance morte, et sonde-la jusqu'à son retour sans provoquer de ruée.",
  },
  "backend-production-6": {
    title: "Graceful shutdown : drainer, deadline, fermeture forcée",
    summary:
      "Sors un pod de la rotation et termine son travail en vol sans qu'un deploy fasse tomber des requêtes.",
  },
  "backend-production-7": {
    title: "Loi de Little : une cible de latence est une limite de concurrence",
    summary:
      "Transforme un SLO de latence en nombre de requêtes concurrentes que tu as le droit d'admettre.",
  },
};
