import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La Fortaleza Limpia",
  tagline: "Una ley: las dependencias de código fuente apuntan hacia dentro, solo.",
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
    { kind: "widget", component: "dependency-rule",
      body: `La ley tiene una forma, y la prosa no puede dibujarla. **Activa algunos imports** y mira dónde caen los legales — luego rompe un muro a propósito y lee lo que te cuesta.` },
    { kind: "theory", body: `## Toda brecha fue razonable

Nadie rompe la regla por maldad. La rompe un martes, por un buen motivo, con una fecha límite encima.

El caso de uso del escrow necesita la secuencia actual del libro mayor para decidir si el plazo ha vencido. El número está a una llamada de \`server.ledgers()\`. Escribir un puerto para eso significa una interfaz, un adaptador, un doble para las pruebas — veinte minutos por un número que está *ahí mismo*. Así que el SDK acaba importado dentro del dominio, con un comentario prometiendo limpiarlo.

Ocho meses después, ese único import ha hecho tres cosas. El dominio ya no compila sin un cliente de red. Las pruebas del caso de uso necesitan un nodo en marcha, así que se volvieron lentas, así que se dejaron de ejecutar. Y ha salido la versión mayor del SDK, lo que ahora significa una migración **de dominio**.

Los veinte minutos fueron reales. Los intereses también.

La regla se gana el sueldo justo los días en que parece burocracia — porque el día en que parezca necesaria, el coste ya está pagado.` },
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
    { kind: "fill",
      prompt: `La prueba es mecánica — abre un archivo de dominio y lee sus imports:`,
      file: "domain/release-escrow.ts",
      before: `Un nombre de framework o de proveedor en esa lista de imports significa que `,
      after: ` .`,
      choices: ["se ha roto un muro", "el archivo necesita un comentario que lo explique", "el import debería cargarse de forma perezosa", "la versión del framework está desactualizada"],
      answer: 0,
      explain: `Para este no hace falta criterio, y ese es el punto: es grep. Un archivo de dominio que nombra \`@stellar/stellar-sdk\`, un ORM o un hook de React ya ha perdido la discusión, por razonable que fuera el motivo en su momento.` },
    { kind: "theory", body: `## La ley, y el mecanismo que falta

Ya sabes decir hacia dónde debe apuntar cada flecha, y comprobar cualquier archivo en segundos.

Lo que aún no sabes decir es cómo el anillo interior **hace** algo. No puede nombrar el SDK de la cadena — pero un pago sigue teniendo que enviarse. No puede saber de bases de datos — pero el escrow sigue teniendo que guardarse en algún sitio. Una ley que vuelve imposible lo útil no es una ley que nadie cumpla.

**A continuación:** las puertas que la fortaleza abre en sus propios muros, y quién tiene permiso para estar al otro lado.` },
  ],
  testOut: [
    { question: `Enuncia la regla de dependencia.`,
      options: ["Las dependencias de código fuente apuntan solo hacia dentro — el anillo exterior puede nombrar al interior, nunca al revés","Cada capa puede depender de la inmediatamente inferior, y no más allá","Las dependencias apuntan al módulo que cambia con menos frecuencia"], answer: 0 },
    { question: `¿Por qué hacia dentro y no hacia fuera?`,
      options: ["Los frameworks se agitan y las reglas de negocio los sobreviven — apuntar hacia fuera deja tu código más lento como rehén de tu dependencia más rápida","Los módulos internos son más pequeños y compilan antes sin imports","Es una convención que facilita dibujar grafos de dependencias automáticos"], answer: 0 },
    { question: `¿Qué import rompe la regla?`,
      options: ["domain/escrow.ts importando el SDK de la cadena para construir una transacción","adapters/horizon.ts importando una interfaz del dominio para implementarla","ui/ReleaseButton.tsx importando un caso de uso para llamarlo"], answer: 0 },
    { question: `Un componente React decide si pueden liberarse los fondos del escrow y luego renderiza el botón. ¿Qué falla?`,
      options: ["Una regla de negocio en la UI es invisible para las pruebas del núcleo, y la siguiente pantalla que la necesite la duplicará","Nada — decidir cerca del render mantiene el código junto","Solo el rendimiento: la comprobación se repite en cada render"], answer: 0 },
  ],
};
