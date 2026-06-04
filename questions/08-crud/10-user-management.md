---
title: User Management (Full CRUD)
---

## Requirements

A user management screen is scaffolded for you: the state, the add-user form (already bound to its inputs), and the list of user cards with **Update** and **Delete** buttons are all implemented and locked.

Your job is to implement the **five functions**:

1. `updateFormField(e)` — a single change handler shared by both inputs. Use the input's `e.target.name` (`"newUserName"` or `"newUserEmail"`) to decide which state to update with `e.target.value`.
2. `addUser()` — if a user is currently being edited (`editedUser` has an `_id`), update that user's `name`/`email`; otherwise append a brand-new user with a unique `_id`. Afterwards, clear the form fields and reset `editedUser` to `{}`.
3. `beginEdit(user)` — load the given user's `name` and `email` into the form fields and remember it in `editedUser` so the edit form shows.
4. `deleteUser(user)` — remove the given user from the list by its `_id`.
5. `renderEditUser()` — render the edit form (two inputs and a **Save** button) when `editedUser` has an `_id`. The inputs should be controlled by the same `newUserName`/`newUserEmail` state and use the same `updateFormField` handler. The **Save** button should call `addUser` (which will handle the update).

> **Hint:** never mutate `users`. Use `[...users, newUser]` to add, `.map()` to update, and `.filter()` to delete.

## Files

```jsx file=App.jsx default
import React from "react";
import { useState } from "react";

export default function App() {
  // @lock
  const [users, setUsers] = useState([
    {
      _id: Math.floor(Math.random() * 10000),
      name: "Jon Snow",
      email: "jonsnow@winterfell.com",
    },
    {
      _id: Math.floor(Math.random() * 10000),
      name: "Ned Stark",
      email: "nedstark@winterfell.com",
    },
    {
      _id: Math.floor(Math.random() * 10000),
      name: "Frodo Baggins",
      email: "frodo@bagend.com",
    },
  ]);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [editedUser, setEditedUser] = useState({});

  function renderAddUser() {
    return (
      <React.Fragment>
        <input
          type="text"
          placeholder="User name"
          value={newUserName}
          onChange={updateFormField}
          name="newUserName"
          data-testid="new-name"
        />
        <input
          type="text"
          placeholder="User email"
          value={newUserEmail}
          onChange={updateFormField}
          name="newUserEmail"
          data-testid="new-email"
        />
        <button data-testid="add" onClick={addUser}>
          Add
        </button>
      </React.Fragment>
    );
  }
  // @endlock

  const addUser = () => {
    // TODO: if editedUser._id exists, update that user; otherwise add a
    // new user with a unique _id. Then clear the form and editedUser.
  };

  const beginEdit = (user) => {
    // TODO: copy the user's name/email into the form fields and store the
    // user in editedUser.
  };

  const deleteUser = (user) => {
    // TODO: remove this user from the list by its _id.
  };

  const updateFormField = (e) => {
    // TODO: update newUserName or newUserEmail based on e.target.name.
  };

  const renderEditUser = () => {
    // TODO: return the edit form (two inputs + Save button) when
    // editedUser has an _id. The Save button should call addUser.
  };

  // @lock
  return (
    <div className="App">
      {users.map((user) => {
        return (
          <React.Fragment key={user._id}>
            <div className="box">
              <h3>{user.name}</h3>
              <h4>{user.email}</h4>
              <button
                data-testid={`edit-${user.email}`}
                onClick={() => {
                  beginEdit(user);
                }}
              >
                Update
              </button>
              <button
                data-testid={`delete-${user.email}`}
                onClick={() => {
                  deleteUser(user);
                }}
              >
                Delete
              </button>
            </div>
          </React.Fragment>
        );
      })}
      {renderEditUser()}
      {renderAddUser()}
    </div>
  );
  // @endlock
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

function typeInto(testid, value) {
  fireEvent.change(screen.getByTestId(testid), { target: { value } });
}

test('renders the initial users', () => {
  render(<App />);
  expect(screen.queryByText('Jon Snow')).toBeTruthy();
  expect(screen.queryByText('Ned Stark')).toBeTruthy();
  expect(screen.queryByText('Frodo Baggins')).toBeTruthy();
});

test('typing in the form updates the inputs (updateFormField)', () => {
  render(<App />);
  typeInto('new-name', 'Samwise');
  typeInto('new-email', 'sam@shire.com');
  expect(screen.getByTestId('new-name').value).toBe('Samwise');
  expect(screen.getByTestId('new-email').value).toBe('sam@shire.com');
});

test('adding a user appends it and clears the form', () => {
  render(<App />);
  typeInto('new-name', 'Samwise');
  typeInto('new-email', 'sam@shire.com');
  fireEvent.click(screen.getByTestId('add'));
  expect(screen.queryByText('Samwise')).toBeTruthy();
  expect(screen.getByTestId('new-name').value).toBe('');
  expect(screen.getByTestId('new-email').value).toBe('');
});

test('deleting a user removes only that user', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('delete-nedstark@winterfell.com'));
  expect(screen.queryByText('Ned Stark')).toBeNull();
  expect(screen.queryByText('Jon Snow')).toBeTruthy();
  expect(screen.queryByText('Frodo Baggins')).toBeTruthy();
});

test('clicking Update shows the edit form with the user loaded', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('edit-jonsnow@winterfell.com'));
  expect(screen.getByTestId('edit-name')).toBeTruthy();
  expect(screen.getByTestId('edit-email')).toBeTruthy();
  expect(screen.getByTestId('edit-name').value).toBe('Jon Snow');
  expect(screen.getByTestId('edit-email').value).toBe('jonsnow@winterfell.com');
});

test('editing then clicking Save updates the existing user', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('edit-jonsnow@winterfell.com'));
  typeInto('edit-name', 'Aegon Targaryen');
  fireEvent.click(screen.getByTestId('save'));
  expect(screen.queryByText('Aegon Targaryen')).toBeTruthy();
  expect(screen.queryByText('Jon Snow')).toBeNull();
  expect(screen.queryByTestId('edit-name')).toBeNull();
});
```

