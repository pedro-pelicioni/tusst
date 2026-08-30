import type { Concept } from "../types";

export const theVeiledLedger: Concept = {
  meta: {
    slug: "the-veiled-ledger",
    title: "El Libro Velado",
    tagline: "Tokens confidenciales, pagos privados — privacidad con un respaldo de cumplimiento.",
    numeral: "VIII",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 16,
    sigil: "/v2/journey/sigils/the-veiled-ledger.webp",
    glyph: "🕯️",
  },
  steps: [
    {
      kind: "theory",
      body: `## La transparencia es una característica — hasta que se filtra

Todo lo que has construido hasta ahora es radicalmente público: cada saldo, cada pago, cada contraparte, para siempre.

Para las finanzas eso suele ser *el* punto de venta — reservas auditables, vías verificables. Pero al aplicarlo a un negocio real corta en otra dirección:

- Pagas salarios en cadena y **cada empleado puede leer el salario de los demás**.
- Pagas a un proveedor y tus **competidores leen tus precios y volúmenes**.
- Mueves la tesorería y el mercado anticipa tu intención.

El dinero serio necesita *silencio selectivo*. La pregunta es cómo un libro público puede guardar secretos sin convertirse en uno.`,
    },
    {
      kind: "diagram",
      body: "El mismo pago, visto desde dos lados:",
      caption: "Nada de esto está cifrado hoy. Cada línea es pública por diseño: esa es la función, y la fuga.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "explorer",
            label: "lo que cualquiera lee",
            tone: "bad",
          },
          {
            id: "you",
            label: "lo que querías compartir",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "el importe",
            cells: [
              {
                text: "la cifra exacta, para siempre",
                tone: "bad",
              },
              {
                text: "que hubo un pago",
                tone: "good",
              },
            ],
          },
          {
            label: "la contraparte",
            cells: [
              {
                text: "su dirección, y todo lo demás que hizo",
                tone: "bad",
              },
              {
                text: "nada sobre ella",
                tone: "good",
              },
            ],
          },
          {
            label: "tu nómina",
            cells: [
              {
                text: "cada sueldo, comparable lado a lado",
                tone: "bad",
              },
              {
                text: "no es asunto de nadie",
                tone: "good",
              },
            ],
          },
          {
            label: "tu caja",
            cells: [
              {
                text: "tu saldo, hasta el stroop",
                tone: "bad",
              },
              {
                text: "no es asunto de nadie",
                tone: "good",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Prueba sin divulgación

La respuesta proviene del regalo más extraño de la criptografía: la **prueba de conocimiento cero**.

Una prueba ZK convence a un verificador de que una afirmación es verdadera — *"esta cantidad oculta es positiva, y mi saldo oculto la cubre"* — sin revelar **nada más**: ni la cantidad, ni el saldo.

La prueba es un pequeño fragmento de matemáticas que cualquiera puede comprobar de forma barata, y la verificación no requiere confianza en quien la genera. Si verifica, la afirmación es válida. Punto.

Inserta tal verificador dentro de las reglas del libro, y la cadena puede imponer honestidad sobre números que nunca se le permite ver.`,
    },
    {
      kind: "theory",
      body: `## El reino forja las herramientas

La verificación en cadena necesita matemáticas pesadas específicas como **funciones de host** — y Stellar lo entregó en capas:

- **CAP-59** introdujo operaciones de curva **BLS12-381**, habilitando la verificación de pruebas **Groth16** dentro de contratos Soroban.
- **Protocolos 25 y 26** añadieron la curva **BN254** y el **hash Poseidon** — un hash diseñado para ser barato *dentro* de circuitos ZK.

Esa segunda ola fue la que inclinó la balanza: hizo **prácticos los sistemas de pago privado** en Stellar. Los primitivos están a nivel de protocolo, así que cualquier contrato verifica pruebas a velocidad nativa — sin una penalización de mil veces el costo por hacer criptografía honestamente.`,
    },
    {
      kind: "quiz",
      question: `¿Qué aprende un verificador ZK en cadena cuando acepta una prueba?`,
      options: [
        "Solo que la afirmación probada es verdadera — los valores ocultos permanecen ocultos",
        "Los valores subyacentes, que verifica y luego descarta",
        "Nada en absoluto — la aceptación es un marketing probabilístico",
      ],
      answer: 0,
      explain: `Esa asimetría es todo el truco: la validez se vuelve pública mientras los datos siguen privados. El libro puede imponer "nadie gasta lo que no tiene" sin leer nunca un saldo.`,
    },
    {
      kind: "theory",
      body: `## Tokens confidenciales: ocultando los montos

**Tokens confidenciales** llegaron a vista previa para desarrolladores en **junio de 2026**, creados por **OpenZeppelin y Nethermind**. El diseño es elegantemente no intrusivo:

- Un **contrato wrapper** sobre cualquier token **SEP-41** existente — USDC a través de su Contrato de Activo Stellar, tokens nativos del contrato, cualquier cosa que siga el estándar.
- Envuelve tus tokens y tu **saldo y montos de transferencia quedan ocultos**, protegidos por pruebas de conocimiento cero.
- **Las direcciones siguen públicas**: el explorador aún ve *quién* transaccionó con *quién* — solo que no ve *cuánto*.

Construido para partes que se conocen pero deben mantener cifras privadas: nóminas, facturas de proveedores, liquidaciones B2B.`,
    },
    {
      kind: "theory",
      body: `## Pagos privados de Stellar: ocultando a las contrapartes

Un velo más profundo. **Pagos Privados de Stellar (SPP)**, creados por **Nethermind**, llegaron a **vista previa para desarrolladores en testnet en agosto de 2026**.

En lugar de envolver un token, los usuarios **depositan activos en un pool compartido**. Las transferencias ocurren *dentro* del pool — y un observador externo ya no puede enlazar remitente con receptor. No solo los montos: las **contrapartes mismas están ocultas**.

Donde los Tokens Confidenciales sirven a partes que se conocen, SPP cubre casos donde *quién pagó a quién* es el propio secreto — donaciones, relaciones sensibles con proveedores, finanzas personales en vías públicas.`,
    },
    {
      kind: "diagram",
      body: "Sigue un pago a través del pool y mira qué se queda el explorador:",
      caption:
        "Los bordes son públicos por construcción. Todo lo que el pool protege ocurre entre ellos.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "deposit",
            label: "Depósito",
            tone: "gold",
            note: "Visible. El explorador registra que esta cuenta puso fondos en el pool, y cuánto. Aquí no se oculta nada — ni hace falta.",
          },
          {
            id: "inside",
            label: "Dentro del pool",
            tone: "accent",
            note: "Oculto. Las transferencias entre miembros del pool no necesitan aparecer on-chain: sin emisor, sin receptor, sin monto. Esta es la parte que cubre el velo.",
          },
          {
            id: "withdraw",
            label: "Retiro",
            tone: "gold",
            note: "Visible otra vez. Alguien sale del pool con un valor — pero unir ESTA salida con AQUELLA entrada es justo lo que el pool rompe.",
          },
          {
            id: "observer",
            label: "Lo que le queda al observador",
            tone: "neutral",
            note: "Dos bordes públicos y una multitud en medio. Cuanto mayor sea el pool, más débil es el vínculo entre cualquier entrada y cualquier salida.",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## La columna vertebral de cumplimiento

"Privado" sin límites es la pesadilla de un oficial de sanciones, y estos diseños se niegan a llegar allí. SPP combina confidencialidad con **salvaguardas de cumplimiento integradas**:

- **Participación gated por KYC** — unirse al pool requiere identidad verificada.
- **Controles de acceso a nivel de identidad** — los permisos se asignan a *quién eres*, no solo a qué clave posees.
- **Capacidad de congelar a nivel de cuenta** — los actores malintencionados pueden ser detenidos incluso dentro del velo.

Esas tres salvaguardas las aplica una pieza que conviene conocer por su nombre: el **Association Set Provider (ASP)**. Un ASP publica un *conjunto* de depósitos por los que responde — una allow list — o aquellos por los que se niega a responder — una deny list. Para retirar, demuestras que tus fondos se remontan a algún depósito dentro de ese conjunto, **sin revelar cuál**. El SPP lo construye sobre un association set basado en claves, respaldado por un registro público de claves para que los participantes puedan siquiera ser referenciados.

Detente en la consecuencia, porque es todo el truco: **el mismo retiro es privado y auditable a la vez**. Privado, porque el vínculo con tu depósito concreto nunca se publica. Auditable, porque no habrías podido retirar sin demostrar pertenencia a un conjunto avalado. Distintos ASP pueden atender distintas jurisdicciones — y tú eliges de quién llevas el aval.

El objetivo en una frase: **privacidad para los usuarios, no para el crimen**. Transferencias confidenciales *y* compatibles en vías públicas — esa combinación, no el secreto absoluto, es lo que las instituciones estaban esperando.`,
    },
    {
      kind: "quiz",
      question: `Un explorador observa una transferencia de Token Confidencial y una transferencia de pool SPP. ¿Qué ve en cada caso?`,
      options: [
        "CT: las dos direcciones pero no el monto; SPP: ni siquiera las contrapartes — valor movido dentro del pool compartido",
        "Ambos ocultan montos y direcciones idénticamente — SPP es solo la versión más barata",
        "CT oculta las direcciones pero muestra los montos; SPP muestra todo a los espectadores con KYC",
      ],
      answer: 0,
      explain: `Dos capas, dos velos. Los Tokens Confidenciales ocultan *cuánto* entre partes conocidas; el pool compartido de SPP también oculta *quién*. Elige la capa que coincida con lo que tu caso de uso necesita mantener en silencio.`,
    },
    {
      kind: "fill",
      prompt: `¿Qué puede envolver un Token Confidencial?`,
      file: "veil.txt",
      before: `token confidencial  =  wrapper ZK sobre cualquier token  `,
      after: ` — importes ocultos, direcciones públicas`,
      choices: ["SEP-41", "SEP-24", "SEP-10", "SEP-1"],
      answer: 0,
      explain: `El estándar de interfaz del token es el punto de enganche: cualquier cosa que hable SEP-41 puede ser envuelta — incluidos activos clásicos como USDC a través de su Contrato de Activo Stellar. La capa de privacidad se compone con todo lo que ya conoces.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `En el yunque de la forja: un laboratorio de **Tokens Confidenciales**, donde envolverás un token de testnet y verás cómo los montos desaparecen del explorador mientras la transferencia se liquida honestamente. Su tarjeta indica *en proceso de forja* — esta frontera se está trabajando mientras lees.

Observa cuán recientes son estas fechas. Montar tecnología tan fresca implica leer el pulso mismo del protocolo — el capítulo final te muestra cómo.`,
    },
  ],
};
