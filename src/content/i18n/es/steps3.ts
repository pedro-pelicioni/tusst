import type { LessonStep } from "@/content/steps";

export const steps3: Record<string, LessonStep[]> = {
  "rust-standard-library-7": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `En las profundidades de la bóveda del Acaparador, más allá de todos los sacos y libros mayores, hay un taller al que nadie entra sin invitación. Allí, un tesoro no comienza como tesoro: comienza como un **plano**.

\`\`\`rust
struct Player {
    name: String,
    hp: i32,
}
\`\`\`

Una \`struct\` reúne varios valores en una única forma con nombre. Defínela una vez y la bóveda reconocerá esa forma para siempre.`,
    },
    {
      kind: "theory",
      body: `Para dar vida al plano, completa todos sus campos: eso es un **literal de struct**.

\`\`\`rust
let hero = Player { name: String::from("Ferrisia"), hp: 100 };
\`\`\`

Accede a cada campo con un punto: \`hero.name\`, \`hero.hp\`. No hay clave ni búsqueda; el campo simplemente *forma parte* del valor.`,
    },
    {
      kind: "quiz",
      question:
        "Dada `struct Player { name: String, hp: i32 }\`, ¿cómo lees el campo hp de \`hero\`?",
      options: ["hero.hp", "hero[\"hp\"]", "hero::hp"],
      answer: 0,
      explain:
        "La notación de punto accede directamente al campo, sin búsquedas ni corchetes.",
    },
    {
      kind: "fill",
      prompt: "Completa el literal de struct de \`hero\`.",
      file: "main.rs",
      before: "let hero = Player { name: String::from(\"Ferrisia\"), ",
      after: " };",
      choices: ["hp: 100", "hp = 100", "100"],
      answer: 0,
      explain:
        "Cada campo necesita \`campo: valor\` dentro del literal, y los campos se separan con comas.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — el plano de la bóveda más profunda

1. Define \`struct Player { name: String, hp: i32 }\`.
2. Crea \`let hero = Player { name: String::from("Ferrisia"), hp: 100 };\`.
3. Imprime \`Ferrisia has 100 hp\`.

Salida esperada:

\`\`\`text
Ferrisia has 100 hp
\`\`\``,
    },
  ],
  "rust-standard-library-8": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Un plano por sí solo es inerte: define una forma, pero no un comportamiento. El Acaparador te enseña el rito que lo despierta: un bloque \`impl\`.

\`\`\`rust
impl Player {
    fn new(name: &str) -> Player {
        Player { name: String::from(name), hp: 100 }
    }
}
\`\`\`

\`new\` no recibe \`self\`: no actúa sobre un Player existente, sino que *crea* uno. Llámala como \`Player::new("Ferrisia")\`, con el nombre del tipo, no con un valor.`,
    },
    {
      kind: "theory",
      body: `Una función que recibe \`&self\` es un **método**: actúa sobre una instancia concreta y se llama con un punto.

\`\`\`rust
impl Player {
    fn is_alive(&self) -> bool {
        self.hp > 0
    }
}

hero.is_alive();
\`\`\`

Marca también la struct con \`#[derive(Debug)]\` para que Rust genere gratis una vista de depuración, imprimible con \`{:?}\` sin escribir otro método.`,
    },
    {
      kind: "quiz",
      question: "¿Por qué `Player::new(...)\` no recibe \`&self\`?",
      options: [
        "Crea el Player: todavía no existe ninguna instancia sobre la que actuar",
        "self es opcional en cualquier bloque impl",
        "new es una palabra reservada que nunca recibe argumentos",
      ],
      answer: 0,
      explain:
        "Las funciones asociadas como \`new\` construyen el valor; un método actúa sobre uno que ya existe.",
    },
    {
      kind: "fill",
      prompt:
        "Completa la firma del método: necesita leer la instancia, no consumirla.",
      file: "main.rs",
      before: "fn is_alive(",
      after: ") -> bool {\n    self.hp > 0\n}",
      choices: ["&self", "self", "player: &Player"],
      answer: 0,
      explain:
        "&self toma prestada la instancia, así is_alive puede leer hp sin adueñarse de hero.",
    },
    {
      kind: "editor",
      intro: `### Prueba final — el rito que despierta el recipiente

1. Añade \`#[derive(Debug)]\` encima de \`Player\`.
2. Escribe \`new(name: &str) -> Player\` e \`is_alive(&self) -> bool\` dentro de \`impl Player\`.
3. Crea \`hero\` con \`Player::new("Ferrisia")\`, imprime \`alive: {}\` con \`hero.is_alive()\` y después imprime \`hero\` con \`{:?}\`.

Salida esperada:

\`\`\`text
alive: true
Player { name: "Ferrisia", hp: 100 }
\`\`\``,
    },
  ],
};
