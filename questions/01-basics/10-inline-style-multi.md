---
title: Inline Style — Multiple Properties
---

## Requirements

Render a `<div>` containing the text `Styled box` and apply an inline style with **all** of the following CSS properties:

- `background-color`: `lightblue`
- `color`: `darkblue`
- `padding`: `16px`
- `border-radius`: `8px`

> **Heads up:** CSS property names with dashes need to be written differently in a JSX style object.

## Files

```jsx file=App.jsx default
export default function App() {
  return <div>Styled box</div>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the text "Styled box"', () => {
  const { container } = render(<App />);
  const div = container.querySelector('div');
  expect(div).toHaveTextContent('Styled box');
});

test('applies all four inline styles', () => {
  const { container } = render(<App />);
  const div = container.querySelector('div');
  expect(div.style.backgroundColor).toBe('lightblue');
  expect(div.style.color).toBe('darkblue');
  expect(div.style.padding).toBe('16px');
  expect(div.style.borderRadius).toBe('8px');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return (
    <div
      style={{
        backgroundColor: 'lightblue',
        color: 'darkblue',
        padding: '16px',
        borderRadius: '8px',
      }}
    >
      Styled box
    </div>
  );
}
```

## Walkthrough

1. The style object can hold as many properties as you like — it's a plain JavaScript object.
2. Multi-word CSS properties (`background-color`, `border-radius`) become camelCase (`backgroundColor`, `borderRadius`).
3. Values are strings, including units (`'16px'`, `'8px'`).
4. For readability, place each property on its own line when there are several.
