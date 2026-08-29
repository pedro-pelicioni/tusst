import type { LessonStep } from "@/content/steps";

export const steps3: Record<string, LessonStep[]> = {
  "rust-standard-library-7": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Nas profundezas do cofre do Acumulador, depois de todas as bolsas e livros-razão, existe uma oficina onde ninguém entra sem convite. Ali, um tesouro não começa como tesouro — começa como um **molde**:


\`\`\`rust
struct Player {
    name: String,
    hp: i32,
}
\`\`\`

Uma \`struct\` reúne vários valores em uma única forma nomeada. Defina-a uma vez, e o cofre reconhecerá essa forma para sempre.`,
    },
    {
      kind: "theory",
      body: `Para dar vida ao molde, preencha todos os campos — isso é um **literal de struct**:

\`\`\`rust
let hero = Player { name: String::from("Ferrisia"), hp: 100 };
\`\`\`

Acesse cada campo com um ponto: \`hero.name\`, \`hero.hp\`. Não há chave nem busca; o campo simplesmente *faz parte* do valor.`,
    },
    {
      kind: "quiz",
      question:
        "Dada `struct Player { name: String, hp: i32 }\`, como você lê o campo hp de \`hero\`?",
      options: ["hero.hp", "hero[\"hp\"]", "hero::hp"],
      answer: 0,
      explain:
        "A notação de ponto acessa o campo diretamente — sem busca e sem colchetes.",
    },
    {
      kind: "fill",
      prompt: "Complete o literal de struct de \`hero\`.",
      file: "main.rs",
      before: "let hero = Player { name: String::from(\"Ferrisia\"), ",
      after: " };",
      choices: ["hp: 100", "hp = 100", "100"],
      answer: 0,
      explain:
        "Cada campo usa \`campo: valor\` dentro do literal, e os campos são separados por vírgulas.",
    },
    {
      kind: "editor",
      intro: `### Prova final — o molde no cofre mais profundo

1. Defina \`struct Player { name: String, hp: i32 }\`.
2. Crie \`let hero = Player { name: String::from("Ferrisia"), hp: 100 };\`.
3. Imprima \`Ferrisia has 100 hp\`.

Saída esperada:

\`\`\`text
Ferrisia has 100 hp
\`\`\``,
    },
  ],
  "rust-standard-library-8": [
    {
      kind: "theory",
      image: "/mascot/mascot-guide.png",
      body: `Um molde sozinho é inerte: ele define uma forma, mas nenhum comportamento. O Acumulador ensina o rito que o desperta — um bloco \`impl\`.

\`\`\`rust
impl Player {
    fn new(name: &str) -> Player {
        Player { name: String::from(name), hp: 100 }
    }
}
\`\`\`

\`new\` não recebe \`self\`: ela não atua sobre um Player existente, ela *cria* um. Chame-a como \`Player::new("Ferrisia")\`, usando o nome do tipo, não um valor.`,
    },
    {
      kind: "theory",
      body: `Uma função que recebe \`&self\` é um **método**: ela atua sobre uma instância específica e é chamada com ponto.

\`\`\`rust
impl Player {
    fn is_alive(&self) -> bool {
        self.hp > 0
    }
}

hero.is_alive();
\`\`\`

Marque também a struct com \`#[derive(Debug)]\` para o Rust gerar gratuitamente uma representação de debug, que você imprime com \`{:?}\` sem escrever outro método.`,
    },
    {
      kind: "quiz",
      question: "Por que `Player::new(...)\` não recebe \`&self\`?",
      options: [
        "Ela cria o Player — ainda não existe uma instância sobre a qual agir",
        "self é opcional em qualquer bloco impl",
        "new é uma palavra reservada que nunca recebe argumentos",
      ],
      answer: 0,
      explain:
        "Funções associadas como \`new\` constroem o valor; um método atua sobre um valor que já existe.",
    },
    {
      kind: "fill",
      prompt:
        "Complete a assinatura do método: ele precisa ler a instância, não consumi-la.",
      file: "main.rs",
      before: "fn is_alive(",
      after: ") -> bool {\n    self.hp > 0\n}",
      choices: ["&self", "self", "player: &Player"],
      answer: 0,
      explain:
        "&self empresta a instância, então is_alive pode ler hp sem tomar posse de hero.",
    },
    {
      kind: "editor",
      intro: `### Prova final — o rito que desperta o receptáculo

1. Adicione \`#[derive(Debug)]\` acima de \`Player\`.
2. Escreva \`new(name: &str) -> Player\` e \`is_alive(&self) -> bool\` dentro de \`impl Player\`.
3. Crie \`hero\` com \`Player::new("Ferrisia")\`, imprima \`alive: {}\` com \`hero.is_alive()\` e depois imprima \`hero\` com \`{:?}\`.

Saída esperada:

\`\`\`text
alive: true
Player { name: "Ferrisia", hp: 100 }
\`\`\``,
    },
  ],
};
