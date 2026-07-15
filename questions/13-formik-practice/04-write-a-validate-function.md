---
title: Write a Validate Function
---

## Requirements

`App.jsx` has a Formik form for `email` and `password`, with the fields, error display, and submit button all locked. Your job is to write the `validate` function.

For example:

- Submitting with an empty email should show `Email is required` under the email field.
- Submitting with a password shorter than 6 characters should show `Password must be at least 6 characters` under the password field.
- Submitting with both valid should show no errors, and record the values.

To do this:

1. Inside `validate(values)`, build an `errors` object. Set `errors.email` if `values.email` is empty. Set `errors.password` if `values.password.length` is less than `6`.
2. Return `errors` instead of the stub's `{}` (an empty object means the form is valid).

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function ValidatedForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  // @lock
  const initialValues = {
    email: '',
    password: '',
  };
  // @endlock

  const validate = (values) => {
    // TODO: return an errors object:
    // - errors.email = 'Email is required' if values.email is empty
    // - errors.password = 'Password must be at least 6 characters' if values.password.length < 6
    return {};
  };

  // @lock
  const handleSubmit = (values, formikHelpers) => {
    setSubmittedValues(values);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="validated-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field type="email" className="form-control" id="email" name="email" />
              {formik.touched.email && formik.errors.email && (
                <div data-testid="email-error" className="text-danger">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <Field type="password" className="form-control" id="password" name="password" />
              {formik.touched.password && formik.errors.password && (
                <div data-testid="password-error" className="text-danger">
                  {formik.errors.password}
                </div>
              )}
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
      <pre data-testid="submitted-values">
        {submittedValues ? JSON.stringify(submittedValues) : ''}
      </pre>
    </div>
  );
}
  // @endlock

export default ValidatedForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows no errors before the first submit attempt', () => {
  render(<App />);
  expect(screen.queryByTestId('email-error')).toBeNull();
  expect(screen.queryByTestId('password-error')).toBeNull();
});

test('submitting empty fields shows both errors', async () => {
  render(<App />);
  fireEvent.submit(screen.getByTestId('validated-form'));
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
  expect(screen.getByTestId('password-error')).toHaveTextContent('at least 6 characters');
});

test('valid values submit with no errors', async () => {
  render(<App />);
  const form = screen.getByTestId('validated-form');
  fireEvent.change(form.querySelector('#email'), { target: { value: 'ada@example.com' } });
  fireEvent.change(form.querySelector('#password'), { target: { value: 'secret123' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.queryByTestId('email-error')).toBeNull();
  expect(screen.queryByTestId('password-error')).toBeNull();
  expect(screen.getByTestId('submitted-values').textContent).toContain('ada@example.com');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function ValidatedForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  const initialValues = {
    email: '',
    password: '',
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedValues(values);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="validated-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field type="email" className="form-control" id="email" name="email" />
              {formik.touched.email && formik.errors.email && (
                <div data-testid="email-error" className="text-danger">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <Field type="password" className="form-control" id="password" name="password" />
              {formik.touched.password && formik.errors.password && (
                <div data-testid="password-error" className="text-danger">
                  {formik.errors.password}
                </div>
              )}
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
      <pre data-testid="submitted-values">
        {submittedValues ? JSON.stringify(submittedValues) : ''}
      </pre>
    </div>
  );
}

export default ValidatedForm;
```

## Walkthrough

1. `validate` receives the current `values` and must return an object — Formik merges that object into `formik.errors`.
2. Only add a key to `errors` when a field is actually invalid; an empty `errors` object means the form passes validation and `onSubmit` will run.
3. The error display (already wired up) only shows a message once `formik.touched.<field>` is true — that's handled for you; your `validate` function only needs to decide what the error text is, not when to show it.
