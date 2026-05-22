# React Question Bank

A browser-based React practice app: solve questions in a Monaco editor, see a
live preview, and run sandboxed test cases. Pure frontend — no backend, no
database. Solutions are saved to `localStorage`.

## Stack

- **Vite + React 18 + TypeScript** (app shell). Student-facing code is plain JSX.
- **Monaco** editor (`@monaco-editor/react`) with per-file tabs and `useReducer`-driven local buffer state.
- **Sandpack** (`@codesandbox/sandpack-react`) as the in-browser bundler / sandboxed iframe for both the live preview and the test runner.
- **Jotai** for global / persisted state (`atomWithStorage`, `atomFamily` per question).
- **Wouter + jotai-location** — `atomWithLocation` is the source of truth for the URL; `currentQuestionAtom` and the active tab are derived atoms.
- **Tailwind CSS** with `class`-strategy dark mode driven by a `themeAtom`.
- Markdown is rendered by a tiny in-repo renderer (no extra runtime dep).

## Layout

```
questions/            Authored content (.md). Two-level: category/question.
  01-basics/01-hello-world.md
  02-state/01-counter.md
scripts/
  build-questions.mjs Parses MD -> public/questions.json (runs as predev/prebuild)
src/
  app/App.tsx         Shell: loads questions, applies theme, mounts UI
  components/         Sidebar, Topbar, Workspace, EditorPane, PreviewPane, TestRunner, MarkdownView
  sandbox/            RTL shim + test-harness sources injected into the iframe
  state/atoms.ts      All Jotai atoms (route, theme, sidebar, solutions, etc.)
  lib/                types, hash (matches the build script), ai prompt builder
```

## Authoring a question

Single-file form (recommended for short questions):

````md
---
title: Hello World
aliases: []          # optional: prior titles whose hash should map here
---

## Requirements
Render an `<h1>` saying "Hello, world!".

## Files
```jsx file=App.jsx default
export default function App() { return <h1></h1>; }
```

## Tests
```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders heading', () => {
  render(<App />);
  expect(screen.getByRole('heading')).toHaveTextContent('Hello, world!');
});
```

## Solution
```jsx file=App.jsx
export default function App() { return <h1>Hello, world!</h1>; }
```

## Walkthrough
1. ...
````

Folder form (for multi-file questions): create a directory containing
`question.md` plus optional `files/`, `tests/`, and `solution/` siblings.

### How IDs work

Each question's stable ID is `djb2(slugify(title))` (8 hex chars). Saved
solutions live in `localStorage` under `qb:v1:solution:<id>`. **Reordering**
files or renaming category folders never breaks saves. If you ever **rename a
question's title**, add the old title to the `aliases:` front-matter array so
the old hash continues to resolve.

### The `./__rtl__.js` import

Tests import `render`, `screen`, `fireEvent` from `./__rtl__.js`. This is a
~60-line React-Testing-Library-ish shim that the app injects into the Sandpack
iframe at runtime. Supported APIs:

- `render(ui)` → `{ container, rerender, unmount }`
- `screen.getByRole(role, { name })` — `heading`, `button`, `link`, `textbox`, `checkbox`
- `screen.getByText(text)`, `screen.queryByText`
- `screen.getByTestId(id)`, `screen.queryByTestId`
- `fireEvent.click(el)`, `fireEvent.change(el, {target:{value}})`, `fireEvent.submit`, `fireEvent.keyDown`
- Tiny `test(name, fn)` / `expect(actual)` framework (matchers: `toBe`, `toEqual`, `toBeTruthy`, `toBeFalsy`, `toBeNull`, `toContain`, `toHaveTextContent`, `toHaveAttribute`)

If you need a missing matcher, edit `src/sandbox/testHarness.ts`. If you need
real `@testing-library/react`, you can add it via Sandpack `customSetup.dependencies`
in `TestRunner.tsx` — at the cost of a slower first test run while the
in-iframe bundler installs it.

## Scripts

```
npm run dev               # builds questions.json, starts Vite dev server on http://127.0.0.1:4173
npm run build:questions   # regenerates public/questions.json from questions/
npm run build             # type-check + production build
npm run preview           # serve the production build
```

The dev server listens on port **4173** because the default 5173 falls inside
this machine's Windows port-exclusion range. Change it in `vite.config.ts` if
needed.

## Status / known follow-ups

- **Self-hosted Sandpack bundler** — the plan locked in self-hosting, but the
  initial build ships with the default hosted bundler so we can verify the
  rest works end-to-end first. To self-host, vendor
  `@codesandbox/sandpack-bundler` static assets into `public/sandpack-bundler/`
  and pass `bundlerURL="/sandpack-bundler/"` on every `SandpackProvider`.
- **Hot-reload of `.md` files** in dev would be nice; currently you need to
  re-run `npm run build:questions` (or restart `npm run dev`) after editing
  authored questions.
- The `./__rtl__.js` shim is intentionally minimal — extend as your question
  set grows.
