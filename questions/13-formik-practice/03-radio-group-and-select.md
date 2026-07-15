---
title: Add a Radio Group and a Select
---

## Requirements

`App.jsx` has a Formik form with a `name` field already wired up and locked, along with locked `initialValues` and `handleSubmit`. Your job is to add the missing `salutation` radio group and `country` select.

For example:

- Selecting "Ms" and choosing "Malaysia", then submitting, should show `salutation: Ms, country: my` in `submitted-summary`.

To do this:

1. Add three radio `Field`s, all with `name="salutation"`, one each with `value="Mr"`, `"Ms"`, and `"Mrs"`.
2. Add a select `Field` (`as="select"`) with `id="country"` and `name="country"`, containing `<option>`s for `""` (placeholder), `"sg"` (Singapore), and `"my"` (Malaysia).

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

// @lock
function DetailsForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  const initialValues = {
    name: '',
    salutation: '',
    country: '',
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedValues(values);
    formikHelpers.setSubmitting(false);
  };
// @endlock

  return (
    // @lock
    <div className="container mt-5">
      <h1>Register</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="details-form">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <Field type="text" className="form-control" id="name" name="name" />
            </div>
            {/* @endlock */}

            <div className="mb-3">
              <label className="form-label">Salutation</label>
              <div>
                {/* TODO: add three radio Fields here — name="salutation",
                    one each with value="Mr", "Ms", and "Mrs" */}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              {/* TODO: add a select Field here — as="select", id="country", name="country",
                  with options for "" (placeholder), "sg" (Singapore), and "my" (Malaysia) */}
            </div>

            {/* @lock */}
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
      <p data-testid="submitted-summary">
        {submittedValues
          ? `salutation: ${submittedValues.salutation}, country: ${submittedValues.country}`
          : ''}
      </p>
    </div>
  );
}
// @endlock

export default DetailsForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders the salutation radios and country select', () => {
  render(<App />);
  const form = screen.getByTestId('details-form');
  expect(form.querySelector('input[type="radio"][value="Mr"]')).toBeTruthy();
  expect(form.querySelector('input[type="radio"][value="Ms"]')).toBeTruthy();
  expect(form.querySelector('input[type="radio"][value="Mrs"]')).toBeTruthy();
  expect(form.querySelector('#country')).toBeTruthy();
});

test('submitting reports the chosen salutation and country', async () => {
  render(<App />);
  const form = screen.getByTestId('details-form');
  fireEvent.click(form.querySelector('input[type="radio"][value="Ms"]'));
  fireEvent.change(form.querySelector('#country'), { target: { value: 'my' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.getByTestId('submitted-summary')).toHaveTextContent('salutation: Ms, country: my');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function DetailsForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  const initialValues = {
    name: '',
    salutation: '',
    country: '',
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedValues(values);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="details-form">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <Field type="text" className="form-control" id="name" name="name" />
            </div>

            <div className="mb-3">
              <label className="form-label">Salutation</label>
              <div>
                <div className="form-check form-check-inline">
                  <Field className="form-check-input" type="radio" name="salutation" id="mr" value="Mr" />
                  <label className="form-check-label" htmlFor="mr">Mr</label>
                </div>
                <div className="form-check form-check-inline">
                  <Field className="form-check-input" type="radio" name="salutation" id="ms" value="Ms" />
                  <label className="form-check-label" htmlFor="ms">Ms</label>
                </div>
                <div className="form-check form-check-inline">
                  <Field className="form-check-input" type="radio" name="salutation" id="mrs" value="Mrs" />
                  <label className="form-check-label" htmlFor="mrs">Mrs</label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              <Field as="select" className="form-select" id="country" name="country">
                <option value="">Select Country</option>
                <option value="sg">Singapore</option>
                <option value="my">Malaysia</option>
              </Field>
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
      <p data-testid="submitted-summary">
        {submittedValues
          ? `salutation: ${submittedValues.salutation}, country: ${submittedValues.country}`
          : ''}
      </p>
    </div>
  );
}

export default DetailsForm;
```

## Walkthrough

1. All three salutation radios share `name="salutation"` — that's what makes them a mutually-exclusive group. Each one's own `value` becomes `values.salutation` when it's selected.
2. `Field as="select"` renders a `<select>`; its children are ordinary `<option>` elements, and `values.country` becomes whichever option's `value` is chosen.
3. Neither field needs a `checked` or `value`/`onChange` prop written by hand — `Field` derives the right behavior purely from `type`/`as` plus `name`.
