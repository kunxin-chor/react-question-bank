// Source for the in-sandbox React-Testing-Library shim.
// This file is injected verbatim into the Sandpack iframe as `__rtl__.js`.
// It must be self-contained ESM that can run with React 18 already bundled.
//
// Exports: render, screen, fireEvent, cleanup
// Plus a tiny test runner registered as globals: `test`, `expect`.

export const RTL_SHIM_SOURCE = /* js */ `
import React from 'react';
import { createRoot } from 'react-dom/client';

// React 18.3 moved act() onto the React namespace; the old
// react-dom/test-utils import emits a deprecation warning.
const act = React.act || ((cb) => { const r = cb(); return r && typeof r.then === 'function' ? r : Promise.resolve(); });

// Tell React this is a test environment so act() warnings go away.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let _container = null;
let _root = null;

export function cleanup() {
  if (_root) {
    act(() => _root.unmount());
    _root = null;
  }
  if (_container && _container.parentNode) {
    _container.parentNode.removeChild(_container);
  }
  _container = null;
}

export function render(ui) {
  cleanup();
  _container = document.createElement('div');
  document.body.appendChild(_container);
  _root = createRoot(_container);
  act(() => { _root.render(ui); });
  return {
    container: _container,
    rerender: (next) => act(() => { _root.render(next); }),
    unmount:  () => cleanup(),
  };
}

function getRoot() {
  if (!_container) throw new Error('No component rendered. Call render() first.');
  return _container;
}

function asArray(nodeList) { return Array.prototype.slice.call(nodeList); }
function textOf(el) { return (el.textContent || '').trim(); }

export const screen = {
  getByText(text) {
    const all = asArray(getRoot().querySelectorAll('*'))
      .filter(el => el.children.length === 0 && textOf(el) === (typeof text === 'string' ? text : ''));
    if (!all.length) throw new Error('Unable to find element with text: ' + text);
    return all[0];
  },
  queryByText(text) {
    const all = asArray(getRoot().querySelectorAll('*'))
      .filter(el => el.children.length === 0 && textOf(el) === text);
    return all[0] || null;
  },
  getByTestId(id) {
    const el = getRoot().querySelector('[data-testid="' + id + '"]');
    if (!el) throw new Error('Unable to find element with data-testid: ' + id);
    return el;
  },
  queryByTestId(id) {
    return getRoot().querySelector('[data-testid="' + id + '"]');
  },
  getByRole(role, opts = {}) {
    const roleMap = {
      heading: ['h1','h2','h3','h4','h5','h6'],
      button:  ['button', '[role="button"]'],
      link:    ['a[href]', '[role="link"]'],
      textbox: ['input:not([type="checkbox"]):not([type="radio"])', 'textarea', '[role="textbox"]'],
      checkbox: ['input[type="checkbox"]', '[role="checkbox"]'],
    };
    const sel = (roleMap[role] || ['[role="' + role + '"]']).join(',');
    const candidates = asArray(getRoot().querySelectorAll(sel));
    const matches = opts.name
      ? candidates.filter(el => textOf(el) === opts.name || el.getAttribute('aria-label') === opts.name)
      : candidates;
    if (!matches.length) throw new Error('Unable to find role: ' + role + (opts.name ? ' (name: ' + opts.name + ')' : ''));
    return matches[0];
  },
  getAllByRole(role) {
    const sel = '[role="' + role + '"]';
    return asArray(getRoot().querySelectorAll(sel));
  },
  debug() { console.log(getRoot().innerHTML); },
};

// React 18 replaces the input's "value"/"checked" property with its own
// setter that also updates an internal change tracker. If we assign
// el.value = x directly, that tracker is updated too, so when the input
// event fires React thinks the value did NOT change and skips onChange.
// To make controlled inputs fire onChange we must write through the
// ORIGINAL native setter, leaving React's tracker holding the old value.
function setNativeValue(el, prop, value) {
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype :
    el instanceof HTMLSelectElement ? HTMLSelectElement.prototype :
    HTMLInputElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, prop);
  if (desc && desc.set) desc.set.call(el, value);
  else el[prop] = value;
}

export const fireEvent = {
  click(el)  { act(() => { el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); },
  change(el, opts) {
    act(() => {
      if (opts && opts.target && 'value' in opts.target) {
        setNativeValue(el, 'value', opts.target.value);
      }
      if (opts && opts.target && 'checked' in opts.target) {
        setNativeValue(el, 'checked', opts.target.checked);
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  },
  submit(el) { act(() => { el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }); },
  keyDown(el, opts={}) { act(() => { el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...opts })); }); },
};
`;
