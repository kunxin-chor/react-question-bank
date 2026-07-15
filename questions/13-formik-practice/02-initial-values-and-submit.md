---
title: Wire Up initialValues and handleSubmit
---

## Requirements

`App.jsx` has a complete Formik form for a feedback message, with the `Field`, `Form`, and submit button all locked. Your job is to write `initialValues` and `handleSubmit`.

For example:

- The textarea should start empty.
- After typing `Great course!` and submitting, `submitted-message` should show `Great course!`.

To do this:

1. Define `initialValues` with a single field, `message: ''`.
2. Define `handleSubmit(values, formikHelpers)` that stores `values.message` into `submittedMessage`, then calls `formikHelpers.setSubmitting(false)`.

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function FeedbackForm() {
  const [submittedMessage, setSubmittedMessage] = useState('');

  const initialValues = {
    // TODO: add a single field, message: ''
  };

  const handleSubmit = (values, formikHelpers) => {
    // TODO: store values.message into submittedMessage, then call
    // formikHelpers.setSubmitting(false)
  };

  return (
    // @lock
    <div className="container mt-5">
      <h1>Feedback</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="feedback-form">
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <Field as="textarea" className="form-control" id="message" name="message" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Send
            </button>
          </Form>
        )}
      </Formik>
      <p data-testid="submitted-message">{submittedMessage}</p>
    </div>
    // @endlock
  );
}

export default FeedbackForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders an empty message field', () => {
  render(<App />);
  const form = screen.getByTestId('feedback-form');
  expect(form.querySelector('#message').value).toBe('');
});

test('typing fills the message field', () => {
  render(<App />);
  const message = screen.getByTestId('feedback-form').querySelector('#message');
  fireEvent.change(message, { target: { value: 'Great course!' } });
  expect(message.value).toBe('Great course!');
});

test('submitting shows the typed message', async () => {
  render(<App />);
  const form = screen.getByTestId('feedback-form');
  fireEvent.change(form.querySelector('#message'), { target: { value: 'Great course!' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(screen.getByTestId('submitted-message')).toHaveTextContent('Great course!');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

function FeedbackForm() {
  const [submittedMessage, setSubmittedMessage] = useState('');

  const initialValues = {
    message: '',
  };

  const handleSubmit = (values, formikHelpers) => {
    setSubmittedMessage(values.message);
    formikHelpers.setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <h1>Feedback</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formik) => (
          <Form data-testid="feedback-form">
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <Field as="textarea" className="form-control" id="message" name="message" />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="submit"
              disabled={formik.isSubmitting}
            >
              Send
            </button>
          </Form>
        )}
      </Formik>
      <p data-testid="submitted-message">{submittedMessage}</p>
    </div>
  );
}

export default FeedbackForm;
```

## Walkthrough

1. `initialValues` must have a `message` key because the locked `Field` uses `name="message"` — Formik would throw or silently do nothing useful if the key didn't exist.
2. `handleSubmit` receives `(values, formikHelpers)`; `values.message` is whatever the user typed, and `formikHelpers.setSubmitting(false)` clears `formik.isSubmitting` so the button becomes enabled again.
3. `Field as="textarea"` renders a `<textarea>` instead of an `<input>`, but binds to Formik state in exactly the same way through `name`.
