import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Máquinas que cumplen promesas",
  tagline: "Un contrato es una regla que se ejecuta sola — nada más místico.",
  steps: [
    {
      kind: "theory",
      body: `## La máquina expendedora ya hacía esto

Una máquina expendedora es una promesa sin nadie detrás: *mete 3, pulsa B4, recibe las patatas.* No le caes bien ni mal, no comprueba tu nombre, no decide si hoy es un buen día para cumplir el trato. La regla es la máquina.

Compáralo con una promesa que sostiene una persona — un casero devolviendo la fianza, un marketplace liberando el pago cuando llega el paquete. Esas promesas también son reales, pero dependen de que alguien *elija* cumplirlas y de que exista dónde reclamar si no lo hace.

Un **contrato** en un libro mayor compartido es lo primero: la máquina expendedora, para dinero y reglas, dentro del libro del Capítulo I.`,
    },
    {
      kind: "theory",
      body: `## Qué es en realidad

Quítale el misticismo y un contrato son tres cosas corrientes:

- **Un lugar en el libro que guarda valor.** Puede tener fondos igual que una cuenta, y tiene una dirección como cualquier cuenta.
- **Un conjunto fijo de reglas** — «si esto, entonces aquello» — escritas una vez y publicadas para que cualquiera las lea.
- **Ninguna mano.** Actúa solo cuando alguien lo empuja con una instrucción firmada, y cuando actúa, sigue sus reglas exactamente.

Nadie lo «ejecuta». No hay servidor que apagar, ni empresa a la que escribir, ni operador con un override. Una vez en el libro, miles de máquinas lo ejecutan de forma idéntica y coinciden en el resultado.`,
    },
    {
      kind: "diagram",
      body: "La máquina entera, de punta a punta:",
      caption: "Cuatro pasos, y la persona aparece solo en el primero.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "poke",
            label: "llega una instrucción firmada",
            note: "No pasa nada hasta que alguien lo empuja. Un contrato no tiene manos propias.",
            tone: "accent",
          },
          {
            id: "rules",
            label: "comprueba sus reglas",
            note: "Las mismas reglas que cualquiera puede leer. Sin criterio, sin excepciones, sin días malos.",
            tone: "neutral",
          },
          {
            id: "move",
            label: "mueve valor",
            note: "Tiene fondos como los tiene una cuenta, y los mueve solo como dicen sus reglas.",
            tone: "teal",
          },
          {
            id: "book",
            label: "la línea está en el libro",
            note: "Permanente, pública e imposible de deshacer — incluso cuando la regla estaba mal.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `¿Qué arreglo cotidiano se parece más a cómo se comporta un contrato?`,
      options: [
        "Una máquina expendedora: reglas fijas, ningún juicio, actúa solo cuando alguien mete algo",
        "Un dependiente atento: lee la situación y decide qué es justo caso por caso",
        "Un acuerdo firmado en papel: está escrito, pero lo hace cumplir después un tribunal",
      ],
      answer: 0,
      explain: `El dependiente tiene criterio y el papel necesita quien lo ejecute. Un contrato no tiene ninguno de los dos — la ejecución *es* el cumplimiento. Esa es su fuerza y, como estás a punto de ver, su filo más afilado.`,
    },
    {
      kind: "theory",
      body: `## Lo que no puede hacer (esta lista importa más)

Quien empieza sobreestima los contratos de cuatro maneras concretas, y vale la pena desaprenderlas todas ahora mismo:

- **No sabe nada del mundo exterior.** Ni el precio del dólar hoy, ni si el paquete llegó, ni el tiempo que hace. Alguien tiene que *enviarle* esa información — y elegir quién puede hacerlo es una decisión con consecuencias reales.
- **No puede cambiar de opinión.** Nada de «pero obviamente quería decir…». Hace lo que dice, al pie de la letra.
- **No se puede deshacer.** Un movimiento que hizo es una línea en el libro. No hay deshacer.
- **No es privado.** Sus reglas y cada movimiento que ha hecho son públicos, para siempre, para quien quiera mirar.`,
    },
    {
      kind: "quiz",
      question: `Un contrato está escrito para liberar fondos «después del plazo». Su autor quería decir, en privado, *el comprador lo pide y lo recibe*; el contrato tal como está escrito libera a quien lo pida primero. El primer día, un desconocido lo pide antes y lo recibe.

¿Qué salió mal?`,
      options: [
        "La regla escrita se cumplió — la intención que nunca llegó al papel sencillamente no existía",
        "El contrato falló y debería revertirse",
        "El desconocido rompió una regla y se le puede denunciar",
      ],
      answer: 0,
      explain: `Nada falló, y esa es la parte incómoda. La máquina cumplió la promesa que recibió, no la que estaba en la cabeza de su autor. Las intenciones no escritas no tienen aquí ninguna fuerza.`,
    },
    {
      kind: "fill",
      prompt: `Completa la frase que conviene llevarse de este capítulo:`,
      file: "NOTES.md",
      before: `Un contrato cumple `,
      after: ` .`,
      choices: [
        "la promesa que escribiste, no la que querías decir",
        "la protección de tus fondos frente a cualquier bug posible",
        "un registro privado que solo tú puedes leer",
        "la promesa que un tribunal considere más justa",
      ],
      answer: 0,
      explain: `Cada incidente caro de esta industria es una variación de esa única línea. Y por eso el siguiente tramo del camino no empieza por el código.`,
    },
    {
      kind: "labLink",
      labSlug: "treasure-chest",
      body: `Puedes ver a una de estas máquinas cumplir una promesa en la testnet real, ahora mismo. El laboratorio **El Cofre del Tesoro** de la Forja encierra fondos en una entrada del libro mayor que no pertenece a nadie — hasta que el único reclamante nombrado la toma. Sin agente de custodia, sin empresa reteniendo el dinero, sin nadie que *pudiera* cambiar de opinión. La regla lo libera, o no lo libera nada.`,
    },
    {
      kind: "theory",
      body: `## Por qué este es el último capítulo fácil

Ya tienes toda la planta baja: un libro que nadie puede editar en silencio, una clave que demuestra quién eres y máquinas que cumplen promesas escritas exactamente como se escribieron.

Fíjate en lo que eso suma. Si la máquina hace precisamente lo que se escribió — y no admite discusión, corrección ni marcha atrás — entonces **escribir es el trabajo**. No teclear: una IA teclea más rápido que tú y no se cansa nunca. Decidir, fijar, precisar el «qué debe ser cierto aquí y qué no puede pasar nunca».

**A continuación, en el camino del Oficio:** cómo escribir eso como es debido, antes de que exista una línea de código. Y en el camino del Reino: la maquinaria de Stellar misma, desde cómo coinciden miles de máquinas hasta los contratos que acabas de conocer — esta vez por dentro.`,
    },
  ],
  testOut: [
    { question: `¿Qué distingue a un contrato de una promesa guardada por una persona?`,
      options: ["Ejecuta sus propias reglas, sin que nadie elija si cumplirlas","Está escrito, y una promesa hablada no","Se puede reclamar en un juzgado, y una promesa no"], answer: 0 },
    { question: `¿Quién ejecuta un contrato publicado?`,
      options: ["Nadie en particular — miles de máquinas lo ejecutan de forma idéntica y coinciden en el resultado","El autor, en un servidor que mantiene encendido para eso","Los operadores de la red, por turnos"], answer: 0 },
    { question: `¿Cuándo actúa un contrato?`,
      options: ["Solo cuando alguien lo empuja con una instrucción firmada","De forma continua, revisando sus condiciones en segundo plano","Una vez al día, cuando la red barre las reglas almacenadas"], answer: 0 },
    { question: `¿Puede el autor apagar un contrato ya publicado?`,
      options: ["No, salvo que las propias reglas publicadas del contrato lo permitan","Sí — el autor siempre se guarda un override","Solo pidiendo a los operadores de la red que lo retiren"], answer: 0 },
  ],
};
