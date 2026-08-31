import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Fronteras del Reino",
  tagline: "Una palabra, tres significados — y las fronteras que lo hacen seguro.",
  steps: [
    {
      kind: "theory",
      body: `## Una palabra, tres significados

Pregunta a tres equipos en Stellar qué es una **Cuenta**:

- Equipo *wallet*: "un titular de saldo — alguien que posee lumens y activos."
- Equipo *anchor*: "un sujeto KYC — alguien que debemos identificar antes de mover dinero."
- Equipo *exchange*: "un participante del libro de órdenes — alguien con ofertas abiertas."

Misma palabra. Mismo G‑address, incluso. **Tres modelos diferentes.** La mayoría de los “bugs de mala comunicación” son exactamente esto: dos personas usan una palabra para dos conceptos, cada una segura de que la otra está de acuerdo.

El Diseño Dirigido por el Dominio comienza aquí: haz que el lenguaje sea preciso *a propósito*.`,
    },
    {
      kind: "theory",
      body: `## Lenguaje ubicuo, contextos limitados

Dentro de un equipo y una parte del sistema, DDD exige un **lenguaje ubicuo**: una palabra, un significado, usado *en todas partes* — conversación, especificación y código. Si la spec dice "release", la función es \`release\`, no \`transfer_out\`.

Pero ningún lenguaje rige todo el reino. Un **contexto limitado** es la frontera donde el significado de una palabra puede cambiar: dentro de *Payments*, una Cuenta es un titular de saldo; al cruzar a *Compliance*, la misma dirección es un sujeto KYC.

La frontera no es un fallo de diseño. **La frontera es el diseño.**`,
    },
    {
      kind: "diagram",
      body: "La misma palabra, tres fronteras:",
      caption: "Las líneas discontinuas son traducciones, no código compartido. Un contexto que importa el modelo de otro no tiene frontera alguna.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "pay",
            label: "PAGOS",
            x: 22,
            y: 20,
            tone: "accent",
            shape: "box",
            note: "Aquí una \"cuenta\" es un origen, un número de secuencia y un presupuesto de comisión.",
          },
          {
            id: "trade",
            label: "TRADING",
            x: 78,
            y: 20,
            tone: "teal",
            shape: "box",
            note: "Aquí es un conjunto de ofertas abiertas y los activos en que están denominadas.",
          },
          {
            id: "custody",
            label: "CUSTODIA",
            x: 50,
            y: 50,
            tone: "gold",
            shape: "box",
            note: "Y aquí es un conjunto de firmantes con umbrales. Misma palabra, tres sentidos.",
          },
        ],
        edges: [
          {
            from: "pay",
            to: "trade",
            style: "dashed",
          },
          {
            from: "pay",
            to: "custody",
            style: "dashed",
          },
          {
            from: "trade",
            to: "custody",
            style: "dashed",
          },
        ],
      },
    },
    {
      kind: "quiz",
      question: `El equipo de Compliance te pide añadir \`kyc_status\` y \`risk_score\` al modelo de Cuenta del contexto Payments — “es la misma cuenta, al fin y al cabo”. ¿Cuál es la lectura DDD?`,
      options: [
        "Mantener modelos separados detrás de fronteras distintas, enlazados por la dirección de la cuenta — cada contexto modela solo lo que necesita",
        "Fusionarlos — un modelo de Cuenta compartido para todo el sistema evita duplicación, que es el mayor mal",
        "Añadir los campos pero marcarlos opcionales, de modo que el código de Payments simplemente los ignore",
      ],
      answer: 0,
      explain: `Un modelo compartido hace que cada contexto acumule campos y reglas hasta que ninguno pueda moverse sin romper a otro. Dos modelos ligeros que comparten un ID no son duplicación — son dos verdades sobre una misma dirección, cada una poseída donde se entiende.`,
    },
    { kind: "fill",
      prompt: `Completa la regla que hace de una frontera una frontera:`,
      file: "NOTES.md",
      before: `Dentro de un contexto una palabra tiene exactamente un significado. En la frontera, ese significado puede `,
      after: ` .`,
      choices: ["cambiar", "seguir siendo el mismo", "volverse opcional", "heredarse al siguiente contexto"],
      answer: 0,
      explain: `Si el significado no pudiera cambiar, no necesitarías una frontera — necesitarías un modelo único compartido, que es justo lo que las fronteras existen para evitar. Una frontera es precisamente el lugar donde "Cuenta" puede significar otra cosa, a propósito, con una traducción al pasar.` },
    {
      kind: "theory",
      body: `## Puentes entre contextos: el anchor

Los contextos aún deben comunicarse. **Mapeo de contextos** es nombrar las fronteras y construir puentes deliberados — traducción en el borde, de modo que el lenguaje de un lado no se filtre al otro.

Los **anchors** de Stellar son este patrón con un modelo de negocio. En un lado: el *contexto bancario* — IBANs, días hábiles, retenciones de cumplimiento. En el otro: el *contexto de libro mayor* — líneas de confianza, activos, finalidad de 5 segundos. El anchor **traduce**: una transferencia entrante se convierte en tokens emitidos; un token redimido se convierte en un pago bancario.

Ningún mundo tuvo que adoptar el modelo del otro. Esa es una frontera saludable: cruzada por traducción, nunca por filtración.`,
    },
    { kind: "theory", body: `## La frontera que se disuelve en silencio

Las fronteras rara vez caen de golpe. Se erosionan, y siempre con el mismo gesto educado: *"estos dos contextos comparten solo un poquito."*

Empieza con un tipo. Pagos y Compliance necesitan ambos una dirección, así que importan un \`Account\` compartido — solo el identificador, nada más. Luego Compliance necesita el estado en él. Luego Pagos necesita un campo de Compliance para un recibo. Seis meses después el tipo compartido tiene catorce campos, la mitad sin sentido en ninguno de los dos contextos, y ninguna de las partes puede cambiarlo sin una reunión.

La señal no es el tamaño de lo compartido. Es **a quién hay que consultar para cambiarlo**. Una frontera que no cruzas sin una traducción es una frontera. Una frontera que cruzas importando es un adorno.

El puente que se mantiene sano es aquel en el que cada lado conserva su propio modelo y algo en el medio convierte — que es exactamente lo que hace un anchor, y exactamente lo que no hace un tipo compartido.` },
    { kind: "exercise", mode: "spec-write",
      brief: `## La prueba del examinador: dibuja las fronteras

Aquí tienes un sistema, descrito como lo describiría un fundador:

> Una app de remesas. Los usuarios se registran y pasan verificación de identidad. Cargan un saldo por transferencia bancaria, envían dinero a destinatarios de otro país, y el destinatario cobra en un socio local. El soporte puede congelar una cuenta y ver el rastro de auditoría completo.

Nombra los **contextos delimitados** que dibujarías y, para cada uno: las palabras cuyo significado cambia en esa frontera, y cómo se hablan los contextos entre sí. Solo modelado — sin esquemas, sin servicios, sin nombres de framework.`,
      rubric: `1. Nombra al menos tres contextos delimitados plausibles, con una línea de responsabilidad cada uno.
2. Identifica al menos una palabra que significa cosas genuinamente distintas en dos de esos contextos, y dice qué significa en cada uno.
3. Describe cómo se comunica al menos un par de contextos — una traducción en el borde, no un modelo compartido.
4. No resuelve las diferencias proponiendo un modelo único para todos.
5. Solo modelado — sin esquemas de base de datos, sin nombres de servicio o framework, sin código.`,
      minChars: 180 },
    { kind: "theory", body: `## Por qué el golem necesita tu mapa

Un LLM ha leído un millón de bases de código donde "cuenta", "transferencia" y "saldo" significaban cosas distintas. Deja tus fronteras sin declarar y **mezclará vocabularios a mitad de archivo** — una regla de KYC filtrándose en tu modelo de pagos, la idea de Cuenta de un exchange tiñendo la de tu billetera — cada línea localmente plausible.

Así que escribe la frontera en el banco: *"Estamos en el contexto de Pagos. Cuenta significa titular de saldo. Compliance es un modelo aparte — referéncialo solo por dirección."* Un contexto declarado es una valla que el golem respeta.

**A continuación:** ya has trazado las líneas. Qué vive de verdad dentro de una — y qué cosas solo pueden cambiar juntas.` },
  ],
  testOut: [
    { question: `Tres equipos definen "Cuenta" de forma distinta. ¿Cómo llama DDD al lugar donde el significado puede cambiar?`,
      options: ["Un contexto delimitado — la frontera es el diseño, no un fallo de él","Una colisión de nombres, a resolver renombrando uno","Deuda técnica, a saldar unificando el modelo"], answer: 0 },
    { question: `Compliance pide añadir \`kyc_status\` a la Cuenta del contexto de Pagos. ¿Cuál es la lectura DDD?`,
      options: ["Mantener modelos separados tras fronteras separadas, unidos por la dirección — cada contexto modela solo lo que necesita","Fusionarlos, ya que la duplicación es el mal mayor","Añadir los campos como opcionales para que Pagos los ignore"], answer: 0 },
    { question: `¿Qué es un anchor de Stellar, en el vocabulario de este capítulo?`,
      options: ["Un mapa de contextos convertido en negocio — traduce entre el contexto bancario y el del libro mayor","Un modelo compartido que bancos y libro mayor acuerdan adoptar","Una capa de compliance que se sitúa por encima de ambos contextos"], answer: 0 },
    { question: `¿Por qué una frontera sin declarar duele más cuando escribe el código una IA?`,
      options: ["Ha leído un millón de bases donde esas palabras significaban otras cosas, y mezclará los vocabularios a mitad de archivo","No sabe leer términos de dominio y necesita nombres técnicos","Se niega a continuar hasta que todo término esté formalmente definido"], answer: 0 },
  ],
};
