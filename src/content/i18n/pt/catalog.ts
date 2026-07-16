import type { TrackText } from "../types";

// Localized track/lesson catalog titles (override DB values at render time).
export const trackText: Record<string, TrackText> = {
  "rust-fundamentals": {
    title: "Fundamentos de Rust",
    description:
      "Domine o básico da linguagem de programação Rust, da sintaxe aos conceitos de ownership.",
  },
  "control-flow": {
    title: "Controle de Fluxo",
    description:
      "Aprenda a controlar o fluxo do seu programa Rust usando loops e estruturas condicionais.",
  },
  "rust-standard-library": {
    title: "Biblioteca Padrão do Rust",
    description:
      "Explore a biblioteca padrão do Rust e aprenda a usar seus recursos poderosos.",
  },
  "mastering-option": {
    title: "Dominando Option<T>",
    description:
      "Aprenda a usar o tipo Option<T> para lidar com valores opcionais em Rust.",
  },
  "mastering-result": {
    title: "Dominando Result<T, E>",
    description:
      "Aprenda a usar o tipo Result<T, E> para lidar com erros em Rust.",
  },
  "stellar-101": {
    title: "Stellar 101",
    description:
      "Dê os primeiros passos na rede Stellar: contas, pares de chaves, Lumens, trustlines e ativos.",
  },
  "soroban-smart-contracts": {
    title: "Smart Contracts Soroban",
    description:
      "Escreva, teste e implante smart contracts Soroban em Rust na testnet atual da Stellar.",
  },
  "stellar-protocol-27": {
    title: "Stellar Protocol 27: O Zipper",
    description:
      "Domine o upgrade do Protocol 27: delegação de autenticação, assinaturas vinculadas ao endereço e o caminho de migração de cada SDK.",
  },
};

export const lessonTitles: Record<string, string> = {
  "rust-fundamentals-1": "Hello, World!",
  "rust-fundamentals-2": "Variáveis e Mutabilidade",
  "rust-fundamentals-3": "Tipos de Dados",
  "rust-fundamentals-4": "Funções",
  "rust-fundamentals-5": "Fundamentos de Ownership",
  "rust-fundamentals-6": "Borrowing e Referências",
  "control-flow-1": "if / else",
  "control-flow-2": "Expressões match",
  "control-flow-3": "loop",
  "control-flow-4": "Loops while",
  "control-flow-5": "Loops for",
  "control-flow-6": "Controle de Fluxo Aninhado",
  "rust-standard-library-1": "Fundamentos de Vec",
  "rust-standard-library-2": "Iteradores",
  "rust-standard-library-3": "Option e map",
  "rust-standard-library-4": "HashMap",
  "rust-standard-library-5": "Manipulação de String",
  "rust-standard-library-6": "Slices",
  "mastering-option-1": "Some ou None",
  "mastering-option-2": "Unwrap com Segurança",
  "mastering-option-3": "if let",
  "mastering-result-1": "Ok ou Err",
  "mastering-result-2": "Lendo o Veredito",
  "mastering-result-3": "O Operador ?",
  "stellar-101-1": "Contas e Pares de Chaves",
  "stellar-101-2": "Lumens e Taxas",
  "stellar-101-3": "Trustlines e Ativos",
  "stellar-101-4": "Seu Primeiro Pagamento",
  "soroban-smart-contracts-1": "Seu Primeiro Contrato",
  "soroban-smart-contracts-2": "Armazenamento do Contrato",
  "soroban-smart-contracts-3": "Autorização",
  "stellar-protocol-27-1": "Protocol 27: O Zipper",
  "stellar-protocol-27-2": "Smart Accounts e __check_auth",
  "stellar-protocol-27-3": "Delegação de Autenticação (CAP-0071)",
  "stellar-protocol-27-4": "Segurança de Assinatura e Credenciais V2",
  "stellar-protocol-27-5": "Migrando para o Protocol 27",
  "stellar-protocol-27-6": "Chefe: A Conta Delegada",
};
