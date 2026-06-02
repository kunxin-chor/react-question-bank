---
title: Inline Style — Card Layout
---

## Requirements

Render a `<section>` containing the text `Profile card` and apply an inline style with **all** of the following CSS properties:

- `background-color`: `whitesmoke`
- `border`: `1px solid gray`
- `padding`: `24px`
- `margin-top`: `12px`
- `text-align`: `center`

> **Heads up:** CSS property names with dashes need to be camelCased in a JSX style object.

## Files

```jsx file=App.jsx default
export default function App() {
  return <section>Profile card</section>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the text "Profile card"', () => {
  const { container } = render(<App />);
  const s = container.querySelector('section');
  expect(s).toHaveTextContent('Profile card');
});

test('applies all five inline styles', () => {
  const { container } = render(<App />);
  const s = container.querySelector('section');
  expect(s.style.backgroundColor).toBe('whitesmoke');
  expect(s.style.border).toBe('1px solid gray');
  expect(s.style.padding).toBe('24px');
  expect(s.style.marginTop).toBe('12px');
  expect(s.style.textAlign).toBe('center');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return (
    <section
      style={{
        backgroundColor: 'whitesmoke',
        border: '1px solid gray',
        padding: '24px',
        marginTop: '12px',
        textAlign: 'center',
      }}
    >
      Profile card
    </section>
  );
}
```

## Walkthrough

1. The style object is a plain JavaScript object — add as many properties as you need.
2. Dashed CSS names (`background-color`, `margin-top`, `text-align`) become camelCase keys.
3. Values are strings with units; for length numbers you could also pass bare numbers and React would append `px`.
