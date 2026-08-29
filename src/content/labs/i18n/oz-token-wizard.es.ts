import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Asistente de Tokens OpenZeppelin",
    tagline: "Elige extensiones, genera Rust de verdad y despliega tu propio token.",
  },
  steps: {
    "intro": {
      body: `## No forjes solo

Los buenos herreros no funden su propio hierro para cada espada. En Stellar, los contratos de token se forjan a partir de **los bloques auditados de OpenZeppelin** — las mismas bibliotecas probadas en batalla que aseguran miles de millones en cadenas, portadas a Soroban como \`stellar-tokens\`.

En los próximos minutos **elegirás tus extensiones**, verás cómo la Forja construye **Rust de verdad** a partir de ellas, **compilarás** el código en un runner aislado, **desplegar el Wasm** en testnet con tu propia firma y **acuñar** tu primera oferta.

No hay maquetas. El mismo flujo que usa el IDE en modo libre.`,
    },
    "sigil": {
      title: "Invoca tu sigilo",
      body: `Desplegar cuesta una firma, y una firma necesita tu par de claves. Si forjaste uno en el laboratorio de cartera, la Forja lo reutiliza; si no, se crea uno nuevo ahora.`,
      cta: "Preparar el par de claves",
      successBody: `Tu sigilo responde:

\`{address}\`

Todas las transacciones futuras — el despliegue, el acuñamiento — llevarán esta firma.`,
    },
    "fund": {
      title: "Alimenta la cuenta",
      body: `Los despliegues y las invocaciones pagan pequeñas tarifas de recursos, así que la cuenta debe existir y tener saldo. Friendbot la financia; si ya tiene fondos, la Forja simplemente la reutiliza.`,
      cta: "Financiar con Friendbot",
      successBody: `La cuenta está activa, con {balance} XLM disponibles. Hay saldo de sobra para muchos despliegues.`,
    },
    "name": {
      prompt: `## Nombra tu creación

El **nombre** del token es un metadato visible para el usuario y almacenado on-chain por el constructor — las carteras y exploradores lo mostrarán.`,
      placeholder: "Forja Oro",
      hint: "2–24 caracteres",
    },
    "symbol": {
      prompt: `## Dale un símbolo

El ticker corto — lo que aparece en saldos y pares de negociación.`,
      placeholder: "FGOLD",
      hint: "2–12 letras/dígitos, comienza con una letra",
    },
    "supply": {
      prompt: `## Establece la oferta inicial

Acuñada para **ti** por el constructor, en tokens enteros. Tu token usa **7 decimales** — la convención Stellar — así que el contrato almacena tu número × 10⁷ internamente.`,
      placeholder: "1000",
      hint: "1 a 999,999,999 tokens enteros",
    },
    "ext-pausable": {
      prompt: `## Extensión: ¿Pausable?

Un token **pausable** tiene un freno de emergencia: el propietario puede congelar transferencias y acuñados mientras se investiga un incidente, luego reanudar. Los emisores regulados casi siempre lo quieren; una moneda meme puede preferir la pureza sin frenos.`,
      options: [
        {
          label: "Sí — añade el freno de emergencia",
          value: "yes",
          blurb: "El propietario puede pausar/despausar cada transferencia, acuñación y quema.",
        },
        {
          label: "No — imparable por diseño",
          value: "no",
          blurb: "No existe un interruptor de pausa. Nadie puede congelarlo, incluido tú.",
        },
      ],
    },
    "ext-burnable": {
      prompt: `## Extensión: ¿Burnable?

Un token **burnable** permite a los titulares destruir sus propias unidades, reduciendo la oferta total — útil para flujos de canje ("quema el cupón, recibe los bienes") y diseños deflacionarios.`,
      options: [
        {
          label: "Sí — los titulares pueden quemar",
          value: "yes",
          blurb: "Añade burn y burn_from de la extensión burnable de OpenZeppelin.",
        },
        {
          label: "No — la oferta solo crece",
          value: "no",
          blurb: "No se compilan puntos de entrada de quema en absoluto.",
        },
      ],
    },
    "quiz-oz": {
      question: `¿Por qué el asistente construye tu token a partir de los bloques de OpenZeppelin en lugar de escribir Rust nuevo desde cero?`,
      options: [
        "Código auditado y ampliamente revisado con una interfaz estándar supera al código nuevo para las partes que comparte cada token",
        "Escribir un token desde cero es imposible en Rust",
        "Los contratos de OpenZeppelin son el único código que la red Stellar aceptará",
      ],
      explain: `La red ejecuta cualquier Wasm válido — pero la lógica del token es exactamente donde un error sutil cuesta dinero real, y donde los estándares (SEP-41) hacen que tu token sea legible para cada cartera y DEX. La novedad es para tu producto, no para la infraestructura básica del token.`,
    },
    "build": {
      title: "Genera el Rust y compila",
      body: `La Forja ahora construye **{name} ({symbol})** a partir de tus elecciones — Rust de verdad con \`stellar-tokens\`, fijado a las mismas versiones auditadas que usa el IDE — y lo compila a **WebAssembly** en un runner aislado. Una compilación real tarda un minuto o dos; obsérvalo.`,
      cta: "Compila a Wasm",
      successBody: `El runner devolvió tu contrato como un **blob Wasm**: el Rust fue transformado para la máquina virtual del ledger.

Observa lo que NO sucedió: tu nombre, símbolo y oferta no están incrustados en el código. Viajan como **argumentos del constructor** en el siguiente paso, así que el mismo Wasm verificado podría dar vida a mil tokens diferentes.`,
    },
    "deploy": {
      title: "Despliega en la testnet",
      body: `Dos transacciones, ambas firmadas por ti: primero el Wasm se **sube** al libro mayor, luego se crea una **instancia de contrato** a partir de él — y su \`__constructor\` se ejecuta una vez con tu nombre, símbolo y oferta, acuñando todo a tu dirección.`,
      cta: "Despliega y ejecuta el constructor",
      successBody: `**{symbol} vive.** Dirección del contrato:

\`{contract}\`

Esa dirección ahora responde a llamadas SEP-41 — \`balance\`, \`transfer\`, \`name\` — para cualquier cartera, explorador o contrato que lo solicite. También apareció en el panel **Interact** del IDE de la Forja: la misma Forja y los mismos despliegues.`,
    },
    "mint": {
      title: "Acuña una ronda de bonificación",
      body: `El constructor ya acuñó la oferta inicial para ti. Ahora invoca directamente el contrato vivo: la Forja consulta su **especificación on-chain**, construye una llamada \`mint\`, **la simula** y te pide firmar la transacción real: el mismo flujo de simular y después firmar que usan todas las dApps de Soroban.`,
      cta: "Acuña 25 más {symbol}",
      successBody: `Acuñación completada: 25 {symbol} más en tu saldo. La operación fue autorizada porque el contrato verificó \`owner.require_auth()\` y **tú eres el propietario**.

Cualquiera que llame a \`mint\` será rechazado por la misma línea. Eso es control de acceso en cadena, reforzado por el código que elegiste.`,
    },
    "quiz-sep41": {
      question: `Tu token implementa SEP-41. ¿Qué le aporta eso?`,
      options: [
        "Cada cartera, DEX y contrato que hable la interfaz estándar puede poseer, mostrar y moverlo — sin integración personalizada",
        "Listado automático en todos los exchanges",
        "Inmunidad a errores — el estándar está auditado, así que las implementaciones también",
      ],
      explain: `Un estándar es un lenguaje compartido, no un trato de marketing ni una garantía de seguridad. SEP-41 significa que tu token responde a las llamadas que el ecosistema ya sabe hacer — por eso el asistente se basó en el estándar en lugar de inventar puntos de entrada.`,
    },
    "claim": {
      body: `El ledger conserva tu Wasm, tu contrato y un saldo acuñado a tu sigilo. La Forja consultará la propia cadena — **simulando \`balance(you)\` en tu contrato** — antes de liberar la recompensa. Prueba, no promesas.`,
    },
  },
} satisfies LabTextOverlay;
