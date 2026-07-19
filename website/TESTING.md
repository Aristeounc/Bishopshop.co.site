# Testing Guide

This document outlines the testing infrastructure and best practices for the Abacus website.

## Test Structure

Tests are organized in the `__tests__` directory, mirroring the source structure:

```
__tests__/
├── lib/
│   └── validation.test.ts
├── components/
│   └── Button.test.tsx
└── api/
    └── email-signup.test.ts
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode
```bash
npm test:watch
```

### Run tests with coverage
```bash
npm test:coverage
```

## Test Types

### Unit Tests
Unit tests verify individual functions and components work correctly in isolation.

Example: Testing the `validateEmail` function
```typescript
it('should validate correct email addresses', () => {
  const result = validateEmail('test@example.com');
  expect(result.valid).toBe(true);
});
```

### Component Tests
Component tests use React Testing Library to test components from a user's perspective.

Example: Testing the Button component
```typescript
it('handles click events', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  
  const button = screen.getByRole('button');
  await userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### API Tests
API route tests verify endpoint behavior and request/response handling.

## Coverage Goals

- **Overall**: > 80% code coverage
- **Components**: > 75% coverage
- **Utilities**: > 90% coverage
- **API Routes**: > 85% coverage

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Meaningful Assertions**: Make test expectations clear and specific
3. **Avoid Test Interdependence**: Each test should be independent
4. **Mock External Dependencies**: Mock API calls, timers, and third-party libraries
5. **Keep Tests Fast**: Avoid slow operations; use mocks and jest.useFakeTimers when needed
6. **Write Descriptive Test Names**: Use clear language that explains what is being tested

## Example: Testing a Form Component

```typescript
describe('ContactForm', () => {
  it('should show validation errors for empty fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify({ success: true })))
    );

    render(<ContactForm />);
    
    await userEvent.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await userEvent.type(screen.getByPlaceholderText('Subject'), 'Inquiry');
    await userEvent.type(screen.getByPlaceholderText('Message'), 'This is a test message');
    
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
```

## CI/CD Integration

Tests run automatically on:
- **Pull Requests**: On every PR to main or develop
- **Push to main**: On every commit to main branch
- **Manual Trigger**: Via GitHub Actions workflow dispatch

See `.github/workflows/ci.yml` for the full CI configuration.

## Adding New Tests

When adding a new feature:
1. Write tests first (TDD approach) or alongside the feature
2. Ensure tests cover happy paths and edge cases
3. Aim for 80%+ coverage on new code
4. Include tests in your pull request

## Debugging Tests

### Run a single test file
```bash
npm test -- validation.test.ts
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="validateEmail"
```

### Debug mode with Node inspector
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
