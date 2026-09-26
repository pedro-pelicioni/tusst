import type { ActText, CardText, SkirmishText } from "../types";

// Localized campaign narrative. Card NAMES and act numerals stay as-is.
export const actText: Record<string, ActText> = {
  "rust-fundamentals": {
    title: "Les fondamentaux de Rust",
    territory: "syntaxe, types, ownership",
    synopsis:
      "Le rez-de-chaussée du langage : affichage, bindings et mutabilité, types, fonctions, et les règles d'ownership et d'emprunt dont tout le reste dépend.",
  },
  "control-flow": {
    title: "Flux de contrôle",
    territory: "branches, match, boucles",
    overlord: null,
    synopsis:
      "Branchements et répétition en Rust, y compris le `match` exhaustif — le mécanisme qui rend sûre la gestion d'`Option` et de `Result` plus tard.",
  },
  "rust-standard-library": {
    title: "La bibliothèque standard",
    territory: "collections, itérateurs, structs",
    overlord: null,
    synopsis:
      "Les types dont tu te serviras tous les jours : `Vec`, `HashMap`, strings et slices, itérateurs, et donner un comportement à tes propres types avec `impl`.",
  },
  "mastering-option": {
    title: "Option<T>",
    territory: "l'absence, modélisée comme un type",
    synopsis:
      "Rust n'a pas de null. `Option<T>` fait de « il n'y a peut-être rien ici » un cas que le compilateur t'oblige à traiter.",
  },
  "mastering-result": {
    title: "Result<T, E>",
    territory: "l'échec, modélisé comme une valeur",
    synopsis:
      "Les erreurs sont des valeurs, pas des exceptions. Fais-leur un match, convertis-les et propage-les avec `?` au lieu de dérouler une pile.",
  },
  "stellar-101": {
    title: "Stellar 101",
    territory: "comptes, lumens, trustlines, paiements",
    synopsis:
      "Comment le réseau fonctionne vraiment : ce qu'est un compte, ce que paie un lumen, pourquoi détenir un actif est opt-in, et comment un paiement est construit puis soumis.",
  },
  "soroban-smart-contracts": {
    title: "Smart contracts Soroban",
    territory: "contrats, stockage, autorisation",
    overlord: null,
    synopsis:
      "Écrire un contrat Soroban en Rust, y stocker de l'état et le sécuriser — les trois choses dont tout vrai contrat a besoin.",
  },
  "stellar-protocol-27": {
    title: "Protocol 27",
    territory: "smart accounts & délégation d'auth",
    overlord: null,
    synopsis:
      "La mise à niveau actuelle : des smart accounts qui définissent leur propre politique d'auth, la délégation via CAP-0071, les signatures liées à l'adresse, et le chemin de migration.",
  },
};

