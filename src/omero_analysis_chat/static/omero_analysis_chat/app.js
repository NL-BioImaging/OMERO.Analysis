var Xf = Object.defineProperty;
var Gf = (m, g, f) => g in m ? Xf(m, g, { enumerable: !0, configurable: !0, writable: !0, value: f }) : m[g] = f;
var Ft = (m, g, f) => Gf(m, typeof g != "symbol" ? g + "" : g, f);
function Xa(m) {
  return m && m.__esModule && Object.prototype.hasOwnProperty.call(m, "default") ? m.default : m;
}
var Ri = { exports: {} }, Nr = {}, Li = { exports: {} }, V = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ja;
function Jf() {
  if (ja) return V;
  ja = 1;
  var m = Symbol.for("react.element"), g = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), j = Symbol.for("react.strict_mode"), F = Symbol.for("react.profiler"), W = Symbol.for("react.provider"), le = Symbol.for("react.context"), J = Symbol.for("react.forward_ref"), $ = Symbol.for("react.suspense"), pe = Symbol.for("react.memo"), ue = Symbol.for("react.lazy"), ee = Symbol.iterator;
  function q(s) {
    return s === null || typeof s != "object" ? null : (s = ee && s[ee] || s["@@iterator"], typeof s == "function" ? s : null);
  }
  var Te = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, De = Object.assign, Q = {};
  function Z(s, y, _) {
    this.props = s, this.context = y, this.refs = Q, this.updater = _ || Te;
  }
  Z.prototype.isReactComponent = {}, Z.prototype.setState = function(s, y) {
    if (typeof s != "object" && typeof s != "function" && s != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, s, y, "setState");
  }, Z.prototype.forceUpdate = function(s) {
    this.updater.enqueueForceUpdate(this, s, "forceUpdate");
  };
  function Y() {
  }
  Y.prototype = Z.prototype;
  function Xe(s, y, _) {
    this.props = s, this.context = y, this.refs = Q, this.updater = _ || Te;
  }
  var Ge = Xe.prototype = new Y();
  Ge.constructor = Xe, De(Ge, Z.prototype), Ge.isPureReactComponent = !0;
  var we = Array.isArray, $e = Object.prototype.hasOwnProperty, ce = { current: null }, Ee = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ze(s, y, _) {
    var T, D = {}, B = null, G = null;
    if (y != null) for (T in y.ref !== void 0 && (G = y.ref), y.key !== void 0 && (B = "" + y.key), y) $e.call(y, T) && !Ee.hasOwnProperty(T) && (D[T] = y[T]);
    var H = arguments.length - 2;
    if (H === 1) D.children = _;
    else if (1 < H) {
      for (var M = Array(H), fe = 0; fe < H; fe++) M[fe] = arguments[fe + 2];
      D.children = M;
    }
    if (s && s.defaultProps) for (T in H = s.defaultProps, H) D[T] === void 0 && (D[T] = H[T]);
    return { $$typeof: m, type: s, key: B, ref: G, props: D, _owner: ce.current };
  }
  function Je(s, y) {
    return { $$typeof: m, type: s.type, key: y, ref: s.ref, props: s.props, _owner: s._owner };
  }
  function dt(s) {
    return typeof s == "object" && s !== null && s.$$typeof === m;
  }
  function Ct(s) {
    var y = { "=": "=0", ":": "=2" };
    return "$" + s.replace(/[=:]/g, function(_) {
      return y[_];
    });
  }
  var rt = /\/+/g;
  function Ie(s, y) {
    return typeof s == "object" && s !== null && s.key != null ? Ct("" + s.key) : y.toString(36);
  }
  function Be(s, y, _, T, D) {
    var B = typeof s;
    (B === "undefined" || B === "boolean") && (s = null);
    var G = !1;
    if (s === null) G = !0;
    else switch (B) {
      case "string":
      case "number":
        G = !0;
        break;
      case "object":
        switch (s.$$typeof) {
          case m:
          case g:
            G = !0;
        }
    }
    if (G) return G = s, D = D(G), s = T === "" ? "." + Ie(G, 0) : T, we(D) ? (_ = "", s != null && (_ = s.replace(rt, "$&/") + "/"), Be(D, y, _, "", function(fe) {
      return fe;
    })) : D != null && (dt(D) && (D = Je(D, _ + (!D.key || G && G.key === D.key ? "" : ("" + D.key).replace(rt, "$&/") + "/") + s)), y.push(D)), 1;
    if (G = 0, T = T === "" ? "." : T + ":", we(s)) for (var H = 0; H < s.length; H++) {
      B = s[H];
      var M = T + Ie(B, H);
      G += Be(B, y, _, M, D);
    }
    else if (M = q(s), typeof M == "function") for (s = M.call(s), H = 0; !(B = s.next()).done; ) B = B.value, M = T + Ie(B, H++), G += Be(B, y, _, M, D);
    else if (B === "object") throw y = String(s), Error("Objects are not valid as a React child (found: " + (y === "[object Object]" ? "object with keys {" + Object.keys(s).join(", ") + "}" : y) + "). If you meant to render a collection of children, use an array instead.");
    return G;
  }
  function lt(s, y, _) {
    if (s == null) return s;
    var T = [], D = 0;
    return Be(s, T, "", "", function(B) {
      return y.call(_, B, D++);
    }), T;
  }
  function je(s) {
    if (s._status === -1) {
      var y = s._result;
      y = y(), y.then(function(_) {
        (s._status === 0 || s._status === -1) && (s._status = 1, s._result = _);
      }, function(_) {
        (s._status === 0 || s._status === -1) && (s._status = 2, s._result = _);
      }), s._status === -1 && (s._status = 0, s._result = y);
    }
    if (s._status === 1) return s._result.default;
    throw s._result;
  }
  var oe = { current: null }, P = { transition: null }, v = { ReactCurrentDispatcher: oe, ReactCurrentBatchConfig: P, ReactCurrentOwner: ce };
  function S() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return V.Children = { map: lt, forEach: function(s, y, _) {
    lt(s, function() {
      y.apply(this, arguments);
    }, _);
  }, count: function(s) {
    var y = 0;
    return lt(s, function() {
      y++;
    }), y;
  }, toArray: function(s) {
    return lt(s, function(y) {
      return y;
    }) || [];
  }, only: function(s) {
    if (!dt(s)) throw Error("React.Children.only expected to receive a single React element child.");
    return s;
  } }, V.Component = Z, V.Fragment = f, V.Profiler = F, V.PureComponent = Xe, V.StrictMode = j, V.Suspense = $, V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = v, V.act = S, V.cloneElement = function(s, y, _) {
    if (s == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + s + ".");
    var T = De({}, s.props), D = s.key, B = s.ref, G = s._owner;
    if (y != null) {
      if (y.ref !== void 0 && (B = y.ref, G = ce.current), y.key !== void 0 && (D = "" + y.key), s.type && s.type.defaultProps) var H = s.type.defaultProps;
      for (M in y) $e.call(y, M) && !Ee.hasOwnProperty(M) && (T[M] = y[M] === void 0 && H !== void 0 ? H[M] : y[M]);
    }
    var M = arguments.length - 2;
    if (M === 1) T.children = _;
    else if (1 < M) {
      H = Array(M);
      for (var fe = 0; fe < M; fe++) H[fe] = arguments[fe + 2];
      T.children = H;
    }
    return { $$typeof: m, type: s.type, key: D, ref: B, props: T, _owner: G };
  }, V.createContext = function(s) {
    return s = { $$typeof: le, _currentValue: s, _currentValue2: s, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, s.Provider = { $$typeof: W, _context: s }, s.Consumer = s;
  }, V.createElement = ze, V.createFactory = function(s) {
    var y = ze.bind(null, s);
    return y.type = s, y;
  }, V.createRef = function() {
    return { current: null };
  }, V.forwardRef = function(s) {
    return { $$typeof: J, render: s };
  }, V.isValidElement = dt, V.lazy = function(s) {
    return { $$typeof: ue, _payload: { _status: -1, _result: s }, _init: je };
  }, V.memo = function(s, y) {
    return { $$typeof: pe, type: s, compare: y === void 0 ? null : y };
  }, V.startTransition = function(s) {
    var y = P.transition;
    P.transition = {};
    try {
      s();
    } finally {
      P.transition = y;
    }
  }, V.unstable_act = S, V.useCallback = function(s, y) {
    return oe.current.useCallback(s, y);
  }, V.useContext = function(s) {
    return oe.current.useContext(s);
  }, V.useDebugValue = function() {
  }, V.useDeferredValue = function(s) {
    return oe.current.useDeferredValue(s);
  }, V.useEffect = function(s, y) {
    return oe.current.useEffect(s, y);
  }, V.useId = function() {
    return oe.current.useId();
  }, V.useImperativeHandle = function(s, y, _) {
    return oe.current.useImperativeHandle(s, y, _);
  }, V.useInsertionEffect = function(s, y) {
    return oe.current.useInsertionEffect(s, y);
  }, V.useLayoutEffect = function(s, y) {
    return oe.current.useLayoutEffect(s, y);
  }, V.useMemo = function(s, y) {
    return oe.current.useMemo(s, y);
  }, V.useReducer = function(s, y, _) {
    return oe.current.useReducer(s, y, _);
  }, V.useRef = function(s) {
    return oe.current.useRef(s);
  }, V.useState = function(s) {
    return oe.current.useState(s);
  }, V.useSyncExternalStore = function(s, y, _) {
    return oe.current.useSyncExternalStore(s, y, _);
  }, V.useTransition = function() {
    return oe.current.useTransition();
  }, V.version = "18.3.1", V;
}
var Ra;
function Ii() {
  return Ra || (Ra = 1, Li.exports = Jf()), Li.exports;
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
function qf() {
  if (La) return Nr;
  La = 1;
  var m = Ii(), g = Symbol.for("react.element"), f = Symbol.for("react.fragment"), j = Object.prototype.hasOwnProperty, F = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, W = { key: !0, ref: !0, __self: !0, __source: !0 };
  function le(J, $, pe) {
    var ue, ee = {}, q = null, Te = null;
    pe !== void 0 && (q = "" + pe), $.key !== void 0 && (q = "" + $.key), $.ref !== void 0 && (Te = $.ref);
    for (ue in $) j.call($, ue) && !W.hasOwnProperty(ue) && (ee[ue] = $[ue]);
    if (J && J.defaultProps) for (ue in $ = J.defaultProps, $) ee[ue] === void 0 && (ee[ue] = $[ue]);
    return { $$typeof: g, type: J, key: q, ref: Te, props: ee, _owner: F.current };
  }
  return Nr.Fragment = f, Nr.jsx = le, Nr.jsxs = le, Nr;
}
var Oa;
function Zf() {
  return Oa || (Oa = 1, Ri.exports = qf()), Ri.exports;
}
var C = Zf(), _e = Ii();
const bf = /* @__PURE__ */ Xa(_e);
var Il = {}, Oi = { exports: {} }, Ye = {}, Mi = { exports: {} }, Fi = {};
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
function ed() {
  return Ma || (Ma = 1, (function(m) {
    function g(P, v) {
      var S = P.length;
      P.push(v);
      e: for (; 0 < S; ) {
        var s = S - 1 >>> 1, y = P[s];
        if (0 < F(y, v)) P[s] = v, P[S] = y, S = s;
        else break e;
      }
    }
    function f(P) {
      return P.length === 0 ? null : P[0];
    }
    function j(P) {
      if (P.length === 0) return null;
      var v = P[0], S = P.pop();
      if (S !== v) {
        P[0] = S;
        e: for (var s = 0, y = P.length, _ = y >>> 1; s < _; ) {
          var T = 2 * (s + 1) - 1, D = P[T], B = T + 1, G = P[B];
          if (0 > F(D, S)) B < y && 0 > F(G, D) ? (P[s] = G, P[B] = S, s = B) : (P[s] = D, P[T] = S, s = T);
          else if (B < y && 0 > F(G, S)) P[s] = G, P[B] = S, s = B;
          else break e;
        }
      }
      return v;
    }
    function F(P, v) {
      var S = P.sortIndex - v.sortIndex;
      return S !== 0 ? S : P.id - v.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var W = performance;
      m.unstable_now = function() {
        return W.now();
      };
    } else {
      var le = Date, J = le.now();
      m.unstable_now = function() {
        return le.now() - J;
      };
    }
    var $ = [], pe = [], ue = 1, ee = null, q = 3, Te = !1, De = !1, Q = !1, Z = typeof setTimeout == "function" ? setTimeout : null, Y = typeof clearTimeout == "function" ? clearTimeout : null, Xe = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ge(P) {
      for (var v = f(pe); v !== null; ) {
        if (v.callback === null) j(pe);
        else if (v.startTime <= P) j(pe), v.sortIndex = v.expirationTime, g($, v);
        else break;
        v = f(pe);
      }
    }
    function we(P) {
      if (Q = !1, Ge(P), !De) if (f($) !== null) De = !0, je($e);
      else {
        var v = f(pe);
        v !== null && oe(we, v.startTime - P);
      }
    }
    function $e(P, v) {
      De = !1, Q && (Q = !1, Y(ze), ze = -1), Te = !0;
      var S = q;
      try {
        for (Ge(v), ee = f($); ee !== null && (!(ee.expirationTime > v) || P && !Ct()); ) {
          var s = ee.callback;
          if (typeof s == "function") {
            ee.callback = null, q = ee.priorityLevel;
            var y = s(ee.expirationTime <= v);
            v = m.unstable_now(), typeof y == "function" ? ee.callback = y : ee === f($) && j($), Ge(v);
          } else j($);
          ee = f($);
        }
        if (ee !== null) var _ = !0;
        else {
          var T = f(pe);
          T !== null && oe(we, T.startTime - v), _ = !1;
        }
        return _;
      } finally {
        ee = null, q = S, Te = !1;
      }
    }
    var ce = !1, Ee = null, ze = -1, Je = 5, dt = -1;
    function Ct() {
      return !(m.unstable_now() - dt < Je);
    }
    function rt() {
      if (Ee !== null) {
        var P = m.unstable_now();
        dt = P;
        var v = !0;
        try {
          v = Ee(!0, P);
        } finally {
          v ? Ie() : (ce = !1, Ee = null);
        }
      } else ce = !1;
    }
    var Ie;
    if (typeof Xe == "function") Ie = function() {
      Xe(rt);
    };
    else if (typeof MessageChannel < "u") {
      var Be = new MessageChannel(), lt = Be.port2;
      Be.port1.onmessage = rt, Ie = function() {
        lt.postMessage(null);
      };
    } else Ie = function() {
      Z(rt, 0);
    };
    function je(P) {
      Ee = P, ce || (ce = !0, Ie());
    }
    function oe(P, v) {
      ze = Z(function() {
        P(m.unstable_now());
      }, v);
    }
    m.unstable_IdlePriority = 5, m.unstable_ImmediatePriority = 1, m.unstable_LowPriority = 4, m.unstable_NormalPriority = 3, m.unstable_Profiling = null, m.unstable_UserBlockingPriority = 2, m.unstable_cancelCallback = function(P) {
      P.callback = null;
    }, m.unstable_continueExecution = function() {
      De || Te || (De = !0, je($e));
    }, m.unstable_forceFrameRate = function(P) {
      0 > P || 125 < P ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Je = 0 < P ? Math.floor(1e3 / P) : 5;
    }, m.unstable_getCurrentPriorityLevel = function() {
      return q;
    }, m.unstable_getFirstCallbackNode = function() {
      return f($);
    }, m.unstable_next = function(P) {
      switch (q) {
        case 1:
        case 2:
        case 3:
          var v = 3;
          break;
        default:
          v = q;
      }
      var S = q;
      q = v;
      try {
        return P();
      } finally {
        q = S;
      }
    }, m.unstable_pauseExecution = function() {
    }, m.unstable_requestPaint = function() {
    }, m.unstable_runWithPriority = function(P, v) {
      switch (P) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          P = 3;
      }
      var S = q;
      q = P;
      try {
        return v();
      } finally {
        q = S;
      }
    }, m.unstable_scheduleCallback = function(P, v, S) {
      var s = m.unstable_now();
      switch (typeof S == "object" && S !== null ? (S = S.delay, S = typeof S == "number" && 0 < S ? s + S : s) : S = s, P) {
        case 1:
          var y = -1;
          break;
        case 2:
          y = 250;
          break;
        case 5:
          y = 1073741823;
          break;
        case 4:
          y = 1e4;
          break;
        default:
          y = 5e3;
      }
      return y = S + y, P = { id: ue++, callback: v, priorityLevel: P, startTime: S, expirationTime: y, sortIndex: -1 }, S > s ? (P.sortIndex = S, g(pe, P), f($) === null && P === f(pe) && (Q ? (Y(ze), ze = -1) : Q = !0, oe(we, S - s))) : (P.sortIndex = y, g($, P), De || Te || (De = !0, je($e))), P;
    }, m.unstable_shouldYield = Ct, m.unstable_wrapCallback = function(P) {
      var v = q;
      return function() {
        var S = q;
        q = v;
        try {
          return P.apply(this, arguments);
        } finally {
          q = S;
        }
      };
    };
  })(Fi)), Fi;
}
var Fa;
function td() {
  return Fa || (Fa = 1, Mi.exports = ed()), Mi.exports;
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
function nd() {
  if (Da) return Ye;
  Da = 1;
  var m = Ii(), g = td();
  function f(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var j = /* @__PURE__ */ new Set(), F = {};
  function W(e, t) {
    le(e, t), le(e + "Capture", t);
  }
  function le(e, t) {
    for (F[e] = t, e = 0; e < t.length; e++) j.add(t[e]);
  }
  var J = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), $ = Object.prototype.hasOwnProperty, pe = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ue = {}, ee = {};
  function q(e) {
    return $.call(ee, e) ? !0 : $.call(ue, e) ? !1 : pe.test(e) ? ee[e] = !0 : (ue[e] = !0, !1);
  }
  function Te(e, t, n, r) {
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
  function De(e, t, n, r) {
    if (t === null || typeof t > "u" || Te(e, t, n, r)) return !0;
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
  function Q(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var Z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    Z[e] = new Q(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    Z[t] = new Q(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    Z[e] = new Q(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    Z[e] = new Q(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    Z[e] = new Q(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    Z[e] = new Q(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    Z[e] = new Q(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    Z[e] = new Q(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    Z[e] = new Q(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Y = /[\-:]([a-z])/g;
  function Xe(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Y,
      Xe
    );
    Z[t] = new Q(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Y, Xe);
    Z[t] = new Q(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Y, Xe);
    Z[t] = new Q(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    Z[e] = new Q(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), Z.xlinkHref = new Q("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    Z[e] = new Q(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Ge(e, t, n, r) {
    var l = Z.hasOwnProperty(t) ? Z[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (De(t, n, l, r) && (n = null), r || l === null ? q(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var we = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, $e = Symbol.for("react.element"), ce = Symbol.for("react.portal"), Ee = Symbol.for("react.fragment"), ze = Symbol.for("react.strict_mode"), Je = Symbol.for("react.profiler"), dt = Symbol.for("react.provider"), Ct = Symbol.for("react.context"), rt = Symbol.for("react.forward_ref"), Ie = Symbol.for("react.suspense"), Be = Symbol.for("react.suspense_list"), lt = Symbol.for("react.memo"), je = Symbol.for("react.lazy"), oe = Symbol.for("react.offscreen"), P = Symbol.iterator;
  function v(e) {
    return e === null || typeof e != "object" ? null : (e = P && e[P] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var S = Object.assign, s;
  function y(e) {
    if (s === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      s = t && t[1] || "";
    }
    return `
` + s + e;
  }
  var _ = !1;
  function T(e, t) {
    if (!e || _) return "";
    _ = !0;
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
                var a = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", e.displayName)), a;
              }
            while (1 <= i && 0 <= u);
          break;
        }
      }
    } finally {
      _ = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? y(e) : "";
  }
  function D(e) {
    switch (e.tag) {
      case 5:
        return y(e.type);
      case 16:
        return y("Lazy");
      case 13:
        return y("Suspense");
      case 19:
        return y("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = T(e.type, !1), e;
      case 11:
        return e = T(e.type.render, !1), e;
      case 1:
        return e = T(e.type, !0), e;
      default:
        return "";
    }
  }
  function B(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Ee:
        return "Fragment";
      case ce:
        return "Portal";
      case Je:
        return "Profiler";
      case ze:
        return "StrictMode";
      case Ie:
        return "Suspense";
      case Be:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Ct:
        return (e.displayName || "Context") + ".Consumer";
      case dt:
        return (e._context.displayName || "Context") + ".Provider";
      case rt:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case lt:
        return t = e.displayName || null, t !== null ? t : B(e.type) || "Memo";
      case je:
        t = e._payload, e = e._init;
        try {
          return B(e(t));
        } catch {
        }
    }
    return null;
  }
  function G(e) {
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
        return B(t);
      case 8:
        return t === ze ? "StrictMode" : "Mode";
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
  function H(e) {
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
  function M(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function fe(e) {
    var t = M(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function qe(e) {
    e._valueTracker || (e._valueTracker = fe(e));
  }
  function Ce(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = M(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function ot(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Ze(e, t) {
    var n = t.checked;
    return S({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Pt(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = H(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Re(e, t) {
    t = t.checked, t != null && Ge(e, "checked", t, !1);
  }
  function Bn(e, t) {
    Re(e, t);
    var n = H(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Al(e, t.type, n) : t.hasOwnProperty("defaultValue") && Al(e, t.type, H(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Ai(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Al(e, t, n) {
    (t !== "number" || ot(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Vn = Array.isArray;
  function vn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + H(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function $l(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(f(91));
    return S({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function $i(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(f(92));
        if (Vn(n)) {
          if (1 < n.length) throw Error(f(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: H(n) };
  }
  function Bi(e, t) {
    var n = H(t.value), r = H(t.defaultValue);
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
  function Bl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Wi(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var zr, Hi = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (zr = zr || document.createElement("div"), zr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = zr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Wn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Hn = {
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
  }, qa = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Hn).forEach(function(e) {
    qa.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Hn[t] = Hn[e];
    });
  });
  function Qi(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Hn.hasOwnProperty(e) && Hn[e] ? ("" + t).trim() : t + "px";
  }
  function Ki(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = Qi(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Za = S({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Vl(e, t) {
    if (t) {
      if (Za[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(f(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(f(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(f(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(f(62));
    }
  }
  function Wl(e, t) {
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
  var Hl = null;
  function Ql(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Kl = null, yn = null, gn = null;
  function Yi(e) {
    if (e = dr(e)) {
      if (typeof Kl != "function") throw Error(f(280));
      var t = e.stateNode;
      t && (t = Zr(t), Kl(e.stateNode, e.type, t));
    }
  }
  function Xi(e) {
    yn ? gn ? gn.push(e) : gn = [e] : yn = e;
  }
  function Gi() {
    if (yn) {
      var e = yn, t = gn;
      if (gn = yn = null, Yi(e), t) for (e = 0; e < t.length; e++) Yi(t[e]);
    }
  }
  function Ji(e, t) {
    return e(t);
  }
  function qi() {
  }
  var Yl = !1;
  function Zi(e, t, n) {
    if (Yl) return e(t, n);
    Yl = !0;
    try {
      return Ji(e, t, n);
    } finally {
      Yl = !1, (yn !== null || gn !== null) && (qi(), Gi());
    }
  }
  function Qn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Zr(n);
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
    if (n && typeof n != "function") throw Error(f(231, t, typeof n));
    return n;
  }
  var Xl = !1;
  if (J) try {
    var Kn = {};
    Object.defineProperty(Kn, "passive", { get: function() {
      Xl = !0;
    } }), window.addEventListener("test", Kn, Kn), window.removeEventListener("test", Kn, Kn);
  } catch {
    Xl = !1;
  }
  function ba(e, t, n, r, l, o, i, u, a) {
    var h = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, h);
    } catch (k) {
      this.onError(k);
    }
  }
  var Yn = !1, jr = null, Rr = !1, Gl = null, ec = { onError: function(e) {
    Yn = !0, jr = e;
  } };
  function tc(e, t, n, r, l, o, i, u, a) {
    Yn = !1, jr = null, ba.apply(ec, arguments);
  }
  function nc(e, t, n, r, l, o, i, u, a) {
    if (tc.apply(this, arguments), Yn) {
      if (Yn) {
        var h = jr;
        Yn = !1, jr = null;
      } else throw Error(f(198));
      Rr || (Rr = !0, Gl = h);
    }
  }
  function nn(e) {
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
    if (nn(e) !== e) throw Error(f(188));
  }
  function rc(e) {
    var t = e.alternate;
    if (!t) {
      if (t = nn(e), t === null) throw Error(f(188));
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
        throw Error(f(188));
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
          if (!i) throw Error(f(189));
        }
      }
      if (n.alternate !== r) throw Error(f(190));
    }
    if (n.tag !== 3) throw Error(f(188));
    return n.stateNode.current === n ? e : t;
  }
  function tu(e) {
    return e = rc(e), e !== null ? nu(e) : null;
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
  var ru = g.unstable_scheduleCallback, lu = g.unstable_cancelCallback, lc = g.unstable_shouldYield, oc = g.unstable_requestPaint, me = g.unstable_now, ic = g.unstable_getCurrentPriorityLevel, Jl = g.unstable_ImmediatePriority, ou = g.unstable_UserBlockingPriority, Lr = g.unstable_NormalPriority, uc = g.unstable_LowPriority, iu = g.unstable_IdlePriority, Or = null, kt = null;
  function sc(e) {
    if (kt && typeof kt.onCommitFiberRoot == "function") try {
      kt.onCommitFiberRoot(Or, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : fc, ac = Math.log, cc = Math.LN2;
  function fc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ac(e) / cc | 0) | 0;
  }
  var Mr = 64, Fr = 4194304;
  function Xn(e) {
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
  function Dr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var u = i & ~l;
      u !== 0 ? r = Xn(u) : (o &= i, o !== 0 && (r = Xn(o)));
    } else i = n & ~l, i !== 0 ? r = Xn(i) : o !== 0 && (r = Xn(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function dc(e, t) {
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
  function pc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - pt(o), u = 1 << i, a = l[i];
      a === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[i] = dc(u, t)) : a <= t && (e.expiredLanes |= u), o &= ~u;
    }
  }
  function ql(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function uu() {
    var e = Mr;
    return Mr <<= 1, (Mr & 4194240) === 0 && (Mr = 64), e;
  }
  function Zl(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Gn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - pt(t), e[t] = n;
  }
  function mc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - pt(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function bl(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - pt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var b = 0;
  function su(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var au, eo, cu, fu, du, to = !1, Ir = [], It = null, Ut = null, At = null, Jn = /* @__PURE__ */ new Map(), qn = /* @__PURE__ */ new Map(), $t = [], hc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function pu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        It = null;
        break;
      case "dragenter":
      case "dragleave":
        Ut = null;
        break;
      case "mouseover":
      case "mouseout":
        At = null;
        break;
      case "pointerover":
      case "pointerout":
        Jn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        qn.delete(t.pointerId);
    }
  }
  function Zn(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = dr(t), t !== null && eo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function vc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return It = Zn(It, e, t, n, r, l), !0;
      case "dragenter":
        return Ut = Zn(Ut, e, t, n, r, l), !0;
      case "mouseover":
        return At = Zn(At, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return Jn.set(o, Zn(Jn.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, qn.set(o, Zn(qn.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function mu(e) {
    var t = rn(e.target);
    if (t !== null) {
      var n = nn(t);
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
  function Ur(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = ro(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Hl = r, n.target.dispatchEvent(r), Hl = null;
      } else return t = dr(n), t !== null && eo(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function hu(e, t, n) {
    Ur(e) && n.delete(t);
  }
  function yc() {
    to = !1, It !== null && Ur(It) && (It = null), Ut !== null && Ur(Ut) && (Ut = null), At !== null && Ur(At) && (At = null), Jn.forEach(hu), qn.forEach(hu);
  }
  function bn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, to || (to = !0, g.unstable_scheduleCallback(g.unstable_NormalPriority, yc)));
  }
  function er(e) {
    function t(l) {
      return bn(l, e);
    }
    if (0 < Ir.length) {
      bn(Ir[0], e);
      for (var n = 1; n < Ir.length; n++) {
        var r = Ir[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (It !== null && bn(It, e), Ut !== null && bn(Ut, e), At !== null && bn(At, e), Jn.forEach(t), qn.forEach(t), n = 0; n < $t.length; n++) r = $t[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < $t.length && (n = $t[0], n.blockedOn === null); ) mu(n), n.blockedOn === null && $t.shift();
  }
  var wn = we.ReactCurrentBatchConfig, Ar = !0;
  function gc(e, t, n, r) {
    var l = b, o = wn.transition;
    wn.transition = null;
    try {
      b = 1, no(e, t, n, r);
    } finally {
      b = l, wn.transition = o;
    }
  }
  function wc(e, t, n, r) {
    var l = b, o = wn.transition;
    wn.transition = null;
    try {
      b = 4, no(e, t, n, r);
    } finally {
      b = l, wn.transition = o;
    }
  }
  function no(e, t, n, r) {
    if (Ar) {
      var l = ro(e, t, n, r);
      if (l === null) So(e, t, r, $r, n), pu(e, r);
      else if (vc(l, e, t, n, r)) r.stopPropagation();
      else if (pu(e, r), t & 4 && -1 < hc.indexOf(e)) {
        for (; l !== null; ) {
          var o = dr(l);
          if (o !== null && au(o), o = ro(e, t, n, r), o === null && So(e, t, r, $r, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else So(e, t, r, null, n);
    }
  }
  var $r = null;
  function ro(e, t, n, r) {
    if ($r = null, e = Ql(r), e = rn(e), e !== null) if (t = nn(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = bi(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return $r = e, null;
  }
  function vu(e) {
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
        switch (ic()) {
          case Jl:
            return 1;
          case ou:
            return 4;
          case Lr:
          case uc:
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
  var Bt = null, lo = null, Br = null;
  function yu() {
    if (Br) return Br;
    var e, t = lo, n = t.length, r, l = "value" in Bt ? Bt.value : Bt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Br = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Vr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Wr() {
    return !0;
  }
  function gu() {
    return !1;
  }
  function be(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(o) : o[u]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Wr : gu, this.isPropagationStopped = gu, this;
    }
    return S(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Wr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Wr);
    }, persist: function() {
    }, isPersistent: Wr }), t;
  }
  var kn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, oo = be(kn), tr = S({}, kn, { view: 0, detail: 0 }), kc = be(tr), io, uo, nr, Hr = S({}, tr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ao, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== nr && (nr && e.type === "mousemove" ? (io = e.screenX - nr.screenX, uo = e.screenY - nr.screenY) : uo = io = 0, nr = e), io);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : uo;
  } }), wu = be(Hr), Sc = S({}, Hr, { dataTransfer: 0 }), xc = be(Sc), _c = S({}, tr, { relatedTarget: 0 }), so = be(_c), Ec = S({}, kn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Cc = be(Ec), Pc = S({}, kn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Nc = be(Pc), Tc = S({}, kn, { data: 0 }), ku = be(Tc), zc = {
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
  }, jc = {
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
  }, Rc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Lc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Rc[e]) ? !!t[e] : !1;
  }
  function ao() {
    return Lc;
  }
  var Oc = S({}, tr, { key: function(e) {
    if (e.key) {
      var t = zc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Vr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? jc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ao, charCode: function(e) {
    return e.type === "keypress" ? Vr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Vr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Mc = be(Oc), Fc = S({}, Hr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Su = be(Fc), Dc = S({}, tr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ao }), Ic = be(Dc), Uc = S({}, kn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Ac = be(Uc), $c = S({}, Hr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Bc = be($c), Vc = [9, 13, 27, 32], co = J && "CompositionEvent" in window, rr = null;
  J && "documentMode" in document && (rr = document.documentMode);
  var Wc = J && "TextEvent" in window && !rr, xu = J && (!co || rr && 8 < rr && 11 >= rr), _u = " ", Eu = !1;
  function Cu(e, t) {
    switch (e) {
      case "keyup":
        return Vc.indexOf(t.keyCode) !== -1;
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
  var Sn = !1;
  function Hc(e, t) {
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
  function Qc(e, t) {
    if (Sn) return e === "compositionend" || !co && Cu(e, t) ? (e = yu(), Br = lo = Bt = null, Sn = !1, e) : null;
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
  var Kc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Nu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Kc[e.type] : t === "textarea";
  }
  function Tu(e, t, n, r) {
    Xi(r), t = Gr(t, "onChange"), 0 < t.length && (n = new oo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var lr = null, or = null;
  function Yc(e) {
    Ku(e, 0);
  }
  function Qr(e) {
    var t = Pn(e);
    if (Ce(t)) return e;
  }
  function Xc(e, t) {
    if (e === "change") return t;
  }
  var zu = !1;
  if (J) {
    var fo;
    if (J) {
      var po = "oninput" in document;
      if (!po) {
        var ju = document.createElement("div");
        ju.setAttribute("oninput", "return;"), po = typeof ju.oninput == "function";
      }
      fo = po;
    } else fo = !1;
    zu = fo && (!document.documentMode || 9 < document.documentMode);
  }
  function Ru() {
    lr && (lr.detachEvent("onpropertychange", Lu), or = lr = null);
  }
  function Lu(e) {
    if (e.propertyName === "value" && Qr(or)) {
      var t = [];
      Tu(t, or, e, Ql(e)), Zi(Yc, t);
    }
  }
  function Gc(e, t, n) {
    e === "focusin" ? (Ru(), lr = t, or = n, lr.attachEvent("onpropertychange", Lu)) : e === "focusout" && Ru();
  }
  function Jc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Qr(or);
  }
  function qc(e, t) {
    if (e === "click") return Qr(t);
  }
  function Zc(e, t) {
    if (e === "input" || e === "change") return Qr(t);
  }
  function bc(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var mt = typeof Object.is == "function" ? Object.is : bc;
  function ir(e, t) {
    if (mt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!$.call(t, l) || !mt(e[l], t[l])) return !1;
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
    for (var e = window, t = ot(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ot(e.document);
    }
    return t;
  }
  function mo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function ef(e) {
    var t = Du(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Fu(n.ownerDocument.documentElement, n)) {
      if (r !== null && mo(n)) {
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
  var tf = J && "documentMode" in document && 11 >= document.documentMode, xn = null, ho = null, ur = null, vo = !1;
  function Iu(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    vo || xn == null || xn !== ot(r) || (r = xn, "selectionStart" in r && mo(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), ur && ir(ur, r) || (ur = r, r = Gr(ho, "onSelect"), 0 < r.length && (t = new oo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = xn)));
  }
  function Kr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var _n = { animationend: Kr("Animation", "AnimationEnd"), animationiteration: Kr("Animation", "AnimationIteration"), animationstart: Kr("Animation", "AnimationStart"), transitionend: Kr("Transition", "TransitionEnd") }, yo = {}, Uu = {};
  J && (Uu = document.createElement("div").style, "AnimationEvent" in window || (delete _n.animationend.animation, delete _n.animationiteration.animation, delete _n.animationstart.animation), "TransitionEvent" in window || delete _n.transitionend.transition);
  function Yr(e) {
    if (yo[e]) return yo[e];
    if (!_n[e]) return e;
    var t = _n[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Uu) return yo[e] = t[n];
    return e;
  }
  var Au = Yr("animationend"), $u = Yr("animationiteration"), Bu = Yr("animationstart"), Vu = Yr("transitionend"), Wu = /* @__PURE__ */ new Map(), Hu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Vt(e, t) {
    Wu.set(e, t), W(t, [e]);
  }
  for (var go = 0; go < Hu.length; go++) {
    var wo = Hu[go], nf = wo.toLowerCase(), rf = wo[0].toUpperCase() + wo.slice(1);
    Vt(nf, "on" + rf);
  }
  Vt(Au, "onAnimationEnd"), Vt($u, "onAnimationIteration"), Vt(Bu, "onAnimationStart"), Vt("dblclick", "onDoubleClick"), Vt("focusin", "onFocus"), Vt("focusout", "onBlur"), Vt(Vu, "onTransitionEnd"), le("onMouseEnter", ["mouseout", "mouseover"]), le("onMouseLeave", ["mouseout", "mouseover"]), le("onPointerEnter", ["pointerout", "pointerover"]), le("onPointerLeave", ["pointerout", "pointerover"]), W("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), W("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), W("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), W("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), W("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), W("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var sr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), lf = new Set("cancel close invalid load scroll toggle".split(" ").concat(sr));
  function Qu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, nc(r, t, void 0, e), e.currentTarget = null;
  }
  function Ku(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var u = r[i], a = u.instance, h = u.currentTarget;
          if (u = u.listener, a !== o && l.isPropagationStopped()) break e;
          Qu(l, u, h), o = a;
        }
        else for (i = 0; i < r.length; i++) {
          if (u = r[i], a = u.instance, h = u.currentTarget, u = u.listener, a !== o && l.isPropagationStopped()) break e;
          Qu(l, u, h), o = a;
        }
      }
    }
    if (Rr) throw e = Gl, Rr = !1, Gl = null, e;
  }
  function ne(e, t) {
    var n = t[No];
    n === void 0 && (n = t[No] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (Yu(t, e, 2, !1), n.add(r));
  }
  function ko(e, t, n) {
    var r = 0;
    t && (r |= 4), Yu(n, e, r, t);
  }
  var Xr = "_reactListening" + Math.random().toString(36).slice(2);
  function ar(e) {
    if (!e[Xr]) {
      e[Xr] = !0, j.forEach(function(n) {
        n !== "selectionchange" && (lf.has(n) || ko(n, !1, e), ko(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Xr] || (t[Xr] = !0, ko("selectionchange", !1, t));
    }
  }
  function Yu(e, t, n, r) {
    switch (vu(t)) {
      case 1:
        var l = gc;
        break;
      case 4:
        l = wc;
        break;
      default:
        l = no;
    }
    n = l.bind(null, t, n, e), l = void 0, !Xl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function So(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var u = r.stateNode.containerInfo;
        if (u === l || u.nodeType === 8 && u.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var a = i.tag;
          if ((a === 3 || a === 4) && (a = i.stateNode.containerInfo, a === l || a.nodeType === 8 && a.parentNode === l)) return;
          i = i.return;
        }
        for (; u !== null; ) {
          if (i = rn(u), i === null) return;
          if (a = i.tag, a === 5 || a === 6) {
            r = o = i;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    Zi(function() {
      var h = o, k = Ql(n), x = [];
      e: {
        var w = Wu.get(e);
        if (w !== void 0) {
          var N = oo, R = e;
          switch (e) {
            case "keypress":
              if (Vr(n) === 0) break e;
            case "keydown":
            case "keyup":
              N = Mc;
              break;
            case "focusin":
              R = "focus", N = so;
              break;
            case "focusout":
              R = "blur", N = so;
              break;
            case "beforeblur":
            case "afterblur":
              N = so;
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
              N = wu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              N = xc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              N = Ic;
              break;
            case Au:
            case $u:
            case Bu:
              N = Cc;
              break;
            case Vu:
              N = Ac;
              break;
            case "scroll":
              N = kc;
              break;
            case "wheel":
              N = Bc;
              break;
            case "copy":
            case "cut":
            case "paste":
              N = Nc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              N = Su;
          }
          var L = (t & 4) !== 0, he = !L && e === "scroll", d = L ? w !== null ? w + "Capture" : null : w;
          L = [];
          for (var c = h, p; c !== null; ) {
            p = c;
            var E = p.stateNode;
            if (p.tag === 5 && E !== null && (p = E, d !== null && (E = Qn(c, d), E != null && L.push(cr(c, E, p)))), he) break;
            c = c.return;
          }
          0 < L.length && (w = new N(w, R, null, n, k), x.push({ event: w, listeners: L }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (w = e === "mouseover" || e === "pointerover", N = e === "mouseout" || e === "pointerout", w && n !== Hl && (R = n.relatedTarget || n.fromElement) && (rn(R) || R[Nt])) break e;
          if ((N || w) && (w = k.window === k ? k : (w = k.ownerDocument) ? w.defaultView || w.parentWindow : window, N ? (R = n.relatedTarget || n.toElement, N = h, R = R ? rn(R) : null, R !== null && (he = nn(R), R !== he || R.tag !== 5 && R.tag !== 6) && (R = null)) : (N = null, R = h), N !== R)) {
            if (L = wu, E = "onMouseLeave", d = "onMouseEnter", c = "mouse", (e === "pointerout" || e === "pointerover") && (L = Su, E = "onPointerLeave", d = "onPointerEnter", c = "pointer"), he = N == null ? w : Pn(N), p = R == null ? w : Pn(R), w = new L(E, c + "leave", N, n, k), w.target = he, w.relatedTarget = p, E = null, rn(k) === h && (L = new L(d, c + "enter", R, n, k), L.target = p, L.relatedTarget = he, E = L), he = E, N && R) t: {
              for (L = N, d = R, c = 0, p = L; p; p = En(p)) c++;
              for (p = 0, E = d; E; E = En(E)) p++;
              for (; 0 < c - p; ) L = En(L), c--;
              for (; 0 < p - c; ) d = En(d), p--;
              for (; c--; ) {
                if (L === d || d !== null && L === d.alternate) break t;
                L = En(L), d = En(d);
              }
              L = null;
            }
            else L = null;
            N !== null && Xu(x, w, N, L, !1), R !== null && he !== null && Xu(x, he, R, L, !0);
          }
        }
        e: {
          if (w = h ? Pn(h) : window, N = w.nodeName && w.nodeName.toLowerCase(), N === "select" || N === "input" && w.type === "file") var O = Xc;
          else if (Nu(w)) if (zu) O = Zc;
          else {
            O = Jc;
            var I = Gc;
          }
          else (N = w.nodeName) && N.toLowerCase() === "input" && (w.type === "checkbox" || w.type === "radio") && (O = qc);
          if (O && (O = O(e, h))) {
            Tu(x, O, n, k);
            break e;
          }
          I && I(e, w, h), e === "focusout" && (I = w._wrapperState) && I.controlled && w.type === "number" && Al(w, "number", w.value);
        }
        switch (I = h ? Pn(h) : window, e) {
          case "focusin":
            (Nu(I) || I.contentEditable === "true") && (xn = I, ho = h, ur = null);
            break;
          case "focusout":
            ur = ho = xn = null;
            break;
          case "mousedown":
            vo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            vo = !1, Iu(x, n, k);
            break;
          case "selectionchange":
            if (tf) break;
          case "keydown":
          case "keyup":
            Iu(x, n, k);
        }
        var U;
        if (co) e: {
          switch (e) {
            case "compositionstart":
              var A = "onCompositionStart";
              break e;
            case "compositionend":
              A = "onCompositionEnd";
              break e;
            case "compositionupdate":
              A = "onCompositionUpdate";
              break e;
          }
          A = void 0;
        }
        else Sn ? Cu(e, n) && (A = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (A = "onCompositionStart");
        A && (xu && n.locale !== "ko" && (Sn || A !== "onCompositionStart" ? A === "onCompositionEnd" && Sn && (U = yu()) : (Bt = k, lo = "value" in Bt ? Bt.value : Bt.textContent, Sn = !0)), I = Gr(h, A), 0 < I.length && (A = new ku(A, e, null, n, k), x.push({ event: A, listeners: I }), U ? A.data = U : (U = Pu(n), U !== null && (A.data = U)))), (U = Wc ? Hc(e, n) : Qc(e, n)) && (h = Gr(h, "onBeforeInput"), 0 < h.length && (k = new ku("onBeforeInput", "beforeinput", null, n, k), x.push({ event: k, listeners: h }), k.data = U));
      }
      Ku(x, t);
    });
  }
  function cr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Gr(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Qn(e, n), o != null && r.unshift(cr(e, o, l)), o = Qn(e, t), o != null && r.push(cr(e, o, l))), e = e.return;
    }
    return r;
  }
  function En(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Xu(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var u = n, a = u.alternate, h = u.stateNode;
      if (a !== null && a === r) break;
      u.tag === 5 && h !== null && (u = h, l ? (a = Qn(n, o), a != null && i.unshift(cr(n, a, u))) : l || (a = Qn(n, o), a != null && i.push(cr(n, a, u)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var of = /\r\n?/g, uf = /\u0000|\uFFFD/g;
  function Gu(e) {
    return (typeof e == "string" ? e : "" + e).replace(of, `
`).replace(uf, "");
  }
  function Jr(e, t, n) {
    if (t = Gu(t), Gu(e) !== t && n) throw Error(f(425));
  }
  function qr() {
  }
  var xo = null, _o = null;
  function Eo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Co = typeof setTimeout == "function" ? setTimeout : void 0, sf = typeof clearTimeout == "function" ? clearTimeout : void 0, Ju = typeof Promise == "function" ? Promise : void 0, af = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ju < "u" ? function(e) {
    return Ju.resolve(null).then(e).catch(cf);
  } : Co;
  function cf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Po(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), er(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    er(t);
  }
  function Wt(e) {
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
  var Cn = Math.random().toString(36).slice(2), St = "__reactFiber$" + Cn, fr = "__reactProps$" + Cn, Nt = "__reactContainer$" + Cn, No = "__reactEvents$" + Cn, ff = "__reactListeners$" + Cn, df = "__reactHandles$" + Cn;
  function rn(e) {
    var t = e[St];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Nt] || n[St]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = qu(e); e !== null; ) {
          if (n = e[St]) return n;
          e = qu(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function dr(e) {
    return e = e[St] || e[Nt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Pn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(f(33));
  }
  function Zr(e) {
    return e[fr] || null;
  }
  var To = [], Nn = -1;
  function Ht(e) {
    return { current: e };
  }
  function re(e) {
    0 > Nn || (e.current = To[Nn], To[Nn] = null, Nn--);
  }
  function te(e, t) {
    Nn++, To[Nn] = e.current, e.current = t;
  }
  var Qt = {}, Le = Ht(Qt), Ve = Ht(!1), ln = Qt;
  function Tn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Qt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function We(e) {
    return e = e.childContextTypes, e != null;
  }
  function br() {
    re(Ve), re(Le);
  }
  function Zu(e, t, n) {
    if (Le.current !== Qt) throw Error(f(168));
    te(Le, t), te(Ve, n);
  }
  function bu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(f(108, G(e) || "Unknown", l));
    return S({}, n, r);
  }
  function el(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Qt, ln = Le.current, te(Le, e), te(Ve, Ve.current), !0;
  }
  function es(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(f(169));
    n ? (e = bu(e, t, ln), r.__reactInternalMemoizedMergedChildContext = e, re(Ve), re(Le), te(Le, e)) : re(Ve), te(Ve, n);
  }
  var Tt = null, tl = !1, zo = !1;
  function ts(e) {
    Tt === null ? Tt = [e] : Tt.push(e);
  }
  function pf(e) {
    tl = !0, ts(e);
  }
  function Kt() {
    if (!zo && Tt !== null) {
      zo = !0;
      var e = 0, t = b;
      try {
        var n = Tt;
        for (b = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Tt = null, tl = !1;
      } catch (l) {
        throw Tt !== null && (Tt = Tt.slice(e + 1)), ru(Jl, Kt), l;
      } finally {
        b = t, zo = !1;
      }
    }
    return null;
  }
  var zn = [], jn = 0, nl = null, rl = 0, it = [], ut = 0, on = null, zt = 1, jt = "";
  function un(e, t) {
    zn[jn++] = rl, zn[jn++] = nl, nl = e, rl = t;
  }
  function ns(e, t, n) {
    it[ut++] = zt, it[ut++] = jt, it[ut++] = on, on = e;
    var r = zt;
    e = jt;
    var l = 32 - pt(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - pt(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, zt = 1 << 32 - pt(t) + l | n << l | r, jt = o + e;
    } else zt = 1 << o | n << l | r, jt = e;
  }
  function jo(e) {
    e.return !== null && (un(e, 1), ns(e, 1, 0));
  }
  function Ro(e) {
    for (; e === nl; ) nl = zn[--jn], zn[jn] = null, rl = zn[--jn], zn[jn] = null;
    for (; e === on; ) on = it[--ut], it[ut] = null, jt = it[--ut], it[ut] = null, zt = it[--ut], it[ut] = null;
  }
  var et = null, tt = null, ie = !1, ht = null;
  function rs(e, t) {
    var n = ft(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function ls(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, et = e, tt = Wt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, et = e, tt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = on !== null ? { id: zt, overflow: jt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = ft(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, et = e, tt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Lo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Oo(e) {
    if (ie) {
      var t = tt;
      if (t) {
        var n = t;
        if (!ls(e, t)) {
          if (Lo(e)) throw Error(f(418));
          t = Wt(n.nextSibling);
          var r = et;
          t && ls(e, t) ? rs(r, n) : (e.flags = e.flags & -4097 | 2, ie = !1, et = e);
        }
      } else {
        if (Lo(e)) throw Error(f(418));
        e.flags = e.flags & -4097 | 2, ie = !1, et = e;
      }
    }
  }
  function os(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    et = e;
  }
  function ll(e) {
    if (e !== et) return !1;
    if (!ie) return os(e), ie = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Eo(e.type, e.memoizedProps)), t && (t = tt)) {
      if (Lo(e)) throw is(), Error(f(418));
      for (; t; ) rs(e, t), t = Wt(t.nextSibling);
    }
    if (os(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(f(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                tt = Wt(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        tt = null;
      }
    } else tt = et ? Wt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function is() {
    for (var e = tt; e; ) e = Wt(e.nextSibling);
  }
  function Rn() {
    tt = et = null, ie = !1;
  }
  function Mo(e) {
    ht === null ? ht = [e] : ht.push(e);
  }
  var mf = we.ReactCurrentBatchConfig;
  function pr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(f(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(f(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var u = l.refs;
          i === null ? delete u[o] : u[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(f(284));
      if (!n._owner) throw Error(f(290, e));
    }
    return e;
  }
  function ol(e, t) {
    throw e = Object.prototype.toString.call(t), Error(f(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function us(e) {
    var t = e._init;
    return t(e._payload);
  }
  function ss(e) {
    function t(d, c) {
      if (e) {
        var p = d.deletions;
        p === null ? (d.deletions = [c], d.flags |= 16) : p.push(c);
      }
    }
    function n(d, c) {
      if (!e) return null;
      for (; c !== null; ) t(d, c), c = c.sibling;
      return null;
    }
    function r(d, c) {
      for (d = /* @__PURE__ */ new Map(); c !== null; ) c.key !== null ? d.set(c.key, c) : d.set(c.index, c), c = c.sibling;
      return d;
    }
    function l(d, c) {
      return d = en(d, c), d.index = 0, d.sibling = null, d;
    }
    function o(d, c, p) {
      return d.index = p, e ? (p = d.alternate, p !== null ? (p = p.index, p < c ? (d.flags |= 2, c) : p) : (d.flags |= 2, c)) : (d.flags |= 1048576, c);
    }
    function i(d) {
      return e && d.alternate === null && (d.flags |= 2), d;
    }
    function u(d, c, p, E) {
      return c === null || c.tag !== 6 ? (c = Ci(p, d.mode, E), c.return = d, c) : (c = l(c, p), c.return = d, c);
    }
    function a(d, c, p, E) {
      var O = p.type;
      return O === Ee ? k(d, c, p.props.children, E, p.key) : c !== null && (c.elementType === O || typeof O == "object" && O !== null && O.$$typeof === je && us(O) === c.type) ? (E = l(c, p.props), E.ref = pr(d, c, p), E.return = d, E) : (E = zl(p.type, p.key, p.props, null, d.mode, E), E.ref = pr(d, c, p), E.return = d, E);
    }
    function h(d, c, p, E) {
      return c === null || c.tag !== 4 || c.stateNode.containerInfo !== p.containerInfo || c.stateNode.implementation !== p.implementation ? (c = Pi(p, d.mode, E), c.return = d, c) : (c = l(c, p.children || []), c.return = d, c);
    }
    function k(d, c, p, E, O) {
      return c === null || c.tag !== 7 ? (c = hn(p, d.mode, E, O), c.return = d, c) : (c = l(c, p), c.return = d, c);
    }
    function x(d, c, p) {
      if (typeof c == "string" && c !== "" || typeof c == "number") return c = Ci("" + c, d.mode, p), c.return = d, c;
      if (typeof c == "object" && c !== null) {
        switch (c.$$typeof) {
          case $e:
            return p = zl(c.type, c.key, c.props, null, d.mode, p), p.ref = pr(d, null, c), p.return = d, p;
          case ce:
            return c = Pi(c, d.mode, p), c.return = d, c;
          case je:
            var E = c._init;
            return x(d, E(c._payload), p);
        }
        if (Vn(c) || v(c)) return c = hn(c, d.mode, p, null), c.return = d, c;
        ol(d, c);
      }
      return null;
    }
    function w(d, c, p, E) {
      var O = c !== null ? c.key : null;
      if (typeof p == "string" && p !== "" || typeof p == "number") return O !== null ? null : u(d, c, "" + p, E);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case $e:
            return p.key === O ? a(d, c, p, E) : null;
          case ce:
            return p.key === O ? h(d, c, p, E) : null;
          case je:
            return O = p._init, w(
              d,
              c,
              O(p._payload),
              E
            );
        }
        if (Vn(p) || v(p)) return O !== null ? null : k(d, c, p, E, null);
        ol(d, p);
      }
      return null;
    }
    function N(d, c, p, E, O) {
      if (typeof E == "string" && E !== "" || typeof E == "number") return d = d.get(p) || null, u(c, d, "" + E, O);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case $e:
            return d = d.get(E.key === null ? p : E.key) || null, a(c, d, E, O);
          case ce:
            return d = d.get(E.key === null ? p : E.key) || null, h(c, d, E, O);
          case je:
            var I = E._init;
            return N(d, c, p, I(E._payload), O);
        }
        if (Vn(E) || v(E)) return d = d.get(p) || null, k(c, d, E, O, null);
        ol(c, E);
      }
      return null;
    }
    function R(d, c, p, E) {
      for (var O = null, I = null, U = c, A = c = 0, xe = null; U !== null && A < p.length; A++) {
        U.index > A ? (xe = U, U = null) : xe = U.sibling;
        var X = w(d, U, p[A], E);
        if (X === null) {
          U === null && (U = xe);
          break;
        }
        e && U && X.alternate === null && t(d, U), c = o(X, c, A), I === null ? O = X : I.sibling = X, I = X, U = xe;
      }
      if (A === p.length) return n(d, U), ie && un(d, A), O;
      if (U === null) {
        for (; A < p.length; A++) U = x(d, p[A], E), U !== null && (c = o(U, c, A), I === null ? O = U : I.sibling = U, I = U);
        return ie && un(d, A), O;
      }
      for (U = r(d, U); A < p.length; A++) xe = N(U, d, A, p[A], E), xe !== null && (e && xe.alternate !== null && U.delete(xe.key === null ? A : xe.key), c = o(xe, c, A), I === null ? O = xe : I.sibling = xe, I = xe);
      return e && U.forEach(function(tn) {
        return t(d, tn);
      }), ie && un(d, A), O;
    }
    function L(d, c, p, E) {
      var O = v(p);
      if (typeof O != "function") throw Error(f(150));
      if (p = O.call(p), p == null) throw Error(f(151));
      for (var I = O = null, U = c, A = c = 0, xe = null, X = p.next(); U !== null && !X.done; A++, X = p.next()) {
        U.index > A ? (xe = U, U = null) : xe = U.sibling;
        var tn = w(d, U, X.value, E);
        if (tn === null) {
          U === null && (U = xe);
          break;
        }
        e && U && tn.alternate === null && t(d, U), c = o(tn, c, A), I === null ? O = tn : I.sibling = tn, I = tn, U = xe;
      }
      if (X.done) return n(
        d,
        U
      ), ie && un(d, A), O;
      if (U === null) {
        for (; !X.done; A++, X = p.next()) X = x(d, X.value, E), X !== null && (c = o(X, c, A), I === null ? O = X : I.sibling = X, I = X);
        return ie && un(d, A), O;
      }
      for (U = r(d, U); !X.done; A++, X = p.next()) X = N(U, d, A, X.value, E), X !== null && (e && X.alternate !== null && U.delete(X.key === null ? A : X.key), c = o(X, c, A), I === null ? O = X : I.sibling = X, I = X);
      return e && U.forEach(function(Yf) {
        return t(d, Yf);
      }), ie && un(d, A), O;
    }
    function he(d, c, p, E) {
      if (typeof p == "object" && p !== null && p.type === Ee && p.key === null && (p = p.props.children), typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case $e:
            e: {
              for (var O = p.key, I = c; I !== null; ) {
                if (I.key === O) {
                  if (O = p.type, O === Ee) {
                    if (I.tag === 7) {
                      n(d, I.sibling), c = l(I, p.props.children), c.return = d, d = c;
                      break e;
                    }
                  } else if (I.elementType === O || typeof O == "object" && O !== null && O.$$typeof === je && us(O) === I.type) {
                    n(d, I.sibling), c = l(I, p.props), c.ref = pr(d, I, p), c.return = d, d = c;
                    break e;
                  }
                  n(d, I);
                  break;
                } else t(d, I);
                I = I.sibling;
              }
              p.type === Ee ? (c = hn(p.props.children, d.mode, E, p.key), c.return = d, d = c) : (E = zl(p.type, p.key, p.props, null, d.mode, E), E.ref = pr(d, c, p), E.return = d, d = E);
            }
            return i(d);
          case ce:
            e: {
              for (I = p.key; c !== null; ) {
                if (c.key === I) if (c.tag === 4 && c.stateNode.containerInfo === p.containerInfo && c.stateNode.implementation === p.implementation) {
                  n(d, c.sibling), c = l(c, p.children || []), c.return = d, d = c;
                  break e;
                } else {
                  n(d, c);
                  break;
                }
                else t(d, c);
                c = c.sibling;
              }
              c = Pi(p, d.mode, E), c.return = d, d = c;
            }
            return i(d);
          case je:
            return I = p._init, he(d, c, I(p._payload), E);
        }
        if (Vn(p)) return R(d, c, p, E);
        if (v(p)) return L(d, c, p, E);
        ol(d, p);
      }
      return typeof p == "string" && p !== "" || typeof p == "number" ? (p = "" + p, c !== null && c.tag === 6 ? (n(d, c.sibling), c = l(c, p), c.return = d, d = c) : (n(d, c), c = Ci(p, d.mode, E), c.return = d, d = c), i(d)) : n(d, c);
    }
    return he;
  }
  var Ln = ss(!0), as = ss(!1), il = Ht(null), ul = null, On = null, Fo = null;
  function Do() {
    Fo = On = ul = null;
  }
  function Io(e) {
    var t = il.current;
    re(il), e._currentValue = t;
  }
  function Uo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Mn(e, t) {
    ul = e, Fo = On = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (He = !0), e.firstContext = null);
  }
  function st(e) {
    var t = e._currentValue;
    if (Fo !== e) if (e = { context: e, memoizedValue: t, next: null }, On === null) {
      if (ul === null) throw Error(f(308));
      On = e, ul.dependencies = { lanes: 0, firstContext: e };
    } else On = On.next = e;
    return t;
  }
  var sn = null;
  function Ao(e) {
    sn === null ? sn = [e] : sn.push(e);
  }
  function cs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Ao(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Rt(e, r);
  }
  function Rt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Yt = !1;
  function $o(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function fs(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Lt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Xt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (K & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Rt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Ao(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Rt(e, n);
  }
  function sl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, bl(e, n);
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
  function al(e, t, n, r) {
    var l = e.updateQueue;
    Yt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var a = u, h = a.next;
      a.next = null, i === null ? o = h : i.next = h, i = a;
      var k = e.alternate;
      k !== null && (k = k.updateQueue, u = k.lastBaseUpdate, u !== i && (u === null ? k.firstBaseUpdate = h : u.next = h, k.lastBaseUpdate = a));
    }
    if (o !== null) {
      var x = l.baseState;
      i = 0, k = h = a = null, u = o;
      do {
        var w = u.lane, N = u.eventTime;
        if ((r & w) === w) {
          k !== null && (k = k.next = {
            eventTime: N,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var R = e, L = u;
            switch (w = t, N = n, L.tag) {
              case 1:
                if (R = L.payload, typeof R == "function") {
                  x = R.call(N, x, w);
                  break e;
                }
                x = R;
                break e;
              case 3:
                R.flags = R.flags & -65537 | 128;
              case 0:
                if (R = L.payload, w = typeof R == "function" ? R.call(N, x, w) : R, w == null) break e;
                x = S({}, x, w);
                break e;
              case 2:
                Yt = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, w = l.effects, w === null ? l.effects = [u] : w.push(u));
        } else N = { eventTime: N, lane: w, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, k === null ? (h = k = N, a = x) : k = k.next = N, i |= w;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          w = u, u = w.next, w.next = null, l.lastBaseUpdate = w, l.shared.pending = null;
        }
      } while (!0);
      if (k === null && (a = x), l.baseState = a, l.firstBaseUpdate = h, l.lastBaseUpdate = k, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      fn |= i, e.lanes = i, e.memoizedState = x;
    }
  }
  function ps(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(f(191, l));
        l.call(r);
      }
    }
  }
  var mr = {}, xt = Ht(mr), hr = Ht(mr), vr = Ht(mr);
  function an(e) {
    if (e === mr) throw Error(f(174));
    return e;
  }
  function Bo(e, t) {
    switch (te(vr, t), te(hr, e), te(xt, mr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Bl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Bl(t, e);
    }
    re(xt), te(xt, t);
  }
  function Fn() {
    re(xt), re(hr), re(vr);
  }
  function ms(e) {
    an(vr.current);
    var t = an(xt.current), n = Bl(t, e.type);
    t !== n && (te(hr, e), te(xt, n));
  }
  function Vo(e) {
    hr.current === e && (re(xt), re(hr));
  }
  var se = Ht(0);
  function cl(e) {
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
  var Wo = [];
  function Ho() {
    for (var e = 0; e < Wo.length; e++) Wo[e]._workInProgressVersionPrimary = null;
    Wo.length = 0;
  }
  var fl = we.ReactCurrentDispatcher, Qo = we.ReactCurrentBatchConfig, cn = 0, ae = null, ye = null, ke = null, dl = !1, yr = !1, gr = 0, hf = 0;
  function Oe() {
    throw Error(f(321));
  }
  function Ko(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!mt(e[n], t[n])) return !1;
    return !0;
  }
  function Yo(e, t, n, r, l, o) {
    if (cn = o, ae = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, fl.current = e === null || e.memoizedState === null ? wf : kf, e = n(r, l), yr) {
      o = 0;
      do {
        if (yr = !1, gr = 0, 25 <= o) throw Error(f(301));
        o += 1, ke = ye = null, t.updateQueue = null, fl.current = Sf, e = n(r, l);
      } while (yr);
    }
    if (fl.current = hl, t = ye !== null && ye.next !== null, cn = 0, ke = ye = ae = null, dl = !1, t) throw Error(f(300));
    return e;
  }
  function Xo() {
    var e = gr !== 0;
    return gr = 0, e;
  }
  function _t() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return ke === null ? ae.memoizedState = ke = e : ke = ke.next = e, ke;
  }
  function at() {
    if (ye === null) {
      var e = ae.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = ye.next;
    var t = ke === null ? ae.memoizedState : ke.next;
    if (t !== null) ke = t, ye = e;
    else {
      if (e === null) throw Error(f(310));
      ye = e, e = { memoizedState: ye.memoizedState, baseState: ye.baseState, baseQueue: ye.baseQueue, queue: ye.queue, next: null }, ke === null ? ae.memoizedState = ke = e : ke = ke.next = e;
    }
    return ke;
  }
  function wr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Go(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(f(311));
    n.lastRenderedReducer = e;
    var r = ye, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        l.next = o.next, o.next = i;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var u = i = null, a = null, h = o;
      do {
        var k = h.lane;
        if ((cn & k) === k) a !== null && (a = a.next = { lane: 0, action: h.action, hasEagerState: h.hasEagerState, eagerState: h.eagerState, next: null }), r = h.hasEagerState ? h.eagerState : e(r, h.action);
        else {
          var x = {
            lane: k,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null
          };
          a === null ? (u = a = x, i = r) : a = a.next = x, ae.lanes |= k, fn |= k;
        }
        h = h.next;
      } while (h !== null && h !== o);
      a === null ? i = r : a.next = u, mt(r, t.memoizedState) || (He = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = a, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, ae.lanes |= o, fn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Jo(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(f(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = l = l.next;
      do
        o = e(o, i.action), i = i.next;
      while (i !== l);
      mt(o, t.memoizedState) || (He = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function hs() {
  }
  function vs(e, t) {
    var n = ae, r = at(), l = t(), o = !mt(r.memoizedState, l);
    if (o && (r.memoizedState = l, He = !0), r = r.queue, qo(ws.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || ke !== null && ke.memoizedState.tag & 1) {
      if (n.flags |= 2048, kr(9, gs.bind(null, n, r, l, t), void 0, null), Se === null) throw Error(f(349));
      (cn & 30) !== 0 || ys(n, t, l);
    }
    return l;
  }
  function ys(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ae.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ae.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
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
      return !mt(e, n);
    } catch {
      return !0;
    }
  }
  function Ss(e) {
    var t = Rt(e, 1);
    t !== null && wt(t, e, 1, -1);
  }
  function xs(e) {
    var t = _t();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: wr, lastRenderedState: e }, t.queue = e, e = e.dispatch = gf.bind(null, ae, e), [t.memoizedState, e];
  }
  function kr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = ae.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ae.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function _s() {
    return at().memoizedState;
  }
  function pl(e, t, n, r) {
    var l = _t();
    ae.flags |= e, l.memoizedState = kr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function ml(e, t, n, r) {
    var l = at();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (ye !== null) {
      var i = ye.memoizedState;
      if (o = i.destroy, r !== null && Ko(r, i.deps)) {
        l.memoizedState = kr(t, n, o, r);
        return;
      }
    }
    ae.flags |= e, l.memoizedState = kr(1 | t, n, o, r);
  }
  function Es(e, t) {
    return pl(8390656, 8, e, t);
  }
  function qo(e, t) {
    return ml(2048, 8, e, t);
  }
  function Cs(e, t) {
    return ml(4, 2, e, t);
  }
  function Ps(e, t) {
    return ml(4, 4, e, t);
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
    return n = n != null ? n.concat([e]) : null, ml(4, 4, Ns.bind(null, t, e), n);
  }
  function Zo() {
  }
  function zs(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Ko(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function js(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Ko(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Rs(e, t, n) {
    return (cn & 21) === 0 ? (e.baseState && (e.baseState = !1, He = !0), e.memoizedState = n) : (mt(n, t) || (n = uu(), ae.lanes |= n, fn |= n, e.baseState = !0), t);
  }
  function vf(e, t) {
    var n = b;
    b = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Qo.transition;
    Qo.transition = {};
    try {
      e(!1), t();
    } finally {
      b = n, Qo.transition = r;
    }
  }
  function Ls() {
    return at().memoizedState;
  }
  function yf(e, t, n) {
    var r = Zt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Os(e)) Ms(t, n);
    else if (n = cs(e, t, n, r), n !== null) {
      var l = Ae();
      wt(n, e, r, l), Fs(n, t, r);
    }
  }
  function gf(e, t, n) {
    var r = Zt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Os(e)) Ms(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, u = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = u, mt(u, i)) {
          var a = t.interleaved;
          a === null ? (l.next = l, Ao(t)) : (l.next = a.next, a.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = cs(e, t, l, r), n !== null && (l = Ae(), wt(n, e, r, l), Fs(n, t, r));
    }
  }
  function Os(e) {
    var t = e.alternate;
    return e === ae || t !== null && t === ae;
  }
  function Ms(e, t) {
    yr = dl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Fs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, bl(e, n);
    }
  }
  var hl = { readContext: st, useCallback: Oe, useContext: Oe, useEffect: Oe, useImperativeHandle: Oe, useInsertionEffect: Oe, useLayoutEffect: Oe, useMemo: Oe, useReducer: Oe, useRef: Oe, useState: Oe, useDebugValue: Oe, useDeferredValue: Oe, useTransition: Oe, useMutableSource: Oe, useSyncExternalStore: Oe, useId: Oe, unstable_isNewReconciler: !1 }, wf = { readContext: st, useCallback: function(e, t) {
    return _t().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: st, useEffect: Es, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, pl(
      4194308,
      4,
      Ns.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return pl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return pl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = _t();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = _t();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = yf.bind(null, ae, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = _t();
    return e = { current: e }, t.memoizedState = e;
  }, useState: xs, useDebugValue: Zo, useDeferredValue: function(e) {
    return _t().memoizedState = e;
  }, useTransition: function() {
    var e = xs(!1), t = e[0];
    return e = vf.bind(null, e[1]), _t().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = ae, l = _t();
    if (ie) {
      if (n === void 0) throw Error(f(407));
      n = n();
    } else {
      if (n = t(), Se === null) throw Error(f(349));
      (cn & 30) !== 0 || ys(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Es(ws.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, kr(9, gs.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = _t(), t = Se.identifierPrefix;
    if (ie) {
      var n = jt, r = zt;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = gr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = hf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, kf = {
    readContext: st,
    useCallback: zs,
    useContext: st,
    useEffect: qo,
    useImperativeHandle: Ts,
    useInsertionEffect: Cs,
    useLayoutEffect: Ps,
    useMemo: js,
    useReducer: Go,
    useRef: _s,
    useState: function() {
      return Go(wr);
    },
    useDebugValue: Zo,
    useDeferredValue: function(e) {
      var t = at();
      return Rs(t, ye.memoizedState, e);
    },
    useTransition: function() {
      var e = Go(wr)[0], t = at().memoizedState;
      return [e, t];
    },
    useMutableSource: hs,
    useSyncExternalStore: vs,
    useId: Ls,
    unstable_isNewReconciler: !1
  }, Sf = { readContext: st, useCallback: zs, useContext: st, useEffect: qo, useImperativeHandle: Ts, useInsertionEffect: Cs, useLayoutEffect: Ps, useMemo: js, useReducer: Jo, useRef: _s, useState: function() {
    return Jo(wr);
  }, useDebugValue: Zo, useDeferredValue: function(e) {
    var t = at();
    return ye === null ? t.memoizedState = e : Rs(t, ye.memoizedState, e);
  }, useTransition: function() {
    var e = Jo(wr)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: hs, useSyncExternalStore: vs, useId: Ls, unstable_isNewReconciler: !1 };
  function vt(e, t) {
    if (e && e.defaultProps) {
      t = S({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function bo(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : S({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var vl = { isMounted: function(e) {
    return (e = e._reactInternals) ? nn(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ae(), l = Zt(e), o = Lt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Xt(e, o, l), t !== null && (wt(t, e, l, r), sl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ae(), l = Zt(e), o = Lt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Xt(e, o, l), t !== null && (wt(t, e, l, r), sl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ae(), r = Zt(e), l = Lt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Xt(e, l, r), t !== null && (wt(t, e, r, n), sl(t, e, r));
  } };
  function Ds(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !ir(n, r) || !ir(l, o) : !0;
  }
  function Is(e, t, n) {
    var r = !1, l = Qt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = st(o) : (l = We(t) ? ln : Le.current, r = t.contextTypes, o = (r = r != null) ? Tn(e, l) : Qt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = vl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Us(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && vl.enqueueReplaceState(t, t.state, null);
  }
  function ei(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, $o(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = st(o) : (o = We(t) ? ln : Le.current, l.context = Tn(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (bo(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && vl.enqueueReplaceState(l, l.state, null), al(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Dn(e, t) {
    try {
      var n = "", r = t;
      do
        n += D(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function ti(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ni(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var xf = typeof WeakMap == "function" ? WeakMap : Map;
  function As(e, t, n) {
    n = Lt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      _l || (_l = !0, yi = r), ni(e, t);
    }, n;
  }
  function $s(e, t, n) {
    n = Lt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ni(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      ni(e, t), typeof r != "function" && (Jt === null ? Jt = /* @__PURE__ */ new Set([this]) : Jt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function Bs(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new xf();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Df.bind(null, e, t, n), t.then(e, e));
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
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Lt(-1, 1), t.tag = 2, Xt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var _f = we.ReactCurrentOwner, He = !1;
  function Ue(e, t, n, r) {
    t.child = e === null ? as(t, null, n, r) : Ln(t, e.child, n, r);
  }
  function Hs(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Mn(t, l), r = Yo(e, t, n, r, o, l), n = Xo(), e !== null && !He ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Ot(e, t, l)) : (ie && n && jo(t), t.flags |= 1, Ue(e, t, r, l), t.child);
  }
  function Qs(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Ei(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, Ks(e, t, o, r, l)) : (e = zl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ir, n(i, r) && e.ref === t.ref) return Ot(e, t, l);
    }
    return t.flags |= 1, e = en(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Ks(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (ir(o, r) && e.ref === t.ref) if (He = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (He = !0);
      else return t.lanes = e.lanes, Ot(e, t, l);
    }
    return ri(e, t, n, r, l);
  }
  function Ys(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, te(Un, nt), nt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, te(Un, nt), nt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, te(Un, nt), nt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, te(Un, nt), nt |= r;
    return Ue(e, t, l, n), t.child;
  }
  function Xs(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ri(e, t, n, r, l) {
    var o = We(n) ? ln : Le.current;
    return o = Tn(t, o), Mn(t, l), n = Yo(e, t, n, r, o, l), r = Xo(), e !== null && !He ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Ot(e, t, l)) : (ie && r && jo(t), t.flags |= 1, Ue(e, t, n, l), t.child);
  }
  function Gs(e, t, n, r, l) {
    if (We(n)) {
      var o = !0;
      el(t);
    } else o = !1;
    if (Mn(t, l), t.stateNode === null) gl(e, t), Is(t, n, r), ei(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, u = t.memoizedProps;
      i.props = u;
      var a = i.context, h = n.contextType;
      typeof h == "object" && h !== null ? h = st(h) : (h = We(n) ? ln : Le.current, h = Tn(t, h));
      var k = n.getDerivedStateFromProps, x = typeof k == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      x || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== r || a !== h) && Us(t, i, r, h), Yt = !1;
      var w = t.memoizedState;
      i.state = w, al(t, r, i, l), a = t.memoizedState, u !== r || w !== a || Ve.current || Yt ? (typeof k == "function" && (bo(t, n, k, r), a = t.memoizedState), (u = Yt || Ds(t, n, u, r, w, a, h)) ? (x || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = a), i.props = r, i.state = a, i.context = h, r = u) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, fs(e, t), u = t.memoizedProps, h = t.type === t.elementType ? u : vt(t.type, u), i.props = h, x = t.pendingProps, w = i.context, a = n.contextType, typeof a == "object" && a !== null ? a = st(a) : (a = We(n) ? ln : Le.current, a = Tn(t, a));
      var N = n.getDerivedStateFromProps;
      (k = typeof N == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== x || w !== a) && Us(t, i, r, a), Yt = !1, w = t.memoizedState, i.state = w, al(t, r, i, l);
      var R = t.memoizedState;
      u !== x || w !== R || Ve.current || Yt ? (typeof N == "function" && (bo(t, n, N, r), R = t.memoizedState), (h = Yt || Ds(t, n, h, r, w, R, a) || !1) ? (k || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, R, a), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, R, a)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = R), i.props = r, i.state = R, i.context = a, r = h) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return li(e, t, n, r, o, l);
  }
  function li(e, t, n, r, l, o) {
    Xs(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && es(t, n, !1), Ot(e, t, o);
    r = t.stateNode, _f.current = t;
    var u = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = Ln(t, e.child, null, o), t.child = Ln(t, null, u, o)) : Ue(e, t, u, o), t.memoizedState = r.state, l && es(t, n, !0), t.child;
  }
  function Js(e) {
    var t = e.stateNode;
    t.pendingContext ? Zu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Zu(e, t.context, !1), Bo(e, t.containerInfo);
  }
  function qs(e, t, n, r, l) {
    return Rn(), Mo(l), t.flags |= 256, Ue(e, t, n, r), t.child;
  }
  var oi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ii(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Zs(e, t, n) {
    var r = t.pendingProps, l = se.current, o = !1, i = (t.flags & 128) !== 0, u;
    if ((u = i) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), te(se, l & 1), e === null)
      return Oo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = jl(i, r, 0, null), e = hn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = ii(n), t.memoizedState = oi, e) : ui(t, i));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return Ef(e, t, i, r, u, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, u = l.sibling;
      var a = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = a, t.deletions = null) : (r = en(l, a), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? o = en(u, o) : (o = hn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? ii(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = oi, r;
    }
    return o = e.child, e = o.sibling, r = en(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ui(e, t) {
    return t = jl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function yl(e, t, n, r) {
    return r !== null && Mo(r), Ln(t, e.child, null, n), e = ui(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Ef(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ti(Error(f(422))), yl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = jl({ mode: "visible", children: r.children }, l, 0, null), o = hn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && Ln(t, e.child, null, i), t.child.memoizedState = ii(i), t.memoizedState = oi, o);
    if ((t.mode & 1) === 0) return yl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, o = Error(f(419)), r = ti(o, r, void 0), yl(e, t, i, r);
    }
    if (u = (i & e.childLanes) !== 0, He || u) {
      if (r = Se, r !== null) {
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Rt(e, l), wt(r, e, l, -1));
      }
      return _i(), r = ti(Error(f(421))), yl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = If.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, tt = Wt(l.nextSibling), et = t, ie = !0, ht = null, e !== null && (it[ut++] = zt, it[ut++] = jt, it[ut++] = on, zt = e.id, jt = e.overflow, on = t), t = ui(t, r.children), t.flags |= 4096, t);
  }
  function bs(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Uo(e.return, t, n);
  }
  function si(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function ea(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (Ue(e, t, r.children, n), r = se.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
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
    if (te(se, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && cl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), si(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && cl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        si(t, !0, n, null, o);
        break;
      case "together":
        si(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function gl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Ot(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), fn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(f(153));
    if (t.child !== null) {
      for (e = t.child, n = en(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = en(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Cf(e, t, n) {
    switch (t.tag) {
      case 3:
        Js(t), Rn();
        break;
      case 5:
        ms(t);
        break;
      case 1:
        We(t.type) && el(t);
        break;
      case 4:
        Bo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        te(il, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (te(se, se.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Zs(e, t, n) : (te(se, se.current & 1), e = Ot(e, t, n), e !== null ? e.sibling : null);
        te(se, se.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ea(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), te(se, se.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Ys(e, t, n);
    }
    return Ot(e, t, n);
  }
  var ta, ai, na, ra;
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
  }, ai = function() {
  }, na = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, an(xt.current);
      var o = null;
      switch (n) {
        case "input":
          l = Ze(e, l), r = Ze(e, r), o = [];
          break;
        case "select":
          l = S({}, l, { value: void 0 }), r = S({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = $l(e, l), r = $l(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = qr);
      }
      Vl(n, r);
      var i;
      n = null;
      for (h in l) if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null) if (h === "style") {
        var u = l[h];
        for (i in u) u.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else h !== "dangerouslySetInnerHTML" && h !== "children" && h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && h !== "autoFocus" && (F.hasOwnProperty(h) ? o || (o = []) : (o = o || []).push(h, null));
      for (h in r) {
        var a = r[h];
        if (u = l != null ? l[h] : void 0, r.hasOwnProperty(h) && a !== u && (a != null || u != null)) if (h === "style") if (u) {
          for (i in u) !u.hasOwnProperty(i) || a && a.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in a) a.hasOwnProperty(i) && u[i] !== a[i] && (n || (n = {}), n[i] = a[i]);
        } else n || (o || (o = []), o.push(
          h,
          n
        )), n = a;
        else h === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, u = u ? u.__html : void 0, a != null && u !== a && (o = o || []).push(h, a)) : h === "children" ? typeof a != "string" && typeof a != "number" || (o = o || []).push(h, "" + a) : h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && (F.hasOwnProperty(h) ? (a != null && h === "onScroll" && ne("scroll", e), o || u === a || (o = [])) : (o = o || []).push(h, a));
      }
      n && (o = o || []).push("style", n);
      var h = o;
      (t.updateQueue = h) && (t.flags |= 4);
    }
  }, ra = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function Sr(e, t) {
    if (!ie) switch (e.tailMode) {
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
  function Me(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Pf(e, t, n) {
    var r = t.pendingProps;
    switch (Ro(t), t.tag) {
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
        return Me(t), null;
      case 1:
        return We(t.type) && br(), Me(t), null;
      case 3:
        return r = t.stateNode, Fn(), re(Ve), re(Le), Ho(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ll(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, ht !== null && (ki(ht), ht = null))), ai(e, t), Me(t), null;
      case 5:
        Vo(t);
        var l = an(vr.current);
        if (n = t.type, e !== null && t.stateNode != null) na(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(f(166));
            return Me(t), null;
          }
          if (e = an(xt.current), ll(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[St] = t, r[fr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                ne("cancel", r), ne("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ne("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < sr.length; l++) ne(sr[l], r);
                break;
              case "source":
                ne("error", r);
                break;
              case "img":
              case "image":
              case "link":
                ne(
                  "error",
                  r
                ), ne("load", r);
                break;
              case "details":
                ne("toggle", r);
                break;
              case "input":
                Pt(r, o), ne("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, ne("invalid", r);
                break;
              case "textarea":
                $i(r, o), ne("invalid", r);
            }
            Vl(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var u = o[i];
              i === "children" ? typeof u == "string" ? r.textContent !== u && (o.suppressHydrationWarning !== !0 && Jr(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (o.suppressHydrationWarning !== !0 && Jr(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : F.hasOwnProperty(i) && u != null && i === "onScroll" && ne("scroll", r);
            }
            switch (n) {
              case "input":
                qe(r), Ai(r, o, !0);
                break;
              case "textarea":
                qe(r), Vi(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = qr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Wi(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[St] = t, e[fr] = r, ta(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Wl(n, r), n) {
                case "dialog":
                  ne("cancel", e), ne("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ne("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < sr.length; l++) ne(sr[l], e);
                  l = r;
                  break;
                case "source":
                  ne("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  ne(
                    "error",
                    e
                  ), ne("load", e), l = r;
                  break;
                case "details":
                  ne("toggle", e), l = r;
                  break;
                case "input":
                  Pt(e, r), l = Ze(e, r), ne("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = S({}, r, { value: void 0 }), ne("invalid", e);
                  break;
                case "textarea":
                  $i(e, r), l = $l(e, r), ne("invalid", e);
                  break;
                default:
                  l = r;
              }
              Vl(n, l), u = l;
              for (o in u) if (u.hasOwnProperty(o)) {
                var a = u[o];
                o === "style" ? Ki(e, a) : o === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && Hi(e, a)) : o === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && Wn(e, a) : typeof a == "number" && Wn(e, "" + a) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (F.hasOwnProperty(o) ? a != null && o === "onScroll" && ne("scroll", e) : a != null && Ge(e, o, a, i));
              }
              switch (n) {
                case "input":
                  qe(e), Ai(e, r, !1);
                  break;
                case "textarea":
                  qe(e), Vi(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + H(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? vn(e, !!r.multiple, o, !1) : r.defaultValue != null && vn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = qr);
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
        return Me(t), null;
      case 6:
        if (e && t.stateNode != null) ra(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(f(166));
          if (n = an(vr.current), an(xt.current), ll(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[St] = t, (o = r.nodeValue !== n) && (e = et, e !== null)) switch (e.tag) {
              case 3:
                Jr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Jr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[St] = t, t.stateNode = r;
        }
        return Me(t), null;
      case 13:
        if (re(se), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ie && tt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) is(), Rn(), t.flags |= 98560, o = !1;
          else if (o = ll(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(f(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(f(317));
              o[St] = t;
            } else Rn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Me(t), o = !1;
          } else ht !== null && (ki(ht), ht = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (se.current & 1) !== 0 ? ge === 0 && (ge = 3) : _i())), t.updateQueue !== null && (t.flags |= 4), Me(t), null);
      case 4:
        return Fn(), ai(e, t), e === null && ar(t.stateNode.containerInfo), Me(t), null;
      case 10:
        return Io(t.type._context), Me(t), null;
      case 17:
        return We(t.type) && br(), Me(t), null;
      case 19:
        if (re(se), o = t.memoizedState, o === null) return Me(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) Sr(o, !1);
        else {
          if (ge !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = cl(e), i !== null) {
              for (t.flags |= 128, Sr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return te(se, se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && me() > An && (t.flags |= 128, r = !0, Sr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = cl(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Sr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ie) return Me(t), null;
          } else 2 * me() - o.renderingStartTime > An && n !== 1073741824 && (t.flags |= 128, r = !0, Sr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = me(), t.sibling = null, n = se.current, te(se, r ? n & 1 | 2 : n & 1), t) : (Me(t), null);
      case 22:
      case 23:
        return xi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (nt & 1073741824) !== 0 && (Me(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Me(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(f(156, t.tag));
  }
  function Nf(e, t) {
    switch (Ro(t), t.tag) {
      case 1:
        return We(t.type) && br(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Fn(), re(Ve), re(Le), Ho(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Vo(t), null;
      case 13:
        if (re(se), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(f(340));
          Rn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return re(se), null;
      case 4:
        return Fn(), null;
      case 10:
        return Io(t.type._context), null;
      case 22:
      case 23:
        return xi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var wl = !1, Fe = !1, Tf = typeof WeakSet == "function" ? WeakSet : Set, z = null;
  function In(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      de(e, t, r);
    }
    else n.current = null;
  }
  function ci(e, t, n) {
    try {
      n();
    } catch (r) {
      de(e, t, r);
    }
  }
  var la = !1;
  function zf(e, t) {
    if (xo = Ar, e = Du(), mo(e)) {
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
          var i = 0, u = -1, a = -1, h = 0, k = 0, x = e, w = null;
          t: for (; ; ) {
            for (var N; x !== n || l !== 0 && x.nodeType !== 3 || (u = i + l), x !== o || r !== 0 && x.nodeType !== 3 || (a = i + r), x.nodeType === 3 && (i += x.nodeValue.length), (N = x.firstChild) !== null; )
              w = x, x = N;
            for (; ; ) {
              if (x === e) break t;
              if (w === n && ++h === l && (u = i), w === o && ++k === r && (a = i), (N = x.nextSibling) !== null) break;
              x = w, w = x.parentNode;
            }
            x = N;
          }
          n = u === -1 || a === -1 ? null : { start: u, end: a };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (_o = { focusedElem: e, selectionRange: n }, Ar = !1, z = t; z !== null; ) if (t = z, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, z = e;
    else for (; z !== null; ) {
      t = z;
      try {
        var R = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (R !== null) {
              var L = R.memoizedProps, he = R.memoizedState, d = t.stateNode, c = d.getSnapshotBeforeUpdate(t.elementType === t.type ? L : vt(t.type, L), he);
              d.__reactInternalSnapshotBeforeUpdate = c;
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
            throw Error(f(163));
        }
      } catch (E) {
        de(t, t.return, E);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, z = e;
        break;
      }
      z = t.return;
    }
    return R = la, la = !1, R;
  }
  function xr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && ci(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function kl(e, t) {
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
  function fi(e) {
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
    t !== null && (e.alternate = null, oa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[St], delete t[fr], delete t[No], delete t[ff], delete t[df])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
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
  function di(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = qr));
    else if (r !== 4 && (e = e.child, e !== null)) for (di(e, t, n), e = e.sibling; e !== null; ) di(e, t, n), e = e.sibling;
  }
  function pi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (pi(e, t, n), e = e.sibling; e !== null; ) pi(e, t, n), e = e.sibling;
  }
  var Pe = null, yt = !1;
  function Gt(e, t, n) {
    for (n = n.child; n !== null; ) sa(e, t, n), n = n.sibling;
  }
  function sa(e, t, n) {
    if (kt && typeof kt.onCommitFiberUnmount == "function") try {
      kt.onCommitFiberUnmount(Or, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Fe || In(n, t);
      case 6:
        var r = Pe, l = yt;
        Pe = null, Gt(e, t, n), Pe = r, yt = l, Pe !== null && (yt ? (e = Pe, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Pe.removeChild(n.stateNode));
        break;
      case 18:
        Pe !== null && (yt ? (e = Pe, n = n.stateNode, e.nodeType === 8 ? Po(e.parentNode, n) : e.nodeType === 1 && Po(e, n), er(e)) : Po(Pe, n.stateNode));
        break;
      case 4:
        r = Pe, l = yt, Pe = n.stateNode.containerInfo, yt = !0, Gt(e, t, n), Pe = r, yt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Fe && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && ci(n, t, i), l = l.next;
          } while (l !== r);
        }
        Gt(e, t, n);
        break;
      case 1:
        if (!Fe && (In(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          de(n, t, u);
        }
        Gt(e, t, n);
        break;
      case 21:
        Gt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Fe = (r = Fe) || n.memoizedState !== null, Gt(e, t, n), Fe = r) : Gt(e, t, n);
        break;
      default:
        Gt(e, t, n);
    }
  }
  function aa(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Tf()), t.forEach(function(r) {
        var l = Uf.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function gt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, u = i;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              Pe = u.stateNode, yt = !1;
              break e;
            case 3:
              Pe = u.stateNode.containerInfo, yt = !0;
              break e;
            case 4:
              Pe = u.stateNode.containerInfo, yt = !0;
              break e;
          }
          u = u.return;
        }
        if (Pe === null) throw Error(f(160));
        sa(o, i, l), Pe = null, yt = !1;
        var a = l.alternate;
        a !== null && (a.return = null), l.return = null;
      } catch (h) {
        de(l, t, h);
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
        if (gt(t, e), Et(e), r & 4) {
          try {
            xr(3, e, e.return), kl(3, e);
          } catch (L) {
            de(e, e.return, L);
          }
          try {
            xr(5, e, e.return);
          } catch (L) {
            de(e, e.return, L);
          }
        }
        break;
      case 1:
        gt(t, e), Et(e), r & 512 && n !== null && In(n, n.return);
        break;
      case 5:
        if (gt(t, e), Et(e), r & 512 && n !== null && In(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Wn(l, "");
          } catch (L) {
            de(e, e.return, L);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, u = e.type, a = e.updateQueue;
          if (e.updateQueue = null, a !== null) try {
            u === "input" && o.type === "radio" && o.name != null && Re(l, o), Wl(u, i);
            var h = Wl(u, o);
            for (i = 0; i < a.length; i += 2) {
              var k = a[i], x = a[i + 1];
              k === "style" ? Ki(l, x) : k === "dangerouslySetInnerHTML" ? Hi(l, x) : k === "children" ? Wn(l, x) : Ge(l, k, x, h);
            }
            switch (u) {
              case "input":
                Bn(l, o);
                break;
              case "textarea":
                Bi(l, o);
                break;
              case "select":
                var w = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var N = o.value;
                N != null ? vn(l, !!o.multiple, N, !1) : w !== !!o.multiple && (o.defaultValue != null ? vn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : vn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[fr] = o;
          } catch (L) {
            de(e, e.return, L);
          }
        }
        break;
      case 6:
        if (gt(t, e), Et(e), r & 4) {
          if (e.stateNode === null) throw Error(f(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (L) {
            de(e, e.return, L);
          }
        }
        break;
      case 3:
        if (gt(t, e), Et(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          er(t.containerInfo);
        } catch (L) {
          de(e, e.return, L);
        }
        break;
      case 4:
        gt(t, e), Et(e);
        break;
      case 13:
        gt(t, e), Et(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (vi = me())), r & 4 && aa(e);
        break;
      case 22:
        if (k = n !== null && n.memoizedState !== null, e.mode & 1 ? (Fe = (h = Fe) || k, gt(t, e), Fe = h) : gt(t, e), Et(e), r & 8192) {
          if (h = e.memoizedState !== null, (e.stateNode.isHidden = h) && !k && (e.mode & 1) !== 0) for (z = e, k = e.child; k !== null; ) {
            for (x = z = k; z !== null; ) {
              switch (w = z, N = w.child, w.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  xr(4, w, w.return);
                  break;
                case 1:
                  In(w, w.return);
                  var R = w.stateNode;
                  if (typeof R.componentWillUnmount == "function") {
                    r = w, n = w.return;
                    try {
                      t = r, R.props = t.memoizedProps, R.state = t.memoizedState, R.componentWillUnmount();
                    } catch (L) {
                      de(r, n, L);
                    }
                  }
                  break;
                case 5:
                  In(w, w.return);
                  break;
                case 22:
                  if (w.memoizedState !== null) {
                    pa(x);
                    continue;
                  }
              }
              N !== null ? (N.return = w, z = N) : pa(x);
            }
            k = k.sibling;
          }
          e: for (k = null, x = e; ; ) {
            if (x.tag === 5) {
              if (k === null) {
                k = x;
                try {
                  l = x.stateNode, h ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (u = x.stateNode, a = x.memoizedProps.style, i = a != null && a.hasOwnProperty("display") ? a.display : null, u.style.display = Qi("display", i));
                } catch (L) {
                  de(e, e.return, L);
                }
              }
            } else if (x.tag === 6) {
              if (k === null) try {
                x.stateNode.nodeValue = h ? "" : x.memoizedProps;
              } catch (L) {
                de(e, e.return, L);
              }
            } else if ((x.tag !== 22 && x.tag !== 23 || x.memoizedState === null || x === e) && x.child !== null) {
              x.child.return = x, x = x.child;
              continue;
            }
            if (x === e) break e;
            for (; x.sibling === null; ) {
              if (x.return === null || x.return === e) break e;
              k === x && (k = null), x = x.return;
            }
            k === x && (k = null), x.sibling.return = x.return, x = x.sibling;
          }
        }
        break;
      case 19:
        gt(t, e), Et(e), r & 4 && aa(e);
        break;
      case 21:
        break;
      default:
        gt(
          t,
          e
        ), Et(e);
    }
  }
  function Et(e) {
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
          throw Error(f(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Wn(l, ""), r.flags &= -33);
            var o = ua(e);
            pi(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, u = ua(e);
            di(e, u, i);
            break;
          default:
            throw Error(f(161));
        }
      } catch (a) {
        de(e, e.return, a);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function jf(e, t, n) {
    z = e, fa(e);
  }
  function fa(e, t, n) {
    for (var r = (e.mode & 1) !== 0; z !== null; ) {
      var l = z, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || wl;
        if (!i) {
          var u = l.alternate, a = u !== null && u.memoizedState !== null || Fe;
          u = wl;
          var h = Fe;
          if (wl = i, (Fe = a) && !h) for (z = l; z !== null; ) i = z, a = i.child, i.tag === 22 && i.memoizedState !== null ? ma(l) : a !== null ? (a.return = i, z = a) : ma(l);
          for (; o !== null; ) z = o, fa(o), o = o.sibling;
          z = l, wl = u, Fe = h;
        }
        da(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, z = o) : da(e);
    }
  }
  function da(e) {
    for (; z !== null; ) {
      var t = z;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Fe || kl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Fe) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : vt(t.type, n.memoizedProps);
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
                var a = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a.autoFocus && n.focus();
                    break;
                  case "img":
                    a.src && (n.src = a.src);
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
                    var x = k.dehydrated;
                    x !== null && er(x);
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
              throw Error(f(163));
          }
          Fe || t.flags & 512 && fi(t);
        } catch (w) {
          de(t, t.return, w);
        }
      }
      if (t === e) {
        z = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, z = n;
        break;
      }
      z = t.return;
    }
  }
  function pa(e) {
    for (; z !== null; ) {
      var t = z;
      if (t === e) {
        z = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, z = n;
        break;
      }
      z = t.return;
    }
  }
  function ma(e) {
    for (; z !== null; ) {
      var t = z;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              kl(4, t);
            } catch (a) {
              de(t, n, a);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (a) {
                de(t, l, a);
              }
            }
            var o = t.return;
            try {
              fi(t);
            } catch (a) {
              de(t, o, a);
            }
            break;
          case 5:
            var i = t.return;
            try {
              fi(t);
            } catch (a) {
              de(t, i, a);
            }
        }
      } catch (a) {
        de(t, t.return, a);
      }
      if (t === e) {
        z = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, z = u;
        break;
      }
      z = t.return;
    }
  }
  var Rf = Math.ceil, Sl = we.ReactCurrentDispatcher, mi = we.ReactCurrentOwner, ct = we.ReactCurrentBatchConfig, K = 0, Se = null, ve = null, Ne = 0, nt = 0, Un = Ht(0), ge = 0, _r = null, fn = 0, xl = 0, hi = 0, Er = null, Qe = null, vi = 0, An = 1 / 0, Mt = null, _l = !1, yi = null, Jt = null, El = !1, qt = null, Cl = 0, Cr = 0, gi = null, Pl = -1, Nl = 0;
  function Ae() {
    return (K & 6) !== 0 ? me() : Pl !== -1 ? Pl : Pl = me();
  }
  function Zt(e) {
    return (e.mode & 1) === 0 ? 1 : (K & 2) !== 0 && Ne !== 0 ? Ne & -Ne : mf.transition !== null ? (Nl === 0 && (Nl = uu()), Nl) : (e = b, e !== 0 || (e = window.event, e = e === void 0 ? 16 : vu(e.type)), e);
  }
  function wt(e, t, n, r) {
    if (50 < Cr) throw Cr = 0, gi = null, Error(f(185));
    Gn(e, n, r), ((K & 2) === 0 || e !== Se) && (e === Se && ((K & 2) === 0 && (xl |= n), ge === 4 && bt(e, Ne)), Ke(e, r), n === 1 && K === 0 && (t.mode & 1) === 0 && (An = me() + 500, tl && Kt()));
  }
  function Ke(e, t) {
    var n = e.callbackNode;
    pc(e, t);
    var r = Dr(e, e === Se ? Ne : 0);
    if (r === 0) n !== null && lu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && lu(n), t === 1) e.tag === 0 ? pf(va.bind(null, e)) : ts(va.bind(null, e)), af(function() {
        (K & 6) === 0 && Kt();
      }), n = null;
      else {
        switch (su(r)) {
          case 1:
            n = Jl;
            break;
          case 4:
            n = ou;
            break;
          case 16:
            n = Lr;
            break;
          case 536870912:
            n = iu;
            break;
          default:
            n = Lr;
        }
        n = Ea(n, ha.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function ha(e, t) {
    if (Pl = -1, Nl = 0, (K & 6) !== 0) throw Error(f(327));
    var n = e.callbackNode;
    if ($n() && e.callbackNode !== n) return null;
    var r = Dr(e, e === Se ? Ne : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Tl(e, r);
    else {
      t = r;
      var l = K;
      K |= 2;
      var o = ga();
      (Se !== e || Ne !== t) && (Mt = null, An = me() + 500, pn(e, t));
      do
        try {
          Mf();
          break;
        } catch (u) {
          ya(e, u);
        }
      while (!0);
      Do(), Sl.current = o, K = l, ve !== null ? t = 0 : (Se = null, Ne = 0, t = ge);
    }
    if (t !== 0) {
      if (t === 2 && (l = ql(e), l !== 0 && (r = l, t = wi(e, l))), t === 1) throw n = _r, pn(e, 0), bt(e, r), Ke(e, me()), n;
      if (t === 6) bt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Lf(l) && (t = Tl(e, r), t === 2 && (o = ql(e), o !== 0 && (r = o, t = wi(e, o))), t === 1)) throw n = _r, pn(e, 0), bt(e, r), Ke(e, me()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(f(345));
          case 2:
            mn(e, Qe, Mt);
            break;
          case 3:
            if (bt(e, r), (r & 130023424) === r && (t = vi + 500 - me(), 10 < t)) {
              if (Dr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Ae(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Co(mn.bind(null, e, Qe, Mt), t);
              break;
            }
            mn(e, Qe, Mt);
            break;
          case 4:
            if (bt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - pt(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = me() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Rf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Co(mn.bind(null, e, Qe, Mt), r);
              break;
            }
            mn(e, Qe, Mt);
            break;
          case 5:
            mn(e, Qe, Mt);
            break;
          default:
            throw Error(f(329));
        }
      }
    }
    return Ke(e, me()), e.callbackNode === n ? ha.bind(null, e) : null;
  }
  function wi(e, t) {
    var n = Er;
    return e.current.memoizedState.isDehydrated && (pn(e, t).flags |= 256), e = Tl(e, t), e !== 2 && (t = Qe, Qe = n, t !== null && ki(t)), e;
  }
  function ki(e) {
    Qe === null ? Qe = e : Qe.push.apply(Qe, e);
  }
  function Lf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], o = l.getSnapshot;
          l = l.value;
          try {
            if (!mt(o(), l)) return !1;
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
  function bt(e, t) {
    for (t &= ~hi, t &= ~xl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function va(e) {
    if ((K & 6) !== 0) throw Error(f(327));
    $n();
    var t = Dr(e, 0);
    if ((t & 1) === 0) return Ke(e, me()), null;
    var n = Tl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = ql(e);
      r !== 0 && (t = r, n = wi(e, r));
    }
    if (n === 1) throw n = _r, pn(e, 0), bt(e, t), Ke(e, me()), n;
    if (n === 6) throw Error(f(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, mn(e, Qe, Mt), Ke(e, me()), null;
  }
  function Si(e, t) {
    var n = K;
    K |= 1;
    try {
      return e(t);
    } finally {
      K = n, K === 0 && (An = me() + 500, tl && Kt());
    }
  }
  function dn(e) {
    qt !== null && qt.tag === 0 && (K & 6) === 0 && $n();
    var t = K;
    K |= 1;
    var n = ct.transition, r = b;
    try {
      if (ct.transition = null, b = 1, e) return e();
    } finally {
      b = r, ct.transition = n, K = t, (K & 6) === 0 && Kt();
    }
  }
  function xi() {
    nt = Un.current, re(Un);
  }
  function pn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, sf(n)), ve !== null) for (n = ve.return; n !== null; ) {
      var r = n;
      switch (Ro(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && br();
          break;
        case 3:
          Fn(), re(Ve), re(Le), Ho();
          break;
        case 5:
          Vo(r);
          break;
        case 4:
          Fn();
          break;
        case 13:
          re(se);
          break;
        case 19:
          re(se);
          break;
        case 10:
          Io(r.type._context);
          break;
        case 22:
        case 23:
          xi();
      }
      n = n.return;
    }
    if (Se = e, ve = e = en(e.current, null), Ne = nt = t, ge = 0, _r = null, hi = xl = fn = 0, Qe = Er = null, sn !== null) {
      for (t = 0; t < sn.length; t++) if (n = sn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      sn = null;
    }
    return e;
  }
  function ya(e, t) {
    do {
      var n = ve;
      try {
        if (Do(), fl.current = hl, dl) {
          for (var r = ae.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          dl = !1;
        }
        if (cn = 0, ke = ye = ae = null, yr = !1, gr = 0, mi.current = null, n === null || n.return === null) {
          ge = 1, _r = t, ve = null;
          break;
        }
        e: {
          var o = e, i = n.return, u = n, a = t;
          if (t = Ne, u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
            var h = a, k = u, x = k.tag;
            if ((k.mode & 1) === 0 && (x === 0 || x === 11 || x === 15)) {
              var w = k.alternate;
              w ? (k.updateQueue = w.updateQueue, k.memoizedState = w.memoizedState, k.lanes = w.lanes) : (k.updateQueue = null, k.memoizedState = null);
            }
            var N = Vs(i);
            if (N !== null) {
              N.flags &= -257, Ws(N, i, u, o, t), N.mode & 1 && Bs(o, h, t), t = N, a = h;
              var R = t.updateQueue;
              if (R === null) {
                var L = /* @__PURE__ */ new Set();
                L.add(a), t.updateQueue = L;
              } else R.add(a);
              break e;
            } else {
              if ((t & 1) === 0) {
                Bs(o, h, t), _i();
                break e;
              }
              a = Error(f(426));
            }
          } else if (ie && u.mode & 1) {
            var he = Vs(i);
            if (he !== null) {
              (he.flags & 65536) === 0 && (he.flags |= 256), Ws(he, i, u, o, t), Mo(Dn(a, u));
              break e;
            }
          }
          o = a = Dn(a, u), ge !== 4 && (ge = 2), Er === null ? Er = [o] : Er.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var d = As(o, a, t);
                ds(o, d);
                break e;
              case 1:
                u = a;
                var c = o.type, p = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof c.getDerivedStateFromError == "function" || p !== null && typeof p.componentDidCatch == "function" && (Jt === null || !Jt.has(p)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var E = $s(o, u, t);
                  ds(o, E);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        ka(n);
      } catch (O) {
        t = O, ve === n && n !== null && (ve = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ga() {
    var e = Sl.current;
    return Sl.current = hl, e === null ? hl : e;
  }
  function _i() {
    (ge === 0 || ge === 3 || ge === 2) && (ge = 4), Se === null || (fn & 268435455) === 0 && (xl & 268435455) === 0 || bt(Se, Ne);
  }
  function Tl(e, t) {
    var n = K;
    K |= 2;
    var r = ga();
    (Se !== e || Ne !== t) && (Mt = null, pn(e, t));
    do
      try {
        Of();
        break;
      } catch (l) {
        ya(e, l);
      }
    while (!0);
    if (Do(), K = n, Sl.current = r, ve !== null) throw Error(f(261));
    return Se = null, Ne = 0, ge;
  }
  function Of() {
    for (; ve !== null; ) wa(ve);
  }
  function Mf() {
    for (; ve !== null && !lc(); ) wa(ve);
  }
  function wa(e) {
    var t = _a(e.alternate, e, nt);
    e.memoizedProps = e.pendingProps, t === null ? ka(e) : ve = t, mi.current = null;
  }
  function ka(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Pf(n, t, nt), n !== null) {
          ve = n;
          return;
        }
      } else {
        if (n = Nf(n, t), n !== null) {
          n.flags &= 32767, ve = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          ge = 6, ve = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        ve = t;
        return;
      }
      ve = t = e;
    } while (t !== null);
    ge === 0 && (ge = 5);
  }
  function mn(e, t, n) {
    var r = b, l = ct.transition;
    try {
      ct.transition = null, b = 1, Ff(e, t, n, r);
    } finally {
      ct.transition = l, b = r;
    }
    return null;
  }
  function Ff(e, t, n, r) {
    do
      $n();
    while (qt !== null);
    if ((K & 6) !== 0) throw Error(f(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(f(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (mc(e, o), e === Se && (ve = Se = null, Ne = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || El || (El = !0, Ea(Lr, function() {
      return $n(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = ct.transition, ct.transition = null;
      var i = b;
      b = 1;
      var u = K;
      K |= 4, mi.current = null, zf(e, n), ca(n, e), ef(_o), Ar = !!xo, _o = xo = null, e.current = n, jf(n), oc(), K = u, b = i, ct.transition = o;
    } else e.current = n;
    if (El && (El = !1, qt = e, Cl = l), o = e.pendingLanes, o === 0 && (Jt = null), sc(n.stateNode), Ke(e, me()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (_l) throw _l = !1, e = yi, yi = null, e;
    return (Cl & 1) !== 0 && e.tag !== 0 && $n(), o = e.pendingLanes, (o & 1) !== 0 ? e === gi ? Cr++ : (Cr = 0, gi = e) : Cr = 0, Kt(), null;
  }
  function $n() {
    if (qt !== null) {
      var e = su(Cl), t = ct.transition, n = b;
      try {
        if (ct.transition = null, b = 16 > e ? 16 : e, qt === null) var r = !1;
        else {
          if (e = qt, qt = null, Cl = 0, (K & 6) !== 0) throw Error(f(331));
          var l = K;
          for (K |= 4, z = e.current; z !== null; ) {
            var o = z, i = o.child;
            if ((z.flags & 16) !== 0) {
              var u = o.deletions;
              if (u !== null) {
                for (var a = 0; a < u.length; a++) {
                  var h = u[a];
                  for (z = h; z !== null; ) {
                    var k = z;
                    switch (k.tag) {
                      case 0:
                      case 11:
                      case 15:
                        xr(8, k, o);
                    }
                    var x = k.child;
                    if (x !== null) x.return = k, z = x;
                    else for (; z !== null; ) {
                      k = z;
                      var w = k.sibling, N = k.return;
                      if (oa(k), k === h) {
                        z = null;
                        break;
                      }
                      if (w !== null) {
                        w.return = N, z = w;
                        break;
                      }
                      z = N;
                    }
                  }
                }
                var R = o.alternate;
                if (R !== null) {
                  var L = R.child;
                  if (L !== null) {
                    R.child = null;
                    do {
                      var he = L.sibling;
                      L.sibling = null, L = he;
                    } while (L !== null);
                  }
                }
                z = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, z = i;
            else e: for (; z !== null; ) {
              if (o = z, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  xr(9, o, o.return);
              }
              var d = o.sibling;
              if (d !== null) {
                d.return = o.return, z = d;
                break e;
              }
              z = o.return;
            }
          }
          var c = e.current;
          for (z = c; z !== null; ) {
            i = z;
            var p = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && p !== null) p.return = i, z = p;
            else e: for (i = c; z !== null; ) {
              if (u = z, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    kl(9, u);
                }
              } catch (O) {
                de(u, u.return, O);
              }
              if (u === i) {
                z = null;
                break e;
              }
              var E = u.sibling;
              if (E !== null) {
                E.return = u.return, z = E;
                break e;
              }
              z = u.return;
            }
          }
          if (K = l, Kt(), kt && typeof kt.onPostCommitFiberRoot == "function") try {
            kt.onPostCommitFiberRoot(Or, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        b = n, ct.transition = t;
      }
    }
    return !1;
  }
  function Sa(e, t, n) {
    t = Dn(n, t), t = As(e, t, 1), e = Xt(e, t, 1), t = Ae(), e !== null && (Gn(e, 1, t), Ke(e, t));
  }
  function de(e, t, n) {
    if (e.tag === 3) Sa(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Sa(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Jt === null || !Jt.has(r))) {
          e = Dn(n, e), e = $s(t, e, 1), t = Xt(t, e, 1), e = Ae(), t !== null && (Gn(t, 1, e), Ke(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Df(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ae(), e.pingedLanes |= e.suspendedLanes & n, Se === e && (Ne & n) === n && (ge === 4 || ge === 3 && (Ne & 130023424) === Ne && 500 > me() - vi ? pn(e, 0) : hi |= n), Ke(e, t);
  }
  function xa(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Fr, Fr <<= 1, (Fr & 130023424) === 0 && (Fr = 4194304)));
    var n = Ae();
    e = Rt(e, t), e !== null && (Gn(e, t, n), Ke(e, n));
  }
  function If(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), xa(e, n);
  }
  function Uf(e, t) {
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
        throw Error(f(314));
    }
    r !== null && r.delete(t), xa(e, n);
  }
  var _a;
  _a = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ve.current) He = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return He = !1, Cf(e, t, n);
      He = (e.flags & 131072) !== 0;
    }
    else He = !1, ie && (t.flags & 1048576) !== 0 && ns(t, rl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        gl(e, t), e = t.pendingProps;
        var l = Tn(t, Le.current);
        Mn(t, n), l = Yo(null, t, r, e, l, n);
        var o = Xo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, We(r) ? (o = !0, el(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, $o(t), l.updater = vl, t.stateNode = l, l._reactInternals = t, ei(t, r, e, n), t = li(null, t, r, !0, o, n)) : (t.tag = 0, ie && o && jo(t), Ue(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (gl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = $f(r), e = vt(r, e), l) {
            case 0:
              t = ri(null, t, r, e, n);
              break e;
            case 1:
              t = Gs(null, t, r, e, n);
              break e;
            case 11:
              t = Hs(null, t, r, e, n);
              break e;
            case 14:
              t = Qs(null, t, r, vt(r.type, e), n);
              break e;
          }
          throw Error(f(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), ri(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), Gs(e, t, r, l, n);
      case 3:
        e: {
          if (Js(t), e === null) throw Error(f(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, fs(e, t), al(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Dn(Error(f(423)), t), t = qs(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Dn(Error(f(424)), t), t = qs(e, t, r, n, l);
            break e;
          } else for (tt = Wt(t.stateNode.containerInfo.firstChild), et = t, ie = !0, ht = null, n = as(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Rn(), r === l) {
              t = Ot(e, t, n);
              break e;
            }
            Ue(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return ms(t), e === null && Oo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Eo(r, l) ? i = null : o !== null && Eo(r, o) && (t.flags |= 32), Xs(e, t), Ue(e, t, i, n), t.child;
      case 6:
        return e === null && Oo(t), null;
      case 13:
        return Zs(e, t, n);
      case 4:
        return Bo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ln(t, null, r, n) : Ue(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), Hs(e, t, r, l, n);
      case 7:
        return Ue(e, t, t.pendingProps, n), t.child;
      case 8:
        return Ue(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Ue(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, te(il, r._currentValue), r._currentValue = i, o !== null) if (mt(o.value, i)) {
            if (o.children === l.children && !Ve.current) {
              t = Ot(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var u = o.dependencies;
            if (u !== null) {
              i = o.child;
              for (var a = u.firstContext; a !== null; ) {
                if (a.context === r) {
                  if (o.tag === 1) {
                    a = Lt(-1, n & -n), a.tag = 2;
                    var h = o.updateQueue;
                    if (h !== null) {
                      h = h.shared;
                      var k = h.pending;
                      k === null ? a.next = a : (a.next = k.next, k.next = a), h.pending = a;
                    }
                  }
                  o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), Uo(
                    o.return,
                    n,
                    t
                  ), u.lanes |= n;
                  break;
                }
                a = a.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(f(341));
              i.lanes |= n, u = i.alternate, u !== null && (u.lanes |= n), Uo(i, n, t), i = o.sibling;
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
          Ue(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Mn(t, n), l = st(l), r = r(l), t.flags |= 1, Ue(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = vt(r, t.pendingProps), l = vt(r.type, l), Qs(e, t, r, l, n);
      case 15:
        return Ks(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), gl(e, t), t.tag = 1, We(r) ? (e = !0, el(t)) : e = !1, Mn(t, n), Is(t, r, l), ei(t, r, l, n), li(null, t, r, !0, e, n);
      case 19:
        return ea(e, t, n);
      case 22:
        return Ys(e, t, n);
    }
    throw Error(f(156, t.tag));
  };
  function Ea(e, t) {
    return ru(e, t);
  }
  function Af(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ft(e, t, n, r) {
    return new Af(e, t, n, r);
  }
  function Ei(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function $f(e) {
    if (typeof e == "function") return Ei(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === rt) return 11;
      if (e === lt) return 14;
    }
    return 2;
  }
  function en(e, t) {
    var n = e.alternate;
    return n === null ? (n = ft(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function zl(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Ei(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case Ee:
        return hn(n.children, l, o, t);
      case ze:
        i = 8, l |= 8;
        break;
      case Je:
        return e = ft(12, n, t, l | 2), e.elementType = Je, e.lanes = o, e;
      case Ie:
        return e = ft(13, n, t, l), e.elementType = Ie, e.lanes = o, e;
      case Be:
        return e = ft(19, n, t, l), e.elementType = Be, e.lanes = o, e;
      case oe:
        return jl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case dt:
            i = 10;
            break e;
          case Ct:
            i = 9;
            break e;
          case rt:
            i = 11;
            break e;
          case lt:
            i = 14;
            break e;
          case je:
            i = 16, r = null;
            break e;
        }
        throw Error(f(130, e == null ? e : typeof e, ""));
    }
    return t = ft(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function hn(e, t, n, r) {
    return e = ft(7, e, r, t), e.lanes = n, e;
  }
  function jl(e, t, n, r) {
    return e = ft(22, e, r, t), e.elementType = oe, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Ci(e, t, n) {
    return e = ft(6, e, null, t), e.lanes = n, e;
  }
  function Pi(e, t, n) {
    return t = ft(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Bf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Zl(0), this.expirationTimes = Zl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Zl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ni(e, t, n, r, l, o, i, u, a) {
    return e = new Bf(e, t, n, u, a), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = ft(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, $o(o), e;
  }
  function Vf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ce, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Ca(e) {
    if (!e) return Qt;
    e = e._reactInternals;
    e: {
      if (nn(e) !== e || e.tag !== 1) throw Error(f(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (We(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(f(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (We(n)) return bu(e, n, t);
    }
    return t;
  }
  function Pa(e, t, n, r, l, o, i, u, a) {
    return e = Ni(n, r, !0, e, l, o, i, u, a), e.context = Ca(null), n = e.current, r = Ae(), l = Zt(n), o = Lt(r, l), o.callback = t ?? null, Xt(n, o, l), e.current.lanes = l, Gn(e, l, r), Ke(e, r), e;
  }
  function Rl(e, t, n, r) {
    var l = t.current, o = Ae(), i = Zt(l);
    return n = Ca(n), t.context === null ? t.context = n : t.pendingContext = n, t = Lt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Xt(l, t, i), e !== null && (wt(e, l, i, o), sl(e, l, i)), i;
  }
  function Ll(e) {
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
  function Ti(e, t) {
    Na(e, t), (e = e.alternate) && Na(e, t);
  }
  function Wf() {
    return null;
  }
  var Ta = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function zi(e) {
    this._internalRoot = e;
  }
  Ol.prototype.render = zi.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(f(409));
    Rl(e, t, null, null);
  }, Ol.prototype.unmount = zi.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      dn(function() {
        Rl(null, e, null, null);
      }), t[Nt] = null;
    }
  };
  function Ol(e) {
    this._internalRoot = e;
  }
  Ol.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = fu();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < $t.length && t !== 0 && t < $t[n].priority; n++) ;
      $t.splice(n, 0, e), n === 0 && mu(e);
    }
  };
  function ji(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Ml(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function za() {
  }
  function Hf(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var h = Ll(i);
          o.call(h);
        };
      }
      var i = Pa(t, r, e, 0, null, !1, !1, "", za);
      return e._reactRootContainer = i, e[Nt] = i.current, ar(e.nodeType === 8 ? e.parentNode : e), dn(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var h = Ll(a);
        u.call(h);
      };
    }
    var a = Ni(e, 0, !1, null, null, !1, !1, "", za);
    return e._reactRootContainer = a, e[Nt] = a.current, ar(e.nodeType === 8 ? e.parentNode : e), dn(function() {
      Rl(t, a, n, r);
    }), a;
  }
  function Fl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var a = Ll(i);
          u.call(a);
        };
      }
      Rl(t, i, e, l);
    } else i = Hf(n, t, e, l, r);
    return Ll(i);
  }
  au = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Xn(t.pendingLanes);
          n !== 0 && (bl(t, n | 1), Ke(t, me()), (K & 6) === 0 && (An = me() + 500, Kt()));
        }
        break;
      case 13:
        dn(function() {
          var r = Rt(e, 1);
          if (r !== null) {
            var l = Ae();
            wt(r, e, 1, l);
          }
        }), Ti(e, 1);
    }
  }, eo = function(e) {
    if (e.tag === 13) {
      var t = Rt(e, 134217728);
      if (t !== null) {
        var n = Ae();
        wt(t, e, 134217728, n);
      }
      Ti(e, 134217728);
    }
  }, cu = function(e) {
    if (e.tag === 13) {
      var t = Zt(e), n = Rt(e, t);
      if (n !== null) {
        var r = Ae();
        wt(n, e, t, r);
      }
      Ti(e, t);
    }
  }, fu = function() {
    return b;
  }, du = function(e, t) {
    var n = b;
    try {
      return b = e, t();
    } finally {
      b = n;
    }
  }, Kl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Bn(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = Zr(r);
              if (!l) throw Error(f(90));
              Ce(r), Bn(r, l);
            }
          }
        }
        break;
      case "textarea":
        Bi(e, n);
        break;
      case "select":
        t = n.value, t != null && vn(e, !!n.multiple, t, !1);
    }
  }, Ji = Si, qi = dn;
  var Qf = { usingClientEntryPoint: !1, Events: [dr, Pn, Zr, Xi, Gi, Si] }, Pr = { findFiberByHostInstance: rn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Kf = { bundleType: Pr.bundleType, version: Pr.version, rendererPackageName: Pr.rendererPackageName, rendererConfig: Pr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: we.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = tu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Pr.findFiberByHostInstance || Wf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Dl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Dl.isDisabled && Dl.supportsFiber) try {
      Or = Dl.inject(Kf), kt = Dl;
    } catch {
    }
  }
  return Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Qf, Ye.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ji(t)) throw Error(f(200));
    return Vf(e, t, null, n);
  }, Ye.createRoot = function(e, t) {
    if (!ji(e)) throw Error(f(299));
    var n = !1, r = "", l = Ta;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ni(e, 1, !1, null, null, n, !1, r, l), e[Nt] = t.current, ar(e.nodeType === 8 ? e.parentNode : e), new zi(t);
  }, Ye.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(f(188)) : (e = Object.keys(e).join(","), Error(f(268, e)));
    return e = tu(t), e = e === null ? null : e.stateNode, e;
  }, Ye.flushSync = function(e) {
    return dn(e);
  }, Ye.hydrate = function(e, t, n) {
    if (!Ml(t)) throw Error(f(200));
    return Fl(null, e, t, !0, n);
  }, Ye.hydrateRoot = function(e, t, n) {
    if (!ji(e)) throw Error(f(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Ta;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Pa(t, null, e, 1, n ?? null, l, !1, o, i), e[Nt] = t.current, ar(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Ol(t);
  }, Ye.render = function(e, t, n) {
    if (!Ml(t)) throw Error(f(200));
    return Fl(null, e, t, !1, n);
  }, Ye.unmountComponentAtNode = function(e) {
    if (!Ml(e)) throw Error(f(40));
    return e._reactRootContainer ? (dn(function() {
      Fl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Nt] = null;
      });
    }), !0) : !1;
  }, Ye.unstable_batchedUpdates = Si, Ye.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Ml(n)) throw Error(f(200));
    if (e == null || e._reactInternals === void 0) throw Error(f(38));
    return Fl(e, t, n, !1, r);
  }, Ye.version = "18.3.1-next-f1338f8080-20240426", Ye;
}
var Ia;
function rd() {
  if (Ia) return Oi.exports;
  Ia = 1;
  function m() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(m);
      } catch (g) {
        console.error(g);
      }
  }
  return m(), Oi.exports = nd(), Oi.exports;
}
var Ua;
function ld() {
  if (Ua) return Il;
  Ua = 1;
  var m = rd();
  return Il.createRoot = m.createRoot, Il.hydrateRoot = m.hydrateRoot, Il;
}
var od = ld();
const id = /* @__PURE__ */ Xa(od), Aa = "AmsterdamUMC", ud = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", sd = `${ud}/chat/completions`, Ga = 1, ad = 256 * 1024 * 1024, $a = 512 * 1024 * 1024, Tr = 64 * 1024, cd = `You are the analysis assistant inside OMERO Analysis Chat.
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
Explain biological and measurement meaning without overstating causality.`, fd = [
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
function dd(m, g, f) {
  return m.replace("TYPE", g).replace("/1/", `/${f}/`);
}
class pd {
  constructor(g) {
    Ft(this, "contextToken", "");
    Ft(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = g;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const g = this.bootstrap.context;
    if (!g) return;
    const f = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Ba()
      },
      body: JSON.stringify({
        object_type: g.object_type,
        object_id: g.object_id
      })
    }), j = await Va(f);
    this.contextToken = j.context_token, this.operations = new Set(j.operations);
  }
  async download(g) {
    const f = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${g.annotation_id}/download/`
    ), j = await fetch(f, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!j.ok) throw new Error(await Ja(j));
    return j.arrayBuffer();
  }
  async attach(g) {
    const f = this.bootstrap.context;
    if (!f || !g.data) throw new Error("No OMERO target or result data");
    const j = new FormData();
    j.append("file", new Blob([g.data], { type: g.type }), g.name);
    const F = await fetch(
      dd(
        this.bootstrap.uploadTemplate,
        f.object_type,
        f.object_id
      ),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": Ba(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: j
      }
    );
    return (await Va(F)).attachment;
  }
}
async function Ja(m) {
  var g;
  try {
    return ((g = (await m.json()).error) == null ? void 0 : g.message) || `${m.status} ${m.statusText}`;
  } catch {
    return `${m.status} ${m.statusText}`;
  }
}
async function Va(m) {
  var f;
  const g = await m.json().catch(() => ({}));
  if (!m.ok)
    throw new Error(((f = g.error) == null ? void 0 : f.message) || `${m.status} ${m.statusText}`);
  return g;
}
async function md(m, g, f) {
  const j = await fetch(sd, {
    method: "POST",
    signal: f,
    headers: {
      "Content-Type": "application/json",
      "api-key": m.apiKey
    },
    body: JSON.stringify({
      model: m.model,
      temperature: Ga,
      messages: g,
      tools: fd,
      tool_choice: "auto"
    })
  });
  if (!j.ok) throw new Error(await Ja(j));
  return j.json();
}
function hd(m) {
  const g = JSON.stringify({
    stdout: m.stdout,
    stderr: m.stderr,
    preview: m.preview,
    generated_files: m.files.map((f) => ({
      name: f.name,
      size: f.data.byteLength,
      type: f.type
    }))
  });
  return g.length > 64 * 1024 ? `${g.slice(0, 64 * 1024)}
[tool output truncated]` : g;
}
function Ul(m) {
  const g = String(m instanceof Error ? m.message : m).slice(0, Tr), f = JSON.stringify({
    ok: !1,
    error: g,
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
  return f.length > Tr ? `${f.slice(0, Tr)}
[tool error truncated]` : f;
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
function yd(m) {
  const g = JSON.stringify(m.replace(/\/$/, "")), f = JSON.stringify(vd);
  return `
const runtimeBase = ${g};
const send = (id, type, value, transfer = []) => postMessage({source:"oac-runtime", id, type, value}, transfer);
let pyodide;
const mime = (name) => name.endsWith(".png") ? "image/png" : name.endsWith(".svg") ? "image/svg+xml" :
  name.endsWith(".csv") ? "text/csv" : name.endsWith(".json") ? "application/json" :
  name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
async function boot() {
  const module = await import(runtimeBase + "/pyodide.mjs");
  pyodide = await module.loadPyodide({indexURL: runtimeBase + "/"});
  await pyodide.loadPackage(${f});
  const micropip = pyodide.pyimport("micropip");
  try {
    await micropip.install(runtimeBase + "/seaborn-0.13.2-py3-none-any.whl", {deps: false});
  } finally {
    micropip.destroy();
  }
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
function gd(m) {
  const g = new URL(m).origin, f = JSON.stringify(yd(m));
  return `<!doctype html><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${g}; connect-src ${g}; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:">
<script>
const source = ${f};
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
class wd {
  constructor(g) {
    Ft(this, "frame", null);
    Ft(this, "pending", /* @__PURE__ */ new Map());
    Ft(this, "inputs", []);
    Ft(this, "counter", 0);
    Ft(this, "readyPromise", null);
    Ft(this, "receive", (g) => {
      var F;
      if (g.source !== ((F = this.frame) == null ? void 0 : F.contentWindow)) return;
      const f = g.data;
      if (!f || f.source !== "oac-runtime") return;
      const j = this.pending.get(f.id);
      j && (clearTimeout(j.timer), this.pending.delete(f.id), f.type === "error" ? j.reject(new Error(f.value)) : j.resolve(f.value));
    });
    this.runtimeBase = g, window.addEventListener("message", this.receive);
  }
  async start(g) {
    this.inputs = g.filter((F) => F.state === "ready" && F.data), this.destroyFrame();
    const f = document.createElement("iframe");
    f.hidden = !0, f.setAttribute("sandbox", "allow-scripts"), f.setAttribute("aria-hidden", "true");
    const j = new Promise(
      (F) => f.addEventListener("load", () => F(), { once: !0 })
    );
    return f.srcdoc = gd(
      new URL(this.runtimeBase, window.location.href).toString()
    ), document.body.append(f), this.frame = f, this.readyPromise = (async () => {
      await j, await this.request("ping", !0, 12e4);
      for (const F of this.inputs) {
        const W = F.data.slice(0);
        await this.request("file", { name: F.name, data: W }, 3e4, [W]);
      }
    })(), this.readyPromise;
  }
  async run(g) {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("run", { code: g }, 12e4);
  }
  async reset() {
    return this.start(this.inputs);
  }
  stop() {
    for (const g of this.pending.values())
      clearTimeout(g.timer), g.reject(new Error("Python execution stopped"));
    this.pending.clear(), this.destroyFrame();
  }
  dispose() {
    this.stop(), this.destroyFrame(), window.removeEventListener("message", this.receive);
  }
  destroyFrame() {
    var g;
    (g = this.frame) == null || g.remove(), this.frame = null, this.readyPromise = null;
  }
  request(g, f, j, F = []) {
    const W = `runtime-${++this.counter}`;
    return new Promise((le, J) => {
      var pe, ue;
      const $ = window.setTimeout(() => {
        this.pending.delete(W), J(new Error(`${g} exceeded ${j / 1e3} seconds`)), g === "run" && this.start(this.inputs);
      }, j);
      this.pending.set(W, { resolve: le, reject: J, timer: $ }), (ue = (pe = this.frame) == null ? void 0 : pe.contentWindow) == null || ue.postMessage(
        { source: "oac-parent", id: W, type: g, value: f },
        "*",
        F
      );
    });
  }
}
const kd = "omero-analysis-chat", Sd = 1;
function Ui() {
  return new Promise((m, g) => {
    const f = indexedDB.open(kd, Sd);
    f.onupgradeneeded = () => {
      const j = f.result;
      j.objectStoreNames.contains("values") || j.createObjectStore("values");
    }, f.onsuccess = () => m(f.result), f.onerror = () => g(f.error);
  });
}
async function Wa(m) {
  const g = await Ui();
  return new Promise((f, j) => {
    const W = g.transaction("values", "readonly").objectStore("values").get(m);
    W.onsuccess = () => f(W.result), W.onerror = () => j(W.error);
  });
}
async function Ha(m, g) {
  const f = await Ui();
  return new Promise((j, F) => {
    const W = f.transaction("values", "readwrite");
    W.objectStore("values").put(g, m), W.oncomplete = () => j(), W.onerror = () => F(W.error);
  });
}
async function xd(m) {
  const g = await Ui();
  return new Promise((f, j) => {
    const F = g.transaction("values", "readwrite");
    F.objectStore("values").delete(m), F.oncomplete = () => f(), F.onerror = () => j(F.error);
  });
}
const Qa = "provider:AmsterdamUMC", Ka = {
  apiKey: "",
  model: "",
  contextWindow: 0
}, Dt = () => crypto.randomUUID(), _d = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, Ed = (m) => m.endsWith(".png") ? "image/png" : m.endsWith(".svg") ? "image/svg+xml" : m.endsWith(".csv") ? "text/csv" : m.endsWith(".json") ? "application/json" : "application/octet-stream";
function Di() {
  const m = window.OMERO_ANALYSIS_CHAT.context;
  return m ? `workspace:${m.user_id}:${m.group_id}:${m.object_type}:${m.object_id}` : "workspace:standalone";
}
function Cd(m) {
  return JSON.stringify(
    m.map((g) => ({
      path: `${g.source === "result" ? "/output" : "/input"}/${g.name}`,
      size: g.size,
      type: g.type,
      state: g.state
    }))
  );
}
function Ya(m) {
  return Math.max(1, Math.ceil(JSON.stringify(m).length / 4));
}
function Pd(m, g) {
  if (!m) return "Context usage appears after the first AI response.";
  const f = m.promptTokens + m.completionTokens, j = m.estimated ? "estimated" : "API reported", F = g > 0 ? ` · ${Math.min(100, Math.round(f / g * 100))}% of ${g.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${m.promptTokens.toLocaleString()} input + ${m.completionTokens.toLocaleString()} output tokens (${j})${F} · session: ${m.sessionTokens.toLocaleString()}`;
}
function Nd() {
  const m = window.OMERO_ANALYSIS_CHAT, g = _e.useMemo(() => new pd(m), [m]), f = _e.useMemo(() => new wd(m.runtimeBase), [m]), [j, F] = _e.useState([]), W = _e.useRef(j), [le, J] = _e.useState([]), [$, pe] = _e.useState(Ka), [ue, ee] = _e.useState(""), [q, Te] = _e.useState(!1), [De, Q] = _e.useState(!1), [Z, Y] = _e.useState("Preparing workspace…"), [Xe, Ge] = _e.useState(!1), [we, $e] = _e.useState(null), ce = _e.useRef(null);
  W.current = j;
  const Ee = j.filter((v) => v.state !== "ready"), ze = De && Ee.length === 0 && !!($.apiKey && $.model) && !q;
  _e.useEffect(() => {
    let v = !0;
    return (async () => {
      var H;
      const [S, s] = await Promise.all([
        Wa(Qa),
        Wa(Di())
      ]);
      if (!v) return;
      S && pe({ ...Ka, ...S }), s && (J(s.messages || []), F((s.files || []).filter((M) => M.state === "ready"))), await g.connect();
      const y = ((H = m.context) == null ? void 0 : H.selected_attachments) || [], _ = new Set(
        ((s == null ? void 0 : s.files) || []).map((M) => M.annotationId)
      ), T = y.filter((M) => !_.has(M.annotation_id)).map((M) => ({
        id: Dt(),
        name: M.name,
        type: M.mimetype,
        size: M.size,
        source: "omero",
        state: "loading",
        annotationId: M.annotation_id
      }));
      let D = [...((s == null ? void 0 : s.files) || []).filter((M) => M.state === "ready")], B = !1;
      if (T.length) {
        F([...D, ...T]), Y(`Downloading 0 of ${T.length} selected attachments…`);
        for (let M = 0; M < T.length; M += 1) {
          const fe = T[M], qe = y.find(
            (Ce) => Ce.annotation_id === fe.annotationId
          );
          try {
            if (D.reduce((Pt, Re) => Pt + Re.size, 0) + qe.size > $a)
              throw new Error("Selected attachments exceed the 512 MiB workspace limit");
            const ot = await g.download(qe), Ze = { ...fe, data: ot, size: ot.byteLength, state: "ready" };
            D = [...D, Ze], F(
              (Pt) => Pt.map((Re) => Re.id === fe.id ? Ze : Re)
            );
          } catch (Ce) {
            B = !0, F(
              (ot) => ot.map(
                (Ze) => Ze.id === fe.id ? { ...Ze, state: "failed", error: String(Ce) } : Ze
              )
            );
          }
          Y(`Downloaded ${M + 1} of ${T.length} attachments`);
        }
      }
      const G = T.length ? D : ((s == null ? void 0 : s.files) || []).filter((M) => M.state === "ready");
      v && !B ? (Y("Loading browser Python runtime…"), await f.start(G), v && (Q(!0), Y("Ready — analysis runs locally in this browser"))) : v && Y("Download failed — retry or remove failed files to continue");
    })().catch((S) => {
      v && Y(`Workspace failed: ${String(S)}`);
    }), () => {
      v = !1, f.dispose();
    };
  }, [m, g, f]), _e.useEffect(() => {
    Ha(Di(), { messages: le, files: j });
  }, [le, j]);
  async function Je(v) {
    pe(v), await Ha(Qa, v);
  }
  async function dt(v) {
    if (!v) return;
    const S = [];
    let s = j.reduce((_, T) => _ + T.size, 0);
    for (const _ of Array.from(v)) {
      if (!_d.test(_.name)) {
        Y(`${_.name} is not a supported tabular data file`);
        continue;
      }
      if (_.size > ad) {
        Y(`${_.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (s += _.size, s > $a) {
        Y("The workspace would exceed 512 MiB");
        break;
      }
      S.push({
        id: Dt(),
        name: _.name,
        type: _.type || Ed(_.name),
        size: _.size,
        source: "local",
        state: "ready",
        data: await _.arrayBuffer()
      });
    }
    const y = [...j, ...S];
    F(y), Q(!1), Y("Reloading data into browser Python…"), await f.start(y), Q(!0), Y("Ready — analysis runs locally in this browser");
  }
  async function Ct(v) {
    const S = j.filter((s) => s.id !== v);
    F(S), Q(!1), await f.start(S), Q(!0), Y("File removed; runtime reset");
  }
  async function rt(v) {
    var y;
    const S = j.find((_) => _.id === v), s = (y = m.context) == null ? void 0 : y.selected_attachments.find(
      (_) => _.annotation_id === (S == null ? void 0 : S.annotationId)
    );
    if (!(!S || !s)) {
      F(
        (_) => _.map(
          (T) => T.id === v ? { ...T, state: "loading", error: void 0 } : T
        )
      );
      try {
        const _ = await g.download(s), T = j.map(
          (D) => D.id === v ? { ...D, data: _, size: _.byteLength, state: "ready", error: void 0 } : D
        );
        F(T), await f.start(T), Q(!0), Y("Attachment downloaded; workspace ready");
      } catch (_) {
        F(
          (T) => T.map(
            (D) => D.id === v ? { ...D, state: "failed", error: String(_) } : D
          )
        );
      }
    }
  }
  async function Ie(v) {
    let S = {};
    try {
      S = JSON.parse(v.function.arguments || "{}");
    } catch (_) {
      return Ul(`Invalid JSON tool arguments: ${String(_)}`);
    }
    if (v.function.name === "list_workspace_files") return Cd(W.current);
    if (v.function.name === "reset_python")
      try {
        return await f.reset(), "Python state reset; canonical inputs restored.";
      } catch (_) {
        return Ul(_);
      }
    if (v.function.name !== "run_python" || typeof S.code != "string")
      return Ul(`Unsupported or invalid tool call: ${v.function.name}`);
    J((_) => [
      ..._,
      { id: Dt(), role: "assistant", content: "Running Python locally", kind: "code", code: S.code }
    ]), await new Promise(
      (_) => requestAnimationFrame(() => requestAnimationFrame(() => _()))
    );
    let s;
    try {
      s = await f.run(S.code);
    } catch (_) {
      const T = String(_ instanceof Error ? _.message : _).slice(0, Tr);
      return J((D) => [
        ...D,
        {
          id: Dt(),
          role: "tool",
          content: `Python failed locally. The bounded error was sent to ${Aa} for an automatic correction:
${T}`,
          kind: "error"
        }
      ]), Y("Python error sent to AmsterdamUMC; waiting for corrected code…"), Ul(_);
    }
    const y = s.files.map((_) => ({
      id: Dt(),
      name: _.name,
      type: _.type,
      size: _.data.byteLength,
      source: "result",
      state: "ready",
      data: _.data
    }));
    return y.length && F((_) => [..._.filter((T) => T.source !== "result" || !y.some((D) => D.name === T.name)), ...y]), J((_) => [
      ..._,
      {
        id: Dt(),
        role: "tool",
        content: [s.stdout, s.stderr].filter(Boolean).join(`
`).slice(0, Tr),
        kind: "result",
        preview: s.preview,
        artifacts: y.filter((T) => T.type === "image/png" || T.type === "image/svg+xml").map((T) => T.name)
      }
    ]), Y("Python completed locally; continuing the analysis…"), hd(s);
  }
  async function Be() {
    var y, _, T, D, B, G, H;
    const v = ue.trim();
    if (!v || !ze) return;
    ee(""), Te(!0), ce.current = new AbortController();
    const S = { id: Dt(), role: "user", content: v };
    J((M) => [...M, S]);
    const s = [
      { role: "system", content: cd },
      ...le.filter((M) => M.kind !== "code" && M.role !== "tool").map((M) => ({ role: M.role, content: M.content })),
      { role: "user", content: v }
    ];
    try {
      for (let M = 0; M < 8; M += 1) {
        const fe = Ya(s), qe = await md($, s, ce.current.signal), Ce = (y = qe.choices[0]) == null ? void 0 : y.message;
        if (!Ce) throw new Error("AmsterdamUMC returned no response");
        const ot = ((_ = qe.usage) == null ? void 0 : _.prompt_tokens) ?? fe, Ze = ((T = qe.usage) == null ? void 0 : T.completion_tokens) ?? Ya(Ce.content || Ce.tool_calls || ""), Pt = ((D = qe.usage) == null ? void 0 : D.total_tokens) ?? ot + Ze;
        if ($e((Re) => ({
          promptTokens: ot,
          completionTokens: Ze,
          totalTokens: Pt,
          sessionTokens: ((Re == null ? void 0 : Re.sessionTokens) || 0) + Pt,
          estimated: !qe.usage
        })), s.push({
          role: "assistant",
          content: Ce.content,
          tool_calls: Ce.tool_calls
        }), Ce.content && J((Re) => [
          ...Re,
          { id: Dt(), role: "assistant", content: Ce.content }
        ]), !((B = Ce.tool_calls) != null && B.length)) break;
        for (const Re of Ce.tool_calls) {
          const Bn = await Ie(Re);
          s.push({ role: "tool", tool_call_id: Re.id, content: Bn });
        }
        if (M === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (M) {
      (G = ce.current) != null && G.signal.aborted || J((fe) => [
        ...fe,
        { id: Dt(), role: "assistant", content: String(M), kind: "error" }
      ]);
    } finally {
      (H = ce.current) != null && H.signal.aborted || Y("Ready — analysis runs locally in this browser"), ce.current = null, Te(!1);
    }
  }
  function lt() {
    var v;
    (v = ce.current) == null || v.abort(), f.stop(), Te(!1), Q(!1), Y("Stopped; restoring the browser runtime…"), f.start(j).then(() => {
      Q(!0), Y("Ready — analysis runs locally in this browser");
    });
  }
  async function je() {
    confirm("Clear this browser-local conversation, files, and results?") && (J([]), F([]), $e(null), await xd(Di()), await f.start([]), Q(!0), Y("Workspace cleared"));
  }
  function oe(v) {
    if (!v.data) return;
    const S = URL.createObjectURL(new Blob([v.data], { type: v.type })), s = document.createElement("a");
    s.href = S, s.download = v.name, s.click(), setTimeout(() => URL.revokeObjectURL(S), 1e3);
  }
  async function P(v) {
    if (confirm(`Attach ${v.name} to the selected OMERO object?`))
      try {
        const S = await g.attach(v);
        Y(`Attached ${S.name} as FileAnnotation ${S.annotation_id}`);
      } catch (S) {
        Y(`Attach failed: ${String(S)}`);
      }
  }
  return /* @__PURE__ */ C.jsxs("main", { className: "app-shell", children: [
    /* @__PURE__ */ C.jsxs("header", { children: [
      /* @__PURE__ */ C.jsxs("div", { children: [
        /* @__PURE__ */ C.jsx("h1", { children: "OMERO.AnalysisChat" }),
        /* @__PURE__ */ C.jsx("p", { children: m.context ? `${m.context.object_type} ${m.context.object_id} — ${m.context.name}` : "Local workspace" })
      ] }),
      /* @__PURE__ */ C.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ C.jsx("span", { className: "privacy-badge", children: "Python and source files stay in this browser" }),
        /* @__PURE__ */ C.jsx("button", { onClick: () => Ge(!Xe), children: "AI settings" }),
        /* @__PURE__ */ C.jsx("button", { onClick: je, children: "Clear" })
      ] })
    ] }),
    Xe && /* @__PURE__ */ C.jsxs("form", { className: "settings-card", onSubmit: (v) => v.preventDefault(), children: [
      /* @__PURE__ */ C.jsx("h2", { children: Aa }),
      /* @__PURE__ */ C.jsx("p", { className: "warning", children: "The API key is stored unencrypted in this browser profile. Never use this on a shared computer." }),
      /* @__PURE__ */ C.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ C.jsx("input", { value: $.model, onChange: (v) => void Je({ ...$, model: v.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ C.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ C.jsx("input", { type: "password", value: $.apiKey, onChange: (v) => void Je({ ...$, apiKey: v.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ C.jsxs("label", { children: [
        "Model context window (optional)",
        /* @__PURE__ */ C.jsx(
          "input",
          {
            type: "number",
            min: "0",
            step: "1",
            value: $.contextWindow || "",
            onChange: (v) => void Je({
              ...$,
              contextWindow: Math.max(0, Number(v.target.value) || 0)
            }),
            placeholder: "Used only to calculate a percentage"
          }
        )
      ] }),
      /* @__PURE__ */ C.jsxs("p", { children: [
        "Temperature is fixed at ",
        /* @__PURE__ */ C.jsx("strong", { children: Ga }),
        "."
      ] }),
      /* @__PURE__ */ C.jsx("button", { onClick: () => void Je({ ...$, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ C.jsxs("div", { className: "workspace", children: [
      /* @__PURE__ */ C.jsxs("aside", { children: [
        /* @__PURE__ */ C.jsxs("div", { className: "aside-heading", children: [
          /* @__PURE__ */ C.jsx("h2", { children: "Data" }),
          /* @__PURE__ */ C.jsxs("label", { className: "upload-button", children: [
            "Add files",
            /* @__PURE__ */ C.jsx("input", { type: "file", multiple: !0, accept: ".duckdb,.sqlite,.sqlite3,.csv,.tsv,.json,.xlsx,.xls,.parquet,.npy,.npz", onChange: (v) => void dt(v.target.files) })
          ] })
        ] }),
        /* @__PURE__ */ C.jsx("ul", { className: "file-list", children: j.map((v) => /* @__PURE__ */ C.jsxs("li", { className: `file-${v.state}`, children: [
          /* @__PURE__ */ C.jsxs("div", { children: [
            /* @__PURE__ */ C.jsx("strong", { children: v.name }),
            /* @__PURE__ */ C.jsxs("small", { children: [
              (v.size / 1024).toFixed(1),
              " KiB · ",
              v.source
            ] })
          ] }),
          /* @__PURE__ */ C.jsx("span", { children: v.state }),
          v.error && /* @__PURE__ */ C.jsx("p", { children: v.error }),
          /* @__PURE__ */ C.jsxs("div", { className: "file-actions", children: [
            v.state === "failed" && v.annotationId && /* @__PURE__ */ C.jsx("button", { onClick: () => void rt(v.id), children: "Retry" }),
            v.source === "result" && /* @__PURE__ */ C.jsx("button", { onClick: () => oe(v), children: "Download" }),
            v.source === "result" && g.canUpload && /* @__PURE__ */ C.jsx("button", { onClick: () => void P(v), children: "Attach" }),
            /* @__PURE__ */ C.jsx("button", { onClick: () => void Ct(v.id), children: "Remove" })
          ] })
        ] }, v.id)) })
      ] }),
      /* @__PURE__ */ C.jsxs("section", { className: "chat", children: [
        /* @__PURE__ */ C.jsxs("div", { className: "messages", "aria-live": "polite", children: [
          !le.length && /* @__PURE__ */ C.jsxs("div", { className: "welcome", children: [
            /* @__PURE__ */ C.jsx("h2", { children: "What would you like to learn from these data?" }),
            /* @__PURE__ */ C.jsx("p", { children: "I can inspect schemas, query databases, calculate summaries, compare groups, and create plots or downloadable results." })
          ] }),
          le.map((v) => {
            var S;
            return /* @__PURE__ */ C.jsxs("article", { className: `message ${v.role} ${v.kind || ""}`, children: [
              /* @__PURE__ */ C.jsx("span", { children: v.kind === "code" ? "Python (local)" : v.role }),
              v.code ? /* @__PURE__ */ C.jsx("pre", { children: /* @__PURE__ */ C.jsx("code", { children: v.code }) }) : /* @__PURE__ */ C.jsx("p", { children: v.content }),
              v.preview != null && /* @__PURE__ */ C.jsx(Td, { value: v.preview }),
              (S = v.artifacts) == null ? void 0 : S.map((s) => {
                const y = j.find((_) => _.source === "result" && _.name === s);
                return y ? /* @__PURE__ */ C.jsx(zd, { file: y }, s) : null;
              })
            ] }, v.id);
          })
        ] }),
        /* @__PURE__ */ C.jsx("div", { className: "status", role: "status", children: Z }),
        /* @__PURE__ */ C.jsxs("div", { className: "usage-status", children: [
          /* @__PURE__ */ C.jsx("span", { children: "Azure receives prompts, code, bounded schemas/previews/statistics, and execution errors — never source files." }),
          /* @__PURE__ */ C.jsx("span", { children: Pd(we, $.contextWindow || 0) })
        ] }),
        Ee.length > 0 && /* @__PURE__ */ C.jsx("div", { className: "blocker", children: "Analysis is blocked until every selected attachment finishes downloading. Retry or remove failed files." }),
        !$.apiKey || !$.model ? /* @__PURE__ */ C.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
        /* @__PURE__ */ C.jsxs("div", { className: "composer", children: [
          /* @__PURE__ */ C.jsx("textarea", { value: ue, onChange: (v) => ee(v.target.value), onKeyDown: (v) => {
            v.key === "Enter" && !v.shiftKey && (v.preventDefault(), Be());
          }, disabled: !ze && !q, placeholder: "Ask a question about the loaded data…" }),
          q ? /* @__PURE__ */ C.jsx("button", { className: "stop", onClick: lt, children: "Stop" }) : /* @__PURE__ */ C.jsx("button", { disabled: !ze || !ue.trim(), onClick: () => void Be(), children: "Send" }),
          /* @__PURE__ */ C.jsx("button", { disabled: q || !De, onClick: () => void f.reset().then(() => Y("Python state reset; inputs restored")), children: "Reset Python" })
        ] })
      ] })
    ] })
  ] });
}
function Td({ value: m }) {
  if ((m == null ? void 0 : m.kind) === "table" && m.data) {
    const g = m.data.columns || [], f = m.data.data || [];
    return /* @__PURE__ */ C.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ C.jsxs("table", { children: [
      /* @__PURE__ */ C.jsx("thead", { children: /* @__PURE__ */ C.jsx("tr", { children: g.map((j) => /* @__PURE__ */ C.jsx("th", { children: j }, j)) }) }),
      /* @__PURE__ */ C.jsx("tbody", { children: f.map((j, F) => /* @__PURE__ */ C.jsx("tr", { children: j.map((W, le) => /* @__PURE__ */ C.jsx("td", { children: String(W ?? "") }, le)) }, F)) })
    ] }) });
  }
  return /* @__PURE__ */ C.jsx("pre", { className: "preview", children: JSON.stringify(m, null, 2) });
}
function zd({ file: m }) {
  const g = _e.useMemo(
    () => m.data ? URL.createObjectURL(new Blob([m.data], { type: m.type })) : "",
    [m.data, m.type]
  );
  return _e.useEffect(() => () => {
    g && URL.revokeObjectURL(g);
  }, [g]), g ? /* @__PURE__ */ C.jsxs("figure", { children: [
    /* @__PURE__ */ C.jsx("img", { src: g, alt: m.name }),
    /* @__PURE__ */ C.jsx("figcaption", { children: m.name })
  ] }) : null;
}
id.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ C.jsx(bf.StrictMode, { children: /* @__PURE__ */ C.jsx(Nd, {}) })
);
