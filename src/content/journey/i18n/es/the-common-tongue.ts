import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Lengua Común",
  tagline: "SEPs — impleméntalo una vez, y toda puerta se abre.",
  steps: [
    { kind: "theory", body: `## La aritmética que obliga a que exista un estándar

Cuenta las integraciones. Diez billeteras, diez puertas, cada par necesitando su propio flujo de depósito, su propio login, su propia forma de pedir la foto del pasaporte: **cien integraciones a medida** — y ciento veintiuna en cuanto aparezca una undécima de cualquiera de los dos lados.

Eso no es un modo de fallo hipotético. Es lo que le pasó a la generación anterior de fontanería de pagos, y por eso enviar dinero al extranjero ha significado históricamente pedirle a un banco que le pida a otro banco.

Solo hay dos salidas del N×M. Una es el monopolio: todos se integran con la única puerta que ganó, en sus términos. La otra es un **estándar** — un documento público que dice exactamente cómo habla cualquier billetera con cualquier puerta, para que ambos lados construyan contra el documento en vez de el uno contra el otro.

Stellar tomó el segundo camino, y los documentos tienen nombre.` },
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
      body: `## Las puertas en funcionamiento: 24, 31, 41

- **SEP-24** — depósito y retiro *interactivo*. Tu cartera abre la vista web alojada por el anclaje; el anclaje gestiona los formularios KYC y los datos bancarios; los tokens llegan cuando la transferencia se liquida. La rampa cotidiana para personas.
- **SEP-31** — pagos transfronterizos entre *empresas*: un anclaje emisor y un anclaje receptor liquidan sobre Stellar mientras cada uno maneja sus rieles locales.
- **SEP-41** — un viejo amigo: la **interfaz de token** estándar para contratos Soroban, la que habla todo Contrato de Activo Stellar.

Rampas para gente, rieles para instituciones, un dialecto de token para contratos.`,
    },
    { kind: "theory", body: `## Un estándar no es un sello de aprobación

Aquí está la confusión que conviene cortar de raíz, porque es la que le cuesta dinero a la gente.

Una puerta que implementa SEP-1, SEP-10 y SEP-24 te ha dicho exactamente una cosa: **su fontanería funciona**. Publica un archivo diciendo quién afirma ser. Sabe verificar una firma. Sabe ejecutar un flujo de depósito que tu billetera sabe abrir.

No te ha dicho nada sobre si los dólares existen, si la entidad está licenciada en algún sitio, si la custodia está segregada, o si alguien responderá cuando intentes reembolsar. Cualquiera puede alojar un \`stellar.toml\`. El archivo es una afirmación de identidad, no un certificado de solvencia — SEP-1 hace que un emisor sea **identificable**, lo cual es condición previa para la confianza y no un sustituto de ella.

Así que lee los estándares por lo que son: hacen el ecosistema *interoperable*, no *seguro*. Lo primero es un problema de protocolo, resuelto. Lo segundo es diligencia, y sigue siendo tuya.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## La prueba del examinador: elige la lengua

Estás construyendo una billetera para un corredor:

> Usuarios en Brasil tienen BRL en un banco. Quieren enviar dinero a familia en Portugal, que retira euros a una cuenta local. Integrarás con un anchor brasileño y uno portugués, y no controlas ninguno de los dos.

Escribe el **plan de integración como una secuencia de estándares**. Para cada paso: qué SEP, qué te da, y qué se rompería si lo saltaras. Después nombra una cosa de este corredor que ningún SEP te va a resolver.

Solo estándares y comportamiento — sin endpoints, sin llamadas de SDK, sin código.`,
      rubric: `1. Nombra los estándares en un orden que funciona, empezando por descubrir quién es el anchor antes de autenticarse ante él.
2. Para cada estándar nombrado, dice concretamente qué aporta — no solo su número o su título.
3. Dice qué se rompería si al menos uno de los pasos se saltara.
4. Nombra al menos un problema real del corredor que los estándares no resuelven (riesgo cambiario, licencias, liquidez en alguna de las puertas, rechazo de KYC, fallo de reembolso…).
5. Solo estándares y comportamiento — sin rutas de endpoint, sin nombres de método de SDK, sin código.`,
      minChars: 180 },
    { kind: "theory", body: `## Donde termina el reino clásico

Haz balance de lo que ya sabes leer: consenso, sobres, cuentas y activos, los mercados dentro del libro mayor, el pago que cruza monedas, las puertas en ambos bordes, y los estándares que hacen cooperar a esas puertas.

Cada una de esas cosas es **maquinaria integrada en el protocolo**. La configuraste, la pagaste, enrutaste por ella — pero no escribiste nada de ella. Las reglas ya estaban ahí, decididas por gente que no eres tú.

**A continuación:** la parte del reino que programas tú, donde un contrato es algo que despliegas y hasta su almacenamiento tiene latido.` },
  ],
  testOut: [
    { question: `¿Qué problema existe para resolver un SEP?`,
      options: ["Fontanería a medida N×M — con un estándar público, cualquier billetera funciona con cualquier puerta que lo implemente","Liquidación lenta entre billeteras y anchors","La ausencia de un registro central de anchors aprobados"], answer: 0 },
    { question: `¿Qué prueba exactamente la autenticación SEP-10 ante un anchor?`,
      options: ["Que controlas la clave secreta de la cuenta — firmando una transacción de desafío que nunca se envía al libro mayor","Tu identidad legal, ya que SEP-10 realiza el propio KYC","Que la cuenta tiene XLM suficiente para cubrir las comisiones del anchor"], answer: 0 },
    { question: `¿Dónde encuentra una billetera la tarjeta de identidad on-chain de un dominio?`,
      options: ["En un stellar.toml en una ruta conocida del dominio — SEP-1, el más simple de todos los estándares","En un contrato de registro que la SDF mantiene en mainnet","En las entradas manage_data de la cuenta emisora"], answer: 0 },
    { question: `¿Qué estándar es la rampa interactiva de depósito y retiro del día a día, para humanos?`,
      options: ["SEP-24 — la billetera abre el flujo alojado del anchor, que gestiona el KYC y los datos bancarios","SEP-31, que liquida pagos transfronterizos entre empresas","SEP-41, la interfaz de token que hablan los contratos Soroban"], answer: 0 },
  ],
};
