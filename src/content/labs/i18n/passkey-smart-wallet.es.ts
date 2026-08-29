import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Smart Wallet con Passkey",
    tagline: "Una cartera sin frase semilla — tu dispositivo firma.",
  },
  steps: {
    "intro": {
      body: `## La clave que nunca ves

Una cartera Stellar clásica comienza con un secreto \`S…\`. Una **cartera con passkey** comienza dentro del hardware seguro de tu teléfono o computadora. WebAuthn solicita que ese hardware cree una clave **secp256r1** y solo libera la parte pública; Face ID, Touch ID, un PIN o una clave de seguridad desbloquean cada firma.

Hoy vas a registrar una passkey real, desplegar un contrato de smart account en testnet y responder a un nuevo desafío de autenticación con ella. Nunca se mostrará una frase semilla — porque no existe ninguna.`,
    },
    "forge-deployer": {
      title: "Prepara la cuenta de lanzamiento",
      body: `Un contrato no puede pagar la tarifa de su propio nacimiento. La Forja necesita una pequeña cuenta **G** ordinaria para lanzarlo. Si ya has forjado una, se reutiliza; de lo contrario se crea un nuevo par de claves solo para testnet en este navegador.

Esta cuenta de lanzamiento **no** firma por la smart wallet. Solo paga la comisión y aporta el salt del despliegue; nada más.`,
      cta: "Prepara la cuenta de lanzamiento",
      successBody: `Cuenta de lanzamiento lista:

\`{address}\`

El secreto permanece en este navegador. La passkey que crearás a continuación vivirá por separado en el hardware seguro.`,
    },
    "fund-deployer": {
      title: "Alimenta el lanzamiento",
      body: `Desplegar un contrato Soroban consume XLM de testnet para la tarifa del sobre y los recursos del libro mayor. Friendbot financia la cuenta de lanzamiento; si ya existe, la Forja simplemente la reutiliza.`,
      cta: "Financia con Friendbot",
      successBody: `{balance} XLM ahora alimenta la cuenta de lanzamiento. Suficiente para desplegar la cartera inteligente sin un relayer y sin darle a la llave de lanzamiento ningún control sobre ella.`,
    },
    "quiz-secret": {
      question: `¿Dónde se guarda la parte privada de una passkey?`,
      options: [
        "Dentro del hardware seguro del autenticador; la aplicación recibe firmas, nunca la clave privada",
        "Cifrada en la base de datos de TUSST para que el servidor pueda firmar después",
        "Dentro del contrato de cuenta inteligente como datos públicos del libro mayor",
      ],
      explain: `Exacto. El navegador negocia un desafío con el autenticador. La cadena ve una clave pública y una firma; TUSST nunca recibe material de clave privada.`,
    },
    "create-passkey-wallet": {
      title: "Registra la passkey y despliega la cartera",
      body: `Tu dispositivo abrirá su cuadro de diálogo nativo de passkey. Después de que lo apruebes, la Forja construirá una **smart account de Protocol 27** cuya firma predeterminada es esa credencial; después, la cuenta de lanzamiento paga la tarifa de despliegue directamente a través de RPC.

El código de la cuenta es el Wasm canónico basado en OpenZeppelin publicado con \`smart-account-kit@0.6.2\`.`,
      cta: "Crear la passkey y desplegar la cartera",
      successBody: `Tu cartera sin frase semilla está activa en testnet:

\`{contract}\`

La dirección comienza con **C** porque la cartera es un contrato. Su regla de autorización apunta a la passkey que acabas de crear — no a la cuenta G que pagó el despliegue.`,
    },
    "quiz-authority": {
      question: `La cuenta G pagó para desplegar la cartera inteligente. ¿Su secreto puede autorizar gastos desde la nueva cuenta C?`,
      options: [
        "No — pagar el despliegue no la convierte en firmante; las reglas de autorización de la cuenta inteligente deciden",
        "Sí — el pagador de tarifas posee permanentemente cada contrato que despliega",
        "Solo hasta el próximo cierre de libro mayor",
      ],
      explain: `Correcto. La cuenta de origen, el pagador de la comisión, el salt del deployer y el firmante de la smart account son roles separados. La firma predeterminada de esta cartera es la credencial WebAuthn.`,
    },
    "authenticate-passkey": {
      title: "Deja que la passkey firme",
      body: `El despliegue registró una clave pública, pero una cartera solo es útil cuando la red acepta sus firmas. La Forja financia la nueva cuenta C con XLM de testnet, prepara una **transferencia de 1 XLM de vuelta a tu cuenta de lanzamiento**, y pide a la credencial vinculada vinculada a \`{contract}\` que la autorice.

Aprueba el cuadro de diálogo del dispositivo. Esta vez la firma se envía a la red y el \`__check_auth\` de la smart account debe aceptarla.`,
      cta: "Firma y envía 1 XLM con la passkey",
      successBody: `La transferencia se completó. Tu hardware seguro firmó, el verificador WebAuthn comprobó la prueba secp256r1, y \`__check_auth\` autorizó a la smart wallet a enviar **1 XLM**.

Esa transacción es prueba pública de que la passkey controla \`{contract}\` — no solo que apareció un cuadro de diálogo en el navegador.`,
    },
    "quiz-cap71": {
      question: `¿Qué hizo más fácil CAP-71 en Protocol 27 para las cuentas inteligentes?`,
      options: [
        "Delegar autenticación de forma limpia, reduciendo el peso y el costo de los flujos de autorización con varios firmantes",
        "Convertir automáticamente cada cuenta G clásica en una passkey",
        "Eliminar todas las tarifas de transacción de la red",
      ],
      explain: `La delegación es la infraestructura del protocolo: una autoridad puede delegar trabajo de autenticación a otra sin cargar el antiguo formato completo de autorización en cada transacción. Esto ayuda a las smart accounts; no elimina tarifas ni reescribe cuentas clásicas.`,
    },
    "claim": {
      body: `La Forja ahora consultará la propia testnet: la cuenta G de lanzamiento debe existir, la dirección C debe resolver al **código canónico de la smart account de Protocol 27**, y esa cartera inteligente debe seguir manteniendo XLM nativo después de su transferencia firmada por la passkey. Solo entonces el ledger libera los XP del lab.`,
    },
  },
} satisfies LabTextOverlay;
