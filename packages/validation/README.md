# @bullet-js/validation

A robust, fluent validation library for BulletJS. ensuring your data integrity with simple, expressive rules.

## Features

- **🛡️ Fluent API**: Chainable validation rules (`string`, `email`, `min`).
- **🧩 Schema Based**: Define clear schemas for your data.
- **⚡ Async Support**: Ready for async validation rules (e.g., database uniqueness checks).
- **🚫 Error Formatting**: Returns structured error messages for UI consumption.

## Installation

```bash
bun add @bullet-js/validation
```

## Usage

### Basic Validation

```typescript
import { Validator } from '@bullet-js/validation';

const data = {
    email: 'invalid-email',
    age: 15
};

const v = new Validator(data, {
    email: 'required|email',
    age: 'required|min:18'
});

if (v.fails()) {
    console.log(v.errors()); 
    // { email: ['Must be a valid email'], age: ['Must be at least 18'] }
}
```
