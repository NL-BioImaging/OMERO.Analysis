var gp = Object.defineProperty;
var wp = (s, a, l) => a in s ? gp(s, a, { enumerable: !0, configurable: !0, writable: !0, value: l }) : s[a] = l;
var sn = (s, a, l) => wp(s, typeof a != "symbol" ? a + "" : a, l);
function kd(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var ta = { exports: {} }, Xo = {}, na = { exports: {} }, we = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gc;
function xp() {
  if (Gc) return we;
  Gc = 1;
  var s = Symbol.for("react.element"), a = Symbol.for("react.portal"), l = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), m = Symbol.for("react.provider"), _ = Symbol.for("react.context"), E = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), A = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), N = Symbol.iterator;
  function R(w) {
    return w === null || typeof w != "object" ? null : (w = N && w[N] || w["@@iterator"], typeof w == "function" ? w : null);
  }
  var ie = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, he = Object.assign, G = {};
  function Y(w, P, q) {
    this.props = w, this.context = P, this.refs = G, this.updater = q || ie;
  }
  Y.prototype.isReactComponent = {}, Y.prototype.setState = function(w, P) {
    if (typeof w != "object" && typeof w != "function" && w != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, w, P, "setState");
  }, Y.prototype.forceUpdate = function(w) {
    this.updater.enqueueForceUpdate(this, w, "forceUpdate");
  };
  function Te() {
  }
  Te.prototype = Y.prototype;
  function ke(w, P, q) {
    this.props = w, this.context = P, this.refs = G, this.updater = q || ie;
  }
  var B = ke.prototype = new Te();
  B.constructor = ke, he(B, Y.prototype), B.isPureReactComponent = !0;
  var te = Array.isArray, V = Object.prototype.hasOwnProperty, je = { current: null }, ge = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ne(w, P, q) {
    var re, Z = {}, ae = null, Ce = null;
    if (P != null) for (re in P.ref !== void 0 && (Ce = P.ref), P.key !== void 0 && (ae = "" + P.key), P) V.call(P, re) && !ge.hasOwnProperty(re) && (Z[re] = P[re]);
    var ve = arguments.length - 2;
    if (ve === 1) Z.children = q;
    else if (1 < ve) {
      for (var _e = Array(ve), Ue = 0; Ue < ve; Ue++) _e[Ue] = arguments[Ue + 2];
      Z.children = _e;
    }
    if (w && w.defaultProps) for (re in ve = w.defaultProps, ve) Z[re] === void 0 && (Z[re] = ve[re]);
    return { $$typeof: s, type: w, key: ae, ref: Ce, props: Z, _owner: je.current };
  }
  function oe(w, P) {
    return { $$typeof: s, type: w.type, key: P, ref: w.ref, props: w.props, _owner: w._owner };
  }
  function Ie(w) {
    return typeof w == "object" && w !== null && w.$$typeof === s;
  }
  function Le(w) {
    var P = { "=": "=0", ":": "=2" };
    return "$" + w.replace(/[=:]/g, function(q) {
      return P[q];
    });
  }
  var Ee = /\/+/g;
  function De(w, P) {
    return typeof w == "object" && w !== null && w.key != null ? Le("" + w.key) : P.toString(36);
  }
  function Ve(w, P, q, re, Z) {
    var ae = typeof w;
    (ae === "undefined" || ae === "boolean") && (w = null);
    var Ce = !1;
    if (w === null) Ce = !0;
    else switch (ae) {
      case "string":
      case "number":
        Ce = !0;
        break;
      case "object":
        switch (w.$$typeof) {
          case s:
          case a:
            Ce = !0;
        }
    }
    if (Ce) return Ce = w, Z = Z(Ce), w = re === "" ? "." + De(Ce, 0) : re, te(Z) ? (q = "", w != null && (q = w.replace(Ee, "$&/") + "/"), Ve(Z, P, q, "", function(Ue) {
      return Ue;
    })) : Z != null && (Ie(Z) && (Z = oe(Z, q + (!Z.key || Ce && Ce.key === Z.key ? "" : ("" + Z.key).replace(Ee, "$&/") + "/") + w)), P.push(Z)), 1;
    if (Ce = 0, re = re === "" ? "." : re + ":", te(w)) for (var ve = 0; ve < w.length; ve++) {
      ae = w[ve];
      var _e = re + De(ae, ve);
      Ce += Ve(ae, P, q, _e, Z);
    }
    else if (_e = R(w), typeof _e == "function") for (w = _e.call(w), ve = 0; !(ae = w.next()).done; ) ae = ae.value, _e = re + De(ae, ve++), Ce += Ve(ae, P, q, _e, Z);
    else if (ae === "object") throw P = String(w), Error("Objects are not valid as a React child (found: " + (P === "[object Object]" ? "object with keys {" + Object.keys(w).join(", ") + "}" : P) + "). If you meant to render a collection of children, use an array instead.");
    return Ce;
  }
  function $e(w, P, q) {
    if (w == null) return w;
    var re = [], Z = 0;
    return Ve(w, re, "", "", function(ae) {
      return P.call(q, ae, Z++);
    }), re;
  }
  function xe(w) {
    if (w._status === -1) {
      var P = w._result;
      P = P(), P.then(function(q) {
        (w._status === 0 || w._status === -1) && (w._status = 1, w._result = q);
      }, function(q) {
        (w._status === 0 || w._status === -1) && (w._status = 2, w._result = q);
      }), w._status === -1 && (w._status = 0, w._result = P);
    }
    if (w._status === 1) return w._result.default;
    throw w._result;
  }
  var ce = { current: null }, $ = { transition: null }, W = { ReactCurrentDispatcher: ce, ReactCurrentBatchConfig: $, ReactCurrentOwner: je };
  function H() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return we.Children = { map: $e, forEach: function(w, P, q) {
    $e(w, function() {
      P.apply(this, arguments);
    }, q);
  }, count: function(w) {
    var P = 0;
    return $e(w, function() {
      P++;
    }), P;
  }, toArray: function(w) {
    return $e(w, function(P) {
      return P;
    }) || [];
  }, only: function(w) {
    if (!Ie(w)) throw Error("React.Children.only expected to receive a single React element child.");
    return w;
  } }, we.Component = Y, we.Fragment = l, we.Profiler = g, we.PureComponent = ke, we.StrictMode = d, we.Suspense = C, we.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W, we.act = H, we.cloneElement = function(w, P, q) {
    if (w == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + w + ".");
    var re = he({}, w.props), Z = w.key, ae = w.ref, Ce = w._owner;
    if (P != null) {
      if (P.ref !== void 0 && (ae = P.ref, Ce = je.current), P.key !== void 0 && (Z = "" + P.key), w.type && w.type.defaultProps) var ve = w.type.defaultProps;
      for (_e in P) V.call(P, _e) && !ge.hasOwnProperty(_e) && (re[_e] = P[_e] === void 0 && ve !== void 0 ? ve[_e] : P[_e]);
    }
    var _e = arguments.length - 2;
    if (_e === 1) re.children = q;
    else if (1 < _e) {
      ve = Array(_e);
      for (var Ue = 0; Ue < _e; Ue++) ve[Ue] = arguments[Ue + 2];
      re.children = ve;
    }
    return { $$typeof: s, type: w.type, key: Z, ref: ae, props: re, _owner: Ce };
  }, we.createContext = function(w) {
    return w = { $$typeof: _, _currentValue: w, _currentValue2: w, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, w.Provider = { $$typeof: m, _context: w }, w.Consumer = w;
  }, we.createElement = ne, we.createFactory = function(w) {
    var P = ne.bind(null, w);
    return P.type = w, P;
  }, we.createRef = function() {
    return { current: null };
  }, we.forwardRef = function(w) {
    return { $$typeof: E, render: w };
  }, we.isValidElement = Ie, we.lazy = function(w) {
    return { $$typeof: T, _payload: { _status: -1, _result: w }, _init: xe };
  }, we.memo = function(w, P) {
    return { $$typeof: A, type: w, compare: P === void 0 ? null : P };
  }, we.startTransition = function(w) {
    var P = $.transition;
    $.transition = {};
    try {
      w();
    } finally {
      $.transition = P;
    }
  }, we.unstable_act = H, we.useCallback = function(w, P) {
    return ce.current.useCallback(w, P);
  }, we.useContext = function(w) {
    return ce.current.useContext(w);
  }, we.useDebugValue = function() {
  }, we.useDeferredValue = function(w) {
    return ce.current.useDeferredValue(w);
  }, we.useEffect = function(w, P) {
    return ce.current.useEffect(w, P);
  }, we.useId = function() {
    return ce.current.useId();
  }, we.useImperativeHandle = function(w, P, q) {
    return ce.current.useImperativeHandle(w, P, q);
  }, we.useInsertionEffect = function(w, P) {
    return ce.current.useInsertionEffect(w, P);
  }, we.useLayoutEffect = function(w, P) {
    return ce.current.useLayoutEffect(w, P);
  }, we.useMemo = function(w, P) {
    return ce.current.useMemo(w, P);
  }, we.useReducer = function(w, P, q) {
    return ce.current.useReducer(w, P, q);
  }, we.useRef = function(w) {
    return ce.current.useRef(w);
  }, we.useState = function(w) {
    return ce.current.useState(w);
  }, we.useSyncExternalStore = function(w, P, q) {
    return ce.current.useSyncExternalStore(w, P, q);
  }, we.useTransition = function() {
    return ce.current.useTransition();
  }, we.version = "18.3.1", we;
}
var Zc;
function _a() {
  return Zc || (Zc = 1, na.exports = xp()), na.exports;
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
var bc;
function Sp() {
  if (bc) return Xo;
  bc = 1;
  var s = _a(), a = Symbol.for("react.element"), l = Symbol.for("react.fragment"), d = Object.prototype.hasOwnProperty, g = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, m = { key: !0, ref: !0, __self: !0, __source: !0 };
  function _(E, C, A) {
    var T, N = {}, R = null, ie = null;
    A !== void 0 && (R = "" + A), C.key !== void 0 && (R = "" + C.key), C.ref !== void 0 && (ie = C.ref);
    for (T in C) d.call(C, T) && !m.hasOwnProperty(T) && (N[T] = C[T]);
    if (E && E.defaultProps) for (T in C = E.defaultProps, C) N[T] === void 0 && (N[T] = C[T]);
    return { $$typeof: a, type: E, key: R, ref: ie, props: N, _owner: g.current };
  }
  return Xo.Fragment = l, Xo.jsx = _, Xo.jsxs = _, Xo;
}
var ed;
function kp() {
  return ed || (ed = 1, ta.exports = Sp()), ta.exports;
}
var f = kp(), Ne = _a();
const jp = /* @__PURE__ */ kd(Ne);
var ds = {}, ra = { exports: {} }, Nt = {}, oa = { exports: {} }, ia = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var td;
function Cp() {
  return td || (td = 1, (function(s) {
    function a($, W) {
      var H = $.length;
      $.push(W);
      e: for (; 0 < H; ) {
        var w = H - 1 >>> 1, P = $[w];
        if (0 < g(P, W)) $[w] = W, $[H] = P, H = w;
        else break e;
      }
    }
    function l($) {
      return $.length === 0 ? null : $[0];
    }
    function d($) {
      if ($.length === 0) return null;
      var W = $[0], H = $.pop();
      if (H !== W) {
        $[0] = H;
        e: for (var w = 0, P = $.length, q = P >>> 1; w < q; ) {
          var re = 2 * (w + 1) - 1, Z = $[re], ae = re + 1, Ce = $[ae];
          if (0 > g(Z, H)) ae < P && 0 > g(Ce, Z) ? ($[w] = Ce, $[ae] = H, w = ae) : ($[w] = Z, $[re] = H, w = re);
          else if (ae < P && 0 > g(Ce, H)) $[w] = Ce, $[ae] = H, w = ae;
          else break e;
        }
      }
      return W;
    }
    function g($, W) {
      var H = $.sortIndex - W.sortIndex;
      return H !== 0 ? H : $.id - W.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      s.unstable_now = function() {
        return m.now();
      };
    } else {
      var _ = Date, E = _.now();
      s.unstable_now = function() {
        return _.now() - E;
      };
    }
    var C = [], A = [], T = 1, N = null, R = 3, ie = !1, he = !1, G = !1, Y = typeof setTimeout == "function" ? setTimeout : null, Te = typeof clearTimeout == "function" ? clearTimeout : null, ke = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function B($) {
      for (var W = l(A); W !== null; ) {
        if (W.callback === null) d(A);
        else if (W.startTime <= $) d(A), W.sortIndex = W.expirationTime, a(C, W);
        else break;
        W = l(A);
      }
    }
    function te($) {
      if (G = !1, B($), !he) if (l(C) !== null) he = !0, xe(V);
      else {
        var W = l(A);
        W !== null && ce(te, W.startTime - $);
      }
    }
    function V($, W) {
      he = !1, G && (G = !1, Te(ne), ne = -1), ie = !0;
      var H = R;
      try {
        for (B(W), N = l(C); N !== null && (!(N.expirationTime > W) || $ && !Le()); ) {
          var w = N.callback;
          if (typeof w == "function") {
            N.callback = null, R = N.priorityLevel;
            var P = w(N.expirationTime <= W);
            W = s.unstable_now(), typeof P == "function" ? N.callback = P : N === l(C) && d(C), B(W);
          } else d(C);
          N = l(C);
        }
        if (N !== null) var q = !0;
        else {
          var re = l(A);
          re !== null && ce(te, re.startTime - W), q = !1;
        }
        return q;
      } finally {
        N = null, R = H, ie = !1;
      }
    }
    var je = !1, ge = null, ne = -1, oe = 5, Ie = -1;
    function Le() {
      return !(s.unstable_now() - Ie < oe);
    }
    function Ee() {
      if (ge !== null) {
        var $ = s.unstable_now();
        Ie = $;
        var W = !0;
        try {
          W = ge(!0, $);
        } finally {
          W ? De() : (je = !1, ge = null);
        }
      } else je = !1;
    }
    var De;
    if (typeof ke == "function") De = function() {
      ke(Ee);
    };
    else if (typeof MessageChannel < "u") {
      var Ve = new MessageChannel(), $e = Ve.port2;
      Ve.port1.onmessage = Ee, De = function() {
        $e.postMessage(null);
      };
    } else De = function() {
      Y(Ee, 0);
    };
    function xe($) {
      ge = $, je || (je = !0, De());
    }
    function ce($, W) {
      ne = Y(function() {
        $(s.unstable_now());
      }, W);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function($) {
      $.callback = null;
    }, s.unstable_continueExecution = function() {
      he || ie || (he = !0, xe(V));
    }, s.unstable_forceFrameRate = function($) {
      0 > $ || 125 < $ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : oe = 0 < $ ? Math.floor(1e3 / $) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return R;
    }, s.unstable_getFirstCallbackNode = function() {
      return l(C);
    }, s.unstable_next = function($) {
      switch (R) {
        case 1:
        case 2:
        case 3:
          var W = 3;
          break;
        default:
          W = R;
      }
      var H = R;
      R = W;
      try {
        return $();
      } finally {
        R = H;
      }
    }, s.unstable_pauseExecution = function() {
    }, s.unstable_requestPaint = function() {
    }, s.unstable_runWithPriority = function($, W) {
      switch ($) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          $ = 3;
      }
      var H = R;
      R = $;
      try {
        return W();
      } finally {
        R = H;
      }
    }, s.unstable_scheduleCallback = function($, W, H) {
      var w = s.unstable_now();
      switch (typeof H == "object" && H !== null ? (H = H.delay, H = typeof H == "number" && 0 < H ? w + H : w) : H = w, $) {
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
      return P = H + P, $ = { id: T++, callback: W, priorityLevel: $, startTime: H, expirationTime: P, sortIndex: -1 }, H > w ? ($.sortIndex = H, a(A, $), l(C) === null && $ === l(A) && (G ? (Te(ne), ne = -1) : G = !0, ce(te, H - w))) : ($.sortIndex = P, a(C, $), he || ie || (he = !0, xe(V))), $;
    }, s.unstable_shouldYield = Le, s.unstable_wrapCallback = function($) {
      var W = R;
      return function() {
        var H = R;
        R = W;
        try {
          return $.apply(this, arguments);
        } finally {
          R = H;
        }
      };
    };
  })(ia)), ia;
}
var nd;
function Ep() {
  return nd || (nd = 1, oa.exports = Cp()), oa.exports;
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
var rd;
function _p() {
  if (rd) return Nt;
  rd = 1;
  var s = _a(), a = Ep();
  function l(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var d = /* @__PURE__ */ new Set(), g = {};
  function m(e, t) {
    _(e, t), _(e + "Capture", t);
  }
  function _(e, t) {
    for (g[e] = t, e = 0; e < t.length; e++) d.add(t[e]);
  }
  var E = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), C = Object.prototype.hasOwnProperty, A = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, T = {}, N = {};
  function R(e) {
    return C.call(N, e) ? !0 : C.call(T, e) ? !1 : A.test(e) ? N[e] = !0 : (T[e] = !0, !1);
  }
  function ie(e, t, n, r) {
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
  function he(e, t, n, r) {
    if (t === null || typeof t > "u" || ie(e, t, n, r)) return !0;
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
  function G(e, t, n, r, o, i, c) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = c;
  }
  var Y = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    Y[e] = new G(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    Y[t] = new G(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    Y[e] = new G(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    Y[e] = new G(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    Y[e] = new G(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    Y[e] = new G(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    Y[e] = new G(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    Y[e] = new G(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    Y[e] = new G(e, 5, !1, e.toLowerCase(), null, !1, !1);
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
    Y[t] = new G(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Te, ke);
    Y[t] = new G(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Te, ke);
    Y[t] = new G(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    Y[e] = new G(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), Y.xlinkHref = new G("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    Y[e] = new G(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function B(e, t, n, r) {
    var o = Y.hasOwnProperty(t) ? Y[t] : null;
    (o !== null ? o.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (he(t, n, o, r) && (n = null), r || o === null ? R(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : o.mustUseProperty ? e[o.propertyName] = n === null ? o.type === 3 ? !1 : "" : n : (t = o.attributeName, r = o.attributeNamespace, n === null ? e.removeAttribute(t) : (o = o.type, n = o === 3 || o === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var te = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, V = Symbol.for("react.element"), je = Symbol.for("react.portal"), ge = Symbol.for("react.fragment"), ne = Symbol.for("react.strict_mode"), oe = Symbol.for("react.profiler"), Ie = Symbol.for("react.provider"), Le = Symbol.for("react.context"), Ee = Symbol.for("react.forward_ref"), De = Symbol.for("react.suspense"), Ve = Symbol.for("react.suspense_list"), $e = Symbol.for("react.memo"), xe = Symbol.for("react.lazy"), ce = Symbol.for("react.offscreen"), $ = Symbol.iterator;
  function W(e) {
    return e === null || typeof e != "object" ? null : (e = $ && e[$] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var H = Object.assign, w;
  function P(e) {
    if (w === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      w = t && t[1] || "";
    }
    return `
` + w + e;
  }
  var q = !1;
  function re(e, t) {
    if (!e || q) return "";
    q = !0;
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
        } catch (j) {
          var r = j;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (j) {
          r = j;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (j) {
          r = j;
        }
        e();
      }
    } catch (j) {
      if (j && r && typeof j.stack == "string") {
        for (var o = j.stack.split(`
`), i = r.stack.split(`
`), c = o.length - 1, p = i.length - 1; 1 <= c && 0 <= p && o[c] !== i[p]; ) p--;
        for (; 1 <= c && 0 <= p; c--, p--) if (o[c] !== i[p]) {
          if (c !== 1 || p !== 1)
            do
              if (c--, p--, 0 > p || o[c] !== i[p]) {
                var v = `
` + o[c].replace(" at new ", " at ");
                return e.displayName && v.includes("<anonymous>") && (v = v.replace("<anonymous>", e.displayName)), v;
              }
            while (1 <= c && 0 <= p);
          break;
        }
      }
    } finally {
      q = !1, Error.prepareStackTrace = n;
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
        return e = re(e.type, !1), e;
      case 11:
        return e = re(e.type.render, !1), e;
      case 1:
        return e = re(e.type, !0), e;
      default:
        return "";
    }
  }
  function ae(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ge:
        return "Fragment";
      case je:
        return "Portal";
      case oe:
        return "Profiler";
      case ne:
        return "StrictMode";
      case De:
        return "Suspense";
      case Ve:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Le:
        return (e.displayName || "Context") + ".Consumer";
      case Ie:
        return (e._context.displayName || "Context") + ".Provider";
      case Ee:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case $e:
        return t = e.displayName || null, t !== null ? t : ae(e.type) || "Memo";
      case xe:
        t = e._payload, e = e._init;
        try {
          return ae(e(t));
        } catch {
        }
    }
    return null;
  }
  function Ce(e) {
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
        return t === ne ? "StrictMode" : "Mode";
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
  function ve(e) {
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
  function _e(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ue(e) {
    var t = _e(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var o = n.get, i = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return o.call(this);
      }, set: function(c) {
        r = "" + c, i.call(this, c);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(c) {
        r = "" + c;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Se(e) {
    e._valueTracker || (e._valueTracker = Ue(e));
  }
  function St(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = _e(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Me(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Ot(e, t) {
    var n = t.checked;
    return H({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function ro(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = ve(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function or(e, t) {
    t = t.checked, t != null && B(e, "checked", t, !1);
  }
  function Zt(e, t) {
    or(e, t);
    var n = ve(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Pn(e, t.type, n) : t.hasOwnProperty("defaultValue") && Pn(e, t.type, ve(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function oo(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Pn(e, t, n) {
    (t !== "number" || Me(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var ir = Array.isArray;
  function dn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
      for (n = 0; n < e.length; n++) o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + ve(n), t = null, o = 0; o < e.length; o++) {
        if (e[o].value === n) {
          e[o].selected = !0, r && (e[o].defaultSelected = !0);
          return;
        }
        t !== null || e[o].disabled || (t = e[o]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function kt(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(l(91));
    return H({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Er(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(l(92));
        if (ir(n)) {
          if (1 < n.length) throw Error(l(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: ve(n) };
  }
  function Nn(e, t) {
    var n = ve(t.value), r = ve(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function fn(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Tn(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function bt(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Tn(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var pn, ei = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, o) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, o);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (pn = pn || document.createElement("div"), pn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = pn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Rn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var sr = {
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
  }, _r = ["Webkit", "ms", "Moz", "O"];
  Object.keys(sr).forEach(function(e) {
    _r.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), sr[t] = sr[e];
    });
  });
  function ti(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || sr.hasOwnProperty(e) && sr[e] ? ("" + t).trim() : t + "px";
  }
  function lr(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, o = ti(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o;
    }
  }
  var ut = H({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function ar(e, t) {
    if (t) {
      if (ut[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(l(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(l(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(l(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(l(62));
    }
  }
  function Pr(e, t) {
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
  var Nr = null;
  function In(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var zn = null, Ln = null, hn = null;
  function ni(e) {
    if (e = zo(e)) {
      if (typeof zn != "function") throw Error(l(280));
      var t = e.stateNode;
      t && (t = _i(t), zn(e.stateNode, e.type, t));
    }
  }
  function ri(e) {
    Ln ? hn ? hn.push(e) : hn = [e] : Ln = e;
  }
  function io() {
    if (Ln) {
      var e = Ln, t = hn;
      if (hn = Ln = null, ni(e), t) for (e = 0; e < t.length; e++) ni(t[e]);
    }
  }
  function oi(e, t) {
    return e(t);
  }
  function ii() {
  }
  var so = !1;
  function lo(e, t, n) {
    if (so) return e(t, n);
    so = !0;
    try {
      return oi(e, t, n);
    } finally {
      so = !1, (Ln !== null || hn !== null) && (ii(), io());
    }
  }
  function mn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = _i(n);
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
    if (n && typeof n != "function") throw Error(l(231, t, typeof n));
    return n;
  }
  var ao = !1;
  if (E) try {
    var vn = {};
    Object.defineProperty(vn, "passive", { get: function() {
      ao = !0;
    } }), window.addEventListener("test", vn, vn), window.removeEventListener("test", vn, vn);
  } catch {
    ao = !1;
  }
  function si(e, t, n, r, o, i, c, p, v) {
    var j = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, j);
    } catch (L) {
      this.onError(L);
    }
  }
  var ur = !1, Tr = null, cr = !1, uo = null, ks = { onError: function(e) {
    ur = !0, Tr = e;
  } };
  function js(e, t, n, r, o, i, c, p, v) {
    ur = !1, Tr = null, si.apply(ks, arguments);
  }
  function li(e, t, n, r, o, i, c, p, v) {
    if (js.apply(this, arguments), ur) {
      if (ur) {
        var j = Tr;
        ur = !1, Tr = null;
      } else throw Error(l(198));
      cr || (cr = !0, uo = j);
    }
  }
  function yn(e) {
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
  function co(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function fo(e) {
    if (yn(e) !== e) throw Error(l(188));
  }
  function ai(e) {
    var t = e.alternate;
    if (!t) {
      if (t = yn(e), t === null) throw Error(l(188));
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
          if (i === n) return fo(o), e;
          if (i === r) return fo(o), t;
          i = i.sibling;
        }
        throw Error(l(188));
      }
      if (n.return !== r.return) n = o, r = i;
      else {
        for (var c = !1, p = o.child; p; ) {
          if (p === n) {
            c = !0, n = o, r = i;
            break;
          }
          if (p === r) {
            c = !0, r = o, n = i;
            break;
          }
          p = p.sibling;
        }
        if (!c) {
          for (p = i.child; p; ) {
            if (p === n) {
              c = !0, n = i, r = o;
              break;
            }
            if (p === r) {
              c = !0, r = i, n = o;
              break;
            }
            p = p.sibling;
          }
          if (!c) throw Error(l(189));
        }
      }
      if (n.alternate !== r) throw Error(l(190));
    }
    if (n.tag !== 3) throw Error(l(188));
    return n.stateNode.current === n ? e : t;
  }
  function po(e) {
    return e = ai(e), e !== null ? Rr(e) : null;
  }
  function Rr(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Rr(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var ui = a.unstable_scheduleCallback, ci = a.unstable_cancelCallback, u = a.unstable_shouldYield, h = a.unstable_requestPaint, S = a.unstable_now, M = a.unstable_getCurrentPriorityLevel, I = a.unstable_ImmediatePriority, U = a.unstable_UserBlockingPriority, D = a.unstable_NormalPriority, de = a.unstable_LowPriority, Be = a.unstable_IdlePriority, ue = null, me = null;
  function Ae(e) {
    if (me && typeof me.onCommitFiberRoot == "function") try {
      me.onCommitFiberRoot(ue, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var Pe = Math.clz32 ? Math.clz32 : ee, be = Math.log, ye = Math.LN2;
  function ee(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (be(e) / ye | 0) | 0;
  }
  var fe = 64, tt = 4194304;
  function en(e) {
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
  function rt(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, o = e.suspendedLanes, i = e.pingedLanes, c = n & 268435455;
    if (c !== 0) {
      var p = c & ~o;
      p !== 0 ? r = en(p) : (i &= c, i !== 0 && (r = en(i)));
    } else c = n & ~o, c !== 0 ? r = en(c) : i !== 0 && (r = en(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & o) === 0 && (o = r & -r, i = t & -t, o >= i || o === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Pe(t), o = 1 << n, r |= e[n], t &= ~o;
    return r;
  }
  function Cs(e, t) {
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
  function dr(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, o = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var c = 31 - Pe(i), p = 1 << c, v = o[c];
      v === -1 ? ((p & n) === 0 || (p & r) !== 0) && (o[c] = Cs(p, t)) : v <= t && (e.expiredLanes |= p), i &= ~p;
    }
  }
  function Tt(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ho() {
    var e = fe;
    return fe <<= 1, (fe & 4194240) === 0 && (fe = 64), e;
  }
  function Ir(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Mn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Pe(t), e[t] = n;
  }
  function On(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var o = 31 - Pe(n), i = 1 << o;
      t[o] = 0, r[o] = -1, e[o] = -1, n &= ~i;
    }
  }
  function mo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - Pe(n), o = 1 << r;
      o & t | e[r] & t && (e[r] |= t), n &= ~o;
    }
  }
  var Fe = 0;
  function Ta(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Ra, Es, Ia, za, La, _s = !1, di = [], $n = null, An = null, Fn = null, vo = /* @__PURE__ */ new Map(), yo = /* @__PURE__ */ new Map(), Dn = [], Dd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ma(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        $n = null;
        break;
      case "dragenter":
      case "dragleave":
        An = null;
        break;
      case "mouseover":
      case "mouseout":
        Fn = null;
        break;
      case "pointerover":
      case "pointerout":
        vo.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        yo.delete(t.pointerId);
    }
  }
  function go(e, t, n, r, o, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [o] }, t !== null && (t = zo(t), t !== null && Es(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e);
  }
  function Ud(e, t, n, r, o) {
    switch (t) {
      case "focusin":
        return $n = go($n, e, t, n, r, o), !0;
      case "dragenter":
        return An = go(An, e, t, n, r, o), !0;
      case "mouseover":
        return Fn = go(Fn, e, t, n, r, o), !0;
      case "pointerover":
        var i = o.pointerId;
        return vo.set(i, go(vo.get(i) || null, e, t, n, r, o)), !0;
      case "gotpointercapture":
        return i = o.pointerId, yo.set(i, go(yo.get(i) || null, e, t, n, r, o)), !0;
    }
    return !1;
  }
  function Oa(e) {
    var t = fr(e.target);
    if (t !== null) {
      var n = yn(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = co(n), t !== null) {
            e.blockedOn = t, La(e.priority, function() {
              Ia(n);
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
  function fi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Ns(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Nr = r, n.target.dispatchEvent(r), Nr = null;
      } else return t = zo(n), t !== null && Es(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function $a(e, t, n) {
    fi(e) && n.delete(t);
  }
  function Bd() {
    _s = !1, $n !== null && fi($n) && ($n = null), An !== null && fi(An) && (An = null), Fn !== null && fi(Fn) && (Fn = null), vo.forEach($a), yo.forEach($a);
  }
  function wo(e, t) {
    e.blockedOn === t && (e.blockedOn = null, _s || (_s = !0, a.unstable_scheduleCallback(a.unstable_NormalPriority, Bd)));
  }
  function xo(e) {
    function t(o) {
      return wo(o, e);
    }
    if (0 < di.length) {
      wo(di[0], e);
      for (var n = 1; n < di.length; n++) {
        var r = di[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for ($n !== null && wo($n, e), An !== null && wo(An, e), Fn !== null && wo(Fn, e), vo.forEach(t), yo.forEach(t), n = 0; n < Dn.length; n++) r = Dn[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Dn.length && (n = Dn[0], n.blockedOn === null); ) Oa(n), n.blockedOn === null && Dn.shift();
  }
  var zr = te.ReactCurrentBatchConfig, pi = !0;
  function Vd(e, t, n, r) {
    var o = Fe, i = zr.transition;
    zr.transition = null;
    try {
      Fe = 1, Ps(e, t, n, r);
    } finally {
      Fe = o, zr.transition = i;
    }
  }
  function Wd(e, t, n, r) {
    var o = Fe, i = zr.transition;
    zr.transition = null;
    try {
      Fe = 4, Ps(e, t, n, r);
    } finally {
      Fe = o, zr.transition = i;
    }
  }
  function Ps(e, t, n, r) {
    if (pi) {
      var o = Ns(e, t, n, r);
      if (o === null) Qs(e, t, r, hi, n), Ma(e, r);
      else if (Ud(o, e, t, n, r)) r.stopPropagation();
      else if (Ma(e, r), t & 4 && -1 < Dd.indexOf(e)) {
        for (; o !== null; ) {
          var i = zo(o);
          if (i !== null && Ra(i), i = Ns(e, t, n, r), i === null && Qs(e, t, r, hi, n), i === o) break;
          o = i;
        }
        o !== null && r.stopPropagation();
      } else Qs(e, t, r, null, n);
    }
  }
  var hi = null;
  function Ns(e, t, n, r) {
    if (hi = null, e = In(r), e = fr(e), e !== null) if (t = yn(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = co(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return hi = e, null;
  }
  function Aa(e) {
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
        switch (M()) {
          case I:
            return 1;
          case U:
            return 4;
          case D:
          case de:
            return 16;
          case Be:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Un = null, Ts = null, mi = null;
  function Fa() {
    if (mi) return mi;
    var e, t = Ts, n = t.length, r, o = "value" in Un ? Un.value : Un.textContent, i = o.length;
    for (e = 0; e < n && t[e] === o[e]; e++) ;
    var c = n - e;
    for (r = 1; r <= c && t[n - r] === o[i - r]; r++) ;
    return mi = o.slice(e, 1 < r ? 1 - r : void 0);
  }
  function vi(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function yi() {
    return !0;
  }
  function Da() {
    return !1;
  }
  function Rt(e) {
    function t(n, r, o, i, c) {
      this._reactName = n, this._targetInst = o, this.type = r, this.nativeEvent = i, this.target = c, this.currentTarget = null;
      for (var p in e) e.hasOwnProperty(p) && (n = e[p], this[p] = n ? n(i) : i[p]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? yi : Da, this.isPropagationStopped = Da, this;
    }
    return H(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = yi);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = yi);
    }, persist: function() {
    }, isPersistent: yi }), t;
  }
  var Lr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Rs = Rt(Lr), So = H({}, Lr, { view: 0, detail: 0 }), Hd = Rt(So), Is, zs, ko, gi = H({}, So, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Ms, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== ko && (ko && e.type === "mousemove" ? (Is = e.screenX - ko.screenX, zs = e.screenY - ko.screenY) : zs = Is = 0, ko = e), Is);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : zs;
  } }), Ua = Rt(gi), Qd = H({}, gi, { dataTransfer: 0 }), Kd = Rt(Qd), Xd = H({}, So, { relatedTarget: 0 }), Ls = Rt(Xd), Yd = H({}, Lr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Jd = Rt(Yd), qd = H({}, Lr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Gd = Rt(qd), Zd = H({}, Lr, { data: 0 }), Ba = Rt(Zd), bd = {
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
  }, ef = {
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
  }, tf = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function nf(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = tf[e]) ? !!t[e] : !1;
  }
  function Ms() {
    return nf;
  }
  var rf = H({}, So, { key: function(e) {
    if (e.key) {
      var t = bd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = vi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? ef[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Ms, charCode: function(e) {
    return e.type === "keypress" ? vi(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? vi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), of = Rt(rf), sf = H({}, gi, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Va = Rt(sf), lf = H({}, So, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Ms }), af = Rt(lf), uf = H({}, Lr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), cf = Rt(uf), df = H({}, gi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), ff = Rt(df), pf = [9, 13, 27, 32], Os = E && "CompositionEvent" in window, jo = null;
  E && "documentMode" in document && (jo = document.documentMode);
  var hf = E && "TextEvent" in window && !jo, Wa = E && (!Os || jo && 8 < jo && 11 >= jo), Ha = " ", Qa = !1;
  function Ka(e, t) {
    switch (e) {
      case "keyup":
        return pf.indexOf(t.keyCode) !== -1;
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
  function Xa(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Mr = !1;
  function mf(e, t) {
    switch (e) {
      case "compositionend":
        return Xa(t);
      case "keypress":
        return t.which !== 32 ? null : (Qa = !0, Ha);
      case "textInput":
        return e = t.data, e === Ha && Qa ? null : e;
      default:
        return null;
    }
  }
  function vf(e, t) {
    if (Mr) return e === "compositionend" || !Os && Ka(e, t) ? (e = Fa(), mi = Ts = Un = null, Mr = !1, e) : null;
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
        return Wa && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var yf = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Ya(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!yf[e.type] : t === "textarea";
  }
  function Ja(e, t, n, r) {
    ri(r), t = ji(t, "onChange"), 0 < t.length && (n = new Rs("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Co = null, Eo = null;
  function gf(e) {
    pu(e, 0);
  }
  function wi(e) {
    var t = Dr(e);
    if (St(t)) return e;
  }
  function wf(e, t) {
    if (e === "change") return t;
  }
  var qa = !1;
  if (E) {
    var $s;
    if (E) {
      var As = "oninput" in document;
      if (!As) {
        var Ga = document.createElement("div");
        Ga.setAttribute("oninput", "return;"), As = typeof Ga.oninput == "function";
      }
      $s = As;
    } else $s = !1;
    qa = $s && (!document.documentMode || 9 < document.documentMode);
  }
  function Za() {
    Co && (Co.detachEvent("onpropertychange", ba), Eo = Co = null);
  }
  function ba(e) {
    if (e.propertyName === "value" && wi(Eo)) {
      var t = [];
      Ja(t, Eo, e, In(e)), lo(gf, t);
    }
  }
  function xf(e, t, n) {
    e === "focusin" ? (Za(), Co = t, Eo = n, Co.attachEvent("onpropertychange", ba)) : e === "focusout" && Za();
  }
  function Sf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return wi(Eo);
  }
  function kf(e, t) {
    if (e === "click") return wi(t);
  }
  function jf(e, t) {
    if (e === "input" || e === "change") return wi(t);
  }
  function Cf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Wt = typeof Object.is == "function" ? Object.is : Cf;
  function _o(e, t) {
    if (Wt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var o = n[r];
      if (!C.call(t, o) || !Wt(e[o], t[o])) return !1;
    }
    return !0;
  }
  function eu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function tu(e, t) {
    var n = eu(e);
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
      n = eu(n);
    }
  }
  function nu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? nu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ru() {
    for (var e = window, t = Me(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Me(e.document);
    }
    return t;
  }
  function Fs(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Ef(e) {
    var t = ru(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && nu(n.ownerDocument.documentElement, n)) {
      if (r !== null && Fs(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var o = n.textContent.length, i = Math.min(r.start, o);
          r = r.end === void 0 ? i : Math.min(r.end, o), !e.extend && i > r && (o = r, r = i, i = o), o = tu(n, i);
          var c = tu(
            n,
            r
          );
          o && c && (e.rangeCount !== 1 || e.anchorNode !== o.node || e.anchorOffset !== o.offset || e.focusNode !== c.node || e.focusOffset !== c.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(c.node, c.offset)) : (t.setEnd(c.node, c.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var _f = E && "documentMode" in document && 11 >= document.documentMode, Or = null, Ds = null, Po = null, Us = !1;
  function ou(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Us || Or == null || Or !== Me(r) || (r = Or, "selectionStart" in r && Fs(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Po && _o(Po, r) || (Po = r, r = ji(Ds, "onSelect"), 0 < r.length && (t = new Rs("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Or)));
  }
  function xi(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var $r = { animationend: xi("Animation", "AnimationEnd"), animationiteration: xi("Animation", "AnimationIteration"), animationstart: xi("Animation", "AnimationStart"), transitionend: xi("Transition", "TransitionEnd") }, Bs = {}, iu = {};
  E && (iu = document.createElement("div").style, "AnimationEvent" in window || (delete $r.animationend.animation, delete $r.animationiteration.animation, delete $r.animationstart.animation), "TransitionEvent" in window || delete $r.transitionend.transition);
  function Si(e) {
    if (Bs[e]) return Bs[e];
    if (!$r[e]) return e;
    var t = $r[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in iu) return Bs[e] = t[n];
    return e;
  }
  var su = Si("animationend"), lu = Si("animationiteration"), au = Si("animationstart"), uu = Si("transitionend"), cu = /* @__PURE__ */ new Map(), du = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Bn(e, t) {
    cu.set(e, t), m(t, [e]);
  }
  for (var Vs = 0; Vs < du.length; Vs++) {
    var Ws = du[Vs], Pf = Ws.toLowerCase(), Nf = Ws[0].toUpperCase() + Ws.slice(1);
    Bn(Pf, "on" + Nf);
  }
  Bn(su, "onAnimationEnd"), Bn(lu, "onAnimationIteration"), Bn(au, "onAnimationStart"), Bn("dblclick", "onDoubleClick"), Bn("focusin", "onFocus"), Bn("focusout", "onBlur"), Bn(uu, "onTransitionEnd"), _("onMouseEnter", ["mouseout", "mouseover"]), _("onMouseLeave", ["mouseout", "mouseover"]), _("onPointerEnter", ["pointerout", "pointerover"]), _("onPointerLeave", ["pointerout", "pointerover"]), m("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), m("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), m("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), m("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), m("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), m("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var No = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Tf = new Set("cancel close invalid load scroll toggle".split(" ").concat(No));
  function fu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, li(r, t, void 0, e), e.currentTarget = null;
  }
  function pu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], o = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var c = r.length - 1; 0 <= c; c--) {
          var p = r[c], v = p.instance, j = p.currentTarget;
          if (p = p.listener, v !== i && o.isPropagationStopped()) break e;
          fu(o, p, j), i = v;
        }
        else for (c = 0; c < r.length; c++) {
          if (p = r[c], v = p.instance, j = p.currentTarget, p = p.listener, v !== i && o.isPropagationStopped()) break e;
          fu(o, p, j), i = v;
        }
      }
    }
    if (cr) throw e = uo, cr = !1, uo = null, e;
  }
  function He(e, t) {
    var n = t[Gs];
    n === void 0 && (n = t[Gs] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (hu(t, e, 2, !1), n.add(r));
  }
  function Hs(e, t, n) {
    var r = 0;
    t && (r |= 4), hu(n, e, r, t);
  }
  var ki = "_reactListening" + Math.random().toString(36).slice(2);
  function To(e) {
    if (!e[ki]) {
      e[ki] = !0, d.forEach(function(n) {
        n !== "selectionchange" && (Tf.has(n) || Hs(n, !1, e), Hs(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ki] || (t[ki] = !0, Hs("selectionchange", !1, t));
    }
  }
  function hu(e, t, n, r) {
    switch (Aa(t)) {
      case 1:
        var o = Vd;
        break;
      case 4:
        o = Wd;
        break;
      default:
        o = Ps;
    }
    n = o.bind(null, t, n, e), o = void 0, !ao || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), r ? o !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: o }) : e.addEventListener(t, n, !0) : o !== void 0 ? e.addEventListener(t, n, { passive: o }) : e.addEventListener(t, n, !1);
  }
  function Qs(e, t, n, r, o) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var c = r.tag;
      if (c === 3 || c === 4) {
        var p = r.stateNode.containerInfo;
        if (p === o || p.nodeType === 8 && p.parentNode === o) break;
        if (c === 4) for (c = r.return; c !== null; ) {
          var v = c.tag;
          if ((v === 3 || v === 4) && (v = c.stateNode.containerInfo, v === o || v.nodeType === 8 && v.parentNode === o)) return;
          c = c.return;
        }
        for (; p !== null; ) {
          if (c = fr(p), c === null) return;
          if (v = c.tag, v === 5 || v === 6) {
            r = i = c;
            continue e;
          }
          p = p.parentNode;
        }
      }
      r = r.return;
    }
    lo(function() {
      var j = i, L = In(n), O = [];
      e: {
        var z = cu.get(e);
        if (z !== void 0) {
          var Q = Rs, X = e;
          switch (e) {
            case "keypress":
              if (vi(n) === 0) break e;
            case "keydown":
            case "keyup":
              Q = of;
              break;
            case "focusin":
              X = "focus", Q = Ls;
              break;
            case "focusout":
              X = "blur", Q = Ls;
              break;
            case "beforeblur":
            case "afterblur":
              Q = Ls;
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
              Q = Ua;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Q = Kd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Q = af;
              break;
            case su:
            case lu:
            case au:
              Q = Jd;
              break;
            case uu:
              Q = cf;
              break;
            case "scroll":
              Q = Hd;
              break;
            case "wheel":
              Q = ff;
              break;
            case "copy":
            case "cut":
            case "paste":
              Q = Gd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Q = Va;
          }
          var J = (t & 4) !== 0, et = !J && e === "scroll", x = J ? z !== null ? z + "Capture" : null : z;
          J = [];
          for (var y = j, k; y !== null; ) {
            k = y;
            var F = k.stateNode;
            if (k.tag === 5 && F !== null && (k = F, x !== null && (F = mn(y, x), F != null && J.push(Ro(y, F, k)))), et) break;
            y = y.return;
          }
          0 < J.length && (z = new Q(z, X, null, n, L), O.push({ event: z, listeners: J }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (z = e === "mouseover" || e === "pointerover", Q = e === "mouseout" || e === "pointerout", z && n !== Nr && (X = n.relatedTarget || n.fromElement) && (fr(X) || X[gn])) break e;
          if ((Q || z) && (z = L.window === L ? L : (z = L.ownerDocument) ? z.defaultView || z.parentWindow : window, Q ? (X = n.relatedTarget || n.toElement, Q = j, X = X ? fr(X) : null, X !== null && (et = yn(X), X !== et || X.tag !== 5 && X.tag !== 6) && (X = null)) : (Q = null, X = j), Q !== X)) {
            if (J = Ua, F = "onMouseLeave", x = "onMouseEnter", y = "mouse", (e === "pointerout" || e === "pointerover") && (J = Va, F = "onPointerLeave", x = "onPointerEnter", y = "pointer"), et = Q == null ? z : Dr(Q), k = X == null ? z : Dr(X), z = new J(F, y + "leave", Q, n, L), z.target = et, z.relatedTarget = k, F = null, fr(L) === j && (J = new J(x, y + "enter", X, n, L), J.target = k, J.relatedTarget = et, F = J), et = F, Q && X) t: {
              for (J = Q, x = X, y = 0, k = J; k; k = Ar(k)) y++;
              for (k = 0, F = x; F; F = Ar(F)) k++;
              for (; 0 < y - k; ) J = Ar(J), y--;
              for (; 0 < k - y; ) x = Ar(x), k--;
              for (; y--; ) {
                if (J === x || x !== null && J === x.alternate) break t;
                J = Ar(J), x = Ar(x);
              }
              J = null;
            }
            else J = null;
            Q !== null && mu(O, z, Q, J, !1), X !== null && et !== null && mu(O, et, X, J, !0);
          }
        }
        e: {
          if (z = j ? Dr(j) : window, Q = z.nodeName && z.nodeName.toLowerCase(), Q === "select" || Q === "input" && z.type === "file") var b = wf;
          else if (Ya(z)) if (qa) b = jf;
          else {
            b = Sf;
            var se = xf;
          }
          else (Q = z.nodeName) && Q.toLowerCase() === "input" && (z.type === "checkbox" || z.type === "radio") && (b = kf);
          if (b && (b = b(e, j))) {
            Ja(O, b, n, L);
            break e;
          }
          se && se(e, z, j), e === "focusout" && (se = z._wrapperState) && se.controlled && z.type === "number" && Pn(z, "number", z.value);
        }
        switch (se = j ? Dr(j) : window, e) {
          case "focusin":
            (Ya(se) || se.contentEditable === "true") && (Or = se, Ds = j, Po = null);
            break;
          case "focusout":
            Po = Ds = Or = null;
            break;
          case "mousedown":
            Us = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Us = !1, ou(O, n, L);
            break;
          case "selectionchange":
            if (_f) break;
          case "keydown":
          case "keyup":
            ou(O, n, L);
        }
        var le;
        if (Os) e: {
          switch (e) {
            case "compositionstart":
              var pe = "onCompositionStart";
              break e;
            case "compositionend":
              pe = "onCompositionEnd";
              break e;
            case "compositionupdate":
              pe = "onCompositionUpdate";
              break e;
          }
          pe = void 0;
        }
        else Mr ? Ka(e, n) && (pe = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (pe = "onCompositionStart");
        pe && (Wa && n.locale !== "ko" && (Mr || pe !== "onCompositionStart" ? pe === "onCompositionEnd" && Mr && (le = Fa()) : (Un = L, Ts = "value" in Un ? Un.value : Un.textContent, Mr = !0)), se = ji(j, pe), 0 < se.length && (pe = new Ba(pe, e, null, n, L), O.push({ event: pe, listeners: se }), le ? pe.data = le : (le = Xa(n), le !== null && (pe.data = le)))), (le = hf ? mf(e, n) : vf(e, n)) && (j = ji(j, "onBeforeInput"), 0 < j.length && (L = new Ba("onBeforeInput", "beforeinput", null, n, L), O.push({ event: L, listeners: j }), L.data = le));
      }
      pu(O, t);
    });
  }
  function Ro(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function ji(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var o = e, i = o.stateNode;
      o.tag === 5 && i !== null && (o = i, i = mn(e, n), i != null && r.unshift(Ro(e, i, o)), i = mn(e, t), i != null && r.push(Ro(e, i, o))), e = e.return;
    }
    return r;
  }
  function Ar(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function mu(e, t, n, r, o) {
    for (var i = t._reactName, c = []; n !== null && n !== r; ) {
      var p = n, v = p.alternate, j = p.stateNode;
      if (v !== null && v === r) break;
      p.tag === 5 && j !== null && (p = j, o ? (v = mn(n, i), v != null && c.unshift(Ro(n, v, p))) : o || (v = mn(n, i), v != null && c.push(Ro(n, v, p)))), n = n.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var Rf = /\r\n?/g, If = /\u0000|\uFFFD/g;
  function vu(e) {
    return (typeof e == "string" ? e : "" + e).replace(Rf, `
`).replace(If, "");
  }
  function Ci(e, t, n) {
    if (t = vu(t), vu(e) !== t && n) throw Error(l(425));
  }
  function Ei() {
  }
  var Ks = null, Xs = null;
  function Ys(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Js = typeof setTimeout == "function" ? setTimeout : void 0, zf = typeof clearTimeout == "function" ? clearTimeout : void 0, yu = typeof Promise == "function" ? Promise : void 0, Lf = typeof queueMicrotask == "function" ? queueMicrotask : typeof yu < "u" ? function(e) {
    return yu.resolve(null).then(e).catch(Mf);
  } : Js;
  function Mf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function qs(e, t) {
    var n = t, r = 0;
    do {
      var o = n.nextSibling;
      if (e.removeChild(n), o && o.nodeType === 8) if (n = o.data, n === "/$") {
        if (r === 0) {
          e.removeChild(o), xo(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = o;
    } while (n);
    xo(t);
  }
  function Vn(e) {
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
  function gu(e) {
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
  var Fr = Math.random().toString(36).slice(2), tn = "__reactFiber$" + Fr, Io = "__reactProps$" + Fr, gn = "__reactContainer$" + Fr, Gs = "__reactEvents$" + Fr, Of = "__reactListeners$" + Fr, $f = "__reactHandles$" + Fr;
  function fr(e) {
    var t = e[tn];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[gn] || n[tn]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = gu(e); e !== null; ) {
          if (n = e[tn]) return n;
          e = gu(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function zo(e) {
    return e = e[tn] || e[gn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Dr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(l(33));
  }
  function _i(e) {
    return e[Io] || null;
  }
  var Zs = [], Ur = -1;
  function Wn(e) {
    return { current: e };
  }
  function Qe(e) {
    0 > Ur || (e.current = Zs[Ur], Zs[Ur] = null, Ur--);
  }
  function We(e, t) {
    Ur++, Zs[Ur] = e.current, e.current = t;
  }
  var Hn = {}, pt = Wn(Hn), jt = Wn(!1), pr = Hn;
  function Br(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Hn;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o = {}, i;
    for (i in n) o[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = o), o;
  }
  function Ct(e) {
    return e = e.childContextTypes, e != null;
  }
  function Pi() {
    Qe(jt), Qe(pt);
  }
  function wu(e, t, n) {
    if (pt.current !== Hn) throw Error(l(168));
    We(pt, t), We(jt, n);
  }
  function xu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var o in r) if (!(o in t)) throw Error(l(108, Ce(e) || "Unknown", o));
    return H({}, n, r);
  }
  function Ni(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Hn, pr = pt.current, We(pt, e), We(jt, jt.current), !0;
  }
  function Su(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(l(169));
    n ? (e = xu(e, t, pr), r.__reactInternalMemoizedMergedChildContext = e, Qe(jt), Qe(pt), We(pt, e)) : Qe(jt), We(jt, n);
  }
  var wn = null, Ti = !1, bs = !1;
  function ku(e) {
    wn === null ? wn = [e] : wn.push(e);
  }
  function Af(e) {
    Ti = !0, ku(e);
  }
  function Qn() {
    if (!bs && wn !== null) {
      bs = !0;
      var e = 0, t = Fe;
      try {
        var n = wn;
        for (Fe = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        wn = null, Ti = !1;
      } catch (o) {
        throw wn !== null && (wn = wn.slice(e + 1)), ui(I, Qn), o;
      } finally {
        Fe = t, bs = !1;
      }
    }
    return null;
  }
  var Vr = [], Wr = 0, Ri = null, Ii = 0, $t = [], At = 0, hr = null, xn = 1, Sn = "";
  function mr(e, t) {
    Vr[Wr++] = Ii, Vr[Wr++] = Ri, Ri = e, Ii = t;
  }
  function ju(e, t, n) {
    $t[At++] = xn, $t[At++] = Sn, $t[At++] = hr, hr = e;
    var r = xn;
    e = Sn;
    var o = 32 - Pe(r) - 1;
    r &= ~(1 << o), n += 1;
    var i = 32 - Pe(t) + o;
    if (30 < i) {
      var c = o - o % 5;
      i = (r & (1 << c) - 1).toString(32), r >>= c, o -= c, xn = 1 << 32 - Pe(t) + o | n << o | r, Sn = i + e;
    } else xn = 1 << i | n << o | r, Sn = e;
  }
  function el(e) {
    e.return !== null && (mr(e, 1), ju(e, 1, 0));
  }
  function tl(e) {
    for (; e === Ri; ) Ri = Vr[--Wr], Vr[Wr] = null, Ii = Vr[--Wr], Vr[Wr] = null;
    for (; e === hr; ) hr = $t[--At], $t[At] = null, Sn = $t[--At], $t[At] = null, xn = $t[--At], $t[At] = null;
  }
  var It = null, zt = null, Xe = !1, Ht = null;
  function Cu(e, t) {
    var n = Bt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Eu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, It = e, zt = Vn(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, It = e, zt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = hr !== null ? { id: xn, overflow: Sn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = Bt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, It = e, zt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function nl(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function rl(e) {
    if (Xe) {
      var t = zt;
      if (t) {
        var n = t;
        if (!Eu(e, t)) {
          if (nl(e)) throw Error(l(418));
          t = Vn(n.nextSibling);
          var r = It;
          t && Eu(e, t) ? Cu(r, n) : (e.flags = e.flags & -4097 | 2, Xe = !1, It = e);
        }
      } else {
        if (nl(e)) throw Error(l(418));
        e.flags = e.flags & -4097 | 2, Xe = !1, It = e;
      }
    }
  }
  function _u(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    It = e;
  }
  function zi(e) {
    if (e !== It) return !1;
    if (!Xe) return _u(e), Xe = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ys(e.type, e.memoizedProps)), t && (t = zt)) {
      if (nl(e)) throw Pu(), Error(l(418));
      for (; t; ) Cu(e, t), t = Vn(t.nextSibling);
    }
    if (_u(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(l(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                zt = Vn(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        zt = null;
      }
    } else zt = It ? Vn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Pu() {
    for (var e = zt; e; ) e = Vn(e.nextSibling);
  }
  function Hr() {
    zt = It = null, Xe = !1;
  }
  function ol(e) {
    Ht === null ? Ht = [e] : Ht.push(e);
  }
  var Ff = te.ReactCurrentBatchConfig;
  function Lo(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(l(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(l(147, e));
        var o = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(c) {
          var p = o.refs;
          c === null ? delete p[i] : p[i] = c;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(l(284));
      if (!n._owner) throw Error(l(290, e));
    }
    return e;
  }
  function Li(e, t) {
    throw e = Object.prototype.toString.call(t), Error(l(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Nu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Tu(e) {
    function t(x, y) {
      if (e) {
        var k = x.deletions;
        k === null ? (x.deletions = [y], x.flags |= 16) : k.push(y);
      }
    }
    function n(x, y) {
      if (!e) return null;
      for (; y !== null; ) t(x, y), y = y.sibling;
      return null;
    }
    function r(x, y) {
      for (x = /* @__PURE__ */ new Map(); y !== null; ) y.key !== null ? x.set(y.key, y) : x.set(y.index, y), y = y.sibling;
      return x;
    }
    function o(x, y) {
      return x = bn(x, y), x.index = 0, x.sibling = null, x;
    }
    function i(x, y, k) {
      return x.index = k, e ? (k = x.alternate, k !== null ? (k = k.index, k < y ? (x.flags |= 2, y) : k) : (x.flags |= 2, y)) : (x.flags |= 1048576, y);
    }
    function c(x) {
      return e && x.alternate === null && (x.flags |= 2), x;
    }
    function p(x, y, k, F) {
      return y === null || y.tag !== 6 ? (y = Jl(k, x.mode, F), y.return = x, y) : (y = o(y, k), y.return = x, y);
    }
    function v(x, y, k, F) {
      var b = k.type;
      return b === ge ? L(x, y, k.props.children, F, k.key) : y !== null && (y.elementType === b || typeof b == "object" && b !== null && b.$$typeof === xe && Nu(b) === y.type) ? (F = o(y, k.props), F.ref = Lo(x, y, k), F.return = x, F) : (F = rs(k.type, k.key, k.props, null, x.mode, F), F.ref = Lo(x, y, k), F.return = x, F);
    }
    function j(x, y, k, F) {
      return y === null || y.tag !== 4 || y.stateNode.containerInfo !== k.containerInfo || y.stateNode.implementation !== k.implementation ? (y = ql(k, x.mode, F), y.return = x, y) : (y = o(y, k.children || []), y.return = x, y);
    }
    function L(x, y, k, F, b) {
      return y === null || y.tag !== 7 ? (y = jr(k, x.mode, F, b), y.return = x, y) : (y = o(y, k), y.return = x, y);
    }
    function O(x, y, k) {
      if (typeof y == "string" && y !== "" || typeof y == "number") return y = Jl("" + y, x.mode, k), y.return = x, y;
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case V:
            return k = rs(y.type, y.key, y.props, null, x.mode, k), k.ref = Lo(x, null, y), k.return = x, k;
          case je:
            return y = ql(y, x.mode, k), y.return = x, y;
          case xe:
            var F = y._init;
            return O(x, F(y._payload), k);
        }
        if (ir(y) || W(y)) return y = jr(y, x.mode, k, null), y.return = x, y;
        Li(x, y);
      }
      return null;
    }
    function z(x, y, k, F) {
      var b = y !== null ? y.key : null;
      if (typeof k == "string" && k !== "" || typeof k == "number") return b !== null ? null : p(x, y, "" + k, F);
      if (typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case V:
            return k.key === b ? v(x, y, k, F) : null;
          case je:
            return k.key === b ? j(x, y, k, F) : null;
          case xe:
            return b = k._init, z(
              x,
              y,
              b(k._payload),
              F
            );
        }
        if (ir(k) || W(k)) return b !== null ? null : L(x, y, k, F, null);
        Li(x, k);
      }
      return null;
    }
    function Q(x, y, k, F, b) {
      if (typeof F == "string" && F !== "" || typeof F == "number") return x = x.get(k) || null, p(y, x, "" + F, b);
      if (typeof F == "object" && F !== null) {
        switch (F.$$typeof) {
          case V:
            return x = x.get(F.key === null ? k : F.key) || null, v(y, x, F, b);
          case je:
            return x = x.get(F.key === null ? k : F.key) || null, j(y, x, F, b);
          case xe:
            var se = F._init;
            return Q(x, y, k, se(F._payload), b);
        }
        if (ir(F) || W(F)) return x = x.get(k) || null, L(y, x, F, b, null);
        Li(y, F);
      }
      return null;
    }
    function X(x, y, k, F) {
      for (var b = null, se = null, le = y, pe = y = 0, at = null; le !== null && pe < k.length; pe++) {
        le.index > pe ? (at = le, le = null) : at = le.sibling;
        var ze = z(x, le, k[pe], F);
        if (ze === null) {
          le === null && (le = at);
          break;
        }
        e && le && ze.alternate === null && t(x, le), y = i(ze, y, pe), se === null ? b = ze : se.sibling = ze, se = ze, le = at;
      }
      if (pe === k.length) return n(x, le), Xe && mr(x, pe), b;
      if (le === null) {
        for (; pe < k.length; pe++) le = O(x, k[pe], F), le !== null && (y = i(le, y, pe), se === null ? b = le : se.sibling = le, se = le);
        return Xe && mr(x, pe), b;
      }
      for (le = r(x, le); pe < k.length; pe++) at = Q(le, x, pe, k[pe], F), at !== null && (e && at.alternate !== null && le.delete(at.key === null ? pe : at.key), y = i(at, y, pe), se === null ? b = at : se.sibling = at, se = at);
      return e && le.forEach(function(er) {
        return t(x, er);
      }), Xe && mr(x, pe), b;
    }
    function J(x, y, k, F) {
      var b = W(k);
      if (typeof b != "function") throw Error(l(150));
      if (k = b.call(k), k == null) throw Error(l(151));
      for (var se = b = null, le = y, pe = y = 0, at = null, ze = k.next(); le !== null && !ze.done; pe++, ze = k.next()) {
        le.index > pe ? (at = le, le = null) : at = le.sibling;
        var er = z(x, le, ze.value, F);
        if (er === null) {
          le === null && (le = at);
          break;
        }
        e && le && er.alternate === null && t(x, le), y = i(er, y, pe), se === null ? b = er : se.sibling = er, se = er, le = at;
      }
      if (ze.done) return n(
        x,
        le
      ), Xe && mr(x, pe), b;
      if (le === null) {
        for (; !ze.done; pe++, ze = k.next()) ze = O(x, ze.value, F), ze !== null && (y = i(ze, y, pe), se === null ? b = ze : se.sibling = ze, se = ze);
        return Xe && mr(x, pe), b;
      }
      for (le = r(x, le); !ze.done; pe++, ze = k.next()) ze = Q(le, x, pe, ze.value, F), ze !== null && (e && ze.alternate !== null && le.delete(ze.key === null ? pe : ze.key), y = i(ze, y, pe), se === null ? b = ze : se.sibling = ze, se = ze);
      return e && le.forEach(function(yp) {
        return t(x, yp);
      }), Xe && mr(x, pe), b;
    }
    function et(x, y, k, F) {
      if (typeof k == "object" && k !== null && k.type === ge && k.key === null && (k = k.props.children), typeof k == "object" && k !== null) {
        switch (k.$$typeof) {
          case V:
            e: {
              for (var b = k.key, se = y; se !== null; ) {
                if (se.key === b) {
                  if (b = k.type, b === ge) {
                    if (se.tag === 7) {
                      n(x, se.sibling), y = o(se, k.props.children), y.return = x, x = y;
                      break e;
                    }
                  } else if (se.elementType === b || typeof b == "object" && b !== null && b.$$typeof === xe && Nu(b) === se.type) {
                    n(x, se.sibling), y = o(se, k.props), y.ref = Lo(x, se, k), y.return = x, x = y;
                    break e;
                  }
                  n(x, se);
                  break;
                } else t(x, se);
                se = se.sibling;
              }
              k.type === ge ? (y = jr(k.props.children, x.mode, F, k.key), y.return = x, x = y) : (F = rs(k.type, k.key, k.props, null, x.mode, F), F.ref = Lo(x, y, k), F.return = x, x = F);
            }
            return c(x);
          case je:
            e: {
              for (se = k.key; y !== null; ) {
                if (y.key === se) if (y.tag === 4 && y.stateNode.containerInfo === k.containerInfo && y.stateNode.implementation === k.implementation) {
                  n(x, y.sibling), y = o(y, k.children || []), y.return = x, x = y;
                  break e;
                } else {
                  n(x, y);
                  break;
                }
                else t(x, y);
                y = y.sibling;
              }
              y = ql(k, x.mode, F), y.return = x, x = y;
            }
            return c(x);
          case xe:
            return se = k._init, et(x, y, se(k._payload), F);
        }
        if (ir(k)) return X(x, y, k, F);
        if (W(k)) return J(x, y, k, F);
        Li(x, k);
      }
      return typeof k == "string" && k !== "" || typeof k == "number" ? (k = "" + k, y !== null && y.tag === 6 ? (n(x, y.sibling), y = o(y, k), y.return = x, x = y) : (n(x, y), y = Jl(k, x.mode, F), y.return = x, x = y), c(x)) : n(x, y);
    }
    return et;
  }
  var Qr = Tu(!0), Ru = Tu(!1), Mi = Wn(null), Oi = null, Kr = null, il = null;
  function sl() {
    il = Kr = Oi = null;
  }
  function ll(e) {
    var t = Mi.current;
    Qe(Mi), e._currentValue = t;
  }
  function al(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Xr(e, t) {
    Oi = e, il = Kr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Et = !0), e.firstContext = null);
  }
  function Ft(e) {
    var t = e._currentValue;
    if (il !== e) if (e = { context: e, memoizedValue: t, next: null }, Kr === null) {
      if (Oi === null) throw Error(l(308));
      Kr = e, Oi.dependencies = { lanes: 0, firstContext: e };
    } else Kr = Kr.next = e;
    return t;
  }
  var vr = null;
  function ul(e) {
    vr === null ? vr = [e] : vr.push(e);
  }
  function Iu(e, t, n, r) {
    var o = t.interleaved;
    return o === null ? (n.next = n, ul(t)) : (n.next = o.next, o.next = n), t.interleaved = n, kn(e, r);
  }
  function kn(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Kn = !1;
  function cl(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function zu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function jn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Xn(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (Re & 2) !== 0) {
      var o = r.pending;
      return o === null ? t.next = t : (t.next = o.next, o.next = t), r.pending = t, kn(e, n);
    }
    return o = r.interleaved, o === null ? (t.next = t, ul(r)) : (t.next = o.next, o.next = t), r.interleaved = t, kn(e, n);
  }
  function $i(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, mo(e, n);
    }
  }
  function Lu(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var o = null, i = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var c = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          i === null ? o = i = c : i = i.next = c, n = n.next;
        } while (n !== null);
        i === null ? o = i = t : i = i.next = t;
      } else o = i = t;
      n = { baseState: r.baseState, firstBaseUpdate: o, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function Ai(e, t, n, r) {
    var o = e.updateQueue;
    Kn = !1;
    var i = o.firstBaseUpdate, c = o.lastBaseUpdate, p = o.shared.pending;
    if (p !== null) {
      o.shared.pending = null;
      var v = p, j = v.next;
      v.next = null, c === null ? i = j : c.next = j, c = v;
      var L = e.alternate;
      L !== null && (L = L.updateQueue, p = L.lastBaseUpdate, p !== c && (p === null ? L.firstBaseUpdate = j : p.next = j, L.lastBaseUpdate = v));
    }
    if (i !== null) {
      var O = o.baseState;
      c = 0, L = j = v = null, p = i;
      do {
        var z = p.lane, Q = p.eventTime;
        if ((r & z) === z) {
          L !== null && (L = L.next = {
            eventTime: Q,
            lane: 0,
            tag: p.tag,
            payload: p.payload,
            callback: p.callback,
            next: null
          });
          e: {
            var X = e, J = p;
            switch (z = t, Q = n, J.tag) {
              case 1:
                if (X = J.payload, typeof X == "function") {
                  O = X.call(Q, O, z);
                  break e;
                }
                O = X;
                break e;
              case 3:
                X.flags = X.flags & -65537 | 128;
              case 0:
                if (X = J.payload, z = typeof X == "function" ? X.call(Q, O, z) : X, z == null) break e;
                O = H({}, O, z);
                break e;
              case 2:
                Kn = !0;
            }
          }
          p.callback !== null && p.lane !== 0 && (e.flags |= 64, z = o.effects, z === null ? o.effects = [p] : z.push(p));
        } else Q = { eventTime: Q, lane: z, tag: p.tag, payload: p.payload, callback: p.callback, next: null }, L === null ? (j = L = Q, v = O) : L = L.next = Q, c |= z;
        if (p = p.next, p === null) {
          if (p = o.shared.pending, p === null) break;
          z = p, p = z.next, z.next = null, o.lastBaseUpdate = z, o.shared.pending = null;
        }
      } while (!0);
      if (L === null && (v = O), o.baseState = v, o.firstBaseUpdate = j, o.lastBaseUpdate = L, t = o.shared.interleaved, t !== null) {
        o = t;
        do
          c |= o.lane, o = o.next;
        while (o !== t);
      } else i === null && (o.shared.lanes = 0);
      wr |= c, e.lanes = c, e.memoizedState = O;
    }
  }
  function Mu(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], o = r.callback;
      if (o !== null) {
        if (r.callback = null, r = n, typeof o != "function") throw Error(l(191, o));
        o.call(r);
      }
    }
  }
  var Mo = {}, nn = Wn(Mo), Oo = Wn(Mo), $o = Wn(Mo);
  function yr(e) {
    if (e === Mo) throw Error(l(174));
    return e;
  }
  function dl(e, t) {
    switch (We($o, t), We(Oo, e), We(nn, Mo), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : bt(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = bt(t, e);
    }
    Qe(nn), We(nn, t);
  }
  function Yr() {
    Qe(nn), Qe(Oo), Qe($o);
  }
  function Ou(e) {
    yr($o.current);
    var t = yr(nn.current), n = bt(t, e.type);
    t !== n && (We(Oo, e), We(nn, n));
  }
  function fl(e) {
    Oo.current === e && (Qe(nn), Qe(Oo));
  }
  var Ye = Wn(0);
  function Fi(e) {
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
  var pl = [];
  function hl() {
    for (var e = 0; e < pl.length; e++) pl[e]._workInProgressVersionPrimary = null;
    pl.length = 0;
  }
  var Di = te.ReactCurrentDispatcher, ml = te.ReactCurrentBatchConfig, gr = 0, Je = null, ot = null, st = null, Ui = !1, Ao = !1, Fo = 0, Df = 0;
  function ht() {
    throw Error(l(321));
  }
  function vl(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Wt(e[n], t[n])) return !1;
    return !0;
  }
  function yl(e, t, n, r, o, i) {
    if (gr = i, Je = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Di.current = e === null || e.memoizedState === null ? Wf : Hf, e = n(r, o), Ao) {
      i = 0;
      do {
        if (Ao = !1, Fo = 0, 25 <= i) throw Error(l(301));
        i += 1, st = ot = null, t.updateQueue = null, Di.current = Qf, e = n(r, o);
      } while (Ao);
    }
    if (Di.current = Wi, t = ot !== null && ot.next !== null, gr = 0, st = ot = Je = null, Ui = !1, t) throw Error(l(300));
    return e;
  }
  function gl() {
    var e = Fo !== 0;
    return Fo = 0, e;
  }
  function rn() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return st === null ? Je.memoizedState = st = e : st = st.next = e, st;
  }
  function Dt() {
    if (ot === null) {
      var e = Je.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = ot.next;
    var t = st === null ? Je.memoizedState : st.next;
    if (t !== null) st = t, ot = e;
    else {
      if (e === null) throw Error(l(310));
      ot = e, e = { memoizedState: ot.memoizedState, baseState: ot.baseState, baseQueue: ot.baseQueue, queue: ot.queue, next: null }, st === null ? Je.memoizedState = st = e : st = st.next = e;
    }
    return st;
  }
  function Do(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function wl(e) {
    var t = Dt(), n = t.queue;
    if (n === null) throw Error(l(311));
    n.lastRenderedReducer = e;
    var r = ot, o = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (o !== null) {
        var c = o.next;
        o.next = i.next, i.next = c;
      }
      r.baseQueue = o = i, n.pending = null;
    }
    if (o !== null) {
      i = o.next, r = r.baseState;
      var p = c = null, v = null, j = i;
      do {
        var L = j.lane;
        if ((gr & L) === L) v !== null && (v = v.next = { lane: 0, action: j.action, hasEagerState: j.hasEagerState, eagerState: j.eagerState, next: null }), r = j.hasEagerState ? j.eagerState : e(r, j.action);
        else {
          var O = {
            lane: L,
            action: j.action,
            hasEagerState: j.hasEagerState,
            eagerState: j.eagerState,
            next: null
          };
          v === null ? (p = v = O, c = r) : v = v.next = O, Je.lanes |= L, wr |= L;
        }
        j = j.next;
      } while (j !== null && j !== i);
      v === null ? c = r : v.next = p, Wt(r, t.memoizedState) || (Et = !0), t.memoizedState = r, t.baseState = c, t.baseQueue = v, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      o = e;
      do
        i = o.lane, Je.lanes |= i, wr |= i, o = o.next;
      while (o !== e);
    } else o === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function xl(e) {
    var t = Dt(), n = t.queue;
    if (n === null) throw Error(l(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, o = n.pending, i = t.memoizedState;
    if (o !== null) {
      n.pending = null;
      var c = o = o.next;
      do
        i = e(i, c.action), c = c.next;
      while (c !== o);
      Wt(i, t.memoizedState) || (Et = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function $u() {
  }
  function Au(e, t) {
    var n = Je, r = Dt(), o = t(), i = !Wt(r.memoizedState, o);
    if (i && (r.memoizedState = o, Et = !0), r = r.queue, Sl(Uu.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || st !== null && st.memoizedState.tag & 1) {
      if (n.flags |= 2048, Uo(9, Du.bind(null, n, r, o, t), void 0, null), lt === null) throw Error(l(349));
      (gr & 30) !== 0 || Fu(n, t, o);
    }
    return o;
  }
  function Fu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Je.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Je.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Du(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Bu(t) && Vu(e);
  }
  function Uu(e, t, n) {
    return n(function() {
      Bu(t) && Vu(e);
    });
  }
  function Bu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Wt(e, n);
    } catch {
      return !0;
    }
  }
  function Vu(e) {
    var t = kn(e, 1);
    t !== null && Yt(t, e, 1, -1);
  }
  function Wu(e) {
    var t = rn();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Do, lastRenderedState: e }, t.queue = e, e = e.dispatch = Vf.bind(null, Je, e), [t.memoizedState, e];
  }
  function Uo(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Je.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Je.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Hu() {
    return Dt().memoizedState;
  }
  function Bi(e, t, n, r) {
    var o = rn();
    Je.flags |= e, o.memoizedState = Uo(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function Vi(e, t, n, r) {
    var o = Dt();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (ot !== null) {
      var c = ot.memoizedState;
      if (i = c.destroy, r !== null && vl(r, c.deps)) {
        o.memoizedState = Uo(t, n, i, r);
        return;
      }
    }
    Je.flags |= e, o.memoizedState = Uo(1 | t, n, i, r);
  }
  function Qu(e, t) {
    return Bi(8390656, 8, e, t);
  }
  function Sl(e, t) {
    return Vi(2048, 8, e, t);
  }
  function Ku(e, t) {
    return Vi(4, 2, e, t);
  }
  function Xu(e, t) {
    return Vi(4, 4, e, t);
  }
  function Yu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Ju(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Vi(4, 4, Yu.bind(null, t, e), n);
  }
  function kl() {
  }
  function qu(e, t) {
    var n = Dt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && vl(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Gu(e, t) {
    var n = Dt();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && vl(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Zu(e, t, n) {
    return (gr & 21) === 0 ? (e.baseState && (e.baseState = !1, Et = !0), e.memoizedState = n) : (Wt(n, t) || (n = ho(), Je.lanes |= n, wr |= n, e.baseState = !0), t);
  }
  function Uf(e, t) {
    var n = Fe;
    Fe = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = ml.transition;
    ml.transition = {};
    try {
      e(!1), t();
    } finally {
      Fe = n, ml.transition = r;
    }
  }
  function bu() {
    return Dt().memoizedState;
  }
  function Bf(e, t, n) {
    var r = Gn(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, ec(e)) tc(t, n);
    else if (n = Iu(e, t, n, r), n !== null) {
      var o = gt();
      Yt(n, e, r, o), nc(n, t, r);
    }
  }
  function Vf(e, t, n) {
    var r = Gn(e), o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (ec(e)) tc(t, o);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var c = t.lastRenderedState, p = i(c, n);
        if (o.hasEagerState = !0, o.eagerState = p, Wt(p, c)) {
          var v = t.interleaved;
          v === null ? (o.next = o, ul(t)) : (o.next = v.next, v.next = o), t.interleaved = o;
          return;
        }
      } catch {
      } finally {
      }
      n = Iu(e, t, o, r), n !== null && (o = gt(), Yt(n, e, r, o), nc(n, t, r));
    }
  }
  function ec(e) {
    var t = e.alternate;
    return e === Je || t !== null && t === Je;
  }
  function tc(e, t) {
    Ao = Ui = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function nc(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, mo(e, n);
    }
  }
  var Wi = { readContext: Ft, useCallback: ht, useContext: ht, useEffect: ht, useImperativeHandle: ht, useInsertionEffect: ht, useLayoutEffect: ht, useMemo: ht, useReducer: ht, useRef: ht, useState: ht, useDebugValue: ht, useDeferredValue: ht, useTransition: ht, useMutableSource: ht, useSyncExternalStore: ht, useId: ht, unstable_isNewReconciler: !1 }, Wf = { readContext: Ft, useCallback: function(e, t) {
    return rn().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: Ft, useEffect: Qu, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Bi(
      4194308,
      4,
      Yu.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return Bi(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Bi(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = rn();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = rn();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Bf.bind(null, Je, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = rn();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Wu, useDebugValue: kl, useDeferredValue: function(e) {
    return rn().memoizedState = e;
  }, useTransition: function() {
    var e = Wu(!1), t = e[0];
    return e = Uf.bind(null, e[1]), rn().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Je, o = rn();
    if (Xe) {
      if (n === void 0) throw Error(l(407));
      n = n();
    } else {
      if (n = t(), lt === null) throw Error(l(349));
      (gr & 30) !== 0 || Fu(r, t, n);
    }
    o.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return o.queue = i, Qu(Uu.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, Uo(9, Du.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = rn(), t = lt.identifierPrefix;
    if (Xe) {
      var n = Sn, r = xn;
      n = (r & ~(1 << 32 - Pe(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Fo++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Df++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Hf = {
    readContext: Ft,
    useCallback: qu,
    useContext: Ft,
    useEffect: Sl,
    useImperativeHandle: Ju,
    useInsertionEffect: Ku,
    useLayoutEffect: Xu,
    useMemo: Gu,
    useReducer: wl,
    useRef: Hu,
    useState: function() {
      return wl(Do);
    },
    useDebugValue: kl,
    useDeferredValue: function(e) {
      var t = Dt();
      return Zu(t, ot.memoizedState, e);
    },
    useTransition: function() {
      var e = wl(Do)[0], t = Dt().memoizedState;
      return [e, t];
    },
    useMutableSource: $u,
    useSyncExternalStore: Au,
    useId: bu,
    unstable_isNewReconciler: !1
  }, Qf = { readContext: Ft, useCallback: qu, useContext: Ft, useEffect: Sl, useImperativeHandle: Ju, useInsertionEffect: Ku, useLayoutEffect: Xu, useMemo: Gu, useReducer: xl, useRef: Hu, useState: function() {
    return xl(Do);
  }, useDebugValue: kl, useDeferredValue: function(e) {
    var t = Dt();
    return ot === null ? t.memoizedState = e : Zu(t, ot.memoizedState, e);
  }, useTransition: function() {
    var e = xl(Do)[0], t = Dt().memoizedState;
    return [e, t];
  }, useMutableSource: $u, useSyncExternalStore: Au, useId: bu, unstable_isNewReconciler: !1 };
  function Qt(e, t) {
    if (e && e.defaultProps) {
      t = H({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function jl(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : H({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Hi = { isMounted: function(e) {
    return (e = e._reactInternals) ? yn(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = gt(), o = Gn(e), i = jn(r, o);
    i.payload = t, n != null && (i.callback = n), t = Xn(e, i, o), t !== null && (Yt(t, e, o, r), $i(t, e, o));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = gt(), o = Gn(e), i = jn(r, o);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Xn(e, i, o), t !== null && (Yt(t, e, o, r), $i(t, e, o));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = gt(), r = Gn(e), o = jn(n, r);
    o.tag = 2, t != null && (o.callback = t), t = Xn(e, o, r), t !== null && (Yt(t, e, r, n), $i(t, e, r));
  } };
  function rc(e, t, n, r, o, i, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, c) : t.prototype && t.prototype.isPureReactComponent ? !_o(n, r) || !_o(o, i) : !0;
  }
  function oc(e, t, n) {
    var r = !1, o = Hn, i = t.contextType;
    return typeof i == "object" && i !== null ? i = Ft(i) : (o = Ct(t) ? pr : pt.current, r = t.contextTypes, i = (r = r != null) ? Br(e, o) : Hn), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Hi, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function ic(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Hi.enqueueReplaceState(t, t.state, null);
  }
  function Cl(e, t, n, r) {
    var o = e.stateNode;
    o.props = n, o.state = e.memoizedState, o.refs = {}, cl(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? o.context = Ft(i) : (i = Ct(t) ? pr : pt.current, o.context = Br(e, i)), o.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (jl(e, t, i, n), o.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (t = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), t !== o.state && Hi.enqueueReplaceState(o, o.state, null), Ai(e, n, o, r), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Jr(e, t) {
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
  function El(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function _l(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Kf = typeof WeakMap == "function" ? WeakMap : Map;
  function sc(e, t, n) {
    n = jn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Gi || (Gi = !0, Bl = r), _l(e, t);
    }, n;
  }
  function lc(e, t, n) {
    n = jn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var o = t.value;
      n.payload = function() {
        return r(o);
      }, n.callback = function() {
        _l(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      _l(e, t), typeof r != "function" && (Jn === null ? Jn = /* @__PURE__ */ new Set([this]) : Jn.add(this));
      var c = t.stack;
      this.componentDidCatch(t.value, { componentStack: c !== null ? c : "" });
    }), n;
  }
  function ac(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Kf();
      var o = /* @__PURE__ */ new Set();
      r.set(t, o);
    } else o = r.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), r.set(t, o));
    o.has(n) || (o.add(n), e = sp.bind(null, e, t, n), t.then(e, e));
  }
  function uc(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function cc(e, t, n, r, o) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = jn(-1, 1), t.tag = 2, Xn(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = o, e);
  }
  var Xf = te.ReactCurrentOwner, Et = !1;
  function yt(e, t, n, r) {
    t.child = e === null ? Ru(t, null, n, r) : Qr(t, e.child, n, r);
  }
  function dc(e, t, n, r, o) {
    n = n.render;
    var i = t.ref;
    return Xr(t, o), r = yl(e, t, n, r, i, o), n = gl(), e !== null && !Et ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, Cn(e, t, o)) : (Xe && n && el(t), t.flags |= 1, yt(e, t, r, o), t.child);
  }
  function fc(e, t, n, r, o) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !Yl(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, pc(e, t, i, r, o)) : (e = rs(n.type, null, r, t, t.mode, o), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & o) === 0) {
      var c = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : _o, n(c, r) && e.ref === t.ref) return Cn(e, t, o);
    }
    return t.flags |= 1, e = bn(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function pc(e, t, n, r, o) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (_o(i, r) && e.ref === t.ref) if (Et = !1, t.pendingProps = r = i, (e.lanes & o) !== 0) (e.flags & 131072) !== 0 && (Et = !0);
      else return t.lanes = e.lanes, Cn(e, t, o);
    }
    return Pl(e, t, n, r, o);
  }
  function hc(e, t, n) {
    var r = t.pendingProps, o = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, We(Gr, Lt), Lt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, We(Gr, Lt), Lt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, We(Gr, Lt), Lt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, We(Gr, Lt), Lt |= r;
    return yt(e, t, o, n), t.child;
  }
  function mc(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Pl(e, t, n, r, o) {
    var i = Ct(n) ? pr : pt.current;
    return i = Br(t, i), Xr(t, o), n = yl(e, t, n, r, i, o), r = gl(), e !== null && !Et ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, Cn(e, t, o)) : (Xe && r && el(t), t.flags |= 1, yt(e, t, n, o), t.child);
  }
  function vc(e, t, n, r, o) {
    if (Ct(n)) {
      var i = !0;
      Ni(t);
    } else i = !1;
    if (Xr(t, o), t.stateNode === null) Ki(e, t), oc(t, n, r), Cl(t, n, r, o), r = !0;
    else if (e === null) {
      var c = t.stateNode, p = t.memoizedProps;
      c.props = p;
      var v = c.context, j = n.contextType;
      typeof j == "object" && j !== null ? j = Ft(j) : (j = Ct(n) ? pr : pt.current, j = Br(t, j));
      var L = n.getDerivedStateFromProps, O = typeof L == "function" || typeof c.getSnapshotBeforeUpdate == "function";
      O || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (p !== r || v !== j) && ic(t, c, r, j), Kn = !1;
      var z = t.memoizedState;
      c.state = z, Ai(t, r, c, o), v = t.memoizedState, p !== r || z !== v || jt.current || Kn ? (typeof L == "function" && (jl(t, n, L, r), v = t.memoizedState), (p = Kn || rc(t, n, p, r, z, v, j)) ? (O || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = v), c.props = r, c.state = v, c.context = j, r = p) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      c = t.stateNode, zu(e, t), p = t.memoizedProps, j = t.type === t.elementType ? p : Qt(t.type, p), c.props = j, O = t.pendingProps, z = c.context, v = n.contextType, typeof v == "object" && v !== null ? v = Ft(v) : (v = Ct(n) ? pr : pt.current, v = Br(t, v));
      var Q = n.getDerivedStateFromProps;
      (L = typeof Q == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (p !== O || z !== v) && ic(t, c, r, v), Kn = !1, z = t.memoizedState, c.state = z, Ai(t, r, c, o);
      var X = t.memoizedState;
      p !== O || z !== X || jt.current || Kn ? (typeof Q == "function" && (jl(t, n, Q, r), X = t.memoizedState), (j = Kn || rc(t, n, j, r, z, X, v) || !1) ? (L || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(r, X, v), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(r, X, v)), typeof c.componentDidUpdate == "function" && (t.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || p === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || p === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = X), c.props = r, c.state = X, c.context = v, r = j) : (typeof c.componentDidUpdate != "function" || p === e.memoizedProps && z === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || p === e.memoizedProps && z === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return Nl(e, t, n, r, i, o);
  }
  function Nl(e, t, n, r, o, i) {
    mc(e, t);
    var c = (t.flags & 128) !== 0;
    if (!r && !c) return o && Su(t, n, !1), Cn(e, t, i);
    r = t.stateNode, Xf.current = t;
    var p = c && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && c ? (t.child = Qr(t, e.child, null, i), t.child = Qr(t, null, p, i)) : yt(e, t, p, i), t.memoizedState = r.state, o && Su(t, n, !0), t.child;
  }
  function yc(e) {
    var t = e.stateNode;
    t.pendingContext ? wu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && wu(e, t.context, !1), dl(e, t.containerInfo);
  }
  function gc(e, t, n, r, o) {
    return Hr(), ol(o), t.flags |= 256, yt(e, t, n, r), t.child;
  }
  var Tl = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Rl(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function wc(e, t, n) {
    var r = t.pendingProps, o = Ye.current, i = !1, c = (t.flags & 128) !== 0, p;
    if ((p = c) || (p = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0), p ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (o |= 1), We(Ye, o & 1), e === null)
      return rl(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (c = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, c = { mode: "hidden", children: c }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = c) : i = os(c, r, 0, null), e = jr(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = Rl(n), t.memoizedState = Tl, e) : Il(t, c));
    if (o = e.memoizedState, o !== null && (p = o.dehydrated, p !== null)) return Yf(e, t, c, r, p, o, n);
    if (i) {
      i = r.fallback, c = t.mode, o = e.child, p = o.sibling;
      var v = { mode: "hidden", children: r.children };
      return (c & 1) === 0 && t.child !== o ? (r = t.child, r.childLanes = 0, r.pendingProps = v, t.deletions = null) : (r = bn(o, v), r.subtreeFlags = o.subtreeFlags & 14680064), p !== null ? i = bn(p, i) : (i = jr(i, c, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, c = e.child.memoizedState, c = c === null ? Rl(n) : { baseLanes: c.baseLanes | n, cachePool: null, transitions: c.transitions }, i.memoizedState = c, i.childLanes = e.childLanes & ~n, t.memoizedState = Tl, r;
    }
    return i = e.child, e = i.sibling, r = bn(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function Il(e, t) {
    return t = os({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Qi(e, t, n, r) {
    return r !== null && ol(r), Qr(t, e.child, null, n), e = Il(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Yf(e, t, n, r, o, i, c) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = El(Error(l(422))), Qi(e, t, c, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, o = t.mode, r = os({ mode: "visible", children: r.children }, o, 0, null), i = jr(i, o, c, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Qr(t, e.child, null, c), t.child.memoizedState = Rl(c), t.memoizedState = Tl, i);
    if ((t.mode & 1) === 0) return Qi(e, t, c, null);
    if (o.data === "$!") {
      if (r = o.nextSibling && o.nextSibling.dataset, r) var p = r.dgst;
      return r = p, i = Error(l(419)), r = El(i, r, void 0), Qi(e, t, c, r);
    }
    if (p = (c & e.childLanes) !== 0, Et || p) {
      if (r = lt, r !== null) {
        switch (c & -c) {
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
        o = (o & (r.suspendedLanes | c)) !== 0 ? 0 : o, o !== 0 && o !== i.retryLane && (i.retryLane = o, kn(e, o), Yt(r, e, o, -1));
      }
      return Xl(), r = El(Error(l(421))), Qi(e, t, c, r);
    }
    return o.data === "$?" ? (t.flags |= 128, t.child = e.child, t = lp.bind(null, e), o._reactRetry = t, null) : (e = i.treeContext, zt = Vn(o.nextSibling), It = t, Xe = !0, Ht = null, e !== null && ($t[At++] = xn, $t[At++] = Sn, $t[At++] = hr, xn = e.id, Sn = e.overflow, hr = t), t = Il(t, r.children), t.flags |= 4096, t);
  }
  function xc(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), al(e.return, t, n);
  }
  function zl(e, t, n, r, o) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: o } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = o);
  }
  function Sc(e, t, n) {
    var r = t.pendingProps, o = r.revealOrder, i = r.tail;
    if (yt(e, t, r.children, n), r = Ye.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && xc(e, n, t);
        else if (e.tag === 19) xc(e, n, t);
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
    if (We(Ye, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; ) e = n.alternate, e !== null && Fi(e) === null && (o = n), n = n.sibling;
        n = o, n === null ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null), zl(t, !1, o, n, i);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (e = o.alternate, e !== null && Fi(e) === null) {
            t.child = o;
            break;
          }
          e = o.sibling, o.sibling = n, n = o, o = e;
        }
        zl(t, !0, n, null, i);
        break;
      case "together":
        zl(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Ki(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Cn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), wr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(l(153));
    if (t.child !== null) {
      for (e = t.child, n = bn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = bn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Jf(e, t, n) {
    switch (t.tag) {
      case 3:
        yc(t), Hr();
        break;
      case 5:
        Ou(t);
        break;
      case 1:
        Ct(t.type) && Ni(t);
        break;
      case 4:
        dl(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, o = t.memoizedProps.value;
        We(Mi, r._currentValue), r._currentValue = o;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (We(Ye, Ye.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? wc(e, t, n) : (We(Ye, Ye.current & 1), e = Cn(e, t, n), e !== null ? e.sibling : null);
        We(Ye, Ye.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return Sc(e, t, n);
          t.flags |= 128;
        }
        if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), We(Ye, Ye.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, hc(e, t, n);
    }
    return Cn(e, t, n);
  }
  var kc, Ll, jc, Cc;
  kc = function(e, t) {
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
  }, Ll = function() {
  }, jc = function(e, t, n, r) {
    var o = e.memoizedProps;
    if (o !== r) {
      e = t.stateNode, yr(nn.current);
      var i = null;
      switch (n) {
        case "input":
          o = Ot(e, o), r = Ot(e, r), i = [];
          break;
        case "select":
          o = H({}, o, { value: void 0 }), r = H({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          o = kt(e, o), r = kt(e, r), i = [];
          break;
        default:
          typeof o.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Ei);
      }
      ar(n, r);
      var c;
      n = null;
      for (j in o) if (!r.hasOwnProperty(j) && o.hasOwnProperty(j) && o[j] != null) if (j === "style") {
        var p = o[j];
        for (c in p) p.hasOwnProperty(c) && (n || (n = {}), n[c] = "");
      } else j !== "dangerouslySetInnerHTML" && j !== "children" && j !== "suppressContentEditableWarning" && j !== "suppressHydrationWarning" && j !== "autoFocus" && (g.hasOwnProperty(j) ? i || (i = []) : (i = i || []).push(j, null));
      for (j in r) {
        var v = r[j];
        if (p = o != null ? o[j] : void 0, r.hasOwnProperty(j) && v !== p && (v != null || p != null)) if (j === "style") if (p) {
          for (c in p) !p.hasOwnProperty(c) || v && v.hasOwnProperty(c) || (n || (n = {}), n[c] = "");
          for (c in v) v.hasOwnProperty(c) && p[c] !== v[c] && (n || (n = {}), n[c] = v[c]);
        } else n || (i || (i = []), i.push(
          j,
          n
        )), n = v;
        else j === "dangerouslySetInnerHTML" ? (v = v ? v.__html : void 0, p = p ? p.__html : void 0, v != null && p !== v && (i = i || []).push(j, v)) : j === "children" ? typeof v != "string" && typeof v != "number" || (i = i || []).push(j, "" + v) : j !== "suppressContentEditableWarning" && j !== "suppressHydrationWarning" && (g.hasOwnProperty(j) ? (v != null && j === "onScroll" && He("scroll", e), i || p === v || (i = [])) : (i = i || []).push(j, v));
      }
      n && (i = i || []).push("style", n);
      var j = i;
      (t.updateQueue = j) && (t.flags |= 4);
    }
  }, Cc = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function Bo(e, t) {
    if (!Xe) switch (e.tailMode) {
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
  function mt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags & 14680064, r |= o.flags & 14680064, o.return = e, o = o.sibling;
    else for (o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, o.return = e, o = o.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function qf(e, t, n) {
    var r = t.pendingProps;
    switch (tl(t), t.tag) {
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
        return mt(t), null;
      case 1:
        return Ct(t.type) && Pi(), mt(t), null;
      case 3:
        return r = t.stateNode, Yr(), Qe(jt), Qe(pt), hl(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (zi(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Ht !== null && (Hl(Ht), Ht = null))), Ll(e, t), mt(t), null;
      case 5:
        fl(t);
        var o = yr($o.current);
        if (n = t.type, e !== null && t.stateNode != null) jc(e, t, n, r, o), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(l(166));
            return mt(t), null;
          }
          if (e = yr(nn.current), zi(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[tn] = t, r[Io] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                He("cancel", r), He("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                He("load", r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < No.length; o++) He(No[o], r);
                break;
              case "source":
                He("error", r);
                break;
              case "img":
              case "image":
              case "link":
                He(
                  "error",
                  r
                ), He("load", r);
                break;
              case "details":
                He("toggle", r);
                break;
              case "input":
                ro(r, i), He("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, He("invalid", r);
                break;
              case "textarea":
                Er(r, i), He("invalid", r);
            }
            ar(n, i), o = null;
            for (var c in i) if (i.hasOwnProperty(c)) {
              var p = i[c];
              c === "children" ? typeof p == "string" ? r.textContent !== p && (i.suppressHydrationWarning !== !0 && Ci(r.textContent, p, e), o = ["children", p]) : typeof p == "number" && r.textContent !== "" + p && (i.suppressHydrationWarning !== !0 && Ci(
                r.textContent,
                p,
                e
              ), o = ["children", "" + p]) : g.hasOwnProperty(c) && p != null && c === "onScroll" && He("scroll", r);
            }
            switch (n) {
              case "input":
                Se(r), oo(r, i, !0);
                break;
              case "textarea":
                Se(r), fn(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = Ei);
            }
            r = o, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            c = o.nodeType === 9 ? o : o.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Tn(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = c.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = c.createElement(n, { is: r.is }) : (e = c.createElement(n), n === "select" && (c = e, r.multiple ? c.multiple = !0 : r.size && (c.size = r.size))) : e = c.createElementNS(e, n), e[tn] = t, e[Io] = r, kc(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (c = Pr(n, r), n) {
                case "dialog":
                  He("cancel", e), He("close", e), o = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  He("load", e), o = r;
                  break;
                case "video":
                case "audio":
                  for (o = 0; o < No.length; o++) He(No[o], e);
                  o = r;
                  break;
                case "source":
                  He("error", e), o = r;
                  break;
                case "img":
                case "image":
                case "link":
                  He(
                    "error",
                    e
                  ), He("load", e), o = r;
                  break;
                case "details":
                  He("toggle", e), o = r;
                  break;
                case "input":
                  ro(e, r), o = Ot(e, r), He("invalid", e);
                  break;
                case "option":
                  o = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, o = H({}, r, { value: void 0 }), He("invalid", e);
                  break;
                case "textarea":
                  Er(e, r), o = kt(e, r), He("invalid", e);
                  break;
                default:
                  o = r;
              }
              ar(n, o), p = o;
              for (i in p) if (p.hasOwnProperty(i)) {
                var v = p[i];
                i === "style" ? lr(e, v) : i === "dangerouslySetInnerHTML" ? (v = v ? v.__html : void 0, v != null && ei(e, v)) : i === "children" ? typeof v == "string" ? (n !== "textarea" || v !== "") && Rn(e, v) : typeof v == "number" && Rn(e, "" + v) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (g.hasOwnProperty(i) ? v != null && i === "onScroll" && He("scroll", e) : v != null && B(e, i, v, c));
              }
              switch (n) {
                case "input":
                  Se(e), oo(e, r, !1);
                  break;
                case "textarea":
                  Se(e), fn(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + ve(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? dn(e, !!r.multiple, i, !1) : r.defaultValue != null && dn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof o.onClick == "function" && (e.onclick = Ei);
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
        return mt(t), null;
      case 6:
        if (e && t.stateNode != null) Cc(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(l(166));
          if (n = yr($o.current), yr(nn.current), zi(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[tn] = t, (i = r.nodeValue !== n) && (e = It, e !== null)) switch (e.tag) {
              case 3:
                Ci(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Ci(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[tn] = t, t.stateNode = r;
        }
        return mt(t), null;
      case 13:
        if (Qe(Ye), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Xe && zt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Pu(), Hr(), t.flags |= 98560, i = !1;
          else if (i = zi(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(l(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(l(317));
              i[tn] = t;
            } else Hr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            mt(t), i = !1;
          } else Ht !== null && (Hl(Ht), Ht = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Ye.current & 1) !== 0 ? it === 0 && (it = 3) : Xl())), t.updateQueue !== null && (t.flags |= 4), mt(t), null);
      case 4:
        return Yr(), Ll(e, t), e === null && To(t.stateNode.containerInfo), mt(t), null;
      case 10:
        return ll(t.type._context), mt(t), null;
      case 17:
        return Ct(t.type) && Pi(), mt(t), null;
      case 19:
        if (Qe(Ye), i = t.memoizedState, i === null) return mt(t), null;
        if (r = (t.flags & 128) !== 0, c = i.rendering, c === null) if (r) Bo(i, !1);
        else {
          if (it !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (c = Fi(e), c !== null) {
              for (t.flags |= 128, Bo(i, !1), r = c.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, c = i.alternate, c === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = c.childLanes, i.lanes = c.lanes, i.child = c.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = c.memoizedProps, i.memoizedState = c.memoizedState, i.updateQueue = c.updateQueue, i.type = c.type, e = c.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return We(Ye, Ye.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && S() > Zr && (t.flags |= 128, r = !0, Bo(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = Fi(c), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Bo(i, !0), i.tail === null && i.tailMode === "hidden" && !c.alternate && !Xe) return mt(t), null;
          } else 2 * S() - i.renderingStartTime > Zr && n !== 1073741824 && (t.flags |= 128, r = !0, Bo(i, !1), t.lanes = 4194304);
          i.isBackwards ? (c.sibling = t.child, t.child = c) : (n = i.last, n !== null ? n.sibling = c : t.child = c, i.last = c);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = S(), t.sibling = null, n = Ye.current, We(Ye, r ? n & 1 | 2 : n & 1), t) : (mt(t), null);
      case 22:
      case 23:
        return Kl(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Lt & 1073741824) !== 0 && (mt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : mt(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(l(156, t.tag));
  }
  function Gf(e, t) {
    switch (tl(t), t.tag) {
      case 1:
        return Ct(t.type) && Pi(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Yr(), Qe(jt), Qe(pt), hl(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return fl(t), null;
      case 13:
        if (Qe(Ye), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(l(340));
          Hr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Qe(Ye), null;
      case 4:
        return Yr(), null;
      case 10:
        return ll(t.type._context), null;
      case 22:
      case 23:
        return Kl(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Xi = !1, vt = !1, Zf = typeof WeakSet == "function" ? WeakSet : Set, K = null;
  function qr(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      qe(e, t, r);
    }
    else n.current = null;
  }
  function Ml(e, t, n) {
    try {
      n();
    } catch (r) {
      qe(e, t, r);
    }
  }
  var Ec = !1;
  function bf(e, t) {
    if (Ks = pi, e = ru(), Fs(e)) {
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
          var c = 0, p = -1, v = -1, j = 0, L = 0, O = e, z = null;
          t: for (; ; ) {
            for (var Q; O !== n || o !== 0 && O.nodeType !== 3 || (p = c + o), O !== i || r !== 0 && O.nodeType !== 3 || (v = c + r), O.nodeType === 3 && (c += O.nodeValue.length), (Q = O.firstChild) !== null; )
              z = O, O = Q;
            for (; ; ) {
              if (O === e) break t;
              if (z === n && ++j === o && (p = c), z === i && ++L === r && (v = c), (Q = O.nextSibling) !== null) break;
              O = z, z = O.parentNode;
            }
            O = Q;
          }
          n = p === -1 || v === -1 ? null : { start: p, end: v };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Xs = { focusedElem: e, selectionRange: n }, pi = !1, K = t; K !== null; ) if (t = K, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, K = e;
    else for (; K !== null; ) {
      t = K;
      try {
        var X = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (X !== null) {
              var J = X.memoizedProps, et = X.memoizedState, x = t.stateNode, y = x.getSnapshotBeforeUpdate(t.elementType === t.type ? J : Qt(t.type, J), et);
              x.__reactInternalSnapshotBeforeUpdate = y;
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
            throw Error(l(163));
        }
      } catch (F) {
        qe(t, t.return, F);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, K = e;
        break;
      }
      K = t.return;
    }
    return X = Ec, Ec = !1, X;
  }
  function Vo(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & e) === e) {
          var i = o.destroy;
          o.destroy = void 0, i !== void 0 && Ml(t, n, i);
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function Yi(e, t) {
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
  function Ol(e) {
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
  function _c(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, _c(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[tn], delete t[Io], delete t[Gs], delete t[Of], delete t[$f])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Pc(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Nc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Pc(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function $l(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Ei));
    else if (r !== 4 && (e = e.child, e !== null)) for ($l(e, t, n), e = e.sibling; e !== null; ) $l(e, t, n), e = e.sibling;
  }
  function Al(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (Al(e, t, n), e = e.sibling; e !== null; ) Al(e, t, n), e = e.sibling;
  }
  var ct = null, Kt = !1;
  function Yn(e, t, n) {
    for (n = n.child; n !== null; ) Tc(e, t, n), n = n.sibling;
  }
  function Tc(e, t, n) {
    if (me && typeof me.onCommitFiberUnmount == "function") try {
      me.onCommitFiberUnmount(ue, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        vt || qr(n, t);
      case 6:
        var r = ct, o = Kt;
        ct = null, Yn(e, t, n), ct = r, Kt = o, ct !== null && (Kt ? (e = ct, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ct.removeChild(n.stateNode));
        break;
      case 18:
        ct !== null && (Kt ? (e = ct, n = n.stateNode, e.nodeType === 8 ? qs(e.parentNode, n) : e.nodeType === 1 && qs(e, n), xo(e)) : qs(ct, n.stateNode));
        break;
      case 4:
        r = ct, o = Kt, ct = n.stateNode.containerInfo, Kt = !0, Yn(e, t, n), ct = r, Kt = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!vt && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          o = r = r.next;
          do {
            var i = o, c = i.destroy;
            i = i.tag, c !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && Ml(n, t, c), o = o.next;
          } while (o !== r);
        }
        Yn(e, t, n);
        break;
      case 1:
        if (!vt && (qr(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (p) {
          qe(n, t, p);
        }
        Yn(e, t, n);
        break;
      case 21:
        Yn(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (vt = (r = vt) || n.memoizedState !== null, Yn(e, t, n), vt = r) : Yn(e, t, n);
        break;
      default:
        Yn(e, t, n);
    }
  }
  function Rc(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Zf()), t.forEach(function(r) {
        var o = ap.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      });
    }
  }
  function Xt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var i = e, c = t, p = c;
        e: for (; p !== null; ) {
          switch (p.tag) {
            case 5:
              ct = p.stateNode, Kt = !1;
              break e;
            case 3:
              ct = p.stateNode.containerInfo, Kt = !0;
              break e;
            case 4:
              ct = p.stateNode.containerInfo, Kt = !0;
              break e;
          }
          p = p.return;
        }
        if (ct === null) throw Error(l(160));
        Tc(i, c, o), ct = null, Kt = !1;
        var v = o.alternate;
        v !== null && (v.return = null), o.return = null;
      } catch (j) {
        qe(o, t, j);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ic(t, e), t = t.sibling;
  }
  function Ic(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Xt(t, e), on(e), r & 4) {
          try {
            Vo(3, e, e.return), Yi(3, e);
          } catch (J) {
            qe(e, e.return, J);
          }
          try {
            Vo(5, e, e.return);
          } catch (J) {
            qe(e, e.return, J);
          }
        }
        break;
      case 1:
        Xt(t, e), on(e), r & 512 && n !== null && qr(n, n.return);
        break;
      case 5:
        if (Xt(t, e), on(e), r & 512 && n !== null && qr(n, n.return), e.flags & 32) {
          var o = e.stateNode;
          try {
            Rn(o, "");
          } catch (J) {
            qe(e, e.return, J);
          }
        }
        if (r & 4 && (o = e.stateNode, o != null)) {
          var i = e.memoizedProps, c = n !== null ? n.memoizedProps : i, p = e.type, v = e.updateQueue;
          if (e.updateQueue = null, v !== null) try {
            p === "input" && i.type === "radio" && i.name != null && or(o, i), Pr(p, c);
            var j = Pr(p, i);
            for (c = 0; c < v.length; c += 2) {
              var L = v[c], O = v[c + 1];
              L === "style" ? lr(o, O) : L === "dangerouslySetInnerHTML" ? ei(o, O) : L === "children" ? Rn(o, O) : B(o, L, O, j);
            }
            switch (p) {
              case "input":
                Zt(o, i);
                break;
              case "textarea":
                Nn(o, i);
                break;
              case "select":
                var z = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!i.multiple;
                var Q = i.value;
                Q != null ? dn(o, !!i.multiple, Q, !1) : z !== !!i.multiple && (i.defaultValue != null ? dn(
                  o,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : dn(o, !!i.multiple, i.multiple ? [] : "", !1));
            }
            o[Io] = i;
          } catch (J) {
            qe(e, e.return, J);
          }
        }
        break;
      case 6:
        if (Xt(t, e), on(e), r & 4) {
          if (e.stateNode === null) throw Error(l(162));
          o = e.stateNode, i = e.memoizedProps;
          try {
            o.nodeValue = i;
          } catch (J) {
            qe(e, e.return, J);
          }
        }
        break;
      case 3:
        if (Xt(t, e), on(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          xo(t.containerInfo);
        } catch (J) {
          qe(e, e.return, J);
        }
        break;
      case 4:
        Xt(t, e), on(e);
        break;
      case 13:
        Xt(t, e), on(e), o = e.child, o.flags & 8192 && (i = o.memoizedState !== null, o.stateNode.isHidden = i, !i || o.alternate !== null && o.alternate.memoizedState !== null || (Ul = S())), r & 4 && Rc(e);
        break;
      case 22:
        if (L = n !== null && n.memoizedState !== null, e.mode & 1 ? (vt = (j = vt) || L, Xt(t, e), vt = j) : Xt(t, e), on(e), r & 8192) {
          if (j = e.memoizedState !== null, (e.stateNode.isHidden = j) && !L && (e.mode & 1) !== 0) for (K = e, L = e.child; L !== null; ) {
            for (O = K = L; K !== null; ) {
              switch (z = K, Q = z.child, z.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Vo(4, z, z.return);
                  break;
                case 1:
                  qr(z, z.return);
                  var X = z.stateNode;
                  if (typeof X.componentWillUnmount == "function") {
                    r = z, n = z.return;
                    try {
                      t = r, X.props = t.memoizedProps, X.state = t.memoizedState, X.componentWillUnmount();
                    } catch (J) {
                      qe(r, n, J);
                    }
                  }
                  break;
                case 5:
                  qr(z, z.return);
                  break;
                case 22:
                  if (z.memoizedState !== null) {
                    Mc(O);
                    continue;
                  }
              }
              Q !== null ? (Q.return = z, K = Q) : Mc(O);
            }
            L = L.sibling;
          }
          e: for (L = null, O = e; ; ) {
            if (O.tag === 5) {
              if (L === null) {
                L = O;
                try {
                  o = O.stateNode, j ? (i = o.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (p = O.stateNode, v = O.memoizedProps.style, c = v != null && v.hasOwnProperty("display") ? v.display : null, p.style.display = ti("display", c));
                } catch (J) {
                  qe(e, e.return, J);
                }
              }
            } else if (O.tag === 6) {
              if (L === null) try {
                O.stateNode.nodeValue = j ? "" : O.memoizedProps;
              } catch (J) {
                qe(e, e.return, J);
              }
            } else if ((O.tag !== 22 && O.tag !== 23 || O.memoizedState === null || O === e) && O.child !== null) {
              O.child.return = O, O = O.child;
              continue;
            }
            if (O === e) break e;
            for (; O.sibling === null; ) {
              if (O.return === null || O.return === e) break e;
              L === O && (L = null), O = O.return;
            }
            L === O && (L = null), O.sibling.return = O.return, O = O.sibling;
          }
        }
        break;
      case 19:
        Xt(t, e), on(e), r & 4 && Rc(e);
        break;
      case 21:
        break;
      default:
        Xt(
          t,
          e
        ), on(e);
    }
  }
  function on(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Pc(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(l(160));
        }
        switch (r.tag) {
          case 5:
            var o = r.stateNode;
            r.flags & 32 && (Rn(o, ""), r.flags &= -33);
            var i = Nc(e);
            Al(e, i, o);
            break;
          case 3:
          case 4:
            var c = r.stateNode.containerInfo, p = Nc(e);
            $l(e, p, c);
            break;
          default:
            throw Error(l(161));
        }
      } catch (v) {
        qe(e, e.return, v);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function ep(e, t, n) {
    K = e, zc(e);
  }
  function zc(e, t, n) {
    for (var r = (e.mode & 1) !== 0; K !== null; ) {
      var o = K, i = o.child;
      if (o.tag === 22 && r) {
        var c = o.memoizedState !== null || Xi;
        if (!c) {
          var p = o.alternate, v = p !== null && p.memoizedState !== null || vt;
          p = Xi;
          var j = vt;
          if (Xi = c, (vt = v) && !j) for (K = o; K !== null; ) c = K, v = c.child, c.tag === 22 && c.memoizedState !== null ? Oc(o) : v !== null ? (v.return = c, K = v) : Oc(o);
          for (; i !== null; ) K = i, zc(i), i = i.sibling;
          K = o, Xi = p, vt = j;
        }
        Lc(e);
      } else (o.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = o, K = i) : Lc(e);
    }
  }
  function Lc(e) {
    for (; K !== null; ) {
      var t = K;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              vt || Yi(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !vt) if (n === null) r.componentDidMount();
              else {
                var o = t.elementType === t.type ? n.memoizedProps : Qt(t.type, n.memoizedProps);
                r.componentDidUpdate(o, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && Mu(t, i, r);
              break;
            case 3:
              var c = t.updateQueue;
              if (c !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                Mu(t, c, n);
              }
              break;
            case 5:
              var p = t.stateNode;
              if (n === null && t.flags & 4) {
                n = p;
                var v = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    v.autoFocus && n.focus();
                    break;
                  case "img":
                    v.src && (n.src = v.src);
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
                var j = t.alternate;
                if (j !== null) {
                  var L = j.memoizedState;
                  if (L !== null) {
                    var O = L.dehydrated;
                    O !== null && xo(O);
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
              throw Error(l(163));
          }
          vt || t.flags & 512 && Ol(t);
        } catch (z) {
          qe(t, t.return, z);
        }
      }
      if (t === e) {
        K = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, K = n;
        break;
      }
      K = t.return;
    }
  }
  function Mc(e) {
    for (; K !== null; ) {
      var t = K;
      if (t === e) {
        K = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, K = n;
        break;
      }
      K = t.return;
    }
  }
  function Oc(e) {
    for (; K !== null; ) {
      var t = K;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Yi(4, t);
            } catch (v) {
              qe(t, n, v);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var o = t.return;
              try {
                r.componentDidMount();
              } catch (v) {
                qe(t, o, v);
              }
            }
            var i = t.return;
            try {
              Ol(t);
            } catch (v) {
              qe(t, i, v);
            }
            break;
          case 5:
            var c = t.return;
            try {
              Ol(t);
            } catch (v) {
              qe(t, c, v);
            }
        }
      } catch (v) {
        qe(t, t.return, v);
      }
      if (t === e) {
        K = null;
        break;
      }
      var p = t.sibling;
      if (p !== null) {
        p.return = t.return, K = p;
        break;
      }
      K = t.return;
    }
  }
  var tp = Math.ceil, Ji = te.ReactCurrentDispatcher, Fl = te.ReactCurrentOwner, Ut = te.ReactCurrentBatchConfig, Re = 0, lt = null, nt = null, dt = 0, Lt = 0, Gr = Wn(0), it = 0, Wo = null, wr = 0, qi = 0, Dl = 0, Ho = null, _t = null, Ul = 0, Zr = 1 / 0, En = null, Gi = !1, Bl = null, Jn = null, Zi = !1, qn = null, bi = 0, Qo = 0, Vl = null, es = -1, ts = 0;
  function gt() {
    return (Re & 6) !== 0 ? S() : es !== -1 ? es : es = S();
  }
  function Gn(e) {
    return (e.mode & 1) === 0 ? 1 : (Re & 2) !== 0 && dt !== 0 ? dt & -dt : Ff.transition !== null ? (ts === 0 && (ts = ho()), ts) : (e = Fe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Aa(e.type)), e);
  }
  function Yt(e, t, n, r) {
    if (50 < Qo) throw Qo = 0, Vl = null, Error(l(185));
    Mn(e, n, r), ((Re & 2) === 0 || e !== lt) && (e === lt && ((Re & 2) === 0 && (qi |= n), it === 4 && Zn(e, dt)), Pt(e, r), n === 1 && Re === 0 && (t.mode & 1) === 0 && (Zr = S() + 500, Ti && Qn()));
  }
  function Pt(e, t) {
    var n = e.callbackNode;
    dr(e, t);
    var r = rt(e, e === lt ? dt : 0);
    if (r === 0) n !== null && ci(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && ci(n), t === 1) e.tag === 0 ? Af(Ac.bind(null, e)) : ku(Ac.bind(null, e)), Lf(function() {
        (Re & 6) === 0 && Qn();
      }), n = null;
      else {
        switch (Ta(r)) {
          case 1:
            n = I;
            break;
          case 4:
            n = U;
            break;
          case 16:
            n = D;
            break;
          case 536870912:
            n = Be;
            break;
          default:
            n = D;
        }
        n = Qc(n, $c.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function $c(e, t) {
    if (es = -1, ts = 0, (Re & 6) !== 0) throw Error(l(327));
    var n = e.callbackNode;
    if (br() && e.callbackNode !== n) return null;
    var r = rt(e, e === lt ? dt : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = ns(e, r);
    else {
      t = r;
      var o = Re;
      Re |= 2;
      var i = Dc();
      (lt !== e || dt !== t) && (En = null, Zr = S() + 500, Sr(e, t));
      do
        try {
          op();
          break;
        } catch (p) {
          Fc(e, p);
        }
      while (!0);
      sl(), Ji.current = i, Re = o, nt !== null ? t = 0 : (lt = null, dt = 0, t = it);
    }
    if (t !== 0) {
      if (t === 2 && (o = Tt(e), o !== 0 && (r = o, t = Wl(e, o))), t === 1) throw n = Wo, Sr(e, 0), Zn(e, r), Pt(e, S()), n;
      if (t === 6) Zn(e, r);
      else {
        if (o = e.current.alternate, (r & 30) === 0 && !np(o) && (t = ns(e, r), t === 2 && (i = Tt(e), i !== 0 && (r = i, t = Wl(e, i))), t === 1)) throw n = Wo, Sr(e, 0), Zn(e, r), Pt(e, S()), n;
        switch (e.finishedWork = o, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(l(345));
          case 2:
            kr(e, _t, En);
            break;
          case 3:
            if (Zn(e, r), (r & 130023424) === r && (t = Ul + 500 - S(), 10 < t)) {
              if (rt(e, 0) !== 0) break;
              if (o = e.suspendedLanes, (o & r) !== r) {
                gt(), e.pingedLanes |= e.suspendedLanes & o;
                break;
              }
              e.timeoutHandle = Js(kr.bind(null, e, _t, En), t);
              break;
            }
            kr(e, _t, En);
            break;
          case 4:
            if (Zn(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, o = -1; 0 < r; ) {
              var c = 31 - Pe(r);
              i = 1 << c, c = t[c], c > o && (o = c), r &= ~i;
            }
            if (r = o, r = S() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * tp(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Js(kr.bind(null, e, _t, En), r);
              break;
            }
            kr(e, _t, En);
            break;
          case 5:
            kr(e, _t, En);
            break;
          default:
            throw Error(l(329));
        }
      }
    }
    return Pt(e, S()), e.callbackNode === n ? $c.bind(null, e) : null;
  }
  function Wl(e, t) {
    var n = Ho;
    return e.current.memoizedState.isDehydrated && (Sr(e, t).flags |= 256), e = ns(e, t), e !== 2 && (t = _t, _t = n, t !== null && Hl(t)), e;
  }
  function Hl(e) {
    _t === null ? _t = e : _t.push.apply(_t, e);
  }
  function np(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var o = n[r], i = o.getSnapshot;
          o = o.value;
          try {
            if (!Wt(i(), o)) return !1;
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
  function Zn(e, t) {
    for (t &= ~Dl, t &= ~qi, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - Pe(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Ac(e) {
    if ((Re & 6) !== 0) throw Error(l(327));
    br();
    var t = rt(e, 0);
    if ((t & 1) === 0) return Pt(e, S()), null;
    var n = ns(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = Tt(e);
      r !== 0 && (t = r, n = Wl(e, r));
    }
    if (n === 1) throw n = Wo, Sr(e, 0), Zn(e, t), Pt(e, S()), n;
    if (n === 6) throw Error(l(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, kr(e, _t, En), Pt(e, S()), null;
  }
  function Ql(e, t) {
    var n = Re;
    Re |= 1;
    try {
      return e(t);
    } finally {
      Re = n, Re === 0 && (Zr = S() + 500, Ti && Qn());
    }
  }
  function xr(e) {
    qn !== null && qn.tag === 0 && (Re & 6) === 0 && br();
    var t = Re;
    Re |= 1;
    var n = Ut.transition, r = Fe;
    try {
      if (Ut.transition = null, Fe = 1, e) return e();
    } finally {
      Fe = r, Ut.transition = n, Re = t, (Re & 6) === 0 && Qn();
    }
  }
  function Kl() {
    Lt = Gr.current, Qe(Gr);
  }
  function Sr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, zf(n)), nt !== null) for (n = nt.return; n !== null; ) {
      var r = n;
      switch (tl(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Pi();
          break;
        case 3:
          Yr(), Qe(jt), Qe(pt), hl();
          break;
        case 5:
          fl(r);
          break;
        case 4:
          Yr();
          break;
        case 13:
          Qe(Ye);
          break;
        case 19:
          Qe(Ye);
          break;
        case 10:
          ll(r.type._context);
          break;
        case 22:
        case 23:
          Kl();
      }
      n = n.return;
    }
    if (lt = e, nt = e = bn(e.current, null), dt = Lt = t, it = 0, Wo = null, Dl = qi = wr = 0, _t = Ho = null, vr !== null) {
      for (t = 0; t < vr.length; t++) if (n = vr[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var o = r.next, i = n.pending;
        if (i !== null) {
          var c = i.next;
          i.next = o, r.next = c;
        }
        n.pending = r;
      }
      vr = null;
    }
    return e;
  }
  function Fc(e, t) {
    do {
      var n = nt;
      try {
        if (sl(), Di.current = Wi, Ui) {
          for (var r = Je.memoizedState; r !== null; ) {
            var o = r.queue;
            o !== null && (o.pending = null), r = r.next;
          }
          Ui = !1;
        }
        if (gr = 0, st = ot = Je = null, Ao = !1, Fo = 0, Fl.current = null, n === null || n.return === null) {
          it = 1, Wo = t, nt = null;
          break;
        }
        e: {
          var i = e, c = n.return, p = n, v = t;
          if (t = dt, p.flags |= 32768, v !== null && typeof v == "object" && typeof v.then == "function") {
            var j = v, L = p, O = L.tag;
            if ((L.mode & 1) === 0 && (O === 0 || O === 11 || O === 15)) {
              var z = L.alternate;
              z ? (L.updateQueue = z.updateQueue, L.memoizedState = z.memoizedState, L.lanes = z.lanes) : (L.updateQueue = null, L.memoizedState = null);
            }
            var Q = uc(c);
            if (Q !== null) {
              Q.flags &= -257, cc(Q, c, p, i, t), Q.mode & 1 && ac(i, j, t), t = Q, v = j;
              var X = t.updateQueue;
              if (X === null) {
                var J = /* @__PURE__ */ new Set();
                J.add(v), t.updateQueue = J;
              } else X.add(v);
              break e;
            } else {
              if ((t & 1) === 0) {
                ac(i, j, t), Xl();
                break e;
              }
              v = Error(l(426));
            }
          } else if (Xe && p.mode & 1) {
            var et = uc(c);
            if (et !== null) {
              (et.flags & 65536) === 0 && (et.flags |= 256), cc(et, c, p, i, t), ol(Jr(v, p));
              break e;
            }
          }
          i = v = Jr(v, p), it !== 4 && (it = 2), Ho === null ? Ho = [i] : Ho.push(i), i = c;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var x = sc(i, v, t);
                Lu(i, x);
                break e;
              case 1:
                p = v;
                var y = i.type, k = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof y.getDerivedStateFromError == "function" || k !== null && typeof k.componentDidCatch == "function" && (Jn === null || !Jn.has(k)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var F = lc(i, p, t);
                  Lu(i, F);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        Bc(n);
      } catch (b) {
        t = b, nt === n && n !== null && (nt = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Dc() {
    var e = Ji.current;
    return Ji.current = Wi, e === null ? Wi : e;
  }
  function Xl() {
    (it === 0 || it === 3 || it === 2) && (it = 4), lt === null || (wr & 268435455) === 0 && (qi & 268435455) === 0 || Zn(lt, dt);
  }
  function ns(e, t) {
    var n = Re;
    Re |= 2;
    var r = Dc();
    (lt !== e || dt !== t) && (En = null, Sr(e, t));
    do
      try {
        rp();
        break;
      } catch (o) {
        Fc(e, o);
      }
    while (!0);
    if (sl(), Re = n, Ji.current = r, nt !== null) throw Error(l(261));
    return lt = null, dt = 0, it;
  }
  function rp() {
    for (; nt !== null; ) Uc(nt);
  }
  function op() {
    for (; nt !== null && !u(); ) Uc(nt);
  }
  function Uc(e) {
    var t = Hc(e.alternate, e, Lt);
    e.memoizedProps = e.pendingProps, t === null ? Bc(e) : nt = t, Fl.current = null;
  }
  function Bc(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = qf(n, t, Lt), n !== null) {
          nt = n;
          return;
        }
      } else {
        if (n = Gf(n, t), n !== null) {
          n.flags &= 32767, nt = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          it = 6, nt = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        nt = t;
        return;
      }
      nt = t = e;
    } while (t !== null);
    it === 0 && (it = 5);
  }
  function kr(e, t, n) {
    var r = Fe, o = Ut.transition;
    try {
      Ut.transition = null, Fe = 1, ip(e, t, n, r);
    } finally {
      Ut.transition = o, Fe = r;
    }
    return null;
  }
  function ip(e, t, n, r) {
    do
      br();
    while (qn !== null);
    if ((Re & 6) !== 0) throw Error(l(327));
    n = e.finishedWork;
    var o = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(l(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (On(e, i), e === lt && (nt = lt = null, dt = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Zi || (Zi = !0, Qc(D, function() {
      return br(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = Ut.transition, Ut.transition = null;
      var c = Fe;
      Fe = 1;
      var p = Re;
      Re |= 4, Fl.current = null, bf(e, n), Ic(n, e), Ef(Xs), pi = !!Ks, Xs = Ks = null, e.current = n, ep(n), h(), Re = p, Fe = c, Ut.transition = i;
    } else e.current = n;
    if (Zi && (Zi = !1, qn = e, bi = o), i = e.pendingLanes, i === 0 && (Jn = null), Ae(n.stateNode), Pt(e, S()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) o = t[n], r(o.value, { componentStack: o.stack, digest: o.digest });
    if (Gi) throw Gi = !1, e = Bl, Bl = null, e;
    return (bi & 1) !== 0 && e.tag !== 0 && br(), i = e.pendingLanes, (i & 1) !== 0 ? e === Vl ? Qo++ : (Qo = 0, Vl = e) : Qo = 0, Qn(), null;
  }
  function br() {
    if (qn !== null) {
      var e = Ta(bi), t = Ut.transition, n = Fe;
      try {
        if (Ut.transition = null, Fe = 16 > e ? 16 : e, qn === null) var r = !1;
        else {
          if (e = qn, qn = null, bi = 0, (Re & 6) !== 0) throw Error(l(331));
          var o = Re;
          for (Re |= 4, K = e.current; K !== null; ) {
            var i = K, c = i.child;
            if ((K.flags & 16) !== 0) {
              var p = i.deletions;
              if (p !== null) {
                for (var v = 0; v < p.length; v++) {
                  var j = p[v];
                  for (K = j; K !== null; ) {
                    var L = K;
                    switch (L.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Vo(8, L, i);
                    }
                    var O = L.child;
                    if (O !== null) O.return = L, K = O;
                    else for (; K !== null; ) {
                      L = K;
                      var z = L.sibling, Q = L.return;
                      if (_c(L), L === j) {
                        K = null;
                        break;
                      }
                      if (z !== null) {
                        z.return = Q, K = z;
                        break;
                      }
                      K = Q;
                    }
                  }
                }
                var X = i.alternate;
                if (X !== null) {
                  var J = X.child;
                  if (J !== null) {
                    X.child = null;
                    do {
                      var et = J.sibling;
                      J.sibling = null, J = et;
                    } while (J !== null);
                  }
                }
                K = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && c !== null) c.return = i, K = c;
            else e: for (; K !== null; ) {
              if (i = K, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  Vo(9, i, i.return);
              }
              var x = i.sibling;
              if (x !== null) {
                x.return = i.return, K = x;
                break e;
              }
              K = i.return;
            }
          }
          var y = e.current;
          for (K = y; K !== null; ) {
            c = K;
            var k = c.child;
            if ((c.subtreeFlags & 2064) !== 0 && k !== null) k.return = c, K = k;
            else e: for (c = y; K !== null; ) {
              if (p = K, (p.flags & 2048) !== 0) try {
                switch (p.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Yi(9, p);
                }
              } catch (b) {
                qe(p, p.return, b);
              }
              if (p === c) {
                K = null;
                break e;
              }
              var F = p.sibling;
              if (F !== null) {
                F.return = p.return, K = F;
                break e;
              }
              K = p.return;
            }
          }
          if (Re = o, Qn(), me && typeof me.onPostCommitFiberRoot == "function") try {
            me.onPostCommitFiberRoot(ue, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        Fe = n, Ut.transition = t;
      }
    }
    return !1;
  }
  function Vc(e, t, n) {
    t = Jr(n, t), t = sc(e, t, 1), e = Xn(e, t, 1), t = gt(), e !== null && (Mn(e, 1, t), Pt(e, t));
  }
  function qe(e, t, n) {
    if (e.tag === 3) Vc(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Vc(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Jn === null || !Jn.has(r))) {
          e = Jr(n, e), e = lc(t, e, 1), t = Xn(t, e, 1), e = gt(), t !== null && (Mn(t, 1, e), Pt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function sp(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = gt(), e.pingedLanes |= e.suspendedLanes & n, lt === e && (dt & n) === n && (it === 4 || it === 3 && (dt & 130023424) === dt && 500 > S() - Ul ? Sr(e, 0) : Dl |= n), Pt(e, t);
  }
  function Wc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = tt, tt <<= 1, (tt & 130023424) === 0 && (tt = 4194304)));
    var n = gt();
    e = kn(e, t), e !== null && (Mn(e, t, n), Pt(e, n));
  }
  function lp(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Wc(e, n);
  }
  function ap(e, t) {
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
        throw Error(l(314));
    }
    r !== null && r.delete(t), Wc(e, n);
  }
  var Hc;
  Hc = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || jt.current) Et = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Et = !1, Jf(e, t, n);
      Et = (e.flags & 131072) !== 0;
    }
    else Et = !1, Xe && (t.flags & 1048576) !== 0 && ju(t, Ii, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Ki(e, t), e = t.pendingProps;
        var o = Br(t, pt.current);
        Xr(t, n), o = yl(null, t, r, e, o, n);
        var i = gl();
        return t.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ct(r) ? (i = !0, Ni(t)) : i = !1, t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, cl(t), o.updater = Hi, t.stateNode = o, o._reactInternals = t, Cl(t, r, e, n), t = Nl(null, t, r, !0, i, n)) : (t.tag = 0, Xe && i && el(t), yt(null, t, o, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Ki(e, t), e = t.pendingProps, o = r._init, r = o(r._payload), t.type = r, o = t.tag = cp(r), e = Qt(r, e), o) {
            case 0:
              t = Pl(null, t, r, e, n);
              break e;
            case 1:
              t = vc(null, t, r, e, n);
              break e;
            case 11:
              t = dc(null, t, r, e, n);
              break e;
            case 14:
              t = fc(null, t, r, Qt(r.type, e), n);
              break e;
          }
          throw Error(l(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Qt(r, o), Pl(e, t, r, o, n);
      case 1:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Qt(r, o), vc(e, t, r, o, n);
      case 3:
        e: {
          if (yc(t), e === null) throw Error(l(387));
          r = t.pendingProps, i = t.memoizedState, o = i.element, zu(e, t), Ai(t, r, null, n);
          var c = t.memoizedState;
          if (r = c.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: c.cache, pendingSuspenseBoundaries: c.pendingSuspenseBoundaries, transitions: c.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            o = Jr(Error(l(423)), t), t = gc(e, t, r, n, o);
            break e;
          } else if (r !== o) {
            o = Jr(Error(l(424)), t), t = gc(e, t, r, n, o);
            break e;
          } else for (zt = Vn(t.stateNode.containerInfo.firstChild), It = t, Xe = !0, Ht = null, n = Ru(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Hr(), r === o) {
              t = Cn(e, t, n);
              break e;
            }
            yt(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Ou(t), e === null && rl(t), r = t.type, o = t.pendingProps, i = e !== null ? e.memoizedProps : null, c = o.children, Ys(r, o) ? c = null : i !== null && Ys(r, i) && (t.flags |= 32), mc(e, t), yt(e, t, c, n), t.child;
      case 6:
        return e === null && rl(t), null;
      case 13:
        return wc(e, t, n);
      case 4:
        return dl(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Qr(t, null, r, n) : yt(e, t, r, n), t.child;
      case 11:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Qt(r, o), dc(e, t, r, o, n);
      case 7:
        return yt(e, t, t.pendingProps, n), t.child;
      case 8:
        return yt(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return yt(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, o = t.pendingProps, i = t.memoizedProps, c = o.value, We(Mi, r._currentValue), r._currentValue = c, i !== null) if (Wt(i.value, c)) {
            if (i.children === o.children && !jt.current) {
              t = Cn(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var p = i.dependencies;
            if (p !== null) {
              c = i.child;
              for (var v = p.firstContext; v !== null; ) {
                if (v.context === r) {
                  if (i.tag === 1) {
                    v = jn(-1, n & -n), v.tag = 2;
                    var j = i.updateQueue;
                    if (j !== null) {
                      j = j.shared;
                      var L = j.pending;
                      L === null ? v.next = v : (v.next = L.next, L.next = v), j.pending = v;
                    }
                  }
                  i.lanes |= n, v = i.alternate, v !== null && (v.lanes |= n), al(
                    i.return,
                    n,
                    t
                  ), p.lanes |= n;
                  break;
                }
                v = v.next;
              }
            } else if (i.tag === 10) c = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (c = i.return, c === null) throw Error(l(341));
              c.lanes |= n, p = c.alternate, p !== null && (p.lanes |= n), al(c, n, t), c = i.sibling;
            } else c = i.child;
            if (c !== null) c.return = i;
            else for (c = i; c !== null; ) {
              if (c === t) {
                c = null;
                break;
              }
              if (i = c.sibling, i !== null) {
                i.return = c.return, c = i;
                break;
              }
              c = c.return;
            }
            i = c;
          }
          yt(e, t, o.children, n), t = t.child;
        }
        return t;
      case 9:
        return o = t.type, r = t.pendingProps.children, Xr(t, n), o = Ft(o), r = r(o), t.flags |= 1, yt(e, t, r, n), t.child;
      case 14:
        return r = t.type, o = Qt(r, t.pendingProps), o = Qt(r.type, o), fc(e, t, r, o, n);
      case 15:
        return pc(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : Qt(r, o), Ki(e, t), t.tag = 1, Ct(r) ? (e = !0, Ni(t)) : e = !1, Xr(t, n), oc(t, r, o), Cl(t, r, o, n), Nl(null, t, r, !0, e, n);
      case 19:
        return Sc(e, t, n);
      case 22:
        return hc(e, t, n);
    }
    throw Error(l(156, t.tag));
  };
  function Qc(e, t) {
    return ui(e, t);
  }
  function up(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Bt(e, t, n, r) {
    return new up(e, t, n, r);
  }
  function Yl(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function cp(e) {
    if (typeof e == "function") return Yl(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === Ee) return 11;
      if (e === $e) return 14;
    }
    return 2;
  }
  function bn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Bt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function rs(e, t, n, r, o, i) {
    var c = 2;
    if (r = e, typeof e == "function") Yl(e) && (c = 1);
    else if (typeof e == "string") c = 5;
    else e: switch (e) {
      case ge:
        return jr(n.children, o, i, t);
      case ne:
        c = 8, o |= 8;
        break;
      case oe:
        return e = Bt(12, n, t, o | 2), e.elementType = oe, e.lanes = i, e;
      case De:
        return e = Bt(13, n, t, o), e.elementType = De, e.lanes = i, e;
      case Ve:
        return e = Bt(19, n, t, o), e.elementType = Ve, e.lanes = i, e;
      case ce:
        return os(n, o, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Ie:
            c = 10;
            break e;
          case Le:
            c = 9;
            break e;
          case Ee:
            c = 11;
            break e;
          case $e:
            c = 14;
            break e;
          case xe:
            c = 16, r = null;
            break e;
        }
        throw Error(l(130, e == null ? e : typeof e, ""));
    }
    return t = Bt(c, n, t, o), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function jr(e, t, n, r) {
    return e = Bt(7, e, r, t), e.lanes = n, e;
  }
  function os(e, t, n, r) {
    return e = Bt(22, e, r, t), e.elementType = ce, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Jl(e, t, n) {
    return e = Bt(6, e, null, t), e.lanes = n, e;
  }
  function ql(e, t, n) {
    return t = Bt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function dp(e, t, n, r, o) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Ir(0), this.expirationTimes = Ir(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ir(0), this.identifierPrefix = r, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null;
  }
  function Gl(e, t, n, r, o, i, c, p, v) {
    return e = new dp(e, t, n, p, v), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = Bt(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, cl(i), e;
  }
  function fp(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: je, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Kc(e) {
    if (!e) return Hn;
    e = e._reactInternals;
    e: {
      if (yn(e) !== e || e.tag !== 1) throw Error(l(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ct(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(l(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ct(n)) return xu(e, n, t);
    }
    return t;
  }
  function Xc(e, t, n, r, o, i, c, p, v) {
    return e = Gl(n, r, !0, e, o, i, c, p, v), e.context = Kc(null), n = e.current, r = gt(), o = Gn(n), i = jn(r, o), i.callback = t ?? null, Xn(n, i, o), e.current.lanes = o, Mn(e, o, r), Pt(e, r), e;
  }
  function is(e, t, n, r) {
    var o = t.current, i = gt(), c = Gn(o);
    return n = Kc(n), t.context === null ? t.context = n : t.pendingContext = n, t = jn(i, c), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Xn(o, t, c), e !== null && (Yt(e, o, c, i), $i(e, o, c)), c;
  }
  function ss(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Yc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Zl(e, t) {
    Yc(e, t), (e = e.alternate) && Yc(e, t);
  }
  function pp() {
    return null;
  }
  var Jc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function bl(e) {
    this._internalRoot = e;
  }
  ls.prototype.render = bl.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(l(409));
    is(e, t, null, null);
  }, ls.prototype.unmount = bl.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      xr(function() {
        is(null, e, null, null);
      }), t[gn] = null;
    }
  };
  function ls(e) {
    this._internalRoot = e;
  }
  ls.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = za();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Dn.length && t !== 0 && t < Dn[n].priority; n++) ;
      Dn.splice(n, 0, e), n === 0 && Oa(e);
    }
  };
  function ea(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function as(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function qc() {
  }
  function hp(e, t, n, r, o) {
    if (o) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var j = ss(c);
          i.call(j);
        };
      }
      var c = Xc(t, r, e, 0, null, !1, !1, "", qc);
      return e._reactRootContainer = c, e[gn] = c.current, To(e.nodeType === 8 ? e.parentNode : e), xr(), c;
    }
    for (; o = e.lastChild; ) e.removeChild(o);
    if (typeof r == "function") {
      var p = r;
      r = function() {
        var j = ss(v);
        p.call(j);
      };
    }
    var v = Gl(e, 0, !1, null, null, !1, !1, "", qc);
    return e._reactRootContainer = v, e[gn] = v.current, To(e.nodeType === 8 ? e.parentNode : e), xr(function() {
      is(t, v, n, r);
    }), v;
  }
  function us(e, t, n, r, o) {
    var i = n._reactRootContainer;
    if (i) {
      var c = i;
      if (typeof o == "function") {
        var p = o;
        o = function() {
          var v = ss(c);
          p.call(v);
        };
      }
      is(t, c, e, o);
    } else c = hp(n, t, e, o, r);
    return ss(c);
  }
  Ra = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = en(t.pendingLanes);
          n !== 0 && (mo(t, n | 1), Pt(t, S()), (Re & 6) === 0 && (Zr = S() + 500, Qn()));
        }
        break;
      case 13:
        xr(function() {
          var r = kn(e, 1);
          if (r !== null) {
            var o = gt();
            Yt(r, e, 1, o);
          }
        }), Zl(e, 1);
    }
  }, Es = function(e) {
    if (e.tag === 13) {
      var t = kn(e, 134217728);
      if (t !== null) {
        var n = gt();
        Yt(t, e, 134217728, n);
      }
      Zl(e, 134217728);
    }
  }, Ia = function(e) {
    if (e.tag === 13) {
      var t = Gn(e), n = kn(e, t);
      if (n !== null) {
        var r = gt();
        Yt(n, e, t, r);
      }
      Zl(e, t);
    }
  }, za = function() {
    return Fe;
  }, La = function(e, t) {
    var n = Fe;
    try {
      return Fe = e, t();
    } finally {
      Fe = n;
    }
  }, zn = function(e, t, n) {
    switch (t) {
      case "input":
        if (Zt(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var o = _i(r);
              if (!o) throw Error(l(90));
              St(r), Zt(r, o);
            }
          }
        }
        break;
      case "textarea":
        Nn(e, n);
        break;
      case "select":
        t = n.value, t != null && dn(e, !!n.multiple, t, !1);
    }
  }, oi = Ql, ii = xr;
  var mp = { usingClientEntryPoint: !1, Events: [zo, Dr, _i, ri, io, Ql] }, Ko = { findFiberByHostInstance: fr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, vp = { bundleType: Ko.bundleType, version: Ko.version, rendererPackageName: Ko.rendererPackageName, rendererConfig: Ko.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: te.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = po(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Ko.findFiberByHostInstance || pp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var cs = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!cs.isDisabled && cs.supportsFiber) try {
      ue = cs.inject(vp), me = cs;
    } catch {
    }
  }
  return Nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = mp, Nt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ea(t)) throw Error(l(200));
    return fp(e, t, null, n);
  }, Nt.createRoot = function(e, t) {
    if (!ea(e)) throw Error(l(299));
    var n = !1, r = "", o = Jc;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = Gl(e, 1, !1, null, null, n, !1, r, o), e[gn] = t.current, To(e.nodeType === 8 ? e.parentNode : e), new bl(t);
  }, Nt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(l(188)) : (e = Object.keys(e).join(","), Error(l(268, e)));
    return e = po(t), e = e === null ? null : e.stateNode, e;
  }, Nt.flushSync = function(e) {
    return xr(e);
  }, Nt.hydrate = function(e, t, n) {
    if (!as(t)) throw Error(l(200));
    return us(null, e, t, !0, n);
  }, Nt.hydrateRoot = function(e, t, n) {
    if (!ea(e)) throw Error(l(405));
    var r = n != null && n.hydratedSources || null, o = !1, i = "", c = Jc;
    if (n != null && (n.unstable_strictMode === !0 && (o = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (c = n.onRecoverableError)), t = Xc(t, null, e, 1, n ?? null, o, !1, i, c), e[gn] = t.current, To(e), r) for (e = 0; e < r.length; e++) n = r[e], o = n._getVersion, o = o(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, o] : t.mutableSourceEagerHydrationData.push(
      n,
      o
    );
    return new ls(t);
  }, Nt.render = function(e, t, n) {
    if (!as(t)) throw Error(l(200));
    return us(null, e, t, !1, n);
  }, Nt.unmountComponentAtNode = function(e) {
    if (!as(e)) throw Error(l(40));
    return e._reactRootContainer ? (xr(function() {
      us(null, null, e, !1, function() {
        e._reactRootContainer = null, e[gn] = null;
      });
    }), !0) : !1;
  }, Nt.unstable_batchedUpdates = Ql, Nt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!as(n)) throw Error(l(200));
    if (e == null || e._reactInternals === void 0) throw Error(l(38));
    return us(e, t, n, !1, r);
  }, Nt.version = "18.3.1-next-f1338f8080-20240426", Nt;
}
var od;
function Pp() {
  if (od) return ra.exports;
  od = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (a) {
        console.error(a);
      }
  }
  return s(), ra.exports = _p(), ra.exports;
}
var id;
function Np() {
  if (id) return ds;
  id = 1;
  var s = Pp();
  return ds.createRoot = s.createRoot, ds.hydrateRoot = s.hydrateRoot, ds;
}
var Tp = Np();
const Rp = /* @__PURE__ */ kd(Tp), Ip = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", zp = `${Ip}/chat/completions`, Lp = 1, sd = 256 * 1024 * 1024, Mp = 512 * 1024 * 1024, gs = 64 * 1024, Op = `You are the analysis assistant inside OMERO Analysis Chat.
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
Explain biological and measurement meaning without overstating causality.`, $p = [
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
function sa() {
  const s = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return s ? decodeURIComponent(s[1]) : "";
}
function la(s, a, l) {
  return s.replace("TYPE", a).replace("/1/", `/${l}/`);
}
class Ap {
  constructor(a) {
    sn(this, "contextToken", "");
    sn(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = a;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const a = this.bootstrap.context;
    if (!a) return;
    const l = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": sa()
      },
      body: JSON.stringify({
        object_type: a.object_type,
        object_id: a.object_id
      })
    }), d = await fs(l);
    this.contextToken = d.context_token, this.operations = new Set(d.operations);
  }
  async download(a) {
    const l = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${a.annotation_id}/download/`
    ), d = await fetch(l, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!d.ok) throw new Error(await va(d));
    return d.arrayBuffer();
  }
  async attach(a) {
    const l = this.bootstrap.context;
    if (!l || !a.data) throw new Error("No OMERO target or result data");
    const d = new FormData();
    d.append("file", new Blob([a.data], { type: a.type }), a.name);
    const g = await fetch(
      la(
        this.bootstrap.uploadTemplate,
        l.object_type,
        l.object_id
      ),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": sa(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: d
      }
    );
    return (await fs(g)).attachment;
  }
  async listSnapshots() {
    const a = this.bootstrap.context;
    if (!a) return [];
    const l = await fetch(
      la(this.bootstrap.snapshotsTemplate, a.object_type, a.object_id),
      {
        credentials: "same-origin",
        headers: { "X-OMERO-Analysis-Context": this.contextToken }
      }
    );
    return (await fs(l)).snapshots || [];
  }
  async uploadSnapshot(a, l) {
    const d = this.bootstrap.context;
    if (!d) throw new Error("No OMERO target for the project snapshot");
    const g = new FormData();
    g.append(
      "file",
      new Blob([l], { type: "application/zip" }),
      a
    );
    const m = await fetch(
      la(this.bootstrap.snapshotUploadTemplate, d.object_type, d.object_id),
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": sa(),
          "X-OMERO-Analysis-Context": this.contextToken
        },
        body: g
      }
    );
    return (await fs(m)).snapshot;
  }
  async downloadSnapshot(a) {
    const l = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${a.annotation_id}/download/`
    ), d = await fetch(l, {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": this.contextToken }
    });
    if (!d.ok) throw new Error(await va(d));
    return d.arrayBuffer();
  }
}
async function va(s) {
  var a;
  try {
    return ((a = (await s.json()).error) == null ? void 0 : a.message) || `${s.status} ${s.statusText}`;
  } catch {
    return `${s.status} ${s.statusText}`;
  }
}
async function fs(s) {
  var l;
  const a = await s.json().catch(() => ({}));
  if (!s.ok)
    throw new Error(((l = a.error) == null ? void 0 : l.message) || `${s.status} ${s.statusText}`);
  return a;
}
async function Fp(s, a, l) {
  const d = await fetch(zp, {
    method: "POST",
    signal: l,
    headers: {
      "Content-Type": "application/json",
      "api-key": s.apiKey
    },
    body: JSON.stringify({
      model: s.model,
      temperature: Lp,
      messages: a,
      tools: $p,
      tool_choice: "auto"
    })
  });
  if (!d.ok) throw new Error(await va(d));
  return d.json();
}
function Dp(s) {
  const a = JSON.stringify({
    stdout: s.stdout,
    stderr: s.stderr,
    preview: s.preview,
    generated_files: s.files.map((l) => ({
      name: l.name,
      size: l.data.byteLength,
      type: l.type
    }))
  });
  return a.length > 64 * 1024 ? `${a.slice(0, 64 * 1024)}
[tool output truncated]` : a;
}
function Vt(s) {
  const a = String(s instanceof Error ? s.message : s).slice(0, gs), l = JSON.stringify({
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
  return l.length > gs ? `${l.slice(0, gs)}
[tool error truncated]` : l;
}
var Ze = Uint8Array, Mt = Uint16Array, Pa = Int32Array, ws = new Ze([
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
]), xs = new Ze([
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
]), ya = new Ze([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), jd = function(s, a) {
  for (var l = new Mt(31), d = 0; d < 31; ++d)
    l[d] = a += 1 << s[d - 1];
  for (var g = new Pa(l[30]), d = 1; d < 30; ++d)
    for (var m = l[d]; m < l[d + 1]; ++m)
      g[m] = m - l[d] << 5 | d;
  return { b: l, r: g };
}, Cd = jd(ws, 2), Ed = Cd.b, ga = Cd.r;
Ed[28] = 258, ga[258] = 28;
var _d = jd(xs, 0), Up = _d.b, ld = _d.r, wa = new Mt(32768);
for (var Ke = 0; Ke < 32768; ++Ke) {
  var tr = (Ke & 43690) >> 1 | (Ke & 21845) << 1;
  tr = (tr & 52428) >> 2 | (tr & 13107) << 2, tr = (tr & 61680) >> 4 | (tr & 3855) << 4, wa[Ke] = ((tr & 65280) >> 8 | (tr & 255) << 8) >> 1;
}
var un = (function(s, a, l) {
  for (var d = s.length, g = 0, m = new Mt(a); g < d; ++g)
    s[g] && ++m[s[g] - 1];
  var _ = new Mt(a);
  for (g = 1; g < a; ++g)
    _[g] = _[g - 1] + m[g - 1] << 1;
  var E;
  if (l) {
    E = new Mt(1 << a);
    var C = 15 - a;
    for (g = 0; g < d; ++g)
      if (s[g])
        for (var A = g << 4 | s[g], T = a - s[g], N = _[s[g] - 1]++ << T, R = N | (1 << T) - 1; N <= R; ++N)
          E[wa[N] >> C] = A;
  } else
    for (E = new Mt(d), g = 0; g < d; ++g)
      s[g] && (E[g] = wa[_[s[g] - 1]++] >> 15 - s[g]);
  return E;
}), rr = new Ze(288);
for (var Ke = 0; Ke < 144; ++Ke)
  rr[Ke] = 8;
for (var Ke = 144; Ke < 256; ++Ke)
  rr[Ke] = 9;
for (var Ke = 256; Ke < 280; ++Ke)
  rr[Ke] = 7;
for (var Ke = 280; Ke < 288; ++Ke)
  rr[Ke] = 8;
var Go = new Ze(32);
for (var Ke = 0; Ke < 32; ++Ke)
  Go[Ke] = 5;
var Bp = /* @__PURE__ */ un(rr, 9, 0), Vp = /* @__PURE__ */ un(rr, 9, 1), Wp = /* @__PURE__ */ un(Go, 5, 0), Hp = /* @__PURE__ */ un(Go, 5, 1), aa = function(s) {
  for (var a = s[0], l = 1; l < s.length; ++l)
    s[l] > a && (a = s[l]);
  return a;
}, Jt = function(s, a, l) {
  var d = a / 8 | 0;
  return (s[d] | s[d + 1] << 8) >> (a & 7) & l;
}, ua = function(s, a) {
  var l = a / 8 | 0;
  return (s[l] | s[l + 1] << 8 | s[l + 2] << 16) >> (a & 7);
}, Na = function(s) {
  return (s + 7) / 8 | 0;
}, Zo = function(s, a, l) {
  return (a == null || a < 0) && (a = 0), (l == null || l > s.length) && (l = s.length), new Ze(s.subarray(a, l));
}, Qp = [
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
], xt = function(s, a, l) {
  var d = new Error(a || Qp[s]);
  if (d.code = s, Error.captureStackTrace && Error.captureStackTrace(d, xt), !l)
    throw d;
  return d;
}, Kp = function(s, a, l, d) {
  var g = s.length, m = d ? d.length : 0;
  if (!g || a.f && !a.l)
    return l || new Ze(0);
  var _ = !l, E = _ || a.i != 2, C = a.i;
  _ && (l = new Ze(g * 3));
  var A = function(Se) {
    var St = l.length;
    if (Se > St) {
      var Me = new Ze(Math.max(St * 2, Se));
      Me.set(l), l = Me;
    }
  }, T = a.f || 0, N = a.p || 0, R = a.b || 0, ie = a.l, he = a.d, G = a.m, Y = a.n, Te = g * 8;
  do {
    if (!ie) {
      T = Jt(s, N, 1);
      var ke = Jt(s, N + 1, 3);
      if (N += 3, ke)
        if (ke == 1)
          ie = Vp, he = Hp, G = 9, Y = 5;
        else if (ke == 2) {
          var je = Jt(s, N, 31) + 257, ge = Jt(s, N + 10, 15) + 4, ne = je + Jt(s, N + 5, 31) + 1;
          N += 14;
          for (var oe = new Ze(ne), Ie = new Ze(19), Le = 0; Le < ge; ++Le)
            Ie[ya[Le]] = Jt(s, N + Le * 3, 7);
          N += ge * 3;
          for (var Ee = aa(Ie), De = (1 << Ee) - 1, Ve = un(Ie, Ee, 1), Le = 0; Le < ne; ) {
            var $e = Ve[Jt(s, N, De)];
            N += $e & 15;
            var B = $e >> 4;
            if (B < 16)
              oe[Le++] = B;
            else {
              var xe = 0, ce = 0;
              for (B == 16 ? (ce = 3 + Jt(s, N, 3), N += 2, xe = oe[Le - 1]) : B == 17 ? (ce = 3 + Jt(s, N, 7), N += 3) : B == 18 && (ce = 11 + Jt(s, N, 127), N += 7); ce--; )
                oe[Le++] = xe;
            }
          }
          var $ = oe.subarray(0, je), W = oe.subarray(je);
          G = aa($), Y = aa(W), ie = un($, G, 1), he = un(W, Y, 1);
        } else
          xt(1);
      else {
        var B = Na(N) + 4, te = s[B - 4] | s[B - 3] << 8, V = B + te;
        if (V > g) {
          C && xt(0);
          break;
        }
        E && A(R + te), l.set(s.subarray(B, V), R), a.b = R += te, a.p = N = V * 8, a.f = T;
        continue;
      }
      if (N > Te) {
        C && xt(0);
        break;
      }
    }
    E && A(R + 131072);
    for (var H = (1 << G) - 1, w = (1 << Y) - 1, P = N; ; P = N) {
      var xe = ie[ua(s, N) & H], q = xe >> 4;
      if (N += xe & 15, N > Te) {
        C && xt(0);
        break;
      }
      if (xe || xt(2), q < 256)
        l[R++] = q;
      else if (q == 256) {
        P = N, ie = null;
        break;
      } else {
        var re = q - 254;
        if (q > 264) {
          var Le = q - 257, Z = ws[Le];
          re = Jt(s, N, (1 << Z) - 1) + Ed[Le], N += Z;
        }
        var ae = he[ua(s, N) & w], Ce = ae >> 4;
        ae || xt(3), N += ae & 15;
        var W = Up[Ce];
        if (Ce > 3) {
          var Z = xs[Ce];
          W += ua(s, N) & (1 << Z) - 1, N += Z;
        }
        if (N > Te) {
          C && xt(0);
          break;
        }
        E && A(R + 131072);
        var ve = R + re;
        if (R < W) {
          var _e = m - W, Ue = Math.min(W, ve);
          for (_e + R < 0 && xt(3); R < Ue; ++R)
            l[R] = d[_e + R];
        }
        for (; R < ve; ++R)
          l[R] = l[R - W];
      }
    }
    a.l = ie, a.p = P, a.b = R, a.f = T, ie && (T = 1, a.m = G, a.d = he, a.n = Y);
  } while (!T);
  return R != l.length && _ ? Zo(l, 0, R) : l.subarray(0, R);
}, _n = function(s, a, l) {
  l <<= a & 7;
  var d = a / 8 | 0;
  s[d] |= l, s[d + 1] |= l >> 8;
}, Yo = function(s, a, l) {
  l <<= a & 7;
  var d = a / 8 | 0;
  s[d] |= l, s[d + 1] |= l >> 8, s[d + 2] |= l >> 16;
}, ca = function(s, a) {
  for (var l = [], d = 0; d < s.length; ++d)
    s[d] && l.push({ s: d, f: s[d] });
  var g = l.length, m = l.slice();
  if (!g)
    return { t: Nd, l: 0 };
  if (g == 1) {
    var _ = new Ze(l[0].s + 1);
    return _[l[0].s] = 1, { t: _, l: 1 };
  }
  l.sort(function(V, je) {
    return V.f - je.f;
  }), l.push({ s: -1, f: 25001 });
  var E = l[0], C = l[1], A = 0, T = 1, N = 2;
  for (l[0] = { s: -1, f: E.f + C.f, l: E, r: C }; T != g - 1; )
    E = l[l[A].f < l[N].f ? A++ : N++], C = l[A != T && l[A].f < l[N].f ? A++ : N++], l[T++] = { s: -1, f: E.f + C.f, l: E, r: C };
  for (var R = m[0].s, d = 1; d < g; ++d)
    m[d].s > R && (R = m[d].s);
  var ie = new Mt(R + 1), he = xa(l[T - 1], ie, 0);
  if (he > a) {
    var d = 0, G = 0, Y = he - a, Te = 1 << Y;
    for (m.sort(function(je, ge) {
      return ie[ge.s] - ie[je.s] || je.f - ge.f;
    }); d < g; ++d) {
      var ke = m[d].s;
      if (ie[ke] > a)
        G += Te - (1 << he - ie[ke]), ie[ke] = a;
      else
        break;
    }
    for (G >>= Y; G > 0; ) {
      var B = m[d].s;
      ie[B] < a ? G -= 1 << a - ie[B]++ - 1 : ++d;
    }
    for (; d >= 0 && G; --d) {
      var te = m[d].s;
      ie[te] == a && (--ie[te], ++G);
    }
    he = a;
  }
  return { t: new Ze(ie), l: he };
}, xa = function(s, a, l) {
  return s.s == -1 ? Math.max(xa(s.l, a, l + 1), xa(s.r, a, l + 1)) : a[s.s] = l;
}, ad = function(s) {
  for (var a = s.length; a && !s[--a]; )
    ;
  for (var l = new Mt(++a), d = 0, g = s[0], m = 1, _ = function(C) {
    l[d++] = C;
  }, E = 1; E <= a; ++E)
    if (s[E] == g && E != a)
      ++m;
    else {
      if (!g && m > 2) {
        for (; m > 138; m -= 138)
          _(32754);
        m > 2 && (_(m > 10 ? m - 11 << 5 | 28690 : m - 3 << 5 | 12305), m = 0);
      } else if (m > 3) {
        for (_(g), --m; m > 6; m -= 6)
          _(8304);
        m > 2 && (_(m - 3 << 5 | 8208), m = 0);
      }
      for (; m--; )
        _(g);
      m = 1, g = s[E];
    }
  return { c: l.subarray(0, d), n: a };
}, Jo = function(s, a) {
  for (var l = 0, d = 0; d < a.length; ++d)
    l += s[d] * a[d];
  return l;
}, Pd = function(s, a, l) {
  var d = l.length, g = Na(a + 2);
  s[g] = d & 255, s[g + 1] = d >> 8, s[g + 2] = s[g] ^ 255, s[g + 3] = s[g + 1] ^ 255;
  for (var m = 0; m < d; ++m)
    s[g + m + 4] = l[m];
  return (g + 4 + d) * 8;
}, ud = function(s, a, l, d, g, m, _, E, C, A, T) {
  _n(a, T++, l), ++g[256];
  for (var N = ca(g, 15), R = N.t, ie = N.l, he = ca(m, 15), G = he.t, Y = he.l, Te = ad(R), ke = Te.c, B = Te.n, te = ad(G), V = te.c, je = te.n, ge = new Mt(19), ne = 0; ne < ke.length; ++ne)
    ++ge[ke[ne] & 31];
  for (var ne = 0; ne < V.length; ++ne)
    ++ge[V[ne] & 31];
  for (var oe = ca(ge, 7), Ie = oe.t, Le = oe.l, Ee = 19; Ee > 4 && !Ie[ya[Ee - 1]]; --Ee)
    ;
  var De = A + 5 << 3, Ve = Jo(g, rr) + Jo(m, Go) + _, $e = Jo(g, R) + Jo(m, G) + _ + 14 + 3 * Ee + Jo(ge, Ie) + 2 * ge[16] + 3 * ge[17] + 7 * ge[18];
  if (C >= 0 && De <= Ve && De <= $e)
    return Pd(a, T, s.subarray(C, C + A));
  var xe, ce, $, W;
  if (_n(a, T, 1 + ($e < Ve)), T += 2, $e < Ve) {
    xe = un(R, ie, 0), ce = R, $ = un(G, Y, 0), W = G;
    var H = un(Ie, Le, 0);
    _n(a, T, B - 257), _n(a, T + 5, je - 1), _n(a, T + 10, Ee - 4), T += 14;
    for (var ne = 0; ne < Ee; ++ne)
      _n(a, T + 3 * ne, Ie[ya[ne]]);
    T += 3 * Ee;
    for (var w = [ke, V], P = 0; P < 2; ++P)
      for (var q = w[P], ne = 0; ne < q.length; ++ne) {
        var re = q[ne] & 31;
        _n(a, T, H[re]), T += Ie[re], re > 15 && (_n(a, T, q[ne] >> 5 & 127), T += q[ne] >> 12);
      }
  } else
    xe = Bp, ce = rr, $ = Wp, W = Go;
  for (var ne = 0; ne < E; ++ne) {
    var Z = d[ne];
    if (Z > 255) {
      var re = Z >> 18 & 31;
      Yo(a, T, xe[re + 257]), T += ce[re + 257], re > 7 && (_n(a, T, Z >> 23 & 31), T += ws[re]);
      var ae = Z & 31;
      Yo(a, T, $[ae]), T += W[ae], ae > 3 && (Yo(a, T, Z >> 5 & 8191), T += xs[ae]);
    } else
      Yo(a, T, xe[Z]), T += ce[Z];
  }
  return Yo(a, T, xe[256]), T + ce[256];
}, Xp = /* @__PURE__ */ new Pa([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Nd = /* @__PURE__ */ new Ze(0), Yp = function(s, a, l, d, g, m) {
  var _ = m.z || s.length, E = new Ze(d + _ + 5 * (1 + Math.ceil(_ / 7e3)) + g), C = E.subarray(d, E.length - g), A = m.l, T = (m.r || 0) & 7;
  if (a) {
    T && (C[0] = m.r >> 3);
    for (var N = Xp[a - 1], R = N >> 13, ie = N & 8191, he = (1 << l) - 1, G = m.p || new Mt(32768), Y = m.h || new Mt(he + 1), Te = Math.ceil(l / 3), ke = 2 * Te, B = function(Ot) {
      return (s[Ot] ^ s[Ot + 1] << Te ^ s[Ot + 2] << ke) & he;
    }, te = new Pa(25e3), V = new Mt(288), je = new Mt(32), ge = 0, ne = 0, oe = m.i || 0, Ie = 0, Le = m.w || 0, Ee = 0; oe + 2 < _; ++oe) {
      var De = B(oe), Ve = oe & 32767, $e = Y[De];
      if (G[Ve] = $e, Y[De] = Ve, Le <= oe) {
        var xe = _ - oe;
        if ((ge > 7e3 || Ie > 24576) && (xe > 423 || !A)) {
          T = ud(s, C, 0, te, V, je, ne, Ie, Ee, oe - Ee, T), Ie = ge = ne = 0, Ee = oe;
          for (var ce = 0; ce < 286; ++ce)
            V[ce] = 0;
          for (var ce = 0; ce < 30; ++ce)
            je[ce] = 0;
        }
        var $ = 2, W = 0, H = ie, w = Ve - $e & 32767;
        if (xe > 2 && De == B(oe - w))
          for (var P = Math.min(R, xe) - 1, q = Math.min(32767, oe), re = Math.min(258, xe); w <= q && --H && Ve != $e; ) {
            if (s[oe + $] == s[oe + $ - w]) {
              for (var Z = 0; Z < re && s[oe + Z] == s[oe + Z - w]; ++Z)
                ;
              if (Z > $) {
                if ($ = Z, W = w, Z > P)
                  break;
                for (var ae = Math.min(w, Z - 2), Ce = 0, ce = 0; ce < ae; ++ce) {
                  var ve = oe - w + ce & 32767, _e = G[ve], Ue = ve - _e & 32767;
                  Ue > Ce && (Ce = Ue, $e = ve);
                }
              }
            }
            Ve = $e, $e = G[Ve], w += Ve - $e & 32767;
          }
        if (W) {
          te[Ie++] = 268435456 | ga[$] << 18 | ld[W];
          var Se = ga[$] & 31, St = ld[W] & 31;
          ne += ws[Se] + xs[St], ++V[257 + Se], ++je[St], Le = oe + $, ++ge;
        } else
          te[Ie++] = s[oe], ++V[s[oe]];
      }
    }
    for (oe = Math.max(oe, Le); oe < _; ++oe)
      te[Ie++] = s[oe], ++V[s[oe]];
    T = ud(s, C, A, te, V, je, ne, Ie, Ee, oe - Ee, T), A || (m.r = T & 7 | C[T / 8 | 0] << 3, T -= 7, m.h = Y, m.p = G, m.i = oe, m.w = Le);
  } else {
    for (var oe = m.w || 0; oe < _ + A; oe += 65535) {
      var Me = oe + 65535;
      Me >= _ && (C[T / 8 | 0] = A, Me = _), T = Pd(C, T + 1, s.subarray(oe, Me));
    }
    m.i = _;
  }
  return Zo(E, 0, d + Na(T) + g);
}, Jp = /* @__PURE__ */ (function() {
  for (var s = new Int32Array(256), a = 0; a < 256; ++a) {
    for (var l = a, d = 9; --d; )
      l = (l & 1 && -306674912) ^ l >>> 1;
    s[a] = l;
  }
  return s;
})(), qp = function() {
  var s = -1;
  return {
    p: function(a) {
      for (var l = s, d = 0; d < a.length; ++d)
        l = Jp[l & 255 ^ a[d]] ^ l >>> 8;
      s = l;
    },
    d: function() {
      return ~s;
    }
  };
}, Gp = function(s, a, l, d, g) {
  if (!g && (g = { l: 1 }, a.dictionary)) {
    var m = a.dictionary.subarray(-32768), _ = new Ze(m.length + s.length);
    _.set(m), _.set(s, m.length), s = _, g.w = m.length;
  }
  return Yp(s, a.level == null ? 6 : a.level, a.mem == null ? g.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(s.length))) * 1.5) : 20 : 12 + a.mem, l, d, g);
}, Td = function(s, a) {
  var l = {};
  for (var d in s)
    l[d] = s[d];
  for (var d in a)
    l[d] = a[d];
  return l;
}, an = function(s, a) {
  return s[a] | s[a + 1] << 8;
}, Gt = function(s, a) {
  return (s[a] | s[a + 1] << 8 | s[a + 2] << 16 | s[a + 3] << 24) >>> 0;
}, da = function(s, a) {
  return Gt(s, a) + Gt(s, a + 4) * 4294967296;
}, ft = function(s, a, l) {
  for (; l; ++a)
    s[a] = l, l >>>= 8;
};
function Zp(s, a) {
  return Gp(s, a || {}, 0, 0);
}
function bp(s, a) {
  return Kp(s, { i: 2 }, a && a.out, a && a.dictionary);
}
var Rd = function(s, a, l, d) {
  for (var g in s) {
    var m = s[g], _ = a + g, E = d;
    Array.isArray(m) && (E = Td(d, m[1]), m = m[0]), m instanceof Ze ? l[_] = [m, E] : (l[_ += "/"] = [new Ze(0), E], Rd(m, _, l, d));
  }
}, cd = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), Sa = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), eh = 0;
try {
  Sa.decode(Nd, { stream: !0 }), eh = 1;
} catch {
}
var th = function(s) {
  for (var a = "", l = 0; ; ) {
    var d = s[l++], g = (d > 127) + (d > 223) + (d > 239);
    if (l + g > s.length)
      return { s: a, r: Zo(s, l - 1) };
    g ? g == 3 ? (d = ((d & 15) << 18 | (s[l++] & 63) << 12 | (s[l++] & 63) << 6 | s[l++] & 63) - 65536, a += String.fromCharCode(55296 | d >> 10, 56320 | d & 1023)) : g & 1 ? a += String.fromCharCode((d & 31) << 6 | s[l++] & 63) : a += String.fromCharCode((d & 15) << 12 | (s[l++] & 63) << 6 | s[l++] & 63) : a += String.fromCharCode(d);
  }
};
function ka(s, a) {
  var l;
  if (cd)
    return cd.encode(s);
  for (var d = s.length, g = new Ze(s.length + (s.length >> 1)), m = 0, _ = function(A) {
    g[m++] = A;
  }, l = 0; l < d; ++l) {
    if (m + 5 > g.length) {
      var E = new Ze(m + 8 + (d - l << 1));
      E.set(g), g = E;
    }
    var C = s.charCodeAt(l);
    C < 128 || a ? _(C) : C < 2048 ? (_(192 | C >> 6), _(128 | C & 63)) : C > 55295 && C < 57344 ? (C = 65536 + (C & 1047552) | s.charCodeAt(++l) & 1023, _(240 | C >> 18), _(128 | C >> 12 & 63), _(128 | C >> 6 & 63), _(128 | C & 63)) : (_(224 | C >> 12), _(128 | C >> 6 & 63), _(128 | C & 63));
  }
  return Zo(g, 0, m);
}
function Id(s, a) {
  if (a) {
    for (var l = "", d = 0; d < s.length; d += 16384)
      l += String.fromCharCode.apply(null, s.subarray(d, d + 16384));
    return l;
  } else {
    if (Sa)
      return Sa.decode(s);
    var g = th(s), m = g.s, l = g.r;
    return l.length && xt(8), m;
  }
}
var nh = function(s, a) {
  return a + 30 + an(s, a + 26) + an(s, a + 28);
}, rh = function(s, a, l) {
  var d = an(s, a + 28), g = Id(s.subarray(a + 46, a + 46 + d), !(an(s, a + 8) & 2048)), m = a + 46 + d, _ = Gt(s, a + 20), E = l && _ == 4294967295 ? oh(s, m) : [_, Gt(s, a + 24), Gt(s, a + 42)], C = E[0], A = E[1], T = E[2];
  return [an(s, a + 10), C, A, g, m + an(s, a + 30) + an(s, a + 32), T];
}, oh = function(s, a) {
  for (; an(s, a) != 1; a += 4 + an(s, a + 2))
    ;
  return [da(s, a + 12), da(s, a + 4), da(s, a + 20)];
}, ja = function(s) {
  var a = 0;
  if (s)
    for (var l in s) {
      var d = s[l].length;
      d > 65535 && xt(9), a += d + 4;
    }
  return a;
}, dd = function(s, a, l, d, g, m, _, E) {
  var C = d.length, A = l.extra, T = E && E.length, N = ja(A);
  ft(s, a, _ != null ? 33639248 : 67324752), a += 4, _ != null && (s[a++] = 20, s[a++] = l.os), s[a] = 20, a += 2, s[a++] = l.flag << 1 | (m < 0 && 8), s[a++] = g && 8, s[a++] = l.compression & 255, s[a++] = l.compression >> 8;
  var R = new Date(l.mtime == null ? Date.now() : l.mtime), ie = R.getFullYear() - 1980;
  if ((ie < 0 || ie > 119) && xt(10), ft(s, a, ie << 25 | R.getMonth() + 1 << 21 | R.getDate() << 16 | R.getHours() << 11 | R.getMinutes() << 5 | R.getSeconds() >> 1), a += 4, m != -1 && (ft(s, a, l.crc), ft(s, a + 4, m < 0 ? -m - 2 : m), ft(s, a + 8, l.size)), ft(s, a + 12, C), ft(s, a + 14, N), a += 16, _ != null && (ft(s, a, T), ft(s, a + 6, l.attrs), ft(s, a + 10, _), a += 14), s.set(d, a), a += C, N)
    for (var he in A) {
      var G = A[he], Y = G.length;
      ft(s, a, +he), ft(s, a + 2, Y), s.set(G, a + 4), a += 4 + Y;
    }
  return T && (s.set(E, a), a += T), a;
}, ih = function(s, a, l, d, g) {
  ft(s, a, 101010256), ft(s, a + 8, l), ft(s, a + 10, l), ft(s, a + 12, d), ft(s, a + 16, g);
};
function sh(s, a) {
  a || (a = {});
  var l = {}, d = [];
  Rd(s, "", l, a);
  var g = 0, m = 0;
  for (var _ in l) {
    var E = l[_], C = E[0], A = E[1], T = A.level == 0 ? 0 : 8, N = ka(_), R = N.length, ie = A.comment, he = ie && ka(ie), G = he && he.length, Y = ja(A.extra);
    R > 65535 && xt(11);
    var Te = T ? Zp(C, A) : C, ke = Te.length, B = qp();
    B.p(C), d.push(Td(A, {
      size: C.length,
      crc: B.d(),
      c: Te,
      f: N,
      m: he,
      u: R != _.length || he && ie.length != G,
      o: g,
      compression: T
    })), g += 30 + R + Y + ke, m += 76 + 2 * (R + Y) + (G || 0) + ke;
  }
  for (var te = new Ze(m + 22), V = g, je = m - g, ge = 0; ge < d.length; ++ge) {
    var N = d[ge];
    dd(te, N.o, N, N.f, N.u, N.c.length);
    var ne = 30 + N.f.length + ja(N.extra);
    te.set(N.c, N.o + ne), dd(te, g, N, N.f, N.u, N.c.length, N.o, N.m), g += 16 + ne + (N.m ? N.m.length : 0);
  }
  return ih(te, g, d.length, je, V), te;
}
function lh(s, a) {
  for (var l = {}, d = s.length - 22; Gt(s, d) != 101010256; --d)
    (!d || s.length - d > 65558) && xt(13);
  var g = an(s, d + 8);
  if (!g)
    return {};
  var m = Gt(s, d + 16), _ = m == 4294967295 || g == 65535;
  if (_) {
    var E = Gt(s, d - 12);
    _ = Gt(s, E) == 101075792, _ && (g = Gt(s, E + 32), m = Gt(s, E + 48));
  }
  for (var C = 0; C < g; ++C) {
    var A = rh(s, m, _), T = A[0], N = A[1], R = A[2], ie = A[3], he = A[4], G = A[5], Y = nh(s, G);
    m = he, T ? T == 8 ? l[ie] = bp(s.subarray(Y, Y + N), { out: new Ze(R) }) : xt(14, "unknown compression type " + T) : l[ie] = Zo(s, Y, Y + N);
  }
  return l;
}
const ah = "omero-analysis-chat", uh = 2, zd = ["projects", "chats", "files", "executions", "scripts"];
function no(s) {
  return new Promise((a, l) => {
    s.onsuccess = () => a(s.result), s.onerror = () => l(s.error);
  });
}
function Ss(s) {
  return new Promise((a, l) => {
    s.oncomplete = () => a(), s.onerror = () => l(s.error), s.onabort = () => l(s.error || new Error("Storage transaction aborted"));
  });
}
function cn() {
  return new Promise((s, a) => {
    const l = indexedDB.open(ah, uh);
    l.onupgradeneeded = () => {
      const d = l.result;
      d.objectStoreNames.contains("values") || d.createObjectStore("values");
      for (const g of zd) {
        if (d.objectStoreNames.contains(g)) continue;
        const m = d.createObjectStore(g, { keyPath: "id" });
        g !== "projects" && m.createIndex("projectId", "projectId"), g === "projects" && m.createIndex("contextKey", "contextKey", { unique: !0 }), (g === "files" || g === "executions") && m.createIndex("chatId", "chatId");
      }
    }, l.onsuccess = () => s(l.result), l.onerror = () => a(l.error);
  });
}
async function Ld(s) {
  const l = (await cn()).transaction("values", "readonly");
  return no(l.objectStore("values").get(s));
}
async function Md(s, a) {
  const d = (await cn()).transaction("values", "readwrite");
  d.objectStore("values").put(a, s), await Ss(d);
}
async function bo(s, a) {
  const d = (await cn()).transaction(s, "readwrite");
  d.objectStore(s).put(a), await Ss(d);
}
async function Od(s, a) {
  const d = (await cn()).transaction(s, "readwrite");
  d.objectStore(s).delete(a), await Ss(d);
}
async function nr(s, a) {
  const d = (await cn()).transaction(s, "readonly");
  return no(d.objectStore(s).index("projectId").getAll(a));
}
const fd = (s) => bo("projects", s), fa = (s) => bo("chats", s), ps = (s) => bo("files", s), ch = (s) => bo("executions", s), hs = (s) => bo("scripts", s), dh = (s) => Od("files", s), fh = (s) => Od("scripts", s);
async function $d(s) {
  return s ? `${s.user_id}:${s.group_id}:${s.object_type}:${s.object_id}` : "standalone";
}
function ph(s) {
  return s.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 64).toLowerCase() || "workspace";
}
function hh(s) {
  return s ? `OMERO/${s.object_type}-${s.object_id}--${ph(s.name)}` : "OMERO/Local--workspace";
}
async function qt(s) {
  const a = typeof s == "string" ? new TextEncoder().encode(s) : new Uint8Array(s), l = await crypto.subtle.digest("SHA-256", a);
  return Array.from(new Uint8Array(l), (d) => d.toString(16).padStart(2, "0")).join("");
}
function Ca(s, a = "New analysis") {
  const l = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: crypto.randomUUID(),
    projectId: s,
    title: a,
    summary: "",
    archived: !1,
    messages: [],
    createdAt: l,
    updatedAt: l
  };
}
async function mh(s) {
  const l = (await cn()).transaction("projects", "readonly");
  return no(l.objectStore("projects").index("contextKey").get(s));
}
async function Cr(s) {
  const l = (await cn()).transaction([...zd], "readwrite");
  l.objectStore("projects").put(s.project), s.chats.forEach((d) => l.objectStore("chats").put(d)), s.files.forEach((d) => l.objectStore("files").put(d)), s.executions.forEach((d) => l.objectStore("executions").put(d)), s.scripts.forEach((d) => l.objectStore("scripts").put(d)), await Ss(l);
}
async function vh(s, a, l) {
  const d = await Ld(`workspace:${l}`);
  if (!d) return null;
  const g = (/* @__PURE__ */ new Date()).toISOString();
  a.title = "Imported chat", a.messages = (d.messages || []).map((E) => ({
    id: String(E.id || crypto.randomUUID()),
    role: E.role === "user" ? "user" : "assistant",
    content: String(E.content || E.code || ""),
    kind: E.kind === "error" ? "error" : "text",
    createdAt: g
  })), a.updatedAt = g;
  const m = [];
  for (const E of d.files || []) {
    const C = E.data instanceof ArrayBuffer ? E.data : void 0;
    m.push({
      id: String(E.id || crypto.randomUUID()),
      projectId: s.id,
      chatId: E.source === "result" ? a.id : void 0,
      name: String(E.name || "file"),
      logicalPath: E.source === "result" ? `${s.rootPath}/chats/${a.id}/outputs/${String(E.name || "file")}` : `${s.rootPath}/inputs/${String(E.name || "file")}`,
      type: String(E.type || "application/octet-stream"),
      size: Number(E.size || (C == null ? void 0 : C.byteLength) || 0),
      sha256: C ? await qt(C) : "",
      source: E.source === "result" ? "result" : E.source === "omero" ? "omero" : "local",
      state: E.state === "failed" ? "failed" : C ? "ready" : "missing",
      data: C,
      error: E.error,
      annotationId: E.annotationId,
      createdAt: g
    });
  }
  const _ = { project: s, chats: [a], files: m, executions: [], scripts: [] };
  return await Cr(_), await Md(`migration:v2:${l}`, { completedAt: g }), _;
}
async function yh(s) {
  const a = await $d(s);
  let l = await mh(a);
  if (!l) {
    const E = (/* @__PURE__ */ new Date()).toISOString(), C = Ca(crypto.randomUUID());
    l = {
      id: C.projectId,
      contextKey: a,
      rootPath: hh(s),
      name: (s == null ? void 0 : s.name) || "Local workspace",
      objectType: s == null ? void 0 : s.object_type,
      objectId: s == null ? void 0 : s.object_id,
      userId: (s == null ? void 0 : s.user_id) || 0,
      groupId: (s == null ? void 0 : s.group_id) || 0,
      activeChatId: C.id,
      plotCsv: !0,
      createdAt: E,
      updatedAt: E
    };
    const A = await vh(l, C, a);
    if (A) return A;
    const T = { project: l, chats: [C], files: [], executions: [], scripts: [] };
    return await Cr(T), T;
  }
  const [d, g, m, _] = await Promise.all([
    nr("chats", l.id),
    nr("files", l.id),
    nr("executions", l.id),
    nr("scripts", l.id)
  ]);
  if (!d.length) {
    const E = Ca(l.id);
    l = { ...l, activeChatId: E.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }, await Cr({ project: l, chats: [E], files: g, executions: m, scripts: _ }), d.push(E);
  }
  return { project: l, chats: d, files: g, executions: m, scripts: _ };
}
async function to(s) {
  const a = await $d(s), d = (await cn()).transaction("projects", "readonly");
  return (await no(d.objectStore("projects").getAll())).filter((m) => m.contextKey === a || m.contextKey.startsWith(`${a}:import:`)).sort((m, _) => _.updatedAt.localeCompare(m.updatedAt));
}
async function ms(s) {
  if (!s) return to(null);
  const l = (await cn()).transaction("projects", "readonly");
  return (await no(l.objectStore("projects").getAll())).filter(
    (g) => g.userId === s.user_id && g.groupId === s.group_id
  ).sort((g, m) => `${g.objectType || ""}:${g.objectId || 0}`.localeCompare(
    `${m.objectType || ""}:${m.objectId || 0}`
  ) || m.updatedAt.localeCompare(g.updatedAt));
}
async function pa(s) {
  const l = (await cn()).transaction("projects", "readonly"), d = await no(l.objectStore("projects").get(s));
  if (!d) return;
  const [g, m, _, E] = await Promise.all([
    nr("chats", d.id),
    nr("files", d.id),
    nr("executions", d.id),
    nr("scripts", d.id)
  ]);
  return { project: d, chats: g, files: m, executions: _, scripts: E };
}
async function vs() {
  var a, l;
  const s = await ((l = (a = navigator.storage) == null ? void 0 : a.estimate) == null ? void 0 : l.call(a));
  return { usage: (s == null ? void 0 : s.usage) || 0, quota: (s == null ? void 0 : s.quota) || 0 };
}
const pd = "provider:AmsterdamUMC", hd = {
  apiKey: "",
  model: "",
  contextWindow: 0
}, Ad = "nl.bioimaging.analysis-chat.project", Fd = 1, gh = 1e4, wh = 512 * 1024 * 1024;
function ln(s) {
  return s.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}
function qo(s) {
  return new Uint8Array(ka(s));
}
function xh(s) {
  return { ...s };
}
function md(s, a) {
  const l = {}, d = [], g = s.files.map((C) => {
    const A = { ...C };
    delete A.data;
    const T = C.source === "omero";
    if (C.source === "local" && a)
      return d.push(C.name), A.state = "missing", A.error = "Local input was omitted because the project snapshot exceeded its size limit.", A;
    if (T || !C.data) return A;
    const R = C.source === "local" ? `inputs/local/${ln(C.id)}--${ln(C.name)}` : `chats/${ln(C.chatId || "unassigned")}/outputs/${ln(C.id)}--${ln(C.name)}`;
    return A.archivePath = R, l[R] = new Uint8Array(C.data), A;
  }), m = {
    format: Ad,
    version: Fd,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    project: xh(s.project),
    chats: s.chats,
    executions: s.executions,
    scripts: s.scripts,
    files: g,
    omittedLocalInputs: d
  };
  l["project.json"] = qo(JSON.stringify(m, null, 2));
  for (const C of s.chats)
    l[`chats/${ln(C.id)}/chat.json`] = qo(JSON.stringify(C, null, 2)), l[`chats/${ln(C.id)}/chat.md`] = qo(kh(C));
  for (const C of s.scripts) {
    l[`scripts/${ln(C.id)}/script.json`] = qo(JSON.stringify(C, null, 2));
    for (const A of C.versions)
      l[`scripts/${ln(C.id)}/v${String(A.version).padStart(3, "0")}.py`] = qo(A.code);
  }
  const _ = sh(l, { level: 0 }), E = `${ln(s.project.rootPath.split("/").at(-1) || "analysis-project")}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.oac.zip`;
  return { data: _, filename: E, omittedLocalInputs: d, manifest: m };
}
function Sh(s, a) {
  const l = md(s, !1);
  if (l.data.byteLength <= a) return l;
  const d = md(s, !0);
  if (d.data.byteLength > a)
    throw new Error(
      `Chats, scripts, and generated outputs require ${(d.data.byteLength / 1024 / 1024).toFixed(1)} MiB, exceeding the ${(a / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  return d;
}
function kh(s) {
  const a = [`# ${s.title}`, "", `Updated: ${s.updatedAt}`, ""];
  s.summary && a.push("## Conversation summary", "", s.summary, "");
  for (const l of s.messages)
    l.kind !== "execution" && a.push(`## ${l.role === "user" ? "User" : "Assistant"}`, "", l.content, "");
  return a.join(`
`);
}
function vd(s) {
  if (!s || s.startsWith("/") || s.startsWith("\\") || s.split(/[\\/]/).includes(".."))
    throw new Error(`Unsafe project archive path: ${s}`);
}
function Ea(s) {
  return !s || typeof s != "object" ? !1 : Array.isArray(s) ? s.some(Ea) : Object.entries(s).some(([a, l]) => {
    const d = a.toLowerCase().replace(/[^a-z0-9]/g, "");
    return d === "apikey" || d === "azurekey" || d === "credential" || Ea(l);
  });
}
async function ha(s) {
  var ke;
  const a = lh(new Uint8Array(s)), l = Object.keys(a);
  if (l.length > gh) throw new Error("Project archive contains too many entries");
  let d = 0;
  for (const B of l)
    if (vd(B), d += a[B].byteLength, d > wh) throw new Error("Project archive exceeds the 512 MiB workspace limit");
  const g = a["project.json"];
  if (!g) throw new Error("Project archive does not contain project.json");
  const m = JSON.parse(Id(g));
  if (m.format !== Ad || m.version !== Fd)
    throw new Error("Unsupported Analysis Chat project format");
  if (Ea(m))
    throw new Error("Project archive unexpectedly contains an API key field");
  const _ = crypto.randomUUID(), E = new Map(m.chats.map((B) => [B.id, crypto.randomUUID()])), C = new Map(m.executions.map((B) => [B.id, crypto.randomUUID()])), A = new Map(m.files.map((B) => [B.id, crypto.randomUUID()])), T = new Map(m.scripts.map((B) => [B.id, crypto.randomUUID()])), N = (/* @__PURE__ */ new Date()).toISOString(), R = m.chats.map((B) => ({
    ...B,
    id: E.get(B.id),
    projectId: _,
    title: `${B.title} (imported)`,
    messages: B.messages.map((te) => ({
      ...te,
      executionId: te.executionId ? C.get(te.executionId) : void 0
    })),
    updatedAt: N
  })), ie = [];
  for (const B of m.files) {
    let te;
    if (B.archivePath) {
      vd(B.archivePath);
      const V = a[B.archivePath];
      if (!V) throw new Error(`Missing archived file: ${B.archivePath}`);
      if (te = V.buffer.slice(V.byteOffset, V.byteOffset + V.byteLength), B.sha256 && await qt(te) !== B.sha256)
        throw new Error(`Hash mismatch for ${B.name}`);
    }
    ie.push({
      ...B,
      id: A.get(B.id),
      projectId: _,
      chatId: B.chatId ? E.get(B.chatId) : void 0,
      executionId: B.executionId ? C.get(B.executionId) : void 0,
      data: te,
      state: te || B.source === "omero" ? B.state : "missing",
      logicalPath: B.logicalPath.replace(m.project.rootPath, `${m.project.rootPath}--imported`)
    });
  }
  const he = m.executions.map((B) => ({
    ...B,
    id: C.get(B.id),
    projectId: _,
    chatId: E.get(B.chatId),
    outputFileIds: B.outputFileIds.map((te) => A.get(te)).filter(Boolean),
    reusedFrom: B.reusedFrom ? C.get(B.reusedFrom) : void 0
  })), G = m.scripts.map((B) => ({
    ...B,
    id: T.get(B.id),
    projectId: _,
    versions: B.versions.map((te) => ({
      ...te,
      executionId: C.get(te.executionId) || ""
    })),
    updatedAt: N
  })), Y = E.get(m.project.activeChatId) || ((ke = R[0]) == null ? void 0 : ke.id);
  if (!Y) throw new Error("Project archive contains no chats");
  return { project: {
    ...m.project,
    id: _,
    contextKey: `${m.project.contextKey}:import:${_}`,
    rootPath: `${m.project.rootPath}--imported`,
    name: `${m.project.name} (imported)`,
    activeChatId: Y,
    createdAt: N,
    updatedAt: N
  }, chats: R, files: ie, executions: he, scripts: G };
}
const jh = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "scipy",
  "duckdb",
  "pyarrow",
  "python-calamine",
  "xlrd"
], yd = "pyodide-314.0.3-oac-0.2";
function Ch(s) {
  const a = JSON.stringify(s.replace(/\/$/, "")), l = JSON.stringify(jh);
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
  await pyodide.loadPackage(${l});
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
function Eh(s) {
  const a = new URL(s).origin, l = JSON.stringify(Ch(s));
  return `<!doctype html><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${a}; connect-src ${a}; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:">
<script>
const source = ${l};
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
class _h {
  constructor(a) {
    sn(this, "frame", null);
    sn(this, "pending", /* @__PURE__ */ new Map());
    sn(this, "inputs", []);
    sn(this, "counter", 0);
    sn(this, "readyPromise", null);
    sn(this, "onProgress", null);
    sn(this, "receive", (a) => {
      var g;
      if (a.source !== ((g = this.frame) == null ? void 0 : g.contentWindow)) return;
      const l = a.data;
      if (!l || l.source !== "oac-runtime") return;
      if (l.type === "progress") {
        this.report(l.value);
        return;
      }
      const d = this.pending.get(l.id);
      d && (clearTimeout(d.timer), this.pending.delete(l.id), l.type === "error" ? d.reject(new Error(l.value)) : d.resolve(l.value));
    });
    this.runtimeBase = a, window.addEventListener("message", this.receive);
  }
  async start(a, l) {
    l && (this.onProgress = l), this.inputs = a.filter((m) => m.state === "ready" && m.data), this.destroyFrame(), this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const d = document.createElement("iframe");
    d.hidden = !0, d.setAttribute("sandbox", "allow-scripts"), d.setAttribute("aria-hidden", "true");
    const g = new Promise(
      (m) => d.addEventListener("load", () => m(), { once: !0 })
    );
    return d.srcdoc = Eh(
      new URL(this.runtimeBase, window.location.href).toString()
    ), document.body.append(d), this.frame = d, this.readyPromise = (async () => {
      await g, this.report({ percent: 8, message: "Connecting to the Python worker…" }), await this.request("ping", !0, 12e4);
      for (let m = 0; m < this.inputs.length; m += 1) {
        const _ = this.inputs[m];
        this.report({
          percent: 92 + Math.round(m / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${m + 1} of ${this.inputs.length} data files into Python…`
        });
        const E = _.data.slice(0);
        await this.request("file", { name: _.name, data: E }, 3e4, [E]);
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
  request(a, l, d, g = []) {
    const m = `runtime-${++this.counter}`;
    return new Promise((_, E) => {
      var A, T;
      const C = window.setTimeout(() => {
        this.pending.delete(m), E(new Error(`${a} exceeded ${d / 1e3} seconds`)), a === "run" && this.start(this.inputs);
      }, d);
      this.pending.set(m, { resolve: _, reject: E, timer: C }), (T = (A = this.frame) == null ? void 0 : A.contentWindow) == null || T.postMessage(
        { source: "oac-parent", id: m, type: a, value: l },
        "*",
        g
      );
    });
  }
  report(a) {
    var l;
    (l = this.onProgress) == null || l.call(this, {
      percent: Math.max(0, Math.min(100, Number(a.percent) || 0)),
      message: String(a.message || "Preparing browser Python…")
    });
  }
}
const Ph = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, gd = 256 * 1024 * 1024, wt = () => crypto.randomUUID(), Oe = () => (/* @__PURE__ */ new Date()).toISOString(), wd = (s) => s.toLowerCase().endsWith(".png") ? "image/png" : s.toLowerCase().endsWith(".svg") ? "image/svg+xml" : s.toLowerCase().endsWith(".csv") ? "text/csv" : s.toLowerCase().endsWith(".json") ? "application/json" : "application/octet-stream";
function eo(s) {
  return s.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function Nh(s) {
  const a = s.replace(/\s+/g, " ").trim().slice(0, 64);
  return a ? a.charAt(0).toUpperCase() + a.slice(1) : "New analysis";
}
function Th(s) {
  return JSON.stringify(
    s.map((a) => ({
      path: a.source === "result" ? `/output/${a.name}` : `/input/${a.name}`,
      logical_path: a.logicalPath,
      sha256: a.sha256,
      size: a.size,
      type: a.type,
      state: a.state
    }))
  );
}
function xd(s, a) {
  const l = a.filter((m) => m.source !== "result" && m.state === "ready"), d = [];
  return { code: s.replace(/(["'])\/input\/([^"']+)\1/g, (m, _, E) => {
    var T, N;
    if (l.some((R) => R.name === E)) return m;
    const C = ((N = (T = E.match(/(\.[^.]+)$/)) == null ? void 0 : T[1]) == null ? void 0 : N.toLowerCase()) || "", A = l.filter(
      (R) => C && R.name.toLowerCase().endsWith(C)
    );
    if (A.length !== 1)
      throw new Error(
        A.length ? `Script input ${E} is ambiguous: ${A.map((R) => R.name).join(", ")}` : `Script input ${E} has no compatible file in this project`
      );
    return d.push({ from: E, to: A[0].name }), `${_}/input/${A[0].name}${_}`;
  }), bindings: d };
}
function ma(s) {
  return Math.max(1, Math.ceil(JSON.stringify(s).length / 4));
}
function Rh(s, a) {
  if (!s) return "Context usage appears after the first AI response.";
  const l = s.promptTokens + s.completionTokens, d = s.estimated ? "estimated" : "API reported", g = a > 0 ? ` · ${Math.min(100, Math.round(l / a * 100))}% of ${a.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${s.promptTokens.toLocaleString()} input + ${s.completionTokens.toLocaleString()} output tokens (${d})${g} · session: ${s.sessionTokens.toLocaleString()}`;
}
function Ih(s) {
  return s.filter((a) => a.kind !== "execution").slice(0, -12).map((a) => `${a.role}: ${a.content.replace(/\s+/g, " ").slice(0, 240)}`).join(`
`).slice(-12e3);
}
function ys(s) {
  return s >= 1024 * 1024 * 1024 ? `${(s / 1024 / 1024 / 1024).toFixed(1)} GiB` : s >= 1024 * 1024 ? `${(s / 1024 / 1024).toFixed(1)} MiB` : s >= 1024 ? `${(s / 1024).toFixed(1)} KiB` : `${s} bytes`;
}
function Sd(s) {
  return (s == null ? void 0 : s.files.reduce((a, l) => a + l.size, 0)) || 0;
}
function zh() {
  const s = window.OMERO_ANALYSIS_CHAT, a = Ne.useMemo(() => new Ap(s), [s]), l = Ne.useMemo(() => new _h(s.runtimeBase), [s]), [d, g] = Ne.useState(null), m = Ne.useRef(null), [_, E] = Ne.useState([]), [C, A] = Ne.useState([]), [T, N] = Ne.useState([]), [R, ie] = Ne.useState(hd), [he, G] = Ne.useState(""), [Y, Te] = Ne.useState(!1), [ke, B] = Ne.useState(!1), [te, V] = Ne.useState("Preparing project…"), [je, ge] = Ne.useState(!1), [ne, oe] = Ne.useState(null), [Ie, Le] = Ne.useState(!1), [Ee, De] = Ne.useState(/* @__PURE__ */ new Set()), [Ve, $e] = Ne.useState(!1), [xe, ce] = Ne.useState(""), [$, W] = Ne.useState({
    inputs: !0,
    outputs: !0,
    scripts: !0,
    snapshots: !1
  }), [H, w] = Ne.useState(null), [P, q] = Ne.useState({
    percent: 0,
    message: "Preparing the browser workspace…"
  }), [re, Z] = Ne.useState({ usage: 0, quota: 0 }), ae = Ne.useRef(null), Ce = Ne.useRef(null), ve = Ne.useRef(null), _e = Ne.useRef(null), Ue = Ne.useRef(/* @__PURE__ */ new Set());
  m.current = d;
  const Se = (d == null ? void 0 : d.project) || null, St = (d == null ? void 0 : d.chats) || [], Me = St.find((u) => u.id === (Se == null ? void 0 : Se.activeChatId)) || St[0] || null, Ot = ((d == null ? void 0 : d.files) || []).filter((u) => u.source !== "result"), ro = ((d == null ? void 0 : d.files) || []).filter(
    (u) => u.source === "result" && u.chatId === (Me == null ? void 0 : Me.id)
  ), or = Ot.filter((u) => u.state !== "ready"), Zt = !!Me && ke && or.length === 0 && !!(R.apiKey && R.model) && !Y, oo = Y ? "Analysis in progress — wait for the answer or press Stop…" : or.some((u) => u.state === "failed" || u.state === "missing") ? "Chat is blocked — retry, reselect, or remove the missing data file…" : or.length ? "Downloading selected data — chat will unlock when every file is ready…" : ke ? !R.apiKey || !R.model ? "Configure the AmsterdamUMC deployment and API key before asking a question…" : "Ask a question about the loaded data…" : `${P.message} (${Math.round(P.percent)}%) — please wait…`;
  Ne.useEffect(() => {
    const u = Ce.current;
    if (!u) return;
    const h = requestAnimationFrame(() => {
      u.scrollTo({ top: u.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(h);
  }, [Me == null ? void 0 : Me.messages, d == null ? void 0 : d.executions, d == null ? void 0 : d.files]), Ne.useEffect(() => {
    if (!ne) return;
    const u = () => oe(null), h = (S) => {
      S.key === "Escape" && u();
    };
    return window.addEventListener("click", u), window.addEventListener("blur", u), window.addEventListener("resize", u), window.addEventListener("keydown", h), () => {
      window.removeEventListener("click", u), window.removeEventListener("blur", u), window.removeEventListener("resize", u), window.removeEventListener("keydown", h);
    };
  }, [ne]), Ne.useEffect(() => {
    let u = !0;
    return (async () => {
      var D;
      const [h, S] = await Promise.all([
        Ld(pd),
        yh(s.context)
      ]);
      if (!u) return;
      h && ie({ ...hd, ...h }), await a.connect();
      let M = S;
      const I = (D = s.context) == null ? void 0 : D.selected_project_snapshot;
      if (I) {
        q({ percent: 8, message: "Restoring the selected OMERO project…" });
        const Be = (await to(s.context)).find(
          (ue) => ue.sourceSnapshotAnnotationId === I.annotation_id
        );
        if (Be)
          M = await pa(Be.id) || S;
        else {
          const ue = await ha(
            await a.downloadSnapshot(I)
          );
          if (s.context && (ue.project.objectType !== s.context.object_type || ue.project.objectId !== s.context.object_id))
            throw new Error("The selected project belongs to a different OMERO object");
          ue.project = {
            ...ue.project,
            sourceSnapshotAnnotationId: I.annotation_id,
            updatedAt: Oe()
          }, await Cr(ue), M = ue;
        }
      }
      let U = await Pn(M);
      u && (g(U), m.current = U, E(await to(s.context)), A(await ms(s.context)), N(await a.listSnapshots()), await dn(U.files), u && (B(!0), q({ percent: 100, message: "Browser Python is ready" }), V("Ready — analysis runs locally in this browser"), Z(await vs())));
    })().catch((h) => {
      u && (V(`Project failed: ${String(h)}`), q({ percent: 0, message: `Project failed: ${String(h)}` }));
    }), () => {
      u = !1, l.dispose();
    };
  }, [s, a, l]);
  async function Pn(u) {
    var U;
    let h = u;
    const S = new Map(
      h.files.filter((D) => D.annotationId).map((D) => [D.annotationId, D])
    ), M = ((U = s.context) == null ? void 0 : U.selected_attachments) || [];
    for (const D of M) {
      if (S.has(D.annotation_id)) continue;
      const de = {
        id: wt(),
        projectId: h.project.id,
        name: D.name,
        logicalPath: `${h.project.rootPath}/inputs/${D.annotation_id}--${D.name}`,
        type: D.mimetype,
        size: D.size,
        sha256: "",
        source: "omero",
        state: "loading",
        annotationId: D.annotation_id,
        fileId: D.file_id,
        createdAt: Oe()
      };
      h = { ...h, files: [...h.files, de] }, S.set(D.annotation_id, de);
    }
    const I = h.files.filter(
      (D) => D.source === "omero" && D.annotationId && (!D.data || D.state !== "ready")
    );
    for (let D = 0; D < I.length; D += 1) {
      const de = I[D];
      q({
        percent: Math.round(D / Math.max(1, I.length) * 90),
        message: `Downloading ${D + 1} of ${I.length} OMERO inputs…`
      });
      try {
        const Be = {
          annotation_id: de.annotationId,
          file_id: de.fileId || 0,
          name: de.name,
          mimetype: de.type,
          size: de.size,
          kind: "attachment",
          supported: !0
        }, ue = await a.download(Be), me = await qt(ue);
        if (de.sha256 && de.sha256 !== me)
          throw new Error(
            `OMERO input ${de.name} no longer matches the snapshot hash`
          );
        const Ae = {
          ...de,
          data: ue,
          size: ue.byteLength,
          sha256: me,
          state: "ready",
          error: void 0
        };
        h = {
          ...h,
          files: h.files.map((Pe) => Pe.id === de.id ? Ae : Pe)
        }, await ps(Ae);
      } catch (Be) {
        const ue = { ...de, state: "failed", error: String(Be) };
        h = {
          ...h,
          files: h.files.map((me) => me.id === de.id ? ue : me)
        }, await ps(ue);
      }
    }
    return await Cr(h), h;
  }
  function ir(u) {
    q(u), V(u.message);
  }
  async function dn(u) {
    B(!1), q({ percent: 1, message: "Starting browser Python…" }), await l.start(
      u.filter((h) => h.source !== "result" && h.state === "ready"),
      ir
    );
  }
  async function kt(u, h) {
    await dn(u), B(!0), q({ percent: 100, message: "Browser Python is ready" }), V(h);
  }
  function Er(u) {
    const h = m.current;
    if (h) {
      const S = { ...h, project: u };
      m.current = S, g(S);
    }
    fd(u);
  }
  function Nn(u) {
    const h = m.current;
    if (h) {
      const S = {
        ...h,
        chats: h.chats.map((M) => M.id === u.id ? u : M)
      };
      m.current = S, g(S);
    }
    fa(u);
  }
  function fn(u, h) {
    const S = m.current;
    if (!S) return;
    const M = S.chats.find((D) => D.id === u);
    if (!M) return;
    const I = { ...M, messages: [...M.messages, h], updatedAt: Oe() }, U = {
      ...S,
      chats: S.chats.map((D) => D.id === u ? I : D)
    };
    m.current = U, g(U), fa(I);
  }
  function Tn(u) {
    const h = m.current;
    if (!h) return;
    const S = h.executions.some((I) => I.id === u.id), M = {
      ...h,
      executions: S ? h.executions.map((I) => I.id === u.id ? u : I) : [...h.executions, u]
    };
    m.current = M, g(M), ch(u);
  }
  function bt(u) {
    if (!u.length) return;
    const h = m.current;
    if (!h) return;
    const S = new Set(u.map((I) => I.id)), M = {
      ...h,
      files: [...h.files.filter((I) => !S.has(I.id)), ...u]
    };
    m.current = M, g(M), u.forEach((I) => void ps(I));
  }
  async function pn(u) {
    ie(u), await Md(pd, u);
  }
  async function ei(u) {
    if (!u || !d) return;
    const h = [];
    let S = Sd(d);
    for (const I of Array.from(u)) {
      if (!Ph.test(I.name)) {
        V(`${I.name} is not a supported tabular data file`);
        continue;
      }
      if (I.size > sd) {
        V(`${I.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (S += I.size, S > Mp) {
        V("The project would exceed 512 MiB");
        break;
      }
      const U = await I.arrayBuffer(), D = await qt(U);
      if ([...d.files, ...h].some(
        (de) => de.sha256 === D && de.size === U.byteLength
      )) {
        V(`${I.name} matches a file already stored in this project`);
        continue;
      }
      h.push({
        id: wt(),
        projectId: d.project.id,
        name: I.name,
        logicalPath: `${d.project.rootPath}/inputs/${I.name}`,
        type: I.type || wd(I.name),
        size: U.byteLength,
        sha256: D,
        source: "local",
        state: "ready",
        data: U,
        createdAt: Oe()
      });
    }
    const M = [...d.files, ...h];
    bt(h), await kt(M, "Local inputs added; browser Python is ready"), Z(await vs());
  }
  async function Rn(u) {
    if (!d) return;
    const h = d.files.find((I) => I.id === u);
    if (!h) return;
    const S = d.files.filter((I) => I.id !== u), M = { ...d, files: S };
    m.current = M, g(M), await dh(u), h.source !== "result" && await kt(S, "Input removed; browser Python was reset"), Z(await vs());
  }
  async function sr(u) {
    if (!d) return;
    const h = d.files.find((M) => M.id === u);
    if (!(h != null && h.annotationId)) return;
    const S = { ...h, state: "loading", error: void 0 };
    bt([S]);
    try {
      const M = await a.download({
        annotation_id: h.annotationId,
        file_id: h.fileId || 0,
        name: h.name,
        mimetype: h.type,
        size: h.size,
        kind: "attachment",
        supported: !0
      }), I = {
        ...h,
        data: M,
        size: M.byteLength,
        sha256: await qt(M),
        state: "ready",
        error: void 0
      }, U = d.files.map((D) => D.id === h.id ? I : D);
      bt([I]), await kt(U, "OMERO input restored; project ready");
    } catch (M) {
      bt([{ ...h, state: "failed", error: String(M) }]);
    }
  }
  async function _r() {
    if (!d) return;
    const u = Ca(d.project.id), h = { ...d.project, activeChatId: u.id, updatedAt: Oe() }, S = { ...d, project: h, chats: [...d.chats, u] };
    m.current = S, g(S), await Promise.all([fa(u), fd(h)]), w(null), Ue.current.clear(), await l.beginTurn();
  }
  function ti(u) {
    if (!d) return;
    const h = d.chats.find((M) => M.id === u);
    h != null && h.archived && Nn({ ...h, archived: !1, updatedAt: Oe() });
    const S = { ...d.project, activeChatId: u, updatedAt: Oe() };
    Er(S), w(null);
  }
  function lr(u) {
    var S;
    const h = (S = window.prompt("Chat name", u.title)) == null ? void 0 : S.trim();
    h && Nn({ ...u, title: h.slice(0, 100), updatedAt: Oe() });
  }
  function ut(u, h, S) {
    u.preventDefault(), u.stopPropagation();
    const M = 210, I = Math.max(60, S.length * 34 + 34);
    oe({
      x: Math.min(u.clientX, window.innerWidth - M - 8),
      y: Math.min(u.clientY, window.innerHeight - I - 8),
      title: h,
      actions: S
    });
  }
  async function ar() {
    Se && (oe(null), E(await to(s.context)), A(await ms(s.context)), await In(Se.id));
  }
  async function Pr(u) {
    var Pe, be;
    if (u.source === "omero") {
      V("OMERO attachment names are canonical and cannot be renamed locally");
      return;
    }
    const h = (Pe = window.prompt("File name", u.name)) == null ? void 0 : Pe.trim();
    if (!h || h === u.name) return;
    let S = h.replace(/[\\/]/g, "_").slice(0, 180);
    if (!S || S === "." || S === "..") return;
    const M = ((be = u.name.match(/(\.[^.]+)$/)) == null ? void 0 : be[1]) || "";
    if (M && !S.toLowerCase().endsWith(M.toLowerCase())) {
      if (/\.[^.]+$/.test(S)) {
        V(`Keep the ${M} extension when renaming ${u.name}`);
        return;
      }
      S += M;
    }
    const I = m.current;
    if (!I) return;
    if (I.files.filter(
      (ye) => ye.id !== u.id && ye.source === u.source && ye.chatId === u.chatId
    ).some((ye) => ye.name.toLowerCase() === S.toLowerCase())) {
      V(`A file named ${S} already exists in this folder`);
      return;
    }
    const D = u.name.replace(/\.[^.]+$/, ""), de = S.replace(/\.[^.]+$/, ""), Be = u.source === "result" && /\.(png|svg|csv)$/i.test(u.name) ? /* @__PURE__ */ new Set(["png", "svg", "csv"]) : null, ue = I.files.map((ye) => {
      var fe;
      let ee = ye.id === u.id ? S : null;
      return !ee && Be && ye.chatId === u.chatId && ye.executionId === u.executionId && ye.name.replace(/\.[^.]+$/, "") === D && Be.has(((fe = ye.name.split(".").at(-1)) == null ? void 0 : fe.toLowerCase()) || "") && (ee = `${de}.${ye.name.split(".").at(-1)}`), ee ? {
        ...ye,
        name: ee,
        logicalPath: ye.logicalPath.replace(/[^/]+$/, ee)
      } : ye;
    }), me = ue.filter((ye, ee) => ye !== I.files[ee]), Ae = { ...I, files: ue };
    m.current = Ae, g(Ae), await Promise.all(me.map(ps)), u.source === "local" ? await kt(ue, `Renamed input to ${S}; browser Python is ready`) : V(
      me.length > 1 ? `Renamed ${u.name} and its paired plot data` : `Renamed ${u.name} to ${S}`
    );
  }
  function Nr(u) {
    if (!d || d.chats.filter((M) => !M.archived).length <= 1) {
      V("Create another chat before archiving this one");
      return;
    }
    const h = { ...u, archived: !0, updatedAt: Oe() }, S = d.chats.find((M) => M.id !== u.id && !M.archived);
    Nn(h), Er({ ...d.project, activeChatId: S.id, updatedAt: Oe() });
  }
  async function In(u) {
    const h = await pa(u);
    if (!h) return;
    const S = await Pn(h);
    g(S), m.current = S, Le(!1), De(/* @__PURE__ */ new Set()), await kt(S.files, "Project loaded");
  }
  async function zn(u, h, S, M = !1) {
    const I = m.current;
    if (!I) return Vt("Project is not ready");
    const U = u.replace(/\r\n/g, `
`).trimEnd(), D = await qt(U), de = I.files.filter((ee) => ee.source !== "result" && ee.state === "ready").map((ee) => ee.sha256).sort(), Be = await qt(
      `${D}|${de.join(",")}|${yd}|plotCsv=${I.project.plotCsv}`
    ), ue = I.executions.filter((ee) => ee.cacheKey === Be && ee.status !== "running").sort((ee, fe) => fe.createdAt.localeCompare(ee.createdAt))[0];
    if (ue && !M) {
      const ee = {
        ...ue,
        id: wt(),
        chatId: h,
        promptId: S,
        status: ue.status === "success" || ue.status === "reused" ? "reused" : "failed",
        reusedFrom: ue.id,
        createdAt: Oe()
      };
      return Tn(ee), fn(h, {
        id: wt(),
        role: "assistant",
        content: ee.status === "reused" ? "Reused a previous successful local Python run because its code and inputs are unchanged." : "Skipped unchanged Python that already failed; AmsterdamUMC must correct the code.",
        kind: "execution",
        executionId: ee.id,
        createdAt: Oe()
      }), ee.status === "reused" ? JSON.stringify({
        reused: !0,
        execution_id: ue.id,
        stdout: ue.stdout,
        stderr: ue.stderr,
        preview: ue.preview,
        generated_files: ue.outputFileIds.map((fe) => I.files.find((tt) => tt.id === fe)).filter(Boolean).map((fe) => ({ name: fe.name, size: fe.size, type: fe.type }))
      }) : Vt(
        `Identical code already failed:
${ue.stderr || ue.stdout}. Modify the code before trying again.`
      );
    }
    const me = {
      id: wt(),
      projectId: I.project.id,
      chatId: h,
      promptId: S,
      code: U,
      codeHash: D,
      cacheKey: Be,
      status: "running",
      stdout: "",
      stderr: "",
      outputFileIds: [],
      missingPlotCsv: [],
      inputHashes: de,
      runtimeVersion: yd,
      model: R.model,
      createdAt: Oe()
    };
    Tn(me), fn(h, {
      id: wt(),
      role: "assistant",
      content: "Python execution",
      kind: "execution",
      executionId: me.id,
      createdAt: Oe()
    });
    let Ae;
    try {
      Ae = await l.run(U);
    } catch (ee) {
      const fe = String(ee instanceof Error ? ee.message : ee).slice(0, gs), tt = { ...me, status: "failed", stderr: fe };
      return Tn(tt), V("Python error sent to AmsterdamUMC; waiting for corrected code…"), Vt(ee);
    }
    const Pe = [];
    for (const ee of Ae.files) {
      const fe = wt();
      Pe.push({
        id: fe,
        projectId: I.project.id,
        chatId: h,
        executionId: me.id,
        name: ee.name,
        logicalPath: `${I.project.rootPath}/chats/${h}/outputs/${me.id}/${ee.name}`,
        type: ee.type,
        size: ee.data.byteLength,
        sha256: await qt(ee.data),
        source: "result",
        state: "ready",
        data: ee.data,
        createdAt: Oe()
      }), Ue.current.add(ee.name);
    }
    bt(Pe);
    const be = I.project.plotCsv ? Array.from(Ue.current).filter((ee) => /\.(png|svg)$/i.test(ee)).filter((ee) => !Ue.current.has(ee.replace(/\.(png|svg)$/i, ".csv"))) : [], ye = {
      ...me,
      status: be.length ? "incomplete" : "success",
      stdout: Ae.stdout,
      stderr: Ae.stderr,
      preview: Ae.preview,
      outputFileIds: Pe.map((ee) => ee.id),
      missingPlotCsv: be
    };
    if (Tn(ye), !be.length) {
      const ee = m.current;
      for (const fe of (ee == null ? void 0 : ee.executions) || []) {
        if (fe.chatId !== h || fe.promptId !== S || !fe.missingPlotCsv.length) continue;
        const tt = fe.missingPlotCsv.filter(
          (en) => !Ue.current.has(en.replace(/\.(png|svg)$/i, ".csv"))
        );
        tt.length !== fe.missingPlotCsv.length && Tn({
          ...fe,
          status: tt.length ? "incomplete" : "success",
          missingPlotCsv: tt
        });
      }
    }
    return V("Python completed locally; continuing the analysis…"), be.length ? Vt(
      `Plot data CSV required. Create ${be.map((ee) => ee.replace(/\.(png|svg)$/i, ".csv")).join(", ")} containing the data used for the plot. Do not regenerate unrelated analysis.`
    ) : Dp(Ae);
  }
  async function Ln(u, h, S) {
    let M = {};
    try {
      M = JSON.parse(u.function.arguments || "{}");
    } catch (U) {
      return Vt(`Invalid JSON tool arguments: ${String(U)}`);
    }
    const I = m.current;
    if (!I) return Vt("Project is not ready");
    if (u.function.name === "list_workspace_files") return Th(I.files);
    if (u.function.name === "reset_python")
      try {
        return await l.beginTurn(), Ue.current.clear(), "Python state reset; canonical project inputs remain available.";
      } catch (U) {
        return Vt(U);
      }
    if (u.function.name === "list_saved_scripts")
      return JSON.stringify(I.scripts.map((U) => ({
        id: U.id,
        name: U.name,
        description: U.description,
        current_version: U.currentVersion,
        updated_at: U.updatedAt
      })));
    if (u.function.name === "read_saved_script") {
      const U = I.scripts.find((de) => de.id === M.script_id);
      if (!U) return Vt("Saved script was not found");
      const D = U.versions.find((de) => de.version === U.currentVersion);
      return D ? JSON.stringify({ id: U.id, name: U.name, version: D.version, code: D.code }) : Vt("Saved script has no readable current version");
    }
    if (u.function.name === "run_saved_script") {
      const U = I.scripts.find((de) => de.id === M.script_id), D = U == null ? void 0 : U.versions.find((de) => de.version === U.currentVersion);
      if (!D) return Vt("Saved script was not found");
      try {
        const de = xd(D.code, I.files);
        return zn(de.code, h, S);
      } catch (de) {
        return Vt(de);
      }
    }
    return u.function.name !== "run_python" || typeof M.code != "string" ? Vt(`Unsupported or invalid tool call: ${u.function.name}`) : zn(M.code, h, S);
  }
  async function hn() {
    var Ae, Pe, be, ye, ee, fe, tt, en;
    const u = he.trim(), h = m.current, S = h == null ? void 0 : h.chats.find((rt) => rt.id === h.project.activeChatId);
    if (!u || !Zt || !h || !S) return;
    G(""), Te(!0), ae.current = new AbortController(), Ue.current.clear(), await l.beginTurn();
    const M = wt(), I = {
      id: M,
      role: "user",
      content: u,
      createdAt: Oe()
    };
    fn(S.id, I);
    let U = {
      ...S,
      messages: [...S.messages, I],
      updatedAt: Oe()
    };
    S.messages.filter((rt) => rt.role === "user").length === 0 && (U = { ...U, title: Nh(u) }, Nn(U));
    const D = R.contextWindow > 0 ? Math.floor(R.contextWindow * 0.6) : 24e3, de = U.messages.filter((rt) => rt.kind !== "execution");
    ma(de) > D && (U = { ...U, summary: Ih(de), updatedAt: Oe() }, Nn(U));
    const Be = `${Op}

Project root: ${h.project.rootPath}
The user has ${h.scripts.length} saved scripts. ${h.project.plotCsv ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data." : "Plot CSV mode is OFF."}`, ue = de.slice(-12), me = [
      { role: "system", content: Be },
      ...U.summary ? [{ role: "system", content: `Earlier conversation summary:
${U.summary}` }] : [],
      ...ue.map((rt) => ({ role: rt.role, content: rt.content }))
    ];
    ((Ae = me.at(-1)) == null ? void 0 : Ae.content) !== u && me.push({ role: "user", content: u });
    try {
      for (let rt = 0; rt < 8; rt += 1) {
        const Cs = ma(me), dr = await Fp(R, me, ae.current.signal), Tt = (Pe = dr.choices[0]) == null ? void 0 : Pe.message;
        if (!Tt) throw new Error("AmsterdamUMC returned no response");
        const ho = ((be = dr.usage) == null ? void 0 : be.prompt_tokens) ?? Cs, Ir = ((ye = dr.usage) == null ? void 0 : ye.completion_tokens) ?? ma(Tt.content || Tt.tool_calls || ""), Mn = ((ee = dr.usage) == null ? void 0 : ee.total_tokens) ?? ho + Ir;
        if (w((On) => ({
          promptTokens: ho,
          completionTokens: Ir,
          totalTokens: Mn,
          sessionTokens: ((On == null ? void 0 : On.sessionTokens) || 0) + Mn,
          estimated: !dr.usage
        })), me.push({ role: "assistant", content: Tt.content, tool_calls: Tt.tool_calls }), Tt.content && fn(S.id, {
          id: wt(),
          role: "assistant",
          content: Tt.content,
          createdAt: Oe()
        }), !((fe = Tt.tool_calls) != null && fe.length)) break;
        for (const On of Tt.tool_calls) {
          const mo = await Ln(On, S.id, M);
          me.push({ role: "tool", tool_call_id: On.id, content: mo });
        }
        if (rt === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (rt) {
      (tt = ae.current) != null && tt.signal.aborted || fn(S.id, {
        id: wt(),
        role: "assistant",
        content: String(rt),
        kind: "error",
        createdAt: Oe()
      });
    } finally {
      (en = ae.current) != null && en.signal.aborted || V("Ready — analysis runs locally in this browser"), ae.current = null, Te(!1), Z(await vs());
    }
  }
  function ni() {
    var u, h;
    (u = ae.current) == null || u.abort(), l.stop(), Te(!1), kt(((h = m.current) == null ? void 0 : h.files) || [], "Ready — analysis runs locally in this browser");
  }
  async function ri(u) {
    var ye, ee;
    const h = m.current;
    if (!h || !["success", "reused"].includes(u.status)) return;
    const S = h.chats.find((fe) => fe.id === u.chatId), M = S == null ? void 0 : S.messages.find((fe) => fe.id === u.promptId), I = h.executions.filter(
      (fe) => fe.chatId === u.chatId && fe.promptId === u.promptId && ["success", "incomplete"].includes(fe.status)
    ).sort((fe, tt) => fe.createdAt.localeCompare(tt.createdAt)), U = Array.from(new Set(I.map((fe) => fe.code))).join(
      `

# Continued analysis / automatic repair
`
    ) || u.code, D = await qt(U), de = `${eo((M == null ? void 0 : M.content) || "analysis-script")}.py`, Be = (ye = window.prompt("Script filename", de)) == null ? void 0 : ye.trim();
    if (!Be) return;
    const ue = `${eo(Be.replace(/\.py$/i, ""))}.py`, me = ((ee = window.prompt(
      "Script description",
      (M == null ? void 0 : M.content.slice(0, 180)) || "Reusable Analysis Chat workflow"
    )) == null ? void 0 : ee.trim()) || "", Ae = h.scripts.find((fe) => fe.name.toLowerCase() === ue.toLowerCase()), Pe = Ae ? {
      ...Ae,
      description: me,
      currentVersion: Ae.currentVersion + 1,
      versions: [...Ae.versions, {
        version: Ae.currentVersion + 1,
        code: U,
        codeHash: D,
        executionId: u.id,
        createdAt: Oe()
      }],
      updatedAt: Oe()
    } : {
      id: wt(),
      projectId: h.project.id,
      name: ue,
      description: me,
      currentVersion: 1,
      versions: [{
        version: 1,
        code: U,
        codeHash: D,
        executionId: u.id,
        createdAt: Oe()
      }],
      createdAt: Oe(),
      updatedAt: Oe()
    }, be = m.current;
    if (be) {
      const fe = {
        ...be,
        scripts: Ae ? be.scripts.map((tt) => tt.id === Pe.id ? Pe : tt) : [...be.scripts, Pe]
      };
      m.current = fe, g(fe);
    }
    await hs(Pe), V(`Saved ${Pe.name} version ${Pe.currentVersion}`);
  }
  async function io(u) {
    const h = m.current;
    if (!(h != null && h.project.activeChatId)) return;
    const S = u.versions.find((U) => U.version === u.currentVersion);
    if (!S) return;
    let M;
    try {
      M = xd(S.code, h.files);
    } catch (U) {
      V(`Cannot bind ${u.name}: ${String(U)}`);
      return;
    }
    Te(!0), Ue.current.clear(), await l.beginTurn();
    const I = wt();
    fn(h.project.activeChatId, {
      id: I,
      role: "user",
      content: `Run saved script ${u.name} version ${u.currentVersion}` + (M.bindings.length ? ` with project input binding ${M.bindings.map((U) => `${U.from} → ${U.to}`).join(", ")}` : ""),
      createdAt: Oe()
    });
    try {
      await zn(M.code, h.project.activeChatId, I, !0), V(`Ran ${u.name} locally`);
    } finally {
      Te(!1);
    }
  }
  function oi(u) {
    var I;
    const h = (I = window.prompt("Script filename", u.name)) == null ? void 0 : I.trim();
    if (!h) return;
    const S = { ...u, name: `${eo(h.replace(/\.py$/i, ""))}.py`, updatedAt: Oe() }, M = m.current;
    if (M) {
      const U = {
        ...M,
        scripts: M.scripts.map((D) => D.id === u.id ? S : D)
      };
      m.current = U, g(U);
    }
    hs(S);
  }
  async function ii(u) {
    if (!window.confirm(`Delete saved script ${u.name}? Its versions will be removed from this browser project.`))
      return;
    const h = m.current;
    if (!h) return;
    const S = {
      ...h,
      scripts: h.scripts.filter((M) => M.id !== u.id)
    };
    m.current = S, g(S), De((M) => {
      const I = new Set(M);
      return I.delete(u.id), I;
    }), await fh(u.id), V(`Deleted script ${u.name}`);
  }
  function so(u) {
    De((h) => {
      const S = new Set(h);
      return S.has(u) ? S.delete(u) : S.add(u), S;
    });
  }
  async function lo() {
    var Pe, be;
    const u = m.current;
    if (!u) return;
    const h = u.scripts.filter((ye) => Ee.has(ye.id));
    if (h.length < 2) {
      V("Select at least two scripts to combine");
      return;
    }
    const S = `${eo(h.map((ye) => ye.name.replace(/\.py$/i, "")).join("-"))}.py`, M = (Pe = window.prompt("Combined script filename", S)) == null ? void 0 : Pe.trim();
    if (!M) return;
    const I = eo(M.replace(/\.py$/i, ""));
    let U = `${I}.py`, D = 2;
    for (; u.scripts.some((ye) => ye.name.toLowerCase() === U.toLowerCase()); )
      U = `${I}-${D}.py`, D += 1;
    const de = ((be = window.prompt(
      "Combined script description",
      `Runs ${h.map((ye) => ye.name).join(", ")} in sequence`
    )) == null ? void 0 : be.trim()) || "", Be = h.map((ye) => {
      const ee = ye.versions.find((fe) => fe.version === ye.currentVersion);
      return [
        `# --- ${ye.name} v${ye.currentVersion} ---`,
        (ee == null ? void 0 : ee.code) || ""
      ].join(`
`);
    }).join(`

`), ue = Oe(), me = {
      id: wt(),
      projectId: u.project.id,
      name: U,
      description: de,
      currentVersion: 1,
      versions: [{
        version: 1,
        code: Be,
        codeHash: await qt(Be),
        executionId: "",
        createdAt: ue
      }],
      createdAt: ue,
      updatedAt: ue
    }, Ae = { ...u, scripts: [...u.scripts, me] };
    m.current = Ae, g(Ae), De(/* @__PURE__ */ new Set([me.id])), await hs(me), V(`Combined ${h.length} scripts as ${me.name}`);
  }
  function mn(u) {
    const h = u || Array.from(Ee);
    if (!h.length) {
      V("Select one or more scripts to copy");
      return;
    }
    De(new Set(h));
    const S = C.find((M) => M.id !== (Se == null ? void 0 : Se.id));
    if (!S) {
      V("Open another OMERO Dataset, Screen, Plate, or Image once before copying scripts to it");
      return;
    }
    ce(S.id), $e(!0);
  }
  async function ao() {
    const u = m.current;
    if (!u || !xe) return;
    const h = await pa(xe);
    if (!h) {
      V("The destination project is no longer available");
      return;
    }
    const S = u.scripts.filter((D) => Ee.has(D.id));
    if (!S.length) return;
    const M = new Set(h.scripts.map((D) => D.name.toLowerCase())), I = [];
    for (const D of S) {
      const de = D.name.replace(/\.py$/i, "");
      let Be = D.name, ue = 2;
      for (; M.has(Be.toLowerCase()); )
        Be = `${de}-copy-${ue}.py`, ue += 1;
      M.add(Be.toLowerCase());
      const me = Oe();
      I.push({
        ...D,
        id: wt(),
        projectId: h.project.id,
        name: Be,
        description: `${D.description}${D.description ? " · " : ""}Copied from ${u.project.name}`,
        versions: D.versions.map((Ae) => ({
          ...Ae,
          executionId: ""
        })),
        createdAt: me,
        updatedAt: me
      });
    }
    if (await Promise.all(I.map(hs)), h.project.id === u.project.id) {
      const D = { ...u, scripts: [...u.scripts, ...I] };
      m.current = D, g(D);
    }
    $e(!1);
    const U = C.find((D) => D.id === h.project.id);
    V(
      `Copied ${I.length} script${I.length === 1 ? "" : "s"} to ${(U == null ? void 0 : U.name) || "the destination project"}. When run there, the scripts use that project's current inputs.`
    );
  }
  function vn(u, h, S) {
    const M = (h instanceof Uint8Array, h), I = URL.createObjectURL(new Blob([M], { type: S })), U = document.createElement("a");
    U.href = I, U.download = u, U.click(), setTimeout(() => URL.revokeObjectURL(I), 1e3);
  }
  function si(u) {
    u.data && vn(u.name, u.data, u.type);
  }
  function ur(u) {
    const h = u.versions.find((S) => S.version === u.currentVersion);
    h && vn(u.name, new TextEncoder().encode(h.code), "text/x-python");
  }
  async function Tr(u) {
    if (confirm(`Attach ${u.name} to the selected OMERO object?`))
      try {
        const h = await a.attach(u);
        V(`Attached ${h.name} as FileAnnotation ${h.annotation_id}`);
      } catch (h) {
        V(`Attach failed: ${String(h)}`);
      }
  }
  async function cr() {
    var h;
    const u = m.current;
    if (!u) throw new Error("Project is not ready");
    return Sh(
      u,
      ((h = s.context) == null ? void 0 : h.max_snapshot_bytes) ?? gd
    );
  }
  async function uo() {
    try {
      const u = await cr();
      vn(u.filename, u.data, "application/zip"), V(
        u.omittedLocalInputs.length ? `Project downloaded; omitted local inputs: ${u.omittedLocalInputs.join(", ")}` : "Complete project downloaded"
      );
    } catch (u) {
      V(`Project export failed: ${String(u)}`);
    }
  }
  async function ks() {
    if (a.canUpload)
      try {
        const u = await cr();
        if (u.omittedLocalInputs.length && !confirm(
          `The snapshot is too large to include these local inputs:
${u.omittedLocalInputs.join(`
`)}

Save the snapshot without them?`
        )) return;
        const h = await a.uploadSnapshot(u.filename, u.data);
        N((S) => [...S, h]), V(`Saved project snapshot as FileAnnotation ${h.annotation_id}`);
      } catch (u) {
        V(`OMERO project snapshot failed: ${String(u)}`);
      }
  }
  async function js(u) {
    var h;
    if (u)
      try {
        const S = ((h = s.context) == null ? void 0 : h.max_snapshot_bytes) ?? gd;
        if (u.size > S)
          throw new Error(
            `Project archive exceeds the configured ${Math.floor(S / 1024 / 1024)} MiB limit`
          );
        const M = await ha(await u.arrayBuffer());
        if (s.context && (M.project.objectType !== s.context.object_type || M.project.objectId !== s.context.object_id))
          throw new Error("Project snapshot belongs to a different OMERO object");
        await Cr(M);
        const I = await Pn(M);
        g(I), m.current = I, E(await to(s.context)), A(await ms(s.context)), await kt(I.files, "Imported project restored");
      } catch (S) {
        V(`Project import failed: ${String(S)}`);
      } finally {
        ve.current && (ve.current.value = "");
      }
  }
  async function li(u) {
    try {
      V(`Downloading ${u.name}…`);
      const h = await ha(await a.downloadSnapshot(u));
      if (s.context && (h.project.objectType !== s.context.object_type || h.project.objectId !== s.context.object_id))
        throw new Error("Project snapshot belongs to a different OMERO object");
      await Cr(h);
      const S = await Pn(h);
      g(S), m.current = S, E(await to(s.context)), A(await ms(s.context)), await kt(S.files, "OMERO project snapshot restored");
    } catch (h) {
      V(`Snapshot restore failed: ${String(h)}`);
    }
  }
  function yn() {
    Se && Er({ ...Se, plotCsv: !Se.plotCsv, updatedAt: Oe() });
  }
  function co(u) {
    const h = [];
    return u.source === "local" && h.push({ label: "Rename", run: () => void Pr(u) }), (u.state === "failed" || u.state === "missing") && u.annotationId && h.push({ label: "Retry download", run: () => void sr(u.id) }), u.state === "missing" && u.source === "local" && h.push({
      label: "Reselect file",
      run: () => {
        var S;
        return (S = document.getElementById(`reselect-${u.id}`)) == null ? void 0 : S.click();
      }
    }), h.push({
      label: "Remove from project",
      danger: !0,
      run: () => void Rn(u.id)
    }), h;
  }
  function fo(u) {
    return [
      { label: "Rename", run: () => void Pr(u) },
      { label: "Download", run: () => si(u) },
      ...a.canUpload ? [{ label: "Attach to OMERO", run: () => void Tr(u) }] : [],
      {
        label: "Delete output",
        danger: !0,
        run: () => {
          window.confirm(`Delete generated output ${u.name} from this browser project?`) && Rn(u.id);
        }
      }
    ];
  }
  function ai(u) {
    return [
      { label: "Run", run: () => void io(u) },
      { label: "Rename", run: () => oi(u) },
      { label: "Download", run: () => ur(u) },
      { label: "Copy to another project…", run: () => mn([u.id]) },
      { label: "Delete script", danger: !0, run: () => void ii(u) }
    ];
  }
  function po(u) {
    return [{
      label: "Resume as new project",
      run: () => void li(u)
    }];
  }
  if (!d || !Se || !Me)
    return /* @__PURE__ */ f.jsx("main", { className: "app-shell", children: /* @__PURE__ */ f.jsx("div", { className: "boot-message", children: te }) });
  const Rr = re.quota ? Math.round(re.usage / re.quota * 100) : 0;
  return /* @__PURE__ */ f.jsxs("main", { className: "app-shell", children: [
    /* @__PURE__ */ f.jsxs("header", { className: "project-header", children: [
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("h1", { children: "OMERO.AnalysisChat" }),
        /* @__PURE__ */ f.jsx("p", { children: Se.rootPath })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ f.jsxs("label", { className: "csv-toggle", title: "Require a matching CSV for every generated plot", children: [
          /* @__PURE__ */ f.jsx("input", { type: "checkbox", checked: Se.plotCsv, onChange: yn }),
          "Plot + CSV"
        ] }),
        /* @__PURE__ */ f.jsx("span", { className: "privacy-badge", children: "Source data stay in this browser" }),
        /* @__PURE__ */ f.jsx("button", { onClick: () => ge(!je), children: "AI settings" })
      ] })
    ] }),
    je && /* @__PURE__ */ f.jsxs("section", { className: "settings-card", children: [
      /* @__PURE__ */ f.jsx("h2", { children: "AmsterdamUMC" }),
      /* @__PURE__ */ f.jsx("p", { className: "warning", children: "The API key is stored unencrypted in this browser profile. It is never included in project snapshots." }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ f.jsx("input", { value: R.model, onChange: (u) => void pn({ ...R, model: u.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ f.jsx("input", { type: "password", value: R.apiKey, onChange: (u) => void pn({ ...R, apiKey: u.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Model context window (optional)",
        /* @__PURE__ */ f.jsx("input", { type: "number", min: "0", value: R.contextWindow || "", onChange: (u) => void pn({ ...R, contextWindow: Math.max(0, Number(u.target.value) || 0) }) })
      ] }),
      /* @__PURE__ */ f.jsx("p", { children: "Temperature is fixed at 1." }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => void pn({ ...R, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ f.jsxs("div", { className: "project-toolbar", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "active-project-label", children: [
        /* @__PURE__ */ f.jsx("span", { children: "Project" }),
        /* @__PURE__ */ f.jsx("strong", { children: Se.name })
      ] }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Chat",
        /* @__PURE__ */ f.jsxs("select", { value: Me.id, onChange: (u) => ti(u.target.value), children: [
          /* @__PURE__ */ f.jsx("optgroup", { label: "Active chats", children: St.filter((u) => !u.archived).map((u) => /* @__PURE__ */ f.jsx("option", { value: u.id, children: u.title }, u.id)) }),
          St.some((u) => u.archived) && /* @__PURE__ */ f.jsx("optgroup", { label: "Archived chats", children: St.filter((u) => u.archived).map((u) => /* @__PURE__ */ f.jsxs("option", { value: u.id, children: [
            u.title,
            " (archived)"
          ] }, u.id)) })
        ] })
      ] }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => void _r(), children: "New chat" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => lr(Me), children: "Rename chat" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => Nr(Me), children: "Archive" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => void uo(), children: "Download project ZIP" }),
      /* @__PURE__ */ f.jsx("button", { onClick: () => {
        var u;
        return (u = ve.current) == null ? void 0 : u.click();
      }, children: "Import project ZIP" }),
      /* @__PURE__ */ f.jsx("input", { ref: ve, hidden: !0, type: "file", accept: ".zip,.oac.zip", onChange: (u) => {
        var h;
        return void js(((h = u.target.files) == null ? void 0 : h[0]) || null);
      } }),
      a.canUpload && /* @__PURE__ */ f.jsx("button", { onClick: () => void ks(), children: "Save project to OMERO" })
    ] }),
    Ve && /* @__PURE__ */ f.jsx("div", { className: "dialog-backdrop", role: "presentation", children: /* @__PURE__ */ f.jsxs("section", { className: "script-transfer-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "script-transfer-title", children: [
      /* @__PURE__ */ f.jsx("h2", { id: "script-transfer-title", children: "Copy scripts to another project" }),
      /* @__PURE__ */ f.jsx("p", { children: "The copied scripts keep their code and versions. When run in the destination, they automatically use that project’s current input files." }),
      /* @__PURE__ */ f.jsxs("label", { children: [
        "Destination project",
        /* @__PURE__ */ f.jsx("select", { value: xe, onChange: (u) => ce(u.target.value), children: C.filter((u) => u.id !== Se.id).map((u) => /* @__PURE__ */ f.jsxs("option", { value: u.id, children: [
          u.objectType,
          " ",
          u.objectId,
          " — ",
          u.name
        ] }, u.id)) })
      ] }),
      /* @__PURE__ */ f.jsx("small", { children: "A destination appears after you have opened that OMERO object in Analysis Chat at least once." }),
      /* @__PURE__ */ f.jsxs("div", { className: "dialog-actions", children: [
        /* @__PURE__ */ f.jsx("button", { onClick: () => $e(!1), children: "Cancel" }),
        /* @__PURE__ */ f.jsx("button", { disabled: !xe, onClick: () => void ao(), children: "Copy selected scripts" })
      ] })
    ] }) }),
    /* @__PURE__ */ f.jsxs("div", { className: "workspace", children: [
      /* @__PURE__ */ f.jsxs("aside", { className: "project-tree", children: [
        /* @__PURE__ */ f.jsxs(
          "div",
          {
            className: "file-browser-heading",
            onContextMenu: (u) => ut(u, Se.name, [
              { label: "Add files", run: () => {
                var h;
                return (h = _e.current) == null ? void 0 : h.click();
              } },
              { label: "New chat", run: () => void _r() },
              { label: "Rename current chat", run: () => lr(Me) },
              { label: "Refresh", run: () => void ar() }
            ]),
            children: [
              /* @__PURE__ */ f.jsxs("div", { children: [
                /* @__PURE__ */ f.jsx("h2", { children: "Project files" }),
                /* @__PURE__ */ f.jsxs("small", { children: [
                  ys(Sd(d)),
                  " · browser ",
                  Rr || "?",
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ f.jsx(
                "button",
                {
                  className: "browser-more",
                  "aria-label": "Project actions",
                  title: "Project actions",
                  onClick: (u) => ut(u, Se.name, [
                    { label: "Add files", run: () => {
                      var h;
                      return (h = _e.current) == null ? void 0 : h.click();
                    } },
                    { label: "New chat", run: () => void _r() },
                    { label: "Rename current chat", run: () => lr(Me) },
                    { label: "Refresh", run: () => void ar() }
                  ]),
                  children: /* @__PURE__ */ f.jsx(Ge, { name: "more" })
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
              disabled: Ie,
              onClick: () => Le(!0),
              children: /* @__PURE__ */ f.jsx(Ge, { name: "up" })
            }
          ),
          /* @__PURE__ */ f.jsx("button", { title: "Add files", "aria-label": "Add files", onClick: () => {
            var u;
            return (u = _e.current) == null ? void 0 : u.click();
          }, children: /* @__PURE__ */ f.jsx(Ge, { name: "upload" }) }),
          /* @__PURE__ */ f.jsx("button", { title: "Refresh project", "aria-label": "Refresh project", onClick: () => void ar(), children: /* @__PURE__ */ f.jsx(Ge, { name: "refresh" }) }),
          /* @__PURE__ */ f.jsx(
            "button",
            {
              title: "Collapse all folders",
              "aria-label": "Collapse all folders",
              onClick: () => W({ inputs: !1, outputs: !1, scripts: !1, snapshots: !1 }),
              children: /* @__PURE__ */ f.jsx(Ge, { name: "collapse" })
            }
          ),
          /* @__PURE__ */ f.jsx("input", { ref: _e, hidden: !0, type: "file", multiple: !0, onChange: (u) => void ei(u.target.files) })
        ] }),
        /* @__PURE__ */ f.jsxs(
          "div",
          {
            className: "browser-path",
            title: Ie ? `OMERO/${Se.objectType}-${Se.objectId}` : Se.rootPath,
            onDoubleClick: () => Le(!0),
            children: [
              /* @__PURE__ */ f.jsx(Ge, { name: "root" }),
              /* @__PURE__ */ f.jsx("span", { children: Ie ? `OMERO/${Se.objectType}-${Se.objectId}` : Se.rootPath })
            ]
          }
        ),
        /* @__PURE__ */ f.jsxs("div", { className: "browser-columns", children: [
          /* @__PURE__ */ f.jsx("span", { children: "Name" }),
          /* @__PURE__ */ f.jsx("span", { children: "Size" })
        ] }),
        Ie ? /* @__PURE__ */ f.jsx("ul", { className: "browser-list project-list", children: _.map((u) => /* @__PURE__ */ f.jsxs(
          "li",
          {
            className: `browser-row project-row ${u.id === Se.id ? "active" : ""}`,
            onDoubleClick: () => void In(u.id),
            onContextMenu: (h) => ut(h, u.name, [
              { label: "Open project", run: () => void In(u.id) }
            ]),
            children: [
              /* @__PURE__ */ f.jsx(Ge, { name: "folder" }),
              /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                /* @__PURE__ */ f.jsx("strong", { children: u.name }),
                /* @__PURE__ */ f.jsx("small", { children: u.id === Se.id ? "open now" : u.sourceSnapshotAnnotationId ? `restored from Annotation ${u.sourceSnapshotAnnotationId}` : "browser-local project" })
              ] }),
              /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: new Date(u.updatedAt).toLocaleDateString() }),
              /* @__PURE__ */ f.jsx(
                "button",
                {
                  className: "browser-more",
                  "aria-label": `Actions for ${u.name}`,
                  onClick: (h) => ut(h, u.name, [
                    { label: "Open project", run: () => void In(u.id) }
                  ]),
                  children: /* @__PURE__ */ f.jsx(Ge, { name: "more" })
                }
              )
            ]
          },
          u.id
        )) }) : /* @__PURE__ */ f.jsxs(f.Fragment, { children: [
          Rr >= 75 && /* @__PURE__ */ f.jsxs("p", { className: "quota-warning", children: [
            "Browser storage is ",
            Rr,
            "% full. Archive or download old projects."
          ] }),
          /* @__PURE__ */ f.jsxs(
            "details",
            {
              open: $.inputs,
              className: "browser-folder",
              onToggle: (u) => {
                const h = u.currentTarget.open;
                W((S) => ({ ...S, inputs: h }));
              },
              children: [
                /* @__PURE__ */ f.jsxs(
                  "summary",
                  {
                    onContextMenu: (u) => ut(u, "inputs/", [
                      { label: "Add files", run: () => {
                        var h;
                        return (h = _e.current) == null ? void 0 : h.click();
                      } }
                    ]),
                    children: [
                      /* @__PURE__ */ f.jsx(Ge, { name: "chevron", className: "folder-chevron" }),
                      /* @__PURE__ */ f.jsx(Ge, { name: "folder" }),
                      /* @__PURE__ */ f.jsx("strong", { children: "inputs" }),
                      /* @__PURE__ */ f.jsx("small", { children: Ot.length })
                    ]
                  }
                ),
                /* @__PURE__ */ f.jsxs("ul", { className: "browser-list", children: [
                  Ot.map((u) => /* @__PURE__ */ f.jsxs(
                    "li",
                    {
                      className: `browser-row file-${u.state}`,
                      onContextMenu: (h) => ut(h, u.name, co(u)),
                      children: [
                        /* @__PURE__ */ f.jsx(Ge, { name: "file" }),
                        /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                          /* @__PURE__ */ f.jsx("strong", { children: u.name }),
                          /* @__PURE__ */ f.jsxs("small", { children: [
                            u.source,
                            " · ",
                            u.state,
                            " · ",
                            u.sha256.slice(0, 10) || "unhashed"
                          ] }),
                          u.error && /* @__PURE__ */ f.jsx("span", { className: "browser-error", children: u.error })
                        ] }),
                        /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: ys(u.size) }),
                        /* @__PURE__ */ f.jsx(
                          "button",
                          {
                            className: "browser-more",
                            "aria-label": `Actions for ${u.name}`,
                            onClick: (h) => ut(h, u.name, co(u)),
                            children: /* @__PURE__ */ f.jsx(Ge, { name: "more" })
                          }
                        ),
                        u.state === "missing" && u.source === "local" && /* @__PURE__ */ f.jsx(
                          "input",
                          {
                            id: `reselect-${u.id}`,
                            hidden: !0,
                            type: "file",
                            onChange: (h) => {
                              var S;
                              return void ui(u, ((S = h.target.files) == null ? void 0 : S[0]) || null);
                            }
                          }
                        )
                      ]
                    },
                    u.id
                  )),
                  !Ot.length && /* @__PURE__ */ f.jsx("li", { className: "browser-empty", children: "No input files" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ f.jsxs(
            "details",
            {
              open: $.outputs,
              className: "browser-folder",
              onToggle: (u) => {
                const h = u.currentTarget.open;
                W((S) => ({ ...S, outputs: h }));
              },
              children: [
                /* @__PURE__ */ f.jsxs(
                  "summary",
                  {
                    onContextMenu: (u) => ut(u, `chats/${Me.title}/`, [
                      { label: "Rename chat", run: () => lr(Me) },
                      { label: "New chat", run: () => void _r() },
                      { label: "Archive chat", run: () => Nr(Me) }
                    ]),
                    children: [
                      /* @__PURE__ */ f.jsx(Ge, { name: "chevron", className: "folder-chevron" }),
                      /* @__PURE__ */ f.jsx(Ge, { name: "folder" }),
                      /* @__PURE__ */ f.jsxs("strong", { children: [
                        "chats/",
                        eo(Me.title),
                        "/outputs"
                      ] }),
                      /* @__PURE__ */ f.jsx("small", { children: ro.length })
                    ]
                  }
                ),
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
                  ro.map((u) => /* @__PURE__ */ f.jsxs(
                    "li",
                    {
                      className: "browser-row",
                      onDoubleClick: () => si(u),
                      onContextMenu: (h) => ut(h, u.name, fo(u)),
                      children: [
                        /* @__PURE__ */ f.jsx(Ge, { name: u.type.startsWith("image/") ? "image" : "file" }),
                        /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                          /* @__PURE__ */ f.jsx("strong", { children: u.name }),
                          /* @__PURE__ */ f.jsxs("small", { children: [
                            u.sha256.slice(0, 10),
                            " · double-click to download"
                          ] })
                        ] }),
                        /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: ys(u.size) }),
                        /* @__PURE__ */ f.jsx(
                          "button",
                          {
                            className: "browser-more",
                            "aria-label": `Actions for ${u.name}`,
                            onClick: (h) => ut(h, u.name, fo(u)),
                            children: /* @__PURE__ */ f.jsx(Ge, { name: "more" })
                          }
                        )
                      ]
                    },
                    u.id
                  ))
                ] })
              ]
            }
          ),
          /* @__PURE__ */ f.jsxs(
            "details",
            {
              open: $.scripts,
              className: "browser-folder",
              onToggle: (u) => {
                const h = u.currentTarget.open;
                W((S) => ({ ...S, scripts: h }));
              },
              children: [
                /* @__PURE__ */ f.jsxs(
                  "summary",
                  {
                    onContextMenu: (u) => ut(u, "scripts/", [
                      { label: "Combine selected scripts", run: () => void lo() },
                      { label: "Copy selected scripts…", run: () => mn() }
                    ]),
                    children: [
                      /* @__PURE__ */ f.jsx(Ge, { name: "chevron", className: "folder-chevron" }),
                      /* @__PURE__ */ f.jsx(Ge, { name: "folder" }),
                      /* @__PURE__ */ f.jsx("strong", { children: "scripts" }),
                      /* @__PURE__ */ f.jsx("small", { children: d.scripts.length })
                    ]
                  }
                ),
                d.scripts.length > 0 && /* @__PURE__ */ f.jsxs("div", { className: "script-selection-toolbar", children: [
                  /* @__PURE__ */ f.jsxs("span", { children: [
                    Ee.size,
                    " selected"
                  ] }),
                  /* @__PURE__ */ f.jsx("button", { disabled: Ee.size < 2, onClick: () => void lo(), children: "Combine" }),
                  /* @__PURE__ */ f.jsx("button", { disabled: !Ee.size, onClick: () => mn(), children: "Copy to…" })
                ] }),
                /* @__PURE__ */ f.jsxs("ul", { className: "browser-list", children: [
                  d.scripts.map((u) => /* @__PURE__ */ f.jsxs(
                    "li",
                    {
                      className: "browser-row script-row",
                      onDoubleClick: () => void io(u),
                      onContextMenu: (h) => ut(h, u.name, ai(u)),
                      children: [
                        /* @__PURE__ */ f.jsx(
                          "input",
                          {
                            className: "script-selector",
                            type: "checkbox",
                            "aria-label": `Select ${u.name}`,
                            checked: Ee.has(u.id),
                            onChange: () => so(u.id),
                            onDoubleClick: (h) => h.stopPropagation()
                          }
                        ),
                        /* @__PURE__ */ f.jsx("span", { className: "browser-icon python", "aria-hidden": "true" }),
                        /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                          /* @__PURE__ */ f.jsx("strong", { children: u.name }),
                          /* @__PURE__ */ f.jsxs("small", { children: [
                            "v",
                            u.currentVersion,
                            " · ",
                            u.description || "saved Python script"
                          ] })
                        ] }),
                        /* @__PURE__ */ f.jsxs("span", { className: "browser-size", children: [
                          "v",
                          u.currentVersion
                        ] }),
                        /* @__PURE__ */ f.jsx(
                          "button",
                          {
                            className: "browser-more",
                            "aria-label": `Actions for ${u.name}`,
                            onClick: (h) => ut(h, u.name, ai(u)),
                            children: /* @__PURE__ */ f.jsx(Ge, { name: "more" })
                          }
                        )
                      ]
                    },
                    u.id
                  )),
                  !d.scripts.length && /* @__PURE__ */ f.jsx("li", { className: "browser-empty", children: "No saved scripts" })
                ] })
              ]
            }
          ),
          T.length > 0 && /* @__PURE__ */ f.jsxs(
            "details",
            {
              open: $.snapshots,
              className: "browser-folder",
              onToggle: (u) => {
                const h = u.currentTarget.open;
                W((S) => ({ ...S, snapshots: h }));
              },
              children: [
                /* @__PURE__ */ f.jsxs("summary", { children: [
                  /* @__PURE__ */ f.jsx(Ge, { name: "chevron", className: "folder-chevron" }),
                  /* @__PURE__ */ f.jsx(Ge, { name: "folder" }),
                  /* @__PURE__ */ f.jsx("strong", { children: "Resume from OMERO" }),
                  /* @__PURE__ */ f.jsx("small", { children: T.length })
                ] }),
                /* @__PURE__ */ f.jsx("ul", { className: "browser-list", children: T.map((u) => /* @__PURE__ */ f.jsxs(
                  "li",
                  {
                    className: "browser-row",
                    onDoubleClick: () => void li(u),
                    onContextMenu: (h) => ut(h, u.name, po(u)),
                    children: [
                      /* @__PURE__ */ f.jsx("span", { className: "browser-icon archive", "aria-hidden": "true" }),
                      /* @__PURE__ */ f.jsxs("div", { className: "browser-name", children: [
                        /* @__PURE__ */ f.jsx("strong", { children: u.name }),
                        /* @__PURE__ */ f.jsxs("small", { children: [
                          "Annotation ",
                          u.annotation_id
                        ] })
                      ] }),
                      /* @__PURE__ */ f.jsx("span", { className: "browser-size", children: ys(u.size) }),
                      /* @__PURE__ */ f.jsx(
                        "button",
                        {
                          className: "browser-more",
                          "aria-label": `Actions for ${u.name}`,
                          onClick: (h) => ut(h, u.name, po(u)),
                          children: /* @__PURE__ */ f.jsx(Ge, { name: "more" })
                        }
                      )
                    ]
                  },
                  u.annotation_id
                )) })
              ]
            }
          )
        ] })
      ] }),
      ne && /* @__PURE__ */ f.jsxs(
        "div",
        {
          className: "browser-context-menu",
          role: "menu",
          "aria-label": `Actions for ${ne.title}`,
          style: { left: ne.x, top: ne.y },
          onClick: (u) => u.stopPropagation(),
          children: [
            /* @__PURE__ */ f.jsx("div", { className: "context-title", children: ne.title }),
            ne.actions.map((u) => /* @__PURE__ */ f.jsx(
              "button",
              {
                role: "menuitem",
                className: u.danger ? "danger" : "",
                onClick: () => {
                  oe(null), u.run();
                },
                children: u.label
              },
              u.label
            ))
          ]
        }
      ),
      /* @__PURE__ */ f.jsxs("section", { className: "chat", children: [
        /* @__PURE__ */ f.jsxs("div", { className: "messages", "aria-live": "polite", ref: Ce, children: [
          !Me.messages.length && /* @__PURE__ */ f.jsxs("div", { className: "welcome", children: [
            /* @__PURE__ */ f.jsx("h2", { children: "What would you like to learn from these data?" }),
            /* @__PURE__ */ f.jsx("p", { children: "This named chat, its code, outputs, and reusable scripts are saved automatically in the browser project." })
          ] }),
          Me.messages.map((u) => {
            if (u.kind === "execution" && u.executionId) {
              const h = d.executions.find((S) => S.id === u.executionId);
              return h ? /* @__PURE__ */ f.jsx(
                Lh,
                {
                  execution: h,
                  files: d.files,
                  onSave: () => void ri(h),
                  onRerun: () => void ci(h)
                },
                u.id
              ) : null;
            }
            return /* @__PURE__ */ f.jsxs("article", { className: `message ${u.role} ${u.kind || ""}`, children: [
              /* @__PURE__ */ f.jsx("span", { children: u.role }),
              /* @__PURE__ */ f.jsx("p", { children: u.content })
            ] }, u.id);
          })
        ] }),
        !ke && /* @__PURE__ */ f.jsxs("div", { className: "runtime-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ f.jsxs("div", { children: [
            /* @__PURE__ */ f.jsx("strong", { children: P.message }),
            /* @__PURE__ */ f.jsxs("span", { children: [
              Math.round(P.percent),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ f.jsx("progress", { max: "100", value: P.percent }),
          /* @__PURE__ */ f.jsx("small", { children: "Please wait. The question box unlocks automatically when browser Python is ready." })
        ] }),
        /* @__PURE__ */ f.jsx("div", { className: "status", role: "status", children: te }),
        /* @__PURE__ */ f.jsxs("div", { className: "usage-status", children: [
          /* @__PURE__ */ f.jsx("span", { children: "Azure receives prompts, generated code, bounded schemas/previews/statistics, summaries, and errors — never source files." }),
          /* @__PURE__ */ f.jsx("span", { children: Rh(H, R.contextWindow || 0) })
        ] }),
        or.length > 0 && /* @__PURE__ */ f.jsx("div", { className: "blocker", children: "Analysis is blocked until every input is available. Retry, reselect, or remove missing files." }),
        !R.apiKey || !R.model ? /* @__PURE__ */ f.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
        /* @__PURE__ */ f.jsxs("div", { className: "composer", children: [
          /* @__PURE__ */ f.jsxs("div", { className: `composer-state ${Zt ? "ready" : "waiting"}`, children: [
            /* @__PURE__ */ f.jsx("span", { "aria-hidden": "true", children: Zt ? "●" : "◷" }),
            Zt ? "Ready — you can ask a question" : oo
          ] }),
          /* @__PURE__ */ f.jsx("textarea", { value: he, onChange: (u) => G(u.target.value), onKeyDown: (u) => {
            u.key === "Enter" && !u.shiftKey && (u.preventDefault(), hn());
          }, disabled: !Zt, placeholder: oo }),
          Y ? /* @__PURE__ */ f.jsx("button", { className: "stop", onClick: ni, children: "Stop" }) : /* @__PURE__ */ f.jsx("button", { disabled: !Zt || !he.trim(), onClick: () => void hn(), children: "Send" }),
          /* @__PURE__ */ f.jsx("button", { disabled: Y || !ke, onClick: () => void kt(d.files, "Python state reset; inputs restored"), children: "Reset Python" })
        ] })
      ] })
    ] })
  ] });
  async function ui(u, h) {
    const S = m.current;
    if (!h || !S) return;
    if (h.size > sd) {
      V(`${h.name} exceeds the 256 MiB file limit`);
      return;
    }
    const M = await h.arrayBuffer(), I = {
      ...u,
      name: h.name,
      type: h.type || wd(h.name),
      size: M.byteLength,
      sha256: await qt(M),
      data: M,
      state: "ready",
      error: void 0
    }, U = S.files.map((D) => D.id === u.id ? I : D);
    bt([I]), await kt(U, "Missing local input restored");
  }
  async function ci(u) {
    if (!(!ke || Y)) {
      Te(!0), Ue.current.clear(), await l.beginTurn();
      try {
        await zn(u.code, u.chatId, wt(), !0), V("Python rerun completed");
      } finally {
        Te(!1);
      }
    }
  }
}
function Lh({
  execution: s,
  files: a,
  onSave: l,
  onRerun: d
}) {
  var A;
  const [g, m] = Ne.useState(!1), _ = s.outputFileIds.map((T) => a.find((N) => N.id === T)).filter(Boolean), E = s.status === "reused" ? [] : _.filter((T) => T.type === "image/png" || T.type === "image/svg+xml"), C = (T) => /* @__PURE__ */ f.jsxs("div", { className: `execution-actions ${T}`, children: [
    /* @__PURE__ */ f.jsx(
      "button",
      {
        className: "detail-toggle",
        "aria-expanded": g,
        onClick: () => m((N) => !N),
        children: g ? "Collapse" : "Show details"
      }
    ),
    ["success", "reused"].includes(s.status) && /* @__PURE__ */ f.jsx("button", { onClick: l, children: "Save as script" }),
    /* @__PURE__ */ f.jsx("button", { onClick: d, children: "Rerun" }),
    /* @__PURE__ */ f.jsxs("small", { children: [
      s.codeHash.slice(0, 12),
      " · ",
      s.runtimeVersion
    ] })
  ] });
  return /* @__PURE__ */ f.jsxs("article", { className: `message execution ${s.status}`, children: [
    /* @__PURE__ */ f.jsxs("section", { className: "execution-details", "data-expanded": g ? "true" : "false", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "execution-heading", children: [
        /* @__PURE__ */ f.jsx("span", { children: s.status === "reused" ? "Reused Python run" : "Python code (local)" }),
        C("top")
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "execution-content", hidden: !g, children: [
        /* @__PURE__ */ f.jsx("pre", { children: /* @__PURE__ */ f.jsx("code", { children: s.code }) }),
        s.stdout && /* @__PURE__ */ f.jsx("pre", { children: s.stdout }),
        s.stderr && /* @__PURE__ */ f.jsx("pre", { className: "execution-error", children: s.stderr }),
        s.preview != null && /* @__PURE__ */ f.jsx(Mh, { value: s.preview }),
        C("bottom")
      ] })
    ] }),
    s.status === "reused" && /* @__PURE__ */ f.jsxs("p", { className: "reuse-note", children: [
      "Reused prior execution ",
      (A = s.reusedFrom) == null ? void 0 : A.slice(0, 8),
      " because code and inputs are unchanged."
    ] }),
    s.missingPlotCsv.length > 0 && /* @__PURE__ */ f.jsxs("p", { className: "plot-warning", children: [
      "Source CSV missing: ",
      s.missingPlotCsv.join(", ")
    ] }),
    E.map((T) => /* @__PURE__ */ f.jsx(Oh, { file: T }, T.id))
  ] });
}
function Mh({ value: s }) {
  if ((s == null ? void 0 : s.kind) === "table" && s.data) {
    const a = s.data.columns || [], l = s.data.data || [];
    return /* @__PURE__ */ f.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ f.jsxs("table", { children: [
      /* @__PURE__ */ f.jsx("thead", { children: /* @__PURE__ */ f.jsx("tr", { children: a.map((d) => /* @__PURE__ */ f.jsx("th", { children: d }, d)) }) }),
      /* @__PURE__ */ f.jsx("tbody", { children: l.map((d, g) => /* @__PURE__ */ f.jsx("tr", { children: d.map((m, _) => /* @__PURE__ */ f.jsx("td", { children: String(m ?? "") }, _)) }, g)) })
    ] }) });
  }
  return /* @__PURE__ */ f.jsx("pre", { className: "preview", children: JSON.stringify(s, null, 2) });
}
function Oh({ file: s }) {
  const a = Ne.useMemo(
    () => s.data ? URL.createObjectURL(new Blob([s.data], { type: s.type })) : "",
    [s.data, s.type]
  );
  return Ne.useEffect(() => () => {
    a && URL.revokeObjectURL(a);
  }, [a]), a ? /* @__PURE__ */ f.jsxs("figure", { children: [
    /* @__PURE__ */ f.jsx("img", { src: a, alt: s.name }),
    /* @__PURE__ */ f.jsx("figcaption", { children: s.name })
  ] }) : null;
}
function Ge({ name: s, className: a = "" }) {
  const l = {
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
      className: `ui-icon icon-${s} ${a}`.trim(),
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      fill: s === "folder" ? "currentColor" : "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: l[s]
    }
  );
}
Rp.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ f.jsx(jp.StrictMode, { children: /* @__PURE__ */ f.jsx(zh, {}) })
);
