import type { ActText, CardText, SkirmishText } from "../types";

// Localized campaign narrative. Card NAMES and act numerals stay as-is.
export const actText: Record<string, ActText> = {
  "rust-fundamentals": {
    title: "Fundamentos de Rust",
    territory: "sintaxis, tipos, ownership",
    synopsis:
      "La planta baja del lenguaje: imprimir, bindings y mutabilidad, tipos, funciones, y las reglas de ownership y borrowing de las que depende todo lo demás.",
  },
  "control-flow": {
    title: "Control de flujo",
    territory: "ramificaciones, match, bucles",
    overlord: null,
    synopsis:
      "Ramificación y repetición en Rust, incluido el `match` exhaustivo — el mecanismo que hace seguro manejar `Option` y `Result` más adelante.",
  },
  "rust-standard-library": {
    title: "La biblioteca estándar",
    territory: "colecciones, iteradores, structs",
    overlord: null,
    synopsis:
      "Los tipos que vas a usar todos los días: `Vec`, `HashMap`, strings y slices, iteradores, y darles comportamiento a tus propios tipos con `impl`.",
  },
  "mastering-option": {
    title: "Option<T>",
    territory: "la ausencia, modelada como tipo",
    synopsis:
      "Rust no tiene null. `Option<T>` convierte 'puede que aquí no haya nada' en un caso que el compilador te obliga a manejar.",
  },
  "mastering-result": {
    title: "Result<T, E>",
    territory: "el fallo, modelado como valor",
    synopsis:
      "Los errores son valores, no excepciones. Hazles match, conviértelos y propágalos con `?` en lugar de desenrollar una pila.",
  },
  "stellar-101": {
    title: "Stellar 101",
    territory: "cuentas, lumens, trustlines, pagos",
    synopsis:
      "Cómo funciona la red de verdad: qué es una cuenta, qué paga un lumen, por qué tener un activo es opt-in, y cómo se arma y se envía un pago.",
  },
  "soroban-smart-contracts": {
    title: "Contratos inteligentes Soroban",
    territory: "contratos, almacenamiento, autorización",
    overlord: null,
    synopsis:
      "Escribir un contrato Soroban en Rust, guardar estado en él y protegerlo — las tres cosas que necesita todo contrato real.",
  },
  "stellar-protocol-27": {
    title: "Protocol 27",
    territory: "smart accounts y delegación de auth",
    overlord: null,
    synopsis:
      "La actualización actual: smart accounts que definen su propia política de auth, delegación vía CAP-0071, firmas vinculadas a la dirección y el camino de migración.",
  },
};

