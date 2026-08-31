import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Los Contratos Vivos",
  tagline: "Soroban: Wasm en el libro mayor, y tres estantes donde poner estado.",
  steps: [
    {
      kind: "theory",
      body: `## Los contratos entran al reino

**Soroban** es la plataforma de contratos inteligentes de Stellar. Un contrato es **Rust compilado a WebAssembly**, subido al libro mayor y ejecutado dentro de un host aislado — todo el poder que tiene (almacenamiento, criptografía, llamadas a otros contratos) llega a través de **funciones de host** que el protocolo provee.

Y aquí está la parte elegante: llamar a uno no necesita un nuevo formato de transacción. El sobre que desglosaste lleva una sola operación — \`invoke_host_function\` — y dentro viaja la llamada: qué contrato, qué función, qué argumentos.

Mismo sobre, mismas firmas, mismo cierre de ~5 segundos. El reino clásico y el reino de los contratos comparten una sola corriente sanguínea.`,
    },
    {
      kind: "theory",
      body: `## Tres estanterías de almacenamiento

Soroban le da a un contrato tres niveles de almacenamiento — elegidos por entrada, con precios diferentes:

- **Temporal** — barato, de corta duración, desaparece para siempre una vez que expira. Cotizaciones de precios, nonces, estado con límite de tiempo.
- **Persistente** — el archivo real: saldos de usuarios, registros de propiedad. Sobrevive a la expiración mediante *archivado* (próximo paso).
- **Instancia** — pequeño estado pegado al propio contrato: dirección del administrador, configuración, los metadatos que necesita cada llamada.

Elegir la estantería equivocada es un error clásico de novato: el inflado de instancia hace que cada llamada lo lleve consigo, y los saldos temporales simplemente desaparecen. La estantería *es* parte del diseño.`,
    },
    {
      kind: "diagram",
      body: "Tres estantes, tres vidas:",
      caption: "El estado se alquila, no se posee. Un contrato que nadie toca deja de pagar alquiler y sus datos se enfrían.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "instance",
            label: "instancia",
            note: "La configuración del propio contrato, que vive y muere con él.",
            tone: "gold",
          },
          {
            id: "persistent",
            label: "persistente",
            note: "Saldos de usuario y todo lo que debe sobrevivir. Archivado si vence el alquiler: recuperable, no perdido.",
            tone: "accent",
          },
          {
            id: "temporary",
            label: "temporal",
            note: "Barato y de vida corta, para lo que puede desaparecer: nonces, sesiones, límites de tasa.",
            tone: "teal",
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## La interfaz viaja con el contrato

Un contrato Soroban compilado no es un blob misterioso. La compilación inserta una **especificación de contrato** dentro del propio Wasm: cada función, argumento y tipo, legible por máquinas.

Las herramientas beben directamente de ella — la CLI puede imprimir la interfaz de un contrato desplegado, y los clientes **generan automáticamente enlaces tipados** a partir del Wasm on‑chain. No hay que buscar archivos ABI JSON, no hay desalineación de versiones entre el contrato y su documentación: el ledger *es* la documentación.

Llama a un contrato que nunca has visto, con tipos verificados en tiempo de compilación. Esa es la experiencia de desarrollo que la spec compra.`,
    },
    { kind: "quiz",
      question: `Vas a guardar el nonce de sesión de un usuario, que no significa nada a los pocos minutos de emitirse. ¿Qué estante?`,
      options: ["Temporal — el alquiler más barato, y olvidarlo es exactamente lo que quieres","Persistente, para poder restaurarlo si llega una llamada tardía","De instancia, para que desaparezca si el contrato se archiva algún día"],
      answer: 0,
      explain: `Casar el estante con la vida real del dato es toda la decisión de diseño, y es una que la gente falla en la dirección que parece segura: poner datos de vida corta en el estante persistente cuesta más para siempre, por una garantía que el dato nunca necesitó.` },
    { kind: "fill",
      prompt: `Completa lo que un contrato desplegado lleva consigo:`,
      file: "NOTES.md",
      before: `Quien llama no necesita tu documentación para invocar un contrato, porque su `,
      after: ` puede leerse del propio código desplegado.`,
      choices: ["interfaz", "código fuente", "dirección del autor", "informe de auditoría"],
      answer: 0,
      explain: `El fuente no está en el libro mayor — el Wasm compilado sí — y ni una dirección ni una auditoría le dicen a una herramienta qué funciones existen o qué reciben. Que la interfaz viaje con el código es la razón de que el instrumental pueda construir una llamada contra un contrato que nadie documentó.` },
    {
      kind: "labLink",
      labSlug: "oz-token-wizard",
      body: `La Forja ya tiene un lab para esto: abre el **OpenZeppelin Token Wizard**, configura un contrato de token OZ real y compílalo en el runner Soroban de la propia Forja — spec, estanterías de almacenamiento y todo. Cuando el runner devuelva tu Wasm, este capítulo será la teoría que sostiene cada byte.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "soroban-smart-contracts-1",
      body: `El Acto VII de la Campaña pone a trabajar el verificador de préstamos con todo esto — escribes el Rust, compilas el Wasm y ves cómo \`invoke_host_function\` lleva *tu* código al ledger. La inmersión completa está ahí siempre que la necesites.

Próximo capítulo, una vuelta: contratos tan capaces que dejan de ser apps — y se convierten en la **cuenta misma**.`,
    },
    { kind: "theory", body: `## Aquí nada es gratis

Ya sabes decir qué es un contrato Soroban, dónde viven sus datos, y cómo cualquiera lo llama sin tu documentación.

Lo que nada de eso te dijo es la parte que quita el sueño a los equipos: **el estado se alquila, no se posee.** Cada entrada en cada estante tiene un reloj, y los estantes se diferencian en exactamente una cosa que importa — qué pasa cuando un reloj llega a cero.

Equivocarse en eso no parece un bug. Parece un contrato que funcionó seis meses y luego, un martes, empezó a responder que el dato no existe.

**A continuación:** el latido, y la factura.` },
  ],
  testOut: [
    { question: `¿Qué es un contrato Soroban, en el libro mayor?`,
      options: ["Wasm compilado almacenado en el libro mayor, con dirección, invocado por una operación de transacción como cualquier otro verbo","Un script que los validadores interpretan desde el fuente en el momento de la llamada","Un servicio fuera de la cadena al que el protocolo llama cuando hace falta"], answer: 0 },
    { question: `¿Por qué Soroban ofrece tres tipos de almacenamiento en vez de uno?`,
      options: ["Datos distintos tienen valor distinto con el tiempo, y los estantes los tarifan y caducan de forma distinta","Cada tipo está optimizado para un tamaño de dato diferente","Los contratos antiguos usan uno y los nuevos otro"], answer: 0 },
    { question: `¿Qué significa que la interfaz viaja con el contrato?`,
      options: ["La especificación del contrato se lee desde el propio código desplegado, así que las herramientas pueden llamarlo sin documentación externa","La interfaz se registra en un directorio público que mantiene la SDF","Quien llama debe recibir una biblioteca cliente del autor del contrato"], answer: 0 },
    { question: `¿Dónde viaja una llamada a contrato?`,
      options: ["Dentro del mismo sobre de transacción que ya conoces, como una operación invoke_host_function","En un canal separado solo para contratos, con su propio consenso","Directamente a un validador por RPC, sin pasar por el libro mayor"], answer: 0 },
  ],
};
