#![cfg(test)]

use crate::{WarmupContract, WarmupContractClient};
use soroban_sdk::{Env, String};

#[test]
fn ping_answers_pong() {
    let env = Env::default();
    let id = env.register(WarmupContract, ());
    let client = WarmupContractClient::new(&env, &id);
    assert_eq!(client.ping(), String::from_str(&env, "pong"));
}