export const skirmishText: Record<string, SkirmishText> = {
  // Rust Fundamentals
  "rust-fundamentals-1": {
    title: "Hello, World!",
    intro:
      "Tout programme Rust commence à `main`. Tu vas afficher une ligne exacte et découvrir la macro `println!` — l'outil qui te servira à inspecter tout ce qui suit.",
  },
  "rust-fundamentals-2": {
    title: "Variables & mutabilité",
    intro:
      "Les bindings sont immuables par défaut. Tu vas voir l'erreur de compilation que ça provoque, et la corriger avec `mut` — le premier de nombreux endroits où Rust te fait déclarer ton intention.",
  },
  "rust-fundamentals-3": {
    title: "Types de données",
    intro:
      "Entiers, flottants, booléens et caractères — et quand le compilateur a besoin que tu annotes un type qu'il ne peut pas inférer seul.",
  },
  "rust-fundamentals-4": {
    title: "Fonctions",
    intro:
      "Paramètres, types de retour, et le retour implicite de Rust : la dernière expression sans point-virgule est la valeur. Cette seule règle explique beaucoup de syntaxe par la suite.",
  },
  "rust-fundamentals-5": {
    title: "Les bases de l'ownership",
    intro:
      "Chaque valeur a exactement un propriétaire. Assigner une `String` la déplace, et l'ancien binding est mort — l'idée sur laquelle repose tout le reste de Rust.",
  },
  "rust-fundamentals-6": {
    title: "Emprunt & références",
    intro:
      "Pas besoin de céder une valeur pour qu'une fonction la lise. Prête une référence avec `&` et elle te revient — l'alternative de tous les jours au clonage.",
  },

  // Control Flow
  "control-flow-1": {
    title: "if / else",
    intro:
      "En Rust, un branchement est une expression, pas seulement une instruction — un `if` peut donc produire une valeur que tu lies directement.",
  },
  "control-flow-2": {
    title: "Expressions match",
    intro:
      "`match` doit être exhaustif : le compilateur rejette tout cas oublié. C'est le mécanisme derrière la gestion sûre d'`Option` et de `Result` plus tard.",
  },
  "control-flow-3": {
    title: "loop",
    intro:
      "Une boucle inconditionnelle, et `break` avec une valeur — la façon idiomatique de réessayer jusqu'à ce que ça marche.",
  },
  "control-flow-4": {
    title: "Boucles while",
    intro:
      "Boucler tant qu'une condition tient. Tu verras aussi pourquoi `while let` existe et où il bat un simple `while`.",
  },
  "control-flow-5": {
    title: "Boucles for",
    intro:
      "Parcourir une plage ou une collection — la boucle que tu écriras vraiment, et le premier endroit où apparaissent les itérateurs.",
  },
  "control-flow-6": {
    title: "Flux de contrôle imbriqué",
    intro:
      "Combiner branches et boucles, et garder le résultat lisible quand la logique cesse d'être triviale.",
  },

  // The Standard Library
  "rust-standard-library-1": {
    title: "Les bases de Vec",
    intro:
      "Un tableau extensible : push, indexation, et pourquoi `Vec` est la collection par défaut de presque tout programme Rust.",
  },
  "rust-standard-library-2": {
    title: "Itérateurs",
    intro:
      "`map`, `filter` et `collect` — et le fait que rien ne s'exécute tant qu'un consommateur ne demande pas d'éléments.",
  },
  "rust-standard-library-3": {
    title: "Option & map",
    intro:
      "Transformer une valeur qui n'existe peut-être pas, sans faire d'unwrap avant.",
  },
  "rust-standard-library-4": {
    title: "HashMap",
    intro:
      "Recherche clé/valeur, et l'API `entry` qui lit ou insère en un seul hachage.",
  },
  "rust-standard-library-5": {
    title: "Manipulation de String",
    intro:
      "`String` contre `&str`, pourquoi tu ne peux pas indexer une chaîne par un nombre, et ce que UTF-8 vient faire là-dedans.",
  },
  "rust-standard-library-6": {
    title: "Slices",
    intro:
      "Une vue empruntée sur une partie d'une collection — pas de copie, pas d'allocation.",
  },
  "rust-standard-library-7": {
    title: "Structs",
    intro:
      "Regrouper des données liées sous un seul nom, avec le type de chaque champ déclaré.",
  },
  "rust-standard-library-8": {
    title: "impl et méthodes",
    intro:
      "Attacher un comportement à un type, et la différence entre `self`, `&self` et `&mut self`.",
  },

  // Option<T>
  "mastering-option-1": {
    title: "Some ou None",
    intro:
      "`Option<T>` fait de l'absence un cas que le compilateur t'oblige à traiter — c'est pour ça que Rust n'a pas de null.",
  },
  "mastering-option-2": {
    title: "Unwrap sans danger",
    intro:
      "`unwrap_or`, `unwrap_or_else` et `expect`, et la règle qui dit quand `unwrap()` est acceptable en production.",
  },
  "mastering-option-3": {
    title: "if let",
    intro:
      "Matcher un seul cas et ignorer le reste, quand un `match` complet ne serait que du bruit.",
  },

  // Result<T, E>
  "mastering-result-1": {
    title: "Ok ou Err",
    intro:
      "`Result<T, E>` porte soit la valeur, soit la raison de l'échec — et `#[must_use]` t'empêche de l'ignorer en silence.",
  },
  "mastering-result-2": {
    title: "Match sur Result",
    intro:
      "Traiter les deux branches explicitement, et décider à chaque appel si un échec est récupérable.",
  },
  "mastering-result-3": {
    title: "L'opérateur ?",
    intro:
      "Propager un échec à l'appelant en un caractère, au lieu d'un `match` à chaque niveau.",
  },

  // Stellar 101
  "stellar-101-1": {
    title: "Comptes & paires de clés",
    intro:
      "Un compte Stellar, c'est une clé publique. La clé secrète signe ; la clé publique identifie. Tout le reste repose là-dessus.",
  },
  "stellar-101-2": {
    title: "Lumens & frais",
    intro:
      "XLM, stroops, la réserve de base, et pourquoi chaque compte doit garder un solde minimum.",
  },
  "stellar-101-3": {
    title: "Trustlines & actifs",
    intro:
      "Détenir un actif non natif est opt-in : tu ouvres d'abord une trustline, et c'est un choix délibéré du protocole.",
  },
  "stellar-101-4": {
    title: "Ton premier paiement",
    intro:
      "Construire, signer et soumettre un paiement — la forme que partagent toutes les opérations Stellar.",
  },

  // Soroban Smart Contracts
  "soroban-smart-contracts-1": {
    title: "Ton premier contrat",
    intro:
      "`#[contract]`, `#[contractimpl]` et une fonction exportée — le minimum dont un contrat Soroban a besoin pour exister.",
  },
  "soroban-smart-contracts-2": {
    title: "Le stockage du contrat",
    intro:
      "Stockage instance, persistent et temporary : trois étagères avec des durées de vie et des coûts différents.",
  },
  "soroban-smart-contracts-3": {
    title: "Autorisation",
    intro:
      "`require_auth` fait la différence entre un contrat que n'importe qui peut vider et un contrat que seul son propriétaire peut déplacer.",
  },

  // Protocol 27
  "stellar-protocol-27-1": {
    title: "Vue d'ensemble du Protocol 27",
    intro:
      "Ce que change la mise à niveau, et pourquoi la délégation d'authentification compte pour quiconque construit des wallets.",
  },
  "stellar-protocol-27-2": {
    title: "Smart accounts & __check_auth",
    intro:
      "Un compte-contrat décide lui-même de ce qui compte comme une signature valide — cette fonction, c'est toute la politique.",
  },
  "stellar-protocol-27-3": {
    title: "Délégation d'authentification (CAP-0071)",
    intro:
      "Permettre à un compte de déléguer sa vérification d'auth à un autre, et ce que ça débloque pour la récupération et les clés de session.",
  },
  "stellar-protocol-27-4": {
    title: "Sécurité des signatures & credentials V2",
    intro:
      "Les signatures liées à l'adresse, et l'attaque par rejeu que le format de credential V2 ferme.",
  },
  "stellar-protocol-27-5": {
    title: "Migrer vers le Protocol 27",
    intro:
      "Ce qui casse, ce qui ne casse pas, et dans quel ordre changer les choses à travers les SDK.",
  },
  "stellar-protocol-27-6": {
    title: "Tout assembler : un compte délégué",
    intro:
      "Implémente `__check_auth` de bout en bout : vérifie la signature, respecte le délégué et rejette le rejeu.",
  },
};

