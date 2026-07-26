var pp = Object.defineProperty;
var hp = (l, a, s) => a in l ? pp(l, a, { enumerable: !0, configurable: !0, writable: !0, value: s }) : l[a] = s;
var en = (l, a, s) => hp(l, typeof a != "symbol" ? a + "" : a, s);
function ad(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var Fs = { exports: {} }, Eo = {}, $s = { exports: {} }, ge = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ac;
function mp() {
  if (Ac) return ge;
  Ac = 1;
  var l = Symbol.for("react.element"), a = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), C = Symbol.for("react.context"), _ = Symbol.for("react.forward_ref"), j = Symbol.for("react.suspense"), F = Symbol.for("react.memo"), P = Symbol.for("react.lazy"), N = Symbol.iterator;
  function A(v) {
    return v === null || typeof v != "object" ? null : (v = N && v[N] || v["@@iterator"], typeof v == "function" ? v : null);
  }
  var ne = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ae = Object.assign, H = {};
  function X(v, E, b) {
    this.props = v, this.context = E, this.refs = H, this.updater = b || ne;
  }
  X.prototype.isReactComponent = {}, X.prototype.setState = function(v, E) {
    if (typeof v != "object" && typeof v != "function" && v != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, v, E, "setState");
  }, X.prototype.forceUpdate = function(v) {
    this.updater.enqueueForceUpdate(this, v, "forceUpdate");
  };
  function Te() {
  }
  Te.prototype = X.prototype;
  function je(v, E, b) {
    this.props = v, this.context = E, this.refs = H, this.updater = b || ne;
  }
  var T = je.prototype = new Te();
  T.constructor = je, ae(T, X.prototype), T.isPureReactComponent = !0;
  var te = Array.isArray, ve = Object.prototype.hasOwnProperty, we = { current: null }, pe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function re(v, E, b) {
    var ee, G = {}, ce = null, fe = null;
    if (E != null) for (ee in E.ref !== void 0 && (fe = E.ref), E.key !== void 0 && (ce = "" + E.key), E) ve.call(E, ee) && !pe.hasOwnProperty(ee) && (G[ee] = E[ee]);
    var he = arguments.length - 2;
    if (he === 1) G.children = b;
    else if (1 < he) {
      for (var ke = Array(he), Ae = 0; Ae < he; Ae++) ke[Ae] = arguments[Ae + 2];
      G.children = ke;
    }
    if (v && v.defaultProps) for (ee in he = v.defaultProps, he) G[ee] === void 0 && (G[ee] = he[ee]);
    return { $$typeof: l, type: v, key: ce, ref: fe, props: G, _owner: we.current };
  }
  function Z(v, E) {
    return { $$typeof: l, type: v.type, key: E, ref: v.ref, props: v.props, _owner: v._owner };
  }
  function Pe(v) {
    return typeof v == "object" && v !== null && v.$$typeof === l;
  }
  function Ee(v) {
    var E = { "=": "=0", ":": "=2" };
    return "$" + v.replace(/[=:]/g, function(b) {
      return E[b];
    });
  }
  var xe = /\/+/g;
  function Me(v, E) {
    return typeof v == "object" && v !== null && v.key != null ? Ee("" + v.key) : E.toString(36);
  }
  function Ne(v, E, b, ee, G) {
    var ce = typeof v;
    (ce === "undefined" || ce === "boolean") && (v = null);
    var fe = !1;
    if (v === null) fe = !0;
    else switch (ce) {
      case "string":
      case "number":
        fe = !0;
        break;
      case "object":
        switch (v.$$typeof) {
          case l:
          case a:
            fe = !0;
        }
    }
    if (fe) return fe = v, G = G(fe), v = ee === "" ? "." + Me(fe, 0) : ee, te(G) ? (b = "", v != null && (b = v.replace(xe, "$&/") + "/"), Ne(G, E, b, "", function(Ae) {
      return Ae;
    })) : G != null && (Pe(G) && (G = Z(G, b + (!G.key || fe && fe.key === G.key ? "" : ("" + G.key).replace(xe, "$&/") + "/") + v)), E.push(G)), 1;
    if (fe = 0, ee = ee === "" ? "." : ee + ":", te(v)) for (var he = 0; he < v.length; he++) {
      ce = v[he];
      var ke = ee + Me(ce, he);
      fe += Ne(ce, E, b, ke, G);
    }
    else if (ke = A(v), typeof ke == "function") for (v = ke.call(v), he = 0; !(ce = v.next()).done; ) ce = ce.value, ke = ee + Me(ce, he++), fe += Ne(ce, E, b, ke, G);
    else if (ce === "object") throw E = String(v), Error("Objects are not valid as a React child (found: " + (E === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : E) + "). If you meant to render a collection of children, use an array instead.");
    return fe;
  }
  function Se(v, E, b) {
    if (v == null) return v;
    var ee = [], G = 0;
    return Ne(v, ee, "", "", function(ce) {
      return E.call(b, ce, G++);
    }), ee;
  }
  function de(v) {
    if (v._status === -1) {
      var E = v._result;
      E = E(), E.then(function(b) {
        (v._status === 0 || v._status === -1) && (v._status = 1, v._result = b);
      }, function(b) {
        (v._status === 0 || v._status === -1) && (v._status = 2, v._result = b);
      }), v._status === -1 && (v._status = 0, v._result = E);
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var le = { current: null }, z = { transition: null }, B = { ReactCurrentDispatcher: le, ReactCurrentBatchConfig: z, ReactCurrentOwner: we };
  function U() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ge.Children = { map: Se, forEach: function(v, E, b) {
    Se(v, function() {
      E.apply(this, arguments);
    }, b);
  }, count: function(v) {
    var E = 0;
    return Se(v, function() {
      E++;
    }), E;
  }, toArray: function(v) {
    return Se(v, function(E) {
      return E;
    }) || [];
  }, only: function(v) {
    if (!Pe(v)) throw Error("React.Children.only expected to receive a single React element child.");
    return v;
  } }, ge.Component = X, ge.Fragment = s, ge.Profiler = y, ge.PureComponent = je, ge.StrictMode = c, ge.Suspense = j, ge.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = B, ge.act = U, ge.cloneElement = function(v, E, b) {
    if (v == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + v + ".");
    var ee = ae({}, v.props), G = v.key, ce = v.ref, fe = v._owner;
    if (E != null) {
      if (E.ref !== void 0 && (ce = E.ref, fe = we.current), E.key !== void 0 && (G = "" + E.key), v.type && v.type.defaultProps) var he = v.type.defaultProps;
      for (ke in E) ve.call(E, ke) && !pe.hasOwnProperty(ke) && (ee[ke] = E[ke] === void 0 && he !== void 0 ? he[ke] : E[ke]);
    }
    var ke = arguments.length - 2;
    if (ke === 1) ee.children = b;
    else if (1 < ke) {
      he = Array(ke);
      for (var Ae = 0; Ae < ke; Ae++) he[Ae] = arguments[Ae + 2];
      ee.children = he;
    }
    return { $$typeof: l, type: v.type, key: G, ref: ce, props: ee, _owner: fe };
  }, ge.createContext = function(v) {
    return v = { $$typeof: C, _currentValue: v, _currentValue2: v, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, v.Provider = { $$typeof: h, _context: v }, v.Consumer = v;
  }, ge.createElement = re, ge.createFactory = function(v) {
    var E = re.bind(null, v);
    return E.type = v, E;
  }, ge.createRef = function() {
    return { current: null };
  }, ge.forwardRef = function(v) {
    return { $$typeof: _, render: v };
  }, ge.isValidElement = Pe, ge.lazy = function(v) {
    return { $$typeof: P, _payload: { _status: -1, _result: v }, _init: de };
  }, ge.memo = function(v, E) {
    return { $$typeof: F, type: v, compare: E === void 0 ? null : E };
  }, ge.startTransition = function(v) {
    var E = z.transition;
    z.transition = {};
    try {
      v();
    } finally {
      z.transition = E;
    }
  }, ge.unstable_act = U, ge.useCallback = function(v, E) {
    return le.current.useCallback(v, E);
  }, ge.useContext = function(v) {
    return le.current.useContext(v);
  }, ge.useDebugValue = function() {
  }, ge.useDeferredValue = function(v) {
    return le.current.useDeferredValue(v);
  }, ge.useEffect = function(v, E) {
    return le.current.useEffect(v, E);
  }, ge.useId = function() {
    return le.current.useId();
  }, ge.useImperativeHandle = function(v, E, b) {
    return le.current.useImperativeHandle(v, E, b);
  }, ge.useInsertionEffect = function(v, E) {
    return le.current.useInsertionEffect(v, E);
  }, ge.useLayoutEffect = function(v, E) {
    return le.current.useLayoutEffect(v, E);
  }, ge.useMemo = function(v, E) {
    return le.current.useMemo(v, E);
  }, ge.useReducer = function(v, E, b) {
    return le.current.useReducer(v, E, b);
  }, ge.useRef = function(v) {
    return le.current.useRef(v);
  }, ge.useState = function(v) {
    return le.current.useState(v);
  }, ge.useSyncExternalStore = function(v, E, b) {
    return le.current.useSyncExternalStore(v, E, b);
  }, ge.useTransition = function() {
    return le.current.useTransition();
  }, ge.version = "18.3.1", ge;
}
var Fc;
function aa() {
  return Fc || (Fc = 1, $s.exports = mp()), $s.exports;
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
var $c;
function vp() {
  if ($c) return Eo;
  $c = 1;
  var l = aa(), a = Symbol.for("react.element"), s = Symbol.for("react.fragment"), c = Object.prototype.hasOwnProperty, y = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, h = { key: !0, ref: !0, __self: !0, __source: !0 };
  function C(_, j, F) {
    var P, N = {}, A = null, ne = null;
    F !== void 0 && (A = "" + F), j.key !== void 0 && (A = "" + j.key), j.ref !== void 0 && (ne = j.ref);
    for (P in j) c.call(j, P) && !h.hasOwnProperty(P) && (N[P] = j[P]);
    if (_ && _.defaultProps) for (P in j = _.defaultProps, j) N[P] === void 0 && (N[P] = j[P]);
    return { $$typeof: a, type: _, key: A, ref: ne, props: N, _owner: y.current };
  }
  return Eo.Fragment = s, Eo.jsx = C, Eo.jsxs = C, Eo;
}
var Dc;
function yp() {
  return Dc || (Dc = 1, Fs.exports = vp()), Fs.exports;
}
var S = yp(), Be = aa();
const gp = /* @__PURE__ */ ad(Be);
var Qi = {}, Ds = { exports: {} }, _t = {}, Us = { exports: {} }, Bs = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Uc;
function wp() {
  return Uc || (Uc = 1, (function(l) {
    function a(z, B) {
      var U = z.length;
      z.push(B);
      e: for (; 0 < U; ) {
        var v = U - 1 >>> 1, E = z[v];
        if (0 < y(E, B)) z[v] = B, z[U] = E, U = v;
        else break e;
      }
    }
    function s(z) {
      return z.length === 0 ? null : z[0];
    }
    function c(z) {
      if (z.length === 0) return null;
      var B = z[0], U = z.pop();
      if (U !== B) {
        z[0] = U;
        e: for (var v = 0, E = z.length, b = E >>> 1; v < b; ) {
          var ee = 2 * (v + 1) - 1, G = z[ee], ce = ee + 1, fe = z[ce];
          if (0 > y(G, U)) ce < E && 0 > y(fe, G) ? (z[v] = fe, z[ce] = U, v = ce) : (z[v] = G, z[ee] = U, v = ee);
          else if (ce < E && 0 > y(fe, U)) z[v] = fe, z[ce] = U, v = ce;
          else break e;
        }
      }
      return B;
    }
    function y(z, B) {
      var U = z.sortIndex - B.sortIndex;
      return U !== 0 ? U : z.id - B.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      l.unstable_now = function() {
        return h.now();
      };
    } else {
      var C = Date, _ = C.now();
      l.unstable_now = function() {
        return C.now() - _;
      };
    }
    var j = [], F = [], P = 1, N = null, A = 3, ne = !1, ae = !1, H = !1, X = typeof setTimeout == "function" ? setTimeout : null, Te = typeof clearTimeout == "function" ? clearTimeout : null, je = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function T(z) {
      for (var B = s(F); B !== null; ) {
        if (B.callback === null) c(F);
        else if (B.startTime <= z) c(F), B.sortIndex = B.expirationTime, a(j, B);
        else break;
        B = s(F);
      }
    }
    function te(z) {
      if (H = !1, T(z), !ae) if (s(j) !== null) ae = !0, de(ve);
      else {
        var B = s(F);
        B !== null && le(te, B.startTime - z);
      }
    }
    function ve(z, B) {
      ae = !1, H && (H = !1, Te(re), re = -1), ne = !0;
      var U = A;
      try {
        for (T(B), N = s(j); N !== null && (!(N.expirationTime > B) || z && !Ee()); ) {
          var v = N.callback;
          if (typeof v == "function") {
            N.callback = null, A = N.priorityLevel;
            var E = v(N.expirationTime <= B);
            B = l.unstable_now(), typeof E == "function" ? N.callback = E : N === s(j) && c(j), T(B);
          } else c(j);
          N = s(j);
        }
        if (N !== null) var b = !0;
        else {
          var ee = s(F);
          ee !== null && le(te, ee.startTime - B), b = !1;
        }
        return b;
      } finally {
        N = null, A = U, ne = !1;
      }
    }
    var we = !1, pe = null, re = -1, Z = 5, Pe = -1;
    function Ee() {
      return !(l.unstable_now() - Pe < Z);
    }
    function xe() {
      if (pe !== null) {
        var z = l.unstable_now();
        Pe = z;
        var B = !0;
        try {
          B = pe(!0, z);
        } finally {
          B ? Me() : (we = !1, pe = null);
        }
      } else we = !1;
    }
    var Me;
    if (typeof je == "function") Me = function() {
      je(xe);
    };
    else if (typeof MessageChannel < "u") {
      var Ne = new MessageChannel(), Se = Ne.port2;
      Ne.port1.onmessage = xe, Me = function() {
        Se.postMessage(null);
      };
    } else Me = function() {
      X(xe, 0);
    };
    function de(z) {
      pe = z, we || (we = !0, Me());
    }
    function le(z, B) {
      re = X(function() {
        z(l.unstable_now());
      }, B);
    }
    l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(z) {
      z.callback = null;
    }, l.unstable_continueExecution = function() {
      ae || ne || (ae = !0, de(ve));
    }, l.unstable_forceFrameRate = function(z) {
      0 > z || 125 < z ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Z = 0 < z ? Math.floor(1e3 / z) : 5;
    }, l.unstable_getCurrentPriorityLevel = function() {
      return A;
    }, l.unstable_getFirstCallbackNode = function() {
      return s(j);
    }, l.unstable_next = function(z) {
      switch (A) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = A;
      }
      var U = A;
      A = B;
      try {
        return z();
      } finally {
        A = U;
      }
    }, l.unstable_pauseExecution = function() {
    }, l.unstable_requestPaint = function() {
    }, l.unstable_runWithPriority = function(z, B) {
      switch (z) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          z = 3;
      }
      var U = A;
      A = z;
      try {
        return B();
      } finally {
        A = U;
      }
    }, l.unstable_scheduleCallback = function(z, B, U) {
      var v = l.unstable_now();
      switch (typeof U == "object" && U !== null ? (U = U.delay, U = typeof U == "number" && 0 < U ? v + U : v) : U = v, z) {
        case 1:
          var E = -1;
          break;
        case 2:
          E = 250;
          break;
        case 5:
          E = 1073741823;
          break;
        case 4:
          E = 1e4;
          break;
        default:
          E = 5e3;
      }
      return E = U + E, z = { id: P++, callback: B, priorityLevel: z, startTime: U, expirationTime: E, sortIndex: -1 }, U > v ? (z.sortIndex = U, a(F, z), s(j) === null && z === s(F) && (H ? (Te(re), re = -1) : H = !0, le(te, U - v))) : (z.sortIndex = E, a(j, z), ae || ne || (ae = !0, de(ve))), z;
    }, l.unstable_shouldYield = Ee, l.unstable_wrapCallback = function(z) {
      var B = A;
      return function() {
        var U = A;
        A = B;
        try {
          return z.apply(this, arguments);
        } finally {
          A = U;
        }
      };
    };
  })(Bs)), Bs;
}
var Bc;
function Sp() {
  return Bc || (Bc = 1, Us.exports = wp()), Us.exports;
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
var Vc;
function kp() {
  if (Vc) return _t;
  Vc = 1;
  var l = aa(), a = Sp();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var c = /* @__PURE__ */ new Set(), y = {};
  function h(e, t) {
    C(e, t), C(e + "Capture", t);
  }
  function C(e, t) {
    for (y[e] = t, e = 0; e < t.length; e++) c.add(t[e]);
  }
  var _ = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), j = Object.prototype.hasOwnProperty, F = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, P = {}, N = {};
  function A(e) {
    return j.call(N, e) ? !0 : j.call(P, e) ? !1 : F.test(e) ? N[e] = !0 : (P[e] = !0, !1);
  }
  function ne(e, t, n, r) {
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
  function ae(e, t, n, r) {
    if (t === null || typeof t > "u" || ne(e, t, n, r)) return !0;
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
  function H(e, t, n, r, o, i, u) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = u;
  }
  var X = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    X[e] = new H(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    X[t] = new H(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    X[e] = new H(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    X[e] = new H(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    X[e] = new H(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    X[e] = new H(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    X[e] = new H(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    X[e] = new H(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    X[e] = new H(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Te = /[\-:]([a-z])/g;
  function je(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Te,
      je
    );
    X[t] = new H(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Te, je);
    X[t] = new H(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Te, je);
    X[t] = new H(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    X[e] = new H(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), X.xlinkHref = new H("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    X[e] = new H(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function T(e, t, n, r) {
    var o = X.hasOwnProperty(t) ? X[t] : null;
    (o !== null ? o.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (ae(t, n, o, r) && (n = null), r || o === null ? A(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : o.mustUseProperty ? e[o.propertyName] = n === null ? o.type === 3 ? !1 : "" : n : (t = o.attributeName, r = o.attributeNamespace, n === null ? e.removeAttribute(t) : (o = o.type, n = o === 3 || o === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var te = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ve = Symbol.for("react.element"), we = Symbol.for("react.portal"), pe = Symbol.for("react.fragment"), re = Symbol.for("react.strict_mode"), Z = Symbol.for("react.profiler"), Pe = Symbol.for("react.provider"), Ee = Symbol.for("react.context"), xe = Symbol.for("react.forward_ref"), Me = Symbol.for("react.suspense"), Ne = Symbol.for("react.suspense_list"), Se = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), le = Symbol.for("react.offscreen"), z = Symbol.iterator;
  function B(e) {
    return e === null || typeof e != "object" ? null : (e = z && e[z] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var U = Object.assign, v;
  function E(e) {
    if (v === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      v = t && t[1] || "";
    }
    return `
` + v + e;
  }
  var b = !1;
  function ee(e, t) {
    if (!e || b) return "";
    b = !0;
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
        } catch (x) {
          var r = x;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (x) {
          r = x;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (x) {
          r = x;
        }
        e();
      }
    } catch (x) {
      if (x && r && typeof x.stack == "string") {
        for (var o = x.stack.split(`
`), i = r.stack.split(`
`), u = o.length - 1, f = i.length - 1; 1 <= u && 0 <= f && o[u] !== i[f]; ) f--;
        for (; 1 <= u && 0 <= f; u--, f--) if (o[u] !== i[f]) {
          if (u !== 1 || f !== 1)
            do
              if (u--, f--, 0 > f || o[u] !== i[f]) {
                var p = `
` + o[u].replace(" at new ", " at ");
                return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), p;
              }
            while (1 <= u && 0 <= f);
          break;
        }
      }
    } finally {
      b = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? E(e) : "";
  }
  function G(e) {
    switch (e.tag) {
      case 5:
        return E(e.type);
      case 16:
        return E("Lazy");
      case 13:
        return E("Suspense");
      case 19:
        return E("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = ee(e.type, !1), e;
      case 11:
        return e = ee(e.type.render, !1), e;
      case 1:
        return e = ee(e.type, !0), e;
      default:
        return "";
    }
  }
  function ce(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case pe:
        return "Fragment";
      case we:
        return "Portal";
      case Z:
        return "Profiler";
      case re:
        return "StrictMode";
      case Me:
        return "Suspense";
      case Ne:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Ee:
        return (e.displayName || "Context") + ".Consumer";
      case Pe:
        return (e._context.displayName || "Context") + ".Provider";
      case xe:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Se:
        return t = e.displayName || null, t !== null ? t : ce(e.type) || "Memo";
      case de:
        t = e._payload, e = e._init;
        try {
          return ce(e(t));
        } catch {
        }
    }
    return null;
  }
  function fe(e) {
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
        return ce(t);
      case 8:
        return t === re ? "StrictMode" : "Mode";
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
  function he(e) {
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
  function ke(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ae(e) {
    var t = ke(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var o = n.get, i = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return o.call(this);
      }, set: function(u) {
        r = "" + u, i.call(this, u);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(u) {
        r = "" + u;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function ut(e) {
    e._valueTracker || (e._valueTracker = Ae(e));
  }
  function mt(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ke(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function ct(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function ln(e, t) {
    var n = t.checked;
    return U({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Ir(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = he(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Lo(e, t) {
    t = t.checked, t != null && T(e, "checked", t, !1);
  }
  function Lr(e, t) {
    Lo(e, t);
    var n = he(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Or(e, t.type, n) : t.hasOwnProperty("defaultValue") && Or(e, t.type, he(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Oo(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Or(e, t, n) {
    (t !== "number" || ct(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Hn = Array.isArray;
  function gn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
      for (n = 0; n < e.length; n++) o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + he(n), t = null, o = 0; o < e.length; o++) {
        if (e[o].value === n) {
          e[o].selected = !0, r && (e[o].defaultSelected = !0);
          return;
        }
        t !== null || e[o].disabled || (t = e[o]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function wn(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return U({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Mo(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if (Hn(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: he(n) };
  }
  function Mr(e, t) {
    var n = he(t.value), r = he(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Ao(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Fo(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Ar(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Fo(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var lr, sr = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, o) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, o);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (lr = lr || document.createElement("div"), lr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = lr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Qn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Kn = {
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
  }, el = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Kn).forEach(function(e) {
    el.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Kn[t] = Kn[e];
    });
  });
  function Fr(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Kn.hasOwnProperty(e) && Kn[e] ? ("" + t).trim() : t + "px";
  }
  function $o(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, o = Fr(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o;
    }
  }
  var tl = U({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function $r(e, t) {
    if (t) {
      if (tl[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function Dr(e, t) {
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
  var Ur = null;
  function Xn(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Br = null, Sn = null, d = null;
  function g(e) {
    if (e = uo(e)) {
      if (typeof Br != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = li(t), Br(e.stateNode, e.type, t));
    }
  }
  function O(e) {
    Sn ? d ? d.push(e) : d = [e] : Sn = e;
  }
  function $() {
    if (Sn) {
      var e = Sn, t = d;
      if (d = Sn = null, g(e), t) for (e = 0; e < t.length; e++) g(t[e]);
    }
  }
  function D(e, t) {
    return e(t);
  }
  function K() {
  }
  var J = !1;
  function ye(e, t, n) {
    if (J) return e(t, n);
    J = !0;
    try {
      return D(e, t, n);
    } finally {
      J = !1, (Sn !== null || d !== null) && (K(), $());
    }
  }
  function ot(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = li(n);
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
    if (n && typeof n != "function") throw Error(s(231, t, typeof n));
    return n;
  }
  var ze = !1;
  if (_) try {
    var Ie = {};
    Object.defineProperty(Ie, "passive", { get: function() {
      ze = !0;
    } }), window.addEventListener("test", Ie, Ie), window.removeEventListener("test", Ie, Ie);
  } catch {
    ze = !1;
  }
  function Ye(e, t, n, r, o, i, u, f, p) {
    var x = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, x);
    } catch (I) {
      this.onError(I);
    }
  }
  var He = !1, et = null, zt = !1, se = null, me = { onError: function(e) {
    He = !0, et = e;
  } };
  function it(e, t, n, r, o, i, u, f, p) {
    He = !1, et = null, Ye.apply(me, arguments);
  }
  function ar(e, t, n, r, o, i, u, f, p) {
    if (it.apply(this, arguments), He) {
      if (He) {
        var x = et;
        He = !1, et = null;
      } else throw Error(s(198));
      zt || (zt = !0, se = x);
    }
  }
  function Qe(e) {
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
  function Do(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function kn(e) {
    if (Qe(e) !== e) throw Error(s(188));
  }
  function $t(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Qe(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var o = n.return;
      if (o === null) break;
      var i = o.alternate;
      if (i === null) {
        if (r = o.return, r !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (o.child === i.child) {
        for (i = o.child; i; ) {
          if (i === n) return kn(o), e;
          if (i === r) return kn(o), t;
          i = i.sibling;
        }
        throw Error(s(188));
      }
      if (n.return !== r.return) n = o, r = i;
      else {
        for (var u = !1, f = o.child; f; ) {
          if (f === n) {
            u = !0, n = o, r = i;
            break;
          }
          if (f === r) {
            u = !0, r = o, n = i;
            break;
          }
          f = f.sibling;
        }
        if (!u) {
          for (f = i.child; f; ) {
            if (f === n) {
              u = !0, n = i, r = o;
              break;
            }
            if (f === r) {
              u = !0, r = i, n = o;
              break;
            }
            f = f.sibling;
          }
          if (!u) throw Error(s(189));
        }
      }
      if (n.alternate !== r) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function Vr(e) {
    return e = $t(e), e !== null ? Wr(e) : null;
  }
  function Wr(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Wr(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Hr = a.unstable_scheduleCallback, sn = a.unstable_cancelCallback, nl = a.unstable_shouldYield, _d = a.unstable_requestPaint, Je = a.unstable_now, Ed = a.unstable_getCurrentPriorityLevel, rl = a.unstable_ImmediatePriority, da = a.unstable_UserBlockingPriority, Uo = a.unstable_NormalPriority, Cd = a.unstable_LowPriority, fa = a.unstable_IdlePriority, Bo = null, Jt = null;
  function Pd(e) {
    if (Jt && typeof Jt.onCommitFiberRoot == "function") try {
      Jt.onCommitFiberRoot(Bo, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dt = Math.clz32 ? Math.clz32 : Rd, Nd = Math.log, Td = Math.LN2;
  function Rd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Nd(e) / Td | 0) | 0;
  }
  var Vo = 64, Wo = 4194304;
  function Qr(e) {
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
  function Ho(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, o = e.suspendedLanes, i = e.pingedLanes, u = n & 268435455;
    if (u !== 0) {
      var f = u & ~o;
      f !== 0 ? r = Qr(f) : (i &= u, i !== 0 && (r = Qr(i)));
    } else u = n & ~o, u !== 0 ? r = Qr(u) : i !== 0 && (r = Qr(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & o) === 0 && (o = r & -r, i = t & -t, o >= i || o === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Dt(t), o = 1 << n, r |= e[n], t &= ~o;
    return r;
  }
  function zd(e, t) {
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
  function Id(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, o = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var u = 31 - Dt(i), f = 1 << u, p = o[u];
      p === -1 ? ((f & n) === 0 || (f & r) !== 0) && (o[u] = zd(f, t)) : p <= t && (e.expiredLanes |= f), i &= ~f;
    }
  }
  function ol(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function pa() {
    var e = Vo;
    return Vo <<= 1, (Vo & 4194240) === 0 && (Vo = 64), e;
  }
  function il(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Kr(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Dt(t), e[t] = n;
  }
  function Ld(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var o = 31 - Dt(n), i = 1 << o;
      t[o] = 0, r[o] = -1, e[o] = -1, n &= ~i;
    }
  }
  function ll(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - Dt(n), o = 1 << r;
      o & t | e[r] & t && (e[r] |= t), n &= ~o;
    }
  }
  var Re = 0;
  function ha(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var ma, sl, va, ya, ga, al = !1, Qo = [], xn = null, jn = null, _n = null, Xr = /* @__PURE__ */ new Map(), Yr = /* @__PURE__ */ new Map(), En = [], Od = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function wa(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        xn = null;
        break;
      case "dragenter":
      case "dragleave":
        jn = null;
        break;
      case "mouseover":
      case "mouseout":
        _n = null;
        break;
      case "pointerover":
      case "pointerout":
        Xr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Yr.delete(t.pointerId);
    }
  }
  function Jr(e, t, n, r, o, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [o] }, t !== null && (t = uo(t), t !== null && sl(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e);
  }
  function Md(e, t, n, r, o) {
    switch (t) {
      case "focusin":
        return xn = Jr(xn, e, t, n, r, o), !0;
      case "dragenter":
        return jn = Jr(jn, e, t, n, r, o), !0;
      case "mouseover":
        return _n = Jr(_n, e, t, n, r, o), !0;
      case "pointerover":
        var i = o.pointerId;
        return Xr.set(i, Jr(Xr.get(i) || null, e, t, n, r, o)), !0;
      case "gotpointercapture":
        return i = o.pointerId, Yr.set(i, Jr(Yr.get(i) || null, e, t, n, r, o)), !0;
    }
    return !1;
  }
  function Sa(e) {
    var t = Yn(e.target);
    if (t !== null) {
      var n = Qe(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = Do(n), t !== null) {
            e.blockedOn = t, ga(e.priority, function() {
              va(n);
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
  function Ko(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = cl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Ur = r, n.target.dispatchEvent(r), Ur = null;
      } else return t = uo(n), t !== null && sl(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function ka(e, t, n) {
    Ko(e) && n.delete(t);
  }
  function Ad() {
    al = !1, xn !== null && Ko(xn) && (xn = null), jn !== null && Ko(jn) && (jn = null), _n !== null && Ko(_n) && (_n = null), Xr.forEach(ka), Yr.forEach(ka);
  }
  function qr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, al || (al = !0, a.unstable_scheduleCallback(a.unstable_NormalPriority, Ad)));
  }
  function Gr(e) {
    function t(o) {
      return qr(o, e);
    }
    if (0 < Qo.length) {
      qr(Qo[0], e);
      for (var n = 1; n < Qo.length; n++) {
        var r = Qo[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (xn !== null && qr(xn, e), jn !== null && qr(jn, e), _n !== null && qr(_n, e), Xr.forEach(t), Yr.forEach(t), n = 0; n < En.length; n++) r = En[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < En.length && (n = En[0], n.blockedOn === null); ) Sa(n), n.blockedOn === null && En.shift();
  }
  var ur = te.ReactCurrentBatchConfig, Xo = !0;
  function Fd(e, t, n, r) {
    var o = Re, i = ur.transition;
    ur.transition = null;
    try {
      Re = 1, ul(e, t, n, r);
    } finally {
      Re = o, ur.transition = i;
    }
  }
  function $d(e, t, n, r) {
    var o = Re, i = ur.transition;
    ur.transition = null;
    try {
      Re = 4, ul(e, t, n, r);
    } finally {
      Re = o, ur.transition = i;
    }
  }
  function ul(e, t, n, r) {
    if (Xo) {
      var o = cl(e, t, n, r);
      if (o === null) Pl(e, t, r, Yo, n), wa(e, r);
      else if (Md(o, e, t, n, r)) r.stopPropagation();
      else if (wa(e, r), t & 4 && -1 < Od.indexOf(e)) {
        for (; o !== null; ) {
          var i = uo(o);
          if (i !== null && ma(i), i = cl(e, t, n, r), i === null && Pl(e, t, r, Yo, n), i === o) break;
          o = i;
        }
        o !== null && r.stopPropagation();
      } else Pl(e, t, r, null, n);
    }
  }
  var Yo = null;
  function cl(e, t, n, r) {
    if (Yo = null, e = Xn(r), e = Yn(e), e !== null) if (t = Qe(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = Do(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Yo = e, null;
  }
  function xa(e) {
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
        switch (Ed()) {
          case rl:
            return 1;
          case da:
            return 4;
          case Uo:
          case Cd:
            return 16;
          case fa:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Cn = null, dl = null, Jo = null;
  function ja() {
    if (Jo) return Jo;
    var e, t = dl, n = t.length, r, o = "value" in Cn ? Cn.value : Cn.textContent, i = o.length;
    for (e = 0; e < n && t[e] === o[e]; e++) ;
    var u = n - e;
    for (r = 1; r <= u && t[n - r] === o[i - r]; r++) ;
    return Jo = o.slice(e, 1 < r ? 1 - r : void 0);
  }
  function qo(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Go() {
    return !0;
  }
  function _a() {
    return !1;
  }
  function Et(e) {
    function t(n, r, o, i, u) {
      this._reactName = n, this._targetInst = o, this.type = r, this.nativeEvent = i, this.target = u, this.currentTarget = null;
      for (var f in e) e.hasOwnProperty(f) && (n = e[f], this[f] = n ? n(i) : i[f]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? Go : _a, this.isPropagationStopped = _a, this;
    }
    return U(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Go);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Go);
    }, persist: function() {
    }, isPersistent: Go }), t;
  }
  var cr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, fl = Et(cr), Zr = U({}, cr, { view: 0, detail: 0 }), Dd = Et(Zr), pl, hl, br, Zo = U({}, Zr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: vl, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== br && (br && e.type === "mousemove" ? (pl = e.screenX - br.screenX, hl = e.screenY - br.screenY) : hl = pl = 0, br = e), pl);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : hl;
  } }), Ea = Et(Zo), Ud = U({}, Zo, { dataTransfer: 0 }), Bd = Et(Ud), Vd = U({}, Zr, { relatedTarget: 0 }), ml = Et(Vd), Wd = U({}, cr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = Et(Wd), Qd = U({}, cr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Kd = Et(Qd), Xd = U({}, cr, { data: 0 }), Ca = Et(Xd), Yd = {
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
  }, Jd = {
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
  }, qd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Gd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = qd[e]) ? !!t[e] : !1;
  }
  function vl() {
    return Gd;
  }
  var Zd = U({}, Zr, { key: function(e) {
    if (e.key) {
      var t = Yd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = qo(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Jd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: vl, charCode: function(e) {
    return e.type === "keypress" ? qo(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? qo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), bd = Et(Zd), ef = U({}, Zo, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Pa = Et(ef), tf = U({}, Zr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: vl }), nf = Et(tf), rf = U({}, cr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), of = Et(rf), lf = U({}, Zo, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), sf = Et(lf), af = [9, 13, 27, 32], yl = _ && "CompositionEvent" in window, eo = null;
  _ && "documentMode" in document && (eo = document.documentMode);
  var uf = _ && "TextEvent" in window && !eo, Na = _ && (!yl || eo && 8 < eo && 11 >= eo), Ta = " ", Ra = !1;
  function za(e, t) {
    switch (e) {
      case "keyup":
        return af.indexOf(t.keyCode) !== -1;
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
  function Ia(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var dr = !1;
  function cf(e, t) {
    switch (e) {
      case "compositionend":
        return Ia(t);
      case "keypress":
        return t.which !== 32 ? null : (Ra = !0, Ta);
      case "textInput":
        return e = t.data, e === Ta && Ra ? null : e;
      default:
        return null;
    }
  }
  function df(e, t) {
    if (dr) return e === "compositionend" || !yl && za(e, t) ? (e = ja(), Jo = dl = Cn = null, dr = !1, e) : null;
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
        return Na && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var ff = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function La(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!ff[e.type] : t === "textarea";
  }
  function Oa(e, t, n, r) {
    O(r), t = ri(t, "onChange"), 0 < t.length && (n = new fl("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var to = null, no = null;
  function pf(e) {
    Za(e, 0);
  }
  function bo(e) {
    var t = vr(e);
    if (mt(t)) return e;
  }
  function hf(e, t) {
    if (e === "change") return t;
  }
  var Ma = !1;
  if (_) {
    var gl;
    if (_) {
      var wl = "oninput" in document;
      if (!wl) {
        var Aa = document.createElement("div");
        Aa.setAttribute("oninput", "return;"), wl = typeof Aa.oninput == "function";
      }
      gl = wl;
    } else gl = !1;
    Ma = gl && (!document.documentMode || 9 < document.documentMode);
  }
  function Fa() {
    to && (to.detachEvent("onpropertychange", $a), no = to = null);
  }
  function $a(e) {
    if (e.propertyName === "value" && bo(no)) {
      var t = [];
      Oa(t, no, e, Xn(e)), ye(pf, t);
    }
  }
  function mf(e, t, n) {
    e === "focusin" ? (Fa(), to = t, no = n, to.attachEvent("onpropertychange", $a)) : e === "focusout" && Fa();
  }
  function vf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return bo(no);
  }
  function yf(e, t) {
    if (e === "click") return bo(t);
  }
  function gf(e, t) {
    if (e === "input" || e === "change") return bo(t);
  }
  function wf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Ut = typeof Object.is == "function" ? Object.is : wf;
  function ro(e, t) {
    if (Ut(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var o = n[r];
      if (!j.call(t, o) || !Ut(e[o], t[o])) return !1;
    }
    return !0;
  }
  function Da(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ua(e, t) {
    var n = Da(e);
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
      n = Da(n);
    }
  }
  function Ba(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ba(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Va() {
    for (var e = window, t = ct(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ct(e.document);
    }
    return t;
  }
  function Sl(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Sf(e) {
    var t = Va(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Ba(n.ownerDocument.documentElement, n)) {
      if (r !== null && Sl(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var o = n.textContent.length, i = Math.min(r.start, o);
          r = r.end === void 0 ? i : Math.min(r.end, o), !e.extend && i > r && (o = r, r = i, i = o), o = Ua(n, i);
          var u = Ua(
            n,
            r
          );
          o && u && (e.rangeCount !== 1 || e.anchorNode !== o.node || e.anchorOffset !== o.offset || e.focusNode !== u.node || e.focusOffset !== u.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(u.node, u.offset)) : (t.setEnd(u.node, u.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var kf = _ && "documentMode" in document && 11 >= document.documentMode, fr = null, kl = null, oo = null, xl = !1;
  function Wa(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    xl || fr == null || fr !== ct(r) || (r = fr, "selectionStart" in r && Sl(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), oo && ro(oo, r) || (oo = r, r = ri(kl, "onSelect"), 0 < r.length && (t = new fl("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = fr)));
  }
  function ei(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var pr = { animationend: ei("Animation", "AnimationEnd"), animationiteration: ei("Animation", "AnimationIteration"), animationstart: ei("Animation", "AnimationStart"), transitionend: ei("Transition", "TransitionEnd") }, jl = {}, Ha = {};
  _ && (Ha = document.createElement("div").style, "AnimationEvent" in window || (delete pr.animationend.animation, delete pr.animationiteration.animation, delete pr.animationstart.animation), "TransitionEvent" in window || delete pr.transitionend.transition);
  function ti(e) {
    if (jl[e]) return jl[e];
    if (!pr[e]) return e;
    var t = pr[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Ha) return jl[e] = t[n];
    return e;
  }
  var Qa = ti("animationend"), Ka = ti("animationiteration"), Xa = ti("animationstart"), Ya = ti("transitionend"), Ja = /* @__PURE__ */ new Map(), qa = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Pn(e, t) {
    Ja.set(e, t), h(t, [e]);
  }
  for (var _l = 0; _l < qa.length; _l++) {
    var El = qa[_l], xf = El.toLowerCase(), jf = El[0].toUpperCase() + El.slice(1);
    Pn(xf, "on" + jf);
  }
  Pn(Qa, "onAnimationEnd"), Pn(Ka, "onAnimationIteration"), Pn(Xa, "onAnimationStart"), Pn("dblclick", "onDoubleClick"), Pn("focusin", "onFocus"), Pn("focusout", "onBlur"), Pn(Ya, "onTransitionEnd"), C("onMouseEnter", ["mouseout", "mouseover"]), C("onMouseLeave", ["mouseout", "mouseover"]), C("onPointerEnter", ["pointerout", "pointerover"]), C("onPointerLeave", ["pointerout", "pointerover"]), h("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), h("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), h("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), h("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), h("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), h("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var io = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), _f = new Set("cancel close invalid load scroll toggle".split(" ").concat(io));
  function Ga(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, ar(r, t, void 0, e), e.currentTarget = null;
  }
  function Za(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], o = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var u = r.length - 1; 0 <= u; u--) {
          var f = r[u], p = f.instance, x = f.currentTarget;
          if (f = f.listener, p !== i && o.isPropagationStopped()) break e;
          Ga(o, f, x), i = p;
        }
        else for (u = 0; u < r.length; u++) {
          if (f = r[u], p = f.instance, x = f.currentTarget, f = f.listener, p !== i && o.isPropagationStopped()) break e;
          Ga(o, f, x), i = p;
        }
      }
    }
    if (zt) throw e = se, zt = !1, se = null, e;
  }
  function Fe(e, t) {
    var n = t[Ll];
    n === void 0 && (n = t[Ll] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ba(t, e, 2, !1), n.add(r));
  }
  function Cl(e, t, n) {
    var r = 0;
    t && (r |= 4), ba(n, e, r, t);
  }
  var ni = "_reactListening" + Math.random().toString(36).slice(2);
  function lo(e) {
    if (!e[ni]) {
      e[ni] = !0, c.forEach(function(n) {
        n !== "selectionchange" && (_f.has(n) || Cl(n, !1, e), Cl(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ni] || (t[ni] = !0, Cl("selectionchange", !1, t));
    }
  }
  function ba(e, t, n, r) {
    switch (xa(t)) {
      case 1:
        var o = Fd;
        break;
      case 4:
        o = $d;
        break;
      default:
        o = ul;
    }
    n = o.bind(null, t, n, e), o = void 0, !ze || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), r ? o !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: o }) : e.addEventListener(t, n, !0) : o !== void 0 ? e.addEventListener(t, n, { passive: o }) : e.addEventListener(t, n, !1);
  }
  function Pl(e, t, n, r, o) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var u = r.tag;
      if (u === 3 || u === 4) {
        var f = r.stateNode.containerInfo;
        if (f === o || f.nodeType === 8 && f.parentNode === o) break;
        if (u === 4) for (u = r.return; u !== null; ) {
          var p = u.tag;
          if ((p === 3 || p === 4) && (p = u.stateNode.containerInfo, p === o || p.nodeType === 8 && p.parentNode === o)) return;
          u = u.return;
        }
        for (; f !== null; ) {
          if (u = Yn(f), u === null) return;
          if (p = u.tag, p === 5 || p === 6) {
            r = i = u;
            continue e;
          }
          f = f.parentNode;
        }
      }
      r = r.return;
    }
    ye(function() {
      var x = i, I = Xn(n), L = [];
      e: {
        var R = Ja.get(e);
        if (R !== void 0) {
          var V = fl, Q = e;
          switch (e) {
            case "keypress":
              if (qo(n) === 0) break e;
            case "keydown":
            case "keyup":
              V = bd;
              break;
            case "focusin":
              Q = "focus", V = ml;
              break;
            case "focusout":
              Q = "blur", V = ml;
              break;
            case "beforeblur":
            case "afterblur":
              V = ml;
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
              V = Ea;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              V = Bd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              V = nf;
              break;
            case Qa:
            case Ka:
            case Xa:
              V = Hd;
              break;
            case Ya:
              V = of;
              break;
            case "scroll":
              V = Dd;
              break;
            case "wheel":
              V = sf;
              break;
            case "copy":
            case "cut":
            case "paste":
              V = Kd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              V = Pa;
          }
          var Y = (t & 4) !== 0, qe = !Y && e === "scroll", w = Y ? R !== null ? R + "Capture" : null : R;
          Y = [];
          for (var m = x, k; m !== null; ) {
            k = m;
            var M = k.stateNode;
            if (k.tag === 5 && M !== null && (k = M, w !== null && (M = ot(m, w), M != null && Y.push(so(m, M, k)))), qe) break;
            m = m.return;
          }
          0 < Y.length && (R = new V(R, Q, null, n, I), L.push({ event: R, listeners: Y }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (R = e === "mouseover" || e === "pointerover", V = e === "mouseout" || e === "pointerout", R && n !== Ur && (Q = n.relatedTarget || n.fromElement) && (Yn(Q) || Q[an])) break e;
          if ((V || R) && (R = I.window === I ? I : (R = I.ownerDocument) ? R.defaultView || R.parentWindow : window, V ? (Q = n.relatedTarget || n.toElement, V = x, Q = Q ? Yn(Q) : null, Q !== null && (qe = Qe(Q), Q !== qe || Q.tag !== 5 && Q.tag !== 6) && (Q = null)) : (V = null, Q = x), V !== Q)) {
            if (Y = Ea, M = "onMouseLeave", w = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (Y = Pa, M = "onPointerLeave", w = "onPointerEnter", m = "pointer"), qe = V == null ? R : vr(V), k = Q == null ? R : vr(Q), R = new Y(M, m + "leave", V, n, I), R.target = qe, R.relatedTarget = k, M = null, Yn(I) === x && (Y = new Y(w, m + "enter", Q, n, I), Y.target = k, Y.relatedTarget = qe, M = Y), qe = M, V && Q) t: {
              for (Y = V, w = Q, m = 0, k = Y; k; k = hr(k)) m++;
              for (k = 0, M = w; M; M = hr(M)) k++;
              for (; 0 < m - k; ) Y = hr(Y), m--;
              for (; 0 < k - m; ) w = hr(w), k--;
              for (; m--; ) {
                if (Y === w || w !== null && Y === w.alternate) break t;
                Y = hr(Y), w = hr(w);
              }
              Y = null;
            }
            else Y = null;
            V !== null && eu(L, R, V, Y, !1), Q !== null && qe !== null && eu(L, qe, Q, Y, !0);
          }
        }
        e: {
          if (R = x ? vr(x) : window, V = R.nodeName && R.nodeName.toLowerCase(), V === "select" || V === "input" && R.type === "file") var q = hf;
          else if (La(R)) if (Ma) q = gf;
          else {
            q = vf;
            var oe = mf;
          }
          else (V = R.nodeName) && V.toLowerCase() === "input" && (R.type === "checkbox" || R.type === "radio") && (q = yf);
          if (q && (q = q(e, x))) {
            Oa(L, q, n, I);
            break e;
          }
          oe && oe(e, R, x), e === "focusout" && (oe = R._wrapperState) && oe.controlled && R.type === "number" && Or(R, "number", R.value);
        }
        switch (oe = x ? vr(x) : window, e) {
          case "focusin":
            (La(oe) || oe.contentEditable === "true") && (fr = oe, kl = x, oo = null);
            break;
          case "focusout":
            oo = kl = fr = null;
            break;
          case "mousedown":
            xl = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            xl = !1, Wa(L, n, I);
            break;
          case "selectionchange":
            if (kf) break;
          case "keydown":
          case "keyup":
            Wa(L, n, I);
        }
        var ie;
        if (yl) e: {
          switch (e) {
            case "compositionstart":
              var ue = "onCompositionStart";
              break e;
            case "compositionend":
              ue = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ue = "onCompositionUpdate";
              break e;
          }
          ue = void 0;
        }
        else dr ? za(e, n) && (ue = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ue = "onCompositionStart");
        ue && (Na && n.locale !== "ko" && (dr || ue !== "onCompositionStart" ? ue === "onCompositionEnd" && dr && (ie = ja()) : (Cn = I, dl = "value" in Cn ? Cn.value : Cn.textContent, dr = !0)), oe = ri(x, ue), 0 < oe.length && (ue = new Ca(ue, e, null, n, I), L.push({ event: ue, listeners: oe }), ie ? ue.data = ie : (ie = Ia(n), ie !== null && (ue.data = ie)))), (ie = uf ? cf(e, n) : df(e, n)) && (x = ri(x, "onBeforeInput"), 0 < x.length && (I = new Ca("onBeforeInput", "beforeinput", null, n, I), L.push({ event: I, listeners: x }), I.data = ie));
      }
      Za(L, t);
    });
  }
  function so(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function ri(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var o = e, i = o.stateNode;
      o.tag === 5 && i !== null && (o = i, i = ot(e, n), i != null && r.unshift(so(e, i, o)), i = ot(e, t), i != null && r.push(so(e, i, o))), e = e.return;
    }
    return r;
  }
  function hr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function eu(e, t, n, r, o) {
    for (var i = t._reactName, u = []; n !== null && n !== r; ) {
      var f = n, p = f.alternate, x = f.stateNode;
      if (p !== null && p === r) break;
      f.tag === 5 && x !== null && (f = x, o ? (p = ot(n, i), p != null && u.unshift(so(n, p, f))) : o || (p = ot(n, i), p != null && u.push(so(n, p, f)))), n = n.return;
    }
    u.length !== 0 && e.push({ event: t, listeners: u });
  }
  var Ef = /\r\n?/g, Cf = /\u0000|\uFFFD/g;
  function tu(e) {
    return (typeof e == "string" ? e : "" + e).replace(Ef, `
`).replace(Cf, "");
  }
  function oi(e, t, n) {
    if (t = tu(t), tu(e) !== t && n) throw Error(s(425));
  }
  function ii() {
  }
  var Nl = null, Tl = null;
  function Rl(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var zl = typeof setTimeout == "function" ? setTimeout : void 0, Pf = typeof clearTimeout == "function" ? clearTimeout : void 0, nu = typeof Promise == "function" ? Promise : void 0, Nf = typeof queueMicrotask == "function" ? queueMicrotask : typeof nu < "u" ? function(e) {
    return nu.resolve(null).then(e).catch(Tf);
  } : zl;
  function Tf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Il(e, t) {
    var n = t, r = 0;
    do {
      var o = n.nextSibling;
      if (e.removeChild(n), o && o.nodeType === 8) if (n = o.data, n === "/$") {
        if (r === 0) {
          e.removeChild(o), Gr(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = o;
    } while (n);
    Gr(t);
  }
  function Nn(e) {
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
  function ru(e) {
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
  var mr = Math.random().toString(36).slice(2), qt = "__reactFiber$" + mr, ao = "__reactProps$" + mr, an = "__reactContainer$" + mr, Ll = "__reactEvents$" + mr, Rf = "__reactListeners$" + mr, zf = "__reactHandles$" + mr;
  function Yn(e) {
    var t = e[qt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[an] || n[qt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = ru(e); e !== null; ) {
          if (n = e[qt]) return n;
          e = ru(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function uo(e) {
    return e = e[qt] || e[an], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function vr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function li(e) {
    return e[ao] || null;
  }
  var Ol = [], yr = -1;
  function Tn(e) {
    return { current: e };
  }
  function $e(e) {
    0 > yr || (e.current = Ol[yr], Ol[yr] = null, yr--);
  }
  function Oe(e, t) {
    yr++, Ol[yr] = e.current, e.current = t;
  }
  var Rn = {}, dt = Tn(Rn), wt = Tn(!1), Jn = Rn;
  function gr(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Rn;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o = {}, i;
    for (i in n) o[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = o), o;
  }
  function St(e) {
    return e = e.childContextTypes, e != null;
  }
  function si() {
    $e(wt), $e(dt);
  }
  function ou(e, t, n) {
    if (dt.current !== Rn) throw Error(s(168));
    Oe(dt, t), Oe(wt, n);
  }
  function iu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var o in r) if (!(o in t)) throw Error(s(108, fe(e) || "Unknown", o));
    return U({}, n, r);
  }
  function ai(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Rn, Jn = dt.current, Oe(dt, e), Oe(wt, wt.current), !0;
  }
  function lu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = iu(e, t, Jn), r.__reactInternalMemoizedMergedChildContext = e, $e(wt), $e(dt), Oe(dt, e)) : $e(wt), Oe(wt, n);
  }
  var un = null, ui = !1, Ml = !1;
  function su(e) {
    un === null ? un = [e] : un.push(e);
  }
  function If(e) {
    ui = !0, su(e);
  }
  function zn() {
    if (!Ml && un !== null) {
      Ml = !0;
      var e = 0, t = Re;
      try {
        var n = un;
        for (Re = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        un = null, ui = !1;
      } catch (o) {
        throw un !== null && (un = un.slice(e + 1)), Hr(rl, zn), o;
      } finally {
        Re = t, Ml = !1;
      }
    }
    return null;
  }
  var wr = [], Sr = 0, ci = null, di = 0, It = [], Lt = 0, qn = null, cn = 1, dn = "";
  function Gn(e, t) {
    wr[Sr++] = di, wr[Sr++] = ci, ci = e, di = t;
  }
  function au(e, t, n) {
    It[Lt++] = cn, It[Lt++] = dn, It[Lt++] = qn, qn = e;
    var r = cn;
    e = dn;
    var o = 32 - Dt(r) - 1;
    r &= ~(1 << o), n += 1;
    var i = 32 - Dt(t) + o;
    if (30 < i) {
      var u = o - o % 5;
      i = (r & (1 << u) - 1).toString(32), r >>= u, o -= u, cn = 1 << 32 - Dt(t) + o | n << o | r, dn = i + e;
    } else cn = 1 << i | n << o | r, dn = e;
  }
  function Al(e) {
    e.return !== null && (Gn(e, 1), au(e, 1, 0));
  }
  function Fl(e) {
    for (; e === ci; ) ci = wr[--Sr], wr[Sr] = null, di = wr[--Sr], wr[Sr] = null;
    for (; e === qn; ) qn = It[--Lt], It[Lt] = null, dn = It[--Lt], It[Lt] = null, cn = It[--Lt], It[Lt] = null;
  }
  var Ct = null, Pt = null, Ue = !1, Bt = null;
  function uu(e, t) {
    var n = Ft(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function cu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ct = e, Pt = Nn(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ct = e, Pt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = qn !== null ? { id: cn, overflow: dn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Ft(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Ct = e, Pt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function $l(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Dl(e) {
    if (Ue) {
      var t = Pt;
      if (t) {
        var n = t;
        if (!cu(e, t)) {
          if ($l(e)) throw Error(s(418));
          t = Nn(n.nextSibling);
          var r = Ct;
          t && cu(e, t) ? uu(r, n) : (e.flags = e.flags & -4097 | 2, Ue = !1, Ct = e);
        }
      } else {
        if ($l(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, Ue = !1, Ct = e;
      }
    }
  }
  function du(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    Ct = e;
  }
  function fi(e) {
    if (e !== Ct) return !1;
    if (!Ue) return du(e), Ue = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Rl(e.type, e.memoizedProps)), t && (t = Pt)) {
      if ($l(e)) throw fu(), Error(s(418));
      for (; t; ) uu(e, t), t = Nn(t.nextSibling);
    }
    if (du(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                Pt = Nn(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Pt = null;
      }
    } else Pt = Ct ? Nn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function fu() {
    for (var e = Pt; e; ) e = Nn(e.nextSibling);
  }
  function kr() {
    Pt = Ct = null, Ue = !1;
  }
  function Ul(e) {
    Bt === null ? Bt = [e] : Bt.push(e);
  }
  var Lf = te.ReactCurrentBatchConfig;
  function co(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(s(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(s(147, e));
        var o = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(u) {
          var f = o.refs;
          u === null ? delete f[i] : f[i] = u;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(s(284));
      if (!n._owner) throw Error(s(290, e));
    }
    return e;
  }
  function pi(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function pu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function hu(e) {
    function t(w, m) {
      if (e) {
        var k = w.deletions;
        k === null ? (w.deletions = [m], w.flags |= 16) : k.push(m);
      }
    }
    function n(w, m) {
      if (!e) return null;
      for (; m !== null; ) t(w, m), m = m.sibling;
      return null;
    }
    function r(w, m) {
      for (w = /* @__PURE__ */ new Map(); m !== null; ) m.key !== null ? w.set(m.key, m) : w.set(m.index, m), m = m.sibling;
      return w;
    }
    function o(w, m) {
      return w = Dn(w, m), w.index = 0, w.sibling = null, w;
    }
    function i(w, m, k) {
      return w.index = k, e ? (k = w.alternate, k !== null ? (k = k.index, k < m ? (w.flags |= 2, m) : k) : (w.flags |= 2, m)) : (w.flags |= 1048576, m);
    }
    function u(w) {
      return e && w.alternate === null && (w.flags |= 2), w;
    }
    function f(w, m, k, M) {
      return m === null || m.tag !== 6 ? (m = zs(k, w.mode, M), m.return = w, m) : (m = o(m, k), m.return = w, m);
    }
    function p(w, m, k, M) {
      var q = k.type;
      return q === pe ? I(w, m, k.props.children, M, k.key) : m !== null && (m.elementType === q || typeof q == "object" && q !== null && q.$$typeof === de && pu(q) === m.type) ? (M = o(m, k.props), M.ref = co(w, m, k), M.return = w, M) : (M = Fi(k.type, k.key, k.props, null, w.mode, M), M.ref = co(w, m, k), M.return = w, M);
    }
    function x(w, m, k, M) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== k.containerInfo || m.stateNode.implementation !== k.implementation ? (m = Is(k, w.mode, M), m.return = w, m) : (m = o(m, k.children || []), m.return = w, m);
    }
    function I(w, m, k, M, q) {
      return m === null || m.tag !== 7 ? (m = ir(k, w.mode, M, q), m.return = w, m) : (m = o(m, k), m.return = w, m);
    }
    function L(w, m, k) {
      if (typeof m == "string" && m !== "" || typeof m == "number") return m = zs("" + m, w.mode, k), m.return = w, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case ve:
            return k = Fi(m.type, m.key, m.props, null, w.mode, k), k.ref = co(w, null, m), k.return = w, k;
          case we:
            return m = Is(m, w.mode, k), m.return = w, m;
          case de:
            var M = m._init;
            return L(w, M(m._payload), k);
        }
        if (Hn(m) || B(m)) return m = ir(m, w.mode, k, null), m.return = w, m;
        pi(w, m);
      }
      return null;
    }
    function R(w, m, k, M) {
      var q = m !== null ? m.key : null;
      if (typeof k == "string" && k !== "" || typeof k == "number") return q !== null ? null : f(w, m, "" + k, M);
      if (typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case ve:
            return k.key === q ? p(w, m, k, M) : null;
          case we:
            return k.key === q ? x(w, m, k, M) : null;
          case de:
            return q = k._init, R(
              w,
              m,
              q(k._payload),
              M
            );
        }
        if (Hn(k) || B(k)) return q !== null ? null : I(w, m, k, M, null);
        pi(w, k);
      }
      return null;
    }
    function V(w, m, k, M, q) {
      if (typeof M == "string" && M !== "" || typeof M == "number") return w = w.get(k) || null, f(m, w, "" + M, q);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case ve:
            return w = w.get(M.key === null ? k : M.key) || null, p(m, w, M, q);
          case we:
            return w = w.get(M.key === null ? k : M.key) || null, x(m, w, M, q);
          case de:
            var oe = M._init;
            return V(w, m, k, oe(M._payload), q);
        }
        if (Hn(M) || B(M)) return w = w.get(k) || null, I(m, w, M, q, null);
        pi(m, M);
      }
      return null;
    }
    function Q(w, m, k, M) {
      for (var q = null, oe = null, ie = m, ue = m = 0, rt = null; ie !== null && ue < k.length; ue++) {
        ie.index > ue ? (rt = ie, ie = null) : rt = ie.sibling;
        var Ce = R(w, ie, k[ue], M);
        if (Ce === null) {
          ie === null && (ie = rt);
          break;
        }
        e && ie && Ce.alternate === null && t(w, ie), m = i(Ce, m, ue), oe === null ? q = Ce : oe.sibling = Ce, oe = Ce, ie = rt;
      }
      if (ue === k.length) return n(w, ie), Ue && Gn(w, ue), q;
      if (ie === null) {
        for (; ue < k.length; ue++) ie = L(w, k[ue], M), ie !== null && (m = i(ie, m, ue), oe === null ? q = ie : oe.sibling = ie, oe = ie);
        return Ue && Gn(w, ue), q;
      }
      for (ie = r(w, ie); ue < k.length; ue++) rt = V(ie, w, ue, k[ue], M), rt !== null && (e && rt.alternate !== null && ie.delete(rt.key === null ? ue : rt.key), m = i(rt, m, ue), oe === null ? q = rt : oe.sibling = rt, oe = rt);
      return e && ie.forEach(function(Un) {
        return t(w, Un);
      }), Ue && Gn(w, ue), q;
    }
    function Y(w, m, k, M) {
      var q = B(k);
      if (typeof q != "function") throw Error(s(150));
      if (k = q.call(k), k == null) throw Error(s(151));
      for (var oe = q = null, ie = m, ue = m = 0, rt = null, Ce = k.next(); ie !== null && !Ce.done; ue++, Ce = k.next()) {
        ie.index > ue ? (rt = ie, ie = null) : rt = ie.sibling;
        var Un = R(w, ie, Ce.value, M);
        if (Un === null) {
          ie === null && (ie = rt);
          break;
        }
        e && ie && Un.alternate === null && t(w, ie), m = i(Un, m, ue), oe === null ? q = Un : oe.sibling = Un, oe = Un, ie = rt;
      }
      if (Ce.done) return n(
        w,
        ie
      ), Ue && Gn(w, ue), q;
      if (ie === null) {
        for (; !Ce.done; ue++, Ce = k.next()) Ce = L(w, Ce.value, M), Ce !== null && (m = i(Ce, m, ue), oe === null ? q = Ce : oe.sibling = Ce, oe = Ce);
        return Ue && Gn(w, ue), q;
      }
      for (ie = r(w, ie); !Ce.done; ue++, Ce = k.next()) Ce = V(ie, w, ue, Ce.value, M), Ce !== null && (e && Ce.alternate !== null && ie.delete(Ce.key === null ? ue : Ce.key), m = i(Ce, m, ue), oe === null ? q = Ce : oe.sibling = Ce, oe = Ce);
      return e && ie.forEach(function(fp) {
        return t(w, fp);
      }), Ue && Gn(w, ue), q;
    }
    function qe(w, m, k, M) {
      if (typeof k == "object" && k !== null && k.type === pe && k.key === null && (k = k.props.children), typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case ve:
            e: {
              for (var q = k.key, oe = m; oe !== null; ) {
                if (oe.key === q) {
                  if (q = k.type, q === pe) {
                    if (oe.tag === 7) {
                      n(w, oe.sibling), m = o(oe, k.props.children), m.return = w, w = m;
                      break e;
                    }
                  } else if (oe.elementType === q || typeof q == "object" && q !== null && q.$$typeof === de && pu(q) === oe.type) {
                    n(w, oe.sibling), m = o(oe, k.props), m.ref = co(w, oe, k), m.return = w, w = m;
                    break e;
                  }
                  n(w, oe);
                  break;
                } else t(w, oe);
                oe = oe.sibling;
              }
              k.type === pe ? (m = ir(k.props.children, w.mode, M, k.key), m.return = w, w = m) : (M = Fi(k.type, k.key, k.props, null, w.mode, M), M.ref = co(w, m, k), M.return = w, w = M);
            }
            return u(w);
          case we:
            e: {
              for (oe = k.key; m !== null; ) {
                if (m.key === oe) if (m.tag === 4 && m.stateNode.containerInfo === k.containerInfo && m.stateNode.implementation === k.implementation) {
                  n(w, m.sibling), m = o(m, k.children || []), m.return = w, w = m;
                  break e;
                } else {
                  n(w, m);
                  break;
                }
                else t(w, m);
                m = m.sibling;
              }
              m = Is(k, w.mode, M), m.return = w, w = m;
            }
            return u(w);
          case de:
            return oe = k._init, qe(w, m, oe(k._payload), M);
        }
        if (Hn(k)) return Q(w, m, k, M);
        if (B(k)) return Y(w, m, k, M);
        pi(w, k);
      }
      return typeof k == "string" && k !== "" || typeof k == "number" ? (k = "" + k, m !== null && m.tag === 6 ? (n(w, m.sibling), m = o(m, k), m.return = w, w = m) : (n(w, m), m = zs(k, w.mode, M), m.return = w, w = m), u(w)) : n(w, m);
    }
    return qe;
  }
  var xr = hu(!0), mu = hu(!1), hi = Tn(null), mi = null, jr = null, Bl = null;
  function Vl() {
    Bl = jr = mi = null;
  }
  function Wl(e) {
    var t = hi.current;
    $e(hi), e._currentValue = t;
  }
  function Hl(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function _r(e, t) {
    mi = e, Bl = jr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (kt = !0), e.firstContext = null);
  }
  function Ot(e) {
    var t = e._currentValue;
    if (Bl !== e) if (e = { context: e, memoizedValue: t, next: null }, jr === null) {
      if (mi === null) throw Error(s(308));
      jr = e, mi.dependencies = { lanes: 0, firstContext: e };
    } else jr = jr.next = e;
    return t;
  }
  var Zn = null;
  function Ql(e) {
    Zn === null ? Zn = [e] : Zn.push(e);
  }
  function vu(e, t, n, r) {
    var o = t.interleaved;
    return o === null ? (n.next = n, Ql(t)) : (n.next = o.next, o.next = n), t.interleaved = n, fn(e, r);
  }
  function fn(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var In = !1;
  function Kl(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function yu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function pn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Ln(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (_e & 2) !== 0) {
      var o = r.pending;
      return o === null ? t.next = t : (t.next = o.next, o.next = t), r.pending = t, fn(e, n);
    }
    return o = r.interleaved, o === null ? (t.next = t, Ql(r)) : (t.next = o.next, o.next = t), r.interleaved = t, fn(e, n);
  }
  function vi(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, ll(e, n);
    }
  }
  function gu(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var o = null, i = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var u = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          i === null ? o = i = u : i = i.next = u, n = n.next;
        } while (n !== null);
        i === null ? o = i = t : i = i.next = t;
      } else o = i = t;
      n = { baseState: r.baseState, firstBaseUpdate: o, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function yi(e, t, n, r) {
    var o = e.updateQueue;
    In = !1;
    var i = o.firstBaseUpdate, u = o.lastBaseUpdate, f = o.shared.pending;
    if (f !== null) {
      o.shared.pending = null;
      var p = f, x = p.next;
      p.next = null, u === null ? i = x : u.next = x, u = p;
      var I = e.alternate;
      I !== null && (I = I.updateQueue, f = I.lastBaseUpdate, f !== u && (f === null ? I.firstBaseUpdate = x : f.next = x, I.lastBaseUpdate = p));
    }
    if (i !== null) {
      var L = o.baseState;
      u = 0, I = x = p = null, f = i;
      do {
        var R = f.lane, V = f.eventTime;
        if ((r & R) === R) {
          I !== null && (I = I.next = {
            eventTime: V,
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          });
          e: {
            var Q = e, Y = f;
            switch (R = t, V = n, Y.tag) {
              case 1:
                if (Q = Y.payload, typeof Q == "function") {
                  L = Q.call(V, L, R);
                  break e;
                }
                L = Q;
                break e;
              case 3:
                Q.flags = Q.flags & -65537 | 128;
              case 0:
                if (Q = Y.payload, R = typeof Q == "function" ? Q.call(V, L, R) : Q, R == null) break e;
                L = U({}, L, R);
                break e;
              case 2:
                In = !0;
            }
          }
          f.callback !== null && f.lane !== 0 && (e.flags |= 64, R = o.effects, R === null ? o.effects = [f] : R.push(f));
        } else V = { eventTime: V, lane: R, tag: f.tag, payload: f.payload, callback: f.callback, next: null }, I === null ? (x = I = V, p = L) : I = I.next = V, u |= R;
        if (f = f.next, f === null) {
          if (f = o.shared.pending, f === null) break;
          R = f, f = R.next, R.next = null, o.lastBaseUpdate = R, o.shared.pending = null;
        }
      } while (!0);
      if (I === null && (p = L), o.baseState = p, o.firstBaseUpdate = x, o.lastBaseUpdate = I, t = o.shared.interleaved, t !== null) {
        o = t;
        do
          u |= o.lane, o = o.next;
        while (o !== t);
      } else i === null && (o.shared.lanes = 0);
      tr |= u, e.lanes = u, e.memoizedState = L;
    }
  }
  function wu(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], o = r.callback;
      if (o !== null) {
        if (r.callback = null, r = n, typeof o != "function") throw Error(s(191, o));
        o.call(r);
      }
    }
  }
  var fo = {}, Gt = Tn(fo), po = Tn(fo), ho = Tn(fo);
  function bn(e) {
    if (e === fo) throw Error(s(174));
    return e;
  }
  function Xl(e, t) {
    switch (Oe(ho, t), Oe(po, e), Oe(Gt, fo), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Ar(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Ar(t, e);
    }
    $e(Gt), Oe(Gt, t);
  }
  function Er() {
    $e(Gt), $e(po), $e(ho);
  }
  function Su(e) {
    bn(ho.current);
    var t = bn(Gt.current), n = Ar(t, e.type);
    t !== n && (Oe(po, e), Oe(Gt, n));
  }
  function Yl(e) {
    po.current === e && ($e(Gt), $e(po));
  }
  var Ve = Tn(0);
  function gi(e) {
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
  var Jl = [];
  function ql() {
    for (var e = 0; e < Jl.length; e++) Jl[e]._workInProgressVersionPrimary = null;
    Jl.length = 0;
  }
  var wi = te.ReactCurrentDispatcher, Gl = te.ReactCurrentBatchConfig, er = 0, We = null, Ze = null, tt = null, Si = !1, mo = !1, vo = 0, Of = 0;
  function ft() {
    throw Error(s(321));
  }
  function Zl(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Ut(e[n], t[n])) return !1;
    return !0;
  }
  function bl(e, t, n, r, o, i) {
    if (er = i, We = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, wi.current = e === null || e.memoizedState === null ? $f : Df, e = n(r, o), mo) {
      i = 0;
      do {
        if (mo = !1, vo = 0, 25 <= i) throw Error(s(301));
        i += 1, tt = Ze = null, t.updateQueue = null, wi.current = Uf, e = n(r, o);
      } while (mo);
    }
    if (wi.current = ji, t = Ze !== null && Ze.next !== null, er = 0, tt = Ze = We = null, Si = !1, t) throw Error(s(300));
    return e;
  }
  function es() {
    var e = vo !== 0;
    return vo = 0, e;
  }
  function Zt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return tt === null ? We.memoizedState = tt = e : tt = tt.next = e, tt;
  }
  function Mt() {
    if (Ze === null) {
      var e = We.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ze.next;
    var t = tt === null ? We.memoizedState : tt.next;
    if (t !== null) tt = t, Ze = e;
    else {
      if (e === null) throw Error(s(310));
      Ze = e, e = { memoizedState: Ze.memoizedState, baseState: Ze.baseState, baseQueue: Ze.baseQueue, queue: Ze.queue, next: null }, tt === null ? We.memoizedState = tt = e : tt = tt.next = e;
    }
    return tt;
  }
  function yo(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ts(e) {
    var t = Mt(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = Ze, o = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (o !== null) {
        var u = o.next;
        o.next = i.next, i.next = u;
      }
      r.baseQueue = o = i, n.pending = null;
    }
    if (o !== null) {
      i = o.next, r = r.baseState;
      var f = u = null, p = null, x = i;
      do {
        var I = x.lane;
        if ((er & I) === I) p !== null && (p = p.next = { lane: 0, action: x.action, hasEagerState: x.hasEagerState, eagerState: x.eagerState, next: null }), r = x.hasEagerState ? x.eagerState : e(r, x.action);
        else {
          var L = {
            lane: I,
            action: x.action,
            hasEagerState: x.hasEagerState,
            eagerState: x.eagerState,
            next: null
          };
          p === null ? (f = p = L, u = r) : p = p.next = L, We.lanes |= I, tr |= I;
        }
        x = x.next;
      } while (x !== null && x !== i);
      p === null ? u = r : p.next = f, Ut(r, t.memoizedState) || (kt = !0), t.memoizedState = r, t.baseState = u, t.baseQueue = p, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      o = e;
      do
        i = o.lane, We.lanes |= i, tr |= i, o = o.next;
      while (o !== e);
    } else o === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function ns(e) {
    var t = Mt(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, o = n.pending, i = t.memoizedState;
    if (o !== null) {
      n.pending = null;
      var u = o = o.next;
      do
        i = e(i, u.action), u = u.next;
      while (u !== o);
      Ut(i, t.memoizedState) || (kt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function ku() {
  }
  function xu(e, t) {
    var n = We, r = Mt(), o = t(), i = !Ut(r.memoizedState, o);
    if (i && (r.memoizedState = o, kt = !0), r = r.queue, rs(Eu.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || tt !== null && tt.memoizedState.tag & 1) {
      if (n.flags |= 2048, go(9, _u.bind(null, n, r, o, t), void 0, null), nt === null) throw Error(s(349));
      (er & 30) !== 0 || ju(n, t, o);
    }
    return o;
  }
  function ju(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = We.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, We.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function _u(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Cu(t) && Pu(e);
  }
  function Eu(e, t, n) {
    return n(function() {
      Cu(t) && Pu(e);
    });
  }
  function Cu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Ut(e, n);
    } catch {
      return !0;
    }
  }
  function Pu(e) {
    var t = fn(e, 1);
    t !== null && Qt(t, e, 1, -1);
  }
  function Nu(e) {
    var t = Zt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: yo, lastRenderedState: e }, t.queue = e, e = e.dispatch = Ff.bind(null, We, e), [t.memoizedState, e];
  }
  function go(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = We.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, We.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Tu() {
    return Mt().memoizedState;
  }
  function ki(e, t, n, r) {
    var o = Zt();
    We.flags |= e, o.memoizedState = go(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function xi(e, t, n, r) {
    var o = Mt();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (Ze !== null) {
      var u = Ze.memoizedState;
      if (i = u.destroy, r !== null && Zl(r, u.deps)) {
        o.memoizedState = go(t, n, i, r);
        return;
      }
    }
    We.flags |= e, o.memoizedState = go(1 | t, n, i, r);
  }
  function Ru(e, t) {
    return ki(8390656, 8, e, t);
  }
  function rs(e, t) {
    return xi(2048, 8, e, t);
  }
  function zu(e, t) {
    return xi(4, 2, e, t);
  }
  function Iu(e, t) {
    return xi(4, 4, e, t);
  }
  function Lu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Ou(e, t, n) {
    return n = n != null ? n.concat([e]) : null, xi(4, 4, Lu.bind(null, t, e), n);
  }
  function os() {
  }
  function Mu(e, t) {
    var n = Mt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Zl(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Au(e, t) {
    var n = Mt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Zl(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Fu(e, t, n) {
    return (er & 21) === 0 ? (e.baseState && (e.baseState = !1, kt = !0), e.memoizedState = n) : (Ut(n, t) || (n = pa(), We.lanes |= n, tr |= n, e.baseState = !0), t);
  }
  function Mf(e, t) {
    var n = Re;
    Re = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Gl.transition;
    Gl.transition = {};
    try {
      e(!1), t();
    } finally {
      Re = n, Gl.transition = r;
    }
  }
  function $u() {
    return Mt().memoizedState;
  }
  function Af(e, t, n) {
    var r = Fn(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Du(e)) Uu(t, n);
    else if (n = vu(e, t, n, r), n !== null) {
      var o = yt();
      Qt(n, e, r, o), Bu(n, t, r);
    }
  }
  function Ff(e, t, n) {
    var r = Fn(e), o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Du(e)) Uu(t, o);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var u = t.lastRenderedState, f = i(u, n);
        if (o.hasEagerState = !0, o.eagerState = f, Ut(f, u)) {
          var p = t.interleaved;
          p === null ? (o.next = o, Ql(t)) : (o.next = p.next, p.next = o), t.interleaved = o;
          return;
        }
      } catch {
      } finally {
      }
      n = vu(e, t, o, r), n !== null && (o = yt(), Qt(n, e, r, o), Bu(n, t, r));
    }
  }
  function Du(e) {
    var t = e.alternate;
    return e === We || t !== null && t === We;
  }
  function Uu(e, t) {
    mo = Si = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Bu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, ll(e, n);
    }
  }
  var ji = { readContext: Ot, useCallback: ft, useContext: ft, useEffect: ft, useImperativeHandle: ft, useInsertionEffect: ft, useLayoutEffect: ft, useMemo: ft, useReducer: ft, useRef: ft, useState: ft, useDebugValue: ft, useDeferredValue: ft, useTransition: ft, useMutableSource: ft, useSyncExternalStore: ft, useId: ft, unstable_isNewReconciler: !1 }, $f = { readContext: Ot, useCallback: function(e, t) {
    return Zt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: Ot, useEffect: Ru, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, ki(
      4194308,
      4,
      Lu.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return ki(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return ki(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Zt();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Zt();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Af.bind(null, We, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Zt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Nu, useDebugValue: os, useDeferredValue: function(e) {
    return Zt().memoizedState = e;
  }, useTransition: function() {
    var e = Nu(!1), t = e[0];
    return e = Mf.bind(null, e[1]), Zt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = We, o = Zt();
    if (Ue) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), nt === null) throw Error(s(349));
      (er & 30) !== 0 || ju(r, t, n);
    }
    o.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return o.queue = i, Ru(Eu.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, go(9, _u.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Zt(), t = nt.identifierPrefix;
    if (Ue) {
      var n = dn, r = cn;
      n = (r & ~(1 << 32 - Dt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = vo++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Of++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Df = {
    readContext: Ot,
    useCallback: Mu,
    useContext: Ot,
    useEffect: rs,
    useImperativeHandle: Ou,
    useInsertionEffect: zu,
    useLayoutEffect: Iu,
    useMemo: Au,
    useReducer: ts,
    useRef: Tu,
    useState: function() {
      return ts(yo);
    },
    useDebugValue: os,
    useDeferredValue: function(e) {
      var t = Mt();
      return Fu(t, Ze.memoizedState, e);
    },
    useTransition: function() {
      var e = ts(yo)[0], t = Mt().memoizedState;
      return [e, t];
    },
    useMutableSource: ku,
    useSyncExternalStore: xu,
    useId: $u,
    unstable_isNewReconciler: !1
  }, Uf = { readContext: Ot, useCallback: Mu, useContext: Ot, useEffect: rs, useImperativeHandle: Ou, useInsertionEffect: zu, useLayoutEffect: Iu, useMemo: Au, useReducer: ns, useRef: Tu, useState: function() {
    return ns(yo);
  }, useDebugValue: os, useDeferredValue: function(e) {
    var t = Mt();
    return Ze === null ? t.memoizedState = e : Fu(t, Ze.memoizedState, e);
  }, useTransition: function() {
    var e = ns(yo)[0], t = Mt().memoizedState;
    return [e, t];
  }, useMutableSource: ku, useSyncExternalStore: xu, useId: $u, unstable_isNewReconciler: !1 };
  function Vt(e, t) {
    if (e && e.defaultProps) {
      t = U({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function is(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : U({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var _i = { isMounted: function(e) {
    return (e = e._reactInternals) ? Qe(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = yt(), o = Fn(e), i = pn(r, o);
    i.payload = t, n != null && (i.callback = n), t = Ln(e, i, o), t !== null && (Qt(t, e, o, r), vi(t, e, o));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = yt(), o = Fn(e), i = pn(r, o);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ln(e, i, o), t !== null && (Qt(t, e, o, r), vi(t, e, o));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = yt(), r = Fn(e), o = pn(n, r);
    o.tag = 2, t != null && (o.callback = t), t = Ln(e, o, r), t !== null && (Qt(t, e, r, n), vi(t, e, r));
  } };
  function Vu(e, t, n, r, o, i, u) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, u) : t.prototype && t.prototype.isPureReactComponent ? !ro(n, r) || !ro(o, i) : !0;
  }
  function Wu(e, t, n) {
    var r = !1, o = Rn, i = t.contextType;
    return typeof i == "object" && i !== null ? i = Ot(i) : (o = St(t) ? Jn : dt.current, r = t.contextTypes, i = (r = r != null) ? gr(e, o) : Rn), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = _i, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Hu(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && _i.enqueueReplaceState(t, t.state, null);
  }
  function ls(e, t, n, r) {
    var o = e.stateNode;
    o.props = n, o.state = e.memoizedState, o.refs = {}, Kl(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? o.context = Ot(i) : (i = St(t) ? Jn : dt.current, o.context = gr(e, i)), o.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (is(e, t, i, n), o.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (t = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), t !== o.state && _i.enqueueReplaceState(o, o.state, null), yi(e, n, o, r), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Cr(e, t) {
    try {
      var n = "", r = t;
      do
        n += G(r), r = r.return;
      while (r);
      var o = n;
    } catch (i) {
      o = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: o, digest: null };
  }
  function ss(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function as(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Bf = typeof WeakMap == "function" ? WeakMap : Map;
  function Qu(e, t, n) {
    n = pn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      zi || (zi = !0, js = r), as(e, t);
    }, n;
  }
  function Ku(e, t, n) {
    n = pn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var o = t.value;
      n.payload = function() {
        return r(o);
      }, n.callback = function() {
        as(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      as(e, t), typeof r != "function" && (Mn === null ? Mn = /* @__PURE__ */ new Set([this]) : Mn.add(this));
      var u = t.stack;
      this.componentDidCatch(t.value, { componentStack: u !== null ? u : "" });
    }), n;
  }
  function Xu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Bf();
      var o = /* @__PURE__ */ new Set();
      r.set(t, o);
    } else o = r.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), r.set(t, o));
    o.has(n) || (o.add(n), e = tp.bind(null, e, t, n), t.then(e, e));
  }
  function Yu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Ju(e, t, n, r, o) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = pn(-1, 1), t.tag = 2, Ln(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = o, e);
  }
  var Vf = te.ReactCurrentOwner, kt = !1;
  function vt(e, t, n, r) {
    t.child = e === null ? mu(t, null, n, r) : xr(t, e.child, n, r);
  }
  function qu(e, t, n, r, o) {
    n = n.render;
    var i = t.ref;
    return _r(t, o), r = bl(e, t, n, r, i, o), n = es(), e !== null && !kt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, hn(e, t, o)) : (Ue && n && Al(t), t.flags |= 1, vt(e, t, r, o), t.child);
  }
  function Gu(e, t, n, r, o) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Rs(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Zu(e, t, i, r, o)) : (e = Fi(n.type, null, r, t, t.mode, o), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & o) === 0) {
      var u = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ro, n(u, r) && e.ref === t.ref) return hn(e, t, o);
    }
    return t.flags |= 1, e = Dn(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Zu(e, t, n, r, o) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (ro(i, r) && e.ref === t.ref) if (kt = !1, t.pendingProps = r = i, (e.lanes & o) !== 0) (e.flags & 131072) !== 0 && (kt = !0);
      else return t.lanes = e.lanes, hn(e, t, o);
    }
    return us(e, t, n, r, o);
  }
  function bu(e, t, n) {
    var r = t.pendingProps, o = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Oe(Nr, Nt), Nt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Oe(Nr, Nt), Nt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, Oe(Nr, Nt), Nt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, Oe(Nr, Nt), Nt |= r;
    return vt(e, t, o, n), t.child;
  }
  function ec(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function us(e, t, n, r, o) {
    var i = St(n) ? Jn : dt.current;
    return i = gr(t, i), _r(t, o), n = bl(e, t, n, r, i, o), r = es(), e !== null && !kt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, hn(e, t, o)) : (Ue && r && Al(t), t.flags |= 1, vt(e, t, n, o), t.child);
  }
  function tc(e, t, n, r, o) {
    if (St(n)) {
      var i = !0;
      ai(t);
    } else i = !1;
    if (_r(t, o), t.stateNode === null) Ci(e, t), Wu(t, n, r), ls(t, n, r, o), r = !0;
    else if (e === null) {
      var u = t.stateNode, f = t.memoizedProps;
      u.props = f;
      var p = u.context, x = n.contextType;
      typeof x == "object" && x !== null ? x = Ot(x) : (x = St(n) ? Jn : dt.current, x = gr(t, x));
      var I = n.getDerivedStateFromProps, L = typeof I == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      L || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f !== r || p !== x) && Hu(t, u, r, x), In = !1;
      var R = t.memoizedState;
      u.state = R, yi(t, r, u, o), p = t.memoizedState, f !== r || R !== p || wt.current || In ? (typeof I == "function" && (is(t, n, I, r), p = t.memoizedState), (f = In || Vu(t, n, f, r, R, p, x)) ? (L || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = p), u.props = r, u.state = p, u.context = x, r = f) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      u = t.stateNode, yu(e, t), f = t.memoizedProps, x = t.type === t.elementType ? f : Vt(t.type, f), u.props = x, L = t.pendingProps, R = u.context, p = n.contextType, typeof p == "object" && p !== null ? p = Ot(p) : (p = St(n) ? Jn : dt.current, p = gr(t, p));
      var V = n.getDerivedStateFromProps;
      (I = typeof V == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f !== L || R !== p) && Hu(t, u, r, p), In = !1, R = t.memoizedState, u.state = R, yi(t, r, u, o);
      var Q = t.memoizedState;
      f !== L || R !== Q || wt.current || In ? (typeof V == "function" && (is(t, n, V, r), Q = t.memoizedState), (x = In || Vu(t, n, x, r, R, Q, p) || !1) ? (I || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(r, Q, p), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(r, Q, p)), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || f === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = Q), u.props = r, u.state = Q, u.context = p, r = x) : (typeof u.componentDidUpdate != "function" || f === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return cs(e, t, n, r, i, o);
  }
  function cs(e, t, n, r, o, i) {
    ec(e, t);
    var u = (t.flags & 128) !== 0;
    if (!r && !u) return o && lu(t, n, !1), hn(e, t, i);
    r = t.stateNode, Vf.current = t;
    var f = u && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && u ? (t.child = xr(t, e.child, null, i), t.child = xr(t, null, f, i)) : vt(e, t, f, i), t.memoizedState = r.state, o && lu(t, n, !0), t.child;
  }
  function nc(e) {
    var t = e.stateNode;
    t.pendingContext ? ou(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ou(e, t.context, !1), Xl(e, t.containerInfo);
  }
  function rc(e, t, n, r, o) {
    return kr(), Ul(o), t.flags |= 256, vt(e, t, n, r), t.child;
  }
  var ds = { dehydrated: null, treeContext: null, retryLane: 0 };
  function fs(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function oc(e, t, n) {
    var r = t.pendingProps, o = Ve.current, i = !1, u = (t.flags & 128) !== 0, f;
    if ((f = u) || (f = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0), f ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (o |= 1), Oe(Ve, o & 1), e === null)
      return Dl(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (u = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, u = { mode: "hidden", children: u }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = u) : i = $i(u, r, 0, null), e = ir(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = fs(n), t.memoizedState = ds, e) : ps(t, u));
    if (o = e.memoizedState, o !== null && (f = o.dehydrated, f !== null)) return Wf(e, t, u, r, f, o, n);
    if (i) {
      i = r.fallback, u = t.mode, o = e.child, f = o.sibling;
      var p = { mode: "hidden", children: r.children };
      return (u & 1) === 0 && t.child !== o ? (r = t.child, r.childLanes = 0, r.pendingProps = p, t.deletions = null) : (r = Dn(o, p), r.subtreeFlags = o.subtreeFlags & 14680064), f !== null ? i = Dn(f, i) : (i = ir(i, u, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, u = e.child.memoizedState, u = u === null ? fs(n) : { baseLanes: u.baseLanes | n, cachePool: null, transitions: u.transitions }, i.memoizedState = u, i.childLanes = e.childLanes & ~n, t.memoizedState = ds, r;
    }
    return i = e.child, e = i.sibling, r = Dn(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ps(e, t) {
    return t = $i({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Ei(e, t, n, r) {
    return r !== null && Ul(r), xr(t, e.child, null, n), e = ps(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Wf(e, t, n, r, o, i, u) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ss(Error(s(422))), Ei(e, t, u, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, o = t.mode, r = $i({ mode: "visible", children: r.children }, o, 0, null), i = ir(i, o, u, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && xr(t, e.child, null, u), t.child.memoizedState = fs(u), t.memoizedState = ds, i);
    if ((t.mode & 1) === 0) return Ei(e, t, u, null);
    if (o.data === "$!") {
      if (r = o.nextSibling && o.nextSibling.dataset, r) var f = r.dgst;
      return r = f, i = Error(s(419)), r = ss(i, r, void 0), Ei(e, t, u, r);
    }
    if (f = (u & e.childLanes) !== 0, kt || f) {
      if (r = nt, r !== null) {
        switch (u & -u) {
          case 4:
            o = 2;
            break;
          case 16:
            o = 8;
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
            o = 32;
            break;
          case 536870912:
            o = 268435456;
            break;
          default:
            o = 0;
        }
        o = (o & (r.suspendedLanes | u)) !== 0 ? 0 : o, o !== 0 && o !== i.retryLane && (i.retryLane = o, fn(e, o), Qt(r, e, o, -1));
      }
      return Ts(), r = ss(Error(s(421))), Ei(e, t, u, r);
    }
    return o.data === "$?" ? (t.flags |= 128, t.child = e.child, t = np.bind(null, e), o._reactRetry = t, null) : (e = i.treeContext, Pt = Nn(o.nextSibling), Ct = t, Ue = !0, Bt = null, e !== null && (It[Lt++] = cn, It[Lt++] = dn, It[Lt++] = qn, cn = e.id, dn = e.overflow, qn = t), t = ps(t, r.children), t.flags |= 4096, t);
  }
  function ic(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Hl(e.return, t, n);
  }
  function hs(e, t, n, r, o) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: o } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = o);
  }
  function lc(e, t, n) {
    var r = t.pendingProps, o = r.revealOrder, i = r.tail;
    if (vt(e, t, r.children, n), r = Ve.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ic(e, n, t);
        else if (e.tag === 19) ic(e, n, t);
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
    if (Oe(Ve, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; ) e = n.alternate, e !== null && gi(e) === null && (o = n), n = n.sibling;
        n = o, n === null ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null), hs(t, !1, o, n, i);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (e = o.alternate, e !== null && gi(e) === null) {
            t.child = o;
            break;
          }
          e = o.sibling, o.sibling = n, n = o, o = e;
        }
        hs(t, !0, n, null, i);
        break;
      case "together":
        hs(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Ci(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function hn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), tr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = Dn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Dn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Hf(e, t, n) {
    switch (t.tag) {
      case 3:
        nc(t), kr();
        break;
      case 5:
        Su(t);
        break;
      case 1:
        St(t.type) && ai(t);
        break;
      case 4:
        Xl(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, o = t.memoizedProps.value;
        Oe(hi, r._currentValue), r._currentValue = o;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (Oe(Ve, Ve.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? oc(e, t, n) : (Oe(Ve, Ve.current & 1), e = hn(e, t, n), e !== null ? e.sibling : null);
        Oe(Ve, Ve.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return lc(e, t, n);
          t.flags |= 128;
        }
        if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Oe(Ve, Ve.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, bu(e, t, n);
    }
    return hn(e, t, n);
  }
  var sc, ms, ac, uc;
  sc = function(e, t) {
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
  }, ms = function() {
  }, ac = function(e, t, n, r) {
    var o = e.memoizedProps;
    if (o !== r) {
      e = t.stateNode, bn(Gt.current);
      var i = null;
      switch (n) {
        case "input":
          o = ln(e, o), r = ln(e, r), i = [];
          break;
        case "select":
          o = U({}, o, { value: void 0 }), r = U({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          o = wn(e, o), r = wn(e, r), i = [];
          break;
        default:
          typeof o.onClick != "function" && typeof r.onClick == "function" && (e.onclick = ii);
      }
      $r(n, r);
      var u;
      n = null;
      for (x in o) if (!r.hasOwnProperty(x) && o.hasOwnProperty(x) && o[x] != null) if (x === "style") {
        var f = o[x];
        for (u in f) f.hasOwnProperty(u) && (n || (n = {}), n[u] = "");
      } else x !== "dangerouslySetInnerHTML" && x !== "children" && x !== "suppressContentEditableWarning" && x !== "suppressHydrationWarning" && x !== "autoFocus" && (y.hasOwnProperty(x) ? i || (i = []) : (i = i || []).push(x, null));
      for (x in r) {
        var p = r[x];
        if (f = o != null ? o[x] : void 0, r.hasOwnProperty(x) && p !== f && (p != null || f != null)) if (x === "style") if (f) {
          for (u in f) !f.hasOwnProperty(u) || p && p.hasOwnProperty(u) || (n || (n = {}), n[u] = "");
          for (u in p) p.hasOwnProperty(u) && f[u] !== p[u] && (n || (n = {}), n[u] = p[u]);
        } else n || (i || (i = []), i.push(
          x,
          n
        )), n = p;
        else x === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, f = f ? f.__html : void 0, p != null && f !== p && (i = i || []).push(x, p)) : x === "children" ? typeof p != "string" && typeof p != "number" || (i = i || []).push(x, "" + p) : x !== "suppressContentEditableWarning" && x !== "suppressHydrationWarning" && (y.hasOwnProperty(x) ? (p != null && x === "onScroll" && Fe("scroll", e), i || f === p || (i = [])) : (i = i || []).push(x, p));
      }
      n && (i = i || []).push("style", n);
      var x = i;
      (t.updateQueue = x) && (t.flags |= 4);
    }
  }, uc = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function wo(e, t) {
    if (!Ue) switch (e.tailMode) {
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
  function pt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags & 14680064, r |= o.flags & 14680064, o.return = e, o = o.sibling;
    else for (o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, o.return = e, o = o.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Qf(e, t, n) {
    var r = t.pendingProps;
    switch (Fl(t), t.tag) {
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
        return pt(t), null;
      case 1:
        return St(t.type) && si(), pt(t), null;
      case 3:
        return r = t.stateNode, Er(), $e(wt), $e(dt), ql(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (fi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Bt !== null && (Cs(Bt), Bt = null))), ms(e, t), pt(t), null;
      case 5:
        Yl(t);
        var o = bn(ho.current);
        if (n = t.type, e !== null && t.stateNode != null) ac(e, t, n, r, o), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(s(166));
            return pt(t), null;
          }
          if (e = bn(Gt.current), fi(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[qt] = t, r[ao] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                Fe("cancel", r), Fe("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                Fe("load", r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < io.length; o++) Fe(io[o], r);
                break;
              case "source":
                Fe("error", r);
                break;
              case "img":
              case "image":
              case "link":
                Fe(
                  "error",
                  r
                ), Fe("load", r);
                break;
              case "details":
                Fe("toggle", r);
                break;
              case "input":
                Ir(r, i), Fe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, Fe("invalid", r);
                break;
              case "textarea":
                Mo(r, i), Fe("invalid", r);
            }
            $r(n, i), o = null;
            for (var u in i) if (i.hasOwnProperty(u)) {
              var f = i[u];
              u === "children" ? typeof f == "string" ? r.textContent !== f && (i.suppressHydrationWarning !== !0 && oi(r.textContent, f, e), o = ["children", f]) : typeof f == "number" && r.textContent !== "" + f && (i.suppressHydrationWarning !== !0 && oi(
                r.textContent,
                f,
                e
              ), o = ["children", "" + f]) : y.hasOwnProperty(u) && f != null && u === "onScroll" && Fe("scroll", r);
            }
            switch (n) {
              case "input":
                ut(r), Oo(r, i, !0);
                break;
              case "textarea":
                ut(r), Ao(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = ii);
            }
            r = o, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            u = o.nodeType === 9 ? o : o.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Fo(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = u.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = u.createElement(n, { is: r.is }) : (e = u.createElement(n), n === "select" && (u = e, r.multiple ? u.multiple = !0 : r.size && (u.size = r.size))) : e = u.createElementNS(e, n), e[qt] = t, e[ao] = r, sc(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (u = Dr(n, r), n) {
                case "dialog":
                  Fe("cancel", e), Fe("close", e), o = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Fe("load", e), o = r;
                  break;
                case "video":
                case "audio":
                  for (o = 0; o < io.length; o++) Fe(io[o], e);
                  o = r;
                  break;
                case "source":
                  Fe("error", e), o = r;
                  break;
                case "img":
                case "image":
                case "link":
                  Fe(
                    "error",
                    e
                  ), Fe("load", e), o = r;
                  break;
                case "details":
                  Fe("toggle", e), o = r;
                  break;
                case "input":
                  Ir(e, r), o = ln(e, r), Fe("invalid", e);
                  break;
                case "option":
                  o = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, o = U({}, r, { value: void 0 }), Fe("invalid", e);
                  break;
                case "textarea":
                  Mo(e, r), o = wn(e, r), Fe("invalid", e);
                  break;
                default:
                  o = r;
              }
              $r(n, o), f = o;
              for (i in f) if (f.hasOwnProperty(i)) {
                var p = f[i];
                i === "style" ? $o(e, p) : i === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && sr(e, p)) : i === "children" ? typeof p == "string" ? (n !== "textarea" || p !== "") && Qn(e, p) : typeof p == "number" && Qn(e, "" + p) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (y.hasOwnProperty(i) ? p != null && i === "onScroll" && Fe("scroll", e) : p != null && T(e, i, p, u));
              }
              switch (n) {
                case "input":
                  ut(e), Oo(e, r, !1);
                  break;
                case "textarea":
                  ut(e), Ao(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + he(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? gn(e, !!r.multiple, i, !1) : r.defaultValue != null && gn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof o.onClick == "function" && (e.onclick = ii);
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
        return pt(t), null;
      case 6:
        if (e && t.stateNode != null) uc(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
          if (n = bn(ho.current), bn(Gt.current), fi(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[qt] = t, (i = r.nodeValue !== n) && (e = Ct, e !== null)) switch (e.tag) {
              case 3:
                oi(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && oi(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[qt] = t, t.stateNode = r;
        }
        return pt(t), null;
      case 13:
        if ($e(Ve), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Ue && Pt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) fu(), kr(), t.flags |= 98560, i = !1;
          else if (i = fi(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(s(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(s(317));
              i[qt] = t;
            } else kr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            pt(t), i = !1;
          } else Bt !== null && (Cs(Bt), Bt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Ve.current & 1) !== 0 ? be === 0 && (be = 3) : Ts())), t.updateQueue !== null && (t.flags |= 4), pt(t), null);
      case 4:
        return Er(), ms(e, t), e === null && lo(t.stateNode.containerInfo), pt(t), null;
      case 10:
        return Wl(t.type._context), pt(t), null;
      case 17:
        return St(t.type) && si(), pt(t), null;
      case 19:
        if ($e(Ve), i = t.memoizedState, i === null) return pt(t), null;
        if (r = (t.flags & 128) !== 0, u = i.rendering, u === null) if (r) wo(i, !1);
        else {
          if (be !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (u = gi(e), u !== null) {
              for (t.flags |= 128, wo(i, !1), r = u.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, u = i.alternate, u === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = u.childLanes, i.lanes = u.lanes, i.child = u.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = u.memoizedProps, i.memoizedState = u.memoizedState, i.updateQueue = u.updateQueue, i.type = u.type, e = u.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return Oe(Ve, Ve.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && Je() > Tr && (t.flags |= 128, r = !0, wo(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = gi(u), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wo(i, !0), i.tail === null && i.tailMode === "hidden" && !u.alternate && !Ue) return pt(t), null;
          } else 2 * Je() - i.renderingStartTime > Tr && n !== 1073741824 && (t.flags |= 128, r = !0, wo(i, !1), t.lanes = 4194304);
          i.isBackwards ? (u.sibling = t.child, t.child = u) : (n = i.last, n !== null ? n.sibling = u : t.child = u, i.last = u);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Je(), t.sibling = null, n = Ve.current, Oe(Ve, r ? n & 1 | 2 : n & 1), t) : (pt(t), null);
      case 22:
      case 23:
        return Ns(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Nt & 1073741824) !== 0 && (pt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : pt(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Kf(e, t) {
    switch (Fl(t), t.tag) {
      case 1:
        return St(t.type) && si(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Er(), $e(wt), $e(dt), ql(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Yl(t), null;
      case 13:
        if ($e(Ve), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          kr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return $e(Ve), null;
      case 4:
        return Er(), null;
      case 10:
        return Wl(t.type._context), null;
      case 22:
      case 23:
        return Ns(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Pi = !1, ht = !1, Xf = typeof WeakSet == "function" ? WeakSet : Set, W = null;
  function Pr(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ke(e, t, r);
    }
    else n.current = null;
  }
  function vs(e, t, n) {
    try {
      n();
    } catch (r) {
      Ke(e, t, r);
    }
  }
  var cc = !1;
  function Yf(e, t) {
    if (Nl = Xo, e = Va(), Sl(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var o = r.anchorOffset, i = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, i.nodeType;
          } catch {
            n = null;
            break e;
          }
          var u = 0, f = -1, p = -1, x = 0, I = 0, L = e, R = null;
          t: for (; ; ) {
            for (var V; L !== n || o !== 0 && L.nodeType !== 3 || (f = u + o), L !== i || r !== 0 && L.nodeType !== 3 || (p = u + r), L.nodeType === 3 && (u += L.nodeValue.length), (V = L.firstChild) !== null; )
              R = L, L = V;
            for (; ; ) {
              if (L === e) break t;
              if (R === n && ++x === o && (f = u), R === i && ++I === r && (p = u), (V = L.nextSibling) !== null) break;
              L = R, R = L.parentNode;
            }
            L = V;
          }
          n = f === -1 || p === -1 ? null : { start: f, end: p };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Tl = { focusedElem: e, selectionRange: n }, Xo = !1, W = t; W !== null; ) if (t = W, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, W = e;
    else for (; W !== null; ) {
      t = W;
      try {
        var Q = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Q !== null) {
              var Y = Q.memoizedProps, qe = Q.memoizedState, w = t.stateNode, m = w.getSnapshotBeforeUpdate(t.elementType === t.type ? Y : Vt(t.type, Y), qe);
              w.__reactInternalSnapshotBeforeUpdate = m;
            }
            break;
          case 3:
            var k = t.stateNode.containerInfo;
            k.nodeType === 1 ? k.textContent = "" : k.nodeType === 9 && k.documentElement && k.removeChild(k.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(s(163));
        }
      } catch (M) {
        Ke(t, t.return, M);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, W = e;
        break;
      }
      W = t.return;
    }
    return Q = cc, cc = !1, Q;
  }
  function So(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & e) === e) {
          var i = o.destroy;
          o.destroy = void 0, i !== void 0 && vs(t, n, i);
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function Ni(e, t) {
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
  function ys(e) {
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
  function dc(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, dc(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[qt], delete t[ao], delete t[Ll], delete t[Rf], delete t[zf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function fc(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function pc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || fc(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function gs(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ii));
    else if (r !== 4 && (e = e.child, e !== null)) for (gs(e, t, n), e = e.sibling; e !== null; ) gs(e, t, n), e = e.sibling;
  }
  function ws(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (ws(e, t, n), e = e.sibling; e !== null; ) ws(e, t, n), e = e.sibling;
  }
  var lt = null, Wt = !1;
  function On(e, t, n) {
    for (n = n.child; n !== null; ) hc(e, t, n), n = n.sibling;
  }
  function hc(e, t, n) {
    if (Jt && typeof Jt.onCommitFiberUnmount == "function") try {
      Jt.onCommitFiberUnmount(Bo, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        ht || Pr(n, t);
      case 6:
        var r = lt, o = Wt;
        lt = null, On(e, t, n), lt = r, Wt = o, lt !== null && (Wt ? (e = lt, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : lt.removeChild(n.stateNode));
        break;
      case 18:
        lt !== null && (Wt ? (e = lt, n = n.stateNode, e.nodeType === 8 ? Il(e.parentNode, n) : e.nodeType === 1 && Il(e, n), Gr(e)) : Il(lt, n.stateNode));
        break;
      case 4:
        r = lt, o = Wt, lt = n.stateNode.containerInfo, Wt = !0, On(e, t, n), lt = r, Wt = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!ht && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          o = r = r.next;
          do {
            var i = o, u = i.destroy;
            i = i.tag, u !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && vs(n, t, u), o = o.next;
          } while (o !== r);
        }
        On(e, t, n);
        break;
      case 1:
        if (!ht && (Pr(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (f) {
          Ke(n, t, f);
        }
        On(e, t, n);
        break;
      case 21:
        On(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (ht = (r = ht) || n.memoizedState !== null, On(e, t, n), ht = r) : On(e, t, n);
        break;
      default:
        On(e, t, n);
    }
  }
  function mc(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Xf()), t.forEach(function(r) {
        var o = rp.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      });
    }
  }
  function Ht(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var i = e, u = t, f = u;
        e: for (; f !== null; ) {
          switch (f.tag) {
            case 5:
              lt = f.stateNode, Wt = !1;
              break e;
            case 3:
              lt = f.stateNode.containerInfo, Wt = !0;
              break e;
            case 4:
              lt = f.stateNode.containerInfo, Wt = !0;
              break e;
          }
          f = f.return;
        }
        if (lt === null) throw Error(s(160));
        hc(i, u, o), lt = null, Wt = !1;
        var p = o.alternate;
        p !== null && (p.return = null), o.return = null;
      } catch (x) {
        Ke(o, t, x);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) vc(t, e), t = t.sibling;
  }
  function vc(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Ht(t, e), bt(e), r & 4) {
          try {
            So(3, e, e.return), Ni(3, e);
          } catch (Y) {
            Ke(e, e.return, Y);
          }
          try {
            So(5, e, e.return);
          } catch (Y) {
            Ke(e, e.return, Y);
          }
        }
        break;
      case 1:
        Ht(t, e), bt(e), r & 512 && n !== null && Pr(n, n.return);
        break;
      case 5:
        if (Ht(t, e), bt(e), r & 512 && n !== null && Pr(n, n.return), e.flags & 32) {
          var o = e.stateNode;
          try {
            Qn(o, "");
          } catch (Y) {
            Ke(e, e.return, Y);
          }
        }
        if (r & 4 && (o = e.stateNode, o != null)) {
          var i = e.memoizedProps, u = n !== null ? n.memoizedProps : i, f = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            f === "input" && i.type === "radio" && i.name != null && Lo(o, i), Dr(f, u);
            var x = Dr(f, i);
            for (u = 0; u < p.length; u += 2) {
              var I = p[u], L = p[u + 1];
              I === "style" ? $o(o, L) : I === "dangerouslySetInnerHTML" ? sr(o, L) : I === "children" ? Qn(o, L) : T(o, I, L, x);
            }
            switch (f) {
              case "input":
                Lr(o, i);
                break;
              case "textarea":
                Mr(o, i);
                break;
              case "select":
                var R = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!i.multiple;
                var V = i.value;
                V != null ? gn(o, !!i.multiple, V, !1) : R !== !!i.multiple && (i.defaultValue != null ? gn(
                  o,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : gn(o, !!i.multiple, i.multiple ? [] : "", !1));
            }
            o[ao] = i;
          } catch (Y) {
            Ke(e, e.return, Y);
          }
        }
        break;
      case 6:
        if (Ht(t, e), bt(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          o = e.stateNode, i = e.memoizedProps;
          try {
            o.nodeValue = i;
          } catch (Y) {
            Ke(e, e.return, Y);
          }
        }
        break;
      case 3:
        if (Ht(t, e), bt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          Gr(t.containerInfo);
        } catch (Y) {
          Ke(e, e.return, Y);
        }
        break;
      case 4:
        Ht(t, e), bt(e);
        break;
      case 13:
        Ht(t, e), bt(e), o = e.child, o.flags & 8192 && (i = o.memoizedState !== null, o.stateNode.isHidden = i, !i || o.alternate !== null && o.alternate.memoizedState !== null || (xs = Je())), r & 4 && mc(e);
        break;
      case 22:
        if (I = n !== null && n.memoizedState !== null, e.mode & 1 ? (ht = (x = ht) || I, Ht(t, e), ht = x) : Ht(t, e), bt(e), r & 8192) {
          if (x = e.memoizedState !== null, (e.stateNode.isHidden = x) && !I && (e.mode & 1) !== 0) for (W = e, I = e.child; I !== null; ) {
            for (L = W = I; W !== null; ) {
              switch (R = W, V = R.child, R.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  So(4, R, R.return);
                  break;
                case 1:
                  Pr(R, R.return);
                  var Q = R.stateNode;
                  if (typeof Q.componentWillUnmount == "function") {
                    r = R, n = R.return;
                    try {
                      t = r, Q.props = t.memoizedProps, Q.state = t.memoizedState, Q.componentWillUnmount();
                    } catch (Y) {
                      Ke(r, n, Y);
                    }
                  }
                  break;
                case 5:
                  Pr(R, R.return);
                  break;
                case 22:
                  if (R.memoizedState !== null) {
                    wc(L);
                    continue;
                  }
              }
              V !== null ? (V.return = R, W = V) : wc(L);
            }
            I = I.sibling;
          }
          e: for (I = null, L = e; ; ) {
            if (L.tag === 5) {
              if (I === null) {
                I = L;
                try {
                  o = L.stateNode, x ? (i = o.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (f = L.stateNode, p = L.memoizedProps.style, u = p != null && p.hasOwnProperty("display") ? p.display : null, f.style.display = Fr("display", u));
                } catch (Y) {
                  Ke(e, e.return, Y);
                }
              }
            } else if (L.tag === 6) {
              if (I === null) try {
                L.stateNode.nodeValue = x ? "" : L.memoizedProps;
              } catch (Y) {
                Ke(e, e.return, Y);
              }
            } else if ((L.tag !== 22 && L.tag !== 23 || L.memoizedState === null || L === e) && L.child !== null) {
              L.child.return = L, L = L.child;
              continue;
            }
            if (L === e) break e;
            for (; L.sibling === null; ) {
              if (L.return === null || L.return === e) break e;
              I === L && (I = null), L = L.return;
            }
            I === L && (I = null), L.sibling.return = L.return, L = L.sibling;
          }
        }
        break;
      case 19:
        Ht(t, e), bt(e), r & 4 && mc(e);
        break;
      case 21:
        break;
      default:
        Ht(
          t,
          e
        ), bt(e);
    }
  }
  function bt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (fc(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(s(160));
        }
        switch (r.tag) {
          case 5:
            var o = r.stateNode;
            r.flags & 32 && (Qn(o, ""), r.flags &= -33);
            var i = pc(e);
            ws(e, i, o);
            break;
          case 3:
          case 4:
            var u = r.stateNode.containerInfo, f = pc(e);
            gs(e, f, u);
            break;
          default:
            throw Error(s(161));
        }
      } catch (p) {
        Ke(e, e.return, p);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Jf(e, t, n) {
    W = e, yc(e);
  }
  function yc(e, t, n) {
    for (var r = (e.mode & 1) !== 0; W !== null; ) {
      var o = W, i = o.child;
      if (o.tag === 22 && r) {
        var u = o.memoizedState !== null || Pi;
        if (!u) {
          var f = o.alternate, p = f !== null && f.memoizedState !== null || ht;
          f = Pi;
          var x = ht;
          if (Pi = u, (ht = p) && !x) for (W = o; W !== null; ) u = W, p = u.child, u.tag === 22 && u.memoizedState !== null ? Sc(o) : p !== null ? (p.return = u, W = p) : Sc(o);
          for (; i !== null; ) W = i, yc(i), i = i.sibling;
          W = o, Pi = f, ht = x;
        }
        gc(e);
      } else (o.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = o, W = i) : gc(e);
    }
  }
  function gc(e) {
    for (; W !== null; ) {
      var t = W;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              ht || Ni(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !ht) if (n === null) r.componentDidMount();
              else {
                var o = t.elementType === t.type ? n.memoizedProps : Vt(t.type, n.memoizedProps);
                r.componentDidUpdate(o, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && wu(t, i, r);
              break;
            case 3:
              var u = t.updateQueue;
              if (u !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                wu(t, u, n);
              }
              break;
            case 5:
              var f = t.stateNode;
              if (n === null && t.flags & 4) {
                n = f;
                var p = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    p.autoFocus && n.focus();
                    break;
                  case "img":
                    p.src && (n.src = p.src);
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
                var x = t.alternate;
                if (x !== null) {
                  var I = x.memoizedState;
                  if (I !== null) {
                    var L = I.dehydrated;
                    L !== null && Gr(L);
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
              throw Error(s(163));
          }
          ht || t.flags & 512 && ys(t);
        } catch (R) {
          Ke(t, t.return, R);
        }
      }
      if (t === e) {
        W = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, W = n;
        break;
      }
      W = t.return;
    }
  }
  function wc(e) {
    for (; W !== null; ) {
      var t = W;
      if (t === e) {
        W = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, W = n;
        break;
      }
      W = t.return;
    }
  }
  function Sc(e) {
    for (; W !== null; ) {
      var t = W;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Ni(4, t);
            } catch (p) {
              Ke(t, n, p);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var o = t.return;
              try {
                r.componentDidMount();
              } catch (p) {
                Ke(t, o, p);
              }
            }
            var i = t.return;
            try {
              ys(t);
            } catch (p) {
              Ke(t, i, p);
            }
            break;
          case 5:
            var u = t.return;
            try {
              ys(t);
            } catch (p) {
              Ke(t, u, p);
            }
        }
      } catch (p) {
        Ke(t, t.return, p);
      }
      if (t === e) {
        W = null;
        break;
      }
      var f = t.sibling;
      if (f !== null) {
        f.return = t.return, W = f;
        break;
      }
      W = t.return;
    }
  }
  var qf = Math.ceil, Ti = te.ReactCurrentDispatcher, Ss = te.ReactCurrentOwner, At = te.ReactCurrentBatchConfig, _e = 0, nt = null, Ge = null, st = 0, Nt = 0, Nr = Tn(0), be = 0, ko = null, tr = 0, Ri = 0, ks = 0, xo = null, xt = null, xs = 0, Tr = 1 / 0, mn = null, zi = !1, js = null, Mn = null, Ii = !1, An = null, Li = 0, jo = 0, _s = null, Oi = -1, Mi = 0;
  function yt() {
    return (_e & 6) !== 0 ? Je() : Oi !== -1 ? Oi : Oi = Je();
  }
  function Fn(e) {
    return (e.mode & 1) === 0 ? 1 : (_e & 2) !== 0 && st !== 0 ? st & -st : Lf.transition !== null ? (Mi === 0 && (Mi = pa()), Mi) : (e = Re, e !== 0 || (e = window.event, e = e === void 0 ? 16 : xa(e.type)), e);
  }
  function Qt(e, t, n, r) {
    if (50 < jo) throw jo = 0, _s = null, Error(s(185));
    Kr(e, n, r), ((_e & 2) === 0 || e !== nt) && (e === nt && ((_e & 2) === 0 && (Ri |= n), be === 4 && $n(e, st)), jt(e, r), n === 1 && _e === 0 && (t.mode & 1) === 0 && (Tr = Je() + 500, ui && zn()));
  }
  function jt(e, t) {
    var n = e.callbackNode;
    Id(e, t);
    var r = Ho(e, e === nt ? st : 0);
    if (r === 0) n !== null && sn(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && sn(n), t === 1) e.tag === 0 ? If(xc.bind(null, e)) : su(xc.bind(null, e)), Nf(function() {
        (_e & 6) === 0 && zn();
      }), n = null;
      else {
        switch (ha(r)) {
          case 1:
            n = rl;
            break;
          case 4:
            n = da;
            break;
          case 16:
            n = Uo;
            break;
          case 536870912:
            n = fa;
            break;
          default:
            n = Uo;
        }
        n = Rc(n, kc.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function kc(e, t) {
    if (Oi = -1, Mi = 0, (_e & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (Rr() && e.callbackNode !== n) return null;
    var r = Ho(e, e === nt ? st : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ai(e, r);
    else {
      t = r;
      var o = _e;
      _e |= 2;
      var i = _c();
      (nt !== e || st !== t) && (mn = null, Tr = Je() + 500, rr(e, t));
      do
        try {
          bf();
          break;
        } catch (f) {
          jc(e, f);
        }
      while (!0);
      Vl(), Ti.current = i, _e = o, Ge !== null ? t = 0 : (nt = null, st = 0, t = be);
    }
    if (t !== 0) {
      if (t === 2 && (o = ol(e), o !== 0 && (r = o, t = Es(e, o))), t === 1) throw n = ko, rr(e, 0), $n(e, r), jt(e, Je()), n;
      if (t === 6) $n(e, r);
      else {
        if (o = e.current.alternate, (r & 30) === 0 && !Gf(o) && (t = Ai(e, r), t === 2 && (i = ol(e), i !== 0 && (r = i, t = Es(e, i))), t === 1)) throw n = ko, rr(e, 0), $n(e, r), jt(e, Je()), n;
        switch (e.finishedWork = o, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            or(e, xt, mn);
            break;
          case 3:
            if ($n(e, r), (r & 130023424) === r && (t = xs + 500 - Je(), 10 < t)) {
              if (Ho(e, 0) !== 0) break;
              if (o = e.suspendedLanes, (o & r) !== r) {
                yt(), e.pingedLanes |= e.suspendedLanes & o;
                break;
              }
              e.timeoutHandle = zl(or.bind(null, e, xt, mn), t);
              break;
            }
            or(e, xt, mn);
            break;
          case 4:
            if ($n(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, o = -1; 0 < r; ) {
              var u = 31 - Dt(r);
              i = 1 << u, u = t[u], u > o && (o = u), r &= ~i;
            }
            if (r = o, r = Je() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * qf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = zl(or.bind(null, e, xt, mn), r);
              break;
            }
            or(e, xt, mn);
            break;
          case 5:
            or(e, xt, mn);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return jt(e, Je()), e.callbackNode === n ? kc.bind(null, e) : null;
  }
  function Es(e, t) {
    var n = xo;
    return e.current.memoizedState.isDehydrated && (rr(e, t).flags |= 256), e = Ai(e, t), e !== 2 && (t = xt, xt = n, t !== null && Cs(t)), e;
  }
  function Cs(e) {
    xt === null ? xt = e : xt.push.apply(xt, e);
  }
  function Gf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var o = n[r], i = o.getSnapshot;
          o = o.value;
          try {
            if (!Ut(i(), o)) return !1;
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
  function $n(e, t) {
    for (t &= ~ks, t &= ~Ri, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - Dt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function xc(e) {
    if ((_e & 6) !== 0) throw Error(s(327));
    Rr();
    var t = Ho(e, 0);
    if ((t & 1) === 0) return jt(e, Je()), null;
    var n = Ai(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = ol(e);
      r !== 0 && (t = r, n = Es(e, r));
    }
    if (n === 1) throw n = ko, rr(e, 0), $n(e, t), jt(e, Je()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, or(e, xt, mn), jt(e, Je()), null;
  }
  function Ps(e, t) {
    var n = _e;
    _e |= 1;
    try {
      return e(t);
    } finally {
      _e = n, _e === 0 && (Tr = Je() + 500, ui && zn());
    }
  }
  function nr(e) {
    An !== null && An.tag === 0 && (_e & 6) === 0 && Rr();
    var t = _e;
    _e |= 1;
    var n = At.transition, r = Re;
    try {
      if (At.transition = null, Re = 1, e) return e();
    } finally {
      Re = r, At.transition = n, _e = t, (_e & 6) === 0 && zn();
    }
  }
  function Ns() {
    Nt = Nr.current, $e(Nr);
  }
  function rr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Pf(n)), Ge !== null) for (n = Ge.return; n !== null; ) {
      var r = n;
      switch (Fl(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && si();
          break;
        case 3:
          Er(), $e(wt), $e(dt), ql();
          break;
        case 5:
          Yl(r);
          break;
        case 4:
          Er();
          break;
        case 13:
          $e(Ve);
          break;
        case 19:
          $e(Ve);
          break;
        case 10:
          Wl(r.type._context);
          break;
        case 22:
        case 23:
          Ns();
      }
      n = n.return;
    }
    if (nt = e, Ge = e = Dn(e.current, null), st = Nt = t, be = 0, ko = null, ks = Ri = tr = 0, xt = xo = null, Zn !== null) {
      for (t = 0; t < Zn.length; t++) if (n = Zn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var o = r.next, i = n.pending;
        if (i !== null) {
          var u = i.next;
          i.next = o, r.next = u;
        }
        n.pending = r;
      }
      Zn = null;
    }
    return e;
  }
  function jc(e, t) {
    do {
      var n = Ge;
      try {
        if (Vl(), wi.current = ji, Si) {
          for (var r = We.memoizedState; r !== null; ) {
            var o = r.queue;
            o !== null && (o.pending = null), r = r.next;
          }
          Si = !1;
        }
        if (er = 0, tt = Ze = We = null, mo = !1, vo = 0, Ss.current = null, n === null || n.return === null) {
          be = 1, ko = t, Ge = null;
          break;
        }
        e: {
          var i = e, u = n.return, f = n, p = t;
          if (t = st, f.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var x = p, I = f, L = I.tag;
            if ((I.mode & 1) === 0 && (L === 0 || L === 11 || L === 15)) {
              var R = I.alternate;
              R ? (I.updateQueue = R.updateQueue, I.memoizedState = R.memoizedState, I.lanes = R.lanes) : (I.updateQueue = null, I.memoizedState = null);
            }
            var V = Yu(u);
            if (V !== null) {
              V.flags &= -257, Ju(V, u, f, i, t), V.mode & 1 && Xu(i, x, t), t = V, p = x;
              var Q = t.updateQueue;
              if (Q === null) {
                var Y = /* @__PURE__ */ new Set();
                Y.add(p), t.updateQueue = Y;
              } else Q.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                Xu(i, x, t), Ts();
                break e;
              }
              p = Error(s(426));
            }
          } else if (Ue && f.mode & 1) {
            var qe = Yu(u);
            if (qe !== null) {
              (qe.flags & 65536) === 0 && (qe.flags |= 256), Ju(qe, u, f, i, t), Ul(Cr(p, f));
              break e;
            }
          }
          i = p = Cr(p, f), be !== 4 && (be = 2), xo === null ? xo = [i] : xo.push(i), i = u;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var w = Qu(i, p, t);
                gu(i, w);
                break e;
              case 1:
                f = p;
                var m = i.type, k = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof m.getDerivedStateFromError == "function" || k !== null && typeof k.componentDidCatch == "function" && (Mn === null || !Mn.has(k)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var M = Ku(i, f, t);
                  gu(i, M);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Cc(n);
      } catch (q) {
        t = q, Ge === n && n !== null && (Ge = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function _c() {
    var e = Ti.current;
    return Ti.current = ji, e === null ? ji : e;
  }
  function Ts() {
    (be === 0 || be === 3 || be === 2) && (be = 4), nt === null || (tr & 268435455) === 0 && (Ri & 268435455) === 0 || $n(nt, st);
  }
  function Ai(e, t) {
    var n = _e;
    _e |= 2;
    var r = _c();
    (nt !== e || st !== t) && (mn = null, rr(e, t));
    do
      try {
        Zf();
        break;
      } catch (o) {
        jc(e, o);
      }
    while (!0);
    if (Vl(), _e = n, Ti.current = r, Ge !== null) throw Error(s(261));
    return nt = null, st = 0, be;
  }
  function Zf() {
    for (; Ge !== null; ) Ec(Ge);
  }
  function bf() {
    for (; Ge !== null && !nl(); ) Ec(Ge);
  }
  function Ec(e) {
    var t = Tc(e.alternate, e, Nt);
    e.memoizedProps = e.pendingProps, t === null ? Cc(e) : Ge = t, Ss.current = null;
  }
  function Cc(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Qf(n, t, Nt), n !== null) {
          Ge = n;
          return;
        }
      } else {
        if (n = Kf(n, t), n !== null) {
          n.flags &= 32767, Ge = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          be = 6, Ge = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Ge = t;
        return;
      }
      Ge = t = e;
    } while (t !== null);
    be === 0 && (be = 5);
  }
  function or(e, t, n) {
    var r = Re, o = At.transition;
    try {
      At.transition = null, Re = 1, ep(e, t, n, r);
    } finally {
      At.transition = o, Re = r;
    }
    return null;
  }
  function ep(e, t, n, r) {
    do
      Rr();
    while (An !== null);
    if ((_e & 6) !== 0) throw Error(s(327));
    n = e.finishedWork;
    var o = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (Ld(e, i), e === nt && (Ge = nt = null, st = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Ii || (Ii = !0, Rc(Uo, function() {
      return Rr(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = At.transition, At.transition = null;
      var u = Re;
      Re = 1;
      var f = _e;
      _e |= 4, Ss.current = null, Yf(e, n), vc(n, e), Sf(Tl), Xo = !!Nl, Tl = Nl = null, e.current = n, Jf(n), _d(), _e = f, Re = u, At.transition = i;
    } else e.current = n;
    if (Ii && (Ii = !1, An = e, Li = o), i = e.pendingLanes, i === 0 && (Mn = null), Pd(n.stateNode), jt(e, Je()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) o = t[n], r(o.value, { componentStack: o.stack, digest: o.digest });
    if (zi) throw zi = !1, e = js, js = null, e;
    return (Li & 1) !== 0 && e.tag !== 0 && Rr(), i = e.pendingLanes, (i & 1) !== 0 ? e === _s ? jo++ : (jo = 0, _s = e) : jo = 0, zn(), null;
  }
  function Rr() {
    if (An !== null) {
      var e = ha(Li), t = At.transition, n = Re;
      try {
        if (At.transition = null, Re = 16 > e ? 16 : e, An === null) var r = !1;
        else {
          if (e = An, An = null, Li = 0, (_e & 6) !== 0) throw Error(s(331));
          var o = _e;
          for (_e |= 4, W = e.current; W !== null; ) {
            var i = W, u = i.child;
            if ((W.flags & 16) !== 0) {
              var f = i.deletions;
              if (f !== null) {
                for (var p = 0; p < f.length; p++) {
                  var x = f[p];
                  for (W = x; W !== null; ) {
                    var I = W;
                    switch (I.tag) {
                      case 0:
                      case 11:
                      case 15:
                        So(8, I, i);
                    }
                    var L = I.child;
                    if (L !== null) L.return = I, W = L;
                    else for (; W !== null; ) {
                      I = W;
                      var R = I.sibling, V = I.return;
                      if (dc(I), I === x) {
                        W = null;
                        break;
                      }
                      if (R !== null) {
                        R.return = V, W = R;
                        break;
                      }
                      W = V;
                    }
                  }
                }
                var Q = i.alternate;
                if (Q !== null) {
                  var Y = Q.child;
                  if (Y !== null) {
                    Q.child = null;
                    do {
                      var qe = Y.sibling;
                      Y.sibling = null, Y = qe;
                    } while (Y !== null);
                  }
                }
                W = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && u !== null) u.return = i, W = u;
            else e: for (; W !== null; ) {
              if (i = W, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  So(9, i, i.return);
              }
              var w = i.sibling;
              if (w !== null) {
                w.return = i.return, W = w;
                break e;
              }
              W = i.return;
            }
          }
          var m = e.current;
          for (W = m; W !== null; ) {
            u = W;
            var k = u.child;
            if ((u.subtreeFlags & 2064) !== 0 && k !== null) k.return = u, W = k;
            else e: for (u = m; W !== null; ) {
              if (f = W, (f.flags & 2048) !== 0) try {
                switch (f.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ni(9, f);
                }
              } catch (q) {
                Ke(f, f.return, q);
              }
              if (f === u) {
                W = null;
                break e;
              }
              var M = f.sibling;
              if (M !== null) {
                M.return = f.return, W = M;
                break e;
              }
              W = f.return;
            }
          }
          if (_e = o, zn(), Jt && typeof Jt.onPostCommitFiberRoot == "function") try {
            Jt.onPostCommitFiberRoot(Bo, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        Re = n, At.transition = t;
      }
    }
    return !1;
  }
  function Pc(e, t, n) {
    t = Cr(n, t), t = Qu(e, t, 1), e = Ln(e, t, 1), t = yt(), e !== null && (Kr(e, 1, t), jt(e, t));
  }
  function Ke(e, t, n) {
    if (e.tag === 3) Pc(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Pc(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Mn === null || !Mn.has(r))) {
          e = Cr(n, e), e = Ku(t, e, 1), t = Ln(t, e, 1), e = yt(), t !== null && (Kr(t, 1, e), jt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function tp(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = yt(), e.pingedLanes |= e.suspendedLanes & n, nt === e && (st & n) === n && (be === 4 || be === 3 && (st & 130023424) === st && 500 > Je() - xs ? rr(e, 0) : ks |= n), jt(e, t);
  }
  function Nc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Wo, Wo <<= 1, (Wo & 130023424) === 0 && (Wo = 4194304)));
    var n = yt();
    e = fn(e, t), e !== null && (Kr(e, t, n), jt(e, n));
  }
  function np(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Nc(e, n);
  }
  function rp(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, o = e.memoizedState;
        o !== null && (n = o.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    r !== null && r.delete(t), Nc(e, n);
  }
  var Tc;
  Tc = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || wt.current) kt = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return kt = !1, Hf(e, t, n);
      kt = (e.flags & 131072) !== 0;
    }
    else kt = !1, Ue && (t.flags & 1048576) !== 0 && au(t, di, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Ci(e, t), e = t.pendingProps;
        var o = gr(t, dt.current);
        _r(t, n), o = bl(null, t, r, e, o, n);
        var i = es();
        return t.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, St(r) ? (i = !0, ai(t)) : i = !1, t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, Kl(t), o.updater = _i, t.stateNode = o, o._reactInternals = t, ls(t, r, e, n), t = cs(null, t, r, !0, i, n)) : (t.tag = 0, Ue && i && Al(t), vt(null, t, o, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Ci(e, t), e = t.pendingProps, o = r._init, r = o(r._payload), t.type = r, o = t.tag = ip(r), e = Vt(r, e), o) {
            case 0:
              t = us(null, t, r, e, n);
              break e;
            case 1:
              t = tc(null, t, r, e, n);
              break e;
            case 11:
              t = qu(null, t, r, e, n);
              break e;
            case 14:
              t = Gu(null, t, r, Vt(r.type, e), n);
              break e;
          }
          throw Error(s(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Vt(r, o), us(e, t, r, o, n);
      case 1:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Vt(r, o), tc(e, t, r, o, n);
      case 3:
        e: {
          if (nc(t), e === null) throw Error(s(387));
          r = t.pendingProps, i = t.memoizedState, o = i.element, yu(e, t), yi(t, r, null, n);
          var u = t.memoizedState;
          if (r = u.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: u.cache, pendingSuspenseBoundaries: u.pendingSuspenseBoundaries, transitions: u.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            o = Cr(Error(s(423)), t), t = rc(e, t, r, n, o);
            break e;
          } else if (r !== o) {
            o = Cr(Error(s(424)), t), t = rc(e, t, r, n, o);
            break e;
          } else for (Pt = Nn(t.stateNode.containerInfo.firstChild), Ct = t, Ue = !0, Bt = null, n = mu(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (kr(), r === o) {
              t = hn(e, t, n);
              break e;
            }
            vt(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Su(t), e === null && Dl(t), r = t.type, o = t.pendingProps, i = e !== null ? e.memoizedProps : null, u = o.children, Rl(r, o) ? u = null : i !== null && Rl(r, i) && (t.flags |= 32), ec(e, t), vt(e, t, u, n), t.child;
      case 6:
        return e === null && Dl(t), null;
      case 13:
        return oc(e, t, n);
      case 4:
        return Xl(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = xr(t, null, r, n) : vt(e, t, r, n), t.child;
      case 11:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Vt(r, o), qu(e, t, r, o, n);
      case 7:
        return vt(e, t, t.pendingProps, n), t.child;
      case 8:
        return vt(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return vt(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, o = t.pendingProps, i = t.memoizedProps, u = o.value, Oe(hi, r._currentValue), r._currentValue = u, i !== null) if (Ut(i.value, u)) {
            if (i.children === o.children && !wt.current) {
              t = hn(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var f = i.dependencies;
            if (f !== null) {
              u = i.child;
              for (var p = f.firstContext; p !== null; ) {
                if (p.context === r) {
                  if (i.tag === 1) {
                    p = pn(-1, n & -n), p.tag = 2;
                    var x = i.updateQueue;
                    if (x !== null) {
                      x = x.shared;
                      var I = x.pending;
                      I === null ? p.next = p : (p.next = I.next, I.next = p), x.pending = p;
                    }
                  }
                  i.lanes |= n, p = i.alternate, p !== null && (p.lanes |= n), Hl(
                    i.return,
                    n,
                    t
                  ), f.lanes |= n;
                  break;
                }
                p = p.next;
              }
            } else if (i.tag === 10) u = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (u = i.return, u === null) throw Error(s(341));
              u.lanes |= n, f = u.alternate, f !== null && (f.lanes |= n), Hl(u, n, t), u = i.sibling;
            } else u = i.child;
            if (u !== null) u.return = i;
            else for (u = i; u !== null; ) {
              if (u === t) {
                u = null;
                break;
              }
              if (i = u.sibling, i !== null) {
                i.return = u.return, u = i;
                break;
              }
              u = u.return;
            }
            i = u;
          }
          vt(e, t, o.children, n), t = t.child;
        }
        return t;
      case 9:
        return o = t.type, r = t.pendingProps.children, _r(t, n), o = Ot(o), r = r(o), t.flags |= 1, vt(e, t, r, n), t.child;
      case 14:
        return r = t.type, o = Vt(r, t.pendingProps), o = Vt(r.type, o), Gu(e, t, r, o, n);
      case 15:
        return Zu(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Vt(r, o), Ci(e, t), t.tag = 1, St(r) ? (e = !0, ai(t)) : e = !1, _r(t, n), Wu(t, r, o), ls(t, r, o, n), cs(null, t, r, !0, e, n);
      case 19:
        return lc(e, t, n);
      case 22:
        return bu(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function Rc(e, t) {
    return Hr(e, t);
  }
  function op(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ft(e, t, n, r) {
    return new op(e, t, n, r);
  }
  function Rs(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function ip(e) {
    if (typeof e == "function") return Rs(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === xe) return 11;
      if (e === Se) return 14;
    }
    return 2;
  }
  function Dn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Ft(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Fi(e, t, n, r, o, i) {
    var u = 2;
    if (r = e, typeof e == "function") Rs(e) && (u = 1);
    else if (typeof e == "string") u = 5;
    else e: switch (e) {
      case pe:
        return ir(n.children, o, i, t);
      case re:
        u = 8, o |= 8;
        break;
      case Z:
        return e = Ft(12, n, t, o | 2), e.elementType = Z, e.lanes = i, e;
      case Me:
        return e = Ft(13, n, t, o), e.elementType = Me, e.lanes = i, e;
      case Ne:
        return e = Ft(19, n, t, o), e.elementType = Ne, e.lanes = i, e;
      case le:
        return $i(n, o, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Pe:
            u = 10;
            break e;
          case Ee:
            u = 9;
            break e;
          case xe:
            u = 11;
            break e;
          case Se:
            u = 14;
            break e;
          case de:
            u = 16, r = null;
            break e;
        }
        throw Error(s(130, e == null ? e : typeof e, ""));
    }
    return t = Ft(u, n, t, o), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function ir(e, t, n, r) {
    return e = Ft(7, e, r, t), e.lanes = n, e;
  }
  function $i(e, t, n, r) {
    return e = Ft(22, e, r, t), e.elementType = le, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function zs(e, t, n) {
    return e = Ft(6, e, null, t), e.lanes = n, e;
  }
  function Is(e, t, n) {
    return t = Ft(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function lp(e, t, n, r, o) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = il(0), this.expirationTimes = il(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = il(0), this.identifierPrefix = r, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null;
  }
  function Ls(e, t, n, r, o, i, u, f, p) {
    return e = new lp(e, t, n, f, p), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Ft(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Kl(i), e;
  }
  function sp(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: we, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function zc(e) {
    if (!e) return Rn;
    e = e._reactInternals;
    e: {
      if (Qe(e) !== e || e.tag !== 1) throw Error(s(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (St(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(s(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (St(n)) return iu(e, n, t);
    }
    return t;
  }
  function Ic(e, t, n, r, o, i, u, f, p) {
    return e = Ls(n, r, !0, e, o, i, u, f, p), e.context = zc(null), n = e.current, r = yt(), o = Fn(n), i = pn(r, o), i.callback = t ?? null, Ln(n, i, o), e.current.lanes = o, Kr(e, o, r), jt(e, r), e;
  }
  function Di(e, t, n, r) {
    var o = t.current, i = yt(), u = Fn(o);
    return n = zc(n), t.context === null ? t.context = n : t.pendingContext = n, t = pn(i, u), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Ln(o, t, u), e !== null && (Qt(e, o, u, i), vi(e, o, u)), u;
  }
  function Ui(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Lc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Os(e, t) {
    Lc(e, t), (e = e.alternate) && Lc(e, t);
  }
  function ap() {
    return null;
  }
  var Oc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ms(e) {
    this._internalRoot = e;
  }
  Bi.prototype.render = Ms.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    Di(e, t, null, null);
  }, Bi.prototype.unmount = Ms.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      nr(function() {
        Di(null, e, null, null);
      }), t[an] = null;
    }
  };
  function Bi(e) {
    this._internalRoot = e;
  }
  Bi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ya();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < En.length && t !== 0 && t < En[n].priority; n++) ;
      En.splice(n, 0, e), n === 0 && Sa(e);
    }
  };
  function As(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Vi(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Mc() {
  }
  function up(e, t, n, r, o) {
    if (o) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var x = Ui(u);
          i.call(x);
        };
      }
      var u = Ic(t, r, e, 0, null, !1, !1, "", Mc);
      return e._reactRootContainer = u, e[an] = u.current, lo(e.nodeType === 8 ? e.parentNode : e), nr(), u;
    }
    for (; o = e.lastChild; ) e.removeChild(o);
    if (typeof r == "function") {
      var f = r;
      r = function() {
        var x = Ui(p);
        f.call(x);
      };
    }
    var p = Ls(e, 0, !1, null, null, !1, !1, "", Mc);
    return e._reactRootContainer = p, e[an] = p.current, lo(e.nodeType === 8 ? e.parentNode : e), nr(function() {
      Di(t, p, n, r);
    }), p;
  }
  function Wi(e, t, n, r, o) {
    var i = n._reactRootContainer;
    if (i) {
      var u = i;
      if (typeof o == "function") {
        var f = o;
        o = function() {
          var p = Ui(u);
          f.call(p);
        };
      }
      Di(t, u, e, o);
    } else u = up(n, t, e, o, r);
    return Ui(u);
  }
  ma = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Qr(t.pendingLanes);
          n !== 0 && (ll(t, n | 1), jt(t, Je()), (_e & 6) === 0 && (Tr = Je() + 500, zn()));
        }
        break;
      case 13:
        nr(function() {
          var r = fn(e, 1);
          if (r !== null) {
            var o = yt();
            Qt(r, e, 1, o);
          }
        }), Os(e, 1);
    }
  }, sl = function(e) {
    if (e.tag === 13) {
      var t = fn(e, 134217728);
      if (t !== null) {
        var n = yt();
        Qt(t, e, 134217728, n);
      }
      Os(e, 134217728);
    }
  }, va = function(e) {
    if (e.tag === 13) {
      var t = Fn(e), n = fn(e, t);
      if (n !== null) {
        var r = yt();
        Qt(n, e, t, r);
      }
      Os(e, t);
    }
  }, ya = function() {
    return Re;
  }, ga = function(e, t) {
    var n = Re;
    try {
      return Re = e, t();
    } finally {
      Re = n;
    }
  }, Br = function(e, t, n) {
    switch (t) {
      case "input":
        if (Lr(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var o = li(r);
              if (!o) throw Error(s(90));
              mt(r), Lr(r, o);
            }
          }
        }
        break;
      case "textarea":
        Mr(e, n);
        break;
      case "select":
        t = n.value, t != null && gn(e, !!n.multiple, t, !1);
    }
  }, D = Ps, K = nr;
  var cp = { usingClientEntryPoint: !1, Events: [uo, vr, li, O, $, Ps] }, _o = { findFiberByHostInstance: Yn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, dp = { bundleType: _o.bundleType, version: _o.version, rendererPackageName: _o.rendererPackageName, rendererConfig: _o.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: te.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Vr(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: _o.findFiberByHostInstance || ap, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Hi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Hi.isDisabled && Hi.supportsFiber) try {
      Bo = Hi.inject(dp), Jt = Hi;
    } catch {
    }
  }
  return _t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = cp, _t.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!As(t)) throw Error(s(200));
    return sp(e, t, null, n);
  }, _t.createRoot = function(e, t) {
    if (!As(e)) throw Error(s(299));
    var n = !1, r = "", o = Oc;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = Ls(e, 1, !1, null, null, n, !1, r, o), e[an] = t.current, lo(e.nodeType === 8 ? e.parentNode : e), new Ms(t);
  }, _t.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = Vr(t), e = e === null ? null : e.stateNode, e;
  }, _t.flushSync = function(e) {
    return nr(e);
  }, _t.hydrate = function(e, t, n) {
    if (!Vi(t)) throw Error(s(200));
    return Wi(null, e, t, !0, n);
  }, _t.hydrateRoot = function(e, t, n) {
    if (!As(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, o = !1, i = "", u = Oc;
    if (n != null && (n.unstable_strictMode === !0 && (o = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (u = n.onRecoverableError)), t = Ic(t, null, e, 1, n ?? null, o, !1, i, u), e[an] = t.current, lo(e), r) for (e = 0; e < r.length; e++) n = r[e], o = n._getVersion, o = o(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, o] : t.mutableSourceEagerHydrationData.push(
      n,
      o
    );
    return new Bi(t);
  }, _t.render = function(e, t, n) {
    if (!Vi(t)) throw Error(s(200));
    return Wi(null, e, t, !1, n);
  }, _t.unmountComponentAtNode = function(e) {
    if (!Vi(e)) throw Error(s(40));
    return e._reactRootContainer ? (nr(function() {
      Wi(null, null, e, !1, function() {
        e._reactRootContainer = null, e[an] = null;
      });
    }), !0) : !1;
  }, _t.unstable_batchedUpdates = Ps, _t.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Vi(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return Wi(e, t, n, !1, r);
  }, _t.version = "18.3.1-next-f1338f8080-20240426", _t;
}
var Wc;
function xp() {
  if (Wc) return Ds.exports;
  Wc = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (a) {
        console.error(a);
      }
  }
  return l(), Ds.exports = kp(), Ds.exports;
}
var Hc;
function jp() {
  if (Hc) return Qi;
  Hc = 1;
  var l = xp();
  return Qi.createRoot = l.createRoot, Qi.hydrateRoot = l.hydrateRoot, Qi;
}
var _p = jp();
const Ep = /* @__PURE__ */ ad(_p), Cp = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", Pp = `${Cp}/chat/completions`, Np = 1, Qc = 256 * 1024 * 1024, Tp = 512 * 1024 * 1024, qi = 64 * 1024, Rp = `You are the analysis assistant inside OMERO Analysis Chat.
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

Successful Python code can be saved by the user as a versioned project script. Use
list_saved_scripts to discover these reusable workflows, read_saved_script only when its code is
needed for reasoning, and run_saved_script when an existing workflow directly answers the request.
Do not repeatedly regenerate an existing saved workflow.

CI Segmentation measurement databases may be DuckDB or SQLite. Start by discovering the actual
tables/views and their columns; never assume a schema. Expected tables can include schema_info,
measurement_runs, images, channels, label_sets, objects, intensity_measurements, and relationships.
Convenience views can include object_features, intensity_features, mask_relationships, and
foci_assignments. object_id is database-wide; channel_index is one-based; image timepoints and
pixel coordinates are zero-based; bounding-box maxima are exclusive. Intensities are measured on
the final masks without normalization or background subtraction. Physical values may be NULL when
calibration is absent. Relationships are stored in both directions, and primary assignments use
is_primary_for_source. Verify all names and semantics from the discovered database before querying.
Explain biological and measurement meaning without overstating causality.`, zp = [
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
  },
  {
    type: "function",
    function: {
      name: "list_saved_scripts",
      description: "List reusable versioned Python scripts saved by the user in this project.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  },
  {
    type: "function",
    function: {
      name: "read_saved_script",
      description: "Read the current version of one user-approved generated Python script.",
      parameters: {
        type: "object",
        properties: { script_id: { type: "string" } },
        required: ["script_id"],
        additionalProperties: !1
      }
    }
  },
  {
    type: "function",
    function: {
      name: "run_saved_script",
      description: "Run the current version of a user-approved project script locally.",
      parameters: {
        type: "object",
        properties: { script_id: { type: "string" } },
        required: ["script_id"],
        additionalProperties: !1
      }
    }
  }
];
function Vs() {
  const l = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return l ? decodeURIComponent(l[1]) : "";
}
function Ws(l, a, s) {
  return l.replace("TYPE", a).replace("/1/", `/${s}/`);
}
class Ip {
  constructor(a) {
    en(this, "contextToken", "");
    en(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = a;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const a = this.bootstrap.context;
    if (!a) return;
    const s = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Vs()
      },
      body: JSON.stringify({
        object_type: a.object_type,
        object_id: a.object_id
      })
    }), c = await Ki(s);
    this.contextToken = c.context_token, this.operations = new Set(c.operations);
  }
  async download(a) {
    const s = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${a.annotation_id}/download/`
    ), c = await fetch(s, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!c.ok) throw new Error(await Zs(c));
    return c.arrayBuffer();
  }
  async attach(a) {
    const s = this.bootstrap.context;
    if (!s || !a.data) throw new Error("No OMERO target or result data");
    const c = new FormData();
    c.append("file", new Blob([a.data], { type: a.type }), a.name);
    const y = await fetch(
      Ws(
        this.bootstrap.uploadTemplate,
        s.object_type,
        s.object_id
      ),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": Vs(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: c
      }
    );
    return (await Ki(y)).attachment;
  }
  async listSnapshots() {
    const a = this.bootstrap.context;
    if (!a) return [];
    const s = await fetch(
      Ws(this.bootstrap.snapshotsTemplate, a.object_type, a.object_id),
      {
        credentials: "same-origin",
        headers: { "X-OMERO-Analysis-Context": this.contextToken }
      }
    );
    return (await Ki(s)).snapshots || [];
  }
  async uploadSnapshot(a, s) {
    const c = this.bootstrap.context;
    if (!c) throw new Error("No OMERO target for the project snapshot");
    const y = new FormData();
    y.append(
      "file",
      new Blob([s], { type: "application/zip" }),
      a
    );
    const h = await fetch(
      Ws(this.bootstrap.snapshotUploadTemplate, c.object_type, c.object_id),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": Vs(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: y
      }
    );
    return (await Ki(h)).snapshot;
  }
  async downloadSnapshot(a) {
    const s = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${a.annotation_id}/download/`
    ), c = await fetch(s, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!c.ok) throw new Error(await Zs(c));
    return c.arrayBuffer();
  }
}
async function Zs(l) {
  var a;
  try {
    return ((a = (await l.json()).error) == null ? void 0 : a.message) || `${l.status} ${l.statusText}`;
  } catch {
    return `${l.status} ${l.statusText}`;
  }
}
async function Ki(l) {
  var s;
  const a = await l.json().catch(() => ({}));
  if (!l.ok)
    throw new Error(((s = a.error) == null ? void 0 : s.message) || `${l.status} ${l.statusText}`);
  return a;
}
async function Lp(l, a, s) {
  const c = await fetch(Pp, {
    method: "POST",
    signal: s,
    headers: {
      "Content-Type": "application/json",
      "api-key": l.apiKey
    },
    body: JSON.stringify({
      model: l.model,
      temperature: Np,
      messages: a,
      tools: zp,
      tool_choice: "auto"
    })
  });
  if (!c.ok) throw new Error(await Zs(c));
  return c.json();
}
function Op(l) {
  const a = JSON.stringify({
    stdout: l.stdout,
    stderr: l.stderr,
    preview: l.preview,
    generated_files: l.files.map((s) => ({
      name: s.name,
      size: s.data.byteLength,
      type: s.type
    }))
  });
  return a.length > 64 * 1024 ? `${a.slice(0, 64 * 1024)}
[tool output truncated]` : a;
}
function Kt(l) {
  const a = String(l instanceof Error ? l.message : l).slice(0, qi), s = JSON.stringify({
    ok: !1,
    error: a,
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
  return s.length > qi ? `${s.slice(0, qi)}
[tool error truncated]` : s;
}
var Xe = Uint8Array, Rt = Uint16Array, ua = Int32Array, Gi = new Xe([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), Zi = new Xe([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), bs = new Xe([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), ud = function(l, a) {
  for (var s = new Rt(31), c = 0; c < 31; ++c)
    s[c] = a += 1 << l[c - 1];
  for (var y = new ua(s[30]), c = 1; c < 30; ++c)
    for (var h = s[c]; h < s[c + 1]; ++h)
      y[h] = h - s[c] << 5 | c;
  return { b: s, r: y };
}, cd = ud(Gi, 2), dd = cd.b, ea = cd.r;
dd[28] = 258, ea[258] = 28;
var fd = ud(Zi, 0), Mp = fd.b, Kc = fd.r, ta = new Rt(32768);
for (var De = 0; De < 32768; ++De) {
  var Bn = (De & 43690) >> 1 | (De & 21845) << 1;
  Bn = (Bn & 52428) >> 2 | (Bn & 13107) << 2, Bn = (Bn & 61680) >> 4 | (Bn & 3855) << 4, ta[De] = ((Bn & 65280) >> 8 | (Bn & 255) << 8) >> 1;
}
var on = (function(l, a, s) {
  for (var c = l.length, y = 0, h = new Rt(a); y < c; ++y)
    l[y] && ++h[l[y] - 1];
  var C = new Rt(a);
  for (y = 1; y < a; ++y)
    C[y] = C[y - 1] + h[y - 1] << 1;
  var _;
  if (s) {
    _ = new Rt(1 << a);
    var j = 15 - a;
    for (y = 0; y < c; ++y)
      if (l[y])
        for (var F = y << 4 | l[y], P = a - l[y], N = C[l[y] - 1]++ << P, A = N | (1 << P) - 1; N <= A; ++N)
          _[ta[N] >> j] = F;
  } else
    for (_ = new Rt(c), y = 0; y < c; ++y)
      l[y] && (_[y] = ta[C[l[y] - 1]++] >> 15 - l[y]);
  return _;
}), Wn = new Xe(288);
for (var De = 0; De < 144; ++De)
  Wn[De] = 8;
for (var De = 144; De < 256; ++De)
  Wn[De] = 9;
for (var De = 256; De < 280; ++De)
  Wn[De] = 7;
for (var De = 280; De < 288; ++De)
  Wn[De] = 8;
var To = new Xe(32);
for (var De = 0; De < 32; ++De)
  To[De] = 5;
var Ap = /* @__PURE__ */ on(Wn, 9, 0), Fp = /* @__PURE__ */ on(Wn, 9, 1), $p = /* @__PURE__ */ on(To, 5, 0), Dp = /* @__PURE__ */ on(To, 5, 1), Hs = function(l) {
  for (var a = l[0], s = 1; s < l.length; ++s)
    l[s] > a && (a = l[s]);
  return a;
}, Xt = function(l, a, s) {
  var c = a / 8 | 0;
  return (l[c] | l[c + 1] << 8) >> (a & 7) & s;
}, Qs = function(l, a) {
  var s = a / 8 | 0;
  return (l[s] | l[s + 1] << 8 | l[s + 2] << 16) >> (a & 7);
}, ca = function(l) {
  return (l + 7) / 8 | 0;
}, Ro = function(l, a, s) {
  return (a == null || a < 0) && (a = 0), (s == null || s > l.length) && (s = l.length), new Xe(l.subarray(a, s));
}, Up = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], gt = function(l, a, s) {
  var c = new Error(a || Up[l]);
  if (c.code = l, Error.captureStackTrace && Error.captureStackTrace(c, gt), !s)
    throw c;
  return c;
}, Bp = function(l, a, s, c) {
  var y = l.length, h = c ? c.length : 0;
  if (!y || a.f && !a.l)
    return s || new Xe(0);
  var C = !s, _ = C || a.i != 2, j = a.i;
  C && (s = new Xe(y * 3));
  var F = function(ut) {
    var mt = s.length;
    if (ut > mt) {
      var ct = new Xe(Math.max(mt * 2, ut));
      ct.set(s), s = ct;
    }
  }, P = a.f || 0, N = a.p || 0, A = a.b || 0, ne = a.l, ae = a.d, H = a.m, X = a.n, Te = y * 8;
  do {
    if (!ne) {
      P = Xt(l, N, 1);
      var je = Xt(l, N + 1, 3);
      if (N += 3, je)
        if (je == 1)
          ne = Fp, ae = Dp, H = 9, X = 5;
        else if (je == 2) {
          var we = Xt(l, N, 31) + 257, pe = Xt(l, N + 10, 15) + 4, re = we + Xt(l, N + 5, 31) + 1;
          N += 14;
          for (var Z = new Xe(re), Pe = new Xe(19), Ee = 0; Ee < pe; ++Ee)
            Pe[bs[Ee]] = Xt(l, N + Ee * 3, 7);
          N += pe * 3;
          for (var xe = Hs(Pe), Me = (1 << xe) - 1, Ne = on(Pe, xe, 1), Ee = 0; Ee < re; ) {
            var Se = Ne[Xt(l, N, Me)];
            N += Se & 15;
            var T = Se >> 4;
            if (T < 16)
              Z[Ee++] = T;
            else {
              var de = 0, le = 0;
              for (T == 16 ? (le = 3 + Xt(l, N, 3), N += 2, de = Z[Ee - 1]) : T == 17 ? (le = 3 + Xt(l, N, 7), N += 3) : T == 18 && (le = 11 + Xt(l, N, 127), N += 7); le--; )
                Z[Ee++] = de;
            }
          }
          var z = Z.subarray(0, we), B = Z.subarray(we);
          H = Hs(z), X = Hs(B), ne = on(z, H, 1), ae = on(B, X, 1);
        } else
          gt(1);
      else {
        var T = ca(N) + 4, te = l[T - 4] | l[T - 3] << 8, ve = T + te;
        if (ve > y) {
          j && gt(0);
          break;
        }
        _ && F(A + te), s.set(l.subarray(T, ve), A), a.b = A += te, a.p = N = ve * 8, a.f = P;
        continue;
      }
      if (N > Te) {
        j && gt(0);
        break;
      }
    }
    _ && F(A + 131072);
    for (var U = (1 << H) - 1, v = (1 << X) - 1, E = N; ; E = N) {
      var de = ne[Qs(l, N) & U], b = de >> 4;
      if (N += de & 15, N > Te) {
        j && gt(0);
        break;
      }
      if (de || gt(2), b < 256)
        s[A++] = b;
      else if (b == 256) {
        E = N, ne = null;
        break;
      } else {
        var ee = b - 254;
        if (b > 264) {
          var Ee = b - 257, G = Gi[Ee];
          ee = Xt(l, N, (1 << G) - 1) + dd[Ee], N += G;
        }
        var ce = ae[Qs(l, N) & v], fe = ce >> 4;
        ce || gt(3), N += ce & 15;
        var B = Mp[fe];
        if (fe > 3) {
          var G = Zi[fe];
          B += Qs(l, N) & (1 << G) - 1, N += G;
        }
        if (N > Te) {
          j && gt(0);
          break;
        }
        _ && F(A + 131072);
        var he = A + ee;
        if (A < B) {
          var ke = h - B, Ae = Math.min(B, he);
          for (ke + A < 0 && gt(3); A < Ae; ++A)
            s[A] = c[ke + A];
        }
        for (; A < he; ++A)
          s[A] = s[A - B];
      }
    }
    a.l = ne, a.p = E, a.b = A, a.f = P, ne && (P = 1, a.m = H, a.d = ae, a.n = X);
  } while (!P);
  return A != s.length && C ? Ro(s, 0, A) : s.subarray(0, A);
}, vn = function(l, a, s) {
  s <<= a & 7;
  var c = a / 8 | 0;
  l[c] |= s, l[c + 1] |= s >> 8;
}, Co = function(l, a, s) {
  s <<= a & 7;
  var c = a / 8 | 0;
  l[c] |= s, l[c + 1] |= s >> 8, l[c + 2] |= s >> 16;
}, Ks = function(l, a) {
  for (var s = [], c = 0; c < l.length; ++c)
    l[c] && s.push({ s: c, f: l[c] });
  var y = s.length, h = s.slice();
  if (!y)
    return { t: hd, l: 0 };
  if (y == 1) {
    var C = new Xe(s[0].s + 1);
    return C[s[0].s] = 1, { t: C, l: 1 };
  }
  s.sort(function(ve, we) {
    return ve.f - we.f;
  }), s.push({ s: -1, f: 25001 });
  var _ = s[0], j = s[1], F = 0, P = 1, N = 2;
  for (s[0] = { s: -1, f: _.f + j.f, l: _, r: j }; P != y - 1; )
    _ = s[s[F].f < s[N].f ? F++ : N++], j = s[F != P && s[F].f < s[N].f ? F++ : N++], s[P++] = { s: -1, f: _.f + j.f, l: _, r: j };
  for (var A = h[0].s, c = 1; c < y; ++c)
    h[c].s > A && (A = h[c].s);
  var ne = new Rt(A + 1), ae = na(s[P - 1], ne, 0);
  if (ae > a) {
    var c = 0, H = 0, X = ae - a, Te = 1 << X;
    for (h.sort(function(we, pe) {
      return ne[pe.s] - ne[we.s] || we.f - pe.f;
    }); c < y; ++c) {
      var je = h[c].s;
      if (ne[je] > a)
        H += Te - (1 << ae - ne[je]), ne[je] = a;
      else
        break;
    }
    for (H >>= X; H > 0; ) {
      var T = h[c].s;
      ne[T] < a ? H -= 1 << a - ne[T]++ - 1 : ++c;
    }
    for (; c >= 0 && H; --c) {
      var te = h[c].s;
      ne[te] == a && (--ne[te], ++H);
    }
    ae = a;
  }
  return { t: new Xe(ne), l: ae };
}, na = function(l, a, s) {
  return l.s == -1 ? Math.max(na(l.l, a, s + 1), na(l.r, a, s + 1)) : a[l.s] = s;
}, Xc = function(l) {
  for (var a = l.length; a && !l[--a]; )
    ;
  for (var s = new Rt(++a), c = 0, y = l[0], h = 1, C = function(j) {
    s[c++] = j;
  }, _ = 1; _ <= a; ++_)
    if (l[_] == y && _ != a)
      ++h;
    else {
      if (!y && h > 2) {
        for (; h > 138; h -= 138)
          C(32754);
        h > 2 && (C(h > 10 ? h - 11 << 5 | 28690 : h - 3 << 5 | 12305), h = 0);
      } else if (h > 3) {
        for (C(y), --h; h > 6; h -= 6)
          C(8304);
        h > 2 && (C(h - 3 << 5 | 8208), h = 0);
      }
      for (; h--; )
        C(y);
      h = 1, y = l[_];
    }
  return { c: s.subarray(0, c), n: a };
}, Po = function(l, a) {
  for (var s = 0, c = 0; c < a.length; ++c)
    s += l[c] * a[c];
  return s;
}, pd = function(l, a, s) {
  var c = s.length, y = ca(a + 2);
  l[y] = c & 255, l[y + 1] = c >> 8, l[y + 2] = l[y] ^ 255, l[y + 3] = l[y + 1] ^ 255;
  for (var h = 0; h < c; ++h)
    l[y + h + 4] = s[h];
  return (y + 4 + c) * 8;
}, Yc = function(l, a, s, c, y, h, C, _, j, F, P) {
  vn(a, P++, s), ++y[256];
  for (var N = Ks(y, 15), A = N.t, ne = N.l, ae = Ks(h, 15), H = ae.t, X = ae.l, Te = Xc(A), je = Te.c, T = Te.n, te = Xc(H), ve = te.c, we = te.n, pe = new Rt(19), re = 0; re < je.length; ++re)
    ++pe[je[re] & 31];
  for (var re = 0; re < ve.length; ++re)
    ++pe[ve[re] & 31];
  for (var Z = Ks(pe, 7), Pe = Z.t, Ee = Z.l, xe = 19; xe > 4 && !Pe[bs[xe - 1]]; --xe)
    ;
  var Me = F + 5 << 3, Ne = Po(y, Wn) + Po(h, To) + C, Se = Po(y, A) + Po(h, H) + C + 14 + 3 * xe + Po(pe, Pe) + 2 * pe[16] + 3 * pe[17] + 7 * pe[18];
  if (j >= 0 && Me <= Ne && Me <= Se)
    return pd(a, P, l.subarray(j, j + F));
  var de, le, z, B;
  if (vn(a, P, 1 + (Se < Ne)), P += 2, Se < Ne) {
    de = on(A, ne, 0), le = A, z = on(H, X, 0), B = H;
    var U = on(Pe, Ee, 0);
    vn(a, P, T - 257), vn(a, P + 5, we - 1), vn(a, P + 10, xe - 4), P += 14;
    for (var re = 0; re < xe; ++re)
      vn(a, P + 3 * re, Pe[bs[re]]);
    P += 3 * xe;
    for (var v = [je, ve], E = 0; E < 2; ++E)
      for (var b = v[E], re = 0; re < b.length; ++re) {
        var ee = b[re] & 31;
        vn(a, P, U[ee]), P += Pe[ee], ee > 15 && (vn(a, P, b[re] >> 5 & 127), P += b[re] >> 12);
      }
  } else
    de = Ap, le = Wn, z = $p, B = To;
  for (var re = 0; re < _; ++re) {
    var G = c[re];
    if (G > 255) {
      var ee = G >> 18 & 31;
      Co(a, P, de[ee + 257]), P += le[ee + 257], ee > 7 && (vn(a, P, G >> 23 & 31), P += Gi[ee]);
      var ce = G & 31;
      Co(a, P, z[ce]), P += B[ce], ce > 3 && (Co(a, P, G >> 5 & 8191), P += Zi[ce]);
    } else
      Co(a, P, de[G]), P += le[G];
  }
  return Co(a, P, de[256]), P + le[256];
}, Vp = /* @__PURE__ */ new ua([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), hd = /* @__PURE__ */ new Xe(0), Wp = function(l, a, s, c, y, h) {
  var C = h.z || l.length, _ = new Xe(c + C + 5 * (1 + Math.ceil(C / 7e3)) + y), j = _.subarray(c, _.length - y), F = h.l, P = (h.r || 0) & 7;
  if (a) {
    P && (j[0] = h.r >> 3);
    for (var N = Vp[a - 1], A = N >> 13, ne = N & 8191, ae = (1 << s) - 1, H = h.p || new Rt(32768), X = h.h || new Rt(ae + 1), Te = Math.ceil(s / 3), je = 2 * Te, T = function(ln) {
      return (l[ln] ^ l[ln + 1] << Te ^ l[ln + 2] << je) & ae;
    }, te = new ua(25e3), ve = new Rt(288), we = new Rt(32), pe = 0, re = 0, Z = h.i || 0, Pe = 0, Ee = h.w || 0, xe = 0; Z + 2 < C; ++Z) {
      var Me = T(Z), Ne = Z & 32767, Se = X[Me];
      if (H[Ne] = Se, X[Me] = Ne, Ee <= Z) {
        var de = C - Z;
        if ((pe > 7e3 || Pe > 24576) && (de > 423 || !F)) {
          P = Yc(l, j, 0, te, ve, we, re, Pe, xe, Z - xe, P), Pe = pe = re = 0, xe = Z;
          for (var le = 0; le < 286; ++le)
            ve[le] = 0;
          for (var le = 0; le < 30; ++le)
            we[le] = 0;
        }
        var z = 2, B = 0, U = ne, v = Ne - Se & 32767;
        if (de > 2 && Me == T(Z - v))
          for (var E = Math.min(A, de) - 1, b = Math.min(32767, Z), ee = Math.min(258, de); v <= b && --U && Ne != Se; ) {
            if (l[Z + z] == l[Z + z - v]) {
              for (var G = 0; G < ee && l[Z + G] == l[Z + G - v]; ++G)
                ;
              if (G > z) {
                if (z = G, B = v, G > E)
                  break;
                for (var ce = Math.min(v, G - 2), fe = 0, le = 0; le < ce; ++le) {
                  var he = Z - v + le & 32767, ke = H[he], Ae = he - ke & 32767;
                  Ae > fe && (fe = Ae, Se = he);
                }
              }
            }
            Ne = Se, Se = H[Ne], v += Ne - Se & 32767;
          }
        if (B) {
          te[Pe++] = 268435456 | ea[z] << 18 | Kc[B];
          var ut = ea[z] & 31, mt = Kc[B] & 31;
          re += Gi[ut] + Zi[mt], ++ve[257 + ut], ++we[mt], Ee = Z + z, ++pe;
        } else
          te[Pe++] = l[Z], ++ve[l[Z]];
      }
    }
    for (Z = Math.max(Z, Ee); Z < C; ++Z)
      te[Pe++] = l[Z], ++ve[l[Z]];
    P = Yc(l, j, F, te, ve, we, re, Pe, xe, Z - xe, P), F || (h.r = P & 7 | j[P / 8 | 0] << 3, P -= 7, h.h = X, h.p = H, h.i = Z, h.w = Ee);
  } else {
    for (var Z = h.w || 0; Z < C + F; Z += 65535) {
      var ct = Z + 65535;
      ct >= C && (j[P / 8 | 0] = F, ct = C), P = pd(j, P + 1, l.subarray(Z, ct));
    }
    h.i = C;
  }
  return Ro(_, 0, c + ca(P) + y);
}, Hp = /* @__PURE__ */ (function() {
  for (var l = new Int32Array(256), a = 0; a < 256; ++a) {
    for (var s = a, c = 9; --c; )
      s = (s & 1 && -306674912) ^ s >>> 1;
    l[a] = s;
  }
  return l;
})(), Qp = function() {
  var l = -1;
  return {
    p: function(a) {
      for (var s = l, c = 0; c < a.length; ++c)
        s = Hp[s & 255 ^ a[c]] ^ s >>> 8;
      l = s;
    },
    d: function() {
      return ~l;
    }
  };
}, Kp = function(l, a, s, c, y) {
  if (!y && (y = { l: 1 }, a.dictionary)) {
    var h = a.dictionary.subarray(-32768), C = new Xe(h.length + l.length);
    C.set(h), C.set(l, h.length), l = C, y.w = h.length;
  }
  return Wp(l, a.level == null ? 6 : a.level, a.mem == null ? y.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(l.length))) * 1.5) : 20 : 12 + a.mem, s, c, y);
}, md = function(l, a) {
  var s = {};
  for (var c in l)
    s[c] = l[c];
  for (var c in a)
    s[c] = a[c];
  return s;
}, rn = function(l, a) {
  return l[a] | l[a + 1] << 8;
}, Yt = function(l, a) {
  return (l[a] | l[a + 1] << 8 | l[a + 2] << 16 | l[a + 3] << 24) >>> 0;
}, Xs = function(l, a) {
  return Yt(l, a) + Yt(l, a + 4) * 4294967296;
}, at = function(l, a, s) {
  for (; s; ++a)
    l[a] = s, s >>>= 8;
};
function Xp(l, a) {
  return Kp(l, a || {}, 0, 0);
}
function Yp(l, a) {
  return Bp(l, { i: 2 }, a && a.out, a && a.dictionary);
}
var vd = function(l, a, s, c) {
  for (var y in l) {
    var h = l[y], C = a + y, _ = c;
    Array.isArray(h) && (_ = md(c, h[1]), h = h[0]), h instanceof Xe ? s[C] = [h, _] : (s[C += "/"] = [new Xe(0), _], vd(h, C, s, c));
  }
}, Jc = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), ra = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), Jp = 0;
try {
  ra.decode(hd, { stream: !0 }), Jp = 1;
} catch {
}
var qp = function(l) {
  for (var a = "", s = 0; ; ) {
    var c = l[s++], y = (c > 127) + (c > 223) + (c > 239);
    if (s + y > l.length)
      return { s: a, r: Ro(l, s - 1) };
    y ? y == 3 ? (c = ((c & 15) << 18 | (l[s++] & 63) << 12 | (l[s++] & 63) << 6 | l[s++] & 63) - 65536, a += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023)) : y & 1 ? a += String.fromCharCode((c & 31) << 6 | l[s++] & 63) : a += String.fromCharCode((c & 15) << 12 | (l[s++] & 63) << 6 | l[s++] & 63) : a += String.fromCharCode(c);
  }
};
function oa(l, a) {
  var s;
  if (Jc)
    return Jc.encode(l);
  for (var c = l.length, y = new Xe(l.length + (l.length >> 1)), h = 0, C = function(F) {
    y[h++] = F;
  }, s = 0; s < c; ++s) {
    if (h + 5 > y.length) {
      var _ = new Xe(h + 8 + (c - s << 1));
      _.set(y), y = _;
    }
    var j = l.charCodeAt(s);
    j < 128 || a ? C(j) : j < 2048 ? (C(192 | j >> 6), C(128 | j & 63)) : j > 55295 && j < 57344 ? (j = 65536 + (j & 1047552) | l.charCodeAt(++s) & 1023, C(240 | j >> 18), C(128 | j >> 12 & 63), C(128 | j >> 6 & 63), C(128 | j & 63)) : (C(224 | j >> 12), C(128 | j >> 6 & 63), C(128 | j & 63));
  }
  return Ro(y, 0, h);
}
function yd(l, a) {
  if (a) {
    for (var s = "", c = 0; c < l.length; c += 16384)
      s += String.fromCharCode.apply(null, l.subarray(c, c + 16384));
    return s;
  } else {
    if (ra)
      return ra.decode(l);
    var y = qp(l), h = y.s, s = y.r;
    return s.length && gt(8), h;
  }
}
var Gp = function(l, a) {
  return a + 30 + rn(l, a + 26) + rn(l, a + 28);
}, Zp = function(l, a, s) {
  var c = rn(l, a + 28), y = yd(l.subarray(a + 46, a + 46 + c), !(rn(l, a + 8) & 2048)), h = a + 46 + c, C = Yt(l, a + 20), _ = s && C == 4294967295 ? bp(l, h) : [C, Yt(l, a + 24), Yt(l, a + 42)], j = _[0], F = _[1], P = _[2];
  return [rn(l, a + 10), j, F, y, h + rn(l, a + 30) + rn(l, a + 32), P];
}, bp = function(l, a) {
  for (; rn(l, a) != 1; a += 4 + rn(l, a + 2))
    ;
  return [Xs(l, a + 12), Xs(l, a + 4), Xs(l, a + 20)];
}, ia = function(l) {
  var a = 0;
  if (l)
    for (var s in l) {
      var c = l[s].length;
      c > 65535 && gt(9), a += c + 4;
    }
  return a;
}, qc = function(l, a, s, c, y, h, C, _) {
  var j = c.length, F = s.extra, P = _ && _.length, N = ia(F);
  at(l, a, C != null ? 33639248 : 67324752), a += 4, C != null && (l[a++] = 20, l[a++] = s.os), l[a] = 20, a += 2, l[a++] = s.flag << 1 | (h < 0 && 8), l[a++] = y && 8, l[a++] = s.compression & 255, l[a++] = s.compression >> 8;
  var A = new Date(s.mtime == null ? Date.now() : s.mtime), ne = A.getFullYear() - 1980;
  if ((ne < 0 || ne > 119) && gt(10), at(l, a, ne << 25 | A.getMonth() + 1 << 21 | A.getDate() << 16 | A.getHours() << 11 | A.getMinutes() << 5 | A.getSeconds() >> 1), a += 4, h != -1 && (at(l, a, s.crc), at(l, a + 4, h < 0 ? -h - 2 : h), at(l, a + 8, s.size)), at(l, a + 12, j), at(l, a + 14, N), a += 16, C != null && (at(l, a, P), at(l, a + 6, s.attrs), at(l, a + 10, C), a += 14), l.set(c, a), a += j, N)
    for (var ae in F) {
      var H = F[ae], X = H.length;
      at(l, a, +ae), at(l, a + 2, X), l.set(H, a + 4), a += 4 + X;
    }
  return P && (l.set(_, a), a += P), a;
}, eh = function(l, a, s, c, y) {
  at(l, a, 101010256), at(l, a + 8, s), at(l, a + 10, s), at(l, a + 12, c), at(l, a + 16, y);
};
function th(l, a) {
  a || (a = {});
  var s = {}, c = [];
  vd(l, "", s, a);
  var y = 0, h = 0;
  for (var C in s) {
    var _ = s[C], j = _[0], F = _[1], P = F.level == 0 ? 0 : 8, N = oa(C), A = N.length, ne = F.comment, ae = ne && oa(ne), H = ae && ae.length, X = ia(F.extra);
    A > 65535 && gt(11);
    var Te = P ? Xp(j, F) : j, je = Te.length, T = Qp();
    T.p(j), c.push(md(F, {
      size: j.length,
      crc: T.d(),
      c: Te,
      f: N,
      m: ae,
      u: A != C.length || ae && ne.length != H,
      o: y,
      compression: P
    })), y += 30 + A + X + je, h += 76 + 2 * (A + X) + (H || 0) + je;
  }
  for (var te = new Xe(h + 22), ve = y, we = h - y, pe = 0; pe < c.length; ++pe) {
    var N = c[pe];
    qc(te, N.o, N, N.f, N.u, N.c.length);
    var re = 30 + N.f.length + ia(N.extra);
    te.set(N.c, N.o + re), qc(te, y, N, N.f, N.u, N.c.length, N.o, N.m), y += 16 + re + (N.m ? N.m.length : 0);
  }
  return eh(te, y, c.length, we, ve), te;
}
function nh(l, a) {
  for (var s = {}, c = l.length - 22; Yt(l, c) != 101010256; --c)
    (!c || l.length - c > 65558) && gt(13);
  var y = rn(l, c + 8);
  if (!y)
    return {};
  var h = Yt(l, c + 16), C = h == 4294967295 || y == 65535;
  if (C) {
    var _ = Yt(l, c - 12);
    C = Yt(l, _) == 101075792, C && (y = Yt(l, _ + 32), h = Yt(l, _ + 48));
  }
  for (var j = 0; j < y; ++j) {
    var F = Zp(l, h, C), P = F[0], N = F[1], A = F[2], ne = F[3], ae = F[4], H = F[5], X = Gp(l, H);
    h = ae, P ? P == 8 ? s[ne] = Yp(l.subarray(X, X + N), { out: new Xe(A) }) : gt(14, "unknown compression type " + P) : s[ne] = Ro(l, X, X + N);
  }
  return s;
}
const rh = "omero-analysis-chat", oh = 2, gd = ["projects", "chats", "files", "executions", "scripts"];
function zo(l) {
  return new Promise((a, s) => {
    l.onsuccess = () => a(l.result), l.onerror = () => s(l.error);
  });
}
function bi(l) {
  return new Promise((a, s) => {
    l.oncomplete = () => a(), l.onerror = () => s(l.error), l.onabort = () => s(l.error || new Error("Storage transaction aborted"));
  });
}
function yn() {
  return new Promise((l, a) => {
    const s = indexedDB.open(rh, oh);
    s.onupgradeneeded = () => {
      const c = s.result;
      c.objectStoreNames.contains("values") || c.createObjectStore("values");
      for (const y of gd) {
        if (c.objectStoreNames.contains(y)) continue;
        const h = c.createObjectStore(y, { keyPath: "id" });
        y !== "projects" && h.createIndex("projectId", "projectId"), y === "projects" && h.createIndex("contextKey", "contextKey", { unique: !0 }), (y === "files" || y === "executions") && h.createIndex("chatId", "chatId");
      }
    }, s.onsuccess = () => l(s.result), s.onerror = () => a(s.error);
  });
}
async function wd(l) {
  const s = (await yn()).transaction("values", "readonly");
  return zo(s.objectStore("values").get(l));
}
async function Sd(l, a) {
  const c = (await yn()).transaction("values", "readwrite");
  c.objectStore("values").put(a, l), await bi(c);
}
async function Io(l, a) {
  const c = (await yn()).transaction(l, "readwrite");
  c.objectStore(l).put(a), await bi(c);
}
async function ih(l, a) {
  const c = (await yn()).transaction(l, "readwrite");
  c.objectStore(l).delete(a), await bi(c);
}
async function Vn(l, a) {
  const c = (await yn()).transaction(l, "readonly");
  return zo(c.objectStore(l).index("projectId").getAll(a));
}
const Gc = (l) => Io("projects", l), Ys = (l) => Io("chats", l), Js = (l) => Io("files", l), lh = (l) => Io("executions", l), Zc = (l) => Io("scripts", l), sh = (l) => ih("files", l);
async function kd(l) {
  return l ? `${l.user_id}:${l.group_id}:${l.object_type}:${l.object_id}` : "standalone";
}
function ah(l) {
  return l.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 64).toLowerCase() || "workspace";
}
function uh(l) {
  return l ? `OMERO/${l.object_type}-${l.object_id}--${ah(l.name)}` : "OMERO/Local--workspace";
}
async function nn(l) {
  const a = typeof l == "string" ? new TextEncoder().encode(l) : new Uint8Array(l), s = await crypto.subtle.digest("SHA-256", a);
  return Array.from(new Uint8Array(s), (c) => c.toString(16).padStart(2, "0")).join("");
}
function la(l, a = "New analysis") {
  const s = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: crypto.randomUUID(),
    projectId: l,
    title: a,
    summary: "",
    archived: !1,
    messages: [],
    createdAt: s,
    updatedAt: s
  };
}
async function ch(l) {
  const s = (await yn()).transaction("projects", "readonly");
  return zo(s.objectStore("projects").index("contextKey").get(l));
}
async function zr(l) {
  const s = (await yn()).transaction([...gd], "readwrite");
  s.objectStore("projects").put(l.project), l.chats.forEach((c) => s.objectStore("chats").put(c)), l.files.forEach((c) => s.objectStore("files").put(c)), l.executions.forEach((c) => s.objectStore("executions").put(c)), l.scripts.forEach((c) => s.objectStore("scripts").put(c)), await bi(s);
}
async function dh(l, a, s) {
  const c = await wd(`workspace:${s}`);
  if (!c) return null;
  const y = (/* @__PURE__ */ new Date()).toISOString();
  a.title = "Imported chat", a.messages = (c.messages || []).map((_) => ({
    id: String(_.id || crypto.randomUUID()),
    role: _.role === "user" ? "user" : "assistant",
    content: String(_.content || _.code || ""),
    kind: _.kind === "error" ? "error" : "text",
    createdAt: y
  })), a.updatedAt = y;
  const h = [];
  for (const _ of c.files || []) {
    const j = _.data instanceof ArrayBuffer ? _.data : void 0;
    h.push({
      id: String(_.id || crypto.randomUUID()),
      projectId: l.id,
      chatId: _.source === "result" ? a.id : void 0,
      name: String(_.name || "file"),
      logicalPath: _.source === "result" ? `${l.rootPath}/chats/${a.id}/outputs/${String(_.name || "file")}` : `${l.rootPath}/inputs/${String(_.name || "file")}`,
      type: String(_.type || "application/octet-stream"),
      size: Number(_.size || (j == null ? void 0 : j.byteLength) || 0),
      sha256: j ? await nn(j) : "",
      source: _.source === "result" ? "result" : _.source === "omero" ? "omero" : "local",
      state: _.state === "failed" ? "failed" : j ? "ready" : "missing",
      data: j,
      error: _.error,
      annotationId: _.annotationId,
      createdAt: y
    });
  }
  const C = { project: l, chats: [a], files: h, executions: [], scripts: [] };
  return await zr(C), await Sd(`migration:v2:${s}`, { completedAt: y }), C;
}
async function fh(l) {
  const a = await kd(l);
  let s = await ch(a);
  if (!s) {
    const _ = (/* @__PURE__ */ new Date()).toISOString(), j = la(crypto.randomUUID());
    s = {
      id: j.projectId,
      contextKey: a,
      rootPath: uh(l),
      name: (l == null ? void 0 : l.name) || "Local workspace",
      objectType: l == null ? void 0 : l.object_type,
      objectId: l == null ? void 0 : l.object_id,
      userId: (l == null ? void 0 : l.user_id) || 0,
      groupId: (l == null ? void 0 : l.group_id) || 0,
      activeChatId: j.id,
      plotCsv: !0,
      createdAt: _,
      updatedAt: _
    };
    const F = await dh(s, j, a);
    if (F) return F;
    const P = { project: s, chats: [j], files: [], executions: [], scripts: [] };
    return await zr(P), P;
  }
  const [c, y, h, C] = await Promise.all([
    Vn("chats", s.id),
    Vn("files", s.id),
    Vn("executions", s.id),
    Vn("scripts", s.id)
  ]);
  if (!c.length) {
    const _ = la(s.id);
    s = { ...s, activeChatId: _.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }, await zr({ project: s, chats: [_], files: y, executions: h, scripts: C }), c.push(_);
  }
  return { project: s, chats: c, files: y, executions: h, scripts: C };
}
async function qs(l) {
  const a = await kd(l), c = (await yn()).transaction("projects", "readonly");
  return (await zo(c.objectStore("projects").getAll())).filter((h) => h.contextKey === a || h.contextKey.startsWith(`${a}:import:`)).sort((h, C) => C.updatedAt.localeCompare(h.updatedAt));
}
async function ph(l) {
  const s = (await yn()).transaction("projects", "readonly"), c = await zo(s.objectStore("projects").get(l));
  if (!c) return;
  const [y, h, C, _] = await Promise.all([
    Vn("chats", c.id),
    Vn("files", c.id),
    Vn("executions", c.id),
    Vn("scripts", c.id)
  ]);
  return { project: c, chats: y, files: h, executions: C, scripts: _ };
}
async function Xi() {
  var a, s;
  const l = await ((s = (a = navigator.storage) == null ? void 0 : a.estimate) == null ? void 0 : s.call(a));
  return { usage: (l == null ? void 0 : l.usage) || 0, quota: (l == null ? void 0 : l.quota) || 0 };
}
const bc = "provider:AmsterdamUMC", ed = {
  apiKey: "",
  model: "",
  contextWindow: 0
}, xd = "nl.bioimaging.analysis-chat.project", jd = 1, hh = 1e4, mh = 512 * 1024 * 1024;
function tn(l) {
  return l.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}
function No(l) {
  return new Uint8Array(oa(l));
}
function vh(l) {
  return { ...l };
}
function td(l, a) {
  const s = {}, c = [], y = l.files.map((j) => {
    const F = { ...j };
    delete F.data;
    const P = j.source === "omero";
    if (j.source === "local" && a)
      return c.push(j.name), F.state = "missing", F.error = "Local input was omitted because the project snapshot exceeded its size limit.", F;
    if (P || !j.data) return F;
    const A = j.source === "local" ? `inputs/local/${tn(j.id)}--${tn(j.name)}` : `chats/${tn(j.chatId || "unassigned")}/outputs/${tn(j.id)}--${tn(j.name)}`;
    return F.archivePath = A, s[A] = new Uint8Array(j.data), F;
  }), h = {
    format: xd,
    version: jd,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    project: vh(l.project),
    chats: l.chats,
    executions: l.executions,
    scripts: l.scripts,
    files: y,
    omittedLocalInputs: c
  };
  s["project.json"] = No(JSON.stringify(h, null, 2));
  for (const j of l.chats)
    s[`chats/${tn(j.id)}/chat.json`] = No(JSON.stringify(j, null, 2)), s[`chats/${tn(j.id)}/chat.md`] = No(gh(j));
  for (const j of l.scripts) {
    s[`scripts/${tn(j.id)}/script.json`] = No(JSON.stringify(j, null, 2));
    for (const F of j.versions)
      s[`scripts/${tn(j.id)}/v${String(F.version).padStart(3, "0")}.py`] = No(F.code);
  }
  const C = th(s, { level: 0 }), _ = `${tn(l.project.rootPath.split("/").at(-1) || "analysis-project")}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.oac.zip`;
  return { data: C, filename: _, omittedLocalInputs: c, manifest: h };
}
function yh(l, a) {
  const s = td(l, !1);
  if (s.data.byteLength <= a) return s;
  const c = td(l, !0);
  if (c.data.byteLength > a)
    throw new Error(
      `Chats, scripts, and generated outputs require ${(c.data.byteLength / 1024 / 1024).toFixed(1)} MiB, exceeding the ${(a / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  return c;
}
function gh(l) {
  const a = [`# ${l.title}`, "", `Updated: ${l.updatedAt}`, ""];
  l.summary && a.push("## Conversation summary", "", l.summary, "");
  for (const s of l.messages)
    s.kind !== "execution" && a.push(`## ${s.role === "user" ? "User" : "Assistant"}`, "", s.content, "");
  return a.join(`
`);
}
function nd(l) {
  if (!l || l.startsWith("/") || l.startsWith("\\") || l.split(/[\\/]/).includes(".."))
    throw new Error(`Unsafe project archive path: ${l}`);
}
function sa(l) {
  return !l || typeof l != "object" ? !1 : Array.isArray(l) ? l.some(sa) : Object.entries(l).some(([a, s]) => {
    const c = a.toLowerCase().replace(/[^a-z0-9]/g, "");
    return c === "apikey" || c === "azurekey" || c === "credential" || sa(s);
  });
}
async function rd(l) {
  var je;
  const a = nh(new Uint8Array(l)), s = Object.keys(a);
  if (s.length > hh) throw new Error("Project archive contains too many entries");
  let c = 0;
  for (const T of s)
    if (nd(T), c += a[T].byteLength, c > mh) throw new Error("Project archive exceeds the 512 MiB workspace limit");
  const y = a["project.json"];
  if (!y) throw new Error("Project archive does not contain project.json");
  const h = JSON.parse(yd(y));
  if (h.format !== xd || h.version !== jd)
    throw new Error("Unsupported Analysis Chat project format");
  if (sa(h))
    throw new Error("Project archive unexpectedly contains an API key field");
  const C = crypto.randomUUID(), _ = new Map(h.chats.map((T) => [T.id, crypto.randomUUID()])), j = new Map(h.executions.map((T) => [T.id, crypto.randomUUID()])), F = new Map(h.files.map((T) => [T.id, crypto.randomUUID()])), P = new Map(h.scripts.map((T) => [T.id, crypto.randomUUID()])), N = (/* @__PURE__ */ new Date()).toISOString(), A = h.chats.map((T) => ({
    ...T,
    id: _.get(T.id),
    projectId: C,
    title: `${T.title} (imported)`,
    messages: T.messages.map((te) => ({
      ...te,
      executionId: te.executionId ? j.get(te.executionId) : void 0
    })),
    updatedAt: N
  })), ne = [];
  for (const T of h.files) {
    let te;
    if (T.archivePath) {
      nd(T.archivePath);
      const ve = a[T.archivePath];
      if (!ve) throw new Error(`Missing archived file: ${T.archivePath}`);
      if (te = ve.buffer.slice(ve.byteOffset, ve.byteOffset + ve.byteLength), T.sha256 && await nn(te) !== T.sha256)
        throw new Error(`Hash mismatch for ${T.name}`);
    }
    ne.push({
      ...T,
      id: F.get(T.id),
      projectId: C,
      chatId: T.chatId ? _.get(T.chatId) : void 0,
      executionId: T.executionId ? j.get(T.executionId) : void 0,
      data: te,
      state: te || T.source === "omero" ? T.state : "missing",
      logicalPath: T.logicalPath.replace(h.project.rootPath, `${h.project.rootPath}--imported`)
    });
  }
  const ae = h.executions.map((T) => ({
    ...T,
    id: j.get(T.id),
    projectId: C,
    chatId: _.get(T.chatId),
    outputFileIds: T.outputFileIds.map((te) => F.get(te)).filter(Boolean),
    reusedFrom: T.reusedFrom ? j.get(T.reusedFrom) : void 0
  })), H = h.scripts.map((T) => ({
    ...T,
    id: P.get(T.id),
    projectId: C,
    versions: T.versions.map((te) => ({
      ...te,
      executionId: j.get(te.executionId) || ""
    })),
    updatedAt: N
  })), X = _.get(h.project.activeChatId) || ((je = A[0]) == null ? void 0 : je.id);
  if (!X) throw new Error("Project archive contains no chats");
  return { project: {
    ...h.project,
    id: C,
    contextKey: `${h.project.contextKey}:import:${C}`,
    rootPath: `${h.project.rootPath}--imported`,
    name: `${h.project.name} (imported)`,
    activeChatId: X,
    createdAt: N,
    updatedAt: N
  }, chats: A, files: ne, executions: ae, scripts: H };
}
const wh = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "scipy",
  "duckdb",
  "pyarrow",
  "python-calamine",
  "xlrd"
], od = "pyodide-314.0.3-oac-0.2";
function Sh(l) {
  const a = JSON.stringify(l.replace(/\/$/, "")), s = JSON.stringify(wh);
  return `
const runtimeBase = ${a};
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
  await pyodide.loadPackage(${s});
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
function removeTree(dir) {
  for (const name of pyodide.FS.readdir(dir)) {
    if (name === "." || name === "..") continue;
    const path = dir + "/" + name;
    const stat = pyodide.FS.stat(path);
    if (pyodide.FS.isDir(stat.mode)) {
      removeTree(path);
      pyodide.FS.rmdir(path);
    } else {
      pyodide.FS.unlink(path);
    }
  }
}
function outputState() {
  const values = new Map();
  const fingerprint = (bytes) => {
    let hash = 2166136261;
    for (let index = 0; index < bytes.length; index += 1) {
      hash ^= bytes[index];
      hash = Math.imul(hash, 16777619);
    }
    return String(bytes.length) + ":" + String(hash >>> 0);
  };
  function walk(dir) {
    for (const name of pyodide.FS.readdir(dir)) {
      if (name === "." || name === "..") continue;
      const path = dir + "/" + name;
      const stat = pyodide.FS.stat(path);
      if (pyodide.FS.isDir(stat.mode)) walk(path);
      else values.set(path, fingerprint(pyodide.FS.readFile(path)));
    }
  }
  walk("/output");
  return values;
}
function outputFiles(before) {
  const values = [];
  const fingerprint = (bytes) => {
    let hash = 2166136261;
    for (let index = 0; index < bytes.length; index += 1) {
      hash ^= bytes[index];
      hash = Math.imul(hash, 16777619);
    }
    return String(bytes.length) + ":" + String(hash >>> 0);
  };
  function walk(dir) {
    for (const name of pyodide.FS.readdir(dir)) {
      if (name === "." || name === "..") continue;
      const path = dir + "/" + name;
      const stat = pyodide.FS.stat(path);
      if (pyodide.FS.isDir(stat.mode)) walk(path);
      else {
        const bytes = pyodide.FS.readFile(path);
        if (before.get(path) === fingerprint(bytes)) continue;
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
    } else if (message.type === "begin") {
      removeTree("/output");
      await pyodide.runPythonAsync(\`
for _oac_name in list(globals()):
    if not _oac_name.startswith("__"):
        globals().pop(_oac_name, None)
\`);
      send(message.id, "begin", true);
    } else if (message.type === "file") {
      const safe = String(message.value.name).replace(/[^A-Za-z0-9._ -]/g, "_");
      pyodide.FS.writeFile("/input/" + safe, new Uint8Array(message.value.data));
      send(message.id, "file", safe);
    } else if (message.type === "run") {
      const before = outputState();
      let stdout = "", stderr = "";
      pyodide.setStdout({batched: (text) => { stdout += text + "\\n"; }});
      pyodide.setStderr({batched: (text) => { stderr += text + "\\n"; }});
      await pyodide.runPythonAsync(message.value.code);
      const raw = await pyodide.runPythonAsync(previewCode);
      const files = outputFiles(before);
      const transfers = files.map((file) => file.data);
      send(message.id, "result", {stdout, stderr, preview: JSON.parse(raw), files}, transfers);
    }
  } catch (error) {
    send(message.id, "error", String(error && error.stack || error));
  }
});
`;
}
function kh(l) {
  const a = new URL(l).origin, s = JSON.stringify(Sh(l));
  return `<!doctype html><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${a}; connect-src ${a}; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:">
<script>
const source = ${s};
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
class xh {
  constructor(a) {
    en(this, "frame", null);
    en(this, "pending", /* @__PURE__ */ new Map());
    en(this, "inputs", []);
    en(this, "counter", 0);
    en(this, "readyPromise", null);
    en(this, "onProgress", null);
    en(this, "receive", (a) => {
      var y;
      if (a.source !== ((y = this.frame) == null ? void 0 : y.contentWindow)) return;
      const s = a.data;
      if (!s || s.source !== "oac-runtime") return;
      if (s.type === "progress") {
        this.report(s.value);
        return;
      }
      const c = this.pending.get(s.id);
      c && (clearTimeout(c.timer), this.pending.delete(s.id), s.type === "error" ? c.reject(new Error(s.value)) : c.resolve(s.value));
    });
    this.runtimeBase = a, window.addEventListener("message", this.receive);
  }
  async start(a, s) {
    s && (this.onProgress = s), this.inputs = a.filter((h) => h.state === "ready" && h.data), this.destroyFrame(), this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const c = document.createElement("iframe");
    c.hidden = !0, c.setAttribute("sandbox", "allow-scripts"), c.setAttribute("aria-hidden", "true");
    const y = new Promise(
      (h) => c.addEventListener("load", () => h(), { once: !0 })
    );
    return c.srcdoc = kh(
      new URL(this.runtimeBase, window.location.href).toString()
    ), document.body.append(c), this.frame = c, this.readyPromise = (async () => {
      await y, this.report({ percent: 8, message: "Connecting to the Python worker…" }), await this.request("ping", !0, 12e4);
      for (let h = 0; h < this.inputs.length; h += 1) {
        const C = this.inputs[h];
        this.report({
          percent: 92 + Math.round(h / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${h + 1} of ${this.inputs.length} data files into Python…`
        });
        const _ = C.data.slice(0);
        await this.request("file", { name: C.name, data: _ }, 3e4, [_]);
      }
      this.report({ percent: 100, message: "Browser Python is ready" });
    })(), this.readyPromise;
  }
  async run(a) {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("run", { code: a }, 12e4);
  }
  async beginTurn() {
    this.readyPromise || await this.start(this.inputs), await this.readyPromise, await this.request("begin", !0, 3e4);
  }
  async reset() {
    return this.start(this.inputs, this.onProgress || void 0);
  }
  stop() {
    for (const a of this.pending.values())
      clearTimeout(a.timer), a.reject(new Error("Python execution stopped"));
    this.pending.clear(), this.destroyFrame();
  }
  dispose() {
    this.stop(), this.destroyFrame(), window.removeEventListener("message", this.receive);
  }
  destroyFrame() {
    var a;
    (a = this.frame) == null || a.remove(), this.frame = null, this.readyPromise = null;
  }
  request(a, s, c, y = []) {
    const h = `runtime-${++this.counter}`;
    return new Promise((C, _) => {
      var F, P;
      const j = window.setTimeout(() => {
        this.pending.delete(h), _(new Error(`${a} exceeded ${c / 1e3} seconds`)), a === "run" && this.start(this.inputs);
      }, c);
      this.pending.set(h, { resolve: C, reject: _, timer: j }), (P = (F = this.frame) == null ? void 0 : F.contentWindow) == null || P.postMessage(
        { source: "oac-parent", id: h, type: a, value: s },
        "*",
        y
      );
    });
  }
  report(a) {
    var s;
    (s = this.onProgress) == null || s.call(this, {
      percent: Math.max(0, Math.min(100, Number(a.percent) || 0)),
      message: String(a.message || "Preparing browser Python…")
    });
  }
}
const jh = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, id = 256 * 1024 * 1024, Tt = () => crypto.randomUUID(), Le = () => (/* @__PURE__ */ new Date()).toISOString(), ld = (l) => l.toLowerCase().endsWith(".png") ? "image/png" : l.toLowerCase().endsWith(".svg") ? "image/svg+xml" : l.toLowerCase().endsWith(".csv") ? "text/csv" : l.toLowerCase().endsWith(".json") ? "application/json" : "application/octet-stream";
function Yi(l) {
  return l.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function _h(l) {
  const a = l.replace(/\s+/g, " ").trim().slice(0, 64);
  return a ? a.charAt(0).toUpperCase() + a.slice(1) : "New analysis";
}
function Eh(l) {
  return JSON.stringify(
    l.map((a) => ({
      path: a.source === "result" ? `/output/${a.name}` : `/input/${a.name}`,
      logical_path: a.logicalPath,
      sha256: a.sha256,
      size: a.size,
      type: a.type,
      state: a.state
    }))
  );
}
function Gs(l) {
  return Math.max(1, Math.ceil(JSON.stringify(l).length / 4));
}
function Ch(l, a) {
  if (!l) return "Context usage appears after the first AI response.";
  const s = l.promptTokens + l.completionTokens, c = l.estimated ? "estimated" : "API reported", y = a > 0 ? ` · ${Math.min(100, Math.round(s / a * 100))}% of ${a.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${l.promptTokens.toLocaleString()} input + ${l.completionTokens.toLocaleString()} output tokens (${c})${y} · session: ${l.sessionTokens.toLocaleString()}`;
}
function Ph(l) {
  return l.filter((a) => a.kind !== "execution").slice(0, -12).map((a) => `${a.role}: ${a.content.replace(/\s+/g, " ").slice(0, 240)}`).join(`
`).slice(-12e3);
}
function Ji(l) {
  return l >= 1024 * 1024 * 1024 ? `${(l / 1024 / 1024 / 1024).toFixed(1)} GiB` : l >= 1024 * 1024 ? `${(l / 1024 / 1024).toFixed(1)} MiB` : l >= 1024 ? `${(l / 1024).toFixed(1)} KiB` : `${l} bytes`;
}
function sd(l) {
  return (l == null ? void 0 : l.files.reduce((a, s) => a + s.size, 0)) || 0;
}
function Nh() {
  const l = window.OMERO_ANALYSIS_CHAT, a = Be.useMemo(() => new Ip(l), [l]), s = Be.useMemo(() => new xh(l.runtimeBase), [l]), [c, y] = Be.useState(null), h = Be.useRef(null), [C, _] = Be.useState([]), [j, F] = Be.useState([]), [P, N] = Be.useState(ed), [A, ne] = Be.useState(""), [ae, H] = Be.useState(!1), [X, Te] = Be.useState(!1), [je, T] = Be.useState("Preparing project…"), [te, ve] = Be.useState(!1), [we, pe] = Be.useState(null), [re, Z] = Be.useState({
    percent: 0,
    message: "Preparing the browser workspace…"
  }), [Pe, Ee] = Be.useState({ usage: 0, quota: 0 }), xe = Be.useRef(null), Me = Be.useRef(null), Ne = Be.useRef(null), Se = Be.useRef(/* @__PURE__ */ new Set());
  h.current = c;
  const de = (c == null ? void 0 : c.project) || null, le = (c == null ? void 0 : c.chats) || [], z = le.find((d) => d.id === (de == null ? void 0 : de.activeChatId)) || le[0] || null, B = ((c == null ? void 0 : c.files) || []).filter((d) => d.source !== "result"), U = ((c == null ? void 0 : c.files) || []).filter(
    (d) => d.source === "result" && d.chatId === (z == null ? void 0 : z.id)
  ), v = B.filter((d) => d.state !== "ready"), E = !!z && X && v.length === 0 && !!(P.apiKey && P.model) && !ae, b = ae ? "Analysis in progress — wait for the answer or press Stop…" : v.some((d) => d.state === "failed" || d.state === "missing") ? "Chat is blocked — retry, reselect, or remove the missing data file…" : v.length ? "Downloading selected data — chat will unlock when every file is ready…" : X ? !P.apiKey || !P.model ? "Configure the AmsterdamUMC deployment and API key before asking a question…" : "Ask a question about the loaded data…" : `${re.message} (${Math.round(re.percent)}%) — please wait…`;
  Be.useEffect(() => {
    const d = Me.current;
    if (!d) return;
    const g = requestAnimationFrame(() => {
      d.scrollTo({ top: d.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(g);
  }, [z == null ? void 0 : z.messages, c == null ? void 0 : c.executions, c == null ? void 0 : c.files]), Be.useEffect(() => {
    let d = !0;
    return (async () => {
      const [g, O] = await Promise.all([
        wd(bc),
        fh(l.context)
      ]);
      if (!d) return;
      g && N({ ...ed, ...g }), await a.connect();
      let $ = await ee(O);
      d && (y($), h.current = $, _(await qs(l.context)), F(await a.listSnapshots()), await ce($.files), d && (Te(!0), Z({ percent: 100, message: "Browser Python is ready" }), T("Ready — analysis runs locally in this browser"), Ee(await Xi())));
    })().catch((g) => {
      d && (T(`Project failed: ${String(g)}`), Z({ percent: 0, message: `Project failed: ${String(g)}` }));
    }), () => {
      d = !1, s.dispose();
    };
  }, [l, a, s]);
  async function ee(d) {
    var K;
    let g = d;
    const O = new Map(
      g.files.filter((J) => J.annotationId).map((J) => [J.annotationId, J])
    ), $ = ((K = l.context) == null ? void 0 : K.selected_attachments) || [];
    for (const J of $) {
      if (O.has(J.annotation_id)) continue;
      const ye = {
        id: Tt(),
        projectId: g.project.id,
        name: J.name,
        logicalPath: `${g.project.rootPath}/inputs/${J.annotation_id}--${J.name}`,
        type: J.mimetype,
        size: J.size,
        sha256: "",
        source: "omero",
        state: "loading",
        annotationId: J.annotation_id,
        fileId: J.file_id,
        createdAt: Le()
      };
      g = { ...g, files: [...g.files, ye] }, O.set(J.annotation_id, ye);
    }
    const D = g.files.filter(
      (J) => J.source === "omero" && J.annotationId && (!J.data || J.state !== "ready")
    );
    for (let J = 0; J < D.length; J += 1) {
      const ye = D[J];
      Z({
        percent: Math.round(J / Math.max(1, D.length) * 90),
        message: `Downloading ${J + 1} of ${D.length} OMERO inputs…`
      });
      try {
        const ot = {
          annotation_id: ye.annotationId,
          file_id: ye.fileId || 0,
          name: ye.name,
          mimetype: ye.type,
          size: ye.size,
          kind: "attachment",
          supported: !0
        }, ze = await a.download(ot), Ie = await nn(ze);
        if (ye.sha256 && ye.sha256 !== Ie)
          throw new Error(
            `OMERO input ${ye.name} no longer matches the snapshot hash`
          );
        const Ye = {
          ...ye,
          data: ze,
          size: ze.byteLength,
          sha256: Ie,
          state: "ready",
          error: void 0
        };
        g = {
          ...g,
          files: g.files.map((He) => He.id === ye.id ? Ye : He)
        }, await Js(Ye);
      } catch (ot) {
        const ze = { ...ye, state: "failed", error: String(ot) };
        g = {
          ...g,
          files: g.files.map((Ie) => Ie.id === ye.id ? ze : Ie)
        }, await Js(ze);
      }
    }
    return await zr(g), g;
  }
  function G(d) {
    Z(d), T(d.message);
  }
  async function ce(d) {
    Te(!1), Z({ percent: 1, message: "Starting browser Python…" }), await s.start(
      d.filter((g) => g.source !== "result" && g.state === "ready"),
      G
    );
  }
  async function fe(d, g) {
    await ce(d), Te(!0), Z({ percent: 100, message: "Browser Python is ready" }), T(g);
  }
  function he(d) {
    const g = h.current;
    if (g) {
      const O = { ...g, project: d };
      h.current = O, y(O);
    }
    Gc(d);
  }
  function ke(d) {
    const g = h.current;
    if (g) {
      const O = {
        ...g,
        chats: g.chats.map(($) => $.id === d.id ? d : $)
      };
      h.current = O, y(O);
    }
    Ys(d);
  }
  function Ae(d, g) {
    const O = h.current;
    if (!O) return;
    const $ = O.chats.find((J) => J.id === d);
    if (!$) return;
    const D = { ...$, messages: [...$.messages, g], updatedAt: Le() }, K = {
      ...O,
      chats: O.chats.map((J) => J.id === d ? D : J)
    };
    h.current = K, y(K), Ys(D);
  }
  function ut(d) {
    const g = h.current;
    if (!g) return;
    const O = g.executions.some((D) => D.id === d.id), $ = {
      ...g,
      executions: O ? g.executions.map((D) => D.id === d.id ? d : D) : [...g.executions, d]
    };
    h.current = $, y($), lh(d);
  }
  function mt(d) {
    if (!d.length) return;
    const g = h.current;
    if (!g) return;
    const O = new Set(d.map((D) => D.id)), $ = {
      ...g,
      files: [...g.files.filter((D) => !O.has(D.id)), ...d]
    };
    h.current = $, y($), d.forEach((D) => void Js(D));
  }
  async function ct(d) {
    N(d), await Sd(bc, d);
  }
  async function ln(d) {
    if (!d || !c) return;
    const g = [];
    let O = sd(c);
    for (const D of Array.from(d)) {
      if (!jh.test(D.name)) {
        T(`${D.name} is not a supported tabular data file`);
        continue;
      }
      if (D.size > Qc) {
        T(`${D.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (O += D.size, O > Tp) {
        T("The project would exceed 512 MiB");
        break;
      }
      const K = await D.arrayBuffer(), J = await nn(K);
      if ([...c.files, ...g].some(
        (ye) => ye.sha256 === J && ye.size === K.byteLength
      )) {
        T(`${D.name} matches a file already stored in this project`);
        continue;
      }
      g.push({
        id: Tt(),
        projectId: c.project.id,
        name: D.name,
        logicalPath: `${c.project.rootPath}/inputs/${D.name}`,
        type: D.type || ld(D.name),
        size: K.byteLength,
        sha256: J,
        source: "local",
        state: "ready",
        data: K,
        createdAt: Le()
      });
    }
    const $ = [...c.files, ...g];
    mt(g), await fe($, "Local inputs added; browser Python is ready"), Ee(await Xi());
  }
  async function Ir(d) {
    if (!c) return;
    const g = c.files.find((D) => D.id === d);
    if (!g) return;
    const O = c.files.filter((D) => D.id !== d), $ = { ...c, files: O };
    h.current = $, y($), await sh(d), g.source !== "result" && await fe(O, "Input removed; browser Python was reset"), Ee(await Xi());
  }
  async function Lo(d) {
    if (!c) return;
    const g = c.files.find(($) => $.id === d);
    if (!(g != null && g.annotationId)) return;
    const O = { ...g, state: "loading", error: void 0 };
    mt([O]);
    try {
      const $ = await a.download({
        annotation_id: g.annotationId,
        file_id: g.fileId || 0,
        name: g.name,
        mimetype: g.type,
        size: g.size,
        kind: "attachment",
        supported: !0
      }), D = {
        ...g,
        data: $,
        size: $.byteLength,
        sha256: await nn($),
        state: "ready",
        error: void 0
      }, K = c.files.map((J) => J.id === g.id ? D : J);
      mt([D]), await fe(K, "OMERO input restored; project ready");
    } catch ($) {
      mt([{ ...g, state: "failed", error: String($) }]);
    }
  }
  async function Lr() {
    if (!c) return;
    const d = la(c.project.id), g = { ...c.project, activeChatId: d.id, updatedAt: Le() }, O = { ...c, project: g, chats: [...c.chats, d] };
    h.current = O, y(O), await Promise.all([Ys(d), Gc(g)]), pe(null), Se.current.clear(), await s.beginTurn();
  }
  function Oo(d) {
    if (!c) return;
    const g = c.chats.find(($) => $.id === d);
    g != null && g.archived && ke({ ...g, archived: !1, updatedAt: Le() });
    const O = { ...c.project, activeChatId: d, updatedAt: Le() };
    he(O), pe(null);
  }
  function Or(d) {
    var O;
    const g = (O = window.prompt("Chat name", d.title)) == null ? void 0 : O.trim();
    g && ke({ ...d, title: g.slice(0, 100), updatedAt: Le() });
  }
  function Hn(d) {
    if (!c || c.chats.filter(($) => !$.archived).length <= 1) {
      T("Create another chat before archiving this one");
      return;
    }
    const g = { ...d, archived: !0, updatedAt: Le() }, O = c.chats.find(($) => $.id !== d.id && !$.archived);
    ke(g), he({ ...c.project, activeChatId: O.id, updatedAt: Le() });
  }
  async function gn(d) {
    const g = await ph(d);
    if (!g) return;
    const O = await ee(g);
    y(O), h.current = O, await fe(O.files, "Project loaded");
  }
  async function wn(d, g, O, $ = !1) {
    const D = h.current;
    if (!D) return Kt("Project is not ready");
    const K = d.replace(/\r\n/g, `
`).trimEnd(), J = await nn(K), ye = D.files.filter((se) => se.source !== "result" && se.state === "ready").map((se) => se.sha256).sort(), ot = await nn(
      `${J}|${ye.join(",")}|${od}|plotCsv=${D.project.plotCsv}`
    ), ze = D.executions.filter((se) => se.cacheKey === ot && se.status !== "running").sort((se, me) => me.createdAt.localeCompare(se.createdAt))[0];
    if (ze && !$) {
      const se = {
        ...ze,
        id: Tt(),
        chatId: g,
        promptId: O,
        status: ze.status === "success" || ze.status === "reused" ? "reused" : "failed",
        reusedFrom: ze.id,
        createdAt: Le()
      };
      return ut(se), Ae(g, {
        id: Tt(),
        role: "assistant",
        content: se.status === "reused" ? "Reused a previous successful local Python run because its code and inputs are unchanged." : "Skipped unchanged Python that already failed; AmsterdamUMC must correct the code.",
        kind: "execution",
        executionId: se.id,
        createdAt: Le()
      }), se.status === "reused" ? JSON.stringify({
        reused: !0,
        execution_id: ze.id,
        stdout: ze.stdout,
        stderr: ze.stderr,
        preview: ze.preview,
        generated_files: ze.outputFileIds.map((me) => D.files.find((it) => it.id === me)).filter(Boolean).map((me) => ({ name: me.name, size: me.size, type: me.type }))
      }) : Kt(
        `Identical code already failed:
${ze.stderr || ze.stdout}. Modify the code before trying again.`
      );
    }
    const Ie = {
      id: Tt(),
      projectId: D.project.id,
      chatId: g,
      promptId: O,
      code: K,
      codeHash: J,
      cacheKey: ot,
      status: "running",
      stdout: "",
      stderr: "",
      outputFileIds: [],
      missingPlotCsv: [],
      inputHashes: ye,
      runtimeVersion: od,
      model: P.model,
      createdAt: Le()
    };
    ut(Ie), Ae(g, {
      id: Tt(),
      role: "assistant",
      content: "Python execution",
      kind: "execution",
      executionId: Ie.id,
      createdAt: Le()
    });
    let Ye;
    try {
      Ye = await s.run(K);
    } catch (se) {
      const me = String(se instanceof Error ? se.message : se).slice(0, qi), it = { ...Ie, status: "failed", stderr: me };
      return ut(it), T("Python error sent to AmsterdamUMC; waiting for corrected code…"), Kt(se);
    }
    const He = [];
    for (const se of Ye.files) {
      const me = Tt();
      He.push({
        id: me,
        projectId: D.project.id,
        chatId: g,
        executionId: Ie.id,
        name: se.name,
        logicalPath: `${D.project.rootPath}/chats/${g}/outputs/${Ie.id}/${se.name}`,
        type: se.type,
        size: se.data.byteLength,
        sha256: await nn(se.data),
        source: "result",
        state: "ready",
        data: se.data,
        createdAt: Le()
      }), Se.current.add(se.name);
    }
    mt(He);
    const et = D.project.plotCsv ? Array.from(Se.current).filter((se) => /\.(png|svg)$/i.test(se)).filter((se) => !Se.current.has(se.replace(/\.(png|svg)$/i, ".csv"))) : [], zt = {
      ...Ie,
      status: et.length ? "incomplete" : "success",
      stdout: Ye.stdout,
      stderr: Ye.stderr,
      preview: Ye.preview,
      outputFileIds: He.map((se) => se.id),
      missingPlotCsv: et
    };
    if (ut(zt), !et.length) {
      const se = h.current;
      for (const me of (se == null ? void 0 : se.executions) || []) {
        if (me.chatId !== g || me.promptId !== O || !me.missingPlotCsv.length) continue;
        const it = me.missingPlotCsv.filter(
          (ar) => !Se.current.has(ar.replace(/\.(png|svg)$/i, ".csv"))
        );
        it.length !== me.missingPlotCsv.length && ut({
          ...me,
          status: it.length ? "incomplete" : "success",
          missingPlotCsv: it
        });
      }
    }
    return T("Python completed locally; continuing the analysis…"), et.length ? Kt(
      `Plot data CSV required. Create ${et.map((se) => se.replace(/\.(png|svg)$/i, ".csv")).join(", ")} containing the data used for the plot. Do not regenerate unrelated analysis.`
    ) : Op(Ye);
  }
  async function Mo(d, g, O) {
    let $ = {};
    try {
      $ = JSON.parse(d.function.arguments || "{}");
    } catch (K) {
      return Kt(`Invalid JSON tool arguments: ${String(K)}`);
    }
    const D = h.current;
    if (!D) return Kt("Project is not ready");
    if (d.function.name === "list_workspace_files") return Eh(D.files);
    if (d.function.name === "reset_python")
      try {
        return await s.beginTurn(), Se.current.clear(), "Python state reset; canonical project inputs remain available.";
      } catch (K) {
        return Kt(K);
      }
    if (d.function.name === "list_saved_scripts")
      return JSON.stringify(D.scripts.map((K) => ({
        id: K.id,
        name: K.name,
        description: K.description,
        current_version: K.currentVersion,
        updated_at: K.updatedAt
      })));
    if (d.function.name === "read_saved_script") {
      const K = D.scripts.find((ye) => ye.id === $.script_id);
      if (!K) return Kt("Saved script was not found");
      const J = K.versions.find((ye) => ye.version === K.currentVersion);
      return J ? JSON.stringify({ id: K.id, name: K.name, version: J.version, code: J.code }) : Kt("Saved script has no readable current version");
    }
    if (d.function.name === "run_saved_script") {
      const K = D.scripts.find((ye) => ye.id === $.script_id), J = K == null ? void 0 : K.versions.find((ye) => ye.version === K.currentVersion);
      return J ? wn(J.code, g, O) : Kt("Saved script was not found");
    }
    return d.function.name !== "run_python" || typeof $.code != "string" ? Kt(`Unsupported or invalid tool call: ${d.function.name}`) : wn($.code, g, O);
  }
  async function Mr() {
    var Ye, He, et, zt, se, me, it, ar;
    const d = A.trim(), g = h.current, O = g == null ? void 0 : g.chats.find((Qe) => Qe.id === g.project.activeChatId);
    if (!d || !E || !g || !O) return;
    ne(""), H(!0), xe.current = new AbortController(), Se.current.clear(), await s.beginTurn();
    const $ = Tt(), D = {
      id: $,
      role: "user",
      content: d,
      createdAt: Le()
    };
    Ae(O.id, D);
    let K = {
      ...O,
      messages: [...O.messages, D],
      updatedAt: Le()
    };
    O.messages.filter((Qe) => Qe.role === "user").length === 0 && (K = { ...K, title: _h(d) }, ke(K));
    const J = P.contextWindow > 0 ? Math.floor(P.contextWindow * 0.6) : 24e3, ye = K.messages.filter((Qe) => Qe.kind !== "execution");
    Gs(ye) > J && (K = { ...K, summary: Ph(ye), updatedAt: Le() }, ke(K));
    const ot = `${Rp}

Project root: ${g.project.rootPath}
The user has ${g.scripts.length} saved scripts. ${g.project.plotCsv ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data." : "Plot CSV mode is OFF."}`, ze = ye.slice(-12), Ie = [
      { role: "system", content: ot },
      ...K.summary ? [{ role: "system", content: `Earlier conversation summary:
${K.summary}` }] : [],
      ...ze.map((Qe) => ({ role: Qe.role, content: Qe.content }))
    ];
    ((Ye = Ie.at(-1)) == null ? void 0 : Ye.content) !== d && Ie.push({ role: "user", content: d });
    try {
      for (let Qe = 0; Qe < 8; Qe += 1) {
        const Do = Gs(Ie), kn = await Lp(P, Ie, xe.current.signal), $t = (He = kn.choices[0]) == null ? void 0 : He.message;
        if (!$t) throw new Error("AmsterdamUMC returned no response");
        const Vr = ((et = kn.usage) == null ? void 0 : et.prompt_tokens) ?? Do, Wr = ((zt = kn.usage) == null ? void 0 : zt.completion_tokens) ?? Gs($t.content || $t.tool_calls || ""), Hr = ((se = kn.usage) == null ? void 0 : se.total_tokens) ?? Vr + Wr;
        if (pe((sn) => ({
          promptTokens: Vr,
          completionTokens: Wr,
          totalTokens: Hr,
          sessionTokens: ((sn == null ? void 0 : sn.sessionTokens) || 0) + Hr,
          estimated: !kn.usage
        })), Ie.push({ role: "assistant", content: $t.content, tool_calls: $t.tool_calls }), $t.content && Ae(O.id, {
          id: Tt(),
          role: "assistant",
          content: $t.content,
          createdAt: Le()
        }), !((me = $t.tool_calls) != null && me.length)) break;
        for (const sn of $t.tool_calls) {
          const nl = await Mo(sn, O.id, $);
          Ie.push({ role: "tool", tool_call_id: sn.id, content: nl });
        }
        if (Qe === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (Qe) {
      (it = xe.current) != null && it.signal.aborted || Ae(O.id, {
        id: Tt(),
        role: "assistant",
        content: String(Qe),
        kind: "error",
        createdAt: Le()
      });
    } finally {
      (ar = xe.current) != null && ar.signal.aborted || T("Ready — analysis runs locally in this browser"), xe.current = null, H(!1), Ee(await Xi());
    }
  }
  function Ao() {
    var d, g;
    (d = xe.current) == null || d.abort(), s.stop(), H(!1), fe(((g = h.current) == null ? void 0 : g.files) || [], "Ready — analysis runs locally in this browser");
  }
  async function Fo(d) {
    var zt, se;
    const g = h.current;
    if (!g || !["success", "reused"].includes(d.status)) return;
    const O = g.chats.find((me) => me.id === d.chatId), $ = O == null ? void 0 : O.messages.find((me) => me.id === d.promptId), D = g.executions.filter(
      (me) => me.chatId === d.chatId && me.promptId === d.promptId && ["success", "incomplete"].includes(me.status)
    ).sort((me, it) => me.createdAt.localeCompare(it.createdAt)), K = Array.from(new Set(D.map((me) => me.code))).join(
      `

# Continued analysis / automatic repair
`
    ) || d.code, J = await nn(K), ye = `${Yi(($ == null ? void 0 : $.content) || "analysis-script")}.py`, ot = (zt = window.prompt("Script filename", ye)) == null ? void 0 : zt.trim();
    if (!ot) return;
    const ze = `${Yi(ot.replace(/\.py$/i, ""))}.py`, Ie = ((se = window.prompt(
      "Script description",
      ($ == null ? void 0 : $.content.slice(0, 180)) || "Reusable Analysis Chat workflow"
    )) == null ? void 0 : se.trim()) || "", Ye = g.scripts.find((me) => me.name.toLowerCase() === ze.toLowerCase()), He = Ye ? {
      ...Ye,
      description: Ie,
      currentVersion: Ye.currentVersion + 1,
      versions: [...Ye.versions, {
        version: Ye.currentVersion + 1,
        code: K,
        codeHash: J,
        executionId: d.id,
        createdAt: Le()
      }],
      updatedAt: Le()
    } : {
      id: Tt(),
      projectId: g.project.id,
      name: ze,
      description: Ie,
      currentVersion: 1,
      versions: [{
        version: 1,
        code: K,
        codeHash: J,
        executionId: d.id,
        createdAt: Le()
      }],
      createdAt: Le(),
      updatedAt: Le()
    }, et = h.current;
    if (et) {
      const me = {
        ...et,
        scripts: Ye ? et.scripts.map((it) => it.id === He.id ? He : it) : [...et.scripts, He]
      };
      h.current = me, y(me);
    }
    await Zc(He), T(`Saved ${He.name} version ${He.currentVersion}`);
  }
  async function Ar(d) {
    const g = h.current;
    if (!(g != null && g.project.activeChatId)) return;
    const O = d.versions.find((D) => D.version === d.currentVersion);
    if (!O) return;
    H(!0), Se.current.clear(), await s.beginTurn();
    const $ = Tt();
    Ae(g.project.activeChatId, {
      id: $,
      role: "user",
      content: `Run saved script ${d.name} version ${d.currentVersion}`,
      createdAt: Le()
    });
    try {
      await wn(O.code, g.project.activeChatId, $, !0), T(`Ran ${d.name} locally`);
    } finally {
      H(!1);
    }
  }
  function lr(d) {
    var D;
    const g = (D = window.prompt("Script filename", d.name)) == null ? void 0 : D.trim();
    if (!g) return;
    const O = { ...d, name: `${Yi(g.replace(/\.py$/i, ""))}.py`, updatedAt: Le() }, $ = h.current;
    if ($) {
      const K = {
        ...$,
        scripts: $.scripts.map((J) => J.id === d.id ? O : J)
      };
      h.current = K, y(K);
    }
    Zc(O);
  }
  function sr(d, g, O) {
    const $ = (g instanceof Uint8Array, g), D = URL.createObjectURL(new Blob([$], { type: O })), K = document.createElement("a");
    K.href = D, K.download = d, K.click(), setTimeout(() => URL.revokeObjectURL(D), 1e3);
  }
  function Qn(d) {
    d.data && sr(d.name, d.data, d.type);
  }
  function Kn(d) {
    const g = d.versions.find((O) => O.version === d.currentVersion);
    g && sr(d.name, new TextEncoder().encode(g.code), "text/x-python");
  }
  async function el(d) {
    if (confirm(`Attach ${d.name} to the selected OMERO object?`))
      try {
        const g = await a.attach(d);
        T(`Attached ${g.name} as FileAnnotation ${g.annotation_id}`);
      } catch (g) {
        T(`Attach failed: ${String(g)}`);
      }
  }
  async function Fr() {
    var g;
    const d = h.current;
    if (!d) throw new Error("Project is not ready");
    return yh(
      d,
      ((g = l.context) == null ? void 0 : g.max_snapshot_bytes) ?? id
    );
  }
  async function $o() {
    try {
      const d = await Fr();
      sr(d.filename, d.data, "application/zip"), T(
        d.omittedLocalInputs.length ? `Project downloaded; omitted local inputs: ${d.omittedLocalInputs.join(", ")}` : "Complete project downloaded"
      );
    } catch (d) {
      T(`Project export failed: ${String(d)}`);
    }
  }
  async function tl() {
    if (a.canUpload)
      try {
        const d = await Fr();
        if (d.omittedLocalInputs.length && !confirm(
          `The snapshot is too large to include these local inputs:
${d.omittedLocalInputs.join(`
`)}

Save the snapshot without them?`
        )) return;
        const g = await a.uploadSnapshot(d.filename, d.data);
        F((O) => [...O, g]), T(`Saved project snapshot as FileAnnotation ${g.annotation_id}`);
      } catch (d) {
        T(`OMERO project snapshot failed: ${String(d)}`);
      }
  }
  async function $r(d) {
    var g;
    if (d)
      try {
        const O = ((g = l.context) == null ? void 0 : g.max_snapshot_bytes) ?? id;
        if (d.size > O)
          throw new Error(
            `Project archive exceeds the configured ${Math.floor(O / 1024 / 1024)} MiB limit`
          );
        const $ = await rd(await d.arrayBuffer());
        if (l.context && ($.project.objectType !== l.context.object_type || $.project.objectId !== l.context.object_id))
          throw new Error("Project snapshot belongs to a different OMERO object");
        await zr($);
        const D = await ee($);
        y(D), h.current = D, _(await qs(l.context)), await fe(D.files, "Imported project restored");
      } catch (O) {
        T(`Project import failed: ${String(O)}`);
      } finally {
        Ne.current && (Ne.current.value = "");
      }
  }
  async function Dr(d) {
    try {
      T(`Downloading ${d.name}…`);
      const g = await rd(await a.downloadSnapshot(d));
      if (l.context && (g.project.objectType !== l.context.object_type || g.project.objectId !== l.context.object_id))
        throw new Error("Project snapshot belongs to a different OMERO object");
      await zr(g);
      const O = await ee(g);
      y(O), h.current = O, _(await qs(l.context)), await fe(O.files, "OMERO project snapshot restored");
    } catch (g) {
      T(`Snapshot restore failed: ${String(g)}`);
    }
  }
  function Ur() {
    de && he({ ...de, plotCsv: !de.plotCsv, updatedAt: Le() });
  }
  if (!c || !de || !z)
    return /* @__PURE__ */ S.jsx("main", { className: "app-shell", children: /* @__PURE__ */ S.jsx("div", { className: "boot-message", children: je }) });
  const Xn = Pe.quota ? Math.round(Pe.usage / Pe.quota * 100) : 0;
  return /* @__PURE__ */ S.jsxs("main", { className: "app-shell", children: [
    /* @__PURE__ */ S.jsxs("header", { className: "project-header", children: [
      /* @__PURE__ */ S.jsxs("div", { children: [
        /* @__PURE__ */ S.jsx("h1", { children: "OMERO.AnalysisChat" }),
        /* @__PURE__ */ S.jsx("p", { children: de.rootPath })
      ] }),
      /* @__PURE__ */ S.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ S.jsxs("label", { className: "csv-toggle", title: "Require a matching CSV for every generated plot", children: [
          /* @__PURE__ */ S.jsx("input", { type: "checkbox", checked: de.plotCsv, onChange: Ur }),
          "Plot + CSV"
        ] }),
        /* @__PURE__ */ S.jsx("span", { className: "privacy-badge", children: "Source data stay in this browser" }),
        /* @__PURE__ */ S.jsx("button", { onClick: () => ve(!te), children: "AI settings" })
      ] })
    ] }),
    te && /* @__PURE__ */ S.jsxs("section", { className: "settings-card", children: [
      /* @__PURE__ */ S.jsx("h2", { children: "AmsterdamUMC" }),
      /* @__PURE__ */ S.jsx("p", { className: "warning", children: "The API key is stored unencrypted in this browser profile. It is never included in project snapshots." }),
      /* @__PURE__ */ S.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ S.jsx("input", { value: P.model, onChange: (d) => void ct({ ...P, model: d.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ S.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ S.jsx("input", { type: "password", value: P.apiKey, onChange: (d) => void ct({ ...P, apiKey: d.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ S.jsxs("label", { children: [
        "Model context window (optional)",
        /* @__PURE__ */ S.jsx("input", { type: "number", min: "0", value: P.contextWindow || "", onChange: (d) => void ct({ ...P, contextWindow: Math.max(0, Number(d.target.value) || 0) }) })
      ] }),
      /* @__PURE__ */ S.jsx("p", { children: "Temperature is fixed at 1." }),
      /* @__PURE__ */ S.jsx("button", { onClick: () => void ct({ ...P, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "project-toolbar", children: [
      /* @__PURE__ */ S.jsxs("label", { children: [
        "Project",
        /* @__PURE__ */ S.jsx("select", { value: de.id, onChange: (d) => void gn(d.target.value), children: C.map((d) => /* @__PURE__ */ S.jsx("option", { value: d.id, children: d.name }, d.id)) })
      ] }),
      /* @__PURE__ */ S.jsxs("label", { children: [
        "Chat",
        /* @__PURE__ */ S.jsxs("select", { value: z.id, onChange: (d) => Oo(d.target.value), children: [
          /* @__PURE__ */ S.jsx("optgroup", { label: "Active chats", children: le.filter((d) => !d.archived).map((d) => /* @__PURE__ */ S.jsx("option", { value: d.id, children: d.title }, d.id)) }),
          le.some((d) => d.archived) && /* @__PURE__ */ S.jsx("optgroup", { label: "Archived chats", children: le.filter((d) => d.archived).map((d) => /* @__PURE__ */ S.jsxs("option", { value: d.id, children: [
            d.title,
            " (archived)"
          ] }, d.id)) })
        ] })
      ] }),
      /* @__PURE__ */ S.jsx("button", { onClick: () => void Lr(), children: "New chat" }),
      /* @__PURE__ */ S.jsx("button", { onClick: () => Or(z), children: "Rename" }),
      /* @__PURE__ */ S.jsx("button", { onClick: () => Hn(z), children: "Archive" }),
      /* @__PURE__ */ S.jsx("button", { onClick: () => void $o(), children: "Download project ZIP" }),
      /* @__PURE__ */ S.jsx("button", { onClick: () => {
        var d;
        return (d = Ne.current) == null ? void 0 : d.click();
      }, children: "Import project ZIP" }),
      /* @__PURE__ */ S.jsx("input", { ref: Ne, hidden: !0, type: "file", accept: ".zip,.oac.zip", onChange: (d) => {
        var g;
        return void $r(((g = d.target.files) == null ? void 0 : g[0]) || null);
      } }),
      a.canUpload && /* @__PURE__ */ S.jsx("button", { onClick: () => void tl(), children: "Save project to OMERO" })
    ] }),
    /* @__PURE__ */ S.jsxs("div", { className: "workspace", children: [
      /* @__PURE__ */ S.jsxs("aside", { className: "project-tree", children: [
        /* @__PURE__ */ S.jsxs("div", { className: "aside-heading", children: [
          /* @__PURE__ */ S.jsxs("div", { children: [
            /* @__PURE__ */ S.jsx("h2", { children: "Project files" }),
            /* @__PURE__ */ S.jsxs("small", { children: [
              Ji(sd(c)),
              " · browser ",
              Xn || "?",
              "%"
            ] })
          ] }),
          /* @__PURE__ */ S.jsxs("label", { className: "upload-button", children: [
            "Add files",
            /* @__PURE__ */ S.jsx("input", { type: "file", multiple: !0, onChange: (d) => void ln(d.target.files) })
          ] })
        ] }),
        Xn >= 75 && /* @__PURE__ */ S.jsxs("p", { className: "quota-warning", children: [
          "Browser storage is ",
          Xn,
          "% full. Archive or download old projects."
        ] }),
        /* @__PURE__ */ S.jsxs("details", { open: !0, className: "tree-folder", children: [
          /* @__PURE__ */ S.jsxs("summary", { children: [
            "inputs/ ",
            /* @__PURE__ */ S.jsx("small", { children: B.length })
          ] }),
          /* @__PURE__ */ S.jsx("ul", { className: "file-list", children: B.map((d) => /* @__PURE__ */ S.jsxs("li", { className: `file-${d.state}`, children: [
            /* @__PURE__ */ S.jsxs("div", { children: [
              /* @__PURE__ */ S.jsx("strong", { children: d.name }),
              /* @__PURE__ */ S.jsxs("small", { children: [
                Ji(d.size),
                " · ",
                d.source,
                " · ",
                d.sha256.slice(0, 10) || "unhashed"
              ] })
            ] }),
            /* @__PURE__ */ S.jsx("span", { children: d.state }),
            d.error && /* @__PURE__ */ S.jsx("p", { children: d.error }),
            /* @__PURE__ */ S.jsxs("div", { className: "file-actions", children: [
              (d.state === "failed" || d.state === "missing") && d.annotationId && /* @__PURE__ */ S.jsx("button", { onClick: () => void Lo(d.id), children: "Retry" }),
              d.state === "missing" && d.source === "local" && /* @__PURE__ */ S.jsxs("label", { className: "mini-upload", children: [
                "Reselect",
                /* @__PURE__ */ S.jsx("input", { type: "file", onChange: (g) => {
                  var O;
                  return void Br(d, ((O = g.target.files) == null ? void 0 : O[0]) || null);
                } })
              ] }),
              /* @__PURE__ */ S.jsx("button", { onClick: () => void Ir(d.id), children: "Remove" })
            ] })
          ] }, d.id)) })
        ] }),
        /* @__PURE__ */ S.jsxs("details", { open: !0, className: "tree-folder", children: [
          /* @__PURE__ */ S.jsxs("summary", { children: [
            "chats/",
            Yi(z.title),
            "/outputs/ ",
            /* @__PURE__ */ S.jsx("small", { children: U.length })
          ] }),
          /* @__PURE__ */ S.jsxs("div", { className: "chat-files", children: [
            /* @__PURE__ */ S.jsxs("span", { children: [
              "chat.json ",
              /* @__PURE__ */ S.jsx("small", { children: "autosaved" })
            ] }),
            /* @__PURE__ */ S.jsxs("span", { children: [
              "chat.md ",
              /* @__PURE__ */ S.jsx("small", { children: "autosaved" })
            ] })
          ] }),
          /* @__PURE__ */ S.jsx("ul", { className: "file-list", children: U.map((d) => /* @__PURE__ */ S.jsxs("li", { children: [
            /* @__PURE__ */ S.jsxs("div", { children: [
              /* @__PURE__ */ S.jsx("strong", { children: d.name }),
              /* @__PURE__ */ S.jsxs("small", { children: [
                Ji(d.size),
                " · ",
                d.sha256.slice(0, 10)
              ] })
            ] }),
            /* @__PURE__ */ S.jsxs("div", { className: "file-actions", children: [
              /* @__PURE__ */ S.jsx("button", { onClick: () => Qn(d), children: "Download" }),
              a.canUpload && /* @__PURE__ */ S.jsx("button", { onClick: () => void el(d), children: "Attach" }),
              /* @__PURE__ */ S.jsx("button", { onClick: () => void Ir(d.id), children: "Remove" })
            ] })
          ] }, d.id)) })
        ] }),
        /* @__PURE__ */ S.jsxs("details", { open: !0, className: "tree-folder", children: [
          /* @__PURE__ */ S.jsxs("summary", { children: [
            "scripts/ ",
            /* @__PURE__ */ S.jsx("small", { children: c.scripts.length })
          ] }),
          /* @__PURE__ */ S.jsx("ul", { className: "file-list", children: c.scripts.map((d) => /* @__PURE__ */ S.jsxs("li", { children: [
            /* @__PURE__ */ S.jsxs("div", { children: [
              /* @__PURE__ */ S.jsx("strong", { children: d.name }),
              /* @__PURE__ */ S.jsxs("small", { children: [
                "v",
                d.currentVersion,
                " · ",
                d.description
              ] })
            ] }),
            /* @__PURE__ */ S.jsxs("div", { className: "file-actions", children: [
              /* @__PURE__ */ S.jsx("button", { onClick: () => void Ar(d), children: "Run" }),
              /* @__PURE__ */ S.jsx("button", { onClick: () => lr(d), children: "Rename" }),
              /* @__PURE__ */ S.jsx("button", { onClick: () => Kn(d), children: "Download" })
            ] })
          ] }, d.id)) })
        ] }),
        j.length > 0 && /* @__PURE__ */ S.jsxs("details", { className: "tree-folder", children: [
          /* @__PURE__ */ S.jsxs("summary", { children: [
            "Resume from OMERO/ ",
            /* @__PURE__ */ S.jsx("small", { children: j.length })
          ] }),
          /* @__PURE__ */ S.jsx("ul", { className: "file-list", children: j.map((d) => /* @__PURE__ */ S.jsxs("li", { children: [
            /* @__PURE__ */ S.jsxs("div", { children: [
              /* @__PURE__ */ S.jsx("strong", { children: d.name }),
              /* @__PURE__ */ S.jsxs("small", { children: [
                Ji(d.size),
                " · Annotation ",
                d.annotation_id
              ] })
            ] }),
            /* @__PURE__ */ S.jsx("button", { onClick: () => void Dr(d), children: "Resume" })
          ] }, d.annotation_id)) })
        ] })
      ] }),
      /* @__PURE__ */ S.jsxs("section", { className: "chat", children: [
        /* @__PURE__ */ S.jsxs("div", { className: "messages", "aria-live": "polite", ref: Me, children: [
          !z.messages.length && /* @__PURE__ */ S.jsxs("div", { className: "welcome", children: [
            /* @__PURE__ */ S.jsx("h2", { children: "What would you like to learn from these data?" }),
            /* @__PURE__ */ S.jsx("p", { children: "This named chat, its code, outputs, and reusable scripts are saved automatically in the browser project." })
          ] }),
          z.messages.map((d) => {
            if (d.kind === "execution" && d.executionId) {
              const g = c.executions.find((O) => O.id === d.executionId);
              return g ? /* @__PURE__ */ S.jsx(
                Th,
                {
                  execution: g,
                  files: c.files,
                  onSave: () => void Fo(g),
                  onRerun: () => void Sn(g)
                },
                d.id
              ) : null;
            }
            return /* @__PURE__ */ S.jsxs("article", { className: `message ${d.role} ${d.kind || ""}`, children: [
              /* @__PURE__ */ S.jsx("span", { children: d.role }),
              /* @__PURE__ */ S.jsx("p", { children: d.content })
            ] }, d.id);
          })
        ] }),
        !X && /* @__PURE__ */ S.jsxs("div", { className: "runtime-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ S.jsxs("div", { children: [
            /* @__PURE__ */ S.jsx("strong", { children: re.message }),
            /* @__PURE__ */ S.jsxs("span", { children: [
              Math.round(re.percent),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ S.jsx("progress", { max: "100", value: re.percent }),
          /* @__PURE__ */ S.jsx("small", { children: "Please wait. The question box unlocks automatically when browser Python is ready." })
        ] }),
        /* @__PURE__ */ S.jsx("div", { className: "status", role: "status", children: je }),
        /* @__PURE__ */ S.jsxs("div", { className: "usage-status", children: [
          /* @__PURE__ */ S.jsx("span", { children: "Azure receives prompts, generated code, bounded schemas/previews/statistics, summaries, and errors — never source files." }),
          /* @__PURE__ */ S.jsx("span", { children: Ch(we, P.contextWindow || 0) })
        ] }),
        v.length > 0 && /* @__PURE__ */ S.jsx("div", { className: "blocker", children: "Analysis is blocked until every input is available. Retry, reselect, or remove missing files." }),
        !P.apiKey || !P.model ? /* @__PURE__ */ S.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
        /* @__PURE__ */ S.jsxs("div", { className: "composer", children: [
          /* @__PURE__ */ S.jsxs("div", { className: `composer-state ${E ? "ready" : "waiting"}`, children: [
            /* @__PURE__ */ S.jsx("span", { "aria-hidden": "true", children: E ? "●" : "◷" }),
            E ? "Ready — you can ask a question" : b
          ] }),
          /* @__PURE__ */ S.jsx("textarea", { value: A, onChange: (d) => ne(d.target.value), onKeyDown: (d) => {
            d.key === "Enter" && !d.shiftKey && (d.preventDefault(), Mr());
          }, disabled: !E, placeholder: b }),
          ae ? /* @__PURE__ */ S.jsx("button", { className: "stop", onClick: Ao, children: "Stop" }) : /* @__PURE__ */ S.jsx("button", { disabled: !E || !A.trim(), onClick: () => void Mr(), children: "Send" }),
          /* @__PURE__ */ S.jsx("button", { disabled: ae || !X, onClick: () => void fe(c.files, "Python state reset; inputs restored"), children: "Reset Python" })
        ] })
      ] })
    ] })
  ] });
  async function Br(d, g) {
    const O = h.current;
    if (!g || !O) return;
    if (g.size > Qc) {
      T(`${g.name} exceeds the 256 MiB file limit`);
      return;
    }
    const $ = await g.arrayBuffer(), D = {
      ...d,
      name: g.name,
      type: g.type || ld(g.name),
      size: $.byteLength,
      sha256: await nn($),
      data: $,
      state: "ready",
      error: void 0
    }, K = O.files.map((J) => J.id === d.id ? D : J);
    mt([D]), await fe(K, "Missing local input restored");
  }
  async function Sn(d) {
    if (!(!X || ae)) {
      H(!0), Se.current.clear(), await s.beginTurn();
      try {
        await wn(d.code, d.chatId, Tt(), !0), T("Python rerun completed");
      } finally {
        H(!1);
      }
    }
  }
}
function Th({
  execution: l,
  files: a,
  onSave: s,
  onRerun: c
}) {
  var C;
  const y = l.outputFileIds.map((_) => a.find((j) => j.id === _)).filter(Boolean), h = l.status === "reused" ? [] : y.filter((_) => _.type === "image/png" || _.type === "image/svg+xml");
  return /* @__PURE__ */ S.jsxs("article", { className: `message execution ${l.status}`, children: [
    /* @__PURE__ */ S.jsxs("details", { className: "execution-details", children: [
      /* @__PURE__ */ S.jsxs("summary", { children: [
        /* @__PURE__ */ S.jsx("span", { children: l.status === "reused" ? "Reused Python run" : "Python code (local)" }),
        /* @__PURE__ */ S.jsx("small", { children: "Show details" })
      ] }),
      /* @__PURE__ */ S.jsxs("div", { className: "execution-content", children: [
        /* @__PURE__ */ S.jsx("pre", { children: /* @__PURE__ */ S.jsx("code", { children: l.code }) }),
        l.stdout && /* @__PURE__ */ S.jsx("pre", { children: l.stdout }),
        l.stderr && /* @__PURE__ */ S.jsx("pre", { className: "execution-error", children: l.stderr }),
        l.preview != null && /* @__PURE__ */ S.jsx(Rh, { value: l.preview }),
        /* @__PURE__ */ S.jsxs("div", { className: "execution-actions", children: [
          ["success", "reused"].includes(l.status) && /* @__PURE__ */ S.jsx("button", { onClick: s, children: "Save as script" }),
          /* @__PURE__ */ S.jsx("button", { onClick: c, children: "Rerun" }),
          /* @__PURE__ */ S.jsxs("small", { children: [
            l.codeHash.slice(0, 12),
            " · ",
            l.runtimeVersion
          ] })
        ] })
      ] })
    ] }),
    l.status === "reused" && /* @__PURE__ */ S.jsxs("p", { className: "reuse-note", children: [
      "Reused prior execution ",
      (C = l.reusedFrom) == null ? void 0 : C.slice(0, 8),
      " because code and inputs are unchanged."
    ] }),
    l.missingPlotCsv.length > 0 && /* @__PURE__ */ S.jsxs("p", { className: "plot-warning", children: [
      "Source CSV missing: ",
      l.missingPlotCsv.join(", ")
    ] }),
    h.map((_) => /* @__PURE__ */ S.jsx(zh, { file: _ }, _.id))
  ] });
}
function Rh({ value: l }) {
  if ((l == null ? void 0 : l.kind) === "table" && l.data) {
    const a = l.data.columns || [], s = l.data.data || [];
    return /* @__PURE__ */ S.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ S.jsxs("table", { children: [
      /* @__PURE__ */ S.jsx("thead", { children: /* @__PURE__ */ S.jsx("tr", { children: a.map((c) => /* @__PURE__ */ S.jsx("th", { children: c }, c)) }) }),
      /* @__PURE__ */ S.jsx("tbody", { children: s.map((c, y) => /* @__PURE__ */ S.jsx("tr", { children: c.map((h, C) => /* @__PURE__ */ S.jsx("td", { children: String(h ?? "") }, C)) }, y)) })
    ] }) });
  }
  return /* @__PURE__ */ S.jsx("pre", { className: "preview", children: JSON.stringify(l, null, 2) });
}
function zh({ file: l }) {
  const a = Be.useMemo(
    () => l.data ? URL.createObjectURL(new Blob([l.data], { type: l.type })) : "",
    [l.data, l.type]
  );
  return Be.useEffect(() => () => {
    a && URL.revokeObjectURL(a);
  }, [a]), a ? /* @__PURE__ */ S.jsxs("figure", { children: [
    /* @__PURE__ */ S.jsx("img", { src: a, alt: l.name }),
    /* @__PURE__ */ S.jsx("figcaption", { children: l.name })
  ] }) : null;
}
Ep.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ S.jsx(gp.StrictMode, { children: /* @__PURE__ */ S.jsx(Nh, {}) })
);
