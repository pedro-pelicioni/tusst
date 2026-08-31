import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Puertas del Reino",
  tagline: "Anchors: donde el libro mayor toca el suelo.",
  steps: [
    {
      kind: "theory",
      body: `## Anclajes: las puertas

Los ríos del capítulo anterior mueven activos *ledger*. Pero tu salario está en un banco. El puente es un **anclaje**: una empresa regulada que **emite activos respaldados por fiat** y gestiona las **rampas de entrada/salida**.

Le das dólares al anclaje y te paga tokens equivalentes desde su cuenta emisora — la misma maquinaria que aprendiste hace dos capítulos: un emisor, líneas de confianza, banderas de autorización para cumplimiento. Redimes los tokens y él transfiere los dólares de vuelta.

Todo activo fiat serio en Stellar está detrás de una puerta como esta. Los anclajes son donde el libro contable toca el suelo.`,
    },
    { kind: "theory", body: `## Qué promete realmente "respaldado"

El token que emite un anchor no es dólares. Es un **derecho frente a una empresa** — y todo el edificio se apoya en que esa empresa lo honre.

Lo que significa que las preguntas interesantes sobre cualquier activo fiat no son técnicas:

- **¿Quién es el emisor, jurídicamente?** ¿Una entidad regulada en una jurisdicción, o una cuenta anónima?
- **¿Dónde está el dinero?** ¿Custodia segregada, o la misma cuenta de la que salen los sueldos?
- **¿Quién puede probarlo?** ¿Una atestación que puedas leer, o una promesa en una landing?
- **¿Qué pasa si paran?** ¿Una vía de reembolso que sobrevive a la empresa, o un token que se vuelve souvenir en silencio?

El libro mayor es honesto sobre exactamente una cosa: te dirá, con precisión y para siempre, *qué cuenta emitió este activo*. Todo lo demás es diligencia — y por eso un código de activo por sí solo no significa nada, y \`USDC\` del emisor equivocado es otro activo que casualmente comparte nombre.` },
    { kind: "quiz",
      question: `Una billetera muestra un saldo de \`USDC\`. ¿Qué te dice el código del activo por sí solo?`,
      options: ["Casi nada — un activo es un código *más su emisor*, y cualquiera puede emitir un código que ponga USDC","Que es la conocida stablecoin del dólar, ya que los códigos son únicos en el libro mayor","Que alguna entidad regulada ha atestiguado el respaldo"],
      answer: 0,
      explain: `Esta es la lectura equivocada más cara del ecosistema, y el protocolo no tiene la culpa: los códigos de activo nunca fueron únicos ni pretendieron serlo. La dirección del emisor es la identidad; el código es una etiqueta. Una billetera que te muestra uno sin el otro te está mostrando un rumor.` },
    { kind: "fill",
      prompt: `Completa lo que un activo es en realidad:`,
      file: "NOTES.md",
      before: `Un activo en Stellar es un código de activo más `,
      after: ` — y dos activos que solo comparten el código son dos activos distintos.`,
      choices: ["la dirección de su emisor", "la cantidad en circulación", "el dominio del anchor", "un registro en la lista de activos de la SDF"],
      answer: 0,
      explain: `El dominio se acerca y es genuinamente útil — es como un emisor publica quién es — pero es una afirmación superpuesta. La identidad que el propio protocolo garantiza es la cuenta emisora, y es la única parte que nadie puede falsificar.` },
    { kind: "labLink", labSlug: "oz-token-wizard",
      body: `Un anchor es una empresa envuelta alrededor de un único acto técnico: **emitir un token**. Ese acto puedes ejecutarlo tú. El **Asistente de Tokens OZ** de la Forja forja un token real en testnet, contigo como emisor — y lo que no te da es todo lo que hace que un anchor sea un anchor: la licencia, la custodia, las auditorías y la promesa de reembolsar.` },
    {
      kind: "theory",
      body: `## Una remesa, puerta a puerta

Observa a Ana en Chicago pagar a su madre en Lisboa:

1. La cartera de Ana lee el \`stellar.toml\` del anclaje US (SEP-1), se autentica (SEP-10) y abre un depósito (SEP-24). Sus dólares se convierten en USDC en el libro contable.
2. Un **pago de ruta** cruza el río: USDC sale, EURC se entrega — segundos, tarifa de menos de un centavo.
3. La cartera de su madre retira a través de un anclaje europeo (SEP-24 nuevamente). Los euros llegan a su cuenta bancaria.

Dos puertas reguladas, un cruce atómico en el medio. La cadena nunca vio un "dólar" — solo activos que las puertas prometen honrar.`,
    },
    {
      kind: "diagram",
      body: "Dinero de banco entra, dinero de banco sale — el ledger solo sostiene el medio:",
      caption: "Las dos puertas nunca se encuentran. Cada una solo debe confiar en el ledger que hay entre ellas.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "in",
            label: "la puerta de salida",
            note: "Un ancla recibe dinero real y emite un token respaldado por él.",
            tone: "gold",
          },
          {
            id: "ledger",
            label: "el ledger",
            note: "Cinco segundos, una fracción de céntimo, y ningún banco corresponsal a la vista.",
            tone: "accent",
          },
          {
            id: "out",
            label: "la puerta de llegada",
            note: "Otra ancla quema el token y paga en moneda local.",
            tone: "gold",
          },
          {
            id: "done",
            label: "dinero en mano",
            note: "Quien recibe nunca instaló una cartera, ni oyó la palabra ledger.",
            tone: "good",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `En esa remesa puerta a puerta, ¿qué elemento realizó la conversión de moneda?`,
      options: [
        "El pago de ruta — encaminando USDC a EURC a través de libros de órdenes y pools on‑ledger",
        "El escritorio interno de FX del anclaje emisor, fuera del libro contable",
        "Un contrato puente que bloqueó USDC y acuñó EURC",
      ],
      answer: 0,
      explain: `Las puertas solo traducen entre dinero bancario y activos del libro contable. El FX ocurre en tránsito, en mercados públicos, a un precio que cualquiera puede verificar — algo que los rieles de remesas tradicionales no pueden ofrecer.`,
    },
    {
      kind: "theory",
      body: `## Puertas de práctica: testanchor

No necesitas una licencia bancaria para construir sobre todo esto. El SDF ejecuta **testanchor** en testnet — un anclaje completamente funcional que habla SEP-1, SEP-10 y SEP-24 con dinero de juego. Apunta tu código de cartera a él y ensaya todo el baile de depósito y retiro antes de que intervenga un solo dólar real.

Puertas, ríos, confianza — todo lo que hasta ahora ha sido el reino *clásico*, maquinaria incrustada en el protocolo. En el próximo capítulo cruzaremos a la parte que tú programas: **Soroban**, donde los contratos están vivos y hasta el almacenamiento tiene un latido.`,
    },
    { kind: "theory", body: `## Las siglas que acabas de pasar por alto

Las viste en la remesa de Ana y probablemente las dejaste pasar: SEP-1, SEP-10, SEP-24. Tres estándares haciendo tres trabajos — *quién es este anchor*, *demuestra que eres tú*, y *ejecuta el depósito*.

No eran accesorias. Sin ellas, la billetera de Ana necesitaría una integración a medida con su anchor, la de su madre otra con el suyo, y cada billetera nueva empezaría ese trabajo desde cero. Dos puertas solo cooperaron porque ya habían acordado cómo hablar.

**A continuación:** el acuerdo mismo — los estándares que permiten a cualquier billetera plantarse ante cualquier puerta.` },
  ],
  testOut: [
    { question: `¿Qué es un anchor?`,
      options: ["Una empresa regulada que emite activos respaldados por fiat y opera las rampas de entrada y salida entre dinero bancario y el libro mayor","Una función del protocolo que convierte fiat en activos del libro mayor automáticamente","Un validador especializado en tráfico de pagos"], answer: 0 },
    { question: `Una billetera muestra \`USDC\`. ¿Qué establece el código del activo por sí solo?`,
      options: ["Casi nada — un activo es un código más su emisor, y cualquier cuenta puede emitir ese código","Que es la conocida stablecoin del dólar; los códigos son únicos","Que alguien ha atestiguado su respaldo"], answer: 0 },
    { question: `En una remesa de puerta a puerta, ¿qué pieza realiza la conversión de moneda?`,
      options: ["El path payment, enrutando por libros y pools del libro mayor a un precio que cualquiera puede verificar","La mesa de cambio interna del anchor emisor, fuera del libro mayor","Un contrato puente que bloquea un activo y acuña el otro"], answer: 0 },
    { question: `¿Por qué puedes construir una integración completa con anchor sin licencia bancaria?`,
      options: ["La SDF corre testanchor en testnet — un anchor funcional con dinero de juguete para ensayar el baile entero","Los anchors publican credenciales de producción para uso en desarrollo","No puedes; la integración con anchor exige un acuerdo firmado primero"], answer: 0 },
  ],
};
