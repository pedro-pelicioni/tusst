import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "La Bóveda del Gremio",
    tagline: "Umbrales multisig: un tesoro que exige dos oficiales.",
  },
  steps: {
    intro: {
      body: `## Una sola clave es un punto único de fallo

Todo lo que has firmado hasta ahora necesitó exactamente una firma: la tuya. Eso vale para una cuenta de juego y es temerario para un tesoro — la clave que mueve todo es también la que pueden robar, perder o arrancarte.

La respuesta habitual en otras cadenas es desplegar un contrato multisig. En Stellar no despliegas nada: **toda cuenta ya tiene firmantes y umbrales**. Subir el listón es una configuración.`,
    },
    "forge-keys": {
      title: "El primer oficial",
      body: `Tu propio par de claves — la cuenta que se convertirá en la bóveda.`,
      cta: "Preparar las claves",
      successBody: `La bóveda será \`{address}\`.`,
    },
    fund: {
      title: "Financia la bóveda",
      body: `Los firmantes son subentradas, y las subentradas cuestan reserva. Una bóveda sin XLM no puede permitirse un segundo oficial.`,
      cta: "Llamar al Friendbot",
      successBody: `Financiada: {balance} XLM.`,
    },
    weights: {
      body: `## Pesos, no cargos

Stellar no tiene la noción de "admin". Tiene aritmética.

Cada firmante lleva un **peso**. Cada tipo de operación está protegido por uno de tres **umbrales**: bajo, medio, alto. Una transacción se autoriza cuando los pesos de sus firmas suman el umbral de la operación que lleva.

- **Bajo** — abrir trustline, avanzar secuencia.
- **Medio** — pagos, ofertas, casi todo lo del día a día.
- **Alto** — cambiar los propios firmantes y umbrales.

Tu cuenta ahora mismo: un firmante (la clave maestra) con peso 1, todos los umbrales en 0. Una firma lo resuelve todo.`,
    },
    "second-officer": {
      title: "Nombra al segundo oficial",
      body: `Un segundo par de claves. Aquí solo importa la dirección **pública** — la bóveda necesita saber quién puede cofirmar, no el secreto de esa persona.`,
      cta: "Nombrar un oficial",
      successBody: `El segundo oficial es \`{companion}\`.

Esa dirección va a quedar escrita en la propia entrada de la bóveda en el ledger, junto a la tuya.`,
    },
    "quiz-threshold": {
      question: `Añades al oficial con peso 1 y pones el umbral **medio** en 2. ¿Qué puede hacer tu clave maestra sola a partir de ese momento?`,
      options: [
        "Nada que exija medio: un pago ahora requiere ambas firmas",
        "Todo, ya que la clave maestra siempre pasa por encima de los umbrales",
        "Solo operaciones que ya había firmado antes del cambio",
      ],
      explain: `No hay forma de pasar por encima. La clave maestra es solo un firmante con un peso, y si su peso por sí solo no alcanza el umbral, su firma por sí sola no basta. Esa es toda la propiedad de seguridad — y todo el riesgo del que se cuida el paso siguiente.`,
    },
    "raise-the-bar": {
      title: "Sube el listón",
      body: `Una sola operación lo hace todo: añade al oficial con peso 1, mantiene tu clave maestra en peso 1, y pone el **medio** en 2.

Fíjate en lo que queda deliberadamente intacto: el umbral **alto** sigue en 0, así que todavía puedes deshacer este arreglo con una sola firma. Subir alto a la vez que medio es como la gente se queda fuera de su propia bóveda para siempre.`,
      cta: "Definir los umbrales",
      successBody: `La bóveda está sellada.

Dos firmantes, cada uno con peso 1, y umbral medio 2. Desde ahora un pago desde esta cuenta necesita a **ambos** oficiales — y quien lo hace cumplir es el ledger, no tu documento de proceso.

Abre la pestaña **Cuenta** de la Fragua con esta dirección: los firmantes y los umbrales están ahí, tal como los ve la cadena.`,
    },
    "quiz-lockout": {
      question: `Un gremio pone medio **y** alto en 3, con tres oficiales de peso 1. Un oficial pierde su clave. ¿En qué estado queda esa bóveda?`,
      options: [
        "Congelada para siempre: cambiar los firmantes exige alto, y alto ya no se alcanza",
        "Bien: los dos restantes pueden destituir la clave perdida",
        "Bien: la clave maestra siempre puede reiniciar los firmantes",
      ],
      explain: `Esta es con diferencia la forma más común en que muere un tesoro real. La regla que te protege del ladrón protege igual su ausencia. Deja siempre una vía de recuperación cuyo umbral todavía puedas alcanzar.`,
    },
    "claim-xp": {
      body: `Convertiste una cuenta corriente en un tesoro de dos-de-dos sin desplegar una línea de código.

El servidor va a leer esta cuenta en la cadena y comprobarlo por su cuenta: al menos dos firmantes, umbral medio al menos 2.`,
    },
  },
} satisfies LabTextOverlay;
