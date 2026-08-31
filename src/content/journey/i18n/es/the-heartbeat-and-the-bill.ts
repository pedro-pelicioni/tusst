import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "El Latido y la Factura",
  tagline: "Archivado de estado y comisiones: el estado se alquila, y una llamada se mide, no se subasta.",
  steps: [
    {
      kind: "theory",
      body: `## El estado tiene latido

La mayoría de las cadenas dejan que el estado se acumule para siempre — cada nodo arrastra cada entrada abandonada desde 2019. Stellar se niega: **cada entrada de Soroban tiene un TTL** (tiempo de vida), contado en ledgers, y el alquiler lo extiende.

Cuando el TTL se agota:

- Las entradas **temporales** se eliminan. Desaparecen.
- Las entradas **persistentes** y **de instancia** se **archivan** — se expulsan del libro mayor activo, pero pueden restaurarse más tarde con una prueba, regresando exactamente como estaban.

Esto es **archivado de estado**, y ninguna otra cadena importante lo hace. El libro mayor activo se mantiene ligero, los validadores siguen siendo económicos y la historia permanece recuperable.`,
    },
    { kind: "widget", component: "state-archival",
      body: `Los tres estantes parecen idénticos mientras corre el reloj. **Deja pasar los ledgers** en cada uno y mira qué ocurre en el cero — ese instante es toda la diferencia entre ellos.` },
    { kind: "theory", body: `## Un contrato, tres estantes

Los estantes abstractos se vuelven una decisión de diseño en cuanto tienes datos reales. Toma un contrato de escrow sencillo:

- **La dirección del admin y la comisión** van a almacenamiento de **instancia**. Pertenecen al contrato mismo, se leen en casi cada llamada, y si el contrato se archiva deben irse con él — no hay nada que salvar de una comisión cuyo contrato ya no existe.
- **Cada escrow abierto** va a almacenamiento **persistente**. Ahí hay dinero de alguien. Si vence su TTL, la entrada debe seguir siendo recuperable, porque "se nos olvidó" no es una respuesta aceptable a "¿dónde está mi dinero?".
- **Una cotización de vida corta** que el llamante consulta antes de comprometerse va a almacenamiento **temporal**. No vale nada en diez minutos y nadie debería pagar alquiler por conservarla.

Fíjate en la pregunta que decidió cada una. No es "¿cómo de importante es esto?" — la comisión es crítica y aun así va en instancia. La pregunta es: **¿qué debería pasar con esto si nadie lo toca durante mucho tiempo?** Guardarlo con el contrato, guardarlo recuperable, o dejarlo ir.

Invertirlo produce un fallo silencioso. Las entradas de escrow en almacenamiento temporal no dan error el día en que las escribes. Funcionan perfectamente, durante meses.` },
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
  ],
  testOut: [
    { question: `El TTL de una entrada temporal llega a cero. ¿Qué le pasa al dato?`,
      options: ["Se borra — no hay restauración para el almacenamiento temporal, a ningún precio","Se archiva y puede restaurarse pagando, como cualquier otra entrada","Se conserva pero queda en solo lectura hasta renovarlo"], answer: 0 },
    { question: `El TTL de una entrada persistente llega a cero. ¿Qué pasa?`,
      options: ["Se archiva, no se borra — las llamadas que la necesitan fallan hasta que alguien la restaure, y restaurar cuesta una comisión","Se borra, igual que una entrada temporal","El contrato se pausa hasta reescribir la entrada"], answer: 0 },
    { question: `¿Por qué cobra el protocolo alquiler por el estado?`,
      options: ["Porque el estado le cuesta almacenamiento a cada validador para siempre, así que una comisión única de escritura dejaría a cualquiera imponer un coste continuo sin límite","Para desalentar que los contratos guarden nada on-chain","Para financiar la operación de los validadores, pagada con comisiones de archivado"], answer: 0 },
    { question: `¿Cuál es el sentido de simular una llamada a contrato antes de firmarla?`,
      options: ["La simulación devuelve los recursos y el footprint exactos que la llamada necesita, y firmas eso — así la comisión se mide en vez de adivinarse","Revisa el fuente del contrato en busca de vulnerabilidades conocidas","Reserva un hueco en el próximo ledger para que la llamada no quede fuera"], answer: 0 },
  ],
};
