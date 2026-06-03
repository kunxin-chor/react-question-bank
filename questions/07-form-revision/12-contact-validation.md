---
title: Contact Form Validation
---

## Requirements

You're given a contact form with three fields, a send button, an error message slot under each field, and a success message div. The JSX scaffolding is already in place — including every `data-testid` you'll need.

Your job is to make the form work:

1. Make all three inputs *controlled*. They start empty.
2. The error and success `<div>`s are **all empty** until the **Send** button is clicked for the first time.
3. When **Send** is clicked, validate the current values:
   - **Name** is invalid if it is empty (after trimming whitespace). Error text: `Name is required`.
   - **Age** is invalid if it is not a number that is at least `18`. Error text: `You must be 18 or older`.
   - **Message** is invalid if it has fewer than 10 characters (after trimming). Error text: `Message is too short`.
4. For each field, the matching `*-error` div should show the error text when invalid and be empty when valid.
5. If **all three** fields are valid at click time, fill the `success` div with the text `Thanks, <name>` (using the entered name). If anything is invalid, the `success` div should be empty.
6. Re-clicking **Send** should re-run the validation against the current values — earlier errors should clear if the user has fixed them.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  // implement the submit handler here

  return (
    <div>
      <label>
        Name
        <input data-testid="name" type="text" />
      </label>
      <div data-testid="name-error"></div>

      <label>
        Age
        <input data-testid="age" type="text" />
      </label>
      <div data-testid="age-error"></div>

      <label>
        Message
        <input data-testid="message" type="text" />
      </label>
      <div data-testid="message-error"></div>

      <button data-testid="submit">Send</button>

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
  expect(screen.getByTestId('name-error').textContent).toBe('');
  expect(screen.getByTestId('age-error').textContent).toBe('');
  expect(screen.getByTestId('message-error').textContent).toBe('');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('inputs are controlled', () => {
  render(<App />);
  fill('name', 'Ada');
  fill('age', '25');
  fill('message', 'Hello there!');
  expect(screen.getByTestId('name').value).toBe('Ada');
  expect(screen.getByTestId('age').value).toBe('25');
  expect(screen.getByTestId('message').value).toBe('Hello there!');
});

test('submitting an empty form shows all three errors and no success', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
  expect(screen.getByTestId('age-error')).toHaveTextContent('You must be 18 or older');
  expect(screen.getByTestId('message-error')).toHaveTextContent('Message is too short');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('only the age error shows when name and message are valid but age is under 18', () => {
  render(<App />);
  fill('name', 'Ada');
  fill('age', '16');
  fill('message', 'This is long enough.');
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('name-error').textContent).toBe('');
  expect(screen.getByTestId('age-error')).toHaveTextContent('You must be 18 or older');
  expect(screen.getByTestId('message-error').textContent).toBe('');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('only the message error shows when the message is too short', () => {
  render(<App />);
  fill('name', 'Ada');
  fill('age', '30');
  fill('message', 'hi');
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('name-error').textContent).toBe('');
  expect(screen.getByTestId('age-error').textContent).toBe('');
  expect(screen.getByTestId('message-error')).toHaveTextContent('Message is too short');
  expect(screen.getByTestId('success').textContent).toBe('');
});

test('a fully valid form clears all errors and shows the success message', () => {
  render(<App />);
  fill('name', 'Grace');
  fill('age', '42');
  fill('message', 'Looking forward to it.');
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('name-error').textContent).toBe('');
  expect(screen.getByTestId('age-error').textContent).toBe('');
  expect(screen.getByTestId('message-error').textContent).toBe('');
  expect(screen.getByTestId('success')).toHaveTextContent('Thanks, Grace');
});

test('errors clear when the user fixes the inputs and resubmits', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('submit'));
  expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');

  fill('name', 'Alan');
  fill('age', '20');
  fill('message', 'A nice long message.');
  fireEvent.click(screen.getByTestId('submit'));

  expect(screen.getByTestId('name-error').textContent).toBe('');
  expect(screen.getByTestId('age-error').textContent).toBe('');
  expect(screen.getByTestId('message-error').textContent).toBe('');
  expect(screen.getByTestId('success')).toHaveTextContent('Thanks, Alan');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSubmit() {
    const nErr = name.trim() === '' ? 'Name is required' : '';
    const aErr = Number(age) >= 18 ? '' : 'You must be 18 or older';
    const mErr = message.trim().length >= 10 ? '' : 'Message is too short';

    setNameError(nErr);
    setAgeError(aErr);
    setMessageError(mErr);

    if (!nErr && !aErr && !mErr) {
      setSuccess(`Thanks, ${name}`);
    } else {
      setSuccess('');
    }
  }

  return (
    <div>
      <label>
        Name
        <input
          data-testid="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <div data-testid="name-error">{nameError}</div>

      <label>
        Age
        <input
          data-testid="age"
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </label>
      <div data-testid="age-error">{ageError}</div>

      <label>
        Message
        <input
          data-testid="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <div data-testid="message-error">{messageError}</div>

      <button data-testid="submit" onClick={handleSubmit}>
        Send
      </button>

      <div data-testid="success">{success}</div>
    </div>
  );
}
```

## Walkthrough

1. The input values and the per-field error messages are kept in separate state. The inputs reflect what the user is typing; the errors only change when **Send** is clicked.
2. Inside the click handler, each rule produces either an error string or an empty string. `Number(age) >= 18` is `false` for empty or non-numeric input (because `Number('')` is `0` and `Number('abc')` is `NaN`), so both fail the check.
3. The success message only fills in when *all three* error strings are empty — otherwise it's cleared so old success text never lingers next to fresh errors.
4. Re-running the same checks on every click means the user gets fresh feedback: fixing a field clears its error, breaking it again brings the error back.
