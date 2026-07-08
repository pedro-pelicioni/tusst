import type { SorobanFileMap } from "@/lib/soroban/types";

// Project templates for the Forge IDE.
//
// Every template ships the same curated Cargo.toml — the exact manifest the
// sandbox image pre-compiled (runner-soroban/warm/Cargo.toml). Keeping the
// pins identical is what makes builds instant and offline. The OZ templates
// follow the integration patterns from OpenZeppelin's own stellar-contracts
// examples (MIT), which is the intended way to consume that library.

export interface ForgeTemplate {
  id: string;
  name: string;
  description: string;
  files: SorobanFileMap;
}

const CURATED_CARGO_TOML = `[package]
name = "contract"
version = "0.1.0"
edition = "2021"
publish = false

[lib]
crate-type = ["cdylib"]
doctest = false

[dependencies]
soroban-sdk = "=26.1.0"
# OpenZeppelin Stellar suite — matches the Contract Wizard output
stellar-access = "=0.7.2"
stellar-accounts = "=0.7.2"
stellar-contract-utils = "=0.7.2"
stellar-fee-abstraction = "=0.7.2"
stellar-governance = "=0.7.2"
stellar-macros = "=0.7.2"
stellar-tokens = "=0.7.2"
# Common ecosystem crates
sep-41-token = "=1.4.0"
soroban-fixed-point-math = "=1.5.0"

[dev-dependencies]
soroban-sdk = { version = "=26.1.0", features = ["testutils"] }

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false

[profile.dev]
debug = false
`;

const HELLO_LIB = `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, String, Symbol, Vec};

const COUNT: Symbol = symbol_short!("COUNT");

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    /// Returns a greeting for \`to\`.
    pub fn greet(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }

    /// Increments a persistent counter and returns the new value.
    pub fn bump(env: Env) -> u32 {
        let count: u32 = env.storage().instance().get(&COUNT).unwrap_or(0) + 1;
        env.storage().instance().set(&COUNT, &count);
        count
    }
}

#[cfg(test)]
mod test;
`;

const HELLO_TEST = `#![cfg(test)]
use crate::{HelloContract, HelloContractClient};
use soroban_sdk::{vec, Env, String};

#[test]
fn greet_says_hello() {
    let env = Env::default();
    let id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &id);
    let words = client.greet(&String::from_str(&env, "Stellar"));
    assert_eq!(
        words,
        vec![
            &env,
            String::from_str(&env, "Hello"),
            String::from_str(&env, "Stellar"),
        ]
    );
}

#[test]
fn bump_increments() {
    let env = Env::default();
    let id = env.register(HelloContract, ());
    let client = HelloContractClient::new(&env, &id);
    assert_eq!(client.bump(), 1);
    assert_eq!(client.bump(), 2);
}
`;

const FUNGIBLE_LIB = `//! Pausable fungible token (SEP-41) built on OpenZeppelin's stellar-tokens.
//!
//! The owner can mint and pause; SEP-41 compliance comes from implementing
//! both FungibleToken and FungibleBurnable.
#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, panic_with_error, symbol_short, Address, Env,
    MuxedAddress, String, Symbol,
};
use stellar_contract_utils::pausable::{self as pausable, Pausable};
use stellar_macros::when_not_paused;
use stellar_tokens::fungible::{burnable::FungibleBurnable, Base, FungibleToken};

pub const OWNER: Symbol = symbol_short!("OWNER");

#[contract]
pub struct ForgeToken;

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

#[contractimpl]
impl ForgeToken {
    pub fn __constructor(
        e: &Env,
        name: String,
        symbol: String,
        owner: Address,
        initial_supply: i128,
    ) {
        Base::set_metadata(e, 18, name, symbol);
        Base::mint(e, &owner, initial_supply);
        e.storage().instance().set(&OWNER, &owner);
    }

    #[when_not_paused]
    pub fn mint(e: &Env, to: Address, amount: i128) {
        let owner: Address = e.storage().instance().get(&OWNER).expect("owner should be set");
        owner.require_auth();
        Base::mint(e, &to, amount);
    }
}

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

    #[when_not_paused]
    fn transfer(e: &Env, from: Address, to: MuxedAddress, amount: i128) {
        Self::ContractType::transfer(e, &from, &to, amount);
    }

    #[when_not_paused]
    fn transfer_from(e: &Env, spender: Address, from: Address, to: Address, amount: i128) {
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

#[contractimpl]
impl FungibleBurnable for ForgeToken {
    #[when_not_paused]
    fn burn(e: &Env, from: Address, amount: i128) {
        Self::ContractType::burn(e, &from, amount)
    }

    #[when_not_paused]
    fn burn_from(e: &Env, spender: Address, from: Address, amount: i128) {
        Self::ContractType::burn_from(e, &spender, &from, amount)
    }
}

#[cfg(test)]
mod test;
`;

