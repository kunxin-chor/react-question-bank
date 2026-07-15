---
title: Bind a Text Field with Formik
---

## Requirements

`App.jsx` has a Formik form already wired up, with `initialValues`, `handleSubmit`, and the submit button all locked. Your job is to finish the one missing `Field` for the `email` input.

For example:

- Typing `ada@example.com` into the email box should update it as a normal controlled input would.
- Submitting the form should show `ada@example.com` in `submitted-email`.

To do this:

1. Add a `Field` inside the `<div className="mb-3">` for email.
2. Give it `type="email"`, `id="email"`, and `name="email"` so it binds to the `email` key in `initialValues`.

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

// @lock
function EmailForm() {
  const [submittedEmail, setSubmittedEmail] = useState('');

  const initialValues = {
    email: '',
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedEmail(values.email);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="email-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              {/* @endlock */}
              {/* TODO: add a Field here — type="email", id="email", name="email" */}
              {/* @lock */}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
      <p data-testid="submitted-email">{submittedEmail}</p>
    </div>
  );
}
// @endlock

export default EmailForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders an empty email field', () => {
  render(<App />);
  const form = screen.getByTestId('email-form');
  expect(form.querySelector('#email').value).toBe('');
});

test('typing fills the email field', () => {
  render(<App />);
  const email = screen.getByTestId('email-form').querySelector('#email');
  fireEvent.change(email, { target: { value: 'ada@example.com' } });
  expect(email.value).toBe('ada@example.com');
});

test('submitting shows the typed email', async () => {
  render(<App />);
  const form = screen.getByTestId('email-form');
  fireEvent.change(form.querySelector('#email'), { target: { value: 'ada@example.com' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.getByTestId('submitted-email')).toHaveTextContent('ada@example.com');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function EmailForm() {
  const [submittedEmail, setSubmittedEmail] = useState('');

  const initialValues = {
    email: '',
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedEmail(values.email);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="email-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field type="email" className="form-control" id="email" name="email" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
      <p data-testid="submitted-email">{submittedEmail}</p>
    </div>
  );
}

export default EmailForm;
```

## Walkthrough

1. `Field`'s `name="email"` is what connects it to `initialValues.email` — Formik matches fields to values purely by that string, not by position in the JSX.
2. Because `Field` already knows how to read and update Formik's internal state, you don't add `value` or `onChange` yourself — just `type`, `id`, and `name`.
3. On submit, `handleSubmit` receives `values.email` already populated with whatever was typed, and stores it via `setSubmittedEmail`.
