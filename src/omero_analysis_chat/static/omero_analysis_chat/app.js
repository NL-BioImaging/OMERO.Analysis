var Rp = Object.defineProperty;
var Op = (s, l, u) => l in s ? Rp(s, l, { enumerable: !0, configurable: !0, writable: !0, value: u }) : s[l] = u;
var In = (s, l, u) => Op(s, typeof l != "symbol" ? l + "" : l, u);
function Dd(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Il = { exports: {} }, _s = {}, Rl = { exports: {} }, Ee = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fd;
function $p() {
  if (fd) return Ee;
  fd = 1;
  var s = Symbol.for("react.element"), l = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), p = Symbol.for("react.profiler"), v = Symbol.for("react.provider"), y = Symbol.for("react.context"), _ = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), R = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), A = Symbol.iterator;
  function F(j) {
    return j === null || typeof j != "object" ? null : (j = A && j[A] || j["@@iterator"], typeof j == "function" ? j : null);
  }
  var H = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, oe = Object.assign, G = {};
  function ee(j, O, se) {
    this.props = j, this.context = O, this.refs = G, this.updater = se || H;
  }
  ee.prototype.isReactComponent = {}, ee.prototype.setState = function(j, O) {
    if (typeof j != "object" && typeof j != "function" && j != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, j, O, "setState");
  }, ee.prototype.forceUpdate = function(j) {
    this.updater.enqueueForceUpdate(this, j, "forceUpdate");
  };
  function ye() {
  }
  ye.prototype = ee.prototype;
  function Ne(j, O, se) {
    this.props = j, this.context = O, this.refs = G, this.updater = se || H;
  }
  var ke = Ne.prototype = new ye();
  ke.constructor = Ne, oe(ke, ee.prototype), ke.isPureReactComponent = !0;
  var pe = Array.isArray, Se = Object.prototype.hasOwnProperty, de = { current: null }, fe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function $(j, O, se) {
    var ie, M = {}, xe = null, Te = null;
    if (O != null) for (ie in O.ref !== void 0 && (Te = O.ref), O.key !== void 0 && (xe = "" + O.key), O) Se.call(O, ie) && !fe.hasOwnProperty(ie) && (M[ie] = O[ie]);
    var je = arguments.length - 2;
    if (je === 1) M.children = se;
    else if (1 < je) {
      for (var Ie = Array(je), Ge = 0; Ge < je; Ge++) Ie[Ge] = arguments[Ge + 2];
      M.children = Ie;
    }
    if (j && j.defaultProps) for (ie in je = j.defaultProps, je) M[ie] === void 0 && (M[ie] = je[ie]);
    return { $$typeof: s, type: j, key: xe, ref: Te, props: M, _owner: de.current };
  }
  function Q(j, O) {
    return { $$typeof: s, type: j.type, key: O, ref: j.ref, props: j.props, _owner: j._owner };
  }
  function we(j) {
    return typeof j == "object" && j !== null && j.$$typeof === s;
  }
  function Oe(j) {
    var O = { "=": "=0", ":": "=2" };
    return "$" + j.replace(/[=:]/g, function(se) {
      return O[se];
    });
  }
  var Le = /\/+/g;
  function Ve(j, O) {
    return typeof j == "object" && j !== null && j.key != null ? Oe("" + j.key) : O.toString(36);
  }
  function De(j, O, se, ie, M) {
    var xe = typeof j;
    (xe === "undefined" || xe === "boolean") && (j = null);
    var Te = !1;
    if (j === null) Te = !0;
    else switch (xe) {
      case "string":
      case "number":
        Te = !0;
        break;
      case "object":
        switch (j.$$typeof) {
          case s:
          case l:
            Te = !0;
        }
    }
    if (Te) return Te = j, M = M(Te), j = ie === "" ? "." + Ve(Te, 0) : ie, pe(M) ? (se = "", j != null && (se = j.replace(Le, "$&/") + "/"), De(M, O, se, "", function(Ge) {
      return Ge;
    })) : M != null && (we(M) && (M = Q(M, se + (!M.key || Te && Te.key === M.key ? "" : ("" + M.key).replace(Le, "$&/") + "/") + j)), O.push(M)), 1;
    if (Te = 0, ie = ie === "" ? "." : ie + ":", pe(j)) for (var je = 0; je < j.length; je++) {
      xe = j[je];
      var Ie = ie + Ve(xe, je);
      Te += De(xe, O, se, Ie, M);
    }
    else if (Ie = F(j), typeof Ie == "function") for (j = Ie.call(j), je = 0; !(xe = j.next()).done; ) xe = xe.value, Ie = ie + Ve(xe, je++), Te += De(xe, O, se, Ie, M);
    else if (xe === "object") throw O = String(j), Error("Objects are not valid as a React child (found: " + (O === "[object Object]" ? "object with keys {" + Object.keys(j).join(", ") + "}" : O) + "). If you meant to render a collection of children, use an array instead.");
    return Te;
  }
  function Ue(j, O, se) {
    if (j == null) return j;
    var ie = [], M = 0;
    return De(j, ie, "", "", function(xe) {
      return O.call(se, xe, M++);
    }), ie;
  }
  function Ae(j) {
    if (j._status === -1) {
      var O = j._result;
      O = O(), O.then(function(se) {
        (j._status === 0 || j._status === -1) && (j._status = 1, j._result = se);
      }, function(se) {
        (j._status === 0 || j._status === -1) && (j._status = 2, j._result = se);
      }), j._status === -1 && (j._status = 0, j._result = O);
    }
    if (j._status === 1) return j._result.default;
    throw j._result;
  }
  var ve = { current: null }, B = { transition: null }, X = { ReactCurrentDispatcher: ve, ReactCurrentBatchConfig: B, ReactCurrentOwner: de };
  function K() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Ee.Children = { map: Ue, forEach: function(j, O, se) {
    Ue(j, function() {
      O.apply(this, arguments);
    }, se);
  }, count: function(j) {
    var O = 0;
    return Ue(j, function() {
      O++;
    }), O;
  }, toArray: function(j) {
    return Ue(j, function(O) {
      return O;
    }) || [];
  }, only: function(j) {
    if (!we(j)) throw Error("React.Children.only expected to receive a single React element child.");
    return j;
  } }, Ee.Component = ee, Ee.Fragment = u, Ee.Profiler = p, Ee.PureComponent = Ne, Ee.StrictMode = f, Ee.Suspense = S, Ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = X, Ee.act = K, Ee.cloneElement = function(j, O, se) {
    if (j == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + j + ".");
    var ie = oe({}, j.props), M = j.key, xe = j.ref, Te = j._owner;
    if (O != null) {
      if (O.ref !== void 0 && (xe = O.ref, Te = de.current), O.key !== void 0 && (M = "" + O.key), j.type && j.type.defaultProps) var je = j.type.defaultProps;
      for (Ie in O) Se.call(O, Ie) && !fe.hasOwnProperty(Ie) && (ie[Ie] = O[Ie] === void 0 && je !== void 0 ? je[Ie] : O[Ie]);
    }
    var Ie = arguments.length - 2;
    if (Ie === 1) ie.children = se;
    else if (1 < Ie) {
      je = Array(Ie);
      for (var Ge = 0; Ge < Ie; Ge++) je[Ge] = arguments[Ge + 2];
      ie.children = je;
    }
    return { $$typeof: s, type: j.type, key: M, ref: xe, props: ie, _owner: Te };
  }, Ee.createContext = function(j) {
    return j = { $$typeof: y, _currentValue: j, _currentValue2: j, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, j.Provider = { $$typeof: v, _context: j }, j.Consumer = j;
  }, Ee.createElement = $, Ee.createFactory = function(j) {
    var O = $.bind(null, j);
    return O.type = j, O;
  }, Ee.createRef = function() {
    return { current: null };
  }, Ee.forwardRef = function(j) {
    return { $$typeof: _, render: j };
  }, Ee.isValidElement = we, Ee.lazy = function(j) {
    return { $$typeof: T, _payload: { _status: -1, _result: j }, _init: Ae };
  }, Ee.memo = function(j, O) {
    return { $$typeof: R, type: j, compare: O === void 0 ? null : O };
  }, Ee.startTransition = function(j) {
    var O = B.transition;
    B.transition = {};
    try {
      j();
    } finally {
      B.transition = O;
    }
  }, Ee.unstable_act = K, Ee.useCallback = function(j, O) {
    return ve.current.useCallback(j, O);
  }, Ee.useContext = function(j) {
    return ve.current.useContext(j);
  }, Ee.useDebugValue = function() {
  }, Ee.useDeferredValue = function(j) {
    return ve.current.useDeferredValue(j);
  }, Ee.useEffect = function(j, O) {
    return ve.current.useEffect(j, O);
  }, Ee.useId = function() {
    return ve.current.useId();
  }, Ee.useImperativeHandle = function(j, O, se) {
    return ve.current.useImperativeHandle(j, O, se);
  }, Ee.useInsertionEffect = function(j, O) {
    return ve.current.useInsertionEffect(j, O);
  }, Ee.useLayoutEffect = function(j, O) {
    return ve.current.useLayoutEffect(j, O);
  }, Ee.useMemo = function(j, O) {
    return ve.current.useMemo(j, O);
  }, Ee.useReducer = function(j, O, se) {
    return ve.current.useReducer(j, O, se);
  }, Ee.useRef = function(j) {
    return ve.current.useRef(j);
  }, Ee.useState = function(j) {
    return ve.current.useState(j);
  }, Ee.useSyncExternalStore = function(j, O, se) {
    return ve.current.useSyncExternalStore(j, O, se);
  }, Ee.useTransition = function() {
    return ve.current.useTransition();
  }, Ee.version = "18.3.1", Ee;
}
var pd;
function Gl() {
  return pd || (pd = 1, Rl.exports = $p()), Rl.exports;
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
var hd;
function Mp() {
  if (hd) return _s;
  hd = 1;
  var s = Gl(), l = Symbol.for("react.element"), u = Symbol.for("react.fragment"), f = Object.prototype.hasOwnProperty, p = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, v = { key: !0, ref: !0, __self: !0, __source: !0 };
  function y(_, S, R) {
    var T, A = {}, F = null, H = null;
    R !== void 0 && (F = "" + R), S.key !== void 0 && (F = "" + S.key), S.ref !== void 0 && (H = S.ref);
    for (T in S) f.call(S, T) && !v.hasOwnProperty(T) && (A[T] = S[T]);
    if (_ && _.defaultProps) for (T in S = _.defaultProps, S) A[T] === void 0 && (A[T] = S[T]);
    return { $$typeof: l, type: _, key: F, ref: H, props: A, _owner: p.current };
  }
  return _s.Fragment = u, _s.jsx = y, _s.jsxs = y, _s;
}
var md;
function zp() {
  return md || (md = 1, Il.exports = Mp()), Il.exports;
}
var c = zp(), me = Gl();
const Lp = /* @__PURE__ */ Dd(me);
var Wi = {}, Ol = { exports: {} }, zt = {}, $l = { exports: {} }, Ml = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vd;
function Fp() {
  return vd || (vd = 1, (function(s) {
    function l(B, X) {
      var K = B.length;
      B.push(X);
      e: for (; 0 < K; ) {
        var j = K - 1 >>> 1, O = B[j];
        if (0 < p(O, X)) B[j] = X, B[K] = O, K = j;
        else break e;
      }
    }
    function u(B) {
      return B.length === 0 ? null : B[0];
    }
    function f(B) {
      if (B.length === 0) return null;
      var X = B[0], K = B.pop();
      if (K !== X) {
        B[0] = K;
        e: for (var j = 0, O = B.length, se = O >>> 1; j < se; ) {
          var ie = 2 * (j + 1) - 1, M = B[ie], xe = ie + 1, Te = B[xe];
          if (0 > p(M, K)) xe < O && 0 > p(Te, M) ? (B[j] = Te, B[xe] = K, j = xe) : (B[j] = M, B[ie] = K, j = ie);
          else if (xe < O && 0 > p(Te, K)) B[j] = Te, B[xe] = K, j = xe;
          else break e;
        }
      }
      return X;
    }
    function p(B, X) {
      var K = B.sortIndex - X.sortIndex;
      return K !== 0 ? K : B.id - X.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var v = performance;
      s.unstable_now = function() {
        return v.now();
      };
    } else {
      var y = Date, _ = y.now();
      s.unstable_now = function() {
        return y.now() - _;
      };
    }
    var S = [], R = [], T = 1, A = null, F = 3, H = !1, oe = !1, G = !1, ee = typeof setTimeout == "function" ? setTimeout : null, ye = typeof clearTimeout == "function" ? clearTimeout : null, Ne = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ke(B) {
      for (var X = u(R); X !== null; ) {
        if (X.callback === null) f(R);
        else if (X.startTime <= B) f(R), X.sortIndex = X.expirationTime, l(S, X);
        else break;
        X = u(R);
      }
    }
    function pe(B) {
      if (G = !1, ke(B), !oe) if (u(S) !== null) oe = !0, Ae(Se);
      else {
        var X = u(R);
        X !== null && ve(pe, X.startTime - B);
      }
    }
    function Se(B, X) {
      oe = !1, G && (G = !1, ye($), $ = -1), H = !0;
      var K = F;
      try {
        for (ke(X), A = u(S); A !== null && (!(A.expirationTime > X) || B && !Oe()); ) {
          var j = A.callback;
          if (typeof j == "function") {
            A.callback = null, F = A.priorityLevel;
            var O = j(A.expirationTime <= X);
            X = s.unstable_now(), typeof O == "function" ? A.callback = O : A === u(S) && f(S), ke(X);
          } else f(S);
          A = u(S);
        }
        if (A !== null) var se = !0;
        else {
          var ie = u(R);
          ie !== null && ve(pe, ie.startTime - X), se = !1;
        }
        return se;
      } finally {
        A = null, F = K, H = !1;
      }
    }
    var de = !1, fe = null, $ = -1, Q = 5, we = -1;
    function Oe() {
      return !(s.unstable_now() - we < Q);
    }
    function Le() {
      if (fe !== null) {
        var B = s.unstable_now();
        we = B;
        var X = !0;
        try {
          X = fe(!0, B);
        } finally {
          X ? Ve() : (de = !1, fe = null);
        }
      } else de = !1;
    }
    var Ve;
    if (typeof Ne == "function") Ve = function() {
      Ne(Le);
    };
    else if (typeof MessageChannel < "u") {
      var De = new MessageChannel(), Ue = De.port2;
      De.port1.onmessage = Le, Ve = function() {
        Ue.postMessage(null);
      };
    } else Ve = function() {
      ee(Le, 0);
    };
    function Ae(B) {
      fe = B, de || (de = !0, Ve());
    }
    function ve(B, X) {
      $ = ee(function() {
        B(s.unstable_now());
      }, X);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function(B) {
      B.callback = null;
    }, s.unstable_continueExecution = function() {
      oe || H || (oe = !0, Ae(Se));
    }, s.unstable_forceFrameRate = function(B) {
      0 > B || 125 < B ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Q = 0 < B ? Math.floor(1e3 / B) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return F;
    }, s.unstable_getFirstCallbackNode = function() {
      return u(S);
    }, s.unstable_next = function(B) {
      switch (F) {
        case 1:
        case 2:
        case 3:
          var X = 3;
          break;
        default:
          X = F;
      }
      var K = F;
      F = X;
      try {
        return B();
      } finally {
        F = K;
      }
    }, s.unstable_pauseExecution = function() {
    }, s.unstable_requestPaint = function() {
    }, s.unstable_runWithPriority = function(B, X) {
      switch (B) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          B = 3;
      }
      var K = F;
      F = B;
      try {
        return X();
      } finally {
        F = K;
      }
    }, s.unstable_scheduleCallback = function(B, X, K) {
      var j = s.unstable_now();
      switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? j + K : j) : K = j, B) {
        case 1:
          var O = -1;
          break;
        case 2:
          O = 250;
          break;
        case 5:
          O = 1073741823;
          break;
        case 4:
          O = 1e4;
          break;
        default:
          O = 5e3;
      }
      return O = K + O, B = { id: T++, callback: X, priorityLevel: B, startTime: K, expirationTime: O, sortIndex: -1 }, K > j ? (B.sortIndex = K, l(R, B), u(S) === null && B === u(R) && (G ? (ye($), $ = -1) : G = !0, ve(pe, K - j))) : (B.sortIndex = O, l(S, B), oe || H || (oe = !0, Ae(Se))), B;
    }, s.unstable_shouldYield = Oe, s.unstable_wrapCallback = function(B) {
      var X = F;
      return function() {
        var K = F;
        F = X;
        try {
          return B.apply(this, arguments);
        } finally {
          F = K;
        }
      };
    };
  })(Ml)), Ml;
}
var yd;
function Dp() {
  return yd || (yd = 1, $l.exports = Fp()), $l.exports;
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
var gd;
function Up() {
  if (gd) return zt;
  gd = 1;
  var s = Gl(), l = Dp();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var f = /* @__PURE__ */ new Set(), p = {};
  function v(e, t) {
    y(e, t), y(e + "Capture", t);
  }
  function y(e, t) {
    for (p[e] = t, e = 0; e < t.length; e++) f.add(t[e]);
  }
  var _ = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), S = Object.prototype.hasOwnProperty, R = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, T = {}, A = {};
  function F(e) {
    return S.call(A, e) ? !0 : S.call(T, e) ? !1 : R.test(e) ? A[e] = !0 : (T[e] = !0, !1);
  }
  function H(e, t, n, r) {
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
  function oe(e, t, n, r) {
    if (t === null || typeof t > "u" || H(e, t, n, r)) return !0;
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
  function G(e, t, n, r, o, i, d) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = i, this.removeEmptyString = d;
  }
  var ee = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    ee[e] = new G(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    ee[t] = new G(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    ee[e] = new G(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    ee[e] = new G(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    ee[e] = new G(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    ee[e] = new G(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    ee[e] = new G(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    ee[e] = new G(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    ee[e] = new G(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var ye = /[\-:]([a-z])/g;
  function Ne(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      ye,
      Ne
    );
    ee[t] = new G(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(ye, Ne);
    ee[t] = new G(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(ye, Ne);
    ee[t] = new G(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    ee[e] = new G(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), ee.xlinkHref = new G("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    ee[e] = new G(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function ke(e, t, n, r) {
    var o = ee.hasOwnProperty(t) ? ee[t] : null;
    (o !== null ? o.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (oe(t, n, o, r) && (n = null), r || o === null ? F(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : o.mustUseProperty ? e[o.propertyName] = n === null ? o.type === 3 ? !1 : "" : n : (t = o.attributeName, r = o.attributeNamespace, n === null ? e.removeAttribute(t) : (o = o.type, n = o === 3 || o === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var pe = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Se = Symbol.for("react.element"), de = Symbol.for("react.portal"), fe = Symbol.for("react.fragment"), $ = Symbol.for("react.strict_mode"), Q = Symbol.for("react.profiler"), we = Symbol.for("react.provider"), Oe = Symbol.for("react.context"), Le = Symbol.for("react.forward_ref"), Ve = Symbol.for("react.suspense"), De = Symbol.for("react.suspense_list"), Ue = Symbol.for("react.memo"), Ae = Symbol.for("react.lazy"), ve = Symbol.for("react.offscreen"), B = Symbol.iterator;
  function X(e) {
    return e === null || typeof e != "object" ? null : (e = B && e[B] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var K = Object.assign, j;
  function O(e) {
    if (j === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      j = t && t[1] || "";
    }
    return `
` + j + e;
  }
  var se = !1;
  function ie(e, t) {
    if (!e || se) return "";
    se = !0;
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
        } catch (N) {
          var r = N;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (N) {
          r = N;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (N) {
          r = N;
        }
        e();
      }
    } catch (N) {
      if (N && r && typeof N.stack == "string") {
        for (var o = N.stack.split(`
`), i = r.stack.split(`
`), d = o.length - 1, m = i.length - 1; 1 <= d && 0 <= m && o[d] !== i[m]; ) m--;
        for (; 1 <= d && 0 <= m; d--, m--) if (o[d] !== i[m]) {
          if (d !== 1 || m !== 1)
            do
              if (d--, m--, 0 > m || o[d] !== i[m]) {
                var g = `
` + o[d].replace(" at new ", " at ");
                return e.displayName && g.includes("<anonymous>") && (g = g.replace("<anonymous>", e.displayName)), g;
              }
            while (1 <= d && 0 <= m);
          break;
        }
      }
    } finally {
      se = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? O(e) : "";
  }
  function M(e) {
    switch (e.tag) {
      case 5:
        return O(e.type);
      case 16:
        return O("Lazy");
      case 13:
        return O("Suspense");
      case 19:
        return O("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = ie(e.type, !1), e;
      case 11:
        return e = ie(e.type.render, !1), e;
      case 1:
        return e = ie(e.type, !0), e;
      default:
        return "";
    }
  }
  function xe(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case fe:
        return "Fragment";
      case de:
        return "Portal";
      case Q:
        return "Profiler";
      case $:
        return "StrictMode";
      case Ve:
        return "Suspense";
      case De:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Oe:
        return (e.displayName || "Context") + ".Consumer";
      case we:
        return (e._context.displayName || "Context") + ".Provider";
      case Le:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Ue:
        return t = e.displayName || null, t !== null ? t : xe(e.type) || "Memo";
      case Ae:
        t = e._payload, e = e._init;
        try {
          return xe(e(t));
        } catch {
        }
    }
    return null;
  }
  function Te(e) {
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
        return xe(t);
      case 8:
        return t === $ ? "StrictMode" : "Mode";
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
  function je(e) {
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
  function Ie(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ge(e) {
    var t = Ie(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var o = n.get, i = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return o.call(this);
      }, set: function(d) {
        r = "" + d, i.call(this, d);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(d) {
        r = "" + d;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Tt(e) {
    e._valueTracker || (e._valueTracker = Ge(e));
  }
  function yt(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = Ie(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function ft(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function zn(e, t) {
    var n = t.checked;
    return K({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Zr(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = je(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function xr(e, t) {
    t = t.checked, t != null && ke(e, "checked", t, !1);
  }
  function eo(e, t) {
    xr(e, t);
    var n = je(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? on(e, t.type, n) : t.hasOwnProperty("defaultValue") && on(e, t.type, je(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Ln(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function on(e, t, n) {
    (t !== "number" || ft(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var jr = Array.isArray;
  function jn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
      for (n = 0; n < e.length; n++) o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + je(n), t = null, o = 0; o < e.length; o++) {
        if (e[o].value === n) {
          e[o].selected = !0, r && (e[o].defaultSelected = !0);
          return;
        }
        t !== null || e[o].disabled || (t = e[o]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Sr(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return K({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Sn(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(u(92));
        if (jr(n)) {
          if (1 < n.length) throw Error(u(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: je(n) };
  }
  function to(e, t) {
    var n = je(t.value), r = je(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function kr(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Fn(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function no(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Fn(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Dn, Gn = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, o) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, o);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Dn = Dn || document.createElement("div"), Dn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Dn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function pt(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Ce = {
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
  Object.keys(Ce).forEach(function(e) {
    _r.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Ce[t] = Ce[e];
    });
  });
  function He(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Ce.hasOwnProperty(e) && Ce[e] ? ("" + t).trim() : t + "px";
  }
  function ro(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, o = He(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o;
    }
  }
  var Uo = K({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Zn(e, t) {
    if (t) {
      if (Uo[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function bo(e, t) {
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
  var kn = null;
  function oo(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Bo = null, _n = null, sn = null;
  function so(e) {
    if (e = us(e)) {
      if (typeof Bo != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = oi(t), Bo(e.stateNode, e.type, t));
    }
  }
  function io(e) {
    _n ? sn ? sn.push(e) : sn = [e] : _n = e;
  }
  function Wo() {
    if (_n) {
      var e = _n, t = sn;
      if (sn = _n = null, so(e), t) for (e = 0; e < t.length; e++) so(t[e]);
    }
  }
  function $s(e, t) {
    return e(t);
  }
  function Er() {
  }
  var Vo = !1;
  function Ho(e, t, n) {
    if (Vo) return e(t, n);
    Vo = !0;
    try {
      return $s(e, t, n);
    } finally {
      Vo = !1, (_n !== null || sn !== null) && (Er(), Wo());
    }
  }
  function gt(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = oi(n);
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
    if (n && typeof n != "function") throw Error(u(231, t, typeof n));
    return n;
  }
  var Cr = !1;
  if (_) try {
    var Qt = {};
    Object.defineProperty(Qt, "passive", { get: function() {
      Cr = !0;
    } }), window.addEventListener("test", Qt, Qt), window.removeEventListener("test", Qt, Qt);
  } catch {
    Cr = !1;
  }
  function Kt(e, t, n, r, o, i, d, m, g) {
    var N = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, N);
    } catch (D) {
      this.onError(D);
    }
  }
  var Pr = !1, En = null, Ft = !1, Qo = null, na = { onError: function(e) {
    Pr = !0, En = e;
  } };
  function Nr(e, t, n, r, o, i, d, m, g) {
    Pr = !1, En = null, Kt.apply(na, arguments);
  }
  function Ms(e, t, n, r, o, i, d, m, g) {
    if (Nr.apply(this, arguments), Pr) {
      if (Pr) {
        var N = En;
        Pr = !1, En = null;
      } else throw Error(u(198));
      Ft || (Ft = !0, Qo = N);
    }
  }
  function Cn(e) {
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
  function zs(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Tr(e) {
    if (Cn(e) !== e) throw Error(u(188));
  }
  function ra(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Cn(e), t === null) throw Error(u(188));
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
          if (i === n) return Tr(o), e;
          if (i === r) return Tr(o), t;
          i = i.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== r.return) n = o, r = i;
      else {
        for (var d = !1, m = o.child; m; ) {
          if (m === n) {
            d = !0, n = o, r = i;
            break;
          }
          if (m === r) {
            d = !0, r = o, n = i;
            break;
          }
          m = m.sibling;
        }
        if (!d) {
          for (m = i.child; m; ) {
            if (m === n) {
              d = !0, n = i, r = o;
              break;
            }
            if (m === r) {
              d = !0, r = i, n = o;
              break;
            }
            m = m.sibling;
          }
          if (!d) throw Error(u(189));
        }
      }
      if (n.alternate !== r) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? e : t;
  }
  function Ar(e) {
    return e = ra(e), e !== null ? ot(e) : null;
  }
  function ot(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = ot(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ls = l.unstable_scheduleCallback, ao = l.unstable_cancelCallback, Fs = l.unstable_shouldYield, Ds = l.unstable_requestPaint, Xe = l.unstable_now, lo = l.unstable_getCurrentPriorityLevel, an = l.unstable_ImmediatePriority, Us = l.unstable_UserBlockingPriority, uo = l.unstable_NormalPriority, oa = l.unstable_LowPriority, bs = l.unstable_IdlePriority, Ir = null, qt = null;
  function sa(e) {
    if (qt && typeof qt.onCommitFiberRoot == "function") try {
      qt.onCommitFiberRoot(Ir, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dt = Math.clz32 ? Math.clz32 : Ws, Bs = Math.log, Ko = Math.LN2;
  function Ws(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Bs(e) / Ko | 0) | 0;
  }
  var co = 64, fo = 4194304;
  function Rr(e) {
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
  function Or(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, o = e.suspendedLanes, i = e.pingedLanes, d = n & 268435455;
    if (d !== 0) {
      var m = d & ~o;
      m !== 0 ? r = Rr(m) : (i &= d, i !== 0 && (r = Rr(i)));
    } else d = n & ~o, d !== 0 ? r = Rr(d) : i !== 0 && (r = Rr(i));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & o) === 0 && (o = r & -r, i = t & -t, o >= i || o === 16 && (i & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - Dt(t), o = 1 << n, r |= e[n], t &= ~o;
    return r;
  }
  function Vs(e, t) {
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
  function Hs(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, o = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
      var d = 31 - Dt(i), m = 1 << d, g = o[d];
      g === -1 ? ((m & n) === 0 || (m & r) !== 0) && (o[d] = Vs(m, t)) : g <= t && (e.expiredLanes |= m), i &= ~m;
    }
  }
  function $r(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Qs() {
    var e = co;
    return co <<= 1, (co & 4194240) === 0 && (co = 64), e;
  }
  function er(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Un(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - Dt(t), e[t] = n;
  }
  function ia(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var o = 31 - Dt(n), i = 1 << o;
      t[o] = 0, r[o] = -1, e[o] = -1, n &= ~i;
    }
  }
  function qo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - Dt(n), o = 1 << r;
      o & t | e[r] & t && (e[r] |= t), n &= ~o;
    }
  }
  var $e = 0;
  function Jo(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Ks, Xo, qs, Yo, Js, po = !1, Mr = [], ln = null, un = null, Jt = null, zr = /* @__PURE__ */ new Map(), Lr = /* @__PURE__ */ new Map(), a = [], h = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function w(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        ln = null;
        break;
      case "dragenter":
      case "dragleave":
        un = null;
        break;
      case "mouseover":
      case "mouseout":
        Jt = null;
        break;
      case "pointerover":
      case "pointerout":
        zr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Lr.delete(t.pointerId);
    }
  }
  function I(e, t, n, r, o, i) {
    return e === null || e.nativeEvent !== i ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: i, targetContainers: [o] }, t !== null && (t = us(t), t !== null && Xo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, o !== null && t.indexOf(o) === -1 && t.push(o), e);
  }
  function E(e, t, n, r, o) {
    switch (t) {
      case "focusin":
        return ln = I(ln, e, t, n, r, o), !0;
      case "dragenter":
        return un = I(un, e, t, n, r, o), !0;
      case "mouseover":
        return Jt = I(Jt, e, t, n, r, o), !0;
      case "pointerover":
        var i = o.pointerId;
        return zr.set(i, I(zr.get(i) || null, e, t, n, r, o)), !0;
      case "gotpointercapture":
        return i = o.pointerId, Lr.set(i, I(Lr.get(i) || null, e, t, n, r, o)), !0;
    }
    return !1;
  }
  function P(e) {
    var t = Fr(e.target);
    if (t !== null) {
      var n = Cn(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = zs(n), t !== null) {
            e.blockedOn = t, Js(e.priority, function() {
              qs(n);
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
  function z(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Fe(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        kn = r, n.target.dispatchEvent(r), kn = null;
      } else return t = us(n), t !== null && Xo(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function U(e, t, n) {
    z(e) && n.delete(t);
  }
  function he() {
    po = !1, ln !== null && z(ln) && (ln = null), un !== null && z(un) && (un = null), Jt !== null && z(Jt) && (Jt = null), zr.forEach(U), Lr.forEach(U);
  }
  function V(e, t) {
    e.blockedOn === t && (e.blockedOn = null, po || (po = !0, l.unstable_scheduleCallback(l.unstable_NormalPriority, he)));
  }
  function ae(e) {
    function t(o) {
      return V(o, e);
    }
    if (0 < Mr.length) {
      V(Mr[0], e);
      for (var n = 1; n < Mr.length; n++) {
        var r = Mr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (ln !== null && V(ln, e), un !== null && V(un, e), Jt !== null && V(Jt, e), zr.forEach(t), Lr.forEach(t), n = 0; n < a.length; n++) r = a[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < a.length && (n = a[0], n.blockedOn === null); ) P(n), n.blockedOn === null && a.shift();
  }
  var ne = pe.ReactCurrentBatchConfig, _e = !0;
  function Pe(e, t, n, r) {
    var o = $e, i = ne.transition;
    ne.transition = null;
    try {
      $e = 1, st(e, t, n, r);
    } finally {
      $e = o, ne.transition = i;
    }
  }
  function be(e, t, n, r) {
    var o = $e, i = ne.transition;
    ne.transition = null;
    try {
      $e = 4, st(e, t, n, r);
    } finally {
      $e = o, ne.transition = i;
    }
  }
  function st(e, t, n, r) {
    if (_e) {
      var o = Fe(e, t, n, r);
      if (o === null) ja(e, t, r, q, n), w(e, r);
      else if (E(o, e, t, n, r)) r.stopPropagation();
      else if (w(e, r), t & 4 && -1 < h.indexOf(e)) {
        for (; o !== null; ) {
          var i = us(o);
          if (i !== null && Ks(i), i = Fe(e, t, n, r), i === null && ja(e, t, r, q, n), i === o) break;
          o = i;
        }
        o !== null && r.stopPropagation();
      } else ja(e, t, r, null, n);
    }
  }
  var q = null;
  function Fe(e, t, n, r) {
    if (q = null, e = oo(r), e = Fr(e), e !== null) if (t = Cn(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = zs(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return q = e, null;
  }
  function Ut(e) {
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
        switch (lo()) {
          case an:
            return 1;
          case Us:
            return 4;
          case uo:
          case oa:
            return 16;
          case bs:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var bt = null, ho = null, Be = null;
  function mo() {
    if (Be) return Be;
    var e, t = ho, n = t.length, r, o = "value" in bt ? bt.value : bt.textContent, i = o.length;
    for (e = 0; e < n && t[e] === o[e]; e++) ;
    var d = n - e;
    for (r = 1; r <= d && t[n - r] === o[i - r]; r++) ;
    return Be = o.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Xt(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function wt() {
    return !0;
  }
  function Go() {
    return !1;
  }
  function xt(e) {
    function t(n, r, o, i, d) {
      this._reactName = n, this._targetInst = o, this.type = r, this.nativeEvent = i, this.target = d, this.currentTarget = null;
      for (var m in e) e.hasOwnProperty(m) && (n = e[m], this[m] = n ? n(i) : i[m]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? wt : Go, this.isPropagationStopped = Go, this;
    }
    return K(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = wt);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = wt);
    }, persist: function() {
    }, isPersistent: wt }), t;
  }
  var bn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, At = xt(bn), cn = K({}, bn, { view: 0, detail: 0 }), of = xt(cn), aa, la, Zo, Xs = K({}, cn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ca, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Zo && (Zo && e.type === "mousemove" ? (aa = e.screenX - Zo.screenX, la = e.screenY - Zo.screenY) : la = aa = 0, Zo = e), aa);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : la;
  } }), tu = xt(Xs), sf = K({}, Xs, { dataTransfer: 0 }), af = xt(sf), lf = K({}, cn, { relatedTarget: 0 }), ua = xt(lf), uf = K({}, bn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), cf = xt(uf), df = K({}, bn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), ff = xt(df), pf = K({}, bn, { data: 0 }), nu = xt(pf), hf = {
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
  }, mf = {
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
  }, vf = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function yf(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = vf[e]) ? !!t[e] : !1;
  }
  function ca() {
    return yf;
  }
  var gf = K({}, cn, { key: function(e) {
    if (e.key) {
      var t = hf[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Xt(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? mf[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ca, charCode: function(e) {
    return e.type === "keypress" ? Xt(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Xt(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), wf = xt(gf), xf = K({}, Xs, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), ru = xt(xf), jf = K({}, cn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ca }), Sf = xt(jf), kf = K({}, bn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), _f = xt(kf), Ef = K({}, Xs, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Cf = xt(Ef), Pf = [9, 13, 27, 32], da = _ && "CompositionEvent" in window, es = null;
  _ && "documentMode" in document && (es = document.documentMode);
  var Nf = _ && "TextEvent" in window && !es, ou = _ && (!da || es && 8 < es && 11 >= es), su = " ", iu = !1;
  function au(e, t) {
    switch (e) {
      case "keyup":
        return Pf.indexOf(t.keyCode) !== -1;
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
  function lu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var vo = !1;
  function Tf(e, t) {
    switch (e) {
      case "compositionend":
        return lu(t);
      case "keypress":
        return t.which !== 32 ? null : (iu = !0, su);
      case "textInput":
        return e = t.data, e === su && iu ? null : e;
      default:
        return null;
    }
  }
  function Af(e, t) {
    if (vo) return e === "compositionend" || !da && au(e, t) ? (e = mo(), Be = ho = bt = null, vo = !1, e) : null;
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
        return ou && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var If = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function uu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!If[e.type] : t === "textarea";
  }
  function cu(e, t, n, r) {
    io(r), t = ti(t, "onChange"), 0 < t.length && (n = new At("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var ts = null, ns = null;
  function Rf(e) {
    Nu(e, 0);
  }
  function Ys(e) {
    var t = jo(e);
    if (yt(t)) return e;
  }
  function Of(e, t) {
    if (e === "change") return t;
  }
  var du = !1;
  if (_) {
    var fa;
    if (_) {
      var pa = "oninput" in document;
      if (!pa) {
        var fu = document.createElement("div");
        fu.setAttribute("oninput", "return;"), pa = typeof fu.oninput == "function";
      }
      fa = pa;
    } else fa = !1;
    du = fa && (!document.documentMode || 9 < document.documentMode);
  }
  function pu() {
    ts && (ts.detachEvent("onpropertychange", hu), ns = ts = null);
  }
  function hu(e) {
    if (e.propertyName === "value" && Ys(ns)) {
      var t = [];
      cu(t, ns, e, oo(e)), Ho(Rf, t);
    }
  }
  function $f(e, t, n) {
    e === "focusin" ? (pu(), ts = t, ns = n, ts.attachEvent("onpropertychange", hu)) : e === "focusout" && pu();
  }
  function Mf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Ys(ns);
  }
  function zf(e, t) {
    if (e === "click") return Ys(t);
  }
  function Lf(e, t) {
    if (e === "input" || e === "change") return Ys(t);
  }
  function Ff(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var dn = typeof Object.is == "function" ? Object.is : Ff;
  function rs(e, t) {
    if (dn(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var o = n[r];
      if (!S.call(t, o) || !dn(e[o], t[o])) return !1;
    }
    return !0;
  }
  function mu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function vu(e, t) {
    var n = mu(e);
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
      n = mu(n);
    }
  }
  function yu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? yu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function gu() {
    for (var e = window, t = ft(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ft(e.document);
    }
    return t;
  }
  function ha(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Df(e) {
    var t = gu(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && yu(n.ownerDocument.documentElement, n)) {
      if (r !== null && ha(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var o = n.textContent.length, i = Math.min(r.start, o);
          r = r.end === void 0 ? i : Math.min(r.end, o), !e.extend && i > r && (o = r, r = i, i = o), o = vu(n, i);
          var d = vu(
            n,
            r
          );
          o && d && (e.rangeCount !== 1 || e.anchorNode !== o.node || e.anchorOffset !== o.offset || e.focusNode !== d.node || e.focusOffset !== d.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(d.node, d.offset)) : (t.setEnd(d.node, d.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Uf = _ && "documentMode" in document && 11 >= document.documentMode, yo = null, ma = null, os = null, va = !1;
  function wu(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    va || yo == null || yo !== ft(r) || (r = yo, "selectionStart" in r && ha(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), os && rs(os, r) || (os = r, r = ti(ma, "onSelect"), 0 < r.length && (t = new At("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = yo)));
  }
  function Gs(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var go = { animationend: Gs("Animation", "AnimationEnd"), animationiteration: Gs("Animation", "AnimationIteration"), animationstart: Gs("Animation", "AnimationStart"), transitionend: Gs("Transition", "TransitionEnd") }, ya = {}, xu = {};
  _ && (xu = document.createElement("div").style, "AnimationEvent" in window || (delete go.animationend.animation, delete go.animationiteration.animation, delete go.animationstart.animation), "TransitionEvent" in window || delete go.transitionend.transition);
  function Zs(e) {
    if (ya[e]) return ya[e];
    if (!go[e]) return e;
    var t = go[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in xu) return ya[e] = t[n];
    return e;
  }
  var ju = Zs("animationend"), Su = Zs("animationiteration"), ku = Zs("animationstart"), _u = Zs("transitionend"), Eu = /* @__PURE__ */ new Map(), Cu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function tr(e, t) {
    Eu.set(e, t), v(t, [e]);
  }
  for (var ga = 0; ga < Cu.length; ga++) {
    var wa = Cu[ga], bf = wa.toLowerCase(), Bf = wa[0].toUpperCase() + wa.slice(1);
    tr(bf, "on" + Bf);
  }
  tr(ju, "onAnimationEnd"), tr(Su, "onAnimationIteration"), tr(ku, "onAnimationStart"), tr("dblclick", "onDoubleClick"), tr("focusin", "onFocus"), tr("focusout", "onBlur"), tr(_u, "onTransitionEnd"), y("onMouseEnter", ["mouseout", "mouseover"]), y("onMouseLeave", ["mouseout", "mouseover"]), y("onPointerEnter", ["pointerout", "pointerover"]), y("onPointerLeave", ["pointerout", "pointerover"]), v("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), v("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), v("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), v("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), v("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), v("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ss = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Wf = new Set("cancel close invalid load scroll toggle".split(" ").concat(ss));
  function Pu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Ms(r, t, void 0, e), e.currentTarget = null;
  }
  function Nu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], o = r.event;
      r = r.listeners;
      e: {
        var i = void 0;
        if (t) for (var d = r.length - 1; 0 <= d; d--) {
          var m = r[d], g = m.instance, N = m.currentTarget;
          if (m = m.listener, g !== i && o.isPropagationStopped()) break e;
          Pu(o, m, N), i = g;
        }
        else for (d = 0; d < r.length; d++) {
          if (m = r[d], g = m.instance, N = m.currentTarget, m = m.listener, g !== i && o.isPropagationStopped()) break e;
          Pu(o, m, N), i = g;
        }
      }
    }
    if (Ft) throw e = Qo, Ft = !1, Qo = null, e;
  }
  function Qe(e, t) {
    var n = t[Pa];
    n === void 0 && (n = t[Pa] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (Tu(t, e, 2, !1), n.add(r));
  }
  function xa(e, t, n) {
    var r = 0;
    t && (r |= 4), Tu(n, e, r, t);
  }
  var ei = "_reactListening" + Math.random().toString(36).slice(2);
  function is(e) {
    if (!e[ei]) {
      e[ei] = !0, f.forEach(function(n) {
        n !== "selectionchange" && (Wf.has(n) || xa(n, !1, e), xa(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ei] || (t[ei] = !0, xa("selectionchange", !1, t));
    }
  }
  function Tu(e, t, n, r) {
    switch (Ut(t)) {
      case 1:
        var o = Pe;
        break;
      case 4:
        o = be;
        break;
      default:
        o = st;
    }
    n = o.bind(null, t, n, e), o = void 0, !Cr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (o = !0), r ? o !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: o }) : e.addEventListener(t, n, !0) : o !== void 0 ? e.addEventListener(t, n, { passive: o }) : e.addEventListener(t, n, !1);
  }
  function ja(e, t, n, r, o) {
    var i = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var d = r.tag;
      if (d === 3 || d === 4) {
        var m = r.stateNode.containerInfo;
        if (m === o || m.nodeType === 8 && m.parentNode === o) break;
        if (d === 4) for (d = r.return; d !== null; ) {
          var g = d.tag;
          if ((g === 3 || g === 4) && (g = d.stateNode.containerInfo, g === o || g.nodeType === 8 && g.parentNode === o)) return;
          d = d.return;
        }
        for (; m !== null; ) {
          if (d = Fr(m), d === null) return;
          if (g = d.tag, g === 5 || g === 6) {
            r = i = d;
            continue e;
          }
          m = m.parentNode;
        }
      }
      r = r.return;
    }
    Ho(function() {
      var N = i, D = oo(n), b = [];
      e: {
        var L = Eu.get(e);
        if (L !== void 0) {
          var J = At, Z = e;
          switch (e) {
            case "keypress":
              if (Xt(n) === 0) break e;
            case "keydown":
            case "keyup":
              J = wf;
              break;
            case "focusin":
              Z = "focus", J = ua;
              break;
            case "focusout":
              Z = "blur", J = ua;
              break;
            case "beforeblur":
            case "afterblur":
              J = ua;
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
              J = tu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              J = af;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              J = Sf;
              break;
            case ju:
            case Su:
            case ku:
              J = cf;
              break;
            case _u:
              J = _f;
              break;
            case "scroll":
              J = of;
              break;
            case "wheel":
              J = Cf;
              break;
            case "copy":
            case "cut":
            case "paste":
              J = ff;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              J = ru;
          }
          var te = (t & 4) !== 0, rt = !te && e === "scroll", k = te ? L !== null ? L + "Capture" : null : L;
          te = [];
          for (var x = N, C; x !== null; ) {
            C = x;
            var W = C.stateNode;
            if (C.tag === 5 && W !== null && (C = W, k !== null && (W = gt(x, k), W != null && te.push(as(x, W, C)))), rt) break;
            x = x.return;
          }
          0 < te.length && (L = new J(L, Z, null, n, D), b.push({ event: L, listeners: te }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (L = e === "mouseover" || e === "pointerover", J = e === "mouseout" || e === "pointerout", L && n !== kn && (Z = n.relatedTarget || n.fromElement) && (Fr(Z) || Z[Bn])) break e;
          if ((J || L) && (L = D.window === D ? D : (L = D.ownerDocument) ? L.defaultView || L.parentWindow : window, J ? (Z = n.relatedTarget || n.toElement, J = N, Z = Z ? Fr(Z) : null, Z !== null && (rt = Cn(Z), Z !== rt || Z.tag !== 5 && Z.tag !== 6) && (Z = null)) : (J = null, Z = N), J !== Z)) {
            if (te = tu, W = "onMouseLeave", k = "onMouseEnter", x = "mouse", (e === "pointerout" || e === "pointerover") && (te = ru, W = "onPointerLeave", k = "onPointerEnter", x = "pointer"), rt = J == null ? L : jo(J), C = Z == null ? L : jo(Z), L = new te(W, x + "leave", J, n, D), L.target = rt, L.relatedTarget = C, W = null, Fr(D) === N && (te = new te(k, x + "enter", Z, n, D), te.target = C, te.relatedTarget = rt, W = te), rt = W, J && Z) t: {
              for (te = J, k = Z, x = 0, C = te; C; C = wo(C)) x++;
              for (C = 0, W = k; W; W = wo(W)) C++;
              for (; 0 < x - C; ) te = wo(te), x--;
              for (; 0 < C - x; ) k = wo(k), C--;
              for (; x--; ) {
                if (te === k || k !== null && te === k.alternate) break t;
                te = wo(te), k = wo(k);
              }
              te = null;
            }
            else te = null;
            J !== null && Au(b, L, J, te, !1), Z !== null && rt !== null && Au(b, rt, Z, te, !0);
          }
        }
        e: {
          if (L = N ? jo(N) : window, J = L.nodeName && L.nodeName.toLowerCase(), J === "select" || J === "input" && L.type === "file") var re = Of;
          else if (uu(L)) if (du) re = Lf;
          else {
            re = Mf;
            var le = $f;
          }
          else (J = L.nodeName) && J.toLowerCase() === "input" && (L.type === "checkbox" || L.type === "radio") && (re = zf);
          if (re && (re = re(e, N))) {
            cu(b, re, n, D);
            break e;
          }
          le && le(e, L, N), e === "focusout" && (le = L._wrapperState) && le.controlled && L.type === "number" && on(L, "number", L.value);
        }
        switch (le = N ? jo(N) : window, e) {
          case "focusin":
            (uu(le) || le.contentEditable === "true") && (yo = le, ma = N, os = null);
            break;
          case "focusout":
            os = ma = yo = null;
            break;
          case "mousedown":
            va = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            va = !1, wu(b, n, D);
            break;
          case "selectionchange":
            if (Uf) break;
          case "keydown":
          case "keyup":
            wu(b, n, D);
        }
        var ue;
        if (da) e: {
          switch (e) {
            case "compositionstart":
              var ge = "onCompositionStart";
              break e;
            case "compositionend":
              ge = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ge = "onCompositionUpdate";
              break e;
          }
          ge = void 0;
        }
        else vo ? au(e, n) && (ge = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ge = "onCompositionStart");
        ge && (ou && n.locale !== "ko" && (vo || ge !== "onCompositionStart" ? ge === "onCompositionEnd" && vo && (ue = mo()) : (bt = D, ho = "value" in bt ? bt.value : bt.textContent, vo = !0)), le = ti(N, ge), 0 < le.length && (ge = new nu(ge, e, null, n, D), b.push({ event: ge, listeners: le }), ue ? ge.data = ue : (ue = lu(n), ue !== null && (ge.data = ue)))), (ue = Nf ? Tf(e, n) : Af(e, n)) && (N = ti(N, "onBeforeInput"), 0 < N.length && (D = new nu("onBeforeInput", "beforeinput", null, n, D), b.push({ event: D, listeners: N }), D.data = ue));
      }
      Nu(b, t);
    });
  }
  function as(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function ti(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var o = e, i = o.stateNode;
      o.tag === 5 && i !== null && (o = i, i = gt(e, n), i != null && r.unshift(as(e, i, o)), i = gt(e, t), i != null && r.push(as(e, i, o))), e = e.return;
    }
    return r;
  }
  function wo(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Au(e, t, n, r, o) {
    for (var i = t._reactName, d = []; n !== null && n !== r; ) {
      var m = n, g = m.alternate, N = m.stateNode;
      if (g !== null && g === r) break;
      m.tag === 5 && N !== null && (m = N, o ? (g = gt(n, i), g != null && d.unshift(as(n, g, m))) : o || (g = gt(n, i), g != null && d.push(as(n, g, m)))), n = n.return;
    }
    d.length !== 0 && e.push({ event: t, listeners: d });
  }
  var Vf = /\r\n?/g, Hf = /\u0000|\uFFFD/g;
  function Iu(e) {
    return (typeof e == "string" ? e : "" + e).replace(Vf, `
`).replace(Hf, "");
  }
  function ni(e, t, n) {
    if (t = Iu(t), Iu(e) !== t && n) throw Error(u(425));
  }
  function ri() {
  }
  var Sa = null, ka = null;
  function _a(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Ea = typeof setTimeout == "function" ? setTimeout : void 0, Qf = typeof clearTimeout == "function" ? clearTimeout : void 0, Ru = typeof Promise == "function" ? Promise : void 0, Kf = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ru < "u" ? function(e) {
    return Ru.resolve(null).then(e).catch(qf);
  } : Ea;
  function qf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ca(e, t) {
    var n = t, r = 0;
    do {
      var o = n.nextSibling;
      if (e.removeChild(n), o && o.nodeType === 8) if (n = o.data, n === "/$") {
        if (r === 0) {
          e.removeChild(o), ae(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = o;
    } while (n);
    ae(t);
  }
  function nr(e) {
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
  function Ou(e) {
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
  var xo = Math.random().toString(36).slice(2), Pn = "__reactFiber$" + xo, ls = "__reactProps$" + xo, Bn = "__reactContainer$" + xo, Pa = "__reactEvents$" + xo, Jf = "__reactListeners$" + xo, Xf = "__reactHandles$" + xo;
  function Fr(e) {
    var t = e[Pn];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Bn] || n[Pn]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Ou(e); e !== null; ) {
          if (n = e[Pn]) return n;
          e = Ou(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function us(e) {
    return e = e[Pn] || e[Bn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function jo(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function oi(e) {
    return e[ls] || null;
  }
  var Na = [], So = -1;
  function rr(e) {
    return { current: e };
  }
  function Ke(e) {
    0 > So || (e.current = Na[So], Na[So] = null, So--);
  }
  function We(e, t) {
    So++, Na[So] = e.current, e.current = t;
  }
  var or = {}, jt = rr(or), It = rr(!1), Dr = or;
  function ko(e, t) {
    var n = e.type.contextTypes;
    if (!n) return or;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o = {}, i;
    for (i in n) o[i] = t[i];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = o), o;
  }
  function Rt(e) {
    return e = e.childContextTypes, e != null;
  }
  function si() {
    Ke(It), Ke(jt);
  }
  function $u(e, t, n) {
    if (jt.current !== or) throw Error(u(168));
    We(jt, t), We(It, n);
  }
  function Mu(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var o in r) if (!(o in t)) throw Error(u(108, Te(e) || "Unknown", o));
    return K({}, n, r);
  }
  function ii(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || or, Dr = jt.current, We(jt, e), We(It, It.current), !0;
  }
  function zu(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(u(169));
    n ? (e = Mu(e, t, Dr), r.__reactInternalMemoizedMergedChildContext = e, Ke(It), Ke(jt), We(jt, e)) : Ke(It), We(It, n);
  }
  var Wn = null, ai = !1, Ta = !1;
  function Lu(e) {
    Wn === null ? Wn = [e] : Wn.push(e);
  }
  function Yf(e) {
    ai = !0, Lu(e);
  }
  function sr() {
    if (!Ta && Wn !== null) {
      Ta = !0;
      var e = 0, t = $e;
      try {
        var n = Wn;
        for ($e = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Wn = null, ai = !1;
      } catch (o) {
        throw Wn !== null && (Wn = Wn.slice(e + 1)), Ls(an, sr), o;
      } finally {
        $e = t, Ta = !1;
      }
    }
    return null;
  }
  var _o = [], Eo = 0, li = null, ui = 0, Yt = [], Gt = 0, Ur = null, Vn = 1, Hn = "";
  function br(e, t) {
    _o[Eo++] = ui, _o[Eo++] = li, li = e, ui = t;
  }
  function Fu(e, t, n) {
    Yt[Gt++] = Vn, Yt[Gt++] = Hn, Yt[Gt++] = Ur, Ur = e;
    var r = Vn;
    e = Hn;
    var o = 32 - Dt(r) - 1;
    r &= ~(1 << o), n += 1;
    var i = 32 - Dt(t) + o;
    if (30 < i) {
      var d = o - o % 5;
      i = (r & (1 << d) - 1).toString(32), r >>= d, o -= d, Vn = 1 << 32 - Dt(t) + o | n << o | r, Hn = i + e;
    } else Vn = 1 << i | n << o | r, Hn = e;
  }
  function Aa(e) {
    e.return !== null && (br(e, 1), Fu(e, 1, 0));
  }
  function Ia(e) {
    for (; e === li; ) li = _o[--Eo], _o[Eo] = null, ui = _o[--Eo], _o[Eo] = null;
    for (; e === Ur; ) Ur = Yt[--Gt], Yt[Gt] = null, Hn = Yt[--Gt], Yt[Gt] = null, Vn = Yt[--Gt], Yt[Gt] = null;
  }
  var Bt = null, Wt = null, Ye = !1, fn = null;
  function Du(e, t) {
    var n = nn(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Uu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Bt = e, Wt = nr(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Bt = e, Wt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Ur !== null ? { id: Vn, overflow: Hn } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = nn(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Bt = e, Wt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ra(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Oa(e) {
    if (Ye) {
      var t = Wt;
      if (t) {
        var n = t;
        if (!Uu(e, t)) {
          if (Ra(e)) throw Error(u(418));
          t = nr(n.nextSibling);
          var r = Bt;
          t && Uu(e, t) ? Du(r, n) : (e.flags = e.flags & -4097 | 2, Ye = !1, Bt = e);
        }
      } else {
        if (Ra(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, Ye = !1, Bt = e;
      }
    }
  }
  function bu(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    Bt = e;
  }
  function ci(e) {
    if (e !== Bt) return !1;
    if (!Ye) return bu(e), Ye = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !_a(e.type, e.memoizedProps)), t && (t = Wt)) {
      if (Ra(e)) throw Bu(), Error(u(418));
      for (; t; ) Du(e, t), t = nr(t.nextSibling);
    }
    if (bu(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                Wt = nr(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        Wt = null;
      }
    } else Wt = Bt ? nr(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Bu() {
    for (var e = Wt; e; ) e = nr(e.nextSibling);
  }
  function Co() {
    Wt = Bt = null, Ye = !1;
  }
  function $a(e) {
    fn === null ? fn = [e] : fn.push(e);
  }
  var Gf = pe.ReactCurrentBatchConfig;
  function cs(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(u(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(u(147, e));
        var o = r, i = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === i ? t.ref : (t = function(d) {
          var m = o.refs;
          d === null ? delete m[i] : m[i] = d;
        }, t._stringRef = i, t);
      }
      if (typeof e != "string") throw Error(u(284));
      if (!n._owner) throw Error(u(290, e));
    }
    return e;
  }
  function di(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Wu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Vu(e) {
    function t(k, x) {
      if (e) {
        var C = k.deletions;
        C === null ? (k.deletions = [x], k.flags |= 16) : C.push(x);
      }
    }
    function n(k, x) {
      if (!e) return null;
      for (; x !== null; ) t(k, x), x = x.sibling;
      return null;
    }
    function r(k, x) {
      for (k = /* @__PURE__ */ new Map(); x !== null; ) x.key !== null ? k.set(x.key, x) : k.set(x.index, x), x = x.sibling;
      return k;
    }
    function o(k, x) {
      return k = pr(k, x), k.index = 0, k.sibling = null, k;
    }
    function i(k, x, C) {
      return k.index = C, e ? (C = k.alternate, C !== null ? (C = C.index, C < x ? (k.flags |= 2, x) : C) : (k.flags |= 2, x)) : (k.flags |= 1048576, x);
    }
    function d(k) {
      return e && k.alternate === null && (k.flags |= 2), k;
    }
    function m(k, x, C, W) {
      return x === null || x.tag !== 6 ? (x = El(C, k.mode, W), x.return = k, x) : (x = o(x, C), x.return = k, x);
    }
    function g(k, x, C, W) {
      var re = C.type;
      return re === fe ? D(k, x, C.props.children, W, C.key) : x !== null && (x.elementType === re || typeof re == "object" && re !== null && re.$$typeof === Ae && Wu(re) === x.type) ? (W = o(x, C.props), W.ref = cs(k, x, C), W.return = k, W) : (W = Mi(C.type, C.key, C.props, null, k.mode, W), W.ref = cs(k, x, C), W.return = k, W);
    }
    function N(k, x, C, W) {
      return x === null || x.tag !== 4 || x.stateNode.containerInfo !== C.containerInfo || x.stateNode.implementation !== C.implementation ? (x = Cl(C, k.mode, W), x.return = k, x) : (x = o(x, C.children || []), x.return = k, x);
    }
    function D(k, x, C, W, re) {
      return x === null || x.tag !== 7 ? (x = Jr(C, k.mode, W, re), x.return = k, x) : (x = o(x, C), x.return = k, x);
    }
    function b(k, x, C) {
      if (typeof x == "string" && x !== "" || typeof x == "number") return x = El("" + x, k.mode, C), x.return = k, x;
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case Se:
            return C = Mi(x.type, x.key, x.props, null, k.mode, C), C.ref = cs(k, null, x), C.return = k, C;
          case de:
            return x = Cl(x, k.mode, C), x.return = k, x;
          case Ae:
            var W = x._init;
            return b(k, W(x._payload), C);
        }
        if (jr(x) || X(x)) return x = Jr(x, k.mode, C, null), x.return = k, x;
        di(k, x);
      }
      return null;
    }
    function L(k, x, C, W) {
      var re = x !== null ? x.key : null;
      if (typeof C == "string" && C !== "" || typeof C == "number") return re !== null ? null : m(k, x, "" + C, W);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case Se:
            return C.key === re ? g(k, x, C, W) : null;
          case de:
            return C.key === re ? N(k, x, C, W) : null;
          case Ae:
            return re = C._init, L(
              k,
              x,
              re(C._payload),
              W
            );
        }
        if (jr(C) || X(C)) return re !== null ? null : D(k, x, C, W, null);
        di(k, C);
      }
      return null;
    }
    function J(k, x, C, W, re) {
      if (typeof W == "string" && W !== "" || typeof W == "number") return k = k.get(C) || null, m(x, k, "" + W, re);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case Se:
            return k = k.get(W.key === null ? C : W.key) || null, g(x, k, W, re);
          case de:
            return k = k.get(W.key === null ? C : W.key) || null, N(x, k, W, re);
          case Ae:
            var le = W._init;
            return J(k, x, C, le(W._payload), re);
        }
        if (jr(W) || X(W)) return k = k.get(C) || null, D(x, k, W, re, null);
        di(x, W);
      }
      return null;
    }
    function Z(k, x, C, W) {
      for (var re = null, le = null, ue = x, ge = x = 0, dt = null; ue !== null && ge < C.length; ge++) {
        ue.index > ge ? (dt = ue, ue = null) : dt = ue.sibling;
        var Me = L(k, ue, C[ge], W);
        if (Me === null) {
          ue === null && (ue = dt);
          break;
        }
        e && ue && Me.alternate === null && t(k, ue), x = i(Me, x, ge), le === null ? re = Me : le.sibling = Me, le = Me, ue = dt;
      }
      if (ge === C.length) return n(k, ue), Ye && br(k, ge), re;
      if (ue === null) {
        for (; ge < C.length; ge++) ue = b(k, C[ge], W), ue !== null && (x = i(ue, x, ge), le === null ? re = ue : le.sibling = ue, le = ue);
        return Ye && br(k, ge), re;
      }
      for (ue = r(k, ue); ge < C.length; ge++) dt = J(ue, k, ge, C[ge], W), dt !== null && (e && dt.alternate !== null && ue.delete(dt.key === null ? ge : dt.key), x = i(dt, x, ge), le === null ? re = dt : le.sibling = dt, le = dt);
      return e && ue.forEach(function(hr) {
        return t(k, hr);
      }), Ye && br(k, ge), re;
    }
    function te(k, x, C, W) {
      var re = X(C);
      if (typeof re != "function") throw Error(u(150));
      if (C = re.call(C), C == null) throw Error(u(151));
      for (var le = re = null, ue = x, ge = x = 0, dt = null, Me = C.next(); ue !== null && !Me.done; ge++, Me = C.next()) {
        ue.index > ge ? (dt = ue, ue = null) : dt = ue.sibling;
        var hr = L(k, ue, Me.value, W);
        if (hr === null) {
          ue === null && (ue = dt);
          break;
        }
        e && ue && hr.alternate === null && t(k, ue), x = i(hr, x, ge), le === null ? re = hr : le.sibling = hr, le = hr, ue = dt;
      }
      if (Me.done) return n(
        k,
        ue
      ), Ye && br(k, ge), re;
      if (ue === null) {
        for (; !Me.done; ge++, Me = C.next()) Me = b(k, Me.value, W), Me !== null && (x = i(Me, x, ge), le === null ? re = Me : le.sibling = Me, le = Me);
        return Ye && br(k, ge), re;
      }
      for (ue = r(k, ue); !Me.done; ge++, Me = C.next()) Me = J(ue, k, ge, Me.value, W), Me !== null && (e && Me.alternate !== null && ue.delete(Me.key === null ? ge : Me.key), x = i(Me, x, ge), le === null ? re = Me : le.sibling = Me, le = Me);
      return e && ue.forEach(function(Ip) {
        return t(k, Ip);
      }), Ye && br(k, ge), re;
    }
    function rt(k, x, C, W) {
      if (typeof C == "object" && C !== null && C.type === fe && C.key === null && (C = C.props.children), typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case Se:
            e: {
              for (var re = C.key, le = x; le !== null; ) {
                if (le.key === re) {
                  if (re = C.type, re === fe) {
                    if (le.tag === 7) {
                      n(k, le.sibling), x = o(le, C.props.children), x.return = k, k = x;
                      break e;
                    }
                  } else if (le.elementType === re || typeof re == "object" && re !== null && re.$$typeof === Ae && Wu(re) === le.type) {
                    n(k, le.sibling), x = o(le, C.props), x.ref = cs(k, le, C), x.return = k, k = x;
                    break e;
                  }
                  n(k, le);
                  break;
                } else t(k, le);
                le = le.sibling;
              }
              C.type === fe ? (x = Jr(C.props.children, k.mode, W, C.key), x.return = k, k = x) : (W = Mi(C.type, C.key, C.props, null, k.mode, W), W.ref = cs(k, x, C), W.return = k, k = W);
            }
            return d(k);
          case de:
            e: {
              for (le = C.key; x !== null; ) {
                if (x.key === le) if (x.tag === 4 && x.stateNode.containerInfo === C.containerInfo && x.stateNode.implementation === C.implementation) {
                  n(k, x.sibling), x = o(x, C.children || []), x.return = k, k = x;
                  break e;
                } else {
                  n(k, x);
                  break;
                }
                else t(k, x);
                x = x.sibling;
              }
              x = Cl(C, k.mode, W), x.return = k, k = x;
            }
            return d(k);
          case Ae:
            return le = C._init, rt(k, x, le(C._payload), W);
        }
        if (jr(C)) return Z(k, x, C, W);
        if (X(C)) return te(k, x, C, W);
        di(k, C);
      }
      return typeof C == "string" && C !== "" || typeof C == "number" ? (C = "" + C, x !== null && x.tag === 6 ? (n(k, x.sibling), x = o(x, C), x.return = k, k = x) : (n(k, x), x = El(C, k.mode, W), x.return = k, k = x), d(k)) : n(k, x);
    }
    return rt;
  }
  var Po = Vu(!0), Hu = Vu(!1), fi = rr(null), pi = null, No = null, Ma = null;
  function za() {
    Ma = No = pi = null;
  }
  function La(e) {
    var t = fi.current;
    Ke(fi), e._currentValue = t;
  }
  function Fa(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function To(e, t) {
    pi = e, Ma = No = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ot = !0), e.firstContext = null);
  }
  function Zt(e) {
    var t = e._currentValue;
    if (Ma !== e) if (e = { context: e, memoizedValue: t, next: null }, No === null) {
      if (pi === null) throw Error(u(308));
      No = e, pi.dependencies = { lanes: 0, firstContext: e };
    } else No = No.next = e;
    return t;
  }
  var Br = null;
  function Da(e) {
    Br === null ? Br = [e] : Br.push(e);
  }
  function Qu(e, t, n, r) {
    var o = t.interleaved;
    return o === null ? (n.next = n, Da(t)) : (n.next = o.next, o.next = n), t.interleaved = n, Qn(e, r);
  }
  function Qn(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var ir = !1;
  function Ua(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ku(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Kn(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ar(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (Re & 2) !== 0) {
      var o = r.pending;
      return o === null ? t.next = t : (t.next = o.next, o.next = t), r.pending = t, Qn(e, n);
    }
    return o = r.interleaved, o === null ? (t.next = t, Da(r)) : (t.next = o.next, o.next = t), r.interleaved = t, Qn(e, n);
  }
  function hi(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, qo(e, n);
    }
  }
  function qu(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var o = null, i = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var d = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          i === null ? o = i = d : i = i.next = d, n = n.next;
        } while (n !== null);
        i === null ? o = i = t : i = i.next = t;
      } else o = i = t;
      n = { baseState: r.baseState, firstBaseUpdate: o, lastBaseUpdate: i, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function mi(e, t, n, r) {
    var o = e.updateQueue;
    ir = !1;
    var i = o.firstBaseUpdate, d = o.lastBaseUpdate, m = o.shared.pending;
    if (m !== null) {
      o.shared.pending = null;
      var g = m, N = g.next;
      g.next = null, d === null ? i = N : d.next = N, d = g;
      var D = e.alternate;
      D !== null && (D = D.updateQueue, m = D.lastBaseUpdate, m !== d && (m === null ? D.firstBaseUpdate = N : m.next = N, D.lastBaseUpdate = g));
    }
    if (i !== null) {
      var b = o.baseState;
      d = 0, D = N = g = null, m = i;
      do {
        var L = m.lane, J = m.eventTime;
        if ((r & L) === L) {
          D !== null && (D = D.next = {
            eventTime: J,
            lane: 0,
            tag: m.tag,
            payload: m.payload,
            callback: m.callback,
            next: null
          });
          e: {
            var Z = e, te = m;
            switch (L = t, J = n, te.tag) {
              case 1:
                if (Z = te.payload, typeof Z == "function") {
                  b = Z.call(J, b, L);
                  break e;
                }
                b = Z;
                break e;
              case 3:
                Z.flags = Z.flags & -65537 | 128;
              case 0:
                if (Z = te.payload, L = typeof Z == "function" ? Z.call(J, b, L) : Z, L == null) break e;
                b = K({}, b, L);
                break e;
              case 2:
                ir = !0;
            }
          }
          m.callback !== null && m.lane !== 0 && (e.flags |= 64, L = o.effects, L === null ? o.effects = [m] : L.push(m));
        } else J = { eventTime: J, lane: L, tag: m.tag, payload: m.payload, callback: m.callback, next: null }, D === null ? (N = D = J, g = b) : D = D.next = J, d |= L;
        if (m = m.next, m === null) {
          if (m = o.shared.pending, m === null) break;
          L = m, m = L.next, L.next = null, o.lastBaseUpdate = L, o.shared.pending = null;
        }
      } while (!0);
      if (D === null && (g = b), o.baseState = g, o.firstBaseUpdate = N, o.lastBaseUpdate = D, t = o.shared.interleaved, t !== null) {
        o = t;
        do
          d |= o.lane, o = o.next;
        while (o !== t);
      } else i === null && (o.shared.lanes = 0);
      Hr |= d, e.lanes = d, e.memoizedState = b;
    }
  }
  function Ju(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], o = r.callback;
      if (o !== null) {
        if (r.callback = null, r = n, typeof o != "function") throw Error(u(191, o));
        o.call(r);
      }
    }
  }
  var ds = {}, Nn = rr(ds), fs = rr(ds), ps = rr(ds);
  function Wr(e) {
    if (e === ds) throw Error(u(174));
    return e;
  }
  function ba(e, t) {
    switch (We(ps, t), We(fs, e), We(Nn, ds), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : no(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = no(t, e);
    }
    Ke(Nn), We(Nn, t);
  }
  function Ao() {
    Ke(Nn), Ke(fs), Ke(ps);
  }
  function Xu(e) {
    Wr(ps.current);
    var t = Wr(Nn.current), n = no(t, e.type);
    t !== n && (We(fs, e), We(Nn, n));
  }
  function Ba(e) {
    fs.current === e && (Ke(Nn), Ke(fs));
  }
  var Ze = rr(0);
  function vi(e) {
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
  var Wa = [];
  function Va() {
    for (var e = 0; e < Wa.length; e++) Wa[e]._workInProgressVersionPrimary = null;
    Wa.length = 0;
  }
  var yi = pe.ReactCurrentDispatcher, Ha = pe.ReactCurrentBatchConfig, Vr = 0, et = null, at = null, ut = null, gi = !1, hs = !1, ms = 0, Zf = 0;
  function St() {
    throw Error(u(321));
  }
  function Qa(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!dn(e[n], t[n])) return !1;
    return !0;
  }
  function Ka(e, t, n, r, o, i) {
    if (Vr = i, et = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, yi.current = e === null || e.memoizedState === null ? rp : op, e = n(r, o), hs) {
      i = 0;
      do {
        if (hs = !1, ms = 0, 25 <= i) throw Error(u(301));
        i += 1, ut = at = null, t.updateQueue = null, yi.current = sp, e = n(r, o);
      } while (hs);
    }
    if (yi.current = ji, t = at !== null && at.next !== null, Vr = 0, ut = at = et = null, gi = !1, t) throw Error(u(300));
    return e;
  }
  function qa() {
    var e = ms !== 0;
    return ms = 0, e;
  }
  function Tn() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return ut === null ? et.memoizedState = ut = e : ut = ut.next = e, ut;
  }
  function en() {
    if (at === null) {
      var e = et.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = at.next;
    var t = ut === null ? et.memoizedState : ut.next;
    if (t !== null) ut = t, at = e;
    else {
      if (e === null) throw Error(u(310));
      at = e, e = { memoizedState: at.memoizedState, baseState: at.baseState, baseQueue: at.baseQueue, queue: at.queue, next: null }, ut === null ? et.memoizedState = ut = e : ut = ut.next = e;
    }
    return ut;
  }
  function vs(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ja(e) {
    var t = en(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = at, o = r.baseQueue, i = n.pending;
    if (i !== null) {
      if (o !== null) {
        var d = o.next;
        o.next = i.next, i.next = d;
      }
      r.baseQueue = o = i, n.pending = null;
    }
    if (o !== null) {
      i = o.next, r = r.baseState;
      var m = d = null, g = null, N = i;
      do {
        var D = N.lane;
        if ((Vr & D) === D) g !== null && (g = g.next = { lane: 0, action: N.action, hasEagerState: N.hasEagerState, eagerState: N.eagerState, next: null }), r = N.hasEagerState ? N.eagerState : e(r, N.action);
        else {
          var b = {
            lane: D,
            action: N.action,
            hasEagerState: N.hasEagerState,
            eagerState: N.eagerState,
            next: null
          };
          g === null ? (m = g = b, d = r) : g = g.next = b, et.lanes |= D, Hr |= D;
        }
        N = N.next;
      } while (N !== null && N !== i);
      g === null ? d = r : g.next = m, dn(r, t.memoizedState) || (Ot = !0), t.memoizedState = r, t.baseState = d, t.baseQueue = g, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      o = e;
      do
        i = o.lane, et.lanes |= i, Hr |= i, o = o.next;
      while (o !== e);
    } else o === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Xa(e) {
    var t = en(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, o = n.pending, i = t.memoizedState;
    if (o !== null) {
      n.pending = null;
      var d = o = o.next;
      do
        i = e(i, d.action), d = d.next;
      while (d !== o);
      dn(i, t.memoizedState) || (Ot = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), n.lastRenderedState = i;
    }
    return [i, r];
  }
  function Yu() {
  }
  function Gu(e, t) {
    var n = et, r = en(), o = t(), i = !dn(r.memoizedState, o);
    if (i && (r.memoizedState = o, Ot = !0), r = r.queue, Ya(tc.bind(null, n, r, e), [e]), r.getSnapshot !== t || i || ut !== null && ut.memoizedState.tag & 1) {
      if (n.flags |= 2048, ys(9, ec.bind(null, n, r, o, t), void 0, null), ct === null) throw Error(u(349));
      (Vr & 30) !== 0 || Zu(n, t, o);
    }
    return o;
  }
  function Zu(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = et.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, et.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function ec(e, t, n, r) {
    t.value = n, t.getSnapshot = r, nc(t) && rc(e);
  }
  function tc(e, t, n) {
    return n(function() {
      nc(t) && rc(e);
    });
  }
  function nc(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !dn(e, n);
    } catch {
      return !0;
    }
  }
  function rc(e) {
    var t = Qn(e, 1);
    t !== null && vn(t, e, 1, -1);
  }
  function oc(e) {
    var t = Tn();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: vs, lastRenderedState: e }, t.queue = e, e = e.dispatch = np.bind(null, et, e), [t.memoizedState, e];
  }
  function ys(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = et.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, et.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function sc() {
    return en().memoizedState;
  }
  function wi(e, t, n, r) {
    var o = Tn();
    et.flags |= e, o.memoizedState = ys(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function xi(e, t, n, r) {
    var o = en();
    r = r === void 0 ? null : r;
    var i = void 0;
    if (at !== null) {
      var d = at.memoizedState;
      if (i = d.destroy, r !== null && Qa(r, d.deps)) {
        o.memoizedState = ys(t, n, i, r);
        return;
      }
    }
    et.flags |= e, o.memoizedState = ys(1 | t, n, i, r);
  }
  function ic(e, t) {
    return wi(8390656, 8, e, t);
  }
  function Ya(e, t) {
    return xi(2048, 8, e, t);
  }
  function ac(e, t) {
    return xi(4, 2, e, t);
  }
  function lc(e, t) {
    return xi(4, 4, e, t);
  }
  function uc(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function cc(e, t, n) {
    return n = n != null ? n.concat([e]) : null, xi(4, 4, uc.bind(null, t, e), n);
  }
  function Ga() {
  }
  function dc(e, t) {
    var n = en();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Qa(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function fc(e, t) {
    var n = en();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Qa(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function pc(e, t, n) {
    return (Vr & 21) === 0 ? (e.baseState && (e.baseState = !1, Ot = !0), e.memoizedState = n) : (dn(n, t) || (n = Qs(), et.lanes |= n, Hr |= n, e.baseState = !0), t);
  }
  function ep(e, t) {
    var n = $e;
    $e = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Ha.transition;
    Ha.transition = {};
    try {
      e(!1), t();
    } finally {
      $e = n, Ha.transition = r;
    }
  }
  function hc() {
    return en().memoizedState;
  }
  function tp(e, t, n) {
    var r = dr(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, mc(e)) vc(t, n);
    else if (n = Qu(e, t, n, r), n !== null) {
      var o = Ct();
      vn(n, e, r, o), yc(n, t, r);
    }
  }
  function np(e, t, n) {
    var r = dr(e), o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (mc(e)) vc(t, o);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null)) try {
        var d = t.lastRenderedState, m = i(d, n);
        if (o.hasEagerState = !0, o.eagerState = m, dn(m, d)) {
          var g = t.interleaved;
          g === null ? (o.next = o, Da(t)) : (o.next = g.next, g.next = o), t.interleaved = o;
          return;
        }
      } catch {
      } finally {
      }
      n = Qu(e, t, o, r), n !== null && (o = Ct(), vn(n, e, r, o), yc(n, t, r));
    }
  }
  function mc(e) {
    var t = e.alternate;
    return e === et || t !== null && t === et;
  }
  function vc(e, t) {
    hs = gi = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function yc(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, qo(e, n);
    }
  }
  var ji = { readContext: Zt, useCallback: St, useContext: St, useEffect: St, useImperativeHandle: St, useInsertionEffect: St, useLayoutEffect: St, useMemo: St, useReducer: St, useRef: St, useState: St, useDebugValue: St, useDeferredValue: St, useTransition: St, useMutableSource: St, useSyncExternalStore: St, useId: St, unstable_isNewReconciler: !1 }, rp = { readContext: Zt, useCallback: function(e, t) {
    return Tn().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: Zt, useEffect: ic, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, wi(
      4194308,
      4,
      uc.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return wi(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return wi(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Tn();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Tn();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = tp.bind(null, et, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Tn();
    return e = { current: e }, t.memoizedState = e;
  }, useState: oc, useDebugValue: Ga, useDeferredValue: function(e) {
    return Tn().memoizedState = e;
  }, useTransition: function() {
    var e = oc(!1), t = e[0];
    return e = ep.bind(null, e[1]), Tn().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = et, o = Tn();
    if (Ye) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else {
      if (n = t(), ct === null) throw Error(u(349));
      (Vr & 30) !== 0 || Zu(r, t, n);
    }
    o.memoizedState = n;
    var i = { value: n, getSnapshot: t };
    return o.queue = i, ic(tc.bind(
      null,
      r,
      i,
      e
    ), [e]), r.flags |= 2048, ys(9, ec.bind(null, r, i, n, t), void 0, null), n;
  }, useId: function() {
    var e = Tn(), t = ct.identifierPrefix;
    if (Ye) {
      var n = Hn, r = Vn;
      n = (r & ~(1 << 32 - Dt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = ms++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Zf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, op = {
    readContext: Zt,
    useCallback: dc,
    useContext: Zt,
    useEffect: Ya,
    useImperativeHandle: cc,
    useInsertionEffect: ac,
    useLayoutEffect: lc,
    useMemo: fc,
    useReducer: Ja,
    useRef: sc,
    useState: function() {
      return Ja(vs);
    },
    useDebugValue: Ga,
    useDeferredValue: function(e) {
      var t = en();
      return pc(t, at.memoizedState, e);
    },
    useTransition: function() {
      var e = Ja(vs)[0], t = en().memoizedState;
      return [e, t];
    },
    useMutableSource: Yu,
    useSyncExternalStore: Gu,
    useId: hc,
    unstable_isNewReconciler: !1
  }, sp = { readContext: Zt, useCallback: dc, useContext: Zt, useEffect: Ya, useImperativeHandle: cc, useInsertionEffect: ac, useLayoutEffect: lc, useMemo: fc, useReducer: Xa, useRef: sc, useState: function() {
    return Xa(vs);
  }, useDebugValue: Ga, useDeferredValue: function(e) {
    var t = en();
    return at === null ? t.memoizedState = e : pc(t, at.memoizedState, e);
  }, useTransition: function() {
    var e = Xa(vs)[0], t = en().memoizedState;
    return [e, t];
  }, useMutableSource: Yu, useSyncExternalStore: Gu, useId: hc, unstable_isNewReconciler: !1 };
  function pn(e, t) {
    if (e && e.defaultProps) {
      t = K({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function Za(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : K({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Si = { isMounted: function(e) {
    return (e = e._reactInternals) ? Cn(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ct(), o = dr(e), i = Kn(r, o);
    i.payload = t, n != null && (i.callback = n), t = ar(e, i, o), t !== null && (vn(t, e, o, r), hi(t, e, o));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ct(), o = dr(e), i = Kn(r, o);
    i.tag = 1, i.payload = t, n != null && (i.callback = n), t = ar(e, i, o), t !== null && (vn(t, e, o, r), hi(t, e, o));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ct(), r = dr(e), o = Kn(n, r);
    o.tag = 2, t != null && (o.callback = t), t = ar(e, o, r), t !== null && (vn(t, e, r, n), hi(t, e, r));
  } };
  function gc(e, t, n, r, o, i, d) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, i, d) : t.prototype && t.prototype.isPureReactComponent ? !rs(n, r) || !rs(o, i) : !0;
  }
  function wc(e, t, n) {
    var r = !1, o = or, i = t.contextType;
    return typeof i == "object" && i !== null ? i = Zt(i) : (o = Rt(t) ? Dr : jt.current, r = t.contextTypes, i = (r = r != null) ? ko(e, o) : or), t = new t(n, i), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Si, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }
  function xc(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Si.enqueueReplaceState(t, t.state, null);
  }
  function el(e, t, n, r) {
    var o = e.stateNode;
    o.props = n, o.state = e.memoizedState, o.refs = {}, Ua(e);
    var i = t.contextType;
    typeof i == "object" && i !== null ? o.context = Zt(i) : (i = Rt(t) ? Dr : jt.current, o.context = ko(e, i)), o.state = e.memoizedState, i = t.getDerivedStateFromProps, typeof i == "function" && (Za(e, t, i, n), o.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (t = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), t !== o.state && Si.enqueueReplaceState(o, o.state, null), mi(e, n, o, r), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Io(e, t) {
    try {
      var n = "", r = t;
      do
        n += M(r), r = r.return;
      while (r);
      var o = n;
    } catch (i) {
      o = `
Error generating stack: ` + i.message + `
` + i.stack;
    }
    return { value: e, source: t, stack: o, digest: null };
  }
  function tl(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function nl(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var ip = typeof WeakMap == "function" ? WeakMap : Map;
  function jc(e, t, n) {
    n = Kn(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Ti || (Ti = !0, yl = r), nl(e, t);
    }, n;
  }
  function Sc(e, t, n) {
    n = Kn(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var o = t.value;
      n.payload = function() {
        return r(o);
      }, n.callback = function() {
        nl(e, t);
      };
    }
    var i = e.stateNode;
    return i !== null && typeof i.componentDidCatch == "function" && (n.callback = function() {
      nl(e, t), typeof r != "function" && (ur === null ? ur = /* @__PURE__ */ new Set([this]) : ur.add(this));
      var d = t.stack;
      this.componentDidCatch(t.value, { componentStack: d !== null ? d : "" });
    }), n;
  }
  function kc(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new ip();
      var o = /* @__PURE__ */ new Set();
      r.set(t, o);
    } else o = r.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), r.set(t, o));
    o.has(n) || (o.add(n), e = xp.bind(null, e, t, n), t.then(e, e));
  }
  function _c(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Ec(e, t, n, r, o) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Kn(-1, 1), t.tag = 2, ar(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = o, e);
  }
  var ap = pe.ReactCurrentOwner, Ot = !1;
  function Et(e, t, n, r) {
    t.child = e === null ? Hu(t, null, n, r) : Po(t, e.child, n, r);
  }
  function Cc(e, t, n, r, o) {
    n = n.render;
    var i = t.ref;
    return To(t, o), r = Ka(e, t, n, r, i, o), n = qa(), e !== null && !Ot ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, qn(e, t, o)) : (Ye && n && Aa(t), t.flags |= 1, Et(e, t, r, o), t.child);
  }
  function Pc(e, t, n, r, o) {
    if (e === null) {
      var i = n.type;
      return typeof i == "function" && !_l(i) && i.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = i, Nc(e, t, i, r, o)) : (e = Mi(n.type, null, r, t, t.mode, o), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, (e.lanes & o) === 0) {
      var d = i.memoizedProps;
      if (n = n.compare, n = n !== null ? n : rs, n(d, r) && e.ref === t.ref) return qn(e, t, o);
    }
    return t.flags |= 1, e = pr(i, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Nc(e, t, n, r, o) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (rs(i, r) && e.ref === t.ref) if (Ot = !1, t.pendingProps = r = i, (e.lanes & o) !== 0) (e.flags & 131072) !== 0 && (Ot = !0);
      else return t.lanes = e.lanes, qn(e, t, o);
    }
    return rl(e, t, n, r, o);
  }
  function Tc(e, t, n) {
    var r = t.pendingProps, o = r.children, i = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, We(Oo, Vt), Vt |= n;
    else {
      if ((n & 1073741824) === 0) return e = i !== null ? i.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, We(Oo, Vt), Vt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = i !== null ? i.baseLanes : n, We(Oo, Vt), Vt |= r;
    }
    else i !== null ? (r = i.baseLanes | n, t.memoizedState = null) : r = n, We(Oo, Vt), Vt |= r;
    return Et(e, t, o, n), t.child;
  }
  function Ac(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function rl(e, t, n, r, o) {
    var i = Rt(n) ? Dr : jt.current;
    return i = ko(t, i), To(t, o), n = Ka(e, t, n, r, i, o), r = qa(), e !== null && !Ot ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~o, qn(e, t, o)) : (Ye && r && Aa(t), t.flags |= 1, Et(e, t, n, o), t.child);
  }
  function Ic(e, t, n, r, o) {
    if (Rt(n)) {
      var i = !0;
      ii(t);
    } else i = !1;
    if (To(t, o), t.stateNode === null) _i(e, t), wc(t, n, r), el(t, n, r, o), r = !0;
    else if (e === null) {
      var d = t.stateNode, m = t.memoizedProps;
      d.props = m;
      var g = d.context, N = n.contextType;
      typeof N == "object" && N !== null ? N = Zt(N) : (N = Rt(n) ? Dr : jt.current, N = ko(t, N));
      var D = n.getDerivedStateFromProps, b = typeof D == "function" || typeof d.getSnapshotBeforeUpdate == "function";
      b || typeof d.UNSAFE_componentWillReceiveProps != "function" && typeof d.componentWillReceiveProps != "function" || (m !== r || g !== N) && xc(t, d, r, N), ir = !1;
      var L = t.memoizedState;
      d.state = L, mi(t, r, d, o), g = t.memoizedState, m !== r || L !== g || It.current || ir ? (typeof D == "function" && (Za(t, n, D, r), g = t.memoizedState), (m = ir || gc(t, n, m, r, L, g, N)) ? (b || typeof d.UNSAFE_componentWillMount != "function" && typeof d.componentWillMount != "function" || (typeof d.componentWillMount == "function" && d.componentWillMount(), typeof d.UNSAFE_componentWillMount == "function" && d.UNSAFE_componentWillMount()), typeof d.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof d.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = g), d.props = r, d.state = g, d.context = N, r = m) : (typeof d.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      d = t.stateNode, Ku(e, t), m = t.memoizedProps, N = t.type === t.elementType ? m : pn(t.type, m), d.props = N, b = t.pendingProps, L = d.context, g = n.contextType, typeof g == "object" && g !== null ? g = Zt(g) : (g = Rt(n) ? Dr : jt.current, g = ko(t, g));
      var J = n.getDerivedStateFromProps;
      (D = typeof J == "function" || typeof d.getSnapshotBeforeUpdate == "function") || typeof d.UNSAFE_componentWillReceiveProps != "function" && typeof d.componentWillReceiveProps != "function" || (m !== b || L !== g) && xc(t, d, r, g), ir = !1, L = t.memoizedState, d.state = L, mi(t, r, d, o);
      var Z = t.memoizedState;
      m !== b || L !== Z || It.current || ir ? (typeof J == "function" && (Za(t, n, J, r), Z = t.memoizedState), (N = ir || gc(t, n, N, r, L, Z, g) || !1) ? (D || typeof d.UNSAFE_componentWillUpdate != "function" && typeof d.componentWillUpdate != "function" || (typeof d.componentWillUpdate == "function" && d.componentWillUpdate(r, Z, g), typeof d.UNSAFE_componentWillUpdate == "function" && d.UNSAFE_componentWillUpdate(r, Z, g)), typeof d.componentDidUpdate == "function" && (t.flags |= 4), typeof d.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof d.componentDidUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 4), typeof d.getSnapshotBeforeUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = Z), d.props = r, d.state = Z, d.context = g, r = N) : (typeof d.componentDidUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 4), typeof d.getSnapshotBeforeUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return ol(e, t, n, r, i, o);
  }
  function ol(e, t, n, r, o, i) {
    Ac(e, t);
    var d = (t.flags & 128) !== 0;
    if (!r && !d) return o && zu(t, n, !1), qn(e, t, i);
    r = t.stateNode, ap.current = t;
    var m = d && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && d ? (t.child = Po(t, e.child, null, i), t.child = Po(t, null, m, i)) : Et(e, t, m, i), t.memoizedState = r.state, o && zu(t, n, !0), t.child;
  }
  function Rc(e) {
    var t = e.stateNode;
    t.pendingContext ? $u(e, t.pendingContext, t.pendingContext !== t.context) : t.context && $u(e, t.context, !1), ba(e, t.containerInfo);
  }
  function Oc(e, t, n, r, o) {
    return Co(), $a(o), t.flags |= 256, Et(e, t, n, r), t.child;
  }
  var sl = { dehydrated: null, treeContext: null, retryLane: 0 };
  function il(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function $c(e, t, n) {
    var r = t.pendingProps, o = Ze.current, i = !1, d = (t.flags & 128) !== 0, m;
    if ((m = d) || (m = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0), m ? (i = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (o |= 1), We(Ze, o & 1), e === null)
      return Oa(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (d = r.children, e = r.fallback, i ? (r = t.mode, i = t.child, d = { mode: "hidden", children: d }, (r & 1) === 0 && i !== null ? (i.childLanes = 0, i.pendingProps = d) : i = zi(d, r, 0, null), e = Jr(e, r, n, null), i.return = t, e.return = t, i.sibling = e, t.child = i, t.child.memoizedState = il(n), t.memoizedState = sl, e) : al(t, d));
    if (o = e.memoizedState, o !== null && (m = o.dehydrated, m !== null)) return lp(e, t, d, r, m, o, n);
    if (i) {
      i = r.fallback, d = t.mode, o = e.child, m = o.sibling;
      var g = { mode: "hidden", children: r.children };
      return (d & 1) === 0 && t.child !== o ? (r = t.child, r.childLanes = 0, r.pendingProps = g, t.deletions = null) : (r = pr(o, g), r.subtreeFlags = o.subtreeFlags & 14680064), m !== null ? i = pr(m, i) : (i = Jr(i, d, n, null), i.flags |= 2), i.return = t, r.return = t, r.sibling = i, t.child = r, r = i, i = t.child, d = e.child.memoizedState, d = d === null ? il(n) : { baseLanes: d.baseLanes | n, cachePool: null, transitions: d.transitions }, i.memoizedState = d, i.childLanes = e.childLanes & ~n, t.memoizedState = sl, r;
    }
    return i = e.child, e = i.sibling, r = pr(i, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function al(e, t) {
    return t = zi({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function ki(e, t, n, r) {
    return r !== null && $a(r), Po(t, e.child, null, n), e = al(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function lp(e, t, n, r, o, i, d) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = tl(Error(u(422))), ki(e, t, d, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (i = r.fallback, o = t.mode, r = zi({ mode: "visible", children: r.children }, o, 0, null), i = Jr(i, o, d, null), i.flags |= 2, r.return = t, i.return = t, r.sibling = i, t.child = r, (t.mode & 1) !== 0 && Po(t, e.child, null, d), t.child.memoizedState = il(d), t.memoizedState = sl, i);
    if ((t.mode & 1) === 0) return ki(e, t, d, null);
    if (o.data === "$!") {
      if (r = o.nextSibling && o.nextSibling.dataset, r) var m = r.dgst;
      return r = m, i = Error(u(419)), r = tl(i, r, void 0), ki(e, t, d, r);
    }
    if (m = (d & e.childLanes) !== 0, Ot || m) {
      if (r = ct, r !== null) {
        switch (d & -d) {
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
        o = (o & (r.suspendedLanes | d)) !== 0 ? 0 : o, o !== 0 && o !== i.retryLane && (i.retryLane = o, Qn(e, o), vn(r, e, o, -1));
      }
      return kl(), r = tl(Error(u(421))), ki(e, t, d, r);
    }
    return o.data === "$?" ? (t.flags |= 128, t.child = e.child, t = jp.bind(null, e), o._reactRetry = t, null) : (e = i.treeContext, Wt = nr(o.nextSibling), Bt = t, Ye = !0, fn = null, e !== null && (Yt[Gt++] = Vn, Yt[Gt++] = Hn, Yt[Gt++] = Ur, Vn = e.id, Hn = e.overflow, Ur = t), t = al(t, r.children), t.flags |= 4096, t);
  }
  function Mc(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Fa(e.return, t, n);
  }
  function ll(e, t, n, r, o) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: o } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = r, i.tail = n, i.tailMode = o);
  }
  function zc(e, t, n) {
    var r = t.pendingProps, o = r.revealOrder, i = r.tail;
    if (Et(e, t, r.children, n), r = Ze.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Mc(e, n, t);
        else if (e.tag === 19) Mc(e, n, t);
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
    if (We(Ze, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null; ) e = n.alternate, e !== null && vi(e) === null && (o = n), n = n.sibling;
        n = o, n === null ? (o = t.child, t.child = null) : (o = n.sibling, n.sibling = null), ll(t, !1, o, n, i);
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null; ) {
          if (e = o.alternate, e !== null && vi(e) === null) {
            t.child = o;
            break;
          }
          e = o.sibling, o.sibling = n, n = o, o = e;
        }
        ll(t, !0, n, null, i);
        break;
      case "together":
        ll(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function _i(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function qn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Hr |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, n = pr(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = pr(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function up(e, t, n) {
    switch (t.tag) {
      case 3:
        Rc(t), Co();
        break;
      case 5:
        Xu(t);
        break;
      case 1:
        Rt(t.type) && ii(t);
        break;
      case 4:
        ba(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, o = t.memoizedProps.value;
        We(fi, r._currentValue), r._currentValue = o;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (We(Ze, Ze.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? $c(e, t, n) : (We(Ze, Ze.current & 1), e = qn(e, t, n), e !== null ? e.sibling : null);
        We(Ze, Ze.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return zc(e, t, n);
          t.flags |= 128;
        }
        if (o = t.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), We(Ze, Ze.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Tc(e, t, n);
    }
    return qn(e, t, n);
  }
  var Lc, ul, Fc, Dc;
  Lc = function(e, t) {
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
  }, ul = function() {
  }, Fc = function(e, t, n, r) {
    var o = e.memoizedProps;
    if (o !== r) {
      e = t.stateNode, Wr(Nn.current);
      var i = null;
      switch (n) {
        case "input":
          o = zn(e, o), r = zn(e, r), i = [];
          break;
        case "select":
          o = K({}, o, { value: void 0 }), r = K({}, r, { value: void 0 }), i = [];
          break;
        case "textarea":
          o = Sr(e, o), r = Sr(e, r), i = [];
          break;
        default:
          typeof o.onClick != "function" && typeof r.onClick == "function" && (e.onclick = ri);
      }
      Zn(n, r);
      var d;
      n = null;
      for (N in o) if (!r.hasOwnProperty(N) && o.hasOwnProperty(N) && o[N] != null) if (N === "style") {
        var m = o[N];
        for (d in m) m.hasOwnProperty(d) && (n || (n = {}), n[d] = "");
      } else N !== "dangerouslySetInnerHTML" && N !== "children" && N !== "suppressContentEditableWarning" && N !== "suppressHydrationWarning" && N !== "autoFocus" && (p.hasOwnProperty(N) ? i || (i = []) : (i = i || []).push(N, null));
      for (N in r) {
        var g = r[N];
        if (m = o != null ? o[N] : void 0, r.hasOwnProperty(N) && g !== m && (g != null || m != null)) if (N === "style") if (m) {
          for (d in m) !m.hasOwnProperty(d) || g && g.hasOwnProperty(d) || (n || (n = {}), n[d] = "");
          for (d in g) g.hasOwnProperty(d) && m[d] !== g[d] && (n || (n = {}), n[d] = g[d]);
        } else n || (i || (i = []), i.push(
          N,
          n
        )), n = g;
        else N === "dangerouslySetInnerHTML" ? (g = g ? g.__html : void 0, m = m ? m.__html : void 0, g != null && m !== g && (i = i || []).push(N, g)) : N === "children" ? typeof g != "string" && typeof g != "number" || (i = i || []).push(N, "" + g) : N !== "suppressContentEditableWarning" && N !== "suppressHydrationWarning" && (p.hasOwnProperty(N) ? (g != null && N === "onScroll" && Qe("scroll", e), i || m === g || (i = [])) : (i = i || []).push(N, g));
      }
      n && (i = i || []).push("style", n);
      var N = i;
      (t.updateQueue = N) && (t.flags |= 4);
    }
  }, Dc = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function gs(e, t) {
    if (!Ye) switch (e.tailMode) {
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
  function kt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags & 14680064, r |= o.flags & 14680064, o.return = e, o = o.sibling;
    else for (o = e.child; o !== null; ) n |= o.lanes | o.childLanes, r |= o.subtreeFlags, r |= o.flags, o.return = e, o = o.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function cp(e, t, n) {
    var r = t.pendingProps;
    switch (Ia(t), t.tag) {
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
        return kt(t), null;
      case 1:
        return Rt(t.type) && si(), kt(t), null;
      case 3:
        return r = t.stateNode, Ao(), Ke(It), Ke(jt), Va(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ci(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, fn !== null && (xl(fn), fn = null))), ul(e, t), kt(t), null;
      case 5:
        Ba(t);
        var o = Wr(ps.current);
        if (n = t.type, e !== null && t.stateNode != null) Fc(e, t, n, r, o), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(u(166));
            return kt(t), null;
          }
          if (e = Wr(Nn.current), ci(t)) {
            r = t.stateNode, n = t.type;
            var i = t.memoizedProps;
            switch (r[Pn] = t, r[ls] = i, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                Qe("cancel", r), Qe("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                Qe("load", r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < ss.length; o++) Qe(ss[o], r);
                break;
              case "source":
                Qe("error", r);
                break;
              case "img":
              case "image":
              case "link":
                Qe(
                  "error",
                  r
                ), Qe("load", r);
                break;
              case "details":
                Qe("toggle", r);
                break;
              case "input":
                Zr(r, i), Qe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!i.multiple }, Qe("invalid", r);
                break;
              case "textarea":
                Sn(r, i), Qe("invalid", r);
            }
            Zn(n, i), o = null;
            for (var d in i) if (i.hasOwnProperty(d)) {
              var m = i[d];
              d === "children" ? typeof m == "string" ? r.textContent !== m && (i.suppressHydrationWarning !== !0 && ni(r.textContent, m, e), o = ["children", m]) : typeof m == "number" && r.textContent !== "" + m && (i.suppressHydrationWarning !== !0 && ni(
                r.textContent,
                m,
                e
              ), o = ["children", "" + m]) : p.hasOwnProperty(d) && m != null && d === "onScroll" && Qe("scroll", r);
            }
            switch (n) {
              case "input":
                Tt(r), Ln(r, i, !0);
                break;
              case "textarea":
                Tt(r), kr(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof i.onClick == "function" && (r.onclick = ri);
            }
            r = o, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            d = o.nodeType === 9 ? o : o.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Fn(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = d.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = d.createElement(n, { is: r.is }) : (e = d.createElement(n), n === "select" && (d = e, r.multiple ? d.multiple = !0 : r.size && (d.size = r.size))) : e = d.createElementNS(e, n), e[Pn] = t, e[ls] = r, Lc(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (d = bo(n, r), n) {
                case "dialog":
                  Qe("cancel", e), Qe("close", e), o = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Qe("load", e), o = r;
                  break;
                case "video":
                case "audio":
                  for (o = 0; o < ss.length; o++) Qe(ss[o], e);
                  o = r;
                  break;
                case "source":
                  Qe("error", e), o = r;
                  break;
                case "img":
                case "image":
                case "link":
                  Qe(
                    "error",
                    e
                  ), Qe("load", e), o = r;
                  break;
                case "details":
                  Qe("toggle", e), o = r;
                  break;
                case "input":
                  Zr(e, r), o = zn(e, r), Qe("invalid", e);
                  break;
                case "option":
                  o = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, o = K({}, r, { value: void 0 }), Qe("invalid", e);
                  break;
                case "textarea":
                  Sn(e, r), o = Sr(e, r), Qe("invalid", e);
                  break;
                default:
                  o = r;
              }
              Zn(n, o), m = o;
              for (i in m) if (m.hasOwnProperty(i)) {
                var g = m[i];
                i === "style" ? ro(e, g) : i === "dangerouslySetInnerHTML" ? (g = g ? g.__html : void 0, g != null && Gn(e, g)) : i === "children" ? typeof g == "string" ? (n !== "textarea" || g !== "") && pt(e, g) : typeof g == "number" && pt(e, "" + g) : i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus" && (p.hasOwnProperty(i) ? g != null && i === "onScroll" && Qe("scroll", e) : g != null && ke(e, i, g, d));
              }
              switch (n) {
                case "input":
                  Tt(e), Ln(e, r, !1);
                  break;
                case "textarea":
                  Tt(e), kr(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + je(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, i = r.value, i != null ? jn(e, !!r.multiple, i, !1) : r.defaultValue != null && jn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof o.onClick == "function" && (e.onclick = ri);
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
        return kt(t), null;
      case 6:
        if (e && t.stateNode != null) Dc(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(u(166));
          if (n = Wr(ps.current), Wr(Nn.current), ci(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[Pn] = t, (i = r.nodeValue !== n) && (e = Bt, e !== null)) switch (e.tag) {
              case 3:
                ni(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && ni(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            i && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Pn] = t, t.stateNode = r;
        }
        return kt(t), null;
      case 13:
        if (Ke(Ze), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Ye && Wt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Bu(), Co(), t.flags |= 98560, i = !1;
          else if (i = ci(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(u(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(u(317));
              i[Pn] = t;
            } else Co(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            kt(t), i = !1;
          } else fn !== null && (xl(fn), fn = null), i = !0;
          if (!i) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Ze.current & 1) !== 0 ? lt === 0 && (lt = 3) : kl())), t.updateQueue !== null && (t.flags |= 4), kt(t), null);
      case 4:
        return Ao(), ul(e, t), e === null && is(t.stateNode.containerInfo), kt(t), null;
      case 10:
        return La(t.type._context), kt(t), null;
      case 17:
        return Rt(t.type) && si(), kt(t), null;
      case 19:
        if (Ke(Ze), i = t.memoizedState, i === null) return kt(t), null;
        if (r = (t.flags & 128) !== 0, d = i.rendering, d === null) if (r) gs(i, !1);
        else {
          if (lt !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (d = vi(e), d !== null) {
              for (t.flags |= 128, gs(i, !1), r = d.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) i = n, e = r, i.flags &= 14680066, d = i.alternate, d === null ? (i.childLanes = 0, i.lanes = e, i.child = null, i.subtreeFlags = 0, i.memoizedProps = null, i.memoizedState = null, i.updateQueue = null, i.dependencies = null, i.stateNode = null) : (i.childLanes = d.childLanes, i.lanes = d.lanes, i.child = d.child, i.subtreeFlags = 0, i.deletions = null, i.memoizedProps = d.memoizedProps, i.memoizedState = d.memoizedState, i.updateQueue = d.updateQueue, i.type = d.type, e = d.dependencies, i.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return We(Ze, Ze.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          i.tail !== null && Xe() > $o && (t.flags |= 128, r = !0, gs(i, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = vi(d), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), gs(i, !0), i.tail === null && i.tailMode === "hidden" && !d.alternate && !Ye) return kt(t), null;
          } else 2 * Xe() - i.renderingStartTime > $o && n !== 1073741824 && (t.flags |= 128, r = !0, gs(i, !1), t.lanes = 4194304);
          i.isBackwards ? (d.sibling = t.child, t.child = d) : (n = i.last, n !== null ? n.sibling = d : t.child = d, i.last = d);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = Xe(), t.sibling = null, n = Ze.current, We(Ze, r ? n & 1 | 2 : n & 1), t) : (kt(t), null);
      case 22:
      case 23:
        return Sl(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (Vt & 1073741824) !== 0 && (kt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : kt(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function dp(e, t) {
    switch (Ia(t), t.tag) {
      case 1:
        return Rt(t.type) && si(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ao(), Ke(It), Ke(jt), Va(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Ba(t), null;
      case 13:
        if (Ke(Ze), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Co();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return Ke(Ze), null;
      case 4:
        return Ao(), null;
      case 10:
        return La(t.type._context), null;
      case 22:
      case 23:
        return Sl(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ei = !1, _t = !1, fp = typeof WeakSet == "function" ? WeakSet : Set, Y = null;
  function Ro(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      tt(e, t, r);
    }
    else n.current = null;
  }
  function cl(e, t, n) {
    try {
      n();
    } catch (r) {
      tt(e, t, r);
    }
  }
  var Uc = !1;
  function pp(e, t) {
    if (Sa = _e, e = gu(), ha(e)) {
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
          var d = 0, m = -1, g = -1, N = 0, D = 0, b = e, L = null;
          t: for (; ; ) {
            for (var J; b !== n || o !== 0 && b.nodeType !== 3 || (m = d + o), b !== i || r !== 0 && b.nodeType !== 3 || (g = d + r), b.nodeType === 3 && (d += b.nodeValue.length), (J = b.firstChild) !== null; )
              L = b, b = J;
            for (; ; ) {
              if (b === e) break t;
              if (L === n && ++N === o && (m = d), L === i && ++D === r && (g = d), (J = b.nextSibling) !== null) break;
              b = L, L = b.parentNode;
            }
            b = J;
          }
          n = m === -1 || g === -1 ? null : { start: m, end: g };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (ka = { focusedElem: e, selectionRange: n }, _e = !1, Y = t; Y !== null; ) if (t = Y, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, Y = e;
    else for (; Y !== null; ) {
      t = Y;
      try {
        var Z = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Z !== null) {
              var te = Z.memoizedProps, rt = Z.memoizedState, k = t.stateNode, x = k.getSnapshotBeforeUpdate(t.elementType === t.type ? te : pn(t.type, te), rt);
              k.__reactInternalSnapshotBeforeUpdate = x;
            }
            break;
          case 3:
            var C = t.stateNode.containerInfo;
            C.nodeType === 1 ? C.textContent = "" : C.nodeType === 9 && C.documentElement && C.removeChild(C.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(u(163));
        }
      } catch (W) {
        tt(t, t.return, W);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, Y = e;
        break;
      }
      Y = t.return;
    }
    return Z = Uc, Uc = !1, Z;
  }
  function ws(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & e) === e) {
          var i = o.destroy;
          o.destroy = void 0, i !== void 0 && cl(t, n, i);
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function Ci(e, t) {
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
  function dl(e) {
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
  function bc(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, bc(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Pn], delete t[ls], delete t[Pa], delete t[Jf], delete t[Xf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Bc(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Wc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Bc(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function fl(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ri));
    else if (r !== 4 && (e = e.child, e !== null)) for (fl(e, t, n), e = e.sibling; e !== null; ) fl(e, t, n), e = e.sibling;
  }
  function pl(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (pl(e, t, n), e = e.sibling; e !== null; ) pl(e, t, n), e = e.sibling;
  }
  var ht = null, hn = !1;
  function lr(e, t, n) {
    for (n = n.child; n !== null; ) Vc(e, t, n), n = n.sibling;
  }
  function Vc(e, t, n) {
    if (qt && typeof qt.onCommitFiberUnmount == "function") try {
      qt.onCommitFiberUnmount(Ir, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        _t || Ro(n, t);
      case 6:
        var r = ht, o = hn;
        ht = null, lr(e, t, n), ht = r, hn = o, ht !== null && (hn ? (e = ht, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ht.removeChild(n.stateNode));
        break;
      case 18:
        ht !== null && (hn ? (e = ht, n = n.stateNode, e.nodeType === 8 ? Ca(e.parentNode, n) : e.nodeType === 1 && Ca(e, n), ae(e)) : Ca(ht, n.stateNode));
        break;
      case 4:
        r = ht, o = hn, ht = n.stateNode.containerInfo, hn = !0, lr(e, t, n), ht = r, hn = o;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!_t && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          o = r = r.next;
          do {
            var i = o, d = i.destroy;
            i = i.tag, d !== void 0 && ((i & 2) !== 0 || (i & 4) !== 0) && cl(n, t, d), o = o.next;
          } while (o !== r);
        }
        lr(e, t, n);
        break;
      case 1:
        if (!_t && (Ro(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (m) {
          tt(n, t, m);
        }
        lr(e, t, n);
        break;
      case 21:
        lr(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (_t = (r = _t) || n.memoizedState !== null, lr(e, t, n), _t = r) : lr(e, t, n);
        break;
      default:
        lr(e, t, n);
    }
  }
  function Hc(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new fp()), t.forEach(function(r) {
        var o = Sp.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      });
    }
  }
  function mn(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var i = e, d = t, m = d;
        e: for (; m !== null; ) {
          switch (m.tag) {
            case 5:
              ht = m.stateNode, hn = !1;
              break e;
            case 3:
              ht = m.stateNode.containerInfo, hn = !0;
              break e;
            case 4:
              ht = m.stateNode.containerInfo, hn = !0;
              break e;
          }
          m = m.return;
        }
        if (ht === null) throw Error(u(160));
        Vc(i, d, o), ht = null, hn = !1;
        var g = o.alternate;
        g !== null && (g.return = null), o.return = null;
      } catch (N) {
        tt(o, t, N);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Qc(t, e), t = t.sibling;
  }
  function Qc(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (mn(t, e), An(e), r & 4) {
          try {
            ws(3, e, e.return), Ci(3, e);
          } catch (te) {
            tt(e, e.return, te);
          }
          try {
            ws(5, e, e.return);
          } catch (te) {
            tt(e, e.return, te);
          }
        }
        break;
      case 1:
        mn(t, e), An(e), r & 512 && n !== null && Ro(n, n.return);
        break;
      case 5:
        if (mn(t, e), An(e), r & 512 && n !== null && Ro(n, n.return), e.flags & 32) {
          var o = e.stateNode;
          try {
            pt(o, "");
          } catch (te) {
            tt(e, e.return, te);
          }
        }
        if (r & 4 && (o = e.stateNode, o != null)) {
          var i = e.memoizedProps, d = n !== null ? n.memoizedProps : i, m = e.type, g = e.updateQueue;
          if (e.updateQueue = null, g !== null) try {
            m === "input" && i.type === "radio" && i.name != null && xr(o, i), bo(m, d);
            var N = bo(m, i);
            for (d = 0; d < g.length; d += 2) {
              var D = g[d], b = g[d + 1];
              D === "style" ? ro(o, b) : D === "dangerouslySetInnerHTML" ? Gn(o, b) : D === "children" ? pt(o, b) : ke(o, D, b, N);
            }
            switch (m) {
              case "input":
                eo(o, i);
                break;
              case "textarea":
                to(o, i);
                break;
              case "select":
                var L = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!i.multiple;
                var J = i.value;
                J != null ? jn(o, !!i.multiple, J, !1) : L !== !!i.multiple && (i.defaultValue != null ? jn(
                  o,
                  !!i.multiple,
                  i.defaultValue,
                  !0
                ) : jn(o, !!i.multiple, i.multiple ? [] : "", !1));
            }
            o[ls] = i;
          } catch (te) {
            tt(e, e.return, te);
          }
        }
        break;
      case 6:
        if (mn(t, e), An(e), r & 4) {
          if (e.stateNode === null) throw Error(u(162));
          o = e.stateNode, i = e.memoizedProps;
          try {
            o.nodeValue = i;
          } catch (te) {
            tt(e, e.return, te);
          }
        }
        break;
      case 3:
        if (mn(t, e), An(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          ae(t.containerInfo);
        } catch (te) {
          tt(e, e.return, te);
        }
        break;
      case 4:
        mn(t, e), An(e);
        break;
      case 13:
        mn(t, e), An(e), o = e.child, o.flags & 8192 && (i = o.memoizedState !== null, o.stateNode.isHidden = i, !i || o.alternate !== null && o.alternate.memoizedState !== null || (vl = Xe())), r & 4 && Hc(e);
        break;
      case 22:
        if (D = n !== null && n.memoizedState !== null, e.mode & 1 ? (_t = (N = _t) || D, mn(t, e), _t = N) : mn(t, e), An(e), r & 8192) {
          if (N = e.memoizedState !== null, (e.stateNode.isHidden = N) && !D && (e.mode & 1) !== 0) for (Y = e, D = e.child; D !== null; ) {
            for (b = Y = D; Y !== null; ) {
              switch (L = Y, J = L.child, L.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ws(4, L, L.return);
                  break;
                case 1:
                  Ro(L, L.return);
                  var Z = L.stateNode;
                  if (typeof Z.componentWillUnmount == "function") {
                    r = L, n = L.return;
                    try {
                      t = r, Z.props = t.memoizedProps, Z.state = t.memoizedState, Z.componentWillUnmount();
                    } catch (te) {
                      tt(r, n, te);
                    }
                  }
                  break;
                case 5:
                  Ro(L, L.return);
                  break;
                case 22:
                  if (L.memoizedState !== null) {
                    Jc(b);
                    continue;
                  }
              }
              J !== null ? (J.return = L, Y = J) : Jc(b);
            }
            D = D.sibling;
          }
          e: for (D = null, b = e; ; ) {
            if (b.tag === 5) {
              if (D === null) {
                D = b;
                try {
                  o = b.stateNode, N ? (i = o.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none") : (m = b.stateNode, g = b.memoizedProps.style, d = g != null && g.hasOwnProperty("display") ? g.display : null, m.style.display = He("display", d));
                } catch (te) {
                  tt(e, e.return, te);
                }
              }
            } else if (b.tag === 6) {
              if (D === null) try {
                b.stateNode.nodeValue = N ? "" : b.memoizedProps;
              } catch (te) {
                tt(e, e.return, te);
              }
            } else if ((b.tag !== 22 && b.tag !== 23 || b.memoizedState === null || b === e) && b.child !== null) {
              b.child.return = b, b = b.child;
              continue;
            }
            if (b === e) break e;
            for (; b.sibling === null; ) {
              if (b.return === null || b.return === e) break e;
              D === b && (D = null), b = b.return;
            }
            D === b && (D = null), b.sibling.return = b.return, b = b.sibling;
          }
        }
        break;
      case 19:
        mn(t, e), An(e), r & 4 && Hc(e);
        break;
      case 21:
        break;
      default:
        mn(
          t,
          e
        ), An(e);
    }
  }
  function An(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Bc(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(u(160));
        }
        switch (r.tag) {
          case 5:
            var o = r.stateNode;
            r.flags & 32 && (pt(o, ""), r.flags &= -33);
            var i = Wc(e);
            pl(e, i, o);
            break;
          case 3:
          case 4:
            var d = r.stateNode.containerInfo, m = Wc(e);
            fl(e, m, d);
            break;
          default:
            throw Error(u(161));
        }
      } catch (g) {
        tt(e, e.return, g);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function hp(e, t, n) {
    Y = e, Kc(e);
  }
  function Kc(e, t, n) {
    for (var r = (e.mode & 1) !== 0; Y !== null; ) {
      var o = Y, i = o.child;
      if (o.tag === 22 && r) {
        var d = o.memoizedState !== null || Ei;
        if (!d) {
          var m = o.alternate, g = m !== null && m.memoizedState !== null || _t;
          m = Ei;
          var N = _t;
          if (Ei = d, (_t = g) && !N) for (Y = o; Y !== null; ) d = Y, g = d.child, d.tag === 22 && d.memoizedState !== null ? Xc(o) : g !== null ? (g.return = d, Y = g) : Xc(o);
          for (; i !== null; ) Y = i, Kc(i), i = i.sibling;
          Y = o, Ei = m, _t = N;
        }
        qc(e);
      } else (o.subtreeFlags & 8772) !== 0 && i !== null ? (i.return = o, Y = i) : qc(e);
    }
  }
  function qc(e) {
    for (; Y !== null; ) {
      var t = Y;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              _t || Ci(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !_t) if (n === null) r.componentDidMount();
              else {
                var o = t.elementType === t.type ? n.memoizedProps : pn(t.type, n.memoizedProps);
                r.componentDidUpdate(o, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var i = t.updateQueue;
              i !== null && Ju(t, i, r);
              break;
            case 3:
              var d = t.updateQueue;
              if (d !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                Ju(t, d, n);
              }
              break;
            case 5:
              var m = t.stateNode;
              if (n === null && t.flags & 4) {
                n = m;
                var g = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    g.autoFocus && n.focus();
                    break;
                  case "img":
                    g.src && (n.src = g.src);
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
                var N = t.alternate;
                if (N !== null) {
                  var D = N.memoizedState;
                  if (D !== null) {
                    var b = D.dehydrated;
                    b !== null && ae(b);
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
              throw Error(u(163));
          }
          _t || t.flags & 512 && dl(t);
        } catch (L) {
          tt(t, t.return, L);
        }
      }
      if (t === e) {
        Y = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, Y = n;
        break;
      }
      Y = t.return;
    }
  }
  function Jc(e) {
    for (; Y !== null; ) {
      var t = Y;
      if (t === e) {
        Y = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, Y = n;
        break;
      }
      Y = t.return;
    }
  }
  function Xc(e) {
    for (; Y !== null; ) {
      var t = Y;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Ci(4, t);
            } catch (g) {
              tt(t, n, g);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var o = t.return;
              try {
                r.componentDidMount();
              } catch (g) {
                tt(t, o, g);
              }
            }
            var i = t.return;
            try {
              dl(t);
            } catch (g) {
              tt(t, i, g);
            }
            break;
          case 5:
            var d = t.return;
            try {
              dl(t);
            } catch (g) {
              tt(t, d, g);
            }
        }
      } catch (g) {
        tt(t, t.return, g);
      }
      if (t === e) {
        Y = null;
        break;
      }
      var m = t.sibling;
      if (m !== null) {
        m.return = t.return, Y = m;
        break;
      }
      Y = t.return;
    }
  }
  var mp = Math.ceil, Pi = pe.ReactCurrentDispatcher, hl = pe.ReactCurrentOwner, tn = pe.ReactCurrentBatchConfig, Re = 0, ct = null, it = null, mt = 0, Vt = 0, Oo = rr(0), lt = 0, xs = null, Hr = 0, Ni = 0, ml = 0, js = null, $t = null, vl = 0, $o = 1 / 0, Jn = null, Ti = !1, yl = null, ur = null, Ai = !1, cr = null, Ii = 0, Ss = 0, gl = null, Ri = -1, Oi = 0;
  function Ct() {
    return (Re & 6) !== 0 ? Xe() : Ri !== -1 ? Ri : Ri = Xe();
  }
  function dr(e) {
    return (e.mode & 1) === 0 ? 1 : (Re & 2) !== 0 && mt !== 0 ? mt & -mt : Gf.transition !== null ? (Oi === 0 && (Oi = Qs()), Oi) : (e = $e, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Ut(e.type)), e);
  }
  function vn(e, t, n, r) {
    if (50 < Ss) throw Ss = 0, gl = null, Error(u(185));
    Un(e, n, r), ((Re & 2) === 0 || e !== ct) && (e === ct && ((Re & 2) === 0 && (Ni |= n), lt === 4 && fr(e, mt)), Mt(e, r), n === 1 && Re === 0 && (t.mode & 1) === 0 && ($o = Xe() + 500, ai && sr()));
  }
  function Mt(e, t) {
    var n = e.callbackNode;
    Hs(e, t);
    var r = Or(e, e === ct ? mt : 0);
    if (r === 0) n !== null && ao(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && ao(n), t === 1) e.tag === 0 ? Yf(Gc.bind(null, e)) : Lu(Gc.bind(null, e)), Kf(function() {
        (Re & 6) === 0 && sr();
      }), n = null;
      else {
        switch (Jo(r)) {
          case 1:
            n = an;
            break;
          case 4:
            n = Us;
            break;
          case 16:
            n = uo;
            break;
          case 536870912:
            n = bs;
            break;
          default:
            n = uo;
        }
        n = id(n, Yc.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Yc(e, t) {
    if (Ri = -1, Oi = 0, (Re & 6) !== 0) throw Error(u(327));
    var n = e.callbackNode;
    if (Mo() && e.callbackNode !== n) return null;
    var r = Or(e, e === ct ? mt : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = $i(e, r);
    else {
      t = r;
      var o = Re;
      Re |= 2;
      var i = ed();
      (ct !== e || mt !== t) && (Jn = null, $o = Xe() + 500, Kr(e, t));
      do
        try {
          gp();
          break;
        } catch (m) {
          Zc(e, m);
        }
      while (!0);
      za(), Pi.current = i, Re = o, it !== null ? t = 0 : (ct = null, mt = 0, t = lt);
    }
    if (t !== 0) {
      if (t === 2 && (o = $r(e), o !== 0 && (r = o, t = wl(e, o))), t === 1) throw n = xs, Kr(e, 0), fr(e, r), Mt(e, Xe()), n;
      if (t === 6) fr(e, r);
      else {
        if (o = e.current.alternate, (r & 30) === 0 && !vp(o) && (t = $i(e, r), t === 2 && (i = $r(e), i !== 0 && (r = i, t = wl(e, i))), t === 1)) throw n = xs, Kr(e, 0), fr(e, r), Mt(e, Xe()), n;
        switch (e.finishedWork = o, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            qr(e, $t, Jn);
            break;
          case 3:
            if (fr(e, r), (r & 130023424) === r && (t = vl + 500 - Xe(), 10 < t)) {
              if (Or(e, 0) !== 0) break;
              if (o = e.suspendedLanes, (o & r) !== r) {
                Ct(), e.pingedLanes |= e.suspendedLanes & o;
                break;
              }
              e.timeoutHandle = Ea(qr.bind(null, e, $t, Jn), t);
              break;
            }
            qr(e, $t, Jn);
            break;
          case 4:
            if (fr(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, o = -1; 0 < r; ) {
              var d = 31 - Dt(r);
              i = 1 << d, d = t[d], d > o && (o = d), r &= ~i;
            }
            if (r = o, r = Xe() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * mp(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Ea(qr.bind(null, e, $t, Jn), r);
              break;
            }
            qr(e, $t, Jn);
            break;
          case 5:
            qr(e, $t, Jn);
            break;
          default:
            throw Error(u(329));
        }
      }
    }
    return Mt(e, Xe()), e.callbackNode === n ? Yc.bind(null, e) : null;
  }
  function wl(e, t) {
    var n = js;
    return e.current.memoizedState.isDehydrated && (Kr(e, t).flags |= 256), e = $i(e, t), e !== 2 && (t = $t, $t = n, t !== null && xl(t)), e;
  }
  function xl(e) {
    $t === null ? $t = e : $t.push.apply($t, e);
  }
  function vp(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var o = n[r], i = o.getSnapshot;
          o = o.value;
          try {
            if (!dn(i(), o)) return !1;
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
  function fr(e, t) {
    for (t &= ~ml, t &= ~Ni, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - Dt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Gc(e) {
    if ((Re & 6) !== 0) throw Error(u(327));
    Mo();
    var t = Or(e, 0);
    if ((t & 1) === 0) return Mt(e, Xe()), null;
    var n = $i(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = $r(e);
      r !== 0 && (t = r, n = wl(e, r));
    }
    if (n === 1) throw n = xs, Kr(e, 0), fr(e, t), Mt(e, Xe()), n;
    if (n === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, qr(e, $t, Jn), Mt(e, Xe()), null;
  }
  function jl(e, t) {
    var n = Re;
    Re |= 1;
    try {
      return e(t);
    } finally {
      Re = n, Re === 0 && ($o = Xe() + 500, ai && sr());
    }
  }
  function Qr(e) {
    cr !== null && cr.tag === 0 && (Re & 6) === 0 && Mo();
    var t = Re;
    Re |= 1;
    var n = tn.transition, r = $e;
    try {
      if (tn.transition = null, $e = 1, e) return e();
    } finally {
      $e = r, tn.transition = n, Re = t, (Re & 6) === 0 && sr();
    }
  }
  function Sl() {
    Vt = Oo.current, Ke(Oo);
  }
  function Kr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Qf(n)), it !== null) for (n = it.return; n !== null; ) {
      var r = n;
      switch (Ia(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && si();
          break;
        case 3:
          Ao(), Ke(It), Ke(jt), Va();
          break;
        case 5:
          Ba(r);
          break;
        case 4:
          Ao();
          break;
        case 13:
          Ke(Ze);
          break;
        case 19:
          Ke(Ze);
          break;
        case 10:
          La(r.type._context);
          break;
        case 22:
        case 23:
          Sl();
      }
      n = n.return;
    }
    if (ct = e, it = e = pr(e.current, null), mt = Vt = t, lt = 0, xs = null, ml = Ni = Hr = 0, $t = js = null, Br !== null) {
      for (t = 0; t < Br.length; t++) if (n = Br[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var o = r.next, i = n.pending;
        if (i !== null) {
          var d = i.next;
          i.next = o, r.next = d;
        }
        n.pending = r;
      }
      Br = null;
    }
    return e;
  }
  function Zc(e, t) {
    do {
      var n = it;
      try {
        if (za(), yi.current = ji, gi) {
          for (var r = et.memoizedState; r !== null; ) {
            var o = r.queue;
            o !== null && (o.pending = null), r = r.next;
          }
          gi = !1;
        }
        if (Vr = 0, ut = at = et = null, hs = !1, ms = 0, hl.current = null, n === null || n.return === null) {
          lt = 1, xs = t, it = null;
          break;
        }
        e: {
          var i = e, d = n.return, m = n, g = t;
          if (t = mt, m.flags |= 32768, g !== null && typeof g == "object" && typeof g.then == "function") {
            var N = g, D = m, b = D.tag;
            if ((D.mode & 1) === 0 && (b === 0 || b === 11 || b === 15)) {
              var L = D.alternate;
              L ? (D.updateQueue = L.updateQueue, D.memoizedState = L.memoizedState, D.lanes = L.lanes) : (D.updateQueue = null, D.memoizedState = null);
            }
            var J = _c(d);
            if (J !== null) {
              J.flags &= -257, Ec(J, d, m, i, t), J.mode & 1 && kc(i, N, t), t = J, g = N;
              var Z = t.updateQueue;
              if (Z === null) {
                var te = /* @__PURE__ */ new Set();
                te.add(g), t.updateQueue = te;
              } else Z.add(g);
              break e;
            } else {
              if ((t & 1) === 0) {
                kc(i, N, t), kl();
                break e;
              }
              g = Error(u(426));
            }
          } else if (Ye && m.mode & 1) {
            var rt = _c(d);
            if (rt !== null) {
              (rt.flags & 65536) === 0 && (rt.flags |= 256), Ec(rt, d, m, i, t), $a(Io(g, m));
              break e;
            }
          }
          i = g = Io(g, m), lt !== 4 && (lt = 2), js === null ? js = [i] : js.push(i), i = d;
          do {
            switch (i.tag) {
              case 3:
                i.flags |= 65536, t &= -t, i.lanes |= t;
                var k = jc(i, g, t);
                qu(i, k);
                break e;
              case 1:
                m = g;
                var x = i.type, C = i.stateNode;
                if ((i.flags & 128) === 0 && (typeof x.getDerivedStateFromError == "function" || C !== null && typeof C.componentDidCatch == "function" && (ur === null || !ur.has(C)))) {
                  i.flags |= 65536, t &= -t, i.lanes |= t;
                  var W = Sc(i, m, t);
                  qu(i, W);
                  break e;
                }
            }
            i = i.return;
          } while (i !== null);
        }
        nd(n);
      } catch (re) {
        t = re, it === n && n !== null && (it = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ed() {
    var e = Pi.current;
    return Pi.current = ji, e === null ? ji : e;
  }
  function kl() {
    (lt === 0 || lt === 3 || lt === 2) && (lt = 4), ct === null || (Hr & 268435455) === 0 && (Ni & 268435455) === 0 || fr(ct, mt);
  }
  function $i(e, t) {
    var n = Re;
    Re |= 2;
    var r = ed();
    (ct !== e || mt !== t) && (Jn = null, Kr(e, t));
    do
      try {
        yp();
        break;
      } catch (o) {
        Zc(e, o);
      }
    while (!0);
    if (za(), Re = n, Pi.current = r, it !== null) throw Error(u(261));
    return ct = null, mt = 0, lt;
  }
  function yp() {
    for (; it !== null; ) td(it);
  }
  function gp() {
    for (; it !== null && !Fs(); ) td(it);
  }
  function td(e) {
    var t = sd(e.alternate, e, Vt);
    e.memoizedProps = e.pendingProps, t === null ? nd(e) : it = t, hl.current = null;
  }
  function nd(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = cp(n, t, Vt), n !== null) {
          it = n;
          return;
        }
      } else {
        if (n = dp(n, t), n !== null) {
          n.flags &= 32767, it = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          lt = 6, it = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        it = t;
        return;
      }
      it = t = e;
    } while (t !== null);
    lt === 0 && (lt = 5);
  }
  function qr(e, t, n) {
    var r = $e, o = tn.transition;
    try {
      tn.transition = null, $e = 1, wp(e, t, n, r);
    } finally {
      tn.transition = o, $e = r;
    }
    return null;
  }
  function wp(e, t, n, r) {
    do
      Mo();
    while (cr !== null);
    if ((Re & 6) !== 0) throw Error(u(327));
    n = e.finishedWork;
    var o = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var i = n.lanes | n.childLanes;
    if (ia(e, i), e === ct && (it = ct = null, mt = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Ai || (Ai = !0, id(uo, function() {
      return Mo(), null;
    })), i = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || i) {
      i = tn.transition, tn.transition = null;
      var d = $e;
      $e = 1;
      var m = Re;
      Re |= 4, hl.current = null, pp(e, n), Qc(n, e), Df(ka), _e = !!Sa, ka = Sa = null, e.current = n, hp(n), Ds(), Re = m, $e = d, tn.transition = i;
    } else e.current = n;
    if (Ai && (Ai = !1, cr = e, Ii = o), i = e.pendingLanes, i === 0 && (ur = null), sa(n.stateNode), Mt(e, Xe()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) o = t[n], r(o.value, { componentStack: o.stack, digest: o.digest });
    if (Ti) throw Ti = !1, e = yl, yl = null, e;
    return (Ii & 1) !== 0 && e.tag !== 0 && Mo(), i = e.pendingLanes, (i & 1) !== 0 ? e === gl ? Ss++ : (Ss = 0, gl = e) : Ss = 0, sr(), null;
  }
  function Mo() {
    if (cr !== null) {
      var e = Jo(Ii), t = tn.transition, n = $e;
      try {
        if (tn.transition = null, $e = 16 > e ? 16 : e, cr === null) var r = !1;
        else {
          if (e = cr, cr = null, Ii = 0, (Re & 6) !== 0) throw Error(u(331));
          var o = Re;
          for (Re |= 4, Y = e.current; Y !== null; ) {
            var i = Y, d = i.child;
            if ((Y.flags & 16) !== 0) {
              var m = i.deletions;
              if (m !== null) {
                for (var g = 0; g < m.length; g++) {
                  var N = m[g];
                  for (Y = N; Y !== null; ) {
                    var D = Y;
                    switch (D.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ws(8, D, i);
                    }
                    var b = D.child;
                    if (b !== null) b.return = D, Y = b;
                    else for (; Y !== null; ) {
                      D = Y;
                      var L = D.sibling, J = D.return;
                      if (bc(D), D === N) {
                        Y = null;
                        break;
                      }
                      if (L !== null) {
                        L.return = J, Y = L;
                        break;
                      }
                      Y = J;
                    }
                  }
                }
                var Z = i.alternate;
                if (Z !== null) {
                  var te = Z.child;
                  if (te !== null) {
                    Z.child = null;
                    do {
                      var rt = te.sibling;
                      te.sibling = null, te = rt;
                    } while (te !== null);
                  }
                }
                Y = i;
              }
            }
            if ((i.subtreeFlags & 2064) !== 0 && d !== null) d.return = i, Y = d;
            else e: for (; Y !== null; ) {
              if (i = Y, (i.flags & 2048) !== 0) switch (i.tag) {
                case 0:
                case 11:
                case 15:
                  ws(9, i, i.return);
              }
              var k = i.sibling;
              if (k !== null) {
                k.return = i.return, Y = k;
                break e;
              }
              Y = i.return;
            }
          }
          var x = e.current;
          for (Y = x; Y !== null; ) {
            d = Y;
            var C = d.child;
            if ((d.subtreeFlags & 2064) !== 0 && C !== null) C.return = d, Y = C;
            else e: for (d = x; Y !== null; ) {
              if (m = Y, (m.flags & 2048) !== 0) try {
                switch (m.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ci(9, m);
                }
              } catch (re) {
                tt(m, m.return, re);
              }
              if (m === d) {
                Y = null;
                break e;
              }
              var W = m.sibling;
              if (W !== null) {
                W.return = m.return, Y = W;
                break e;
              }
              Y = m.return;
            }
          }
          if (Re = o, sr(), qt && typeof qt.onPostCommitFiberRoot == "function") try {
            qt.onPostCommitFiberRoot(Ir, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        $e = n, tn.transition = t;
      }
    }
    return !1;
  }
  function rd(e, t, n) {
    t = Io(n, t), t = jc(e, t, 1), e = ar(e, t, 1), t = Ct(), e !== null && (Un(e, 1, t), Mt(e, t));
  }
  function tt(e, t, n) {
    if (e.tag === 3) rd(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        rd(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (ur === null || !ur.has(r))) {
          e = Io(n, e), e = Sc(t, e, 1), t = ar(t, e, 1), e = Ct(), t !== null && (Un(t, 1, e), Mt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function xp(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ct(), e.pingedLanes |= e.suspendedLanes & n, ct === e && (mt & n) === n && (lt === 4 || lt === 3 && (mt & 130023424) === mt && 500 > Xe() - vl ? Kr(e, 0) : ml |= n), Mt(e, t);
  }
  function od(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = fo, fo <<= 1, (fo & 130023424) === 0 && (fo = 4194304)));
    var n = Ct();
    e = Qn(e, t), e !== null && (Un(e, t, n), Mt(e, n));
  }
  function jp(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), od(e, n);
  }
  function Sp(e, t) {
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
        throw Error(u(314));
    }
    r !== null && r.delete(t), od(e, n);
  }
  var sd;
  sd = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || It.current) Ot = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ot = !1, up(e, t, n);
      Ot = (e.flags & 131072) !== 0;
    }
    else Ot = !1, Ye && (t.flags & 1048576) !== 0 && Fu(t, ui, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        _i(e, t), e = t.pendingProps;
        var o = ko(t, jt.current);
        To(t, n), o = Ka(null, t, r, e, o, n);
        var i = qa();
        return t.flags |= 1, typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Rt(r) ? (i = !0, ii(t)) : i = !1, t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, Ua(t), o.updater = Si, t.stateNode = o, o._reactInternals = t, el(t, r, e, n), t = ol(null, t, r, !0, i, n)) : (t.tag = 0, Ye && i && Aa(t), Et(null, t, o, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (_i(e, t), e = t.pendingProps, o = r._init, r = o(r._payload), t.type = r, o = t.tag = _p(r), e = pn(r, e), o) {
            case 0:
              t = rl(null, t, r, e, n);
              break e;
            case 1:
              t = Ic(null, t, r, e, n);
              break e;
            case 11:
              t = Cc(null, t, r, e, n);
              break e;
            case 14:
              t = Pc(null, t, r, pn(r.type, e), n);
              break e;
          }
          throw Error(u(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : pn(r, o), rl(e, t, r, o, n);
      case 1:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : pn(r, o), Ic(e, t, r, o, n);
      case 3:
        e: {
          if (Rc(t), e === null) throw Error(u(387));
          r = t.pendingProps, i = t.memoizedState, o = i.element, Ku(e, t), mi(t, r, null, n);
          var d = t.memoizedState;
          if (r = d.element, i.isDehydrated) if (i = { element: r, isDehydrated: !1, cache: d.cache, pendingSuspenseBoundaries: d.pendingSuspenseBoundaries, transitions: d.transitions }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
            o = Io(Error(u(423)), t), t = Oc(e, t, r, n, o);
            break e;
          } else if (r !== o) {
            o = Io(Error(u(424)), t), t = Oc(e, t, r, n, o);
            break e;
          } else for (Wt = nr(t.stateNode.containerInfo.firstChild), Bt = t, Ye = !0, fn = null, n = Hu(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Co(), r === o) {
              t = qn(e, t, n);
              break e;
            }
            Et(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Xu(t), e === null && Oa(t), r = t.type, o = t.pendingProps, i = e !== null ? e.memoizedProps : null, d = o.children, _a(r, o) ? d = null : i !== null && _a(r, i) && (t.flags |= 32), Ac(e, t), Et(e, t, d, n), t.child;
      case 6:
        return e === null && Oa(t), null;
      case 13:
        return $c(e, t, n);
      case 4:
        return ba(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Po(t, null, r, n) : Et(e, t, r, n), t.child;
      case 11:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : pn(r, o), Cc(e, t, r, o, n);
      case 7:
        return Et(e, t, t.pendingProps, n), t.child;
      case 8:
        return Et(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Et(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, o = t.pendingProps, i = t.memoizedProps, d = o.value, We(fi, r._currentValue), r._currentValue = d, i !== null) if (dn(i.value, d)) {
            if (i.children === o.children && !It.current) {
              t = qn(e, t, n);
              break e;
            }
          } else for (i = t.child, i !== null && (i.return = t); i !== null; ) {
            var m = i.dependencies;
            if (m !== null) {
              d = i.child;
              for (var g = m.firstContext; g !== null; ) {
                if (g.context === r) {
                  if (i.tag === 1) {
                    g = Kn(-1, n & -n), g.tag = 2;
                    var N = i.updateQueue;
                    if (N !== null) {
                      N = N.shared;
                      var D = N.pending;
                      D === null ? g.next = g : (g.next = D.next, D.next = g), N.pending = g;
                    }
                  }
                  i.lanes |= n, g = i.alternate, g !== null && (g.lanes |= n), Fa(
                    i.return,
                    n,
                    t
                  ), m.lanes |= n;
                  break;
                }
                g = g.next;
              }
            } else if (i.tag === 10) d = i.type === t.type ? null : i.child;
            else if (i.tag === 18) {
              if (d = i.return, d === null) throw Error(u(341));
              d.lanes |= n, m = d.alternate, m !== null && (m.lanes |= n), Fa(d, n, t), d = i.sibling;
            } else d = i.child;
            if (d !== null) d.return = i;
            else for (d = i; d !== null; ) {
              if (d === t) {
                d = null;
                break;
              }
              if (i = d.sibling, i !== null) {
                i.return = d.return, d = i;
                break;
              }
              d = d.return;
            }
            i = d;
          }
          Et(e, t, o.children, n), t = t.child;
        }
        return t;
      case 9:
        return o = t.type, r = t.pendingProps.children, To(t, n), o = Zt(o), r = r(o), t.flags |= 1, Et(e, t, r, n), t.child;
      case 14:
        return r = t.type, o = pn(r, t.pendingProps), o = pn(r.type, o), Pc(e, t, r, o, n);
      case 15:
        return Nc(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, o = t.pendingProps, o = t.elementType === r ? o : pn(r, o), _i(e, t), t.tag = 1, Rt(r) ? (e = !0, ii(t)) : e = !1, To(t, n), wc(t, r, o), el(t, r, o, n), ol(null, t, r, !0, e, n);
      case 19:
        return zc(e, t, n);
      case 22:
        return Tc(e, t, n);
    }
    throw Error(u(156, t.tag));
  };
  function id(e, t) {
    return Ls(e, t);
  }
  function kp(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function nn(e, t, n, r) {
    return new kp(e, t, n, r);
  }
  function _l(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function _p(e) {
    if (typeof e == "function") return _l(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === Le) return 11;
      if (e === Ue) return 14;
    }
    return 2;
  }
  function pr(e, t) {
    var n = e.alternate;
    return n === null ? (n = nn(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Mi(e, t, n, r, o, i) {
    var d = 2;
    if (r = e, typeof e == "function") _l(e) && (d = 1);
    else if (typeof e == "string") d = 5;
    else e: switch (e) {
      case fe:
        return Jr(n.children, o, i, t);
      case $:
        d = 8, o |= 8;
        break;
      case Q:
        return e = nn(12, n, t, o | 2), e.elementType = Q, e.lanes = i, e;
      case Ve:
        return e = nn(13, n, t, o), e.elementType = Ve, e.lanes = i, e;
      case De:
        return e = nn(19, n, t, o), e.elementType = De, e.lanes = i, e;
      case ve:
        return zi(n, o, i, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case we:
            d = 10;
            break e;
          case Oe:
            d = 9;
            break e;
          case Le:
            d = 11;
            break e;
          case Ue:
            d = 14;
            break e;
          case Ae:
            d = 16, r = null;
            break e;
        }
        throw Error(u(130, e == null ? e : typeof e, ""));
    }
    return t = nn(d, n, t, o), t.elementType = e, t.type = r, t.lanes = i, t;
  }
  function Jr(e, t, n, r) {
    return e = nn(7, e, r, t), e.lanes = n, e;
  }
  function zi(e, t, n, r) {
    return e = nn(22, e, r, t), e.elementType = ve, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function El(e, t, n) {
    return e = nn(6, e, null, t), e.lanes = n, e;
  }
  function Cl(e, t, n) {
    return t = nn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Ep(e, t, n, r, o) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = er(0), this.expirationTimes = er(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = er(0), this.identifierPrefix = r, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null;
  }
  function Pl(e, t, n, r, o, i, d, m, g) {
    return e = new Ep(e, t, n, m, g), t === 1 ? (t = 1, i === !0 && (t |= 8)) : t = 0, i = nn(3, null, null, t), e.current = i, i.stateNode = e, i.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ua(i), e;
  }
  function Cp(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: de, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function ad(e) {
    if (!e) return or;
    e = e._reactInternals;
    e: {
      if (Cn(e) !== e || e.tag !== 1) throw Error(u(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Rt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(u(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Rt(n)) return Mu(e, n, t);
    }
    return t;
  }
  function ld(e, t, n, r, o, i, d, m, g) {
    return e = Pl(n, r, !0, e, o, i, d, m, g), e.context = ad(null), n = e.current, r = Ct(), o = dr(n), i = Kn(r, o), i.callback = t ?? null, ar(n, i, o), e.current.lanes = o, Un(e, o, r), Mt(e, r), e;
  }
  function Li(e, t, n, r) {
    var o = t.current, i = Ct(), d = dr(o);
    return n = ad(n), t.context === null ? t.context = n : t.pendingContext = n, t = Kn(i, d), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = ar(o, t, d), e !== null && (vn(e, o, d, i), hi(e, o, d)), d;
  }
  function Fi(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function ud(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Nl(e, t) {
    ud(e, t), (e = e.alternate) && ud(e, t);
  }
  function Pp() {
    return null;
  }
  var cd = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Tl(e) {
    this._internalRoot = e;
  }
  Di.prototype.render = Tl.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Li(e, t, null, null);
  }, Di.prototype.unmount = Tl.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Qr(function() {
        Li(null, e, null, null);
      }), t[Bn] = null;
    }
  };
  function Di(e) {
    this._internalRoot = e;
  }
  Di.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Yo();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < a.length && t !== 0 && t < a[n].priority; n++) ;
      a.splice(n, 0, e), n === 0 && P(e);
    }
  };
  function Al(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Ui(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function dd() {
  }
  function Np(e, t, n, r, o) {
    if (o) {
      if (typeof r == "function") {
        var i = r;
        r = function() {
          var N = Fi(d);
          i.call(N);
        };
      }
      var d = ld(t, r, e, 0, null, !1, !1, "", dd);
      return e._reactRootContainer = d, e[Bn] = d.current, is(e.nodeType === 8 ? e.parentNode : e), Qr(), d;
    }
    for (; o = e.lastChild; ) e.removeChild(o);
    if (typeof r == "function") {
      var m = r;
      r = function() {
        var N = Fi(g);
        m.call(N);
      };
    }
    var g = Pl(e, 0, !1, null, null, !1, !1, "", dd);
    return e._reactRootContainer = g, e[Bn] = g.current, is(e.nodeType === 8 ? e.parentNode : e), Qr(function() {
      Li(t, g, n, r);
    }), g;
  }
  function bi(e, t, n, r, o) {
    var i = n._reactRootContainer;
    if (i) {
      var d = i;
      if (typeof o == "function") {
        var m = o;
        o = function() {
          var g = Fi(d);
          m.call(g);
        };
      }
      Li(t, d, e, o);
    } else d = Np(n, t, e, o, r);
    return Fi(d);
  }
  Ks = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Rr(t.pendingLanes);
          n !== 0 && (qo(t, n | 1), Mt(t, Xe()), (Re & 6) === 0 && ($o = Xe() + 500, sr()));
        }
        break;
      case 13:
        Qr(function() {
          var r = Qn(e, 1);
          if (r !== null) {
            var o = Ct();
            vn(r, e, 1, o);
          }
        }), Nl(e, 1);
    }
  }, Xo = function(e) {
    if (e.tag === 13) {
      var t = Qn(e, 134217728);
      if (t !== null) {
        var n = Ct();
        vn(t, e, 134217728, n);
      }
      Nl(e, 134217728);
    }
  }, qs = function(e) {
    if (e.tag === 13) {
      var t = dr(e), n = Qn(e, t);
      if (n !== null) {
        var r = Ct();
        vn(n, e, t, r);
      }
      Nl(e, t);
    }
  }, Yo = function() {
    return $e;
  }, Js = function(e, t) {
    var n = $e;
    try {
      return $e = e, t();
    } finally {
      $e = n;
    }
  }, Bo = function(e, t, n) {
    switch (t) {
      case "input":
        if (eo(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var o = oi(r);
              if (!o) throw Error(u(90));
              yt(r), eo(r, o);
            }
          }
        }
        break;
      case "textarea":
        to(e, n);
        break;
      case "select":
        t = n.value, t != null && jn(e, !!n.multiple, t, !1);
    }
  }, $s = jl, Er = Qr;
  var Tp = { usingClientEntryPoint: !1, Events: [us, jo, oi, io, Wo, jl] }, ks = { findFiberByHostInstance: Fr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Ap = { bundleType: ks.bundleType, version: ks.version, rendererPackageName: ks.rendererPackageName, rendererConfig: ks.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: pe.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Ar(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: ks.findFiberByHostInstance || Pp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Bi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Bi.isDisabled && Bi.supportsFiber) try {
      Ir = Bi.inject(Ap), qt = Bi;
    } catch {
    }
  }
  return zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Tp, zt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Al(t)) throw Error(u(200));
    return Cp(e, t, null, n);
  }, zt.createRoot = function(e, t) {
    if (!Al(e)) throw Error(u(299));
    var n = !1, r = "", o = cd;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = Pl(e, 1, !1, null, null, n, !1, r, o), e[Bn] = t.current, is(e.nodeType === 8 ? e.parentNode : e), new Tl(t);
  }, zt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = Ar(t), e = e === null ? null : e.stateNode, e;
  }, zt.flushSync = function(e) {
    return Qr(e);
  }, zt.hydrate = function(e, t, n) {
    if (!Ui(t)) throw Error(u(200));
    return bi(null, e, t, !0, n);
  }, zt.hydrateRoot = function(e, t, n) {
    if (!Al(e)) throw Error(u(405));
    var r = n != null && n.hydratedSources || null, o = !1, i = "", d = cd;
    if (n != null && (n.unstable_strictMode === !0 && (o = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onRecoverableError !== void 0 && (d = n.onRecoverableError)), t = ld(t, null, e, 1, n ?? null, o, !1, i, d), e[Bn] = t.current, is(e), r) for (e = 0; e < r.length; e++) n = r[e], o = n._getVersion, o = o(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, o] : t.mutableSourceEagerHydrationData.push(
      n,
      o
    );
    return new Di(t);
  }, zt.render = function(e, t, n) {
    if (!Ui(t)) throw Error(u(200));
    return bi(null, e, t, !1, n);
  }, zt.unmountComponentAtNode = function(e) {
    if (!Ui(e)) throw Error(u(40));
    return e._reactRootContainer ? (Qr(function() {
      bi(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Bn] = null;
      });
    }), !0) : !1;
  }, zt.unstable_batchedUpdates = jl, zt.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Ui(n)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return bi(e, t, n, !1, r);
  }, zt.version = "18.3.1-next-f1338f8080-20240426", zt;
}
var wd;
function bp() {
  if (wd) return Ol.exports;
  wd = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (l) {
        console.error(l);
      }
  }
  return s(), Ol.exports = Up(), Ol.exports;
}
var xd;
function Bp() {
  if (xd) return Wi;
  xd = 1;
  var s = bp();
  return Wi.createRoot = s.createRoot, Wi.hydrateRoot = s.hydrateRoot, Wi;
}
var Wp = Bp();
const Vp = /* @__PURE__ */ Dd(Wp), Hp = "https://aumc-aicode-openai-swedencentral-oai.openai.azure.com/openai/v1", Qp = `${Hp}/chat/completions`, Kp = 1, jd = 256 * 1024 * 1024, qp = 512 * 1024 * 1024, As = 64 * 1024, Jp = `You are the analysis assistant inside OMERO Analysis Chat.
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
Saved multi-step workflows are isolated ordered script versions. Use list_saved_workflows and
run_saved_workflow when an approved workflow matches the user's request; never create or publish
a workflow without an explicit user action.

CI Segmentation measurement databases may be DuckDB or SQLite. Start by discovering the actual
tables/views and their columns; never assume a schema. Expected tables can include schema_info,
measurement_runs, images, channels, label_sets, objects, intensity_measurements, and relationships.
Convenience views can include object_features, intensity_features, mask_relationships, and
foci_assignments. object_id is database-wide; channel_index is one-based; image timepoints and
pixel coordinates are zero-based; bounding-box maxima are exclusive. Intensities are measured on
the final masks without normalization or background subtraction. Physical values may be NULL when
calibration is absent. Relationships are stored in both directions, and primary assignments use
is_primary_for_source. Verify all names and semantics from the discovered database before querying.
Explain biological and measurement meaning without overstating causality.`, Xp = [
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
      description: "Run one user-approved workflow locally with isolated ordered steps.",
      parameters: {
        type: "object",
        properties: { workflow_id: { type: "string" } },
        required: ["workflow_id"],
        additionalProperties: !1
      }
    }
  }
];
function Vi() {
  const s = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return s ? decodeURIComponent(s[1]) : "";
}
function zo(s, l, u) {
  return s.replace("TYPE", l).replace("/1/", `/${u}/`);
}
class Yp {
  constructor(l) {
    In(this, "contextToken", "");
    In(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = l;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const l = this.bootstrap.context;
    if (!l) return;
    const u = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Vi()
      },
      body: JSON.stringify({
        object_type: l.object_type,
        object_id: l.object_id
      })
    }), f = await Xr(u);
    if (typeof f.context_token != "string" || !Array.isArray(f.operations) || f.operations.some((p) => typeof p != "string"))
      throw new Error("OMERO returned an invalid context capability");
    this.contextToken = f.context_token, this.operations = new Set(f.operations);
  }
  async authorizedFetch(l, u = {}, f = !0) {
    const p = await fetch(l, {
      ...u,
      credentials: "same-origin",
      headers: {
        ...u.headers || {},
        "X-OMERO-Analysis-Context": this.contextToken
      }
    });
    return f && (p.status === 401 || p.status === 403) ? (await this.connect(), this.authorizedFetch(l, u, !1)) : p;
  }
  async download(l) {
    const u = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${l.annotation_id}/download/`
    ), f = await this.authorizedFetch(u);
    if (!f.ok) throw new Error(await Ji(f));
    return f.arrayBuffer();
  }
  async attach(l) {
    const u = this.bootstrap.context;
    if (!u || !l.data) throw new Error("No OMERO target or result data");
    const f = new FormData();
    f.append("file", new Blob([l.data], { type: l.type }), l.name);
    const p = await this.authorizedFetch(
      zo(
        this.bootstrap.uploadTemplate,
        u.object_type,
        u.object_id
      ),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": Vi()
        },
        body: f
      }
    ), v = await Xr(p);
    return Xi(v.attachment);
  }
  async listSnapshots() {
    const l = this.bootstrap.context;
    if (!l) return [];
    const u = await this.authorizedFetch(
      zo(this.bootstrap.snapshotsTemplate, l.object_type, l.object_id),
      {
        headers: {}
      }
    ), f = await Xr(u);
    return Sd(f.snapshots);
  }
  async hierarchy() {
    const l = this.bootstrap.context;
    if (!l) return null;
    const u = await this.authorizedFetch(
      zo(this.bootstrap.hierarchyTemplate, l.object_type, l.object_id)
    );
    return Gp(await Xr(u));
  }
  async uploadSnapshot(l, u) {
    const f = this.bootstrap.context;
    if (!f) throw new Error("No OMERO target for the project snapshot");
    const p = new FormData();
    p.append(
      "file",
      new Blob([u], { type: "application/zip" }),
      l
    );
    const v = await this.authorizedFetch(
      zo(this.bootstrap.snapshotUploadTemplate, f.object_type, f.object_id),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": Vi()
        },
        body: p
      }
    ), y = await Xr(v);
    return Xi(y.snapshot);
  }
  async downloadSnapshot(l) {
    const u = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${l.annotation_id}/download/`
    ), f = await this.authorizedFetch(u);
    if (!f.ok) throw new Error(await Ji(f));
    return f.arrayBuffer();
  }
  async listWorkflowTemplates() {
    const l = this.bootstrap.context;
    if (!l) return [];
    const u = await this.authorizedFetch(
      zo(this.bootstrap.workflowTemplatesTemplate, l.object_type, l.object_id)
    ), f = await Xr(u);
    return Sd(f.workflows);
  }
  async uploadWorkflowTemplate(l, u) {
    const f = this.bootstrap.context;
    if (!f) throw new Error("No OMERO target for the workflow template");
    const p = new FormData();
    p.append("file", new Blob([u], { type: "application/json" }), l);
    const v = await this.authorizedFetch(
      zo(this.bootstrap.workflowTemplatesTemplate, f.object_type, f.object_id),
      { method: "POST", headers: { "X-CSRFToken": Vi() }, body: p }
    ), y = await Xr(v);
    return Xi(y.workflow);
  }
  async downloadWorkflowTemplate(l) {
    const u = this.bootstrap.workflowDownloadTemplate.replace(
      "/1/download/",
      `/${l.annotation_id}/download/`
    ), f = await this.authorizedFetch(u);
    if (!f.ok) throw new Error(await Ji(f));
    return f.arrayBuffer();
  }
}
async function Ji(s) {
  var l;
  try {
    return ((l = (await s.json()).error) == null ? void 0 : l.message) || `${s.status} ${s.statusText}`;
  } catch {
    return `${s.status} ${s.statusText}`;
  }
}
async function Xr(s) {
  var u;
  const l = await s.json().catch(() => ({}));
  if (!s.ok)
    throw new Error(((u = l.error) == null ? void 0 : u.message) || `${s.status} ${s.statusText}`);
  return l;
}
function yr(s, l) {
  if (!s || typeof s != "object" || Array.isArray(s))
    throw new Error(`${l} is not a valid object`);
  return s;
}
function Xi(s) {
  const l = yr(s, "OMERO attachment");
  if (!Number.isInteger(l.annotation_id) || !Number.isInteger(l.file_id) || typeof l.name != "string" || typeof l.mimetype != "string" || typeof l.size != "number" || !["attachment", "result", "project", "workflow"].includes(l.kind) || typeof l.supported != "boolean")
    throw new Error("OMERO returned invalid attachment metadata");
  return l;
}
function Sd(s) {
  if (s == null) return [];
  if (!Array.isArray(s)) throw new Error("OMERO returned an invalid attachment list");
  return s.map(Xi);
}
function Gp(s) {
  const l = yr(s, "OMERO hierarchy"), u = (f) => {
    const p = yr(f, "OMERO hierarchy item");
    if (typeof p.type != "string" || !Number.isInteger(p.id) || typeof p.name != "string" || typeof p.supported != "boolean") throw new Error("OMERO returned an invalid hierarchy item");
    return p;
  };
  if (!Array.isArray(l.parents) || !Array.isArray(l.children))
    throw new Error("OMERO returned an invalid hierarchy");
  return {
    current: u(l.current),
    parents: l.parents.map(u),
    children: l.children.map(u)
  };
}
async function Zp(s, l, u, f) {
  var A, F, H, oe, G, ee;
  const p = await fetch(Qp, {
    method: "POST",
    signal: u,
    headers: {
      "Content-Type": "application/json",
      "api-key": s.apiKey
    },
    body: JSON.stringify({
      model: s.model,
      temperature: Kp,
      messages: l,
      tools: Xp,
      tool_choice: "auto",
      stream: !!f,
      stream_options: f ? { include_usage: !0 } : void 0
    })
  });
  if (!p.ok) throw new Error(await Ji(p));
  if (!f || !((A = p.headers.get("content-type")) != null && A.includes("text/event-stream")))
    return kd(await p.json());
  const v = (F = p.body) == null ? void 0 : F.getReader();
  if (!v) throw new Error("AmsterdamUMC returned an empty response stream");
  const y = new TextDecoder();
  let _ = "", S = "", R;
  const T = /* @__PURE__ */ new Map();
  for (; ; ) {
    const { value: ye, done: Ne } = await v.read();
    _ += y.decode(ye || new Uint8Array(), { stream: !Ne });
    const ke = _.split(/\r?\n/);
    _ = ke.pop() || "";
    for (const pe of ke) {
      if (!pe.startsWith("data:")) continue;
      const Se = pe.slice(5).trim();
      if (!Se || Se === "[DONE]") continue;
      const de = JSON.parse(Se);
      de.usage && (R = de.usage);
      const fe = (oe = (H = de.choices) == null ? void 0 : H[0]) == null ? void 0 : oe.delta;
      fe != null && fe.content && (S += fe.content, f(S));
      for (const $ of (fe == null ? void 0 : fe.tool_calls) || []) {
        const Q = Number($.index || 0), we = T.get(Q) || {
          id: "",
          type: "function",
          function: { name: "", arguments: "" }
        };
        we.id += $.id || "", we.function.name += ((G = $.function) == null ? void 0 : G.name) || "", we.function.arguments += ((ee = $.function) == null ? void 0 : ee.arguments) || "", T.set(Q, we);
      }
    }
    if (Ne) break;
  }
  return kd({
    choices: [{
      message: {
        role: "assistant",
        content: S || null,
        tool_calls: T.size ? Array.from(T.values()) : void 0
      }
    }],
    usage: R
  });
}
function kd(s) {
  const l = yr(s, "AI response");
  if (!Array.isArray(l.choices) || !l.choices.length)
    throw new Error("AmsterdamUMC returned no response choices");
  for (const u of l.choices) {
    const f = yr(yr(u, "AI choice").message, "AI message");
    if (f.role !== "assistant" || !(f.content == null || typeof f.content == "string"))
      throw new Error("AmsterdamUMC returned an invalid assistant message");
    if (f.tool_calls != null) {
      if (!Array.isArray(f.tool_calls)) throw new Error("AmsterdamUMC returned invalid tool calls");
      for (const p of f.tool_calls) {
        const v = yr(p, "AI tool call"), y = yr(v.function, "AI tool function");
        if (typeof v.id != "string" || v.type !== "function" || typeof y.name != "string" || typeof y.arguments != "string") throw new Error("AmsterdamUMC returned an invalid tool call");
      }
    }
  }
  return l;
}
function eh(s) {
  const l = JSON.stringify(s.modelPayload);
  return l.length > 64 * 1024 ? `${l.slice(0, 64 * 1024)}
[tool output truncated]` : l;
}
function Pt(s) {
  const l = String(s instanceof Error ? s.message : s).slice(0, As), u = JSON.stringify({
    ok: !1,
    error: l,
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
  return u.length > As ? `${u.slice(0, As)}
[tool error truncated]` : u;
}
var nt = Uint8Array, Ht = Uint16Array, Zl = Int32Array, ea = new nt([
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
]), ta = new nt([
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
]), Wl = new nt([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Ud = function(s, l) {
  for (var u = new Ht(31), f = 0; f < 31; ++f)
    u[f] = l += 1 << s[f - 1];
  for (var p = new Zl(u[30]), f = 1; f < 30; ++f)
    for (var v = u[f]; v < u[f + 1]; ++v)
      p[v] = v - u[f] << 5 | f;
  return { b: u, r: p };
}, bd = Ud(ea, 2), Bd = bd.b, Vl = bd.r;
Bd[28] = 258, Vl[258] = 28;
var Wd = Ud(ta, 0), th = Wd.b, _d = Wd.r, Hl = new Ht(32768);
for (var Je = 0; Je < 32768; ++Je) {
  var mr = (Je & 43690) >> 1 | (Je & 21845) << 1;
  mr = (mr & 52428) >> 2 | (mr & 13107) << 2, mr = (mr & 61680) >> 4 | (mr & 3855) << 4, Hl[Je] = ((mr & 65280) >> 8 | (mr & 255) << 8) >> 1;
}
var Mn = (function(s, l, u) {
  for (var f = s.length, p = 0, v = new Ht(l); p < f; ++p)
    s[p] && ++v[s[p] - 1];
  var y = new Ht(l);
  for (p = 1; p < l; ++p)
    y[p] = y[p - 1] + v[p - 1] << 1;
  var _;
  if (u) {
    _ = new Ht(1 << l);
    var S = 15 - l;
    for (p = 0; p < f; ++p)
      if (s[p])
        for (var R = p << 4 | s[p], T = l - s[p], A = y[s[p] - 1]++ << T, F = A | (1 << T) - 1; A <= F; ++A)
          _[Hl[A] >> S] = R;
  } else
    for (_ = new Ht(f), p = 0; p < f; ++p)
      s[p] && (_[p] = Hl[y[s[p] - 1]++] >> 15 - s[p]);
  return _;
}), gr = new nt(288);
for (var Je = 0; Je < 144; ++Je)
  gr[Je] = 8;
for (var Je = 144; Je < 256; ++Je)
  gr[Je] = 9;
for (var Je = 256; Je < 280; ++Je)
  gr[Je] = 7;
for (var Je = 280; Je < 288; ++Je)
  gr[Je] = 8;
var Is = new nt(32);
for (var Je = 0; Je < 32; ++Je)
  Is[Je] = 5;
var nh = /* @__PURE__ */ Mn(gr, 9, 0), rh = /* @__PURE__ */ Mn(gr, 9, 1), oh = /* @__PURE__ */ Mn(Is, 5, 0), sh = /* @__PURE__ */ Mn(Is, 5, 1), zl = function(s) {
  for (var l = s[0], u = 1; u < s.length; ++u)
    s[u] > l && (l = s[u]);
  return l;
}, yn = function(s, l, u) {
  var f = l / 8 | 0;
  return (s[f] | s[f + 1] << 8) >> (l & 7) & u;
}, Ll = function(s, l) {
  var u = l / 8 | 0;
  return (s[u] | s[u + 1] << 8 | s[u + 2] << 16) >> (l & 7);
}, eu = function(s) {
  return (s + 7) / 8 | 0;
}, Rs = function(s, l, u) {
  return (l == null || l < 0) && (l = 0), (u == null || u > s.length) && (u = s.length), new nt(s.subarray(l, u));
}, ih = [
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
], Nt = function(s, l, u) {
  var f = new Error(l || ih[s]);
  if (f.code = s, Error.captureStackTrace && Error.captureStackTrace(f, Nt), !u)
    throw f;
  return f;
}, ah = function(s, l, u, f) {
  var p = s.length, v = f ? f.length : 0;
  if (!p || l.f && !l.l)
    return u || new nt(0);
  var y = !u, _ = y || l.i != 2, S = l.i;
  y && (u = new nt(p * 3));
  var R = function(Tt) {
    var yt = u.length;
    if (Tt > yt) {
      var ft = new nt(Math.max(yt * 2, Tt));
      ft.set(u), u = ft;
    }
  }, T = l.f || 0, A = l.p || 0, F = l.b || 0, H = l.l, oe = l.d, G = l.m, ee = l.n, ye = p * 8;
  do {
    if (!H) {
      T = yn(s, A, 1);
      var Ne = yn(s, A + 1, 3);
      if (A += 3, Ne)
        if (Ne == 1)
          H = rh, oe = sh, G = 9, ee = 5;
        else if (Ne == 2) {
          var de = yn(s, A, 31) + 257, fe = yn(s, A + 10, 15) + 4, $ = de + yn(s, A + 5, 31) + 1;
          A += 14;
          for (var Q = new nt($), we = new nt(19), Oe = 0; Oe < fe; ++Oe)
            we[Wl[Oe]] = yn(s, A + Oe * 3, 7);
          A += fe * 3;
          for (var Le = zl(we), Ve = (1 << Le) - 1, De = Mn(we, Le, 1), Oe = 0; Oe < $; ) {
            var Ue = De[yn(s, A, Ve)];
            A += Ue & 15;
            var ke = Ue >> 4;
            if (ke < 16)
              Q[Oe++] = ke;
            else {
              var Ae = 0, ve = 0;
              for (ke == 16 ? (ve = 3 + yn(s, A, 3), A += 2, Ae = Q[Oe - 1]) : ke == 17 ? (ve = 3 + yn(s, A, 7), A += 3) : ke == 18 && (ve = 11 + yn(s, A, 127), A += 7); ve--; )
                Q[Oe++] = Ae;
            }
          }
          var B = Q.subarray(0, de), X = Q.subarray(de);
          G = zl(B), ee = zl(X), H = Mn(B, G, 1), oe = Mn(X, ee, 1);
        } else
          Nt(1);
      else {
        var ke = eu(A) + 4, pe = s[ke - 4] | s[ke - 3] << 8, Se = ke + pe;
        if (Se > p) {
          S && Nt(0);
          break;
        }
        _ && R(F + pe), u.set(s.subarray(ke, Se), F), l.b = F += pe, l.p = A = Se * 8, l.f = T;
        continue;
      }
      if (A > ye) {
        S && Nt(0);
        break;
      }
    }
    _ && R(F + 131072);
    for (var K = (1 << G) - 1, j = (1 << ee) - 1, O = A; ; O = A) {
      var Ae = H[Ll(s, A) & K], se = Ae >> 4;
      if (A += Ae & 15, A > ye) {
        S && Nt(0);
        break;
      }
      if (Ae || Nt(2), se < 256)
        u[F++] = se;
      else if (se == 256) {
        O = A, H = null;
        break;
      } else {
        var ie = se - 254;
        if (se > 264) {
          var Oe = se - 257, M = ea[Oe];
          ie = yn(s, A, (1 << M) - 1) + Bd[Oe], A += M;
        }
        var xe = oe[Ll(s, A) & j], Te = xe >> 4;
        xe || Nt(3), A += xe & 15;
        var X = th[Te];
        if (Te > 3) {
          var M = ta[Te];
          X += Ll(s, A) & (1 << M) - 1, A += M;
        }
        if (A > ye) {
          S && Nt(0);
          break;
        }
        _ && R(F + 131072);
        var je = F + ie;
        if (F < X) {
          var Ie = v - X, Ge = Math.min(X, je);
          for (Ie + F < 0 && Nt(3); F < Ge; ++F)
            u[F] = f[Ie + F];
        }
        for (; F < je; ++F)
          u[F] = u[F - X];
      }
    }
    l.l = H, l.p = O, l.b = F, l.f = T, H && (T = 1, l.m = G, l.d = oe, l.n = ee);
  } while (!T);
  return F != u.length && y ? Rs(u, 0, F) : u.subarray(0, F);
}, Xn = function(s, l, u) {
  u <<= l & 7;
  var f = l / 8 | 0;
  s[f] |= u, s[f + 1] |= u >> 8;
}, Es = function(s, l, u) {
  u <<= l & 7;
  var f = l / 8 | 0;
  s[f] |= u, s[f + 1] |= u >> 8, s[f + 2] |= u >> 16;
}, Fl = function(s, l) {
  for (var u = [], f = 0; f < s.length; ++f)
    s[f] && u.push({ s: f, f: s[f] });
  var p = u.length, v = u.slice();
  if (!p)
    return { t: Hd, l: 0 };
  if (p == 1) {
    var y = new nt(u[0].s + 1);
    return y[u[0].s] = 1, { t: y, l: 1 };
  }
  u.sort(function(Se, de) {
    return Se.f - de.f;
  }), u.push({ s: -1, f: 25001 });
  var _ = u[0], S = u[1], R = 0, T = 1, A = 2;
  for (u[0] = { s: -1, f: _.f + S.f, l: _, r: S }; T != p - 1; )
    _ = u[u[R].f < u[A].f ? R++ : A++], S = u[R != T && u[R].f < u[A].f ? R++ : A++], u[T++] = { s: -1, f: _.f + S.f, l: _, r: S };
  for (var F = v[0].s, f = 1; f < p; ++f)
    v[f].s > F && (F = v[f].s);
  var H = new Ht(F + 1), oe = Ql(u[T - 1], H, 0);
  if (oe > l) {
    var f = 0, G = 0, ee = oe - l, ye = 1 << ee;
    for (v.sort(function(de, fe) {
      return H[fe.s] - H[de.s] || de.f - fe.f;
    }); f < p; ++f) {
      var Ne = v[f].s;
      if (H[Ne] > l)
        G += ye - (1 << oe - H[Ne]), H[Ne] = l;
      else
        break;
    }
    for (G >>= ee; G > 0; ) {
      var ke = v[f].s;
      H[ke] < l ? G -= 1 << l - H[ke]++ - 1 : ++f;
    }
    for (; f >= 0 && G; --f) {
      var pe = v[f].s;
      H[pe] == l && (--H[pe], ++G);
    }
    oe = l;
  }
  return { t: new nt(H), l: oe };
}, Ql = function(s, l, u) {
  return s.s == -1 ? Math.max(Ql(s.l, l, u + 1), Ql(s.r, l, u + 1)) : l[s.s] = u;
}, Ed = function(s) {
  for (var l = s.length; l && !s[--l]; )
    ;
  for (var u = new Ht(++l), f = 0, p = s[0], v = 1, y = function(S) {
    u[f++] = S;
  }, _ = 1; _ <= l; ++_)
    if (s[_] == p && _ != l)
      ++v;
    else {
      if (!p && v > 2) {
        for (; v > 138; v -= 138)
          y(32754);
        v > 2 && (y(v > 10 ? v - 11 << 5 | 28690 : v - 3 << 5 | 12305), v = 0);
      } else if (v > 3) {
        for (y(p), --v; v > 6; v -= 6)
          y(8304);
        v > 2 && (y(v - 3 << 5 | 8208), v = 0);
      }
      for (; v--; )
        y(p);
      v = 1, p = s[_];
    }
  return { c: u.subarray(0, f), n: l };
}, Cs = function(s, l) {
  for (var u = 0, f = 0; f < l.length; ++f)
    u += s[f] * l[f];
  return u;
}, Vd = function(s, l, u) {
  var f = u.length, p = eu(l + 2);
  s[p] = f & 255, s[p + 1] = f >> 8, s[p + 2] = s[p] ^ 255, s[p + 3] = s[p + 1] ^ 255;
  for (var v = 0; v < f; ++v)
    s[p + v + 4] = u[v];
  return (p + 4 + f) * 8;
}, Cd = function(s, l, u, f, p, v, y, _, S, R, T) {
  Xn(l, T++, u), ++p[256];
  for (var A = Fl(p, 15), F = A.t, H = A.l, oe = Fl(v, 15), G = oe.t, ee = oe.l, ye = Ed(F), Ne = ye.c, ke = ye.n, pe = Ed(G), Se = pe.c, de = pe.n, fe = new Ht(19), $ = 0; $ < Ne.length; ++$)
    ++fe[Ne[$] & 31];
  for (var $ = 0; $ < Se.length; ++$)
    ++fe[Se[$] & 31];
  for (var Q = Fl(fe, 7), we = Q.t, Oe = Q.l, Le = 19; Le > 4 && !we[Wl[Le - 1]]; --Le)
    ;
  var Ve = R + 5 << 3, De = Cs(p, gr) + Cs(v, Is) + y, Ue = Cs(p, F) + Cs(v, G) + y + 14 + 3 * Le + Cs(fe, we) + 2 * fe[16] + 3 * fe[17] + 7 * fe[18];
  if (S >= 0 && Ve <= De && Ve <= Ue)
    return Vd(l, T, s.subarray(S, S + R));
  var Ae, ve, B, X;
  if (Xn(l, T, 1 + (Ue < De)), T += 2, Ue < De) {
    Ae = Mn(F, H, 0), ve = F, B = Mn(G, ee, 0), X = G;
    var K = Mn(we, Oe, 0);
    Xn(l, T, ke - 257), Xn(l, T + 5, de - 1), Xn(l, T + 10, Le - 4), T += 14;
    for (var $ = 0; $ < Le; ++$)
      Xn(l, T + 3 * $, we[Wl[$]]);
    T += 3 * Le;
    for (var j = [Ne, Se], O = 0; O < 2; ++O)
      for (var se = j[O], $ = 0; $ < se.length; ++$) {
        var ie = se[$] & 31;
        Xn(l, T, K[ie]), T += we[ie], ie > 15 && (Xn(l, T, se[$] >> 5 & 127), T += se[$] >> 12);
      }
  } else
    Ae = nh, ve = gr, B = oh, X = Is;
  for (var $ = 0; $ < _; ++$) {
    var M = f[$];
    if (M > 255) {
      var ie = M >> 18 & 31;
      Es(l, T, Ae[ie + 257]), T += ve[ie + 257], ie > 7 && (Xn(l, T, M >> 23 & 31), T += ea[ie]);
      var xe = M & 31;
      Es(l, T, B[xe]), T += X[xe], xe > 3 && (Es(l, T, M >> 5 & 8191), T += ta[xe]);
    } else
      Es(l, T, Ae[M]), T += ve[M];
  }
  return Es(l, T, Ae[256]), T + ve[256];
}, lh = /* @__PURE__ */ new Zl([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Hd = /* @__PURE__ */ new nt(0), uh = function(s, l, u, f, p, v) {
  var y = v.z || s.length, _ = new nt(f + y + 5 * (1 + Math.ceil(y / 7e3)) + p), S = _.subarray(f, _.length - p), R = v.l, T = (v.r || 0) & 7;
  if (l) {
    T && (S[0] = v.r >> 3);
    for (var A = lh[l - 1], F = A >> 13, H = A & 8191, oe = (1 << u) - 1, G = v.p || new Ht(32768), ee = v.h || new Ht(oe + 1), ye = Math.ceil(u / 3), Ne = 2 * ye, ke = function(zn) {
      return (s[zn] ^ s[zn + 1] << ye ^ s[zn + 2] << Ne) & oe;
    }, pe = new Zl(25e3), Se = new Ht(288), de = new Ht(32), fe = 0, $ = 0, Q = v.i || 0, we = 0, Oe = v.w || 0, Le = 0; Q + 2 < y; ++Q) {
      var Ve = ke(Q), De = Q & 32767, Ue = ee[Ve];
      if (G[De] = Ue, ee[Ve] = De, Oe <= Q) {
        var Ae = y - Q;
        if ((fe > 7e3 || we > 24576) && (Ae > 423 || !R)) {
          T = Cd(s, S, 0, pe, Se, de, $, we, Le, Q - Le, T), we = fe = $ = 0, Le = Q;
          for (var ve = 0; ve < 286; ++ve)
            Se[ve] = 0;
          for (var ve = 0; ve < 30; ++ve)
            de[ve] = 0;
        }
        var B = 2, X = 0, K = H, j = De - Ue & 32767;
        if (Ae > 2 && Ve == ke(Q - j))
          for (var O = Math.min(F, Ae) - 1, se = Math.min(32767, Q), ie = Math.min(258, Ae); j <= se && --K && De != Ue; ) {
            if (s[Q + B] == s[Q + B - j]) {
              for (var M = 0; M < ie && s[Q + M] == s[Q + M - j]; ++M)
                ;
              if (M > B) {
                if (B = M, X = j, M > O)
                  break;
                for (var xe = Math.min(j, M - 2), Te = 0, ve = 0; ve < xe; ++ve) {
                  var je = Q - j + ve & 32767, Ie = G[je], Ge = je - Ie & 32767;
                  Ge > Te && (Te = Ge, Ue = je);
                }
              }
            }
            De = Ue, Ue = G[De], j += De - Ue & 32767;
          }
        if (X) {
          pe[we++] = 268435456 | Vl[B] << 18 | _d[X];
          var Tt = Vl[B] & 31, yt = _d[X] & 31;
          $ += ea[Tt] + ta[yt], ++Se[257 + Tt], ++de[yt], Oe = Q + B, ++fe;
        } else
          pe[we++] = s[Q], ++Se[s[Q]];
      }
    }
    for (Q = Math.max(Q, Oe); Q < y; ++Q)
      pe[we++] = s[Q], ++Se[s[Q]];
    T = Cd(s, S, R, pe, Se, de, $, we, Le, Q - Le, T), R || (v.r = T & 7 | S[T / 8 | 0] << 3, T -= 7, v.h = ee, v.p = G, v.i = Q, v.w = Oe);
  } else {
    for (var Q = v.w || 0; Q < y + R; Q += 65535) {
      var ft = Q + 65535;
      ft >= y && (S[T / 8 | 0] = R, ft = y), T = Vd(S, T + 1, s.subarray(Q, ft));
    }
    v.i = y;
  }
  return Rs(_, 0, f + eu(T) + p);
}, ch = /* @__PURE__ */ (function() {
  for (var s = new Int32Array(256), l = 0; l < 256; ++l) {
    for (var u = l, f = 9; --f; )
      u = (u & 1 && -306674912) ^ u >>> 1;
    s[l] = u;
  }
  return s;
})(), dh = function() {
  var s = -1;
  return {
    p: function(l) {
      for (var u = s, f = 0; f < l.length; ++f)
        u = ch[u & 255 ^ l[f]] ^ u >>> 8;
      s = u;
    },
    d: function() {
      return ~s;
    }
  };
}, fh = function(s, l, u, f, p) {
  if (!p && (p = { l: 1 }, l.dictionary)) {
    var v = l.dictionary.subarray(-32768), y = new nt(v.length + s.length);
    y.set(v), y.set(s, v.length), s = y, p.w = v.length;
  }
  return uh(s, l.level == null ? 6 : l.level, l.mem == null ? p.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(s.length))) * 1.5) : 20 : 12 + l.mem, u, f, p);
}, Qd = function(s, l) {
  var u = {};
  for (var f in s)
    u[f] = s[f];
  for (var f in l)
    u[f] = l[f];
  return u;
}, $n = function(s, l) {
  return s[l] | s[l + 1] << 8;
}, gn = function(s, l) {
  return (s[l] | s[l + 1] << 8 | s[l + 2] << 16 | s[l + 3] << 24) >>> 0;
}, Dl = function(s, l) {
  return gn(s, l) + gn(s, l + 4) * 4294967296;
}, vt = function(s, l, u) {
  for (; u; ++l)
    s[l] = u, u >>>= 8;
};
function ph(s, l) {
  return fh(s, l || {}, 0, 0);
}
function hh(s, l) {
  return ah(s, { i: 2 }, l && l.out, l && l.dictionary);
}
var Kd = function(s, l, u, f) {
  for (var p in s) {
    var v = s[p], y = l + p, _ = f;
    Array.isArray(v) && (_ = Qd(f, v[1]), v = v[0]), v instanceof nt ? u[y] = [v, _] : (u[y += "/"] = [new nt(0), _], Kd(v, y, u, f));
  }
}, Pd = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), Kl = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), mh = 0;
try {
  Kl.decode(Hd, { stream: !0 }), mh = 1;
} catch {
}
var vh = function(s) {
  for (var l = "", u = 0; ; ) {
    var f = s[u++], p = (f > 127) + (f > 223) + (f > 239);
    if (u + p > s.length)
      return { s: l, r: Rs(s, u - 1) };
    p ? p == 3 ? (f = ((f & 15) << 18 | (s[u++] & 63) << 12 | (s[u++] & 63) << 6 | s[u++] & 63) - 65536, l += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023)) : p & 1 ? l += String.fromCharCode((f & 31) << 6 | s[u++] & 63) : l += String.fromCharCode((f & 15) << 12 | (s[u++] & 63) << 6 | s[u++] & 63) : l += String.fromCharCode(f);
  }
};
function ql(s, l) {
  var u;
  if (Pd)
    return Pd.encode(s);
  for (var f = s.length, p = new nt(s.length + (s.length >> 1)), v = 0, y = function(R) {
    p[v++] = R;
  }, u = 0; u < f; ++u) {
    if (v + 5 > p.length) {
      var _ = new nt(v + 8 + (f - u << 1));
      _.set(p), p = _;
    }
    var S = s.charCodeAt(u);
    S < 128 || l ? y(S) : S < 2048 ? (y(192 | S >> 6), y(128 | S & 63)) : S > 55295 && S < 57344 ? (S = 65536 + (S & 1047552) | s.charCodeAt(++u) & 1023, y(240 | S >> 18), y(128 | S >> 12 & 63), y(128 | S >> 6 & 63), y(128 | S & 63)) : (y(224 | S >> 12), y(128 | S >> 6 & 63), y(128 | S & 63));
  }
  return Rs(p, 0, v);
}
function qd(s, l) {
  if (l) {
    for (var u = "", f = 0; f < s.length; f += 16384)
      u += String.fromCharCode.apply(null, s.subarray(f, f + 16384));
    return u;
  } else {
    if (Kl)
      return Kl.decode(s);
    var p = vh(s), v = p.s, u = p.r;
    return u.length && Nt(8), v;
  }
}
var yh = function(s, l) {
  return l + 30 + $n(s, l + 26) + $n(s, l + 28);
}, gh = function(s, l, u) {
  var f = $n(s, l + 28), p = qd(s.subarray(l + 46, l + 46 + f), !($n(s, l + 8) & 2048)), v = l + 46 + f, y = gn(s, l + 20), _ = u && y == 4294967295 ? wh(s, v) : [y, gn(s, l + 24), gn(s, l + 42)], S = _[0], R = _[1], T = _[2];
  return [$n(s, l + 10), S, R, p, v + $n(s, l + 30) + $n(s, l + 32), T];
}, wh = function(s, l) {
  for (; $n(s, l) != 1; l += 4 + $n(s, l + 2))
    ;
  return [Dl(s, l + 12), Dl(s, l + 4), Dl(s, l + 20)];
}, Jl = function(s) {
  var l = 0;
  if (s)
    for (var u in s) {
      var f = s[u].length;
      f > 65535 && Nt(9), l += f + 4;
    }
  return l;
}, Nd = function(s, l, u, f, p, v, y, _) {
  var S = f.length, R = u.extra, T = _ && _.length, A = Jl(R);
  vt(s, l, y != null ? 33639248 : 67324752), l += 4, y != null && (s[l++] = 20, s[l++] = u.os), s[l] = 20, l += 2, s[l++] = u.flag << 1 | (v < 0 && 8), s[l++] = p && 8, s[l++] = u.compression & 255, s[l++] = u.compression >> 8;
  var F = new Date(u.mtime == null ? Date.now() : u.mtime), H = F.getFullYear() - 1980;
  if ((H < 0 || H > 119) && Nt(10), vt(s, l, H << 25 | F.getMonth() + 1 << 21 | F.getDate() << 16 | F.getHours() << 11 | F.getMinutes() << 5 | F.getSeconds() >> 1), l += 4, v != -1 && (vt(s, l, u.crc), vt(s, l + 4, v < 0 ? -v - 2 : v), vt(s, l + 8, u.size)), vt(s, l + 12, S), vt(s, l + 14, A), l += 16, y != null && (vt(s, l, T), vt(s, l + 6, u.attrs), vt(s, l + 10, y), l += 14), s.set(f, l), l += S, A)
    for (var oe in R) {
      var G = R[oe], ee = G.length;
      vt(s, l, +oe), vt(s, l + 2, ee), s.set(G, l + 4), l += 4 + ee;
    }
  return T && (s.set(_, l), l += T), l;
}, xh = function(s, l, u, f, p) {
  vt(s, l, 101010256), vt(s, l + 8, u), vt(s, l + 10, u), vt(s, l + 12, f), vt(s, l + 16, p);
};
function jh(s, l) {
  l || (l = {});
  var u = {}, f = [];
  Kd(s, "", u, l);
  var p = 0, v = 0;
  for (var y in u) {
    var _ = u[y], S = _[0], R = _[1], T = R.level == 0 ? 0 : 8, A = ql(y), F = A.length, H = R.comment, oe = H && ql(H), G = oe && oe.length, ee = Jl(R.extra);
    F > 65535 && Nt(11);
    var ye = T ? ph(S, R) : S, Ne = ye.length, ke = dh();
    ke.p(S), f.push(Qd(R, {
      size: S.length,
      crc: ke.d(),
      c: ye,
      f: A,
      m: oe,
      u: F != y.length || oe && H.length != G,
      o: p,
      compression: T
    })), p += 30 + F + ee + Ne, v += 76 + 2 * (F + ee) + (G || 0) + Ne;
  }
  for (var pe = new nt(v + 22), Se = p, de = v - p, fe = 0; fe < f.length; ++fe) {
    var A = f[fe];
    Nd(pe, A.o, A, A.f, A.u, A.c.length);
    var $ = 30 + A.f.length + Jl(A.extra);
    pe.set(A.c, A.o + $), Nd(pe, p, A, A.f, A.u, A.c.length, A.o, A.m), p += 16 + $ + (A.m ? A.m.length : 0);
  }
  return xh(pe, p, f.length, de, Se), pe;
}
function Sh(s, l) {
  for (var u = {}, f = s.length - 22; gn(s, f) != 101010256; --f)
    (!f || s.length - f > 65558) && Nt(13);
  var p = $n(s, f + 8);
  if (!p)
    return {};
  var v = gn(s, f + 16), y = v == 4294967295 || p == 65535;
  if (y) {
    var _ = gn(s, f - 12);
    y = gn(s, _) == 101075792, y && (p = gn(s, _ + 32), v = gn(s, _ + 48));
  }
  for (var S = 0; S < p; ++S) {
    var R = gh(s, v, y), T = R[0], A = R[1], F = R[2], H = R[3], oe = R[4], G = R[5], ee = yh(s, G);
    v = oe, T ? T == 8 ? u[H] = hh(s.subarray(ee, ee + A), { out: new nt(F) }) : Nt(14, "unknown compression type " + T) : u[H] = Rs(s, ee, ee + A);
  }
  return u;
}
const kh = "omero-analysis-chat", _h = 3, Gi = [
  "projects",
  "chats",
  "files",
  "executions",
  "scripts",
  "workflows",
  "artifacts",
  "audits"
];
function Gr(s) {
  return new Promise((l, u) => {
    s.onsuccess = () => l(s.result), s.onerror = () => u(s.error);
  });
}
function Os(s) {
  return new Promise((l, u) => {
    s.oncomplete = () => l(), s.onerror = () => u(s.error), s.onabort = () => u(s.error || new Error("Storage transaction aborted"));
  });
}
function wn() {
  return new Promise((s, l) => {
    const u = indexedDB.open(kh, _h);
    u.onupgradeneeded = () => {
      const f = u.result;
      f.objectStoreNames.contains("values") || f.createObjectStore("values");
      for (const p of Gi) {
        if (f.objectStoreNames.contains(p)) continue;
        const v = f.createObjectStore(p, { keyPath: "id" });
        p !== "projects" && v.createIndex("projectId", "projectId"), p === "projects" && v.createIndex("contextKey", "contextKey", { unique: !0 }), (p === "files" || p === "executions") && v.createIndex("chatId", "chatId");
      }
    }, u.onsuccess = () => s(u.result), u.onerror = () => l(u.error);
  });
}
async function Jd(s) {
  const u = (await wn()).transaction("values", "readonly");
  return Gr(u.objectStore("values").get(s));
}
async function Xd(s, l) {
  const f = (await wn()).transaction("values", "readwrite");
  f.objectStore("values").put(l, s), await Os(f);
}
async function wr(s, l) {
  const f = (await wn()).transaction(s, "readwrite");
  f.objectStore(s).put(l), await Os(f);
}
let Td = Promise.resolve();
function xn(s) {
  const l = Td.then(s, s);
  return Td = l.catch(() => {
  }), l;
}
async function Eh(s, l) {
  const f = (await wn()).transaction(s, "readwrite");
  f.objectStore(s).delete(l), await Os(f);
}
async function Lt(s, l) {
  const f = (await wn()).transaction(s, "readonly");
  return Gr(f.objectStore(s).index("projectId").getAll(l));
}
const Ad = (s) => xn(() => wr("projects", s)), Ul = (s) => xn(() => wr("chats", s)), Ps = (s) => xn(() => wr("files", s)), Ch = (s) => xn(() => wr("executions", s)), Lo = (s) => xn(() => wr("scripts", s)), Hi = (s) => xn(() => wr("workflows", s)), Ph = (s) => xn(() => wr("artifacts", s)), Nh = (s) => xn(() => wr("audits", s)), Th = (s) => xn(() => Eh("files", s));
async function Ah(s) {
  await xn(async () => {
    const u = (await wn()).transaction([...Gi], "readwrite");
    for (const f of Gi) {
      const p = u.objectStore(f);
      if (f === "projects") {
        p.delete(s);
        continue;
      }
      (await Gr(p.index("projectId").getAllKeys(s))).forEach((y) => p.delete(y));
    }
    await Os(u);
  });
}
async function Yd(s) {
  return s ? `${s.user_id}:${s.group_id}:${s.object_type}:${s.object_id}` : "standalone";
}
function Ih(s) {
  return s.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 64).toLowerCase() || "workspace";
}
function Rh(s) {
  return s ? `OMERO/${s.object_type}-${s.object_id}--${Ih(s.name)}` : "OMERO/Local--workspace";
}
async function On(s) {
  const l = typeof s == "string" ? new TextEncoder().encode(s) : new Uint8Array(s), u = await crypto.subtle.digest("SHA-256", l);
  return Array.from(new Uint8Array(u), (f) => f.toString(16).padStart(2, "0")).join("");
}
function Zi(s, l = "New analysis") {
  const u = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: crypto.randomUUID(),
    projectId: s,
    title: l,
    summary: "",
    archived: !1,
    messages: [],
    createdAt: u,
    updatedAt: u
  };
}
async function Oh(s) {
  const u = (await wn()).transaction("projects", "readonly");
  return Gr(u.objectStore("projects").index("contextKey").get(s));
}
async function Yn(s) {
  await xn(async () => {
    const u = (await wn()).transaction([...Gi], "readwrite"), f = {
      ...s.project,
      revision: (s.project.revision || 0) + 1
    };
    u.objectStore("projects").put(f), s.chats.forEach((p) => u.objectStore("chats").put(p)), s.files.forEach((p) => u.objectStore("files").put(p)), s.executions.forEach((p) => u.objectStore("executions").put(p)), s.scripts.forEach((p) => u.objectStore("scripts").put(p)), s.workflows.forEach((p) => u.objectStore("workflows").put(p)), s.artifacts.forEach((p) => u.objectStore("artifacts").put(p)), s.audits.forEach((p) => u.objectStore("audits").put(p)), await Os(u);
  });
}
async function $h(s, l, u) {
  const f = await Jd(`workspace:${u}`);
  if (!f) return null;
  const p = (/* @__PURE__ */ new Date()).toISOString();
  l.title = "Imported chat", l.messages = (f.messages || []).map((_) => ({
    id: String(_.id || crypto.randomUUID()),
    role: _.role === "user" ? "user" : "assistant",
    content: String(_.content || _.code || ""),
    kind: _.kind === "error" ? "error" : "text",
    createdAt: p
  })), l.updatedAt = p;
  const v = [];
  for (const _ of f.files || []) {
    const S = _.data instanceof ArrayBuffer ? _.data : void 0;
    v.push({
      id: String(_.id || crypto.randomUUID()),
      projectId: s.id,
      chatId: _.source === "result" ? l.id : void 0,
      name: String(_.name || "file"),
      logicalPath: _.source === "result" ? `${s.rootPath}/chats/${l.id}/outputs/${String(_.name || "file")}` : `${s.rootPath}/inputs/${String(_.name || "file")}`,
      type: String(_.type || "application/octet-stream"),
      size: Number(_.size || (S == null ? void 0 : S.byteLength) || 0),
      sha256: S ? await On(S) : "",
      source: _.source === "result" ? "result" : _.source === "omero" ? "omero" : "local",
      state: _.state === "failed" ? "failed" : S ? "ready" : "missing",
      data: S,
      error: _.error,
      annotationId: _.annotationId,
      createdAt: p
    });
  }
  const y = {
    project: s,
    chats: [l],
    files: v,
    executions: [],
    scripts: [],
    workflows: [],
    artifacts: [],
    audits: []
  };
  return await Yn(y), await Xd(`migration:v2:${u}`, { completedAt: p }), y;
}
async function Mh(s) {
  const l = await Yd(s);
  let u = await Oh(l);
  if (!u) {
    const T = (/* @__PURE__ */ new Date()).toISOString(), A = Zi(crypto.randomUUID());
    u = {
      id: A.projectId,
      contextKey: l,
      rootPath: Rh(s),
      name: (s == null ? void 0 : s.name) || "Local workspace",
      objectType: s == null ? void 0 : s.object_type,
      objectId: s == null ? void 0 : s.object_id,
      userId: (s == null ? void 0 : s.user_id) || 0,
      groupId: (s == null ? void 0 : s.group_id) || 0,
      activeChatId: A.id,
      plotCsv: !0,
      createdAt: T,
      updatedAt: T
    };
    const F = await $h(u, A, l);
    if (F) return F;
    const H = {
      project: u,
      chats: [A],
      files: [],
      executions: [],
      scripts: [],
      workflows: [],
      artifacts: [],
      audits: []
    };
    return await Yn(H), H;
  }
  const [f, p, v, y, _, S, R] = await Promise.all([
    Lt("chats", u.id),
    Lt("files", u.id),
    Lt("executions", u.id),
    Lt("scripts", u.id),
    Lt("workflows", u.id),
    Lt("artifacts", u.id),
    Lt("audits", u.id)
  ]);
  if (!f.length) {
    const T = Zi(u.id);
    u = { ...u, activeChatId: T.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }, await Yn({
      project: u,
      chats: [T],
      files: p,
      executions: v,
      scripts: y,
      workflows: _,
      artifacts: S,
      audits: R
    }), f.push(T);
  }
  return { project: u, chats: f, files: p, executions: v, scripts: y, workflows: _, artifacts: S, audits: R };
}
async function Yr(s) {
  const l = await Yd(s), f = (await wn()).transaction("projects", "readonly");
  return (await Gr(f.objectStore("projects").getAll())).filter((v) => v.contextKey === l || v.contextKey.startsWith(`${l}:import:`)).sort((v, y) => y.updatedAt.localeCompare(v.updatedAt));
}
async function Ns(s) {
  if (!s) return Yr(null);
  const u = (await wn()).transaction("projects", "readonly");
  return (await Gr(u.objectStore("projects").getAll())).filter(
    (p) => p.userId === s.user_id && p.groupId === s.group_id
  ).sort((p, v) => `${p.objectType || ""}:${p.objectId || 0}`.localeCompare(
    `${v.objectType || ""}:${v.objectId || 0}`
  ) || v.updatedAt.localeCompare(p.updatedAt));
}
async function Qi(s) {
  const u = (await wn()).transaction("projects", "readonly"), f = await Gr(u.objectStore("projects").get(s));
  if (!f) return;
  const [p, v, y, _, S, R, T] = await Promise.all([
    Lt("chats", f.id),
    Lt("files", f.id),
    Lt("executions", f.id),
    Lt("scripts", f.id),
    Lt("workflows", f.id),
    Lt("artifacts", f.id),
    Lt("audits", f.id)
  ]);
  return { project: f, chats: p, files: v, executions: y, scripts: _, workflows: S, artifacts: R, audits: T };
}
async function Ki() {
  var l, u;
  const s = await ((u = (l = navigator.storage) == null ? void 0 : l.estimate) == null ? void 0 : u.call(l));
  return { usage: (s == null ? void 0 : s.usage) || 0, quota: (s == null ? void 0 : s.quota) || 0 };
}
const Id = "provider:AmsterdamUMC", Rd = {
  apiKey: "",
  model: "",
  contextWindow: 0,
  rememberKey: !1
}, Gd = "nl.bioimaging.analysis-chat.project.v2", zh = "nl.bioimaging.analysis-chat.project", Zd = 2, ef = 1e4, tf = 512 * 1024 * 1024;
function Rn(s) {
  return s.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}
function Ts(s) {
  return new Uint8Array(ql(s));
}
function Lh(s) {
  return { ...s };
}
function Od(s, l) {
  const u = {}, f = [], p = s.files.filter((S) => !S.deletedAt).map((S) => {
    const R = { ...S };
    delete R.data;
    const T = S.source === "omero";
    if (S.source === "local" && l)
      return f.push(S.name), R.state = "missing", R.error = "Local input was omitted because the project snapshot exceeded its size limit.", R;
    if (T || !S.data) return R;
    const F = S.source === "local" ? `inputs/local/${Rn(S.id)}--${Rn(S.name)}` : `chats/${Rn(S.chatId || "unassigned")}/outputs/${Rn(S.id)}--${Rn(S.name)}`;
    return R.archivePath = F, u[F] = new Uint8Array(S.data), R;
  }), v = {
    format: Gd,
    version: Zd,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    project: Lh(s.project),
    chats: s.chats,
    executions: s.executions,
    scripts: s.scripts,
    workflows: s.workflows,
    artifacts: s.artifacts,
    audits: s.audits.map((S) => ({ ...S, payload: "[omitted from snapshot]" })),
    files: p,
    omittedLocalInputs: f
  };
  u["project.json"] = Ts(JSON.stringify(v, null, 2));
  for (const S of s.chats)
    u[`chats/${Rn(S.id)}/chat.json`] = Ts(JSON.stringify(S, null, 2)), u[`chats/${Rn(S.id)}/chat.md`] = Ts(Dh(S));
  for (const S of s.scripts) {
    u[`scripts/${Rn(S.id)}/script.json`] = Ts(JSON.stringify(S, null, 2));
    for (const R of S.versions)
      u[`scripts/${Rn(S.id)}/v${String(R.version).padStart(3, "0")}.py`] = Ts(R.code);
  }
  const y = jh(u, { level: 0 }), _ = `${Rn(s.project.rootPath.split("/").at(-1) || "analysis-project")}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.oac.zip`;
  return { data: y, filename: _, omittedLocalInputs: f, manifest: v };
}
function Fh(s, l) {
  const u = Od(s, !1);
  if (u.data.byteLength <= l) return u;
  const f = Od(s, !0);
  if (f.data.byteLength > l)
    throw new Error(
      `Chats, scripts, and generated outputs require ${(f.data.byteLength / 1024 / 1024).toFixed(1)} MiB, exceeding the ${(l / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  return f;
}
function Dh(s) {
  const l = [`# ${s.title}`, "", `Updated: ${s.updatedAt}`, ""];
  s.summary && l.push("## Conversation summary", "", s.summary, "");
  for (const u of s.messages)
    u.kind !== "execution" && l.push(`## ${u.role === "user" ? "User" : "Assistant"}`, "", u.content, "");
  return l.join(`
`);
}
function Xl(s) {
  if (!s || s.startsWith("/") || s.startsWith("\\") || s.split(/[\\/]/).includes(".."))
    throw new Error(`Unsafe project archive path: ${s}`);
}
function Uh(s) {
  let l = -1;
  for (let S = Math.max(0, s.length - 65557); S <= s.length - 22; S += 1)
    s[S] === 80 && s[S + 1] === 75 && s[S + 2] === 5 && s[S + 3] === 6 && (l = S);
  if (l < 0) throw new Error("Project archive has no valid ZIP directory");
  const u = new DataView(s.buffer, s.byteOffset, s.byteLength), f = u.getUint16(l + 10, !0), p = u.getUint32(l + 12, !0), v = u.getUint32(l + 16, !0);
  if (f > ef) throw new Error("Project archive contains too many entries");
  if (v + p > s.length) throw new Error("Project archive directory is truncated");
  let y = v, _ = 0;
  for (let S = 0; S < f; S += 1) {
    if (u.getUint32(y, !0) !== 33639248)
      throw new Error("Project archive contains an invalid directory entry");
    const R = u.getUint32(y + 24, !0), T = u.getUint16(y + 28, !0), A = u.getUint16(y + 30, !0), F = u.getUint16(y + 32, !0);
    if (R === 4294967295) throw new Error("ZIP64 project archives are not supported");
    if (_ += R, _ > tf)
      throw new Error("Project archive exceeds the 512 MiB workspace limit");
    const H = y + 46, oe = new TextDecoder().decode(s.subarray(H, H + T));
    if (Xl(oe), y = H + T + A + F, y > v + p) throw new Error("Project archive directory is malformed");
  }
}
function bh(s) {
  if (!s || typeof s != "object") throw new Error("Project manifest must be an object");
  const l = s, u = l.format === zh && l.version === 1, f = l.format === Gd && l.version === Zd;
  if (!u && !f) throw new Error("Unsupported Analysis Chat project format");
  const p = s;
  if (!p.project || !Array.isArray(p.chats) || !Array.isArray(p.files))
    throw new Error("Project manifest is missing required project, chat, or file records");
  return {
    ...p,
    workflows: Array.isArray(p.workflows) ? p.workflows : [],
    artifacts: Array.isArray(p.artifacts) ? p.artifacts : [],
    audits: Array.isArray(p.audits) ? p.audits : [],
    executions: Array.isArray(p.executions) ? p.executions : [],
    scripts: Array.isArray(p.scripts) ? p.scripts : [],
    omittedLocalInputs: Array.isArray(p.omittedLocalInputs) ? p.omittedLocalInputs : []
  };
}
function Yl(s) {
  return !s || typeof s != "object" ? !1 : Array.isArray(s) ? s.some(Yl) : Object.entries(s).some(([l, u]) => {
    const f = l.toLowerCase().replace(/[^a-z0-9]/g, "");
    return f === "apikey" || f === "azurekey" || f === "credential" || Yl(u);
  });
}
async function bl(s, l = null) {
  var fe;
  const u = new Uint8Array(s);
  Uh(u);
  const f = Sh(u), p = Object.keys(f);
  if (p.length > ef) throw new Error("Project archive contains too many entries");
  let v = 0;
  for (const $ of p)
    if (Xl($), v += f[$].byteLength, v > tf) throw new Error("Project archive exceeds the 512 MiB workspace limit");
  const y = f["project.json"];
  if (!y) throw new Error("Project archive does not contain project.json");
  const _ = bh(JSON.parse(qd(y)));
  if (Yl(_))
    throw new Error("Project archive unexpectedly contains an API key field");
  const S = crypto.randomUUID(), R = new Map(_.chats.map(($) => [$.id, crypto.randomUUID()])), T = new Map(_.executions.map(($) => [$.id, crypto.randomUUID()])), A = new Map(_.files.map(($) => [$.id, crypto.randomUUID()])), F = new Map(_.scripts.map(($) => [$.id, crypto.randomUUID()])), H = new Map(_.workflows.map(($) => [$.id, crypto.randomUUID()])), oe = (/* @__PURE__ */ new Date()).toISOString(), G = _.chats.map(($) => ({
    ...$,
    id: R.get($.id),
    projectId: S,
    title: `${$.title} (imported)`,
    messages: $.messages.map((Q) => ({
      ...Q,
      executionId: Q.executionId ? T.get(Q.executionId) : void 0
    })),
    updatedAt: oe
  })), ee = [];
  for (const $ of _.files) {
    let Q;
    if ($.archivePath) {
      Xl($.archivePath);
      const we = f[$.archivePath];
      if (!we) throw new Error(`Missing archived file: ${$.archivePath}`);
      if (Q = we.buffer.slice(we.byteOffset, we.byteOffset + we.byteLength), $.sha256 && await On(Q) !== $.sha256)
        throw new Error(`Hash mismatch for ${$.name}`);
    }
    ee.push({
      ...$,
      id: A.get($.id),
      projectId: S,
      chatId: $.chatId ? R.get($.chatId) : void 0,
      executionId: $.executionId ? T.get($.executionId) : void 0,
      data: Q,
      state: Q || $.source === "omero" ? $.state : "missing",
      logicalPath: $.logicalPath.replace(_.project.rootPath, `${_.project.rootPath}--imported`)
    });
  }
  const ye = _.executions.map(($) => ({
    ...$,
    id: T.get($.id),
    projectId: S,
    chatId: R.get($.chatId),
    outputFileIds: $.outputFileIds.map((Q) => A.get(Q)).filter(Boolean),
    reusedFrom: $.reusedFrom ? T.get($.reusedFrom) : void 0
  })), Ne = _.scripts.map(($) => ({
    ...$,
    id: F.get($.id),
    projectId: S,
    versions: $.versions.map((Q) => ({
      ...Q,
      executionId: T.get(Q.executionId) || ""
    })),
    updatedAt: oe
  })), ke = _.workflows.map(($) => ({
    ...$,
    id: H.get($.id),
    projectId: S,
    steps: $.steps.map((Q) => ({
      ...Q,
      id: crypto.randomUUID(),
      scriptId: F.get(Q.scriptId) || Q.scriptId
    })),
    updatedAt: oe
  })), pe = _.artifacts.map(($) => {
    var Q;
    return {
      ...$,
      id: crypto.randomUUID(),
      projectId: S,
      chatId: R.get($.chatId) || ((Q = G[0]) == null ? void 0 : Q.id),
      executionId: $.executionId ? T.get($.executionId) : void 0,
      fileId: $.fileId ? A.get($.fileId) : void 0
    };
  }).filter(($) => !!$.chatId), Se = R.get(_.project.activeChatId) || ((fe = G[0]) == null ? void 0 : fe.id);
  if (!Se) throw new Error("Project archive contains no chats");
  return { project: {
    ..._.project,
    id: S,
    contextKey: l ? `${l.user_id}:${l.group_id}:${l.object_type}:${l.object_id}:import:${S}` : `${_.project.contextKey}:import:${S}`,
    rootPath: `${_.project.rootPath}--imported`,
    name: `${_.project.name} (imported)`,
    objectType: (l == null ? void 0 : l.object_type) || _.project.objectType,
    objectId: (l == null ? void 0 : l.object_id) || _.project.objectId,
    userId: (l == null ? void 0 : l.user_id) ?? _.project.userId,
    groupId: (l == null ? void 0 : l.group_id) ?? _.project.groupId,
    origin: {
      contextKey: _.project.contextKey,
      userId: _.project.userId,
      groupId: _.project.groupId,
      snapshotAnnotationId: _.project.sourceSnapshotAnnotationId
    },
    activeChatId: Se,
    createdAt: oe,
    updatedAt: oe
  }, chats: G, files: ee, executions: ye, scripts: Ne, workflows: ke, artifacts: pe, audits: [] };
}
const Bh = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "duckdb"
], Yi = "pyodide-314.0.3-oac-0.5";
function Wh(s) {
  const l = JSON.stringify(s.replace(/\/$/, "")), u = JSON.stringify(Bh);
  return `
const runtimeBase = ${l};
const send = (id, type, value, transfer = []) => postMessage({source:"oac-runtime", id, type, value}, transfer);
const runtimeFetch = globalThis.fetch.bind(globalThis);
const denyNetwork = () => Promise.reject(new Error("Network access is disabled in Analysis Chat Python"));
const loadedPackages = new Set(${u});
const progress = (percent, message) => postMessage({
  source: "oac-runtime",
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
  await pyodide.loadPackage(${u});
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
function Vh(s) {
  const l = new URL(s).origin, u = JSON.stringify(Wh(s));
  return `<!doctype html><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${l}; connect-src ${l}; img-src data: blob:; style-src 'unsafe-inline'; worker-src blob:">
<script>
const source = ${u};
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
class Hh {
  constructor(l) {
    In(this, "frame", null);
    In(this, "pending", /* @__PURE__ */ new Map());
    In(this, "inputs", []);
    In(this, "counter", 0);
    In(this, "readyPromise", null);
    In(this, "onProgress", null);
    In(this, "receive", (l) => {
      var p;
      if (l.source !== ((p = this.frame) == null ? void 0 : p.contentWindow)) return;
      const u = l.data;
      if (!u || u.source !== "oac-runtime") return;
      if (u.type === "progress") {
        this.report(u.value);
        return;
      }
      const f = this.pending.get(u.id);
      f && (clearTimeout(f.timer), this.pending.delete(u.id), u.type === "error" ? f.reject(new Error(u.value)) : f.resolve(u.value));
    });
    this.runtimeBase = l, window.addEventListener("message", this.receive);
  }
  async start(l, u) {
    u && (this.onProgress = u), this.inputs = l.filter((v) => v.state === "ready" && v.data), this.destroyFrame(), this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const f = document.createElement("iframe");
    f.hidden = !0, f.setAttribute("sandbox", "allow-scripts"), f.setAttribute("aria-hidden", "true");
    const p = new Promise(
      (v) => f.addEventListener("load", () => v(), { once: !0 })
    );
    return f.srcdoc = Vh(
      new URL(this.runtimeBase, window.location.href).toString()
    ), document.body.append(f), this.frame = f, this.readyPromise = (async () => {
      await p, this.report({ percent: 8, message: "Connecting to the Python worker…" }), await this.request("ping", !0, 12e4);
      for (let v = 0; v < this.inputs.length; v += 1) {
        const y = this.inputs[v];
        this.report({
          percent: 92 + Math.round(v / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${v + 1} of ${this.inputs.length} data files into Python…`
        });
        const _ = y.data.slice(0);
        await this.request("file", { name: y.name, data: _ }, 3e4, [_]);
      }
      this.report({ percent: 100, message: "Browser Python is ready" });
    })(), this.readyPromise;
  }
  async run(l) {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("run", { code: l }, 12e4);
  }
  async syncInputs(l) {
    if (this.inputs = l.filter((u) => u.state === "ready" && u.data), !this.readyPromise) {
      await this.start(this.inputs, this.onProgress || void 0);
      return;
    }
    await this.readyPromise, await this.request("clear_inputs", !0, 3e4);
    for (let u = 0; u < this.inputs.length; u += 1) {
      const f = this.inputs[u];
      this.report({
        percent: 92 + Math.round(u / Math.max(1, this.inputs.length) * 7),
        message: `Synchronizing ${u + 1} of ${this.inputs.length} input files…`
      });
      const p = f.data.slice(0);
      await this.request("file", { name: f.name, data: p }, 3e4, [p]);
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
    for (const l of this.pending.values())
      clearTimeout(l.timer), l.reject(new Error("Python execution stopped"));
    this.pending.clear(), this.destroyFrame();
  }
  dispose() {
    this.stop(), this.destroyFrame(), window.removeEventListener("message", this.receive);
  }
  destroyFrame() {
    var l;
    (l = this.frame) == null || l.remove(), this.frame = null, this.readyPromise = null;
  }
  request(l, u, f, p = []) {
    const v = `runtime-${++this.counter}`;
    return new Promise((y, _) => {
      var R, T;
      const S = window.setTimeout(() => {
        this.pending.delete(v), _(new Error(`${l} exceeded ${f / 1e3} seconds`)), l === "run" && this.start(this.inputs);
      }, f);
      this.pending.set(v, { resolve: y, reject: _, timer: S }), (T = (R = this.frame) == null ? void 0 : R.contentWindow) == null || T.postMessage(
        { source: "oac-parent", id: v, type: l, value: u },
        "*",
        p
      );
    });
  }
  report(l) {
    var u;
    (u = this.onProgress) == null || u.call(this, {
      percent: Math.max(0, Math.min(100, Number(l.percent) || 0)),
      message: String(l.message || "Preparing browser Python…")
    });
  }
}
function Qh() {
  const [s, l] = me.useState(null), [u, f] = me.useState(""), p = me.useRef(null), v = (R) => {
    var T;
    (T = p.current) == null || T.call(p, R), p.current = null, l(null);
  }, y = (R, T = "", A) => new Promise((F) => {
    p.current = F, f(T), l({ title: R, description: A, value: T, confirmLabel: "Save", mode: "text" });
  }), _ = (R, T, A = "Continue", F = !1) => new Promise((H) => {
    p.current = H, l({ title: R, description: T, confirmLabel: A, danger: F, mode: "confirm" });
  }), S = s ? /* @__PURE__ */ c.jsx(
    "div",
    {
      className: "dialog-backdrop",
      role: "presentation",
      onMouseDown: (R) => {
        R.target === R.currentTarget && v(s.mode === "confirm" ? !1 : null);
      },
      children: /* @__PURE__ */ c.jsxs(
        "form",
        {
          className: "app-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "app-dialog-title",
          onSubmit: (R) => {
            R.preventDefault(), v(s.mode === "text" ? u.trim() || null : !0);
          },
          children: [
            /* @__PURE__ */ c.jsx("h2", { id: "app-dialog-title", children: s.title }),
            s.description && /* @__PURE__ */ c.jsx("p", { children: s.description }),
            s.mode === "text" && /* @__PURE__ */ c.jsxs("label", { children: [
              /* @__PURE__ */ c.jsx("span", { children: "Name" }),
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  autoFocus: !0,
                  value: u,
                  maxLength: 180,
                  onChange: (R) => f(R.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "dialog-actions", children: [
              /* @__PURE__ */ c.jsx("button", { type: "button", onClick: () => v(s.mode === "confirm" ? !1 : null), children: "Cancel" }),
              /* @__PURE__ */ c.jsx("button", { className: s.danger ? "danger-button" : "", type: "submit", children: s.confirmLabel })
            ] })
          ]
        }
      )
    }
  ) : null;
  return { askText: y, confirm: _, element: S };
}
function Kh({
  execution: s,
  files: l,
  onSave: u,
  onRerun: f
}) {
  var R;
  const [p, v] = me.useState(!1), y = s.outputFileIds.map((T) => l.find((A) => A.id === T && !A.deletedAt)).filter(Boolean), _ = s.status === "reused" ? [] : y.filter((T) => T.type === "image/png" || T.type === "image/svg+xml"), S = (T) => /* @__PURE__ */ c.jsxs("div", { className: `execution-actions ${T}`, children: [
    /* @__PURE__ */ c.jsx(
      "button",
      {
        className: "detail-toggle",
        "aria-expanded": p,
        onClick: () => v((A) => !A),
        children: p ? "Collapse" : "Show details"
      }
    ),
    ["success", "reused"].includes(s.status) && /* @__PURE__ */ c.jsx("button", { onClick: u, children: "Save as script" }),
    /* @__PURE__ */ c.jsx("button", { onClick: f, children: "Rerun" }),
    /* @__PURE__ */ c.jsxs("small", { children: [
      s.codeHash.slice(0, 12),
      " · ",
      s.runtimeVersion
    ] })
  ] });
  return /* @__PURE__ */ c.jsxs("article", { className: `message execution ${s.status}`, children: [
    /* @__PURE__ */ c.jsxs("section", { className: "execution-details", "data-expanded": p ? "true" : "false", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "execution-heading", children: [
        /* @__PURE__ */ c.jsx("span", { children: s.status === "reused" ? "Reused Python run" : "Python code (local)" }),
        S("top")
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "execution-content", hidden: !p, children: [
        /* @__PURE__ */ c.jsx("pre", { children: /* @__PURE__ */ c.jsx("code", { children: s.code }) }),
        s.stdout && /* @__PURE__ */ c.jsx("pre", { children: s.stdout }),
        s.stderr && /* @__PURE__ */ c.jsx("pre", { className: "execution-error", children: s.stderr }),
        s.modelPayload && /* @__PURE__ */ c.jsxs("details", { className: "model-payload", children: [
          /* @__PURE__ */ c.jsx("summary", { children: "Data sent to AI" }),
          /* @__PURE__ */ c.jsx("p", { children: "Only this bounded envelope was returned to AmsterdamUMC." }),
          /* @__PURE__ */ c.jsx("pre", { children: JSON.stringify(s.modelPayload, null, 2) })
        ] }),
        s.preview != null && /* @__PURE__ */ c.jsx(qh, { value: s.preview }),
        S("bottom")
      ] })
    ] }),
    s.status === "reused" && /* @__PURE__ */ c.jsxs("p", { className: "reuse-note", children: [
      "Reused prior execution ",
      (R = s.reusedFrom) == null ? void 0 : R.slice(0, 8),
      " because code and inputs are unchanged."
    ] }),
    s.missingPlotCsv.length > 0 && /* @__PURE__ */ c.jsxs("p", { className: "plot-warning", children: [
      "Source CSV missing: ",
      s.missingPlotCsv.join(", ")
    ] }),
    _.map((T) => /* @__PURE__ */ c.jsx(nf, { file: T }, T.id))
  ] });
}
function qh({ value: s }) {
  const [l, u] = me.useState(""), f = s;
  if ((f == null ? void 0 : f.kind) === "table" && f.data) {
    const p = f.data.columns || [], v = (f.data.data || []).filter(
      (y) => !l || y.some((_) => String(_ ?? "").toLowerCase().includes(l.toLowerCase()))
    );
    return /* @__PURE__ */ c.jsxs("div", { className: "table-wrap", children: [
      /* @__PURE__ */ c.jsxs("label", { className: "table-filter", children: [
        /* @__PURE__ */ c.jsx("span", { children: "Filter preview" }),
        /* @__PURE__ */ c.jsx("input", { value: l, onChange: (y) => u(y.target.value) })
      ] }),
      /* @__PURE__ */ c.jsxs("table", { children: [
        /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsx("tr", { children: p.map((y) => /* @__PURE__ */ c.jsx("th", { children: y }, y)) }) }),
        /* @__PURE__ */ c.jsx("tbody", { children: v.map((y, _) => /* @__PURE__ */ c.jsx("tr", { children: y.map((S, R) => /* @__PURE__ */ c.jsx("td", { children: String(S ?? "") }, R)) }, _)) })
      ] })
    ] });
  }
  return /* @__PURE__ */ c.jsx("pre", { className: "preview", children: JSON.stringify(s, null, 2) });
}
function nf({ file: s }) {
  const [l, u] = me.useState(!1), f = me.useMemo(
    () => s.data ? URL.createObjectURL(new Blob([s.data], { type: s.type })) : "",
    [s.data, s.type]
  );
  return me.useEffect(() => () => {
    f && URL.revokeObjectURL(f);
  }, [f]), f ? /* @__PURE__ */ c.jsxs("figure", { className: l ? "artifact-zoomed" : "", children: [
    /* @__PURE__ */ c.jsx("button", { className: "plot-zoom", onClick: () => u((p) => !p), children: l ? "Close full view" : "Open full view" }),
    /* @__PURE__ */ c.jsx("img", { src: f, alt: s.name, onDoubleClick: () => u(!0) }),
    /* @__PURE__ */ c.jsx("figcaption", { children: s.name })
  ] }) : null;
}
function Jh(s) {
  return s < 1024 ? `${s} B` : s < 1024 ** 2 ? `${(s / 1024).toFixed(1)} KiB` : `${(s / 1024 ** 2).toFixed(1)} MiB`;
}
function Xh(s, l) {
  if (!s) return "Context usage appears after the first AI response.";
  const u = s.promptTokens + s.completionTokens, f = s.estimated ? "estimated" : "API reported", p = l > 0 ? ` · ${Math.min(100, Math.round(u / l * 100))}% of ${l.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${s.promptTokens.toLocaleString()} input + ${s.completionTokens.toLocaleString()} output tokens (${f})${p} · session: ${s.sessionTokens.toLocaleString()}`;
}
function Yh({
  runtimeReady: s,
  runtimeProgress: l,
  status: u,
  usage: f,
  settings: p,
  blocked: v,
  canChat: y,
  composerPlaceholder: _,
  prompt: S,
  busy: R,
  onPromptChange: T,
  onSend: A,
  onStop: F,
  onReset: H
}) {
  return /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    !s && /* @__PURE__ */ c.jsxs("div", { className: "runtime-progress", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("strong", { children: l.message }),
        /* @__PURE__ */ c.jsxs("span", { children: [
          Math.round(l.percent),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ c.jsx("progress", { max: "100", value: l.percent }),
      /* @__PURE__ */ c.jsx("small", { children: "Please wait. The question box unlocks automatically when browser Python is ready." })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "status", role: "status", children: u }),
    /* @__PURE__ */ c.jsxs("div", { className: "usage-status", children: [
      /* @__PURE__ */ c.jsx("span", { children: "Azure receives prompts, generated code, bounded schemas/previews/statistics, summaries, and errors — never source files." }),
      /* @__PURE__ */ c.jsx("span", { children: Xh(f, p.contextWindow || 0) })
    ] }),
    v && /* @__PURE__ */ c.jsx("div", { className: "blocker", children: "Analysis is blocked until every input is available. Retry, reselect, or remove missing files." }),
    !p.apiKey || !p.model ? /* @__PURE__ */ c.jsx("div", { className: "blocker", children: "Enter the AmsterdamUMC deployment name and API key in AI settings." }) : null,
    /* @__PURE__ */ c.jsxs("div", { className: "composer", children: [
      /* @__PURE__ */ c.jsxs("div", { className: `composer-state ${y ? "ready" : "waiting"}`, children: [
        /* @__PURE__ */ c.jsx("span", { "aria-hidden": "true", children: y ? "●" : "◷" }),
        y ? "Ready — you can ask a question" : _
      ] }),
      /* @__PURE__ */ c.jsx(
        "textarea",
        {
          value: S,
          onChange: (oe) => T(oe.target.value),
          onKeyDown: (oe) => {
            oe.key === "Enter" && !oe.shiftKey && (oe.preventDefault(), A());
          },
          disabled: !y,
          placeholder: _
        }
      ),
      R ? /* @__PURE__ */ c.jsx("button", { className: "stop", onClick: F, children: "Stop" }) : /* @__PURE__ */ c.jsx("button", { disabled: !y || !S.trim(), onClick: A, children: "Send" }),
      /* @__PURE__ */ c.jsx("button", { disabled: R || !s, onClick: H, children: "Reset Python" })
    ] })
  ] });
}
function Gh({
  open: s,
  file: l,
  profiles: u,
  canUpload: f,
  onToggle: p,
  onDownload: v,
  onAttach: y
}) {
  return /* @__PURE__ */ c.jsxs("aside", { className: `artifact-inspector ${s ? "open" : ""}`, children: [
    /* @__PURE__ */ c.jsxs("div", { className: "artifact-header", children: [
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("span", { children: "Artifact inspector" }),
        /* @__PURE__ */ c.jsx("strong", { children: (l == null ? void 0 : l.name) || "Data profile" })
      ] }),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          "aria-label": s ? "Close artifact inspector" : "Open artifact inspector",
          onClick: p,
          children: s ? "×" : "›"
        }
      )
    ] }),
    s && /* @__PURE__ */ c.jsx("div", { className: "artifact-body", children: l ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx(nf, { file: l }),
      /* @__PURE__ */ c.jsxs("dl", { className: "artifact-metadata", children: [
        /* @__PURE__ */ c.jsx("dt", { children: "Size" }),
        /* @__PURE__ */ c.jsx("dd", { children: Jh(l.size) }),
        /* @__PURE__ */ c.jsx("dt", { children: "SHA-256" }),
        /* @__PURE__ */ c.jsx("dd", { children: l.sha256 }),
        /* @__PURE__ */ c.jsx("dt", { children: "Created" }),
        /* @__PURE__ */ c.jsx("dd", { children: new Date(l.createdAt).toLocaleString() })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "artifact-buttons", children: [
        /* @__PURE__ */ c.jsx("button", { onClick: () => v(l), children: "Download" }),
        f && /* @__PURE__ */ c.jsx("button", { onClick: () => y(l), children: "Attach to OMERO" })
      ] })
    ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("p", { className: "artifact-help", children: "Local schema profiles are generated without sending source files to Azure." }),
      u.map((_) => /* @__PURE__ */ c.jsxs("details", { open: !0, children: [
        /* @__PURE__ */ c.jsxs("summary", { children: [
          _.format.toUpperCase(),
          " input profile"
        ] }),
        /* @__PURE__ */ c.jsx("pre", { children: JSON.stringify(_.summary, null, 2) }),
        _.error && /* @__PURE__ */ c.jsx("p", { className: "execution-error", children: _.error })
      ] }, _.path)),
      !u.length && /* @__PURE__ */ c.jsx("p", { className: "artifact-help", children: "Add a supported input to inspect it." })
    ] }) })
  ] });
}
const Zh = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, $d = 256 * 1024 * 1024, qe = () => crypto.randomUUID(), ce = () => (/* @__PURE__ */ new Date()).toISOString(), Md = (s) => s.toLowerCase().endsWith(".png") ? "image/png" : s.toLowerCase().endsWith(".svg") ? "image/svg+xml" : s.toLowerCase().endsWith(".csv") ? "text/csv" : s.toLowerCase().endsWith(".json") ? "application/json" : "application/octet-stream";
function vr(s) {
  return s.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function em(s) {
  const l = s.replace(/\s+/g, " ").trim().slice(0, 64);
  return l ? l.charAt(0).toUpperCase() + l.slice(1) : "New analysis";
}
function zd(s) {
  const l = Array.from(s.matchAll(/["']\/input\/([^"']+)["']/g), (f) => f[1]), u = Array.from(new Set(l));
  return {
    formats: Array.from(new Set(u.map((f) => {
      var p;
      return ((p = f.split(".").at(-1)) == null ? void 0 : p.toLowerCase()) || "";
    }))).filter(Boolean),
    requiredFiles: u.map((f) => {
      var p, v;
      return {
        path: f,
        extension: ((v = (p = f.match(/(\.[^.]+)$/)) == null ? void 0 : p[1]) == null ? void 0 : v.toLowerCase()) || ""
      };
    }),
    runtimeVersion: Yi
  };
}
function tm(s) {
  return JSON.stringify(
    s.filter((l) => !l.deletedAt).map((l) => ({
      path: l.source === "result" ? `/output/${l.name}` : `/input/${l.name}`,
      logical_path: l.logicalPath,
      sha256: l.sha256,
      size: l.size,
      type: l.type,
      state: l.state
    }))
  );
}
function Fo(s, l) {
  const u = l.filter((v) => v.source !== "result" && v.state === "ready"), f = [];
  return { code: s.replace(/(["'])\/input\/([^"']+)\1/g, (v, y, _) => {
    var T, A;
    if (u.some((F) => F.name === _)) return v;
    const S = ((A = (T = _.match(/(\.[^.]+)$/)) == null ? void 0 : T[1]) == null ? void 0 : A.toLowerCase()) || "", R = u.filter(
      (F) => S && F.name.toLowerCase().endsWith(S)
    );
    if (R.length !== 1)
      throw new Error(
        R.length ? `Script input ${_} is ambiguous: ${R.map((F) => F.name).join(", ")}` : `Script input ${_} has no compatible file in this project`
      );
    return f.push({ from: _, to: R[0].name }), `${y}/input/${R[0].name}${y}`;
  }), bindings: f };
}
function Bl(s) {
  return Math.max(1, Math.ceil(JSON.stringify(s).length / 4));
}
function nm(s) {
  return s.filter((l) => l.kind !== "execution").slice(0, -12).map((l) => `${l.role}: ${l.content.replace(/\s+/g, " ").slice(0, 240)}`).join(`
`).slice(-12e3);
}
function Do(s) {
  return s >= 1024 * 1024 * 1024 ? `${(s / 1024 / 1024 / 1024).toFixed(1)} GiB` : s >= 1024 * 1024 ? `${(s / 1024 / 1024).toFixed(1)} MiB` : s >= 1024 ? `${(s / 1024).toFixed(1)} KiB` : `${s} bytes`;
}
function Ld(s) {
  return (s == null ? void 0 : s.files.filter((l) => !l.deletedAt).reduce((l, u) => l + u.size, 0)) || 0;
}
function rm() {
  const s = window.OMERO_ANALYSIS_CHAT, l = me.useMemo(() => new Yp(s), [s]), u = me.useMemo(() => new Hh(s.runtimeBase), [s]), f = Qh(), [p, v] = me.useState(null), y = me.useRef(null), [_, S] = me.useState([]), [R, T] = me.useState([]), [A, F] = me.useState([]), [H, oe] = me.useState(null), [G, ee] = me.useState([]), [ye, Ne] = me.useState(Rd), [ke, pe] = me.useState(""), [Se, de] = me.useState(!1), [fe, $] = me.useState(""), [Q, we] = me.useState("ready"), [Oe, Le] = me.useState(!1), Ve = me.useRef(!1), [De, Ue] = me.useState([]), [Ae, ve] = me.useState(null), [B, X] = me.useState(320), [K, j] = me.useState(!0), [O, se] = me.useState(""), [ie, M] = me.useState("Preparing project…"), [xe, Te] = me.useState(!1), [je, Ie] = me.useState(null), [Ge, Tt] = me.useState(!1), [yt, ft] = me.useState(/* @__PURE__ */ new Set()), [zn, Zr] = me.useState(!1), [xr, eo] = me.useState(""), [Ln, on] = me.useState({
    inputs: !0,
    outputs: !0,
    scripts: !0,
    workflows: !0,
    trash: !1,
    snapshots: !1
  }), [jr, jn] = me.useState(null), [Sr, Sn] = me.useState({
    percent: 0,
    message: "Preparing the browser workspace…"
  }), [to, kr] = me.useState({ usage: 0, quota: 0 }), Fn = me.useRef(null), no = me.useRef(null), Dn = me.useRef(null), Gn = me.useRef(null), pt = me.useRef(/* @__PURE__ */ new Set());
  y.current = p;
  const Ce = (p == null ? void 0 : p.project) || null, _r = (p == null ? void 0 : p.chats) || [], He = _r.find((a) => a.id === (Ce == null ? void 0 : Ce.activeChatId)) || _r[0] || null, ro = ((p == null ? void 0 : p.files) || []).filter(
    (a) => a.source !== "result" && !a.deletedAt
  ), Uo = ((p == null ? void 0 : p.files) || []).filter(
    (a) => a.source === "result" && a.chatId === (He == null ? void 0 : He.id) && !a.deletedAt
  ), Zn = ro.filter((a) => a.state !== "ready"), bo = (p == null ? void 0 : p.files.find(
    (a) => a.id === Ae && !a.deletedAt
  )) || Uo.at(-1) || null, kn = (a) => !O.trim() || a.toLowerCase().includes(O.trim().toLowerCase()), oo = ro.filter((a) => kn(a.name)), Bo = Uo.filter((a) => kn(a.name)), _n = ((p == null ? void 0 : p.files) || []).filter((a) => !!a.deletedAt), sn = ((p == null ? void 0 : p.scripts) || []).filter((a) => !a.deletedAt), so = ((p == null ? void 0 : p.scripts) || []).filter((a) => !!a.deletedAt), io = ((p == null ? void 0 : p.workflows) || []).filter((a) => !!a.deletedAt), Wo = !!He && Oe && Zn.length === 0 && !!(ye.apiKey && ye.model) && !Se, $s = Se ? "Analysis in progress — wait for the answer or press Stop…" : Zn.some((a) => a.state === "failed" || a.state === "missing") ? "Chat is blocked — retry, reselect, or remove the missing data file…" : Zn.length ? "Downloading selected data — chat will unlock when every file is ready…" : Oe ? !ye.apiKey || !ye.model ? "Configure the AmsterdamUMC deployment and API key before asking a question…" : "Ask a question about the loaded data…" : `${Sr.message} (${Math.round(Sr.percent)}%) — please wait…`;
  me.useEffect(() => {
    const a = no.current;
    if (!a) return;
    const h = requestAnimationFrame(() => {
      a.scrollTo({ top: a.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(h);
  }, [He == null ? void 0 : He.messages, p == null ? void 0 : p.executions, p == null ? void 0 : p.files]), me.useEffect(() => {
    if (!je) return;
    const a = () => Ie(null), h = (w) => {
      w.key === "Escape" && a();
    };
    return window.addEventListener("click", a), window.addEventListener("blur", a), window.addEventListener("resize", a), window.addEventListener("keydown", h), () => {
      window.removeEventListener("click", a), window.removeEventListener("blur", a), window.removeEventListener("resize", a), window.removeEventListener("keydown", h);
    };
  }, [je]), me.useEffect(() => {
    let a = !0;
    return (async () => {
      var z;
      const [h, w] = await Promise.all([
        Jd(Id),
        Mh(s.context)
      ]);
      if (!a) return;
      h && Ne({ ...Rd, ...h }), await l.connect(), oe(await l.hierarchy());
      let I = w;
      const E = (z = s.context) == null ? void 0 : z.selected_project_snapshot;
      if (E) {
        Sn({ percent: 8, message: "Restoring the selected OMERO project…" });
        const he = (await Yr(s.context)).find(
          (V) => V.sourceSnapshotAnnotationId === E.annotation_id
        );
        if (he)
          I = await Qi(he.id) || w;
        else {
          const V = await bl(
            await l.downloadSnapshot(E),
            s.context
          );
          if (s.context && (V.project.objectType !== s.context.object_type || V.project.objectId !== s.context.object_id))
            throw new Error("The selected project belongs to a different OMERO object");
          V.project = {
            ...V.project,
            sourceSnapshotAnnotationId: E.annotation_id,
            updatedAt: ce()
          }, await Yn(V), I = V;
        }
      }
      let P = await Er(I);
      a && (v(P), y.current = P, S(await Yr(s.context)), T(await Ns(s.context)), F(await l.listSnapshots()), ee(await l.listWorkflowTemplates()), await Ho(P.files), Ue(await u.profileInputs()), a && (Le(!0), Sn({ percent: 100, message: "Browser Python is ready" }), M("Ready — analysis runs locally in this browser"), kr(await Ki())));
    })().catch((h) => {
      a && (M(`Project failed: ${String(h)}`), Sn({ percent: 0, message: `Project failed: ${String(h)}` }));
    }), () => {
      a = !1, u.dispose();
    };
  }, [s, l, u]);
  async function Er(a) {
    var P;
    let h = a;
    const w = new Map(
      h.files.filter((z) => z.annotationId).map((z) => [z.annotationId, z])
    ), I = ((P = s.context) == null ? void 0 : P.selected_attachments) || [];
    for (const z of I) {
      if (w.has(z.annotation_id)) continue;
      const U = {
        id: qe(),
        projectId: h.project.id,
        name: z.name,
        logicalPath: `${h.project.rootPath}/inputs/${z.annotation_id}--${z.name}`,
        type: z.mimetype,
        size: z.size,
        sha256: "",
        source: "omero",
        state: "loading",
        annotationId: z.annotation_id,
        fileId: z.file_id,
        createdAt: ce()
      };
      h = { ...h, files: [...h.files, U] }, w.set(z.annotation_id, U);
    }
    const E = h.files.filter(
      (z) => z.source === "omero" && z.annotationId && (!z.data || z.state !== "ready")
    );
    for (let z = 0; z < E.length; z += 1) {
      const U = E[z];
      Sn({
        percent: Math.round(z / Math.max(1, E.length) * 90),
        message: `Downloading ${z + 1} of ${E.length} OMERO inputs…`
      });
      try {
        const he = {
          annotation_id: U.annotationId,
          file_id: U.fileId || 0,
          name: U.name,
          mimetype: U.type,
          size: U.size,
          kind: "attachment",
          supported: !0
        }, V = await l.download(he), ae = await On(V);
        if (U.sha256 && U.sha256 !== ae)
          throw new Error(
            `OMERO input ${U.name} no longer matches the snapshot hash`
          );
        const ne = {
          ...U,
          data: V,
          size: V.byteLength,
          sha256: ae,
          state: "ready",
          error: void 0
        };
        h = {
          ...h,
          files: h.files.map((_e) => _e.id === U.id ? ne : _e)
        }, await Ps(ne);
      } catch (he) {
        const V = { ...U, state: "failed", error: String(he) };
        h = {
          ...h,
          files: h.files.map((ae) => ae.id === U.id ? V : ae)
        }, await Ps(V);
      }
    }
    return await Yn(h), h;
  }
  function Vo(a) {
    Sn(a), M(a.message);
  }
  async function Ho(a) {
    Le(!1), Sn({ percent: 1, message: "Starting browser Python…" });
    const h = a.filter(
      (w) => w.source !== "result" && w.state === "ready" && !w.deletedAt
    );
    Ve.current ? await u.syncInputs(h) : (await u.start(h, Vo), Ve.current = !0);
  }
  async function gt(a, h) {
    await Ho(a), Ue(await u.profileInputs()), Le(!0), Sn({ percent: 100, message: "Browser Python is ready" }), M(h);
  }
  function Cr(a) {
    const h = y.current;
    if (h) {
      const w = { ...h, project: a };
      y.current = w, v(w);
    }
    Ad(a);
  }
  function Qt(a) {
    const h = y.current;
    if (h) {
      const w = {
        ...h,
        chats: h.chats.map((I) => I.id === a.id ? a : I)
      };
      y.current = w, v(w);
    }
    Ul(a);
  }
  function Kt(a, h) {
    const w = y.current;
    if (!w) return;
    const I = w.chats.find((z) => z.id === a);
    if (!I) return;
    const E = { ...I, messages: [...I.messages, h], updatedAt: ce() }, P = {
      ...w,
      chats: w.chats.map((z) => z.id === a ? E : z)
    };
    y.current = P, v(P), Ul(E);
  }
  function Pr(a, h) {
    const w = new Set(a.pinnedMessageIds || []);
    w.has(h) ? w.delete(h) : w.add(h), Qt({ ...a, pinnedMessageIds: Array.from(w), updatedAt: ce() });
  }
  function En(a) {
    const h = y.current;
    if (!h) return;
    const w = h.executions.some((E) => E.id === a.id), I = {
      ...h,
      executions: w ? h.executions.map((E) => E.id === a.id ? a : E) : [...h.executions, a]
    };
    y.current = I, v(I), Ch(a);
  }
  function Ft(a) {
    if (!a.length) return;
    const h = y.current;
    if (!h) return;
    const w = new Set(a.map((E) => E.id)), I = {
      ...h,
      files: [...h.files.filter((E) => !w.has(E.id)), ...a]
    };
    y.current = I, v(I), a.forEach((E) => void Ps(E));
  }
  function Qo(a) {
    const h = y.current;
    if (!h) return;
    const w = { ...h, audits: [...h.audits, a] };
    y.current = w, v(w), Nh(a);
  }
  function na(a) {
    if (!a.length) return;
    const h = y.current;
    if (!h) return;
    const w = { ...h, artifacts: [...h.artifacts, ...a] };
    y.current = w, v(w), a.forEach((I) => void Ph(I));
  }
  async function Nr(a) {
    Ne(a), await Xd(Id, a.rememberKey ? a : { ...a, apiKey: "" });
  }
  async function Ms(a) {
    if (!a || !p) return;
    const h = [];
    let w = Ld(p);
    for (const E of Array.from(a)) {
      if (!Zh.test(E.name)) {
        M(`${E.name} is not a supported tabular data file`);
        continue;
      }
      if (E.size > jd) {
        M(`${E.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (w += E.size, w > qp) {
        M("The project would exceed 512 MiB");
        break;
      }
      const P = await E.arrayBuffer(), z = await On(P);
      if ([...p.files, ...h].some(
        (U) => U.sha256 === z && U.size === P.byteLength
      )) {
        M(`${E.name} matches a file already stored in this project`);
        continue;
      }
      h.push({
        id: qe(),
        projectId: p.project.id,
        name: E.name,
        logicalPath: `${p.project.rootPath}/inputs/${E.name}`,
        type: E.type || Md(E.name),
        size: P.byteLength,
        sha256: z,
        source: "local",
        state: "ready",
        data: P,
        createdAt: ce()
      });
    }
    const I = [...p.files, ...h];
    Ft(h), await gt(I, "Local inputs added; browser Python is ready"), kr(await Ki());
  }
  async function Cn(a) {
    if (!p) return;
    const h = p.files.find((E) => E.id === a);
    if (!h) return;
    if (h.source === "result") {
      const E = { ...h, deletedAt: ce() };
      Ft([E]), M(`Moved ${h.name} to project trash; provenance is preserved`);
      return;
    }
    const w = p.files.filter((E) => E.id !== a), I = { ...p, files: w };
    y.current = I, v(I), await Th(a), await gt(w, "Input removed; browser Python was reset"), kr(await Ki());
  }
  async function zs(a) {
    if (!p) return;
    const h = p.files.find((I) => I.id === a);
    if (!(h != null && h.annotationId)) return;
    const w = { ...h, state: "loading", error: void 0 };
    Ft([w]);
    try {
      const I = await l.download({
        annotation_id: h.annotationId,
        file_id: h.fileId || 0,
        name: h.name,
        mimetype: h.type,
        size: h.size,
        kind: "attachment",
        supported: !0
      }), E = {
        ...h,
        data: I,
        size: I.byteLength,
        sha256: await On(I),
        state: "ready",
        error: void 0
      }, P = p.files.map((z) => z.id === h.id ? E : z);
      Ft([E]), await gt(P, "OMERO input restored; project ready");
    } catch (I) {
      Ft([{ ...h, state: "failed", error: String(I) }]);
    }
  }
  async function Tr() {
    if (!p) return;
    const a = Zi(p.project.id), h = { ...p.project, activeChatId: a.id, updatedAt: ce() }, w = { ...p, project: h, chats: [...p.chats, a] };
    y.current = w, v(w), await Promise.all([Ul(a), Ad(h)]), jn(null), pt.current.clear(), await u.beginTurn();
  }
  function ra(a) {
    if (!p) return;
    const h = p.chats.find((I) => I.id === a);
    h != null && h.archived && Qt({ ...h, archived: !1, updatedAt: ce() });
    const w = { ...p.project, activeChatId: a, updatedAt: ce() };
    Cr(w), jn(null);
  }
  async function Ar(a) {
    var w;
    const h = (w = await f.askText(
      "Rename chat",
      a.title,
      "The chat folder and exported transcript use this name."
    )) == null ? void 0 : w.trim();
    h && Qt({ ...a, title: h.slice(0, 100), updatedAt: ce() });
  }
  function ot(a, h, w) {
    a.preventDefault(), a.stopPropagation();
    const I = 210, E = Math.max(60, w.length * 34 + 34);
    Ie({
      x: Math.min(a.clientX, window.innerWidth - I - 8),
      y: Math.min(a.clientY, window.innerHeight - E - 8),
      title: h,
      actions: w
    });
  }
  function Ls(a) {
    a.preventDefault();
    const h = a.clientX, w = B, I = (P) => X(Math.max(250, Math.min(520, w + P.clientX - h))), E = () => {
      window.removeEventListener("mousemove", I), window.removeEventListener("mouseup", E);
    };
    window.addEventListener("mousemove", I), window.addEventListener("mouseup", E);
  }
  async function ao() {
    Ce && (Ie(null), S(await Yr(s.context)), T(await Ns(s.context)), await lo(Ce.id));
  }
  async function Fs(a) {
    if (a.id === (Ce == null ? void 0 : Ce.id)) {
      M("Open another local project before deleting this one");
      return;
    }
    await f.confirm(
      "Delete browser-local project?",
      `${a.name} and its local chats, scripts, workflows, and outputs will be permanently removed. OMERO attachments are unchanged.`,
      "Delete local project",
      !0
    ) && (await Ah(a.id), S(await Yr(s.context)), T(await Ns(s.context)), M(`Deleted browser-local project ${a.name}`));
  }
  async function Ds(a) {
    var _e, Pe;
    if (a.source === "omero") {
      M("OMERO attachment names are canonical and cannot be renamed locally");
      return;
    }
    const h = (_e = await f.askText(
      "Rename file",
      a.name,
      "The file extension must remain unchanged."
    )) == null ? void 0 : _e.trim();
    if (!h || h === a.name) return;
    let w = h.replace(/[\\/]/g, "_").slice(0, 180);
    if (!w || w === "." || w === "..") return;
    const I = ((Pe = a.name.match(/(\.[^.]+)$/)) == null ? void 0 : Pe[1]) || "";
    if (I && !w.toLowerCase().endsWith(I.toLowerCase())) {
      if (/\.[^.]+$/.test(w)) {
        M(`Keep the ${I} extension when renaming ${a.name}`);
        return;
      }
      w += I;
    }
    const E = y.current;
    if (!E) return;
    if (E.files.filter(
      (be) => be.id !== a.id && be.source === a.source && be.chatId === a.chatId
    ).some((be) => be.name.toLowerCase() === w.toLowerCase())) {
      M(`A file named ${w} already exists in this folder`);
      return;
    }
    const z = a.name.replace(/\.[^.]+$/, ""), U = w.replace(/\.[^.]+$/, ""), he = a.source === "result" && /\.(png|svg|csv)$/i.test(a.name) ? /* @__PURE__ */ new Set(["png", "svg", "csv"]) : null, V = E.files.map((be) => {
      var q;
      let st = be.id === a.id ? w : null;
      return !st && he && be.chatId === a.chatId && be.executionId === a.executionId && be.name.replace(/\.[^.]+$/, "") === z && he.has(((q = be.name.split(".").at(-1)) == null ? void 0 : q.toLowerCase()) || "") && (st = `${U}.${be.name.split(".").at(-1)}`), st ? {
        ...be,
        name: st,
        logicalPath: be.logicalPath.replace(/[^/]+$/, st)
      } : be;
    }), ae = V.filter((be, st) => be !== E.files[st]), ne = { ...E, files: V };
    y.current = ne, v(ne), await Promise.all(ae.map(Ps)), a.source === "local" ? await gt(V, `Renamed input to ${w}; browser Python is ready`) : M(
      ae.length > 1 ? `Renamed ${a.name} and its paired plot data` : `Renamed ${a.name} to ${w}`
    );
  }
  function Xe(a) {
    if (!p || p.chats.filter((I) => !I.archived).length <= 1) {
      M("Create another chat before archiving this one");
      return;
    }
    const h = { ...a, archived: !0, updatedAt: ce() }, w = p.chats.find((I) => I.id !== a.id && !I.archived);
    Qt(h), Cr({ ...p.project, activeChatId: w.id, updatedAt: ce() });
  }
  async function lo(a) {
    const h = await Qi(a);
    if (!h) return;
    const w = await Er(h);
    v(w), y.current = w, Tt(!1), ft(/* @__PURE__ */ new Set()), await gt(w.files, "Project loaded");
  }
  async function an(a, h, w, I = !1) {
    const E = y.current;
    if (!E) return Pt("Project is not ready");
    const P = a.replace(/\r\n/g, `
`).trimEnd(), z = await On(P), U = E.files.filter((q) => q.source !== "result" && q.state === "ready" && !q.deletedAt).map((q) => q.sha256).sort(), he = await On(
      `${z}|${U.join(",")}|${Yi}|plotCsv=${E.project.plotCsv}`
    ), V = E.executions.filter((q) => q.cacheKey === he && q.status !== "running").sort((q, Fe) => Fe.createdAt.localeCompare(q.createdAt))[0];
    if (V && !I) {
      const q = {
        ...V,
        id: qe(),
        chatId: h,
        promptId: w,
        status: V.status === "success" || V.status === "reused" ? "reused" : "failed",
        reusedFrom: V.id,
        createdAt: ce()
      };
      return En(q), Kt(h, {
        id: qe(),
        role: "assistant",
        content: q.status === "reused" ? "Reused a previous successful local Python run because its code and inputs are unchanged." : "Skipped unchanged Python that already failed; AmsterdamUMC must correct the code.",
        kind: "execution",
        executionId: q.id,
        createdAt: ce()
      }), q.status === "reused" ? JSON.stringify({
        reused: !0,
        execution_id: V.id,
        stdout: V.stdout,
        stderr: V.stderr,
        preview: V.preview,
        generated_files: V.outputFileIds.map((Fe) => E.files.find((Ut) => Ut.id === Fe)).filter(Boolean).map((Fe) => ({ name: Fe.name, size: Fe.size, type: Fe.type }))
      }) : Pt(
        `Identical code already failed:
${V.stderr || V.stdout}. Modify the code before trying again.`
      );
    }
    const ae = {
      id: qe(),
      projectId: E.project.id,
      chatId: h,
      promptId: w,
      code: P,
      codeHash: z,
      cacheKey: he,
      status: "running",
      stdout: "",
      stderr: "",
      outputFileIds: [],
      missingPlotCsv: [],
      inputHashes: U,
      runtimeVersion: Yi,
      model: ye.model,
      createdAt: ce()
    };
    En(ae), Kt(h, {
      id: qe(),
      role: "assistant",
      content: "Python execution",
      kind: "execution",
      executionId: ae.id,
      createdAt: ce()
    });
    let ne;
    try {
      we("running"), ne = await u.run(P);
    } catch (q) {
      const Fe = String(q instanceof Error ? q.message : q).slice(0, As), Ut = { ...ae, status: "failed", stderr: Fe };
      return En(Ut), M("Python error sent to AmsterdamUMC; waiting for corrected code…"), we("repairing"), Pt(q);
    }
    const _e = [];
    for (const q of ne.files) {
      const Fe = qe();
      _e.push({
        id: Fe,
        projectId: E.project.id,
        chatId: h,
        executionId: ae.id,
        name: q.name,
        logicalPath: `${E.project.rootPath}/chats/${h}/outputs/${ae.id}/${q.name}`,
        type: q.type,
        size: q.data.byteLength,
        sha256: await On(q.data),
        source: "result",
        state: "ready",
        data: q.data,
        createdAt: ce()
      }), pt.current.add(q.name);
    }
    Ft(_e), na(_e.map((q) => ({
      id: qe(),
      projectId: E.project.id,
      chatId: h,
      executionId: ae.id,
      fileId: q.id,
      kind: q.type.startsWith("image/") ? "plot" : "file",
      title: q.name,
      pinned: !1,
      createdAt: ce()
    })));
    const Pe = E.project.plotCsv ? Array.from(pt.current).filter((q) => /\.(png|svg)$/i.test(q)).filter((q) => !pt.current.has(q.replace(/\.(png|svg)$/i, ".csv"))) : [], be = {
      ...ae,
      status: Pe.length ? "incomplete" : "success",
      stdout: ne.stdout,
      stderr: ne.stderr,
      preview: ne.preview,
      modelPayload: ne.modelPayload,
      outputFileIds: _e.map((q) => q.id),
      missingPlotCsv: Pe
    };
    En(be);
    const st = JSON.stringify(ne.modelPayload);
    if (Qo({
      id: qe(),
      projectId: E.project.id,
      chatId: h,
      executionId: ae.id,
      categories: ["bounded-preview", "generated-file-metadata", ...ne.modelPayload.stderr ? ["error"] : []],
      byteLength: new TextEncoder().encode(st).byteLength,
      payload: st,
      createdAt: ce()
    }), !Pe.length) {
      const q = y.current;
      for (const Fe of (q == null ? void 0 : q.executions) || []) {
        if (Fe.chatId !== h || Fe.promptId !== w || !Fe.missingPlotCsv.length) continue;
        const Ut = Fe.missingPlotCsv.filter(
          (bt) => !pt.current.has(bt.replace(/\.(png|svg)$/i, ".csv"))
        );
        Ut.length !== Fe.missingPlotCsv.length && En({
          ...Fe,
          status: Ut.length ? "incomplete" : "success",
          missingPlotCsv: Ut
        });
      }
    }
    return M("Python completed locally; continuing the analysis…"), we(Pe.length ? "repairing" : "checking"), Pe.length ? Pt(
      `Plot data CSV required. Create ${Pe.map((q) => q.replace(/\.(png|svg)$/i, ".csv")).join(", ")} containing the data used for the plot. Do not regenerate unrelated analysis.`
    ) : eh(ne);
  }
  async function Us(a, h, w) {
    let I = {};
    try {
      I = JSON.parse(a.function.arguments || "{}");
    } catch (P) {
      return Pt(`Invalid JSON tool arguments: ${String(P)}`);
    }
    const E = y.current;
    if (!E) return Pt("Project is not ready");
    if (a.function.name === "list_workspace_files") return tm(E.files);
    if (a.function.name === "reset_python")
      try {
        return await u.beginTurn(), pt.current.clear(), "Python state reset; canonical project inputs remain available.";
      } catch (P) {
        return Pt(P);
      }
    if (a.function.name === "list_saved_scripts")
      return JSON.stringify(E.scripts.filter((P) => !P.deletedAt).map((P) => ({
        id: P.id,
        name: P.name,
        description: P.description,
        current_version: P.currentVersion,
        updated_at: P.updatedAt
      })));
    if (a.function.name === "read_saved_script") {
      const P = E.scripts.find((U) => U.id === I.script_id && !U.deletedAt);
      if (!P) return Pt("Saved script was not found");
      const z = P.versions.find((U) => U.version === P.currentVersion);
      return z ? JSON.stringify({ id: P.id, name: P.name, version: z.version, code: z.code }) : Pt("Saved script has no readable current version");
    }
    if (a.function.name === "run_saved_script") {
      const P = E.scripts.find((U) => U.id === I.script_id && !U.deletedAt), z = P == null ? void 0 : P.versions.find((U) => U.version === P.currentVersion);
      if (!z) return Pt("Saved script was not found");
      try {
        const U = Fo(z.code, E.files);
        return an(U.code, h, w);
      } catch (U) {
        return Pt(U);
      }
    }
    if (a.function.name === "list_saved_workflows")
      return JSON.stringify(E.workflows.filter((P) => !P.deletedAt).map((P) => ({
        id: P.id,
        name: P.name,
        description: P.description,
        version: P.version,
        steps: P.steps.map((z) => z.name)
      })));
    if (a.function.name === "run_saved_workflow") {
      const P = E.workflows.find(
        (U) => U.id === I.workflow_id && !U.deletedAt
      );
      if (!P) return Pt("Saved workflow was not found");
      const z = [];
      for (const U of P.steps) {
        const he = y.current, V = he.scripts.find((ne) => ne.id === U.scriptId && !ne.deletedAt), ae = V == null ? void 0 : V.versions.find((ne) => ne.version === U.scriptVersion);
        if (!ae) return Pt(`Workflow step ${U.name} is unavailable`);
        try {
          await u.beginTurn();
          const ne = Fo(ae.code, he.files);
          z.push(await an(ne.code, h, w));
        } catch (ne) {
          return Pt(`Workflow step ${U.name} failed: ${String(ne)}`);
        }
      }
      return JSON.stringify({
        workflow: P.name,
        steps: P.steps.length,
        results: z
      }).slice(0, As);
    }
    return a.function.name !== "run_python" || typeof I.code != "string" ? Pt(`Unsupported or invalid tool call: ${a.function.name}`) : an(I.code, h, w);
  }
  async function uo() {
    var _e, Pe, be, st, q, Fe, Ut, bt, ho;
    const a = ke.trim(), h = y.current, w = h == null ? void 0 : h.chats.find((Be) => Be.id === h.project.activeChatId);
    if (!a || !Wo || !h || !w) return;
    pe(""), de(!0), we("planning"), Fn.current = new AbortController(), pt.current.clear(), await u.beginTurn();
    const I = qe(), E = {
      id: I,
      role: "user",
      content: a,
      createdAt: ce()
    };
    Kt(w.id, E);
    let P = {
      ...w,
      messages: [...w.messages, E],
      updatedAt: ce()
    };
    w.messages.filter((Be) => Be.role === "user").length === 0 && (P = { ...P, title: em(a) }, Qt(P));
    const z = ye.contextWindow > 0 ? Math.floor(ye.contextWindow * 0.6) : 24e3, U = P.messages.filter((Be) => Be.kind !== "execution");
    Bl(U) > z && (P = { ...P, summary: nm(U), updatedAt: ce() }, Qt(P), M("Older conversation context was compacted; pinned items and the latest six exchanges were retained"));
    const he = `${Jp}

Project root: ${h.project.rootPath}
The user has ${h.scripts.filter((Be) => !Be.deletedAt).length} saved scripts. ${h.project.plotCsv ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data." : "Plot CSV mode is OFF."}`, V = new Set(P.pinnedMessageIds || []), ae = [
      ...U.filter((Be) => V.has(Be.id)),
      ...U.slice(-12)
    ].filter(
      (Be, mo, Xt) => Xt.findIndex((wt) => wt.id === Be.id) === mo
    ), ne = [
      { role: "system", content: he },
      ...P.summary ? [{ role: "system", content: `Earlier conversation summary:
${P.summary}` }] : [],
      ...ae.map((Be) => ({ role: Be.role, content: Be.content }))
    ];
    ((_e = ne.at(-1)) == null ? void 0 : _e.content) !== a && ne.push({ role: "user", content: a });
    try {
      for (let Be = 0; Be < 8; Be += 1) {
        const mo = Bl(ne), Xt = await Zp(
          ye,
          ne,
          Fn.current.signal,
          (At) => $(At)
        ), wt = (Pe = Xt.choices[0]) == null ? void 0 : Pe.message;
        if (!wt) throw new Error("AmsterdamUMC returned no response");
        const Go = ((be = Xt.usage) == null ? void 0 : be.prompt_tokens) ?? mo, xt = ((st = Xt.usage) == null ? void 0 : st.completion_tokens) ?? Bl(wt.content || wt.tool_calls || ""), bn = ((q = Xt.usage) == null ? void 0 : q.total_tokens) ?? Go + xt;
        if (jn((At) => ({
          promptTokens: Go,
          completionTokens: xt,
          totalTokens: bn,
          sessionTokens: ((At == null ? void 0 : At.sessionTokens) || 0) + bn,
          estimated: !Xt.usage
        })), ne.push({ role: "assistant", content: wt.content, tool_calls: wt.tool_calls }), wt.content) {
          const At = (((Fe = y.current) == null ? void 0 : Fe.executions) || []).filter((cn) => cn.promptId === I).map((cn) => cn.id);
          Kt(w.id, {
            id: qe(),
            role: "assistant",
            content: wt.content,
            citationIds: At,
            createdAt: ce()
          });
        }
        if ($(""), !((Ut = wt.tool_calls) != null && Ut.length)) break;
        we(Be ? "repairing" : "running");
        for (const At of wt.tool_calls) {
          const cn = await Us(At, w.id, I);
          ne.push({ role: "tool", tool_call_id: At.id, content: cn });
        }
        if (we("checking"), Be === 7) throw new Error("The analysis exceeded eight tool rounds");
      }
    } catch (Be) {
      (bt = Fn.current) != null && bt.signal.aborted || Kt(w.id, {
        id: qe(),
        role: "assistant",
        content: String(Be),
        kind: "error",
        createdAt: ce()
      });
    } finally {
      (ho = Fn.current) != null && ho.signal.aborted || M("Ready — analysis runs locally in this browser"), Fn.current = null, $(""), we("ready"), de(!1), kr(await Ki());
    }
  }
  function oa() {
    var a, h;
    (a = Fn.current) == null || a.abort(), u.stop(), de(!1), gt(((h = y.current) == null ? void 0 : h.files) || [], "Ready — analysis runs locally in this browser");
  }
  async function bs(a) {
    var be, st;
    const h = y.current;
    if (!h || !["success", "reused"].includes(a.status)) return;
    const w = h.chats.find((q) => q.id === a.chatId), I = w == null ? void 0 : w.messages.find((q) => q.id === a.promptId), E = h.executions.filter(
      (q) => q.chatId === a.chatId && q.promptId === a.promptId && ["success", "incomplete"].includes(q.status)
    ).sort((q, Fe) => q.createdAt.localeCompare(Fe.createdAt)), P = Array.from(new Set(E.map((q) => q.code))).join(
      `

# Continued analysis / automatic repair
`
    ) || a.code, z = await On(P), U = `${vr((I == null ? void 0 : I.content) || "analysis-script")}.py`, he = (be = await f.askText(
      "Save as reusable script",
      U,
      "Scripts are versioned and can be copied to compatible OMERO projects."
    )) == null ? void 0 : be.trim();
    if (!he) return;
    const V = `${vr(he.replace(/\.py$/i, ""))}.py`, ae = ((st = await f.askText(
      "Script description",
      (I == null ? void 0 : I.content.slice(0, 180)) || "Reusable Analysis Chat workflow"
    )) == null ? void 0 : st.trim()) || "", ne = h.scripts.find(
      (q) => !q.deletedAt && q.name.toLowerCase() === V.toLowerCase()
    ), _e = ne ? {
      ...ne,
      description: ae,
      currentVersion: ne.currentVersion + 1,
      versions: [...ne.versions, {
        version: ne.currentVersion + 1,
        code: P,
        codeHash: z,
        executionId: a.id,
        createdAt: ce()
      }],
      updatedAt: ce()
    } : {
      id: qe(),
      projectId: h.project.id,
      name: V,
      description: ae,
      inputContract: zd(P),
      parameters: [],
      currentVersion: 1,
      versions: [{
        version: 1,
        code: P,
        codeHash: z,
        executionId: a.id,
        createdAt: ce()
      }],
      createdAt: ce(),
      updatedAt: ce()
    };
    _e.inputContract = zd(P);
    const Pe = y.current;
    if (Pe) {
      const q = {
        ...Pe,
        scripts: ne ? Pe.scripts.map((Fe) => Fe.id === _e.id ? _e : Fe) : [...Pe.scripts, _e]
      };
      y.current = q, v(q);
    }
    await Lo(_e), M(`Saved ${_e.name} version ${_e.currentVersion}`);
  }
  async function Ir(a) {
    const h = y.current;
    if (!(h != null && h.project.activeChatId)) return;
    const w = a.versions.find((P) => P.version === a.currentVersion);
    if (!w) return;
    let I;
    try {
      I = Fo(w.code, h.files);
    } catch (P) {
      M(`Cannot bind ${a.name}: ${String(P)}`);
      return;
    }
    de(!0), pt.current.clear(), await u.beginTurn();
    const E = qe();
    Kt(h.project.activeChatId, {
      id: E,
      role: "user",
      content: `Run saved script ${a.name} version ${a.currentVersion}` + (I.bindings.length ? ` with project input binding ${I.bindings.map((P) => `${P.from} → ${P.to}`).join(", ")}` : ""),
      createdAt: ce()
    });
    try {
      await an(I.code, h.project.activeChatId, E, !0), M(`Ran ${a.name} locally`);
    } finally {
      de(!1);
    }
  }
  async function qt(a) {
    var E;
    const h = (E = await f.askText("Rename script", a.name)) == null ? void 0 : E.trim();
    if (!h) return;
    const w = { ...a, name: `${vr(h.replace(/\.py$/i, ""))}.py`, updatedAt: ce() }, I = y.current;
    if (I) {
      const P = {
        ...I,
        scripts: I.scripts.map((z) => z.id === a.id ? w : z)
      };
      y.current = P, v(P);
    }
    Lo(w);
  }
  async function sa(a) {
    if (!await f.confirm(
      "Delete saved script?",
      `${a.name} and all of its versions will be moved out of the active project.`,
      "Delete script",
      !0
    ))
      return;
    const h = y.current;
    if (!h) return;
    const w = { ...a, deletedAt: ce(), updatedAt: ce() }, I = {
      ...h,
      scripts: h.scripts.map((E) => E.id === a.id ? w : E)
    };
    y.current = I, v(I), ft((E) => {
      const P = new Set(E);
      return P.delete(a.id), P;
    }), await Lo(w), M(`Moved script ${a.name} to trash`);
  }
  function Dt(a) {
    ft((h) => {
      const w = new Set(h);
      return w.has(a) ? w.delete(a) : w.add(a), w;
    });
  }
  async function Bs() {
    var ne, _e;
    const a = y.current;
    if (!a) return;
    const h = a.scripts.filter((Pe) => !Pe.deletedAt && yt.has(Pe.id));
    if (h.length < 2) {
      M("Select at least two scripts to combine");
      return;
    }
    const w = vr(h.map((Pe) => Pe.name.replace(/\.py$/i, "")).join("-")), I = (ne = await f.askText(
      "Workflow name",
      w,
      "The selected scripts will become isolated, ordered workflow steps."
    )) == null ? void 0 : ne.trim();
    if (!I) return;
    const E = vr(I);
    let P = E, z = 2;
    for (; a.workflows.some(
      (Pe) => !Pe.deletedAt && Pe.name.toLowerCase() === P.toLowerCase()
    ); )
      P = `${E}-${z}`, z += 1;
    const U = ((_e = await f.askText(
      "Workflow description",
      `Runs ${h.map((Pe) => Pe.name).join(", ")} in sequence`
    )) == null ? void 0 : _e.trim()) || "", he = ce(), V = {
      id: qe(),
      projectId: a.project.id,
      name: P,
      description: U,
      version: 1,
      steps: h.map((Pe) => ({
        id: qe(),
        scriptId: Pe.id,
        scriptVersion: Pe.currentVersion,
        name: Pe.name,
        inputBindings: {},
        parameters: {}
      })),
      createdAt: he,
      updatedAt: he
    }, ae = { ...a, workflows: [...a.workflows, V] };
    y.current = ae, v(ae), ft(/* @__PURE__ */ new Set()), await Hi(V), M(`Created workflow ${V.name} with ${h.length} isolated steps`);
  }
  async function Ko(a) {
    const h = y.current;
    if (!(h != null && h.project.activeChatId) || Se) return;
    de(!0);
    const w = h.project.activeChatId, I = qe();
    Kt(w, {
      id: I,
      role: "user",
      content: `Run workflow ${a.name} version ${a.version}`,
      createdAt: ce()
    });
    try {
      let E = h.files.filter(
        (P) => P.source !== "result" && P.state === "ready" && !P.deletedAt
      );
      for (let P = 0; P < a.steps.length; P += 1) {
        const z = a.steps[P], he = y.current.scripts.find((_e) => _e.id === z.scriptId && !_e.deletedAt), V = he == null ? void 0 : he.versions.find((_e) => _e.version === z.scriptVersion);
        if (!he || !V) throw new Error(`Workflow step ${z.name} is unavailable`);
        M(`Workflow ${a.name}: step ${P + 1} of ${a.steps.length}`), await u.beginTurn(), pt.current.clear();
        const ae = Fo(V.code, E);
        await an(ae.code, w, I, !0);
        const ne = y.current.files.filter(
          (_e) => _e.source === "result" && _e.executionId && y.current.executions.some(
            (Pe) => Pe.id === _e.executionId && Pe.promptId === I
          ) && !_e.deletedAt
        );
        E = [...E, ...ne], P < a.steps.length - 1 && await u.syncInputs(E);
      }
      await u.syncInputs(h.files.filter(
        (P) => P.source !== "result" && P.state === "ready" && !P.deletedAt
      )), M(`Workflow ${a.name} completed`);
    } catch (E) {
      Kt(w, {
        id: qe(),
        role: "assistant",
        content: `Workflow stopped: ${String(E)}`,
        kind: "error",
        createdAt: ce()
      }), M(`Workflow ${a.name} failed`);
    } finally {
      de(!1);
    }
  }
  async function Ws(a) {
    if (!await f.confirm(
      "Delete workflow?",
      `${a.name} will be moved to project trash. Its source scripts remain available.`,
      "Delete workflow",
      !0
    )) return;
    const h = y.current;
    if (!h) return;
    const w = { ...a, deletedAt: ce(), updatedAt: ce() }, I = {
      ...h,
      workflows: h.workflows.map((E) => E.id === a.id ? w : E)
    };
    y.current = I, v(I), await Hi(w), M(`Moved workflow ${a.name} to project trash`);
  }
  async function co(a) {
    const h = { ...a, deletedAt: void 0 };
    Ft([h]), await Ps(h), M(`Restored ${a.name}`);
  }
  async function fo(a) {
    const h = y.current;
    if (!h) return;
    const w = { ...a, deletedAt: void 0, updatedAt: ce() }, I = {
      ...h,
      scripts: h.scripts.map((E) => E.id === a.id ? w : E)
    };
    y.current = I, v(I), await Lo(w);
  }
  async function Rr(a) {
    const h = y.current;
    if (!h) return;
    const w = { ...a, deletedAt: void 0, updatedAt: ce() }, I = {
      ...h,
      workflows: h.workflows.map((E) => E.id === a.id ? w : E)
    };
    y.current = I, v(I), await Hi(w), M(`Restored workflow ${a.name}`);
  }
  async function Or(a) {
    const h = y.current;
    if (!h || !l.canUpload) return;
    const w = new Set(a.steps.map((z) => z.scriptId)), I = {
      format: "nl.bioimaging.analysis-chat.workflow.v1",
      exportedAt: ce(),
      workflow: a,
      scripts: h.scripts.filter((z) => !z.deletedAt && w.has(z.id))
    }, E = `${vr(a.name)}.oac-workflow.json`, P = await l.uploadWorkflowTemplate(
      E,
      new TextEncoder().encode(JSON.stringify(I, null, 2))
    );
    ee((z) => [...z, P]), M(`Published workflow template as FileAnnotation ${P.annotation_id}`);
  }
  async function Vs(a) {
    const h = y.current;
    if (h)
      try {
        const w = JSON.parse(
          new TextDecoder().decode(await l.downloadWorkflowTemplate(a))
        );
        if (w.format !== "nl.bioimaging.analysis-chat.workflow.v1" || !w.workflow || !Array.isArray(w.scripts)) throw new Error("Unsupported workflow template");
        const I = /* @__PURE__ */ new Map(), E = w.scripts.map((U) => {
          const he = qe();
          return I.set(U.id, he), {
            ...U,
            id: he,
            projectId: h.project.id,
            name: `${U.name.replace(/\.py$/i, "")}-template.py`,
            createdAt: ce(),
            updatedAt: ce()
          };
        }), P = {
          ...w.workflow,
          id: qe(),
          projectId: h.project.id,
          name: `${w.workflow.name}-template`,
          steps: w.workflow.steps.map((U) => ({
            ...U,
            id: qe(),
            scriptId: I.get(U.scriptId) || U.scriptId
          })),
          createdAt: ce(),
          updatedAt: ce()
        };
        await Promise.all([...E.map(Lo), Hi(P)]);
        const z = {
          ...h,
          scripts: [...h.scripts, ...E],
          workflows: [...h.workflows, P]
        };
        y.current = z, v(z), M(`Imported workflow template ${P.name}`);
      } catch (w) {
        M(`Workflow template import failed: ${String(w)}`);
      }
  }
  async function Hs(a) {
    const h = y.current;
    if (!h || Se) return;
    const w = R.filter((P) => P.id !== h.project.id);
    if (!w.length) {
      M("Open the destination OMERO objects in Analysis Chat once before batch execution");
      return;
    }
    if (!await f.confirm(
      "Batch-run workflow?",
      `${a.name} will run locally on the compatible browser projects for: ${w.map((P) => `${P.objectType} ${P.objectId} (${P.name})`).join(", ")}. Incompatible projects will be skipped.`,
      "Run compatible projects"
    )) return;
    de(!0);
    const I = [], E = [];
    try {
      for (const P of w) {
        const z = await Qi(P.id);
        if (!z) continue;
        const U = [];
        try {
          for (const he of a.steps) {
            const V = h.scripts.find((ne) => ne.id === he.scriptId && !ne.deletedAt), ae = V == null ? void 0 : V.versions.find((ne) => ne.version === he.scriptVersion);
            if (!ae) throw new Error(`Missing ${he.name}`);
            U.push(Fo(ae.code, z.files).code);
          }
        } catch {
          E.push(P.name);
          continue;
        }
        try {
          const he = Zi(z.project.id, `${a.name} batch run`);
          z.project = { ...z.project, activeChatId: he.id, updatedAt: ce() }, z.chats = [...z.chats, he], y.current = z, v(z), await u.syncInputs(z.files.filter(
            (ae) => ae.source !== "result" && ae.state === "ready" && !ae.deletedAt
          ));
          const V = qe();
          Kt(he.id, {
            id: V,
            role: "user",
            content: `Batch run workflow ${a.name} on ${P.objectType} ${P.objectId}`,
            createdAt: ce()
          });
          for (const ae of U)
            await u.beginTurn(), pt.current.clear(), await an(ae, he.id, V, !0);
          await Yn(y.current), I.push(P.name);
        } catch (he) {
          const V = y.current;
          if ((V == null ? void 0 : V.project.id) === z.project.id) {
            const ae = V.chats.find((ne) => ne.id === V.project.activeChatId);
            ae && (Kt(ae.id, {
              id: qe(),
              role: "assistant",
              kind: "error",
              content: `Batch workflow failed for this object: ${String(he)}`,
              createdAt: ce()
            }), await Yn(y.current));
          }
          E.push(P.name);
        }
      }
    } finally {
      y.current = h, v(h), await u.syncInputs(h.files.filter(
        (P) => P.source !== "result" && P.state === "ready" && !P.deletedAt
      )), de(!1);
    }
    M(
      `Batch workflow completed for ${I.length} project(s)` + (E.length ? `; incompatible: ${E.join(", ")}` : "")
    );
  }
  function $r(a) {
    const h = a || Array.from(yt);
    if (!h.length) {
      M("Select one or more scripts to copy");
      return;
    }
    ft(new Set(h));
    const w = R.find((I) => I.id !== (Ce == null ? void 0 : Ce.id));
    if (!w) {
      M("Open another OMERO Dataset, Screen, Plate, or Image once before copying scripts to it");
      return;
    }
    eo(w.id), Zr(!0);
  }
  async function Qs() {
    const a = y.current;
    if (!a || !xr) return;
    const h = await Qi(xr);
    if (!h) {
      M("The destination project is no longer available");
      return;
    }
    const w = a.scripts.filter((U) => !U.deletedAt && yt.has(U.id));
    if (!w.length) return;
    const I = /* @__PURE__ */ new Map();
    for (const U of w) {
      const he = U.versions.find((V) => V.version === U.currentVersion);
      if (he)
        try {
          const V = Fo(he.code, h.files);
          I.set(
            U.id,
            Object.fromEntries(V.bindings.map((ae) => [ae.from, ae.to]))
          );
        } catch (V) {
          M(`Copy blocked by compatibility preflight for ${U.name}: ${String(V)}`);
          return;
        }
    }
    const E = new Set(h.scripts.filter((U) => !U.deletedAt).map((U) => U.name.toLowerCase())), P = [];
    for (const U of w) {
      const he = U.name.replace(/\.py$/i, "");
      let V = U.name, ae = 2;
      for (; E.has(V.toLowerCase()); )
        V = `${he}-copy-${ae}.py`, ae += 1;
      E.add(V.toLowerCase());
      const ne = ce();
      P.push({
        ...U,
        id: qe(),
        projectId: h.project.id,
        name: V,
        description: `${U.description}${U.description ? " · " : ""}Copied from ${a.project.name}`,
        projectBindings: {
          ...U.projectBindings || {},
          [h.project.id]: I.get(U.id) || {}
        },
        versions: U.versions.map((_e) => ({
          ..._e,
          executionId: ""
        })),
        createdAt: ne,
        updatedAt: ne
      });
    }
    if (await Promise.all(P.map(Lo)), h.project.id === a.project.id) {
      const U = { ...a, scripts: [...a.scripts, ...P] };
      y.current = U, v(U);
    }
    Zr(!1);
    const z = R.find((U) => U.id === h.project.id);
    M(
      `Copied ${P.length} script${P.length === 1 ? "" : "s"} to ${(z == null ? void 0 : z.name) || "the destination project"}. When run there, the scripts use that project's current inputs.`
    );
  }
  function er(a, h, w) {
    const I = (h instanceof Uint8Array, h), E = URL.createObjectURL(new Blob([I], { type: w })), P = document.createElement("a");
    P.href = E, P.download = a, P.click(), setTimeout(() => URL.revokeObjectURL(E), 1e3);
  }
  function Un(a) {
    a.data && er(a.name, a.data, a.type);
  }
  function ia(a) {
    const h = a.versions.find((w) => w.version === a.currentVersion);
    h && er(a.name, new TextEncoder().encode(h.code), "text/x-python");
  }
  function qo() {
    const a = y.current;
    if (!a) return;
    const h = a.chats.find((E) => E.id === a.project.activeChatId);
    if (!h) return;
    const w = a.executions.filter((E) => E.chatId === h.id), I = [
      `# ${h.title}`,
      "",
      `OMERO object: ${a.project.objectType || "Local"} ${a.project.objectId || ""}`,
      `Project: ${a.project.name}`,
      `Generated: ${ce()}`,
      `Runtime: ${Yi}`,
      "",
      "## Inputs",
      ...a.files.filter((E) => E.source !== "result" && !E.deletedAt).map((E) => `- ${E.name} — ${E.sha256} — ${E.size} bytes`),
      "",
      "## Conversation",
      ...h.messages.filter((E) => E.kind !== "execution").flatMap((E) => [`### ${E.role}`, "", E.content, ""]),
      "## Executions",
      ...w.flatMap((E, P) => [
        `### Run ${P + 1} — ${E.status}`,
        "",
        `Code hash: ${E.codeHash}`,
        `Model: ${E.model}`,
        `Inputs: ${E.inputHashes.join(", ")}`,
        "",
        "```python",
        E.code,
        "```",
        ""
      ])
    ];
    er(
      `${vr(h.title)}-reproducibility-report.md`,
      new TextEncoder().encode(I.join(`
`)),
      "text/markdown"
    ), M("Downloaded reproducibility report");
  }
  async function $e(a) {
    if (await f.confirm(
      "Attach result to OMERO?",
      `${a.name} will be uploaded and linked directly to the selected OMERO object.`,
      "Attach result"
    ))
      try {
        const h = await l.attach(a);
        M(`Attached ${h.name} as FileAnnotation ${h.annotation_id}`);
      } catch (h) {
        M(`Attach failed: ${String(h)}`);
      }
  }
  async function Jo() {
    var h;
    const a = y.current;
    if (!a) throw new Error("Project is not ready");
    return Fh(
      a,
      ((h = s.context) == null ? void 0 : h.max_snapshot_bytes) ?? $d
    );
  }
  async function Ks() {
    try {
      const a = await Jo();
      er(a.filename, a.data, "application/zip"), M(
        a.omittedLocalInputs.length ? `Project downloaded; omitted local inputs: ${a.omittedLocalInputs.join(", ")}` : "Complete project downloaded"
      );
    } catch (a) {
      M(`Project export failed: ${String(a)}`);
    }
  }
  async function Xo() {
    if (l.canUpload)
      try {
        const a = await Jo();
        if (a.omittedLocalInputs.length && !await f.confirm(
          "Save snapshot without oversized local inputs?",
          `The following files will be omitted and required again after restore: ${a.omittedLocalInputs.join(", ")}`,
          "Save without files"
        )) return;
        const h = await l.uploadSnapshot(a.filename, a.data);
        F((w) => [...w, h]), M(`Saved project snapshot as FileAnnotation ${h.annotation_id}`);
      } catch (a) {
        M(`OMERO project snapshot failed: ${String(a)}`);
      }
  }
  async function qs(a) {
    var h;
    if (a)
      try {
        const w = ((h = s.context) == null ? void 0 : h.max_snapshot_bytes) ?? $d;
        if (a.size > w)
          throw new Error(
            `Project archive exceeds the configured ${Math.floor(w / 1024 / 1024)} MiB limit`
          );
        const I = await bl(await a.arrayBuffer(), s.context);
        if (s.context && (I.project.objectType !== s.context.object_type || I.project.objectId !== s.context.object_id))
          throw new Error("Project snapshot belongs to a different OMERO object");
        await Yn(I);
        const E = await Er(I);
        v(E), y.current = E, S(await Yr(s.context)), T(await Ns(s.context)), await gt(E.files, "Imported project restored");
      } catch (w) {
        M(`Project import failed: ${String(w)}`);
      } finally {
        Dn.current && (Dn.current.value = "");
      }
  }
  async function Yo(a) {
    try {
      M(`Downloading ${a.name}…`);
      const h = await bl(
        await l.downloadSnapshot(a),
        s.context
      );
      if (s.context && (h.project.objectType !== s.context.object_type || h.project.objectId !== s.context.object_id))
        throw new Error("Project snapshot belongs to a different OMERO object");
      await Yn(h);
      const w = await Er(h);
      v(w), y.current = w, S(await Yr(s.context)), T(await Ns(s.context)), await gt(w.files, "OMERO project snapshot restored");
    } catch (h) {
      M(`Snapshot restore failed: ${String(h)}`);
    }
  }
  function Js() {
    Ce && Cr({ ...Ce, plotCsv: !Ce.plotCsv, updatedAt: ce() });
  }
  function po(a) {
    const h = [];
    return a.source === "local" && h.push({ label: "Rename", run: () => void Ds(a) }), (a.state === "failed" || a.state === "missing") && a.annotationId && h.push({ label: "Retry download", run: () => void zs(a.id) }), a.state === "missing" && a.source === "local" && h.push({
      label: "Reselect file",
      run: () => {
        var w;
        return (w = document.getElementById(`reselect-${a.id}`)) == null ? void 0 : w.click();
      }
    }), h.push({
      label: "Remove from project",
      danger: !0,
      run: () => void Cn(a.id)
    }), h;
  }
  function Mr(a) {
    return [
      { label: "Rename", run: () => void Ds(a) },
      { label: "Download", run: () => Un(a) },
      ...l.canUpload ? [{ label: "Attach to OMERO", run: () => void $e(a) }] : [],
      {
        label: "Delete output",
        danger: !0,
        run: () => {
          f.confirm(
            "Move output to trash?",
            `${a.name} will be hidden, while its provenance record remains intact.`,
            "Move to trash",
            !0
          ).then((h) => {
            h && Cn(a.id);
          });
        }
      }
    ];
  }
  function ln(a) {
    return [
      { label: "Run", run: () => void Ir(a) },
      { label: "Rename", run: () => void qt(a) },
      { label: "Download", run: () => ia(a) },
      { label: "Copy to another project…", run: () => $r([a.id]) },
      { label: "Delete script", danger: !0, run: () => void sa(a) }
    ];
  }
  function un(a) {
    return [{
      label: "Resume as new project",
      run: () => void Yo(a)
    }];
  }
  if (!p || !Ce || !He)
    return /* @__PURE__ */ c.jsx("main", { className: "app-shell", children: /* @__PURE__ */ c.jsx("div", { className: "boot-message", children: ie }) });
  const Jt = to.quota ? Math.round(to.usage / to.quota * 100) : 0;
  return /* @__PURE__ */ c.jsxs("main", { className: "app-shell", children: [
    f.element,
    /* @__PURE__ */ c.jsxs("header", { className: "project-header", children: [
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("h1", { children: "OMERO.AnalysisChat" }),
        /* @__PURE__ */ c.jsx("p", { children: Ce.rootPath })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ c.jsxs("label", { className: "csv-toggle", title: "Require a matching CSV for every generated plot", children: [
          /* @__PURE__ */ c.jsx("input", { type: "checkbox", checked: Ce.plotCsv, onChange: Js }),
          "Plot + CSV"
        ] }),
        /* @__PURE__ */ c.jsx("span", { className: "privacy-badge", children: "Source data stay in this browser" }),
        s.context && /* @__PURE__ */ c.jsx(
          "button",
          {
            title: "Open BIOMERO for pixel, GPU, server-package, or long-running workflows",
            onClick: () => window.open(
              `/biomero/?type=${encodeURIComponent(s.context.object_type)}&id=${s.context.object_id}`,
              "_blank",
              "noopener"
            ),
            children: "BIOMERO handoff"
          }
        ),
        /* @__PURE__ */ c.jsx("button", { onClick: () => Te(!xe), children: "AI settings" })
      ] })
    ] }),
    xe && /* @__PURE__ */ c.jsxs("form", { className: "settings-card", onSubmit: (a) => a.preventDefault(), children: [
      /* @__PURE__ */ c.jsx("h2", { children: "AmsterdamUMC" }),
      /* @__PURE__ */ c.jsx("p", { className: "warning", children: "The API key is kept only for this tab unless you explicitly choose to remember it. Remembered keys are stored unencrypted and never included in project snapshots." }),
      /* @__PURE__ */ c.jsxs("label", { children: [
        "Deployment/model",
        /* @__PURE__ */ c.jsx("input", { value: ye.model, onChange: (a) => void Nr({ ...ye, model: a.target.value }), placeholder: "GPT-5 deployment name" })
      ] }),
      /* @__PURE__ */ c.jsxs("label", { children: [
        "API key",
        /* @__PURE__ */ c.jsx("input", { type: "password", value: ye.apiKey, onChange: (a) => void Nr({ ...ye, apiKey: a.target.value }), autoComplete: "off" })
      ] }),
      /* @__PURE__ */ c.jsxs("label", { className: "remember-key", children: [
        /* @__PURE__ */ c.jsx(
          "input",
          {
            type: "checkbox",
            checked: ye.rememberKey,
            onChange: (a) => void Nr({ ...ye, rememberKey: a.target.checked })
          }
        ),
        "Remember this key in this browser profile"
      ] }),
      /* @__PURE__ */ c.jsxs("label", { children: [
        "Model context window (optional)",
        /* @__PURE__ */ c.jsx("input", { type: "number", min: "0", value: ye.contextWindow || "", onChange: (a) => void Nr({ ...ye, contextWindow: Math.max(0, Number(a.target.value) || 0) }) })
      ] }),
      /* @__PURE__ */ c.jsx("p", { children: "Temperature is fixed at 1." }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => void Nr({ ...ye, apiKey: "" }), children: "Forget API key" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "project-toolbar", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "active-project-label", children: [
        /* @__PURE__ */ c.jsx("span", { children: "Project" }),
        /* @__PURE__ */ c.jsx("strong", { children: Ce.name })
      ] }),
      /* @__PURE__ */ c.jsxs("label", { children: [
        "Chat",
        /* @__PURE__ */ c.jsxs("select", { value: He.id, onChange: (a) => ra(a.target.value), children: [
          /* @__PURE__ */ c.jsx("optgroup", { label: "Active chats", children: _r.filter((a) => !a.archived).map((a) => /* @__PURE__ */ c.jsx("option", { value: a.id, children: a.title }, a.id)) }),
          _r.some((a) => a.archived) && /* @__PURE__ */ c.jsx("optgroup", { label: "Archived chats", children: _r.filter((a) => a.archived).map((a) => /* @__PURE__ */ c.jsxs("option", { value: a.id, children: [
            a.title,
            " (archived)"
          ] }, a.id)) })
        ] })
      ] }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => void Tr(), children: "New chat" }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => void Ar(He), children: "Rename chat" }),
      /* @__PURE__ */ c.jsx("button", { onClick: () => Xe(He), children: "Archive" }),
      /* @__PURE__ */ c.jsxs("details", { className: "project-menu", children: [
        /* @__PURE__ */ c.jsx("summary", { children: "Project actions" }),
        /* @__PURE__ */ c.jsxs("div", { children: [
          /* @__PURE__ */ c.jsx("button", { onClick: qo, children: "Download reproducibility report" }),
          /* @__PURE__ */ c.jsx("button", { onClick: () => void Ks(), children: "Download project ZIP" }),
          /* @__PURE__ */ c.jsx("button", { onClick: () => {
            var a;
            return (a = Dn.current) == null ? void 0 : a.click();
          }, children: "Import project ZIP" }),
          l.canUpload && /* @__PURE__ */ c.jsx("button", { onClick: () => void Xo(), children: "Save project to OMERO" })
        ] })
      ] }),
      /* @__PURE__ */ c.jsx("input", { ref: Dn, hidden: !0, type: "file", accept: ".zip,.oac.zip", onChange: (a) => {
        var h;
        return void qs(((h = a.target.files) == null ? void 0 : h[0]) || null);
      } })
    ] }),
    zn && /* @__PURE__ */ c.jsx("div", { className: "dialog-backdrop", role: "presentation", children: /* @__PURE__ */ c.jsxs("section", { className: "script-transfer-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "script-transfer-title", children: [
      /* @__PURE__ */ c.jsx("h2", { id: "script-transfer-title", children: "Copy scripts to another project" }),
      /* @__PURE__ */ c.jsx("p", { children: "The copied scripts keep their code and versions. When run in the destination, they automatically use that project’s current input files." }),
      /* @__PURE__ */ c.jsxs("label", { children: [
        "Destination project",
        /* @__PURE__ */ c.jsx("select", { value: xr, onChange: (a) => eo(a.target.value), children: R.filter((a) => a.id !== Ce.id).map((a) => /* @__PURE__ */ c.jsxs("option", { value: a.id, children: [
          a.objectType,
          " ",
          a.objectId,
          " — ",
          a.name
        ] }, a.id)) })
      ] }),
      /* @__PURE__ */ c.jsx("small", { children: "A destination appears after you have opened that OMERO object in Analysis Chat at least once." }),
      /* @__PURE__ */ c.jsxs("div", { className: "dialog-actions", children: [
        /* @__PURE__ */ c.jsx("button", { onClick: () => Zr(!1), children: "Cancel" }),
        /* @__PURE__ */ c.jsx("button", { disabled: !xr, onClick: () => void Qs(), children: "Copy selected scripts" })
      ] })
    ] }) }),
    /* @__PURE__ */ c.jsxs(
      "div",
      {
        className: `workspace ${K ? "artifact-visible" : ""}`,
        style: { "--explorer-width": `${B}px` },
        children: [
          /* @__PURE__ */ c.jsxs(
            "aside",
            {
              className: "project-tree",
              onDragOver: (a) => {
                a.preventDefault(), a.dataTransfer.dropEffect = "copy";
              },
              onDrop: (a) => {
                a.preventDefault(), Ms(a.dataTransfer.files);
              },
              children: [
                /* @__PURE__ */ c.jsxs(
                  "div",
                  {
                    className: "file-browser-heading",
                    onContextMenu: (a) => ot(a, Ce.name, [
                      { label: "Add files", run: () => {
                        var h;
                        return (h = Gn.current) == null ? void 0 : h.click();
                      } },
                      { label: "New chat", run: () => void Tr() },
                      { label: "Rename current chat", run: () => void Ar(He) },
                      { label: "Refresh", run: () => void ao() }
                    ]),
                    children: [
                      /* @__PURE__ */ c.jsxs("div", { children: [
                        /* @__PURE__ */ c.jsx("h2", { children: "Project files" }),
                        /* @__PURE__ */ c.jsxs("small", { children: [
                          Do(Ld(p)),
                          " · browser ",
                          Jt || "?",
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ c.jsx(
                        "button",
                        {
                          className: "browser-more",
                          "aria-label": "Project actions",
                          title: "Project actions",
                          onClick: (a) => ot(a, Ce.name, [
                            { label: "Add files", run: () => {
                              var h;
                              return (h = Gn.current) == null ? void 0 : h.click();
                            } },
                            { label: "New chat", run: () => void Tr() },
                            { label: "Rename current chat", run: () => void Ar(He) },
                            { label: "Refresh", run: () => void ao() }
                          ]),
                          children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ c.jsxs("div", { className: "file-browser-toolbar", role: "toolbar", "aria-label": "Project file actions", children: [
                  /* @__PURE__ */ c.jsx(
                    "button",
                    {
                      title: "Up to OMERO object projects",
                      "aria-label": "Up to OMERO object projects",
                      disabled: Ge,
                      onClick: () => Tt(!0),
                      children: /* @__PURE__ */ c.jsx(ze, { name: "up" })
                    }
                  ),
                  /* @__PURE__ */ c.jsx("button", { title: "Add files", "aria-label": "Add files", onClick: () => {
                    var a;
                    return (a = Gn.current) == null ? void 0 : a.click();
                  }, children: /* @__PURE__ */ c.jsx(ze, { name: "upload" }) }),
                  /* @__PURE__ */ c.jsx("button", { title: "Refresh project", "aria-label": "Refresh project", onClick: () => void ao(), children: /* @__PURE__ */ c.jsx(ze, { name: "refresh" }) }),
                  /* @__PURE__ */ c.jsx(
                    "button",
                    {
                      title: "Collapse all folders",
                      "aria-label": "Collapse all folders",
                      onClick: () => on({
                        inputs: !1,
                        outputs: !1,
                        scripts: !1,
                        workflows: !1,
                        trash: !1,
                        snapshots: !1
                      }),
                      children: /* @__PURE__ */ c.jsx(ze, { name: "collapse" })
                    }
                  ),
                  /* @__PURE__ */ c.jsx("input", { ref: Gn, hidden: !0, type: "file", multiple: !0, onChange: (a) => void Ms(a.target.files) })
                ] }),
                /* @__PURE__ */ c.jsxs("label", { className: "explorer-search", children: [
                  /* @__PURE__ */ c.jsx("span", { className: "sr-only", children: "Search project files" }),
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      type: "search",
                      value: O,
                      placeholder: "Search files, scripts, workflows…",
                      onChange: (a) => se(a.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ c.jsxs(
                  "div",
                  {
                    className: "browser-path",
                    title: Ge ? `OMERO/${Ce.objectType}-${Ce.objectId}` : Ce.rootPath,
                    onDoubleClick: () => Tt(!0),
                    children: [
                      /* @__PURE__ */ c.jsx(ze, { name: "root" }),
                      /* @__PURE__ */ c.jsx("span", { children: Ge ? `OMERO/${Ce.objectType}-${Ce.objectId}` : Ce.rootPath })
                    ]
                  }
                ),
                /* @__PURE__ */ c.jsxs("div", { className: "browser-columns", children: [
                  /* @__PURE__ */ c.jsx("span", { children: "Name" }),
                  /* @__PURE__ */ c.jsx("span", { children: "Size" })
                ] }),
                Ge ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                  /* @__PURE__ */ c.jsxs("div", { className: "hierarchy-section", children: [
                    /* @__PURE__ */ c.jsx("strong", { children: "OMERO hierarchy" }),
                    [...(H == null ? void 0 : H.parents) || [], ...(H == null ? void 0 : H.children) || []].map((a) => /* @__PURE__ */ c.jsxs(
                      "button",
                      {
                        disabled: !a.supported,
                        onClick: () => {
                          a.supported && window.location.assign(
                            `${s.tokenUrl.replace(/api\/context-token\/$/, "")}?type=${encodeURIComponent(a.type)}&id=${a.id}`
                          );
                        },
                        children: [
                          /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                          /* @__PURE__ */ c.jsx("span", { children: a.name }),
                          /* @__PURE__ */ c.jsxs("small", { children: [
                            a.type,
                            " ",
                            a.id
                          ] })
                        ]
                      },
                      `${a.type}:${a.id}`
                    )),
                    !(H != null && H.parents.length) && !(H != null && H.children.length) && /* @__PURE__ */ c.jsx("p", { children: "No readable immediate OMERO relations." })
                  ] }),
                  /* @__PURE__ */ c.jsx("div", { className: "hierarchy-section-title", children: "Browser-local projects for this object" }),
                  /* @__PURE__ */ c.jsx("ul", { className: "browser-list project-list", children: _.map((a) => /* @__PURE__ */ c.jsxs(
                    "li",
                    {
                      className: `browser-row project-row ${a.id === Ce.id ? "active" : ""}`,
                      onDoubleClick: () => void lo(a.id),
                      onContextMenu: (h) => ot(h, a.name, [
                        { label: "Open project", run: () => void lo(a.id) },
                        ...a.id !== Ce.id ? [{
                          label: "Delete local project",
                          danger: !0,
                          run: () => void Fs(a)
                        }] : []
                      ]),
                      children: [
                        /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                        /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                          /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                          /* @__PURE__ */ c.jsx("small", { children: a.id === Ce.id ? "open now" : a.sourceSnapshotAnnotationId ? `restored from Annotation ${a.sourceSnapshotAnnotationId}` : "browser-local project" })
                        ] }),
                        /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: new Date(a.updatedAt).toLocaleDateString() }),
                        /* @__PURE__ */ c.jsx(
                          "button",
                          {
                            className: "browser-more",
                            "aria-label": `Actions for ${a.name}`,
                            onClick: (h) => ot(h, a.name, [
                              { label: "Open project", run: () => void lo(a.id) },
                              ...a.id !== Ce.id ? [{
                                label: "Delete local project",
                                danger: !0,
                                run: () => void Fs(a)
                              }] : []
                            ]),
                            children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                          }
                        )
                      ]
                    },
                    a.id
                  )) })
                ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                  Jt >= 75 && /* @__PURE__ */ c.jsxs("p", { className: "quota-warning", children: [
                    "Browser storage is ",
                    Jt,
                    "% full. Archive or download old projects."
                  ] }),
                  /* @__PURE__ */ c.jsxs(
                    "details",
                    {
                      open: Ln.inputs,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const h = a.currentTarget.open;
                        on((w) => ({ ...w, inputs: h }));
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs(
                          "summary",
                          {
                            onContextMenu: (a) => ot(a, "inputs/", [
                              { label: "Add files", run: () => {
                                var h;
                                return (h = Gn.current) == null ? void 0 : h.click();
                              } }
                            ]),
                            children: [
                              /* @__PURE__ */ c.jsx(ze, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                              /* @__PURE__ */ c.jsx("strong", { children: "inputs" }),
                              /* @__PURE__ */ c.jsx("small", { children: ro.length })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c.jsxs("ul", { className: "browser-list", children: [
                          oo.map((a) => /* @__PURE__ */ c.jsxs(
                            "li",
                            {
                              className: `browser-row file-${a.state}`,
                              onContextMenu: (h) => ot(h, a.name, po(a)),
                              children: [
                                /* @__PURE__ */ c.jsx(ze, { name: "file" }),
                                /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ c.jsxs("small", { children: [
                                    a.source,
                                    " · ",
                                    a.state,
                                    " · ",
                                    a.sha256.slice(0, 10) || "unhashed"
                                  ] }),
                                  a.error && /* @__PURE__ */ c.jsx("span", { className: "browser-error", children: a.error })
                                ] }),
                                /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: Do(a.size) }),
                                /* @__PURE__ */ c.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (h) => ot(h, a.name, po(a)),
                                    children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                                  }
                                ),
                                a.state === "missing" && a.source === "local" && /* @__PURE__ */ c.jsx(
                                  "input",
                                  {
                                    id: `reselect-${a.id}`,
                                    hidden: !0,
                                    type: "file",
                                    onChange: (h) => {
                                      var w;
                                      return void zr(a, ((w = h.target.files) == null ? void 0 : w[0]) || null);
                                    }
                                  }
                                )
                              ]
                            },
                            a.id
                          )),
                          !oo.length && /* @__PURE__ */ c.jsx("li", { className: "browser-empty", children: "No matching input files" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ c.jsxs(
                    "details",
                    {
                      open: Ln.outputs,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const h = a.currentTarget.open;
                        on((w) => ({ ...w, outputs: h }));
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs(
                          "summary",
                          {
                            onContextMenu: (a) => ot(a, `chats/${He.title}/`, [
                              { label: "Rename chat", run: () => void Ar(He) },
                              { label: "New chat", run: () => void Tr() },
                              { label: "Archive chat", run: () => Xe(He) }
                            ]),
                            children: [
                              /* @__PURE__ */ c.jsx(ze, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                              /* @__PURE__ */ c.jsxs("strong", { children: [
                                "chats/",
                                vr(He.title),
                                "/outputs"
                              ] }),
                              /* @__PURE__ */ c.jsx("small", { children: Uo.length })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c.jsxs("ul", { className: "browser-list", children: [
                          /* @__PURE__ */ c.jsxs("li", { className: "browser-row virtual", children: [
                            /* @__PURE__ */ c.jsx("span", { className: "browser-icon json", "aria-hidden": "true" }),
                            /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ c.jsx("strong", { children: "chat.json" }),
                              /* @__PURE__ */ c.jsx("small", { children: "autosaved" })
                            ] }),
                            /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: "—" })
                          ] }),
                          /* @__PURE__ */ c.jsxs("li", { className: "browser-row virtual", children: [
                            /* @__PURE__ */ c.jsx("span", { className: "browser-icon markdown", "aria-hidden": "true" }),
                            /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ c.jsx("strong", { children: "chat.md" }),
                              /* @__PURE__ */ c.jsx("small", { children: "autosaved" })
                            ] }),
                            /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: "—" })
                          ] }),
                          Bo.map((a) => /* @__PURE__ */ c.jsxs(
                            "li",
                            {
                              className: "browser-row",
                              onClick: () => {
                                ve(a.id), j(!0);
                              },
                              onDoubleClick: () => Un(a),
                              onContextMenu: (h) => ot(h, a.name, Mr(a)),
                              children: [
                                /* @__PURE__ */ c.jsx(ze, { name: a.type.startsWith("image/") ? "image" : "file" }),
                                /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ c.jsxs("small", { children: [
                                    a.sha256.slice(0, 10),
                                    " · double-click to download"
                                  ] })
                                ] }),
                                /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: Do(a.size) }),
                                /* @__PURE__ */ c.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (h) => ot(h, a.name, Mr(a)),
                                    children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            a.id
                          ))
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ c.jsxs(
                    "details",
                    {
                      open: Ln.scripts,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const h = a.currentTarget.open;
                        on((w) => ({ ...w, scripts: h }));
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs(
                          "summary",
                          {
                            onContextMenu: (a) => ot(a, "scripts/", [
                              { label: "Combine selected scripts", run: () => void Bs() },
                              { label: "Copy selected scripts…", run: () => $r() }
                            ]),
                            children: [
                              /* @__PURE__ */ c.jsx(ze, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                              /* @__PURE__ */ c.jsx("strong", { children: "scripts" }),
                              /* @__PURE__ */ c.jsx("small", { children: sn.length })
                            ]
                          }
                        ),
                        sn.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "script-selection-toolbar", children: [
                          /* @__PURE__ */ c.jsxs("span", { children: [
                            yt.size,
                            " selected"
                          ] }),
                          /* @__PURE__ */ c.jsx("button", { disabled: yt.size < 2, onClick: () => void Bs(), children: "Combine" }),
                          /* @__PURE__ */ c.jsx("button", { disabled: !yt.size, onClick: () => $r(), children: "Copy to…" })
                        ] }),
                        /* @__PURE__ */ c.jsxs("ul", { className: "browser-list", children: [
                          sn.filter((a) => kn(a.name)).map((a) => /* @__PURE__ */ c.jsxs(
                            "li",
                            {
                              className: "browser-row script-row",
                              onDoubleClick: () => void Ir(a),
                              onContextMenu: (h) => ot(h, a.name, ln(a)),
                              children: [
                                /* @__PURE__ */ c.jsx(
                                  "input",
                                  {
                                    className: "script-selector",
                                    type: "checkbox",
                                    "aria-label": `Select ${a.name}`,
                                    checked: yt.has(a.id),
                                    onChange: () => Dt(a.id),
                                    onDoubleClick: (h) => h.stopPropagation()
                                  }
                                ),
                                /* @__PURE__ */ c.jsx("span", { className: "browser-icon python", "aria-hidden": "true" }),
                                /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ c.jsxs("small", { children: [
                                    "v",
                                    a.currentVersion,
                                    " · ",
                                    a.description || "saved Python script"
                                  ] })
                                ] }),
                                /* @__PURE__ */ c.jsxs("span", { className: "browser-size", children: [
                                  "v",
                                  a.currentVersion
                                ] }),
                                /* @__PURE__ */ c.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (h) => ot(h, a.name, ln(a)),
                                    children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            a.id
                          )),
                          !sn.filter((a) => kn(a.name)).length && /* @__PURE__ */ c.jsx("li", { className: "browser-empty", children: "No matching scripts" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ c.jsxs(
                    "details",
                    {
                      open: Ln.workflows,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const h = a.currentTarget.open;
                        on((w) => ({ ...w, workflows: h }));
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs("summary", { children: [
                          /* @__PURE__ */ c.jsx(ze, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                          /* @__PURE__ */ c.jsx("strong", { children: "workflows" }),
                          /* @__PURE__ */ c.jsx("small", { children: p.workflows.length })
                        ] }),
                        /* @__PURE__ */ c.jsxs("ul", { className: "browser-list", children: [
                          p.workflows.filter(
                            (a) => !a.deletedAt && kn(a.name)
                          ).map((a) => /* @__PURE__ */ c.jsxs(
                            "li",
                            {
                              className: "browser-row",
                              onDoubleClick: () => void Ko(a),
                              onContextMenu: (h) => ot(h, a.name, [
                                { label: "Run workflow", run: () => void Ko(a) },
                                { label: "Batch run on opened projects…", run: () => void Hs(a) },
                                ...l.canUpload ? [{
                                  label: "Publish template to OMERO",
                                  run: () => void Or(a)
                                }] : [],
                                { label: "Delete workflow", danger: !0, run: () => void Ws(a) }
                              ]),
                              children: [
                                /* @__PURE__ */ c.jsx(ze, { name: "file" }),
                                /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ c.jsxs("small", { children: [
                                    "v",
                                    a.version,
                                    " · ",
                                    a.steps.length,
                                    " isolated steps"
                                  ] })
                                ] }),
                                /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: a.steps.length }),
                                /* @__PURE__ */ c.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (h) => ot(h, a.name, [
                                      { label: "Run workflow", run: () => void Ko(a) },
                                      { label: "Batch run on opened projects…", run: () => void Hs(a) },
                                      ...l.canUpload ? [{
                                        label: "Publish template to OMERO",
                                        run: () => void Or(a)
                                      }] : [],
                                      { label: "Delete workflow", danger: !0, run: () => void Ws(a) }
                                    ]),
                                    children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            a.id
                          )),
                          !p.workflows.filter(
                            (a) => !a.deletedAt && kn(a.name)
                          ).length && /* @__PURE__ */ c.jsx("li", { className: "browser-empty", children: "No matching workflows" }),
                          G.map((a) => /* @__PURE__ */ c.jsxs(
                            "li",
                            {
                              className: "browser-row",
                              onDoubleClick: () => void Vs(a),
                              children: [
                                /* @__PURE__ */ c.jsx("span", { className: "browser-icon archive", "aria-hidden": "true" }),
                                /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ c.jsx("small", { children: "OMERO template · double-click to import" })
                                ] }),
                                /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: Do(a.size) }),
                                /* @__PURE__ */ c.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Import ${a.name}`,
                                    onClick: () => void Vs(a),
                                    children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                                  }
                                )
                              ]
                            },
                            `template-${a.annotation_id}`
                          ))
                        ] })
                      ]
                    }
                  ),
                  (_n.length > 0 || so.length > 0 || io.length > 0) && /* @__PURE__ */ c.jsxs(
                    "details",
                    {
                      open: Ln.trash,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const h = a.currentTarget.open;
                        on((w) => ({ ...w, trash: h }));
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs("summary", { children: [
                          /* @__PURE__ */ c.jsx(ze, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                          /* @__PURE__ */ c.jsx("strong", { children: "trash" }),
                          /* @__PURE__ */ c.jsx("small", { children: _n.length + so.length + io.length })
                        ] }),
                        /* @__PURE__ */ c.jsxs("ul", { className: "browser-list", children: [
                          _n.map((a) => /* @__PURE__ */ c.jsxs("li", { className: "browser-row", children: [
                            /* @__PURE__ */ c.jsx(ze, { name: "file" }),
                            /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                              /* @__PURE__ */ c.jsx("small", { children: "deleted output" })
                            ] }),
                            /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: Do(a.size) }),
                            /* @__PURE__ */ c.jsx("button", { onClick: () => void co(a), children: "Restore" })
                          ] }, a.id)),
                          so.map((a) => /* @__PURE__ */ c.jsxs("li", { className: "browser-row", children: [
                            /* @__PURE__ */ c.jsx("span", { className: "browser-icon python", "aria-hidden": "true" }),
                            /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                              /* @__PURE__ */ c.jsx("small", { children: "deleted script" })
                            ] }),
                            /* @__PURE__ */ c.jsxs("span", { className: "browser-size", children: [
                              "v",
                              a.currentVersion
                            ] }),
                            /* @__PURE__ */ c.jsx("button", { onClick: () => void fo(a), children: "Restore" })
                          ] }, a.id)),
                          io.map((a) => /* @__PURE__ */ c.jsxs("li", { className: "browser-row", children: [
                            /* @__PURE__ */ c.jsx(ze, { name: "file" }),
                            /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                              /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                              /* @__PURE__ */ c.jsx("small", { children: "deleted workflow" })
                            ] }),
                            /* @__PURE__ */ c.jsxs("span", { className: "browser-size", children: [
                              "v",
                              a.version
                            ] }),
                            /* @__PURE__ */ c.jsx("button", { onClick: () => void Rr(a), children: "Restore" })
                          ] }, a.id))
                        ] })
                      ]
                    }
                  ),
                  A.length > 0 && /* @__PURE__ */ c.jsxs(
                    "details",
                    {
                      open: Ln.snapshots,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const h = a.currentTarget.open;
                        on((w) => ({ ...w, snapshots: h }));
                      },
                      children: [
                        /* @__PURE__ */ c.jsxs("summary", { children: [
                          /* @__PURE__ */ c.jsx(ze, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ c.jsx(ze, { name: "folder" }),
                          /* @__PURE__ */ c.jsx("strong", { children: "Resume from OMERO" }),
                          /* @__PURE__ */ c.jsx("small", { children: A.length })
                        ] }),
                        /* @__PURE__ */ c.jsx("ul", { className: "browser-list", children: A.map((a) => /* @__PURE__ */ c.jsxs(
                          "li",
                          {
                            className: "browser-row",
                            onDoubleClick: () => void Yo(a),
                            onContextMenu: (h) => ot(h, a.name, un(a)),
                            children: [
                              /* @__PURE__ */ c.jsx("span", { className: "browser-icon archive", "aria-hidden": "true" }),
                              /* @__PURE__ */ c.jsxs("div", { className: "browser-name", children: [
                                /* @__PURE__ */ c.jsx("strong", { children: a.name }),
                                /* @__PURE__ */ c.jsxs("small", { children: [
                                  "Annotation ",
                                  a.annotation_id
                                ] })
                              ] }),
                              /* @__PURE__ */ c.jsx("span", { className: "browser-size", children: Do(a.size) }),
                              /* @__PURE__ */ c.jsx(
                                "button",
                                {
                                  className: "browser-more",
                                  "aria-label": `Actions for ${a.name}`,
                                  onClick: (h) => ot(h, a.name, un(a)),
                                  children: /* @__PURE__ */ c.jsx(ze, { name: "more" })
                                }
                              )
                            ]
                          },
                          a.annotation_id
                        )) })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ c.jsx(
            "div",
            {
              className: "pane-resizer",
              role: "separator",
              "aria-label": "Resize project explorer",
              onMouseDown: Ls
            }
          ),
          je && /* @__PURE__ */ c.jsxs(
            "div",
            {
              className: "browser-context-menu",
              role: "menu",
              "aria-label": `Actions for ${je.title}`,
              style: { left: je.x, top: je.y },
              onClick: (a) => a.stopPropagation(),
              children: [
                /* @__PURE__ */ c.jsx("div", { className: "context-title", children: je.title }),
                je.actions.map((a) => /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    role: "menuitem",
                    className: a.danger ? "danger" : "",
                    onClick: () => {
                      Ie(null), a.run();
                    },
                    children: a.label
                  },
                  a.label
                ))
              ]
            }
          ),
          /* @__PURE__ */ c.jsxs("section", { className: "chat", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "messages", "aria-live": "polite", ref: no, children: [
              !He.messages.length && /* @__PURE__ */ c.jsxs("div", { className: "welcome", children: [
                /* @__PURE__ */ c.jsx("h2", { children: "What would you like to learn from these data?" }),
                /* @__PURE__ */ c.jsx("p", { children: "This named chat, its code, outputs, and reusable workflows are saved automatically in the browser project." }),
                De.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "suggested-prompts", children: [
                  /* @__PURE__ */ c.jsx("button", { onClick: () => pe("Summarize the available datasets, tables, columns, and important data-quality issues."), children: "Summarize these data" }),
                  /* @__PURE__ */ c.jsx("button", { onClick: () => pe("Find the most biologically meaningful differences and visualize them with reproducible plot data."), children: "Find meaningful differences" }),
                  /* @__PURE__ */ c.jsx("button", { onClick: () => pe("Explain the CI Segmentation schema and suggest three safe analyses for these measurements."), children: "Explore the measurement schema" })
                ] })
              ] }),
              He.messages.map((a) => {
                var h;
                if (a.kind === "execution" && a.executionId) {
                  const w = p.executions.find((I) => I.id === a.executionId);
                  return w ? /* @__PURE__ */ c.jsx(
                    Kh,
                    {
                      execution: w,
                      files: p.files,
                      onSave: () => void bs(w),
                      onRerun: () => void Lr(w)
                    },
                    a.id
                  ) : null;
                }
                return /* @__PURE__ */ c.jsxs("article", { className: `message ${a.role} ${a.kind || ""}`, children: [
                  /* @__PURE__ */ c.jsxs("span", { children: [
                    a.role,
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        className: "pin-message",
                        "aria-label": `${(He.pinnedMessageIds || []).includes(a.id) ? "Unpin" : "Pin"} message`,
                        onClick: () => Pr(He, a.id),
                        children: (He.pinnedMessageIds || []).includes(a.id) ? "★" : "☆"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ c.jsx("p", { children: a.content }),
                  (h = a.citationIds) != null && h.length ? /* @__PURE__ */ c.jsx("div", { className: "message-citations", "aria-label": "Evidence used for this answer", children: a.citationIds.map((w, I) => {
                    const E = p.executions.find((z) => z.id === w), P = E == null ? void 0 : E.outputFileIds.find(
                      (z) => p.files.some((U) => U.id === z && !U.deletedAt)
                    );
                    return /* @__PURE__ */ c.jsxs(
                      "button",
                      {
                        title: `Open local execution ${w.slice(0, 8)}`,
                        onClick: () => {
                          P && ve(P), j(!0);
                        },
                        children: [
                          "Evidence ",
                          I + 1
                        ]
                      },
                      w
                    );
                  }) }) : null
                ] }, a.id);
              }),
              fe && /* @__PURE__ */ c.jsxs("article", { className: "message assistant streaming", children: [
                /* @__PURE__ */ c.jsxs("span", { children: [
                  "assistant · ",
                  Q
                ] }),
                /* @__PURE__ */ c.jsxs("p", { children: [
                  fe,
                  /* @__PURE__ */ c.jsx("i", { className: "stream-caret" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsx(
              Yh,
              {
                runtimeReady: Oe,
                runtimeProgress: Sr,
                status: ie,
                usage: jr,
                settings: ye,
                blocked: Zn.length > 0,
                canChat: Wo,
                composerPlaceholder: $s,
                prompt: ke,
                busy: Se,
                onPromptChange: pe,
                onSend: () => void uo(),
                onStop: oa,
                onReset: () => void gt(p.files, "Python state reset; inputs restored")
              }
            )
          ] }),
          /* @__PURE__ */ c.jsx(
            Gh,
            {
              open: K,
              file: bo,
              profiles: De,
              canUpload: l.canUpload,
              onToggle: () => j((a) => !a),
              onDownload: Un,
              onAttach: (a) => void $e(a)
            }
          )
        ]
      }
    )
  ] });
  async function zr(a, h) {
    const w = y.current;
    if (!h || !w) return;
    if (h.size > jd) {
      M(`${h.name} exceeds the 256 MiB file limit`);
      return;
    }
    const I = await h.arrayBuffer(), E = {
      ...a,
      name: h.name,
      type: h.type || Md(h.name),
      size: I.byteLength,
      sha256: await On(I),
      data: I,
      state: "ready",
      error: void 0
    }, P = w.files.map((z) => z.id === a.id ? E : z);
    Ft([E]), await gt(P, "Missing local input restored");
  }
  async function Lr(a) {
    if (!(!Oe || Se)) {
      de(!0), pt.current.clear(), await u.beginTurn();
      try {
        await an(a.code, a.chatId, qe(), !0), M("Python rerun completed");
      } finally {
        de(!1);
      }
    }
  }
}
function ze({ name: s, className: l = "" }) {
  const u = {
    folder: /* @__PURE__ */ c.jsx("path", { d: "M2.5 6.5h8.1l2.35-3h6.55v15H2.5z" }),
    file: /* @__PURE__ */ c.jsx("path", { d: "M5 2.5h8l4 4v15H5zm8 0v4h4M8 11h6M8 15h6" }),
    image: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "1.5" }),
      /* @__PURE__ */ c.jsx("circle", { cx: "9", cy: "9", r: "1.5" }),
      /* @__PURE__ */ c.jsx("path", { d: "m5 18 5-5 3 3 2-2 4 4" })
    ] }),
    root: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("path", { d: "m3 11 9-7 9 7" }),
      /* @__PURE__ */ c.jsx("path", { d: "M5.5 10v10h13V10M10 20v-6h4v6" })
    ] }),
    up: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("path", { d: "m7 10 5-5 5 5" }),
      /* @__PURE__ */ c.jsx("path", { d: "M12 5v13" })
    ] }),
    upload: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("path", { d: "M4 16v4h16v-4" }),
      /* @__PURE__ */ c.jsx("path", { d: "M12 16V4m-5 5 5-5 5 5" })
    ] }),
    refresh: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("path", { d: "M20 7V3l-3 3a8 8 0 1 0 2.2 8" }),
      /* @__PURE__ */ c.jsx("path", { d: "M20 3h-5" })
    ] }),
    collapse: /* @__PURE__ */ c.jsx(c.Fragment, { children: /* @__PURE__ */ c.jsx("path", { d: "m7 9 5-5 5 5M7 15l5 5 5-5" }) }),
    chevron: /* @__PURE__ */ c.jsx("path", { d: "m9 5 7 7-7 7" }),
    more: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
      /* @__PURE__ */ c.jsx("circle", { cx: "12", cy: "5", r: "1.4", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ c.jsx("circle", { cx: "12", cy: "12", r: "1.4", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ c.jsx("circle", { cx: "12", cy: "19", r: "1.4", fill: "currentColor", stroke: "none" })
    ] })
  };
  return /* @__PURE__ */ c.jsx(
    "svg",
    {
      className: `ui-icon icon-${s} ${l}`.trim(),
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      fill: s === "folder" ? "currentColor" : "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: u[s]
    }
  );
}
const rf = document.getElementById("root"), Fd = document.getElementById("omero-analysis-chat-context"), rn = (s) => rf.dataset[s] || "", qi = window.OMERO_ANALYSIS_CHAT;
window.OMERO_ANALYSIS_CHAT = qi != null && qi.runtimeBase ? qi : {
  context: Fd ? JSON.parse(Fd.textContent || "null") : null,
  tokenUrl: rn("tokenUrl"),
  contextTemplate: rn("contextTemplate"),
  attachmentsTemplate: rn("attachmentsTemplate"),
  hierarchyTemplate: rn("hierarchyTemplate"),
  downloadTemplate: rn("downloadTemplate"),
  uploadTemplate: rn("uploadTemplate"),
  snapshotsTemplate: rn("snapshotsTemplate"),
  snapshotUploadTemplate: rn("snapshotUploadTemplate"),
  snapshotDownloadTemplate: rn("snapshotDownloadTemplate"),
  workflowTemplatesTemplate: rn("workflowTemplatesTemplate"),
  workflowDownloadTemplate: rn("workflowDownloadTemplate"),
  runtimeBase: rn("runtimeBase").replace(/ASSET$/, "")
};
Vp.createRoot(rf).render(
  /* @__PURE__ */ c.jsx(Lp.StrictMode, { children: /* @__PURE__ */ c.jsx(rm, {}) })
);
