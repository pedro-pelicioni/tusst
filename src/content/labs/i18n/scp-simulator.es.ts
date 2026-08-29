import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "SCP: El Consejo de Nodos",
    tagline: "Construye quórums, observa cómo converge el consenso, y rompe el proceso a propósito.",
  },
  steps: {
    "intro": {
      body: `## El consejo decide

No hay minería. No hay staking. Stellar cierra un libro mayor cada ~5 segundos porque sus validadores ejecutan el **Protocolo de Consenso de Stellar**: cada nodo nombra un pequeño **consejo** (su *quorum slice*) y avanza cuando suficientes miembros de ese consejo avanzan.

Delante de ti se encuentra una red en miniatura — siete validadores en tres organizaciones. Vas a hacer que todos se pongan de acuerdo… y luego romperás ese acuerdo.`,
    },
    "sim-first-close": {
      body: `### Primero: haz que todos se pongan de acuerdo

Presiona **Proponer un libro mayor** y observa cómo la aceptación se propaga hacia afuera, consejo por consejo, hasta que cada asiento se ilumina — eso es un cierre de libro mayor.

Cierra algunos. Siente el ritmo.`,
    },
    "quiz-local": {
      question: `Observaste cómo la aceptación se extendía nodo por nodo. ¿Qué hizo que cada nodo se iluminara?`,
      options: [
        "Suficiente de su propio consejo ya había aceptado",
        "Recibió permiso de un coordinador central",
        "Ganó una lotería aleatoria ponderada por participación",
      ],
      explain: `Todo local: un nodo no necesita un censo de la red, solo su consejo. Los consejos superpuestos convierten la confianza local en acuerdo global.`,
    },
    "sim-break-it": {
      body: `### Ahora: rompe el proceso

Desactiva un nodo y propón otro ledger: la red ni se inmuta. Desactiva más nodos, concentrados en una región de confianza, y encuentra el momento en que los sobrevivientes **se detienen**.

Observa lo que *no* hacen: nunca se dividen en dos historias competidoras.`,
    },
    "quiz-safety": {
      question: `Desactivaste una parte suficiente del consejo y los supervivientes se detuvieron en lugar de continuar. ¿Por qué es ese el comportamiento *diseñado* para una red de pagos?`,
      options: [
        "Un pago pausado es recuperable; un pago que luego se deshace no lo es",
        "Congelar ahorra electricidad durante cortes",
        "Le da a los nodos caídos tiempo para ser reemplazados por mineros",
      ],
      explain: `Seguridad antes que vivacidad: SCP se detiene en lugar de bifurcarse. Un pago confirmado debe seguir confirmado; cuando el acuerdo es imposible, Stellar espera.`,
    },
    "quiz-recovery": {
      question: `Levantas de nuevo a los nodos caídos. ¿Qué sucede con los asientos detenidos?`,
      options: [
        "Sus consejos pueden satisfacerse de nuevo — la red reanuda el cierre de libros mayores",
        "Deben volver a descargar la cadena desde el génesis",
        "Nada; una red detenida permanece detenida para siempre",
      ],
      explain: `Pruébalo en el simulador: levanta los caídos, propone, y el ritmo vuelve. Las detenciones son pausas, no muertes.`,
    },
    "claim": {
      body: `Has cerrado libros mayores, detenido una red y la has recuperado — el ciclo completo de acuerdo federado, en una sola sesión. Completa el lab y recibe tus XP.`,
    },
  },
} satisfies LabTextOverlay;
