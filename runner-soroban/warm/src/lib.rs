// Minimal contract used only to warm the dependency caches at image build.
// Every [dependencies] crate is compiled regardless of use, so this stays tiny.
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, String};

#[contract]
pub struct WarmupContract;

#[contractimpl]
impl WarmupContract {
    pub fn ping(env: Env) -> String {
        String::from_str(&env, "pong")
    }
}

#[cfg(test)]
mod test;
