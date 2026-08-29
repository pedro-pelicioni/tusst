import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "El Cofre del Tesoro",
    tagline: "Guarda oro en un cofre que solo abre el beneficiario nombrado.",
  },
  steps: {
    intro: {
      body: `## Oro que todavía no es de nadie

Todos los saldos que has visto hasta ahora pertenecen a una cuenta. Un **saldo reclamable** no pertenece a nadie: es una entrada propia del ledger, con un importe, con quién puede tomarlo y bajo qué condición.

Quien envió ya no tiene el oro. Quien va a recibirlo tampoco lo tiene — no hasta que estire la mano. Mientras tanto queda en el ledger, visible para todos, retirable por exactamente una dirección.

Así se construyen custodia, airdrops, vesting y "toma, cógelo cuando puedas" sin una línea de contrato.`,
    },
    "forge-keys": {
      title: "Trae tus claves",
      body: `El mismo par de claves que usa la Fragua. Si ya forjaste uno en otro lab, esto simplemente lo retoma.`,
      cta: "Preparar las claves",
      successBody: `Trabajando como \`{address}\`.`,
    },
    fund: {
      title: "Financia la cuenta",
      body: `Un saldo reclamable le cuesta una reserva a quien lo crea — el ledger cobra por cada entrada que tiene que guardar. Necesitas XLM antes de poder bloquear nada.`,
      cta: "Llamar al Friendbot",
      successBody: `Financiada: {balance} XLM.

Recuerda ese número. En dos pasos será menor que la cantidad bloqueada — porque el propio cofre tiene alquiler.`,
    },
    "quiz-nature": {
      question: `Bloqueas 5 XLM en un saldo reclamable para un amigo. Antes de que lo reclame, ¿en el saldo de quién están esos 5 XLM?`,
      options: [
        "De nadie: queda como entrada propia del ledger hasta que el beneficiario la tome",
        "Siguen siendo tuyos, solo que marcados como reservados",
        "Ya son de tu amigo, simplemente no se ha dado cuenta",
      ],
      explain: `Esto es lo que lo diferencia de un pago pendiente. La entrada existe, los fondos están comprometidos, y la única cuenta que puede moverlos es la que aparece nombrada en ella.`,
    },
    lock: {
      title: "Cierra el cofre",
      body: `Cinco XLM, reclamables por ti. Nombrarte a ti mismo es la forma honesta de aprender el mecanismo — todo funciona igual cuando el beneficiario es otra persona.

La condición aquí es **incondicional**: reclamable en cuanto existe. Stellar también te deja decir "no antes de esta hora", que es como se escribe un calendario de vesting o una apertura a medianoche.`,
      cta: "Bloquear 5 XLM",
      successBody: `El cofre está en el ledger.

Tu saldo en XLM bajó más de cinco: lo extra es la **reserva** de la propia entrada. Reclama el saldo más tarde y esa reserva vuelve — el ledger alquila espacio, no lo vende.`,
    },
    "balance-id": {
      prompt: `## Encuentra tu propio cofre

El motor nunca te dio el id del cofre — un hash de transacción no es un id de saldo. Así que ve a leer el ledger.

Abre la **Fragua → ledger**, elige *saldos reclamables* y pon tu propia dirección en el campo de beneficiario. Tu cofre es la entrada con \`5.0000000\`. Copia su \`id\` — 72 caracteres hexadecimales — y pégalo aquí.`,
      placeholder: "0000000000…",
      hint: "72 caracteres hexadecimales, empezando por varios ceros.",
    },
    claim: {
      title: "Abre el cofre",
      body: `Eres el beneficiario nombrado y la condición se cumple. Recupera el oro.`,
      cta: "Reclamar el saldo",
      successBody: `Reclamado. La entrada desapareció del ledger, los cinco XLM volvieron a tu saldo — y la media reserva que pagaba su alquiler también.

Prueba otra vez la consulta del ledger: el cofre ya no existe. Lo que queda es la *operación* en tu historial, que es justo lo que demuestra que lo hiciste.`,
    },
    "quiz-predicate": {
      question: `Quieres un cofre que tu socia solo pueda abrir **después del cliff de vesting**, dentro de un año. ¿Qué cambia?`,
      options: [
        "El predicado del beneficiario: \"no antes de esa fecha\" en lugar de incondicional",
        "Tienes que desplegar un contrato para sostenerlo",
        "Nada: solo le pides amablemente que espere",
      ],
      explain: `Los predicados se componen: antes/después de un instante, y/o/no de otros predicados. Toda una clase de custodia nunca necesita un contrato — y lo que no tiene contrato no puede tener un bug de contrato.`,
    },
    "claim-xp": {
      body: `Bloqueaste valor en una entrada que no era de nadie, la encontraste leyendo el ledger con tus propias manos, y la recuperaste.

El servidor va a comprobar en tu historial de operaciones ese \`create_claimable_balance\`. No acepta tu palabra — nunca la acepta.`,
    },
  },
} satisfies LabTextOverlay;
