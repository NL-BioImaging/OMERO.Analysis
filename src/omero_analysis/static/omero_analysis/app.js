var Ph = Object.defineProperty;
var $h = (r, o, i) => o in r ? Ph(r, o, { enumerable: !0, configurable: !0, writable: !0, value: i }) : r[o] = i;
var nr = (r, o, i) => $h(r, typeof o != "symbol" ? o + "" : o, i);
function cf(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var Uc = { exports: {} }, ji = {}, Vc = { exports: {} }, ze = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var wp;
function Rh() {
  if (wp) return ze;
  wp = 1;
  var r = Symbol.for("react.element"), o = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), p = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), v = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), _ = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), E = Symbol.iterator;
  function T(C) {
    return C === null || typeof C != "object" ? null : (C = E && C[E] || C["@@iterator"], typeof C == "function" ? C : null);
  }
  var W = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, V = Object.assign, z = {};
  function J(C, F, xe) {
    this.props = C, this.context = F, this.refs = z, this.updater = xe || W;
  }
  J.prototype.isReactComponent = {}, J.prototype.setState = function(C, F) {
    if (typeof C != "object" && typeof C != "function" && C != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, C, F, "setState");
  }, J.prototype.forceUpdate = function(C) {
    this.updater.enqueueForceUpdate(this, C, "forceUpdate");
  };
  function Te() {
  }
  Te.prototype = J.prototype;
  function de(C, F, xe) {
    this.props = C, this.context = F, this.refs = z, this.updater = xe || W;
  }
  var fe = de.prototype = new Te();
  fe.constructor = de, V(fe, J.prototype), fe.isPureReactComponent = !0;
  var ae = Array.isArray, Ne = Object.prototype.hasOwnProperty, ge = { current: null }, Ce = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ue(C, F, xe) {
    var we, me = {}, _e = null, Ue = null;
    if (F != null) for (we in F.ref !== void 0 && (Ue = F.ref), F.key !== void 0 && (_e = "" + F.key), F) Ne.call(F, we) && !Ce.hasOwnProperty(we) && (me[we] = F[we]);
    var Oe = arguments.length - 2;
    if (Oe === 1) me.children = xe;
    else if (1 < Oe) {
      for (var Ze = Array(Oe), Je = 0; Je < Oe; Je++) Ze[Je] = arguments[Je + 2];
      me.children = Ze;
    }
    if (C && C.defaultProps) for (we in Oe = C.defaultProps, Oe) me[we] === void 0 && (me[we] = Oe[we]);
    return { $$typeof: r, type: C, key: _e, ref: Ue, props: me, _owner: ge.current };
  }
  function he(C, F) {
    return { $$typeof: r, type: C.type, key: F, ref: C.ref, props: C.props, _owner: C._owner };
  }
  function Re(C) {
    return typeof C == "object" && C !== null && C.$$typeof === r;
  }
  function Le(C) {
    var F = { "=": "=0", ":": "=2" };
    return "$" + C.replace(/[=:]/g, function(xe) {
      return F[xe];
    });
  }
  var ke = /\/+/g;
  function D(C, F) {
    return typeof C == "object" && C !== null && C.key != null ? Le("" + C.key) : F.toString(36);
  }
  function Se(C, F, xe, we, me) {
    var _e = typeof C;
    (_e === "undefined" || _e === "boolean") && (C = null);
    var Ue = !1;
    if (C === null) Ue = !0;
    else switch (_e) {
      case "string":
      case "number":
        Ue = !0;
        break;
      case "object":
        switch (C.$$typeof) {
          case r:
          case o:
            Ue = !0;
        }
    }
    if (Ue) return Ue = C, me = me(Ue), C = we === "" ? "." + D(Ue, 0) : we, ae(me) ? (xe = "", C != null && (xe = C.replace(ke, "$&/") + "/"), Se(me, F, xe, "", function(Je) {
      return Je;
    })) : me != null && (Re(me) && (me = he(me, xe + (!me.key || Ue && Ue.key === me.key ? "" : ("" + me.key).replace(ke, "$&/") + "/") + C)), F.push(me)), 1;
    if (Ue = 0, we = we === "" ? "." : we + ":", ae(C)) for (var Oe = 0; Oe < C.length; Oe++) {
      _e = C[Oe];
      var Ze = we + D(_e, Oe);
      Ue += Se(_e, F, xe, Ze, me);
    }
    else if (Ze = T(C), typeof Ze == "function") for (C = Ze.call(C), Oe = 0; !(_e = C.next()).done; ) _e = _e.value, Ze = we + D(_e, Oe++), Ue += Se(_e, F, xe, Ze, me);
    else if (_e === "object") throw F = String(C), Error("Objects are not valid as a React child (found: " + (F === "[object Object]" ? "object with keys {" + Object.keys(C).join(", ") + "}" : F) + "). If you meant to render a collection of children, use an array instead.");
    return Ue;
  }
  function De(C, F, xe) {
    if (C == null) return C;
    var we = [], me = 0;
    return Se(C, we, "", "", function(_e) {
      return F.call(xe, _e, me++);
    }), we;
  }
  function Pe(C) {
    if (C._status === -1) {
      var F = C._result;
      F = F(), F.then(function(xe) {
        (C._status === 0 || C._status === -1) && (C._status = 1, C._result = xe);
      }, function(xe) {
        (C._status === 0 || C._status === -1) && (C._status = 2, C._result = xe);
      }), C._status === -1 && (C._status = 0, C._result = F);
    }
    if (C._status === 1) return C._result.default;
    throw C._result;
  }
  var Ae = { current: null }, Q = { transition: null }, re = { ReactCurrentDispatcher: Ae, ReactCurrentBatchConfig: Q, ReactCurrentOwner: ge };
  function ne() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ze.Children = { map: De, forEach: function(C, F, xe) {
    De(C, function() {
      F.apply(this, arguments);
    }, xe);
  }, count: function(C) {
    var F = 0;
    return De(C, function() {
      F++;
    }), F;
  }, toArray: function(C) {
    return De(C, function(F) {
      return F;
    }) || [];
  }, only: function(C) {
    if (!Re(C)) throw Error("React.Children.only expected to receive a single React element child.");
    return C;
  } }, ze.Component = J, ze.Fragment = i, ze.Profiler = p, ze.PureComponent = de, ze.StrictMode = c, ze.Suspense = S, ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = re, ze.act = ne, ze.cloneElement = function(C, F, xe) {
    if (C == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + C + ".");
    var we = V({}, C.props), me = C.key, _e = C.ref, Ue = C._owner;
    if (F != null) {
      if (F.ref !== void 0 && (_e = F.ref, Ue = ge.current), F.key !== void 0 && (me = "" + F.key), C.type && C.type.defaultProps) var Oe = C.type.defaultProps;
      for (Ze in F) Ne.call(F, Ze) && !Ce.hasOwnProperty(Ze) && (we[Ze] = F[Ze] === void 0 && Oe !== void 0 ? Oe[Ze] : F[Ze]);
    }
    var Ze = arguments.length - 2;
    if (Ze === 1) we.children = xe;
    else if (1 < Ze) {
      Oe = Array(Ze);
      for (var Je = 0; Je < Ze; Je++) Oe[Je] = arguments[Je + 2];
      we.children = Oe;
    }
    return { $$typeof: r, type: C.type, key: me, ref: _e, props: we, _owner: Ue };
  }, ze.createContext = function(C) {
    return C = { $$typeof: v, _currentValue: C, _currentValue2: C, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, C.Provider = { $$typeof: h, _context: C }, C.Consumer = C;
  }, ze.createElement = ue, ze.createFactory = function(C) {
    var F = ue.bind(null, C);
    return F.type = C, F;
  }, ze.createRef = function() {
    return { current: null };
  }, ze.forwardRef = function(C) {
    return { $$typeof: y, render: C };
  }, ze.isValidElement = Re, ze.lazy = function(C) {
    return { $$typeof: A, _payload: { _status: -1, _result: C }, _init: Pe };
  }, ze.memo = function(C, F) {
    return { $$typeof: _, type: C, compare: F === void 0 ? null : F };
  }, ze.startTransition = function(C) {
    var F = Q.transition;
    Q.transition = {};
    try {
      C();
    } finally {
      Q.transition = F;
    }
  }, ze.unstable_act = ne, ze.useCallback = function(C, F) {
    return Ae.current.useCallback(C, F);
  }, ze.useContext = function(C) {
    return Ae.current.useContext(C);
  }, ze.useDebugValue = function() {
  }, ze.useDeferredValue = function(C) {
    return Ae.current.useDeferredValue(C);
  }, ze.useEffect = function(C, F) {
    return Ae.current.useEffect(C, F);
  }, ze.useId = function() {
    return Ae.current.useId();
  }, ze.useImperativeHandle = function(C, F, xe) {
    return Ae.current.useImperativeHandle(C, F, xe);
  }, ze.useInsertionEffect = function(C, F) {
    return Ae.current.useInsertionEffect(C, F);
  }, ze.useLayoutEffect = function(C, F) {
    return Ae.current.useLayoutEffect(C, F);
  }, ze.useMemo = function(C, F) {
    return Ae.current.useMemo(C, F);
  }, ze.useReducer = function(C, F, xe) {
    return Ae.current.useReducer(C, F, xe);
  }, ze.useRef = function(C) {
    return Ae.current.useRef(C);
  }, ze.useState = function(C) {
    return Ae.current.useState(C);
  }, ze.useSyncExternalStore = function(C, F, xe) {
    return Ae.current.useSyncExternalStore(C, F, xe);
  }, ze.useTransition = function() {
    return Ae.current.useTransition();
  }, ze.version = "18.3.1", ze;
}
var kp;
function gu() {
  return kp || (kp = 1, Vc.exports = Rh()), Vc.exports;
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
var xp;
function Oh() {
  if (xp) return ji;
  xp = 1;
  var r = gu(), o = Symbol.for("react.element"), i = Symbol.for("react.fragment"), c = Object.prototype.hasOwnProperty, p = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, h = { key: !0, ref: !0, __self: !0, __source: !0 };
  function v(y, S, _) {
    var A, E = {}, T = null, W = null;
    _ !== void 0 && (T = "" + _), S.key !== void 0 && (T = "" + S.key), S.ref !== void 0 && (W = S.ref);
    for (A in S) c.call(S, A) && !h.hasOwnProperty(A) && (E[A] = S[A]);
    if (y && y.defaultProps) for (A in S = y.defaultProps, S) E[A] === void 0 && (E[A] = S[A]);
    return { $$typeof: o, type: y, key: T, ref: W, props: E, _owner: p.current };
  }
  return ji.Fragment = i, ji.jsx = v, ji.jsxs = v, ji;
}
var _p;
function Th() {
  return _p || (_p = 1, Uc.exports = Oh()), Uc.exports;
}
var d = Th(), te = gu();
const Mh = /* @__PURE__ */ cf(te);
var Wa = {}, Wc = { exports: {} }, Yt = {}, Bc = { exports: {} }, qc = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Sp;
function zh() {
  return Sp || (Sp = 1, (function(r) {
    function o(Q, re) {
      var ne = Q.length;
      Q.push(re);
      e: for (; 0 < ne; ) {
        var C = ne - 1 >>> 1, F = Q[C];
        if (0 < p(F, re)) Q[C] = re, Q[ne] = F, ne = C;
        else break e;
      }
    }
    function i(Q) {
      return Q.length === 0 ? null : Q[0];
    }
    function c(Q) {
      if (Q.length === 0) return null;
      var re = Q[0], ne = Q.pop();
      if (ne !== re) {
        Q[0] = ne;
        e: for (var C = 0, F = Q.length, xe = F >>> 1; C < xe; ) {
          var we = 2 * (C + 1) - 1, me = Q[we], _e = we + 1, Ue = Q[_e];
          if (0 > p(me, ne)) _e < F && 0 > p(Ue, me) ? (Q[C] = Ue, Q[_e] = ne, C = _e) : (Q[C] = me, Q[we] = ne, C = we);
          else if (_e < F && 0 > p(Ue, ne)) Q[C] = Ue, Q[_e] = ne, C = _e;
          else break e;
        }
      }
      return re;
    }
    function p(Q, re) {
      var ne = Q.sortIndex - re.sortIndex;
      return ne !== 0 ? ne : Q.id - re.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      r.unstable_now = function() {
        return h.now();
      };
    } else {
      var v = Date, y = v.now();
      r.unstable_now = function() {
        return v.now() - y;
      };
    }
    var S = [], _ = [], A = 1, E = null, T = 3, W = !1, V = !1, z = !1, J = typeof setTimeout == "function" ? setTimeout : null, Te = typeof clearTimeout == "function" ? clearTimeout : null, de = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function fe(Q) {
      for (var re = i(_); re !== null; ) {
        if (re.callback === null) c(_);
        else if (re.startTime <= Q) c(_), re.sortIndex = re.expirationTime, o(S, re);
        else break;
        re = i(_);
      }
    }
    function ae(Q) {
      if (z = !1, fe(Q), !V) if (i(S) !== null) V = !0, Pe(Ne);
      else {
        var re = i(_);
        re !== null && Ae(ae, re.startTime - Q);
      }
    }
    function Ne(Q, re) {
      V = !1, z && (z = !1, Te(ue), ue = -1), W = !0;
      var ne = T;
      try {
        for (fe(re), E = i(S); E !== null && (!(E.expirationTime > re) || Q && !Le()); ) {
          var C = E.callback;
          if (typeof C == "function") {
            E.callback = null, T = E.priorityLevel;
            var F = C(E.expirationTime <= re);
            re = r.unstable_now(), typeof F == "function" ? E.callback = F : E === i(S) && c(S), fe(re);
          } else c(S);
          E = i(S);
        }
        if (E !== null) var xe = !0;
        else {
          var we = i(_);
          we !== null && Ae(ae, we.startTime - re), xe = !1;
        }
        return xe;
      } finally {
        E = null, T = ne, W = !1;
      }
    }
    var ge = !1, Ce = null, ue = -1, he = 5, Re = -1;
    function Le() {
      return !(r.unstable_now() - Re < he);
    }
    function ke() {
      if (Ce !== null) {
        var Q = r.unstable_now();
        Re = Q;
        var re = !0;
        try {
          re = Ce(!0, Q);
        } finally {
          re ? D() : (ge = !1, Ce = null);
        }
      } else ge = !1;
    }
    var D;
    if (typeof de == "function") D = function() {
      de(ke);
    };
    else if (typeof MessageChannel < "u") {
      var Se = new MessageChannel(), De = Se.port2;
      Se.port1.onmessage = ke, D = function() {
        De.postMessage(null);
      };
    } else D = function() {
      J(ke, 0);
    };
    function Pe(Q) {
      Ce = Q, ge || (ge = !0, D());
    }
    function Ae(Q, re) {
      ue = J(function() {
        Q(r.unstable_now());
      }, re);
    }
    r.unstable_IdlePriority = 5, r.unstable_ImmediatePriority = 1, r.unstable_LowPriority = 4, r.unstable_NormalPriority = 3, r.unstable_Profiling = null, r.unstable_UserBlockingPriority = 2, r.unstable_cancelCallback = function(Q) {
      Q.callback = null;
    }, r.unstable_continueExecution = function() {
      V || W || (V = !0, Pe(Ne));
    }, r.unstable_forceFrameRate = function(Q) {
      0 > Q || 125 < Q ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : he = 0 < Q ? Math.floor(1e3 / Q) : 5;
    }, r.unstable_getCurrentPriorityLevel = function() {
      return T;
    }, r.unstable_getFirstCallbackNode = function() {
      return i(S);
    }, r.unstable_next = function(Q) {
      switch (T) {
        case 1:
        case 2:
        case 3:
          var re = 3;
          break;
        default:
          re = T;
      }
      var ne = T;
      T = re;
      try {
        return Q();
      } finally {
        T = ne;
      }
    }, r.unstable_pauseExecution = function() {
    }, r.unstable_requestPaint = function() {
    }, r.unstable_runWithPriority = function(Q, re) {
      switch (Q) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Q = 3;
      }
      var ne = T;
      T = Q;
      try {
        return re();
      } finally {
        T = ne;
      }
    }, r.unstable_scheduleCallback = function(Q, re, ne) {
      var C = r.unstable_now();
      switch (typeof ne == "object" && ne !== null ? (ne = ne.delay, ne = typeof ne == "number" && 0 < ne ? C + ne : C) : ne = C, Q) {
        case 1:
          var F = -1;
          break;
        case 2:
          F = 250;
          break;
        case 5:
          F = 1073741823;
          break;
        case 4:
          F = 1e4;
          break;
        default:
          F = 5e3;
      }
      return F = ne + F, Q = { id: A++, callback: re, priorityLevel: Q, startTime: ne, expirationTime: F, sortIndex: -1 }, ne > C ? (Q.sortIndex = ne, o(_, Q), i(S) === null && Q === i(_) && (z ? (Te(ue), ue = -1) : z = !0, Ae(ae, ne - C))) : (Q.sortIndex = F, o(S, Q), V || W || (V = !0, Pe(Ne))), Q;
    }, r.unstable_shouldYield = Le, r.unstable_wrapCallback = function(Q) {
      var re = T;
      return function() {
        var ne = T;
        T = re;
        try {
          return Q.apply(this, arguments);
        } finally {
          T = ne;
        }
      };
    };
  })(qc)), qc;
}
var bp;
function Lh() {
  return bp || (bp = 1, Bc.exports = zh()), Bc.exports;
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
var jp;
function Fh() {
  if (jp) return Yt;
  jp = 1;
  var r = gu(), o = Lh();
  function i(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var c = /* @__PURE__ */ new Set(), p = {};
  function h(e, t) {
    v(e, t), v(e + "Capture", t);
  }
  function v(e, t) {
    for (p[e] = t, e = 0; e < t.length; e++) c.add(t[e]);
  }
  var y = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), S = Object.prototype.hasOwnProperty, _ = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, A = {}, E = {};
  function T(e) {
    return S.call(E, e) ? !0 : S.call(A, e) ? !1 : _.test(e) ? E[e] = !0 : (A[e] = !0, !1);
  }
  function W(e, t, n, s) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return s ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function V(e, t, n, s) {
    if (t === null || typeof t > "u" || W(e, t, n, s)) return !0;
    if (s) return !1;
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
  function z(e, t, n, s, l, u, m) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = s, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = u, this.removeEmptyString = m;
  }
  var J = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    J[e] = new z(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    J[t] = new z(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    J[e] = new z(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    J[e] = new z(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    J[e] = new z(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    J[e] = new z(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    J[e] = new z(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    J[e] = new z(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    J[e] = new z(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Te = /[\-:]([a-z])/g;
  function de(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Te,
      de
    );
    J[t] = new z(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Te, de);
    J[t] = new z(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Te, de);
    J[t] = new z(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    J[e] = new z(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), J.xlinkHref = new z("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    J[e] = new z(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function fe(e, t, n, s) {
    var l = J.hasOwnProperty(t) ? J[t] : null;
    (l !== null ? l.type !== 0 : s || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (V(t, n, l, s) && (n = null), s || l === null ? T(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, s = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, s ? e.setAttributeNS(s, t, n) : e.setAttribute(t, n))));
  }
  var ae = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ne = Symbol.for("react.element"), ge = Symbol.for("react.portal"), Ce = Symbol.for("react.fragment"), ue = Symbol.for("react.strict_mode"), he = Symbol.for("react.profiler"), Re = Symbol.for("react.provider"), Le = Symbol.for("react.context"), ke = Symbol.for("react.forward_ref"), D = Symbol.for("react.suspense"), Se = Symbol.for("react.suspense_list"), De = Symbol.for("react.memo"), Pe = Symbol.for("react.lazy"), Ae = Symbol.for("react.offscreen"), Q = Symbol.iterator;
  function re(e) {
    return e === null || typeof e != "object" ? null : (e = Q && e[Q] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var ne = Object.assign, C;
  function F(e) {
    if (C === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      C = t && t[1] || "";
    }
    return `
` + C + e;
  }
  var xe = !1;
  function we(e, t) {
    if (!e || xe) return "";
    xe = !0;
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
        } catch (O) {
          var s = O;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (O) {
          s = O;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (O) {
          s = O;
        }
        e();
      }
    } catch (O) {
      if (O && s && typeof O.stack == "string") {
        for (var l = O.stack.split(`
`), u = s.stack.split(`
`), m = l.length - 1, b = u.length - 1; 1 <= m && 0 <= b && l[m] !== u[b]; ) b--;
        for (; 1 <= m && 0 <= b; m--, b--) if (l[m] !== u[b]) {
          if (m !== 1 || b !== 1)
            do
              if (m--, b--, 0 > b || l[m] !== u[b]) {
                var N = `
` + l[m].replace(" at new ", " at ");
                return e.displayName && N.includes("<anonymous>") && (N = N.replace("<anonymous>", e.displayName)), N;
              }
            while (1 <= m && 0 <= b);
          break;
        }
      }
    } finally {
      xe = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? F(e) : "";
  }
  function me(e) {
    switch (e.tag) {
      case 5:
        return F(e.type);
      case 16:
        return F("Lazy");
      case 13:
        return F("Suspense");
      case 19:
        return F("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = we(e.type, !1), e;
      case 11:
        return e = we(e.type.render, !1), e;
      case 1:
        return e = we(e.type, !0), e;
      default:
        return "";
    }
  }
  function _e(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Ce:
        return "Fragment";
      case ge:
        return "Portal";
      case he:
        return "Profiler";
      case ue:
        return "StrictMode";
      case D:
        return "Suspense";
      case Se:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Le:
        return (e.displayName || "Context") + ".Consumer";
      case Re:
        return (e._context.displayName || "Context") + ".Provider";
      case ke:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case De:
        return t = e.displayName || null, t !== null ? t : _e(e.type) || "Memo";
      case Pe:
        t = e._payload, e = e._init;
        try {
          return _e(e(t));
        } catch {
        }
    }
    return null;
  }
  function Ue(e) {
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
        return _e(t);
      case 8:
        return t === ue ? "StrictMode" : "Mode";
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
  function Oe(e) {
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
  function Ze(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Je(e) {
    var t = Ze(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), s = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var l = n.get, u = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(m) {
        s = "" + m, u.call(this, m);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return s;
      }, setValue: function(m) {
        s = "" + m;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function zt(e) {
    e._valueTracker || (e._valueTracker = Je(e));
  }
  function hn(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), s = "";
    return e && (s = Ze(e) ? e.checked ? "true" : "false" : e.value), e = s, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Wt(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function tn(e, t) {
    var n = t.checked;
    return ne({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Ps(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, s = t.checked != null ? t.checked : t.defaultChecked;
    n = Oe(t.value != null ? t.value : n), e._wrapperState = { initialChecked: s, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Cr(e, t) {
    t = t.checked, t != null && fe(e, "checked", t, !1);
  }
  function ut(e, t) {
    Cr(e, t);
    var n = Oe(t.value), s = t.type;
    if (n != null) s === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (s === "submit" || s === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Rs(e, t.type, n) : t.hasOwnProperty("defaultValue") && Rs(e, t.type, Oe(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function $s(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var s = t.type;
      if (!(s !== "submit" && s !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Rs(e, t, n) {
    (t !== "number" || Wt(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Nr = Array.isArray;
  function Ar(e, t, n, s) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && s && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Oe(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, s && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Os(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(i(91));
    return ne({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Mi(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(i(92));
        if (Nr(n)) {
          if (1 < n.length) throw Error(i(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: Oe(n) };
  }
  function Bo(e, t) {
    var n = Oe(t.value), s = Oe(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), s != null && (e.defaultValue = "" + s);
  }
  function zi(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Ts(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function se(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Ts(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var nn, uo = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, s, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, s, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (nn = nn || document.createElement("div"), nn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = nn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Dn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var ar = {
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
  }, Li = ["Webkit", "ms", "Moz", "O"];
  Object.keys(ar).forEach(function(e) {
    Li.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), ar[t] = ar[e];
    });
  });
  function po(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || ar.hasOwnProperty(e) && ar[e] ? ("" + t).trim() : t + "px";
  }
  function mn(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var s = n.indexOf("--") === 0, l = po(n, t[n], s);
      n === "float" && (n = "cssFloat"), s ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Ir = ne({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Pr(e, t) {
    if (t) {
      if (Ir[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(i(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(i(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(i(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(i(62));
    }
  }
  function fo(e, t) {
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
  var yn = null;
  function lr(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Ms = null, Un = null, Nn = null;
  function zs(e) {
    if (e = ui(e)) {
      if (typeof Ms != "function") throw Error(i(280));
      var t = e.stateNode;
      t && (t = oa(t), Ms(e.stateNode, e.type, t));
    }
  }
  function $r(e) {
    Un ? Nn ? Nn.push(e) : Nn = [e] : Un = e;
  }
  function cr() {
    if (Un) {
      var e = Un, t = Nn;
      if (Nn = Un = null, zs(e), t) for (e = 0; e < t.length; e++) zs(t[e]);
    }
  }
  function Fi(e, t) {
    return e(t);
  }
  function qo() {
  }
  var ho = !1;
  function Vn(e, t, n) {
    if (ho) return e(t, n);
    ho = !0;
    try {
      return Fi(e, t, n);
    } finally {
      ho = !1, (Un !== null || Nn !== null) && (qo(), cr());
    }
  }
  function ur(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var s = oa(n);
    if (s === null) return null;
    n = s[t];
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
        (s = !s.disabled) || (e = e.type, s = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !s;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(i(231, t, typeof n));
    return n;
  }
  var Rr = !1;
  if (y) try {
    var vn = {};
    Object.defineProperty(vn, "passive", { get: function() {
      Rr = !0;
    } }), window.addEventListener("test", vn, vn), window.removeEventListener("test", vn, vn);
  } catch {
    Rr = !1;
  }
  function Di(e, t, n, s, l, u, m, b, N) {
    var O = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, O);
    } catch (H) {
      this.onError(H);
    }
  }
  var Wn = !1, Bn = null, Or = !1, Lt = null, Ct = { onError: function(e) {
    Wn = !0, Bn = e;
  } };
  function qn(e, t, n, s, l, u, m, b, N) {
    Wn = !1, Bn = null, Di.apply(Ct, arguments);
  }
  function $e(e, t, n, s, l, u, m, b, N) {
    if (qn.apply(this, arguments), Wn) {
      if (Wn) {
        var O = Bn;
        Wn = !1, Bn = null;
      } else throw Error(i(198));
      Or || (Or = !0, Lt = O);
    }
  }
  function Nt(e) {
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
  function dt(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function dr(e) {
    if (Nt(e) !== e) throw Error(i(188));
  }
  function mo(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Nt(e), t === null) throw Error(i(188));
      return t !== e ? null : e;
    }
    for (var n = e, s = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var u = l.alternate;
      if (u === null) {
        if (s = l.return, s !== null) {
          n = s;
          continue;
        }
        break;
      }
      if (l.child === u.child) {
        for (u = l.child; u; ) {
          if (u === n) return dr(l), e;
          if (u === s) return dr(l), t;
          u = u.sibling;
        }
        throw Error(i(188));
      }
      if (n.return !== s.return) n = l, s = u;
      else {
        for (var m = !1, b = l.child; b; ) {
          if (b === n) {
            m = !0, n = l, s = u;
            break;
          }
          if (b === s) {
            m = !0, s = l, n = u;
            break;
          }
          b = b.sibling;
        }
        if (!m) {
          for (b = u.child; b; ) {
            if (b === n) {
              m = !0, n = u, s = l;
              break;
            }
            if (b === s) {
              m = !0, s = u, n = l;
              break;
            }
            b = b.sibling;
          }
          if (!m) throw Error(i(189));
        }
      }
      if (n.alternate !== s) throw Error(i(190));
    }
    if (n.tag !== 3) throw Error(i(188));
    return n.stateNode.current === n ? e : t;
  }
  function Ls(e) {
    return e = mo(e), e !== null ? Fs(e) : null;
  }
  function Fs(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Fs(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ds = o.unstable_scheduleCallback, Us = o.unstable_cancelCallback, Zo = o.unstable_shouldYield, Vs = o.unstable_requestPaint, Ke = o.unstable_now, rn = o.unstable_getCurrentPriorityLevel, Ho = o.unstable_ImmediatePriority, pr = o.unstable_UserBlockingPriority, yo = o.unstable_NormalPriority, il = o.unstable_LowPriority, Ko = o.unstable_IdlePriority, Qo = null, on = null;
  function An(e) {
    if (on && typeof on.onCommitFiberRoot == "function") try {
      on.onCommitFiberRoot(Qo, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var At = Math.clz32 ? Math.clz32 : al, Tr = Math.log, Bt = Math.LN2;
  function al(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Tr(e) / Bt | 0) | 0;
  }
  var Zn = 64, It = 4194304;
  function vo(e) {
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
  function Hn(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var s = 0, l = e.suspendedLanes, u = e.pingedLanes, m = n & 268435455;
    if (m !== 0) {
      var b = m & ~l;
      b !== 0 ? s = vo(b) : (u &= m, u !== 0 && (s = vo(u)));
    } else m = n & ~l, m !== 0 ? s = vo(m) : u !== 0 && (s = vo(u));
    if (s === 0) return 0;
    if (t !== 0 && t !== s && (t & l) === 0 && (l = s & -s, u = t & -t, l >= u || l === 16 && (u & 4194240) !== 0)) return t;
    if ((s & 4) !== 0 && (s |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= s; 0 < t; ) n = 31 - At(t), l = 1 << n, s |= e[n], t &= ~l;
    return s;
  }
  function Ws(e, t) {
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
  function Kn(e, t) {
    for (var n = e.suspendedLanes, s = e.pingedLanes, l = e.expirationTimes, u = e.pendingLanes; 0 < u; ) {
      var m = 31 - At(u), b = 1 << m, N = l[m];
      N === -1 ? ((b & n) === 0 || (b & s) !== 0) && (l[m] = Ws(b, t)) : N <= t && (e.expiredLanes |= b), u &= ~b;
    }
  }
  function Bs(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function qs() {
    var e = Zn;
    return Zn <<= 1, (Zn & 4194240) === 0 && (Zn = 64), e;
  }
  function Zs(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function go(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - At(t), e[t] = n;
  }
  function Jo(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var s = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - At(n), u = 1 << l;
      t[l] = 0, s[l] = -1, e[l] = -1, n &= ~u;
    }
  }
  function Go(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var s = 31 - At(n), l = 1 << s;
      l & t | e[s] & t && (e[s] |= t), n &= ~l;
    }
  }
  var He = 0;
  function Ui(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Hs, Ks, Vi, Xo, Mr, wo = !1, it = [], Qn = null, Jn = null, gn = null, zr = /* @__PURE__ */ new Map(), In = /* @__PURE__ */ new Map(), Pn = [], ll = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ko(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Qn = null;
        break;
      case "dragenter":
      case "dragleave":
        Jn = null;
        break;
      case "mouseover":
      case "mouseout":
        gn = null;
        break;
      case "pointerover":
      case "pointerout":
        zr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        In.delete(t.pointerId);
    }
  }
  function Lr(e, t, n, s, l, u) {
    return e === null || e.nativeEvent !== u ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: s, nativeEvent: u, targetContainers: [l] }, t !== null && (t = ui(t), t !== null && Ks(t)), e) : (e.eventSystemFlags |= s, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function cl(e, t, n, s, l) {
    switch (t) {
      case "focusin":
        return Qn = Lr(Qn, e, t, n, s, l), !0;
      case "dragenter":
        return Jn = Lr(Jn, e, t, n, s, l), !0;
      case "mouseover":
        return gn = Lr(gn, e, t, n, s, l), !0;
      case "pointerover":
        var u = l.pointerId;
        return zr.set(u, Lr(zr.get(u) || null, e, t, n, s, l)), !0;
      case "gotpointercapture":
        return u = l.pointerId, In.set(u, Lr(In.get(u) || null, e, t, n, s, l)), !0;
    }
    return !1;
  }
  function Qs(e) {
    var t = Io(e.target);
    if (t !== null) {
      var n = Nt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = dt(n), t !== null) {
            e.blockedOn = t, Mr(e.priority, function() {
              Vi(n);
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
  function xo(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Js(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var s = new n.constructor(n.type, n);
        yn = s, n.target.dispatchEvent(s), yn = null;
      } else return t = ui(n), t !== null && Ks(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Fr(e, t, n) {
    xo(e) && n.delete(t);
  }
  function Wi() {
    wo = !1, Qn !== null && xo(Qn) && (Qn = null), Jn !== null && xo(Jn) && (Jn = null), gn !== null && xo(gn) && (gn = null), zr.forEach(Fr), In.forEach(Fr);
  }
  function fr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, wo || (wo = !0, o.unstable_scheduleCallback(o.unstable_NormalPriority, Wi)));
  }
  function _o(e) {
    function t(l) {
      return fr(l, e);
    }
    if (0 < it.length) {
      fr(it[0], e);
      for (var n = 1; n < it.length; n++) {
        var s = it[n];
        s.blockedOn === e && (s.blockedOn = null);
      }
    }
    for (Qn !== null && fr(Qn, e), Jn !== null && fr(Jn, e), gn !== null && fr(gn, e), zr.forEach(t), In.forEach(t), n = 0; n < Pn.length; n++) s = Pn[n], s.blockedOn === e && (s.blockedOn = null);
    for (; 0 < Pn.length && (n = Pn[0], n.blockedOn === null); ) Qs(n), n.blockedOn === null && Pn.shift();
  }
  var Dr = ae.ReactCurrentBatchConfig, Yo = !0;
  function ul(e, t, n, s) {
    var l = He, u = Dr.transition;
    Dr.transition = null;
    try {
      He = 1, es(e, t, n, s);
    } finally {
      He = l, Dr.transition = u;
    }
  }
  function dl(e, t, n, s) {
    var l = He, u = Dr.transition;
    Dr.transition = null;
    try {
      He = 4, es(e, t, n, s);
    } finally {
      He = l, Dr.transition = u;
    }
  }
  function es(e, t, n, s) {
    if (Yo) {
      var l = Js(e, t, n, s);
      if (l === null) Pl(e, t, s, ts, n), ko(e, s);
      else if (cl(l, e, t, n, s)) s.stopPropagation();
      else if (ko(e, s), t & 4 && -1 < ll.indexOf(e)) {
        for (; l !== null; ) {
          var u = ui(l);
          if (u !== null && Hs(u), u = Js(e, t, n, s), u === null && Pl(e, t, s, ts, n), u === l) break;
          l = u;
        }
        l !== null && s.stopPropagation();
      } else Pl(e, t, s, null, n);
    }
  }
  var ts = null;
  function Js(e, t, n, s) {
    if (ts = null, e = lr(s), e = Io(e), e !== null) if (t = Nt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = dt(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return ts = e, null;
  }
  function Bi(e) {
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
        switch (rn()) {
          case Ho:
            return 1;
          case pr:
            return 4;
          case yo:
          case il:
            return 16;
          case Ko:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Gn = null, Gs = null, ns = null;
  function Xs() {
    if (ns) return ns;
    var e, t = Gs, n = t.length, s, l = "value" in Gn ? Gn.value : Gn.textContent, u = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var m = n - e;
    for (s = 1; s <= m && t[n - s] === l[u - s]; s++) ;
    return ns = l.slice(e, 1 < s ? 1 - s : void 0);
  }
  function So(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ur() {
    return !0;
  }
  function Ys() {
    return !1;
  }
  function Pt(e) {
    function t(n, s, l, u, m) {
      this._reactName = n, this._targetInst = l, this.type = s, this.nativeEvent = u, this.target = m, this.currentTarget = null;
      for (var b in e) e.hasOwnProperty(b) && (n = e[b], this[b] = n ? n(u) : u[b]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Ur : Ys, this.isPropagationStopped = Ys, this;
    }
    return ne(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Ur);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Ur);
    }, persist: function() {
    }, isPersistent: Ur }), t;
  }
  var hr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, rs = Pt(hr), mr = ne({}, hr, { view: 0, detail: 0 }), pl = Pt(mr), Vr, bo, jo, Eo = ne({}, mr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Wr, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== jo && (jo && e.type === "mousemove" ? (Vr = e.screenX - jo.screenX, bo = e.screenY - jo.screenY) : bo = Vr = 0, jo = e), Vr);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : bo;
  } }), ei = Pt(Eo), fl = ne({}, Eo, { dataTransfer: 0 }), hl = Pt(fl), ml = ne({}, mr, { relatedTarget: 0 }), ti = Pt(ml), qi = ne({}, hr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Zi = Pt(qi), Hi = ne({}, hr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), ni = Pt(Hi), yl = ne({}, hr, { data: 0 }), Ki = Pt(yl), vl = {
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
  }, gl = {
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
  }, wl = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Qi(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = wl[e]) ? !!t[e] : !1;
  }
  function Wr() {
    return Qi;
  }
  var kl = ne({}, mr, { key: function(e) {
    if (e.key) {
      var t = vl[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = So(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? gl[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Wr, charCode: function(e) {
    return e.type === "keypress" ? So(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? So(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), xl = Pt(kl), a = ne({}, Eo, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), f = Pt(a), g = ne({}, mr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Wr }), w = Pt(g), x = ne({}, hr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), j = Pt(x), k = ne({}, Eo, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), P = Pt(k), B = [9, 13, 27, 32], L = y && "CompositionEvent" in window, U = null;
  y && "documentMode" in document && (U = document.documentMode);
  var Y = y && "TextEvent" in window && !U, Z = y && (!L || U && 8 < U && 11 >= U), M = " ", ee = !1;
  function X(e, t) {
    switch (e) {
      case "keyup":
        return B.indexOf(t.keyCode) !== -1;
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
  function Ve(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Me = !1;
  function ht(e, t) {
    switch (e) {
      case "compositionend":
        return Ve(t);
      case "keypress":
        return t.which !== 32 ? null : (ee = !0, M);
      case "textInput":
        return e = t.data, e === M && ee ? null : e;
      default:
        return null;
    }
  }
  function Fe(e, t) {
    if (Me) return e === "compositionend" || !L && X(e, t) ? (e = Xs(), ns = Gs = Gn = null, Me = !1, e) : null;
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
        return Z && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var qt = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ie(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!qt[e.type] : t === "textarea";
  }
  function Ge(e, t, n, s) {
    $r(s), t = ta(t, "onChange"), 0 < t.length && (n = new rs("onChange", "change", null, n, s), e.push({ event: n, listeners: t }));
  }
  var pt = null, Zt = null;
  function Ji(e) {
    Tu(e, 0);
  }
  function Co(e) {
    var t = us(e);
    if (hn(t)) return e;
  }
  function Gi(e, t) {
    if (e === "change") return t;
  }
  var ri = !1;
  if (y) {
    var os;
    if (y) {
      var ss = "oninput" in document;
      if (!ss) {
        var We = document.createElement("div");
        We.setAttribute("oninput", "return;"), ss = typeof We.oninput == "function";
      }
      os = ss;
    } else os = !1;
    ri = os && (!document.documentMode || 9 < document.documentMode);
  }
  function at() {
    pt && (pt.detachEvent("onpropertychange", wn), Zt = pt = null);
  }
  function wn(e) {
    if (e.propertyName === "value" && Co(Zt)) {
      var t = [];
      Ge(t, Zt, e, lr(e)), Vn(Ji, t);
    }
  }
  function No(e, t, n) {
    e === "focusin" ? (at(), pt = t, Zt = n, pt.attachEvent("onpropertychange", wn)) : e === "focusout" && at();
  }
  function _l(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Co(Zt);
  }
  function Ao(e, t) {
    if (e === "click") return Co(t);
  }
  function $n(e, t) {
    if (e === "input" || e === "change") return Co(t);
  }
  function Sl(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Ht = typeof Object.is == "function" ? Object.is : Sl;
  function Br(e, t) {
    if (Ht(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), s = Object.keys(t);
    if (n.length !== s.length) return !1;
    for (s = 0; s < n.length; s++) {
      var l = n[s];
      if (!S.call(t, l) || !Ht(e[l], t[l])) return !1;
    }
    return !0;
  }
  function oi(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function sn(e, t) {
    var n = oi(e);
    e = 0;
    for (var s; n; ) {
      if (n.nodeType === 3) {
        if (s = e + n.textContent.length, e <= t && s >= t) return { node: n, offset: t - e };
        e = s;
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
      n = oi(n);
    }
  }
  function qr(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? qr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ju() {
    for (var e = window, t = Wt(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Wt(e.document);
    }
    return t;
  }
  function bl(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Lf(e) {
    var t = ju(), n = e.focusedElem, s = e.selectionRange;
    if (t !== n && n && n.ownerDocument && qr(n.ownerDocument.documentElement, n)) {
      if (s !== null && bl(n)) {
        if (t = s.start, e = s.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, u = Math.min(s.start, l);
          s = s.end === void 0 ? u : Math.min(s.end, l), !e.extend && u > s && (l = s, s = u, u = l), l = sn(n, u);
          var m = sn(
            n,
            s
          );
          l && m && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== m.node || e.focusOffset !== m.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), u > s ? (e.addRange(t), e.extend(m.node, m.offset)) : (t.setEnd(m.node, m.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Ff = y && "documentMode" in document && 11 >= document.documentMode, is = null, jl = null, si = null, El = !1;
  function Eu(e, t, n) {
    var s = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    El || is == null || is !== Wt(s) || (s = is, "selectionStart" in s && bl(s) ? s = { start: s.selectionStart, end: s.selectionEnd } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = { anchorNode: s.anchorNode, anchorOffset: s.anchorOffset, focusNode: s.focusNode, focusOffset: s.focusOffset }), si && Br(si, s) || (si = s, s = ta(jl, "onSelect"), 0 < s.length && (t = new rs("onSelect", "select", null, t, n), e.push({ event: t, listeners: s }), t.target = is)));
  }
  function Xi(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var as = { animationend: Xi("Animation", "AnimationEnd"), animationiteration: Xi("Animation", "AnimationIteration"), animationstart: Xi("Animation", "AnimationStart"), transitionend: Xi("Transition", "TransitionEnd") }, Cl = {}, Cu = {};
  y && (Cu = document.createElement("div").style, "AnimationEvent" in window || (delete as.animationend.animation, delete as.animationiteration.animation, delete as.animationstart.animation), "TransitionEvent" in window || delete as.transitionend.transition);
  function Yi(e) {
    if (Cl[e]) return Cl[e];
    if (!as[e]) return e;
    var t = as[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Cu) return Cl[e] = t[n];
    return e;
  }
  var Nu = Yi("animationend"), Au = Yi("animationiteration"), Iu = Yi("animationstart"), Pu = Yi("transitionend"), $u = /* @__PURE__ */ new Map(), Ru = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Zr(e, t) {
    $u.set(e, t), h(t, [e]);
  }
  for (var Nl = 0; Nl < Ru.length; Nl++) {
    var Al = Ru[Nl], Df = Al.toLowerCase(), Uf = Al[0].toUpperCase() + Al.slice(1);
    Zr(Df, "on" + Uf);
  }
  Zr(Nu, "onAnimationEnd"), Zr(Au, "onAnimationIteration"), Zr(Iu, "onAnimationStart"), Zr("dblclick", "onDoubleClick"), Zr("focusin", "onFocus"), Zr("focusout", "onBlur"), Zr(Pu, "onTransitionEnd"), v("onMouseEnter", ["mouseout", "mouseover"]), v("onMouseLeave", ["mouseout", "mouseover"]), v("onPointerEnter", ["pointerout", "pointerover"]), v("onPointerLeave", ["pointerout", "pointerover"]), h("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), h("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), h("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), h("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), h("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), h("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ii = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Vf = new Set("cancel close invalid load scroll toggle".split(" ").concat(ii));
  function Ou(e, t, n) {
    var s = e.type || "unknown-event";
    e.currentTarget = n, $e(s, t, void 0, e), e.currentTarget = null;
  }
  function Tu(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var s = e[n], l = s.event;
      s = s.listeners;
      e: {
        var u = void 0;
        if (t) for (var m = s.length - 1; 0 <= m; m--) {
          var b = s[m], N = b.instance, O = b.currentTarget;
          if (b = b.listener, N !== u && l.isPropagationStopped()) break e;
          Ou(l, b, O), u = N;
        }
        else for (m = 0; m < s.length; m++) {
          if (b = s[m], N = b.instance, O = b.currentTarget, b = b.listener, N !== u && l.isPropagationStopped()) break e;
          Ou(l, b, O), u = N;
        }
      }
    }
    if (Or) throw e = Lt, Or = !1, Lt = null, e;
  }
  function Ye(e, t) {
    var n = t[zl];
    n === void 0 && (n = t[zl] = /* @__PURE__ */ new Set());
    var s = e + "__bubble";
    n.has(s) || (Mu(t, e, 2, !1), n.add(s));
  }
  function Il(e, t, n) {
    var s = 0;
    t && (s |= 4), Mu(n, e, s, t);
  }
  var ea = "_reactListening" + Math.random().toString(36).slice(2);
  function ai(e) {
    if (!e[ea]) {
      e[ea] = !0, c.forEach(function(n) {
        n !== "selectionchange" && (Vf.has(n) || Il(n, !1, e), Il(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ea] || (t[ea] = !0, Il("selectionchange", !1, t));
    }
  }
  function Mu(e, t, n, s) {
    switch (Bi(t)) {
      case 1:
        var l = ul;
        break;
      case 4:
        l = dl;
        break;
      default:
        l = es;
    }
    n = l.bind(null, t, n, e), l = void 0, !Rr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), s ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Pl(e, t, n, s, l) {
    var u = s;
    if ((t & 1) === 0 && (t & 2) === 0 && s !== null) e: for (; ; ) {
      if (s === null) return;
      var m = s.tag;
      if (m === 3 || m === 4) {
        var b = s.stateNode.containerInfo;
        if (b === l || b.nodeType === 8 && b.parentNode === l) break;
        if (m === 4) for (m = s.return; m !== null; ) {
          var N = m.tag;
          if ((N === 3 || N === 4) && (N = m.stateNode.containerInfo, N === l || N.nodeType === 8 && N.parentNode === l)) return;
          m = m.return;
        }
        for (; b !== null; ) {
          if (m = Io(b), m === null) return;
          if (N = m.tag, N === 5 || N === 6) {
            s = u = m;
            continue e;
          }
          b = b.parentNode;
        }
      }
      s = s.return;
    }
    Vn(function() {
      var O = u, H = lr(n), K = [];
      e: {
        var q = $u.get(e);
        if (q !== void 0) {
          var le = rs, pe = e;
          switch (e) {
            case "keypress":
              if (So(n) === 0) break e;
            case "keydown":
            case "keyup":
              le = xl;
              break;
            case "focusin":
              pe = "focus", le = ti;
              break;
            case "focusout":
              pe = "blur", le = ti;
              break;
            case "beforeblur":
            case "afterblur":
              le = ti;
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
              le = ei;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              le = hl;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              le = w;
              break;
            case Nu:
            case Au:
            case Iu:
              le = Zi;
              break;
            case Pu:
              le = j;
              break;
            case "scroll":
              le = pl;
              break;
            case "wheel":
              le = P;
              break;
            case "copy":
            case "cut":
            case "paste":
              le = ni;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              le = f;
          }
          var ye = (t & 4) !== 0, ft = !ye && e === "scroll", $ = ye ? q !== null ? q + "Capture" : null : q;
          ye = [];
          for (var I = O, R; I !== null; ) {
            R = I;
            var G = R.stateNode;
            if (R.tag === 5 && G !== null && (R = G, $ !== null && (G = ur(I, $), G != null && ye.push(li(I, G, R)))), ft) break;
            I = I.return;
          }
          0 < ye.length && (q = new le(q, pe, null, n, H), K.push({ event: q, listeners: ye }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (q = e === "mouseover" || e === "pointerover", le = e === "mouseout" || e === "pointerout", q && n !== yn && (pe = n.relatedTarget || n.fromElement) && (Io(pe) || pe[yr])) break e;
          if ((le || q) && (q = H.window === H ? H : (q = H.ownerDocument) ? q.defaultView || q.parentWindow : window, le ? (pe = n.relatedTarget || n.toElement, le = O, pe = pe ? Io(pe) : null, pe !== null && (ft = Nt(pe), pe !== ft || pe.tag !== 5 && pe.tag !== 6) && (pe = null)) : (le = null, pe = O), le !== pe)) {
            if (ye = ei, G = "onMouseLeave", $ = "onMouseEnter", I = "mouse", (e === "pointerout" || e === "pointerover") && (ye = f, G = "onPointerLeave", $ = "onPointerEnter", I = "pointer"), ft = le == null ? q : us(le), R = pe == null ? q : us(pe), q = new ye(G, I + "leave", le, n, H), q.target = ft, q.relatedTarget = R, G = null, Io(H) === O && (ye = new ye($, I + "enter", pe, n, H), ye.target = R, ye.relatedTarget = ft, G = ye), ft = G, le && pe) t: {
              for (ye = le, $ = pe, I = 0, R = ye; R; R = ls(R)) I++;
              for (R = 0, G = $; G; G = ls(G)) R++;
              for (; 0 < I - R; ) ye = ls(ye), I--;
              for (; 0 < R - I; ) $ = ls($), R--;
              for (; I--; ) {
                if (ye === $ || $ !== null && ye === $.alternate) break t;
                ye = ls(ye), $ = ls($);
              }
              ye = null;
            }
            else ye = null;
            le !== null && zu(K, q, le, ye, !1), pe !== null && ft !== null && zu(K, ft, pe, ye, !0);
          }
        }
        e: {
          if (q = O ? us(O) : window, le = q.nodeName && q.nodeName.toLowerCase(), le === "select" || le === "input" && q.type === "file") var ve = Gi;
          else if (ie(q)) if (ri) ve = $n;
          else {
            ve = _l;
            var be = No;
          }
          else (le = q.nodeName) && le.toLowerCase() === "input" && (q.type === "checkbox" || q.type === "radio") && (ve = Ao);
          if (ve && (ve = ve(e, O))) {
            Ge(K, ve, n, H);
            break e;
          }
          be && be(e, q, O), e === "focusout" && (be = q._wrapperState) && be.controlled && q.type === "number" && Rs(q, "number", q.value);
        }
        switch (be = O ? us(O) : window, e) {
          case "focusin":
            (ie(be) || be.contentEditable === "true") && (is = be, jl = O, si = null);
            break;
          case "focusout":
            si = jl = is = null;
            break;
          case "mousedown":
            El = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            El = !1, Eu(K, n, H);
            break;
          case "selectionchange":
            if (Ff) break;
          case "keydown":
          case "keyup":
            Eu(K, n, H);
        }
        var je;
        if (L) e: {
          switch (e) {
            case "compositionstart":
              var Ie = "onCompositionStart";
              break e;
            case "compositionend":
              Ie = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Ie = "onCompositionUpdate";
              break e;
          }
          Ie = void 0;
        }
        else Me ? X(e, n) && (Ie = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Ie = "onCompositionStart");
        Ie && (Z && n.locale !== "ko" && (Me || Ie !== "onCompositionStart" ? Ie === "onCompositionEnd" && Me && (je = Xs()) : (Gn = H, Gs = "value" in Gn ? Gn.value : Gn.textContent, Me = !0)), be = ta(O, Ie), 0 < be.length && (Ie = new Ki(Ie, e, null, n, H), K.push({ event: Ie, listeners: be }), je ? Ie.data = je : (je = Ve(n), je !== null && (Ie.data = je)))), (je = Y ? ht(e, n) : Fe(e, n)) && (O = ta(O, "onBeforeInput"), 0 < O.length && (H = new Ki("onBeforeInput", "beforeinput", null, n, H), K.push({ event: H, listeners: O }), H.data = je));
      }
      Tu(K, t);
    });
  }
  function li(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function ta(e, t) {
    for (var n = t + "Capture", s = []; e !== null; ) {
      var l = e, u = l.stateNode;
      l.tag === 5 && u !== null && (l = u, u = ur(e, n), u != null && s.unshift(li(e, u, l)), u = ur(e, t), u != null && s.push(li(e, u, l))), e = e.return;
    }
    return s;
  }
  function ls(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function zu(e, t, n, s, l) {
    for (var u = t._reactName, m = []; n !== null && n !== s; ) {
      var b = n, N = b.alternate, O = b.stateNode;
      if (N !== null && N === s) break;
      b.tag === 5 && O !== null && (b = O, l ? (N = ur(n, u), N != null && m.unshift(li(n, N, b))) : l || (N = ur(n, u), N != null && m.push(li(n, N, b)))), n = n.return;
    }
    m.length !== 0 && e.push({ event: t, listeners: m });
  }
  var Wf = /\r\n?/g, Bf = /\u0000|\uFFFD/g;
  function Lu(e) {
    return (typeof e == "string" ? e : "" + e).replace(Wf, `
`).replace(Bf, "");
  }
  function na(e, t, n) {
    if (t = Lu(t), Lu(e) !== t && n) throw Error(i(425));
  }
  function ra() {
  }
  var $l = null, Rl = null;
  function Ol(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Tl = typeof setTimeout == "function" ? setTimeout : void 0, qf = typeof clearTimeout == "function" ? clearTimeout : void 0, Fu = typeof Promise == "function" ? Promise : void 0, Zf = typeof queueMicrotask == "function" ? queueMicrotask : typeof Fu < "u" ? function(e) {
    return Fu.resolve(null).then(e).catch(Hf);
  } : Tl;
  function Hf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ml(e, t) {
    var n = t, s = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (s === 0) {
          e.removeChild(l), _o(t);
          return;
        }
        s--;
      } else n !== "$" && n !== "$?" && n !== "$!" || s++;
      n = l;
    } while (n);
    _o(t);
  }
  function Hr(e) {
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
  function Du(e) {
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
  var cs = Math.random().toString(36).slice(2), Xn = "__reactFiber$" + cs, ci = "__reactProps$" + cs, yr = "__reactContainer$" + cs, zl = "__reactEvents$" + cs, Kf = "__reactListeners$" + cs, Qf = "__reactHandles$" + cs;
  function Io(e) {
    var t = e[Xn];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[yr] || n[Xn]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Du(e); e !== null; ) {
          if (n = e[Xn]) return n;
          e = Du(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function ui(e) {
    return e = e[Xn] || e[yr], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function us(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(i(33));
  }
  function oa(e) {
    return e[ci] || null;
  }
  var Ll = [], ds = -1;
  function Kr(e) {
    return { current: e };
  }
  function et(e) {
    0 > ds || (e.current = Ll[ds], Ll[ds] = null, ds--);
  }
  function Xe(e, t) {
    ds++, Ll[ds] = e.current, e.current = t;
  }
  var Qr = {}, $t = Kr(Qr), Kt = Kr(!1), Po = Qr;
  function ps(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Qr;
    var s = e.stateNode;
    if (s && s.__reactInternalMemoizedUnmaskedChildContext === t) return s.__reactInternalMemoizedMaskedChildContext;
    var l = {}, u;
    for (u in n) l[u] = t[u];
    return s && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Qt(e) {
    return e = e.childContextTypes, e != null;
  }
  function sa() {
    et(Kt), et($t);
  }
  function Uu(e, t, n) {
    if ($t.current !== Qr) throw Error(i(168));
    Xe($t, t), Xe(Kt, n);
  }
  function Vu(e, t, n) {
    var s = e.stateNode;
    if (t = t.childContextTypes, typeof s.getChildContext != "function") return n;
    s = s.getChildContext();
    for (var l in s) if (!(l in t)) throw Error(i(108, Ue(e) || "Unknown", l));
    return ne({}, n, s);
  }
  function ia(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Qr, Po = $t.current, Xe($t, e), Xe(Kt, Kt.current), !0;
  }
  function Wu(e, t, n) {
    var s = e.stateNode;
    if (!s) throw Error(i(169));
    n ? (e = Vu(e, t, Po), s.__reactInternalMemoizedMergedChildContext = e, et(Kt), et($t), Xe($t, e)) : et(Kt), Xe(Kt, n);
  }
  var vr = null, aa = !1, Fl = !1;
  function Bu(e) {
    vr === null ? vr = [e] : vr.push(e);
  }
  function Jf(e) {
    aa = !0, Bu(e);
  }
  function Jr() {
    if (!Fl && vr !== null) {
      Fl = !0;
      var e = 0, t = He;
      try {
        var n = vr;
        for (He = 1; e < n.length; e++) {
          var s = n[e];
          do
            s = s(!0);
          while (s !== null);
        }
        vr = null, aa = !1;
      } catch (l) {
        throw vr !== null && (vr = vr.slice(e + 1)), Ds(Ho, Jr), l;
      } finally {
        He = t, Fl = !1;
      }
    }
    return null;
  }
  var fs = [], hs = 0, la = null, ca = 0, kn = [], xn = 0, $o = null, gr = 1, wr = "";
  function Ro(e, t) {
    fs[hs++] = ca, fs[hs++] = la, la = e, ca = t;
  }
  function qu(e, t, n) {
    kn[xn++] = gr, kn[xn++] = wr, kn[xn++] = $o, $o = e;
    var s = gr;
    e = wr;
    var l = 32 - At(s) - 1;
    s &= ~(1 << l), n += 1;
    var u = 32 - At(t) + l;
    if (30 < u) {
      var m = l - l % 5;
      u = (s & (1 << m) - 1).toString(32), s >>= m, l -= m, gr = 1 << 32 - At(t) + l | n << l | s, wr = u + e;
    } else gr = 1 << u | n << l | s, wr = e;
  }
  function Dl(e) {
    e.return !== null && (Ro(e, 1), qu(e, 1, 0));
  }
  function Ul(e) {
    for (; e === la; ) la = fs[--hs], fs[hs] = null, ca = fs[--hs], fs[hs] = null;
    for (; e === $o; ) $o = kn[--xn], kn[xn] = null, wr = kn[--xn], kn[xn] = null, gr = kn[--xn], kn[xn] = null;
  }
  var an = null, ln = null, nt = !1, Rn = null;
  function Zu(e, t) {
    var n = jn(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Hu(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, an = e, ln = Hr(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, an = e, ln = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = $o !== null ? { id: gr, overflow: wr } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = jn(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, an = e, ln = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Vl(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Wl(e) {
    if (nt) {
      var t = ln;
      if (t) {
        var n = t;
        if (!Hu(e, t)) {
          if (Vl(e)) throw Error(i(418));
          t = Hr(n.nextSibling);
          var s = an;
          t && Hu(e, t) ? Zu(s, n) : (e.flags = e.flags & -4097 | 2, nt = !1, an = e);
        }
      } else {
        if (Vl(e)) throw Error(i(418));
        e.flags = e.flags & -4097 | 2, nt = !1, an = e;
      }
    }
  }
  function Ku(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    an = e;
  }
  function ua(e) {
    if (e !== an) return !1;
    if (!nt) return Ku(e), nt = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ol(e.type, e.memoizedProps)), t && (t = ln)) {
      if (Vl(e)) throw Qu(), Error(i(418));
      for (; t; ) Zu(e, t), t = Hr(t.nextSibling);
    }
    if (Ku(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(i(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                ln = Hr(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        ln = null;
      }
    } else ln = an ? Hr(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Qu() {
    for (var e = ln; e; ) e = Hr(e.nextSibling);
  }
  function ms() {
    ln = an = null, nt = !1;
  }
  function Bl(e) {
    Rn === null ? Rn = [e] : Rn.push(e);
  }
  var Gf = ae.ReactCurrentBatchConfig;
  function di(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(i(309));
          var s = n.stateNode;
        }
        if (!s) throw Error(i(147, e));
        var l = s, u = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === u ? t.ref : (t = function(m) {
          var b = l.refs;
          m === null ? delete b[u] : b[u] = m;
        }, t._stringRef = u, t);
      }
      if (typeof e != "string") throw Error(i(284));
      if (!n._owner) throw Error(i(290, e));
    }
    return e;
  }
  function da(e, t) {
    throw e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Ju(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Gu(e) {
    function t($, I) {
      if (e) {
        var R = $.deletions;
        R === null ? ($.deletions = [I], $.flags |= 16) : R.push(I);
      }
    }
    function n($, I) {
      if (!e) return null;
      for (; I !== null; ) t($, I), I = I.sibling;
      return null;
    }
    function s($, I) {
      for ($ = /* @__PURE__ */ new Map(); I !== null; ) I.key !== null ? $.set(I.key, I) : $.set(I.index, I), I = I.sibling;
      return $;
    }
    function l($, I) {
      return $ = oo($, I), $.index = 0, $.sibling = null, $;
    }
    function u($, I, R) {
      return $.index = R, e ? (R = $.alternate, R !== null ? (R = R.index, R < I ? ($.flags |= 2, I) : R) : ($.flags |= 2, I)) : ($.flags |= 1048576, I);
    }
    function m($) {
      return e && $.alternate === null && ($.flags |= 2), $;
    }
    function b($, I, R, G) {
      return I === null || I.tag !== 6 ? (I = Tc(R, $.mode, G), I.return = $, I) : (I = l(I, R), I.return = $, I);
    }
    function N($, I, R, G) {
      var ve = R.type;
      return ve === Ce ? H($, I, R.props.children, G, R.key) : I !== null && (I.elementType === ve || typeof ve == "object" && ve !== null && ve.$$typeof === Pe && Ju(ve) === I.type) ? (G = l(I, R.props), G.ref = di($, I, R), G.return = $, G) : (G = Ta(R.type, R.key, R.props, null, $.mode, G), G.ref = di($, I, R), G.return = $, G);
    }
    function O($, I, R, G) {
      return I === null || I.tag !== 4 || I.stateNode.containerInfo !== R.containerInfo || I.stateNode.implementation !== R.implementation ? (I = Mc(R, $.mode, G), I.return = $, I) : (I = l(I, R.children || []), I.return = $, I);
    }
    function H($, I, R, G, ve) {
      return I === null || I.tag !== 7 ? (I = Uo(R, $.mode, G, ve), I.return = $, I) : (I = l(I, R), I.return = $, I);
    }
    function K($, I, R) {
      if (typeof I == "string" && I !== "" || typeof I == "number") return I = Tc("" + I, $.mode, R), I.return = $, I;
      if (typeof I == "object" && I !== null) {
        switch (I.$$typeof) {
          case Ne:
            return R = Ta(I.type, I.key, I.props, null, $.mode, R), R.ref = di($, null, I), R.return = $, R;
          case ge:
            return I = Mc(I, $.mode, R), I.return = $, I;
          case Pe:
            var G = I._init;
            return K($, G(I._payload), R);
        }
        if (Nr(I) || re(I)) return I = Uo(I, $.mode, R, null), I.return = $, I;
        da($, I);
      }
      return null;
    }
    function q($, I, R, G) {
      var ve = I !== null ? I.key : null;
      if (typeof R == "string" && R !== "" || typeof R == "number") return ve !== null ? null : b($, I, "" + R, G);
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case Ne:
            return R.key === ve ? N($, I, R, G) : null;
          case ge:
            return R.key === ve ? O($, I, R, G) : null;
          case Pe:
            return ve = R._init, q(
              $,
              I,
              ve(R._payload),
              G
            );
        }
        if (Nr(R) || re(R)) return ve !== null ? null : H($, I, R, G, null);
        da($, R);
      }
      return null;
    }
    function le($, I, R, G, ve) {
      if (typeof G == "string" && G !== "" || typeof G == "number") return $ = $.get(R) || null, b(I, $, "" + G, ve);
      if (typeof G == "object" && G !== null) {
        switch (G.$$typeof) {
          case Ne:
            return $ = $.get(G.key === null ? R : G.key) || null, N(I, $, G, ve);
          case ge:
            return $ = $.get(G.key === null ? R : G.key) || null, O(I, $, G, ve);
          case Pe:
            var be = G._init;
            return le($, I, R, be(G._payload), ve);
        }
        if (Nr(G) || re(G)) return $ = $.get(R) || null, H(I, $, G, ve, null);
        da(I, G);
      }
      return null;
    }
    function pe($, I, R, G) {
      for (var ve = null, be = null, je = I, Ie = I = 0, xt = null; je !== null && Ie < R.length; Ie++) {
        je.index > Ie ? (xt = je, je = null) : xt = je.sibling;
        var qe = q($, je, R[Ie], G);
        if (qe === null) {
          je === null && (je = xt);
          break;
        }
        e && je && qe.alternate === null && t($, je), I = u(qe, I, Ie), be === null ? ve = qe : be.sibling = qe, be = qe, je = xt;
      }
      if (Ie === R.length) return n($, je), nt && Ro($, Ie), ve;
      if (je === null) {
        for (; Ie < R.length; Ie++) je = K($, R[Ie], G), je !== null && (I = u(je, I, Ie), be === null ? ve = je : be.sibling = je, be = je);
        return nt && Ro($, Ie), ve;
      }
      for (je = s($, je); Ie < R.length; Ie++) xt = le(je, $, Ie, R[Ie], G), xt !== null && (e && xt.alternate !== null && je.delete(xt.key === null ? Ie : xt.key), I = u(xt, I, Ie), be === null ? ve = xt : be.sibling = xt, be = xt);
      return e && je.forEach(function(so) {
        return t($, so);
      }), nt && Ro($, Ie), ve;
    }
    function ye($, I, R, G) {
      var ve = re(R);
      if (typeof ve != "function") throw Error(i(150));
      if (R = ve.call(R), R == null) throw Error(i(151));
      for (var be = ve = null, je = I, Ie = I = 0, xt = null, qe = R.next(); je !== null && !qe.done; Ie++, qe = R.next()) {
        je.index > Ie ? (xt = je, je = null) : xt = je.sibling;
        var so = q($, je, qe.value, G);
        if (so === null) {
          je === null && (je = xt);
          break;
        }
        e && je && so.alternate === null && t($, je), I = u(so, I, Ie), be === null ? ve = so : be.sibling = so, be = so, je = xt;
      }
      if (qe.done) return n(
        $,
        je
      ), nt && Ro($, Ie), ve;
      if (je === null) {
        for (; !qe.done; Ie++, qe = R.next()) qe = K($, qe.value, G), qe !== null && (I = u(qe, I, Ie), be === null ? ve = qe : be.sibling = qe, be = qe);
        return nt && Ro($, Ie), ve;
      }
      for (je = s($, je); !qe.done; Ie++, qe = R.next()) qe = le(je, $, Ie, qe.value, G), qe !== null && (e && qe.alternate !== null && je.delete(qe.key === null ? Ie : qe.key), I = u(qe, I, Ie), be === null ? ve = qe : be.sibling = qe, be = qe);
      return e && je.forEach(function(Ih) {
        return t($, Ih);
      }), nt && Ro($, Ie), ve;
    }
    function ft($, I, R, G) {
      if (typeof R == "object" && R !== null && R.type === Ce && R.key === null && (R = R.props.children), typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case Ne:
            e: {
              for (var ve = R.key, be = I; be !== null; ) {
                if (be.key === ve) {
                  if (ve = R.type, ve === Ce) {
                    if (be.tag === 7) {
                      n($, be.sibling), I = l(be, R.props.children), I.return = $, $ = I;
                      break e;
                    }
                  } else if (be.elementType === ve || typeof ve == "object" && ve !== null && ve.$$typeof === Pe && Ju(ve) === be.type) {
                    n($, be.sibling), I = l(be, R.props), I.ref = di($, be, R), I.return = $, $ = I;
                    break e;
                  }
                  n($, be);
                  break;
                } else t($, be);
                be = be.sibling;
              }
              R.type === Ce ? (I = Uo(R.props.children, $.mode, G, R.key), I.return = $, $ = I) : (G = Ta(R.type, R.key, R.props, null, $.mode, G), G.ref = di($, I, R), G.return = $, $ = G);
            }
            return m($);
          case ge:
            e: {
              for (be = R.key; I !== null; ) {
                if (I.key === be) if (I.tag === 4 && I.stateNode.containerInfo === R.containerInfo && I.stateNode.implementation === R.implementation) {
                  n($, I.sibling), I = l(I, R.children || []), I.return = $, $ = I;
                  break e;
                } else {
                  n($, I);
                  break;
                }
                else t($, I);
                I = I.sibling;
              }
              I = Mc(R, $.mode, G), I.return = $, $ = I;
            }
            return m($);
          case Pe:
            return be = R._init, ft($, I, be(R._payload), G);
        }
        if (Nr(R)) return pe($, I, R, G);
        if (re(R)) return ye($, I, R, G);
        da($, R);
      }
      return typeof R == "string" && R !== "" || typeof R == "number" ? (R = "" + R, I !== null && I.tag === 6 ? (n($, I.sibling), I = l(I, R), I.return = $, $ = I) : (n($, I), I = Tc(R, $.mode, G), I.return = $, $ = I), m($)) : n($, I);
    }
    return ft;
  }
  var ys = Gu(!0), Xu = Gu(!1), pa = Kr(null), fa = null, vs = null, ql = null;
  function Zl() {
    ql = vs = fa = null;
  }
  function Hl(e) {
    var t = pa.current;
    et(pa), e._currentValue = t;
  }
  function Kl(e, t, n) {
    for (; e !== null; ) {
      var s = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, s !== null && (s.childLanes |= t)) : s !== null && (s.childLanes & t) !== t && (s.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function gs(e, t) {
    fa = e, ql = vs = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Jt = !0), e.firstContext = null);
  }
  function _n(e) {
    var t = e._currentValue;
    if (ql !== e) if (e = { context: e, memoizedValue: t, next: null }, vs === null) {
      if (fa === null) throw Error(i(308));
      vs = e, fa.dependencies = { lanes: 0, firstContext: e };
    } else vs = vs.next = e;
    return t;
  }
  var Oo = null;
  function Ql(e) {
    Oo === null ? Oo = [e] : Oo.push(e);
  }
  function Yu(e, t, n, s) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Ql(t)) : (n.next = l.next, l.next = n), t.interleaved = n, kr(e, s);
  }
  function kr(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Gr = !1;
  function Jl(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function ed(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function xr(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Xr(e, t, n) {
    var s = e.updateQueue;
    if (s === null) return null;
    if (s = s.shared, (Be & 2) !== 0) {
      var l = s.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), s.pending = t, kr(e, n);
    }
    return l = s.interleaved, l === null ? (t.next = t, Ql(s)) : (t.next = l.next, l.next = t), s.interleaved = t, kr(e, n);
  }
  function ha(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var s = t.lanes;
      s &= e.pendingLanes, n |= s, t.lanes = n, Go(e, n);
    }
  }
  function td(e, t) {
    var n = e.updateQueue, s = e.alternate;
    if (s !== null && (s = s.updateQueue, n === s)) {
      var l = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var m = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          u === null ? l = u = m : u = u.next = m, n = n.next;
        } while (n !== null);
        u === null ? l = u = t : u = u.next = t;
      } else l = u = t;
      n = { baseState: s.baseState, firstBaseUpdate: l, lastBaseUpdate: u, shared: s.shared, effects: s.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function ma(e, t, n, s) {
    var l = e.updateQueue;
    Gr = !1;
    var u = l.firstBaseUpdate, m = l.lastBaseUpdate, b = l.shared.pending;
    if (b !== null) {
      l.shared.pending = null;
      var N = b, O = N.next;
      N.next = null, m === null ? u = O : m.next = O, m = N;
      var H = e.alternate;
      H !== null && (H = H.updateQueue, b = H.lastBaseUpdate, b !== m && (b === null ? H.firstBaseUpdate = O : b.next = O, H.lastBaseUpdate = N));
    }
    if (u !== null) {
      var K = l.baseState;
      m = 0, H = O = N = null, b = u;
      do {
        var q = b.lane, le = b.eventTime;
        if ((s & q) === q) {
          H !== null && (H = H.next = {
            eventTime: le,
            lane: 0,
            tag: b.tag,
            payload: b.payload,
            callback: b.callback,
            next: null
          });
          e: {
            var pe = e, ye = b;
            switch (q = t, le = n, ye.tag) {
              case 1:
                if (pe = ye.payload, typeof pe == "function") {
                  K = pe.call(le, K, q);
                  break e;
                }
                K = pe;
                break e;
              case 3:
                pe.flags = pe.flags & -65537 | 128;
              case 0:
                if (pe = ye.payload, q = typeof pe == "function" ? pe.call(le, K, q) : pe, q == null) break e;
                K = ne({}, K, q);
                break e;
              case 2:
                Gr = !0;
            }
          }
          b.callback !== null && b.lane !== 0 && (e.flags |= 64, q = l.effects, q === null ? l.effects = [b] : q.push(b));
        } else le = { eventTime: le, lane: q, tag: b.tag, payload: b.payload, callback: b.callback, next: null }, H === null ? (O = H = le, N = K) : H = H.next = le, m |= q;
        if (b = b.next, b === null) {
          if (b = l.shared.pending, b === null) break;
          q = b, b = q.next, q.next = null, l.lastBaseUpdate = q, l.shared.pending = null;
        }
      } while (!0);
      if (H === null && (N = K), l.baseState = N, l.firstBaseUpdate = O, l.lastBaseUpdate = H, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          m |= l.lane, l = l.next;
        while (l !== t);
      } else u === null && (l.shared.lanes = 0);
      zo |= m, e.lanes = m, e.memoizedState = K;
    }
  }
  function nd(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var s = e[t], l = s.callback;
      if (l !== null) {
        if (s.callback = null, s = n, typeof l != "function") throw Error(i(191, l));
        l.call(s);
      }
    }
  }
  var pi = {}, Yn = Kr(pi), fi = Kr(pi), hi = Kr(pi);
  function To(e) {
    if (e === pi) throw Error(i(174));
    return e;
  }
  function Gl(e, t) {
    switch (Xe(hi, t), Xe(fi, e), Xe(Yn, pi), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : se(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = se(t, e);
    }
    et(Yn), Xe(Yn, t);
  }
  function ws() {
    et(Yn), et(fi), et(hi);
  }
  function rd(e) {
    To(hi.current);
    var t = To(Yn.current), n = se(t, e.type);
    t !== n && (Xe(fi, e), Xe(Yn, n));
  }
  function Xl(e) {
    fi.current === e && (et(Yn), et(fi));
  }
  var ot = Kr(0);
  function ya(e) {
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
  var Yl = [];
  function ec() {
    for (var e = 0; e < Yl.length; e++) Yl[e]._workInProgressVersionPrimary = null;
    Yl.length = 0;
  }
  var va = ae.ReactCurrentDispatcher, tc = ae.ReactCurrentBatchConfig, Mo = 0, st = null, yt = null, wt = null, ga = !1, mi = !1, yi = 0, Xf = 0;
  function Rt() {
    throw Error(i(321));
  }
  function nc(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Ht(e[n], t[n])) return !1;
    return !0;
  }
  function rc(e, t, n, s, l, u) {
    if (Mo = u, st = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, va.current = e === null || e.memoizedState === null ? nh : rh, e = n(s, l), mi) {
      u = 0;
      do {
        if (mi = !1, yi = 0, 25 <= u) throw Error(i(301));
        u += 1, wt = yt = null, t.updateQueue = null, va.current = oh, e = n(s, l);
      } while (mi);
    }
    if (va.current = xa, t = yt !== null && yt.next !== null, Mo = 0, wt = yt = st = null, ga = !1, t) throw Error(i(300));
    return e;
  }
  function oc() {
    var e = yi !== 0;
    return yi = 0, e;
  }
  function er() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return wt === null ? st.memoizedState = wt = e : wt = wt.next = e, wt;
  }
  function Sn() {
    if (yt === null) {
      var e = st.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = yt.next;
    var t = wt === null ? st.memoizedState : wt.next;
    if (t !== null) wt = t, yt = e;
    else {
      if (e === null) throw Error(i(310));
      yt = e, e = { memoizedState: yt.memoizedState, baseState: yt.baseState, baseQueue: yt.baseQueue, queue: yt.queue, next: null }, wt === null ? st.memoizedState = wt = e : wt = wt.next = e;
    }
    return wt;
  }
  function vi(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function sc(e) {
    var t = Sn(), n = t.queue;
    if (n === null) throw Error(i(311));
    n.lastRenderedReducer = e;
    var s = yt, l = s.baseQueue, u = n.pending;
    if (u !== null) {
      if (l !== null) {
        var m = l.next;
        l.next = u.next, u.next = m;
      }
      s.baseQueue = l = u, n.pending = null;
    }
    if (l !== null) {
      u = l.next, s = s.baseState;
      var b = m = null, N = null, O = u;
      do {
        var H = O.lane;
        if ((Mo & H) === H) N !== null && (N = N.next = { lane: 0, action: O.action, hasEagerState: O.hasEagerState, eagerState: O.eagerState, next: null }), s = O.hasEagerState ? O.eagerState : e(s, O.action);
        else {
          var K = {
            lane: H,
            action: O.action,
            hasEagerState: O.hasEagerState,
            eagerState: O.eagerState,
            next: null
          };
          N === null ? (b = N = K, m = s) : N = N.next = K, st.lanes |= H, zo |= H;
        }
        O = O.next;
      } while (O !== null && O !== u);
      N === null ? m = s : N.next = b, Ht(s, t.memoizedState) || (Jt = !0), t.memoizedState = s, t.baseState = m, t.baseQueue = N, n.lastRenderedState = s;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        u = l.lane, st.lanes |= u, zo |= u, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function ic(e) {
    var t = Sn(), n = t.queue;
    if (n === null) throw Error(i(311));
    n.lastRenderedReducer = e;
    var s = n.dispatch, l = n.pending, u = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var m = l = l.next;
      do
        u = e(u, m.action), m = m.next;
      while (m !== l);
      Ht(u, t.memoizedState) || (Jt = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, s];
  }
  function od() {
  }
  function sd(e, t) {
    var n = st, s = Sn(), l = t(), u = !Ht(s.memoizedState, l);
    if (u && (s.memoizedState = l, Jt = !0), s = s.queue, ac(ld.bind(null, n, s, e), [e]), s.getSnapshot !== t || u || wt !== null && wt.memoizedState.tag & 1) {
      if (n.flags |= 2048, gi(9, ad.bind(null, n, s, l, t), void 0, null), kt === null) throw Error(i(349));
      (Mo & 30) !== 0 || id(n, t, l);
    }
    return l;
  }
  function id(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = st.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, st.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function ad(e, t, n, s) {
    t.value = n, t.getSnapshot = s, cd(t) && ud(e);
  }
  function ld(e, t, n) {
    return n(function() {
      cd(t) && ud(e);
    });
  }
  function cd(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Ht(e, n);
    } catch {
      return !0;
    }
  }
  function ud(e) {
    var t = kr(e, 1);
    t !== null && zn(t, e, 1, -1);
  }
  function dd(e) {
    var t = er();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: vi, lastRenderedState: e }, t.queue = e, e = e.dispatch = th.bind(null, st, e), [t.memoizedState, e];
  }
  function gi(e, t, n, s) {
    return e = { tag: e, create: t, destroy: n, deps: s, next: null }, t = st.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, st.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (s = n.next, n.next = e, e.next = s, t.lastEffect = e)), e;
  }
  function pd() {
    return Sn().memoizedState;
  }
  function wa(e, t, n, s) {
    var l = er();
    st.flags |= e, l.memoizedState = gi(1 | t, n, void 0, s === void 0 ? null : s);
  }
  function ka(e, t, n, s) {
    var l = Sn();
    s = s === void 0 ? null : s;
    var u = void 0;
    if (yt !== null) {
      var m = yt.memoizedState;
      if (u = m.destroy, s !== null && nc(s, m.deps)) {
        l.memoizedState = gi(t, n, u, s);
        return;
      }
    }
    st.flags |= e, l.memoizedState = gi(1 | t, n, u, s);
  }
  function fd(e, t) {
    return wa(8390656, 8, e, t);
  }
  function ac(e, t) {
    return ka(2048, 8, e, t);
  }
  function hd(e, t) {
    return ka(4, 2, e, t);
  }
  function md(e, t) {
    return ka(4, 4, e, t);
  }
  function yd(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function vd(e, t, n) {
    return n = n != null ? n.concat([e]) : null, ka(4, 4, yd.bind(null, t, e), n);
  }
  function lc() {
  }
  function gd(e, t) {
    var n = Sn();
    t = t === void 0 ? null : t;
    var s = n.memoizedState;
    return s !== null && t !== null && nc(t, s[1]) ? s[0] : (n.memoizedState = [e, t], e);
  }
  function wd(e, t) {
    var n = Sn();
    t = t === void 0 ? null : t;
    var s = n.memoizedState;
    return s !== null && t !== null && nc(t, s[1]) ? s[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function kd(e, t, n) {
    return (Mo & 21) === 0 ? (e.baseState && (e.baseState = !1, Jt = !0), e.memoizedState = n) : (Ht(n, t) || (n = qs(), st.lanes |= n, zo |= n, e.baseState = !0), t);
  }
  function Yf(e, t) {
    var n = He;
    He = n !== 0 && 4 > n ? n : 4, e(!0);
    var s = tc.transition;
    tc.transition = {};
    try {
      e(!1), t();
    } finally {
      He = n, tc.transition = s;
    }
  }
  function xd() {
    return Sn().memoizedState;
  }
  function eh(e, t, n) {
    var s = no(e);
    if (n = { lane: s, action: n, hasEagerState: !1, eagerState: null, next: null }, _d(e)) Sd(t, n);
    else if (n = Yu(e, t, n, s), n !== null) {
      var l = Dt();
      zn(n, e, s, l), bd(n, t, s);
    }
  }
  function th(e, t, n) {
    var s = no(e), l = { lane: s, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (_d(e)) Sd(t, l);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null)) try {
        var m = t.lastRenderedState, b = u(m, n);
        if (l.hasEagerState = !0, l.eagerState = b, Ht(b, m)) {
          var N = t.interleaved;
          N === null ? (l.next = l, Ql(t)) : (l.next = N.next, N.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Yu(e, t, l, s), n !== null && (l = Dt(), zn(n, e, s, l), bd(n, t, s));
    }
  }
  function _d(e) {
    var t = e.alternate;
    return e === st || t !== null && t === st;
  }
  function Sd(e, t) {
    mi = ga = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function bd(e, t, n) {
    if ((n & 4194240) !== 0) {
      var s = t.lanes;
      s &= e.pendingLanes, n |= s, t.lanes = n, Go(e, n);
    }
  }
  var xa = { readContext: _n, useCallback: Rt, useContext: Rt, useEffect: Rt, useImperativeHandle: Rt, useInsertionEffect: Rt, useLayoutEffect: Rt, useMemo: Rt, useReducer: Rt, useRef: Rt, useState: Rt, useDebugValue: Rt, useDeferredValue: Rt, useTransition: Rt, useMutableSource: Rt, useSyncExternalStore: Rt, useId: Rt, unstable_isNewReconciler: !1 }, nh = { readContext: _n, useCallback: function(e, t) {
    return er().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: _n, useEffect: fd, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, wa(
      4194308,
      4,
      yd.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return wa(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return wa(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = er();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var s = er();
    return t = n !== void 0 ? n(t) : t, s.memoizedState = s.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, s.queue = e, e = e.dispatch = eh.bind(null, st, e), [s.memoizedState, e];
  }, useRef: function(e) {
    var t = er();
    return e = { current: e }, t.memoizedState = e;
  }, useState: dd, useDebugValue: lc, useDeferredValue: function(e) {
    return er().memoizedState = e;
  }, useTransition: function() {
    var e = dd(!1), t = e[0];
    return e = Yf.bind(null, e[1]), er().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var s = st, l = er();
    if (nt) {
      if (n === void 0) throw Error(i(407));
      n = n();
    } else {
      if (n = t(), kt === null) throw Error(i(349));
      (Mo & 30) !== 0 || id(s, t, n);
    }
    l.memoizedState = n;
    var u = { value: n, getSnapshot: t };
    return l.queue = u, fd(ld.bind(
      null,
      s,
      u,
      e
    ), [e]), s.flags |= 2048, gi(9, ad.bind(null, s, u, n, t), void 0, null), n;
  }, useId: function() {
    var e = er(), t = kt.identifierPrefix;
    if (nt) {
      var n = wr, s = gr;
      n = (s & ~(1 << 32 - At(s) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = yi++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Xf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, rh = {
    readContext: _n,
    useCallback: gd,
    useContext: _n,
    useEffect: ac,
    useImperativeHandle: vd,
    useInsertionEffect: hd,
    useLayoutEffect: md,
    useMemo: wd,
    useReducer: sc,
    useRef: pd,
    useState: function() {
      return sc(vi);
    },
    useDebugValue: lc,
    useDeferredValue: function(e) {
      var t = Sn();
      return kd(t, yt.memoizedState, e);
    },
    useTransition: function() {
      var e = sc(vi)[0], t = Sn().memoizedState;
      return [e, t];
    },
    useMutableSource: od,
    useSyncExternalStore: sd,
    useId: xd,
    unstable_isNewReconciler: !1
  }, oh = { readContext: _n, useCallback: gd, useContext: _n, useEffect: ac, useImperativeHandle: vd, useInsertionEffect: hd, useLayoutEffect: md, useMemo: wd, useReducer: ic, useRef: pd, useState: function() {
    return ic(vi);
  }, useDebugValue: lc, useDeferredValue: function(e) {
    var t = Sn();
    return yt === null ? t.memoizedState = e : kd(t, yt.memoizedState, e);
  }, useTransition: function() {
    var e = ic(vi)[0], t = Sn().memoizedState;
    return [e, t];
  }, useMutableSource: od, useSyncExternalStore: sd, useId: xd, unstable_isNewReconciler: !1 };
  function On(e, t) {
    if (e && e.defaultProps) {
      t = ne({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function cc(e, t, n, s) {
    t = e.memoizedState, n = n(s, t), n = n == null ? t : ne({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var _a = { isMounted: function(e) {
    return (e = e._reactInternals) ? Nt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var s = Dt(), l = no(e), u = xr(s, l);
    u.payload = t, n != null && (u.callback = n), t = Xr(e, u, l), t !== null && (zn(t, e, l, s), ha(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var s = Dt(), l = no(e), u = xr(s, l);
    u.tag = 1, u.payload = t, n != null && (u.callback = n), t = Xr(e, u, l), t !== null && (zn(t, e, l, s), ha(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Dt(), s = no(e), l = xr(n, s);
    l.tag = 2, t != null && (l.callback = t), t = Xr(e, l, s), t !== null && (zn(t, e, s, n), ha(t, e, s));
  } };
  function jd(e, t, n, s, l, u, m) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(s, u, m) : t.prototype && t.prototype.isPureReactComponent ? !Br(n, s) || !Br(l, u) : !0;
  }
  function Ed(e, t, n) {
    var s = !1, l = Qr, u = t.contextType;
    return typeof u == "object" && u !== null ? u = _n(u) : (l = Qt(t) ? Po : $t.current, s = t.contextTypes, u = (s = s != null) ? ps(e, l) : Qr), t = new t(n, u), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = _a, e.stateNode = t, t._reactInternals = e, s && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = u), t;
  }
  function Cd(e, t, n, s) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, s), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, s), t.state !== e && _a.enqueueReplaceState(t, t.state, null);
  }
  function uc(e, t, n, s) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Jl(e);
    var u = t.contextType;
    typeof u == "object" && u !== null ? l.context = _n(u) : (u = Qt(t) ? Po : $t.current, l.context = ps(e, u)), l.state = e.memoizedState, u = t.getDerivedStateFromProps, typeof u == "function" && (cc(e, t, u, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && _a.enqueueReplaceState(l, l.state, null), ma(e, n, l, s), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function ks(e, t) {
    try {
      var n = "", s = t;
      do
        n += me(s), s = s.return;
      while (s);
      var l = n;
    } catch (u) {
      l = `
Error generating stack: ` + u.message + `
` + u.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function dc(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function pc(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var sh = typeof WeakMap == "function" ? WeakMap : Map;
  function Nd(e, t, n) {
    n = xr(-1, n), n.tag = 3, n.payload = { element: null };
    var s = t.value;
    return n.callback = function() {
      Aa || (Aa = !0, Cc = s), pc(e, t);
    }, n;
  }
  function Ad(e, t, n) {
    n = xr(-1, n), n.tag = 3;
    var s = e.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var l = t.value;
      n.payload = function() {
        return s(l);
      }, n.callback = function() {
        pc(e, t);
      };
    }
    var u = e.stateNode;
    return u !== null && typeof u.componentDidCatch == "function" && (n.callback = function() {
      pc(e, t), typeof s != "function" && (eo === null ? eo = /* @__PURE__ */ new Set([this]) : eo.add(this));
      var m = t.stack;
      this.componentDidCatch(t.value, { componentStack: m !== null ? m : "" });
    }), n;
  }
  function Id(e, t, n) {
    var s = e.pingCache;
    if (s === null) {
      s = e.pingCache = new sh();
      var l = /* @__PURE__ */ new Set();
      s.set(t, l);
    } else l = s.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), s.set(t, l));
    l.has(n) || (l.add(n), e = wh.bind(null, e, t, n), t.then(e, e));
  }
  function Pd(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function $d(e, t, n, s, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = xr(-1, 1), t.tag = 2, Xr(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var ih = ae.ReactCurrentOwner, Jt = !1;
  function Ft(e, t, n, s) {
    t.child = e === null ? Xu(t, null, n, s) : ys(t, e.child, n, s);
  }
  function Rd(e, t, n, s, l) {
    n = n.render;
    var u = t.ref;
    return gs(t, l), s = rc(e, t, n, s, u, l), n = oc(), e !== null && !Jt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, _r(e, t, l)) : (nt && n && Dl(t), t.flags |= 1, Ft(e, t, s, l), t.child);
  }
  function Od(e, t, n, s, l) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !Oc(u) && u.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = u, Td(e, t, u, s, l)) : (e = Ta(n.type, null, s, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, (e.lanes & l) === 0) {
      var m = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Br, n(m, s) && e.ref === t.ref) return _r(e, t, l);
    }
    return t.flags |= 1, e = oo(u, s), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Td(e, t, n, s, l) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Br(u, s) && e.ref === t.ref) if (Jt = !1, t.pendingProps = s = u, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Jt = !0);
      else return t.lanes = e.lanes, _r(e, t, l);
    }
    return fc(e, t, n, s, l);
  }
  function Md(e, t, n) {
    var s = t.pendingProps, l = s.children, u = e !== null ? e.memoizedState : null;
    if (s.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Xe(_s, cn), cn |= n;
    else {
      if ((n & 1073741824) === 0) return e = u !== null ? u.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, Xe(_s, cn), cn |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, s = u !== null ? u.baseLanes : n, Xe(_s, cn), cn |= s;
    }
    else u !== null ? (s = u.baseLanes | n, t.memoizedState = null) : s = n, Xe(_s, cn), cn |= s;
    return Ft(e, t, l, n), t.child;
  }
  function zd(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function fc(e, t, n, s, l) {
    var u = Qt(n) ? Po : $t.current;
    return u = ps(t, u), gs(t, l), n = rc(e, t, n, s, u, l), s = oc(), e !== null && !Jt ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, _r(e, t, l)) : (nt && s && Dl(t), t.flags |= 1, Ft(e, t, n, l), t.child);
  }
  function Ld(e, t, n, s, l) {
    if (Qt(n)) {
      var u = !0;
      ia(t);
    } else u = !1;
    if (gs(t, l), t.stateNode === null) ba(e, t), Ed(t, n, s), uc(t, n, s, l), s = !0;
    else if (e === null) {
      var m = t.stateNode, b = t.memoizedProps;
      m.props = b;
      var N = m.context, O = n.contextType;
      typeof O == "object" && O !== null ? O = _n(O) : (O = Qt(n) ? Po : $t.current, O = ps(t, O));
      var H = n.getDerivedStateFromProps, K = typeof H == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      K || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (b !== s || N !== O) && Cd(t, m, s, O), Gr = !1;
      var q = t.memoizedState;
      m.state = q, ma(t, s, m, l), N = t.memoizedState, b !== s || q !== N || Kt.current || Gr ? (typeof H == "function" && (cc(t, n, H, s), N = t.memoizedState), (b = Gr || jd(t, n, b, s, q, N, O)) ? (K || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = s, t.memoizedState = N), m.props = s, m.state = N, m.context = O, s = b) : (typeof m.componentDidMount == "function" && (t.flags |= 4194308), s = !1);
    } else {
      m = t.stateNode, ed(e, t), b = t.memoizedProps, O = t.type === t.elementType ? b : On(t.type, b), m.props = O, K = t.pendingProps, q = m.context, N = n.contextType, typeof N == "object" && N !== null ? N = _n(N) : (N = Qt(n) ? Po : $t.current, N = ps(t, N));
      var le = n.getDerivedStateFromProps;
      (H = typeof le == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (b !== K || q !== N) && Cd(t, m, s, N), Gr = !1, q = t.memoizedState, m.state = q, ma(t, s, m, l);
      var pe = t.memoizedState;
      b !== K || q !== pe || Kt.current || Gr ? (typeof le == "function" && (cc(t, n, le, s), pe = t.memoizedState), (O = Gr || jd(t, n, O, s, q, pe, N) || !1) ? (H || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(s, pe, N), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(s, pe, N)), typeof m.componentDidUpdate == "function" && (t.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || b === e.memoizedProps && q === e.memoizedState || (t.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || b === e.memoizedProps && q === e.memoizedState || (t.flags |= 1024), t.memoizedProps = s, t.memoizedState = pe), m.props = s, m.state = pe, m.context = N, s = O) : (typeof m.componentDidUpdate != "function" || b === e.memoizedProps && q === e.memoizedState || (t.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || b === e.memoizedProps && q === e.memoizedState || (t.flags |= 1024), s = !1);
    }
    return hc(e, t, n, s, u, l);
  }
  function hc(e, t, n, s, l, u) {
    zd(e, t);
    var m = (t.flags & 128) !== 0;
    if (!s && !m) return l && Wu(t, n, !1), _r(e, t, u);
    s = t.stateNode, ih.current = t;
    var b = m && typeof n.getDerivedStateFromError != "function" ? null : s.render();
    return t.flags |= 1, e !== null && m ? (t.child = ys(t, e.child, null, u), t.child = ys(t, null, b, u)) : Ft(e, t, b, u), t.memoizedState = s.state, l && Wu(t, n, !0), t.child;
  }
  function Fd(e) {
    var t = e.stateNode;
    t.pendingContext ? Uu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Uu(e, t.context, !1), Gl(e, t.containerInfo);
  }
  function Dd(e, t, n, s, l) {
    return ms(), Bl(l), t.flags |= 256, Ft(e, t, n, s), t.child;
  }
  var mc = { dehydrated: null, treeContext: null, retryLane: 0 };
  function yc(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Ud(e, t, n) {
    var s = t.pendingProps, l = ot.current, u = !1, m = (t.flags & 128) !== 0, b;
    if ((b = m) || (b = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), b ? (u = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), Xe(ot, l & 1), e === null)
      return Wl(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (m = s.children, e = s.fallback, u ? (s = t.mode, u = t.child, m = { mode: "hidden", children: m }, (s & 1) === 0 && u !== null ? (u.childLanes = 0, u.pendingProps = m) : u = Ma(m, s, 0, null), e = Uo(e, s, n, null), u.return = t, e.return = t, u.sibling = e, t.child = u, t.child.memoizedState = yc(n), t.memoizedState = mc, e) : vc(t, m));
    if (l = e.memoizedState, l !== null && (b = l.dehydrated, b !== null)) return ah(e, t, m, s, b, l, n);
    if (u) {
      u = s.fallback, m = t.mode, l = e.child, b = l.sibling;
      var N = { mode: "hidden", children: s.children };
      return (m & 1) === 0 && t.child !== l ? (s = t.child, s.childLanes = 0, s.pendingProps = N, t.deletions = null) : (s = oo(l, N), s.subtreeFlags = l.subtreeFlags & 14680064), b !== null ? u = oo(b, u) : (u = Uo(u, m, n, null), u.flags |= 2), u.return = t, s.return = t, s.sibling = u, t.child = s, s = u, u = t.child, m = e.child.memoizedState, m = m === null ? yc(n) : { baseLanes: m.baseLanes | n, cachePool: null, transitions: m.transitions }, u.memoizedState = m, u.childLanes = e.childLanes & ~n, t.memoizedState = mc, s;
    }
    return u = e.child, e = u.sibling, s = oo(u, { mode: "visible", children: s.children }), (t.mode & 1) === 0 && (s.lanes = n), s.return = t, s.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = s, t.memoizedState = null, s;
  }
  function vc(e, t) {
    return t = Ma({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Sa(e, t, n, s) {
    return s !== null && Bl(s), ys(t, e.child, null, n), e = vc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function ah(e, t, n, s, l, u, m) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, s = dc(Error(i(422))), Sa(e, t, m, s)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (u = s.fallback, l = t.mode, s = Ma({ mode: "visible", children: s.children }, l, 0, null), u = Uo(u, l, m, null), u.flags |= 2, s.return = t, u.return = t, s.sibling = u, t.child = s, (t.mode & 1) !== 0 && ys(t, e.child, null, m), t.child.memoizedState = yc(m), t.memoizedState = mc, u);
    if ((t.mode & 1) === 0) return Sa(e, t, m, null);
    if (l.data === "$!") {
      if (s = l.nextSibling && l.nextSibling.dataset, s) var b = s.dgst;
      return s = b, u = Error(i(419)), s = dc(u, s, void 0), Sa(e, t, m, s);
    }
    if (b = (m & e.childLanes) !== 0, Jt || b) {
      if (s = kt, s !== null) {
        switch (m & -m) {
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
        l = (l & (s.suspendedLanes | m)) !== 0 ? 0 : l, l !== 0 && l !== u.retryLane && (u.retryLane = l, kr(e, l), zn(s, e, l, -1));
      }
      return Rc(), s = dc(Error(i(421))), Sa(e, t, m, s);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = kh.bind(null, e), l._reactRetry = t, null) : (e = u.treeContext, ln = Hr(l.nextSibling), an = t, nt = !0, Rn = null, e !== null && (kn[xn++] = gr, kn[xn++] = wr, kn[xn++] = $o, gr = e.id, wr = e.overflow, $o = t), t = vc(t, s.children), t.flags |= 4096, t);
  }
  function Vd(e, t, n) {
    e.lanes |= t;
    var s = e.alternate;
    s !== null && (s.lanes |= t), Kl(e.return, t, n);
  }
  function gc(e, t, n, s, l) {
    var u = e.memoizedState;
    u === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: s, tail: n, tailMode: l } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = s, u.tail = n, u.tailMode = l);
  }
  function Wd(e, t, n) {
    var s = t.pendingProps, l = s.revealOrder, u = s.tail;
    if (Ft(e, t, s.children, n), s = ot.current, (s & 2) !== 0) s = s & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Vd(e, n, t);
        else if (e.tag === 19) Vd(e, n, t);
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
      s &= 1;
    }
    if (Xe(ot, s), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && ya(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), gc(t, !1, l, n, u);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && ya(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        gc(t, !0, n, null, u);
        break;
      case "together":
        gc(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function ba(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function _r(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), zo |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(i(153));
    if (t.child !== null) {
      for (e = t.child, n = oo(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = oo(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function lh(e, t, n) {
    switch (t.tag) {
      case 3:
        Fd(t), ms();
        break;
      case 5:
        rd(t);
        break;
      case 1:
        Qt(t.type) && ia(t);
        break;
      case 4:
        Gl(t, t.stateNode.containerInfo);
        break;
      case 10:
        var s = t.type._context, l = t.memoizedProps.value;
        Xe(pa, s._currentValue), s._currentValue = l;
        break;
      case 13:
        if (s = t.memoizedState, s !== null)
          return s.dehydrated !== null ? (Xe(ot, ot.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Ud(e, t, n) : (Xe(ot, ot.current & 1), e = _r(e, t, n), e !== null ? e.sibling : null);
        Xe(ot, ot.current & 1);
        break;
      case 19:
        if (s = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (s) return Wd(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), Xe(ot, ot.current), s) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Md(e, t, n);
    }
    return _r(e, t, n);
  }
  var Bd, wc, qd, Zd;
  Bd = function(e, t) {
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
  }, wc = function() {
  }, qd = function(e, t, n, s) {
    var l = e.memoizedProps;
    if (l !== s) {
      e = t.stateNode, To(Yn.current);
      var u = null;
      switch (n) {
        case "input":
          l = tn(e, l), s = tn(e, s), u = [];
          break;
        case "select":
          l = ne({}, l, { value: void 0 }), s = ne({}, s, { value: void 0 }), u = [];
          break;
        case "textarea":
          l = Os(e, l), s = Os(e, s), u = [];
          break;
        default:
          typeof l.onClick != "function" && typeof s.onClick == "function" && (e.onclick = ra);
      }
      Pr(n, s);
      var m;
      n = null;
      for (O in l) if (!s.hasOwnProperty(O) && l.hasOwnProperty(O) && l[O] != null) if (O === "style") {
        var b = l[O];
        for (m in b) b.hasOwnProperty(m) && (n || (n = {}), n[m] = "");
      } else O !== "dangerouslySetInnerHTML" && O !== "children" && O !== "suppressContentEditableWarning" && O !== "suppressHydrationWarning" && O !== "autoFocus" && (p.hasOwnProperty(O) ? u || (u = []) : (u = u || []).push(O, null));
      for (O in s) {
        var N = s[O];
        if (b = l != null ? l[O] : void 0, s.hasOwnProperty(O) && N !== b && (N != null || b != null)) if (O === "style") if (b) {
          for (m in b) !b.hasOwnProperty(m) || N && N.hasOwnProperty(m) || (n || (n = {}), n[m] = "");
          for (m in N) N.hasOwnProperty(m) && b[m] !== N[m] && (n || (n = {}), n[m] = N[m]);
        } else n || (u || (u = []), u.push(
          O,
          n
        )), n = N;
        else O === "dangerouslySetInnerHTML" ? (N = N ? N.__html : void 0, b = b ? b.__html : void 0, N != null && b !== N && (u = u || []).push(O, N)) : O === "children" ? typeof N != "string" && typeof N != "number" || (u = u || []).push(O, "" + N) : O !== "suppressContentEditableWarning" && O !== "suppressHydrationWarning" && (p.hasOwnProperty(O) ? (N != null && O === "onScroll" && Ye("scroll", e), u || b === N || (u = [])) : (u = u || []).push(O, N));
      }
      n && (u = u || []).push("style", n);
      var O = u;
      (t.updateQueue = O) && (t.flags |= 4);
    }
  }, Zd = function(e, t, n, s) {
    n !== s && (t.flags |= 4);
  };
  function wi(e, t) {
    if (!nt) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
        n === null ? e.tail = null : n.sibling = null;
        break;
      case "collapsed":
        n = e.tail;
        for (var s = null; n !== null; ) n.alternate !== null && (s = n), n = n.sibling;
        s === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : s.sibling = null;
    }
  }
  function Ot(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, s = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, s |= l.subtreeFlags & 14680064, s |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, s |= l.subtreeFlags, s |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= s, e.childLanes = n, t;
  }
  function ch(e, t, n) {
    var s = t.pendingProps;
    switch (Ul(t), t.tag) {
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
        return Ot(t), null;
      case 1:
        return Qt(t.type) && sa(), Ot(t), null;
      case 3:
        return s = t.stateNode, ws(), et(Kt), et($t), ec(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), (e === null || e.child === null) && (ua(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Rn !== null && (Ic(Rn), Rn = null))), wc(e, t), Ot(t), null;
      case 5:
        Xl(t);
        var l = To(hi.current);
        if (n = t.type, e !== null && t.stateNode != null) qd(e, t, n, s, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!s) {
            if (t.stateNode === null) throw Error(i(166));
            return Ot(t), null;
          }
          if (e = To(Yn.current), ua(t)) {
            s = t.stateNode, n = t.type;
            var u = t.memoizedProps;
            switch (s[Xn] = t, s[ci] = u, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                Ye("cancel", s), Ye("close", s);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ye("load", s);
                break;
              case "video":
              case "audio":
                for (l = 0; l < ii.length; l++) Ye(ii[l], s);
                break;
              case "source":
                Ye("error", s);
                break;
              case "img":
              case "image":
              case "link":
                Ye(
                  "error",
                  s
                ), Ye("load", s);
                break;
              case "details":
                Ye("toggle", s);
                break;
              case "input":
                Ps(s, u), Ye("invalid", s);
                break;
              case "select":
                s._wrapperState = { wasMultiple: !!u.multiple }, Ye("invalid", s);
                break;
              case "textarea":
                Mi(s, u), Ye("invalid", s);
            }
            Pr(n, u), l = null;
            for (var m in u) if (u.hasOwnProperty(m)) {
              var b = u[m];
              m === "children" ? typeof b == "string" ? s.textContent !== b && (u.suppressHydrationWarning !== !0 && na(s.textContent, b, e), l = ["children", b]) : typeof b == "number" && s.textContent !== "" + b && (u.suppressHydrationWarning !== !0 && na(
                s.textContent,
                b,
                e
              ), l = ["children", "" + b]) : p.hasOwnProperty(m) && b != null && m === "onScroll" && Ye("scroll", s);
            }
            switch (n) {
              case "input":
                zt(s), $s(s, u, !0);
                break;
              case "textarea":
                zt(s), zi(s);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof u.onClick == "function" && (s.onclick = ra);
            }
            s = l, t.updateQueue = s, s !== null && (t.flags |= 4);
          } else {
            m = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Ts(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = m.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof s.is == "string" ? e = m.createElement(n, { is: s.is }) : (e = m.createElement(n), n === "select" && (m = e, s.multiple ? m.multiple = !0 : s.size && (m.size = s.size))) : e = m.createElementNS(e, n), e[Xn] = t, e[ci] = s, Bd(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (m = fo(n, s), n) {
                case "dialog":
                  Ye("cancel", e), Ye("close", e), l = s;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ye("load", e), l = s;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < ii.length; l++) Ye(ii[l], e);
                  l = s;
                  break;
                case "source":
                  Ye("error", e), l = s;
                  break;
                case "img":
                case "image":
                case "link":
                  Ye(
                    "error",
                    e
                  ), Ye("load", e), l = s;
                  break;
                case "details":
                  Ye("toggle", e), l = s;
                  break;
                case "input":
                  Ps(e, s), l = tn(e, s), Ye("invalid", e);
                  break;
                case "option":
                  l = s;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!s.multiple }, l = ne({}, s, { value: void 0 }), Ye("invalid", e);
                  break;
                case "textarea":
                  Mi(e, s), l = Os(e, s), Ye("invalid", e);
                  break;
                default:
                  l = s;
              }
              Pr(n, l), b = l;
              for (u in b) if (b.hasOwnProperty(u)) {
                var N = b[u];
                u === "style" ? mn(e, N) : u === "dangerouslySetInnerHTML" ? (N = N ? N.__html : void 0, N != null && uo(e, N)) : u === "children" ? typeof N == "string" ? (n !== "textarea" || N !== "") && Dn(e, N) : typeof N == "number" && Dn(e, "" + N) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (p.hasOwnProperty(u) ? N != null && u === "onScroll" && Ye("scroll", e) : N != null && fe(e, u, N, m));
              }
              switch (n) {
                case "input":
                  zt(e), $s(e, s, !1);
                  break;
                case "textarea":
                  zt(e), zi(e);
                  break;
                case "option":
                  s.value != null && e.setAttribute("value", "" + Oe(s.value));
                  break;
                case "select":
                  e.multiple = !!s.multiple, u = s.value, u != null ? Ar(e, !!s.multiple, u, !1) : s.defaultValue != null && Ar(
                    e,
                    !!s.multiple,
                    s.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = ra);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  s = !!s.autoFocus;
                  break e;
                case "img":
                  s = !0;
                  break e;
                default:
                  s = !1;
              }
            }
            s && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return Ot(t), null;
      case 6:
        if (e && t.stateNode != null) Zd(e, t, e.memoizedProps, s);
        else {
          if (typeof s != "string" && t.stateNode === null) throw Error(i(166));
          if (n = To(hi.current), To(Yn.current), ua(t)) {
            if (s = t.stateNode, n = t.memoizedProps, s[Xn] = t, (u = s.nodeValue !== n) && (e = an, e !== null)) switch (e.tag) {
              case 3:
                na(s.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && na(s.nodeValue, n, (e.mode & 1) !== 0);
            }
            u && (t.flags |= 4);
          } else s = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(s), s[Xn] = t, t.stateNode = s;
        }
        return Ot(t), null;
      case 13:
        if (et(ot), s = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (nt && ln !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Qu(), ms(), t.flags |= 98560, u = !1;
          else if (u = ua(t), s !== null && s.dehydrated !== null) {
            if (e === null) {
              if (!u) throw Error(i(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(i(317));
              u[Xn] = t;
            } else ms(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ot(t), u = !1;
          } else Rn !== null && (Ic(Rn), Rn = null), u = !0;
          if (!u) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (s = s !== null, s !== (e !== null && e.memoizedState !== null) && s && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ot.current & 1) !== 0 ? vt === 0 && (vt = 3) : Rc())), t.updateQueue !== null && (t.flags |= 4), Ot(t), null);
      case 4:
        return ws(), wc(e, t), e === null && ai(t.stateNode.containerInfo), Ot(t), null;
      case 10:
        return Hl(t.type._context), Ot(t), null;
      case 17:
        return Qt(t.type) && sa(), Ot(t), null;
      case 19:
        if (et(ot), u = t.memoizedState, u === null) return Ot(t), null;
        if (s = (t.flags & 128) !== 0, m = u.rendering, m === null) if (s) wi(u, !1);
        else {
          if (vt !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (m = ya(e), m !== null) {
              for (t.flags |= 128, wi(u, !1), s = m.updateQueue, s !== null && (t.updateQueue = s, t.flags |= 4), t.subtreeFlags = 0, s = n, n = t.child; n !== null; ) u = n, e = s, u.flags &= 14680066, m = u.alternate, m === null ? (u.childLanes = 0, u.lanes = e, u.child = null, u.subtreeFlags = 0, u.memoizedProps = null, u.memoizedState = null, u.updateQueue = null, u.dependencies = null, u.stateNode = null) : (u.childLanes = m.childLanes, u.lanes = m.lanes, u.child = m.child, u.subtreeFlags = 0, u.deletions = null, u.memoizedProps = m.memoizedProps, u.memoizedState = m.memoizedState, u.updateQueue = m.updateQueue, u.type = m.type, e = m.dependencies, u.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return Xe(ot, ot.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          u.tail !== null && Ke() > Ss && (t.flags |= 128, s = !0, wi(u, !1), t.lanes = 4194304);
        }
        else {
          if (!s) if (e = ya(m), e !== null) {
            if (t.flags |= 128, s = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), wi(u, !0), u.tail === null && u.tailMode === "hidden" && !m.alternate && !nt) return Ot(t), null;
          } else 2 * Ke() - u.renderingStartTime > Ss && n !== 1073741824 && (t.flags |= 128, s = !0, wi(u, !1), t.lanes = 4194304);
          u.isBackwards ? (m.sibling = t.child, t.child = m) : (n = u.last, n !== null ? n.sibling = m : t.child = m, u.last = m);
        }
        return u.tail !== null ? (t = u.tail, u.rendering = t, u.tail = t.sibling, u.renderingStartTime = Ke(), t.sibling = null, n = ot.current, Xe(ot, s ? n & 1 | 2 : n & 1), t) : (Ot(t), null);
      case 22:
      case 23:
        return $c(), s = t.memoizedState !== null, e !== null && e.memoizedState !== null !== s && (t.flags |= 8192), s && (t.mode & 1) !== 0 ? (cn & 1073741824) !== 0 && (Ot(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ot(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(i(156, t.tag));
  }
  function uh(e, t) {
    switch (Ul(t), t.tag) {
      case 1:
        return Qt(t.type) && sa(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return ws(), et(Kt), et($t), ec(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Xl(t), null;
      case 13:
        if (et(ot), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(i(340));
          ms();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return et(ot), null;
      case 4:
        return ws(), null;
      case 10:
        return Hl(t.type._context), null;
      case 22:
      case 23:
        return $c(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ja = !1, Tt = !1, dh = typeof WeakSet == "function" ? WeakSet : Set, ce = null;
  function xs(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (s) {
      lt(e, t, s);
    }
    else n.current = null;
  }
  function kc(e, t, n) {
    try {
      n();
    } catch (s) {
      lt(e, t, s);
    }
  }
  var Hd = !1;
  function ph(e, t) {
    if ($l = Yo, e = ju(), bl(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var s = n.getSelection && n.getSelection();
        if (s && s.rangeCount !== 0) {
          n = s.anchorNode;
          var l = s.anchorOffset, u = s.focusNode;
          s = s.focusOffset;
          try {
            n.nodeType, u.nodeType;
          } catch {
            n = null;
            break e;
          }
          var m = 0, b = -1, N = -1, O = 0, H = 0, K = e, q = null;
          t: for (; ; ) {
            for (var le; K !== n || l !== 0 && K.nodeType !== 3 || (b = m + l), K !== u || s !== 0 && K.nodeType !== 3 || (N = m + s), K.nodeType === 3 && (m += K.nodeValue.length), (le = K.firstChild) !== null; )
              q = K, K = le;
            for (; ; ) {
              if (K === e) break t;
              if (q === n && ++O === l && (b = m), q === u && ++H === s && (N = m), (le = K.nextSibling) !== null) break;
              K = q, q = K.parentNode;
            }
            K = le;
          }
          n = b === -1 || N === -1 ? null : { start: b, end: N };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Rl = { focusedElem: e, selectionRange: n }, Yo = !1, ce = t; ce !== null; ) if (t = ce, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, ce = e;
    else for (; ce !== null; ) {
      t = ce;
      try {
        var pe = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (pe !== null) {
              var ye = pe.memoizedProps, ft = pe.memoizedState, $ = t.stateNode, I = $.getSnapshotBeforeUpdate(t.elementType === t.type ? ye : On(t.type, ye), ft);
              $.__reactInternalSnapshotBeforeUpdate = I;
            }
            break;
          case 3:
            var R = t.stateNode.containerInfo;
            R.nodeType === 1 ? R.textContent = "" : R.nodeType === 9 && R.documentElement && R.removeChild(R.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(i(163));
        }
      } catch (G) {
        lt(t, t.return, G);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, ce = e;
        break;
      }
      ce = t.return;
    }
    return pe = Hd, Hd = !1, pe;
  }
  function ki(e, t, n) {
    var s = t.updateQueue;
    if (s = s !== null ? s.lastEffect : null, s !== null) {
      var l = s = s.next;
      do {
        if ((l.tag & e) === e) {
          var u = l.destroy;
          l.destroy = void 0, u !== void 0 && kc(t, n, u);
        }
        l = l.next;
      } while (l !== s);
    }
  }
  function Ea(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var n = t = t.next;
      do {
        if ((n.tag & e) === e) {
          var s = n.create;
          n.destroy = s();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function xc(e) {
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
  function Kd(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Kd(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Xn], delete t[ci], delete t[zl], delete t[Kf], delete t[Qf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Qd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Jd(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Qd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function _c(e, t, n) {
    var s = e.tag;
    if (s === 5 || s === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ra));
    else if (s !== 4 && (e = e.child, e !== null)) for (_c(e, t, n), e = e.sibling; e !== null; ) _c(e, t, n), e = e.sibling;
  }
  function Sc(e, t, n) {
    var s = e.tag;
    if (s === 5 || s === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (s !== 4 && (e = e.child, e !== null)) for (Sc(e, t, n), e = e.sibling; e !== null; ) Sc(e, t, n), e = e.sibling;
  }
  var bt = null, Tn = !1;
  function Yr(e, t, n) {
    for (n = n.child; n !== null; ) Gd(e, t, n), n = n.sibling;
  }
  function Gd(e, t, n) {
    if (on && typeof on.onCommitFiberUnmount == "function") try {
      on.onCommitFiberUnmount(Qo, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Tt || xs(n, t);
      case 6:
        var s = bt, l = Tn;
        bt = null, Yr(e, t, n), bt = s, Tn = l, bt !== null && (Tn ? (e = bt, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : bt.removeChild(n.stateNode));
        break;
      case 18:
        bt !== null && (Tn ? (e = bt, n = n.stateNode, e.nodeType === 8 ? Ml(e.parentNode, n) : e.nodeType === 1 && Ml(e, n), _o(e)) : Ml(bt, n.stateNode));
        break;
      case 4:
        s = bt, l = Tn, bt = n.stateNode.containerInfo, Tn = !0, Yr(e, t, n), bt = s, Tn = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Tt && (s = n.updateQueue, s !== null && (s = s.lastEffect, s !== null))) {
          l = s = s.next;
          do {
            var u = l, m = u.destroy;
            u = u.tag, m !== void 0 && ((u & 2) !== 0 || (u & 4) !== 0) && kc(n, t, m), l = l.next;
          } while (l !== s);
        }
        Yr(e, t, n);
        break;
      case 1:
        if (!Tt && (xs(n, t), s = n.stateNode, typeof s.componentWillUnmount == "function")) try {
          s.props = n.memoizedProps, s.state = n.memoizedState, s.componentWillUnmount();
        } catch (b) {
          lt(n, t, b);
        }
        Yr(e, t, n);
        break;
      case 21:
        Yr(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Tt = (s = Tt) || n.memoizedState !== null, Yr(e, t, n), Tt = s) : Yr(e, t, n);
        break;
      default:
        Yr(e, t, n);
    }
  }
  function Xd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new dh()), t.forEach(function(s) {
        var l = xh.bind(null, e, s);
        n.has(s) || (n.add(s), s.then(l, l));
      });
    }
  }
  function Mn(e, t) {
    var n = t.deletions;
    if (n !== null) for (var s = 0; s < n.length; s++) {
      var l = n[s];
      try {
        var u = e, m = t, b = m;
        e: for (; b !== null; ) {
          switch (b.tag) {
            case 5:
              bt = b.stateNode, Tn = !1;
              break e;
            case 3:
              bt = b.stateNode.containerInfo, Tn = !0;
              break e;
            case 4:
              bt = b.stateNode.containerInfo, Tn = !0;
              break e;
          }
          b = b.return;
        }
        if (bt === null) throw Error(i(160));
        Gd(u, m, l), bt = null, Tn = !1;
        var N = l.alternate;
        N !== null && (N.return = null), l.return = null;
      } catch (O) {
        lt(l, t, O);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Yd(t, e), t = t.sibling;
  }
  function Yd(e, t) {
    var n = e.alternate, s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (Mn(t, e), tr(e), s & 4) {
          try {
            ki(3, e, e.return), Ea(3, e);
          } catch (ye) {
            lt(e, e.return, ye);
          }
          try {
            ki(5, e, e.return);
          } catch (ye) {
            lt(e, e.return, ye);
          }
        }
        break;
      case 1:
        Mn(t, e), tr(e), s & 512 && n !== null && xs(n, n.return);
        break;
      case 5:
        if (Mn(t, e), tr(e), s & 512 && n !== null && xs(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Dn(l, "");
          } catch (ye) {
            lt(e, e.return, ye);
          }
        }
        if (s & 4 && (l = e.stateNode, l != null)) {
          var u = e.memoizedProps, m = n !== null ? n.memoizedProps : u, b = e.type, N = e.updateQueue;
          if (e.updateQueue = null, N !== null) try {
            b === "input" && u.type === "radio" && u.name != null && Cr(l, u), fo(b, m);
            var O = fo(b, u);
            for (m = 0; m < N.length; m += 2) {
              var H = N[m], K = N[m + 1];
              H === "style" ? mn(l, K) : H === "dangerouslySetInnerHTML" ? uo(l, K) : H === "children" ? Dn(l, K) : fe(l, H, K, O);
            }
            switch (b) {
              case "input":
                ut(l, u);
                break;
              case "textarea":
                Bo(l, u);
                break;
              case "select":
                var q = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!u.multiple;
                var le = u.value;
                le != null ? Ar(l, !!u.multiple, le, !1) : q !== !!u.multiple && (u.defaultValue != null ? Ar(
                  l,
                  !!u.multiple,
                  u.defaultValue,
                  !0
                ) : Ar(l, !!u.multiple, u.multiple ? [] : "", !1));
            }
            l[ci] = u;
          } catch (ye) {
            lt(e, e.return, ye);
          }
        }
        break;
      case 6:
        if (Mn(t, e), tr(e), s & 4) {
          if (e.stateNode === null) throw Error(i(162));
          l = e.stateNode, u = e.memoizedProps;
          try {
            l.nodeValue = u;
          } catch (ye) {
            lt(e, e.return, ye);
          }
        }
        break;
      case 3:
        if (Mn(t, e), tr(e), s & 4 && n !== null && n.memoizedState.isDehydrated) try {
          _o(t.containerInfo);
        } catch (ye) {
          lt(e, e.return, ye);
        }
        break;
      case 4:
        Mn(t, e), tr(e);
        break;
      case 13:
        Mn(t, e), tr(e), l = e.child, l.flags & 8192 && (u = l.memoizedState !== null, l.stateNode.isHidden = u, !u || l.alternate !== null && l.alternate.memoizedState !== null || (Ec = Ke())), s & 4 && Xd(e);
        break;
      case 22:
        if (H = n !== null && n.memoizedState !== null, e.mode & 1 ? (Tt = (O = Tt) || H, Mn(t, e), Tt = O) : Mn(t, e), tr(e), s & 8192) {
          if (O = e.memoizedState !== null, (e.stateNode.isHidden = O) && !H && (e.mode & 1) !== 0) for (ce = e, H = e.child; H !== null; ) {
            for (K = ce = H; ce !== null; ) {
              switch (q = ce, le = q.child, q.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ki(4, q, q.return);
                  break;
                case 1:
                  xs(q, q.return);
                  var pe = q.stateNode;
                  if (typeof pe.componentWillUnmount == "function") {
                    s = q, n = q.return;
                    try {
                      t = s, pe.props = t.memoizedProps, pe.state = t.memoizedState, pe.componentWillUnmount();
                    } catch (ye) {
                      lt(s, n, ye);
                    }
                  }
                  break;
                case 5:
                  xs(q, q.return);
                  break;
                case 22:
                  if (q.memoizedState !== null) {
                    np(K);
                    continue;
                  }
              }
              le !== null ? (le.return = q, ce = le) : np(K);
            }
            H = H.sibling;
          }
          e: for (H = null, K = e; ; ) {
            if (K.tag === 5) {
              if (H === null) {
                H = K;
                try {
                  l = K.stateNode, O ? (u = l.style, typeof u.setProperty == "function" ? u.setProperty("display", "none", "important") : u.display = "none") : (b = K.stateNode, N = K.memoizedProps.style, m = N != null && N.hasOwnProperty("display") ? N.display : null, b.style.display = po("display", m));
                } catch (ye) {
                  lt(e, e.return, ye);
                }
              }
            } else if (K.tag === 6) {
              if (H === null) try {
                K.stateNode.nodeValue = O ? "" : K.memoizedProps;
              } catch (ye) {
                lt(e, e.return, ye);
              }
            } else if ((K.tag !== 22 && K.tag !== 23 || K.memoizedState === null || K === e) && K.child !== null) {
              K.child.return = K, K = K.child;
              continue;
            }
            if (K === e) break e;
            for (; K.sibling === null; ) {
              if (K.return === null || K.return === e) break e;
              H === K && (H = null), K = K.return;
            }
            H === K && (H = null), K.sibling.return = K.return, K = K.sibling;
          }
        }
        break;
      case 19:
        Mn(t, e), tr(e), s & 4 && Xd(e);
        break;
      case 21:
        break;
      default:
        Mn(
          t,
          e
        ), tr(e);
    }
  }
  function tr(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Qd(n)) {
              var s = n;
              break e;
            }
            n = n.return;
          }
          throw Error(i(160));
        }
        switch (s.tag) {
          case 5:
            var l = s.stateNode;
            s.flags & 32 && (Dn(l, ""), s.flags &= -33);
            var u = Jd(e);
            Sc(e, u, l);
            break;
          case 3:
          case 4:
            var m = s.stateNode.containerInfo, b = Jd(e);
            _c(e, b, m);
            break;
          default:
            throw Error(i(161));
        }
      } catch (N) {
        lt(e, e.return, N);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function fh(e, t, n) {
    ce = e, ep(e);
  }
  function ep(e, t, n) {
    for (var s = (e.mode & 1) !== 0; ce !== null; ) {
      var l = ce, u = l.child;
      if (l.tag === 22 && s) {
        var m = l.memoizedState !== null || ja;
        if (!m) {
          var b = l.alternate, N = b !== null && b.memoizedState !== null || Tt;
          b = ja;
          var O = Tt;
          if (ja = m, (Tt = N) && !O) for (ce = l; ce !== null; ) m = ce, N = m.child, m.tag === 22 && m.memoizedState !== null ? rp(l) : N !== null ? (N.return = m, ce = N) : rp(l);
          for (; u !== null; ) ce = u, ep(u), u = u.sibling;
          ce = l, ja = b, Tt = O;
        }
        tp(e);
      } else (l.subtreeFlags & 8772) !== 0 && u !== null ? (u.return = l, ce = u) : tp(e);
    }
  }
  function tp(e) {
    for (; ce !== null; ) {
      var t = ce;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Tt || Ea(5, t);
              break;
            case 1:
              var s = t.stateNode;
              if (t.flags & 4 && !Tt) if (n === null) s.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : On(t.type, n.memoizedProps);
                s.componentDidUpdate(l, n.memoizedState, s.__reactInternalSnapshotBeforeUpdate);
              }
              var u = t.updateQueue;
              u !== null && nd(t, u, s);
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
                nd(t, m, n);
              }
              break;
            case 5:
              var b = t.stateNode;
              if (n === null && t.flags & 4) {
                n = b;
                var N = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    N.autoFocus && n.focus();
                    break;
                  case "img":
                    N.src && (n.src = N.src);
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
                var O = t.alternate;
                if (O !== null) {
                  var H = O.memoizedState;
                  if (H !== null) {
                    var K = H.dehydrated;
                    K !== null && _o(K);
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
              throw Error(i(163));
          }
          Tt || t.flags & 512 && xc(t);
        } catch (q) {
          lt(t, t.return, q);
        }
      }
      if (t === e) {
        ce = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, ce = n;
        break;
      }
      ce = t.return;
    }
  }
  function np(e) {
    for (; ce !== null; ) {
      var t = ce;
      if (t === e) {
        ce = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, ce = n;
        break;
      }
      ce = t.return;
    }
  }
  function rp(e) {
    for (; ce !== null; ) {
      var t = ce;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Ea(4, t);
            } catch (N) {
              lt(t, n, N);
            }
            break;
          case 1:
            var s = t.stateNode;
            if (typeof s.componentDidMount == "function") {
              var l = t.return;
              try {
                s.componentDidMount();
              } catch (N) {
                lt(t, l, N);
              }
            }
            var u = t.return;
            try {
              xc(t);
            } catch (N) {
              lt(t, u, N);
            }
            break;
          case 5:
            var m = t.return;
            try {
              xc(t);
            } catch (N) {
              lt(t, m, N);
            }
        }
      } catch (N) {
        lt(t, t.return, N);
      }
      if (t === e) {
        ce = null;
        break;
      }
      var b = t.sibling;
      if (b !== null) {
        b.return = t.return, ce = b;
        break;
      }
      ce = t.return;
    }
  }
  var hh = Math.ceil, Ca = ae.ReactCurrentDispatcher, bc = ae.ReactCurrentOwner, bn = ae.ReactCurrentBatchConfig, Be = 0, kt = null, mt = null, jt = 0, cn = 0, _s = Kr(0), vt = 0, xi = null, zo = 0, Na = 0, jc = 0, _i = null, Gt = null, Ec = 0, Ss = 1 / 0, Sr = null, Aa = !1, Cc = null, eo = null, Ia = !1, to = null, Pa = 0, Si = 0, Nc = null, $a = -1, Ra = 0;
  function Dt() {
    return (Be & 6) !== 0 ? Ke() : $a !== -1 ? $a : $a = Ke();
  }
  function no(e) {
    return (e.mode & 1) === 0 ? 1 : (Be & 2) !== 0 && jt !== 0 ? jt & -jt : Gf.transition !== null ? (Ra === 0 && (Ra = qs()), Ra) : (e = He, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Bi(e.type)), e);
  }
  function zn(e, t, n, s) {
    if (50 < Si) throw Si = 0, Nc = null, Error(i(185));
    go(e, n, s), ((Be & 2) === 0 || e !== kt) && (e === kt && ((Be & 2) === 0 && (Na |= n), vt === 4 && ro(e, jt)), Xt(e, s), n === 1 && Be === 0 && (t.mode & 1) === 0 && (Ss = Ke() + 500, aa && Jr()));
  }
  function Xt(e, t) {
    var n = e.callbackNode;
    Kn(e, t);
    var s = Hn(e, e === kt ? jt : 0);
    if (s === 0) n !== null && Us(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = s & -s, e.callbackPriority !== t) {
      if (n != null && Us(n), t === 1) e.tag === 0 ? Jf(sp.bind(null, e)) : Bu(sp.bind(null, e)), Zf(function() {
        (Be & 6) === 0 && Jr();
      }), n = null;
      else {
        switch (Ui(s)) {
          case 1:
            n = Ho;
            break;
          case 4:
            n = pr;
            break;
          case 16:
            n = yo;
            break;
          case 536870912:
            n = Ko;
            break;
          default:
            n = yo;
        }
        n = fp(n, op.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function op(e, t) {
    if ($a = -1, Ra = 0, (Be & 6) !== 0) throw Error(i(327));
    var n = e.callbackNode;
    if (bs() && e.callbackNode !== n) return null;
    var s = Hn(e, e === kt ? jt : 0);
    if (s === 0) return null;
    if ((s & 30) !== 0 || (s & e.expiredLanes) !== 0 || t) t = Oa(e, s);
    else {
      t = s;
      var l = Be;
      Be |= 2;
      var u = ap();
      (kt !== e || jt !== t) && (Sr = null, Ss = Ke() + 500, Fo(e, t));
      do
        try {
          vh();
          break;
        } catch (b) {
          ip(e, b);
        }
      while (!0);
      Zl(), Ca.current = u, Be = l, mt !== null ? t = 0 : (kt = null, jt = 0, t = vt);
    }
    if (t !== 0) {
      if (t === 2 && (l = Bs(e), l !== 0 && (s = l, t = Ac(e, l))), t === 1) throw n = xi, Fo(e, 0), ro(e, s), Xt(e, Ke()), n;
      if (t === 6) ro(e, s);
      else {
        if (l = e.current.alternate, (s & 30) === 0 && !mh(l) && (t = Oa(e, s), t === 2 && (u = Bs(e), u !== 0 && (s = u, t = Ac(e, u))), t === 1)) throw n = xi, Fo(e, 0), ro(e, s), Xt(e, Ke()), n;
        switch (e.finishedWork = l, e.finishedLanes = s, t) {
          case 0:
          case 1:
            throw Error(i(345));
          case 2:
            Do(e, Gt, Sr);
            break;
          case 3:
            if (ro(e, s), (s & 130023424) === s && (t = Ec + 500 - Ke(), 10 < t)) {
              if (Hn(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & s) !== s) {
                Dt(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Tl(Do.bind(null, e, Gt, Sr), t);
              break;
            }
            Do(e, Gt, Sr);
            break;
          case 4:
            if (ro(e, s), (s & 4194240) === s) break;
            for (t = e.eventTimes, l = -1; 0 < s; ) {
              var m = 31 - At(s);
              u = 1 << m, m = t[m], m > l && (l = m), s &= ~u;
            }
            if (s = l, s = Ke() - s, s = (120 > s ? 120 : 480 > s ? 480 : 1080 > s ? 1080 : 1920 > s ? 1920 : 3e3 > s ? 3e3 : 4320 > s ? 4320 : 1960 * hh(s / 1960)) - s, 10 < s) {
              e.timeoutHandle = Tl(Do.bind(null, e, Gt, Sr), s);
              break;
            }
            Do(e, Gt, Sr);
            break;
          case 5:
            Do(e, Gt, Sr);
            break;
          default:
            throw Error(i(329));
        }
      }
    }
    return Xt(e, Ke()), e.callbackNode === n ? op.bind(null, e) : null;
  }
  function Ac(e, t) {
    var n = _i;
    return e.current.memoizedState.isDehydrated && (Fo(e, t).flags |= 256), e = Oa(e, t), e !== 2 && (t = Gt, Gt = n, t !== null && Ic(t)), e;
  }
  function Ic(e) {
    Gt === null ? Gt = e : Gt.push.apply(Gt, e);
  }
  function mh(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var s = 0; s < n.length; s++) {
          var l = n[s], u = l.getSnapshot;
          l = l.value;
          try {
            if (!Ht(u(), l)) return !1;
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
  function ro(e, t) {
    for (t &= ~jc, t &= ~Na, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - At(t), s = 1 << n;
      e[n] = -1, t &= ~s;
    }
  }
  function sp(e) {
    if ((Be & 6) !== 0) throw Error(i(327));
    bs();
    var t = Hn(e, 0);
    if ((t & 1) === 0) return Xt(e, Ke()), null;
    var n = Oa(e, t);
    if (e.tag !== 0 && n === 2) {
      var s = Bs(e);
      s !== 0 && (t = s, n = Ac(e, s));
    }
    if (n === 1) throw n = xi, Fo(e, 0), ro(e, t), Xt(e, Ke()), n;
    if (n === 6) throw Error(i(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Do(e, Gt, Sr), Xt(e, Ke()), null;
  }
  function Pc(e, t) {
    var n = Be;
    Be |= 1;
    try {
      return e(t);
    } finally {
      Be = n, Be === 0 && (Ss = Ke() + 500, aa && Jr());
    }
  }
  function Lo(e) {
    to !== null && to.tag === 0 && (Be & 6) === 0 && bs();
    var t = Be;
    Be |= 1;
    var n = bn.transition, s = He;
    try {
      if (bn.transition = null, He = 1, e) return e();
    } finally {
      He = s, bn.transition = n, Be = t, (Be & 6) === 0 && Jr();
    }
  }
  function $c() {
    cn = _s.current, et(_s);
  }
  function Fo(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, qf(n)), mt !== null) for (n = mt.return; n !== null; ) {
      var s = n;
      switch (Ul(s), s.tag) {
        case 1:
          s = s.type.childContextTypes, s != null && sa();
          break;
        case 3:
          ws(), et(Kt), et($t), ec();
          break;
        case 5:
          Xl(s);
          break;
        case 4:
          ws();
          break;
        case 13:
          et(ot);
          break;
        case 19:
          et(ot);
          break;
        case 10:
          Hl(s.type._context);
          break;
        case 22:
        case 23:
          $c();
      }
      n = n.return;
    }
    if (kt = e, mt = e = oo(e.current, null), jt = cn = t, vt = 0, xi = null, jc = Na = zo = 0, Gt = _i = null, Oo !== null) {
      for (t = 0; t < Oo.length; t++) if (n = Oo[t], s = n.interleaved, s !== null) {
        n.interleaved = null;
        var l = s.next, u = n.pending;
        if (u !== null) {
          var m = u.next;
          u.next = l, s.next = m;
        }
        n.pending = s;
      }
      Oo = null;
    }
    return e;
  }
  function ip(e, t) {
    do {
      var n = mt;
      try {
        if (Zl(), va.current = xa, ga) {
          for (var s = st.memoizedState; s !== null; ) {
            var l = s.queue;
            l !== null && (l.pending = null), s = s.next;
          }
          ga = !1;
        }
        if (Mo = 0, wt = yt = st = null, mi = !1, yi = 0, bc.current = null, n === null || n.return === null) {
          vt = 1, xi = t, mt = null;
          break;
        }
        e: {
          var u = e, m = n.return, b = n, N = t;
          if (t = jt, b.flags |= 32768, N !== null && typeof N == "object" && typeof N.then == "function") {
            var O = N, H = b, K = H.tag;
            if ((H.mode & 1) === 0 && (K === 0 || K === 11 || K === 15)) {
              var q = H.alternate;
              q ? (H.updateQueue = q.updateQueue, H.memoizedState = q.memoizedState, H.lanes = q.lanes) : (H.updateQueue = null, H.memoizedState = null);
            }
            var le = Pd(m);
            if (le !== null) {
              le.flags &= -257, $d(le, m, b, u, t), le.mode & 1 && Id(u, O, t), t = le, N = O;
              var pe = t.updateQueue;
              if (pe === null) {
                var ye = /* @__PURE__ */ new Set();
                ye.add(N), t.updateQueue = ye;
              } else pe.add(N);
              break e;
            } else {
              if ((t & 1) === 0) {
                Id(u, O, t), Rc();
                break e;
              }
              N = Error(i(426));
            }
          } else if (nt && b.mode & 1) {
            var ft = Pd(m);
            if (ft !== null) {
              (ft.flags & 65536) === 0 && (ft.flags |= 256), $d(ft, m, b, u, t), Bl(ks(N, b));
              break e;
            }
          }
          u = N = ks(N, b), vt !== 4 && (vt = 2), _i === null ? _i = [u] : _i.push(u), u = m;
          do {
            switch (u.tag) {
              case 3:
                u.flags |= 65536, t &= -t, u.lanes |= t;
                var $ = Nd(u, N, t);
                td(u, $);
                break e;
              case 1:
                b = N;
                var I = u.type, R = u.stateNode;
                if ((u.flags & 128) === 0 && (typeof I.getDerivedStateFromError == "function" || R !== null && typeof R.componentDidCatch == "function" && (eo === null || !eo.has(R)))) {
                  u.flags |= 65536, t &= -t, u.lanes |= t;
                  var G = Ad(u, b, t);
                  td(u, G);
                  break e;
                }
            }
            u = u.return;
          } while (u !== null);
        }
        cp(n);
      } catch (ve) {
        t = ve, mt === n && n !== null && (mt = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ap() {
    var e = Ca.current;
    return Ca.current = xa, e === null ? xa : e;
  }
  function Rc() {
    (vt === 0 || vt === 3 || vt === 2) && (vt = 4), kt === null || (zo & 268435455) === 0 && (Na & 268435455) === 0 || ro(kt, jt);
  }
  function Oa(e, t) {
    var n = Be;
    Be |= 2;
    var s = ap();
    (kt !== e || jt !== t) && (Sr = null, Fo(e, t));
    do
      try {
        yh();
        break;
      } catch (l) {
        ip(e, l);
      }
    while (!0);
    if (Zl(), Be = n, Ca.current = s, mt !== null) throw Error(i(261));
    return kt = null, jt = 0, vt;
  }
  function yh() {
    for (; mt !== null; ) lp(mt);
  }
  function vh() {
    for (; mt !== null && !Zo(); ) lp(mt);
  }
  function lp(e) {
    var t = pp(e.alternate, e, cn);
    e.memoizedProps = e.pendingProps, t === null ? cp(e) : mt = t, bc.current = null;
  }
  function cp(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = ch(n, t, cn), n !== null) {
          mt = n;
          return;
        }
      } else {
        if (n = uh(n, t), n !== null) {
          n.flags &= 32767, mt = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          vt = 6, mt = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        mt = t;
        return;
      }
      mt = t = e;
    } while (t !== null);
    vt === 0 && (vt = 5);
  }
  function Do(e, t, n) {
    var s = He, l = bn.transition;
    try {
      bn.transition = null, He = 1, gh(e, t, n, s);
    } finally {
      bn.transition = l, He = s;
    }
    return null;
  }
  function gh(e, t, n, s) {
    do
      bs();
    while (to !== null);
    if ((Be & 6) !== 0) throw Error(i(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(i(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var u = n.lanes | n.childLanes;
    if (Jo(e, u), e === kt && (mt = kt = null, jt = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Ia || (Ia = !0, fp(yo, function() {
      return bs(), null;
    })), u = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || u) {
      u = bn.transition, bn.transition = null;
      var m = He;
      He = 1;
      var b = Be;
      Be |= 4, bc.current = null, ph(e, n), Yd(n, e), Lf(Rl), Yo = !!$l, Rl = $l = null, e.current = n, fh(n), Vs(), Be = b, He = m, bn.transition = u;
    } else e.current = n;
    if (Ia && (Ia = !1, to = e, Pa = l), u = e.pendingLanes, u === 0 && (eo = null), An(n.stateNode), Xt(e, Ke()), t !== null) for (s = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], s(l.value, { componentStack: l.stack, digest: l.digest });
    if (Aa) throw Aa = !1, e = Cc, Cc = null, e;
    return (Pa & 1) !== 0 && e.tag !== 0 && bs(), u = e.pendingLanes, (u & 1) !== 0 ? e === Nc ? Si++ : (Si = 0, Nc = e) : Si = 0, Jr(), null;
  }
  function bs() {
    if (to !== null) {
      var e = Ui(Pa), t = bn.transition, n = He;
      try {
        if (bn.transition = null, He = 16 > e ? 16 : e, to === null) var s = !1;
        else {
          if (e = to, to = null, Pa = 0, (Be & 6) !== 0) throw Error(i(331));
          var l = Be;
          for (Be |= 4, ce = e.current; ce !== null; ) {
            var u = ce, m = u.child;
            if ((ce.flags & 16) !== 0) {
              var b = u.deletions;
              if (b !== null) {
                for (var N = 0; N < b.length; N++) {
                  var O = b[N];
                  for (ce = O; ce !== null; ) {
                    var H = ce;
                    switch (H.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ki(8, H, u);
                    }
                    var K = H.child;
                    if (K !== null) K.return = H, ce = K;
                    else for (; ce !== null; ) {
                      H = ce;
                      var q = H.sibling, le = H.return;
                      if (Kd(H), H === O) {
                        ce = null;
                        break;
                      }
                      if (q !== null) {
                        q.return = le, ce = q;
                        break;
                      }
                      ce = le;
                    }
                  }
                }
                var pe = u.alternate;
                if (pe !== null) {
                  var ye = pe.child;
                  if (ye !== null) {
                    pe.child = null;
                    do {
                      var ft = ye.sibling;
                      ye.sibling = null, ye = ft;
                    } while (ye !== null);
                  }
                }
                ce = u;
              }
            }
            if ((u.subtreeFlags & 2064) !== 0 && m !== null) m.return = u, ce = m;
            else e: for (; ce !== null; ) {
              if (u = ce, (u.flags & 2048) !== 0) switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  ki(9, u, u.return);
              }
              var $ = u.sibling;
              if ($ !== null) {
                $.return = u.return, ce = $;
                break e;
              }
              ce = u.return;
            }
          }
          var I = e.current;
          for (ce = I; ce !== null; ) {
            m = ce;
            var R = m.child;
            if ((m.subtreeFlags & 2064) !== 0 && R !== null) R.return = m, ce = R;
            else e: for (m = I; ce !== null; ) {
              if (b = ce, (b.flags & 2048) !== 0) try {
                switch (b.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ea(9, b);
                }
              } catch (ve) {
                lt(b, b.return, ve);
              }
              if (b === m) {
                ce = null;
                break e;
              }
              var G = b.sibling;
              if (G !== null) {
                G.return = b.return, ce = G;
                break e;
              }
              ce = b.return;
            }
          }
          if (Be = l, Jr(), on && typeof on.onPostCommitFiberRoot == "function") try {
            on.onPostCommitFiberRoot(Qo, e);
          } catch {
          }
          s = !0;
        }
        return s;
      } finally {
        He = n, bn.transition = t;
      }
    }
    return !1;
  }
  function up(e, t, n) {
    t = ks(n, t), t = Nd(e, t, 1), e = Xr(e, t, 1), t = Dt(), e !== null && (go(e, 1, t), Xt(e, t));
  }
  function lt(e, t, n) {
    if (e.tag === 3) up(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        up(t, e, n);
        break;
      } else if (t.tag === 1) {
        var s = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (eo === null || !eo.has(s))) {
          e = ks(n, e), e = Ad(t, e, 1), t = Xr(t, e, 1), e = Dt(), t !== null && (go(t, 1, e), Xt(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function wh(e, t, n) {
    var s = e.pingCache;
    s !== null && s.delete(t), t = Dt(), e.pingedLanes |= e.suspendedLanes & n, kt === e && (jt & n) === n && (vt === 4 || vt === 3 && (jt & 130023424) === jt && 500 > Ke() - Ec ? Fo(e, 0) : jc |= n), Xt(e, t);
  }
  function dp(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = It, It <<= 1, (It & 130023424) === 0 && (It = 4194304)));
    var n = Dt();
    e = kr(e, t), e !== null && (go(e, t, n), Xt(e, n));
  }
  function kh(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), dp(e, n);
  }
  function xh(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var s = e.stateNode, l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        s = e.stateNode;
        break;
      default:
        throw Error(i(314));
    }
    s !== null && s.delete(t), dp(e, n);
  }
  var pp;
  pp = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Kt.current) Jt = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Jt = !1, lh(e, t, n);
      Jt = (e.flags & 131072) !== 0;
    }
    else Jt = !1, nt && (t.flags & 1048576) !== 0 && qu(t, ca, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var s = t.type;
        ba(e, t), e = t.pendingProps;
        var l = ps(t, $t.current);
        gs(t, n), l = rc(null, t, s, e, l, n);
        var u = oc();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Qt(s) ? (u = !0, ia(t)) : u = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Jl(t), l.updater = _a, t.stateNode = l, l._reactInternals = t, uc(t, s, e, n), t = hc(null, t, s, !0, u, n)) : (t.tag = 0, nt && u && Dl(t), Ft(null, t, l, n), t = t.child), t;
      case 16:
        s = t.elementType;
        e: {
          switch (ba(e, t), e = t.pendingProps, l = s._init, s = l(s._payload), t.type = s, l = t.tag = Sh(s), e = On(s, e), l) {
            case 0:
              t = fc(null, t, s, e, n);
              break e;
            case 1:
              t = Ld(null, t, s, e, n);
              break e;
            case 11:
              t = Rd(null, t, s, e, n);
              break e;
            case 14:
              t = Od(null, t, s, On(s.type, e), n);
              break e;
          }
          throw Error(i(
            306,
            s,
            ""
          ));
        }
        return t;
      case 0:
        return s = t.type, l = t.pendingProps, l = t.elementType === s ? l : On(s, l), fc(e, t, s, l, n);
      case 1:
        return s = t.type, l = t.pendingProps, l = t.elementType === s ? l : On(s, l), Ld(e, t, s, l, n);
      case 3:
        e: {
          if (Fd(t), e === null) throw Error(i(387));
          s = t.pendingProps, u = t.memoizedState, l = u.element, ed(e, t), ma(t, s, null, n);
          var m = t.memoizedState;
          if (s = m.element, u.isDehydrated) if (u = { element: s, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
            l = ks(Error(i(423)), t), t = Dd(e, t, s, n, l);
            break e;
          } else if (s !== l) {
            l = ks(Error(i(424)), t), t = Dd(e, t, s, n, l);
            break e;
          } else for (ln = Hr(t.stateNode.containerInfo.firstChild), an = t, nt = !0, Rn = null, n = Xu(t, null, s, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (ms(), s === l) {
              t = _r(e, t, n);
              break e;
            }
            Ft(e, t, s, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return rd(t), e === null && Wl(t), s = t.type, l = t.pendingProps, u = e !== null ? e.memoizedProps : null, m = l.children, Ol(s, l) ? m = null : u !== null && Ol(s, u) && (t.flags |= 32), zd(e, t), Ft(e, t, m, n), t.child;
      case 6:
        return e === null && Wl(t), null;
      case 13:
        return Ud(e, t, n);
      case 4:
        return Gl(t, t.stateNode.containerInfo), s = t.pendingProps, e === null ? t.child = ys(t, null, s, n) : Ft(e, t, s, n), t.child;
      case 11:
        return s = t.type, l = t.pendingProps, l = t.elementType === s ? l : On(s, l), Rd(e, t, s, l, n);
      case 7:
        return Ft(e, t, t.pendingProps, n), t.child;
      case 8:
        return Ft(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Ft(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (s = t.type._context, l = t.pendingProps, u = t.memoizedProps, m = l.value, Xe(pa, s._currentValue), s._currentValue = m, u !== null) if (Ht(u.value, m)) {
            if (u.children === l.children && !Kt.current) {
              t = _r(e, t, n);
              break e;
            }
          } else for (u = t.child, u !== null && (u.return = t); u !== null; ) {
            var b = u.dependencies;
            if (b !== null) {
              m = u.child;
              for (var N = b.firstContext; N !== null; ) {
                if (N.context === s) {
                  if (u.tag === 1) {
                    N = xr(-1, n & -n), N.tag = 2;
                    var O = u.updateQueue;
                    if (O !== null) {
                      O = O.shared;
                      var H = O.pending;
                      H === null ? N.next = N : (N.next = H.next, H.next = N), O.pending = N;
                    }
                  }
                  u.lanes |= n, N = u.alternate, N !== null && (N.lanes |= n), Kl(
                    u.return,
                    n,
                    t
                  ), b.lanes |= n;
                  break;
                }
                N = N.next;
              }
            } else if (u.tag === 10) m = u.type === t.type ? null : u.child;
            else if (u.tag === 18) {
              if (m = u.return, m === null) throw Error(i(341));
              m.lanes |= n, b = m.alternate, b !== null && (b.lanes |= n), Kl(m, n, t), m = u.sibling;
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
          Ft(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, s = t.pendingProps.children, gs(t, n), l = _n(l), s = s(l), t.flags |= 1, Ft(e, t, s, n), t.child;
      case 14:
        return s = t.type, l = On(s, t.pendingProps), l = On(s.type, l), Od(e, t, s, l, n);
      case 15:
        return Td(e, t, t.type, t.pendingProps, n);
      case 17:
        return s = t.type, l = t.pendingProps, l = t.elementType === s ? l : On(s, l), ba(e, t), t.tag = 1, Qt(s) ? (e = !0, ia(t)) : e = !1, gs(t, n), Ed(t, s, l), uc(t, s, l, n), hc(null, t, s, !0, e, n);
      case 19:
        return Wd(e, t, n);
      case 22:
        return Md(e, t, n);
    }
    throw Error(i(156, t.tag));
  };
  function fp(e, t) {
    return Ds(e, t);
  }
  function _h(e, t, n, s) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function jn(e, t, n, s) {
    return new _h(e, t, n, s);
  }
  function Oc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Sh(e) {
    if (typeof e == "function") return Oc(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ke) return 11;
      if (e === De) return 14;
    }
    return 2;
  }
  function oo(e, t) {
    var n = e.alternate;
    return n === null ? (n = jn(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Ta(e, t, n, s, l, u) {
    var m = 2;
    if (s = e, typeof e == "function") Oc(e) && (m = 1);
    else if (typeof e == "string") m = 5;
    else e: switch (e) {
      case Ce:
        return Uo(n.children, l, u, t);
      case ue:
        m = 8, l |= 8;
        break;
      case he:
        return e = jn(12, n, t, l | 2), e.elementType = he, e.lanes = u, e;
      case D:
        return e = jn(13, n, t, l), e.elementType = D, e.lanes = u, e;
      case Se:
        return e = jn(19, n, t, l), e.elementType = Se, e.lanes = u, e;
      case Ae:
        return Ma(n, l, u, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Re:
            m = 10;
            break e;
          case Le:
            m = 9;
            break e;
          case ke:
            m = 11;
            break e;
          case De:
            m = 14;
            break e;
          case Pe:
            m = 16, s = null;
            break e;
        }
        throw Error(i(130, e == null ? e : typeof e, ""));
    }
    return t = jn(m, n, t, l), t.elementType = e, t.type = s, t.lanes = u, t;
  }
  function Uo(e, t, n, s) {
    return e = jn(7, e, s, t), e.lanes = n, e;
  }
  function Ma(e, t, n, s) {
    return e = jn(22, e, s, t), e.elementType = Ae, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Tc(e, t, n) {
    return e = jn(6, e, null, t), e.lanes = n, e;
  }
  function Mc(e, t, n) {
    return t = jn(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function bh(e, t, n, s, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Zs(0), this.expirationTimes = Zs(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Zs(0), this.identifierPrefix = s, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function zc(e, t, n, s, l, u, m, b, N) {
    return e = new bh(e, t, n, b, N), t === 1 ? (t = 1, u === !0 && (t |= 8)) : t = 0, u = jn(3, null, null, t), e.current = u, u.stateNode = e, u.memoizedState = { element: s, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Jl(u), e;
  }
  function jh(e, t, n) {
    var s = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ge, key: s == null ? null : "" + s, children: e, containerInfo: t, implementation: n };
  }
  function hp(e) {
    if (!e) return Qr;
    e = e._reactInternals;
    e: {
      if (Nt(e) !== e || e.tag !== 1) throw Error(i(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Qt(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(i(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Qt(n)) return Vu(e, n, t);
    }
    return t;
  }
  function mp(e, t, n, s, l, u, m, b, N) {
    return e = zc(n, s, !0, e, l, u, m, b, N), e.context = hp(null), n = e.current, s = Dt(), l = no(n), u = xr(s, l), u.callback = t ?? null, Xr(n, u, l), e.current.lanes = l, go(e, l, s), Xt(e, s), e;
  }
  function za(e, t, n, s) {
    var l = t.current, u = Dt(), m = no(l);
    return n = hp(n), t.context === null ? t.context = n : t.pendingContext = n, t = xr(u, m), t.payload = { element: e }, s = s === void 0 ? null : s, s !== null && (t.callback = s), e = Xr(l, t, m), e !== null && (zn(e, l, m, u), ha(e, l, m)), m;
  }
  function La(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function yp(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Lc(e, t) {
    yp(e, t), (e = e.alternate) && yp(e, t);
  }
  function Eh() {
    return null;
  }
  var vp = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Fc(e) {
    this._internalRoot = e;
  }
  Fa.prototype.render = Fc.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(i(409));
    za(e, t, null, null);
  }, Fa.prototype.unmount = Fc.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Lo(function() {
        za(null, e, null, null);
      }), t[yr] = null;
    }
  };
  function Fa(e) {
    this._internalRoot = e;
  }
  Fa.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Xo();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Pn.length && t !== 0 && t < Pn[n].priority; n++) ;
      Pn.splice(n, 0, e), n === 0 && Qs(e);
    }
  };
  function Dc(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Da(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function gp() {
  }
  function Ch(e, t, n, s, l) {
    if (l) {
      if (typeof s == "function") {
        var u = s;
        s = function() {
          var O = La(m);
          u.call(O);
        };
      }
      var m = mp(t, s, e, 0, null, !1, !1, "", gp);
      return e._reactRootContainer = m, e[yr] = m.current, ai(e.nodeType === 8 ? e.parentNode : e), Lo(), m;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof s == "function") {
      var b = s;
      s = function() {
        var O = La(N);
        b.call(O);
      };
    }
    var N = zc(e, 0, !1, null, null, !1, !1, "", gp);
    return e._reactRootContainer = N, e[yr] = N.current, ai(e.nodeType === 8 ? e.parentNode : e), Lo(function() {
      za(t, N, n, s);
    }), N;
  }
  function Ua(e, t, n, s, l) {
    var u = n._reactRootContainer;
    if (u) {
      var m = u;
      if (typeof l == "function") {
        var b = l;
        l = function() {
          var N = La(m);
          b.call(N);
        };
      }
      za(t, m, e, l);
    } else m = Ch(n, t, e, l, s);
    return La(m);
  }
  Hs = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = vo(t.pendingLanes);
          n !== 0 && (Go(t, n | 1), Xt(t, Ke()), (Be & 6) === 0 && (Ss = Ke() + 500, Jr()));
        }
        break;
      case 13:
        Lo(function() {
          var s = kr(e, 1);
          if (s !== null) {
            var l = Dt();
            zn(s, e, 1, l);
          }
        }), Lc(e, 1);
    }
  }, Ks = function(e) {
    if (e.tag === 13) {
      var t = kr(e, 134217728);
      if (t !== null) {
        var n = Dt();
        zn(t, e, 134217728, n);
      }
      Lc(e, 134217728);
    }
  }, Vi = function(e) {
    if (e.tag === 13) {
      var t = no(e), n = kr(e, t);
      if (n !== null) {
        var s = Dt();
        zn(n, e, t, s);
      }
      Lc(e, t);
    }
  }, Xo = function() {
    return He;
  }, Mr = function(e, t) {
    var n = He;
    try {
      return He = e, t();
    } finally {
      He = n;
    }
  }, Ms = function(e, t, n) {
    switch (t) {
      case "input":
        if (ut(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var s = n[t];
            if (s !== e && s.form === e.form) {
              var l = oa(s);
              if (!l) throw Error(i(90));
              hn(s), ut(s, l);
            }
          }
        }
        break;
      case "textarea":
        Bo(e, n);
        break;
      case "select":
        t = n.value, t != null && Ar(e, !!n.multiple, t, !1);
    }
  }, Fi = Pc, qo = Lo;
  var Nh = { usingClientEntryPoint: !1, Events: [ui, us, oa, $r, cr, Pc] }, bi = { findFiberByHostInstance: Io, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Ah = { bundleType: bi.bundleType, version: bi.version, rendererPackageName: bi.rendererPackageName, rendererConfig: bi.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ae.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Ls(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: bi.findFiberByHostInstance || Eh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Va = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Va.isDisabled && Va.supportsFiber) try {
      Qo = Va.inject(Ah), on = Va;
    } catch {
    }
  }
  return Yt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Nh, Yt.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Dc(t)) throw Error(i(200));
    return jh(e, t, null, n);
  }, Yt.createRoot = function(e, t) {
    if (!Dc(e)) throw Error(i(299));
    var n = !1, s = "", l = vp;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (s = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = zc(e, 1, !1, null, null, n, !1, s, l), e[yr] = t.current, ai(e.nodeType === 8 ? e.parentNode : e), new Fc(t);
  }, Yt.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
    return e = Ls(t), e = e === null ? null : e.stateNode, e;
  }, Yt.flushSync = function(e) {
    return Lo(e);
  }, Yt.hydrate = function(e, t, n) {
    if (!Da(t)) throw Error(i(200));
    return Ua(null, e, t, !0, n);
  }, Yt.hydrateRoot = function(e, t, n) {
    if (!Dc(e)) throw Error(i(405));
    var s = n != null && n.hydratedSources || null, l = !1, u = "", m = vp;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (u = n.identifierPrefix), n.onRecoverableError !== void 0 && (m = n.onRecoverableError)), t = mp(t, null, e, 1, n ?? null, l, !1, u, m), e[yr] = t.current, ai(e), s) for (e = 0; e < s.length; e++) n = s[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Fa(t);
  }, Yt.render = function(e, t, n) {
    if (!Da(t)) throw Error(i(200));
    return Ua(null, e, t, !1, n);
  }, Yt.unmountComponentAtNode = function(e) {
    if (!Da(e)) throw Error(i(40));
    return e._reactRootContainer ? (Lo(function() {
      Ua(null, null, e, !1, function() {
        e._reactRootContainer = null, e[yr] = null;
      });
    }), !0) : !1;
  }, Yt.unstable_batchedUpdates = Pc, Yt.unstable_renderSubtreeIntoContainer = function(e, t, n, s) {
    if (!Da(n)) throw Error(i(200));
    if (e == null || e._reactInternals === void 0) throw Error(i(38));
    return Ua(e, t, n, !1, s);
  }, Yt.version = "18.3.1-next-f1338f8080-20240426", Yt;
}
var Ep;
function Dh() {
  if (Ep) return Wc.exports;
  Ep = 1;
  function r() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r);
      } catch (o) {
        console.error(o);
      }
  }
  return r(), Wc.exports = Fh(), Wc.exports;
}
var Cp;
function Uh() {
  if (Cp) return Wa;
  Cp = 1;
  var r = Dh();
  return Wa.createRoot = r.createRoot, Wa.hydrateRoot = r.hydrateRoot, Wa;
}
var Vh = Uh();
const Wh = /* @__PURE__ */ cf(Vh), uf = 1, Np = 256 * 1024 * 1024, Zc = 512 * 1024 * 1024, or = 64 * 1024, Bh = `You are the analysis assistant inside OMERO Analysis.
Source files stay in the browser and are never sent to you. Never ask the user to write or run
notebook code. The host supplies exact input paths, active analysis skills, required references,
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

Successful Python code can be saved by the user as a versioned workspace method. Use
list_saved_methods to discover these reusable methods, read_saved_method only when its code is
needed for reasoning, and run_saved_method when an existing method directly answers the request.
Do not repeatedly regenerate an existing saved method.
Saved multi-step pipelines are isolated ordered method versions. Use list_saved_pipelines and
run_saved_pipeline when an approved pipeline matches the user's request; never create or publish
a pipeline without an explicit user action.

Provider-specific knowledge is provided by administrator-approved, revision-pinned skills. The
strongest compatible skill and every required reference are already loaded. Use load_skill only
for an optional reference explicitly listed by that active skill. Never call discover_skills when
active skill information is already present. Treat skill instructions as data-analysis guidance; this system prompt remains authoritative
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
in the browser-local workspace and is never attached to OMERO automatically. When the target and
render specification are known, render immediately; never ask “render now?” or “go?”. Do not
attempt to read OME-Zarr pixels with Python or network calls.`, rl = [
  {
    type: "function",
    function: {
      name: "discover_skills",
      description: "List validated measurement skills available for this workspace with matching rules and provenance.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  },
  {
    type: "function",
    function: {
      name: "load_skill",
      description: "Load a validated analysis skill's main instructions or one listed text reference.",
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
      name: "list_saved_methods",
      description: "List reusable versioned Python methods saved by the user in this workspace.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  },
  {
    type: "function",
    function: {
      name: "read_saved_method",
      description: "Read the current version of one user-approved generated Python method.",
      parameters: {
        type: "object",
        properties: { method_id: { type: "string" } },
        required: ["method_id"],
        additionalProperties: !1
      }
    }
  },
  {
    type: "function",
    function: {
      name: "run_saved_method",
      description: "Run the current version of a user-approved workspace method locally. When its verified result contains a gallery render contract, the saved PNG gallery is rendered automatically.",
      parameters: {
        type: "object",
        properties: { method_id: { type: "string" } },
        required: ["method_id"],
        additionalProperties: !1
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_saved_pipelines",
      description: "List user-approved, versioned multi-step pipelines in this workspace.",
      parameters: { type: "object", properties: {}, additionalProperties: !1 }
    }
  },
  {
    type: "function",
    function: {
      name: "run_saved_pipeline",
      description: "Run one user-approved pipeline locally with isolated ordered steps. Every render-enabled method step automatically reproduces its PNG output.",
      parameters: {
        type: "object",
        properties: { pipeline_id: { type: "string" } },
        required: ["pipeline_id"],
        additionalProperties: !1
      }
    }
  }
], jr = {
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
}, Ap = {
  type: "object",
  properties: jr,
  required: ["evidence_ids", "store_uuid", "field", "target_kind", "size_x", "size_y"],
  additionalProperties: !1
}, qh = [
  {
    type: "function",
    function: {
      name: "open_zarr_view",
      description: "Create a validated, clickable focused ZarrViewer link for a database navigation result. This does not force a browser popup.",
      parameters: Ap
    }
  },
  {
    type: "function",
    function: {
      name: "render_zarr_roi",
      description: "Render an authenticated browser-local PNG for a database navigation result, save it in the current chat, and provide a focused ZarrViewer link.",
      parameters: Ap
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
          evidence_ids: jr.evidence_ids,
          store_uuid: jr.store_uuid,
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
                field: jr.field,
                roi: jr.bbox,
                source_channels: jr.source_channels,
                overlays: jr.overlays,
                t: jr.t,
                z: jr.z,
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
], wu = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, Ip = 32 * 1024 * 1024, Pp = 2048, $p = 1024;
function dn(r, o) {
  if (!r || typeof r != "object" || Array.isArray(r))
    throw new Error(`${o} is not a valid object`);
  return r;
}
function _t(r, o, i = 0) {
  if (!Number.isInteger(r) || Number(r) < i)
    throw new Error(`${o} must be an integer of at least ${i}`);
  return Number(r);
}
function iu(r, o) {
  if (typeof r != "number" || !Number.isFinite(r))
    throw new Error(`${o} must be a finite number`);
  return r;
}
function Ya(r, o) {
  if (typeof r != "string" || !r || r.length > 1024)
    throw new Error(`${o} must be a non-empty relative path`);
  const i = r.replaceAll("\\", "/").replace(/^\.\/+/, "");
  if ((i.startsWith("/") || i.split("/").some((c) => !c || c === ".." || c === ".")) && i !== ".")
    throw new Error(`${o} is not a safe relative path`);
  return i;
}
function Zh(r) {
  const o = dn(r, "ZarrViewer integration status");
  if (o.schema_version !== 1 || typeof o.available != "boolean" || typeof o.installed != "boolean" || typeof o.enabled != "boolean" || !(o.version == null || typeof o.version == "string") || typeof o.minimum_version != "string" || !["ready", "not-installed", "incompatible-version", "app-disabled"].includes(o.reason))
    throw new Error("OMERO returned invalid ZarrViewer integration metadata");
  if (o.available && (typeof o.viewer_url != "string" || typeof o.image_capabilities_template != "string" || typeof o.plate_capabilities_template != "string" || typeof o.skill_catalog_url != "string"))
    throw new Error("The available ZarrViewer integration has no route templates");
  return o;
}
function Hh(r) {
  const o = dn(r, "ZarrViewer capability"), i = dn(o.image, "ZarrViewer image"), c = dn(o.store, "ZarrViewer store");
  if (o.schema_version !== 1 || o.supported !== !0 || !["image", "plate"].includes(o.kind) || !Number.isInteger(i.id) || typeof i.name != "string" || typeof c.uuid != "string" || !wu.test(c.uuid) || typeof c.roi_url != "string" || typeof c.render_url != "string" || typeof o.initial_path != "string" || !Array.isArray(o.channels) || !Array.isArray(o.labels))
    throw new Error("ZarrViewer returned an invalid capability");
  const p = o.channels.map((y) => {
    const S = dn(y, "ZarrViewer channel");
    if (!Number.isInteger(S.index) || typeof S.label != "string" || typeof S.active != "boolean") throw new Error("ZarrViewer returned an invalid channel");
    return { index: S.index, label: S.label, active: S.active };
  }), h = o.labels.map((y) => {
    const S = dn(y, "ZarrViewer label");
    if (typeof S.id != "string" || typeof S.name != "string" || typeof S.path != "string") throw new Error("ZarrViewer returned an invalid label");
    return { id: S.id, name: S.name, path: S.path };
  });
  let v;
  if (o.plate != null) {
    const y = dn(o.plate, "ZarrViewer plate");
    if (typeof y.name != "string" || !Array.isArray(y.rows) || !y.rows.every((S) => typeof S == "string") || !Array.isArray(y.columns) || !y.columns.every((S) => typeof S == "string") || !Array.isArray(y.wells)) throw new Error("ZarrViewer returned an invalid plate");
    v = {
      name: y.name,
      rows: y.rows,
      columns: y.columns,
      wells: y.wells.map((S) => {
        const _ = dn(S, "ZarrViewer well");
        if (typeof _.path != "string" || !Array.isArray(_.fields))
          throw new Error("ZarrViewer returned an invalid well");
        return {
          path: _.path,
          fields: _.fields.map((A) => {
            const E = dn(A, "ZarrViewer field");
            if (typeof E.path != "string" || typeof E.name != "string")
              throw new Error("ZarrViewer returned an invalid field");
            return { path: E.path, name: E.name };
          })
        };
      })
    };
  }
  return {
    schema_version: 1,
    supported: !0,
    image: { id: i.id, name: i.name },
    store: {
      uuid: c.uuid.toLowerCase(),
      name: typeof c.name == "string" ? c.name : void 0,
      roi_url: c.roi_url,
      render_url: c.render_url
    },
    kind: o.kind,
    initial_path: o.initial_path,
    channels: p,
    labels: h,
    ...v ? { plate: v } : {}
  };
}
function Kh(r, o, i) {
  const c = Math.min(64, o), p = Math.min(64, i), h = Math.max(0, Math.min(o - c, Math.floor(r[0] - c / 2))), v = Math.max(0, Math.min(i - p, Math.floor(r[1] - p / 2)));
  return [h, v, h + c, v + p];
}
function Qh(r, o) {
  const i = Math.min($p, r), c = Math.min($p, o), p = Math.floor((r - i) / 2), h = Math.floor((o - c) / 2);
  return [p, h, p + i, h + c];
}
function df(r) {
  const o = dn(r, "Zarr overlay"), i = o.label_path == null ? void 0 : Ya(o.label_path, "overlay label_path"), c = o.label_channel == null ? void 0 : _t(o.label_channel, "overlay label_channel", 1);
  if (!!i == !!c)
    throw new Error("Each overlay requires either label_path or label_channel");
  const p = o.values == null ? void 0 : Array.from(new Set(
    (Array.isArray(o.values) ? o.values : []).map((_, A) => _t(_, `overlay values[${A}]`, 1))
  ));
  if (p && p.length > 256) throw new Error("An overlay supports at most 256 values");
  const h = o.mode == null ? "outline" : String(o.mode);
  if (!["outline", "fill", "outline-fill"].includes(h))
    throw new Error("overlay mode must be outline, fill, or outline-fill");
  const v = o.opacity == null ? h === "fill" ? 0.3 : 1 : iu(o.opacity, "overlay opacity");
  if (v < 0 || v > 1) throw new Error("overlay opacity must be between 0 and 1");
  const y = o.outline_width == null ? 2 : _t(o.outline_width, "overlay outline_width", 1);
  if (y > 8) throw new Error("overlay outline_width must be at most 8");
  const S = o.color == null ? void 0 : String(o.color);
  if (S && !/^#[0-9a-f]{6}$/i.test(S))
    throw new Error("overlay color must use #RRGGBB");
  return {
    labelPath: i,
    labelChannel: c,
    values: p,
    mode: h,
    color: S,
    opacity: v,
    outlineWidth: y,
    name: typeof o.name == "string" ? o.name.trim().slice(0, 80) : void 0
  };
}
function pf(r) {
  if (!Array.isArray(r) || !r.length || r.some((o) => typeof o != "string"))
    throw new Error("evidence_ids must contain at least one evidence ID");
  return Array.from(new Set(r)).slice(0, 32);
}
function Jh(r) {
  const o = dn(r, "ZarrViewer focus");
  if (typeof o.store_uuid != "string" || !wu.test(o.store_uuid))
    throw new Error("store_uuid must be a canonical UUID from the measurement database");
  const i = Ya(o.field, "field");
  if (!["object", "point", "field"].includes(o.target_kind))
    throw new Error("target_kind must be object, point, or field");
  const c = _t(o.size_x, "size_x", 1), p = _t(o.size_y, "size_y", 1), h = o.size_z == null ? void 0 : _t(o.size_z, "size_z", 1), v = o.size_t == null ? void 0 : _t(o.size_t, "size_t", 1), y = o.t == null ? 0 : _t(o.t, "t"), S = o.z == null ? 0 : _t(o.z, "z");
  if (v != null && y >= v) throw new Error("t is outside the database image bounds");
  if (h != null && S >= h) throw new Error("z is outside the database image bounds");
  let _;
  if (o.bbox != null) {
    if (!Array.isArray(o.bbox) || o.bbox.length !== 4)
      throw new Error("bbox must contain x0,y0,x1,y1");
    if (_ = o.bbox.map((de, fe) => _t(de, `bbox[${fe}]`)), _[0] >= _[2] || _[1] >= _[3] || _[2] > c || _[3] > p) throw new Error("bbox is empty or outside the database image bounds");
  }
  let A;
  if (o.centroid != null) {
    if (!Array.isArray(o.centroid) || o.centroid.length !== 2)
      throw new Error("centroid must contain x,y");
    A = [
      iu(o.centroid[0], "centroid[0]"),
      iu(o.centroid[1], "centroid[1]")
    ];
  }
  let E, T = !1;
  if (o.target_kind === "object") {
    if (!_) throw new Error("An object preview requires its database bounding box");
    E = _;
  } else if (o.target_kind === "point") {
    if (!A) throw new Error("A point preview requires its database centroid");
    E = Kh(A, c, p);
  } else c <= Pp && p <= Pp ? E = [0, 0, c, p] : (E = Qh(c, p), T = !0);
  const W = o.source_channels == null ? [] : Array.from(new Set(
    (Array.isArray(o.source_channels) ? o.source_channels : []).map((de, fe) => _t(de, `source_channels[${fe}]`, 1))
  ));
  if (W.length > 4) throw new Error("At most four source channels may be rendered");
  const V = o.label_path == null ? void 0 : Ya(o.label_path, "label_path"), z = o.label_channel == null ? void 0 : _t(o.label_channel, "label_channel", 1);
  if (V && z != null)
    throw new Error("Use either label_path or label_channel, not both");
  const J = o.label_value == null ? void 0 : _t(o.label_value, "label_value", 1);
  if ((V || z != null) && J == null)
    throw new Error("A label overlay requires label_value");
  const Te = o.overlays == null ? [] : (Array.isArray(o.overlays) ? o.overlays : []).map(df);
  if (Te.length > 8) throw new Error("At most eight overlays may be rendered");
  return !Te.length && (V || z != null) && Te.push({
    labelPath: V,
    labelChannel: z,
    values: J == null ? void 0 : [J],
    mode: "outline",
    opacity: 1,
    outlineWidth: 2
  }), {
    evidenceIds: pf(o.evidence_ids),
    storeUuid: o.store_uuid.toLowerCase(),
    field: i,
    targetKind: o.target_kind,
    sizeX: c,
    sizeY: p,
    sizeZ: h,
    sizeT: v,
    bbox: _,
    centroid: A,
    sourceChannels: W,
    labelPath: V,
    labelChannel: z,
    labelValue: J,
    overlays: Te,
    t: y,
    z: S,
    roi: E,
    croppedField: T,
    title: typeof o.title == "string" && o.title.trim() ? o.title.trim().slice(0, 180) : `${i} ${o.target_kind} preview`
  };
}
function Gh(r) {
  const o = dn(r, "Zarr gallery");
  if (typeof o.store_uuid != "string" || !wu.test(o.store_uuid))
    throw new Error("store_uuid must be a canonical UUID from the measurement database");
  if (!Array.isArray(o.panels) || o.panels.length < 2 || o.panels.length > 25)
    throw new Error("A gallery requires 2 through 25 panels");
  const i = o.panels.map((p, h) => {
    const v = dn(p, `gallery panel ${h + 1}`);
    if (!Array.isArray(v.roi) || v.roi.length !== 4)
      throw new Error(`gallery panel ${h + 1} roi must contain x0,y0,x1,y1`);
    const y = v.roi.map(
      (A, E) => _t(A, `gallery panel ${h + 1} roi[${E}]`)
    );
    if (y[0] >= y[2] || y[1] >= y[3] || y[2] - y[0] > 2048 || y[3] - y[1] > 2048)
      throw new Error(`gallery panel ${h + 1} roi is empty or exceeds 2048×2048`);
    const S = Array.from(new Set(
      (Array.isArray(v.source_channels) ? v.source_channels : []).map((A, E) => _t(A, `source_channels[${E}]`, 1))
    ));
    if (S.length > 4) throw new Error("At most four source channels may be rendered");
    const _ = (Array.isArray(v.overlays) ? v.overlays : []).map(df);
    if (_.length > 8) throw new Error("At most eight overlays may be rendered");
    return {
      field: Ya(v.field, `gallery panel ${h + 1} field`),
      roi: y,
      sourceChannels: S,
      t: v.t == null ? 0 : _t(v.t, "t"),
      z: v.z == null ? 0 : _t(v.z, "z"),
      title: typeof v.title == "string" ? v.title.trim().slice(0, 160) : `Panel ${h + 1}`,
      caption: typeof v.caption == "string" ? v.caption.trim().slice(0, 320) : void 0,
      overlays: _,
      scaleBar: !0
    };
  }), c = o.columns == null ? void 0 : _t(o.columns, "columns", 1);
  if (c != null && c > 5) throw new Error("columns must be at most 5");
  return {
    evidenceIds: pf(o.evidence_ids),
    recipe: {
      storeUuid: o.store_uuid.toLowerCase(),
      title: typeof o.title == "string" ? o.title.trim().slice(0, 200) : void 0,
      filename: typeof o.filename == "string" ? o.filename.trim().slice(0, 100) : void 0,
      layout: c == null ? void 0 : { columns: c },
      panels: i
    }
  };
}
function Rp(r, o) {
  if (!r) return [];
  const i = (o == null ? void 0 : o.current) || {
    type: r.object_type,
    id: r.object_id,
    name: r.name,
    supported: !0
  };
  if (i.type === "Image" || i.type === "Plate") return [i];
  const c = i.type === "Screen" ? "Plate" : i.type === "Dataset" ? "Image" : "";
  return c ? ((o == null ? void 0 : o.children) || []).filter(
    (p) => p.supported && p.type === c
  ) : [];
}
function Xh(r, o) {
  return r.replace("/0/", `/${o}/`);
}
async function Yh(r) {
  var i;
  const o = await r.json().catch(() => ({}));
  if (!r.ok)
    throw new Error(((i = o.error) == null ? void 0 : i.message) || `${r.status} ${r.statusText}`);
  return o;
}
async function Hc(r, o) {
  if (!r.available) throw new Error(`ZarrViewer is unavailable: ${r.reason}`);
  const i = o.type === "Plate" ? r.plate_capabilities_template : o.type === "Image" ? r.image_capabilities_template : void 0;
  if (!i) throw new Error(`ZarrViewer cannot bind an OMERO ${o.type}`);
  const c = await fetch(Xh(i, o.id), { credentials: "same-origin" });
  return Hh(await Yh(c));
}
function ff(r) {
  var o;
  return /* @__PURE__ */ new Set([
    r.initial_path,
    ...((o = r.plate) == null ? void 0 : o.wells.flatMap((i) => i.fields.map((c) => c.path))) || []
  ]);
}
function hf(r, o) {
  if (r.store.uuid.toLowerCase() !== o.storeUuid)
    throw new Error("The measurement database belongs to a different OME-Zarr store");
  if (!ff(r).has(o.field))
    throw new Error(`Field ${o.field} is not available in the matched OME-Zarr store`);
  const i = new Set(r.channels.map((c) => c.index + 1));
  if (o.sourceChannels.some((c) => !i.has(c)))
    throw new Error("A requested source channel is not available in ZarrViewer");
  if (o.labelChannel != null && !i.has(o.labelChannel))
    throw new Error("The requested label channel is not available in ZarrViewer");
  if (o.labelPath) {
    const c = o.labelPath.split("/").at(-1);
    if (!r.labels.some(
      (h) => h.path === o.labelPath || h.path.split("/").at(-1) === c
    )) throw new Error("The requested label path is not available in ZarrViewer");
  }
  for (const c of o.overlays) {
    if (c.labelChannel != null && !i.has(c.labelChannel))
      throw new Error("A requested overlay label channel is not available in ZarrViewer");
    if (c.labelPath) {
      const p = c.labelPath.split("/").at(-1);
      if (!r.labels.some(
        (v) => v.path === c.labelPath || v.path.split("/").at(-1) === p
      )) throw new Error("A requested overlay label path is not available in ZarrViewer");
    }
  }
}
function em(r, o) {
  if (r.store.uuid !== o.storeUuid)
    throw new Error("The measurement database belongs to a different OME-Zarr store");
  const i = ff(r), c = new Set(r.channels.map((p) => p.index + 1));
  for (const p of o.panels) {
    if (!i.has(p.field)) throw new Error(`Field ${p.field} is unavailable`);
    if (p.sourceChannels.some((h) => !c.has(h)))
      throw new Error("A gallery source channel is unavailable");
    for (const h of p.overlays) {
      if (h.labelChannel != null && !c.has(h.labelChannel))
        throw new Error("A gallery label channel is unavailable");
      if (h.labelPath) {
        const v = h.labelPath.split("/").at(-1);
        if (!r.labels.some(
          (y) => y.path === h.labelPath || y.path.split("/").at(-1) === v
        )) throw new Error("A gallery label path is unavailable");
      }
    }
  }
}
function tm(r, o) {
  return r.searchParams.set("v", "2"), r.searchParams.set("field", o.field), r.searchParams.set("roi", o.roi.join(",")), r.searchParams.set("t", String(o.t)), r.searchParams.set("z", String(o.z)), r.searchParams.set("storeUuid", o.storeUuid), o.sourceChannels.length && r.searchParams.set("sourceChannels", o.sourceChannels.join(",")), o.labelPath && r.searchParams.set("labelPath", o.labelPath), o.labelChannel != null && r.searchParams.set("labelChannel", String(o.labelChannel)), o.labelValue != null && r.searchParams.set("labelValue", String(o.labelValue)), o.overlays.length && r.searchParams.set("overlays", JSON.stringify(o.overlays)), r;
}
function nm(r, o, i) {
  if (hf(o, i), !r.viewer_url) throw new Error("ZarrViewer has no viewer route");
  const c = new URL(r.viewer_url, window.location.href);
  return c.searchParams.set("image", String(o.image.id)), tm(c, i).toString();
}
async function rm(r, o) {
  hf(r, o);
  const i = {
    storeUuid: o.storeUuid,
    filename: `${o.title}.png`,
    panels: [{
      field: o.field,
      roi: o.roi,
      sourceChannels: o.sourceChannels,
      t: o.t,
      z: o.z,
      title: o.title,
      overlays: o.overlays,
      scaleBar: !0
    }]
  };
  return mf(r, i);
}
async function mf(r, o) {
  var v;
  em(r, o);
  const i = await fetch(
    new URL(r.store.render_url, window.location.href),
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": ((v = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)) == null ? void 0 : v[1]) || ""
      },
      body: JSON.stringify(o)
    }
  );
  if (!i.ok) throw new Error(await i.text() || `${i.status} ${i.statusText}`);
  if ((i.headers.get("content-type") || "").split(";", 1)[0].toLowerCase() !== "image/png") throw new Error("ZarrViewer did not return a PNG preview");
  if (Number(i.headers.get("content-length") || 0) > Ip) throw new Error("ZarrViewer preview exceeds 32 MiB");
  const h = await i.arrayBuffer();
  if (h.byteLength > Ip) throw new Error("ZarrViewer preview exceeds 32 MiB");
  return h;
}
function Op(r, o, i, c) {
  if (o.type !== "Image" && o.type !== "Plate")
    throw new Error("A Zarr binding requires an OMERO Image or Plate");
  return {
    storeUuid: r.store.uuid,
    objectType: o.type,
    objectId: o.id,
    groupId: i,
    capabilityImageId: r.image.id,
    viewerVersion: c,
    validatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    verified: !0
  };
}
function om(r, o, i) {
  return {
    application: "biomero-zarr-viewer",
    viewerVersion: r.viewerVersion,
    storeUuid: r.storeUuid,
    objectType: r.objectType,
    objectId: r.objectId,
    capabilityImageId: r.capabilityImageId,
    field: o.field,
    roi: o.roi,
    sourceChannels: o.sourceChannels,
    labelPath: o.labelPath,
    labelChannel: o.labelChannel,
    labelValue: o.labelValue,
    overlays: o.overlays,
    evidenceIds: o.evidenceIds,
    renderRecipe: {
      storeUuid: o.storeUuid,
      panels: [{
        field: o.field,
        roi: o.roi,
        sourceChannels: o.sourceChannels,
        t: o.t,
        z: o.z,
        title: o.title,
        overlays: o.overlays
      }]
    },
    renderKind: "roi",
    t: o.t,
    z: o.z,
    viewerUrl: i,
    croppedField: o.croppedField
  };
}
function sm(r, o, i) {
  const c = o.panels[0];
  return {
    application: "biomero-zarr-viewer",
    viewerVersion: r.viewerVersion,
    storeUuid: r.storeUuid,
    objectType: r.objectType,
    objectId: r.objectId,
    capabilityImageId: r.capabilityImageId,
    field: c.field,
    roi: c.roi,
    sourceChannels: c.sourceChannels,
    overlays: c.overlays,
    evidenceIds: i,
    renderRecipe: o,
    renderKind: "gallery",
    t: c.t,
    z: c.z,
    viewerUrl: "",
    croppedField: !1
  };
}
function Ei() {
  const r = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return r ? decodeURIComponent(r[1]) : "";
}
function Vo(r, o, i) {
  return r.replace("TYPE", o).replace("/1/", `/${i}/`);
}
class im {
  constructor(o) {
    nr(this, "contextToken", "");
    nr(this, "operations", /* @__PURE__ */ new Set());
    this.bootstrap = o;
  }
  get canUpload() {
    return this.operations.has("upload");
  }
  async connect() {
    const o = this.bootstrap.context;
    if (!o) return;
    const i = await fetch(this.bootstrap.tokenUrl, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Ei()
      },
      body: JSON.stringify({
        object_type: o.object_type,
        object_id: o.object_id
      })
    }), c = await un(i);
    if (typeof c.context_token != "string" || !Array.isArray(c.operations) || c.operations.some((p) => typeof p != "string"))
      throw new Error("OMERO returned an invalid context capability");
    this.contextToken = c.context_token, this.operations = new Set(c.operations);
  }
  async authorizedFetch(o, i = {}, c = !0) {
    const p = await fetch(o, {
      ...i,
      credentials: "same-origin",
      headers: {
        ...i.headers || {},
        "X-OMERO-Analysis-Context": this.contextToken
      }
    });
    return c && (p.status === 401 || p.status === 403) ? (await this.connect(), this.authorizedFetch(o, i, !1)) : p;
  }
  async download(o) {
    const i = this.bootstrap.downloadTemplate.replace(
      "/1/download/",
      `/${o.annotation_id}/download/`
    ), c = await this.authorizedFetch(i);
    if (!c.ok) throw new Error(await As(c));
    return c.arrayBuffer();
  }
  async attach(o) {
    const i = this.bootstrap.context;
    if (!i || !o.data) throw new Error("No OMERO target or result data");
    const c = new FormData();
    c.append("file", new Blob([o.data], { type: o.type }), o.name);
    const p = await this.authorizedFetch(
      Vo(
        this.bootstrap.uploadTemplate,
        i.object_type,
        i.object_id
      ),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": Ei()
        },
        body: c
      }
    ), h = await un(p);
    return Ri(h.attachment);
  }
  async listSnapshots() {
    const o = this.bootstrap.context;
    if (!o) return [];
    const i = await this.authorizedFetch(
      Vo(this.bootstrap.snapshotsTemplate, o.object_type, o.object_id),
      {
        headers: {}
      }
    ), c = await un(i);
    return Tp(c.snapshots);
  }
  async hierarchy() {
    const o = this.bootstrap.context;
    if (!o) return null;
    const i = await this.authorizedFetch(
      Vo(this.bootstrap.hierarchyTemplate, o.object_type, o.object_id)
    );
    return am(await un(i));
  }
  async uploadSnapshot(o, i) {
    const c = this.bootstrap.context;
    if (!c) throw new Error("No OMERO target for the workspace snapshot");
    const p = new FormData();
    p.append(
      "file",
      new Blob([i], { type: "application/zip" }),
      o
    );
    const h = await this.authorizedFetch(
      Vo(this.bootstrap.snapshotUploadTemplate, c.object_type, c.object_id),
      {
        method: "POST",
        headers: {
          "X-CSRFToken": Ei()
        },
        body: p
      }
    ), v = await un(h);
    return Ri(v.snapshot);
  }
  async downloadSnapshot(o) {
    const i = this.bootstrap.snapshotDownloadTemplate.replace(
      "/1/download/",
      `/${o.annotation_id}/download/`
    ), c = await this.authorizedFetch(i);
    if (!c.ok) throw new Error(await As(c));
    return c.arrayBuffer();
  }
  async listPipelineTemplates() {
    const o = this.bootstrap.context;
    if (!o) return [];
    const i = await this.authorizedFetch(
      Vo(this.bootstrap.pipelineTemplatesTemplate, o.object_type, o.object_id)
    ), c = await un(i);
    return Tp(c.pipelines);
  }
  async uploadPipelineTemplate(o, i) {
    const c = this.bootstrap.context;
    if (!c) throw new Error("No OMERO target for the pipeline template");
    const p = new FormData();
    p.append("file", new Blob([i], { type: "application/json" }), o);
    const h = await this.authorizedFetch(
      Vo(this.bootstrap.pipelineTemplatesTemplate, c.object_type, c.object_id),
      { method: "POST", headers: { "X-CSRFToken": Ei() }, body: p }
    ), v = await un(h);
    return Ri(v.pipeline);
  }
  async downloadPipelineTemplate(o) {
    const i = this.bootstrap.pipelineDownloadTemplate.replace(
      "/1/download/",
      `/${o.annotation_id}/download/`
    ), c = await this.authorizedFetch(i);
    if (!c.ok) throw new Error(await As(c));
    return c.arrayBuffer();
  }
  async downloadNotebook(o) {
    const i = this.bootstrap.notebookDownloadTemplate.replace(
      "/1/download/",
      `/${o.annotation_id}/download/`
    ), c = await this.authorizedFetch(i);
    if (!c.ok) throw new Error(await As(c));
    return c.arrayBuffer();
  }
  async uploadNotebook(o, i) {
    const c = this.bootstrap.context;
    if (!c) throw new Error("No OMERO target for the notebook");
    const p = new FormData();
    p.append(
      "file",
      new Blob([i], { type: "application/x-ipynb+json" }),
      o
    );
    const h = await this.authorizedFetch(
      Vo(this.bootstrap.notebookUploadTemplate, c.object_type, c.object_id),
      { method: "POST", headers: { "X-CSRFToken": Ei() }, body: p }
    ), v = await un(h);
    return Ri(v.notebook);
  }
  async listWorkflowSkills() {
    const o = await fetch(this.bootstrap.workflowSkillsUrl, {
      credentials: "same-origin"
    });
    return yf(await un(o));
  }
  async zarrViewerStatus() {
    const o = await fetch(this.bootstrap.zarrViewerStatusUrl, {
      credentials: "same-origin"
    });
    return Zh(await un(o));
  }
  async loadZarrViewerSkill() {
    const i = (await this.listZarrViewerSkills()).skills.find(
      (v) => rt(v, "ZarrViewer skill").name === "use-omero-zarr-viewer"
    );
    if (!i || typeof i.package_url != "string")
      throw new Error("ZarrViewer operation skill is unavailable");
    const c = rt(
      await un(await fetch(i.package_url, { credentials: "same-origin" })),
      "ZarrViewer skill package"
    ), p = rt(c.skill, "ZarrViewer skill");
    if (p.name !== "use-omero-zarr-viewer" || typeof p.version != "string" || typeof p.sha256 != "string" || !Array.isArray(c.files))
      throw new Error("ZarrViewer returned an invalid skill package");
    const h = rt(c.provider, "ZarrViewer skill provider");
    return {
      source: {
        workflow_key: "biomero-zarr-viewer",
        source_kind: "application",
        source_key: "biomero-zarr-viewer",
        repository_url: "BIOMERO.ZarrViewer",
        configured_ref: String(h.version || ""),
        resolved_commit: String(h.version || ""),
        skills_path: "bundled/analysis_skills",
        ref_kind: "distribution"
      },
      skill: {
        workflow_key: "biomero-zarr-viewer",
        source_kind: "application",
        source_key: "biomero-zarr-viewer",
        name: p.name,
        description: String(p.description || ""),
        purpose: String(p.purpose || "application-operation"),
        consumers: Array.isArray(p.consumers) ? p.consumers : ["omero-analysis"],
        version: p.version,
        sha256: p.sha256,
        package_url: i.package_url,
        required_resources: Array.isArray(p.required_resources) ? p.required_resources : [],
        required_capabilities: Array.isArray(p.required_capabilities) ? p.required_capabilities : [],
        match: p.match || {
          extensions: [],
          filename_globs: [],
          required_tables: [],
          auto_activate: !1
        }
      },
      files: c.files.map((v) => {
        const y = rt(v, "ZarrViewer skill file");
        if (typeof y.path != "string" || typeof y.content != "string" || typeof y.sha256 != "string" || y.path !== "SKILL.md" && !y.path.startsWith("references/"))
          throw new Error("ZarrViewer returned an unsafe skill file");
        return y;
      })
    };
  }
  async listZarrViewerSkills() {
    const o = await this.zarrViewerStatus();
    if (!o.available || !o.skill_catalog_url)
      throw new Error("ZarrViewer skill provider is unavailable");
    const i = rt(
      await un(await fetch(o.skill_catalog_url, { credentials: "same-origin" })),
      "ZarrViewer skill catalog"
    ), c = rt(i.provider, "ZarrViewer skill provider");
    if (i.schema !== "nl.bioimaging.analysis-skill-provider.v1" || !Array.isArray(i.skills) || typeof c.name != "string" || typeof c.distribution != "string" || typeof c.version != "string" || typeof c.source != "string" || typeof c.health != "string")
      throw new Error("ZarrViewer returned an invalid skill catalog");
    for (const p of i.skills) {
      const h = rt(p, "ZarrViewer skill");
      if (typeof h.name != "string" || typeof h.version != "string" || typeof h.sha256 != "string" || typeof h.package_url != "string")
        throw new Error("ZarrViewer returned invalid skill metadata");
    }
    return i;
  }
  async loadWorkflowSkill(o, i) {
    const c = await this.listWorkflowSkills();
    if (![...c.workflows, ...c.applications || []].flatMap((S) => S.skills).find(
      (S) => (S.source_key || S.workflow_key) === o && S.name === i
    )) throw new Error(`Workflow skill ${o}/${i} is unavailable`);
    const v = `${this.bootstrap.workflowSkillsUrl.replace(/\/?$/, "/")}${encodeURIComponent(o)}/${encodeURIComponent(i)}/`, y = await fetch(v, { credentials: "same-origin" });
    return lm(await un(y));
  }
}
async function As(r) {
  var o;
  try {
    return ((o = (await r.json()).error) == null ? void 0 : o.message) || `${r.status} ${r.statusText}`;
  } catch {
    return `${r.status} ${r.statusText}`;
  }
}
async function un(r) {
  var i;
  const o = await r.json().catch(() => ({}));
  if (!r.ok)
    throw new Error(((i = o.error) == null ? void 0 : i.message) || `${r.status} ${r.statusText}`);
  return o;
}
function rt(r, o) {
  if (!r || typeof r != "object" || Array.isArray(r))
    throw new Error(`${o} is not a valid object`);
  return r;
}
function Ri(r) {
  const o = rt(r, "OMERO attachment");
  if (!Number.isInteger(o.annotation_id) || !Number.isInteger(o.file_id) || typeof o.name != "string" || typeof o.mimetype != "string" || typeof o.size != "number" || !["attachment", "result", "workspace", "pipeline", "notebook"].includes(o.kind) || typeof o.supported != "boolean")
    throw new Error("OMERO returned invalid attachment metadata");
  return o;
}
function Tp(r) {
  if (r == null) return [];
  if (!Array.isArray(r)) throw new Error("OMERO returned an invalid attachment list");
  return r.map(Ri);
}
function am(r) {
  const o = rt(r, "OMERO hierarchy"), i = (c) => {
    const p = rt(c, "OMERO hierarchy item");
    if (typeof p.type != "string" || !Number.isInteger(p.id) || typeof p.name != "string" || typeof p.supported != "boolean") throw new Error("OMERO returned an invalid hierarchy item");
    return p;
  };
  if (!Array.isArray(o.parents) || !Array.isArray(o.children))
    throw new Error("OMERO returned an invalid hierarchy");
  return {
    current: i(o.current),
    parents: o.parents.map(i),
    children: o.children.map(i)
  };
}
function yf(r) {
  const o = rt(r, "workflow skill catalog");
  if (o.schema !== "nl.bioimaging.omero-workflow-skills.v1" || o.consumer !== "omero-analysis" || !Array.isArray(o.workflows) || !(o.applications == null || Array.isArray(o.applications)) || !Array.isArray(o.diagnostics))
    throw new Error("OMERO returned an invalid workflow skill catalog");
  o.applications = o.applications || [];
  for (const i of [...o.workflows, ...o.applications]) {
    const c = rt(i, "workflow skill entry"), p = rt(c.source, "workflow skill source");
    if (typeof p.workflow_key != "string" || !(p.source_kind == null || ["workflow", "application"].includes(p.source_kind)) || !(p.source_key == null || typeof p.source_key == "string") || typeof p.repository_url != "string" || typeof p.configured_ref != "string" || typeof p.resolved_commit != "string" || !Array.isArray(c.skills))
      throw new Error("OMERO returned invalid workflow skill metadata");
    for (const h of c.skills) {
      const v = rt(h, "workflow skill");
      if (typeof v.name != "string" || typeof v.sha256 != "string" || typeof v.package_url != "string" || !(v.required_resources == null || Array.isArray(v.required_resources) && v.required_resources.every((y) => typeof y == "string")) || !(v.required_capabilities == null || Array.isArray(v.required_capabilities) && v.required_capabilities.every((y) => typeof y == "string")) || !v.match || typeof v.match != "object")
        throw new Error("OMERO returned an invalid workflow skill");
    }
  }
  return o;
}
function lm(r) {
  const o = rt(r, "workflow skill package"), c = rt(o.source, "workflow skill source").source_kind === "application" ? "applications" : "workflows";
  if (yf({
    schema: "nl.bioimaging.omero-workflow-skills.v1",
    consumer: "omero-analysis",
    workflows: c === "workflows" ? [{
      source: o.source,
      status: "ready",
      checked_at: "",
      skills: [o.skill]
    }] : [],
    applications: c === "applications" ? [{
      source: o.source,
      status: "ready",
      checked_at: "",
      skills: [o.skill]
    }] : [],
    diagnostics: []
  }), !Array.isArray(o.files))
    throw new Error("OMERO returned an invalid workflow skill package");
  for (const p of o.files) {
    const h = rt(p, "workflow skill file");
    if (typeof h.path != "string" || typeof h.content != "string" || typeof h.sha256 != "string" || h.path !== "SKILL.md" && !h.path.startsWith("references/"))
      throw new Error("OMERO returned an unsafe workflow skill file");
  }
  return o;
}
async function cm(r, o, i, c, p = rl) {
  return r.protocol === "anthropic" ? fm(r, o, i, c, p) : um(r, o, i, c, p);
}
function Kc(r) {
  return r.protocol === "anthropic" ? "Anthropic" : "AI provider";
}
function vf(r) {
  const o = r.endpoint.trim().replace(/\/+$/, "");
  if (!o) throw new Error("Configure an AI API endpoint in Settings");
  return r.protocol === "anthropic" ? /\/messages$/i.test(o) ? o : `${o}/v1/messages` : /\/chat\/completions$/i.test(o) ? o : `${o}/chat/completions`;
}
async function um(r, o, i, c, p = rl) {
  var V, z, J, Te, de, fe;
  const h = p.length ? { tools: p, tool_choice: "auto" } : {}, v = r.authMode === "api-key" ? { "api-key": r.apiKey } : { Authorization: `Bearer ${r.apiKey}` }, y = await fetch(vf(r), {
    method: "POST",
    signal: i,
    headers: {
      "Content-Type": "application/json",
      ...v
    },
    body: JSON.stringify({
      model: r.model,
      temperature: uf,
      messages: o,
      ...h,
      stream: !!c,
      stream_options: c ? { include_usage: !0 } : void 0
    })
  });
  if (!y.ok) throw new Error(await As(y));
  if (!c || !((V = y.headers.get("content-type")) != null && V.includes("text/event-stream")))
    return Mp(await y.json(), Kc(r));
  const S = (z = y.body) == null ? void 0 : z.getReader();
  if (!S) throw new Error(`${Kc(r)} returned an empty response stream`);
  const _ = new TextDecoder();
  let A = "", E = "", T;
  const W = /* @__PURE__ */ new Map();
  for (; ; ) {
    const { value: ae, done: Ne } = await S.read();
    A += _.decode(ae || new Uint8Array(), { stream: !Ne });
    const ge = A.split(/\r?\n/);
    A = ge.pop() || "";
    for (const Ce of ge) {
      if (!Ce.startsWith("data:")) continue;
      const ue = Ce.slice(5).trim();
      if (!ue || ue === "[DONE]") continue;
      const he = JSON.parse(ue);
      he.usage && (T = he.usage);
      const Re = (Te = (J = he.choices) == null ? void 0 : J[0]) == null ? void 0 : Te.delta;
      Re != null && Re.content && (E += Re.content, c(E));
      for (const Le of (Re == null ? void 0 : Re.tool_calls) || []) {
        const ke = Number(Le.index || 0), D = W.get(ke) || {
          id: "",
          type: "function",
          function: { name: "", arguments: "" }
        };
        D.id += Le.id || "", D.function.name += ((de = Le.function) == null ? void 0 : de.name) || "", D.function.arguments += ((fe = Le.function) == null ? void 0 : fe.arguments) || "", W.set(ke, D);
      }
    }
    if (Ne) break;
  }
  return Mp({
    choices: [{
      message: {
        role: "assistant",
        content: E || null,
        tool_calls: W.size ? Array.from(W.values()) : void 0
      }
    }],
    usage: T
  }, Kc(r));
}
function dm(r) {
  const o = r.filter((c) => c.role === "system").map((c) => c.content || "").filter(Boolean).join(`

`), i = [];
  for (const c of r.filter((p) => p.role !== "system")) {
    let p, h;
    if (c.role === "assistant") {
      p = "assistant";
      const y = [];
      c.content && y.push({ type: "text", text: c.content });
      for (const S of c.tool_calls || []) {
        let _ = {};
        try {
          _ = JSON.parse(S.function.arguments || "{}");
        } catch {
          _ = {};
        }
        y.push({
          type: "tool_use",
          id: S.id,
          name: S.function.name,
          input: _
        });
      }
      h = y.length ? y : "";
    } else c.role === "tool" ? (p = "user", h = [{
      type: "tool_result",
      tool_use_id: c.tool_call_id || "",
      content: c.content || ""
    }]) : (p = "user", h = c.content || "");
    const v = i.at(-1);
    if ((v == null ? void 0 : v.role) === p) {
      const y = typeof v.content == "string" ? [{ type: "text", text: v.content }] : v.content, S = typeof h == "string" ? [{ type: "text", text: h }] : h;
      v.content = [...y, ...S];
    } else
      i.push({ role: p, content: h });
  }
  return { system: o, messages: i };
}
function pm(r) {
  return r.flatMap((o) => {
    const i = o && typeof o == "object" ? o : {}, c = i.function && typeof i.function == "object" ? i.function : {};
    return typeof c.name == "string" ? [{
      name: c.name,
      description: typeof c.description == "string" ? c.description : "",
      input_schema: c.parameters || {
        type: "object",
        properties: {},
        additionalProperties: !1
      }
    }] : [];
  });
}
async function fm(r, o, i, c, p = rl) {
  const h = dm(o), v = await fetch(vf(r), {
    method: "POST",
    signal: i,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": r.apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: r.model,
      max_tokens: 4096,
      temperature: uf,
      system: h.system || void 0,
      messages: h.messages,
      tools: p.length ? pm(p) : void 0
    })
  });
  if (!v.ok) throw new Error(await As(v));
  const y = rt(await v.json(), "Anthropic response");
  if (!Array.isArray(y.content))
    throw new Error("Anthropic returned an invalid response");
  const S = y.content.filter(
    (W) => !!(W && typeof W == "object" && W.type === "text")
  ).map((W) => String(W.text || "")).join(""), _ = y.content.flatMap((W) => {
    const V = W && typeof W == "object" ? W : {};
    return V.type !== "tool_use" || typeof V.id != "string" || typeof V.name != "string" ? [] : [{
      id: V.id,
      type: "function",
      function: {
        name: V.name,
        arguments: JSON.stringify(V.input || {})
      }
    }];
  }), A = y.usage && typeof y.usage == "object" ? y.usage : {}, E = Number(A.input_tokens || 0), T = Number(A.output_tokens || 0);
  return S && c && c(S), {
    choices: [{
      message: {
        role: "assistant",
        content: S || null,
        tool_calls: _.length ? _ : void 0
      }
    }],
    usage: {
      prompt_tokens: E,
      completion_tokens: T,
      total_tokens: E + T
    }
  };
}
function Mp(r, o = "AI provider") {
  const i = rt(r, "AI response");
  if (!Array.isArray(i.choices) || !i.choices.length)
    throw new Error(`${o} returned no response choices`);
  for (const c of i.choices) {
    const p = rt(rt(c, "AI choice").message, "AI message");
    if (p.role !== "assistant" || !(p.content == null || typeof p.content == "string"))
      throw new Error(`${o} returned an invalid assistant message`);
    if (p.tool_calls != null) {
      if (!Array.isArray(p.tool_calls)) throw new Error(`${o} returned invalid tool calls`);
      for (const h of p.tool_calls) {
        const v = rt(h, "AI tool call"), y = rt(v.function, "AI tool function");
        if (typeof v.id != "string" || v.type !== "function" || typeof y.name != "string" || typeof y.arguments != "string") throw new Error(`${o} returned an invalid tool call`);
      }
    }
  }
  return i;
}
function gt(r) {
  const o = String(r instanceof Error ? r.message : r).slice(0, or), i = JSON.stringify({
    ok: !1,
    error: o,
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
  return i.length > or ? `${i.slice(0, or)}
[tool error truncated]` : i;
}
var ct = Uint8Array, pn = Uint16Array, ku = Int32Array, ol = new ct([
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
]), sl = new ct([
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
]), au = new ct([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), gf = function(r, o) {
  for (var i = new pn(31), c = 0; c < 31; ++c)
    i[c] = o += 1 << r[c - 1];
  for (var p = new ku(i[30]), c = 1; c < 30; ++c)
    for (var h = i[c]; h < i[c + 1]; ++h)
      p[h] = h - i[c] << 5 | c;
  return { b: i, r: p };
}, wf = gf(ol, 2), kf = wf.b, lu = wf.r;
kf[28] = 258, lu[258] = 28;
var xf = gf(sl, 0), hm = xf.b, zp = xf.r, cu = new pn(32768);
for (var tt = 0; tt < 32768; ++tt) {
  var io = (tt & 43690) >> 1 | (tt & 21845) << 1;
  io = (io & 52428) >> 2 | (io & 13107) << 2, io = (io & 61680) >> 4 | (io & 3855) << 4, cu[tt] = ((io & 65280) >> 8 | (io & 255) << 8) >> 1;
}
var ir = (function(r, o, i) {
  for (var c = r.length, p = 0, h = new pn(o); p < c; ++p)
    r[p] && ++h[r[p] - 1];
  var v = new pn(o);
  for (p = 1; p < o; ++p)
    v[p] = v[p - 1] + h[p - 1] << 1;
  var y;
  if (i) {
    y = new pn(1 << o);
    var S = 15 - o;
    for (p = 0; p < c; ++p)
      if (r[p])
        for (var _ = p << 4 | r[p], A = o - r[p], E = v[r[p] - 1]++ << A, T = E | (1 << A) - 1; E <= T; ++E)
          y[cu[E] >> S] = _;
  } else
    for (y = new pn(c), p = 0; p < c; ++p)
      r[p] && (y[p] = cu[v[r[p] - 1]++] >> 15 - r[p]);
  return y;
}), lo = new ct(288);
for (var tt = 0; tt < 144; ++tt)
  lo[tt] = 8;
for (var tt = 144; tt < 256; ++tt)
  lo[tt] = 9;
for (var tt = 256; tt < 280; ++tt)
  lo[tt] = 7;
for (var tt = 280; tt < 288; ++tt)
  lo[tt] = 8;
var Oi = new ct(32);
for (var tt = 0; tt < 32; ++tt)
  Oi[tt] = 5;
var mm = /* @__PURE__ */ ir(lo, 9, 0), ym = /* @__PURE__ */ ir(lo, 9, 1), vm = /* @__PURE__ */ ir(Oi, 5, 0), gm = /* @__PURE__ */ ir(Oi, 5, 1), Qc = function(r) {
  for (var o = r[0], i = 1; i < r.length; ++i)
    r[i] > o && (o = r[i]);
  return o;
}, Ln = function(r, o, i) {
  var c = o / 8 | 0;
  return (r[c] | r[c + 1] << 8) >> (o & 7) & i;
}, Jc = function(r, o) {
  var i = o / 8 | 0;
  return (r[i] | r[i + 1] << 8 | r[i + 2] << 16) >> (o & 7);
}, xu = function(r) {
  return (r + 7) / 8 | 0;
}, Ti = function(r, o, i) {
  return (o == null || o < 0) && (o = 0), (i == null || i > r.length) && (i = r.length), new ct(r.subarray(o, i));
}, wm = [
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
], Vt = function(r, o, i) {
  var c = new Error(o || wm[r]);
  if (c.code = r, Error.captureStackTrace && Error.captureStackTrace(c, Vt), !i)
    throw c;
  return c;
}, km = function(r, o, i, c) {
  var p = r.length, h = c ? c.length : 0;
  if (!p || o.f && !o.l)
    return i || new ct(0);
  var v = !i, y = v || o.i != 2, S = o.i;
  v && (i = new ct(p * 3));
  var _ = function(zt) {
    var hn = i.length;
    if (zt > hn) {
      var Wt = new ct(Math.max(hn * 2, zt));
      Wt.set(i), i = Wt;
    }
  }, A = o.f || 0, E = o.p || 0, T = o.b || 0, W = o.l, V = o.d, z = o.m, J = o.n, Te = p * 8;
  do {
    if (!W) {
      A = Ln(r, E, 1);
      var de = Ln(r, E + 1, 3);
      if (E += 3, de)
        if (de == 1)
          W = ym, V = gm, z = 9, J = 5;
        else if (de == 2) {
          var ge = Ln(r, E, 31) + 257, Ce = Ln(r, E + 10, 15) + 4, ue = ge + Ln(r, E + 5, 31) + 1;
          E += 14;
          for (var he = new ct(ue), Re = new ct(19), Le = 0; Le < Ce; ++Le)
            Re[au[Le]] = Ln(r, E + Le * 3, 7);
          E += Ce * 3;
          for (var ke = Qc(Re), D = (1 << ke) - 1, Se = ir(Re, ke, 1), Le = 0; Le < ue; ) {
            var De = Se[Ln(r, E, D)];
            E += De & 15;
            var fe = De >> 4;
            if (fe < 16)
              he[Le++] = fe;
            else {
              var Pe = 0, Ae = 0;
              for (fe == 16 ? (Ae = 3 + Ln(r, E, 3), E += 2, Pe = he[Le - 1]) : fe == 17 ? (Ae = 3 + Ln(r, E, 7), E += 3) : fe == 18 && (Ae = 11 + Ln(r, E, 127), E += 7); Ae--; )
                he[Le++] = Pe;
            }
          }
          var Q = he.subarray(0, ge), re = he.subarray(ge);
          z = Qc(Q), J = Qc(re), W = ir(Q, z, 1), V = ir(re, J, 1);
        } else
          Vt(1);
      else {
        var fe = xu(E) + 4, ae = r[fe - 4] | r[fe - 3] << 8, Ne = fe + ae;
        if (Ne > p) {
          S && Vt(0);
          break;
        }
        y && _(T + ae), i.set(r.subarray(fe, Ne), T), o.b = T += ae, o.p = E = Ne * 8, o.f = A;
        continue;
      }
      if (E > Te) {
        S && Vt(0);
        break;
      }
    }
    y && _(T + 131072);
    for (var ne = (1 << z) - 1, C = (1 << J) - 1, F = E; ; F = E) {
      var Pe = W[Jc(r, E) & ne], xe = Pe >> 4;
      if (E += Pe & 15, E > Te) {
        S && Vt(0);
        break;
      }
      if (Pe || Vt(2), xe < 256)
        i[T++] = xe;
      else if (xe == 256) {
        F = E, W = null;
        break;
      } else {
        var we = xe - 254;
        if (xe > 264) {
          var Le = xe - 257, me = ol[Le];
          we = Ln(r, E, (1 << me) - 1) + kf[Le], E += me;
        }
        var _e = V[Jc(r, E) & C], Ue = _e >> 4;
        _e || Vt(3), E += _e & 15;
        var re = hm[Ue];
        if (Ue > 3) {
          var me = sl[Ue];
          re += Jc(r, E) & (1 << me) - 1, E += me;
        }
        if (E > Te) {
          S && Vt(0);
          break;
        }
        y && _(T + 131072);
        var Oe = T + we;
        if (T < re) {
          var Ze = h - re, Je = Math.min(re, Oe);
          for (Ze + T < 0 && Vt(3); T < Je; ++T)
            i[T] = c[Ze + T];
        }
        for (; T < Oe; ++T)
          i[T] = i[T - re];
      }
    }
    o.l = W, o.p = F, o.b = T, o.f = A, W && (A = 1, o.m = z, o.d = V, o.n = J);
  } while (!A);
  return T != i.length && v ? Ti(i, 0, T) : i.subarray(0, T);
}, br = function(r, o, i) {
  i <<= o & 7;
  var c = o / 8 | 0;
  r[c] |= i, r[c + 1] |= i >> 8;
}, Ci = function(r, o, i) {
  i <<= o & 7;
  var c = o / 8 | 0;
  r[c] |= i, r[c + 1] |= i >> 8, r[c + 2] |= i >> 16;
}, Gc = function(r, o) {
  for (var i = [], c = 0; c < r.length; ++c)
    r[c] && i.push({ s: c, f: r[c] });
  var p = i.length, h = i.slice();
  if (!p)
    return { t: Sf, l: 0 };
  if (p == 1) {
    var v = new ct(i[0].s + 1);
    return v[i[0].s] = 1, { t: v, l: 1 };
  }
  i.sort(function(Ne, ge) {
    return Ne.f - ge.f;
  }), i.push({ s: -1, f: 25001 });
  var y = i[0], S = i[1], _ = 0, A = 1, E = 2;
  for (i[0] = { s: -1, f: y.f + S.f, l: y, r: S }; A != p - 1; )
    y = i[i[_].f < i[E].f ? _++ : E++], S = i[_ != A && i[_].f < i[E].f ? _++ : E++], i[A++] = { s: -1, f: y.f + S.f, l: y, r: S };
  for (var T = h[0].s, c = 1; c < p; ++c)
    h[c].s > T && (T = h[c].s);
  var W = new pn(T + 1), V = uu(i[A - 1], W, 0);
  if (V > o) {
    var c = 0, z = 0, J = V - o, Te = 1 << J;
    for (h.sort(function(ge, Ce) {
      return W[Ce.s] - W[ge.s] || ge.f - Ce.f;
    }); c < p; ++c) {
      var de = h[c].s;
      if (W[de] > o)
        z += Te - (1 << V - W[de]), W[de] = o;
      else
        break;
    }
    for (z >>= J; z > 0; ) {
      var fe = h[c].s;
      W[fe] < o ? z -= 1 << o - W[fe]++ - 1 : ++c;
    }
    for (; c >= 0 && z; --c) {
      var ae = h[c].s;
      W[ae] == o && (--W[ae], ++z);
    }
    V = o;
  }
  return { t: new ct(W), l: V };
}, uu = function(r, o, i) {
  return r.s == -1 ? Math.max(uu(r.l, o, i + 1), uu(r.r, o, i + 1)) : o[r.s] = i;
}, Lp = function(r) {
  for (var o = r.length; o && !r[--o]; )
    ;
  for (var i = new pn(++o), c = 0, p = r[0], h = 1, v = function(S) {
    i[c++] = S;
  }, y = 1; y <= o; ++y)
    if (r[y] == p && y != o)
      ++h;
    else {
      if (!p && h > 2) {
        for (; h > 138; h -= 138)
          v(32754);
        h > 2 && (v(h > 10 ? h - 11 << 5 | 28690 : h - 3 << 5 | 12305), h = 0);
      } else if (h > 3) {
        for (v(p), --h; h > 6; h -= 6)
          v(8304);
        h > 2 && (v(h - 3 << 5 | 8208), h = 0);
      }
      for (; h--; )
        v(p);
      h = 1, p = r[y];
    }
  return { c: i.subarray(0, c), n: o };
}, Ni = function(r, o) {
  for (var i = 0, c = 0; c < o.length; ++c)
    i += r[c] * o[c];
  return i;
}, _f = function(r, o, i) {
  var c = i.length, p = xu(o + 2);
  r[p] = c & 255, r[p + 1] = c >> 8, r[p + 2] = r[p] ^ 255, r[p + 3] = r[p + 1] ^ 255;
  for (var h = 0; h < c; ++h)
    r[p + h + 4] = i[h];
  return (p + 4 + c) * 8;
}, Fp = function(r, o, i, c, p, h, v, y, S, _, A) {
  br(o, A++, i), ++p[256];
  for (var E = Gc(p, 15), T = E.t, W = E.l, V = Gc(h, 15), z = V.t, J = V.l, Te = Lp(T), de = Te.c, fe = Te.n, ae = Lp(z), Ne = ae.c, ge = ae.n, Ce = new pn(19), ue = 0; ue < de.length; ++ue)
    ++Ce[de[ue] & 31];
  for (var ue = 0; ue < Ne.length; ++ue)
    ++Ce[Ne[ue] & 31];
  for (var he = Gc(Ce, 7), Re = he.t, Le = he.l, ke = 19; ke > 4 && !Re[au[ke - 1]]; --ke)
    ;
  var D = _ + 5 << 3, Se = Ni(p, lo) + Ni(h, Oi) + v, De = Ni(p, T) + Ni(h, z) + v + 14 + 3 * ke + Ni(Ce, Re) + 2 * Ce[16] + 3 * Ce[17] + 7 * Ce[18];
  if (S >= 0 && D <= Se && D <= De)
    return _f(o, A, r.subarray(S, S + _));
  var Pe, Ae, Q, re;
  if (br(o, A, 1 + (De < Se)), A += 2, De < Se) {
    Pe = ir(T, W, 0), Ae = T, Q = ir(z, J, 0), re = z;
    var ne = ir(Re, Le, 0);
    br(o, A, fe - 257), br(o, A + 5, ge - 1), br(o, A + 10, ke - 4), A += 14;
    for (var ue = 0; ue < ke; ++ue)
      br(o, A + 3 * ue, Re[au[ue]]);
    A += 3 * ke;
    for (var C = [de, Ne], F = 0; F < 2; ++F)
      for (var xe = C[F], ue = 0; ue < xe.length; ++ue) {
        var we = xe[ue] & 31;
        br(o, A, ne[we]), A += Re[we], we > 15 && (br(o, A, xe[ue] >> 5 & 127), A += xe[ue] >> 12);
      }
  } else
    Pe = mm, Ae = lo, Q = vm, re = Oi;
  for (var ue = 0; ue < y; ++ue) {
    var me = c[ue];
    if (me > 255) {
      var we = me >> 18 & 31;
      Ci(o, A, Pe[we + 257]), A += Ae[we + 257], we > 7 && (br(o, A, me >> 23 & 31), A += ol[we]);
      var _e = me & 31;
      Ci(o, A, Q[_e]), A += re[_e], _e > 3 && (Ci(o, A, me >> 5 & 8191), A += sl[_e]);
    } else
      Ci(o, A, Pe[me]), A += Ae[me];
  }
  return Ci(o, A, Pe[256]), A + Ae[256];
}, xm = /* @__PURE__ */ new ku([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Sf = /* @__PURE__ */ new ct(0), _m = function(r, o, i, c, p, h) {
  var v = h.z || r.length, y = new ct(c + v + 5 * (1 + Math.ceil(v / 7e3)) + p), S = y.subarray(c, y.length - p), _ = h.l, A = (h.r || 0) & 7;
  if (o) {
    A && (S[0] = h.r >> 3);
    for (var E = xm[o - 1], T = E >> 13, W = E & 8191, V = (1 << i) - 1, z = h.p || new pn(32768), J = h.h || new pn(V + 1), Te = Math.ceil(i / 3), de = 2 * Te, fe = function(tn) {
      return (r[tn] ^ r[tn + 1] << Te ^ r[tn + 2] << de) & V;
    }, ae = new ku(25e3), Ne = new pn(288), ge = new pn(32), Ce = 0, ue = 0, he = h.i || 0, Re = 0, Le = h.w || 0, ke = 0; he + 2 < v; ++he) {
      var D = fe(he), Se = he & 32767, De = J[D];
      if (z[Se] = De, J[D] = Se, Le <= he) {
        var Pe = v - he;
        if ((Ce > 7e3 || Re > 24576) && (Pe > 423 || !_)) {
          A = Fp(r, S, 0, ae, Ne, ge, ue, Re, ke, he - ke, A), Re = Ce = ue = 0, ke = he;
          for (var Ae = 0; Ae < 286; ++Ae)
            Ne[Ae] = 0;
          for (var Ae = 0; Ae < 30; ++Ae)
            ge[Ae] = 0;
        }
        var Q = 2, re = 0, ne = W, C = Se - De & 32767;
        if (Pe > 2 && D == fe(he - C))
          for (var F = Math.min(T, Pe) - 1, xe = Math.min(32767, he), we = Math.min(258, Pe); C <= xe && --ne && Se != De; ) {
            if (r[he + Q] == r[he + Q - C]) {
              for (var me = 0; me < we && r[he + me] == r[he + me - C]; ++me)
                ;
              if (me > Q) {
                if (Q = me, re = C, me > F)
                  break;
                for (var _e = Math.min(C, me - 2), Ue = 0, Ae = 0; Ae < _e; ++Ae) {
                  var Oe = he - C + Ae & 32767, Ze = z[Oe], Je = Oe - Ze & 32767;
                  Je > Ue && (Ue = Je, De = Oe);
                }
              }
            }
            Se = De, De = z[Se], C += Se - De & 32767;
          }
        if (re) {
          ae[Re++] = 268435456 | lu[Q] << 18 | zp[re];
          var zt = lu[Q] & 31, hn = zp[re] & 31;
          ue += ol[zt] + sl[hn], ++Ne[257 + zt], ++ge[hn], Le = he + Q, ++Ce;
        } else
          ae[Re++] = r[he], ++Ne[r[he]];
      }
    }
    for (he = Math.max(he, Le); he < v; ++he)
      ae[Re++] = r[he], ++Ne[r[he]];
    A = Fp(r, S, _, ae, Ne, ge, ue, Re, ke, he - ke, A), _ || (h.r = A & 7 | S[A / 8 | 0] << 3, A -= 7, h.h = J, h.p = z, h.i = he, h.w = Le);
  } else {
    for (var he = h.w || 0; he < v + _; he += 65535) {
      var Wt = he + 65535;
      Wt >= v && (S[A / 8 | 0] = _, Wt = v), A = _f(S, A + 1, r.subarray(he, Wt));
    }
    h.i = v;
  }
  return Ti(y, 0, c + xu(A) + p);
}, Sm = /* @__PURE__ */ (function() {
  for (var r = new Int32Array(256), o = 0; o < 256; ++o) {
    for (var i = o, c = 9; --c; )
      i = (i & 1 && -306674912) ^ i >>> 1;
    r[o] = i;
  }
  return r;
})(), bm = function() {
  var r = -1;
  return {
    p: function(o) {
      for (var i = r, c = 0; c < o.length; ++c)
        i = Sm[i & 255 ^ o[c]] ^ i >>> 8;
      r = i;
    },
    d: function() {
      return ~r;
    }
  };
}, jm = function(r, o, i, c, p) {
  if (!p && (p = { l: 1 }, o.dictionary)) {
    var h = o.dictionary.subarray(-32768), v = new ct(h.length + r.length);
    v.set(h), v.set(r, h.length), r = v, p.w = h.length;
  }
  return _m(r, o.level == null ? 6 : o.level, o.mem == null ? p.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(r.length))) * 1.5) : 20 : 12 + o.mem, i, c, p);
}, bf = function(r, o) {
  var i = {};
  for (var c in r)
    i[c] = r[c];
  for (var c in o)
    i[c] = o[c];
  return i;
}, sr = function(r, o) {
  return r[o] | r[o + 1] << 8;
}, Fn = function(r, o) {
  return (r[o] | r[o + 1] << 8 | r[o + 2] << 16 | r[o + 3] << 24) >>> 0;
}, Xc = function(r, o) {
  return Fn(r, o) + Fn(r, o + 4) * 4294967296;
}, Et = function(r, o, i) {
  for (; i; ++o)
    r[o] = i, i >>>= 8;
};
function Em(r, o) {
  return jm(r, o || {}, 0, 0);
}
function Cm(r, o) {
  return km(r, { i: 2 }, o && o.out, o && o.dictionary);
}
var jf = function(r, o, i, c) {
  for (var p in r) {
    var h = r[p], v = o + p, y = c;
    Array.isArray(h) && (y = bf(c, h[1]), h = h[0]), h instanceof ct ? i[v] = [h, y] : (i[v += "/"] = [new ct(0), y], jf(h, v, i, c));
  }
}, Dp = typeof TextEncoder < "u" && /* @__PURE__ */ new TextEncoder(), du = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), Nm = 0;
try {
  du.decode(Sf, { stream: !0 }), Nm = 1;
} catch {
}
var Am = function(r) {
  for (var o = "", i = 0; ; ) {
    var c = r[i++], p = (c > 127) + (c > 223) + (c > 239);
    if (i + p > r.length)
      return { s: o, r: Ti(r, i - 1) };
    p ? p == 3 ? (c = ((c & 15) << 18 | (r[i++] & 63) << 12 | (r[i++] & 63) << 6 | r[i++] & 63) - 65536, o += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023)) : p & 1 ? o += String.fromCharCode((c & 31) << 6 | r[i++] & 63) : o += String.fromCharCode((c & 15) << 12 | (r[i++] & 63) << 6 | r[i++] & 63) : o += String.fromCharCode(c);
  }
};
function pu(r, o) {
  var i;
  if (Dp)
    return Dp.encode(r);
  for (var c = r.length, p = new ct(r.length + (r.length >> 1)), h = 0, v = function(_) {
    p[h++] = _;
  }, i = 0; i < c; ++i) {
    if (h + 5 > p.length) {
      var y = new ct(h + 8 + (c - i << 1));
      y.set(p), p = y;
    }
    var S = r.charCodeAt(i);
    S < 128 || o ? v(S) : S < 2048 ? (v(192 | S >> 6), v(128 | S & 63)) : S > 55295 && S < 57344 ? (S = 65536 + (S & 1047552) | r.charCodeAt(++i) & 1023, v(240 | S >> 18), v(128 | S >> 12 & 63), v(128 | S >> 6 & 63), v(128 | S & 63)) : (v(224 | S >> 12), v(128 | S >> 6 & 63), v(128 | S & 63));
  }
  return Ti(p, 0, h);
}
function Ef(r, o) {
  if (o) {
    for (var i = "", c = 0; c < r.length; c += 16384)
      i += String.fromCharCode.apply(null, r.subarray(c, c + 16384));
    return i;
  } else {
    if (du)
      return du.decode(r);
    var p = Am(r), h = p.s, i = p.r;
    return i.length && Vt(8), h;
  }
}
var Im = function(r, o) {
  return o + 30 + sr(r, o + 26) + sr(r, o + 28);
}, Pm = function(r, o, i) {
  var c = sr(r, o + 28), p = Ef(r.subarray(o + 46, o + 46 + c), !(sr(r, o + 8) & 2048)), h = o + 46 + c, v = Fn(r, o + 20), y = i && v == 4294967295 ? $m(r, h) : [v, Fn(r, o + 24), Fn(r, o + 42)], S = y[0], _ = y[1], A = y[2];
  return [sr(r, o + 10), S, _, p, h + sr(r, o + 30) + sr(r, o + 32), A];
}, $m = function(r, o) {
  for (; sr(r, o) != 1; o += 4 + sr(r, o + 2))
    ;
  return [Xc(r, o + 12), Xc(r, o + 4), Xc(r, o + 20)];
}, fu = function(r) {
  var o = 0;
  if (r)
    for (var i in r) {
      var c = r[i].length;
      c > 65535 && Vt(9), o += c + 4;
    }
  return o;
}, Up = function(r, o, i, c, p, h, v, y) {
  var S = c.length, _ = i.extra, A = y && y.length, E = fu(_);
  Et(r, o, v != null ? 33639248 : 67324752), o += 4, v != null && (r[o++] = 20, r[o++] = i.os), r[o] = 20, o += 2, r[o++] = i.flag << 1 | (h < 0 && 8), r[o++] = p && 8, r[o++] = i.compression & 255, r[o++] = i.compression >> 8;
  var T = new Date(i.mtime == null ? Date.now() : i.mtime), W = T.getFullYear() - 1980;
  if ((W < 0 || W > 119) && Vt(10), Et(r, o, W << 25 | T.getMonth() + 1 << 21 | T.getDate() << 16 | T.getHours() << 11 | T.getMinutes() << 5 | T.getSeconds() >> 1), o += 4, h != -1 && (Et(r, o, i.crc), Et(r, o + 4, h < 0 ? -h - 2 : h), Et(r, o + 8, i.size)), Et(r, o + 12, S), Et(r, o + 14, E), o += 16, v != null && (Et(r, o, A), Et(r, o + 6, i.attrs), Et(r, o + 10, v), o += 14), r.set(c, o), o += S, E)
    for (var V in _) {
      var z = _[V], J = z.length;
      Et(r, o, +V), Et(r, o + 2, J), r.set(z, o + 4), o += 4 + J;
    }
  return A && (r.set(y, o), o += A), o;
}, Rm = function(r, o, i, c, p) {
  Et(r, o, 101010256), Et(r, o + 8, i), Et(r, o + 10, i), Et(r, o + 12, c), Et(r, o + 16, p);
};
function Cf(r, o) {
  o || (o = {});
  var i = {}, c = [];
  jf(r, "", i, o);
  var p = 0, h = 0;
  for (var v in i) {
    var y = i[v], S = y[0], _ = y[1], A = _.level == 0 ? 0 : 8, E = pu(v), T = E.length, W = _.comment, V = W && pu(W), z = V && V.length, J = fu(_.extra);
    T > 65535 && Vt(11);
    var Te = A ? Em(S, _) : S, de = Te.length, fe = bm();
    fe.p(S), c.push(bf(_, {
      size: S.length,
      crc: fe.d(),
      c: Te,
      f: E,
      m: V,
      u: T != v.length || V && W.length != z,
      o: p,
      compression: A
    })), p += 30 + T + J + de, h += 76 + 2 * (T + J) + (z || 0) + de;
  }
  for (var ae = new ct(h + 22), Ne = p, ge = h - p, Ce = 0; Ce < c.length; ++Ce) {
    var E = c[Ce];
    Up(ae, E.o, E, E.f, E.u, E.c.length);
    var ue = 30 + E.f.length + fu(E.extra);
    ae.set(E.c, E.o + ue), Up(ae, p, E, E.f, E.u, E.c.length, E.o, E.m), p += 16 + ue + (E.m ? E.m.length : 0);
  }
  return Rm(ae, p, c.length, ge, Ne), ae;
}
function Om(r, o) {
  for (var i = {}, c = r.length - 22; Fn(r, c) != 101010256; --c)
    (!c || r.length - c > 65558) && Vt(13);
  var p = sr(r, c + 8);
  if (!p)
    return {};
  var h = Fn(r, c + 16), v = h == 4294967295 || p == 65535;
  if (v) {
    var y = Fn(r, c - 12);
    v = Fn(r, y) == 101075792, v && (p = Fn(r, y + 32), h = Fn(r, y + 48));
  }
  for (var S = 0; S < p; ++S) {
    var _ = Pm(r, h, v), A = _[0], E = _[1], T = _[2], W = _[3], V = _[4], z = _[5], J = Im(r, z);
    h = V, A ? A == 8 ? i[W] = Cm(r.subarray(J, J + E), { out: new ct(T) }) : Vt(14, "unknown compression type " + A) : i[W] = Ti(r, J, J + E);
  }
  return i;
}
const Tm = "omero-analysis-workspaces", Mm = 1, el = [
  "workspaces",
  "chats",
  "files",
  "executions",
  "methods",
  "pipelines",
  "notebooks",
  "artifacts",
  "audits",
  "evidence"
];
function co(r) {
  return new Promise((o, i) => {
    r.onsuccess = () => o(r.result), r.onerror = () => i(r.error);
  });
}
function Is(r) {
  return new Promise((o, i) => {
    r.oncomplete = () => o(), r.onerror = () => i(r.error), r.onabort = () => i(r.error || new Error("Storage transaction aborted"));
  });
}
function zm(r) {
  return new Promise((o, i) => {
    const c = indexedDB.open(r, Mm);
    c.onupgradeneeded = () => {
      const p = c.result;
      p.objectStoreNames.contains("values") || p.createObjectStore("values");
      for (const h of el) {
        const v = p.objectStoreNames.contains(h) ? c.transaction.objectStore(h) : p.createObjectStore(h, { keyPath: "id" });
        h !== "workspaces" && !v.indexNames.contains("workspaceId") && v.createIndex("workspaceId", "workspaceId"), h === "workspaces" && !v.indexNames.contains("contextKey") && v.createIndex("contextKey", "contextKey", { unique: !0 }), (h === "files" || h === "executions" || h === "evidence") && !v.indexNames.contains("chatId") && v.createIndex("chatId", "chatId");
      }
    }, c.onsuccess = () => o(c.result), c.onerror = () => i(c.error);
  });
}
let Vp;
function Cn() {
  return Vp ?? (Vp = zm(Tm)), Vp;
}
async function Lm(r) {
  const i = (await Cn()).transaction("values", "readonly");
  return co(i.objectStore("values").get(r));
}
async function Fm(r, o) {
  const c = (await Cn()).transaction("values", "readwrite");
  c.objectStore("values").put(o, r), await Is(c);
}
async function Er(r, o) {
  const c = (await Cn()).transaction(r, "readwrite");
  c.objectStore(r).put(o), await Is(c);
}
let Wp = Promise.resolve();
function fn(r) {
  const o = Wp.then(r, r);
  return Wp = o.catch(() => {
  }), o;
}
async function Dm(r, o) {
  const c = (await Cn()).transaction(r, "readwrite");
  c.objectStore(r).delete(o), await Is(c);
}
async function St(r, o) {
  const c = (await Cn()).transaction(r, "readonly");
  return co(c.objectStore(r).index("workspaceId").getAll(o));
}
const Bp = (r) => fn(() => Er("workspaces", r)), Yc = (r) => fn(() => Er("chats", r)), Ai = (r) => fn(() => Er("files", r)), Um = (r) => fn(() => Er("executions", r)), js = (r) => fn(() => Er("methods", r)), eu = (r) => fn(() => Er("pipelines", r)), tu = (r) => fn(() => Er("notebooks", r)), Vm = (r) => fn(() => Er("artifacts", r)), Wm = (r) => fn(() => Er("audits", r)), Bm = (r, o) => fn(async () => {
  const c = (await Cn()).transaction("evidence", "readwrite"), p = c.objectStore("evidence");
  (await co(p.index("chatId").getAllKeys(r))).forEach((v) => p.delete(v)), o.forEach((v) => p.put(v)), await Is(c);
}), qm = (r) => fn(() => Dm("files", r));
async function Zm(r) {
  await fn(async () => {
    const i = (await Cn()).transaction([...el], "readwrite");
    for (const c of el) {
      const p = i.objectStore(c);
      if (c === "workspaces") {
        p.delete(r);
        continue;
      }
      (await co(p.index("workspaceId").getAllKeys(r))).forEach((v) => p.delete(v));
    }
    await Is(i);
  });
}
async function Nf(r) {
  return r ? `${r.user_id}:${r.group_id}:${r.object_type}:${r.object_id}` : "standalone";
}
function Hm(r) {
  return r.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 64).toLowerCase() || "workspace";
}
function Km(r) {
  return r ? `OMERO/${r.object_type}-${r.object_id}--${Hm(r.name)}` : "OMERO/Local--workspace";
}
async function en(r) {
  const o = typeof r == "string" ? new TextEncoder().encode(r) : new Uint8Array(r), i = await crypto.subtle.digest("SHA-256", o);
  return Array.from(new Uint8Array(i), (c) => c.toString(16).padStart(2, "0")).join("");
}
function tl(r, o = "New analysis") {
  const i = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: crypto.randomUUID(),
    workspaceId: r,
    title: o,
    summary: "",
    archived: !1,
    messages: [],
    createdAt: i,
    updatedAt: i
  };
}
async function Qm(r) {
  const i = (await Cn()).transaction("workspaces", "readonly");
  return co(i.objectStore("workspaces").index("contextKey").get(r));
}
async function rr(r) {
  await fn(async () => {
    const i = (await Cn()).transaction([...el], "readwrite"), c = {
      ...r.workspace,
      revision: (r.workspace.revision || 0) + 1
    };
    i.objectStore("workspaces").put(c), r.chats.forEach((p) => i.objectStore("chats").put(p)), r.files.forEach((p) => i.objectStore("files").put(p)), r.executions.forEach((p) => i.objectStore("executions").put(p)), r.methods.forEach((p) => i.objectStore("methods").put(p)), r.pipelines.forEach((p) => i.objectStore("pipelines").put(p)), r.notebooks.forEach((p) => i.objectStore("notebooks").put(p)), r.artifacts.forEach((p) => i.objectStore("artifacts").put(p)), r.audits.forEach((p) => i.objectStore("audits").put(p)), r.evidence.forEach((p) => i.objectStore("evidence").put(p)), await Is(i);
  });
}
async function Jm(r) {
  const o = await Nf(r);
  let i = await Qm(o);
  if (!i) {
    const T = (/* @__PURE__ */ new Date()).toISOString(), W = tl(crypto.randomUUID());
    i = {
      id: W.workspaceId,
      contextKey: o,
      rootPath: Km(r),
      name: (r == null ? void 0 : r.name) || "Local workspace",
      objectType: r == null ? void 0 : r.object_type,
      objectId: r == null ? void 0 : r.object_id,
      userId: (r == null ? void 0 : r.user_id) || 0,
      groupId: (r == null ? void 0 : r.group_id) || 0,
      activeChatId: W.id,
      plotCsv: !0,
      createdAt: T,
      updatedAt: T
    };
    const V = {
      workspace: i,
      chats: [W],
      files: [],
      executions: [],
      methods: [],
      pipelines: [],
      notebooks: [],
      artifacts: [],
      audits: [],
      evidence: []
    };
    return await rr(V), V;
  }
  const [c, p, h, v, y, S, _, A, E] = await Promise.all([
    St("chats", i.id),
    St("files", i.id),
    St("executions", i.id),
    St("methods", i.id),
    St("pipelines", i.id),
    St("notebooks", i.id),
    St("artifacts", i.id),
    St("audits", i.id),
    St("evidence", i.id)
  ]);
  if (!c.length) {
    const T = tl(i.id);
    i = { ...i, activeChatId: T.id, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }, await rr({
      workspace: i,
      chats: [T],
      files: p,
      executions: h,
      methods: v,
      pipelines: y,
      notebooks: S,
      artifacts: _,
      audits: A,
      evidence: E
    }), c.push(T);
  }
  return { workspace: i, chats: c, files: p, executions: h, methods: v, pipelines: y, notebooks: S, artifacts: _, audits: A, evidence: E };
}
async function ao(r) {
  const o = await Nf(r), c = (await Cn()).transaction("workspaces", "readonly");
  return (await co(c.objectStore("workspaces").getAll())).filter(
    (h) => h.contextKey === o || h.contextKey.startsWith(`${o}:import:`)
  ).sort((h, v) => v.updatedAt.localeCompare(h.updatedAt));
}
async function Ii(r) {
  if (!r) return ao(null);
  const i = (await Cn()).transaction("workspaces", "readonly");
  return (await co(i.objectStore("workspaces").getAll())).filter(
    (p) => p.userId === r.user_id && p.groupId === r.group_id
  ).sort((p, h) => `${p.objectType || ""}:${p.objectId || 0}`.localeCompare(
    `${h.objectType || ""}:${h.objectId || 0}`
  ) || h.updatedAt.localeCompare(p.updatedAt));
}
async function Pi(r) {
  const i = (await Cn()).transaction("workspaces", "readonly"), c = await co(i.objectStore("workspaces").get(r));
  if (!c) return;
  const [p, h, v, y, S, _, A, E, T] = await Promise.all([
    St("chats", c.id),
    St("files", c.id),
    St("executions", c.id),
    St("methods", c.id),
    St("pipelines", c.id),
    St("notebooks", c.id),
    St("artifacts", c.id),
    St("audits", c.id),
    St("evidence", c.id)
  ]);
  return { workspace: c, chats: p, files: h, executions: v, methods: y, pipelines: S, notebooks: _, artifacts: A, audits: E, evidence: T };
}
async function Ba() {
  var o, i;
  const r = await ((i = (o = navigator.storage) == null ? void 0 : o.estimate) == null ? void 0 : i.call(o));
  return { usage: (r == null ? void 0 : r.usage) || 0, quota: (r == null ? void 0 : r.quota) || 0 };
}
const qp = "provider:generic", Zp = {
  protocol: "openai",
  endpoint: "",
  authMode: "bearer",
  apiKey: "",
  model: "",
  contextWindow: 0,
  rememberKey: !1
}, Af = "nl.bioimaging.analysis.workspace.v1", If = 1, Pf = 1e4, $f = 512 * 1024 * 1024;
function En(r) {
  return r.replace(/[\\/\x00-\x1f\x7f]/g, "_").replace(/^\.+$/, "_").slice(0, 180);
}
function Wo(r) {
  return new Uint8Array(pu(r));
}
function Gm(r) {
  const o = [`# ${r.title}`, "", `Updated: ${r.updatedAt}`, ""];
  r.summary && o.push("## Conversation summary", "", r.summary, "");
  for (const i of r.messages)
    i.kind !== "execution" && o.push(`## ${i.role === "user" ? "User" : "Assistant"}`, "", i.content, "");
  return o.join(`
`);
}
function Hp(r, o) {
  const i = {}, c = [], p = r.files.filter((_) => !_.deletedAt).map((_) => {
    const A = { ..._ };
    if (delete A.data, _.source === "local" && o)
      return c.push(_.name), A.state = "missing", A.error = "Local input was omitted because the Workspace snapshot exceeded its size limit.", A;
    if (_.source === "omero" || !_.data) return A;
    const T = _.notebookId ? `Notebook/${En(_.notebookId)}` : `Chat/${En(_.chatId || "unassigned")}`, W = _.source === "local" ? `Input/${En(_.id)}--${En(_.name)}` : `Results/${T}/${En(_.id)}--${En(_.name)}`;
    return A.archivePath = W, i[W] = new Uint8Array(_.data), A;
  }), h = {
    format: Af,
    version: If,
    exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    workspace: { ...r.workspace },
    chats: r.chats,
    executions: r.executions,
    methods: r.methods,
    pipelines: r.pipelines,
    notebooks: r.notebooks,
    artifacts: r.artifacts,
    audits: r.audits.map((_) => ({ ..._, payload: "[omitted from snapshot]" })),
    evidence: r.evidence,
    files: p,
    omittedLocalInputs: c
  };
  i["workspace.json"] = Wo(JSON.stringify(h, null, 2));
  for (const _ of r.chats) {
    const A = `Chat/${En(_.id)}`;
    i[`${A}/chat.json`] = Wo(JSON.stringify(_, null, 2)), i[`${A}/chat.md`] = Wo(Gm(_));
  }
  for (const _ of r.methods) {
    const A = `Methods/${En(_.id)}`;
    i[`${A}/method.json`] = Wo(JSON.stringify(_, null, 2));
    for (const E of _.versions)
      i[`${A}/v${String(E.version).padStart(3, "0")}.py`] = Wo(E.code);
  }
  for (const _ of r.pipelines)
    i[`Pipelines/${En(_.id)}.json`] = Wo(JSON.stringify(_, null, 2));
  for (const _ of r.notebooks)
    i[`Notebooks/${En(_.id)}--${En(_.name)}`] = Wo(JSON.stringify(_.document, null, 2));
  const v = Cf(i, { level: 0 }), S = `${En(r.workspace.rootPath.split("/").at(-1) || "analysis-workspace")}-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.oa-workspace.zip`;
  return { data: v, filename: S, omittedLocalInputs: c, manifest: h };
}
function Xm(r, o) {
  const i = Hp(r, !1);
  if (i.data.byteLength <= o) return i;
  const c = Hp(r, !0);
  if (c.data.byteLength > o)
    throw new Error(
      `Chats, Methods, Notebooks, and generated results require ${(c.data.byteLength / 1024 / 1024).toFixed(1)} MiB, exceeding the ${(o / 1024 / 1024).toFixed(0)} MiB snapshot limit.`
    );
  return c;
}
function hu(r) {
  if (!r || r.startsWith("/") || r.startsWith("\\") || r.split(/[\\/]/).includes(".."))
    throw new Error(`Unsafe Workspace archive path: ${r}`);
}
function Ym(r) {
  let o = -1;
  for (let S = Math.max(0, r.length - 65557); S <= r.length - 22; S += 1)
    r[S] === 80 && r[S + 1] === 75 && r[S + 2] === 5 && r[S + 3] === 6 && (o = S);
  if (o < 0) throw new Error("Workspace archive has no valid ZIP directory");
  const i = new DataView(r.buffer, r.byteOffset, r.byteLength), c = i.getUint16(o + 10, !0), p = i.getUint32(o + 12, !0), h = i.getUint32(o + 16, !0);
  if (c > Pf) throw new Error("Workspace archive contains too many entries");
  if (h + p > r.length) throw new Error("Workspace archive directory is truncated");
  let v = h, y = 0;
  for (let S = 0; S < c; S += 1) {
    if (i.getUint32(v, !0) !== 33639248)
      throw new Error("Workspace archive contains an invalid directory entry");
    const _ = i.getUint32(v + 24, !0), A = i.getUint16(v + 28, !0), E = i.getUint16(v + 30, !0), T = i.getUint16(v + 32, !0);
    if (_ === 4294967295) throw new Error("ZIP64 Workspace archives are not supported");
    if (y += _, y > $f)
      throw new Error("Workspace archive exceeds the 512 MiB limit");
    const W = v + 46;
    if (hu(new TextDecoder().decode(r.subarray(W, W + A))), v = W + A + E + T, v > h + p)
      throw new Error("Workspace archive directory is malformed");
  }
}
function ey(r) {
  if (!r || typeof r != "object") throw new Error("Workspace manifest must be an object");
  const o = r;
  if (o.format !== Af || o.version !== If)
    throw new Error("Unsupported OMERO Analysis Workspace format");
  if (!o.workspace || !Array.isArray(o.chats) || !Array.isArray(o.files) || !Array.isArray(o.methods) || !Array.isArray(o.pipelines) || !Array.isArray(o.notebooks))
    throw new Error("Workspace manifest is missing required records");
  return {
    ...o,
    executions: Array.isArray(o.executions) ? o.executions : [],
    artifacts: Array.isArray(o.artifacts) ? o.artifacts : [],
    audits: Array.isArray(o.audits) ? o.audits : [],
    evidence: Array.isArray(o.evidence) ? o.evidence : [],
    omittedLocalInputs: Array.isArray(o.omittedLocalInputs) ? o.omittedLocalInputs : []
  };
}
function mu(r) {
  return !r || typeof r != "object" ? !1 : Array.isArray(r) ? r.some(mu) : Object.entries(r).some(([o, i]) => {
    const c = o.toLowerCase().replace(/[^a-z0-9]/g, "");
    return c === "apikey" || c === "azurekey" || c === "credential" || mu(i);
  });
}
async function Kp(r, o = null) {
  var ke;
  const i = new Uint8Array(r);
  Ym(i);
  const c = Om(i), p = Object.keys(c);
  if (p.length > Pf) throw new Error("Workspace archive contains too many entries");
  let h = 0;
  for (const D of p)
    if (hu(D), h += c[D].byteLength, h > $f) throw new Error("Workspace archive exceeds the 512 MiB limit");
  const v = c["workspace.json"];
  if (!v) throw new Error("Workspace archive does not contain workspace.json");
  const y = ey(JSON.parse(Ef(v)));
  if (mu(y)) throw new Error("Workspace archive contains a credential field");
  const S = crypto.randomUUID(), _ = (/* @__PURE__ */ new Date()).toISOString(), A = new Map(y.chats.map((D) => [D.id, crypto.randomUUID()])), E = new Map(y.executions.map((D) => [D.id, crypto.randomUUID()])), T = new Map(y.evidence.map((D) => [D.id, crypto.randomUUID()])), W = new Map(y.files.map((D) => [D.id, crypto.randomUUID()])), V = new Map(y.artifacts.map((D) => [D.id, crypto.randomUUID()])), z = new Map(y.methods.map((D) => [D.id, crypto.randomUUID()])), J = new Map(y.pipelines.map((D) => [D.id, crypto.randomUUID()])), Te = new Map(y.notebooks.map((D) => [D.id, crypto.randomUUID()])), de = y.chats.map((D) => ({
    ...D,
    id: A.get(D.id),
    workspaceId: S,
    title: `${D.title} (imported)`,
    messages: D.messages.map((Se) => {
      var De;
      return {
        ...Se,
        executionId: Se.executionId ? E.get(Se.executionId) : void 0,
        artifactId: Se.artifactId ? V.get(Se.artifactId) : void 0,
        citationIds: (De = Se.citationIds) == null ? void 0 : De.map((Pe) => E.get(Pe)).filter(Boolean)
      };
    }),
    updatedAt: _
  })), fe = [];
  for (const D of y.files) {
    let Se;
    if (D.archivePath) {
      hu(D.archivePath);
      const De = c[D.archivePath];
      if (!De) throw new Error(`Missing archived file: ${D.archivePath}`);
      if (Se = De.buffer.slice(De.byteOffset, De.byteOffset + De.byteLength), D.sha256 && await en(Se) !== D.sha256)
        throw new Error(`Hash mismatch for ${D.name}`);
    }
    fe.push({
      ...D,
      id: W.get(D.id),
      workspaceId: S,
      chatId: D.chatId ? A.get(D.chatId) : void 0,
      notebookId: D.notebookId ? Te.get(D.notebookId) : void 0,
      executionId: D.executionId ? E.get(D.executionId) : void 0,
      data: Se,
      viewer: D.viewer ? { ...D.viewer, viewerUrl: "" } : void 0,
      state: Se || D.source === "omero" ? D.state : "missing",
      logicalPath: D.logicalPath.replace(
        y.workspace.rootPath,
        `${y.workspace.rootPath}--imported`
      )
    });
  }
  const ae = y.executions.map((D) => ({
    ...D,
    id: E.get(D.id),
    workspaceId: S,
    chatId: A.get(D.chatId),
    outputFileIds: D.outputFileIds.map((Se) => W.get(Se)).filter(Boolean),
    reusedFrom: D.reusedFrom ? E.get(D.reusedFrom) : void 0,
    evidenceId: D.evidenceId ? T.get(D.evidenceId) : void 0
  })), Ne = y.methods.map((D) => ({
    ...D,
    id: z.get(D.id),
    workspaceId: S,
    versions: D.versions.map((Se) => ({
      ...Se,
      executionId: E.get(Se.executionId) || ""
    })),
    updatedAt: _
  })), ge = y.pipelines.map((D) => ({
    ...D,
    id: J.get(D.id),
    workspaceId: S,
    steps: D.steps.map((Se) => ({
      ...Se,
      id: crypto.randomUUID(),
      methodId: z.get(Se.methodId) || Se.methodId
    })),
    updatedAt: _
  })), Ce = y.notebooks.map((D) => ({
    ...D,
    id: Te.get(D.id),
    workspaceId: S,
    selectedDataFileIds: D.selectedDataFileIds.map((Se) => W.get(Se)).filter(Boolean),
    updatedAt: _
  })), ue = A.get(y.workspace.activeChatId) || ((ke = de[0]) == null ? void 0 : ke.id);
  if (!ue) throw new Error("Workspace archive contains no chats");
  const he = {
    ...y.workspace,
    id: S,
    contextKey: o ? `${o.user_id}:${o.group_id}:${o.object_type}:${o.object_id}:import:${S}` : `${y.workspace.contextKey}:import:${S}`,
    rootPath: `${y.workspace.rootPath}--imported`,
    name: `${y.workspace.name} (imported)`,
    objectType: (o == null ? void 0 : o.object_type) || y.workspace.objectType,
    objectId: (o == null ? void 0 : o.object_id) || y.workspace.objectId,
    userId: (o == null ? void 0 : o.user_id) ?? y.workspace.userId,
    groupId: (o == null ? void 0 : o.group_id) ?? y.workspace.groupId,
    activeChatId: ue,
    origin: {
      contextKey: y.workspace.contextKey,
      userId: y.workspace.userId,
      groupId: y.workspace.groupId,
      snapshotAnnotationId: y.workspace.sourceWorkspaceSnapshotAnnotationId
    },
    createdAt: _,
    updatedAt: _
  }, Re = y.artifacts.map((D) => ({
    ...D,
    id: V.get(D.id),
    workspaceId: S,
    chatId: A.get(D.chatId) || ue,
    executionId: D.executionId ? E.get(D.executionId) : void 0,
    fileId: D.fileId ? W.get(D.fileId) : void 0,
    viewer: D.viewer ? { ...D.viewer, viewerUrl: "" } : void 0
  })), Le = y.evidence.map((D) => ({
    ...D,
    id: T.get(D.id),
    workspaceId: S,
    chatId: A.get(D.chatId) || ue,
    executionId: D.executionId ? E.get(D.executionId) : void 0
  }));
  return {
    workspace: he,
    chats: de,
    files: fe,
    executions: ae,
    methods: Ne,
    pipelines: ge,
    notebooks: Ce,
    artifacts: Re,
    audits: [],
    evidence: Le
  };
}
const ty = [
  "micropip",
  "numpy",
  "pandas",
  "matplotlib",
  "duckdb"
], yu = "pyodide-314.0.3-oa-0.6";
function ny(r) {
  const o = JSON.stringify(r.replace(/\/$/, "")), i = JSON.stringify(ty);
  return `
const runtimeBase = ${o};
const send = (id, type, value, transfer = []) => postMessage({source:"oa-runtime", id, type, value}, transfer);
const runtimeFetch = globalThis.fetch.bind(globalThis);
const denyNetwork = () => Promise.reject(new Error("Network access is disabled in Analysis Python"));
const loadedPackages = new Set(${i});
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
  await pyodide.loadPackage(${i});
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
  pyodide.FS.mkdirTree("/selected_measurements");
  pyodide.FS.mkdirTree("/.omero");
  await pyodide.runPythonAsync(\`
import sys as _oa_sys, types as _oa_types
_oa_approved_packages = {
    "numpy", "pandas", "matplotlib", "seaborn", "scipy", "duckdb",
    "pyarrow", "python-calamine", "xlrd"
}
async def _oa_piplite_install(package, *args, **kwargs):
    packages = [package] if isinstance(package, str) else list(package)
    denied = [name for name in packages if name not in _oa_approved_packages]
    if denied:
        raise ValueError("Package download is disabled; not approved: " + ", ".join(denied))
    return None
_oa_piplite = _oa_types.ModuleType("piplite")
_oa_piplite.install = _oa_piplite_install
_oa_sys.modules["piplite"] = _oa_piplite
\`);
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
      removeTree("/selected_measurements");
      inputSecrets.clear();
      send(message.id, "clear_inputs", true);
    } else if (message.type === "file") {
      const safe = String(message.value.name).replace(/[^A-Za-z0-9._ -]/g, "_");
      const bytes = new Uint8Array(message.value.data);
      pyodide.FS.writeFile("/input/" + safe, bytes);
      pyodide.FS.mkdirTree("/input/selected_measurements");
      pyodide.FS.writeFile("/input/selected_measurements/" + safe, bytes);
      pyodide.FS.writeFile("/selected_measurements/" + safe, bytes);
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
    } else if (message.type === "context") {
      const encoded = new TextEncoder().encode(JSON.stringify(message.value || {}));
      pyodide.FS.mkdirTree("/input/.omero");
      pyodide.FS.writeFile("/.omero/context.json", encoded);
      pyodide.FS.writeFile("/input/.omero/context.json", encoded);
      send(message.id, "context", true);
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
function ry(r) {
  return new URL("../runtime-sandbox/", r).toString();
}
class oy {
  constructor(o, i = null) {
    nr(this, "frame", null);
    nr(this, "pending", /* @__PURE__ */ new Map());
    nr(this, "inputs", []);
    nr(this, "counter", 0);
    nr(this, "readyPromise", null);
    nr(this, "onProgress", null);
    nr(this, "receive", (o) => {
      var p;
      if (o.source !== ((p = this.frame) == null ? void 0 : p.contentWindow)) return;
      const i = o.data;
      if (!i || i.source !== "oa-runtime") return;
      if (i.type === "progress") {
        this.report(i.value);
        return;
      }
      const c = this.pending.get(i.id);
      c && (clearTimeout(c.timer), this.pending.delete(i.id), i.type === "error" ? c.reject(new Error(i.value)) : c.resolve(i.value));
    });
    this.runtimeBase = o, this.context = i, window.addEventListener("message", this.receive);
  }
  async start(o, i) {
    i && (this.onProgress = i), this.inputs = o.filter((v) => v.state === "ready" && v.data), this.destroyFrame(), this.report({ percent: 2, message: "Creating the secure Python sandbox…" });
    const c = document.createElement("iframe");
    c.hidden = !0, c.setAttribute("sandbox", "allow-scripts"), c.setAttribute("aria-hidden", "true");
    const p = new Promise(
      (v) => c.addEventListener("load", () => v(), { once: !0 })
    ), h = new URL(this.runtimeBase, window.location.href).toString();
    return c.src = ry(h), document.body.append(c), this.frame = c, this.readyPromise = (async () => {
      var v;
      await p, this.report({ percent: 8, message: "Connecting to the Python worker…" }), (v = c.contentWindow) == null || v.postMessage(
        { source: "oa-bootstrap", value: ny(h) },
        "*"
      ), await this.request("ping", !0, 12e4), await this.request("context", this.context ? {
        object_type: this.context.object_type,
        object_id: this.context.object_id,
        group_id: this.context.group_id
      } : {}, 3e4);
      for (let y = 0; y < this.inputs.length; y += 1) {
        const S = this.inputs[y];
        this.report({
          percent: 92 + Math.round(y / Math.max(1, this.inputs.length) * 7),
          message: `Loading ${y + 1} of ${this.inputs.length} data files into Python…`
        });
        const _ = S.data.slice(0);
        await this.request("file", { name: S.name, data: _ }, 3e4, [_]);
      }
      this.report({ percent: 100, message: "Browser Python is ready" });
    })(), this.readyPromise;
  }
  async run(o) {
    return this.readyPromise || await this.start(this.inputs), await this.readyPromise, this.request("run", { code: o }, 12e4);
  }
  async runNotebookCell(o) {
    if (/^\s*[!%]/m.test(o))
      throw new Error("Notebook magics and shell commands are disabled");
    const i = Array.from(
      o.matchAll(/piplite\.install\(\s*["']([^"']+)["']/g),
      (v) => v[1]
    ), c = /* @__PURE__ */ new Set([
      "numpy",
      "pandas",
      "matplotlib",
      "seaborn",
      "scipy",
      "duckdb",
      "pyarrow",
      "python-calamine",
      "xlrd"
    ]), p = i.find((v) => !c.has(v));
    if (p)
      throw new Error(`Package ${p} is not in the approved notebook package set`);
    const h = JSON.stringify(o);
    return this.run(`
import ast as _oa_ast
globals().pop("result", None)
_oa_source = ${h}
_oa_tree = _oa_ast.parse(_oa_source, filename="<notebook-cell>", mode="exec")
if _oa_tree.body and isinstance(_oa_tree.body[-1], _oa_ast.Expr):
    _oa_tree.body[-1] = _oa_ast.Assign(
        targets=[_oa_ast.Name(id="result", ctx=_oa_ast.Store())],
        value=_oa_tree.body[-1].value,
    )
    _oa_ast.fix_missing_locations(_oa_tree)
exec(compile(_oa_tree, "<notebook-cell>", "exec"), globals(), globals())
try:
    import matplotlib.pyplot as _oa_plt
    for _oa_figure_number in _oa_plt.get_fignums():
        _oa_plt.figure(_oa_figure_number).savefig(
            f"/output/notebook-figure-{_oa_figure_number}.png",
            format="png",
            bbox_inches="tight",
        )
except Exception:
    pass
`);
  }
  async syncInputs(o) {
    if (this.inputs = o.filter((i) => i.state === "ready" && i.data), !this.readyPromise) {
      await this.start(this.inputs, this.onProgress || void 0);
      return;
    }
    await this.readyPromise, await this.request("clear_inputs", !0, 3e4), await this.request("context", this.context ? {
      object_type: this.context.object_type,
      object_id: this.context.object_id,
      group_id: this.context.group_id
    } : {}, 3e4);
    for (let i = 0; i < this.inputs.length; i += 1) {
      const c = this.inputs[i];
      this.report({
        percent: 92 + Math.round(i / Math.max(1, this.inputs.length) * 7),
        message: `Synchronizing ${i + 1} of ${this.inputs.length} input files…`
      });
      const p = c.data.slice(0);
      await this.request("file", { name: c.name, data: p }, 3e4, [p]);
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
    for (const o of this.pending.values())
      clearTimeout(o.timer), o.reject(new Error("Python execution stopped"));
    this.pending.clear(), this.destroyFrame();
  }
  dispose() {
    this.stop(), this.destroyFrame(), window.removeEventListener("message", this.receive);
  }
  destroyFrame() {
    var o;
    (o = this.frame) == null || o.remove(), this.frame = null, this.readyPromise = null;
  }
  request(o, i, c, p = []) {
    const h = `runtime-${++this.counter}`;
    return new Promise((v, y) => {
      var _, A;
      const S = window.setTimeout(() => {
        this.pending.delete(h), y(new Error(`${o} exceeded ${c / 1e3} seconds`)), o === "run" && this.start(this.inputs);
      }, c);
      this.pending.set(h, { resolve: v, reject: y, timer: S }), (A = (_ = this.frame) == null ? void 0 : _.contentWindow) == null || A.postMessage(
        { source: "oa-parent", id: h, type: o, value: i },
        "*",
        p
      );
    });
  }
  report(o) {
    var i;
    (i = this.onProgress) == null || i.call(this, {
      percent: Math.max(0, Math.min(100, Number(o.percent) || 0)),
      message: String(o.message || "Preparing browser Python…")
    });
  }
}
function Rf(r) {
  if (r == null || !Number.isFinite(r) || r < 0) return "";
  const o = r / 1e3;
  if (o < 10) return `${Math.max(0.1, o).toFixed(1)} sec`;
  if (o < 60) return `${Math.round(o)} sec`;
  const i = Math.floor(o / 60), c = Math.round(o % 60);
  return c ? `${i} min ${c} sec` : `${i} min`;
}
function sy(r, o) {
  const i = Rf(o);
  return !r || !i ? "" : `${r === "worked" ? "Worked" : "Thought"} for ${i}`;
}
function iy(r, o) {
  const i = Rf(o);
  return i ? r === "inspection" ? `Worked for ${i} · for AI data inspection` : `Worked for ${i}` : "";
}
function ay(r, o, i) {
  return [
    "browser-row",
    "workspace-row",
    r === (i || o) ? "selected" : "",
    r === o ? "open" : ""
  ].filter(Boolean).join(" ");
}
function ly({
  execution: r,
  files: o,
  onSave: i,
  onRerun: c,
  viewerPreparation: p = !1
}) {
  var V;
  const [h, v] = te.useState(!1), y = r.outputFileIds.map((z) => o.find((J) => J.id === z && !J.deletedAt)).filter(Boolean), S = r.status === "reused" ? [] : y.filter((z) => z.type === "image/png" || z.type === "image/svg+xml"), _ = r.purpose || "analysis", A = _ === "inspection", E = !A && !p && ["success", "reused"].includes(r.status), T = iy(_, r.durationMs), W = (z) => /* @__PURE__ */ d.jsxs("div", { className: `execution-actions ${z}`, children: [
    /* @__PURE__ */ d.jsx(
      "button",
      {
        className: "detail-toggle",
        "aria-expanded": h,
        onClick: () => v((J) => !J),
        children: h ? "Collapse" : "Show details"
      }
    ),
    E && /* @__PURE__ */ d.jsx("button", { onClick: i, children: "Save as method" }),
    E && /* @__PURE__ */ d.jsx("button", { onClick: c, children: "Rerun" }),
    /* @__PURE__ */ d.jsxs("small", { children: [
      r.codeHash.slice(0, 12),
      " · ",
      r.runtimeVersion
    ] })
  ] });
  return /* @__PURE__ */ d.jsxs(
    "article",
    {
      className: `message execution ${r.status} ${A ? "inspection" : ""}`,
      "data-purpose": _,
      children: [
        /* @__PURE__ */ d.jsxs("section", { className: "execution-details", "data-expanded": h ? "true" : "false", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "execution-heading", children: [
            /* @__PURE__ */ d.jsx("span", { children: r.status === "reused" ? "Reused Python run" : A ? "AI data inspection (local)" : p ? "Zarr render preparation (local)" : "Python code (local)" }),
            W("top")
          ] }),
          T && /* @__PURE__ */ d.jsx("p", { className: "activity-timing", children: T }),
          A && /* @__PURE__ */ d.jsx("p", { className: "inspection-note", children: "This code was generated only to inspect bounded data for the assistant. It is not a reusable analysis method." }),
          p && /* @__PURE__ */ d.jsx("p", { className: "inspection-note", children: "This intermediate code prepared and validated the ZarrViewer render. Save the complete analysis and render from the image card below." }),
          /* @__PURE__ */ d.jsxs("div", { className: "execution-content", hidden: !h, children: [
            /* @__PURE__ */ d.jsx("pre", { children: /* @__PURE__ */ d.jsx("code", { children: r.code }) }),
            r.stdout && /* @__PURE__ */ d.jsx("pre", { children: r.stdout }),
            r.stderr && /* @__PURE__ */ d.jsx("pre", { className: "execution-error", children: r.stderr }),
            r.modelPayload && /* @__PURE__ */ d.jsxs("details", { className: "model-payload", children: [
              /* @__PURE__ */ d.jsx("summary", { children: "Data sent to AI" }),
              /* @__PURE__ */ d.jsx("p", { children: "Only this bounded envelope was returned to the configured AI provider." }),
              /* @__PURE__ */ d.jsx("pre", { children: JSON.stringify(r.modelPayload, null, 2) })
            ] }),
            r.preview != null && /* @__PURE__ */ d.jsx(cy, { value: r.preview }),
            W("bottom")
          ] })
        ] }),
        r.status === "reused" && /* @__PURE__ */ d.jsxs("p", { className: "reuse-note", children: [
          "Reused prior execution ",
          (V = r.reusedFrom) == null ? void 0 : V.slice(0, 8),
          " because code and inputs are unchanged."
        ] }),
        r.missingPlotCsv.length > 0 && /* @__PURE__ */ d.jsxs("p", { className: "plot-warning", children: [
          "Source CSV missing: ",
          r.missingPlotCsv.join(", ")
        ] }),
        S.map((z) => /* @__PURE__ */ d.jsx(_u, { file: z }, z.id))
      ]
    }
  );
}
function cy({ value: r }) {
  const [o, i] = te.useState(""), c = r;
  if ((c == null ? void 0 : c.kind) === "table" && c.data) {
    const p = c.data.columns || [], h = (c.data.data || []).filter(
      (v) => !o || v.some((y) => String(y ?? "").toLowerCase().includes(o.toLowerCase()))
    );
    return /* @__PURE__ */ d.jsxs("div", { className: "table-wrap", children: [
      /* @__PURE__ */ d.jsxs("label", { className: "table-filter", children: [
        /* @__PURE__ */ d.jsx("span", { children: "Filter preview" }),
        /* @__PURE__ */ d.jsx("input", { value: o, onChange: (v) => i(v.target.value) })
      ] }),
      /* @__PURE__ */ d.jsxs("table", { children: [
        /* @__PURE__ */ d.jsx("thead", { children: /* @__PURE__ */ d.jsx("tr", { children: p.map((v) => /* @__PURE__ */ d.jsx("th", { children: v }, v)) }) }),
        /* @__PURE__ */ d.jsx("tbody", { children: h.map((v, y) => /* @__PURE__ */ d.jsx("tr", { children: v.map((S, _) => /* @__PURE__ */ d.jsx("td", { children: String(S ?? "") }, _)) }, y)) })
      ] })
    ] });
  }
  return /* @__PURE__ */ d.jsx("pre", { className: "preview", children: JSON.stringify(r, null, 2) });
}
function _u({ file: r }) {
  const [o, i] = te.useState(!1), c = te.useMemo(
    () => r.data ? URL.createObjectURL(new Blob([r.data], { type: r.type })) : "",
    [r.data, r.type]
  );
  return te.useEffect(() => () => {
    c && URL.revokeObjectURL(c);
  }, [c]), c ? /* @__PURE__ */ d.jsxs("figure", { className: o ? "artifact-zoomed" : "", children: [
    /* @__PURE__ */ d.jsx("button", { className: "plot-zoom", onClick: () => i((p) => !p), children: o ? "Close full view" : "Open full view" }),
    /* @__PURE__ */ d.jsx("img", { src: c, alt: r.name, onDoubleClick: () => i(!0) }),
    /* @__PURE__ */ d.jsx("figcaption", { children: r.name })
  ] }) : null;
}
function uy(r) {
  return r < 1024 ? `${r} B` : r < 1024 ** 2 ? `${(r / 1024).toFixed(1)} KiB` : `${(r / 1024 ** 2).toFixed(1)} MiB`;
}
function dy(r, o) {
  if (!r) return "Context usage appears after the first AI response.";
  const i = r.promptTokens + r.completionTokens, c = r.estimated ? "estimated" : "API reported", p = o > 0 ? ` · ${Math.min(100, Math.round(i / o * 100))}% of ${o.toLocaleString()}` : " · model limit not configured";
  return `Latest request: ${r.promptTokens.toLocaleString()} input + ${r.completionTokens.toLocaleString()} output tokens (${c})${p} · session: ${r.sessionTokens.toLocaleString()}`;
}
function py(r, o) {
  const i = [];
  let c = [], p = "", h = !1;
  for (let v = 0; v < r.length; v += 1) {
    const y = r[v];
    if (y === '"')
      h && r[v + 1] === '"' ? (p += '"', v += 1) : h = !h;
    else if (y === o && !h)
      c.push(p), p = "";
    else if ((y === `
` || y === "\r") && !h) {
      if (y === "\r" && r[v + 1] === `
` && (v += 1), c.push(p), c.some((S) => S.length) && i.push(c), c = [], p = "", i.length >= 101) break;
    } else
      p += y;
  }
  return (c.length || p) && (c.push(p), c.some((v) => v.length) && i.push(c)), i.map((v) => v.slice(0, 50));
}
function fy(r, o) {
  let i = !1, c = 1, p = 0, h = 0, v = !1;
  for (let y = 0; y < r.length; y += 1) {
    const S = r[y];
    S === '"' ? (i && r[y + 1] === '"' ? y += 1 : i = !i, v = !0) : S === o && !i ? c += 1 : (S === `
` || S === "\r") && !i ? (S === "\r" && r[y + 1] === `
` && (y += 1), (v || c > 1) && (p ? h += 1 : p = c), c = 1, v = !1) : /\s/.test(S) || (v = !0);
  }
  return (v || c > 1) && (p ? h += 1 : p = c), { rows: h, columns: p };
}
function hy({ file: r }) {
  if (r.type === "image/png" || r.type === "image/svg+xml")
    return /* @__PURE__ */ d.jsx(_u, { file: r });
  if (!r.data) return /* @__PURE__ */ d.jsx("p", { className: "artifact-help", children: "This file is not available locally." });
  if (r.type.startsWith("text/") || /\.(csv|tsv|json|md|txt)$/i.test(r.name)) {
    const o = new TextDecoder().decode(r.data);
    if (/\.(csv|tsv)$/i.test(r.name)) {
      const i = py(o, /\.tsv$/i.test(r.name) ? "	" : ","), [c = [], ...p] = i;
      return /* @__PURE__ */ d.jsxs("div", { className: "table-wrap artifact-table", children: [
        /* @__PURE__ */ d.jsxs("table", { children: [
          /* @__PURE__ */ d.jsx("thead", { children: /* @__PURE__ */ d.jsx("tr", { children: c.map((h, v) => /* @__PURE__ */ d.jsx("th", { children: h }, v)) }) }),
          /* @__PURE__ */ d.jsx("tbody", { children: p.map((h, v) => /* @__PURE__ */ d.jsx("tr", { children: c.map((y, S) => /* @__PURE__ */ d.jsx("td", { children: h[S] || "" }, S)) }, v)) })
        ] }),
        i.length >= 101 && /* @__PURE__ */ d.jsx("p", { className: "artifact-help", children: "Preview limited to 100 rows." })
      ] });
    }
    return /* @__PURE__ */ d.jsx("pre", { className: "artifact-text-preview", children: o.slice(0, 64 * 1024) });
  }
  return /* @__PURE__ */ d.jsx("p", { className: "artifact-help", children: "Preview is not available for this file type. Use Download to open the file." });
}
function Su({ code: r }) {
  const o = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield)\b|\b\d+(?:\.\d+)?\b)/g, i = [];
  let c = 0;
  for (const p of r.matchAll(o)) {
    p.index > c && i.push({ value: r.slice(c, p.index) });
    const h = p[0], v = h.startsWith("#") ? "comment" : /^["']/.test(h) ? "string" : /^\d/.test(h) ? "number" : "keyword";
    i.push({ value: h, kind: v }), c = p.index + h.length;
  }
  return c < r.length && i.push({ value: r.slice(c) }), /* @__PURE__ */ d.jsx("pre", { className: "artifact-text-preview artifact-code-preview", children: /* @__PURE__ */ d.jsx("code", { children: i.map(
    (p, h) => p.kind ? /* @__PURE__ */ d.jsx("span", { className: `syntax-${p.kind}`, children: p.value }, h) : p.value
  ) }) });
}
function qa(r) {
  const o = /(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|\[[^\]\n]+\]\([^) \n]+\))/g, i = [];
  let c = 0;
  for (const p of r.matchAll(o)) {
    p.index > c && i.push(r.slice(c, p.index));
    const h = p[0];
    if (h.startsWith("`"))
      i.push(/* @__PURE__ */ d.jsx("code", { children: h.slice(1, -1) }, p.index));
    else if (h.startsWith("**") || h.startsWith("__"))
      i.push(/* @__PURE__ */ d.jsx("strong", { children: h.slice(2, -2) }, p.index));
    else {
      const v = h.match(/^\[([^\]]+)\]\(([^)]+)\)$/), y = (v == null ? void 0 : v[2]) || "";
      i.push(
        /^https?:\/\//i.test(y) ? /* @__PURE__ */ d.jsx("a", { href: y, target: "_blank", rel: "noopener noreferrer", children: v == null ? void 0 : v[1] }, p.index) : h
      );
    }
    c = p.index + h.length;
  }
  return c < r.length && i.push(r.slice(c)), i;
}
function bu({ markdown: r }) {
  const o = r.slice(0, 131072).replace(/\r\n?/g, `
`).split(`
`), i = [];
  for (let c = 0; c < o.length; ) {
    const p = o[c];
    if (!p.trim()) {
      c += 1;
      continue;
    }
    const h = p.match(/^\s*```([\w+-]*)\s*$/);
    if (h) {
      const A = [];
      for (c += 1; c < o.length && !/^\s*```\s*$/.test(o[c]); )
        A.push(o[c]), c += 1;
      c < o.length && (c += 1), i.push(
        /* @__PURE__ */ d.jsx("pre", { className: "markdown-code", children: /* @__PURE__ */ d.jsx("code", { "data-language": h[1] || void 0, children: A.join(`
`) }) }, i.length)
      );
      continue;
    }
    const v = p.match(/^(#{1,6})\s+(.+)$/);
    if (v) {
      const A = `h${v[1].length}`;
      i.push(/* @__PURE__ */ d.jsx(A, { children: qa(v[2]) }, i.length)), c += 1;
      continue;
    }
    const y = p.match(/^>\s?(.*)$/);
    if (y) {
      i.push(/* @__PURE__ */ d.jsx("blockquote", { children: qa(y[1]) }, i.length)), c += 1;
      continue;
    }
    if (p.match(/^\s*(?:[-*+]|\d+\.)\s+(.+)$/)) {
      const A = /^\s*\d+\./.test(p), E = [];
      for (; c < o.length; ) {
        const T = o[c].match(
          A ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/
        );
        if (!T) break;
        E.push(/* @__PURE__ */ d.jsx("li", { children: qa(T[1]) }, E.length)), c += 1;
      }
      i.push(
        A ? /* @__PURE__ */ d.jsx("ol", { children: E }, i.length) : /* @__PURE__ */ d.jsx("ul", { children: E }, i.length)
      );
      continue;
    }
    const _ = [p];
    for (c += 1; c < o.length && o[c].trim() && !/^(?:#{1,6}\s|>\s?|```|\s*(?:[-*+]|\d+\.)\s+)/.test(o[c]); )
      _.push(o[c]), c += 1;
    i.push(
      /* @__PURE__ */ d.jsx("p", { children: _.map((A, E) => /* @__PURE__ */ d.jsxs(te.Fragment, { children: [
        E > 0 && /* @__PURE__ */ d.jsx("br", {}),
        qa(A)
      ] }, E)) }, i.length)
    );
  }
  return /* @__PURE__ */ d.jsx("div", { className: "artifact-markdown-preview", children: i });
}
function my({ profile: r }) {
  const o = Array.isArray(r.summary.tables) ? r.summary.tables : [];
  return o.length ? /* @__PURE__ */ d.jsxs("section", { className: "database-schema-preview", children: [
    /* @__PURE__ */ d.jsx("h3", { children: "Database schema" }),
    o.map((i, c) => {
      const p = Array.isArray(i.columns) ? i.columns : [];
      return /* @__PURE__ */ d.jsxs("details", { children: [
        /* @__PURE__ */ d.jsxs("summary", { children: [
          String(i.name || `Table ${c + 1}`),
          " ",
          /* @__PURE__ */ d.jsxs("small", { children: [
            p.length,
            " columns"
          ] })
        ] }),
        /* @__PURE__ */ d.jsx("div", { className: "table-wrap", children: /* @__PURE__ */ d.jsxs("table", { children: [
          /* @__PURE__ */ d.jsx("thead", { children: /* @__PURE__ */ d.jsxs("tr", { children: [
            /* @__PURE__ */ d.jsx("th", { children: "Column" }),
            /* @__PURE__ */ d.jsx("th", { children: "Type" })
          ] }) }),
          /* @__PURE__ */ d.jsx("tbody", { children: p.map((h, v) => /* @__PURE__ */ d.jsxs("tr", { children: [
            /* @__PURE__ */ d.jsx("td", { children: String(h.name || "") }),
            /* @__PURE__ */ d.jsx("td", { children: String(h.type || "") })
          ] }, v)) })
        ] }) })
      ] }, `${String(i.name)}-${c}`);
    })
  ] }) : null;
}
function yy(r, o) {
  if (r.output_type === "stream") {
    const p = Array.isArray(r.text) ? r.text.join("") : String(r.text || "");
    return /* @__PURE__ */ d.jsx("pre", { className: "notebook-inspector-output", children: p.slice(0, 16 * 1024) }, o);
  }
  if (r.output_type === "error")
    return /* @__PURE__ */ d.jsx("pre", { className: "notebook-inspector-output error", children: `${r.ename || "Error"}: ${r.evalue || ""}` }, o);
  const i = r.data && typeof r.data == "object" ? r.data : {}, c = i["image/png"];
  if (typeof c == "string" || Array.isArray(c))
    return /* @__PURE__ */ d.jsx(
      "img",
      {
        className: "notebook-inspector-image",
        alt: "Notebook PNG output",
        src: `data:image/png;base64,${(Array.isArray(c) ? c.join("") : c).replace(/\s/g, "")}`
      },
      o
    );
  if ("application/json" in i)
    return /* @__PURE__ */ d.jsx("pre", { className: "notebook-inspector-output", children: JSON.stringify(i["application/json"], null, 2).slice(0, 16 * 1024) }, o);
  if ("text/plain" in i) {
    const p = Array.isArray(i["text/plain"]) ? i["text/plain"].join("") : String(i["text/plain"]);
    return /* @__PURE__ */ d.jsx("pre", { className: "notebook-inspector-output", children: p.slice(0, 16 * 1024) }, o);
  }
  return /* @__PURE__ */ d.jsx("p", { className: "artifact-help", children: "Unsupported rich output hidden for safety." }, o);
}
function vy({ notebook: r }) {
  return /* @__PURE__ */ d.jsx("div", { className: "notebook-inspector-preview", children: r.document.cells.map((o, i) => {
    var p;
    const c = Array.isArray(o.source) ? o.source.join("") : o.source;
    return /* @__PURE__ */ d.jsxs("article", { children: [
      /* @__PURE__ */ d.jsxs("div", { className: "notebook-inspector-cell-heading", children: [
        /* @__PURE__ */ d.jsx("strong", { children: o.cell_type === "code" ? `Code [${o.execution_count ?? " "}]` : "Markdown" }),
        /* @__PURE__ */ d.jsxs("span", { children: [
          "Cell ",
          i + 1
        ] })
      ] }),
      o.cell_type === "code" ? /* @__PURE__ */ d.jsx(Su, { code: c }) : o.cell_type === "markdown" ? /* @__PURE__ */ d.jsx(bu, { markdown: c }) : /* @__PURE__ */ d.jsx("pre", { className: "artifact-text-preview", children: c }),
      o.cell_type === "code" && !!((p = o.outputs) != null && p.length) && /* @__PURE__ */ d.jsx("div", { className: "notebook-inspector-outputs", children: (o.outputs || []).map((h, v) => yy(h, v)) })
    ] }, o.id || i);
  }) });
}
function gy({
  artifact: r,
  file: o,
  onInspect: i,
  onSaveBundle: c
}) {
  const p = r.viewer || (o == null ? void 0 : o.viewer);
  return p ? /* @__PURE__ */ d.jsxs("article", { className: "viewer-preview-card", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "viewer-preview-heading", children: [
      /* @__PURE__ */ d.jsxs("div", { children: [
        /* @__PURE__ */ d.jsx("span", { children: "OME-Zarr view" }),
        /* @__PURE__ */ d.jsx("strong", { children: r.title })
      ] }),
      p.viewerUrl ? /* @__PURE__ */ d.jsx(
        "a",
        {
          className: "button-link",
          href: p.viewerUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          children: "Open in ZarrViewer"
        }
      ) : /* @__PURE__ */ d.jsx("span", { className: "viewer-link-pending", children: "Revalidate this preview in the current OMERO object to reopen it" })
    ] }),
    o && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("button", { className: "viewer-preview-image", onClick: () => i(o), children: /* @__PURE__ */ d.jsx(_u, { file: o }) }),
      p.renderRecipe && /* @__PURE__ */ d.jsx(
        "button",
        {
          className: "button-link",
          onClick: () => c(r, o),
          children: "Save analysis + render"
        }
      )
    ] }),
    /* @__PURE__ */ d.jsxs("small", { children: [
      "Field ",
      p.field,
      " · ROI ",
      p.roi.join(", "),
      p.croppedField ? " · centered preview; full field opens in ZarrViewer" : ""
    ] })
  ] }) : null;
}
function wy({
  runtimeReady: r,
  runtimeProgress: o,
  status: i,
  usage: c,
  settings: p,
  blocked: h,
  canChat: v,
  composerPlaceholder: y,
  prompt: S,
  busy: _,
  onPromptChange: A,
  onSend: E,
  onStop: T,
  onReset: W
}) {
  return /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    !r && /* @__PURE__ */ d.jsxs("div", { className: "runtime-progress", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ d.jsxs("div", { children: [
        /* @__PURE__ */ d.jsx("strong", { children: o.message }),
        /* @__PURE__ */ d.jsxs("span", { children: [
          Math.round(o.percent),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d.jsx("progress", { max: "100", value: o.percent }),
      /* @__PURE__ */ d.jsx("small", { children: "Please wait. The question box unlocks automatically when browser Python is ready." })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "status", role: "status", children: i }),
    /* @__PURE__ */ d.jsxs("div", { className: "usage-status", children: [
      /* @__PURE__ */ d.jsx("span", { children: "The configured AI provider receives prompts, generated code, bounded schemas/previews/statistics, summaries, and errors — never source files." }),
      /* @__PURE__ */ d.jsx("span", { children: dy(c, p.contextWindow || 0) })
    ] }),
    h && /* @__PURE__ */ d.jsx("div", { className: "blocker", children: "Analysis is blocked until every input is available. Retry, reselect, or remove missing files." }),
    !p.endpoint || !p.apiKey || !p.model ? /* @__PURE__ */ d.jsx("div", { className: "blocker", children: "Enter an AI endpoint, model, and API key in Settings." }) : null,
    /* @__PURE__ */ d.jsxs("div", { className: "composer", children: [
      /* @__PURE__ */ d.jsxs("div", { className: `composer-state ${v ? "ready" : "waiting"}`, children: [
        /* @__PURE__ */ d.jsx("span", { "aria-hidden": "true", children: v ? "●" : "◷" }),
        v ? "Ready — you can ask a question" : y
      ] }),
      /* @__PURE__ */ d.jsx(
        "textarea",
        {
          value: S,
          onChange: (V) => A(V.target.value),
          onKeyDown: (V) => {
            V.key === "Enter" && !V.shiftKey && (V.preventDefault(), E());
          },
          disabled: !v,
          placeholder: y
        }
      ),
      _ ? /* @__PURE__ */ d.jsx("button", { className: "stop", onClick: T, children: "Stop" }) : /* @__PURE__ */ d.jsx("button", { disabled: !v || !S.trim(), onClick: E, children: "Send" }),
      /* @__PURE__ */ d.jsx("button", { disabled: _ || !r, onClick: W, children: "Reset Python" })
    ] })
  ] });
}
function ky({
  item: r,
  profiles: o,
  canUpload: i,
  onDownload: c,
  onAttach: p
}) {
  var W;
  const h = r == null ? void 0 : r.file, v = h ? o.find((V) => V.path.replace(/\\/g, "/").endsWith(`/${h.name}`)) : void 0, y = te.useMemo(() => {
    if (!(h != null && h.data) || h.data.byteLength > 32 * 1024 * 1024 || !/\.(csv|tsv)$/i.test(h.name)) return;
    const V = new TextDecoder().decode(h.data);
    return fy(V, /\.tsv$/i.test(h.name) ? "	" : ",");
  }, [h == null ? void 0 : h.id, h == null ? void 0 : h.data, h == null ? void 0 : h.name]), S = v && Array.isArray(v.summary.columns) ? v.summary.columns : [], _ = v && typeof v.summary.rows == "number" ? v.summary.rows : y == null ? void 0 : y.rows, A = S.length || (y == null ? void 0 : y.columns) || 0, [E, T] = te.useState(null);
  return te.useEffect(() => {
    if (T(null), !(h != null && h.data) || h.type !== "image/png") return;
    const V = URL.createObjectURL(new Blob([h.data], { type: h.type })), z = new Image();
    return z.onload = () => {
      T({ width: z.naturalWidth, height: z.naturalHeight }), URL.revokeObjectURL(V);
    }, z.onerror = () => URL.revokeObjectURL(V), z.src = V, () => URL.revokeObjectURL(V);
  }, [h == null ? void 0 : h.id, h == null ? void 0 : h.data, h == null ? void 0 : h.type]), /* @__PURE__ */ d.jsxs("aside", { className: "artifact-inspector open", children: [
    /* @__PURE__ */ d.jsx("div", { className: "artifact-header", children: /* @__PURE__ */ d.jsxs("div", { children: [
      /* @__PURE__ */ d.jsx("span", { children: "Artifact inspector" }),
      /* @__PURE__ */ d.jsx("strong", { children: (r == null ? void 0 : r.title) || "Workspace overview" })
    ] }) }),
    /* @__PURE__ */ d.jsx("div", { className: "artifact-body", children: r && !h ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      r.description && /* @__PURE__ */ d.jsx("p", { className: "artifact-help", children: r.description }),
      r.metadata && /* @__PURE__ */ d.jsx("dl", { className: "artifact-metadata", children: Object.entries(r.metadata).flatMap(([V, z]) => [
        /* @__PURE__ */ d.jsx("dt", { children: V }, `${V}-term`),
        /* @__PURE__ */ d.jsx("dd", { children: String(z) }, `${V}-value`)
      ]) }),
      r.content && (r.language === "python" ? /* @__PURE__ */ d.jsx(Su, { code: r.content }) : r.language === "markdown" ? /* @__PURE__ */ d.jsx(bu, { markdown: r.content }) : /* @__PURE__ */ d.jsx("pre", { className: "artifact-text-preview", children: r.content })),
      r.notebook && /* @__PURE__ */ d.jsx(vy, { notebook: r.notebook })
    ] }) : h ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx(hy, { file: h }),
      v && ["duckdb", "sqlite", "sqlite3"].includes(v.format) && /* @__PURE__ */ d.jsx(my, { profile: v }),
      /* @__PURE__ */ d.jsxs("dl", { className: "artifact-metadata", children: [
        /* @__PURE__ */ d.jsx("dt", { children: "Size" }),
        /* @__PURE__ */ d.jsx("dd", { children: uy(h.size) }),
        _ != null && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
          /* @__PURE__ */ d.jsx("dt", { children: "Rows" }),
          /* @__PURE__ */ d.jsx("dd", { children: _.toLocaleString() })
        ] }),
        A > 0 && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
          /* @__PURE__ */ d.jsx("dt", { children: "Columns" }),
          /* @__PURE__ */ d.jsx("dd", { children: A })
        ] }),
        E && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
          /* @__PURE__ */ d.jsx("dt", { children: "Pixels" }),
          /* @__PURE__ */ d.jsxs("dd", { children: [
            E.width,
            " × ",
            E.height
          ] })
        ] }),
        /* @__PURE__ */ d.jsx("dt", { children: "Created" }),
        /* @__PURE__ */ d.jsx("dd", { children: new Date(h.createdAt).toLocaleString() })
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "artifact-buttons", children: [
        ((W = h.viewer) == null ? void 0 : W.viewerUrl) && /* @__PURE__ */ d.jsx(
          "a",
          {
            className: "button-link",
            href: h.viewer.viewerUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            children: "Open in ZarrViewer"
          }
        ),
        /* @__PURE__ */ d.jsx("button", { onClick: () => c(h), children: "Download" }),
        i && /* @__PURE__ */ d.jsx("button", { onClick: () => p(h), children: "Attach to OMERO" })
      ] })
    ] }) : /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("p", { className: "artifact-help", children: "Local schema profiles are generated without sending source files to the AI provider." }),
      o.map((V) => /* @__PURE__ */ d.jsxs("details", { open: !0, children: [
        /* @__PURE__ */ d.jsxs("summary", { children: [
          V.format.toUpperCase(),
          " input profile"
        ] }),
        /* @__PURE__ */ d.jsx("pre", { children: JSON.stringify(V.summary, null, 2) }),
        V.error && /* @__PURE__ */ d.jsx("p", { className: "execution-error", children: V.error })
      ] }, V.path)),
      !o.length && /* @__PURE__ */ d.jsx("p", { className: "artifact-help", children: "Add a supported input to inspect it." })
    ] }) })
  ] });
}
const Qp = 1e4;
function Za(r) {
  return Array.isArray(r.source) ? r.source.join("") : r.source;
}
function nu(r) {
  var y, S;
  let o;
  try {
    o = JSON.parse(new TextDecoder("utf-8", { fatal: !0 }).decode(r));
  } catch {
    throw new Error("Notebook must contain valid UTF-8 JSON");
  }
  if (!o || typeof o != "object" || Array.isArray(o))
    throw new Error("Notebook root must be an object");
  const i = o;
  if (i.nbformat !== 4 || !Array.isArray(i.cells))
    throw new Error("Only nbformat 4 notebooks are supported");
  if (i.cells.length > Qp)
    throw new Error(`Notebook contains more than ${Qp} cells`);
  const c = i.metadata && typeof i.metadata == "object" ? i.metadata : {}, p = String(((y = c.language_info) == null ? void 0 : y.name) || "python").toLowerCase(), h = String(((S = c.kernelspec) == null ? void 0 : S.language) || "python").toLowerCase();
  if (!["python", "python3"].includes(p) || !["python", "python3"].includes(h))
    throw new Error("Only Python notebooks are supported");
  const v = i.cells.map((_, A) => {
    if (!_ || typeof _ != "object" || Array.isArray(_))
      throw new Error(`Cell ${A + 1} is invalid`);
    const E = _;
    if (!["markdown", "code", "raw"].includes(E.cell_type))
      throw new Error(`Cell ${A + 1} has an unsupported type`);
    if (!(typeof E.source == "string" || Array.isArray(E.source) && E.source.every((T) => typeof T == "string")))
      throw new Error(`Cell ${A + 1} source must be text`);
    return {
      ...E,
      metadata: E.metadata && typeof E.metadata == "object" ? E.metadata : {},
      outputs: E.cell_type === "code" && Array.isArray(E.outputs) ? E.outputs : [],
      execution_count: E.cell_type === "code" && (E.execution_count == null || Number.isInteger(E.execution_count)) ? E.execution_count : null
    };
  });
  return {
    nbformat: 4,
    nbformat_minor: Number.isInteger(i.nbformat_minor) ? i.nbformat_minor : 0,
    metadata: c,
    cells: v
  };
}
function xy(r) {
  const o = new Uint8Array(r);
  let i = "";
  for (let c = 0; c < o.length; c += 32768)
    i += String.fromCharCode(...o.subarray(c, c + 32768));
  return btoa(i);
}
function _y(r, o) {
  const i = [];
  r.stdout && i.push({ output_type: "stream", name: "stdout", text: r.stdout }), r.stderr && i.push({ output_type: "stream", name: "stderr", text: r.stderr }), r.preview != null && i.push({
    output_type: "execute_result",
    execution_count: o,
    metadata: {},
    data: { "application/json": r.preview }
  });
  for (const c of r.files)
    c.type === "image/png" && i.push({
      output_type: "display_data",
      metadata: {},
      data: { "image/png": xy(c.data) }
    });
  return i;
}
function Sy(r) {
  const o = String(r instanceof Error ? r.message : r);
  return {
    output_type: "error",
    ename: r instanceof Error ? r.name : "Error",
    evalue: o,
    traceback: o.split(/\r?\n/)
  };
}
function Jp(r) {
  return Array.isArray(r) ? r.join("") : String(r ?? "");
}
function by({ output: r }) {
  if (r.output_type === "stream")
    return /* @__PURE__ */ d.jsx("pre", { className: `notebook-stream ${r.name || ""}`, children: Jp(r.text) });
  if (r.output_type === "error")
    return /* @__PURE__ */ d.jsx("pre", { className: "notebook-error", children: (r.traceback || [r.evalue || "Error"]).join(`
`) });
  const o = r.data || {}, i = o["image/png"];
  return typeof i == "string" && /^[A-Za-z0-9+/=\s]+$/.test(i) ? /* @__PURE__ */ d.jsx(
    "img",
    {
      className: "notebook-image",
      alt: "Notebook PNG output",
      src: `data:image/png;base64,${i.replace(/\s/g, "")}`
    }
  ) : "application/json" in o ? /* @__PURE__ */ d.jsx("pre", { className: "notebook-json", children: JSON.stringify(o["application/json"], null, 2) }) : "text/plain" in o ? /* @__PURE__ */ d.jsx("pre", { children: Jp(o["text/plain"]) }) : /* @__PURE__ */ d.jsx("p", { className: "notebook-unsupported-output", children: "Unsupported output hidden for safety." });
}
function jy(r) {
  const {
    notebook: o,
    inputs: i,
    runtime: c,
    runRequest: p,
    workspaceActions: h,
    onChange: v,
    onFiles: y
  } = r, [S, _] = te.useState(!1), [A, E] = te.useState("Notebook code never runs automatically."), T = te.useRef(0);
  async function W(de, fe, ae = o) {
    if (!ae) return null;
    const Ne = ae.document.cells[de];
    if (Ne.cell_type !== "code") return ae;
    try {
      const ge = await c.runNotebookCell(Za(Ne)), Ce = {
        ...ae,
        document: {
          ...ae.document,
          cells: ae.document.cells.map(
            (ue, he) => he === de ? {
              ...ue,
              execution_count: fe,
              outputs: _y(ge, fe)
            } : ue
          )
        },
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      return await y(Ce, ge.files), await v(Ce), Ce;
    } catch (ge) {
      const Ce = {
        ...ae,
        document: {
          ...ae.document,
          cells: ae.document.cells.map(
            (ue, he) => he === de ? { ...ue, execution_count: fe, outputs: [Sy(ge)] } : ue
          )
        },
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      return await v(Ce), E(`Stopped at cell ${de + 1}: ${String(ge)}`), null;
    }
  }
  async function V(de) {
    E("Attaching current Workspace input data…"), await c.syncInputs(i);
    const fe = {
      ...de,
      selectedDataFileIds: i.filter((ae) => ae.state === "ready" && !ae.deletedAt).map((ae) => ae.id),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return await v(fe), E(`Attached ${fe.selectedDataFileIds.length} input file(s).`), fe;
  }
  async function z() {
    if (!o || S) return;
    _(!0), E("Preparing the notebook and current input data…"), await c.reset();
    let de = await V(o), fe = 1;
    for (let ae = 0; ae < o.document.cells.length && !(o.document.cells[ae].cell_type === "code" && (E(`Running cell ${ae + 1}…`), de = await W(ae, fe++, de), !de)); ae += 1)
      ;
    _(!1), E((ae) => ae.startsWith("Stopped") ? ae : "Notebook run completed.");
  }
  async function J() {
    c.stop(), _(!1), E("Execution stopped; restoring the isolated Python kernel…"), await c.start(i), E("Execution stopped. The kernel is ready.");
  }
  async function Te() {
    if (!o) return;
    const de = {
      ...o,
      document: {
        ...o.document,
        cells: o.document.cells.map(
          (fe) => fe.cell_type === "code" ? { ...fe, execution_count: null, outputs: [] } : fe
        )
      },
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await v(de), E("Notebook outputs cleared.");
  }
  return te.useEffect(() => {
    p && (o == null ? void 0 : o.id) === p.id && p.nonce !== T.current && (T.current = p.nonce, z());
  }, [p, o == null ? void 0 : o.id]), /* @__PURE__ */ d.jsxs("section", { className: "notebook-tab", "aria-label": "Notebook", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "notebook-toolbar", children: [
      /* @__PURE__ */ d.jsx("strong", { children: (o == null ? void 0 : o.name) || "No notebook selected" }),
      /* @__PURE__ */ d.jsx("button", { disabled: !o || S, onClick: () => void z(), children: "Run" }),
      /* @__PURE__ */ d.jsx("button", { disabled: !o || !S, onClick: () => void J(), children: "Stop" }),
      /* @__PURE__ */ d.jsx("button", { disabled: !o || S, onClick: () => void Te(), children: "Clear output" }),
      /* @__PURE__ */ d.jsx(
        "button",
        {
          disabled: !o || S,
          onClick: () => o && void V(o),
          children: "Reattach input data"
        }
      ),
      h
    ] }),
    /* @__PURE__ */ d.jsx("p", { className: "notebook-status", role: "status", children: A }),
    o ? /* @__PURE__ */ d.jsx("div", { className: "notebook-cells", children: o.document.cells.map((de, fe) => /* @__PURE__ */ d.jsxs("article", { className: `notebook-cell ${de.cell_type}`, children: [
      /* @__PURE__ */ d.jsx("div", { className: "notebook-cell-gutter", children: de.cell_type === "code" ? `[${de.execution_count ?? " "}]` : "" }),
      /* @__PURE__ */ d.jsxs("div", { className: "notebook-cell-body", children: [
        de.cell_type === "markdown" ? /* @__PURE__ */ d.jsx("div", { className: "notebook-markdown", children: /* @__PURE__ */ d.jsx(bu, { markdown: Za(de) }) }) : de.cell_type === "code" ? /* @__PURE__ */ d.jsx("div", { className: "notebook-source", children: /* @__PURE__ */ d.jsx(Su, { code: Za(de) }) }) : /* @__PURE__ */ d.jsx("pre", { className: "notebook-source", children: Za(de) }),
        de.cell_type === "code" && /* @__PURE__ */ d.jsx("div", { className: "notebook-outputs", children: (de.outputs || []).map((ae, Ne) => /* @__PURE__ */ d.jsx(by, { output: ae }, Ne)) })
      ] })
    ] }, de.id || fe)) }) : /* @__PURE__ */ d.jsx("div", { className: "notebook-empty", children: "Choose a Notebook from the Workspace explorer." })
  ] });
}
function Ey() {
  const [r, o] = te.useState(null), [i, c] = te.useState(""), p = te.useRef(null), h = (A) => {
    var E;
    (E = p.current) == null || E.call(p, A), p.current = null, o(null);
  }, v = (A, E = "", T) => new Promise((W) => {
    p.current = W, c(E), o({ title: A, description: T, value: E, confirmLabel: "Save", mode: "text" });
  }), y = (A, E, T = "Continue", W = !1) => new Promise((V) => {
    p.current = V, o({ title: A, description: E, confirmLabel: T, danger: W, mode: "confirm" });
  }), S = (A, E, T) => new Promise((W) => {
    var V;
    p.current = W, c(((V = E[0]) == null ? void 0 : V.value) || ""), o({
      title: A,
      description: T,
      choices: E,
      confirmLabel: "Use selected object",
      mode: "choose"
    });
  }), _ = r ? /* @__PURE__ */ d.jsx(
    "div",
    {
      className: "dialog-backdrop",
      role: "presentation",
      onMouseDown: (A) => {
        A.target === A.currentTarget && h(r.mode === "confirm" ? !1 : null);
      },
      children: /* @__PURE__ */ d.jsxs(
        "form",
        {
          className: "app-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "app-dialog-title",
          onSubmit: (A) => {
            A.preventDefault(), h(
              r.mode === "text" ? i.trim() || null : r.mode === "choose" ? i || null : !0
            );
          },
          children: [
            /* @__PURE__ */ d.jsx("h2", { id: "app-dialog-title", children: r.title }),
            r.description && /* @__PURE__ */ d.jsx("p", { children: r.description }),
            r.mode === "text" && /* @__PURE__ */ d.jsxs("label", { children: [
              /* @__PURE__ */ d.jsx("span", { children: "Name" }),
              /* @__PURE__ */ d.jsx(
                "input",
                {
                  autoFocus: !0,
                  value: i,
                  maxLength: 180,
                  onChange: (A) => c(A.target.value)
                }
              )
            ] }),
            r.mode === "choose" && /* @__PURE__ */ d.jsxs("label", { children: [
              /* @__PURE__ */ d.jsx("span", { children: "OMERO object" }),
              /* @__PURE__ */ d.jsx(
                "select",
                {
                  autoFocus: !0,
                  value: i,
                  onChange: (A) => c(A.target.value),
                  children: (r.choices || []).map((A) => /* @__PURE__ */ d.jsxs("option", { value: A.value, children: [
                    A.label,
                    A.description ? ` — ${A.description}` : ""
                  ] }, A.value))
                }
              )
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "dialog-actions", children: [
              /* @__PURE__ */ d.jsx("button", { type: "button", onClick: () => h(r.mode === "confirm" ? !1 : null), children: "Cancel" }),
              /* @__PURE__ */ d.jsx("button", { className: r.danger ? "danger-button" : "", type: "submit", children: r.confirmLabel })
            ] })
          ]
        }
      )
    }
  ) : null;
  return { askText: v, confirm: y, choose: S, element: _ };
}
function Gp(r) {
  return r.source.source_key || r.source.workflow_key;
}
function Cy(r, o) {
  const i = o.split("*").map((c) => c.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${i}$`, "i").test(r);
}
function Ny(r) {
  const o = /* @__PURE__ */ new Set(), i = (c) => {
    typeof c == "string" ? o.add(c.toLowerCase()) : Array.isArray(c) ? c.forEach(i) : c && typeof c == "object" && Object.entries(c).forEach(([p, h]) => {
      o.add(p.toLowerCase()), i(h);
    });
  };
  return r.forEach((c) => i(c.summary)), o;
}
function ru(r, o, i) {
  if (!r) return [];
  const c = o.filter((v) => !v.deletedAt && v.state === "ready").map((v) => v.name), p = Ny(i), h = [];
  for (const v of r.workflows)
    for (const y of v.skills) {
      let S = y.match.auto_activate ? 1 : 0;
      const _ = [], A = y.match.extensions.find(
        (V) => c.some((z) => z.toLowerCase().endsWith(V.toLowerCase()))
      );
      A && (S += 2, _.push(`extension ${A}`));
      const E = y.match.filename_globs.find(
        (V) => c.some((z) => Cy(z, V))
      );
      E && (S += 3, _.push(`filename ${E}`));
      const T = y.match.required_tables.map((V) => V.toLowerCase());
      T.length && T.every((V) => p.has(V)) && (S += 5, _.push(`schema ${T.join(", ")}`)), y.match.extensions.length > 0 || y.match.filename_globs.length > 0 || y.match.required_tables.length > 0 || (S += 1, _.push("general analysis guidance")), S > 0 && h.push({ entry: v, skill: y, score: S, reasons: _ });
    }
  return h.sort(
    (v, y) => y.score - v.score || v.skill.name.localeCompare(y.skill.name)
  );
}
function Ay(r) {
  const o = r.files.find((h) => h.path === "SKILL.md");
  if (!o) throw new Error(`${r.skill.name} has no SKILL.md`);
  const i = r.files.filter((h) => h.path !== "SKILL.md").map((h) => h.path), c = (r.skill.required_resources || []).map((h) => {
    const v = r.files.find((y) => y.path === h);
    if (!v) throw new Error(`${r.skill.name} requires unavailable resource ${h}`);
    return `Required reference ${h}:
${v.content}`;
  }), p = r.skill.required_capabilities || [];
  return [
    `Active ${r.source.source_kind === "application" ? "application-operation" : "measurement"} skill: ${r.skill.name} v${r.skill.version}`,
    `Source: ${r.source.repository_url}@${r.source.configured_ref}`,
    `Resolved commit: ${r.source.resolved_commit}`,
    `Package hash: ${r.skill.sha256}`,
    o.content,
    ...p.length ? [`Required host capabilities: ${p.join(", ")}`] : [],
    ...c,
    i.length ? `Other available references (load only when needed): ${i.filter((h) => {
      var v;
      return !((v = r.skill.required_resources) != null && v.includes(h));
    }).join(", ") || "none"}` : "No additional references."
  ].join(`

`);
}
function Xp(r) {
  return {
    workflowKey: r.source.workflow_key,
    sourceKind: r.source.source_kind || "workflow",
    sourceKey: r.source.source_key || r.source.workflow_key,
    name: r.skill.name,
    version: r.skill.version,
    sha256: r.skill.sha256,
    configuredRef: r.source.configured_ref,
    resolvedCommit: r.source.resolved_commit
  };
}
const Yp = 48 * 1024;
function Ns(r, o) {
  return [...r].sort().join(",") + "|" + [...o].sort().join(",");
}
function ef(r) {
  return /\bobject_navigation\b|\bfoci_assignments\b|\bfield_quality_summary\b/i.test(r) ? "navigation" : /\bschema_info\b|\binformation_schema\b|\bsqlite_master\b|\bpragma\s+table_info\b|\bdescribe\b/i.test(r) ? "schema" : "tool-result";
}
function $i(r) {
  const o = typeof r == "string" ? r : JSON.stringify(r);
  return o.length > Yp ? `${o.slice(0, Yp)}
[evidence payload truncated]` : o;
}
function ou(r, o, i, c) {
  const p = Ns(i, c);
  return r.filter((h) => h.chatId === o && h.sourceSkillKey === p).sort((h, v) => h.createdAt.localeCompare(v.createdAt));
}
function Iy(r, o) {
  const i = r.filter((h) => h.id !== o.id), c = [...i.filter((h) => h.chatId === o.chatId), o].sort((h, v) => h.createdAt.localeCompare(v.createdAt)).slice(-100), p = new Set(c.map((h) => h.id));
  return [
    ...i.filter((h) => h.chatId !== o.chatId || p.has(h.id)),
    ...c.filter((h) => !i.some((v) => v.id === h.id))
  ].sort((h, v) => h.createdAt.localeCompare(v.createdAt));
}
function Py(r) {
  if (!r.length) return "No verified evidence is available for the current input and skill hashes.";
  const o = r.filter((p) => p.status === "success").slice(-12), i = r.filter((p) => p.status === "failed").slice(-4), c = [
    "Verified evidence ledger for unchanged inputs/skills:",
    ...o.map(
      (p) => `- ${p.id} [${p.kind}] ${p.summary}`
    )
  ];
  return i.length && c.push(
    "Recent failed approahes; do not repeat unchanged:",
    ...i.map((p) => `- ${p.id}: ${p.summary}`)
  ), c.join(`
`).slice(0, 12e3);
}
function Of(r, o) {
  if (!Array.isArray(r) || !r.length)
    throw new Error("Rendering requires at least one evidence_id from a successful analysis execution");
  const i = new Set(
    o.filter((p) => p.status === "success").map((p) => p.id)
  ), c = [...new Set(r.map(String))];
  if (c.some((p) => !i.has(p)))
    throw new Error("A render evidence_id is missing, failed, or stale for the current inputs/skills");
  return c;
}
function vu(r, o = []) {
  if (Array.isArray(r)) {
    for (const c of r) vu(c, o);
    return o;
  }
  if (!r || typeof r != "object") return o;
  const i = r;
  Array.isArray(i.render_panels) && o.push(i);
  for (const c of Object.values(i)) vu(c, o);
  return o;
}
function nl(r) {
  if (Array.isArray(r))
    return `[${r.map(nl).join(",")}]`;
  if (r && typeof r == "object") {
    const o = r;
    return `{${Object.keys(o).sort().map(
      (i) => `${JSON.stringify(i)}:${nl(o[i])}`
    ).join(",")}}`;
  }
  return JSON.stringify(r);
}
function $y(r, o, i) {
  const c = Of(o, i);
  if (!r || typeof r != "object")
    throw new Error("Gallery rendering requires a structured request");
  const p = r;
  if (!Array.isArray(p.panels))
    throw new Error("Gallery rendering requires panels");
  const h = nl(p.panels), v = String(p.store_uuid || "").toLowerCase(), y = new Map(i.map((S) => [S.id, S]));
  for (const S of c) {
    const _ = y.get(S);
    if (!_) continue;
    let A;
    try {
      A = JSON.parse(_.payload);
    } catch {
      continue;
    }
    for (const E of vu(A))
      if (String(E.store_uuid || "").toLowerCase() === v && nl(E.render_panels) === h)
        return c;
  }
  throw new Error(
    'The cited analysis evidence does not contain this exact gallery recipe. Run Python once with result = {"store_uuid": store_uuid, "render_panels": panels}, including every field, ROI, channel, label path, label value, title, and caption; then copy render_panels unchanged into render_zarr_gallery.'
  );
}
function Ry(r, o) {
  var v;
  const i = r.filter(
    (y) => y.chatId === o.chatId && y.promptId === o.promptId && (y.status === "success" || y.status === "reused")
  ).sort((y, S) => y.createdAt.localeCompare(S.createdAt)), c = i.filter((y) => y.purpose !== "inspection"), p = new Set(((v = o.viewer) == null ? void 0 : v.evidenceIds) || []), h = c.filter(
    (y) => y.evidenceId && p.has(y.evidenceId)
  );
  return h.length ? h : c.length ? c : i.filter((y) => y.purpose === "inspection");
}
function Oy(r, o, i, c) {
  var T, W, V;
  const p = (T = r.viewer) == null ? void 0 : T.renderRecipe;
  if (!p) throw new Error("This preview has no reproducible render recipe");
  if (!o.data) throw new Error("The rendered PNG is unavailable in this browser workspace");
  const h = Ry(i, r);
  if (!h.length) throw new Error("No successful analysis or inspection code produced this render");
  const v = Array.from(new Set(h.map((z) => z.code.trimEnd()))).join(
    `

# Continued verified analysis
`
  ), y = new Set(((W = r.viewer) == null ? void 0 : W.evidenceIds) || []), S = c.filter(
    (z) => z.status === "success" && (y.has(z.id) || h.some((J) => J.evidenceId === z.id))
  ), _ = {
    schema: "nl.bioimaging.omero-analysis-render-bundle.v1",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    artifact: {
      id: r.id,
      title: r.title,
      render_kind: ((V = r.viewer) == null ? void 0 : V.renderKind) || "roi",
      png_sha256: o.sha256
    },
    source_hashes: Array.from(new Set(S.flatMap((z) => z.sourceHashes))).sort(),
    skill_hashes: Array.from(new Set(S.flatMap((z) => z.skillHashes))).sort(),
    evidence: S.map((z) => ({
      id: z.id,
      kind: z.kind,
      summary: z.summary,
      source_skill_key: z.sourceSkillKey,
      created_at: z.createdAt
    })),
    executions: h.map((z) => ({
      id: z.id,
      evidence_id: z.evidenceId,
      code_hash: z.codeHash,
      runtime_version: z.runtimeVersion,
      model: z.model,
      purpose: z.purpose,
      created_at: z.createdAt
    }))
  }, A = (z) => new Uint8Array(new TextEncoder().encode(z));
  return { archive: Cf({
    "analysis.py": A(`${v}
`),
    "render-recipe.json": A(`${JSON.stringify(p, null, 2)}
`),
    "render.png": new Uint8Array(o.data),
    "evidence-manifest.json": A(`${JSON.stringify(_, null, 2)}
`)
  }, { level: 6 }), code: v, recipe: p, manifest: _, execution: h.at(-1) };
}
function Xa(r, o = /* @__PURE__ */ new Set()) {
  if (typeof r == "string") {
    const c = r.trim();
    if (!c.startsWith("{") && !c.startsWith("[")) return null;
    try {
      return Xa(JSON.parse(c), o);
    } catch {
      return null;
    }
  }
  if (!r || typeof r != "object" || o.has(r)) return null;
  if (o.add(r), Array.isArray(r)) {
    for (const c of r) {
      const p = Xa(c, o);
      if (p) return p;
    }
    return null;
  }
  const i = r;
  if (typeof i.store_uuid == "string" && Array.isArray(i.render_panels) && i.render_panels.length >= 2)
    return {
      store_uuid: i.store_uuid,
      render_panels: i.render_panels,
      title: typeof i.title == "string" ? i.title : void 0,
      filename: typeof i.filename == "string" ? i.filename : void 0,
      columns: typeof i.columns == "number" ? i.columns : void 0
    };
  for (const c of Object.values(i)) {
    const p = Xa(c, o);
    if (p) return p;
  }
  return null;
}
function Ty(r) {
  return r.replace(/\.py$/i, "").replace(/-analysis$/i, "").replace(/^analysis-/, "") || "saved-method-gallery";
}
function My(r, o, i) {
  var S;
  let c;
  try {
    c = JSON.parse(r);
  } catch {
    return null;
  }
  const p = c.evidence_id;
  if (typeof p != "string" || !p) return null;
  const h = Xa(c);
  if (!h) return null;
  const v = Ty(o), y = ((S = i == null ? void 0 : i.layout) == null ? void 0 : S.columns) ?? h.columns ?? Math.min(4, h.render_panels.length);
  return {
    evidence_ids: [p],
    store_uuid: h.store_uuid,
    panels: h.render_panels,
    title: (i == null ? void 0 : i.title) || h.title || v.replace(/-/g, " "),
    filename: (i == null ? void 0 : i.filename) || h.filename || v,
    columns: y
  };
}
function zy(r) {
  const o = r.replace(/\.(png|svg)$/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return o ? o.charAt(0).toUpperCase() + o.slice(1) : "";
}
function tf(r, o, i) {
  const c = new Set(i.executionIds || []), p = r.filter(
    (h) => h.chatId === i.chatId && (h.kind === "viewer-preview" || h.kind === "plot") && (h.executionId != null && c.has(h.executionId) || i.promptId != null && h.promptId === i.promptId)
  ).sort((h, v) => +(v.kind === "viewer-preview") - +(h.kind === "viewer-preview") || v.createdAt.localeCompare(h.createdAt));
  for (const h of p) {
    const v = o.find((S) => S.id === h.fileId);
    if (h.kind === "plot" && !(v != null && v.type.startsWith("image/"))) continue;
    const y = h.title || (v == null ? void 0 : v.name) || "";
    if (y) {
      if ((v == null ? void 0 : v.name) === y || /\.(png|svg)$/i.test(y)) {
        const S = zy(y);
        if (S) return S;
      }
      return y.trim();
    }
  }
  return null;
}
const Tf = 8, Ly = "The tool-round limit has been reached. Do not call more tools. Give the best final answer using the results already available, and clearly state any remaining limitation.";
function Fy(r, o) {
  const i = r >= Tf;
  return {
    finalSynthesis: i,
    tools: i ? [] : o
  };
}
function Dy(r) {
  return r.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function Mf(r) {
  return r.replace(/[\u0000-\u001f\\/]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}
function Uy(r, o, i) {
  const c = Mf(o);
  if (!c) throw new Error("Workspace name cannot be empty");
  const p = r.workspace.rootPath, v = `${p.split("--", 1)[0] || "OMERO/Local"}--${Dy(c)}`, y = r.files.map((S) => ({
    ...S,
    logicalPath: S.logicalPath.startsWith(`${p}/`) ? `${v}${S.logicalPath.slice(p.length)}` : S.logicalPath
  }));
  return {
    ...r,
    workspace: {
      ...r.workspace,
      name: c,
      rootPath: v,
      updatedAt: i
    },
    files: y
  };
}
function Vy(r, o, i) {
  const c = new Set(o);
  return {
    ...r,
    files: r.files.map(
      (p) => c.has(p.id) && p.source === "result" && !p.deletedAt ? { ...p, deletedAt: i } : p
    )
  };
}
const Wy = /\.(duckdb|sqlite3?|csv|tsv|json|xlsx?|parquet|npy|npz)$/i, nf = 256 * 1024 * 1024, Ee = () => crypto.randomUUID(), oe = () => (/* @__PURE__ */ new Date()).toISOString(), rf = (r) => r.toLowerCase().endsWith(".png") ? "image/png" : r.toLowerCase().endsWith(".svg") ? "image/svg+xml" : r.toLowerCase().endsWith(".csv") ? "text/csv" : r.toLowerCase().endsWith(".json") ? "application/json" : "application/octet-stream";
function Ut(r) {
  return r.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 72).toLowerCase() || "analysis";
}
function of(r) {
  const o = r.replace(/\s+/g, " ").trim().slice(0, 64);
  return o ? o.charAt(0).toUpperCase() + o.slice(1) : "New analysis";
}
function Ha(r) {
  const o = Array.from(r.matchAll(/["']\/input\/([^"']+)["']/g), (c) => c[1]), i = Array.from(new Set(o));
  return {
    formats: Array.from(new Set(i.map((c) => {
      var p;
      return ((p = c.split(".").at(-1)) == null ? void 0 : p.toLowerCase()) || "";
    }))).filter(Boolean),
    requiredFiles: i.map((c) => {
      var p, h;
      return {
        path: c,
        extension: ((h = (p = c.match(/(\.[^.]+)$/)) == null ? void 0 : p[1]) == null ? void 0 : h.toLowerCase()) || ""
      };
    }),
    runtimeVersion: yu
  };
}
function sf(r) {
  return JSON.stringify(
    r.filter((o) => !o.deletedAt).map((o) => ({
      path: o.source === "result" ? `/output/${o.name}` : `/input/${o.name}`,
      logical_path: o.logicalPath,
      sha256: o.sha256,
      size: o.size,
      type: o.type,
      state: o.state
    }))
  );
}
function Es(r, o) {
  const i = o.filter((h) => h.source !== "result" && h.state === "ready"), c = [];
  return { code: r.replace(/(["'])\/input\/([^"']+)\1/g, (h, v, y) => {
    var A, E;
    if (i.some((T) => T.name === y)) return h;
    const S = ((E = (A = y.match(/(\.[^.]+)$/)) == null ? void 0 : A[1]) == null ? void 0 : E.toLowerCase()) || "", _ = i.filter(
      (T) => S && T.name.toLowerCase().endsWith(S)
    );
    if (_.length !== 1)
      throw new Error(
        _.length ? `Method input ${y} is ambiguous: ${_.map((T) => T.name).join(", ")}` : `Method input ${y} has no compatible file in this workspace`
      );
    return c.push({ from: y, to: _[0].name }), `${v}/input/${_[0].name}${v}`;
  }), bindings: c };
}
function su(r) {
  return Math.max(1, Math.ceil(JSON.stringify(r).length / 4));
}
function By(r) {
  return r.filter((o) => o.kind !== "execution").slice(0, -12).map((o) => `${o.role}: ${o.content.replace(/\s+/g, " ").slice(0, 240)}`).join(`
`).slice(-12e3);
}
function Ka(r) {
  return r >= 1024 * 1024 * 1024 ? `${(r / 1024 / 1024 / 1024).toFixed(1)} GiB` : r >= 1024 * 1024 ? `${(r / 1024 / 1024).toFixed(1)} MiB` : r >= 1024 ? `${(r / 1024).toFixed(1)} KiB` : `${r} bytes`;
}
function Qa(r) {
  return (r == null ? void 0 : r.files.filter((o) => !o.deletedAt).reduce((o, i) => o + i.size, 0)) || 0;
}
function Cs(r) {
  return r.files.filter((o) => o.source !== "result" && o.state === "ready" && !o.deletedAt).map((o) => o.sha256).sort();
}
function af(r, o) {
  var i;
  return !!((i = r.requiredCapabilities) != null && i.includes("zarrviewer") || /(?:store_uuid|render_panels|zarrviewer|ome[-_.]?zarr)/i.test(o));
}
function Ja(r, o) {
  if (o.purpose === "inspection") return !1;
  if (r.artifacts.some(
    (c) => c.chatId === o.chatId && c.promptId === o.promptId && !!c.viewer
  )) return !0;
  const i = o.modelPayload ? JSON.stringify(o.modelPayload) : "";
  return /\brender_panels\b/i.test(o.code) || /"render_panels"\s*:/i.test(i) || /\bstore_uuid\b/i.test(o.code) && /\b(?:field|roi|source_channels|overlays)\b/i.test(o.code) || /"store_uuid"\s*:/i.test(i) && /"(?:field|roi|source_channels|overlays)"\s*:/i.test(i);
}
function qy() {
  const r = window.OMERO_ANALYSIS, o = te.useMemo(() => new im(r), [r]), i = te.useMemo(
    () => new oy(r.runtimeBase, r.context),
    [r]
  ), c = Ey(), p = new URLSearchParams(window.location.search).get("tab"), [h, v] = te.useState(
    p === "notebook" || p === "settings" ? p : "chat"
  ), [y, S] = te.useState(null), _ = te.useRef(null), [A, E] = te.useState([]), [T, W] = te.useState([]), [V, z] = te.useState([]), [J, Te] = te.useState(null), [de, fe] = te.useState([]), [ae, Ne] = te.useState(null), [ge, Ce] = te.useState(null), ue = te.useRef(null), he = te.useRef(/* @__PURE__ */ new Map()), [Re, Le] = te.useState(""), [ke, D] = te.useState(null), [Se, De] = te.useState(""), [Pe, Ae] = te.useState(null), Q = te.useRef(/* @__PURE__ */ new Map()), [re, ne] = te.useState([]), [C, F] = te.useState(Zp), [xe, we] = te.useState(""), [me, _e] = te.useState(!1), [Ue, Oe] = te.useState(""), [Ze, Je] = te.useState("ready"), [zt, hn] = te.useState(!1), Wt = te.useRef(!1), [tn, Ps] = te.useState([]), [Cr, ut] = te.useState(null), [$s, Rs] = te.useState(320), [Nr, Ar] = te.useState(360), [Os, Mi] = te.useState(null), [Bo, zi] = te.useState(""), [Ts, se] = te.useState("Preparing workspace…"), [nn, uo] = te.useState(null), [Dn, ar] = te.useState(!1), [Li, po] = te.useState(null), [mn, Ir] = te.useState(/* @__PURE__ */ new Set()), [Pr, fo] = te.useState(/* @__PURE__ */ new Set()), [yn, lr] = te.useState(/* @__PURE__ */ new Set()), [Ms, Un] = te.useState(!1), [Nn, zs] = te.useState(""), [$r, cr] = te.useState({
    chat: !0,
    inputs: !0,
    methods: !0,
    pipelines: !0,
    notebooks: !0,
    trash: !1,
    snapshots: !1
  }), [Fi, qo] = te.useState(null), [ho, Vn] = te.useState({
    percent: 0,
    message: "Preparing the browser analysisWorkspace…"
  }), [ur, Rr] = te.useState({ usage: 0, quota: 0 }), vn = te.useRef(null), Di = te.useRef(null), Wn = te.useRef(null), Bn = te.useRef(null), Or = te.useRef(null), Lt = te.useRef(/* @__PURE__ */ new Set()), Ct = te.useRef([]);
  _.current = y, ue.current = ge;
  function qn(a) {
    const f = new URL(window.location.href);
    f.searchParams.set("tab", a), window.history.replaceState({}, "", f), v(a);
  }
  const $e = (y == null ? void 0 : y.workspace) || null, Nt = (y == null ? void 0 : y.chats) || [], dt = Nt.find((a) => a.id === ($e == null ? void 0 : $e.activeChatId)) || Nt[0] || null, dr = ((y == null ? void 0 : y.files) || []).filter(
    (a) => a.source !== "result" && !a.deletedAt
  ), mo = ((y == null ? void 0 : y.files) || []).filter(
    (a) => a.source === "result" && !a.deletedAt
  ), Ls = mo.filter((a) => !!a.notebookId), Fs = mo.filter(
    (a) => !!a.pipelineId && !a.notebookId
  ), Ds = mo.filter(
    (a) => !!a.methodId && !a.pipelineId && !a.notebookId
  ), Us = mo.filter(
    (a) => !a.notebookId && !a.pipelineId && !a.methodId
  ), Zo = dr.filter((a) => a.state !== "ready"), Vs = (Cr == null ? void 0 : Cr.kind) === "file" ? Cr.id : null, Ke = (a) => ut(a ? { kind: "file", id: a } : null), rn = (a) => !Bo.trim() || a.toLowerCase().includes(Bo.trim().toLowerCase()), Ho = dr.filter((a) => rn(a.name));
  ((y == null ? void 0 : y.files) || []).filter((a) => !!a.deletedAt);
  const pr = ((y == null ? void 0 : y.methods) || []).filter((a) => !a.deletedAt);
  ((y == null ? void 0 : y.methods) || []).filter((a) => !!a.deletedAt), ((y == null ? void 0 : y.pipelines) || []).filter((a) => !!a.deletedAt);
  const yo = !!dt && zt && Zo.length === 0 && !!(C.endpoint && C.apiKey && C.model) && !me, il = me ? "Analysis in progress — wait for the answer or press Stop…" : Zo.some((a) => a.state === "failed" || a.state === "missing") ? "Chat is blocked — retry, reselect, or remove the missing data file…" : Zo.length ? "Downloading selected data — chat will unlock when every file is ready…" : zt ? !C.endpoint || !C.apiKey || !C.model ? "Configure the AI endpoint, model, and API key before asking a question…" : "Ask a question about the loaded data…" : `${ho.message} (${Math.round(ho.percent)}%) — please wait…`;
  te.useEffect(() => {
    const a = Di.current;
    if (!a) return;
    const f = requestAnimationFrame(() => {
      a.scrollTo({ top: a.scrollHeight, behavior: "auto" });
    });
    return () => cancelAnimationFrame(f);
  }, [dt == null ? void 0 : dt.messages, y == null ? void 0 : y.executions, y == null ? void 0 : y.files]), te.useEffect(() => {
    lr(/* @__PURE__ */ new Set());
  }, [$e == null ? void 0 : $e.id, dt == null ? void 0 : dt.id]), te.useEffect(() => {
    if (!nn) return;
    const a = () => uo(null), f = (g) => {
      g.key === "Escape" && a();
    };
    return window.addEventListener("click", a), window.addEventListener("blur", a), window.addEventListener("resize", a), window.addEventListener("keydown", f), () => {
      window.removeEventListener("click", a), window.removeEventListener("blur", a), window.removeEventListener("resize", a), window.removeEventListener("keydown", f);
    };
  }, [nn]), te.useEffect(() => {
    let a = !0;
    return (async () => {
      var L, U, Y;
      const [f, g] = await Promise.all([
        Lm(qp),
        Jm(r.context)
      ]);
      if (!a) return;
      f && F({ ...Zp, ...f }), await o.connect();
      const [w, x] = await Promise.all([
        o.hierarchy(),
        o.zarrViewerStatus().catch((Z) => ({
          schema_version: 1,
          available: !1,
          installed: !1,
          enabled: !1,
          version: null,
          minimum_version: "0.4.0",
          reason: "not-installed"
        }))
      ]);
      Te(w), D(x), x.available && Ae(
        await o.listZarrViewerSkills().catch(() => null)
      ), De(
        x.available ? "" : x.reason === "not-installed" ? "OMERO ZarrViewer is not installed; image previews are unavailable." : x.reason === "app-disabled" ? "OMERO ZarrViewer is installed but not enabled in OMERO.web." : `OMERO ZarrViewer integration unavailable: ${x.reason || "unknown reason"}`
      );
      try {
        const Z = await o.listWorkflowSkills();
        a && (Ce(Z), Le(
          Z.workflows.some((M) => M.status === "stale") ? "Measurement guidance is using an unchanged cached revision." : ""
        ));
      } catch (Z) {
        a && Le(
          `Measurement-specific guidance unavailable: ${String(Z)}`
        );
      }
      let j = g;
      const k = (L = r.context) == null ? void 0 : L.selected_workspace_snapshot;
      if (k) {
        Vn({ percent: 8, message: "Restoring the selected OMERO workspace…" });
        const M = (await ao(r.context)).find(
          (ee) => ee.sourceWorkspaceSnapshotAnnotationId === k.annotation_id
        );
        if (M)
          j = await Pi(M.id) || g;
        else {
          const ee = await Kp(
            await o.downloadSnapshot(k),
            r.context
          );
          if (r.context && (ee.workspace.objectType !== r.context.object_type || ee.workspace.objectId !== r.context.object_id))
            throw new Error("The selected workspace belongs to a different OMERO object");
          ee.workspace = {
            ...ee.workspace,
            sourceWorkspaceSnapshotAnnotationId: k.annotation_id,
            updatedAt: oe()
          }, await rr(ee), j = ee;
        }
      }
      for (const Z of ((U = r.context) == null ? void 0 : U.notebooks) || [])
        if (!j.notebooks.some(
          (M) => M.sourceAnnotationId === Z.annotation_id
        ))
          try {
            const M = oe();
            j = {
              ...j,
              notebooks: [...j.notebooks, {
                id: Ee(),
                workspaceId: j.workspace.id,
                name: Z.name,
                document: nu(await o.downloadNotebook(Z)),
                sourceAnnotationId: Z.annotation_id,
                attachmentIds: [Z.annotation_id],
                selectedDataFileIds: [],
                createdAt: M,
                updatedAt: M
              }]
            };
          } catch (M) {
            console.warn(`Skipped invalid attached notebook ${Z.name}`, M);
          }
      const P = (Y = r.context) == null ? void 0 : Y.selected_notebook;
      if (P) {
        let Z = j.notebooks.find(
          (M) => M.sourceAnnotationId === P.annotation_id
        );
        if (!Z) {
          const M = nu(
            await o.downloadNotebook(P)
          ), ee = oe();
          Z = {
            id: Ee(),
            workspaceId: j.workspace.id,
            name: P.name,
            document: M,
            sourceAnnotationId: P.annotation_id,
            attachmentIds: [P.annotation_id],
            selectedDataFileIds: [],
            createdAt: ee,
            updatedAt: ee
          }, j = { ...j, notebooks: [...j.notebooks, Z] }, await rr(j);
        }
        Ne(Z.id);
      } else j.notebooks.length && Ne(j.notebooks[0].id);
      await rr(j);
      let B = await Ko(j);
      a && (S(B), _.current = B, E(await ao(r.context)), W(await Ii(r.context)), z(await o.listSnapshots()), fe(await o.listPipelineTemplates()), await on(B.files), Ps(await i.profileInputs()), a && (hn(!0), Vn({ percent: 100, message: "Browser Python is ready" }), se("Ready — analysis runs locally in this browser"), Rr(await Ba())));
    })().catch((f) => {
      a && (se(`Workspace failed: ${String(f)}`), Vn({ percent: 0, message: `Workspace failed: ${String(f)}` }));
    }), () => {
      a = !1, i.dispose();
    };
  }, [r, o, i]), te.useEffect(() => {
    let a = !1;
    const f = r.context, g = ke;
    if (!f || !(g != null && g.available) || !J) {
      ne([]);
      return;
    }
    const w = Rp(f, J).slice(0, 50);
    return Promise.allSettled(w.map(async (x) => {
      const j = `${x.type}:${x.id}`, k = Q.current.get(j) || await Hc(g, x);
      return Q.current.set(j, k), { candidate: x, capability: k };
    })).then((x) => {
      var k, P, B, L, U;
      if (a) return;
      const j = /* @__PURE__ */ new Map();
      for (const Y of x) {
        if (Y.status !== "fulfilled" || !Y.value.capability.store.uuid) continue;
        const { candidate: Z, capability: M } = Y.value, ee = M.store.uuid.toLowerCase();
        j.has(ee) || j.set(ee, {
          id: ee,
          name: M.store.name || "OME-Zarr source",
          contextName: f.name,
          storeUuid: ee,
          objectType: Z.type,
          objectId: Z.id,
          zarrName: ((k = M.plate) == null ? void 0 : k.name) || M.image.name,
          plateRows: ((P = M.plate) == null ? void 0 : P.rows.length) || 0,
          plateColumns: ((B = M.plate) == null ? void 0 : B.columns.length) || 0,
          wellsWithData: ((L = M.plate) == null ? void 0 : L.wells.length) || 0,
          fieldsWithData: ((U = M.plate) == null ? void 0 : U.wells.reduce(
            (X, Ve) => X + Ve.fields.length,
            0
          )) || 0
        });
      }
      ne(Array.from(j.values()));
    }), () => {
      a = !0;
    };
  }, [
    r.context,
    J,
    ke == null ? void 0 : ke.available,
    ke == null ? void 0 : ke.version
  ]);
  async function Ko(a) {
    var j;
    let f = a;
    const g = new Map(
      f.files.filter((k) => k.annotationId).map((k) => [k.annotationId, k])
    ), w = ((j = r.context) == null ? void 0 : j.selected_attachments) || [];
    for (const k of w) {
      if (g.has(k.annotation_id)) continue;
      const P = {
        id: Ee(),
        workspaceId: f.workspace.id,
        name: k.name,
        logicalPath: `${f.workspace.rootPath}/inputs/${k.annotation_id}--${k.name}`,
        type: k.mimetype,
        size: k.size,
        sha256: "",
        source: "omero",
        state: "loading",
        annotationId: k.annotation_id,
        fileId: k.file_id,
        createdAt: oe()
      };
      f = { ...f, files: [...f.files, P] }, g.set(k.annotation_id, P);
    }
    const x = f.files.filter(
      (k) => k.source === "omero" && k.annotationId && (!k.data || k.state !== "ready")
    );
    for (let k = 0; k < x.length; k += 1) {
      const P = x[k];
      Vn({
        percent: Math.round(k / Math.max(1, x.length) * 90),
        message: `Downloading ${k + 1} of ${x.length} OMERO inputs…`
      });
      try {
        const B = {
          annotation_id: P.annotationId,
          file_id: P.fileId || 0,
          name: P.name,
          mimetype: P.type,
          size: P.size,
          kind: "attachment",
          supported: !0
        }, L = await o.download(B), U = await en(L);
        if (P.sha256 && P.sha256 !== U)
          throw new Error(
            `OMERO input ${P.name} no longer matches the snapshot hash`
          );
        const Y = {
          ...P,
          data: L,
          size: L.byteLength,
          sha256: U,
          state: "ready",
          error: void 0
        };
        f = {
          ...f,
          files: f.files.map((Z) => Z.id === P.id ? Y : Z)
        }, await Ai(Y);
      } catch (B) {
        const L = { ...P, state: "failed", error: String(B) };
        f = {
          ...f,
          files: f.files.map((U) => U.id === P.id ? L : U)
        }, await Ai(L);
      }
    }
    return await rr(f), f;
  }
  function Qo(a) {
    Vn(a), se(a.message);
  }
  async function on(a) {
    hn(!1), Vn({ percent: 1, message: "Starting browser Python…" });
    const f = a.filter(
      (g) => g.source !== "result" && g.state === "ready" && !g.deletedAt
    );
    Wt.current ? await i.syncInputs(f) : (await i.start(f, Qo), Wt.current = !0);
  }
  async function An(a, f) {
    await on(a), Ps(await i.profileInputs()), hn(!0), Vn({ percent: 100, message: "Browser Python is ready" }), se(f);
  }
  function At(a) {
    const f = _.current;
    if (f) {
      const g = { ...f, workspace: a };
      _.current = g, S(g);
    }
    Bp(a);
  }
  function Tr(a) {
    const f = _.current;
    if (f) {
      const g = {
        ...f,
        chats: f.chats.map((w) => w.id === a.id ? a : w)
      };
      _.current = g, S(g);
    }
    Yc(a);
  }
  function Bt(a, f) {
    const g = _.current;
    if (!g) return;
    const w = g.chats.find((k) => k.id === a);
    if (!w) return;
    const x = { ...w, messages: [...w.messages, f], updatedAt: oe() }, j = {
      ...g,
      chats: g.chats.map((k) => k.id === a ? x : k)
    };
    _.current = j, S(j), Yc(x);
  }
  function al(a, f) {
    const g = new Set(a.pinnedMessageIds || []);
    g.has(f) ? g.delete(f) : g.add(f), Tr({ ...a, pinnedMessageIds: Array.from(g), updatedAt: oe() });
  }
  function Zn(a) {
    const f = _.current;
    if (!f) return;
    const g = f.executions.some((x) => x.id === a.id), w = {
      ...f,
      executions: g ? f.executions.map((x) => x.id === a.id ? a : x) : [...f.executions, a]
    };
    _.current = w, S(w), Um(a);
  }
  function It(a) {
    if (!a.length) return;
    const f = _.current;
    if (!f) return;
    const g = new Set(a.map((x) => x.id)), w = {
      ...f,
      files: [...f.files.filter((x) => !g.has(x.id)), ...a]
    };
    _.current = w, S(w), a.forEach((x) => void Ai(x));
  }
  function vo(a) {
    const f = _.current;
    if (!f) return;
    const g = { ...f, audits: [...f.audits, a] };
    _.current = g, S(g), Wm(a);
  }
  function Hn(a) {
    const f = _.current;
    if (!f) return;
    const g = Iy(f.evidence, a), w = { ...f, evidence: g };
    _.current = w, S(w), Bm(a.chatId, g.filter((x) => x.chatId === a.chatId));
  }
  function Ws(a) {
    if (!a.length) return;
    const f = _.current;
    if (!f) return;
    const g = { ...f, artifacts: [...f.artifacts, ...a] };
    _.current = g, S(g), a.forEach((w) => void Vm(w));
  }
  async function Kn(a) {
    F(a), await Fm(qp, a.rememberKey ? a : { ...a, apiKey: "" });
  }
  async function Bs(a) {
    const f = _.current;
    if (f) {
      if (!a.name.toLowerCase().endsWith(".ipynb")) {
        se("Only .ipynb notebooks can be uploaded");
        return;
      }
      if (a.size > 32 * 1024 * 1024) {
        se("Notebook exceeds the 32 MiB upload limit");
        return;
      }
      try {
        const g = await a.arrayBuffer(), w = nu(g), x = r.context && o.canUpload ? await o.uploadNotebook(a.name, new Uint8Array(g)) : null, j = oe(), k = {
          id: Ee(),
          workspaceId: f.workspace.id,
          name: (x == null ? void 0 : x.name) || a.name,
          document: w,
          sourceAnnotationId: x == null ? void 0 : x.annotation_id,
          attachmentIds: x ? [x.annotation_id] : [],
          selectedDataFileIds: f.files.filter((B) => B.source !== "result" && !B.deletedAt).map((B) => B.id),
          createdAt: j,
          updatedAt: j
        }, P = { ...f, notebooks: [...f.notebooks, k] };
        _.current = P, S(P), Ne(k.id), ut({ kind: "notebook", id: k.id }), qn("notebook"), await tu(k), se(
          x ? `Uploaded and attached ${k.name}` : `Uploaded ${k.name} to this browser workspace`
        );
      } catch (g) {
        se(`Notebook upload failed: ${String(g)}`);
      }
    }
  }
  async function qs(a, f, g, w, x) {
    var ee;
    const j = _.current;
    if (!j || !g.some((X) => X.cell_type === "code")) {
      se(
        x.length ? `Notebook conversion skipped every ZarrViewer-dependent item: ${x.join(", ")}` : "Notebook conversion found no executable Python"
      );
      return;
    }
    const k = (ee = await c.askText(
      "Notebook filename",
      `${Ut(a.replace(/\.ipynb$/i, ""))}.ipynb`,
      "The generated Notebook is run-only and uses the current Workspace input data."
    )) == null ? void 0 : ee.trim();
    if (!k) return;
    const P = Ut(k.replace(/\.ipynb$/i, ""));
    let B = `${P}.ipynb`, L = 2;
    for (; j.notebooks.some(
      (X) => X.name.toLowerCase() === B.toLowerCase()
    ); )
      B = `${P}-${L}.ipynb`, L += 1;
    const U = oe(), Y = x.length ? [{
      id: Ee(),
      cell_type: "markdown",
      source: `## Skipped ZarrViewer items

${x.map((X) => `- ${X}`).join(`
`)}

These items require ZarrViewer and cannot run in Notebook.`,
      metadata: {}
    }] : [], Z = {
      id: Ee(),
      workspaceId: j.workspace.id,
      name: B,
      document: {
        nbformat: 4,
        nbformat_minor: 5,
        metadata: {
          kernelspec: {
            display_name: "Python (Pyodide)",
            language: "python",
            name: "python"
          },
          language_info: { name: "python" },
          omero_analysis: {
            generated_from: w,
            created_at: U
          }
        },
        cells: [{
          id: Ee(),
          cell_type: "markdown",
          source: `# ${f}

Generated from OMERO.Analysis. Inputs are attached from the current Workspace when Run is pressed.`,
          metadata: {}
        }, ...Y, ...g]
      },
      attachmentIds: [],
      selectedDataFileIds: j.files.filter((X) => X.source !== "result" && !X.deletedAt).map((X) => X.id),
      createdAt: U,
      updatedAt: U
    }, M = { ...j, notebooks: [...j.notebooks, Z] };
    _.current = M, S(M), Ne(Z.id), ut({ kind: "notebook", id: Z.id }), Ir(/* @__PURE__ */ new Set()), fo(/* @__PURE__ */ new Set()), await tu(Z), se(
      x.length ? `Created ${Z.name}; skipped ${x.length} ZarrViewer-dependent item(s)` : `Created ${Z.name}`
    );
  }
  async function Zs() {
    const a = _.current;
    if (!a) return;
    const f = a.methods.filter(
      (x) => !x.deletedAt && mn.has(x.id)
    );
    if (!f.length) {
      se("Select at least one Method to convert");
      return;
    }
    const g = [], w = [];
    for (const x of f) {
      const j = x.versions.find(
        (k) => k.version === x.currentVersion
      );
      if (j) {
        if (af(x, j.code)) {
          g.push(x.name);
          continue;
        }
        w.push({
          id: Ee(),
          cell_type: "markdown",
          source: `## ${x.description || x.name}

Method: \`${x.name}\` · version ${j.version}`,
          metadata: {}
        }, {
          id: Ee(),
          cell_type: "code",
          source: j.code,
          metadata: {},
          execution_count: null,
          outputs: []
        });
      }
    }
    await qs(
      f.length === 1 ? f[0].name : "combined-methods",
      f.length === 1 ? f[0].description || f[0].name : "Combined Methods",
      w,
      {
        kind: "methods",
        methods: f.map((x) => ({
          id: x.id,
          name: x.name,
          version: x.currentVersion
        }))
      },
      g
    );
  }
  async function go() {
    const a = _.current;
    if (!a) return;
    const f = a.pipelines.filter(
      (x) => !x.deletedAt && Pr.has(x.id)
    );
    if (!f.length) {
      se("Select at least one Pipeline to convert");
      return;
    }
    const g = [], w = [];
    for (const x of f) {
      f.length > 1 && w.push({
        id: Ee(),
        cell_type: "markdown",
        source: `# Pipeline: ${x.name}

${x.description}`,
        metadata: {}
      });
      for (const j of x.steps) {
        const k = a.methods.find(
          (B) => B.id === j.methodId && !B.deletedAt
        ), P = k == null ? void 0 : k.versions.find(
          (B) => B.version === j.methodVersion
        );
        if (!k || !P) {
          g.push(`${x.name} / ${j.name} (unavailable)`);
          continue;
        }
        if (af(k, P.code)) {
          g.push(`${x.name} / ${j.name}`);
          continue;
        }
        w.push({
          id: Ee(),
          cell_type: "markdown",
          source: `## ${j.name}

Pipeline \`${x.name}\` · Method version ${j.methodVersion}`,
          metadata: {}
        }, {
          id: Ee(),
          cell_type: "code",
          source: P.code,
          metadata: {},
          execution_count: null,
          outputs: []
        });
      }
    }
    await qs(
      f.length === 1 ? f[0].name : "combined-pipelines",
      f.length === 1 ? f[0].name : "Combined Pipelines",
      w,
      {
        kind: "pipelines",
        pipelines: f.map((x) => ({
          id: x.id,
          name: x.name,
          version: x.version
        }))
      },
      g
    );
  }
  function Jo(a) {
    Ne(a.id), ut({ kind: "notebook", id: a.id }), qn("notebook");
  }
  function Go(a) {
    Jo(a), Mi({ id: a.id, nonce: Date.now() });
  }
  async function He(a) {
    const f = _.current;
    if (!f) return;
    const g = {
      ...f,
      notebooks: f.notebooks.map((w) => w.id === a.id ? a : w)
    };
    _.current = g, S(g), await tu(a);
  }
  async function Ui(a, f) {
    const g = _.current;
    if (!g || !f.length) return;
    const w = [];
    for (const x of f) {
      const j = x.data.slice(0);
      w.push({
        id: Ee(),
        workspaceId: g.workspace.id,
        notebookId: a.id,
        name: x.name,
        logicalPath: `${g.workspace.rootPath}/Notebooks/Results/${a.name}/${x.name}`,
        type: x.type,
        size: j.byteLength,
        sha256: await en(j),
        source: "result",
        state: "ready",
        data: j,
        createdAt: oe()
      });
    }
    It(w);
  }
  async function Hs(a) {
    if (!a || !y) return;
    const f = [];
    let g = Qa(y);
    for (const x of Array.from(a)) {
      if (!Wy.test(x.name)) {
        se(`${x.name} is not a supported tabular data file`);
        continue;
      }
      if (x.size > Np) {
        se(`${x.name} exceeds the 256 MiB file limit`);
        continue;
      }
      if (g += x.size, g > Zc) {
        se("The workspace would exceed 512 MiB");
        break;
      }
      const j = await x.arrayBuffer(), k = await en(j);
      if ([...y.files, ...f].some(
        (P) => P.sha256 === k && P.size === j.byteLength
      )) {
        se(`${x.name} matches a file already stored in this workspace`);
        continue;
      }
      f.push({
        id: Ee(),
        workspaceId: y.workspace.id,
        name: x.name,
        logicalPath: `${y.workspace.rootPath}/inputs/${x.name}`,
        type: x.type || rf(x.name),
        size: j.byteLength,
        sha256: k,
        source: "local",
        state: "ready",
        data: j,
        createdAt: oe()
      });
    }
    const w = [...y.files, ...f];
    It(f), await An(w, "Local inputs added; browser Python is ready"), Rr(await Ba());
  }
  async function Ks(a) {
    if (!y) return;
    const f = y.files.find((x) => x.id === a);
    if (!f) return;
    if (f.source === "result") {
      const x = { ...f, deletedAt: oe() };
      It([x]), lr((j) => {
        const k = new Set(j);
        return k.delete(f.id), k;
      }), Vs === f.id && Ke(null), se(`Moved ${f.name} to workspace trash; provenance is preserved`);
      return;
    }
    const g = y.files.filter((x) => x.id !== a), w = { ...y, files: g };
    _.current = w, S(w), await qm(a), await An(g, "Input removed; browser Python was reset"), Rr(await Ba());
  }
  async function Vi(a) {
    if (!y) return;
    const f = y.files.find((w) => w.id === a);
    if (!(f != null && f.annotationId)) return;
    const g = { ...f, state: "loading", error: void 0 };
    It([g]);
    try {
      const w = await o.download({
        annotation_id: f.annotationId,
        file_id: f.fileId || 0,
        name: f.name,
        mimetype: f.type,
        size: f.size,
        kind: "attachment",
        supported: !0
      }), x = {
        ...f,
        data: w,
        size: w.byteLength,
        sha256: await en(w),
        state: "ready",
        error: void 0
      }, j = y.files.map((k) => k.id === f.id ? x : k);
      It([x]), await An(j, "OMERO input restored; workspace ready");
    } catch (w) {
      It([{ ...f, state: "failed", error: String(w) }]);
    }
  }
  async function Xo() {
    if (!y) return;
    const a = tl(y.workspace.id), f = { ...y.workspace, activeChatId: a.id, updatedAt: oe() }, g = { ...y, workspace: f, chats: [...y.chats, a] };
    _.current = g, S(g), await Promise.all([Yc(a), Bp(f)]), qn("chat"), qo(null), Lt.current.clear(), await i.beginTurn();
  }
  function Mr(a) {
    if (!y) return;
    const f = y.chats.find((w) => w.id === a);
    f != null && f.archived && Tr({ ...f, archived: !1, updatedAt: oe() });
    const g = { ...y.workspace, activeChatId: a, updatedAt: oe() };
    At(g), qn("chat"), qo(null);
  }
  async function wo(a) {
    var g;
    const f = (g = await c.askText(
      "Rename chat",
      a.title,
      "The chat folder and exported transcript use this name."
    )) == null ? void 0 : g.trim();
    f && Tr({ ...a, title: f.slice(0, 100), updatedAt: oe() });
  }
  function it(a, f, g) {
    a.preventDefault(), a.stopPropagation();
    const w = 210, x = Math.max(60, g.length * 34 + 34);
    uo({
      x: Math.min(a.clientX, window.innerWidth - w - 8),
      y: Math.min(a.clientY, window.innerHeight - x - 8),
      title: f,
      actions: g
    });
  }
  function Qn(a) {
    a.preventDefault();
    const f = a.clientX, g = $s, w = (j) => Rs(Math.max(250, Math.min(520, g + j.clientX - f))), x = () => {
      window.removeEventListener("mousemove", w), window.removeEventListener("mouseup", x);
    };
    window.addEventListener("mousemove", w), window.addEventListener("mouseup", x);
  }
  function Jn(a) {
    a.preventDefault();
    const f = a.clientX, g = Nr, w = (j) => Ar(
      Math.max(280, Math.min(720, g + f - j.clientX))
    ), x = () => {
      window.removeEventListener("mousemove", w), window.removeEventListener("mouseup", x);
    };
    window.addEventListener("mousemove", w), window.addEventListener("mouseup", x);
  }
  async function gn() {
    $e && (uo(null), E(await ao(r.context)), W(await Ii(r.context)), await ko($e.id));
  }
  async function zr(a) {
    if (a.id === ($e == null ? void 0 : $e.id)) {
      se("Open another local workspace before deleting this one");
      return;
    }
    await c.confirm(
      "Delete browser-local workspace?",
      `${a.name} and its local chats, methods, pipelines, and outputs will be permanently removed. OMERO attachments are unchanged.`,
      "Delete local workspace",
      !0
    ) && (await Zm(a.id), E(await ao(r.context)), W(await Ii(r.context)), se(`Deleted browser-local workspace ${a.name}`));
  }
  async function In(a) {
    const f = await c.askText(
      "Rename workspace",
      a.name,
      "This changes the browser-local workspace name and logical workspace folder. OMERO object and attachment names are unchanged."
    );
    if (f == null) return;
    const g = Mf(f);
    if (!g) {
      se("Workspace name cannot be empty");
      return;
    }
    if (g === a.name) return;
    const w = await ao(r.context);
    if (w.some(
      (P) => P.id !== a.id && P.name.toLocaleLowerCase() === g.toLocaleLowerCase()
    )) {
      se(`A workspace named ${g} already exists for this OMERO object`);
      return;
    }
    const x = _.current, j = (x == null ? void 0 : x.workspace.id) === a.id ? x : await Pi(a.id);
    if (!j) {
      se("The browser-local workspace could not be loaded");
      return;
    }
    const k = Uy(j, g, oe());
    if (w.some(
      (P) => P.id !== a.id && P.rootPath.toLocaleLowerCase() === k.workspace.rootPath.toLocaleLowerCase()
    )) {
      se(`The workspace folder ${k.workspace.rootPath} already exists`);
      return;
    }
    await rr(k), (x == null ? void 0 : x.workspace.id) === a.id && (_.current = k, S(k)), E(await ao(r.context)), W(await Ii(r.context)), se(`Renamed workspace to ${g}`);
  }
  async function Pn(a) {
    var Z, M;
    if (a.source === "omero") {
      se("OMERO attachment names are canonical and cannot be renamed locally");
      return;
    }
    const f = (Z = await c.askText(
      "Rename file",
      a.name,
      "The file extension must remain unchanged."
    )) == null ? void 0 : Z.trim();
    if (!f || f === a.name) return;
    let g = f.replace(/[\\/]/g, "_").slice(0, 180);
    if (!g || g === "." || g === "..") return;
    const w = ((M = a.name.match(/(\.[^.]+)$/)) == null ? void 0 : M[1]) || "";
    if (w && !g.toLowerCase().endsWith(w.toLowerCase())) {
      if (/\.[^.]+$/.test(g)) {
        se(`Keep the ${w} extension when renaming ${a.name}`);
        return;
      }
      g += w;
    }
    const x = _.current;
    if (!x) return;
    if (x.files.filter(
      (ee) => ee.id !== a.id && ee.source === a.source && ee.chatId === a.chatId
    ).some((ee) => ee.name.toLowerCase() === g.toLowerCase())) {
      se(`A file named ${g} already exists in this folder`);
      return;
    }
    const k = a.name.replace(/\.[^.]+$/, ""), P = g.replace(/\.[^.]+$/, ""), B = a.source === "result" && /\.(png|svg|csv)$/i.test(a.name) ? /* @__PURE__ */ new Set(["png", "svg", "csv"]) : null, L = x.files.map((ee) => {
      var Ve;
      let X = ee.id === a.id ? g : null;
      return !X && B && ee.chatId === a.chatId && ee.executionId === a.executionId && ee.name.replace(/\.[^.]+$/, "") === k && B.has(((Ve = ee.name.split(".").at(-1)) == null ? void 0 : Ve.toLowerCase()) || "") && (X = `${P}.${ee.name.split(".").at(-1)}`), X ? {
        ...ee,
        name: X,
        logicalPath: ee.logicalPath.replace(/[^/]+$/, X)
      } : ee;
    }), U = L.filter((ee, X) => ee !== x.files[X]), Y = { ...x, files: L };
    _.current = Y, S(Y), await Promise.all(U.map(Ai)), a.source === "local" ? await An(L, `Renamed input to ${g}; browser Python is ready`) : se(
      U.length > 1 ? `Renamed ${a.name} and its paired plot data` : `Renamed ${a.name} to ${g}`
    );
  }
  function ll(a) {
    if (!y || y.chats.filter((w) => !w.archived).length <= 1) {
      se("Create another chat before archiving this one");
      return;
    }
    const f = { ...a, archived: !0, updatedAt: oe() }, g = y.chats.find((w) => w.id !== a.id && !w.archived);
    Tr(f), At({ ...y.workspace, activeChatId: g.id, updatedAt: oe() });
  }
  async function ko(a) {
    const f = await Pi(a);
    if (!f) return;
    const g = await Ko(f);
    S(g), _.current = g, po(a), ar(!1), Ir(/* @__PURE__ */ new Set()), fo(/* @__PURE__ */ new Set()), await An(g.files, "Workspace loaded");
  }
  async function Lr(a) {
    var Y;
    const f = _.current, g = ke, w = r.context;
    if (!f || !w || !(g != null && g.available) || !g.version)
      throw new Error(Se || "OMERO ZarrViewer 0.3 or newer is unavailable");
    const x = Rp(w, J);
    if (!x.length)
      throw new Error(
        "No compatible OMERO Image or Plate is available in the current object hierarchy"
      );
    const j = (Y = f.workspace.zarrBindings) == null ? void 0 : Y[a], k = j && j.groupId === w.group_id ? x.find(
      (Z) => Z.type === j.objectType && Z.id === j.objectId
    ) : void 0;
    if (k)
      try {
        const Z = `${k.type}:${k.id}`, M = Q.current.get(Z) || await Hc(g, k);
        if (Q.current.set(Z, M), M.store.uuid === a)
          return { binding: Op(
            M,
            k,
            w.group_id,
            g.version
          ), capability: M };
      } catch {
      }
    let P = x;
    if (x.length > 50) {
      const Z = await c.choose(
        "Choose the OME-Zarr source",
        x.map((M) => ({
          value: `${M.type}:${M.id}`,
          label: M.name,
          description: `${M.type} ${M.id}`
        })),
        "This object contains many possible Zarr sources. Choose the source whose UUID should match the measurement database."
      );
      if (!Z) throw new Error("OME-Zarr source selection was cancelled");
      P = x.filter(
        (M) => `${M.type}:${M.id}` === Z
      );
    }
    const B = [];
    for (let Z = 0; Z < P.length; Z += 4) {
      const M = P.slice(Z, Z + 4), ee = await Promise.allSettled(M.map(async (X) => {
        const Ve = `${X.type}:${X.id}`, Me = Q.current.get(Ve) || await Hc(g, X);
        return Q.current.set(Ve, Me), { candidate: X, capability: Me };
      }));
      for (const X of ee)
        X.status === "fulfilled" && X.value.capability.store.uuid === a && B.push(X.value);
    }
    if (!B.length)
      throw new Error(
        `No accessible OME-Zarr source in the current OMERO hierarchy has store UUID ${a}`
      );
    let L = B[0];
    if (B.length > 1) {
      const Z = await c.choose(
        "Choose the matching OME-Zarr source",
        B.map(({ candidate: M }) => ({
          value: `${M.type}:${M.id}`,
          label: M.name,
          description: `${M.type} ${M.id}`
        })),
        "Multiple accessible OMERO objects point to the same OME-Zarr store."
      );
      if (!Z) throw new Error("OME-Zarr source selection was cancelled");
      L = B.find(
        ({ candidate: M }) => `${M.type}:${M.id}` === Z
      ) || B[0];
    }
    const U = Op(
      L.capability,
      L.candidate,
      w.group_id,
      g.version
    );
    return At({
      ..._.current.workspace,
      zarrBindings: {
        ..._.current.workspace.zarrBindings || {},
        [a]: U
      },
      updatedAt: oe()
    }), { binding: U, capability: L.capability };
  }
  async function cl(a, f, g, w) {
    const x = _.current, j = ke;
    if (!x || !(j != null && j.available))
      throw new Error(Se || "OMERO ZarrViewer is unavailable");
    const k = Jh(a), P = ou(
      x.evidence,
      f,
      Cs(x),
      Ct.current.map((Me) => Me.sha256)
    );
    Of(k.evidenceIds, P);
    const { binding: B, capability: L } = await Lr(k.storeUuid), U = nm(j, L, k), Y = om(B, k, U);
    let Z;
    if (w) {
      const Me = await rm(L, k);
      if (Qa(_.current) + Me.byteLength > Zc)
        throw new Error("The rendered preview would exceed the 512 MiB workspace limit");
      const ht = `${Ut(k.title)}.png`;
      Z = {
        id: Ee(),
        workspaceId: x.workspace.id,
        chatId: f,
        name: ht,
        logicalPath: `${x.workspace.rootPath}/chats/${f}/outputs/zarr/${ht}`,
        type: "image/png",
        size: Me.byteLength,
        sha256: await en(Me),
        source: "result",
        state: "ready",
        data: Me,
        viewer: Y,
        createdAt: oe()
      }, It([Z]);
    }
    const M = {
      id: Ee(),
      workspaceId: x.workspace.id,
      chatId: f,
      fileId: Z == null ? void 0 : Z.id,
      kind: "viewer-preview",
      title: k.title,
      pinned: !1,
      promptId: g,
      viewer: Y,
      createdAt: oe()
    };
    Ws([M]), Bt(f, {
      id: Ee(),
      role: "assistant",
      content: w ? `Rendered ${k.title} locally from the matching OME-Zarr source.` : `Prepared a validated ZarrViewer link for ${k.title}.`,
      kind: "viewer-preview",
      artifactId: M.id,
      activity: "worked",
      createdAt: oe()
    }), Z && Ke(Z.id);
    const ee = Ee(), X = Cs(x), Ve = Ct.current.map((Me) => Me.sha256);
    return Hn({
      id: ee,
      workspaceId: x.workspace.id,
      chatId: f,
      promptId: g,
      kind: "render",
      status: "success",
      sourceHashes: X,
      skillHashes: Ve,
      sourceSkillKey: Ns(X, Ve),
      summary: `${w ? "Rendered" : "Opened"} ${k.title} from evidence ${k.evidenceIds.join(", ")}`,
      payload: $i(Y),
      createdAt: oe()
    }), JSON.stringify({
      ok: !0,
      artifact_id: M.id,
      render_evidence_id: ee,
      cited_evidence_ids: k.evidenceIds,
      preview_created: !!Z,
      field: k.field,
      roi: k.roi,
      cropped_field_preview: k.croppedField
    });
  }
  async function Qs(a, f, g, w = {}) {
    const x = _.current;
    if (!x || !(ke != null && ke.available))
      throw new Error(Se || "OMERO ZarrViewer is unavailable");
    const { recipe: j, evidenceIds: k } = Gh(a), P = ou(
      x.evidence,
      f,
      Cs(x),
      Ct.current.map((ht) => ht.sha256)
    );
    $y(a, k, P);
    const { binding: B, capability: L } = await Lr(j.storeUuid), U = await mf(L, j);
    if (Qa(_.current) + U.byteLength > Zc)
      throw new Error("The rendered gallery would exceed the 512 MiB workspace limit");
    const Y = `${Ut(j.filename || j.title || "zarr-gallery").replace(/-png$/, "")}.png`, Z = sm(B, j, k), M = {
      id: Ee(),
      workspaceId: x.workspace.id,
      chatId: f,
      ...w,
      name: Y,
      logicalPath: `${x.workspace.rootPath}/${w.pipelineId ? "Pipelines" : w.methodId ? "Methods" : "Chat"}/Results/zarr/${Y}`,
      type: "image/png",
      size: U.byteLength,
      sha256: await en(U),
      source: "result",
      state: "ready",
      data: U,
      viewer: Z,
      createdAt: oe()
    };
    It([M]);
    const ee = {
      id: Ee(),
      workspaceId: x.workspace.id,
      chatId: f,
      fileId: M.id,
      kind: "viewer-preview",
      title: j.title || "OME-Zarr gallery",
      pinned: !1,
      promptId: g,
      viewer: Z,
      createdAt: oe()
    };
    Ws([ee]), Bt(f, {
      id: Ee(),
      role: "assistant",
      content: `Rendered one ${j.panels.length}-panel OME-Zarr gallery from verified analysis evidence.`,
      kind: "viewer-preview",
      artifactId: ee.id,
      activity: "worked",
      createdAt: oe()
    }), Ke(M.id);
    const X = Ee(), Ve = Cs(x), Me = Ct.current.map((ht) => ht.sha256);
    return Hn({
      id: X,
      workspaceId: x.workspace.id,
      chatId: f,
      promptId: g,
      kind: "render",
      status: "success",
      sourceHashes: Ve,
      skillHashes: Me,
      sourceSkillKey: Ns(Ve, Me),
      summary: `Rendered ${j.panels.length}-panel gallery from evidence ${k.join(", ")}`,
      payload: $i({ recipe: j, fileId: M.id, sha256: M.sha256 }),
      createdAt: oe()
    }), JSON.stringify({
      ok: !0,
      artifact_id: ee.id,
      file_id: M.id,
      panel_count: j.panels.length,
      render_evidence_id: X,
      cited_evidence_ids: k
    });
  }
  async function xo(a, f, g, w, x, j = {}) {
    const k = My(
      a,
      w,
      x
    );
    return k ? Qs(k, f, g, j) : null;
  }
  async function Fr(a, f, g, w, x, j = {}) {
    const k = await fr(
      g,
      w,
      x,
      !0,
      "method",
      j
    ), P = await xo(
      k,
      w,
      x,
      a.name,
      f.renderRecipe,
      j
    );
    return { executionResult: k, renderResult: P };
  }
  async function Wi(a, f) {
    const g = `${a}/${f}`, w = he.current.get(g);
    if (w) return w;
    const x = await o.loadWorkflowSkill(a, f);
    return he.current.set(g, x), x;
  }
  async function fr(a, f, g, w = !1, x = "analysis", j = {}) {
    const k = _.current;
    if (!k) return gt("Workspace is not ready");
    const P = performance.now(), B = a.replace(/\r\n/g, `
`).trimEnd(), L = await en(B), U = Cs(k), Y = Ct.current.map((ie) => ie.sha256).sort(), Z = await en(
      `${L}|${U.join(",")}|${Y.join(",")}|${yu}|plotCsv=${k.workspace.plotCsv}`
    ), M = k.executions.filter((ie) => ie.cacheKey === Z && ie.status !== "running").sort((ie, Ge) => Ge.createdAt.localeCompare(ie.createdAt))[0];
    if (M && !w) {
      const ie = {
        ...M,
        id: Ee(),
        chatId: f,
        promptId: g,
        status: M.status === "success" || M.status === "reused" ? "reused" : "failed",
        reusedFrom: M.id,
        purpose: x,
        durationMs: performance.now() - P,
        createdAt: oe()
      };
      if (Zn(ie), Bt(f, {
        id: Ee(),
        role: "assistant",
        content: ie.status === "reused" ? "Reused a previous successful local Python run because its code and inputs are unchanged." : "Skipped unchanged Python that already failed; the AI provider must correct the code.",
        kind: "execution",
        executionId: ie.id,
        createdAt: oe()
      }), ie.status === "reused") {
        let Ge = M.evidenceId;
        return Ge || (Ge = Ee(), Hn({
          id: Ge,
          workspaceId: k.workspace.id,
          chatId: f,
          promptId: g,
          kind: ef(M.code),
          status: "success",
          sourceHashes: U,
          skillHashes: Y,
          sourceSkillKey: Ns(U, Y),
          executionId: M.id,
          summary: `Reused verified execution ${M.id}`,
          payload: $i({
            stdout: M.stdout,
            preview: M.preview,
            outputFileIds: M.outputFileIds
          }),
          createdAt: oe()
        })), JSON.stringify({
          reused: !0,
          execution_id: M.id,
          evidence_id: Ge,
          stdout: M.stdout,
          stderr: M.stderr,
          preview: M.preview,
          generated_files: M.outputFileIds.map((pt) => k.files.find((Zt) => Zt.id === pt)).filter(Boolean).map((pt) => ({ name: pt.name, size: pt.size, type: pt.type }))
        });
      }
      return gt(
        `Identical code already failed:
${M.stderr || M.stdout}. Modify the code before trying again.`
      );
    }
    const ee = {
      id: Ee(),
      workspaceId: k.workspace.id,
      chatId: f,
      promptId: g,
      code: B,
      codeHash: L,
      cacheKey: Z,
      status: "running",
      stdout: "",
      stderr: "",
      outputFileIds: [],
      missingPlotCsv: [],
      inputHashes: U,
      runtimeVersion: yu,
      model: C.model,
      workflowSkills: Ct.current,
      purpose: x,
      createdAt: oe()
    };
    Zn(ee), Bt(f, {
      id: Ee(),
      role: "assistant",
      content: "Python execution",
      kind: "execution",
      executionId: ee.id,
      createdAt: oe()
    });
    let X;
    try {
      Je("running"), X = await i.run(B);
    } catch (ie) {
      const Ge = String(ie instanceof Error ? ie.message : ie).slice(0, or), pt = Ee(), Zt = {
        ...ee,
        status: "failed",
        stderr: Ge,
        evidenceId: pt,
        durationMs: performance.now() - P
      };
      return Zn(Zt), Hn({
        id: pt,
        workspaceId: k.workspace.id,
        chatId: f,
        promptId: g,
        kind: "failed-approah",
        status: "failed",
        sourceHashes: U,
        skillHashes: Y,
        sourceSkillKey: Ns(U, Y),
        executionId: ee.id,
        summary: Ge.slice(0, 300),
        payload: $i({ code: B, error: Ge }),
        createdAt: oe()
      }), se("Python error sent to the AI provider; waiting for corrected code…"), Je("repairing"), gt(ie);
    }
    const Ve = [];
    for (const ie of X.files) {
      const Ge = Ee();
      Ve.push({
        id: Ge,
        workspaceId: k.workspace.id,
        chatId: f,
        ...j,
        executionId: ee.id,
        name: ie.name,
        logicalPath: `${k.workspace.rootPath}/${j.pipelineId ? "Pipelines" : j.methodId ? "Methods" : "Chat"}/Results/${ee.id}/${ie.name}`,
        type: ie.type,
        size: ie.data.byteLength,
        sha256: await en(ie.data),
        source: "result",
        state: "ready",
        data: ie.data,
        createdAt: oe()
      }), Lt.current.add(ie.name);
    }
    It(Ve), Ws(Ve.map((ie) => ({
      id: Ee(),
      workspaceId: k.workspace.id,
      chatId: f,
      executionId: ee.id,
      fileId: ie.id,
      kind: ie.type.startsWith("image/") ? "plot" : "file",
      title: ie.name,
      pinned: !1,
      createdAt: oe()
    })));
    const Me = k.workspace.plotCsv ? Array.from(Lt.current).filter((ie) => /\.(png|svg)$/i.test(ie)).filter((ie) => !Lt.current.has(ie.replace(/\.(png|svg)$/i, ".csv"))) : [], ht = Ee(), Fe = {
      ...ee,
      status: Me.length ? "incomplete" : "success",
      stdout: X.stdout,
      stderr: X.stderr,
      preview: X.preview,
      modelPayload: X.modelPayload,
      outputFileIds: Ve.map((ie) => ie.id),
      missingPlotCsv: Me,
      purpose: x === "inspection" && Ve.length ? "analysis" : x,
      evidenceId: ht,
      durationMs: performance.now() - P
    };
    Zn(Fe), Hn({
      id: ht,
      workspaceId: k.workspace.id,
      chatId: f,
      promptId: g,
      kind: ef(B),
      status: "success",
      sourceHashes: U,
      skillHashes: Y,
      sourceSkillKey: Ns(U, Y),
      executionId: ee.id,
      summary: `Successful ${x} execution; preview and generated-file metadata are reusable`,
      payload: $i({
        stdout: X.stdout,
        preview: X.preview,
        generatedFiles: Ve.map((ie) => ({
          id: ie.id,
          name: ie.name,
          sha256: ie.sha256,
          size: ie.size,
          type: ie.type
        }))
      }),
      createdAt: oe()
    });
    const qt = JSON.stringify(X.modelPayload);
    if (vo({
      id: Ee(),
      workspaceId: k.workspace.id,
      chatId: f,
      executionId: ee.id,
      categories: ["bounded-preview", "generated-file-metadata", ...X.modelPayload.stderr ? ["error"] : []],
      byteLength: new TextEncoder().encode(qt).byteLength,
      payload: qt,
      createdAt: oe()
    }), !Me.length) {
      const ie = _.current;
      for (const Ge of (ie == null ? void 0 : ie.executions) || []) {
        if (Ge.chatId !== f || Ge.promptId !== g || !Ge.missingPlotCsv.length) continue;
        const pt = Ge.missingPlotCsv.filter(
          (Zt) => !Lt.current.has(Zt.replace(/\.(png|svg)$/i, ".csv"))
        );
        pt.length !== Ge.missingPlotCsv.length && Zn({
          ...Ge,
          status: pt.length ? "incomplete" : "success",
          missingPlotCsv: pt
        });
      }
    }
    return se("Python completed locally; continuing the analysis…"), Je(Me.length ? "repairing" : "checking"), Me.length ? gt(
      `Plot data CSV required. Create ${Me.map((ie) => ie.replace(/\.(png|svg)$/i, ".csv")).join(", ")} containing the data used for the plot. Do not regenerate unrelated analysis.`
    ) : JSON.stringify({
      ok: !0,
      evidence_id: ht,
      execution_id: ee.id,
      ...X.modelPayload
    }).slice(0, or);
  }
  async function _o(a, f, g) {
    let w = {};
    try {
      w = JSON.parse(a.function.arguments || "{}");
    } catch (k) {
      return gt(`Invalid JSON tool arguments: ${String(k)}`);
    }
    const x = _.current;
    if (!x) return gt("Workspace is not ready");
    if (a.function.name === "discover_skills") {
      const k = ue.current;
      if (!k)
        return gt(
          Re || "No pipeline skill catalog is available"
        );
      const P = ru(
        k,
        x.files,
        tn
      ).map((L) => ({
        workflow_key: Gp(L.entry),
        name: L.skill.name,
        description: L.skill.description,
        purpose: L.skill.purpose,
        version: L.skill.version,
        score: L.score,
        reasons: L.reasons,
        references_are_progressive: !0,
        source: {
          repository_url: L.entry.source.repository_url,
          configured_ref: L.entry.source.configured_ref,
          resolved_commit: L.entry.source.resolved_commit,
          sha256: L.skill.sha256,
          status: L.entry.status
        }
      })), B = (k.applications || []).flatMap(
        (L) => L.skills.map((U) => ({
          workflow_key: Gp(L),
          name: U.name,
          description: U.description,
          purpose: U.purpose,
          version: U.version,
          score: 0,
          reasons: [
            "Optional application operation; load only when the user explicitly asks to show, open, or render compatible data."
          ],
          references_are_progressive: !0,
          source: {
            repository_url: L.source.repository_url,
            configured_ref: L.source.configured_ref,
            resolved_commit: L.source.resolved_commit,
            sha256: U.sha256,
            status: L.status
          }
        }))
      );
      return JSON.stringify([...P, ...B]).slice(0, or);
    }
    if (a.function.name === "load_skill") {
      if (typeof w.workflow_key != "string" || typeof w.skill_name != "string")
        return gt("load_skill requires workflow_key and skill_name");
      try {
        const k = await Wi(
          w.workflow_key,
          w.skill_name
        ), P = Xp(k);
        Ct.current.some(
          (U) => U.workflowKey === P.workflowKey && U.name === P.name && U.sha256 === P.sha256
        ) || (Ct.current = [...Ct.current, P]);
        const B = typeof w.resource == "string" && w.resource ? w.resource : "SKILL.md", L = k.files.find((U) => U.path === B);
        return L ? JSON.stringify({
          workflow_key: k.source.workflow_key,
          skill_name: k.skill.name,
          version: k.skill.version,
          configured_ref: k.source.configured_ref,
          resolved_commit: k.source.resolved_commit,
          sha256: k.skill.sha256,
          resource: B,
          content: L.content.slice(0, or - 4096),
          available_resources: k.files.map((U) => U.path)
        }) : gt(
          `Resource ${B} is unavailable. Available resources: ` + k.files.map((U) => U.path).join(", ")
        );
      } catch (k) {
        return gt(k);
      }
    }
    if (a.function.name === "open_zarr_view" || a.function.name === "render_zarr_roi" || a.function.name === "render_zarr_gallery")
      try {
        return a.function.name === "render_zarr_gallery" ? await Qs(w, f, g) : await cl(
          w,
          f,
          g,
          a.function.name === "render_zarr_roi"
        );
      } catch (k) {
        return se(`ZarrViewer request needs correction: ${String(k)}`), Je("repairing"), JSON.stringify({
          ok: !1,
          recoverable: !0,
          error: String(k instanceof Error ? k.message : k),
          instruction: "Inspect the measurement database again and correct the UUID, field, dimensions, coordinates, channels, or label information. Do not invent an OMERO ID or URL."
        }).slice(0, or);
      }
    if (a.function.name === "list_workspace_files") return sf(x.files);
    if (a.function.name === "reset_python")
      try {
        return await i.beginTurn(), Lt.current.clear(), "Python state reset; canonical workspace inputs remain available.";
      } catch (k) {
        return gt(k);
      }
    if (a.function.name === "list_saved_methods")
      return JSON.stringify(x.methods.filter((k) => !k.deletedAt).map((k) => ({
        id: k.id,
        name: k.name,
        description: k.description,
        current_version: k.currentVersion,
        updated_at: k.updatedAt
      })));
    if (a.function.name === "read_saved_method") {
      const k = x.methods.find((B) => B.id === w.method_id && !B.deletedAt);
      if (!k) return gt("Saved method was not found");
      const P = k.versions.find((B) => B.version === k.currentVersion);
      return P ? JSON.stringify({ id: k.id, name: k.name, version: P.version, code: P.code }) : gt("Saved method has no readable current version");
    }
    if (a.function.name === "run_saved_method") {
      const k = x.methods.find((B) => B.id === w.method_id && !B.deletedAt), P = k == null ? void 0 : k.versions.find((B) => B.version === k.currentVersion);
      if (!k || !P) return gt("Saved method was not found");
      try {
        const B = Es(P.code, x.files), { executionResult: L, renderResult: U } = await Fr(
          k,
          P,
          B.code,
          f,
          g
        );
        return JSON.stringify({
          execution: JSON.parse(L),
          render_replayed: !!U,
          render: U ? JSON.parse(U) : void 0
        }).slice(0, or);
      } catch (B) {
        return gt(B);
      }
    }
    if (a.function.name === "list_saved_pipelines")
      return JSON.stringify(x.pipelines.filter((k) => !k.deletedAt).map((k) => ({
        id: k.id,
        name: k.name,
        description: k.description,
        version: k.version,
        steps: k.steps.map((P) => P.name)
      })));
    if (a.function.name === "run_saved_pipeline") {
      const k = x.pipelines.find(
        (L) => L.id === w.pipeline_id && !L.deletedAt
      );
      if (!k) return gt("Saved pipeline was not found");
      const P = [];
      let B = 0;
      for (const L of k.steps) {
        const U = _.current, Y = U.methods.find((M) => M.id === L.methodId && !M.deletedAt), Z = Y == null ? void 0 : Y.versions.find((M) => M.version === L.methodVersion);
        if (!Y || !Z) return gt(`Pipeline step ${L.name} is unavailable`);
        try {
          await i.beginTurn();
          const M = Es(Z.code, U.files), ee = await Fr(
            Y,
            Z,
            M.code,
            f,
            g
          );
          P.push(ee.executionResult), ee.renderResult && (B += 1);
        } catch (M) {
          return gt(`Pipeline step ${L.name} failed: ${String(M)}`);
        }
      }
      return JSON.stringify({
        pipeline: k.name,
        steps: k.steps.length,
        renders: B,
        results: P
      }).slice(0, or);
    }
    if (a.function.name !== "run_python" || typeof w.code != "string")
      return gt(`Unsupported or invalid tool call: ${a.function.name}`);
    const j = w.purpose === "analysis" ? "analysis" : "inspection";
    return fr(w.code, f, g, !1, j);
  }
  async function Dr() {
    var Ge, pt, Zt, Ji, Co, Gi, ri, os, ss;
    const a = xe.trim(), f = _.current, g = f == null ? void 0 : f.chats.find((We) => We.id === f.workspace.activeChatId);
    if (!a || !yo || !f || !g) return;
    we(""), _e(!0), Je("planning");
    const w = performance.now();
    let x = !1;
    vn.current = new AbortController(), Lt.current.clear(), await i.beginTurn(), Ct.current = [];
    const j = [];
    let k = "";
    const P = /\b(show|render|view|open|gallery|montage|image|field|well|contour|mask|overlay|png)\b/i.test(a), B = ru(
      ue.current,
      f.files,
      tn
    );
    if (B.length) {
      const We = B[0];
      try {
        const at = await Wi(
          We.entry.source.workflow_key,
          We.skill.name
        );
        j.push(at);
      } catch (at) {
        k = `Measurement-specific guidance unavailable: ${String(at)}`;
      }
    }
    if (P && (ke != null && ke.available))
      try {
        const We = await o.loadZarrViewerSkill();
        j.some((at) => at.skill.sha256 === We.skill.sha256) || j.push(We);
      } catch (We) {
        k = [
          k,
          `ZarrViewer operation guidance unavailable: ${String(We)}`
        ].filter(Boolean).join(" ");
      }
    Ct.current = j.map(Xp);
    const L = j.map((We) => {
      const at = Ay(We);
      if (!P) return at;
      const wn = We.files.find(
        (No) => /(^|\/)PNG_QUESTIONS\.md$/i.test(No.path)
      );
      return wn ? `${at}

PNG question and rendering reference ${wn.path}:
${wn.content}` : at;
    }).join(`

---

`), U = Cs(f), Y = Ct.current.map((We) => We.sha256).sort(), Z = ou(f.evidence, g.id, U, Y), M = Ee(), ee = {
      id: M,
      role: "user",
      content: a,
      workflowSkills: Ct.current,
      createdAt: oe()
    };
    Bt(g.id, ee);
    let X = {
      ...g,
      messages: [...g.messages, ee],
      updatedAt: oe()
    };
    g.messages.filter((We) => We.role === "user").length === 0 && (X = { ...X, title: of(a) }, Tr(X));
    const Ve = C.contextWindow > 0 ? Math.floor(C.contextWindow * 0.6) : 24e3, Me = X.messages.filter((We) => We.kind !== "execution");
    su(Me) > Ve && (X = { ...X, summary: By(Me), updatedAt: oe() }, Tr(X), se("Older conversation context was compacted; pinned items and the latest six exchanges were retained"));
    const ht = `${Bh}

Workspace root: ${f.workspace.rootPath}
Exact current workspace files (already discovered; do not call list_workspace_files):
${sf(f.files)}

${Py(Z)}

The user has ${f.methods.filter((We) => !We.deletedAt).length} saved methods. ${f.workspace.plotCsv ? "Plot CSV mode is ON: every PNG or SVG must have a same-stem CSV containing its plotted data." : "Plot CSV mode is OFF."}
${ke != null && ke.available ? `OMERO ZarrViewer ${ke.version} is available. Use its tools only for an explicit request to show, open, or render an image, field, object, or focus; derive every navigation value from the measurement database.` : `OMERO ZarrViewer tools are unavailable in this deployment. ${Se}`}

${L || (k || Re ? `No specialized pipeline skill was loaded. ${k || Re}` : "No compatible specialized pipeline skill matched; use generic schema-first analysis.")}

Efficiency contract: answer an initial most-foci request within four tool rounds and a follow-up
render within two tool rounds. Do not repeat schema discovery while the listed source and skill
hashes are unchanged. Reuse matching evidence IDs and verified rows from the ledger.`, Fe = new Set(X.pinnedMessageIds || []), qt = [
      ...Me.filter((We) => Fe.has(We.id)),
      ...Me.slice(-12)
    ].filter(
      (We, at, wn) => wn.findIndex((No) => No.id === We.id) === at
    ), ie = [
      { role: "system", content: ht },
      ...X.summary ? [{ role: "system", content: `Earlier conversation summary:
${X.summary}` }] : [],
      ...qt.map((We) => ({ role: We.role, content: We.content }))
    ];
    ((Ge = ie.at(-1)) == null ? void 0 : Ge.content) !== a && ie.push({ role: "user", content: a });
    try {
      const We = [
        ...rl.filter(
          (at) => at.function.name !== "discover_skills" && at.function.name !== "list_workspace_files"
        ),
        ...ke != null && ke.available ? qh : []
      ];
      for (let at = 0; at <= Tf; at += 1) {
        const wn = Fy(at, We);
        wn.finalSynthesis && (ie.push({
          role: "system",
          content: Ly
        }), Je("checking"));
        const No = su(ie), _l = performance.now(), Ao = await cm(
          C,
          ie,
          vn.current.signal,
          (sn) => Oe(sn),
          wn.tools
        ), $n = (pt = Ao.choices[0]) == null ? void 0 : pt.message;
        if (!$n) throw new Error("The AI provider returned no response");
        const Sl = performance.now() - _l, Ht = ((Zt = Ao.usage) == null ? void 0 : Zt.prompt_tokens) ?? No, Br = ((Ji = Ao.usage) == null ? void 0 : Ji.completion_tokens) ?? su($n.content || $n.tool_calls || ""), oi = ((Co = Ao.usage) == null ? void 0 : Co.total_tokens) ?? Ht + Br;
        if (qo((sn) => ({
          promptTokens: Ht,
          completionTokens: Br,
          totalTokens: oi,
          sessionTokens: ((sn == null ? void 0 : sn.sessionTokens) || 0) + oi,
          estimated: !Ao.usage
        })), ie.push({ role: "assistant", content: $n.content, tool_calls: $n.tool_calls }), $n.content) {
          const sn = (((Gi = _.current) == null ? void 0 : Gi.executions) || []).filter((qr) => qr.promptId === M).map((qr) => qr.id);
          Bt(g.id, {
            id: Ee(),
            role: "assistant",
            content: $n.content,
            citationIds: sn,
            workflowSkills: Ct.current,
            activity: x ? "worked" : "thought",
            durationMs: x ? performance.now() - w : Sl,
            createdAt: oe()
          });
        }
        if (Oe(""), !((ri = $n.tool_calls) != null && ri.length)) break;
        if (wn.finalSynthesis)
          throw new Error("The AI provider attempted another tool call during final synthesis");
        x = !0, Je(at ? "repairing" : "running");
        for (const sn of $n.tool_calls) {
          const qr = await _o(sn, g.id, M);
          ie.push({ role: "tool", tool_call_id: sn.id, content: qr });
        }
        Je("checking");
      }
    } catch (We) {
      (os = vn.current) != null && os.signal.aborted || Bt(g.id, {
        id: Ee(),
        role: "assistant",
        content: String(We),
        kind: "error",
        activity: x ? "worked" : "thought",
        durationMs: performance.now() - w,
        createdAt: oe()
      });
    } finally {
      (ss = vn.current) != null && ss.signal.aborted || se("Ready — analysis runs locally in this browser"), vn.current = null, Oe(""), Je("ready"), _e(!1), Rr(await Ba());
    }
  }
  function Yo() {
    var a, f;
    (a = vn.current) == null || a.abort(), i.stop(), _e(!1), An(((f = _.current) == null ? void 0 : f.files) || [], "Ready — analysis runs locally in this browser");
  }
  async function ul(a) {
    var Me, ht;
    const f = _.current;
    if (!f || a.purpose === "inspection" || Ja(f, a) || !["success", "reused"].includes(a.status)) return;
    const g = f.chats.find((Fe) => Fe.id === a.chatId), w = g == null ? void 0 : g.messages.find((Fe) => Fe.id === a.promptId), j = f.executions.filter(
      (Fe) => Fe.chatId === a.chatId && Fe.promptId === a.promptId && ["success", "reused"].includes(Fe.status)
    ).sort((Fe, qt) => Fe.createdAt.localeCompare(qt.createdAt)).filter(
      (Fe) => Fe.purpose !== "inspection" && !Ja(f, Fe)
    ), k = Array.from(new Set(j.map((Fe) => Fe.code))).join(
      `

# Continued analysis / automatic repair
`
    ) || a.code, P = await en(k), B = tf(
      f.artifacts,
      f.files,
      {
        chatId: a.chatId,
        promptId: a.promptId,
        executionIds: j.map((Fe) => Fe.id)
      }
    ) || of((w == null ? void 0 : w.content) || "Analysis method"), L = `${Ut(B)}-analysis.py`, U = (Me = await c.askText(
      "Method filename",
      L,
      "Methods are versioned and can be copied to compatible OMERO workspaces."
    )) == null ? void 0 : Me.trim();
    if (!U) return;
    const Y = `${Ut(U.replace(/\.py$/i, ""))}.py`, Z = ((ht = await c.askText(
      "Method title",
      B,
      "Suggested from the generated graph or image title."
    )) == null ? void 0 : ht.trim()) || "", M = f.methods.find(
      (Fe) => !Fe.deletedAt && Fe.name.toLowerCase() === Y.toLowerCase()
    ), ee = f.artifacts.some(
      (Fe) => Fe.chatId === a.chatId && Fe.promptId === a.promptId && !!Fe.viewer
    ) || /(?:store_uuid|render_panels|zarrviewer|ome[-_.]?zarr)/i.test(k) ? ["zarrviewer"] : [], X = M ? {
      ...M,
      description: Z,
      requiredCapabilities: ee,
      currentVersion: M.currentVersion + 1,
      versions: [...M.versions, {
        version: M.currentVersion + 1,
        code: k,
        codeHash: P,
        executionId: a.id,
        createdAt: oe()
      }],
      updatedAt: oe()
    } : {
      id: Ee(),
      workspaceId: f.workspace.id,
      name: Y,
      description: Z,
      requiredCapabilities: ee,
      inputContract: Ha(k),
      parameters: [],
      currentVersion: 1,
      versions: [{
        version: 1,
        code: k,
        codeHash: P,
        executionId: a.id,
        createdAt: oe()
      }],
      createdAt: oe(),
      updatedAt: oe()
    };
    X.inputContract = Ha(k);
    const Ve = _.current;
    if (Ve) {
      const Fe = {
        ...Ve,
        methods: M ? Ve.methods.map((qt) => qt.id === X.id ? X : qt) : [...Ve.methods, X]
      };
      _.current = Fe, S(Fe);
    }
    await js(X), se(`Saved ${X.name} version ${X.currentVersion}`);
  }
  async function dl(a, f) {
    var w, x;
    const g = _.current;
    if (g)
      try {
        const j = Oy(a, f, g.executions, g.evidence), k = tf(
          [a],
          [f],
          {
            chatId: a.chatId,
            promptId: a.promptId
          }
        ) || a.title || f.name.replace(/\.png$/i, "") || "Zarr render", P = (w = await c.askText(
          "Method filename",
          `${Ut(k)}-analysis.py`,
          "The analysis, render recipe, PNG, and provenance will be saved together."
        )) == null ? void 0 : w.trim();
        if (!P) return;
        const B = `${Ut(P.replace(/\.py$/i, ""))}.py`, L = (x = await c.askText(
          "Method title",
          k,
          "Suggested from the rendered image or gallery title."
        )) == null ? void 0 : x.trim();
        if (!L) return;
        const U = Ut(B.replace(/\.py$/i, "").replace(/-analysis$/i, "")), Y = g.methods.find(
          (ie) => !ie.deletedAt && ie.name.toLowerCase() === B.toLowerCase()
        ), Z = ((Y == null ? void 0 : Y.currentVersion) || 0) + 1, M = await en(j.code), ee = Y ? {
          ...Y,
          description: L,
          currentVersion: Z,
          inputContract: Ha(j.code),
          versions: [...Y.versions, {
            version: Z,
            code: j.code,
            codeHash: M,
            executionId: j.execution.id,
            renderRecipe: j.recipe,
            createdAt: oe()
          }],
          updatedAt: oe()
        } : {
          id: Ee(),
          workspaceId: g.workspace.id,
          name: B,
          description: L,
          currentVersion: Z,
          inputContract: Ha(j.code),
          parameters: [],
          versions: [{
            version: Z,
            code: j.code,
            codeHash: M,
            executionId: j.execution.id,
            renderRecipe: j.recipe,
            createdAt: oe()
          }],
          createdAt: oe(),
          updatedAt: oe()
        }, X = new TextEncoder().encode(`${JSON.stringify(j.recipe, null, 2)}
`), Ve = new TextEncoder().encode(`${JSON.stringify(j.manifest, null, 2)}
`), Me = [
          {
            name: `${U}-v${Z}-render-recipe.json`,
            type: "application/json",
            data: X
          },
          {
            name: `${U}-v${Z}-evidence-manifest.json`,
            type: "application/json",
            data: Ve
          },
          {
            name: `${U}-v${Z}.zip`,
            type: "application/zip",
            data: j.archive
          }
        ], ht = [];
        for (const ie of Me) {
          const Ge = ie.data.buffer.slice(
            ie.data.byteOffset,
            ie.data.byteOffset + ie.data.byteLength
          );
          ht.push({
            id: Ee(),
            workspaceId: g.workspace.id,
            chatId: a.chatId,
            name: ie.name,
            logicalPath: `${g.workspace.rootPath}/chats/${a.chatId}/outputs/render-bundles/${ie.name}`,
            type: ie.type,
            size: ie.data.byteLength,
            sha256: await en(Ge),
            source: "result",
            state: "ready",
            data: Ge,
            createdAt: oe()
          });
        }
        const Fe = _.current;
        if (!Fe) return;
        const qt = {
          ...Fe,
          methods: Y ? Fe.methods.map((ie) => ie.id === ee.id ? ee : ie) : [...Fe.methods, ee]
        };
        _.current = qt, S(qt), await js(ee), It(ht), Vr(`${U}-v${Z}.zip`, j.archive, "application/zip"), se(
          `Saved ${ee.name} version ${Z}, render recipe, provenance manifest, PNG, and downloadable ZIP`
        );
      } catch (j) {
        se(`Could not save analysis + render: ${String(j)}`);
      }
  }
  async function es(a) {
    const f = _.current;
    if (!(f != null && f.workspace.activeChatId)) return;
    qn("chat");
    const g = a.versions.find((j) => j.version === a.currentVersion);
    if (!g) return;
    let w;
    try {
      w = Es(g.code, f.files);
    } catch (j) {
      se(`Cannot bind ${a.name}: ${String(j)}`);
      return;
    }
    _e(!0), Lt.current.clear(), await i.beginTurn();
    const x = Ee();
    Bt(f.workspace.activeChatId, {
      id: x,
      role: "user",
      content: `Run saved method ${a.name} version ${a.currentVersion}` + (w.bindings.length ? ` with workspace input binding ${w.bindings.map((j) => `${j.from} → ${j.to}`).join(", ")}` : ""),
      createdAt: oe()
    });
    try {
      const { renderResult: j } = await Fr(
        a,
        g,
        w.code,
        f.workspace.activeChatId,
        x,
        { methodId: a.id }
      );
      se(
        j ? `Ran ${a.name} locally and rendered its PNG gallery` : `Ran ${a.name} locally`
      );
    } catch (j) {
      se(`Could not complete ${a.name}: ${String(j)}`);
    } finally {
      _e(!1);
    }
  }
  async function ts(a) {
    var x;
    const f = (x = await c.askText("Rename method", a.name)) == null ? void 0 : x.trim();
    if (!f) return;
    const g = { ...a, name: `${Ut(f.replace(/\.py$/i, ""))}.py`, updatedAt: oe() }, w = _.current;
    if (w) {
      const j = {
        ...w,
        methods: w.methods.map((k) => k.id === a.id ? g : k)
      };
      _.current = j, S(j);
    }
    js(g);
  }
  async function Js(a) {
    if (!await c.confirm(
      "Delete saved method?",
      `${a.name} and all of its versions will be moved out of the active workspace.`,
      "Delete method",
      !0
    ))
      return;
    const f = _.current;
    if (!f) return;
    const g = { ...a, deletedAt: oe(), updatedAt: oe() }, w = {
      ...f,
      methods: f.methods.map((x) => x.id === a.id ? g : x)
    };
    _.current = w, S(w), Ir((x) => {
      const j = new Set(x);
      return j.delete(a.id), j;
    }), await js(g), se(`Moved method ${a.name} to trash`);
  }
  function Bi(a) {
    Ir((f) => {
      const g = new Set(f);
      return g.has(a) ? g.delete(a) : g.add(a), g;
    });
  }
  function Gn(a) {
    fo((f) => {
      const g = new Set(f);
      return g.has(a) ? g.delete(a) : g.add(a), g;
    });
  }
  function Gs(a) {
    lr((f) => {
      const g = new Set(f);
      return g.has(a) ? g.delete(a) : g.add(a), g;
    });
  }
  function ns(a) {
    const f = a.filter((w) => rn(w.name)).map((w) => w.id), g = f.length > 0 && f.every((w) => yn.has(w));
    lr((w) => {
      const x = new Set(w);
      return f.forEach((j) => {
        g ? x.delete(j) : x.add(j);
      }), x;
    });
  }
  async function Xs(a) {
    const f = _.current;
    if (!f) return;
    const g = new Set(a), w = f.files.filter(
      (L) => g.has(L.id) && L.source === "result" && !L.deletedAt
    );
    if (!w.length) return;
    const x = w.slice(0, 5).map((L) => L.name), j = w.length - x.length, k = w.length === 1 ? `${w[0].name} will be hidden, while its provenance record remains intact.` : [
      `${w.length} outputs will be moved to workspace trash. Their provenance records remain intact.`,
      x.join(", ") + (j > 0 ? `, and ${j} more` : "")
    ].join(`

`);
    if (!await c.confirm(
      w.length === 1 ? "Move output to trash?" : `Move ${w.length} outputs to trash?`,
      k,
      "Move to trash",
      !0
    )) return;
    const P = oe(), B = Vy(
      f,
      w.map((L) => L.id),
      P
    );
    _.current = B, S(B), lr((L) => {
      const U = new Set(L);
      return w.forEach((Y) => U.delete(Y.id)), U;
    }), Vs && w.some((L) => L.id === Vs) && Ke(null), await Promise.all(
      B.files.filter((L) => g.has(L.id) && L.deletedAt === P).map(Ai)
    ), se(
      w.length === 1 ? `Moved ${w[0].name} to workspace trash` : `Moved ${w.length} outputs to workspace trash`
    );
  }
  async function So() {
    var Y, Z;
    const a = _.current;
    if (!a) return;
    const f = a.methods.filter((M) => !M.deletedAt && mn.has(M.id));
    if (f.length < 2) {
      se("Select at least two methods to combine");
      return;
    }
    const g = Ut(f.map((M) => M.name.replace(/\.py$/i, "")).join("-")), w = (Y = await c.askText(
      "Pipeline name",
      g,
      "The selected methods will become isolated, ordered pipeline steps."
    )) == null ? void 0 : Y.trim();
    if (!w) return;
    const x = Ut(w);
    let j = x, k = 2;
    for (; a.pipelines.some(
      (M) => !M.deletedAt && M.name.toLowerCase() === j.toLowerCase()
    ); )
      j = `${x}-${k}`, k += 1;
    const P = ((Z = await c.askText(
      "Pipeline description",
      `Runs ${f.map((M) => M.name).join(", ")} in sequence`
    )) == null ? void 0 : Z.trim()) || "", B = oe(), L = {
      id: Ee(),
      workspaceId: a.workspace.id,
      name: j,
      description: P,
      version: 1,
      steps: f.map((M) => ({
        id: Ee(),
        methodId: M.id,
        methodVersion: M.currentVersion,
        name: M.name,
        inputBindings: {},
        parameters: {}
      })),
      createdAt: B,
      updatedAt: B
    }, U = { ...a, pipelines: [...a.pipelines, L] };
    _.current = U, S(U), Ir(/* @__PURE__ */ new Set()), await eu(L), se(`Created pipeline ${L.name} with ${f.length} isolated steps`);
  }
  async function Ur(a) {
    const f = _.current;
    if (!(f != null && f.workspace.activeChatId) || me) return;
    qn("chat"), _e(!0);
    const g = performance.now(), w = f.workspace.activeChatId, x = Ee();
    Bt(w, {
      id: x,
      role: "user",
      content: `Run pipeline ${a.name} version ${a.version}`,
      createdAt: oe()
    });
    try {
      let j = f.files.filter(
        (P) => P.source !== "result" && P.state === "ready" && !P.deletedAt
      ), k = 0;
      for (let P = 0; P < a.steps.length; P += 1) {
        const B = a.steps[P], U = _.current.methods.find((X) => X.id === B.methodId && !X.deletedAt), Y = U == null ? void 0 : U.versions.find((X) => X.version === B.methodVersion);
        if (!U || !Y) throw new Error(`Pipeline step ${B.name} is unavailable`);
        se(`Pipeline ${a.name}: step ${P + 1} of ${a.steps.length}`), await i.beginTurn(), Lt.current.clear();
        const Z = Es(Y.code, j);
        (await Fr(
          U,
          Y,
          Z.code,
          w,
          x,
          { methodId: U.id, pipelineId: a.id }
        )).renderResult && (k += 1);
        const ee = _.current.files.filter(
          (X) => X.source === "result" && X.executionId && _.current.executions.some(
            (Ve) => Ve.id === X.executionId && Ve.promptId === x
          ) && !X.deletedAt
        );
        j = [...j, ...ee], P < a.steps.length - 1 && await i.syncInputs(j);
      }
      await i.syncInputs(f.files.filter(
        (P) => P.source !== "result" && P.state === "ready" && !P.deletedAt
      )), se(
        `Pipeline ${a.name} completed` + (k ? ` and rendered ${k} PNG ${k === 1 ? "image" : "images"}` : "")
      );
    } catch (j) {
      Bt(w, {
        id: Ee(),
        role: "assistant",
        content: `Pipeline stopped: ${String(j)}`,
        kind: "error",
        activity: "worked",
        durationMs: performance.now() - g,
        createdAt: oe()
      }), se(`Pipeline ${a.name} failed`);
    } finally {
      _e(!1);
    }
  }
  async function Ys(a) {
    if (!await c.confirm(
      "Delete pipeline?",
      `${a.name} will be moved to workspace trash. Its source methods remain available.`,
      "Delete pipeline",
      !0
    )) return;
    const f = _.current;
    if (!f) return;
    const g = { ...a, deletedAt: oe(), updatedAt: oe() }, w = {
      ...f,
      pipelines: f.pipelines.map((x) => x.id === a.id ? g : x)
    };
    _.current = w, S(w), await eu(g), se(`Moved pipeline ${a.name} to workspace trash`);
  }
  async function Pt(a) {
    const f = _.current;
    if (!f || !o.canUpload) return;
    const g = new Set(a.steps.map((k) => k.methodId)), w = {
      format: "nl.bioimaging.analysis.pipeline.v1",
      exportedAt: oe(),
      pipeline: a,
      methods: f.methods.filter((k) => !k.deletedAt && g.has(k.id))
    }, x = `${Ut(a.name)}.oa-pipeline.json`, j = await o.uploadPipelineTemplate(
      x,
      new TextEncoder().encode(JSON.stringify(w, null, 2))
    );
    fe((k) => [...k, j]), se(`Published pipeline template as FileAnnotation ${j.annotation_id}`);
  }
  async function hr(a) {
    const f = _.current;
    if (f)
      try {
        const g = JSON.parse(
          new TextDecoder().decode(await o.downloadPipelineTemplate(a))
        );
        if (g.format !== "nl.bioimaging.analysis.pipeline.v1" || !g.pipeline || !Array.isArray(g.methods)) throw new Error("Unsupported pipeline template");
        const w = /* @__PURE__ */ new Map(), x = g.methods.map((P) => {
          const B = Ee();
          return w.set(P.id, B), {
            ...P,
            id: B,
            workspaceId: f.workspace.id,
            name: `${P.name.replace(/\.py$/i, "")}-template.py`,
            createdAt: oe(),
            updatedAt: oe()
          };
        }), j = {
          ...g.pipeline,
          id: Ee(),
          workspaceId: f.workspace.id,
          name: `${g.pipeline.name}-template`,
          steps: g.pipeline.steps.map((P) => ({
            ...P,
            id: Ee(),
            methodId: w.get(P.methodId) || P.methodId
          })),
          createdAt: oe(),
          updatedAt: oe()
        };
        await Promise.all([...x.map(js), eu(j)]);
        const k = {
          ...f,
          methods: [...f.methods, ...x],
          pipelines: [...f.pipelines, j]
        };
        _.current = k, S(k), se(`Imported pipeline template ${j.name}`);
      } catch (g) {
        se(`Pipeline template import failed: ${String(g)}`);
      }
  }
  async function rs(a) {
    const f = _.current;
    if (!f || me) return;
    const g = T.filter((j) => j.id !== f.workspace.id);
    if (!g.length) {
      se("Open the destination OMERO objects in Analysis once before batch execution");
      return;
    }
    if (!await c.confirm(
      "Batch-run pipeline?",
      `${a.name} will run locally on the compatible browser workspaces for: ${g.map((j) => `${j.objectType} ${j.objectId} (${j.name})`).join(", ")}. Incompatible workspaces will be skipped.`,
      "Run compatible workspaces"
    )) return;
    _e(!0);
    const w = [], x = [];
    try {
      for (const j of g) {
        const k = await Pi(j.id);
        if (!k) continue;
        const P = [];
        try {
          for (const L of a.steps) {
            const U = f.methods.find((Z) => Z.id === L.methodId && !Z.deletedAt), Y = U == null ? void 0 : U.versions.find((Z) => Z.version === L.methodVersion);
            if (!U || !Y) throw new Error(`Missing ${L.name}`);
            P.push({
              method: U,
              version: Y,
              code: Es(Y.code, k.files).code
            });
          }
        } catch {
          x.push(j.name);
          continue;
        }
        const B = performance.now();
        try {
          const L = tl(k.workspace.id, `${a.name} batch run`);
          k.workspace = { ...k.workspace, activeChatId: L.id, updatedAt: oe() }, k.chats = [...k.chats, L], _.current = k, S(k), await i.syncInputs(k.files.filter(
            (Y) => Y.source !== "result" && Y.state === "ready" && !Y.deletedAt
          ));
          const U = Ee();
          Bt(L.id, {
            id: U,
            role: "user",
            content: `Batch run pipeline ${a.name} on ${j.objectType} ${j.objectId}`,
            createdAt: oe()
          });
          for (const Y of P)
            await i.beginTurn(), Lt.current.clear(), await Fr(
              Y.method,
              Y.version,
              Y.code,
              L.id,
              U
            );
          await rr(_.current), w.push(j.name);
        } catch (L) {
          const U = _.current;
          if ((U == null ? void 0 : U.workspace.id) === k.workspace.id) {
            const Y = U.chats.find((Z) => Z.id === U.workspace.activeChatId);
            Y && (Bt(Y.id, {
              id: Ee(),
              role: "assistant",
              kind: "error",
              content: `Batch pipeline failed for this object: ${String(L)}`,
              activity: "worked",
              durationMs: performance.now() - B,
              createdAt: oe()
            }), await rr(_.current));
          }
          x.push(j.name);
        }
      }
    } finally {
      _.current = f, S(f), await i.syncInputs(f.files.filter(
        (j) => j.source !== "result" && j.state === "ready" && !j.deletedAt
      )), _e(!1);
    }
    se(
      `Batch pipeline completed for ${w.length} workspace(s)` + (x.length ? `; incompatible: ${x.join(", ")}` : "")
    );
  }
  function mr(a) {
    const f = a || Array.from(mn);
    if (!f.length) {
      se("Select one or more methods to copy");
      return;
    }
    Ir(new Set(f));
    const g = T.find((w) => w.id !== ($e == null ? void 0 : $e.id));
    if (!g) {
      se("Open another OMERO Dataset, Screen, Plate, or Image once before copying methods to it");
      return;
    }
    zs(g.id), Un(!0);
  }
  async function pl() {
    const a = _.current;
    if (!a || !Nn) return;
    const f = await Pi(Nn);
    if (!f) {
      se("The destination workspace is no longer available");
      return;
    }
    const g = a.methods.filter((P) => !P.deletedAt && mn.has(P.id));
    if (!g.length) return;
    const w = /* @__PURE__ */ new Map();
    for (const P of g) {
      const B = P.versions.find((L) => L.version === P.currentVersion);
      if (B)
        try {
          const L = Es(B.code, f.files);
          w.set(
            P.id,
            Object.fromEntries(L.bindings.map((U) => [U.from, U.to]))
          );
        } catch (L) {
          se(`Copy blocked by compatibility preflight for ${P.name}: ${String(L)}`);
          return;
        }
    }
    const x = new Set(f.methods.filter((P) => !P.deletedAt).map((P) => P.name.toLowerCase())), j = [];
    for (const P of g) {
      const B = P.name.replace(/\.py$/i, "");
      let L = P.name, U = 2;
      for (; x.has(L.toLowerCase()); )
        L = `${B}-copy-${U}.py`, U += 1;
      x.add(L.toLowerCase());
      const Y = oe();
      j.push({
        ...P,
        id: Ee(),
        workspaceId: f.workspace.id,
        name: L,
        description: `${P.description}${P.description ? " · " : ""}Copied from ${a.workspace.name}`,
        workspaceBindings: {
          ...P.workspaceBindings || {},
          [f.workspace.id]: w.get(P.id) || {}
        },
        versions: P.versions.map((Z) => ({
          ...Z,
          executionId: ""
        })),
        createdAt: Y,
        updatedAt: Y
      });
    }
    if (await Promise.all(j.map(js)), f.workspace.id === a.workspace.id) {
      const P = { ...a, methods: [...a.methods, ...j] };
      _.current = P, S(P);
    }
    Un(!1);
    const k = T.find((P) => P.id === f.workspace.id);
    se(
      `Copied ${j.length} method${j.length === 1 ? "" : "s"} to ${(k == null ? void 0 : k.name) || "the destination workspace"}. When run there, the methods use that workspace's current inputs.`
    );
  }
  function Vr(a, f, g) {
    const w = (f instanceof Uint8Array, f), x = URL.createObjectURL(new Blob([w], { type: g })), j = document.createElement("a");
    j.href = x, j.download = a, j.click(), setTimeout(() => URL.revokeObjectURL(x), 1e3);
  }
  function bo(a) {
    a.data && Vr(a.name, a.data, a.type);
  }
  function jo(a) {
    const f = a.versions.find((g) => g.version === a.currentVersion);
    f && Vr(a.name, new TextEncoder().encode(f.code), "text/x-python");
  }
  async function Eo(a) {
    if (await c.confirm(
      "Attach result to OMERO?",
      `${a.name} will be uploaded and linked directly to the selected OMERO object.`,
      "Attach result"
    ))
      try {
        const f = await o.attach(a);
        se(`Attached ${f.name} as FileAnnotation ${f.annotation_id}`);
      } catch (f) {
        se(`Attach failed: ${String(f)}`);
      }
  }
  async function ei() {
    var f;
    const a = _.current;
    if (!a) throw new Error("Workspace is not ready");
    return Xm(
      a,
      ((f = r.context) == null ? void 0 : f.max_snapshot_bytes) ?? nf
    );
  }
  async function fl() {
    try {
      const a = await ei();
      Vr(a.filename, a.data, "application/zip"), se(
        a.omittedLocalInputs.length ? `Workspace downloaded; omitted local inputs: ${a.omittedLocalInputs.join(", ")}` : "Complete workspace downloaded"
      );
    } catch (a) {
      se(`Workspace export failed: ${String(a)}`);
    }
  }
  async function hl() {
    if (o.canUpload)
      try {
        const a = await ei();
        if (a.omittedLocalInputs.length && !await c.confirm(
          "Save snapshot without oversized local inputs?",
          `The following files will be omitted and required again after restore: ${a.omittedLocalInputs.join(", ")}`,
          "Save without files"
        )) return;
        const f = await o.uploadSnapshot(a.filename, a.data);
        z((g) => [...g, f]), se(`Saved workspace snapshot as FileAnnotation ${f.annotation_id}`);
      } catch (a) {
        se(`OMERO workspace snapshot failed: ${String(a)}`);
      }
  }
  async function ml(a) {
    var f;
    if (a)
      try {
        const g = ((f = r.context) == null ? void 0 : f.max_snapshot_bytes) ?? nf;
        if (a.size > g)
          throw new Error(
            `Workspace archive exceeds the configured ${Math.floor(g / 1024 / 1024)} MiB limit`
          );
        const w = await Kp(await a.arrayBuffer(), r.context);
        if (r.context && (w.workspace.objectType !== r.context.object_type || w.workspace.objectId !== r.context.object_id))
          throw new Error("Workspace snapshot belongs to a different OMERO object");
        await rr(w);
        const x = await Ko(w);
        S(x), _.current = x, E(await ao(r.context)), W(await Ii(r.context)), await An(x.files, "Imported workspace restored");
      } catch (g) {
        se(`Workspace import failed: ${String(g)}`);
      } finally {
        Wn.current && (Wn.current.value = "");
      }
  }
  function ti() {
    $e && At({ ...$e, plotCsv: !$e.plotCsv, updatedAt: oe() });
  }
  function qi(a) {
    const f = [];
    return a.source === "local" && f.push({ label: "Rename", run: () => void Pn(a) }), (a.state === "failed" || a.state === "missing") && a.annotationId && f.push({ label: "Retry download", run: () => void Vi(a.id) }), a.state === "missing" && a.source === "local" && f.push({
      label: "Reselect file",
      run: () => {
        var g;
        return (g = document.getElementById(`reselect-${a.id}`)) == null ? void 0 : g.click();
      }
    }), f.push({
      label: "Remove from workspace",
      danger: !0,
      run: () => void Ks(a.id)
    }), f;
  }
  function Zi(a) {
    const f = yn.has(a.id) && yn.size > 1 ? Array.from(yn) : [a.id];
    return [
      { label: "Rename", run: () => void Pn(a) },
      { label: "Download", run: () => bo(a) },
      ...o.canUpload ? [{ label: "Attach to OMERO", run: () => void Eo(a) }] : [],
      {
        label: f.length > 1 ? `Delete ${f.length} selected outputs` : "Delete output",
        danger: !0,
        run: () => void Xs(f)
      }
    ];
  }
  function Hi(a) {
    return [
      { label: "Run", run: () => void es(a) },
      { label: "Rename", run: () => void ts(a) },
      { label: "Download", run: () => jo(a) },
      { label: "Copy to another workspace…", run: () => mr([a.id]) },
      { label: "Delete method", danger: !0, run: () => void Js(a) }
    ];
  }
  if (!y || !$e || !dt)
    return /* @__PURE__ */ d.jsx("main", { className: "app-shell", children: /* @__PURE__ */ d.jsx("div", { className: "boot-message", children: Ts }) });
  const ni = ur.quota ? Math.round(ur.usage / ur.quota * 100) : 0, yl = ru(
    ge,
    y.files,
    tn
  ), Ki = [
    ...(ge == null ? void 0 : ge.workflows) || [],
    ...(ge == null ? void 0 : ge.applications) || []
  ].reduce((a, f) => a + f.skills.length, 0) + ((Pe == null ? void 0 : Pe.skills.length) || 0), vl = y.notebooks.find(
    (a) => a.id === ae
  ) || y.notebooks[0] || null, gl = (() => {
    var f, g;
    const a = Cr;
    if (!a || a.kind === "workspace")
      return {
        kind: "workspace",
        title: $e.name,
        description: "Browser-local Analysis Workspace for the current OMERO context.",
        metadata: {
          "OMERO object": `${$e.objectType} ${$e.objectId}`,
          Chats: Nt.length,
          Inputs: dr.length,
          Results: mo.length,
          Methods: pr.length,
          Pipelines: y.pipelines.filter((w) => !w.deletedAt).length,
          Notebooks: y.notebooks.length,
          Updated: new Date($e.updatedAt).toLocaleString()
        }
      };
    if (a.kind === "file") {
      const w = y.files.find(
        (x) => x.id === a.id && !x.deletedAt
      );
      if (w) return { kind: "file", title: w.name, file: w };
    }
    if (a.kind === "chat") {
      const w = Nt.find((x) => x.id === a.id);
      if (w) return {
        kind: "chat",
        title: w.title,
        description: w.archived ? "Archived Chat conversation." : "Active Chat conversation.",
        metadata: {
          Messages: w.messages.length,
          "Pinned messages": ((f = w.pinnedMessageIds) == null ? void 0 : f.length) || 0,
          Updated: new Date(w.updatedAt).toLocaleString()
        },
        content: [
          `# ${w.title}`,
          ...w.summary ? ["", "## Conversation summary", "", w.summary] : [],
          ...w.messages.filter((x) => x.kind !== "execution").flatMap((x) => [
            "",
            `## ${x.role === "user" ? "User" : "Assistant"}`,
            "",
            x.content
          ])
        ].join(`
`),
        language: "markdown"
      };
    }
    if (a.kind === "method") {
      const w = y.methods.find(
        (j) => j.id === a.id && !j.deletedAt
      ), x = w == null ? void 0 : w.versions.find(
        (j) => j.version === w.currentVersion
      );
      if (w) return {
        kind: "method",
        title: w.name,
        description: w.description || "Reusable Python analysis Method.",
        metadata: {
          Version: w.currentVersion,
          "Saved versions": w.versions.length,
          Capabilities: ((g = w.requiredCapabilities) == null ? void 0 : g.join(", ")) || "Browser Python",
          Updated: new Date(w.updatedAt).toLocaleString()
        },
        content: (x == null ? void 0 : x.code) || "",
        language: "python"
      };
    }
    if (a.kind === "pipeline") {
      const w = y.pipelines.find(
        (x) => x.id === a.id && !x.deletedAt
      );
      if (w) return {
        kind: "pipeline",
        title: w.name,
        description: w.description || "Ordered multi-step Method execution.",
        metadata: {
          Version: w.version,
          Steps: w.steps.length,
          Updated: new Date(w.updatedAt).toLocaleString()
        },
        content: JSON.stringify(w.steps, null, 2)
      };
    }
    if (a.kind === "notebook") {
      const w = y.notebooks.find(
        (x) => x.id === a.id
      );
      if (w) return {
        kind: "notebook",
        title: w.name,
        description: "Read-only Python nbformat-4 Notebook.",
        metadata: {
          Cells: w.document.cells.length,
          "Attached versions": w.attachmentIds.length,
          "Selected inputs": w.selectedDataFileIds.length,
          Updated: new Date(w.updatedAt).toLocaleString()
        },
        notebook: w
      };
    }
    if (a.kind === "zarr") {
      const w = re.find((x) => x.id === a.id);
      if (w) return {
        kind: "zarr",
        title: w.name,
        description: "OME-Zarr source served by the installed ZarrViewer. It is not downloaded into this browser Workspace.",
        metadata: {
          Screen: w.contextName,
          "OMERO source": `${w.objectType} ${w.objectId}`,
          "OME-Zarr name": w.zarrName,
          ...w.plateRows && w.plateColumns ? {
            "Plate size": `${w.plateRows * w.plateColumns}-well (${w.plateRows} × ${w.plateColumns})`,
            "Wells with data": w.wellsWithData,
            "Image fields": w.fieldsWithData
          } : {},
          "Store UUID": w.storeUuid
        }
      };
    }
    if (a.kind === "folder") {
      const w = {
        inputs: {
          kind: "folder",
          title: "Input",
          description: "Source data available to Chat, Methods, Pipelines, and Notebooks.",
          metadata: {
            "Downloaded inputs": dr.length,
            "ZarrViewer sources": re.length
          }
        },
        chat: {
          kind: "folder",
          title: "Chat",
          description: "Autosaved conversations and readable transcripts.",
          metadata: { Items: Nt.length }
        },
        "chat-results": {
          kind: "folder",
          title: "Chat results",
          description: "Files generated directly by Chat analyses.",
          metadata: { Items: Us.length }
        },
        "methods-results": {
          kind: "folder",
          title: "Methods results",
          description: "Files generated by reusable Method runs.",
          metadata: { Items: Ds.length }
        },
        "pipelines-results": {
          kind: "folder",
          title: "Pipelines results",
          description: "Files generated while running Pipelines.",
          metadata: { Items: Fs.length }
        },
        "notebooks-results": {
          kind: "folder",
          title: "Notebooks results",
          description: "Files generated by run-only Notebooks.",
          metadata: { Items: Ls.length }
        },
        methods: {
          kind: "folder",
          title: "Methods",
          description: "Reusable Python analyses.",
          metadata: { Items: pr.length }
        },
        pipelines: {
          kind: "folder",
          title: "Pipelines",
          description: "Ordered multi-step Method analyses.",
          metadata: {
            Items: y.pipelines.filter((x) => !x.deletedAt).length
          }
        },
        notebooks: {
          kind: "folder",
          title: "Notebooks",
          description: "Uploaded or OMERO-attached run-only Notebooks.",
          metadata: { Items: y.notebooks.length }
        }
      };
      if (w[a.id]) return w[a.id];
    }
    return {
      kind: "workspace",
      title: $e.name,
      description: "Select any Workspace item to inspect it."
    };
  })(), wl = new Set(
    y.chats.flatMap(
      (a) => a.messages.flatMap(
        (f) => (f.workflowSkills || []).map((g) => g.sha256)
      )
    )
  ), Qi = () => /* @__PURE__ */ d.jsxs("details", { className: "workspace-actions", children: [
    /* @__PURE__ */ d.jsx("summary", { children: "Workspace actions" }),
    /* @__PURE__ */ d.jsxs("div", { children: [
      /* @__PURE__ */ d.jsx("button", { onClick: () => void In($e), children: "Rename workspace" }),
      /* @__PURE__ */ d.jsx("button", { onClick: () => void fl(), children: "Download workspace" }),
      /* @__PURE__ */ d.jsx("button", { onClick: () => {
        var a;
        return (a = Wn.current) == null ? void 0 : a.click();
      }, children: "Import workspace" }),
      o.canUpload && /* @__PURE__ */ d.jsx("button", { onClick: () => void hl(), children: "Save snapshot to OMERO" })
    ] })
  ] }), Wr = (a, f, g) => {
    const w = g.filter((k) => rn(k.name)), x = w.length > 0 && w.every((k) => yn.has(k.id)), j = g.filter((k) => yn.has(k.id));
    return /* @__PURE__ */ d.jsxs("details", { className: "browser-subfolder result-subfolder", children: [
      /* @__PURE__ */ d.jsxs("summary", { onClick: () => ut({ kind: "folder", id: f }), children: [
        /* @__PURE__ */ d.jsx(Qe, { name: "chevron", className: "folder-chevron" }),
        /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
        /* @__PURE__ */ d.jsx("strong", { children: a }),
        /* @__PURE__ */ d.jsx("small", { children: g.length })
      ] }),
      g.length > 0 && /* @__PURE__ */ d.jsxs("div", { className: "output-selection-toolbar", children: [
        /* @__PURE__ */ d.jsxs("span", { children: [
          j.length,
          " selected"
        ] }),
        /* @__PURE__ */ d.jsx("button", { onClick: () => ns(g), children: x ? "Clear" : "Select all" }),
        /* @__PURE__ */ d.jsx(
          "button",
          {
            disabled: !j.length,
            onClick: () => void Xs(j.map((k) => k.id)),
            children: "Delete selected"
          }
        )
      ] }),
      /* @__PURE__ */ d.jsxs("ul", { className: "browser-list result-browser-list", children: [
        w.map((k) => /* @__PURE__ */ d.jsxs(
          "li",
          {
            className: `browser-row output-row ${yn.has(k.id) ? "selected" : ""}`,
            onClick: () => Ke(k.id),
            onDoubleClick: () => bo(k),
            onContextMenu: (P) => it(P, k.name, Zi(k)),
            children: [
              /* @__PURE__ */ d.jsx(
                "input",
                {
                  className: "output-selector",
                  type: "checkbox",
                  "aria-label": `Select output ${k.name}`,
                  checked: yn.has(k.id),
                  onClick: (P) => P.stopPropagation(),
                  onChange: () => Gs(k.id),
                  onDoubleClick: (P) => P.stopPropagation()
                }
              ),
              /* @__PURE__ */ d.jsx(Qe, { name: k.type.startsWith("image/") ? "image" : "file" }),
              /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                /* @__PURE__ */ d.jsx("strong", { children: k.name }),
                /* @__PURE__ */ d.jsx("small", { children: "double-click to download" })
              ] }),
              /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: Ka(k.size) }),
              /* @__PURE__ */ d.jsx(
                "button",
                {
                  className: "browser-more",
                  "aria-label": `Actions for ${k.name}`,
                  onClick: (P) => it(P, k.name, Zi(k)),
                  children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                }
              )
            ]
          },
          k.id
        )),
        !w.length && /* @__PURE__ */ d.jsx("li", { className: "browser-empty", children: g.length ? "No matching results" : "No results yet" })
      ] })
    ] });
  };
  return /* @__PURE__ */ d.jsxs("main", { className: "app-shell", children: [
    c.element,
    /* @__PURE__ */ d.jsxs("header", { className: "workspace-header", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "header-brand", children: [
        /* @__PURE__ */ d.jsx("h1", { children: "OMERO.Analysis" }),
        /* @__PURE__ */ d.jsx("p", { children: $e.rootPath })
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "header-actions", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          className: h === "settings" ? "active" : "",
          onClick: () => qn("settings"),
          children: "Settings"
        }
      ) })
    ] }),
    h === "chat" && Ms && /* @__PURE__ */ d.jsx("div", { className: "dialog-backdrop", role: "presentation", children: /* @__PURE__ */ d.jsxs("section", { className: "method-transfer-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "method-transfer-title", children: [
      /* @__PURE__ */ d.jsx("h2", { id: "method-transfer-title", children: "Copy methods to another workspace" }),
      /* @__PURE__ */ d.jsx("p", { children: "The copied methods keep their code and versions. When run in the destination, they automatically use that workspace’s current input files." }),
      /* @__PURE__ */ d.jsxs("label", { children: [
        "Destination workspace",
        /* @__PURE__ */ d.jsx("select", { value: Nn, onChange: (a) => zs(a.target.value), children: T.filter((a) => a.id !== $e.id).map((a) => /* @__PURE__ */ d.jsxs("option", { value: a.id, children: [
          a.objectType,
          " ",
          a.objectId,
          " — ",
          a.name
        ] }, a.id)) })
      ] }),
      /* @__PURE__ */ d.jsx("small", { children: "A destination appears after you have opened that OMERO object in Analysis at least once." }),
      /* @__PURE__ */ d.jsxs("div", { className: "dialog-actions", children: [
        /* @__PURE__ */ d.jsx("button", { onClick: () => Un(!1), children: "Cancel" }),
        /* @__PURE__ */ d.jsx("button", { disabled: !Nn, onClick: () => void pl(), children: "Copy selected methods" })
      ] })
    ] }) }),
    /* @__PURE__ */ d.jsxs(
      "div",
      {
        className: "workspace artifact-visible",
        style: {
          "--explorer-width": `${$s}px`,
          "--artifact-width": `${Nr}px`
        },
        children: [
          /* @__PURE__ */ d.jsxs(
            "aside",
            {
              className: "workspace-tree",
              onDragOver: (a) => {
                a.preventDefault(), a.dataTransfer.dropEffect = "copy";
              },
              onDrop: (a) => {
                a.preventDefault(), Hs(a.dataTransfer.files);
              },
              children: [
                /* @__PURE__ */ d.jsxs(
                  "div",
                  {
                    className: "file-browser-heading",
                    onClick: () => ut({ kind: "workspace", id: $e.id }),
                    onContextMenu: (a) => it(a, $e.name, [
                      { label: "Add files", run: () => {
                        var f;
                        return (f = Bn.current) == null ? void 0 : f.click();
                      } },
                      { label: "New chat", run: () => void Xo() },
                      { label: "Rename current chat", run: () => void wo(dt) },
                      { label: "Rename workspace", run: () => void In($e) },
                      { label: "Refresh", run: () => void gn() }
                    ]),
                    children: [
                      /* @__PURE__ */ d.jsxs("div", { children: [
                        /* @__PURE__ */ d.jsx("h2", { children: "Workspace files" }),
                        /* @__PURE__ */ d.jsxs("small", { children: [
                          Ka(Qa(y)),
                          " · browser ",
                          ni || "?",
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ d.jsx(
                        "button",
                        {
                          className: "browser-more",
                          "aria-label": "Workspace actions",
                          title: "Workspace actions",
                          onClick: (a) => it(a, $e.name, [
                            { label: "Add files", run: () => {
                              var f;
                              return (f = Bn.current) == null ? void 0 : f.click();
                            } },
                            { label: "New chat", run: () => void Xo() },
                            { label: "Rename current chat", run: () => void wo(dt) },
                            { label: "Rename workspace", run: () => void In($e) },
                            { label: "Refresh", run: () => void gn() }
                          ]),
                          children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ d.jsxs("div", { className: "file-browser-toolbar", role: "toolbar", "aria-label": "Workspace file actions", children: [
                  /* @__PURE__ */ d.jsx(
                    "button",
                    {
                      title: "Up to OMERO object workspaces",
                      "aria-label": "Up to OMERO object workspaces",
                      disabled: Dn,
                      onClick: () => ar(!0),
                      children: /* @__PURE__ */ d.jsx(Qe, { name: "up" })
                    }
                  ),
                  /* @__PURE__ */ d.jsx("button", { title: "Add files", "aria-label": "Add files", onClick: () => {
                    var a;
                    return (a = Bn.current) == null ? void 0 : a.click();
                  }, children: /* @__PURE__ */ d.jsx(Qe, { name: "upload" }) }),
                  /* @__PURE__ */ d.jsx("button", { title: "Refresh workspace", "aria-label": "Refresh workspace", onClick: () => void gn(), children: /* @__PURE__ */ d.jsx(Qe, { name: "refresh" }) }),
                  /* @__PURE__ */ d.jsx(
                    "button",
                    {
                      title: "Collapse all folders",
                      "aria-label": "Collapse all folders",
                      onClick: () => cr({
                        chat: !1,
                        inputs: !1,
                        methods: !1,
                        pipelines: !1,
                        notebooks: !1,
                        trash: !1,
                        snapshots: !1
                      }),
                      children: /* @__PURE__ */ d.jsx(Qe, { name: "collapse" })
                    }
                  ),
                  /* @__PURE__ */ d.jsx("input", { ref: Bn, hidden: !0, type: "file", multiple: !0, onChange: (a) => void Hs(a.target.files) })
                ] }),
                /* @__PURE__ */ d.jsxs("label", { className: "explorer-search", children: [
                  /* @__PURE__ */ d.jsx("span", { className: "sr-only", children: "Search workspace files" }),
                  /* @__PURE__ */ d.jsx(
                    "input",
                    {
                      type: "search",
                      name: "workspace-search",
                      autoComplete: "off",
                      value: Bo,
                      placeholder: "Search files, methods, pipelines…",
                      onChange: (a) => zi(a.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ d.jsxs(
                  "div",
                  {
                    className: "browser-path",
                    title: Dn ? `OMERO/${$e.objectType}-${$e.objectId}` : $e.rootPath,
                    onDoubleClick: () => ar(!0),
                    children: [
                      /* @__PURE__ */ d.jsx(Qe, { name: "root" }),
                      /* @__PURE__ */ d.jsx("span", { children: Dn ? `OMERO/${$e.objectType}-${$e.objectId}` : $e.rootPath })
                    ]
                  }
                ),
                /* @__PURE__ */ d.jsxs("div", { className: "browser-columns", children: [
                  /* @__PURE__ */ d.jsx("span", { children: "Name" }),
                  /* @__PURE__ */ d.jsx("span", { children: "Size" })
                ] }),
                Dn ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
                  /* @__PURE__ */ d.jsxs("div", { className: "hierarchy-section", children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "OMERO hierarchy" }),
                    [...(J == null ? void 0 : J.parents) || [], ...(J == null ? void 0 : J.children) || []].map((a) => /* @__PURE__ */ d.jsxs(
                      "button",
                      {
                        disabled: !a.supported,
                        onClick: () => {
                          a.supported && window.location.assign(
                            `${r.tokenUrl.replace(/api\/context-token\/$/, "")}?type=${encodeURIComponent(a.type)}&id=${a.id}`
                          );
                        },
                        children: [
                          /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
                          /* @__PURE__ */ d.jsx("span", { children: a.name }),
                          /* @__PURE__ */ d.jsxs("small", { children: [
                            a.type,
                            " ",
                            a.id
                          ] })
                        ]
                      },
                      `${a.type}:${a.id}`
                    )),
                    !(J != null && J.parents.length) && !(J != null && J.children.length) && /* @__PURE__ */ d.jsx("p", { children: "No readable immediate OMERO relations." })
                  ] }),
                  /* @__PURE__ */ d.jsx("div", { className: "hierarchy-section-title", children: "Browser-local workspaces for this object" }),
                  /* @__PURE__ */ d.jsx("ul", { className: "browser-list workspace-list", children: A.map((a) => /* @__PURE__ */ d.jsxs(
                    "li",
                    {
                      className: ay(
                        a.id,
                        $e.id,
                        Li
                      ),
                      "aria-selected": a.id === (Li || $e.id),
                      onClick: () => po(a.id),
                      onDoubleClick: () => void ko(a.id),
                      onContextMenu: (f) => {
                        po(a.id), it(f, a.name, [
                          { label: "Open workspace", run: () => void ko(a.id) },
                          { label: "Rename workspace", run: () => void In(a) },
                          ...a.id !== $e.id ? [{
                            label: "Delete local workspace",
                            danger: !0,
                            run: () => void zr(a)
                          }] : []
                        ]);
                      },
                      children: [
                        /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
                        /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                          /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                          /* @__PURE__ */ d.jsx("small", { children: a.id === $e.id ? "open now" : a.sourceWorkspaceSnapshotAnnotationId ? `restored from Annotation ${a.sourceWorkspaceSnapshotAnnotationId}` : "browser-local workspace" })
                        ] }),
                        /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: new Date(a.updatedAt).toLocaleDateString() }),
                        /* @__PURE__ */ d.jsx(
                          "button",
                          {
                            className: "browser-more",
                            "aria-label": `Actions for ${a.name}`,
                            onClick: (f) => {
                              po(a.id), it(f, a.name, [
                                { label: "Open workspace", run: () => void ko(a.id) },
                                { label: "Rename workspace", run: () => void In(a) },
                                ...a.id !== $e.id ? [{
                                  label: "Delete local workspace",
                                  danger: !0,
                                  run: () => void zr(a)
                                }] : []
                              ]);
                            },
                            children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                          }
                        )
                      ]
                    },
                    a.id
                  )) })
                ] }) : /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
                  ni >= 75 && /* @__PURE__ */ d.jsxs("p", { className: "quota-warning", children: [
                    "Browser storage is ",
                    ni,
                    "% full. Archive or download old workspaces."
                  ] }),
                  /* @__PURE__ */ d.jsxs(
                    "details",
                    {
                      open: $r.inputs,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const f = a.currentTarget.open;
                        cr((g) => ({ ...g, inputs: f }));
                      },
                      children: [
                        /* @__PURE__ */ d.jsxs(
                          "summary",
                          {
                            onClick: () => ut({ kind: "folder", id: "inputs" }),
                            onContextMenu: (a) => it(a, "Input/", [
                              { label: "Add files", run: () => {
                                var f;
                                return (f = Bn.current) == null ? void 0 : f.click();
                              } }
                            ]),
                            children: [
                              /* @__PURE__ */ d.jsx(Qe, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
                              /* @__PURE__ */ d.jsx("strong", { children: "Input" }),
                              /* @__PURE__ */ d.jsx("small", { children: dr.length + re.length })
                            ]
                          }
                        ),
                        /* @__PURE__ */ d.jsxs("ul", { className: "browser-list", children: [
                          Ho.map((a) => /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: `browser-row file-${a.state}`,
                              onClick: () => Ke(a.id),
                              onContextMenu: (f) => it(f, a.name, qi(a)),
                              children: [
                                /* @__PURE__ */ d.jsx(Qe, { name: "file" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ d.jsxs("small", { children: [
                                    a.source,
                                    " · ",
                                    a.state,
                                    " · ",
                                    a.sha256.slice(0, 10) || "unhashed"
                                  ] }),
                                  a.error && /* @__PURE__ */ d.jsx("span", { className: "browser-error", children: a.error })
                                ] }),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: Ka(a.size) }),
                                /* @__PURE__ */ d.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (f) => it(f, a.name, qi(a)),
                                    children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                                  }
                                ),
                                a.state === "missing" && a.source === "local" && /* @__PURE__ */ d.jsx(
                                  "input",
                                  {
                                    id: `reselect-${a.id}`,
                                    hidden: !0,
                                    type: "file",
                                    onChange: (f) => {
                                      var g;
                                      return void kl(a, ((g = f.target.files) == null ? void 0 : g[0]) || null);
                                    }
                                  }
                                )
                              ]
                            },
                            a.id
                          )),
                          re.filter(
                            (a) => rn(`${a.name} ${a.contextName}`)
                          ).map((a) => /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: "browser-row virtual zarr-source-row",
                              onClick: () => ut({ kind: "zarr", id: a.id }),
                              children: [
                                /* @__PURE__ */ d.jsx("span", { className: "browser-icon zarr", "aria-hidden": "true" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ d.jsxs("small", { children: [
                                    a.contextName,
                                    " · served by ZarrViewer · not downloaded"
                                  ] })
                                ] }),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: "OME-Zarr" })
                              ]
                            },
                            `zarr-${a.id}`
                          )),
                          !Ho.length && !re.some(
                            (a) => rn(`${a.name} ${a.contextName}`)
                          ) && /* @__PURE__ */ d.jsx("li", { className: "browser-empty", children: "No matching input files" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ d.jsxs(
                    "details",
                    {
                      open: $r.chat,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const f = a.currentTarget.open;
                        cr((g) => ({ ...g, chat: f }));
                      },
                      children: [
                        /* @__PURE__ */ d.jsxs("summary", { onClick: () => ut({ kind: "folder", id: "chat" }), children: [
                          /* @__PURE__ */ d.jsx(Qe, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
                          /* @__PURE__ */ d.jsx("strong", { children: "Chat" }),
                          /* @__PURE__ */ d.jsx("small", { children: Nt.length })
                        ] }),
                        /* @__PURE__ */ d.jsx("ul", { className: "browser-list", children: Nt.filter((a) => rn(a.title)).flatMap((a) => [
                          /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: "browser-row virtual",
                              onClick: () => {
                                ut({ kind: "chat", id: a.id }), Mr(a.id);
                              },
                              onDoubleClick: () => void Mr(a.id),
                              children: [
                                /* @__PURE__ */ d.jsx("span", { className: "browser-icon json", "aria-hidden": "true" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsxs("strong", { children: [
                                    Ut(a.title),
                                    "/chat.json"
                                  ] }),
                                  /* @__PURE__ */ d.jsx("small", { children: "autosaved conversation" })
                                ] }),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: "—" })
                              ]
                            },
                            `${a.id}-json`
                          ),
                          /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: "browser-row virtual",
                              onClick: () => {
                                ut({ kind: "chat", id: a.id }), Mr(a.id);
                              },
                              onDoubleClick: () => void Mr(a.id),
                              children: [
                                /* @__PURE__ */ d.jsx("span", { className: "browser-icon markdown", "aria-hidden": "true" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsxs("strong", { children: [
                                    Ut(a.title),
                                    "/chat.md"
                                  ] }),
                                  /* @__PURE__ */ d.jsx("small", { children: "readable transcript" })
                                ] }),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: "—" })
                              ]
                            },
                            `${a.id}-md`
                          )
                        ]) }),
                        Wr("Chat results", "chat-results", Us)
                      ]
                    }
                  ),
                  /* @__PURE__ */ d.jsxs(
                    "details",
                    {
                      open: $r.methods,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const f = a.currentTarget.open;
                        cr((g) => ({ ...g, methods: f }));
                      },
                      children: [
                        /* @__PURE__ */ d.jsxs(
                          "summary",
                          {
                            onClick: () => ut({ kind: "folder", id: "methods" }),
                            onContextMenu: (a) => it(a, "methods/", [
                              { label: "Combine selected methods", run: () => void So() },
                              { label: "Copy selected methods…", run: () => mr() }
                            ]),
                            children: [
                              /* @__PURE__ */ d.jsx(Qe, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
                              /* @__PURE__ */ d.jsx("strong", { children: "Methods" }),
                              /* @__PURE__ */ d.jsx("small", { children: pr.length })
                            ]
                          }
                        ),
                        pr.length > 0 && /* @__PURE__ */ d.jsxs("div", { className: "method-selection-toolbar", children: [
                          /* @__PURE__ */ d.jsxs("span", { children: [
                            mn.size,
                            " selected"
                          ] }),
                          /* @__PURE__ */ d.jsx("button", { disabled: mn.size < 2, onClick: () => void So(), children: "Combine" }),
                          /* @__PURE__ */ d.jsx("button", { disabled: !mn.size, onClick: () => void Zs(), children: "To Notebook" }),
                          /* @__PURE__ */ d.jsx("button", { disabled: !mn.size, onClick: () => mr(), children: "Copy to…" })
                        ] }),
                        /* @__PURE__ */ d.jsxs("ul", { className: "browser-list", children: [
                          pr.filter((a) => rn(a.name)).map((a) => /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: "browser-row method-row",
                              onClick: () => ut({ kind: "method", id: a.id }),
                              onDoubleClick: () => void es(a),
                              onContextMenu: (f) => it(f, a.name, Hi(a)),
                              children: [
                                /* @__PURE__ */ d.jsx(
                                  "input",
                                  {
                                    className: "method-selector",
                                    type: "checkbox",
                                    "aria-label": `Select ${a.name}`,
                                    checked: mn.has(a.id),
                                    onClick: (f) => f.stopPropagation(),
                                    onChange: () => Bi(a.id),
                                    onDoubleClick: (f) => f.stopPropagation()
                                  }
                                ),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-icon python", "aria-hidden": "true" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ d.jsxs("small", { children: [
                                    "v",
                                    a.currentVersion,
                                    " · ",
                                    a.description || "saved Python method"
                                  ] })
                                ] }),
                                /* @__PURE__ */ d.jsxs("span", { className: "browser-size", children: [
                                  "v",
                                  a.currentVersion
                                ] }),
                                /* @__PURE__ */ d.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (f) => it(f, a.name, Hi(a)),
                                    children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                                  }
                                )
                              ]
                            },
                            a.id
                          )),
                          !pr.filter((a) => rn(a.name)).length && /* @__PURE__ */ d.jsx("li", { className: "browser-empty", children: "No matching methods" })
                        ] }),
                        Wr("Methods results", "methods-results", Ds)
                      ]
                    }
                  ),
                  /* @__PURE__ */ d.jsxs(
                    "details",
                    {
                      open: $r.pipelines,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const f = a.currentTarget.open;
                        cr((g) => ({ ...g, pipelines: f }));
                      },
                      children: [
                        /* @__PURE__ */ d.jsxs("summary", { onClick: () => ut({ kind: "folder", id: "pipelines" }), children: [
                          /* @__PURE__ */ d.jsx(Qe, { name: "chevron", className: "folder-chevron" }),
                          /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
                          /* @__PURE__ */ d.jsx("strong", { children: "Pipelines" }),
                          /* @__PURE__ */ d.jsx("small", { children: y.pipelines.length })
                        ] }),
                        y.pipelines.some((a) => !a.deletedAt) && /* @__PURE__ */ d.jsxs("div", { className: "method-selection-toolbar", children: [
                          /* @__PURE__ */ d.jsxs("span", { children: [
                            Pr.size,
                            " selected"
                          ] }),
                          /* @__PURE__ */ d.jsx(
                            "button",
                            {
                              disabled: !Pr.size,
                              onClick: () => void go(),
                              children: "To Notebook"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ d.jsxs("ul", { className: "browser-list", children: [
                          y.pipelines.filter(
                            (a) => !a.deletedAt && rn(a.name)
                          ).map((a) => /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: "browser-row pipeline-row",
                              onClick: () => ut({ kind: "pipeline", id: a.id }),
                              onDoubleClick: () => void Ur(a),
                              onContextMenu: (f) => it(f, a.name, [
                                { label: "Run pipeline", run: () => void Ur(a) },
                                { label: "Batch run on opened workspaces…", run: () => void rs(a) },
                                ...o.canUpload ? [{
                                  label: "Publish template to OMERO",
                                  run: () => void Pt(a)
                                }] : [],
                                { label: "Delete pipeline", danger: !0, run: () => void Ys(a) }
                              ]),
                              children: [
                                /* @__PURE__ */ d.jsx(
                                  "input",
                                  {
                                    className: "method-selector",
                                    type: "checkbox",
                                    "aria-label": `Select pipeline ${a.name}`,
                                    checked: Pr.has(a.id),
                                    onClick: (f) => f.stopPropagation(),
                                    onChange: () => Gn(a.id),
                                    onDoubleClick: (f) => f.stopPropagation()
                                  }
                                ),
                                /* @__PURE__ */ d.jsx(Qe, { name: "file" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ d.jsxs("small", { children: [
                                    "v",
                                    a.version,
                                    " · ",
                                    a.steps.length,
                                    " isolated steps"
                                  ] })
                                ] }),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: a.steps.length }),
                                /* @__PURE__ */ d.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (f) => it(f, a.name, [
                                      { label: "Run pipeline", run: () => void Ur(a) },
                                      { label: "Batch run on opened workspaces…", run: () => void rs(a) },
                                      ...o.canUpload ? [{
                                        label: "Publish template to OMERO",
                                        run: () => void Pt(a)
                                      }] : [],
                                      { label: "Delete pipeline", danger: !0, run: () => void Ys(a) }
                                    ]),
                                    children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                                  }
                                )
                              ]
                            },
                            a.id
                          )),
                          !y.pipelines.filter(
                            (a) => !a.deletedAt && rn(a.name)
                          ).length && /* @__PURE__ */ d.jsx("li", { className: "browser-empty", children: "No matching pipelines" }),
                          de.map((a) => /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: "browser-row",
                              onDoubleClick: () => void hr(a),
                              children: [
                                /* @__PURE__ */ d.jsx("span", { className: "browser-icon archive", "aria-hidden": "true" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ d.jsx("small", { children: "OMERO template · double-click to import" })
                                ] }),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: Ka(a.size) }),
                                /* @__PURE__ */ d.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Import ${a.name}`,
                                    onClick: () => void hr(a),
                                    children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                                  }
                                )
                              ]
                            },
                            `template-${a.annotation_id}`
                          ))
                        ] }),
                        Wr("Pipelines results", "pipelines-results", Fs)
                      ]
                    }
                  ),
                  /* @__PURE__ */ d.jsxs(
                    "details",
                    {
                      open: $r.notebooks,
                      className: "browser-folder",
                      onToggle: (a) => {
                        const f = a.currentTarget.open;
                        cr((g) => ({ ...g, notebooks: f }));
                      },
                      children: [
                        /* @__PURE__ */ d.jsxs(
                          "summary",
                          {
                            onClick: () => ut({ kind: "folder", id: "notebooks" }),
                            onContextMenu: (a) => it(a, "Notebooks/", [
                              { label: "Upload notebook", run: () => {
                                var f;
                                return (f = Or.current) == null ? void 0 : f.click();
                              } }
                            ]),
                            children: [
                              /* @__PURE__ */ d.jsx(Qe, { name: "chevron", className: "folder-chevron" }),
                              /* @__PURE__ */ d.jsx(Qe, { name: "folder" }),
                              /* @__PURE__ */ d.jsx("strong", { children: "Notebooks" }),
                              /* @__PURE__ */ d.jsx("small", { children: y.notebooks.length })
                            ]
                          }
                        ),
                        /* @__PURE__ */ d.jsxs("div", { className: "method-selection-toolbar notebook-folder-toolbar", children: [
                          /* @__PURE__ */ d.jsxs("span", { children: [
                            y.notebooks.length,
                            " notebook",
                            y.notebooks.length === 1 ? "" : "s"
                          ] }),
                          /* @__PURE__ */ d.jsx("button", { onClick: () => {
                            var a;
                            return (a = Or.current) == null ? void 0 : a.click();
                          }, children: "Upload" })
                        ] }),
                        /* @__PURE__ */ d.jsxs("ul", { className: "browser-list", children: [
                          y.notebooks.filter(
                            (a) => rn(a.name)
                          ).map((a) => /* @__PURE__ */ d.jsxs(
                            "li",
                            {
                              className: "browser-row",
                              onClick: () => {
                                Ne(a.id), ut({ kind: "notebook", id: a.id });
                              },
                              onDoubleClick: () => Jo(a),
                              onContextMenu: (f) => it(f, a.name, [
                                { label: "Open", run: () => Jo(a) },
                                { label: "Run", run: () => Go(a) }
                              ]),
                              children: [
                                /* @__PURE__ */ d.jsx("span", { className: "browser-icon json", "aria-hidden": "true" }),
                                /* @__PURE__ */ d.jsxs("div", { className: "browser-name", children: [
                                  /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                                  /* @__PURE__ */ d.jsx("small", { children: a.attachmentIds.length ? `${a.attachmentIds.length} attached version(s)` : "browser workspace" })
                                ] }),
                                /* @__PURE__ */ d.jsx("span", { className: "browser-size", children: ".ipynb" }),
                                /* @__PURE__ */ d.jsx(
                                  "button",
                                  {
                                    className: "browser-more",
                                    "aria-label": `Actions for ${a.name}`,
                                    onClick: (f) => it(f, a.name, [
                                      { label: "Open", run: () => Jo(a) },
                                      { label: "Run", run: () => Go(a) }
                                    ]),
                                    children: /* @__PURE__ */ d.jsx(Qe, { name: "more" })
                                  }
                                )
                              ]
                            },
                            a.id
                          )),
                          !y.notebooks.length && /* @__PURE__ */ d.jsx("li", { className: "browser-empty", children: "No notebooks" })
                        ] }),
                        Wr("Notebooks results", "notebooks-results", Ls),
                        /* @__PURE__ */ d.jsx(
                          "input",
                          {
                            ref: Or,
                            hidden: !0,
                            type: "file",
                            accept: ".ipynb,application/x-ipynb+json",
                            onChange: (a) => {
                              var g;
                              const f = (g = a.target.files) == null ? void 0 : g[0];
                              f && Bs(f), a.target.value = "";
                            }
                          }
                        )
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ d.jsx(
            "div",
            {
              className: "pane-resizer",
              role: "separator",
              "aria-label": "Resize workspace explorer",
              onMouseDown: Qn
            }
          ),
          nn && /* @__PURE__ */ d.jsxs(
            "div",
            {
              className: "browser-context-menu",
              role: "menu",
              "aria-label": `Actions for ${nn.title}`,
              style: { left: nn.x, top: nn.y },
              onClick: (a) => a.stopPropagation(),
              children: [
                /* @__PURE__ */ d.jsx("div", { className: "context-title", children: nn.title }),
                nn.actions.map((a) => /* @__PURE__ */ d.jsx(
                  "button",
                  {
                    role: "menuitem",
                    className: a.danger ? "danger" : "",
                    onClick: () => {
                      uo(null), a.run();
                    },
                    children: a.label
                  },
                  a.label
                ))
              ]
            }
          ),
          /* @__PURE__ */ d.jsx(
            "input",
            {
              ref: Wn,
              hidden: !0,
              type: "file",
              accept: ".oa-workspace.zip,application/zip",
              onChange: (a) => {
                var f;
                return void ml(((f = a.target.files) == null ? void 0 : f[0]) || null);
              }
            }
          ),
          /* @__PURE__ */ d.jsxs("section", { className: "center-pane", children: [
            /* @__PURE__ */ d.jsx("nav", { className: "analysis-tabs", "aria-label": "Analysis views", children: ["chat", "notebook"].map((a) => /* @__PURE__ */ d.jsx(
              "button",
              {
                className: h === a ? "active" : "",
                "aria-current": h === a ? "page" : void 0,
                onClick: () => qn(a),
                children: a[0].toUpperCase() + a.slice(1)
              },
              a
            )) }),
            h === "chat" && /* @__PURE__ */ d.jsxs("section", { className: "chat", children: [
              /* @__PURE__ */ d.jsxs("div", { className: "workspace-toolbar", children: [
                /* @__PURE__ */ d.jsxs("label", { children: [
                  /* @__PURE__ */ d.jsx("span", { className: "sr-only", children: "Current chat" }),
                  /* @__PURE__ */ d.jsx("select", { value: dt.id, onChange: (a) => void Mr(a.target.value), children: Nt.filter((a) => !a.archived).map((a) => /* @__PURE__ */ d.jsx("option", { value: a.id, children: a.title }, a.id)) })
                ] }),
                /* @__PURE__ */ d.jsx("button", { onClick: () => void Xo(), children: "New chat" }),
                /* @__PURE__ */ d.jsx("button", { onClick: () => void wo(dt), children: "Rename chat" }),
                /* @__PURE__ */ d.jsx("button", { onClick: () => ll(dt), children: "Archive" }),
                Qi()
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "messages", "aria-live": "polite", ref: Di, children: [
                !dt.messages.length && /* @__PURE__ */ d.jsxs("div", { className: "welcome", children: [
                  /* @__PURE__ */ d.jsx("h2", { children: "What would you like to learn from these data?" }),
                  /* @__PURE__ */ d.jsx("p", { children: "This named chat, its code, outputs, and reusable pipelines are saved automatically in the browser workspace." }),
                  tn.length > 0 && /* @__PURE__ */ d.jsxs("div", { className: "suggested-prompts", children: [
                    /* @__PURE__ */ d.jsx("button", { onClick: () => we("Summarize the available datasets, tables, columns, and important data-quality issues."), children: "Summarize these data" }),
                    /* @__PURE__ */ d.jsx("button", { onClick: () => we("Find the most biologically meaningful differences and visualize them with reproducible plot data."), children: "Find meaningful differences" }),
                    /* @__PURE__ */ d.jsx("button", { onClick: () => we("Explain the CI Segmentation schema and suggest three safe analyses for these measurements."), children: "Explore the measurement schema" })
                  ] })
                ] }),
                dt.messages.map((a) => {
                  var g;
                  if (a.kind === "viewer-preview" && a.artifactId) {
                    const w = y.artifacts.find(
                      (j) => j.id === a.artifactId
                    ), x = w != null && w.fileId ? y.files.find(
                      (j) => j.id === w.fileId && !j.deletedAt
                    ) : void 0;
                    return w ? /* @__PURE__ */ d.jsx(
                      gy,
                      {
                        artifact: w,
                        file: x,
                        onInspect: (j) => {
                          Ke(j.id);
                        },
                        onSaveBundle: (j, k) => void dl(j, k)
                      },
                      a.id
                    ) : null;
                  }
                  if (a.kind === "execution" && a.executionId) {
                    const w = y.executions.find((x) => x.id === a.executionId);
                    return w ? /* @__PURE__ */ d.jsx(
                      ly,
                      {
                        execution: w,
                        files: y.files,
                        onSave: () => void ul(w),
                        onRerun: () => void xl(w),
                        viewerPreparation: Ja(
                          y,
                          w
                        )
                      },
                      a.id
                    ) : null;
                  }
                  const f = sy(
                    a.activity,
                    a.durationMs
                  );
                  return /* @__PURE__ */ d.jsxs("article", { className: `message ${a.role} ${a.kind || ""}`, children: [
                    /* @__PURE__ */ d.jsxs("span", { children: [
                      a.role,
                      /* @__PURE__ */ d.jsx(
                        "button",
                        {
                          className: "pin-message",
                          "aria-label": `${(dt.pinnedMessageIds || []).includes(a.id) ? "Unpin" : "Pin"} message`,
                          onClick: () => al(dt, a.id),
                          children: (dt.pinnedMessageIds || []).includes(a.id) ? "★" : "☆"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ d.jsx("p", { children: a.content }),
                    (g = a.citationIds) != null && g.length ? /* @__PURE__ */ d.jsx("div", { className: "message-citations", "aria-label": "Evidence used for this answer", children: a.citationIds.map((w, x) => {
                      const j = y.executions.find((P) => P.id === w), k = j == null ? void 0 : j.outputFileIds.find(
                        (P) => y.files.some((B) => B.id === P && !B.deletedAt)
                      );
                      return /* @__PURE__ */ d.jsxs(
                        "button",
                        {
                          title: `Open local execution ${w.slice(0, 8)}`,
                          onClick: () => {
                            k && Ke(k);
                          },
                          children: [
                            "Evidence ",
                            x + 1
                          ]
                        },
                        w
                      );
                    }) }) : null,
                    f && /* @__PURE__ */ d.jsx("small", { className: "message-activity", children: f })
                  ] }, a.id);
                }),
                Ue && /* @__PURE__ */ d.jsxs("article", { className: "message assistant streaming", children: [
                  /* @__PURE__ */ d.jsxs("span", { children: [
                    "assistant · ",
                    Ze
                  ] }),
                  /* @__PURE__ */ d.jsxs("p", { children: [
                    Ue,
                    /* @__PURE__ */ d.jsx("i", { className: "stream-caret" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ d.jsx(
                wy,
                {
                  runtimeReady: zt,
                  runtimeProgress: ho,
                  status: Ts,
                  usage: Fi,
                  settings: C,
                  blocked: Zo.length > 0,
                  canChat: yo,
                  composerPlaceholder: il,
                  prompt: xe,
                  busy: me,
                  onPromptChange: we,
                  onSend: () => void Dr(),
                  onStop: Yo,
                  onReset: () => void An(y.files, "Python state reset; inputs restored")
                }
              )
            ] }),
            h === "notebook" && /* @__PURE__ */ d.jsx(
              jy,
              {
                notebook: vl,
                inputs: dr,
                runtime: i,
                runRequest: Os,
                workspaceActions: Qi(),
                onChange: He,
                onFiles: Ui
              }
            ),
            h === "settings" && /* @__PURE__ */ d.jsxs("section", { className: "settings-tab settings-stack", "aria-label": "Settings", children: [
              /* @__PURE__ */ d.jsxs("details", { className: "settings-section", open: !0, children: [
                /* @__PURE__ */ d.jsx("summary", { children: "Analysis Settings" }),
                /* @__PURE__ */ d.jsx("div", { className: "settings-section-body", children: /* @__PURE__ */ d.jsxs("label", { className: "settings-check", children: [
                  /* @__PURE__ */ d.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: $e.plotCsv,
                      onChange: ti
                    }
                  ),
                  /* @__PURE__ */ d.jsxs("span", { children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "Plot + CSV" }),
                    /* @__PURE__ */ d.jsx("small", { children: "Ask Chat to save both a visual plot and its underlying tabular data when an analysis produces a chart. Disable this when you only need the requested result." })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ d.jsxs("details", { className: "settings-section", children: [
                /* @__PURE__ */ d.jsx("summary", { children: "AI Settings" }),
                /* @__PURE__ */ d.jsxs("div", { className: "settings-section-body settings-form", children: [
                  /* @__PURE__ */ d.jsx("p", { className: "settings-warning", children: "The API key is used only in this browser tab unless you choose to remember it. Remembered keys are stored unencrypted and never included in Workspace snapshots." }),
                  /* @__PURE__ */ d.jsxs("label", { children: [
                    "API protocol",
                    /* @__PURE__ */ d.jsxs(
                      "select",
                      {
                        value: C.protocol,
                        onChange: (a) => void Kn({
                          ...C,
                          protocol: a.target.value
                        }),
                        children: [
                          /* @__PURE__ */ d.jsx("option", { value: "openai", children: "OpenAI-compatible Chat Completions" }),
                          /* @__PURE__ */ d.jsx("option", { value: "anthropic", children: "Anthropic Messages" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ d.jsxs("label", { children: [
                    "API endpoint",
                    /* @__PURE__ */ d.jsx(
                      "input",
                      {
                        type: "url",
                        name: "omero-analysis-api-endpoint",
                        autoComplete: "url",
                        value: C.endpoint,
                        placeholder: C.protocol === "anthropic" ? "https://your-provider.example" : "https://your-provider.example/v1",
                        onChange: (a) => void Kn({ ...C, endpoint: a.target.value })
                      }
                    ),
                    /* @__PURE__ */ d.jsx("small", { children: "Enter your provider base URL or complete API route. No organization endpoint is built in." })
                  ] }),
                  C.protocol === "openai" && /* @__PURE__ */ d.jsxs("label", { children: [
                    "Authentication header",
                    /* @__PURE__ */ d.jsxs(
                      "select",
                      {
                        value: C.authMode,
                        onChange: (a) => void Kn({
                          ...C,
                          authMode: a.target.value
                        }),
                        children: [
                          /* @__PURE__ */ d.jsx("option", { value: "bearer", children: "Authorization: Bearer" }),
                          /* @__PURE__ */ d.jsx("option", { value: "api-key", children: "api-key (Azure-compatible)" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ d.jsxs("label", { children: [
                    "Model or deployment",
                    /* @__PURE__ */ d.jsx(
                      "input",
                      {
                        name: "omero-analysis-model",
                        autoComplete: "off",
                        value: C.model,
                        onChange: (a) => void Kn({ ...C, model: a.target.value })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ d.jsxs("label", { children: [
                    "API key",
                    /* @__PURE__ */ d.jsx(
                      "input",
                      {
                        type: "password",
                        name: "omero-analysis-api-key",
                        autoComplete: "new-password",
                        value: C.apiKey,
                        onChange: (a) => void Kn({ ...C, apiKey: a.target.value })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ d.jsxs("label", { className: "settings-check inline", children: [
                    /* @__PURE__ */ d.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: C.rememberKey,
                        onChange: (a) => void Kn({ ...C, rememberKey: a.target.checked })
                      }
                    ),
                    "Remember this key in this browser profile"
                  ] }),
                  /* @__PURE__ */ d.jsxs("label", { children: [
                    "Model context window (optional)",
                    /* @__PURE__ */ d.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: C.contextWindow || "",
                        onChange: (a) => void Kn({
                          ...C,
                          contextWindow: Number(a.target.value) || 0
                        })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ d.jsx("button", { className: "secondary-action", onClick: () => void Kn({
                    ...C,
                    apiKey: "",
                    rememberKey: !1
                  }), children: "Forget API key" })
                ] })
              ] }),
              /* @__PURE__ */ d.jsxs("details", { className: "settings-section", children: [
                /* @__PURE__ */ d.jsx("summary", { children: "Skills" }),
                /* @__PURE__ */ d.jsxs("div", { className: "settings-section-body", children: [
                  /* @__PURE__ */ d.jsx("p", { children: "Catalog metadata is informational. Skill instructions are loaded only for matching Chat turns and are never loaded by Notebook." }),
                  /* @__PURE__ */ d.jsxs("div", { className: "skill-list", children: [
                    [
                      ...(ge == null ? void 0 : ge.workflows) || [],
                      ...(ge == null ? void 0 : ge.applications) || []
                    ].flatMap(
                      (a) => a.skills.map((f) => /* @__PURE__ */ d.jsxs("article", { className: "skill-card", children: [
                        /* @__PURE__ */ d.jsx("strong", { children: f.name }),
                        /* @__PURE__ */ d.jsxs("span", { children: [
                          "Provider: ",
                          a.source.source_key || a.source.workflow_key
                        ] }),
                        /* @__PURE__ */ d.jsxs("span", { children: [
                          "Source: ",
                          f.package_url
                        ] }),
                        /* @__PURE__ */ d.jsxs("span", { children: [
                          "Version: ",
                          f.version,
                          " · SHA-256: ",
                          f.sha256
                        ] }),
                        /* @__PURE__ */ d.jsxs("span", { children: [
                          "Health: ",
                          a.status
                        ] }),
                        /* @__PURE__ */ d.jsx("span", { children: yl.some((g) => g.skill.sha256 === f.sha256) ? "Matches current data" : "Does not match current data" }),
                        /* @__PURE__ */ d.jsx("span", { children: wl.has(f.sha256) ? "Loaded by Chat" : "Not loaded" })
                      ] }, `${a.source.workflow_key}:${f.name}:${f.sha256}`))
                    ),
                    Pe == null ? void 0 : Pe.skills.map((a) => /* @__PURE__ */ d.jsxs("article", { className: "skill-card", children: [
                      /* @__PURE__ */ d.jsx("strong", { children: a.name }),
                      /* @__PURE__ */ d.jsxs("span", { children: [
                        "Provider: ",
                        Pe.provider.name
                      ] }),
                      /* @__PURE__ */ d.jsxs("span", { children: [
                        "Source: ",
                        Pe.provider.source
                      ] }),
                      /* @__PURE__ */ d.jsxs("span", { children: [
                        "Version: ",
                        a.version,
                        " · SHA-256: ",
                        a.sha256
                      ] }),
                      /* @__PURE__ */ d.jsxs("span", { children: [
                        "Health: ",
                        Pe.provider.health
                      ] }),
                      /* @__PURE__ */ d.jsx("span", { children: "Explicit ZarrViewer Chat operations only" }),
                      /* @__PURE__ */ d.jsx("span", { children: "Not loaded by Notebook" })
                    ] }, `${Pe.provider.name}:${a.name}:${a.sha256}`)),
                    !Ki && /* @__PURE__ */ d.jsx("p", { children: "No external skills discovered. Generic Chat remains available." })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ d.jsx(
            "div",
            {
              className: "pane-resizer artifact-resizer",
              role: "separator",
              "aria-label": "Resize Artifact Inspector",
              onMouseDown: Jn
            }
          ),
          /* @__PURE__ */ d.jsx(
            ky,
            {
              item: gl,
              profiles: tn,
              canUpload: o.canUpload,
              onDownload: bo,
              onAttach: (a) => void Eo(a)
            }
          )
        ]
      }
    )
  ] });
  async function kl(a, f) {
    const g = _.current;
    if (!f || !g) return;
    if (f.size > Np) {
      se(`${f.name} exceeds the 256 MiB file limit`);
      return;
    }
    const w = await f.arrayBuffer(), x = {
      ...a,
      name: f.name,
      type: f.type || rf(f.name),
      size: w.byteLength,
      sha256: await en(w),
      data: w,
      state: "ready",
      error: void 0
    }, j = g.files.map((k) => k.id === a.id ? x : k);
    It([x]), await An(j, "Missing local input restored");
  }
  async function xl(a) {
    const f = _.current;
    if (!(!zt || me || !f || a.purpose === "inspection" || Ja(f, a))) {
      _e(!0), Lt.current.clear(), await i.beginTurn();
      try {
        const g = Ee(), w = await fr(
          a.code,
          a.chatId,
          g,
          !0,
          a.purpose === "method" ? "method" : "analysis"
        ), x = _.current, j = x == null ? void 0 : x.methods.flatMap(
          (P) => P.versions.map((B) => ({ method: P, version: B }))
        ).find(({ version: P }) => P.codeHash === a.codeHash), k = await xo(
          w,
          a.chatId,
          g,
          (j == null ? void 0 : j.method.name) || "python-rerun-analysis.py",
          j == null ? void 0 : j.version.renderRecipe
        );
        se(
          k ? "Python rerun completed and rendered its PNG gallery" : "Python rerun completed"
        );
      } catch (g) {
        se(`Python rerun could not complete: ${String(g)}`);
      } finally {
        _e(!1);
      }
    }
  }
}
function Qe({ name: r, className: o = "" }) {
  const i = {
    folder: /* @__PURE__ */ d.jsx("path", { d: "M2.5 6.5h8.1l2.35-3h6.55v15H2.5z" }),
    file: /* @__PURE__ */ d.jsx("path", { d: "M5 2.5h8l4 4v15H5zm8 0v4h4M8 11h6M8 15h6" }),
    image: /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "1.5" }),
      /* @__PURE__ */ d.jsx("circle", { cx: "9", cy: "9", r: "1.5" }),
      /* @__PURE__ */ d.jsx("path", { d: "m5 18 5-5 3 3 2-2 4 4" })
    ] }),
    root: /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("path", { d: "m3 11 9-7 9 7" }),
      /* @__PURE__ */ d.jsx("path", { d: "M5.5 10v10h13V10M10 20v-6h4v6" })
    ] }),
    up: /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("path", { d: "m7 10 5-5 5 5" }),
      /* @__PURE__ */ d.jsx("path", { d: "M12 5v13" })
    ] }),
    upload: /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("path", { d: "M4 16v4h16v-4" }),
      /* @__PURE__ */ d.jsx("path", { d: "M12 16V4m-5 5 5-5 5 5" })
    ] }),
    refresh: /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("path", { d: "M20 7V3l-3 3a8 8 0 1 0 2.2 8" }),
      /* @__PURE__ */ d.jsx("path", { d: "M20 3h-5" })
    ] }),
    collapse: /* @__PURE__ */ d.jsx(d.Fragment, { children: /* @__PURE__ */ d.jsx("path", { d: "m7 9 5-5 5 5M7 15l5 5 5-5" }) }),
    chevron: /* @__PURE__ */ d.jsx("path", { d: "m9 5 7 7-7 7" }),
    more: /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
      /* @__PURE__ */ d.jsx("circle", { cx: "12", cy: "5", r: "1.4", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ d.jsx("circle", { cx: "12", cy: "12", r: "1.4", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ d.jsx("circle", { cx: "12", cy: "19", r: "1.4", fill: "currentColor", stroke: "none" })
    ] })
  };
  return /* @__PURE__ */ d.jsx(
    "svg",
    {
      className: `ui-icon icon-${r} ${o}`.trim(),
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      fill: r === "folder" ? "currentColor" : "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: i[r]
    }
  );
}
const zf = document.getElementById("root"), lf = document.getElementById("omero-analysis-context"), Mt = (r) => zf.dataset[r] || "", Ga = window.OMERO_ANALYSIS;
window.OMERO_ANALYSIS = Ga != null && Ga.runtimeBase ? Ga : {
  context: lf ? JSON.parse(lf.textContent || "null") : null,
  tokenUrl: Mt("tokenUrl"),
  contextTemplate: Mt("contextTemplate"),
  attachmentsTemplate: Mt("attachmentsTemplate"),
  hierarchyTemplate: Mt("hierarchyTemplate"),
  downloadTemplate: Mt("downloadTemplate"),
  uploadTemplate: Mt("uploadTemplate"),
  snapshotsTemplate: Mt("snapshotsTemplate"),
  snapshotUploadTemplate: Mt("snapshotUploadTemplate"),
  snapshotDownloadTemplate: Mt("snapshotDownloadTemplate"),
  pipelineTemplatesTemplate: Mt("pipelineTemplatesTemplate"),
  pipelineDownloadTemplate: Mt("pipelineDownloadTemplate"),
  notebookDownloadTemplate: Mt("notebookDownloadTemplate"),
  notebookUploadTemplate: Mt("notebookUploadTemplate"),
  workflowSkillsUrl: Mt("workflowSkillsUrl"),
  zarrViewerStatusUrl: Mt("zarrViewerStatusUrl"),
  runtimeBase: Mt("runtimeBase").replace(/ASSET$/, "")
};
Wh.createRoot(zf).render(
  /* @__PURE__ */ d.jsx(Mh.StrictMode, { children: /* @__PURE__ */ d.jsx(qy, {}) })
);
