// FR · editor instructions — Indexers & Distributed Systems.
//
// Only the learner-facing `instructions` markdown is localized. Starter code,
// expected output and the hidden AST checks are locale-neutral and always
// come from the English source of truth (../../graders/backend-indexers-distsys.ts) — the same
// split the campaign uses in `src/content/i18n/server.ts`.
//
// CLIENT-SAFE: instructions are shown to the reader. Nothing secret here.

export const backendIndexersDistsysInstructionsFr: Record<string, { instructions: string }> = {
  "backend-indexers-distsys-1": {
    instructions: `## Indexe un ledger, fais-toi tuer, reprends

Un indexer, c'est quatre choses : une **source** d'événements de ledger ordonnés, un **cursor** qui nomme le dernier que tu as terminé, un **processor** qui fold chaque événement dans l'état, et un **store** qui contient les deux. Le cursor vit dans le store — c'est ce qui en fait un checkpoint plutôt qu'une variable.

La reprise est un filtre, pas un seek : \`e.seq <= store.cursor\` est sauté. Le store est un \`Vec\` de paires et pas une \`HashMap\` parce que l'ordre d'itération doit être déterministe pour que la sortie soit reproductible.

Le paramètre \`budget\` tient lieu de crash.

### Ta tâche

1. \`Store::apply\` ajoute \`e.delta\` à \`e.account\`, en poussant le compte s'il n'existe pas encore.
2. \`run\` saute les événements à ou sous \`store.cursor\`, applique au plus \`budget\` des autres, avance \`store.cursor\` à \`e.seq\` après chaque apply, et affiche la ligne de trace.
3. Dans \`main\` : run 1 avec un budget de 5, affiche le checkpoint, affiche la ligne de kill, puis run 2 avec \`usize::MAX\`, affiche le checkpoint, puis affiche la table des comptes.

Sortie attendue :

\`\`\`text
run 1: resume from cursor=0
  seq=1 alice   100
  seq=2 bob      50
  seq=3 alice   -30
  seq=4 carol    20
  seq=5 bob      -5
  checkpoint cursor=5
-- process killed, store survives --
run 2: resume from cursor=5
  seq=6 alice    60
  seq=7 carol    15
  seq=8 bob      25
  checkpoint cursor=8
account balance
alice       130
bob          70
carol        35
\`\`\`

### Indices

- Ligne de trace : \`println!("  seq={} {:<6}{:>5}", e.seq, e.account, e.delta);\`
- Ligne de la table : \`println!("{:<8}{:>7}", account, balance);\`
- Compte les événements appliqués dans un \`done\` local et \`break\` quand il atteint \`budget\` — le \`continue\` pour les événements déjà traités doit venir en premier, sinon le budget se dépense en sauts.
`,
  },

  "backend-indexers-distsys-2": {
    instructions: `## Mesure les deux ordres contre un même crash

Chaque pas d'un indexer, c'est deux écritures — l'effet sur le store, et le commit du cursor — et un crash peut tomber entre les deux.

**Cursor d'abord**, c'est du at-most-once : le checkpoint dit que \`seq=3\` est terminé, le solde n'a jamais bougé, et aucun restart ne le relit. **Effet d'abord**, c'est du at-least-once : l'effet est passé, le checkpoint non, donc le restart rejoue \`seq=3\`. Un seul des deux est récupérable à partir de données que tu as encore.

### Ta tâche

1. \`drain\` parcourt les événements au-delà de \`store.cursor\`. Sous \`Order::CursorFirst\` il commit le cursor **avant** l'effet ; sous \`Order::EffectFirst\`, **après**. Il renvoie \`true\` en atteignant \`e.seq == crash_at\`, en laissant l'état à moitié fini derrière lui, et n'affiche la ligne de trace que pour les pas qui se terminent.
2. Dans \`main\`, pour chaque ordre : construis un \`Store\` neuf, affiche le label, drain avec \`crash_at = 3\`, et s'il a crashé affiche la ligne de restart et drain à nouveau avec \`crash_at = 0\`.
3. Puis affiche la table de résumé et les deux lignes de verdict.

Sortie attendue :

\`\`\`text
cursor-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=3
  seq=4 total=70 cursor=4
  seq=5 total=120 cursor=5
effect-first
  seq=1 total=10 cursor=1
  seq=2 total=30 cursor=2
  CRASH during seq=3, restart from cursor=2
  seq=3 total=90 cursor=3
  seq=4 total=130 cursor=4
  seq=5 total=180 cursor=5
ordering      applies  total  expected
cursor-first        4    120       150
effect-first        6    180       150
cursor-first lost seq=3: no restart can recover it
effect-first applied seq=3 twice: dedupe can recover it
\`\`\`

### Indices

- Trace : \`println!("  seq={} total={} cursor={}", e.seq, store.total, store.cursor);\`
- Ligne de résumé : \`println!("{:<14}{:>7}{:>7}{:>10}", label(*order), applies, total, expected);\`
- \`for order in [Order::CursorFirst, Order::EffectFirst]\` itère un tableau par valeur parce que \`Order\` est \`Copy\`.
- Collecte \`(order, store.total, store.applies)\` dans un \`Vec\` pour que la table s'affiche après les deux runs.
`,
  },

  "backend-indexers-distsys-3": {
    instructions: `## Rends le processor idempotent

At-least-once signifie que le même id d'événement peut arriver deux fois, que les événements peuvent arriver dans le désordre, et que tout le stream peut être relivré après un restart. Les trois se produisent dans \`delivered\`.

L'idempotence est une propriété du processor, pas du transport : garde les ids d'événements appliqués dans le même store que les données, vérifie avant l'effet, enregistre dans la même écriture. La clé de dedupe doit être l'id d'événement assigné par le producteur : les ids 2 et 5 sont des paiements de 40 à bob identiques octet pour octet et les deux doivent passer, alors que l'id 2 qui arrive deux fois doit passer une seule fois. Un hash de payload ne peut pas distinguer ces deux cas.

### Ta tâche

1. \`apply_naive\` crédite sans condition.
2. \`apply_idempotent\` sort tôt quand \`e.id\` est déjà dans \`self.seen\` ; sinon il enregistre l'id et crédite.
3. Dans \`main\`, passe \`delivered\` aux deux stores deux fois, en affichant une ligne par pass, puis affiche le total exactly-once, la table des soldes de l'idempotent, et la taille du seen-set.

Sortie attendue :

\`\`\`text
pass  naive  idempotent
   1    305         265
   2    610         265
exactly-once total: 265
account balance
alice       125
bob          80
carol        60
distinct event ids retained: 5
\`\`\`

### Indices

- Ligne de pass : \`println!("{:>4}{:>7}{:>12}", pass, naive.total(), safe.total());\`
- \`unique.iter().map(|e| e.amount).sum::<i64>()\` donne le total exactly-once.
- Le seen-set est non borné ici. En production, c'est un index unique sur l'id d'événement, ou une fenêtre calée sur le cursor.
`,
  },

  "backend-indexers-distsys-4": {
    instructions: `## Rollback jusqu'au fork, réapplique la branche

Le **parent hash** d'un bloc, pas sa hauteur, te dit s'il étend ta chaîne. \`b3\` arrive à la hauteur 3 avec le parent \`a2\` alors que la head est \`a5\` — sur la seule hauteur, ça ressemble à un doublon ou à un trou.

Le rollback tourne de la head vers le bas, en appliquant l'inverse de l'effet de chaque bloc, et s'arrête au point de fork. L'ordre inverse compte dès que les effets sont non commutatifs.

### Ta tâche

1. \`apply\` crédite le bloc, le pousse sur la chaîne, et affiche la ligne d'apply.
2. \`rollback_to\` dépile les blocs au-dessus de \`height\` depuis la head vers le bas, en créditant le delta inverse de chacun et en affichant une ligne de rollback.
3. Dans \`main\` : indexe la chaîne canonique et \`report\` ; affiche la ligne de reorg ; trouve le fork en localisant \`branch[0].parent\` dans la chaîne et en prenant la hauteur de ce bloc ; \`rollback_to\` jusque-là ; affiche la ligne du point de fork ; applique la branche ; \`report\` ; affiche la ligne de clôture sur carol.

Sortie attendue :

\`\`\`text
  apply    a1 height=1 alice +100
  apply    a2 height=2 bob +50
  apply    a3 height=3 alice +30
  apply    a4 height=4 carol +20
  apply    a5 height=5 bob +10
head=a5 height=5
  alice    130
  bob       60
  carol     20
b3 arrives: parent=a2, our head=a5 -> reorg
  rollback a5 height=5 bob -10
  rollback a4 height=4 carol -20
  rollback a3 height=3 alice -30
  fork point height=2 hash=a2
  apply    b3 height=3 alice +5
  apply    b4 height=4 dave +70
  apply    b5 height=5 bob +10
  apply    b6 height=6 alice +15
head=b6 height=6
  alice    120
  bob       60
  carol      0
  dave      70
carol was credited in a4 and confirmed for 2 blocks; that credit is now gone
\`\`\`

### Indices

- \`println!("  apply    {} height={} {} {:+}", b.hash, b.height, b.account, b.delta);\` — \`{:+}\` affiche toujours le signe.
- \`while let Some(b) = self.chain.last().copied()\` te donne la head sans garder un borrow à travers le \`pop\`.
- \`self.chain.iter().position(|b| b.hash == branch[0].parent).map(|i| self.chain[i].height).unwrap_or(0)\`.
`,
  },

  "backend-indexers-distsys-5": {
    instructions: `## Encode la machine, et fais-la rejeter

Une colonne de statut avec six valeurs string n'est pas une machine à états. La machine, c'est la relation de transition \`allowed(from, to)\`, et sa valeur tient entièrement dans ce pour quoi elle renvoie false.

Le catch-all \`_ => false\` est le design : chaque arête que tu n'as pas écrite est refusée par construction. Les états terminaux sont ceux sans bras sortant — \`Confirmed\` et \`Failed\` n'en ont aucun, et c'est comme ça qu'un webhook dupliqué en retard échoue à ressusciter une transaction confirmée.

\`Submitted -> Confirmed\` est refusée même si c'est le résultat que tout le monde veut : sauter \`Pending\` détruit la trace du passage de la transaction dans la mempool.

### Ta tâche

1. \`allowed\` matche sur \`(from, to)\`. Arêtes légales : \`Received -> Validating\`, \`Validating -> Submitted\`, \`Submitted -> Pending\`, \`Pending -> Confirmed\`, et \`-> Failed\` depuis chacun de \`Received\`, \`Validating\`, \`Submitted\` et \`Pending\`. Tout le reste est \`_ => false\`.
2. \`Tx::transition\` applique le mouvement si \`allowed\`, sinon incrémente \`rejected\` et laisse l'état intact — en affichant la ligne from/to/verdict dans les deux cas.
3. Dans \`main\`, affiche l'en-tête, déroule chaque transition proposée, affiche la ligne finale, puis compte les arêtes sortantes de \`Confirmed\` et \`Failed\`.

Sortie attendue :

\`\`\`text
from        -> to          verdict
Received    -> Validating  accepted
Validating  -> Submitted   accepted
Submitted   -> Confirmed   REJECTED
Submitted   -> Pending     accepted
Pending     -> Confirmed   accepted
Confirmed   -> Failed      REJECTED
Confirmed   -> Pending     REJECTED
final=Confirmed rejected=3
Confirmed has 0 outgoing transitions
Failed has 0 outgoing transitions
\`\`\`

### Indices

- Ligne de verdict : \`println!("{:<11} -> {:<11} accepted", name(from), name(to));\`
- Compte les arêtes sortantes en filtrant les six statuts à travers \`allowed\` : \`[..].iter().filter(|t| allowed(*s, **t)).count()\`.
- Capture \`let from = self.status;\` avant de muter, pour que la ligne affiche l'état que tu as quitté.
`,
  },

  "backend-indexers-distsys-6": {
    instructions: `## Calcule le chevauchement, puis partitionne le cluster

La garantie de chevauchement est strictement \`R + W > N\`. La ligne \`N=5, R=2, W=3\` fait exactement 5 et ne chevauche **pas** — un quorum de lecture de deux peut être entièrement disjoint des trois nœuds qui ont pris l'écriture, et renvoie des données stale sans erreur.

Une partition ne demande pas la permission. Avec N=5, W=3 et un split 3|2, le côté majoritaire réunit encore un quorum ; le côté minoritaire n'atteint ni R=3 ni W=3 et refuse les deux. Ce refus est le choix CP, et tu l'as fait quand tu as choisi R et W.

Les lectures se résolvent par **numéro de version**, pas par timestamp d'horloge murale.

### Ta tâche

1. \`write\` renvoie false à moins que le côté joignable ait au moins \`w\` nœuds ; sinon il pose \`version\` et \`value\` sur chacun d'eux et renvoie true.
2. \`read\` renvoie \`None\` à moins que le côté ait au moins \`r\` nœuds ; sinon il renvoie le plus haut \`(version, value)\` vu.
3. Dans \`main\` : affiche la table de quorum pour \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\` — N, R, W, R+W, si \`r + w > n\`, et les pannes que chaque quorum tolère encore (\`n - w\` en écriture, \`n - r\` en lecture). Puis lance la partition 3|2 à R=3, W=3 : tente une écriture de version 2 / valeur 250 de chaque côté, lis de chaque côté, et affiche la ligne de clôture AP.

Sortie attendue :

\`\`\`text
 N  R  W  R+W  overlaps  write survives  read survives
 3  1  1    2  no                     2              2
 3  2  2    4  yes                    1              1
 3  1  3    4  yes                    0              2
 3  3  1    4  yes                    2              0
 5  2  3    5  no                     2              3
 5  3  3    6  yes                    2              2
N=5 R=3 W=3, partition {n1,n2,n3} | {n4,n5}
  majority write v=2: ok
  minority write v=2: refused
  majority read: version=2 value=250
  minority read: refused
  minority still holds version=1 on n4,n5: serving that read is the AP choice
\`\`\`

### Indices

- Ligne de la table : \`println!("{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}", n, r, w, r + w, if overlaps { "yes" } else { "no" }, n - w, n - r);\`
- Les accolades littérales de la ligne de partition s'échappent en \`{{\` et \`}}\`.
- \`minority.iter().map(|n| n.id).collect::<Vec<_>>().join(",")\` construit la liste des nœuds.
- \`read\` fold dans un tuple \`best: (u32, i64)\`, en le remplaçant dès que \`n.version > best.0\` — la version la plus haute gagne, et un timestamp d'horloge murale ne serait pas un ordre total entre nœuds.
`,
  },

  "backend-indexers-distsys-7": {
    instructions: `## Estampille une trace avec les deux horloges

Une horloge de Lamport, c'est deux règles : incrémente ton compteur à chaque événement, et à la réception d'un message, monte ton compteur au moins jusqu'à celui de l'expéditeur avant d'incrémenter. Ça garantit que \`a -> b\` implique \`L(a) < L(b)\` — et rien de plus. \`c1\` a L=1, \`a2\` a L=2, et ils sont concurrents.

Une vector clock garde un compteur par nœud et prend le max élément par élément à la réception. \`a <= b\` composante par composante avec au moins une strictement plus petite signifie \`a -> b\` ; ni l'une ni l'autre direction signifie **concurrents**, un verdict que Lamport ne peut structurellement pas produire.

### Ta tâche

1. \`happens_before\` renvoie true quand chaque composante de \`a\` est \`<=\` celle de \`b\` et qu'au moins une est strictement plus petite.
2. Parcours les événements dans l'ordre. Sur une livraison (\`Some(src)\`), monte le compteur de Lamport de ce nœud à \`lamport_of[src]\` s'il est plus grand, et prends le max élément par élément de \`vector_of[src]\`. Puis incrémente le compteur de Lamport du nœud et sa propre composante du vecteur. Enregistre les deux stamps dans \`lamport_of[i]\` / \`vector_of[i]\` et affiche la ligne.
3. Affiche les lignes de verdict pour les paires d'indices d'événement \`(1,3)\`, \`(4,1)\` et \`(2,4)\` — c'est-à-dire \`a2,b2\`, \`c1,a2\` et \`b1,c1\` — avec le signe de comparaison Lamport et le verdict vectoriel. Termine par la ligne de résumé.

Sortie attendue :

\`\`\`text
ev  node  lamport  vector
a1  A     1        [1,0,0]
a2  A     2        [2,0,0]
b1  B     1        [0,1,0]
b2  B     3        [2,2,0]
c1  C     1        [0,0,1]
b3  B     4        [2,3,0]
c2  C     5        [2,3,2]
pair    lamport  vector verdict
a2,b2   2 < 3    happens-before
c1,a2   1 < 2    concurrent
b1,c1   1 = 1    concurrent
a smaller lamport stamp does not mean caused-by: see c1,a2
\`\`\`

### Indices

- Ligne de trace : \`println!("{}  {}     {}        [{},{},{}]", e.label, ["A", "B", "C"][e.node], lamport_of[i], vector_of[i][0], vector_of[i][1], vector_of[i][2]);\`
- Ligne de verdict : \`println!("{},{}   {} {} {}    {}", ...)\` avec le signe calculé comme \`"<"\`, \`">"\` ou \`"="\`.
- \`for (i, e) in events.iter().enumerate()\` te donne l'indice sous lequel enregistrer les stamps.
- Deux paires de tableaux : les horloges **vivantes** \`lamport: [u64; 3]\` et \`vector: [[u64; 3]; 3]\`, indexées par nœud — \`lamport[e.node] += 1\`, \`vector[e.node][e.node] += 1\` — et les stamps par événement \`lamport_of\` / \`vector_of\`, indexés par événement, dans lesquels tu copies l'horloge vivante après avoir incrémenté.
`,
  },
};
