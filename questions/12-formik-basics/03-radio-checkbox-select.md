---
title: Radios, Checkboxes, and a Select
---

## Requirements

Formik's `Field` component isn't limited to text inputs — it can also drive radio buttons, checkboxes (including a *group* of checkboxes bound to a single array field), and `<select>` dropdowns, all without you writing any `onChange` handlers.

You're adding a "session preferences" step to the workshop sign-up flow: which time slot to attend, which topics interest the attendee, and their experience level.

Follow the walkthrough tab step by step, typing each piece of code into `App.jsx` yourself. By the end, the form should have a session-time radio group, a group of interest checkboxes, and an experience-level dropdown, all reporting their values on submit.

## Files

```jsx file=App.jsx default
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

const interests = [
  { id: 1, name: 'Coding' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Marketing' },
];

function PreferencesForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  // Step 1: define initialValues with three fields:
  // sessionTime: '', interests: [], experienceLevel: ''

  // Step 2: define handleSubmit(values, formikHelpers) that stores the
  // whole values object into submittedValues, then calls formikHelpers.setSubmitting(false)

  return (
    <div className="container mt-5">
      <h1>Workshop Signup</h1>
      {/* Step 3: pass initialValues and onSubmit to Formik below */}
      <Formik>
        {(formik) => (
          <Form data-testid="preferences-form">
            <div className="mb-3">
              <label className="form-label">Session Time</label>
              <div>
                {/* Step 4: add three radio Fields here — name="sessionTime",
                    one each with value="Morning", "Afternoon", and "Evening" */}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Interests</label>
              {interests.map((interest) => (
                <div className="form-check" key={interest.id}>
                  {/* Step 5: add a checkbox Field here — name="interests",
                      value={String(interest.id)} */}
                  <label
                    className="form-check-label"
                    htmlFor={`interest-${interest.id}`}
                  >
                    {interest.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label htmlFor="experienceLevel" className="form-label">Experience Level</label>
              {/* Step 6: add a select Field here — as="select", id="experienceLevel", name="experienceLevel",
                  with <option> children for "beginner" (Beginner) and "intermediate" (Intermediate) */}
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

export default PreferencesForm;
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders the session-time radios, interest checkboxes, and experience select', () => {
  render(<App />);
  const form = screen.getByTestId('preferences-form');
  expect(form.querySelector('input[type="radio"][value="Afternoon"]')).toBeTruthy();
  expect(form.querySelector('#interest-2')).toBeTruthy();
  expect(form.querySelector('#experienceLevel')).toBeTruthy();
});

test('submitting reports the chosen session time, interests, and experience level', async () => {
  render(<App />);
  const form = screen.getByTestId('preferences-form');
  fireEvent.click(form.querySelector('input[type="radio"][value="Afternoon"]'));
  fireEvent.click(form.querySelector('#interest-2'));
  fireEvent.change(form.querySelector('#experienceLevel'), { target: { value: 'intermediate' } });
  fireEvent.submit(form);
  await new Promise((resolve) => setTimeout(resolve, 0));
  const summary = screen.getByTestId('submitted-values').textContent;
  expect(summary).toContain('"sessionTime":"Afternoon"');
  expect(summary).toContain('"2"');
  expect(summary).toContain('"experienceLevel":"intermediate"');
});
```

## Solution

```jsx file=App.jsx
import React from 'react';
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';

const interests = [
  { id: 1, name: 'Coding' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Marketing' },
];

function PreferencesForm() {
  const [submittedValues, setSubmittedValues] = useState(null);

  const initialValues = {
    sessionTime: '',
    interests: [],
    experienceLevel: '',
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
          <Form data-testid="preferences-form">
            <div className="mb-3">
              <label className="form-label">Session Time</label>
              <div>
                <div className="form-check form-check-inline">
                  <Field className="form-check-input" type="radio" name="sessionTime" id="morning" value="Morning" />
                  <label className="form-check-label" htmlFor="morning">Morning</label>
                </div>
                <div className="form-check form-check-inline">
                  <Field className="form-check-input" type="radio" name="sessionTime" id="afternoon" value="Afternoon" />
                  <label className="form-check-label" htmlFor="afternoon">Afternoon</label>
                </div>
                <div className="form-check form-check-inline">
                  <Field className="form-check-input" type="radio" name="sessionTime" id="evening" value="Evening" />
                  <label className="form-check-label" htmlFor="evening">Evening</label>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Interests</label>
              {interests.map((interest) => (
                <div className="form-check" key={interest.id}>
                  <Field
                    type="checkbox"
                    name="interests"
                    value={String(interest.id)}
                    className="form-check-input"
                    id={`interest-${interest.id}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`interest-${interest.id}`}
                  >
                    {interest.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <label htmlFor="experienceLevel" className="form-label">Experience Level</label>
              <Field as="select" className="form-select" id="experienceLevel" name="experienceLevel">
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
              </Field>
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

export default PreferencesForm;
```

## Walkthrough

**Step 1 — describe the fields.** Type:

```jsx
const initialValues = {
  sessionTime: '',
  interests: [],
  experienceLevel: '',
};
```

`sessionTime` and `experienceLevel` start as empty strings, just like a text field. `interests` starts as an empty **array**, because more than one checkbox can be selected at once.

**Step 2 — submit the values.** Type:

```jsx
const handleSubmit = (values, formikHelpers) => {
  setSubmittedValues(values);
  formikHelpers.setSubmitting(false);
};
```

**Step 3 — wire it into `Formik`.** Type:

```jsx
<Formik initialValues={initialValues} onSubmit={handleSubmit}>
```

**Step 4 — build the radio group.** Type three radio `Field`s, all sharing `name="sessionTime"`, each with a different `value`:

```jsx
<Field className="form-check-input" type="radio" name="sessionTime" id="morning" value="Morning" />
<Field className="form-check-input" type="radio" name="sessionTime" id="afternoon" value="Afternoon" />
<Field className="form-check-input" type="radio" name="sessionTime" id="evening" value="Evening" />
```

Because all three share the same `name`, Formik treats them as one group — only one can be selected, and `values.sessionTime` becomes whichever `value` was picked. `Field` figures this out automatically from `type="radio"`.

**Step 5 — build the checkbox group.** Inside the `.map()`, type:

```jsx
<Field
  type="checkbox"
  name="interests"
  value={String(interest.id)}
  className="form-check-input"
  id={`interest-${interest.id}`}
/>
```

This is the same `name` (`interests`) on every checkbox rendered by the `.map()`. Because `initialValues.interests` is an **array**, `Field` knows to push a checkbox's `value` into the array when checked, and remove it when unchecked, instead of overwriting a single value like the radios do.

**Step 6 — build the select.** Type:

```jsx
<Field as="select" className="form-select" id="experienceLevel" name="experienceLevel">
  <option value="">Select Level</option>
  <option value="beginner">Beginner</option>
  <option value="intermediate">Intermediate</option>
</Field>
```

The `as="select"` prop tells `Field` to render a `<select>` element instead of an `<input>`, using whatever children you give it as `<option>`s. `values.experienceLevel` becomes whichever option's `value` is chosen.

**Step 7 — run the tests.** Selecting "Afternoon", checking "Design", and choosing "Intermediate", then submitting, should produce a `values` object containing `sessionTime: "Afternoon"`, `interests: ["2"]`, and `experienceLevel: "intermediate"` — three completely different field types, each handled by the same `Field` component just by changing its props.
