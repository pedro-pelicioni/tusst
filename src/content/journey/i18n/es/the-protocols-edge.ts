import type { Concept } from "../types";

export const theProtocolsEdge: Concept = {
  meta: {
    slug: "the-protocols-edge",
    title: "La frontera del protocolo",
    tagline: "CAPs, SEPs y actualizaciones con nombre: navegar un protocolo vivo.",
    numeral: "IX",
    arc: "realm",
    level: 2,
    status: "live",
    estMinutes: 11,
    sigil: "/v2/journey/sigils/the-protocols-edge.webp",
    glyph: "⚡",
  },
  steps: [
    {
      kind: "theory",
      body: `## Un protocolo que evoluciona

Todo lo que has estudiado — SCP, pagos por ruta, Soroban, funciones host ZK — llegó en **versiones numeradas del protocolo**, y siguen llegando nuevas.

Las actualizaciones de Stellar no son bifurcaciones caóticas. **Los validadores votan**: cuando una parte suficiente de la red está de acuerdo, la actualización se activa en un ledger elegido y todos los nodos avanzan **juntos**. Una red antes, una red después.

Eso es SCP cumpliendo una doble función: el mismo consenso que acuerda las transacciones también acuerda *las propias reglas*. Una blockchain es software; esta publica versiones como si lo supiera.`,
    },
    {
      kind: "theory",
      body: `## Dos ríos de cambio: CAPs y SEPs

El cambio fluye por dos canales, y vale la pena memorizar la diferencia:

- **CAPs** — *Core Advancement Proposals* — cambian el **propio protocolo**: consenso, reglas del ledger, nuevas funciones host y mecánica de tarifas. Necesitan los votos de los validadores porque cada nodo debe ejecutarlas de forma idéntica.
- **SEPs** — *Stellar Ecosystem Proposals* — son los estándares **alrededor** de la cadena: flujos entre wallets y anchors, interfaces de tokens y stellar.toml. Se adoptan mediante implementaciones, no por votación.

La ley de la cadena frente a las costumbres del comercio. La CAP-59 aportó las curvas ZK; la SEP-24, los flujos de depósito. Ríos distintos, ambos públicos y moldeados en debates abiertos.`,
    },
    {
      kind: "diagram",
      body: "Cómo un cambio llega al ledger sobre el que construyes:",
      caption: "Nadie actualiza tu código por ti, pero tampoco nadie cambia las reglas bajo tus pies de la noche a la mañana.",
      view: {
        kind: "flow",
        layout: "row",
        play: true,
        nodes: [
          {
            id: "draft",
            label: "se redacta un CAP",
            note: "Cualquiera puede escribirlo. Defiende un cambio en el propio protocolo.",
            tone: "neutral",
          },
          {
            id: "review",
            label: "revisión en abierto",
            note: "Discutido, revisado y a menudo rechazado. Esa es la parte lenta, a propósito.",
            tone: "accent",
          },
          {
            id: "vote",
            label: "los validadores votan",
            note: "La red se actualiza solo cuando suficientes validadores aceptan ejecutarlo.",
            tone: "teal",
          },
          {
            id: "you",
            label: "tu turno",
            note: "Sube el SDK, vuelve a pasar tus pruebas, redespliega. La fecha es pública con meses de antelación.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Quieres (a) una nueva función host en el protocolo y (b) un nuevo flujo entre una wallet y un anchor. ¿Qué documentos escribes?`,
      options: [
        "(a) una CAP, porque cambia el núcleo; (b) una SEP, porque es un estándar del ecosistema",
        "(a) una SEP, porque las funciones host pertenecen al ecosistema; (b) una CAP, porque los anchors son parte del núcleo",
        "Ambas son CAPs; las SEPs solo sirven para listar tokens",
      ],
      answer: 0,
      explain: `La prueba es esta: ¿todos los validadores deben ejecutarlo de forma idéntica? Entonces forma parte del núcleo y requiere una CAP. Si es una convención que varios servicios acuerdan mediante HTTP, es una SEP.`,
    },
    {
      kind: "theory",
      body: `## El ritmo reciente, con nombre propio

Las actualizaciones ahora tienen nombres, y el ritmo es ágil:

- **Protocol 26 "Yardstick"** — una versión centrada en la precisión y la fiabilidad; junto con Protocol 25 completó el conjunto de herramientas ZK BN254 + Poseidon del capítulo anterior.
- **Protocol 27 "Zipper"** — llegó a mainnet en **julio de 2026** e incorporó la delegación de autenticación de la **CAP-71** para smart accounts.
- **Protocol 28 "Adapter"** — **testnet se actualizó el 27 de agosto de 2026**; la actualización de mainnet está programada para el **16 de septiembre de 2026**.

Aproximadamente una estación entre versiones, cada una con nombre y anunciada junto con sus guías de actualización. El reino no deriva hacia el futuro: avanza según un calendario publicado.`,
    },
    {
      kind: "theory",
      body: `## Lo que una actualización exige de ti

Una versión del protocolo también es una **versión de las herramientas**. Las versiones mayores de los SDK siguen las versiones del protocolo: **js-stellar-sdk v17.0.0 es la versión para Protocol 28**. Cuando la red avanza a 28, tú avanzas al SDK creado para esa versión.

La rutina de quien construye:

1. Lee la **guía de actualización** cuando se anuncie la versión.
2. Actualiza los SDK y la CLI en una rama.
3. **Prueba en testnet durante ese intervalo**: testnet se actualiza semanas antes que mainnet precisamente para darte tiempo.

A finales de agosto de 2026 ese intervalo está **abierto ahora mismo**: testnet ya ejecuta 28; mainnet le sigue el 16 de septiembre.`,
    },
    {
      kind: "quiz",
      question: `Es principios de septiembre de 2026 y tu aplicación funciona en mainnet (Protocol 27). ¿Cuál es la decisión profesional?`,
      options: [
        "Apuntar staging a testnet —que ya usa Protocol 28—, actualizar al SDK v17 y corregir cualquier problema antes de que mainnet se actualice el 16 de septiembre",
        "No hacer nada: las actualizaciones de mainnet siempre son totalmente compatibles con los SDK antiguos",
        "Congelar todos los despliegues hasta que el protocolo lleve un año estable",
      ],
      answer: 0,
      explain: `El intervalo en el que testnet se actualiza primero existe precisamente para este ensayo. La mayoría de las actualizaciones transcurren sin problemas, pero el anuncio de Protocol 28 dice que «los desarrolladores deben actualizar sus SDK» por una razón.`,
    },
    {
      kind: "fill",
      prompt: `Fija la versión del SDK compatible con Protocol 28.`,
      file: "package.json",
      before: `"@stellar/stellar-sdk": "`,
      after: `"`,
      choices: ["^17.0.0", "^16.2.0", "^28.0.0", "^2.8.0"],
      answer: 0,
      explain: `Las versiones mayores siguen a los protocolos, pero sus números no coinciden: v17 es la versión para Protocol 28 (v17.0.1 se publicó el 25 de agosto de 2026), mientras que las versiones mayores anteriores apuntan a protocolos anteriores. El título de cada lanzamiento indica con qué versión de la red habla un SDK.`,
    },
    {
      kind: "theory",
      body: `## Vigilar la frontera

Seguir el ritmo de un protocolo vivo es un hábito de lectura, no una hazaña heroica:

- El **blog para desarrolladores de stellar.org**: anuncios de actualizaciones, fechas y guías sobre lo que quienes construyen deben hacer.
- El **repositorio de CAPs en GitHub**: propuestas mucho antes de que se publiquen; el borrador de hoy es la función host del año próximo.
- Las **reuniones abiertas del protocolo**, donde las CAPs se debaten en público.

Media hora al mes basta para adelantarte a todos los plazos de este capítulo. Quien lee las notas de actualización navega la ola; quien no, se queda atrás.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-protocol-27-1",
      body: `El **Acto VIII** de la Campaña lleva este capítulo a la práctica: haces que un proyecto funcional atraviese una actualización de protocolo, actualizas los SDK, lees las notas de lanzamiento y pruebas la nueva versión como lo haría un equipo profesional.

Con eso, el reino queda cartografiado: del consenso a los contratos, de las puertas a los velos, de un extremo al otro. Solo falta la mejor parte: **construir en él**. La Forja está abierta.`,
    },
  ],
  testOut: [
    { question: `¿Qué es un CAP y en qué se diferencia de un SEP?`,
      options: ["Un CAP cambia el protocolo mismo y sale en una versión numerada; un SEP estandariza cómo hablan los servicios y no requiere cambio de protocolo","Un CAP es un borrador y un SEP su forma ratificada","Un CAP rige contratos y un SEP rige operaciones clásicas"], answer: 0 },
    { question: `¿Por qué importa que las actualizaciones de protocolo estén numeradas y nombradas?`,
      options: ["Una funcionalidad existe a partir de una versión concreta, así que \"¿Stellar soporta esto?\" es en realidad \"¿en qué protocolo está esta red?\"","La numeración determina el orden en que los validadores aplican cambios","Las versiones nombradas son las únicas que la SDF soporta en producción"], answer: 0 },
    { question: `Una funcionalidad está activa en testnet pero aún no en mainnet. ¿Qué te dice eso?`,
      options: ["La versión del protocolo llegó antes a testnet — construir contra ella está bien, llevar usuarios reales no, hasta que mainnet siga","La funcionalidad fue rechazada y testnet es donde se retira","Nada; testnet y mainnet siempre corren el mismo protocolo"], answer: 0 },
    { question: `¿Por qué debería un constructor leer el changelog del protocolo y no solo la documentación?`,
      options: ["La documentación describe lo que es cierto ahora; el changelog es donde ves lo que está a punto de serlo, a tiempo de prepararte","La documentación suele estar desactualizada y el changelog la sustituye","El changelog contiene la única referencia de API autorizada"], answer: 0 },
  ],
};
