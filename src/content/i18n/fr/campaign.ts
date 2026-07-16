import type { ActText, CardText, SkirmishText } from "../types";

// Localized campaign narrative. Card NAMES and act numerals stay as-is.
export const actText: Record<string, ActText> = {
  "rust-fundamentals": {
    title: "La Citadelle Rouillée",
    territory: "Capitale en ruine de l'art runique",
    synopsis:
      "Tu t'éveilles dans les ruines oxydées de la Citadelle. Ferrisia la Mère-Crabe t'enseigne les mots d'éveil, la liaison des noms et la loi de la Lame Inflexible. Rallume le phare, Forgeborn.",
  },
  "control-flow": {
    title: "La Halle des Chemins qui Bifurquent",
    territory: "Labyrinthe de miroirs",
    overlord: "Le Suzerain des Miroirs",
    synopsis:
      "Un labyrinthe où chaque couloir mène à un destin différent. Le Suzerain des Miroirs piège les voyageurs dans des boucles infinies. Bifurque avec sagesse, matche chaque reflet et brise la boucle éternelle.",
  },
  "rust-standard-library": {
    title: "Les Coffres Sans Fin",
    territory: "Archive-donjon sous le royaume",
    overlord: "Le Thésauriseur",
    synopsis:
      "Sous le royaume dorment tous les outils que les anciens Stroopies ont jamais forgés : sacoches extensibles, registres enchantés, chaînes d'esprits paresseux qui ne travaillent que lorsqu'on les collecte. Le Thésauriseur veille sur tout — et indexe tout avec un décalage de un.",
  },
  "mastering-option": {
    title: "Le Marais Évanescent",
    territory: "Marécages hantés du peut-être",
    synopsis:
      "Ici, les choses sont ou ne sont pas — peut-être. Des villageois disparaissent dans le None ; les imprudents unwrappent à l'aveugle et on ne les revoit jamais. Dans le marais, tu poses la seule question qui compte : Some, ou None ?",
  },
  "mastering-result": {
    title: "Le Procès des Deux Destins",
    territory: "La Haute Cour du royaume",
    synopsis:
      "Chaque rune est jugée ici : Ok ou Err. La devise de la Cour est gravée au-dessus de la porte — #[must_use]. Apprends à propager le jugement avec ?, à te relever d'un Err avec grâce, et à ne jamais paniquer devant la cour.",
  },
  "stellar-101": {
    title: "La Porte de la Constellation",
    territory: "Le ciel brisé",
    synopsis:
      "Cinq champions réunis, tu t'élèves. Des forts-étoiles pour les comptes, sigle-et-secret pour les paires de clés, des ponts de lumière pour les trustlines — et les lumens qui circulent à nouveau pour la première fois depuis la Panique.",
  },
  "soroban-smart-contracts": {
    title: "L'Antre du Beholder",
    territory: "Forteresse des erreurs non gérées",
    overlord: "Le Stroopbeholder",
    synopsis:
      "Au-delà de la Porte, il attend, dans une forteresse bâtie de chaque erreur jamais gérée. Forge des runes Soroban, déploie-les dans le ciel vivant, et retourne contre le Beholder ses propres contrats corrompus.",
  },
};

