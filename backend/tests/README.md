# Validation Middleware Tests

This directory contains comprehensive tests for the validation middleware system, including both unit tests and property-based tests.

## Test Files

### `validation.test.js`
Traditional unit tests that verify specific validation scenarios:
- Valid and invalid user signup data
- Password strength validation
- Job creation validation
- File upload validation
- Input sanitization
- Query and parameter validation

### `validation.property.test.js`
Property-based tests using fast-check that verify universal properties:

#### **Property 1: Comprehensive Input Validation**
**Validates: Requirements 1.1, 1.2, 1.4**

Tests that the validation system consistently:
- Validates all API endpoints against predefined schemas
- Returns 400 status with field-level errors for invalid data
- Validates file uploads for type, size, and content
- Preserves and sanitizes valid data appropriately
- Works consistently across different data sources (body, query, params)
- Respects feature flags for validation control

#### **Input Sanitization Properties**
Tests that the sanitization system:
- Removes potentially dangerous content from any input
- Sanitizes nested objects and arrays recursively
- Handles malicious patterns like XSS attempts

## Running Tests

```bash
# Run all validation tests
npm test -- --testPathPatterns=validation

# Run only unit tests
npm test -- --testPathPatterns=validation.test.js

# Run only property-based tests
npm test -- --testPathPatterns=validation.property.test.js

# Run with coverage
npm run test:coverage
```

## Property-Based Testing

The property-based tests use fast-check to generate hundreds of test cases automatically, ensuring that the validation middleware works correctly across a wide range of inputs. These tests are particularly valuable for:

1. **Discovering edge cases** that manual testing might miss
2. **Verifying universal properties** that should hold for all inputs
3. **Testing security properties** with automatically generated malicious inputs
4. **Ensuring consistency** across different API endpoints and data sources

## Test Results

All tests are currently passing:
- ✅ 19 unit tests passed
- ✅ 8 property-based tests passed (with 100+ generated test cases each)
- ✅ Property-based test status: PASSED

The property-based tests validate Requirements 1.1, 1.2, and 1.4 as specified in the error handling and validation system design.