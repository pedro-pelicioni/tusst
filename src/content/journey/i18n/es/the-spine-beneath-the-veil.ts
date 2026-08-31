import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Espina Bajo el Velo",
  tagline: "Ocultar las contrapartes — y seguir siendo auditable.",
  steps: [
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
    { kind: "widget", component: "explorer-view",
      body: `La elección entre estas capas no va de cuánta privacidad puedes alcanzar. Va de **qué campo tiene que apagarse**. Cambia de capa y lee la columna del observador.` },
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
      kind: "quiz",
      question: `Llamas a \`get_asp_non_membership_root()\` en el pool vivo y responde **0**. ¿Qué te dice eso realmente?`,
      options: [
        "La blocklist está vacía — y 0 es el valor contra el que el contrato compara cada retiro, así que una lista vacía es una política aplicada, no una política ausente",
        "La llamada falló y cayó en un valor por defecto: una raíz de Merkle nunca es legítimamente cero",
        "La blocklist es confidencial, así que el contrato devuelve 0 a quien no sea un ASP",
      ],
      answer: 0,
      explain: `Un árbol vacío igual tiene una raíz real, y para esta blocklist es literalmente 0 — o sea, "nadie está vetado" se aplica activamente en cada gasto en vez de quedar sin definir. Ahora prueba la vecina: \`get_asp_membership_root()\` responde 2302223575749844940221218608817648865122641281382153518325924961250440546344, un número impresionante para un árbol que **también está vacío**. Ese es el zero-hash de árbol vacío. Leerlo como "la allowlist tiene miembros" es el error más fácil de todo este tema, y acabas de esquivarlo.`,
    },
    {
      kind: "theory",
      body: `## Ve a mirar dentro de uno

Todo lo anterior es verificable ahora mismo, en un pool que existe de verdad. El developer preview de Nethermind está vivo en testnet, y sus funciones de lectura responden **sin cartera y sin firma**. No eres cliente de esta cosa — eres espectador, y mirar es gratis.

Abre la [Forge](/ide), ve a **Explore** y elige **pool de privacidad SPP · XLM** entre los contratos conocidos. Luego pregúntale, en este orden:

- \`get_policy_flags()\` — cómo está configurado este pool. Responde **2**: blocklist aplicada, sin allowlist.
- \`get_root()\` — la raíz de Merkle que compromete cada nota jamás depositada ahí. Un solo número representando todo el conjunto de anonimato.
- \`is_known_root(<ese número>)\` — **true**. Ahora cambia un dígito y vuelve a preguntar: **false**. Acabas de recorrer el anillo de raíces que el pool recuerda.
- \`is_spent(<cualquier número>)\` — **false**. Este es el conjunto de nullifiers: la defensa del pool contra el doble gasto, y casi lo único que un retiro publica sobre sí mismo.

Léelas en orden y fíjate en lo que *falta*. Ninguna de esas respuestas contiene una dirección, un monto ni una contraparte. La cadena te dice la verdad exacta y no te dice nada.

**Dos advertencias, porque la spec de un contrato no puede advertirte sobre sí misma.** Este pool expone cinco funciones sobrantes — \`balance\`, \`transfer\`, \`approve\` y compañía — que responden con educación y no significan nada; la Forge las marca como *señuelo* para que no te engañen. Y el estado del preview **se archiva el 2026-09-02**, tras lo cual esas lecturas dejan de responder hasta que alguien pague por restaurarlas. Eso no es un fallo de la Forge: es el state rent de Soroban, bajo el que vive cada contrato de esta red.`,
    },
    {
      kind: "labLink",
      labSlug: "confidential-tokens",
      body: `En el yunque de la forja: un laboratorio de **Tokens Confidenciales**, donde envolverás un token de testnet y verás cómo los montos desaparecen del explorador mientras la transferencia se liquida honestamente. Su tarjeta indica *en proceso de forja* — esta frontera se está trabajando mientras lees.

Observa cuán recientes son estas fechas. Montar tecnología tan fresca implica leer el pulso mismo del protocolo — el capítulo final te muestra cómo.`,
    },
  ],
  testOut: [
    { question: `¿Cómo oculta un pool SPP a las contrapartes?`,
      options: ["Los usuarios depositan en un pool compartido y transfieren dentro de él, así que un observador no puede ligar remitente con receptor","Las direcciones se cifran y solo el receptor puede descifrarlas","Las transferencias se agrupan, así que varios pagos comparten un registro on-chain"], answer: 0 },
    { question: `Un explorador observa una transferencia de Token Confidencial y una de pool SPP. ¿Qué ve en cada una?`,
      options: ["CT: las dos direcciones, pero no el importe. SPP: ni siquiera las contrapartes","Ambas ocultan importes y direcciones por igual; SPP solo es más barato","CT oculta direcciones y muestra importes; SPP lo muestra todo a quien pasó KYC"], answer: 0 },
    { question: `¿Qué publica un Association Set Provider, y contra qué pruebas?`,
      options: ["Un conjunto de depósitos por los que responde — y pruebas que tus fondos se remontan a algún depósito de ese conjunto, sin revelar cuál","Una lista de destinatarios aprobados, que el pool impone en cada transferencia","Las claves de descifrado que permiten a los auditores leer la actividad del pool"], answer: 0 },
    { question: `¿Cómo puede el mismo retiro ser privado y auditable a la vez?`,
      options: ["Privado porque el enlace con tu depósito concreto nunca se publica; auditable porque no podrías retirar sin probar pertenencia a un conjunto avalado","Los auditores tienen una clave maestra que revela el enlace cuando hace falta","No puede — el diseño cambia uno por otro, y SPP eligió la auditabilidad"], answer: 0 },
  ],
};
