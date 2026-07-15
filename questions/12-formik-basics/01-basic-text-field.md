---
title: Create a Basic Formik Form
---

## Requirements

Formik is a library that manages form state for you — the current value of every field, whether it's been touched, and what happens on submit — so you don't have to wire up `useState` and `onChange` by hand for every field.

You're building the first step of a workshop sign-up flow: a form that asks for the attendee's full name.

Follow the walkthrough tab step by step, typing each piece of code into `App.jsx` yourself. After each step, the walkthrough explains what you just typed. By the end, typing into the textbox and clicking **Sign Up** should display the typed name on the page.

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function SignupForm() {
  const [submittedName, setSubmittedName] = useState('');

  // Step 1: define initialValues with a single field, name: ''

  // Step 2: define handleSubmit(values, formikHelpers) that stores
  // values.name into submittedName, then calls formikHelpers.setSubmitting(false)

  return (
    <div className="container mt-5">
      <h1>Workshop Signup</h1>
      {/* Step 3: pass initialValues and onSubmit to Formik below */}
      <Formik>
        {(formik) => (
          <Form data-testid="signup-form">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              {/* Step 4: add a Field here — type="text", id="name", name="name" */}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
      <p data-testid="submitted-name">{submittedName}</p>
    </div>
  );
}

export default SignupForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders an empty name field', () => {
  render(<App />);
  expect(screen.getByTestId('signup-form')).toBeTruthy();
  expect(screen.getByRole('textbox').value).toBe('');
});

test('typing fills the textbox', () => {
  render(<App />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Ada Lovelace' } });
  expect(input.value).toBe('Ada Lovelace');
});

test('submitting the form stores the typed name', async () => {
  render(<App />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Ada Lovelace' } });
  fireEvent.submit(screen.getByTestId('signup-form'));
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.getByTestId('submitted-name')).toHaveTextContent('Ada Lovelace');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function SignupForm() {
  const [submittedName, setSubmittedName] = useState('');

  const initialValues = {
    name: '',
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedName(values.name);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Workshop Signup</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="signup-form">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <Field type="text" className="form-control" id="name" name="name" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
      <p data-testid="submitted-name">{submittedName}</p>
    </div>
  );
}

export default SignupForm;
```

## Walkthrough

**Step 1 — describe the form's fields with `initialValues`.** Type:

```jsx
const initialValues = {
  name: '',
};
```

Formik needs to know what fields exist and what they start as, before anything is rendered. Each key here becomes a field name that `Field` components can bind to.

**Step 2 — handle submission with `handleSubmit`.** Type:

```jsx
const handleSubmit = (values, formikHelpers) => {
  setSubmittedName(values.name);
  formikHelpers.setSubmitting(false);
};
```

When the form is submitted, Formik calls your `onSubmit` function with two arguments: `values` (the current field values) and `formikHelpers` (an object of helper functions, including `setSubmitting`). Calling `formikHelpers.setSubmitting(false)` tells Formik "I'm done processing this submission" — without it, `formik.isSubmitting` would stay `true` forever and the button would stay disabled.

**Step 3 — wire `initialValues` and `handleSubmit` into `Formik`.** Type:

```jsx
<Formik initialValues={initialValues} onSubmit={handleSubmit}>
```

The `<Formik>` component is the top-level provider — everything inside it (via `Field`, `Form`, and the render function) can access the form's state through it.

**Step 4 — bind the textbox with `Field`.** Type:

```jsx
<Field type="text" className="form-control" id="name" name="name" />
```

`Field`'s `name` attribute is the important part — it tells Formik which key in `initialValues` this input is bound to. You don't need to write `value` or `onChange` yourself; `Field` reads and updates `formik`'s state automatically based on `name`.

**Step 5 — run the tests.** Typing into the textbox should update it immediately, and clicking **Sign Up** should call `handleSubmit` with the typed value, showing it in `submitted-name`. Note that `formik.isSubmitting` — accessed via the `{(formik) => ( ... )}` render function passed as `Formik`'s child — is what disables the button while a submission is in progress.