## Solution

```jsx file=App.jsx
import React from "react";
import { useState } from "react";

export default function App() {
  // @lock
  const [users, setUsers] = useState([
    {
      _id: Math.floor(Math.random() * 10000),
      name: "Jon Snow",
      email: "jonsnow@winterfell.com",
    },
    {
      _id: Math.floor(Math.random() * 10000),
      name: "Ned Stark",
      email: "nedstark@winterfell.com",
    },
    {
      _id: Math.floor(Math.random() * 10000),
      name: "Frodo Baggins",
      email: "frodo@bagend.com",
    },
  ]);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [editedUser, setEditedUser] = useState({});

  function renderAddUser() {
    return (
      <React.Fragment>
        <input
          type="text"
          placeholder="User name"
          value={newUserName}
          onChange={updateFormField}
          name="newUserName"
          data-testid="new-name"
        />
        <input
          type="text"
          placeholder="User email"
          value={newUserEmail}
          onChange={updateFormField}
          name="newUserEmail"
          data-testid="new-email"
        />
        <button data-testid="add" onClick={addUser}>
          Add
        </button>
      </React.Fragment>
    );
  }
  // @endlock

  const addUser = () => {
    if (editedUser && editedUser._id) {
      setUsers(
        users.map((user) =>
          user._id === editedUser._id
            ? { ...user, name: newUserName, email: newUserEmail }
            : user,
        ),
      );
    } else {
      setUsers([
        ...users,
        { _id: Date.now(), name: newUserName, email: newUserEmail },
      ]);
    }
    setNewUserName("");
    setNewUserEmail("");
    setEditedUser({});
  };

  const beginEdit = (user) => {
    setEditedUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
  };

  const deleteUser = (user) => {
    setUsers(users.filter((u) => u._id !== user._id));
  };

  const updateFormField = (e) => {
    if (e.target.name === "newUserName") {
      setNewUserName(e.target.value);
    } else if (e.target.name === "newUserEmail") {
      setNewUserEmail(e.target.value);
    }
  };

  const renderEditUser = () => {
    if (!editedUser || !editedUser._id) return null;
    return (
      <React.Fragment>
        <input
          type="text"
          placeholder="User name"
          value={newUserName}
          onChange={updateFormField}
          name="newUserName"
          data-testid="edit-name"
        />
        <input
          type="text"
          placeholder="User email"
          value={newUserEmail}
          onChange={updateFormField}
          name="newUserEmail"
          data-testid="edit-email"
        />
        <button data-testid="save" onClick={addUser}>
          Save
        </button>
      </React.Fragment>
    );
  };

  // @lock
  return (
    <div className="App">
      {users.map((user) => {
        return (
          <React.Fragment key={user._id}>
            <div className="box">
              <h3>{user.name}</h3>
              <h4>{user.email}</h4>
              <button
                data-testid={`edit-${user.email}`}
                onClick={() => {
                  beginEdit(user);
                }}
              >
                Update
              </button>
              <button
                data-testid={`delete-${user.email}`}
                onClick={() => {
                  deleteUser(user);
                }}
              >
                Delete
              </button>
            </div>
          </React.Fragment>
        );
      })}
      {renderAddUser()}
    </div>
  );
  // @endlock
}
```

## Walkthrough

1. **`updateFormField(e)`** is one handler shared by all form inputs. Each input carries a `name` attribute, so `e.target.name` tells the handler which state setter to call. This keeps the form DRY instead of writing a separate handler per field.
2. **`beginEdit(user)`** seeds the form with the chosen user's values and stashes the whole user object in `editedUser`. Because the inputs are controlled, copying into `newUserName`/`newUserEmail` instantly fills the textboxes.
3. **`renderEditUser()`** conditionally renders the edit form when `editedUser` has an `_id`. It returns `null` otherwise, so the form disappears when not editing. The edit form reuses the same controlled inputs and `updateFormField` handler as the add form — this is why we don't need separate state for editing.
4. **`addUser()`** does double duty. When `editedUser._id` exists we are in "edit mode", so it rebuilds the array with `.map()`, replacing only the matching user with `{ ...user, name, email }`. Otherwise it appends a fresh user (using `Date.now()` for a unique `_id`). Either way it clears the form and resets `editedUser` so the next Add starts clean.
5. **`deleteUser(user)`** uses `.filter()` to return a new array without the matching `_id` — never mutating the original list.
6. Every update produces a **new** array or object reference, which is how React knows to re-render.