export const skirmishText: Record<string, SkirmishText> = {
  // Act I — The Rusted Citadel
  "rust-fundamentals-1": {
    title: "Les Mots d'Éveil",
    intro:
      "Le phare de la Citadelle est éteint depuis la Grande Panique, et il ne répond qu'à une rune prononcée. Ferrisia te tend un burin. « Toute rune jamais forgée commence à `main` », dit-elle. « Parle, Forgeborn — et surveille tes points-virgules. Le phare est pédant. »",
  },
  "rust-fundamentals-2": {
    title: "La Lame Inflexible",
    intro:
      "Dans l'armurerie, chaque lame est liée immuable par l'ancienne loi — une fois forgée, jamais changée. Pour en reforger une, tu dois déclarer ton intention à l'acier lui-même. Le Gardien de l'Emprunt observe depuis le seuil, bras croisés, attendant que tu tentes de la changer sans `mut`.",
  },
  "rust-fundamentals-3": {
    title: "Les Formes de la Matière",
    intro:
      "Ferrisia ouvre une armoire de fioles étiquetées : nombres entiers, nombres brisés, vérités et mensonges. « La Citadelle refuse toute rune dont elle ne peut nommer la forme », dit-elle. « Étiquette tes fioles, Forgeborn — le phare ne lit que ce qui est typé. »",
  },
  "rust-fundamentals-4": {
    title: "La Recette du Forgeron de Runes",
    intro:
      "Au mur de la forge est accrochée une recette : prends deux lingots, fusionne-les, rends l'alliage. « Une recette écrite une fois sert mille forgeages », dit Ferrisia. « Les forgerons les appelaient des fonctions. Écris la tienne, et la forge l'appellera par son nom. »",
  },
  "rust-fundamentals-5": {
    title: "La Loi du Gardien Unique",
    intro:
      "La porte du coffre porte la plus ancienne loi de la Citadelle : chaque trésor a exactement un gardien. Confie un trésor à un autre et il n'est plus tien — tends à nouveau la main vers lui et les sceaux te brûleront. Ce soir, tu apprends pourquoi les anciens forgerons forgeaient parfois une véritable copie à la place.",
  },
  "rust-fundamentals-6": {
    title: "La Lame Empruntée",
    intro:
      "Le Gardien de l'Emprunt parle enfin : « Nul besoin de céder une lame pour qu'un autre lise son inscription. Prête-la — une référence — et elle revient dans ta main quand il a terminé. » Il tapote le sigle `&` gravé dans son gantelet. « Cette marque. Apprends-la. »",
  },

  // Act II — The Hall of Forking Roads
  "control-flow-1": {
    title: "Les Deux Portes",
    intro:
      "La première salle du labyrinthe abrite deux portes et une seule torche. « Chaque chemin ici est une question », murmure un reflet qui est presque toi. « Si la torche brûle, une porte. Sinon, l'autre. Le dédale ne respecte qu'un voyageur capable de décider. »",
  },
  "control-flow-2": {
    title: "La Halle de Tous les Reflets",
    intro:
      "Un couloir de miroirs, chacun montrant une porte différente que tu aurais pu prendre. La règle du Suzerain des Miroirs est absolue : nomme ce que tu vois dans chaque miroir — chacun d'eux — ou reste piégé entre eux. L'ancien art runique appelle cela un `match`, et il n'oublie rien.",
  },
  "control-flow-3": {
    title: "Le Couloir Sans Fin",
    intro:
      "Ce couloir se répète. La même torchère, la même fissure dans la pierre, encore et encore. Les voyageurs qui l'arpentent pour toujours finissent par faire partie du mur. La seule issue est de compter tes échos — et, quand le compte est bon, de rompre le sortilège d'un `break` en pleine foulée.",
  },
  "control-flow-4": {
    title: "La Galerie qui Sombre",
    intro:
      "Le sol descend un étage à la fois, et l'eau monte. « Tant qu'il reste des étages au-dessus de la marée, continue de descendre vers la salle du coffre », dit le reflet, sans grande aide. Vérifie la condition avant chaque pas — la galerie noie les imprudents.",
  },
  "control-flow-5": {
    title: "Les Pas Comptés",
    intro:
      "Cinq pierres de gué traversent le lac-miroir, numérotées de un à cinq. Marche sur chacune exactement une fois, dans l'ordre, en l'annonçant à voix haute — le lac écoute. Les anciens forgerons avaient une rune pour parcourir un chemin connu sans compter sur ses doigts : `for`.",
  },
  "control-flow-6": {
    title: "Le Dédale du Suzerain",
    intro:
      "La galerie finale : dix miroirs, et le Suzerain des Miroirs caché derrière un miroir sur trois. Parcours la rangée ; annonce le numéro de chaque miroir — mais là où le Suzerain se cache, crie « mirror » à la place. Branche à l'intérieur de ta boucle, Forgeborn. Brise le cœur du labyrinthe.",
  },

  // Act III — The Endless Vaults
  "rust-standard-library-1": {
    title: "La Sacoche Sans Fond",
    intro:
      "Le premier coffre renferme l'outil favori des Stroopies : une sacoche qui grandit pour contenir tout ce que tu y pousses. « Un `Vec` », dit le Stroopkeeper en déverrouillant la vitrine. « Chaque aventurier en porte une. Peu la respectent. Elle compte à partir de zéro, comme les anciens dieux l'ont voulu. »",
  },
  "rust-standard-library-2": {
    title: "La Chaîne des Esprits Paresseux",
    intro:
      "Plus profond encore, des esprits pendent en chaînes — chacun tenant une valeur, sans rien faire du tout. « Des itérateurs », murmure le Gardien. « Les travailleurs les plus paresseux du royaume. Ils ne lèvent pas le petit doigt avant que tu ne collectes. Enchaîne-les bien et ils additionneront une fortune en un souffle. »",
  },
  "rust-standard-library-3": {
    title: "L'Étagère Peut-Être Vide",
    intro:
      "Le piège du Thésauriseur : une étagère à cinq emplacements, et des aventuriers qui tendent la main vers le sixième. Jadis, ce geste faisait s'effondrer le coffre tout entier. Le `.get` de la sacoche demande poliment à la place — et la réponse, Forgeborn, peut n'être rien du tout.",
  },
  "rust-standard-library-4": {
    title: "Le Registre Enchanté",
    intro:
      "Un livre qui répond aux questions : demande-lui « gold ? » et il répond « 100 ». Chaque entrée est une clé liée à une valeur, sans ordre particulier — l'enchantement troque l'ordre contre la vitesse. Les forgerons l'appelaient une `HashMap`. Le Thésauriseur l'appelle sa mémoire.",
  },
  "rust-standard-library-5": {
    title: "L'Inscription Vivante",
    intro:
      "Certaines inscriptions sont gravées une fois et ne changent jamais — d'autres grandissent, lettre après lettre, à mesure que leur histoire s'écrit. Ce soir, tu travailles avec l'espèce vivante : `String`, le texte extensible du royaume, et `format!`, le sortilège qui en tisse plusieurs en un.",
  },
  "rust-standard-library-6": {
    title: "Une Fenêtre sur le Trésor",
    intro:
      "Le Thésauriseur ne te laissera pas emporter le trésor — mais il te laissera regarder. Une slice est une fenêtre sur une étendue de trésor : pas de copie, pas de vol, juste une vue d'ici à là. Prends garde aux bords ; la fenêtre inclut son début et exclut sa fin.",
  },

  // Act IV — The Vanishing Marsh
  "mastering-option-1": {
    title: "Some, ou None ?",
    intro:
      "Le Stroophantom se matérialise — ou pas. Difficile à dire. « Dans le marais, chaque réponse est enveloppée », dit-il depuis quelque part. « `Some(thing)`, ou `None`. D'autres royaumes prétendent que l'absence n'existe pas et s'y fracassent à minuit. Ici, on la met dans le type. »",
  },
  "mastering-option-2": {
    title: "Les Fous Qui Ont Unwrappé",
    intro:
      "Des pierres tombales bordent le sentier, chacune gravée du même dernier mot : `.unwrap()`. « Ils ont supposé », soupire le Fantôme. « Sur `None`, unwrap panique — tout le programme se noie. Porte plutôt une valeur par défaut, et le marais ne pourra rien contre toi. »",
  },
  "mastering-option-3": {
    title: "Demande au Marais Lui-Même",
    intro:
      "Au cœur du marais, une lanterne qui est peut-être allumée — ou pas. Le Fantôme enseigne l'ultime courtoisie : « `if let Some(light)` — s'il y a quelque chose, prends-le par son nom et utilise-le. Sinon, emprunte le chemin du else. Ne suppose jamais. Demande. »",
  },

  // Act V — The Trial of Two Fates
  "mastering-result-1": {
    title: "Les Deux Verdicts",
    intro:
      "La Strooracle préside, et sa cour ne connaît que deux jugements : `Ok(value)` et `Err(reason)`. « Le marais t'a enseigné l'absence », dit-elle. « Moi, je t'enseigne l'échec — et l'échec, Forgeborn, énonce toujours sa raison pour le procès-verbal. »",
  },
  "mastering-result-2": {
    title: "La Lecture du Jugement",
    intro:
      "Un parchemin arrive, scellé, avec un verdict à l'intérieur. Dans cette cour, on ne devine pas les verdicts — on les `match` : une branche pour `Ok`, une branche pour `Err`, les deux traitées, rien d'ignoré. La devise au-dessus de la porte s'illumine à ton entrée : `#[must_use]`.",
  },
  "mastering-result-3": {
    title: "La Marque de la Propagation",
    intro:
      "Toutes les cours n'ont pas à trancher ; certaines renvoient l'affaire plus haut. L'Oracle te montre la plus petite rune du royaume : `?`. « Sur Ok, déballe et continue. Sur Err, renvoie-le à qui t'a appelé — sur-le-champ. Une seule marque, et le jugement remonte le courant. »",
  },

  // Act VI — The Constellation Gate
  "stellar-101-1": {
    title: "La Charte du Fort-Étoile",
    intro:
      "Astrostroopie t'accueille à la Porte avec une charte et deux clés. « Chaque âme du ciel est un fort-étoile — un compte. Le sigle `G`, tu peux le crier du haut des tours ; la graine `S`, tu la gardes au péril de ta vie. Perds le premier, c'est gênant. Perds la seconde, c'est tout perdre. »",
  },
  "stellar-101-2": {
    title: "Le Péage de la Porte",
    intro:
      "« La monnaie du ciel est le lumen », dit le Voyageur en lançant une pièce qui se scinde en dix millions d'étincelles. « Chaque étincelle, un stroop. Chaque traversée paie un petit péage — une centaine de stroops, selon le trafic — pour que nul n'inonde le ciel de bruit. »",
  },
  "stellar-101-3": {
    title: "Le Pont de Lumière",
    intro:
      "Au-delà des lumens, le ciel transporte chaque actif qu'un fort-étoile ose émettre — mais seulement sur des ponts que tu bâtis toi-même. « Une trustline », dit Astrostroopie, « c'est toi qui dis au ciel : j'accepte CET actif, de CET émetteur. Pas de pont, pas de cargaison. Le ciel prend le consentement au sérieux. »",
  },
  "stellar-101-4": {
    title: "Première Lumière à Travers le Ciel",
    intro:
      "Tout converge : un fort-étoile de destination, un actif, un montant. Le Voyageur s'écarte de la console. « Aucun lumen n'a franchi cette Porte depuis la Panique. Trace le paiement, Forgeborn. Que le trafic soit. »",
  },

  // Act VII — The Beholder's Lair
  "soroban-smart-contracts-1": {
    title: "La Première Rune du Ciel",
    intro:
      "La porte de la forteresse lit les runes, pas l'acier. Ici, ton Rust n'est plus un programme — c'est un contrat, gravé dans le ciel vivant où chaque étoile peut l'appeler. Pas de bibliothèque standard, pas de système d'exploitation : juste `#![no_std]`, l'Env, et ta parole. Grave la première rune du ciel.",
  },
  "soroban-smart-contracts-2": {
    title: "Le Registre Qui Se Souvient",
    intro:
      "À l'intérieur de la forteresse, un registre s'écrit tout seul. Tout ce que le Beholder a jamais compté est stocké ici — mais dans le ciel, le stockage se loue, il ne se possède pas. Lis, incrémente, réécris. Le registre se souvient de ce que ton contrat lui dit de retenir, et de rien d'autre.",
  },
  "soroban-smart-contracts-3": {
    title: "Le Sceau du Signataire",
    intro:
      "La corruption du Beholder a commencé par une seule fonction sans garde — n'importe qui pouvait retirer ce qui ne lui appartenait pas. Une seule ligne l'aurait arrêtée. Exige le sceau du signataire avant de déplacer le moindre lumen : `require_auth`. Retourne son propre coffre contre lui.",
  },
};

