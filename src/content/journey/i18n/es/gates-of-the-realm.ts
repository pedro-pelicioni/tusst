import type { Concept } from "../types";

export const gatesOfTheRealm: Concept = {
  meta: {
    slug: "gates-of-the-realm",
    title: "Puertas del Reino",
    tagline: "Anclajes y SEPs — donde el libro contable se encuentra con el mundo real.",
    numeral: "V",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/gates-of-the-realm.webp",
    glyph: "⛩️",
  },
  steps: [
    {
      kind: "theory",
      body: `## Anclajes: las puertas

Los ríos del capítulo anterior mueven activos *ledger*. Pero tu salario está en un banco. El puente es un **anclaje**: una empresa regulada que **emite activos respaldados por fiat** y gestiona las **rampas de entrada/salida**.

Le das dólares al anclaje y te paga tokens equivalentes desde su cuenta emisora — la misma maquinaria que aprendiste hace dos capítulos: un emisor, líneas de confianza, banderas de autorización para cumplimiento. Redimes los tokens y él transfiere los dólares de vuelta.

Todo activo fiat serio en Stellar está detrás de una puerta como esta. Los anclajes son donde el libro contable toca el suelo.`,
    },
    {
      kind: "theory",
      body: `## SEPs: la lengua común

Hay muchas carteras y muchos anclajes. Sin estándares, cada par necesitaría una integración personalizada — una malla N×M, para siempre.

La respuesta de Stellar es el **SEP**: *Stellar Ecosystem Proposal*. Los SEPs son estándares públicos que definen exactamente cómo carteras, anclajes y servicios se comunican entre sí. Implementas un SEP una vez y tu cartera funciona con **todos los anclajes** que lo implementen también — flujos de depósito, autenticación, identidad, todo eso.

Esta cultura de interoperabilidad es una de las superpotencias silenciosas de Stellar: los usuarios eligen cualquier puerta, y todas las puertas comparten la misma forma de llave.`,
    },
    {
      kind: "theory",
      body: `## SEP-1 y SEP-10: identidad y prueba

Dos pequeños estándares llevan toda la puerta:

- **SEP-1** — todo dominio serio publica un \`stellar.toml\`: su **tarjeta de identidad on‑chain**. Qué activos emite, qué cuentas son oficiales, dónde viven sus servicios. Las carteras lo leen para distinguir al verdadero emisor de un impostor con el mismo código de activo.
- **SEP-10** — **auth web**: el anclaje envía una *transacción de desafío*, la firmas con la clave de tu cuenta y la devuelves. Propiedad probada, sesión concedida — y el desafío **nunca se envía** al libro contable.

Inicia sesión con una firma: sin contraseña, sin correo electrónico.`,
    },
    {
      kind: "quiz",
      question: `¿Qué demuestra exactamente la autenticación web SEP-10 a un anclaje?`,
      options: [
        "Que controlas la clave secreta de la cuenta — firmando una transacción de desafío que nunca toca el libro contable",
        "Tu identidad legal — SEP-10 realiza la verificación KYC por sí mismo",
        "Que tu cuenta tiene suficiente XLM para pagar las tarifas del anclaje",
      ],
      answer: 0,
      explain: `SEP-10 es pura prueba de propiedad de la clave. La identidad legal es un estándar separado (SEP-12) que los anclajes aplican *después* de que te autenticas — firma primero, papeleo después.`,
    },
    {
      kind: "theory",
      body: `## Las puertas en funcionamiento: 24, 31, 41

- **SEP-24** — depósito y retiro *interactivo*. Tu cartera abre la vista web alojada por el anclaje; el anclaje gestiona los formularios KYC y los datos bancarios; los tokens llegan cuando la transferencia se liquida. La rampa cotidiana para personas.
- **SEP-31** — pagos transfronterizos entre *empresas*: un anclaje emisor y un anclaje receptor liquidan sobre Stellar mientras cada uno maneja sus rieles locales.
- **SEP-41** — un viejo amigo: la **interfaz de token** estándar para contratos Soroban, la que habla todo Contrato de Activo Stellar.

Rampas para gente, rieles para instituciones, un dialecto de token para contratos.`,
    },
    {
      kind: "fill",
      prompt: `¿Dónde encuentra una cartera la tarjeta de identidad de un dominio?`,
      file: "discovery.txt",
      before: `https://anchor.example/`,
      after: `  →  activos, cuentas oficiales y endpoints de servicio`,
      choices: [
        ".well-known/stellar.toml",
        "api/v2/anchor-manifest.json",
        "stellar/config.xml",
        "identity.pdf",
      ],
      answer: 0,
      explain: `SEP-1, el estándar más simple de todos: un archivo TOML en una ruta bien conocida. Demuestra que posees el dominio, lista tus cuentas emisoras en el archivo, y las carteras pueden mostrar "emitido por anchor.example" como un hecho, no como una corazonada.`,
    },
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
  ],
};
