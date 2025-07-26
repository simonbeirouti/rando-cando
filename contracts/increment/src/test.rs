#![cfg(test)]
use crate::{IncrementContract, IncrementContractClient};
use soroban_sdk::Env;

#[test]
fn test_increment_basic_functionality() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.increment(), 3);
}

#[test]
fn test_get_current_value_initial_state() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    // Initial value should be 0
    assert_eq!(client.get_current_value(), 0);
}

#[test]
fn test_get_current_value_after_increments() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    // Increment a few times
    client.increment();
    client.increment();
    assert_eq!(client.get_current_value(), 2);
    
    // Value should remain the same after multiple reads
    assert_eq!(client.get_current_value(), 2);
    assert_eq!(client.get_current_value(), 2);
}

#[test]
fn test_decrement_basic_functionality() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    // Increment to 3, then decrement
    client.increment();
    client.increment();
    client.increment();
    assert_eq!(client.get_current_value(), 3);
    
    assert_eq!(client.decrement(), 2);
    assert_eq!(client.decrement(), 1);
    assert_eq!(client.decrement(), 0);
}

#[test]
fn test_decrement_at_zero_boundary() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    // Decrement when counter is 0 should remain 0
    assert_eq!(client.decrement(), 0);
    assert_eq!(client.decrement(), 0);
    assert_eq!(client.get_current_value(), 0);
}

#[test]
fn test_reset_functionality() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    // Increment to some value
    client.increment();
    client.increment();
    client.increment();
    assert_eq!(client.get_current_value(), 3);
    
    // Reset should return 0 and set counter to 0
    assert_eq!(client.reset(), 0);
    assert_eq!(client.get_current_value(), 0);
}

#[test]
fn test_reset_when_already_zero() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    // Reset when already 0
    assert_eq!(client.reset(), 0);
    assert_eq!(client.get_current_value(), 0);
}

#[test]
fn test_mixed_operations_integration() {
    let env = Env::default();
    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    // Test a sequence of mixed operations
    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.get_current_value(), 2);
    
    assert_eq!(client.decrement(), 1);
    assert_eq!(client.get_current_value(), 1);
    
    assert_eq!(client.increment(), 2);
    assert_eq!(client.increment(), 3);
    
    assert_eq!(client.reset(), 0);
    assert_eq!(client.get_current_value(), 0);
    
    assert_eq!(client.increment(), 1);
}