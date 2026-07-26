var Gf = Object.defineProperty;
var Jf = (m, v, c) => v in m ? Gf(m, v, { enumerable: !0, configurable: !0, writable: !0, value: c }) : m[v] = c;
var Rt = (m, v, c) => Jf(m, typeof v != "symbol" ? v + "" : v, c);
function Ga(m) {
  return m && m.__esModule && Object.prototype.hasOwnProperty.call(m, "default") ? m.default : m;
}
var Oi = { exports: {} }, Rr = {}, Mi = { exports: {} }, Y = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ra;
function qf() {
  if (Ra) return Y;
  Ra = 1;
  var m = Symbol.for("react.element"), v = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), P = Symbol.for("react.strict_mode"), $ = Symbol.for("react.profiler"), W = Symbol.for("react.provider"), ne = Symbol.for("react.context"), X = Symbol.for("react.forward_ref"), V = Symbol.for("react.suspense"), he = Symbol.for("react.memo"), fe = Symbol.for("react.lazy"), oe = Symbol.iterator;
  function Z(f) {
    return f === null || typeof f != "object" ? null : (f = oe && f[oe] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var Me = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, je = Object.assign, q = {};
  function b(f, g, H) {
    this.props = f, this.context = g, this.refs = q, this.updater = H || Me;
  }
  b.prototype.isReactComponent = {}, b.prototype.setState = function(f, g) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, g, "setState");
  }, b.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function ee() {
  }
  ee.prototype = b.prototype;
  function et(f, g, H) {
    this.props = f, this.context = g, this.refs = q, this.updater = H || Me;
  }
  var tt = et.prototype = new ee();
  tt.constructor = et, je(tt, b.prototype), tt.isPureReactComponent = !0;
  var Ee = Array.isArray, He = Object.prototype.hasOwnProperty, ye = { current: null }, le = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Se(f, g, H) {
    var K, y = {}, N = null, z = null;
    if (g != null) for (K in g.ref !== void 0 && (z = g.ref), g.key !== void 0 && (N = "" + g.key), g) He.call(g, K) && !le.hasOwnProperty(K) && (y[K] = g[K]);
    var A = arguments.length - 2;
    if (A === 1) y.children = H;
    else if (1 < A) {
      for (var E = Array(A), U = 0; U < A; U++) E[U] = arguments[U + 2];
      y.children = E;
    }
    if (f && f.defaultProps) for (K in A = f.defaultProps, A) y[K] === void 0 && (y[K] = A[K]);
    return { $$typeof: m, type: f, key: N, ref: z, props: y, _owner: ye.current };
  }
  function ht(f, g) {
    return { $$typeof: m, type: f.type, key: g, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function Qe(f) {
    return typeof f == "object" && f !== null && f.$$typeof === m;
  }
  function Ke(f) {
    var g = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(H) {
      return g[H];
    });
  }
  var nt = /\/+/g;
  function Ce(f, g) {
    return typeof f == "object" && f !== null && f.key != null ? Ke("" + f.key) : g.toString(36);
  }
  function Ye(f, g, H, K, y) {
    var N = typeof f;
    (N === "undefined" || N === "boolean") && (f = null);
    var z = !1;
    if (f === null) z = !0;
    else switch (N) {
      case "string":
      case "number":
        z = !0;
        break;
      case "object":
        switch (f.$$typeof) {
          case m:
          case v:
            z = !0;
        }
    }
    if (z) return z = f, y = y(z), f = K === "" ? "." + Ce(z, 0) : K, Ee(y) ? (H = "", f != null && (H = f.replace(nt, "$&/") + "/"), Ye(y, g, H, "", function(U) {
      return U;
    })) : y != null && (Qe(y) && (y = ht(y, H + (!y.key || z && z.key === y.key ? "" : ("" + y.key).replace(nt, "$&/") + "/") + f)), g.push(y)), 1;
    if (z = 0, K = K === "" ? "." : K + ":", Ee(f)) for (var A = 0; A < f.length; A++) {
      N = f[A];
      var E = K + Ce(N, A);
      z += Ye(N, g, H, E, y);
    }
    else if (E = Z(f), typeof E == "function") for (f = E.call(f), A = 0; !(N = f.next()).done; ) N = N.value, E = K + Ce(N, A++), z += Ye(N, g, H, E, y);
    else if (N === "object") throw g = String(f), Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
    return z;
  }
  function Fe(f, g, H) {
    if (f == null) return f;
    var K = [], y = 0;
    return Ye(f, K, "", "", function(N) {
      return g.call(H, N, y++);
    }), K;
  }
  function De(f) {
    if (f._status === -1) {
      var g = f._result;
      g = g(), g.then(function(H) {
        (f._status === 0 || f._status === -1) && (f._status = 1, f._result = H);
      }, function(H) {
        (f._status === 0 || f._status === -1) && (f._status = 2, f._result = H);
      }), f._status === -1 && (f._status = 0, f._result = g);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var ae = { current: null }, C = { transition: null }, I = { ReactCurrentDispatcher: ae, ReactCurrentBatchConfig: C, ReactCurrentOwner: ye };
  function j() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Y.Children = { map: Fe, forEach: function(f, g, H) {
    Fe(f, function() {
      g.apply(this, arguments);
    }, H);
  }, count: function(f) {
    var g = 0;
    return Fe(f, function() {
      g++;
    }), g;
  }, toArray: function(f) {
    return Fe(f, function(g) {
      return g;
    }) || [];
  }, only: function(f) {
    if (!Qe(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, Y.Component = b, Y.Fragment = c, Y.Profiler = $, Y.PureComponent = et, Y.StrictMode = P, Y.Suspense = V, Y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = I, Y.act = j, Y.cloneElement = function(f, g, H) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var K = je({}, f.props), y = f.key, N = f.ref, z = f._owner;
    if (g != null) {
      if (g.ref !== void 0 && (N = g.ref, z = ye.current), g.key !== void 0 && (y = "" + g.key), f.type && f.type.defaultProps) var A = f.type.defaultProps;
      for (E in g) He.call(g, E) && !le.hasOwnProperty(E) && (K[E] = g[E] === void 0 && A !== void 0 ? A[E] : g[E]);
    }
    var E = arguments.length - 2;
    if (E === 1) K.children = H;
    else if (1 < E) {
      A = Array(E);
      for (var U = 0; U < E; U++) A[U] = arguments[U + 2];
      K.children = A;
    }
    return { $$typeof: m, type: f.type, key: y, ref: N, props: K, _owner: z };
  }, Y.createContext = function(f) {
    return f = { $$typeof: ne, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: W, _context: f }, f.Consumer = f;
  }, Y.createElement = Se, Y.createFactory = function(f) {
    var g = Se.bind(null, f);
    return g.type = f, g;
  }, Y.createRef = function() {
    return { current: null };
  }, Y.forwardRef = function(f) {
    return { $$typeof: X, render: f };
  }, Y.isValidElement = Qe, Y.lazy = function(f) {
    return { $$typeof: fe, _payload: { _status: -1, _result: f }, _init: De };
  }, Y.memo = function(f, g) {
    return { $$typeof: he, type: f, compare: g === void 0 ? null : g };
  }, Y.startTransition = function(f) {
    var g = C.transition;
    C.transition = {};
    try {
      f();
    } finally {
      C.transition = g;
    }
  }, Y.unstable_act = j, Y.useCallback = function(f, g) {
    return ae.current.useCallback(f, g);
  }, Y.useContext = function(f) {
    return ae.current.useContext(f);
  }, Y.useDebugValue = function() {
  }, Y.useDeferredValue = function(f) {
    return ae.current.useDeferredValue(f);
  }, Y.useEffect = function(f, g) {
    return ae.current.useEffect(f, g);
  }, Y.useId = function() {
    return ae.current.useId();
  }, Y.useImperativeHandle = function(f, g, H) {
    return ae.current.useImperativeHandle(f, g, H);
  }, Y.useInsertionEffect = function(f, g) {
    return ae.current.useInsertionEffect(f, g);
  }, Y.useLayoutEffect = function(f, g) {
    return ae.current.useLayoutEffect(f, g);
  }, Y.useMemo = function(f, g) {
    return ae.current.useMemo(f, g);
  }, Y.useReducer = function(f, g, H) {
    return ae.current.useReducer(f, g, H);
  }, Y.useRef = function(f) {
    return ae.current.useRef(f);
  }, Y.useState = function(f) {
    return ae.current.useState(f);
  }, Y.useSyncExternalStore = function(f, g, H) {
    return ae.current.useSyncExternalStore(f, g, H);
  }, Y.useTransition = function() {
    return ae.current.useTransition();
  }, Y.version = "18.3.1", Y;
}
var za;
function Ai() {
  return za || (za = 1, Mi.exports = qf()), Mi.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var La;
function Zf() {
  if (La) return Rr;
  La = 1;
  var m = Ai(), v = Symbol.for("react.element"), c = Symbol.for("react.fragment"), P = Object.prototype.hasOwnProperty, $ = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, W = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ne(X, V, he) {
    var fe, oe = {}, Z = null, Me = null;
    he !== void 0 && (Z = "" + he), V.key !== void 0 && (Z = "" + V.key), V.ref !== void 0 && (Me = V.ref);
    for (fe in V) P.call(V, fe) && !W.hasOwnProperty(fe) && (oe[fe] = V[fe]);
    if (X && X.defaultProps) for (fe in V = X.defaultProps, V) oe[fe] === void 0 && (oe[fe] = V[fe]);
    return { $$typeof: v, type: X, key: Z, ref: Me, props: oe, _owner: $.current };
  }
  return Rr.Fragment = c, Rr.jsx = ne, Rr.jsxs = ne, Rr;
}
var Oa;
function bf() {
  return Oa || (Oa = 1, Oi.exports = Zf()), Oi.exports;
}
var x = bf(), we = Ai();
const ed = /* @__PURE__ */ Ga(we);
var Bl = {}, Fi = { exports: {} }, be = {}, Di = { exports: {} }, Ii = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ma;
function td() {
  return Ma || (Ma = 1, (function(m) {
    function v(C, I) {
      var j = C.length;
      C.push(I);
      e: for (; 0 < j; ) {
        var f = j - 1 >>> 1, g = C[f];
        if (0 < $(g, I)) C[f] = I, C[j] = g, j = f;
        else break e;
      }
    }
    function c(C) {
      return C.length === 0 ? null : C[0];
    }
    function P(C) {
      if (C.length === 0) return null;
      var I = C[0], j = C.pop();
      if (j !== I) {
        C[0] = j;
        e: for (var f = 0, g = C.length, H = g >>> 1; f < H; ) {
          var K = 2 * (f + 1) - 1, y = C[K], N = K + 1, z = C[N];
          if (0 > $(y, j)) N < g && 0 > $(z, y) ? (C[f] = z, C[N] = j, f = N) : (C[f] = y, C[K] = j, f = K);
          else if (N < g && 0 > $(z, j)) C[f] = z, C[N] = j, f = N;
          else break e;
        }
      }
      return I;
    }
    function $(C, I) {
      var j = C.sortIndex - I.sortIndex;
      return j !== 0 ? j : C.id - I.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var W = performance;
      m.unstable_now = function() {
        return W.now();
      };
    } else {
      var ne = Date, X = ne.now();
      m.unstable_now = function() {
        return ne.now() - X;
      };
    }
    var V = [], he = [], fe = 1, oe = null, Z = 3, Me = !1, je = !1, q = !1, b = typeof setTimeout == "function" ? setTimeout : null, ee = typeof clearTimeout == "function" ? clearTimeout : null, et = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function tt(C) {
      for (var I = c(he); I !== null; ) {
        if (I.callback === null) P(he);
        else if (I.startTime <= C) P(he), I.sortIndex = I.expirationTime, v(V, I);
        else break;
        I = c(he);
      }
    }
    function Ee(C) {
      if (q = !1, tt(C), !je) if (c(V) !== null) je = !0, De(He);
      else {
        var I = c(he);
        I !== null && ae(Ee, I.startTime - C);
      }
    }
    function He(C, I) {
      je = !1, q && (q = !1, ee(Se), Se = -1), Me = !0;
      var j = Z;
      try {
        for (tt(I), oe = c(V); oe !== null && (!(oe.expirationTime > I) || C && !Ke()); ) {
          var f = oe.callback;
          if (typeof f == "function") {
            oe.callback = null, Z = oe.priorityLevel;
            var g = f(oe.expirationTime <= I);
            I = m.unstable_now(), typeof g == "function" ? oe.callback = g : oe === c(V) && P(V), tt(I);
          } else P(V);
          oe = c(V);
        }
        if (oe !== null) var H = !0;
        else {
          var K = c(he);
          K !== null && ae(Ee, K.startTime - I), H = !1;
        }
        return H;
      } finally {
        oe = null, Z = j, Me = !1;
      }
    }
    var ye = !1, le = null, Se = -1, ht = 5, Qe = -1;
    function Ke() {
      return !(m.unstable_now() - Qe < ht);
    }
    function nt() {
      if (le !== null) {
        var C = m.unstable_now();
        Qe = C;
        var I = !0;
        try {
          I = le(!0, C);
        } finally {
          I ? Ce() : (ye = !1, le = null);
        }
      } else ye = !1;
    }
    var Ce;
    if (typeof et == "function") Ce = function() {
      et(nt);
    };
    else if (typeof MessageChannel < "u") {
      var Ye = new MessageChannel(), Fe = Ye.port2;
      Ye.port1.onmessage = nt, Ce = function() {
        Fe.postMessage(null);
      };
    } else Ce = function() {
      b(nt, 0);
    };
    function De(C) {
      le = C, ye || (ye = !0, Ce());
    }
    function ae(C, I) {
      Se = b(function() {
        C(m.unstable_now());
      }, I);
    }
    m.unstable_IdlePriority = 5, m.unstable_ImmediatePriority = 1, m.unstable_LowPriority = 4, m.unstable_NormalPriority = 3, m.unstable_Profiling = null, m.unstable_UserBlockingPriority = 2, m.unstable_cancelCallback = function(C) {
      C.callback = null;
    }, m.unstable_continueExecution = function() {
      je || Me || (je = !0, De(He));
    }, m.unstable_forceFrameRate = function(C) {
      0 > C || 125 < C ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ht = 0 < C ? Math.floor(1e3 / C) : 5;
    }, m.unstable_getCurrentPriorityLevel = function() {
      return Z;
    }, m.unstable_getFirstCallbackNode = function() {
      return c(V);
    }, m.unstable_next = function(C) {
      switch (Z) {
        case 1:
        case 2:
        case 3:
          var I = 3;
          break;
        default:
          I = Z;
      }
      var j = Z;
      Z = I;
      try {
        return C();
      } finally {
        Z = j;
      }
    }, m.unstable_pauseExecution = function() {
    }, m.unstable_requestPaint = function() {
    }, m.unstable_runWithPriority = function(C, I) {
      switch (C) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          C = 3;
      }
      var j = Z;
      Z = C;
      try {
        return I();
      } finally {
        Z = j;
      }
    }, m.unstable_scheduleCallback = function(C, I, j) {
      var f = m.unstable_now();
      switch (typeof j == "object" && j !== null ? (j = j.delay, j = typeof j == "number" && 0 < j ? f + j : f) : j = f, C) {
        case 1:
          var g = -1;
          break;
        case 2:
          g = 250;
          break;
        case 5:
          g = 1073741823;
          break;
        case 4:
          g = 1e4;
          break;
        default:
          g = 5e3;
      }
      return g = j + g, C = { id: fe++, callback: I, priorityLevel: C, startTime: j, expirationTime: g, sortIndex: -1 }, j > f ? (C.sortIndex = j, v(he, C), c(V) === null && C === c(he) && (q ? (ee(Se), Se = -1) : q = !0, ae(Ee, j - f))) : (C.sortIndex = g, v(V, C), je || Me || (je = !0, De(He))), C;
    }, m.unstable_shouldYield = Ke, m.unstable_wrapCallback = function(C) {
      var I = Z;
      return function() {
        var j = Z;
        Z = I;
        try {
          return C.apply(this, arguments);
        } finally {
          Z = j;
        }
      };
    };
  })(Ii)), Ii;
}
var Fa;
function nd() {
  return Fa || (Fa = 1, Di.exports = td()), Di.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Da;
function rd() {
  if (Da) return be;
  Da = 1;
  var m = Ai(), v = nd();
  function c(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var P = /* @__PURE__ */ new Set(), $ = {};
  function W(e, t) {
    ne(e, t), ne(e + "Capture", t);
  }
  function ne(e, t) {
    for ($[e] = t, e = 0; e < t.length; e++) P.add(t[e]);
  }
  var X = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), V = Object.prototype.hasOwnProperty, he = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, fe = {}, oe = {};
  function Z(e) {
    return V.call(oe, e) ? !0 : V.call(fe, e) ? !1 : he.test(e) ? oe[e] = !0 : (fe[e] = !0, !1);
  }
  function Me(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function je(e, t, n, r) {
    if (t === null || typeof t > "u" || Me(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null) switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }
  function q(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var b = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    b[e] = new q(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    b[t] = new q(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    b[e] = new q(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    b[e] = new q(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    b[e] = new q(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    b[e] = new q(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    b[e] = new q(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    b[e] = new q(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    b[e] = new q(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var ee = /[\-:]([a-z])/g;
  function et(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      ee,
      et
    );
    b[t] = new q(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(ee, et);
    b[t] = new q(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(ee, et);
    b[t] = new q(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    b[e] = new q(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), b.xlinkHref = new q("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    b[e] = new q(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function tt(e, t, n, r) {
    var l = b.hasOwnProperty(t) ? b[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (je(t, n, l, r) && (n = null), r || l === null ? Z(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var Ee = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, He = Symbol.for("react.element"), ye = Symbol.for("react.portal"), le = Symbol.for("react.fragment"), Se = Symbol.for("react.strict_mode"), ht = Symbol.for("react.profiler"), Qe = Symbol.for("react.provider"), Ke = Symbol.for("react.context"), nt = Symbol.for("react.forward_ref"), Ce = Symbol.for("react.suspense"), Ye = Symbol.for("react.suspense_list"), Fe = Symbol.for("react.memo"), De = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), C = Symbol.iterator;
  function I(e) {
    return e === null || typeof e != "object" ? null : (e = C && e[C] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var j = Object.assign, f;
  function g(e) {
    if (f === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      f = t && t[1] || "";
    }
    return `
` + f + e;
  }
  var H = !1;
  function K(e, t) {
    if (!e || H) return "";
    H = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (h) {
          var r = h;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (h) {
          r = h;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (h) {
          r = h;
        }
        e();
      }
    } catch (h) {
      if (h && r && typeof h.stack == "string") {
        for (var l = h.stack.split(`
`), o = r.stack.split(`
`), i = l.length - 1, u = o.length - 1; 1 <= i && 0 <= u && l[i] !== o[u]; ) u--;
        for (; 1 <= i && 0 <= u; i--, u--) if (l[i] !== o[u]) {
          if (i !== 1 || u !== 1)
            do
              if (i--, u--, 0 > u || l[i] !== o[u]) {
                var s = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && s.includes("<anonymous>") && (s = s.replace("<anonymous>", e.displayName)), s;
              }
            while (1 <= i && 0 <= u);
          break;
        }
      }
    } finally {
      H = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? g(e) : "";
  }
  function y(e) {
    switch (e.tag) {
      case 5:
        return g(e.type);
      case 16:
        return g("Lazy");
      case 13:
        return g("Suspense");
      case 19:
        return g("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = K(e.type, !1), e;
      case 11:
        return e = K(e.type.render, !1), e;
      case 1:
        return e = K(e.type, !0), e;
      default:
        return "";
    }
  }
  function N(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case le:
        return "Fragment";
      case ye:
        return "Portal";
      case ht:
        return "Profiler";
      case Se:
        return "StrictMode";
      case Ce:
        return "Suspense";
      case Ye:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Ke:
        return (e.displayName || "Context") + ".Consumer";
      case Qe:
        return (e._context.displayName || "Context") + ".Provider";
      case nt:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Fe:
        return t = e.displayName || null, t !== null ? t : N(e.type) || "Memo";
      case De:
        t = e._payload, e = e._init;
        try {
          return N(e(t));
        } catch {
        }
    }
    return null;
  }
  function z(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return N(t);
      case 8:
        return t === Se ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function A(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function E(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function U(e) {
    var t = E(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var l = n.get, o = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(i) {
        r = "" + i, o.call(this, i);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(i) {
        r = "" + i;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function re(e) {
    e._valueTracker || (e._valueTracker = U(e));
  }
  function Vt(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = E(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function zt(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Lt(e, t) {
    var n = t.checked;
    return j({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Q(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = A(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function yt(e, t) {
    t = t.checked, t != null && tt(e, "checked", t, !1);
  }
  function st(e, t) {
    yt(e, t);
    var n = A(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? vt(e, t.type, n) : t.hasOwnProperty("defaultValue") && vt(e, t.type, A(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Re(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function vt(e, t, n) {
    (t !== "number" || zt(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Be = Array.isArray;
  function rt(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + A(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ze(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(c(91));
    return j({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Lr(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(c(92));
        if (Be(n)) {
          if (1 < n.length) throw Error(c(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: A(n) };
  }
  function Bi(e, t) {
    var n = A(t.value), r = A(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Vi(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Wi(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Wl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Wi(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Or, Hi = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Or = Or || document.createElement("div"), Or.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Or.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Kn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Yn = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, Za = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Yn).forEach(function(e) {
    Za.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Yn[t] = Yn[e];
    });
  });
  function Qi(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Yn.hasOwnProperty(e) && Yn[e] ? ("" + t).trim() : t + "px";
  }
  function Ki(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = Qi(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var ba = j({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Hl(e, t) {
    if (t) {
      if (ba[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(c(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(c(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(c(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(c(62));
    }
  }
  function Ql(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Kl = null;
  function Yl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Xl = null, xn = null, _n = null;
  function Yi(e) {
    if (e = hr(e)) {
      if (typeof Xl != "function") throw Error(c(280));
      var t = e.stateNode;
      t && (t = nl(t), Xl(e.stateNode, e.type, t));
    }
  }
  function Xi(e) {
    xn ? _n ? _n.push(e) : _n = [e] : xn = e;
  }
  function Gi() {
    if (xn) {
      var e = xn, t = _n;
      if (_n = xn = null, Yi(e), t) for (e = 0; e < t.length; e++) Yi(t[e]);
    }
  }
  function Ji(e, t) {
    return e(t);
  }
  function qi() {
  }
  var Gl = !1;
  function Zi(e, t, n) {
    if (Gl) return e(t, n);
    Gl = !0;
    try {
      return Ji(e, t, n);
    } finally {
      Gl = !1, (xn !== null || _n !== null) && (qi(), Gi());
    }
  }
  function Xn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = nl(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(c(231, t, typeof n));
    return n;
  }
  var Jl = !1;
  if (X) try {
    var Gn = {};
    Object.defineProperty(Gn, "passive", { get: function() {
      Jl = !0;
    } }), window.addEventListener("test", Gn, Gn), window.removeEventListener("test", Gn, Gn);
  } catch {
    Jl = !1;
  }
  function ec(e, t, n, r, l, o, i, u, s) {
    var h = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, h);
    } catch (k) {
      this.onError(k);
    }
  }
  var Jn = !1, Mr = null, Fr = !1, ql = null, tc = { onError: function(e) {
    Jn = !0, Mr = e;
  } };
  function nc(e, t, n, r, l, o, i, u, s) {
    Jn = !1, Mr = null, ec.apply(tc, arguments);
  }
  function rc(e, t, n, r, l, o, i, u, s) {
    if (nc.apply(this, arguments), Jn) {
      if (Jn) {
        var h = Mr;
        Jn = !1, Mr = null;
      } else throw Error(c(198));
      Fr || (Fr = !0, ql = h);
    }
  }
  function an(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function bi(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function eu(e) {
    if (an(e) !== e) throw Error(c(188));
  }
  function lc(e) {
    var t = e.alternate;
    if (!t) {
      if (t = an(e), t === null) throw Error(c(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var o = l.alternate;
      if (o === null) {
        if (r = l.return, r !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === o.child) {
        for (o = l.child; o; ) {
          if (o === n) return eu(l), e;
          if (o === r) return eu(l), t;
          o = o.sibling;
        }
        throw Error(c(188));
      }
      if (n.return !== r.return) n = l, r = o;
      else {
        for (var i = !1, u = l.child; u; ) {
          if (u === n) {
            i = !0, n = l, r = o;
            break;
          }
          if (u === r) {
            i = !0, r = l, n = o;
            break;
          }
          u = u.sibling;
        }
        if (!i) {
          for (u = o.child; u; ) {
            if (u === n) {
              i = !0, n = o, r = l;
              break;
            }
            if (u === r) {
              i = !0, r = o, n = l;
              break;
            }
            u = u.sibling;
          }
          if (!i) throw Error(c(189));
        }
      }
      if (n.alternate !== r) throw Error(c(190));
    }
    if (n.tag !== 3) throw Error(c(188));
    return n.stateNode.current === n ? e : t;
  }
  function tu(e) {
    return e = lc(e), e !== null ? nu(e) : null;
  }
  function nu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = nu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var ru = v.unstable_scheduleCallback, lu = v.unstable_cancelCallback, oc = v.unstable_shouldYield, ic = v.unstable_requestPaint, ve = v.unstable_now, uc = v.unstable_getCurrentPriorityLevel, Zl = v.unstable_ImmediatePriority, ou = v.unstable_UserBlockingPriority, Dr = v.unstable_NormalPriority, sc = v.unstable_LowPriority, iu = v.unstable_IdlePriority, Ir = null, Ct = null;
  function ac(e) {
    if (Ct && typeof Ct.onCommitFiberRoot == "function") try {
      Ct.onCommitFiberRoot(Ir, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var gt = Math.clz32 ? Math.clz32 : dc, cc = Math.log, fc = Math.LN2;
  function dc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (cc(e) / fc | 0) | 0;
  }
  var Ur = 64, Ar = 4194304;
  function qn(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function $r(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var u = i & ~l;
      u !== 0 ? r = qn(u) : (o &= i, o !== 0 && (r = qn(o)));
    } else i = n & ~l, i !== 0 ? r = qn(i) : o !== 0 && (r = qn(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - gt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function pc(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function mc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - gt(o), u = 1 << i, s = l[i];
      s === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[i] = pc(u, t)) : s <= t && (e.expiredLanes |= u), o &= ~u;
    }
  }
  function bl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function uu() {
    var e = Ur;
    return Ur <<= 1, (Ur & 4194240) === 0 && (Ur = 64), e;
  }
  function eo(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Zn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - gt(t), e[t] = n;
  }
  function hc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - gt(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function to(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - gt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var te = 0;
  function su(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var au, no, cu, fu, du, ro = !1, Br = [], Wt = null, Ht = null, Qt = null, bn = /* @__PURE__ */ new Map(), er = /* @__PURE__ */ new Map(), Kt = [], yc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function pu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Wt = null;
        break;
      case "dragenter":
      case "dragleave":
        Ht = null;
        break;
      case "mouseover":
      case "mouseout":
        Qt = null;
        break;
      case "pointerover":
      case "pointerout":
        bn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        er.delete(t.pointerId);
    }
  }
  function tr(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = hr(t), t !== null && no(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function vc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Wt = tr(Wt, e, t, n, r, l), !0;
      case "dragenter":
        return Ht = tr(Ht, e, t, n, r, l), !0;
      case "mouseover":
        return Qt = tr(Qt, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return bn.set(o, tr(bn.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, er.set(o, tr(er.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function mu(e) {
    var t = cn(e.target);
    if (t !== null) {
      var n = an(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = bi(n), t !== null) {
            e.blockedOn = t, du(e.priority, function() {
              cu(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Vr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = oo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Kl = r, n.target.dispatchEvent(r), Kl = null;
      } else return t = hr(n), t !== null && no(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function hu(e, t, n) {
    Vr(e) && n.delete(t);
  }
  function gc() {
    ro = !1, Wt !== null && Vr(Wt) && (Wt = null), Ht !== null && Vr(Ht) && (Ht = null), Qt !== null && Vr(Qt) && (Qt = null), bn.forEach(hu), er.forEach(hu);
  }
  function nr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ro || (ro = !0, v.unstable_scheduleCallback(v.unstable_NormalPriority, gc)));
  }
  function rr(e) {
    function t(l) {
      return nr(l, e);
    }
    if (0 < Br.length) {
      nr(Br[0], e);
      for (var n = 1; n < Br.length; n++) {
        var r = Br[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Wt !== null && nr(Wt, e), Ht !== null && nr(Ht, e), Qt !== null && nr(Qt, e), bn.forEach(t), er.forEach(t), n = 0; n < Kt.length; n++) r = Kt[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Kt.length && (n = Kt[0], n.blockedOn === null); ) mu(n), n.blockedOn === null && Kt.shift();
  }
  var En = Ee.ReactCurrentBatchConfig, Wr = !0;
  function wc(e, t, n, r) {
    var l = te, o = En.transition;
    En.transition = null;
    try {
      te = 1, lo(e, t, n, r);
    } finally {
      te = l, En.transition = o;
    }
  }
  function kc(e, t, n, r) {
    var l = te, o = En.transition;
    En.transition = null;
    try {
      te = 4, lo(e, t, n, r);
    } finally {
      te = l, En.transition = o;
    }
  }
  function lo(e, t, n, r) {
    if (Wr) {
      var l = oo(e, t, n, r);
      if (l === null) _o(e, t, r, Hr, n), pu(e, r);
      else if (vc(l, e, t, n, r)) r.stopPropagation();
      else if (pu(e, r), t & 4 && -1 < yc.indexOf(e)) {
        for (; l !== null; ) {
          var o = hr(l);
          if (o !== null && au(o), o = oo(e, t, n, r), o === null && _o(e, t, r, Hr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else _o(e, t, r, null, n);
    }
  }
  var Hr = null;
  function oo(e, t, n, r) {
    if (Hr = null, e = Yl(r), e = cn(e), e !== null) if (t = an(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = bi(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Hr = e, null;
  }
  function yu(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (uc()) {
          case Zl:
            return 1;
          case ou:
            return 4;
          case Dr:
          case sc:
            return 16;
          case iu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Yt = null, io = null, Qr = null;
  function vu() {
    if (Qr) return Qr;
    var e, t = io, n = t.length, r, l = "value" in Yt ? Yt.value : Yt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Qr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Kr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Yr() {
    return !0;
  }
  function gu() {
    return !1;
  }
  function lt(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(o) : o[u]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Yr : gu, this.isPropagationStopped = gu, this;
    }
    return j(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Yr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Yr);
    }, persist: function() {
    }, isPersistent: Yr }), t;
  }
  var Cn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, uo = lt(Cn), lr = j({}, Cn, { view: 0, detail: 0 }), Sc = lt(lr), so, ao, or, Xr = j({}, lr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: fo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== or && (or && e.type === "mousemove" ? (so = e.screenX - or.screenX, ao = e.screenY - or.screenY) : ao = so = 0, or = e), so);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : ao;
  } }), wu = lt(Xr), xc = j({}, Xr, { dataTransfer: 0 }), _c = lt(xc), Ec = j({}, lr, { relatedTarget: 0 }), co = lt(Ec), Cc = j({}, Cn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Pc = lt(Cc), Nc = j({}, Cn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Tc = lt(Nc), jc = j({}, Cn, { data: 0 }), ku = lt(jc), Rc = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, zc = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Lc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Oc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Lc[e]) ? !!t[e] : !1;
  }
  function fo() {
    return Oc;
  }
  var Mc = j({}, lr, { key: function(e) {
    if (e.key) {
      var t = Rc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Kr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? zc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: fo, charCode: function(e) {
    return e.type === "keypress" ? Kr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Kr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Fc = lt(Mc), Dc = j({}, Xr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Su = lt(Dc), Ic = j({}, lr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: fo }), Uc = lt(Ic), Ac = j({}, Cn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), $c = lt(Ac), Bc = j({}, Xr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Vc = lt(Bc), Wc = [9, 13, 27, 32], po = X && "CompositionEvent" in window, ir = null;
  X && "documentMode" in document && (ir = document.documentMode);
  var Hc = X && "TextEvent" in window && !ir, xu = X && (!po || ir && 8 < ir && 11 >= ir), _u = " ", Eu = !1;
  function Cu(e, t) {
    switch (e) {
      case "keyup":
        return Wc.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Pu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Pn = !1;
  function Qc(e, t) {
    switch (e) {
      case "compositionend":
        return Pu(t);
      case "keypress":
        return t.which !== 32 ? null : (Eu = !0, _u);
      case "textInput":
        return e = t.data, e === _u && Eu ? null : e;
      default:
        return null;
    }
  }
  function Kc(e, t) {
    if (Pn) return e === "compositionend" || !po && Cu(e, t) ? (e = vu(), Qr = io = Yt = null, Pn = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return xu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Yc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Nu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Yc[e.type] : t === "textarea";
  }
  function Tu(e, t, n, r) {
    Xi(r), t = br(t, "onChange"), 0 < t.length && (n = new uo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var ur = null, sr = null;
  function Xc(e) {
    Ku(e, 0);
  }
  function Gr(e) {
    var t = zn(e);
    if (Vt(t)) return e;
  }
  function Gc(e, t) {
    if (e === "change") return t;
  }
  var ju = !1;
  if (X) {
    var mo;
    if (X) {
      var ho = "oninput" in document;
      if (!ho) {
        var Ru = document.createElement("div");
        Ru.setAttribute("oninput", "return;"), ho = typeof Ru.oninput == "function";
      }
      mo = ho;
    } else mo = !1;
    ju = mo && (!document.documentMode || 9 < document.documentMode);
  }
  function zu() {
    ur && (ur.detachEvent("onpropertychange", Lu), sr = ur = null);
  }
  function Lu(e) {
    if (e.propertyName === "value" && Gr(sr)) {
      var t = [];
      Tu(t, sr, e, Yl(e)), Zi(Xc, t);
    }
  }
  function Jc(e, t, n) {
    e === "focusin" ? (zu(), ur = t, sr = n, ur.attachEvent("onpropertychange", Lu)) : e === "focusout" && zu();
  }
  function qc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Gr(sr);
  }
  function Zc(e, t) {
    if (e === "click") return Gr(t);
  }
  function bc(e, t) {
    if (e === "input" || e === "change") return Gr(t);
  }
  function ef(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var wt = typeof Object.is == "function" ? Object.is : ef;
  function ar(e, t) {
    if (wt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!V.call(t, l) || !wt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Ou(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Mu(e, t) {
    var n = Ou(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Ou(n);
    }
  }
  function Fu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Fu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Du() {
    for (var e = window, t = zt(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = zt(e.document);
    }
    return t;
  }
  function yo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function tf(e) {
    var t = Du(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Fu(n.ownerDocument.documentElement, n)) {
      if (r !== null && yo(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Mu(n, o);
          var i = Mu(
            n,
            r
          );
          l && i && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > r ? (e.addRange(t), e.extend(i.node, i.offset)) : (t.setEnd(i.node, i.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var nf = X && "documentMode" in document && 11 >= document.documentMode, Nn = null, vo = null, cr = null, go = !1;
  function Iu(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    go || Nn == null || Nn !== zt(r) || (r = Nn, "selectionStart" in r && yo(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), cr && ar(cr, r) || (cr = r, r = br(vo, "onSelect"), 0 < r.length && (t = new uo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Nn)));
  }
  function Jr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Tn = { animationend: Jr("Animation", "AnimationEnd"), animationiteration: Jr("Animation", "AnimationIteration"), animationstart: Jr("Animation", "AnimationStart"), transitionend: Jr("Transition", "TransitionEnd") }, wo = {}, Uu = {};
  X && (Uu = document.createElement("div").style, "AnimationEvent" in window || (delete Tn.animationend.animation, delete Tn.animationiteration.animation, delete Tn.animationstart.animation), "TransitionEvent" in window || delete Tn.transitionend.transition);
  function qr(e) {
    if (wo[e]) return wo[e];
    if (!Tn[e]) return e;
    var t = Tn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Uu) return wo[e] = t[n];
    return e;
  }
  var Au = qr("animationend"), $u = qr("animationiteration"), Bu = qr("animationstart"), Vu = qr("transitionend"), Wu = /* @__PURE__ */ new Map(), Hu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Xt(e, t) {
    Wu.set(e, t), W(t, [e]);
  }
  for (var ko = 0; ko < Hu.length; ko++) {
    var So = Hu[ko], rf = So.toLowerCase(), lf = So[0].toUpperCase() + So.slice(1);
    Xt(rf, "on" + lf);
  }
  Xt(Au, "onAnimationEnd"), Xt($u, "onAnimationIteration"), Xt(Bu, "onAnimationStart"), Xt("dblclick", "onDoubleClick"), Xt("focusin", "onFocus"), Xt("focusout", "onBlur"), Xt(Vu, "onTransitionEnd"), ne("onMouseEnter", ["mouseout", "mouseover"]), ne("onMouseLeave", ["mouseout", "mouseover"]), ne("onPointerEnter", ["pointerout", "pointerover"]), ne("onPointerLeave", ["pointerout", "pointerover"]), W("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), W("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), W("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), W("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), W("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), W("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var fr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), of = new Set("cancel close invalid load scroll toggle".split(" ").concat(fr));
  function Qu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, rc(r, t, void 0, e), e.currentTarget = null;
  }
  function Ku(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var u = r[i], s = u.instance, h = u.currentTarget;
          if (u = u.listener, s !== o && l.isPropagationStopped()) break e;
          Qu(l, u, h), o = s;
        }
        else for (i = 0; i < r.length; i++) {
          if (u = r[i], s = u.instance, h = u.currentTarget, u = u.listener, s !== o && l.isPropagationStopped()) break e;
          Qu(l, u, h), o = s;
        }
      }
    }
    if (Fr) throw e = ql, Fr = !1, ql = null, e;
  }
  function ue(e, t) {
    var n = t[jo];
    n === void 0 && (n = t[jo] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (Yu(t, e, 2, !1), n.add(r));
  }
  function xo(e, t, n) {
    var r = 0;
    t && (r |= 4), Yu(n, e, r, t);
  }
  var Zr = "_reactListening" + Math.random().toString(36).slice(2);
  function dr(e) {
    if (!e[Zr]) {
      e[Zr] = !0, P.forEach(function(n) {
        n !== "selectionchange" && (of.has(n) || xo(n, !1, e), xo(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Zr] || (t[Zr] = !0, xo("selectionchange", !1, t));
    }
  }
  function Yu(e, t, n, r) {
    switch (yu(t)) {
      case 1:
        var l = wc;
        break;
      case 4:
        l = kc;
        break;
      default:
        l = lo;
    }
    n = l.bind(null, t, n, e), l = void 0, !Jl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function _o(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var u = r.stateNode.containerInfo;
        if (u === l || u.nodeType === 8 && u.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var s = i.tag;
          if ((s === 3 || s === 4) && (s = i.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l)) return;
          i = i.return;
        }
        for (; u !== null; ) {
          if (i = cn(u), i === null) return;
          if (s = i.tag, s === 5 || s === 6) {
            r = o = i;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    Zi(function() {
      var h = o, k = Yl(n), S = [];
      e: {
        var w = Wu.get(e);
        if (w !== void 0) {
          var T = uo, L = e;
          switch (e) {
            case "keypress":
              if (Kr(n) === 0) break e;
            case "keydown":
            case "keyup":
              T = Fc;
              break;
            case "focusin":
              L = "focus", T = co;
              break;
            case "focusout":
              L = "blur", T = co;
              break;
            case "beforeblur":
            case "afterblur":
              T = co;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              T = wu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              T = _c;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              T = Uc;
              break;
            case Au:
            case $u:
            case Bu:
              T = Pc;
              break;
            case Vu:
              T = $c;
              break;
            case "scroll":
              T = Sc;
              break;
            case "wheel":
              T = Vc;
              break;
            case "copy":
            case "cut":
            case "paste":
              T = Tc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              T = Su;
          }
          var O = (t & 4) !== 0, ge = !O && e === "scroll", d = O ? w !== null ? w + "Capture" : null : w;
          O = [];
          for (var a = h, p; a !== null; ) {
            p = a;
            var _ = p.stateNode;
            if (p.tag === 5 && _ !== null && (p = _, d !== null && (_ = Xn(a, d), _ != null && O.push(pr(a, _, p)))), ge) break;
            a = a.return;
          }
          0 < O.length && (w = new T(w, L, null, n, k), S.push({ event: w, listeners: O }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (w = e === "mouseover" || e === "pointerover", T = e === "mouseout" || e === "pointerout", w && n !== Kl && (L = n.relatedTarget || n.fromElement) && (cn(L) || L[Ot])) break e;
          if ((T || w) && (w = k.window === k ? k : (w = k.ownerDocument) ? w.defaultView || w.parentWindow : window, T ? (L = n.relatedTarget || n.toElement, T = h, L = L ? cn(L) : null, L !== null && (ge = an(L), L !== ge || L.tag !== 5 && L.tag !== 6) && (L = null)) : (T = null, L = h), T !== L)) {
            if (O = wu, _ = "onMouseLeave", d = "onMouseEnter", a = "mouse", (e === "pointerout" || e === "pointerover") && (O = Su, _ = "onPointerLeave", d = "onPointerEnter", a = "pointer"), ge = T == null ? w : zn(T), p = L == null ? w : zn(L), w = new O(_, a + "leave", T, n, k), w.target = ge, w.relatedTarget = p, _ = null, cn(k) === h && (O = new O(d, a + "enter", L, n, k), O.target = p, O.relatedTarget = ge, _ = O), ge = _, T && L) t: {
              for (O = T, d = L, a = 0, p = O; p; p = jn(p)) a++;
              for (p = 0, _ = d; _; _ = jn(_)) p++;
              for (; 0 < a - p; ) O = jn(O), a--;
              for (; 0 < p - a; ) d = jn(d), p--;
              for (; a--; ) {
                if (O === d || d !== null && O === d.alternate) break t;
                O = jn(O), d = jn(d);
              }
              O = null;
            }
            else O = null;
            T !== null && Xu(S, w, T, O, !1), L !== null && ge !== null && Xu(S, ge, L, O, !0);
          }
        }
        e: {
          if (w = h ? zn(h) : window, T = w.nodeName && w.nodeName.toLowerCase(), T === "select" || T === "input" && w.type === "file") var M = Gc;
          else if (Nu(w)) if (ju) M = bc;
          else {
            M = qc;
            var F = Jc;
          }
          else (T = w.nodeName) && T.toLowerCase() === "input" && (w.type === "checkbox" || w.type === "radio") && (M = Zc);
          if (M && (M = M(e, h))) {
            Tu(S, M, n, k);
            break e;
          }
          F && F(e, w, h), e === "focusout" && (F = w._wrapperState) && F.controlled && w.type === "number" && vt(w, "number", w.value);
        }
        switch (F = h ? zn(h) : window, e) {
          case "focusin":
            (Nu(F) || F.contentEditable === "true") && (Nn = F, vo = h, cr = null);
            break;
          case "focusout":
            cr = vo = Nn = null;
            break;
          case "mousedown":
            go = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            go = !1, Iu(S, n, k);
            break;
          case "selectionchange":
            if (nf) break;
          case "keydown":
          case "keyup":
            Iu(S, n, k);
        }
        var D;
        if (po) e: {
          switch (e) {
            case "compositionstart":
              var B = "onCompositionStart";
              break e;
            case "compositionend":
              B = "onCompositionEnd";
              break e;
            case "compositionupdate":
              B = "onCompositionUpdate";
              break e;
          }
          B = void 0;
        }
        else Pn ? Cu(e, n) && (B = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (B = "onCompositionStart");
        B && (xu && n.locale !== "ko" && (Pn || B !== "onCompositionStart" ? B === "onCompositionEnd" && Pn && (D = vu()) : (Yt = k, io = "value" in Yt ? Yt.value : Yt.textContent, Pn = !0)), F = br(h, B), 0 < F.length && (B = new ku(B, e, null, n, k), S.push({ event: B, listeners: F }), D ? B.data = D : (D = Pu(n), D !== null && (B.data = D)))), (D = Hc ? Qc(e, n) : Kc(e, n)) && (h = br(h, "onBeforeInput"), 0 < h.length && (k = new ku("onBeforeInput", "beforeinput", null, n, k), S.push({ event: k, listeners: h }), k.data = D));
      }
      Ku(S, t);
    });
  }
  function pr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function br(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Xn(e, n), o != null && r.unshift(pr(e, o, l)), o = Xn(e, t), o != null && r.push(pr(e, o, l))), e = e.return;
    }
    return r;
  }
  function jn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Xu(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var u = n, s = u.alternate, h = u.stateNode;
      if (s !== null && s === r) break;
      u.tag === 5 && h !== null && (u = h, l ? (s = Xn(n, o), s != null && i.unshift(pr(n, s, u))) : l || (s = Xn(n, o), s != null && i.push(pr(n, s, u)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var uf = /\r\n?/g, sf = /\u0000|\uFFFD/g;
  function Gu(e) {
    return (typeof e == "string" ? e : "" + e).replace(uf, `
`).replace(sf, "");
  }
  function el(e, t, n) {
    if (t = Gu(t), Gu(e) !== t && n) throw Error(c(425));
  }
  function tl() {
  }
  var Eo = null, Co = null;
  function Po(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var No = typeof setTimeout == "function" ? setTimeout : void 0, af = typeof clearTimeout == "function" ? clearTimeout : void 0, Ju = typeof Promise == "function" ? Promise : void 0, cf = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ju < "u" ? function(e) {
    return Ju.resolve(null).then(e).catch(ff);
  } : No;
  function ff(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function To(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), rr(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    rr(t);
  }
  function Gt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function qu(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Rn = Math.random().toString(36).slice(2), Pt = "__reactFiber$" + Rn, mr = "__reactProps$" + Rn, Ot = "__reactContainer$" + Rn, jo = "__reactEvents$" + Rn, df = "__reactListeners$" + Rn, pf = "__reactHandles$" + Rn;
  function cn(e) {
    var t = e[Pt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Ot] || n[Pt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = qu(e); e !== null; ) {
          if (n = e[Pt]) return n;
          e = qu(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function hr(e) {
    return e = e[Pt] || e[Ot], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function zn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(c(33));
  }
  function nl(e) {
    return e[mr] || null;
  }
  var Ro = [], Ln = -1;
  function Jt(e) {
    return { current: e };
  }
  function se(e) {
    0 > Ln || (e.current = Ro[Ln], Ro[Ln] = null, Ln--);
  }
  function ie(e, t) {
    Ln++, Ro[Ln] = e.current, e.current = t;
  }
  var qt = {}, Ie = Jt(qt), Xe = Jt(!1), fn = qt;
  function On(e, t) {
    var n = e.type.contextTypes;
    if (!n) return qt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ge(e) {
    return e = e.childContextTypes, e != null;
  }
  function rl() {
    se(Xe), se(Ie);
  }
  function Zu(e, t, n) {
    if (Ie.current !== qt) throw Error(c(168));
    ie(Ie, t), ie(Xe, n);
  }
  function bu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(c(108, z(e) || "Unknown", l));
    return j({}, n, r);
  }
  function ll(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || qt, fn = Ie.current, ie(Ie, e), ie(Xe, Xe.current), !0;
  }
  function es(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(c(169));
    n ? (e = bu(e, t, fn), r.__reactInternalMemoizedMergedChildContext = e, se(Xe), se(Ie), ie(Ie, e)) : se(Xe), ie(Xe, n);
  }
  var Mt = null, ol = !1, zo = !1;
  function ts(e) {
    Mt === null ? Mt = [e] : Mt.push(e);
  }
  function mf(e) {
    ol = !0, ts(e);
  }
  function Zt() {
    if (!zo && Mt !== null) {
      zo = !0;
      var e = 0, t = te;
      try {
        var n = Mt;
        for (te = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Mt = null, ol = !1;
      } catch (l) {
        throw Mt !== null && (Mt = Mt.slice(e + 1)), ru(Zl, Zt), l;
      } finally {
        te = t, zo = !1;
      }
    }
    return null;
  }
  var Mn = [], Fn = 0, il = null, ul = 0, at = [], ct = 0, dn = null, Ft = 1, Dt = "";
  function pn(e, t) {
    Mn[Fn++] = ul, Mn[Fn++] = il, il = e, ul = t;
  }
  function ns(e, t, n) {
    at[ct++] = Ft, at[ct++] = Dt, at[ct++] = dn, dn = e;
    var r = Ft;
    e = Dt;
    var l = 32 - gt(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - gt(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, Ft = 1 << 32 - gt(t) + l | n << l | r, Dt = o + e;
    } else Ft = 1 << o | n << l | r, Dt = e;
  }
  function Lo(e) {
    e.return !== null && (pn(e, 1), ns(e, 1, 0));
  }
  function Oo(e) {
    for (; e === il; ) il = Mn[--Fn], Mn[Fn] = null, ul = Mn[--Fn], Mn[Fn] = null;
    for (; e === dn; ) dn = at[--ct], at[ct] = null, Dt = at[--ct], at[ct] = null, Ft = at[--ct], at[ct] = null;
  }
  var ot = null, it = null, ce = !1, kt = null;
  function rs(e, t) {
    var n = mt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function ls(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, ot = e, it = Gt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, ot = e, it = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = dn !== null ? { id: Ft, overflow: Dt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = mt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, ot = e, it = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Mo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Fo(e) {
    if (ce) {
      var t = it;
      if (t) {
        var n = t;
        if (!ls(e, t)) {
          if (Mo(e)) throw Error(c(418));
          t = Gt(n.nextSibling);
          var r = ot;
          t && ls(e, t) ? rs(r, n) : (e.flags = e.flags & -4097 | 2, ce = !1, ot = e);
        }
      } else {
        if (Mo(e)) throw Error(c(418));
        e.flags = e.flags & -4097 | 2, ce = !1, ot = e;
      }
    }
  }
  function os(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    ot = e;
  }
  function sl(e) {
    if (e !== ot) return !1;
    if (!ce) return os(e), ce = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Po(e.type, e.memoizedProps)), t && (t = it)) {
      if (Mo(e)) throw is(), Error(c(418));
      for (; t; ) rs(e, t), t = Gt(t.nextSibling);
    }
    if (os(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(c(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                it = Gt(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        it = null;
      }
    } else it = ot ? Gt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function is() {
    for (var e = it; e; ) e = Gt(e.nextSibling);
  }
  function Dn() {
    it = ot = null, ce = !1;
  }
  function Do(e) {
    kt === null ? kt = [e] : kt.push(e);
  }
  var hf = Ee.ReactCurrentBatchConfig;
  function yr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(c(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(c(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var u = l.refs;
          i === null ? delete u[o] : u[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(c(284));
      if (!n._owner) throw Error(c(290, e));
    }
    return e;
  }
  function al(e, t) {
    throw e = Object.prototype.toString.call(t), Error(c(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function us(e) {
    var t = e._init;
    return t(e._payload);
  }
  function ss(e) {
    function t(d, a) {
      if (e) {
        var p = d.deletions;
        p === null ? (d.deletions = [a], d.flags |= 16) : p.push(a);
      }
    }
    function n(d, a) {
      if (!e) return null;
      for (; a !== null; ) t(d, a), a = a.sibling;
      return null;
    }
    function r(d, a) {
      for (d = /* @__PURE__ */ new Map(); a !== null; ) a.key !== null ? d.set(a.key, a) : d.set(a.index, a), a = a.sibling;
      return d;
    }
    function l(d, a) {
      return d = un(d, a), d.index = 0, d.sibling = null, d;
    }
    function o(d, a, p) {
      return d.index = p, e ? (p = d.alternate, p !== null ? (p = p.index, p < a ? (d.flags |= 2, a) : p) : (d.flags |= 2, a)) : (d.flags |= 1048576, a);
    }
    function i(d) {
      return e && d.alternate === null && (d.flags |= 2), d;
    }
    function u(d, a, p, _) {
      return a === null || a.tag !== 6 ? (a = Ni(p, d.mode, _), a.return = d, a) : (a = l(a, p), a.return = d, a);
    }
    function s(d, a, p, _) {
      var M = p.type;
      return M === le ? k(d, a, p.props.children, _, p.key) : a !== null && (a.elementType === M || typeof M == "object" && M !== null && M.$$typeof === De && us(M) === a.type) ? (_ = l(a, p.props), _.ref = yr(d, a, p), _.return = d, _) : (_ = Ol(p.type, p.key, p.props, null, d.mode, _), _.ref = yr(d, a, p), _.return = d, _);
    }
    function h(d, a, p, _) {
      return a === null || a.tag !== 4 || a.stateNode.containerInfo !== p.containerInfo || a.stateNode.implementation !== p.implementation ? (a = Ti(p, d.mode, _), a.return = d, a) : (a = l(a, p.children || []), a.return = d, a);
    }
    function k(d, a, p, _, M) {
      return a === null || a.tag !== 7 ? (a = Sn(p, d.mode, _, M), a.return = d, a) : (a = l(a, p), a.return = d, a);
    }
    function S(d, a, p) {
      if (typeof a == "string" && a !== "" || typeof a == "number") return a = Ni("" + a, d.mode, p), a.return = d, a;
      if (typeof a == "object" && a !== null) {
        switch (a.$$typeof) {
          case He:
            return p = Ol(a.type, a.key, a.props, null, d.mode, p), p.ref = yr(d, null, a), p.return = d, p;
          case ye:
            return a = Ti(a, d.mode, p), a.return = d, a;
          case De:
            var _ = a._init;
            return S(d, _(a._payload), p);
        }
        if (Be(a) || I(a)) return a = Sn(a, d.mode, p, null), a.return = d, a;
        al(d, a);
      }
      return null;
    }
    function w(d, a, p, _) {
      var M = a !== null ? a.key : null;
      if (typeof p == "string" && p !== "" || typeof p == "number") return M !== null ? null : u(d, a, "" + p, _);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case He:
            return p.key === M ? s(d, a, p, _) : null;
          case ye:
            return p.key === M ? h(d, a, p, _) : null;
          case De:
            return M = p._init, w(
              d,
              a,
              M(p._payload),
              _
            );
        }
        if (Be(p) || I(p)) return M !== null ? null : k(d, a, p, _, null);
        al(d, p);
      }
      return null;
    }
    function T(d, a, p, _, M) {
      if (typeof _ == "string" && _ !== "" || typeof _ == "number") return d = d.get(p) || null, u(a, d, "" + _, M);
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case He:
            return d = d.get(_.key === null ? p : _.key) || null, s(a, d, _, M);
          case ye:
            return d = d.get(_.key === null ? p : _.key) || null, h(a, d, _, M);
          case De:
            var F = _._init;
            return T(d, a, p, F(_._payload), M);
        }
        if (Be(_) || I(_)) return d = d.get(p) || null, k(a, d, _, M, null);
        al(a, _);
      }
      return null;
    }
    function L(d, a, p, _) {
      for (var M = null, F = null, D = a, B = a = 0, Te = null; D !== null && B < p.length; B++) {
        D.index > B ? (Te = D, D = null) : Te = D.sibling;
        var J = w(d, D, p[B], _);
        if (J === null) {
          D === null && (D = Te);
          break;
        }
        e && D && J.alternate === null && t(d, D), a = o(J, a, B), F === null ? M = J : F.sibling = J, F = J, D = Te;
      }
      if (B === p.length) return n(d, D), ce && pn(d, B), M;
      if (D === null) {
        for (; B < p.length; B++) D = S(d, p[B], _), D !== null && (a = o(D, a, B), F === null ? M = D : F.sibling = D, F = D);
        return ce && pn(d, B), M;
      }
      for (D = r(d, D); B < p.length; B++) Te = T(D, d, B, p[B], _), Te !== null && (e && Te.alternate !== null && D.delete(Te.key === null ? B : Te.key), a = o(Te, a, B), F === null ? M = Te : F.sibling = Te, F = Te);
      return e && D.forEach(function(sn) {
        return t(d, sn);
      }), ce && pn(d, B), M;
    }
    function O(d, a, p, _) {
      var M = I(p);
      if (typeof M != "function") throw Error(c(150));
      if (p = M.call(p), p == null) throw Error(c(151));
      for (var F = M = null, D = a, B = a = 0, Te = null, J = p.next(); D !== null && !J.done; B++, J = p.next()) {
        D.index > B ? (Te = D, D = null) : Te = D.sibling;
        var sn = w(d, D, J.value, _);
        if (sn === null) {
          D === null && (D = Te);
          break;
        }
        e && D && sn.alternate === null && t(d, D), a = o(sn, a, B), F === null ? M = sn : F.sibling = sn, F = sn, D = Te;
      }
      if (J.done) return n(
        d,
        D
      ), ce && pn(d, B), M;
      if (D === null) {
        for (; !J.done; B++, J = p.next()) J = S(d, J.value, _), J !== null && (a = o(J, a, B), F === null ? M = J : F.sibling = J, F = J);
        return ce && pn(d, B), M;
      }
      for (D = r(d, D); !J.done; B++, J = p.next()) J = T(D, d, B, J.value, _), J !== null && (e && J.alternate !== null && D.delete(J.key === null ? B : J.key), a = o(J, a, B), F === null ? M = J : F.sibling = J, F = J);
      return e && D.forEach(function(Xf) {
        return t(d, Xf);
      }), ce && pn(d, B), M;
    }
    function ge(d, a, p, _) {
      if (typeof p == "object" && p !== null && p.type === le && p.key === null && (p = p.props.children), typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case He:
            e: {
              for (var M = p.key, F = a; F !== null; ) {
                if (F.key === M) {
                  if (M = p.type, M === le) {
                    if (F.tag === 7) {
                      n(d, F.sibling), a = l(F, p.props.children), a.return = d, d = a;
                      break e;
                    }
                  } else if (F.elementType === M || typeof M == "object" && M !== null && M.$$typeof === De && us(M) === F.type) {
                    n(d, F.sibling), a = l(F, p.props), a.ref = yr(d, F, p), a.return = d, d = a;
                    break e;
                  }
                  n(d, F);
                  break;
                } else t(d, F);
                F = F.sibling;
              }
              p.type === le ? (a = Sn(p.props.children, d.mode, _, p.key), a.return = d, d = a) : (_ = Ol(p.type, p.key, p.props, null, d.mode, _), _.ref = yr(d, a, p), _.return = d, d = _);
            }
            return i(d);
          case ye:
            e: {
              for (F = p.key; a !== null; ) {
                if (a.key === F) if (a.tag === 4 && a.stateNode.containerInfo === p.containerInfo && a.stateNode.implementation === p.implementation) {
                  n(d, a.sibling), a = l(a, p.children || []), a.return = d, d = a;
                  break e;
                } else {
                  n(d, a);
                  break;
                }
                else t(d, a);
                a = a.sibling;
              }
              a = Ti(p, d.mode, _), a.return = d, d = a;
            }
            return i(d);
          case De:
            return F = p._init, ge(d, a, F(p._payload), _);
        }
        if (Be(p)) return L(d, a, p, _);
        if (I(p)) return O(d, a, p, _);
        al(d, p);
      }
      return typeof p == "string" && p !== "" || typeof p == "number" ? (p = "" + p, a !== null && a.tag === 6 ? (n(d, a.sibling), a = l(a, p), a.return = d, d = a) : (n(d, a), a = Ni(p, d.mode, _), a.return = d, d = a), i(d)) : n(d, a);
    }
    return ge;
  }
  var In = ss(!0), as = ss(!1), cl = Jt(null), fl = null, Un = null, Io = null;
  function Uo() {
    Io = Un = fl = null;
  }
  function Ao(e) {
    var t = cl.current;
    se(cl), e._currentValue = t;
  }
  function $o(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function An(e, t) {
    fl = e, Io = Un = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Je = !0), e.firstContext = null);
  }
  function ft(e) {
    var t = e._currentValue;
    if (Io !== e) if (e = { context: e, memoizedValue: t, next: null }, Un === null) {
      if (fl === null) throw Error(c(308));
      Un = e, fl.dependencies = { lanes: 0, firstContext: e };
    } else Un = Un.next = e;
    return t;
  }
  var mn = null;
  function Bo(e) {
    mn === null ? mn = [e] : mn.push(e);
  }
  function cs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Bo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, It(e, r);
  }
  function It(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var bt = !1;
  function Vo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function fs(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Ut(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function en(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (G & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, It(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Bo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, It(e, n);
  }
  function dl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, to(e, n);
    }
  }
  function ds(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var l = null, o = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var i = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          o === null ? l = o = i : o = o.next = i, n = n.next;
        } while (n !== null);
        o === null ? l = o = t : o = o.next = t;
      } else l = o = t;
      n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function pl(e, t, n, r) {
    var l = e.updateQueue;
    bt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var s = u, h = s.next;
      s.next = null, i === null ? o = h : i.next = h, i = s;
      var k = e.alternate;
      k !== null && (k = k.updateQueue, u = k.lastBaseUpdate, u !== i && (u === null ? k.firstBaseUpdate = h : u.next = h, k.lastBaseUpdate = s));
    }
    if (o !== null) {
      var S = l.baseState;
      i = 0, k = h = s = null, u = o;
      do {
        var w = u.lane, T = u.eventTime;
        if ((r & w) === w) {
          k !== null && (k = k.next = {
            eventTime: T,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var L = e, O = u;
            switch (w = t, T = n, O.tag) {
              case 1:
                if (L = O.payload, typeof L == "function") {
                  S = L.call(T, S, w);
                  break e;
                }
                S = L;
                break e;
              case 3:
                L.flags = L.flags & -65537 | 128;
              case 0:
                if (L = O.payload, w = typeof L == "function" ? L.call(T, S, w) : L, w == null) break e;
                S = j({}, S, w);
                break e;
              case 2:
                bt = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, w = l.effects, w === null ? l.effects = [u] : w.push(u));
        } else T = { eventTime: T, lane: w, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, k === null ? (h = k = T, s = S) : k = k.next = T, i |= w;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          w = u, u = w.next, w.next = null, l.lastBaseUpdate = w, l.shared.pending = null;
        }
      } while (!0);
      if (k === null && (s = S), l.baseState = s, l.firstBaseUpdate = h, l.lastBaseUpdate = k, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      vn |= i, e.lanes = i, e.memoizedState = S;
    }
  }
  function ps(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(c(191, l));
        l.call(r);
      }
    }
  }
  var vr = {}, Nt = Jt(vr), gr = Jt(vr), wr = Jt(vr);
  function hn(e) {
    if (e === vr) throw Error(c(174));
    return e;
  }
  function Wo(e, t) {
    switch (ie(wr, t), ie(gr, e), ie(Nt, vr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Wl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Wl(t, e);
    }
    se(Nt), ie(Nt, t);
  }
  function $n() {
    se(Nt), se(gr), se(wr);
  }
  function ms(e) {
    hn(wr.current);
    var t = hn(Nt.current), n = Wl(t, e.type);
    t !== n && (ie(gr, e), ie(Nt, n));
  }
  function Ho(e) {
    gr.current === e && (se(Nt), se(gr));
  }
  var de = Jt(0);
  function ml(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Qo = [];
  function Ko() {
    for (var e = 0; e < Qo.length; e++) Qo[e]._workInProgressVersionPrimary = null;
    Qo.length = 0;
  }
  var hl = Ee.ReactCurrentDispatcher, Yo = Ee.ReactCurrentBatchConfig, yn = 0, pe = null, xe = null, Pe = null, yl = !1, kr = !1, Sr = 0, yf = 0;
  function Ue() {
    throw Error(c(321));
  }
  function Xo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!wt(e[n], t[n])) return !1;
    return !0;
  }
  function Go(e, t, n, r, l, o) {
    if (yn = o, pe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, hl.current = e === null || e.memoizedState === null ? kf : Sf, e = n(r, l), kr) {
      o = 0;
      do {
        if (kr = !1, Sr = 0, 25 <= o) throw Error(c(301));
        o += 1, Pe = xe = null, t.updateQueue = null, hl.current = xf, e = n(r, l);
      } while (kr);
    }
    if (hl.current = wl, t = xe !== null && xe.next !== null, yn = 0, Pe = xe = pe = null, yl = !1, t) throw Error(c(300));
    return e;
  }
  function Jo() {
    var e = Sr !== 0;
    return Sr = 0, e;
  }
  function Tt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Pe === null ? pe.memoizedState = Pe = e : Pe = Pe.next = e, Pe;
  }
  function dt() {
    if (xe === null) {
      var e = pe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = xe.next;
    var t = Pe === null ? pe.memoizedState : Pe.next;
    if (t !== null) Pe = t, xe = e;
    else {
      if (e === null) throw Error(c(310));
      xe = e, e = { memoizedState: xe.memoizedState, baseState: xe.baseState, baseQueue: xe.baseQueue, queue: xe.queue, next: null }, Pe === null ? pe.memoizedState = Pe = e : Pe = Pe.next = e;
    }
    return Pe;
  }
  function xr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function qo(e) {
    var t = dt(), n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var r = xe, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        l.next = o.next, o.next = i;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var u = i = null, s = null, h = o;
      do {
        var k = h.lane;
        if ((yn & k) === k) s !== null && (s = s.next = { lane: 0, action: h.action, hasEagerState: h.hasEagerState, eagerState: h.eagerState, next: null }), r = h.hasEagerState ? h.eagerState : e(r, h.action);
        else {
          var S = {
            lane: k,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null
          };
          s === null ? (u = s = S, i = r) : s = s.next = S, pe.lanes |= k, vn |= k;
        }
        h = h.next;
      } while (h !== null && h !== o);
      s === null ? i = r : s.next = u, wt(r, t.memoizedState) || (Je = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = s, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, pe.lanes |= o, vn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Zo(e) {
    var t = dt(), n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = l = l.next;
      do
        o = e(o, i.action), i = i.next;
      while (i !== l);
      wt(o, t.memoizedState) || (Je = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function hs() {
  }
  function ys(e, t) {
    var n = pe, r = dt(), l = t(), o = !wt(r.memoizedState, l);
    if (o && (r.memoizedState = l, Je = !0), r = r.queue, bo(ws.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Pe !== null && Pe.memoizedState.tag & 1) {
      if (n.flags |= 2048, _r(9, gs.bind(null, n, r, l, t), void 0, null), Ne === null) throw Error(c(349));
      (yn & 30) !== 0 || vs(n, t, l);
    }
    return l;
  }
  function vs(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = pe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, pe.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function gs(e, t, n, r) {
    t.value = n, t.getSnapshot = r, ks(t) && Ss(e);
  }
  function ws(e, t, n) {
    return n(function() {
      ks(t) && Ss(e);
    });
  }
  function ks(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !wt(e, n);
    } catch {
      return !0;
    }
  }
  function Ss(e) {
    var t = It(e, 1);
    t !== null && Et(t, e, 1, -1);
  }
  function xs(e) {
    var t = Tt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: xr, lastRenderedState: e }, t.queue = e, e = e.dispatch = wf.bind(null, pe, e), [t.memoizedState, e];
  }
  function _r(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = pe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, pe.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function _s() {
    return dt().memoizedState;
  }
  function vl(e, t, n, r) {
    var l = Tt();
    pe.flags |= e, l.memoizedState = _r(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function gl(e, t, n, r) {
    var l = dt();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (xe !== null) {
      var i = xe.memoizedState;
      if (o = i.destroy, r !== null && Xo(r, i.deps)) {
        l.memoizedState = _r(t, n, o, r);
        return;
      }
    }
    pe.flags |= e, l.memoizedState = _r(1 | t, n, o, r);
  }
  function Es(e, t) {
    return vl(8390656, 8, e, t);
  }
  function bo(e, t) {
    return gl(2048, 8, e, t);
  }
  function Cs(e, t) {
    return gl(4, 2, e, t);
  }
  function Ps(e, t) {
    return gl(4, 4, e, t);
  }
  function Ns(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Ts(e, t, n) {
    return n = n != null ? n.concat([e]) : null, gl(4, 4, Ns.bind(null, t, e), n);
  }
  function ei() {
  }
  function js(e, t) {
    var n = dt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Rs(e, t) {
    var n = dt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xo(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function zs(e, t, n) {
    return (yn & 21) === 0 ? (e.baseState && (e.baseState = !1, Je = !0), e.memoizedState = n) : (wt(n, t) || (n = uu(), pe.lanes |= n, vn |= n, e.baseState = !0), t);
  }
  function vf(e, t) {
    var n = te;
    te = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Yo.transition;
    Yo.transition = {};
    try {
      e(!1), t();
    } finally {
      te = n, Yo.transition = r;
    }
  }
  function Ls() {
    return dt().memoizedState;
  }
  function gf(e, t, n) {
    var r = ln(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Os(e)) Ms(t, n);
    else if (n = cs(e, t, n, r), n !== null) {
      var l = We();
      Et(n, e, r, l), Fs(n, t, r);
    }
  }
  function wf(e, t, n) {
    var r = ln(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Os(e)) Ms(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, u = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = u, wt(u, i)) {
          var s = t.interleaved;
          s === null ? (l.next = l, Bo(t)) : (l.next = s.next, s.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = cs(e, t, l, r), n !== null && (l = We(), Et(n, e, r, l), Fs(n, t, r));
    }
  }
  function Os(e) {
    var t = e.alternate;
    return e === pe || t !== null && t === pe;
  }
  function Ms(e, t) {
    kr = yl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Fs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, to(e, n);
    }
  }
  var wl = { readContext: ft, useCallback: Ue, useContext: Ue, useEffect: Ue, useImperativeHandle: Ue, useInsertionEffect: Ue, useLayoutEffect: Ue, useMemo: Ue, useReducer: Ue, useRef: Ue, useState: Ue, useDebugValue: Ue, useDeferredValue: Ue, useTransition: Ue, useMutableSource: Ue, useSyncExternalStore: Ue, useId: Ue, unstable_isNewReconciler: !1 }, kf = { readContext: ft, useCallback: function(e, t) {
    return Tt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: ft, useEffect: Es, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, vl(
      4194308,
      4,
      Ns.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return vl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return vl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Tt();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Tt();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = gf.bind(null, pe, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Tt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: xs, useDebugValue: ei, useDeferredValue: function(e) {
    return Tt().memoizedState = e;
  }, useTransition: function() {
    var e = xs(!1), t = e[0];
    return e = vf.bind(null, e[1]), Tt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = pe, l = Tt();
    if (ce) {
      if (n === void 0) throw Error(c(407));
      n = n();
    } else {
      if (n = t(), Ne === null) throw Error(c(349));
      (yn & 30) !== 0 || vs(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Es(ws.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, _r(9, gs.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = Tt(), t = Ne.identifierPrefix;
    if (ce) {
      var n = Dt, r = Ft;
      n = (r & ~(1 << 32 - gt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Sr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = yf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Sf = {
    readContext: ft,
    useCallback: js,
    useContext: ft,
    useEffect: bo,
    useImperativeHandle: Ts,
    useInsertionEffect: Cs,
    useLayoutEffect: Ps,
    useMemo: Rs,
    useReducer: qo,
    useRef: _s,
    useState: function() {
      return qo(xr);
    },
    useDebugValue: ei,
    useDeferredValue: function(e) {
      var t = dt();
      return zs(t, xe.memoizedState, e);
    },
    useTransition: function() {
      var e = qo(xr)[0], t = dt().memoizedState;
      return [e, t];
    },
    useMutableSource: hs,
    useSyncExternalStore: ys,
    useId: Ls,
    unstable_isNewReconciler: !1
  }, xf = { readContext: ft, useCallback: js, useContext: ft, useEffect: bo, useImperativeHandle: Ts, useInsertionEffect: Cs, useLayoutEffect: Ps, useMemo: Rs, useReducer: Zo, useRef: _s, useState: function() {
    return Zo(xr);
  }, useDebugValue: ei, useDeferredValue: function(e) {
    var t = dt();
    return xe === null ? t.memoizedState = e : zs(t, xe.memoizedState, e);
  }, useTransition: function() {
    var e = Zo(xr)[0], t = dt().memoizedState;
    return [e, t];
  }, useMutableSource: hs, useSyncExternalStore: ys, useId: Ls, unstable_isNewReconciler: !1 };
  function St(e, t) {
    if (e && e.defaultProps) {
      t = j({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function ti(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : j({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var kl = { isMounted: function(e) {
    return (e = e._reactInternals) ? an(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = We(), l = ln(e), o = Ut(r, l);
    o.payload = t, n != null && (o.callback = n), t = en(e, o, l), t !== null && (Et(t, e, l, r), dl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = We(), l = ln(e), o = Ut(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = en(e, o, l), t !== null && (Et(t, e, l, r), dl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = We(), r = ln(e), l = Ut(n, r);
    l.tag = 2, t != null && (l.callback = t), t = en(e, l, r), t !== null && (Et(t, e, r, n), dl(t, e, r));
  } };
  function Ds(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !ar(n, r) || !ar(l, o) : !0;
  }
  function Is(e, t, n) {
    var r = !1, l = qt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = ft(o) : (l = Ge(t) ? fn : Ie.current, r = t.contextTypes, o = (r = r != null) ? On(e, l) : qt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = kl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Us(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && kl.enqueueReplaceState(t, t.state, null);
  }
  function ni(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Vo(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = ft(o) : (o = Ge(t) ? fn : Ie.current, l.context = On(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (ti(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && kl.enqueueReplaceState(l, l.state, null), pl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Bn(e, t) {
    try {
      var n = "", r = t;
      do
        n += y(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function ri(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function li(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var _f = typeof WeakMap == "function" ? WeakMap : Map;
  function As(e, t, n) {
    n = Ut(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Nl || (Nl = !0, wi = r), li(e, t);
    }, n;
  }
  function $s(e, t, n) {
    n = Ut(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        li(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      li(e, t), typeof r != "function" && (nn === null ? nn = /* @__PURE__ */ new Set([this]) : nn.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function Bs(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new _f();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = If.bind(null, e, t, n), t.then(e, e));
  }
  function Vs(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Ws(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Ut(-1, 1), t.tag = 2, en(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Ef = Ee.ReactCurrentOwner, Je = !1;
  function Ve(e, t, n, r) {
    t.child = e === null ? as(t, null, n, r) : In(t, e.child, n, r);
  }
  function Hs(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return An(t, l), r = Go(e, t, n, r, o, l), n = Jo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, At(e, t, l)) : (ce && n && Lo(t), t.flags |= 1, Ve(e, t, r, l), t.child);
  }
  function Qs(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Pi(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, Ks(e, t, o, r, l)) : (e = Ol(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ar, n(i, r) && e.ref === t.ref) return At(e, t, l);
    }
    return t.flags |= 1, e = un(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Ks(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (ar(o, r) && e.ref === t.ref) if (Je = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Je = !0);
      else return t.lanes = e.lanes, At(e, t, l);
    }
    return oi(e, t, n, r, l);
  }
  function Ys(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, ie(Wn, ut), ut |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, ie(Wn, ut), ut |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, ie(Wn, ut), ut |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, ie(Wn, ut), ut |= r;
    return Ve(e, t, l, n), t.child;
  }
  function Xs(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function oi(e, t, n, r, l) {
    var o = Ge(n) ? fn : Ie.current;
    return o = On(t, o), An(t, l), n = Go(e, t, n, r, o, l), r = Jo(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, At(e, t, l)) : (ce && r && Lo(t), t.flags |= 1, Ve(e, t, n, l), t.child);
  }
  function Gs(e, t, n, r, l) {
    if (Ge(n)) {
      var o = !0;
      ll(t);
    } else o = !1;
    if (An(t, l), t.stateNode === null) xl(e, t), Is(t, n, r), ni(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, u = t.memoizedProps;
      i.props = u;
      var s = i.context, h = n.contextType;
      typeof h == "object" && h !== null ? h = ft(h) : (h = Ge(n) ? fn : Ie.current, h = On(t, h));
      var k = n.getDerivedStateFromProps, S = typeof k == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      S || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== r || s !== h) && Us(t, i, r, h), bt = !1;
      var w = t.memoizedState;
      i.state = w, pl(t, r, i, l), s = t.memoizedState, u !== r || w !== s || Xe.current || bt ? (typeof k == "function" && (ti(t, n, k, r), s = t.memoizedState), (u = bt || Ds(t, n, u, r, w, s, h)) ? (S || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = s), i.props = r, i.state = s, i.context = h, r = u) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, fs(e, t), u = t.memoizedProps, h = t.type === t.elementType ? u : St(t.type, u), i.props = h, S = t.pendingProps, w = i.context, s = n.contextType, typeof s == "object" && s !== null ? s = ft(s) : (s = Ge(n) ? fn : Ie.current, s = On(t, s));
      var T = n.getDerivedStateFromProps;
      (k = typeof T == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== S || w !== s) && Us(t, i, r, s), bt = !1, w = t.memoizedState, i.state = w, pl(t, r, i, l);
      var L = t.memoizedState;
      u !== S || w !== L || Xe.current || bt ? (typeof T == "function" && (ti(t, n, T, r), L = t.memoizedState), (h = bt || Ds(t, n, h, r, w, L, s) || !1) ? (k || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, L, s), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, L, s)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = L), i.props = r, i.state = L, i.context = s, r = h) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return ii(e, t, n, r, o, l);
  }
  function ii(e, t, n, r, l, o) {
    Xs(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && es(t, n, !1), At(e, t, o);
    r = t.stateNode, Ef.current = t;
    var u = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = In(t, e.child, null, o), t.child = In(t, null, u, o)) : Ve(e, t, u, o), t.memoizedState = r.state, l && es(t, n, !0), t.child;
  }
  function Js(e) {
    var t = e.stateNode;
    t.pendingContext ? Zu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Zu(e, t.context, !1), Wo(e, t.containerInfo);
  }
  function qs(e, t, n, r, l) {
    return Dn(), Do(l), t.flags |= 256, Ve(e, t, n, r), t.child;
  }
  var ui = { dehydrated: null, treeContext: null, retryLane: 0 };
  function si(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Zs(e, t, n) {
    var r = t.pendingProps, l = de.current, o = !1, i = (t.flags & 128) !== 0, u;
    if ((u = i) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), ie(de, l & 1), e === null)
      return Fo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = Ml(i, r, 0, null), e = Sn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = si(n), t.memoizedState = ui, e) : ai(t, i));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return Cf(e, t, i, r, u, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, u = l.sibling;
      var s = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = s, t.deletions = null) : (r = un(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? o = un(u, o) : (o = Sn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? si(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = ui, r;
    }
    return o = e.child, e = o.sibling, r = un(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ai(e, t) {
    return t = Ml({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Sl(e, t, n, r) {
    return r !== null && Do(r), In(t, e.child, null, n), e = ai(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Cf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ri(Error(c(422))), Sl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Ml({ mode: "visible", children: r.children }, l, 0, null), o = Sn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && In(t, e.child, null, i), t.child.memoizedState = si(i), t.memoizedState = ui, o);
    if ((t.mode & 1) === 0) return Sl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, o = Error(c(419)), r = ri(o, r, void 0), Sl(e, t, i, r);
    }
    if (u = (i & e.childLanes) !== 0, Je || u) {
      if (r = Ne, r !== null) {
        switch (i & -i) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, It(e, l), Et(r, e, l, -1));
      }
      return Ci(), r = ri(Error(c(421))), Sl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Uf.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, it = Gt(l.nextSibling), ot = t, ce = !0, kt = null, e !== null && (at[ct++] = Ft, at[ct++] = Dt, at[ct++] = dn, Ft = e.id, Dt = e.overflow, dn = t), t = ai(t, r.children), t.flags |= 4096, t);
  }
  function bs(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), $o(e.return, t, n);
  }
  function ci(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function ea(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (Ve(e, t, r.children, n), r = de.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && bs(e, n, t);
        else if (e.tag === 19) bs(e, n, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      r &= 1;
    }
    if (ie(de, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && ml(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), ci(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && ml(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        ci(t, !0, n, null, o);
        break;
      case "together":
        ci(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function xl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function At(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), vn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(c(153));
    if (t.child !== null) {
      for (e = t.child, n = un(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = un(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Pf(e, t, n) {
    switch (t.tag) {
      case 3:
        Js(t), Dn();
        break;
      case 5:
        ms(t);
        break;
      case 1:
        Ge(t.type) && ll(t);
        break;
      case 4:
        Wo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        ie(cl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (ie(de, de.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Zs(e, t, n) : (ie(de, de.current & 1), e = At(e, t, n), e !== null ? e.sibling : null);
        ie(de, de.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ea(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), ie(de, de.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Ys(e, t, n);
    }
    return At(e, t, n);
  }
  var ta, fi, na, ra;
  ta = function(e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }, fi = function() {
  }, na = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, hn(Nt.current);
      var o = null;
      switch (n) {
        case "input":
          l = Lt(e, l), r = Lt(e, r), o = [];
          break;
        case "select":
          l = j({}, l, { value: void 0 }), r = j({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = ze(e, l), r = ze(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = tl);
      }
      Hl(n, r);
      var i;
      n = null;
      for (h in l) if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null) if (h === "style") {
        var u = l[h];
        for (i in u) u.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else h !== "dangerouslySetInnerHTML" && h !== "children" && h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && h !== "autoFocus" && ($.hasOwnProperty(h) ? o || (o = []) : (o = o || []).push(h, null));
      for (h in r) {
        var s = r[h];
        if (u = l != null ? l[h] : void 0, r.hasOwnProperty(h) && s !== u && (s != null || u != null)) if (h === "style") if (u) {
          for (i in u) !u.hasOwnProperty(i) || s && s.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in s) s.hasOwnProperty(i) && u[i] !== s[i] && (n || (n = {}), n[i] = s[i]);
        } else n || (o || (o = []), o.push(
          h,
          n
        )), n = s;
        else h === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, u = u ? u.__html : void 0, s != null && u !== s && (o = o || []).push(h, s)) : h === "children" ? typeof s != "string" && typeof s != "number" || (o = o || []).push(h, "" + s) : h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && ($.hasOwnProperty(h) ? (s != null && h === "onScroll" && ue("scroll", e), o || u === s || (o = [])) : (o = o || []).push(h, s));
      }
      n && (o = o || []).push("style", n);
      var h = o;
      (t.updateQueue = h) && (t.flags |= 4);
    }
  }, ra = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function Er(e, t) {
    if (!ce) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
        n === null ? e.tail = null : n.sibling = null;
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
        r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
    }
  }
  function Ae(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Nf(e, t, n) {
    var r = t.pendingProps;
    switch (Oo(t), t.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ae(t), null;
      case 1:
        return Ge(t.type) && rl(), Ae(t), null;
      case 3:
        return r = t.stateNode, $n(), se(Xe), se(Ie), Ko(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (sl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, kt !== null && (xi(kt), kt = null))), fi(e, t), Ae(t), null;
      case 5:
        Ho(t);
        var l = hn(wr.current);
        if (n = t.type, e !== null && t.stateNode != null) na(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(c(166));
            return Ae(t), null;
          }
          if (e = hn(Nt.current), sl(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[Pt] = t, r[mr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                ue("cancel", r), ue("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ue("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < fr.length; l++) ue(fr[l], r);
                break;
              case "source":
                ue("error", r);
                break;
              case "img":
              case "image":
              case "link":
                ue(
                  "error",
                  r
                ), ue("load", r);
                break;
              case "details":
                ue("toggle", r);
                break;
              case "input":
                Q(r, o), ue("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, ue("invalid", r);
                break;
              case "textarea":
                Lr(r, o), ue("invalid", r);
            }
            Hl(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var u = o[i];
              i === "children" ? typeof u == "string" ? r.textContent !== u && (o.suppressHydrationWarning !== !0 && el(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (o.suppressHydrationWarning !== !0 && el(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : $.hasOwnProperty(i) && u != null && i === "onScroll" && ue("scroll", r);
            }
            switch (n) {
              case "input":
                re(r), Re(r, o, !0);
                break;
              case "textarea":
                re(r), Vi(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = tl);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Wi(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[Pt] = t, e[mr] = r, ta(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Ql(n, r), n) {
                case "dialog":
                  ue("cancel", e), ue("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ue("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < fr.length; l++) ue(fr[l], e);
                  l = r;
                  break;
                case "source":
                  ue("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  ue(
                    "error",
                    e
                  ), ue("load", e), l = r;
                  break;
                case "details":
                  ue("toggle", e), l = r;
                  break;
                case "input":
                  Q(e, r), l = Lt(e, r), ue("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = j({}, r, { value: void 0 }), ue("invalid", e);
                  break;
                case "textarea":
                  Lr(e, r), l = ze(e, r), ue("invalid", e);
                  break;
                default:
                  l = r;
              }
              Hl(n, l), u = l;
              for (o in u) if (u.hasOwnProperty(o)) {
                var s = u[o];
                o === "style" ? Ki(e, s) : o === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Hi(e, s)) : o === "children" ? typeof s == "string" ? (n !== "textarea" || s !== "") && Kn(e, s) : typeof s == "number" && Kn(e, "" + s) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && ($.hasOwnProperty(o) ? s != null && o === "onScroll" && ue("scroll", e) : s != null && tt(e, o, s, i));
              }
              switch (n) {
                case "input":
                  re(e), Re(e, r, !1);
                  break;
                case "textarea":
                  re(e), Vi(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + A(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? rt(e, !!r.multiple, o, !1) : r.defaultValue != null && rt(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = tl);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return Ae(t), null;
      case 6:
        if (e && t.stateNode != null) ra(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(c(166));
          if (n = hn(wr.current), hn(Nt.current), sl(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[Pt] = t, (o = r.nodeValue !== n) && (e = ot, e !== null)) switch (e.tag) {
              case 3:
                el(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && el(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Pt] = t, t.stateNode = r;
        }
        return Ae(t), null;
      case 13:
        if (se(de), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ce && it !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) is(), Dn(), t.flags |= 98560, o = !1;
          else if (o = sl(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(c(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(c(317));
              o[Pt] = t;
            } else Dn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ae(t), o = !1;
          } else kt !== null && (xi(kt), kt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (de.current & 1) !== 0 ? _e === 0 && (_e = 3) : Ci())), t.updateQueue !== null && (t.flags |= 4), Ae(t), null);
      case 4:
        return $n(), fi(e, t), e === null && dr(t.stateNode.containerInfo), Ae(t), null;
      case 10:
        return Ao(t.type._context), Ae(t), null;
      case 17:
        return Ge(t.type) && rl(), Ae(t), null;
      case 19:
        if (se(de), o = t.memoizedState, o === null) return Ae(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) Er(o, !1);
        else {
          if (_e !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = ml(e), i !== null) {
              for (t.flags |= 128, Er(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return ie(de, de.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && ve() > Hn && (t.flags |= 128, r = !0, Er(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = ml(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Er(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ce) return Ae(t), null;
          } else 2 * ve() - o.renderingStartTime > Hn && n !== 1073741824 && (t.flags |= 128, r = !0, Er(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = ve(), t.sibling = null, n = de.current, ie(de, r ? n & 1 | 2 : n & 1), t) : (Ae(t), null);
      case 22:
      case 23:
        return Ei(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (ut & 1073741824) !== 0 && (Ae(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ae(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(c(156, t.tag));
  }
  function Tf(e, t) {
    switch (Oo(t), t.tag) {
      case 1:
        return Ge(t.type) && rl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return $n(), se(Xe), se(Ie), Ko(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Ho(t), null;
      case 13:
        if (se(de), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(c(340));
          Dn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return se(de), null;
      case 4:
        return $n(), null;
      case 10:
        return Ao(t.type._context), null;
      case 22:
      case 23:
        return Ei(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var _l = !1, $e = !1, jf = typeof WeakSet == "function" ? WeakSet : Set, R = null;
  function Vn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      me(e, t, r);
    }
    else n.current = null;
  }
  function di(e, t, n) {
    try {
      n();
    } catch (r) {
      me(e, t, r);
    }
  }
  var la = !1;
  function Rf(e, t) {
    if (Eo = Wr, e = Du(), yo(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset, o = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, o.nodeType;
          } catch {
            n = null;
            break e;
          }
          var i = 0, u = -1, s = -1, h = 0, k = 0, S = e, w = null;
          t: for (; ; ) {
            for (var T; S !== n || l !== 0 && S.nodeType !== 3 || (u = i + l), S !== o || r !== 0 && S.nodeType !== 3 || (s = i + r), S.nodeType === 3 && (i += S.nodeValue.length), (T = S.firstChild) !== null; )
              w = S, S = T;
            for (; ; ) {
              if (S === e) break t;
              if (w === n && ++h === l && (u = i), w === o && ++k === r && (s = i), (T = S.nextSibling) !== null) break;
              S = w, w = S.parentNode;
            }
            S = T;
          }
          n = u === -1 || s === -1 ? null : { start: u, end: s };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Co = { focusedElem: e, selectionRange: n }, Wr = !1, R = t; R !== null; ) if (t = R, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, R = e;
    else for (; R !== null; ) {
      t = R;
      try {
        var L = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (L !== null) {
              var O = L.memoizedProps, ge = L.memoizedState, d = t.stateNode, a = d.getSnapshotBeforeUpdate(t.elementType === t.type ? O : St(t.type, O), ge);
              d.__reactInternalSnapshotBeforeUpdate = a;
            }
            break;
          case 3:
            var p = t.stateNode.containerInfo;
            p.nodeType === 1 ? p.textContent = "" : p.nodeType === 9 && p.documentElement && p.removeChild(p.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(c(163));
        }
      } catch (_) {
        me(t, t.return, _);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, R = e;
        break;
      }
      R = t.return;
    }
    return L = la, la = !1, L;
  }
  function Cr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && di(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function El(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var n = t = t.next;
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function pi(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function oa(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, oa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Pt], delete t[mr], delete t[jo], delete t[df], delete t[pf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function ia(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ua(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || ia(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function mi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = tl));
    else if (r !== 4 && (e = e.child, e !== null)) for (mi(e, t, n), e = e.sibling; e !== null; ) mi(e, t, n), e = e.sibling;
  }
  function hi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (hi(e, t, n), e = e.sibling; e !== null; ) hi(e, t, n), e = e.sibling;
  }
  var Le = null, xt = !1;
  function tn(e, t, n) {
    for (n = n.child; n !== null; ) sa(e, t, n), n = n.sibling;
  }
  function sa(e, t, n) {
    if (Ct && typeof Ct.onCommitFiberUnmount == "function") try {
      Ct.onCommitFiberUnmount(Ir, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        $e || Vn(n, t);
      case 6:
        var r = Le, l = xt;
        Le = null, tn(e, t, n), Le = r, xt = l, Le !== null && (xt ? (e = Le, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Le.removeChild(n.stateNode));
        break;
      case 18:
        Le !== null && (xt ? (e = Le, n = n.stateNode, e.nodeType === 8 ? To(e.parentNode, n) : e.nodeType === 1 && To(e, n), rr(e)) : To(Le, n.stateNode));
        break;
      case 4:
        r = Le, l = xt, Le = n.stateNode.containerInfo, xt = !0, tn(e, t, n), Le = r, xt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!$e && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && di(n, t, i), l = l.next;
          } while (l !== r);
        }
        tn(e, t, n);
        break;
      case 1:
        if (!$e && (Vn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          me(n, t, u);
        }
        tn(e, t, n);
        break;
      case 21:
        tn(e, t, n);
        break;
      case 22:
        n.mode & 1 ? ($e = (r = $e) || n.memoizedState !== null, tn(e, t, n), $e = r) : tn(e, t, n);
        break;
      default:
        tn(e, t, n);
    }
  }
  function aa(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new jf()), t.forEach(function(r) {
        var l = Af.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function _t(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, u = i;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              Le = u.stateNode, xt = !1;
              break e;
            case 3:
              Le = u.stateNode.containerInfo, xt = !0;
              break e;
            case 4:
              Le = u.stateNode.containerInfo, xt = !0;
              break e;
          }
          u = u.return;
        }
        if (Le === null) throw Error(c(160));
        sa(o, i, l), Le = null, xt = !1;
        var s = l.alternate;
        s !== null && (s.return = null), l.return = null;
      } catch (h) {
        me(l, t, h);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) ca(t, e), t = t.sibling;
  }
  function ca(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (_t(t, e), jt(e), r & 4) {
          try {
            Cr(3, e, e.return), El(3, e);
          } catch (O) {
            me(e, e.return, O);
          }
          try {
            Cr(5, e, e.return);
          } catch (O) {
            me(e, e.return, O);
          }
        }
        break;
      case 1:
        _t(t, e), jt(e), r & 512 && n !== null && Vn(n, n.return);
        break;
      case 5:
        if (_t(t, e), jt(e), r & 512 && n !== null && Vn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Kn(l, "");
          } catch (O) {
            me(e, e.return, O);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, u = e.type, s = e.updateQueue;
          if (e.updateQueue = null, s !== null) try {
            u === "input" && o.type === "radio" && o.name != null && yt(l, o), Ql(u, i);
            var h = Ql(u, o);
            for (i = 0; i < s.length; i += 2) {
              var k = s[i], S = s[i + 1];
              k === "style" ? Ki(l, S) : k === "dangerouslySetInnerHTML" ? Hi(l, S) : k === "children" ? Kn(l, S) : tt(l, k, S, h);
            }
            switch (u) {
              case "input":
                st(l, o);
                break;
              case "textarea":
                Bi(l, o);
                break;
              case "select":
                var w = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var T = o.value;
                T != null ? rt(l, !!o.multiple, T, !1) : w !== !!o.multiple && (o.defaultValue != null ? rt(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : rt(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[mr] = o;
          } catch (O) {
            me(e, e.return, O);
          }
        }
        break;
      case 6:
        if (_t(t, e), jt(e), r & 4) {
          if (e.stateNode === null) throw Error(c(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (O) {
            me(e, e.return, O);
          }
        }
        break;
      case 3:
        if (_t(t, e), jt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          rr(t.containerInfo);
        } catch (O) {
          me(e, e.return, O);
        }
        break;
      case 4:
        _t(t, e), jt(e);
        break;
      case 13:
        _t(t, e), jt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (gi = ve())), r & 4 && aa(e);
        break;
      case 22:
        if (k = n !== null && n.memoizedState !== null, e.mode & 1 ? ($e = (h = $e) || k, _t(t, e), $e = h) : _t(t, e), jt(e), r & 8192) {
          if (h = e.memoizedState !== null, (e.stateNode.isHidden = h) && !k && (e.mode & 1) !== 0) for (R = e, k = e.child; k !== null; ) {
            for (S = R = k; R !== null; ) {
              switch (w = R, T = w.child, w.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Cr(4, w, w.return);
                  break;
                case 1:
                  Vn(w, w.return);
                  var L = w.stateNode;
                  if (typeof L.componentWillUnmount == "function") {
                    r = w, n = w.return;
                    try {
                      t = r, L.props = t.memoizedProps, L.state = t.memoizedState, L.componentWillUnmount();
                    } catch (O) {
                      me(r, n, O);
                    }
                  }
                  break;
                case 5:
                  Vn(w, w.return);
                  break;
                case 22:
                  if (w.memoizedState !== null) {
                    pa(S);
                    continue;
                  }
              }
              T !== null ? (T.return = w, R = T) : pa(S);
            }
            k = k.sibling;
          }
          e: for (k = null, S = e; ; ) {
            if (S.tag === 5) {
              if (k === null) {
                k = S;
                try {
                  l = S.stateNode, h ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (u = S.stateNode, s = S.memoizedProps.style, i = s != null && s.hasOwnProperty("display") ? s.display : null, u.style.display = Qi("display", i));
                } catch (O) {
                  me(e, e.return, O);
                }
              }
            } else if (S.tag === 6) {
              if (k === null) try {
                S.stateNode.nodeValue = h ? "" : S.memoizedProps;
              } catch (O) {
                me(e, e.return, O);
              }
            } else if ((S.tag !== 22 && S.tag !== 23 || S.memoizedState === null || S === e) && S.child !== null) {
              S.child.return = S, S = S.child;
              continue;
            }
            if (S === e) break e;
            for (; S.sibling === null; ) {
              if (S.return === null || S.return === e) break e;
              k === S && (k = null), S = S.return;
            }
            k === S && (k = null), S.sibling.return = S.return, S = S.sibling;
          }
        }
        break;
      case 19:
        _t(t, e), jt(e), r & 4 && aa(e);
        break;
      case 21:
        break;
      default:
        _t(
          t,
          e
        ), jt(e);
    }
  }
  function jt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (ia(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(c(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Kn(l, ""), r.flags &= -33);
            var o = ua(e);
            hi(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, u = ua(e);
            mi(e, u, i);
            break;
          default:
            throw Error(c(161));
        }
      } catch (s) {
        me(e, e.return, s);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function zf(e, t, n) {
    R = e, fa(e);
  }
  function fa(e, t, n) {
    for (var r = (e.mode & 1) !== 0; R !== null; ) {
      var l = R, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || _l;
        if (!i) {
          var u = l.alternate, s = u !== null && u.memoizedState !== null || $e;
          u = _l;
          var h = $e;
          if (_l = i, ($e = s) && !h) for (R = l; R !== null; ) i = R, s = i.child, i.tag === 22 && i.memoizedState !== null ? ma(l) : s !== null ? (s.return = i, R = s) : ma(l);
          for (; o !== null; ) R = o, fa(o), o = o.sibling;
          R = l, _l = u, $e = h;
        }
        da(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, R = o) : da(e);
    }
  }
  function da(e) {
    for (; R !== null; ) {
      var t = R;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              $e || El(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !$e) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : St(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && ps(t, o, r);
              break;
            case 3:
              var i = t.updateQueue;
              if (i !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                ps(t, i, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
                var s = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    s.autoFocus && n.focus();
                    break;
                  case "img":
                    s.src && (n.src = s.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var h = t.alternate;
                if (h !== null) {
                  var k = h.memoizedState;
                  if (k !== null) {
                    var S = k.dehydrated;
                    S !== null && rr(S);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(c(163));
          }
          $e || t.flags & 512 && pi(t);
        } catch (w) {
          me(t, t.return, w);
        }
      }
      if (t === e) {
        R = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, R = n;
        break;
      }
      R = t.return;
    }
  }
  function pa(e) {
    for (; R !== null; ) {
      var t = R;
      if (t === e) {
        R = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, R = n;
        break;
      }
      R = t.return;
    }
  }
  function ma(e) {
    for (; R !== null; ) {
      var t = R;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              El(4, t);
            } catch (s) {
              me(t, n, s);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (s) {
                me(t, l, s);
              }
            }
            var o = t.return;
            try {
              pi(t);
            } catch (s) {
              me(t, o, s);
            }
            break;
          case 5:
            var i = t.return;
            try {
              pi(t);
            } catch (s) {
              me(t, i, s);
            }
        }
      } catch (s) {
        me(t, t.return, s);
      }
      if (t === e) {
        R = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, R = u;
        break;
      }
      R = t.return;
    }
  }
  var Lf = Math.ceil, Cl = Ee.ReactCurrentDispatcher, yi = Ee.ReactCurrentOwner, pt = Ee.ReactCurrentBatchConfig, G = 0, Ne = null, ke = null, Oe = 0, ut = 0, Wn = Jt(0), _e = 0, Pr = null, vn = 0, Pl = 0, vi = 0, Nr = null, qe = null, gi = 0, Hn = 1 / 0, $t = null, Nl = !1, wi = null, nn = null, Tl = !1, rn = null, jl = 0, Tr = 0, ki = null, Rl = -1, zl = 0;
  function We() {
    return (G & 6) !== 0 ? ve() : Rl !== -1 ? Rl : Rl = ve();
  }
  function ln(e) {
    return (e.mode & 1) === 0 ? 1 : (G & 2) !== 0 && Oe !== 0 ? Oe & -Oe : hf.transition !== null ? (zl === 0 && (zl = uu()), zl) : (e = te, e !== 0 || (e = window.event, e = e === void 0 ? 16 : yu(e.type)), e);
  }
  function Et(e, t, n, r) {
    if (50 < Tr) throw Tr = 0, ki = null, Error(c(185));
    Zn(e, n, r), ((G & 2) === 0 || e !== Ne) && (e === Ne && ((G & 2) === 0 && (Pl |= n), _e === 4 && on(e, Oe)), Ze(e, r), n === 1 && G === 0 && (t.mode & 1) === 0 && (Hn = ve() + 500, ol && Zt()));
  }
  function Ze(e, t) {
    var n = e.callbackNode;
    mc(e, t);
    var r = $r(e, e === Ne ? Oe : 0);
    if (r === 0) n !== null && lu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && lu(n), t === 1) e.tag === 0 ? mf(ya.bind(null, e)) : ts(ya.bind(null, e)), cf(function() {
        (G & 6) === 0 && Zt();
      }), n = null;
      else {
        switch (su(r)) {
          case 1:
            n = Zl;
            break;
          case 4:
            n = ou;
            break;
          case 16:
            n = Dr;
            break;
          case 536870912:
            n = iu;
            break;
          default:
            n = Dr;
        }
        n = Ea(n, ha.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function ha(e, t) {
    if (Rl = -1, zl = 0, (G & 6) !== 0) throw Error(c(327));
    var n = e.callbackNode;
    if (Qn() && e.callbackNode !== n) return null;
    var r = $r(e, e === Ne ? Oe : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ll(e, r);
    else {
      t = r;
      var l = G;
      G |= 2;
      var o = ga();
      (Ne !== e || Oe !== t) && ($t = null, Hn = ve() + 500, wn(e, t));
      do
        try {
          Ff();
          break;
        } catch (u) {
          va(e, u);
        }
      while (!0);
      Uo(), Cl.current = o, G = l, ke !== null ? t = 0 : (Ne = null, Oe = 0, t = _e);
    }
    if (t !== 0) {
      if (t === 2 && (l = bl(e), l !== 0 && (r = l, t = Si(e, l))), t === 1) throw n = Pr, wn(e, 0), on(e, r), Ze(e, ve()), n;
      if (t === 6) on(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Of(l) && (t = Ll(e, r), t === 2 && (o = bl(e), o !== 0 && (r = o, t = Si(e, o))), t === 1)) throw n = Pr, wn(e, 0), on(e, r), Ze(e, ve()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(c(345));
          case 2:
            kn(e, qe, $t);
            break;
          case 3:
            if (on(e, r), (r & 130023424) === r && (t = gi + 500 - ve(), 10 < t)) {
              if ($r(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                We(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = No(kn.bind(null, e, qe, $t), t);
              break;
            }
            kn(e, qe, $t);
            break;
          case 4:
            if (on(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - gt(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = ve() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Lf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = No(kn.bind(null, e, qe, $t), r);
              break;
            }
            kn(e, qe, $t);
            break;
          case 5:
            kn(e, qe, $t);
            break;
          default:
            throw Error(c(329));
        }
      }
    }
    return Ze(e, ve()), e.callbackNode === n ? ha.bind(null, e) : null;
  }
  function Si(e, t) {
    var n = Nr;
    return e.current.memoizedState.isDehydrated && (wn(e, t).flags |= 256), e = Ll(e, t), e !== 2 && (t = qe, qe = n, t !== null && xi(t)), e;
  }
  function xi(e) {
    qe === null ? qe = e : qe.push.apply(qe, e);
  }
  function Of(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], o = l.getSnapshot;
          l = l.value;
          try {
            if (!wt(o(), l)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function on(e, t) {
    for (t &= ~vi, t &= ~Pl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - gt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function ya(e) {
    if ((G & 6) !== 0) throw Error(c(327));
    Qn();
    var t = $r(e, 0);
    if ((t & 1) === 0) return Ze(e, ve()), null;
    var n = Ll(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = bl(e);
      r !== 0 && (t = r, n = Si(e, r));
    }
    if (n === 1) throw n = Pr, wn(e, 0), on(e, t), Ze(e, ve()), n;
    if (n === 6) throw Error(c(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, kn(e, qe, $t), Ze(e, ve()), null;
  }
  function _i(e, t) {
    var n = G;
    G |= 1;
    try {
      return e(t);
    } finally {
      G = n, G === 0 && (Hn = ve() + 500, ol && Zt());
    }
  }
  function gn(e) {
    rn !== null && rn.tag === 0 && (G & 6) === 0 && Qn();
    var t = G;
    G |= 1;
    var n = pt.transition, r = te;
    try {
      if (pt.transition = null, te = 1, e) return e();
    } finally {
      te = r, pt.transition = n, G = t, (G & 6) === 0 && Zt();
    }
  }
  function Ei() {
    ut = Wn.current, se(Wn);
  }
  function wn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, af(n)), ke !== null) for (n = ke.return; n !== null; ) {
      var r = n;
      switch (Oo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && rl();
          break;
        case 3:
          $n(), se(Xe), se(Ie), Ko();
          break;
        case 5:
          Ho(r);
          break;
        case 4:
          $n();
          break;
        case 13:
          se(de);
          break;
        case 19:
          se(de);
          break;
        case 10:
          Ao(r.type._context);
          break;
        case 22:
        case 23:
          Ei();
      }
      n = n.return;
    }
    if (Ne = e, ke = e = un(e.current, null), Oe = ut = t, _e = 0, Pr = null, vi = Pl = vn = 0, qe = Nr = null, mn !== null) {
      for (t = 0; t < mn.length; t++) if (n = mn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      mn = null;
    }
    return e;
  }
  function va(e, t) {
    do {
      var n = ke;
      try {
        if (Uo(), hl.current = wl, yl) {
          for (var r = pe.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          yl = !1;
        }
        if (yn = 0, Pe = xe = pe = null, kr = !1, Sr = 0, yi.current = null, n === null || n.return === null) {
          _e = 1, Pr = t, ke = null;
          break;
        }
        e: {
          var o = e, i = n.return, u = n, s = t;
          if (t = Oe, u.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
            var h = s, k = u, S = k.tag;
            if ((k.mode & 1) === 0 && (S === 0 || S === 11 || S === 15)) {
              var w = k.alternate;
              w ? (k.updateQueue = w.updateQueue, k.memoizedState = w.memoizedState, k.lanes = w.lanes) : (k.updateQueue = null, k.memoizedState = null);
            }
            var T = Vs(i);
            if (T !== null) {
              T.flags &= -257, Ws(T, i, u, o, t), T.mode & 1 && Bs(o, h, t), t = T, s = h;
              var L = t.updateQueue;
              if (L === null) {
                var O = /* @__PURE__ */ new Set();
                O.add(s), t.updateQueue = O;
              } else L.add(s);
              break e;
            } else {
              if ((t & 1) === 0) {
                Bs(o, h, t), Ci();
                break e;
              }
              s = Error(c(426));
            }
          } else if (ce && u.mode & 1) {
            var ge = Vs(i);
            if (ge !== null) {
              (ge.flags & 65536) === 0 && (ge.flags |= 256), Ws(ge, i, u, o, t), Do(Bn(s, u));
              break e;
            }
          }
          o = s = Bn(s, u), _e !== 4 && (_e = 2), Nr === null ? Nr = [o] : Nr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var d = As(o, s, t);
                ds(o, d);
                break e;
              case 1:
                u = s;
                var a = o.type, p = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof a.getDerivedStateFromError == "function" || p !== null && typeof p.componentDidCatch == "function" && (nn === null || !nn.has(p)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var _ = $s(o, u, t);
                  ds(o, _);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        ka(n);
      } catch (M) {
        t = M, ke === n && n !== null && (ke = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ga() {
    var e = Cl.current;
    return Cl.current = wl, e === null ? wl : e;
  }
  function Ci() {
    (_e === 0 || _e === 3 || _e === 2) && (_e = 4), Ne === null || (vn & 268435455) === 0 && (Pl & 268435455) === 0 || on(Ne, Oe);
  }
  function Ll(e, t) {
    var n = G;
    G |= 2;
    var r = ga();
    (Ne !== e || Oe !== t) && ($t = null, wn(e, t));
    do
      try {
        Mf();
        break;
      } catch (l) {
        va(e, l);
      }
    while (!0);
    if (Uo(), G = n, Cl.current = r, ke !== null) throw Error(c(261));
    return Ne = null, Oe = 0, _e;
  }
  function Mf() {
    for (; ke !== null; ) wa(ke);
  }
  function Ff() {
    for (; ke !== null && !oc(); ) wa(ke);
  }
  function wa(e) {
    var t = _a(e.alternate, e, ut);
    e.memoizedProps = e.pendingProps, t === null ? ka(e) : ke = t, yi.current = null;
  }
  function ka(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Nf(n, t, ut), n !== null) {
          ke = n;
          return;
        }
      } else {
        if (n = Tf(n, t), n !== null) {
          n.flags &= 32767, ke = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          _e = 6, ke = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        ke = t;
        return;
      }
      ke = t = e;
    } while (t !== null);
    _e === 0 && (_e = 5);
  }
  function kn(e, t, n) {
    var r = te, l = pt.transition;
    try {
      pt.transition = null, te = 1, Df(e, t, n, r);
    } finally {
      pt.transition = l, te = r;
    }
    return null;
  }
  function Df(e, t, n, r) {
    do
      Qn();
    while (rn !== null);
    if ((G & 6) !== 0) throw Error(c(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(c(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (hc(e, o), e === Ne && (ke = Ne = null, Oe = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Tl || (Tl = !0, Ea(Dr, function() {
      return Qn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = pt.transition, pt.transition = null;
      var i = te;
      te = 1;
      var u = G;
      G |= 4, yi.current = null, Rf(e, n), ca(n, e), tf(Co), Wr = !!Eo, Co = Eo = null, e.current = n, zf(n), ic(), G = u, te = i, pt.transition = o;
    } else e.current = n;
    if (Tl && (Tl = !1, rn = e, jl = l), o = e.pendingLanes, o === 0 && (nn = null), ac(n.stateNode), Ze(e, ve()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Nl) throw Nl = !1, e = wi, wi = null, e;
    return (jl & 1) !== 0 && e.tag !== 0 && Qn(), o = e.pendingLanes, (o & 1) !== 0 ? e === ki ? Tr++ : (Tr = 0, ki = e) : Tr = 0, Zt(), null;
  }
  function Qn() {
    if (rn !== null) {
      var e = su(jl), t = pt.transition, n = te;
      try {
        if (pt.transition = null, te = 16 > e ? 16 : e, rn === null) var r = !1;
        else {
          if (e = rn, rn = null, jl = 0, (G & 6) !== 0) throw Error(c(331));
          var l = G;
          for (G |= 4, R = e.current; R !== null; ) {
            var o = R, i = o.child;
            if ((R.flags & 16) !== 0) {
              var u = o.deletions;
              if (u !== null) {
                for (var s = 0; s < u.length; s++) {
                  var h = u[s];
                  for (R = h; R !== null; ) {
                    var k = R;
                    switch (k.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Cr(8, k, o);
                    }
                    var S = k.child;
                    if (S !== null) S.return = k, R = S;
                    else for (; R !== null; ) {
                      k = R;
                      var w = k.sibling, T = k.return;
                      if (oa(k), k === h) {
                        R = null;
                        break;
                      }
                      if (w !== null) {
                        w.return = T, R = w;
                        break;
                      }
                      R = T;
                    }
                  }
                }
                var L = o.alternate;
                if (L !== null) {
                  var O = L.child;
                  if (O !== null) {
                    L.child = null;
                    do {
                      var ge = O.sibling;
                      O.sibling = null, O = ge;
                    } while (O !== null);
                  }
                }
                R = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, R = i;
            else e: for (; R !== null; ) {
              if (o = R, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  Cr(9, o, o.return);
              }
              var d = o.sibling;
              if (d !== null) {
                d.return = o.return, R = d;
                break e;
              }
              R = o.return;
            }
          }
          var a = e.current;
          for (R = a; R !== null; ) {
            i = R;
            var p = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && p !== null) p.return = i, R = p;
            else e: for (i = a; R !== null; ) {
              if (u = R, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    El(9, u);
                }
              } catch (M) {
                me(u, u.return, M);
              }
              if (u === i) {
                R = null;
                break e;
              }
              var _ = u.sibling;
              if (_ !== null) {
                _.return = u.return, R = _;
                break e;
              }
              R = u.return;
            }
          }
          if (G = l, Zt(), Ct && typeof Ct.onPostCommitFiberRoot == "function") try {
            Ct.onPostCommitFiberRoot(Ir, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        te = n, pt.transition = t;
      }
    }
    return !1;
  }
  function Sa(e, t, n) {
    t = Bn(n, t), t = As(e, t, 1), e = en(e, t, 1), t = We(), e !== null && (Zn(e, 1, t), Ze(e, t));
  }
  function me(e, t, n) {
    if (e.tag === 3) Sa(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Sa(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (nn === null || !nn.has(r))) {
          e = Bn(n, e), e = $s(t, e, 1), t = en(t, e, 1), e = We(), t !== null && (Zn(t, 1, e), Ze(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function If(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = We(), e.pingedLanes |= e.suspendedLanes & n, Ne === e && (Oe & n) === n && (_e === 4 || _e === 3 && (Oe & 130023424) === Oe && 500 > ve() - gi ? wn(e, 0) : vi |= n), Ze(e, t);
  }
  function xa(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Ar, Ar <<= 1, (Ar & 130023424) === 0 && (Ar = 4194304)));
    var n = We();
    e = It(e, t), e !== null && (Zn(e, t, n), Ze(e, n));
  }
  function Uf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), xa(e, n);
  }
  function Af(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(c(314));
    }
    r !== null && r.delete(t), xa(e, n);
  }
  var _a;
  _a = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Xe.current) Je = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Je = !1, Pf(e, t, n);
      Je = (e.flags & 131072) !== 0;
    }
    else Je = !1, ce && (t.flags & 1048576) !== 0 && ns(t, ul, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        xl(e, t), e = t.pendingProps;
        var l = On(t, Ie.current);
        An(t, n), l = Go(null, t, r, e, l, n);
        var o = Jo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ge(r) ? (o = !0, ll(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Vo(t), l.updater = kl, t.stateNode = l, l._reactInternals = t, ni(t, r, e, n), t = ii(null, t, r, !0, o, n)) : (t.tag = 0, ce && o && Lo(t), Ve(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (xl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Bf(r), e = St(r, e), l) {
            case 0:
              t = oi(null, t, r, e, n);
              break e;
            case 1:
              t = Gs(null, t, r, e, n);
              break e;
            case 11:
              t = Hs(null, t, r, e, n);
              break e;
            case 14:
              t = Qs(null, t, r, St(r.type, e), n);
              break e;
          }
          throw Error(c(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : St(r, l), oi(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : St(r, l), Gs(e, t, r, l, n);
      case 3:
        e: {
          if (Js(t), e === null) throw Error(c(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, fs(e, t), pl(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Bn(Error(c(423)), t), t = qs(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Bn(Error(c(424)), t), t = qs(e, t, r, n, l);
            break e;
          } else for (it = Gt(t.stateNode.containerInfo.firstChild), ot = t, ce = !0, kt = null, n = as(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Dn(), r === l) {
              t = At(e, t, n);
              break e;
            }
            Ve(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return ms(t), e === null && Fo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Po(r, l) ? i = null : o !== null && Po(r, o) && (t.flags |= 32), Xs(e, t), Ve(e, t, i, n), t.child;
      case 6:
        return e === null && Fo(t), null;
      case 13:
        return Zs(e, t, n);
      case 4:
        return Wo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = In(t, null, r, n) : Ve(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : St(r, l), Hs(e, t, r, l, n);
      case 7:
        return Ve(e, t, t.pendingProps, n), t.child;
      case 8:
        return Ve(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Ve(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, ie(cl, r._currentValue), r._currentValue = i, o !== null) if (wt(o.value, i)) {
            if (o.children === l.children && !Xe.current) {
              t = At(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var u = o.dependencies;
            if (u !== null) {
              i = o.child;
              for (var s = u.firstContext; s !== null; ) {
                if (s.context === r) {
                  if (o.tag === 1) {
                    s = Ut(-1, n & -n), s.tag = 2;
                    var h = o.updateQueue;
                    if (h !== null) {
                      h = h.shared;
                      var k = h.pending;
                      k === null ? s.next = s : (s.next = k.next, k.next = s), h.pending = s;
                    }
                  }
                  o.lanes |= n, s = o.alternate, s !== null && (s.lanes |= n), $o(
                    o.return,
                    n,
                    t
                  ), u.lanes |= n;
                  break;
                }
                s = s.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(c(341));
              i.lanes |= n, u = i.alternate, u !== null && (u.lanes |= n), $o(i, n, t), i = o.sibling;
            } else i = o.child;
            if (i !== null) i.return = o;
            else for (i = o; i !== null; ) {
              if (i === t) {
                i = null;
                break;
              }
              if (o = i.sibling, o !== null) {
                o.return = i.return, i = o;
                break;
              }
              i = i.return;
            }
            o = i;
          }
          Ve(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, An(t, n), l = ft(l), r = r(l), t.flags |= 1, Ve(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = St(r, t.pendingProps), l = St(r.type, l), Qs(e, t, r, l, n);
      case 15:
        return Ks(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : St(r, l), xl(e, t), t.tag = 1, Ge(r) ? (e = !0, ll(t)) : e = !1, An(t, n), Is(t, r, l), ni(t, r, l, n), ii(null, t, r, !0, e, n);
      case 19:
        return ea(e, t, n);
      case 22:
        return Ys(e, t, n);
    }
    throw Error(c(156, t.tag));
  };
  function Ea(e, t) {
    return ru(e, t);
  }
  function $f(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function mt(e, t, n, r) {
    return new $f(e, t, n, r);
  }
  function Pi(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Bf(e) {
    if (typeof e == "function") return Pi(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === nt) return 11;
      if (e === Fe) return 14;
    }
    return 2;
  }
  function un(e, t) {
    var n = e.alternate;
    return n === null ? (n = mt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Ol(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Pi(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case le:
        return Sn(n.children, l, o, t);
      case Se:
        i = 8, l |= 8;
        break;
      case ht:
        return e = mt(12, n, t, l | 2), e.elementType = ht, e.lanes = o, e;
      case Ce:
        return e = mt(13, n, t, l), e.elementType = Ce, e.lanes = o, e;
      case Ye:
        return e = mt(19, n, t, l), e.elementType = Ye, e.lanes = o, e;
      case ae:
        return Ml(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Qe:
            i = 10;
            break e;
          case Ke:
            i = 9;
            break e;
          case nt:
            i = 11;
            break e;
          case Fe:
            i = 14;
            break e;
          case De:
            i = 16, r = null;
            break e;
        }
        throw Error(c(130, e == null ? e : typeof e, ""));
    }
    return t = mt(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function Sn(e, t, n, r) {
    return e = mt(7, e, r, t), e.lanes = n, e;
  }
  function Ml(e, t, n, r) {
    return e = mt(22, e, r, t), e.elementType = ae, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Ni(e, t, n) {
    return e = mt(6, e, null, t), e.lanes = n, e;
  }
  function Ti(e, t, n) {
    return t = mt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Vf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = eo(0), this.expirationTimes = eo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = eo(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function ji(e, t, n, r, l, o, i, u, s) {
    return e = new Vf(e, t, n, u, s), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = mt(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Vo(o), e;
  }
  function Wf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ye, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Ca(e) {
    if (!e) return qt;
    e = e._reactInternals;
    e: {
      if (an(e) !== e || e.tag !== 1) throw Error(c(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ge(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(c(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ge(n)) return bu(e, n, t);
    }
    return t;
  }
  function Pa(e, t, n, r, l, o, i, u, s) {
    return e = ji(n, r, !0, e, l, o, i, u, s), e.context = Ca(null), n = e.current, r = We(), l = ln(n), o = Ut(r, l), o.callback = t ?? null, en(n, o, l), e.current.lanes = l, Zn(e, l, r), Ze(e, r), e;
  }
  function Fl(e, t, n, r) {
    var l = t.current, o = We(), i = ln(l);
    return n = Ca(n), t.context === null ? t.context = n : t.pendingContext = n, t = Ut(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = en(l, t, i), e !== null && (Et(e, l, i, o), dl(e, l, i)), i;
  }
  function Dl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Na(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Ri(e, t) {
    Na(e, t), (e = e.alternate) && Na(e, t);
  }
  function Hf() {
    return null;
  }
  var Ta = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function zi(e) {
    this._internalRoot = e;
  }
  Il.prototype.render = zi.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(c(409));
    Fl(e, t, null, null);
  }, Il.prototype.unmount = zi.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      gn(function() {
        Fl(null, e, null, null);
      }), t[Ot] = null;
    }
  };
  function Il(e) {
    this._internalRoot = e;
  }
  Il.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = fu();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Kt.length && t !== 0 && t < Kt[n].priority; n++) ;
      Kt.splice(n, 0, e), n === 0 && mu(e);
    }
  };
  function Li(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Ul(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function ja() {
  }
  function Qf(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var h = Dl(i);
          o.call(h);
        };
      }
      var i = Pa(t, r, e, 0, null, !1, !1, "", ja);
      return e._reactRootContainer = i, e[Ot] = i.current, dr(e.nodeType === 8 ? e.parentNode : e), gn(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var h = Dl(s);
        u.call(h);
      };
    }
    var s = ji(e, 0, !1, null, null, !1, !1, "", ja);
    return e._reactRootContainer = s, e[Ot] = s.current, dr(e.nodeType === 8 ? e.parentNode : e), gn(function() {
      Fl(t, s, n, r);
    }), s;
  }
  function Al(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var s = Dl(i);
          u.call(s);
        };
      }
      Fl(t, i, e, l);
    } else i = Qf(n, t, e, l, r);
    return Dl(i);
  }
  au = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = qn(t.pendingLanes);
          n !== 0 && (to(t, n | 1), Ze(t, ve()), (G & 6) === 0 && (Hn = ve() + 500, Zt()));
        }
        break;
      case 13:
        gn(function() {
          var r = It(e, 1);
          if (r !== null) {
            var l = We();
            Et(r, e, 1, l);
          }
        }), Ri(e, 1);
    }
  }, no = function(e) {
    if (e.tag === 13) {
      var t = It(e, 134217728);
      if (t !== null) {
        var n = We();
        Et(t, e, 134217728, n);
      }
      Ri(e, 134217728);
    }
  }, cu = function(e) {
    if (e.tag === 13) {
      var t = ln(e), n = It(e, t);
      if (n !== null) {
        var r = We();
        Et(n, e, t, r);
      }
      Ri(e, t);
    }
  }, fu = function() {
    return te;
  }, du = function(e, t) {
    var n = te;
    try {
      return te = e, t();
    } finally {
      te = n;
    }
  }, Xl = function(e, t, n) {
    switch (t) {
      case "input":
        if (st(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = nl(r);
              if (!l) throw Error(c(90));
              Vt(r), st(r, l);
            }
          }
        }
        break;
      case "textarea":
        Bi(e, n);
        break;
      case "select":
        t = n.value, t != null && rt(e, !!n.multiple, t, !1);
    }
  }, Ji = _i, qi = gn;
  var Kf = { usingClientEntryPoint: !1, Events: [hr, zn, nl, Xi, Gi, _i] }, jr = { findFiberByHostInstance: cn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Yf = { bundleType: jr.bundleType, version: jr.version, rendererPackageName: jr.rendererPackageName, rendererConfig: jr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Ee.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = tu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: jr.findFiberByHostInstance || Hf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var $l = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!$l.isDisabled && $l.supportsFiber) try {
      Ir = $l.inject(Yf), Ct = $l;
    } catch {
    }
  }
  return be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Kf, be.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Li(t)) throw Error(c(200));
    return Wf(e, t, null, n);
  }, be.createRoot = function(e, t) {
    if (!Li(e)) throw Error(c(299));
    var n = !1, r = "", l = Ta;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = ji(e, 1, !1, null, null, n, !1, r, l), e[Ot] = t.current, dr(e.nodeType === 8 ? e.parentNode : e), new zi(t);
  }, be.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(c(188)) : (e = Object.keys(e).join(","), Error(c(268, e)));
    return e = tu(t), e = e === null ? null : e.stateNode, e;
  }, be.flushSync = function(e) {
    return gn(e);
  }, be.hydrate = function(e, t, n) {
    if (!Ul(t)) throw Error(c(200));
    return Al(null, e, t, !0, n);
  }, be.hydrateRoot = function(e, t, n) {
    if (!Li(e)) throw Error(c(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Ta;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Pa(t, null, e, 1, n ?? null, l, !1, o, i), e[Ot] = t.current, dr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Il(t);
  }, be.render = function(e, t, n) {
    if (!Ul(t)) throw Error(c(200));
    return Al(null, e, t, !1, n);
  }, be.unmountComponentAtNode = function(e) {
    if (!Ul(e)) throw Error(c(40));
    return e._reactRootContainer ? (gn(function() {
      Al(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Ot] = null;
      });
    }), !0) : !1;
  }, be.unstable_batchedUpdates = _i, be.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Ul(n)) throw Error(c(200));
    if (e == null || e._reactInternals === void 0) throw Error(c(38));
    return Al(e, t, n, !1, r);
  }, be.version = "18.3.1-next-f1338f8080-20240426", be;
}
var Ia;
function ld() {
  if (Ia) return Fi.exports;
  Ia = 1;
  function m() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(m);
      } catch (v) {
        console.error(v);
      }
  }
  return m(), Fi.exports = rd(), Fi.exports;
}
var Ua;
function od() {
  if (Ua) return Bl;
  Ua = 1;
  var m = ld();
  return Bl.createRoot = m.createRoot, Bl.hydrateRoot = m.hydrateRoot, Bl;
}
var id = od();
const ud = /* @__PURE__ */ Ga(id), Aa = "AmsterdamUMC", sd = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", ad = `${sd}/chat/completions`, Ja = 1, cd = 256 * 1024 * 1024, $a = 512 * 1024 * 1024, zr = 64 * 1024, fd = `You are the analysis assistant inside OMERO Analysis Chat.
Source files stay in the browser and are never sent to you. Never ask the user to write or run
notebook code. Use list_workspace_files before analysis and run_python whenever computation is
needed. Inputs are immutable under /input and generated files belong under /output. Use the exact
paths returned by list_workspace_files.

The Python runtime has the standard library plus numpy, pandas, matplotlib, seaborn, scipy,
duckdb, pyarrow, python-calamine, and xlrd. It has no internet access. Never use pip, micropip,
HTTP, sockets, subprocesses, or shell commands. For Excel, prefer pandas.read_excel with
engine="calamine". Open DuckDB and SQLite databases read-only. Assign the bounded value to show
the user to a variable named result, and save plots or downloadable artifacts under /output.

Tool failures are observations, not terminal answers. When run_python reports an exception,
inspect it and call run_python again with corrected code. For ModuleNotFoundError, rewrite using
the available packages. For SQL/catalog/schema errors, inspect the database catalog and quoted
identifiers, then retry. Do not tell the user to fix recoverable generated-code errors.

Only send back bounded schemas, column names/types, row counts, aggregates, statistics, previews,
generated-code output, and error text. Never print, preview, encode, or return a complete source
file. Keep SQL filtering and aggregation inside the database; avoid SELECT * on large tables.
The UI bounds table previews to 100 rows by 50 columns and textual tool output to 64 KiB.

CI Segmentation measurement databases may be DuckDB or SQLite. Start by discovering the actual
tables/views and their columns; never assume a schema. Expected tables can include schema_info,
measurement_runs, images, channels, label_sets, objects, intensity_measurements, and relationships.
Convenience views can include object_features, intensity_features, mask_relationships, and
foci_assignments. object_id is database-wide; channel_index is one-based; image timepoints and
pixel coordinates are zero-based; bounding-box maxima are exclusive. Intensities are measured on
the final masks without normalization or background subtraction. Physical values may be NULL when
calibration is absent. Relationships are stored in both directions, and primary assignments use
is_primary_for_source. Verify all names and semantics from the discovered database before querying.
Explain biological and measurement meaning without overstating causality.`, dd = [
  {
    type: "function",
    function: {
      name: "list_workspace_files",
      description: "List browser-local input and generated files with paths and sizes.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  },
  {
    type: "function",
    function: {
      name: "run_python",
      description: "Run Python locally in the isolated browser runtime. Set result for a preview.",
      parameters: {
        type: "object",
        properties: { code: { type: "string" } },
        required: ["code"],
        additionalProperties: !1
      }
    }
  },
  {
    type: "function",
    function: {
      name: "reset_python",
      description: "Reset Python state and restore canonical input files.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  }
];
function Ba() {
  const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}
function pd(m, v, c) {
  return m.replace("TYPE", v).replace("/1/", `/${c}/`);
}
class md {
  constructor(v) {
    Rt(this, "contextToken", "");
    Rt(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = v;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const v = this.bootstrap.context;
    if (!v) return;
    const c = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Ba()
      },
      body: JSON.stringify({
        object_type: v.object_type,
        object_id: v.object_id
      })
    }), P = await Va(c);
    this.contextToken = P.context_token, this.operations = new Set(P.operations);
  }
  async download(v) {
    const c = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${v.annotation_id}/download/`
    ), P = await fetch(c, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!P.ok) throw new Error(await qa(P));
    return P.arrayBuffer();
  }
  async attach(v) {
    const c = this.bootstrap.context;
    if (!c || !v.data) throw new Error("No OMERO target or result data");
    const P = new FormData();
    P.append("file", new Blob([v.data], { type: v.type }), v.name);
    const $ = await fetch(
      pd(
        this.bootstrap.uploadTemplate,
        c.object_type,
        c.object_id
      ),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": Ba(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: P
      }
    );
    return (await Va($)).attachment;
  }
}
async function qa(m) {
  var v;
  try {
    return ((v = (await m.json()).error) == null ? void 0 : v.message) || `${m.status} ${m.statusText}`;
  } catch {
    return `${m.status} ${m.statusText}`;
  }
}
async function Va(m) {
  var c;
  const v = await m.json().catch(() => ({}));
  if (!m.ok)
    throw new Error(((c = v.error) == null ? void 0 : c.message) || `${m.status} ${m.statusText}`);
  return v;
}
async function hd(m, v, c) {
  const P = await fetch(ad, {
    method: "POST",
    signal: c,
    headers: {
      "Content-Type": "application/json",
      "api-key": m.apiKey
    },
    body: JSON.stringify({
      model: m.model,
      temperature: Ja,
      messages: v,
      tools: dd,
      tool_choice: "auto"
    })
  });
  if (!P.ok) throw new Error(await qa(P));
  return P.json();
}
function yd(m) {
  const v = JSON.stringify({
    stdout: m.stdout,
    stderr: m.stderr,
    preview: m.preview,
    generated_files: m.files.map((c) => ({
      name: c.name,
      size: c.data.byteLength,
      type: c.type
    }))
  });
  return v.length > 64 * 1024 ? `${v.slice(0, 64 * 1024)}
[tool output truncated]` : v;
}
function Vl(m) {
  const v = String(m instanceof Error ? m.message : m).slice(0, zr), c = JSON.stringify({
    ok: !1,
    error: v,
    instruction: "Inspect this error, correct the code or choose an available package, and call run_python again. Do not stop after a recoverable tool error.",
    available_packages: [
      "Python standard library",
      "numpy",
      "pandas",
      "matplotlib",
      "seaborn",
      "scipy",
      "duckdb",
      "pyarrow",
      "python-calamine",
      "xlrd"
    ]
  });
  return c.length > zr ? `${c.slice(0, zr)}
[tool error truncated]` : c;
}
const vd = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "scipy",
  "duckdb",
  "pyarrow",
  "python-calamine",
  "xlrd"
];
function gd(m) {
  const v = JSON.stringify(m.replace(/\/$/, "")), c = JSON.stringify(vd);
  return `
const runtimeBase = ${v};
const send = (id, type, value, transfer = []) => postMessage({source:"oac-runtime", id, type, value}, transfer);
const progress = (percent, message) => postMessage({
  source: "oac-runtime",
  type: "progress",
  value: {percent, message}
});
let pyodide;
const mime = (name) => name.endsWith(".png") ? "image/png" : name.endsWith(".svg") ? "image/svg+xml" :
  name.endsWith(".csv") ? "text/csv" : name.endsWith(".json") ? "application/json" :
  name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
async function boot() {
  progress(12, "Loading the browser Python engine…");
  const module = await import(runtimeBase + "/pyodide.mjs");
  progress(28, "Starting the isolated Python runtime…");
  pyodide = await module.loadPyodide({indexURL: runtimeBase + "/"});
  progress(48, "Loading data-analysis packages…");
  await pyodide.loadPackage(${c});
  progress(78, "Loading seaborn plotting support…");
  const micropip = pyodide.pyimport("micropip");
  try {
    await micropip.install(runtimeBase + "/seaborn-0.13.2-py3-none-any.whl", {deps: false});
  } finally {
    micropip.destroy();
  }
  progress(90, "Preparing the browser workspace…");
  pyodide.FS.mkdirTree("/input");
  pyodide.FS.mkdirTree("/output");
}
const ready = boot();
function outputFiles() {
  const values = [];
  function walk(dir) {
    for (const name of pyodide.FS.readdir(dir)) {
      if (name === "." || name === "..") continue;
      const path = dir + "/" + name;
      const stat = pyodide.FS.stat(path);
      if (pyodide.FS.isDir(stat.mode)) walk(path);
      else {
        const bytes = pyodide.FS.readFile(path);
        const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        values.push({name: path.slice(8), type: mime(name), data: buffer});
      }
    }
  }
  walk("/output");
  return values;
}
const previewCode = \`
import json as _oac_json, math as _oac_math
def _oac_clean(value):
    if value is None or isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        return value if _oac_math.isfinite(value) else str(value)
    if hasattr(value, "head") and hasattr(value, "to_dict"):
        frame = value.head(100)
        if hasattr(frame, "iloc"):
            frame = frame.iloc[:, :50]
        return {"kind": "table", "data": frame.to_dict(orient="split")}
    if isinstance(value, dict):
        return {str(k): _oac_clean(v) for k, v in list(value.items())[:100]}
    if isinstance(value, (list, tuple)):
        return [_oac_clean(v) for v in value[:100]]
    if hasattr(value, "item"):
        try: return _oac_clean(value.item())
        except Exception: pass
    return str(value)
_oac_json.dumps(_oac_clean(globals().get("result")), ensure_ascii=False)
\`;
addEventListener("message", async (event) => {
  const message = event.data;
  if (!message || message.source !== "oac-parent") return;
  try {
    await ready;
    if (message.type === "ping") {
      send(message.id, "ready", true);
    } else if (message.type === "file") {
      const safe = String(message.value.name).replace(/[^A-Za-z0-9._ -]/g, "_");
      pyodide.FS.writeFile("/input/" + safe, new Uint8Array(message.value.data));
      send(message.id, "file", safe);
    } else if (message.type === "run") {
      let stdout = "", stderr = "";
      pyodide.setStdout({batched: (text) => { stdout += text + "\\n"; }});
      pyodide.setStderr({batched: (text) => { stderr += text + "\\n"; }});
      await pyodide.runPythonAsync(message.value.code);
      const raw = await pyodide.runPythonAsync(previewCode);
      const files = outputFiles();
      const transfers = files.map((file) => file.data);
      send(message.id, "result", {stdout, stderr, preview: JSON.parse(raw), files}, transfers);
    }
  } catch (error) {
    send(message.id, "error", String(error && error.stack || error));
  }
});
`;
}
function wd(m) {
  const v = new URL(m).origin, c = JSON.stringify(gd(m));
  return `<!doctype html><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${v}; connect-src ${v}; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:">
<script>
const source = ${c};
const worker = new Worker(URL.createObjectURL(new Blob([source], {type: "text/javascript"})));
worker.addEventListener("error", (event) => {
  console.error("Analysis Chat runtime worker failed:", event.message, event.filename, event.lineno);
});
worker.addEventListener("messageerror", (event) => {
  console.error("Analysis Chat runtime worker message failed:", event.data);
});
worker.addEventListener("message", (event) => {
  const files = event.data && event.data.value && event.data.value.files || [];
  parent.postMessage(event.data, "*", files.map((file) => file.data));
});
addEventListener("message", (event) => {
  const message = event.data;
  if (!message || message.source !== "oac-parent") return;
  const transfer = message.type === "file" && message.value && message.value.data
    ? [message.value.data] : [];
  worker.postMessage(message, transfer);
});
<\/script>`;
}
class kd {
  constructor(v) {
    Rt(this, "frame", null);
    Rt(this, "pending", /* @__PURE__ */ new Map());
    Rt(this, "inputs", []);
    Rt(this, "counter", 0);
    Rt(this, "readyPromise", null);
    Rt(this, "onProgress", null);
    Rt(this, "receive", (v) => {
      var $;
      if (v.source !== (($ = this.frame) == null ? void 0 : $.contentWindow)) return;
      const c = v.data;
      if (!c || c.source !== "oac-runtime") return;
      if (c.type === "progress") {
        this.report(c.value);
        return;
      }
      const P = this.pending.get(c.id);
      P && (clearTimeout(P.timer), this.pending.delete(c.id), c.type === "error" ? P.reject(new Error(c.value)) : P.resolve(c.value));
    });
    this.runtimeBase = v, window.addEventListener("message", this.receive);
  }
  async start(v, c) {
    c && (this.onProgress = c), this.inputs = v.filter((W) => W.state === "ready" && W.data), this.destroyFrame(), this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const P = document.createElement("iframe");
    P.hidden = !0, P.setAttribute("sandbox", "allow-scripts"), P.setAttribute("aria-hidden", "true");
    const $ = new Promise(
      (W) => P.addEventListener("load", () => W(), { once: !0 })
    );
    return P.srcdoc = wd(
      new URL(this.runtimeBase, window.location.href).toString()
    ), document.body.append(P), this.frame = P, this.readyPromise = (async () => {
      await $, this.report({ percent: 8, message: "Connecting to the Python worker…" }), await this.request("ping", !0, 12e4);
      for (let W = 0; W < this.inputs.length; W += 1) {
        const ne = this.inputs[W];
        this.report({
          percent: 92 + Math.round(W / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${W + 1} of ${this.inputs.length} data files into Python…`
        });
        const X = ne.data.slice(0);
        await this.request("file", { name: ne.name, data: X }, 3e4, [X]);
      }
      this.report({ percent: 100, message: "Browser Python is ready" });
    })(), this.readyPromise;
  }
  async run(v) {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("run", { code: v }, 12e4);
  }
  async reset() {
    return this.start(this.inputs, this.onProgress || void 0);
  }
  stop() {
    for (const v of this.pending.values())
      clearTimeout(v.timer), v.reject(new Error("Python execution stopped"));
    this.pending.clear(), this.destroyFrame();
  }
  dispose() {
    this.stop(), this.destroyFrame(), window.removeEventListener("message", this.receive);
  }
  destroyFrame() {
    var v;
    (v = this.frame) == null || v.remove(), this.frame = null, this.readyPromise = null;
  }
  request(v, c, P, $ = []) {
    const W = `runtime-${++this.counter}`;
    return new Promise((ne, X) => {
      var he, fe;
      const V = window.setTimeout(() => {
        this.pending.delete(W), X(new Error(`${v} exceeded ${P / 1e3} seconds`)), v === "run" && this.start(this.inputs);
      }, P);
      this.pending.set(W, { resolve: ne, reject: X, timer: V }), (fe = (he = this.frame) == null ? void 0 : he.contentWindow) == null || fe.postMessage(
        { source: "oac-parent", id: W, type: v, value: c },
        "*",
        $
      );
    });
  }
  report(v) {
    var c;
    (c = this.onProgress) == null || c.call(this, {
      percent: Math.max(0, Math.min(100, Number(v.percent) || 0)),
      message: String(v.message || "Preparing browser Python…")
    });
  }
}
const Sd = "omero-analysis-chat", xd = 1;
function $i() {
  return new Promise((m, v) => {
    const c = indexedDB.open(Sd, xd);
    c.onupgradeneeded = () => {
      const P = c.result;
      P.objectStoreNames.contains("values") || P.createObjectStore("values");
    }, c.onsuccess = () => m(c.result), c.onerror = () => v(c.error);
  });
}
async function Wa(m) {
  const v = await $i();
  return new Promise((c, P) => {
    const W = v.transaction("values", "readonly").objectStore("values").get(m);
    W.onsuccess = () => c(W.result), W.onerror = () => P(W.error);
  });
}
async function Ha(m, v) {
  const c = await $i();
  return new Promise((P, $) => {
    const W = c.transaction("values", "readwrite");
    W.objectStore("values").put(v, m), W.oncomplete = () => P(), W.onerror = () => $(W.error);
  });
}
async function _d(m) {
  const v = await $i();
  return new Promise((c, P) => {
    const $ = v.transaction("values", "readwrite");
    $.objectStore("values").delete(m), $.oncomplete = () => c(), $.onerror = () => P($.error);
  });
}
const Qa = "provider:AmsterdamUMC", Ka = {
  apiKey: "",
  model: "",
  contextWindow: 0
}, Bt = () => crypto.randomUUID(), Ed = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, Cd = (m) => m.endsWith(".png") ? "image/png" : m.endsWith(".svg") ? "image/svg+xml" : m.endsWith(".csv") ? "text/csv" : m.endsWith(".json") ? "application/json" : "application/octet-stream";
function Ui() {
  const m = window.OMERO_ANALYSIS_CHAT.context;
  return m ? `workspace:${m.user_id}:${m.group_id}:${m.object_type}:${m.object_id}` : "workspace:standalone";
}
function Pd(m) {
  return JSON.stringify(
    m.map((v) => ({
      path: `${v.source === "result" ? "/output" : "/input"}/${v.name}`,
      size: v.size,
      type: v.type,
      state: v.state
    }))
  );
}
function Ya(m) {
  return Math.max(1, Math.ceil(JSON.stringify(m).length / 4));
}
function Nd(m, v) {
  if (!m) return "Context usage appears after the first AI response.";
  const c = m.promptTokens + m.completionTokens, P = m.estimated ? "estimated" : "API reported", $ = v > 0 ? ` · ${Math.min(100, Math.round(c / v * 100))}% of ${v.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${m.promptTokens.toLocaleString()} input + ${m.completionTokens.toLocaleString()} output tokens (${P})${$} · session: ${m.sessionTokens.toLocaleString()}`;
}
function Td() {
  const m = window.OMERO_ANALYSIS_CHAT, v = we.useMemo(() => new md(m), [m]), c = we.useMemo(() => new kd(m.runtimeBase), [m]), [P, $] = we.useState([]), W = we.useRef(P), [ne, X] = we.useState([]), [V, he] = we.useState(Ka), [fe, oe] = we.useState(""), [Z, Me] = we.useState(!1), [je, q] = we.useState(!1), [b, ee] = we.useState("Preparing workspace…"), [et, tt] = we.useState(!1), [Ee, He] = we.useState(null), [ye, le] = we.useState({
    percent: 0,
    message: "Preparing the browser workspace…"
  }), Se = we.useRef(null), ht = we.useRef(null);
  W.current = P;
  const Qe = P.filter((y) => y.state !== "ready"), Ke = je && Qe.length === 0 && !!(V.apiKey && V.model) && !Z, nt = Z ? "Analysis in progress — wait for the answer or press Stop…" : Qe.some((y) => y.state === "failed") ? "Chat is blocked — retry or remove the failed data file…" : Qe.length ? "Downloading selected data — chat will unlock when every file is ready…" : je ? !V.apiKey || !V.model ? "Configure the AmsterdamUMC deployment and API key before asking a question…" : "Ask a question about the loaded data…" : `${ye.message} (${Math.round(ye.percent)}%) — please wait…`;
  we.useEffect(() => {
    const y = ht.current;
    if (!y) return;
    const N = requestAnimationFrame(() => {
      y.scrollTo({ top: y.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(N);
  }, [ne, P]), we.useEffect(() => {
    let y = !0;
    return (async () => {
      var Lt;
      const [N, z] = await Promise.all([
        Wa(Qa),
        Wa(Ui())
      ]);
      if (!y) return;
      N && he({ ...Ka, ...N }), z && (X(z.messages || []), $((z.files || []).filter((Q) => Q.state === "ready"))), await v.connect();
      const A = ((Lt = m.context) == null ? void 0 : Lt.selected_attachments) || [], E = new Set(
        ((z == null ? void 0 : z.files) || []).map((Q) => Q.annotationId)
      ), U = A.filter((Q) => !E.has(Q.annotation_id)).map((Q) => ({
        id: Bt(),
        name: Q.name,
        type: Q.mimetype,
        size: Q.size,
        source: "omero",
        state: "loading",
        annotationId: Q.annotation_id
      }));
      let re = [...((z == null ? void 0 : z.files) || []).filter((Q) => Q.state === "ready")], Vt = !1;
      if (U.length) {
        $([...re, ...U]), ee(`Downloading 0 of ${U.length} selected attachments…`), le({
          percent: 0,
          message: `Downloading 0 of ${U.length} selected attachments…`
        });
        for (let Q = 0; Q < U.length; Q += 1) {
          const yt = U[Q], st = A.find(
            (Re) => Re.annotation_id === yt.annotationId
          );
          try {
            if (re.reduce((rt, ze) => rt + ze.size, 0) + st.size > $a)
              throw new Error("Selected attachments exceed the 512 MiB workspace limit");
            const vt = await v.download(st), Be = { ...yt, data: vt, size: vt.byteLength, state: "ready" };
            re = [...re, Be], $(
              (rt) => rt.map((ze) => ze.id === yt.id ? Be : ze)
            );
          } catch (Re) {
            Vt = !0, $(
              (vt) => vt.map(
                (Be) => Be.id === yt.id ? { ...Be, state: "failed", error: String(Re) } : Be
              )
            );
          }
          ee(`Downloaded ${Q + 1} of ${U.length} attachments`), le({
            percent: Math.round((Q + 1) / U.length * 100),
            message: `Downloaded ${Q + 1} of ${U.length} selected attachments`
          });
        }
      }
      const zt = U.length ? re : ((z == null ? void 0 : z.files) || []).filter((Q) => Q.state === "ready");
      y && !Vt ? (ee("Loading browser Python runtime…"), le({
        percent: 1,
        message: "Starting the browser Python runtime…"
      }), await c.start(zt, (Q) => {
        y && (le(Q), ee(Q.message));
      }), y && (q(!0), le({ percent: 100, message: "Browser Python is ready" }), ee("Ready — analysis runs locally in this browser"))) : y && (le({
        percent: 0,
        message: "Download failed — retry or remove the failed file"
      }), ee("Download failed — retry or remove failed files to continue"));
    })().catch((N) => {
      y && (le({
        percent: 0,
        message: `Workspace failed: ${String(N)}`
      }), ee(`Workspace failed: ${String(N)}`));
    }), () => {
      y = !1, c.dispose();
    };
  }, [m, v, c]), we.useEffect(() => {
    Ha(Ui(), { messages: ne, files: P });
  }, [ne, P]);
  async function Ce(y) {
    he(y), await Ha(Qa, y);
  }
  function Ye(y) {
    le(y), ee(y.message);
  }
  async function Fe(y, N) {
    q(!1), le({ percent: 1, message: "Restarting browser Python…" }), await c.start(y, Ye), le({ percent: 100, message: "Browser Python is ready" }), q(!0), ee(N);
  }
  async function De(y) {
    if (!y) return;
    const N = [];
    let z = P.reduce((E, U) => E + U.size, 0);
    for (const E of Array.from(y)) {
      if (!Ed.test(E.name)) {
        ee(`${E.name} is not a supported tabular data file`);
        continue;
      }
      if (E.size > cd) {
        ee(`${E.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (z += E.size, z > $a) {
        ee("The workspace would exceed 512 MiB");
        break;
      }
      N.push({
        id: Bt(),
        name: E.name,
        type: E.type || Cd(E.name),
        size: E.size,
        source: "local",
        state: "ready",
        data: await E.arrayBuffer()
      });
    }
    const A = [...P, ...N];
    $(A), await Fe(A, "Ready — analysis runs locally in this browser");
  }
  async function ae(y) {
    const N = P.filter((z) => z.id !== y);
    $(N), await Fe(N, "File removed; runtime reset");
  }
  async function C(y) {
    var A;
    const N = P.find((E) => E.id === y), z = (A = m.context) == null ? void 0 : A.selected_attachments.find(
      (E) => E.annotation_id === (N == null ? void 0 : N.annotationId)
    );
    if (!(!N || !z)) {
      $(
        (E) => E.map(
          (U) => U.id === y ? { ...U, state: "loading", error: void 0 } : U
        )
      );
      try {
        const E = await v.download(z), U = P.map(
          (re) => re.id === y ? { ...re, data: E, size: E.byteLength, state: "ready", error: void 0 } : re
        );
        $(U), await Fe(U, "Attachment downloaded; workspace ready");
      } catch (E) {
        $(
          (U) => U.map(
            (re) => re.id === y ? { ...re, state: "failed", error: String(E) } : re
          )
        );
      }
    }
  }
  async function I(y) {
    let N = {};
    try {
      N = JSON.parse(y.function.arguments || "{}");
    } catch (E) {
      return Vl(`Invalid JSON tool arguments: ${String(E)}`);
    }
    if (y.function.name === "list_workspace_files") return Pd(W.current);
    if (y.function.name === "reset_python")
      try {
        return await c.reset(), "Python state reset; canonical inputs restored.";
      } catch (E) {
        return Vl(E);
      }
    if (y.function.name !== "run_python" || typeof N.code != "string")
      return Vl(`Unsupported or invalid tool call: ${y.function.name}`);
    X((E) => [
      ...E,
      { id: Bt(), role: "assistant", content: "Running Python locally", kind: "code", code: N.code }
    ]), await new Promise(
      (E) => requestAnimationFrame(() => requestAnimationFrame(() => E()))
    );
    let z;
    try {
      z = await c.run(N.code);
    } catch (E) {
      const U = String(E instanceof Error ? E.message : E).slice(0, zr);
      return X((re) => [
        ...re,
        {
          id: Bt(),
          role: "tool",
          content: `Python failed locally. The bounded error was sent to ${Aa} for an automatic correction:
${U}`,
          kind: "error"
        }
      ]), ee("Python error sent to AmsterdamUMC; waiting for corrected code…"), Vl(E);
    }
    const A = z.files.map((E) => ({
      id: Bt(),
      name: E.name,
      type: E.type,
      size: E.data.byteLength,
      source: "result",
      state: "ready",
      data: E.data
    }));
    return A.length && $((E) => [...E.filter((U) => U.source !== "result" || !A.some((re) => re.name === U.name)), ...A]), X((E) => [
      ...E,
      {
        id: Bt(),
        role: "tool",
        content: [z.stdout, z.stderr].filter(Boolean).join(`
`).slice(0, zr),
        kind: "result",
        preview: z.preview,
        artifacts: A.filter((U) => U.type === "image/png" || U.type === "image/svg+xml").map((U) => U.name)
      }
    ]), ee("Python completed locally; continuing the analysis…"), yd(z);
  }
  async function j() {
    var A, E, U, re, Vt, zt, Lt;
    const y = fe.trim();
    if (!y || !Ke) return;
    oe(""), Me(!0), Se.current = new AbortController();
    const N = { id: Bt(), role: "user", content: y };
    X((Q) => [...Q, N]);
    const z = [
      { role: "system", content: fd },
      ...ne.filter((Q) => Q.kind !== "code" && Q.role !== "tool").map((Q) => ({ role: Q.role, content: Q.content })),
      { role: "user", content: y }
    ];
    try {
      for (let Q = 0; Q < 8; Q += 1) {
        const yt = Ya(z), st = await hd(V, z, Se.current.signal), Re = (A = st.choices[0]) == null ? void 0 : A.message;
        if (!Re) throw new Error("AmsterdamUMC returned no response");
        const vt = ((E = st.usage) == null ? void 0 : E.prompt_tokens) ?? yt, Be = ((U = st.usage) == null ? void 0 : U.completion_tokens) ?? Ya(Re.content || Re.tool_calls || ""), rt = ((re = st.usage) == null ? void 0 : re.total_tokens) ?? vt + Be;
        if (He((ze) => ({
          promptTokens: vt,
          completionTokens: Be,
          totalTokens: rt,
          sessionTokens: ((ze == null ? void 0 : ze.sessionTokens) || 0) + rt,
          estimated: !st.usage
        })), z.push({
          role: "assistant",
          content: Re.content,
          tool_calls: Re.tool_calls
        }), Re.content && X((ze) => [
          ...ze,
          { id: Bt(), role: "assistant", content: Re.content }
        ]), !((Vt = Re.tool_calls) != null && Vt.length)) break;
        for (const ze of Re.tool_calls) {
          const Lr = await I(ze);
          z.push({ role: "tool", tool_call_id: ze.id, content: Lr });
        }
        if (Q === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (Q) {
      (zt = Se.current) != null && zt.signal.aborted || X((yt) => [
        ...yt,
        { id: Bt(), role: "assistant", content: String(Q), kind: "error" }
      ]);
    } finally {
      (Lt = Se.current) != null && Lt.signal.aborted || ee("Ready — analysis runs locally in this browser"), Se.current = null, Me(!1);
    }
  }
  function f() {
    var y;
    (y = Se.current) == null || y.abort(), c.stop(), Me(!1), q(!1), ee("Stopped; restoring the browser runtime…"), le({ percent: 1, message: "Restoring browser Python…" }), c.start(P, Ye).then(() => {
      le({ percent: 100, message: "Browser Python is ready" }), q(!0), ee("Ready — analysis runs locally in this browser");
    });
  }
  async function g() {
    confirm("Clear this browser-local conversation, files, and results?") && (X([]), $([]), He(null), await _d(Ui()), await Fe([], "Workspace cleared"));
  }
  function H(y) {
    if (!y.data) return;
    const N = URL.createObjectURL(new Blob([y.data], { type: y.type })), z = document.createElement("a");
    z.href = N, z.download = y.name, z.click(), setTimeout(() => URL.revokeObjectURL(N), 1e3);
  }
  async function K(y) {
    if (confirm(`Attach ${y.name} to the selected OMERO object?`))
      try {
        const N = await v.attach(y);
        ee(`Attached ${N.name} as FileAnnotation ${N.annotation_id}`);
      } catch (N) {
        ee(`Attach failed: ${String(N)}`);
      }
  }
  return /* @__PURE__ */ x.jsxs("main", { className: "app-shell", children: [
    /* @__PURE__ */ x.jsxs("header", { children: [
      /* @__PURE__ */ x.jsxs("div", { children: [
        /* @__PURE__ */ x.jsx("h1", { children: "OMERO.AnalysisChat" }),
        /* @__PURE__ */ x.jsx("p", { children: m.context ? `${m.context.object_type} ${m.context.object_id} — ${m.context.name}` : "Local workspace" })
      ] }),
      /* @__PURE__ */ x.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ x.jsx("span", { className: "privacy-badge", children: "Python and source files stay in this browser" }),
        /* @__PURE__ */ x.jsx("button", { onClick: () => tt(!et), children: "AI settings" }),
        /* @__PURE__ */ x.jsx("button", { onClick: g, children: "Clear" })
      ] })
    ] }),
    et && /* @__PURE__ */ x.jsxs("form", { className: "settings-card", onSubmit: (y) => y.preventDefault(), children: [
      /* @__PURE__ */ x.jsx("h2", { children: Aa }),
      /* @__PURE__ */ x.jsx("p", { className: "warning", children: "The API key is stored unencrypted in this browser profile. Never use this on a shared computer." }),
      /* @__PURE__ */ x.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ x.jsx("input", { value: V.model, onChange: (y) => void Ce({ ...V, model: y.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ x.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ x.jsx("input", { type: "password", value: V.apiKey, onChange: (y) => void Ce({ ...V, apiKey: y.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ x.jsxs("label", { children: [
        "Model context window (optional)",
        /* @__PURE__ */ x.jsx(
          "input",
          {
            type: "number",
            min: "0",
            step: "1",
            value: V.contextWindow || "",
            onChange: (y) => void Ce({
              ...V,
              contextWindow: Math.max(0, Number(y.target.value) || 0)
            }),
            placeholder: "Used only to calculate a percentage"
          }
        )
      ] }),
      /* @__PURE__ */ x.jsxs("p", { children: [
        "Temperature is fixed at ",
        /* @__PURE__ */ x.jsx("strong", { children: Ja }),
        "."
      ] }),
      /* @__PURE__ */ x.jsx("button", { onClick: () => void Ce({ ...V, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ x.jsxs("div", { className: "workspace", children: [
      /* @__PURE__ */ x.jsxs("aside", { children: [
        /* @__PURE__ */ x.jsxs("div", { className: "aside-heading", children: [
          /* @__PURE__ */ x.jsx("h2", { children: "Data" }),
          /* @__PURE__ */ x.jsxs("label", { className: "upload-button", children: [
            "Add files",
            /* @__PURE__ */ x.jsx("input", { type: "file", multiple: !0, accept: ".duckdb,.sqlite,.sqlite3,.csv,.tsv,.json,.xlsx,.xls,.parquet,.npy,.npz", onChange: (y) => void De(y.target.files) })
          ] })
        ] }),
        /* @__PURE__ */ x.jsx("ul", { className: "file-list", children: P.map((y) => /* @__PURE__ */ x.jsxs("li", { className: `file-${y.state}`, children: [
          /* @__PURE__ */ x.jsxs("div", { children: [
            /* @__PURE__ */ x.jsx("strong", { children: y.name }),
            /* @__PURE__ */ x.jsxs("small", { children: [
              (y.size / 1024).toFixed(1),
              " KiB · ",
              y.source
            ] })
          ] }),
          /* @__PURE__ */ x.jsx("span", { children: y.state }),
          y.error && /* @__PURE__ */ x.jsx("p", { children: y.error }),
          /* @__PURE__ */ x.jsxs("div", { className: "file-actions", children: [
            y.state === "failed" && y.annotationId && /* @__PURE__ */ x.jsx("button", { onClick: () => void C(y.id), children: "Retry" }),
            y.source === "result" && /* @__PURE__ */ x.jsx("button", { onClick: () => H(y), children: "Download" }),
            y.source === "result" && v.canUpload && /* @__PURE__ */ x.jsx("button", { onClick: () => void K(y), children: "Attach" }),
            /* @__PURE__ */ x.jsx("button", { onClick: () => void ae(y.id), children: "Remove" })
          ] })
        ] }, y.id)) })
      ] }),
      /* @__PURE__ */ x.jsxs("section", { className: "chat", children: [
        /* @__PURE__ */ x.jsxs("div", { className: "messages", "aria-live": "polite", ref: ht, children: [
          !ne.length && /* @__PURE__ */ x.jsxs("div", { className: "welcome", children: [
            /* @__PURE__ */ x.jsx("h2", { children: "What would you like to learn from these data?" }),
            /* @__PURE__ */ x.jsx("p", { children: "I can inspect schemas, query databases, calculate summaries, compare groups, and create plots or downloadable results." })
          ] }),
          ne.map((y) => {
            var A;
            const N = y.kind === "code" || y.role === "tool", z = y.kind === "code" ? "Python code (local)" : y.kind === "error" ? "Tool error" : "Tool output";
            return /* @__PURE__ */ x.jsxs("article", { className: `message ${y.role} ${y.kind || ""} ${N ? "execution" : ""}`, children: [
              N ? /* @__PURE__ */ x.jsxs("details", { className: "execution-details", children: [
                /* @__PURE__ */ x.jsxs("summary", { children: [
                  /* @__PURE__ */ x.jsx("span", { children: z }),
                  /* @__PURE__ */ x.jsx("small", { children: "Show details" })
                ] }),
                /* @__PURE__ */ x.jsxs("div", { className: "execution-content", children: [
                  y.code ? /* @__PURE__ */ x.jsx("pre", { children: /* @__PURE__ */ x.jsx("code", { children: y.code }) }) : /* @__PURE__ */ x.jsx("p", { children: y.content }),
                  y.preview != null && /* @__PURE__ */ x.jsx(Xa, { value: y.preview })
                ] })
              ] }) : /* @__PURE__ */ x.jsxs(x.Fragment, { children: [
                /* @__PURE__ */ x.jsx("span", { children: y.role }),
                /* @__PURE__ */ x.jsx("p", { children: y.content }),
                y.preview != null && /* @__PURE__ */ x.jsx(Xa, { value: y.preview })
              ] }),
              (A = y.artifacts) == null ? void 0 : A.map((E) => {
                const U = P.find((re) => re.source === "result" && re.name === E);
                return U ? /* @__PURE__ */ x.jsx(jd, { file: U }, E) : null;
              })
            ] }, y.id);
          })
        ] }),
        !je && /* @__PURE__ */ x.jsxs("div", { className: "runtime-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ x.jsxs("div", { children: [
            /* @__PURE__ */ x.jsx("strong", { children: ye.message }),
            /* @__PURE__ */ x.jsxs("span", { children: [
              Math.round(ye.percent),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ x.jsx("progress", { max: "100", value: ye.percent }),
          /* @__PURE__ */ x.jsx("small", { children: "Please wait. The question box unlocks automatically when browser Python is ready." })
        ] }),
        /* @__PURE__ */ x.jsx("div", { className: "status", role: "status", children: b }),
        /* @__PURE__ */ x.jsxs("div", { className: "usage-status", children: [
          /* @__PURE__ */ x.jsx("span", { children: "Azure receives prompts, code, bounded schemas/previews/statistics, and execution errors — never source files." }),
          /* @__PURE__ */ x.jsx("span", { children: Nd(Ee, V.contextWindow || 0) })
        ] }),
        Qe.length > 0 && /* @__PURE__ */ x.jsx("div", { className: "blocker", children: "Analysis is blocked until every selected attachment finishes downloading. Retry or remove failed files." }),
        !V.apiKey || !V.model ? /* @__PURE__ */ x.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
        /* @__PURE__ */ x.jsxs("div", { className: "composer", children: [
          /* @__PURE__ */ x.jsxs("div", { className: `composer-state ${Ke ? "ready" : "waiting"}`, children: [
            /* @__PURE__ */ x.jsx("span", { "aria-hidden": "true", children: Ke ? "●" : "◷" }),
            Ke ? "Ready — you can ask a question" : nt
          ] }),
          /* @__PURE__ */ x.jsx("textarea", { value: fe, onChange: (y) => oe(y.target.value), onKeyDown: (y) => {
            y.key === "Enter" && !y.shiftKey && (y.preventDefault(), j());
          }, disabled: !Ke, placeholder: nt }),
          Z ? /* @__PURE__ */ x.jsx("button", { className: "stop", onClick: f, children: "Stop" }) : /* @__PURE__ */ x.jsx("button", { disabled: !Ke || !fe.trim(), onClick: () => void j(), children: "Send" }),
          /* @__PURE__ */ x.jsx("button", { disabled: Z || !je, onClick: () => void Fe(P, "Python state reset; inputs restored"), children: "Reset Python" })
        ] })
      ] })
    ] })
  ] });
}
function Xa({ value: m }) {
  if ((m == null ? void 0 : m.kind) === "table" && m.data) {
    const v = m.data.columns || [], c = m.data.data || [];
    return /* @__PURE__ */ x.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ x.jsxs("table", { children: [
      /* @__PURE__ */ x.jsx("thead", { children: /* @__PURE__ */ x.jsx("tr", { children: v.map((P) => /* @__PURE__ */ x.jsx("th", { children: P }, P)) }) }),
      /* @__PURE__ */ x.jsx("tbody", { children: c.map((P, $) => /* @__PURE__ */ x.jsx("tr", { children: P.map((W, ne) => /* @__PURE__ */ x.jsx("td", { children: String(W ?? "") }, ne)) }, $)) })
    ] }) });
  }
  return /* @__PURE__ */ x.jsx("pre", { className: "preview", children: JSON.stringify(m, null, 2) });
}
function jd({ file: m }) {
  const v = we.useMemo(
    () => m.data ? URL.createObjectURL(new Blob([m.data], { type: m.type })) : "",
    [m.data, m.type]
  );
  return we.useEffect(() => () => {
    v && URL.revokeObjectURL(v);
  }, [v]), v ? /* @__PURE__ */ x.jsxs("figure", { children: [
    /* @__PURE__ */ x.jsx("img", { src: v, alt: m.name }),
    /* @__PURE__ */ x.jsx("figcaption", { children: m.name })
  ] }) : null;
}
ud.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ x.jsx(ed.StrictMode, { children: /* @__PURE__ */ x.jsx(Td, {}) })
);
