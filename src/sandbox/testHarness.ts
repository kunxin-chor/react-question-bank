// Sources that get injected into the Sandpack iframe to run tests.
// The harness defines minimal `test`/`expect` globals, imports the user's
// test file, then posts results back to the parent window.

export const TEST_GLOBALS_SOURCE = /* js */ `
// __test_globals__.js — tiny test framework registered as window globals.
// Also installs error handlers BEFORE the user test module evaluates so
// any uncaught import-time error is reported instead of hanging silently.

window.addEventListener('error', (e) => {
  try {
    window.parent.postMessage({
      type: 'qb:test-results',
      results: [{ name: '(uncaught error)', passed: false, error: String(e.message || e.error || e) }]
    }, '*');
  } catch {}
});
window.addEventListener('unhandledrejection', (e) => {
  try {
    window.parent.postMessage({
      type: 'qb:test-results',
      results: [{ name: '(unhandled rejection)', passed: false, error: String(e.reason && e.reason.message || e.reason || e) }]
    }, '*');
  } catch {}
});

const __results = [];
const __queue   = [];

window.test = function test(name, fn) {
  __queue.push({ name, fn });
};
window.it = window.test;

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every(k => deepEqual(a[k], b[k]));
  }
  return false;
}

window.expect = function expect(actual) {
  const api = {
    toBe(expected) {
      if (actual !== expected) throw new Error('Expected ' + JSON.stringify(actual) + ' toBe ' + JSON.stringify(expected));
    },
    toEqual(expected) {
      if (!deepEqual(actual, expected)) throw new Error('Expected ' + JSON.stringify(actual) + ' toEqual ' + JSON.stringify(expected));
    },
    toBeTruthy() { if (!actual) throw new Error('Expected value to be truthy, got ' + JSON.stringify(actual)); },
    toBeFalsy()  { if ( actual) throw new Error('Expected value to be falsy, got '   + JSON.stringify(actual)); },
    toBeNull()   { if (actual !== null) throw new Error('Expected null, got ' + JSON.stringify(actual)); },
    toContain(needle) {
      const ok = (typeof actual === 'string' || Array.isArray(actual)) && actual.indexOf(needle) !== -1;
      if (!ok) throw new Error('Expected ' + JSON.stringify(actual) + ' toContain ' + JSON.stringify(needle));
    },
    toHaveTextContent(text) {
      const t = (actual && actual.textContent || '').trim();
      const ok = text instanceof RegExp ? text.test(t) : t === text || t.indexOf(text) !== -1;
      if (!ok) throw new Error('Expected element textContent ' + JSON.stringify(t) + ' to match ' + JSON.stringify(String(text)));
    },
    toHaveAttribute(name, value) {
      if (!actual || actual.getAttribute(name) !== value) {
        throw new Error('Expected element to have attribute ' + name + '="' + value + '", got "' + (actual && actual.getAttribute(name)) + '"');
      }
    },
    not: null,
  };
  api.not = {
    toBe(expected) { if (actual === expected) throw new Error('Expected not.toBe ' + JSON.stringify(expected)); },
    toBeTruthy()   { if ( actual) throw new Error('Expected not.toBeTruthy, got truthy'); },
    toBeFalsy()    { if (!actual) throw new Error('Expected not.toBeFalsy, got falsy'); },
  };
  return api;
};

window.__runTests = async function __runTests() {
  for (const { name, fn } of __queue) {
    try {
      await fn();
      __results.push({ name, passed: true });
    } catch (e) {
      __results.push({ name, passed: false, error: String(e && e.message || e) });
    }
    // best-effort cleanup between tests
    try {
      const rtl = await import('./__rtl__.js');
      if (rtl && typeof rtl.cleanup === 'function') rtl.cleanup();
    } catch {}
  }
  window.parent.postMessage({ type: 'qb:test-results', results: __results }, '*');
};
`;

// Entry file that loads globals, the test source, then triggers the run.
// The user's test code is concatenated as a second module via a dynamic
// import of './__user_tests__.js'.
// IMPORTANT: static imports — order matters.
// 1. __test_globals__ installs window.test / expect / __runTests
// 2. user tests evaluate and call window.test(...) to register cases
// 3. index.js body then triggers the run.
// Any error during module evaluation is caught by window.onerror and reported.
// Entry: imports are hoisted and evaluated in source order, so __test_globals__
// runs first (installing error handlers + window.test/expect), then the user
// test module evaluates (registering test cases). After both are done the
// module body executes and triggers the run.
export const TEST_ENTRY_SOURCE = /* js */ `
import './__test_globals__.js';
import './__user_tests__.js';

// Mount point for tests that render components.
const rootEl = document.createElement('div');
rootEl.id = 'root';
document.body.appendChild(rootEl);

// Visible status banner inside the iframe so the user can see progress.
const banner = document.createElement('div');
banner.style.cssText = 'padding:12px;font:13px system-ui,sans-serif;color:#333;background:#f5f5f5;border-bottom:1px solid #ddd';
banner.textContent = 'Running tests…';
document.body.insertBefore(banner, document.body.firstChild);

Promise.resolve().then(() => {
  try {
    return window.__runTests();
  } catch (err) {
    window.parent.postMessage({
      type: 'qb:test-results',
      results: [{ name: '(run error)', passed: false, error: String(err && err.message || err) }]
    }, '*');
  }
});
`;
