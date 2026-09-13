import type { LessonStep } from "@/content/steps";

// FR · Indexers & Distributed Systems.
//
// Overlay for ../../steps/backend-indexers-distsys.ts — same slugs, same step count and order.
// Structure (kind, quiz answer index, fill choices/answer/file, ```text```
// output blocks) must stay identical to the English source; `check:advanced`
// enforces it.

export const backendIndexersDistsysStepsFr: Record<string, LessonStep[]> = {
  "backend-indexers-distsys-1": [
    {
      kind: "theory",
      body: `Un indexer, c'est quatre choses et rien de plus.

| partie | rôle |
| --- | --- |
| source | des événements de ledger ordonnés, replayables depuis n'importe quel point |
| cursor | le numéro de séquence du dernier événement que tu as terminé |
| processor | fold un événement dans l'état |
| store | contient l'état foldé **et** le cursor |

La dernière ligne est celle qui compte. Si le cursor vit dans une variable locale, c'est une barre de progression ; s'il vit dans le même store que les données, c'est un checkpoint, et un checkpoint est la seule chose qui survit à un \`SIGKILL\`.

\`\`\`rust
struct Store {
    balances: Vec<(&'static str, i64)>,
    cursor: u64,
}
\`\`\``,
    },
    {
      kind: "theory",
      body: `La reprise est un **filtre**, pas un seek :

\`\`\`rust
if e.seq <= store.cursor {
    continue;
}
\`\`\`

Ce seul prédicat, c'est toute l'histoire du restart. C'est aussi pour ça que le contrat de la source est « replayable depuis un point arbitraire » — un feed que tu ne peux consommer qu'une seule fois t'oblige à rendre le cursor et l'effet atomiques, ce que tu ne peux pas faire entre deux systèmes.

Le processor est un fold. Même source, même cursor de départ, même état final — c'est ce qui transforme la ré-indexation d'un incident en opération de routine que tu lances un mardi.

L'ordre d'itération du store doit être déterministe, sinon la sortie n'est pas reproductible, et un indexer non reproductible ne peut pas être diffé contre un rebuild. C'est pour ça que le store ici est un \`Vec\` de paires et pas une \`HashMap\` : l'ordre d'itération d'une \`HashMap\` est randomisé par processus, volontairement.`,
    },
    {
      kind: "quiz",
      question:
        "Le store contient des soldes foldés. Peux-tu reconstruire le cursor en le scannant après un crash ?",
      options: [
        "Non — le fold a jeté les numéros de séquence, donc le plus haut que tu as traité n'est pas récupérable à partir des soldes",
        "Oui — prends le numéro de séquence maximal stocké sur chaque ligne de compte",
        "Oui — le nombre d'événements appliqués est égal au cursor, donc compte les lignes",
      ],
      answer: 0,
      explain:
        "Le cursor n'est pas un cache de quelque chose que les données savent déjà. C'est un état indépendant, et c'est précisément pour ça qu'il faut l'écrire quelque part.",
    },
    {
      kind: "fill",
      prompt:
        "Saute chaque événement que le store a déjà foldé. Le checkpoint nomme le dernier événement **terminé**, donc cet événement lui-même ne doit pas être rejoué.",
      file: "main.rs",
      before: "for e in source {\n        if ",
      after: " {\n            continue;\n        }",
      choices: [
        "e.seq <= store.cursor",
        "e.seq < store.cursor",
        "e.seq == store.cursor",
      ],
      explain:
        "`<` rejoue l'événement du checkpoint à chaque restart — un doublon pile à la couture, le genre le plus dur à repérer. `==` saute un événement et retraite tout ce qui est en dessous.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Garder la progression en mémoire et redémarrer depuis la séquence 0 après un crash est sûr quand :",
      options: [
        "chaque effet du processor est idempotent, donc rejouer tout l'historique converge vers le même état",
        "le ledger est append-only, puisque rien sous la head ne peut changer",
        "le restart arrive assez vite pour qu'aucun nouvel événement ne soit arrivé",
      ],
      answer: 0,
      explain:
        "Append-only ne dit rien de tes effets de bord : un `+= delta` appliqué deux fois est faux, quelle que soit l'immutabilité de la source. L'idempotence, ce sont les trois prochaines leçons.",
    },
    {
      kind: "editor",
      intro: `### Indexe un ledger, fais-toi tuer, reprends

1. \`Store::apply\` ajoute \`e.delta\` à \`e.account\`, en poussant le compte s'il n'existe pas encore.
2. \`run\` saute les événements à ou sous \`store.cursor\`, applique au plus \`budget\` des autres, avance \`store.cursor\` à \`e.seq\` après chaque apply, et affiche la ligne de trace.
3. Dans \`main\` : run 1 avec un budget de 5 (le crash), affiche le checkpoint, puis run 2 sans limite, puis affiche la table des comptes.

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

La ligne de trace est \`"  seq={} {:<6}{:>5}"\` ; la ligne de la table est \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-2": [
    {
      kind: "theory",
      body: `Chaque pas d'un indexer, c'est **deux écritures** — l'effet sur le store, et le commit du cursor. Un crash peut tomber entre les deux, et leur ordre décide du mode de défaillance que tu obtiens. Il n'y a pas de troisième option, à moins d'une transaction qui couvre les deux.

**Cursor d'abord** donne du at-most-once. Le checkpoint dit que \`seq=3\` est terminé, le solde n'a jamais bougé, aucun restart ne le relit. Le run se termine avec \`total=120\` contre un \`150\` attendu et ne signale aucune erreur.

**Effet d'abord** donne du at-least-once. L'effet est passé, le checkpoint non, donc le restart rejoue \`seq=3\` et arrive à \`180\`. Faux — mais faux dans une direction qu'une clé de dedupe peut corriger.`,
    },
    {
      kind: "theory",
      body: `| ordre | crash entre les écritures | récupérable ? |
| --- | --- | --- |
| cursor d'abord | événement sauté en silence | non — ré-index complet |
| effet d'abord | événement appliqué deux fois | oui — dedupe sur l'id de l'événement |

At-least-once est donc la garantie de livraison sur laquelle tu **construis**, pas une que tu tolères. « Exactly-once » dans un message broker signifie livraison at-least-once plus traitement idempotent chez le consommateur ; le broker te vend la moitié que tu dois encore écrire.

Si l'effet et le cursor vivent dans la même base, une transaction couvrant les deux fait disparaître le problème entièrement. La question de l'ordre est ce que tu affrontes dès qu'ils ne vivent plus ensemble — les lignes dans Postgres, le cursor dans Redis — et cette séparation est généralement introduite pour une raison de latence, par quelqu'un qui ne savait pas qu'il choisissait un mode de défaillance.`,
    },
    {
      kind: "quiz",
      question:
        "« Commit le cursor d'abord, et tu ne fais jamais le travail deux fois. » Qu'est-ce qui cloche là-dedans ?",
      options: [
        "Tu ne le fais jamais deux fois parce que parfois tu ne le fais pas du tout — l'événement sauté est irrécupérable et rapporté comme un succès",
        "Rien ne cloche ; c'est le bon ordre, et les doublons sont la défaillance la plus grave",
        "C'est faux seulement parce que l'écriture du cursor est plus lente que celle de l'effet",
      ],
      answer: 0,
      explain:
        "Le run sort avec 0, le log est propre, et il manque un événement au total. Tu l'apprends par un job de réconciliation, des semaines plus tard, si tu en as un.",
    },
    {
      kind: "fill",
      prompt:
        "Effet d'abord : le commit du cursor est la **dernière** écriture du bras, après le point de crash. Commit la séquence que tu viens réellement d'appliquer.",
      file: "main.rs",
      before:
        "store.total += e.amount;\n            store.applies += 1;\n            if e.seq == crash_at {\n                return true;\n            }\n            ",
      after: "\n        }",
      choices: [
        "store.cursor = e.seq;",
        "store.cursor += 1;",
        "store.cursor = e.seq - 1;",
      ],
      explain:
        "`+= 1` suppose que les numéros de séquence sont contigus — un seul trou dans le feed et le cursor traîne derrière pour toujours. `- 1` relit l'événement que tu viens de terminer à chaque restart.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi un événement perdu et un événement dupliqué ne sont-ils pas des bugs symétriques ?",
      options: [
        "Le doublon est récupérable à partir de données que tu as encore ; la perte exige une source que tu ne peux peut-être plus rejouer",
        "Ils sont symétriques — les deux laissent le total faux du montant d'un événement",
        "Le doublon est pire, parce qu'il corrompt l'état alors que la perte ne fait que le retarder",
      ],
      answer: 0,
      explain:
        "Un doublon est un bug que tu corriges vers l'avant avec une clé de dedupe. Une perte est un bug que tu ne corriges qu'en relisant l'historique — en supposant que la fenêtre de rétention n'est pas passée.",
    },
    {
      kind: "editor",
      intro: `### Mesure les deux ordres contre un même crash

1. \`drain\` parcourt les événements au-delà de \`store.cursor\`. Sous \`CursorFirst\` il commit le cursor **avant** l'effet ; sous \`EffectFirst\`, **après**. Il renvoie \`true\` quand il atteint \`e.seq == crash_at\`, en laissant l'état à moitié fini derrière lui.
2. Dans \`main\`, lance les deux ordres avec \`crash_at = 3\`, redémarre chacun après le crash (\`crash_at = 0\` ne matche jamais), puis affiche la table de résumé et les deux lignes de verdict.

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

La ligne de trace ne s'affiche que quand le pas se termine ; la ligne de résumé est \`"{:<14}{:>7}{:>7}{:>10}"\`.`,
    },
  ],

  "backend-indexers-distsys-3": [
    {
      kind: "theory",
      body: `At-least-once signifie que trois choses distinctes peuvent arriver à ton consommateur, et les trois apparaissent dans la slice \`delivered\` de cette leçon :

- le même id d'événement arrive **deux fois** (id 2),
- les événements arrivent **dans le désordre** (id 3 avant id 2),
- tout le stream est **relivré** après un restart (pass 2).

L'idempotence est une propriété du *processor*, pas du transport. Garde l'ensemble des ids d'événements appliqués dans le même store que les données, vérifie-le avant l'effet, et enregistre-le dans la même écriture.

\`\`\`rust
fn apply_idempotent(&mut self, e: Event) {
    if self.seen.contains(&e.id) {
        return;
    }
    self.seen.push(e.id);
    self.credit(e.account, e.amount);
}
\`\`\`

Le processor naïf grimpe de 305 → 610 sur deux passes. L'idempotent reste à 265 — le total exactly-once — les deux fois.`,
    },
    {
      kind: "theory",
      body: `**La clé de dedupe doit être l'id d'événement assigné par le producteur.** Hasher le payload confond deux événements légitimement identiques : les ids 2 et 5 sont tous les deux \`bob, 40\` et sont deux paiements différents, alors que la seconde livraison de l'id 2 est le même paiement deux fois. Un hash ne voit qu'un cas ; l'id voit les deux.

**L'indépendance à l'ordre et l'indépendance aux doublons sont deux propriétés séparées.** Créditer un solde est commutatif, donc réordonner ne coûte rien dans cette leçon. Une opération \`set\` n'est pas commutative, et a besoin d'une garde de version ou de séquence — « applique seulement si \`e.version > row.version\` » — par-dessus le dedupe.

**Le seen-set est non borné ici et ne doit pas l'être en production.** Borne-le avec un index unique sur l'id d'événement (l'insert échoue, la transaction rollback, l'effet ne passe jamais), ou avec une fenêtre calée sur le cursor, puisque rien sous le checkpoint ne peut légitimement réapparaître.`,
    },
    {
      kind: "quiz",
      question:
        "Ton broker annonce une livraison exactly-once. Qu'est-ce qui doit encore être écrit côté consommateur ?",
      options: [
        "Le dedupe côté consommateur — exactly-once, c'est une livraison at-least-once plus un traitement idempotent, et le broker ne fournit que la première moitié",
        "Rien, à condition que le consommateur acquitte chaque message avant de le traiter",
        "Seulement une politique de retry ; la transaction du broker couvre les écritures du consommateur",
      ],
      answer: 0,
      explain:
        "La transaction d'un broker couvre son propre log. Elle ne peut pas couvrir une écriture dans ta base, donc dès que ton effet quitte le broker, la garantie s'arrête.",
    },
    {
      kind: "fill",
      prompt:
        "Dedupe sur l'identité de l'événement assignée par le producteur, pas sur ce qu'il se trouve dire.",
      file: "main.rs",
      before: "fn apply_idempotent(&mut self, e: Event) {\n        if self.seen.contains(",
      after: ") {\n            return;\n        }",
      choices: ["&e.id", "&e.amount", "&e.account"],
      explain:
        "Dedupe sur le montant et l'id 5 — un second paiement bien réel de 40 à bob — disparaît avec l'argent. Dedupe sur le compte et tu appliques exactement un événement par compte, à jamais.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Pourquoi un hash du payload de l'événement est-il une mauvaise clé de dedupe pour un feed de paiements ?",
      options: [
        "Deux virements légitimement identiques ont le même hash, donc le second est jeté en silence",
        "Hasher est trop lent pour tourner sur chaque événement à volume de production",
        "Les hashs de payload collisionnent assez souvent pour confondre des événements sans rapport",
      ],
      answer: 0,
      explain:
        "La défaillance n'est pas une collision au sens cryptographique — les deux événements sont réellement identiques octet pour octet. Ce sont quand même deux paiements différents.",
    },
    {
      kind: "editor",
      intro: `### Rends le processor idempotent

1. \`apply_naive\` crédite sans condition.
2. \`apply_idempotent\` sort tôt quand \`e.id\` est déjà dans \`self.seen\` ; sinon il enregistre l'id et crédite.
3. Dans \`main\`, passe \`delivered\` aux deux stores **deux fois**, en affichant une ligne par pass, puis le total exactly-once, la table des soldes de l'idempotent et la taille du seen-set.

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

La ligne de pass est \`"{:>4}{:>7}{:>12}"\` ; la ligne de solde est \`"{:<8}{:>7}"\`.`,
    },
  ],

  "backend-indexers-distsys-4": [
    {
      kind: "theory",
      body: `Le **parent hash** d'un bloc, pas sa hauteur, te dit s'il étend ta chaîne.

\`\`\`text
genesis - a1 - a2 - a3 - a4 - a5          <- head indexée
               \\
                b3 - b4 - b5 - b6         <- arrive, parent = a2
\`\`\`

\`b3\` arrive à la hauteur 3 alors que la head est \`a5\`. Sur la seule hauteur, ça ressemble à un doublon, ou à un feed qui a sauté en arrière. Sur le \`parent\`, c'est sans ambiguïté : il fork sous la head, donc trois de tes blocs sont maintenant orphelins.

Le rollback tourne **de la head vers le bas**, en appliquant l'inverse de l'effet de chaque bloc, et s'arrête au point de fork. L'ordre inverse compte dès que les effets cessent de commuter ; dérouler vers l'avant produit un store qu'aucune branche n'a jamais eu.`,
    },
    {
      kind: "theory",
      body: `Défaire exige que tu aies gardé assez pour inverser. Stocker les blocs appliqués à côté des soldes est la version pas chère — un vrai indexer garde un undo log ou des snapshots par hauteur, parce que « recalcule depuis la genesis » n'est pas un temps de réponse.

**Confirmé n'est pas final.** Les 20 de carol ont été crédités à la hauteur 4 et ont tenu deux blocs ; après le reorg son solde est 0 et la ligne ne survit que comme preuve. La finalité est la profondeur à laquelle tu *cesses d'accepter de dérouler* — une politique que tu choisis, pas une propriété que le bloc porte.

C'est de ça que pending-versus-confirmed te protège vraiment. Tout ce que tu as exposé comme confirmé au-dessus du fork doit maintenant être rétracté en aval, et c'est pour ça qu'un indexer émet des événements de reorg et pas seulement des mises à jour de lignes : un consommateur qui ne voit que le nouveau solde n'a aucun moyen de distinguer une correction d'un paiement.`,
    },
    {
      kind: "quiz",
      question:
        "La head est `a5`. `b6` arrive à la hauteur 6 sur une branche qui fork à `a2`. Pourquoi ne pas simplement fast-forward sur la chaîne la plus longue ?",
      options: [
        "Appliquer `b3..b6` par-dessus `a5` garde les effets de `a3`, `a4` et `a5`, produisant un état qu'aucune chaîne n'a jamais eu",
        "C'est bon tant que la branche est strictement plus longue — c'est la règle de la chaîne la plus longue",
        "C'est bon, mais seulement après avoir re-vérifié les signatures de `b3..b6`",
      ],
      answer: 0,
      explain:
        "La règle de la chaîne la plus longue dit quelle branche est canonique. Elle ne dit rien sur la façon d'y amener ton store, et ton store retient en ce moment trois blocs d'effets que cette branche n'a jamais contenus.",
    },
    {
      kind: "fill",
      prompt:
        "Trouve le point de fork : le bloc de ta chaîne que la branche entrante nomme comme parent.",
      file: "main.rs",
      before: "let fork = ix\n        .chain\n        .iter()\n        .position(|b| ",
      after: ")\n        .map(|i| ix.chain[i].height)\n        .unwrap_or(0);",
      choices: [
        "b.hash == branch[0].parent",
        "b.height == branch[0].height",
        "b.parent == branch[0].parent",
      ],
      explain:
        "Matcher sur la hauteur trouve `a3` — le bloc en train de devenir orphelin — et rollback jusqu'à 3, en laissant `a3` appliqué. Matcher parent contre parent trouve le frère `a3` pour la même raison : les deux nomment `a2`.",
      answer: 0,
    },
    {
      kind: "quiz",
      question: "Que te donnent vraiment « six confirmations » ?",
      options: [
        "Un coût de réversion assez élevé pour que tu choisisses d'arrêter de dérouler — un argument économique, pas une garantie",
        "Une garantie du protocole qu'un bloc à cette profondeur ne peut plus être remplacé",
        "Une garantie en fonctionnement normal, caduque seulement si la chaîne est attaquée",
      ],
      answer: 0,
      explain:
        "Six est un seuil que quelqu'un a choisi. Ton indexer a toujours besoin d'un chemin de rollback, parce que le nombre qui rendait ça non rentable hier est un paramètre d'un marché.",
    },
    {
      kind: "editor",
      intro: `### Rollback jusqu'au fork, réapplique la branche

1. \`apply\` crédite le bloc, le pousse sur la chaîne, et affiche la ligne d'apply.
2. \`rollback_to\` dépile les blocs au-dessus de \`height\` depuis la head vers le bas, en créditant le delta **inverse** de chacun et en affichant une ligne de rollback.
3. Dans \`main\` : indexe la chaîne canonique et fais le rapport ; trouve le fork en localisant \`branch[0].parent\` dans la chaîne ; rollback ; applique la branche ; rapport ; affiche la ligne de clôture sur carol.

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

Les deux lignes de trace utilisent \`{:+}\` pour le delta, pour que le signe soit toujours affiché.`,
    },
  ],

  "backend-indexers-distsys-5": [
    {
      kind: "theory",
      body: `Une colonne de statut avec six valeurs string n'est pas une machine à états. La machine, c'est la **relation de transition** :

\`\`\`rust
fn allowed(from: Status, to: Status) -> bool {
    match (from, to) {
        (Status::Received, Status::Validating) => true,
        (Status::Validating, Status::Submitted) => true,
        (Status::Submitted, Status::Pending) => true,
        (Status::Pending, Status::Confirmed) => true,
        // ... chaque état peut échouer ...
        _ => false,
    }
}
\`\`\`

Sa valeur tient entièrement dans ce pour quoi elle renvoie **false**. Le catch-all \`_ => false\` est le design, pas une formalité : chaque arête que tu n'as pas écrite est refusée par construction, donc ajouter un septième statut plus tard échoue fermé au lieu d'autoriser en silence une douzaine de nouvelles transitions.`,
    },
    {
      kind: "theory",
      body: `**Les états terminaux sont ceux sans bras sortant.** \`Confirmed\` et \`Failed\` rapportent chacun 0 transition sortante, et c'est comme ça qu'un webhook dupliqué en retard qui tente de ramener une transaction confirmée à \`Pending\` se fait rejeter au lieu de la ressusciter.

**Une transition rejetée doit laisser l'état inchangé et être comptée.** Trois des sept propositions ici sont refusées et la transaction finit quand même en \`Confirmed\`. Un rejet non loggé est un incident que tu enquêteras plus tard à partir de zéro, parce que la seule preuve qu'il a eu lieu était une branche qui a retourné tôt.

**\`Submitted → Confirmed\` est refusée** même si c'est le résultat que tout le monde veut. Sauter \`Pending\` signifie qu'il n'y a aucune trace du passage de la transaction dans la mempool, et un client qui poll pour \`Pending\` ne la voit jamais — donc sa logique de retry, son timer et son UI se calent tous sur une arête qui n'a jamais tiré.`,
    },
    {
      kind: "quiz",
      question:
        "La transaction finit `Confirmed` dans les deux cas. Que te coûte de sauter `Submitted → Pending → Confirmed` ?",
      options: [
        "L'audit trail, et chaque consommateur qui surveille l'arête intermédiaire plutôt que l'état final",
        "Rien de mesurable — les états intermédiaires existent pour l'UI, et l'état terminal fait autorité",
        "Seulement les métriques de temps entre les deux états",
      ],
      answer: 0,
      explain:
        "La question de la réconciliation n'est pas « est-elle confirmée » mais « comment est-elle arrivée là ». Sans la ligne intermédiaire, une transaction jamais diffusée et une minée en une seconde sont identiques.",
    },
    {
      kind: "fill",
      prompt:
        "Ferme la table de transitions. Chaque arête non écrite ci-dessus doit être refusée, et les états terminaux doivent rester terminaux.",
      file: "main.rs",
      before: "(Status::Pending, Status::Failed) => true,\n        ",
      after: "\n    }",
      choices: ["_ => false,", "(_, Status::Failed) => true,", "_ => true,"],
      explain:
        "`(_, Status::Failed) => true` se lit « tout peut échouer » et autorise discrètement `Confirmed → Failed`, détruisant la terminalité. `_ => true` inverse la machine en une table des choses que tu te trouves interdire.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Où va la vérification de transition — dans le handler de l'API, ou à côté de l'état ?",
      options: [
        "À côté de l'état, parce que le handler de reorg, le job de backfill et le fix manuel écrivent tous la même colonne et aucun d'eux ne passe par le handler",
        "Dans le handler de l'API, puisque c'est là qu'arrive chaque requête externe et que l'erreur doit être renvoyée",
        "Les deux, dupliquée, pour que le handler puisse renvoyer un 409 sans aller-retour",
      ],
      answer: 0,
      explain:
        "Une règle imposée à un seul de plusieurs points d'entrée n'est pas une règle, c'est une convention. Les writers qui la contournent sont exactement ceux qui tournent sans surveillance à 3 h du matin.",
    },
    {
      kind: "editor",
      intro: `### Encode la machine, et fais-la rejeter

1. \`allowed\` matche sur \`(from, to)\` : un bras par arête légale, \`_ => false\` pour tout le reste. \`Confirmed\` et \`Failed\` n'ont **aucun** bras sortant.
2. \`Tx::transition\` applique le mouvement si \`allowed\`, sinon incrémente \`rejected\` et laisse l'état intact — en affichant la ligne from/to/verdict dans les deux cas.
3. Dans \`main\`, déroule chaque transition proposée, affiche la ligne finale, puis compte les arêtes sortantes de chaque état terminal.

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

La ligne de verdict est \`"{:<11} -> {:<11} accepted"\` / \`... REJECTED\`.`,
    },
  ],

  "backend-indexers-distsys-6": [
    {
      kind: "theory",
      body: `La garantie de chevauchement est strictement \`R + W > N\`. Pas \`>=\`.

| N | R | W | R+W | chevauche | write survit à | read survit à |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | 1 | 1 | 2 | non | 2 | 2 |
| 3 | 2 | 2 | 4 | oui | 1 | 1 |
| 3 | 1 | 3 | 4 | oui | 0 | 2 |
| 3 | 3 | 1 | 4 | oui | 2 | 0 |
| 5 | 2 | 3 | 5 | **non** | 2 | 3 |
| 5 | 3 | 3 | 6 | oui | 2 | 2 |

La cinquième ligne est la configuration que les gens mettent en prod en la croyant sûre. R+W est égal à N, donc un quorum de lecture de deux nœuds peut être entièrement disjoint des trois qui ont pris l'écriture. Il renvoie des données stale, sans erreur et sans aucun moyen pour l'appelant de s'en rendre compte.`,
    },
    {
      kind: "theory",
      body: `R et W sont deux molettes qui se troquent **l'une contre l'autre**, pas contre une « cohérence » abstraite. À N=3, \`W=1\` tolère deux pannes de nœud en écriture et zéro en lecture ; \`W=3\` inverse ça. La latence suit la même courbe, parce que chaque quorum attend son membre le plus lent — donc monter W monte le p99 spécifiquement sur le chemin d'écriture.

Une partition ne demande pas la permission. Avec N=5, W=3 et un split 3|2, le côté majoritaire réunit encore un quorum et commit la version 2 ; le côté minoritaire a deux nœuds joignables et ne peut atteindre ni R=3 ni W=3, donc il refuse les deux.

Ce refus **est** le choix CP, et tu l'as fait quand tu as choisi R et W. Servir la version 1 stale de n4/n5 aurait été le choix AP — disponible, et faux. CAP n'est pas une propriété du réseau ; c'est laquelle de ces deux lignes tu as shippée.

Ce sont les numéros de version, pas les timestamps d'horloge murale, qui rendent la lecture résoluble : le lecteur prend la version la plus haute parmi les réponses qu'il a effectivement reçues.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `R + W >= N` n'est-il pas la règle de quorum ?",
      options: [
        "À l'égalité, les deux quorums peuvent être disjoints — N=5, R=2, W=3 a un ensemble de lecture qui ne touche aucun des trois nœuds qui ont pris l'écriture",
        "C'est la règle ; la forme stricte est une convention conservatrice avec un nœud de marge",
        "Elle est décalée d'un seulement pour N pair, où aucune majorité n'existe",
      ],
      answer: 0,
      explain:
        "Principe des tiroirs : R+W > N force au moins un nœud dans les deux ensembles. À R+W = N il y a exactement assez de place pour qu'ils s'évitent, et la lecture stale est silencieuse.",
    },
    {
      kind: "fill",
      prompt:
        "Énonce la condition de chevauchement. Elle doit forcer au moins un nœud à la fois dans l'ensemble de lecture et dans l'ensemble d'écriture.",
      file: "main.rs",
      before: "let overlaps = ",
      after: ";",
      choices: ["r + w > n", "r + w >= n", "w > n / 2"],
      explain:
        "`>=` admet la ligne N=5/R=2/W=3 ci-dessus. `w > n / 2` est la règle de majorité côté *écriture* — elle fait sérialiser les écritures concurrentes, mais ne dit rien sur le fait qu'un lecteur les voie.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "Pendant la partition 3|2, le côté minoritaire peut-il continuer à servir des lectures « juste un peu en retard » ?",
      options: [
        "Seulement si tu mets R à 2 ou moins, ce qui est le compromis rendu explicite — et alors les lectures côté majoritaire perdent aussi leur garantie de chevauchement",
        "Oui — les lectures sont sûres pendant une partition ; seules les écritures ont besoin d'un quorum",
        "Oui, à condition de marquer la réponse comme potentiellement stale",
      ],
      answer: 0,
      explain:
        "R est un seul nombre pour tout le cluster. Tu ne peux pas le baisser pour la minorité partitionnée et le garder haut partout ailleurs, et c'est pour ça que le choix se fait au moment de la configuration et pas pendant l'incident.",
    },
    {
      kind: "editor",
      intro: `### Calcule le chevauchement, puis partitionne le cluster

1. \`write\` refuse à moins que le côté joignable puisse réunir W nœuds ; sinon il écrit la version et la valeur sur chacun d'eux.
2. \`read\` refuse à moins que le côté puisse réunir R nœuds ; sinon il renvoie la **version la plus haute** vue.
3. Dans \`main\` : affiche la table de quorum pour \`(3,1,1) (3,2,2) (3,1,3) (3,3,1) (5,2,3) (5,3,3)\`, puis lance une partition 3|2 à N=5, R=3, W=3 — écris version 2 / valeur 250 de chaque côté, lis de chaque côté, et affiche la ligne de clôture AP.

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

La ligne de la table est \`"{:>2}{:>3}{:>3}{:>5}  {:<10}{:>14}{:>15}"\` ; les colonnes de survie sont \`n - w\` et \`n - r\`.`,
    },
  ],

  "backend-indexers-distsys-7": [
    {
      kind: "theory",
      body: `Une horloge de Lamport, c'est deux règles : incrémente ton compteur à chaque événement, et à la réception d'un message, monte ton compteur au moins jusqu'au stamp de l'expéditeur avant d'incrémenter.

Ça garantit que \`a → b\` implique \`L(a) < L(b)\`. C'est tout ce que l'horloge a jamais promis, et la **réciproque est fausse** :

| paire | lamport | causalité |
| --- | --- | --- |
| a2, b2 | 2 < 3 | happens-before |
| c1, a2 | 1 < 2 | concurrents |
| b1, c1 | 1 = 1 | concurrents |

\`c1\` a un stamp plus petit que \`a2\` et il n'y a aucun chemin causal entre les deux. Donc « last write wins par timestamp de Lamport », c'est choisir un vainqueur arbitraire parmi des écritures concurrentes et le présenter comme une réponse.`,
    },
    {
      kind: "theory",
      body: `Une **vector clock** garde un compteur par nœud, n'incrémente que sa propre composante, et prend le max élément par élément à la réception.

\`\`\`rust
fn happens_before(a: &[u64; 3], b: &[u64; 3]) -> bool {
    let mut strict = false;
    for i in 0..3 {
        if a[i] > b[i] { return false; }
        if a[i] < b[i] { strict = true; }
    }
    strict
}
\`\`\`

\`a ≤ b\` composante par composante avec au moins une strictement plus petite signifie \`a → b\`. Ni l'une ni l'autre direction signifie **concurrents** — un verdict que Lamport ne peut structurellement pas produire.

Le coût est dans la forme du stamp : O(1) par événement pour Lamport, O(nœuds) pour les vecteurs. C'est pour ça que les vecteurs ne survivent pas au contact d'un système qui ajoute des nœuds librement, et pour ça que la détection de conflit est généralement scopée à une clé plutôt qu'à tout un cluster.

Concurrent est une vraie réponse, pas un échec à décider. La détecter est ce qui te permet de faire remonter des versions sœurs, un merge, ou une question à l'utilisateur, au lieu de jeter en silence l'une de deux écritures qui ne se sont jamais vues.`,
    },
    {
      kind: "quiz",
      question: "`L(a) < L(b)`. Qu'est-ce que ça te dit sur la causalité ?",
      options: [
        "Rien — c'est compatible avec `a → b` et avec `a` et `b` concurrents, comme le montre la ligne c1/a2",
        "Que `a` s'est produit avant `b`, ce qui est la garantie que fournissent les horloges de Lamport",
        "Que `a` s'est produit avant `b`, sauf si les deux événements sont sur le même nœud",
      ],
      answer: 0,
      explain:
        "L'implication ne va que dans un sens : la causalité implique des stamps ordonnés, jamais l'inverse. La contraposée reste utile — `L(a) >= L(b)` prouve que `a` n'a pas causé `b`.",
    },
    {
      kind: "fill",
      prompt:
        "La règle de réception d'une vector clock : prends le maximum élément par élément entre ton vecteur et celui de l'expéditeur, composante par composante.",
      file: "main.rs",
      before: "for k in 0..3 {\n                if ",
      after:
        " {\n                    vector[e.node][k] = vector_of[src][k];\n                }\n            }",
      choices: [
        "vector_of[src][k] > vector[e.node][k]",
        "vector_of[src][k] != vector[e.node][k]",
        "vector_of[src][k] > vector[e.node][e.node]",
      ],
      explain:
        "`!=` copie la valeur de l'expéditeur même quand la tienne est plus grande, jetant de l'historique que tu avais déjà observé. Comparer contre `vector[e.node][e.node]` compare chaque composante à ton propre compteur.",
      answer: 0,
    },
    {
      kind: "quiz",
      question:
        "NTP garde la flotte à quelques millisecondes près. Pourquoi ne pas ordonner les événements par horloge murale ?",
      options: [
        "Le skew dépasse couramment l'intervalle que tu essaies d'ordonner, et aucune borne dessus n'est applicable — un receive peut porter un timestamp antérieur à son send",
        "Les horloges murales suffisent pour ordonner ; les horloges logiques n'existent que pour économiser les octets d'un timestamp",
        "Parce que les timestamps ont une résolution à la milliseconde, et les égalités ne peuvent pas être départagées",
      ],
      answer: 0,
      explain:
        "Une pause de VM, un smear de seconde intercalaire ou un mauvais peer NTP déplace une horloge de plus que les microsecondes qui séparent deux écritures sur la même clé. Les horloges logiques existent parce que cette borne ne peut pas être imposée.",
    },
    {
      kind: "editor",
      intro: `### Estampille une trace avec les deux horloges

1. \`happens_before\` est vrai quand chaque composante de \`a\` est \`<=\` celle de \`b\` et qu'au moins une est strictement plus petite.
2. Parcours les événements dans l'ordre. Sur une livraison, monte le compteur de Lamport de ce nœud jusqu'au stamp de l'expéditeur et prends le max élément par élément du vecteur de l'expéditeur ; puis incrémente le compteur de Lamport du nœud et sa propre composante du vecteur. Enregistre les deux stamps par événement et affiche la table.
3. Affiche les lignes de verdict pour les paires \`(a2,b2)\`, \`(c1,a2)\` et \`(b1,c1)\` — indices d'événement \`(1,3)\`, \`(4,1)\` et \`(2,4)\`.

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

La lettre du nœud vient de \`["A", "B", "C"][e.node]\` ; la ligne de trace est \`"{}  {}     {}        [{},{},{}]"\` et la ligne de verdict est \`"{},{}   {} {} {}    {}"\`.`,
    },
  ],
};
