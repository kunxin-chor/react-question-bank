---
title: Update an Item with a Dialog
---

## Requirements

The `App` component shows a list of products. Each row has an **Edit** button that opens a popup dialog (`role="dialog"`) pre-filled with that product's name. Most of the wiring is **already implemented and locked** — the list, the Edit buttons, the open/close logic, the **Save** and **Cancel** buttons.

Your job is just two things:

1. **Bind the dialog input.** The `<input data-testid="edit-name">` must be a controlled input tied to the `draftName` state: set its `value` to `draftName` and update `draftName` from its `onChange`.
2. **Implement `handleSave`.** Replace the product whose `id` equals `editingId` with a copy that uses the new `draftName`, then close the dialog by calling `closeEdit()`.

> **Hint:** use `.map()` to build a **new** array, swapping in `{ ...product, name: draftName }` for the matching row.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const initialProducts = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Camera' },
    { id: 3, name: 'Tablet' },
  ];
  // @endlock

  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState('');

  // @lock
  const openEdit = (product) => {
    setEditingId(product.id);
    setDraftName(product.name);
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const editingProduct = products.find((product) => product.id === editingId);
  // @endlock

  const handleSave = () => {
    // TODO: build a new products array where the product with
    // id === editingId has its name replaced by draftName, then
    // call closeEdit() to dismiss the dialog.
  };

  return (
    <div>
      {/* @lock */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <button data-testid={`edit-${product.id}`} onClick={() => openEdit(product)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      {/* @endlock */}

      {editingProduct && (
        <div role="dialog" data-testid="edit-dialog">
          <h2>Edit Product</h2>
          <input
            data-testid="edit-name"
            type="text"
            /* bind value + onChange to draftName */
          />
          {/* @lock */}
          <button data-testid="save" onClick={handleSave}>
            Save
          </button>
          <button data-testid="cancel" onClick={closeEdit}>
            Cancel
          </button>
          {/* @endlock */}
        </div>
      )}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('does not show the dialog initially', () => {
  render(<App />);
  expect(screen.queryByTestId('edit-dialog')).toBeNull();
});

test('clicking Edit opens the dialog prefilled with the product name', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('edit-1'));
  expect(screen.getByTestId('edit-dialog')).toBeTruthy();
  expect(screen.getByTestId('edit-name').value).toBe('Laptop');
});

test('editing the name and saving updates that product in the list', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByTestId('edit-2'));
  fireEvent.change(screen.getByTestId('edit-name'), { target: { value: 'Webcam' } });
  fireEvent.click(screen.getByTestId('save'));
  const text = container.textContent || '';
  expect(text.indexOf('Webcam') !== -1).toBeTruthy();
  expect(text.indexOf('Camera')).toBe(-1);
});

test('saving closes the dialog', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('edit-1'));
  fireEvent.change(screen.getByTestId('edit-name'), { target: { value: 'Notebook' } });
  fireEvent.click(screen.getByTestId('save'));
  expect(screen.queryByTestId('edit-dialog')).toBeNull();
});

test('only the edited product changes', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByTestId('edit-1'));
  fireEvent.change(screen.getByTestId('edit-name'), { target: { value: 'Notebook' } });
  fireEvent.click(screen.getByTestId('save'));
  const text = container.textContent || '';
  expect(text.indexOf('Notebook') !== -1).toBeTruthy();
  expect(text.indexOf('Camera') !== -1).toBeTruthy();
  expect(text.indexOf('Tablet') !== -1).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const initialProducts = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Camera' },
    { id: 3, name: 'Tablet' },
  ];
  // @endlock

  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState('');

  // @lock
  const openEdit = (product) => {
    setEditingId(product.id);
    setDraftName(product.name);
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const editingProduct = products.find((product) => product.id === editingId);
  // @endlock

  const handleSave = () => {
    setProducts(
      products.map((product) =>
        product.id === editingId ? { ...product, name: draftName } : product,
      ),
    );
    closeEdit();
  };

  return (
    <div>
      {/* @lock */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <button data-testid={`edit-${product.id}`} onClick={() => openEdit(product)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      {/* @endlock */}

      {editingProduct && (
        <div role="dialog" data-testid="edit-dialog">
          <h2>Edit Product</h2>
          <input
            data-testid="edit-name"
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
          />
          {/* @lock */}
          <button data-testid="save" onClick={handleSave}>
            Save
          </button>
          <button data-testid="cancel" onClick={closeEdit}>
            Cancel
          </button>
          {/* @endlock */}
        </div>
      )}
    </div>
  );
}
```

## Walkthrough

1. The dialog only renders when `editingProduct` is found, which happens after `openEdit` stores an `editingId`. That logic is locked, so you can focus on the form.
2. **Binding the input:** a controlled input needs both halves — `value={draftName}` makes React the source of truth, and `onChange={(e) => setDraftName(e.target.value)}` feeds each keystroke back into state. Without `onChange` the field would appear frozen.
3. **Saving:** `handleSave` rebuilds the list with `.map()`. For the row whose `id` matches `editingId`, it returns a copy `{ ...product, name: draftName }`; every other row is returned unchanged. This never mutates the original array.
4. Calling `closeEdit()` resets `editingId` to `null`, so `editingProduct` becomes `undefined` and the dialog unmounts.
