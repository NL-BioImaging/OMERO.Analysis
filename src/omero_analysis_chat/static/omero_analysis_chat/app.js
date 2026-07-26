var pp = Object.defineProperty;
var hp = (l, a, s) => a in l ? pp(l, a, { enumerable: !0, configurable: !0, writable: !0, value: s }) : l[a] = s;
var on = (l, a, s) => hp(l, typeof a != "symbol" ? a + "" : a, s);
function fd(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var Hs = { exports: {} }, Oo = {}, Qs = { exports: {} }, we = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Uc;
function mp() {
  if (Uc) return we;
  Uc = 1;
  var l = Symbol.for("react.element"), a = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), m = Symbol.for("react.provider"), N = Symbol.for("react.context"), _ = Symbol.for("react.forward_ref"), j = Symbol.for("react.suspense"), $ = Symbol.for("react.memo"), C = Symbol.for("react.lazy"), T = Symbol.iterator;
  function F(v) {
    return v === null || typeof v != "object" ? null : (v = T && v[T] || v["@@iterator"], typeof v == "function" ? v : null);
  }
  var re = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ue = Object.assign, Q = {};
  function Y(v, P, V) {
    this.props = v, this.context = P, this.refs = Q, this.updater = V || re;
  }
  Y.prototype.isReactComponent = {}, Y.prototype.setState = function(v, P) {
    if (typeof v != "object" && typeof v != "function" && v != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, v, P, "setState");
  }, Y.prototype.forceUpdate = function(v) {
    this.updater.enqueueForceUpdate(this, v, "forceUpdate");
  };
  function Te() {
  }
  Te.prototype = Y.prototype;
  function ke(v, P, V) {
    this.props = v, this.context = P, this.refs = Q, this.updater = V || re;
  }
  var R = ke.prototype = new Te();
  R.constructor = ke, ue(R, Y.prototype), R.isPureReactComponent = !0;
  var ee = Array.isArray, ge = Object.prototype.hasOwnProperty, pe = { current: null }, he = { key: !0, ref: !0, __self: !0, __source: !0 };
  function le(v, P, V) {
    var b, Z = {}, ae = null, me = null;
    if (P != null) for (b in P.ref !== void 0 && (me = P.ref), P.key !== void 0 && (ae = "" + P.key), P) ge.call(P, b) && !he.hasOwnProperty(b) && (Z[b] = P[b]);
    var ye = arguments.length - 2;
    if (ye === 1) Z.children = V;
    else if (1 < ye) {
      for (var xe = Array(ye), qe = 0; qe < ye; qe++) xe[qe] = arguments[qe + 2];
      Z.children = xe;
    }
    if (v && v.defaultProps) for (b in ye = v.defaultProps, ye) Z[b] === void 0 && (Z[b] = ye[b]);
    return { $$typeof: l, type: v, key: ae, ref: me, props: Z, _owner: pe.current };
  }
  function te(v, P) {
    return { $$typeof: l, type: v.type, key: P, ref: v.ref, props: v.props, _owner: v._owner };
  }
  function Re(v) {
    return typeof v == "object" && v !== null && v.$$typeof === l;
  }
  function _e(v) {
    var P = { "=": "=0", ":": "=2" };
    return "$" + v.replace(/[=:]/g, function(V) {
      return P[V];
    });
  }
  var je = /\/+/g;
  function ze(v, P) {
    return typeof v == "object" && v !== null && v.key != null ? _e("" + v.key) : P.toString(36);
  }
  function Le(v, P, V, b, Z) {
    var ae = typeof v;
    (ae === "undefined" || ae === "boolean") && (v = null);
    var me = !1;
    if (v === null) me = !0;
    else switch (ae) {
      case "string":
      case "number":
        me = !0;
        break;
      case "object":
        switch (v.$$typeof) {
          case l:
          case a:
            me = !0;
        }
    }
    if (me) return me = v, Z = Z(me), v = b === "" ? "." + ze(me, 0) : b, ee(Z) ? (V = "", v != null && (V = v.replace(je, "$&/") + "/"), Le(Z, P, V, "", function(qe) {
      return qe;
    })) : Z != null && (Re(Z) && (Z = te(Z, V + (!Z.key || me && me.key === Z.key ? "" : ("" + Z.key).replace(je, "$&/") + "/") + v)), P.push(Z)), 1;
    if (me = 0, b = b === "" ? "." : b + ":", ee(v)) for (var ye = 0; ye < v.length; ye++) {
      ae = v[ye];
      var xe = b + ze(ae, ye);
      me += Le(ae, P, V, xe, Z);
    }
    else if (xe = F(v), typeof xe == "function") for (v = xe.call(v), ye = 0; !(ae = v.next()).done; ) ae = ae.value, xe = b + ze(ae, ye++), me += Le(ae, P, V, xe, Z);
    else if (ae === "object") throw P = String(v), Error("Objects are not valid as a React child (found: " + (P === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : P) + "). If you meant to render a collection of children, use an array instead.");
    return me;
  }
  function Ne(v, P, V) {
    if (v == null) return v;
    var b = [], Z = 0;
    return Le(v, b, "", "", function(ae) {
      return P.call(V, ae, Z++);
    }), b;
  }
  function ve(v) {
    if (v._status === -1) {
      var P = v._result;
      P = P(), P.then(function(V) {
        (v._status === 0 || v._status === -1) && (v._status = 1, v._result = V);
      }, function(V) {
        (v._status === 0 || v._status === -1) && (v._status = 2, v._result = V);
      }), v._status === -1 && (v._status = 0, v._result = P);
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var se = { current: null }, O = { transition: null }, B = { ReactCurrentDispatcher: se, ReactCurrentBatchConfig: O, ReactCurrentOwner: pe };
  function U() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return we.Children = { map: Ne, forEach: function(v, P, V) {
    Ne(v, function() {
      P.apply(this, arguments);
    }, V);
  }, count: function(v) {
    var P = 0;
    return Ne(v, function() {
      P++;
    }), P;
  }, toArray: function(v) {
    return Ne(v, function(P) {
      return P;
    }) || [];
  }, only: function(v) {
    if (!Re(v)) throw Error("React.Children.only expected to receive a single React element child.");
    return v;
  } }, we.Component = Y, we.Fragment = s, we.Profiler = w, we.PureComponent = ke, we.StrictMode = d, we.Suspense = j, we.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = B, we.act = U, we.cloneElement = function(v, P, V) {
    if (v == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + v + ".");
    var b = ue({}, v.props), Z = v.key, ae = v.ref, me = v._owner;
    if (P != null) {
      if (P.ref !== void 0 && (ae = P.ref, me = pe.current), P.key !== void 0 && (Z = "" + P.key), v.type && v.type.defaultProps) var ye = v.type.defaultProps;
      for (xe in P) ge.call(P, xe) && !he.hasOwnProperty(xe) && (b[xe] = P[xe] === void 0 && ye !== void 0 ? ye[xe] : P[xe]);
    }
    var xe = arguments.length - 2;
    if (xe === 1) b.children = V;
    else if (1 < xe) {
      ye = Array(xe);
      for (var qe = 0; qe < xe; qe++) ye[qe] = arguments[qe + 2];
      b.children = ye;
    }
    return { $$typeof: l, type: v.type, key: Z, ref: ae, props: b, _owner: me };
  }, we.createContext = function(v) {
    return v = { $$typeof: N, _currentValue: v, _currentValue2: v, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, v.Provider = { $$typeof: m, _context: v }, v.Consumer = v;
  }, we.createElement = le, we.createFactory = function(v) {
    var P = le.bind(null, v);
    return P.type = v, P;
  }, we.createRef = function() {
    return { current: null };
  }, we.forwardRef = function(v) {
    return { $$typeof: _, render: v };
  }, we.isValidElement = Re, we.lazy = function(v) {
    return { $$typeof: C, _payload: { _status: -1, _result: v }, _init: ve };
  }, we.memo = function(v, P) {
    return { $$typeof: $, type: v, compare: P === void 0 ? null : P };
  }, we.startTransition = function(v) {
    var P = O.transition;
    O.transition = {};
    try {
      v();
    } finally {
      O.transition = P;
    }
  }, we.unstable_act = U, we.useCallback = function(v, P) {
    return se.current.useCallback(v, P);
  }, we.useContext = function(v) {
    return se.current.useContext(v);
  }, we.useDebugValue = function() {
  }, we.useDeferredValue = function(v) {
    return se.current.useDeferredValue(v);
  }, we.useEffect = function(v, P) {
    return se.current.useEffect(v, P);
  }, we.useId = function() {
    return se.current.useId();
  }, we.useImperativeHandle = function(v, P, V) {
    return se.current.useImperativeHandle(v, P, V);
  }, we.useInsertionEffect = function(v, P) {
    return se.current.useInsertionEffect(v, P);
  }, we.useLayoutEffect = function(v, P) {
    return se.current.useLayoutEffect(v, P);
  }, we.useMemo = function(v, P) {
    return se.current.useMemo(v, P);
  }, we.useReducer = function(v, P, V) {
    return se.current.useReducer(v, P, V);
  }, we.useRef = function(v) {
    return se.current.useRef(v);
  }, we.useState = function(v) {
    return se.current.useState(v);
  }, we.useSyncExternalStore = function(v, P, V) {
    return se.current.useSyncExternalStore(v, P, V);
  }, we.useTransition = function() {
    return se.current.useTransition();
  }, we.version = "18.3.1", we;
}
var Bc;
function ha() {
  return Bc || (Bc = 1, Qs.exports = mp()), Qs.exports;
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
var Vc;
function vp() {
  if (Vc) return Oo;
  Vc = 1;
  var l = ha(), a = Symbol.for("react.element"), s = Symbol.for("react.fragment"), d = Object.prototype.hasOwnProperty, w = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, m = { key: !0, ref: !0, __self: !0, __source: !0 };
  function N(_, j, $) {
    var C, T = {}, F = null, re = null;
    $ !== void 0 && (F = "" + $), j.key !== void 0 && (F = "" + j.key), j.ref !== void 0 && (re = j.ref);
    for (C in j) d.call(j, C) && !m.hasOwnProperty(C) && (T[C] = j[C]);
    if (_ && _.defaultProps) for (C in j = _.defaultProps, j) T[C] === void 0 && (T[C] = j[C]);
    return { $$typeof: a, type: _, key: F, ref: re, props: T, _owner: w.current };
  }
  return Oo.Fragment = s, Oo.jsx = N, Oo.jsxs = N, Oo;
}
var Wc;
function yp() {
  return Wc || (Wc = 1, Hs.exports = vp()), Hs.exports;
}
var g = yp(), Oe = ha();
const gp = /* @__PURE__ */ fd(Oe);
var el = {}, Ks = { exports: {} }, Et = {}, Xs = { exports: {} }, Ys = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hc;
function wp() {
  return Hc || (Hc = 1, (function(l) {
    function a(O, B) {
      var U = O.length;
      O.push(B);
      e: for (; 0 < U; ) {
        var v = U - 1 >>> 1, P = O[v];
        if (0 < w(P, B)) O[v] = B, O[U] = P, U = v;
        else break e;
      }
    }
    function s(O) {
      return O.length === 0 ? null : O[0];
    }
    function d(O) {
      if (O.length === 0) return null;
      var B = O[0], U = O.pop();
      if (U !== B) {
        O[0] = U;
        e: for (var v = 0, P = O.length, V = P >>> 1; v < V; ) {
          var b = 2 * (v + 1) - 1, Z = O[b], ae = b + 1, me = O[ae];
          if (0 > w(Z, U)) ae < P && 0 > w(me, Z) ? (O[v] = me, O[ae] = U, v = ae) : (O[v] = Z, O[b] = U, v = b);
          else if (ae < P && 0 > w(me, U)) O[v] = me, O[ae] = U, v = ae;
          else break e;
        }
      }
      return B;
    }
    function w(O, B) {
      var U = O.sortIndex - B.sortIndex;
      return U !== 0 ? U : O.id - B.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      l.unstable_now = function() {
        return m.now();
      };
    } else {
      var N = Date, _ = N.now();
      l.unstable_now = function() {
        return N.now() - _;
      };
    }
    var j = [], $ = [], C = 1, T = null, F = 3, re = !1, ue = !1, Q = !1, Y = typeof setTimeout == "function" ? setTimeout : null, Te = typeof clearTimeout == "function" ? clearTimeout : null, ke = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function R(O) {
      for (var B = s($); B !== null; ) {
        if (B.callback === null) d($);
        else if (B.startTime <= O) d($), B.sortIndex = B.expirationTime, a(j, B);
        else break;
        B = s($);
      }
    }
    function ee(O) {
      if (Q = !1, R(O), !ue) if (s(j) !== null) ue = !0, ve(ge);
      else {
        var B = s($);
        B !== null && se(ee, B.startTime - O);
      }
    }
    function ge(O, B) {
      ue = !1, Q && (Q = !1, Te(le), le = -1), re = !0;
      var U = F;
      try {
        for (R(B), T = s(j); T !== null && (!(T.expirationTime > B) || O && !_e()); ) {
          var v = T.callback;
          if (typeof v == "function") {
            T.callback = null, F = T.priorityLevel;
            var P = v(T.expirationTime <= B);
            B = l.unstable_now(), typeof P == "function" ? T.callback = P : T === s(j) && d(j), R(B);
          } else d(j);
          T = s(j);
        }
        if (T !== null) var V = !0;
        else {
          var b = s($);
          b !== null && se(ee, b.startTime - B), V = !1;
        }
        return V;
      } finally {
        T = null, F = U, re = !1;
      }
    }
    var pe = !1, he = null, le = -1, te = 5, Re = -1;
    function _e() {
      return !(l.unstable_now() - Re < te);
    }
    function je() {
      if (he !== null) {
        var O = l.unstable_now();
        Re = O;
        var B = !0;
        try {
          B = he(!0, O);
        } finally {
          B ? ze() : (pe = !1, he = null);
        }
      } else pe = !1;
    }
    var ze;
    if (typeof ke == "function") ze = function() {
      ke(je);
    };
    else if (typeof MessageChannel < "u") {
      var Le = new MessageChannel(), Ne = Le.port2;
      Le.port1.onmessage = je, ze = function() {
        Ne.postMessage(null);
      };
    } else ze = function() {
      Y(je, 0);
    };
    function ve(O) {
      he = O, pe || (pe = !0, ze());
    }
    function se(O, B) {
      le = Y(function() {
        O(l.unstable_now());
      }, B);
    }
    l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(O) {
      O.callback = null;
    }, l.unstable_continueExecution = function() {
      ue || re || (ue = !0, ve(ge));
    }, l.unstable_forceFrameRate = function(O) {
      0 > O || 125 < O ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : te = 0 < O ? Math.floor(1e3 / O) : 5;
    }, l.unstable_getCurrentPriorityLevel = function() {
      return F;
    }, l.unstable_getFirstCallbackNode = function() {
      return s(j);
    }, l.unstable_next = function(O) {
      switch (F) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = F;
      }
      var U = F;
      F = B;
      try {
        return O();
      } finally {
        F = U;
      }
    }, l.unstable_pauseExecution = function() {
    }, l.unstable_requestPaint = function() {
    }, l.unstable_runWithPriority = function(O, B) {
      switch (O) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          O = 3;
      }
      var U = F;
      F = O;
      try {
        return B();
      } finally {
        F = U;
      }
    }, l.unstable_scheduleCallback = function(O, B, U) {
      var v = l.unstable_now();
      switch (typeof U == "object" && U !== null ? (U = U.delay, U = typeof U == "number" && 0 < U ? v + U : v) : U = v, O) {
        case 1:
          var P = -1;
          break;
        case 2:
          P = 250;
          break;
        case 5:
          P = 1073741823;
          break;
        case 4:
          P = 1e4;
          break;
        default:
          P = 5e3;
      }
      return P = U + P, O = { id: C++, callback: B, priorityLevel: O, startTime: U, expirationTime: P, sortIndex: -1 }, U > v ? (O.sortIndex = U, a($, O), s(j) === null && O === s($) && (Q ? (Te(le), le = -1) : Q = !0, se(ee, U - v))) : (O.sortIndex = P, a(j, O), ue || re || (ue = !0, ve(ge))), O;
    }, l.unstable_shouldYield = _e, l.unstable_wrapCallback = function(O) {
      var B = F;
      return function() {
        var U = F;
        F = B;
        try {
          return O.apply(this, arguments);
        } finally {
          F = U;
        }
      };
    };
  })(Ys)), Ys;
}
var Qc;
function Sp() {
  return Qc || (Qc = 1, Xs.exports = wp()), Xs.exports;
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
var Kc;
function xp() {
  if (Kc) return Et;
  Kc = 1;
  var l = ha(), a = Sp();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var d = /* @__PURE__ */ new Set(), w = {};
  function m(e, t) {
    N(e, t), N(e + "Capture", t);
  }
  function N(e, t) {
    for (w[e] = t, e = 0; e < t.length; e++) d.add(t[e]);
  }
  var _ = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), j = Object.prototype.hasOwnProperty, $ = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, C = {}, T = {};
  function F(e) {
    return j.call(T, e) ? !0 : j.call(C, e) ? !1 : $.test(e) ? T[e] = !0 : (C[e] = !0, !1);
  }
  function re(e, t, n, r) {
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
  function ue(e, t, n, r) {
    if (t === null || typeof t > "u" || re(e, t, n, r)) return !0;
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
  function Q(e, t, n, r, o, i, u) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = u;
  }
  var Y = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    Y[e] = new Q(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    Y[t] = new Q(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    Y[e] = new Q(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    Y[e] = new Q(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    Y[e] = new Q(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    Y[e] = new Q(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    Y[e] = new Q(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    Y[e] = new Q(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    Y[e] = new Q(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Te = /[\-:]([a-z])/g;
  function ke(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Te,
      ke
    );
    Y[t] = new Q(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Te, ke);
    Y[t] = new Q(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Te, ke);
    Y[t] = new Q(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    Y[e] = new Q(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), Y.xlinkHref = new Q("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    Y[e] = new Q(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function R(e, t, n, r) {
    var o = Y.hasOwnProperty(t) ? Y[t] : null;
    (o !== null ? o.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (ue(t, n, o, r) && (n = null), r || o === null ? F(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : o.mustUseProperty ? e[o.propertyName] = n === null ? o.type === 3 ? !1 : "" : n : (t = o.attributeName, r = o.attributeNamespace, n === null ? e.removeAttribute(t) : (o = o.type, n = o === 3 || o === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ee = l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ge = Symbol.for("react.element"), pe = Symbol.for("react.portal"), he = Symbol.for("react.fragment"), le = Symbol.for("react.strict_mode"), te = Symbol.for("react.profiler"), Re = Symbol.for("react.provider"), _e = Symbol.for("react.context"), je = Symbol.for("react.forward_ref"), ze = Symbol.for("react.suspense"), Le = Symbol.for("react.suspense_list"), Ne = Symbol.for("react.memo"), ve = Symbol.for("react.lazy"), se = Symbol.for("react.offscreen"), O = Symbol.iterator;
  function B(e) {
    return e === null || typeof e != "object" ? null : (e = O && e[O] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var U = Object.assign, v;
  function P(e) {
    if (v === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      v = t && t[1] || "";
    }
    return `
` + v + e;
  }
  var V = !1;
  function b(e, t) {
    if (!e || V) return "";
    V = !0;
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
        } catch (k) {
          var r = k;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (k) {
          r = k;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (k) {
          r = k;
        }
        e();
      }
    } catch (k) {
      if (k && r && typeof k.stack == "string") {
        for (var o = k.stack.split(`
`), i = r.stack.split(`
`), u = o.length - 1, f = i.length - 1; 1 <= u && 0 <= f && o[u] !== i[f]; ) f--;
        for (; 1 <= u && 0 <= f; u--, f--) if (o[u] !== i[f]) {
          if (u !== 1 || f !== 1)
            do
              if (u--, f--, 0 > f || o[u] !== i[f]) {
                var h = `
` + o[u].replace(" at new ", " at ");
                return e.displayName && h.includes("<anonymous>") && (h = h.replace("<anonymous>", e.displayName)), h;
              }
            while (1 <= u && 0 <= f);
          break;
        }
      }
    } finally {
      V = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? P(e) : "";
  }
  function Z(e) {
    switch (e.tag) {
      case 5:
        return P(e.type);
      case 16:
        return P("Lazy");
      case 13:
        return P("Suspense");
      case 19:
        return P("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = b(e.type, !1), e;
      case 11:
        return e = b(e.type.render, !1), e;
      case 1:
        return e = b(e.type, !0), e;
      default:
        return "";
    }
  }
  function ae(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case he:
        return "Fragment";
      case pe:
        return "Portal";
      case te:
        return "Profiler";
      case le:
        return "StrictMode";
      case ze:
        return "Suspense";
      case Le:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case _e:
        return (e.displayName || "Context") + ".Consumer";
      case Re:
        return (e._context.displayName || "Context") + ".Provider";
      case je:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Ne:
        return t = e.displayName || null, t !== null ? t : ae(e.type) || "Memo";
      case ve:
        t = e._payload, e = e._init;
        try {
          return ae(e(t));
        } catch {
        }
    }
    return null;
  }
  function me(e) {
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
        return ae(t);
      case 8:
        return t === le ? "StrictMode" : "Mode";
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
  function ye(e) {
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
  function xe(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function qe(e) {
    var t = xe(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function Ct(e) {
    e._valueTracker || (e._valueTracker = qe(e));
  }
  function Ze(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = xe(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function ht(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function _t(e, t) {
    var n = t.checked;
    return U({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function cn(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = ye(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function kn(e, t) {
    t = t.checked, t != null && R(e, "checked", t, !1);
  }
  function Gt(e, t) {
    kn(e, t);
    var n = ye(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Qr(e, t.type, n) : t.hasOwnProperty("defaultValue") && Qr(e, t.type, ye(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Gn(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Qr(e, t, n) {
    (t !== "number" || ht(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var jn = Array.isArray;
  function En(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
      for (n = 0; n < e.length; n++) o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + ye(n), t = null, o = 0; o < e.length; o++) {
        if (e[o].value === n) {
          e[o].selected = !0, r && (e[o].defaultSelected = !0);
          return;
        }
        t !== null || e[o].disabled || (t = e[o]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Cn(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return U({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Vo(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if (jn(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: ye(n) };
  }
  function Zn(e, t) {
    var n = ye(t.value), r = ye(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function mt(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function yr(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function gr(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? yr(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var bn, Kr = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, o) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, o);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (bn = bn || document.createElement("div"), bn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = bn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Zt(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var er = {
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
  }, Wo = ["Webkit", "ms", "Moz", "O"];
  Object.keys(er).forEach(function(e) {
    Wo.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), er[t] = er[e];
    });
  });
  function Ho(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || er.hasOwnProperty(e) && er[e] ? ("" + t).trim() : t + "px";
  }
  function Qo(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, o = Ho(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o;
    }
  }
  var Ko = U({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Xr(e, t) {
    if (t) {
      if (Ko[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function tr(e, t) {
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
  var wr = null;
  function Yr(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Jr = null, dn = null, _n = null;
  function Xo(e) {
    if (e = wo(e)) {
      if (typeof Jr != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = mi(t), Jr(e.stateNode, e.type, t));
    }
  }
  function Yo(e) {
    dn ? _n ? _n.push(e) : _n = [e] : dn = e;
  }
  function qr() {
    if (dn) {
      var e = dn, t = _n;
      if (_n = dn = null, Xo(e), t) for (e = 0; e < t.length; e++) Xo(t[e]);
    }
  }
  function Jo(e, t) {
    return e(t);
  }
  function Gr() {
  }
  var Sr = !1;
  function Zr(e, t, n) {
    if (Sr) return e(t, n);
    Sr = !0;
    try {
      return Jo(e, t, n);
    } finally {
      Sr = !1, (dn !== null || _n !== null) && (Gr(), qr());
    }
  }
  function Pn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = mi(n);
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
  var nr = !1;
  if (_) try {
    var rr = {};
    Object.defineProperty(rr, "passive", { get: function() {
      nr = !0;
    } }), window.addEventListener("test", rr, rr), window.removeEventListener("test", rr, rr);
  } catch {
    nr = !1;
  }
  function cl(e, t, n, r, o, i, u, f, h) {
    var k = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, k);
    } catch (L) {
      this.onError(L);
    }
  }
  var c = !1, p = null, E = !1, A = null, D = { onError: function(e) {
    c = !0, p = e;
  } };
  function X(e, t, n, r, o, i, u, f, h) {
    c = !1, p = null, cl.apply(D, arguments);
  }
  function q(e, t, n, r, o, i, u, f, h) {
    if (X.apply(this, arguments), c) {
      if (c) {
        var k = p;
        c = !1, p = null;
      } else throw Error(s(198));
      E || (E = !0, A = k);
    }
  }
  function de(e) {
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
  function lt(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Pe(e) {
    if (de(e) !== e) throw Error(s(188));
  }
  function Ae(e) {
    var t = e.alternate;
    if (!t) {
      if (t = de(e), t === null) throw Error(s(188));
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
          if (i === n) return Pe(o), e;
          if (i === r) return Pe(o), t;
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
  function De(e) {
    return e = Ae(e), e !== null ? Ke(e) : null;
  }
  function Ke(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Ke(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var be = a.unstable_scheduleCallback, Me = a.unstable_cancelCallback, ne = a.unstable_shouldYield, fe = a.unstable_requestPaint, Se = a.unstable_now, xr = a.unstable_getCurrentPriorityLevel, nt = a.unstable_ImmediatePriority, qo = a.unstable_UserBlockingPriority, bt = a.unstable_NormalPriority, Bt = a.unstable_LowPriority, br = a.unstable_IdlePriority, or = null, Pt = null;
  function Nn(e) {
    if (Pt && typeof Pt.onCommitFiberRoot == "function") try {
      Pt.onCommitFiberRoot(or, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var Nt = Math.clz32 ? Math.clz32 : Rd, Nd = Math.log, Td = Math.LN2;
  function Rd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Nd(e) / Td | 0) | 0;
  }
  var Go = 64, Zo = 4194304;
  function eo(e) {
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
  function bo(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, o = e.suspendedLanes, i = e.pingedLanes, u = n & 268435455;
    if (u !== 0) {
      var f = u & ~o;
      f !== 0 ? r = eo(f) : (i &= u, i !== 0 && (r = eo(i)));
    } else u = n & ~o, u !== 0 ? r = eo(u) : i !== 0 && (r = eo(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & o) === 0 && (o = r & -r, i = t & -t, o >= i || o === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Nt(t), o = 1 << n, r |= e[n], t &= ~o;
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
  function Ld(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, o = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var u = 31 - Nt(i), f = 1 << u, h = o[u];
      h === -1 ? ((f & n) === 0 || (f & r) !== 0) && (o[u] = zd(f, t)) : h <= t && (e.expiredLanes |= f), i &= ~f;
    }
  }
  function dl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ya() {
    var e = Go;
    return Go <<= 1, (Go & 4194240) === 0 && (Go = 64), e;
  }
  function fl(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function to(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Nt(t), e[t] = n;
  }
  function Id(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var o = 31 - Nt(n), i = 1 << o;
      t[o] = 0, r[o] = -1, e[o] = -1, n &= ~i;
    }
  }
  function pl(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - Nt(n), o = 1 << r;
      o & t | e[r] & t && (e[r] |= t), n &= ~o;
    }
  }
  var Ie = 0;
  function ga(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var wa, hl, Sa, xa, ka, ml = !1, ei = [], Tn = null, Rn = null, zn = null, no = /* @__PURE__ */ new Map(), ro = /* @__PURE__ */ new Map(), Ln = [], Od = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ja(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Tn = null;
        break;
      case "dragenter":
      case "dragleave":
        Rn = null;
        break;
      case "mouseover":
      case "mouseout":
        zn = null;
        break;
      case "pointerover":
      case "pointerout":
        no.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ro.delete(t.pointerId);
    }
  }
  function oo(e, t, n, r, o, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [o] }, t !== null && (t = wo(t), t !== null && hl(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e);
  }
  function Md(e, t, n, r, o) {
    switch (t) {
      case "focusin":
        return Tn = oo(Tn, e, t, n, r, o), !0;
      case "dragenter":
        return Rn = oo(Rn, e, t, n, r, o), !0;
      case "mouseover":
        return zn = oo(zn, e, t, n, r, o), !0;
      case "pointerover":
        var i = o.pointerId;
        return no.set(i, oo(no.get(i) || null, e, t, n, r, o)), !0;
      case "gotpointercapture":
        return i = o.pointerId, ro.set(i, oo(ro.get(i) || null, e, t, n, r, o)), !0;
    }
    return !1;
  }
  function Ea(e) {
    var t = ir(e.target);
    if (t !== null) {
      var n = de(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = lt(n), t !== null) {
            e.blockedOn = t, ka(e.priority, function() {
              Sa(n);
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
  function ti(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = yl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        wr = r, n.target.dispatchEvent(r), wr = null;
      } else return t = wo(n), t !== null && hl(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Ca(e, t, n) {
    ti(e) && n.delete(t);
  }
  function Ad() {
    ml = !1, Tn !== null && ti(Tn) && (Tn = null), Rn !== null && ti(Rn) && (Rn = null), zn !== null && ti(zn) && (zn = null), no.forEach(Ca), ro.forEach(Ca);
  }
  function io(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ml || (ml = !0, a.unstable_scheduleCallback(a.unstable_NormalPriority, Ad)));
  }
  function lo(e) {
    function t(o) {
      return io(o, e);
    }
    if (0 < ei.length) {
      io(ei[0], e);
      for (var n = 1; n < ei.length; n++) {
        var r = ei[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Tn !== null && io(Tn, e), Rn !== null && io(Rn, e), zn !== null && io(zn, e), no.forEach(t), ro.forEach(t), n = 0; n < Ln.length; n++) r = Ln[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Ln.length && (n = Ln[0], n.blockedOn === null); ) Ea(n), n.blockedOn === null && Ln.shift();
  }
  var kr = ee.ReactCurrentBatchConfig, ni = !0;
  function $d(e, t, n, r) {
    var o = Ie, i = kr.transition;
    kr.transition = null;
    try {
      Ie = 1, vl(e, t, n, r);
    } finally {
      Ie = o, kr.transition = i;
    }
  }
  function Fd(e, t, n, r) {
    var o = Ie, i = kr.transition;
    kr.transition = null;
    try {
      Ie = 4, vl(e, t, n, r);
    } finally {
      Ie = o, kr.transition = i;
    }
  }
  function vl(e, t, n, r) {
    if (ni) {
      var o = yl(e, t, n, r);
      if (o === null) Ol(e, t, r, ri, n), ja(e, r);
      else if (Md(o, e, t, n, r)) r.stopPropagation();
      else if (ja(e, r), t & 4 && -1 < Od.indexOf(e)) {
        for (; o !== null; ) {
          var i = wo(o);
          if (i !== null && wa(i), i = yl(e, t, n, r), i === null && Ol(e, t, r, ri, n), i === o) break;
          o = i;
        }
        o !== null && r.stopPropagation();
      } else Ol(e, t, r, null, n);
    }
  }
  var ri = null;
  function yl(e, t, n, r) {
    if (ri = null, e = Yr(r), e = ir(e), e !== null) if (t = de(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = lt(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return ri = e, null;
  }
  function _a(e) {
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
        switch (xr()) {
          case nt:
            return 1;
          case qo:
            return 4;
          case bt:
          case Bt:
            return 16;
          case br:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var In = null, gl = null, oi = null;
  function Pa() {
    if (oi) return oi;
    var e, t = gl, n = t.length, r, o = "value" in In ? In.value : In.textContent, i = o.length;
    for (e = 0; e < n && t[e] === o[e]; e++) ;
    var u = n - e;
    for (r = 1; r <= u && t[n - r] === o[i - r]; r++) ;
    return oi = o.slice(e, 1 < r ? 1 - r : void 0);
  }
  function ii(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function li() {
    return !0;
  }
  function Na() {
    return !1;
  }
  function Tt(e) {
    function t(n, r, o, i, u) {
      this._reactName = n, this._targetInst = o, this.type = r, this.nativeEvent = i, this.target = u, this.currentTarget = null;
      for (var f in e) e.hasOwnProperty(f) && (n = e[f], this[f] = n ? n(i) : i[f]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? li : Na, this.isPropagationStopped = Na, this;
    }
    return U(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = li);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = li);
    }, persist: function() {
    }, isPersistent: li }), t;
  }
  var jr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, wl = Tt(jr), so = U({}, jr, { view: 0, detail: 0 }), Dd = Tt(so), Sl, xl, ao, si = U({}, so, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: jl, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== ao && (ao && e.type === "mousemove" ? (Sl = e.screenX - ao.screenX, xl = e.screenY - ao.screenY) : xl = Sl = 0, ao = e), Sl);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : xl;
  } }), Ta = Tt(si), Ud = U({}, si, { dataTransfer: 0 }), Bd = Tt(Ud), Vd = U({}, so, { relatedTarget: 0 }), kl = Tt(Vd), Wd = U({}, jr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = Tt(Wd), Qd = U({}, jr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Kd = Tt(Qd), Xd = U({}, jr, { data: 0 }), Ra = Tt(Xd), Yd = {
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
  function jl() {
    return Gd;
  }
  var Zd = U({}, so, { key: function(e) {
    if (e.key) {
      var t = Yd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = ii(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Jd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: jl, charCode: function(e) {
    return e.type === "keypress" ? ii(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? ii(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), bd = Tt(Zd), ef = U({}, si, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), za = Tt(ef), tf = U({}, so, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: jl }), nf = Tt(tf), rf = U({}, jr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), of = Tt(rf), lf = U({}, si, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), sf = Tt(lf), af = [9, 13, 27, 32], El = _ && "CompositionEvent" in window, uo = null;
  _ && "documentMode" in document && (uo = document.documentMode);
  var uf = _ && "TextEvent" in window && !uo, La = _ && (!El || uo && 8 < uo && 11 >= uo), Ia = " ", Oa = !1;
  function Ma(e, t) {
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
  function Aa(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Er = !1;
  function cf(e, t) {
    switch (e) {
      case "compositionend":
        return Aa(t);
      case "keypress":
        return t.which !== 32 ? null : (Oa = !0, Ia);
      case "textInput":
        return e = t.data, e === Ia && Oa ? null : e;
      default:
        return null;
    }
  }
  function df(e, t) {
    if (Er) return e === "compositionend" || !El && Ma(e, t) ? (e = Pa(), oi = gl = In = null, Er = !1, e) : null;
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
        return La && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var ff = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function $a(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!ff[e.type] : t === "textarea";
  }
  function Fa(e, t, n, r) {
    Yo(r), t = fi(t, "onChange"), 0 < t.length && (n = new wl("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var co = null, fo = null;
  function pf(e) {
    nu(e, 0);
  }
  function ai(e) {
    var t = Tr(e);
    if (Ze(t)) return e;
  }
  function hf(e, t) {
    if (e === "change") return t;
  }
  var Da = !1;
  if (_) {
    var Cl;
    if (_) {
      var _l = "oninput" in document;
      if (!_l) {
        var Ua = document.createElement("div");
        Ua.setAttribute("oninput", "return;"), _l = typeof Ua.oninput == "function";
      }
      Cl = _l;
    } else Cl = !1;
    Da = Cl && (!document.documentMode || 9 < document.documentMode);
  }
  function Ba() {
    co && (co.detachEvent("onpropertychange", Va), fo = co = null);
  }
  function Va(e) {
    if (e.propertyName === "value" && ai(fo)) {
      var t = [];
      Fa(t, fo, e, Yr(e)), Zr(pf, t);
    }
  }
  function mf(e, t, n) {
    e === "focusin" ? (Ba(), co = t, fo = n, co.attachEvent("onpropertychange", Va)) : e === "focusout" && Ba();
  }
  function vf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return ai(fo);
  }
  function yf(e, t) {
    if (e === "click") return ai(t);
  }
  function gf(e, t) {
    if (e === "input" || e === "change") return ai(t);
  }
  function wf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Vt = typeof Object.is == "function" ? Object.is : wf;
  function po(e, t) {
    if (Vt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var o = n[r];
      if (!j.call(t, o) || !Vt(e[o], t[o])) return !1;
    }
    return !0;
  }
  function Wa(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ha(e, t) {
    var n = Wa(e);
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
      n = Wa(n);
    }
  }
  function Qa(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Qa(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ka() {
    for (var e = window, t = ht(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ht(e.document);
    }
    return t;
  }
  function Pl(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Sf(e) {
    var t = Ka(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Qa(n.ownerDocument.documentElement, n)) {
      if (r !== null && Pl(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var o = n.textContent.length, i = Math.min(r.start, o);
          r = r.end === void 0 ? i : Math.min(r.end, o), !e.extend && i > r && (o = r, r = i, i = o), o = Ha(n, i);
          var u = Ha(
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
  var xf = _ && "documentMode" in document && 11 >= document.documentMode, Cr = null, Nl = null, ho = null, Tl = !1;
  function Xa(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Tl || Cr == null || Cr !== ht(r) || (r = Cr, "selectionStart" in r && Pl(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), ho && po(ho, r) || (ho = r, r = fi(Nl, "onSelect"), 0 < r.length && (t = new wl("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Cr)));
  }
  function ui(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var _r = { animationend: ui("Animation", "AnimationEnd"), animationiteration: ui("Animation", "AnimationIteration"), animationstart: ui("Animation", "AnimationStart"), transitionend: ui("Transition", "TransitionEnd") }, Rl = {}, Ya = {};
  _ && (Ya = document.createElement("div").style, "AnimationEvent" in window || (delete _r.animationend.animation, delete _r.animationiteration.animation, delete _r.animationstart.animation), "TransitionEvent" in window || delete _r.transitionend.transition);
  function ci(e) {
    if (Rl[e]) return Rl[e];
    if (!_r[e]) return e;
    var t = _r[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Ya) return Rl[e] = t[n];
    return e;
  }
  var Ja = ci("animationend"), qa = ci("animationiteration"), Ga = ci("animationstart"), Za = ci("transitionend"), ba = /* @__PURE__ */ new Map(), eu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function On(e, t) {
    ba.set(e, t), m(t, [e]);
  }
  for (var zl = 0; zl < eu.length; zl++) {
    var Ll = eu[zl], kf = Ll.toLowerCase(), jf = Ll[0].toUpperCase() + Ll.slice(1);
    On(kf, "on" + jf);
  }
  On(Ja, "onAnimationEnd"), On(qa, "onAnimationIteration"), On(Ga, "onAnimationStart"), On("dblclick", "onDoubleClick"), On("focusin", "onFocus"), On("focusout", "onBlur"), On(Za, "onTransitionEnd"), N("onMouseEnter", ["mouseout", "mouseover"]), N("onMouseLeave", ["mouseout", "mouseover"]), N("onPointerEnter", ["pointerout", "pointerover"]), N("onPointerLeave", ["pointerout", "pointerover"]), m("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), m("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), m("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), m("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), m("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), m("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var mo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Ef = new Set("cancel close invalid load scroll toggle".split(" ").concat(mo));
  function tu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, q(r, t, void 0, e), e.currentTarget = null;
  }
  function nu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], o = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var u = r.length - 1; 0 <= u; u--) {
          var f = r[u], h = f.instance, k = f.currentTarget;
          if (f = f.listener, h !== i && o.isPropagationStopped()) break e;
          tu(o, f, k), i = h;
        }
        else for (u = 0; u < r.length; u++) {
          if (f = r[u], h = f.instance, k = f.currentTarget, f = f.listener, h !== i && o.isPropagationStopped()) break e;
          tu(o, f, k), i = h;
        }
      }
    }
    if (E) throw e = A, E = !1, A = null, e;
  }
  function Ue(e, t) {
    var n = t[Ul];
    n === void 0 && (n = t[Ul] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ru(t, e, 2, !1), n.add(r));
  }
  function Il(e, t, n) {
    var r = 0;
    t && (r |= 4), ru(n, e, r, t);
  }
  var di = "_reactListening" + Math.random().toString(36).slice(2);
  function vo(e) {
    if (!e[di]) {
      e[di] = !0, d.forEach(function(n) {
        n !== "selectionchange" && (Ef.has(n) || Il(n, !1, e), Il(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[di] || (t[di] = !0, Il("selectionchange", !1, t));
    }
  }
  function ru(e, t, n, r) {
    switch (_a(t)) {
      case 1:
        var o = $d;
        break;
      case 4:
        o = Fd;
        break;
      default:
        o = vl;
    }
    n = o.bind(null, t, n, e), o = void 0, !nr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), r ? o !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: o }) : e.addEventListener(t, n, !0) : o !== void 0 ? e.addEventListener(t, n, { passive: o }) : e.addEventListener(t, n, !1);
  }
  function Ol(e, t, n, r, o) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var u = r.tag;
      if (u === 3 || u === 4) {
        var f = r.stateNode.containerInfo;
        if (f === o || f.nodeType === 8 && f.parentNode === o) break;
        if (u === 4) for (u = r.return; u !== null; ) {
          var h = u.tag;
          if ((h === 3 || h === 4) && (h = u.stateNode.containerInfo, h === o || h.nodeType === 8 && h.parentNode === o)) return;
          u = u.return;
        }
        for (; f !== null; ) {
          if (u = ir(f), u === null) return;
          if (h = u.tag, h === 5 || h === 6) {
            r = i = u;
            continue e;
          }
          f = f.parentNode;
        }
      }
      r = r.return;
    }
    Zr(function() {
      var k = i, L = Yr(n), I = [];
      e: {
        var z = ba.get(e);
        if (z !== void 0) {
          var W = wl, K = e;
          switch (e) {
            case "keypress":
              if (ii(n) === 0) break e;
            case "keydown":
            case "keyup":
              W = bd;
              break;
            case "focusin":
              K = "focus", W = kl;
              break;
            case "focusout":
              K = "blur", W = kl;
              break;
            case "beforeblur":
            case "afterblur":
              W = kl;
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
              W = Ta;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              W = Bd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              W = nf;
              break;
            case Ja:
            case qa:
            case Ga:
              W = Hd;
              break;
            case Za:
              W = of;
              break;
            case "scroll":
              W = Dd;
              break;
            case "wheel":
              W = sf;
              break;
            case "copy":
            case "cut":
            case "paste":
              W = Kd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              W = za;
          }
          var J = (t & 4) !== 0, Je = !J && e === "scroll", S = J ? z !== null ? z + "Capture" : null : z;
          J = [];
          for (var y = k, x; y !== null; ) {
            x = y;
            var M = x.stateNode;
            if (x.tag === 5 && M !== null && (x = M, S !== null && (M = Pn(y, S), M != null && J.push(yo(y, M, x)))), Je) break;
            y = y.return;
          }
          0 < J.length && (z = new W(z, K, null, n, L), I.push({ event: z, listeners: J }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (z = e === "mouseover" || e === "pointerover", W = e === "mouseout" || e === "pointerout", z && n !== wr && (K = n.relatedTarget || n.fromElement) && (ir(K) || K[fn])) break e;
          if ((W || z) && (z = L.window === L ? L : (z = L.ownerDocument) ? z.defaultView || z.parentWindow : window, W ? (K = n.relatedTarget || n.toElement, W = k, K = K ? ir(K) : null, K !== null && (Je = de(K), K !== Je || K.tag !== 5 && K.tag !== 6) && (K = null)) : (W = null, K = k), W !== K)) {
            if (J = Ta, M = "onMouseLeave", S = "onMouseEnter", y = "mouse", (e === "pointerout" || e === "pointerover") && (J = za, M = "onPointerLeave", S = "onPointerEnter", y = "pointer"), Je = W == null ? z : Tr(W), x = K == null ? z : Tr(K), z = new J(M, y + "leave", W, n, L), z.target = Je, z.relatedTarget = x, M = null, ir(L) === k && (J = new J(S, y + "enter", K, n, L), J.target = x, J.relatedTarget = Je, M = J), Je = M, W && K) t: {
              for (J = W, S = K, y = 0, x = J; x; x = Pr(x)) y++;
              for (x = 0, M = S; M; M = Pr(M)) x++;
              for (; 0 < y - x; ) J = Pr(J), y--;
              for (; 0 < x - y; ) S = Pr(S), x--;
              for (; y--; ) {
                if (J === S || S !== null && J === S.alternate) break t;
                J = Pr(J), S = Pr(S);
              }
              J = null;
            }
            else J = null;
            W !== null && ou(I, z, W, J, !1), K !== null && Je !== null && ou(I, Je, K, J, !0);
          }
        }
        e: {
          if (z = k ? Tr(k) : window, W = z.nodeName && z.nodeName.toLowerCase(), W === "select" || W === "input" && z.type === "file") var G = hf;
          else if ($a(z)) if (Da) G = gf;
          else {
            G = vf;
            var oe = mf;
          }
          else (W = z.nodeName) && W.toLowerCase() === "input" && (z.type === "checkbox" || z.type === "radio") && (G = yf);
          if (G && (G = G(e, k))) {
            Fa(I, G, n, L);
            break e;
          }
          oe && oe(e, z, k), e === "focusout" && (oe = z._wrapperState) && oe.controlled && z.type === "number" && Qr(z, "number", z.value);
        }
        switch (oe = k ? Tr(k) : window, e) {
          case "focusin":
            ($a(oe) || oe.contentEditable === "true") && (Cr = oe, Nl = k, ho = null);
            break;
          case "focusout":
            ho = Nl = Cr = null;
            break;
          case "mousedown":
            Tl = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Tl = !1, Xa(I, n, L);
            break;
          case "selectionchange":
            if (xf) break;
          case "keydown":
          case "keyup":
            Xa(I, n, L);
        }
        var ie;
        if (El) e: {
          switch (e) {
            case "compositionstart":
              var ce = "onCompositionStart";
              break e;
            case "compositionend":
              ce = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ce = "onCompositionUpdate";
              break e;
          }
          ce = void 0;
        }
        else Er ? Ma(e, n) && (ce = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ce = "onCompositionStart");
        ce && (La && n.locale !== "ko" && (Er || ce !== "onCompositionStart" ? ce === "onCompositionEnd" && Er && (ie = Pa()) : (In = L, gl = "value" in In ? In.value : In.textContent, Er = !0)), oe = fi(k, ce), 0 < oe.length && (ce = new Ra(ce, e, null, n, L), I.push({ event: ce, listeners: oe }), ie ? ce.data = ie : (ie = Aa(n), ie !== null && (ce.data = ie)))), (ie = uf ? cf(e, n) : df(e, n)) && (k = fi(k, "onBeforeInput"), 0 < k.length && (L = new Ra("onBeforeInput", "beforeinput", null, n, L), I.push({ event: L, listeners: k }), L.data = ie));
      }
      nu(I, t);
    });
  }
  function yo(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function fi(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var o = e, i = o.stateNode;
      o.tag === 5 && i !== null && (o = i, i = Pn(e, n), i != null && r.unshift(yo(e, i, o)), i = Pn(e, t), i != null && r.push(yo(e, i, o))), e = e.return;
    }
    return r;
  }
  function Pr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function ou(e, t, n, r, o) {
    for (var i = t._reactName, u = []; n !== null && n !== r; ) {
      var f = n, h = f.alternate, k = f.stateNode;
      if (h !== null && h === r) break;
      f.tag === 5 && k !== null && (f = k, o ? (h = Pn(n, i), h != null && u.unshift(yo(n, h, f))) : o || (h = Pn(n, i), h != null && u.push(yo(n, h, f)))), n = n.return;
    }
    u.length !== 0 && e.push({ event: t, listeners: u });
  }
  var Cf = /\r\n?/g, _f = /\u0000|\uFFFD/g;
  function iu(e) {
    return (typeof e == "string" ? e : "" + e).replace(Cf, `
`).replace(_f, "");
  }
  function pi(e, t, n) {
    if (t = iu(t), iu(e) !== t && n) throw Error(s(425));
  }
  function hi() {
  }
  var Ml = null, Al = null;
  function $l(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Fl = typeof setTimeout == "function" ? setTimeout : void 0, Pf = typeof clearTimeout == "function" ? clearTimeout : void 0, lu = typeof Promise == "function" ? Promise : void 0, Nf = typeof queueMicrotask == "function" ? queueMicrotask : typeof lu < "u" ? function(e) {
    return lu.resolve(null).then(e).catch(Tf);
  } : Fl;
  function Tf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Dl(e, t) {
    var n = t, r = 0;
    do {
      var o = n.nextSibling;
      if (e.removeChild(n), o && o.nodeType === 8) if (n = o.data, n === "/$") {
        if (r === 0) {
          e.removeChild(o), lo(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = o;
    } while (n);
    lo(t);
  }
  function Mn(e) {
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
  function su(e) {
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
  var Nr = Math.random().toString(36).slice(2), en = "__reactFiber$" + Nr, go = "__reactProps$" + Nr, fn = "__reactContainer$" + Nr, Ul = "__reactEvents$" + Nr, Rf = "__reactListeners$" + Nr, zf = "__reactHandles$" + Nr;
  function ir(e) {
    var t = e[en];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[fn] || n[en]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = su(e); e !== null; ) {
          if (n = e[en]) return n;
          e = su(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function wo(e) {
    return e = e[en] || e[fn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Tr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function mi(e) {
    return e[go] || null;
  }
  var Bl = [], Rr = -1;
  function An(e) {
    return { current: e };
  }
  function Be(e) {
    0 > Rr || (e.current = Bl[Rr], Bl[Rr] = null, Rr--);
  }
  function Fe(e, t) {
    Rr++, Bl[Rr] = e.current, e.current = t;
  }
  var $n = {}, ct = An($n), wt = An(!1), lr = $n;
  function zr(e, t) {
    var n = e.type.contextTypes;
    if (!n) return $n;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o = {}, i;
    for (i in n) o[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = o), o;
  }
  function St(e) {
    return e = e.childContextTypes, e != null;
  }
  function vi() {
    Be(wt), Be(ct);
  }
  function au(e, t, n) {
    if (ct.current !== $n) throw Error(s(168));
    Fe(ct, t), Fe(wt, n);
  }
  function uu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var o in r) if (!(o in t)) throw Error(s(108, me(e) || "Unknown", o));
    return U({}, n, r);
  }
  function yi(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || $n, lr = ct.current, Fe(ct, e), Fe(wt, wt.current), !0;
  }
  function cu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = uu(e, t, lr), r.__reactInternalMemoizedMergedChildContext = e, Be(wt), Be(ct), Fe(ct, e)) : Be(wt), Fe(wt, n);
  }
  var pn = null, gi = !1, Vl = !1;
  function du(e) {
    pn === null ? pn = [e] : pn.push(e);
  }
  function Lf(e) {
    gi = !0, du(e);
  }
  function Fn() {
    if (!Vl && pn !== null) {
      Vl = !0;
      var e = 0, t = Ie;
      try {
        var n = pn;
        for (Ie = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        pn = null, gi = !1;
      } catch (o) {
        throw pn !== null && (pn = pn.slice(e + 1)), be(nt, Fn), o;
      } finally {
        Ie = t, Vl = !1;
      }
    }
    return null;
  }
  var Lr = [], Ir = 0, wi = null, Si = 0, Mt = [], At = 0, sr = null, hn = 1, mn = "";
  function ar(e, t) {
    Lr[Ir++] = Si, Lr[Ir++] = wi, wi = e, Si = t;
  }
  function fu(e, t, n) {
    Mt[At++] = hn, Mt[At++] = mn, Mt[At++] = sr, sr = e;
    var r = hn;
    e = mn;
    var o = 32 - Nt(r) - 1;
    r &= ~(1 << o), n += 1;
    var i = 32 - Nt(t) + o;
    if (30 < i) {
      var u = o - o % 5;
      i = (r & (1 << u) - 1).toString(32), r >>= u, o -= u, hn = 1 << 32 - Nt(t) + o | n << o | r, mn = i + e;
    } else hn = 1 << i | n << o | r, mn = e;
  }
  function Wl(e) {
    e.return !== null && (ar(e, 1), fu(e, 1, 0));
  }
  function Hl(e) {
    for (; e === wi; ) wi = Lr[--Ir], Lr[Ir] = null, Si = Lr[--Ir], Lr[Ir] = null;
    for (; e === sr; ) sr = Mt[--At], Mt[At] = null, mn = Mt[--At], Mt[At] = null, hn = Mt[--At], Mt[At] = null;
  }
  var Rt = null, zt = null, We = !1, Wt = null;
  function pu(e, t) {
    var n = Ut(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function hu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Rt = e, zt = Mn(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Rt = e, zt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = sr !== null ? { id: hn, overflow: mn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Ut(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Rt = e, zt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ql(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Kl(e) {
    if (We) {
      var t = zt;
      if (t) {
        var n = t;
        if (!hu(e, t)) {
          if (Ql(e)) throw Error(s(418));
          t = Mn(n.nextSibling);
          var r = Rt;
          t && hu(e, t) ? pu(r, n) : (e.flags = e.flags & -4097 | 2, We = !1, Rt = e);
        }
      } else {
        if (Ql(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, We = !1, Rt = e;
      }
    }
  }
  function mu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    Rt = e;
  }
  function xi(e) {
    if (e !== Rt) return !1;
    if (!We) return mu(e), We = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !$l(e.type, e.memoizedProps)), t && (t = zt)) {
      if (Ql(e)) throw vu(), Error(s(418));
      for (; t; ) pu(e, t), t = Mn(t.nextSibling);
    }
    if (mu(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                zt = Mn(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        zt = null;
      }
    } else zt = Rt ? Mn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function vu() {
    for (var e = zt; e; ) e = Mn(e.nextSibling);
  }
  function Or() {
    zt = Rt = null, We = !1;
  }
  function Xl(e) {
    Wt === null ? Wt = [e] : Wt.push(e);
  }
  var If = ee.ReactCurrentBatchConfig;
  function So(e, t, n) {
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
  function ki(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function yu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function gu(e) {
    function t(S, y) {
      if (e) {
        var x = S.deletions;
        x === null ? (S.deletions = [y], S.flags |= 16) : x.push(y);
      }
    }
    function n(S, y) {
      if (!e) return null;
      for (; y !== null; ) t(S, y), y = y.sibling;
      return null;
    }
    function r(S, y) {
      for (S = /* @__PURE__ */ new Map(); y !== null; ) y.key !== null ? S.set(y.key, y) : S.set(y.index, y), y = y.sibling;
      return S;
    }
    function o(S, y) {
      return S = Kn(S, y), S.index = 0, S.sibling = null, S;
    }
    function i(S, y, x) {
      return S.index = x, e ? (x = S.alternate, x !== null ? (x = x.index, x < y ? (S.flags |= 2, y) : x) : (S.flags |= 2, y)) : (S.flags |= 1048576, y);
    }
    function u(S) {
      return e && S.alternate === null && (S.flags |= 2), S;
    }
    function f(S, y, x, M) {
      return y === null || y.tag !== 6 ? (y = Fs(x, S.mode, M), y.return = S, y) : (y = o(y, x), y.return = S, y);
    }
    function h(S, y, x, M) {
      var G = x.type;
      return G === he ? L(S, y, x.props.children, M, x.key) : y !== null && (y.elementType === G || typeof G == "object" && G !== null && G.$$typeof === ve && yu(G) === y.type) ? (M = o(y, x.props), M.ref = So(S, y, x), M.return = S, M) : (M = Ki(x.type, x.key, x.props, null, S.mode, M), M.ref = So(S, y, x), M.return = S, M);
    }
    function k(S, y, x, M) {
      return y === null || y.tag !== 4 || y.stateNode.containerInfo !== x.containerInfo || y.stateNode.implementation !== x.implementation ? (y = Ds(x, S.mode, M), y.return = S, y) : (y = o(y, x.children || []), y.return = S, y);
    }
    function L(S, y, x, M, G) {
      return y === null || y.tag !== 7 ? (y = vr(x, S.mode, M, G), y.return = S, y) : (y = o(y, x), y.return = S, y);
    }
    function I(S, y, x) {
      if (typeof y == "string" && y !== "" || typeof y == "number") return y = Fs("" + y, S.mode, x), y.return = S, y;
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case ge:
            return x = Ki(y.type, y.key, y.props, null, S.mode, x), x.ref = So(S, null, y), x.return = S, x;
          case pe:
            return y = Ds(y, S.mode, x), y.return = S, y;
          case ve:
            var M = y._init;
            return I(S, M(y._payload), x);
        }
        if (jn(y) || B(y)) return y = vr(y, S.mode, x, null), y.return = S, y;
        ki(S, y);
      }
      return null;
    }
    function z(S, y, x, M) {
      var G = y !== null ? y.key : null;
      if (typeof x == "string" && x !== "" || typeof x == "number") return G !== null ? null : f(S, y, "" + x, M);
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case ge:
            return x.key === G ? h(S, y, x, M) : null;
          case pe:
            return x.key === G ? k(S, y, x, M) : null;
          case ve:
            return G = x._init, z(
              S,
              y,
              G(x._payload),
              M
            );
        }
        if (jn(x) || B(x)) return G !== null ? null : L(S, y, x, M, null);
        ki(S, x);
      }
      return null;
    }
    function W(S, y, x, M, G) {
      if (typeof M == "string" && M !== "" || typeof M == "number") return S = S.get(x) || null, f(y, S, "" + M, G);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case ge:
            return S = S.get(M.key === null ? x : M.key) || null, h(y, S, M, G);
          case pe:
            return S = S.get(M.key === null ? x : M.key) || null, k(y, S, M, G);
          case ve:
            var oe = M._init;
            return W(S, y, x, oe(M._payload), G);
        }
        if (jn(M) || B(M)) return S = S.get(x) || null, L(y, S, M, G, null);
        ki(y, M);
      }
      return null;
    }
    function K(S, y, x, M) {
      for (var G = null, oe = null, ie = y, ce = y = 0, it = null; ie !== null && ce < x.length; ce++) {
        ie.index > ce ? (it = ie, ie = null) : it = ie.sibling;
        var Ce = z(S, ie, x[ce], M);
        if (Ce === null) {
          ie === null && (ie = it);
          break;
        }
        e && ie && Ce.alternate === null && t(S, ie), y = i(Ce, y, ce), oe === null ? G = Ce : oe.sibling = Ce, oe = Ce, ie = it;
      }
      if (ce === x.length) return n(S, ie), We && ar(S, ce), G;
      if (ie === null) {
        for (; ce < x.length; ce++) ie = I(S, x[ce], M), ie !== null && (y = i(ie, y, ce), oe === null ? G = ie : oe.sibling = ie, oe = ie);
        return We && ar(S, ce), G;
      }
      for (ie = r(S, ie); ce < x.length; ce++) it = W(ie, S, ce, x[ce], M), it !== null && (e && it.alternate !== null && ie.delete(it.key === null ? ce : it.key), y = i(it, y, ce), oe === null ? G = it : oe.sibling = it, oe = it);
      return e && ie.forEach(function(Xn) {
        return t(S, Xn);
      }), We && ar(S, ce), G;
    }
    function J(S, y, x, M) {
      var G = B(x);
      if (typeof G != "function") throw Error(s(150));
      if (x = G.call(x), x == null) throw Error(s(151));
      for (var oe = G = null, ie = y, ce = y = 0, it = null, Ce = x.next(); ie !== null && !Ce.done; ce++, Ce = x.next()) {
        ie.index > ce ? (it = ie, ie = null) : it = ie.sibling;
        var Xn = z(S, ie, Ce.value, M);
        if (Xn === null) {
          ie === null && (ie = it);
          break;
        }
        e && ie && Xn.alternate === null && t(S, ie), y = i(Xn, y, ce), oe === null ? G = Xn : oe.sibling = Xn, oe = Xn, ie = it;
      }
      if (Ce.done) return n(
        S,
        ie
      ), We && ar(S, ce), G;
      if (ie === null) {
        for (; !Ce.done; ce++, Ce = x.next()) Ce = I(S, Ce.value, M), Ce !== null && (y = i(Ce, y, ce), oe === null ? G = Ce : oe.sibling = Ce, oe = Ce);
        return We && ar(S, ce), G;
      }
      for (ie = r(S, ie); !Ce.done; ce++, Ce = x.next()) Ce = W(ie, S, ce, Ce.value, M), Ce !== null && (e && Ce.alternate !== null && ie.delete(Ce.key === null ? ce : Ce.key), y = i(Ce, y, ce), oe === null ? G = Ce : oe.sibling = Ce, oe = Ce);
      return e && ie.forEach(function(fp) {
        return t(S, fp);
      }), We && ar(S, ce), G;
    }
    function Je(S, y, x, M) {
      if (typeof x == "object" && x !== null && x.type === he && x.key === null && (x = x.props.children), typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case ge:
            e: {
              for (var G = x.key, oe = y; oe !== null; ) {
                if (oe.key === G) {
                  if (G = x.type, G === he) {
                    if (oe.tag === 7) {
                      n(S, oe.sibling), y = o(oe, x.props.children), y.return = S, S = y;
                      break e;
                    }
                  } else if (oe.elementType === G || typeof G == "object" && G !== null && G.$$typeof === ve && yu(G) === oe.type) {
                    n(S, oe.sibling), y = o(oe, x.props), y.ref = So(S, oe, x), y.return = S, S = y;
                    break e;
                  }
                  n(S, oe);
                  break;
                } else t(S, oe);
                oe = oe.sibling;
              }
              x.type === he ? (y = vr(x.props.children, S.mode, M, x.key), y.return = S, S = y) : (M = Ki(x.type, x.key, x.props, null, S.mode, M), M.ref = So(S, y, x), M.return = S, S = M);
            }
            return u(S);
          case pe:
            e: {
              for (oe = x.key; y !== null; ) {
                if (y.key === oe) if (y.tag === 4 && y.stateNode.containerInfo === x.containerInfo && y.stateNode.implementation === x.implementation) {
                  n(S, y.sibling), y = o(y, x.children || []), y.return = S, S = y;
                  break e;
                } else {
                  n(S, y);
                  break;
                }
                else t(S, y);
                y = y.sibling;
              }
              y = Ds(x, S.mode, M), y.return = S, S = y;
            }
            return u(S);
          case ve:
            return oe = x._init, Je(S, y, oe(x._payload), M);
        }
        if (jn(x)) return K(S, y, x, M);
        if (B(x)) return J(S, y, x, M);
        ki(S, x);
      }
      return typeof x == "string" && x !== "" || typeof x == "number" ? (x = "" + x, y !== null && y.tag === 6 ? (n(S, y.sibling), y = o(y, x), y.return = S, S = y) : (n(S, y), y = Fs(x, S.mode, M), y.return = S, S = y), u(S)) : n(S, y);
    }
    return Je;
  }
  var Mr = gu(!0), wu = gu(!1), ji = An(null), Ei = null, Ar = null, Yl = null;
  function Jl() {
    Yl = Ar = Ei = null;
  }
  function ql(e) {
    var t = ji.current;
    Be(ji), e._currentValue = t;
  }
  function Gl(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function $r(e, t) {
    Ei = e, Yl = Ar = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (xt = !0), e.firstContext = null);
  }
  function $t(e) {
    var t = e._currentValue;
    if (Yl !== e) if (e = { context: e, memoizedValue: t, next: null }, Ar === null) {
      if (Ei === null) throw Error(s(308));
      Ar = e, Ei.dependencies = { lanes: 0, firstContext: e };
    } else Ar = Ar.next = e;
    return t;
  }
  var ur = null;
  function Zl(e) {
    ur === null ? ur = [e] : ur.push(e);
  }
  function Su(e, t, n, r) {
    var o = t.interleaved;
    return o === null ? (n.next = n, Zl(t)) : (n.next = o.next, o.next = n), t.interleaved = n, vn(e, r);
  }
  function vn(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Dn = !1;
  function bl(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function xu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function yn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Un(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (Ee & 2) !== 0) {
      var o = r.pending;
      return o === null ? t.next = t : (t.next = o.next, o.next = t), r.pending = t, vn(e, n);
    }
    return o = r.interleaved, o === null ? (t.next = t, Zl(r)) : (t.next = o.next, o.next = t), r.interleaved = t, vn(e, n);
  }
  function Ci(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, pl(e, n);
    }
  }
  function ku(e, t) {
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
  function _i(e, t, n, r) {
    var o = e.updateQueue;
    Dn = !1;
    var i = o.firstBaseUpdate, u = o.lastBaseUpdate, f = o.shared.pending;
    if (f !== null) {
      o.shared.pending = null;
      var h = f, k = h.next;
      h.next = null, u === null ? i = k : u.next = k, u = h;
      var L = e.alternate;
      L !== null && (L = L.updateQueue, f = L.lastBaseUpdate, f !== u && (f === null ? L.firstBaseUpdate = k : f.next = k, L.lastBaseUpdate = h));
    }
    if (i !== null) {
      var I = o.baseState;
      u = 0, L = k = h = null, f = i;
      do {
        var z = f.lane, W = f.eventTime;
        if ((r & z) === z) {
          L !== null && (L = L.next = {
            eventTime: W,
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          });
          e: {
            var K = e, J = f;
            switch (z = t, W = n, J.tag) {
              case 1:
                if (K = J.payload, typeof K == "function") {
                  I = K.call(W, I, z);
                  break e;
                }
                I = K;
                break e;
              case 3:
                K.flags = K.flags & -65537 | 128;
              case 0:
                if (K = J.payload, z = typeof K == "function" ? K.call(W, I, z) : K, z == null) break e;
                I = U({}, I, z);
                break e;
              case 2:
                Dn = !0;
            }
          }
          f.callback !== null && f.lane !== 0 && (e.flags |= 64, z = o.effects, z === null ? o.effects = [f] : z.push(f));
        } else W = { eventTime: W, lane: z, tag: f.tag, payload: f.payload, callback: f.callback, next: null }, L === null ? (k = L = W, h = I) : L = L.next = W, u |= z;
        if (f = f.next, f === null) {
          if (f = o.shared.pending, f === null) break;
          z = f, f = z.next, z.next = null, o.lastBaseUpdate = z, o.shared.pending = null;
        }
      } while (!0);
      if (L === null && (h = I), o.baseState = h, o.firstBaseUpdate = k, o.lastBaseUpdate = L, t = o.shared.interleaved, t !== null) {
        o = t;
        do
          u |= o.lane, o = o.next;
        while (o !== t);
      } else i === null && (o.shared.lanes = 0);
      fr |= u, e.lanes = u, e.memoizedState = I;
    }
  }
  function ju(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], o = r.callback;
      if (o !== null) {
        if (r.callback = null, r = n, typeof o != "function") throw Error(s(191, o));
        o.call(r);
      }
    }
  }
  var xo = {}, tn = An(xo), ko = An(xo), jo = An(xo);
  function cr(e) {
    if (e === xo) throw Error(s(174));
    return e;
  }
  function es(e, t) {
    switch (Fe(jo, t), Fe(ko, e), Fe(tn, xo), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : gr(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = gr(t, e);
    }
    Be(tn), Fe(tn, t);
  }
  function Fr() {
    Be(tn), Be(ko), Be(jo);
  }
  function Eu(e) {
    cr(jo.current);
    var t = cr(tn.current), n = gr(t, e.type);
    t !== n && (Fe(ko, e), Fe(tn, n));
  }
  function ts(e) {
    ko.current === e && (Be(tn), Be(ko));
  }
  var He = An(0);
  function Pi(e) {
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
  var ns = [];
  function rs() {
    for (var e = 0; e < ns.length; e++) ns[e]._workInProgressVersionPrimary = null;
    ns.length = 0;
  }
  var Ni = ee.ReactCurrentDispatcher, os = ee.ReactCurrentBatchConfig, dr = 0, Qe = null, et = null, rt = null, Ti = !1, Eo = !1, Co = 0, Of = 0;
  function dt() {
    throw Error(s(321));
  }
  function is(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Vt(e[n], t[n])) return !1;
    return !0;
  }
  function ls(e, t, n, r, o, i) {
    if (dr = i, Qe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Ni.current = e === null || e.memoizedState === null ? Ff : Df, e = n(r, o), Eo) {
      i = 0;
      do {
        if (Eo = !1, Co = 0, 25 <= i) throw Error(s(301));
        i += 1, rt = et = null, t.updateQueue = null, Ni.current = Uf, e = n(r, o);
      } while (Eo);
    }
    if (Ni.current = Li, t = et !== null && et.next !== null, dr = 0, rt = et = Qe = null, Ti = !1, t) throw Error(s(300));
    return e;
  }
  function ss() {
    var e = Co !== 0;
    return Co = 0, e;
  }
  function nn() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return rt === null ? Qe.memoizedState = rt = e : rt = rt.next = e, rt;
  }
  function Ft() {
    if (et === null) {
      var e = Qe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = et.next;
    var t = rt === null ? Qe.memoizedState : rt.next;
    if (t !== null) rt = t, et = e;
    else {
      if (e === null) throw Error(s(310));
      et = e, e = { memoizedState: et.memoizedState, baseState: et.baseState, baseQueue: et.baseQueue, queue: et.queue, next: null }, rt === null ? Qe.memoizedState = rt = e : rt = rt.next = e;
    }
    return rt;
  }
  function _o(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function as(e) {
    var t = Ft(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = et, o = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (o !== null) {
        var u = o.next;
        o.next = i.next, i.next = u;
      }
      r.baseQueue = o = i, n.pending = null;
    }
    if (o !== null) {
      i = o.next, r = r.baseState;
      var f = u = null, h = null, k = i;
      do {
        var L = k.lane;
        if ((dr & L) === L) h !== null && (h = h.next = { lane: 0, action: k.action, hasEagerState: k.hasEagerState, eagerState: k.eagerState, next: null }), r = k.hasEagerState ? k.eagerState : e(r, k.action);
        else {
          var I = {
            lane: L,
            action: k.action,
            hasEagerState: k.hasEagerState,
            eagerState: k.eagerState,
            next: null
          };
          h === null ? (f = h = I, u = r) : h = h.next = I, Qe.lanes |= L, fr |= L;
        }
        k = k.next;
      } while (k !== null && k !== i);
      h === null ? u = r : h.next = f, Vt(r, t.memoizedState) || (xt = !0), t.memoizedState = r, t.baseState = u, t.baseQueue = h, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      o = e;
      do
        i = o.lane, Qe.lanes |= i, fr |= i, o = o.next;
      while (o !== e);
    } else o === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function us(e) {
    var t = Ft(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, o = n.pending, i = t.memoizedState;
    if (o !== null) {
      n.pending = null;
      var u = o = o.next;
      do
        i = e(i, u.action), u = u.next;
      while (u !== o);
      Vt(i, t.memoizedState) || (xt = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function Cu() {
  }
  function _u(e, t) {
    var n = Qe, r = Ft(), o = t(), i = !Vt(r.memoizedState, o);
    if (i && (r.memoizedState = o, xt = !0), r = r.queue, cs(Tu.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || rt !== null && rt.memoizedState.tag & 1) {
      if (n.flags |= 2048, Po(9, Nu.bind(null, n, r, o, t), void 0, null), ot === null) throw Error(s(349));
      (dr & 30) !== 0 || Pu(n, t, o);
    }
    return o;
  }
  function Pu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Qe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Qe.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Nu(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Ru(t) && zu(e);
  }
  function Tu(e, t, n) {
    return n(function() {
      Ru(t) && zu(e);
    });
  }
  function Ru(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Vt(e, n);
    } catch {
      return !0;
    }
  }
  function zu(e) {
    var t = vn(e, 1);
    t !== null && Xt(t, e, 1, -1);
  }
  function Lu(e) {
    var t = nn();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: _o, lastRenderedState: e }, t.queue = e, e = e.dispatch = $f.bind(null, Qe, e), [t.memoizedState, e];
  }
  function Po(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Qe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Qe.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Iu() {
    return Ft().memoizedState;
  }
  function Ri(e, t, n, r) {
    var o = nn();
    Qe.flags |= e, o.memoizedState = Po(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function zi(e, t, n, r) {
    var o = Ft();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (et !== null) {
      var u = et.memoizedState;
      if (i = u.destroy, r !== null && is(r, u.deps)) {
        o.memoizedState = Po(t, n, i, r);
        return;
      }
    }
    Qe.flags |= e, o.memoizedState = Po(1 | t, n, i, r);
  }
  function Ou(e, t) {
    return Ri(8390656, 8, e, t);
  }
  function cs(e, t) {
    return zi(2048, 8, e, t);
  }
  function Mu(e, t) {
    return zi(4, 2, e, t);
  }
  function Au(e, t) {
    return zi(4, 4, e, t);
  }
  function $u(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Fu(e, t, n) {
    return n = n != null ? n.concat([e]) : null, zi(4, 4, $u.bind(null, t, e), n);
  }
  function ds() {
  }
  function Du(e, t) {
    var n = Ft();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && is(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Uu(e, t) {
    var n = Ft();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && is(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Bu(e, t, n) {
    return (dr & 21) === 0 ? (e.baseState && (e.baseState = !1, xt = !0), e.memoizedState = n) : (Vt(n, t) || (n = ya(), Qe.lanes |= n, fr |= n, e.baseState = !0), t);
  }
  function Mf(e, t) {
    var n = Ie;
    Ie = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = os.transition;
    os.transition = {};
    try {
      e(!1), t();
    } finally {
      Ie = n, os.transition = r;
    }
  }
  function Vu() {
    return Ft().memoizedState;
  }
  function Af(e, t, n) {
    var r = Hn(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Wu(e)) Hu(t, n);
    else if (n = Su(e, t, n, r), n !== null) {
      var o = yt();
      Xt(n, e, r, o), Qu(n, t, r);
    }
  }
  function $f(e, t, n) {
    var r = Hn(e), o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Wu(e)) Hu(t, o);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var u = t.lastRenderedState, f = i(u, n);
        if (o.hasEagerState = !0, o.eagerState = f, Vt(f, u)) {
          var h = t.interleaved;
          h === null ? (o.next = o, Zl(t)) : (o.next = h.next, h.next = o), t.interleaved = o;
          return;
        }
      } catch {
      } finally {
      }
      n = Su(e, t, o, r), n !== null && (o = yt(), Xt(n, e, r, o), Qu(n, t, r));
    }
  }
  function Wu(e) {
    var t = e.alternate;
    return e === Qe || t !== null && t === Qe;
  }
  function Hu(e, t) {
    Eo = Ti = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Qu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, pl(e, n);
    }
  }
  var Li = { readContext: $t, useCallback: dt, useContext: dt, useEffect: dt, useImperativeHandle: dt, useInsertionEffect: dt, useLayoutEffect: dt, useMemo: dt, useReducer: dt, useRef: dt, useState: dt, useDebugValue: dt, useDeferredValue: dt, useTransition: dt, useMutableSource: dt, useSyncExternalStore: dt, useId: dt, unstable_isNewReconciler: !1 }, Ff = { readContext: $t, useCallback: function(e, t) {
    return nn().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: $t, useEffect: Ou, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Ri(
      4194308,
      4,
      $u.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return Ri(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Ri(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = nn();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = nn();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Af.bind(null, Qe, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = nn();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Lu, useDebugValue: ds, useDeferredValue: function(e) {
    return nn().memoizedState = e;
  }, useTransition: function() {
    var e = Lu(!1), t = e[0];
    return e = Mf.bind(null, e[1]), nn().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Qe, o = nn();
    if (We) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), ot === null) throw Error(s(349));
      (dr & 30) !== 0 || Pu(r, t, n);
    }
    o.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return o.queue = i, Ou(Tu.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, Po(9, Nu.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = nn(), t = ot.identifierPrefix;
    if (We) {
      var n = mn, r = hn;
      n = (r & ~(1 << 32 - Nt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Co++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Of++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Df = {
    readContext: $t,
    useCallback: Du,
    useContext: $t,
    useEffect: cs,
    useImperativeHandle: Fu,
    useInsertionEffect: Mu,
    useLayoutEffect: Au,
    useMemo: Uu,
    useReducer: as,
    useRef: Iu,
    useState: function() {
      return as(_o);
    },
    useDebugValue: ds,
    useDeferredValue: function(e) {
      var t = Ft();
      return Bu(t, et.memoizedState, e);
    },
    useTransition: function() {
      var e = as(_o)[0], t = Ft().memoizedState;
      return [e, t];
    },
    useMutableSource: Cu,
    useSyncExternalStore: _u,
    useId: Vu,
    unstable_isNewReconciler: !1
  }, Uf = { readContext: $t, useCallback: Du, useContext: $t, useEffect: cs, useImperativeHandle: Fu, useInsertionEffect: Mu, useLayoutEffect: Au, useMemo: Uu, useReducer: us, useRef: Iu, useState: function() {
    return us(_o);
  }, useDebugValue: ds, useDeferredValue: function(e) {
    var t = Ft();
    return et === null ? t.memoizedState = e : Bu(t, et.memoizedState, e);
  }, useTransition: function() {
    var e = us(_o)[0], t = Ft().memoizedState;
    return [e, t];
  }, useMutableSource: Cu, useSyncExternalStore: _u, useId: Vu, unstable_isNewReconciler: !1 };
  function Ht(e, t) {
    if (e && e.defaultProps) {
      t = U({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function fs(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : U({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Ii = { isMounted: function(e) {
    return (e = e._reactInternals) ? de(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = yt(), o = Hn(e), i = yn(r, o);
    i.payload = t, n != null && (i.callback = n), t = Un(e, i, o), t !== null && (Xt(t, e, o, r), Ci(t, e, o));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = yt(), o = Hn(e), i = yn(r, o);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Un(e, i, o), t !== null && (Xt(t, e, o, r), Ci(t, e, o));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = yt(), r = Hn(e), o = yn(n, r);
    o.tag = 2, t != null && (o.callback = t), t = Un(e, o, r), t !== null && (Xt(t, e, r, n), Ci(t, e, r));
  } };
  function Ku(e, t, n, r, o, i, u) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, u) : t.prototype && t.prototype.isPureReactComponent ? !po(n, r) || !po(o, i) : !0;
  }
  function Xu(e, t, n) {
    var r = !1, o = $n, i = t.contextType;
    return typeof i == "object" && i !== null ? i = $t(i) : (o = St(t) ? lr : ct.current, r = t.contextTypes, i = (r = r != null) ? zr(e, o) : $n), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Ii, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function Yu(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ii.enqueueReplaceState(t, t.state, null);
  }
  function ps(e, t, n, r) {
    var o = e.stateNode;
    o.props = n, o.state = e.memoizedState, o.refs = {}, bl(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? o.context = $t(i) : (i = St(t) ? lr : ct.current, o.context = zr(e, i)), o.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (fs(e, t, i, n), o.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (t = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), t !== o.state && Ii.enqueueReplaceState(o, o.state, null), _i(e, n, o, r), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Dr(e, t) {
    try {
      var n = "", r = t;
      do
        n += Z(r), r = r.return;
      while (r);
      var o = n;
    } catch (i) {
      o = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: o, digest: null };
  }
  function hs(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ms(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Bf = typeof WeakMap == "function" ? WeakMap : Map;
  function Ju(e, t, n) {
    n = yn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Ui || (Ui = !0, Rs = r), ms(e, t);
    }, n;
  }
  function qu(e, t, n) {
    n = yn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var o = t.value;
      n.payload = function() {
        return r(o);
      }, n.callback = function() {
        ms(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      ms(e, t), typeof r != "function" && (Vn === null ? Vn = /* @__PURE__ */ new Set([this]) : Vn.add(this));
      var u = t.stack;
      this.componentDidCatch(t.value, { componentStack: u !== null ? u : "" });
    }), n;
  }
  function Gu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Bf();
      var o = /* @__PURE__ */ new Set();
      r.set(t, o);
    } else o = r.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), r.set(t, o));
    o.has(n) || (o.add(n), e = tp.bind(null, e, t, n), t.then(e, e));
  }
  function Zu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function bu(e, t, n, r, o) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = yn(-1, 1), t.tag = 2, Un(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = o, e);
  }
  var Vf = ee.ReactCurrentOwner, xt = !1;
  function vt(e, t, n, r) {
    t.child = e === null ? wu(t, null, n, r) : Mr(t, e.child, n, r);
  }
  function ec(e, t, n, r, o) {
    n = n.render;
    var i = t.ref;
    return $r(t, o), r = ls(e, t, n, r, i, o), n = ss(), e !== null && !xt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, gn(e, t, o)) : (We && n && Wl(t), t.flags |= 1, vt(e, t, r, o), t.child);
  }
  function tc(e, t, n, r, o) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !$s(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, nc(e, t, i, r, o)) : (e = Ki(n.type, null, r, t, t.mode, o), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & o) === 0) {
      var u = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : po, n(u, r) && e.ref === t.ref) return gn(e, t, o);
    }
    return t.flags |= 1, e = Kn(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function nc(e, t, n, r, o) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (po(i, r) && e.ref === t.ref) if (xt = !1, t.pendingProps = r = i, (e.lanes & o) !== 0) (e.flags & 131072) !== 0 && (xt = !0);
      else return t.lanes = e.lanes, gn(e, t, o);
    }
    return vs(e, t, n, r, o);
  }
  function rc(e, t, n) {
    var r = t.pendingProps, o = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Fe(Br, Lt), Lt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Fe(Br, Lt), Lt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, Fe(Br, Lt), Lt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, Fe(Br, Lt), Lt |= r;
    return vt(e, t, o, n), t.child;
  }
  function oc(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function vs(e, t, n, r, o) {
    var i = St(n) ? lr : ct.current;
    return i = zr(t, i), $r(t, o), n = ls(e, t, n, r, i, o), r = ss(), e !== null && !xt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, gn(e, t, o)) : (We && r && Wl(t), t.flags |= 1, vt(e, t, n, o), t.child);
  }
  function ic(e, t, n, r, o) {
    if (St(n)) {
      var i = !0;
      yi(t);
    } else i = !1;
    if ($r(t, o), t.stateNode === null) Mi(e, t), Xu(t, n, r), ps(t, n, r, o), r = !0;
    else if (e === null) {
      var u = t.stateNode, f = t.memoizedProps;
      u.props = f;
      var h = u.context, k = n.contextType;
      typeof k == "object" && k !== null ? k = $t(k) : (k = St(n) ? lr : ct.current, k = zr(t, k));
      var L = n.getDerivedStateFromProps, I = typeof L == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      I || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f !== r || h !== k) && Yu(t, u, r, k), Dn = !1;
      var z = t.memoizedState;
      u.state = z, _i(t, r, u, o), h = t.memoizedState, f !== r || z !== h || wt.current || Dn ? (typeof L == "function" && (fs(t, n, L, r), h = t.memoizedState), (f = Dn || Ku(t, n, f, r, z, h, k)) ? (I || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = h), u.props = r, u.state = h, u.context = k, r = f) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      u = t.stateNode, xu(e, t), f = t.memoizedProps, k = t.type === t.elementType ? f : Ht(t.type, f), u.props = k, I = t.pendingProps, z = u.context, h = n.contextType, typeof h == "object" && h !== null ? h = $t(h) : (h = St(n) ? lr : ct.current, h = zr(t, h));
      var W = n.getDerivedStateFromProps;
      (L = typeof W == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f !== I || z !== h) && Yu(t, u, r, h), Dn = !1, z = t.memoizedState, u.state = z, _i(t, r, u, o);
      var K = t.memoizedState;
      f !== I || z !== K || wt.current || Dn ? (typeof W == "function" && (fs(t, n, W, r), K = t.memoizedState), (k = Dn || Ku(t, n, k, r, z, K, h) || !1) ? (L || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(r, K, h), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(r, K, h)), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || f === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = K), u.props = r, u.state = K, u.context = h, r = k) : (typeof u.componentDidUpdate != "function" || f === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return ys(e, t, n, r, i, o);
  }
  function ys(e, t, n, r, o, i) {
    oc(e, t);
    var u = (t.flags & 128) !== 0;
    if (!r && !u) return o && cu(t, n, !1), gn(e, t, i);
    r = t.stateNode, Vf.current = t;
    var f = u && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && u ? (t.child = Mr(t, e.child, null, i), t.child = Mr(t, null, f, i)) : vt(e, t, f, i), t.memoizedState = r.state, o && cu(t, n, !0), t.child;
  }
  function lc(e) {
    var t = e.stateNode;
    t.pendingContext ? au(e, t.pendingContext, t.pendingContext !== t.context) : t.context && au(e, t.context, !1), es(e, t.containerInfo);
  }
  function sc(e, t, n, r, o) {
    return Or(), Xl(o), t.flags |= 256, vt(e, t, n, r), t.child;
  }
  var gs = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ws(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function ac(e, t, n) {
    var r = t.pendingProps, o = He.current, i = !1, u = (t.flags & 128) !== 0, f;
    if ((f = u) || (f = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0), f ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (o |= 1), Fe(He, o & 1), e === null)
      return Kl(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (u = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, u = { mode: "hidden", children: u }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = u) : i = Xi(u, r, 0, null), e = vr(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = ws(n), t.memoizedState = gs, e) : Ss(t, u));
    if (o = e.memoizedState, o !== null && (f = o.dehydrated, f !== null)) return Wf(e, t, u, r, f, o, n);
    if (i) {
      i = r.fallback, u = t.mode, o = e.child, f = o.sibling;
      var h = { mode: "hidden", children: r.children };
      return (u & 1) === 0 && t.child !== o ? (r = t.child, r.childLanes = 0, r.pendingProps = h, t.deletions = null) : (r = Kn(o, h), r.subtreeFlags = o.subtreeFlags & 14680064), f !== null ? i = Kn(f, i) : (i = vr(i, u, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, u = e.child.memoizedState, u = u === null ? ws(n) : { baseLanes: u.baseLanes | n, cachePool: null, transitions: u.transitions }, i.memoizedState = u, i.childLanes = e.childLanes & ~n, t.memoizedState = gs, r;
    }
    return i = e.child, e = i.sibling, r = Kn(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function Ss(e, t) {
    return t = Xi({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Oi(e, t, n, r) {
    return r !== null && Xl(r), Mr(t, e.child, null, n), e = Ss(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Wf(e, t, n, r, o, i, u) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = hs(Error(s(422))), Oi(e, t, u, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, o = t.mode, r = Xi({ mode: "visible", children: r.children }, o, 0, null), i = vr(i, o, u, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Mr(t, e.child, null, u), t.child.memoizedState = ws(u), t.memoizedState = gs, i);
    if ((t.mode & 1) === 0) return Oi(e, t, u, null);
    if (o.data === "$!") {
      if (r = o.nextSibling && o.nextSibling.dataset, r) var f = r.dgst;
      return r = f, i = Error(s(419)), r = hs(i, r, void 0), Oi(e, t, u, r);
    }
    if (f = (u & e.childLanes) !== 0, xt || f) {
      if (r = ot, r !== null) {
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
        o = (o & (r.suspendedLanes | u)) !== 0 ? 0 : o, o !== 0 && o !== i.retryLane && (i.retryLane = o, vn(e, o), Xt(r, e, o, -1));
      }
      return As(), r = hs(Error(s(421))), Oi(e, t, u, r);
    }
    return o.data === "$?" ? (t.flags |= 128, t.child = e.child, t = np.bind(null, e), o._reactRetry = t, null) : (e = i.treeContext, zt = Mn(o.nextSibling), Rt = t, We = !0, Wt = null, e !== null && (Mt[At++] = hn, Mt[At++] = mn, Mt[At++] = sr, hn = e.id, mn = e.overflow, sr = t), t = Ss(t, r.children), t.flags |= 4096, t);
  }
  function uc(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Gl(e.return, t, n);
  }
  function xs(e, t, n, r, o) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: o } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = o);
  }
  function cc(e, t, n) {
    var r = t.pendingProps, o = r.revealOrder, i = r.tail;
    if (vt(e, t, r.children, n), r = He.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && uc(e, n, t);
        else if (e.tag === 19) uc(e, n, t);
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
    if (Fe(He, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; ) e = n.alternate, e !== null && Pi(e) === null && (o = n), n = n.sibling;
        n = o, n === null ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null), xs(t, !1, o, n, i);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (e = o.alternate, e !== null && Pi(e) === null) {
            t.child = o;
            break;
          }
          e = o.sibling, o.sibling = n, n = o, o = e;
        }
        xs(t, !0, n, null, i);
        break;
      case "together":
        xs(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Mi(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function gn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), fr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = Kn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Kn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Hf(e, t, n) {
    switch (t.tag) {
      case 3:
        lc(t), Or();
        break;
      case 5:
        Eu(t);
        break;
      case 1:
        St(t.type) && yi(t);
        break;
      case 4:
        es(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, o = t.memoizedProps.value;
        Fe(ji, r._currentValue), r._currentValue = o;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (Fe(He, He.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? ac(e, t, n) : (Fe(He, He.current & 1), e = gn(e, t, n), e !== null ? e.sibling : null);
        Fe(He, He.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return cc(e, t, n);
          t.flags |= 128;
        }
        if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Fe(He, He.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, rc(e, t, n);
    }
    return gn(e, t, n);
  }
  var dc, ks, fc, pc;
  dc = function(e, t) {
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
  }, ks = function() {
  }, fc = function(e, t, n, r) {
    var o = e.memoizedProps;
    if (o !== r) {
      e = t.stateNode, cr(tn.current);
      var i = null;
      switch (n) {
        case "input":
          o = _t(e, o), r = _t(e, r), i = [];
          break;
        case "select":
          o = U({}, o, { value: void 0 }), r = U({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          o = Cn(e, o), r = Cn(e, r), i = [];
          break;
        default:
          typeof o.onClick != "function" && typeof r.onClick == "function" && (e.onclick = hi);
      }
      Xr(n, r);
      var u;
      n = null;
      for (k in o) if (!r.hasOwnProperty(k) && o.hasOwnProperty(k) && o[k] != null) if (k === "style") {
        var f = o[k];
        for (u in f) f.hasOwnProperty(u) && (n || (n = {}), n[u] = "");
      } else k !== "dangerouslySetInnerHTML" && k !== "children" && k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && k !== "autoFocus" && (w.hasOwnProperty(k) ? i || (i = []) : (i = i || []).push(k, null));
      for (k in r) {
        var h = r[k];
        if (f = o != null ? o[k] : void 0, r.hasOwnProperty(k) && h !== f && (h != null || f != null)) if (k === "style") if (f) {
          for (u in f) !f.hasOwnProperty(u) || h && h.hasOwnProperty(u) || (n || (n = {}), n[u] = "");
          for (u in h) h.hasOwnProperty(u) && f[u] !== h[u] && (n || (n = {}), n[u] = h[u]);
        } else n || (i || (i = []), i.push(
          k,
          n
        )), n = h;
        else k === "dangerouslySetInnerHTML" ? (h = h ? h.__html : void 0, f = f ? f.__html : void 0, h != null && f !== h && (i = i || []).push(k, h)) : k === "children" ? typeof h != "string" && typeof h != "number" || (i = i || []).push(k, "" + h) : k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && (w.hasOwnProperty(k) ? (h != null && k === "onScroll" && Ue("scroll", e), i || f === h || (i = [])) : (i = i || []).push(k, h));
      }
      n && (i = i || []).push("style", n);
      var k = i;
      (t.updateQueue = k) && (t.flags |= 4);
    }
  }, pc = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function No(e, t) {
    if (!We) switch (e.tailMode) {
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
  function ft(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags & 14680064, r |= o.flags & 14680064, o.return = e, o = o.sibling;
    else for (o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, o.return = e, o = o.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Qf(e, t, n) {
    var r = t.pendingProps;
    switch (Hl(t), t.tag) {
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
        return ft(t), null;
      case 1:
        return St(t.type) && vi(), ft(t), null;
      case 3:
        return r = t.stateNode, Fr(), Be(wt), Be(ct), rs(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (xi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Wt !== null && (Is(Wt), Wt = null))), ks(e, t), ft(t), null;
      case 5:
        ts(t);
        var o = cr(jo.current);
        if (n = t.type, e !== null && t.stateNode != null) fc(e, t, n, r, o), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(s(166));
            return ft(t), null;
          }
          if (e = cr(tn.current), xi(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[en] = t, r[go] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                Ue("cancel", r), Ue("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ue("load", r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < mo.length; o++) Ue(mo[o], r);
                break;
              case "source":
                Ue("error", r);
                break;
              case "img":
              case "image":
              case "link":
                Ue(
                  "error",
                  r
                ), Ue("load", r);
                break;
              case "details":
                Ue("toggle", r);
                break;
              case "input":
                cn(r, i), Ue("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, Ue("invalid", r);
                break;
              case "textarea":
                Vo(r, i), Ue("invalid", r);
            }
            Xr(n, i), o = null;
            for (var u in i) if (i.hasOwnProperty(u)) {
              var f = i[u];
              u === "children" ? typeof f == "string" ? r.textContent !== f && (i.suppressHydrationWarning !== !0 && pi(r.textContent, f, e), o = ["children", f]) : typeof f == "number" && r.textContent !== "" + f && (i.suppressHydrationWarning !== !0 && pi(
                r.textContent,
                f,
                e
              ), o = ["children", "" + f]) : w.hasOwnProperty(u) && f != null && u === "onScroll" && Ue("scroll", r);
            }
            switch (n) {
              case "input":
                Ct(r), Gn(r, i, !0);
                break;
              case "textarea":
                Ct(r), mt(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = hi);
            }
            r = o, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            u = o.nodeType === 9 ? o : o.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = yr(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = u.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = u.createElement(n, { is: r.is }) : (e = u.createElement(n), n === "select" && (u = e, r.multiple ? u.multiple = !0 : r.size && (u.size = r.size))) : e = u.createElementNS(e, n), e[en] = t, e[go] = r, dc(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (u = tr(n, r), n) {
                case "dialog":
                  Ue("cancel", e), Ue("close", e), o = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ue("load", e), o = r;
                  break;
                case "video":
                case "audio":
                  for (o = 0; o < mo.length; o++) Ue(mo[o], e);
                  o = r;
                  break;
                case "source":
                  Ue("error", e), o = r;
                  break;
                case "img":
                case "image":
                case "link":
                  Ue(
                    "error",
                    e
                  ), Ue("load", e), o = r;
                  break;
                case "details":
                  Ue("toggle", e), o = r;
                  break;
                case "input":
                  cn(e, r), o = _t(e, r), Ue("invalid", e);
                  break;
                case "option":
                  o = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, o = U({}, r, { value: void 0 }), Ue("invalid", e);
                  break;
                case "textarea":
                  Vo(e, r), o = Cn(e, r), Ue("invalid", e);
                  break;
                default:
                  o = r;
              }
              Xr(n, o), f = o;
              for (i in f) if (f.hasOwnProperty(i)) {
                var h = f[i];
                i === "style" ? Qo(e, h) : i === "dangerouslySetInnerHTML" ? (h = h ? h.__html : void 0, h != null && Kr(e, h)) : i === "children" ? typeof h == "string" ? (n !== "textarea" || h !== "") && Zt(e, h) : typeof h == "number" && Zt(e, "" + h) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (w.hasOwnProperty(i) ? h != null && i === "onScroll" && Ue("scroll", e) : h != null && R(e, i, h, u));
              }
              switch (n) {
                case "input":
                  Ct(e), Gn(e, r, !1);
                  break;
                case "textarea":
                  Ct(e), mt(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + ye(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? En(e, !!r.multiple, i, !1) : r.defaultValue != null && En(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof o.onClick == "function" && (e.onclick = hi);
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
        return ft(t), null;
      case 6:
        if (e && t.stateNode != null) pc(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
          if (n = cr(jo.current), cr(tn.current), xi(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[en] = t, (i = r.nodeValue !== n) && (e = Rt, e !== null)) switch (e.tag) {
              case 3:
                pi(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && pi(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[en] = t, t.stateNode = r;
        }
        return ft(t), null;
      case 13:
        if (Be(He), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (We && zt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) vu(), Or(), t.flags |= 98560, i = !1;
          else if (i = xi(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(s(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(s(317));
              i[en] = t;
            } else Or(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            ft(t), i = !1;
          } else Wt !== null && (Is(Wt), Wt = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (He.current & 1) !== 0 ? tt === 0 && (tt = 3) : As())), t.updateQueue !== null && (t.flags |= 4), ft(t), null);
      case 4:
        return Fr(), ks(e, t), e === null && vo(t.stateNode.containerInfo), ft(t), null;
      case 10:
        return ql(t.type._context), ft(t), null;
      case 17:
        return St(t.type) && vi(), ft(t), null;
      case 19:
        if (Be(He), i = t.memoizedState, i === null) return ft(t), null;
        if (r = (t.flags & 128) !== 0, u = i.rendering, u === null) if (r) No(i, !1);
        else {
          if (tt !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (u = Pi(e), u !== null) {
              for (t.flags |= 128, No(i, !1), r = u.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, u = i.alternate, u === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = u.childLanes, i.lanes = u.lanes, i.child = u.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = u.memoizedProps, i.memoizedState = u.memoizedState, i.updateQueue = u.updateQueue, i.type = u.type, e = u.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return Fe(He, He.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && Se() > Vr && (t.flags |= 128, r = !0, No(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = Pi(u), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), No(i, !0), i.tail === null && i.tailMode === "hidden" && !u.alternate && !We) return ft(t), null;
          } else 2 * Se() - i.renderingStartTime > Vr && n !== 1073741824 && (t.flags |= 128, r = !0, No(i, !1), t.lanes = 4194304);
          i.isBackwards ? (u.sibling = t.child, t.child = u) : (n = i.last, n !== null ? n.sibling = u : t.child = u, i.last = u);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Se(), t.sibling = null, n = He.current, Fe(He, r ? n & 1 | 2 : n & 1), t) : (ft(t), null);
      case 22:
      case 23:
        return Ms(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Lt & 1073741824) !== 0 && (ft(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : ft(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Kf(e, t) {
    switch (Hl(t), t.tag) {
      case 1:
        return St(t.type) && vi(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Fr(), Be(wt), Be(ct), rs(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return ts(t), null;
      case 13:
        if (Be(He), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          Or();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Be(He), null;
      case 4:
        return Fr(), null;
      case 10:
        return ql(t.type._context), null;
      case 22:
      case 23:
        return Ms(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ai = !1, pt = !1, Xf = typeof WeakSet == "function" ? WeakSet : Set, H = null;
  function Ur(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Xe(e, t, r);
    }
    else n.current = null;
  }
  function js(e, t, n) {
    try {
      n();
    } catch (r) {
      Xe(e, t, r);
    }
  }
  var hc = !1;
  function Yf(e, t) {
    if (Ml = ni, e = Ka(), Pl(e)) {
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
          var u = 0, f = -1, h = -1, k = 0, L = 0, I = e, z = null;
          t: for (; ; ) {
            for (var W; I !== n || o !== 0 && I.nodeType !== 3 || (f = u + o), I !== i || r !== 0 && I.nodeType !== 3 || (h = u + r), I.nodeType === 3 && (u += I.nodeValue.length), (W = I.firstChild) !== null; )
              z = I, I = W;
            for (; ; ) {
              if (I === e) break t;
              if (z === n && ++k === o && (f = u), z === i && ++L === r && (h = u), (W = I.nextSibling) !== null) break;
              I = z, z = I.parentNode;
            }
            I = W;
          }
          n = f === -1 || h === -1 ? null : { start: f, end: h };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Al = { focusedElem: e, selectionRange: n }, ni = !1, H = t; H !== null; ) if (t = H, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, H = e;
    else for (; H !== null; ) {
      t = H;
      try {
        var K = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (K !== null) {
              var J = K.memoizedProps, Je = K.memoizedState, S = t.stateNode, y = S.getSnapshotBeforeUpdate(t.elementType === t.type ? J : Ht(t.type, J), Je);
              S.__reactInternalSnapshotBeforeUpdate = y;
            }
            break;
          case 3:
            var x = t.stateNode.containerInfo;
            x.nodeType === 1 ? x.textContent = "" : x.nodeType === 9 && x.documentElement && x.removeChild(x.documentElement);
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
        Xe(t, t.return, M);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, H = e;
        break;
      }
      H = t.return;
    }
    return K = hc, hc = !1, K;
  }
  function To(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & e) === e) {
          var i = o.destroy;
          o.destroy = void 0, i !== void 0 && js(t, n, i);
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function $i(e, t) {
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
  function Es(e) {
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
  function mc(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, mc(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[en], delete t[go], delete t[Ul], delete t[Rf], delete t[zf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function vc(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function yc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || vc(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Cs(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = hi));
    else if (r !== 4 && (e = e.child, e !== null)) for (Cs(e, t, n), e = e.sibling; e !== null; ) Cs(e, t, n), e = e.sibling;
  }
  function _s(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (_s(e, t, n), e = e.sibling; e !== null; ) _s(e, t, n), e = e.sibling;
  }
  var st = null, Qt = !1;
  function Bn(e, t, n) {
    for (n = n.child; n !== null; ) gc(e, t, n), n = n.sibling;
  }
  function gc(e, t, n) {
    if (Pt && typeof Pt.onCommitFiberUnmount == "function") try {
      Pt.onCommitFiberUnmount(or, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        pt || Ur(n, t);
      case 6:
        var r = st, o = Qt;
        st = null, Bn(e, t, n), st = r, Qt = o, st !== null && (Qt ? (e = st, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : st.removeChild(n.stateNode));
        break;
      case 18:
        st !== null && (Qt ? (e = st, n = n.stateNode, e.nodeType === 8 ? Dl(e.parentNode, n) : e.nodeType === 1 && Dl(e, n), lo(e)) : Dl(st, n.stateNode));
        break;
      case 4:
        r = st, o = Qt, st = n.stateNode.containerInfo, Qt = !0, Bn(e, t, n), st = r, Qt = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!pt && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          o = r = r.next;
          do {
            var i = o, u = i.destroy;
            i = i.tag, u !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && js(n, t, u), o = o.next;
          } while (o !== r);
        }
        Bn(e, t, n);
        break;
      case 1:
        if (!pt && (Ur(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (f) {
          Xe(n, t, f);
        }
        Bn(e, t, n);
        break;
      case 21:
        Bn(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (pt = (r = pt) || n.memoizedState !== null, Bn(e, t, n), pt = r) : Bn(e, t, n);
        break;
      default:
        Bn(e, t, n);
    }
  }
  function wc(e) {
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
  function Kt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var i = e, u = t, f = u;
        e: for (; f !== null; ) {
          switch (f.tag) {
            case 5:
              st = f.stateNode, Qt = !1;
              break e;
            case 3:
              st = f.stateNode.containerInfo, Qt = !0;
              break e;
            case 4:
              st = f.stateNode.containerInfo, Qt = !0;
              break e;
          }
          f = f.return;
        }
        if (st === null) throw Error(s(160));
        gc(i, u, o), st = null, Qt = !1;
        var h = o.alternate;
        h !== null && (h.return = null), o.return = null;
      } catch (k) {
        Xe(o, t, k);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Sc(t, e), t = t.sibling;
  }
  function Sc(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Kt(t, e), rn(e), r & 4) {
          try {
            To(3, e, e.return), $i(3, e);
          } catch (J) {
            Xe(e, e.return, J);
          }
          try {
            To(5, e, e.return);
          } catch (J) {
            Xe(e, e.return, J);
          }
        }
        break;
      case 1:
        Kt(t, e), rn(e), r & 512 && n !== null && Ur(n, n.return);
        break;
      case 5:
        if (Kt(t, e), rn(e), r & 512 && n !== null && Ur(n, n.return), e.flags & 32) {
          var o = e.stateNode;
          try {
            Zt(o, "");
          } catch (J) {
            Xe(e, e.return, J);
          }
        }
        if (r & 4 && (o = e.stateNode, o != null)) {
          var i = e.memoizedProps, u = n !== null ? n.memoizedProps : i, f = e.type, h = e.updateQueue;
          if (e.updateQueue = null, h !== null) try {
            f === "input" && i.type === "radio" && i.name != null && kn(o, i), tr(f, u);
            var k = tr(f, i);
            for (u = 0; u < h.length; u += 2) {
              var L = h[u], I = h[u + 1];
              L === "style" ? Qo(o, I) : L === "dangerouslySetInnerHTML" ? Kr(o, I) : L === "children" ? Zt(o, I) : R(o, L, I, k);
            }
            switch (f) {
              case "input":
                Gt(o, i);
                break;
              case "textarea":
                Zn(o, i);
                break;
              case "select":
                var z = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!i.multiple;
                var W = i.value;
                W != null ? En(o, !!i.multiple, W, !1) : z !== !!i.multiple && (i.defaultValue != null ? En(
                  o,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : En(o, !!i.multiple, i.multiple ? [] : "", !1));
            }
            o[go] = i;
          } catch (J) {
            Xe(e, e.return, J);
          }
        }
        break;
      case 6:
        if (Kt(t, e), rn(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          o = e.stateNode, i = e.memoizedProps;
          try {
            o.nodeValue = i;
          } catch (J) {
            Xe(e, e.return, J);
          }
        }
        break;
      case 3:
        if (Kt(t, e), rn(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          lo(t.containerInfo);
        } catch (J) {
          Xe(e, e.return, J);
        }
        break;
      case 4:
        Kt(t, e), rn(e);
        break;
      case 13:
        Kt(t, e), rn(e), o = e.child, o.flags & 8192 && (i = o.memoizedState !== null, o.stateNode.isHidden = i, !i || o.alternate !== null && o.alternate.memoizedState !== null || (Ts = Se())), r & 4 && wc(e);
        break;
      case 22:
        if (L = n !== null && n.memoizedState !== null, e.mode & 1 ? (pt = (k = pt) || L, Kt(t, e), pt = k) : Kt(t, e), rn(e), r & 8192) {
          if (k = e.memoizedState !== null, (e.stateNode.isHidden = k) && !L && (e.mode & 1) !== 0) for (H = e, L = e.child; L !== null; ) {
            for (I = H = L; H !== null; ) {
              switch (z = H, W = z.child, z.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  To(4, z, z.return);
                  break;
                case 1:
                  Ur(z, z.return);
                  var K = z.stateNode;
                  if (typeof K.componentWillUnmount == "function") {
                    r = z, n = z.return;
                    try {
                      t = r, K.props = t.memoizedProps, K.state = t.memoizedState, K.componentWillUnmount();
                    } catch (J) {
                      Xe(r, n, J);
                    }
                  }
                  break;
                case 5:
                  Ur(z, z.return);
                  break;
                case 22:
                  if (z.memoizedState !== null) {
                    jc(I);
                    continue;
                  }
              }
              W !== null ? (W.return = z, H = W) : jc(I);
            }
            L = L.sibling;
          }
          e: for (L = null, I = e; ; ) {
            if (I.tag === 5) {
              if (L === null) {
                L = I;
                try {
                  o = I.stateNode, k ? (i = o.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (f = I.stateNode, h = I.memoizedProps.style, u = h != null && h.hasOwnProperty("display") ? h.display : null, f.style.display = Ho("display", u));
                } catch (J) {
                  Xe(e, e.return, J);
                }
              }
            } else if (I.tag === 6) {
              if (L === null) try {
                I.stateNode.nodeValue = k ? "" : I.memoizedProps;
              } catch (J) {
                Xe(e, e.return, J);
              }
            } else if ((I.tag !== 22 && I.tag !== 23 || I.memoizedState === null || I === e) && I.child !== null) {
              I.child.return = I, I = I.child;
              continue;
            }
            if (I === e) break e;
            for (; I.sibling === null; ) {
              if (I.return === null || I.return === e) break e;
              L === I && (L = null), I = I.return;
            }
            L === I && (L = null), I.sibling.return = I.return, I = I.sibling;
          }
        }
        break;
      case 19:
        Kt(t, e), rn(e), r & 4 && wc(e);
        break;
      case 21:
        break;
      default:
        Kt(
          t,
          e
        ), rn(e);
    }
  }
  function rn(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (vc(n)) {
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
            r.flags & 32 && (Zt(o, ""), r.flags &= -33);
            var i = yc(e);
            _s(e, i, o);
            break;
          case 3:
          case 4:
            var u = r.stateNode.containerInfo, f = yc(e);
            Cs(e, f, u);
            break;
          default:
            throw Error(s(161));
        }
      } catch (h) {
        Xe(e, e.return, h);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Jf(e, t, n) {
    H = e, xc(e);
  }
  function xc(e, t, n) {
    for (var r = (e.mode & 1) !== 0; H !== null; ) {
      var o = H, i = o.child;
      if (o.tag === 22 && r) {
        var u = o.memoizedState !== null || Ai;
        if (!u) {
          var f = o.alternate, h = f !== null && f.memoizedState !== null || pt;
          f = Ai;
          var k = pt;
          if (Ai = u, (pt = h) && !k) for (H = o; H !== null; ) u = H, h = u.child, u.tag === 22 && u.memoizedState !== null ? Ec(o) : h !== null ? (h.return = u, H = h) : Ec(o);
          for (; i !== null; ) H = i, xc(i), i = i.sibling;
          H = o, Ai = f, pt = k;
        }
        kc(e);
      } else (o.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = o, H = i) : kc(e);
    }
  }
  function kc(e) {
    for (; H !== null; ) {
      var t = H;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              pt || $i(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !pt) if (n === null) r.componentDidMount();
              else {
                var o = t.elementType === t.type ? n.memoizedProps : Ht(t.type, n.memoizedProps);
                r.componentDidUpdate(o, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && ju(t, i, r);
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
                ju(t, u, n);
              }
              break;
            case 5:
              var f = t.stateNode;
              if (n === null && t.flags & 4) {
                n = f;
                var h = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    h.autoFocus && n.focus();
                    break;
                  case "img":
                    h.src && (n.src = h.src);
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
                var k = t.alternate;
                if (k !== null) {
                  var L = k.memoizedState;
                  if (L !== null) {
                    var I = L.dehydrated;
                    I !== null && lo(I);
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
          pt || t.flags & 512 && Es(t);
        } catch (z) {
          Xe(t, t.return, z);
        }
      }
      if (t === e) {
        H = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, H = n;
        break;
      }
      H = t.return;
    }
  }
  function jc(e) {
    for (; H !== null; ) {
      var t = H;
      if (t === e) {
        H = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, H = n;
        break;
      }
      H = t.return;
    }
  }
  function Ec(e) {
    for (; H !== null; ) {
      var t = H;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              $i(4, t);
            } catch (h) {
              Xe(t, n, h);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var o = t.return;
              try {
                r.componentDidMount();
              } catch (h) {
                Xe(t, o, h);
              }
            }
            var i = t.return;
            try {
              Es(t);
            } catch (h) {
              Xe(t, i, h);
            }
            break;
          case 5:
            var u = t.return;
            try {
              Es(t);
            } catch (h) {
              Xe(t, u, h);
            }
        }
      } catch (h) {
        Xe(t, t.return, h);
      }
      if (t === e) {
        H = null;
        break;
      }
      var f = t.sibling;
      if (f !== null) {
        f.return = t.return, H = f;
        break;
      }
      H = t.return;
    }
  }
  var qf = Math.ceil, Fi = ee.ReactCurrentDispatcher, Ps = ee.ReactCurrentOwner, Dt = ee.ReactCurrentBatchConfig, Ee = 0, ot = null, Ge = null, at = 0, Lt = 0, Br = An(0), tt = 0, Ro = null, fr = 0, Di = 0, Ns = 0, zo = null, kt = null, Ts = 0, Vr = 1 / 0, wn = null, Ui = !1, Rs = null, Vn = null, Bi = !1, Wn = null, Vi = 0, Lo = 0, zs = null, Wi = -1, Hi = 0;
  function yt() {
    return (Ee & 6) !== 0 ? Se() : Wi !== -1 ? Wi : Wi = Se();
  }
  function Hn(e) {
    return (e.mode & 1) === 0 ? 1 : (Ee & 2) !== 0 && at !== 0 ? at & -at : If.transition !== null ? (Hi === 0 && (Hi = ya()), Hi) : (e = Ie, e !== 0 || (e = window.event, e = e === void 0 ? 16 : _a(e.type)), e);
  }
  function Xt(e, t, n, r) {
    if (50 < Lo) throw Lo = 0, zs = null, Error(s(185));
    to(e, n, r), ((Ee & 2) === 0 || e !== ot) && (e === ot && ((Ee & 2) === 0 && (Di |= n), tt === 4 && Qn(e, at)), jt(e, r), n === 1 && Ee === 0 && (t.mode & 1) === 0 && (Vr = Se() + 500, gi && Fn()));
  }
  function jt(e, t) {
    var n = e.callbackNode;
    Ld(e, t);
    var r = bo(e, e === ot ? at : 0);
    if (r === 0) n !== null && Me(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && Me(n), t === 1) e.tag === 0 ? Lf(_c.bind(null, e)) : du(_c.bind(null, e)), Nf(function() {
        (Ee & 6) === 0 && Fn();
      }), n = null;
      else {
        switch (ga(r)) {
          case 1:
            n = nt;
            break;
          case 4:
            n = qo;
            break;
          case 16:
            n = bt;
            break;
          case 536870912:
            n = br;
            break;
          default:
            n = bt;
        }
        n = Oc(n, Cc.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Cc(e, t) {
    if (Wi = -1, Hi = 0, (Ee & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (Wr() && e.callbackNode !== n) return null;
    var r = bo(e, e === ot ? at : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Qi(e, r);
    else {
      t = r;
      var o = Ee;
      Ee |= 2;
      var i = Nc();
      (ot !== e || at !== t) && (wn = null, Vr = Se() + 500, hr(e, t));
      do
        try {
          bf();
          break;
        } catch (f) {
          Pc(e, f);
        }
      while (!0);
      Jl(), Fi.current = i, Ee = o, Ge !== null ? t = 0 : (ot = null, at = 0, t = tt);
    }
    if (t !== 0) {
      if (t === 2 && (o = dl(e), o !== 0 && (r = o, t = Ls(e, o))), t === 1) throw n = Ro, hr(e, 0), Qn(e, r), jt(e, Se()), n;
      if (t === 6) Qn(e, r);
      else {
        if (o = e.current.alternate, (r & 30) === 0 && !Gf(o) && (t = Qi(e, r), t === 2 && (i = dl(e), i !== 0 && (r = i, t = Ls(e, i))), t === 1)) throw n = Ro, hr(e, 0), Qn(e, r), jt(e, Se()), n;
        switch (e.finishedWork = o, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            mr(e, kt, wn);
            break;
          case 3:
            if (Qn(e, r), (r & 130023424) === r && (t = Ts + 500 - Se(), 10 < t)) {
              if (bo(e, 0) !== 0) break;
              if (o = e.suspendedLanes, (o & r) !== r) {
                yt(), e.pingedLanes |= e.suspendedLanes & o;
                break;
              }
              e.timeoutHandle = Fl(mr.bind(null, e, kt, wn), t);
              break;
            }
            mr(e, kt, wn);
            break;
          case 4:
            if (Qn(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, o = -1; 0 < r; ) {
              var u = 31 - Nt(r);
              i = 1 << u, u = t[u], u > o && (o = u), r &= ~i;
            }
            if (r = o, r = Se() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * qf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Fl(mr.bind(null, e, kt, wn), r);
              break;
            }
            mr(e, kt, wn);
            break;
          case 5:
            mr(e, kt, wn);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return jt(e, Se()), e.callbackNode === n ? Cc.bind(null, e) : null;
  }
  function Ls(e, t) {
    var n = zo;
    return e.current.memoizedState.isDehydrated && (hr(e, t).flags |= 256), e = Qi(e, t), e !== 2 && (t = kt, kt = n, t !== null && Is(t)), e;
  }
  function Is(e) {
    kt === null ? kt = e : kt.push.apply(kt, e);
  }
  function Gf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var o = n[r], i = o.getSnapshot;
          o = o.value;
          try {
            if (!Vt(i(), o)) return !1;
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
  function Qn(e, t) {
    for (t &= ~Ns, t &= ~Di, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - Nt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function _c(e) {
    if ((Ee & 6) !== 0) throw Error(s(327));
    Wr();
    var t = bo(e, 0);
    if ((t & 1) === 0) return jt(e, Se()), null;
    var n = Qi(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = dl(e);
      r !== 0 && (t = r, n = Ls(e, r));
    }
    if (n === 1) throw n = Ro, hr(e, 0), Qn(e, t), jt(e, Se()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, mr(e, kt, wn), jt(e, Se()), null;
  }
  function Os(e, t) {
    var n = Ee;
    Ee |= 1;
    try {
      return e(t);
    } finally {
      Ee = n, Ee === 0 && (Vr = Se() + 500, gi && Fn());
    }
  }
  function pr(e) {
    Wn !== null && Wn.tag === 0 && (Ee & 6) === 0 && Wr();
    var t = Ee;
    Ee |= 1;
    var n = Dt.transition, r = Ie;
    try {
      if (Dt.transition = null, Ie = 1, e) return e();
    } finally {
      Ie = r, Dt.transition = n, Ee = t, (Ee & 6) === 0 && Fn();
    }
  }
  function Ms() {
    Lt = Br.current, Be(Br);
  }
  function hr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Pf(n)), Ge !== null) for (n = Ge.return; n !== null; ) {
      var r = n;
      switch (Hl(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && vi();
          break;
        case 3:
          Fr(), Be(wt), Be(ct), rs();
          break;
        case 5:
          ts(r);
          break;
        case 4:
          Fr();
          break;
        case 13:
          Be(He);
          break;
        case 19:
          Be(He);
          break;
        case 10:
          ql(r.type._context);
          break;
        case 22:
        case 23:
          Ms();
      }
      n = n.return;
    }
    if (ot = e, Ge = e = Kn(e.current, null), at = Lt = t, tt = 0, Ro = null, Ns = Di = fr = 0, kt = zo = null, ur !== null) {
      for (t = 0; t < ur.length; t++) if (n = ur[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var o = r.next, i = n.pending;
        if (i !== null) {
          var u = i.next;
          i.next = o, r.next = u;
        }
        n.pending = r;
      }
      ur = null;
    }
    return e;
  }
  function Pc(e, t) {
    do {
      var n = Ge;
      try {
        if (Jl(), Ni.current = Li, Ti) {
          for (var r = Qe.memoizedState; r !== null; ) {
            var o = r.queue;
            o !== null && (o.pending = null), r = r.next;
          }
          Ti = !1;
        }
        if (dr = 0, rt = et = Qe = null, Eo = !1, Co = 0, Ps.current = null, n === null || n.return === null) {
          tt = 1, Ro = t, Ge = null;
          break;
        }
        e: {
          var i = e, u = n.return, f = n, h = t;
          if (t = at, f.flags |= 32768, h !== null && typeof h == "object" && typeof h.then == "function") {
            var k = h, L = f, I = L.tag;
            if ((L.mode & 1) === 0 && (I === 0 || I === 11 || I === 15)) {
              var z = L.alternate;
              z ? (L.updateQueue = z.updateQueue, L.memoizedState = z.memoizedState, L.lanes = z.lanes) : (L.updateQueue = null, L.memoizedState = null);
            }
            var W = Zu(u);
            if (W !== null) {
              W.flags &= -257, bu(W, u, f, i, t), W.mode & 1 && Gu(i, k, t), t = W, h = k;
              var K = t.updateQueue;
              if (K === null) {
                var J = /* @__PURE__ */ new Set();
                J.add(h), t.updateQueue = J;
              } else K.add(h);
              break e;
            } else {
              if ((t & 1) === 0) {
                Gu(i, k, t), As();
                break e;
              }
              h = Error(s(426));
            }
          } else if (We && f.mode & 1) {
            var Je = Zu(u);
            if (Je !== null) {
              (Je.flags & 65536) === 0 && (Je.flags |= 256), bu(Je, u, f, i, t), Xl(Dr(h, f));
              break e;
            }
          }
          i = h = Dr(h, f), tt !== 4 && (tt = 2), zo === null ? zo = [i] : zo.push(i), i = u;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var S = Ju(i, h, t);
                ku(i, S);
                break e;
              case 1:
                f = h;
                var y = i.type, x = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof y.getDerivedStateFromError == "function" || x !== null && typeof x.componentDidCatch == "function" && (Vn === null || !Vn.has(x)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var M = qu(i, f, t);
                  ku(i, M);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Rc(n);
      } catch (G) {
        t = G, Ge === n && n !== null && (Ge = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Nc() {
    var e = Fi.current;
    return Fi.current = Li, e === null ? Li : e;
  }
  function As() {
    (tt === 0 || tt === 3 || tt === 2) && (tt = 4), ot === null || (fr & 268435455) === 0 && (Di & 268435455) === 0 || Qn(ot, at);
  }
  function Qi(e, t) {
    var n = Ee;
    Ee |= 2;
    var r = Nc();
    (ot !== e || at !== t) && (wn = null, hr(e, t));
    do
      try {
        Zf();
        break;
      } catch (o) {
        Pc(e, o);
      }
    while (!0);
    if (Jl(), Ee = n, Fi.current = r, Ge !== null) throw Error(s(261));
    return ot = null, at = 0, tt;
  }
  function Zf() {
    for (; Ge !== null; ) Tc(Ge);
  }
  function bf() {
    for (; Ge !== null && !ne(); ) Tc(Ge);
  }
  function Tc(e) {
    var t = Ic(e.alternate, e, Lt);
    e.memoizedProps = e.pendingProps, t === null ? Rc(e) : Ge = t, Ps.current = null;
  }
  function Rc(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Qf(n, t, Lt), n !== null) {
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
          tt = 6, Ge = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Ge = t;
        return;
      }
      Ge = t = e;
    } while (t !== null);
    tt === 0 && (tt = 5);
  }
  function mr(e, t, n) {
    var r = Ie, o = Dt.transition;
    try {
      Dt.transition = null, Ie = 1, ep(e, t, n, r);
    } finally {
      Dt.transition = o, Ie = r;
    }
    return null;
  }
  function ep(e, t, n, r) {
    do
      Wr();
    while (Wn !== null);
    if ((Ee & 6) !== 0) throw Error(s(327));
    n = e.finishedWork;
    var o = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (Id(e, i), e === ot && (Ge = ot = null, at = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Bi || (Bi = !0, Oc(bt, function() {
      return Wr(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = Dt.transition, Dt.transition = null;
      var u = Ie;
      Ie = 1;
      var f = Ee;
      Ee |= 4, Ps.current = null, Yf(e, n), Sc(n, e), Sf(Al), ni = !!Ml, Al = Ml = null, e.current = n, Jf(n), fe(), Ee = f, Ie = u, Dt.transition = i;
    } else e.current = n;
    if (Bi && (Bi = !1, Wn = e, Vi = o), i = e.pendingLanes, i === 0 && (Vn = null), Nn(n.stateNode), jt(e, Se()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) o = t[n], r(o.value, { componentStack: o.stack, digest: o.digest });
    if (Ui) throw Ui = !1, e = Rs, Rs = null, e;
    return (Vi & 1) !== 0 && e.tag !== 0 && Wr(), i = e.pendingLanes, (i & 1) !== 0 ? e === zs ? Lo++ : (Lo = 0, zs = e) : Lo = 0, Fn(), null;
  }
  function Wr() {
    if (Wn !== null) {
      var e = ga(Vi), t = Dt.transition, n = Ie;
      try {
        if (Dt.transition = null, Ie = 16 > e ? 16 : e, Wn === null) var r = !1;
        else {
          if (e = Wn, Wn = null, Vi = 0, (Ee & 6) !== 0) throw Error(s(331));
          var o = Ee;
          for (Ee |= 4, H = e.current; H !== null; ) {
            var i = H, u = i.child;
            if ((H.flags & 16) !== 0) {
              var f = i.deletions;
              if (f !== null) {
                for (var h = 0; h < f.length; h++) {
                  var k = f[h];
                  for (H = k; H !== null; ) {
                    var L = H;
                    switch (L.tag) {
                      case 0:
                      case 11:
                      case 15:
                        To(8, L, i);
                    }
                    var I = L.child;
                    if (I !== null) I.return = L, H = I;
                    else for (; H !== null; ) {
                      L = H;
                      var z = L.sibling, W = L.return;
                      if (mc(L), L === k) {
                        H = null;
                        break;
                      }
                      if (z !== null) {
                        z.return = W, H = z;
                        break;
                      }
                      H = W;
                    }
                  }
                }
                var K = i.alternate;
                if (K !== null) {
                  var J = K.child;
                  if (J !== null) {
                    K.child = null;
                    do {
                      var Je = J.sibling;
                      J.sibling = null, J = Je;
                    } while (J !== null);
                  }
                }
                H = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && u !== null) u.return = i, H = u;
            else e: for (; H !== null; ) {
              if (i = H, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  To(9, i, i.return);
              }
              var S = i.sibling;
              if (S !== null) {
                S.return = i.return, H = S;
                break e;
              }
              H = i.return;
            }
          }
          var y = e.current;
          for (H = y; H !== null; ) {
            u = H;
            var x = u.child;
            if ((u.subtreeFlags & 2064) !== 0 && x !== null) x.return = u, H = x;
            else e: for (u = y; H !== null; ) {
              if (f = H, (f.flags & 2048) !== 0) try {
                switch (f.tag) {
                  case 0:
                  case 11:
                  case 15:
                    $i(9, f);
                }
              } catch (G) {
                Xe(f, f.return, G);
              }
              if (f === u) {
                H = null;
                break e;
              }
              var M = f.sibling;
              if (M !== null) {
                M.return = f.return, H = M;
                break e;
              }
              H = f.return;
            }
          }
          if (Ee = o, Fn(), Pt && typeof Pt.onPostCommitFiberRoot == "function") try {
            Pt.onPostCommitFiberRoot(or, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        Ie = n, Dt.transition = t;
      }
    }
    return !1;
  }
  function zc(e, t, n) {
    t = Dr(n, t), t = Ju(e, t, 1), e = Un(e, t, 1), t = yt(), e !== null && (to(e, 1, t), jt(e, t));
  }
  function Xe(e, t, n) {
    if (e.tag === 3) zc(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        zc(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Vn === null || !Vn.has(r))) {
          e = Dr(n, e), e = qu(t, e, 1), t = Un(t, e, 1), e = yt(), t !== null && (to(t, 1, e), jt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function tp(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = yt(), e.pingedLanes |= e.suspendedLanes & n, ot === e && (at & n) === n && (tt === 4 || tt === 3 && (at & 130023424) === at && 500 > Se() - Ts ? hr(e, 0) : Ns |= n), jt(e, t);
  }
  function Lc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Zo, Zo <<= 1, (Zo & 130023424) === 0 && (Zo = 4194304)));
    var n = yt();
    e = vn(e, t), e !== null && (to(e, t, n), jt(e, n));
  }
  function np(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Lc(e, n);
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
    r !== null && r.delete(t), Lc(e, n);
  }
  var Ic;
  Ic = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || wt.current) xt = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return xt = !1, Hf(e, t, n);
      xt = (e.flags & 131072) !== 0;
    }
    else xt = !1, We && (t.flags & 1048576) !== 0 && fu(t, Si, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Mi(e, t), e = t.pendingProps;
        var o = zr(t, ct.current);
        $r(t, n), o = ls(null, t, r, e, o, n);
        var i = ss();
        return t.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, St(r) ? (i = !0, yi(t)) : i = !1, t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, bl(t), o.updater = Ii, t.stateNode = o, o._reactInternals = t, ps(t, r, e, n), t = ys(null, t, r, !0, i, n)) : (t.tag = 0, We && i && Wl(t), vt(null, t, o, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Mi(e, t), e = t.pendingProps, o = r._init, r = o(r._payload), t.type = r, o = t.tag = ip(r), e = Ht(r, e), o) {
            case 0:
              t = vs(null, t, r, e, n);
              break e;
            case 1:
              t = ic(null, t, r, e, n);
              break e;
            case 11:
              t = ec(null, t, r, e, n);
              break e;
            case 14:
              t = tc(null, t, r, Ht(r.type, e), n);
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
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ht(r, o), vs(e, t, r, o, n);
      case 1:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ht(r, o), ic(e, t, r, o, n);
      case 3:
        e: {
          if (lc(t), e === null) throw Error(s(387));
          r = t.pendingProps, i = t.memoizedState, o = i.element, xu(e, t), _i(t, r, null, n);
          var u = t.memoizedState;
          if (r = u.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: u.cache, pendingSuspenseBoundaries: u.pendingSuspenseBoundaries, transitions: u.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            o = Dr(Error(s(423)), t), t = sc(e, t, r, n, o);
            break e;
          } else if (r !== o) {
            o = Dr(Error(s(424)), t), t = sc(e, t, r, n, o);
            break e;
          } else for (zt = Mn(t.stateNode.containerInfo.firstChild), Rt = t, We = !0, Wt = null, n = wu(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Or(), r === o) {
              t = gn(e, t, n);
              break e;
            }
            vt(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Eu(t), e === null && Kl(t), r = t.type, o = t.pendingProps, i = e !== null ? e.memoizedProps : null, u = o.children, $l(r, o) ? u = null : i !== null && $l(r, i) && (t.flags |= 32), oc(e, t), vt(e, t, u, n), t.child;
      case 6:
        return e === null && Kl(t), null;
      case 13:
        return ac(e, t, n);
      case 4:
        return es(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Mr(t, null, r, n) : vt(e, t, r, n), t.child;
      case 11:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ht(r, o), ec(e, t, r, o, n);
      case 7:
        return vt(e, t, t.pendingProps, n), t.child;
      case 8:
        return vt(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return vt(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, o = t.pendingProps, i = t.memoizedProps, u = o.value, Fe(ji, r._currentValue), r._currentValue = u, i !== null) if (Vt(i.value, u)) {
            if (i.children === o.children && !wt.current) {
              t = gn(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var f = i.dependencies;
            if (f !== null) {
              u = i.child;
              for (var h = f.firstContext; h !== null; ) {
                if (h.context === r) {
                  if (i.tag === 1) {
                    h = yn(-1, n & -n), h.tag = 2;
                    var k = i.updateQueue;
                    if (k !== null) {
                      k = k.shared;
                      var L = k.pending;
                      L === null ? h.next = h : (h.next = L.next, L.next = h), k.pending = h;
                    }
                  }
                  i.lanes |= n, h = i.alternate, h !== null && (h.lanes |= n), Gl(
                    i.return,
                    n,
                    t
                  ), f.lanes |= n;
                  break;
                }
                h = h.next;
              }
            } else if (i.tag === 10) u = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (u = i.return, u === null) throw Error(s(341));
              u.lanes |= n, f = u.alternate, f !== null && (f.lanes |= n), Gl(u, n, t), u = i.sibling;
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
        return o = t.type, r = t.pendingProps.children, $r(t, n), o = $t(o), r = r(o), t.flags |= 1, vt(e, t, r, n), t.child;
      case 14:
        return r = t.type, o = Ht(r, t.pendingProps), o = Ht(r.type, o), tc(e, t, r, o, n);
      case 15:
        return nc(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Ht(r, o), Mi(e, t), t.tag = 1, St(r) ? (e = !0, yi(t)) : e = !1, $r(t, n), Xu(t, r, o), ps(t, r, o, n), ys(null, t, r, !0, e, n);
      case 19:
        return cc(e, t, n);
      case 22:
        return rc(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function Oc(e, t) {
    return be(e, t);
  }
  function op(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ut(e, t, n, r) {
    return new op(e, t, n, r);
  }
  function $s(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function ip(e) {
    if (typeof e == "function") return $s(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === je) return 11;
      if (e === Ne) return 14;
    }
    return 2;
  }
  function Kn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Ut(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Ki(e, t, n, r, o, i) {
    var u = 2;
    if (r = e, typeof e == "function") $s(e) && (u = 1);
    else if (typeof e == "string") u = 5;
    else e: switch (e) {
      case he:
        return vr(n.children, o, i, t);
      case le:
        u = 8, o |= 8;
        break;
      case te:
        return e = Ut(12, n, t, o | 2), e.elementType = te, e.lanes = i, e;
      case ze:
        return e = Ut(13, n, t, o), e.elementType = ze, e.lanes = i, e;
      case Le:
        return e = Ut(19, n, t, o), e.elementType = Le, e.lanes = i, e;
      case se:
        return Xi(n, o, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Re:
            u = 10;
            break e;
          case _e:
            u = 9;
            break e;
          case je:
            u = 11;
            break e;
          case Ne:
            u = 14;
            break e;
          case ve:
            u = 16, r = null;
            break e;
        }
        throw Error(s(130, e == null ? e : typeof e, ""));
    }
    return t = Ut(u, n, t, o), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function vr(e, t, n, r) {
    return e = Ut(7, e, r, t), e.lanes = n, e;
  }
  function Xi(e, t, n, r) {
    return e = Ut(22, e, r, t), e.elementType = se, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Fs(e, t, n) {
    return e = Ut(6, e, null, t), e.lanes = n, e;
  }
  function Ds(e, t, n) {
    return t = Ut(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function lp(e, t, n, r, o) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = fl(0), this.expirationTimes = fl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = fl(0), this.identifierPrefix = r, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null;
  }
  function Us(e, t, n, r, o, i, u, f, h) {
    return e = new lp(e, t, n, f, h), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Ut(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, bl(i), e;
  }
  function sp(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: pe, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Mc(e) {
    if (!e) return $n;
    e = e._reactInternals;
    e: {
      if (de(e) !== e || e.tag !== 1) throw Error(s(170));
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
      if (St(n)) return uu(e, n, t);
    }
    return t;
  }
  function Ac(e, t, n, r, o, i, u, f, h) {
    return e = Us(n, r, !0, e, o, i, u, f, h), e.context = Mc(null), n = e.current, r = yt(), o = Hn(n), i = yn(r, o), i.callback = t ?? null, Un(n, i, o), e.current.lanes = o, to(e, o, r), jt(e, r), e;
  }
  function Yi(e, t, n, r) {
    var o = t.current, i = yt(), u = Hn(o);
    return n = Mc(n), t.context === null ? t.context = n : t.pendingContext = n, t = yn(i, u), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Un(o, t, u), e !== null && (Xt(e, o, u, i), Ci(e, o, u)), u;
  }
  function Ji(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function $c(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Bs(e, t) {
    $c(e, t), (e = e.alternate) && $c(e, t);
  }
  function ap() {
    return null;
  }
  var Fc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Vs(e) {
    this._internalRoot = e;
  }
  qi.prototype.render = Vs.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    Yi(e, t, null, null);
  }, qi.prototype.unmount = Vs.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      pr(function() {
        Yi(null, e, null, null);
      }), t[fn] = null;
    }
  };
  function qi(e) {
    this._internalRoot = e;
  }
  qi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = xa();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ln.length && t !== 0 && t < Ln[n].priority; n++) ;
      Ln.splice(n, 0, e), n === 0 && Ea(e);
    }
  };
  function Ws(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Gi(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Dc() {
  }
  function up(e, t, n, r, o) {
    if (o) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var k = Ji(u);
          i.call(k);
        };
      }
      var u = Ac(t, r, e, 0, null, !1, !1, "", Dc);
      return e._reactRootContainer = u, e[fn] = u.current, vo(e.nodeType === 8 ? e.parentNode : e), pr(), u;
    }
    for (; o = e.lastChild; ) e.removeChild(o);
    if (typeof r == "function") {
      var f = r;
      r = function() {
        var k = Ji(h);
        f.call(k);
      };
    }
    var h = Us(e, 0, !1, null, null, !1, !1, "", Dc);
    return e._reactRootContainer = h, e[fn] = h.current, vo(e.nodeType === 8 ? e.parentNode : e), pr(function() {
      Yi(t, h, n, r);
    }), h;
  }
  function Zi(e, t, n, r, o) {
    var i = n._reactRootContainer;
    if (i) {
      var u = i;
      if (typeof o == "function") {
        var f = o;
        o = function() {
          var h = Ji(u);
          f.call(h);
        };
      }
      Yi(t, u, e, o);
    } else u = up(n, t, e, o, r);
    return Ji(u);
  }
  wa = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = eo(t.pendingLanes);
          n !== 0 && (pl(t, n | 1), jt(t, Se()), (Ee & 6) === 0 && (Vr = Se() + 500, Fn()));
        }
        break;
      case 13:
        pr(function() {
          var r = vn(e, 1);
          if (r !== null) {
            var o = yt();
            Xt(r, e, 1, o);
          }
        }), Bs(e, 1);
    }
  }, hl = function(e) {
    if (e.tag === 13) {
      var t = vn(e, 134217728);
      if (t !== null) {
        var n = yt();
        Xt(t, e, 134217728, n);
      }
      Bs(e, 134217728);
    }
  }, Sa = function(e) {
    if (e.tag === 13) {
      var t = Hn(e), n = vn(e, t);
      if (n !== null) {
        var r = yt();
        Xt(n, e, t, r);
      }
      Bs(e, t);
    }
  }, xa = function() {
    return Ie;
  }, ka = function(e, t) {
    var n = Ie;
    try {
      return Ie = e, t();
    } finally {
      Ie = n;
    }
  }, Jr = function(e, t, n) {
    switch (t) {
      case "input":
        if (Gt(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var o = mi(r);
              if (!o) throw Error(s(90));
              Ze(r), Gt(r, o);
            }
          }
        }
        break;
      case "textarea":
        Zn(e, n);
        break;
      case "select":
        t = n.value, t != null && En(e, !!n.multiple, t, !1);
    }
  }, Jo = Os, Gr = pr;
  var cp = { usingClientEntryPoint: !1, Events: [wo, Tr, mi, Yo, qr, Os] }, Io = { findFiberByHostInstance: ir, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, dp = { bundleType: Io.bundleType, version: Io.version, rendererPackageName: Io.rendererPackageName, rendererConfig: Io.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ee.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = De(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Io.findFiberByHostInstance || ap, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var bi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!bi.isDisabled && bi.supportsFiber) try {
      or = bi.inject(dp), Pt = bi;
    } catch {
    }
  }
  return Et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = cp, Et.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ws(t)) throw Error(s(200));
    return sp(e, t, null, n);
  }, Et.createRoot = function(e, t) {
    if (!Ws(e)) throw Error(s(299));
    var n = !1, r = "", o = Fc;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = Us(e, 1, !1, null, null, n, !1, r, o), e[fn] = t.current, vo(e.nodeType === 8 ? e.parentNode : e), new Vs(t);
  }, Et.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = De(t), e = e === null ? null : e.stateNode, e;
  }, Et.flushSync = function(e) {
    return pr(e);
  }, Et.hydrate = function(e, t, n) {
    if (!Gi(t)) throw Error(s(200));
    return Zi(null, e, t, !0, n);
  }, Et.hydrateRoot = function(e, t, n) {
    if (!Ws(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, o = !1, i = "", u = Fc;
    if (n != null && (n.unstable_strictMode === !0 && (o = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (u = n.onRecoverableError)), t = Ac(t, null, e, 1, n ?? null, o, !1, i, u), e[fn] = t.current, vo(e), r) for (e = 0; e < r.length; e++) n = r[e], o = n._getVersion, o = o(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, o] : t.mutableSourceEagerHydrationData.push(
      n,
      o
    );
    return new qi(t);
  }, Et.render = function(e, t, n) {
    if (!Gi(t)) throw Error(s(200));
    return Zi(null, e, t, !1, n);
  }, Et.unmountComponentAtNode = function(e) {
    if (!Gi(e)) throw Error(s(40));
    return e._reactRootContainer ? (pr(function() {
      Zi(null, null, e, !1, function() {
        e._reactRootContainer = null, e[fn] = null;
      });
    }), !0) : !1;
  }, Et.unstable_batchedUpdates = Os, Et.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Gi(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return Zi(e, t, n, !1, r);
  }, Et.version = "18.3.1-next-f1338f8080-20240426", Et;
}
var Xc;
function kp() {
  if (Xc) return Ks.exports;
  Xc = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (a) {
        console.error(a);
      }
  }
  return l(), Ks.exports = xp(), Ks.exports;
}
var Yc;
function jp() {
  if (Yc) return el;
  Yc = 1;
  var l = kp();
  return el.createRoot = l.createRoot, el.hydrateRoot = l.hydrateRoot, el;
}
var Ep = jp();
const Cp = /* @__PURE__ */ fd(Ep), _p = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", Pp = `${_p}/chat/completions`, Np = 1, Jc = 256 * 1024 * 1024, Tp = 512 * 1024 * 1024, ll = 64 * 1024, Rp = `You are the analysis assistant inside OMERO Analysis Chat.
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
function Js() {
  const l = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return l ? decodeURIComponent(l[1]) : "";
}
function qs(l, a, s) {
  return l.replace("TYPE", a).replace("/1/", `/${s}/`);
}
class Lp {
  constructor(a) {
    on(this, "contextToken", "");
    on(this, "operations", /* @__PURE__ */ new Set());
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
        "X-CSRFToken": Js()
      },
      body: JSON.stringify({
        object_type: a.object_type,
        object_id: a.object_id
      })
    }), d = await tl(s);
    this.contextToken = d.context_token, this.operations = new Set(d.operations);
  }
  async download(a) {
    const s = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${a.annotation_id}/download/`
    ), d = await fetch(s, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!d.ok) throw new Error(await oa(d));
    return d.arrayBuffer();
  }
  async attach(a) {
    const s = this.bootstrap.context;
    if (!s || !a.data) throw new Error("No OMERO target or result data");
    const d = new FormData();
    d.append("file", new Blob([a.data], { type: a.type }), a.name);
    const w = await fetch(
      qs(
        this.bootstrap.uploadTemplate,
        s.object_type,
        s.object_id
      ),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": Js(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: d
      }
    );
    return (await tl(w)).attachment;
  }
  async listSnapshots() {
    const a = this.bootstrap.context;
    if (!a) return [];
    const s = await fetch(
      qs(this.bootstrap.snapshotsTemplate, a.object_type, a.object_id),
      {
        credentials: "same-origin",
        headers: { "X-OMERO-Analysis-Context": this.contextToken }
      }
    );
    return (await tl(s)).snapshots || [];
  }
  async uploadSnapshot(a, s) {
    const d = this.bootstrap.context;
    if (!d) throw new Error("No OMERO target for the project snapshot");
    const w = new FormData();
    w.append(
      "file",
      new Blob([s], { type: "application/zip" }),
      a
    );
    const m = await fetch(
      qs(this.bootstrap.snapshotUploadTemplate, d.object_type, d.object_id),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": Js(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: w
      }
    );
    return (await tl(m)).snapshot;
  }
  async downloadSnapshot(a) {
    const s = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${a.annotation_id}/download/`
    ), d = await fetch(s, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!d.ok) throw new Error(await oa(d));
    return d.arrayBuffer();
  }
}
async function oa(l) {
  var a;
  try {
    return ((a = (await l.json()).error) == null ? void 0 : a.message) || `${l.status} ${l.statusText}`;
  } catch {
    return `${l.status} ${l.statusText}`;
  }
}
async function tl(l) {
  var s;
  const a = await l.json().catch(() => ({}));
  if (!l.ok)
    throw new Error(((s = a.error) == null ? void 0 : s.message) || `${l.status} ${l.statusText}`);
  return a;
}
async function Ip(l, a, s) {
  const d = await fetch(Pp, {
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
  if (!d.ok) throw new Error(await oa(d));
  return d.json();
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
function Yt(l) {
  const a = String(l instanceof Error ? l.message : l).slice(0, ll), s = JSON.stringify({
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
  return s.length > ll ? `${s.slice(0, ll)}
[tool error truncated]` : s;
}
var Ye = Uint8Array, Ot = Uint16Array, ma = Int32Array, sl = new Ye([
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
]), al = new Ye([
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
]), ia = new Ye([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), pd = function(l, a) {
  for (var s = new Ot(31), d = 0; d < 31; ++d)
    s[d] = a += 1 << l[d - 1];
  for (var w = new ma(s[30]), d = 1; d < 30; ++d)
    for (var m = s[d]; m < s[d + 1]; ++m)
      w[m] = m - s[d] << 5 | d;
  return { b: s, r: w };
}, hd = pd(sl, 2), md = hd.b, la = hd.r;
md[28] = 258, la[258] = 28;
var vd = pd(al, 0), Mp = vd.b, qc = vd.r, sa = new Ot(32768);
for (var Ve = 0; Ve < 32768; ++Ve) {
  var Yn = (Ve & 43690) >> 1 | (Ve & 21845) << 1;
  Yn = (Yn & 52428) >> 2 | (Yn & 13107) << 2, Yn = (Yn & 61680) >> 4 | (Yn & 3855) << 4, sa[Ve] = ((Yn & 65280) >> 8 | (Yn & 255) << 8) >> 1;
}
var un = (function(l, a, s) {
  for (var d = l.length, w = 0, m = new Ot(a); w < d; ++w)
    l[w] && ++m[l[w] - 1];
  var N = new Ot(a);
  for (w = 1; w < a; ++w)
    N[w] = N[w - 1] + m[w - 1] << 1;
  var _;
  if (s) {
    _ = new Ot(1 << a);
    var j = 15 - a;
    for (w = 0; w < d; ++w)
      if (l[w])
        for (var $ = w << 4 | l[w], C = a - l[w], T = N[l[w] - 1]++ << C, F = T | (1 << C) - 1; T <= F; ++T)
          _[sa[T] >> j] = $;
  } else
    for (_ = new Ot(d), w = 0; w < d; ++w)
      l[w] && (_[w] = sa[N[l[w] - 1]++] >> 15 - l[w]);
  return _;
}), qn = new Ye(288);
for (var Ve = 0; Ve < 144; ++Ve)
  qn[Ve] = 8;
for (var Ve = 144; Ve < 256; ++Ve)
  qn[Ve] = 9;
for (var Ve = 256; Ve < 280; ++Ve)
  qn[Ve] = 7;
for (var Ve = 280; Ve < 288; ++Ve)
  qn[Ve] = 8;
var Fo = new Ye(32);
for (var Ve = 0; Ve < 32; ++Ve)
  Fo[Ve] = 5;
var Ap = /* @__PURE__ */ un(qn, 9, 0), $p = /* @__PURE__ */ un(qn, 9, 1), Fp = /* @__PURE__ */ un(Fo, 5, 0), Dp = /* @__PURE__ */ un(Fo, 5, 1), Gs = function(l) {
  for (var a = l[0], s = 1; s < l.length; ++s)
    l[s] > a && (a = l[s]);
  return a;
}, Jt = function(l, a, s) {
  var d = a / 8 | 0;
  return (l[d] | l[d + 1] << 8) >> (a & 7) & s;
}, Zs = function(l, a) {
  var s = a / 8 | 0;
  return (l[s] | l[s + 1] << 8 | l[s + 2] << 16) >> (a & 7);
}, va = function(l) {
  return (l + 7) / 8 | 0;
}, Do = function(l, a, s) {
  return (a == null || a < 0) && (a = 0), (s == null || s > l.length) && (s = l.length), new Ye(l.subarray(a, s));
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
  var d = new Error(a || Up[l]);
  if (d.code = l, Error.captureStackTrace && Error.captureStackTrace(d, gt), !s)
    throw d;
  return d;
}, Bp = function(l, a, s, d) {
  var w = l.length, m = d ? d.length : 0;
  if (!w || a.f && !a.l)
    return s || new Ye(0);
  var N = !s, _ = N || a.i != 2, j = a.i;
  N && (s = new Ye(w * 3));
  var $ = function(Ct) {
    var Ze = s.length;
    if (Ct > Ze) {
      var ht = new Ye(Math.max(Ze * 2, Ct));
      ht.set(s), s = ht;
    }
  }, C = a.f || 0, T = a.p || 0, F = a.b || 0, re = a.l, ue = a.d, Q = a.m, Y = a.n, Te = w * 8;
  do {
    if (!re) {
      C = Jt(l, T, 1);
      var ke = Jt(l, T + 1, 3);
      if (T += 3, ke)
        if (ke == 1)
          re = $p, ue = Dp, Q = 9, Y = 5;
        else if (ke == 2) {
          var pe = Jt(l, T, 31) + 257, he = Jt(l, T + 10, 15) + 4, le = pe + Jt(l, T + 5, 31) + 1;
          T += 14;
          for (var te = new Ye(le), Re = new Ye(19), _e = 0; _e < he; ++_e)
            Re[ia[_e]] = Jt(l, T + _e * 3, 7);
          T += he * 3;
          for (var je = Gs(Re), ze = (1 << je) - 1, Le = un(Re, je, 1), _e = 0; _e < le; ) {
            var Ne = Le[Jt(l, T, ze)];
            T += Ne & 15;
            var R = Ne >> 4;
            if (R < 16)
              te[_e++] = R;
            else {
              var ve = 0, se = 0;
              for (R == 16 ? (se = 3 + Jt(l, T, 3), T += 2, ve = te[_e - 1]) : R == 17 ? (se = 3 + Jt(l, T, 7), T += 3) : R == 18 && (se = 11 + Jt(l, T, 127), T += 7); se--; )
                te[_e++] = ve;
            }
          }
          var O = te.subarray(0, pe), B = te.subarray(pe);
          Q = Gs(O), Y = Gs(B), re = un(O, Q, 1), ue = un(B, Y, 1);
        } else
          gt(1);
      else {
        var R = va(T) + 4, ee = l[R - 4] | l[R - 3] << 8, ge = R + ee;
        if (ge > w) {
          j && gt(0);
          break;
        }
        _ && $(F + ee), s.set(l.subarray(R, ge), F), a.b = F += ee, a.p = T = ge * 8, a.f = C;
        continue;
      }
      if (T > Te) {
        j && gt(0);
        break;
      }
    }
    _ && $(F + 131072);
    for (var U = (1 << Q) - 1, v = (1 << Y) - 1, P = T; ; P = T) {
      var ve = re[Zs(l, T) & U], V = ve >> 4;
      if (T += ve & 15, T > Te) {
        j && gt(0);
        break;
      }
      if (ve || gt(2), V < 256)
        s[F++] = V;
      else if (V == 256) {
        P = T, re = null;
        break;
      } else {
        var b = V - 254;
        if (V > 264) {
          var _e = V - 257, Z = sl[_e];
          b = Jt(l, T, (1 << Z) - 1) + md[_e], T += Z;
        }
        var ae = ue[Zs(l, T) & v], me = ae >> 4;
        ae || gt(3), T += ae & 15;
        var B = Mp[me];
        if (me > 3) {
          var Z = al[me];
          B += Zs(l, T) & (1 << Z) - 1, T += Z;
        }
        if (T > Te) {
          j && gt(0);
          break;
        }
        _ && $(F + 131072);
        var ye = F + b;
        if (F < B) {
          var xe = m - B, qe = Math.min(B, ye);
          for (xe + F < 0 && gt(3); F < qe; ++F)
            s[F] = d[xe + F];
        }
        for (; F < ye; ++F)
          s[F] = s[F - B];
      }
    }
    a.l = re, a.p = P, a.b = F, a.f = C, re && (C = 1, a.m = Q, a.d = ue, a.n = Y);
  } while (!C);
  return F != s.length && N ? Do(s, 0, F) : s.subarray(0, F);
}, Sn = function(l, a, s) {
  s <<= a & 7;
  var d = a / 8 | 0;
  l[d] |= s, l[d + 1] |= s >> 8;
}, Mo = function(l, a, s) {
  s <<= a & 7;
  var d = a / 8 | 0;
  l[d] |= s, l[d + 1] |= s >> 8, l[d + 2] |= s >> 16;
}, bs = function(l, a) {
  for (var s = [], d = 0; d < l.length; ++d)
    l[d] && s.push({ s: d, f: l[d] });
  var w = s.length, m = s.slice();
  if (!w)
    return { t: gd, l: 0 };
  if (w == 1) {
    var N = new Ye(s[0].s + 1);
    return N[s[0].s] = 1, { t: N, l: 1 };
  }
  s.sort(function(ge, pe) {
    return ge.f - pe.f;
  }), s.push({ s: -1, f: 25001 });
  var _ = s[0], j = s[1], $ = 0, C = 1, T = 2;
  for (s[0] = { s: -1, f: _.f + j.f, l: _, r: j }; C != w - 1; )
    _ = s[s[$].f < s[T].f ? $++ : T++], j = s[$ != C && s[$].f < s[T].f ? $++ : T++], s[C++] = { s: -1, f: _.f + j.f, l: _, r: j };
  for (var F = m[0].s, d = 1; d < w; ++d)
    m[d].s > F && (F = m[d].s);
  var re = new Ot(F + 1), ue = aa(s[C - 1], re, 0);
  if (ue > a) {
    var d = 0, Q = 0, Y = ue - a, Te = 1 << Y;
    for (m.sort(function(pe, he) {
      return re[he.s] - re[pe.s] || pe.f - he.f;
    }); d < w; ++d) {
      var ke = m[d].s;
      if (re[ke] > a)
        Q += Te - (1 << ue - re[ke]), re[ke] = a;
      else
        break;
    }
    for (Q >>= Y; Q > 0; ) {
      var R = m[d].s;
      re[R] < a ? Q -= 1 << a - re[R]++ - 1 : ++d;
    }
    for (; d >= 0 && Q; --d) {
      var ee = m[d].s;
      re[ee] == a && (--re[ee], ++Q);
    }
    ue = a;
  }
  return { t: new Ye(re), l: ue };
}, aa = function(l, a, s) {
  return l.s == -1 ? Math.max(aa(l.l, a, s + 1), aa(l.r, a, s + 1)) : a[l.s] = s;
}, Gc = function(l) {
  for (var a = l.length; a && !l[--a]; )
    ;
  for (var s = new Ot(++a), d = 0, w = l[0], m = 1, N = function(j) {
    s[d++] = j;
  }, _ = 1; _ <= a; ++_)
    if (l[_] == w && _ != a)
      ++m;
    else {
      if (!w && m > 2) {
        for (; m > 138; m -= 138)
          N(32754);
        m > 2 && (N(m > 10 ? m - 11 << 5 | 28690 : m - 3 << 5 | 12305), m = 0);
      } else if (m > 3) {
        for (N(w), --m; m > 6; m -= 6)
          N(8304);
        m > 2 && (N(m - 3 << 5 | 8208), m = 0);
      }
      for (; m--; )
        N(w);
      m = 1, w = l[_];
    }
  return { c: s.subarray(0, d), n: a };
}, Ao = function(l, a) {
  for (var s = 0, d = 0; d < a.length; ++d)
    s += l[d] * a[d];
  return s;
}, yd = function(l, a, s) {
  var d = s.length, w = va(a + 2);
  l[w] = d & 255, l[w + 1] = d >> 8, l[w + 2] = l[w] ^ 255, l[w + 3] = l[w + 1] ^ 255;
  for (var m = 0; m < d; ++m)
    l[w + m + 4] = s[m];
  return (w + 4 + d) * 8;
}, Zc = function(l, a, s, d, w, m, N, _, j, $, C) {
  Sn(a, C++, s), ++w[256];
  for (var T = bs(w, 15), F = T.t, re = T.l, ue = bs(m, 15), Q = ue.t, Y = ue.l, Te = Gc(F), ke = Te.c, R = Te.n, ee = Gc(Q), ge = ee.c, pe = ee.n, he = new Ot(19), le = 0; le < ke.length; ++le)
    ++he[ke[le] & 31];
  for (var le = 0; le < ge.length; ++le)
    ++he[ge[le] & 31];
  for (var te = bs(he, 7), Re = te.t, _e = te.l, je = 19; je > 4 && !Re[ia[je - 1]]; --je)
    ;
  var ze = $ + 5 << 3, Le = Ao(w, qn) + Ao(m, Fo) + N, Ne = Ao(w, F) + Ao(m, Q) + N + 14 + 3 * je + Ao(he, Re) + 2 * he[16] + 3 * he[17] + 7 * he[18];
  if (j >= 0 && ze <= Le && ze <= Ne)
    return yd(a, C, l.subarray(j, j + $));
  var ve, se, O, B;
  if (Sn(a, C, 1 + (Ne < Le)), C += 2, Ne < Le) {
    ve = un(F, re, 0), se = F, O = un(Q, Y, 0), B = Q;
    var U = un(Re, _e, 0);
    Sn(a, C, R - 257), Sn(a, C + 5, pe - 1), Sn(a, C + 10, je - 4), C += 14;
    for (var le = 0; le < je; ++le)
      Sn(a, C + 3 * le, Re[ia[le]]);
    C += 3 * je;
    for (var v = [ke, ge], P = 0; P < 2; ++P)
      for (var V = v[P], le = 0; le < V.length; ++le) {
        var b = V[le] & 31;
        Sn(a, C, U[b]), C += Re[b], b > 15 && (Sn(a, C, V[le] >> 5 & 127), C += V[le] >> 12);
      }
  } else
    ve = Ap, se = qn, O = Fp, B = Fo;
  for (var le = 0; le < _; ++le) {
    var Z = d[le];
    if (Z > 255) {
      var b = Z >> 18 & 31;
      Mo(a, C, ve[b + 257]), C += se[b + 257], b > 7 && (Sn(a, C, Z >> 23 & 31), C += sl[b]);
      var ae = Z & 31;
      Mo(a, C, O[ae]), C += B[ae], ae > 3 && (Mo(a, C, Z >> 5 & 8191), C += al[ae]);
    } else
      Mo(a, C, ve[Z]), C += se[Z];
  }
  return Mo(a, C, ve[256]), C + se[256];
}, Vp = /* @__PURE__ */ new ma([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), gd = /* @__PURE__ */ new Ye(0), Wp = function(l, a, s, d, w, m) {
  var N = m.z || l.length, _ = new Ye(d + N + 5 * (1 + Math.ceil(N / 7e3)) + w), j = _.subarray(d, _.length - w), $ = m.l, C = (m.r || 0) & 7;
  if (a) {
    C && (j[0] = m.r >> 3);
    for (var T = Vp[a - 1], F = T >> 13, re = T & 8191, ue = (1 << s) - 1, Q = m.p || new Ot(32768), Y = m.h || new Ot(ue + 1), Te = Math.ceil(s / 3), ke = 2 * Te, R = function(_t) {
      return (l[_t] ^ l[_t + 1] << Te ^ l[_t + 2] << ke) & ue;
    }, ee = new ma(25e3), ge = new Ot(288), pe = new Ot(32), he = 0, le = 0, te = m.i || 0, Re = 0, _e = m.w || 0, je = 0; te + 2 < N; ++te) {
      var ze = R(te), Le = te & 32767, Ne = Y[ze];
      if (Q[Le] = Ne, Y[ze] = Le, _e <= te) {
        var ve = N - te;
        if ((he > 7e3 || Re > 24576) && (ve > 423 || !$)) {
          C = Zc(l, j, 0, ee, ge, pe, le, Re, je, te - je, C), Re = he = le = 0, je = te;
          for (var se = 0; se < 286; ++se)
            ge[se] = 0;
          for (var se = 0; se < 30; ++se)
            pe[se] = 0;
        }
        var O = 2, B = 0, U = re, v = Le - Ne & 32767;
        if (ve > 2 && ze == R(te - v))
          for (var P = Math.min(F, ve) - 1, V = Math.min(32767, te), b = Math.min(258, ve); v <= V && --U && Le != Ne; ) {
            if (l[te + O] == l[te + O - v]) {
              for (var Z = 0; Z < b && l[te + Z] == l[te + Z - v]; ++Z)
                ;
              if (Z > O) {
                if (O = Z, B = v, Z > P)
                  break;
                for (var ae = Math.min(v, Z - 2), me = 0, se = 0; se < ae; ++se) {
                  var ye = te - v + se & 32767, xe = Q[ye], qe = ye - xe & 32767;
                  qe > me && (me = qe, Ne = ye);
                }
              }
            }
            Le = Ne, Ne = Q[Le], v += Le - Ne & 32767;
          }
        if (B) {
          ee[Re++] = 268435456 | la[O] << 18 | qc[B];
          var Ct = la[O] & 31, Ze = qc[B] & 31;
          le += sl[Ct] + al[Ze], ++ge[257 + Ct], ++pe[Ze], _e = te + O, ++he;
        } else
          ee[Re++] = l[te], ++ge[l[te]];
      }
    }
    for (te = Math.max(te, _e); te < N; ++te)
      ee[Re++] = l[te], ++ge[l[te]];
    C = Zc(l, j, $, ee, ge, pe, le, Re, je, te - je, C), $ || (m.r = C & 7 | j[C / 8 | 0] << 3, C -= 7, m.h = Y, m.p = Q, m.i = te, m.w = _e);
  } else {
    for (var te = m.w || 0; te < N + $; te += 65535) {
      var ht = te + 65535;
      ht >= N && (j[C / 8 | 0] = $, ht = N), C = yd(j, C + 1, l.subarray(te, ht));
    }
    m.i = N;
  }
  return Do(_, 0, d + va(C) + w);
}, Hp = /* @__PURE__ */ (function() {
  for (var l = new Int32Array(256), a = 0; a < 256; ++a) {
    for (var s = a, d = 9; --d; )
      s = (s & 1 && -306674912) ^ s >>> 1;
    l[a] = s;
  }
  return l;
})(), Qp = function() {
  var l = -1;
  return {
    p: function(a) {
      for (var s = l, d = 0; d < a.length; ++d)
        s = Hp[s & 255 ^ a[d]] ^ s >>> 8;
      l = s;
    },
    d: function() {
      return ~l;
    }
  };
}, Kp = function(l, a, s, d, w) {
  if (!w && (w = { l: 1 }, a.dictionary)) {
    var m = a.dictionary.subarray(-32768), N = new Ye(m.length + l.length);
    N.set(m), N.set(l, m.length), l = N, w.w = m.length;
  }
  return Wp(l, a.level == null ? 6 : a.level, a.mem == null ? w.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(l.length))) * 1.5) : 20 : 12 + a.mem, s, d, w);
}, wd = function(l, a) {
  var s = {};
  for (var d in l)
    s[d] = l[d];
  for (var d in a)
    s[d] = a[d];
  return s;
}, an = function(l, a) {
  return l[a] | l[a + 1] << 8;
}, qt = function(l, a) {
  return (l[a] | l[a + 1] << 8 | l[a + 2] << 16 | l[a + 3] << 24) >>> 0;
}, ea = function(l, a) {
  return qt(l, a) + qt(l, a + 4) * 4294967296;
}, ut = function(l, a, s) {
  for (; s; ++a)
    l[a] = s, s >>>= 8;
};
function Xp(l, a) {
  return Kp(l, a || {}, 0, 0);
}
function Yp(l, a) {
  return Bp(l, { i: 2 }, a && a.out, a && a.dictionary);
}
var Sd = function(l, a, s, d) {
  for (var w in l) {
    var m = l[w], N = a + w, _ = d;
    Array.isArray(m) && (_ = wd(d, m[1]), m = m[0]), m instanceof Ye ? s[N] = [m, _] : (s[N += "/"] = [new Ye(0), _], Sd(m, N, s, d));
  }
}, bc = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), ua = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), Jp = 0;
try {
  ua.decode(gd, { stream: !0 }), Jp = 1;
} catch {
}
var qp = function(l) {
  for (var a = "", s = 0; ; ) {
    var d = l[s++], w = (d > 127) + (d > 223) + (d > 239);
    if (s + w > l.length)
      return { s: a, r: Do(l, s - 1) };
    w ? w == 3 ? (d = ((d & 15) << 18 | (l[s++] & 63) << 12 | (l[s++] & 63) << 6 | l[s++] & 63) - 65536, a += String.fromCharCode(55296 | d >> 10, 56320 | d & 1023)) : w & 1 ? a += String.fromCharCode((d & 31) << 6 | l[s++] & 63) : a += String.fromCharCode((d & 15) << 12 | (l[s++] & 63) << 6 | l[s++] & 63) : a += String.fromCharCode(d);
  }
};
function ca(l, a) {
  var s;
  if (bc)
    return bc.encode(l);
  for (var d = l.length, w = new Ye(l.length + (l.length >> 1)), m = 0, N = function($) {
    w[m++] = $;
  }, s = 0; s < d; ++s) {
    if (m + 5 > w.length) {
      var _ = new Ye(m + 8 + (d - s << 1));
      _.set(w), w = _;
    }
    var j = l.charCodeAt(s);
    j < 128 || a ? N(j) : j < 2048 ? (N(192 | j >> 6), N(128 | j & 63)) : j > 55295 && j < 57344 ? (j = 65536 + (j & 1047552) | l.charCodeAt(++s) & 1023, N(240 | j >> 18), N(128 | j >> 12 & 63), N(128 | j >> 6 & 63), N(128 | j & 63)) : (N(224 | j >> 12), N(128 | j >> 6 & 63), N(128 | j & 63));
  }
  return Do(w, 0, m);
}
function xd(l, a) {
  if (a) {
    for (var s = "", d = 0; d < l.length; d += 16384)
      s += String.fromCharCode.apply(null, l.subarray(d, d + 16384));
    return s;
  } else {
    if (ua)
      return ua.decode(l);
    var w = qp(l), m = w.s, s = w.r;
    return s.length && gt(8), m;
  }
}
var Gp = function(l, a) {
  return a + 30 + an(l, a + 26) + an(l, a + 28);
}, Zp = function(l, a, s) {
  var d = an(l, a + 28), w = xd(l.subarray(a + 46, a + 46 + d), !(an(l, a + 8) & 2048)), m = a + 46 + d, N = qt(l, a + 20), _ = s && N == 4294967295 ? bp(l, m) : [N, qt(l, a + 24), qt(l, a + 42)], j = _[0], $ = _[1], C = _[2];
  return [an(l, a + 10), j, $, w, m + an(l, a + 30) + an(l, a + 32), C];
}, bp = function(l, a) {
  for (; an(l, a) != 1; a += 4 + an(l, a + 2))
    ;
  return [ea(l, a + 12), ea(l, a + 4), ea(l, a + 20)];
}, da = function(l) {
  var a = 0;
  if (l)
    for (var s in l) {
      var d = l[s].length;
      d > 65535 && gt(9), a += d + 4;
    }
  return a;
}, ed = function(l, a, s, d, w, m, N, _) {
  var j = d.length, $ = s.extra, C = _ && _.length, T = da($);
  ut(l, a, N != null ? 33639248 : 67324752), a += 4, N != null && (l[a++] = 20, l[a++] = s.os), l[a] = 20, a += 2, l[a++] = s.flag << 1 | (m < 0 && 8), l[a++] = w && 8, l[a++] = s.compression & 255, l[a++] = s.compression >> 8;
  var F = new Date(s.mtime == null ? Date.now() : s.mtime), re = F.getFullYear() - 1980;
  if ((re < 0 || re > 119) && gt(10), ut(l, a, re << 25 | F.getMonth() + 1 << 21 | F.getDate() << 16 | F.getHours() << 11 | F.getMinutes() << 5 | F.getSeconds() >> 1), a += 4, m != -1 && (ut(l, a, s.crc), ut(l, a + 4, m < 0 ? -m - 2 : m), ut(l, a + 8, s.size)), ut(l, a + 12, j), ut(l, a + 14, T), a += 16, N != null && (ut(l, a, C), ut(l, a + 6, s.attrs), ut(l, a + 10, N), a += 14), l.set(d, a), a += j, T)
    for (var ue in $) {
      var Q = $[ue], Y = Q.length;
      ut(l, a, +ue), ut(l, a + 2, Y), l.set(Q, a + 4), a += 4 + Y;
    }
  return C && (l.set(_, a), a += C), a;
}, eh = function(l, a, s, d, w) {
  ut(l, a, 101010256), ut(l, a + 8, s), ut(l, a + 10, s), ut(l, a + 12, d), ut(l, a + 16, w);
};
function th(l, a) {
  a || (a = {});
  var s = {}, d = [];
  Sd(l, "", s, a);
  var w = 0, m = 0;
  for (var N in s) {
    var _ = s[N], j = _[0], $ = _[1], C = $.level == 0 ? 0 : 8, T = ca(N), F = T.length, re = $.comment, ue = re && ca(re), Q = ue && ue.length, Y = da($.extra);
    F > 65535 && gt(11);
    var Te = C ? Xp(j, $) : j, ke = Te.length, R = Qp();
    R.p(j), d.push(wd($, {
      size: j.length,
      crc: R.d(),
      c: Te,
      f: T,
      m: ue,
      u: F != N.length || ue && re.length != Q,
      o: w,
      compression: C
    })), w += 30 + F + Y + ke, m += 76 + 2 * (F + Y) + (Q || 0) + ke;
  }
  for (var ee = new Ye(m + 22), ge = w, pe = m - w, he = 0; he < d.length; ++he) {
    var T = d[he];
    ed(ee, T.o, T, T.f, T.u, T.c.length);
    var le = 30 + T.f.length + da(T.extra);
    ee.set(T.c, T.o + le), ed(ee, w, T, T.f, T.u, T.c.length, T.o, T.m), w += 16 + le + (T.m ? T.m.length : 0);
  }
  return eh(ee, w, d.length, pe, ge), ee;
}
function nh(l, a) {
  for (var s = {}, d = l.length - 22; qt(l, d) != 101010256; --d)
    (!d || l.length - d > 65558) && gt(13);
  var w = an(l, d + 8);
  if (!w)
    return {};
  var m = qt(l, d + 16), N = m == 4294967295 || w == 65535;
  if (N) {
    var _ = qt(l, d - 12);
    N = qt(l, _) == 101075792, N && (w = qt(l, _ + 32), m = qt(l, _ + 48));
  }
  for (var j = 0; j < w; ++j) {
    var $ = Zp(l, m, N), C = $[0], T = $[1], F = $[2], re = $[3], ue = $[4], Q = $[5], Y = Gp(l, Q);
    m = ue, C ? C == 8 ? s[re] = Yp(l.subarray(Y, Y + T), { out: new Ye(F) }) : gt(14, "unknown compression type " + C) : s[re] = Do(l, Y, Y + T);
  }
  return s;
}
const rh = "omero-analysis-chat", oh = 2, kd = ["projects", "chats", "files", "executions", "scripts"];
function Uo(l) {
  return new Promise((a, s) => {
    l.onsuccess = () => a(l.result), l.onerror = () => s(l.error);
  });
}
function ul(l) {
  return new Promise((a, s) => {
    l.oncomplete = () => a(), l.onerror = () => s(l.error), l.onabort = () => s(l.error || new Error("Storage transaction aborted"));
  });
}
function xn() {
  return new Promise((l, a) => {
    const s = indexedDB.open(rh, oh);
    s.onupgradeneeded = () => {
      const d = s.result;
      d.objectStoreNames.contains("values") || d.createObjectStore("values");
      for (const w of kd) {
        if (d.objectStoreNames.contains(w)) continue;
        const m = d.createObjectStore(w, { keyPath: "id" });
        w !== "projects" && m.createIndex("projectId", "projectId"), w === "projects" && m.createIndex("contextKey", "contextKey", { unique: !0 }), (w === "files" || w === "executions") && m.createIndex("chatId", "chatId");
      }
    }, s.onsuccess = () => l(s.result), s.onerror = () => a(s.error);
  });
}
async function jd(l) {
  const s = (await xn()).transaction("values", "readonly");
  return Uo(s.objectStore("values").get(l));
}
async function Ed(l, a) {
  const d = (await xn()).transaction("values", "readwrite");
  d.objectStore("values").put(a, l), await ul(d);
}
async function Bo(l, a) {
  const d = (await xn()).transaction(l, "readwrite");
  d.objectStore(l).put(a), await ul(d);
}
async function ih(l, a) {
  const d = (await xn()).transaction(l, "readwrite");
  d.objectStore(l).delete(a), await ul(d);
}
async function Jn(l, a) {
  const d = (await xn()).transaction(l, "readonly");
  return Uo(d.objectStore(l).index("projectId").getAll(a));
}
const td = (l) => Bo("projects", l), ta = (l) => Bo("chats", l), nl = (l) => Bo("files", l), lh = (l) => Bo("executions", l), nd = (l) => Bo("scripts", l), sh = (l) => ih("files", l);
async function Cd(l) {
  return l ? `${l.user_id}:${l.group_id}:${l.object_type}:${l.object_id}` : "standalone";
}
function ah(l) {
  return l.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 64).toLowerCase() || "workspace";
}
function uh(l) {
  return l ? `OMERO/${l.object_type}-${l.object_id}--${ah(l.name)}` : "OMERO/Local--workspace";
}
async function sn(l) {
  const a = typeof l == "string" ? new TextEncoder().encode(l) : new Uint8Array(l), s = await crypto.subtle.digest("SHA-256", a);
  return Array.from(new Uint8Array(s), (d) => d.toString(16).padStart(2, "0")).join("");
}
function fa(l, a = "New analysis") {
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
  const s = (await xn()).transaction("projects", "readonly");
  return Uo(s.objectStore("projects").index("contextKey").get(l));
}
async function Hr(l) {
  const s = (await xn()).transaction([...kd], "readwrite");
  s.objectStore("projects").put(l.project), l.chats.forEach((d) => s.objectStore("chats").put(d)), l.files.forEach((d) => s.objectStore("files").put(d)), l.executions.forEach((d) => s.objectStore("executions").put(d)), l.scripts.forEach((d) => s.objectStore("scripts").put(d)), await ul(s);
}
async function dh(l, a, s) {
  const d = await jd(`workspace:${s}`);
  if (!d) return null;
  const w = (/* @__PURE__ */ new Date()).toISOString();
  a.title = "Imported chat", a.messages = (d.messages || []).map((_) => ({
    id: String(_.id || crypto.randomUUID()),
    role: _.role === "user" ? "user" : "assistant",
    content: String(_.content || _.code || ""),
    kind: _.kind === "error" ? "error" : "text",
    createdAt: w
  })), a.updatedAt = w;
  const m = [];
  for (const _ of d.files || []) {
    const j = _.data instanceof ArrayBuffer ? _.data : void 0;
    m.push({
      id: String(_.id || crypto.randomUUID()),
      projectId: l.id,
      chatId: _.source === "result" ? a.id : void 0,
      name: String(_.name || "file"),
      logicalPath: _.source === "result" ? `${l.rootPath}/chats/${a.id}/outputs/${String(_.name || "file")}` : `${l.rootPath}/inputs/${String(_.name || "file")}`,
      type: String(_.type || "application/octet-stream"),
      size: Number(_.size || (j == null ? void 0 : j.byteLength) || 0),
      sha256: j ? await sn(j) : "",
      source: _.source === "result" ? "result" : _.source === "omero" ? "omero" : "local",
      state: _.state === "failed" ? "failed" : j ? "ready" : "missing",
      data: j,
      error: _.error,
      annotationId: _.annotationId,
      createdAt: w
    });
  }
  const N = { project: l, chats: [a], files: m, executions: [], scripts: [] };
  return await Hr(N), await Ed(`migration:v2:${s}`, { completedAt: w }), N;
}
async function fh(l) {
  const a = await Cd(l);
  let s = await ch(a);
  if (!s) {
    const _ = (/* @__PURE__ */ new Date()).toISOString(), j = fa(crypto.randomUUID());
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
    const $ = await dh(s, j, a);
    if ($) return $;
    const C = { project: s, chats: [j], files: [], executions: [], scripts: [] };
    return await Hr(C), C;
  }
  const [d, w, m, N] = await Promise.all([
    Jn("chats", s.id),
    Jn("files", s.id),
    Jn("executions", s.id),
    Jn("scripts", s.id)
  ]);
  if (!d.length) {
    const _ = fa(s.id);
    s = { ...s, activeChatId: _.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }, await Hr({ project: s, chats: [_], files: w, executions: m, scripts: N }), d.push(_);
  }
  return { project: s, chats: d, files: w, executions: m, scripts: N };
}
async function na(l) {
  const a = await Cd(l), d = (await xn()).transaction("projects", "readonly");
  return (await Uo(d.objectStore("projects").getAll())).filter((m) => m.contextKey === a || m.contextKey.startsWith(`${a}:import:`)).sort((m, N) => N.updatedAt.localeCompare(m.updatedAt));
}
async function ph(l) {
  const s = (await xn()).transaction("projects", "readonly"), d = await Uo(s.objectStore("projects").get(l));
  if (!d) return;
  const [w, m, N, _] = await Promise.all([
    Jn("chats", d.id),
    Jn("files", d.id),
    Jn("executions", d.id),
    Jn("scripts", d.id)
  ]);
  return { project: d, chats: w, files: m, executions: N, scripts: _ };
}
async function rl() {
  var a, s;
  const l = await ((s = (a = navigator.storage) == null ? void 0 : a.estimate) == null ? void 0 : s.call(a));
  return { usage: (l == null ? void 0 : l.usage) || 0, quota: (l == null ? void 0 : l.quota) || 0 };
}
const rd = "provider:AmsterdamUMC", od = {
  apiKey: "",
  model: "",
  contextWindow: 0
}, _d = "nl.bioimaging.analysis-chat.project", Pd = 1, hh = 1e4, mh = 512 * 1024 * 1024;
function ln(l) {
  return l.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}
function $o(l) {
  return new Uint8Array(ca(l));
}
function vh(l) {
  return { ...l };
}
function id(l, a) {
  const s = {}, d = [], w = l.files.map((j) => {
    const $ = { ...j };
    delete $.data;
    const C = j.source === "omero";
    if (j.source === "local" && a)
      return d.push(j.name), $.state = "missing", $.error = "Local input was omitted because the project snapshot exceeded its size limit.", $;
    if (C || !j.data) return $;
    const F = j.source === "local" ? `inputs/local/${ln(j.id)}--${ln(j.name)}` : `chats/${ln(j.chatId || "unassigned")}/outputs/${ln(j.id)}--${ln(j.name)}`;
    return $.archivePath = F, s[F] = new Uint8Array(j.data), $;
  }), m = {
    format: _d,
    version: Pd,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    project: vh(l.project),
    chats: l.chats,
    executions: l.executions,
    scripts: l.scripts,
    files: w,
    omittedLocalInputs: d
  };
  s["project.json"] = $o(JSON.stringify(m, null, 2));
  for (const j of l.chats)
    s[`chats/${ln(j.id)}/chat.json`] = $o(JSON.stringify(j, null, 2)), s[`chats/${ln(j.id)}/chat.md`] = $o(gh(j));
  for (const j of l.scripts) {
    s[`scripts/${ln(j.id)}/script.json`] = $o(JSON.stringify(j, null, 2));
    for (const $ of j.versions)
      s[`scripts/${ln(j.id)}/v${String($.version).padStart(3, "0")}.py`] = $o($.code);
  }
  const N = th(s, { level: 0 }), _ = `${ln(l.project.rootPath.split("/").at(-1) || "analysis-project")}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.oac.zip`;
  return { data: N, filename: _, omittedLocalInputs: d, manifest: m };
}
function yh(l, a) {
  const s = id(l, !1);
  if (s.data.byteLength <= a) return s;
  const d = id(l, !0);
  if (d.data.byteLength > a)
    throw new Error(
      `Chats, scripts, and generated outputs require ${(d.data.byteLength / 1024 / 1024).toFixed(1)} MiB, exceeding the ${(a / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  return d;
}
function gh(l) {
  const a = [`# ${l.title}`, "", `Updated: ${l.updatedAt}`, ""];
  l.summary && a.push("## Conversation summary", "", l.summary, "");
  for (const s of l.messages)
    s.kind !== "execution" && a.push(`## ${s.role === "user" ? "User" : "Assistant"}`, "", s.content, "");
  return a.join(`
`);
}
function ld(l) {
  if (!l || l.startsWith("/") || l.startsWith("\\") || l.split(/[\\/]/).includes(".."))
    throw new Error(`Unsafe project archive path: ${l}`);
}
function pa(l) {
  return !l || typeof l != "object" ? !1 : Array.isArray(l) ? l.some(pa) : Object.entries(l).some(([a, s]) => {
    const d = a.toLowerCase().replace(/[^a-z0-9]/g, "");
    return d === "apikey" || d === "azurekey" || d === "credential" || pa(s);
  });
}
async function sd(l) {
  var ke;
  const a = nh(new Uint8Array(l)), s = Object.keys(a);
  if (s.length > hh) throw new Error("Project archive contains too many entries");
  let d = 0;
  for (const R of s)
    if (ld(R), d += a[R].byteLength, d > mh) throw new Error("Project archive exceeds the 512 MiB workspace limit");
  const w = a["project.json"];
  if (!w) throw new Error("Project archive does not contain project.json");
  const m = JSON.parse(xd(w));
  if (m.format !== _d || m.version !== Pd)
    throw new Error("Unsupported Analysis Chat project format");
  if (pa(m))
    throw new Error("Project archive unexpectedly contains an API key field");
  const N = crypto.randomUUID(), _ = new Map(m.chats.map((R) => [R.id, crypto.randomUUID()])), j = new Map(m.executions.map((R) => [R.id, crypto.randomUUID()])), $ = new Map(m.files.map((R) => [R.id, crypto.randomUUID()])), C = new Map(m.scripts.map((R) => [R.id, crypto.randomUUID()])), T = (/* @__PURE__ */ new Date()).toISOString(), F = m.chats.map((R) => ({
    ...R,
    id: _.get(R.id),
    projectId: N,
    title: `${R.title} (imported)`,
    messages: R.messages.map((ee) => ({
      ...ee,
      executionId: ee.executionId ? j.get(ee.executionId) : void 0
    })),
    updatedAt: T
  })), re = [];
  for (const R of m.files) {
    let ee;
    if (R.archivePath) {
      ld(R.archivePath);
      const ge = a[R.archivePath];
      if (!ge) throw new Error(`Missing archived file: ${R.archivePath}`);
      if (ee = ge.buffer.slice(ge.byteOffset, ge.byteOffset + ge.byteLength), R.sha256 && await sn(ee) !== R.sha256)
        throw new Error(`Hash mismatch for ${R.name}`);
    }
    re.push({
      ...R,
      id: $.get(R.id),
      projectId: N,
      chatId: R.chatId ? _.get(R.chatId) : void 0,
      executionId: R.executionId ? j.get(R.executionId) : void 0,
      data: ee,
      state: ee || R.source === "omero" ? R.state : "missing",
      logicalPath: R.logicalPath.replace(m.project.rootPath, `${m.project.rootPath}--imported`)
    });
  }
  const ue = m.executions.map((R) => ({
    ...R,
    id: j.get(R.id),
    projectId: N,
    chatId: _.get(R.chatId),
    outputFileIds: R.outputFileIds.map((ee) => $.get(ee)).filter(Boolean),
    reusedFrom: R.reusedFrom ? j.get(R.reusedFrom) : void 0
  })), Q = m.scripts.map((R) => ({
    ...R,
    id: C.get(R.id),
    projectId: N,
    versions: R.versions.map((ee) => ({
      ...ee,
      executionId: j.get(ee.executionId) || ""
    })),
    updatedAt: T
  })), Y = _.get(m.project.activeChatId) || ((ke = F[0]) == null ? void 0 : ke.id);
  if (!Y) throw new Error("Project archive contains no chats");
  return { project: {
    ...m.project,
    id: N,
    contextKey: `${m.project.contextKey}:import:${N}`,
    rootPath: `${m.project.rootPath}--imported`,
    name: `${m.project.name} (imported)`,
    activeChatId: Y,
    createdAt: T,
    updatedAt: T
  }, chats: F, files: re, executions: ue, scripts: Q };
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
], ad = "pyodide-314.0.3-oac-0.2";
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
function xh(l) {
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
class kh {
  constructor(a) {
    on(this, "frame", null);
    on(this, "pending", /* @__PURE__ */ new Map());
    on(this, "inputs", []);
    on(this, "counter", 0);
    on(this, "readyPromise", null);
    on(this, "onProgress", null);
    on(this, "receive", (a) => {
      var w;
      if (a.source !== ((w = this.frame) == null ? void 0 : w.contentWindow)) return;
      const s = a.data;
      if (!s || s.source !== "oac-runtime") return;
      if (s.type === "progress") {
        this.report(s.value);
        return;
      }
      const d = this.pending.get(s.id);
      d && (clearTimeout(d.timer), this.pending.delete(s.id), s.type === "error" ? d.reject(new Error(s.value)) : d.resolve(s.value));
    });
    this.runtimeBase = a, window.addEventListener("message", this.receive);
  }
  async start(a, s) {
    s && (this.onProgress = s), this.inputs = a.filter((m) => m.state === "ready" && m.data), this.destroyFrame(), this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const d = document.createElement("iframe");
    d.hidden = !0, d.setAttribute("sandbox", "allow-scripts"), d.setAttribute("aria-hidden", "true");
    const w = new Promise(
      (m) => d.addEventListener("load", () => m(), { once: !0 })
    );
    return d.srcdoc = xh(
      new URL(this.runtimeBase, window.location.href).toString()
    ), document.body.append(d), this.frame = d, this.readyPromise = (async () => {
      await w, this.report({ percent: 8, message: "Connecting to the Python worker…" }), await this.request("ping", !0, 12e4);
      for (let m = 0; m < this.inputs.length; m += 1) {
        const N = this.inputs[m];
        this.report({
          percent: 92 + Math.round(m / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${m + 1} of ${this.inputs.length} data files into Python…`
        });
        const _ = N.data.slice(0);
        await this.request("file", { name: N.name, data: _ }, 3e4, [_]);
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
  request(a, s, d, w = []) {
    const m = `runtime-${++this.counter}`;
    return new Promise((N, _) => {
      var $, C;
      const j = window.setTimeout(() => {
        this.pending.delete(m), _(new Error(`${a} exceeded ${d / 1e3} seconds`)), a === "run" && this.start(this.inputs);
      }, d);
      this.pending.set(m, { resolve: N, reject: _, timer: j }), (C = ($ = this.frame) == null ? void 0 : $.contentWindow) == null || C.postMessage(
        { source: "oac-parent", id: m, type: a, value: s },
        "*",
        w
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
const jh = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, ud = 256 * 1024 * 1024, It = () => crypto.randomUUID(), $e = () => (/* @__PURE__ */ new Date()).toISOString(), cd = (l) => l.toLowerCase().endsWith(".png") ? "image/png" : l.toLowerCase().endsWith(".svg") ? "image/svg+xml" : l.toLowerCase().endsWith(".csv") ? "text/csv" : l.toLowerCase().endsWith(".json") ? "application/json" : "application/octet-stream";
function ol(l) {
  return l.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function Eh(l) {
  const a = l.replace(/\s+/g, " ").trim().slice(0, 64);
  return a ? a.charAt(0).toUpperCase() + a.slice(1) : "New analysis";
}
function Ch(l) {
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
function ra(l) {
  return Math.max(1, Math.ceil(JSON.stringify(l).length / 4));
}
function _h(l, a) {
  if (!l) return "Context usage appears after the first AI response.";
  const s = l.promptTokens + l.completionTokens, d = l.estimated ? "estimated" : "API reported", w = a > 0 ? ` · ${Math.min(100, Math.round(s / a * 100))}% of ${a.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${l.promptTokens.toLocaleString()} input + ${l.completionTokens.toLocaleString()} output tokens (${d})${w} · session: ${l.sessionTokens.toLocaleString()}`;
}
function Ph(l) {
  return l.filter((a) => a.kind !== "execution").slice(0, -12).map((a) => `${a.role}: ${a.content.replace(/\s+/g, " ").slice(0, 240)}`).join(`
`).slice(-12e3);
}
function il(l) {
  return l >= 1024 * 1024 * 1024 ? `${(l / 1024 / 1024 / 1024).toFixed(1)} GiB` : l >= 1024 * 1024 ? `${(l / 1024 / 1024).toFixed(1)} MiB` : l >= 1024 ? `${(l / 1024).toFixed(1)} KiB` : `${l} bytes`;
}
function dd(l) {
  return (l == null ? void 0 : l.files.reduce((a, s) => a + s.size, 0)) || 0;
}
function Nh() {
  const l = window.OMERO_ANALYSIS_CHAT, a = Oe.useMemo(() => new Lp(l), [l]), s = Oe.useMemo(() => new kh(l.runtimeBase), [l]), [d, w] = Oe.useState(null), m = Oe.useRef(null), [N, _] = Oe.useState([]), [j, $] = Oe.useState([]), [C, T] = Oe.useState(od), [F, re] = Oe.useState(""), [ue, Q] = Oe.useState(!1), [Y, Te] = Oe.useState(!1), [ke, R] = Oe.useState("Preparing project…"), [ee, ge] = Oe.useState(!1), [pe, he] = Oe.useState(null), [le, te] = Oe.useState({
    inputs: !0,
    outputs: !0,
    scripts: !0,
    snapshots: !1
  }), [Re, _e] = Oe.useState(null), [je, ze] = Oe.useState({
    percent: 0,
    message: "Preparing the browser workspace…"
  }), [Le, Ne] = Oe.useState({ usage: 0, quota: 0 }), ve = Oe.useRef(null), se = Oe.useRef(null), O = Oe.useRef(null), B = Oe.useRef(null), U = Oe.useRef(/* @__PURE__ */ new Set());
  m.current = d;
  const v = (d == null ? void 0 : d.project) || null, P = (d == null ? void 0 : d.chats) || [], V = P.find((c) => c.id === (v == null ? void 0 : v.activeChatId)) || P[0] || null, b = ((d == null ? void 0 : d.files) || []).filter((c) => c.source !== "result"), Z = ((d == null ? void 0 : d.files) || []).filter(
    (c) => c.source === "result" && c.chatId === (V == null ? void 0 : V.id)
  ), ae = b.filter((c) => c.state !== "ready"), me = !!V && Y && ae.length === 0 && !!(C.apiKey && C.model) && !ue, ye = ue ? "Analysis in progress — wait for the answer or press Stop…" : ae.some((c) => c.state === "failed" || c.state === "missing") ? "Chat is blocked — retry, reselect, or remove the missing data file…" : ae.length ? "Downloading selected data — chat will unlock when every file is ready…" : Y ? !C.apiKey || !C.model ? "Configure the AmsterdamUMC deployment and API key before asking a question…" : "Ask a question about the loaded data…" : `${je.message} (${Math.round(je.percent)}%) — please wait…`;
  Oe.useEffect(() => {
    const c = se.current;
    if (!c) return;
    const p = requestAnimationFrame(() => {
      c.scrollTo({ top: c.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(p);
  }, [V == null ? void 0 : V.messages, d == null ? void 0 : d.executions, d == null ? void 0 : d.files]), Oe.useEffect(() => {
    if (!pe) return;
    const c = () => he(null), p = (E) => {
      E.key === "Escape" && c();
    };
    return window.addEventListener("click", c), window.addEventListener("blur", c), window.addEventListener("resize", c), window.addEventListener("keydown", p), () => {
      window.removeEventListener("click", c), window.removeEventListener("blur", c), window.removeEventListener("resize", c), window.removeEventListener("keydown", p);
    };
  }, [pe]), Oe.useEffect(() => {
    let c = !0;
    return (async () => {
      const [p, E] = await Promise.all([
        jd(rd),
        fh(l.context)
      ]);
      if (!c) return;
      p && T({ ...od, ...p }), await a.connect();
      let A = await xe(E);
      c && (w(A), m.current = A, _(await na(l.context)), $(await a.listSnapshots()), await Ct(A.files), c && (Te(!0), ze({ percent: 100, message: "Browser Python is ready" }), R("Ready — analysis runs locally in this browser"), Ne(await rl())));
    })().catch((p) => {
      c && (R(`Project failed: ${String(p)}`), ze({ percent: 0, message: `Project failed: ${String(p)}` }));
    }), () => {
      c = !1, s.dispose();
    };
  }, [l, a, s]);
  async function xe(c) {
    var X;
    let p = c;
    const E = new Map(
      p.files.filter((q) => q.annotationId).map((q) => [q.annotationId, q])
    ), A = ((X = l.context) == null ? void 0 : X.selected_attachments) || [];
    for (const q of A) {
      if (E.has(q.annotation_id)) continue;
      const de = {
        id: It(),
        projectId: p.project.id,
        name: q.name,
        logicalPath: `${p.project.rootPath}/inputs/${q.annotation_id}--${q.name}`,
        type: q.mimetype,
        size: q.size,
        sha256: "",
        source: "omero",
        state: "loading",
        annotationId: q.annotation_id,
        fileId: q.file_id,
        createdAt: $e()
      };
      p = { ...p, files: [...p.files, de] }, E.set(q.annotation_id, de);
    }
    const D = p.files.filter(
      (q) => q.source === "omero" && q.annotationId && (!q.data || q.state !== "ready")
    );
    for (let q = 0; q < D.length; q += 1) {
      const de = D[q];
      ze({
        percent: Math.round(q / Math.max(1, D.length) * 90),
        message: `Downloading ${q + 1} of ${D.length} OMERO inputs…`
      });
      try {
        const lt = {
          annotation_id: de.annotationId,
          file_id: de.fileId || 0,
          name: de.name,
          mimetype: de.type,
          size: de.size,
          kind: "attachment",
          supported: !0
        }, Pe = await a.download(lt), Ae = await sn(Pe);
        if (de.sha256 && de.sha256 !== Ae)
          throw new Error(
            `OMERO input ${de.name} no longer matches the snapshot hash`
          );
        const De = {
          ...de,
          data: Pe,
          size: Pe.byteLength,
          sha256: Ae,
          state: "ready",
          error: void 0
        };
        p = {
          ...p,
          files: p.files.map((Ke) => Ke.id === de.id ? De : Ke)
        }, await nl(De);
      } catch (lt) {
        const Pe = { ...de, state: "failed", error: String(lt) };
        p = {
          ...p,
          files: p.files.map((Ae) => Ae.id === de.id ? Pe : Ae)
        }, await nl(Pe);
      }
    }
    return await Hr(p), p;
  }
  function qe(c) {
    ze(c), R(c.message);
  }
  async function Ct(c) {
    Te(!1), ze({ percent: 1, message: "Starting browser Python…" }), await s.start(
      c.filter((p) => p.source !== "result" && p.state === "ready"),
      qe
    );
  }
  async function Ze(c, p) {
    await Ct(c), Te(!0), ze({ percent: 100, message: "Browser Python is ready" }), R(p);
  }
  function ht(c) {
    const p = m.current;
    if (p) {
      const E = { ...p, project: c };
      m.current = E, w(E);
    }
    td(c);
  }
  function _t(c) {
    const p = m.current;
    if (p) {
      const E = {
        ...p,
        chats: p.chats.map((A) => A.id === c.id ? c : A)
      };
      m.current = E, w(E);
    }
    ta(c);
  }
  function cn(c, p) {
    const E = m.current;
    if (!E) return;
    const A = E.chats.find((q) => q.id === c);
    if (!A) return;
    const D = { ...A, messages: [...A.messages, p], updatedAt: $e() }, X = {
      ...E,
      chats: E.chats.map((q) => q.id === c ? D : q)
    };
    m.current = X, w(X), ta(D);
  }
  function kn(c) {
    const p = m.current;
    if (!p) return;
    const E = p.executions.some((D) => D.id === c.id), A = {
      ...p,
      executions: E ? p.executions.map((D) => D.id === c.id ? c : D) : [...p.executions, c]
    };
    m.current = A, w(A), lh(c);
  }
  function Gt(c) {
    if (!c.length) return;
    const p = m.current;
    if (!p) return;
    const E = new Set(c.map((D) => D.id)), A = {
      ...p,
      files: [...p.files.filter((D) => !E.has(D.id)), ...c]
    };
    m.current = A, w(A), c.forEach((D) => void nl(D));
  }
  async function Gn(c) {
    T(c), await Ed(rd, c);
  }
  async function Qr(c) {
    if (!c || !d) return;
    const p = [];
    let E = dd(d);
    for (const D of Array.from(c)) {
      if (!jh.test(D.name)) {
        R(`${D.name} is not a supported tabular data file`);
        continue;
      }
      if (D.size > Jc) {
        R(`${D.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (E += D.size, E > Tp) {
        R("The project would exceed 512 MiB");
        break;
      }
      const X = await D.arrayBuffer(), q = await sn(X);
      if ([...d.files, ...p].some(
        (de) => de.sha256 === q && de.size === X.byteLength
      )) {
        R(`${D.name} matches a file already stored in this project`);
        continue;
      }
      p.push({
        id: It(),
        projectId: d.project.id,
        name: D.name,
        logicalPath: `${d.project.rootPath}/inputs/${D.name}`,
        type: D.type || cd(D.name),
        size: X.byteLength,
        sha256: q,
        source: "local",
        state: "ready",
        data: X,
        createdAt: $e()
      });
    }
    const A = [...d.files, ...p];
    Gt(p), await Ze(A, "Local inputs added; browser Python is ready"), Ne(await rl());
  }
  async function jn(c) {
    if (!d) return;
    const p = d.files.find((D) => D.id === c);
    if (!p) return;
    const E = d.files.filter((D) => D.id !== c), A = { ...d, files: E };
    m.current = A, w(A), await sh(c), p.source !== "result" && await Ze(E, "Input removed; browser Python was reset"), Ne(await rl());
  }
  async function En(c) {
    if (!d) return;
    const p = d.files.find((A) => A.id === c);
    if (!(p != null && p.annotationId)) return;
    const E = { ...p, state: "loading", error: void 0 };
    Gt([E]);
    try {
      const A = await a.download({
        annotation_id: p.annotationId,
        file_id: p.fileId || 0,
        name: p.name,
        mimetype: p.type,
        size: p.size,
        kind: "attachment",
        supported: !0
      }), D = {
        ...p,
        data: A,
        size: A.byteLength,
        sha256: await sn(A),
        state: "ready",
        error: void 0
      }, X = d.files.map((q) => q.id === p.id ? D : q);
      Gt([D]), await Ze(X, "OMERO input restored; project ready");
    } catch (A) {
      Gt([{ ...p, state: "failed", error: String(A) }]);
    }
  }
  async function Cn() {
    if (!d) return;
    const c = fa(d.project.id), p = { ...d.project, activeChatId: c.id, updatedAt: $e() }, E = { ...d, project: p, chats: [...d.chats, c] };
    m.current = E, w(E), await Promise.all([ta(c), td(p)]), _e(null), U.current.clear(), await s.beginTurn();
  }
  function Vo(c) {
    if (!d) return;
    const p = d.chats.find((A) => A.id === c);
    p != null && p.archived && _t({ ...p, archived: !1, updatedAt: $e() });
    const E = { ...d.project, activeChatId: c, updatedAt: $e() };
    ht(E), _e(null);
  }
  function Zn(c) {
    var E;
    const p = (E = window.prompt("Chat name", c.title)) == null ? void 0 : E.trim();
    p && _t({ ...c, title: p.slice(0, 100), updatedAt: $e() });
  }
  function mt(c, p, E) {
    c.preventDefault(), c.stopPropagation();
    const A = 210, D = Math.max(60, E.length * 34 + 34);
    he({
      x: Math.min(c.clientX, window.innerWidth - A - 8),
      y: Math.min(c.clientY, window.innerHeight - D - 8),
      title: p,
      actions: E
    });
  }
  async function yr() {
    v && (he(null), await Kr(v.id));
  }
  async function gr(c) {
    var Ke, be;
    if (c.source === "omero") {
      R("OMERO attachment names are canonical and cannot be renamed locally");
      return;
    }
    const p = (Ke = window.prompt("File name", c.name)) == null ? void 0 : Ke.trim();
    if (!p || p === c.name) return;
    let E = p.replace(/[\\/]/g, "_").slice(0, 180);
    if (!E || E === "." || E === "..") return;
    const A = ((be = c.name.match(/(\.[^.]+)$/)) == null ? void 0 : be[1]) || "";
    if (A && !E.toLowerCase().endsWith(A.toLowerCase())) {
      if (/\.[^.]+$/.test(E)) {
        R(`Keep the ${A} extension when renaming ${c.name}`);
        return;
      }
      E += A;
    }
    const D = m.current;
    if (!D) return;
    if (D.files.filter(
      (Me) => Me.id !== c.id && Me.source === c.source && Me.chatId === c.chatId
    ).some((Me) => Me.name.toLowerCase() === E.toLowerCase())) {
      R(`A file named ${E} already exists in this folder`);
      return;
    }
    const q = c.name.replace(/\.[^.]+$/, ""), de = E.replace(/\.[^.]+$/, ""), lt = c.source === "result" && /\.(png|svg|csv)$/i.test(c.name) ? /* @__PURE__ */ new Set(["png", "svg", "csv"]) : null, Pe = D.files.map((Me) => {
      var fe;
      let ne = Me.id === c.id ? E : null;
      return !ne && lt && Me.chatId === c.chatId && Me.executionId === c.executionId && Me.name.replace(/\.[^.]+$/, "") === q && lt.has(((fe = Me.name.split(".").at(-1)) == null ? void 0 : fe.toLowerCase()) || "") && (ne = `${de}.${Me.name.split(".").at(-1)}`), ne ? {
        ...Me,
        name: ne,
        logicalPath: Me.logicalPath.replace(/[^/]+$/, ne)
      } : Me;
    }), Ae = Pe.filter((Me, ne) => Me !== D.files[ne]), De = { ...D, files: Pe };
    m.current = De, w(De), await Promise.all(Ae.map(nl)), c.source === "local" ? await Ze(Pe, `Renamed input to ${E}; browser Python is ready`) : R(
      Ae.length > 1 ? `Renamed ${c.name} and its paired plot data` : `Renamed ${c.name} to ${E}`
    );
  }
  function bn(c) {
    if (!d || d.chats.filter((A) => !A.archived).length <= 1) {
      R("Create another chat before archiving this one");
      return;
    }
    const p = { ...c, archived: !0, updatedAt: $e() }, E = d.chats.find((A) => A.id !== c.id && !A.archived);
    _t(p), ht({ ...d.project, activeChatId: E.id, updatedAt: $e() });
  }
  async function Kr(c) {
    const p = await ph(c);
    if (!p) return;
    const E = await xe(p);
    w(E), m.current = E, await Ze(E.files, "Project loaded");
  }
  async function Zt(c, p, E, A = !1) {
    const D = m.current;
    if (!D) return Yt("Project is not ready");
    const X = c.replace(/\r\n/g, `
`).trimEnd(), q = await sn(X), de = D.files.filter((ne) => ne.source !== "result" && ne.state === "ready").map((ne) => ne.sha256).sort(), lt = await sn(
      `${q}|${de.join(",")}|${ad}|plotCsv=${D.project.plotCsv}`
    ), Pe = D.executions.filter((ne) => ne.cacheKey === lt && ne.status !== "running").sort((ne, fe) => fe.createdAt.localeCompare(ne.createdAt))[0];
    if (Pe && !A) {
      const ne = {
        ...Pe,
        id: It(),
        chatId: p,
        promptId: E,
        status: Pe.status === "success" || Pe.status === "reused" ? "reused" : "failed",
        reusedFrom: Pe.id,
        createdAt: $e()
      };
      return kn(ne), cn(p, {
        id: It(),
        role: "assistant",
        content: ne.status === "reused" ? "Reused a previous successful local Python run because its code and inputs are unchanged." : "Skipped unchanged Python that already failed; AmsterdamUMC must correct the code.",
        kind: "execution",
        executionId: ne.id,
        createdAt: $e()
      }), ne.status === "reused" ? JSON.stringify({
        reused: !0,
        execution_id: Pe.id,
        stdout: Pe.stdout,
        stderr: Pe.stderr,
        preview: Pe.preview,
        generated_files: Pe.outputFileIds.map((fe) => D.files.find((Se) => Se.id === fe)).filter(Boolean).map((fe) => ({ name: fe.name, size: fe.size, type: fe.type }))
      }) : Yt(
        `Identical code already failed:
${Pe.stderr || Pe.stdout}. Modify the code before trying again.`
      );
    }
    const Ae = {
      id: It(),
      projectId: D.project.id,
      chatId: p,
      promptId: E,
      code: X,
      codeHash: q,
      cacheKey: lt,
      status: "running",
      stdout: "",
      stderr: "",
      outputFileIds: [],
      missingPlotCsv: [],
      inputHashes: de,
      runtimeVersion: ad,
      model: C.model,
      createdAt: $e()
    };
    kn(Ae), cn(p, {
      id: It(),
      role: "assistant",
      content: "Python execution",
      kind: "execution",
      executionId: Ae.id,
      createdAt: $e()
    });
    let De;
    try {
      De = await s.run(X);
    } catch (ne) {
      const fe = String(ne instanceof Error ? ne.message : ne).slice(0, ll), Se = { ...Ae, status: "failed", stderr: fe };
      return kn(Se), R("Python error sent to AmsterdamUMC; waiting for corrected code…"), Yt(ne);
    }
    const Ke = [];
    for (const ne of De.files) {
      const fe = It();
      Ke.push({
        id: fe,
        projectId: D.project.id,
        chatId: p,
        executionId: Ae.id,
        name: ne.name,
        logicalPath: `${D.project.rootPath}/chats/${p}/outputs/${Ae.id}/${ne.name}`,
        type: ne.type,
        size: ne.data.byteLength,
        sha256: await sn(ne.data),
        source: "result",
        state: "ready",
        data: ne.data,
        createdAt: $e()
      }), U.current.add(ne.name);
    }
    Gt(Ke);
    const be = D.project.plotCsv ? Array.from(U.current).filter((ne) => /\.(png|svg)$/i.test(ne)).filter((ne) => !U.current.has(ne.replace(/\.(png|svg)$/i, ".csv"))) : [], Me = {
      ...Ae,
      status: be.length ? "incomplete" : "success",
      stdout: De.stdout,
      stderr: De.stderr,
      preview: De.preview,
      outputFileIds: Ke.map((ne) => ne.id),
      missingPlotCsv: be
    };
    if (kn(Me), !be.length) {
      const ne = m.current;
      for (const fe of (ne == null ? void 0 : ne.executions) || []) {
        if (fe.chatId !== p || fe.promptId !== E || !fe.missingPlotCsv.length) continue;
        const Se = fe.missingPlotCsv.filter(
          (xr) => !U.current.has(xr.replace(/\.(png|svg)$/i, ".csv"))
        );
        Se.length !== fe.missingPlotCsv.length && kn({
          ...fe,
          status: Se.length ? "incomplete" : "success",
          missingPlotCsv: Se
        });
      }
    }
    return R("Python completed locally; continuing the analysis…"), be.length ? Yt(
      `Plot data CSV required. Create ${be.map((ne) => ne.replace(/\.(png|svg)$/i, ".csv")).join(", ")} containing the data used for the plot. Do not regenerate unrelated analysis.`
    ) : Op(De);
  }
  async function er(c, p, E) {
    let A = {};
    try {
      A = JSON.parse(c.function.arguments || "{}");
    } catch (X) {
      return Yt(`Invalid JSON tool arguments: ${String(X)}`);
    }
    const D = m.current;
    if (!D) return Yt("Project is not ready");
    if (c.function.name === "list_workspace_files") return Ch(D.files);
    if (c.function.name === "reset_python")
      try {
        return await s.beginTurn(), U.current.clear(), "Python state reset; canonical project inputs remain available.";
      } catch (X) {
        return Yt(X);
      }
    if (c.function.name === "list_saved_scripts")
      return JSON.stringify(D.scripts.map((X) => ({
        id: X.id,
        name: X.name,
        description: X.description,
        current_version: X.currentVersion,
        updated_at: X.updatedAt
      })));
    if (c.function.name === "read_saved_script") {
      const X = D.scripts.find((de) => de.id === A.script_id);
      if (!X) return Yt("Saved script was not found");
      const q = X.versions.find((de) => de.version === X.currentVersion);
      return q ? JSON.stringify({ id: X.id, name: X.name, version: q.version, code: q.code }) : Yt("Saved script has no readable current version");
    }
    if (c.function.name === "run_saved_script") {
      const X = D.scripts.find((de) => de.id === A.script_id), q = X == null ? void 0 : X.versions.find((de) => de.version === X.currentVersion);
      return q ? Zt(q.code, p, E) : Yt("Saved script was not found");
    }
    return c.function.name !== "run_python" || typeof A.code != "string" ? Yt(`Unsupported or invalid tool call: ${c.function.name}`) : Zt(A.code, p, E);
  }
  async function Wo() {
    var De, Ke, be, Me, ne, fe, Se, xr;
    const c = F.trim(), p = m.current, E = p == null ? void 0 : p.chats.find((nt) => nt.id === p.project.activeChatId);
    if (!c || !me || !p || !E) return;
    re(""), Q(!0), ve.current = new AbortController(), U.current.clear(), await s.beginTurn();
    const A = It(), D = {
      id: A,
      role: "user",
      content: c,
      createdAt: $e()
    };
    cn(E.id, D);
    let X = {
      ...E,
      messages: [...E.messages, D],
      updatedAt: $e()
    };
    E.messages.filter((nt) => nt.role === "user").length === 0 && (X = { ...X, title: Eh(c) }, _t(X));
    const q = C.contextWindow > 0 ? Math.floor(C.contextWindow * 0.6) : 24e3, de = X.messages.filter((nt) => nt.kind !== "execution");
    ra(de) > q && (X = { ...X, summary: Ph(de), updatedAt: $e() }, _t(X));
    const lt = `${Rp}

Project root: ${p.project.rootPath}
The user has ${p.scripts.length} saved scripts. ${p.project.plotCsv ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data." : "Plot CSV mode is OFF."}`, Pe = de.slice(-12), Ae = [
      { role: "system", content: lt },
      ...X.summary ? [{ role: "system", content: `Earlier conversation summary:
${X.summary}` }] : [],
      ...Pe.map((nt) => ({ role: nt.role, content: nt.content }))
    ];
    ((De = Ae.at(-1)) == null ? void 0 : De.content) !== c && Ae.push({ role: "user", content: c });
    try {
      for (let nt = 0; nt < 8; nt += 1) {
        const qo = ra(Ae), bt = await Ip(C, Ae, ve.current.signal), Bt = (Ke = bt.choices[0]) == null ? void 0 : Ke.message;
        if (!Bt) throw new Error("AmsterdamUMC returned no response");
        const br = ((be = bt.usage) == null ? void 0 : be.prompt_tokens) ?? qo, or = ((Me = bt.usage) == null ? void 0 : Me.completion_tokens) ?? ra(Bt.content || Bt.tool_calls || ""), Pt = ((ne = bt.usage) == null ? void 0 : ne.total_tokens) ?? br + or;
        if (_e((Nn) => ({
          promptTokens: br,
          completionTokens: or,
          totalTokens: Pt,
          sessionTokens: ((Nn == null ? void 0 : Nn.sessionTokens) || 0) + Pt,
          estimated: !bt.usage
        })), Ae.push({ role: "assistant", content: Bt.content, tool_calls: Bt.tool_calls }), Bt.content && cn(E.id, {
          id: It(),
          role: "assistant",
          content: Bt.content,
          createdAt: $e()
        }), !((fe = Bt.tool_calls) != null && fe.length)) break;
        for (const Nn of Bt.tool_calls) {
          const Nt = await er(Nn, E.id, A);
          Ae.push({ role: "tool", tool_call_id: Nn.id, content: Nt });
        }
        if (nt === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (nt) {
      (Se = ve.current) != null && Se.signal.aborted || cn(E.id, {
        id: It(),
        role: "assistant",
        content: String(nt),
        kind: "error",
        createdAt: $e()
      });
    } finally {
      (xr = ve.current) != null && xr.signal.aborted || R("Ready — analysis runs locally in this browser"), ve.current = null, Q(!1), Ne(await rl());
    }
  }
  function Ho() {
    var c, p;
    (c = ve.current) == null || c.abort(), s.stop(), Q(!1), Ze(((p = m.current) == null ? void 0 : p.files) || [], "Ready — analysis runs locally in this browser");
  }
  async function Qo(c) {
    var Me, ne;
    const p = m.current;
    if (!p || !["success", "reused"].includes(c.status)) return;
    const E = p.chats.find((fe) => fe.id === c.chatId), A = E == null ? void 0 : E.messages.find((fe) => fe.id === c.promptId), D = p.executions.filter(
      (fe) => fe.chatId === c.chatId && fe.promptId === c.promptId && ["success", "incomplete"].includes(fe.status)
    ).sort((fe, Se) => fe.createdAt.localeCompare(Se.createdAt)), X = Array.from(new Set(D.map((fe) => fe.code))).join(
      `

# Continued analysis / automatic repair
`
    ) || c.code, q = await sn(X), de = `${ol((A == null ? void 0 : A.content) || "analysis-script")}.py`, lt = (Me = window.prompt("Script filename", de)) == null ? void 0 : Me.trim();
    if (!lt) return;
    const Pe = `${ol(lt.replace(/\.py$/i, ""))}.py`, Ae = ((ne = window.prompt(
      "Script description",
      (A == null ? void 0 : A.content.slice(0, 180)) || "Reusable Analysis Chat workflow"
    )) == null ? void 0 : ne.trim()) || "", De = p.scripts.find((fe) => fe.name.toLowerCase() === Pe.toLowerCase()), Ke = De ? {
      ...De,
      description: Ae,
      currentVersion: De.currentVersion + 1,
      versions: [...De.versions, {
        version: De.currentVersion + 1,
        code: X,
        codeHash: q,
        executionId: c.id,
        createdAt: $e()
      }],
      updatedAt: $e()
    } : {
      id: It(),
      projectId: p.project.id,
      name: Pe,
      description: Ae,
      currentVersion: 1,
      versions: [{
        version: 1,
        code: X,
        codeHash: q,
        executionId: c.id,
        createdAt: $e()
      }],
      createdAt: $e(),
      updatedAt: $e()
    }, be = m.current;
    if (be) {
      const fe = {
        ...be,
        scripts: De ? be.scripts.map((Se) => Se.id === Ke.id ? Ke : Se) : [...be.scripts, Ke]
      };
      m.current = fe, w(fe);
    }
    await nd(Ke), R(`Saved ${Ke.name} version ${Ke.currentVersion}`);
  }
  async function Ko(c) {
    const p = m.current;
    if (!(p != null && p.project.activeChatId)) return;
    const E = c.versions.find((D) => D.version === c.currentVersion);
    if (!E) return;
    Q(!0), U.current.clear(), await s.beginTurn();
    const A = It();
    cn(p.project.activeChatId, {
      id: A,
      role: "user",
      content: `Run saved script ${c.name} version ${c.currentVersion}`,
      createdAt: $e()
    });
    try {
      await Zt(E.code, p.project.activeChatId, A, !0), R(`Ran ${c.name} locally`);
    } finally {
      Q(!1);
    }
  }
  function Xr(c) {
    var D;
    const p = (D = window.prompt("Script filename", c.name)) == null ? void 0 : D.trim();
    if (!p) return;
    const E = { ...c, name: `${ol(p.replace(/\.py$/i, ""))}.py`, updatedAt: $e() }, A = m.current;
    if (A) {
      const X = {
        ...A,
        scripts: A.scripts.map((q) => q.id === c.id ? E : q)
      };
      m.current = X, w(X);
    }
    nd(E);
  }
  function tr(c, p, E) {
    const A = (p instanceof Uint8Array, p), D = URL.createObjectURL(new Blob([A], { type: E })), X = document.createElement("a");
    X.href = D, X.download = c, X.click(), setTimeout(() => URL.revokeObjectURL(D), 1e3);
  }
  function wr(c) {
    c.data && tr(c.name, c.data, c.type);
  }
  function Yr(c) {
    const p = c.versions.find((E) => E.version === c.currentVersion);
    p && tr(c.name, new TextEncoder().encode(p.code), "text/x-python");
  }
  async function Jr(c) {
    if (confirm(`Attach ${c.name} to the selected OMERO object?`))
      try {
        const p = await a.attach(c);
        R(`Attached ${p.name} as FileAnnotation ${p.annotation_id}`);
      } catch (p) {
        R(`Attach failed: ${String(p)}`);
      }
  }
  async function dn() {
    var p;
    const c = m.current;
    if (!c) throw new Error("Project is not ready");
    return yh(
      c,
      ((p = l.context) == null ? void 0 : p.max_snapshot_bytes) ?? ud
    );
  }
  async function _n() {
    try {
      const c = await dn();
      tr(c.filename, c.data, "application/zip"), R(
        c.omittedLocalInputs.length ? `Project downloaded; omitted local inputs: ${c.omittedLocalInputs.join(", ")}` : "Complete project downloaded"
      );
    } catch (c) {
      R(`Project export failed: ${String(c)}`);
    }
  }
  async function Xo() {
    if (a.canUpload)
      try {
        const c = await dn();
        if (c.omittedLocalInputs.length && !confirm(
          `The snapshot is too large to include these local inputs:
${c.omittedLocalInputs.join(`
`)}

Save the snapshot without them?`
        )) return;
        const p = await a.uploadSnapshot(c.filename, c.data);
        $((E) => [...E, p]), R(`Saved project snapshot as FileAnnotation ${p.annotation_id}`);
      } catch (c) {
        R(`OMERO project snapshot failed: ${String(c)}`);
      }
  }
  async function Yo(c) {
    var p;
    if (c)
      try {
        const E = ((p = l.context) == null ? void 0 : p.max_snapshot_bytes) ?? ud;
        if (c.size > E)
          throw new Error(
            `Project archive exceeds the configured ${Math.floor(E / 1024 / 1024)} MiB limit`
          );
        const A = await sd(await c.arrayBuffer());
        if (l.context && (A.project.objectType !== l.context.object_type || A.project.objectId !== l.context.object_id))
          throw new Error("Project snapshot belongs to a different OMERO object");
        await Hr(A);
        const D = await xe(A);
        w(D), m.current = D, _(await na(l.context)), await Ze(D.files, "Imported project restored");
      } catch (E) {
        R(`Project import failed: ${String(E)}`);
      } finally {
        O.current && (O.current.value = "");
      }
  }
  async function qr(c) {
    try {
      R(`Downloading ${c.name}…`);
      const p = await sd(await a.downloadSnapshot(c));
      if (l.context && (p.project.objectType !== l.context.object_type || p.project.objectId !== l.context.object_id))
        throw new Error("Project snapshot belongs to a different OMERO object");
      await Hr(p);
      const E = await xe(p);
      w(E), m.current = E, _(await na(l.context)), await Ze(E.files, "OMERO project snapshot restored");
    } catch (p) {
      R(`Snapshot restore failed: ${String(p)}`);
    }
  }
  function Jo() {
    v && ht({ ...v, plotCsv: !v.plotCsv, updatedAt: $e() });
  }
  function Gr(c) {
    const p = [];
    return c.source === "local" && p.push({ label: "Rename", run: () => void gr(c) }), (c.state === "failed" || c.state === "missing") && c.annotationId && p.push({ label: "Retry download", run: () => void En(c.id) }), c.state === "missing" && c.source === "local" && p.push({
      label: "Reselect file",
      run: () => {
        var E;
        return (E = document.getElementById(`reselect-${c.id}`)) == null ? void 0 : E.click();
      }
    }), p.push({
      label: "Remove from project",
      danger: !0,
      run: () => void jn(c.id)
    }), p;
  }
  function Sr(c) {
    return [
      { label: "Rename", run: () => void gr(c) },
      { label: "Download", run: () => wr(c) },
      ...a.canUpload ? [{ label: "Attach to OMERO", run: () => void Jr(c) }] : [],
      {
        label: "Remove from project",
        danger: !0,
        run: () => void jn(c.id)
      }
    ];
  }
  function Zr(c) {
    return [
      { label: "Run", run: () => void Ko(c) },
      { label: "Rename", run: () => Xr(c) },
      { label: "Download", run: () => Yr(c) }
    ];
  }
  function Pn(c) {
    return [{
      label: "Resume as new project",
      run: () => void qr(c)
    }];
  }
  if (!d || !v || !V)
    return /* @__PURE__ */ g.jsx("main", { className: "app-shell", children: /* @__PURE__ */ g.jsx("div", { className: "boot-message", children: ke }) });
  const nr = Le.quota ? Math.round(Le.usage / Le.quota * 100) : 0;
  return /* @__PURE__ */ g.jsxs("main", { className: "app-shell", children: [
    /* @__PURE__ */ g.jsxs("header", { className: "project-header", children: [
      /* @__PURE__ */ g.jsxs("div", { children: [
        /* @__PURE__ */ g.jsx("h1", { children: "OMERO.AnalysisChat" }),
        /* @__PURE__ */ g.jsx("p", { children: v.rootPath })
      ] }),
      /* @__PURE__ */ g.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ g.jsxs("label", { className: "csv-toggle", title: "Require a matching CSV for every generated plot", children: [
          /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: v.plotCsv, onChange: Jo }),
          "Plot + CSV"
        ] }),
        /* @__PURE__ */ g.jsx("span", { className: "privacy-badge", children: "Source data stay in this browser" }),
        /* @__PURE__ */ g.jsx("button", { onClick: () => ge(!ee), children: "AI settings" })
      ] })
    ] }),
    ee && /* @__PURE__ */ g.jsxs("section", { className: "settings-card", children: [
      /* @__PURE__ */ g.jsx("h2", { children: "AmsterdamUMC" }),
      /* @__PURE__ */ g.jsx("p", { className: "warning", children: "The API key is stored unencrypted in this browser profile. It is never included in project snapshots." }),
      /* @__PURE__ */ g.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ g.jsx("input", { value: C.model, onChange: (c) => void Gn({ ...C, model: c.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ g.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ g.jsx("input", { type: "password", value: C.apiKey, onChange: (c) => void Gn({ ...C, apiKey: c.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ g.jsxs("label", { children: [
        "Model context window (optional)",
        /* @__PURE__ */ g.jsx("input", { type: "number", min: "0", value: C.contextWindow || "", onChange: (c) => void Gn({ ...C, contextWindow: Math.max(0, Number(c.target.value) || 0) }) })
      ] }),
      /* @__PURE__ */ g.jsx("p", { children: "Temperature is fixed at 1." }),
      /* @__PURE__ */ g.jsx("button", { onClick: () => void Gn({ ...C, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ g.jsxs("div", { className: "project-toolbar", children: [
      /* @__PURE__ */ g.jsxs("label", { children: [
        "Project",
        /* @__PURE__ */ g.jsx("select", { value: v.id, onChange: (c) => void Kr(c.target.value), children: N.map((c) => /* @__PURE__ */ g.jsx("option", { value: c.id, children: c.name }, c.id)) })
      ] }),
      /* @__PURE__ */ g.jsxs("label", { children: [
        "Chat",
        /* @__PURE__ */ g.jsxs("select", { value: V.id, onChange: (c) => Vo(c.target.value), children: [
          /* @__PURE__ */ g.jsx("optgroup", { label: "Active chats", children: P.filter((c) => !c.archived).map((c) => /* @__PURE__ */ g.jsx("option", { value: c.id, children: c.title }, c.id)) }),
          P.some((c) => c.archived) && /* @__PURE__ */ g.jsx("optgroup", { label: "Archived chats", children: P.filter((c) => c.archived).map((c) => /* @__PURE__ */ g.jsxs("option", { value: c.id, children: [
            c.title,
            " (archived)"
          ] }, c.id)) })
        ] })
      ] }),
      /* @__PURE__ */ g.jsx("button", { onClick: () => void Cn(), children: "New chat" }),
      /* @__PURE__ */ g.jsx("button", { onClick: () => Zn(V), children: "Rename chat" }),
      /* @__PURE__ */ g.jsx("button", { onClick: () => bn(V), children: "Archive" }),
      /* @__PURE__ */ g.jsx("button", { onClick: () => void _n(), children: "Download project ZIP" }),
      /* @__PURE__ */ g.jsx("button", { onClick: () => {
        var c;
        return (c = O.current) == null ? void 0 : c.click();
      }, children: "Import project ZIP" }),
      /* @__PURE__ */ g.jsx("input", { ref: O, hidden: !0, type: "file", accept: ".zip,.oac.zip", onChange: (c) => {
        var p;
        return void Yo(((p = c.target.files) == null ? void 0 : p[0]) || null);
      } }),
      a.canUpload && /* @__PURE__ */ g.jsx("button", { onClick: () => void Xo(), children: "Save project to OMERO" })
    ] }),
    /* @__PURE__ */ g.jsxs("div", { className: "workspace", children: [
      /* @__PURE__ */ g.jsxs("aside", { className: "project-tree", children: [
        /* @__PURE__ */ g.jsxs(
          "div",
          {
            className: "file-browser-heading",
            onContextMenu: (c) => mt(c, v.name, [
              { label: "Add files", run: () => {
                var p;
                return (p = B.current) == null ? void 0 : p.click();
              } },
              { label: "New chat", run: () => void Cn() },
              { label: "Rename current chat", run: () => Zn(V) },
              { label: "Refresh", run: () => void yr() }
            ]),
            children: [
              /* @__PURE__ */ g.jsxs("div", { children: [
                /* @__PURE__ */ g.jsx("h2", { children: "Project files" }),
                /* @__PURE__ */ g.jsxs("small", { children: [
                  il(dd(d)),
                  " · browser ",
                  nr || "?",
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ g.jsx(
                "button",
                {
                  className: "browser-more",
                  "aria-label": "Project actions",
                  title: "Project actions",
                  onClick: (c) => mt(c, v.name, [
                    { label: "Add files", run: () => {
                      var p;
                      return (p = B.current) == null ? void 0 : p.click();
                    } },
                    { label: "New chat", run: () => void Cn() },
                    { label: "Rename current chat", run: () => Zn(V) },
                    { label: "Refresh", run: () => void yr() }
                  ]),
                  children: "⋮"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ g.jsxs("div", { className: "file-browser-toolbar", role: "toolbar", "aria-label": "Project file actions", children: [
          /* @__PURE__ */ g.jsx("button", { title: "Add files", "aria-label": "Add files", onClick: () => {
            var c;
            return (c = B.current) == null ? void 0 : c.click();
          }, children: "＋" }),
          /* @__PURE__ */ g.jsx("button", { title: "Refresh project", "aria-label": "Refresh project", onClick: () => void yr(), children: "↻" }),
          /* @__PURE__ */ g.jsx(
            "button",
            {
              title: "Collapse all folders",
              "aria-label": "Collapse all folders",
              onClick: () => te({ inputs: !1, outputs: !1, scripts: !1, snapshots: !1 }),
              children: "⌃"
            }
          ),
          /* @__PURE__ */ g.jsx("input", { ref: B, hidden: !0, type: "file", multiple: !0, onChange: (c) => void Qr(c.target.files) })
        ] }),
        /* @__PURE__ */ g.jsxs("div", { className: "browser-path", title: v.rootPath, children: [
          /* @__PURE__ */ g.jsx("span", { className: "browser-icon root", "aria-hidden": "true" }),
          /* @__PURE__ */ g.jsx("span", { children: v.rootPath })
        ] }),
        /* @__PURE__ */ g.jsxs("div", { className: "browser-columns", children: [
          /* @__PURE__ */ g.jsx("span", { children: "Name" }),
          /* @__PURE__ */ g.jsx("span", { children: "Size" })
        ] }),
        nr >= 75 && /* @__PURE__ */ g.jsxs("p", { className: "quota-warning", children: [
          "Browser storage is ",
          nr,
          "% full. Archive or download old projects."
        ] }),
        /* @__PURE__ */ g.jsxs(
          "details",
          {
            open: le.inputs,
            className: "browser-folder",
            onToggle: (c) => {
              const p = c.currentTarget.open;
              te((E) => ({ ...E, inputs: p }));
            },
            children: [
              /* @__PURE__ */ g.jsxs(
                "summary",
                {
                  onContextMenu: (c) => mt(c, "inputs/", [
                    { label: "Add files", run: () => {
                      var p;
                      return (p = B.current) == null ? void 0 : p.click();
                    } }
                  ]),
                  children: [
                    /* @__PURE__ */ g.jsx("span", { className: "browser-icon folder", "aria-hidden": "true" }),
                    /* @__PURE__ */ g.jsx("strong", { children: "inputs" }),
                    /* @__PURE__ */ g.jsx("small", { children: b.length })
                  ]
                }
              ),
              /* @__PURE__ */ g.jsxs("ul", { className: "browser-list", children: [
                b.map((c) => /* @__PURE__ */ g.jsxs(
                  "li",
                  {
                    className: `browser-row file-${c.state}`,
                    onContextMenu: (p) => mt(p, c.name, Gr(c)),
                    children: [
                      /* @__PURE__ */ g.jsx("span", { className: "browser-icon file", "aria-hidden": "true" }),
                      /* @__PURE__ */ g.jsxs("div", { className: "browser-name", children: [
                        /* @__PURE__ */ g.jsx("strong", { children: c.name }),
                        /* @__PURE__ */ g.jsxs("small", { children: [
                          c.source,
                          " · ",
                          c.state,
                          " · ",
                          c.sha256.slice(0, 10) || "unhashed"
                        ] }),
                        c.error && /* @__PURE__ */ g.jsx("span", { className: "browser-error", children: c.error })
                      ] }),
                      /* @__PURE__ */ g.jsx("span", { className: "browser-size", children: il(c.size) }),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          className: "browser-more",
                          "aria-label": `Actions for ${c.name}`,
                          onClick: (p) => mt(p, c.name, Gr(c)),
                          children: "⋮"
                        }
                      ),
                      c.state === "missing" && c.source === "local" && /* @__PURE__ */ g.jsx(
                        "input",
                        {
                          id: `reselect-${c.id}`,
                          hidden: !0,
                          type: "file",
                          onChange: (p) => {
                            var E;
                            return void rr(c, ((E = p.target.files) == null ? void 0 : E[0]) || null);
                          }
                        }
                      )
                    ]
                  },
                  c.id
                )),
                !b.length && /* @__PURE__ */ g.jsx("li", { className: "browser-empty", children: "No input files" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ g.jsxs(
          "details",
          {
            open: le.outputs,
            className: "browser-folder",
            onToggle: (c) => {
              const p = c.currentTarget.open;
              te((E) => ({ ...E, outputs: p }));
            },
            children: [
              /* @__PURE__ */ g.jsxs(
                "summary",
                {
                  onContextMenu: (c) => mt(c, `chats/${V.title}/`, [
                    { label: "Rename chat", run: () => Zn(V) },
                    { label: "New chat", run: () => void Cn() },
                    { label: "Archive chat", run: () => bn(V) }
                  ]),
                  children: [
                    /* @__PURE__ */ g.jsx("span", { className: "browser-icon folder", "aria-hidden": "true" }),
                    /* @__PURE__ */ g.jsxs("strong", { children: [
                      "chats/",
                      ol(V.title),
                      "/outputs"
                    ] }),
                    /* @__PURE__ */ g.jsx("small", { children: Z.length })
                  ]
                }
              ),
              /* @__PURE__ */ g.jsxs("ul", { className: "browser-list", children: [
                /* @__PURE__ */ g.jsxs("li", { className: "browser-row virtual", children: [
                  /* @__PURE__ */ g.jsx("span", { className: "browser-icon json", "aria-hidden": "true" }),
                  /* @__PURE__ */ g.jsxs("div", { className: "browser-name", children: [
                    /* @__PURE__ */ g.jsx("strong", { children: "chat.json" }),
                    /* @__PURE__ */ g.jsx("small", { children: "autosaved" })
                  ] }),
                  /* @__PURE__ */ g.jsx("span", { className: "browser-size", children: "—" })
                ] }),
                /* @__PURE__ */ g.jsxs("li", { className: "browser-row virtual", children: [
                  /* @__PURE__ */ g.jsx("span", { className: "browser-icon markdown", "aria-hidden": "true" }),
                  /* @__PURE__ */ g.jsxs("div", { className: "browser-name", children: [
                    /* @__PURE__ */ g.jsx("strong", { children: "chat.md" }),
                    /* @__PURE__ */ g.jsx("small", { children: "autosaved" })
                  ] }),
                  /* @__PURE__ */ g.jsx("span", { className: "browser-size", children: "—" })
                ] }),
                Z.map((c) => /* @__PURE__ */ g.jsxs(
                  "li",
                  {
                    className: "browser-row",
                    onDoubleClick: () => wr(c),
                    onContextMenu: (p) => mt(p, c.name, Sr(c)),
                    children: [
                      /* @__PURE__ */ g.jsx("span", { className: `browser-icon ${c.type.startsWith("image/") ? "image" : "file"}`, "aria-hidden": "true" }),
                      /* @__PURE__ */ g.jsxs("div", { className: "browser-name", children: [
                        /* @__PURE__ */ g.jsx("strong", { children: c.name }),
                        /* @__PURE__ */ g.jsxs("small", { children: [
                          c.sha256.slice(0, 10),
                          " · double-click to download"
                        ] })
                      ] }),
                      /* @__PURE__ */ g.jsx("span", { className: "browser-size", children: il(c.size) }),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          className: "browser-more",
                          "aria-label": `Actions for ${c.name}`,
                          onClick: (p) => mt(p, c.name, Sr(c)),
                          children: "⋮"
                        }
                      )
                    ]
                  },
                  c.id
                ))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ g.jsxs(
          "details",
          {
            open: le.scripts,
            className: "browser-folder",
            onToggle: (c) => {
              const p = c.currentTarget.open;
              te((E) => ({ ...E, scripts: p }));
            },
            children: [
              /* @__PURE__ */ g.jsxs("summary", { children: [
                /* @__PURE__ */ g.jsx("span", { className: "browser-icon folder", "aria-hidden": "true" }),
                /* @__PURE__ */ g.jsx("strong", { children: "scripts" }),
                /* @__PURE__ */ g.jsx("small", { children: d.scripts.length })
              ] }),
              /* @__PURE__ */ g.jsxs("ul", { className: "browser-list", children: [
                d.scripts.map((c) => /* @__PURE__ */ g.jsxs(
                  "li",
                  {
                    className: "browser-row",
                    onDoubleClick: () => void Ko(c),
                    onContextMenu: (p) => mt(p, c.name, Zr(c)),
                    children: [
                      /* @__PURE__ */ g.jsx("span", { className: "browser-icon python", "aria-hidden": "true" }),
                      /* @__PURE__ */ g.jsxs("div", { className: "browser-name", children: [
                        /* @__PURE__ */ g.jsx("strong", { children: c.name }),
                        /* @__PURE__ */ g.jsxs("small", { children: [
                          "v",
                          c.currentVersion,
                          " · ",
                          c.description || "saved Python script"
                        ] })
                      ] }),
                      /* @__PURE__ */ g.jsxs("span", { className: "browser-size", children: [
                        "v",
                        c.currentVersion
                      ] }),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          className: "browser-more",
                          "aria-label": `Actions for ${c.name}`,
                          onClick: (p) => mt(p, c.name, Zr(c)),
                          children: "⋮"
                        }
                      )
                    ]
                  },
                  c.id
                )),
                !d.scripts.length && /* @__PURE__ */ g.jsx("li", { className: "browser-empty", children: "No saved scripts" })
              ] })
            ]
          }
        ),
        j.length > 0 && /* @__PURE__ */ g.jsxs(
          "details",
          {
            open: le.snapshots,
            className: "browser-folder",
            onToggle: (c) => {
              const p = c.currentTarget.open;
              te((E) => ({ ...E, snapshots: p }));
            },
            children: [
              /* @__PURE__ */ g.jsxs("summary", { children: [
                /* @__PURE__ */ g.jsx("span", { className: "browser-icon folder", "aria-hidden": "true" }),
                /* @__PURE__ */ g.jsx("strong", { children: "Resume from OMERO" }),
                /* @__PURE__ */ g.jsx("small", { children: j.length })
              ] }),
              /* @__PURE__ */ g.jsx("ul", { className: "browser-list", children: j.map((c) => /* @__PURE__ */ g.jsxs(
                "li",
                {
                  className: "browser-row",
                  onDoubleClick: () => void qr(c),
                  onContextMenu: (p) => mt(p, c.name, Pn(c)),
                  children: [
                    /* @__PURE__ */ g.jsx("span", { className: "browser-icon archive", "aria-hidden": "true" }),
                    /* @__PURE__ */ g.jsxs("div", { className: "browser-name", children: [
                      /* @__PURE__ */ g.jsx("strong", { children: c.name }),
                      /* @__PURE__ */ g.jsxs("small", { children: [
                        "Annotation ",
                        c.annotation_id
                      ] })
                    ] }),
                    /* @__PURE__ */ g.jsx("span", { className: "browser-size", children: il(c.size) }),
                    /* @__PURE__ */ g.jsx(
                      "button",
                      {
                        className: "browser-more",
                        "aria-label": `Actions for ${c.name}`,
                        onClick: (p) => mt(p, c.name, Pn(c)),
                        children: "⋮"
                      }
                    )
                  ]
                },
                c.annotation_id
              )) })
            ]
          }
        )
      ] }),
      pe && /* @__PURE__ */ g.jsxs(
        "div",
        {
          className: "browser-context-menu",
          role: "menu",
          "aria-label": `Actions for ${pe.title}`,
          style: { left: pe.x, top: pe.y },
          onClick: (c) => c.stopPropagation(),
          children: [
            /* @__PURE__ */ g.jsx("div", { className: "context-title", children: pe.title }),
            pe.actions.map((c) => /* @__PURE__ */ g.jsx(
              "button",
              {
                role: "menuitem",
                className: c.danger ? "danger" : "",
                onClick: () => {
                  he(null), c.run();
                },
                children: c.label
              },
              c.label
            ))
          ]
        }
      ),
      /* @__PURE__ */ g.jsxs("section", { className: "chat", children: [
        /* @__PURE__ */ g.jsxs("div", { className: "messages", "aria-live": "polite", ref: se, children: [
          !V.messages.length && /* @__PURE__ */ g.jsxs("div", { className: "welcome", children: [
            /* @__PURE__ */ g.jsx("h2", { children: "What would you like to learn from these data?" }),
            /* @__PURE__ */ g.jsx("p", { children: "This named chat, its code, outputs, and reusable scripts are saved automatically in the browser project." })
          ] }),
          V.messages.map((c) => {
            if (c.kind === "execution" && c.executionId) {
              const p = d.executions.find((E) => E.id === c.executionId);
              return p ? /* @__PURE__ */ g.jsx(
                Th,
                {
                  execution: p,
                  files: d.files,
                  onSave: () => void Qo(p),
                  onRerun: () => void cl(p)
                },
                c.id
              ) : null;
            }
            return /* @__PURE__ */ g.jsxs("article", { className: `message ${c.role} ${c.kind || ""}`, children: [
              /* @__PURE__ */ g.jsx("span", { children: c.role }),
              /* @__PURE__ */ g.jsx("p", { children: c.content })
            ] }, c.id);
          })
        ] }),
        !Y && /* @__PURE__ */ g.jsxs("div", { className: "runtime-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ g.jsxs("div", { children: [
            /* @__PURE__ */ g.jsx("strong", { children: je.message }),
            /* @__PURE__ */ g.jsxs("span", { children: [
              Math.round(je.percent),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ g.jsx("progress", { max: "100", value: je.percent }),
          /* @__PURE__ */ g.jsx("small", { children: "Please wait. The question box unlocks automatically when browser Python is ready." })
        ] }),
        /* @__PURE__ */ g.jsx("div", { className: "status", role: "status", children: ke }),
        /* @__PURE__ */ g.jsxs("div", { className: "usage-status", children: [
          /* @__PURE__ */ g.jsx("span", { children: "Azure receives prompts, generated code, bounded schemas/previews/statistics, summaries, and errors — never source files." }),
          /* @__PURE__ */ g.jsx("span", { children: _h(Re, C.contextWindow || 0) })
        ] }),
        ae.length > 0 && /* @__PURE__ */ g.jsx("div", { className: "blocker", children: "Analysis is blocked until every input is available. Retry, reselect, or remove missing files." }),
        !C.apiKey || !C.model ? /* @__PURE__ */ g.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
        /* @__PURE__ */ g.jsxs("div", { className: "composer", children: [
          /* @__PURE__ */ g.jsxs("div", { className: `composer-state ${me ? "ready" : "waiting"}`, children: [
            /* @__PURE__ */ g.jsx("span", { "aria-hidden": "true", children: me ? "●" : "◷" }),
            me ? "Ready — you can ask a question" : ye
          ] }),
          /* @__PURE__ */ g.jsx("textarea", { value: F, onChange: (c) => re(c.target.value), onKeyDown: (c) => {
            c.key === "Enter" && !c.shiftKey && (c.preventDefault(), Wo());
          }, disabled: !me, placeholder: ye }),
          ue ? /* @__PURE__ */ g.jsx("button", { className: "stop", onClick: Ho, children: "Stop" }) : /* @__PURE__ */ g.jsx("button", { disabled: !me || !F.trim(), onClick: () => void Wo(), children: "Send" }),
          /* @__PURE__ */ g.jsx("button", { disabled: ue || !Y, onClick: () => void Ze(d.files, "Python state reset; inputs restored"), children: "Reset Python" })
        ] })
      ] })
    ] })
  ] });
  async function rr(c, p) {
    const E = m.current;
    if (!p || !E) return;
    if (p.size > Jc) {
      R(`${p.name} exceeds the 256 MiB file limit`);
      return;
    }
    const A = await p.arrayBuffer(), D = {
      ...c,
      name: p.name,
      type: p.type || cd(p.name),
      size: A.byteLength,
      sha256: await sn(A),
      data: A,
      state: "ready",
      error: void 0
    }, X = E.files.map((q) => q.id === c.id ? D : q);
    Gt([D]), await Ze(X, "Missing local input restored");
  }
  async function cl(c) {
    if (!(!Y || ue)) {
      Q(!0), U.current.clear(), await s.beginTurn();
      try {
        await Zt(c.code, c.chatId, It(), !0), R("Python rerun completed");
      } finally {
        Q(!1);
      }
    }
  }
}
function Th({
  execution: l,
  files: a,
  onSave: s,
  onRerun: d
}) {
  var $;
  const [w, m] = Oe.useState(!1), N = l.outputFileIds.map((C) => a.find((T) => T.id === C)).filter(Boolean), _ = l.status === "reused" ? [] : N.filter((C) => C.type === "image/png" || C.type === "image/svg+xml"), j = (C) => /* @__PURE__ */ g.jsxs("div", { className: `execution-actions ${C}`, children: [
    /* @__PURE__ */ g.jsx(
      "button",
      {
        className: "detail-toggle",
        "aria-expanded": w,
        onClick: () => m((T) => !T),
        children: w ? "Collapse" : "Show details"
      }
    ),
    ["success", "reused"].includes(l.status) && /* @__PURE__ */ g.jsx("button", { onClick: s, children: "Save as script" }),
    /* @__PURE__ */ g.jsx("button", { onClick: d, children: "Rerun" }),
    /* @__PURE__ */ g.jsxs("small", { children: [
      l.codeHash.slice(0, 12),
      " · ",
      l.runtimeVersion
    ] })
  ] });
  return /* @__PURE__ */ g.jsxs("article", { className: `message execution ${l.status}`, children: [
    /* @__PURE__ */ g.jsxs("section", { className: "execution-details", "data-expanded": w ? "true" : "false", children: [
      /* @__PURE__ */ g.jsxs("div", { className: "execution-heading", children: [
        /* @__PURE__ */ g.jsx("span", { children: l.status === "reused" ? "Reused Python run" : "Python code (local)" }),
        j("top")
      ] }),
      /* @__PURE__ */ g.jsxs("div", { className: "execution-content", hidden: !w, children: [
        /* @__PURE__ */ g.jsx("pre", { children: /* @__PURE__ */ g.jsx("code", { children: l.code }) }),
        l.stdout && /* @__PURE__ */ g.jsx("pre", { children: l.stdout }),
        l.stderr && /* @__PURE__ */ g.jsx("pre", { className: "execution-error", children: l.stderr }),
        l.preview != null && /* @__PURE__ */ g.jsx(Rh, { value: l.preview }),
        j("bottom")
      ] })
    ] }),
    l.status === "reused" && /* @__PURE__ */ g.jsxs("p", { className: "reuse-note", children: [
      "Reused prior execution ",
      ($ = l.reusedFrom) == null ? void 0 : $.slice(0, 8),
      " because code and inputs are unchanged."
    ] }),
    l.missingPlotCsv.length > 0 && /* @__PURE__ */ g.jsxs("p", { className: "plot-warning", children: [
      "Source CSV missing: ",
      l.missingPlotCsv.join(", ")
    ] }),
    _.map((C) => /* @__PURE__ */ g.jsx(zh, { file: C }, C.id))
  ] });
}
function Rh({ value: l }) {
  if ((l == null ? void 0 : l.kind) === "table" && l.data) {
    const a = l.data.columns || [], s = l.data.data || [];
    return /* @__PURE__ */ g.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ g.jsxs("table", { children: [
      /* @__PURE__ */ g.jsx("thead", { children: /* @__PURE__ */ g.jsx("tr", { children: a.map((d) => /* @__PURE__ */ g.jsx("th", { children: d }, d)) }) }),
      /* @__PURE__ */ g.jsx("tbody", { children: s.map((d, w) => /* @__PURE__ */ g.jsx("tr", { children: d.map((m, N) => /* @__PURE__ */ g.jsx("td", { children: String(m ?? "") }, N)) }, w)) })
    ] }) });
  }
  return /* @__PURE__ */ g.jsx("pre", { className: "preview", children: JSON.stringify(l, null, 2) });
}
function zh({ file: l }) {
  const a = Oe.useMemo(
    () => l.data ? URL.createObjectURL(new Blob([l.data], { type: l.type })) : "",
    [l.data, l.type]
  );
  return Oe.useEffect(() => () => {
    a && URL.revokeObjectURL(a);
  }, [a]), a ? /* @__PURE__ */ g.jsxs("figure", { children: [
    /* @__PURE__ */ g.jsx("img", { src: a, alt: l.name }),
    /* @__PURE__ */ g.jsx("figcaption", { children: l.name })
  ] }) : null;
}
Cp.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ g.jsx(gp.StrictMode, { children: /* @__PURE__ */ g.jsx(Nh, {}) })
);