export const skirmishText: Record<string, SkirmishText> = {
  "rust-fundamentals-1": {
    title: "Hello, World!",
    intro:
      "Todo programa en Rust empieza en `main`. Vas a imprimir una línea exacta y conocer la macro `println!` — la herramienta con la que vas a inspeccionar todo lo que viene.",
  },
  "rust-fundamentals-2": {
    title: "Variables y mutabilidad",
    intro:
      "Los bindings son inmutables por defecto. Vas a ver el error de compilación que eso provoca y a arreglarlo con `mut` — el primero de muchos lugares donde Rust te obliga a declarar tu intención.",
  },
  "rust-fundamentals-3": {
    title: "Tipos de datos",
    intro:
      "Enteros, floats, booleanos y caracteres, y cuándo el compilador necesita que anotes un tipo que no puede inferir solo.",
  },
  "rust-fundamentals-4": {
    title: "Funciones",
    intro:
      "Parámetros, tipos de retorno y el retorno implícito de Rust: la última expresión sin punto y coma es el valor. Esa sola regla explica mucha sintaxis posterior.",
  },
  "rust-fundamentals-5": {
    title: "Fundamentos de ownership",
    intro:
      "Cada valor tiene exactamente un dueño. Asignar un `String` lo mueve, y el binding anterior queda muerto — la idea sobre la que se construye el resto de Rust.",
  },
  "rust-fundamentals-6": {
    title: "Borrowing y referencias",
    intro:
      "No tienes que entregar un valor para que una función lo lea. Presta una referencia con `&` y vuelve a ti — la alternativa cotidiana a clonar.",
  },
  "control-flow-1": {
    title: "if / else",
    intro:
      "En Rust, ramificar es una expresión, no solo una sentencia — así que un `if` puede producir un valor que ligas directamente.",
  },
  "control-flow-2": {
    title: "Expresiones match",
    intro:
      "`match` tiene que ser exhaustivo: el compilador rechaza cualquier caso que olvides. Ese es el mecanismo detrás del manejo seguro de `Option` y `Result` más adelante.",
  },
  "control-flow-3": {
    title: "loop",
    intro:
      "Un bucle incondicional, y `break` con valor — la forma idiomática de reintentar hasta que algo funcione.",
  },
  "control-flow-4": {
    title: "Bucles while",
    intro:
      "Repetir mientras se cumpla una condición. También verás por qué existe `while let` y dónde le gana a un `while` simple.",
  },
  "control-flow-5": {
    title: "Bucles for",
    intro:
      "Recorrer un rango o una colección — el bucle que de verdad vas a escribir, y el primer lugar donde aparecen los iteradores.",
  },
  "control-flow-6": {
    title: "Control de flujo anidado",
    intro:
      "Combinar ramas y bucles, y mantener el resultado legible cuando la lógica deja de ser trivial.",
  },
  "rust-standard-library-1": {
    title: "Fundamentos de Vec",
    intro:
      "Un array que crece: push, índices, y por qué `Vec` es la colección por defecto en casi todo programa Rust.",
  },
  "rust-standard-library-2": {
    title: "Iteradores",
    intro:
      "`map`, `filter` y `collect` — y el hecho de que nada se ejecuta hasta que un consumidor pide elementos.",
  },
  "rust-standard-library-3": {
    title: "Option y map",
    intro:
      "Transformar un valor que puede no estar, sin hacerle unwrap antes.",
  },
  "rust-standard-library-4": {
    title: "HashMap",
    intro:
      "Búsqueda por clave/valor, y la API `entry` que lee o inserta con un solo hash.",
  },
  "rust-standard-library-5": {
    title: "Manejo de String",
    intro:
      "`String` frente a `&str`, por qué no puedes indexar un string por número, y qué tiene que ver UTF-8 con eso.",
  },
  "rust-standard-library-6": {
    title: "Slices",
    intro:
      "Una vista prestada de parte de una colección — sin copia, sin asignación de memoria.",
  },
  "rust-standard-library-7": {
    title: "Structs",
    intro:
      "Agrupar datos relacionados bajo un nombre, con el tipo de cada campo declarado.",
  },
  "rust-standard-library-8": {
    title: "impl y métodos",
    intro:
      "Darle comportamiento a un tipo, y la diferencia entre `self`, `&self` y `&mut self`.",
  },
  "mastering-option-1": {
    title: "Some o None",
    intro:
      "`Option<T>` convierte la ausencia en un caso que el compilador te obliga a manejar — por eso Rust no tiene null.",
  },
  "mastering-option-2": {
    title: "Unwrap con seguridad",
    intro:
      "`unwrap_or`, `unwrap_or_else` y `expect`, y la regla de cuándo `unwrap()` es aceptable en producción.",
  },
  "mastering-option-3": {
    title: "if let",
    intro:
      "Hacer match de un caso e ignorar el resto, cuando un `match` completo sería ruido.",
  },
  "mastering-result-1": {
    title: "Ok o Err",
    intro:
      "`Result<T, E>` lleva el valor o el motivo del fallo — y `#[must_use]` significa que no puedes ignorarlo en silencio.",
  },
  "mastering-result-2": {
    title: "Match sobre Result",
    intro:
      "Manejar ambos brazos de forma explícita, y decidir en cada llamada si un fallo es recuperable.",
  },
  "mastering-result-3": {
    title: "El operador ?",
    intro:
      "Propagar un fallo a quien te llamó con un solo carácter, en lugar de un `match` en cada nivel.",
  },
  "stellar-101-1": {
    title: "Cuentas y keypairs",
    intro:
      "Una cuenta Stellar es una clave pública. La clave secreta firma; la pública identifica. Todo lo demás se apoya en eso.",
  },
  "stellar-101-2": {
    title: "Lumens y tarifas",
    intro:
      "XLM, stroops, la reserva base y por qué toda cuenta debe mantener un saldo mínimo.",
  },
  "stellar-101-3": {
    title: "Trustlines y activos",
    intro:
      "Tener un activo no nativo es opt-in: primero abres una trustline, y eso es una decisión deliberada del protocolo.",
  },
  "stellar-101-4": {
    title: "Tu primer pago",
    intro:
      "Armar, firmar y enviar un pago — la forma que comparte toda operación de Stellar.",
  },
  "soroban-smart-contracts-1": {
    title: "Tu primer contrato",
    intro:
      "`#[contract]`, `#[contractimpl]` y una función exportada — lo mínimo que un contrato Soroban necesita para existir.",
  },
  "soroban-smart-contracts-2": {
    title: "Almacenamiento del contrato",
    intro:
      "Almacenamiento instance, persistent y temporary: tres estantes con distinta duración y distinto costo.",
  },
  "soroban-smart-contracts-3": {
    title: "Autorización",
    intro:
      "`require_auth` es la línea entre un contrato que cualquiera puede vaciar y uno que solo su dueño puede mover.",
  },
  "stellar-protocol-27-1": {
    title: "Visión general del Protocol 27",
    intro:
      "Qué cambia la actualización, y por qué la delegación de autenticación importa a quien construye wallets.",
  },
  "stellar-protocol-27-2": {
    title: "Smart accounts y __check_auth",
    intro:
      "Una cuenta-contrato decide por sí misma qué cuenta como firma válida — esa función es toda la política.",
  },
  "stellar-protocol-27-3": {
    title: "Delegación de autenticación (CAP-0071)",
    intro:
      "Permitir que una cuenta delegue su verificación de auth a otra, y lo que eso habilita para recuperación y claves de sesión.",
  },
  "stellar-protocol-27-4": {
    title: "Seguridad de firmas y credenciales V2",
    intro:
      "Firmas vinculadas a la dirección, y el ataque de replay que cierra el formato de credencial V2.",
  },
  "stellar-protocol-27-5": {
    title: "Migrando al Protocol 27",
    intro:
      "Qué se rompe, qué no, y en qué orden cambiar las cosas en los SDKs.",
  },
  "stellar-protocol-27-6": {
    title: "Juntándolo todo: una cuenta delegada",
    intro:
      "Implementa `__check_auth` de punta a punta: verifica la firma, respeta al delegado y rechaza el replay.",
  },
};

