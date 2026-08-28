import { CURATED_CARGO_TOML } from "@/content/soroban-templates";
import type { SorobanFileMap } from "@/lib/soroban/types";

// The OZ Token Wizard's code generator. Deliberately NOT free-form codegen:
// it assembles verified fragments of the IDE's proven `oz-fungible` template
// (same OpenZeppelin stellar-tokens crates, same patterns), varying only by
// the chosen extensions — so every one of the four variants is a known-good
// build. Cargo.toml is the imported CURATED_CARGO_TOML, which keeps the
// runner's offline pin triangle intact by construction.
//
// Name/symbol/supply are NOT baked into the code: the contract takes them as
// constructor arguments at deploy time (decimals fixed at 7, the Stellar
// convention).

export interface OzTokenOptions {
  pausable: boolean;
  burnable: boolean;
}

export function generateOzTokenFiles(opts: OzTokenOptions): SorobanFileMap {
  const { pausable, burnable } = opts;

  const attr = pausable ? "    #[when_not_paused]\n" : "";

  const imports = [
    `use soroban_sdk::{`,
    pausable
      ? `    contract, contracterror, contractimpl, panic_with_error, symbol_short, Address, Env,`
      : `    contract, contractimpl, symbol_short, Address, Env,`,
    `    MuxedAddress, String, Symbol,`,
    `};`,
    ...(pausable
      ? [
          `use stellar_contract_utils::pausable::{self as pausable, Pausable};`,
          `use stellar_macros::when_not_paused;`,
        ]
      : []),
    burnable
      ? `use stellar_tokens::fungible::{burnable::FungibleBurnable, Base, FungibleToken};`
      : `use stellar_tokens::fungible::{Base, FungibleToken};`,
  ].join("\n");

  const errorBlock = pausable
    ? `
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ForgeTokenError {
    Unauthorized = 1,
}

fn require_owner(e: &Env, caller: &Address) {
    caller.require_auth();
    let owner: Address = e.storage().instance().get(&OWNER).expect("owner should be set");
    if owner != *caller {
        panic_with_error!(e, ForgeTokenError::Unauthorized);
    }
}
`
    : "";

  const pausableBlock = pausable
    ? `
#[contractimpl]
impl Pausable for ForgeToken {
    fn paused(e: &Env) -> bool {
        pausable::paused(e)
    }

    fn pause(e: &Env, caller: Address) {
        require_owner(e, &caller);
        pausable::pause(e);
    }

    fn unpause(e: &Env, caller: Address) {
        require_owner(e, &caller);
        pausable::unpause(e);
    }
}
`
    : "";

  const burnableBlock = burnable
    ? `
#[contractimpl]
impl FungibleBurnable for ForgeToken {
${attr}    fn burn(e: &Env, from: Address, amount: i128) {
        Self::ContractType::burn(e, &from, amount)
    }

${attr}    fn burn_from(e: &Env, spender: Address, from: Address, amount: i128) {
        Self::ContractType::burn_from(e, &spender, &from, amount)
    }
}
`
    : "";

  const lib = `//! Fungible token (SEP-41) forged by the TUSST OZ Token Wizard.
//! Built on OpenZeppelin's stellar-tokens${pausable ? " with the pausable extension" : ""}${
    burnable ? (pausable ? " and burnable" : " with burnable") : ""
  }.
#![no_std]
${imports}

pub const OWNER: Symbol = symbol_short!("OWNER");

#[contract]
pub struct ForgeToken;
${errorBlock}
#[contractimpl]
impl ForgeToken {
    pub fn __constructor(
        e: &Env,
        name: String,
        symbol: String,
        owner: Address,
        initial_supply: i128,
    ) {
        Base::set_metadata(e, 7, name, symbol);
        Base::mint(e, &owner, initial_supply);
        e.storage().instance().set(&OWNER, &owner);
    }

${attr}    pub fn mint(e: &Env, to: Address, amount: i128) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("owner should be set");
        owner.require_auth();
        Base::mint(e, &to, amount);
    }
}
${pausableBlock}
#[contractimpl]
impl FungibleToken for ForgeToken {
    type ContractType = Base;

    fn total_supply(e: &Env) -> i128 {
        Self::ContractType::total_supply(e)
    }

    fn balance(e: &Env, account: Address) -> i128 {
        Self::ContractType::balance(e, &account)
    }

    fn allowance(e: &Env, owner: Address, spender: Address) -> i128 {
        Self::ContractType::allowance(e, &owner, &spender)
    }

${attr}    fn transfer(e: &Env, from: Address, to: MuxedAddress, amount: i128) {
        Self::ContractType::transfer(e, &from, &to, amount);
    }

${attr}    fn transfer_from(e: &Env, spender: Address, from: Address, to: Address, amount: i128) {
        Self::ContractType::transfer_from(e, &spender, &from, &to, amount);
    }

    fn approve(e: &Env, owner: Address, spender: Address, amount: i128, live_until_ledger: u32) {
        Self::ContractType::approve(e, &owner, &spender, amount, live_until_ledger);
    }

    fn decimals(e: &Env) -> u32 {
        Self::ContractType::decimals(e)
    }

    fn name(e: &Env) -> String {
        Self::ContractType::name(e)
    }

    fn symbol(e: &Env) -> String {
        Self::ContractType::symbol(e)
    }
}
${burnableBlock}`;

  return {
    "Cargo.toml": CURATED_CARGO_TOML,
    "src/lib.rs": lib,
  };
}