export const cardText: Record<string, CardText> = {
  stroowarrior: {
    type: "Guerrier",
    flavor:
      "A perdu son premier combat contre le borrow checker. A lu l'erreur. A gagné la revanche.",
  },
  stropillusion: {
    epithet: "Explorateur de la Galerie des Glaces",
    type: "Stropie · Illusionniste",
    flavor:
      "Chaque miroir est une branche différente, et match ne le laisse en sauter aucune.",
  },
  stroopkeeper: {
    epithet: "Gardien des Coffres Sans Fin",
    type: "Stropie · Archiviste",
    flavor:
      "Chaque outil jamais forgé dort dans ses coffres — indexé à partir de zéro, comme les anciens dieux l'ont voulu.",
  },
  stroophantom: {
    epithet: "Le Chevalier Qui N'Est Peut-Être Pas",
    type: "Stropie · Spectre",
    flavor:
      "Demande-lui s'il est là. Ne suppose jamais. Le marais est plein de ceux qui ont unwrappé.",
  },
  strooracle: {
    epithet: "Arbitre des Deux Destins",
    type: "Stropie · Oracle",
    flavor:
      "Deux portes, un seul verdict. Elle n'a jamais ignoré un Result, et elle ne commencera pas avec le tien.",
  },
  astrostroopie: {
    epithet: "Voyageur de la Porte de la Constellation",
    type: "Stropie · Voyageur",
    flavor:
      "Il a franchi la Porte avec sa réserve payée et sa clé secrète gardée pour lui.",
  },
  stroopbeholder: {
    type: "Stropie · Aberration",
    flavor:
      "Ses innombrables yeux ne cherchent qu'une chose : un require_auth oublié.",
  },
  stroopzipper: {
    epithet: "Héraut du Ciel Réécrit",
    type: "Stropie · Héraut",
    flavor:
      "Pas de fork : le réseau vote, puis bascule tout entier en un seul ledger.",
  },
};
