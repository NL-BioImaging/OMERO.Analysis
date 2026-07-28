var xh = Object.defineProperty;
var jh = (o, i, a) => i in o ? xh(o, i, { enumerable: !0, configurable: !0, writable: !0, value: a }) : o[i] = a;
var Xn = (o, i, a) => jh(o, typeof i != "symbol" ? i + "" : i, a);
function qf(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var Eu = { exports: {} }, cs = {}, Cu = { exports: {} }, ze = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var af;
function Sh() {
  if (af) return ze;
  af = 1;
  var o = Symbol.for("react.element"), i = Symbol.for("react.portal"), a = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), p = Symbol.for("react.provider"), y = Symbol.for("react.context"), k = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), N = Symbol.for("react.memo"), b = Symbol.for("react.lazy"), A = Symbol.iterator;
  function M(C) {
    return C === null || typeof C != "object" ? null : (C = A && C[A] || C["@@iterator"], typeof C == "function" ? C : null);
  }
  var W = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, q = Object.assign, F = {};
  function Y(C, L, ye) {
    this.props = C, this.context = L, this.refs = F, this.updater = ye || W;
  }
  Y.prototype.isReactComponent = {}, Y.prototype.setState = function(C, L) {
    if (typeof C != "object" && typeof C != "function" && C != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, C, L, "setState");
  }, Y.prototype.forceUpdate = function(C) {
    this.updater.enqueueForceUpdate(this, C, "forceUpdate");
  };
  function je() {
  }
  je.prototype = Y.prototype;
  function Te(C, L, ye) {
    this.props = C, this.context = L, this.refs = F, this.updater = ye || W;
  }
  var _e = Te.prototype = new je();
  _e.constructor = Te, q(_e, Y.prototype), _e.isPureReactComponent = !0;
  var Ee = Array.isArray, Ae = Object.prototype.hasOwnProperty, $e = { current: null }, se = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ve(C, L, ye) {
    var ge, de = {}, Ce = null, Me = null;
    if (L != null) for (ge in L.ref !== void 0 && (Me = L.ref), L.key !== void 0 && (Ce = "" + L.key), L) Ae.call(L, ge) && !se.hasOwnProperty(ge) && (de[ge] = L[ge]);
    var be = arguments.length - 2;
    if (be === 1) de.children = ye;
    else if (1 < be) {
      for (var He = Array(be), ut = 0; ut < be; ut++) He[ut] = arguments[ut + 2];
      de.children = He;
    }
    if (C && C.defaultProps) for (ge in be = C.defaultProps, be) de[ge] === void 0 && (de[ge] = be[ge]);
    return { $$typeof: o, type: C, key: Ce, ref: Me, props: de, _owner: $e.current };
  }
  function ie(C, L) {
    return { $$typeof: o, type: C.type, key: L, ref: C.ref, props: C.props, _owner: C._owner };
  }
  function Fe(C) {
    return typeof C == "object" && C !== null && C.$$typeof === o;
  }
  function Oe(C) {
    var L = { "=": "=0", ":": "=2" };
    return "$" + C.replace(/[=:]/g, function(ye) {
      return L[ye];
    });
  }
  var O = /\/+/g;
  function xe(C, L) {
    return typeof C == "object" && C !== null && C.key != null ? Oe("" + C.key) : L.toString(36);
  }
  function Ie(C, L, ye, ge, de) {
    var Ce = typeof C;
    (Ce === "undefined" || Ce === "boolean") && (C = null);
    var Me = !1;
    if (C === null) Me = !0;
    else switch (Ce) {
      case "string":
      case "number":
        Me = !0;
        break;
      case "object":
        switch (C.$$typeof) {
          case o:
          case i:
            Me = !0;
        }
    }
    if (Me) return Me = C, de = de(Me), C = ge === "" ? "." + xe(Me, 0) : ge, Ee(de) ? (ye = "", C != null && (ye = C.replace(O, "$&/") + "/"), Ie(de, L, ye, "", function(ut) {
      return ut;
    })) : de != null && (Fe(de) && (de = ie(de, ye + (!de.key || Me && Me.key === de.key ? "" : ("" + de.key).replace(O, "$&/") + "/") + C)), L.push(de)), 1;
    if (Me = 0, ge = ge === "" ? "." : ge + ":", Ee(C)) for (var be = 0; be < C.length; be++) {
      Ce = C[be];
      var He = ge + xe(Ce, be);
      Me += Ie(Ce, L, ye, He, de);
    }
    else if (He = M(C), typeof He == "function") for (C = He.call(C), be = 0; !(Ce = C.next()).done; ) Ce = Ce.value, He = ge + xe(Ce, be++), Me += Ie(Ce, L, ye, He, de);
    else if (Ce === "object") throw L = String(C), Error("Objects are not valid as a React child (found: " + (L === "[object Object]" ? "object with keys {" + Object.keys(C).join(", ") + "}" : L) + "). If you meant to render a collection of children, use an array instead.");
    return Me;
  }
  function Be(C, L, ye) {
    if (C == null) return C;
    var ge = [], de = 0;
    return Ie(C, ge, "", "", function(Ce) {
      return L.call(ye, Ce, de++);
    }), ge;
  }
  function Re(C) {
    if (C._status === -1) {
      var L = C._result;
      L = L(), L.then(function(ye) {
        (C._status === 0 || C._status === -1) && (C._status = 1, C._result = ye);
      }, function(ye) {
        (C._status === 0 || C._status === -1) && (C._status = 2, C._result = ye);
      }), C._status === -1 && (C._status = 0, C._result = L);
    }
    if (C._status === 1) return C._result.default;
    throw C._result;
  }
  var me = { current: null }, K = { transition: null }, ee = { ReactCurrentDispatcher: me, ReactCurrentBatchConfig: K, ReactCurrentOwner: $e };
  function X() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ze.Children = { map: Be, forEach: function(C, L, ye) {
    Be(C, function() {
      L.apply(this, arguments);
    }, ye);
  }, count: function(C) {
    var L = 0;
    return Be(C, function() {
      L++;
    }), L;
  }, toArray: function(C) {
    return Be(C, function(L) {
      return L;
    }) || [];
  }, only: function(C) {
    if (!Fe(C)) throw Error("React.Children.only expected to receive a single React element child.");
    return C;
  } }, ze.Component = Y, ze.Fragment = a, ze.Profiler = d, ze.PureComponent = Te, ze.StrictMode = c, ze.Suspense = w, ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ee, ze.act = X, ze.cloneElement = function(C, L, ye) {
    if (C == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + C + ".");
    var ge = q({}, C.props), de = C.key, Ce = C.ref, Me = C._owner;
    if (L != null) {
      if (L.ref !== void 0 && (Ce = L.ref, Me = $e.current), L.key !== void 0 && (de = "" + L.key), C.type && C.type.defaultProps) var be = C.type.defaultProps;
      for (He in L) Ae.call(L, He) && !se.hasOwnProperty(He) && (ge[He] = L[He] === void 0 && be !== void 0 ? be[He] : L[He]);
    }
    var He = arguments.length - 2;
    if (He === 1) ge.children = ye;
    else if (1 < He) {
      be = Array(He);
      for (var ut = 0; ut < He; ut++) be[ut] = arguments[ut + 2];
      ge.children = be;
    }
    return { $$typeof: o, type: C.type, key: de, ref: Ce, props: ge, _owner: Me };
  }, ze.createContext = function(C) {
    return C = { $$typeof: y, _currentValue: C, _currentValue2: C, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, C.Provider = { $$typeof: p, _context: C }, C.Consumer = C;
  }, ze.createElement = ve, ze.createFactory = function(C) {
    var L = ve.bind(null, C);
    return L.type = C, L;
  }, ze.createRef = function() {
    return { current: null };
  }, ze.forwardRef = function(C) {
    return { $$typeof: k, render: C };
  }, ze.isValidElement = Fe, ze.lazy = function(C) {
    return { $$typeof: b, _payload: { _status: -1, _result: C }, _init: Re };
  }, ze.memo = function(C, L) {
    return { $$typeof: N, type: C, compare: L === void 0 ? null : L };
  }, ze.startTransition = function(C) {
    var L = K.transition;
    K.transition = {};
    try {
      C();
    } finally {
      K.transition = L;
    }
  }, ze.unstable_act = X, ze.useCallback = function(C, L) {
    return me.current.useCallback(C, L);
  }, ze.useContext = function(C) {
    return me.current.useContext(C);
  }, ze.useDebugValue = function() {
  }, ze.useDeferredValue = function(C) {
    return me.current.useDeferredValue(C);
  }, ze.useEffect = function(C, L) {
    return me.current.useEffect(C, L);
  }, ze.useId = function() {
    return me.current.useId();
  }, ze.useImperativeHandle = function(C, L, ye) {
    return me.current.useImperativeHandle(C, L, ye);
  }, ze.useInsertionEffect = function(C, L) {
    return me.current.useInsertionEffect(C, L);
  }, ze.useLayoutEffect = function(C, L) {
    return me.current.useLayoutEffect(C, L);
  }, ze.useMemo = function(C, L) {
    return me.current.useMemo(C, L);
  }, ze.useReducer = function(C, L, ye) {
    return me.current.useReducer(C, L, ye);
  }, ze.useRef = function(C) {
    return me.current.useRef(C);
  }, ze.useState = function(C) {
    return me.current.useState(C);
  }, ze.useSyncExternalStore = function(C, L, ye) {
    return me.current.useSyncExternalStore(C, L, ye);
  }, ze.useTransition = function() {
    return me.current.useTransition();
  }, ze.version = "18.3.1", ze;
}
var lf;
function Yu() {
  return lf || (lf = 1, Cu.exports = Sh()), Cu.exports;
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
var uf;
function _h() {
  if (uf) return cs;
  uf = 1;
  var o = Yu(), i = Symbol.for("react.element"), a = Symbol.for("react.fragment"), c = Object.prototype.hasOwnProperty, d = o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: !0, ref: !0, __self: !0, __source: !0 };
  function y(k, w, N) {
    var b, A = {}, M = null, W = null;
    N !== void 0 && (M = "" + N), w.key !== void 0 && (M = "" + w.key), w.ref !== void 0 && (W = w.ref);
    for (b in w) c.call(w, b) && !p.hasOwnProperty(b) && (A[b] = w[b]);
    if (k && k.defaultProps) for (b in w = k.defaultProps, w) A[b] === void 0 && (A[b] = w[b]);
    return { $$typeof: i, type: k, key: M, ref: W, props: A, _owner: d.current };
  }
  return cs.Fragment = a, cs.jsx = y, cs.jsxs = y, cs;
}
var cf;
function Eh() {
  return cf || (cf = 1, Eu.exports = _h()), Eu.exports;
}
var f = Eh(), pe = Yu();
const Ch = /* @__PURE__ */ qf(pe);
var Ma = {}, bu = { exports: {} }, qt = {}, Pu = { exports: {} }, Au = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var df;
function bh() {
  return df || (df = 1, (function(o) {
    function i(K, ee) {
      var X = K.length;
      K.push(ee);
      e: for (; 0 < X; ) {
        var C = X - 1 >>> 1, L = K[C];
        if (0 < d(L, ee)) K[C] = ee, K[X] = L, X = C;
        else break e;
      }
    }
    function a(K) {
      return K.length === 0 ? null : K[0];
    }
    function c(K) {
      if (K.length === 0) return null;
      var ee = K[0], X = K.pop();
      if (X !== ee) {
        K[0] = X;
        e: for (var C = 0, L = K.length, ye = L >>> 1; C < ye; ) {
          var ge = 2 * (C + 1) - 1, de = K[ge], Ce = ge + 1, Me = K[Ce];
          if (0 > d(de, X)) Ce < L && 0 > d(Me, de) ? (K[C] = Me, K[Ce] = X, C = Ce) : (K[C] = de, K[ge] = X, C = ge);
          else if (Ce < L && 0 > d(Me, X)) K[C] = Me, K[Ce] = X, C = Ce;
          else break e;
        }
      }
      return ee;
    }
    function d(K, ee) {
      var X = K.sortIndex - ee.sortIndex;
      return X !== 0 ? X : K.id - ee.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var p = performance;
      o.unstable_now = function() {
        return p.now();
      };
    } else {
      var y = Date, k = y.now();
      o.unstable_now = function() {
        return y.now() - k;
      };
    }
    var w = [], N = [], b = 1, A = null, M = 3, W = !1, q = !1, F = !1, Y = typeof setTimeout == "function" ? setTimeout : null, je = typeof clearTimeout == "function" ? clearTimeout : null, Te = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function _e(K) {
      for (var ee = a(N); ee !== null; ) {
        if (ee.callback === null) c(N);
        else if (ee.startTime <= K) c(N), ee.sortIndex = ee.expirationTime, i(w, ee);
        else break;
        ee = a(N);
      }
    }
    function Ee(K) {
      if (F = !1, _e(K), !q) if (a(w) !== null) q = !0, Re(Ae);
      else {
        var ee = a(N);
        ee !== null && me(Ee, ee.startTime - K);
      }
    }
    function Ae(K, ee) {
      q = !1, F && (F = !1, je(ve), ve = -1), W = !0;
      var X = M;
      try {
        for (_e(ee), A = a(w); A !== null && (!(A.expirationTime > ee) || K && !Oe()); ) {
          var C = A.callback;
          if (typeof C == "function") {
            A.callback = null, M = A.priorityLevel;
            var L = C(A.expirationTime <= ee);
            ee = o.unstable_now(), typeof L == "function" ? A.callback = L : A === a(w) && c(w), _e(ee);
          } else c(w);
          A = a(w);
        }
        if (A !== null) var ye = !0;
        else {
          var ge = a(N);
          ge !== null && me(Ee, ge.startTime - ee), ye = !1;
        }
        return ye;
      } finally {
        A = null, M = X, W = !1;
      }
    }
    var $e = !1, se = null, ve = -1, ie = 5, Fe = -1;
    function Oe() {
      return !(o.unstable_now() - Fe < ie);
    }
    function O() {
      if (se !== null) {
        var K = o.unstable_now();
        Fe = K;
        var ee = !0;
        try {
          ee = se(!0, K);
        } finally {
          ee ? xe() : ($e = !1, se = null);
        }
      } else $e = !1;
    }
    var xe;
    if (typeof Te == "function") xe = function() {
      Te(O);
    };
    else if (typeof MessageChannel < "u") {
      var Ie = new MessageChannel(), Be = Ie.port2;
      Ie.port1.onmessage = O, xe = function() {
        Be.postMessage(null);
      };
    } else xe = function() {
      Y(O, 0);
    };
    function Re(K) {
      se = K, $e || ($e = !0, xe());
    }
    function me(K, ee) {
      ve = Y(function() {
        K(o.unstable_now());
      }, ee);
    }
    o.unstable_IdlePriority = 5, o.unstable_ImmediatePriority = 1, o.unstable_LowPriority = 4, o.unstable_NormalPriority = 3, o.unstable_Profiling = null, o.unstable_UserBlockingPriority = 2, o.unstable_cancelCallback = function(K) {
      K.callback = null;
    }, o.unstable_continueExecution = function() {
      q || W || (q = !0, Re(Ae));
    }, o.unstable_forceFrameRate = function(K) {
      0 > K || 125 < K ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ie = 0 < K ? Math.floor(1e3 / K) : 5;
    }, o.unstable_getCurrentPriorityLevel = function() {
      return M;
    }, o.unstable_getFirstCallbackNode = function() {
      return a(w);
    }, o.unstable_next = function(K) {
      switch (M) {
        case 1:
        case 2:
        case 3:
          var ee = 3;
          break;
        default:
          ee = M;
      }
      var X = M;
      M = ee;
      try {
        return K();
      } finally {
        M = X;
      }
    }, o.unstable_pauseExecution = function() {
    }, o.unstable_requestPaint = function() {
    }, o.unstable_runWithPriority = function(K, ee) {
      switch (K) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          K = 3;
      }
      var X = M;
      M = K;
      try {
        return ee();
      } finally {
        M = X;
      }
    }, o.unstable_scheduleCallback = function(K, ee, X) {
      var C = o.unstable_now();
      switch (typeof X == "object" && X !== null ? (X = X.delay, X = typeof X == "number" && 0 < X ? C + X : C) : X = C, K) {
        case 1:
          var L = -1;
          break;
        case 2:
          L = 250;
          break;
        case 5:
          L = 1073741823;
          break;
        case 4:
          L = 1e4;
          break;
        default:
          L = 5e3;
      }
      return L = X + L, K = { id: b++, callback: ee, priorityLevel: K, startTime: X, expirationTime: L, sortIndex: -1 }, X > C ? (K.sortIndex = X, i(N, K), a(w) === null && K === a(N) && (F ? (je(ve), ve = -1) : F = !0, me(Ee, X - C))) : (K.sortIndex = L, i(w, K), q || W || (q = !0, Re(Ae))), K;
    }, o.unstable_shouldYield = Oe, o.unstable_wrapCallback = function(K) {
      var ee = M;
      return function() {
        var X = M;
        M = ee;
        try {
          return K.apply(this, arguments);
        } finally {
          M = X;
        }
      };
    };
  })(Au)), Au;
}
var ff;
function Ph() {
  return ff || (ff = 1, Pu.exports = bh()), Pu.exports;
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
var pf;
function Ah() {
  if (pf) return qt;
  pf = 1;
  var o = Yu(), i = Ph();
  function a(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var c = /* @__PURE__ */ new Set(), d = {};
  function p(e, t) {
    y(e, t), y(e + "Capture", t);
  }
  function y(e, t) {
    for (d[e] = t, e = 0; e < t.length; e++) c.add(t[e]);
  }
  var k = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), w = Object.prototype.hasOwnProperty, N = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, b = {}, A = {};
  function M(e) {
    return w.call(A, e) ? !0 : w.call(b, e) ? !1 : N.test(e) ? A[e] = !0 : (b[e] = !0, !1);
  }
  function W(e, t, n, r) {
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
  function q(e, t, n, r) {
    if (t === null || typeof t > "u" || W(e, t, n, r)) return !0;
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
  function F(e, t, n, r, s, u, m) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = s, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = u, this.removeEmptyString = m;
  }
  var Y = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    Y[e] = new F(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    Y[t] = new F(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    Y[e] = new F(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    Y[e] = new F(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    Y[e] = new F(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    Y[e] = new F(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    Y[e] = new F(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    Y[e] = new F(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    Y[e] = new F(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var je = /[\-:]([a-z])/g;
  function Te(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      je,
      Te
    );
    Y[t] = new F(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(je, Te);
    Y[t] = new F(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(je, Te);
    Y[t] = new F(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    Y[e] = new F(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), Y.xlinkHref = new F("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    Y[e] = new F(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function _e(e, t, n, r) {
    var s = Y.hasOwnProperty(t) ? Y[t] : null;
    (s !== null ? s.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (q(t, n, s, r) && (n = null), r || s === null ? M(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : s.mustUseProperty ? e[s.propertyName] = n === null ? s.type === 3 ? !1 : "" : n : (t = s.attributeName, r = s.attributeNamespace, n === null ? e.removeAttribute(t) : (s = s.type, n = s === 3 || s === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var Ee = o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ae = Symbol.for("react.element"), $e = Symbol.for("react.portal"), se = Symbol.for("react.fragment"), ve = Symbol.for("react.strict_mode"), ie = Symbol.for("react.profiler"), Fe = Symbol.for("react.provider"), Oe = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), xe = Symbol.for("react.suspense"), Ie = Symbol.for("react.suspense_list"), Be = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), me = Symbol.for("react.offscreen"), K = Symbol.iterator;
  function ee(e) {
    return e === null || typeof e != "object" ? null : (e = K && e[K] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var X = Object.assign, C;
  function L(e) {
    if (C === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      C = t && t[1] || "";
    }
    return `
` + C + e;
  }
  var ye = !1;
  function ge(e, t) {
    if (!e || ye) return "";
    ye = !0;
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
        } catch (T) {
          var r = T;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (T) {
          r = T;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (T) {
          r = T;
        }
        e();
      }
    } catch (T) {
      if (T && r && typeof T.stack == "string") {
        for (var s = T.stack.split(`
`), u = r.stack.split(`
`), m = s.length - 1, g = u.length - 1; 1 <= m && 0 <= g && s[m] !== u[g]; ) g--;
        for (; 1 <= m && 0 <= g; m--, g--) if (s[m] !== u[g]) {
          if (m !== 1 || g !== 1)
            do
              if (m--, g--, 0 > g || s[m] !== u[g]) {
                var S = `
` + s[m].replace(" at new ", " at ");
                return e.displayName && S.includes("<anonymous>") && (S = S.replace("<anonymous>", e.displayName)), S;
              }
            while (1 <= m && 0 <= g);
          break;
        }
      }
    } finally {
      ye = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? L(e) : "";
  }
  function de(e) {
    switch (e.tag) {
      case 5:
        return L(e.type);
      case 16:
        return L("Lazy");
      case 13:
        return L("Suspense");
      case 19:
        return L("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = ge(e.type, !1), e;
      case 11:
        return e = ge(e.type.render, !1), e;
      case 1:
        return e = ge(e.type, !0), e;
      default:
        return "";
    }
  }
  function Ce(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case se:
        return "Fragment";
      case $e:
        return "Portal";
      case ie:
        return "Profiler";
      case ve:
        return "StrictMode";
      case xe:
        return "Suspense";
      case Ie:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Oe:
        return (e.displayName || "Context") + ".Consumer";
      case Fe:
        return (e._context.displayName || "Context") + ".Provider";
      case O:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Be:
        return t = e.displayName || null, t !== null ? t : Ce(e.type) || "Memo";
      case Re:
        t = e._payload, e = e._init;
        try {
          return Ce(e(t));
        } catch {
        }
    }
    return null;
  }
  function Me(e) {
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
        return Ce(t);
      case 8:
        return t === ve ? "StrictMode" : "Mode";
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
  function be(e) {
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
  function He(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function ut(e) {
    var t = He(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var s = n.get, u = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return s.call(this);
      }, set: function(m) {
        r = "" + m, u.call(this, m);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(m) {
        r = "" + m;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Qt(e) {
    e._valueTracker || (e._valueTracker = ut(e));
  }
  function It(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = He(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function $t(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function ir(e, t) {
    var n = t.checked;
    return X({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function _i(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = be(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function re(e, t) {
    t = t.checked, t != null && _e(e, "checked", t, !1);
  }
  function Lo(e, t) {
    re(e, t);
    var n = be(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? ln(e, t.type, n) : t.hasOwnProperty("defaultValue") && ln(e, t.type, be(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function ws(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function ln(e, t, n) {
    (t !== "number" || $t(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var zn = Array.isArray;
  function jn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var s = 0; s < n.length; s++) t["$" + n[s]] = !0;
      for (n = 0; n < e.length; n++) s = t.hasOwnProperty("$" + e[n].value), e[n].selected !== s && (e[n].selected = s), s && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + be(n), t = null, s = 0; s < e.length; s++) {
        if (e[s].value === n) {
          e[s].selected = !0, r && (e[s].defaultSelected = !0);
          return;
        }
        t !== null || e[s].disabled || (t = e[s]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function no(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(a(91));
    return X({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Ei(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(a(92));
        if (zn(n)) {
          if (1 < n.length) throw Error(a(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: be(n) };
  }
  function ro(e, t) {
    var n = be(t.value), r = be(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Ln(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Er(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function zt(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Er(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Fn, ks = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, s) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, s);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Fn = Fn || document.createElement("div"), Fn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Fn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function sr(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Dn = {
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
  }, xs = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Dn).forEach(function(e) {
    xs.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Dn[t] = Dn[e];
    });
  });
  function ar(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Dn.hasOwnProperty(e) && Dn[e] ? ("" + t).trim() : t + "px";
  }
  function Un(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, s = ar(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, s) : e[n] = s;
    }
  }
  var Xa = X({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function oo(e, t) {
    if (t) {
      if (Xa[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(a(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(a(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(a(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(a(62));
    }
  }
  function io(e, t) {
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
  var Sn = null;
  function so(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Cr = null, Jt = null, lr = null;
  function ao(e) {
    if (e = Qi(e)) {
      if (typeof Cr != "function") throw Error(a(280));
      var t = e.stateNode;
      t && (t = Gs(t), Cr(e.stateNode, e.type, t));
    }
  }
  function br(e) {
    Jt ? lr ? lr.push(e) : lr = [e] : Jt = e;
  }
  function Lt() {
    if (Jt) {
      var e = Jt, t = lr;
      if (lr = Jt = null, ao(e), t) for (e = 0; e < t.length; e++) ao(t[e]);
    }
  }
  function xt(e, t) {
    return e(t);
  }
  function Ne() {
  }
  var ur = !1;
  function Ge(e, t, n) {
    if (ur) return e(t, n);
    ur = !0;
    try {
      return xt(e, t, n);
    } finally {
      ur = !1, (Jt !== null || lr !== null) && (Ne(), Lt());
    }
  }
  function cr(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Gs(n);
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
    if (n && typeof n != "function") throw Error(a(231, t, typeof n));
    return n;
  }
  var Pr = !1;
  if (k) try {
    var Bn = {};
    Object.defineProperty(Bn, "passive", { get: function() {
      Pr = !0;
    } }), window.addEventListener("test", Bn, Bn), window.removeEventListener("test", Bn, Bn);
  } catch {
    Pr = !1;
  }
  function Ya(e, t, n, r, s, u, m, g, S) {
    var T = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, T);
    } catch (U) {
      this.onError(U);
    }
  }
  var un = !1, lo = null, dr = !1, uo = null, Fo = { onError: function(e) {
    un = !0, lo = e;
  } };
  function Ci(e, t, n, r, s, u, m, g, S) {
    un = !1, lo = null, Ya.apply(Fo, arguments);
  }
  function bi(e, t, n, r, s, u, m, g, S) {
    if (Ci.apply(this, arguments), un) {
      if (un) {
        var T = lo;
        un = !1, lo = null;
      } else throw Error(a(198));
      dr || (dr = !0, uo = T);
    }
  }
  function Vn(e) {
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
  function js(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function co(e) {
    if (Vn(e) !== e) throw Error(a(188));
  }
  function el(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Vn(e), t === null) throw Error(a(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var s = n.return;
      if (s === null) break;
      var u = s.alternate;
      if (u === null) {
        if (r = s.return, r !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (s.child === u.child) {
        for (u = s.child; u; ) {
          if (u === n) return co(s), e;
          if (u === r) return co(s), t;
          u = u.sibling;
        }
        throw Error(a(188));
      }
      if (n.return !== r.return) n = s, r = u;
      else {
        for (var m = !1, g = s.child; g; ) {
          if (g === n) {
            m = !0, n = s, r = u;
            break;
          }
          if (g === r) {
            m = !0, r = s, n = u;
            break;
          }
          g = g.sibling;
        }
        if (!m) {
          for (g = u.child; g; ) {
            if (g === n) {
              m = !0, n = u, r = s;
              break;
            }
            if (g === r) {
              m = !0, r = u, n = s;
              break;
            }
            g = g.sibling;
          }
          if (!m) throw Error(a(189));
        }
      }
      if (n.alternate !== r) throw Error(a(190));
    }
    if (n.tag !== 3) throw Error(a(188));
    return n.stateNode.current === n ? e : t;
  }
  function Pi(e) {
    return e = el(e), e !== null ? Gt(e) : null;
  }
  function Gt(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Gt(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var fo = i.unstable_scheduleCallback, fr = i.unstable_cancelCallback, Ft = i.unstable_shouldYield, tl = i.unstable_requestPaint, Xe = i.unstable_now, Xt = i.unstable_getCurrentPriorityLevel, Ai = i.unstable_ImmediatePriority, Ar = i.unstable_UserBlockingPriority, Ir = i.unstable_NormalPriority, po = i.unstable_LowPriority, Ii = i.unstable_IdlePriority, Do = null, cn = null;
  function Uo(e) {
    if (cn && typeof cn.onCommitFiberRoot == "function") try {
      cn.onCommitFiberRoot(Do, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var Yt = Math.clz32 ? Math.clz32 : nl, Bo = Math.log, ft = Math.LN2;
  function nl(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Bo(e) / ft | 0) | 0;
  }
  var $r = 64, ho = 4194304;
  function _n(e) {
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
  function mo(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, s = e.suspendedLanes, u = e.pingedLanes, m = n & 268435455;
    if (m !== 0) {
      var g = m & ~s;
      g !== 0 ? r = _n(g) : (u &= m, u !== 0 && (r = _n(u)));
    } else m = n & ~s, m !== 0 ? r = _n(m) : u !== 0 && (r = _n(u));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & s) === 0 && (s = r & -r, u = t & -t, s >= u || s === 16 && (u & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Yt(t), s = 1 << n, r |= e[n], t &= ~s;
    return r;
  }
  function Ss(e, t) {
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
  function Vo(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, s = e.expirationTimes, u = e.pendingLanes; 0 < u; ) {
      var m = 31 - Yt(u), g = 1 << m, S = s[m];
      S === -1 ? ((g & n) === 0 || (g & r) !== 0) && (s[m] = Ss(g, t)) : S <= t && (e.expiredLanes |= g), u &= ~g;
    }
  }
  function Wo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function _s() {
    var e = $r;
    return $r <<= 1, ($r & 4194240) === 0 && ($r = 64), e;
  }
  function Ho(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Nr(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Yt(t), e[t] = n;
  }
  function yo(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var s = 31 - Yt(n), u = 1 << s;
      t[s] = 0, r[s] = -1, e[s] = -1, n &= ~u;
    }
  }
  function vo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - Yt(n), s = 1 << r;
      s & t | e[r] & t && (e[r] |= t), n &= ~s;
    }
  }
  var Ve = 0;
  function Es(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Cs, $i, bs, Ps, Ni, Ti = !1, qo = [], Wn = null, Hn = null, qn = null, Tr = /* @__PURE__ */ new Map(), Rr = /* @__PURE__ */ new Map(), dn = [], As = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Is(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Wn = null;
        break;
      case "dragenter":
      case "dragleave":
        Hn = null;
        break;
      case "mouseover":
      case "mouseout":
        qn = null;
        break;
      case "pointerover":
      case "pointerout":
        Tr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Rr.delete(t.pointerId);
    }
  }
  function go(e, t, n, r, s, u) {
    return e === null || e.nativeEvent !== u ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: u, targetContainers: [s] }, t !== null && (t = Qi(t), t !== null && $i(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, s !== null && t.indexOf(s) === -1 && t.push(s), e);
  }
  function rl(e, t, n, r, s) {
    switch (t) {
      case "focusin":
        return Wn = go(Wn, e, t, n, r, s), !0;
      case "dragenter":
        return Hn = go(Hn, e, t, n, r, s), !0;
      case "mouseover":
        return qn = go(qn, e, t, n, r, s), !0;
      case "pointerover":
        var u = s.pointerId;
        return Tr.set(u, go(Tr.get(u) || null, e, t, n, r, s)), !0;
      case "gotpointercapture":
        return u = s.pointerId, Rr.set(u, go(Rr.get(u) || null, e, t, n, r, s)), !0;
    }
    return !1;
  }
  function Ri(e) {
    var t = Eo(e.target);
    if (t !== null) {
      var n = Vn(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = js(n), t !== null) {
            e.blockedOn = t, Ni(e.priority, function() {
              bs(n);
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
  function wo(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = zi(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Sn = r, n.target.dispatchEvent(r), Sn = null;
      } else return t = Qi(n), t !== null && $i(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Oi(e, t, n) {
    wo(e) && n.delete(t);
  }
  function Mi() {
    Ti = !1, Wn !== null && wo(Wn) && (Wn = null), Hn !== null && wo(Hn) && (Hn = null), qn !== null && wo(qn) && (qn = null), Tr.forEach(Oi), Rr.forEach(Oi);
  }
  function ko(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Ti || (Ti = !0, i.unstable_scheduleCallback(i.unstable_NormalPriority, Mi)));
  }
  function En(e) {
    function t(s) {
      return ko(s, e);
    }
    if (0 < qo.length) {
      ko(qo[0], e);
      for (var n = 1; n < qo.length; n++) {
        var r = qo[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Wn !== null && ko(Wn, e), Hn !== null && ko(Hn, e), qn !== null && ko(qn, e), Tr.forEach(t), Rr.forEach(t), n = 0; n < dn.length; n++) r = dn[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < dn.length && (n = dn[0], n.blockedOn === null); ) Ri(n), n.blockedOn === null && dn.shift();
  }
  var Kn = Ee.ReactCurrentBatchConfig, Ko = !0;
  function ol(e, t, n, r) {
    var s = Ve, u = Kn.transition;
    Kn.transition = null;
    try {
      Ve = 1, Zo(e, t, n, r);
    } finally {
      Ve = s, Kn.transition = u;
    }
  }
  function $s(e, t, n, r) {
    var s = Ve, u = Kn.transition;
    Kn.transition = null;
    try {
      Ve = 4, Zo(e, t, n, r);
    } finally {
      Ve = s, Kn.transition = u;
    }
  }
  function Zo(e, t, n, r) {
    if (Ko) {
      var s = zi(e, t, n, r);
      if (s === null) ml(e, t, r, Qo, n), Is(e, r);
      else if (rl(s, e, t, n, r)) r.stopPropagation();
      else if (Is(e, r), t & 4 && -1 < As.indexOf(e)) {
        for (; s !== null; ) {
          var u = Qi(s);
          if (u !== null && Cs(u), u = zi(e, t, n, r), u === null && ml(e, t, r, Qo, n), u === s) break;
          s = u;
        }
        s !== null && r.stopPropagation();
      } else ml(e, t, r, null, n);
    }
  }
  var Qo = null;
  function zi(e, t, n, r) {
    if (Qo = null, e = so(r), e = Eo(e), e !== null) if (t = Vn(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = js(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Qo = e, null;
  }
  function Ns(e) {
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
        switch (Xt()) {
          case Ai:
            return 1;
          case Ar:
            return 4;
          case Ir:
          case po:
            return 16;
          case Ii:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Cn = null, Li = null, xo = null;
  function Fi() {
    if (xo) return xo;
    var e, t = Li, n = t.length, r, s = "value" in Cn ? Cn.value : Cn.textContent, u = s.length;
    for (e = 0; e < n && t[e] === s[e]; e++) ;
    var m = n - e;
    for (r = 1; r <= m && t[n - r] === s[u - r]; r++) ;
    return xo = s.slice(e, 1 < r ? 1 - r : void 0);
  }
  function jo(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function So() {
    return !0;
  }
  function Jo() {
    return !1;
  }
  function Nt(e) {
    function t(n, r, s, u, m) {
      this._reactName = n, this._targetInst = s, this.type = r, this.nativeEvent = u, this.target = m, this.currentTarget = null;
      for (var g in e) e.hasOwnProperty(g) && (n = e[g], this[g] = n ? n(u) : u[g]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? So : Jo, this.isPropagationStopped = Jo, this;
    }
    return X(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = So);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = So);
    }, persist: function() {
    }, isPersistent: So }), t;
  }
  var pr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Di = Nt(pr), _o = X({}, pr, { view: 0, detail: 0 }), il = Nt(_o), l, h, v, j = X({}, _o, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: De, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== v && (v && e.type === "mousemove" ? (l = e.screenX - v.screenX, h = e.screenY - v.screenY) : h = l = 0, v = e), l);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : h;
  } }), x = Nt(j), P = X({}, j, { dataTransfer: 0 }), _ = Nt(P), R = X({}, _o, { relatedTarget: 0 }), Q = Nt(R), z = X({}, pr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), B = Nt(z), G = X({}, pr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), H = Nt(G), J = X({}, pr, { data: 0 }), le = Nt(J), ue = {
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
  }, qe = {
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
  }, Qe = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Dt(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Qe[e]) ? !!t[e] : !1;
  }
  function De() {
    return Dt;
  }
  var he = X({}, _o, { key: function(e) {
    if (e.key) {
      var t = ue[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = jo(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? qe[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: De, charCode: function(e) {
    return e.type === "keypress" ? jo(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? jo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Pe = Nt(he), ct = X({}, j, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), bn = Nt(ct), Ts = X({}, _o, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: De }), Rs = Nt(Ts), Os = X({}, pr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Ms = Nt(Os), zs = X({}, j, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ls = Nt(zs), Fs = [9, 13, 27, 32], Go = k && "CompositionEvent" in window, Ue = null;
  k && "documentMode" in document && (Ue = document.documentMode);
  var Je = k && "TextEvent" in window && !Ue, pt = k && (!Go || Ue && 8 < Ue && 11 >= Ue), Pn = " ", Ds = !1;
  function Or(e, t) {
    switch (e) {
      case "keyup":
        return Fs.indexOf(t.keyCode) !== -1;
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
  function fn(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Mr = !1;
  function Us(e, t) {
    switch (e) {
      case "compositionend":
        return fn(t);
      case "keypress":
        return t.which !== 32 ? null : (Ds = !0, Pn);
      case "textInput":
        return e = t.data, e === Pn && Ds ? null : e;
      default:
        return null;
    }
  }
  function Bs(e, t) {
    if (Mr) return e === "compositionend" || !Go && Or(e, t) ? (e = Fi(), xo = Li = Cn = null, Mr = !1, e) : null;
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
        return pt && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Vs = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function en(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Vs[e.type] : t === "textarea";
  }
  function zr(e, t, n, r) {
    br(r), t = Zs(t, "onChange"), 0 < t.length && (n = new Di("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Ui = null, Bi = null;
  function xp(e) {
    jc(e, 0);
  }
  function Ws(e) {
    var t = ni(e);
    if (It(t)) return e;
  }
  function jp(e, t) {
    if (e === "change") return t;
  }
  var ic = !1;
  if (k) {
    var sl;
    if (k) {
      var al = "oninput" in document;
      if (!al) {
        var sc = document.createElement("div");
        sc.setAttribute("oninput", "return;"), al = typeof sc.oninput == "function";
      }
      sl = al;
    } else sl = !1;
    ic = sl && (!document.documentMode || 9 < document.documentMode);
  }
  function ac() {
    Ui && (Ui.detachEvent("onpropertychange", lc), Bi = Ui = null);
  }
  function lc(e) {
    if (e.propertyName === "value" && Ws(Bi)) {
      var t = [];
      zr(t, Bi, e, so(e)), Ge(xp, t);
    }
  }
  function Sp(e, t, n) {
    e === "focusin" ? (ac(), Ui = t, Bi = n, Ui.attachEvent("onpropertychange", lc)) : e === "focusout" && ac();
  }
  function _p(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ws(Bi);
  }
  function Ep(e, t) {
    if (e === "click") return Ws(t);
  }
  function Cp(e, t) {
    if (e === "input" || e === "change") return Ws(t);
  }
  function bp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var An = typeof Object.is == "function" ? Object.is : bp;
  function Vi(e, t) {
    if (An(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var s = n[r];
      if (!w.call(t, s) || !An(e[s], t[s])) return !1;
    }
    return !0;
  }
  function uc(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function cc(e, t) {
    var n = uc(e);
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
      n = uc(n);
    }
  }
  function dc(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? dc(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function fc() {
    for (var e = window, t = $t(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = $t(e.document);
    }
    return t;
  }
  function ll(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Pp(e) {
    var t = fc(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && dc(n.ownerDocument.documentElement, n)) {
      if (r !== null && ll(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var s = n.textContent.length, u = Math.min(r.start, s);
          r = r.end === void 0 ? u : Math.min(r.end, s), !e.extend && u > r && (s = r, r = u, u = s), s = cc(n, u);
          var m = cc(
            n,
            r
          );
          s && m && (e.rangeCount !== 1 || e.anchorNode !== s.node || e.anchorOffset !== s.offset || e.focusNode !== m.node || e.focusOffset !== m.offset) && (t = t.createRange(), t.setStart(s.node, s.offset), e.removeAllRanges(), u > r ? (e.addRange(t), e.extend(m.node, m.offset)) : (t.setEnd(m.node, m.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Ap = k && "documentMode" in document && 11 >= document.documentMode, Xo = null, ul = null, Wi = null, cl = !1;
  function pc(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    cl || Xo == null || Xo !== $t(r) || (r = Xo, "selectionStart" in r && ll(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Wi && Vi(Wi, r) || (Wi = r, r = Zs(ul, "onSelect"), 0 < r.length && (t = new Di("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Xo)));
  }
  function Hs(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Yo = { animationend: Hs("Animation", "AnimationEnd"), animationiteration: Hs("Animation", "AnimationIteration"), animationstart: Hs("Animation", "AnimationStart"), transitionend: Hs("Transition", "TransitionEnd") }, dl = {}, hc = {};
  k && (hc = document.createElement("div").style, "AnimationEvent" in window || (delete Yo.animationend.animation, delete Yo.animationiteration.animation, delete Yo.animationstart.animation), "TransitionEvent" in window || delete Yo.transitionend.transition);
  function qs(e) {
    if (dl[e]) return dl[e];
    if (!Yo[e]) return e;
    var t = Yo[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in hc) return dl[e] = t[n];
    return e;
  }
  var mc = qs("animationend"), yc = qs("animationiteration"), vc = qs("animationstart"), gc = qs("transitionend"), wc = /* @__PURE__ */ new Map(), kc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Lr(e, t) {
    wc.set(e, t), p(t, [e]);
  }
  for (var fl = 0; fl < kc.length; fl++) {
    var pl = kc[fl], Ip = pl.toLowerCase(), $p = pl[0].toUpperCase() + pl.slice(1);
    Lr(Ip, "on" + $p);
  }
  Lr(mc, "onAnimationEnd"), Lr(yc, "onAnimationIteration"), Lr(vc, "onAnimationStart"), Lr("dblclick", "onDoubleClick"), Lr("focusin", "onFocus"), Lr("focusout", "onBlur"), Lr(gc, "onTransitionEnd"), y("onMouseEnter", ["mouseout", "mouseover"]), y("onMouseLeave", ["mouseout", "mouseover"]), y("onPointerEnter", ["pointerout", "pointerover"]), y("onPointerLeave", ["pointerout", "pointerover"]), p("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), p("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), p("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), p("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), p("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), p("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Hi = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Np = new Set("cancel close invalid load scroll toggle".split(" ").concat(Hi));
  function xc(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, bi(r, t, void 0, e), e.currentTarget = null;
  }
  function jc(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], s = r.event;
      r = r.listeners;
      e: {
        var u = void 0;
        if (t) for (var m = r.length - 1; 0 <= m; m--) {
          var g = r[m], S = g.instance, T = g.currentTarget;
          if (g = g.listener, S !== u && s.isPropagationStopped()) break e;
          xc(s, g, T), u = S;
        }
        else for (m = 0; m < r.length; m++) {
          if (g = r[m], S = g.instance, T = g.currentTarget, g = g.listener, S !== u && s.isPropagationStopped()) break e;
          xc(s, g, T), u = S;
        }
      }
    }
    if (dr) throw e = uo, dr = !1, uo = null, e;
  }
  function et(e, t) {
    var n = t[xl];
    n === void 0 && (n = t[xl] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (Sc(t, e, 2, !1), n.add(r));
  }
  function hl(e, t, n) {
    var r = 0;
    t && (r |= 4), Sc(n, e, r, t);
  }
  var Ks = "_reactListening" + Math.random().toString(36).slice(2);
  function qi(e) {
    if (!e[Ks]) {
      e[Ks] = !0, c.forEach(function(n) {
        n !== "selectionchange" && (Np.has(n) || hl(n, !1, e), hl(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ks] || (t[Ks] = !0, hl("selectionchange", !1, t));
    }
  }
  function Sc(e, t, n, r) {
    switch (Ns(t)) {
      case 1:
        var s = ol;
        break;
      case 4:
        s = $s;
        break;
      default:
        s = Zo;
    }
    n = s.bind(null, t, n, e), s = void 0, !Pr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (s = !0), r ? s !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: s }) : e.addEventListener(t, n, !0) : s !== void 0 ? e.addEventListener(t, n, { passive: s }) : e.addEventListener(t, n, !1);
  }
  function ml(e, t, n, r, s) {
    var u = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var m = r.tag;
      if (m === 3 || m === 4) {
        var g = r.stateNode.containerInfo;
        if (g === s || g.nodeType === 8 && g.parentNode === s) break;
        if (m === 4) for (m = r.return; m !== null; ) {
          var S = m.tag;
          if ((S === 3 || S === 4) && (S = m.stateNode.containerInfo, S === s || S.nodeType === 8 && S.parentNode === s)) return;
          m = m.return;
        }
        for (; g !== null; ) {
          if (m = Eo(g), m === null) return;
          if (S = m.tag, S === 5 || S === 6) {
            r = u = m;
            continue e;
          }
          g = g.parentNode;
        }
      }
      r = r.return;
    }
    Ge(function() {
      var T = u, U = so(n), V = [];
      e: {
        var D = wc.get(e);
        if (D !== void 0) {
          var ne = Di, ae = e;
          switch (e) {
            case "keypress":
              if (jo(n) === 0) break e;
            case "keydown":
            case "keyup":
              ne = Pe;
              break;
            case "focusin":
              ae = "focus", ne = Q;
              break;
            case "focusout":
              ae = "blur", ne = Q;
              break;
            case "beforeblur":
            case "afterblur":
              ne = Q;
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
              ne = x;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ne = _;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ne = Rs;
              break;
            case mc:
            case yc:
            case vc:
              ne = B;
              break;
            case gc:
              ne = Ms;
              break;
            case "scroll":
              ne = il;
              break;
            case "wheel":
              ne = Ls;
              break;
            case "copy":
            case "cut":
            case "paste":
              ne = H;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ne = bn;
          }
          var ce = (t & 4) !== 0, lt = !ce && e === "scroll", I = ce ? D !== null ? D + "Capture" : null : D;
          ce = [];
          for (var E = T, $; E !== null; ) {
            $ = E;
            var Z = $.stateNode;
            if ($.tag === 5 && Z !== null && ($ = Z, I !== null && (Z = cr(E, I), Z != null && ce.push(Ki(E, Z, $)))), lt) break;
            E = E.return;
          }
          0 < ce.length && (D = new ne(D, ae, null, n, U), V.push({ event: D, listeners: ce }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (D = e === "mouseover" || e === "pointerover", ne = e === "mouseout" || e === "pointerout", D && n !== Sn && (ae = n.relatedTarget || n.fromElement) && (Eo(ae) || ae[hr])) break e;
          if ((ne || D) && (D = U.window === U ? U : (D = U.ownerDocument) ? D.defaultView || D.parentWindow : window, ne ? (ae = n.relatedTarget || n.toElement, ne = T, ae = ae ? Eo(ae) : null, ae !== null && (lt = Vn(ae), ae !== lt || ae.tag !== 5 && ae.tag !== 6) && (ae = null)) : (ne = null, ae = T), ne !== ae)) {
            if (ce = x, Z = "onMouseLeave", I = "onMouseEnter", E = "mouse", (e === "pointerout" || e === "pointerover") && (ce = bn, Z = "onPointerLeave", I = "onPointerEnter", E = "pointer"), lt = ne == null ? D : ni(ne), $ = ae == null ? D : ni(ae), D = new ce(Z, E + "leave", ne, n, U), D.target = lt, D.relatedTarget = $, Z = null, Eo(U) === T && (ce = new ce(I, E + "enter", ae, n, U), ce.target = $, ce.relatedTarget = lt, Z = ce), lt = Z, ne && ae) t: {
              for (ce = ne, I = ae, E = 0, $ = ce; $; $ = ei($)) E++;
              for ($ = 0, Z = I; Z; Z = ei(Z)) $++;
              for (; 0 < E - $; ) ce = ei(ce), E--;
              for (; 0 < $ - E; ) I = ei(I), $--;
              for (; E--; ) {
                if (ce === I || I !== null && ce === I.alternate) break t;
                ce = ei(ce), I = ei(I);
              }
              ce = null;
            }
            else ce = null;
            ne !== null && _c(V, D, ne, ce, !1), ae !== null && lt !== null && _c(V, lt, ae, ce, !0);
          }
        }
        e: {
          if (D = T ? ni(T) : window, ne = D.nodeName && D.nodeName.toLowerCase(), ne === "select" || ne === "input" && D.type === "file") var fe = jp;
          else if (en(D)) if (ic) fe = Cp;
          else {
            fe = _p;
            var we = Sp;
          }
          else (ne = D.nodeName) && ne.toLowerCase() === "input" && (D.type === "checkbox" || D.type === "radio") && (fe = Ep);
          if (fe && (fe = fe(e, T))) {
            zr(V, fe, n, U);
            break e;
          }
          we && we(e, D, T), e === "focusout" && (we = D._wrapperState) && we.controlled && D.type === "number" && ln(D, "number", D.value);
        }
        switch (we = T ? ni(T) : window, e) {
          case "focusin":
            (en(we) || we.contentEditable === "true") && (Xo = we, ul = T, Wi = null);
            break;
          case "focusout":
            Wi = ul = Xo = null;
            break;
          case "mousedown":
            cl = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            cl = !1, pc(V, n, U);
            break;
          case "selectionchange":
            if (Ap) break;
          case "keydown":
          case "keyup":
            pc(V, n, U);
        }
        var ke;
        if (Go) e: {
          switch (e) {
            case "compositionstart":
              var Se = "onCompositionStart";
              break e;
            case "compositionend":
              Se = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Se = "onCompositionUpdate";
              break e;
          }
          Se = void 0;
        }
        else Mr ? Or(e, n) && (Se = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Se = "onCompositionStart");
        Se && (pt && n.locale !== "ko" && (Mr || Se !== "onCompositionStart" ? Se === "onCompositionEnd" && Mr && (ke = Fi()) : (Cn = U, Li = "value" in Cn ? Cn.value : Cn.textContent, Mr = !0)), we = Zs(T, Se), 0 < we.length && (Se = new le(Se, e, null, n, U), V.push({ event: Se, listeners: we }), ke ? Se.data = ke : (ke = fn(n), ke !== null && (Se.data = ke)))), (ke = Je ? Us(e, n) : Bs(e, n)) && (T = Zs(T, "onBeforeInput"), 0 < T.length && (U = new le("onBeforeInput", "beforeinput", null, n, U), V.push({ event: U, listeners: T }), U.data = ke));
      }
      jc(V, t);
    });
  }
  function Ki(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Zs(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var s = e, u = s.stateNode;
      s.tag === 5 && u !== null && (s = u, u = cr(e, n), u != null && r.unshift(Ki(e, u, s)), u = cr(e, t), u != null && r.push(Ki(e, u, s))), e = e.return;
    }
    return r;
  }
  function ei(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function _c(e, t, n, r, s) {
    for (var u = t._reactName, m = []; n !== null && n !== r; ) {
      var g = n, S = g.alternate, T = g.stateNode;
      if (S !== null && S === r) break;
      g.tag === 5 && T !== null && (g = T, s ? (S = cr(n, u), S != null && m.unshift(Ki(n, S, g))) : s || (S = cr(n, u), S != null && m.push(Ki(n, S, g)))), n = n.return;
    }
    m.length !== 0 && e.push({ event: t, listeners: m });
  }
  var Tp = /\r\n?/g, Rp = /\u0000|\uFFFD/g;
  function Ec(e) {
    return (typeof e == "string" ? e : "" + e).replace(Tp, `
`).replace(Rp, "");
  }
  function Qs(e, t, n) {
    if (t = Ec(t), Ec(e) !== t && n) throw Error(a(425));
  }
  function Js() {
  }
  var yl = null, vl = null;
  function gl(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var wl = typeof setTimeout == "function" ? setTimeout : void 0, Op = typeof clearTimeout == "function" ? clearTimeout : void 0, Cc = typeof Promise == "function" ? Promise : void 0, Mp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Cc < "u" ? function(e) {
    return Cc.resolve(null).then(e).catch(zp);
  } : wl;
  function zp(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function kl(e, t) {
    var n = t, r = 0;
    do {
      var s = n.nextSibling;
      if (e.removeChild(n), s && s.nodeType === 8) if (n = s.data, n === "/$") {
        if (r === 0) {
          e.removeChild(s), En(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = s;
    } while (n);
    En(t);
  }
  function Fr(e) {
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
  function bc(e) {
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
  var ti = Math.random().toString(36).slice(2), Zn = "__reactFiber$" + ti, Zi = "__reactProps$" + ti, hr = "__reactContainer$" + ti, xl = "__reactEvents$" + ti, Lp = "__reactListeners$" + ti, Fp = "__reactHandles$" + ti;
  function Eo(e) {
    var t = e[Zn];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[hr] || n[Zn]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = bc(e); e !== null; ) {
          if (n = e[Zn]) return n;
          e = bc(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Qi(e) {
    return e = e[Zn] || e[hr], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function ni(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(a(33));
  }
  function Gs(e) {
    return e[Zi] || null;
  }
  var jl = [], ri = -1;
  function Dr(e) {
    return { current: e };
  }
  function tt(e) {
    0 > ri || (e.current = jl[ri], jl[ri] = null, ri--);
  }
  function Ye(e, t) {
    ri++, jl[ri] = e.current, e.current = t;
  }
  var Ur = {}, Et = Dr(Ur), Ut = Dr(!1), Co = Ur;
  function oi(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ur;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var s = {}, u;
    for (u in n) s[u] = t[u];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = s), s;
  }
  function Bt(e) {
    return e = e.childContextTypes, e != null;
  }
  function Xs() {
    tt(Ut), tt(Et);
  }
  function Pc(e, t, n) {
    if (Et.current !== Ur) throw Error(a(168));
    Ye(Et, t), Ye(Ut, n);
  }
  function Ac(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var s in r) if (!(s in t)) throw Error(a(108, Me(e) || "Unknown", s));
    return X({}, n, r);
  }
  function Ys(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ur, Co = Et.current, Ye(Et, e), Ye(Ut, Ut.current), !0;
  }
  function Ic(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(a(169));
    n ? (e = Ac(e, t, Co), r.__reactInternalMemoizedMergedChildContext = e, tt(Ut), tt(Et), Ye(Et, e)) : tt(Ut), Ye(Ut, n);
  }
  var mr = null, ea = !1, Sl = !1;
  function $c(e) {
    mr === null ? mr = [e] : mr.push(e);
  }
  function Dp(e) {
    ea = !0, $c(e);
  }
  function Br() {
    if (!Sl && mr !== null) {
      Sl = !0;
      var e = 0, t = Ve;
      try {
        var n = mr;
        for (Ve = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        mr = null, ea = !1;
      } catch (s) {
        throw mr !== null && (mr = mr.slice(e + 1)), fo(Ai, Br), s;
      } finally {
        Ve = t, Sl = !1;
      }
    }
    return null;
  }
  var ii = [], si = 0, ta = null, na = 0, pn = [], hn = 0, bo = null, yr = 1, vr = "";
  function Po(e, t) {
    ii[si++] = na, ii[si++] = ta, ta = e, na = t;
  }
  function Nc(e, t, n) {
    pn[hn++] = yr, pn[hn++] = vr, pn[hn++] = bo, bo = e;
    var r = yr;
    e = vr;
    var s = 32 - Yt(r) - 1;
    r &= ~(1 << s), n += 1;
    var u = 32 - Yt(t) + s;
    if (30 < u) {
      var m = s - s % 5;
      u = (r & (1 << m) - 1).toString(32), r >>= m, s -= m, yr = 1 << 32 - Yt(t) + s | n << s | r, vr = u + e;
    } else yr = 1 << u | n << s | r, vr = e;
  }
  function _l(e) {
    e.return !== null && (Po(e, 1), Nc(e, 1, 0));
  }
  function El(e) {
    for (; e === ta; ) ta = ii[--si], ii[si] = null, na = ii[--si], ii[si] = null;
    for (; e === bo; ) bo = pn[--hn], pn[hn] = null, vr = pn[--hn], pn[hn] = null, yr = pn[--hn], pn[hn] = null;
  }
  var tn = null, nn = null, rt = !1, In = null;
  function Tc(e, t) {
    var n = gn(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Rc(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, tn = e, nn = Fr(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, tn = e, nn = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = bo !== null ? { id: yr, overflow: vr } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = gn(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, tn = e, nn = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Cl(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function bl(e) {
    if (rt) {
      var t = nn;
      if (t) {
        var n = t;
        if (!Rc(e, t)) {
          if (Cl(e)) throw Error(a(418));
          t = Fr(n.nextSibling);
          var r = tn;
          t && Rc(e, t) ? Tc(r, n) : (e.flags = e.flags & -4097 | 2, rt = !1, tn = e);
        }
      } else {
        if (Cl(e)) throw Error(a(418));
        e.flags = e.flags & -4097 | 2, rt = !1, tn = e;
      }
    }
  }
  function Oc(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tn = e;
  }
  function ra(e) {
    if (e !== tn) return !1;
    if (!rt) return Oc(e), rt = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !gl(e.type, e.memoizedProps)), t && (t = nn)) {
      if (Cl(e)) throw Mc(), Error(a(418));
      for (; t; ) Tc(e, t), t = Fr(t.nextSibling);
    }
    if (Oc(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(a(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                nn = Fr(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        nn = null;
      }
    } else nn = tn ? Fr(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Mc() {
    for (var e = nn; e; ) e = Fr(e.nextSibling);
  }
  function ai() {
    nn = tn = null, rt = !1;
  }
  function Pl(e) {
    In === null ? In = [e] : In.push(e);
  }
  var Up = Ee.ReactCurrentBatchConfig;
  function Ji(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(a(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(a(147, e));
        var s = r, u = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === u ? t.ref : (t = function(m) {
          var g = s.refs;
          m === null ? delete g[u] : g[u] = m;
        }, t._stringRef = u, t);
      }
      if (typeof e != "string") throw Error(a(284));
      if (!n._owner) throw Error(a(290, e));
    }
    return e;
  }
  function oa(e, t) {
    throw e = Object.prototype.toString.call(t), Error(a(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function zc(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Lc(e) {
    function t(I, E) {
      if (e) {
        var $ = I.deletions;
        $ === null ? (I.deletions = [E], I.flags |= 16) : $.push(E);
      }
    }
    function n(I, E) {
      if (!e) return null;
      for (; E !== null; ) t(I, E), E = E.sibling;
      return null;
    }
    function r(I, E) {
      for (I = /* @__PURE__ */ new Map(); E !== null; ) E.key !== null ? I.set(E.key, E) : I.set(E.index, E), E = E.sibling;
      return I;
    }
    function s(I, E) {
      return I = Jr(I, E), I.index = 0, I.sibling = null, I;
    }
    function u(I, E, $) {
      return I.index = $, e ? ($ = I.alternate, $ !== null ? ($ = $.index, $ < E ? (I.flags |= 2, E) : $) : (I.flags |= 2, E)) : (I.flags |= 1048576, E);
    }
    function m(I) {
      return e && I.alternate === null && (I.flags |= 2), I;
    }
    function g(I, E, $, Z) {
      return E === null || E.tag !== 6 ? (E = wu($, I.mode, Z), E.return = I, E) : (E = s(E, $), E.return = I, E);
    }
    function S(I, E, $, Z) {
      var fe = $.type;
      return fe === se ? U(I, E, $.props.children, Z, $.key) : E !== null && (E.elementType === fe || typeof fe == "object" && fe !== null && fe.$$typeof === Re && zc(fe) === E.type) ? (Z = s(E, $.props), Z.ref = Ji(I, E, $), Z.return = I, Z) : (Z = Pa($.type, $.key, $.props, null, I.mode, Z), Z.ref = Ji(I, E, $), Z.return = I, Z);
    }
    function T(I, E, $, Z) {
      return E === null || E.tag !== 4 || E.stateNode.containerInfo !== $.containerInfo || E.stateNode.implementation !== $.implementation ? (E = ku($, I.mode, Z), E.return = I, E) : (E = s(E, $.children || []), E.return = I, E);
    }
    function U(I, E, $, Z, fe) {
      return E === null || E.tag !== 7 ? (E = Mo($, I.mode, Z, fe), E.return = I, E) : (E = s(E, $), E.return = I, E);
    }
    function V(I, E, $) {
      if (typeof E == "string" && E !== "" || typeof E == "number") return E = wu("" + E, I.mode, $), E.return = I, E;
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case Ae:
            return $ = Pa(E.type, E.key, E.props, null, I.mode, $), $.ref = Ji(I, null, E), $.return = I, $;
          case $e:
            return E = ku(E, I.mode, $), E.return = I, E;
          case Re:
            var Z = E._init;
            return V(I, Z(E._payload), $);
        }
        if (zn(E) || ee(E)) return E = Mo(E, I.mode, $, null), E.return = I, E;
        oa(I, E);
      }
      return null;
    }
    function D(I, E, $, Z) {
      var fe = E !== null ? E.key : null;
      if (typeof $ == "string" && $ !== "" || typeof $ == "number") return fe !== null ? null : g(I, E, "" + $, Z);
      if (typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case Ae:
            return $.key === fe ? S(I, E, $, Z) : null;
          case $e:
            return $.key === fe ? T(I, E, $, Z) : null;
          case Re:
            return fe = $._init, D(
              I,
              E,
              fe($._payload),
              Z
            );
        }
        if (zn($) || ee($)) return fe !== null ? null : U(I, E, $, Z, null);
        oa(I, $);
      }
      return null;
    }
    function ne(I, E, $, Z, fe) {
      if (typeof Z == "string" && Z !== "" || typeof Z == "number") return I = I.get($) || null, g(E, I, "" + Z, fe);
      if (typeof Z == "object" && Z !== null) {
        switch (Z.$$typeof) {
          case Ae:
            return I = I.get(Z.key === null ? $ : Z.key) || null, S(E, I, Z, fe);
          case $e:
            return I = I.get(Z.key === null ? $ : Z.key) || null, T(E, I, Z, fe);
          case Re:
            var we = Z._init;
            return ne(I, E, $, we(Z._payload), fe);
        }
        if (zn(Z) || ee(Z)) return I = I.get($) || null, U(E, I, Z, fe, null);
        oa(E, Z);
      }
      return null;
    }
    function ae(I, E, $, Z) {
      for (var fe = null, we = null, ke = E, Se = E = 0, wt = null; ke !== null && Se < $.length; Se++) {
        ke.index > Se ? (wt = ke, ke = null) : wt = ke.sibling;
        var Ke = D(I, ke, $[Se], Z);
        if (Ke === null) {
          ke === null && (ke = wt);
          break;
        }
        e && ke && Ke.alternate === null && t(I, ke), E = u(Ke, E, Se), we === null ? fe = Ke : we.sibling = Ke, we = Ke, ke = wt;
      }
      if (Se === $.length) return n(I, ke), rt && Po(I, Se), fe;
      if (ke === null) {
        for (; Se < $.length; Se++) ke = V(I, $[Se], Z), ke !== null && (E = u(ke, E, Se), we === null ? fe = ke : we.sibling = ke, we = ke);
        return rt && Po(I, Se), fe;
      }
      for (ke = r(I, ke); Se < $.length; Se++) wt = ne(ke, I, Se, $[Se], Z), wt !== null && (e && wt.alternate !== null && ke.delete(wt.key === null ? Se : wt.key), E = u(wt, E, Se), we === null ? fe = wt : we.sibling = wt, we = wt);
      return e && ke.forEach(function(Gr) {
        return t(I, Gr);
      }), rt && Po(I, Se), fe;
    }
    function ce(I, E, $, Z) {
      var fe = ee($);
      if (typeof fe != "function") throw Error(a(150));
      if ($ = fe.call($), $ == null) throw Error(a(151));
      for (var we = fe = null, ke = E, Se = E = 0, wt = null, Ke = $.next(); ke !== null && !Ke.done; Se++, Ke = $.next()) {
        ke.index > Se ? (wt = ke, ke = null) : wt = ke.sibling;
        var Gr = D(I, ke, Ke.value, Z);
        if (Gr === null) {
          ke === null && (ke = wt);
          break;
        }
        e && ke && Gr.alternate === null && t(I, ke), E = u(Gr, E, Se), we === null ? fe = Gr : we.sibling = Gr, we = Gr, ke = wt;
      }
      if (Ke.done) return n(
        I,
        ke
      ), rt && Po(I, Se), fe;
      if (ke === null) {
        for (; !Ke.done; Se++, Ke = $.next()) Ke = V(I, Ke.value, Z), Ke !== null && (E = u(Ke, E, Se), we === null ? fe = Ke : we.sibling = Ke, we = Ke);
        return rt && Po(I, Se), fe;
      }
      for (ke = r(I, ke); !Ke.done; Se++, Ke = $.next()) Ke = ne(ke, I, Se, Ke.value, Z), Ke !== null && (e && Ke.alternate !== null && ke.delete(Ke.key === null ? Se : Ke.key), E = u(Ke, E, Se), we === null ? fe = Ke : we.sibling = Ke, we = Ke);
      return e && ke.forEach(function(kh) {
        return t(I, kh);
      }), rt && Po(I, Se), fe;
    }
    function lt(I, E, $, Z) {
      if (typeof $ == "object" && $ !== null && $.type === se && $.key === null && ($ = $.props.children), typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case Ae:
            e: {
              for (var fe = $.key, we = E; we !== null; ) {
                if (we.key === fe) {
                  if (fe = $.type, fe === se) {
                    if (we.tag === 7) {
                      n(I, we.sibling), E = s(we, $.props.children), E.return = I, I = E;
                      break e;
                    }
                  } else if (we.elementType === fe || typeof fe == "object" && fe !== null && fe.$$typeof === Re && zc(fe) === we.type) {
                    n(I, we.sibling), E = s(we, $.props), E.ref = Ji(I, we, $), E.return = I, I = E;
                    break e;
                  }
                  n(I, we);
                  break;
                } else t(I, we);
                we = we.sibling;
              }
              $.type === se ? (E = Mo($.props.children, I.mode, Z, $.key), E.return = I, I = E) : (Z = Pa($.type, $.key, $.props, null, I.mode, Z), Z.ref = Ji(I, E, $), Z.return = I, I = Z);
            }
            return m(I);
          case $e:
            e: {
              for (we = $.key; E !== null; ) {
                if (E.key === we) if (E.tag === 4 && E.stateNode.containerInfo === $.containerInfo && E.stateNode.implementation === $.implementation) {
                  n(I, E.sibling), E = s(E, $.children || []), E.return = I, I = E;
                  break e;
                } else {
                  n(I, E);
                  break;
                }
                else t(I, E);
                E = E.sibling;
              }
              E = ku($, I.mode, Z), E.return = I, I = E;
            }
            return m(I);
          case Re:
            return we = $._init, lt(I, E, we($._payload), Z);
        }
        if (zn($)) return ae(I, E, $, Z);
        if (ee($)) return ce(I, E, $, Z);
        oa(I, $);
      }
      return typeof $ == "string" && $ !== "" || typeof $ == "number" ? ($ = "" + $, E !== null && E.tag === 6 ? (n(I, E.sibling), E = s(E, $), E.return = I, I = E) : (n(I, E), E = wu($, I.mode, Z), E.return = I, I = E), m(I)) : n(I, E);
    }
    return lt;
  }
  var li = Lc(!0), Fc = Lc(!1), ia = Dr(null), sa = null, ui = null, Al = null;
  function Il() {
    Al = ui = sa = null;
  }
  function $l(e) {
    var t = ia.current;
    tt(ia), e._currentValue = t;
  }
  function Nl(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function ci(e, t) {
    sa = e, Al = ui = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Vt = !0), e.firstContext = null);
  }
  function mn(e) {
    var t = e._currentValue;
    if (Al !== e) if (e = { context: e, memoizedValue: t, next: null }, ui === null) {
      if (sa === null) throw Error(a(308));
      ui = e, sa.dependencies = { lanes: 0, firstContext: e };
    } else ui = ui.next = e;
    return t;
  }
  var Ao = null;
  function Tl(e) {
    Ao === null ? Ao = [e] : Ao.push(e);
  }
  function Dc(e, t, n, r) {
    var s = t.interleaved;
    return s === null ? (n.next = n, Tl(t)) : (n.next = s.next, s.next = n), t.interleaved = n, gr(e, r);
  }
  function gr(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Vr = !1;
  function Rl(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Uc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function wr(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wr(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (We & 2) !== 0) {
      var s = r.pending;
      return s === null ? t.next = t : (t.next = s.next, s.next = t), r.pending = t, gr(e, n);
    }
    return s = r.interleaved, s === null ? (t.next = t, Tl(r)) : (t.next = s.next, s.next = t), r.interleaved = t, gr(e, n);
  }
  function aa(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, vo(e, n);
    }
  }
  function Bc(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var s = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var m = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          u === null ? s = u = m : u = u.next = m, n = n.next;
        } while (n !== null);
        u === null ? s = u = t : u = u.next = t;
      } else s = u = t;
      n = { baseState: r.baseState, firstBaseUpdate: s, lastBaseUpdate: u, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function la(e, t, n, r) {
    var s = e.updateQueue;
    Vr = !1;
    var u = s.firstBaseUpdate, m = s.lastBaseUpdate, g = s.shared.pending;
    if (g !== null) {
      s.shared.pending = null;
      var S = g, T = S.next;
      S.next = null, m === null ? u = T : m.next = T, m = S;
      var U = e.alternate;
      U !== null && (U = U.updateQueue, g = U.lastBaseUpdate, g !== m && (g === null ? U.firstBaseUpdate = T : g.next = T, U.lastBaseUpdate = S));
    }
    if (u !== null) {
      var V = s.baseState;
      m = 0, U = T = S = null, g = u;
      do {
        var D = g.lane, ne = g.eventTime;
        if ((r & D) === D) {
          U !== null && (U = U.next = {
            eventTime: ne,
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          });
          e: {
            var ae = e, ce = g;
            switch (D = t, ne = n, ce.tag) {
              case 1:
                if (ae = ce.payload, typeof ae == "function") {
                  V = ae.call(ne, V, D);
                  break e;
                }
                V = ae;
                break e;
              case 3:
                ae.flags = ae.flags & -65537 | 128;
              case 0:
                if (ae = ce.payload, D = typeof ae == "function" ? ae.call(ne, V, D) : ae, D == null) break e;
                V = X({}, V, D);
                break e;
              case 2:
                Vr = !0;
            }
          }
          g.callback !== null && g.lane !== 0 && (e.flags |= 64, D = s.effects, D === null ? s.effects = [g] : D.push(g));
        } else ne = { eventTime: ne, lane: D, tag: g.tag, payload: g.payload, callback: g.callback, next: null }, U === null ? (T = U = ne, S = V) : U = U.next = ne, m |= D;
        if (g = g.next, g === null) {
          if (g = s.shared.pending, g === null) break;
          D = g, g = D.next, D.next = null, s.lastBaseUpdate = D, s.shared.pending = null;
        }
      } while (!0);
      if (U === null && (S = V), s.baseState = S, s.firstBaseUpdate = T, s.lastBaseUpdate = U, t = s.shared.interleaved, t !== null) {
        s = t;
        do
          m |= s.lane, s = s.next;
        while (s !== t);
      } else u === null && (s.shared.lanes = 0);
      No |= m, e.lanes = m, e.memoizedState = V;
    }
  }
  function Vc(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], s = r.callback;
      if (s !== null) {
        if (r.callback = null, r = n, typeof s != "function") throw Error(a(191, s));
        s.call(r);
      }
    }
  }
  var Gi = {}, Qn = Dr(Gi), Xi = Dr(Gi), Yi = Dr(Gi);
  function Io(e) {
    if (e === Gi) throw Error(a(174));
    return e;
  }
  function Ol(e, t) {
    switch (Ye(Yi, t), Ye(Xi, e), Ye(Qn, Gi), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : zt(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = zt(t, e);
    }
    tt(Qn), Ye(Qn, t);
  }
  function di() {
    tt(Qn), tt(Xi), tt(Yi);
  }
  function Wc(e) {
    Io(Yi.current);
    var t = Io(Qn.current), n = zt(t, e.type);
    t !== n && (Ye(Xi, e), Ye(Qn, n));
  }
  function Ml(e) {
    Xi.current === e && (tt(Qn), tt(Xi));
  }
  var ot = Dr(0);
  function ua(e) {
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
  var zl = [];
  function Ll() {
    for (var e = 0; e < zl.length; e++) zl[e]._workInProgressVersionPrimary = null;
    zl.length = 0;
  }
  var ca = Ee.ReactCurrentDispatcher, Fl = Ee.ReactCurrentBatchConfig, $o = 0, it = null, ht = null, vt = null, da = !1, es = !1, ts = 0, Bp = 0;
  function Ct() {
    throw Error(a(321));
  }
  function Dl(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!An(e[n], t[n])) return !1;
    return !0;
  }
  function Ul(e, t, n, r, s, u) {
    if ($o = u, it = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ca.current = e === null || e.memoizedState === null ? qp : Kp, e = n(r, s), es) {
      u = 0;
      do {
        if (es = !1, ts = 0, 25 <= u) throw Error(a(301));
        u += 1, vt = ht = null, t.updateQueue = null, ca.current = Zp, e = n(r, s);
      } while (es);
    }
    if (ca.current = ha, t = ht !== null && ht.next !== null, $o = 0, vt = ht = it = null, da = !1, t) throw Error(a(300));
    return e;
  }
  function Bl() {
    var e = ts !== 0;
    return ts = 0, e;
  }
  function Jn() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return vt === null ? it.memoizedState = vt = e : vt = vt.next = e, vt;
  }
  function yn() {
    if (ht === null) {
      var e = it.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = ht.next;
    var t = vt === null ? it.memoizedState : vt.next;
    if (t !== null) vt = t, ht = e;
    else {
      if (e === null) throw Error(a(310));
      ht = e, e = { memoizedState: ht.memoizedState, baseState: ht.baseState, baseQueue: ht.baseQueue, queue: ht.queue, next: null }, vt === null ? it.memoizedState = vt = e : vt = vt.next = e;
    }
    return vt;
  }
  function ns(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Vl(e) {
    var t = yn(), n = t.queue;
    if (n === null) throw Error(a(311));
    n.lastRenderedReducer = e;
    var r = ht, s = r.baseQueue, u = n.pending;
    if (u !== null) {
      if (s !== null) {
        var m = s.next;
        s.next = u.next, u.next = m;
      }
      r.baseQueue = s = u, n.pending = null;
    }
    if (s !== null) {
      u = s.next, r = r.baseState;
      var g = m = null, S = null, T = u;
      do {
        var U = T.lane;
        if (($o & U) === U) S !== null && (S = S.next = { lane: 0, action: T.action, hasEagerState: T.hasEagerState, eagerState: T.eagerState, next: null }), r = T.hasEagerState ? T.eagerState : e(r, T.action);
        else {
          var V = {
            lane: U,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null
          };
          S === null ? (g = S = V, m = r) : S = S.next = V, it.lanes |= U, No |= U;
        }
        T = T.next;
      } while (T !== null && T !== u);
      S === null ? m = r : S.next = g, An(r, t.memoizedState) || (Vt = !0), t.memoizedState = r, t.baseState = m, t.baseQueue = S, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      s = e;
      do
        u = s.lane, it.lanes |= u, No |= u, s = s.next;
      while (s !== e);
    } else s === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Wl(e) {
    var t = yn(), n = t.queue;
    if (n === null) throw Error(a(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, s = n.pending, u = t.memoizedState;
    if (s !== null) {
      n.pending = null;
      var m = s = s.next;
      do
        u = e(u, m.action), m = m.next;
      while (m !== s);
      An(u, t.memoizedState) || (Vt = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, r];
  }
  function Hc() {
  }
  function qc(e, t) {
    var n = it, r = yn(), s = t(), u = !An(r.memoizedState, s);
    if (u && (r.memoizedState = s, Vt = !0), r = r.queue, Hl(Qc.bind(null, n, r, e), [e]), r.getSnapshot !== t || u || vt !== null && vt.memoizedState.tag & 1) {
      if (n.flags |= 2048, rs(9, Zc.bind(null, n, r, s, t), void 0, null), gt === null) throw Error(a(349));
      ($o & 30) !== 0 || Kc(n, t, s);
    }
    return s;
  }
  function Kc(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = it.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, it.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Zc(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Jc(t) && Gc(e);
  }
  function Qc(e, t, n) {
    return n(function() {
      Jc(t) && Gc(e);
    });
  }
  function Jc(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !An(e, n);
    } catch {
      return !0;
    }
  }
  function Gc(e) {
    var t = gr(e, 1);
    t !== null && Rn(t, e, 1, -1);
  }
  function Xc(e) {
    var t = Jn();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ns, lastRenderedState: e }, t.queue = e, e = e.dispatch = Hp.bind(null, it, e), [t.memoizedState, e];
  }
  function rs(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = it.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, it.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Yc() {
    return yn().memoizedState;
  }
  function fa(e, t, n, r) {
    var s = Jn();
    it.flags |= e, s.memoizedState = rs(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function pa(e, t, n, r) {
    var s = yn();
    r = r === void 0 ? null : r;
    var u = void 0;
    if (ht !== null) {
      var m = ht.memoizedState;
      if (u = m.destroy, r !== null && Dl(r, m.deps)) {
        s.memoizedState = rs(t, n, u, r);
        return;
      }
    }
    it.flags |= e, s.memoizedState = rs(1 | t, n, u, r);
  }
  function ed(e, t) {
    return fa(8390656, 8, e, t);
  }
  function Hl(e, t) {
    return pa(2048, 8, e, t);
  }
  function td(e, t) {
    return pa(4, 2, e, t);
  }
  function nd(e, t) {
    return pa(4, 4, e, t);
  }
  function rd(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function od(e, t, n) {
    return n = n != null ? n.concat([e]) : null, pa(4, 4, rd.bind(null, t, e), n);
  }
  function ql() {
  }
  function id(e, t) {
    var n = yn();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Dl(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function sd(e, t) {
    var n = yn();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Dl(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function ad(e, t, n) {
    return ($o & 21) === 0 ? (e.baseState && (e.baseState = !1, Vt = !0), e.memoizedState = n) : (An(n, t) || (n = _s(), it.lanes |= n, No |= n, e.baseState = !0), t);
  }
  function Vp(e, t) {
    var n = Ve;
    Ve = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Fl.transition;
    Fl.transition = {};
    try {
      e(!1), t();
    } finally {
      Ve = n, Fl.transition = r;
    }
  }
  function ld() {
    return yn().memoizedState;
  }
  function Wp(e, t, n) {
    var r = Zr(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, ud(e)) cd(t, n);
    else if (n = Dc(e, t, n, r), n !== null) {
      var s = Rt();
      Rn(n, e, r, s), dd(n, t, r);
    }
  }
  function Hp(e, t, n) {
    var r = Zr(e), s = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (ud(e)) cd(t, s);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null)) try {
        var m = t.lastRenderedState, g = u(m, n);
        if (s.hasEagerState = !0, s.eagerState = g, An(g, m)) {
          var S = t.interleaved;
          S === null ? (s.next = s, Tl(t)) : (s.next = S.next, S.next = s), t.interleaved = s;
          return;
        }
      } catch {
      } finally {
      }
      n = Dc(e, t, s, r), n !== null && (s = Rt(), Rn(n, e, r, s), dd(n, t, r));
    }
  }
  function ud(e) {
    var t = e.alternate;
    return e === it || t !== null && t === it;
  }
  function cd(e, t) {
    es = da = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function dd(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, vo(e, n);
    }
  }
  var ha = { readContext: mn, useCallback: Ct, useContext: Ct, useEffect: Ct, useImperativeHandle: Ct, useInsertionEffect: Ct, useLayoutEffect: Ct, useMemo: Ct, useReducer: Ct, useRef: Ct, useState: Ct, useDebugValue: Ct, useDeferredValue: Ct, useTransition: Ct, useMutableSource: Ct, useSyncExternalStore: Ct, useId: Ct, unstable_isNewReconciler: !1 }, qp = { readContext: mn, useCallback: function(e, t) {
    return Jn().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: mn, useEffect: ed, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, fa(
      4194308,
      4,
      rd.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return fa(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return fa(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Jn();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Jn();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Wp.bind(null, it, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Jn();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Xc, useDebugValue: ql, useDeferredValue: function(e) {
    return Jn().memoizedState = e;
  }, useTransition: function() {
    var e = Xc(!1), t = e[0];
    return e = Vp.bind(null, e[1]), Jn().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = it, s = Jn();
    if (rt) {
      if (n === void 0) throw Error(a(407));
      n = n();
    } else {
      if (n = t(), gt === null) throw Error(a(349));
      ($o & 30) !== 0 || Kc(r, t, n);
    }
    s.memoizedState = n;
    var u = { value: n, getSnapshot: t };
    return s.queue = u, ed(Qc.bind(
      null,
      r,
      u,
      e
    ), [e]), r.flags |= 2048, rs(9, Zc.bind(null, r, u, n, t), void 0, null), n;
  }, useId: function() {
    var e = Jn(), t = gt.identifierPrefix;
    if (rt) {
      var n = vr, r = yr;
      n = (r & ~(1 << 32 - Yt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = ts++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Bp++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Kp = {
    readContext: mn,
    useCallback: id,
    useContext: mn,
    useEffect: Hl,
    useImperativeHandle: od,
    useInsertionEffect: td,
    useLayoutEffect: nd,
    useMemo: sd,
    useReducer: Vl,
    useRef: Yc,
    useState: function() {
      return Vl(ns);
    },
    useDebugValue: ql,
    useDeferredValue: function(e) {
      var t = yn();
      return ad(t, ht.memoizedState, e);
    },
    useTransition: function() {
      var e = Vl(ns)[0], t = yn().memoizedState;
      return [e, t];
    },
    useMutableSource: Hc,
    useSyncExternalStore: qc,
    useId: ld,
    unstable_isNewReconciler: !1
  }, Zp = { readContext: mn, useCallback: id, useContext: mn, useEffect: Hl, useImperativeHandle: od, useInsertionEffect: td, useLayoutEffect: nd, useMemo: sd, useReducer: Wl, useRef: Yc, useState: function() {
    return Wl(ns);
  }, useDebugValue: ql, useDeferredValue: function(e) {
    var t = yn();
    return ht === null ? t.memoizedState = e : ad(t, ht.memoizedState, e);
  }, useTransition: function() {
    var e = Wl(ns)[0], t = yn().memoizedState;
    return [e, t];
  }, useMutableSource: Hc, useSyncExternalStore: qc, useId: ld, unstable_isNewReconciler: !1 };
  function $n(e, t) {
    if (e && e.defaultProps) {
      t = X({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function Kl(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : X({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var ma = { isMounted: function(e) {
    return (e = e._reactInternals) ? Vn(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Rt(), s = Zr(e), u = wr(r, s);
    u.payload = t, n != null && (u.callback = n), t = Wr(e, u, s), t !== null && (Rn(t, e, s, r), aa(t, e, s));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Rt(), s = Zr(e), u = wr(r, s);
    u.tag = 1, u.payload = t, n != null && (u.callback = n), t = Wr(e, u, s), t !== null && (Rn(t, e, s, r), aa(t, e, s));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Rt(), r = Zr(e), s = wr(n, r);
    s.tag = 2, t != null && (s.callback = t), t = Wr(e, s, r), t !== null && (Rn(t, e, r, n), aa(t, e, r));
  } };
  function fd(e, t, n, r, s, u, m) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, u, m) : t.prototype && t.prototype.isPureReactComponent ? !Vi(n, r) || !Vi(s, u) : !0;
  }
  function pd(e, t, n) {
    var r = !1, s = Ur, u = t.contextType;
    return typeof u == "object" && u !== null ? u = mn(u) : (s = Bt(t) ? Co : Et.current, r = t.contextTypes, u = (r = r != null) ? oi(e, s) : Ur), t = new t(n, u), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = ma, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = s, e.__reactInternalMemoizedMaskedChildContext = u), t;
  }
  function hd(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && ma.enqueueReplaceState(t, t.state, null);
  }
  function Zl(e, t, n, r) {
    var s = e.stateNode;
    s.props = n, s.state = e.memoizedState, s.refs = {}, Rl(e);
    var u = t.contextType;
    typeof u == "object" && u !== null ? s.context = mn(u) : (u = Bt(t) ? Co : Et.current, s.context = oi(e, u)), s.state = e.memoizedState, u = t.getDerivedStateFromProps, typeof u == "function" && (Kl(e, t, u, n), s.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (t = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), t !== s.state && ma.enqueueReplaceState(s, s.state, null), la(e, n, s, r), s.state = e.memoizedState), typeof s.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function fi(e, t) {
    try {
      var n = "", r = t;
      do
        n += de(r), r = r.return;
      while (r);
      var s = n;
    } catch (u) {
      s = `
Error generating stack: ` + u.message + `
` + u.stack;
    }
    return { value: e, source: t, stack: s, digest: null };
  }
  function Ql(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function Jl(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Qp = typeof WeakMap == "function" ? WeakMap : Map;
  function md(e, t, n) {
    n = wr(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      ja || (ja = !0, du = r), Jl(e, t);
    }, n;
  }
  function yd(e, t, n) {
    n = wr(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var s = t.value;
      n.payload = function() {
        return r(s);
      }, n.callback = function() {
        Jl(e, t);
      };
    }
    var u = e.stateNode;
    return u !== null && typeof u.componentDidCatch == "function" && (n.callback = function() {
      Jl(e, t), typeof r != "function" && (qr === null ? qr = /* @__PURE__ */ new Set([this]) : qr.add(this));
      var m = t.stack;
      this.componentDidCatch(t.value, { componentStack: m !== null ? m : "" });
    }), n;
  }
  function vd(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Qp();
      var s = /* @__PURE__ */ new Set();
      r.set(t, s);
    } else s = r.get(t), s === void 0 && (s = /* @__PURE__ */ new Set(), r.set(t, s));
    s.has(n) || (s.add(n), e = uh.bind(null, e, t, n), t.then(e, e));
  }
  function gd(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function wd(e, t, n, r, s) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = wr(-1, 1), t.tag = 2, Wr(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = s, e);
  }
  var Jp = Ee.ReactCurrentOwner, Vt = !1;
  function Tt(e, t, n, r) {
    t.child = e === null ? Fc(t, null, n, r) : li(t, e.child, n, r);
  }
  function kd(e, t, n, r, s) {
    n = n.render;
    var u = t.ref;
    return ci(t, s), r = Ul(e, t, n, r, u, s), n = Bl(), e !== null && !Vt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~s, kr(e, t, s)) : (rt && n && _l(t), t.flags |= 1, Tt(e, t, r, s), t.child);
  }
  function xd(e, t, n, r, s) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !gu(u) && u.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = u, jd(e, t, u, r, s)) : (e = Pa(n.type, null, r, t, t.mode, s), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, (e.lanes & s) === 0) {
      var m = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Vi, n(m, r) && e.ref === t.ref) return kr(e, t, s);
    }
    return t.flags |= 1, e = Jr(u, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function jd(e, t, n, r, s) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Vi(u, r) && e.ref === t.ref) if (Vt = !1, t.pendingProps = r = u, (e.lanes & s) !== 0) (e.flags & 131072) !== 0 && (Vt = !0);
      else return t.lanes = e.lanes, kr(e, t, s);
    }
    return Gl(e, t, n, r, s);
  }
  function Sd(e, t, n) {
    var r = t.pendingProps, s = r.children, u = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ye(hi, rn), rn |= n;
    else {
      if ((n & 1073741824) === 0) return e = u !== null ? u.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Ye(hi, rn), rn |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = u !== null ? u.baseLanes : n, Ye(hi, rn), rn |= r;
    }
    else u !== null ? (r = u.baseLanes | n, t.memoizedState = null) : r = n, Ye(hi, rn), rn |= r;
    return Tt(e, t, s, n), t.child;
  }
  function _d(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Gl(e, t, n, r, s) {
    var u = Bt(n) ? Co : Et.current;
    return u = oi(t, u), ci(t, s), n = Ul(e, t, n, r, u, s), r = Bl(), e !== null && !Vt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~s, kr(e, t, s)) : (rt && r && _l(t), t.flags |= 1, Tt(e, t, n, s), t.child);
  }
  function Ed(e, t, n, r, s) {
    if (Bt(n)) {
      var u = !0;
      Ys(t);
    } else u = !1;
    if (ci(t, s), t.stateNode === null) va(e, t), pd(t, n, r), Zl(t, n, r, s), r = !0;
    else if (e === null) {
      var m = t.stateNode, g = t.memoizedProps;
      m.props = g;
      var S = m.context, T = n.contextType;
      typeof T == "object" && T !== null ? T = mn(T) : (T = Bt(n) ? Co : Et.current, T = oi(t, T));
      var U = n.getDerivedStateFromProps, V = typeof U == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      V || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (g !== r || S !== T) && hd(t, m, r, T), Vr = !1;
      var D = t.memoizedState;
      m.state = D, la(t, r, m, s), S = t.memoizedState, g !== r || D !== S || Ut.current || Vr ? (typeof U == "function" && (Kl(t, n, U, r), S = t.memoizedState), (g = Vr || fd(t, n, g, r, D, S, T)) ? (V || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = S), m.props = r, m.state = S, m.context = T, r = g) : (typeof m.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      m = t.stateNode, Uc(e, t), g = t.memoizedProps, T = t.type === t.elementType ? g : $n(t.type, g), m.props = T, V = t.pendingProps, D = m.context, S = n.contextType, typeof S == "object" && S !== null ? S = mn(S) : (S = Bt(n) ? Co : Et.current, S = oi(t, S));
      var ne = n.getDerivedStateFromProps;
      (U = typeof ne == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (g !== V || D !== S) && hd(t, m, r, S), Vr = !1, D = t.memoizedState, m.state = D, la(t, r, m, s);
      var ae = t.memoizedState;
      g !== V || D !== ae || Ut.current || Vr ? (typeof ne == "function" && (Kl(t, n, ne, r), ae = t.memoizedState), (T = Vr || fd(t, n, T, r, D, ae, S) || !1) ? (U || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(r, ae, S), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(r, ae, S)), typeof m.componentDidUpdate == "function" && (t.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || g === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || g === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = ae), m.props = r, m.state = ae, m.context = S, r = T) : (typeof m.componentDidUpdate != "function" || g === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || g === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return Xl(e, t, n, r, u, s);
  }
  function Xl(e, t, n, r, s, u) {
    _d(e, t);
    var m = (t.flags & 128) !== 0;
    if (!r && !m) return s && Ic(t, n, !1), kr(e, t, u);
    r = t.stateNode, Jp.current = t;
    var g = m && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && m ? (t.child = li(t, e.child, null, u), t.child = li(t, null, g, u)) : Tt(e, t, g, u), t.memoizedState = r.state, s && Ic(t, n, !0), t.child;
  }
  function Cd(e) {
    var t = e.stateNode;
    t.pendingContext ? Pc(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Pc(e, t.context, !1), Ol(e, t.containerInfo);
  }
  function bd(e, t, n, r, s) {
    return ai(), Pl(s), t.flags |= 256, Tt(e, t, n, r), t.child;
  }
  var Yl = { dehydrated: null, treeContext: null, retryLane: 0 };
  function eu(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Pd(e, t, n) {
    var r = t.pendingProps, s = ot.current, u = !1, m = (t.flags & 128) !== 0, g;
    if ((g = m) || (g = e !== null && e.memoizedState === null ? !1 : (s & 2) !== 0), g ? (u = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (s |= 1), Ye(ot, s & 1), e === null)
      return bl(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (m = r.children, e = r.fallback, u ? (r = t.mode, u = t.child, m = { mode: "hidden", children: m }, (r & 1) === 0 && u !== null ? (u.childLanes = 0, u.pendingProps = m) : u = Aa(m, r, 0, null), e = Mo(e, r, n, null), u.return = t, e.return = t, u.sibling = e, t.child = u, t.child.memoizedState = eu(n), t.memoizedState = Yl, e) : tu(t, m));
    if (s = e.memoizedState, s !== null && (g = s.dehydrated, g !== null)) return Gp(e, t, m, r, g, s, n);
    if (u) {
      u = r.fallback, m = t.mode, s = e.child, g = s.sibling;
      var S = { mode: "hidden", children: r.children };
      return (m & 1) === 0 && t.child !== s ? (r = t.child, r.childLanes = 0, r.pendingProps = S, t.deletions = null) : (r = Jr(s, S), r.subtreeFlags = s.subtreeFlags & 14680064), g !== null ? u = Jr(g, u) : (u = Mo(u, m, n, null), u.flags |= 2), u.return = t, r.return = t, r.sibling = u, t.child = r, r = u, u = t.child, m = e.child.memoizedState, m = m === null ? eu(n) : { baseLanes: m.baseLanes | n, cachePool: null, transitions: m.transitions }, u.memoizedState = m, u.childLanes = e.childLanes & ~n, t.memoizedState = Yl, r;
    }
    return u = e.child, e = u.sibling, r = Jr(u, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function tu(e, t) {
    return t = Aa({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function ya(e, t, n, r) {
    return r !== null && Pl(r), li(t, e.child, null, n), e = tu(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Gp(e, t, n, r, s, u, m) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = Ql(Error(a(422))), ya(e, t, m, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (u = r.fallback, s = t.mode, r = Aa({ mode: "visible", children: r.children }, s, 0, null), u = Mo(u, s, m, null), u.flags |= 2, r.return = t, u.return = t, r.sibling = u, t.child = r, (t.mode & 1) !== 0 && li(t, e.child, null, m), t.child.memoizedState = eu(m), t.memoizedState = Yl, u);
    if ((t.mode & 1) === 0) return ya(e, t, m, null);
    if (s.data === "$!") {
      if (r = s.nextSibling && s.nextSibling.dataset, r) var g = r.dgst;
      return r = g, u = Error(a(419)), r = Ql(u, r, void 0), ya(e, t, m, r);
    }
    if (g = (m & e.childLanes) !== 0, Vt || g) {
      if (r = gt, r !== null) {
        switch (m & -m) {
          case 4:
            s = 2;
            break;
          case 16:
            s = 8;
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
            s = 32;
            break;
          case 536870912:
            s = 268435456;
            break;
          default:
            s = 0;
        }
        s = (s & (r.suspendedLanes | m)) !== 0 ? 0 : s, s !== 0 && s !== u.retryLane && (u.retryLane = s, gr(e, s), Rn(r, e, s, -1));
      }
      return vu(), r = Ql(Error(a(421))), ya(e, t, m, r);
    }
    return s.data === "$?" ? (t.flags |= 128, t.child = e.child, t = ch.bind(null, e), s._reactRetry = t, null) : (e = u.treeContext, nn = Fr(s.nextSibling), tn = t, rt = !0, In = null, e !== null && (pn[hn++] = yr, pn[hn++] = vr, pn[hn++] = bo, yr = e.id, vr = e.overflow, bo = t), t = tu(t, r.children), t.flags |= 4096, t);
  }
  function Ad(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Nl(e.return, t, n);
  }
  function nu(e, t, n, r, s) {
    var u = e.memoizedState;
    u === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: s } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = r, u.tail = n, u.tailMode = s);
  }
  function Id(e, t, n) {
    var r = t.pendingProps, s = r.revealOrder, u = r.tail;
    if (Tt(e, t, r.children, n), r = ot.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Ad(e, n, t);
        else if (e.tag === 19) Ad(e, n, t);
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
    if (Ye(ot, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (s) {
      case "forwards":
        for (n = t.child, s = null; n !== null; ) e = n.alternate, e !== null && ua(e) === null && (s = n), n = n.sibling;
        n = s, n === null ? (s = t.child, t.child = null) : (s = n.sibling, n.sibling = null), nu(t, !1, s, n, u);
        break;
      case "backwards":
        for (n = null, s = t.child, t.child = null; s !== null; ) {
          if (e = s.alternate, e !== null && ua(e) === null) {
            t.child = s;
            break;
          }
          e = s.sibling, s.sibling = n, n = s, s = e;
        }
        nu(t, !0, n, null, u);
        break;
      case "together":
        nu(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function va(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function kr(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), No |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(a(153));
    if (t.child !== null) {
      for (e = t.child, n = Jr(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Jr(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Xp(e, t, n) {
    switch (t.tag) {
      case 3:
        Cd(t), ai();
        break;
      case 5:
        Wc(t);
        break;
      case 1:
        Bt(t.type) && Ys(t);
        break;
      case 4:
        Ol(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, s = t.memoizedProps.value;
        Ye(ia, r._currentValue), r._currentValue = s;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (Ye(ot, ot.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Pd(e, t, n) : (Ye(ot, ot.current & 1), e = kr(e, t, n), e !== null ? e.sibling : null);
        Ye(ot, ot.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return Id(e, t, n);
          t.flags |= 128;
        }
        if (s = t.memoizedState, s !== null && (s.rendering = null, s.tail = null, s.lastEffect = null), Ye(ot, ot.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Sd(e, t, n);
    }
    return kr(e, t, n);
  }
  var $d, ru, Nd, Td;
  $d = function(e, t) {
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
  }, ru = function() {
  }, Nd = function(e, t, n, r) {
    var s = e.memoizedProps;
    if (s !== r) {
      e = t.stateNode, Io(Qn.current);
      var u = null;
      switch (n) {
        case "input":
          s = ir(e, s), r = ir(e, r), u = [];
          break;
        case "select":
          s = X({}, s, { value: void 0 }), r = X({}, r, { value: void 0 }), u = [];
          break;
        case "textarea":
          s = no(e, s), r = no(e, r), u = [];
          break;
        default:
          typeof s.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Js);
      }
      oo(n, r);
      var m;
      n = null;
      for (T in s) if (!r.hasOwnProperty(T) && s.hasOwnProperty(T) && s[T] != null) if (T === "style") {
        var g = s[T];
        for (m in g) g.hasOwnProperty(m) && (n || (n = {}), n[m] = "");
      } else T !== "dangerouslySetInnerHTML" && T !== "children" && T !== "suppressContentEditableWarning" && T !== "suppressHydrationWarning" && T !== "autoFocus" && (d.hasOwnProperty(T) ? u || (u = []) : (u = u || []).push(T, null));
      for (T in r) {
        var S = r[T];
        if (g = s != null ? s[T] : void 0, r.hasOwnProperty(T) && S !== g && (S != null || g != null)) if (T === "style") if (g) {
          for (m in g) !g.hasOwnProperty(m) || S && S.hasOwnProperty(m) || (n || (n = {}), n[m] = "");
          for (m in S) S.hasOwnProperty(m) && g[m] !== S[m] && (n || (n = {}), n[m] = S[m]);
        } else n || (u || (u = []), u.push(
          T,
          n
        )), n = S;
        else T === "dangerouslySetInnerHTML" ? (S = S ? S.__html : void 0, g = g ? g.__html : void 0, S != null && g !== S && (u = u || []).push(T, S)) : T === "children" ? typeof S != "string" && typeof S != "number" || (u = u || []).push(T, "" + S) : T !== "suppressContentEditableWarning" && T !== "suppressHydrationWarning" && (d.hasOwnProperty(T) ? (S != null && T === "onScroll" && et("scroll", e), u || g === S || (u = [])) : (u = u || []).push(T, S));
      }
      n && (u = u || []).push("style", n);
      var T = u;
      (t.updateQueue = T) && (t.flags |= 4);
    }
  }, Td = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function os(e, t) {
    if (!rt) switch (e.tailMode) {
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
  function bt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var s = e.child; s !== null; ) n |= s.lanes | s.childLanes, r |= s.subtreeFlags & 14680064, r |= s.flags & 14680064, s.return = e, s = s.sibling;
    else for (s = e.child; s !== null; ) n |= s.lanes | s.childLanes, r |= s.subtreeFlags, r |= s.flags, s.return = e, s = s.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Yp(e, t, n) {
    var r = t.pendingProps;
    switch (El(t), t.tag) {
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
        return bt(t), null;
      case 1:
        return Bt(t.type) && Xs(), bt(t), null;
      case 3:
        return r = t.stateNode, di(), tt(Ut), tt(Et), Ll(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ra(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, In !== null && (hu(In), In = null))), ru(e, t), bt(t), null;
      case 5:
        Ml(t);
        var s = Io(Yi.current);
        if (n = t.type, e !== null && t.stateNode != null) Nd(e, t, n, r, s), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(a(166));
            return bt(t), null;
          }
          if (e = Io(Qn.current), ra(t)) {
            r = t.stateNode, n = t.type;
            var u = t.memoizedProps;
            switch (r[Zn] = t, r[Zi] = u, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                et("cancel", r), et("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                et("load", r);
                break;
              case "video":
              case "audio":
                for (s = 0; s < Hi.length; s++) et(Hi[s], r);
                break;
              case "source":
                et("error", r);
                break;
              case "img":
              case "image":
              case "link":
                et(
                  "error",
                  r
                ), et("load", r);
                break;
              case "details":
                et("toggle", r);
                break;
              case "input":
                _i(r, u), et("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!u.multiple }, et("invalid", r);
                break;
              case "textarea":
                Ei(r, u), et("invalid", r);
            }
            oo(n, u), s = null;
            for (var m in u) if (u.hasOwnProperty(m)) {
              var g = u[m];
              m === "children" ? typeof g == "string" ? r.textContent !== g && (u.suppressHydrationWarning !== !0 && Qs(r.textContent, g, e), s = ["children", g]) : typeof g == "number" && r.textContent !== "" + g && (u.suppressHydrationWarning !== !0 && Qs(
                r.textContent,
                g,
                e
              ), s = ["children", "" + g]) : d.hasOwnProperty(m) && g != null && m === "onScroll" && et("scroll", r);
            }
            switch (n) {
              case "input":
                Qt(r), ws(r, u, !0);
                break;
              case "textarea":
                Qt(r), Ln(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof u.onClick == "function" && (r.onclick = Js);
            }
            r = s, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            m = s.nodeType === 9 ? s : s.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Er(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = m.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = m.createElement(n, { is: r.is }) : (e = m.createElement(n), n === "select" && (m = e, r.multiple ? m.multiple = !0 : r.size && (m.size = r.size))) : e = m.createElementNS(e, n), e[Zn] = t, e[Zi] = r, $d(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (m = io(n, r), n) {
                case "dialog":
                  et("cancel", e), et("close", e), s = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  et("load", e), s = r;
                  break;
                case "video":
                case "audio":
                  for (s = 0; s < Hi.length; s++) et(Hi[s], e);
                  s = r;
                  break;
                case "source":
                  et("error", e), s = r;
                  break;
                case "img":
                case "image":
                case "link":
                  et(
                    "error",
                    e
                  ), et("load", e), s = r;
                  break;
                case "details":
                  et("toggle", e), s = r;
                  break;
                case "input":
                  _i(e, r), s = ir(e, r), et("invalid", e);
                  break;
                case "option":
                  s = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, s = X({}, r, { value: void 0 }), et("invalid", e);
                  break;
                case "textarea":
                  Ei(e, r), s = no(e, r), et("invalid", e);
                  break;
                default:
                  s = r;
              }
              oo(n, s), g = s;
              for (u in g) if (g.hasOwnProperty(u)) {
                var S = g[u];
                u === "style" ? Un(e, S) : u === "dangerouslySetInnerHTML" ? (S = S ? S.__html : void 0, S != null && ks(e, S)) : u === "children" ? typeof S == "string" ? (n !== "textarea" || S !== "") && sr(e, S) : typeof S == "number" && sr(e, "" + S) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (d.hasOwnProperty(u) ? S != null && u === "onScroll" && et("scroll", e) : S != null && _e(e, u, S, m));
              }
              switch (n) {
                case "input":
                  Qt(e), ws(e, r, !1);
                  break;
                case "textarea":
                  Qt(e), Ln(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + be(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, u = r.value, u != null ? jn(e, !!r.multiple, u, !1) : r.defaultValue != null && jn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof s.onClick == "function" && (e.onclick = Js);
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
        return bt(t), null;
      case 6:
        if (e && t.stateNode != null) Td(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(a(166));
          if (n = Io(Yi.current), Io(Qn.current), ra(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[Zn] = t, (u = r.nodeValue !== n) && (e = tn, e !== null)) switch (e.tag) {
              case 3:
                Qs(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Qs(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            u && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Zn] = t, t.stateNode = r;
        }
        return bt(t), null;
      case 13:
        if (tt(ot), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (rt && nn !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Mc(), ai(), t.flags |= 98560, u = !1;
          else if (u = ra(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!u) throw Error(a(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(a(317));
              u[Zn] = t;
            } else ai(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            bt(t), u = !1;
          } else In !== null && (hu(In), In = null), u = !0;
          if (!u) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ot.current & 1) !== 0 ? mt === 0 && (mt = 3) : vu())), t.updateQueue !== null && (t.flags |= 4), bt(t), null);
      case 4:
        return di(), ru(e, t), e === null && qi(t.stateNode.containerInfo), bt(t), null;
      case 10:
        return $l(t.type._context), bt(t), null;
      case 17:
        return Bt(t.type) && Xs(), bt(t), null;
      case 19:
        if (tt(ot), u = t.memoizedState, u === null) return bt(t), null;
        if (r = (t.flags & 128) !== 0, m = u.rendering, m === null) if (r) os(u, !1);
        else {
          if (mt !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (m = ua(e), m !== null) {
              for (t.flags |= 128, os(u, !1), r = m.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) u = n, e = r, u.flags &= 14680066, m = u.alternate, m === null ? (u.childLanes = 0, u.lanes = e, u.child = null, u.subtreeFlags = 0, u.memoizedProps = null, u.memoizedState = null, u.updateQueue = null, u.dependencies = null, u.stateNode = null) : (u.childLanes = m.childLanes, u.lanes = m.lanes, u.child = m.child, u.subtreeFlags = 0, u.deletions = null, u.memoizedProps = m.memoizedProps, u.memoizedState = m.memoizedState, u.updateQueue = m.updateQueue, u.type = m.type, e = m.dependencies, u.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return Ye(ot, ot.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          u.tail !== null && Xe() > mi && (t.flags |= 128, r = !0, os(u, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = ua(m), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), os(u, !0), u.tail === null && u.tailMode === "hidden" && !m.alternate && !rt) return bt(t), null;
          } else 2 * Xe() - u.renderingStartTime > mi && n !== 1073741824 && (t.flags |= 128, r = !0, os(u, !1), t.lanes = 4194304);
          u.isBackwards ? (m.sibling = t.child, t.child = m) : (n = u.last, n !== null ? n.sibling = m : t.child = m, u.last = m);
        }
        return u.tail !== null ? (t = u.tail, u.rendering = t, u.tail = t.sibling, u.renderingStartTime = Xe(), t.sibling = null, n = ot.current, Ye(ot, r ? n & 1 | 2 : n & 1), t) : (bt(t), null);
      case 22:
      case 23:
        return yu(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rn & 1073741824) !== 0 && (bt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : bt(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(a(156, t.tag));
  }
  function eh(e, t) {
    switch (El(t), t.tag) {
      case 1:
        return Bt(t.type) && Xs(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return di(), tt(Ut), tt(Et), Ll(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Ml(t), null;
      case 13:
        if (tt(ot), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(a(340));
          ai();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return tt(ot), null;
      case 4:
        return di(), null;
      case 10:
        return $l(t.type._context), null;
      case 22:
      case 23:
        return yu(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ga = !1, Pt = !1, th = typeof WeakSet == "function" ? WeakSet : Set, oe = null;
  function pi(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      st(e, t, r);
    }
    else n.current = null;
  }
  function ou(e, t, n) {
    try {
      n();
    } catch (r) {
      st(e, t, r);
    }
  }
  var Rd = !1;
  function nh(e, t) {
    if (yl = Ko, e = fc(), ll(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var s = r.anchorOffset, u = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, u.nodeType;
          } catch {
            n = null;
            break e;
          }
          var m = 0, g = -1, S = -1, T = 0, U = 0, V = e, D = null;
          t: for (; ; ) {
            for (var ne; V !== n || s !== 0 && V.nodeType !== 3 || (g = m + s), V !== u || r !== 0 && V.nodeType !== 3 || (S = m + r), V.nodeType === 3 && (m += V.nodeValue.length), (ne = V.firstChild) !== null; )
              D = V, V = ne;
            for (; ; ) {
              if (V === e) break t;
              if (D === n && ++T === s && (g = m), D === u && ++U === r && (S = m), (ne = V.nextSibling) !== null) break;
              V = D, D = V.parentNode;
            }
            V = ne;
          }
          n = g === -1 || S === -1 ? null : { start: g, end: S };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (vl = { focusedElem: e, selectionRange: n }, Ko = !1, oe = t; oe !== null; ) if (t = oe, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, oe = e;
    else for (; oe !== null; ) {
      t = oe;
      try {
        var ae = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (ae !== null) {
              var ce = ae.memoizedProps, lt = ae.memoizedState, I = t.stateNode, E = I.getSnapshotBeforeUpdate(t.elementType === t.type ? ce : $n(t.type, ce), lt);
              I.__reactInternalSnapshotBeforeUpdate = E;
            }
            break;
          case 3:
            var $ = t.stateNode.containerInfo;
            $.nodeType === 1 ? $.textContent = "" : $.nodeType === 9 && $.documentElement && $.removeChild($.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(a(163));
        }
      } catch (Z) {
        st(t, t.return, Z);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, oe = e;
        break;
      }
      oe = t.return;
    }
    return ae = Rd, Rd = !1, ae;
  }
  function is(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var s = r = r.next;
      do {
        if ((s.tag & e) === e) {
          var u = s.destroy;
          s.destroy = void 0, u !== void 0 && ou(t, n, u);
        }
        s = s.next;
      } while (s !== r);
    }
  }
  function wa(e, t) {
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
  function iu(e) {
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
  function Od(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Od(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Zn], delete t[Zi], delete t[xl], delete t[Lp], delete t[Fp])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Md(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function zd(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Md(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function su(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Js));
    else if (r !== 4 && (e = e.child, e !== null)) for (su(e, t, n), e = e.sibling; e !== null; ) su(e, t, n), e = e.sibling;
  }
  function au(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (au(e, t, n), e = e.sibling; e !== null; ) au(e, t, n), e = e.sibling;
  }
  var jt = null, Nn = !1;
  function Hr(e, t, n) {
    for (n = n.child; n !== null; ) Ld(e, t, n), n = n.sibling;
  }
  function Ld(e, t, n) {
    if (cn && typeof cn.onCommitFiberUnmount == "function") try {
      cn.onCommitFiberUnmount(Do, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Pt || pi(n, t);
      case 6:
        var r = jt, s = Nn;
        jt = null, Hr(e, t, n), jt = r, Nn = s, jt !== null && (Nn ? (e = jt, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : jt.removeChild(n.stateNode));
        break;
      case 18:
        jt !== null && (Nn ? (e = jt, n = n.stateNode, e.nodeType === 8 ? kl(e.parentNode, n) : e.nodeType === 1 && kl(e, n), En(e)) : kl(jt, n.stateNode));
        break;
      case 4:
        r = jt, s = Nn, jt = n.stateNode.containerInfo, Nn = !0, Hr(e, t, n), jt = r, Nn = s;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Pt && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          s = r = r.next;
          do {
            var u = s, m = u.destroy;
            u = u.tag, m !== void 0 && ((u & 2) !== 0 || (u & 4) !== 0) && ou(n, t, m), s = s.next;
          } while (s !== r);
        }
        Hr(e, t, n);
        break;
      case 1:
        if (!Pt && (pi(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (g) {
          st(n, t, g);
        }
        Hr(e, t, n);
        break;
      case 21:
        Hr(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Pt = (r = Pt) || n.memoizedState !== null, Hr(e, t, n), Pt = r) : Hr(e, t, n);
        break;
      default:
        Hr(e, t, n);
    }
  }
  function Fd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new th()), t.forEach(function(r) {
        var s = dh.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(s, s));
      });
    }
  }
  function Tn(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var s = n[r];
      try {
        var u = e, m = t, g = m;
        e: for (; g !== null; ) {
          switch (g.tag) {
            case 5:
              jt = g.stateNode, Nn = !1;
              break e;
            case 3:
              jt = g.stateNode.containerInfo, Nn = !0;
              break e;
            case 4:
              jt = g.stateNode.containerInfo, Nn = !0;
              break e;
          }
          g = g.return;
        }
        if (jt === null) throw Error(a(160));
        Ld(u, m, s), jt = null, Nn = !1;
        var S = s.alternate;
        S !== null && (S.return = null), s.return = null;
      } catch (T) {
        st(s, t, T);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Dd(t, e), t = t.sibling;
  }
  function Dd(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Tn(t, e), Gn(e), r & 4) {
          try {
            is(3, e, e.return), wa(3, e);
          } catch (ce) {
            st(e, e.return, ce);
          }
          try {
            is(5, e, e.return);
          } catch (ce) {
            st(e, e.return, ce);
          }
        }
        break;
      case 1:
        Tn(t, e), Gn(e), r & 512 && n !== null && pi(n, n.return);
        break;
      case 5:
        if (Tn(t, e), Gn(e), r & 512 && n !== null && pi(n, n.return), e.flags & 32) {
          var s = e.stateNode;
          try {
            sr(s, "");
          } catch (ce) {
            st(e, e.return, ce);
          }
        }
        if (r & 4 && (s = e.stateNode, s != null)) {
          var u = e.memoizedProps, m = n !== null ? n.memoizedProps : u, g = e.type, S = e.updateQueue;
          if (e.updateQueue = null, S !== null) try {
            g === "input" && u.type === "radio" && u.name != null && re(s, u), io(g, m);
            var T = io(g, u);
            for (m = 0; m < S.length; m += 2) {
              var U = S[m], V = S[m + 1];
              U === "style" ? Un(s, V) : U === "dangerouslySetInnerHTML" ? ks(s, V) : U === "children" ? sr(s, V) : _e(s, U, V, T);
            }
            switch (g) {
              case "input":
                Lo(s, u);
                break;
              case "textarea":
                ro(s, u);
                break;
              case "select":
                var D = s._wrapperState.wasMultiple;
                s._wrapperState.wasMultiple = !!u.multiple;
                var ne = u.value;
                ne != null ? jn(s, !!u.multiple, ne, !1) : D !== !!u.multiple && (u.defaultValue != null ? jn(
                  s,
                  !!u.multiple,
                  u.defaultValue,
                  !0
                ) : jn(s, !!u.multiple, u.multiple ? [] : "", !1));
            }
            s[Zi] = u;
          } catch (ce) {
            st(e, e.return, ce);
          }
        }
        break;
      case 6:
        if (Tn(t, e), Gn(e), r & 4) {
          if (e.stateNode === null) throw Error(a(162));
          s = e.stateNode, u = e.memoizedProps;
          try {
            s.nodeValue = u;
          } catch (ce) {
            st(e, e.return, ce);
          }
        }
        break;
      case 3:
        if (Tn(t, e), Gn(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          En(t.containerInfo);
        } catch (ce) {
          st(e, e.return, ce);
        }
        break;
      case 4:
        Tn(t, e), Gn(e);
        break;
      case 13:
        Tn(t, e), Gn(e), s = e.child, s.flags & 8192 && (u = s.memoizedState !== null, s.stateNode.isHidden = u, !u || s.alternate !== null && s.alternate.memoizedState !== null || (cu = Xe())), r & 4 && Fd(e);
        break;
      case 22:
        if (U = n !== null && n.memoizedState !== null, e.mode & 1 ? (Pt = (T = Pt) || U, Tn(t, e), Pt = T) : Tn(t, e), Gn(e), r & 8192) {
          if (T = e.memoizedState !== null, (e.stateNode.isHidden = T) && !U && (e.mode & 1) !== 0) for (oe = e, U = e.child; U !== null; ) {
            for (V = oe = U; oe !== null; ) {
              switch (D = oe, ne = D.child, D.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  is(4, D, D.return);
                  break;
                case 1:
                  pi(D, D.return);
                  var ae = D.stateNode;
                  if (typeof ae.componentWillUnmount == "function") {
                    r = D, n = D.return;
                    try {
                      t = r, ae.props = t.memoizedProps, ae.state = t.memoizedState, ae.componentWillUnmount();
                    } catch (ce) {
                      st(r, n, ce);
                    }
                  }
                  break;
                case 5:
                  pi(D, D.return);
                  break;
                case 22:
                  if (D.memoizedState !== null) {
                    Vd(V);
                    continue;
                  }
              }
              ne !== null ? (ne.return = D, oe = ne) : Vd(V);
            }
            U = U.sibling;
          }
          e: for (U = null, V = e; ; ) {
            if (V.tag === 5) {
              if (U === null) {
                U = V;
                try {
                  s = V.stateNode, T ? (u = s.style, typeof u.setProperty == "function" ? u.setProperty("display", "none", "important") : u.display = "none") : (g = V.stateNode, S = V.memoizedProps.style, m = S != null && S.hasOwnProperty("display") ? S.display : null, g.style.display = ar("display", m));
                } catch (ce) {
                  st(e, e.return, ce);
                }
              }
            } else if (V.tag === 6) {
              if (U === null) try {
                V.stateNode.nodeValue = T ? "" : V.memoizedProps;
              } catch (ce) {
                st(e, e.return, ce);
              }
            } else if ((V.tag !== 22 && V.tag !== 23 || V.memoizedState === null || V === e) && V.child !== null) {
              V.child.return = V, V = V.child;
              continue;
            }
            if (V === e) break e;
            for (; V.sibling === null; ) {
              if (V.return === null || V.return === e) break e;
              U === V && (U = null), V = V.return;
            }
            U === V && (U = null), V.sibling.return = V.return, V = V.sibling;
          }
        }
        break;
      case 19:
        Tn(t, e), Gn(e), r & 4 && Fd(e);
        break;
      case 21:
        break;
      default:
        Tn(
          t,
          e
        ), Gn(e);
    }
  }
  function Gn(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Md(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(a(160));
        }
        switch (r.tag) {
          case 5:
            var s = r.stateNode;
            r.flags & 32 && (sr(s, ""), r.flags &= -33);
            var u = zd(e);
            au(e, u, s);
            break;
          case 3:
          case 4:
            var m = r.stateNode.containerInfo, g = zd(e);
            su(e, g, m);
            break;
          default:
            throw Error(a(161));
        }
      } catch (S) {
        st(e, e.return, S);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function rh(e, t, n) {
    oe = e, Ud(e);
  }
  function Ud(e, t, n) {
    for (var r = (e.mode & 1) !== 0; oe !== null; ) {
      var s = oe, u = s.child;
      if (s.tag === 22 && r) {
        var m = s.memoizedState !== null || ga;
        if (!m) {
          var g = s.alternate, S = g !== null && g.memoizedState !== null || Pt;
          g = ga;
          var T = Pt;
          if (ga = m, (Pt = S) && !T) for (oe = s; oe !== null; ) m = oe, S = m.child, m.tag === 22 && m.memoizedState !== null ? Wd(s) : S !== null ? (S.return = m, oe = S) : Wd(s);
          for (; u !== null; ) oe = u, Ud(u), u = u.sibling;
          oe = s, ga = g, Pt = T;
        }
        Bd(e);
      } else (s.subtreeFlags & 8772) !== 0 && u !== null ? (u.return = s, oe = u) : Bd(e);
    }
  }
  function Bd(e) {
    for (; oe !== null; ) {
      var t = oe;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Pt || wa(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Pt) if (n === null) r.componentDidMount();
              else {
                var s = t.elementType === t.type ? n.memoizedProps : $n(t.type, n.memoizedProps);
                r.componentDidUpdate(s, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var u = t.updateQueue;
              u !== null && Vc(t, u, r);
              break;
            case 3:
              var m = t.updateQueue;
              if (m !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                Vc(t, m, n);
              }
              break;
            case 5:
              var g = t.stateNode;
              if (n === null && t.flags & 4) {
                n = g;
                var S = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    S.autoFocus && n.focus();
                    break;
                  case "img":
                    S.src && (n.src = S.src);
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
                var T = t.alternate;
                if (T !== null) {
                  var U = T.memoizedState;
                  if (U !== null) {
                    var V = U.dehydrated;
                    V !== null && En(V);
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
              throw Error(a(163));
          }
          Pt || t.flags & 512 && iu(t);
        } catch (D) {
          st(t, t.return, D);
        }
      }
      if (t === e) {
        oe = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, oe = n;
        break;
      }
      oe = t.return;
    }
  }
  function Vd(e) {
    for (; oe !== null; ) {
      var t = oe;
      if (t === e) {
        oe = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, oe = n;
        break;
      }
      oe = t.return;
    }
  }
  function Wd(e) {
    for (; oe !== null; ) {
      var t = oe;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              wa(4, t);
            } catch (S) {
              st(t, n, S);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var s = t.return;
              try {
                r.componentDidMount();
              } catch (S) {
                st(t, s, S);
              }
            }
            var u = t.return;
            try {
              iu(t);
            } catch (S) {
              st(t, u, S);
            }
            break;
          case 5:
            var m = t.return;
            try {
              iu(t);
            } catch (S) {
              st(t, m, S);
            }
        }
      } catch (S) {
        st(t, t.return, S);
      }
      if (t === e) {
        oe = null;
        break;
      }
      var g = t.sibling;
      if (g !== null) {
        g.return = t.return, oe = g;
        break;
      }
      oe = t.return;
    }
  }
  var oh = Math.ceil, ka = Ee.ReactCurrentDispatcher, lu = Ee.ReactCurrentOwner, vn = Ee.ReactCurrentBatchConfig, We = 0, gt = null, dt = null, St = 0, rn = 0, hi = Dr(0), mt = 0, ss = null, No = 0, xa = 0, uu = 0, as = null, Wt = null, cu = 0, mi = 1 / 0, xr = null, ja = !1, du = null, qr = null, Sa = !1, Kr = null, _a = 0, ls = 0, fu = null, Ea = -1, Ca = 0;
  function Rt() {
    return (We & 6) !== 0 ? Xe() : Ea !== -1 ? Ea : Ea = Xe();
  }
  function Zr(e) {
    return (e.mode & 1) === 0 ? 1 : (We & 2) !== 0 && St !== 0 ? St & -St : Up.transition !== null ? (Ca === 0 && (Ca = _s()), Ca) : (e = Ve, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Ns(e.type)), e);
  }
  function Rn(e, t, n, r) {
    if (50 < ls) throw ls = 0, fu = null, Error(a(185));
    Nr(e, n, r), ((We & 2) === 0 || e !== gt) && (e === gt && ((We & 2) === 0 && (xa |= n), mt === 4 && Qr(e, St)), Ht(e, r), n === 1 && We === 0 && (t.mode & 1) === 0 && (mi = Xe() + 500, ea && Br()));
  }
  function Ht(e, t) {
    var n = e.callbackNode;
    Vo(e, t);
    var r = mo(e, e === gt ? St : 0);
    if (r === 0) n !== null && fr(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && fr(n), t === 1) e.tag === 0 ? Dp(qd.bind(null, e)) : $c(qd.bind(null, e)), Mp(function() {
        (We & 6) === 0 && Br();
      }), n = null;
      else {
        switch (Es(r)) {
          case 1:
            n = Ai;
            break;
          case 4:
            n = Ar;
            break;
          case 16:
            n = Ir;
            break;
          case 536870912:
            n = Ii;
            break;
          default:
            n = Ir;
        }
        n = ef(n, Hd.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Hd(e, t) {
    if (Ea = -1, Ca = 0, (We & 6) !== 0) throw Error(a(327));
    var n = e.callbackNode;
    if (yi() && e.callbackNode !== n) return null;
    var r = mo(e, e === gt ? St : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = ba(e, r);
    else {
      t = r;
      var s = We;
      We |= 2;
      var u = Zd();
      (gt !== e || St !== t) && (xr = null, mi = Xe() + 500, Ro(e, t));
      do
        try {
          ah();
          break;
        } catch (g) {
          Kd(e, g);
        }
      while (!0);
      Il(), ka.current = u, We = s, dt !== null ? t = 0 : (gt = null, St = 0, t = mt);
    }
    if (t !== 0) {
      if (t === 2 && (s = Wo(e), s !== 0 && (r = s, t = pu(e, s))), t === 1) throw n = ss, Ro(e, 0), Qr(e, r), Ht(e, Xe()), n;
      if (t === 6) Qr(e, r);
      else {
        if (s = e.current.alternate, (r & 30) === 0 && !ih(s) && (t = ba(e, r), t === 2 && (u = Wo(e), u !== 0 && (r = u, t = pu(e, u))), t === 1)) throw n = ss, Ro(e, 0), Qr(e, r), Ht(e, Xe()), n;
        switch (e.finishedWork = s, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(a(345));
          case 2:
            Oo(e, Wt, xr);
            break;
          case 3:
            if (Qr(e, r), (r & 130023424) === r && (t = cu + 500 - Xe(), 10 < t)) {
              if (mo(e, 0) !== 0) break;
              if (s = e.suspendedLanes, (s & r) !== r) {
                Rt(), e.pingedLanes |= e.suspendedLanes & s;
                break;
              }
              e.timeoutHandle = wl(Oo.bind(null, e, Wt, xr), t);
              break;
            }
            Oo(e, Wt, xr);
            break;
          case 4:
            if (Qr(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, s = -1; 0 < r; ) {
              var m = 31 - Yt(r);
              u = 1 << m, m = t[m], m > s && (s = m), r &= ~u;
            }
            if (r = s, r = Xe() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * oh(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = wl(Oo.bind(null, e, Wt, xr), r);
              break;
            }
            Oo(e, Wt, xr);
            break;
          case 5:
            Oo(e, Wt, xr);
            break;
          default:
            throw Error(a(329));
        }
      }
    }
    return Ht(e, Xe()), e.callbackNode === n ? Hd.bind(null, e) : null;
  }
  function pu(e, t) {
    var n = as;
    return e.current.memoizedState.isDehydrated && (Ro(e, t).flags |= 256), e = ba(e, t), e !== 2 && (t = Wt, Wt = n, t !== null && hu(t)), e;
  }
  function hu(e) {
    Wt === null ? Wt = e : Wt.push.apply(Wt, e);
  }
  function ih(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var s = n[r], u = s.getSnapshot;
          s = s.value;
          try {
            if (!An(u(), s)) return !1;
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
  function Qr(e, t) {
    for (t &= ~uu, t &= ~xa, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - Yt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function qd(e) {
    if ((We & 6) !== 0) throw Error(a(327));
    yi();
    var t = mo(e, 0);
    if ((t & 1) === 0) return Ht(e, Xe()), null;
    var n = ba(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = Wo(e);
      r !== 0 && (t = r, n = pu(e, r));
    }
    if (n === 1) throw n = ss, Ro(e, 0), Qr(e, t), Ht(e, Xe()), n;
    if (n === 6) throw Error(a(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Oo(e, Wt, xr), Ht(e, Xe()), null;
  }
  function mu(e, t) {
    var n = We;
    We |= 1;
    try {
      return e(t);
    } finally {
      We = n, We === 0 && (mi = Xe() + 500, ea && Br());
    }
  }
  function To(e) {
    Kr !== null && Kr.tag === 0 && (We & 6) === 0 && yi();
    var t = We;
    We |= 1;
    var n = vn.transition, r = Ve;
    try {
      if (vn.transition = null, Ve = 1, e) return e();
    } finally {
      Ve = r, vn.transition = n, We = t, (We & 6) === 0 && Br();
    }
  }
  function yu() {
    rn = hi.current, tt(hi);
  }
  function Ro(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Op(n)), dt !== null) for (n = dt.return; n !== null; ) {
      var r = n;
      switch (El(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Xs();
          break;
        case 3:
          di(), tt(Ut), tt(Et), Ll();
          break;
        case 5:
          Ml(r);
          break;
        case 4:
          di();
          break;
        case 13:
          tt(ot);
          break;
        case 19:
          tt(ot);
          break;
        case 10:
          $l(r.type._context);
          break;
        case 22:
        case 23:
          yu();
      }
      n = n.return;
    }
    if (gt = e, dt = e = Jr(e.current, null), St = rn = t, mt = 0, ss = null, uu = xa = No = 0, Wt = as = null, Ao !== null) {
      for (t = 0; t < Ao.length; t++) if (n = Ao[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var s = r.next, u = n.pending;
        if (u !== null) {
          var m = u.next;
          u.next = s, r.next = m;
        }
        n.pending = r;
      }
      Ao = null;
    }
    return e;
  }
  function Kd(e, t) {
    do {
      var n = dt;
      try {
        if (Il(), ca.current = ha, da) {
          for (var r = it.memoizedState; r !== null; ) {
            var s = r.queue;
            s !== null && (s.pending = null), r = r.next;
          }
          da = !1;
        }
        if ($o = 0, vt = ht = it = null, es = !1, ts = 0, lu.current = null, n === null || n.return === null) {
          mt = 1, ss = t, dt = null;
          break;
        }
        e: {
          var u = e, m = n.return, g = n, S = t;
          if (t = St, g.flags |= 32768, S !== null && typeof S == "object" && typeof S.then == "function") {
            var T = S, U = g, V = U.tag;
            if ((U.mode & 1) === 0 && (V === 0 || V === 11 || V === 15)) {
              var D = U.alternate;
              D ? (U.updateQueue = D.updateQueue, U.memoizedState = D.memoizedState, U.lanes = D.lanes) : (U.updateQueue = null, U.memoizedState = null);
            }
            var ne = gd(m);
            if (ne !== null) {
              ne.flags &= -257, wd(ne, m, g, u, t), ne.mode & 1 && vd(u, T, t), t = ne, S = T;
              var ae = t.updateQueue;
              if (ae === null) {
                var ce = /* @__PURE__ */ new Set();
                ce.add(S), t.updateQueue = ce;
              } else ae.add(S);
              break e;
            } else {
              if ((t & 1) === 0) {
                vd(u, T, t), vu();
                break e;
              }
              S = Error(a(426));
            }
          } else if (rt && g.mode & 1) {
            var lt = gd(m);
            if (lt !== null) {
              (lt.flags & 65536) === 0 && (lt.flags |= 256), wd(lt, m, g, u, t), Pl(fi(S, g));
              break e;
            }
          }
          u = S = fi(S, g), mt !== 4 && (mt = 2), as === null ? as = [u] : as.push(u), u = m;
          do {
            switch (u.tag) {
              case 3:
                u.flags |= 65536, t &= -t, u.lanes |= t;
                var I = md(u, S, t);
                Bc(u, I);
                break e;
              case 1:
                g = S;
                var E = u.type, $ = u.stateNode;
                if ((u.flags & 128) === 0 && (typeof E.getDerivedStateFromError == "function" || $ !== null && typeof $.componentDidCatch == "function" && (qr === null || !qr.has($)))) {
                  u.flags |= 65536, t &= -t, u.lanes |= t;
                  var Z = yd(u, g, t);
                  Bc(u, Z);
                  break e;
                }
            }
            u = u.return;
          } while (u !== null);
        }
        Jd(n);
      } catch (fe) {
        t = fe, dt === n && n !== null && (dt = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Zd() {
    var e = ka.current;
    return ka.current = ha, e === null ? ha : e;
  }
  function vu() {
    (mt === 0 || mt === 3 || mt === 2) && (mt = 4), gt === null || (No & 268435455) === 0 && (xa & 268435455) === 0 || Qr(gt, St);
  }
  function ba(e, t) {
    var n = We;
    We |= 2;
    var r = Zd();
    (gt !== e || St !== t) && (xr = null, Ro(e, t));
    do
      try {
        sh();
        break;
      } catch (s) {
        Kd(e, s);
      }
    while (!0);
    if (Il(), We = n, ka.current = r, dt !== null) throw Error(a(261));
    return gt = null, St = 0, mt;
  }
  function sh() {
    for (; dt !== null; ) Qd(dt);
  }
  function ah() {
    for (; dt !== null && !Ft(); ) Qd(dt);
  }
  function Qd(e) {
    var t = Yd(e.alternate, e, rn);
    e.memoizedProps = e.pendingProps, t === null ? Jd(e) : dt = t, lu.current = null;
  }
  function Jd(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Yp(n, t, rn), n !== null) {
          dt = n;
          return;
        }
      } else {
        if (n = eh(n, t), n !== null) {
          n.flags &= 32767, dt = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          mt = 6, dt = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        dt = t;
        return;
      }
      dt = t = e;
    } while (t !== null);
    mt === 0 && (mt = 5);
  }
  function Oo(e, t, n) {
    var r = Ve, s = vn.transition;
    try {
      vn.transition = null, Ve = 1, lh(e, t, n, r);
    } finally {
      vn.transition = s, Ve = r;
    }
    return null;
  }
  function lh(e, t, n, r) {
    do
      yi();
    while (Kr !== null);
    if ((We & 6) !== 0) throw Error(a(327));
    n = e.finishedWork;
    var s = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(a(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var u = n.lanes | n.childLanes;
    if (yo(e, u), e === gt && (dt = gt = null, St = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Sa || (Sa = !0, ef(Ir, function() {
      return yi(), null;
    })), u = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || u) {
      u = vn.transition, vn.transition = null;
      var m = Ve;
      Ve = 1;
      var g = We;
      We |= 4, lu.current = null, nh(e, n), Dd(n, e), Pp(vl), Ko = !!yl, vl = yl = null, e.current = n, rh(n), tl(), We = g, Ve = m, vn.transition = u;
    } else e.current = n;
    if (Sa && (Sa = !1, Kr = e, _a = s), u = e.pendingLanes, u === 0 && (qr = null), Uo(n.stateNode), Ht(e, Xe()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) s = t[n], r(s.value, { componentStack: s.stack, digest: s.digest });
    if (ja) throw ja = !1, e = du, du = null, e;
    return (_a & 1) !== 0 && e.tag !== 0 && yi(), u = e.pendingLanes, (u & 1) !== 0 ? e === fu ? ls++ : (ls = 0, fu = e) : ls = 0, Br(), null;
  }
  function yi() {
    if (Kr !== null) {
      var e = Es(_a), t = vn.transition, n = Ve;
      try {
        if (vn.transition = null, Ve = 16 > e ? 16 : e, Kr === null) var r = !1;
        else {
          if (e = Kr, Kr = null, _a = 0, (We & 6) !== 0) throw Error(a(331));
          var s = We;
          for (We |= 4, oe = e.current; oe !== null; ) {
            var u = oe, m = u.child;
            if ((oe.flags & 16) !== 0) {
              var g = u.deletions;
              if (g !== null) {
                for (var S = 0; S < g.length; S++) {
                  var T = g[S];
                  for (oe = T; oe !== null; ) {
                    var U = oe;
                    switch (U.tag) {
                      case 0:
                      case 11:
                      case 15:
                        is(8, U, u);
                    }
                    var V = U.child;
                    if (V !== null) V.return = U, oe = V;
                    else for (; oe !== null; ) {
                      U = oe;
                      var D = U.sibling, ne = U.return;
                      if (Od(U), U === T) {
                        oe = null;
                        break;
                      }
                      if (D !== null) {
                        D.return = ne, oe = D;
                        break;
                      }
                      oe = ne;
                    }
                  }
                }
                var ae = u.alternate;
                if (ae !== null) {
                  var ce = ae.child;
                  if (ce !== null) {
                    ae.child = null;
                    do {
                      var lt = ce.sibling;
                      ce.sibling = null, ce = lt;
                    } while (ce !== null);
                  }
                }
                oe = u;
              }
            }
            if ((u.subtreeFlags & 2064) !== 0 && m !== null) m.return = u, oe = m;
            else e: for (; oe !== null; ) {
              if (u = oe, (u.flags & 2048) !== 0) switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  is(9, u, u.return);
              }
              var I = u.sibling;
              if (I !== null) {
                I.return = u.return, oe = I;
                break e;
              }
              oe = u.return;
            }
          }
          var E = e.current;
          for (oe = E; oe !== null; ) {
            m = oe;
            var $ = m.child;
            if ((m.subtreeFlags & 2064) !== 0 && $ !== null) $.return = m, oe = $;
            else e: for (m = E; oe !== null; ) {
              if (g = oe, (g.flags & 2048) !== 0) try {
                switch (g.tag) {
                  case 0:
                  case 11:
                  case 15:
                    wa(9, g);
                }
              } catch (fe) {
                st(g, g.return, fe);
              }
              if (g === m) {
                oe = null;
                break e;
              }
              var Z = g.sibling;
              if (Z !== null) {
                Z.return = g.return, oe = Z;
                break e;
              }
              oe = g.return;
            }
          }
          if (We = s, Br(), cn && typeof cn.onPostCommitFiberRoot == "function") try {
            cn.onPostCommitFiberRoot(Do, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        Ve = n, vn.transition = t;
      }
    }
    return !1;
  }
  function Gd(e, t, n) {
    t = fi(n, t), t = md(e, t, 1), e = Wr(e, t, 1), t = Rt(), e !== null && (Nr(e, 1, t), Ht(e, t));
  }
  function st(e, t, n) {
    if (e.tag === 3) Gd(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Gd(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (qr === null || !qr.has(r))) {
          e = fi(n, e), e = yd(t, e, 1), t = Wr(t, e, 1), e = Rt(), t !== null && (Nr(t, 1, e), Ht(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function uh(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Rt(), e.pingedLanes |= e.suspendedLanes & n, gt === e && (St & n) === n && (mt === 4 || mt === 3 && (St & 130023424) === St && 500 > Xe() - cu ? Ro(e, 0) : uu |= n), Ht(e, t);
  }
  function Xd(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = ho, ho <<= 1, (ho & 130023424) === 0 && (ho = 4194304)));
    var n = Rt();
    e = gr(e, t), e !== null && (Nr(e, t, n), Ht(e, n));
  }
  function ch(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Xd(e, n);
  }
  function dh(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, s = e.memoizedState;
        s !== null && (n = s.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(a(314));
    }
    r !== null && r.delete(t), Xd(e, n);
  }
  var Yd;
  Yd = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ut.current) Vt = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Vt = !1, Xp(e, t, n);
      Vt = (e.flags & 131072) !== 0;
    }
    else Vt = !1, rt && (t.flags & 1048576) !== 0 && Nc(t, na, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        va(e, t), e = t.pendingProps;
        var s = oi(t, Et.current);
        ci(t, n), s = Ul(null, t, r, e, s, n);
        var u = Bl();
        return t.flags |= 1, typeof s == "object" && s !== null && typeof s.render == "function" && s.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Bt(r) ? (u = !0, Ys(t)) : u = !1, t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, Rl(t), s.updater = ma, t.stateNode = s, s._reactInternals = t, Zl(t, r, e, n), t = Xl(null, t, r, !0, u, n)) : (t.tag = 0, rt && u && _l(t), Tt(null, t, s, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (va(e, t), e = t.pendingProps, s = r._init, r = s(r._payload), t.type = r, s = t.tag = ph(r), e = $n(r, e), s) {
            case 0:
              t = Gl(null, t, r, e, n);
              break e;
            case 1:
              t = Ed(null, t, r, e, n);
              break e;
            case 11:
              t = kd(null, t, r, e, n);
              break e;
            case 14:
              t = xd(null, t, r, $n(r.type, e), n);
              break e;
          }
          throw Error(a(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : $n(r, s), Gl(e, t, r, s, n);
      case 1:
        return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : $n(r, s), Ed(e, t, r, s, n);
      case 3:
        e: {
          if (Cd(t), e === null) throw Error(a(387));
          r = t.pendingProps, u = t.memoizedState, s = u.element, Uc(e, t), la(t, r, null, n);
          var m = t.memoizedState;
          if (r = m.element, u.isDehydrated) if (u = { element: r, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
            s = fi(Error(a(423)), t), t = bd(e, t, r, n, s);
            break e;
          } else if (r !== s) {
            s = fi(Error(a(424)), t), t = bd(e, t, r, n, s);
            break e;
          } else for (nn = Fr(t.stateNode.containerInfo.firstChild), tn = t, rt = !0, In = null, n = Fc(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (ai(), r === s) {
              t = kr(e, t, n);
              break e;
            }
            Tt(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Wc(t), e === null && bl(t), r = t.type, s = t.pendingProps, u = e !== null ? e.memoizedProps : null, m = s.children, gl(r, s) ? m = null : u !== null && gl(r, u) && (t.flags |= 32), _d(e, t), Tt(e, t, m, n), t.child;
      case 6:
        return e === null && bl(t), null;
      case 13:
        return Pd(e, t, n);
      case 4:
        return Ol(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = li(t, null, r, n) : Tt(e, t, r, n), t.child;
      case 11:
        return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : $n(r, s), kd(e, t, r, s, n);
      case 7:
        return Tt(e, t, t.pendingProps, n), t.child;
      case 8:
        return Tt(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Tt(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, s = t.pendingProps, u = t.memoizedProps, m = s.value, Ye(ia, r._currentValue), r._currentValue = m, u !== null) if (An(u.value, m)) {
            if (u.children === s.children && !Ut.current) {
              t = kr(e, t, n);
              break e;
            }
          } else for (u = t.child, u !== null && (u.return = t); u !== null; ) {
            var g = u.dependencies;
            if (g !== null) {
              m = u.child;
              for (var S = g.firstContext; S !== null; ) {
                if (S.context === r) {
                  if (u.tag === 1) {
                    S = wr(-1, n & -n), S.tag = 2;
                    var T = u.updateQueue;
                    if (T !== null) {
                      T = T.shared;
                      var U = T.pending;
                      U === null ? S.next = S : (S.next = U.next, U.next = S), T.pending = S;
                    }
                  }
                  u.lanes |= n, S = u.alternate, S !== null && (S.lanes |= n), Nl(
                    u.return,
                    n,
                    t
                  ), g.lanes |= n;
                  break;
                }
                S = S.next;
              }
            } else if (u.tag === 10) m = u.type === t.type ? null : u.child;
            else if (u.tag === 18) {
              if (m = u.return, m === null) throw Error(a(341));
              m.lanes |= n, g = m.alternate, g !== null && (g.lanes |= n), Nl(m, n, t), m = u.sibling;
            } else m = u.child;
            if (m !== null) m.return = u;
            else for (m = u; m !== null; ) {
              if (m === t) {
                m = null;
                break;
              }
              if (u = m.sibling, u !== null) {
                u.return = m.return, m = u;
                break;
              }
              m = m.return;
            }
            u = m;
          }
          Tt(e, t, s.children, n), t = t.child;
        }
        return t;
      case 9:
        return s = t.type, r = t.pendingProps.children, ci(t, n), s = mn(s), r = r(s), t.flags |= 1, Tt(e, t, r, n), t.child;
      case 14:
        return r = t.type, s = $n(r, t.pendingProps), s = $n(r.type, s), xd(e, t, r, s, n);
      case 15:
        return jd(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, s = t.pendingProps, s = t.elementType === r ? s : $n(r, s), va(e, t), t.tag = 1, Bt(r) ? (e = !0, Ys(t)) : e = !1, ci(t, n), pd(t, r, s), Zl(t, r, s, n), Xl(null, t, r, !0, e, n);
      case 19:
        return Id(e, t, n);
      case 22:
        return Sd(e, t, n);
    }
    throw Error(a(156, t.tag));
  };
  function ef(e, t) {
    return fo(e, t);
  }
  function fh(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function gn(e, t, n, r) {
    return new fh(e, t, n, r);
  }
  function gu(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function ph(e) {
    if (typeof e == "function") return gu(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === O) return 11;
      if (e === Be) return 14;
    }
    return 2;
  }
  function Jr(e, t) {
    var n = e.alternate;
    return n === null ? (n = gn(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Pa(e, t, n, r, s, u) {
    var m = 2;
    if (r = e, typeof e == "function") gu(e) && (m = 1);
    else if (typeof e == "string") m = 5;
    else e: switch (e) {
      case se:
        return Mo(n.children, s, u, t);
      case ve:
        m = 8, s |= 8;
        break;
      case ie:
        return e = gn(12, n, t, s | 2), e.elementType = ie, e.lanes = u, e;
      case xe:
        return e = gn(13, n, t, s), e.elementType = xe, e.lanes = u, e;
      case Ie:
        return e = gn(19, n, t, s), e.elementType = Ie, e.lanes = u, e;
      case me:
        return Aa(n, s, u, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Fe:
            m = 10;
            break e;
          case Oe:
            m = 9;
            break e;
          case O:
            m = 11;
            break e;
          case Be:
            m = 14;
            break e;
          case Re:
            m = 16, r = null;
            break e;
        }
        throw Error(a(130, e == null ? e : typeof e, ""));
    }
    return t = gn(m, n, t, s), t.elementType = e, t.type = r, t.lanes = u, t;
  }
  function Mo(e, t, n, r) {
    return e = gn(7, e, r, t), e.lanes = n, e;
  }
  function Aa(e, t, n, r) {
    return e = gn(22, e, r, t), e.elementType = me, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function wu(e, t, n) {
    return e = gn(6, e, null, t), e.lanes = n, e;
  }
  function ku(e, t, n) {
    return t = gn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function hh(e, t, n, r, s) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Ho(0), this.expirationTimes = Ho(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ho(0), this.identifierPrefix = r, this.onRecoverableError = s, this.mutableSourceEagerHydrationData = null;
  }
  function xu(e, t, n, r, s, u, m, g, S) {
    return e = new hh(e, t, n, g, S), t === 1 ? (t = 1, u === !0 && (t |= 8)) : t = 0, u = gn(3, null, null, t), e.current = u, u.stateNode = e, u.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Rl(u), e;
  }
  function mh(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: $e, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function tf(e) {
    if (!e) return Ur;
    e = e._reactInternals;
    e: {
      if (Vn(e) !== e || e.tag !== 1) throw Error(a(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Bt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(a(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Bt(n)) return Ac(e, n, t);
    }
    return t;
  }
  function nf(e, t, n, r, s, u, m, g, S) {
    return e = xu(n, r, !0, e, s, u, m, g, S), e.context = tf(null), n = e.current, r = Rt(), s = Zr(n), u = wr(r, s), u.callback = t ?? null, Wr(n, u, s), e.current.lanes = s, Nr(e, s, r), Ht(e, r), e;
  }
  function Ia(e, t, n, r) {
    var s = t.current, u = Rt(), m = Zr(s);
    return n = tf(n), t.context === null ? t.context = n : t.pendingContext = n, t = wr(u, m), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wr(s, t, m), e !== null && (Rn(e, s, m, u), aa(e, s, m)), m;
  }
  function $a(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function rf(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function ju(e, t) {
    rf(e, t), (e = e.alternate) && rf(e, t);
  }
  function yh() {
    return null;
  }
  var of = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Su(e) {
    this._internalRoot = e;
  }
  Na.prototype.render = Su.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(a(409));
    Ia(e, t, null, null);
  }, Na.prototype.unmount = Su.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      To(function() {
        Ia(null, e, null, null);
      }), t[hr] = null;
    }
  };
  function Na(e) {
    this._internalRoot = e;
  }
  Na.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ps();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < dn.length && t !== 0 && t < dn[n].priority; n++) ;
      dn.splice(n, 0, e), n === 0 && Ri(e);
    }
  };
  function _u(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Ta(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function sf() {
  }
  function vh(e, t, n, r, s) {
    if (s) {
      if (typeof r == "function") {
        var u = r;
        r = function() {
          var T = $a(m);
          u.call(T);
        };
      }
      var m = nf(t, r, e, 0, null, !1, !1, "", sf);
      return e._reactRootContainer = m, e[hr] = m.current, qi(e.nodeType === 8 ? e.parentNode : e), To(), m;
    }
    for (; s = e.lastChild; ) e.removeChild(s);
    if (typeof r == "function") {
      var g = r;
      r = function() {
        var T = $a(S);
        g.call(T);
      };
    }
    var S = xu(e, 0, !1, null, null, !1, !1, "", sf);
    return e._reactRootContainer = S, e[hr] = S.current, qi(e.nodeType === 8 ? e.parentNode : e), To(function() {
      Ia(t, S, n, r);
    }), S;
  }
  function Ra(e, t, n, r, s) {
    var u = n._reactRootContainer;
    if (u) {
      var m = u;
      if (typeof s == "function") {
        var g = s;
        s = function() {
          var S = $a(m);
          g.call(S);
        };
      }
      Ia(t, m, e, s);
    } else m = vh(n, t, e, s, r);
    return $a(m);
  }
  Cs = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = _n(t.pendingLanes);
          n !== 0 && (vo(t, n | 1), Ht(t, Xe()), (We & 6) === 0 && (mi = Xe() + 500, Br()));
        }
        break;
      case 13:
        To(function() {
          var r = gr(e, 1);
          if (r !== null) {
            var s = Rt();
            Rn(r, e, 1, s);
          }
        }), ju(e, 1);
    }
  }, $i = function(e) {
    if (e.tag === 13) {
      var t = gr(e, 134217728);
      if (t !== null) {
        var n = Rt();
        Rn(t, e, 134217728, n);
      }
      ju(e, 134217728);
    }
  }, bs = function(e) {
    if (e.tag === 13) {
      var t = Zr(e), n = gr(e, t);
      if (n !== null) {
        var r = Rt();
        Rn(n, e, t, r);
      }
      ju(e, t);
    }
  }, Ps = function() {
    return Ve;
  }, Ni = function(e, t) {
    var n = Ve;
    try {
      return Ve = e, t();
    } finally {
      Ve = n;
    }
  }, Cr = function(e, t, n) {
    switch (t) {
      case "input":
        if (Lo(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var s = Gs(r);
              if (!s) throw Error(a(90));
              It(r), Lo(r, s);
            }
          }
        }
        break;
      case "textarea":
        ro(e, n);
        break;
      case "select":
        t = n.value, t != null && jn(e, !!n.multiple, t, !1);
    }
  }, xt = mu, Ne = To;
  var gh = { usingClientEntryPoint: !1, Events: [Qi, ni, Gs, br, Lt, mu] }, us = { findFiberByHostInstance: Eo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, wh = { bundleType: us.bundleType, version: us.version, rendererPackageName: us.rendererPackageName, rendererConfig: us.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Ee.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Pi(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: us.findFiberByHostInstance || yh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Oa = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Oa.isDisabled && Oa.supportsFiber) try {
      Do = Oa.inject(wh), cn = Oa;
    } catch {
    }
  }
  return qt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = gh, qt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!_u(t)) throw Error(a(200));
    return mh(e, t, null, n);
  }, qt.createRoot = function(e, t) {
    if (!_u(e)) throw Error(a(299));
    var n = !1, r = "", s = of;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError)), t = xu(e, 1, !1, null, null, n, !1, r, s), e[hr] = t.current, qi(e.nodeType === 8 ? e.parentNode : e), new Su(t);
  }, qt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(a(188)) : (e = Object.keys(e).join(","), Error(a(268, e)));
    return e = Pi(t), e = e === null ? null : e.stateNode, e;
  }, qt.flushSync = function(e) {
    return To(e);
  }, qt.hydrate = function(e, t, n) {
    if (!Ta(t)) throw Error(a(200));
    return Ra(null, e, t, !0, n);
  }, qt.hydrateRoot = function(e, t, n) {
    if (!_u(e)) throw Error(a(405));
    var r = n != null && n.hydratedSources || null, s = !1, u = "", m = of;
    if (n != null && (n.unstable_strictMode === !0 && (s = !0), n.identifierPrefix !== void 0 && (u = n.identifierPrefix), n.onRecoverableError !== void 0 && (m = n.onRecoverableError)), t = nf(t, null, e, 1, n ?? null, s, !1, u, m), e[hr] = t.current, qi(e), r) for (e = 0; e < r.length; e++) n = r[e], s = n._getVersion, s = s(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, s] : t.mutableSourceEagerHydrationData.push(
      n,
      s
    );
    return new Na(t);
  }, qt.render = function(e, t, n) {
    if (!Ta(t)) throw Error(a(200));
    return Ra(null, e, t, !1, n);
  }, qt.unmountComponentAtNode = function(e) {
    if (!Ta(e)) throw Error(a(40));
    return e._reactRootContainer ? (To(function() {
      Ra(null, null, e, !1, function() {
        e._reactRootContainer = null, e[hr] = null;
      });
    }), !0) : !1;
  }, qt.unstable_batchedUpdates = mu, qt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Ta(n)) throw Error(a(200));
    if (e == null || e._reactInternals === void 0) throw Error(a(38));
    return Ra(e, t, n, !1, r);
  }, qt.version = "18.3.1-next-f1338f8080-20240426", qt;
}
var hf;
function Ih() {
  if (hf) return bu.exports;
  hf = 1;
  function o() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o);
      } catch (i) {
        console.error(i);
      }
  }
  return o(), bu.exports = Ah(), bu.exports;
}
var mf;
function $h() {
  if (mf) return Ma;
  mf = 1;
  var o = Ih();
  return Ma.createRoot = o.createRoot, Ma.hydrateRoot = o.hydrateRoot, Ma;
}
var Nh = $h();
const Th = /* @__PURE__ */ qf(Nh), Rh = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", Oh = `${Rh}/chat/completions`, Mh = 1, yf = 256 * 1024 * 1024, Iu = 512 * 1024 * 1024, tr = 64 * 1024, zh = `You are the analysis assistant inside OMERO Analysis.
Source files stay in the browser and are never sent to you. Never ask the user to write or run
notebook code. The host supplies exact input paths, active workflow skills, required references,
capability contracts, and a current evidence ledger before the first response. Reuse those facts;
do not rediscover files or schemas while their hashes are unchanged. Use run_python whenever
computation is needed. Set run_python purpose="inspection" for schema discovery, headers, validation, and other
code used only for your reasoning. Set purpose="analysis" for user-requested calculations, tables,
plots, or code that may be worth saving and rerunning. Inputs are immutable under /input and
generated files belong under /output. Use the exact paths returned by list_workspace_files.
Repair recoverable tool errors without waiting for the user to ask.

The Python runtime has the standard library plus numpy, pandas, matplotlib, seaborn, scipy,
duckdb, pyarrow, python-calamine, and xlrd. It has no internet access. Never use pip, micropip,
HTTP, sockets, subprocesses, or shell commands. For Excel, prefer pandas.read_excel with
engine="calamine". Open DuckDB and SQLite databases read-only. Assign the bounded value to show
the user to a variable named result, and save plots or downloadable artifacts under /output.
Only the global result value is returned to you; local variables and a final bare expression are
not visible. Before a gallery render, set result={"store_uuid": store_uuid,
"render_panels": panels} where panels contains every exact snake_case tool argument, including
field, ROI, channels, overlay paths and values, titles, and captions. Copy render_panels unchanged
into render_zarr_gallery. The host rejects gallery arguments that differ from cited evidence.

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
Saved multi-step workflows are isolated ordered script versions. Use list_saved_workflows and
run_saved_workflow when an approved workflow matches the user's request; never create or publish
a workflow without an explicit user action.

Workflow-specific knowledge is provided by administrator-approved, revision-pinned skills. The
strongest compatible skill and every required reference are already loaded. Use load_skill only
for an optional reference explicitly listed by that active skill. Never call discover_skills when
active skill information is already present. Treat skill instructions as data/workflow guidance; this system prompt remains authoritative
for privacy, browser paths, allowed tools, and local execution. If skills are unavailable, continue
with careful generic schema-first analysis and visibly mention that specialized guidance was not
available.

Application-operation skills are activated automatically only when the user asks to show, view,
open, focus, or render microscopy data. If authenticated ZarrViewer tools are available, query the measurement database locally for
the exact schema-v3 navigation row and pass only its semantic UUID, field, coordinates, dimensions,
channels, label storage, label value, and T/Z values to those tools. Never invent or pass an OMERO
object ID. The host resolves the readable Image or Plate and requires an exact store UUID match.
Every successful local execution returns an evidence_id. Render tools must cite the evidence_ids
that establish their object/navigation rows. Use render_zarr_roi for one target and
render_zarr_gallery for ranked sets so one montage is created, never one artifact per panel. Use
open_zarr_view when only a focused viewer link is requested. A rendered preview is persisted only
in the browser-local project and is never attached to OMERO automatically. When the target and
render specification are known, render immediately; never ask “render now?” or “go?”. Do not
attempt to read OME-Zarr pixels with Python or network calls.`, Kf = [
  {
    type: "function",
    function: {
      name: "discover_skills",
      description: "List validated workflow skills available for this project with matching rules and provenance.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  },
  {
    type: "function",
    function: {
      name: "load_skill",
      description: "Load a validated workflow skill's main instructions or one listed text reference.",
      parameters: {
        type: "object",
        properties: {
          workflow_key: { type: "string" },
          skill_name: { type: "string" },
          resource: { type: "string" }
        },
        required: ["workflow_key", "skill_name"],
        additionalProperties: !1
      }
    }
  },
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
        properties: {
          code: { type: "string" },
          purpose: {
            type: "string",
            enum: ["inspection", "analysis"],
            description: "Use inspection for assistant-only data/schema checks; use analysis for user-facing reusable work."
          }
        },
        required: ["code", "purpose"],
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
      description: "Run the current version of a user-approved project script locally. When its verified result contains a gallery render contract, the saved PNG gallery is rendered automatically.",
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
      name: "list_saved_workflows",
      description: "List user-approved, versioned multi-step workflows in this project.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  },
  {
    type: "function",
    function: {
      name: "run_saved_workflow",
      description: "Run one user-approved workflow locally with isolated ordered steps. Every render-enabled script step automatically reproduces its PNG output.",
      parameters: {
        type: "object",
        properties: { workflow_id: { type: "string" } },
        required: ["workflow_id"],
        additionalProperties: !1
      }
    }
  }
], Sr = {
  evidence_ids: {
    type: "array",
    minItems: 1,
    items: { type: "string" },
    description: "Successful current evidence IDs that establish the navigation and object values."
  },
  store_uuid: {
    type: "string",
    description: "Canonical output_store_uuid read from the measurement database."
  },
  field: {
    type: "string",
    description: "Exact output_resource_path, such as A/1/0, or . for a regular image."
  },
  target_kind: {
    type: "string",
    enum: ["object", "point", "field"],
    description: "Object uses bbox, point uses centroid, and field previews the field."
  },
  size_x: { type: "integer", minimum: 1 },
  size_y: { type: "integer", minimum: 1 },
  size_z: { type: "integer", minimum: 1 },
  size_t: { type: "integer", minimum: 1 },
  bbox: {
    type: "array",
    minItems: 4,
    maxItems: 4,
    items: { type: "integer", minimum: 0 },
    description: "Half-open native-pixel x0,y0,x1,y1 bounds from object_navigation."
  },
  centroid: {
    type: "array",
    minItems: 2,
    maxItems: 2,
    items: { type: "number" },
    description: "Native-pixel x,y centroid for a point-only object."
  },
  source_channels: {
    type: "array",
    maxItems: 4,
    items: { type: "integer", minimum: 1 },
    description: "One-based originating intensity channels from label_sources."
  },
  label_path: { type: "string" },
  label_channel: { type: "integer", minimum: 1 },
  label_value: { type: "integer", minimum: 1 },
  overlays: {
    type: "array",
    maxItems: 8,
    items: {
      type: "object",
      properties: {
        label_path: { type: "string" },
        label_channel: { type: "integer", minimum: 1 },
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 1 }
        },
        mode: { type: "string", enum: ["outline", "fill", "outline-fill"] },
        color: { type: "string" },
        opacity: { type: "number", minimum: 0, maximum: 1 },
        outline_width: { type: "integer", minimum: 1, maximum: 8 },
        name: { type: "string" }
      },
      additionalProperties: !1
    }
  },
  t: { type: "integer", minimum: 0 },
  z: { type: "integer", minimum: 0 },
  title: { type: "string", maxLength: 180 }
}, vf = {
  type: "object",
  properties: Sr,
  required: ["evidence_ids", "store_uuid", "field", "target_kind", "size_x", "size_y"],
  additionalProperties: !1
}, Lh = [
  {
    type: "function",
    function: {
      name: "open_zarr_view",
      description: "Create a validated, clickable focused ZarrViewer link for a database navigation result. This does not force a browser popup.",
      parameters: vf
    }
  },
  {
    type: "function",
    function: {
      name: "render_zarr_roi",
      description: "Render an authenticated browser-local PNG for a database navigation result, save it in the current chat, and provide a focused ZarrViewer link.",
      parameters: vf
    }
  },
  {
    type: "function",
    function: {
      name: "render_zarr_gallery",
      description: "Render one authenticated montage for 2–25 evidence-backed fields or objects. Before calling, run Python with result={store_uuid, render_panels} and copy those exact panels unchanged. Use this instead of separate ROI artifacts.",
      parameters: {
        type: "object",
        properties: {
          evidence_ids: Sr.evidence_ids,
          store_uuid: Sr.store_uuid,
          title: { type: "string", maxLength: 200 },
          filename: { type: "string", maxLength: 100 },
          columns: { type: "integer", minimum: 1, maximum: 5 },
          panels: {
            type: "array",
            minItems: 2,
            maxItems: 25,
            items: {
              type: "object",
              properties: {
                field: Sr.field,
                roi: Sr.bbox,
                source_channels: Sr.source_channels,
                overlays: Sr.overlays,
                t: Sr.t,
                z: Sr.z,
                title: { type: "string", maxLength: 160 },
                caption: { type: "string", maxLength: 320 }
              },
              required: ["field", "roi", "source_channels", "overlays", "title"],
              additionalProperties: !1
            }
          }
        },
        required: ["evidence_ids", "store_uuid", "panels"],
        additionalProperties: !1
      }
    }
  }
], ec = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, gf = 32 * 1024 * 1024, wf = 2048, kf = 1024;
function sn(o, i) {
  if (!o || typeof o != "object" || Array.isArray(o))
    throw new Error(`${i} is not a valid object`);
  return o;
}
function kt(o, i, a = 0) {
  if (!Number.isInteger(o) || Number(o) < a)
    throw new Error(`${i} must be an integer of at least ${a}`);
  return Number(o);
}
function Bu(o, i) {
  if (typeof o != "number" || !Number.isFinite(o))
    throw new Error(`${i} must be a finite number`);
  return o;
}
function Ka(o, i) {
  if (typeof o != "string" || !o || o.length > 1024)
    throw new Error(`${i} must be a non-empty relative path`);
  const a = o.replaceAll("\\", "/").replace(/^\.\/+/, "");
  if ((a.startsWith("/") || a.split("/").some((c) => !c || c === ".." || c === ".")) && a !== ".")
    throw new Error(`${i} is not a safe relative path`);
  return a;
}
function Fh(o) {
  const i = sn(o, "ZarrViewer integration status");
  if (i.schema_version !== 1 || typeof i.available != "boolean" || typeof i.installed != "boolean" || typeof i.enabled != "boolean" || !(i.version == null || typeof i.version == "string") || typeof i.minimum_version != "string" || !["ready", "not-installed", "incompatible-version", "app-disabled"].includes(i.reason))
    throw new Error("OMERO returned invalid ZarrViewer integration metadata");
  if (i.available && (typeof i.viewer_url != "string" || typeof i.image_capabilities_template != "string" || typeof i.plate_capabilities_template != "string"))
    throw new Error("The available ZarrViewer integration has no route templates");
  return i;
}
function Dh(o) {
  const i = sn(o, "ZarrViewer capability"), a = sn(i.image, "ZarrViewer image"), c = sn(i.store, "ZarrViewer store");
  if (i.schema_version !== 1 || i.supported !== !0 || !["image", "plate"].includes(i.kind) || !Number.isInteger(a.id) || typeof a.name != "string" || typeof c.uuid != "string" || !ec.test(c.uuid) || typeof c.roi_url != "string" || typeof c.render_url != "string" || typeof i.initial_path != "string" || !Array.isArray(i.channels) || !Array.isArray(i.labels))
    throw new Error("ZarrViewer returned an invalid capability");
  const d = i.channels.map((k) => {
    const w = sn(k, "ZarrViewer channel");
    if (!Number.isInteger(w.index) || typeof w.label != "string" || typeof w.active != "boolean") throw new Error("ZarrViewer returned an invalid channel");
    return { index: w.index, label: w.label, active: w.active };
  }), p = i.labels.map((k) => {
    const w = sn(k, "ZarrViewer label");
    if (typeof w.id != "string" || typeof w.name != "string" || typeof w.path != "string") throw new Error("ZarrViewer returned an invalid label");
    return { id: w.id, name: w.name, path: w.path };
  });
  let y;
  if (i.plate != null) {
    const k = sn(i.plate, "ZarrViewer plate");
    if (!Array.isArray(k.wells)) throw new Error("ZarrViewer returned an invalid plate");
    y = {
      wells: k.wells.map((w) => {
        const N = sn(w, "ZarrViewer well");
        if (typeof N.path != "string" || !Array.isArray(N.fields))
          throw new Error("ZarrViewer returned an invalid well");
        return {
          path: N.path,
          fields: N.fields.map((b) => {
            const A = sn(b, "ZarrViewer field");
            if (typeof A.path != "string" || typeof A.name != "string")
              throw new Error("ZarrViewer returned an invalid field");
            return { path: A.path, name: A.name };
          })
        };
      })
    };
  }
  return {
    schema_version: 1,
    supported: !0,
    image: { id: a.id, name: a.name },
    store: {
      uuid: c.uuid.toLowerCase(),
      roi_url: c.roi_url,
      render_url: c.render_url
    },
    kind: i.kind,
    initial_path: i.initial_path,
    channels: d,
    labels: p,
    ...y ? { plate: y } : {}
  };
}
function Uh(o, i, a) {
  const c = Math.min(64, i), d = Math.min(64, a), p = Math.max(0, Math.min(i - c, Math.floor(o[0] - c / 2))), y = Math.max(0, Math.min(a - d, Math.floor(o[1] - d / 2)));
  return [p, y, p + c, y + d];
}
function Bh(o, i) {
  const a = Math.min(kf, o), c = Math.min(kf, i), d = Math.floor((o - a) / 2), p = Math.floor((i - c) / 2);
  return [d, p, d + a, p + c];
}
function Zf(o) {
  const i = sn(o, "Zarr overlay"), a = i.label_path == null ? void 0 : Ka(i.label_path, "overlay label_path"), c = i.label_channel == null ? void 0 : kt(i.label_channel, "overlay label_channel", 1);
  if (!!a == !!c)
    throw new Error("Each overlay requires either label_path or label_channel");
  const d = i.values == null ? void 0 : Array.from(new Set(
    (Array.isArray(i.values) ? i.values : []).map((N, b) => kt(N, `overlay values[${b}]`, 1))
  ));
  if (d && d.length > 256) throw new Error("An overlay supports at most 256 values");
  const p = i.mode == null ? "outline" : String(i.mode);
  if (!["outline", "fill", "outline-fill"].includes(p))
    throw new Error("overlay mode must be outline, fill, or outline-fill");
  const y = i.opacity == null ? p === "fill" ? 0.3 : 1 : Bu(i.opacity, "overlay opacity");
  if (y < 0 || y > 1) throw new Error("overlay opacity must be between 0 and 1");
  const k = i.outline_width == null ? 2 : kt(i.outline_width, "overlay outline_width", 1);
  if (k > 8) throw new Error("overlay outline_width must be at most 8");
  const w = i.color == null ? void 0 : String(i.color);
  if (w && !/^#[0-9a-f]{6}$/i.test(w))
    throw new Error("overlay color must use #RRGGBB");
  return {
    labelPath: a,
    labelChannel: c,
    values: d,
    mode: p,
    color: w,
    opacity: y,
    outlineWidth: k,
    name: typeof i.name == "string" ? i.name.trim().slice(0, 80) : void 0
  };
}
function Qf(o) {
  if (!Array.isArray(o) || !o.length || o.some((i) => typeof i != "string"))
    throw new Error("evidence_ids must contain at least one evidence ID");
  return Array.from(new Set(o)).slice(0, 32);
}
function Vh(o) {
  const i = sn(o, "ZarrViewer focus");
  if (typeof i.store_uuid != "string" || !ec.test(i.store_uuid))
    throw new Error("store_uuid must be a canonical UUID from the measurement database");
  const a = Ka(i.field, "field");
  if (!["object", "point", "field"].includes(i.target_kind))
    throw new Error("target_kind must be object, point, or field");
  const c = kt(i.size_x, "size_x", 1), d = kt(i.size_y, "size_y", 1), p = i.size_z == null ? void 0 : kt(i.size_z, "size_z", 1), y = i.size_t == null ? void 0 : kt(i.size_t, "size_t", 1), k = i.t == null ? 0 : kt(i.t, "t"), w = i.z == null ? 0 : kt(i.z, "z");
  if (y != null && k >= y) throw new Error("t is outside the database image bounds");
  if (p != null && w >= p) throw new Error("z is outside the database image bounds");
  let N;
  if (i.bbox != null) {
    if (!Array.isArray(i.bbox) || i.bbox.length !== 4)
      throw new Error("bbox must contain x0,y0,x1,y1");
    if (N = i.bbox.map((Te, _e) => kt(Te, `bbox[${_e}]`)), N[0] >= N[2] || N[1] >= N[3] || N[2] > c || N[3] > d) throw new Error("bbox is empty or outside the database image bounds");
  }
  let b;
  if (i.centroid != null) {
    if (!Array.isArray(i.centroid) || i.centroid.length !== 2)
      throw new Error("centroid must contain x,y");
    b = [
      Bu(i.centroid[0], "centroid[0]"),
      Bu(i.centroid[1], "centroid[1]")
    ];
  }
  let A, M = !1;
  if (i.target_kind === "object") {
    if (!N) throw new Error("An object preview requires its database bounding box");
    A = N;
  } else if (i.target_kind === "point") {
    if (!b) throw new Error("A point preview requires its database centroid");
    A = Uh(b, c, d);
  } else c <= wf && d <= wf ? A = [0, 0, c, d] : (A = Bh(c, d), M = !0);
  const W = i.source_channels == null ? [] : Array.from(new Set(
    (Array.isArray(i.source_channels) ? i.source_channels : []).map((Te, _e) => kt(Te, `source_channels[${_e}]`, 1))
  ));
  if (W.length > 4) throw new Error("At most four source channels may be rendered");
  const q = i.label_path == null ? void 0 : Ka(i.label_path, "label_path"), F = i.label_channel == null ? void 0 : kt(i.label_channel, "label_channel", 1);
  if (q && F != null)
    throw new Error("Use either label_path or label_channel, not both");
  const Y = i.label_value == null ? void 0 : kt(i.label_value, "label_value", 1);
  if ((q || F != null) && Y == null)
    throw new Error("A label overlay requires label_value");
  const je = i.overlays == null ? [] : (Array.isArray(i.overlays) ? i.overlays : []).map(Zf);
  if (je.length > 8) throw new Error("At most eight overlays may be rendered");
  return !je.length && (q || F != null) && je.push({
    labelPath: q,
    labelChannel: F,
    values: Y == null ? void 0 : [Y],
    mode: "outline",
    opacity: 1,
    outlineWidth: 2
  }), {
    evidenceIds: Qf(i.evidence_ids),
    storeUuid: i.store_uuid.toLowerCase(),
    field: a,
    targetKind: i.target_kind,
    sizeX: c,
    sizeY: d,
    sizeZ: p,
    sizeT: y,
    bbox: N,
    centroid: b,
    sourceChannels: W,
    labelPath: q,
    labelChannel: F,
    labelValue: Y,
    overlays: je,
    t: k,
    z: w,
    roi: A,
    croppedField: M,
    title: typeof i.title == "string" && i.title.trim() ? i.title.trim().slice(0, 180) : `${a} ${i.target_kind} preview`
  };
}
function Wh(o) {
  const i = sn(o, "Zarr gallery");
  if (typeof i.store_uuid != "string" || !ec.test(i.store_uuid))
    throw new Error("store_uuid must be a canonical UUID from the measurement database");
  if (!Array.isArray(i.panels) || i.panels.length < 2 || i.panels.length > 25)
    throw new Error("A gallery requires 2 through 25 panels");
  const a = i.panels.map((d, p) => {
    const y = sn(d, `gallery panel ${p + 1}`);
    if (!Array.isArray(y.roi) || y.roi.length !== 4)
      throw new Error(`gallery panel ${p + 1} roi must contain x0,y0,x1,y1`);
    const k = y.roi.map(
      (b, A) => kt(b, `gallery panel ${p + 1} roi[${A}]`)
    );
    if (k[0] >= k[2] || k[1] >= k[3] || k[2] - k[0] > 2048 || k[3] - k[1] > 2048)
      throw new Error(`gallery panel ${p + 1} roi is empty or exceeds 2048×2048`);
    const w = Array.from(new Set(
      (Array.isArray(y.source_channels) ? y.source_channels : []).map((b, A) => kt(b, `source_channels[${A}]`, 1))
    ));
    if (w.length > 4) throw new Error("At most four source channels may be rendered");
    const N = (Array.isArray(y.overlays) ? y.overlays : []).map(Zf);
    if (N.length > 8) throw new Error("At most eight overlays may be rendered");
    return {
      field: Ka(y.field, `gallery panel ${p + 1} field`),
      roi: k,
      sourceChannels: w,
      t: y.t == null ? 0 : kt(y.t, "t"),
      z: y.z == null ? 0 : kt(y.z, "z"),
      title: typeof y.title == "string" ? y.title.trim().slice(0, 160) : `Panel ${p + 1}`,
      caption: typeof y.caption == "string" ? y.caption.trim().slice(0, 320) : void 0,
      overlays: N,
      scaleBar: !0
    };
  }), c = i.columns == null ? void 0 : kt(i.columns, "columns", 1);
  if (c != null && c > 5) throw new Error("columns must be at most 5");
  return {
    evidenceIds: Qf(i.evidence_ids),
    recipe: {
      storeUuid: i.store_uuid.toLowerCase(),
      title: typeof i.title == "string" ? i.title.trim().slice(0, 200) : void 0,
      filename: typeof i.filename == "string" ? i.filename.trim().slice(0, 100) : void 0,
      layout: c == null ? void 0 : { columns: c },
      panels: a
    }
  };
}
function Hh(o, i) {
  if (!o) return [];
  const a = (i == null ? void 0 : i.current) || {
    type: o.object_type,
    id: o.object_id,
    name: o.name,
    supported: !0
  };
  if (a.type === "Image" || a.type === "Plate") return [a];
  const c = a.type === "Screen" ? "Plate" : a.type === "Dataset" ? "Image" : "";
  return c ? ((i == null ? void 0 : i.children) || []).filter(
    (d) => d.supported && d.type === c
  ) : [];
}
function qh(o, i) {
  return o.replace("/0/", `/${i}/`);
}
async function Kh(o) {
  var a;
  const i = await o.json().catch(() => ({}));
  if (!o.ok)
    throw new Error(((a = i.error) == null ? void 0 : a.message) || `${o.status} ${o.statusText}`);
  return i;
}
async function xf(o, i) {
  if (!o.available) throw new Error(`ZarrViewer is unavailable: ${o.reason}`);
  const a = i.type === "Plate" ? o.plate_capabilities_template : i.type === "Image" ? o.image_capabilities_template : void 0;
  if (!a) throw new Error(`ZarrViewer cannot bind an OMERO ${i.type}`);
  const c = await fetch(qh(a, i.id), { credentials: "same-origin" });
  return Dh(await Kh(c));
}
function Jf(o) {
  var i;
  return /* @__PURE__ */ new Set([
    o.initial_path,
    ...((i = o.plate) == null ? void 0 : i.wells.flatMap((a) => a.fields.map((c) => c.path))) || []
  ]);
}
function Gf(o, i) {
  if (o.store.uuid.toLowerCase() !== i.storeUuid)
    throw new Error("The measurement database belongs to a different OME-Zarr store");
  if (!Jf(o).has(i.field))
    throw new Error(`Field ${i.field} is not available in the matched OME-Zarr store`);
  const a = new Set(o.channels.map((c) => c.index + 1));
  if (i.sourceChannels.some((c) => !a.has(c)))
    throw new Error("A requested source channel is not available in ZarrViewer");
  if (i.labelChannel != null && !a.has(i.labelChannel))
    throw new Error("The requested label channel is not available in ZarrViewer");
  if (i.labelPath) {
    const c = i.labelPath.split("/").at(-1);
    if (!o.labels.some(
      (p) => p.path === i.labelPath || p.path.split("/").at(-1) === c
    )) throw new Error("The requested label path is not available in ZarrViewer");
  }
  for (const c of i.overlays) {
    if (c.labelChannel != null && !a.has(c.labelChannel))
      throw new Error("A requested overlay label channel is not available in ZarrViewer");
    if (c.labelPath) {
      const d = c.labelPath.split("/").at(-1);
      if (!o.labels.some(
        (y) => y.path === c.labelPath || y.path.split("/").at(-1) === d
      )) throw new Error("A requested overlay label path is not available in ZarrViewer");
    }
  }
}
function Zh(o, i) {
  if (o.store.uuid !== i.storeUuid)
    throw new Error("The measurement database belongs to a different OME-Zarr store");
  const a = Jf(o), c = new Set(o.channels.map((d) => d.index + 1));
  for (const d of i.panels) {
    if (!a.has(d.field)) throw new Error(`Field ${d.field} is unavailable`);
    if (d.sourceChannels.some((p) => !c.has(p)))
      throw new Error("A gallery source channel is unavailable");
    for (const p of d.overlays) {
      if (p.labelChannel != null && !c.has(p.labelChannel))
        throw new Error("A gallery label channel is unavailable");
      if (p.labelPath) {
        const y = p.labelPath.split("/").at(-1);
        if (!o.labels.some(
          (k) => k.path === p.labelPath || k.path.split("/").at(-1) === y
        )) throw new Error("A gallery label path is unavailable");
      }
    }
  }
}
function Qh(o, i) {
  return o.searchParams.set("v", "2"), o.searchParams.set("field", i.field), o.searchParams.set("roi", i.roi.join(",")), o.searchParams.set("t", String(i.t)), o.searchParams.set("z", String(i.z)), o.searchParams.set("storeUuid", i.storeUuid), i.sourceChannels.length && o.searchParams.set("sourceChannels", i.sourceChannels.join(",")), i.labelPath && o.searchParams.set("labelPath", i.labelPath), i.labelChannel != null && o.searchParams.set("labelChannel", String(i.labelChannel)), i.labelValue != null && o.searchParams.set("labelValue", String(i.labelValue)), i.overlays.length && o.searchParams.set("overlays", JSON.stringify(i.overlays)), o;
}
function Jh(o, i, a) {
  if (Gf(i, a), !o.viewer_url) throw new Error("ZarrViewer has no viewer route");
  const c = new URL(o.viewer_url, window.location.href);
  return c.searchParams.set("image", String(i.image.id)), Qh(c, a).toString();
}
async function Gh(o, i) {
  Gf(o, i);
  const a = {
    storeUuid: i.storeUuid,
    filename: `${i.title}.png`,
    panels: [{
      field: i.field,
      roi: i.roi,
      sourceChannels: i.sourceChannels,
      t: i.t,
      z: i.z,
      title: i.title,
      overlays: i.overlays,
      scaleBar: !0
    }]
  };
  return Xf(o, a);
}
async function Xf(o, i) {
  var y;
  Zh(o, i);
  const a = await fetch(
    new URL(o.store.render_url, window.location.href),
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": ((y = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)) == null ? void 0 : y[1]) || ""
      },
      body: JSON.stringify(i)
    }
  );
  if (!a.ok) throw new Error(await a.text() || `${a.status} ${a.statusText}`);
  if ((a.headers.get("content-type") || "").split(";", 1)[0].toLowerCase() !== "image/png") throw new Error("ZarrViewer did not return a PNG preview");
  if (Number(a.headers.get("content-length") || 0) > gf) throw new Error("ZarrViewer preview exceeds 32 MiB");
  const p = await a.arrayBuffer();
  if (p.byteLength > gf) throw new Error("ZarrViewer preview exceeds 32 MiB");
  return p;
}
function jf(o, i, a, c) {
  if (i.type !== "Image" && i.type !== "Plate")
    throw new Error("A Zarr binding requires an OMERO Image or Plate");
  return {
    storeUuid: o.store.uuid,
    objectType: i.type,
    objectId: i.id,
    groupId: a,
    capabilityImageId: o.image.id,
    viewerVersion: c,
    validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    verified: !0
  };
}
function Xh(o, i, a) {
  return {
    application: "biomero-zarr-viewer",
    viewerVersion: o.viewerVersion,
    storeUuid: o.storeUuid,
    objectType: o.objectType,
    objectId: o.objectId,
    capabilityImageId: o.capabilityImageId,
    field: i.field,
    roi: i.roi,
    sourceChannels: i.sourceChannels,
    labelPath: i.labelPath,
    labelChannel: i.labelChannel,
    labelValue: i.labelValue,
    overlays: i.overlays,
    evidenceIds: i.evidenceIds,
    renderRecipe: {
      storeUuid: i.storeUuid,
      panels: [{
        field: i.field,
        roi: i.roi,
        sourceChannels: i.sourceChannels,
        t: i.t,
        z: i.z,
        title: i.title,
        overlays: i.overlays
      }]
    },
    renderKind: "roi",
    t: i.t,
    z: i.z,
    viewerUrl: a,
    croppedField: i.croppedField
  };
}
function Yh(o, i, a) {
  const c = i.panels[0];
  return {
    application: "biomero-zarr-viewer",
    viewerVersion: o.viewerVersion,
    storeUuid: o.storeUuid,
    objectType: o.objectType,
    objectId: o.objectId,
    capabilityImageId: o.capabilityImageId,
    field: c.field,
    roi: c.roi,
    sourceChannels: c.sourceChannels,
    overlays: c.overlays,
    evidenceIds: a,
    renderRecipe: i,
    renderKind: "gallery",
    t: c.t,
    z: c.z,
    viewerUrl: "",
    croppedField: !1
  };
}
function za() {
  const o = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return o ? decodeURIComponent(o[1]) : "";
}
function vi(o, i, a) {
  return o.replace("TYPE", i).replace("/1/", `/${a}/`);
}
class em {
  constructor(i) {
    Xn(this, "contextToken", "");
    Xn(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = i;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const i = this.bootstrap.context;
    if (!i) return;
    const a = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": za()
      },
      body: JSON.stringify({
        object_type: i.object_type,
        object_id: i.object_id
      })
    }), c = await Yn(a);
    if (typeof c.context_token != "string" || !Array.isArray(c.operations) || c.operations.some((d) => typeof d != "string"))
      throw new Error("OMERO returned an invalid context capability");
    this.contextToken = c.context_token, this.operations = new Set(c.operations);
  }
  async authorizedFetch(i, a = {}, c = !0) {
    const d = await fetch(i, {
      ...a,
      credentials: "same-origin",
      headers: {
        ...a.headers || {},
        "X-OMERO-Analysis-Context": this.contextToken
      }
    });
    return c && (d.status === 401 || d.status === 403) ? (await this.connect(), this.authorizedFetch(i, a, !1)) : d;
  }
  async download(i) {
    const a = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${i.annotation_id}/download/`
    ), c = await this.authorizedFetch(a);
    if (!c.ok) throw new Error(await Va(c));
    return c.arrayBuffer();
  }
  async attach(i) {
    const a = this.bootstrap.context;
    if (!a || !i.data) throw new Error("No OMERO target or result data");
    const c = new FormData();
    c.append("file", new Blob([i.data], { type: i.type }), i.name);
    const d = await this.authorizedFetch(
      vi(
        this.bootstrap.uploadTemplate,
        a.object_type,
        a.object_id
      ),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": za()
        },
        body: c
      }
    ), p = await Yn(d);
    return Wa(p.attachment);
  }
  async listSnapshots() {
    const i = this.bootstrap.context;
    if (!i) return [];
    const a = await this.authorizedFetch(
      vi(this.bootstrap.snapshotsTemplate, i.object_type, i.object_id),
      {
        headers: {}
      }
    ), c = await Yn(a);
    return Sf(c.snapshots);
  }
  async hierarchy() {
    const i = this.bootstrap.context;
    if (!i) return null;
    const a = await this.authorizedFetch(
      vi(this.bootstrap.hierarchyTemplate, i.object_type, i.object_id)
    );
    return tm(await Yn(a));
  }
  async uploadSnapshot(i, a) {
    const c = this.bootstrap.context;
    if (!c) throw new Error("No OMERO target for the project snapshot");
    const d = new FormData();
    d.append(
      "file",
      new Blob([a], { type: "application/zip" }),
      i
    );
    const p = await this.authorizedFetch(
      vi(this.bootstrap.snapshotUploadTemplate, c.object_type, c.object_id),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": za()
        },
        body: d
      }
    ), y = await Yn(p);
    return Wa(y.snapshot);
  }
  async downloadSnapshot(i) {
    const a = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${i.annotation_id}/download/`
    ), c = await this.authorizedFetch(a);
    if (!c.ok) throw new Error(await Va(c));
    return c.arrayBuffer();
  }
  async listWorkflowTemplates() {
    const i = this.bootstrap.context;
    if (!i) return [];
    const a = await this.authorizedFetch(
      vi(this.bootstrap.workflowTemplatesTemplate, i.object_type, i.object_id)
    ), c = await Yn(a);
    return Sf(c.workflows);
  }
  async uploadWorkflowTemplate(i, a) {
    const c = this.bootstrap.context;
    if (!c) throw new Error("No OMERO target for the workflow template");
    const d = new FormData();
    d.append("file", new Blob([a], { type: "application/json" }), i);
    const p = await this.authorizedFetch(
      vi(this.bootstrap.workflowTemplatesTemplate, c.object_type, c.object_id),
      { method: "POST", headers: { "X-CSRFToken": za() }, body: d }
    ), y = await Yn(p);
    return Wa(y.workflow);
  }
  async downloadWorkflowTemplate(i) {
    const a = this.bootstrap.workflowDownloadTemplate.replace(
      "/1/download/",
      `/${i.annotation_id}/download/`
    ), c = await this.authorizedFetch(a);
    if (!c.ok) throw new Error(await Va(c));
    return c.arrayBuffer();
  }
  async listWorkflowSkills() {
    const i = await fetch(this.bootstrap.workflowSkillsUrl, {
      credentials: "same-origin"
    });
    return Yf(await Yn(i));
  }
  async zarrViewerStatus() {
    const i = await fetch(this.bootstrap.zarrViewerStatusUrl, {
      credentials: "same-origin"
    });
    return Fh(await Yn(i));
  }
  async loadWorkflowSkill(i, a) {
    const c = await this.listWorkflowSkills();
    if (![...c.workflows, ...c.applications || []].flatMap((w) => w.skills).find(
      (w) => (w.source_key || w.workflow_key) === i && w.name === a
    )) throw new Error(`Workflow skill ${i}/${a} is unavailable`);
    const y = `${this.bootstrap.workflowSkillsUrl.replace(/\/?$/, "/")}${encodeURIComponent(i)}/${encodeURIComponent(a)}/`, k = await fetch(y, { credentials: "same-origin" });
    return nm(await Yn(k));
  }
}
async function Va(o) {
  var i;
  try {
    return ((i = (await o.json()).error) == null ? void 0 : i.message) || `${o.status} ${o.statusText}`;
  } catch {
    return `${o.status} ${o.statusText}`;
  }
}
async function Yn(o) {
  var a;
  const i = await o.json().catch(() => ({}));
  if (!o.ok)
    throw new Error(((a = i.error) == null ? void 0 : a.message) || `${o.status} ${o.statusText}`);
  return i;
}
function Mt(o, i) {
  if (!o || typeof o != "object" || Array.isArray(o))
    throw new Error(`${i} is not a valid object`);
  return o;
}
function Wa(o) {
  const i = Mt(o, "OMERO attachment");
  if (!Number.isInteger(i.annotation_id) || !Number.isInteger(i.file_id) || typeof i.name != "string" || typeof i.mimetype != "string" || typeof i.size != "number" || !["attachment", "result", "project", "workflow"].includes(i.kind) || typeof i.supported != "boolean")
    throw new Error("OMERO returned invalid attachment metadata");
  return i;
}
function Sf(o) {
  if (o == null) return [];
  if (!Array.isArray(o)) throw new Error("OMERO returned an invalid attachment list");
  return o.map(Wa);
}
function tm(o) {
  const i = Mt(o, "OMERO hierarchy"), a = (c) => {
    const d = Mt(c, "OMERO hierarchy item");
    if (typeof d.type != "string" || !Number.isInteger(d.id) || typeof d.name != "string" || typeof d.supported != "boolean") throw new Error("OMERO returned an invalid hierarchy item");
    return d;
  };
  if (!Array.isArray(i.parents) || !Array.isArray(i.children))
    throw new Error("OMERO returned an invalid hierarchy");
  return {
    current: a(i.current),
    parents: i.parents.map(a),
    children: i.children.map(a)
  };
}
function Yf(o) {
  const i = Mt(o, "workflow skill catalog");
  if (i.schema !== "nl.bioimaging.omero-workflow-skills.v1" || i.consumer !== "omero-analysis" || !Array.isArray(i.workflows) || !(i.applications == null || Array.isArray(i.applications)) || !Array.isArray(i.diagnostics))
    throw new Error("OMERO returned an invalid workflow skill catalog");
  i.applications = i.applications || [];
  for (const a of [...i.workflows, ...i.applications]) {
    const c = Mt(a, "workflow skill entry"), d = Mt(c.source, "workflow skill source");
    if (typeof d.workflow_key != "string" || !(d.source_kind == null || ["workflow", "application"].includes(d.source_kind)) || !(d.source_key == null || typeof d.source_key == "string") || typeof d.repository_url != "string" || typeof d.configured_ref != "string" || typeof d.resolved_commit != "string" || !Array.isArray(c.skills))
      throw new Error("OMERO returned invalid workflow skill metadata");
    for (const p of c.skills) {
      const y = Mt(p, "workflow skill");
      if (typeof y.name != "string" || typeof y.sha256 != "string" || typeof y.package_url != "string" || !(y.required_resources == null || Array.isArray(y.required_resources) && y.required_resources.every((k) => typeof k == "string")) || !(y.required_capabilities == null || Array.isArray(y.required_capabilities) && y.required_capabilities.every((k) => typeof k == "string")) || !y.match || typeof y.match != "object")
        throw new Error("OMERO returned an invalid workflow skill");
    }
  }
  return i;
}
function nm(o) {
  const i = Mt(o, "workflow skill package"), c = Mt(i.source, "workflow skill source").source_kind === "application" ? "applications" : "workflows";
  if (Yf({
    schema: "nl.bioimaging.omero-workflow-skills.v1",
    consumer: "omero-analysis",
    workflows: c === "workflows" ? [{
      source: i.source,
      status: "ready",
      checked_at: "",
      skills: [i.skill]
    }] : [],
    applications: c === "applications" ? [{
      source: i.source,
      status: "ready",
      checked_at: "",
      skills: [i.skill]
    }] : [],
    diagnostics: []
  }), !Array.isArray(i.files))
    throw new Error("OMERO returned an invalid workflow skill package");
  for (const d of i.files) {
    const p = Mt(d, "workflow skill file");
    if (typeof p.path != "string" || typeof p.content != "string" || typeof p.sha256 != "string" || p.path !== "SKILL.md" && !p.path.startsWith("references/"))
      throw new Error("OMERO returned an unsafe workflow skill file");
  }
  return i;
}
async function rm(o, i, a, c, d = Kf) {
  var W, q, F, Y, je, Te;
  const p = d.length ? { tools: d, tool_choice: "auto" } : {}, y = await fetch(Oh, {
    method: "POST",
    signal: a,
    headers: {
      "Content-Type": "application/json",
      "api-key": o.apiKey
    },
    body: JSON.stringify({
      model: o.model,
      temperature: Mh,
      messages: i,
      ...p,
      stream: !!c,
      stream_options: c ? { include_usage: !0 } : void 0
    })
  });
  if (!y.ok) throw new Error(await Va(y));
  if (!c || !((W = y.headers.get("content-type")) != null && W.includes("text/event-stream")))
    return _f(await y.json());
  const k = (q = y.body) == null ? void 0 : q.getReader();
  if (!k) throw new Error("AmsterdamUMC returned an empty response stream");
  const w = new TextDecoder();
  let N = "", b = "", A;
  const M = /* @__PURE__ */ new Map();
  for (; ; ) {
    const { value: _e, done: Ee } = await k.read();
    N += w.decode(_e || new Uint8Array(), { stream: !Ee });
    const Ae = N.split(/\r?\n/);
    N = Ae.pop() || "";
    for (const $e of Ae) {
      if (!$e.startsWith("data:")) continue;
      const se = $e.slice(5).trim();
      if (!se || se === "[DONE]") continue;
      const ve = JSON.parse(se);
      ve.usage && (A = ve.usage);
      const ie = (Y = (F = ve.choices) == null ? void 0 : F[0]) == null ? void 0 : Y.delta;
      ie != null && ie.content && (b += ie.content, c(b));
      for (const Fe of (ie == null ? void 0 : ie.tool_calls) || []) {
        const Oe = Number(Fe.index || 0), O = M.get(Oe) || {
          id: "",
          type: "function",
          function: { name: "", arguments: "" }
        };
        O.id += Fe.id || "", O.function.name += ((je = Fe.function) == null ? void 0 : je.name) || "", O.function.arguments += ((Te = Fe.function) == null ? void 0 : Te.arguments) || "", M.set(Oe, O);
      }
    }
    if (Ee) break;
  }
  return _f({
    choices: [{
      message: {
        role: "assistant",
        content: b || null,
        tool_calls: M.size ? Array.from(M.values()) : void 0
      }
    }],
    usage: A
  });
}
function _f(o) {
  const i = Mt(o, "AI response");
  if (!Array.isArray(i.choices) || !i.choices.length)
    throw new Error("AmsterdamUMC returned no response choices");
  for (const a of i.choices) {
    const c = Mt(Mt(a, "AI choice").message, "AI message");
    if (c.role !== "assistant" || !(c.content == null || typeof c.content == "string"))
      throw new Error("AmsterdamUMC returned an invalid assistant message");
    if (c.tool_calls != null) {
      if (!Array.isArray(c.tool_calls)) throw new Error("AmsterdamUMC returned invalid tool calls");
      for (const d of c.tool_calls) {
        const p = Mt(d, "AI tool call"), y = Mt(p.function, "AI tool function");
        if (typeof p.id != "string" || p.type !== "function" || typeof y.name != "string" || typeof y.arguments != "string") throw new Error("AmsterdamUMC returned an invalid tool call");
      }
    }
  }
  return i;
}
function yt(o) {
  const i = String(o instanceof Error ? o.message : o).slice(0, tr), a = JSON.stringify({
    ok: !1,
    error: i,
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
  return a.length > tr ? `${a.slice(0, tr)}
[tool error truncated]` : a;
}
var at = Uint8Array, an = Uint16Array, tc = Int32Array, Ja = new at([
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
]), Ga = new at([
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
]), Vu = new at([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), ep = function(o, i) {
  for (var a = new an(31), c = 0; c < 31; ++c)
    a[c] = i += 1 << o[c - 1];
  for (var d = new tc(a[30]), c = 1; c < 30; ++c)
    for (var p = a[c]; p < a[c + 1]; ++p)
      d[p] = p - a[c] << 5 | c;
  return { b: a, r: d };
}, tp = ep(Ja, 2), np = tp.b, Wu = tp.r;
np[28] = 258, Wu[258] = 28;
var rp = ep(Ga, 0), om = rp.b, Ef = rp.r, Hu = new an(32768);
for (var nt = 0; nt < 32768; ++nt) {
  var Xr = (nt & 43690) >> 1 | (nt & 21845) << 1;
  Xr = (Xr & 52428) >> 2 | (Xr & 13107) << 2, Xr = (Xr & 61680) >> 4 | (Xr & 3855) << 4, Hu[nt] = ((Xr & 65280) >> 8 | (Xr & 255) << 8) >> 1;
}
var or = (function(o, i, a) {
  for (var c = o.length, d = 0, p = new an(i); d < c; ++d)
    o[d] && ++p[o[d] - 1];
  var y = new an(i);
  for (d = 1; d < i; ++d)
    y[d] = y[d - 1] + p[d - 1] << 1;
  var k;
  if (a) {
    k = new an(1 << i);
    var w = 15 - i;
    for (d = 0; d < c; ++d)
      if (o[d])
        for (var N = d << 4 | o[d], b = i - o[d], A = y[o[d] - 1]++ << b, M = A | (1 << b) - 1; A <= M; ++A)
          k[Hu[A] >> w] = N;
  } else
    for (k = new an(c), d = 0; d < c; ++d)
      o[d] && (k[d] = Hu[y[o[d] - 1]++] >> 15 - o[d]);
  return k;
}), Yr = new at(288);
for (var nt = 0; nt < 144; ++nt)
  Yr[nt] = 8;
for (var nt = 144; nt < 256; ++nt)
  Yr[nt] = 9;
for (var nt = 256; nt < 280; ++nt)
  Yr[nt] = 7;
for (var nt = 280; nt < 288; ++nt)
  Yr[nt] = 8;
var ys = new at(32);
for (var nt = 0; nt < 32; ++nt)
  ys[nt] = 5;
var im = /* @__PURE__ */ or(Yr, 9, 0), sm = /* @__PURE__ */ or(Yr, 9, 1), am = /* @__PURE__ */ or(ys, 5, 0), lm = /* @__PURE__ */ or(ys, 5, 1), $u = function(o) {
  for (var i = o[0], a = 1; a < o.length; ++a)
    o[a] > i && (i = o[a]);
  return i;
}, On = function(o, i, a) {
  var c = i / 8 | 0;
  return (o[c] | o[c + 1] << 8) >> (i & 7) & a;
}, Nu = function(o, i) {
  var a = i / 8 | 0;
  return (o[a] | o[a + 1] << 8 | o[a + 2] << 16) >> (i & 7);
}, nc = function(o) {
  return (o + 7) / 8 | 0;
}, gs = function(o, i, a) {
  return (i == null || i < 0) && (i = 0), (a == null || a > o.length) && (a = o.length), new at(o.subarray(i, a));
}, um = [
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
], Ot = function(o, i, a) {
  var c = new Error(i || um[o]);
  if (c.code = o, Error.captureStackTrace && Error.captureStackTrace(c, Ot), !a)
    throw c;
  return c;
}, cm = function(o, i, a, c) {
  var d = o.length, p = c ? c.length : 0;
  if (!d || i.f && !i.l)
    return a || new at(0);
  var y = !a, k = y || i.i != 2, w = i.i;
  y && (a = new at(d * 3));
  var N = function(Qt) {
    var It = a.length;
    if (Qt > It) {
      var $t = new at(Math.max(It * 2, Qt));
      $t.set(a), a = $t;
    }
  }, b = i.f || 0, A = i.p || 0, M = i.b || 0, W = i.l, q = i.d, F = i.m, Y = i.n, je = d * 8;
  do {
    if (!W) {
      b = On(o, A, 1);
      var Te = On(o, A + 1, 3);
      if (A += 3, Te)
        if (Te == 1)
          W = sm, q = lm, F = 9, Y = 5;
        else if (Te == 2) {
          var $e = On(o, A, 31) + 257, se = On(o, A + 10, 15) + 4, ve = $e + On(o, A + 5, 31) + 1;
          A += 14;
          for (var ie = new at(ve), Fe = new at(19), Oe = 0; Oe < se; ++Oe)
            Fe[Vu[Oe]] = On(o, A + Oe * 3, 7);
          A += se * 3;
          for (var O = $u(Fe), xe = (1 << O) - 1, Ie = or(Fe, O, 1), Oe = 0; Oe < ve; ) {
            var Be = Ie[On(o, A, xe)];
            A += Be & 15;
            var _e = Be >> 4;
            if (_e < 16)
              ie[Oe++] = _e;
            else {
              var Re = 0, me = 0;
              for (_e == 16 ? (me = 3 + On(o, A, 3), A += 2, Re = ie[Oe - 1]) : _e == 17 ? (me = 3 + On(o, A, 7), A += 3) : _e == 18 && (me = 11 + On(o, A, 127), A += 7); me--; )
                ie[Oe++] = Re;
            }
          }
          var K = ie.subarray(0, $e), ee = ie.subarray($e);
          F = $u(K), Y = $u(ee), W = or(K, F, 1), q = or(ee, Y, 1);
        } else
          Ot(1);
      else {
        var _e = nc(A) + 4, Ee = o[_e - 4] | o[_e - 3] << 8, Ae = _e + Ee;
        if (Ae > d) {
          w && Ot(0);
          break;
        }
        k && N(M + Ee), a.set(o.subarray(_e, Ae), M), i.b = M += Ee, i.p = A = Ae * 8, i.f = b;
        continue;
      }
      if (A > je) {
        w && Ot(0);
        break;
      }
    }
    k && N(M + 131072);
    for (var X = (1 << F) - 1, C = (1 << Y) - 1, L = A; ; L = A) {
      var Re = W[Nu(o, A) & X], ye = Re >> 4;
      if (A += Re & 15, A > je) {
        w && Ot(0);
        break;
      }
      if (Re || Ot(2), ye < 256)
        a[M++] = ye;
      else if (ye == 256) {
        L = A, W = null;
        break;
      } else {
        var ge = ye - 254;
        if (ye > 264) {
          var Oe = ye - 257, de = Ja[Oe];
          ge = On(o, A, (1 << de) - 1) + np[Oe], A += de;
        }
        var Ce = q[Nu(o, A) & C], Me = Ce >> 4;
        Ce || Ot(3), A += Ce & 15;
        var ee = om[Me];
        if (Me > 3) {
          var de = Ga[Me];
          ee += Nu(o, A) & (1 << de) - 1, A += de;
        }
        if (A > je) {
          w && Ot(0);
          break;
        }
        k && N(M + 131072);
        var be = M + ge;
        if (M < ee) {
          var He = p - ee, ut = Math.min(ee, be);
          for (He + M < 0 && Ot(3); M < ut; ++M)
            a[M] = c[He + M];
        }
        for (; M < be; ++M)
          a[M] = a[M - ee];
      }
    }
    i.l = W, i.p = L, i.b = M, i.f = b, W && (b = 1, i.m = F, i.d = q, i.n = Y);
  } while (!b);
  return M != a.length && y ? gs(a, 0, M) : a.subarray(0, M);
}, jr = function(o, i, a) {
  a <<= i & 7;
  var c = i / 8 | 0;
  o[c] |= a, o[c + 1] |= a >> 8;
}, ds = function(o, i, a) {
  a <<= i & 7;
  var c = i / 8 | 0;
  o[c] |= a, o[c + 1] |= a >> 8, o[c + 2] |= a >> 16;
}, Tu = function(o, i) {
  for (var a = [], c = 0; c < o.length; ++c)
    o[c] && a.push({ s: c, f: o[c] });
  var d = a.length, p = a.slice();
  if (!d)
    return { t: ip, l: 0 };
  if (d == 1) {
    var y = new at(a[0].s + 1);
    return y[a[0].s] = 1, { t: y, l: 1 };
  }
  a.sort(function(Ae, $e) {
    return Ae.f - $e.f;
  }), a.push({ s: -1, f: 25001 });
  var k = a[0], w = a[1], N = 0, b = 1, A = 2;
  for (a[0] = { s: -1, f: k.f + w.f, l: k, r: w }; b != d - 1; )
    k = a[a[N].f < a[A].f ? N++ : A++], w = a[N != b && a[N].f < a[A].f ? N++ : A++], a[b++] = { s: -1, f: k.f + w.f, l: k, r: w };
  for (var M = p[0].s, c = 1; c < d; ++c)
    p[c].s > M && (M = p[c].s);
  var W = new an(M + 1), q = qu(a[b - 1], W, 0);
  if (q > i) {
    var c = 0, F = 0, Y = q - i, je = 1 << Y;
    for (p.sort(function($e, se) {
      return W[se.s] - W[$e.s] || $e.f - se.f;
    }); c < d; ++c) {
      var Te = p[c].s;
      if (W[Te] > i)
        F += je - (1 << q - W[Te]), W[Te] = i;
      else
        break;
    }
    for (F >>= Y; F > 0; ) {
      var _e = p[c].s;
      W[_e] < i ? F -= 1 << i - W[_e]++ - 1 : ++c;
    }
    for (; c >= 0 && F; --c) {
      var Ee = p[c].s;
      W[Ee] == i && (--W[Ee], ++F);
    }
    q = i;
  }
  return { t: new at(W), l: q };
}, qu = function(o, i, a) {
  return o.s == -1 ? Math.max(qu(o.l, i, a + 1), qu(o.r, i, a + 1)) : i[o.s] = a;
}, Cf = function(o) {
  for (var i = o.length; i && !o[--i]; )
    ;
  for (var a = new an(++i), c = 0, d = o[0], p = 1, y = function(w) {
    a[c++] = w;
  }, k = 1; k <= i; ++k)
    if (o[k] == d && k != i)
      ++p;
    else {
      if (!d && p > 2) {
        for (; p > 138; p -= 138)
          y(32754);
        p > 2 && (y(p > 10 ? p - 11 << 5 | 28690 : p - 3 << 5 | 12305), p = 0);
      } else if (p > 3) {
        for (y(d), --p; p > 6; p -= 6)
          y(8304);
        p > 2 && (y(p - 3 << 5 | 8208), p = 0);
      }
      for (; p--; )
        y(d);
      p = 1, d = o[k];
    }
  return { c: a.subarray(0, c), n: i };
}, fs = function(o, i) {
  for (var a = 0, c = 0; c < i.length; ++c)
    a += o[c] * i[c];
  return a;
}, op = function(o, i, a) {
  var c = a.length, d = nc(i + 2);
  o[d] = c & 255, o[d + 1] = c >> 8, o[d + 2] = o[d] ^ 255, o[d + 3] = o[d + 1] ^ 255;
  for (var p = 0; p < c; ++p)
    o[d + p + 4] = a[p];
  return (d + 4 + c) * 8;
}, bf = function(o, i, a, c, d, p, y, k, w, N, b) {
  jr(i, b++, a), ++d[256];
  for (var A = Tu(d, 15), M = A.t, W = A.l, q = Tu(p, 15), F = q.t, Y = q.l, je = Cf(M), Te = je.c, _e = je.n, Ee = Cf(F), Ae = Ee.c, $e = Ee.n, se = new an(19), ve = 0; ve < Te.length; ++ve)
    ++se[Te[ve] & 31];
  for (var ve = 0; ve < Ae.length; ++ve)
    ++se[Ae[ve] & 31];
  for (var ie = Tu(se, 7), Fe = ie.t, Oe = ie.l, O = 19; O > 4 && !Fe[Vu[O - 1]]; --O)
    ;
  var xe = N + 5 << 3, Ie = fs(d, Yr) + fs(p, ys) + y, Be = fs(d, M) + fs(p, F) + y + 14 + 3 * O + fs(se, Fe) + 2 * se[16] + 3 * se[17] + 7 * se[18];
  if (w >= 0 && xe <= Ie && xe <= Be)
    return op(i, b, o.subarray(w, w + N));
  var Re, me, K, ee;
  if (jr(i, b, 1 + (Be < Ie)), b += 2, Be < Ie) {
    Re = or(M, W, 0), me = M, K = or(F, Y, 0), ee = F;
    var X = or(Fe, Oe, 0);
    jr(i, b, _e - 257), jr(i, b + 5, $e - 1), jr(i, b + 10, O - 4), b += 14;
    for (var ve = 0; ve < O; ++ve)
      jr(i, b + 3 * ve, Fe[Vu[ve]]);
    b += 3 * O;
    for (var C = [Te, Ae], L = 0; L < 2; ++L)
      for (var ye = C[L], ve = 0; ve < ye.length; ++ve) {
        var ge = ye[ve] & 31;
        jr(i, b, X[ge]), b += Fe[ge], ge > 15 && (jr(i, b, ye[ve] >> 5 & 127), b += ye[ve] >> 12);
      }
  } else
    Re = im, me = Yr, K = am, ee = ys;
  for (var ve = 0; ve < k; ++ve) {
    var de = c[ve];
    if (de > 255) {
      var ge = de >> 18 & 31;
      ds(i, b, Re[ge + 257]), b += me[ge + 257], ge > 7 && (jr(i, b, de >> 23 & 31), b += Ja[ge]);
      var Ce = de & 31;
      ds(i, b, K[Ce]), b += ee[Ce], Ce > 3 && (ds(i, b, de >> 5 & 8191), b += Ga[Ce]);
    } else
      ds(i, b, Re[de]), b += me[de];
  }
  return ds(i, b, Re[256]), b + me[256];
}, dm = /* @__PURE__ */ new tc([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), ip = /* @__PURE__ */ new at(0), fm = function(o, i, a, c, d, p) {
  var y = p.z || o.length, k = new at(c + y + 5 * (1 + Math.ceil(y / 7e3)) + d), w = k.subarray(c, k.length - d), N = p.l, b = (p.r || 0) & 7;
  if (i) {
    b && (w[0] = p.r >> 3);
    for (var A = dm[i - 1], M = A >> 13, W = A & 8191, q = (1 << a) - 1, F = p.p || new an(32768), Y = p.h || new an(q + 1), je = Math.ceil(a / 3), Te = 2 * je, _e = function(ir) {
      return (o[ir] ^ o[ir + 1] << je ^ o[ir + 2] << Te) & q;
    }, Ee = new tc(25e3), Ae = new an(288), $e = new an(32), se = 0, ve = 0, ie = p.i || 0, Fe = 0, Oe = p.w || 0, O = 0; ie + 2 < y; ++ie) {
      var xe = _e(ie), Ie = ie & 32767, Be = Y[xe];
      if (F[Ie] = Be, Y[xe] = Ie, Oe <= ie) {
        var Re = y - ie;
        if ((se > 7e3 || Fe > 24576) && (Re > 423 || !N)) {
          b = bf(o, w, 0, Ee, Ae, $e, ve, Fe, O, ie - O, b), Fe = se = ve = 0, O = ie;
          for (var me = 0; me < 286; ++me)
            Ae[me] = 0;
          for (var me = 0; me < 30; ++me)
            $e[me] = 0;
        }
        var K = 2, ee = 0, X = W, C = Ie - Be & 32767;
        if (Re > 2 && xe == _e(ie - C))
          for (var L = Math.min(M, Re) - 1, ye = Math.min(32767, ie), ge = Math.min(258, Re); C <= ye && --X && Ie != Be; ) {
            if (o[ie + K] == o[ie + K - C]) {
              for (var de = 0; de < ge && o[ie + de] == o[ie + de - C]; ++de)
                ;
              if (de > K) {
                if (K = de, ee = C, de > L)
                  break;
                for (var Ce = Math.min(C, de - 2), Me = 0, me = 0; me < Ce; ++me) {
                  var be = ie - C + me & 32767, He = F[be], ut = be - He & 32767;
                  ut > Me && (Me = ut, Be = be);
                }
              }
            }
            Ie = Be, Be = F[Ie], C += Ie - Be & 32767;
          }
        if (ee) {
          Ee[Fe++] = 268435456 | Wu[K] << 18 | Ef[ee];
          var Qt = Wu[K] & 31, It = Ef[ee] & 31;
          ve += Ja[Qt] + Ga[It], ++Ae[257 + Qt], ++$e[It], Oe = ie + K, ++se;
        } else
          Ee[Fe++] = o[ie], ++Ae[o[ie]];
      }
    }
    for (ie = Math.max(ie, Oe); ie < y; ++ie)
      Ee[Fe++] = o[ie], ++Ae[o[ie]];
    b = bf(o, w, N, Ee, Ae, $e, ve, Fe, O, ie - O, b), N || (p.r = b & 7 | w[b / 8 | 0] << 3, b -= 7, p.h = Y, p.p = F, p.i = ie, p.w = Oe);
  } else {
    for (var ie = p.w || 0; ie < y + N; ie += 65535) {
      var $t = ie + 65535;
      $t >= y && (w[b / 8 | 0] = N, $t = y), b = op(w, b + 1, o.subarray(ie, $t));
    }
    p.i = y;
  }
  return gs(k, 0, c + nc(b) + d);
}, pm = /* @__PURE__ */ (function() {
  for (var o = new Int32Array(256), i = 0; i < 256; ++i) {
    for (var a = i, c = 9; --c; )
      a = (a & 1 && -306674912) ^ a >>> 1;
    o[i] = a;
  }
  return o;
})(), hm = function() {
  var o = -1;
  return {
    p: function(i) {
      for (var a = o, c = 0; c < i.length; ++c)
        a = pm[a & 255 ^ i[c]] ^ a >>> 8;
      o = a;
    },
    d: function() {
      return ~o;
    }
  };
}, mm = function(o, i, a, c, d) {
  if (!d && (d = { l: 1 }, i.dictionary)) {
    var p = i.dictionary.subarray(-32768), y = new at(p.length + o.length);
    y.set(p), y.set(o, p.length), o = y, d.w = p.length;
  }
  return fm(o, i.level == null ? 6 : i.level, i.mem == null ? d.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(o.length))) * 1.5) : 20 : 12 + i.mem, a, c, d);
}, sp = function(o, i) {
  var a = {};
  for (var c in o)
    a[c] = o[c];
  for (var c in i)
    a[c] = i[c];
  return a;
}, rr = function(o, i) {
  return o[i] | o[i + 1] << 8;
}, Mn = function(o, i) {
  return (o[i] | o[i + 1] << 8 | o[i + 2] << 16 | o[i + 3] << 24) >>> 0;
}, Ru = function(o, i) {
  return Mn(o, i) + Mn(o, i + 4) * 4294967296;
}, _t = function(o, i, a) {
  for (; a; ++i)
    o[i] = a, a >>>= 8;
};
function ym(o, i) {
  return mm(o, i || {}, 0, 0);
}
function vm(o, i) {
  return cm(o, { i: 2 }, i && i.out, i && i.dictionary);
}
var ap = function(o, i, a, c) {
  for (var d in o) {
    var p = o[d], y = i + d, k = c;
    Array.isArray(p) && (k = sp(c, p[1]), p = p[0]), p instanceof at ? a[y] = [p, k] : (a[y += "/"] = [new at(0), k], ap(p, y, a, c));
  }
}, Pf = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), Ku = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), gm = 0;
try {
  Ku.decode(ip, { stream: !0 }), gm = 1;
} catch {
}
var wm = function(o) {
  for (var i = "", a = 0; ; ) {
    var c = o[a++], d = (c > 127) + (c > 223) + (c > 239);
    if (a + d > o.length)
      return { s: i, r: gs(o, a - 1) };
    d ? d == 3 ? (c = ((c & 15) << 18 | (o[a++] & 63) << 12 | (o[a++] & 63) << 6 | o[a++] & 63) - 65536, i += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023)) : d & 1 ? i += String.fromCharCode((c & 31) << 6 | o[a++] & 63) : i += String.fromCharCode((c & 15) << 12 | (o[a++] & 63) << 6 | o[a++] & 63) : i += String.fromCharCode(c);
  }
};
function Zu(o, i) {
  var a;
  if (Pf)
    return Pf.encode(o);
  for (var c = o.length, d = new at(o.length + (o.length >> 1)), p = 0, y = function(N) {
    d[p++] = N;
  }, a = 0; a < c; ++a) {
    if (p + 5 > d.length) {
      var k = new at(p + 8 + (c - a << 1));
      k.set(d), d = k;
    }
    var w = o.charCodeAt(a);
    w < 128 || i ? y(w) : w < 2048 ? (y(192 | w >> 6), y(128 | w & 63)) : w > 55295 && w < 57344 ? (w = 65536 + (w & 1047552) | o.charCodeAt(++a) & 1023, y(240 | w >> 18), y(128 | w >> 12 & 63), y(128 | w >> 6 & 63), y(128 | w & 63)) : (y(224 | w >> 12), y(128 | w >> 6 & 63), y(128 | w & 63));
  }
  return gs(d, 0, p);
}
function lp(o, i) {
  if (i) {
    for (var a = "", c = 0; c < o.length; c += 16384)
      a += String.fromCharCode.apply(null, o.subarray(c, c + 16384));
    return a;
  } else {
    if (Ku)
      return Ku.decode(o);
    var d = wm(o), p = d.s, a = d.r;
    return a.length && Ot(8), p;
  }
}
var km = function(o, i) {
  return i + 30 + rr(o, i + 26) + rr(o, i + 28);
}, xm = function(o, i, a) {
  var c = rr(o, i + 28), d = lp(o.subarray(i + 46, i + 46 + c), !(rr(o, i + 8) & 2048)), p = i + 46 + c, y = Mn(o, i + 20), k = a && y == 4294967295 ? jm(o, p) : [y, Mn(o, i + 24), Mn(o, i + 42)], w = k[0], N = k[1], b = k[2];
  return [rr(o, i + 10), w, N, d, p + rr(o, i + 30) + rr(o, i + 32), b];
}, jm = function(o, i) {
  for (; rr(o, i) != 1; i += 4 + rr(o, i + 2))
    ;
  return [Ru(o, i + 12), Ru(o, i + 4), Ru(o, i + 20)];
}, Qu = function(o) {
  var i = 0;
  if (o)
    for (var a in o) {
      var c = o[a].length;
      c > 65535 && Ot(9), i += c + 4;
    }
  return i;
}, Af = function(o, i, a, c, d, p, y, k) {
  var w = c.length, N = a.extra, b = k && k.length, A = Qu(N);
  _t(o, i, y != null ? 33639248 : 67324752), i += 4, y != null && (o[i++] = 20, o[i++] = a.os), o[i] = 20, i += 2, o[i++] = a.flag << 1 | (p < 0 && 8), o[i++] = d && 8, o[i++] = a.compression & 255, o[i++] = a.compression >> 8;
  var M = new Date(a.mtime == null ? Date.now() : a.mtime), W = M.getFullYear() - 1980;
  if ((W < 0 || W > 119) && Ot(10), _t(o, i, W << 25 | M.getMonth() + 1 << 21 | M.getDate() << 16 | M.getHours() << 11 | M.getMinutes() << 5 | M.getSeconds() >> 1), i += 4, p != -1 && (_t(o, i, a.crc), _t(o, i + 4, p < 0 ? -p - 2 : p), _t(o, i + 8, a.size)), _t(o, i + 12, w), _t(o, i + 14, A), i += 16, y != null && (_t(o, i, b), _t(o, i + 6, a.attrs), _t(o, i + 10, y), i += 14), o.set(c, i), i += w, A)
    for (var q in N) {
      var F = N[q], Y = F.length;
      _t(o, i, +q), _t(o, i + 2, Y), o.set(F, i + 4), i += 4 + Y;
    }
  return b && (o.set(k, i), i += b), i;
}, Sm = function(o, i, a, c, d) {
  _t(o, i, 101010256), _t(o, i + 8, a), _t(o, i + 10, a), _t(o, i + 12, c), _t(o, i + 16, d);
};
function up(o, i) {
  i || (i = {});
  var a = {}, c = [];
  ap(o, "", a, i);
  var d = 0, p = 0;
  for (var y in a) {
    var k = a[y], w = k[0], N = k[1], b = N.level == 0 ? 0 : 8, A = Zu(y), M = A.length, W = N.comment, q = W && Zu(W), F = q && q.length, Y = Qu(N.extra);
    M > 65535 && Ot(11);
    var je = b ? ym(w, N) : w, Te = je.length, _e = hm();
    _e.p(w), c.push(sp(N, {
      size: w.length,
      crc: _e.d(),
      c: je,
      f: A,
      m: q,
      u: M != y.length || q && W.length != F,
      o: d,
      compression: b
    })), d += 30 + M + Y + Te, p += 76 + 2 * (M + Y) + (F || 0) + Te;
  }
  for (var Ee = new at(p + 22), Ae = d, $e = p - d, se = 0; se < c.length; ++se) {
    var A = c[se];
    Af(Ee, A.o, A, A.f, A.u, A.c.length);
    var ve = 30 + A.f.length + Qu(A.extra);
    Ee.set(A.c, A.o + ve), Af(Ee, d, A, A.f, A.u, A.c.length, A.o, A.m), d += 16 + ve + (A.m ? A.m.length : 0);
  }
  return Sm(Ee, d, c.length, $e, Ae), Ee;
}
function _m(o, i) {
  for (var a = {}, c = o.length - 22; Mn(o, c) != 101010256; --c)
    (!c || o.length - c > 65558) && Ot(13);
  var d = rr(o, c + 8);
  if (!d)
    return {};
  var p = Mn(o, c + 16), y = p == 4294967295 || d == 65535;
  if (y) {
    var k = Mn(o, c - 12);
    y = Mn(o, k) == 101075792, y && (d = Mn(o, k + 32), p = Mn(o, k + 48));
  }
  for (var w = 0; w < d; ++w) {
    var N = xm(o, p, y), b = N[0], A = N[1], M = N[2], W = N[3], q = N[4], F = N[5], Y = km(o, F);
    p = q, b ? b == 8 ? a[W] = vm(o.subarray(Y, Y + A), { out: new at(M) }) : Ot(14, "unknown compression type " + b) : a[W] = gs(o, Y, Y + A);
  }
  return a;
}
const Em = "omero-analysis", Ou = "omero-analysis-chat", Cm = 5, vs = [
  "projects",
  "chats",
  "files",
  "executions",
  "scripts",
  "workflows",
  "artifacts",
  "audits",
  "evidence"
];
function wn(o) {
  return new Promise((i, a) => {
    o.onsuccess = () => i(o.result), o.onerror = () => a(o.error);
  });
}
function eo(o) {
  return new Promise((i, a) => {
    o.oncomplete = () => i(), o.onerror = () => a(o.error), o.onabort = () => a(o.error || new Error("Storage transaction aborted"));
  });
}
function bm(o) {
  return new Promise((i, a) => {
    const c = indexedDB.open(o, Cm);
    c.onupgradeneeded = () => {
      const d = c.result;
      d.objectStoreNames.contains("values") || d.createObjectStore("values");
      for (const p of vs) {
        const y = d.objectStoreNames.contains(p) ? c.transaction.objectStore(p) : d.createObjectStore(p, { keyPath: "id" });
        p !== "projects" && !y.indexNames.contains("projectId") && y.createIndex("projectId", "projectId"), p === "projects" && !y.indexNames.contains("contextKey") && y.createIndex("contextKey", "contextKey", { unique: !0 }), (p === "files" || p === "executions" || p === "evidence") && !y.indexNames.contains("chatId") && y.createIndex("chatId", "chatId");
      }
    }, c.onsuccess = () => i(c.result), c.onerror = () => a(c.error);
  });
}
async function Pm(o) {
  return typeof indexedDB.databases == "function" && !(await indexedDB.databases()).some((a) => a.name === o) ? null : new Promise((i, a) => {
    let c = !1;
    const d = indexedDB.open(o);
    d.onupgradeneeded = () => {
      var p;
      c = !0, (p = d.transaction) == null || p.abort();
    }, d.onsuccess = () => i(c ? null : d.result), d.onerror = () => {
      var p;
      c && ((p = d.error) == null ? void 0 : p.name) === "AbortError" ? i(null) : a(d.error);
    };
  });
}
async function Am(o) {
  const i = `migration:${Ou}`, a = o.transaction("values", "readonly");
  if (await wn(a.objectStore("values").get(i))) return;
  const c = o.transaction("projects", "readonly");
  if (await wn(c.objectStore("projects").count()) > 0) return;
  const d = await Pm(Ou);
  if (d)
    try {
      for (const y of ["values", ...vs]) {
        if (!d.objectStoreNames.contains(y)) continue;
        const w = d.transaction(y, "readonly").objectStore(y), [N, b] = await Promise.all([
          wn(w.getAll()),
          wn(w.getAllKeys())
        ]), A = o.transaction(y, "readwrite"), M = A.objectStore(y);
        N.forEach((W, q) => {
          y === "values" ? M.put(W, b[q]) : M.put(W);
        }), await eo(A);
      }
      const p = o.transaction("values", "readwrite");
      p.objectStore("values").put(
        { completedAt: (/* @__PURE__ */ new Date()).toISOString(), source: Ou },
        i
      ), await eo(p);
    } finally {
      d.close();
    }
}
let If;
function kn() {
  return If ?? (If = bm(Em).then(async (o) => (await Am(o), o))), If;
}
async function cp(o) {
  const a = (await kn()).transaction("values", "readonly");
  return wn(a.objectStore("values").get(o));
}
async function dp(o, i) {
  const c = (await kn()).transaction("values", "readwrite");
  c.objectStore("values").put(i, o), await eo(c);
}
async function to(o, i) {
  const c = (await kn()).transaction(o, "readwrite");
  c.objectStore(o).put(i), await eo(c);
}
let $f = Promise.resolve();
function xn(o) {
  const i = $f.then(o, o);
  return $f = i.catch(() => {
  }), i;
}
async function Im(o, i) {
  const c = (await kn()).transaction(o, "readwrite");
  c.objectStore(o).delete(i), await eo(c);
}
async function At(o, i) {
  const c = (await kn()).transaction(o, "readonly");
  return wn(c.objectStore(o).index("projectId").getAll(i));
}
const Nf = (o) => xn(() => to("projects", o)), Mu = (o) => xn(() => to("chats", o)), gi = (o) => xn(() => to("files", o)), $m = (o) => xn(() => to("executions", o)), zo = (o) => xn(() => to("scripts", o)), La = (o) => xn(() => to("workflows", o)), Nm = (o) => xn(() => to("artifacts", o)), Tm = (o) => xn(() => to("audits", o)), Rm = (o, i) => xn(async () => {
  const c = (await kn()).transaction("evidence", "readwrite"), d = c.objectStore("evidence");
  (await wn(d.index("chatId").getAllKeys(o))).forEach((y) => d.delete(y)), i.forEach((y) => d.put(y)), await eo(c);
}), Om = (o) => xn(() => Im("files", o));
async function Mm(o) {
  await xn(async () => {
    const a = (await kn()).transaction([...vs], "readwrite");
    for (const c of vs) {
      const d = a.objectStore(c);
      if (c === "projects") {
        d.delete(o);
        continue;
      }
      (await wn(d.index("projectId").getAllKeys(o))).forEach((y) => d.delete(y));
    }
    await eo(a);
  });
}
async function fp(o) {
  return o ? `${o.user_id}:${o.group_id}:${o.object_type}:${o.object_id}` : "standalone";
}
function zm(o) {
  return o.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 64).toLowerCase() || "workspace";
}
function Lm(o) {
  return o ? `OMERO/${o.object_type}-${o.object_id}--${zm(o.name)}` : "OMERO/Local--workspace";
}
async function Zt(o) {
  const i = typeof o == "string" ? new TextEncoder().encode(o) : new Uint8Array(o), a = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(a), (c) => c.toString(16).padStart(2, "0")).join("");
}
function Za(o, i = "New analysis") {
  const a = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: crypto.randomUUID(),
    projectId: o,
    title: i,
    summary: "",
    archived: !1,
    messages: [],
    createdAt: a,
    updatedAt: a
  };
}
async function Fm(o) {
  const a = (await kn()).transaction("projects", "readonly");
  return wn(a.objectStore("projects").index("contextKey").get(o));
}
async function nr(o) {
  await xn(async () => {
    const a = (await kn()).transaction([...vs], "readwrite"), c = {
      ...o.project,
      revision: (o.project.revision || 0) + 1
    };
    a.objectStore("projects").put(c), o.chats.forEach((d) => a.objectStore("chats").put(d)), o.files.forEach((d) => a.objectStore("files").put(d)), o.executions.forEach((d) => a.objectStore("executions").put(d)), o.scripts.forEach((d) => a.objectStore("scripts").put(d)), o.workflows.forEach((d) => a.objectStore("workflows").put(d)), o.artifacts.forEach((d) => a.objectStore("artifacts").put(d)), o.audits.forEach((d) => a.objectStore("audits").put(d)), o.evidence.forEach((d) => a.objectStore("evidence").put(d)), await eo(a);
  });
}
async function Dm(o, i, a) {
  const c = await cp(`workspace:${a}`);
  if (!c) return null;
  const d = (/* @__PURE__ */ new Date()).toISOString();
  i.title = "Imported chat", i.messages = (c.messages || []).map((k) => ({
    id: String(k.id || crypto.randomUUID()),
    role: k.role === "user" ? "user" : "assistant",
    content: String(k.content || k.code || ""),
    kind: k.kind === "error" ? "error" : "text",
    createdAt: d
  })), i.updatedAt = d;
  const p = [];
  for (const k of c.files || []) {
    const w = k.data instanceof ArrayBuffer ? k.data : void 0;
    p.push({
      id: String(k.id || crypto.randomUUID()),
      projectId: o.id,
      chatId: k.source === "result" ? i.id : void 0,
      name: String(k.name || "file"),
      logicalPath: k.source === "result" ? `${o.rootPath}/chats/${i.id}/outputs/${String(k.name || "file")}` : `${o.rootPath}/inputs/${String(k.name || "file")}`,
      type: String(k.type || "application/octet-stream"),
      size: Number(k.size || (w == null ? void 0 : w.byteLength) || 0),
      sha256: w ? await Zt(w) : "",
      source: k.source === "result" ? "result" : k.source === "omero" ? "omero" : "local",
      state: k.state === "failed" ? "failed" : w ? "ready" : "missing",
      data: w,
      error: k.error,
      annotationId: k.annotationId,
      createdAt: d
    });
  }
  const y = {
    project: o,
    chats: [i],
    files: p,
    executions: [],
    scripts: [],
    workflows: [],
    artifacts: [],
    audits: [],
    evidence: []
  };
  return await nr(y), await dp(`migration:v2:${a}`, { completedAt: d }), y;
}
async function Um(o) {
  const i = await fp(o);
  let a = await Fm(i);
  if (!a) {
    const A = (/* @__PURE__ */ new Date()).toISOString(), M = Za(crypto.randomUUID());
    a = {
      id: M.projectId,
      contextKey: i,
      rootPath: Lm(o),
      name: (o == null ? void 0 : o.name) || "Local workspace",
      objectType: o == null ? void 0 : o.object_type,
      objectId: o == null ? void 0 : o.object_id,
      userId: (o == null ? void 0 : o.user_id) || 0,
      groupId: (o == null ? void 0 : o.group_id) || 0,
      activeChatId: M.id,
      plotCsv: !0,
      createdAt: A,
      updatedAt: A
    };
    const W = await Dm(a, M, i);
    if (W) return W;
    const q = {
      project: a,
      chats: [M],
      files: [],
      executions: [],
      scripts: [],
      workflows: [],
      artifacts: [],
      audits: [],
      evidence: []
    };
    return await nr(q), q;
  }
  const [c, d, p, y, k, w, N, b] = await Promise.all([
    At("chats", a.id),
    At("files", a.id),
    At("executions", a.id),
    At("scripts", a.id),
    At("workflows", a.id),
    At("artifacts", a.id),
    At("audits", a.id),
    At("evidence", a.id)
  ]);
  if (!c.length) {
    const A = Za(a.id);
    a = { ...a, activeChatId: A.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }, await nr({
      project: a,
      chats: [A],
      files: d,
      executions: p,
      scripts: y,
      workflows: k,
      artifacts: w,
      audits: N,
      evidence: b
    }), c.push(A);
  }
  return { project: a, chats: c, files: d, executions: p, scripts: y, workflows: k, artifacts: w, audits: N, evidence: b };
}
async function _r(o) {
  const i = await fp(o), c = (await kn()).transaction("projects", "readonly");
  return (await wn(c.objectStore("projects").getAll())).filter((p) => p.contextKey === i || p.contextKey.startsWith(`${i}:import:`)).sort((p, y) => y.updatedAt.localeCompare(p.updatedAt));
}
async function wi(o) {
  if (!o) return _r(null);
  const a = (await kn()).transaction("projects", "readonly");
  return (await wn(a.objectStore("projects").getAll())).filter(
    (d) => d.userId === o.user_id && d.groupId === o.group_id
  ).sort((d, p) => `${d.objectType || ""}:${d.objectId || 0}`.localeCompare(
    `${p.objectType || ""}:${p.objectId || 0}`
  ) || p.updatedAt.localeCompare(d.updatedAt));
}
async function ps(o) {
  const a = (await kn()).transaction("projects", "readonly"), c = await wn(a.objectStore("projects").get(o));
  if (!c) return;
  const [d, p, y, k, w, N, b, A] = await Promise.all([
    At("chats", c.id),
    At("files", c.id),
    At("executions", c.id),
    At("scripts", c.id),
    At("workflows", c.id),
    At("artifacts", c.id),
    At("audits", c.id),
    At("evidence", c.id)
  ]);
  return { project: c, chats: d, files: p, executions: y, scripts: k, workflows: w, artifacts: N, audits: b, evidence: A };
}
async function Fa() {
  var i, a;
  const o = await ((a = (i = navigator.storage) == null ? void 0 : i.estimate) == null ? void 0 : a.call(i));
  return { usage: (o == null ? void 0 : o.usage) || 0, quota: (o == null ? void 0 : o.quota) || 0 };
}
const Tf = "provider:AmsterdamUMC", Rf = {
  apiKey: "",
  model: "",
  contextWindow: 0,
  rememberKey: !1
}, pp = "nl.bioimaging.analysis.project.v1", hp = 1, Bm = /* @__PURE__ */ new Map([
  ["nl.bioimaging.analysis-chat.project", /* @__PURE__ */ new Set([1])],
  ["nl.bioimaging.analysis-chat.project.v2", /* @__PURE__ */ new Set([2, 3])]
]), mp = 1e4, yp = 512 * 1024 * 1024;
function er(o) {
  return o.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}
function hs(o) {
  return new Uint8Array(Zu(o));
}
function Vm(o) {
  return { ...o };
}
function Of(o, i) {
  const a = {}, c = [], d = o.files.filter((w) => !w.deletedAt).map((w) => {
    const N = { ...w };
    delete N.data;
    const b = w.source === "omero";
    if (w.source === "local" && i)
      return c.push(w.name), N.state = "missing", N.error = "Local input was omitted because the project snapshot exceeded its size limit.", N;
    if (b || !w.data) return N;
    const M = w.source === "local" ? `inputs/local/${er(w.id)}--${er(w.name)}` : `chats/${er(w.chatId || "unassigned")}/outputs/${er(w.id)}--${er(w.name)}`;
    return N.archivePath = M, a[M] = new Uint8Array(w.data), N;
  }), p = {
    format: pp,
    version: hp,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    project: Vm(o.project),
    chats: o.chats,
    executions: o.executions,
    scripts: o.scripts,
    workflows: o.workflows,
    artifacts: o.artifacts,
    audits: o.audits.map((w) => ({ ...w, payload: "[omitted from snapshot]" })),
    evidence: o.evidence,
    files: d,
    omittedLocalInputs: c
  };
  a["project.json"] = hs(JSON.stringify(p, null, 2));
  for (const w of o.chats)
    a[`chats/${er(w.id)}/chat.json`] = hs(JSON.stringify(w, null, 2)), a[`chats/${er(w.id)}/chat.md`] = hs(Hm(w));
  for (const w of o.scripts) {
    a[`scripts/${er(w.id)}/script.json`] = hs(JSON.stringify(w, null, 2));
    for (const N of w.versions)
      a[`scripts/${er(w.id)}/v${String(N.version).padStart(3, "0")}.py`] = hs(N.code);
  }
  const y = up(a, { level: 0 }), k = `${er(o.project.rootPath.split("/").at(-1) || "analysis-project")}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.oa.zip`;
  return { data: y, filename: k, omittedLocalInputs: c, manifest: p };
}
function Wm(o, i) {
  const a = Of(o, !1);
  if (a.data.byteLength <= i) return a;
  const c = Of(o, !0);
  if (c.data.byteLength > i)
    throw new Error(
      `Chats, scripts, and generated outputs require ${(c.data.byteLength / 1024 / 1024).toFixed(1)} MiB, exceeding the ${(i / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  return c;
}
function Hm(o) {
  const i = [`# ${o.title}`, "", `Updated: ${o.updatedAt}`, ""];
  o.summary && i.push("## Conversation summary", "", o.summary, "");
  for (const a of o.messages)
    a.kind !== "execution" && i.push(`## ${a.role === "user" ? "User" : "Assistant"}`, "", a.content, "");
  return i.join(`
`);
}
function Ju(o) {
  if (!o || o.startsWith("/") || o.startsWith("\\") || o.split(/[\\/]/).includes(".."))
    throw new Error(`Unsafe project archive path: ${o}`);
}
function qm(o) {
  let i = -1;
  for (let w = Math.max(0, o.length - 65557); w <= o.length - 22; w += 1)
    o[w] === 80 && o[w + 1] === 75 && o[w + 2] === 5 && o[w + 3] === 6 && (i = w);
  if (i < 0) throw new Error("Project archive has no valid ZIP directory");
  const a = new DataView(o.buffer, o.byteOffset, o.byteLength), c = a.getUint16(i + 10, !0), d = a.getUint32(i + 12, !0), p = a.getUint32(i + 16, !0);
  if (c > mp) throw new Error("Project archive contains too many entries");
  if (p + d > o.length) throw new Error("Project archive directory is truncated");
  let y = p, k = 0;
  for (let w = 0; w < c; w += 1) {
    if (a.getUint32(y, !0) !== 33639248)
      throw new Error("Project archive contains an invalid directory entry");
    const N = a.getUint32(y + 24, !0), b = a.getUint16(y + 28, !0), A = a.getUint16(y + 30, !0), M = a.getUint16(y + 32, !0);
    if (N === 4294967295) throw new Error("ZIP64 project archives are not supported");
    if (k += N, k > yp)
      throw new Error("Project archive exceeds the 512 MiB workspace limit");
    const W = y + 46, q = new TextDecoder().decode(o.subarray(W, W + b));
    if (Ju(q), y = W + b + A + M, y > p + d) throw new Error("Project archive directory is malformed");
  }
}
function Km(o) {
  if (!o || typeof o != "object") throw new Error("Project manifest must be an object");
  const i = o, a = i.format === pp && i.version === hp, c = typeof i.format == "string" ? Bm.get(i.format) : void 0;
  if (!(typeof i.version == "number" && (c == null ? void 0 : c.has(i.version))) && !a) throw new Error("Unsupported OMERO Analysis project format");
  const p = o;
  if (!p.project || !Array.isArray(p.chats) || !Array.isArray(p.files))
    throw new Error("Project manifest is missing required project, chat, or file records");
  return {
    ...p,
    workflows: Array.isArray(p.workflows) ? p.workflows : [],
    artifacts: Array.isArray(p.artifacts) ? p.artifacts : [],
    audits: Array.isArray(p.audits) ? p.audits : [],
    evidence: Array.isArray(p.evidence) ? p.evidence : [],
    executions: Array.isArray(p.executions) ? p.executions : [],
    scripts: Array.isArray(p.scripts) ? p.scripts : [],
    omittedLocalInputs: Array.isArray(p.omittedLocalInputs) ? p.omittedLocalInputs : []
  };
}
function Gu(o) {
  return !o || typeof o != "object" ? !1 : Array.isArray(o) ? o.some(Gu) : Object.entries(o).some(([i, a]) => {
    const c = i.toLowerCase().replace(/[^a-z0-9]/g, "");
    return c === "apikey" || c === "azurekey" || c === "credential" || Gu(a);
  });
}
async function zu(o, i = null) {
  var Fe, Oe;
  const a = new Uint8Array(o);
  qm(a);
  const c = _m(a), d = Object.keys(c);
  if (d.length > mp) throw new Error("Project archive contains too many entries");
  let p = 0;
  for (const O of d)
    if (Ju(O), p += c[O].byteLength, p > yp) throw new Error("Project archive exceeds the 512 MiB workspace limit");
  const y = c["project.json"];
  if (!y) throw new Error("Project archive does not contain project.json");
  const k = Km(JSON.parse(lp(y)));
  if (Gu(k))
    throw new Error("Project archive unexpectedly contains an API key field");
  const w = crypto.randomUUID(), N = new Map(k.chats.map((O) => [O.id, crypto.randomUUID()])), b = new Map(k.executions.map((O) => [O.id, crypto.randomUUID()])), A = new Map(k.evidence.map((O) => [O.id, crypto.randomUUID()])), M = new Map(k.files.map((O) => [O.id, crypto.randomUUID()])), W = new Map(
    k.artifacts.map((O) => [O.id, crypto.randomUUID()])
  ), q = new Map(k.scripts.map((O) => [O.id, crypto.randomUUID()])), F = new Map(k.workflows.map((O) => [O.id, crypto.randomUUID()])), Y = (/* @__PURE__ */ new Date()).toISOString(), je = k.chats.map((O) => ({
    ...O,
    id: N.get(O.id),
    projectId: w,
    title: `${O.title} (imported)`,
    messages: O.messages.map((xe) => {
      var Ie;
      return {
        ...xe,
        executionId: xe.executionId ? b.get(xe.executionId) : void 0,
        artifactId: xe.artifactId ? W.get(xe.artifactId) : void 0,
        citationIds: (Ie = xe.citationIds) == null ? void 0 : Ie.map((Be) => b.get(Be)).filter(Boolean)
      };
    }),
    updatedAt: Y
  })), Te = [];
  for (const O of k.files) {
    let xe;
    if (O.archivePath) {
      Ju(O.archivePath);
      const Ie = c[O.archivePath];
      if (!Ie) throw new Error(`Missing archived file: ${O.archivePath}`);
      if (xe = Ie.buffer.slice(Ie.byteOffset, Ie.byteOffset + Ie.byteLength), O.sha256 && await Zt(xe) !== O.sha256)
        throw new Error(`Hash mismatch for ${O.name}`);
    }
    Te.push({
      ...O,
      id: M.get(O.id),
      projectId: w,
      chatId: O.chatId ? N.get(O.chatId) : void 0,
      executionId: O.executionId ? b.get(O.executionId) : void 0,
      data: xe,
      viewer: O.viewer ? {
        ...O.viewer,
        viewerUrl: "",
        evidenceIds: (Fe = O.viewer.evidenceIds) == null ? void 0 : Fe.map((Ie) => A.get(Ie)).filter(Boolean)
      } : void 0,
      state: xe || O.source === "omero" ? O.state : "missing",
      logicalPath: O.logicalPath.replace(k.project.rootPath, `${k.project.rootPath}--imported`)
    });
  }
  const _e = k.executions.map((O) => ({
    ...O,
    id: b.get(O.id),
    projectId: w,
    chatId: N.get(O.chatId),
    outputFileIds: O.outputFileIds.map((xe) => M.get(xe)).filter(Boolean),
    reusedFrom: O.reusedFrom ? b.get(O.reusedFrom) : void 0,
    evidenceId: O.evidenceId ? A.get(O.evidenceId) : void 0
  })), Ee = k.scripts.map((O) => ({
    ...O,
    id: q.get(O.id),
    projectId: w,
    versions: O.versions.map((xe) => ({
      ...xe,
      executionId: b.get(xe.executionId) || ""
    })),
    updatedAt: Y
  })), Ae = k.workflows.map((O) => ({
    ...O,
    id: F.get(O.id),
    projectId: w,
    steps: O.steps.map((xe) => ({
      ...xe,
      id: crypto.randomUUID(),
      scriptId: q.get(xe.scriptId) || xe.scriptId
    })),
    updatedAt: Y
  })), $e = k.artifacts.map((O) => {
    var xe, Ie;
    return {
      ...O,
      id: W.get(O.id),
      projectId: w,
      chatId: N.get(O.chatId) || ((xe = je[0]) == null ? void 0 : xe.id),
      executionId: O.executionId ? b.get(O.executionId) : void 0,
      fileId: O.fileId ? M.get(O.fileId) : void 0,
      viewer: O.viewer ? {
        ...O.viewer,
        viewerUrl: "",
        evidenceIds: (Ie = O.viewer.evidenceIds) == null ? void 0 : Ie.map((Be) => A.get(Be)).filter(Boolean)
      } : void 0
    };
  }).filter((O) => !!O.chatId), se = N.get(k.project.activeChatId) || ((Oe = je[0]) == null ? void 0 : Oe.id);
  if (!se) throw new Error("Project archive contains no chats");
  const ve = {
    ...k.project,
    id: w,
    contextKey: i ? `${i.user_id}:${i.group_id}:${i.object_type}:${i.object_id}:import:${w}` : `${k.project.contextKey}:import:${w}`,
    rootPath: `${k.project.rootPath}--imported`,
    name: `${k.project.name} (imported)`,
    objectType: (i == null ? void 0 : i.object_type) || k.project.objectType,
    objectId: (i == null ? void 0 : i.object_id) || k.project.objectId,
    userId: (i == null ? void 0 : i.user_id) ?? k.project.userId,
    groupId: (i == null ? void 0 : i.group_id) ?? k.project.groupId,
    origin: {
      contextKey: k.project.contextKey,
      userId: k.project.userId,
      groupId: k.project.groupId,
      snapshotAnnotationId: k.project.sourceSnapshotAnnotationId
    },
    zarrBindings: Object.fromEntries(
      Object.entries(k.project.zarrBindings || {}).map(([O, xe]) => [
        O,
        { ...xe, verified: !1 }
      ])
    ),
    activeChatId: se,
    createdAt: Y,
    updatedAt: Y
  }, ie = k.evidence.map((O) => ({
    ...O,
    id: A.get(O.id),
    projectId: w,
    chatId: N.get(O.chatId) || se,
    promptId: O.promptId,
    executionId: O.executionId ? b.get(O.executionId) : void 0
  }));
  return { project: ve, chats: je, files: Te, executions: _e, scripts: Ee, workflows: Ae, artifacts: $e, audits: [], evidence: ie };
}
const Zm = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "duckdb"
], Ha = "pyodide-314.0.3-oa-0.6";
function Qm(o) {
  const i = JSON.stringify(o.replace(/\/$/, "")), a = JSON.stringify(Zm);
  return `
const runtimeBase = ${i};
const send = (id, type, value, transfer = []) => postMessage({source:"oa-runtime", id, type, value}, transfer);
const runtimeFetch = globalThis.fetch.bind(globalThis);
const denyNetwork = () => Promise.reject(new Error("Network access is disabled in Analysis Python"));
const loadedPackages = new Set(${a});
const progress = (percent, message) => postMessage({
  source: "oa-runtime",
  type: "progress",
  value: {percent, message}
});
let pyodide;
const inputSecrets = new Set();
const mime = (name) => name.endsWith(".png") ? "image/png" : name.endsWith(".svg") ? "image/svg+xml" :
  name.endsWith(".csv") ? "text/csv" : name.endsWith(".json") ? "application/json" :
  name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
async function boot() {
  progress(12, "Loading the browser Python engine…");
  const module = await import(runtimeBase + "/pyodide.mjs");
  progress(28, "Starting the isolated Python runtime…");
  pyodide = await module.loadPyodide({indexURL: runtimeBase + "/"});
  progress(48, "Loading data-analysis packages…");
  await pyodide.loadPackage(${a});
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
  // Package assets are loaded. Generated Python must not use the browser as a
  // network client, even to the public plugin origin.
  globalThis.fetch = denyNetwork;
  globalThis.XMLHttpRequest = class { constructor() { throw new Error("Network access is disabled"); } };
  globalThis.WebSocket = class { constructor() { throw new Error("Network access is disabled"); } };
  globalThis.EventSource = class { constructor() { throw new Error("Network access is disabled"); } };
}
async function ensurePackages(code) {
  const required = [];
  if (/\\b(import|from)\\s+scipy\\b/.test(code)) required.push("scipy");
  if (/\\b(import|from)\\s+pyarrow\\b|read_parquet|to_parquet/.test(code)) required.push("pyarrow");
  if (/read_excel|engine\\s*=\\s*["']calamine|python_calamine/.test(code)) required.push("python-calamine");
  if (/read_excel|\\.xls\\b/.test(code)) required.push("xlrd");
  const missing = required.filter((name) => !loadedPackages.has(name));
  if (!missing.length) return;
  progress(55, "Loading required package" + (missing.length === 1 ? "" : "s") + ": " + missing.join(", "));
  globalThis.fetch = runtimeFetch;
  try {
    await pyodide.loadPackage(missing);
    missing.forEach((name) => loadedPackages.add(name));
  } finally {
    globalThis.fetch = denyNetwork;
  }
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
function modelPayload(preview, stderr, files) {
  const clean = (value, depth = 0) => {
    if (depth > 5 || value == null || typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") return value.length > 256 ? value.slice(0, 256) + "…" : value;
    if (Array.isArray(value)) return value.slice(0, 100).map((item) => clean(item, depth + 1));
    if (typeof value === "object") {
      const result = {};
      for (const [key, child] of Object.entries(value).slice(0, 100)) {
        result[String(key).slice(0, 128)] = clean(child, depth + 1);
      }
      return result;
    }
    return String(value).slice(0, 256);
  };
  let safePreview = clean(preview);
  let serialized = JSON.stringify(safePreview);
  for (const secret of inputSecrets) {
    if (secret.length >= 16 && serialized.includes(secret)) {
      safePreview = {kind: "withheld", reason: "Result matched complete source-file content"};
      serialized = JSON.stringify(safePreview);
      break;
    }
  }
  let truncated = false;
  if (serialized.length > 48 * 1024) {
    safePreview = {kind: "truncated", preview: serialized.slice(0, 48 * 1024)};
    truncated = true;
  }
  return {
    stderr: String(stderr || "").slice(0, 8192),
    preview: safePreview,
    generatedFiles: files.map((file) => ({
      name: file.name,
      size: file.data.byteLength,
      type: file.type
    })),
    truncated
  };
}
const previewCode = \`
import json as _oa_json, math as _oa_math
def _oa_clean(value):
    if value is None or isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        return value if _oa_math.isfinite(value) else str(value)
    if hasattr(value, "head") and hasattr(value, "to_dict"):
        frame = value.head(100)
        if hasattr(frame, "iloc"):
            frame = frame.iloc[:, :50]
        return {"kind": "table", "data": frame.to_dict(orient="split")}
    if isinstance(value, dict):
        return {str(k): _oa_clean(v) for k, v in list(value.items())[:100]}
    if isinstance(value, (list, tuple)):
        return [_oa_clean(v) for v in value[:100]]
    if hasattr(value, "item"):
        try: return _oa_clean(value.item())
        except Exception: pass
    return str(value)
_oa_json.dumps(_oa_clean(globals().get("result")), ensure_ascii=False)
\`;
addEventListener("message", async (event) => {
  const message = event.data;
  if (!message || message.source !== "oa-parent") return;
  try {
    await ready;
    if (message.type === "ping") {
      send(message.id, "ready", true);
    } else if (message.type === "begin") {
      removeTree("/output");
      await pyodide.runPythonAsync(\`
for _oa_name in list(globals()):
    if not _oa_name.startswith("__"):
        globals().pop(_oa_name, None)
\`);
      send(message.id, "begin", true);
    } else if (message.type === "clear_inputs") {
      removeTree("/input");
      inputSecrets.clear();
      send(message.id, "clear_inputs", true);
    } else if (message.type === "file") {
      const safe = String(message.value.name).replace(/[^A-Za-z0-9._ -]/g, "_");
      const bytes = new Uint8Array(message.value.data);
      pyodide.FS.writeFile("/input/" + safe, bytes);
      if (bytes.length <= 1024 * 1024) {
        try {
          const text = new TextDecoder("utf-8", {fatal: true}).decode(bytes).trim();
          if (text.length >= 16) inputSecrets.add(text);
        } catch {}
        if (bytes.length <= 64 * 1024) {
          let binary = "";
          for (const byte of bytes) binary += String.fromCharCode(byte);
          inputSecrets.add(btoa(binary));
        }
      }
      send(message.id, "file", safe);
    } else if (message.type === "profile") {
      const profileNames = pyodide.FS.readdir("/input").join(" ");
      await ensurePackages(
        profileNames +
        (/\\.parquet\\b/i.test(profileNames) ? " read_parquet" : "") +
        (/\\.xlsx?\\b/i.test(profileNames) ? " read_excel calamine" : "")
      );
      const raw = await pyodide.runPythonAsync(\`
import json as _json
from pathlib import Path as _Path
_profiles = []
for _path in sorted(_Path("/input").iterdir()):
    _entry = {"path": str(_path), "format": _path.suffix.lower().lstrip("."), "size": _path.stat().st_size, "summary": {}}
    try:
        _suffix = _path.suffix.lower()
        if _suffix in {".duckdb", ".sqlite", ".sqlite3"}:
            if _suffix == ".duckdb":
                import duckdb as _db
                _con = _db.connect(str(_path), read_only=True)
                _tables = [r[0] for r in _con.execute("SHOW TABLES").fetchall()]
                _entry["summary"] = {"tables": [{"name": t, "columns": [{"name": r[0], "type": r[1]} for r in _con.execute(f'DESCRIBE SELECT * FROM "{t.replace(chr(34), chr(34)*2)}"').fetchall()]} for t in _tables[:100]]}
                _con.close()
            else:
                import sqlite3 as _sqlite
                _con = _sqlite.connect(f"file:{_path}?mode=ro", uri=True)
                _tables = [r[0] for r in _con.execute("SELECT name FROM sqlite_master WHERE type IN ('table','view') ORDER BY name").fetchall()]
                _entry["summary"] = {"tables": [{"name": t, "columns": [{"name": r[1], "type": r[2]} for r in _con.execute(f'PRAGMA table_info("{t.replace(chr(34), chr(34)*2)}")'.replace("''", "'")).fetchall()]} for t in _tables[:100]]}
                _con.close()
        elif _suffix in {".csv", ".tsv", ".parquet", ".xls", ".xlsx", ".json"}:
            import pandas as _pd
            if _suffix == ".parquet": _frame = _pd.read_parquet(_path)
            elif _suffix in {".xls", ".xlsx"}: _frame = _pd.read_excel(_path, engine="calamine")
            elif _suffix == ".json": _frame = _pd.read_json(_path)
            else: _frame = _pd.read_csv(_path, sep="\\t" if _suffix == ".tsv" else ",")
            _entry["summary"] = {
                "rows": int(len(_frame)),
                "columns": [{"name": str(c), "type": str(_frame[c].dtype), "nulls": int(_frame[c].isna().sum()), "distinct": int(_frame[c].nunique(dropna=True))} for c in list(_frame.columns)[:100]]
            }
        elif _suffix in {".npy", ".npz"}:
            import numpy as _np
            _value = _np.load(_path, allow_pickle=False)
            if hasattr(_value, "files"):
                _entry["summary"] = {"arrays": [{"name": n, "shape": list(_value[n].shape), "dtype": str(_value[n].dtype)} for n in _value.files[:100]]}
            else: _entry["summary"] = {"shape": list(_value.shape), "dtype": str(_value.dtype)}
    except Exception as _error:
        _entry["error"] = str(_error)[:1000]
    _profiles.append(_entry)
_json.dumps(_profiles, ensure_ascii=False)
\`);
      send(message.id, "profile", JSON.parse(raw));
    } else if (message.type === "run") {
      await ensurePackages(String(message.value.code || ""));
      const before = outputState();
      let stdout = "", stderr = "";
      pyodide.setStdout({batched: (text) => { stdout += text + "\\n"; }});
      pyodide.setStderr({batched: (text) => { stderr += text + "\\n"; }});
      await pyodide.runPythonAsync(message.value.code);
      const raw = await pyodide.runPythonAsync(previewCode);
      const files = outputFiles(before);
      const safePayload = modelPayload(JSON.parse(raw), stderr, files);
      const transfers = files.map((file) => file.data);
      send(message.id, "result", {stdout, stderr, preview: JSON.parse(raw), modelPayload: safePayload, files}, transfers);
    }
  } catch (error) {
    send(message.id, "error", String(error && error.stack || error));
  }
});
`;
}
function Jm(o) {
  return new URL("../runtime-sandbox/", o).toString();
}
class Gm {
  constructor(i) {
    Xn(this, "frame", null);
    Xn(this, "pending", /* @__PURE__ */ new Map());
    Xn(this, "inputs", []);
    Xn(this, "counter", 0);
    Xn(this, "readyPromise", null);
    Xn(this, "onProgress", null);
    Xn(this, "receive", (i) => {
      var d;
      if (i.source !== ((d = this.frame) == null ? void 0 : d.contentWindow)) return;
      const a = i.data;
      if (!a || a.source !== "oa-runtime") return;
      if (a.type === "progress") {
        this.report(a.value);
        return;
      }
      const c = this.pending.get(a.id);
      c && (clearTimeout(c.timer), this.pending.delete(a.id), a.type === "error" ? c.reject(new Error(a.value)) : c.resolve(a.value));
    });
    this.runtimeBase = i, window.addEventListener("message", this.receive);
  }
  async start(i, a) {
    a && (this.onProgress = a), this.inputs = i.filter((y) => y.state === "ready" && y.data), this.destroyFrame(), this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const c = document.createElement("iframe");
    c.hidden = !0, c.setAttribute("sandbox", "allow-scripts"), c.setAttribute("aria-hidden", "true");
    const d = new Promise(
      (y) => c.addEventListener("load", () => y(), { once: !0 })
    ), p = new URL(this.runtimeBase, window.location.href).toString();
    return c.src = Jm(p), document.body.append(c), this.frame = c, this.readyPromise = (async () => {
      var y;
      await d, this.report({ percent: 8, message: "Connecting to the Python worker…" }), (y = c.contentWindow) == null || y.postMessage(
        { source: "oa-bootstrap", value: Qm(p) },
        "*"
      ), await this.request("ping", !0, 12e4);
      for (let k = 0; k < this.inputs.length; k += 1) {
        const w = this.inputs[k];
        this.report({
          percent: 92 + Math.round(k / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${k + 1} of ${this.inputs.length} data files into Python…`
        });
        const N = w.data.slice(0);
        await this.request("file", { name: w.name, data: N }, 3e4, [N]);
      }
      this.report({ percent: 100, message: "Browser Python is ready" });
    })(), this.readyPromise;
  }
  async run(i) {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("run", { code: i }, 12e4);
  }
  async syncInputs(i) {
    if (this.inputs = i.filter((a) => a.state === "ready" && a.data), !this.readyPromise) {
      await this.start(this.inputs, this.onProgress || void 0);
      return;
    }
    await this.readyPromise, await this.request("clear_inputs", !0, 3e4);
    for (let a = 0; a < this.inputs.length; a += 1) {
      const c = this.inputs[a];
      this.report({
        percent: 92 + Math.round(a / Math.max(1, this.inputs.length) * 7),
        message: `Synchronizing ${a + 1} of ${this.inputs.length} input files…`
      });
      const d = c.data.slice(0);
      await this.request("file", { name: c.name, data: d }, 3e4, [d]);
    }
    this.report({ percent: 100, message: "Browser Python is ready" });
  }
  async profileInputs() {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("profile", !0, 12e4);
  }
  async beginTurn() {
    this.readyPromise || await this.start(this.inputs), await this.readyPromise, await this.request("begin", !0, 3e4);
  }
  async reset() {
    return this.start(this.inputs, this.onProgress || void 0);
  }
  stop() {
    for (const i of this.pending.values())
      clearTimeout(i.timer), i.reject(new Error("Python execution stopped"));
    this.pending.clear(), this.destroyFrame();
  }
  dispose() {
    this.stop(), this.destroyFrame(), window.removeEventListener("message", this.receive);
  }
  destroyFrame() {
    var i;
    (i = this.frame) == null || i.remove(), this.frame = null, this.readyPromise = null;
  }
  request(i, a, c, d = []) {
    const p = `runtime-${++this.counter}`;
    return new Promise((y, k) => {
      var N, b;
      const w = window.setTimeout(() => {
        this.pending.delete(p), k(new Error(`${i} exceeded ${c / 1e3} seconds`)), i === "run" && this.start(this.inputs);
      }, c);
      this.pending.set(p, { resolve: y, reject: k, timer: w }), (b = (N = this.frame) == null ? void 0 : N.contentWindow) == null || b.postMessage(
        { source: "oa-parent", id: p, type: i, value: a },
        "*",
        d
      );
    });
  }
  report(i) {
    var a;
    (a = this.onProgress) == null || a.call(this, {
      percent: Math.max(0, Math.min(100, Number(i.percent) || 0)),
      message: String(i.message || "Preparing browser Python…")
    });
  }
}
function Xm() {
  const [o, i] = pe.useState(null), [a, c] = pe.useState(""), d = pe.useRef(null), p = (b) => {
    var A;
    (A = d.current) == null || A.call(d, b), d.current = null, i(null);
  }, y = (b, A = "", M) => new Promise((W) => {
    d.current = W, c(A), i({ title: b, description: M, value: A, confirmLabel: "Save", mode: "text" });
  }), k = (b, A, M = "Continue", W = !1) => new Promise((q) => {
    d.current = q, i({ title: b, description: A, confirmLabel: M, danger: W, mode: "confirm" });
  }), w = (b, A, M) => new Promise((W) => {
    var q;
    d.current = W, c(((q = A[0]) == null ? void 0 : q.value) || ""), i({
      title: b,
      description: M,
      choices: A,
      confirmLabel: "Use selected object",
      mode: "choose"
    });
  }), N = o ? /* @__PURE__ */ f.jsx(
    "div",
    {
      className: "dialog-backdrop",
      role: "presentation",
      onMouseDown: (b) => {
        b.target === b.currentTarget && p(o.mode === "confirm" ? !1 : null);
      },
      children: /* @__PURE__ */ f.jsxs(
        "form",
        {
          className: "app-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "app-dialog-title",
          onSubmit: (b) => {
            b.preventDefault(), p(
              o.mode === "text" ? a.trim() || null : o.mode === "choose" ? a || null : !0
            );
          },
          children: [
            /* @__PURE__ */ f.jsx("h2", { id: "app-dialog-title", children: o.title }),
            o.description && /* @__PURE__ */ f.jsx("p", { children: o.description }),
            o.mode === "text" && /* @__PURE__ */ f.jsxs("label", { children: [
              /* @__PURE__ */ f.jsx("span", { children: "Name" }),
              /* @__PURE__ */ f.jsx(
                "input",
                {
                  autoFocus: !0,
                  value: a,
                  maxLength: 180,
                  onChange: (b) => c(b.target.value)
                }
              )
            ] }),
            o.mode === "choose" && /* @__PURE__ */ f.jsxs("label", { children: [
              /* @__PURE__ */ f.jsx("span", { children: "OMERO object" }),
              /* @__PURE__ */ f.jsx(
                "select",
                {
                  autoFocus: !0,
                  value: a,
                  onChange: (b) => c(b.target.value),
                  children: (o.choices || []).map((b) => /* @__PURE__ */ f.jsxs("option", { value: b.value, children: [
                    b.label,
                    b.description ? ` — ${b.description}` : ""
                  ] }, b.value))
                }
              )
            ] }),
            /* @__PURE__ */ f.jsxs("div", { className: "dialog-actions", children: [
              /* @__PURE__ */ f.jsx("button", { type: "button", onClick: () => p(o.mode === "confirm" ? !1 : null), children: "Cancel" }),
              /* @__PURE__ */ f.jsx("button", { className: o.danger ? "danger-button" : "", type: "submit", children: o.confirmLabel })
            ] })
          ]
        }
      )
    }
  ) : null;
  return { askText: y, confirm: k, choose: w, element: N };
}
function rc(o) {
  if (o == null || !Number.isFinite(o) || o < 0) return "";
  const i = o / 1e3;
  if (i < 10) return `${Math.max(0.1, i).toFixed(1)} sec`;
  if (i < 60) return `${Math.round(i)} sec`;
  const a = Math.floor(i / 60), c = Math.round(i % 60);
  return c ? `${a} min ${c} sec` : `${a} min`;
}
function Lu(o, i) {
  const a = rc(i);
  return !o || !a ? "" : `${o === "worked" ? "Worked" : "Thought"} for ${a}`;
}
function Ym(o, i) {
  const a = rc(i);
  return a ? o === "inspection" ? `Worked for ${a} · for AI data inspection` : `Worked for ${a}` : "";
}
function ey(o, i, a) {
  return [
    "browser-row",
    "project-row",
    o === (a || i) ? "selected" : "",
    o === i ? "open" : ""
  ].filter(Boolean).join(" ");
}
function ty(o, i, a) {
  if (i && !o)
    return `Workflow-specific guidance is unavailable.
${i}`;
  if (!o)
    return "The workflow-skill catalog is still loading or is not configured.";
  const c = [...o.workflows, ...o.applications || []].flatMap(
    (p) => p.skills.map((y) => ({
      key: `${p.source.source_key || p.source.workflow_key}/${y.name}`,
      label: `${p.source.source_key || p.source.workflow_key}: ${y.name} v${y.version}${p.source.source_kind === "application" ? " (application)" : ""}`,
      ref: p.source.configured_ref,
      commit: p.source.resolved_commit.slice(0, 12),
      status: p.status
    }))
  );
  if (!c.length)
    return [
      "No workflow skills are currently available.",
      "A configured workflow repository must publish compatible skills before they can be activated."
    ].join(`
`);
  const d = new Set(a);
  return [
    ...i ? [`Warning: ${i}`, ""] : [],
    `${c.length} validated workflow/application skill${c.length === 1 ? "" : "s"} discovered.`,
    d.size ? `${d.size} match${d.size === 1 ? "es" : ""} the current inputs (marked ✓).` : "None currently match the loaded inputs.",
    "",
    ...c.map(
      (p) => `${d.has(p.key) ? "✓" : "•"} ${p.label} — ${p.ref} @ ${p.commit} [${p.status}]`
    )
  ].join(`
`);
}
function ny({
  execution: o,
  files: i,
  onSave: a,
  onRerun: c,
  allowInspectionSave: d = !1
}) {
  var W;
  const [p, y] = pe.useState(!1), k = o.outputFileIds.map((q) => i.find((F) => F.id === q && !F.deletedAt)).filter(Boolean), w = o.status === "reused" ? [] : k.filter((q) => q.type === "image/png" || q.type === "image/svg+xml"), N = o.purpose || "analysis", b = N === "inspection", A = Ym(N, o.durationMs), M = (q) => /* @__PURE__ */ f.jsxs("div", { className: `execution-actions ${q}`, children: [
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "detail-toggle",
        "aria-expanded": p,
        onClick: () => y((F) => !F),
        children: p ? "Collapse" : "Show details"
      }
    ),
    (!b || d) && ["success", "reused"].includes(o.status) && /* @__PURE__ */ f.jsx("button", { onClick: a, children: "Save as script" }),
    !b && /* @__PURE__ */ f.jsx("button", { onClick: c, children: "Rerun" }),
    /* @__PURE__ */ f.jsxs("small", { children: [
      o.codeHash.slice(0, 12),
      " · ",
      o.runtimeVersion
    ] })
  ] });
  return /* @__PURE__ */ f.jsxs(
    "article",
    {
      className: `message execution ${o.status} ${b ? "inspection" : ""}`,
      "data-purpose": N,
      children: [
        /* @__PURE__ */ f.jsxs("section", { className: "execution-details", "data-expanded": p ? "true" : "false", children: [
          /* @__PURE__ */ f.jsxs("div", { className: "execution-heading", children: [
            /* @__PURE__ */ f.jsx("span", { children: o.status === "reused" ? "Reused Python run" : b ? "AI data inspection (local)" : "Python code (local)" }),
            M("top")
          ] }),
          A && /* @__PURE__ */ f.jsx("p", { className: "activity-timing", children: A }),
          b && /* @__PURE__ */ f.jsx("p", { className: "inspection-note", children: d ? "This successful legacy inspection can be promoted because no analysis-purpose execution exists for the request." : "This code was generated only to inspect bounded data for the assistant. It is not a reusable analysis script." }),
          /* @__PURE__ */ f.jsxs("div", { className: "execution-content", hidden: !p, children: [
            /* @__PURE__ */ f.jsx("pre", { children: /* @__PURE__ */ f.jsx("code", { children: o.code }) }),
            o.stdout && /* @__PURE__ */ f.jsx("pre", { children: o.stdout }),
            o.stderr && /* @__PURE__ */ f.jsx("pre", { className: "execution-error", children: o.stderr }),
            o.modelPayload && /* @__PURE__ */ f.jsxs("details", { className: "model-payload", children: [
              /* @__PURE__ */ f.jsx("summary", { children: "Data sent to AI" }),
              /* @__PURE__ */ f.jsx("p", { children: "Only this bounded envelope was returned to AmsterdamUMC." }),
              /* @__PURE__ */ f.jsx("pre", { children: JSON.stringify(o.modelPayload, null, 2) })
            ] }),
            o.preview != null && /* @__PURE__ */ f.jsx(ry, { value: o.preview }),
            M("bottom")
          ] })
        ] }),
        o.status === "reused" && /* @__PURE__ */ f.jsxs("p", { className: "reuse-note", children: [
          "Reused prior execution ",
          (W = o.reusedFrom) == null ? void 0 : W.slice(0, 8),
          " because code and inputs are unchanged."
        ] }),
        o.missingPlotCsv.length > 0 && /* @__PURE__ */ f.jsxs("p", { className: "plot-warning", children: [
          "Source CSV missing: ",
          o.missingPlotCsv.join(", ")
        ] }),
        w.map((q) => /* @__PURE__ */ f.jsx(oc, { file: q }, q.id))
      ]
    }
  );
}
function ry({ value: o }) {
  const [i, a] = pe.useState(""), c = o;
  if ((c == null ? void 0 : c.kind) === "table" && c.data) {
    const d = c.data.columns || [], p = (c.data.data || []).filter(
      (y) => !i || y.some((k) => String(k ?? "").toLowerCase().includes(i.toLowerCase()))
    );
    return /* @__PURE__ */ f.jsxs("div", { className: "table-wrap", children: [
      /* @__PURE__ */ f.jsxs("label", { className: "table-filter", children: [
        /* @__PURE__ */ f.jsx("span", { children: "Filter preview" }),
        /* @__PURE__ */ f.jsx("input", { value: i, onChange: (y) => a(y.target.value) })
      ] }),
      /* @__PURE__ */ f.jsxs("table", { children: [
        /* @__PURE__ */ f.jsx("thead", { children: /* @__PURE__ */ f.jsx("tr", { children: d.map((y) => /* @__PURE__ */ f.jsx("th", { children: y }, y)) }) }),
        /* @__PURE__ */ f.jsx("tbody", { children: p.map((y, k) => /* @__PURE__ */ f.jsx("tr", { children: y.map((w, N) => /* @__PURE__ */ f.jsx("td", { children: String(w ?? "") }, N)) }, k)) })
      ] })
    ] });
  }
  return /* @__PURE__ */ f.jsx("pre", { className: "preview", children: JSON.stringify(o, null, 2) });
}
function oc({ file: o }) {
  const [i, a] = pe.useState(!1), c = pe.useMemo(
    () => o.data ? URL.createObjectURL(new Blob([o.data], { type: o.type })) : "",
    [o.data, o.type]
  );
  return pe.useEffect(() => () => {
    c && URL.revokeObjectURL(c);
  }, [c]), c ? /* @__PURE__ */ f.jsxs("figure", { className: i ? "artifact-zoomed" : "", children: [
    /* @__PURE__ */ f.jsx("button", { className: "plot-zoom", onClick: () => a((d) => !d), children: i ? "Close full view" : "Open full view" }),
    /* @__PURE__ */ f.jsx("img", { src: c, alt: o.name, onDoubleClick: () => a(!0) }),
    /* @__PURE__ */ f.jsx("figcaption", { children: o.name })
  ] }) : null;
}
function oy(o) {
  return o < 1024 ? `${o} B` : o < 1024 ** 2 ? `${(o / 1024).toFixed(1)} KiB` : `${(o / 1024 ** 2).toFixed(1)} MiB`;
}
function iy(o, i) {
  if (!o) return "Context usage appears after the first AI response.";
  const a = o.promptTokens + o.completionTokens, c = o.estimated ? "estimated" : "API reported", d = i > 0 ? ` · ${Math.min(100, Math.round(a / i * 100))}% of ${i.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${o.promptTokens.toLocaleString()} input + ${o.completionTokens.toLocaleString()} output tokens (${c})${d} · session: ${o.sessionTokens.toLocaleString()}`;
}
function sy(o, i) {
  const a = [];
  let c = [], d = "", p = !1;
  for (let y = 0; y < o.length; y += 1) {
    const k = o[y];
    if (k === '"')
      p && o[y + 1] === '"' ? (d += '"', y += 1) : p = !p;
    else if (k === i && !p)
      c.push(d), d = "";
    else if ((k === `
` || k === "\r") && !p) {
      if (k === "\r" && o[y + 1] === `
` && (y += 1), c.push(d), c.some((w) => w.length) && a.push(c), c = [], d = "", a.length >= 101) break;
    } else
      d += k;
  }
  return (c.length || d) && (c.push(d), c.some((y) => y.length) && a.push(c)), a.map((y) => y.slice(0, 50));
}
function ay({ file: o }) {
  if (o.type === "image/png" || o.type === "image/svg+xml")
    return /* @__PURE__ */ f.jsx(oc, { file: o });
  if (!o.data) return /* @__PURE__ */ f.jsx("p", { className: "artifact-help", children: "This file is not available locally." });
  if (o.type.startsWith("text/") || /\.(csv|tsv|json|md|txt)$/i.test(o.name)) {
    const i = new TextDecoder().decode(o.data);
    if (/\.(csv|tsv)$/i.test(o.name)) {
      const a = sy(i, /\.tsv$/i.test(o.name) ? "	" : ","), [c = [], ...d] = a;
      return /* @__PURE__ */ f.jsxs("div", { className: "table-wrap artifact-table", children: [
        /* @__PURE__ */ f.jsxs("table", { children: [
          /* @__PURE__ */ f.jsx("thead", { children: /* @__PURE__ */ f.jsx("tr", { children: c.map((p, y) => /* @__PURE__ */ f.jsx("th", { children: p }, y)) }) }),
          /* @__PURE__ */ f.jsx("tbody", { children: d.map((p, y) => /* @__PURE__ */ f.jsx("tr", { children: c.map((k, w) => /* @__PURE__ */ f.jsx("td", { children: p[w] || "" }, w)) }, y)) })
        ] }),
        a.length >= 101 && /* @__PURE__ */ f.jsx("p", { className: "artifact-help", children: "Preview limited to 100 rows." })
      ] });
    }
    return /* @__PURE__ */ f.jsx("pre", { className: "artifact-text-preview", children: i.slice(0, 64 * 1024) });
  }
  return /* @__PURE__ */ f.jsx("p", { className: "artifact-help", children: "Preview is not available for this file type. Use Download to open the file." });
}
function ly({
  artifact: o,
  file: i,
  onInspect: a,
  onSaveBundle: c
}) {
  const d = o.viewer || (i == null ? void 0 : i.viewer);
  return d ? /* @__PURE__ */ f.jsxs("article", { className: "viewer-preview-card", children: [
    /* @__PURE__ */ f.jsxs("div", { className: "viewer-preview-heading", children: [
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("span", { children: "OME-Zarr view" }),
        /* @__PURE__ */ f.jsx("strong", { children: o.title })
      ] }),
      d.viewerUrl ? /* @__PURE__ */ f.jsx(
        "a",
        {
          className: "button-link",
          href: d.viewerUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          children: "Open in ZarrViewer"
        }
      ) : /* @__PURE__ */ f.jsx("span", { className: "viewer-link-pending", children: "Revalidate this preview in the current OMERO object to reopen it" })
    ] }),
    i && /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("button", { className: "viewer-preview-image", onClick: () => a(i), children: /* @__PURE__ */ f.jsx(oc, { file: i }) }),
      d.renderRecipe && /* @__PURE__ */ f.jsx(
        "button",
        {
          className: "button-link",
          onClick: () => c(o, i),
          children: "Save analysis + render"
        }
      )
    ] }),
    /* @__PURE__ */ f.jsxs("small", { children: [
      "Field ",
      d.field,
      " · ROI ",
      d.roi.join(", "),
      d.croppedField ? " · centered preview; full field opens in ZarrViewer" : ""
    ] })
  ] }) : null;
}
function uy({
  runtimeReady: o,
  runtimeProgress: i,
  status: a,
  usage: c,
  settings: d,
  blocked: p,
  canChat: y,
  composerPlaceholder: k,
  prompt: w,
  busy: N,
  onPromptChange: b,
  onSend: A,
  onStop: M,
  onReset: W
}) {
  return /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
    !o && /* @__PURE__ */ f.jsxs("div", { className: "runtime-progress", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("strong", { children: i.message }),
        /* @__PURE__ */ f.jsxs("span", { children: [
          Math.round(i.percent),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ f.jsx("progress", { max: "100", value: i.percent }),
      /* @__PURE__ */ f.jsx("small", { children: "Please wait. The question box unlocks automatically when browser Python is ready." })
    ] }),
    /* @__PURE__ */ f.jsx("div", { className: "status", role: "status", children: a }),
    /* @__PURE__ */ f.jsxs("div", { className: "usage-status", children: [
      /* @__PURE__ */ f.jsx("span", { children: "Azure receives prompts, generated code, bounded schemas/previews/statistics, summaries, and errors — never source files." }),
      /* @__PURE__ */ f.jsx("span", { children: iy(c, d.contextWindow || 0) })
    ] }),
    p && /* @__PURE__ */ f.jsx("div", { className: "blocker", children: "Analysis is blocked until every input is available. Retry, reselect, or remove missing files." }),
    !d.apiKey || !d.model ? /* @__PURE__ */ f.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
    /* @__PURE__ */ f.jsxs("div", { className: "composer", children: [
      /* @__PURE__ */ f.jsxs("div", { className: `composer-state ${y ? "ready" : "waiting"}`, children: [
        /* @__PURE__ */ f.jsx("span", { "aria-hidden": "true", children: y ? "●" : "◷" }),
        y ? "Ready — you can ask a question" : k
      ] }),
      /* @__PURE__ */ f.jsx(
        "textarea",
        {
          value: w,
          onChange: (q) => b(q.target.value),
          onKeyDown: (q) => {
            q.key === "Enter" && !q.shiftKey && (q.preventDefault(), A());
          },
          disabled: !y,
          placeholder: k
        }
      ),
      N ? /* @__PURE__ */ f.jsx("button", { className: "stop", onClick: M, children: "Stop" }) : /* @__PURE__ */ f.jsx("button", { disabled: !y || !w.trim(), onClick: A, children: "Send" }),
      /* @__PURE__ */ f.jsx("button", { disabled: N || !o, onClick: W, children: "Reset Python" })
    ] })
  ] });
}
function cy({
  open: o,
  file: i,
  profiles: a,
  canUpload: c,
  onToggle: d,
  onDownload: p,
  onAttach: y
}) {
  var k;
  return /* @__PURE__ */ f.jsxs("aside", { className: `artifact-inspector ${o ? "open" : ""}`, children: [
    /* @__PURE__ */ f.jsxs("div", { className: "artifact-header", children: [
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("span", { children: "Artifact inspector" }),
        /* @__PURE__ */ f.jsx("strong", { children: (i == null ? void 0 : i.name) || "Data profile" })
      ] }),
      /* @__PURE__ */ f.jsx(
        "button",
        {
          "aria-label": o ? "Close artifact inspector" : "Open artifact inspector",
          onClick: d,
          children: o ? "×" : "›"
        }
      )
    ] }),
    o && /* @__PURE__ */ f.jsx("div", { className: "artifact-body", children: i ? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx(ay, { file: i }),
      /* @__PURE__ */ f.jsxs("dl", { className: "artifact-metadata", children: [
        /* @__PURE__ */ f.jsx("dt", { children: "Size" }),
        /* @__PURE__ */ f.jsx("dd", { children: oy(i.size) }),
        /* @__PURE__ */ f.jsx("dt", { children: "SHA-256" }),
        /* @__PURE__ */ f.jsx("dd", { children: i.sha256 }),
        /* @__PURE__ */ f.jsx("dt", { children: "Created" }),
        /* @__PURE__ */ f.jsx("dd", { children: new Date(i.createdAt).toLocaleString() })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "artifact-buttons", children: [
        ((k = i.viewer) == null ? void 0 : k.viewerUrl) && /* @__PURE__ */ f.jsx(
          "a",
          {
            className: "button-link",
            href: i.viewer.viewerUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            children: "Open in ZarrViewer"
          }
        ),
        /* @__PURE__ */ f.jsx("button", { onClick: () => p(i), children: "Download" }),
        c && /* @__PURE__ */ f.jsx("button", { onClick: () => y(i), children: "Attach to OMERO" })
      ] })
    ] }) : /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("p", { className: "artifact-help", children: "Local schema profiles are generated without sending source files to Azure." }),
      a.map((w) => /* @__PURE__ */ f.jsxs("details", { open: !0, children: [
        /* @__PURE__ */ f.jsxs("summary", { children: [
          w.format.toUpperCase(),
          " input profile"
        ] }),
        /* @__PURE__ */ f.jsx("pre", { children: JSON.stringify(w.summary, null, 2) }),
        w.error && /* @__PURE__ */ f.jsx("p", { className: "execution-error", children: w.error })
      ] }, w.path)),
      !a.length && /* @__PURE__ */ f.jsx("p", { className: "artifact-help", children: "Add a supported input to inspect it." })
    ] }) })
  ] });
}
function Mf(o) {
  return o.source.source_key || o.source.workflow_key;
}
function dy(o, i) {
  const a = i.split("*").map((c) => c.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${a}$`, "i").test(o);
}
function fy(o) {
  const i = /* @__PURE__ */ new Set(), a = (c) => {
    typeof c == "string" ? i.add(c.toLowerCase()) : Array.isArray(c) ? c.forEach(a) : c && typeof c == "object" && Object.entries(c).forEach(([d, p]) => {
      i.add(d.toLowerCase()), a(p);
    });
  };
  return o.forEach((c) => a(c.summary)), i;
}
function Fu(o, i, a) {
  if (!o) return [];
  const c = i.filter((y) => !y.deletedAt && y.state === "ready").map((y) => y.name), d = fy(a), p = [];
  for (const y of o.workflows)
    for (const k of y.skills) {
      let w = k.match.auto_activate ? 1 : 0;
      const N = [], b = k.match.extensions.find(
        (q) => c.some((F) => F.toLowerCase().endsWith(q.toLowerCase()))
      );
      b && (w += 2, N.push(`extension ${b}`));
      const A = k.match.filename_globs.find(
        (q) => c.some((F) => dy(F, q))
      );
      A && (w += 3, N.push(`filename ${A}`));
      const M = k.match.required_tables.map((q) => q.toLowerCase());
      M.length && M.every((q) => d.has(q)) && (w += 5, N.push(`schema ${M.join(", ")}`)), k.match.extensions.length > 0 || k.match.filename_globs.length > 0 || k.match.required_tables.length > 0 || (w += 1, N.push("general workflow guidance")), w > 0 && p.push({ entry: y, skill: k, score: w, reasons: N });
    }
  return p.sort(
    (y, k) => k.score - y.score || y.skill.name.localeCompare(k.skill.name)
  );
}
function py(o) {
  const i = o.files.find((p) => p.path === "SKILL.md");
  if (!i) throw new Error(`${o.skill.name} has no SKILL.md`);
  const a = o.files.filter((p) => p.path !== "SKILL.md").map((p) => p.path), c = (o.skill.required_resources || []).map((p) => {
    const y = o.files.find((k) => k.path === p);
    if (!y) throw new Error(`${o.skill.name} requires unavailable resource ${p}`);
    return `Required reference ${p}:
${y.content}`;
  }), d = o.skill.required_capabilities || [];
  return [
    `Active ${o.source.source_kind === "application" ? "application-operation" : "workflow"} skill: ${o.skill.name} v${o.skill.version}`,
    `Source: ${o.source.repository_url}@${o.source.configured_ref}`,
    `Resolved commit: ${o.source.resolved_commit}`,
    `Package hash: ${o.skill.sha256}`,
    i.content,
    ...d.length ? [`Required host capabilities: ${d.join(", ")}`] : [],
    ...c,
    a.length ? `Other available references (load only when needed): ${a.filter((p) => {
      var y;
      return !((y = o.skill.required_resources) != null && y.includes(p));
    }).join(", ") || "none"}` : "No additional references."
  ].join(`

`);
}
function zf(o) {
  return {
    workflowKey: o.source.workflow_key,
    sourceKind: o.source.source_kind || "workflow",
    sourceKey: o.source.source_key || o.source.workflow_key,
    name: o.skill.name,
    version: o.skill.version,
    sha256: o.skill.sha256,
    configuredRef: o.source.configured_ref,
    resolvedCommit: o.source.resolved_commit
  };
}
const Lf = 48 * 1024;
function Si(o, i) {
  return [...o].sort().join(",") + "|" + [...i].sort().join(",");
}
function Ff(o) {
  return /\bobject_navigation\b|\bfoci_assignments\b|\bfield_quality_summary\b/i.test(o) ? "navigation" : /\bschema_info\b|\binformation_schema\b|\bsqlite_master\b|\bpragma\s+table_info\b|\bdescribe\b/i.test(o) ? "schema" : "tool-result";
}
function ms(o) {
  const i = typeof o == "string" ? o : JSON.stringify(o);
  return i.length > Lf ? `${i.slice(0, Lf)}
[evidence payload truncated]` : i;
}
function Du(o, i, a, c) {
  const d = Si(a, c);
  return o.filter((p) => p.chatId === i && p.sourceSkillKey === d).sort((p, y) => p.createdAt.localeCompare(y.createdAt));
}
function hy(o, i) {
  const a = o.filter((p) => p.id !== i.id), c = [...a.filter((p) => p.chatId === i.chatId), i].sort((p, y) => p.createdAt.localeCompare(y.createdAt)).slice(-100), d = new Set(c.map((p) => p.id));
  return [
    ...a.filter((p) => p.chatId !== i.chatId || d.has(p.id)),
    ...c.filter((p) => !a.some((y) => y.id === p.id))
  ].sort((p, y) => p.createdAt.localeCompare(y.createdAt));
}
function my(o) {
  if (!o.length) return "No verified evidence is available for the current input and skill hashes.";
  const i = o.filter((d) => d.status === "success").slice(-12), a = o.filter((d) => d.status === "failed").slice(-4), c = [
    "Verified evidence ledger for unchanged inputs/skills:",
    ...i.map(
      (d) => `- ${d.id} [${d.kind}] ${d.summary}`
    )
  ];
  return a.length && c.push(
    "Recent failed approahes; do not repeat unchanged:",
    ...a.map((d) => `- ${d.id}: ${d.summary}`)
  ), c.join(`
`).slice(0, 12e3);
}
function vp(o, i) {
  if (!Array.isArray(o) || !o.length)
    throw new Error("Rendering requires at least one evidence_id from a successful analysis execution");
  const a = new Set(
    i.filter((d) => d.status === "success").map((d) => d.id)
  ), c = [...new Set(o.map(String))];
  if (c.some((d) => !a.has(d)))
    throw new Error("A render evidence_id is missing, failed, or stale for the current inputs/skills");
  return c;
}
function Xu(o, i = []) {
  if (Array.isArray(o)) {
    for (const c of o) Xu(c, i);
    return i;
  }
  if (!o || typeof o != "object") return i;
  const a = o;
  Array.isArray(a.render_panels) && i.push(a);
  for (const c of Object.values(a)) Xu(c, i);
  return i;
}
function Qa(o) {
  if (Array.isArray(o))
    return `[${o.map(Qa).join(",")}]`;
  if (o && typeof o == "object") {
    const i = o;
    return `{${Object.keys(i).sort().map(
      (a) => `${JSON.stringify(a)}:${Qa(i[a])}`
    ).join(",")}}`;
  }
  return JSON.stringify(o);
}
function yy(o, i, a) {
  const c = vp(i, a);
  if (!o || typeof o != "object")
    throw new Error("Gallery rendering requires a structured request");
  const d = o;
  if (!Array.isArray(d.panels))
    throw new Error("Gallery rendering requires panels");
  const p = Qa(d.panels), y = String(d.store_uuid || "").toLowerCase(), k = new Map(a.map((w) => [w.id, w]));
  for (const w of c) {
    const N = k.get(w);
    if (!N) continue;
    let b;
    try {
      b = JSON.parse(N.payload);
    } catch {
      continue;
    }
    for (const A of Xu(b))
      if (String(A.store_uuid || "").toLowerCase() === y && Qa(A.render_panels) === p)
        return c;
  }
  throw new Error(
    'The cited analysis evidence does not contain this exact gallery recipe. Run Python once with result = {"store_uuid": store_uuid, "render_panels": panels}, including every field, ROI, channel, label path, label value, title, and caption; then copy render_panels unchanged into render_zarr_gallery.'
  );
}
function vy(o, i) {
  const a = o.filter(
    (d) => d.chatId === i.chatId && d.promptId === i.promptId && (d.status === "success" || d.status === "reused")
  ).sort((d, p) => d.createdAt.localeCompare(p.createdAt)), c = a.filter((d) => d.purpose !== "inspection");
  return c.length ? c : a.filter((d) => d.purpose === "inspection");
}
function gy(o, i, a, c) {
  var M, W, q;
  const d = (M = o.viewer) == null ? void 0 : M.renderRecipe;
  if (!d) throw new Error("This preview has no reproducible render recipe");
  if (!i.data) throw new Error("The rendered PNG is unavailable in this browser project");
  const p = vy(a, o);
  if (!p.length) throw new Error("No successful analysis or inspection code produced this render");
  const y = Array.from(new Set(p.map((F) => F.code.trimEnd()))).join(
    `

# Continued verified analysis
`
  ), k = new Set(((W = o.viewer) == null ? void 0 : W.evidenceIds) || []), w = c.filter(
    (F) => F.status === "success" && (k.has(F.id) || p.some((Y) => Y.evidenceId === F.id))
  ), N = {
    schema: "nl.bioimaging.omero-analysis-render-bundle.v1",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    artifact: {
      id: o.id,
      title: o.title,
      render_kind: ((q = o.viewer) == null ? void 0 : q.renderKind) || "roi",
      png_sha256: i.sha256
    },
    source_hashes: Array.from(new Set(w.flatMap((F) => F.sourceHashes))).sort(),
    skill_hashes: Array.from(new Set(w.flatMap((F) => F.skillHashes))).sort(),
    evidence: w.map((F) => ({
      id: F.id,
      kind: F.kind,
      summary: F.summary,
      source_skill_key: F.sourceSkillKey,
      created_at: F.createdAt
    })),
    executions: p.map((F) => ({
      id: F.id,
      evidence_id: F.evidenceId,
      code_hash: F.codeHash,
      runtime_version: F.runtimeVersion,
      model: F.model,
      purpose: F.purpose,
      created_at: F.createdAt
    }))
  }, b = (F) => new Uint8Array(new TextEncoder().encode(F));
  return { archive: up({
    "analysis.py": b(`${y}
`),
    "render-recipe.json": b(`${JSON.stringify(d, null, 2)}
`),
    "render.png": new Uint8Array(i.data),
    "evidence-manifest.json": b(`${JSON.stringify(N, null, 2)}
`)
  }, { level: 6 }), code: y, recipe: d, manifest: N, execution: p.at(-1) };
}
function qa(o, i = /* @__PURE__ */ new Set()) {
  if (typeof o == "string") {
    const c = o.trim();
    if (!c.startsWith("{") && !c.startsWith("[")) return null;
    try {
      return qa(JSON.parse(c), i);
    } catch {
      return null;
    }
  }
  if (!o || typeof o != "object" || i.has(o)) return null;
  if (i.add(o), Array.isArray(o)) {
    for (const c of o) {
      const d = qa(c, i);
      if (d) return d;
    }
    return null;
  }
  const a = o;
  if (typeof a.store_uuid == "string" && Array.isArray(a.render_panels) && a.render_panels.length >= 2)
    return {
      store_uuid: a.store_uuid,
      render_panels: a.render_panels,
      title: typeof a.title == "string" ? a.title : void 0,
      filename: typeof a.filename == "string" ? a.filename : void 0,
      columns: typeof a.columns == "number" ? a.columns : void 0
    };
  for (const c of Object.values(a)) {
    const d = qa(c, i);
    if (d) return d;
  }
  return null;
}
function wy(o) {
  return o.replace(/\.py$/i, "").replace(/-analysis$/i, "").replace(/^analysis-/, "") || "saved-script-gallery";
}
function ky(o, i, a) {
  var w;
  let c;
  try {
    c = JSON.parse(o);
  } catch {
    return null;
  }
  const d = c.evidence_id;
  if (typeof d != "string" || !d) return null;
  const p = qa(c);
  if (!p) return null;
  const y = wy(i), k = ((w = a == null ? void 0 : a.layout) == null ? void 0 : w.columns) ?? p.columns ?? Math.min(4, p.render_panels.length);
  return {
    evidence_ids: [d],
    store_uuid: p.store_uuid,
    panels: p.render_panels,
    title: (a == null ? void 0 : a.title) || p.title || y.replace(/-/g, " "),
    filename: (a == null ? void 0 : a.filename) || p.filename || y,
    columns: k
  };
}
function xy(o) {
  const i = o.replace(/\.(png|svg)$/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return i ? i.charAt(0).toUpperCase() + i.slice(1) : "";
}
function Df(o, i, a) {
  const c = new Set(a.executionIds || []), d = o.filter(
    (p) => p.chatId === a.chatId && (p.kind === "viewer-preview" || p.kind === "plot") && (p.executionId != null && c.has(p.executionId) || a.promptId != null && p.promptId === a.promptId)
  ).sort((p, y) => +(y.kind === "viewer-preview") - +(p.kind === "viewer-preview") || y.createdAt.localeCompare(p.createdAt));
  for (const p of d) {
    const y = i.find((w) => w.id === p.fileId);
    if (p.kind === "plot" && !(y != null && y.type.startsWith("image/"))) continue;
    const k = p.title || (y == null ? void 0 : y.name) || "";
    if (k) {
      if ((y == null ? void 0 : y.name) === k || /\.(png|svg)$/i.test(k)) {
        const w = xy(k);
        if (w) return w;
      }
      return k.trim();
    }
  }
  return null;
}
const gp = 8, jy = "The tool-round limit has been reached. Do not call more tools. Give the best final answer using the results already available, and clearly state any remaining limitation.";
function Sy(o, i) {
  const a = o >= gp;
  return {
    finalSynthesis: a,
    tools: a ? [] : i
  };
}
function _y(o) {
  return o.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function wp(o) {
  return o.replace(/[\u0000-\u001f\\/]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}
function Ey(o, i, a) {
  const c = wp(i);
  if (!c) throw new Error("Project name cannot be empty");
  const d = o.project.rootPath, y = `${d.split("--", 1)[0] || "OMERO/Local"}--${_y(c)}`, k = o.files.map((w) => ({
    ...w,
    logicalPath: w.logicalPath.startsWith(`${d}/`) ? `${y}${w.logicalPath.slice(d.length)}` : w.logicalPath
  }));
  return {
    ...o,
    project: {
      ...o.project,
      name: c,
      rootPath: y,
      updatedAt: a
    },
    files: k
  };
}
function Cy(o, i, a) {
  const c = new Set(i);
  return {
    ...o,
    files: o.files.map(
      (d) => c.has(d.id) && d.source === "result" && !d.deletedAt ? { ...d, deletedAt: a } : d
    )
  };
}
const by = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, Uf = 256 * 1024 * 1024, Le = () => crypto.randomUUID(), te = () => (/* @__PURE__ */ new Date()).toISOString(), Bf = (o) => o.toLowerCase().endsWith(".png") ? "image/png" : o.toLowerCase().endsWith(".svg") ? "image/svg+xml" : o.toLowerCase().endsWith(".csv") ? "text/csv" : o.toLowerCase().endsWith(".json") ? "application/json" : "application/octet-stream";
function on(o) {
  return o.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function Vf(o) {
  const i = o.replace(/\s+/g, " ").trim().slice(0, 64);
  return i ? i.charAt(0).toUpperCase() + i.slice(1) : "New analysis";
}
function Da(o) {
  const i = Array.from(o.matchAll(/["']\/input\/([^"']+)["']/g), (c) => c[1]), a = Array.from(new Set(i));
  return {
    formats: Array.from(new Set(a.map((c) => {
      var d;
      return ((d = c.split(".").at(-1)) == null ? void 0 : d.toLowerCase()) || "";
    }))).filter(Boolean),
    requiredFiles: a.map((c) => {
      var d, p;
      return {
        path: c,
        extension: ((p = (d = c.match(/(\.[^.]+)$/)) == null ? void 0 : d[1]) == null ? void 0 : p.toLowerCase()) || ""
      };
    }),
    runtimeVersion: Ha
  };
}
function Wf(o) {
  return JSON.stringify(
    o.filter((i) => !i.deletedAt).map((i) => ({
      path: i.source === "result" ? `/output/${i.name}` : `/input/${i.name}`,
      logical_path: i.logicalPath,
      sha256: i.sha256,
      size: i.size,
      type: i.type,
      state: i.state
    }))
  );
}
function ki(o, i) {
  const a = i.filter((p) => p.source !== "result" && p.state === "ready"), c = [];
  return { code: o.replace(/(["'])\/input\/([^"']+)\1/g, (p, y, k) => {
    var b, A;
    if (a.some((M) => M.name === k)) return p;
    const w = ((A = (b = k.match(/(\.[^.]+)$/)) == null ? void 0 : b[1]) == null ? void 0 : A.toLowerCase()) || "", N = a.filter(
      (M) => w && M.name.toLowerCase().endsWith(w)
    );
    if (N.length !== 1)
      throw new Error(
        N.length ? `Script input ${k} is ambiguous: ${N.map((M) => M.name).join(", ")}` : `Script input ${k} has no compatible file in this project`
      );
    return c.push({ from: k, to: N[0].name }), `${y}/input/${N[0].name}${y}`;
  }), bindings: c };
}
function Uu(o) {
  return Math.max(1, Math.ceil(JSON.stringify(o).length / 4));
}
function Py(o) {
  return o.filter((i) => i.kind !== "execution").slice(0, -12).map((i) => `${i.role}: ${i.content.replace(/\s+/g, " ").slice(0, 240)}`).join(`
`).slice(-12e3);
}
function xi(o) {
  return o >= 1024 * 1024 * 1024 ? `${(o / 1024 / 1024 / 1024).toFixed(1)} GiB` : o >= 1024 * 1024 ? `${(o / 1024 / 1024).toFixed(1)} MiB` : o >= 1024 ? `${(o / 1024).toFixed(1)} KiB` : `${o} bytes`;
}
function Ua(o) {
  return (o == null ? void 0 : o.files.filter((i) => !i.deletedAt).reduce((i, a) => i + a.size, 0)) || 0;
}
function ji(o) {
  return o.files.filter((i) => i.source !== "result" && i.state === "ready" && !i.deletedAt).map((i) => i.sha256).sort();
}
function Ay() {
  const o = window.OMERO_ANALYSIS, i = pe.useMemo(() => new em(o), [o]), a = pe.useMemo(() => new Gm(o.runtimeBase), [o]), c = Xm(), [d, p] = pe.useState(null), y = pe.useRef(null), [k, w] = pe.useState([]), [N, b] = pe.useState([]), [A, M] = pe.useState([]), [W, q] = pe.useState(null), [F, Y] = pe.useState([]), [je, Te] = pe.useState(null), _e = pe.useRef(null), Ee = pe.useRef(/* @__PURE__ */ new Map()), [Ae, $e] = pe.useState(""), [se, ve] = pe.useState(null), [ie, Fe] = pe.useState(""), Oe = pe.useRef(/* @__PURE__ */ new Map()), [O, xe] = pe.useState(Rf), [Ie, Be] = pe.useState(""), [Re, me] = pe.useState(!1), [K, ee] = pe.useState(""), [X, C] = pe.useState("ready"), [L, ye] = pe.useState(!1), ge = pe.useRef(!1), [de, Ce] = pe.useState([]), [Me, be] = pe.useState(null), [He, ut] = pe.useState(320), [Qt, It] = pe.useState(!0), [$t, ir] = pe.useState(""), [_i, re] = pe.useState("Preparing project…"), [Lo, ws] = pe.useState(!1), [ln, zn] = pe.useState(null), [jn, no] = pe.useState(!1), [Ei, ro] = pe.useState(null), [Ln, Er] = pe.useState(/* @__PURE__ */ new Set()), [zt, Fn] = pe.useState(/* @__PURE__ */ new Set()), [ks, sr] = pe.useState(!1), [Dn, xs] = pe.useState(""), [ar, Un] = pe.useState({
    inputs: !0,
    outputs: !0,
    scripts: !0,
    workflows: !0,
    trash: !1,
    snapshots: !1
  }), [Xa, oo] = pe.useState(null), [io, Sn] = pe.useState({
    percent: 0,
    message: "Preparing the browser workspace…"
  }), [so, Cr] = pe.useState({ usage: 0, quota: 0 }), Jt = pe.useRef(null), lr = pe.useRef(null), ao = pe.useRef(null), br = pe.useRef(null), Lt = pe.useRef(/* @__PURE__ */ new Set()), xt = pe.useRef([]);
  y.current = d, _e.current = je;
  const Ne = (d == null ? void 0 : d.project) || null, ur = (d == null ? void 0 : d.chats) || [], Ge = ur.find((l) => l.id === (Ne == null ? void 0 : Ne.activeChatId)) || ur[0] || null, cr = ((d == null ? void 0 : d.files) || []).filter(
    (l) => l.source !== "result" && !l.deletedAt
  ), Pr = ((d == null ? void 0 : d.files) || []).filter(
    (l) => l.source === "result" && l.chatId === (Ge == null ? void 0 : Ge.id) && !l.deletedAt
  ), Bn = cr.filter((l) => l.state !== "ready"), Ya = (d == null ? void 0 : d.files.find(
    (l) => l.id === Me && !l.deletedAt
  )) || Pr.at(-1) || null, un = (l) => !$t.trim() || l.toLowerCase().includes($t.trim().toLowerCase()), lo = cr.filter((l) => un(l.name)), dr = Pr.filter((l) => un(l.name)), uo = ((d == null ? void 0 : d.files) || []).filter((l) => !!l.deletedAt), Fo = ((d == null ? void 0 : d.scripts) || []).filter((l) => !l.deletedAt), Ci = ((d == null ? void 0 : d.scripts) || []).filter((l) => !!l.deletedAt), bi = ((d == null ? void 0 : d.workflows) || []).filter((l) => !!l.deletedAt), Vn = !!Ge && L && Bn.length === 0 && !!(O.apiKey && O.model) && !Re, js = Re ? "Analysis in progress — wait for the answer or press Stop…" : Bn.some((l) => l.state === "failed" || l.state === "missing") ? "Chat is blocked — retry, reselect, or remove the missing data file…" : Bn.length ? "Downloading selected data — chat will unlock when every file is ready…" : L ? !O.apiKey || !O.model ? "Configure the AmsterdamUMC deployment and API key before asking a question…" : "Ask a question about the loaded data…" : `${io.message} (${Math.round(io.percent)}%) — please wait…`;
  pe.useEffect(() => {
    const l = lr.current;
    if (!l) return;
    const h = requestAnimationFrame(() => {
      l.scrollTo({ top: l.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(h);
  }, [Ge == null ? void 0 : Ge.messages, d == null ? void 0 : d.executions, d == null ? void 0 : d.files]), pe.useEffect(() => {
    Fn(/* @__PURE__ */ new Set());
  }, [Ne == null ? void 0 : Ne.id, Ge == null ? void 0 : Ge.id]), pe.useEffect(() => {
    if (!ln) return;
    const l = () => zn(null), h = (v) => {
      v.key === "Escape" && l();
    };
    return window.addEventListener("click", l), window.addEventListener("blur", l), window.addEventListener("resize", l), window.addEventListener("keydown", h), () => {
      window.removeEventListener("click", l), window.removeEventListener("blur", l), window.removeEventListener("resize", l), window.removeEventListener("keydown", h);
    };
  }, [ln]), pe.useEffect(() => {
    let l = !0;
    return (async () => {
      var Q;
      const [h, v] = await Promise.all([
        cp(Tf),
        Um(o.context)
      ]);
      if (!l) return;
      h && xe({ ...Rf, ...h }), await i.connect();
      const [j, x] = await Promise.all([
        i.hierarchy(),
        i.zarrViewerStatus().catch((z) => ({
          schema_version: 1,
          available: !1,
          installed: !1,
          enabled: !1,
          version: null,
          minimum_version: "0.4.0",
          reason: "not-installed"
        }))
      ]);
      q(j), ve(x), Fe(
        x.available ? "" : x.reason === "not-installed" ? "OMERO ZarrViewer is not installed; image previews are unavailable." : x.reason === "app-disabled" ? "OMERO ZarrViewer is installed but not enabled in OMERO.web." : `OMERO ZarrViewer integration unavailable: ${x.reason || "unknown reason"}`
      );
      try {
        const z = await i.listWorkflowSkills();
        l && (Te(z), $e(
          z.workflows.some((B) => B.status === "stale") ? "Workflow guidance is using an unchanged cached revision." : ""
        ));
      } catch (z) {
        l && $e(
          `Workflow-specific guidance unavailable: ${String(z)}`
        );
      }
      let P = v;
      const _ = (Q = o.context) == null ? void 0 : Q.selected_project_snapshot;
      if (_) {
        Sn({ percent: 8, message: "Restoring the selected OMERO project…" });
        const B = (await _r(o.context)).find(
          (G) => G.sourceSnapshotAnnotationId === _.annotation_id
        );
        if (B)
          P = await ps(B.id) || v;
        else {
          const G = await zu(
            await i.downloadSnapshot(_),
            o.context
          );
          if (o.context && (G.project.objectType !== o.context.object_type || G.project.objectId !== o.context.object_id))
            throw new Error("The selected project belongs to a different OMERO object");
          G.project = {
            ...G.project,
            sourceSnapshotAnnotationId: _.annotation_id,
            updatedAt: te()
          }, await nr(G), P = G;
        }
      }
      let R = await co(P);
      l && (p(R), y.current = R, w(await _r(o.context)), b(await wi(o.context)), M(await i.listSnapshots()), Y(await i.listWorkflowTemplates()), await Pi(R.files), Ce(await a.profileInputs()), l && (ye(!0), Sn({ percent: 100, message: "Browser Python is ready" }), re("Ready — analysis runs locally in this browser"), Cr(await Fa())));
    })().catch((h) => {
      l && (re(`Project failed: ${String(h)}`), Sn({ percent: 0, message: `Project failed: ${String(h)}` }));
    }), () => {
      l = !1, a.dispose();
    };
  }, [o, i, a]);
  async function co(l) {
    var P;
    let h = l;
    const v = new Map(
      h.files.filter((_) => _.annotationId).map((_) => [_.annotationId, _])
    ), j = ((P = o.context) == null ? void 0 : P.selected_attachments) || [];
    for (const _ of j) {
      if (v.has(_.annotation_id)) continue;
      const R = {
        id: Le(),
        projectId: h.project.id,
        name: _.name,
        logicalPath: `${h.project.rootPath}/inputs/${_.annotation_id}--${_.name}`,
        type: _.mimetype,
        size: _.size,
        sha256: "",
        source: "omero",
        state: "loading",
        annotationId: _.annotation_id,
        fileId: _.file_id,
        createdAt: te()
      };
      h = { ...h, files: [...h.files, R] }, v.set(_.annotation_id, R);
    }
    const x = h.files.filter(
      (_) => _.source === "omero" && _.annotationId && (!_.data || _.state !== "ready")
    );
    for (let _ = 0; _ < x.length; _ += 1) {
      const R = x[_];
      Sn({
        percent: Math.round(_ / Math.max(1, x.length) * 90),
        message: `Downloading ${_ + 1} of ${x.length} OMERO inputs…`
      });
      try {
        const Q = {
          annotation_id: R.annotationId,
          file_id: R.fileId || 0,
          name: R.name,
          mimetype: R.type,
          size: R.size,
          kind: "attachment",
          supported: !0
        }, z = await i.download(Q), B = await Zt(z);
        if (R.sha256 && R.sha256 !== B)
          throw new Error(
            `OMERO input ${R.name} no longer matches the snapshot hash`
          );
        const G = {
          ...R,
          data: z,
          size: z.byteLength,
          sha256: B,
          state: "ready",
          error: void 0
        };
        h = {
          ...h,
          files: h.files.map((H) => H.id === R.id ? G : H)
        }, await gi(G);
      } catch (Q) {
        const z = { ...R, state: "failed", error: String(Q) };
        h = {
          ...h,
          files: h.files.map((B) => B.id === R.id ? z : B)
        }, await gi(z);
      }
    }
    return await nr(h), h;
  }
  function el(l) {
    Sn(l), re(l.message);
  }
  async function Pi(l) {
    ye(!1), Sn({ percent: 1, message: "Starting browser Python…" });
    const h = l.filter(
      (v) => v.source !== "result" && v.state === "ready" && !v.deletedAt
    );
    ge.current ? await a.syncInputs(h) : (await a.start(h, el), ge.current = !0);
  }
  async function Gt(l, h) {
    await Pi(l), Ce(await a.profileInputs()), ye(!0), Sn({ percent: 100, message: "Browser Python is ready" }), re(h);
  }
  function fo(l) {
    const h = y.current;
    if (h) {
      const v = { ...h, project: l };
      y.current = v, p(v);
    }
    Nf(l);
  }
  function fr(l) {
    const h = y.current;
    if (h) {
      const v = {
        ...h,
        chats: h.chats.map((j) => j.id === l.id ? l : j)
      };
      y.current = v, p(v);
    }
    Mu(l);
  }
  function Ft(l, h) {
    const v = y.current;
    if (!v) return;
    const j = v.chats.find((_) => _.id === l);
    if (!j) return;
    const x = { ...j, messages: [...j.messages, h], updatedAt: te() }, P = {
      ...v,
      chats: v.chats.map((_) => _.id === l ? x : _)
    };
    y.current = P, p(P), Mu(x);
  }
  function tl(l, h) {
    const v = new Set(l.pinnedMessageIds || []);
    v.has(h) ? v.delete(h) : v.add(h), fr({ ...l, pinnedMessageIds: Array.from(v), updatedAt: te() });
  }
  function Xe(l) {
    const h = y.current;
    if (!h) return;
    const v = h.executions.some((x) => x.id === l.id), j = {
      ...h,
      executions: v ? h.executions.map((x) => x.id === l.id ? l : x) : [...h.executions, l]
    };
    y.current = j, p(j), $m(l);
  }
  function Xt(l) {
    if (!l.length) return;
    const h = y.current;
    if (!h) return;
    const v = new Set(l.map((x) => x.id)), j = {
      ...h,
      files: [...h.files.filter((x) => !v.has(x.id)), ...l]
    };
    y.current = j, p(j), l.forEach((x) => void gi(x));
  }
  function Ai(l) {
    const h = y.current;
    if (!h) return;
    const v = { ...h, audits: [...h.audits, l] };
    y.current = v, p(v), Tm(l);
  }
  function Ar(l) {
    const h = y.current;
    if (!h) return;
    const v = hy(h.evidence, l), j = { ...h, evidence: v };
    y.current = j, p(j), Rm(l.chatId, v.filter((x) => x.chatId === l.chatId));
  }
  function Ir(l) {
    if (!l.length) return;
    const h = y.current;
    if (!h) return;
    const v = { ...h, artifacts: [...h.artifacts, ...l] };
    y.current = v, p(v), l.forEach((j) => void Nm(j));
  }
  async function po(l) {
    xe(l), await dp(Tf, l.rememberKey ? l : { ...l, apiKey: "" });
  }
  async function Ii(l) {
    if (!l || !d) return;
    const h = [];
    let v = Ua(d);
    for (const x of Array.from(l)) {
      if (!by.test(x.name)) {
        re(`${x.name} is not a supported tabular data file`);
        continue;
      }
      if (x.size > yf) {
        re(`${x.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (v += x.size, v > Iu) {
        re("The project would exceed 512 MiB");
        break;
      }
      const P = await x.arrayBuffer(), _ = await Zt(P);
      if ([...d.files, ...h].some(
        (R) => R.sha256 === _ && R.size === P.byteLength
      )) {
        re(`${x.name} matches a file already stored in this project`);
        continue;
      }
      h.push({
        id: Le(),
        projectId: d.project.id,
        name: x.name,
        logicalPath: `${d.project.rootPath}/inputs/${x.name}`,
        type: x.type || Bf(x.name),
        size: P.byteLength,
        sha256: _,
        source: "local",
        state: "ready",
        data: P,
        createdAt: te()
      });
    }
    const j = [...d.files, ...h];
    Xt(h), await Gt(j, "Local inputs added; browser Python is ready"), Cr(await Fa());
  }
  async function Do(l) {
    if (!d) return;
    const h = d.files.find((x) => x.id === l);
    if (!h) return;
    if (h.source === "result") {
      const x = { ...h, deletedAt: te() };
      Xt([x]), Fn((P) => {
        const _ = new Set(P);
        return _.delete(h.id), _;
      }), Me === h.id && be(null), re(`Moved ${h.name} to project trash; provenance is preserved`);
      return;
    }
    const v = d.files.filter((x) => x.id !== l), j = { ...d, files: v };
    y.current = j, p(j), await Om(l), await Gt(v, "Input removed; browser Python was reset"), Cr(await Fa());
  }
  async function cn(l) {
    if (!d) return;
    const h = d.files.find((j) => j.id === l);
    if (!(h != null && h.annotationId)) return;
    const v = { ...h, state: "loading", error: void 0 };
    Xt([v]);
    try {
      const j = await i.download({
        annotation_id: h.annotationId,
        file_id: h.fileId || 0,
        name: h.name,
        mimetype: h.type,
        size: h.size,
        kind: "attachment",
        supported: !0
      }), x = {
        ...h,
        data: j,
        size: j.byteLength,
        sha256: await Zt(j),
        state: "ready",
        error: void 0
      }, P = d.files.map((_) => _.id === h.id ? x : _);
      Xt([x]), await Gt(P, "OMERO input restored; project ready");
    } catch (j) {
      Xt([{ ...h, state: "failed", error: String(j) }]);
    }
  }
  async function Uo() {
    if (!d) return;
    const l = Za(d.project.id), h = { ...d.project, activeChatId: l.id, updatedAt: te() }, v = { ...d, project: h, chats: [...d.chats, l] };
    y.current = v, p(v), await Promise.all([Mu(l), Nf(h)]), oo(null), Lt.current.clear(), await a.beginTurn();
  }
  function Yt(l) {
    if (!d) return;
    const h = d.chats.find((j) => j.id === l);
    h != null && h.archived && fr({ ...h, archived: !1, updatedAt: te() });
    const v = { ...d.project, activeChatId: l, updatedAt: te() };
    fo(v), oo(null);
  }
  async function Bo(l) {
    var v;
    const h = (v = await c.askText(
      "Rename chat",
      l.title,
      "The chat folder and exported transcript use this name."
    )) == null ? void 0 : v.trim();
    h && fr({ ...l, title: h.slice(0, 100), updatedAt: te() });
  }
  function ft(l, h, v) {
    l.preventDefault(), l.stopPropagation();
    const j = 210, x = Math.max(60, v.length * 34 + 34);
    zn({
      x: Math.min(l.clientX, window.innerWidth - j - 8),
      y: Math.min(l.clientY, window.innerHeight - x - 8),
      title: h,
      actions: v
    });
  }
  function nl(l) {
    l.preventDefault();
    const h = l.clientX, v = He, j = (P) => ut(Math.max(250, Math.min(520, v + P.clientX - h))), x = () => {
      window.removeEventListener("mousemove", j), window.removeEventListener("mouseup", x);
    };
    window.addEventListener("mousemove", j), window.addEventListener("mouseup", x);
  }
  async function $r() {
    Ne && (zn(null), w(await _r(o.context)), b(await wi(o.context)), await Vo(Ne.id));
  }
  async function ho(l) {
    if (l.id === (Ne == null ? void 0 : Ne.id)) {
      re("Open another local project before deleting this one");
      return;
    }
    await c.confirm(
      "Delete browser-local project?",
      `${l.name} and its local chats, scripts, workflows, and outputs will be permanently removed. OMERO attachments are unchanged.`,
      "Delete local project",
      !0
    ) && (await Mm(l.id), w(await _r(o.context)), b(await wi(o.context)), re(`Deleted browser-local project ${l.name}`));
  }
  async function _n(l) {
    const h = await c.askText(
      "Rename project",
      l.name,
      "This changes the browser-local project name and logical project folder. OMERO object and attachment names are unchanged."
    );
    if (h == null) return;
    const v = wp(h);
    if (!v) {
      re("Project name cannot be empty");
      return;
    }
    if (v === l.name) return;
    const j = await _r(o.context);
    if (j.some(
      (R) => R.id !== l.id && R.name.toLocaleLowerCase() === v.toLocaleLowerCase()
    )) {
      re(`A project named ${v} already exists for this OMERO object`);
      return;
    }
    const x = y.current, P = (x == null ? void 0 : x.project.id) === l.id ? x : await ps(l.id);
    if (!P) {
      re("The browser-local project could not be loaded");
      return;
    }
    const _ = Ey(P, v, te());
    if (j.some(
      (R) => R.id !== l.id && R.rootPath.toLocaleLowerCase() === _.project.rootPath.toLocaleLowerCase()
    )) {
      re(`The project folder ${_.project.rootPath} already exists`);
      return;
    }
    await nr(_), (x == null ? void 0 : x.project.id) === l.id && (y.current = _, p(_)), w(await _r(o.context)), b(await wi(o.context)), re(`Renamed project to ${v}`);
  }
  async function mo(l) {
    var H, J;
    if (l.source === "omero") {
      re("OMERO attachment names are canonical and cannot be renamed locally");
      return;
    }
    const h = (H = await c.askText(
      "Rename file",
      l.name,
      "The file extension must remain unchanged."
    )) == null ? void 0 : H.trim();
    if (!h || h === l.name) return;
    let v = h.replace(/[\\/]/g, "_").slice(0, 180);
    if (!v || v === "." || v === "..") return;
    const j = ((J = l.name.match(/(\.[^.]+)$/)) == null ? void 0 : J[1]) || "";
    if (j && !v.toLowerCase().endsWith(j.toLowerCase())) {
      if (/\.[^.]+$/.test(v)) {
        re(`Keep the ${j} extension when renaming ${l.name}`);
        return;
      }
      v += j;
    }
    const x = y.current;
    if (!x) return;
    if (x.files.filter(
      (le) => le.id !== l.id && le.source === l.source && le.chatId === l.chatId
    ).some((le) => le.name.toLowerCase() === v.toLowerCase())) {
      re(`A file named ${v} already exists in this folder`);
      return;
    }
    const _ = l.name.replace(/\.[^.]+$/, ""), R = v.replace(/\.[^.]+$/, ""), Q = l.source === "result" && /\.(png|svg|csv)$/i.test(l.name) ? /* @__PURE__ */ new Set(["png", "svg", "csv"]) : null, z = x.files.map((le) => {
      var qe;
      let ue = le.id === l.id ? v : null;
      return !ue && Q && le.chatId === l.chatId && le.executionId === l.executionId && le.name.replace(/\.[^.]+$/, "") === _ && Q.has(((qe = le.name.split(".").at(-1)) == null ? void 0 : qe.toLowerCase()) || "") && (ue = `${R}.${le.name.split(".").at(-1)}`), ue ? {
        ...le,
        name: ue,
        logicalPath: le.logicalPath.replace(/[^/]+$/, ue)
      } : le;
    }), B = z.filter((le, ue) => le !== x.files[ue]), G = { ...x, files: z };
    y.current = G, p(G), await Promise.all(B.map(gi)), l.source === "local" ? await Gt(z, `Renamed input to ${v}; browser Python is ready`) : re(
      B.length > 1 ? `Renamed ${l.name} and its paired plot data` : `Renamed ${l.name} to ${v}`
    );
  }
  function Ss(l) {
    if (!d || d.chats.filter((j) => !j.archived).length <= 1) {
      re("Create another chat before archiving this one");
      return;
    }
    const h = { ...l, archived: !0, updatedAt: te() }, v = d.chats.find((j) => j.id !== l.id && !j.archived);
    fr(h), fo({ ...d.project, activeChatId: v.id, updatedAt: te() });
  }
  async function Vo(l) {
    const h = await ps(l);
    if (!h) return;
    const v = await co(h);
    p(v), y.current = v, ro(l), no(!1), Er(/* @__PURE__ */ new Set()), await Gt(v.files, "Project loaded");
  }
  async function Wo(l) {
    var G;
    const h = y.current, v = se, j = o.context;
    if (!h || !j || !(v != null && v.available) || !v.version)
      throw new Error(ie || "OMERO ZarrViewer 0.3 or newer is unavailable");
    const x = Hh(j, W);
    if (!x.length)
      throw new Error(
        "No compatible OMERO Image or Plate is available in the current object hierarchy"
      );
    const P = (G = h.project.zarrBindings) == null ? void 0 : G[l], _ = P && P.groupId === j.group_id ? x.find(
      (H) => H.type === P.objectType && H.id === P.objectId
    ) : void 0;
    if (_)
      try {
        const H = `${_.type}:${_.id}`, J = Oe.current.get(H) || await xf(v, _);
        if (Oe.current.set(H, J), J.store.uuid === l)
          return { binding: jf(
            J,
            _,
            j.group_id,
            v.version
          ), capability: J };
      } catch {
      }
    let R = x;
    if (x.length > 50) {
      const H = await c.choose(
        "Choose the OME-Zarr source",
        x.map((J) => ({
          value: `${J.type}:${J.id}`,
          label: J.name,
          description: `${J.type} ${J.id}`
        })),
        "This object contains many possible Zarr sources. Choose the source whose UUID should match the measurement database."
      );
      if (!H) throw new Error("OME-Zarr source selection was cancelled");
      R = x.filter(
        (J) => `${J.type}:${J.id}` === H
      );
    }
    const Q = [];
    for (let H = 0; H < R.length; H += 4) {
      const J = R.slice(H, H + 4), le = await Promise.allSettled(J.map(async (ue) => {
        const qe = `${ue.type}:${ue.id}`, Qe = Oe.current.get(qe) || await xf(v, ue);
        return Oe.current.set(qe, Qe), { candidate: ue, capability: Qe };
      }));
      for (const ue of le)
        ue.status === "fulfilled" && ue.value.capability.store.uuid === l && Q.push(ue.value);
    }
    if (!Q.length)
      throw new Error(
        `No accessible OME-Zarr source in the current OMERO hierarchy has store UUID ${l}`
      );
    let z = Q[0];
    if (Q.length > 1) {
      const H = await c.choose(
        "Choose the matching OME-Zarr source",
        Q.map(({ candidate: J }) => ({
          value: `${J.type}:${J.id}`,
          label: J.name,
          description: `${J.type} ${J.id}`
        })),
        "Multiple accessible OMERO objects point to the same OME-Zarr store."
      );
      if (!H) throw new Error("OME-Zarr source selection was cancelled");
      z = Q.find(
        ({ candidate: J }) => `${J.type}:${J.id}` === H
      ) || Q[0];
    }
    const B = jf(
      z.capability,
      z.candidate,
      j.group_id,
      v.version
    );
    return fo({
      ...y.current.project,
      zarrBindings: {
        ...y.current.project.zarrBindings || {},
        [l]: B
      },
      updatedAt: te()
    }), { binding: B, capability: z.capability };
  }
  async function _s(l, h, v, j) {
    const x = y.current, P = se;
    if (!x || !(P != null && P.available))
      throw new Error(ie || "OMERO ZarrViewer is unavailable");
    const _ = Vh(l), R = Du(
      x.evidence,
      h,
      ji(x),
      xt.current.map((Qe) => Qe.sha256)
    );
    vp(_.evidenceIds, R);
    const { binding: Q, capability: z } = await Wo(_.storeUuid), B = Jh(P, z, _), G = Xh(Q, _, B);
    let H;
    if (j) {
      const Qe = await Gh(z, _);
      if (Ua(y.current) + Qe.byteLength > Iu)
        throw new Error("The rendered preview would exceed the 512 MiB project limit");
      const Dt = `${on(_.title)}.png`;
      H = {
        id: Le(),
        projectId: x.project.id,
        chatId: h,
        name: Dt,
        logicalPath: `${x.project.rootPath}/chats/${h}/outputs/zarr/${Dt}`,
        type: "image/png",
        size: Qe.byteLength,
        sha256: await Zt(Qe),
        source: "result",
        state: "ready",
        data: Qe,
        viewer: G,
        createdAt: te()
      }, Xt([H]);
    }
    const J = {
      id: Le(),
      projectId: x.project.id,
      chatId: h,
      fileId: H == null ? void 0 : H.id,
      kind: "viewer-preview",
      title: _.title,
      pinned: !1,
      promptId: v,
      viewer: G,
      createdAt: te()
    };
    Ir([J]), Ft(h, {
      id: Le(),
      role: "assistant",
      content: j ? `Rendered ${_.title} locally from the matching OME-Zarr source.` : `Prepared a validated ZarrViewer link for ${_.title}.`,
      kind: "viewer-preview",
      artifactId: J.id,
      activity: "worked",
      createdAt: te()
    }), H && be(H.id), It(!0);
    const le = Le(), ue = ji(x), qe = xt.current.map((Qe) => Qe.sha256);
    return Ar({
      id: le,
      projectId: x.project.id,
      chatId: h,
      promptId: v,
      kind: "render",
      status: "success",
      sourceHashes: ue,
      skillHashes: qe,
      sourceSkillKey: Si(ue, qe),
      summary: `${j ? "Rendered" : "Opened"} ${_.title} from evidence ${_.evidenceIds.join(", ")}`,
      payload: ms(G),
      createdAt: te()
    }), JSON.stringify({
      ok: !0,
      artifact_id: J.id,
      render_evidence_id: le,
      cited_evidence_ids: _.evidenceIds,
      preview_created: !!H,
      field: _.field,
      roi: _.roi,
      cropped_field_preview: _.croppedField
    });
  }
  async function Ho(l, h, v) {
    const j = y.current;
    if (!j || !(se != null && se.available))
      throw new Error(ie || "OMERO ZarrViewer is unavailable");
    const { recipe: x, evidenceIds: P } = Wh(l), _ = Du(
      j.evidence,
      h,
      ji(j),
      xt.current.map((Qe) => Qe.sha256)
    );
    yy(l, P, _);
    const { binding: R, capability: Q } = await Wo(x.storeUuid), z = await Xf(Q, x);
    if (Ua(y.current) + z.byteLength > Iu)
      throw new Error("The rendered gallery would exceed the 512 MiB project limit");
    const B = `${on(x.filename || x.title || "zarr-gallery").replace(/-png$/, "")}.png`, G = Yh(R, x, P), H = {
      id: Le(),
      projectId: j.project.id,
      chatId: h,
      name: B,
      logicalPath: `${j.project.rootPath}/chats/${h}/outputs/zarr/${B}`,
      type: "image/png",
      size: z.byteLength,
      sha256: await Zt(z),
      source: "result",
      state: "ready",
      data: z,
      viewer: G,
      createdAt: te()
    };
    Xt([H]);
    const J = {
      id: Le(),
      projectId: j.project.id,
      chatId: h,
      fileId: H.id,
      kind: "viewer-preview",
      title: x.title || "OME-Zarr gallery",
      pinned: !1,
      promptId: v,
      viewer: G,
      createdAt: te()
    };
    Ir([J]), Ft(h, {
      id: Le(),
      role: "assistant",
      content: `Rendered one ${x.panels.length}-panel OME-Zarr gallery from verified analysis evidence.`,
      kind: "viewer-preview",
      artifactId: J.id,
      activity: "worked",
      createdAt: te()
    }), be(H.id), It(!0);
    const le = Le(), ue = ji(j), qe = xt.current.map((Qe) => Qe.sha256);
    return Ar({
      id: le,
      projectId: j.project.id,
      chatId: h,
      promptId: v,
      kind: "render",
      status: "success",
      sourceHashes: ue,
      skillHashes: qe,
      sourceSkillKey: Si(ue, qe),
      summary: `Rendered ${x.panels.length}-panel gallery from evidence ${P.join(", ")}`,
      payload: ms({ recipe: x, fileId: H.id, sha256: H.sha256 }),
      createdAt: te()
    }), JSON.stringify({
      ok: !0,
      artifact_id: J.id,
      file_id: H.id,
      panel_count: x.panels.length,
      render_evidence_id: le,
      cited_evidence_ids: P
    });
  }
  async function Nr(l, h, v, j, x) {
    const P = ky(
      l,
      j,
      x
    );
    return P ? Ho(P, h, v) : null;
  }
  async function yo(l, h, v, j, x) {
    const P = await Ve(
      v,
      j,
      x,
      !0,
      "script"
    ), _ = await Nr(
      P,
      j,
      x,
      l.name,
      h.renderRecipe
    );
    return { executionResult: P, renderResult: _ };
  }
  async function vo(l, h) {
    const v = `${l}/${h}`, j = Ee.current.get(v);
    if (j) return j;
    const x = await i.loadWorkflowSkill(l, h);
    return Ee.current.set(v, x), x;
  }
  async function Ve(l, h, v, j = !1, x = "analysis") {
    const P = y.current;
    if (!P) return yt("Project is not ready");
    const _ = performance.now(), R = l.replace(/\r\n/g, `
`).trimEnd(), Q = await Zt(R), z = ji(P), B = xt.current.map((he) => he.sha256).sort(), G = await Zt(
      `${Q}|${z.join(",")}|${B.join(",")}|${Ha}|plotCsv=${P.project.plotCsv}`
    ), H = P.executions.filter((he) => he.cacheKey === G && he.status !== "running").sort((he, Pe) => Pe.createdAt.localeCompare(he.createdAt))[0];
    if (H && !j) {
      const he = {
        ...H,
        id: Le(),
        chatId: h,
        promptId: v,
        status: H.status === "success" || H.status === "reused" ? "reused" : "failed",
        reusedFrom: H.id,
        purpose: x,
        durationMs: performance.now() - _,
        createdAt: te()
      };
      if (Xe(he), Ft(h, {
        id: Le(),
        role: "assistant",
        content: he.status === "reused" ? "Reused a previous successful local Python run because its code and inputs are unchanged." : "Skipped unchanged Python that already failed; AmsterdamUMC must correct the code.",
        kind: "execution",
        executionId: he.id,
        createdAt: te()
      }), he.status === "reused") {
        let Pe = H.evidenceId;
        return Pe || (Pe = Le(), Ar({
          id: Pe,
          projectId: P.project.id,
          chatId: h,
          promptId: v,
          kind: Ff(H.code),
          status: "success",
          sourceHashes: z,
          skillHashes: B,
          sourceSkillKey: Si(z, B),
          executionId: H.id,
          summary: `Reused verified execution ${H.id}`,
          payload: ms({
            stdout: H.stdout,
            preview: H.preview,
            outputFileIds: H.outputFileIds
          }),
          createdAt: te()
        })), JSON.stringify({
          reused: !0,
          execution_id: H.id,
          evidence_id: Pe,
          stdout: H.stdout,
          stderr: H.stderr,
          preview: H.preview,
          generated_files: H.outputFileIds.map((ct) => P.files.find((bn) => bn.id === ct)).filter(Boolean).map((ct) => ({ name: ct.name, size: ct.size, type: ct.type }))
        });
      }
      return yt(
        `Identical code already failed:
${H.stderr || H.stdout}. Modify the code before trying again.`
      );
    }
    const J = {
      id: Le(),
      projectId: P.project.id,
      chatId: h,
      promptId: v,
      code: R,
      codeHash: Q,
      cacheKey: G,
      status: "running",
      stdout: "",
      stderr: "",
      outputFileIds: [],
      missingPlotCsv: [],
      inputHashes: z,
      runtimeVersion: Ha,
      model: O.model,
      workflowSkills: xt.current,
      purpose: x,
      createdAt: te()
    };
    Xe(J), Ft(h, {
      id: Le(),
      role: "assistant",
      content: "Python execution",
      kind: "execution",
      executionId: J.id,
      createdAt: te()
    });
    let le;
    try {
      C("running"), le = await a.run(R);
    } catch (he) {
      const Pe = String(he instanceof Error ? he.message : he).slice(0, tr), ct = Le(), bn = {
        ...J,
        status: "failed",
        stderr: Pe,
        evidenceId: ct,
        durationMs: performance.now() - _
      };
      return Xe(bn), Ar({
        id: ct,
        projectId: P.project.id,
        chatId: h,
        promptId: v,
        kind: "failed-approah",
        status: "failed",
        sourceHashes: z,
        skillHashes: B,
        sourceSkillKey: Si(z, B),
        executionId: J.id,
        summary: Pe.slice(0, 300),
        payload: ms({ code: R, error: Pe }),
        createdAt: te()
      }), re("Python error sent to AmsterdamUMC; waiting for corrected code…"), C("repairing"), yt(he);
    }
    const ue = [];
    for (const he of le.files) {
      const Pe = Le();
      ue.push({
        id: Pe,
        projectId: P.project.id,
        chatId: h,
        executionId: J.id,
        name: he.name,
        logicalPath: `${P.project.rootPath}/chats/${h}/outputs/${J.id}/${he.name}`,
        type: he.type,
        size: he.data.byteLength,
        sha256: await Zt(he.data),
        source: "result",
        state: "ready",
        data: he.data,
        createdAt: te()
      }), Lt.current.add(he.name);
    }
    Xt(ue), Ir(ue.map((he) => ({
      id: Le(),
      projectId: P.project.id,
      chatId: h,
      executionId: J.id,
      fileId: he.id,
      kind: he.type.startsWith("image/") ? "plot" : "file",
      title: he.name,
      pinned: !1,
      createdAt: te()
    })));
    const qe = P.project.plotCsv ? Array.from(Lt.current).filter((he) => /\.(png|svg)$/i.test(he)).filter((he) => !Lt.current.has(he.replace(/\.(png|svg)$/i, ".csv"))) : [], Qe = Le(), Dt = {
      ...J,
      status: qe.length ? "incomplete" : "success",
      stdout: le.stdout,
      stderr: le.stderr,
      preview: le.preview,
      modelPayload: le.modelPayload,
      outputFileIds: ue.map((he) => he.id),
      missingPlotCsv: qe,
      purpose: x === "inspection" && ue.length ? "analysis" : x,
      evidenceId: Qe,
      durationMs: performance.now() - _
    };
    Xe(Dt), Ar({
      id: Qe,
      projectId: P.project.id,
      chatId: h,
      promptId: v,
      kind: Ff(R),
      status: "success",
      sourceHashes: z,
      skillHashes: B,
      sourceSkillKey: Si(z, B),
      executionId: J.id,
      summary: `Successful ${x} execution; preview and generated-file metadata are reusable`,
      payload: ms({
        stdout: le.stdout,
        preview: le.preview,
        generatedFiles: ue.map((he) => ({
          id: he.id,
          name: he.name,
          sha256: he.sha256,
          size: he.size,
          type: he.type
        }))
      }),
      createdAt: te()
    });
    const De = JSON.stringify(le.modelPayload);
    if (Ai({
      id: Le(),
      projectId: P.project.id,
      chatId: h,
      executionId: J.id,
      categories: ["bounded-preview", "generated-file-metadata", ...le.modelPayload.stderr ? ["error"] : []],
      byteLength: new TextEncoder().encode(De).byteLength,
      payload: De,
      createdAt: te()
    }), !qe.length) {
      const he = y.current;
      for (const Pe of (he == null ? void 0 : he.executions) || []) {
        if (Pe.chatId !== h || Pe.promptId !== v || !Pe.missingPlotCsv.length) continue;
        const ct = Pe.missingPlotCsv.filter(
          (bn) => !Lt.current.has(bn.replace(/\.(png|svg)$/i, ".csv"))
        );
        ct.length !== Pe.missingPlotCsv.length && Xe({
          ...Pe,
          status: ct.length ? "incomplete" : "success",
          missingPlotCsv: ct
        });
      }
    }
    return re("Python completed locally; continuing the analysis…"), C(qe.length ? "repairing" : "checking"), qe.length ? yt(
      `Plot data CSV required. Create ${qe.map((he) => he.replace(/\.(png|svg)$/i, ".csv")).join(", ")} containing the data used for the plot. Do not regenerate unrelated analysis.`
    ) : JSON.stringify({
      ok: !0,
      evidence_id: Qe,
      execution_id: J.id,
      ...le.modelPayload
    }).slice(0, tr);
  }
  async function Es(l, h, v) {
    let j = {};
    try {
      j = JSON.parse(l.function.arguments || "{}");
    } catch (_) {
      return yt(`Invalid JSON tool arguments: ${String(_)}`);
    }
    const x = y.current;
    if (!x) return yt("Project is not ready");
    if (l.function.name === "discover_skills") {
      const _ = _e.current;
      if (!_)
        return yt(
          Ae || "No workflow skill catalog is available"
        );
      const R = Fu(
        _,
        x.files,
        de
      ).map((z) => ({
        workflow_key: Mf(z.entry),
        name: z.skill.name,
        description: z.skill.description,
        purpose: z.skill.purpose,
        version: z.skill.version,
        score: z.score,
        reasons: z.reasons,
        references_are_progressive: !0,
        source: {
          repository_url: z.entry.source.repository_url,
          configured_ref: z.entry.source.configured_ref,
          resolved_commit: z.entry.source.resolved_commit,
          sha256: z.skill.sha256,
          status: z.entry.status
        }
      })), Q = (_.applications || []).flatMap(
        (z) => z.skills.map((B) => ({
          workflow_key: Mf(z),
          name: B.name,
          description: B.description,
          purpose: B.purpose,
          version: B.version,
          score: 0,
          reasons: [
            "Optional application operation; load only when the user explicitly asks to show, open, or render compatible data."
          ],
          references_are_progressive: !0,
          source: {
            repository_url: z.source.repository_url,
            configured_ref: z.source.configured_ref,
            resolved_commit: z.source.resolved_commit,
            sha256: B.sha256,
            status: z.status
          }
        }))
      );
      return JSON.stringify([...R, ...Q]).slice(0, tr);
    }
    if (l.function.name === "load_skill") {
      if (typeof j.workflow_key != "string" || typeof j.skill_name != "string")
        return yt("load_skill requires workflow_key and skill_name");
      try {
        const _ = await vo(
          j.workflow_key,
          j.skill_name
        ), R = zf(_);
        xt.current.some(
          (B) => B.workflowKey === R.workflowKey && B.name === R.name && B.sha256 === R.sha256
        ) || (xt.current = [...xt.current, R]);
        const Q = typeof j.resource == "string" && j.resource ? j.resource : "SKILL.md", z = _.files.find((B) => B.path === Q);
        return z ? JSON.stringify({
          workflow_key: _.source.workflow_key,
          skill_name: _.skill.name,
          version: _.skill.version,
          configured_ref: _.source.configured_ref,
          resolved_commit: _.source.resolved_commit,
          sha256: _.skill.sha256,
          resource: Q,
          content: z.content.slice(0, tr - 4096),
          available_resources: _.files.map((B) => B.path)
        }) : yt(
          `Resource ${Q} is unavailable. Available resources: ` + _.files.map((B) => B.path).join(", ")
        );
      } catch (_) {
        return yt(_);
      }
    }
    if (l.function.name === "open_zarr_view" || l.function.name === "render_zarr_roi" || l.function.name === "render_zarr_gallery")
      try {
        return l.function.name === "render_zarr_gallery" ? await Ho(j, h, v) : await _s(
          j,
          h,
          v,
          l.function.name === "render_zarr_roi"
        );
      } catch (_) {
        return re(`ZarrViewer request needs correction: ${String(_)}`), C("repairing"), JSON.stringify({
          ok: !1,
          recoverable: !0,
          error: String(_ instanceof Error ? _.message : _),
          instruction: "Inspect the measurement database again and correct the UUID, field, dimensions, coordinates, channels, or label information. Do not invent an OMERO ID or URL."
        }).slice(0, tr);
      }
    if (l.function.name === "list_workspace_files") return Wf(x.files);
    if (l.function.name === "reset_python")
      try {
        return await a.beginTurn(), Lt.current.clear(), "Python state reset; canonical project inputs remain available.";
      } catch (_) {
        return yt(_);
      }
    if (l.function.name === "list_saved_scripts")
      return JSON.stringify(x.scripts.filter((_) => !_.deletedAt).map((_) => ({
        id: _.id,
        name: _.name,
        description: _.description,
        current_version: _.currentVersion,
        updated_at: _.updatedAt
      })));
    if (l.function.name === "read_saved_script") {
      const _ = x.scripts.find((Q) => Q.id === j.script_id && !Q.deletedAt);
      if (!_) return yt("Saved script was not found");
      const R = _.versions.find((Q) => Q.version === _.currentVersion);
      return R ? JSON.stringify({ id: _.id, name: _.name, version: R.version, code: R.code }) : yt("Saved script has no readable current version");
    }
    if (l.function.name === "run_saved_script") {
      const _ = x.scripts.find((Q) => Q.id === j.script_id && !Q.deletedAt), R = _ == null ? void 0 : _.versions.find((Q) => Q.version === _.currentVersion);
      if (!_ || !R) return yt("Saved script was not found");
      try {
        const Q = ki(R.code, x.files), { executionResult: z, renderResult: B } = await yo(
          _,
          R,
          Q.code,
          h,
          v
        );
        return JSON.stringify({
          execution: JSON.parse(z),
          render_replayed: !!B,
          render: B ? JSON.parse(B) : void 0
        }).slice(0, tr);
      } catch (Q) {
        return yt(Q);
      }
    }
    if (l.function.name === "list_saved_workflows")
      return JSON.stringify(x.workflows.filter((_) => !_.deletedAt).map((_) => ({
        id: _.id,
        name: _.name,
        description: _.description,
        version: _.version,
        steps: _.steps.map((R) => R.name)
      })));
    if (l.function.name === "run_saved_workflow") {
      const _ = x.workflows.find(
        (z) => z.id === j.workflow_id && !z.deletedAt
      );
      if (!_) return yt("Saved workflow was not found");
      const R = [];
      let Q = 0;
      for (const z of _.steps) {
        const B = y.current, G = B.scripts.find((J) => J.id === z.scriptId && !J.deletedAt), H = G == null ? void 0 : G.versions.find((J) => J.version === z.scriptVersion);
        if (!G || !H) return yt(`Workflow step ${z.name} is unavailable`);
        try {
          await a.beginTurn();
          const J = ki(H.code, B.files), le = await yo(
            G,
            H,
            J.code,
            h,
            v
          );
          R.push(le.executionResult), le.renderResult && (Q += 1);
        } catch (J) {
          return yt(`Workflow step ${z.name} failed: ${String(J)}`);
        }
      }
      return JSON.stringify({
        workflow: _.name,
        steps: _.steps.length,
        renders: Q,
        results: R
      }).slice(0, tr);
    }
    if (l.function.name !== "run_python" || typeof j.code != "string")
      return yt(`Unsupported or invalid tool call: ${l.function.name}`);
    const P = j.purpose === "analysis" ? "analysis" : "inspection";
    return Ve(j.code, h, v, !1, P);
  }
  async function Cs() {
    var ct, bn, Ts, Rs, Os, Ms, zs, Ls, Fs, Go;
    const l = Ie.trim(), h = y.current, v = h == null ? void 0 : h.chats.find((Ue) => Ue.id === h.project.activeChatId);
    if (!l || !Vn || !h || !v) return;
    Be(""), me(!0), C("planning");
    const j = performance.now();
    let x = !1;
    Jt.current = new AbortController(), Lt.current.clear(), await a.beginTurn(), xt.current = [];
    const P = [];
    let _ = "";
    const R = /\b(show|render|view|open|gallery|montage|image|field|well|contour|mask|overlay|png)\b/i.test(l), Q = Fu(
      _e.current,
      h.files,
      de
    );
    if (Q.length) {
      const Ue = Q[0];
      try {
        const Je = await vo(
          Ue.entry.source.workflow_key,
          Ue.skill.name
        );
        P.push(Je);
      } catch (Je) {
        _ = `Workflow-specific guidance unavailable: ${String(Je)}`;
      }
    }
    if (R && (se != null && se.available)) {
      const Ue = (((ct = _e.current) == null ? void 0 : ct.applications) || []).flatMap((Je) => Je.skills.map((pt) => ({ entry: Je, skill: pt }))).find(
        ({ skill: Je }) => {
          var pt;
          return ((pt = Je.required_capabilities) == null ? void 0 : pt.some(
            (Pn) => Pn === "zarr-render-v2" || Pn === "zarr-gallery-v1"
          )) || /zarr.*viewer/i.test(Je.name);
        }
      );
      if (Ue)
        try {
          const Je = await vo(
            Ue.entry.source.workflow_key,
            Ue.skill.name
          );
          P.some((pt) => pt.skill.sha256 === Je.skill.sha256) || P.push(Je);
        } catch (Je) {
          _ = [
            _,
            `ZarrViewer operation guidance unavailable: ${String(Je)}`
          ].filter(Boolean).join(" ");
        }
    }
    xt.current = P.map(zf);
    const z = P.map((Ue) => {
      const Je = py(Ue);
      if (!R) return Je;
      const pt = Ue.files.find(
        (Pn) => /(^|\/)PNG_QUESTIONS\.md$/i.test(Pn.path)
      );
      return pt ? `${Je}

PNG question and rendering reference ${pt.path}:
${pt.content}` : Je;
    }).join(`

---

`), B = ji(h), G = xt.current.map((Ue) => Ue.sha256).sort(), H = Du(h.evidence, v.id, B, G), J = Le(), le = {
      id: J,
      role: "user",
      content: l,
      workflowSkills: xt.current,
      createdAt: te()
    };
    Ft(v.id, le);
    let ue = {
      ...v,
      messages: [...v.messages, le],
      updatedAt: te()
    };
    v.messages.filter((Ue) => Ue.role === "user").length === 0 && (ue = { ...ue, title: Vf(l) }, fr(ue));
    const qe = O.contextWindow > 0 ? Math.floor(O.contextWindow * 0.6) : 24e3, Qe = ue.messages.filter((Ue) => Ue.kind !== "execution");
    Uu(Qe) > qe && (ue = { ...ue, summary: Py(Qe), updatedAt: te() }, fr(ue), re("Older conversation context was compacted; pinned items and the latest six exchanges were retained"));
    const Dt = `${zh}

Project root: ${h.project.rootPath}
Exact current project files (already discovered; do not call list_workspace_files):
${Wf(h.files)}

${my(H)}

The user has ${h.scripts.filter((Ue) => !Ue.deletedAt).length} saved scripts. ${h.project.plotCsv ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data." : "Plot CSV mode is OFF."}
${se != null && se.available ? `OMERO ZarrViewer ${se.version} is available. Use its tools only for an explicit request to show, open, or render an image, field, object, or focus; derive every navigation value from the measurement database.` : `OMERO ZarrViewer tools are unavailable in this deployment. ${ie}`}

${z || (_ || Ae ? `No specialized workflow skill was loaded. ${_ || Ae}` : "No compatible specialized workflow skill matched; use generic schema-first analysis.")}

Efficiency contract: answer an initial most-foci request within four tool rounds and a follow-up
render within two tool rounds. Do not repeat schema discovery while the listed source and skill
hashes are unchanged. Reuse matching evidence IDs and verified rows from the ledger.`, De = new Set(ue.pinnedMessageIds || []), he = [
      ...Qe.filter((Ue) => De.has(Ue.id)),
      ...Qe.slice(-12)
    ].filter(
      (Ue, Je, pt) => pt.findIndex((Pn) => Pn.id === Ue.id) === Je
    ), Pe = [
      { role: "system", content: Dt },
      ...ue.summary ? [{ role: "system", content: `Earlier conversation summary:
${ue.summary}` }] : [],
      ...he.map((Ue) => ({ role: Ue.role, content: Ue.content }))
    ];
    ((bn = Pe.at(-1)) == null ? void 0 : bn.content) !== l && Pe.push({ role: "user", content: l });
    try {
      const Ue = [
        ...Kf.filter(
          (Je) => Je.function.name !== "discover_skills" && Je.function.name !== "list_workspace_files"
        ),
        ...se != null && se.available ? Lh : []
      ];
      for (let Je = 0; Je <= gp; Je += 1) {
        const pt = Sy(Je, Ue);
        pt.finalSynthesis && (Pe.push({
          role: "system",
          content: jy
        }), C("checking"));
        const Pn = Uu(Pe), Ds = performance.now(), Or = await rm(
          O,
          Pe,
          Jt.current.signal,
          (en) => ee(en),
          pt.tools
        ), fn = (Ts = Or.choices[0]) == null ? void 0 : Ts.message;
        if (!fn) throw new Error("AmsterdamUMC returned no response");
        const Mr = performance.now() - Ds, Us = ((Rs = Or.usage) == null ? void 0 : Rs.prompt_tokens) ?? Pn, Bs = ((Os = Or.usage) == null ? void 0 : Os.completion_tokens) ?? Uu(fn.content || fn.tool_calls || ""), Vs = ((Ms = Or.usage) == null ? void 0 : Ms.total_tokens) ?? Us + Bs;
        if (oo((en) => ({
          promptTokens: Us,
          completionTokens: Bs,
          totalTokens: Vs,
          sessionTokens: ((en == null ? void 0 : en.sessionTokens) || 0) + Vs,
          estimated: !Or.usage
        })), Pe.push({ role: "assistant", content: fn.content, tool_calls: fn.tool_calls }), fn.content) {
          const en = (((zs = y.current) == null ? void 0 : zs.executions) || []).filter((zr) => zr.promptId === J).map((zr) => zr.id);
          Ft(v.id, {
            id: Le(),
            role: "assistant",
            content: fn.content,
            citationIds: en,
            workflowSkills: xt.current,
            activity: x ? "worked" : "thought",
            durationMs: x ? performance.now() - j : Mr,
            createdAt: te()
          });
        }
        if (ee(""), !((Ls = fn.tool_calls) != null && Ls.length)) break;
        if (pt.finalSynthesis)
          throw new Error("AmsterdamUMC attempted another tool call during final synthesis");
        x = !0, C(Je ? "repairing" : "running");
        for (const en of fn.tool_calls) {
          const zr = await Es(en, v.id, J);
          Pe.push({ role: "tool", tool_call_id: en.id, content: zr });
        }
        C("checking");
      }
    } catch (Ue) {
      (Fs = Jt.current) != null && Fs.signal.aborted || Ft(v.id, {
        id: Le(),
        role: "assistant",
        content: String(Ue),
        kind: "error",
        activity: x ? "worked" : "thought",
        durationMs: performance.now() - j,
        createdAt: te()
      });
    } finally {
      (Go = Jt.current) != null && Go.signal.aborted || re("Ready — analysis runs locally in this browser"), Jt.current = null, ee(""), C("ready"), me(!1), Cr(await Fa());
    }
  }
  function $i() {
    var l, h;
    (l = Jt.current) == null || l.abort(), a.stop(), me(!1), Gt(((h = y.current) == null ? void 0 : h.files) || [], "Ready — analysis runs locally in this browser");
  }
  async function bs(l) {
    var Qe, Dt;
    const h = y.current;
    if (!h || !["success", "reused"].includes(l.status)) return;
    const v = h.chats.find((De) => De.id === l.chatId), j = v == null ? void 0 : v.messages.find((De) => De.id === l.promptId), x = h.executions.filter(
      (De) => De.chatId === l.chatId && De.promptId === l.promptId && ["success", "reused"].includes(De.status)
    ).sort((De, he) => De.createdAt.localeCompare(he.createdAt)), P = x.filter((De) => De.purpose !== "inspection"), _ = P.length ? P : x.filter((De) => De.purpose === "inspection");
    if (l.purpose === "inspection" && P.length) return;
    const R = Array.from(new Set(_.map((De) => De.code))).join(
      `

# Continued analysis / automatic repair
`
    ) || l.code, Q = await Zt(R), z = Df(
      h.artifacts,
      h.files,
      {
        chatId: l.chatId,
        promptId: l.promptId,
        executionIds: _.map((De) => De.id)
      }
    ) || Vf((j == null ? void 0 : j.content) || "Analysis script"), B = `${on(z)}-analysis.py`, G = (Qe = await c.askText(
      "Script filename",
      B,
      "Scripts are versioned and can be copied to compatible OMERO projects."
    )) == null ? void 0 : Qe.trim();
    if (!G) return;
    const H = `${on(G.replace(/\.py$/i, ""))}.py`, J = ((Dt = await c.askText(
      "Script title",
      z,
      "Suggested from the generated graph or image title."
    )) == null ? void 0 : Dt.trim()) || "", le = h.scripts.find(
      (De) => !De.deletedAt && De.name.toLowerCase() === H.toLowerCase()
    ), ue = le ? {
      ...le,
      description: J,
      currentVersion: le.currentVersion + 1,
      versions: [...le.versions, {
        version: le.currentVersion + 1,
        code: R,
        codeHash: Q,
        executionId: l.id,
        createdAt: te()
      }],
      updatedAt: te()
    } : {
      id: Le(),
      projectId: h.project.id,
      name: H,
      description: J,
      inputContract: Da(R),
      parameters: [],
      currentVersion: 1,
      versions: [{
        version: 1,
        code: R,
        codeHash: Q,
        executionId: l.id,
        createdAt: te()
      }],
      createdAt: te(),
      updatedAt: te()
    };
    ue.inputContract = Da(R);
    const qe = y.current;
    if (qe) {
      const De = {
        ...qe,
        scripts: le ? qe.scripts.map((he) => he.id === ue.id ? ue : he) : [...qe.scripts, ue]
      };
      y.current = De, p(De);
    }
    await zo(ue), re(`Saved ${ue.name} version ${ue.currentVersion}`);
  }
  async function Ps(l, h) {
    var j, x;
    const v = y.current;
    if (v)
      try {
        const P = gy(l, h, v.executions, v.evidence), _ = Df(
          [l],
          [h],
          {
            chatId: l.chatId,
            promptId: l.promptId
          }
        ) || l.title || h.name.replace(/\.png$/i, "") || "Zarr render", R = (j = await c.askText(
          "Script filename",
          `${on(_)}-analysis.py`,
          "The analysis, render recipe, PNG, and provenance will be saved together."
        )) == null ? void 0 : j.trim();
        if (!R) return;
        const Q = `${on(R.replace(/\.py$/i, ""))}.py`, z = (x = await c.askText(
          "Script title",
          _,
          "Suggested from the rendered image or gallery title."
        )) == null ? void 0 : x.trim();
        if (!z) return;
        const B = on(Q.replace(/\.py$/i, "").replace(/-analysis$/i, "")), G = v.scripts.find(
          (Pe) => !Pe.deletedAt && Pe.name.toLowerCase() === Q.toLowerCase()
        ), H = ((G == null ? void 0 : G.currentVersion) || 0) + 1, J = await Zt(P.code), le = G ? {
          ...G,
          description: z,
          currentVersion: H,
          inputContract: Da(P.code),
          versions: [...G.versions, {
            version: H,
            code: P.code,
            codeHash: J,
            executionId: P.execution.id,
            renderRecipe: P.recipe,
            createdAt: te()
          }],
          updatedAt: te()
        } : {
          id: Le(),
          projectId: v.project.id,
          name: Q,
          description: z,
          currentVersion: H,
          inputContract: Da(P.code),
          parameters: [],
          versions: [{
            version: H,
            code: P.code,
            codeHash: J,
            executionId: P.execution.id,
            renderRecipe: P.recipe,
            createdAt: te()
          }],
          createdAt: te(),
          updatedAt: te()
        }, ue = new TextEncoder().encode(`${JSON.stringify(P.recipe, null, 2)}
`), qe = new TextEncoder().encode(`${JSON.stringify(P.manifest, null, 2)}
`), Qe = [
          {
            name: `${B}-v${H}-render-recipe.json`,
            type: "application/json",
            data: ue
          },
          {
            name: `${B}-v${H}-evidence-manifest.json`,
            type: "application/json",
            data: qe
          },
          {
            name: `${B}-v${H}.zip`,
            type: "application/zip",
            data: P.archive
          }
        ], Dt = [];
        for (const Pe of Qe) {
          const ct = Pe.data.buffer.slice(
            Pe.data.byteOffset,
            Pe.data.byteOffset + Pe.data.byteLength
          );
          Dt.push({
            id: Le(),
            projectId: v.project.id,
            chatId: l.chatId,
            name: Pe.name,
            logicalPath: `${v.project.rootPath}/chats/${l.chatId}/outputs/render-bundles/${Pe.name}`,
            type: Pe.type,
            size: Pe.data.byteLength,
            sha256: await Zt(ct),
            source: "result",
            state: "ready",
            data: ct,
            createdAt: te()
          });
        }
        const De = y.current;
        if (!De) return;
        const he = {
          ...De,
          scripts: G ? De.scripts.map((Pe) => Pe.id === le.id ? le : Pe) : [...De.scripts, le]
        };
        y.current = he, p(he), await zo(le), Xt(Dt), En(`${B}-v${H}.zip`, P.archive, "application/zip"), re(
          `Saved ${le.name} version ${H}, render recipe, provenance manifest, PNG, and downloadable ZIP`
        );
      } catch (P) {
        re(`Could not save analysis + render: ${String(P)}`);
      }
  }
  async function Ni(l) {
    const h = y.current;
    if (!(h != null && h.project.activeChatId)) return;
    const v = l.versions.find((P) => P.version === l.currentVersion);
    if (!v) return;
    let j;
    try {
      j = ki(v.code, h.files);
    } catch (P) {
      re(`Cannot bind ${l.name}: ${String(P)}`);
      return;
    }
    me(!0), Lt.current.clear(), await a.beginTurn();
    const x = Le();
    Ft(h.project.activeChatId, {
      id: x,
      role: "user",
      content: `Run saved script ${l.name} version ${l.currentVersion}` + (j.bindings.length ? ` with project input binding ${j.bindings.map((P) => `${P.from} → ${P.to}`).join(", ")}` : ""),
      createdAt: te()
    });
    try {
      const { renderResult: P } = await yo(
        l,
        v,
        j.code,
        h.project.activeChatId,
        x
      );
      re(
        P ? `Ran ${l.name} locally and rendered its PNG gallery` : `Ran ${l.name} locally`
      );
    } catch (P) {
      re(`Could not complete ${l.name}: ${String(P)}`);
    } finally {
      me(!1);
    }
  }
  async function Ti(l) {
    var x;
    const h = (x = await c.askText("Rename script", l.name)) == null ? void 0 : x.trim();
    if (!h) return;
    const v = { ...l, name: `${on(h.replace(/\.py$/i, ""))}.py`, updatedAt: te() }, j = y.current;
    if (j) {
      const P = {
        ...j,
        scripts: j.scripts.map((_) => _.id === l.id ? v : _)
      };
      y.current = P, p(P);
    }
    zo(v);
  }
  async function qo(l) {
    if (!await c.confirm(
      "Delete saved script?",
      `${l.name} and all of its versions will be moved out of the active project.`,
      "Delete script",
      !0
    ))
      return;
    const h = y.current;
    if (!h) return;
    const v = { ...l, deletedAt: te(), updatedAt: te() }, j = {
      ...h,
      scripts: h.scripts.map((x) => x.id === l.id ? v : x)
    };
    y.current = j, p(j), Er((x) => {
      const P = new Set(x);
      return P.delete(l.id), P;
    }), await zo(v), re(`Moved script ${l.name} to trash`);
  }
  function Wn(l) {
    Er((h) => {
      const v = new Set(h);
      return v.has(l) ? v.delete(l) : v.add(l), v;
    });
  }
  function Hn(l) {
    Fn((h) => {
      const v = new Set(h);
      return v.has(l) ? v.delete(l) : v.add(l), v;
    });
  }
  function qn() {
    const l = dr.map((v) => v.id), h = l.length > 0 && l.every((v) => zt.has(v));
    Fn((v) => {
      const j = new Set(v);
      return l.forEach((x) => {
        h ? j.delete(x) : j.add(x);
      }), j;
    });
  }
  async function Tr(l) {
    const h = y.current;
    if (!h) return;
    const v = new Set(l), j = h.files.filter(
      (z) => v.has(z.id) && z.source === "result" && z.chatId === h.project.activeChatId && !z.deletedAt
    );
    if (!j.length) return;
    const x = j.slice(0, 5).map((z) => z.name), P = j.length - x.length, _ = j.length === 1 ? `${j[0].name} will be hidden, while its provenance record remains intact.` : [
      `${j.length} outputs will be moved to project trash. Their provenance records remain intact.`,
      x.join(", ") + (P > 0 ? `, and ${P} more` : "")
    ].join(`

`);
    if (!await c.confirm(
      j.length === 1 ? "Move output to trash?" : `Move ${j.length} outputs to trash?`,
      _,
      "Move to trash",
      !0
    )) return;
    const R = te(), Q = Cy(
      h,
      j.map((z) => z.id),
      R
    );
    y.current = Q, p(Q), Fn((z) => {
      const B = new Set(z);
      return j.forEach((G) => B.delete(G.id)), B;
    }), Me && j.some((z) => z.id === Me) && be(null), await Promise.all(
      Q.files.filter((z) => v.has(z.id) && z.deletedAt === R).map(gi)
    ), re(
      j.length === 1 ? `Moved ${j[0].name} to project trash` : `Moved ${j.length} outputs to project trash`
    );
  }
  async function Rr() {
    var G, H;
    const l = y.current;
    if (!l) return;
    const h = l.scripts.filter((J) => !J.deletedAt && Ln.has(J.id));
    if (h.length < 2) {
      re("Select at least two scripts to combine");
      return;
    }
    const v = on(h.map((J) => J.name.replace(/\.py$/i, "")).join("-")), j = (G = await c.askText(
      "Workflow name",
      v,
      "The selected scripts will become isolated, ordered workflow steps."
    )) == null ? void 0 : G.trim();
    if (!j) return;
    const x = on(j);
    let P = x, _ = 2;
    for (; l.workflows.some(
      (J) => !J.deletedAt && J.name.toLowerCase() === P.toLowerCase()
    ); )
      P = `${x}-${_}`, _ += 1;
    const R = ((H = await c.askText(
      "Workflow description",
      `Runs ${h.map((J) => J.name).join(", ")} in sequence`
    )) == null ? void 0 : H.trim()) || "", Q = te(), z = {
      id: Le(),
      projectId: l.project.id,
      name: P,
      description: R,
      version: 1,
      steps: h.map((J) => ({
        id: Le(),
        scriptId: J.id,
        scriptVersion: J.currentVersion,
        name: J.name,
        inputBindings: {},
        parameters: {}
      })),
      createdAt: Q,
      updatedAt: Q
    }, B = { ...l, workflows: [...l.workflows, z] };
    y.current = B, p(B), Er(/* @__PURE__ */ new Set()), await La(z), re(`Created workflow ${z.name} with ${h.length} isolated steps`);
  }
  async function dn(l) {
    const h = y.current;
    if (!(h != null && h.project.activeChatId) || Re) return;
    me(!0);
    const v = performance.now(), j = h.project.activeChatId, x = Le();
    Ft(j, {
      id: x,
      role: "user",
      content: `Run workflow ${l.name} version ${l.version}`,
      createdAt: te()
    });
    try {
      let P = h.files.filter(
        (R) => R.source !== "result" && R.state === "ready" && !R.deletedAt
      ), _ = 0;
      for (let R = 0; R < l.steps.length; R += 1) {
        const Q = l.steps[R], B = y.current.scripts.find((ue) => ue.id === Q.scriptId && !ue.deletedAt), G = B == null ? void 0 : B.versions.find((ue) => ue.version === Q.scriptVersion);
        if (!B || !G) throw new Error(`Workflow step ${Q.name} is unavailable`);
        re(`Workflow ${l.name}: step ${R + 1} of ${l.steps.length}`), await a.beginTurn(), Lt.current.clear();
        const H = ki(G.code, P);
        (await yo(
          B,
          G,
          H.code,
          j,
          x
        )).renderResult && (_ += 1);
        const le = y.current.files.filter(
          (ue) => ue.source === "result" && ue.executionId && y.current.executions.some(
            (qe) => qe.id === ue.executionId && qe.promptId === x
          ) && !ue.deletedAt
        );
        P = [...P, ...le], R < l.steps.length - 1 && await a.syncInputs(P);
      }
      await a.syncInputs(h.files.filter(
        (R) => R.source !== "result" && R.state === "ready" && !R.deletedAt
      )), re(
        `Workflow ${l.name} completed` + (_ ? ` and rendered ${_} PNG ${_ === 1 ? "image" : "images"}` : "")
      );
    } catch (P) {
      Ft(j, {
        id: Le(),
        role: "assistant",
        content: `Workflow stopped: ${String(P)}`,
        kind: "error",
        activity: "worked",
        durationMs: performance.now() - v,
        createdAt: te()
      }), re(`Workflow ${l.name} failed`);
    } finally {
      me(!1);
    }
  }
  async function As(l) {
    if (!await c.confirm(
      "Delete workflow?",
      `${l.name} will be moved to project trash. Its source scripts remain available.`,
      "Delete workflow",
      !0
    )) return;
    const h = y.current;
    if (!h) return;
    const v = { ...l, deletedAt: te(), updatedAt: te() }, j = {
      ...h,
      workflows: h.workflows.map((x) => x.id === l.id ? v : x)
    };
    y.current = j, p(j), await La(v), re(`Moved workflow ${l.name} to project trash`);
  }
  async function Is(l) {
    const h = { ...l, deletedAt: void 0 };
    Xt([h]), await gi(h), re(`Restored ${l.name}`);
  }
  async function go(l) {
    const h = y.current;
    if (!h) return;
    const v = { ...l, deletedAt: void 0, updatedAt: te() }, j = {
      ...h,
      scripts: h.scripts.map((x) => x.id === l.id ? v : x)
    };
    y.current = j, p(j), await zo(v);
  }
  async function rl(l) {
    const h = y.current;
    if (!h) return;
    const v = { ...l, deletedAt: void 0, updatedAt: te() }, j = {
      ...h,
      workflows: h.workflows.map((x) => x.id === l.id ? v : x)
    };
    y.current = j, p(j), await La(v), re(`Restored workflow ${l.name}`);
  }
  async function Ri(l) {
    const h = y.current;
    if (!h || !i.canUpload) return;
    const v = new Set(l.steps.map((_) => _.scriptId)), j = {
      format: "nl.bioimaging.analysis.workflow.v1",
      exportedAt: te(),
      workflow: l,
      scripts: h.scripts.filter((_) => !_.deletedAt && v.has(_.id))
    }, x = `${on(l.name)}.oa-workflow.json`, P = await i.uploadWorkflowTemplate(
      x,
      new TextEncoder().encode(JSON.stringify(j, null, 2))
    );
    Y((_) => [..._, P]), re(`Published workflow template as FileAnnotation ${P.annotation_id}`);
  }
  async function wo(l) {
    const h = y.current;
    if (h)
      try {
        const v = JSON.parse(
          new TextDecoder().decode(await i.downloadWorkflowTemplate(l))
        );
        if (v.format !== "nl.bioimaging.analysis.workflow.v1" || !v.workflow || !Array.isArray(v.scripts)) throw new Error("Unsupported workflow template");
        const j = /* @__PURE__ */ new Map(), x = v.scripts.map((R) => {
          const Q = Le();
          return j.set(R.id, Q), {
            ...R,
            id: Q,
            projectId: h.project.id,
            name: `${R.name.replace(/\.py$/i, "")}-template.py`,
            createdAt: te(),
            updatedAt: te()
          };
        }), P = {
          ...v.workflow,
          id: Le(),
          projectId: h.project.id,
          name: `${v.workflow.name}-template`,
          steps: v.workflow.steps.map((R) => ({
            ...R,
            id: Le(),
            scriptId: j.get(R.scriptId) || R.scriptId
          })),
          createdAt: te(),
          updatedAt: te()
        };
        await Promise.all([...x.map(zo), La(P)]);
        const _ = {
          ...h,
          scripts: [...h.scripts, ...x],
          workflows: [...h.workflows, P]
        };
        y.current = _, p(_), re(`Imported workflow template ${P.name}`);
      } catch (v) {
        re(`Workflow template import failed: ${String(v)}`);
      }
  }
  async function Oi(l) {
    const h = y.current;
    if (!h || Re) return;
    const v = N.filter((P) => P.id !== h.project.id);
    if (!v.length) {
      re("Open the destination OMERO objects in Analysis once before batch execution");
      return;
    }
    if (!await c.confirm(
      "Batch-run workflow?",
      `${l.name} will run locally on the compatible browser projects for: ${v.map((P) => `${P.objectType} ${P.objectId} (${P.name})`).join(", ")}. Incompatible projects will be skipped.`,
      "Run compatible projects"
    )) return;
    me(!0);
    const j = [], x = [];
    try {
      for (const P of v) {
        const _ = await ps(P.id);
        if (!_) continue;
        const R = [];
        try {
          for (const z of l.steps) {
            const B = h.scripts.find((H) => H.id === z.scriptId && !H.deletedAt), G = B == null ? void 0 : B.versions.find((H) => H.version === z.scriptVersion);
            if (!B || !G) throw new Error(`Missing ${z.name}`);
            R.push({
              script: B,
              version: G,
              code: ki(G.code, _.files).code
            });
          }
        } catch {
          x.push(P.name);
          continue;
        }
        const Q = performance.now();
        try {
          const z = Za(_.project.id, `${l.name} batch run`);
          _.project = { ..._.project, activeChatId: z.id, updatedAt: te() }, _.chats = [..._.chats, z], y.current = _, p(_), await a.syncInputs(_.files.filter(
            (G) => G.source !== "result" && G.state === "ready" && !G.deletedAt
          ));
          const B = Le();
          Ft(z.id, {
            id: B,
            role: "user",
            content: `Batch run workflow ${l.name} on ${P.objectType} ${P.objectId}`,
            createdAt: te()
          });
          for (const G of R)
            await a.beginTurn(), Lt.current.clear(), await yo(
              G.script,
              G.version,
              G.code,
              z.id,
              B
            );
          await nr(y.current), j.push(P.name);
        } catch (z) {
          const B = y.current;
          if ((B == null ? void 0 : B.project.id) === _.project.id) {
            const G = B.chats.find((H) => H.id === B.project.activeChatId);
            G && (Ft(G.id, {
              id: Le(),
              role: "assistant",
              kind: "error",
              content: `Batch workflow failed for this object: ${String(z)}`,
              activity: "worked",
              durationMs: performance.now() - Q,
              createdAt: te()
            }), await nr(y.current));
          }
          x.push(P.name);
        }
      }
    } finally {
      y.current = h, p(h), await a.syncInputs(h.files.filter(
        (P) => P.source !== "result" && P.state === "ready" && !P.deletedAt
      )), me(!1);
    }
    re(
      `Batch workflow completed for ${j.length} project(s)` + (x.length ? `; incompatible: ${x.join(", ")}` : "")
    );
  }
  function Mi(l) {
    const h = l || Array.from(Ln);
    if (!h.length) {
      re("Select one or more scripts to copy");
      return;
    }
    Er(new Set(h));
    const v = N.find((j) => j.id !== (Ne == null ? void 0 : Ne.id));
    if (!v) {
      re("Open another OMERO Dataset, Screen, Plate, or Image once before copying scripts to it");
      return;
    }
    xs(v.id), sr(!0);
  }
  async function ko() {
    const l = y.current;
    if (!l || !Dn) return;
    const h = await ps(Dn);
    if (!h) {
      re("The destination project is no longer available");
      return;
    }
    const v = l.scripts.filter((R) => !R.deletedAt && Ln.has(R.id));
    if (!v.length) return;
    const j = /* @__PURE__ */ new Map();
    for (const R of v) {
      const Q = R.versions.find((z) => z.version === R.currentVersion);
      if (Q)
        try {
          const z = ki(Q.code, h.files);
          j.set(
            R.id,
            Object.fromEntries(z.bindings.map((B) => [B.from, B.to]))
          );
        } catch (z) {
          re(`Copy blocked by compatibility preflight for ${R.name}: ${String(z)}`);
          return;
        }
    }
    const x = new Set(h.scripts.filter((R) => !R.deletedAt).map((R) => R.name.toLowerCase())), P = [];
    for (const R of v) {
      const Q = R.name.replace(/\.py$/i, "");
      let z = R.name, B = 2;
      for (; x.has(z.toLowerCase()); )
        z = `${Q}-copy-${B}.py`, B += 1;
      x.add(z.toLowerCase());
      const G = te();
      P.push({
        ...R,
        id: Le(),
        projectId: h.project.id,
        name: z,
        description: `${R.description}${R.description ? " · " : ""}Copied from ${l.project.name}`,
        projectBindings: {
          ...R.projectBindings || {},
          [h.project.id]: j.get(R.id) || {}
        },
        versions: R.versions.map((H) => ({
          ...H,
          executionId: ""
        })),
        createdAt: G,
        updatedAt: G
      });
    }
    if (await Promise.all(P.map(zo)), h.project.id === l.project.id) {
      const R = { ...l, scripts: [...l.scripts, ...P] };
      y.current = R, p(R);
    }
    sr(!1);
    const _ = N.find((R) => R.id === h.project.id);
    re(
      `Copied ${P.length} script${P.length === 1 ? "" : "s"} to ${(_ == null ? void 0 : _.name) || "the destination project"}. When run there, the scripts use that project's current inputs.`
    );
  }
  function En(l, h, v) {
    const j = (h instanceof Uint8Array, h), x = URL.createObjectURL(new Blob([j], { type: v })), P = document.createElement("a");
    P.href = x, P.download = l, P.click(), setTimeout(() => URL.revokeObjectURL(x), 1e3);
  }
  function Kn(l) {
    l.data && En(l.name, l.data, l.type);
  }
  function Ko(l) {
    const h = l.versions.find((v) => v.version === l.currentVersion);
    h && En(l.name, new TextEncoder().encode(h.code), "text/x-python");
  }
  function ol() {
    const l = y.current;
    if (!l) return;
    const h = l.chats.find((x) => x.id === l.project.activeChatId);
    if (!h) return;
    const v = l.executions.filter((x) => x.chatId === h.id), j = [
      `# ${h.title}`,
      "",
      `OMERO object: ${l.project.objectType || "Local"} ${l.project.objectId || ""}`,
      `Project: ${l.project.name}`,
      `Generated: ${te()}`,
      `Runtime: ${Ha}`,
      "",
      "## Inputs",
      ...l.files.filter((x) => x.source !== "result" && !x.deletedAt).map((x) => `- ${x.name} — ${x.sha256} — ${x.size} bytes`),
      "",
      "## Conversation",
      ...h.messages.filter((x) => x.kind !== "execution").flatMap((x) => [
        `### ${x.role}`,
        ...Lu(x.activity, x.durationMs) ? [`_${Lu(x.activity, x.durationMs)}_`] : [],
        "",
        x.content,
        ""
      ]),
      "## Executions",
      ...v.flatMap((x, P) => [
        `### Run ${P + 1} — ${x.status}`,
        "",
        `Code hash: ${x.codeHash}`,
        `Model: ${x.model}`,
        `Purpose: ${x.purpose || "analysis"}`,
        `Duration: ${rc(x.durationMs) || "not recorded"}`,
        `Inputs: ${x.inputHashes.join(", ")}`,
        "",
        "```python",
        x.code,
        "```",
        ""
      ])
    ];
    En(
      `${on(h.title)}-reproducibility-report.md`,
      new TextEncoder().encode(j.join(`
`)),
      "text/markdown"
    ), re("Downloaded reproducibility report");
  }
  async function $s(l) {
    if (await c.confirm(
      "Attach result to OMERO?",
      `${l.name} will be uploaded and linked directly to the selected OMERO object.`,
      "Attach result"
    ))
      try {
        const h = await i.attach(l);
        re(`Attached ${h.name} as FileAnnotation ${h.annotation_id}`);
      } catch (h) {
        re(`Attach failed: ${String(h)}`);
      }
  }
  async function Zo() {
    var h;
    const l = y.current;
    if (!l) throw new Error("Project is not ready");
    return Wm(
      l,
      ((h = o.context) == null ? void 0 : h.max_snapshot_bytes) ?? Uf
    );
  }
  async function Qo() {
    try {
      const l = await Zo();
      En(l.filename, l.data, "application/zip"), re(
        l.omittedLocalInputs.length ? `Project downloaded; omitted local inputs: ${l.omittedLocalInputs.join(", ")}` : "Complete project downloaded"
      );
    } catch (l) {
      re(`Project export failed: ${String(l)}`);
    }
  }
  async function zi() {
    if (i.canUpload)
      try {
        const l = await Zo();
        if (l.omittedLocalInputs.length && !await c.confirm(
          "Save snapshot without oversized local inputs?",
          `The following files will be omitted and required again after restore: ${l.omittedLocalInputs.join(", ")}`,
          "Save without files"
        )) return;
        const h = await i.uploadSnapshot(l.filename, l.data);
        M((v) => [...v, h]), re(`Saved project snapshot as FileAnnotation ${h.annotation_id}`);
      } catch (l) {
        re(`OMERO project snapshot failed: ${String(l)}`);
      }
  }
  async function Ns(l) {
    var h;
    if (l)
      try {
        const v = ((h = o.context) == null ? void 0 : h.max_snapshot_bytes) ?? Uf;
        if (l.size > v)
          throw new Error(
            `Project archive exceeds the configured ${Math.floor(v / 1024 / 1024)} MiB limit`
          );
        const j = await zu(await l.arrayBuffer(), o.context);
        if (o.context && (j.project.objectType !== o.context.object_type || j.project.objectId !== o.context.object_id))
          throw new Error("Project snapshot belongs to a different OMERO object");
        await nr(j);
        const x = await co(j);
        p(x), y.current = x, w(await _r(o.context)), b(await wi(o.context)), await Gt(x.files, "Imported project restored");
      } catch (v) {
        re(`Project import failed: ${String(v)}`);
      } finally {
        ao.current && (ao.current.value = "");
      }
  }
  async function Cn(l) {
    try {
      re(`Downloading ${l.name}…`);
      const h = await zu(
        await i.downloadSnapshot(l),
        o.context
      );
      if (o.context && (h.project.objectType !== o.context.object_type || h.project.objectId !== o.context.object_id))
        throw new Error("Project snapshot belongs to a different OMERO object");
      await nr(h);
      const v = await co(h);
      p(v), y.current = v, w(await _r(o.context)), b(await wi(o.context)), await Gt(v.files, "OMERO project snapshot restored");
    } catch (h) {
      re(`Snapshot restore failed: ${String(h)}`);
    }
  }
  function Li() {
    Ne && fo({ ...Ne, plotCsv: !Ne.plotCsv, updatedAt: te() });
  }
  function xo(l) {
    const h = [];
    return l.source === "local" && h.push({ label: "Rename", run: () => void mo(l) }), (l.state === "failed" || l.state === "missing") && l.annotationId && h.push({ label: "Retry download", run: () => void cn(l.id) }), l.state === "missing" && l.source === "local" && h.push({
      label: "Reselect file",
      run: () => {
        var v;
        return (v = document.getElementById(`reselect-${l.id}`)) == null ? void 0 : v.click();
      }
    }), h.push({
      label: "Remove from project",
      danger: !0,
      run: () => void Do(l.id)
    }), h;
  }
  function Fi(l) {
    const h = zt.has(l.id) && zt.size > 1 ? Array.from(zt) : [l.id];
    return [
      { label: "Rename", run: () => void mo(l) },
      { label: "Download", run: () => Kn(l) },
      ...i.canUpload ? [{ label: "Attach to OMERO", run: () => void $s(l) }] : [],
      {
        label: h.length > 1 ? `Delete ${h.length} selected outputs` : "Delete output",
        danger: !0,
        run: () => void Tr(h)
      }
    ];
  }
  function jo(l) {
    return [
      { label: "Run", run: () => void Ni(l) },
      { label: "Rename", run: () => void Ti(l) },
      { label: "Download", run: () => Ko(l) },
      { label: "Copy to another project…", run: () => Mi([l.id]) },
      { label: "Delete script", danger: !0, run: () => void qo(l) }
    ];
  }
  function So(l) {
    return [{
      label: "Resume as new project",
      run: () => void Cn(l)
    }];
  }
  if (!d || !Ne || !Ge)
    return /* @__PURE__ */ f.jsx("main", { className: "app-shell", children: /* @__PURE__ */ f.jsx("div", { className: "boot-message", children: _i }) });
  const Jo = so.quota ? Math.round(so.usage / so.quota * 100) : 0, Nt = Fu(
    je,
    d.files,
    de
  ), pr = ty(
    je,
    Ae,
    Nt.map(
      (l) => `${l.entry.source.workflow_key}/${l.skill.name}`
    )
  ) + (se != null && se.available ? `

ZarrViewer ${se.version}: available for explicit image and field requests.` : `

${ie}`), Di = [
    ...(je == null ? void 0 : je.workflows) || [],
    ...(je == null ? void 0 : je.applications) || []
  ].reduce((l, h) => l + h.skills.length, 0);
  return /* @__PURE__ */ f.jsxs("main", { className: "app-shell", children: [
    c.element,
    /* @__PURE__ */ f.jsxs("header", { className: "project-header", children: [
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("h1", { children: "OMERO.Analysis" }),
        /* @__PURE__ */ f.jsx("p", { children: Ne.rootPath })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ f.jsxs("label", { className: "csv-toggle", title: "Require a matching CSV for every generated plot", children: [
          /* @__PURE__ */ f.jsx("input", { type: "checkbox", checked: Ne.plotCsv, onChange: Li }),
          "Plot + CSV"
        ] }),
        /* @__PURE__ */ f.jsx("span", { className: "privacy-badge", children: "Source data stay in this browser" }),
        /* @__PURE__ */ f.jsx(
          "span",
          {
            className: Ae ? "skill-badge warning" : "skill-badge",
            title: pr,
            "aria-label": pr,
            children: !je && Ae ? "Generic guidance" : `${Di} workflow skills`
          }
        ),
        /* @__PURE__ */ f.jsx("button", { onClick: () => ws(!Lo), children: "AI settings" })
      ] })
    ] }),
    Lo && /* @__PURE__ */ f.jsxs("form", { className: "settings-card", onSubmit: (l) => l.preventDefault(), children: [
      /* @__PURE__ */ f.jsx("h2", { children: "AmsterdamUMC" }),
      /* @__PURE__ */ f.jsx("p", { className: "warning", children: "The API key is kept only for this tab unless you explicitly choose to remember it. Remembered keys are stored unencrypted and never included in project snapshots." }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ f.jsx("input", { value: O.model, onChange: (l) => void po({ ...O, model: l.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ f.jsx("input", { type: "password", value: O.apiKey, onChange: (l) => void po({ ...O, apiKey: l.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { className: "remember-key", children: [
        /* @__PURE__ */ f.jsx(
          "input",
          {
            type: "checkbox",
            checked: O.rememberKey,
            onChange: (l) => void po({ ...O, rememberKey: l.target.checked })
          }
        ),
        "Remember this key in this browser profile"
      ] }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Model context window (optional)",
        /* @__PURE__ */ f.jsx("input", { type: "number", min: "0", value: O.contextWindow || "", onChange: (l) => void po({ ...O, contextWindow: Math.max(0, Number(l.target.value) || 0) }) })
      ] }),
      /* @__PURE__ */ f.jsx("p", { children: "Temperature is fixed at 1." }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => void po({ ...O, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "project-toolbar", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "active-project-label", children: [
        /* @__PURE__ */ f.jsx("span", { children: "Project" }),
        /* @__PURE__ */ f.jsx("strong", { children: Ne.name })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Chat",
        /* @__PURE__ */ f.jsxs("select", { value: Ge.id, onChange: (l) => Yt(l.target.value), children: [
          /* @__PURE__ */ f.jsx("optgroup", { label: "Active chats", children: ur.filter((l) => !l.archived).map((l) => /* @__PURE__ */ f.jsx("option", { value: l.id, children: l.title }, l.id)) }),
          ur.some((l) => l.archived) && /* @__PURE__ */ f.jsx("optgroup", { label: "Archived chats", children: ur.filter((l) => l.archived).map((l) => /* @__PURE__ */ f.jsxs("option", { value: l.id, children: [
            l.title,
            " (archived)"
          ] }, l.id)) })
        ] })
      ] }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => void Uo(), children: "New chat" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => void Bo(Ge), children: "Rename chat" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => Ss(Ge), children: "Archive" }),
      /* @__PURE__ */ f.jsxs("details", { className: "project-menu", children: [
        /* @__PURE__ */ f.jsx("summary", { children: "Project actions" }),
        /* @__PURE__ */ f.jsxs("div", { children: [
          /* @__PURE__ */ f.jsx("button", { onClick: () => void _n(Ne), children: "Rename project" }),
          /* @__PURE__ */ f.jsx("button", { onClick: ol, children: "Download reproducibility report" }),
          /* @__PURE__ */ f.jsx("button", { onClick: () => void Qo(), children: "Download project ZIP" }),
          /* @__PURE__ */ f.jsx("button", { onClick: () => {
            var l;
            return (l = ao.current) == null ? void 0 : l.click();
          }, children: "Import project ZIP" }),
          i.canUpload && /* @__PURE__ */ f.jsx("button", { onClick: () => void zi(), children: "Save project to OMERO" })
        ] })
      ] }),
      /* @__PURE__ */ f.jsx("input", { ref: ao, hidden: !0, type: "file", accept: ".zip,.oa.zip,.oac.zip", onChange: (l) => {
        var h;
        return void Ns(((h = l.target.files) == null ? void 0 : h[0]) || null);
      } })
    ] }),
    ks && /* @__PURE__ */ f.jsx("div", { className: "dialog-backdrop", role: "presentation", children: /* @__PURE__ */ f.jsxs("section", { className: "script-transfer-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "script-transfer-title", children: [
      /* @__PURE__ */ f.jsx("h2", { id: "script-transfer-title", children: "Copy scripts to another project" }),
      /* @__PURE__ */ f.jsx("p", { children: "The copied scripts keep their code and versions. When run in the destination, they automatically use that project’s current input files." }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Destination project",
        /* @__PURE__ */ f.jsx("select", { value: Dn, onChange: (l) => xs(l.target.value), children: N.filter((l) => l.id !== Ne.id).map((l) => /* @__PURE__ */ f.jsxs("option", { value: l.id, children: [
          l.objectType,
          " ",
          l.objectId,
          " — ",
          l.name
        ] }, l.id)) })
      ] }),
      /* @__PURE__ */ f.jsx("small", { children: "A destination appears after you have opened that OMERO object in Analysis at least once." }),
      /* @__PURE__ */ f.jsxs("div", { className: "dialog-actions", children: [
        /* @__PURE__ */ f.jsx("button", { onClick: () => sr(!1), children: "Cancel" }),
        /* @__PURE__ */ f.jsx("button", { disabled: !Dn, onClick: () => void ko(), children: "Copy selected scripts" })
      ] })
    ] }) }),
    /* @__PURE__ */ f.jsxs(
      "div",
      {
        className: `workspace ${Qt ? "artifact-visible" : ""}`,
        style: { "--explorer-width": `${He}px` },
        children: [
          /* @__PURE__ */ f.jsxs(
            "aside",
            {
              className: "project-tree",
              onDragOver: (l) => {
                l.preventDefault(), l.dataTransfer.dropEffect = "copy";
              },
              onDrop: (l) => {
                l.preventDefault(), Ii(l.dataTransfer.files);
              },
              children: [
                /* @__PURE__ */ f.jsxs(
                  "div",
                  {
                    className: "file-browser-heading",
                    onContextMenu: (l) => ft(l, Ne.name, [
                      { label: "Add files", run: () => {
                        var h;
                        return (h = br.current) == null ? void 0 : h.click();
                      } },
                      { label: "New chat", run: () => void Uo() },
                      { label: "Rename current chat", run: () => void Bo(Ge) },
                      { label: "Rename project", run: () => void _n(Ne) },
                      { label: "Refresh", run: () => void $r() }
                    ]),
                    children: [
                      /* @__PURE__ */ f.jsxs("div", { children: [
                        /* @__PURE__ */ f.jsx("h2", { children: "Project files" }),
                        /* @__PURE__ */ f.jsxs("small", { children: [
                          xi(Ua(d)),
                          " · browser ",
                          Jo || "?",
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ f.jsx(
                        "button",
                        {
                          className: "browser-more",
                          "aria-label": "Project actions",
                          title: "Project actions",
                          onClick: (l) => ft(l, Ne.name, [
                            { label: "Add files", run: () => {
                              var h;
                              return (h = br.current) == null ? void 0 : h.click();
                            } },
                            { label: "New chat", run: () => void Uo() },
                            { label: "Rename current chat", run: () => void Bo(Ge) },
                            { label: "Rename project", run: () => void _n(Ne) },
                            { label: "Refresh", run: () => void $r() }
                          ]),
                          children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ f.jsxs("div", { className: "file-browser-toolbar", role: "toolbar", "aria-label": "Project file actions", children: [
                  /* @__PURE__ */ f.jsx(
                    "button",
                    {
                      title: "Up to OMERO object projects",
                      "aria-label": "Up to OMERO object projects",
                      disabled: jn,
                      onClick: () => no(!0),
                      children: /* @__PURE__ */ f.jsx(Ze, { name: "up" })
                    }
                  ),
                  /* @__PURE__ */ f.jsx("button", { title: "Add files", "aria-label": "Add files", onClick: () => {
                    var l;
                    return (l = br.current) == null ? void 0 : l.click();
                  }, children: /* @__PURE__ */ f.jsx(Ze, { name: "upload" }) }),
                  /* @__PURE__ */ f.jsx("button", { title: "Refresh project", "aria-label": "Refresh project", onClick: () => void $r(), children: /* @__PURE__ */ f.jsx(Ze, { name: "refresh" }) }),
                  /* @__PURE__ */ f.jsx(
                    "button",
                    {
                      title: "Collapse all folders",
                      "aria-label": "Collapse all folders",
                      onClick: () => Un({
                        inputs: !1,
                        outputs: !1,
                        scripts: !1,
                        workflows: !1,
                        trash: !1,
                        snapshots: !1
                      }),
                      children: /* @__PURE__ */ f.jsx(Ze, { name: "collapse" })
                    }
                  ),
                  /* @__PURE__ */ f.jsx("input", { ref: br, hidden: !0, type: "file", multiple: !0, onChange: (l) => void Ii(l.target.files) })
                ] }),
                /* @__PURE__ */ f.jsxs("label", { className: "explorer-search", children: [
                  /* @__PURE__ */ f.jsx("span", { className: "sr-only", children: "Search project files" }),
                  /* @__PURE__ */ f.jsx(
                    "input",
                    {
                      type: "search",
                      value: $t,
                      placeholder: "Search files, scripts, workflows…",
                      onChange: (l) => ir(l.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ f.jsxs(
                  "div",
                  {
                    className: "browser-path",
                    title: jn ? `OMERO/${Ne.objectType}-${Ne.objectId}` : Ne.rootPath,
                    onDoubleClick: () => no(!0),
                    children: [
                      /* @__PURE__ */ f.jsx(Ze, { name: "root" }),
                      /* @__PURE__ */ f.jsx("span", { children: jn ? `OMERO/${Ne.objectType}-${Ne.objectId}` : Ne.rootPath })
                    ]
                  }
                ),
                /* @__PURE__ */ f.jsxs("div", { className: "browser-columns", children: [
                  /* @__PURE__ */ f.jsx("span", { children: "Name" }),
                  /* @__PURE__ */ f.jsx("span", { children: "Size" })
                ] }),
                jn ? /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
                  /* @__PURE__ */ f.jsxs("div", { className: "hierarchy-section", children: [
                    /* @__PURE__ */ f.jsx("strong", { children: "OMERO hierarchy" }),
                    [...(W == null ? void 0 : W.parents) || [], ...(W == null ? void 0 : W.children) || []].map((l) => /* @__PURE__ */ f.jsxs(
                      "button",
                      {
                        disabled: !l.supported,
                        onClick: () => {
                          l.supported && window.location.assign(
                            `${o.tokenUrl.replace(/api\/context-token\/$/, "")}?type=${encodeURIComponent(l.type)}&id=${l.id}`
                          );
                        },
                        children: [
                          /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                          /* @__PURE__ */ f.jsx("span", { children: l.name }),
                          /* @__PURE__ */ f.jsxs("small", { children: [
                            l.type,
                            " ",
                            l.id
                          ] })
                        ]
                      },
                      `${l.type}:${l.id}`
                    )),
                    !(W != null && W.parents.length) && !(W != null && W.children.length) && /* @__PURE__ */ f.jsx("p", { children: "No readable immediate OMERO relations." })
                  ] }),
                  /* @__PURE__ */ f.jsx("div", { className: "hierarchy-section-title", children: "Browser-local projects for this object" }),
                  /* @__PURE__ */ f.jsx("ul", { className: "browser-list project-list", children: k.map((l) => /* @__PURE__ */ f.jsxs(
                    "li",
                    {
                      className: ey(
                        l.id,
                        Ne.id,
                        Ei
                      ),
                      "aria-selected": l.id === (Ei || Ne.id),
                      onClick: () => ro(l.id),
                      onDoubleClick: () => void Vo(l.id),
                      onContextMenu: (h) => {
                        ro(l.id), ft(h, l.name, [
                          { label: "Open project", run: () => void Vo(l.id) },
                          { label: "Rename project", run: () => void _n(l) },
                          ...l.id !== Ne.id ? [{
                            label: "Delete local project",
                            danger: !0,
                            run: () => void ho(l)
                          }] : []
                        ]);
                      },
                      children: [
                        /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                        /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                          /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                          /* @__PURE__ */ f.jsx("small", { children: l.id === Ne.id ? "open now" : l.sourceSnapshotAnnotationId ? `restored from Annotation ${l.sourceSnapshotAnnotationId}` : "browser-local project" })
                        ] }),
                        /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: new Date(l.updatedAt).toLocaleDateString() }),
                        /* @__PURE__ */ f.jsx(
                          "button",
                          {
                            className: "browser-more",
                            "aria-label": `Actions for ${l.name}`,
                            onClick: (h) => {
                              ro(l.id), ft(h, l.name, [
                                { label: "Open project", run: () => void Vo(l.id) },
                                { label: "Rename project", run: () => void _n(l) },
                                ...l.id !== Ne.id ? [{
                                  label: "Delete local project",
                                  danger: !0,
                                  run: () => void ho(l)
                                }] : []
                              ]);
                            },
                            children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                          }
                        )
                      ]
                    },
                    l.id
                  )) })
                ] }) : /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
                  Jo >= 75 && /* @__PURE__ */ f.jsxs("p", { className: "quota-warning", children: [
                    "Browser storage is ",
                    Jo,
                    "% full. Archive or download old projects."
                  ] }),
                  /* @__PURE__ */ f.jsxs(
                    "details",
                    {
                      open: ar.inputs,
                      className: "browser-folder",
                      onToggle: (l) => {
                        const h = l.currentTarget.open;
                        Un((v) => ({ ...v, inputs: h }));
                      },
                      children: [
                        /* @__PURE__ */ f.jsxs(
                          "summary",
                          {
                            onContextMenu: (l) => ft(l, "inputs/", [
                              { label: "Add files", run: () => {
                                var h;
                                return (h = br.current) == null ? void 0 : h.click();
                              } }
                            ]),
                            children: [
                              /* @__PURE__ */ f.jsx(Ze, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                              /* @__PURE__ */ f.jsx("strong", { children: "inputs" }),
                              /* @__PURE__ */ f.jsx("small", { children: cr.length })
                            ]
                          }
                        ),
                        /* @__PURE__ */ f.jsxs("ul", { className: "browser-list", children: [
                          lo.map((l) => /* @__PURE__ */ f.jsxs(
                            "li",
                            {
                              className: `browser-row file-${l.state}`,
                              onContextMenu: (h) => ft(h, l.name, xo(l)),
                              children: [
                                /* @__PURE__ */ f.jsx(Ze, { name: "file" }),
                                /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                                  /* @__PURE__ */ f.jsxs("small", { children: [
                                    l.source,
                                    " · ",
                                    l.state,
                                    " · ",
                                    l.sha256.slice(0, 10) || "unhashed"
                                  ] }),
                                  l.error && /* @__PURE__ */ f.jsx("span", { className: "browser-error", children: l.error })
                                ] }),
                                /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: xi(l.size) }),
                                /* @__PURE__ */ f.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${l.name}`,
                                    onClick: (h) => ft(h, l.name, xo(l)),
                                    children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                                  }
                                ),
                                l.state === "missing" && l.source === "local" && /* @__PURE__ */ f.jsx(
                                  "input",
                                  {
                                    id: `reselect-${l.id}`,
                                    hidden: !0,
                                    type: "file",
                                    onChange: (h) => {
                                      var v;
                                      return void _o(l, ((v = h.target.files) == null ? void 0 : v[0]) || null);
                                    }
                                  }
                                )
                              ]
                            },
                            l.id
                          )),
                          !lo.length && /* @__PURE__ */ f.jsx("li", { className: "browser-empty", children: "No matching input files" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ f.jsxs(
                    "details",
                    {
                      open: ar.outputs,
                      className: "browser-folder",
                      onToggle: (l) => {
                        const h = l.currentTarget.open;
                        Un((v) => ({ ...v, outputs: h }));
                      },
                      children: [
                        /* @__PURE__ */ f.jsxs(
                          "summary",
                          {
                            onContextMenu: (l) => ft(l, `chats/${Ge.title}/`, [
                              { label: "Rename chat", run: () => void Bo(Ge) },
                              { label: "New chat", run: () => void Uo() },
                              { label: "Archive chat", run: () => Ss(Ge) }
                            ]),
                            children: [
                              /* @__PURE__ */ f.jsx(Ze, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                              /* @__PURE__ */ f.jsxs("strong", { children: [
                                "chats/",
                                on(Ge.title),
                                "/outputs"
                              ] }),
                              /* @__PURE__ */ f.jsx("small", { children: Pr.length })
                            ]
                          }
                        ),
                        Pr.length > 0 && /* @__PURE__ */ f.jsxs("div", { className: "output-selection-toolbar", children: [
                          /* @__PURE__ */ f.jsxs("span", { children: [
                            zt.size,
                            " selected"
                          ] }),
                          /* @__PURE__ */ f.jsx("button", { onClick: qn, children: dr.length > 0 && dr.every((l) => zt.has(l.id)) ? "Clear" : "Select all" }),
                          /* @__PURE__ */ f.jsx(
                            "button",
                            {
                              disabled: !zt.size,
                              onClick: () => void Tr(zt),
                              children: "Delete selected"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ f.jsxs("ul", { className: "browser-list", children: [
                          /* @__PURE__ */ f.jsxs("li", { className: "browser-row virtual", children: [
                            /* @__PURE__ */ f.jsx("span", { className: "browser-icon json", "aria-hidden": "true" }),
                            /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ f.jsx("strong", { children: "chat.json" }),
                              /* @__PURE__ */ f.jsx("small", { children: "autosaved" })
                            ] }),
                            /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: "—" })
                          ] }),
                          /* @__PURE__ */ f.jsxs("li", { className: "browser-row virtual", children: [
                            /* @__PURE__ */ f.jsx("span", { className: "browser-icon markdown", "aria-hidden": "true" }),
                            /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ f.jsx("strong", { children: "chat.md" }),
                              /* @__PURE__ */ f.jsx("small", { children: "autosaved" })
                            ] }),
                            /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: "—" })
                          ] }),
                          dr.map((l) => /* @__PURE__ */ f.jsxs(
                            "li",
                            {
                              className: `browser-row output-row ${zt.has(l.id) ? "selected" : ""}`,
                              onClick: () => {
                                be(l.id), It(!0);
                              },
                              onDoubleClick: () => Kn(l),
                              onContextMenu: (h) => ft(h, l.name, Fi(l)),
                              children: [
                                /* @__PURE__ */ f.jsx(
                                  "input",
                                  {
                                    className: "output-selector",
                                    type: "checkbox",
                                    "aria-label": `Select output ${l.name}`,
                                    checked: zt.has(l.id),
                                    onClick: (h) => h.stopPropagation(),
                                    onChange: () => Hn(l.id),
                                    onDoubleClick: (h) => h.stopPropagation()
                                  }
                                ),
                                /* @__PURE__ */ f.jsx(Ze, { name: l.type.startsWith("image/") ? "image" : "file" }),
                                /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                                  /* @__PURE__ */ f.jsxs("small", { children: [
                                    l.sha256.slice(0, 10),
                                    " · double-click to download"
                                  ] })
                                ] }),
                                /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: xi(l.size) }),
                                /* @__PURE__ */ f.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${l.name}`,
                                    onClick: (h) => ft(h, l.name, Fi(l)),
                                    children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            l.id
                          ))
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ f.jsxs(
                    "details",
                    {
                      open: ar.scripts,
                      className: "browser-folder",
                      onToggle: (l) => {
                        const h = l.currentTarget.open;
                        Un((v) => ({ ...v, scripts: h }));
                      },
                      children: [
                        /* @__PURE__ */ f.jsxs(
                          "summary",
                          {
                            onContextMenu: (l) => ft(l, "scripts/", [
                              { label: "Combine selected scripts", run: () => void Rr() },
                              { label: "Copy selected scripts…", run: () => Mi() }
                            ]),
                            children: [
                              /* @__PURE__ */ f.jsx(Ze, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                              /* @__PURE__ */ f.jsx("strong", { children: "scripts" }),
                              /* @__PURE__ */ f.jsx("small", { children: Fo.length })
                            ]
                          }
                        ),
                        Fo.length > 0 && /* @__PURE__ */ f.jsxs("div", { className: "script-selection-toolbar", children: [
                          /* @__PURE__ */ f.jsxs("span", { children: [
                            Ln.size,
                            " selected"
                          ] }),
                          /* @__PURE__ */ f.jsx("button", { disabled: Ln.size < 2, onClick: () => void Rr(), children: "Combine" }),
                          /* @__PURE__ */ f.jsx("button", { disabled: !Ln.size, onClick: () => Mi(), children: "Copy to…" })
                        ] }),
                        /* @__PURE__ */ f.jsxs("ul", { className: "browser-list", children: [
                          Fo.filter((l) => un(l.name)).map((l) => /* @__PURE__ */ f.jsxs(
                            "li",
                            {
                              className: "browser-row script-row",
                              onDoubleClick: () => void Ni(l),
                              onContextMenu: (h) => ft(h, l.name, jo(l)),
                              children: [
                                /* @__PURE__ */ f.jsx(
                                  "input",
                                  {
                                    className: "script-selector",
                                    type: "checkbox",
                                    "aria-label": `Select ${l.name}`,
                                    checked: Ln.has(l.id),
                                    onChange: () => Wn(l.id),
                                    onDoubleClick: (h) => h.stopPropagation()
                                  }
                                ),
                                /* @__PURE__ */ f.jsx("span", { className: "browser-icon python", "aria-hidden": "true" }),
                                /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                                  /* @__PURE__ */ f.jsxs("small", { children: [
                                    "v",
                                    l.currentVersion,
                                    " · ",
                                    l.description || "saved Python script"
                                  ] })
                                ] }),
                                /* @__PURE__ */ f.jsxs("span", { className: "browser-size", children: [
                                  "v",
                                  l.currentVersion
                                ] }),
                                /* @__PURE__ */ f.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${l.name}`,
                                    onClick: (h) => ft(h, l.name, jo(l)),
                                    children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            l.id
                          )),
                          !Fo.filter((l) => un(l.name)).length && /* @__PURE__ */ f.jsx("li", { className: "browser-empty", children: "No matching scripts" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ f.jsxs(
                    "details",
                    {
                      open: ar.workflows,
                      className: "browser-folder",
                      onToggle: (l) => {
                        const h = l.currentTarget.open;
                        Un((v) => ({ ...v, workflows: h }));
                      },
                      children: [
                        /* @__PURE__ */ f.jsxs("summary", { children: [
                          /* @__PURE__ */ f.jsx(Ze, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                          /* @__PURE__ */ f.jsx("strong", { children: "workflows" }),
                          /* @__PURE__ */ f.jsx("small", { children: d.workflows.length })
                        ] }),
                        /* @__PURE__ */ f.jsxs("ul", { className: "browser-list", children: [
                          d.workflows.filter(
                            (l) => !l.deletedAt && un(l.name)
                          ).map((l) => /* @__PURE__ */ f.jsxs(
                            "li",
                            {
                              className: "browser-row",
                              onDoubleClick: () => void dn(l),
                              onContextMenu: (h) => ft(h, l.name, [
                                { label: "Run workflow", run: () => void dn(l) },
                                { label: "Batch run on opened projects…", run: () => void Oi(l) },
                                ...i.canUpload ? [{
                                  label: "Publish template to OMERO",
                                  run: () => void Ri(l)
                                }] : [],
                                { label: "Delete workflow", danger: !0, run: () => void As(l) }
                              ]),
                              children: [
                                /* @__PURE__ */ f.jsx(Ze, { name: "file" }),
                                /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                                  /* @__PURE__ */ f.jsxs("small", { children: [
                                    "v",
                                    l.version,
                                    " · ",
                                    l.steps.length,
                                    " isolated steps"
                                  ] })
                                ] }),
                                /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: l.steps.length }),
                                /* @__PURE__ */ f.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${l.name}`,
                                    onClick: (h) => ft(h, l.name, [
                                      { label: "Run workflow", run: () => void dn(l) },
                                      { label: "Batch run on opened projects…", run: () => void Oi(l) },
                                      ...i.canUpload ? [{
                                        label: "Publish template to OMERO",
                                        run: () => void Ri(l)
                                      }] : [],
                                      { label: "Delete workflow", danger: !0, run: () => void As(l) }
                                    ]),
                                    children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            l.id
                          )),
                          !d.workflows.filter(
                            (l) => !l.deletedAt && un(l.name)
                          ).length && /* @__PURE__ */ f.jsx("li", { className: "browser-empty", children: "No matching workflows" }),
                          F.map((l) => /* @__PURE__ */ f.jsxs(
                            "li",
                            {
                              className: "browser-row",
                              onDoubleClick: () => void wo(l),
                              children: [
                                /* @__PURE__ */ f.jsx("span", { className: "browser-icon archive", "aria-hidden": "true" }),
                                /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                                  /* @__PURE__ */ f.jsx("small", { children: "OMERO template · double-click to import" })
                                ] }),
                                /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: xi(l.size) }),
                                /* @__PURE__ */ f.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Import ${l.name}`,
                                    onClick: () => void wo(l),
                                    children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            `template-${l.annotation_id}`
                          ))
                        ] })
                      ]
                    }
                  ),
                  (uo.length > 0 || Ci.length > 0 || bi.length > 0) && /* @__PURE__ */ f.jsxs(
                    "details",
                    {
                      open: ar.trash,
                      className: "browser-folder",
                      onToggle: (l) => {
                        const h = l.currentTarget.open;
                        Un((v) => ({ ...v, trash: h }));
                      },
                      children: [
                        /* @__PURE__ */ f.jsxs("summary", { children: [
                          /* @__PURE__ */ f.jsx(Ze, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                          /* @__PURE__ */ f.jsx("strong", { children: "trash" }),
                          /* @__PURE__ */ f.jsx("small", { children: uo.length + Ci.length + bi.length })
                        ] }),
                        /* @__PURE__ */ f.jsxs("ul", { className: "browser-list", children: [
                          uo.map((l) => /* @__PURE__ */ f.jsxs("li", { className: "browser-row", children: [
                            /* @__PURE__ */ f.jsx(Ze, { name: "file" }),
                            /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                              /* @__PURE__ */ f.jsx("small", { children: "deleted output" })
                            ] }),
                            /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: xi(l.size) }),
                            /* @__PURE__ */ f.jsx("button", { onClick: () => void Is(l), children: "Restore" })
                          ] }, l.id)),
                          Ci.map((l) => /* @__PURE__ */ f.jsxs("li", { className: "browser-row", children: [
                            /* @__PURE__ */ f.jsx("span", { className: "browser-icon python", "aria-hidden": "true" }),
                            /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                              /* @__PURE__ */ f.jsx("small", { children: "deleted script" })
                            ] }),
                            /* @__PURE__ */ f.jsxs("span", { className: "browser-size", children: [
                              "v",
                              l.currentVersion
                            ] }),
                            /* @__PURE__ */ f.jsx("button", { onClick: () => void go(l), children: "Restore" })
                          ] }, l.id)),
                          bi.map((l) => /* @__PURE__ */ f.jsxs("li", { className: "browser-row", children: [
                            /* @__PURE__ */ f.jsx(Ze, { name: "file" }),
                            /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                              /* @__PURE__ */ f.jsx("small", { children: "deleted workflow" })
                            ] }),
                            /* @__PURE__ */ f.jsxs("span", { className: "browser-size", children: [
                              "v",
                              l.version
                            ] }),
                            /* @__PURE__ */ f.jsx("button", { onClick: () => void rl(l), children: "Restore" })
                          ] }, l.id))
                        ] })
                      ]
                    }
                  ),
                  A.length > 0 && /* @__PURE__ */ f.jsxs(
                    "details",
                    {
                      open: ar.snapshots,
                      className: "browser-folder",
                      onToggle: (l) => {
                        const h = l.currentTarget.open;
                        Un((v) => ({ ...v, snapshots: h }));
                      },
                      children: [
                        /* @__PURE__ */ f.jsxs("summary", { children: [
                          /* @__PURE__ */ f.jsx(Ze, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ f.jsx(Ze, { name: "folder" }),
                          /* @__PURE__ */ f.jsx("strong", { children: "Resume from OMERO" }),
                          /* @__PURE__ */ f.jsx("small", { children: A.length })
                        ] }),
                        /* @__PURE__ */ f.jsx("ul", { className: "browser-list", children: A.map((l) => /* @__PURE__ */ f.jsxs(
                          "li",
                          {
                            className: "browser-row",
                            onDoubleClick: () => void Cn(l),
                            onContextMenu: (h) => ft(h, l.name, So(l)),
                            children: [
                              /* @__PURE__ */ f.jsx("span", { className: "browser-icon archive", "aria-hidden": "true" }),
                              /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                                /* @__PURE__ */ f.jsx("strong", { children: l.name }),
                                /* @__PURE__ */ f.jsxs("small", { children: [
                                  "Annotation ",
                                  l.annotation_id
                                ] })
                              ] }),
                              /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: xi(l.size) }),
                              /* @__PURE__ */ f.jsx(
                                "button",
                                {
                                  className: "browser-more",
                                  "aria-label": `Actions for ${l.name}`,
                                  onClick: (h) => ft(h, l.name, So(l)),
                                  children: /* @__PURE__ */ f.jsx(Ze, { name: "more" })
                                }
                              )
                            ]
                          },
                          l.annotation_id
                        )) })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ f.jsx(
            "div",
            {
              className: "pane-resizer",
              role: "separator",
              "aria-label": "Resize project explorer",
              onMouseDown: nl
            }
          ),
          ln && /* @__PURE__ */ f.jsxs(
            "div",
            {
              className: "browser-context-menu",
              role: "menu",
              "aria-label": `Actions for ${ln.title}`,
              style: { left: ln.x, top: ln.y },
              onClick: (l) => l.stopPropagation(),
              children: [
                /* @__PURE__ */ f.jsx("div", { className: "context-title", children: ln.title }),
                ln.actions.map((l) => /* @__PURE__ */ f.jsx(
                  "button",
                  {
                    role: "menuitem",
                    className: l.danger ? "danger" : "",
                    onClick: () => {
                      zn(null), l.run();
                    },
                    children: l.label
                  },
                  l.label
                ))
              ]
            }
          ),
          /* @__PURE__ */ f.jsxs("section", { className: "chat", children: [
            /* @__PURE__ */ f.jsxs("div", { className: "messages", "aria-live": "polite", ref: lr, children: [
              !Ge.messages.length && /* @__PURE__ */ f.jsxs("div", { className: "welcome", children: [
                /* @__PURE__ */ f.jsx("h2", { children: "What would you like to learn from these data?" }),
                /* @__PURE__ */ f.jsx("p", { children: "This named chat, its code, outputs, and reusable workflows are saved automatically in the browser project." }),
                de.length > 0 && /* @__PURE__ */ f.jsxs("div", { className: "suggested-prompts", children: [
                  /* @__PURE__ */ f.jsx("button", { onClick: () => Be("Summarize the available datasets, tables, columns, and important data-quality issues."), children: "Summarize these data" }),
                  /* @__PURE__ */ f.jsx("button", { onClick: () => Be("Find the most biologically meaningful differences and visualize them with reproducible plot data."), children: "Find meaningful differences" }),
                  /* @__PURE__ */ f.jsx("button", { onClick: () => Be("Explain the CI Segmentation schema and suggest three safe analyses for these measurements."), children: "Explore the measurement schema" })
                ] })
              ] }),
              Ge.messages.map((l) => {
                var v;
                if (l.kind === "viewer-preview" && l.artifactId) {
                  const j = d.artifacts.find(
                    (P) => P.id === l.artifactId
                  ), x = j != null && j.fileId ? d.files.find(
                    (P) => P.id === j.fileId && !P.deletedAt
                  ) : void 0;
                  return j ? /* @__PURE__ */ f.jsx(
                    ly,
                    {
                      artifact: j,
                      file: x,
                      onInspect: (P) => {
                        be(P.id), It(!0);
                      },
                      onSaveBundle: (P, _) => void Ps(P, _)
                    },
                    l.id
                  ) : null;
                }
                if (l.kind === "execution" && l.executionId) {
                  const j = d.executions.find((x) => x.id === l.executionId);
                  return j ? /* @__PURE__ */ f.jsx(
                    ny,
                    {
                      execution: j,
                      files: d.files,
                      onSave: () => void bs(j),
                      onRerun: () => void il(j),
                      allowInspectionSave: j.purpose === "inspection" && ["success", "reused"].includes(j.status) && !d.executions.some(
                        (x) => x.chatId === j.chatId && x.promptId === j.promptId && x.purpose !== "inspection" && ["success", "reused"].includes(x.status)
                      )
                    },
                    l.id
                  ) : null;
                }
                const h = Lu(
                  l.activity,
                  l.durationMs
                );
                return /* @__PURE__ */ f.jsxs("article", { className: `message ${l.role} ${l.kind || ""}`, children: [
                  /* @__PURE__ */ f.jsxs("span", { children: [
                    l.role,
                    /* @__PURE__ */ f.jsx(
                      "button",
                      {
                        className: "pin-message",
                        "aria-label": `${(Ge.pinnedMessageIds || []).includes(l.id) ? "Unpin" : "Pin"} message`,
                        onClick: () => tl(Ge, l.id),
                        children: (Ge.pinnedMessageIds || []).includes(l.id) ? "★" : "☆"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ f.jsx("p", { children: l.content }),
                  (v = l.citationIds) != null && v.length ? /* @__PURE__ */ f.jsx("div", { className: "message-citations", "aria-label": "Evidence used for this answer", children: l.citationIds.map((j, x) => {
                    const P = d.executions.find((R) => R.id === j), _ = P == null ? void 0 : P.outputFileIds.find(
                      (R) => d.files.some((Q) => Q.id === R && !Q.deletedAt)
                    );
                    return /* @__PURE__ */ f.jsxs(
                      "button",
                      {
                        title: `Open local execution ${j.slice(0, 8)}`,
                        onClick: () => {
                          _ && be(_), It(!0);
                        },
                        children: [
                          "Evidence ",
                          x + 1
                        ]
                      },
                      j
                    );
                  }) }) : null,
                  h && /* @__PURE__ */ f.jsx("small", { className: "message-activity", children: h })
                ] }, l.id);
              }),
              K && /* @__PURE__ */ f.jsxs("article", { className: "message assistant streaming", children: [
                /* @__PURE__ */ f.jsxs("span", { children: [
                  "assistant · ",
                  X
                ] }),
                /* @__PURE__ */ f.jsxs("p", { children: [
                  K,
                  /* @__PURE__ */ f.jsx("i", { className: "stream-caret" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ f.jsx(
              uy,
              {
                runtimeReady: L,
                runtimeProgress: io,
                status: _i,
                usage: Xa,
                settings: O,
                blocked: Bn.length > 0,
                canChat: Vn,
                composerPlaceholder: js,
                prompt: Ie,
                busy: Re,
                onPromptChange: Be,
                onSend: () => void Cs(),
                onStop: $i,
                onReset: () => void Gt(d.files, "Python state reset; inputs restored")
              }
            )
          ] }),
          /* @__PURE__ */ f.jsx(
            cy,
            {
              open: Qt,
              file: Ya,
              profiles: de,
              canUpload: i.canUpload,
              onToggle: () => It((l) => !l),
              onDownload: Kn,
              onAttach: (l) => void $s(l)
            }
          )
        ]
      }
    )
  ] });
  async function _o(l, h) {
    const v = y.current;
    if (!h || !v) return;
    if (h.size > yf) {
      re(`${h.name} exceeds the 256 MiB file limit`);
      return;
    }
    const j = await h.arrayBuffer(), x = {
      ...l,
      name: h.name,
      type: h.type || Bf(h.name),
      size: j.byteLength,
      sha256: await Zt(j),
      data: j,
      state: "ready",
      error: void 0
    }, P = v.files.map((_) => _.id === l.id ? x : _);
    Xt([x]), await Gt(P, "Missing local input restored");
  }
  async function il(l) {
    if (!(!L || Re || l.purpose === "inspection")) {
      me(!0), Lt.current.clear(), await a.beginTurn();
      try {
        const h = Le(), v = await Ve(
          l.code,
          l.chatId,
          h,
          !0,
          l.purpose === "script" ? "script" : "analysis"
        ), j = y.current, x = j == null ? void 0 : j.scripts.flatMap(
          (_) => _.versions.map((R) => ({ script: _, version: R }))
        ).find(({ version: _ }) => _.codeHash === l.codeHash), P = await Nr(
          v,
          l.chatId,
          h,
          (x == null ? void 0 : x.script.name) || "python-rerun-analysis.py",
          x == null ? void 0 : x.version.renderRecipe
        );
        re(
          P ? "Python rerun completed and rendered its PNG gallery" : "Python rerun completed"
        );
      } catch (h) {
        re(`Python rerun could not complete: ${String(h)}`);
      } finally {
        me(!1);
      }
    }
  }
}
function Ze({ name: o, className: i = "" }) {
  const a = {
    folder: /* @__PURE__ */ f.jsx("path", { d: "M2.5 6.5h8.1l2.35-3h6.55v15H2.5z" }),
    file: /* @__PURE__ */ f.jsx("path", { d: "M5 2.5h8l4 4v15H5zm8 0v4h4M8 11h6M8 15h6" }),
    image: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "1.5" }),
      /* @__PURE__ */ f.jsx("circle", { cx: "9", cy: "9", r: "1.5" }),
      /* @__PURE__ */ f.jsx("path", { d: "m5 18 5-5 3 3 2-2 4 4" })
    ] }),
    root: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("path", { d: "m3 11 9-7 9 7" }),
      /* @__PURE__ */ f.jsx("path", { d: "M5.5 10v10h13V10M10 20v-6h4v6" })
    ] }),
    up: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("path", { d: "m7 10 5-5 5 5" }),
      /* @__PURE__ */ f.jsx("path", { d: "M12 5v13" })
    ] }),
    upload: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("path", { d: "M4 16v4h16v-4" }),
      /* @__PURE__ */ f.jsx("path", { d: "M12 16V4m-5 5 5-5 5 5" })
    ] }),
    refresh: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("path", { d: "M20 7V3l-3 3a8 8 0 1 0 2.2 8" }),
      /* @__PURE__ */ f.jsx("path", { d: "M20 3h-5" })
    ] }),
    collapse: /* @__PURE__ */ f.jsx(f.Fragment, { children: /* @__PURE__ */ f.jsx("path", { d: "m7 9 5-5 5 5M7 15l5 5 5-5" }) }),
    chevron: /* @__PURE__ */ f.jsx("path", { d: "m9 5 7 7-7 7" }),
    more: /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
      /* @__PURE__ */ f.jsx("circle", { cx: "12", cy: "5", r: "1.4", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ f.jsx("circle", { cx: "12", cy: "12", r: "1.4", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ f.jsx("circle", { cx: "12", cy: "19", r: "1.4", fill: "currentColor", stroke: "none" })
    ] })
  };
  return /* @__PURE__ */ f.jsx(
    "svg",
    {
      className: `ui-icon icon-${o} ${i}`.trim(),
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      fill: o === "folder" ? "currentColor" : "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: a[o]
    }
  );
}
const kp = document.getElementById("root"), Hf = document.getElementById("omero-analysis-context"), Kt = (o) => kp.dataset[o] || "", Ba = window.OMERO_ANALYSIS;
window.OMERO_ANALYSIS = Ba != null && Ba.runtimeBase ? Ba : {
  context: Hf ? JSON.parse(Hf.textContent || "null") : null,
  tokenUrl: Kt("tokenUrl"),
  contextTemplate: Kt("contextTemplate"),
  attachmentsTemplate: Kt("attachmentsTemplate"),
  hierarchyTemplate: Kt("hierarchyTemplate"),
  downloadTemplate: Kt("downloadTemplate"),
  uploadTemplate: Kt("uploadTemplate"),
  snapshotsTemplate: Kt("snapshotsTemplate"),
  snapshotUploadTemplate: Kt("snapshotUploadTemplate"),
  snapshotDownloadTemplate: Kt("snapshotDownloadTemplate"),
  workflowTemplatesTemplate: Kt("workflowTemplatesTemplate"),
  workflowDownloadTemplate: Kt("workflowDownloadTemplate"),
  workflowSkillsUrl: Kt("workflowSkillsUrl"),
  zarrViewerStatusUrl: Kt("zarrViewerStatusUrl"),
  runtimeBase: Kt("runtimeBase").replace(/ASSET$/, "")
};
Th.createRoot(kp).render(
  /* @__PURE__ */ f.jsx(Ch.StrictMode, { children: /* @__PURE__ */ f.jsx(Ay, {}) })
);
