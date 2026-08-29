import type { LessonStep } from "@/content/steps";

export const steps3: Record<string, LessonStep[]> = {
  "rust-standard-library-7": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Au plus profond de la chambre forte de l’Accumulateur, au-delà de tous les sacs et ledgers, se trouve un atelier où personne n’entre sans invitation. Ici, un trésor ne commence pas comme un trésor : il commence comme un **plan**.

\`\`\`rust
struct Player {
    name: String,
    hp: i32,
}
\`\`\`

Une \`struct\` rassemble plusieurs valeurs dans une forme unique et nommée. Définis-la une fois ; la chambre forte reconnaîtra ensuite cette forme pour toujours.`,
    },
    {
      kind: "theory",
      body: `Pour donner vie au plan, renseigne tous ses champs : c’est un **littéral de struct**.

\`\`\`rust
let hero = Player { name: String::from("Ferrisia"), hp: 100 };
\`\`\`

Accède à chaque champ avec un point : \`hero.name\`, \`hero.hp\`. Aucune clé, aucune recherche ; le champ *fait simplement partie* de la valeur.`,
    },
    {
      kind: "quiz",
      question:
        "Avec `struct Player { name: String, hp: i32 }\`, comment lis-tu le champ hp de \`hero\` ?",
      options: ["hero.hp", "hero[\"hp\"]", "hero::hp"],
      answer: 0,
      explain:
        "La notation par point accède directement au champ, sans recherche ni crochets.",
    },
    {
      kind: "fill",
      prompt: "Complète le littéral de struct de \`hero\`.",
      file: "main.rs",
      before: "let hero = Player { name: String::from(\"Ferrisia\"), ",
      after: " };",
      choices: ["hp: 100", "hp = 100", "100"],
      answer: 0,
      explain:
        "Chaque champ s’écrit \`champ: valeur\` dans le littéral, et les champs sont séparés par des virgules.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — le plan dans la chambre la plus profonde

1. Définis \`struct Player { name: String, hp: i32 }\`.
2. Crée \`let hero = Player { name: String::from("Ferrisia"), hp: 100 };\`.
3. Affiche \`Ferrisia has 100 hp\`.

Sortie attendue :

\`\`\`text
Ferrisia has 100 hp
\`\`\``,
    },
  ],
  "rust-standard-library-8": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Un plan seul reste inerte : il définit une forme, mais aucun comportement. L’Accumulateur t’enseigne le rite qui l’éveille — un bloc \`impl\`.

\`\`\`rust
impl Player {
    fn new(name: &str) -> Player {
        Player { name: String::from(name), hp: 100 }
    }
}
\`\`\`

\`new\` ne reçoit pas \`self\` : elle n’agit pas sur un Player existant, elle en *crée* un. Appelle-la avec \`Player::new("Ferrisia")\`, en utilisant le nom du type, pas une valeur.`,
    },
    {
      kind: "theory",
      body: `Une fonction qui reçoit \`&self\` est une **méthode** : elle agit sur une instance précise et s’appelle avec un point.

\`\`\`rust
impl Player {
    fn is_alive(&self) -> bool {
        self.hp > 0
    }
}

hero.is_alive();
\`\`\`

Ajoute aussi \`#[derive(Debug)]\` à la struct pour que Rust génère gratuitement une représentation de débogage, affichable avec \`{:?}\` sans écrire de méthode supplémentaire.`,
    },
    {
      kind: "quiz",
      question: "Pourquoi `Player::new(...)\` ne reçoit-elle pas \`&self\` ?",
      options: [
        "Elle crée le Player : aucune instance n’existe encore pour recevoir l’appel",
        "self est facultatif dans tous les blocs impl",
        "new est un mot-clé qui ne reçoit jamais d’arguments",
      ],
      answer: 0,
      explain:
        "Les fonctions associées comme \`new\` construisent la valeur ; une méthode agit sur une valeur qui existe déjà.",
    },
    {
      kind: "fill",
      prompt:
        "Complète la signature de la méthode : elle doit lire l’instance, pas la consommer.",
      file: "main.rs",
      before: "fn is_alive(",
      after: ") -> bool {\n    self.hp > 0\n}",
      choices: ["&self", "self", "player: &Player"],
      answer: 0,
      explain:
        "&self emprunte l’instance ; is_alive peut ainsi lire hp sans prendre possession de hero.",
    },
    {
      kind: "editor",
      intro: `### Épreuve finale — le rite qui éveille le réceptacle

1. Ajoute \`#[derive(Debug)]\` au-dessus de \`Player\`.
2. Écris \`new(name: &str) -> Player\` et \`is_alive(&self) -> bool\` dans \`impl Player\`.
3. Crée \`hero\` avec \`Player::new("Ferrisia")\`, affiche \`alive: {}\` avec \`hero.is_alive()\`, puis affiche \`hero\` avec \`{:?}\`.

Sortie attendue :

\`\`\`text
alive: true
Player { name: "Ferrisia", hp: 100 }
\`\`\``,
    },
  ],
};
