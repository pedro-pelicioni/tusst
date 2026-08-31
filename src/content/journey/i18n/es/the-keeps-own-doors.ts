import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Las Puertas de la Fortaleza",
  tagline: "Puertos y adaptadores — el dominio declara la puerta, el mundo encaja en ella.",
  steps: [
    {
      kind: "theory",
      body: `## Puertos y adaptadores

¿Cómo usa el anillo interno la cadena sin nombrarla? Declara un **puerto** — una interfaz que pertenece al dominio, escrita en el propio lenguaje del dominio:

> PaymentsPort: enviar un pago, leer un saldo, observar la llegada.

En el borde, los **adaptadores** implementan el puerto: un *adaptador Horizon* hoy, un *adaptador Soroban RPC* para contratos, un *adaptador falso* para pruebas. ¿Cambiar de proveedor RPC? Un nuevo adaptador. ¿Pasar de testnet a mainnet? Configuración. **El núcleo nunca lo menciona**.

El dominio habla con el puerto. El mundo se conecta al puerto. Eso es arquitectura hexagonal en una frase.`,
    },
    { kind: "diagram",
      body: "Una petición, cruzando todos los muros:",
      caption: "La flecha se invierte en el puerto. Todo lo que queda a su izquierda es el idioma de la fortaleza; todo lo de la derecha es el de otro.",
      view: { kind: "flow", layout: "row", play: true, nodes: [
        { id: "ui", label: "ui", note: "Exterior. Recoge la intención y llama hacia dentro. No tiene reglas propias.", tone: "neutral" },
        { id: "usecase", label: "caso de uso", note: "Interior. Decide qué debe ocurrir, en las palabras del dominio.", tone: "accent" },
        { id: "port", label: "puerto", note: "El borde interior — una interfaz que el DOMINIO posee y nombra. Esta es la puerta.", tone: "gold" },
        { id: "adapter", label: "adaptador", note: "Exterior. Implementa el puerto en el idioma del proveedor, y traduce de vuelta.", tone: "teal" },
        { id: "network", label: "red", note: "Horizon, RPC, una base de datos, un doble en pruebas. Intercambiable por construcción.", tone: "good" },
      ] } },
    {
      kind: "theory",
      body: `## Dónde vive todo

Una solicitud cruza los muros así:

**UI** (externo) → **caso de uso** (interno) → **puerto** (borde interno) → **adaptador** (externo) → red.

- Componentes React, rutas, estilos — **externo**.
- Postgres, ORM, migraciones — **externo**.
- stellar-sdk, clientes RPC, el puente de la billetera — **externo**.
- “Liberar fondos solo cuando ambos aprueban” — **interno**, en un módulo que no importa *nada* de la lista anterior.

La prueba de olor es mecánica: abre un archivo del dominio y revisa sus importaciones. Un nombre de framework en esa lista indica que se ha violado un muro.`,
    },
    {
      kind: "fill",
      prompt: `La fortaleza habla con el puerto, nunca con el proveedor:`,
      file: "domain/release-escrow.ts",
      before: `constructor(private payments: `,
      after: `) {}`,
      choices: ["PaymentsPort", "HorizonClient", "SorobanServer", "FreighterApi"],
      answer: 0,
      explain: `Las otras tres son reales y útiles — y pertenecen a los adaptadores, detrás del puerto. El caso de uso solo nombra la interfaz que posee, por eso un adaptador falso puede sustituirlo en pruebas y un nuevo proveedor RPC nunca toca este archivo.`,
    },
    { kind: "theory", body: `## El puerto que gotea

Un puerto puede satisfacer la regla de dependencia y aun así traicionarla. Mira:

> \`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`

Aquí nada importa un adaptador — la flecha sigue apuntando bien, y el linter está contento. Pero la *firma* habla el idioma del proveedor. El dominio ahora piensa en \`TransactionBuilder\`, y cada caso de uso que toca este puerto ha aprendido, calladamente, un tipo de Horizon.

Cambia de proveedor y la interfaz cambia. Lo que significa que cambian todos los llamadores. Que era justo lo que el puerto existía para evitar.

**Un puerto lo posee el dominio, así que debe escribirse en las palabras del dominio:**

> \`PaymentsPort.send(to: AccountId, amount: Money): Promise<PaymentReceipt>\`

Todo el trabajo del adaptador es la traducción entre esos dos vocabularios. Si en el borde no se traduce nada, el borde no está haciendo nada — y la puerta es un agujero.` },
    {
      kind: "theory",
      body: `## La isla testeable

Un núcleo sin importaciones de framework es una **isla pura**: constrúyela en una prueba, pásale un adaptador falso, verifica su comportamiento. Sin red, sin cadena dockerizada, sin RPC inestable — las pruebas del rito Rojo-Verde se ejecutan en **milisegundos**.

Este es el beneficio silencioso y acumulativo: los equipos con fortalezas limpias escriben más pruebas *porque las pruebas son baratas*, y las pruebas baratas generan bucles rápidos — tanto para humanos como para golems.

Los adaptadores siguen teniendo sus propias pruebas contra la red real — una capa delgada y honesta, probada por separado a su propio ritmo más lento.`,
    },
    { kind: "theory", body: `## El cambio, contado

Un equipo con la fortaleza limpia migra de Horizon a un proveedor de RPC Soroban. Este es el diff entero, por archivo:

- **\`adapters/soroban-rpc.ts\`** — nuevo, ~120 líneas. Implementa \`PaymentsPort\`, traduce los errores del proveedor a los tipos de error propios del dominio.
- **\`wiring/container.ts\`** — una línea cambiada, eligiendo qué adaptador construir.
- **\`adapters/soroban-rpc.test.ts\`** — nuevo, probado contra la red real a su propia velocidad, más lenta.

Y la lista de archivos que **no** cambiaron: todas las entidades, todos los casos de uso, todas las pruebas de dominio. No porque alguien tuviera cuidado durante la migración — sino porque nada ahí dentro podía nombrar al proveedor antiguo, para empezar.

Para eso sirve de verdad la arquitectura. No para la elegancia: **la hoja de ruta de un proveedor con un precio de un archivo y una línea.**` },
    {
      kind: "quiz",
      question: `Tu proveedor RPC anuncia un cierre. En una fortaleza construida con puertos y adaptadores, ¿qué tiene que cambiar?`,
      options: [
        "Un adaptador, más el cableado que lo selecciona — el dominio y los casos de uso no cambian en absoluto",
        "Cada caso de uso que envía un pago, ya que cada uno llama al proveedor",
        "Las entidades del dominio, pues la URL del endpoint está almacenada en ellas",
      ],
      answer: 0,
      explain: `Ese es el ROI de la arquitectura en una línea: el desgaste del proveedor tiene precio de un adaptador. Si la respuesta honesta en tu código es “todos los casos de uso”, las flechas de dependencia están apuntando en la dirección equivocada.`,
    },
    { kind: "exercise", mode: "spec-write",
      brief: `## La prueba del examinador: declara las puertas

Un caso de uso, dicho en las palabras del dominio:

> **Liberar un escrow.** Cuando ambas partes han aprobado y el plazo no ha vencido, el importe en custodia va al vendedor y el escrow se cierra. Si el plazo ha vencido y solo una parte aprobó, vuelve al comprador.

Declara los **puertos** que necesita este caso de uso — las puertas que posee el dominio. Para cada uno: para qué sirve, y la forma de lo que entra y de lo que vuelve, **en el vocabulario del dominio**. Después nombra un adaptador que escribirías para cada uno, y una cosa que ese adaptador tiene que traducir.`,
      rubric: `1. Declara al menos dos puertos, cada uno con un propósito declarado.
2. Las entradas y salidas de cada puerto se nombran en términos de DOMINIO — sin tipos de proveedor, sin nombres de clase de SDK, sin vocabulario de HTTP ni SQL.
3. Nombra al menos un adaptador concreto por puerto.
4. Dice al menos una cosa que un adaptador debe traducir entre el vocabulario del proveedor y el del dominio.
5. La decisión del propio caso de uso (quién recibe los fondos, y cuándo) se queda en el caso de uso — no se delega a un puerto.`,
      minChars: 180 },
    {
      kind: "theory",
      body: `## Muros pequeños, prompts pequeños

Esto es lo que la fortaleza te brinda en la era de IA: **los módulos bien delimitados son prompts bien delimitados**.

“Reescribe el adaptador Horizon para apuntar al nuevo RPC — aquí está el puerto que debe cumplir, aquí están sus pruebas” es una tarea que un golem completa *dentro de una caja*: el contexto de un solo archivo, un contrato que cumplir, pruebas que pasar, y muros que limitan el radio de explosión. El golem reconstruye una habitación sin nunca vagar por toda la fortaleza.

Próxima disciplina: el propio golem — y el banco que debes construir a su alrededor.`,
    },
  ],
  testOut: [
    { question: `¿Cómo usa el anillo interior la cadena sin nombrarla?`,
      options: ["Declara un puerto — una interfaz que el dominio posee y escribe en sus propias palabras — y un adaptador la implementa en el borde","Importa el SDK pero envuelve cada llamada en un try/catch para contener el acoplamiento","Llama al adaptador directamente, ya que los adaptadores son asunto del anillo exterior"], answer: 0 },
    { question: `\`PaymentsPort.send(tx: TransactionBuilder): Promise<HorizonResponse>\`. La flecha apunta hacia dentro. ¿Qué sigue mal?`,
      options: ["La firma habla el idioma del proveedor, así que cambiar de proveedor cambia la interfaz y con ella todos los llamadores","Nada — la regla de dependencia se cumple y esa es toda la prueba","Devuelve una Promise, lo que acopla el dominio al runtime asíncrono"], answer: 0 },
    { question: `Tu proveedor de RPC anuncia su cierre. En una fortaleza con puertos y adaptadores, ¿qué cambia?`,
      options: ["Un adaptador, más el cableado que lo selecciona — el dominio y los casos de uso no cambian nada","Cada caso de uso que envía un pago, ya que cada uno llama al proveedor","Las entidades de dominio, ya que el endpoint está guardado en ellas"], answer: 0 },
    { question: `¿Por qué un núcleo sin framework abarata el bucle del Rito?`,
      options: ["Se construye en una prueba con un adaptador falso y afirma en milisegundos — sin red, sin contenedor, sin inestabilidad","Compila a un binario más pequeño, así el ejecutor de pruebas arranca antes","Elimina la necesidad de pruebas de adaptador, reduciendo la suite a la mitad"], answer: 0 },
  ],
};
