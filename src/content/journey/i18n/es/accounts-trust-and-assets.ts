import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "Cuentas, Confianza y Activos",
  tagline: "Cuentas, reservas y trustlines: por qué tener un activo es opt-in.",
  steps: [
    {
      kind: "theory",
      body: `## Una cuenta es una entrada del libro mayor

Quita la interfaz de la billetera y una **cuenta** de Stellar es una fila en el libro mayor replicado: una clave pública, un saldo de XLM, algunas banderas — y el **número de secuencia** que viste al diseccionar sobres (el contador a prueba de re‑reproducción).

Las filas no son gratuitas. Cada validador almacena cada entrada, por lo que cada una debe bloquear una **reserva base** de XLM — actualmente 0,5 XLM, y una cuenta nueva debe mantener al menos dos (1 XLM) que no puede gastar. Si eliminas entradas, la reserva vuelve.

La reserva no es una tarifa. Es **alquiler‑por‑depósito**: el libro mayor se mantiene liviano porque el exceso tiene un costo.`,
    },
    {
      kind: "theory",
      body: `## Líneas de confianza: los activos son opt‑in

En muchas cadenas cualquiera puede lanzar tokens basura a tu dirección. En Stellar no pueden: para mantener cualquier activo que no sea XLM, tu cuenta debe abrir primero una **línea de confianza** hacia él.

Una línea de confianza dice: *"Acepto el activo X del emisor Y, hasta este **límite**."* Se crea con la operación \`change_trust\`, es su propia entrada en el libro mayor — por lo que bloquea **una reserva base** — y mientras no exista, los pagos de ese activo a ti simplemente fallan.

Opt‑in por diseño: tu balance solo contiene lo que aceptaste mantener.`,
    },
    {
      kind: "diagram",
      body: "Un activo emitido, y quién puede tocarlo:",
      caption: "Las líneas discontinuas son trustlines: opt-in y reversibles. La sólida existe solo porque sus dos extremos aceptaron.",
      view: {
        kind: "graph",
        nodes: [
          {
            id: "issuer",
            label: "EMISOR",
            x: 50,
            y: 12,
            tone: "gold",
            shape: "box",
            note: "Trae el activo a la existencia simplemente pagando con él. No hay mint ni tabla de oferta.",
          },
          {
            id: "ana",
            label: "ANA",
            x: 16,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "Abrió una trustline: ese opt-in es lo que le permite tener el activo.",
          },
          {
            id: "bruno",
            label: "BRUNO",
            x: 50,
            y: 45,
            tone: "accent",
            shape: "box",
            note: "También aceptó, así que Ana puede pagarle. Ambos extremos necesitan trustline.",
          },
          {
            id: "caio",
            label: "CAIO",
            x: 84,
            y: 45,
            tone: "neutral",
            shape: "box",
            note: "Nunca abrió una. Nadie puede enviarle este activo, por mucho que lo intente.",
          },
        ],
        edges: [
          {
            from: "issuer",
            to: "ana",
            label: "trustline",
            style: "dashed",
          },
          {
            from: "issuer",
            to: "bruno",
            style: "dashed",
          },
          {
            from: "ana",
            to: "bruno",
            label: "pago",
            style: "solid",
          },
        ],
      },
    },
    { kind: "theory", body: `## La reserva, contada

Las reglas abstractas sobre reservas se vuelven obvias en cuanto sumas una. Esta es una cuenta corriente en uso:

- **La cuenta misma** — 2 reservas base.
- **Tres trustlines** — USDC, EURC y el token local de un anchor: 3 más.
- **Una oferta abierta** en el DEX — 1 más.

Seis entradas a **0,5 XLM cada una: 3 XLM bloqueados.** Si la cuenta tiene 3,4 XLM, su saldo gastable es 0,4 — y un pago de 1 XLM fallará, con un saldo que a la vista parece cubrirlo de sobra.

Ese error tiene nombre en todas las colas de soporte de Stellar: *"tengo fondos pero el pago dice sin fondos."* Los fondos están. Solo que no están **disponibles**, porque disponibilidad es total menos reserva, y la reserva creció cada vez que la cuenta aceptó guardar algo nuevo.

La buena noticia es que nada de eso se gastó. Cierra la oferta y vuelven 0,5 XLM. Cierra una trustline que ya no usas y vuelve otra. La reserva es un depósito por espacio en el libro mayor, devuelto en cuanto dejas de ocuparlo.` },
    { kind: "theory", body: `## Qué está evitando realmente el opt-in

La trustline parece burocracia hasta que imaginas el libro mayor sin ella.

En una cadena donde cualquiera puede empujar un token a cualquier dirección, tu billetera es un buzón público en el que escriben desconocidos. Llegan tokens sin pedir permiso — unos como marketing, otros nombrados para hacerse pasar por un activo real, otros diseñados para que interactuar con ellos te cueste algo. Entonces cada billetera necesita un filtro, cada filtro una lista, y cada lista es el criterio de alguien sobre lo que se te permite ver.

Stellar baja esa decisión una capa, al protocolo: **un activo no puede aterrizar en una cuenta que no ha abierto una trustline hacia él.** Nadie mete nada en tu cuenta sin tu consentimiento previo, explícito y registrado en el libro mayor.

La reserva es lo que hace honesto ese consentimiento. Cada trustline bloquea 0,5 XLM, así que abrir una es un acto pequeño y deliberado en vez de algo que un script hace diez mil veces — y cerrarla devuelve la reserva.

La fricción era el punto.` },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Ya lo hiciste con tus propias manos: el laboratorio **Tu Primera Billetera** de la Forja envía \`change_trust\` con tu firma en la testnet activa — el momento en que un nuevo activo apareció en tu saldo fue el nacimiento de una línea de confianza. Si te saltaste ese laboratorio, este es el capítulo perfecto para abrir una ahora mismo.`,
    },
    { kind: "theory", body: `## Guardar, y crear

Ya sabes leer cualquier cuenta del libro mayor: cuánto le cuesta existir, cuánto suma cada entrada a ese coste, y qué activos ha aceptado guardar.

Todo hasta aquí ha sido desde el lado de quien guarda. Dale la vuelta y aparece otro conjunto de preguntas: cómo llega a existir un activo, quién puede crear uno, y — la pregunta que todo emisor regulado debe responder — ¿puede el emisor controlar quién lo tiene después?

**A continuación:** el otro lado de la trustline.` },
  ],
  testOut: [
    { question: `¿Qué es una cuenta en Stellar, estructuralmente?`,
      options: ["Una entrada del libro mayor con saldo, número de secuencia y firmantes — que cuesta una reserva mínima para seguir existiendo","Un registro dentro de un contrato de sistema al que el protocolo llama","Una clave pública; el libro mayor no guarda nada hasta que se usa"], answer: 0 },
    { question: `¿Por qué cada entrada adicional eleva el saldo mínimo de una cuenta?`,
      options: ["Cada entrada le cuesta almacenamiento a todo validador, así que la reserva tarifa ese coste continuo — y se devuelve al eliminarla","Es una comisión que financia la operación de los validadores","Desalienta que las cuentas tengan más de un activo"], answer: 0 },
    { question: `Alguien te envía un activo del que nunca has oído hablar. ¿Qué pasa?`,
      options: ["El pago falla — un activo no puede aterrizar en una cuenta que no ha abierto una trustline hacia él","Llega y aparece en tus saldos hasta que lo elimines","El protocolo lo retiene hasta que aceptes o rechaces"], answer: 0 },
    { question: `¿A qué te compromete realmente abrir una trustline?`,
      options: ["A bloquear una reserva y consentir, en el libro mayor, en guardar ese activo concreto de ese emisor concreto","A confiar en que el emisor no congelará tu saldo","A pagar una comisión recurrente mientras tengas el activo"], answer: 0 },
  ],
};
