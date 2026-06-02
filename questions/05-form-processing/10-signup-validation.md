---
title: Sign-up Form Validation
---

## Requirements

You're given a sign-up form with three text fields, a submit button, an error message slot under each field, and a success message div. The JSX scaffolding is already in place — including every `data-testid` you'll need.

Your job is to make the form work:

1. Make all three inputs *controlled*. They start empty.
2. The error and success `<div>`s are **all empty** until the **Sign Up** button is clicked for the first time.
3. When **Sign Up** is clicked, validate the current values:
   - **Email** is invalid if it doesn't contain an `@`. Error text: `Email is invalid`.
   - **Password** is invalid if it has fewer than 6 characters. Error text: `Password must be at least 6 characters`.
   - **Confirm** is invalid if it doesn't exactly match the password. Error text: `Passwords do not match`.
4. For each field, the matching `*-error` div should show the error text when invalid and be empty when valid.
5. If **all three** fields are valid at click time, fill the `success` div with the text `Welcome, <email>` (using the entered email). If anything is invalid, the `success` div should be empty.
6. Re-clicking **Sign Up** should re-run the validation against the current values — earlier errors should clear if the user has fixed them.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  // implement the submit handler here

  return (
    <div>
      <label>
        Email
        <input data-testid="email" type="text" />
      </label>
      <div data-testid="email-error"></div>

      <label>
        Password
        <input data-testid="password" type="password" />
      </label>
      <div data-testid="password-error"></div>

      <label>
        Confirm password
        <input data-testid="confirm" type="password" />
      </label>
      <div data-testid="confirm-error"></div>

      <button data-testid="submit">Sign Up</button>

      <div data-testid="success"></div>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

function fill(testId, value) {
  fireEvent.change(screen.getByTestId(testId), { target: { value } });
}

test('all error and success slots start empty', () => {
  render(<App />);
  expect(screen.getByTestId('email-error').textContent).toBe('');
  expect(screen.getByTestId('password-error').textContent).toBe('');
  expect(screen.getByTestId('confirm-error').textContent).toBe('');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('inputs are controlled', () => {
  render(<App />);
  fill('email', 'a@b.com');
  fill('password', 'secret');
  fill('confirm', 'secret');
  expect(screen.getByTestId('email').value).toBe('a@b.com');
  expect(screen.getByTestId('password').value).toBe('secret');
  expect(screen.getByTestId('confirm').value).toBe('secret');
});

test('submitting an empty form shows all three errors and no success', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');
  expect(screen.getByTestId('password-error')).toHaveTextContent('Password must be at least 6 characters');
  expect(screen.getByTestId('confirm-error')).toHaveTextContent('Passwords do not match');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('only the password error shows when email is valid but password is short', () => {
  render(<App />);
  fill('email', 'ada@example.com');
  fill('password', '123');
  fill('confirm', '123');
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('email-error').textContent).toBe('');
  expect(screen.getByTestId('password-error')).toHaveTextContent('Password must be at least 6 characters');
  expect(screen.getByTestId('confirm-error').textContent).toBe('');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('only the confirm error shows when passwords do not match', () => {
  render(<App />);
  fill('email', 'ada@example.com');
  fill('password', 'secret1');
  fill('confirm', 'secret2');
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('email-error').textContent).toBe('');
  expect(screen.getByTestId('password-error').textContent).toBe('');
  expect(screen.getByTestId('confirm-error')).toHaveTextContent('Passwords do not match');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('a fully valid form clears all errors and shows the success message', () => {
  render(<App />);
  fill('email', 'ada@example.com');
  fill('password', 'secret1');
  fill('confirm', 'secret1');
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('email-error').textContent).toBe('');
  expect(screen.getByTestId('password-error').textContent).toBe('');
  expect(screen.getByTestId('confirm-error').textContent).toBe('');
  expect(screen.getByTestId('success')).toHaveTextContent('Welcome, ada@example.com');
});

test('errors clear when the user fixes the inputs and resubmits', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');

  fill('email', 'grace@example.com');
  fill('password', 'longerpw');
  fill('confirm', 'longerpw');
  fireEvent.click(screen.getByTestId('submit'));

  expect(screen.getByTestId('email-error').textContent).toBe('');
  expect(screen.getByTestId('password-error').textContent).toBe('');
  expect(screen.getByTestId('confirm-error').textContent).toBe('');
  expect(screen.getByTestId('success')).toHaveTextContent('Welcome, grace@example.com');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSubmit() {
    const eErr = email.includes('@') ? '' : 'Email is invalid';
    const pErr = password.length >= 6 ? '' : 'Password must be at least 6 characters';
    const cErr = confirm === password ? '' : 'Passwords do not match';

    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmError(cErr);

    if (!eErr && !pErr && !cErr) {
      setSuccess(`Welcome, ${email}`);
    } else {
      setSuccess('');
    }
  }

  return (
    <div>
      <label>
        Email
        <input
          data-testid="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <div data-testid="email-error">{emailError}</div>

      <label>
        Password
        <input
          data-testid="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <div data-testid="password-error">{passwordError}</div>

      <label>
        Confirm password
        <input
          data-testid="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      <div data-testid="confirm-error">{confirmError}</div>

      <button data-testid="submit" onClick={handleSubmit}>
        Sign Up
      </button>

      <div data-testid="success">{success}</div>
    </div>
  );
}
```

## Walkthrough

1. The input values and the per-field error messages are kept in separate state. The inputs reflect what the user is typing right now; the errors only change when **Sign Up** is clicked.
2. Inside the click handler, each rule produces either an error string or an empty string. Storing the empty string instead of `null` keeps the JSX simple — `{emailError}` just renders nothing when there's no problem.
3. The success message only fills in when *all three* error strings are empty — otherwise it's cleared so old success text never lingers next to fresh errors.
4. Re-running the same checks on every click means the user gets fresh feedback each time: fixing a field makes its error disappear, and breaking it again brings the error back.
5. This pattern (`onSubmit` → compute errors → `setError(...)` for each field → render the messages from state) scales to any number of fields and any combination of rules.
