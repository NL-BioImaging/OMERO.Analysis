var Wf = Object.defineProperty;
var Hf = (h, y, f) => y in h ? Wf(h, y, { enumerable: !0, configurable: !0, writable: !0, value: f }) : h[y] = f;
var jt = (h, y, f) => Hf(h, typeof y != "symbol" ? y + "" : y, f);
function Wa(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
var Ni = { exports: {} }, _r = {}, zi = { exports: {} }, W = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var za;
function Qf() {
  if (za) return W;
  za = 1;
  var h = Symbol.for("react.element"), y = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), j = Symbol.for("react.strict_mode"), D = Symbol.for("react.profiler"), H = Symbol.for("react.provider"), oe = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), de = Symbol.for("react.memo"), ue = Symbol.for("react.lazy"), te = Symbol.iterator;
  function J(s) {
    return s === null || typeof s != "object" ? null : (s = te && s[te] || s["@@iterator"], typeof s == "function" ? s : null);
  }
  var Ne = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Oe = Object.assign, Q = {};
  function Z(s, v, z) {
    this.props = s, this.context = v, this.refs = Q, this.updater = z || Ne;
  }
  Z.prototype.isReactComponent = {}, Z.prototype.setState = function(s, v) {
    if (typeof s != "object" && typeof s != "function" && s != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, s, v, "setState");
  }, Z.prototype.forceUpdate = function(s) {
    this.updater.enqueueForceUpdate(this, s, "forceUpdate");
  };
  function q() {
  }
  q.prototype = Z.prototype;
  function Qe(s, v, z) {
    this.props = s, this.context = v, this.refs = Q, this.updater = z || Ne;
  }
  var Ke = Qe.prototype = new q();
  Ke.constructor = Qe, Oe(Ke, Z.prototype), Ke.isPureReactComponent = !0;
  var ce = Array.isArray, Ie = Object.prototype.hasOwnProperty, ve = { current: null }, we = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Ue(s, v, z) {
    var A, $ = {}, V = null, I = null;
    if (v != null) for (A in v.ref !== void 0 && (I = v.ref), v.key !== void 0 && (V = "" + v.key), v) Ie.call(v, A) && !we.hasOwnProperty(A) && ($[A] = v[A]);
    var K = arguments.length - 2;
    if (K === 1) $.children = z;
    else if (1 < K) {
      for (var ee = Array(K), ke = 0; ke < K; ke++) ee[ke] = arguments[ke + 2];
      $.children = ee;
    }
    if (s && s.defaultProps) for (A in K = s.defaultProps, K) $[A] === void 0 && ($[A] = K[A]);
    return { $$typeof: h, type: s, key: V, ref: I, props: $, _owner: ve.current };
  }
  function mt(s, v) {
    return { $$typeof: h, type: s.type, key: v, ref: s.ref, props: s.props, _owner: s._owner };
  }
  function it(s) {
    return typeof s == "object" && s !== null && s.$$typeof === h;
  }
  function kt(s) {
    var v = { "=": "=0", ":": "=2" };
    return "$" + s.replace(/[=:]/g, function(z) {
      return v[z];
    });
  }
  var Ye = /\/+/g;
  function Me(s, v) {
    return typeof s == "object" && s !== null && s.key != null ? kt("" + s.key) : v.toString(36);
  }
  function Xe(s, v, z, A, $) {
    var V = typeof s;
    (V === "undefined" || V === "boolean") && (s = null);
    var I = !1;
    if (s === null) I = !0;
    else switch (V) {
      case "string":
      case "number":
        I = !0;
        break;
      case "object":
        switch (s.$$typeof) {
          case h:
          case y:
            I = !0;
        }
    }
    if (I) return I = s, $ = $(I), s = A === "" ? "." + Me(I, 0) : A, ce($) ? (z = "", s != null && (z = s.replace(Ye, "$&/") + "/"), Xe($, v, z, "", function(ke) {
      return ke;
    })) : $ != null && (it($) && ($ = mt($, z + (!$.key || I && I.key === $.key ? "" : ("" + $.key).replace(Ye, "$&/") + "/") + s)), v.push($)), 1;
    if (I = 0, A = A === "" ? "." : A + ":", ce(s)) for (var K = 0; K < s.length; K++) {
      V = s[K];
      var ee = A + Me(V, K);
      I += Xe(V, v, z, ee, $);
    }
    else if (ee = J(s), typeof ee == "function") for (s = ee.call(s), K = 0; !(V = s.next()).done; ) V = V.value, ee = A + Me(V, K++), I += Xe(V, v, z, ee, $);
    else if (V === "object") throw v = String(s), Error("Objects are not valid as a React child (found: " + (v === "[object Object]" ? "object with keys {" + Object.keys(s).join(", ") + "}" : v) + "). If you meant to render a collection of children, use an array instead.");
    return I;
  }
  function be(s, v, z) {
    if (s == null) return s;
    var A = [], $ = 0;
    return Xe(s, A, "", "", function(V) {
      return v.call(z, V, $++);
    }), A;
  }
  function ze(s) {
    if (s._status === -1) {
      var v = s._result;
      v = v(), v.then(function(z) {
        (s._status === 0 || s._status === -1) && (s._status = 1, s._result = z);
      }, function(z) {
        (s._status === 0 || s._status === -1) && (s._status = 2, s._result = z);
      }), s._status === -1 && (s._status = 0, s._result = v);
    }
    if (s._status === 1) return s._result.default;
    throw s._result;
  }
  var g = { current: null }, w = { transition: null }, _ = { ReactCurrentDispatcher: g, ReactCurrentBatchConfig: w, ReactCurrentOwner: ve };
  function C() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return W.Children = { map: be, forEach: function(s, v, z) {
    be(s, function() {
      v.apply(this, arguments);
    }, z);
  }, count: function(s) {
    var v = 0;
    return be(s, function() {
      v++;
    }), v;
  }, toArray: function(s) {
    return be(s, function(v) {
      return v;
    }) || [];
  }, only: function(s) {
    if (!it(s)) throw Error("React.Children.only expected to receive a single React element child.");
    return s;
  } }, W.Component = Z, W.Fragment = f, W.Profiler = D, W.PureComponent = Qe, W.StrictMode = j, W.Suspense = B, W.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _, W.act = C, W.cloneElement = function(s, v, z) {
    if (s == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + s + ".");
    var A = Oe({}, s.props), $ = s.key, V = s.ref, I = s._owner;
    if (v != null) {
      if (v.ref !== void 0 && (V = v.ref, I = ve.current), v.key !== void 0 && ($ = "" + v.key), s.type && s.type.defaultProps) var K = s.type.defaultProps;
      for (ee in v) Ie.call(v, ee) && !we.hasOwnProperty(ee) && (A[ee] = v[ee] === void 0 && K !== void 0 ? K[ee] : v[ee]);
    }
    var ee = arguments.length - 2;
    if (ee === 1) A.children = z;
    else if (1 < ee) {
      K = Array(ee);
      for (var ke = 0; ke < ee; ke++) K[ke] = arguments[ke + 2];
      A.children = K;
    }
    return { $$typeof: h, type: s.type, key: $, ref: V, props: A, _owner: I };
  }, W.createContext = function(s) {
    return s = { $$typeof: oe, _currentValue: s, _currentValue2: s, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, s.Provider = { $$typeof: H, _context: s }, s.Consumer = s;
  }, W.createElement = Ue, W.createFactory = function(s) {
    var v = Ue.bind(null, s);
    return v.type = s, v;
  }, W.createRef = function() {
    return { current: null };
  }, W.forwardRef = function(s) {
    return { $$typeof: G, render: s };
  }, W.isValidElement = it, W.lazy = function(s) {
    return { $$typeof: ue, _payload: { _status: -1, _result: s }, _init: ze };
  }, W.memo = function(s, v) {
    return { $$typeof: de, type: s, compare: v === void 0 ? null : v };
  }, W.startTransition = function(s) {
    var v = w.transition;
    w.transition = {};
    try {
      s();
    } finally {
      w.transition = v;
    }
  }, W.unstable_act = C, W.useCallback = function(s, v) {
    return g.current.useCallback(s, v);
  }, W.useContext = function(s) {
    return g.current.useContext(s);
  }, W.useDebugValue = function() {
  }, W.useDeferredValue = function(s) {
    return g.current.useDeferredValue(s);
  }, W.useEffect = function(s, v) {
    return g.current.useEffect(s, v);
  }, W.useId = function() {
    return g.current.useId();
  }, W.useImperativeHandle = function(s, v, z) {
    return g.current.useImperativeHandle(s, v, z);
  }, W.useInsertionEffect = function(s, v) {
    return g.current.useInsertionEffect(s, v);
  }, W.useLayoutEffect = function(s, v) {
    return g.current.useLayoutEffect(s, v);
  }, W.useMemo = function(s, v) {
    return g.current.useMemo(s, v);
  }, W.useReducer = function(s, v, z) {
    return g.current.useReducer(s, v, z);
  }, W.useRef = function(s) {
    return g.current.useRef(s);
  }, W.useState = function(s) {
    return g.current.useState(s);
  }, W.useSyncExternalStore = function(s, v, z) {
    return g.current.useSyncExternalStore(s, v, z);
  }, W.useTransition = function() {
    return g.current.useTransition();
  }, W.version = "18.3.1", W;
}
var Ta;
function Oi() {
  return Ta || (Ta = 1, zi.exports = Qf()), zi.exports;
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
var Ra;
function Kf() {
  if (Ra) return _r;
  Ra = 1;
  var h = Oi(), y = Symbol.for("react.element"), f = Symbol.for("react.fragment"), j = Object.prototype.hasOwnProperty, D = h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, H = { key: !0, ref: !0, __self: !0, __source: !0 };
  function oe(G, B, de) {
    var ue, te = {}, J = null, Ne = null;
    de !== void 0 && (J = "" + de), B.key !== void 0 && (J = "" + B.key), B.ref !== void 0 && (Ne = B.ref);
    for (ue in B) j.call(B, ue) && !H.hasOwnProperty(ue) && (te[ue] = B[ue]);
    if (G && G.defaultProps) for (ue in B = G.defaultProps, B) te[ue] === void 0 && (te[ue] = B[ue]);
    return { $$typeof: y, type: G, key: J, ref: Ne, props: te, _owner: D.current };
  }
  return _r.Fragment = f, _r.jsx = oe, _r.jsxs = oe, _r;
}
var ja;
function Yf() {
  return ja || (ja = 1, Ni.exports = Kf()), Ni.exports;
}
var P = Yf(), Pe = Oi();
const Xf = /* @__PURE__ */ Wa(Pe);
var Ol = {}, Ti = { exports: {} }, He = {}, Ri = { exports: {} }, ji = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var La;
function Gf() {
  return La || (La = 1, (function(h) {
    function y(w, _) {
      var C = w.length;
      w.push(_);
      e: for (; 0 < C; ) {
        var s = C - 1 >>> 1, v = w[s];
        if (0 < D(v, _)) w[s] = _, w[C] = v, C = s;
        else break e;
      }
    }
    function f(w) {
      return w.length === 0 ? null : w[0];
    }
    function j(w) {
      if (w.length === 0) return null;
      var _ = w[0], C = w.pop();
      if (C !== _) {
        w[0] = C;
        e: for (var s = 0, v = w.length, z = v >>> 1; s < z; ) {
          var A = 2 * (s + 1) - 1, $ = w[A], V = A + 1, I = w[V];
          if (0 > D($, C)) V < v && 0 > D(I, $) ? (w[s] = I, w[V] = C, s = V) : (w[s] = $, w[A] = C, s = A);
          else if (V < v && 0 > D(I, C)) w[s] = I, w[V] = C, s = V;
          else break e;
        }
      }
      return _;
    }
    function D(w, _) {
      var C = w.sortIndex - _.sortIndex;
      return C !== 0 ? C : w.id - _.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var H = performance;
      h.unstable_now = function() {
        return H.now();
      };
    } else {
      var oe = Date, G = oe.now();
      h.unstable_now = function() {
        return oe.now() - G;
      };
    }
    var B = [], de = [], ue = 1, te = null, J = 3, Ne = !1, Oe = !1, Q = !1, Z = typeof setTimeout == "function" ? setTimeout : null, q = typeof clearTimeout == "function" ? clearTimeout : null, Qe = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ke(w) {
      for (var _ = f(de); _ !== null; ) {
        if (_.callback === null) j(de);
        else if (_.startTime <= w) j(de), _.sortIndex = _.expirationTime, y(B, _);
        else break;
        _ = f(de);
      }
    }
    function ce(w) {
      if (Q = !1, Ke(w), !Oe) if (f(B) !== null) Oe = !0, ze(Ie);
      else {
        var _ = f(de);
        _ !== null && g(ce, _.startTime - w);
      }
    }
    function Ie(w, _) {
      Oe = !1, Q && (Q = !1, q(Ue), Ue = -1), Ne = !0;
      var C = J;
      try {
        for (Ke(_), te = f(B); te !== null && (!(te.expirationTime > _) || w && !kt()); ) {
          var s = te.callback;
          if (typeof s == "function") {
            te.callback = null, J = te.priorityLevel;
            var v = s(te.expirationTime <= _);
            _ = h.unstable_now(), typeof v == "function" ? te.callback = v : te === f(B) && j(B), Ke(_);
          } else j(B);
          te = f(B);
        }
        if (te !== null) var z = !0;
        else {
          var A = f(de);
          A !== null && g(ce, A.startTime - _), z = !1;
        }
        return z;
      } finally {
        te = null, J = C, Ne = !1;
      }
    }
    var ve = !1, we = null, Ue = -1, mt = 5, it = -1;
    function kt() {
      return !(h.unstable_now() - it < mt);
    }
    function Ye() {
      if (we !== null) {
        var w = h.unstable_now();
        it = w;
        var _ = !0;
        try {
          _ = we(!0, w);
        } finally {
          _ ? Me() : (ve = !1, we = null);
        }
      } else ve = !1;
    }
    var Me;
    if (typeof Qe == "function") Me = function() {
      Qe(Ye);
    };
    else if (typeof MessageChannel < "u") {
      var Xe = new MessageChannel(), be = Xe.port2;
      Xe.port1.onmessage = Ye, Me = function() {
        be.postMessage(null);
      };
    } else Me = function() {
      Z(Ye, 0);
    };
    function ze(w) {
      we = w, ve || (ve = !0, Me());
    }
    function g(w, _) {
      Ue = Z(function() {
        w(h.unstable_now());
      }, _);
    }
    h.unstable_IdlePriority = 5, h.unstable_ImmediatePriority = 1, h.unstable_LowPriority = 4, h.unstable_NormalPriority = 3, h.unstable_Profiling = null, h.unstable_UserBlockingPriority = 2, h.unstable_cancelCallback = function(w) {
      w.callback = null;
    }, h.unstable_continueExecution = function() {
      Oe || Ne || (Oe = !0, ze(Ie));
    }, h.unstable_forceFrameRate = function(w) {
      0 > w || 125 < w ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : mt = 0 < w ? Math.floor(1e3 / w) : 5;
    }, h.unstable_getCurrentPriorityLevel = function() {
      return J;
    }, h.unstable_getFirstCallbackNode = function() {
      return f(B);
    }, h.unstable_next = function(w) {
      switch (J) {
        case 1:
        case 2:
        case 3:
          var _ = 3;
          break;
        default:
          _ = J;
      }
      var C = J;
      J = _;
      try {
        return w();
      } finally {
        J = C;
      }
    }, h.unstable_pauseExecution = function() {
    }, h.unstable_requestPaint = function() {
    }, h.unstable_runWithPriority = function(w, _) {
      switch (w) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          w = 3;
      }
      var C = J;
      J = w;
      try {
        return _();
      } finally {
        J = C;
      }
    }, h.unstable_scheduleCallback = function(w, _, C) {
      var s = h.unstable_now();
      switch (typeof C == "object" && C !== null ? (C = C.delay, C = typeof C == "number" && 0 < C ? s + C : s) : C = s, w) {
        case 1:
          var v = -1;
          break;
        case 2:
          v = 250;
          break;
        case 5:
          v = 1073741823;
          break;
        case 4:
          v = 1e4;
          break;
        default:
          v = 5e3;
      }
      return v = C + v, w = { id: ue++, callback: _, priorityLevel: w, startTime: C, expirationTime: v, sortIndex: -1 }, C > s ? (w.sortIndex = C, y(de, w), f(B) === null && w === f(de) && (Q ? (q(Ue), Ue = -1) : Q = !0, g(ce, C - s))) : (w.sortIndex = v, y(B, w), Oe || Ne || (Oe = !0, ze(Ie))), w;
    }, h.unstable_shouldYield = kt, h.unstable_wrapCallback = function(w) {
      var _ = J;
      return function() {
        var C = J;
        J = _;
        try {
          return w.apply(this, arguments);
        } finally {
          J = C;
        }
      };
    };
  })(ji)), ji;
}
var Oa;
function Jf() {
  return Oa || (Oa = 1, Ri.exports = Gf()), Ri.exports;
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
var Ma;
function Zf() {
  if (Ma) return He;
  Ma = 1;
  var h = Oi(), y = Jf();
  function f(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var j = /* @__PURE__ */ new Set(), D = {};
  function H(e, t) {
    oe(e, t), oe(e + "Capture", t);
  }
  function oe(e, t) {
    for (D[e] = t, e = 0; e < t.length; e++) j.add(t[e]);
  }
  var G = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), B = Object.prototype.hasOwnProperty, de = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ue = {}, te = {};
  function J(e) {
    return B.call(te, e) ? !0 : B.call(ue, e) ? !1 : de.test(e) ? te[e] = !0 : (ue[e] = !0, !1);
  }
  function Ne(e, t, n, r) {
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
  function Oe(e, t, n, r) {
    if (t === null || typeof t > "u" || Ne(e, t, n, r)) return !0;
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
  var q = /[\-:]([a-z])/g;
  function Qe(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      q,
      Qe
    );
    Z[t] = new Q(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(q, Qe);
    Z[t] = new Q(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(q, Qe);
    Z[t] = new Q(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    Z[e] = new Q(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), Z.xlinkHref = new Q("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    Z[e] = new Q(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Ke(e, t, n, r) {
    var l = Z.hasOwnProperty(t) ? Z[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Oe(t, n, l, r) && (n = null), r || l === null ? J(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ce = h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ie = Symbol.for("react.element"), ve = Symbol.for("react.portal"), we = Symbol.for("react.fragment"), Ue = Symbol.for("react.strict_mode"), mt = Symbol.for("react.profiler"), it = Symbol.for("react.provider"), kt = Symbol.for("react.context"), Ye = Symbol.for("react.forward_ref"), Me = Symbol.for("react.suspense"), Xe = Symbol.for("react.suspense_list"), be = Symbol.for("react.memo"), ze = Symbol.for("react.lazy"), g = Symbol.for("react.offscreen"), w = Symbol.iterator;
  function _(e) {
    return e === null || typeof e != "object" ? null : (e = w && e[w] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var C = Object.assign, s;
  function v(e) {
    if (s === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      s = t && t[1] || "";
    }
    return `
` + s + e;
  }
  var z = !1;
  function A(e, t) {
    if (!e || z) return "";
    z = !0;
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
        } catch (m) {
          var r = m;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (m) {
          r = m;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (m) {
          r = m;
        }
        e();
      }
    } catch (m) {
      if (m && r && typeof m.stack == "string") {
        for (var l = m.stack.split(`
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
      z = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? v(e) : "";
  }
  function $(e) {
    switch (e.tag) {
      case 5:
        return v(e.type);
      case 16:
        return v("Lazy");
      case 13:
        return v("Suspense");
      case 19:
        return v("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = A(e.type, !1), e;
      case 11:
        return e = A(e.type.render, !1), e;
      case 1:
        return e = A(e.type, !0), e;
      default:
        return "";
    }
  }
  function V(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case we:
        return "Fragment";
      case ve:
        return "Portal";
      case mt:
        return "Profiler";
      case Ue:
        return "StrictMode";
      case Me:
        return "Suspense";
      case Xe:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case kt:
        return (e.displayName || "Context") + ".Consumer";
      case it:
        return (e._context.displayName || "Context") + ".Provider";
      case Ye:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case be:
        return t = e.displayName || null, t !== null ? t : V(e.type) || "Memo";
      case ze:
        t = e._payload, e = e._init;
        try {
          return V(e(t));
        } catch {
        }
    }
    return null;
  }
  function I(e) {
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
        return V(t);
      case 8:
        return t === Ue ? "StrictMode" : "Mode";
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
  function K(e) {
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
  function ee(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function ke(e) {
    var t = ee(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function St(e) {
    e._valueTracker || (e._valueTracker = ke(e));
  }
  function xt(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ee(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Lt(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Ot(e, t) {
    var n = t.checked;
    return C({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Fi(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = K(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Di(e, t) {
    t = t.checked, t != null && Ke(e, "checked", t, !1);
  }
  function Ml(e, t) {
    Di(e, t);
    var n = K(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Fl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Fl(e, t.type, K(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Ii(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Fl(e, t, n) {
    (t !== "number" || Lt(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var An = Array.isArray;
  function mn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + K(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Dl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(f(91));
    return C({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Ui(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(f(92));
        if (An(n)) {
          if (1 < n.length) throw Error(f(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: K(n) };
  }
  function Ai(e, t) {
    var n = K(t.value), r = K(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function $i(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Bi(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Il(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Bi(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Cr, Vi = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Cr = Cr || document.createElement("div"), Cr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Cr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function $n(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Bn = {
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
  }, Ka = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Bn).forEach(function(e) {
    Ka.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Bn[t] = Bn[e];
    });
  });
  function Wi(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Bn.hasOwnProperty(e) && Bn[e] ? ("" + t).trim() : t + "px";
  }
  function Hi(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = Wi(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Ya = C({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Ul(e, t) {
    if (t) {
      if (Ya[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(f(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(f(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(f(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(f(62));
    }
  }
  function Al(e, t) {
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
  var $l = null;
  function Bl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Vl = null, hn = null, vn = null;
  function Qi(e) {
    if (e = ar(e)) {
      if (typeof Vl != "function") throw Error(f(280));
      var t = e.stateNode;
      t && (t = Xr(t), Vl(e.stateNode, e.type, t));
    }
  }
  function Ki(e) {
    hn ? vn ? vn.push(e) : vn = [e] : hn = e;
  }
  function Yi() {
    if (hn) {
      var e = hn, t = vn;
      if (vn = hn = null, Qi(e), t) for (e = 0; e < t.length; e++) Qi(t[e]);
    }
  }
  function Xi(e, t) {
    return e(t);
  }
  function Gi() {
  }
  var Wl = !1;
  function Ji(e, t, n) {
    if (Wl) return e(t, n);
    Wl = !0;
    try {
      return Xi(e, t, n);
    } finally {
      Wl = !1, (hn !== null || vn !== null) && (Gi(), Yi());
    }
  }
  function Vn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Xr(n);
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
  var Hl = !1;
  if (G) try {
    var Wn = {};
    Object.defineProperty(Wn, "passive", { get: function() {
      Hl = !0;
    } }), window.addEventListener("test", Wn, Wn), window.removeEventListener("test", Wn, Wn);
  } catch {
    Hl = !1;
  }
  function Xa(e, t, n, r, l, o, i, u, a) {
    var m = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, m);
    } catch (S) {
      this.onError(S);
    }
  }
  var Hn = !1, Pr = null, Nr = !1, Ql = null, Ga = { onError: function(e) {
    Hn = !0, Pr = e;
  } };
  function Ja(e, t, n, r, l, o, i, u, a) {
    Hn = !1, Pr = null, Xa.apply(Ga, arguments);
  }
  function Za(e, t, n, r, l, o, i, u, a) {
    if (Ja.apply(this, arguments), Hn) {
      if (Hn) {
        var m = Pr;
        Hn = !1, Pr = null;
      } else throw Error(f(198));
      Nr || (Nr = !0, Ql = m);
    }
  }
  function en(e) {
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
  function Zi(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function qi(e) {
    if (en(e) !== e) throw Error(f(188));
  }
  function qa(e) {
    var t = e.alternate;
    if (!t) {
      if (t = en(e), t === null) throw Error(f(188));
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
          if (o === n) return qi(l), e;
          if (o === r) return qi(l), t;
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
  function bi(e) {
    return e = qa(e), e !== null ? eu(e) : null;
  }
  function eu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = eu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var tu = y.unstable_scheduleCallback, nu = y.unstable_cancelCallback, ba = y.unstable_shouldYield, ec = y.unstable_requestPaint, pe = y.unstable_now, tc = y.unstable_getCurrentPriorityLevel, Kl = y.unstable_ImmediatePriority, ru = y.unstable_UserBlockingPriority, zr = y.unstable_NormalPriority, nc = y.unstable_LowPriority, lu = y.unstable_IdlePriority, Tr = null, ht = null;
  function rc(e) {
    if (ht && typeof ht.onCommitFiberRoot == "function") try {
      ht.onCommitFiberRoot(Tr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ut = Math.clz32 ? Math.clz32 : ic, lc = Math.log, oc = Math.LN2;
  function ic(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (lc(e) / oc | 0) | 0;
  }
  var Rr = 64, jr = 4194304;
  function Qn(e) {
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
  function Lr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var u = i & ~l;
      u !== 0 ? r = Qn(u) : (o &= i, o !== 0 && (r = Qn(o)));
    } else i = n & ~l, i !== 0 ? r = Qn(i) : o !== 0 && (r = Qn(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - ut(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function uc(e, t) {
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
  function sc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - ut(o), u = 1 << i, a = l[i];
      a === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[i] = uc(u, t)) : a <= t && (e.expiredLanes |= u), o &= ~u;
    }
  }
  function Yl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ou() {
    var e = Rr;
    return Rr <<= 1, (Rr & 4194240) === 0 && (Rr = 64), e;
  }
  function Xl(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Kn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ut(t), e[t] = n;
  }
  function ac(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ut(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function Gl(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ut(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var b = 0;
  function iu(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var uu, Jl, su, au, cu, Zl = !1, Or = [], Mt = null, Ft = null, Dt = null, Yn = /* @__PURE__ */ new Map(), Xn = /* @__PURE__ */ new Map(), It = [], cc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function fu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Mt = null;
        break;
      case "dragenter":
      case "dragleave":
        Ft = null;
        break;
      case "mouseover":
      case "mouseout":
        Dt = null;
        break;
      case "pointerover":
      case "pointerout":
        Yn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Xn.delete(t.pointerId);
    }
  }
  function Gn(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = ar(t), t !== null && Jl(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function fc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Mt = Gn(Mt, e, t, n, r, l), !0;
      case "dragenter":
        return Ft = Gn(Ft, e, t, n, r, l), !0;
      case "mouseover":
        return Dt = Gn(Dt, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return Yn.set(o, Gn(Yn.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, Xn.set(o, Gn(Xn.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function du(e) {
    var t = tn(e.target);
    if (t !== null) {
      var n = en(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = Zi(n), t !== null) {
            e.blockedOn = t, cu(e.priority, function() {
              su(n);
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
  function Mr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = bl(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        $l = r, n.target.dispatchEvent(r), $l = null;
      } else return t = ar(n), t !== null && Jl(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function pu(e, t, n) {
    Mr(e) && n.delete(t);
  }
  function dc() {
    Zl = !1, Mt !== null && Mr(Mt) && (Mt = null), Ft !== null && Mr(Ft) && (Ft = null), Dt !== null && Mr(Dt) && (Dt = null), Yn.forEach(pu), Xn.forEach(pu);
  }
  function Jn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Zl || (Zl = !0, y.unstable_scheduleCallback(y.unstable_NormalPriority, dc)));
  }
  function Zn(e) {
    function t(l) {
      return Jn(l, e);
    }
    if (0 < Or.length) {
      Jn(Or[0], e);
      for (var n = 1; n < Or.length; n++) {
        var r = Or[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Mt !== null && Jn(Mt, e), Ft !== null && Jn(Ft, e), Dt !== null && Jn(Dt, e), Yn.forEach(t), Xn.forEach(t), n = 0; n < It.length; n++) r = It[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < It.length && (n = It[0], n.blockedOn === null); ) du(n), n.blockedOn === null && It.shift();
  }
  var yn = ce.ReactCurrentBatchConfig, Fr = !0;
  function pc(e, t, n, r) {
    var l = b, o = yn.transition;
    yn.transition = null;
    try {
      b = 1, ql(e, t, n, r);
    } finally {
      b = l, yn.transition = o;
    }
  }
  function mc(e, t, n, r) {
    var l = b, o = yn.transition;
    yn.transition = null;
    try {
      b = 4, ql(e, t, n, r);
    } finally {
      b = l, yn.transition = o;
    }
  }
  function ql(e, t, n, r) {
    if (Fr) {
      var l = bl(e, t, n, r);
      if (l === null) yo(e, t, r, Dr, n), fu(e, r);
      else if (fc(l, e, t, n, r)) r.stopPropagation();
      else if (fu(e, r), t & 4 && -1 < cc.indexOf(e)) {
        for (; l !== null; ) {
          var o = ar(l);
          if (o !== null && uu(o), o = bl(e, t, n, r), o === null && yo(e, t, r, Dr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else yo(e, t, r, null, n);
    }
  }
  var Dr = null;
  function bl(e, t, n, r) {
    if (Dr = null, e = Bl(r), e = tn(e), e !== null) if (t = en(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = Zi(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Dr = e, null;
  }
  function mu(e) {
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
        switch (tc()) {
          case Kl:
            return 1;
          case ru:
            return 4;
          case zr:
          case nc:
            return 16;
          case lu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ut = null, eo = null, Ir = null;
  function hu() {
    if (Ir) return Ir;
    var e, t = eo, n = t.length, r, l = "value" in Ut ? Ut.value : Ut.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Ir = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Ur(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ar() {
    return !0;
  }
  function vu() {
    return !1;
  }
  function Ge(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(o) : o[u]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Ar : vu, this.isPropagationStopped = vu, this;
    }
    return C(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Ar);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Ar);
    }, persist: function() {
    }, isPersistent: Ar }), t;
  }
  var gn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, to = Ge(gn), qn = C({}, gn, { view: 0, detail: 0 }), hc = Ge(qn), no, ro, bn, $r = C({}, qn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: oo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== bn && (bn && e.type === "mousemove" ? (no = e.screenX - bn.screenX, ro = e.screenY - bn.screenY) : ro = no = 0, bn = e), no);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : ro;
  } }), yu = Ge($r), vc = C({}, $r, { dataTransfer: 0 }), yc = Ge(vc), gc = C({}, qn, { relatedTarget: 0 }), lo = Ge(gc), wc = C({}, gn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), kc = Ge(wc), Sc = C({}, gn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), xc = Ge(Sc), Ec = C({}, gn, { data: 0 }), gu = Ge(Ec), _c = {
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
  }, Cc = {
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
  }, Pc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Nc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Pc[e]) ? !!t[e] : !1;
  }
  function oo() {
    return Nc;
  }
  var zc = C({}, qn, { key: function(e) {
    if (e.key) {
      var t = _c[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Ur(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Cc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: oo, charCode: function(e) {
    return e.type === "keypress" ? Ur(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Ur(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Tc = Ge(zc), Rc = C({}, $r, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), wu = Ge(Rc), jc = C({}, qn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: oo }), Lc = Ge(jc), Oc = C({}, gn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Mc = Ge(Oc), Fc = C({}, $r, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Dc = Ge(Fc), Ic = [9, 13, 27, 32], io = G && "CompositionEvent" in window, er = null;
  G && "documentMode" in document && (er = document.documentMode);
  var Uc = G && "TextEvent" in window && !er, ku = G && (!io || er && 8 < er && 11 >= er), Su = " ", xu = !1;
  function Eu(e, t) {
    switch (e) {
      case "keyup":
        return Ic.indexOf(t.keyCode) !== -1;
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
  function _u(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var wn = !1;
  function Ac(e, t) {
    switch (e) {
      case "compositionend":
        return _u(t);
      case "keypress":
        return t.which !== 32 ? null : (xu = !0, Su);
      case "textInput":
        return e = t.data, e === Su && xu ? null : e;
      default:
        return null;
    }
  }
  function $c(e, t) {
    if (wn) return e === "compositionend" || !io && Eu(e, t) ? (e = hu(), Ir = eo = Ut = null, wn = !1, e) : null;
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
        return ku && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Bc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Cu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Bc[e.type] : t === "textarea";
  }
  function Pu(e, t, n, r) {
    Ki(r), t = Qr(t, "onChange"), 0 < t.length && (n = new to("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var tr = null, nr = null;
  function Vc(e) {
    Hu(e, 0);
  }
  function Br(e) {
    var t = _n(e);
    if (xt(t)) return e;
  }
  function Wc(e, t) {
    if (e === "change") return t;
  }
  var Nu = !1;
  if (G) {
    var uo;
    if (G) {
      var so = "oninput" in document;
      if (!so) {
        var zu = document.createElement("div");
        zu.setAttribute("oninput", "return;"), so = typeof zu.oninput == "function";
      }
      uo = so;
    } else uo = !1;
    Nu = uo && (!document.documentMode || 9 < document.documentMode);
  }
  function Tu() {
    tr && (tr.detachEvent("onpropertychange", Ru), nr = tr = null);
  }
  function Ru(e) {
    if (e.propertyName === "value" && Br(nr)) {
      var t = [];
      Pu(t, nr, e, Bl(e)), Ji(Vc, t);
    }
  }
  function Hc(e, t, n) {
    e === "focusin" ? (Tu(), tr = t, nr = n, tr.attachEvent("onpropertychange", Ru)) : e === "focusout" && Tu();
  }
  function Qc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Br(nr);
  }
  function Kc(e, t) {
    if (e === "click") return Br(t);
  }
  function Yc(e, t) {
    if (e === "input" || e === "change") return Br(t);
  }
  function Xc(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var st = typeof Object.is == "function" ? Object.is : Xc;
  function rr(e, t) {
    if (st(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!B.call(t, l) || !st(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ju(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Lu(e, t) {
    var n = ju(e);
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
      n = ju(n);
    }
  }
  function Ou(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ou(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Mu() {
    for (var e = window, t = Lt(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Lt(e.document);
    }
    return t;
  }
  function ao(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Gc(e) {
    var t = Mu(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Ou(n.ownerDocument.documentElement, n)) {
      if (r !== null && ao(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Lu(n, o);
          var i = Lu(
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
  var Jc = G && "documentMode" in document && 11 >= document.documentMode, kn = null, co = null, lr = null, fo = !1;
  function Fu(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    fo || kn == null || kn !== Lt(r) || (r = kn, "selectionStart" in r && ao(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), lr && rr(lr, r) || (lr = r, r = Qr(co, "onSelect"), 0 < r.length && (t = new to("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = kn)));
  }
  function Vr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Sn = { animationend: Vr("Animation", "AnimationEnd"), animationiteration: Vr("Animation", "AnimationIteration"), animationstart: Vr("Animation", "AnimationStart"), transitionend: Vr("Transition", "TransitionEnd") }, po = {}, Du = {};
  G && (Du = document.createElement("div").style, "AnimationEvent" in window || (delete Sn.animationend.animation, delete Sn.animationiteration.animation, delete Sn.animationstart.animation), "TransitionEvent" in window || delete Sn.transitionend.transition);
  function Wr(e) {
    if (po[e]) return po[e];
    if (!Sn[e]) return e;
    var t = Sn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Du) return po[e] = t[n];
    return e;
  }
  var Iu = Wr("animationend"), Uu = Wr("animationiteration"), Au = Wr("animationstart"), $u = Wr("transitionend"), Bu = /* @__PURE__ */ new Map(), Vu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function At(e, t) {
    Bu.set(e, t), H(t, [e]);
  }
  for (var mo = 0; mo < Vu.length; mo++) {
    var ho = Vu[mo], Zc = ho.toLowerCase(), qc = ho[0].toUpperCase() + ho.slice(1);
    At(Zc, "on" + qc);
  }
  At(Iu, "onAnimationEnd"), At(Uu, "onAnimationIteration"), At(Au, "onAnimationStart"), At("dblclick", "onDoubleClick"), At("focusin", "onFocus"), At("focusout", "onBlur"), At($u, "onTransitionEnd"), oe("onMouseEnter", ["mouseout", "mouseover"]), oe("onMouseLeave", ["mouseout", "mouseover"]), oe("onPointerEnter", ["pointerout", "pointerover"]), oe("onPointerLeave", ["pointerout", "pointerover"]), H("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), H("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), H("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), H("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), H("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), H("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var or = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), bc = new Set("cancel close invalid load scroll toggle".split(" ").concat(or));
  function Wu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Za(r, t, void 0, e), e.currentTarget = null;
  }
  function Hu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var u = r[i], a = u.instance, m = u.currentTarget;
          if (u = u.listener, a !== o && l.isPropagationStopped()) break e;
          Wu(l, u, m), o = a;
        }
        else for (i = 0; i < r.length; i++) {
          if (u = r[i], a = u.instance, m = u.currentTarget, u = u.listener, a !== o && l.isPropagationStopped()) break e;
          Wu(l, u, m), o = a;
        }
      }
    }
    if (Nr) throw e = Ql, Nr = !1, Ql = null, e;
  }
  function re(e, t) {
    var n = t[Eo];
    n === void 0 && (n = t[Eo] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (Qu(t, e, 2, !1), n.add(r));
  }
  function vo(e, t, n) {
    var r = 0;
    t && (r |= 4), Qu(n, e, r, t);
  }
  var Hr = "_reactListening" + Math.random().toString(36).slice(2);
  function ir(e) {
    if (!e[Hr]) {
      e[Hr] = !0, j.forEach(function(n) {
        n !== "selectionchange" && (bc.has(n) || vo(n, !1, e), vo(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Hr] || (t[Hr] = !0, vo("selectionchange", !1, t));
    }
  }
  function Qu(e, t, n, r) {
    switch (mu(t)) {
      case 1:
        var l = pc;
        break;
      case 4:
        l = mc;
        break;
      default:
        l = ql;
    }
    n = l.bind(null, t, n, e), l = void 0, !Hl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function yo(e, t, n, r, l) {
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
          if (i = tn(u), i === null) return;
          if (a = i.tag, a === 5 || a === 6) {
            r = o = i;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    Ji(function() {
      var m = o, S = Bl(n), x = [];
      e: {
        var k = Bu.get(e);
        if (k !== void 0) {
          var N = to, R = e;
          switch (e) {
            case "keypress":
              if (Ur(n) === 0) break e;
            case "keydown":
            case "keyup":
              N = Tc;
              break;
            case "focusin":
              R = "focus", N = lo;
              break;
            case "focusout":
              R = "blur", N = lo;
              break;
            case "beforeblur":
            case "afterblur":
              N = lo;
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
              N = yu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              N = yc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              N = Lc;
              break;
            case Iu:
            case Uu:
            case Au:
              N = kc;
              break;
            case $u:
              N = Mc;
              break;
            case "scroll":
              N = hc;
              break;
            case "wheel":
              N = Dc;
              break;
            case "copy":
            case "cut":
            case "paste":
              N = xc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              N = wu;
          }
          var L = (t & 4) !== 0, me = !L && e === "scroll", d = L ? k !== null ? k + "Capture" : null : k;
          L = [];
          for (var c = m, p; c !== null; ) {
            p = c;
            var E = p.stateNode;
            if (p.tag === 5 && E !== null && (p = E, d !== null && (E = Vn(c, d), E != null && L.push(ur(c, E, p)))), me) break;
            c = c.return;
          }
          0 < L.length && (k = new N(k, R, null, n, S), x.push({ event: k, listeners: L }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (k = e === "mouseover" || e === "pointerover", N = e === "mouseout" || e === "pointerout", k && n !== $l && (R = n.relatedTarget || n.fromElement) && (tn(R) || R[Et])) break e;
          if ((N || k) && (k = S.window === S ? S : (k = S.ownerDocument) ? k.defaultView || k.parentWindow : window, N ? (R = n.relatedTarget || n.toElement, N = m, R = R ? tn(R) : null, R !== null && (me = en(R), R !== me || R.tag !== 5 && R.tag !== 6) && (R = null)) : (N = null, R = m), N !== R)) {
            if (L = yu, E = "onMouseLeave", d = "onMouseEnter", c = "mouse", (e === "pointerout" || e === "pointerover") && (L = wu, E = "onPointerLeave", d = "onPointerEnter", c = "pointer"), me = N == null ? k : _n(N), p = R == null ? k : _n(R), k = new L(E, c + "leave", N, n, S), k.target = me, k.relatedTarget = p, E = null, tn(S) === m && (L = new L(d, c + "enter", R, n, S), L.target = p, L.relatedTarget = me, E = L), me = E, N && R) t: {
              for (L = N, d = R, c = 0, p = L; p; p = xn(p)) c++;
              for (p = 0, E = d; E; E = xn(E)) p++;
              for (; 0 < c - p; ) L = xn(L), c--;
              for (; 0 < p - c; ) d = xn(d), p--;
              for (; c--; ) {
                if (L === d || d !== null && L === d.alternate) break t;
                L = xn(L), d = xn(d);
              }
              L = null;
            }
            else L = null;
            N !== null && Ku(x, k, N, L, !1), R !== null && me !== null && Ku(x, me, R, L, !0);
          }
        }
        e: {
          if (k = m ? _n(m) : window, N = k.nodeName && k.nodeName.toLowerCase(), N === "select" || N === "input" && k.type === "file") var O = Wc;
          else if (Cu(k)) if (Nu) O = Yc;
          else {
            O = Qc;
            var M = Hc;
          }
          else (N = k.nodeName) && N.toLowerCase() === "input" && (k.type === "checkbox" || k.type === "radio") && (O = Kc);
          if (O && (O = O(e, m))) {
            Pu(x, O, n, S);
            break e;
          }
          M && M(e, k, m), e === "focusout" && (M = k._wrapperState) && M.controlled && k.type === "number" && Fl(k, "number", k.value);
        }
        switch (M = m ? _n(m) : window, e) {
          case "focusin":
            (Cu(M) || M.contentEditable === "true") && (kn = M, co = m, lr = null);
            break;
          case "focusout":
            lr = co = kn = null;
            break;
          case "mousedown":
            fo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            fo = !1, Fu(x, n, S);
            break;
          case "selectionchange":
            if (Jc) break;
          case "keydown":
          case "keyup":
            Fu(x, n, S);
        }
        var F;
        if (io) e: {
          switch (e) {
            case "compositionstart":
              var U = "onCompositionStart";
              break e;
            case "compositionend":
              U = "onCompositionEnd";
              break e;
            case "compositionupdate":
              U = "onCompositionUpdate";
              break e;
          }
          U = void 0;
        }
        else wn ? Eu(e, n) && (U = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (U = "onCompositionStart");
        U && (ku && n.locale !== "ko" && (wn || U !== "onCompositionStart" ? U === "onCompositionEnd" && wn && (F = hu()) : (Ut = S, eo = "value" in Ut ? Ut.value : Ut.textContent, wn = !0)), M = Qr(m, U), 0 < M.length && (U = new gu(U, e, null, n, S), x.push({ event: U, listeners: M }), F ? U.data = F : (F = _u(n), F !== null && (U.data = F)))), (F = Uc ? Ac(e, n) : $c(e, n)) && (m = Qr(m, "onBeforeInput"), 0 < m.length && (S = new gu("onBeforeInput", "beforeinput", null, n, S), x.push({ event: S, listeners: m }), S.data = F));
      }
      Hu(x, t);
    });
  }
  function ur(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Qr(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Vn(e, n), o != null && r.unshift(ur(e, o, l)), o = Vn(e, t), o != null && r.push(ur(e, o, l))), e = e.return;
    }
    return r;
  }
  function xn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Ku(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var u = n, a = u.alternate, m = u.stateNode;
      if (a !== null && a === r) break;
      u.tag === 5 && m !== null && (u = m, l ? (a = Vn(n, o), a != null && i.unshift(ur(n, a, u))) : l || (a = Vn(n, o), a != null && i.push(ur(n, a, u)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var ef = /\r\n?/g, tf = /\u0000|\uFFFD/g;
  function Yu(e) {
    return (typeof e == "string" ? e : "" + e).replace(ef, `
`).replace(tf, "");
  }
  function Kr(e, t, n) {
    if (t = Yu(t), Yu(e) !== t && n) throw Error(f(425));
  }
  function Yr() {
  }
  var go = null, wo = null;
  function ko(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var So = typeof setTimeout == "function" ? setTimeout : void 0, nf = typeof clearTimeout == "function" ? clearTimeout : void 0, Xu = typeof Promise == "function" ? Promise : void 0, rf = typeof queueMicrotask == "function" ? queueMicrotask : typeof Xu < "u" ? function(e) {
    return Xu.resolve(null).then(e).catch(lf);
  } : So;
  function lf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function xo(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), Zn(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    Zn(t);
  }
  function $t(e) {
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
  function Gu(e) {
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
  var En = Math.random().toString(36).slice(2), vt = "__reactFiber$" + En, sr = "__reactProps$" + En, Et = "__reactContainer$" + En, Eo = "__reactEvents$" + En, of = "__reactListeners$" + En, uf = "__reactHandles$" + En;
  function tn(e) {
    var t = e[vt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Et] || n[vt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Gu(e); e !== null; ) {
          if (n = e[vt]) return n;
          e = Gu(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function ar(e) {
    return e = e[vt] || e[Et], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function _n(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(f(33));
  }
  function Xr(e) {
    return e[sr] || null;
  }
  var _o = [], Cn = -1;
  function Bt(e) {
    return { current: e };
  }
  function le(e) {
    0 > Cn || (e.current = _o[Cn], _o[Cn] = null, Cn--);
  }
  function ne(e, t) {
    Cn++, _o[Cn] = e.current, e.current = t;
  }
  var Vt = {}, Te = Bt(Vt), Ae = Bt(!1), nn = Vt;
  function Pn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Vt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function $e(e) {
    return e = e.childContextTypes, e != null;
  }
  function Gr() {
    le(Ae), le(Te);
  }
  function Ju(e, t, n) {
    if (Te.current !== Vt) throw Error(f(168));
    ne(Te, t), ne(Ae, n);
  }
  function Zu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(f(108, I(e) || "Unknown", l));
    return C({}, n, r);
  }
  function Jr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Vt, nn = Te.current, ne(Te, e), ne(Ae, Ae.current), !0;
  }
  function qu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(f(169));
    n ? (e = Zu(e, t, nn), r.__reactInternalMemoizedMergedChildContext = e, le(Ae), le(Te), ne(Te, e)) : le(Ae), ne(Ae, n);
  }
  var _t = null, Zr = !1, Co = !1;
  function bu(e) {
    _t === null ? _t = [e] : _t.push(e);
  }
  function sf(e) {
    Zr = !0, bu(e);
  }
  function Wt() {
    if (!Co && _t !== null) {
      Co = !0;
      var e = 0, t = b;
      try {
        var n = _t;
        for (b = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        _t = null, Zr = !1;
      } catch (l) {
        throw _t !== null && (_t = _t.slice(e + 1)), tu(Kl, Wt), l;
      } finally {
        b = t, Co = !1;
      }
    }
    return null;
  }
  var Nn = [], zn = 0, qr = null, br = 0, et = [], tt = 0, rn = null, Ct = 1, Pt = "";
  function ln(e, t) {
    Nn[zn++] = br, Nn[zn++] = qr, qr = e, br = t;
  }
  function es(e, t, n) {
    et[tt++] = Ct, et[tt++] = Pt, et[tt++] = rn, rn = e;
    var r = Ct;
    e = Pt;
    var l = 32 - ut(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - ut(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, Ct = 1 << 32 - ut(t) + l | n << l | r, Pt = o + e;
    } else Ct = 1 << o | n << l | r, Pt = e;
  }
  function Po(e) {
    e.return !== null && (ln(e, 1), es(e, 1, 0));
  }
  function No(e) {
    for (; e === qr; ) qr = Nn[--zn], Nn[zn] = null, br = Nn[--zn], Nn[zn] = null;
    for (; e === rn; ) rn = et[--tt], et[tt] = null, Pt = et[--tt], et[tt] = null, Ct = et[--tt], et[tt] = null;
  }
  var Je = null, Ze = null, ie = !1, at = null;
  function ts(e, t) {
    var n = ot(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function ns(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Je = e, Ze = $t(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Je = e, Ze = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = rn !== null ? { id: Ct, overflow: Pt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = ot(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Je = e, Ze = null, !0) : !1;
      default:
        return !1;
    }
  }
  function zo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function To(e) {
    if (ie) {
      var t = Ze;
      if (t) {
        var n = t;
        if (!ns(e, t)) {
          if (zo(e)) throw Error(f(418));
          t = $t(n.nextSibling);
          var r = Je;
          t && ns(e, t) ? ts(r, n) : (e.flags = e.flags & -4097 | 2, ie = !1, Je = e);
        }
      } else {
        if (zo(e)) throw Error(f(418));
        e.flags = e.flags & -4097 | 2, ie = !1, Je = e;
      }
    }
  }
  function rs(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    Je = e;
  }
  function el(e) {
    if (e !== Je) return !1;
    if (!ie) return rs(e), ie = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ko(e.type, e.memoizedProps)), t && (t = Ze)) {
      if (zo(e)) throw ls(), Error(f(418));
      for (; t; ) ts(e, t), t = $t(t.nextSibling);
    }
    if (rs(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(f(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                Ze = $t(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Ze = null;
      }
    } else Ze = Je ? $t(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ls() {
    for (var e = Ze; e; ) e = $t(e.nextSibling);
  }
  function Tn() {
    Ze = Je = null, ie = !1;
  }
  function Ro(e) {
    at === null ? at = [e] : at.push(e);
  }
  var af = ce.ReactCurrentBatchConfig;
  function cr(e, t, n) {
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
  function tl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(f(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function os(e) {
    var t = e._init;
    return t(e._payload);
  }
  function is(e) {
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
      return d = Zt(d, c), d.index = 0, d.sibling = null, d;
    }
    function o(d, c, p) {
      return d.index = p, e ? (p = d.alternate, p !== null ? (p = p.index, p < c ? (d.flags |= 2, c) : p) : (d.flags |= 2, c)) : (d.flags |= 1048576, c);
    }
    function i(d) {
      return e && d.alternate === null && (d.flags |= 2), d;
    }
    function u(d, c, p, E) {
      return c === null || c.tag !== 6 ? (c = Si(p, d.mode, E), c.return = d, c) : (c = l(c, p), c.return = d, c);
    }
    function a(d, c, p, E) {
      var O = p.type;
      return O === we ? S(d, c, p.props.children, E, p.key) : c !== null && (c.elementType === O || typeof O == "object" && O !== null && O.$$typeof === ze && os(O) === c.type) ? (E = l(c, p.props), E.ref = cr(d, c, p), E.return = d, E) : (E = Cl(p.type, p.key, p.props, null, d.mode, E), E.ref = cr(d, c, p), E.return = d, E);
    }
    function m(d, c, p, E) {
      return c === null || c.tag !== 4 || c.stateNode.containerInfo !== p.containerInfo || c.stateNode.implementation !== p.implementation ? (c = xi(p, d.mode, E), c.return = d, c) : (c = l(c, p.children || []), c.return = d, c);
    }
    function S(d, c, p, E, O) {
      return c === null || c.tag !== 7 ? (c = pn(p, d.mode, E, O), c.return = d, c) : (c = l(c, p), c.return = d, c);
    }
    function x(d, c, p) {
      if (typeof c == "string" && c !== "" || typeof c == "number") return c = Si("" + c, d.mode, p), c.return = d, c;
      if (typeof c == "object" && c !== null) {
        switch (c.$$typeof) {
          case Ie:
            return p = Cl(c.type, c.key, c.props, null, d.mode, p), p.ref = cr(d, null, c), p.return = d, p;
          case ve:
            return c = xi(c, d.mode, p), c.return = d, c;
          case ze:
            var E = c._init;
            return x(d, E(c._payload), p);
        }
        if (An(c) || _(c)) return c = pn(c, d.mode, p, null), c.return = d, c;
        tl(d, c);
      }
      return null;
    }
    function k(d, c, p, E) {
      var O = c !== null ? c.key : null;
      if (typeof p == "string" && p !== "" || typeof p == "number") return O !== null ? null : u(d, c, "" + p, E);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case Ie:
            return p.key === O ? a(d, c, p, E) : null;
          case ve:
            return p.key === O ? m(d, c, p, E) : null;
          case ze:
            return O = p._init, k(
              d,
              c,
              O(p._payload),
              E
            );
        }
        if (An(p) || _(p)) return O !== null ? null : S(d, c, p, E, null);
        tl(d, p);
      }
      return null;
    }
    function N(d, c, p, E, O) {
      if (typeof E == "string" && E !== "" || typeof E == "number") return d = d.get(p) || null, u(c, d, "" + E, O);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case Ie:
            return d = d.get(E.key === null ? p : E.key) || null, a(c, d, E, O);
          case ve:
            return d = d.get(E.key === null ? p : E.key) || null, m(c, d, E, O);
          case ze:
            var M = E._init;
            return N(d, c, p, M(E._payload), O);
        }
        if (An(E) || _(E)) return d = d.get(p) || null, S(c, d, E, O, null);
        tl(c, E);
      }
      return null;
    }
    function R(d, c, p, E) {
      for (var O = null, M = null, F = c, U = c = 0, Ee = null; F !== null && U < p.length; U++) {
        F.index > U ? (Ee = F, F = null) : Ee = F.sibling;
        var X = k(d, F, p[U], E);
        if (X === null) {
          F === null && (F = Ee);
          break;
        }
        e && F && X.alternate === null && t(d, F), c = o(X, c, U), M === null ? O = X : M.sibling = X, M = X, F = Ee;
      }
      if (U === p.length) return n(d, F), ie && ln(d, U), O;
      if (F === null) {
        for (; U < p.length; U++) F = x(d, p[U], E), F !== null && (c = o(F, c, U), M === null ? O = F : M.sibling = F, M = F);
        return ie && ln(d, U), O;
      }
      for (F = r(d, F); U < p.length; U++) Ee = N(F, d, U, p[U], E), Ee !== null && (e && Ee.alternate !== null && F.delete(Ee.key === null ? U : Ee.key), c = o(Ee, c, U), M === null ? O = Ee : M.sibling = Ee, M = Ee);
      return e && F.forEach(function(qt) {
        return t(d, qt);
      }), ie && ln(d, U), O;
    }
    function L(d, c, p, E) {
      var O = _(p);
      if (typeof O != "function") throw Error(f(150));
      if (p = O.call(p), p == null) throw Error(f(151));
      for (var M = O = null, F = c, U = c = 0, Ee = null, X = p.next(); F !== null && !X.done; U++, X = p.next()) {
        F.index > U ? (Ee = F, F = null) : Ee = F.sibling;
        var qt = k(d, F, X.value, E);
        if (qt === null) {
          F === null && (F = Ee);
          break;
        }
        e && F && qt.alternate === null && t(d, F), c = o(qt, c, U), M === null ? O = qt : M.sibling = qt, M = qt, F = Ee;
      }
      if (X.done) return n(
        d,
        F
      ), ie && ln(d, U), O;
      if (F === null) {
        for (; !X.done; U++, X = p.next()) X = x(d, X.value, E), X !== null && (c = o(X, c, U), M === null ? O = X : M.sibling = X, M = X);
        return ie && ln(d, U), O;
      }
      for (F = r(d, F); !X.done; U++, X = p.next()) X = N(F, d, U, X.value, E), X !== null && (e && X.alternate !== null && F.delete(X.key === null ? U : X.key), c = o(X, c, U), M === null ? O = X : M.sibling = X, M = X);
      return e && F.forEach(function(Vf) {
        return t(d, Vf);
      }), ie && ln(d, U), O;
    }
    function me(d, c, p, E) {
      if (typeof p == "object" && p !== null && p.type === we && p.key === null && (p = p.props.children), typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case Ie:
            e: {
              for (var O = p.key, M = c; M !== null; ) {
                if (M.key === O) {
                  if (O = p.type, O === we) {
                    if (M.tag === 7) {
                      n(d, M.sibling), c = l(M, p.props.children), c.return = d, d = c;
                      break e;
                    }
                  } else if (M.elementType === O || typeof O == "object" && O !== null && O.$$typeof === ze && os(O) === M.type) {
                    n(d, M.sibling), c = l(M, p.props), c.ref = cr(d, M, p), c.return = d, d = c;
                    break e;
                  }
                  n(d, M);
                  break;
                } else t(d, M);
                M = M.sibling;
              }
              p.type === we ? (c = pn(p.props.children, d.mode, E, p.key), c.return = d, d = c) : (E = Cl(p.type, p.key, p.props, null, d.mode, E), E.ref = cr(d, c, p), E.return = d, d = E);
            }
            return i(d);
          case ve:
            e: {
              for (M = p.key; c !== null; ) {
                if (c.key === M) if (c.tag === 4 && c.stateNode.containerInfo === p.containerInfo && c.stateNode.implementation === p.implementation) {
                  n(d, c.sibling), c = l(c, p.children || []), c.return = d, d = c;
                  break e;
                } else {
                  n(d, c);
                  break;
                }
                else t(d, c);
                c = c.sibling;
              }
              c = xi(p, d.mode, E), c.return = d, d = c;
            }
            return i(d);
          case ze:
            return M = p._init, me(d, c, M(p._payload), E);
        }
        if (An(p)) return R(d, c, p, E);
        if (_(p)) return L(d, c, p, E);
        tl(d, p);
      }
      return typeof p == "string" && p !== "" || typeof p == "number" ? (p = "" + p, c !== null && c.tag === 6 ? (n(d, c.sibling), c = l(c, p), c.return = d, d = c) : (n(d, c), c = Si(p, d.mode, E), c.return = d, d = c), i(d)) : n(d, c);
    }
    return me;
  }
  var Rn = is(!0), us = is(!1), nl = Bt(null), rl = null, jn = null, jo = null;
  function Lo() {
    jo = jn = rl = null;
  }
  function Oo(e) {
    var t = nl.current;
    le(nl), e._currentValue = t;
  }
  function Mo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Ln(e, t) {
    rl = e, jo = jn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Be = !0), e.firstContext = null);
  }
  function nt(e) {
    var t = e._currentValue;
    if (jo !== e) if (e = { context: e, memoizedValue: t, next: null }, jn === null) {
      if (rl === null) throw Error(f(308));
      jn = e, rl.dependencies = { lanes: 0, firstContext: e };
    } else jn = jn.next = e;
    return t;
  }
  var on = null;
  function Fo(e) {
    on === null ? on = [e] : on.push(e);
  }
  function ss(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Fo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Nt(e, r);
  }
  function Nt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Ht = !1;
  function Do(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function as(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function zt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Qt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (Y & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Nt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Fo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Nt(e, n);
  }
  function ll(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Gl(e, n);
    }
  }
  function cs(e, t) {
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
  function ol(e, t, n, r) {
    var l = e.updateQueue;
    Ht = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var a = u, m = a.next;
      a.next = null, i === null ? o = m : i.next = m, i = a;
      var S = e.alternate;
      S !== null && (S = S.updateQueue, u = S.lastBaseUpdate, u !== i && (u === null ? S.firstBaseUpdate = m : u.next = m, S.lastBaseUpdate = a));
    }
    if (o !== null) {
      var x = l.baseState;
      i = 0, S = m = a = null, u = o;
      do {
        var k = u.lane, N = u.eventTime;
        if ((r & k) === k) {
          S !== null && (S = S.next = {
            eventTime: N,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var R = e, L = u;
            switch (k = t, N = n, L.tag) {
              case 1:
                if (R = L.payload, typeof R == "function") {
                  x = R.call(N, x, k);
                  break e;
                }
                x = R;
                break e;
              case 3:
                R.flags = R.flags & -65537 | 128;
              case 0:
                if (R = L.payload, k = typeof R == "function" ? R.call(N, x, k) : R, k == null) break e;
                x = C({}, x, k);
                break e;
              case 2:
                Ht = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, k = l.effects, k === null ? l.effects = [u] : k.push(u));
        } else N = { eventTime: N, lane: k, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, S === null ? (m = S = N, a = x) : S = S.next = N, i |= k;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          k = u, u = k.next, k.next = null, l.lastBaseUpdate = k, l.shared.pending = null;
        }
      } while (!0);
      if (S === null && (a = x), l.baseState = a, l.firstBaseUpdate = m, l.lastBaseUpdate = S, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      an |= i, e.lanes = i, e.memoizedState = x;
    }
  }
  function fs(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(f(191, l));
        l.call(r);
      }
    }
  }
  var fr = {}, yt = Bt(fr), dr = Bt(fr), pr = Bt(fr);
  function un(e) {
    if (e === fr) throw Error(f(174));
    return e;
  }
  function Io(e, t) {
    switch (ne(pr, t), ne(dr, e), ne(yt, fr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Il(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Il(t, e);
    }
    le(yt), ne(yt, t);
  }
  function On() {
    le(yt), le(dr), le(pr);
  }
  function ds(e) {
    un(pr.current);
    var t = un(yt.current), n = Il(t, e.type);
    t !== n && (ne(dr, e), ne(yt, n));
  }
  function Uo(e) {
    dr.current === e && (le(yt), le(dr));
  }
  var se = Bt(0);
  function il(e) {
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
  var Ao = [];
  function $o() {
    for (var e = 0; e < Ao.length; e++) Ao[e]._workInProgressVersionPrimary = null;
    Ao.length = 0;
  }
  var ul = ce.ReactCurrentDispatcher, Bo = ce.ReactCurrentBatchConfig, sn = 0, ae = null, ye = null, Se = null, sl = !1, mr = !1, hr = 0, cf = 0;
  function Re() {
    throw Error(f(321));
  }
  function Vo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!st(e[n], t[n])) return !1;
    return !0;
  }
  function Wo(e, t, n, r, l, o) {
    if (sn = o, ae = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ul.current = e === null || e.memoizedState === null ? mf : hf, e = n(r, l), mr) {
      o = 0;
      do {
        if (mr = !1, hr = 0, 25 <= o) throw Error(f(301));
        o += 1, Se = ye = null, t.updateQueue = null, ul.current = vf, e = n(r, l);
      } while (mr);
    }
    if (ul.current = fl, t = ye !== null && ye.next !== null, sn = 0, Se = ye = ae = null, sl = !1, t) throw Error(f(300));
    return e;
  }
  function Ho() {
    var e = hr !== 0;
    return hr = 0, e;
  }
  function gt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Se === null ? ae.memoizedState = Se = e : Se = Se.next = e, Se;
  }
  function rt() {
    if (ye === null) {
      var e = ae.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = ye.next;
    var t = Se === null ? ae.memoizedState : Se.next;
    if (t !== null) Se = t, ye = e;
    else {
      if (e === null) throw Error(f(310));
      ye = e, e = { memoizedState: ye.memoizedState, baseState: ye.baseState, baseQueue: ye.baseQueue, queue: ye.queue, next: null }, Se === null ? ae.memoizedState = Se = e : Se = Se.next = e;
    }
    return Se;
  }
  function vr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Qo(e) {
    var t = rt(), n = t.queue;
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
      var u = i = null, a = null, m = o;
      do {
        var S = m.lane;
        if ((sn & S) === S) a !== null && (a = a.next = { lane: 0, action: m.action, hasEagerState: m.hasEagerState, eagerState: m.eagerState, next: null }), r = m.hasEagerState ? m.eagerState : e(r, m.action);
        else {
          var x = {
            lane: S,
            action: m.action,
            hasEagerState: m.hasEagerState,
            eagerState: m.eagerState,
            next: null
          };
          a === null ? (u = a = x, i = r) : a = a.next = x, ae.lanes |= S, an |= S;
        }
        m = m.next;
      } while (m !== null && m !== o);
      a === null ? i = r : a.next = u, st(r, t.memoizedState) || (Be = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = a, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, ae.lanes |= o, an |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Ko(e) {
    var t = rt(), n = t.queue;
    if (n === null) throw Error(f(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = l = l.next;
      do
        o = e(o, i.action), i = i.next;
      while (i !== l);
      st(o, t.memoizedState) || (Be = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function ps() {
  }
  function ms(e, t) {
    var n = ae, r = rt(), l = t(), o = !st(r.memoizedState, l);
    if (o && (r.memoizedState = l, Be = !0), r = r.queue, Yo(ys.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Se !== null && Se.memoizedState.tag & 1) {
      if (n.flags |= 2048, yr(9, vs.bind(null, n, r, l, t), void 0, null), xe === null) throw Error(f(349));
      (sn & 30) !== 0 || hs(n, t, l);
    }
    return l;
  }
  function hs(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ae.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ae.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function vs(e, t, n, r) {
    t.value = n, t.getSnapshot = r, gs(t) && ws(e);
  }
  function ys(e, t, n) {
    return n(function() {
      gs(t) && ws(e);
    });
  }
  function gs(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !st(e, n);
    } catch {
      return !0;
    }
  }
  function ws(e) {
    var t = Nt(e, 1);
    t !== null && pt(t, e, 1, -1);
  }
  function ks(e) {
    var t = gt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: vr, lastRenderedState: e }, t.queue = e, e = e.dispatch = pf.bind(null, ae, e), [t.memoizedState, e];
  }
  function yr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = ae.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ae.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Ss() {
    return rt().memoizedState;
  }
  function al(e, t, n, r) {
    var l = gt();
    ae.flags |= e, l.memoizedState = yr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function cl(e, t, n, r) {
    var l = rt();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (ye !== null) {
      var i = ye.memoizedState;
      if (o = i.destroy, r !== null && Vo(r, i.deps)) {
        l.memoizedState = yr(t, n, o, r);
        return;
      }
    }
    ae.flags |= e, l.memoizedState = yr(1 | t, n, o, r);
  }
  function xs(e, t) {
    return al(8390656, 8, e, t);
  }
  function Yo(e, t) {
    return cl(2048, 8, e, t);
  }
  function Es(e, t) {
    return cl(4, 2, e, t);
  }
  function _s(e, t) {
    return cl(4, 4, e, t);
  }
  function Cs(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Ps(e, t, n) {
    return n = n != null ? n.concat([e]) : null, cl(4, 4, Cs.bind(null, t, e), n);
  }
  function Xo() {
  }
  function Ns(e, t) {
    var n = rt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Vo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function zs(e, t) {
    var n = rt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Vo(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Ts(e, t, n) {
    return (sn & 21) === 0 ? (e.baseState && (e.baseState = !1, Be = !0), e.memoizedState = n) : (st(n, t) || (n = ou(), ae.lanes |= n, an |= n, e.baseState = !0), t);
  }
  function ff(e, t) {
    var n = b;
    b = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Bo.transition;
    Bo.transition = {};
    try {
      e(!1), t();
    } finally {
      b = n, Bo.transition = r;
    }
  }
  function Rs() {
    return rt().memoizedState;
  }
  function df(e, t, n) {
    var r = Gt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, js(e)) Ls(t, n);
    else if (n = ss(e, t, n, r), n !== null) {
      var l = De();
      pt(n, e, r, l), Os(n, t, r);
    }
  }
  function pf(e, t, n) {
    var r = Gt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (js(e)) Ls(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, u = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = u, st(u, i)) {
          var a = t.interleaved;
          a === null ? (l.next = l, Fo(t)) : (l.next = a.next, a.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = ss(e, t, l, r), n !== null && (l = De(), pt(n, e, r, l), Os(n, t, r));
    }
  }
  function js(e) {
    var t = e.alternate;
    return e === ae || t !== null && t === ae;
  }
  function Ls(e, t) {
    mr = sl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Os(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, Gl(e, n);
    }
  }
  var fl = { readContext: nt, useCallback: Re, useContext: Re, useEffect: Re, useImperativeHandle: Re, useInsertionEffect: Re, useLayoutEffect: Re, useMemo: Re, useReducer: Re, useRef: Re, useState: Re, useDebugValue: Re, useDeferredValue: Re, useTransition: Re, useMutableSource: Re, useSyncExternalStore: Re, useId: Re, unstable_isNewReconciler: !1 }, mf = { readContext: nt, useCallback: function(e, t) {
    return gt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: nt, useEffect: xs, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, al(
      4194308,
      4,
      Cs.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return al(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return al(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = gt();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = gt();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = df.bind(null, ae, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = gt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: ks, useDebugValue: Xo, useDeferredValue: function(e) {
    return gt().memoizedState = e;
  }, useTransition: function() {
    var e = ks(!1), t = e[0];
    return e = ff.bind(null, e[1]), gt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = ae, l = gt();
    if (ie) {
      if (n === void 0) throw Error(f(407));
      n = n();
    } else {
      if (n = t(), xe === null) throw Error(f(349));
      (sn & 30) !== 0 || hs(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, xs(ys.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, yr(9, vs.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = gt(), t = xe.identifierPrefix;
    if (ie) {
      var n = Pt, r = Ct;
      n = (r & ~(1 << 32 - ut(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = hr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = cf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, hf = {
    readContext: nt,
    useCallback: Ns,
    useContext: nt,
    useEffect: Yo,
    useImperativeHandle: Ps,
    useInsertionEffect: Es,
    useLayoutEffect: _s,
    useMemo: zs,
    useReducer: Qo,
    useRef: Ss,
    useState: function() {
      return Qo(vr);
    },
    useDebugValue: Xo,
    useDeferredValue: function(e) {
      var t = rt();
      return Ts(t, ye.memoizedState, e);
    },
    useTransition: function() {
      var e = Qo(vr)[0], t = rt().memoizedState;
      return [e, t];
    },
    useMutableSource: ps,
    useSyncExternalStore: ms,
    useId: Rs,
    unstable_isNewReconciler: !1
  }, vf = { readContext: nt, useCallback: Ns, useContext: nt, useEffect: Yo, useImperativeHandle: Ps, useInsertionEffect: Es, useLayoutEffect: _s, useMemo: zs, useReducer: Ko, useRef: Ss, useState: function() {
    return Ko(vr);
  }, useDebugValue: Xo, useDeferredValue: function(e) {
    var t = rt();
    return ye === null ? t.memoizedState = e : Ts(t, ye.memoizedState, e);
  }, useTransition: function() {
    var e = Ko(vr)[0], t = rt().memoizedState;
    return [e, t];
  }, useMutableSource: ps, useSyncExternalStore: ms, useId: Rs, unstable_isNewReconciler: !1 };
  function ct(e, t) {
    if (e && e.defaultProps) {
      t = C({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function Go(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : C({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var dl = { isMounted: function(e) {
    return (e = e._reactInternals) ? en(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = De(), l = Gt(e), o = zt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Qt(e, o, l), t !== null && (pt(t, e, l, r), ll(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = De(), l = Gt(e), o = zt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Qt(e, o, l), t !== null && (pt(t, e, l, r), ll(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = De(), r = Gt(e), l = zt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Qt(e, l, r), t !== null && (pt(t, e, r, n), ll(t, e, r));
  } };
  function Ms(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !rr(n, r) || !rr(l, o) : !0;
  }
  function Fs(e, t, n) {
    var r = !1, l = Vt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = nt(o) : (l = $e(t) ? nn : Te.current, r = t.contextTypes, o = (r = r != null) ? Pn(e, l) : Vt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = dl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Ds(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && dl.enqueueReplaceState(t, t.state, null);
  }
  function Jo(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Do(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = nt(o) : (o = $e(t) ? nn : Te.current, l.context = Pn(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (Go(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && dl.enqueueReplaceState(l, l.state, null), ol(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Mn(e, t) {
    try {
      var n = "", r = t;
      do
        n += $(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function Zo(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function qo(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var yf = typeof WeakMap == "function" ? WeakMap : Map;
  function Is(e, t, n) {
    n = zt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      wl || (wl = !0, pi = r), qo(e, t);
    }, n;
  }
  function Us(e, t, n) {
    n = zt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        qo(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      qo(e, t), typeof r != "function" && (Yt === null ? Yt = /* @__PURE__ */ new Set([this]) : Yt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function As(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new yf();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = jf.bind(null, e, t, n), t.then(e, e));
  }
  function $s(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Bs(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = zt(-1, 1), t.tag = 2, Qt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var gf = ce.ReactCurrentOwner, Be = !1;
  function Fe(e, t, n, r) {
    t.child = e === null ? us(t, null, n, r) : Rn(t, e.child, n, r);
  }
  function Vs(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Ln(t, l), r = Wo(e, t, n, r, o, l), n = Ho(), e !== null && !Be ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Tt(e, t, l)) : (ie && n && Po(t), t.flags |= 1, Fe(e, t, r, l), t.child);
  }
  function Ws(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !ki(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, Hs(e, t, o, r, l)) : (e = Cl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : rr, n(i, r) && e.ref === t.ref) return Tt(e, t, l);
    }
    return t.flags |= 1, e = Zt(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Hs(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (rr(o, r) && e.ref === t.ref) if (Be = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Be = !0);
      else return t.lanes = e.lanes, Tt(e, t, l);
    }
    return bo(e, t, n, r, l);
  }
  function Qs(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, ne(Dn, qe), qe |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, ne(Dn, qe), qe |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, ne(Dn, qe), qe |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, ne(Dn, qe), qe |= r;
    return Fe(e, t, l, n), t.child;
  }
  function Ks(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function bo(e, t, n, r, l) {
    var o = $e(n) ? nn : Te.current;
    return o = Pn(t, o), Ln(t, l), n = Wo(e, t, n, r, o, l), r = Ho(), e !== null && !Be ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Tt(e, t, l)) : (ie && r && Po(t), t.flags |= 1, Fe(e, t, n, l), t.child);
  }
  function Ys(e, t, n, r, l) {
    if ($e(n)) {
      var o = !0;
      Jr(t);
    } else o = !1;
    if (Ln(t, l), t.stateNode === null) ml(e, t), Fs(t, n, r), Jo(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, u = t.memoizedProps;
      i.props = u;
      var a = i.context, m = n.contextType;
      typeof m == "object" && m !== null ? m = nt(m) : (m = $e(n) ? nn : Te.current, m = Pn(t, m));
      var S = n.getDerivedStateFromProps, x = typeof S == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      x || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== r || a !== m) && Ds(t, i, r, m), Ht = !1;
      var k = t.memoizedState;
      i.state = k, ol(t, r, i, l), a = t.memoizedState, u !== r || k !== a || Ae.current || Ht ? (typeof S == "function" && (Go(t, n, S, r), a = t.memoizedState), (u = Ht || Ms(t, n, u, r, k, a, m)) ? (x || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = a), i.props = r, i.state = a, i.context = m, r = u) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, as(e, t), u = t.memoizedProps, m = t.type === t.elementType ? u : ct(t.type, u), i.props = m, x = t.pendingProps, k = i.context, a = n.contextType, typeof a == "object" && a !== null ? a = nt(a) : (a = $e(n) ? nn : Te.current, a = Pn(t, a));
      var N = n.getDerivedStateFromProps;
      (S = typeof N == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== x || k !== a) && Ds(t, i, r, a), Ht = !1, k = t.memoizedState, i.state = k, ol(t, r, i, l);
      var R = t.memoizedState;
      u !== x || k !== R || Ae.current || Ht ? (typeof N == "function" && (Go(t, n, N, r), R = t.memoizedState), (m = Ht || Ms(t, n, m, r, k, R, a) || !1) ? (S || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, R, a), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, R, a)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = R), i.props = r, i.state = R, i.context = a, r = m) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return ei(e, t, n, r, o, l);
  }
  function ei(e, t, n, r, l, o) {
    Ks(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && qu(t, n, !1), Tt(e, t, o);
    r = t.stateNode, gf.current = t;
    var u = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = Rn(t, e.child, null, o), t.child = Rn(t, null, u, o)) : Fe(e, t, u, o), t.memoizedState = r.state, l && qu(t, n, !0), t.child;
  }
  function Xs(e) {
    var t = e.stateNode;
    t.pendingContext ? Ju(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Ju(e, t.context, !1), Io(e, t.containerInfo);
  }
  function Gs(e, t, n, r, l) {
    return Tn(), Ro(l), t.flags |= 256, Fe(e, t, n, r), t.child;
  }
  var ti = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ni(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Js(e, t, n) {
    var r = t.pendingProps, l = se.current, o = !1, i = (t.flags & 128) !== 0, u;
    if ((u = i) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), ne(se, l & 1), e === null)
      return To(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = Pl(i, r, 0, null), e = pn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = ni(n), t.memoizedState = ti, e) : ri(t, i));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return wf(e, t, i, r, u, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, u = l.sibling;
      var a = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = a, t.deletions = null) : (r = Zt(l, a), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? o = Zt(u, o) : (o = pn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? ni(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = ti, r;
    }
    return o = e.child, e = o.sibling, r = Zt(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ri(e, t) {
    return t = Pl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function pl(e, t, n, r) {
    return r !== null && Ro(r), Rn(t, e.child, null, n), e = ri(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function wf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = Zo(Error(f(422))), pl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Pl({ mode: "visible", children: r.children }, l, 0, null), o = pn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && Rn(t, e.child, null, i), t.child.memoizedState = ni(i), t.memoizedState = ti, o);
    if ((t.mode & 1) === 0) return pl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, o = Error(f(419)), r = Zo(o, r, void 0), pl(e, t, i, r);
    }
    if (u = (i & e.childLanes) !== 0, Be || u) {
      if (r = xe, r !== null) {
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Nt(e, l), pt(r, e, l, -1));
      }
      return wi(), r = Zo(Error(f(421))), pl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Lf.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, Ze = $t(l.nextSibling), Je = t, ie = !0, at = null, e !== null && (et[tt++] = Ct, et[tt++] = Pt, et[tt++] = rn, Ct = e.id, Pt = e.overflow, rn = t), t = ri(t, r.children), t.flags |= 4096, t);
  }
  function Zs(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Mo(e.return, t, n);
  }
  function li(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function qs(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (Fe(e, t, r.children, n), r = se.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Zs(e, n, t);
        else if (e.tag === 19) Zs(e, n, t);
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
    if (ne(se, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && il(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), li(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && il(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        li(t, !0, n, null, o);
        break;
      case "together":
        li(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function ml(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Tt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), an |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(f(153));
    if (t.child !== null) {
      for (e = t.child, n = Zt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Zt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function kf(e, t, n) {
    switch (t.tag) {
      case 3:
        Xs(t), Tn();
        break;
      case 5:
        ds(t);
        break;
      case 1:
        $e(t.type) && Jr(t);
        break;
      case 4:
        Io(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        ne(nl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (ne(se, se.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Js(e, t, n) : (ne(se, se.current & 1), e = Tt(e, t, n), e !== null ? e.sibling : null);
        ne(se, se.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return qs(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), ne(se, se.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Qs(e, t, n);
    }
    return Tt(e, t, n);
  }
  var bs, oi, ea, ta;
  bs = function(e, t) {
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
  }, oi = function() {
  }, ea = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, un(yt.current);
      var o = null;
      switch (n) {
        case "input":
          l = Ot(e, l), r = Ot(e, r), o = [];
          break;
        case "select":
          l = C({}, l, { value: void 0 }), r = C({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Dl(e, l), r = Dl(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Yr);
      }
      Ul(n, r);
      var i;
      n = null;
      for (m in l) if (!r.hasOwnProperty(m) && l.hasOwnProperty(m) && l[m] != null) if (m === "style") {
        var u = l[m];
        for (i in u) u.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else m !== "dangerouslySetInnerHTML" && m !== "children" && m !== "suppressContentEditableWarning" && m !== "suppressHydrationWarning" && m !== "autoFocus" && (D.hasOwnProperty(m) ? o || (o = []) : (o = o || []).push(m, null));
      for (m in r) {
        var a = r[m];
        if (u = l != null ? l[m] : void 0, r.hasOwnProperty(m) && a !== u && (a != null || u != null)) if (m === "style") if (u) {
          for (i in u) !u.hasOwnProperty(i) || a && a.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in a) a.hasOwnProperty(i) && u[i] !== a[i] && (n || (n = {}), n[i] = a[i]);
        } else n || (o || (o = []), o.push(
          m,
          n
        )), n = a;
        else m === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, u = u ? u.__html : void 0, a != null && u !== a && (o = o || []).push(m, a)) : m === "children" ? typeof a != "string" && typeof a != "number" || (o = o || []).push(m, "" + a) : m !== "suppressContentEditableWarning" && m !== "suppressHydrationWarning" && (D.hasOwnProperty(m) ? (a != null && m === "onScroll" && re("scroll", e), o || u === a || (o = [])) : (o = o || []).push(m, a));
      }
      n && (o = o || []).push("style", n);
      var m = o;
      (t.updateQueue = m) && (t.flags |= 4);
    }
  }, ta = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function gr(e, t) {
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
  function je(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Sf(e, t, n) {
    var r = t.pendingProps;
    switch (No(t), t.tag) {
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
        return je(t), null;
      case 1:
        return $e(t.type) && Gr(), je(t), null;
      case 3:
        return r = t.stateNode, On(), le(Ae), le(Te), $o(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (el(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, at !== null && (vi(at), at = null))), oi(e, t), je(t), null;
      case 5:
        Uo(t);
        var l = un(pr.current);
        if (n = t.type, e !== null && t.stateNode != null) ea(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(f(166));
            return je(t), null;
          }
          if (e = un(yt.current), el(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[vt] = t, r[sr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                re("cancel", r), re("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                re("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < or.length; l++) re(or[l], r);
                break;
              case "source":
                re("error", r);
                break;
              case "img":
              case "image":
              case "link":
                re(
                  "error",
                  r
                ), re("load", r);
                break;
              case "details":
                re("toggle", r);
                break;
              case "input":
                Fi(r, o), re("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, re("invalid", r);
                break;
              case "textarea":
                Ui(r, o), re("invalid", r);
            }
            Ul(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var u = o[i];
              i === "children" ? typeof u == "string" ? r.textContent !== u && (o.suppressHydrationWarning !== !0 && Kr(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (o.suppressHydrationWarning !== !0 && Kr(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : D.hasOwnProperty(i) && u != null && i === "onScroll" && re("scroll", r);
            }
            switch (n) {
              case "input":
                St(r), Ii(r, o, !0);
                break;
              case "textarea":
                St(r), $i(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = Yr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Bi(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[vt] = t, e[sr] = r, bs(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Al(n, r), n) {
                case "dialog":
                  re("cancel", e), re("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  re("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < or.length; l++) re(or[l], e);
                  l = r;
                  break;
                case "source":
                  re("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  re(
                    "error",
                    e
                  ), re("load", e), l = r;
                  break;
                case "details":
                  re("toggle", e), l = r;
                  break;
                case "input":
                  Fi(e, r), l = Ot(e, r), re("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = C({}, r, { value: void 0 }), re("invalid", e);
                  break;
                case "textarea":
                  Ui(e, r), l = Dl(e, r), re("invalid", e);
                  break;
                default:
                  l = r;
              }
              Ul(n, l), u = l;
              for (o in u) if (u.hasOwnProperty(o)) {
                var a = u[o];
                o === "style" ? Hi(e, a) : o === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && Vi(e, a)) : o === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && $n(e, a) : typeof a == "number" && $n(e, "" + a) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (D.hasOwnProperty(o) ? a != null && o === "onScroll" && re("scroll", e) : a != null && Ke(e, o, a, i));
              }
              switch (n) {
                case "input":
                  St(e), Ii(e, r, !1);
                  break;
                case "textarea":
                  St(e), $i(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + K(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? mn(e, !!r.multiple, o, !1) : r.defaultValue != null && mn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Yr);
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
        return je(t), null;
      case 6:
        if (e && t.stateNode != null) ta(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(f(166));
          if (n = un(pr.current), un(yt.current), el(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[vt] = t, (o = r.nodeValue !== n) && (e = Je, e !== null)) switch (e.tag) {
              case 3:
                Kr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Kr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[vt] = t, t.stateNode = r;
        }
        return je(t), null;
      case 13:
        if (le(se), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ie && Ze !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) ls(), Tn(), t.flags |= 98560, o = !1;
          else if (o = el(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(f(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(f(317));
              o[vt] = t;
            } else Tn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            je(t), o = !1;
          } else at !== null && (vi(at), at = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (se.current & 1) !== 0 ? ge === 0 && (ge = 3) : wi())), t.updateQueue !== null && (t.flags |= 4), je(t), null);
      case 4:
        return On(), oi(e, t), e === null && ir(t.stateNode.containerInfo), je(t), null;
      case 10:
        return Oo(t.type._context), je(t), null;
      case 17:
        return $e(t.type) && Gr(), je(t), null;
      case 19:
        if (le(se), o = t.memoizedState, o === null) return je(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) gr(o, !1);
        else {
          if (ge !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = il(e), i !== null) {
              for (t.flags |= 128, gr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return ne(se, se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && pe() > In && (t.flags |= 128, r = !0, gr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = il(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), gr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ie) return je(t), null;
          } else 2 * pe() - o.renderingStartTime > In && n !== 1073741824 && (t.flags |= 128, r = !0, gr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = pe(), t.sibling = null, n = se.current, ne(se, r ? n & 1 | 2 : n & 1), t) : (je(t), null);
      case 22:
      case 23:
        return gi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (qe & 1073741824) !== 0 && (je(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : je(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(f(156, t.tag));
  }
  function xf(e, t) {
    switch (No(t), t.tag) {
      case 1:
        return $e(t.type) && Gr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return On(), le(Ae), le(Te), $o(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Uo(t), null;
      case 13:
        if (le(se), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(f(340));
          Tn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return le(se), null;
      case 4:
        return On(), null;
      case 10:
        return Oo(t.type._context), null;
      case 22:
      case 23:
        return gi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var hl = !1, Le = !1, Ef = typeof WeakSet == "function" ? WeakSet : Set, T = null;
  function Fn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      fe(e, t, r);
    }
    else n.current = null;
  }
  function ii(e, t, n) {
    try {
      n();
    } catch (r) {
      fe(e, t, r);
    }
  }
  var na = !1;
  function _f(e, t) {
    if (go = Fr, e = Mu(), ao(e)) {
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
          var i = 0, u = -1, a = -1, m = 0, S = 0, x = e, k = null;
          t: for (; ; ) {
            for (var N; x !== n || l !== 0 && x.nodeType !== 3 || (u = i + l), x !== o || r !== 0 && x.nodeType !== 3 || (a = i + r), x.nodeType === 3 && (i += x.nodeValue.length), (N = x.firstChild) !== null; )
              k = x, x = N;
            for (; ; ) {
              if (x === e) break t;
              if (k === n && ++m === l && (u = i), k === o && ++S === r && (a = i), (N = x.nextSibling) !== null) break;
              x = k, k = x.parentNode;
            }
            x = N;
          }
          n = u === -1 || a === -1 ? null : { start: u, end: a };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (wo = { focusedElem: e, selectionRange: n }, Fr = !1, T = t; T !== null; ) if (t = T, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, T = e;
    else for (; T !== null; ) {
      t = T;
      try {
        var R = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (R !== null) {
              var L = R.memoizedProps, me = R.memoizedState, d = t.stateNode, c = d.getSnapshotBeforeUpdate(t.elementType === t.type ? L : ct(t.type, L), me);
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
        fe(t, t.return, E);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, T = e;
        break;
      }
      T = t.return;
    }
    return R = na, na = !1, R;
  }
  function wr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && ii(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function vl(e, t) {
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
  function ui(e) {
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
  function ra(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ra(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[vt], delete t[sr], delete t[Eo], delete t[of], delete t[uf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function la(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function oa(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || la(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function si(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Yr));
    else if (r !== 4 && (e = e.child, e !== null)) for (si(e, t, n), e = e.sibling; e !== null; ) si(e, t, n), e = e.sibling;
  }
  function ai(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (ai(e, t, n), e = e.sibling; e !== null; ) ai(e, t, n), e = e.sibling;
  }
  var _e = null, ft = !1;
  function Kt(e, t, n) {
    for (n = n.child; n !== null; ) ia(e, t, n), n = n.sibling;
  }
  function ia(e, t, n) {
    if (ht && typeof ht.onCommitFiberUnmount == "function") try {
      ht.onCommitFiberUnmount(Tr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Le || Fn(n, t);
      case 6:
        var r = _e, l = ft;
        _e = null, Kt(e, t, n), _e = r, ft = l, _e !== null && (ft ? (e = _e, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : _e.removeChild(n.stateNode));
        break;
      case 18:
        _e !== null && (ft ? (e = _e, n = n.stateNode, e.nodeType === 8 ? xo(e.parentNode, n) : e.nodeType === 1 && xo(e, n), Zn(e)) : xo(_e, n.stateNode));
        break;
      case 4:
        r = _e, l = ft, _e = n.stateNode.containerInfo, ft = !0, Kt(e, t, n), _e = r, ft = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Le && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && ii(n, t, i), l = l.next;
          } while (l !== r);
        }
        Kt(e, t, n);
        break;
      case 1:
        if (!Le && (Fn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          fe(n, t, u);
        }
        Kt(e, t, n);
        break;
      case 21:
        Kt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Le = (r = Le) || n.memoizedState !== null, Kt(e, t, n), Le = r) : Kt(e, t, n);
        break;
      default:
        Kt(e, t, n);
    }
  }
  function ua(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Ef()), t.forEach(function(r) {
        var l = Of.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function dt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, u = i;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              _e = u.stateNode, ft = !1;
              break e;
            case 3:
              _e = u.stateNode.containerInfo, ft = !0;
              break e;
            case 4:
              _e = u.stateNode.containerInfo, ft = !0;
              break e;
          }
          u = u.return;
        }
        if (_e === null) throw Error(f(160));
        ia(o, i, l), _e = null, ft = !1;
        var a = l.alternate;
        a !== null && (a.return = null), l.return = null;
      } catch (m) {
        fe(l, t, m);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) sa(t, e), t = t.sibling;
  }
  function sa(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (dt(t, e), wt(e), r & 4) {
          try {
            wr(3, e, e.return), vl(3, e);
          } catch (L) {
            fe(e, e.return, L);
          }
          try {
            wr(5, e, e.return);
          } catch (L) {
            fe(e, e.return, L);
          }
        }
        break;
      case 1:
        dt(t, e), wt(e), r & 512 && n !== null && Fn(n, n.return);
        break;
      case 5:
        if (dt(t, e), wt(e), r & 512 && n !== null && Fn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            $n(l, "");
          } catch (L) {
            fe(e, e.return, L);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, u = e.type, a = e.updateQueue;
          if (e.updateQueue = null, a !== null) try {
            u === "input" && o.type === "radio" && o.name != null && Di(l, o), Al(u, i);
            var m = Al(u, o);
            for (i = 0; i < a.length; i += 2) {
              var S = a[i], x = a[i + 1];
              S === "style" ? Hi(l, x) : S === "dangerouslySetInnerHTML" ? Vi(l, x) : S === "children" ? $n(l, x) : Ke(l, S, x, m);
            }
            switch (u) {
              case "input":
                Ml(l, o);
                break;
              case "textarea":
                Ai(l, o);
                break;
              case "select":
                var k = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var N = o.value;
                N != null ? mn(l, !!o.multiple, N, !1) : k !== !!o.multiple && (o.defaultValue != null ? mn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : mn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[sr] = o;
          } catch (L) {
            fe(e, e.return, L);
          }
        }
        break;
      case 6:
        if (dt(t, e), wt(e), r & 4) {
          if (e.stateNode === null) throw Error(f(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (L) {
            fe(e, e.return, L);
          }
        }
        break;
      case 3:
        if (dt(t, e), wt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          Zn(t.containerInfo);
        } catch (L) {
          fe(e, e.return, L);
        }
        break;
      case 4:
        dt(t, e), wt(e);
        break;
      case 13:
        dt(t, e), wt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (di = pe())), r & 4 && ua(e);
        break;
      case 22:
        if (S = n !== null && n.memoizedState !== null, e.mode & 1 ? (Le = (m = Le) || S, dt(t, e), Le = m) : dt(t, e), wt(e), r & 8192) {
          if (m = e.memoizedState !== null, (e.stateNode.isHidden = m) && !S && (e.mode & 1) !== 0) for (T = e, S = e.child; S !== null; ) {
            for (x = T = S; T !== null; ) {
              switch (k = T, N = k.child, k.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  wr(4, k, k.return);
                  break;
                case 1:
                  Fn(k, k.return);
                  var R = k.stateNode;
                  if (typeof R.componentWillUnmount == "function") {
                    r = k, n = k.return;
                    try {
                      t = r, R.props = t.memoizedProps, R.state = t.memoizedState, R.componentWillUnmount();
                    } catch (L) {
                      fe(r, n, L);
                    }
                  }
                  break;
                case 5:
                  Fn(k, k.return);
                  break;
                case 22:
                  if (k.memoizedState !== null) {
                    fa(x);
                    continue;
                  }
              }
              N !== null ? (N.return = k, T = N) : fa(x);
            }
            S = S.sibling;
          }
          e: for (S = null, x = e; ; ) {
            if (x.tag === 5) {
              if (S === null) {
                S = x;
                try {
                  l = x.stateNode, m ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (u = x.stateNode, a = x.memoizedProps.style, i = a != null && a.hasOwnProperty("display") ? a.display : null, u.style.display = Wi("display", i));
                } catch (L) {
                  fe(e, e.return, L);
                }
              }
            } else if (x.tag === 6) {
              if (S === null) try {
                x.stateNode.nodeValue = m ? "" : x.memoizedProps;
              } catch (L) {
                fe(e, e.return, L);
              }
            } else if ((x.tag !== 22 && x.tag !== 23 || x.memoizedState === null || x === e) && x.child !== null) {
              x.child.return = x, x = x.child;
              continue;
            }
            if (x === e) break e;
            for (; x.sibling === null; ) {
              if (x.return === null || x.return === e) break e;
              S === x && (S = null), x = x.return;
            }
            S === x && (S = null), x.sibling.return = x.return, x = x.sibling;
          }
        }
        break;
      case 19:
        dt(t, e), wt(e), r & 4 && ua(e);
        break;
      case 21:
        break;
      default:
        dt(
          t,
          e
        ), wt(e);
    }
  }
  function wt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (la(n)) {
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
            r.flags & 32 && ($n(l, ""), r.flags &= -33);
            var o = oa(e);
            ai(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, u = oa(e);
            si(e, u, i);
            break;
          default:
            throw Error(f(161));
        }
      } catch (a) {
        fe(e, e.return, a);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Cf(e, t, n) {
    T = e, aa(e);
  }
  function aa(e, t, n) {
    for (var r = (e.mode & 1) !== 0; T !== null; ) {
      var l = T, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || hl;
        if (!i) {
          var u = l.alternate, a = u !== null && u.memoizedState !== null || Le;
          u = hl;
          var m = Le;
          if (hl = i, (Le = a) && !m) for (T = l; T !== null; ) i = T, a = i.child, i.tag === 22 && i.memoizedState !== null ? da(l) : a !== null ? (a.return = i, T = a) : da(l);
          for (; o !== null; ) T = o, aa(o), o = o.sibling;
          T = l, hl = u, Le = m;
        }
        ca(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, T = o) : ca(e);
    }
  }
  function ca(e) {
    for (; T !== null; ) {
      var t = T;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Le || vl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Le) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : ct(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && fs(t, o, r);
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
                fs(t, i, n);
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
                var m = t.alternate;
                if (m !== null) {
                  var S = m.memoizedState;
                  if (S !== null) {
                    var x = S.dehydrated;
                    x !== null && Zn(x);
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
          Le || t.flags & 512 && ui(t);
        } catch (k) {
          fe(t, t.return, k);
        }
      }
      if (t === e) {
        T = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, T = n;
        break;
      }
      T = t.return;
    }
  }
  function fa(e) {
    for (; T !== null; ) {
      var t = T;
      if (t === e) {
        T = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, T = n;
        break;
      }
      T = t.return;
    }
  }
  function da(e) {
    for (; T !== null; ) {
      var t = T;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              vl(4, t);
            } catch (a) {
              fe(t, n, a);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (a) {
                fe(t, l, a);
              }
            }
            var o = t.return;
            try {
              ui(t);
            } catch (a) {
              fe(t, o, a);
            }
            break;
          case 5:
            var i = t.return;
            try {
              ui(t);
            } catch (a) {
              fe(t, i, a);
            }
        }
      } catch (a) {
        fe(t, t.return, a);
      }
      if (t === e) {
        T = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, T = u;
        break;
      }
      T = t.return;
    }
  }
  var Pf = Math.ceil, yl = ce.ReactCurrentDispatcher, ci = ce.ReactCurrentOwner, lt = ce.ReactCurrentBatchConfig, Y = 0, xe = null, he = null, Ce = 0, qe = 0, Dn = Bt(0), ge = 0, kr = null, an = 0, gl = 0, fi = 0, Sr = null, Ve = null, di = 0, In = 1 / 0, Rt = null, wl = !1, pi = null, Yt = null, kl = !1, Xt = null, Sl = 0, xr = 0, mi = null, xl = -1, El = 0;
  function De() {
    return (Y & 6) !== 0 ? pe() : xl !== -1 ? xl : xl = pe();
  }
  function Gt(e) {
    return (e.mode & 1) === 0 ? 1 : (Y & 2) !== 0 && Ce !== 0 ? Ce & -Ce : af.transition !== null ? (El === 0 && (El = ou()), El) : (e = b, e !== 0 || (e = window.event, e = e === void 0 ? 16 : mu(e.type)), e);
  }
  function pt(e, t, n, r) {
    if (50 < xr) throw xr = 0, mi = null, Error(f(185));
    Kn(e, n, r), ((Y & 2) === 0 || e !== xe) && (e === xe && ((Y & 2) === 0 && (gl |= n), ge === 4 && Jt(e, Ce)), We(e, r), n === 1 && Y === 0 && (t.mode & 1) === 0 && (In = pe() + 500, Zr && Wt()));
  }
  function We(e, t) {
    var n = e.callbackNode;
    sc(e, t);
    var r = Lr(e, e === xe ? Ce : 0);
    if (r === 0) n !== null && nu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && nu(n), t === 1) e.tag === 0 ? sf(ma.bind(null, e)) : bu(ma.bind(null, e)), rf(function() {
        (Y & 6) === 0 && Wt();
      }), n = null;
      else {
        switch (iu(r)) {
          case 1:
            n = Kl;
            break;
          case 4:
            n = ru;
            break;
          case 16:
            n = zr;
            break;
          case 536870912:
            n = lu;
            break;
          default:
            n = zr;
        }
        n = xa(n, pa.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function pa(e, t) {
    if (xl = -1, El = 0, (Y & 6) !== 0) throw Error(f(327));
    var n = e.callbackNode;
    if (Un() && e.callbackNode !== n) return null;
    var r = Lr(e, e === xe ? Ce : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = _l(e, r);
    else {
      t = r;
      var l = Y;
      Y |= 2;
      var o = va();
      (xe !== e || Ce !== t) && (Rt = null, In = pe() + 500, fn(e, t));
      do
        try {
          Tf();
          break;
        } catch (u) {
          ha(e, u);
        }
      while (!0);
      Lo(), yl.current = o, Y = l, he !== null ? t = 0 : (xe = null, Ce = 0, t = ge);
    }
    if (t !== 0) {
      if (t === 2 && (l = Yl(e), l !== 0 && (r = l, t = hi(e, l))), t === 1) throw n = kr, fn(e, 0), Jt(e, r), We(e, pe()), n;
      if (t === 6) Jt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Nf(l) && (t = _l(e, r), t === 2 && (o = Yl(e), o !== 0 && (r = o, t = hi(e, o))), t === 1)) throw n = kr, fn(e, 0), Jt(e, r), We(e, pe()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(f(345));
          case 2:
            dn(e, Ve, Rt);
            break;
          case 3:
            if (Jt(e, r), (r & 130023424) === r && (t = di + 500 - pe(), 10 < t)) {
              if (Lr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                De(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = So(dn.bind(null, e, Ve, Rt), t);
              break;
            }
            dn(e, Ve, Rt);
            break;
          case 4:
            if (Jt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - ut(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = pe() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Pf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = So(dn.bind(null, e, Ve, Rt), r);
              break;
            }
            dn(e, Ve, Rt);
            break;
          case 5:
            dn(e, Ve, Rt);
            break;
          default:
            throw Error(f(329));
        }
      }
    }
    return We(e, pe()), e.callbackNode === n ? pa.bind(null, e) : null;
  }
  function hi(e, t) {
    var n = Sr;
    return e.current.memoizedState.isDehydrated && (fn(e, t).flags |= 256), e = _l(e, t), e !== 2 && (t = Ve, Ve = n, t !== null && vi(t)), e;
  }
  function vi(e) {
    Ve === null ? Ve = e : Ve.push.apply(Ve, e);
  }
  function Nf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], o = l.getSnapshot;
          l = l.value;
          try {
            if (!st(o(), l)) return !1;
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
  function Jt(e, t) {
    for (t &= ~fi, t &= ~gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ut(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function ma(e) {
    if ((Y & 6) !== 0) throw Error(f(327));
    Un();
    var t = Lr(e, 0);
    if ((t & 1) === 0) return We(e, pe()), null;
    var n = _l(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = Yl(e);
      r !== 0 && (t = r, n = hi(e, r));
    }
    if (n === 1) throw n = kr, fn(e, 0), Jt(e, t), We(e, pe()), n;
    if (n === 6) throw Error(f(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, dn(e, Ve, Rt), We(e, pe()), null;
  }
  function yi(e, t) {
    var n = Y;
    Y |= 1;
    try {
      return e(t);
    } finally {
      Y = n, Y === 0 && (In = pe() + 500, Zr && Wt());
    }
  }
  function cn(e) {
    Xt !== null && Xt.tag === 0 && (Y & 6) === 0 && Un();
    var t = Y;
    Y |= 1;
    var n = lt.transition, r = b;
    try {
      if (lt.transition = null, b = 1, e) return e();
    } finally {
      b = r, lt.transition = n, Y = t, (Y & 6) === 0 && Wt();
    }
  }
  function gi() {
    qe = Dn.current, le(Dn);
  }
  function fn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, nf(n)), he !== null) for (n = he.return; n !== null; ) {
      var r = n;
      switch (No(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Gr();
          break;
        case 3:
          On(), le(Ae), le(Te), $o();
          break;
        case 5:
          Uo(r);
          break;
        case 4:
          On();
          break;
        case 13:
          le(se);
          break;
        case 19:
          le(se);
          break;
        case 10:
          Oo(r.type._context);
          break;
        case 22:
        case 23:
          gi();
      }
      n = n.return;
    }
    if (xe = e, he = e = Zt(e.current, null), Ce = qe = t, ge = 0, kr = null, fi = gl = an = 0, Ve = Sr = null, on !== null) {
      for (t = 0; t < on.length; t++) if (n = on[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      on = null;
    }
    return e;
  }
  function ha(e, t) {
    do {
      var n = he;
      try {
        if (Lo(), ul.current = fl, sl) {
          for (var r = ae.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          sl = !1;
        }
        if (sn = 0, Se = ye = ae = null, mr = !1, hr = 0, ci.current = null, n === null || n.return === null) {
          ge = 1, kr = t, he = null;
          break;
        }
        e: {
          var o = e, i = n.return, u = n, a = t;
          if (t = Ce, u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
            var m = a, S = u, x = S.tag;
            if ((S.mode & 1) === 0 && (x === 0 || x === 11 || x === 15)) {
              var k = S.alternate;
              k ? (S.updateQueue = k.updateQueue, S.memoizedState = k.memoizedState, S.lanes = k.lanes) : (S.updateQueue = null, S.memoizedState = null);
            }
            var N = $s(i);
            if (N !== null) {
              N.flags &= -257, Bs(N, i, u, o, t), N.mode & 1 && As(o, m, t), t = N, a = m;
              var R = t.updateQueue;
              if (R === null) {
                var L = /* @__PURE__ */ new Set();
                L.add(a), t.updateQueue = L;
              } else R.add(a);
              break e;
            } else {
              if ((t & 1) === 0) {
                As(o, m, t), wi();
                break e;
              }
              a = Error(f(426));
            }
          } else if (ie && u.mode & 1) {
            var me = $s(i);
            if (me !== null) {
              (me.flags & 65536) === 0 && (me.flags |= 256), Bs(me, i, u, o, t), Ro(Mn(a, u));
              break e;
            }
          }
          o = a = Mn(a, u), ge !== 4 && (ge = 2), Sr === null ? Sr = [o] : Sr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var d = Is(o, a, t);
                cs(o, d);
                break e;
              case 1:
                u = a;
                var c = o.type, p = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof c.getDerivedStateFromError == "function" || p !== null && typeof p.componentDidCatch == "function" && (Yt === null || !Yt.has(p)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var E = Us(o, u, t);
                  cs(o, E);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        ga(n);
      } catch (O) {
        t = O, he === n && n !== null && (he = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function va() {
    var e = yl.current;
    return yl.current = fl, e === null ? fl : e;
  }
  function wi() {
    (ge === 0 || ge === 3 || ge === 2) && (ge = 4), xe === null || (an & 268435455) === 0 && (gl & 268435455) === 0 || Jt(xe, Ce);
  }
  function _l(e, t) {
    var n = Y;
    Y |= 2;
    var r = va();
    (xe !== e || Ce !== t) && (Rt = null, fn(e, t));
    do
      try {
        zf();
        break;
      } catch (l) {
        ha(e, l);
      }
    while (!0);
    if (Lo(), Y = n, yl.current = r, he !== null) throw Error(f(261));
    return xe = null, Ce = 0, ge;
  }
  function zf() {
    for (; he !== null; ) ya(he);
  }
  function Tf() {
    for (; he !== null && !ba(); ) ya(he);
  }
  function ya(e) {
    var t = Sa(e.alternate, e, qe);
    e.memoizedProps = e.pendingProps, t === null ? ga(e) : he = t, ci.current = null;
  }
  function ga(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Sf(n, t, qe), n !== null) {
          he = n;
          return;
        }
      } else {
        if (n = xf(n, t), n !== null) {
          n.flags &= 32767, he = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          ge = 6, he = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        he = t;
        return;
      }
      he = t = e;
    } while (t !== null);
    ge === 0 && (ge = 5);
  }
  function dn(e, t, n) {
    var r = b, l = lt.transition;
    try {
      lt.transition = null, b = 1, Rf(e, t, n, r);
    } finally {
      lt.transition = l, b = r;
    }
    return null;
  }
  function Rf(e, t, n, r) {
    do
      Un();
    while (Xt !== null);
    if ((Y & 6) !== 0) throw Error(f(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(f(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (ac(e, o), e === xe && (he = xe = null, Ce = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || kl || (kl = !0, xa(zr, function() {
      return Un(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = lt.transition, lt.transition = null;
      var i = b;
      b = 1;
      var u = Y;
      Y |= 4, ci.current = null, _f(e, n), sa(n, e), Gc(wo), Fr = !!go, wo = go = null, e.current = n, Cf(n), ec(), Y = u, b = i, lt.transition = o;
    } else e.current = n;
    if (kl && (kl = !1, Xt = e, Sl = l), o = e.pendingLanes, o === 0 && (Yt = null), rc(n.stateNode), We(e, pe()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (wl) throw wl = !1, e = pi, pi = null, e;
    return (Sl & 1) !== 0 && e.tag !== 0 && Un(), o = e.pendingLanes, (o & 1) !== 0 ? e === mi ? xr++ : (xr = 0, mi = e) : xr = 0, Wt(), null;
  }
  function Un() {
    if (Xt !== null) {
      var e = iu(Sl), t = lt.transition, n = b;
      try {
        if (lt.transition = null, b = 16 > e ? 16 : e, Xt === null) var r = !1;
        else {
          if (e = Xt, Xt = null, Sl = 0, (Y & 6) !== 0) throw Error(f(331));
          var l = Y;
          for (Y |= 4, T = e.current; T !== null; ) {
            var o = T, i = o.child;
            if ((T.flags & 16) !== 0) {
              var u = o.deletions;
              if (u !== null) {
                for (var a = 0; a < u.length; a++) {
                  var m = u[a];
                  for (T = m; T !== null; ) {
                    var S = T;
                    switch (S.tag) {
                      case 0:
                      case 11:
                      case 15:
                        wr(8, S, o);
                    }
                    var x = S.child;
                    if (x !== null) x.return = S, T = x;
                    else for (; T !== null; ) {
                      S = T;
                      var k = S.sibling, N = S.return;
                      if (ra(S), S === m) {
                        T = null;
                        break;
                      }
                      if (k !== null) {
                        k.return = N, T = k;
                        break;
                      }
                      T = N;
                    }
                  }
                }
                var R = o.alternate;
                if (R !== null) {
                  var L = R.child;
                  if (L !== null) {
                    R.child = null;
                    do {
                      var me = L.sibling;
                      L.sibling = null, L = me;
                    } while (L !== null);
                  }
                }
                T = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, T = i;
            else e: for (; T !== null; ) {
              if (o = T, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  wr(9, o, o.return);
              }
              var d = o.sibling;
              if (d !== null) {
                d.return = o.return, T = d;
                break e;
              }
              T = o.return;
            }
          }
          var c = e.current;
          for (T = c; T !== null; ) {
            i = T;
            var p = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && p !== null) p.return = i, T = p;
            else e: for (i = c; T !== null; ) {
              if (u = T, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    vl(9, u);
                }
              } catch (O) {
                fe(u, u.return, O);
              }
              if (u === i) {
                T = null;
                break e;
              }
              var E = u.sibling;
              if (E !== null) {
                E.return = u.return, T = E;
                break e;
              }
              T = u.return;
            }
          }
          if (Y = l, Wt(), ht && typeof ht.onPostCommitFiberRoot == "function") try {
            ht.onPostCommitFiberRoot(Tr, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        b = n, lt.transition = t;
      }
    }
    return !1;
  }
  function wa(e, t, n) {
    t = Mn(n, t), t = Is(e, t, 1), e = Qt(e, t, 1), t = De(), e !== null && (Kn(e, 1, t), We(e, t));
  }
  function fe(e, t, n) {
    if (e.tag === 3) wa(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        wa(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Yt === null || !Yt.has(r))) {
          e = Mn(n, e), e = Us(t, e, 1), t = Qt(t, e, 1), e = De(), t !== null && (Kn(t, 1, e), We(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function jf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = De(), e.pingedLanes |= e.suspendedLanes & n, xe === e && (Ce & n) === n && (ge === 4 || ge === 3 && (Ce & 130023424) === Ce && 500 > pe() - di ? fn(e, 0) : fi |= n), We(e, t);
  }
  function ka(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = jr, jr <<= 1, (jr & 130023424) === 0 && (jr = 4194304)));
    var n = De();
    e = Nt(e, t), e !== null && (Kn(e, t, n), We(e, n));
  }
  function Lf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), ka(e, n);
  }
  function Of(e, t) {
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
    r !== null && r.delete(t), ka(e, n);
  }
  var Sa;
  Sa = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ae.current) Be = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Be = !1, kf(e, t, n);
      Be = (e.flags & 131072) !== 0;
    }
    else Be = !1, ie && (t.flags & 1048576) !== 0 && es(t, br, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        ml(e, t), e = t.pendingProps;
        var l = Pn(t, Te.current);
        Ln(t, n), l = Wo(null, t, r, e, l, n);
        var o = Ho();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, $e(r) ? (o = !0, Jr(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Do(t), l.updater = dl, t.stateNode = l, l._reactInternals = t, Jo(t, r, e, n), t = ei(null, t, r, !0, o, n)) : (t.tag = 0, ie && o && Po(t), Fe(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (ml(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Ff(r), e = ct(r, e), l) {
            case 0:
              t = bo(null, t, r, e, n);
              break e;
            case 1:
              t = Ys(null, t, r, e, n);
              break e;
            case 11:
              t = Vs(null, t, r, e, n);
              break e;
            case 14:
              t = Ws(null, t, r, ct(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ct(r, l), bo(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ct(r, l), Ys(e, t, r, l, n);
      case 3:
        e: {
          if (Xs(t), e === null) throw Error(f(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, as(e, t), ol(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Mn(Error(f(423)), t), t = Gs(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Mn(Error(f(424)), t), t = Gs(e, t, r, n, l);
            break e;
          } else for (Ze = $t(t.stateNode.containerInfo.firstChild), Je = t, ie = !0, at = null, n = us(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Tn(), r === l) {
              t = Tt(e, t, n);
              break e;
            }
            Fe(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return ds(t), e === null && To(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, ko(r, l) ? i = null : o !== null && ko(r, o) && (t.flags |= 32), Ks(e, t), Fe(e, t, i, n), t.child;
      case 6:
        return e === null && To(t), null;
      case 13:
        return Js(e, t, n);
      case 4:
        return Io(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Rn(t, null, r, n) : Fe(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ct(r, l), Vs(e, t, r, l, n);
      case 7:
        return Fe(e, t, t.pendingProps, n), t.child;
      case 8:
        return Fe(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Fe(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, ne(nl, r._currentValue), r._currentValue = i, o !== null) if (st(o.value, i)) {
            if (o.children === l.children && !Ae.current) {
              t = Tt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var u = o.dependencies;
            if (u !== null) {
              i = o.child;
              for (var a = u.firstContext; a !== null; ) {
                if (a.context === r) {
                  if (o.tag === 1) {
                    a = zt(-1, n & -n), a.tag = 2;
                    var m = o.updateQueue;
                    if (m !== null) {
                      m = m.shared;
                      var S = m.pending;
                      S === null ? a.next = a : (a.next = S.next, S.next = a), m.pending = a;
                    }
                  }
                  o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), Mo(
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
              i.lanes |= n, u = i.alternate, u !== null && (u.lanes |= n), Mo(i, n, t), i = o.sibling;
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
          Fe(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Ln(t, n), l = nt(l), r = r(l), t.flags |= 1, Fe(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = ct(r, t.pendingProps), l = ct(r.type, l), Ws(e, t, r, l, n);
      case 15:
        return Hs(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ct(r, l), ml(e, t), t.tag = 1, $e(r) ? (e = !0, Jr(t)) : e = !1, Ln(t, n), Fs(t, r, l), Jo(t, r, l, n), ei(null, t, r, !0, e, n);
      case 19:
        return qs(e, t, n);
      case 22:
        return Qs(e, t, n);
    }
    throw Error(f(156, t.tag));
  };
  function xa(e, t) {
    return tu(e, t);
  }
  function Mf(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ot(e, t, n, r) {
    return new Mf(e, t, n, r);
  }
  function ki(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Ff(e) {
    if (typeof e == "function") return ki(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === Ye) return 11;
      if (e === be) return 14;
    }
    return 2;
  }
  function Zt(e, t) {
    var n = e.alternate;
    return n === null ? (n = ot(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Cl(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") ki(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case we:
        return pn(n.children, l, o, t);
      case Ue:
        i = 8, l |= 8;
        break;
      case mt:
        return e = ot(12, n, t, l | 2), e.elementType = mt, e.lanes = o, e;
      case Me:
        return e = ot(13, n, t, l), e.elementType = Me, e.lanes = o, e;
      case Xe:
        return e = ot(19, n, t, l), e.elementType = Xe, e.lanes = o, e;
      case g:
        return Pl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case it:
            i = 10;
            break e;
          case kt:
            i = 9;
            break e;
          case Ye:
            i = 11;
            break e;
          case be:
            i = 14;
            break e;
          case ze:
            i = 16, r = null;
            break e;
        }
        throw Error(f(130, e == null ? e : typeof e, ""));
    }
    return t = ot(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function pn(e, t, n, r) {
    return e = ot(7, e, r, t), e.lanes = n, e;
  }
  function Pl(e, t, n, r) {
    return e = ot(22, e, r, t), e.elementType = g, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Si(e, t, n) {
    return e = ot(6, e, null, t), e.lanes = n, e;
  }
  function xi(e, t, n) {
    return t = ot(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Df(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Xl(0), this.expirationTimes = Xl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ei(e, t, n, r, l, o, i, u, a) {
    return e = new Df(e, t, n, u, a), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = ot(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Do(o), e;
  }
  function If(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ve, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Ea(e) {
    if (!e) return Vt;
    e = e._reactInternals;
    e: {
      if (en(e) !== e || e.tag !== 1) throw Error(f(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if ($e(t.type)) {
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
      if ($e(n)) return Zu(e, n, t);
    }
    return t;
  }
  function _a(e, t, n, r, l, o, i, u, a) {
    return e = Ei(n, r, !0, e, l, o, i, u, a), e.context = Ea(null), n = e.current, r = De(), l = Gt(n), o = zt(r, l), o.callback = t ?? null, Qt(n, o, l), e.current.lanes = l, Kn(e, l, r), We(e, r), e;
  }
  function Nl(e, t, n, r) {
    var l = t.current, o = De(), i = Gt(l);
    return n = Ea(n), t.context === null ? t.context = n : t.pendingContext = n, t = zt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Qt(l, t, i), e !== null && (pt(e, l, i, o), ll(e, l, i)), i;
  }
  function zl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Ca(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function _i(e, t) {
    Ca(e, t), (e = e.alternate) && Ca(e, t);
  }
  function Uf() {
    return null;
  }
  var Pa = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ci(e) {
    this._internalRoot = e;
  }
  Tl.prototype.render = Ci.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(f(409));
    Nl(e, t, null, null);
  }, Tl.prototype.unmount = Ci.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      cn(function() {
        Nl(null, e, null, null);
      }), t[Et] = null;
    }
  };
  function Tl(e) {
    this._internalRoot = e;
  }
  Tl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = au();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < It.length && t !== 0 && t < It[n].priority; n++) ;
      It.splice(n, 0, e), n === 0 && du(e);
    }
  };
  function Pi(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Rl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Na() {
  }
  function Af(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var m = zl(i);
          o.call(m);
        };
      }
      var i = _a(t, r, e, 0, null, !1, !1, "", Na);
      return e._reactRootContainer = i, e[Et] = i.current, ir(e.nodeType === 8 ? e.parentNode : e), cn(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var m = zl(a);
        u.call(m);
      };
    }
    var a = Ei(e, 0, !1, null, null, !1, !1, "", Na);
    return e._reactRootContainer = a, e[Et] = a.current, ir(e.nodeType === 8 ? e.parentNode : e), cn(function() {
      Nl(t, a, n, r);
    }), a;
  }
  function jl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var a = zl(i);
          u.call(a);
        };
      }
      Nl(t, i, e, l);
    } else i = Af(n, t, e, l, r);
    return zl(i);
  }
  uu = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Qn(t.pendingLanes);
          n !== 0 && (Gl(t, n | 1), We(t, pe()), (Y & 6) === 0 && (In = pe() + 500, Wt()));
        }
        break;
      case 13:
        cn(function() {
          var r = Nt(e, 1);
          if (r !== null) {
            var l = De();
            pt(r, e, 1, l);
          }
        }), _i(e, 1);
    }
  }, Jl = function(e) {
    if (e.tag === 13) {
      var t = Nt(e, 134217728);
      if (t !== null) {
        var n = De();
        pt(t, e, 134217728, n);
      }
      _i(e, 134217728);
    }
  }, su = function(e) {
    if (e.tag === 13) {
      var t = Gt(e), n = Nt(e, t);
      if (n !== null) {
        var r = De();
        pt(n, e, t, r);
      }
      _i(e, t);
    }
  }, au = function() {
    return b;
  }, cu = function(e, t) {
    var n = b;
    try {
      return b = e, t();
    } finally {
      b = n;
    }
  }, Vl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Ml(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = Xr(r);
              if (!l) throw Error(f(90));
              xt(r), Ml(r, l);
            }
          }
        }
        break;
      case "textarea":
        Ai(e, n);
        break;
      case "select":
        t = n.value, t != null && mn(e, !!n.multiple, t, !1);
    }
  }, Xi = yi, Gi = cn;
  var $f = { usingClientEntryPoint: !1, Events: [ar, _n, Xr, Ki, Yi, yi] }, Er = { findFiberByHostInstance: tn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Bf = { bundleType: Er.bundleType, version: Er.version, rendererPackageName: Er.rendererPackageName, rendererConfig: Er.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ce.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = bi(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Er.findFiberByHostInstance || Uf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ll = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ll.isDisabled && Ll.supportsFiber) try {
      Tr = Ll.inject(Bf), ht = Ll;
    } catch {
    }
  }
  return He.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = $f, He.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Pi(t)) throw Error(f(200));
    return If(e, t, null, n);
  }, He.createRoot = function(e, t) {
    if (!Pi(e)) throw Error(f(299));
    var n = !1, r = "", l = Pa;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ei(e, 1, !1, null, null, n, !1, r, l), e[Et] = t.current, ir(e.nodeType === 8 ? e.parentNode : e), new Ci(t);
  }, He.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(f(188)) : (e = Object.keys(e).join(","), Error(f(268, e)));
    return e = bi(t), e = e === null ? null : e.stateNode, e;
  }, He.flushSync = function(e) {
    return cn(e);
  }, He.hydrate = function(e, t, n) {
    if (!Rl(t)) throw Error(f(200));
    return jl(null, e, t, !0, n);
  }, He.hydrateRoot = function(e, t, n) {
    if (!Pi(e)) throw Error(f(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Pa;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = _a(t, null, e, 1, n ?? null, l, !1, o, i), e[Et] = t.current, ir(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Tl(t);
  }, He.render = function(e, t, n) {
    if (!Rl(t)) throw Error(f(200));
    return jl(null, e, t, !1, n);
  }, He.unmountComponentAtNode = function(e) {
    if (!Rl(e)) throw Error(f(40));
    return e._reactRootContainer ? (cn(function() {
      jl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Et] = null;
      });
    }), !0) : !1;
  }, He.unstable_batchedUpdates = yi, He.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Rl(n)) throw Error(f(200));
    if (e == null || e._reactInternals === void 0) throw Error(f(38));
    return jl(e, t, n, !1, r);
  }, He.version = "18.3.1-next-f1338f8080-20240426", He;
}
var Fa;
function qf() {
  if (Fa) return Ti.exports;
  Fa = 1;
  function h() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(h);
      } catch (y) {
        console.error(y);
      }
  }
  return h(), Ti.exports = Zf(), Ti.exports;
}
var Da;
function bf() {
  if (Da) return Ol;
  Da = 1;
  var h = qf();
  return Ol.createRoot = h.createRoot, Ol.hydrateRoot = h.hydrateRoot, Ol;
}
var ed = bf();
const td = /* @__PURE__ */ Wa(ed), nd = "AmsterdamUMC", rd = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", ld = `${rd}/chat/completions`, Ha = 1, od = 256 * 1024 * 1024, Ia = 512 * 1024 * 1024, id = 64 * 1024, ud = `You are the analysis assistant inside OMERO Analysis Chat.
All source data stays in the browser. Never ask the user to write or run notebook code.
Use list_workspace_files before analysis and run_python whenever computation is needed.
Only bounded schemas, previews, summaries, generated code, and tool results are sent to you.
Python inputs are immutable under /input and generated files belong under /output.
Always show your reasoning briefly, use read-only database connections, and assign a useful
table/scalar/dict to a variable named result. Save plots and downloadable artifacts in /output.
For CI Segmentation DuckDB/SQLite data, first inspect tables and schemas. Do not assume table or
column names. Identify object morphology, per-channel intensity statistics, label sets, image or
HCS metadata, mask relationships, and focus assignments from the discovered schema. Quote SQL
identifiers safely, avoid SELECT * for large tables, aggregate before previewing, and explain the
biological and measurement meaning of results without overstating causality.`, sd = [
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
function Ua() {
  const h = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return h ? decodeURIComponent(h[1]) : "";
}
function ad(h, y, f) {
  return h.replace("TYPE", y).replace("/1/", `/${f}/`);
}
class cd {
  constructor(y) {
    jt(this, "contextToken", "");
    jt(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = y;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const y = this.bootstrap.context;
    if (!y) return;
    const f = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Ua()
      },
      body: JSON.stringify({
        object_type: y.object_type,
        object_id: y.object_id
      })
    }), j = await Aa(f);
    this.contextToken = j.context_token, this.operations = new Set(j.operations);
  }
  async download(y) {
    const f = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${y.annotation_id}/download/`
    ), j = await fetch(f, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!j.ok) throw new Error(await Qa(j));
    return j.arrayBuffer();
  }
  async attach(y) {
    const f = this.bootstrap.context;
    if (!f || !y.data) throw new Error("No OMERO target or result data");
    const j = new FormData();
    j.append("file", new Blob([y.data], { type: y.type }), y.name);
    const D = await fetch(
      ad(
        this.bootstrap.uploadTemplate,
        f.object_type,
        f.object_id
      ),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": Ua(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: j
      }
    );
    return (await Aa(D)).attachment;
  }
}
async function Qa(h) {
  var y;
  try {
    return ((y = (await h.json()).error) == null ? void 0 : y.message) || `${h.status} ${h.statusText}`;
  } catch {
    return `${h.status} ${h.statusText}`;
  }
}
async function Aa(h) {
  var f;
  const y = await h.json().catch(() => ({}));
  if (!h.ok)
    throw new Error(((f = y.error) == null ? void 0 : f.message) || `${h.status} ${h.statusText}`);
  return y;
}
async function fd(h, y, f) {
  const j = await fetch(ld, {
    method: "POST",
    signal: f,
    headers: {
      "Content-Type": "application/json",
      "api-key": h.apiKey
    },
    body: JSON.stringify({
      model: h.model,
      temperature: Ha,
      messages: y,
      tools: sd,
      tool_choice: "auto"
    })
  });
  if (!j.ok) throw new Error(await Qa(j));
  return j.json();
}
function dd(h) {
  const y = JSON.stringify({
    stdout: h.stdout,
    stderr: h.stderr,
    preview: h.preview,
    generated_files: h.files.map((f) => ({
      name: f.name,
      size: f.data.byteLength,
      type: f.type
    }))
  });
  return y.length > 64 * 1024 ? `${y.slice(0, 64 * 1024)}
[tool output truncated]` : y;
}
const pd = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "duckdb",
  "pyarrow",
  "python-calamine",
  "xlrd"
];
function md(h) {
  const y = JSON.stringify(h.replace(/\/$/, "")), f = JSON.stringify(pd);
  return `
const runtimeBase = ${y};
const send = (id, type, value, transfer = []) => postMessage({source:"oac-runtime", id, type, value}, transfer);
let pyodide;
const mime = (name) => name.endsWith(".png") ? "image/png" : name.endsWith(".svg") ? "image/svg+xml" :
  name.endsWith(".csv") ? "text/csv" : name.endsWith(".json") ? "application/json" :
  name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";
async function boot() {
  const module = await import(runtimeBase + "/pyodide.mjs");
  pyodide = await module.loadPyodide({indexURL: runtimeBase + "/"});
  await pyodide.loadPackage(${f});
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
function hd(h) {
  const y = new URL(h).origin, f = JSON.stringify(md(h));
  return `<!doctype html><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${y}; connect-src ${y}; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:">
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
class vd {
  constructor(y) {
    jt(this, "frame", null);
    jt(this, "pending", /* @__PURE__ */ new Map());
    jt(this, "inputs", []);
    jt(this, "counter", 0);
    jt(this, "readyPromise", null);
    jt(this, "receive", (y) => {
      var D;
      if (y.source !== ((D = this.frame) == null ? void 0 : D.contentWindow)) return;
      const f = y.data;
      if (!f || f.source !== "oac-runtime") return;
      const j = this.pending.get(f.id);
      j && (clearTimeout(j.timer), this.pending.delete(f.id), f.type === "error" ? j.reject(new Error(f.value)) : j.resolve(f.value));
    });
    this.runtimeBase = y, window.addEventListener("message", this.receive);
  }
  async start(y) {
    this.inputs = y.filter((D) => D.state === "ready" && D.data), this.destroyFrame();
    const f = document.createElement("iframe");
    f.hidden = !0, f.setAttribute("sandbox", "allow-scripts"), f.setAttribute("aria-hidden", "true");
    const j = new Promise(
      (D) => f.addEventListener("load", () => D(), { once: !0 })
    );
    return f.srcdoc = hd(
      new URL(this.runtimeBase, window.location.href).toString()
    ), document.body.append(f), this.frame = f, this.readyPromise = (async () => {
      await j, await this.request("ping", !0, 12e4);
      for (const D of this.inputs) {
        const H = D.data.slice(0);
        await this.request("file", { name: D.name, data: H }, 3e4, [H]);
      }
    })(), this.readyPromise;
  }
  async run(y) {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("run", { code: y }, 12e4);
  }
  async reset() {
    return this.start(this.inputs);
  }
  stop() {
    for (const y of this.pending.values())
      clearTimeout(y.timer), y.reject(new Error("Python execution stopped"));
    this.pending.clear(), this.destroyFrame();
  }
  dispose() {
    this.stop(), this.destroyFrame(), window.removeEventListener("message", this.receive);
  }
  destroyFrame() {
    var y;
    (y = this.frame) == null || y.remove(), this.frame = null, this.readyPromise = null;
  }
  request(y, f, j, D = []) {
    const H = `runtime-${++this.counter}`;
    return new Promise((oe, G) => {
      var de, ue;
      const B = window.setTimeout(() => {
        this.pending.delete(H), G(new Error(`${y} exceeded ${j / 1e3} seconds`)), y === "run" && this.start(this.inputs);
      }, j);
      this.pending.set(H, { resolve: oe, reject: G, timer: B }), (ue = (de = this.frame) == null ? void 0 : de.contentWindow) == null || ue.postMessage(
        { source: "oac-parent", id: H, type: y, value: f },
        "*",
        D
      );
    });
  }
}
const yd = "omero-analysis-chat", gd = 1;
function Mi() {
  return new Promise((h, y) => {
    const f = indexedDB.open(yd, gd);
    f.onupgradeneeded = () => {
      const j = f.result;
      j.objectStoreNames.contains("values") || j.createObjectStore("values");
    }, f.onsuccess = () => h(f.result), f.onerror = () => y(f.error);
  });
}
async function $a(h) {
  const y = await Mi();
  return new Promise((f, j) => {
    const H = y.transaction("values", "readonly").objectStore("values").get(h);
    H.onsuccess = () => f(H.result), H.onerror = () => j(H.error);
  });
}
async function Ba(h, y) {
  const f = await Mi();
  return new Promise((j, D) => {
    const H = f.transaction("values", "readwrite");
    H.objectStore("values").put(y, h), H.oncomplete = () => j(), H.onerror = () => D(H.error);
  });
}
async function wd(h) {
  const y = await Mi();
  return new Promise((f, j) => {
    const D = y.transaction("values", "readwrite");
    D.objectStore("values").delete(h), D.oncomplete = () => f(), D.onerror = () => j(D.error);
  });
}
const Va = "provider:AmsterdamUMC", kd = { apiKey: "", model: "" }, bt = () => crypto.randomUUID(), Sd = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, xd = (h) => h.endsWith(".png") ? "image/png" : h.endsWith(".svg") ? "image/svg+xml" : h.endsWith(".csv") ? "text/csv" : h.endsWith(".json") ? "application/json" : "application/octet-stream";
function Li() {
  const h = window.OMERO_ANALYSIS_CHAT.context;
  return h ? `workspace:${h.user_id}:${h.group_id}:${h.object_type}:${h.object_id}` : "workspace:standalone";
}
function Ed(h) {
  return JSON.stringify(
    h.map((y) => ({
      path: `${y.source === "result" ? "/output" : "/input"}/${y.name}`,
      size: y.size,
      type: y.type,
      state: y.state
    }))
  );
}
function _d() {
  const h = window.OMERO_ANALYSIS_CHAT, y = Pe.useMemo(() => new cd(h), [h]), f = Pe.useMemo(() => new vd(h.runtimeBase), [h]), [j, D] = Pe.useState([]), H = Pe.useRef(j), [oe, G] = Pe.useState([]), [B, de] = Pe.useState(kd), [ue, te] = Pe.useState(""), [J, Ne] = Pe.useState(!1), [Oe, Q] = Pe.useState(!1), [Z, q] = Pe.useState("Preparing workspace…"), [Qe, Ke] = Pe.useState(!1), ce = Pe.useRef(null);
  H.current = j;
  const Ie = j.filter((g) => g.state !== "ready"), ve = Oe && Ie.length === 0 && !!(B.apiKey && B.model) && !J;
  Pe.useEffect(() => {
    let g = !0;
    return (async () => {
      var V;
      const [w, _] = await Promise.all([
        $a(Va),
        $a(Li())
      ]);
      if (!g) return;
      w && de(w), _ && (G(_.messages || []), D((_.files || []).filter((I) => I.state === "ready"))), await y.connect();
      const C = ((V = h.context) == null ? void 0 : V.selected_attachments) || [], s = new Set(
        ((_ == null ? void 0 : _.files) || []).map((I) => I.annotationId)
      ), v = C.filter((I) => !s.has(I.annotation_id)).map((I) => ({
        id: bt(),
        name: I.name,
        type: I.mimetype,
        size: I.size,
        source: "omero",
        state: "loading",
        annotationId: I.annotation_id
      }));
      let z = [...((_ == null ? void 0 : _.files) || []).filter((I) => I.state === "ready")], A = !1;
      if (v.length) {
        D([...z, ...v]), q(`Downloading 0 of ${v.length} selected attachments…`);
        for (let I = 0; I < v.length; I += 1) {
          const K = v[I], ee = C.find(
            (ke) => ke.annotation_id === K.annotationId
          );
          try {
            if (z.reduce((Lt, Ot) => Lt + Ot.size, 0) + ee.size > Ia)
              throw new Error("Selected attachments exceed the 512 MiB workspace limit");
            const St = await y.download(ee), xt = { ...K, data: St, size: St.byteLength, state: "ready" };
            z = [...z, xt], D(
              (Lt) => Lt.map((Ot) => Ot.id === K.id ? xt : Ot)
            );
          } catch (ke) {
            A = !0, D(
              (St) => St.map(
                (xt) => xt.id === K.id ? { ...xt, state: "failed", error: String(ke) } : xt
              )
            );
          }
          q(`Downloaded ${I + 1} of ${v.length} attachments`);
        }
      }
      const $ = v.length ? z : ((_ == null ? void 0 : _.files) || []).filter((I) => I.state === "ready");
      g && !A ? (q("Loading browser Python runtime…"), await f.start($), g && (Q(!0), q("Ready — analysis runs locally in this browser"))) : g && q("Download failed — retry or remove failed files to continue");
    })().catch((w) => {
      g && q(`Workspace failed: ${String(w)}`);
    }), () => {
      g = !1, f.dispose();
    };
  }, [h, y, f]), Pe.useEffect(() => {
    Ba(Li(), { messages: oe, files: j });
  }, [oe, j]);
  async function we(g) {
    de(g), await Ba(Va, g);
  }
  async function Ue(g) {
    if (!g) return;
    const w = [];
    let _ = j.reduce((s, v) => s + v.size, 0);
    for (const s of Array.from(g)) {
      if (!Sd.test(s.name)) {
        q(`${s.name} is not a supported tabular data file`);
        continue;
      }
      if (s.size > od) {
        q(`${s.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (_ += s.size, _ > Ia) {
        q("The workspace would exceed 512 MiB");
        break;
      }
      w.push({
        id: bt(),
        name: s.name,
        type: s.type || xd(s.name),
        size: s.size,
        source: "local",
        state: "ready",
        data: await s.arrayBuffer()
      });
    }
    const C = [...j, ...w];
    D(C), Q(!1), q("Reloading data into browser Python…"), await f.start(C), Q(!0), q("Ready — analysis runs locally in this browser");
  }
  async function mt(g) {
    const w = j.filter((_) => _.id !== g);
    D(w), Q(!1), await f.start(w), Q(!0), q("File removed; runtime reset");
  }
  async function it(g) {
    var C;
    const w = j.find((s) => s.id === g), _ = (C = h.context) == null ? void 0 : C.selected_attachments.find(
      (s) => s.annotation_id === (w == null ? void 0 : w.annotationId)
    );
    if (!(!w || !_)) {
      D(
        (s) => s.map(
          (v) => v.id === g ? { ...v, state: "loading", error: void 0 } : v
        )
      );
      try {
        const s = await y.download(_), v = j.map(
          (z) => z.id === g ? { ...z, data: s, size: s.byteLength, state: "ready", error: void 0 } : z
        );
        D(v), await f.start(v), Q(!0), q("Attachment downloaded; workspace ready");
      } catch (s) {
        D(
          (v) => v.map(
            (z) => z.id === g ? { ...z, state: "failed", error: String(s) } : z
          )
        );
      }
    }
  }
  async function kt(g) {
    let w = {};
    try {
      w = JSON.parse(g.function.arguments || "{}");
    } catch {
    }
    if (g.function.name === "list_workspace_files") return Ed(H.current);
    if (g.function.name === "reset_python")
      return await f.reset(), "Python state reset; canonical inputs restored.";
    if (g.function.name !== "run_python" || typeof w.code != "string")
      return `Unsupported or invalid tool call: ${g.function.name}`;
    G((s) => [
      ...s,
      { id: bt(), role: "assistant", content: "Running Python locally", kind: "code", code: w.code }
    ]), await new Promise(
      (s) => requestAnimationFrame(() => requestAnimationFrame(() => s()))
    );
    const _ = await f.run(w.code), C = _.files.map((s) => ({
      id: bt(),
      name: s.name,
      type: s.type,
      size: s.data.byteLength,
      source: "result",
      state: "ready",
      data: s.data
    }));
    return C.length && D((s) => [...s.filter((v) => v.source !== "result" || !C.some((z) => z.name === v.name)), ...C]), G((s) => [
      ...s,
      {
        id: bt(),
        role: "tool",
        content: [_.stdout, _.stderr].filter(Boolean).join(`
`).slice(0, id),
        kind: "result",
        preview: _.preview,
        artifacts: C.filter((v) => v.type === "image/png" || v.type === "image/svg+xml").map((v) => v.name)
      }
    ]), dd(_);
  }
  async function Ye() {
    var C, s, v;
    const g = ue.trim();
    if (!g || !ve) return;
    te(""), Ne(!0), ce.current = new AbortController();
    const w = { id: bt(), role: "user", content: g };
    G((z) => [...z, w]);
    const _ = [
      { role: "system", content: ud },
      ...oe.filter((z) => z.kind !== "code" && z.role !== "tool").map((z) => ({ role: z.role, content: z.content })),
      { role: "user", content: g }
    ];
    try {
      for (let z = 0; z < 8; z += 1) {
        const $ = (C = (await fd(B, _, ce.current.signal)).choices[0]) == null ? void 0 : C.message;
        if (!$) throw new Error("AmsterdamUMC returned no response");
        if (_.push({
          role: "assistant",
          content: $.content,
          tool_calls: $.tool_calls
        }), $.content && G((V) => [
          ...V,
          { id: bt(), role: "assistant", content: $.content }
        ]), !((s = $.tool_calls) != null && s.length)) break;
        for (const V of $.tool_calls) {
          const I = await kt(V);
          _.push({ role: "tool", tool_call_id: V.id, content: I });
        }
        if (z === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (z) {
      (v = ce.current) != null && v.signal.aborted || G((A) => [
        ...A,
        { id: bt(), role: "assistant", content: String(z), kind: "error" }
      ]);
    } finally {
      ce.current = null, Ne(!1);
    }
  }
  function Me() {
    var g;
    (g = ce.current) == null || g.abort(), f.stop(), Ne(!1), Q(!1), q("Stopped; restoring the browser runtime…"), f.start(j).then(() => {
      Q(!0), q("Ready — analysis runs locally in this browser");
    });
  }
  async function Xe() {
    confirm("Clear this browser-local conversation, files, and results?") && (G([]), D([]), await wd(Li()), await f.start([]), Q(!0), q("Workspace cleared"));
  }
  function be(g) {
    if (!g.data) return;
    const w = URL.createObjectURL(new Blob([g.data], { type: g.type })), _ = document.createElement("a");
    _.href = w, _.download = g.name, _.click(), setTimeout(() => URL.revokeObjectURL(w), 1e3);
  }
  async function ze(g) {
    if (confirm(`Attach ${g.name} to the selected OMERO object?`))
      try {
        const w = await y.attach(g);
        q(`Attached ${w.name} as FileAnnotation ${w.annotation_id}`);
      } catch (w) {
        q(`Attach failed: ${String(w)}`);
      }
  }
  return /* @__PURE__ */ P.jsxs("main", { className: "app-shell", children: [
    /* @__PURE__ */ P.jsxs("header", { children: [
      /* @__PURE__ */ P.jsxs("div", { children: [
        /* @__PURE__ */ P.jsx("h1", { children: "OMERO.AnalysisChat" }),
        /* @__PURE__ */ P.jsx("p", { children: h.context ? `${h.context.object_type} ${h.context.object_id} — ${h.context.name}` : "Local workspace" })
      ] }),
      /* @__PURE__ */ P.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ P.jsx("span", { className: "privacy-badge", children: "Python and source files stay in this browser" }),
        /* @__PURE__ */ P.jsx("button", { onClick: () => Ke(!Qe), children: "AI settings" }),
        /* @__PURE__ */ P.jsx("button", { onClick: Xe, children: "Clear" })
      ] })
    ] }),
    Qe && /* @__PURE__ */ P.jsxs("form", { className: "settings-card", onSubmit: (g) => g.preventDefault(), children: [
      /* @__PURE__ */ P.jsx("h2", { children: nd }),
      /* @__PURE__ */ P.jsx("p", { className: "warning", children: "The API key is stored unencrypted in this browser profile. Never use this on a shared computer." }),
      /* @__PURE__ */ P.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ P.jsx("input", { value: B.model, onChange: (g) => void we({ ...B, model: g.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ P.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ P.jsx("input", { type: "password", value: B.apiKey, onChange: (g) => void we({ ...B, apiKey: g.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ P.jsxs("p", { children: [
        "Temperature is fixed at ",
        /* @__PURE__ */ P.jsx("strong", { children: Ha }),
        "."
      ] }),
      /* @__PURE__ */ P.jsx("button", { onClick: () => void we({ ...B, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ P.jsxs("div", { className: "workspace", children: [
      /* @__PURE__ */ P.jsxs("aside", { children: [
        /* @__PURE__ */ P.jsxs("div", { className: "aside-heading", children: [
          /* @__PURE__ */ P.jsx("h2", { children: "Data" }),
          /* @__PURE__ */ P.jsxs("label", { className: "upload-button", children: [
            "Add files",
            /* @__PURE__ */ P.jsx("input", { type: "file", multiple: !0, accept: ".duckdb,.sqlite,.sqlite3,.csv,.tsv,.json,.xlsx,.xls,.parquet,.npy,.npz", onChange: (g) => void Ue(g.target.files) })
          ] })
        ] }),
        /* @__PURE__ */ P.jsx("ul", { className: "file-list", children: j.map((g) => /* @__PURE__ */ P.jsxs("li", { className: `file-${g.state}`, children: [
          /* @__PURE__ */ P.jsxs("div", { children: [
            /* @__PURE__ */ P.jsx("strong", { children: g.name }),
            /* @__PURE__ */ P.jsxs("small", { children: [
              (g.size / 1024).toFixed(1),
              " KiB · ",
              g.source
            ] })
          ] }),
          /* @__PURE__ */ P.jsx("span", { children: g.state }),
          g.error && /* @__PURE__ */ P.jsx("p", { children: g.error }),
          /* @__PURE__ */ P.jsxs("div", { className: "file-actions", children: [
            g.state === "failed" && g.annotationId && /* @__PURE__ */ P.jsx("button", { onClick: () => void it(g.id), children: "Retry" }),
            g.source === "result" && /* @__PURE__ */ P.jsx("button", { onClick: () => be(g), children: "Download" }),
            g.source === "result" && y.canUpload && /* @__PURE__ */ P.jsx("button", { onClick: () => void ze(g), children: "Attach" }),
            /* @__PURE__ */ P.jsx("button", { onClick: () => void mt(g.id), children: "Remove" })
          ] })
        ] }, g.id)) })
      ] }),
      /* @__PURE__ */ P.jsxs("section", { className: "chat", children: [
        /* @__PURE__ */ P.jsxs("div", { className: "messages", "aria-live": "polite", children: [
          !oe.length && /* @__PURE__ */ P.jsxs("div", { className: "welcome", children: [
            /* @__PURE__ */ P.jsx("h2", { children: "What would you like to learn from these data?" }),
            /* @__PURE__ */ P.jsx("p", { children: "I can inspect schemas, query databases, calculate summaries, compare groups, and create plots or downloadable results." })
          ] }),
          oe.map((g) => {
            var w;
            return /* @__PURE__ */ P.jsxs("article", { className: `message ${g.role} ${g.kind || ""}`, children: [
              /* @__PURE__ */ P.jsx("span", { children: g.kind === "code" ? "Python (local)" : g.role }),
              g.code ? /* @__PURE__ */ P.jsx("pre", { children: /* @__PURE__ */ P.jsx("code", { children: g.code }) }) : /* @__PURE__ */ P.jsx("p", { children: g.content }),
              g.preview != null && /* @__PURE__ */ P.jsx(Cd, { value: g.preview }),
              (w = g.artifacts) == null ? void 0 : w.map((_) => {
                const C = j.find((s) => s.source === "result" && s.name === _);
                return C ? /* @__PURE__ */ P.jsx(Pd, { file: C }, _) : null;
              })
            ] }, g.id);
          })
        ] }),
        /* @__PURE__ */ P.jsx("div", { className: "status", role: "status", children: Z }),
        Ie.length > 0 && /* @__PURE__ */ P.jsx("div", { className: "blocker", children: "Analysis is blocked until every selected attachment finishes downloading. Retry or remove failed files." }),
        !B.apiKey || !B.model ? /* @__PURE__ */ P.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
        /* @__PURE__ */ P.jsxs("div", { className: "composer", children: [
          /* @__PURE__ */ P.jsx("textarea", { value: ue, onChange: (g) => te(g.target.value), onKeyDown: (g) => {
            g.key === "Enter" && !g.shiftKey && (g.preventDefault(), Ye());
          }, disabled: !ve && !J, placeholder: "Ask a question about the loaded data…" }),
          J ? /* @__PURE__ */ P.jsx("button", { className: "stop", onClick: Me, children: "Stop" }) : /* @__PURE__ */ P.jsx("button", { disabled: !ve || !ue.trim(), onClick: () => void Ye(), children: "Send" }),
          /* @__PURE__ */ P.jsx("button", { disabled: J || !Oe, onClick: () => void f.reset().then(() => q("Python state reset; inputs restored")), children: "Reset Python" })
        ] })
      ] })
    ] })
  ] });
}
function Cd({ value: h }) {
  if ((h == null ? void 0 : h.kind) === "table" && h.data) {
    const y = h.data.columns || [], f = h.data.data || [];
    return /* @__PURE__ */ P.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ P.jsxs("table", { children: [
      /* @__PURE__ */ P.jsx("thead", { children: /* @__PURE__ */ P.jsx("tr", { children: y.map((j) => /* @__PURE__ */ P.jsx("th", { children: j }, j)) }) }),
      /* @__PURE__ */ P.jsx("tbody", { children: f.map((j, D) => /* @__PURE__ */ P.jsx("tr", { children: j.map((H, oe) => /* @__PURE__ */ P.jsx("td", { children: String(H ?? "") }, oe)) }, D)) })
    ] }) });
  }
  return /* @__PURE__ */ P.jsx("pre", { className: "preview", children: JSON.stringify(h, null, 2) });
}
function Pd({ file: h }) {
  const y = Pe.useMemo(
    () => h.data ? URL.createObjectURL(new Blob([h.data], { type: h.type })) : "",
    [h.data, h.type]
  );
  return Pe.useEffect(() => () => {
    y && URL.revokeObjectURL(y);
  }, [y]), y ? /* @__PURE__ */ P.jsxs("figure", { children: [
    /* @__PURE__ */ P.jsx("img", { src: y, alt: h.name }),
    /* @__PURE__ */ P.jsx("figcaption", { children: h.name })
  ] }) : null;
}
td.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ P.jsx(Xf.StrictMode, { children: /* @__PURE__ */ P.jsx(_d, {}) })
);
