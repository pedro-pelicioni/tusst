import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "El Libro Velado",
  tagline: "Prueba sin revelación — y el primer velo construido sobre ella.",
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
    { kind: "theory", body: `## El velo que no corriste

Aquí es donde la gente se relaja demasiado pronto. Envolviste la nómina en un Token Confidencial, los importes se apagaron, y el problema parece resuelto.

Mira lo que un observador todavía tiene. Una dirección paga a cuarenta direcciones. Lo hace el día uno de cada mes, y otra vez el quince. Dos de esas cuarenta dejaron de recibir en marzo, y tres nuevas empezaron en abril. Una de ellas recibe de tu dirección y de la de una segunda empresa.

Nadie averiguó un solo sueldo — y un observador ya conoce tu plantilla, tu ciclo de pago, tu rotación, tus contrataciones, y cuáles de tus empleados tienen un segundo trabajo. **Los importes nunca fueron lo único que el libro mayor estaba diciendo.**

Esto no es un defecto de los Tokens Confidenciales; es la forma de lo que prometen. Un velo cubre el campo que elegiste, y todo campo descubierto sigue hablando — horarios, frecuencia, y sobre todo el **grafo** de quién toca a quién.

Que es precisamente por lo que tuvo que existir un segundo sistema, más profundo.` },
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
    { kind: "rustBranch", lessonSlug: "stellar-protocol-27-1",
      body: `Nada de esto fue una biblioteca que alguien publicó. BLS12-381, BN254, Poseidon — cada uno llegó como un **CAP dentro de una versión nombrada del protocolo**, y por eso un contrato verifica una prueba a velocidad nativa en vez de pagar una penalización de mil veces por hacer criptografía en serio. El acto de protocolo de la Campaña es donde ves aterrizar una versión de verdad.` },
    { kind: "theory", body: `## La mitad que suena imposible

Ya tienes un velo para los números. Para nóminas, facturas y liquidación entre partes que ya se conocen, ese es el requisito entero — las cifras eran el secreto.

Pero a veces las cifras no son el secreto. A veces *quién pagó a quién* es lo sensible: una donación, un proveedor que preferirías que la competencia no descubra, una transferencia personal sobre raíles públicos.

Ocultar eso es el velo más profundo, y viene con una objeción obvia — la que cualquier responsable de cumplimiento plantea en el primer minuto, y que conviene tomarse en serio en vez de despachar con la mano.

**A continuación:** el segundo velo, y la respuesta a esa objeción.` },
  ],
  testOut: [
    { question: `¿Cuál es el problema de un libro mayor totalmente transparente, para una empresa?`,
      options: ["Los saldos y los importes son públicos para siempre, así que cualquiera deduce sueldos, márgenes y condiciones de proveedores a partir de pagos corrientes","Las transacciones pueden rastrearse y revertirse por observadores","Los datos públicos hacen el libro mayor más lento de consultar a escala"], answer: 0 },
    { question: `¿Qué permite concluir a un verificador una prueba de conocimiento cero?`,
      options: ["Que una afirmación sobre valores ocultos es cierta, sin aprender nada más sobre esos valores","Que el probador es una parte de confianza, verificada por un tercero","Que los valores ocultos caen en un rango que eligió el verificador"], answer: 0 },
    { question: `¿Por qué estas primitivas tuvieron que llegar como funciones de host del protocolo?`,
      options: ["Para que los contratos verifiquen pruebas a velocidad nativa — la misma matemática en código de contrato tendría una penalización aplastante","Porque los contratos no tienen permiso para hacer criptografía","Para que solo los contratos auditados puedan usarlas"], answer: 0 },
    { question: `Un Token Confidencial envuelve un token existente. ¿Qué cambia y qué no?`,
      options: ["Los saldos y los importes de transferencia quedan ocultos; las direcciones que transaccionan siguen públicas","Las direcciones quedan ocultas; los importes siguen públicos","Ambos quedan ocultos, que es lo que lo hace confidencial"], answer: 0 },
  ],
};
