// FR · editor instructions — Threads, Send/Sync & Shared State.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/rust-concurrency.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const rustConcurrencyInstructionsFr: Record<string, { instructions: string }> = {
  "rust-concurrency-1": {
    instructions: `## Fan out, puis collecte

\`thread::spawn\` renvoie un \`JoinHandle<T>\` ; \`join()\` bloque et te donne la valeur de retour de la closure dans un \`Result\` — \`Err\` veut dire que ce thread a panic.

La closure doit être \`'static\`, donc \`move\` est presque toujours obligatoire.

### Ta tâche

1. Spawne quatre threads, un par \`id\` dans \`0..4u32\`, chacun renvoyant \`id * id\`.
2. Collecte les handles dans un \`Vec\`.
3. Fais les join **dans l'ordre de spawn** dans un \`Vec<u32>\`, affiche-le avec \`{:?}\`, puis affiche la somme.

Sortie attendue :

\`\`\`text
results: [0, 1, 4, 9]
total: 14
\`\`\`

L'ordre d'exécution n'est pas déterministe ; faire les join dans l'ordre rend quand même le résultat déterministe.

### Indices

- \`use std::thread;\`
- \`results.iter().sum::<u32>()\` annote la somme en ligne.
`,
  },

  "rust-concurrency-2": {
    instructions: `## Prouve les propriétés

**\`Send\`** — la valeur peut être *déplacée* vers un autre thread.
**\`Sync\`** — la valeur peut être *partagée par référence* entre threads (\`T: Sync\` ⟺ \`&T: Send\`).

Les deux sont des auto traits : un type les obtient quand tous ses champs les ont.

Les cas instructifs : \`Rc\` n'a aucun des deux (compteur non atomique). \`Cell\` est \`Send\` mais **pas** \`Sync\` — déplacer la cell est ok, partager \`&Cell\` fait une race sur \`set\`.

### Ta tâche

1. \`fn assert_send<T: Send>(_: &T) -> &'static str\` qui renvoie \`"Send"\`, et \`fn assert_sync<T: Sync>(_: &T) -> &'static str\` qui renvoie \`"Sync"\`.
2. Montre que \`Arc<u32>\` satisfait les deux.
3. Crée un \`Rc<u32>\` contenant \`42\` et affiche juste sa valeur — le passer à \`assert_send\` ne compilerait pas, et c'est ça la leçon.
4. Montre que \`Cell<u32>\` satisfait \`Send\`. N'appelle **pas** \`assert_sync\` dessus.

Sortie attendue :

\`\`\`text
Arc<u32> is Send
Arc<u32> is Sync
Rc<u32> compiles here: 42
Cell<u32> is Send
\`\`\`

### Indices

- \`use std::rc::Rc;\`, \`use std::sync::Arc;\`, \`use std::cell::Cell;\`
- Les helpers ne déplacent jamais rien — c'est le *bound* qui force la preuve.
`,
  },

  "rust-concurrency-3": {
    instructions: `## Partage une table avec quatre workers

\`Arc<T>\` est \`Rc<T>\` avec un compteur de références atomique, ce qui est ce qui le rend \`Send + Sync\`. Tout seul, il donne un **accès partagé en lecture seule** — la mutation exige un \`Mutex\` ou un \`RwLock\` interne.

L'idiome est de shadow le binding dans la boucle : \`let table = Arc::clone(&table);\` avant la closure \`move\`.

### Ta tâche

1. Construis un \`Arc<Vec<u64>>\` contenant \`(1..=1000).collect()\` ; affiche \`Arc::strong_count\`.
2. Spawne quatre threads. Chacun prend son propre \`Arc::clone\` et somme une slice de 250 éléments avec \`.iter().skip(chunk * 250).take(250).sum::<u64>()\`.
3. Fais les join, en additionnant les sommes partielles, et affiche le total.
4. Affiche de nouveau le strong count — revenu à 1.

Sortie attendue :

\`\`\`text
owners before: 1
total: 500500
owners after: 1
\`\`\`

### Indices

- Annote le collect : \`let table: Arc<Vec<u64>> = Arc::new((1..=1000).collect());\`
- \`chunk\` est un \`usize\` issu de \`0..4usize\`.
`,
  },

  "rust-concurrency-4": {
    instructions: `## Huit threads, un compteur

\`Mutex<T>\` **possède** ses données — il n'y a aucun moyen d'atteindre la valeur sans verrouiller. Le guard se déréférence en \`&mut T\` et libère au drop ; il n'y a pas de \`unlock()\`.

\`lock()\` renvoie un \`Result\` à cause du **poisoning** : un thread qui panic en tenant le lock le marque, et chaque \`lock()\` ultérieur renvoie \`Err\`.

Garde la section critique courte. \`Drop\` s'exécute à la fin du **scope**, pas au dernier usage.

### Ta tâche

1. Construis un \`Arc<Mutex<u64>>\` qui démarre à \`0\`.
2. Spawne huit threads. Chacun prend son propre \`Arc::clone\` et, mille fois, verrouille et incrémente — le guard délimité à une itération.
3. Fais les join sur les huit, puis affiche le compte final et si le mutex \`is_poisoned()\`.

Sortie attendue :

\`\`\`text
count: 8000
poisoned: false
\`\`\`

### Indices

- \`use std::sync::{Arc, Mutex};\`
- \`*counter.lock().unwrap()\` lit la valeur à la fin.
`,
  },

  "rust-concurrency-5": {
    instructions: `## Plusieurs lecteurs, un écrivain

\`RwLock<T>\` autorise plusieurs guards \`read()\` concurrents ou un seul guard \`write()\` exclusif.

Ce n'est **pas** un upgrade gratuit : il coûte plus par opération que \`Mutex\`, et ne gagne que quand les lectures dominent vraiment *et* sont assez lentes pour se chevaucher. La starvation des écrivains est un risque réel, et la politique d'équité vient de l'OS, pas de std.

\`Mutex\` par défaut ; passe à \`RwLock\` sur un profil.

### Ta tâche

1. Construis un \`Arc<RwLock<Vec<u64>>>\` contenant \`vec![10, 20, 30]\`.
2. Spawne quatre threads lecteurs, chacun prenant \`read()\` et renvoyant \`.len()\`.
3. Fais les join, en sommant les longueurs renvoyées, affiche le total.
4. Prends \`write()\` et push \`40\`, puis affiche le vecteur à travers un nouveau \`read()\`.

Sortie attendue :

\`\`\`text
reads saw: 12
after write: [10, 20, 30, 40]
\`\`\`

### Indices

- \`use std::sync::{Arc, RwLock};\`
- \`*cache.read().unwrap()\` déréférence le guard pour \`{:?}\`.
`,
  },

  "rust-concurrency-6": {
    instructions: `## Ordonne les locks

Un deadlock a besoin de deux threads qui acquièrent deux locks dans des **ordres opposés**. Rust empêche les data races à la compilation ; il n'empêche pas les deadlocks, parce qu'attendre pour toujours est memory-safe.

Le correctif est un **ordre global des locks** : choisis un ordre total sur tes locks et acquiers toujours dans cet ordre, quelle que soit la direction propre de l'opération.

### Ta tâche

1. \`struct Account { id: u32, balance: Mutex<i64> }\`.
2. \`fn transfer(from: &Account, to: &Account, amount: i64)\` — ordonne les deux par \`id\`, verrouille le plus bas en premier, puis applique le débit et le crédit des bons côtés.
3. Construis les comptes \`1\` (solde \`100\`) et \`2\` (solde \`50\`) dans des \`Arc\`.
4. Spawne 100 threads : 50 qui transfèrent \`1\` de a vers b, et 50 qui transfèrent \`1\` de b vers a. Fais les join sur tous.
5. Affiche chaque solde, puis le total.

Sortie attendue :

\`\`\`text
a: 100
b: 50
total: 150
\`\`\`

Sans l'ordre, ce programme deadlock. Avec, le net est zéro et le total est conservé.

### Indices

- \`let (first, second) = if from.id < to.id { (from, to) } else { (to, from) };\`
- Après le verrouillage, vérifie \`from.id == first.id\` pour savoir quel guard débiter.
`,
  },

  "rust-concurrency-7": {
    instructions: `## Compte sans lock, élis un gagnant

Un atomic est lu-modifié-écrit par le hardware sans lock. \`compare_exchange\` écrit la valeur seulement si elle vaut actuellement ce que tu attendais — \`Ok(previous)\` si tu as gagné, \`Err(actual)\` si tu as perdu.

\`Ordering\` n'est pas un bouton de vitesse ; il contraint la façon dont les opérations mémoire environnantes peuvent être réordonnées :

- **\`Relaxed\`** — atomique sur cette valeur seulement. Correct pour un compteur de statistiques.
- **\`Release\`/\`Acquire\`** — publie les données écrites avant un store à quiconque le load.
- **\`SeqCst\`** — un ordre total unique sur lequel tous les threads sont d'accord. Le plus sûr, le plus lent.

### Ta tâche

1. \`Arc<AtomicU64>\` à \`0\`. Spawne huit threads, chacun faisant \`fetch_add(1, Ordering::Relaxed)\` mille fois. Fais les join, puis affiche la valeur avec un load \`Acquire\`.
2. Un \`AtomicBool\` à \`false\`. Appelle \`compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)\` **deux fois**, en affichant chaque résultat avec \`{:?}\`.

Sortie attendue :

\`\`\`text
hits: 8000
first claim: Ok(false)
second claim: Err(true)
\`\`\`

\`Ok(false)\` — on a gagné, et on a remplacé un \`false\`. \`Err(true)\` — on a perdu, et voilà ce qu'on a trouvé.

### Indices

- \`use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};\`
`,
  },

  "rust-concurrency-8": {
    instructions: `## Fan in, puis sens la backpressure

Un channel déplace l'**ownership** entre threads. \`mpsc\`, c'est multi-producteur, consommateur unique : clone le sender, garde un seul receiver.

L'itérateur du receiver ne se termine que quand **chaque** sender a disparu — y compris l'original dans \`main\`, et c'est pour ça que \`drop(tx)\` n'est pas optionnel.

\`channel()\` est non borné : les producteurs n'attendent jamais, et un consommateur lent devient un kill par manque de mémoire. \`sync_channel(n)\` est borné, et ce blocage **est** la backpressure.

### Ta tâche

1. \`mpsc::channel::<u64>()\`. Spawne trois producteurs ; le producteur \`id\` envoie \`id * 10 + n\` pour \`n\` dans \`0..3\`. **Drop le sender original**, puis collecte le receiver dans un \`Vec<u64>\`, trie-le, et affiche-le ainsi que sa longueur.
2. \`mpsc::sync_channel::<u64>(1)\`. Envoie une valeur, affiche si un second \`try_send\` **échoue**, puis \`recv()\` et affiche ce qui est sorti.

Sortie attendue :

\`\`\`text
received: [0, 1, 2, 10, 11, 12, 20, 21, 22]
count: 9
bounded full: true
drained: 1
\`\`\`

Le tri est ce qui rend le fan-in déterministe — l'ordre d'arrivée ne l'est pas.

### Indices

- \`use std::sync::mpsc;\`
- \`rx.iter().collect()\` vide le channel jusqu'à ce que chaque sender ait disparu.
`,
  },
};
