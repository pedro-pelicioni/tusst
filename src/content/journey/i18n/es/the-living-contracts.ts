import type { Concept } from "../types";

export const theLivingContracts: Concept = {
  meta: {
    slug: "the-living-contracts",
    title: "Los Contratos Vivos",
    tagline: "Soroban: Wasm, almacenamiento que expira, tarifas que tienen sentido.",
    numeral: "VI",
    arc: "realm",
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/the-living-contracts.webp",
    glyph: "📦",
  },
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
      kind: "theory",
      body: `## El estado tiene latido

La mayoría de las cadenas dejan que el estado se acumule para siempre — cada nodo arrastra cada entrada abandonada desde 2019. Stellar se niega: **cada entrada de Soroban tiene un TTL** (tiempo de vida), contado en ledgers, y el alquiler lo extiende.

Cuando el TTL se agota:

- Las entradas **temporales** se eliminan. Desaparecen.
- Las entradas **persistentes** y **de instancia** se **archivan** — se expulsan del libro mayor activo, pero pueden restaurarse más tarde con una prueba, regresando exactamente como estaban.

Esto es **archivado de estado**, y ninguna otra cadena importante lo hace. El libro mayor activo se mantiene ligero, los validadores siguen siendo económicos y la historia permanece recuperable.`,
    },
    {
      kind: "quiz",
      question: `Tu contrato lleva el registro del saldo de tokens de cada usuario. ¿Qué nivel de almacenamiento?`,
      options: [
        "Persistente — los saldos deben sobrevivir a cualquier lapsus de TTL y poder restaurarse desde el archivo",
        "Temporal — es el más barato, y los usuarios pueden volver a depositar si expira",
        "Instancia — los saldos pertenecen al contrato, así que viajan con él",
      ],
      answer: 0,
      explain: `La eliminación temporal es *permanente* — un saldo desaparecido es una estafa por negligencia. Y el almacenamiento de instancia se carga en cada llamada, de modo que almacenar datos por usuario allí hace que todos paguen por todos.`,
    },
    {
      kind: "fill",
      prompt: `Coloca el saldo en la estantería correcta.`,
      file: "token/src/lib.rs",
      before: `env.storage().`,
      after: `().set(&user, &balance);`,
      choices: ["persistent", "temporary", "instance", "eternal"],
      answer: 0,
      explain: `El SDK de soroban refleja los niveles uno a uno: \`env.storage().persistent()\`, \`.temporary()\`, \`.instance()\`. No existe \`eternal\` — ese es todo el punto del diseño de alquiler.`,
    },
    {
      kind: "theory",
      body: `## Tarifas que se miden, no que se subastan

En cadenas con subasta de gas se *puja* por espacio de bloque y se reza; una moneda popular puede multiplicar los costos de todos.

Soroban **mide** en su lugar. Una transacción declara sus **recursos** — instrucciones de CPU, memoria, lecturas y escrituras del ledger, bytes — y la tarifa se *calcula* a partir de esas necesidades medidas, más el alquiler por el almacenamiento que toca. Declara honestamente (la simulación lo hace por ti) y la parte reembolsable de cualquier sobreestimación vuelve a ti.

El resultado es un costo que puedes cotizar de antemano: “esta acción cuesta alrededor de un centavo” sigue siendo cierto incluso cuando la red tiene un día muy ocupado.`,
    },
    {
      kind: "theory",
      body: `## Simula primero, firma exactamente eso

Cada cliente de Soroban sigue un ritmo:

1. **Simular** la llamada contra un nodo RPC — sin firma, sin costo.
2. La simulación devuelve la **huella** — precisamente qué entradas del ledger leerá y escribirá la llamada — más estimaciones de recursos y la autorización que necesita.
3. **Firma exactamente lo que simulaste** y envía.

La transacción firmada lleva su huella, de modo que los validadores conocen todo su mundo antes de ejecutarla; nada fuera de la huella puede tocarse. Omitir la simulación es adivinar números que la red simplemente rechazará.`,
    },
    {
      kind: "quiz",
      question: `¿Por qué el flujo de Soroban simula antes de firmar?`,
      options: [
        "La simulación calcula la huella y las necesidades de recursos, así firmas una transacción con límites exactos y aplicables",
        "Es una corrida de cortesía para depurar — las apps de producción la omiten",
        "La simulación pre‑ejecuta la llamada para que los validadores no tengan que volver a ejecutarla",
      ],
      answer: 0,
      explain: `Los validadores siempre re‑ejecutan — pero solo dentro de la huella declarada. La simulación es cómo una transacción aprende sus propios límites; el ledger luego los hace cumplir al pie de la letra.`,
    },
    {
      kind: "theory",
      body: `## La interfaz viaja con el contrato

Un contrato Soroban compilado no es un blob misterioso. La compilación inserta una **especificación de contrato** dentro del propio Wasm: cada función, argumento y tipo, legible por máquinas.

Las herramientas beben directamente de ella — la CLI puede imprimir la interfaz de un contrato desplegado, y los clientes **generan automáticamente enlaces tipados** a partir del Wasm on‑chain. No hay que buscar archivos ABI JSON, no hay desalineación de versiones entre el contrato y su documentación: el ledger *es* la documentación.

Llama a un contrato que nunca has visto, con tipos verificados en tiempo de compilación. Esa es la experiencia de desarrollo que la spec compra.`,
    },
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
  ],
};
