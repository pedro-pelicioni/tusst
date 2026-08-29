import type { Concept } from "../types";

// Chapter VII — smart accounts: the signing rule becomes code. Passkeys
// instead of seed phrases, policies instead of prayers, sponsored fees
// instead of "first, go buy XLM". Onboarding that finally feels like Web2.

export const walletsWithoutSeeds: Concept = {
  meta: {
    slug: "wallets-without-seeds",
    title: "Carteras sin semillas",
    tagline: "Cuentas inteligentes, claves de paso y tarifas que paga otro.",
    numeral: "VII",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/wallets-without-seeds.webp",
    glyph: "🛡️",
  },
  steps: [
    {
      kind: "theory",
      body: `## El problema de las veinticuatro palabras

Las carteras tradicionales saludan a un nuevo usuario con un ritual: *anota estas 24 palabras; si las pierdes, tu dinero se va para siempre; si se las muestras a cualquiera, se va más rápido.*

Las personas reales fallan esta prueba constantemente — capturas de pantalla, notas en cajones, copias de seguridad que nunca se hicieron. Fortunas enteras se evaporaron por una nota adhesiva perdida. Y la mayoría de los usuarios nunca llega tan lejos: **el onboarding muere en la pantalla de la frase semilla**.

Si las vías de la cadena van a transportar salarios y la compra del supermercado, la ceremonia de la clave tiene que desaparecer. En Stellar puede — porque una cuenta no tiene que *ser* un par de claves.`,
    },
    {
      kind: "theory",
      body: `## Cuentas que son contratos

Una cuenta clásica se autentica de una manera: el protocolo verifica firmas ed25519 contra su lista de firmantes. Lógica fija, para siempre.

Una **cuenta inteligente** es diferente: *es* un contrato Soroban, y cuando una transacción reclama su autoridad, el protocolo llama a la función \`__check_auth\` del contrato y pregunta: *"¿aceptas esto?"*

La regla de firma se convierte en **código que tú escribiste**. Verificar una curva distinta. Requerir dos dispositivos por encima de un umbral. Rotar claves después de una brecha sin cambiar la dirección. Cualquier política que puedas expresar en Rust es ahora una especie de firma.`,
    },
    {
      kind: "theory",
      body: `## Claves de paso: la clave que no puedes perder

Tu teléfono ya contiene una bóveda: el **secure enclave**, hardware que firma con claves que nunca salen del chip, desbloqueado por Face ID o una huella. El estándar web para esto es **WebAuthn** — claves de paso — y utiliza la curva **secp256r1**.

Stellar verifica secp256r1 **nativamente**, así que una cuenta inteligente puede aceptar directamente el enclave de tu teléfono como firmante: el hardware biométrico firma, la cadena verifica la firma de la clave de paso por sí misma.

En ningún momento existe una frase semilla. La "cartera" es el mismo hardware que ya protege tu app bancaria — ahora firmando transacciones del libro mayor.`,
    },
    {
      kind: "diagram",
      body: "La misma cuenta, dos formas de guardarla:",
      caption: "La passkey nunca sale del hardware seguro del dispositivo, y por eso no se te puede sacar con phishing.",
      view: {
        kind: "compare",
        columns: [
          {
            id: "seed",
            label: "veinticuatro palabras",
            tone: "bad",
          },
          {
            id: "passkey",
            label: "una passkey",
            tone: "good",
          },
        ],
        rows: [
          {
            label: "dónde vive",
            cells: [
              {
                text: "una captura, una app de notas, un cajón",
                tone: "bad",
              },
              {
                text: "el enclave seguro del dispositivo",
                tone: "good",
              },
            ],
          },
          {
            label: "cómo se pierde",
            cells: [
              {
                text: "basta una foto del papel",
                tone: "bad",
              },
              {
                text: "no se puede copiar hacia fuera",
                tone: "good",
              },
            ],
          },
          {
            label: "para firmar",
            cells: [
              {
                text: "teclear o pegar todo",
                tone: "bad",
              },
              {
                text: "una huella",
                tone: "good",
              },
            ],
          },
          {
            label: "si muere el dispositivo",
            cells: [
              {
                text: "da igual: las palabras son la cuenta",
                tone: "neutral",
              },
              {
                text: "añade un segundo firmante antes de ese día",
                tone: "gold",
              },
            ],
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `En una cartera inteligente con clave de paso, ¿qué reemplaza a la frase semilla?`,
      options: [
        "Nada que memorizar — una clave nacida en el hardware seguro del dispositivo firma, y la cadena la verifica nativamente",
        "Una frase más corta de seis palabras que sea más fácil de recordar",
        "El ancla, que guarda la frase semilla por ti en custodia",
      ],
      answer: 0,
      explain: `La clave privada nunca sale del enclave y nunca se mostró a nadie — no hay nada que escribir, fotografiar o phishing. La recuperación se convierte en una cuestión de política (firmantes adicionales, un dispositivo guardián), no en una prueba de memoria.`,
    },
    {
      kind: "theory",
      body: `## Políticas: firmas con opiniones

Una vez que la regla de autenticación es código, un firmante puede llevar **política**:

- **Límites de gasto** — la clave de paso sola aprueba hasta 50 USDC al día; más allá, se necesita un segundo factor para co-firmar.
- **Contratos permitidos** — un firmante que solo pueda hablar con tu juego, nunca con el DEX.
- **Claves de sesión** — otorga a una dapp su propia clave limitada para la noche; expira por sí sola.

Esto es lo que realmente compra a los usuarios la "programabilidad": barreras de protección impuestas por el libro mayor, no por una promesa en los términos del servicio de la app.`,
    },
    {
      kind: "fill",
      prompt: `¿Qué curva permite que la cadena verifique la firma del enclave seguro del teléfono?`,
      file: "auth-stack.txt",
      before: `Face ID  →  el enclave seguro firma con  `,
      after: `  →  verificada de forma nativa en el ledger`,
      choices: ["secp256r1", "secp256k1", "ed25519", "curve25519"],
      answer: 0,
      explain: `ed25519 es la curva clásica de Stellar y secp256k1 pertenece a Bitcoin y Ethereum. El hardware WebAuthn habla secp256r1 (también conocida como P-256), y el protocolo la verifica nativamente — sin emulación torpe dentro del contrato, sin explosión de costos.`,
    },
    {
      kind: "theory",
      body: `## Tarifas que paga otra persona

Queda una barrera: un usuario recién creado no tiene XLM, y las transacciones cuestan (mínimas) tarifas. Decirle "primero, compra XLM en un exchange" mata la magia.

La respuesta de Stellar es **patrocinio de tarifas**: otra cuenta — típicamente la de la app — envuelve la transacción del usuario y **paga su tarifa**, y también puede patrocinar reservas. La primera acción en cadena del usuario no le cuesta nada y no requiere fondos previos.

Clave de paso más patrocinio juntos: pulsa "crear cuenta", mira Face ID, y estás transaccionando en un libro público — sin visitar un exchange, sin ceremonia de semilla, sin XLM a la vista.`,
    },
    {
      kind: "theory",
      body: `## Protocolo 27 "Zipper": llega la delegación

Las cuentas inteligentes son jóvenes, y el protocolo está pavimentando activamente su camino. **Protocolo 27 — "Zipper"**, activo en mainnet desde **julio de 2026**, lanzó **CAP-71: delegación de autenticación** para cuentas inteligentes.

La delegación permite que una autoridad entregue poder de firma a otra de forma limpia, a nivel de protocolo — lo que **simplifica configuraciones multisig** y **reduce los costos de transacción** para exactamente los patrones de cuenta descritos en este capítulo.

Traducción para constructores: carteras multidispositivo, recuperación con guardián y diseños con políticas pesadas se volvieron más baratos y simples de operar. El protocolo está apostando *por* las cuentas inteligentes, no solo tolerándolas.`,
    },
    {
      kind: "quiz",
      question: `¿Qué cambió CAP-71 en el Protocolo 27 "Zipper" para las cuentas inteligentes?`,
      options: [
        "Delegación de autenticación — simplificando multisig y reduciendo costos de transacción",
        "Hizo que todas las transacciones de cuentas inteligentes fueran gratuitas para siempre",
        "Reemplazó ed25519 por secp256r1 en toda la red",
      ],
      answer: 0,
      explain: `La delegación es infraestructura, no fuegos artificiales: menos firmas que manejar, autenticación multipartita más barata. Las cuentas clásicas ed25519 siguen funcionando exactamente como antes — los dos estilos de cuenta coexisten.`,
    },
    {
      kind: "labLink",
      labSlug: "passkey-smart-wallet",
      body: `La Forja está lista: entra en **Smart Wallet con Passkey**, registra una clave de acceso real, despliega su contrato de cuenta inteligente en la testnet y responde a un nuevo desafío WebAuthn con tu propio dispositivo.

Cuando el libro mayor confirme que el código desplegado es el Wasm canónico de la cuenta inteligente, vuelve al camino. Se curva en un lugar más extraño: un libro mayor donde *las cantidades mismas* llevan un velo.`,
    },
  ],
};
