import type { Concept } from "../types";

export const theRealmOfStellar: Concept = {
  meta: {
    slug: "the-realm-of-stellar",
    title: "El Reino de Stellar",
    tagline: "Cómo miles de máquinas llegan a un acuerdo sin un rey.",
    numeral: "I",
    arc: "realm",
    status: "live",
    estMinutes: 12,
    sigil: "/v2/journey/sigils/the-realm-of-stellar.webp",
    glyph: "🕸",
  },
  steps: [
    {
      kind: "theory",
      body: `## Acuerdo sin un rey

Cada blockchain responde a una pregunta: **¿cómo hacen los extraños para ponerse de acuerdo sobre la siguiente página del libro contable?**

- Proof-of-Work responde con *electricidad* — quien quema más, escribe.
- Proof-of-Stake responde con *capital bloqueado* — quien apuesta más, escribe.
- **Stellar responde con confianza**: cada nodo nombra a los nodos en los que confía, y el acuerdo se propaga a través de esas declaraciones. Sin minería, sin staking — el **Stellar Consensus Protocol (SCP)**.

El resultado: los libros se cierran en ~5 segundos, las tarifas cuestan fracciones de centavo y la red funciona en máquinas que una universidad puede permitirse.`,
    },
    {
      kind: "theory",
      body: `## Rebanadas de quórum: "mi consejo"

Cada nodo declara una **rebanada de quórum** — un pequeño consejo de nodos sin el cual se niega a avanzar:

> "Acepto un libro cuando **suficiente de mi consejo** lo acepta."

Los consejos se superponen: los miembros de tu consejo tienen sus propios consejos, y esas cadenas de confianza tejen toda la red. Un **quórum** es un conjunto de nodos que contiene un consejo satisfecho *para cada miembro* — una vez que un quórum está de acuerdo, el libro se cierra.

No hay lista global. No hay oficina de admisiones. La confianza se declara localmente y se convierte en acuerdo global — al igual que las instituciones humanas se federan.`,
    },
    {
      kind: "widget",
      component: "scp-sim",
      body: `## El Consejo de Nodos

Siete validadores, cada uno confiando en un pequeño consejo. **Propón un libro** y observa cómo la aceptación se propaga por las rebanadas. Luego haz lo que todo buen ingeniero hace con un protocolo de consenso: **haz clic en los nodos para derribarlos** y ve qué hacen los supervivientes.

Intenta encontrar el punto donde la red *se detiene* — y nota que se detiene en lugar de dividirse.`,
    },
    {
      kind: "quiz",
      question: `En SCP, ¿cuándo acepta un nodo individual un libro?`,
      options: [
        "Cuando suficiente de su propia rebanada de quórum lo ha aceptado",
        "Cuando el 51 % de todos los nodos del planeta lo ha aceptado",
        "Cuando resuelve primero un acertijo criptográfico",
      ],
      answer: 0,
      explain: `Todo es local: un nodo avanza cuando su *consejo* avanza. El acuerdo global surge de los consejos superpuestos — ningún nodo necesita un censo de toda la red.`,
    },
    {
      kind: "theory",
      body: `## Seguridad sobre disponibilidad

Lo viste en el simulador: si derribas demasiado de un consejo, la red **espera**. No adivina. No se divide en dos historiales.

Ese es un intercambio deliberado, y tiene un nombre:

- **Seguridad** — la red nunca confirma dos libros contables conflictivos.
- **Disponibilidad** — la red sigue confirmando *algo*.

Cuando se ve obligada a elegir, SCP **se detiene en lugar de bifurcarse**. Para una red que mueve dinero — salarios, remesas, tesoros — una pausa en el pago supera a un pago que después *desaparece*.`,
    },
    {
      kind: "quiz",
      question: `Un tercio de los validadores en la rebanada de quórum de tu nodo se desconecta. ¿Qué hace tu nodo?`,
      options: [
        "Se detiene — se niega a confirmar libros hasta que su rebanada pueda volver a satisfacerse",
        "Se bifurca y mantiene su propia versión de la historia",
        "Cambia a minería hasta que regresen",
      ],
      answer: 0,
      explain: `Se detiene, no se bifurca. Tu nodo espera a su consejo; si el resto de la red aún contiene quórums operativos, *ellos* siguen cerrando libros y tu nodo se pone al día cuando su consejo regresa.`,
    },
    {
      kind: "theory",
      body: `## Qué le brinda esto a los constructores

Porque el acuerdo es barato, la red puede permitirse ser **rápida y de bajas tarifas por defecto**:

- Los libros se cierran aproximadamente cada **5 segundos** — un pago es *final*, no "probablemente final después de 6 bloques".
- La tarifa base es **100 stroops** (0.00001 XLM) — el spam resulta caro a escala, los humanos apenas lo notan.
- La finalización es real: una vez en el libro, no hay reorgs de los que temer.

Cada laboratorio de la Forja se ejecuta sobre este ritmo — ya lo sentiste si observaste una transacción confirmarse en el laboratorio de la cartera.`,
    },
    {
      kind: "rustBranch",
      lessonSlug: "stellar-101-1",
      body: `El Acto VI de la Campaña — **La Puerta de la Constelación** — recorre este mismo cielo de forma práctica: frases de red, horizontes y tus primeros mapas estelares. Opcional, y vale la desviación cuando quieres el mapa detrás de la teoría.`,
    },
  ],
};