export const cardText: Record<string, CardText> = {
  stroowarrior: {
    type: "Guerrero",
    flavor:
      "Perdió su primera pelea con el borrow checker. Leyó el error. Ganó la revancha.",
  },
  stropillusion: {
    epithet: "Explorador del Salón de los Espejos",
    type: "Stropie · Ilusionista",
    flavor:
      "Cada espejo es una rama distinta, y match no le deja saltarse ninguna.",
  },
  stroopkeeper: {
    epithet: "Guardián de las Bóvedas Infinitas",
    type: "Stropie · Archivista",
    flavor:
      "Cada herramienta jamás forjada duerme en sus bóvedas — indexada desde cero, como querían los dioses antiguos.",
  },
  stroophantom: {
    epithet: "El Caballero Que Quizá No Sea",
    type: "Stropie · Espectro",
    flavor:
      "Pregúntale si está ahí. Nunca lo asumas. El pantano está lleno de los que hicieron unwrap.",
  },
  strooracle: {
    epithet: "Árbitro de los Dos Destinos",
    type: "Stropie · Oráculo",
    flavor:
      "Dos puertas, un veredicto. Ella jamás ha ignorado un Result, y no va a empezar con el tuyo.",
  },
  astrostroopie: {
    epithet: "Viajero de la Puerta de la Constelación",
    type: "Stropie · Viajero",
    flavor:
      "Cruzó la Puerta con la reserva cubierta y la clave secreta para él solo.",
  },
  stroopbeholder: {
    type: "Stropie · Aberración",
    flavor: "Sus muchos ojos buscan una sola cosa: un require_auth olvidado.",
  },
  stroopzipper: {
    epithet: "Heraldo del Cielo Reescrito",
    type: "Stropie · Heraldo",
    flavor:
      "Nada de fork: la red vota y cambia entera en un solo ledger.",
  },
};
