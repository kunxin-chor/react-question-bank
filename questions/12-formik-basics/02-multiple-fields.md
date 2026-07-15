---
title: Bind Multiple Fields
---

## Requirements

Real forms usually have more than one field. With Formik, adding another field is just adding another key to `initialValues` and another `Field` with a matching `name` — Formik handles the rest.

You're adding a "contact details" step to the workshop sign-up flow, collecting the attendee's email, phone number, and organization.

Follow the walkthrough tab step by step, typing each piece of code into `App.jsx` yourself. By the end, the form should have `email`, `phone`, and `organization` fields, and submitting should display all three values.

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function ContactDetailsForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  // Step 1: define initialValues with three fields: email, phone, organization
  // (all starting as empty strings)

  // Step 2: define handleSubmit(values, formikHelpers) that stores the whole
  // values object into submittedValues, then calls formikHelpers.setSubmitting(false)

  return (
    <div className="container mt-5">
      <h1>Workshop Signup</h1>
      {/* Step 3: pass initialValues and onSubmit to Formik below */}
      <Formik>
        {(formik) => (
          <Form data-testid="contact-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              {/* Step 4: add a Field here — type="email", id="email", name="email" */}
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              {/* Step 5: add a Field here — type="tel", id="phone", name="phone" */}
            </div>

            <div className="mb-3">
              <label htmlFor="organization" className="form-label">Organization</label>
              {/* Step 5 (continued): add a Field here — type="text", id="organization", name="organization" */}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Continue
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

export default ContactDetailsForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders three empty fields', () => {
  render(<App />);
  const form = screen.getByTestId('contact-form');
  expect(form.querySelector('#email').value).toBe('');
  expect(form.querySelector('#phone').value).toBe('');
  expect(form.querySelector('#organization').value).toBe('');
});

test('typing into each field updates it', () => {
  render(<App />);
  const email = screen.getByTestId('contact-form').querySelector('#email');
  const phone = screen.getByTestId('contact-form').querySelector('#phone');
  fireEvent.change(email, { target: { value: 'ada@example.com' } });
  fireEvent.change(phone, { target: { value: '555-0100' } });
  expect(email.value).toBe('ada@example.com');
  expect(phone.value).toBe('555-0100');
});

test('submitting stores all three values', async () => {
  render(<App />);
  const form = screen.getByTestId('contact-form');
  fireEvent.change(form.querySelector('#email'), { target: { value: 'ada@example.com' } });
  fireEvent.change(form.querySelector('#phone'), { target: { value: '555-0100' } });
  fireEvent.change(form.querySelector('#organization'), { target: { value: 'Acme Robotics' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  const summary = screen.getByTestId('submitted-values').textContent;
  expect(summary).toContain('ada@example.com');
  expect(summary).toContain('Acme Robotics');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function ContactDetailsForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  const initialValues = {
    email: '',
    phone: '',
    organization: '',
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedValues(values);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Workshop Signup</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="contact-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <Field type="email" className="form-control" id="email" name="email" />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <Field type="tel" className="form-control" id="phone" name="phone" />
            </div>

            <div className="mb-3">
              <label htmlFor="organization" className="form-label">Organization</label>
              <Field type="text" className="form-control" id="organization" name="organization" />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Continue
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

export default ContactDetailsForm;
```

## Walkthrough

**Step 1 — list every field in `initialValues`.** Type:

```jsx
const initialValues = {
  email: '',
  phone: '',
  organization: '',
};
```

Every field the form will ever bind to must have a starting value here, even if it's just an empty string. Formik uses this object's shape to know what `values.email`, `values.phone`, and `values.organization` mean later.

**Step 2 — submit the whole `values` object.** Type:

```jsx
const handleSubmit = (values, formikHelpers) => {
  setSubmittedValues(values);
  formikHelpers.setSubmitting(false);
};
```

`values` always contains every field declared in `initialValues`, updated with whatever the user has typed — you don't have to assemble it field by field yourself.

**Step 3 — wire it into `Formik`.** Type:

```jsx
<Formik initialValues={initialValues} onSubmit={handleSubmit}>
```

**Step 4 — bind the email field.** Type:

```jsx
<Field type="email" className="form-control" id="email" name="email" />
```

**Step 5 — bind the phone and organization fields.** Type:

```jsx
<Field type="tel" className="form-control" id="phone" name="phone" />
```

and

```jsx
<Field type="text" className="form-control" id="organization" name="organization" />
```

Each `Field`'s `name` must exactly match a key in `initialValues` — `email`, `phone`, and `organization` are three separate fields, so they need three separate `Field` elements with three different `name`s.

**Step 6 — run the tests.** Typing into any field should update just that field. Submitting should produce a `values` object containing all three fields at once, which is exactly what gets shown in `submitted-values`.
