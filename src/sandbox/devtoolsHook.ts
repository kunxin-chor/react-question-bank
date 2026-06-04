// Source for the in-sandbox React DevTools-style hook.
// This file is injected verbatim into the Sandpack iframe as `__devtools__.js`
// and MUST be imported before React so that `__REACT_DEVTOOLS_GLOBAL_HOOK__`
// exists when react-dom calls injectInternals().
//
// It implements the minimal hook interface react-dom expects, walks the fiber
// tree on every commit, serializes a lightweight component tree, and posts it
// to the parent window via postMessage.

export const DEVTOOLS_HOOK_SOURCE = /* js */ `
(function () {
  var existingHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  var MAX_NODES = 4000;
  var renderers = new Map();
  var uid = 0;
  var scheduled = false;
  var lastRoot = null;

  function post(children) {
    try {
      window.parent.postMessage(
        { source: 'qb-devtools', type: 'commit', tree: children },
        '*'
      );
    } catch (e) {}
  }

  function isHost(fiber) { return fiber.tag === 5; }

  // Resolve a human-readable name for a fiber, or null if the fiber should be
  // skipped (its children are bubbled up to the parent).
  function getName(fiber) {
    var type = fiber.type;
    switch (fiber.tag) {
      case 5: // HostComponent (DOM element)
        return typeof type === 'string' ? type : 'host';
      case 6: // HostText
        return null;
      case 3: // HostRoot
      case 4: // HostPortal
      case 8: // Mode
      case 9: // ContextConsumer
      case 10: // ContextProvider
      case 12: // Profiler
        return null;
      case 7: // Fragment
        return null;
      case 0: // FunctionComponent
      case 1: // ClassComponent
      case 2: // IndeterminateComponent
        return type ? (type.displayName || type.name || 'Anonymous') : 'Component';
      case 11: { // ForwardRef
        var r = type && type.render;
        return (type && type.displayName) || (r && (r.displayName || r.name)) || 'ForwardRef';
      }
      case 13: // SuspenseComponent
        return 'Suspense';
      case 14: // MemoComponent
      case 15: { // SimpleMemoComponent
        var inner = type && (type.type || type.render || type);
        return (inner && (inner.displayName || inner.name)) || 'Memo';
      }
      case 16: // LazyComponent
        return 'Lazy';
      default:
        return null;
    }
  }

  function serializeProps(props) {
    var out = {};
    if (!props || typeof props !== 'object') return out;
    var keys = Object.keys(props);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k === 'children') continue;
      var v = props[k];
      var t = typeof v;
      if (v === null || v === undefined) out[k] = String(v);
      else if (t === 'string' || t === 'number' || t === 'boolean') out[k] = v;
      else if (t === 'function') out[k] = 'function';
      else if (Array.isArray(v)) out[k] = 'Array(' + v.length + ')';
      else if (t === 'object') out[k] = 'object';
      else out[k] = String(v);
    }
    return out;
  }

  function serializeState(fiber) {
    var out = {};
    if (!fiber) return out;
    var memoizedState = fiber.memoizedState;
    if (!memoizedState) return out;

    // Handle different state types (useState, useReducer, useRef, etc.)
    var current = memoizedState;
    var index = 0;
    while (current) {
      var value = current;
      // For useState/useReducer, the value is in the memoizedState property
      if (current.memoizedState !== undefined) {
        value = current.memoizedState;
      }
      // For useRef, the value is in the current property
      else if (current.current !== undefined) {
        value = current.current;
      }

      var t = typeof value;
      if (value === null || value === undefined) {
        out['state' + (index || '')] = String(value);
      } else if (t === 'string' || t === 'number' || t === 'boolean') {
        out['state' + (index || '')] = value;
      } else if (t === 'function') {
        out['state' + (index || '')] = 'function';
      } else if (Array.isArray(value)) {
        out['state' + (index || '')] = 'Array(' + value.length + ')';
      } else if (t === 'object') {
        // Try to serialize simple objects
        try {
          out['state' + (index || '')] = JSON.stringify(value);
        } catch (e) {
          out['state' + (index || '')] = 'object';
        }
      } else {
        out['state' + (index || '')] = String(value);
      }

      current = current.next;
      index++;
    }
    return out;
  }

  function buildChildren(fiber, counter) {
    var nodes = [];
    var child = fiber.child;
    while (child) {
      var built = buildNode(child, counter);
      for (var i = 0; i < built.length; i++) nodes.push(built[i]);
      child = child.sibling;
    }
    return nodes;
  }

  function buildNode(fiber, counter) {
    if (counter.n >= MAX_NODES) return [];
    var name = getName(fiber);
    var children = buildChildren(fiber, counter);
    if (name === null) return children; // skip, bubble children up
    counter.n++;
    return [{
      name: name,
      kind: isHost(fiber) ? 'host' : 'component',
      props: serializeProps(fiber.memoizedProps),
      state: isHost(fiber) ? {} : serializeState(fiber),
      children: children,
    }];
  }

  function flush() {
    scheduled = false;
    if (!lastRoot) return;
    try {
      var current = lastRoot.current;
      if (!current) { post([]); return; }
      post(buildChildren(current, { n: 0 }));
    } catch (e) {
      post([]);
    }
  }

  function schedule(root) {
    lastRoot = root;
    if (scheduled) return;
    scheduled = true;
    setTimeout(flush, 80);
  }

  var hook = {
    isDisabled: false,
    supportsFiber: true,
    renderers: renderers,
    inject: function (renderer) {
      var id = ++uid;
      renderers.set(id, renderer);
      return id;
    },
    onCommitFiberRoot: function (id, root) {
      schedule(root);
      if (existingHook && existingHook.onCommitFiberRoot) {
        existingHook.onCommitFiberRoot(id, root);
      }
    },
    onPostCommitFiberRoot: function () {
      if (existingHook && existingHook.onPostCommitFiberRoot) {
        existingHook.onPostCommitFiberRoot();
      }
    },
    onCommitFiberUnmount: function () {
      if (existingHook && existingHook.onCommitFiberUnmount) {
        existingHook.onCommitFiberUnmount();
      }
    },
    checkDCE: function () {
      if (existingHook && existingHook.checkDCE) {
        return existingHook.checkDCE();
      }
    },
    on: function () {
      if (existingHook && existingHook.on) {
        return existingHook.on.apply(existingHook, arguments);
      }
    },
    off: function () {
      if (existingHook && existingHook.off) {
        return existingHook.off.apply(existingHook, arguments);
      }
    },
    sub: function () {
      if (existingHook && existingHook.sub) {
        return existingHook.sub.apply(existingHook, arguments);
      }
      return function () {};
    },
    emit: function () {
      if (existingHook && existingHook.emit) {
        return existingHook.emit.apply(existingHook, arguments);
      }
    },
    getFiberRoots: function () {
      if (existingHook && existingHook.getFiberRoots) {
        return existingHook.getFiberRoots();
      }
      return new Set();
    },
  };

  Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    value: hook,
    configurable: true,
    enumerable: false,
    writable: false,
  });
})();
`;
