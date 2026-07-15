---
title: Validate the Form and Show Errors
---

## Requirements

Formik can run your own validation logic before it calls `onSubmit`. Give `Formik` a `validate` function that returns an object of error messages, and `formik.errors` / `formik.touched` will tell you what to show and when.

This is the final step of the workshop sign-up flow: confirming the attendee's name and email before submitting.

Follow the walkthrough tab step by step, typing each piece of code into `App.jsx` yourself. By the end, submitting the form with an empty or invalid field should show an error message under that field, and the error should disappear once the field is valid.

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function ConfirmationForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  const initialValues = {
    name: '',
    email: '',
  };

  // Step 1: define validate(values) that returns an errors object:
  // - errors.name = 'Name is required' if values.name is empty
  // - errors.email = 'Email is required' if values.email is empty,
  //   otherwise errors.email = 'Enter a valid email address' if values.email doesn't include '@'

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedValues(values);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Workshop Signup</h1>
      {/* Step 2: add a validate={validate} prop to Formik below */}
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="confirmation-form">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <Field type="text" className="form-control" id="name" name="name" />
              {/* Step 3: show formik.errors.name here, only when formik.touched.name is true */}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field type="email" className="form-control" id="email" name="email" />
              {/* Step 3 (continued): show formik.errors.email here, only when formik.touched.email is true */}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Confirm Signup
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

export default ConfirmationForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows no errors before the first submit attempt', () => {
  render(<App />);
  expect(screen.queryByTestId('name-error')).toBeNull();
  expect(screen.queryByTestId('email-error')).toBeNull();
});

test('submitting empty fields shows both errors', async () => {
  render(<App />);
  fireEvent.submit(screen.getByTestId('confirmation-form'));
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
  expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
});

test('an email without @ shows a format error', async () => {
  render(<App />);
  const form = screen.getByTestId('confirmation-form');
  fireEvent.change(form.querySelector('#name'), { target: { value: 'Ada Lovelace' } });
  fireEvent.change(form.querySelector('#email'), { target: { value: 'not-an-email' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.queryByTestId('name-error')).toBeNull();
  expect(screen.getByTestId('email-error')).toHaveTextContent('valid email');
});

test('valid values submit with no errors', async () => {
  render(<App />);
  const form = screen.getByTestId('confirmation-form');
  fireEvent.change(form.querySelector('#name'), { target: { value: 'Ada Lovelace' } });
  fireEvent.change(form.querySelector('#email'), { target: { value: 'ada@example.com' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.queryByTestId('name-error')).toBeNull();
  expect(screen.queryByTestId('email-error')).toBeNull();
  expect(screen.getByTestId('submitted-values').textContent).toContain('ada@example.com');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function ConfirmationForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  const initialValues = {
    name: '',
    email: '',
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!values.email.includes('@')) {
      errors.email = 'Enter a valid email address';
    }
    return errors;
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedValues(values);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Workshop Signup</h1>
      <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="confirmation-form">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <Field type="text" className="form-control" id="name" name="name" />
              {formik.touched.name && formik.errors.name && (
                <div data-testid="name-error" className="text-danger">
                  {formik.errors.name}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field type="email" className="form-control" id="email" name="email" />
              {formik.touched.email && formik.errors.email && (
                <div data-testid="email-error" className="text-danger">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Confirm Signup
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

export default ConfirmationForm;
```

## Walkthrough

**Step 1 — write the `validate` function.** Type:

```jsx
const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!values.email.includes('@')) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
};
```

Formik calls `validate` with the current `values` every time something changes or the form is submitted. If a field is invalid, add a message to `errors` under that field's name; if `errors` ends up empty, Formik treats the form as valid and calls `onSubmit`. If it's not empty, Formik stores `errors` and skips calling `onSubmit`. Note the `else if` — an empty email should say "required", not "invalid format", so the format check only runs once something has actually been typed.

**Step 2 — pass `validate` to `Formik`.** `initialValues` and `onSubmit` are already wired up; add `validate` next to them:

```jsx
<Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
```

**Step 3 — show the errors, but only after a field has been touched.** Under the name field, type:

```jsx
{formik.touched.name && formik.errors.name && (
  <div data-testid="name-error" className="text-danger">
    {formik.errors.name}
  </div>
)}
```

and under the email field:

```jsx
{formik.touched.email && formik.errors.email && (
  <div data-testid="email-error" className="text-danger">
    {formik.errors.email}
  </div>
)}
```

`formik.errors` holds whatever your `validate` function returned. `formik.touched` tracks which fields the user has interacted with (or attempted to submit). Checking both means errors don't appear the instant the page loads — only after the user has had a chance to fill something in, or after they've tried to submit.

**Step 4 — run the tests.** Submitting the empty form should mark every field as touched and show both error messages. Typing a name and an email without an `@` should clear the name error but show the format error. Typing a valid name and email should clear both errors and allow `handleSubmit` to run, showing the submitted values.
