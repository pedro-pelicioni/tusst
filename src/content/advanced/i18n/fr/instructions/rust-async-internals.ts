// FR · editor instructions — Async From First Principles.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-async-internals.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustAsyncInternalsInstructionsFr: Record<string, { instructions: string }> = {
  "rust-async-internals-1": {
    instructions: `## Implémente Future à la main

\`\`\`rust
trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}
\`\`\`

\`poll\` demande « t'as fini ? » et répond \`Ready(v)\` ou \`Pending\`. Rien n'exécute une future tout seul.

### Ta tâche

1. \`struct Immediate(u32)\` qui implémente \`Future<Output = u32>\` et renvoie \`Poll::Ready(self.0)\` d'entrée.
2. \`struct Countdown { left: u32 }\` qui implémente \`Future<Output = u32>\` : tant que \`left > 0\`, décrémente et renvoie \`Pending\` ; à zéro renvoie \`Ready(0)\`.
3. Dans \`main\`, construis un \`Context\` à partir de \`Waker::noop()\` et polle chacune à la main — \`Immediate\` une fois, \`Countdown\` trois fois — en affichant chaque \`Poll\` avec \`{:?}\`.

Sortie attendue :

\`\`\`text
immediate: Ready(42)
poll 1: Pending
poll 2: Pending
poll 3: Ready(0)
\`\`\`

Il n'y a pas d'executor dans ce programme. L'executor, c'est toi.

### Indices

- \`use std::task::{Context, Poll, Waker};\`
- \`Countdown::poll\` a besoin de \`mut self: Pin<&mut Self>\` pour décrémenter.
- \`Pin::new(&mut f).poll(&mut cx)\` polle une future qui n'a pas bougé.
`,
  },

  "rust-async-internals-2": {
    instructions: `## Prouve que rien ne tourne tout seul

Appeler un \`async fn\` n'exécute **rien** de son corps — ça construit une machine à états posée à l'état zéro. Le corps ne tourne que quand quelque chose le polle.

C'est l'inverse d'une promise JavaScript, et c'est pour ça que \`Future\` est \`#[must_use]\` : une future droppée sans await veut dire que le travail n'a jamais eu lieu.

### Ta tâche

1. \`struct Effect { ran: bool }\` qui implémente \`Future<Output = &'static str>\` : \`poll\` met \`ran = true\` et renvoie \`Ready("side effect happened")\`.
2. \`async fn build() -> &'static str\` qui renvoie \`"from an async fn"\`.
3. Dans \`main\` : crée l'\`Effect\`, affiche \`ran\` (false). Polle-le une fois, affiche le \`Poll\` et \`ran\` à nouveau (true). Puis appelle \`build()\`, affiche que rien n'a tourné, \`Box::pin\`-le, et polle-le.

Sortie attendue :

\`\`\`text
created, ran: false
polled: Ready("side effect happened")
now ran: true
async fn created, nothing ran
awaited: Ready("from an async fn")
\`\`\`

### Indices

- Un bloc \`async\` n'est pas \`Unpin\`, donc il lui faut \`Box::pin\`, pas \`Pin::new\`.
- Polle la future boxée avec \`fut.as_mut().poll(&mut cx)\`.
`,
  },

  "rust-async-internals-3": {
    instructions: `## Écris un vrai block_on

Un executor, c'est une boucle : polle, et sur \`Pending\`, attends d'être réveillé. Le \`Waker\`, c'est le moyen pour une future de dire « polle-moi encore ».

\`Waker\` est une vtable construite à la main au-dessus d'un \`*const ()\` effacé — ici, un \`Arc<Signal>\` qu'on a fait fuir en pointeur brut. \`clone\` doit incrémenter le compteur de références et \`drop\` doit le décrémenter ; c'est le seul endroit de l'async Rust qui a vraiment besoin d'\`unsafe\`.

### Ta tâche

1. \`struct Signal { ready: Mutex<bool>, cv: Condvar }\` avec \`new() -> Arc<Signal>\`, \`wait(&self)\` (dort jusqu'à ce que le flag soit levé, puis le remet à zéro) et \`notify(&self)\`.
2. Une \`static VTABLE: RawWakerVTable\` avec quatre \`unsafe fn\` : \`clone\` incrémente le compteur, \`wake\` notifie et consomme, \`wake_by_ref\` notifie sans consommer, \`drop\` décrémente.
3. \`fn waker_for(signal: &Arc<Signal>) -> Waker\` via \`Waker::from_raw\`.
4. \`fn block_on<F: Future>(future: F) -> F::Output\` — \`Box::pin\`, construis le contexte, boucle : \`Ready\` renvoie, \`Pending\` appelle \`signal.wait()\`.
5. \`struct Yield { left: u32 }\` qui rend la main trois fois puis \`Ready(7)\` ; \`async fn work() -> u32\` qui l'awaite et ajoute 1.
6. Lance \`block_on(async { 5u32 })\` et \`block_on(work())\`.

Sortie attendue :

\`\`\`text
simple: 5
yielding: 8
\`\`\`

C'est l'exercice le plus long du parcours, et celui qui fait qu'ensuite chaque runtime se lit comme du code ordinaire.

### Indices

- \`Arc::into_raw\` / \`Arc::from_raw\` forment la paire fuite-et-reconstruction ; utilise \`std::mem::forget\` quand tu ne dois pas consommer l'\`Arc\` reconstruit.
- \`Yield\` doit appeler \`cx.waker().wake_by_ref()\` avant de renvoyer \`Pending\`, sinon \`wait()\` dort pour toujours.
- \`Condvar::wait\` te rend le guard : \`ready = self.cv.wait(ready).unwrap();\`
`,
  },

  "rust-async-internals-4": {
    instructions: `## Coopératif, et ce qui arrive quand tu ne l'es pas

Une task tourne jusqu'à renvoyer \`Pending\`. Rien ne la préempte. Donc un \`poll\` qui calcule pendant 200 ms monopolise son thread de runtime pendant 200 ms, et toutes les autres tasks de ce thread attendent.

Ce qui déroute en production : la latence monte sur les *autres* endpoints qui partagent ce thread, donc la trace lente pointe vers du code innocent.

### Ta tâche

1. \`struct Task { name: &'static str, left: u32, log: Rc<RefCell<Vec<String>>> }\` qui implémente \`Future<Output = ()>\` : logge \`"<name>:<left>"\` ; si \`left\` vaut zéro renvoie \`Ready\`, sinon décrémente, réveille, renvoie \`Pending\`.
2. \`struct Hog { name: &'static str, log: Rc<RefCell<Vec<String>>> }\` dont l'unique \`poll\` logge trois entrées (\`"<name>:0"\`, \`"<name>:1"\`, \`"<name>:2"\`) et renvoie \`Ready\`.
3. Polle deux \`Task\` (\`a\` et \`b\`, toutes deux \`left: 2\`) en alternance jusqu'à ce que les deux terminent, puis affiche le log.
4. Avec un log neuf, polle un \`Hog\` nommé \`hog\` jusqu'au bout, puis une \`Task\` nommée \`starved\` (\`left: 1\`), et affiche ce log.

Sortie attendue :

\`\`\`text
cooperative: ["a:2", "b:2", "a:1", "b:1", "a:0", "b:0"]
blocking: ["hog:0", "hog:1", "hog:2", "starved:1", "starved:0"]
\`\`\`

Le premier log s'entrelace. Le second non.

### Indices

- \`Poll::is_ready()\` est pratique pour la boucle en alternance.
- \`{:?}\` sur \`log.borrow()\` affiche le \`Vec\` du dedans.
`,
  },

  "rust-async-internals-5": {
    instructions: `## Regarde une annulation faire le ménage

Il n'y a pas de \`cancel()\`. **Annuler, c'est dropper la future** — la machine à états est détruite là où elle était suspendue, et chaque locale qu'elle tenait est droppée dans l'ordre habituel.

Deux conséquences : une future peut être droppée à n'importe quel \`.await\`, donc une opération à moitié faite reste à moitié faite ; et \`Drop\` ne peut pas \`.await\`, donc le nettoyage doit être synchrone.

### Ta tâche

1. \`struct Request { id: u32, log: Rc<RefCell<Vec<String>>> }\`.
2. \`impl Drop\` qui pousse \`"cleanup <id>"\`.
3. \`impl Future<Output = u32>\` dont le \`poll\` pousse \`"poll <id>"\`, réveille, et renvoie \`Pending\` — pour toujours.
4. Dans \`main\` : dans un bloc, crée la requête \`1\`, polle-la **deux fois**, et laisse le bloc se terminer — c'est ça, l'annulation. Pousse un marqueur \`"---"\`. Puis crée la requête \`2\`, polle-la une fois, et \`drop\`-la explicitement.
5. Affiche le log.

Sortie attendue :

\`\`\`text
["poll 1", "poll 1", "cleanup 1", "---", "poll 2", "cleanup 2"]
\`\`\`

Aucune des deux requêtes n'a jamais renvoyé \`Ready\`. Les deux ont quand même fait le ménage.

### Indices

- \`Poll\` est \`#[must_use]\` ; lie le résultat avec \`let _ = ...\` pour le jeter.
`,
  },

  "rust-async-internals-6": {
    instructions: `## Fais courir deux futures

Un timeout n'est ni un signal ni un thread — c'est une future qui polle deux choses et renvoie celle qui termine en premier. C'est ça, \`select!\`, et le **perdant est droppé**, ce qui est exactement une annulation.

### Ta tâche

1. \`struct Ticks { label: &'static str, left: u32 }\` qui implémente \`Future<Output = &'static str>\` : à zéro renvoie \`Ready(self.label)\`, sinon décrémente, réveille, renvoie \`Pending\`.
2. \`fn race<A, B>(mut a: A, mut b: B) -> &'static str\` où les deux sont \`Future<Output = &'static str> + Unpin\` — boucle en pollant \`a\` puis \`b\`, en renvoyant le premier \`Ready\`.
3. Fais courir \`work\` (\`left: 2\`) contre \`timeout\` (\`left: 5\`), puis \`work\` (\`left: 9\`) contre \`timeout\` (\`left: 3\`).

Sortie attendue :

\`\`\`text
work
timeout
\`\`\`

À chaque fois, le perdant est droppé au \`return\`.

### Indices

- \`if let Poll::Ready(v) = Pin::new(&mut a).poll(&mut cx) { return v; }\`
- Le bound \`Unpin\` est ce qui permet à \`race\` d'utiliser \`Pin::new\` plutôt que de boxer.
`,
  },

  "rust-async-internals-7": {
    instructions: `## Un mini runtime avec spawn

Tout ce que Tokio fournit est un nom pour quelque chose que tu as maintenant construit : \`block_on\` est ta boucle, \`tokio::spawn\` c'est pousser dans une file, \`select!\` est ta \`race\`, \`timeout\` est une course contre un timer.

Ce que Tokio ajoute vraiment, c'est un reactor epoll/kqueue, un scheduler à work stealing et une timer wheel.

### Ta tâche

1. \`type Task = Pin<Box<dyn Future<Output = &'static str>>>\`.
2. \`struct MiniRuntime { queue: VecDeque<Task>, done: Vec<&'static str> }\` avec \`new()\`, \`spawn<F: Future<Output = &'static str> + 'static>(&mut self, f: F)\` qui pousse \`Box::pin(f)\`, et \`run(&mut self)\` qui dépile, polle, enregistre les \`Ready\` et remet les \`Pending\` dans la file.
3. \`struct Delayed { label: &'static str, left: u32 }\` qui rend la main \`left\` fois avant de renvoyer son label.
4. Spawne \`Delayed { "fast", 1 }\`, \`Delayed { "slow", 3 }\` et \`async { "immediate" }\`, lance, affiche l'ordre de complétion.

Sortie attendue :

\`\`\`text
completed: ["immediate", "fast", "slow"]
\`\`\`

L'ordre de complétion suit la *disponibilité*, pas l'ordre de spawn. Ce runtime remet dans la file sans condition et ignore donc complètement le waker — c'est la seule chose qui le sépare d'un vrai.

### Indices

- \`use std::collections::VecDeque;\`
- \`while let Some(mut task) = self.queue.pop_front()\` pilote la boucle.
`,
  },
};
