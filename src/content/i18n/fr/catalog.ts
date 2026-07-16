import type { TrackText } from "../types";

// Localized track/lesson catalog titles (override DB values at render time).
export const trackText: Record<string, TrackText> = {
  "rust-fundamentals": {
    title: "Les Fondamentaux de Rust",
    description:
      "Maîtrise les bases du langage de programmation Rust, de la syntaxe aux concepts d'ownership.",
  },
  "control-flow": {
    title: "Flux de Contrôle",
    description:
      "Apprends à contrôler le flux de ton programme Rust avec des boucles et des instructions conditionnelles.",
  },
  "rust-standard-library": {
    title: "La Bibliothèque Standard de Rust",
    description:
      "Explore la bibliothèque standard de Rust et apprends à utiliser ses puissantes fonctionnalités.",
  },
  "mastering-option": {
    title: "Maîtriser Option<T>",
    description:
      "Apprends à utiliser le type Option<T> pour gérer les valeurs optionnelles en Rust.",
  },
  "mastering-result": {
    title: "Maîtriser Result<T, E>",
    description:
      "Apprends à utiliser le type Result<T, E> pour gérer les erreurs en Rust.",
  },
  "stellar-101": {
    title: "Stellar 101",
    description:
      "Fais tes premiers pas sur le réseau Stellar : comptes, paires de clés, Lumens, trustlines et actifs.",
  },
  "soroban-smart-contracts": {
    title: "Smart Contracts Soroban",
    description:
      "Écris, teste et déploie des smart contracts Soroban en Rust sur le testnet Stellar actuel.",
  },
  "stellar-protocol-27": {
    title: "Stellar Protocol 27 : Le Zipper",
    description:
      "Maîtrise la mise à niveau Protocol 27 : délégation d'authentification, signatures liées à l'adresse et chemin de migration de chaque SDK.",
  },
};

export const lessonTitles: Record<string, string> = {
  // Rust Fundamentals
  "rust-fundamentals-1": "Hello, World!",
  "rust-fundamentals-2": "Variables & Mutabilité",
  "rust-fundamentals-3": "Types de Données",
  "rust-fundamentals-4": "Fonctions",
  "rust-fundamentals-5": "Les Bases de l'Ownership",
  "rust-fundamentals-6": "Emprunt & Références",

  // Control Flow
  "control-flow-1": "if / else",
  "control-flow-2": "Expressions match",
  "control-flow-3": "loop",
  "control-flow-4": "Boucles while",
  "control-flow-5": "Boucles for",
  "control-flow-6": "Flux de Contrôle Imbriqué",

  // Rust Standard Library
  "rust-standard-library-1": "Les Bases de Vec",
  "rust-standard-library-2": "Itérateurs",
  "rust-standard-library-3": "Option & map",
  "rust-standard-library-4": "HashMap",
  "rust-standard-library-5": "Manipulation de String",
  "rust-standard-library-6": "Slices",

  // Mastering Option<T>
  "mastering-option-1": "Some ou None",
  "mastering-option-2": "Unwrap sans Danger",
  "mastering-option-3": "if let",

  // Mastering Result<T, E>
  "mastering-result-1": "Ok ou Err",
  "mastering-result-2": "Lire le Verdict",
  "mastering-result-3": "L'Opérateur ?",

  // Stellar 101
  "stellar-101-1": "Comptes & Paires de Clés",
  "stellar-101-2": "Lumens & Frais",
  "stellar-101-3": "Trustlines & Actifs",
  "stellar-101-4": "Ton Premier Paiement",

  // Soroban Smart Contracts
  "soroban-smart-contracts-1": "Ton Premier Contrat",
  "soroban-smart-contracts-2": "Le Stockage du Contrat",
  "soroban-smart-contracts-3": "Autorisation",

  // Stellar Protocol 27
  "stellar-protocol-27-1": "Protocol 27 : Le Zipper",
  "stellar-protocol-27-2": "Smart Accounts & __check_auth",
  "stellar-protocol-27-3": "Délégation d'Authentification (CAP-0071)",
  "stellar-protocol-27-4": "Sécurité des Signatures & Credentials V2",
  "stellar-protocol-27-5": "Migrer vers le Protocol 27",
  "stellar-protocol-27-6": "Boss : Le Compte Délégué",
};
