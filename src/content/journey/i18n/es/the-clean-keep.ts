import type { Concept } from "../types";

export const theCleanKeep: Concept = {
  meta: {
    slug: "the-clean-keep",
    title: "La Fortaleza Limpia",
    tagline: "Arquitectura limpia y hexagonal — cada pieza en su lugar.",
    numeral: "IV",
    arc: "craft",
    level: 2,
    status: "live",
    estMinutes: 13,
    sigil: "/v2/journey/sigils/the-clean-keep.webp",
    glyph: "🏰",
  },
  steps: [
    {
      kind: "theory",
      body: `## La fortaleza y sus muros

La arquitectura es una decisión que se repite muchas veces: **qué se permite que dependa de qué**.

Imagina una fortaleza. En el **anillo interno** viven tus *entidades* y *casos de uso* — las reglas que hacen que tu dApp sea tuya: quién puede liberar fondos, cuándo corresponde un reembolso. En el **anillo externo** vive el mundo cambiante: la UI, la base de datos, el SDK de la cadena, la billetera.

La **regla de dependencia** es la única ley de la fortaleza: *las dependencias del código fuente apuntan hacia adentro, y solo hacia adentro*. El anillo externo puede nombrar al interno. El anillo interno nunca — *nunca* — nombra al externo.`,
    },
    {
      kind: "theory",
      body: `## ¿Por qué hacia adentro?

Porque los dos anillos envejecen de forma distinta. Los frameworks cambian: aparecen nuevas versiones mayores del SDK, las librerías UI suben y bajan, las bases de datos se sustituyen. **Las reglas de negocio sobreviven a todo eso** — “ambas partes deben aprobar” seguirá siendo verdad en cualquier framework que lo aloje dentro de cinco años.

Si tu dominio importa el SDK de la cadena, cada cambio mayor del SDK se convierte en una *migración del dominio* — tu código que cambia más despacio queda rehén de tu dependencia que cambia más rápido. Apunta las flechas hacia adentro y el desgaste queda en el anillo externo, donde es barato.

La fortaleza es el punto. Los frameworks son el mobiliario.`,
    },
    {
      kind: "diagram",
      body: "El fuerte, de fuera hacia dentro:",
      caption: "Cada flecha apunta hacia dentro. El dominio nunca se entera del nombre de una base de datos.",
      view: {
        kind: "stack",
        bands: [
          {
            id: "infra",
            label: "infraestructura",
            note: "Postgres, Horizon, el sistema de archivos, el reloj. Reemplazables por definición.",
            tone: "neutral",
          },
          {
            id: "adapters",
            label: "adaptadores",
            note: "Traducen el mundo exterior a las formas que el interior ya habla.",
            tone: "teal",
          },
          {
            id: "app",
            label: "aplicación",
            note: "Casos de uso: la secuencia de movimientos del dominio que responde a una petición.",
            tone: "accent",
          },
          {
            id: "domain",
            label: "dominio",
            note: "Las reglas que seguirían siendo ciertas en papel. No importa nada.",
            tone: "gold",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `Tres importaciones de una dApp Stellar. ¿Cuál **rompe la regla de dependencia**?`,
      options: [
        "domain/escrow.ts importa @stellar/stellar-sdk para construir una transacción",
        "adapters/horizon.ts importa la interfaz PaymentsPort del dominio, para implementarla",
        "ui/ReleaseButton.tsx importa el caso de uso release del dominio, para llamarlo",
      ],
      answer: 0,
      explain: `Las otras dos son el anillo externo nombrando al interno — la regla funciona exactamente como se diseñó. El dominio importando el SDK es el interno nombrando al externo: ahora las habitaciones más profundas de la fortaleza tiemblan cada vez que un proveedor lanza una versión mayor.`,
    },
    {
      kind: "theory",
      body: `## Puertos y adaptadores

¿Cómo usa el anillo interno la cadena sin nombrarla? Declara un **puerto** — una interfaz que pertenece al dominio, escrita en el propio lenguaje del dominio:

> PaymentsPort: enviar un pago, leer un saldo, observar la llegada.

En el borde, los **adaptadores** implementan el puerto: un *adaptador Horizon* hoy, un *adaptador Soroban RPC* para contratos, un *adaptador falso* para pruebas. ¿Cambiar de proveedor RPC? Un nuevo adaptador. ¿Pasar de testnet a mainnet? Configuración. **El núcleo nunca lo menciona**.

El dominio habla con el puerto. El mundo se conecta al puerto. Eso es arquitectura hexagonal en una frase.`,
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
      kind: "theory",
      body: `## La isla testeable

Un núcleo sin importaciones de framework es una **isla pura**: constrúyela en una prueba, pásale un adaptador falso, verifica su comportamiento. Sin red, sin cadena dockerizada, sin RPC inestable — las pruebas del rito Rojo-Verde se ejecutan en **milisegundos**.

Este es el beneficio silencioso y acumulativo: los equipos con fortalezas limpias escriben más pruebas *porque las pruebas son baratas*, y las pruebas baratas generan bucles rápidos — tanto para humanos como para golems.

Los adaptadores siguen teniendo sus propias pruebas contra la red real — una capa delgada y honesta, probada por separado a su propio ritmo más lento.`,
    },
    {
      kind: "quiz",
      question: `¿Dónde está el olor?`,
      options: [
        "Un componente React que decide por sí mismo si los fondos en escrow pueden liberarse, y luego renderiza el botón",
        "Un caso de uso que depende de una interfaz PaymentsPort y orquesta la liberación",
        "Un adaptador que traduce códigos de error de Horizon a los tipos de error propios del dominio",
      ],
      answer: 0,
      explain: `Una regla de negocio viviendo en la UI es invisible para las pruebas del núcleo y se duplica en la siguiente pantalla que la necesite. Su gemela espejo es SQL dentro del dominio — el anillo interno alcanzando hacia afuera. Las reglas van al núcleo, la traducción al borde.`,
    },
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
    {
      kind: "theory",
      body: `## Muros pequeños, prompts pequeños

Esto es lo que la fortaleza te brinda en la era de IA: **los módulos bien delimitados son prompts bien delimitados**.

“Reescribe el adaptador Horizon para apuntar al nuevo RPC — aquí está el puerto que debe cumplir, aquí están sus pruebas” es una tarea que un golem completa *dentro de una caja*: el contexto de un solo archivo, un contrato que cumplir, pruebas que pasar, y muros que limitan el radio de explosión. El golem reconstruye una habitación sin nunca vagar por toda la fortaleza.

Próxima disciplina: el propio golem — y el banco que debes construir a su alrededor.`,
    },
  ],
};