export const cardText: Record<string, CardText> = {
  stroowarrior: {
    type: "Guerrier",
    flavor:
      "Ce n'est que lorsque le monde tremble que le vrai guerrier révèle sa lumière inflexible.",
  },
  stropillusion: {
    epithet: "Explorateur de la Galerie des Glaces",
    type: "Stropie · Illusionniste",
    flavor:
      "Les reflets trompent, les secrets restent cachés — il plie la réalité au sein des miroirs sans fin.",
  },
  stroopkeeper: {
    epithet: "Gardien des Coffres Sans Fin",
    type: "Stropie · Archiviste",
    flavor:
      "Chaque outil jamais forgé dort dans ses coffres — indexé à partir de zéro, comme les anciens dieux l'ont voulu.",
  },
  stroophantom: {
    epithet: "Le Chevalier Qui N'Est Peut-Être Pas",
    type: "Stropie · Spectre",
    flavor:
      "Demande-lui s'il est là. Ne suppose jamais. Le marais est plein de ceux qui ont unwrappé.",
  },
  strooracle: {
    epithet: "Arbitre des Deux Destins",
    type: "Stropie · Oracle",
    flavor:
      "Deux portes, un seul verdict. Elle n'a jamais ignoré un Result, et elle ne commencera pas avec le tien.",
  },
  astrostroopie: {
    epithet: "Voyageur de la Porte de la Constellation",
    type: "Stropie · Voyageur",
    flavor:
      "Il a cartographié le ciel par ses blessures, et franchi la Porte là où la lumière avait failli.",
  },
  stroopbeholder: {
    type: "Stropie · Aberration",
    flavor:
      "Des profondeurs de la ruine, ses yeux innombrables ne voient que la conquête.",
  },
};
