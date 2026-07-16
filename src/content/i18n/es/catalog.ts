import type { TrackText } from "../types";

// Localized track/lesson catalog titles (override DB values at render time).
export const trackText: Record<string, TrackText> = {
  "rust-fundamentals": {
    title: "Fundamentos de Rust",
    description:
      "Domina las bases del lenguaje de programación Rust, desde la sintaxis hasta los conceptos de ownership.",
  },
  "control-flow": {
    title: "Control de flujo",
    description:
      "Aprende a controlar el flujo de tu programa en Rust usando bucles y sentencias condicionales.",
  },
  "rust-standard-library": {
    title: "Biblioteca estándar de Rust",
    description:
      "Explora la biblioteca estándar de Rust y aprende a usar sus potentes herramientas.",
  },
  "mastering-option": {
    title: "Dominando Option<T>",
    description:
      "Aprende a usar el tipo Option<T> para manejar valores opcionales en Rust.",
  },
  "mastering-result": {
    title: "Dominando Result<T, E>",
    description:
      "Aprende a usar el tipo Result<T, E> para manejar errores en Rust.",
  },
  "stellar-101": {
    title: "Stellar 101",
    description:
      "Da tus primeros pasos en la red Stellar: cuentas, keypairs, Lumens, trustlines y activos.",
  },
  "soroban-smart-contracts": {
    title: "Contratos inteligentes Soroban",
    description:
      "Escribe, prueba y despliega contratos inteligentes Soroban en Rust sobre la testnet actual de Stellar.",
  },
  "stellar-protocol-27": {
    title: "Stellar Protocol 27: El Zipper",
    description:
      "Domina la actualización del Protocol 27: delegación de autenticación, firmas vinculadas a la dirección y la ruta de migración de cada SDK.",
  },
};

export const lessonTitles: Record<string, string> = {
  "rust-fundamentals-1": "Hello, World!",
  "rust-fundamentals-2": "Variables y mutabilidad",
  "rust-fundamentals-3": "Tipos de datos",
  "rust-fundamentals-4": "Funciones",
  "rust-fundamentals-5": "Fundamentos de ownership",
  "rust-fundamentals-6": "Borrowing y referencias",
  "control-flow-1": "if / else",
  "control-flow-2": "Expresiones match",
  "control-flow-3": "loop",
  "control-flow-4": "Bucles while",
  "control-flow-5": "Bucles for",
  "control-flow-6": "Control de flujo anidado",
  "rust-standard-library-1": "Fundamentos de Vec",
  "rust-standard-library-2": "Iteradores",
  "rust-standard-library-3": "Option y map",
  "rust-standard-library-4": "HashMap",
  "rust-standard-library-5": "Manejo de String",
  "rust-standard-library-6": "Slices",
  "mastering-option-1": "Some o None",
  "mastering-option-2": "Unwrap con seguridad",
  "mastering-option-3": "if let",
  "mastering-result-1": "Ok o Err",
  "mastering-result-2": "La lectura del veredicto",
  "mastering-result-3": "El operador ?",
  "stellar-101-1": "Cuentas y keypairs",
  "stellar-101-2": "Lumens y comisiones",
  "stellar-101-3": "Trustlines y activos",
  "stellar-101-4": "Tu primer pago",
  "soroban-smart-contracts-1": "Tu primer contrato",
  "soroban-smart-contracts-2": "Almacenamiento del contrato",
  "soroban-smart-contracts-3": "Autorización",
  "stellar-protocol-27-1": "Protocol 27: El Zipper",
  "stellar-protocol-27-2": "Smart accounts y __check_auth",
  "stellar-protocol-27-3": "Delegación de autenticación (CAP-0071)",
  "stellar-protocol-27-4": "Seguridad de firmas y credenciales V2",
  "stellar-protocol-27-5": "Migrando al Protocol 27",
  "stellar-protocol-27-6": "Jefe: La cuenta delegada",
};
