---
trigger: always_on
---

# 🚀 DeFi Unite Project Rules

## 🦀 Smart Contract Functionality Consistency

### Core Rule: Triple Implementation Pattern
**Every smart contract function MUST follow the 3-step pattern:**

1. **Contract Function** - Implement using `#[contract]` and `#[contractimpl]`
2. **Unit Test** - Write comprehensive test coverage using Soroban SDK test environment
3. **Visual Test Component** - Create React component for UI testing

### 🧪 Soroban Testing Requirements (Based on Official SDK Paradigms)
- **1:1 mapping**: Every function ↔ test
- **Test structure follows Soroban SDK patterns**:
  1. Create environment: `let env = Env::default();`
  2. Register contract: `let contract_id = env.register(Contract, ());`
  3. Create client: `let client = ContractClient::new(&env, &contract_id);`
  4. Assert outcomes: `assert_eq!(client.function(), expected);`
- **Test file location**: `src/test.rs` or separate `tests/` directory
- **Required test types**:
  - **Unit Tests** - Test individual contract functions
  - **Integration Tests** - Test cross-contract interactions
  - **Authorization Tests** - Test auth requirements using `test.set_auths()`
  - **Event Tests** - Test event emission using `env.events()`
  - **Error Tests** - Test error conditions and custom errors
  - **Mocking Tests** - Mock dependency contracts when needed
  - **Fuzzing Tests** - Property-based testing for edge cases

### ⚛️ React Visual Testing Components
- **File naming**: `[ContractName][FunctionName]Test.tsx`
- **Location**: `src/components/testing/`
- **Use shadcn/ui components only**
- **Required shadcn/ui components**:
  ```bash
  npx shadcn@latest add card input label alert button form
  ```
- **Component structure**:
  - Import contract client types
  - Handle contract invocation
  - Display results and errors
  - Show transaction status

### 🎨 Styling Rules
- **Use shadcn/ui components first**
- **No custom Tailwind unless absolutely necessary**
- **No custom CSS**

### 🚀 Astro Integration
```astro
---
import TestComponent from '@/components/testing/TestComponent';
---
<TestComponent client:load />
```

### 📋 Development Workflow (Soroban SDK Aligned)
**Before committing:**
1. `cargo test` - Run all Soroban unit tests
2. `cargo test --features testutils` - Run tests with test utilities
3. `npm run type-check` - TypeScript validation
4. `npm run build` - Astro build verification
5. Test React components at `/testing/contracts`
6. **Optional advanced testing**:
   - `cargo fuzz` - Fuzzing tests
   - Code coverage analysis
   - Integration tests with mainnet fork

### ✅ Code Review Checklist
- [ ] Contract function implemented
- [ ] Contract function has unit test
- [ ] Contract function has React visual test component
- [ ] shadcn/ui used correctly
- [ ] TypeScript interfaces present

### ❌ Automatic Rejection Criteria
- Missing Soroban tests
- Missing React test components
- Custom Tailwind instead of shadcn/ui
- Missing TypeScript interfaces

---

**Quality > Speed. Test everything.**

## 📁 Project Structure Example

```
contracts/
├── my_contract/
│   ├── src/
│   │   └── lib.rs          # Contract functions
│   └── tests/
│       └── test.rs         # Unit tests
│
src/
├── components/
│   └── testing/
│       └── MyContractFunctionTest.tsx  # Visual test components
└── pages/
    └── testing/
        └── contracts.astro  # Test page
```

## 🔄 Implementation Flow (Official Soroban SDK Pattern)

1. **Write Contract Function**
   ```rust
   use soroban_sdk::{contract, contractimpl, Env, Symbol};
   
   #[contract]
   pub struct MyContract;
   
   #[contractimpl]
   impl MyContract {
       pub fn my_function(env: Env, param: u32) -> u32 {
           // Implementation following Soroban patterns
           param + 1
       }
   }
   ```

2. **Write Unit Test (Following SDK 4-Step Pattern)**
   ```rust
   #[cfg(test)]
   mod test {
       use super::*;
       use soroban_sdk::Env;
   
       #[test]
       fn test_my_function() {
           // 1. Create environment
           let env = Env::default();
           
           // 2. Register contract
           let contract_id = env.register(MyContract, ());
           
           // 3. Create client
           let client = MyContractClient::new(&env, &contract_id);
           
           // 4. Assert outcomes
           assert_eq!(client.my_function(&5), 6);
       }
   }
   ```

3. **Create Visual Test Component**
   ```tsx
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   
   export function MyContractMyFunctionTest() {
       // React component with shadcn/ui for contract interaction
   }
   ```

4. **Run Workflow**
   - `cargo test` - Soroban unit tests
   - `cargo test --features testutils` - Extended test utilities
   - `npm run type-check` - TypeScript validation
   - `npm run build` - Build verification
   - Test visually at `/testing/contracts`

This ensures **consistent, testable, and maintainable** smart contract development following **official Soroban SDK paradigms**.