const FUNGIBLE_TEST = `#![cfg(test)]
extern crate std;

use crate::{ForgeToken, ForgeTokenClient};
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn create_client<'a>(e: &Env, owner: &Address, initial_supply: i128) -> ForgeTokenClient<'a> {
    let name = String::from_str(e, "Forge Token");
    let symbol = String::from_str(e, "FRG");
    let address = e.register(ForgeToken, (name, symbol, owner, initial_supply));
    ForgeTokenClient::new(e, &address)
}

#[test]
fn initial_state() {
    let e = Env::default();
    let owner = Address::generate(&e);
    let client = create_client(&e, &owner, 1000);

    assert_eq!(client.total_supply(), 1000);
    assert_eq!(client.balance(&owner), 1000);
    assert_eq!(client.symbol(), String::from_str(&e, "FRG"));
    assert_eq!(client.decimals(), 18);
    assert!(!client.paused());
}

#[test]
fn transfer_works() {
    let e = Env::default();
    let owner = Address::generate(&e);
    let recipient = Address::generate(&e);
    let client = create_client(&e, &owner, 1000);

    e.mock_all_auths();
    client.transfer(&owner, &recipient, &100);
    assert_eq!(client.balance(&owner), 900);
    assert_eq!(client.balance(&recipient), 100);
}

#[test]
#[should_panic(expected = "Error(Contract, #1000)")]
fn transfer_fails_when_paused() {
    let e = Env::default();
    let owner = Address::generate(&e);
    let recipient = Address::generate(&e);
    let client = create_client(&e, &owner, 1000);

    e.mock_all_auths();
    client.pause(&owner);
    client.transfer(&owner, &recipient, &100);
}

#[test]
fn owner_can_mint() {
    let e = Env::default();
    let owner = Address::generate(&e);
    let client = create_client(&e, &owner, 1000);

    e.mock_all_auths();
    client.mint(&owner, &500);
    assert_eq!(client.total_supply(), 1500);
    assert_eq!(client.balance(&owner), 1500);
}
`;

const NFT_LIB = `//! Sequential-minting NFT built on OpenZeppelin's stellar-tokens.
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};
use stellar_tokens::non_fungible::{burnable::NonFungibleBurnable, Base, NonFungibleToken};

#[contracttype]
pub enum DataKey {
    Owner,
}

#[contract]
pub struct ForgeCollectible;

#[contractimpl]
impl ForgeCollectible {
    pub fn __constructor(e: &Env, uri: String, name: String, symbol: String, owner: Address) {
        e.storage().instance().set(&DataKey::Owner, &owner);
        Base::set_metadata(e, uri, name, symbol);
    }

    /// Owner-gated mint; token ids are assigned sequentially.
    pub fn mint(e: &Env, to: Address) -> u32 {
        let owner: Address =
            e.storage().instance().get(&DataKey::Owner).expect("owner should be set");
        owner.require_auth();
        Base::sequential_mint(e, &to)
    }
}

#[contractimpl(contracttrait)]
impl NonFungibleToken for ForgeCollectible {
    type ContractType = Base;
}

#[contractimpl(contracttrait)]
impl NonFungibleBurnable for ForgeCollectible {}

#[cfg(test)]
mod test;
`;

const NFT_TEST = `#![cfg(test)]
extern crate std;

use crate::{ForgeCollectible, ForgeCollectibleClient};
use soroban_sdk::{testutils::Address as _, Address, Env, String};

fn create_client<'a>(e: &Env, owner: &Address) -> ForgeCollectibleClient<'a> {
    let uri = String::from_str(e, "ipfs://forge-collectible/");
    let name = String::from_str(e, "Forge Collectible");
    let symbol = String::from_str(e, "FRGC");
    let address = e.register(ForgeCollectible, (uri, name, symbol, owner));
    ForgeCollectibleClient::new(e, &address)
}

#[test]
fn mints_sequentially() {
    let e = Env::default();
    let owner = Address::generate(&e);
    let client = create_client(&e, &owner);

    e.mock_all_auths();
    let first = client.mint(&owner);
    let second = client.mint(&owner);
    assert_eq!(second, first + 1);
    assert_eq!(client.balance(&owner), 2);
    assert_eq!(client.owner_of(&first), owner);
}
`;

const BLANK_LIB = `#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct MyContract;

#[contractimpl]
impl MyContract {
    pub fn hello(_env: Env) -> u32 {
        42
    }
}

#[cfg(test)]
mod test;
`;

const BLANK_TEST = `#![cfg(test)]
use crate::{MyContract, MyContractClient};
use soroban_sdk::Env;

#[test]
fn hello_answers() {
    let env = Env::default();
    let id = env.register(MyContract, ());
    let client = MyContractClient::new(&env, &id);
    assert_eq!(client.hello(), 42);
}
`;

export const forgeTemplates: ForgeTemplate[] = [
  {
    id: "hello-world",
    name: "hello world",
    description: "Greeting + persistent counter. The smallest useful contract.",
    files: {
      "Cargo.toml": CURATED_CARGO_TOML,
      "src/lib.rs": HELLO_LIB,
      "src/test.rs": HELLO_TEST,
    },
  },
  {
    id: "oz-fungible",
    name: "OZ fungible token",
    description: "SEP-41 token with pause + owner mint (OpenZeppelin stellar-tokens).",
    files: {
      "Cargo.toml": CURATED_CARGO_TOML,
      "src/lib.rs": FUNGIBLE_LIB,
      "src/test.rs": FUNGIBLE_TEST,
    },
  },
  {
    id: "oz-nft",
    name: "OZ NFT",
    description: "Sequential-minting NFT collection (OpenZeppelin stellar-tokens).",
    files: {
      "Cargo.toml": CURATED_CARGO_TOML,
      "src/lib.rs": NFT_LIB,
      "src/test.rs": NFT_TEST,
    },
  },
  {
    id: "blank",
    name: "blank",
    description: "Bare skeleton with the curated dependency set.",
    files: {
      "Cargo.toml": CURATED_CARGO_TOML,
      "src/lib.rs": BLANK_LIB,
      "src/test.rs": BLANK_TEST,
    },
  },
];

export function templateById(id: string): ForgeTemplate {
  return forgeTemplates.find((t) => t.id === id) ?? forgeTemplates[0];
}
