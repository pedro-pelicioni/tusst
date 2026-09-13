import type { LessonStep } from "@/content/steps";

// FR · Async From First Principles.
//
// Overlay for ../../steps/rust-async-internals.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const rustAsyncInternalsStepsFr: Record<string, LessonStep[]> = {
  "rust-async-internals-1": [
    {
      kind: "theory",
      body: `Une \`Future\`, c'est une struct avec une seule méthode. Toute l'abstraction tient là :

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` est une question : *« t'as fini ? »* La réponse est \`Poll::Ready(valeur)\` ou \`Poll::Pending\`.

Pas de thread ici, pas de scheduler, pas de magie. Une future est une machine à états que quelqu'un d'autre doit appeler en boucle.`,
    },
    {
      kind: "theory",
      body: `Deux morceaux de la signature à nommer tout de suite, pour qu'ils arrêtent d'être du bruit.

**\`Pin<&mut Self>\`.** Un bloc \`async\` compile en une machine à états qui peut contenir des références *vers elle-même* — un borrow qui traverse un \`.await\` devient une struct auto-référentielle. Déplacer une telle valeur invaliderait ces pointeurs, donc \`Pin\` est la promesse qu'elle ne bougera pas. Pour une future écrite à la main sans auto-référence, \`Pin::new(&mut f)\` est gratuit et sans histoire.

**\`Context\`.** Pour l'instant il transporte exactement une chose : le \`Waker\`. Quand une future renvoie \`Pending\`, c'est à elle de s'arranger pour que le waker soit appelé dès qu'un progrès devient possible — c'est ça qui empêche l'executor de tourner dans le vide. La leçon trois en construit un.

La règle qui découle de la seule signature : **\`poll\` ne doit jamais bloquer.** Il doit renvoyer \`Pending\` vite et se faire re-poller plus tard, sinon toutes les autres futures qui partagent le thread s'arrêtent.`,
    },
    {
      kind: "quiz",
      question: "Qu'est-ce qu'une `Future`, mécaniquement ?",
      options: [
        "Une machine à états avec une méthode `poll` qui renvoie `Ready(v)` ou `Pending` — rien ne l'exécute tout seul",
        "Un handle vers un thread que le runtime a démarré à la création de la future",
        "Un callback enregistré dans l'event loop du système d'exploitation",
      ],
      answer: 0,
      explain:
        "Les futures de Rust sont *basées sur le poll*, contrairement aux promises de JavaScript, qui sont basées sur le push et démarrent immédiatement. Presque toutes les surprises de l'async Rust découlent de cette seule différence.",
    },
    {
      kind: "fill",
      prompt: "Signale que la future a terminé, en transportant sa valeur.",
      file: "main.rs",
      before: "fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {\n    Poll::",
      after: "(self.0)\n}",
      choices: ["Ready", "Pending", "Done"],
      answer: 0,
      explain:
        "`Poll` a exactement deux variantes : `Ready(T)` et `Pending`. `Pending` ne transporte rien — il n'y a pas encore de valeur.",
    },
    {
      kind: "quiz",
      question: "Pourquoi `poll` prend-il `Pin<&mut Self>` plutôt que `&mut self` ?",
      options: [
        "Un bloc `async` peut contenir des références vers son propre état, et le déplacer les invaliderait — `Pin` promet qu'il ne bougera pas",
        "`Pin` est un lock qui empêche deux threads de poller en même temps",
        "Il garde la future en vie jusqu'à ce que le runtime la drop",
      ],
      answer: 0,
      explain:
        "C'est la raison d'être de `Pin`. Pour une future écrite à la main sans auto-référence, `Pin::new(&mut f)` ne coûte rien — tu croises `Pin` à cause de ce que génère `async fn`.",
    },
    {
      kind: "editor",
      intro: `### Implémente Future à la main

1. \`struct Immediate(u32)\` qui implémente \`Future<Output = u32>\` et renvoie \`Poll::Ready(self.0)\` d'entrée.
2. \`struct Countdown { left: u32 }\` qui implémente \`Future<Output = u32>\` : tant que \`left > 0\`, décrémente et renvoie \`Pending\` ; à zéro, renvoie \`Ready(0)\`.
3. Dans \`main\`, construis un \`Context\` à partir de \`Waker::noop()\` et polle chaque future à la main — \`Immediate\` une fois, \`Countdown\` trois fois — en affichant chaque \`Poll\` avec \`{:?}\`.

Sortie attendue :

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

Il n'y a pas d'executor dans ce programme. L'executor, c'est toi.`,
    },
  ],

  "rust-async-internals-2": [
    {
      kind: "theory",
      body: `Appeler un \`async fn\` **n'exécute rien de son corps**. Ça construit une machine à états et te la tend, posée à l'état zéro :

\`\`\`rust
let fut = build();          // rien ne s'est passé
\`\`\`

Le corps ne tourne que quand quelque chose le polle. C'est l'inverse d'une promise JavaScript, qui commence à s'exécuter dès sa création.

C'est pour ça qu'une future jamais awaitée est un warning : \`Future\` est \`#[must_use]\`, et la dropper en silence veut dire que le travail que tu as demandé n'a jamais eu lieu.`,
    },
    {
      kind: "theory",
      body: `La paresse est une feature, et trois comportements bien réels en découlent.

**L'annulation est gratuite.** Drop la future et le travail n'a tout simplement jamais lieu. Un runtime n'a rien à interrompre — la leçon d'après la prochaine couvre ce que ça implique pour le nettoyage.

**La composition est gratuite.** \`select!\` peut construire cinq futures et les poller jusqu'à ce qu'une termine, puis dropper les autres. Si les créer les avait démarrées, ça ferait quatre opérations gâchées au lieu de zéro.

**Les timeouts enveloppent au lieu d'interrompre.** \`timeout(d, fut)\` n'est qu'une future de plus qui polle celle du dedans jusqu'à la deadline. Il n'y a aucun thread à tuer.

Le prix de la paresse, c'est le mode de panne : oublie le \`.await\` et rien ne tourne, aucune erreur n'apparaît, et le warning \`unused_must_use\` du compilateur est la seule chose entre toi et un après-midi très confus.`,
    },
    {
      kind: "quiz",
      question:
        "Tu écris `let fut = fetch_data();` et tu oublies le `.await`. Que se passe-t-il ?",
      options: [
        "Rien ne tourne du tout — la future est droppée sans poll, et seul le warning `must_use` le laisse deviner",
        "La requête tourne en arrière-plan et son résultat est jeté",
        "C'est une erreur de compilation, puisqu'une future doit être awaitée",
      ],
      answer: 0,
      explain:
        "« La requête tourne en arrière-plan », c'est ce que fait une promise JavaScript, et importer cette intuition en Rust est l'erreur async la plus courante qui soit.",
    },
    {
      kind: "fill",
      prompt:
        "Pin la machine à états d'un bloc async pour pouvoir la poller à la main.",
      file: "main.rs",
      before: "let mut fut = ",
      after: "(build());",
      choices: ["Box::pin", "Box::new", "Pin::new"],
      answer: 0,
      explain:
        "`Pin::new` exige que la valeur soit `Unpin`, ce qu'un bloc `async` n'est pas. `Box::pin` alloue et pin en une seule étape — exactement ce que `.await` fait pour toi sous le capot.",
    },
    {
      kind: "quiz",
      question: "Pourquoi la paresse rend-elle l'annulation bon marché ?",
      options: [
        "Un travail jamais lancé n'a pas besoin d'être interrompu — dropper la future, c'est l'annulation",
        "Le runtime garde un journal d'annulation pour chaque future",
        "Les futures annulées sont pollées une dernière fois pour se dérouler proprement",
      ],
      answer: 0,
      explain:
        "Ça explique aussi pourquoi l'annulation ne peut pas être *async* : dropper est synchrone, donc tout nettoyage qui a besoin d'awaiter doit être arrangé autrement.",
    },
    {
      kind: "editor",
      intro: `### Prouve que rien ne tourne tout seul

1. \`struct Effect { ran: bool }\` qui implémente \`Future<Output = &'static str>\` : \`poll\` met \`ran = true\` et renvoie \`Ready("side effect happened")\`.
2. \`async fn build() -> &'static str\` qui renvoie \`"from an async fn"\`.
3. Dans \`main\` : crée l'\`Effect\` et affiche \`ran\` (false). Polle-le une fois, affiche le \`Poll\` et \`ran\` à nouveau (true). Puis appelle \`build()\`, affiche que rien n'a tourné, \`Box::pin\`-le, et polle-le.

Sortie attendue :

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\``,
    },
  ],

  "rust-async-internals-3": [
    {
      kind: "theory",
      body: `Un executor, c'est une boucle :

\`\`\`rust
loop {
    match future.as_mut().poll(&mut cx) {
        Poll::Ready(v) => return v,
        Poll::Pending  => /* attendre d'être réveillé */,
    }
}
\`\`\`

La seule partie difficile, c'est *« attendre d'être réveillé »*. Tourner en boucle marcherait et cramerait un cœur. À la place, l'executor fournit un \`Waker\` dans le \`Context\`, puis parque le thread — et le boulot de la future est d'appeler ce waker quand un progrès devient possible.`,
    },
    {
      kind: "theory",
      body: `\`Waker\` est une vtable construite à la main, parce qu'elle est antérieure au moment où \`dyn\` est devenu utilisable à cet endroit :

\`\`\`rust
static VTABLE: RawWakerVTable =
    RawWakerVTable::new(clone_raw, wake_raw, wake_by_ref_raw, drop_raw);
\`\`\`

Quatre pointeurs de fonction au-dessus d'un \`*const ()\` effacé — ce pointeur étant un \`Arc\` qu'on a fait fuir en pointeur brut et qu'on reconstruit dans chaque callback. \`clone\` doit incrémenter le compteur de références, \`drop\` doit le décrémenter, et se tromper là-dessus fuit ou libère deux fois. C'est le seul endroit de l'async Rust où tu as vraiment besoin d'\`unsafe\`, et c'est pour ça que tout projet réel prend un crate pour ça.

La moitié « parquer », c'est un \`Mutex<bool>\` plus une \`Condvar\` : \`wait\` dort jusqu'à ce que le flag soit levé, \`notify\` le lève et réveille le dormeur. L'écrire une fois vaut un après-midi — après ça, \`block_on\` n'est plus une fonction mystère sortie d'un crate, c'est trente lignes que tu as déjà écrites.`,
    },
    {
      kind: "quiz",
      question: "Quel est le boulot du `Waker` ?",
      options: [
        "Permettre à une future de dire à l'executor « polle-moi encore » — sans lui, l'executor doit tourner en boucle ou dormir pour toujours",
        "Exécuter le corps de la future sur un thread d'arrière-plan",
        "Annuler la future quand elle prend trop de temps",
      ],
      answer: 0,
      explain:
        "C'est le contrat qui rend l'async efficace : une future `Pending` ne coûte rien tant que quelque chose ne la réveille pas, donc dix mille connexions inactives coûtent dix mille machines à états parquées et zéro CPU.",
    },
    {
      kind: "fill",
      prompt:
        "Pin la future une seule fois, sur le heap, pour pouvoir la poller en boucle.",
      file: "main.rs",
      before: "let mut future = ",
      after: "(future);",
      choices: ["Box::pin", "Box::new", "Arc::new"],
      answer: 0,
      explain:
        "`block_on` accepte n'importe quel `F: Future`, y compris un bloc async non-`Unpin`, donc il doit le pin. Boxer est le moyen le plus simple ; les vrais executors pinnent sur la stack pour éviter l'allocation.",
    },
    {
      kind: "quiz",
      question:
        "Une future écrite à la main renvoie `Pending` et n'appelle jamais le waker. Que se passe-t-il dans un vrai executor ?",
      options: [
        "Elle n'est plus jamais pollée — la task pend pour toujours, sans erreur et sans consommer de CPU",
        "L'executor la re-polle après un timeout par défaut",
        "Le runtime détecte le wake manquant et panique",
      ],
      answer: 0,
      explain:
        "C'est le bug classique de la future écrite à la main, et il est invisible : la task s'arrête, point. Rien ne te prévient, parce que « pas encore prête » et « ne sera jamais prête » sont identiques vus de l'extérieur.",
    },
    {
      kind: "editor",
      intro: `### Écris un vrai block_on

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` avec \`new() -> Arc<Signal>\`, \`wait(&self)\` (dort jusqu'à ce que le flag soit levé, puis le remet à zéro) et \`notify(&self)\`.
2. Une \`static VTABLE: RawWakerVTable\` avec quatre \`unsafe fn\` au-dessus d'un \`Arc<Signal>\` qu'on a fait fuir en \`*const ()\`. \`clone\` incrémente le compteur, \`wake_by_ref\` notifie sans consommer, \`wake\` notifie et consomme, \`drop\` décrémente.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` qui le construit avec \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, construis le contexte, puis boucle : \`Ready\` renvoie, \`Pending\` appelle \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` qui rend la main trois fois puis \`Ready(7)\`, et \`async fn work() -> u32\` qui l'awaite et ajoute 1.
6. Lance \`block_on(async { 5u32 })\` et \`block_on(work())\`.

Sortie attendue :

\`\`\`text
simple: 5
yielding: 8
\`\`\`

C'est l'exercice le plus long du parcours. C'est aussi celui qui fait qu'ensuite, chaque runtime se lit comme du code ordinaire.`,
    },
  ],

  "rust-async-internals-4": [
    {
      kind: "theory",
      body: `La concurrence async est **coopérative**. Une task tourne jusqu'à renvoyer \`Pending\`, et c'est seulement là qu'une autre task du même thread peut tourner. Rien ne la préempte.

Le modèle n'a donc qu'une exigence : chaque task doit renvoyer \`Pending\` régulièrement. Une task qui calcule pendant 200 ms dans un seul \`poll\` monopolise son thread de runtime pendant 200 ms, et toutes les autres tasks assignées à ce thread attendent — y compris celles dont les clients sont en train de partir en timeout.`,
    },
    {
      kind: "theory",
      body: `Le mode de panne a un nom — **bloquer l'executor** — et trois causes courantes :

- **De l'I/O synchrone.** \`std::fs::read\`, un driver de base de données bloquant, \`std::thread::sleep\` dans un \`async fn\`.
- **Du travail CPU.** Du hashing, de la compression, un gros tri.
- **Un lock tenu à travers un \`.await\`.** La task se parque en le gardant, et tout le monde fait la queue derrière une task qui ne tourne même pas.

Le fix, c'est de sortir le travail des threads async : \`tokio::task::spawn_blocking\` pour l'I/O et les appels bloquants courts, un pool \`rayon\` dédié pour le gros CPU. La règle empirique : un poll devrait se terminer en quelques dizaines de microsecondes.

C'est aussi pour ça que le symptôme est si déroutant. La latence monte sur les endpoints qui partagent un thread de runtime avec le coupable, pas sur l'endpoint qui bloque — donc la trace lente pointe vers du code innocent.`,
    },
    {
      kind: "quiz",
      question:
        "Un handler fait une lecture de fichier synchrone de 200 ms dans un `async fn`. Que voit l'opérateur ?",
      options: [
        "La latence p99 monte sur les *autres* endpoints qui partagent ce thread de runtime — le handler coupable peut sembler nickel",
        "Seul ce handler ralentit ; le runtime isole les tasks les unes des autres",
        "Le runtime loggue un warning et déplace la task vers un pool bloquant",
      ],
      answer: 0,
      explain:
        "C'est la fausse piste qui rend ça coûteux à debugger. Les métriques de task de Tokio (`--cfg tokio_unstable`) et un histogramme de durée de poll existent précisément pour pointer le vrai coupable.",
    },
    {
      kind: "fill",
      prompt:
        "Rends la main à l'executor pour que les autres tasks puissent avancer.",
      file: "main.rs",
      before: "self.left -= 1;\ncx.waker().",
      after: "();\nPoll::Pending",
      choices: ["wake_by_ref", "wake", "clone"],
      answer: 0,
      explain:
        "`wake_by_ref` planifie un autre poll sans consommer le waker, ce que tu veux quand le waker vit dans le `Context` qu'on t'a passé.",
    },
    {
      kind: "quiz",
      question: "Où doit tourner un calcul CPU de 500 ms ?",
      options: [
        "Sur un pool dédié — `spawn_blocking` ou un pool `rayon` — jamais dans un poll sur un thread worker async",
        "Dans l'`async fn`, puisque le runtime le préemptera après une tranche de temps",
        "Découpé en plusieurs `async fn`, que le runtime entrelace automatiquement",
      ],
      answer: 0,
      explain:
        "Il n'y a aucune préemption sur laquelle compter. Découper en plusieurs `async fn` ne change rien non plus — sans `.await` entre les deux, ça reste un seul poll ininterrompu.",
    },
    {
      kind: "editor",
      intro: `### Coopératif, et ce qui arrive quand tu ne l'es pas

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` qui implémente \`Future<Output = ()>\` : logge \`"<name>:<left>"\`, et si \`left\` vaut zéro renvoie \`Ready\`, sinon décrémente, réveille, et renvoie \`Pending\`.
2. \`struct Hog { name, log }\` dont l'unique \`poll\` logge trois entrées et renvoie \`Ready\` — tout son travail en un seul tour.
3. Polle deux \`Task\` (\`a\` et \`b\`, toutes deux \`left: 2\`) en alternance jusqu'à ce que les deux terminent, et affiche le log.
4. Avec un log neuf, polle un \`Hog\` jusqu'au bout, puis une \`Task\` nommée \`starved\` (\`left: 1\`), et affiche ce log.

Sortie attendue :

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

Le premier log s'entrelace. Le second non — le hog a tout fini avant que l'autre task ait eu un seul tour.`,
    },
  ],

  "rust-async-internals-5": [
    {
      kind: "theory",
      body: `Il n'y a pas de \`cancel()\` en async Rust. **Annuler, c'est dropper la future.**

\`\`\`rust
{
    let mut req = Request { .. };
    poll(&mut req);          // démarrée
    poll(&mut req);          // toujours pending
}                            // droppée ici — annulée
\`\`\`

La machine à états est détruite là où elle se trouvait suspendue. Chaque locale qu'elle tenait est droppée, dans l'ordre habituel. C'est tout le mécanisme de nettoyage.`,
    },
    {
      kind: "theory",
      body: `Deux conséquences qui décident si un service est correct sous charge.

**Une future peut être droppée à n'importe quel \`.await\`.** Quand un client se déconnecte ou qu'un timeout se déclenche, la task s'arrête entre deux instructions. Tout ce qui était à moitié fait reste à moitié fait — donc une opération en deux étapes doit être idempotente, ou enveloppée de façon qu'un retry puisse la rejouer sans risque. Cette propriété s'appelle la **cancellation safety**, et les docs des bibliothèques la déclarent explicitement : \`tokio::sync::mpsc::Receiver::recv\` et \`AsyncReadExt::read\` sont cancel-safe ; \`read_exact\` ne l'est pas, parce qu'il peut déjà avoir déplacé des octets dans ton buffer au moment où il est droppé.

**Le nettoyage doit être synchrone.** \`Drop\` ne peut pas \`.await\`, donc une future ne peut pas awaiter une fermeture propre en sortant. Les contournements standard : faire le nettoyage de façon synchrone dans \`Drop\`, ou confier le travail à une task détachée qui survit à celle qui est annulée.

La forme pratique : garde la zone awaitée petite, rends chaque étape idempotente, et mets tout ce qui doit absolument arriver derrière un guard \`Drop\` plutôt qu'après le dernier \`.await\`.`,
    },
    {
      kind: "quiz",
      question: "Comment une task async en vol est-elle annulée en Rust ?",
      options: [
        "Sa future est droppée — la machine à états est détruite là où elle était suspendue, en exécutant le `Drop` de chaque locale",
        "Le runtime lui envoie un signal d'annulation qu'elle peut intercepter et gérer",
        "Elle est pollée une dernière fois avec un flag d'annulation levé dans le `Context`",
      ],
      answer: 0,
      explain:
        "Comme c'est un simple `Drop`, l'annulation est synchrone et ne peut pas être awaitée. Ce seul fait est la source de presque toutes les galères de graceful shutdown en async Rust.",
    },
    {
      kind: "fill",
      prompt:
        "Attache un nettoyage qui tourne même quand la future est annulée en plein vol.",
      file: "main.rs",
      before: "impl ",
      after: " for Request {\n    fn drop(&mut self) { /* release */ }\n}",
      choices: ["Drop", "Future", "Cancel"],
      answer: 0,
      explain:
        "`Drop` est le seul hook qui tourne à l'annulation. Le code placé après le dernier `.await` ne tourne pas, parce que la task n'y arrive jamais.",
    },
    {
      kind: "quiz",
      question:
        "Un handler débite un compte, `.await` un appel réseau, puis en crédite un autre. Le client se déconnecte pendant l'await. Quel est l'état ?",
      options: [
        "Débité et pas crédité — la future a été droppée en plein vol, et de l'argent s'est volatilisé",
        "Les deux étapes sont annulées automatiquement quand la future est droppée",
        "Le runtime termine le handler avant de tenir compte de la déconnexion",
      ],
      answer: 0,
      explain:
        "C'est la cancellation safety en tant que bug de correction, pas en tant que remarque de style. Le fix, c'est une transaction, une clé d'idempotence, ou un guard `Drop` qui compense — pas espérer que le client reste connecté.",
    },
    {
      kind: "editor",
      intro: `### Regarde une annulation faire le ménage

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` qui pousse \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` dont le \`poll\` pousse \`"poll <id>"\`, réveille, et renvoie \`Pending\` pour toujours.
4. Dans \`main\` : dans un bloc, crée la requête \`1\`, polle-la **deux fois**, et laisse le bloc se terminer — c'est ça, l'annulation. Pousse un marqueur \`"---"\`. Puis crée la requête \`2\`, polle-la une fois, et \`drop\`-la explicitement.
5. Affiche le log.

Sortie attendue :

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Aucune des deux requêtes n'a jamais renvoyé \`Ready\`. Les deux ont quand même fait le ménage.`,
    },
  ],

  "rust-async-internals-6": [
    {
      kind: "theory",
      body: `Un timeout n'est ni un signal ni un thread. C'est une future qui polle deux choses et renvoie celle qui termine en premier :

\`\`\`rust
loop {
    if let Poll::Ready(v) = poll(&mut work)    { return v; }
    if let Poll::Ready(v) = poll(&mut deadline) { return v; }
}
\`\`\`

C'est ça, \`select!\`, et \`timeout(d, fut)\` est le cas particulier où l'un des côtés est un timer. Rien n'est interrompu — **le perdant est simplement droppé**, ce qui, d'après la leçon précédente, est exactement ce qu'est une annulation.`,
    },
    {
      kind: "theory",
      body: `Trois choses en découlent, et chacune finit par mordre quelqu'un.

**Une branche droppée est annulée en plein vol.** Si la branche perdante avait fait la moitié d'une opération en deux étapes, cette moitié reste faite. Ne mets qu'une future cancel-safe dans une branche de \`select!\`, ou restructure pour que l'état partiel ne puisse pas compter.

**L'ordre de poll est une question d'équité.** Un \`select\` naïf qui polle toujours la première branche en premier affame la seconde quand la première est généralement prête. \`tokio::select!\` randomise l'ordre des branches par défaut exactement pour ça — et te laisse le désactiver avec \`biased;\` quand tu veux vraiment une priorité.

**Chaque appel sortant a besoin d'une deadline.** Sans ça, une dépendance qui pend devient ta propre file d'attente sans borne : les connexions s'empilent, la mémoire grossit, et la panne se propage à ceux qui t'appellent. Un timeout n'est pas de la gestion d'erreur, c'est ce qui garde une panne locale.`,
    },
    {
      kind: "quiz",
      question: "Qu'arrive-t-il à la branche perdante d'un `select!` ?",
      options: [
        "Elle est droppée — annulée là où elle était suspendue, avec tout travail partiel laissé en l'état",
        "Elle continue de tourner en arrière-plan et son résultat est jeté",
        "Elle est pollée jusqu'au bout d'abord, puis ignorée",
      ],
      answer: 0,
      explain:
        "C'est pour ça que les docs de `tokio` marquent les futures comme cancel-safe ou non. Mettre une future non cancel-safe dans une branche de `select!` est un bug de correction, pas une remarque de performance.",
    },
    {
      kind: "fill",
      prompt:
        "Renvoie dès que l'un des deux côtés termine, sans attendre l'autre.",
      file: "main.rs",
      before: "if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) {\n    ",
      after: " v;\n}",
      choices: ["return", "break", "continue"],
      answer: 0,
      explain:
        "Renvoyer immédiatement, c'est ce qui drop l'autre future — le perdant sort de la portée avec la fonction. Ce drop *est* l'annulation.",
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `tokio::select!` randomise-t-il la branche pollée en premier ?",
      options: [
        "Pour éviter d'affamer les branches suivantes quand une branche précédente est généralement prête",
        "Pour réduire la taille de l'expansion de la macro",
        "Pour répartir la charge uniformément entre les threads worker du runtime",
      ],
      answer: 0,
      explain:
        "Un ordre fixe est un ordre de priorité, et une priorité que tu n'as pas voulue, c'est de la famine. `biased;` te ramène à l'ordre déterministe quand la priorité est délibérée.",
    },
    {
      kind: "editor",
      intro: `### Fais courir deux futures

1. \`struct Ticks { label: &'static str, left: u32 }\` qui implémente \`Future<Output = &'static str>\` : à zéro renvoie \`Ready(self.label)\`, sinon décrémente, réveille, renvoie \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` où les deux sont \`Future<Output = &'static str> + Unpin\` — boucle en pollant \`a\` puis \`b\`, en renvoyant le premier \`Ready\`.
3. Fais courir \`work\` (\`left: 2\`) contre \`timeout\` (\`left: 5\`), puis \`work\` (\`left: 9\`) contre \`timeout\` (\`left: 3\`).

Sortie attendue :

\`\`\`text
work
timeout
\`\`\`

À chaque fois, le perdant est droppé au \`return\` — ce qui est précisément une annulation.`,
    },
  ],

  "rust-async-internals-7": [
    {
      kind: "theory",
      body: `Tout ce que Tokio fournit est maintenant un nom pour quelque chose que tu as déjà construit.

| tu as écrit | Tokio |
| --- | --- |
| le \`loop\` de \`block_on\` | \`#[tokio::main]\` / \`Runtime::block_on\` |
| pousser une future dans une file | \`tokio::spawn\` |
| l'entrée de la file elle-même | \`JoinHandle<T>\` |
| ta fonction \`race\` | \`tokio::select!\` |
| courir contre un compteur | \`tokio::time::timeout\` |
| \`Signal\` + \`Condvar\` | le registre de wakers du reactor |
| « ne bloque pas le poll » | \`tokio::task::spawn_blocking\` |

Il n'y a aucun concept en plus dans la liste. Ce que Tokio ajoute, c'est l'échelle et un reactor d'I/O.`,
    },
    {
      kind: "theory",
      body: `Les morceaux qui valent vraiment le coup d'être pris dans la bibliothèque plutôt qu'écrits :

**Un reactor epoll/kqueue.** Ton \`Signal\` se réveillait sur une condvar. Un vrai runtime enregistre une socket auprès de l'OS et réveille exactement la task dont la socket est devenue lisible. C'est ce qui permet à un thread de servir dix mille connexions.

**Un scheduler multi-thread à work stealing.** Les tasks sont réparties entre des threads worker, et un worker inactif vole dans la file d'un worker occupé. C'est de là que vient le bound \`Send + 'static\` de \`tokio::spawn\` : une task peut migrer d'un thread à l'autre à n'importe quel point d'await.

**Une timer wheel.** Ta race pollait un compteur en boucle active. Tokio garde une seule structure de timers triée et réveille chaque task à sa deadline, donc un million de timeouts en attente ne coûtent presque rien.

Garde le modèle mental que tu as construit. Quand une task pend, la question reste *« qui était censé appeler le waker, et pourquoi ne l'a-t-il pas fait ? »* — et maintenant tu sais ce que ça veut dire.`,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi `tokio::spawn` exige-t-il que la future soit `Send + 'static` ?",
      options: [
        "Le scheduler à work stealing peut déplacer la task entre threads worker, et elle peut survivre à la fonction qui l'a spawnée",
        "Chaque task spawnée est sérialisée pour être envoyée au reactor",
        "`'static` garantit que la task tourne pendant toute la durée de vie du processus",
      ],
      answer: 0,
      explain:
        "`tokio::task::spawn_local` laisse tomber l'exigence `Send` précisément parce qu'un `LocalSet` épingle les tasks à un seul thread — le bound parle de migration, pas d'async.",
    },
    {
      kind: "fill",
      prompt:
        "Stocke des futures hétérogènes dans une seule file — la liste de tasks du mini-runtime.",
      file: "main.rs",
      before: "type Task = ",
      after: "<Box<dyn Future<Output = &'static str>>>;",
      choices: ["Pin", "Box", "Arc"],
      answer: 0,
      explain:
        "`Pin<Box<dyn Future>>` est le type canonique de task boxée — `Box` pour la taille inconnue, `Pin` parce que `poll` l'exige. Le type de task interne de Tokio, c'est ça avec plus de comptabilité.",
    },
    {
      kind: "quiz",
      question:
        "Une task en production pend pour toujours, sans CPU et sans erreur. Quelle est la première question ?",
      options: [
        "Qui était censé appeler le waker de cette task, et pourquoi ne l'a-t-il pas fait ?",
        "Quel thread bloque-t-elle, et comment la préempter ?",
        "Quelle est la taille de sa stack, et a-t-elle débordé ?",
      ],
      answer: 0,
      explain:
        "Zéro CPU exclut le blocage — une task bloquée crame son thread. Une task parquée qu'on ne réveille jamais est silencieuse, et c'est exactement la forme d'un wake manquant.",
    },
    {
      kind: "editor",
      intro: `### Un mini runtime avec spawn

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` avec \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` qui pousse \`Box::pin(f)\`, et \`run(&mut self)\` qui dépile, polle, enregistre les \`Ready\` et remet les \`Pending\` dans la file.
3. \`struct Delayed { label: &'static str, left: u32 }\` qui rend la main \`left\` fois avant de renvoyer son label.
4. Spawne \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` et \`async { "immediate" }\`, lance, et affiche l'ordre de complétion.

Sortie attendue :

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

L'ordre de complétion suit la *disponibilité*, pas l'ordre de spawn. Note que ce runtime remet dans la file sans condition et ignore donc complètement le waker — c'est la seule chose qui le sépare d'un vrai.`,
    },
  ],
};
