let ja = 0, be = class {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
};
class E {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = ja++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    }), this.combine = e.combine || null;
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = he.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
E.closedBy = new E({ deserialize: (n) => n.split(" ") });
E.openedBy = new E({ deserialize: (n) => n.split(" ") });
E.group = new E({ deserialize: (n) => n.split(" ") });
E.isolate = new E({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
E.contextHash = new E({ perNode: !0 });
E.lookAhead = new E({ perNode: !0 });
E.mounted = new E({ perNode: !0 });
class Pt {
  constructor(e, t, i, s = !1) {
    this.tree = e, this.overlay = t, this.parser = i, this.bracketed = s;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[E.mounted.id];
  }
}
const Ua = /* @__PURE__ */ Object.create(null);
class he {
  /**
  @internal
  */
  constructor(e, t, i, s = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = s;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : Ua, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), s = new he(e.name || "", t, e.id, i);
    if (e.props) {
      for (let r of e.props)
        if (Array.isArray(r) || (r = r(s)), r) {
          if (r[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[r[0].id] = r[1];
        }
    }
    return s;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(E.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let s of i.split(" "))
        t[s] = e[i];
    return (i) => {
      for (let s = i.prop(E.group), r = -1; r < (s ? s.length : 0); r++) {
        let o = t[r < 0 ? i.name : s[r]];
        if (o)
          return o;
      }
    };
  }
}
he.none = new he(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class zn {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let s = null;
      for (let r of e) {
        let o = r(i);
        if (o) {
          s || (s = Object.assign({}, i.props));
          let l = o[1], a = o[0];
          a.combine && a.id in s && (l = a.combine(s[a.id], l)), s[a.id] = l;
        }
      }
      t.push(s ? new he(i.name, s, i.id, i.flags) : i);
    }
    return new zn(t);
  }
}
const Oi = /* @__PURE__ */ new WeakMap(), hr = /* @__PURE__ */ new WeakMap();
var L;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays", n[n.EnterBracketed = 16] = "EnterBracketed";
})(L || (L = {}));
class U {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, s, r) {
    if (this.type = e, this.children = t, this.positions = i, this.length = s, this.props = null, r && r.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of r)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = Pt.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let s = i.toString();
      s && (t && (t += ","), t += s);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new Hi(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let s = Oi.get(this) || this.topNode, r = new Hi(s);
    return r.moveTo(e, t), Oi.set(this, r._tree), r;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new ne(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = ei(Oi.get(this) || this.topNode, e, t, !1);
    return Oi.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = ei(hr.get(this) || this.topNode, e, t, !0);
    return hr.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return Za(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: s = 0, to: r = this.length } = e, o = e.mode || 0, l = (o & L.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | L.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= r && a.to >= s && (!l && a.type.isAnonymous || t(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (l || !a.type.isAnonymous) && i(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : Nn(he.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, s) => new U(this.type, t, i, s, this.propValues), e.makeTree || ((t, i, s) => new U(he.none, t, i, s)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return Ya(e);
  }
}
U.empty = new U(he.none, [], [], 0);
class Bn {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new Bn(this.buffer, this.index);
  }
}
class st {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return he.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], s = this.set.types[t], r = s.name;
    if (/\W/.test(r) && !s.isError && (r = JSON.stringify(r)), e += 4, i == e)
      return r;
    let o = [];
    for (; e < i; )
      o.push(this.childString(e)), e = this.buffer[e + 3];
    return r + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, s, r) {
    let { buffer: o } = this, l = -1;
    for (let a = e; a != t && !(_o(r, s, o[a + 1], o[a + 2]) && (l = a, i > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let s = this.buffer, r = new Uint16Array(t - e), o = 0;
    for (let l = e, a = 0; l < t; ) {
      r[a++] = s[l++], r[a++] = s[l++] - i;
      let h = r[a++] = s[l++] - i;
      r[a++] = s[l++] - e, o = Math.max(o, h);
    }
    return new st(r, o, this.set);
  }
}
function _o(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function ei(n, e, t, i) {
  for (var s; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let o = !i && n instanceof ne && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let r = i ? 0 : L.IgnoreOverlays;
  if (i)
    for (let o = n, l = o.parent; l; o = l, l = o.parent)
      o instanceof ne && o.index < 0 && ((s = l.enter(e, t, r)) === null || s === void 0 ? void 0 : s.from) != o.from && (n = l);
  for (; ; ) {
    let o = n.enter(e, t, r);
    if (!o)
      return n;
    n = o;
  }
}
class Xo {
  cursor(e = 0) {
    return new Hi(this, e);
  }
  getChild(e, t = null, i = null) {
    let s = fr(this, e, t, i);
    return s.length ? s[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return fr(this, e, t, i);
  }
  resolve(e, t = 0) {
    return ei(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return ei(this, e, t, !0);
  }
  matchContext(e) {
    return Zs(this.parent, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let s = t.lastChild;
      if (!s || s.to != t.to)
        break;
      s.type.isError && s.from == s.to ? (i = t, t = s.prevSibling) : t = s;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class ne extends Xo {
  constructor(e, t, i, s) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = s;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, s, r = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = t > 0 ? l.length : -1; e != h; e += t) {
        let f = l[e], c = a[e] + o.from, u;
        if (!(!(r & L.EnterBracketed && f instanceof U && (u = Pt.get(f)) && !u.overlay && u.bracketed && i >= c && i <= c + f.length) && !_o(s, i, c, c + f.length))) {
          if (f instanceof st) {
            if (r & L.ExcludeBuffers)
              continue;
            let d = f.findChild(0, f.buffer.length, t, i - c, s);
            if (d > -1)
              return new $e(new Ha(o, f, e, c), null, d);
          } else if (r & L.IncludeAnonymous || !f.type.isAnonymous || In(f)) {
            let d;
            if (!(r & L.IgnoreMounts) && (d = Pt.get(f)) && !d.overlay)
              return new ne(d.tree, c, e, o);
            let p = new ne(f, c, e, o);
            return r & L.IncludeAnonymous || !p.type.isAnonymous ? p : p.nextChild(t < 0 ? f.children.length - 1 : 0, t, i, s, r);
          }
        }
      }
      if (r & L.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? e = o.index + t : e = t < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this._tree.prop(e);
  }
  enter(e, t, i = 0) {
    let s;
    if (!(i & L.IgnoreOverlays) && (s = Pt.get(this._tree)) && s.overlay) {
      let r = e - this.from, o = i & L.EnterBracketed && s.bracketed;
      for (let { from: l, to: a } of s.overlay)
        if ((t > 0 || o ? l <= r : l < r) && (t < 0 || o ? a >= r : a > r))
          return new ne(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function fr(n, e, t, i) {
  let s = n.cursor(), r = [];
  if (!s.firstChild())
    return r;
  if (t != null) {
    for (let o = !1; !o; )
      if (o = s.type.is(t), !s.nextSibling())
        return r;
  }
  for (; ; ) {
    if (i != null && s.type.is(i))
      return r;
    if (s.type.is(e) && r.push(s.node), !s.nextSibling())
      return i == null ? r : [];
  }
}
function Zs(n, e, t = e.length - 1) {
  for (let i = n; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class Ha {
  constructor(e, t, i, s) {
    this.parent = e, this.buffer = t, this.index = i, this.start = s;
  }
}
class $e extends Xo {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.context.start, i);
    return r < 0 ? null : new $e(this.context, this, r);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  prop(e) {
    return this.type.prop(e);
  }
  enter(e, t, i = 0) {
    if (i & L.ExcludeBuffers)
      return null;
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return r < 0 ? null : new $e(this.context, this, r);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new $e(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new $e(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, s = this.index + 4, r = i.buffer[this.index + 3];
    if (r > s) {
      let o = i.buffer[this.index + 1];
      e.push(i.slice(s, r, o)), t.push(0);
    }
    return new U(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function Fo(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let r = 1; r < n.length; r++) {
    let o = n[r];
    (o.from > t.from || o.to < t.to) && (t = o, e = r);
  }
  let i = t instanceof ne && t.index < 0 ? null : t.parent, s = n.slice();
  return i ? s[e] = i : s.splice(e, 1), new Ga(s, t);
}
class Ga {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return Fo(this.heads);
  }
}
function Za(n, e, t) {
  let i = n.resolveInner(e, t), s = null;
  for (let r = i instanceof ne ? i : i.context.parent; r; r = r.parent)
    if (r.index < 0) {
      let o = r.parent;
      (s || (s = [i])).push(o.resolve(e, t)), r = o;
    } else {
      let o = Pt.get(r.tree);
      if (o && o.overlay && o.overlay[0].from <= e && o.overlay[o.overlay.length - 1].to >= e) {
        let l = new ne(o.tree, o.overlay[0].from + r.from, -1, r);
        (s || (s = [i])).push(ei(l, e, t, !1));
      }
    }
  return s ? Fo(s) : i;
}
class Hi {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = t & ~L.EnterBracketed, e instanceof ne)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: s } = this.buffer;
    return this.type = t || s.set.types[s.buffer[e]], this.from = i + s.buffer[e + 1], this.to = i + s.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof ne ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: s } = this.buffer, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.buffer.start, i);
    return r < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(r));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & L.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & L.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & L.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let s = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != s)
        return this.yieldBuf(t.findChild(
          s,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let s = t.buffer[this.index + 3];
      if (s < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(s);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: s } = this;
    if (s) {
      if (e > 0) {
        if (this.index < s.buffer.buffer.length)
          return !1;
      } else
        for (let r = 0; r < this.index; r++)
          if (s.buffer.buffer[r + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = s);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let r = t + e, o = e < 0 ? -1 : i._tree.children.length; r != o; r += e) {
          let l = i._tree.children[r];
          if (this.mode & L.IncludeAnonymous || l instanceof st || !l.type.isAnonymous || In(l))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e: for (let s = this.index, r = this.stack.length; r >= 0; ) {
        for (let o = e; o; o = o._parent)
          if (o.index == s) {
            if (s == this.index)
              return o;
            t = o, i = r + 1;
            break e;
          }
        s = this.stack[--r];
      }
    for (let s = i; s < this.stack.length; s++)
      t = new $e(this.buffer, t, this.stack[s]);
    return this.bufferNode = new $e(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let s = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (s = !0);
      }
      for (; ; ) {
        if (s && t && t(this), s = this.type.isAnonymous, !i)
          return;
        if (this.nextSibling())
          break;
        this.parent(), i--, s = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return Zs(this.node.parent, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let s = e.length - 1, r = this.stack.length - 1; s >= 0; r--) {
      if (r < 0)
        return Zs(this._tree, e, s);
      let o = i[t.buffer[this.stack[r]]];
      if (!o.isAnonymous) {
        if (e[s] && e[s] != o.name)
          return !1;
        s--;
      }
    }
    return !0;
  }
}
function In(n) {
  return n.children.some((e) => e instanceof st || !e.type.isAnonymous || In(e));
}
function Ya(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: s = 1024, reused: r = [], minRepeatType: o = i.types.length } = n, l = Array.isArray(t) ? new Bn(t, t.length) : t, a = i.types, h = 0, f = 0;
  function c(k, T, x, W, M, V) {
    let { id: q, start: C, end: I, size: z } = l, X = f, re = h;
    if (z < 0)
      if (l.next(), z == -1) {
        let Be = r[q];
        x.push(Be), W.push(C - k);
        return;
      } else if (z == -3) {
        h = q;
        return;
      } else if (z == -4) {
        f = q;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${z}`);
    let ue = a[q], Qe, K, me = C - k;
    if (I - C <= s && (K = m(l.pos - T, M))) {
      let Be = new Uint16Array(K.size - K.skip), Oe = l.pos - K.size, Pe = Be.length;
      for (; l.pos > Oe; )
        Pe = O(K.start, Be, Pe);
      Qe = new st(Be, I - K.start, i), me = K.start - k;
    } else {
      let Be = l.pos - z;
      l.next();
      let Oe = [], Pe = [], ht = q >= o ? q : -1, xt = 0, mi = I;
      for (; l.pos > Be; )
        ht >= 0 && l.id == ht && l.size >= 0 ? (l.end <= mi - s && (p(Oe, Pe, C, xt, l.end, mi, ht, X, re), xt = Oe.length, mi = l.end), l.next()) : V > 2500 ? u(C, Be, Oe, Pe) : c(C, Be, Oe, Pe, ht, V + 1);
      if (ht >= 0 && xt > 0 && xt < Oe.length && p(Oe, Pe, C, xt, C, mi, ht, X, re), Oe.reverse(), Pe.reverse(), ht > -1 && xt > 0) {
        let ar = d(ue, re);
        Qe = Nn(ue, Oe, Pe, 0, Oe.length, 0, I - C, ar, ar);
      } else
        Qe = g(ue, Oe, Pe, I - C, X - I, re);
    }
    x.push(Qe), W.push(me);
  }
  function u(k, T, x, W) {
    let M = [], V = 0, q = -1;
    for (; l.pos > T; ) {
      let { id: C, start: I, end: z, size: X } = l;
      if (X > 4)
        l.next();
      else {
        if (q > -1 && I < q)
          break;
        q < 0 && (q = z - s), M.push(C, I, z), V++, l.next();
      }
    }
    if (V) {
      let C = new Uint16Array(V * 4), I = M[M.length - 2];
      for (let z = M.length - 3, X = 0; z >= 0; z -= 3)
        C[X++] = M[z], C[X++] = M[z + 1] - I, C[X++] = M[z + 2] - I, C[X++] = X;
      x.push(new st(C, M[2] - I, i)), W.push(I - k);
    }
  }
  function d(k, T) {
    return (x, W, M) => {
      let V = 0, q = x.length - 1, C, I;
      if (q >= 0 && (C = x[q]) instanceof U) {
        if (!q && C.type == k && C.length == M)
          return C;
        (I = C.prop(E.lookAhead)) && (V = W[q] + C.length + I);
      }
      return g(k, x, W, M, V, T);
    };
  }
  function p(k, T, x, W, M, V, q, C, I) {
    let z = [], X = [];
    for (; k.length > W; )
      z.push(k.pop()), X.push(T.pop() + x - M);
    k.push(g(i.types[q], z, X, V - M, C - V, I)), T.push(M - x);
  }
  function g(k, T, x, W, M, V, q) {
    if (V) {
      let C = [E.contextHash, V];
      q = q ? [C].concat(q) : [C];
    }
    if (M > 25) {
      let C = [E.lookAhead, M];
      q = q ? [C].concat(q) : [C];
    }
    return new U(k, T, x, W, q);
  }
  function m(k, T) {
    let x = l.fork(), W = 0, M = 0, V = 0, q = x.end - s, C = { size: 0, start: 0, skip: 0 };
    e: for (let I = x.pos - k; x.pos > I; ) {
      let z = x.size;
      if (x.id == T && z >= 0) {
        C.size = W, C.start = M, C.skip = V, V += 4, W += 4, x.next();
        continue;
      }
      let X = x.pos - z;
      if (z < 0 || X < I || x.start < q)
        break;
      let re = x.id >= o ? 4 : 0, ue = x.start;
      for (x.next(); x.pos > X; ) {
        if (x.size < 0)
          if (x.size == -3 || x.size == -4)
            re += 4;
          else
            break e;
        else x.id >= o && (re += 4);
        x.next();
      }
      M = ue, W += z, V += re;
    }
    return (T < 0 || W == k) && (C.size = W, C.start = M, C.skip = V), C.size > 4 ? C : void 0;
  }
  function O(k, T, x) {
    let { id: W, start: M, end: V, size: q } = l;
    if (l.next(), q >= 0 && W < o) {
      let C = x;
      if (q > 4) {
        let I = l.pos - (q - 4);
        for (; l.pos > I; )
          x = O(k, T, x);
      }
      T[--x] = C, T[--x] = V - k, T[--x] = M - k, T[--x] = W;
    } else q == -3 ? h = W : q == -4 && (f = W);
    return x;
  }
  let b = [], Q = [];
  for (; l.pos > 0; )
    c(n.start || 0, n.bufferStart || 0, b, Q, -1, 0);
  let R = (e = n.length) !== null && e !== void 0 ? e : b.length ? Q[0] + b[0].length : 0;
  return new U(a[n.topID], b.reverse(), Q.reverse(), R);
}
const cr = /* @__PURE__ */ new WeakMap();
function Wi(n, e) {
  if (!n.isAnonymous || e instanceof st || e.type != n)
    return 1;
  let t = cr.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof U)) {
        t = 1;
        break;
      }
      t += Wi(n, i);
    }
    cr.set(e, t);
  }
  return t;
}
function Nn(n, e, t, i, s, r, o, l, a) {
  let h = 0;
  for (let p = i; p < s; p++)
    h += Wi(n, e[p]);
  let f = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), c = [], u = [];
  function d(p, g, m, O, b) {
    for (let Q = m; Q < O; ) {
      let R = Q, k = g[Q], T = Wi(n, p[Q]);
      for (Q++; Q < O; Q++) {
        let x = Wi(n, p[Q]);
        if (T + x >= f)
          break;
        T += x;
      }
      if (Q == R + 1) {
        if (T > f) {
          let x = p[R];
          d(x.children, x.positions, 0, x.children.length, g[R] + b);
          continue;
        }
        c.push(p[R]);
      } else {
        let x = g[Q - 1] + p[Q - 1].length - k;
        c.push(Nn(n, p, g, R, Q, k, x, null, a));
      }
      u.push(k + b - r);
    }
  }
  return d(e, t, i, s, 0), (l || a)(c, u, o);
}
class Ka {
  constructor() {
    this.map = /* @__PURE__ */ new WeakMap();
  }
  setBuffer(e, t, i) {
    let s = this.map.get(e);
    s || this.map.set(e, s = /* @__PURE__ */ new Map()), s.set(t, i);
  }
  getBuffer(e, t) {
    let i = this.map.get(e);
    return i && i.get(t);
  }
  /**
  Set the value for this syntax node.
  */
  set(e, t) {
    e instanceof $e ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof ne && this.map.set(e.tree, t);
  }
  /**
  Retrieve value for this syntax node, if it exists in the map.
  */
  get(e) {
    return e instanceof $e ? this.getBuffer(e.context.buffer, e.index) : e instanceof ne ? this.map.get(e.tree) : void 0;
  }
  /**
  Set the value for the node that a cursor currently points to.
  */
  cursorSet(e, t) {
    e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
  }
  /**
  Retrieve the value for the node that a cursor currently points
  to.
  */
  cursorGet(e) {
    return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
  }
}
class Ue {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, s, r = !1, o = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = s, this.open = (r ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let s = [new Ue(0, e.length, e, 0, !1, i)];
    for (let r of t)
      r.to > e.length && s.push(r);
    return s;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let s = [], r = 1, o = e.length ? e[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let f = l < t.length ? t[l] : null, c = f ? f.fromA : 1e9;
      if (c - a >= i)
        for (; o && o.from < c; ) {
          let u = o;
          if (a >= u.from || c <= u.to || h) {
            let d = Math.max(u.from, a) - h, p = Math.min(u.to, c) - h;
            u = d >= p ? null : new Ue(d, p, u.tree, u.offset + h, l > 0, !!f);
          }
          if (u && s.push(u), o.to > c)
            break;
          o = r < e.length ? e[r++] : null;
        }
      if (!f)
        break;
      a = f.toA, h = f.toA - f.toB;
    }
    return s;
  }
}
class jo {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new Ja(e)), i = i ? i.length ? i.map((s) => new be(s.from, s.to)) : [new be(0, 0)] : [new be(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let s = this.startParse(e, t, i);
    for (; ; ) {
      let r = s.advance();
      if (r)
        return r;
    }
  }
}
class Ja {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
function vp(n) {
  return (e, t, i, s) => new th(e, n, t, i, s);
}
class ur {
  constructor(e, t, i, s, r, o) {
    this.parser = e, this.parse = t, this.overlay = i, this.bracketed = s, this.target = r, this.from = o;
  }
}
function dr(n) {
  if (!n.length || n.some((e) => e.from >= e.to))
    throw new RangeError("Invalid inner parse ranges given: " + JSON.stringify(n));
}
class eh {
  constructor(e, t, i, s, r, o, l, a) {
    this.parser = e, this.predicate = t, this.mounts = i, this.index = s, this.start = r, this.bracketed = o, this.target = l, this.prev = a, this.depth = 0, this.ranges = [];
  }
}
const Ys = new E({ perNode: !0 });
class th {
  constructor(e, t, i, s, r) {
    this.nest = t, this.input = i, this.fragments = s, this.ranges = r, this.inner = [], this.innerDone = 0, this.baseTree = null, this.stoppedAt = null, this.baseParse = e;
  }
  advance() {
    if (this.baseParse) {
      let i = this.baseParse.advance();
      if (!i)
        return null;
      if (this.baseParse = null, this.baseTree = i, this.startInner(), this.stoppedAt != null)
        for (let s of this.inner)
          s.parse.stopAt(this.stoppedAt);
    }
    if (this.innerDone == this.inner.length) {
      let i = this.baseTree;
      return this.stoppedAt != null && (i = new U(i.type, i.children, i.positions, i.length, i.propValues.concat([[Ys, this.stoppedAt]]))), i;
    }
    let e = this.inner[this.innerDone], t = e.parse.advance();
    if (t) {
      this.innerDone++;
      let i = Object.assign(/* @__PURE__ */ Object.create(null), e.target.props);
      i[E.mounted.id] = new Pt(t, e.overlay, e.parser, e.bracketed), e.target.props = i;
    }
    return null;
  }
  get parsedPos() {
    if (this.baseParse)
      return 0;
    let e = this.input.length;
    for (let t = this.innerDone; t < this.inner.length; t++)
      this.inner[t].from < e && (e = Math.min(e, this.inner[t].parse.parsedPos));
    return e;
  }
  stopAt(e) {
    if (this.stoppedAt = e, this.baseParse)
      this.baseParse.stopAt(e);
    else
      for (let t = this.innerDone; t < this.inner.length; t++)
        this.inner[t].parse.stopAt(e);
  }
  startInner() {
    let e = new nh(this.fragments), t = null, i = null, s = new Hi(new ne(this.baseTree, this.ranges[0].from, 0, null), L.IncludeAnonymous | L.IgnoreMounts);
    e: for (let r, o; ; ) {
      let l = !0, a;
      if (this.stoppedAt != null && s.from >= this.stoppedAt)
        l = !1;
      else if (e.hasNode(s)) {
        if (t) {
          let h = t.mounts.find((f) => f.frag.from <= s.from && f.frag.to >= s.to && f.mount.overlay);
          if (h)
            for (let f of h.mount.overlay) {
              let c = f.from + h.pos, u = f.to + h.pos;
              c >= s.from && u <= s.to && !t.ranges.some((d) => d.from < u && d.to > c) && t.ranges.push({ from: c, to: u });
            }
        }
        l = !1;
      } else if (i && (o = ih(i.ranges, s.from, s.to)))
        l = o != 2;
      else if (!s.type.isAnonymous && (r = this.nest(s, this.input)) && (s.from < s.to || !r.overlay)) {
        s.tree || (sh(s), t && t.depth++, i && i.depth++);
        let h = e.findMounts(s.from, r.parser);
        if (typeof r.overlay == "function")
          t = new eh(r.parser, r.overlay, h, this.inner.length, s.from, !!r.bracketed, s.tree, t);
        else {
          let f = mr(this.ranges, r.overlay || (s.from < s.to ? [new be(s.from, s.to)] : []));
          f.length && dr(f), (f.length || !r.overlay) && this.inner.push(new ur(r.parser, f.length ? r.parser.startParse(this.input, Or(h, f), f) : r.parser.startParse(""), r.overlay ? r.overlay.map((c) => new be(c.from - s.from, c.to - s.from)) : null, !!r.bracketed, s.tree, f.length ? f[0].from : s.from)), r.overlay ? f.length && (i = { ranges: f, depth: 0, prev: i }) : l = !1;
        }
      } else if (t && (a = t.predicate(s)) && (a === !0 && (a = new be(s.from, s.to)), a.from < a.to)) {
        let h = t.ranges.length - 1;
        h >= 0 && t.ranges[h].to == a.from ? t.ranges[h] = { from: t.ranges[h].from, to: a.to } : t.ranges.push(a);
      }
      if (l && s.firstChild())
        t && t.depth++, i && i.depth++;
      else
        for (; !s.nextSibling(); ) {
          if (!s.parent())
            break e;
          if (t && !--t.depth) {
            let h = mr(this.ranges, t.ranges);
            h.length && (dr(h), this.inner.splice(t.index, 0, new ur(t.parser, t.parser.startParse(this.input, Or(t.mounts, h), h), t.ranges.map((f) => new be(f.from - t.start, f.to - t.start)), t.bracketed, t.target, h[0].from))), t = t.prev;
          }
          i && !--i.depth && (i = i.prev);
        }
    }
  }
}
function ih(n, e, t) {
  for (let i of n) {
    if (i.from >= t)
      break;
    if (i.to > e)
      return i.from <= e && i.to >= t ? 2 : 1;
  }
  return 0;
}
function pr(n, e, t, i, s, r) {
  if (e < t) {
    let o = n.buffer[e + 1];
    i.push(n.slice(e, t, o)), s.push(o - r);
  }
}
function sh(n) {
  let { node: e } = n, t = [], i = e.context.buffer;
  do
    t.push(n.index), n.parent();
  while (!n.tree);
  let s = n.tree, r = s.children.indexOf(i), o = s.children[r], l = o.buffer, a = [r];
  function h(f, c, u, d, p, g) {
    let m = t[g], O = [], b = [];
    pr(o, f, m, O, b, d);
    let Q = l[m + 1], R = l[m + 2];
    a.push(O.length);
    let k = g ? h(m + 4, l[m + 3], o.set.types[l[m]], Q, R - Q, g - 1) : e.toTree();
    return O.push(k), b.push(Q - d), pr(o, l[m + 3], c, O, b, d), new U(u, O, b, p);
  }
  s.children[r] = h(0, l.length, he.none, 0, o.length, t.length - 1);
  for (let f of a) {
    let c = n.tree.children[f], u = n.tree.positions[f];
    n.yield(new ne(c, u + n.from, f, n._tree));
  }
}
class gr {
  constructor(e, t) {
    this.offset = t, this.done = !1, this.cursor = e.cursor(L.IncludeAnonymous | L.IgnoreMounts);
  }
  // Move to the first node (in pre-order) that starts at or after `pos`.
  moveTo(e) {
    let { cursor: t } = this, i = e - this.offset;
    for (; !this.done && t.from < i; )
      if (!(t.to >= e && t.enter(i, 1, L.IgnoreOverlays | L.ExcludeBuffers))) if (t.to <= e)
        t.next(!1) || (this.done = !0);
      else
        break;
  }
  hasNode(e) {
    if (this.moveTo(e.from), !this.done && this.cursor.from + this.offset == e.from && this.cursor.tree)
      for (let t = this.cursor.tree; ; ) {
        if (t == e.tree)
          return !0;
        if (t.children.length && t.positions[0] == 0 && t.children[0] instanceof U)
          t = t.children[0];
        else
          break;
      }
    return !1;
  }
}
let nh = class {
  constructor(e) {
    var t;
    if (this.fragments = e, this.curTo = 0, this.fragI = 0, e.length) {
      let i = this.curFrag = e[0];
      this.curTo = (t = i.tree.prop(Ys)) !== null && t !== void 0 ? t : i.to, this.inner = new gr(i.tree, -i.offset);
    } else
      this.curFrag = this.inner = null;
  }
  hasNode(e) {
    for (; this.curFrag && e.from >= this.curTo; )
      this.nextFrag();
    return this.curFrag && this.curFrag.from <= e.from && this.curTo >= e.to && this.inner.hasNode(e);
  }
  nextFrag() {
    var e;
    if (this.fragI++, this.fragI == this.fragments.length)
      this.curFrag = this.inner = null;
    else {
      let t = this.curFrag = this.fragments[this.fragI];
      this.curTo = (e = t.tree.prop(Ys)) !== null && e !== void 0 ? e : t.to, this.inner = new gr(t.tree, -t.offset);
    }
  }
  findMounts(e, t) {
    var i;
    let s = [];
    if (this.inner) {
      this.inner.cursor.moveTo(e, 1);
      for (let r = this.inner.cursor.node; r; r = r.parent) {
        let o = (i = r.tree) === null || i === void 0 ? void 0 : i.prop(E.mounted);
        if (o && o.parser == t)
          for (let l = this.fragI; l < this.fragments.length; l++) {
            let a = this.fragments[l];
            if (a.from >= r.to)
              break;
            a.tree == this.curFrag.tree && s.push({
              frag: a,
              pos: r.from - a.offset,
              mount: o
            });
          }
      }
    }
    return s;
  }
};
function mr(n, e) {
  let t = null, i = e;
  for (let s = 1, r = 0; s < n.length; s++) {
    let o = n[s - 1].to, l = n[s].from;
    for (; r < i.length; r++) {
      let a = i[r];
      if (a.from >= l)
        break;
      a.to <= o || (t || (i = t = e.slice()), a.from < o ? (t[r] = new be(a.from, o), a.to > l && t.splice(r + 1, 0, new be(l, a.to))) : a.to > l ? t[r--] = new be(l, a.to) : t.splice(r--, 1));
    }
  }
  return i;
}
function rh(n, e, t, i) {
  let s = 0, r = 0, o = !1, l = !1, a = -1e9, h = [];
  for (; ; ) {
    let f = s == n.length ? 1e9 : o ? n[s].to : n[s].from, c = r == e.length ? 1e9 : l ? e[r].to : e[r].from;
    if (o != l) {
      let u = Math.max(a, t), d = Math.min(f, c, i);
      u < d && h.push(new be(u, d));
    }
    if (a = Math.min(f, c), a == 1e9)
      break;
    f == a && (o ? (o = !1, s++) : o = !0), c == a && (l ? (l = !1, r++) : l = !0);
  }
  return h;
}
function Or(n, e) {
  let t = [];
  for (let { pos: i, mount: s, frag: r } of n) {
    let o = i + (s.overlay ? s.overlay[0].from : 0), l = o + s.tree.length, a = Math.max(r.from, o), h = Math.min(r.to, l);
    if (s.overlay) {
      let f = s.overlay.map((u) => new be(u.from + i, u.to + i)), c = rh(e, f, a, h);
      for (let u = 0, d = a; ; u++) {
        let p = u == c.length, g = p ? h : c[u].from;
        if (g > d && t.push(new Ue(d, g, s.tree, -o, r.from >= d || r.openStart, r.to <= g || r.openEnd)), p)
          break;
        d = c[u].to;
      }
    } else
      t.push(new Ue(a, h, s.tree, -o, r.from >= o || r.openStart, r.to <= l || r.openEnd));
  }
  return t;
}
class Gi {
  /**
  @internal
  */
  constructor(e, t, i, s, r, o, l, a, h, f = 0, c) {
    this.p = e, this.stack = t, this.state = i, this.reducePos = s, this.pos = r, this.score = o, this.buffer = l, this.bufferBase = a, this.curContext = h, this.lookAhead = f, this.parent = c;
  }
  /**
  @internal
  */
  toString() {
    return `[${this.stack.filter((e, t) => t % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
  }
  // Start an empty stack
  /**
  @internal
  */
  static start(e, t, i = 0) {
    let s = e.parser.context;
    return new Gi(e, [], t, i, i, 0, [], 0, s ? new yr(s, s.start) : null, 0, null);
  }
  /**
  The stack's current [context](#lr.ContextTracker) value, if
  any. Its type will depend on the context tracker's type
  parameter, or it will be `null` if there is no context
  tracker.
  */
  get context() {
    return this.curContext ? this.curContext.context : null;
  }
  // Push a state onto the stack, tracking its start position as well
  // as the buffer base at that point.
  /**
  @internal
  */
  pushState(e, t) {
    this.stack.push(this.state, t, this.bufferBase + this.buffer.length), this.state = e;
  }
  // Apply a reduce action
  /**
  @internal
  */
  reduce(e) {
    var t;
    let i = e >> 19, s = e & 65535, { parser: r } = this.p, o = this.reducePos < this.pos - 25 && this.setLookAhead(this.pos), l = r.dynamicPrecedence(s);
    if (l && (this.score += l), i == 0) {
      s < r.minRepeatTerm && this.reducePos < this.pos && (this.reducePos = this.pos), this.pushState(r.getGoto(this.state, s, !0), this.reducePos), s < r.minRepeatTerm && this.storeNode(s, this.reducePos, this.reducePos, o ? 8 : 4, !0), this.reduceContext(s, this.reducePos);
      return;
    }
    let a = this.stack.length - (i - 1) * 3 - (e & 262144 ? 6 : 0), h = a ? this.stack[a - 2] : this.p.ranges[0].from;
    s < r.minRepeatTerm && h == this.reducePos && this.reducePos < this.pos && (this.reducePos = this.pos);
    let f = this.reducePos - h;
    f >= 2e3 && !(!((t = this.p.parser.nodeSet.types[s]) === null || t === void 0) && t.isAnonymous) && (h == this.p.lastBigReductionStart ? (this.p.bigReductionCount++, this.p.lastBigReductionSize = f) : this.p.lastBigReductionSize < f && (this.p.bigReductionCount = 1, this.p.lastBigReductionStart = h, this.p.lastBigReductionSize = f));
    let c = a ? this.stack[a - 1] : 0, u = this.bufferBase + this.buffer.length - c;
    if (s < r.minRepeatTerm || e & 131072) {
      let d = r.stateFlag(
        this.state,
        1
        /* StateFlag.Skipped */
      ) ? this.pos : this.reducePos;
      this.storeNode(s, h, d, u + 4, !0);
    }
    if (e & 262144)
      this.state = this.stack[a];
    else {
      let d = this.stack[a - 3];
      this.state = r.getGoto(d, s, !0);
    }
    for (; this.stack.length > a; )
      this.stack.pop();
    this.reduceContext(s, h);
  }
  // Shift a value into the buffer
  /**
  @internal
  */
  storeNode(e, t, i, s = 4, r = !1) {
    if (e == 0 && (!this.stack.length || this.stack[this.stack.length - 1] < this.buffer.length + this.bufferBase)) {
      let o = this.buffer.length;
      if (o > 0 && this.buffer[o - 4] == 0 && this.buffer[o - 1] > -1) {
        if (t == i)
          return;
        if (this.buffer[o - 2] >= t) {
          this.buffer[o - 2] = i;
          return;
        }
      }
    }
    if (!r || this.pos == i)
      this.buffer.push(e, t, i, s);
    else {
      let o = this.buffer.length;
      if (o > 0 && (this.buffer[o - 4] != 0 || this.buffer[o - 1] < 0)) {
        let l = !1;
        for (let a = o; a > 0 && this.buffer[a - 2] > i; a -= 4)
          if (this.buffer[a - 1] >= 0) {
            l = !0;
            break;
          }
        if (l)
          for (; o > 0 && this.buffer[o - 2] > i; )
            this.buffer[o] = this.buffer[o - 4], this.buffer[o + 1] = this.buffer[o - 3], this.buffer[o + 2] = this.buffer[o - 2], this.buffer[o + 3] = this.buffer[o - 1], o -= 4, s > 4 && (s -= 4);
      }
      this.buffer[o] = e, this.buffer[o + 1] = t, this.buffer[o + 2] = i, this.buffer[o + 3] = s;
    }
  }
  // Apply a shift action
  /**
  @internal
  */
  shift(e, t, i, s) {
    if (e & 131072)
      this.pushState(e & 65535, this.pos);
    else if ((e & 262144) == 0) {
      let r = e, { parser: o } = this.p;
      this.pos = s;
      let l = o.stateFlag(
        r,
        1
        /* StateFlag.Skipped */
      );
      !l && (s > i || t <= o.maxNode) && (this.reducePos = s), this.pushState(r, l ? i : Math.min(i, this.reducePos)), this.shiftContext(t, i), t <= o.maxNode && this.buffer.push(t, i, s, 4);
    } else
      this.pos = s, this.shiftContext(t, i), t <= this.p.parser.maxNode && this.buffer.push(t, i, s, 4);
  }
  // Apply an action
  /**
  @internal
  */
  apply(e, t, i, s) {
    e & 65536 ? this.reduce(e) : this.shift(e, t, i, s);
  }
  // Add a prebuilt (reused) node into the buffer.
  /**
  @internal
  */
  useNode(e, t) {
    let i = this.p.reused.length - 1;
    (i < 0 || this.p.reused[i] != e) && (this.p.reused.push(e), i++);
    let s = this.pos;
    this.reducePos = this.pos = s + e.length, this.pushState(t, s), this.buffer.push(
      i,
      s,
      this.reducePos,
      -1
      /* size == -1 means this is a reused value */
    ), this.curContext && this.updateContext(this.curContext.tracker.reuse(this.curContext.context, e, this, this.p.stream.reset(this.pos - e.length)));
  }
  // Split the stack. Due to the buffer sharing and the fact
  // that `this.stack` tends to stay quite shallow, this isn't very
  // expensive.
  /**
  @internal
  */
  split() {
    let e = this, t = e.buffer.length;
    for (t && e.buffer[t - 4] == 0 && (t -= 4); t > 0 && e.buffer[t - 2] > e.reducePos; )
      t -= 4;
    let i = e.buffer.slice(t), s = e.bufferBase + t;
    for (; e && s == e.bufferBase; )
      e = e.parent;
    return new Gi(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, i, s, this.curContext, this.lookAhead, e);
  }
  // Try to recover from an error by 'deleting' (ignoring) one token.
  /**
  @internal
  */
  recoverByDelete(e, t) {
    let i = e <= this.p.parser.maxNode;
    i && this.storeNode(e, this.pos, t, 4), this.storeNode(0, this.pos, t, i ? 8 : 4), this.pos = this.reducePos = t, this.score -= 190;
  }
  /**
  Check if the given term would be able to be shifted (optionally
  after some reductions) on this stack. This can be useful for
  external tokenizers that want to make sure they only provide a
  given token when it applies.
  */
  canShift(e) {
    for (let t = new oh(this); ; ) {
      let i = this.p.parser.stateSlot(
        t.state,
        4
        /* ParseState.DefaultReduce */
      ) || this.p.parser.hasAction(t.state, e);
      if (i == 0)
        return !1;
      if ((i & 65536) == 0)
        return !0;
      t.reduce(i);
    }
  }
  // Apply up to Recover.MaxNext recovery actions that conceptually
  // inserts some missing token or rule.
  /**
  @internal
  */
  recoverByInsert(e) {
    if (this.stack.length >= 300)
      return [];
    let t = this.p.parser.nextStates(this.state);
    if (t.length > 8 || this.stack.length >= 120) {
      let s = [];
      for (let r = 0, o; r < t.length; r += 2)
        (o = t[r + 1]) != this.state && this.p.parser.hasAction(o, e) && s.push(t[r], o);
      if (this.stack.length < 120)
        for (let r = 0; s.length < 8 && r < t.length; r += 2) {
          let o = t[r + 1];
          s.some((l, a) => a & 1 && l == o) || s.push(t[r], o);
        }
      t = s;
    }
    let i = [];
    for (let s = 0; s < t.length && i.length < 4; s += 2) {
      let r = t[s + 1];
      if (r == this.state)
        continue;
      let o = this.split();
      o.pushState(r, this.pos), o.storeNode(0, o.pos, o.pos, 4, !0), o.shiftContext(t[s], this.pos), o.reducePos = this.pos, o.score -= 200, i.push(o);
    }
    return i;
  }
  // Force a reduce, if possible. Return false if that can't
  // be done.
  /**
  @internal
  */
  forceReduce() {
    let { parser: e } = this.p, t = e.stateSlot(
      this.state,
      5
      /* ParseState.ForcedReduce */
    );
    if ((t & 65536) == 0)
      return !1;
    if (!e.validAction(this.state, t)) {
      let i = t >> 19, s = t & 65535, r = this.stack.length - i * 3;
      if (r < 0 || e.getGoto(this.stack[r], s, !1) < 0) {
        let o = this.findForcedReduction();
        if (o == null)
          return !1;
        t = o;
      }
      this.storeNode(0, this.pos, this.pos, 4, !0), this.score -= 100;
    }
    return this.reducePos = this.pos, this.reduce(t), !0;
  }
  /**
  Try to scan through the automaton to find some kind of reduction
  that can be applied. Used when the regular ForcedReduce field
  isn't a valid action. @internal
  */
  findForcedReduction() {
    let { parser: e } = this.p, t = [], i = (s, r) => {
      if (!t.includes(s))
        return t.push(s), e.allActions(s, (o) => {
          if (!(o & 393216)) if (o & 65536) {
            let l = (o >> 19) - r;
            if (l > 1) {
              let a = o & 65535, h = this.stack.length - l * 3;
              if (h >= 0 && e.getGoto(this.stack[h], a, !1) >= 0)
                return l << 19 | 65536 | a;
            }
          } else {
            let l = i(o, r + 1);
            if (l != null)
              return l;
          }
        });
    };
    return i(this.state, 0);
  }
  /**
  @internal
  */
  forceAll() {
    for (; !this.p.parser.stateFlag(
      this.state,
      2
      /* StateFlag.Accepting */
    ); )
      if (!this.forceReduce()) {
        this.storeNode(0, this.pos, this.pos, 4, !0);
        break;
      }
    return this;
  }
  /**
  Check whether this state has no further actions (assumed to be a direct descendant of the
  top state, since any other states must be able to continue
  somehow). @internal
  */
  get deadEnd() {
    if (this.stack.length != 3)
      return !1;
    let { parser: e } = this.p;
    return e.data[e.stateSlot(
      this.state,
      1
      /* ParseState.Actions */
    )] == 65535 && !e.stateSlot(
      this.state,
      4
      /* ParseState.DefaultReduce */
    );
  }
  /**
  Restart the stack (put it back in its start state). Only safe
  when this.stack.length == 3 (state is directly below the top
  state). @internal
  */
  restart() {
    this.storeNode(0, this.pos, this.pos, 4, !0), this.state = this.stack[0], this.stack.length = 0;
  }
  /**
  @internal
  */
  sameState(e) {
    if (this.state != e.state || this.stack.length != e.stack.length)
      return !1;
    for (let t = 0; t < this.stack.length; t += 3)
      if (this.stack[t] != e.stack[t])
        return !1;
    return !0;
  }
  /**
  Get the parser used by this stack.
  */
  get parser() {
    return this.p.parser;
  }
  /**
  Test whether a given dialect (by numeric ID, as exported from
  the terms file) is enabled.
  */
  dialectEnabled(e) {
    return this.p.parser.dialect.flags[e];
  }
  shiftContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.shift(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  reduceContext(e, t) {
    this.curContext && this.updateContext(this.curContext.tracker.reduce(this.curContext.context, e, this, this.p.stream.reset(t)));
  }
  /**
  @internal
  */
  emitContext() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -3) && this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
  }
  /**
  @internal
  */
  emitLookAhead() {
    let e = this.buffer.length - 1;
    (e < 0 || this.buffer[e] != -4) && this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
  }
  updateContext(e) {
    if (e != this.curContext.context) {
      let t = new yr(this.curContext.tracker, e);
      t.hash != this.curContext.hash && this.emitContext(), this.curContext = t;
    }
  }
  /**
  @internal
  */
  setLookAhead(e) {
    return e <= this.lookAhead ? !1 : (this.emitLookAhead(), this.lookAhead = e, !0);
  }
  /**
  @internal
  */
  close() {
    this.curContext && this.curContext.tracker.strict && this.emitContext(), this.lookAhead > 0 && this.emitLookAhead();
  }
}
class yr {
  constructor(e, t) {
    this.tracker = e, this.context = t, this.hash = e.strict ? e.hash(t) : 0;
  }
}
class oh {
  constructor(e) {
    this.start = e, this.state = e.state, this.stack = e.stack, this.base = this.stack.length;
  }
  reduce(e) {
    let t = e & 65535, i = e >> 19;
    i == 0 ? (this.stack == this.start.stack && (this.stack = this.stack.slice()), this.stack.push(this.state, 0, 0), this.base += 3) : this.base -= (i - 1) * 3;
    let s = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
    this.state = s;
  }
}
class Zi {
  constructor(e, t, i) {
    this.stack = e, this.pos = t, this.index = i, this.buffer = e.buffer, this.index == 0 && this.maybeNext();
  }
  static create(e, t = e.bufferBase + e.buffer.length) {
    return new Zi(e, t, t - e.bufferBase);
  }
  maybeNext() {
    let e = this.stack.parent;
    e != null && (this.index = this.stack.bufferBase - e.bufferBase, this.stack = e, this.buffer = e.buffer);
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  next() {
    this.index -= 4, this.pos -= 4, this.index == 0 && this.maybeNext();
  }
  fork() {
    return new Zi(this.stack, this.pos, this.index);
  }
}
function jt(n, e = Uint16Array) {
  if (typeof n != "string")
    return n;
  let t = null;
  for (let i = 0, s = 0; i < n.length; ) {
    let r = 0;
    for (; ; ) {
      let o = n.charCodeAt(i++), l = !1;
      if (o == 126) {
        r = 65535;
        break;
      }
      o >= 92 && o--, o >= 34 && o--;
      let a = o - 32;
      if (a >= 46 && (a -= 46, l = !0), r += a, l)
        break;
      r *= 46;
    }
    t ? t[s++] = r : t = new e(r);
  }
  return t;
}
class Di {
  constructor() {
    this.start = -1, this.value = -1, this.end = -1, this.extended = -1, this.lookAhead = 0, this.mask = 0, this.context = 0;
  }
}
const br = new Di();
class lh {
  /**
  @internal
  */
  constructor(e, t) {
    this.input = e, this.ranges = t, this.chunk = "", this.chunkOff = 0, this.chunk2 = "", this.chunk2Pos = 0, this.next = -1, this.token = br, this.rangeIndex = 0, this.pos = this.chunkPos = t[0].from, this.range = t[0], this.end = t[t.length - 1].to, this.readNext();
  }
  /**
  @internal
  */
  resolveOffset(e, t) {
    let i = this.range, s = this.rangeIndex, r = this.pos + e;
    for (; r < i.from; ) {
      if (!s)
        return null;
      let o = this.ranges[--s];
      r -= i.from - o.to, i = o;
    }
    for (; t < 0 ? r > i.to : r >= i.to; ) {
      if (s == this.ranges.length - 1)
        return null;
      let o = this.ranges[++s];
      r += o.from - i.to, i = o;
    }
    return r;
  }
  /**
  @internal
  */
  clipPos(e) {
    if (e >= this.range.from && e < this.range.to)
      return e;
    for (let t of this.ranges)
      if (t.to > e)
        return Math.max(e, t.from);
    return this.end;
  }
  /**
  Look at a code unit near the stream position. `.peek(0)` equals
  `.next`, `.peek(-1)` gives you the previous character, and so
  on.
  
  Note that looking around during tokenizing creates dependencies
  on potentially far-away content, which may reduce the
  effectiveness incremental parsing—when looking forward—or even
  cause invalid reparses when looking backward more than 25 code
  units, since the library does not track lookbehind.
  */
  peek(e) {
    let t = this.chunkOff + e, i, s;
    if (t >= 0 && t < this.chunk.length)
      i = this.pos + e, s = this.chunk.charCodeAt(t);
    else {
      let r = this.resolveOffset(e, 1);
      if (r == null)
        return -1;
      if (i = r, i >= this.chunk2Pos && i < this.chunk2Pos + this.chunk2.length)
        s = this.chunk2.charCodeAt(i - this.chunk2Pos);
      else {
        let o = this.rangeIndex, l = this.range;
        for (; l.to <= i; )
          l = this.ranges[++o];
        this.chunk2 = this.input.chunk(this.chunk2Pos = i), i + this.chunk2.length > l.to && (this.chunk2 = this.chunk2.slice(0, l.to - i)), s = this.chunk2.charCodeAt(0);
      }
    }
    return i >= this.token.lookAhead && (this.token.lookAhead = i + 1), s;
  }
  /**
  Accept a token. By default, the end of the token is set to the
  current stream position, but you can pass an offset (relative to
  the stream position) to change that.
  */
  acceptToken(e, t = 0) {
    let i = t ? this.resolveOffset(t, -1) : this.pos;
    if (i == null || i < this.token.start)
      throw new RangeError("Token end out of bounds");
    this.token.value = e, this.token.end = i;
  }
  /**
  Accept a token ending at a specific given position.
  */
  acceptTokenTo(e, t) {
    this.token.value = e, this.token.end = t;
  }
  getChunk() {
    if (this.pos >= this.chunk2Pos && this.pos < this.chunk2Pos + this.chunk2.length) {
      let { chunk: e, chunkPos: t } = this;
      this.chunk = this.chunk2, this.chunkPos = this.chunk2Pos, this.chunk2 = e, this.chunk2Pos = t, this.chunkOff = this.pos - this.chunkPos;
    } else {
      this.chunk2 = this.chunk, this.chunk2Pos = this.chunkPos;
      let e = this.input.chunk(this.pos), t = this.pos + e.length;
      this.chunk = t > this.range.to ? e.slice(0, this.range.to - this.pos) : e, this.chunkPos = this.pos, this.chunkOff = 0;
    }
  }
  readNext() {
    return this.chunkOff >= this.chunk.length && (this.getChunk(), this.chunkOff == this.chunk.length) ? this.next = -1 : this.next = this.chunk.charCodeAt(this.chunkOff);
  }
  /**
  Move the stream forward N (defaults to 1) code units. Returns
  the new value of [`next`](#lr.InputStream.next).
  */
  advance(e = 1) {
    for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
      if (this.rangeIndex == this.ranges.length - 1)
        return this.setDone();
      e -= this.range.to - this.pos, this.range = this.ranges[++this.rangeIndex], this.pos = this.range.from;
    }
    return this.pos += e, this.pos >= this.token.lookAhead && (this.token.lookAhead = this.pos + 1), this.readNext();
  }
  setDone() {
    return this.pos = this.chunkPos = this.end, this.range = this.ranges[this.rangeIndex = this.ranges.length - 1], this.chunk = "", this.next = -1;
  }
  /**
  @internal
  */
  reset(e, t) {
    if (t ? (this.token = t, t.start = e, t.lookAhead = e + 1, t.value = t.extended = -1) : this.token = br, this.pos != e) {
      if (this.pos = e, e == this.end)
        return this.setDone(), this;
      for (; e < this.range.from; )
        this.range = this.ranges[--this.rangeIndex];
      for (; e >= this.range.to; )
        this.range = this.ranges[++this.rangeIndex];
      e >= this.chunkPos && e < this.chunkPos + this.chunk.length ? this.chunkOff = e - this.chunkPos : (this.chunk = "", this.chunkOff = 0), this.readNext();
    }
    return this;
  }
  /**
  @internal
  */
  read(e, t) {
    if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
      return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
    if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
      return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
    if (e >= this.range.from && t <= this.range.to)
      return this.input.read(e, t);
    let i = "";
    for (let s of this.ranges) {
      if (s.from >= t)
        break;
      s.to > e && (i += this.input.read(Math.max(s.from, e), Math.min(s.to, t)));
    }
    return i;
  }
}
class Ct {
  constructor(e, t) {
    this.data = e, this.id = t;
  }
  token(e, t) {
    let { parser: i } = t.p;
    Uo(this.data, e, t, this.id, i.data, i.tokenPrecTable);
  }
}
Ct.prototype.contextual = Ct.prototype.fallback = Ct.prototype.extend = !1;
class ah {
  constructor(e, t, i) {
    this.precTable = t, this.elseToken = i, this.data = typeof e == "string" ? jt(e) : e;
  }
  token(e, t) {
    let i = e.pos, s = 0;
    for (; ; ) {
      let r = e.next < 0, o = e.resolveOffset(1, 1);
      if (Uo(this.data, e, t, 0, this.data, this.precTable), e.token.value > -1)
        break;
      if (this.elseToken == null)
        return;
      if (r || s++, o == null)
        break;
      e.reset(o, e.token);
    }
    s && (e.reset(i, e.token), e.acceptToken(this.elseToken, s));
  }
}
ah.prototype.contextual = Ct.prototype.fallback = Ct.prototype.extend = !1;
class us {
  /**
  Create a tokenizer. The first argument is the function that,
  given an input stream, scans for the types of tokens it
  recognizes at the stream's position, and calls
  [`acceptToken`](#lr.InputStream.acceptToken) when it finds
  one.
  */
  constructor(e, t = {}) {
    this.token = e, this.contextual = !!t.contextual, this.fallback = !!t.fallback, this.extend = !!t.extend;
  }
}
function Uo(n, e, t, i, s, r) {
  let o = 0, l = 1 << i, { dialect: a } = t.p.parser;
  e: for (; (l & n[o]) != 0; ) {
    let h = n[o + 1];
    for (let d = o + 3; d < h; d += 2)
      if ((n[d + 1] & l) > 0) {
        let p = n[d];
        if (a.allows(p) && (e.token.value == -1 || e.token.value == p || hh(p, e.token.value, s, r))) {
          e.acceptToken(p);
          break;
        }
      }
    let f = e.next, c = 0, u = n[o + 2];
    if (e.next < 0 && u > c && n[h + u * 3 - 3] == 65535) {
      o = n[h + u * 3 - 1];
      continue e;
    }
    for (; c < u; ) {
      let d = c + u >> 1, p = h + d + (d << 1), g = n[p], m = n[p + 1] || 65536;
      if (f < g)
        u = d;
      else if (f >= m)
        c = d + 1;
      else {
        o = n[p + 2], e.advance();
        continue e;
      }
    }
    break;
  }
}
function Sr(n, e, t) {
  for (let i = e, s; (s = n[i]) != 65535; i++)
    if (s == t)
      return i - e;
  return -1;
}
function hh(n, e, t, i) {
  let s = Sr(t, i, e);
  return s < 0 || Sr(t, i, n) < s;
}
const de = typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG);
let ws = null;
function xr(n, e, t) {
  let i = n.cursor(L.IncludeAnonymous);
  for (i.moveTo(e); ; )
    if (!(t < 0 ? i.childBefore(e) : i.childAfter(e)))
      for (; ; ) {
        if ((t < 0 ? i.to < e : i.from > e) && !i.type.isError)
          return t < 0 ? Math.max(0, Math.min(
            i.to - 1,
            e - 25
            /* Lookahead.Margin */
          )) : Math.min(n.length, Math.max(
            i.from + 1,
            e + 25
            /* Lookahead.Margin */
          ));
        if (t < 0 ? i.prevSibling() : i.nextSibling())
          break;
        if (!i.parent())
          return t < 0 ? 0 : n.length;
      }
}
class fh {
  constructor(e, t) {
    this.fragments = e, this.nodeSet = t, this.i = 0, this.fragment = null, this.safeFrom = -1, this.safeTo = -1, this.trees = [], this.start = [], this.index = [], this.nextFragment();
  }
  nextFragment() {
    let e = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
    if (e) {
      for (this.safeFrom = e.openStart ? xr(e.tree, e.from + e.offset, 1) - e.offset : e.from, this.safeTo = e.openEnd ? xr(e.tree, e.to + e.offset, -1) - e.offset : e.to; this.trees.length; )
        this.trees.pop(), this.start.pop(), this.index.pop();
      this.trees.push(e.tree), this.start.push(-e.offset), this.index.push(0), this.nextStart = this.safeFrom;
    } else
      this.nextStart = 1e9;
  }
  // `pos` must be >= any previously given `pos` for this cursor
  nodeAt(e) {
    if (e < this.nextStart)
      return null;
    for (; this.fragment && this.safeTo <= e; )
      this.nextFragment();
    if (!this.fragment)
      return null;
    for (; ; ) {
      let t = this.trees.length - 1;
      if (t < 0)
        return this.nextFragment(), null;
      let i = this.trees[t], s = this.index[t];
      if (s == i.children.length) {
        this.trees.pop(), this.start.pop(), this.index.pop();
        continue;
      }
      let r = i.children[s], o = this.start[t] + i.positions[s];
      if (o > e)
        return this.nextStart = o, null;
      if (r instanceof U) {
        if (o == e) {
          if (o < this.safeFrom)
            return null;
          let l = o + r.length;
          if (l <= this.safeTo) {
            let a = r.prop(E.lookAhead);
            if (!a || l + a < this.fragment.to)
              return r;
          }
        }
        this.index[t]++, o + r.length >= Math.max(this.safeFrom, e) && (this.trees.push(r), this.start.push(o), this.index.push(0));
      } else
        this.index[t]++, this.nextStart = o + r.length;
    }
  }
}
class ch {
  constructor(e, t) {
    this.stream = t, this.tokens = [], this.mainToken = null, this.actions = [], this.tokens = e.tokenizers.map((i) => new Di());
  }
  getActions(e) {
    let t = 0, i = null, { parser: s } = e.p, { tokenizers: r } = s, o = s.stateSlot(
      e.state,
      3
      /* ParseState.TokenizerMask */
    ), l = e.curContext ? e.curContext.hash : 0, a = 0;
    for (let h = 0; h < r.length; h++) {
      if ((1 << h & o) == 0)
        continue;
      let f = r[h], c = this.tokens[h];
      if (!(i && !f.fallback) && ((f.contextual || c.start != e.pos || c.mask != o || c.context != l) && (this.updateCachedToken(c, f, e), c.mask = o, c.context = l), c.lookAhead > c.end + 25 && (a = Math.max(c.lookAhead, a)), c.value != 0)) {
        let u = t;
        if (c.extended > -1 && (t = this.addActions(e, c.extended, c.end, t)), t = this.addActions(e, c.value, c.end, t), !f.extend && (i = c, t > u))
          break;
      }
    }
    for (; this.actions.length > t; )
      this.actions.pop();
    return a && e.setLookAhead(a), !i && e.pos == this.stream.end && (i = new Di(), i.value = e.p.parser.eofTerm, i.start = i.end = e.pos, t = this.addActions(e, i.value, i.end, t)), this.mainToken = i, this.actions;
  }
  getMainToken(e) {
    if (this.mainToken)
      return this.mainToken;
    let t = new Di(), { pos: i, p: s } = e;
    return t.start = i, t.end = Math.min(i + 1, s.stream.end), t.value = i == s.stream.end ? s.parser.eofTerm : 0, t;
  }
  updateCachedToken(e, t, i) {
    let s = this.stream.clipPos(i.pos);
    if (t.token(this.stream.reset(s, e), i), e.value > -1) {
      let { parser: r } = i.p;
      for (let o = 0; o < r.specialized.length; o++)
        if (r.specialized[o] == e.value) {
          let l = r.specializers[o](this.stream.read(e.start, e.end), i);
          if (l >= 0 && i.p.parser.dialect.allows(l >> 1)) {
            (l & 1) == 0 ? e.value = l >> 1 : e.extended = l >> 1;
            break;
          }
        }
    } else
      e.value = 0, e.end = this.stream.clipPos(s + 1);
  }
  putAction(e, t, i, s) {
    for (let r = 0; r < s; r += 3)
      if (this.actions[r] == e)
        return s;
    return this.actions[s++] = e, this.actions[s++] = t, this.actions[s++] = i, s;
  }
  addActions(e, t, i, s) {
    let { state: r } = e, { parser: o } = e.p, { data: l } = o;
    for (let a = 0; a < 2; a++)
      for (let h = o.stateSlot(
        r,
        a ? 2 : 1
        /* ParseState.Actions */
      ); ; h += 3) {
        if (l[h] == 65535)
          if (l[h + 1] == 1)
            h = Xe(l, h + 2);
          else {
            s == 0 && l[h + 1] == 2 && (s = this.putAction(Xe(l, h + 2), t, i, s));
            break;
          }
        l[h] == t && (s = this.putAction(Xe(l, h + 1), t, i, s));
      }
    return s;
  }
}
class uh {
  constructor(e, t, i, s) {
    this.parser = e, this.input = t, this.ranges = s, this.recovering = 0, this.nextStackID = 9812, this.minStackPos = 0, this.reused = [], this.stoppedAt = null, this.lastBigReductionStart = -1, this.lastBigReductionSize = 0, this.bigReductionCount = 0, this.stream = new lh(t, s), this.tokens = new ch(e, this.stream), this.topTerm = e.top[1];
    let { from: r } = s[0];
    this.stacks = [Gi.start(this, e.top[0], r)], this.fragments = i.length && this.stream.end - r > e.bufferLength * 4 ? new fh(i, e.nodeSet) : null;
  }
  get parsedPos() {
    return this.minStackPos;
  }
  // Move the parser forward. This will process all parse stacks at
  // `this.pos` and try to advance them to a further position. If no
  // stack for such a position is found, it'll start error-recovery.
  //
  // When the parse is finished, this will return a syntax tree. When
  // not, it returns `null`.
  advance() {
    let e = this.stacks, t = this.minStackPos, i = this.stacks = [], s, r;
    if (this.bigReductionCount > 300 && e.length == 1) {
      let [o] = e;
      for (; o.forceReduce() && o.stack.length && o.stack[o.stack.length - 2] >= this.lastBigReductionStart; )
        ;
      this.bigReductionCount = this.lastBigReductionSize = 0;
    }
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      for (; ; ) {
        if (this.tokens.mainToken = null, l.pos > t)
          i.push(l);
        else {
          if (this.advanceStack(l, i, e))
            continue;
          {
            s || (s = [], r = []), s.push(l);
            let a = this.tokens.getMainToken(l);
            r.push(a.value, a.end);
          }
        }
        break;
      }
    }
    if (!i.length) {
      let o = s && gh(s);
      if (o)
        return de && console.log("Finish with " + this.stackID(o)), this.stackToTree(o);
      if (this.parser.strict)
        throw de && s && console.log("Stuck with token " + (this.tokens.mainToken ? this.parser.getName(this.tokens.mainToken.value) : "none")), new SyntaxError("No parse at " + t);
      this.recovering || (this.recovering = 5);
    }
    if (this.recovering && s) {
      let o = this.stoppedAt != null && s[0].pos > this.stoppedAt ? s[0] : this.runRecovery(s, r, i);
      if (o)
        return de && console.log("Force-finish " + this.stackID(o)), this.stackToTree(o.forceAll());
    }
    if (this.recovering) {
      let o = this.recovering == 1 ? 1 : this.recovering * 3;
      if (i.length > o)
        for (i.sort((l, a) => a.score - l.score); i.length > o; )
          i.pop();
      i.some((l) => l.reducePos > t) && this.recovering--;
    } else if (i.length > 1) {
      e: for (let o = 0; o < i.length - 1; o++) {
        let l = i[o];
        for (let a = o + 1; a < i.length; a++) {
          let h = i[a];
          if (l.sameState(h) || l.buffer.length > 500 && h.buffer.length > 500)
            if ((l.score - h.score || l.buffer.length - h.buffer.length) > 0)
              i.splice(a--, 1);
            else {
              i.splice(o--, 1);
              continue e;
            }
        }
      }
      i.length > 12 && (i.sort((o, l) => l.score - o.score), i.splice(
        12,
        i.length - 12
        /* Rec.MaxStackCount */
      ));
    }
    this.minStackPos = i[0].pos;
    for (let o = 1; o < i.length; o++)
      i[o].pos < this.minStackPos && (this.minStackPos = i[o].pos);
    return null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  // Returns an updated version of the given stack, or null if the
  // stack can't advance normally. When `split` and `stacks` are
  // given, stacks split off by ambiguous operations will be pushed to
  // `split`, or added to `stacks` if they move `pos` forward.
  advanceStack(e, t, i) {
    let s = e.pos, { parser: r } = this, o = de ? this.stackID(e) + " -> " : "";
    if (this.stoppedAt != null && s > this.stoppedAt)
      return e.forceReduce() ? e : null;
    if (this.fragments) {
      let h = e.curContext && e.curContext.tracker.strict, f = h ? e.curContext.hash : 0;
      for (let c = this.fragments.nodeAt(s); c; ) {
        let u = this.parser.nodeSet.types[c.type.id] == c.type ? r.getGoto(e.state, c.type.id) : -1;
        if (u > -1 && c.length && (!h || (c.prop(E.contextHash) || 0) == f))
          return e.useNode(c, u), de && console.log(o + this.stackID(e) + ` (via reuse of ${r.getName(c.type.id)})`), !0;
        if (!(c instanceof U) || c.children.length == 0 || c.positions[0] > 0)
          break;
        let d = c.children[0];
        if (d instanceof U && c.positions[0] == 0)
          c = d;
        else
          break;
      }
    }
    let l = r.stateSlot(
      e.state,
      4
      /* ParseState.DefaultReduce */
    );
    if (l > 0)
      return e.reduce(l), de && console.log(o + this.stackID(e) + ` (via always-reduce ${r.getName(
        l & 65535
        /* Action.ValueMask */
      )})`), !0;
    if (e.stack.length >= 8400)
      for (; e.stack.length > 6e3 && e.forceReduce(); )
        ;
    let a = this.tokens.getActions(e);
    for (let h = 0; h < a.length; ) {
      let f = a[h++], c = a[h++], u = a[h++], d = h == a.length || !i, p = d ? e : e.split(), g = this.tokens.mainToken;
      if (p.apply(f, c, g ? g.start : p.pos, u), de && console.log(o + this.stackID(p) + ` (via ${(f & 65536) == 0 ? "shift" : `reduce of ${r.getName(
        f & 65535
        /* Action.ValueMask */
      )}`} for ${r.getName(c)} @ ${s}${p == e ? "" : ", split"})`), d)
        return !0;
      p.pos > s ? t.push(p) : i.push(p);
    }
    return !1;
  }
  // Advance a given stack forward as far as it will go. Returns the
  // (possibly updated) stack if it got stuck, or null if it moved
  // forward and was given to `pushStackDedup`.
  advanceFully(e, t) {
    let i = e.pos;
    for (; ; ) {
      if (!this.advanceStack(e, null, null))
        return !1;
      if (e.pos > i)
        return wr(e, t), !0;
    }
  }
  runRecovery(e, t, i) {
    let s = null, r = !1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o], a = t[o << 1], h = t[(o << 1) + 1], f = de ? this.stackID(l) + " -> " : "";
      if (l.deadEnd && (r || (r = !0, l.restart(), de && console.log(f + this.stackID(l) + " (restarted)"), this.advanceFully(l, i))))
        continue;
      let c = l.split(), u = f;
      for (let d = 0; d < 10 && c.forceReduce() && (de && console.log(u + this.stackID(c) + " (via force-reduce)"), !this.advanceFully(c, i)); d++)
        de && (u = this.stackID(c) + " -> ");
      for (let d of l.recoverByInsert(a))
        de && console.log(f + this.stackID(d) + " (via recover-insert)"), this.advanceFully(d, i);
      this.stream.end > l.pos ? (h == l.pos && (h++, a = 0), l.recoverByDelete(a, h), de && console.log(f + this.stackID(l) + ` (via recover-delete ${this.parser.getName(a)})`), wr(l, i)) : (!s || s.score < c.score) && (s = c);
    }
    return s;
  }
  // Convert the stack's buffer to a syntax tree.
  stackToTree(e) {
    return e.close(), U.build({
      buffer: Zi.create(e),
      nodeSet: this.parser.nodeSet,
      topID: this.topTerm,
      maxBufferLength: this.parser.bufferLength,
      reused: this.reused,
      start: this.ranges[0].from,
      length: e.pos - this.ranges[0].from,
      minRepeatType: this.parser.minRepeatTerm
    });
  }
  stackID(e) {
    let t = (ws || (ws = /* @__PURE__ */ new WeakMap())).get(e);
    return t || ws.set(e, t = String.fromCodePoint(this.nextStackID++)), t + e;
  }
}
function wr(n, e) {
  for (let t = 0; t < e.length; t++) {
    let i = e[t];
    if (i.pos == n.pos && i.sameState(n)) {
      e[t].score < n.score && (e[t] = n);
      return;
    }
  }
  e.push(n);
}
class dh {
  constructor(e, t, i) {
    this.source = e, this.flags = t, this.disabled = i;
  }
  allows(e) {
    return !this.disabled || this.disabled[e] == 0;
  }
}
const ks = (n) => n;
class ph {
  /**
  Define a context tracker.
  */
  constructor(e) {
    this.start = e.start, this.shift = e.shift || ks, this.reduce = e.reduce || ks, this.reuse = e.reuse || ks, this.hash = e.hash || (() => 0), this.strict = e.strict !== !1;
  }
}
class Yi extends jo {
  /**
  @internal
  */
  constructor(e) {
    if (super(), this.wrappers = [], e.version != 14)
      throw new RangeError(`Parser version (${e.version}) doesn't match runtime version (14)`);
    let t = e.nodeNames.split(" ");
    this.minRepeatTerm = t.length;
    for (let l = 0; l < e.repeatNodeCount; l++)
      t.push("");
    let i = Object.keys(e.topRules).map((l) => e.topRules[l][1]), s = [];
    for (let l = 0; l < t.length; l++)
      s.push([]);
    function r(l, a, h) {
      s[l].push([a, a.deserialize(String(h))]);
    }
    if (e.nodeProps)
      for (let l of e.nodeProps) {
        let a = l[0];
        typeof a == "string" && (a = E[a]);
        for (let h = 1; h < l.length; ) {
          let f = l[h++];
          if (f >= 0)
            r(f, a, l[h++]);
          else {
            let c = l[h + -f];
            for (let u = -f; u > 0; u--)
              r(l[h++], a, c);
            h++;
          }
        }
      }
    this.nodeSet = new zn(t.map((l, a) => he.define({
      name: a >= this.minRepeatTerm ? void 0 : l,
      id: a,
      props: s[a],
      top: i.indexOf(a) > -1,
      error: a == 0,
      skipped: e.skippedNodes && e.skippedNodes.indexOf(a) > -1
    }))), e.propSources && (this.nodeSet = this.nodeSet.extend(...e.propSources)), this.strict = !1, this.bufferLength = 1024;
    let o = jt(e.tokenData);
    this.context = e.context, this.specializerSpecs = e.specialized || [], this.specialized = new Uint16Array(this.specializerSpecs.length);
    for (let l = 0; l < this.specializerSpecs.length; l++)
      this.specialized[l] = this.specializerSpecs[l].term;
    this.specializers = this.specializerSpecs.map(kr), this.states = jt(e.states, Uint32Array), this.data = jt(e.stateData), this.goto = jt(e.goto), this.maxTerm = e.maxTerm, this.tokenizers = e.tokenizers.map((l) => typeof l == "number" ? new Ct(o, l) : l), this.topRules = e.topRules, this.dialects = e.dialects || {}, this.dynamicPrecedences = e.dynamicPrecedences || null, this.tokenPrecTable = e.tokenPrec, this.termNames = e.termNames || null, this.maxNode = this.nodeSet.types.length - 1, this.dialect = this.parseDialect(), this.top = this.topRules[Object.keys(this.topRules)[0]];
  }
  createParse(e, t, i) {
    let s = new uh(this, e, t, i);
    for (let r of this.wrappers)
      s = r(s, e, t, i);
    return s;
  }
  /**
  Get a goto table entry @internal
  */
  getGoto(e, t, i = !1) {
    let s = this.goto;
    if (t >= s[0])
      return -1;
    for (let r = s[t + 1]; ; ) {
      let o = s[r++], l = o & 1, a = s[r++];
      if (l && i)
        return a;
      for (let h = r + (o >> 1); r < h; r++)
        if (s[r] == e)
          return a;
      if (l)
        return -1;
    }
  }
  /**
  Check if this state has an action for a given terminal @internal
  */
  hasAction(e, t) {
    let i = this.data;
    for (let s = 0; s < 2; s++)
      for (let r = this.stateSlot(
        e,
        s ? 2 : 1
        /* ParseState.Actions */
      ), o; ; r += 3) {
        if ((o = i[r]) == 65535)
          if (i[r + 1] == 1)
            o = i[r = Xe(i, r + 2)];
          else {
            if (i[r + 1] == 2)
              return Xe(i, r + 2);
            break;
          }
        if (o == t || o == 0)
          return Xe(i, r + 1);
      }
    return 0;
  }
  /**
  @internal
  */
  stateSlot(e, t) {
    return this.states[e * 6 + t];
  }
  /**
  @internal
  */
  stateFlag(e, t) {
    return (this.stateSlot(
      e,
      0
      /* ParseState.Flags */
    ) & t) > 0;
  }
  /**
  @internal
  */
  validAction(e, t) {
    return !!this.allActions(e, (i) => i == t ? !0 : null);
  }
  /**
  @internal
  */
  allActions(e, t) {
    let i = this.stateSlot(
      e,
      4
      /* ParseState.DefaultReduce */
    ), s = i ? t(i) : void 0;
    for (let r = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); s == null; r += 3) {
      if (this.data[r] == 65535)
        if (this.data[r + 1] == 1)
          r = Xe(this.data, r + 2);
        else
          break;
      s = t(Xe(this.data, r + 1));
    }
    return s;
  }
  /**
  Get the states that can follow this one through shift actions or
  goto jumps. @internal
  */
  nextStates(e) {
    let t = [];
    for (let i = this.stateSlot(
      e,
      1
      /* ParseState.Actions */
    ); ; i += 3) {
      if (this.data[i] == 65535)
        if (this.data[i + 1] == 1)
          i = Xe(this.data, i + 2);
        else
          break;
      if ((this.data[i + 2] & 1) == 0) {
        let s = this.data[i + 1];
        t.some((r, o) => o & 1 && r == s) || t.push(this.data[i], s);
      }
    }
    return t;
  }
  /**
  Configure the parser. Returns a new parser instance that has the
  given settings modified. Settings not provided in `config` are
  kept from the original parser.
  */
  configure(e) {
    let t = Object.assign(Object.create(Yi.prototype), this);
    if (e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top) {
      let i = this.topRules[e.top];
      if (!i)
        throw new RangeError(`Invalid top rule name ${e.top}`);
      t.top = i;
    }
    return e.tokenizers && (t.tokenizers = this.tokenizers.map((i) => {
      let s = e.tokenizers.find((r) => r.from == i);
      return s ? s.to : i;
    })), e.specializers && (t.specializers = this.specializers.slice(), t.specializerSpecs = this.specializerSpecs.map((i, s) => {
      let r = e.specializers.find((l) => l.from == i.external);
      if (!r)
        return i;
      let o = Object.assign(Object.assign({}, i), { external: r.to });
      return t.specializers[s] = kr(o), o;
    })), e.contextTracker && (t.context = e.contextTracker), e.dialect && (t.dialect = this.parseDialect(e.dialect)), e.strict != null && (t.strict = e.strict), e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)), e.bufferLength != null && (t.bufferLength = e.bufferLength), t;
  }
  /**
  Tells you whether any [parse wrappers](#lr.ParserConfig.wrap)
  are registered for this parser.
  */
  hasWrappers() {
    return this.wrappers.length > 0;
  }
  /**
  Returns the name associated with a given term. This will only
  work for all terms when the parser was generated with the
  `--names` option. By default, only the names of tagged terms are
  stored.
  */
  getName(e) {
    return this.termNames ? this.termNames[e] : String(e <= this.maxNode && this.nodeSet.types[e].name || e);
  }
  /**
  The eof term id is always allocated directly after the node
  types. @internal
  */
  get eofTerm() {
    return this.maxNode + 1;
  }
  /**
  The type of top node produced by the parser.
  */
  get topNode() {
    return this.nodeSet.types[this.top[1]];
  }
  /**
  @internal
  */
  dynamicPrecedence(e) {
    let t = this.dynamicPrecedences;
    return t == null ? 0 : t[e] || 0;
  }
  /**
  @internal
  */
  parseDialect(e) {
    let t = Object.keys(this.dialects), i = t.map(() => !1);
    if (e)
      for (let r of e.split(" ")) {
        let o = t.indexOf(r);
        o >= 0 && (i[o] = !0);
      }
    let s = null;
    for (let r = 0; r < t.length; r++)
      if (!i[r])
        for (let o = this.dialects[t[r]], l; (l = this.data[o++]) != 65535; )
          (s || (s = new Uint8Array(this.maxTerm + 1)))[l] = 1;
    return new dh(e, i, s);
  }
  /**
  Used by the output of the parser generator. Not available to
  user code. @hide
  */
  static deserialize(e) {
    return new Yi(e);
  }
}
function Xe(n, e) {
  return n[e] | n[e + 1] << 16;
}
function gh(n) {
  let e = null;
  for (let t of n) {
    let i = t.p.stoppedAt;
    (t.pos == t.p.stream.end || i != null && t.pos > i) && t.p.parser.stateFlag(
      t.state,
      2
      /* StateFlag.Accepting */
    ) && (!e || e.score < t.score) && (e = t);
  }
  return e;
}
function kr(n) {
  if (n.external) {
    let e = n.extend ? 1 : 0;
    return (t, i) => n.external(t, i) << 1 | e;
  }
  return n.get;
}
let mh = 0;
class ye {
  /**
  @internal
  */
  constructor(e, t, i, s) {
    this.name = e, this.set = t, this.base = i, this.modified = s, this.id = mh++;
  }
  toString() {
    let { name: e } = this;
    for (let t of this.modified)
      t.name && (e = `${t.name}(${e})`);
    return e;
  }
  static define(e, t) {
    let i = typeof e == "string" ? e : "?";
    if (e instanceof ye && (t = e), t != null && t.base)
      throw new Error("Can not derive from a modified tag");
    let s = new ye(i, [], null, []);
    if (s.set.push(s), t)
      for (let r of t.set)
        s.set.push(r);
    return s;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(e) {
    let t = new Ki(e);
    return (i) => i.modified.indexOf(t) > -1 ? i : Ki.get(i.base || i, i.modified.concat(t).sort((s, r) => s.id - r.id));
  }
}
let Oh = 0;
class Ki {
  constructor(e) {
    this.name = e, this.instances = [], this.id = Oh++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((l) => l.base == e && yh(t, l.modified));
    if (i)
      return i;
    let s = [], r = new ye(e.name, s, e, t);
    for (let l of t)
      l.instances.push(r);
    let o = bh(t);
    for (let l of e.set)
      if (!l.modified.length)
        for (let a of o)
          s.push(Ki.get(l, a));
    return r;
  }
}
function yh(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function bh(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, s = e.length; i < s; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function Ho(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let s of t.split(" "))
      if (s) {
        let r = [], o = 2, l = s;
        for (let c = 0; ; ) {
          if (l == "..." && c > 0 && c + 3 == s.length) {
            o = 1;
            break;
          }
          let u = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
          if (!u)
            throw new RangeError("Invalid path: " + s);
          if (r.push(u[0] == "*" ? "" : u[0][0] == '"' ? JSON.parse(u[0]) : u[0]), c += u[0].length, c == s.length)
            break;
          let d = s[c++];
          if (c == s.length && d == "!") {
            o = 0;
            break;
          }
          if (d != "/")
            throw new RangeError("Invalid path: " + s);
          l = s.slice(c);
        }
        let a = r.length - 1, h = r[a];
        if (!h)
          throw new RangeError("Invalid path: " + s);
        let f = new ti(i, o, a > 0 ? r.slice(0, a) : null);
        e[h] = f.sort(e[h]);
      }
  }
  return Go.add(e);
}
const Go = new E({
  combine(n, e) {
    let t, i, s;
    for (; n || e; ) {
      if (!n || e && n.depth >= e.depth ? (s = e, e = e.next) : (s = n, n = n.next), t && t.mode == s.mode && !s.context && !t.context)
        continue;
      let r = new ti(s.tags, s.mode, s.context);
      t ? t.next = r : i = r, t = r;
    }
    return i;
  }
});
class ti {
  constructor(e, t, i, s) {
    this.tags = e, this.mode = t, this.context = i, this.next = s;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
ti.empty = new ti([], 2, null);
function Zo(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r of n)
    if (!Array.isArray(r.tag))
      t[r.tag.id] = r.class;
    else
      for (let o of r.tag)
        t[o.id] = r.class;
  let { scope: i, all: s = null } = e || {};
  return {
    style: (r) => {
      let o = s;
      for (let l of r)
        for (let a of l.set) {
          let h = t[a.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: i
  };
}
function Sh(n, e) {
  let t = null;
  for (let i of n) {
    let s = i.style(e);
    s && (t = t ? t + " " + s : s);
  }
  return t;
}
function xh(n, e, t, i = 0, s = n.length) {
  let r = new wh(i, Array.isArray(e) ? e : [e], t);
  r.highlightRange(n.cursor(), i, s, "", r.highlighters), r.flush(s);
}
class wh {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, s, r) {
    let { type: o, from: l, to: a } = e;
    if (l >= i || a <= t)
      return;
    o.isTop && (r = this.highlighters.filter((d) => !d.scope || d.scope(o)));
    let h = s, f = kh(e) || ti.empty, c = Sh(r, f.tags);
    if (c && (h && (h += " "), h += c, f.mode == 1 && (s += (s ? " " : "") + c)), this.startSpan(Math.max(t, l), h), f.opaque)
      return;
    let u = e.tree && e.tree.prop(E.mounted);
    if (u && u.overlay) {
      let d = e.node.enter(u.overlay[0].from + l, 1), p = this.highlighters.filter((m) => !m.scope || m.scope(u.tree.type)), g = e.firstChild();
      for (let m = 0, O = l; ; m++) {
        let b = m < u.overlay.length ? u.overlay[m] : null, Q = b ? b.from + l : a, R = Math.max(t, O), k = Math.min(i, Q);
        if (R < k && g)
          for (; e.from < k && (this.highlightRange(e, R, k, s, r), this.startSpan(Math.min(k, e.to), h), !(e.to >= Q || !e.nextSibling())); )
            ;
        if (!b || Q > i)
          break;
        O = b.to + l, O > t && (this.highlightRange(d.cursor(), Math.max(t, b.from + l), Math.min(i, O), "", p), this.startSpan(Math.min(i, O), h));
      }
      g && e.parent();
    } else if (e.firstChild()) {
      u && (s = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, s, r), this.startSpan(Math.min(i, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function kh(n) {
  let e = n.type.prop(Go);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const S = ye.define, yi = S(), Ke = S(), vr = S(Ke), Tr = S(Ke), Je = S(), bi = S(Je), vs = S(Je), qe = S(), ft = S(qe), Ce = S(), Ae = S(), Ks = S(), Vt = S(Ks), Si = S(), y = {
  /**
  A comment.
  */
  comment: yi,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: S(yi),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: S(yi),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: S(yi),
  /**
  Any kind of identifier.
  */
  name: Ke,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: S(Ke),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: vr,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: S(vr),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: Tr,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: S(Tr),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: S(Ke),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: S(Ke),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: S(Ke),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: S(Ke),
  /**
  A literal value.
  */
  literal: Je,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: bi,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: S(bi),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: S(bi),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: S(bi),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: vs,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: S(vs),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: S(vs),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: S(Je),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: S(Je),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: S(Je),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: S(Je),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: S(Je),
  /**
  A language keyword.
  */
  keyword: Ce,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: S(Ce),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: S(Ce),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: S(Ce),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: S(Ce),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: S(Ce),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: S(Ce),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: S(Ce),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: S(Ce),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: S(Ce),
  /**
  An operator.
  */
  operator: Ae,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: S(Ae),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: S(Ae),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: S(Ae),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: S(Ae),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: S(Ae),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: S(Ae),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: S(Ae),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: S(Ae),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: S(Ae),
  /**
  Program or markup punctuation.
  */
  punctuation: Ks,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: S(Ks),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: Vt,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: S(Vt),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: S(Vt),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: S(Vt),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: S(Vt),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: qe,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: ft,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: S(ft),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: S(ft),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: S(ft),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: S(ft),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: S(ft),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: S(ft),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: S(qe),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: S(qe),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: S(qe),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: S(qe),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: S(qe),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: S(qe),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: S(qe),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: S(qe),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: S(),
  /**
  Deleted text.
  */
  deleted: S(),
  /**
  Changed text.
  */
  changed: S(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: S(),
  /**
  Metadata or meta-instruction.
  */
  meta: Si,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: S(Si),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: S(Si),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: S(Si),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: ye.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: ye.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: ye.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: ye.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: ye.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: ye.defineModifier("special")
};
for (let n in y) {
  let e = y[n];
  e instanceof ye && (e.name = n);
}
Zo([
  { tag: y.link, class: "tok-link" },
  { tag: y.heading, class: "tok-heading" },
  { tag: y.emphasis, class: "tok-emphasis" },
  { tag: y.strong, class: "tok-strong" },
  { tag: y.keyword, class: "tok-keyword" },
  { tag: y.atom, class: "tok-atom" },
  { tag: y.bool, class: "tok-bool" },
  { tag: y.url, class: "tok-url" },
  { tag: y.labelName, class: "tok-labelName" },
  { tag: y.inserted, class: "tok-inserted" },
  { tag: y.deleted, class: "tok-deleted" },
  { tag: y.literal, class: "tok-literal" },
  { tag: y.string, class: "tok-string" },
  { tag: y.number, class: "tok-number" },
  { tag: [y.regexp, y.escape, y.special(y.string)], class: "tok-string2" },
  { tag: y.variableName, class: "tok-variableName" },
  { tag: y.local(y.variableName), class: "tok-variableName tok-local" },
  { tag: y.definition(y.variableName), class: "tok-variableName tok-definition" },
  { tag: y.special(y.variableName), class: "tok-variableName2" },
  { tag: y.definition(y.propertyName), class: "tok-propertyName tok-definition" },
  { tag: y.typeName, class: "tok-typeName" },
  { tag: y.namespace, class: "tok-namespace" },
  { tag: y.className, class: "tok-className" },
  { tag: y.macroName, class: "tok-macroName" },
  { tag: y.propertyName, class: "tok-propertyName" },
  { tag: y.operator, class: "tok-operator" },
  { tag: y.comment, class: "tok-comment" },
  { tag: y.meta, class: "tok-meta" },
  { tag: y.invalid, class: "tok-invalid" },
  { tag: y.punctuation, class: "tok-punctuation" }
]);
const vh = 1, Yo = 194, Ko = 195, Th = 196, Qr = 197, Qh = 198, Ph = 199, Ch = 200, Ah = 2, Jo = 3, Pr = 201, Rh = 24, qh = 25, Eh = 49, Mh = 50, $h = 55, Wh = 56, Dh = 57, zh = 59, Bh = 60, Ih = 61, Nh = 62, Lh = 63, Vh = 65, _h = 238, Xh = 71, Fh = 241, jh = 242, Uh = 243, Hh = 244, Gh = 245, Zh = 246, Yh = 247, Kh = 248, el = 72, Jh = 249, ef = 250, tf = 251, sf = 252, nf = 253, rf = 254, of = 255, lf = 256, af = 73, hf = 77, ff = 263, cf = 112, uf = 130, df = 151, pf = 152, gf = 155, gt = 10, ii = 13, Ln = 32, ds = 9, Vn = 35, mf = 40, Of = 46, Js = 123, Cr = 125, tl = 39, il = 34, Ar = 92, yf = 111, bf = 120, Sf = 78, xf = 117, wf = 85, kf = /* @__PURE__ */ new Set([
  qh,
  Eh,
  Mh,
  ff,
  Vh,
  uf,
  Wh,
  Dh,
  _h,
  Nh,
  Lh,
  el,
  af,
  hf,
  Bh,
  Ih,
  df,
  pf,
  gf,
  cf
]);
function Ts(n) {
  return n == gt || n == ii;
}
function Qs(n) {
  return n >= 48 && n <= 57 || n >= 65 && n <= 70 || n >= 97 && n <= 102;
}
const vf = new us((n, e) => {
  let t;
  if (n.next < 0)
    n.acceptToken(Ph);
  else if (e.context.flags & zi)
    Ts(n.next) && n.acceptToken(Qh, 1);
  else if (((t = n.peek(-1)) < 0 || Ts(t)) && e.canShift(Qr)) {
    let i = 0;
    for (; n.next == Ln || n.next == ds; )
      n.advance(), i++;
    (n.next == gt || n.next == ii || n.next == Vn) && n.acceptToken(Qr, -i);
  } else Ts(n.next) && n.acceptToken(Th, 1);
}, { contextual: !0 }), Tf = new us((n, e) => {
  let t = e.context;
  if (t.flags) return;
  let i = n.peek(-1);
  if (i == gt || i == ii) {
    let s = 0, r = 0;
    for (; ; ) {
      if (n.next == Ln) s++;
      else if (n.next == ds) s += 8 - s % 8;
      else break;
      n.advance(), r++;
    }
    s != t.indent && n.next != gt && n.next != ii && n.next != Vn && (s < t.indent ? n.acceptToken(Ko, -r) : n.acceptToken(Yo));
  }
}), zi = 1, sl = 2, Ne = 4, Le = 8, Ve = 16, _e = 32;
function Bi(n, e, t) {
  this.parent = n, this.indent = e, this.flags = t, this.hash = (n ? n.hash + n.hash << 8 : 0) + e + (e << 4) + t + (t << 6);
}
const Qf = new Bi(null, 0, 0);
function Pf(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++)
    e += n.charCodeAt(t) == ds ? 8 - e % 8 : 1;
  return e;
}
const Rr = new Map([
  [Fh, 0],
  [jh, Ne],
  [Uh, Le],
  [Hh, Le | Ne],
  [Gh, Ve],
  [Zh, Ve | Ne],
  [Yh, Ve | Le],
  [Kh, Ve | Le | Ne],
  [Jh, _e],
  [ef, _e | Ne],
  [tf, _e | Le],
  [sf, _e | Le | Ne],
  [nf, _e | Ve],
  [rf, _e | Ve | Ne],
  [of, _e | Ve | Le],
  [lf, _e | Ve | Le | Ne]
].map(([n, e]) => [n, e | sl])), Cf = new ph({
  start: Qf,
  reduce(n, e, t, i) {
    return n.flags & zi && kf.has(e) || (e == Xh || e == el) && n.flags & sl ? n.parent : n;
  },
  shift(n, e, t, i) {
    return e == Yo ? new Bi(n, Pf(i.read(i.pos, t.pos)), 0) : e == Ko ? n.parent : e == Rh || e == $h || e == zh || e == Jo ? new Bi(n, 0, zi) : Rr.has(e) ? new Bi(n, 0, Rr.get(e) | n.flags & zi) : n;
  },
  hash(n) {
    return n.hash;
  }
}), Af = new us((n) => {
  for (let e = 0; e < 5; e++) {
    if (n.next != "print".charCodeAt(e)) return;
    n.advance();
  }
  if (!/\w/.test(String.fromCharCode(n.next)))
    for (let e = 0; ; e++) {
      let t = n.peek(e);
      if (!(t == Ln || t == ds)) {
        t != mf && t != Of && t != gt && t != ii && t != Vn && n.acceptToken(vh);
        return;
      }
    }
}), Rf = new us((n, e) => {
  let { flags: t } = e.context, i = t & Ne ? il : tl, s = (t & Le) > 0, r = !(t & Ve), o = (t & _e) > 0, l = n.pos;
  for (; !(n.next < 0); )
    if (o && n.next == Js)
      if (n.peek(1) == Js)
        n.advance(2);
      else {
        if (n.pos == l) {
          n.acceptToken(Jo, 1);
          return;
        }
        break;
      }
    else if (r && n.next == Ar) {
      if (n.pos == l) {
        n.advance();
        let a = n.next;
        a >= 0 && (n.advance(), qf(n, a)), n.acceptToken(Ah);
        return;
      }
      break;
    } else if (n.next == Ar && !r && n.peek(1) > -1)
      n.advance(2);
    else if (n.next == i && (!s || n.peek(1) == i && n.peek(2) == i)) {
      if (n.pos == l) {
        n.acceptToken(Pr, s ? 3 : 1);
        return;
      }
      break;
    } else if (n.next == gt) {
      if (s)
        n.advance();
      else if (n.pos == l) {
        n.acceptToken(Pr);
        return;
      }
      break;
    } else
      n.advance();
  n.pos > l && n.acceptToken(Ch);
});
function qf(n, e) {
  if (e == yf)
    for (let t = 0; t < 2 && n.next >= 48 && n.next <= 55; t++) n.advance();
  else if (e == bf)
    for (let t = 0; t < 2 && Qs(n.next); t++) n.advance();
  else if (e == xf)
    for (let t = 0; t < 4 && Qs(n.next); t++) n.advance();
  else if (e == wf)
    for (let t = 0; t < 8 && Qs(n.next); t++) n.advance();
  else if (e == Sf && n.next == Js) {
    for (n.advance(); n.next >= 0 && n.next != Cr && n.next != tl && n.next != il && n.next != gt; ) n.advance();
    n.next == Cr && n.advance();
  }
}
const Ef = Ho({
  'async "*" "**" FormatConversion FormatSpec': y.modifier,
  "for while if elif else try except finally return raise break continue with pass assert await yield match case": y.controlKeyword,
  "in not and or is del": y.operatorKeyword,
  "from def class global nonlocal lambda": y.definitionKeyword,
  import: y.moduleKeyword,
  "with as print": y.keyword,
  Boolean: y.bool,
  None: y.null,
  VariableName: y.variableName,
  "CallExpression/VariableName": y.function(y.variableName),
  "FunctionDefinition/VariableName": y.function(y.definition(y.variableName)),
  "ClassDefinition/VariableName": y.definition(y.className),
  PropertyName: y.propertyName,
  "CallExpression/MemberExpression/PropertyName": y.function(y.propertyName),
  Comment: y.lineComment,
  Number: y.number,
  String: y.string,
  FormatString: y.special(y.string),
  Escape: y.escape,
  UpdateOp: y.updateOperator,
  "ArithOp!": y.arithmeticOperator,
  BitOp: y.bitwiseOperator,
  CompareOp: y.compareOperator,
  AssignOp: y.definitionOperator,
  Ellipsis: y.punctuation,
  At: y.meta,
  "( )": y.paren,
  "[ ]": y.squareBracket,
  "{ }": y.brace,
  ".": y.derefOperator,
  ", ;": y.separator
}), Mf = { __proto__: null, await: 44, or: 54, and: 56, in: 60, not: 62, is: 64, if: 70, else: 72, lambda: 76, yield: 94, from: 96, async: 102, for: 104, None: 162, True: 164, False: 164, del: 178, pass: 182, break: 186, continue: 190, return: 194, raise: 202, import: 206, as: 208, global: 212, nonlocal: 214, assert: 218, type: 223, elif: 236, while: 240, try: 246, except: 248, finally: 250, with: 254, def: 258, class: 268, match: 279, case: 285 }, $f = Yi.deserialize({
  version: 14,
  states: "##jQ`QeOOP$}OSOOO&WQtO'#HUOOQS'#Co'#CoOOQS'#Cp'#CpO'vQdO'#CnO*UQtO'#HTOOQS'#HU'#HUOOQS'#DU'#DUOOQS'#HT'#HTO*rQdO'#D_O+VQdO'#DfO+gQdO'#DjO+zOWO'#DuO,VOWO'#DvO.[QtO'#GuOOQS'#Gu'#GuO'vQdO'#GtO0ZQtO'#GtOOQS'#Eb'#EbO0rQdO'#EcOOQS'#Gs'#GsO0|QdO'#GrOOQV'#Gr'#GrO1XQdO'#FYOOQS'#G^'#G^O1^QdO'#FXOOQV'#IS'#ISOOQV'#Gq'#GqOOQV'#Fq'#FqQ`QeOOO'vQdO'#CqO1lQdO'#C}O1sQdO'#DRO2RQdO'#HYO2cQtO'#EVO'vQdO'#EWOOQS'#EY'#EYOOQS'#E['#E[OOQS'#E^'#E^O2wQdO'#E`O3_QdO'#EdO3rQdO'#EfO3zQtO'#EfO1XQdO'#EiO0rQdO'#ElO1XQdO'#EnO0rQdO'#EtO0rQdO'#EwO4VQdO'#EyO4^QdO'#FOO4iQdO'#EzO0rQdO'#FOO1XQdO'#FQO1XQdO'#FVO4nQdO'#F[P4uOdO'#GpPOOO)CBd)CBdOOQS'#Ce'#CeOOQS'#Cf'#CfOOQS'#Cg'#CgOOQS'#Ch'#ChOOQS'#Ci'#CiOOQS'#Cj'#CjOOQS'#Cl'#ClO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO'vQdO,59OO5TQdO'#DoOOQS,5:Y,5:YO5hQdO'#HdOOQS,5:],5:]O5uQ!fO,5:]O5zQtO,59YO1lQdO,59bO1lQdO,59bO1lQdO,59bO8jQdO,59bO8oQdO,59bO8vQdO,59jO8}QdO'#HTO:TQdO'#HSOOQS'#HS'#HSOOQS'#D['#D[O:lQdO,59aO'vQdO,59aO:zQdO,59aOOQS,59y,59yO;PQdO,5:RO'vQdO,5:ROOQS,5:Q,5:QO;_QdO,5:QO;dQdO,5:XO'vQdO,5:XO'vQdO,5:VOOQS,5:U,5:UO;uQdO,5:UO;zQdO,5:WOOOW'#Fy'#FyO<POWO,5:aOOQS,5:a,5:aO<[QdO'#HwOOOW'#Dw'#DwOOOW'#Fz'#FzO<lOWO,5:bOOQS,5:b,5:bOOQS'#F}'#F}O<zQtO,5:iO?lQtO,5=`O@VQ#xO,5=`O@vQtO,5=`OOQS,5:},5:}OA_QeO'#GWOBqQdO,5;^OOQV,5=^,5=^OB|QtO'#IPOCkQdO,5;tOOQS-E:[-E:[OOQV,5;s,5;sO4dQdO'#FQOOQV-E9o-E9oOCsQtO,59]OEzQtO,59iOFeQdO'#HVOFpQdO'#HVO1XQdO'#HVOF{QdO'#DTOGTQdO,59mOGYQdO'#HZO'vQdO'#HZO0rQdO,5=tOOQS,5=t,5=tO0rQdO'#EROOQS'#ES'#ESOGwQdO'#GPOHXQdO,58|OHXQdO,58|O*xQdO,5:oOHgQtO'#H]OOQS,5:r,5:rOOQS,5:z,5:zOHzQdO,5;OOI]QdO'#IOO1XQdO'#H}OOQS,5;Q,5;QOOQS'#GT'#GTOIqQtO,5;QOJPQdO,5;QOJUQdO'#IQOOQS,5;T,5;TOJdQdO'#H|OOQS,5;W,5;WOJuQdO,5;YO4iQdO,5;`O4iQdO,5;cOJ}QtO'#ITO'vQdO'#ITOKXQdO,5;eO4VQdO,5;eO0rQdO,5;jO1XQdO,5;lOK^QeO'#EuOLjQgO,5;fO!!kQdO'#IUO4iQdO,5;jO!!vQdO,5;lO!#OQdO,5;qO!#ZQtO,5;vO'vQdO,5;vPOOO,5=[,5=[P!#bOSO,5=[P!#jOdO,5=[O!&bQtO1G.jO!&iQtO1G.jO!)YQtO1G.jO!)dQtO1G.jO!+}QtO1G.jO!,bQtO1G.jO!,uQdO'#HcO!-TQtO'#GuO0rQdO'#HcO!-_QdO'#HbOOQS,5:Z,5:ZO!-gQdO,5:ZO!-lQdO'#HeO!-wQdO'#HeO!.[QdO,5>OOOQS'#Ds'#DsOOQS1G/w1G/wOOQS1G.|1G.|O!/[QtO1G.|O!/cQtO1G.|O1lQdO1G.|O!0OQdO1G/UOOQS'#DZ'#DZO0rQdO,59tOOQS1G.{1G.{O!0VQdO1G/eO!0gQdO1G/eO!0oQdO1G/fO'vQdO'#H[O!0tQdO'#H[O!0yQtO1G.{O!1ZQdO,59iO!2aQdO,5=zO!2qQdO,5=zO!2yQdO1G/mO!3OQtO1G/mOOQS1G/l1G/lO!3`QdO,5=uO!4VQdO,5=uO0rQdO1G/qO!4tQdO1G/sO!4yQtO1G/sO!5ZQtO1G/qOOQS1G/p1G/pOOQS1G/r1G/rOOOW-E9w-E9wOOQS1G/{1G/{O!5kQdO'#HxO0rQdO'#HxO!5|QdO,5>cOOOW-E9x-E9xOOQS1G/|1G/|OOQS-E9{-E9{O!6[Q#xO1G2zO!6{QtO1G2zO'vQdO,5<jOOQS,5<j,5<jOOQS-E9|-E9|OOQS,5<r,5<rOOQS-E:U-E:UOOQV1G0x1G0xO1XQdO'#GRO!7dQtO,5>kOOQS1G1`1G1`O!8RQdO1G1`OOQS'#DV'#DVO0rQdO,5=qOOQS,5=q,5=qO!8WQdO'#FrO!8cQdO,59oO!8kQdO1G/XO!8uQtO,5=uOOQS1G3`1G3`OOQS,5:m,5:mO!9fQdO'#GtOOQS,5<k,5<kOOQS-E9}-E9}O!9wQdO1G.hOOQS1G0Z1G0ZO!:VQdO,5=wO!:gQdO,5=wO0rQdO1G0jO0rQdO1G0jO!:xQdO,5>jO!;ZQdO,5>jO1XQdO,5>jO!;lQdO,5>iOOQS-E:R-E:RO!;qQdO1G0lO!;|QdO1G0lO!<RQdO,5>lO!<aQdO,5>lO!<oQdO,5>hO!=VQdO,5>hO!=hQdO'#EpO0rQdO1G0tO!=sQdO1G0tO!=xQgO1G0zO!AvQgO1G0}O!EqQdO,5>oO!E{QdO,5>oO!FTQtO,5>oO0rQdO1G1PO!F_QdO1G1PO4iQdO1G1UO!!vQdO1G1WOOQV,5;a,5;aO!FdQfO,5;aO!FiQgO1G1QO!JjQdO'#GZO4iQdO1G1QO4iQdO1G1QO!JzQdO,5>pO!KXQdO,5>pO1XQdO,5>pOOQV1G1U1G1UO!KaQdO'#FSO!KrQ!fO1G1WO!KzQdO1G1WOOQV1G1]1G1]O4iQdO1G1]O!LPQdO1G1]O!LXQdO'#F^OOQV1G1b1G1bO!#ZQtO1G1bPOOO1G2v1G2vP!L^OSO1G2vOOQS,5=},5=}OOQS'#Dp'#DpO0rQdO,5=}O!LfQdO,5=|O!LyQdO,5=|OOQS1G/u1G/uO!MRQdO,5>PO!McQdO,5>PO!MkQdO,5>PO!NOQdO,5>PO!N`QdO,5>POOQS1G3j1G3jOOQS7+$h7+$hO!8kQdO7+$pO#!RQdO1G.|O#!YQdO1G.|OOQS1G/`1G/`OOQS,5<`,5<`O'vQdO,5<`OOQS7+%P7+%PO#!aQdO7+%POOQS-E9r-E9rOOQS7+%Q7+%QO#!qQdO,5=vO'vQdO,5=vOOQS7+$g7+$gO#!vQdO7+%PO##OQdO7+%QO##TQdO1G3fOOQS7+%X7+%XO##eQdO1G3fO##mQdO7+%XOOQS,5<_,5<_O'vQdO,5<_O##rQdO1G3aOOQS-E9q-E9qO#$iQdO7+%]OOQS7+%_7+%_O#$wQdO1G3aO#%fQdO7+%_O#%kQdO1G3gO#%{QdO1G3gO#&TQdO7+%]O#&YQdO,5>dO#&sQdO,5>dO#&sQdO,5>dOOQS'#Dx'#DxO#'UO&jO'#DzO#'aO`O'#HyOOOW1G3}1G3}O#'fQdO1G3}O#'nQdO1G3}O#'yQ#xO7+(fO#(jQtO1G2UP#)TQdO'#GOOOQS,5<m,5<mOOQS-E:P-E:POOQS7+&z7+&zOOQS1G3]1G3]OOQS,5<^,5<^OOQS-E9p-E9pOOQS7+$s7+$sO#)bQdO,5=`O#){QdO,5=`O#*^QtO,5<aO#*qQdO1G3cOOQS-E9s-E9sOOQS7+&U7+&UO#+RQdO7+&UO#+aQdO,5<nO#+uQdO1G4UOOQS-E:Q-E:QO#,WQdO1G4UOOQS1G4T1G4TOOQS7+&W7+&WO#,iQdO7+&WOOQS,5<p,5<pO#,tQdO1G4WOOQS-E:S-E:SOOQS,5<l,5<lO#-SQdO1G4SOOQS-E:O-E:OO1XQdO'#EqO#-jQdO'#EqO#-uQdO'#IRO#-}QdO,5;[OOQS7+&`7+&`O0rQdO7+&`O#.SQgO7+&fO!JmQdO'#GXO4iQdO7+&fO4iQdO7+&iO#2QQtO,5<tO'vQdO,5<tO#2[QdO1G4ZOOQS-E:W-E:WO#2fQdO1G4ZO4iQdO7+&kO0rQdO7+&kOOQV7+&p7+&pO!KrQ!fO7+&rO!KzQdO7+&rO`QeO1G0{OOQV-E:X-E:XO4iQdO7+&lO4iQdO7+&lOOQV,5<u,5<uO#2nQdO,5<uO!JmQdO,5<uOOQV7+&l7+&lO#2yQgO7+&lO#6tQdO,5<vO#7PQdO1G4[OOQS-E:Y-E:YO#7^QdO1G4[O#7fQdO'#IWO#7tQdO'#IWO1XQdO'#IWOOQS'#IW'#IWO#8PQdO'#IVOOQS,5;n,5;nO#8XQdO,5;nO0rQdO'#FUOOQV7+&r7+&rO4iQdO7+&rOOQV7+&w7+&wO4iQdO7+&wO#8^QfO,5;xOOQV7+&|7+&|POOO7+(b7+(bO#8cQdO1G3iOOQS,5<c,5<cO#8qQdO1G3hOOQS-E9u-E9uO#9UQdO,5<dO#9aQdO,5<dO#9tQdO1G3kOOQS-E9v-E9vO#:UQdO1G3kO#:^QdO1G3kO#:nQdO1G3kO#:UQdO1G3kOOQS<<H[<<H[O#:yQtO1G1zOOQS<<Hk<<HkP#;WQdO'#FtO8vQdO1G3bO#;eQdO1G3bO#;jQdO<<HkOOQS<<Hl<<HlO#;zQdO7+)QOOQS<<Hs<<HsO#<[QtO1G1yP#<{QdO'#FsO#=YQdO7+)RO#=jQdO7+)RO#=rQdO<<HwO#=wQdO7+({OOQS<<Hy<<HyO#>nQdO,5<bO'vQdO,5<bOOQS-E9t-E9tOOQS<<Hw<<HwOOQS,5<g,5<gO0rQdO,5<gO#>sQdO1G4OOOQS-E9y-E9yO#?^QdO1G4OO<[QdO'#H{OOOO'#D{'#D{OOOO'#F|'#F|O#?oO&jO,5:fOOOW,5>e,5>eOOOW7+)i7+)iO#?zQdO7+)iO#@SQdO1G2zO#@mQdO1G2zP'vQdO'#FuO0rQdO<<IpO1XQdO1G2YP1XQdO'#GSO#AOQdO7+)pO#AaQdO7+)pOOQS<<Ir<<IrP1XQdO'#GUP0rQdO'#GQOOQS,5;],5;]O#ArQdO,5>mO#BQQdO,5>mOOQS1G0v1G0vOOQS<<Iz<<IzOOQV-E:V-E:VO4iQdO<<JQOOQV,5<s,5<sO4iQdO,5<sOOQV<<JQ<<JQOOQV<<JT<<JTO#BYQtO1G2`P#BdQdO'#GYO#BkQdO7+)uO#BuQgO<<JVO4iQdO<<JVOOQV<<J^<<J^O4iQdO<<J^O!KrQ!fO<<J^O#FpQgO7+&gOOQV<<JW<<JWO#FzQgO<<JWOOQV1G2a1G2aO1XQdO1G2aO#JuQdO1G2aO4iQdO<<JWO1XQdO1G2bP0rQdO'#G[O#KQQdO7+)vO#K_QdO7+)vOOQS'#FT'#FTO0rQdO,5>rO#KgQdO,5>rO#KrQdO,5>rO#K}QdO,5>qO#L`QdO,5>qOOQS1G1Y1G1YOOQS,5;p,5;pOOQV<<Jc<<JcO#LhQdO1G1dOOQS7+)T7+)TP#LmQdO'#FwO#L}QdO1G2OO#MbQdO1G2OO#MrQdO1G2OP#M}QdO'#FxO#N[QdO7+)VO#NlQdO7+)VO#NlQdO7+)VO#NtQdO7+)VO$ UQdO7+(|O8vQdO7+(|OOQSAN>VAN>VO$ oQdO<<LmOOQSAN>cAN>cO0rQdO1G1|O$!PQtO1G1|P$!ZQdO'#FvOOQS1G2R1G2RP$!hQdO'#F{O$!uQdO7+)jO$#`QdO,5>gOOOO-E9z-E9zOOOW<<MT<<MTO$#nQdO7+(fOOQSAN?[AN?[OOQS7+'t7+'tO$$XQdO<<M[OOQS,5<q,5<qO$$jQdO1G4XOOQS-E:T-E:TOOQVAN?lAN?lOOQV1G2_1G2_O4iQdOAN?qO$$xQgOAN?qOOQVAN?xAN?xO4iQdOAN?xOOQV<<JR<<JRO4iQdOAN?rO4iQdO7+'{OOQV7+'{7+'{O1XQdO7+'{OOQVAN?rAN?rOOQS7+'|7+'|O$(sQdO<<MbOOQS1G4^1G4^O0rQdO1G4^OOQS,5<w,5<wO$)QQdO1G4]OOQS-E:Z-E:ZOOQU'#G_'#G_O$)cQfO7+'OO$)nQdO'#F_O$*uQdO7+'jO$+VQdO7+'jOOQS7+'j7+'jO$+bQdO<<LqO$+rQdO<<LqO$+rQdO<<LqO$+zQdO'#H^OOQS<<Lh<<LhO$,UQdO<<LhOOQS7+'h7+'hOOQS'#D|'#D|OOOO1G4R1G4RO$,oQdO1G4RO$,wQdO1G4RP!=hQdO'#GVOOQVG25]G25]O4iQdOG25]OOQVG25dG25dOOQVG25^G25^OOQV<<Kg<<KgO4iQdO<<KgOOQS7+)x7+)xP$-SQdO'#G]OOQU-E:]-E:]OOQV<<Jj<<JjO$-vQtO'#FaOOQS'#Fc'#FcO$.WQdO'#FbO$.xQdO'#FbOOQS'#Fb'#FbO$.}QdO'#IYO$)nQdO'#FiO$)nQdO'#FiO$/fQdO'#FjO$)nQdO'#FkO$/mQdO'#IZOOQS'#IZ'#IZO$0[QdO,5;yOOQS<<KU<<KUO$0dQdO<<KUO$0tQdOANB]O$1UQdOANB]O$1^QdO'#H_OOQS'#H_'#H_O1sQdO'#DcO$1wQdO,5=xOOQSANBSANBSOOOO7+)m7+)mO$2`QdO7+)mOOQVLD*wLD*wOOQVANARANARO5uQ!fO'#GaO$2hQtO,5<SO$)nQdO'#FmOOQS,5<W,5<WOOQS'#Fd'#FdO$3YQdO,5;|O$3_QdO,5;|OOQS'#Fg'#FgO$)nQdO'#G`O$4PQdO,5<QO$4kQdO,5>tO$4{QdO,5>tO1XQdO,5<PO$5^QdO,5<TO$5cQdO,5<TO$)nQdO'#I[O$5hQdO'#I[O$5mQdO,5<UOOQS,5<V,5<VO0rQdO'#FpOOQU1G1e1G1eO4iQdO1G1eOOQSAN@pAN@pO$5rQdOG27wO$6SQdO,59}OOQS1G3d1G3dOOOO<<MX<<MXOOQS,5<{,5<{OOQS-E:_-E:_O$6XQtO'#FaO$6`QdO'#I]O$6nQdO'#I]O$6vQdO,5<XOOQS1G1h1G1hO$6{QdO1G1hO$7QQdO,5<zOOQS-E:^-E:^O$7lQdO,5=OO$8TQdO1G4`OOQS-E:b-E:bOOQS1G1k1G1kOOQS1G1o1G1oO$8eQdO,5>vO$)nQdO,5>vOOQS1G1p1G1pOOQS,5<[,5<[OOQU7+'P7+'PO$+zQdO1G/iO$)nQdO,5<YO$8sQdO,5>wO$8zQdO,5>wOOQS1G1s1G1sOOQS7+'S7+'SP$)nQdO'#GdO$9SQdO1G4bO$9^QdO1G4bO$9fQdO1G4bOOQS7+%T7+%TO$9tQdO1G1tO$:SQtO'#FaO$:ZQdO,5<}OOQS,5<},5<}O$:iQdO1G4cOOQS-E:a-E:aO$)nQdO,5<|O$:pQdO,5<|O$:uQdO7+)|OOQS-E:`-E:`O$;PQdO7+)|O$)nQdO,5<ZP$)nQdO'#GcO$;XQdO1G2hO$)nQdO1G2hP$;gQdO'#GbO$;nQdO<<MhO$;xQdO1G1uO$<WQdO7+(SO8vQdO'#C}O8vQdO,59bO8vQdO,59bO8vQdO,59bO$<fQtO,5=`O8vQdO1G.|O0rQdO1G/XO0rQdO7+$pP$<yQdO'#GOO'vQdO'#GtO$=WQdO,59bO$=]QdO,59bO$=dQdO,59mO$=iQdO1G/UO1sQdO'#DRO8vQdO,59j",
  stateData: "$>S~O%cOS%^OSSOS%]PQ~OPdOVaOfoOhYOopOs!POvqO!PrO!Q{O!T!SO!U!RO!XZO!][O!h`O!r`O!s`O!t`O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#l!QO#o!TO#s!UO#u!VO#z!WO#}hO$P!XO%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~O%]!YO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%j![O%k!]O%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aO~Ok%xXl%xXm%xXn%xXo%xXp%xXs%xXz%xX{%xX!x%xX#g%xX%[%xX%_%xX%z%xXg%xX!T%xX!U%xX%{%xX!W%xX![%xX!Q%xX#[%xXt%xX!m%xX~P%SOfoOhYO!XZO!][O!h`O!r`O!s`O!t`O%oRO%pRO%tSO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O~Oz%wX{%wX#g%wX%[%wX%_%wX%z%wX~Ok!pOl!qOm!oOn!oOo!rOp!sOs!tO!x%wX~P)pOV!zOg!|Oo0cOv0qO!PrO~P'vOV#OOo0cOv0qO!W#PO~P'vOV#SOa#TOo0cOv0qO![#UO~P'vOQ#XO%`#XO%a#ZO~OQ#^OR#[O%`#^O%a#`O~OV%iX_%iXa%iXh%iXk%iXl%iXm%iXn%iXo%iXp%iXs%iXz%iX!X%iX!f%iX%j%iX%k%iX%l%iX%m%iX%n%iX%o%iX%p%iX%q%iX%r%iX%s%iXg%iX!T%iX!U%iX~O&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O&c^O&d^O&e^O&f^O&g^O&h^O&i^O&j^O{%iX!x%iX#g%iX%[%iX%_%iX%z%iX%{%iX!W%iX![%iX!Q%iX#[%iXt%iX!m%iX~P,eOz#dO{%hX!x%hX#g%hX%[%hX%_%hX%z%hX~Oo0cOv0qO~P'vO#g#gO%[#iO%_#iO~O%uWO~O!T#nO#u!VO#z!WO#}hO~OopO~P'vOV#sOa#tO%uWO{wP~OV#xOo0cOv0qO!Q#yO~P'vO{#{O!x$QO%z#|O#g!yX%[!yX%_!yX~OV#xOo0cOv0qO#g#SX%[#SX%_#SX~P'vOo0cOv0qO#g#WX%[#WX%_#WX~P'vOh$WO%uWO~O!f$YO!r$YO%uWO~OV$eO~P'vO!U$gO#s$hO#u$iO~O{$jO~OV$qO~P'vOS$sO%[$rO%_$rO%c$tO~OV$}Oa$}Og%POo0cOv0qO~P'vOo0cOv0qO{%SO~P'vO&Y%UO~Oa!bOh!iO!X!kO!f!mOVba_bakbalbambanbaobapbasbazba{ba!xba#gba%[ba%_ba%jba%kba%lba%mba%nba%oba%pba%qba%rba%sba%zbagba!Tba!Uba%{ba!Wba![ba!Qba#[batba!mba~On%ZO~Oo%ZO~P'vOo0cO~P'vOk0eOl0fOm0dOn0dOo0mOp0nOs0rOg%wX!T%wX!U%wX%{%wX!W%wX![%wX!Q%wX#[%wX!m%wX~P)pO%{%]Og%vXz%vX!T%vX!U%vX!W%vX{%vX~Og%_Oz%`O!T%dO!U%cO~Og%_O~Oz%gO!T%dO!U%cO!W&SX~O!W%kO~Oz%lO{%nO!T%dO!U%cO![%}X~O![%rO~O![%sO~OQ#XO%`#XO%a%uO~OV%wOo0cOv0qO!PrO~P'vOQ#^OR#[O%`#^O%a%zO~OV!qa_!qaa!qah!qak!qal!qam!qan!qao!qap!qas!qaz!qa{!qa!X!qa!f!qa!x!qa#g!qa%[!qa%_!qa%j!qa%k!qa%l!qa%m!qa%n!qa%o!qa%p!qa%q!qa%r!qa%s!qa%z!qag!qa!T!qa!U!qa%{!qa!W!qa![!qa!Q!qa#[!qat!qa!m!qa~P#yOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P%SOV&OOopOvqO{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~P'vOz%|O{%ha!x%ha#g%ha%[%ha%_%ha%z%ha~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO#g$zX%[$zX%_$zX~P'vO#g#gO%[&TO%_&TO~O!f&UOh&sX%[&sXz&sX#[&sX#g&sX%_&sX#Z&sXg&sX~Oh!iO%[&WO~Okealeameaneaoeapeaseazea{ea!xea#gea%[ea%_ea%zeagea!Tea!Uea%{ea!Wea![ea!Qea#[eatea!mea~P%SOsqazqa{qa#gqa%[qa%_qa%zqa~Ok!pOl!qOm!oOn!oOo!rOp!sO!xqa~PEcO%z&YOz%yX{%yX~O%uWOz%yX{%yX~Oz&]O{wX~O{&_O~Oz%lO#g%}X%[%}X%_%}Xg%}X{%}X![%}X!m%}X%z%}X~OV0lOo0cOv0qO!PrO~P'vO%z#|O#gUa%[Ua%_Ua~Oz&hO#g&PX%[&PX%_&PXn&PX~P%SOz&kO!Q&jO#g#Wa%[#Wa%_#Wa~Oz&lO#[&nO#g&rX%[&rX%_&rXg&rX~O!f$YO!r$YO#Z&qO%uWO~O#Z&qO~Oz&sO#g&tX%[&tX%_&tX~Oz&uO#g&pX%[&pX%_&pX{&pX~O!X&wO%z&xO~Oz&|On&wX~P%SOn'PO~OPdOVaOopOvqO!PrO!Q{O!{tO!}uO#PvO#RwO#TxO#XyO#ZzO#^|O#_|O#a}O#c!OO%['UO~P'vOt'YO#p'WO#q'XOP#naV#naf#nah#nao#nas#nav#na!P#na!Q#na!T#na!U#na!X#na!]#na!h#na!r#na!s#na!t#na!{#na!}#na#P#na#R#na#T#na#X#na#Z#na#^#na#_#na#a#na#c#na#l#na#o#na#s#na#u#na#z#na#}#na$P#na%X#na%o#na%p#na%t#na%u#na&Z#na&[#na&]#na&^#na&_#na&`#na&a#na&b#na&c#na&d#na&e#na&f#na&g#na&h#na&i#na&j#na%Z#na%_#na~Oz'ZO#[']O{&xX~Oh'_O!X&wO~Oh!iO{$jO!X&wO~O{'eO~P%SO%['hO%_'hO~OS'iO%['hO%_'hO~OV!aO_!aOa!bOh!iO!X!kO!f!mO%l!^O%m!_O%n!_O%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%k!]O~P!#uO%kWi~P!#uOV!aO_!aOa!bOh!iO!X!kO!f!mO%o!`O%p!`O%q!aO%r!aO%s!aOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~O%m!_O%n!_O~P!&pO%mWi%nWi~P!&pOa!bOh!iO!X!kO!f!mOkWilWimWinWioWipWisWizWi{Wi!xWi#gWi%[Wi%_Wi%jWi%kWi%lWi%mWi%nWi%oWi%pWi%zWigWi!TWi!UWi%{Wi!WWi![Wi!QWi#[WitWi!mWi~OV!aO_!aO%q!aO%r!aO%s!aO~P!)nOVWi_Wi%qWi%rWi%sWi~P!)nO!T%dO!U%cOg&VXz&VX~O%z'kO%{'kO~P,eOz'mOg&UX~Og'oO~Oz'pO{'rO!W&XX~Oo0cOv0qOz'pO{'sO!W&XX~P'vO!W'uO~Om!oOn!oOo!rOp!sOkjisjizji{ji!xji#gji%[ji%_ji%zji~Ol!qO~P!.aOlji~P!.aOk0eOl0fOm0dOn0dOo0mOp0nO~Ot'wO~P!/jOV'|Og'}Oo0cOv0qO~P'vOg'}Oz(OO~Og(QO~O!U(SO~Og(TOz(OO!T%dO!U%cO~P%SOk0eOl0fOm0dOn0dOo0mOp0nOgqa!Tqa!Uqa%{qa!Wqa![qa!Qqa#[qatqa!mqa~PEcOV'|Oo0cOv0qO!W&Sa~P'vOz(WO!W&Sa~O!W(XO~Oz(WO!T%dO!U%cO!W&Sa~P%SOV(]Oo0cOv0qO![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~P'vOz(^O![%}a#g%}a%[%}a%_%}ag%}a{%}a!m%}a%z%}a~O![(aO~Oz(^O!T%dO!U%cO![%}a~P%SOz(dO!T%dO!U%cO![&Ta~P%SOz(gO{&lX![&lX!m&lX%z&lX~O{(kO![(mO!m(nO%z(jO~OV&OOopOvqO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~P'vOz(pO{%hi!x%hi#g%hi%[%hi%_%hi%z%hi~O!f&UOh&sa%[&saz&sa#[&sa#g&sa%_&sa#Z&sag&sa~O%[(uO~OV#sOa#tO%uWO~Oz&]O{wa~OopOvqO~P'vOz(^O#g%}a%[%}a%_%}ag%}a{%}a![%}a!m%}a%z%}a~P%SOz(zO#g%hX%[%hX%_%hX%z%hX~O%z#|O#gUi%[Ui%_Ui~O#g&Pa%[&Pa%_&Pan&Pa~P'vOz(}O#g&Pa%[&Pa%_&Pan&Pa~O%uWO#g&ra%[&ra%_&rag&ra~Oz)SO#g&ra%[&ra%_&rag&ra~Og)VO~OV)WOh$WO%uWO~O#Z)XO~O%uWO#g&ta%[&ta%_&ta~Oz)ZO#g&ta%[&ta%_&ta~Oo0cOv0qO#g&pa%[&pa%_&pa{&pa~P'vOz)^O#g&pa%[&pa%_&pa{&pa~OV)`Oa)`O%uWO~O%z)eO~Ot)hO#j)gOP#hiV#hif#hih#hio#his#hiv#hi!P#hi!Q#hi!T#hi!U#hi!X#hi!]#hi!h#hi!r#hi!s#hi!t#hi!{#hi!}#hi#P#hi#R#hi#T#hi#X#hi#Z#hi#^#hi#_#hi#a#hi#c#hi#l#hi#o#hi#s#hi#u#hi#z#hi#}#hi$P#hi%X#hi%o#hi%p#hi%t#hi%u#hi&Z#hi&[#hi&]#hi&^#hi&_#hi&`#hi&a#hi&b#hi&c#hi&d#hi&e#hi&f#hi&g#hi&h#hi&i#hi&j#hi%Z#hi%_#hi~Ot)iOP#kiV#kif#kih#kio#kis#kiv#ki!P#ki!Q#ki!T#ki!U#ki!X#ki!]#ki!h#ki!r#ki!s#ki!t#ki!{#ki!}#ki#P#ki#R#ki#T#ki#X#ki#Z#ki#^#ki#_#ki#a#ki#c#ki#l#ki#o#ki#s#ki#u#ki#z#ki#}#ki$P#ki%X#ki%o#ki%p#ki%t#ki%u#ki&Z#ki&[#ki&]#ki&^#ki&_#ki&`#ki&a#ki&b#ki&c#ki&d#ki&e#ki&f#ki&g#ki&h#ki&i#ki&j#ki%Z#ki%_#ki~OV)kOn&wa~P'vOz)lOn&wa~Oz)lOn&wa~P%SOn)pO~O%Y)tO~Ot)wO#p'WO#q)vOP#niV#nif#nih#nio#nis#niv#ni!P#ni!Q#ni!T#ni!U#ni!X#ni!]#ni!h#ni!r#ni!s#ni!t#ni!{#ni!}#ni#P#ni#R#ni#T#ni#X#ni#Z#ni#^#ni#_#ni#a#ni#c#ni#l#ni#o#ni#s#ni#u#ni#z#ni#}#ni$P#ni%X#ni%o#ni%p#ni%t#ni%u#ni&Z#ni&[#ni&]#ni&^#ni&_#ni&`#ni&a#ni&b#ni&c#ni&d#ni&e#ni&f#ni&g#ni&h#ni&i#ni&j#ni%Z#ni%_#ni~OV)zOo0cOv0qO{$jO~P'vOo0cOv0qO{&xa~P'vOz*OO{&xa~OV*SOa*TOg*WO%q*UO%uWO~O{$jO&{*YO~Oh'_O~Oh!iO{$jO~O%[*_O~O%[*aO%_*aO~OV$}Oa$}Oo0cOv0qOg&Ua~P'vOz*dOg&Ua~Oo0cOv0qO{*gO!W&Xa~P'vOz*hO!W&Xa~Oo0cOv0qOz*hO{*kO!W&Xa~P'vOo0cOv0qOz*hO!W&Xa~P'vOz*hO{*kO!W&Xa~Om0dOn0dOo0mOp0nOgjikjisjizji!Tji!Uji%{ji!Wji{ji![ji#gji%[ji%_ji!Qji#[jitji!mji%zji~Ol0fO~P!NkOlji~P!NkOV'|Og*pOo0cOv0qO~P'vOn*rO~Og*pOz*tO~Og*uO~OV'|Oo0cOv0qO!W&Si~P'vOz*vO!W&Si~O!W*wO~OV(]Oo0cOv0qO![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~P'vOz*zO!T%dO!U%cO![&Ti~Oz*}O![%}i#g%}i%[%}i%_%}ig%}i{%}i!m%}i%z%}i~O![+OO~Oa+QOo0cOv0qO![&Ti~P'vOz*zO![&Ti~O![+SO~OV+UOo0cOv0qO{&la![&la!m&la%z&la~P'vOz+VO{&la![&la!m&la%z&la~O!]+YO&n+[O![!nX~O![+^O~O{(kO![+_O~O{(kO![+_O!m+`O~OV&OOopOvqO{%hq!x%hq#g%hq%[%hq%_%hq%z%hq~P'vOz$ri{$ri!x$ri#g$ri%[$ri%_$ri%z$ri~P%SOV&OOopOvqO~P'vOV&OOo0cOv0qO#g%ha%[%ha%_%ha%z%ha~P'vOz+aO#g%ha%[%ha%_%ha%z%ha~Oz$ia#g$ia%[$ia%_$ian$ia~P%SO#g&Pi%[&Pi%_&Pin&Pi~P'vOz+dO#g#Wq%[#Wq%_#Wq~O#[+eOz$va#g$va%[$va%_$vag$va~O%uWO#g&ri%[&ri%_&rig&ri~Oz+gO#g&ri%[&ri%_&rig&ri~OV+iOh$WO%uWO~O%uWO#g&ti%[&ti%_&ti~Oo0cOv0qO#g&pi%[&pi%_&pi{&pi~P'vO{#{Oz#eX!W#eX~Oz+mO!W&uX~O!W+oO~Ot+rO#j)gOP#hqV#hqf#hqh#hqo#hqs#hqv#hq!P#hq!Q#hq!T#hq!U#hq!X#hq!]#hq!h#hq!r#hq!s#hq!t#hq!{#hq!}#hq#P#hq#R#hq#T#hq#X#hq#Z#hq#^#hq#_#hq#a#hq#c#hq#l#hq#o#hq#s#hq#u#hq#z#hq#}#hq$P#hq%X#hq%o#hq%p#hq%t#hq%u#hq&Z#hq&[#hq&]#hq&^#hq&_#hq&`#hq&a#hq&b#hq&c#hq&d#hq&e#hq&f#hq&g#hq&h#hq&i#hq&j#hq%Z#hq%_#hq~On$|az$|a~P%SOV)kOn&wi~P'vOz+yOn&wi~Oz,TO{$jO#[,TO~O#q,VOP#nqV#nqf#nqh#nqo#nqs#nqv#nq!P#nq!Q#nq!T#nq!U#nq!X#nq!]#nq!h#nq!r#nq!s#nq!t#nq!{#nq!}#nq#P#nq#R#nq#T#nq#X#nq#Z#nq#^#nq#_#nq#a#nq#c#nq#l#nq#o#nq#s#nq#u#nq#z#nq#}#nq$P#nq%X#nq%o#nq%p#nq%t#nq%u#nq&Z#nq&[#nq&]#nq&^#nq&_#nq&`#nq&a#nq&b#nq&c#nq&d#nq&e#nq&f#nq&g#nq&h#nq&i#nq&j#nq%Z#nq%_#nq~O#[,WOz%Oa{%Oa~Oo0cOv0qO{&xi~P'vOz,YO{&xi~O{#{O%z,[Og&zXz&zX~O%uWOg&zXz&zX~Oz,`Og&yX~Og,bO~O%Y,eO~O!T%dO!U%cOg&Viz&Vi~OV$}Oa$}Oo0cOv0qOg&Ui~P'vO{,hOz$la!W$la~Oo0cOv0qO{,iOz$la!W$la~P'vOo0cOv0qO{*gO!W&Xi~P'vOz,lO!W&Xi~Oo0cOv0qOz,lO!W&Xi~P'vOz,lO{,oO!W&Xi~Og$hiz$hi!W$hi~P%SOV'|Oo0cOv0qO~P'vOn,qO~OV'|Og,rOo0cOv0qO~P'vOV'|Oo0cOv0qO!W&Sq~P'vOz$gi![$gi#g$gi%[$gi%_$gig$gi{$gi!m$gi%z$gi~P%SOV(]Oo0cOv0qO~P'vOa+QOo0cOv0qO![&Tq~P'vOz,sO![&Tq~O![,tO~OV(]Oo0cOv0qO![%}q#g%}q%[%}q%_%}qg%}q{%}q!m%}q%z%}q~P'vO{,uO~OV+UOo0cOv0qO{&li![&li!m&li%z&li~P'vOz,zO{&li![&li!m&li%z&li~O!]+YO&n+[O![!na~O{(kO![,}O~OV&OOo0cOv0qO#g%hi%[%hi%_%hi%z%hi~P'vOz-OO#g%hi%[%hi%_%hi%z%hi~O%uWO#g&rq%[&rq%_&rqg&rq~Oz-RO#g&rq%[&rq%_&rqg&rq~OV)`Oa)`O%uWO!W&ua~Oz-TO!W&ua~On$|iz$|i~P%SOV)kO~P'vOV)kOn&wq~P'vOt-XOP#myV#myf#myh#myo#mys#myv#my!P#my!Q#my!T#my!U#my!X#my!]#my!h#my!r#my!s#my!t#my!{#my!}#my#P#my#R#my#T#my#X#my#Z#my#^#my#_#my#a#my#c#my#l#my#o#my#s#my#u#my#z#my#}#my$P#my%X#my%o#my%p#my%t#my%u#my&Z#my&[#my&]#my&^#my&_#my&`#my&a#my&b#my&c#my&d#my&e#my&f#my&g#my&h#my&i#my&j#my%Z#my%_#my~O%Z-]O%_-]O~P`O#q-^OP#nyV#nyf#nyh#nyo#nys#nyv#ny!P#ny!Q#ny!T#ny!U#ny!X#ny!]#ny!h#ny!r#ny!s#ny!t#ny!{#ny!}#ny#P#ny#R#ny#T#ny#X#ny#Z#ny#^#ny#_#ny#a#ny#c#ny#l#ny#o#ny#s#ny#u#ny#z#ny#}#ny$P#ny%X#ny%o#ny%p#ny%t#ny%u#ny&Z#ny&[#ny&]#ny&^#ny&_#ny&`#ny&a#ny&b#ny&c#ny&d#ny&e#ny&f#ny&g#ny&h#ny&i#ny&j#ny%Z#ny%_#ny~Oz-aO{$jO#[-aO~Oo0cOv0qO{&xq~P'vOz-dO{&xq~O%z,[Og&zaz&za~O{#{Og&zaz&za~OV*SOa*TO%q*UO%uWOg&ya~Oz-hOg&ya~O$S-lO~OV$}Oa$}Oo0cOv0qO~P'vOo0cOv0qO{-mOz$li!W$li~P'vOo0cOv0qOz$li!W$li~P'vO{-mOz$li!W$li~Oo0cOv0qO{*gO~P'vOo0cOv0qO{*gO!W&Xq~P'vOz-pO!W&Xq~Oo0cOv0qOz-pO!W&Xq~P'vOs-sO!T%dO!U%cOg&Oq!W&Oq![&Oqz&Oq~P!/jOa+QOo0cOv0qO![&Ty~P'vOz$ji![$ji~P%SOa+QOo0cOv0qO~P'vOV+UOo0cOv0qO~P'vOV+UOo0cOv0qO{&lq![&lq!m&lq%z&lq~P'vO{(kO![-xO!m-yO%z-wO~OV&OOo0cOv0qO#g%hq%[%hq%_%hq%z%hq~P'vO%uWO#g&ry%[&ry%_&ryg&ry~OV)`Oa)`O%uWO!W&ui~Ot-}OP#m!RV#m!Rf#m!Rh#m!Ro#m!Rs#m!Rv#m!R!P#m!R!Q#m!R!T#m!R!U#m!R!X#m!R!]#m!R!h#m!R!r#m!R!s#m!R!t#m!R!{#m!R!}#m!R#P#m!R#R#m!R#T#m!R#X#m!R#Z#m!R#^#m!R#_#m!R#a#m!R#c#m!R#l#m!R#o#m!R#s#m!R#u#m!R#z#m!R#}#m!R$P#m!R%X#m!R%o#m!R%p#m!R%t#m!R%u#m!R&Z#m!R&[#m!R&]#m!R&^#m!R&_#m!R&`#m!R&a#m!R&b#m!R&c#m!R&d#m!R&e#m!R&f#m!R&g#m!R&h#m!R&i#m!R&j#m!R%Z#m!R%_#m!R~Oo0cOv0qO{&xy~P'vOV*SOa*TO%q*UO%uWOg&yi~O$S-lO%Z.VO%_.VO~OV.aOh._O!X.^O!].`O!h.YO!s.[O!t.[O%p.XO%uWO&Z]O&[]O&]]O&^]O&_]O&`]O&a]O&b]O~Oo0cOv0qOz$lq!W$lq~P'vO{.fOz$lq!W$lq~Oo0cOv0qO{*gO!W&Xy~P'vOz.gO!W&Xy~Oo0cOv.kO~P'vOs-sO!T%dO!U%cOg&Oy!W&Oy![&Oyz&Oy~P!/jO{(kO![.nO~O{(kO![.nO!m.oO~OV*SOa*TO%q*UO%uWO~Oh.tO!f.rOz$TX#[$TX%j$TXg$TX~Os$TX{$TX!W$TX![$TX~P$-bO%o.vO%p.vOs$UXz$UX{$UX#[$UX%j$UX!W$UXg$UX![$UX~O!h.xO~Oz.|O#[/OO%j.yOs&|X{&|X!W&|Xg&|X~Oa/RO~P$)zOh.tOs&}Xz&}X{&}X#[&}X%j&}X!W&}Xg&}X![&}X~Os/VO{$jO~Oo0cOv0qOz$ly!W$ly~P'vOo0cOv0qO{*gO!W&X!R~P'vOz/ZO!W&X!R~Og&RXs&RX!T&RX!U&RX!W&RX![&RXz&RX~P!/jOs-sO!T%dO!U%cOg&Qa!W&Qa![&Qaz&Qa~O{(kO![/^O~O!f.rOh$[as$[az$[a{$[a#[$[a%j$[a!W$[ag$[a![$[a~O!h/eO~O%o.vO%p.vOs$Uaz$Ua{$Ua#[$Ua%j$Ua!W$Uag$Ua![$Ua~O%j.yOs$Yaz$Ya{$Ya#[$Ya!W$Yag$Ya![$Ya~Os&|a{&|a!W&|ag&|a~P$)nOz/jOs&|a{&|a!W&|ag&|a~O!W/mO~Og/mO~O{/oO~O![/pO~Oo0cOv0qO{*gO!W&X!Z~P'vO{/sO~O%z/tO~P$-bOz/uO#[/OO%j.yOg'PX~Oz/uOg'PX~Og/wO~O!h/xO~O#[/OOs%Saz%Sa{%Sa%j%Sa!W%Sag%Sa![%Sa~O#[/OO%j.yOs%Waz%Wa{%Wa!W%Wag%Wa~Os&|i{&|i!W&|ig&|i~P$)nOz/zO#[/OO%j.yO!['Oa~Og'Pa~P$)nOz0SOg'Pa~Oa0UO!['Oi~P$)zOz0WO!['Oi~Oz0WO#[/OO%j.yO!['Oi~O#[/OO%j.yOg$biz$bi~O%z0ZO~P$-bO#[/OO%j.yOg%Vaz%Va~Og'Pi~P$)nO{0^O~Oa0UO!['Oq~P$)zOz0`O!['Oq~O#[/OO%j.yOz%Ui![%Ui~Oa0UO~P$)zOa0UO!['Oy~P$)zO#[/OO%j.yOg$ciz$ci~O#[/OO%j.yOz%Uq![%Uq~Oz+aO#g%ha%[%ha%_%ha%z%ha~P%SOV&OOo0cOv0qO~P'vOn0hO~Oo0hO~P'vO{0iO~Ot0jO~P!/jO&]&Z&j&h&i&g&f&d&e&c&b&`&a&_&^&[%u~",
  goto: "!=j'QPPPPPP'RP'Z*s+[+t,_,y-fP.SP'Z.r.r'ZPPP'Z2[PPPPPP2[5PPP5PP7b7k=sPP=v>h>kPP'Z'ZPP>zPP'Z'ZPP'Z'Z'Z'Z'Z?O?w'ZP?zP@QDXGuGyPG|HWH['ZPPPH_Hk'RP'R'RP'RP'RP'RP'RP'R'R'RP'RPP'RPP'RP'RPHqH}IVPI^IdPI^PI^I^PPPI^PKrPK{LVL]KrPI^LfPI^PLmLsPLwM]MzNeLwLwNkNxLwLwLwLw! ^! d! g! l! o! y!!P!!]!!o!!u!#P!#V!#s!#y!$P!$Z!$a!$g!$y!%T!%Z!%a!%k!%q!%w!%}!&T!&Z!&e!&k!&u!&{!'U!'[!'k!'s!'}!(UPPPPPPPPPPP!([!(_!(e!(n!(x!)TPPPPPPPPPPPP!-u!/Z!3^!6oPP!6w!7W!7a!8Y!8P!8c!8i!8l!8o!8r!8z!9jPPPPPPPPPPPPPPPPP!9m!9q!9wP!:]!:a!:m!:v!;S!;j!;m!;p!;v!;|!<S!<VP!<_!<h!=d!=g]eOn#g$j)t,P'}`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r{!cQ#c#p$R$d$p%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g}!dQ#c#p$R$d$p$u%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!P!eQ#c#p$R$d$p$u$v%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!R!fQ#c#p$R$d$p$u$v$w%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!T!gQ#c#p$R$d$p$u$v$w$x%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!V!hQ#c#p$R$d$p$u$v$w$x$y%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g!Z!hQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0g'}TOTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0r&eVOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0r%oXOYZ[dnrxy}!P!Q!U!i!k#[#d#g#y#{#}$Q$h$j$}%S%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#vqQ/[.kR0o0q't`OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rh#jhz{$W$Z&l&q)S)X+f+g-RW#rq&].k0qQ$]|Q$a!OQ$n!VQ$o!WW$|!i'm*d,gS&[#s#tQ'S$iQ(s&UQ)U&nU)Y&s)Z+jW)a&w+m-T-{Q*Q']W*R'_,`-h.TQ+l)`S,_*S*TQ-Q+eQ-_,TQ-c,WQ.R-al.W-l.^._.a.z.|/R/j/o/t/y0U0Z0^Q/S.`Q/a.tQ/l/OU0P/u0S0[X0V/z0W0_0`R&Z#r!_!wYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZR%^!vQ!{YQ%x#[Q&d#}Q&g$QR,{+YT.j-s/s!Y!jQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gQ&X#kQ'c$oR*^'dR'l$|Q%V!mR/_.r'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rS#a_#b!P.[-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`'|_OTYZ[adnoprtxy}!P!Q!R!U!X!c!d!e!f!g!h!i!k!o!p!q!s!t!z#O#S#T#[#d#g#x#y#{#}$Q$e$g$h$j$q$}%S%Z%^%`%c%g%l%n%w%|&O&Z&_&h&j&k&u&x&|'P'W'Z'l'm'p'r's'w'|(O(S(W(](^(d(g(p(r(z(})^)e)g)k)l)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+Q+U+V+Y+a+c+d+k+x+y,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0l0n0rT#a_#bT#^^#_R(o%xa(l%x(n(o+`,{-y-z.oT+[(k+]R-z,{Q$PsQ+l)aQ,^*RR-e,_X#}s$O$P&fQ&y$aQ'a$nQ'd$oR)s'SQ)b&wV-S+m-T-{ZgOn$j)t,PXkOn)t,PQ$k!TQ&z$bQ&{$cQ'^$mQ'b$oQ)q'RQ)x'WQ){'XQ)|'YQ*Z'`S*]'c'dQ+s)gQ+u)hQ+v)iQ+z)oS+|)r*[Q,Q)vQ,R)wS,S)y)zQ,d*^Q-V+rQ-W+tQ-Y+{S-Z+},OQ-`,UQ-b,VQ-|-XQ.O-[Q.P-^Q.Q-_Q.p-}Q.q.RQ/W.dR/r/XWkOn)t,PR#mjQ'`$nS)r'S'aR,O)sQ,]*RR-f,^Q*['`Q+})rR-[,OZiOjn)t,PQ'f$pR*`'gT-j,e-ku.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^t.c-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^Q/S.`X0V/z0W0_0`!P.Z-l.^._.`.a.t.z.|/R/j/o/t/u/y/z0S0U0W0Z0[0^0_0`Q.w.YR/f.xg.z.].{/b/i/n/|0O0Q0]0a0bu.b-l.^._.a.t.z.|/R/j/o/t/u/y0S0U0Z0[0^X.u.W.b/a0PR/c.tV0R/u0S0[R/X.dQnOS#on,PR,P)tQ&^#uR(x&^S%m#R#wS(_%m(bT(b%p&`Q%a!yQ%h!}W(P%a%h(U(YQ(U%eR(Y%jQ&i$RR)O&iQ(e%qQ*{(`T+R(e*{Q'n%OR*e'nS'q%R%SY*i'q*j,m-q.hU*j'r's'tU,m*k*l*mS-q,n,oR.h-rQ#Y]R%t#YQ#_^R%y#_Q(h%vS+W(h+XR+X(iQ+](kR,|+]Q#b_R%{#bQ#ebQ%}#cW&Q#e%}({+bQ({&cR+b0gQ$OsS&e$O&fR&f$PQ&v$_R)_&vQ&V#jR(t&VQ&m$VS)T&m+hR+h)UQ$Z{R&p$ZQ&t$]R)[&tQ+n)bR-U+nQ#hfR&S#hQ)f&zR+q)fQ&}$dS)m&})nR)n'OQ'V$kR)u'VQ'[$lS*P'[,ZR,Z*QQ,a*VR-i,aWjOn)t,PR#ljQ-k,eR.U-kd.{.]/b/i/n/|0O0Q0]0a0bR/h.{U.s.W/a0PR/`.sQ/{/nS0X/{0YR0Y/|S/v/b/cR0T/vQ.}.]R/k.}R!ZPXmOn)t,PWlOn)t,PR'T$jYfOn$j)t,PR&R#g[sOn#g$j)t,PR&d#}&dQOYZ[dnprxy}!P!Q!U!i!k!o!p!q!s!t#[#d#g#y#{#}$Q$h$j$}%S%Z%^%`%g%l%n%w%|&Z&_&j&k&u&x'P'W'Z'l'm'p'r's'w(O(W(^(d(g(p(r(z)^)e)g)p)t)z*O*Y*d*g*h*k*q*r*t*v*y*z*}+U+V+Y+a+d+k,P,X,Y,],g,h,i,k,l,o,q,s,u,w,y,z-O-d-f-m-p-s.f.g/V/Z/s0c0d0e0f0h0i0j0k0n0rQ!nTQ#caQ#poU$Rt%c(SS$d!R$gQ$p!XQ$u!cQ$v!dQ$w!eQ$x!fQ$y!gQ$z!hQ%e!zQ%j#OQ%p#SQ%q#TQ&`#xQ'O$eQ'g$qQ(q&OU(|&h(}+cW)j&|)l+x+yQ*o'|Q*x(]Q+w)kQ,v+QR0g0lQ!yYQ!}ZQ$b!PQ$c!QQ%R!kQ't%S^'{%`%g(O(W*q*t*v^*f'p*h,k,l-p.g/ZQ*l'rQ*m'sQ+t)gQ,j*gQ,n*kQ-n,hQ-o,iQ-r,oQ.e-mR/Y.f[bOn#g$j)t,P!^!vYZ!P!Q!k%S%`%g'p'r's(O(W)g*g*h*k*q*t*v,h,i,k,l,o-m-p.f.g/ZQ#R[Q#fdS#wrxQ$UyW$_}$Q'P)pS$l!U$hW${!i'm*d,gS%v#[+Y`&P#d%|(p(r(z+a-O0kQ&a#yQ&b#{Q&c#}Q'j$}Q'z%^W([%l(^*y*}Q(`%nQ(i%wQ(v&ZS(y&_0iQ)P&jQ)Q&kU)]&u)^+kQ)d&xQ)y'WY)}'Z*O,X,Y-dQ*b'lS*n'w0jW+P(d*z,s,wW+T(g+V,y,zQ+p)eQ,U)zQ,c*YQ,x+UQ-P+dQ-e,]Q-v,uQ.S-fR/q/VhUOn#d#g$j%|&_'w(p(r)t,P%U!uYZ[drxy}!P!Q!U!i!k#[#y#{#}$Q$h$}%S%^%`%g%l%n%w&Z&j&k&u&x'P'W'Z'l'm'p'r's(O(W(^(d(g(z)^)e)g)p)z*O*Y*d*g*h*k*q*t*v*y*z*}+U+V+Y+a+d+k,X,Y,],g,h,i,k,l,o,s,u,w,y,z-O-d-f-m-p.f.g/V/Z0i0j0kQ#qpW%W!o!s0d0nQ%X!pQ%Y!qQ%[!tQ%f0cS'v%Z0hQ'x0eQ'y0fQ,p*rQ-u,qS.i-s/sR0p0rU#uq.k0qR(w&][cOn#g$j)t,PZ!xY#[#}$Q+YQ#W[Q#zrR$TxQ%b!yQ%i!}Q%o#RQ'j${Q(V%eQ(Z%jQ(c%pQ(f%qQ*|(`Q,f*bQ-t,pQ.m-uR/].lQ$StQ(R%cR*s(SQ.l-sR/}/sR#QZR#V[R%Q!iQ%O!iV*c'm*d,g!Z!lQ!n#c#p$R$d$p$u$v$w$x$y$z%e%j%p%q&`'O'g(q(|)j*o*x+w,v0gR%T!kT#]^#_Q%x#[R,{+YQ(m%xS+_(n(oQ,}+`Q-x,{S.n-y-zR/^.oT+Z(k+]Q$`}Q&g$QQ)o'PR+{)pQ$XzQ)W&qR+i)XQ$XzQ&o$WQ)W&qR+i)XQ#khW$Vz$W&q)XQ$[{Q&r$ZZ)R&l)S+f+g-RR$^|R)c&wXlOn)t,PQ$f!RR'Q$gQ$m!UR'R$hR*X'_Q*V'_V-g,`-h.TQ.d-lQ/P.^R/Q._U.]-l.^._Q/U.aQ/b.tQ/g.zU/i.|/j/yQ/n/RQ/|/oQ0O/tU0Q/u0S0[Q0]0UQ0a0ZR0b0^R/T.`R/d.t",
  nodeNames: "⚠ print Escape { Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ) ( ParenthesizedExpression BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from TupleExpression ComprehensionExpression async for LambdaExpression ] [ ArrayExpression ArrayComprehensionExpression } { DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatSelfDoc FormatConversion FormatSpec FormatReplacement FormatSelfDoc ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert TypeDefinition type TypeParamList TypeParam StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At MatchStatement match MatchBody MatchClause case CapturePattern LiteralPattern ArithOp ArithOp AsPattern OrPattern LogicOp AttributePattern SequencePattern MappingPattern StarPattern ClassPattern PatternArgList KeywordPattern KeywordPattern Guard",
  maxTerm: 277,
  context: Cf,
  nodeProps: [
    ["isolate", -5, 4, 71, 72, 73, 77, ""],
    ["group", -15, 6, 85, 87, 88, 90, 92, 94, 96, 98, 99, 100, 102, 105, 108, 110, "Statement Statement", -22, 8, 18, 21, 25, 40, 49, 50, 56, 57, 60, 61, 62, 63, 64, 67, 70, 71, 72, 79, 80, 81, 82, "Expression", -10, 114, 116, 119, 121, 122, 126, 128, 133, 135, 138, "Statement", -9, 143, 144, 147, 148, 150, 151, 152, 153, 154, "Pattern"],
    ["openedBy", 23, "(", 54, "[", 58, "{"],
    ["closedBy", 24, ")", 55, "]", 59, "}"]
  ],
  propSources: [Ef],
  skippedNodes: [0, 4],
  repeatNodeCount: 34,
  tokenData: "!2|~R!`OX%TXY%oY[%T[]%o]p%Tpq%oqr'ars)Yst*xtu%Tuv,dvw-hwx.Uxy/tyz0[z{0r{|2S|}2p}!O3W!O!P4_!P!Q:Z!Q!R;k!R![>_![!]Do!]!^Es!^!_FZ!_!`Gk!`!aHX!a!b%T!b!cIf!c!dJU!d!eK^!e!hJU!h!i!#f!i!tJU!t!u!,|!u!wJU!w!x!.t!x!}JU!}#O!0S#O#P&o#P#Q!0j#Q#R!1Q#R#SJU#S#T%T#T#UJU#U#VK^#V#YJU#Y#Z!#f#Z#fJU#f#g!,|#g#iJU#i#j!.t#j#oJU#o#p!1n#p#q!1s#q#r!2a#r#s!2f#s$g%T$g;'SJU;'S;=`KW<%lOJU`%YT&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T`%lP;=`<%l%To%v]&n`%c_OX%TXY%oY[%T[]%o]p%Tpq%oq#O%T#O#P&o#P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To&tX&n`OY%TYZ%oZ]%T]^%o^#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc'f[&n`O!_%T!_!`([!`#T%T#T#U(r#U#f%T#f#g(r#g#h(r#h#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(cTmR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc(yT!mR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk)aV&n`&[ZOr%Trs)vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk){V&n`Or%Trs*bs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk*iT&n`&^ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To+PZS_&n`OY*xYZ%TZ]*x]^%T^#o*x#o#p+r#p#q*x#q#r+r#r;'S*x;'S;=`,^<%lO*x_+wTS_OY+rZ]+r^;'S+r;'S;=`,W<%lO+r_,ZP;=`<%l+ro,aP;=`<%l*xj,kV%rQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-XT!xY&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj-oV%lQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.]V&n`&ZZOw%Twx.rx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk.wV&n`Ow%Twx/^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/eT&n`&]ZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk/{ThZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc0cTgR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk0yXVZ&n`Oz%Tz{1f{!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk1mVaR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk2ZV%oZ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc2wTzR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To3_W%pZ&n`O!_%T!_!`-Q!`!a3w!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Td4OT&{S&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk4fX!fQ&n`O!O%T!O!P5R!P!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5WV&n`O!O%T!O!P5m!P#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk5tT!rZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti6[a!hX&n`O!Q%T!Q![6T![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S6T#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti7fZ&n`O{%T{|8X|}%T}!O8X!O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8^V&n`O!Q%T!Q![8s![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti8z]!hX&n`O!Q%T!Q![8s![!l%T!l!m9s!m#R%T#R#S8s#S#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti9zT!hX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk:bX%qR&n`O!P%T!P!Q:}!Q!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj;UV%sQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti;ro!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!d%T!d!e?q!e!g%T!g!h7a!h!l%T!l!m9s!m!q%T!q!rA]!r!z%T!z!{Bq!{#R%T#R#S>_#S#U%T#U#V?q#V#X%T#X#Y7a#Y#^%T#^#_9s#_#c%T#c#dA]#d#l%T#l#mBq#m#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti=xV&n`O!Q%T!Q![6T![#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti>fc!hX&n`O!O%T!O!P=s!P!Q%T!Q![>_![!g%T!g!h7a!h!l%T!l!m9s!m#R%T#R#S>_#S#X%T#X#Y7a#Y#^%T#^#_9s#_#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti?vY&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Ti@mY!hX&n`O!Q%T!Q!R@f!R!S@f!S#R%T#R#S@f#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiAbX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBUX!hX&n`O!Q%T!Q!YA}!Y#R%T#R#SA}#S#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiBv]&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TiCv]!hX&n`O!Q%T!Q![Co![!c%T!c!iCo!i#R%T#R#SCo#S#T%T#T#ZCo#Z#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToDvV{_&n`O!_%T!_!`E]!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TcEdT%{R&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkEzT#gZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkFbXmR&n`O!^%T!^!_F}!_!`([!`!a([!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjGUV%mQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkGrV%zZ&n`O!_%T!_!`([!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkH`WmR&n`O!_%T!_!`([!`!aHx!a#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TjIPV%nQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkIoV_Q#}P&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%ToJ_]&n`&YS%uZO!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoKZP;=`<%lJUoKge&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!tJU!t!uLx!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#gLx#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUoMRa&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUkN_V&n`&`ZOr%TrsNts#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%TkNyV&n`Or%Trs! `s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! gT&n`&bZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk! }V&n`&_ZOw%Twx!!dx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!!iV&n`Ow%Twx!#Ox#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!#VT&n`&aZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!#oe&n`&YS%uZOr%Trs!%Qsw%Twx!&px!Q%T!Q![JU![!c%T!c!tJU!t!u!(`!u!}JU!}#R%T#R#SJU#S#T%T#T#fJU#f#g!(`#g#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!%XV&n`&dZOr%Trs!%ns#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!%sV&n`Or%Trs!&Ys#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&aT&n`&fZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!&wV&n`&cZOw%Twx!'^x#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!'cV&n`Ow%Twx!'xx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!(PT&n`&eZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!(ia&n`&YS%uZOr%Trs!)nsw%Twx!+^x!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!)uV&n`&hZOr%Trs!*[s#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*aV&n`Or%Trs!*vs#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!*}T&n`&jZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!+eV&n`&gZOw%Twx!+zx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,PV&n`Ow%Twx!,fx#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tk!,mT&n`&iZO#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%To!-Vi&n`&YS%uZOr%TrsNWsw%Twx! vx!Q%T!Q![JU![!c%T!c!dJU!d!eLx!e!hJU!h!i!(`!i!}JU!}#R%T#R#SJU#S#T%T#T#UJU#U#VLx#V#YJU#Y#Z!(`#Z#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUo!.}a&n`&YS%uZOr%Trs)Ysw%Twx.Ux!Q%T!Q![JU![!c%T!c!}JU!}#R%T#R#SJU#S#T%T#T#oJU#p#q%T#r$g%T$g;'SJU;'S;=`KW<%lOJUk!0ZT!XZ&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tc!0qT!WR&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%Tj!1XV%kQ&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!1sO!]~k!1zV%jR&n`O!_%T!_!`-Q!`#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T~!2fO![~i!2mT%tX&n`O#o%T#p#q%T#r;'S%T;'S;=`%i<%lO%T",
  tokenizers: [Af, Tf, vf, Rf, 0, 1, 2, 3, 4],
  topRules: { Script: [0, 5] },
  specialized: [{ term: 221, get: (n) => Mf[n] || -1 }],
  tokenPrec: 7668
});
let en = [], nl = [];
(() => {
  let n = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((e) => e ? parseInt(e, 36) : 1);
  for (let e = 0, t = 0; e < n.length; e++)
    (e % 2 ? nl : en).push(t = t + n[e]);
})();
function Wf(n) {
  if (n < 768) return !1;
  for (let e = 0, t = en.length; ; ) {
    let i = e + t >> 1;
    if (n < en[i]) t = i;
    else if (n >= nl[i]) e = i + 1;
    else return !0;
    if (e == t) return !1;
  }
}
function qr(n) {
  return n >= 127462 && n <= 127487;
}
const Er = 8205;
function Df(n, e, t = !0, i = !0) {
  return (t ? rl : zf)(n, e, i);
}
function rl(n, e, t) {
  if (e == n.length) return e;
  e && ol(n.charCodeAt(e)) && ll(n.charCodeAt(e - 1)) && e--;
  let i = Ps(n, e);
  for (e += Mr(i); e < n.length; ) {
    let s = Ps(n, e);
    if (i == Er || s == Er || t && Wf(s))
      e += Mr(s), i = s;
    else if (qr(s)) {
      let r = 0, o = e - 2;
      for (; o >= 0 && qr(Ps(n, o)); )
        r++, o -= 2;
      if (r % 2 == 0) break;
      e += 2;
    } else
      break;
  }
  return e;
}
function zf(n, e, t) {
  for (; e > 1; ) {
    let i = rl(n, e - 2, t);
    if (i < e) return i;
    e--;
  }
  return 0;
}
function Ps(n, e) {
  let t = n.charCodeAt(e);
  if (!ll(t) || e + 1 == n.length) return t;
  let i = n.charCodeAt(e + 1);
  return ol(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function ol(n) {
  return n >= 56320 && n < 57344;
}
function ll(n) {
  return n >= 55296 && n < 56320;
}
function Mr(n) {
  return n < 65536 ? 1 : 2;
}
class D {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = Mt(this, e, t);
    let s = [];
    return this.decompose(
      0,
      e,
      s,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      s,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      s,
      1
      /* Open.From */
    ), Ee.from(s, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = Mt(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), Ee.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), s = new Gt(this), r = new Gt(e);
    for (let o = t, l = t; ; ) {
      if (s.next(o), r.next(o), o = 0, s.lineBreak != r.lineBreak || s.done != r.done || s.value != r.value)
        return !1;
      if (l += s.value.length, s.done || l >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new Gt(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new al(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let s = this.line(e).from;
      i = this.iterRange(s, Math.max(s, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new hl(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? D.empty : e.length <= 32 ? new Z(e) : Ee.from(Z.split(e, []));
  }
}
class Z extends D {
  constructor(e, t = Bf(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.text[r], l = s + o.length;
      if ((t ? i : l) >= e)
        return new If(s, l, i, o);
      s = l + 1, i++;
    }
  }
  decompose(e, t, i, s) {
    let r = e <= 0 && t >= this.length ? this : new Z($r(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (s & 1) {
      let o = i.pop(), l = Ii(r.text, o.text.slice(), 0, r.length);
      if (l.length <= 32)
        i.push(new Z(l, o.length + r.length));
      else {
        let a = l.length >> 1;
        i.push(new Z(l.slice(0, a)), new Z(l.slice(a)));
      }
    } else
      i.push(r);
  }
  replace(e, t, i) {
    if (!(i instanceof Z))
      return super.replace(e, t, i);
    [e, t] = Mt(this, e, t);
    let s = Ii(this.text, Ii(i.text, $r(this.text, 0, e)), t), r = this.length + i.length - (t - e);
    return s.length <= 32 ? new Z(s, r) : Ee.from(Z.split(s, []), r);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Mt(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r <= t && o < this.text.length; o++) {
      let l = this.text[o], a = r + l.length;
      r > e && o && (s += i), e < a && t > r && (s += l.slice(Math.max(0, e - r), t - r)), r = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], s = -1;
    for (let r of e)
      i.push(r), s += r.length + 1, i.length == 32 && (t.push(new Z(i, s)), i = [], s = -1);
    return s > -1 && t.push(new Z(i, s)), t;
  }
}
class Ee extends D {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.children[r], l = s + o.length, a = i + o.lines - 1;
      if ((t ? a : l) >= e)
        return o.lineInner(e, t, i, s);
      s = l + 1, i = a + 1;
    }
  }
  decompose(e, t, i, s) {
    for (let r = 0, o = 0; o <= t && r < this.children.length; r++) {
      let l = this.children[r], a = o + l.length;
      if (e <= a && t >= o) {
        let h = s & ((o <= e ? 1 : 0) | (a >= t ? 2 : 0));
        o >= e && a <= t && !h ? i.push(l) : l.decompose(e - o, t - o, i, h);
      }
      o = a + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = Mt(this, e, t), i.lines < this.lines)
      for (let s = 0, r = 0; s < this.children.length; s++) {
        let o = this.children[s], l = r + o.length;
        if (e >= r && t <= l) {
          let a = o.replace(e - r, t - r, i), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 4 && a.lines > h >> 6) {
            let f = this.children.slice();
            return f[s] = a, new Ee(f, this.length - (t - e) + i.length);
          }
          return super.replace(r, l, a);
        }
        r = l + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Mt(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r < this.children.length && o <= t; r++) {
      let l = this.children[r], a = o + l.length;
      o > e && r && (s += i), e < a && t > o && (s += l.sliceString(e - o, t - o, i)), o = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof Ee))
      return 0;
    let i = 0, [s, r, o, l] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; s += t, r += t) {
      if (s == o || r == l)
        return i;
      let a = this.children[s], h = e.children[r];
      if (a != h)
        return i + a.scanIdentical(h, t);
      i += a.length + 1;
    }
  }
  static from(e, t = e.reduce((i, s) => i + s.length + 1, -1)) {
    let i = 0;
    for (let d of e)
      i += d.lines;
    if (i < 32) {
      let d = [];
      for (let p of e)
        p.flatten(d);
      return new Z(d, t);
    }
    let s = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), r = s << 1, o = s >> 1, l = [], a = 0, h = -1, f = [];
    function c(d) {
      let p;
      if (d.lines > r && d instanceof Ee)
        for (let g of d.children)
          c(g);
      else d.lines > o && (a > o || !a) ? (u(), l.push(d)) : d instanceof Z && a && (p = f[f.length - 1]) instanceof Z && d.lines + p.lines <= 32 ? (a += d.lines, h += d.length + 1, f[f.length - 1] = new Z(p.text.concat(d.text), p.length + 1 + d.length)) : (a + d.lines > s && u(), a += d.lines, h += d.length + 1, f.push(d));
    }
    function u() {
      a != 0 && (l.push(f.length == 1 ? f[0] : Ee.from(f, h)), h = -1, a = f.length = 0);
    }
    for (let d of e)
      c(d);
    return u(), l.length == 1 ? l[0] : new Ee(l, t);
  }
}
D.empty = /* @__PURE__ */ new Z([""], 0);
function Bf(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function Ii(n, e, t = 0, i = 1e9) {
  for (let s = 0, r = 0, o = !0; r < n.length && s <= i; r++) {
    let l = n[r], a = s + l.length;
    a >= t && (a > i && (l = l.slice(0, i - s)), s < t && (l = l.slice(t - s)), o ? (e[e.length - 1] += l, o = !1) : e.push(l)), s = a + 1;
  }
  return e;
}
function $r(n, e, t) {
  return Ii(n, [""], e, t);
}
class Gt {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof Z ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, s = this.nodes[i], r = this.offsets[i], o = r >> 1, l = s instanceof Z ? s.text.length : s.children.length;
      if (o == (t > 0 ? l : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((r & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (s instanceof Z) {
        let a = s.text[o + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, a.length > Math.max(0, e))
          return this.value = e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e), this;
        e -= a.length;
      } else {
        let a = s.children[o + (t < 0 ? -1 : 0)];
        e > a.length ? (e -= a.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(t > 0 ? 1 : (a instanceof Z ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class al {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new Gt(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: s } = this.cursor.next(e);
    return this.pos += (s.length + e) * t, this.value = s.length <= i ? s : t < 0 ? s.slice(s.length - i) : s.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class hl {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: s } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = s, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (D.prototype[Symbol.iterator] = function() {
  return this.iter();
}, Gt.prototype[Symbol.iterator] = al.prototype[Symbol.iterator] = hl.prototype[Symbol.iterator] = function() {
  return this;
});
class If {
  /**
  @internal
  */
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.number = i, this.text = s;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Mt(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
function we(n, e, t = !0, i = !0) {
  return Df(n, e, t, i);
}
function Nf(n) {
  return n >= 56320 && n < 57344;
}
function Lf(n) {
  return n >= 55296 && n < 56320;
}
function fl(n, e) {
  let t = n.charCodeAt(e);
  if (!Lf(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return Nf(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function Qp(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function Vf(n) {
  return n < 65536 ? 1 : 2;
}
const tn = /\r\n?|\n/;
var le = /* @__PURE__ */ (function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
})(le || (le = {}));
class He {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, s = 0; t < this.sections.length; ) {
      let r = this.sections[t++], o = this.sections[t++];
      o < 0 ? (e(i, s, r), s += r) : s += o, i += r;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    sn(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      s < 0 ? e.push(i, s) : e.push(s, i);
    }
    return new He(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : cl(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `this` happened before the ones in `other`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : nn(this, e, t);
  }
  mapPos(e, t = -1, i = le.Simple) {
    let s = 0, r = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = s + l;
      if (a < 0) {
        if (h > e)
          return r + (e - s);
        r += l;
      } else {
        if (i != le.Simple && h >= e && (i == le.TrackDel && s < e && h > e || i == le.TrackBefore && s < e || i == le.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !l)
          return e == s || t < 0 ? r : r + a;
        r += a;
      }
      s = h;
    }
    if (e > s)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${s}`);
    return r;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, s = 0; i < this.sections.length && s <= t; ) {
      let r = this.sections[i++], o = this.sections[i++], l = s + r;
      if (o >= 0 && s <= t && l >= e)
        return s < e && l > t ? "cover" : !0;
      s = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      e += (e ? " " : "") + i + (s >= 0 ? ":" + s : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new He(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new He(e);
  }
}
class Y extends He {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return sn(this, (t, i, s, r, o) => e = e.replace(s, s + (i - t), o), !1), e;
  }
  mapDesc(e, t = !1) {
    return nn(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let s = 0, r = 0; s < t.length; s += 2) {
      let o = t[s], l = t[s + 1];
      if (l >= 0) {
        t[s] = l, t[s + 1] = o;
        let a = s >> 1;
        for (; i.length < a; )
          i.push(D.empty);
        i.push(o ? e.slice(r, r + o) : D.empty);
      }
      r += o;
    }
    return new Y(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : cl(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : nn(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    sn(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return He.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], s = [], r = new si(this);
    e: for (let o = 0, l = 0; ; ) {
      let a = o == e.length ? 1e9 : e[o++];
      for (; l < a || l == a && r.len == 0; ) {
        if (r.done)
          break e;
        let f = Math.min(r.len, a - l);
        se(s, f, -1);
        let c = r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0;
        se(t, f, c), c > 0 && it(i, t, r.text), r.forward(f), l += f;
      }
      let h = e[o++];
      for (; l < h; ) {
        if (r.done)
          break e;
        let f = Math.min(r.len, h - l);
        se(t, f, -1), se(s, f, r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0), r.forward(f), l += f;
      }
    }
    return {
      changes: new Y(t, i),
      filtered: He.create(s)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], s = this.sections[t + 1];
      s < 0 ? e.push(i) : s == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let s = [], r = [], o = 0, l = null;
    function a(f = !1) {
      if (!f && !s.length)
        return;
      o < t && se(s, t - o, -1);
      let c = new Y(s, r);
      l = l ? l.compose(c.map(l)) : c, s = [], r = [], o = 0;
    }
    function h(f) {
      if (Array.isArray(f))
        for (let c of f)
          h(c);
      else if (f instanceof Y) {
        if (f.length != t)
          throw new RangeError(`Mismatched change set length (got ${f.length}, expected ${t})`);
        a(), l = l ? l.compose(f.map(l)) : f;
      } else {
        let { from: c, to: u = c, insert: d } = f;
        if (c > u || c < 0 || u > t)
          throw new RangeError(`Invalid change range ${c} to ${u} (in doc of length ${t})`);
        let p = d ? typeof d == "string" ? D.of(d.split(i || tn)) : d : D.empty, g = p.length;
        if (c == u && g == 0)
          return;
        c < o && a(), c > o && se(s, c - o, -1), se(s, u - c, g), it(r, s, p), o = u;
      }
    }
    return h(e), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new Y(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (typeof r == "number")
        t.push(r, -1);
      else {
        if (!Array.isArray(r) || typeof r[0] != "number" || r.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (r.length == 1)
          t.push(r[0], 0);
        else {
          for (; i.length < s; )
            i.push(D.empty);
          i[s] = D.of(r.slice(1)), t.push(r[0], i[s].length);
        }
      }
    }
    return new Y(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new Y(e, t);
  }
}
function se(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let s = n.length - 2;
  s >= 0 && t <= 0 && t == n[s + 1] ? n[s] += e : s >= 0 && e == 0 && n[s] == 0 ? n[s + 1] += t : i ? (n[s] += e, n[s + 1] += t) : n.push(e, t);
}
function it(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(D.empty);
    n.push(t);
  }
}
function sn(n, e, t) {
  let i = n.inserted;
  for (let s = 0, r = 0, o = 0; o < n.sections.length; ) {
    let l = n.sections[o++], a = n.sections[o++];
    if (a < 0)
      s += l, r += l;
    else {
      let h = s, f = r, c = D.empty;
      for (; h += l, f += a, a && i && (c = c.append(i[o - 2 >> 1])), !(t || o == n.sections.length || n.sections[o + 1] < 0); )
        l = n.sections[o++], a = n.sections[o++];
      e(s, h, r, f, c), s = h, r = f;
    }
  }
}
function nn(n, e, t, i = !1) {
  let s = [], r = i ? [] : null, o = new si(n), l = new si(e);
  for (let a = -1; ; ) {
    if (o.done && l.len || l.done && o.len)
      throw new Error("Mismatched change set lengths");
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      se(s, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !t))) {
      let h = l.len;
      for (se(s, l.ins, -1); h; ) {
        let f = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= f && (se(s, 0, o.ins), r && it(r, s, o.text), a = o.i), o.forward(f), h -= f;
      }
      l.next();
    } else if (o.ins >= 0) {
      let h = 0, f = o.len;
      for (; f; )
        if (l.ins == -1) {
          let c = Math.min(f, l.len);
          h += c, f -= c, l.forward(c);
        } else if (l.ins == 0 && l.len < f)
          f -= l.len, l.next();
        else
          break;
      se(s, h, a < o.i ? o.ins : 0), r && a < o.i && it(r, s, o.text), a = o.i, o.forward(o.len - f);
    } else {
      if (o.done && l.done)
        return r ? Y.createSet(s, r) : He.create(s);
      throw new Error("Mismatched change set lengths");
    }
  }
}
function cl(n, e, t = !1) {
  let i = [], s = t ? [] : null, r = new si(n), o = new si(e);
  for (let l = !1; ; ) {
    if (r.done && o.done)
      return s ? Y.createSet(i, s) : He.create(i);
    if (r.ins == 0)
      se(i, r.len, 0, l), r.next();
    else if (o.len == 0 && !o.done)
      se(i, 0, o.ins, l), s && it(s, i, o.text), o.next();
    else {
      if (r.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(r.len2, o.len), h = i.length;
        if (r.ins == -1) {
          let f = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          se(i, a, f, l), s && f && it(s, i, o.text);
        } else o.ins == -1 ? (se(i, r.off ? 0 : r.len, a, l), s && it(s, i, r.textBit(a))) : (se(i, r.off ? 0 : r.len, o.off ? 0 : o.ins, l), s && !o.off && it(s, i, o.text));
        l = (r.ins > a || o.ins >= 0 && o.len > a) && (l || i.length > h), r.forward2(a), o.forward(a);
      }
    }
  }
}
class si {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? D.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? D.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class et {
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.flags = i, this.goalColumn = s;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  A flag that, when set, makes some selection-extending commands
  treat the range's head and anchor as exchangeable, so that for
  example Shift-ArrowUp will make the lower side of the selection
  the anchor, even if that was the head before. Used to implement
  MacOS-style undirectional selections.
  */
  get undirectional() {
    return (this.flags & 64) > 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, s;
    return this.empty ? i = s = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), s = e.mapPos(this.to, -1)), i == this.from && s == this.to ? this : new et(i, s, this.flags, this.goalColumn);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e, i = 0) {
    if (e <= this.anchor && t >= this.anchor)
      return v.range(e, t, void 0, void 0, i);
    let s = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return v.range(this.anchor, s, void 0, void 0, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && this.goalColumn == e.goalColumn && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return v.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i, s) {
    return new et(e, t, i, s);
  }
}
class v {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : v.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(e.ranges[i], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new v([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return v.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, v.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new v(e.ranges.map((t) => et.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new v([v.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, s = 0; s < e.length; s++) {
      let r = e[s];
      if (r.empty ? r.from <= i : r.from < i)
        return v.normalized(e.slice(), t);
      i = r.to;
    }
    return new v(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, s) {
    return et.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)), s);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, s, r) {
    let o = s == null ? 7 : Math.min(6, s);
    return !r && e != t && (r = t < e ? 1 : -1), r && (o |= r < 0 ? 8 : 16), t < e ? et.create(t, e, o | 32, i) : et.create(e, t, o, i);
  }
  /**
  Create an [undirectional](https://codemirror.net/6/docs/ref/#state.SelectionRange.undirectional)
  selection range.
  */
  static undirectionalRange(e, t) {
    return et.create(e, t, 64, void 0);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((s, r) => s.from - r.from), t = e.indexOf(i);
    for (let s = 1; s < e.length; s++) {
      let r = e[s], o = e[s - 1];
      if (r.empty ? r.from <= o.to : r.from < o.to) {
        let l = o.from, a = Math.max(r.to, o.to);
        s <= t && t--, e.splice(--s, 2, r.anchor > r.head ? v.range(a, l) : v.range(l, a));
      }
    }
    return new v(e, t);
  }
}
function ul(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let _n = 0;
class P {
  constructor(e, t, i, s, r) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = s, this.id = _n++, this.default = e([]), this.extensions = typeof r == "function" ? r(this) : r;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new P(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : Xn), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new Ni([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new Ni(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new Ni(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function Xn(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class Ni {
  constructor(e, t, i, s) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = s, this.id = _n++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, s = this.facet.compareInput, r = this.id, o = e[r] >> 1, l = this.type == 2, a = !1, h = !1, f = [];
    for (let c of this.dependencies)
      c == "doc" ? a = !0 : c == "selection" ? h = !0 : (((t = e[c.id]) !== null && t !== void 0 ? t : 1) & 1) == 0 && f.push(e[c.id]);
    return {
      create(c) {
        return c.values[o] = i(c), 1;
      },
      update(c, u) {
        if (a && u.docChanged || h && (u.docChanged || u.selection) || rn(c, f)) {
          let d = i(c);
          if (l ? !Wr(d, c.values[o], s) : !s(d, c.values[o]))
            return c.values[o] = d, 1;
        }
        return 0;
      },
      reconfigure: (c, u) => {
        let d, p = u.config.address[r];
        if (p != null) {
          let g = es(u, p);
          if (this.dependencies.every((m) => m instanceof P ? u.facet(m) === c.facet(m) : m instanceof Ye ? u.field(m, !1) == c.field(m, !1) : !0) || (l ? Wr(d = i(c), g, s) : s(d = i(c), g)))
            return c.values[o] = g, 0;
        } else
          d = i(c);
        return c.values[o] = d, 1;
      }
    };
  }
  get extension() {
    return this;
  }
}
function Wr(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function rn(n, e) {
  let t = !1;
  for (let i of e)
    Zt(n, i) & 1 && (t = !0);
  return t;
}
function _f(n, e, t) {
  let i = t.map((a) => n[a.id]), s = t.map((a) => a.type), r = i.filter((a) => !(a & 1)), o = n[e.id] >> 1;
  function l(a) {
    let h = [];
    for (let f = 0; f < i.length; f++) {
      let c = es(a, i[f]);
      if (s[f] == 2)
        for (let u of c)
          h.push(u);
      else
        h.push(c);
    }
    return e.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        Zt(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!rn(a, r))
        return 0;
      let f = l(a);
      return e.compare(f, a.values[o]) ? 0 : (a.values[o] = f, 1);
    },
    reconfigure(a, h) {
      let f = rn(a, i), c = h.config.facets[e.id], u = h.facet(e);
      if (c && !f && Xn(t, c))
        return a.values[o] = u, 0;
      let d = l(a);
      return e.compare(d, u) ? (a.values[o] = u, 0) : (a.values[o] = d, 1);
    }
  };
}
const xi = /* @__PURE__ */ P.define({ static: !0 });
class Ye {
  constructor(e, t, i, s, r) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = s, this.spec = r, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new Ye(_n++, e.create, e.update, e.compare || ((i, s) => i === s), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(xi).find((i) => i.field == this);
    return ((t == null ? void 0 : t.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, s) => {
        let r = i.values[t], o = this.updateF(r, s);
        return this.compareF(r, o) ? 0 : (i.values[t] = o, 1);
      },
      reconfigure: (i, s) => {
        let r = i.facet(xi), o = s.facet(xi), l;
        return (l = r.find((a) => a.field == this)) && l != o.find((a) => a.field == this) ? (i.values[t] = l.create(i), 1) : s.config.address[this.id] != null ? (i.values[t] = s.field(this), 0) : (i.values[t] = this.create(i), 1);
      }
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, xi.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const ut = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function _t(n) {
  return (e) => new dl(e, n);
}
const ci = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ _t(ut.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ _t(ut.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ _t(ut.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ _t(ut.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ _t(ut.lowest)
};
class dl {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
  get extension() {
    return this;
  }
}
class ps {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new on(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return ps.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class on {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
  get extension() {
    return this;
  }
}
class Ji {
  constructor(e, t, i, s, r, o) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = s, this.staticValues = r, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let s = [], r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let u of Xf(e, t, o))
      u instanceof Ye ? s.push(u) : (r[u.facet.id] || (r[u.facet.id] = [])).push(u);
    let l = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let u of s)
      l[u.id] = h.length << 1, h.push((d) => u.slot(d));
    let f = i == null ? void 0 : i.config.facets;
    for (let u in r) {
      let d = r[u], p = d[0].facet, g = f && f[u] || [];
      if (d.every(
        (m) => m.type == 0
        /* Provider.Static */
      ))
        if (l[p.id] = a.length << 1 | 1, Xn(g, d))
          a.push(i.facet(p));
        else {
          let m = p.combine(d.map((O) => O.value));
          a.push(i && p.compare(m, i.facet(p)) ? i.facet(p) : m);
        }
      else {
        for (let m of d)
          m.type == 0 ? (l[m.id] = a.length << 1 | 1, a.push(m.value)) : (l[m.id] = h.length << 1, h.push((O) => m.dynamicSlot(O)));
        l[p.id] = h.length << 1, h.push((m) => _f(m, p, d));
      }
    }
    let c = h.map((u) => u(l));
    return new Ji(e, o, c, l, a, r);
  }
}
function Xf(n, e, t) {
  let i = [[], [], [], [], []], s = /* @__PURE__ */ new Map();
  function r(o, l) {
    let a = s.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = i[a].indexOf(o);
      h > -1 && i[a].splice(h, 1), o instanceof on && t.delete(o.compartment);
    }
    if (s.set(o, l), Array.isArray(o))
      for (let h of o)
        r(h, l);
    else if (o instanceof on) {
      if (t.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(o.compartment) || o.inner;
      t.set(o.compartment, h), r(h, l);
    } else if (o instanceof dl)
      r(o.inner, o.prec);
    else if (o instanceof Ye)
      i[l].push(o), o.provides && r(o.provides, l);
    else if (o instanceof Ni)
      i[l].push(o), o.facet.extensions && r(o.facet.extensions, ut.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}).`);
      if (h == o)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      r(h, l);
    }
  }
  return r(n, ut.default), i.reduce((o, l) => o.concat(l));
}
function Zt(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let s = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | s;
}
function es(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const pl = /* @__PURE__ */ P.define(), ln = /* @__PURE__ */ P.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), gl = /* @__PURE__ */ P.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), ml = /* @__PURE__ */ P.define(), Ol = /* @__PURE__ */ P.define(), yl = /* @__PURE__ */ P.define(), bl = /* @__PURE__ */ P.define({
  combine: (n) => n.length ? n[0] : !1
});
class bt {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new Ff();
  }
}
class Ff {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new bt(this, e);
  }
}
class jf {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new j(this, e);
  }
}
class j {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new j(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new jf(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let s of e) {
      let r = s.map(t);
      r && i.push(r);
    }
    return i;
  }
}
j.reconfigure = /* @__PURE__ */ j.define();
j.appendConfig = /* @__PURE__ */ j.define();
class te {
  constructor(e, t, i, s, r, o) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = s, this.annotations = r, this.scrollIntoView = o, this._doc = null, this._state = null, i && ul(i, t.newLength), r.some((l) => l.type == te.time) || (this.annotations = r.concat(te.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, s, r, o) {
    return new te(e, t, i, s, r, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(te.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
te.time = /* @__PURE__ */ bt.define();
te.userEvent = /* @__PURE__ */ bt.define();
te.addToHistory = /* @__PURE__ */ bt.define();
te.remote = /* @__PURE__ */ bt.define();
function Uf(n, e) {
  let t = [];
  for (let i = 0, s = 0; ; ) {
    let r, o;
    if (i < n.length && (s == e.length || e[s] >= n[i]))
      r = n[i++], o = n[i++];
    else if (s < e.length)
      r = e[s++], o = e[s++];
    else
      return t;
    !t.length || t[t.length - 1] < r ? t.push(r, o) : t[t.length - 1] < o && (t[t.length - 1] = o);
  }
}
function Sl(n, e, t) {
  var i;
  let s, r, o;
  return t ? (s = e.changes, r = Y.empty(e.changes.length), o = n.changes.compose(e.changes)) : (s = e.changes.map(n.changes), r = n.changes.mapDesc(e.changes, !0), o = n.changes.compose(s)), {
    changes: o,
    selection: e.selection ? e.selection.map(r) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(s),
    effects: j.mapEffects(n.effects, s).concat(j.mapEffects(e.effects, r)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function an(n, e, t) {
  let i = e.selection, s = At(e.annotations);
  return e.userEvent && (s = s.concat(te.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof Y ? e.changes : Y.of(e.changes || [], t, n.facet(gl)),
    selection: i && (i instanceof v ? i : v.single(i.anchor, i.head)),
    effects: At(e.effects),
    annotations: s,
    scrollIntoView: !!e.scrollIntoView
  };
}
function xl(n, e, t) {
  let i = an(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let r = 1; r < e.length; r++) {
    e[r].filter === !1 && (t = !1);
    let o = !!e[r].sequential;
    i = Sl(i, an(n, e[r], o ? i.changes.newLength : n.doc.length), o);
  }
  let s = te.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return Gf(t ? Hf(s) : s);
}
function Hf(n) {
  let e = n.startState, t = !0;
  for (let s of e.facet(ml)) {
    let r = s(n);
    if (r === !1) {
      t = !1;
      break;
    }
    Array.isArray(r) && (t = t === !0 ? r : Uf(t, r));
  }
  if (t !== !0) {
    let s, r;
    if (t === !1)
      r = n.changes.invertedDesc, s = Y.empty(e.doc.length);
    else {
      let o = n.changes.filter(t);
      s = o.changes, r = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = te.create(e, s, n.selection && n.selection.map(r), j.mapEffects(n.effects, r), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(Ol);
  for (let s = i.length - 1; s >= 0; s--) {
    let r = i[s](n);
    r instanceof te ? n = r : Array.isArray(r) && r.length == 1 && r[0] instanceof te ? n = r[0] : n = xl(e, At(r), !1);
  }
  return n;
}
function Gf(n) {
  let e = n.startState, t = e.facet(yl), i = n;
  for (let s = t.length - 1; s >= 0; s--) {
    let r = t[s](n);
    r && Object.keys(r).length && (i = Sl(i, an(e, r, n.changes.newLength), !0));
  }
  return i == n ? n : te.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const Zf = [];
function At(n) {
  return n == null ? Zf : Array.isArray(n) ? n : [n];
}
var je = /* @__PURE__ */ (function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
})(je || (je = {}));
const Yf = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let hn;
try {
  hn = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function Kf(n) {
  if (hn)
    return hn.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || Yf.test(t)))
      return !0;
  }
  return !1;
}
function Jf(n) {
  return (e) => {
    if (!/\S/.test(e))
      return je.Space;
    if (Kf(e))
      return je.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return je.Word;
    return je.Other;
  };
}
class N {
  constructor(e, t, i, s, r, o) {
    this.config = e, this.doc = t, this.selection = i, this.values = s, this.status = e.statusTemplate.slice(), this.computeSlot = r, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      Zt(this, l << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return Zt(this, i), es(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return xl(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: s } = t;
    for (let l of e.effects)
      l.is(ps.reconfigure) ? (t && (s = /* @__PURE__ */ new Map(), t.compartments.forEach((a, h) => s.set(h, a)), t = null), s.set(l.value.compartment, l.value.extension)) : l.is(j.reconfigure) ? (t = null, i = l.value) : l.is(j.appendConfig) && (t = null, i = At(i).concat(l.value));
    let r;
    t ? r = e.startState.values.slice() : (t = Ji.resolve(i, s, this), r = new N(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let o = e.startState.facet(ln) ? e.newSelection : e.newSelection.asSingle();
    new N(t, e.newDoc, o, r, (l, a) => a.update(l, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: v.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), s = this.changes(i.changes), r = [i.range], o = At(i.effects);
    for (let l = 1; l < t.ranges.length; l++) {
      let a = e(t.ranges[l]), h = this.changes(a.changes), f = h.map(s);
      for (let u = 0; u < l; u++)
        r[u] = r[u].map(f);
      let c = s.mapDesc(h, !0);
      r.push(a.range.map(c)), s = s.compose(f), o = j.mapEffects(o, f).concat(j.mapEffects(At(a.effects), c));
    }
    return {
      changes: s,
      selection: v.create(r, t.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof Y ? e : Y.of(e, this.doc.length, this.facet(N.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return D.of(e.split(this.facet(N.lineSeparator) || tn));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (Zt(this, t), es(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let s = e[i];
        s instanceof Ye && this.config.address[s.id] != null && (t[i] = s.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let s = [];
    if (i) {
      for (let r in i)
        if (Object.prototype.hasOwnProperty.call(e, r)) {
          let o = i[r], l = e[r];
          s.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return N.create({
      doc: e.doc,
      selection: v.fromJSON(e.selection),
      extensions: t.extensions ? s.concat([t.extensions]) : s
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = Ji.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof D ? e.doc : D.of((e.doc || "").split(t.staticFacet(N.lineSeparator) || tn)), s = e.selection ? e.selection instanceof v ? e.selection : v.single(e.selection.anchor, e.selection.head) : v.single(0);
    return ul(s, i.length), t.staticFacet(ln) || (s = s.asSingle()), new N(t, i, s, t.dynamicSlots.map(() => null), (r, o) => o.create(r), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(N.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(N.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(bl);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet(N.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, s) => {
      if (s == "$")
        return "$";
      let r = +(s || 1);
      return !r || r > t.length ? i : t[r - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let s = [];
    for (let r of this.facet(pl))
      for (let o of r(this, t, i))
        Object.prototype.hasOwnProperty.call(o, e) && s.push(o[e]);
    return s;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    let t = this.languageDataAt("wordChars", e);
    return Jf(t.length ? t[0] : "");
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: s } = this.doc.lineAt(e), r = this.charCategorizer(e), o = e - i, l = e - i;
    for (; o > 0; ) {
      let a = we(t, o, !1);
      if (r(t.slice(a, o)) != je.Word)
        break;
      o = a;
    }
    for (; l < s; ) {
      let a = we(t, l);
      if (r(t.slice(l, a)) != je.Word)
        break;
      l = a;
    }
    return o == l ? null : v.range(o + i, l + i);
  }
}
N.allowMultipleSelections = ln;
N.tabSize = /* @__PURE__ */ P.define({
  combine: (n) => n.length ? n[0] : 4
});
N.lineSeparator = gl;
N.readOnly = bl;
N.phrases = /* @__PURE__ */ P.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((s) => n[s] == e[s]);
  }
});
N.languageData = pl;
N.changeFilter = ml;
N.transactionFilter = Ol;
N.transactionExtender = yl;
ps.reconfigure = /* @__PURE__ */ j.define();
function gs(n, e, t = {}) {
  let i = {};
  for (let s of n)
    for (let r of Object.keys(s)) {
      let o = s[r], l = i[r];
      if (l === void 0)
        i[r] = o;
      else if (!(l === o || o === void 0)) if (Object.hasOwnProperty.call(t, r))
        i[r] = t[r](l, o);
      else
        throw new Error("Config merge conflict for field " + r);
    }
  for (let s in e)
    i[s] === void 0 && (i[s] = e[s]);
  return i;
}
class nt {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return ni.create(e, t, this);
  }
}
nt.prototype.startSide = nt.prototype.endSide = 0;
nt.prototype.point = !1;
nt.prototype.mapMode = le.TrackDel;
function Fn(n, e) {
  return n == e || n.constructor == e.constructor && n.eq(e);
}
class ni {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new ni(e, t, i);
  }
}
function fn(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class jn {
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = s;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, s = 0) {
    let r = i ? this.to : this.from;
    for (let o = s, l = r.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = r[a] - e || (i ? this.value[a].endSide : this.value[a].startSide) - t;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(e, t, i, s) {
    for (let r = this.findIndex(t, -1e9, !0), o = this.findIndex(i, 1e9, !1, r); r < o; r++)
      if (s(this.from[r] + e, this.to[r] + e, this.value[r]) === !1)
        return !1;
  }
  map(e, t) {
    let i = [], s = [], r = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], f = this.from[a] + e, c = this.to[a] + e, u, d;
      if (f == c) {
        let p = t.mapPos(f, h.startSide, h.mapMode);
        if (p == null || (u = d = p, h.startSide != h.endSide && (d = t.mapPos(f, h.endSide), d < u)))
          continue;
      } else if (u = t.mapPos(f, h.startSide), d = t.mapPos(c, h.endSide), u > d || u == d && h.startSide > 0 && h.endSide <= 0)
        continue;
      (d - u || h.endSide - h.startSide) < 0 || (o < 0 && (o = u), h.point && (l = Math.max(l, d - u)), i.push(h), s.push(u - o), r.push(d - o));
    }
    return { mapped: i.length ? new jn(s, r, i, l) : null, pos: o };
  }
}
class $ {
  constructor(e, t, i, s) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = s;
  }
  /**
  @internal
  */
  static create(e, t, i, s) {
    return new $(e, t, i, s);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: s = 0, filterTo: r = this.length } = e, o = e.filter;
    if (t.length == 0 && !o)
      return this;
    if (i && (t = t.slice().sort(fn)), this.isEmpty)
      return t.length ? $.of(t) : this;
    let l = new wl(this, null, -1).goto(0), a = 0, h = [], f = new $t();
    for (; l.value || a < t.length; )
      if (a < t.length && (l.from - t[a].from || l.startSide - t[a].value.startSide) >= 0) {
        let c = t[a++];
        f.addInner(c.from, c.to, c.value) || h.push(c);
      } else l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == t.length || this.chunkEnd(l.chunkIndex) < t[a].from) && (!o || s > this.chunkEnd(l.chunkIndex) || r < this.chunkPos[l.chunkIndex]) && f.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || s > l.to || r < l.from || o(l.from, l.to, l.value)) && (f.addInner(l.from, l.to, l.value) || h.push(ni.create(l.from, l.to, l.value))), l.next());
    return f.finishInner(this.nextLayer.isEmpty && !h.length ? $.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: s, filterTo: r }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], s = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = e.touchesRange(l, l + a.length);
      if (h === !1)
        s = Math.max(s, a.maxPoint), t.push(a), i.push(e.mapPos(l));
      else if (h === !0) {
        let { mapped: f, pos: c } = a.map(l, e);
        f && (s = Math.max(s, f.maxPoint), t.push(f), i.push(c));
      }
    }
    let r = this.nextLayer.map(e);
    return t.length == 0 ? r : new $(i, t, r || $.empty, s);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let s = 0; s < this.chunk.length; s++) {
        let r = this.chunkPos[s], o = this.chunk[s];
        if (t >= r && e <= r + o.length && o.between(r, e - r, t - r, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return ri.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return ri.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, s, r = -1) {
    let o = e.filter((c) => c.maxPoint > 0 || !c.isEmpty && c.maxPoint >= r), l = t.filter((c) => c.maxPoint > 0 || !c.isEmpty && c.maxPoint >= r), a = Dr(o, l, i), h = new Xt(o, a, r), f = new Xt(l, a, r);
    i.iterGaps((c, u, d) => zr(h, c, f, u, d, s)), i.empty && i.length == 0 && zr(h, 0, f, 0, 0, s);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, s) {
    s == null && (s = 999999999);
    let r = e.filter((f) => !f.isEmpty && t.indexOf(f) < 0), o = t.filter((f) => !f.isEmpty && e.indexOf(f) < 0);
    if (r.length != o.length)
      return !1;
    if (!r.length)
      return !0;
    let l = Dr(r, o), a = new Xt(r, l, 0).goto(i), h = new Xt(o, l, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !cn(a.active, h.active) || a.point && (!h.point || !Fn(a.point, h.point)))
        return !1;
      if (a.to > s)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, s, r = -1) {
    let o = new Xt(e, null, r).goto(t), l = t, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let f = o.activeForPoint(o.to), c = o.pointFrom < t ? f.length + 1 : o.point.startSide < 0 ? f.length : Math.min(f.length, a);
        s.point(l, h, o.point, f, c, o.pointRank), a = Math.min(o.openEnd(h), f.length);
      } else h > l && (s.span(l, h, o.active, a), a = o.openEnd(h));
      if (o.to > i)
        return a + (o.point && o.to > i ? 1 : 0);
      l = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new $t();
    for (let s of e instanceof ni ? [e] : t ? ec(e) : e)
      i.add(s.from, s.to, s.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return $.empty;
    let t = e[e.length - 1];
    for (let i = e.length - 2; i >= 0; i--)
      for (let s = e[i]; s != $.empty; s = s.nextLayer)
        t = new $(s.chunkPos, s.chunk, t, Math.max(s.maxPoint, t.maxPoint));
    return t;
  }
}
$.empty = /* @__PURE__ */ new $([], [], null, -1);
function ec(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (fn(e, i) > 0)
        return n.slice().sort(fn);
      e = i;
    }
  return n;
}
$.empty.nextLayer = $.empty;
class $t {
  finishChunk(e) {
    this.chunks.push(new jn(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addInner(e, t, i) || (this.nextLayer || (this.nextLayer = new $t())).add(e, t, i);
  }
  /**
  @internal
  */
  addInner(e, t, i) {
    let s = e - this.lastTo || i.startSide - this.last.endSide;
    if (s <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return s < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner($.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = $.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function Dr(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let r of n)
    for (let o = 0; o < r.chunk.length; o++)
      r.chunk[o].maxPoint <= 0 && i.set(r.chunk[o], r.chunkPos[o]);
  let s = /* @__PURE__ */ new Set();
  for (let r of e)
    for (let o = 0; o < r.chunk.length; o++) {
      let l = i.get(r.chunk[o]);
      l != null && (t ? t.mapPos(l) : l) == r.chunkPos[o] && !(t != null && t.touchesRange(l, l + r.chunk[o].length)) && s.add(r.chunk[o]);
    }
  return s;
}
class wl {
  constructor(e, t, i, s = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = s;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let s = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(s) || this.layer.chunkEnd(this.chunkIndex) < e || s.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let s = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < s) && this.setRangeIndex(s);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class ri {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let s = [];
    for (let r = 0; r < e.length; r++)
      for (let o = e[r]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && s.push(new wl(o, t, i, r));
    return s.length == 1 ? s[0] : new ri(s);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Cs(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Cs(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), Cs(this.heap, 0);
    }
  }
}
function Cs(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let s = n[i];
    if (i + 1 < n.length && s.compare(n[i + 1]) >= 0 && (s = n[i + 1], i++), t.compare(s) < 0)
      break;
    n[i] = t, n[e] = s, e = i;
  }
}
class Xt {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = ri.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    wi(this.active, e), wi(this.activeTo, e), wi(this.activeRank, e), this.minActive = Br(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: s, rank: r } = this.cursor;
    for (; t < this.activeRank.length && (r - this.activeRank[t] || s - this.activeTo[t]) > 0; )
      t++;
    ki(this.active, t, i), ki(this.activeTo, t, s), ki(this.activeRank, t, r), e && ki(e, t, this.cursor.from), this.minActive = Br(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let s = this.minActive;
      if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[s] > e) {
          this.to = this.activeTo[s], this.endSide = this.active[s].endSide;
          break;
        }
        this.removeActive(s), i && wi(i, s);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let r = this.cursor.value;
          if (!r.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = r, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = r.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let s = i.length - 1; s >= 0 && i[s] < e; s--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function zr(n, e, t, i, s, r) {
  n.goto(e), t.goto(i);
  let o = i + s, l = i, a = i - e, h = !!r.boundChange;
  for (let f = !1; ; ) {
    let c = n.to + a - t.to, u = c || n.endSide - t.endSide, d = u < 0 ? n.to + a : t.to, p = Math.min(d, o);
    if (n.point || t.point ? (n.point && t.point && Fn(n.point, t.point) && cn(n.activeForPoint(n.to), t.activeForPoint(t.to)) || r.comparePoint(l, p, n.point, t.point), f = !1) : (f && r.boundChange(l), p > l && !cn(n.active, t.active) && r.compareRange(l, p, n.active, t.active), h && p < o && (c || n.openEnd(d) != t.openEnd(d)) && (f = !0)), d > o)
      break;
    l = d, u <= 0 && n.next(), u >= 0 && t.next();
  }
}
function cn(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !Fn(n[t], e[t]))
      return !1;
  return !0;
}
function wi(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function ki(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function Br(n, e) {
  let t = -1, i = 1e9;
  for (let s = 0; s < e.length; s++)
    (e[s] - i || n[s].endSide - n[t].endSide) < 0 && (t = s, i = e[s]);
  return t;
}
function kl(n, e, t = n.length) {
  let i = 0;
  for (let s = 0; s < t && s < n.length; )
    n.charCodeAt(s) == 9 ? (i += e - i % e, s++) : (i++, s = we(n, s));
  return i;
}
function tc(n, e, t, i) {
  for (let s = 0, r = 0; ; ) {
    if (r >= e)
      return s;
    if (s == n.length)
      break;
    r += n.charCodeAt(s) == 9 ? t - r % t : 1, s = we(n, s);
  }
  return n.length;
}
const un = "ͼ", Ir = typeof Symbol > "u" ? "__" + un : Symbol.for(un), dn = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), Nr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class rt {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function s(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function r(o, l, a, h) {
      let f = [], c = /^@(\w+)\b/.exec(o[0]), u = c && c[1] == "keyframes";
      if (c && l == null) return a.push(o[0] + ";");
      for (let d in l) {
        let p = l[d];
        if (/&/.test(d))
          r(
            d.split(/,\s*/).map((g) => o.map((m) => g.replace(/&/, m))).reduce((g, m) => g.concat(m)),
            p,
            a
          );
        else if (p && typeof p == "object") {
          if (!c) throw new RangeError("The value of a property (" + d + ") should be a primitive value.");
          r(s(d), p, f, u);
        } else p != null && f.push(d.replace(/_.*/, "").replace(/[A-Z]/g, (g) => "-" + g.toLowerCase()) + ": " + p + ";");
      }
      (f.length || u) && a.push((i && !c && !h ? o.map(i) : o).join(", ") + " {" + f.join(" ") + "}");
    }
    for (let o in e) r(s(o), e[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = Nr[Ir] || 1;
    return Nr[Ir] = e + 1, un + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let s = e[dn], r = i && i.nonce;
    s ? r && s.setNonce(r) : s = new ic(e, r), s.mount(Array.isArray(t) ? t : [t], e);
  }
}
let Lr = /* @__PURE__ */ new Map();
class ic {
  constructor(e, t) {
    let i = e.ownerDocument || e, s = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && s.CSSStyleSheet) {
      let r = Lr.get(i);
      if (r) return e[dn] = r;
      this.sheet = new s.CSSStyleSheet(), Lr.set(i, this);
    } else
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
    this.modules = [], e[dn] = this;
  }
  mount(e, t) {
    let i = this.sheet, s = 0, r = 0;
    for (let o = 0; o < e.length; o++) {
      let l = e[o], a = this.modules.indexOf(l);
      if (a < r && a > -1 && (this.modules.splice(a, 1), r--, a = -1), a == -1) {
        if (this.modules.splice(r++, 0, l), i) for (let h = 0; h < l.rules.length; h++)
          i.insertRule(l.rules[h], s++);
      } else {
        for (; r < a; ) s += this.modules[r++].rules.length;
        s += l.rules.length, r++;
      }
    }
    if (i)
      t.adoptedStyleSheets.indexOf(this.sheet) < 0 && (t.adoptedStyleSheets = [this.sheet, ...t.adoptedStyleSheets]);
    else {
      let o = "";
      for (let a = 0; a < this.modules.length; a++)
        o += this.modules[a].getRules() + `
`;
      this.styleTag.textContent = o;
      let l = t.head || t;
      this.styleTag.parentNode != l && l.insertBefore(this.styleTag, l.firstChild);
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var ot = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
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
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, oi = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, sc = typeof navigator < "u" && /Mac/.test(navigator.platform), nc = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var ee = 0; ee < 10; ee++) ot[48 + ee] = ot[96 + ee] = String(ee);
for (var ee = 1; ee <= 24; ee++) ot[ee + 111] = "F" + ee;
for (var ee = 65; ee <= 90; ee++)
  ot[ee] = String.fromCharCode(ee + 32), oi[ee] = String.fromCharCode(ee);
for (var As in ot) oi.hasOwnProperty(As) || (oi[As] = ot[As]);
function rc(n) {
  var e = sc && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || nc && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? oi : ot)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function wt() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i)) {
      var s = t[i];
      typeof s == "string" ? n.setAttribute(i, s) : s != null && (n[i] = s);
    }
    e++;
  }
  for (; e < arguments.length; e++) vl(n, arguments[e]);
  return n;
}
function vl(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null) if (e.nodeType != null)
    n.appendChild(e);
  else if (Array.isArray(e))
    for (var t = 0; t < e.length; t++) vl(n, e[t]);
  else
    throw new RangeError("Unsupported child node: " + e);
}
let oe = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, pn = typeof document < "u" ? document : { documentElement: { style: {} } };
const gn = /* @__PURE__ */ /Edge\/(\d+)/.exec(oe.userAgent), Tl = /* @__PURE__ */ /MSIE \d/.test(oe.userAgent), mn = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(oe.userAgent), ms = !!(Tl || mn || gn), Vr = !ms && /* @__PURE__ */ /gecko\/(\d+)/i.test(oe.userAgent), Rs = !ms && /* @__PURE__ */ /Chrome\/(\d+)/.exec(oe.userAgent), _r = "webkitFontSmoothing" in pn.documentElement.style, On = !ms && /* @__PURE__ */ /Apple Computer/.test(oe.vendor), Xr = On && (/* @__PURE__ */ /Mobile\/\w+/.test(oe.userAgent) || oe.maxTouchPoints > 2);
var w = {
  mac: Xr || /* @__PURE__ */ /Mac/.test(oe.platform),
  windows: /* @__PURE__ */ /Win/.test(oe.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(oe.platform),
  ie: ms,
  ie_version: Tl ? pn.documentMode || 6 : mn ? +mn[1] : gn ? +gn[1] : 0,
  gecko: Vr,
  gecko_version: Vr ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(oe.userAgent) || [0, 0])[1] : 0,
  chrome: !!Rs,
  chrome_version: Rs ? +Rs[1] : 0,
  ios: Xr,
  android: /* @__PURE__ */ /Android\b/.test(oe.userAgent),
  webkit: _r,
  webkit_version: _r ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(oe.userAgent) || [0, 0])[1] : 0,
  safari: On,
  safari_version: On ? +(/* @__PURE__ */ /\bVersion\/(\d+(\.\d+)?)/.exec(oe.userAgent) || [0, 0])[1] : 0,
  tabSize: pn.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
function Un(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const ts = /* @__PURE__ */ Object.create(null);
function Hn(n, e, t) {
  if (n == e)
    return !0;
  n || (n = ts), e || (e = ts);
  let i = Object.keys(n), s = Object.keys(e);
  if (i.length - 0 != s.length - 0)
    return !1;
  for (let r of i)
    if (r != t && (s.indexOf(r) == -1 || n[r] !== e[r]))
      return !1;
  return !0;
}
function oc(n, e) {
  for (let t = n.attributes.length - 1; t >= 0; t--) {
    let i = n.attributes[t].name;
    e[i] == null && n.removeAttribute(i);
  }
  for (let t in e) {
    let i = e[t];
    t == "style" ? n.style.cssText = i : n.getAttribute(t) != i && n.setAttribute(t, i);
  }
}
function Fr(n, e, t) {
  let i = !1;
  if (e)
    for (let s in e)
      t && s in t || (i = !0, s == "style" ? n.style.cssText = "" : n.removeAttribute(s));
  if (t)
    for (let s in t)
      e && e[s] == t[s] || (i = !0, s == "style" ? n.style.cssText = t[s] : n.setAttribute(s, t[s]));
  return i;
}
function lc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class St {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t, i) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var ie = /* @__PURE__ */ (function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
})(ie || (ie = {}));
class B extends nt {
  constructor(e, t, i, s) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = s;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new ui(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new mt(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, s;
    if (e.isBlockGap)
      i = -5e8, s = 4e8;
    else {
      let { start: r, end: o } = Ql(e, t);
      i = (r ? t ? -3e8 : -1 : 5e8) - 1, s = (o ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new mt(e, i, s, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new di(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return $.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
B.none = $.empty;
class ui extends B {
  constructor(e) {
    let { start: t, end: i } = Ql(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.attrs = e.class && e.attributes ? Un(e.attributes, { class: e.class }) : e.class ? { class: e.class } : e.attributes || ts;
  }
  eq(e) {
    return this == e || e instanceof ui && this.tagName == e.tagName && Hn(this.attrs, e.attrs);
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
ui.prototype.point = !1;
class di extends B {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof di && this.spec.class == e.spec.class && Hn(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
di.prototype.mapMode = le.TrackBefore;
di.prototype.point = !0;
class mt extends B {
  constructor(e, t, i, s, r, o) {
    super(t, i, r, e), this.block = s, this.isReplace = o, this.mapMode = s ? t <= 0 ? le.TrackBefore : le.TrackAfter : le.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? ie.WidgetRange : this.startSide <= 0 ? ie.WidgetBefore : ie.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof mt && ac(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
mt.prototype.point = !0;
function Ql(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function ac(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function Rt(n, e, t, i = 0) {
  let s = t.length - 1;
  s >= 0 && t[s] + i >= n ? t[s] = Math.max(t[s], e) : t.push(n, e);
}
class li extends nt {
  constructor(e, t, i) {
    super(), this.tagName = e, this.attributes = t, this.rank = i;
  }
  eq(e) {
    return e == this || e instanceof li && this.tagName == e.tagName && Hn(this.attributes, e.attributes);
  }
  /**
  Create a block wrapper object with the given tag name and
  attributes.
  */
  static create(e) {
    return new li(e.tagName, e.attributes || ts, e.rank == null ? 50 : Math.max(0, Math.min(e.rank, 100)));
  }
  /**
  Create a range set from the given block wrapper ranges.
  */
  static set(e, t = !1) {
    return $.of(e, t);
  }
}
li.prototype.startSide = li.prototype.endSide = -1;
function ai(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function yn(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function Yt(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return yn(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function Li(n) {
  return n.nodeType == 3 ? hi(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function Kt(n, e, t, i) {
  return t ? jr(n, e, t, i, -1) || jr(n, e, t, i, 1) : !1;
}
function lt(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function is(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
function jr(n, e, t, i, s) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (s < 0 ? 0 : Ze(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let r = n.parentNode;
      if (!r || r.nodeType != 1)
        return !1;
      e = lt(n) + (s < 0 ? 0 : 1), n = r;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (s < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      e = s < 0 ? Ze(n) : 0;
    } else
      return !1;
  }
}
function Ze(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function ss(n, e) {
  let { left: t, right: i } = n;
  if (t == i)
    return n;
  let s = e ? t : i;
  return { left: s, right: s, top: n.top, bottom: n.bottom };
}
function hc(n) {
  let e = n.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function Pl(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function fc(n, e, t, i, s, r, o, l) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let f = n, c = !1; f && !c; )
    if (f.nodeType == 1) {
      let u, d = f == a.body, p = 1, g = 1;
      if (d)
        u = hc(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(f).position) && (c = !0), f.scrollHeight <= f.clientHeight && f.scrollWidth <= f.clientWidth) {
          f = f.assignedSlot || f.parentNode;
          continue;
        }
        let b = f.getBoundingClientRect();
        ({ scaleX: p, scaleY: g } = Pl(f, b)), u = {
          left: b.left,
          right: b.left + f.clientWidth * p,
          top: b.top,
          bottom: b.top + f.clientHeight * g
        };
      }
      let m = 0, O = 0;
      if (s == "nearest")
        e.top < u.top + o ? (O = e.top - (u.top + o), t > 0 && e.bottom > u.bottom + O && (O = e.bottom - u.bottom + o)) : e.bottom > u.bottom - o && (O = e.bottom - u.bottom + o, t < 0 && e.top - O < u.top && (O = e.top - (u.top + o)));
      else {
        let b = e.bottom - e.top, Q = u.bottom - u.top;
        O = (s == "center" && b <= Q ? e.top + b / 2 - Q / 2 : s == "start" || s == "center" && t < 0 ? e.top - o : e.bottom - Q + o) - u.top;
      }
      if (i == "nearest" ? e.left < u.left + r ? (m = e.left - (u.left + r), t > 0 && e.right > u.right + m && (m = e.right - u.right + r)) : e.right > u.right - r && (m = e.right - u.right + r, t < 0 && e.left < u.left + m && (m = e.left - (u.left + r))) : m = (i == "center" ? e.left + (e.right - e.left) / 2 - (u.right - u.left) / 2 : i == "start" == l ? e.left - r : e.right - (u.right - u.left) + r) - u.left, m || O)
        if (d)
          h.scrollBy(m, O);
        else {
          let b = 0, Q = 0;
          if (O) {
            let R = f.scrollTop;
            f.scrollTop += O / g, Q = (f.scrollTop - R) * g;
          }
          if (m) {
            let R = f.scrollLeft;
            f.scrollLeft += m / p, b = (f.scrollLeft - R) * p;
          }
          e = {
            left: e.left - b,
            top: e.top - Q,
            right: e.right - b,
            bottom: e.bottom - Q
          }, b && Math.abs(b - m) < 1 && (i = "nearest"), Q && Math.abs(Q - O) < 1 && (s = "nearest");
        }
      if (d)
        break;
      (e.top < u.top || e.bottom > u.bottom || e.left < u.left || e.right > u.right) && (e = {
        left: Math.max(e.left, u.left),
        right: Math.min(e.right, u.right),
        top: Math.max(e.top, u.top),
        bottom: Math.min(e.bottom, u.bottom)
      }), f = f.assignedSlot || f.parentNode;
    } else if (f.nodeType == 11)
      f = f.host;
    else
      break;
}
function Cl(n, e = !0) {
  let t = n.ownerDocument, i = null, s = null;
  for (let r = n.parentNode; r && !(r == t.body || (!e || i) && s); )
    if (r.nodeType == 1)
      !s && r.scrollHeight > r.clientHeight && (s = r), e && !i && r.scrollWidth > r.clientWidth && (i = r), r = r.assignedSlot || r.parentNode;
    else if (r.nodeType == 11)
      r = r.host;
    else
      break;
  return { x: i, y: s };
}
class cc {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? Ze(t) : 0), i, Math.min(e.focusOffset, i ? Ze(i) : 0));
  }
  set(e, t, i, s) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = s;
  }
}
let ct = null;
w.safari && w.safari_version >= 26 && (ct = !1);
function Al(n) {
  if (n.setActive)
    return n.setActive();
  if (ct)
    return n.focus(ct);
  let e = [];
  for (let t = n; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (n.focus(ct == null ? {
    get preventScroll() {
      return ct = { preventScroll: !0 }, !0;
    }
  } : void 0), !ct) {
    ct = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++], s = e[t++], r = e[t++];
      i.scrollTop != s && (i.scrollTop = s), i.scrollLeft != r && (i.scrollLeft = r);
    }
  }
}
let Ur;
function hi(n, e, t = e) {
  let i = Ur || (Ur = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function qt(n, e, t, i) {
  let s = { key: e, code: e, keyCode: t, which: t, cancelable: !0 };
  i && ({ altKey: s.altKey, ctrlKey: s.ctrlKey, shiftKey: s.shiftKey, metaKey: s.metaKey } = i);
  let r = new KeyboardEvent("keydown", s);
  r.synthetic = !0, n.dispatchEvent(r);
  let o = new KeyboardEvent("keyup", s);
  return o.synthetic = !0, n.dispatchEvent(o), r.defaultPrevented || o.defaultPrevented;
}
function uc(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function dc(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, Ze(t)); ; )
    if (i) {
      if (t.nodeType != 1)
        return !1;
      let s = t.childNodes[i - 1];
      s.contentEditable == "false" ? i-- : (t = s, i = Ze(t));
    } else {
      if (t == n)
        return !0;
      i = lt(t), t = t.parentNode;
    }
}
function Rl(n) {
  return n instanceof Window ? n.pageYOffset > Math.max(0, n.document.documentElement.scrollHeight - n.innerHeight - 4) : n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
function ql(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i > 0)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i > 0) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i - 1], i = Ze(t);
    } else if (t.parentNode && !is(t))
      i = lt(t), t = t.parentNode;
    else
      return null;
  }
}
function El(n, e) {
  for (let t = n, i = e; ; ) {
    if (t.nodeType == 3 && i < t.nodeValue.length)
      return { node: t, offset: i };
    if (t.nodeType == 1 && i < t.childNodes.length) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[i], i = 0;
    } else if (t.parentNode && !is(t))
      i = lt(t) + 1, t = t.parentNode;
    else
      return null;
  }
}
class ke {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new ke(e.parentNode, lt(e), t);
  }
  static after(e, t) {
    return new ke(e.parentNode, lt(e) + 1, t);
  }
}
var H = /* @__PURE__ */ (function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
})(H || (H = {}));
const Ot = H.LTR, Gn = H.RTL;
function Ml(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const pc = /* @__PURE__ */ Ml("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), gc = /* @__PURE__ */ Ml("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), bn = /* @__PURE__ */ Object.create(null), Re = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  bn[e] = t, bn[t] = -e;
}
function $l(n) {
  return n <= 247 ? pc[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? gc[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const mc = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class We {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Gn : Ot;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, i, s) {
    let r = -1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      if (l.from <= t && l.to >= t) {
        if (l.level == i)
          return o;
        (r < 0 || (s != 0 ? s < 0 ? l.from < t : l.to > t : e[r].level > l.level)) && (r = o);
      }
    }
    if (r < 0)
      throw new RangeError("Index out of range");
    return r;
  }
}
function Wl(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], s = e[t];
    if (i.from != s.from || i.to != s.to || i.direction != s.direction || !Wl(i.inner, s.inner))
      return !1;
  }
  return !0;
}
const _ = [];
function Oc(n, e, t, i, s) {
  for (let r = 0; r <= i.length; r++) {
    let o = r ? i[r - 1].to : e, l = r < i.length ? i[r].from : t, a = r ? 256 : s;
    for (let h = o, f = a, c = a; h < l; h++) {
      let u = $l(n.charCodeAt(h));
      u == 512 ? u = f : u == 8 && c == 4 && (u = 16), _[h] = u == 4 ? 2 : u, u & 7 && (c = u), f = u;
    }
    for (let h = o, f = a, c = a; h < l; h++) {
      let u = _[h];
      if (u == 128)
        h < l - 1 && f == _[h + 1] && f & 24 ? u = _[h] = f : _[h] = 256;
      else if (u == 64) {
        let d = h + 1;
        for (; d < l && _[d] == 64; )
          d++;
        let p = h && f == 8 || d < t && _[d] == 8 ? c == 1 ? 1 : 8 : 256;
        for (let g = h; g < d; g++)
          _[g] = p;
        h = d - 1;
      } else u == 8 && c == 1 && (_[h] = 1);
      f = u, u & 7 && (c = u);
    }
  }
}
function yc(n, e, t, i, s) {
  let r = s == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : e, f = o < i.length ? i[o].from : t;
    for (let c = h, u, d, p; c < f; c++)
      if (d = bn[u = n.charCodeAt(c)])
        if (d < 0) {
          for (let g = l - 3; g >= 0; g -= 3)
            if (Re[g + 1] == -d) {
              let m = Re[g + 2], O = m & 2 ? s : m & 4 ? m & 1 ? r : s : 0;
              O && (_[c] = _[Re[g]] = O), l = g;
              break;
            }
        } else {
          if (Re.length == 189)
            break;
          Re[l++] = c, Re[l++] = u, Re[l++] = a;
        }
      else if ((p = _[c]) == 2 || p == 1) {
        let g = p == s;
        a = g ? 0 : 1;
        for (let m = l - 3; m >= 0; m -= 3) {
          let O = Re[m + 2];
          if (O & 2)
            break;
          if (g)
            Re[m + 2] |= 2;
          else {
            if (O & 4)
              break;
            Re[m + 2] |= 4;
          }
        }
      }
  }
}
function bc(n, e, t, i) {
  for (let s = 0, r = i; s <= t.length; s++) {
    let o = s ? t[s - 1].to : n, l = s < t.length ? t[s].from : e;
    for (let a = o; a < l; ) {
      let h = _[a];
      if (h == 256) {
        let f = a + 1;
        for (; ; )
          if (f == l) {
            if (s == t.length)
              break;
            f = t[s++].to, l = s < t.length ? t[s].from : e;
          } else if (_[f] == 256)
            f++;
          else
            break;
        let c = r == 1, u = (f < e ? _[f] : i) == 1, d = c == u ? c ? 1 : 2 : i;
        for (let p = f, g = s, m = g ? t[g - 1].to : n; p > a; )
          p == m && (p = t[--g].from, m = g ? t[g - 1].to : n), _[--p] = d;
        a = f;
      } else
        r = h, a++;
    }
  }
}
function Sn(n, e, t, i, s, r, o) {
  let l = i % 2 ? 2 : 1;
  if (i % 2 == s % 2)
    for (let a = e, h = 0; a < t; ) {
      let f = !0, c = !1;
      if (h == r.length || a < r[h].from) {
        let g = _[a];
        g != l && (f = !1, c = g == 16);
      }
      let u = !f && l == 1 ? [] : null, d = f ? i : i + 1, p = a;
      e: for (; ; )
        if (h < r.length && p == r[h].from) {
          if (c)
            break e;
          let g = r[h];
          if (!f)
            for (let m = g.to, O = h + 1; ; ) {
              if (m == t)
                break e;
              if (O < r.length && r[O].from == m)
                m = r[O++].to;
              else {
                if (_[m] == l)
                  break e;
                break;
              }
            }
          if (h++, u)
            u.push(g);
          else {
            g.from > a && o.push(new We(a, g.from, d));
            let m = g.direction == Ot != !(d % 2);
            xn(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.to;
          }
          p = g.to;
        } else {
          if (p == t || (f ? _[p] != l : _[p] == l))
            break;
          p++;
        }
      u ? Sn(n, a, p, i + 1, s, u, o) : a < p && o.push(new We(a, p, d)), a = p;
    }
  else
    for (let a = t, h = r.length; a > e; ) {
      let f = !0, c = !1;
      if (!h || a > r[h - 1].to) {
        let g = _[a - 1];
        g != l && (f = !1, c = g == 16);
      }
      let u = !f && l == 1 ? [] : null, d = f ? i : i + 1, p = a;
      e: for (; ; )
        if (h && p == r[h - 1].to) {
          if (c)
            break e;
          let g = r[--h];
          if (!f)
            for (let m = g.from, O = h; ; ) {
              if (m == e)
                break e;
              if (O && r[O - 1].to == m)
                m = r[--O].from;
              else {
                if (_[m - 1] == l)
                  break e;
                break;
              }
            }
          if (u)
            u.push(g);
          else {
            g.to < a && o.push(new We(g.to, a, d));
            let m = g.direction == Ot != !(d % 2);
            xn(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.from;
          }
          p = g.from;
        } else {
          if (p == e || (f ? _[p - 1] != l : _[p - 1] == l))
            break;
          p--;
        }
      u ? Sn(n, p, a, i + 1, s, u, o) : p < a && o.push(new We(p, a, d)), a = p;
    }
}
function xn(n, e, t, i, s, r, o) {
  let l = e % 2 ? 2 : 1;
  Oc(n, s, r, i, l), yc(n, s, r, i, l), bc(s, r, i, l), Sn(n, s, r, e, t, i, o);
}
function Sc(n, e, t) {
  if (!n)
    return [new We(0, 0, e == Gn ? 1 : 0)];
  if (e == Ot && !t.length && !mc.test(n))
    return Dl(n.length);
  if (t.length)
    for (; n.length > _.length; )
      _[_.length] = 256;
  let i = [], s = e == Ot ? 0 : 1;
  return xn(n, s, s, t, 0, n.length, i), i;
}
function Dl(n) {
  return [new We(0, n, 0)];
}
let zl = "";
function xc(n, e, t, i, s) {
  var r;
  let o = i.head - n.from, l = We.find(e, o, (r = i.bidiLevel) !== null && r !== void 0 ? r : -1, i.assoc), a = e[l], h = a.side(s, t);
  if (o == h) {
    let u = l += s ? 1 : -1;
    if (u < 0 || u >= e.length)
      return null;
    a = e[l = u], o = a.side(!s, t), h = a.side(s, t);
  }
  let f = we(n.text, o, a.forward(s, t));
  (f < a.from || f > a.to) && (f = h), zl = n.text.slice(Math.min(o, f), Math.max(o, f));
  let c = l == (s ? e.length - 1 : 0) ? null : e[l + (s ? 1 : -1)];
  return c && f == h && c.level + (s ? 0 : 1) < a.level ? v.cursor(c.side(!s, t) + n.from, c.forward(s, t) ? 1 : -1, c.level) : v.cursor(f + n.from, a.forward(s, t) ? -1 : 1, a.level);
}
function wc(n, e, t) {
  for (let i = e; i < t; i++) {
    let s = $l(n.charCodeAt(i));
    if (s == 1)
      return Ot;
    if (s == 2 || s == 4)
      return Gn;
  }
  return Ot;
}
const Bl = /* @__PURE__ */ P.define(), Il = /* @__PURE__ */ P.define(), Nl = /* @__PURE__ */ P.define(), Ll = /* @__PURE__ */ P.define(), wn = /* @__PURE__ */ P.define(), Vl = /* @__PURE__ */ P.define(), _l = /* @__PURE__ */ P.define(), Zn = /* @__PURE__ */ P.define(), Yn = /* @__PURE__ */ P.define(), Xl = /* @__PURE__ */ P.define({
  combine: (n) => n.some((e) => e)
}), Fl = /* @__PURE__ */ P.define({
  combine: (n) => n.some((e) => e)
}), jl = /* @__PURE__ */ P.define();
class Et {
  constructor(e, t, i, s, r, o = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = s, this.xMargin = r, this.isSnapshot = o;
  }
  map(e) {
    return e.empty ? this : new Et(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new Et(v.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const vi = /* @__PURE__ */ j.define({ map: (n, e) => n.map(e) }), Ul = /* @__PURE__ */ j.define();
function De(n, e, t) {
  let i = n.facet(Ll);
  i.length ? i[0](e) : window.onerror && window.onerror(String(e), t, void 0, void 0, e) || (t ? console.error(t + ":", e) : console.error(e));
}
const Fe = /* @__PURE__ */ P.define({ combine: (n) => n.length ? n[0] : !0 });
let kc = 0;
const vt = /* @__PURE__ */ P.define({
  combine(n) {
    return n.filter((e, t) => {
      for (let i = 0; i < t; i++)
        if (n[i].plugin == e.plugin)
          return !1;
      return !0;
    });
  }
});
class ge {
  constructor(e, t, i, s, r) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = s, this.baseExtensions = r(this), this.extension = this.baseExtensions.concat(vt.of({ plugin: this, arg: void 0 }));
  }
  /**
  Create an extension for this plugin with the given argument.
  */
  of(e) {
    return this.baseExtensions.concat(vt.of({ plugin: this, arg: e }));
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: s, provide: r, decorations: o } = t || {};
    return new ge(kc++, e, i, s, (l) => {
      let a = [];
      return o && a.push(Os.of((h) => {
        let f = h.plugin(l);
        return f ? o(f) : B.none;
      })), r && a.push(r(l)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return ge.define((i, s) => new e(i, s), t);
  }
}
class qs {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  get plugin() {
    return this.spec && this.spec.plugin;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (De(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.plugin.create(e, this.spec.arg);
      } catch (t) {
        De(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        De(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Hl = /* @__PURE__ */ P.define(), Kn = /* @__PURE__ */ P.define(), Os = /* @__PURE__ */ P.define(), Gl = /* @__PURE__ */ P.define(), Jn = /* @__PURE__ */ P.define(), pi = /* @__PURE__ */ P.define(), Zl = /* @__PURE__ */ P.define();
function Hr(n, e) {
  let t = n.state.facet(Zl);
  if (!t.length)
    return t;
  let i = t.map((r) => r instanceof Function ? r(n) : r), s = [];
  return $.spans(i, e.from, e.to, {
    point() {
    },
    span(r, o, l, a) {
      let h = r - e.from, f = o - e.from, c = s;
      for (let u = l.length - 1; u >= 0; u--, a--) {
        let d = l[u].spec.bidiIsolate, p;
        if (d == null && (d = wc(e.text, h, f)), a > 0 && c.length && (p = c[c.length - 1]).to == h && p.direction == d)
          p.to = f, c = p.inner;
        else {
          let g = { from: h, to: f, direction: d, inner: [] };
          c.push(g), c = g.inner;
        }
      }
    }
  }), s;
}
const Yl = /* @__PURE__ */ P.define();
function Kl(n) {
  let e = 0, t = 0, i = 0, s = 0;
  for (let r of n.state.facet(Yl)) {
    let o = r(n);
    o && (o.left != null && (e = Math.max(e, o.left)), o.right != null && (t = Math.max(t, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (s = Math.max(s, o.bottom)));
  }
  return { left: e, right: t, top: i, bottom: s };
}
const Ut = /* @__PURE__ */ P.define();
class Se {
  constructor(e, t, i, s) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = s;
  }
  join(e) {
    return new Se(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let s = e[t - 1];
      if (!(s.fromA > i.toA)) {
        if (s.toA < i.fromA)
          break;
        i = i.join(s), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  // Extend a set to cover all the content in `ranges`, which is a
  // flat array with each pair of numbers representing fromB/toB
  // positions. These pairs are generated in unchanged ranges, so the
  // offset between doc A and doc B is the same for their start and
  // end points.
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let s = 0, r = 0, o = 0; ; ) {
      let l = s < e.length ? e[s].fromB : 1e9, a = r < t.length ? t[r] : 1e9, h = Math.min(l, a);
      if (h == 1e9)
        break;
      let f = h + o, c = h, u = f;
      for (; ; )
        if (r < t.length && t[r] <= c) {
          let d = t[r + 1];
          r += 2, c = Math.max(c, d);
          for (let p = s; p < e.length && e[p].fromB <= c; p++)
            o = e[p].toA - e[p].toB;
          u = Math.max(u, d + o);
        } else if (s < e.length && e[s].fromB <= c) {
          let d = e[s++];
          c = Math.max(c, d.toB), u = Math.max(u, d.toA), o = d.toA - d.toB;
        } else
          break;
      i.push(new Se(f, u, h, c));
    }
    return i;
  }
}
class ns {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = Y.empty(this.startState.doc.length);
    for (let r of i)
      this.changes = this.changes.compose(r.changes);
    let s = [];
    this.changes.iterChangedRanges((r, o, l, a) => s.push(new Se(r, o, l, a))), this.changedRanges = s;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new ns(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Returns true when
  [`viewportChanged`](https://codemirror.net/6/docs/ref/#view.ViewUpdate.viewportChanged) is true
  and the viewport change is not just the result of mapping it in
  response to document changes.
  */
  get viewportMoved() {
    return (this.flags & 8) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 18) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
const vc = [];
class G {
  constructor(e, t, i = 0) {
    this.dom = e, this.length = t, this.flags = i, this.parent = null, e.cmTile = this;
  }
  get breakAfter() {
    return this.flags & 1;
  }
  get children() {
    return vc;
  }
  isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  isComposite() {
    return !1;
  }
  isLine() {
    return !1;
  }
  isText() {
    return !1;
  }
  isBlock() {
    return !1;
  }
  get domAttrs() {
    return null;
  }
  sync(e) {
    if (this.flags |= 2, this.flags & 4) {
      this.flags &= -5;
      let t = this.domAttrs;
      t && oc(this.dom, t);
    }
  }
  toString() {
    return this.constructor.name + (this.children.length ? `(${this.children})` : "") + (this.breakAfter ? "#" : "");
  }
  destroy() {
    this.parent = null;
  }
  setDOM(e) {
    this.dom = e, e.cmTile = this;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e, t = this.posAtStart) {
    let i = t;
    for (let s of this.children) {
      if (s == e)
        return i;
      i += s.length + s.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  covers(e) {
    return !0;
  }
  coordsIn(e, t, i) {
    return null;
  }
  domPosFor(e, t) {
    let i = lt(this.dom), s = this.length ? e > 0 : t > 0;
    return new ke(this.parent.dom, i + (s ? 1 : 0), e == 0 || e == this.length);
  }
  markDirty(e) {
    this.flags &= -3, e && (this.flags |= 4), this.parent && this.parent.flags & 2 && this.parent.markDirty(!1);
  }
  get overrideDOMText() {
    return null;
  }
  get root() {
    for (let e = this; e; e = e.parent)
      if (e instanceof bs)
        return e;
    return null;
  }
  static get(e) {
    return e.cmTile;
  }
}
class ys extends G {
  constructor(e) {
    super(e, 0), this._children = [];
  }
  isComposite() {
    return !0;
  }
  get children() {
    return this._children;
  }
  get lastChild() {
    return this.children.length ? this.children[this.children.length - 1] : null;
  }
  append(e) {
    this.children.push(e), e.parent = this;
  }
  sync(e) {
    if (this.flags & 2)
      return;
    super.sync(e);
    let t = this.dom, i = null, s, r = (e == null ? void 0 : e.node) == t ? e : null, o = 0;
    for (let l of this.children) {
      if (l.sync(e), o += l.length + l.breakAfter, s = i ? i.nextSibling : t.firstChild, r && s != l.dom && (r.written = !0), l.dom.parentNode == t)
        for (; s && s != l.dom; )
          s = Gr(s);
      else
        t.insertBefore(l.dom, s);
      i = l.dom;
    }
    for (s = i ? i.nextSibling : t.firstChild, r && s && (r.written = !0); s; )
      s = Gr(s);
    this.length = o;
  }
}
function Gr(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class bs extends ys {
  constructor(e, t) {
    super(t), this.view = e;
  }
  owns(e) {
    for (; e; e = e.parent)
      if (e == this)
        return !0;
    return !1;
  }
  isBlock() {
    return !0;
  }
  nearest(e) {
    for (; ; ) {
      if (!e)
        return null;
      let t = G.get(e);
      if (t && this.owns(t))
        return t;
      e = e.parentNode;
    }
  }
  blockTiles(e) {
    for (let t = [], i = this, s = 0, r = 0; ; )
      if (s == i.children.length) {
        if (!t.length)
          return;
        i = i.parent, i.breakAfter && r++, s = t.pop();
      } else {
        let o = i.children[s++];
        if (o instanceof Ge)
          t.push(s), i = o, s = 0;
        else {
          let l = r + o.length, a = e(o, r);
          if (a !== void 0)
            return a;
          r = l + o.breakAfter;
        }
      }
  }
  // Find the block at the given position. If side < -1, make sure to
  // stay before block widgets at that position, if side > 1, after
  // such widgets (used for selection drawing, which needs to be able
  // to get coordinates for positions that aren't valid cursor positions).
  resolveBlock(e, t) {
    let i, s = -1, r, o = -1;
    if (this.blockTiles((l, a) => {
      let h = a + l.length;
      if (e >= a && e <= h) {
        if (l.isWidget() && t >= -1 && t <= 1) {
          if (l.flags & 32)
            return !0;
          l.flags & 16 && (i = void 0);
        }
        (a < e || e == h && (t < -1 ? l.length : l.covers(1))) && (!i || !l.isWidget() && i.isWidget()) && (i = l, s = e - a), (h > e || e == a && (t > 1 ? l.length : l.covers(-1))) && (!r || !l.isWidget() && r.isWidget()) && (r = l, o = e - a);
      }
    }), !i && !r)
      throw new Error("No tile at position " + e);
    return i && t < 0 || !r ? { tile: i, offset: s } : { tile: r, offset: o };
  }
}
class Ge extends ys {
  constructor(e, t) {
    super(e), this.wrapper = t;
  }
  isBlock() {
    return !0;
  }
  covers(e) {
    return this.children.length ? e < 0 ? this.children[0].covers(-1) : this.lastChild.covers(1) : !1;
  }
  get domAttrs() {
    return this.wrapper.attributes;
  }
  static of(e, t) {
    let i = new Ge(t || document.createElement(e.tagName), e);
    return t || (i.flags |= 4), i;
  }
}
class Wt extends ys {
  constructor(e, t) {
    super(e), this.attrs = t;
  }
  isLine() {
    return !0;
  }
  static start(e, t, i) {
    let s = new Wt(t || document.createElement("div"), e);
    return (!t || !i) && (s.flags |= 4), s;
  }
  get domAttrs() {
    return this.attrs;
  }
  // Find the tile associated with a given position in this line.
  // Side -2/2 is handled specially, in that it allows the position
  // returned to be before (-2) or after (2) widgets that would always
  // be after/before a cursor position.
  resolveInline(e, t, i) {
    let s = null, r = -1, o = null, l = -1;
    function a(f, c) {
      for (let u = 0, d = 0; u < f.children.length && d <= c; u++) {
        let p = f.children[u], g = d + p.length;
        g >= c && (p.isComposite() ? a(p, c - d) : (!o || o.isHidden && (t > 0 && !(o.flags & 32) || i && Qc(o, p))) && (g > c || p.flags & 32 && t <= 1) ? (o = p, l = c - d) : (d < c || p.flags & 16 && !p.isHidden && t >= -1) && (s = p, r = c - d)), d = g;
      }
    }
    a(this, e);
    let h = (t < 0 ? s : o) || s || o;
    return h ? { tile: h, offset: h == s ? r : l } : null;
  }
  coordsIn(e, t, i) {
    let s = this.resolveInline(e, t, !0);
    return s ? s.tile.coordsIn(Math.max(0, s.offset), t, i) : Tc(this);
  }
  domIn(e, t) {
    let i = this.resolveInline(e, t);
    if (i) {
      let { tile: s, offset: r } = i;
      if (this.dom.contains(s.dom))
        return s.isText() ? new ke(s.dom, Math.min(s.dom.nodeValue.length, r)) : s.domPosFor(r, s.flags & 16 ? 1 : s.flags & 32 ? -1 : t);
      let o = i.tile.parent, l = !1;
      for (let a of o.children) {
        if (l)
          return new ke(a.dom, 0);
        a == i.tile && (l = !0);
      }
    }
    return new ke(this.dom, 0);
  }
}
function Tc(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = Li(e);
  return t[t.length - 1] || null;
}
function Qc(n, e) {
  let t = n.coordsIn(0, 1), i = e.coordsIn(0, 1);
  return t && i && i.top < t.bottom;
}
class ce extends ys {
  constructor(e, t) {
    super(e), this.mark = t;
  }
  get domAttrs() {
    return this.mark.attrs;
  }
  static of(e, t) {
    let i = new ce(t || document.createElement(e.tagName), e);
    return t || (i.flags |= 4), i;
  }
}
class dt extends G {
  constructor(e, t) {
    super(e, t.length), this.text = t;
  }
  sync(e) {
    this.flags & 2 || (super.sync(e), this.dom.nodeValue != this.text && (e && e.node == this.dom && (e.written = !0), this.dom.nodeValue = this.text));
  }
  isText() {
    return !0;
  }
  toString() {
    return JSON.stringify(this.text);
  }
  coordsIn(e, t, i) {
    let s = this.dom.nodeValue.length;
    e > s && (e = s);
    let r = e, o = e, l = 0;
    e == 0 && t < 0 || e == s && t >= 0 ? w.chrome || w.gecko || (e ? (r--, l = 1) : o < s && (o++, l = -1)) : t < 0 ? r-- : o < s && o++;
    let a = hi(this.dom, r, o).getClientRects();
    if (!a.length)
      return null;
    let h = a[(l ? l < 0 : t >= 0) ? 0 : a.length - 1];
    return w.safari && !l && h.width == 0 && (h = Array.prototype.find.call(a, (f) => f.width) || h), i == null ? h : ss(h, (l ? l > 0 : t < 0) == i);
  }
  static of(e, t) {
    let i = new dt(t || document.createTextNode(e), e);
    return t || (i.flags |= 2), i;
  }
}
class yt extends G {
  constructor(e, t, i, s) {
    super(e, t, s), this.widget = i;
  }
  isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  covers(e) {
    return this.flags & 48 ? !1 : (this.flags & (e < 0 ? 64 : 128)) > 0;
  }
  coordsIn(e, t) {
    return this.coordsInWidget(e, t, !1);
  }
  coordsInWidget(e, t, i) {
    let s = this.widget.coordsAt(this.dom, e, t);
    if (s)
      return s;
    if (i)
      return ss(this.dom.getBoundingClientRect(), this.length ? e == 0 : t <= 0);
    {
      let r = this.dom.getClientRects(), o = null;
      if (!r.length)
        return null;
      let l = this.flags & 16 ? !0 : this.flags & 32 ? !1 : e > 0;
      for (let a = l ? r.length - 1 : 0; o = r[a], !(e > 0 ? a == 0 : a == r.length - 1 || o.top < o.bottom); a += l ? -1 : 1)
        ;
      return ss(o, !l);
    }
  }
  get overrideDOMText() {
    if (!this.length)
      return D.empty;
    let { root: e } = this;
    if (!e)
      return D.empty;
    let t = this.posAtStart;
    return e.view.state.doc.slice(t, t + this.length);
  }
  destroy() {
    super.destroy(), this.widget.destroy(this.dom);
  }
  static of(e, t, i, s, r) {
    return r || (r = e.toDOM(t), e.editable || (r.contentEditable = "false")), new yt(r, i, e, s);
  }
}
class rs extends G {
  constructor(e) {
    let t = document.createElement("img");
    t.className = "cm-widgetBuffer", t.setAttribute("aria-hidden", "true"), super(t, 0, e);
  }
  get isHidden() {
    return !0;
  }
  get overrideDOMText() {
    return D.empty;
  }
  coordsIn(e, t, i) {
    let s = this.dom.getBoundingClientRect();
    return i == null ? s : ss(s, t > 0 == i);
  }
}
class Pc {
  constructor(e) {
    this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = e;
  }
  // Advance by the given distance. If side is -1, stop leaving or
  // entering tiles, or skipping zero-length tiles, once the distance
  // has been traversed. When side is 1, leave, enter, or skip
  // everything at the end position.
  advance(e, t, i) {
    let { tile: s, index: r, beforeBreak: o, parents: l } = this;
    for (; e || t > 0; )
      if (s.isComposite())
        if (o) {
          if (!e)
            break;
          i && i.break(), e--, o = !1;
        } else if (r == s.children.length) {
          if (!e && !l.length)
            break;
          i && i.leave(s), o = !!s.breakAfter, { tile: s, index: r } = l.pop(), r++;
        } else {
          let a = s.children[r], h = a.breakAfter;
          (t > 0 ? a.length <= e : a.length < e) && (!i || i.skip(a, 0, a.length) !== !1 || !a.isComposite) ? (o = !!h, r++, e -= a.length) : (l.push({ tile: s, index: r }), s = a, r = 0, i && a.isComposite() && i.enter(a));
        }
      else {
        let a = s.length;
        if (r < a && e) {
          let h = Math.min(e, a - r);
          i && i.skip(s, r, r + h), e -= h, r += h;
        }
        if (r == a)
          o = !!s.breakAfter, { tile: s, index: r } = l.pop(), r++;
        else if (!e)
          break;
      }
    return this.tile = s, this.index = r, this.beforeBreak = o, this;
  }
  get root() {
    return this.parents.length ? this.parents[0].tile : this.tile;
  }
}
class Cc {
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.wrapper = i, this.rank = s;
  }
}
class Ac {
  constructor(e, t, i) {
    this.cache = e, this.root = t, this.blockWrappers = i, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0;
  }
  addText(e, t, i, s) {
    var r;
    this.flushBuffer();
    let o = this.ensureMarks(t, i), l = o.lastChild;
    if (l && l.isText() && !(l.flags & 8) && l.length + e.length < 512) {
      this.cache.reused.set(
        l,
        2
        /* Reused.DOM */
      );
      let a = o.children[o.children.length - 1] = new dt(l.dom, l.text + e);
      a.parent = o;
    } else
      o.append(s || dt.of(e, (r = this.cache.find(dt)) === null || r === void 0 ? void 0 : r.dom));
    this.pos += e.length, this.afterWidget = null;
  }
  addComposition(e, t) {
    let i = this.curLine;
    i.dom != t.line.dom && (i.setDOM(this.cache.reused.has(t.line) ? Es(t.line.dom) : t.line.dom), this.cache.reused.set(
      t.line,
      2
      /* Reused.DOM */
    ));
    let s = i;
    for (let l = t.marks.length - 1; l >= 0; l--) {
      let a = t.marks[l], h = s.lastChild;
      if (h instanceof ce && h.mark.eq(a.mark))
        h.dom != a.dom && h.setDOM(Es(a.dom)), s = h;
      else {
        if (this.cache.reused.get(a)) {
          let c = G.get(a.dom);
          c && c.setDOM(Es(a.dom));
        }
        let f = ce.of(a.mark, a.dom);
        s.append(f), s = f;
      }
      this.cache.reused.set(
        a,
        2
        /* Reused.DOM */
      );
    }
    let r = G.get(e.text);
    r && this.cache.reused.set(
      r,
      2
      /* Reused.DOM */
    );
    let o = new dt(e.text, e.text.nodeValue);
    o.flags |= 8, this.pos = e.range.toB, s.append(o);
  }
  addInlineWidget(e, t, i) {
    let s = this.afterWidget && e.flags & 48 && (this.afterWidget.flags & 48) == (e.flags & 48);
    s || this.flushBuffer();
    let r = this.ensureMarks(t, i);
    !s && !(e.flags & 16) && r.append(this.getBuffer(1)), r.append(e), this.pos += e.length, this.afterWidget = e;
  }
  addMark(e, t, i) {
    this.flushBuffer(), this.ensureMarks(t, i).append(e), this.pos += e.length, this.afterWidget = null;
  }
  addBlockWidget(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  continueWidget(e) {
    let t = this.afterWidget || this.lastBlock;
    t.length += e, this.pos += e;
  }
  addLineStart(e, t) {
    var i;
    e || (e = Jl);
    let s = Wt.start(e, t || ((i = this.cache.find(Wt)) === null || i === void 0 ? void 0 : i.dom), !!t);
    this.getBlockPos().append(this.lastBlock = this.curLine = s);
  }
  addLine(e) {
    this.getBlockPos().append(e), this.pos += e.length, this.lastBlock = e, this.endLine();
  }
  addBreak() {
    this.lastBlock.flags |= 1, this.endLine(), this.pos++;
  }
  addLineStartIfNotCovered(e) {
    this.blockPosCovered() || this.addLineStart(e);
  }
  ensureLine(e) {
    this.curLine || this.addLineStart(e);
  }
  ensureMarks(e, t) {
    var i;
    let s = this.curLine;
    for (let r = e.length - 1; r >= 0; r--) {
      let o = e[r], l;
      if (t > 0 && (l = s.lastChild) && l instanceof ce && l.mark.eq(o))
        s = l, t--;
      else {
        let a = ce.of(o, (i = this.cache.find(ce, (h) => h.mark.eq(o))) === null || i === void 0 ? void 0 : i.dom);
        s.append(a), s = a, t = 0;
      }
    }
    return s;
  }
  endLine() {
    if (this.curLine) {
      this.flushBuffer();
      let e = this.curLine.lastChild;
      (!e || !Zr(this.curLine, !1) || e.dom.nodeName != "BR" && e.isWidget() && !(w.ios && Zr(this.curLine, !0))) && this.curLine.append(this.cache.findWidget(
        Ms,
        0,
        32
        /* TileFlag.After */
      ) || new yt(
        Ms.toDOM(),
        0,
        Ms,
        32
        /* TileFlag.After */
      )), this.curLine = this.afterWidget = null;
    }
  }
  updateBlockWrappers() {
    this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
    for (let e = this.wrappers.length - 1; e >= 0; e--)
      this.wrappers[e].to < this.pos && this.wrappers.splice(e, 1);
    for (let e = this.blockWrappers; e.value && e.from <= this.pos; e.next())
      if (e.to >= this.pos) {
        let t = e.rank * 102 + e.value.rank, i = new Cc(e.from, e.to, e.value, t), s = this.wrappers.length;
        for (; s > 0 && (this.wrappers[s - 1].rank - i.rank || this.wrappers[s - 1].to - i.to) < 0; )
          s--;
        this.wrappers.splice(s, 0, i);
      }
    this.wrapperPos = this.pos;
  }
  getBlockPos() {
    var e;
    this.updateBlockWrappers();
    let t = this.root;
    for (let i of this.wrappers) {
      let s = t.lastChild;
      if (i.from < this.pos && s instanceof Ge && s.wrapper.eq(i.wrapper))
        t = s;
      else {
        let r = Ge.of(i.wrapper, (e = this.cache.find(Ge, (o) => o.wrapper.eq(i.wrapper))) === null || e === void 0 ? void 0 : e.dom);
        t.append(r), t = r;
      }
    }
    return t;
  }
  blockPosCovered() {
    let e = this.lastBlock;
    return e != null && !e.breakAfter && (!e.isWidget() || (e.flags & 160) > 0);
  }
  getBuffer(e) {
    let t = 2 | (e < 0 ? 16 : 32), i = this.cache.find(
      rs,
      void 0,
      1
      /* Reused.Full */
    );
    return i && (i.flags = t), i || new rs(t);
  }
  flushBuffer() {
    this.afterWidget && !(this.afterWidget.flags & 32) && (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null);
  }
}
class Rc {
  constructor(e) {
    this.skipCount = 0, this.text = "", this.textOff = 0, this.cursor = e.iter();
  }
  skip(e) {
    this.textOff + e <= this.text.length ? this.textOff += e : (this.skipCount += e - (this.text.length - this.textOff), this.text = "", this.textOff = 0);
  }
  next(e) {
    if (this.textOff == this.text.length) {
      let { value: s, lineBreak: r, done: o } = this.cursor.next(this.skipCount);
      if (this.skipCount = 0, o)
        throw new Error("Ran out of text content when drawing inline views");
      this.text = s;
      let l = this.textOff = Math.min(e, s.length);
      return r ? null : s.slice(0, l);
    }
    let t = Math.min(this.text.length, this.textOff + e), i = this.text.slice(this.textOff, t);
    return this.textOff = t, i;
  }
}
const os = [yt, Wt, dt, ce, rs, Ge, bs];
for (let n = 0; n < os.length; n++)
  os[n].bucket = n;
class qc {
  constructor(e) {
    this.view = e, this.buckets = os.map(() => []), this.index = os.map(() => 0), this.reused = /* @__PURE__ */ new Map();
  }
  // Put a tile in the cache.
  add(e) {
    let t = e.constructor.bucket, i = this.buckets[t];
    i.length < 6 ? i.push(e) : i[
      this.index[t] = (this.index[t] + 1) % 6
      /* C.Bucket */
    ] = e;
  }
  find(e, t, i = 2) {
    let s = e.bucket, r = this.buckets[s], o = this.index[s];
    for (let l = 0; l < r.length; l++) {
      let a = (l + o) % r.length, h = r[a];
      if ((!t || t(h)) && !this.reused.has(h))
        return r.splice(a, 1), a < o && this.index[s]--, this.reused.set(h, i), h;
    }
    return null;
  }
  findWidget(e, t, i) {
    let s = this.buckets[0];
    if (s.length)
      for (let r = 0, o = 0; ; r++) {
        if (r == s.length) {
          if (o)
            return null;
          o = 1, r = 0;
        }
        let l = s[r];
        if (!this.reused.has(l) && (o == 0 ? l.widget.compare(e) : l.widget.constructor == e.constructor && e.updateDOM(l.dom, this.view, l.widget)))
          return s.splice(r, 1), r < this.index[0] && this.index[0]--, l.widget == e && l.length == t && (l.flags & 497) == i ? (this.reused.set(
            l,
            1
            /* Reused.Full */
          ), l) : (this.reused.set(
            l,
            2
            /* Reused.DOM */
          ), new yt(l.dom, t, e, l.flags & -498 | i));
      }
  }
  reuse(e) {
    return this.reused.set(
      e,
      1
      /* Reused.Full */
    ), e;
  }
  maybeReuse(e, t = 2) {
    if (!this.reused.has(e))
      return this.reused.set(e, t), e.dom;
  }
  clear() {
    for (let e = 0; e < this.buckets.length; e++)
      this.buckets[e].length = this.index[e] = 0;
  }
}
class Ec {
  constructor(e, t, i, s, r) {
    this.view = e, this.decorations = s, this.disallowBlockEffectsFor = r, this.openWidget = !1, this.openMarks = 0, this.cache = new qc(e), this.text = new Rc(e.state.doc), this.builder = new Ac(this.cache, new bs(e, e.contentDOM), $.iter(i)), this.cache.reused.set(
      t,
      2
      /* Reused.DOM */
    ), this.old = new Pc(t), this.reuseWalker = {
      skip: (o, l, a) => {
        if (this.cache.add(o), o.isComposite())
          return !1;
      },
      enter: (o) => this.cache.add(o),
      leave: () => {
      },
      break: () => {
      }
    };
  }
  run(e, t) {
    let i = t && this.getCompositionContext(t.text);
    for (let s = 0, r = 0, o = 0; ; ) {
      let l = o < e.length ? e[o++] : null, a = l ? l.fromA : this.old.root.length;
      if (a > s) {
        let h = a - s;
        this.preserve(h, !o, !l), s = a, r += h;
      }
      if (!l)
        break;
      t && l.fromA <= t.range.fromA && l.toA >= t.range.toA ? (this.forward(l.fromA, t.range.fromA, t.range.fromA < t.range.toA ? 1 : -1), this.emit(r, t.range.fromB), this.builder.flushBuffer(), this.cache.clear(), this.builder.addComposition(t, i), this.text.skip(t.range.toB - t.range.fromB), this.forward(t.range.fromA, l.toA), this.emit(t.range.toB, l.toB)) : (this.forward(l.fromA, l.toA), this.emit(r, l.toB)), r = l.toB, s = l.toA;
    }
    return this.builder.curLine && this.builder.endLine(), this.builder.root;
  }
  preserve(e, t, i) {
    let s = Wc(this.old), r = this.openMarks;
    this.old.advance(e, i ? 1 : -1, {
      skip: (o, l, a) => {
        if (o.isWidget())
          if (this.openWidget)
            this.builder.continueWidget(a - l);
          else {
            let h = a > 0 || l < o.length ? yt.of(o.widget, this.view, a - l, o.flags & 496, this.cache.maybeReuse(o)) : this.cache.reuse(o);
            h.flags & 256 ? (h.flags &= -2, this.builder.addBlockWidget(h)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(h, s, r), r = s.length);
          }
        else if (o.isText())
          this.builder.ensureLine(null), !l && a == o.length && !this.cache.reused.has(o) ? this.builder.addText(o.text, s, r, this.cache.reuse(o)) : (this.cache.add(o), this.builder.addText(o.text.slice(l, a), s, r)), r = s.length;
        else if (o.isLine())
          o.flags &= -2, this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), this.builder.addLine(o);
        else if (o instanceof rs)
          this.cache.add(o);
        else if (o instanceof ce)
          this.builder.ensureLine(null), this.builder.addMark(o, s, r), this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), r = s.length;
        else
          return !1;
        this.openWidget = !1;
      },
      enter: (o) => {
        o.isLine() ? this.builder.addLineStart(o.attrs, this.cache.maybeReuse(o)) : (this.cache.add(o), o instanceof ce && s.unshift(o.mark)), this.openWidget = !1;
      },
      leave: (o) => {
        o.isLine() ? s.length && (s.length = r = 0) : o instanceof ce && (s.shift(), r = Math.min(r, s.length));
      },
      break: () => {
        this.builder.addBreak(), this.openWidget = !1;
      }
    }), this.text.skip(e);
  }
  emit(e, t) {
    let i = null, s = this.builder, r = -1, o = $.spans(this.decorations, e, t, {
      point: (l, a, h, f, c, u) => {
        if (h instanceof mt) {
          if (this.disallowBlockEffectsFor[u]) {
            if (h.block)
              throw new RangeError("Block decorations may not be specified via plugins");
            if (a > this.view.state.doc.lineAt(l).to)
              throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
          }
          if (r = f.length, c > f.length)
            s.continueWidget(a - l);
          else {
            let d = h.widget || (h.block ? Dt.block : Dt.inline), p = Mc(h), g = this.cache.findWidget(d, a - l, p) || yt.of(d, this.view, a - l, p);
            h.block ? (h.startSide > 0 && s.addLineStartIfNotCovered(i), s.addBlockWidget(g)) : (s.ensureLine(i), s.addInlineWidget(g, f, c));
          }
          i = null;
        } else
          i = $c(i, h);
        a > l && this.text.skip(a - l);
      },
      span: (l, a, h, f) => {
        for (let c = l; c < a; ) {
          let u = this.text.next(Math.min(512, a - c));
          u == null ? (s.addLineStartIfNotCovered(i), s.addBreak(), c++) : (s.ensureLine(i), s.addText(u, h, c == l ? f : h.length), c += u.length), i = null;
        }
        r = h.length;
      }
    });
    r > -1 && (this.openWidget = o > r), this.openWidget || s.addLineStartIfNotCovered(i), this.openMarks = o;
  }
  forward(e, t, i = 1) {
    t - e <= 10 ? this.old.advance(t - e, i, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(t - e - 10, -1), this.old.advance(5, i, this.reuseWalker));
  }
  getCompositionContext(e) {
    let t = [], i = null;
    for (let s = e.parentNode; ; s = s.parentNode) {
      let r = G.get(s);
      if (s == this.view.contentDOM)
        break;
      r instanceof ce ? t.push(r) : r != null && r.isLine() ? i = r : r instanceof Ge || (s.nodeName == "DIV" && !i && s != this.view.contentDOM ? i = new Wt(s, Jl) : i || t.push(ce.of(new ui({ tagName: s.nodeName.toLowerCase(), attributes: lc(s) }), s)));
    }
    return { line: i, marks: t };
  }
}
function Zr(n, e) {
  let t = (i) => {
    for (let s of i.children)
      if ((e ? s.isText() : s.length) || t(s))
        return !0;
    return !1;
  };
  return t(n);
}
function Mc(n) {
  let e = n.isReplace ? (n.startSide < 0 ? 64 : 0) | (n.endSide > 0 ? 128 : 0) : n.startSide > 0 ? 32 : 16;
  return n.block && (e |= 256), e;
}
const Jl = { class: "cm-line" };
function $c(n, e) {
  let t = e.spec.attributes, i = e.spec.class;
  return !t && !i || (n || (n = { class: "cm-line" }), t && Un(t, n), i && (n.class += " " + i)), n;
}
function Wc(n) {
  let e = [];
  for (let t = n.parents.length; t > 1; t--) {
    let i = t == n.parents.length ? n.tile : n.parents[t].tile;
    i instanceof ce && e.push(i.mark);
  }
  return e;
}
function Es(n) {
  let e = G.get(n);
  return e && e.setDOM(n.cloneNode()), n;
}
class Dt extends St {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
Dt.inline = /* @__PURE__ */ new Dt("span");
Dt.block = /* @__PURE__ */ new Dt("div");
const Ms = /* @__PURE__ */ new class extends St {
  toDOM() {
    return document.createElement("br");
  }
  get isHidden() {
    return !0;
  }
  get editable() {
    return !0;
  }
}();
class Yr {
  constructor(e) {
    this.view = e, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = B.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new bs(e, e.contentDOM), this.updateInner([new Se(0, 0, 0, e.state.doc.length)], null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: f, toA: c }) => c < this.minWidthFrom || f > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(e);
    let s = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? s = this.domChanged.newSel.head : !Xc(e.changes, this.hasComposition) && !e.selectionSet && (s = e.state.selection.main.head));
    let r = s > -1 ? zc(this.view, e.changes, s) : null;
    if (this.domChanged = null, this.hasComposition) {
      let { from: f, to: c } = this.hasComposition;
      i = new Se(f, c, e.changes.mapPos(f, -1), e.changes.mapPos(c, 1)).addToSet(i.slice());
    }
    this.hasComposition = r ? { from: r.range.fromB, to: r.range.toB } : null, (w.ie || w.chrome) && !r && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, l = this.blockWrappers;
    this.updateDeco();
    let a = Nc(o, this.decorations, e.changes);
    a.length && (i = Se.extendWithRanges(i, a));
    let h = Vc(l, this.blockWrappers, e.changes);
    return h.length && (i = Se.extendWithRanges(i, h)), r && !i.some((f) => f.fromA <= r.range.fromA && f.toA >= r.range.toA) && (i = r.range.addToSet(i.slice())), this.tile.flags & 2 && i.length == 0 ? !1 : (this.updateInner(i, r), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t) {
    this.view.viewState.mustMeasureContent = !0;
    let { observer: i } = this.view;
    i.ignore(() => {
      if (t || e.length) {
        let o = this.tile, l = new Ec(this.view, o, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
        t && G.get(t.text) && l.cache.reused.set(
          G.get(t.text),
          2
          /* Reused.DOM */
        ), this.tile = l.run(e, t), kn(o, l.cache.reused);
      }
      this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let r = w.chrome || w.ios ? { node: i.selectionRange.focusNode, written: !1 } : void 0;
      this.tile.sync(r), r && (r.written || i.selectionRange.focusNode != r.node || !this.tile.dom.contains(r.node)) && (this.forceSelection = !0), this.tile.dom.style.height = "";
    });
    let s = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let r of this.tile.children)
        r.isWidget() && r.widget instanceof $s && s.push(r.dom);
    i.updateGaps(s);
  }
  updateEditContextFormatting(e) {
    this.editContextFormatting = this.editContextFormatting.map(e.changes);
    for (let t of e.transactions)
      for (let i of t.effects)
        i.is(Ul) && (this.editContextFormatting = i.value);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let { dom: i } = this.tile, s = this.view.root.activeElement, r = s == i, o = !r && !(this.view.state.facet(Fe) || i.tabIndex > -1) && Yt(i, this.view.observer.selectionRange) && !(s && i.contains(s));
    if (!(r || t || o))
      return;
    let l = this.forceSelection;
    this.forceSelection = !1;
    let a = this.view.state.selection.main, h, f;
    if (a.empty ? f = h = this.inlineDOMNearPos(a.anchor, a.assoc || 1) : (f = this.inlineDOMNearPos(a.head, a.head == a.from ? 1 : -1), h = this.inlineDOMNearPos(a.anchor, a.anchor == a.from ? 1 : -1)), w.gecko && a.empty && !this.hasComposition && Dc(h)) {
      let u = document.createTextNode("");
      this.view.observer.ignore(() => h.node.insertBefore(u, h.node.childNodes[h.offset] || null)), h = f = new ke(u, 0), l = !0;
    }
    let c = this.view.observer.selectionRange;
    (l || !c.focusNode || (!Kt(h.node, h.offset, c.anchorNode, c.anchorOffset) || !Kt(f.node, f.offset, c.focusNode, c.focusOffset)) && !this.suppressWidgetCursorChange(c, a)) && (this.view.observer.ignore(() => {
      w.android && w.chrome && i.contains(c.focusNode) && _c(c.focusNode, i) && (i.blur(), i.focus({ preventScroll: !0 }));
      let u = ai(this.view.root);
      if (u) if (a.empty) {
        if (w.gecko) {
          let d = Bc(h.node, h.offset);
          if (d && d != 3) {
            let p = (d == 1 ? ql : El)(h.node, h.offset);
            p && (h = new ke(p.node, p.offset));
          }
        }
        u.collapse(h.node, h.offset), a.bidiLevel != null && u.caretBidiLevel !== void 0 && (u.caretBidiLevel = a.bidiLevel);
      } else if (u.extend) {
        u.collapse(h.node, h.offset);
        try {
          u.extend(f.node, f.offset);
        } catch {
        }
      } else {
        let d = document.createRange();
        a.anchor > a.head && ([h, f] = [f, h]), d.setEnd(f.node, f.offset), d.setStart(h.node, h.offset), u.removeAllRanges(), u.addRange(d);
      }
      o && this.view.root.activeElement == i && (i.blur(), s && s.focus());
    }), this.view.observer.setSelectionRange(h, f)), this.impreciseAnchor = h.precise ? null : new ke(c.anchorNode, c.anchorOffset), this.impreciseHead = f.precise ? null : new ke(c.focusNode, c.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && Kt(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = ai(e.root), { anchorNode: s, anchorOffset: r } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let o = this.lineAt(t.head, t.assoc);
    if (!o)
      return;
    let l = o.posAtStart;
    if (t.head == l || t.head == l + o.length)
      return;
    let a = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let f = this.domAtPos(t.head + t.assoc, t.assoc);
    i.collapse(f.node, f.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let c = e.observer.selectionRange;
    e.docView.posFromDOM(c.anchorNode, c.anchorOffset) != t.from && i.collapse(s, r);
  }
  posFromDOM(e, t) {
    let i = this.tile.nearest(e);
    if (!i)
      return this.tile.dom.compareDocumentPosition(e) & 2 ? 0 : this.view.state.doc.length;
    let s = i.posAtStart;
    if (i.isComposite()) {
      let r;
      if (e == i.dom)
        r = i.dom.childNodes[t];
      else {
        let o = Ze(e) == 0 ? 0 : t == 0 ? -1 : 1;
        for (; ; ) {
          let l = e.parentNode;
          if (l == i.dom)
            break;
          o == 0 && l.firstChild != l.lastChild && (e == l.firstChild ? o = -1 : o = 1), e = l;
        }
        o < 0 ? r = e : r = e.nextSibling;
      }
      if (r == i.dom.firstChild)
        return s;
      for (; r && !G.get(r); )
        r = r.nextSibling;
      if (!r)
        return s + i.length;
      for (let o = 0, l = s; ; o++) {
        let a = i.children[o];
        if (a.dom == r)
          return l;
        l += a.length + a.breakAfter;
      }
    } else return i.isText() ? e == i.dom ? s + t : s + (t ? i.length : 0) : s;
  }
  domAtPos(e, t) {
    let { tile: i, offset: s } = this.tile.resolveBlock(e, t);
    return i.isWidget() ? i.domPosFor(s, t) : i.domIn(s, t);
  }
  inlineDOMNearPos(e, t) {
    let i, s = -1, r = !1, o, l = -1, a = !1;
    return this.tile.blockTiles((h, f) => {
      if (h.isWidget()) {
        if (h.flags & 32 && f >= e)
          return !0;
        h.flags & 16 && (r = !0);
      } else {
        let c = f + h.length;
        if (f <= e && (i = h, s = e - f, r = c < e), c >= e && !o && (o = h, l = e - f, a = f > e), f > e && o)
          return !0;
      }
    }), !i && !o ? this.domAtPos(e, t) : (r && o ? i = null : a && i && (o = null), i && t < 0 || !o ? i.domIn(s, t) : o.domIn(l, t));
  }
  // Get the coord of the element at the given side of the given
  // position. If rtl is given, flatten it using that text direction.
  coordsAt(e, t, i) {
    let { tile: s, offset: r } = this.tile.resolveBlock(e, t);
    return s.isWidget() ? s.widget instanceof $s ? null : s.coordsInWidget(r, t, !0) : s.coordsIn(r, t, i);
  }
  lineAt(e, t) {
    let { tile: i } = this.tile.resolveBlock(e, t);
    return i.isLine() ? i : null;
  }
  coordsForChar(e) {
    let { tile: t, offset: i } = this.tile.resolveBlock(e, 1);
    if (!t.isLine())
      return null;
    function s(r, o) {
      if (r.isComposite())
        for (let l of r.children) {
          if (l.length >= o) {
            let a = s(l, o);
            if (a)
              return a;
          }
          if (o -= l.length, o < 0)
            break;
        }
      else if (r.isText() && o < r.length) {
        let l = we(r.text, o);
        if (l == o)
          return null;
        let a = hi(r.dom, o, l).getClientRects();
        for (let h = 0; h < a.length; h++) {
          let f = a[h];
          if (h == a.length - 1 || f.top < f.bottom && f.left < f.right)
            return f;
        }
      }
      return null;
    }
    return s(t, i);
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: s } = e, r = this.view.contentDOM.clientWidth, o = r > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == H.LTR, h = 0, f = (c, u, d) => {
      for (let p = 0; p < c.children.length && !(u > s); p++) {
        let g = c.children[p], m = u + g.length, O = g.dom.getBoundingClientRect(), { height: b } = O;
        if (d && !p && (h += O.top - d.top), g instanceof Ge)
          m > i && f(g, u, O);
        else if (u >= i && (h > 0 && t.push(-h), t.push(b + h), h = 0, o)) {
          let Q = g.dom.lastChild, R = Q ? Li(Q) : [];
          if (R.length) {
            let k = R[R.length - 1], T = a ? k.right - O.left : O.right - k.left;
            T > l && (l = T, this.minWidth = r, this.minWidthFrom = u, this.minWidthTo = m);
          }
        }
        d && p == c.children.length - 1 && (h += d.bottom - O.bottom), u = m + g.breakAfter;
      }
    };
    return f(this.tile, 0, null), t;
  }
  textDirectionAt(e) {
    let { tile: t } = this.tile.resolveBlock(e, 1);
    return getComputedStyle(t.dom).direction == "rtl" ? H.RTL : H.LTR;
  }
  measureTextSize() {
    let e = this.tile.blockTiles((o) => {
      if (o.isLine() && o.children.length && o.length <= 20) {
        let l = 0, a;
        for (let h of o.children) {
          if (!h.isText() || /[^ -~]/.test(h.text))
            return;
          let f = Li(h.dom);
          if (f.length != 1)
            return;
          l += f[0].width, a = f[0].height;
        }
        if (l)
          return {
            lineHeight: o.dom.getBoundingClientRect().height,
            charWidth: l / o.length,
            textHeight: a
          };
      }
    });
    if (e)
      return e;
    let t = document.createElement("div"), i, s, r;
    return t.className = "cm-line", t.style.width = "99999px", t.style.position = "absolute", t.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.tile.dom.appendChild(t);
      let o = Li(t.firstChild)[0];
      i = t.getBoundingClientRect().height, s = o && o.width ? o.width / 27 : 7, r = o && o.height ? o.height : i, t.remove();
    }), { lineHeight: i, charWidth: s, textHeight: r };
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, s = 0; ; s++) {
      let r = s == t.viewports.length ? null : t.viewports[s], o = r ? r.from - 1 : this.view.state.doc.length;
      if (o > i) {
        let l = (t.lineBlockAt(o).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(B.replace({
          widget: new $s(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!r)
        break;
      i = r.to + 1;
    }
    return B.set(e);
  }
  updateDeco() {
    let e = 1, t = this.view.state.facet(Os).map((r) => (this.dynamicDecorationMap[e++] = typeof r == "function") ? r(this.view) : r), i = !1, s = this.view.state.facet(Jn).map((r, o) => {
      let l = typeof r == "function";
      return l && (i = !0), l ? r(this.view) : r;
    });
    for (s.length && (this.dynamicDecorationMap[e++] = i, t.push($.join(s))), this.decorations = [
      this.editContextFormatting,
      ...t,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; e < this.decorations.length; )
      this.dynamicDecorationMap[e++] = !1;
    this.blockWrappers = this.view.state.facet(Gl).map((r) => typeof r == "function" ? r(this.view) : r);
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    for (let h of this.view.state.facet(jl))
      try {
        if (h(this.view, e.range, e))
          return !0;
      } catch (f) {
        De(this.view.state, f, "scroll handler");
      }
    let { range: t } = e, i = this.coordsAt(t.head, t.assoc || (t.head > t.anchor ? -1 : 1)), s;
    if (!i)
      return;
    !t.empty && (s = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, s.left),
      top: Math.min(i.top, s.top),
      right: Math.max(i.right, s.right),
      bottom: Math.max(i.bottom, s.bottom)
    });
    let r = Kl(this.view), o = {
      left: i.left - r.left,
      top: i.top - r.top,
      right: i.right + r.right,
      bottom: i.bottom + r.bottom
    }, { offsetWidth: l, offsetHeight: a } = this.view.scrollDOM;
    if (fc(this.view.scrollDOM, o, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, l), -l), Math.max(Math.min(e.yMargin, a), -a), this.view.textDirection == H.LTR), window.visualViewport && window.innerHeight - window.visualViewport.height > 1 && (i.top > window.pageYOffset + window.visualViewport.offsetTop + window.visualViewport.height || i.bottom < window.pageYOffset + window.visualViewport.offsetTop)) {
      let h = this.view.docView.lineAt(t.head, 1);
      h && h.dom.scrollIntoView({ block: "nearest" });
    }
  }
  lineHasWidget(e) {
    let t = (i) => i.isWidget() || i.children.some(t);
    return t(this.tile.resolveBlock(e, 1).tile);
  }
  destroy() {
    kn(this.tile);
  }
}
function kn(n, e) {
  let t = e == null ? void 0 : e.get(n);
  if (t != 1) {
    t == null && n.destroy();
    for (let i of n.children)
      kn(i, e);
  }
}
function Dc(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
function ea(n, e) {
  let t = n.observer.selectionRange;
  if (!t.focusNode)
    return null;
  let i = ql(t.focusNode, t.focusOffset), s = El(t.focusNode, t.focusOffset), r = i || s;
  if (s && i && s.node != i.node) {
    let l = G.get(s.node);
    if (!l || l.isText() && l.text != s.node.nodeValue)
      r = s;
    else if (n.docView.lastCompositionAfterCursor) {
      let a = G.get(i.node);
      !a || a.isText() && a.text != i.node.nodeValue || (r = s);
    }
  }
  if (n.docView.lastCompositionAfterCursor = r != i, !r)
    return null;
  let o = e - r.offset;
  return { from: o, to: o + r.node.nodeValue.length, node: r.node };
}
function zc(n, e, t) {
  let i = ea(n, t);
  if (!i)
    return null;
  let { node: s, from: r, to: o } = i, l = s.nodeValue;
  if (/[\n\r]/.test(l) || n.state.doc.sliceString(i.from, i.to) != l)
    return null;
  let a = e.invertedDesc;
  return { range: new Se(a.mapPos(r), a.mapPos(o), r, o), text: s };
}
function Bc(n, e) {
  return n.nodeType != 1 ? 0 : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let Ic = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Rt(e, t, this.changes);
  }
  comparePoint(e, t) {
    Rt(e, t, this.changes);
  }
  boundChange(e) {
    Rt(e, e, this.changes);
  }
};
function Nc(n, e, t) {
  let i = new Ic();
  return $.compare(n, e, t, i), i.changes;
}
class Lc {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    Rt(e, t, this.changes);
  }
  comparePoint() {
  }
  boundChange(e) {
    Rt(e, e, this.changes);
  }
}
function Vc(n, e, t) {
  let i = new Lc();
  return $.compare(n, e, t, i), i.changes;
}
function _c(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function Xc(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, s) => {
    i < e.to && s > e.from && (t = !0);
  }), t;
}
class $s extends St {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
function Fc(n, e, t = 1) {
  let i = n.charCategorizer(e), s = n.doc.lineAt(e), r = e - s.from;
  if (s.length == 0)
    return v.cursor(e);
  r == 0 ? t = 1 : r == s.length && (t = -1);
  let o = r, l = r;
  t < 0 ? o = we(s.text, r, !1) : l = we(s.text, r);
  let a = i(s.text.slice(o, l));
  for (; o > 0; ) {
    let h = we(s.text, o, !1);
    if (i(s.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < s.length; ) {
    let h = we(s.text, l);
    if (i(s.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return v.undirectionalRange(o + s.from, l + s.from);
}
function jc(n, e, t, i, s) {
  let r = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let l = n.viewState.heightOracle.textHeight, a = Math.floor((s - t.top - (n.defaultLineHeight - l) * 0.5) / l);
    r += a * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(t.from, t.to);
  return t.from + tc(o, r, n.state.tabSize);
}
function vn(n, e, t) {
  let i = n.lineBlockAt(e);
  if (Array.isArray(i.type)) {
    let s;
    for (let r of i.type) {
      if (r.from > e)
        break;
      if (!(r.to < e)) {
        if (r.from < e && r.to > e)
          return r;
        (!s || r.type == ie.Text && (s.type != r.type || (t < 0 ? r.from < e : r.to > e))) && (s = r);
      }
    }
    return s || i;
  }
  return i;
}
function Uc(n, e, t, i) {
  let s = vn(n, e.head, e.assoc || -1), r = !i || s.type != ie.Text || !(n.lineWrapping || s.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > s.from ? e.head - 1 : e.head);
  if (r) {
    let o = n.dom.getBoundingClientRect(), l = n.textDirectionAt(s.from), a = n.posAtCoords({
      x: t == (l == H.LTR) ? o.right - 1 : o.left + 1,
      y: (r.top + r.bottom) / 2
    });
    if (a != null)
      return v.cursor(a, t ? -1 : 1);
  }
  return v.cursor(t ? s.to : s.from, t ? -1 : 1);
}
function Kr(n, e, t, i) {
  let s = n.state.doc.lineAt(e.head), r = n.bidiSpans(s), o = n.textDirectionAt(s.from);
  for (let l = e, a = null; ; ) {
    let h = xc(s, r, o, l, t), f = zl;
    if (!h) {
      if (s.number == (t ? n.state.doc.lines : 1))
        return l;
      f = `
`, s = n.state.doc.line(s.number + (t ? 1 : -1)), r = n.bidiSpans(s), h = n.visualLineSide(s, !t);
    }
    if (a) {
      if (!a(f))
        return l;
    } else {
      if (!i)
        return h;
      a = i(f);
    }
    l = h;
  }
}
function Hc(n, e, t) {
  let i = n.state.charCategorizer(e), s = i(t);
  return (r) => {
    let o = i(r);
    return s == je.Space && (s = o), s == o;
  };
}
function Gc(n, e, t, i) {
  let s = e.head, r = t ? 1 : -1;
  if (s == (t ? n.state.doc.length : 0))
    return v.cursor(s, e.assoc);
  let o = e.goalColumn, l, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(s, e.assoc || ((e.empty ? t : e.head == e.from) ? 1 : -1)), f = n.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = r < 0 ? h.top : h.bottom;
  else {
    let p = n.viewState.lineBlockAt(s);
    o == null && (o = Math.min(a.right - a.left, n.defaultCharacterWidth * (s - p.from))), l = (r < 0 ? p.top : p.bottom) + f;
  }
  let c = a.left + o, u = n.viewState.heightOracle.textHeight >> 1, d = i ?? u;
  for (let p = 0; ; p += u) {
    let g = l + (d + p) * r, m = Tn(n, { x: c, y: g }, !1, r);
    if (t ? g > a.bottom : g < a.top)
      return v.cursor(m.pos, m.assoc);
    let O = n.coordsAtPos(m.pos, m.assoc), b = O ? (O.top + O.bottom) / 2 : 0;
    if (!O || (t ? b > l : b < l))
      return v.cursor(m.pos, m.assoc, void 0, o);
  }
}
function Jt(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let s of n)
      s.between(e - 1, e + 1, (r, o, l) => {
        if (e > r && e < o) {
          let a = i || t || (e - r < o - e ? -1 : 1);
          e = a < 0 ? r : o, i = a;
        }
      });
    if (!i)
      return e;
  }
}
function ta(n, e) {
  let t = null;
  for (let i = 0; i < e.ranges.length; i++) {
    let s = e.ranges[i], r = null;
    if (s.empty) {
      let o = Jt(n, s.from, 0);
      o != s.from && (r = v.cursor(o, -1));
    } else {
      let o = Jt(n, s.from, -1), l = Jt(n, s.to, 1);
      (o != s.from || l != s.to) && (s.undirectional ? r = v.undirectionalRange(s.from, s.to) : r = v.range(s.from == s.anchor ? o : l, s.from == s.head ? o : l));
    }
    r && (t || (t = e.ranges.slice()), t[i] = r);
  }
  return t ? v.create(t, e.mainIndex) : e;
}
function Ws(n, e, t) {
  let i = Jt(n.state.facet(pi).map((s) => s(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : v.cursor(i, i < t.from ? 1 : -1);
}
class Me {
  constructor(e, t) {
    this.pos = e, this.assoc = t;
  }
}
function Tn(n, e, t, i) {
  let s = n.contentDOM.getBoundingClientRect(), r = s.top + n.viewState.paddingTop, { x: o, y: l } = e, a = l - r, h;
  for (; ; ) {
    if (a < 0)
      return new Me(0, 1);
    if (a > n.viewState.docHeight)
      return new Me(n.state.doc.length, -1);
    if (h = n.elementAtHeight(a), i == null)
      break;
    if (h.type == ie.Text) {
      if (i < 0 ? h.to < n.viewport.from : h.from > n.viewport.to)
        break;
      let u = n.docView.coordsAt(i < 0 ? h.from : h.to, i > 0 ? -1 : 1);
      if (u && (i < 0 ? u.top <= a + r : u.bottom >= a + r))
        break;
    }
    let c = n.viewState.heightOracle.textHeight / 2;
    a = i > 0 ? h.bottom + c : h.top - c;
  }
  if (n.viewport.from >= h.to || n.viewport.to <= h.from) {
    if (t)
      return null;
    if (h.type == ie.Text) {
      let c = jc(n, s, h, o, l);
      return new Me(c, c == h.from ? 1 : -1);
    }
  }
  if (h.type != ie.Text)
    return a < (h.top + h.bottom) / 2 ? new Me(h.from, 1) : new Me(h.to, -1);
  let f = n.docView.lineAt(h.from, 2);
  return (!f || f.length != h.length) && (f = n.docView.lineAt(h.from, -2)), new Zc(n, o, l, n.textDirectionAt(h.from)).scanTile(f, h.from);
}
class Zc {
  constructor(e, t, i, s) {
    this.view = e, this.x = t, this.y = i, this.baseDir = s, this.line = null, this.spans = null;
  }
  bidiSpansAt(e) {
    return (!this.line || this.line.from > e || this.line.to < e) && (this.line = this.view.state.doc.lineAt(e), this.spans = this.view.bidiSpans(this.line)), this;
  }
  baseDirAt(e, t) {
    let { line: i, spans: s } = this.bidiSpansAt(e);
    return s[We.find(s, e - i.from, -1, t)].level == this.baseDir;
  }
  dirAt(e, t) {
    let { line: i, spans: s } = this.bidiSpansAt(e);
    return s[We.find(s, e - i.from, -1, t)].dir;
  }
  // Used to short-circuit bidi tests for content with a uniform direction
  bidiIn(e, t) {
    let { spans: i, line: s } = this.bidiSpansAt(e);
    return i.length > 1 || i.length && (i[0].level != this.baseDir || i[0].to + s.from < t);
  }
  // Scan through the rectangles for the content of a tile with inline
  // content, looking for one that overlaps the queried position
  // vertically and is closest horizontally. The caller is responsible
  // for dividing its content into N pieces, and pass an array with
  // N+1 positions (including the position after the last piece). For
  // a text tile, these will be character clusters, for a composite
  // tile, these will be child tiles.
  scan(e, t, i = !1) {
    let s = 0, r = e.length - 1, o = /* @__PURE__ */ new Set(), l = this.bidiIn(e[0], e[r]), a, h, f = -1, c = 1e9, u;
    e: for (; s < r; ) {
      let p = r - s, g = s + r >> 1;
      t: if (o.has(g)) {
        let O = s + Math.floor(Math.random() * p);
        for (let b = 0; b < p; b++) {
          if (!o.has(O)) {
            g = O;
            break t;
          }
          O++, O == r && (O = s);
        }
        break e;
      }
      o.add(g);
      let m = t(g);
      if (m)
        for (let O = 0; O < m.length; O++) {
          let b = m[O], Q = 0;
          if (!(b.width == 0 && m.length > 1)) {
            if (b.bottom < this.y)
              (!a || a.bottom < b.bottom) && (a = b), Q = 1;
            else if (b.top > this.y)
              (!h || h.top > b.top) && (h = b), Q = -1;
            else {
              let R = b.left > this.x ? this.x - b.left : b.right < this.x ? this.x - b.right : 0, k = Math.abs(R);
              k < c && (f = g, c = k, u = b), R && (Q = R < 0 == (this.baseDir == H.LTR) ? -1 : 1);
            }
            Q == -1 && (!l || this.baseDirAt(e[g], 1)) ? r = g : Q == 1 && (!l || this.baseDirAt(e[g + 1], -1)) && (s = g + 1);
          }
        }
    }
    if (!u) {
      if (!h && !a)
        return { i: e[0], after: !1 };
      let p = a && (!h || this.y - a.bottom < h.top - this.y) ? a : h;
      return this.y = (p.top + p.bottom) / 2, this.scan(e, t, !0);
    }
    if (c && !i) {
      let { top: p, bottom: g } = u;
      if (a && a.bottom > (p + p + g) / 3)
        return this.y = a.bottom - 1, this.scan(e, t, !0);
      if (h && h.top < (p + g + g) / 3)
        return this.y = h.top + 1, this.scan(e, t, !0);
    }
    let d = (l ? this.dirAt(e[f], 1) : this.baseDir) == H.LTR;
    return {
      i: f,
      // Test whether x is closes to the start or end of this element
      after: this.x > (u.left + u.right) / 2 == d
    };
  }
  scanText(e, t) {
    let i = [];
    for (let r = 0; r < e.length; r = we(e.text, r))
      i.push(t + r);
    i.push(t + e.length);
    let s = this.scan(i, (r) => {
      let o = i[r] - t, l = i[r + 1] - t;
      return hi(e.dom, o, l).getClientRects();
    });
    return s.after ? new Me(i[s.i + 1], -1) : new Me(i[s.i], 1);
  }
  scanTile(e, t) {
    if (!e.length)
      return new Me(t, 1);
    if (e.children.length == 1) {
      let l = e.children[0];
      if (l.isText())
        return this.scanText(l, t);
      if (l.isComposite())
        return this.scanTile(l, t);
    }
    let i = [t];
    for (let l = 0, a = t; l < e.children.length; l++)
      i.push(a += e.children[l].length);
    let s = this.scan(i, (l) => {
      let a = e.children[l];
      return a.flags & 48 ? null : (a.dom.nodeType == 1 ? a.dom : hi(a.dom, 0, a.length)).getClientRects();
    }), r = e.children[s.i], o = i[s.i];
    return r.isText() ? this.scanText(r, o) : r.isComposite() ? this.scanTile(r, o) : s.after ? new Me(i[s.i + 1], -1) : new Me(o, 1);
  }
}
const kt = "￿";
class Yc {
  constructor(e, t) {
    this.points = e, this.view = t, this.text = "", this.lineSeparator = t.state.facet(N.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += kt;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let s = e; ; ) {
      this.findPointBefore(i, s);
      let r = this.text.length;
      this.readNode(s);
      let o = G.get(s), l = s.nextSibling;
      if (l == t) {
        o != null && o.breakAfter && !l && i != this.view.contentDOM && this.lineBreak();
        break;
      }
      let a = G.get(l);
      (o && a ? o.breakAfter : (o ? o.breakAfter : is(s)) || is(l) && (s.nodeName != "BR" || o != null && o.isWidget()) && this.text.length > r) && !Jc(l, t) && this.lineBreak(), s = l;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let r = -1, o = 1, l;
      if (this.lineSeparator ? (r = t.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (l = s.exec(t)) && (r = l.index, o = l[0].length), this.append(t.slice(i, r < 0 ? t.length : r)), r < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == e && a.pos > this.text.length && (a.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(e) {
    let t = G.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let s = i.iter(); !s.next().done; )
        s.lineBreak ? this.lineBreak() : this.append(s.value);
    } else e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (e.nodeType == 3 ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (Kc(e, i.node, i.offset) ? t : 0));
  }
}
function Kc(n, e, t) {
  for (; ; ) {
    if (!e || t < Ze(e))
      return !1;
    if (e == n)
      return !0;
    t = lt(e) + 1, e = e.parentNode;
  }
}
function Jc(n, e) {
  let t;
  for (; !(n == e || !n); n = n.nextSibling) {
    let i = G.get(n);
    if (!(i != null && i.isWidget()))
      return !1;
    i && (t || (t = [])).push(i);
  }
  if (t)
    for (let i of t) {
      let s = i.overrideDOMText;
      if (s != null && s.length)
        return !1;
    }
  return !0;
}
class Jr {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class eu {
  constructor(e, t, i, s) {
    this.typeOver = s, this.bounds = null, this.text = "", this.domChanged = t > -1;
    let { impreciseHead: r, impreciseAnchor: o } = e.docView, l = e.state.selection;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = ia(e.docView.tile, t, i, 0))) {
      let a = r || o ? [] : iu(e), h = new Yc(a, e);
      h.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = h.text, this.newSel = su(a, this.bounds.from);
    } else {
      let a = e.observer.selectionRange, h = r && r.node == a.focusNode && r.offset == a.focusOffset || !yn(e.contentDOM, a.focusNode) ? l.main.head : e.docView.posFromDOM(a.focusNode, a.focusOffset), f = o && o.node == a.anchorNode && o.offset == a.anchorOffset || !yn(e.contentDOM, a.anchorNode) ? l.main.anchor : e.docView.posFromDOM(a.anchorNode, a.anchorOffset), c = e.viewport;
      if ((w.ios || w.chrome) && h != f && Math.min(h, f) <= l.main.from && Math.max(h, f) >= l.main.to && (c.from > 0 || c.to < e.state.doc.length)) {
        let u = Math.min(h, f), d = Math.max(h, f), p = c.from - u, g = c.to - d;
        (p == 0 || p == 1 || u == 0) && (g == 0 || g == -1 || d == e.state.doc.length) && (h = 0, f = e.state.doc.length);
      }
      if (e.inputState.composing > -1 && l.ranges.length > 1)
        this.newSel = l.replaceRange(v.range(f, h));
      else if (e.lineWrapping && f == h && !(l.main.empty && l.main.head == h) && e.inputState.lastTouchTime > Date.now() - 100) {
        let u = e.coordsAtPos(h, -1), d = 0;
        u && (d = e.inputState.lastTouchY <= u.bottom ? -1 : 1), this.newSel = v.create([v.cursor(h, d)]);
      } else
        this.newSel = v.single(f, h);
    }
  }
}
function ia(n, e, t, i) {
  if (n.isComposite()) {
    let s = -1, r = -1, o = -1, l = -1;
    for (let a = 0, h = i, f = i; a < n.children.length; a++) {
      let c = n.children[a], u = h + c.length;
      if (h < e && u > t)
        return ia(c, e, t, h);
      if (u >= e && s == -1 && (s = a, r = h), h > t && c.dom.parentNode == n.dom) {
        o = a, l = f;
        break;
      }
      f = u, h = u + c.breakAfter;
    }
    return {
      from: r,
      to: l < 0 ? i + n.length : l,
      startDOM: (s ? n.children[s - 1].dom.nextSibling : null) || n.dom.firstChild,
      endDOM: o < n.children.length && o >= 0 ? n.children[o].dom : null
    };
  } else return n.isText() ? { from: i, to: i + n.length, startDOM: n.dom, endDOM: n.dom.nextSibling } : null;
}
function sa(n, e) {
  let t, { newSel: i } = e, { state: s } = n, r = s.selection.main, o = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: l, to: a } = e.bounds, h = r.from, f = null;
    (o === 8 || w.android && e.text.length < a - l) && (h = r.to, f = "end");
    let c = s.doc.sliceString(l, a, kt), u, d;
    !r.empty && r.from >= l && r.to <= a && (e.typeOver || c != e.text) && c.slice(0, r.from - l) == e.text.slice(0, r.from - l) && c.slice(r.to - l) == e.text.slice(u = e.text.length - (c.length - (r.to - l))) ? t = {
      from: r.from,
      to: r.to,
      insert: D.of(e.text.slice(r.from - l, u).split(kt))
    } : (d = na(c, e.text, h - l, f)) && (w.chrome && o == 13 && d.toB == d.from + 2 && e.text.slice(d.from, d.toB) == kt + kt && d.toB--, t = {
      from: l + d.from,
      to: l + d.toA,
      insert: D.of(e.text.slice(d.from, d.toB).split(kt))
    });
  } else i && (!n.hasFocus && s.facet(Fe) || ls(i, r)) && (i = null);
  if (!t && !i)
    return !1;
  if ((w.mac || w.android) && t && t.from == t.to && t.from == r.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = v.single(i.main.anchor - 1, i.main.head - 1)), t = { from: t.from, to: t.to, insert: D.of([t.insert.toString().replace(".", " ")]) }) : s.doc.lineAt(r.from).to < r.to && n.docView.lineHasWidget(r.to) && n.inputState.insertingTextAt > Date.now() - 50 ? t = {
    from: r.from,
    to: r.to,
    insert: s.toText(n.inputState.insertingText)
  } : w.chrome && t && t.from == t.to && t.from == r.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = v.single(i.main.anchor - 1, i.main.head - 1)), t = { from: r.from, to: r.to, insert: D.of([" "]) }), t)
    return er(n, t, i, o);
  if (i && !ls(i, r)) {
    let l = !1, a = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (l = !0), a = n.inputState.lastSelectionOrigin, a == "select.pointer" && (i = ta(s.facet(pi).map((h) => h(n)), i))), n.dispatch({ selection: i, scrollIntoView: l, userEvent: a }), !0;
  } else
    return !1;
}
function er(n, e, t, i = -1) {
  if (w.ios && n.inputState.flushIOSKey(e))
    return !0;
  let s = n.state.selection.main;
  if (w.android && (e.to == s.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (e.from == s.from || e.from == s.from - 1 && n.state.sliceDoc(e.from, s.from) == " ") && e.insert.length == 1 && e.insert.lines == 2 && qt(n.contentDOM, "Enter", 13) || (e.from == s.from - 1 && e.to == s.to && e.insert.length == 0 || i == 8 && e.insert.length < e.to - e.from && e.to > s.head) && qt(n.contentDOM, "Backspace", 8) || e.from == s.from && e.to == s.to + 1 && e.insert.length == 0 && qt(n.contentDOM, "Delete", 46)))
    return !0;
  let r = e.insert.toString();
  n.inputState.composing >= 0 && n.inputState.composing++;
  let o, l = () => o || (o = tu(n, e, t));
  return n.state.facet(Vl).some((a) => a(n, e.from, e.to, r, l)) || n.dispatch(l()), !0;
}
function tu(n, e, t) {
  let i, s = n.state, r = s.selection.main, o = -1;
  if (e.from == e.to && e.from < r.from || e.from > r.to) {
    let a = e.from < r.from ? -1 : 1, h = a < 0 ? r.from : r.to, f = Jt(s.facet(pi).map((c) => c(n)), h, a);
    e.from == f && (o = f);
  }
  if (o > -1)
    i = {
      changes: e,
      selection: v.cursor(e.from + e.insert.length, -1)
    };
  else if (e.from >= r.from && e.to <= r.to && e.to - e.from >= (r.to - r.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let a = r.from < e.from ? s.sliceDoc(r.from, e.from) : "", h = r.to > e.to ? s.sliceDoc(e.to, r.to) : "";
    i = s.replaceSelection(n.state.toText(a + e.insert.sliceString(0, void 0, n.state.lineBreak) + h));
  } else {
    let a = s.changes(e), h = t && t.main.to <= a.newLength ? t.main : void 0;
    if (s.selection.ranges.length > 1 && (n.inputState.composing >= 0 || n.inputState.compositionPendingChange) && e.to <= r.to + 10 && e.to >= r.to - 10) {
      let f = n.state.sliceDoc(e.from, e.to), c, u = t && ea(n, t.main.head);
      if (u) {
        let p = e.insert.length - (e.to - e.from);
        c = { from: u.from, to: u.to - p };
      } else
        c = n.state.doc.lineAt(r.head);
      let d = r.to - e.to;
      i = s.changeByRange((p) => {
        if (p.from == r.from && p.to == r.to)
          return { changes: a, range: h || p.map(a) };
        let g = p.to - d, m = g - f.length;
        if (n.state.sliceDoc(m, g) != f || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        g >= c.from && m <= c.to)
          return { range: p };
        let O = s.changes({ from: m, to: g, insert: e.insert }), b = p.to - r.to;
        return {
          changes: O,
          range: h ? v.range(Math.max(0, h.anchor + b), Math.max(0, h.head + b)) : p.map(O)
        };
      });
    } else
      i = {
        changes: a,
        selection: h && s.selection.replaceRange(h)
      };
  }
  let l = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, l += ".compose", n.inputState.compositionFirstChange && (l += ".start", n.inputState.compositionFirstChange = !1)), s.update(i, { userEvent: l, scrollIntoView: !0 });
}
function na(n, e, t, i) {
  let s = Math.min(n.length, e.length), r = 0;
  for (; r < s && n.charCodeAt(r) == e.charCodeAt(r); )
    r++;
  if (r == s && n.length == e.length)
    return null;
  let o = n.length, l = e.length;
  for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
    o--, l--;
  if (i == "end") {
    let a = Math.max(0, r - Math.min(o, l));
    t -= o + a - r;
  }
  if (o < r && n.length < e.length) {
    let a = t <= r && t >= o ? r - t : 0;
    r -= a, l = r + (l - o), o = r;
  } else if (l < r) {
    let a = t <= r && t >= l ? r - t : 0;
    r -= a, o = r + (o - l), l = r;
  }
  return { from: r, toA: o, toB: l };
}
function iu(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: s, focusOffset: r } = n.observer.selectionRange;
  return t && (e.push(new Jr(t, i)), (s != t || r != i) && e.push(new Jr(s, r))), e;
}
function su(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t > -1 && i > -1 ? v.single(t + e, i + e) : null;
}
function ls(n, e) {
  return e.head == n.main.head && e.anchor == n.main.anchor;
}
class nu {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.touchActive = !1, this.lastTouchTime = 0, this.lastTouchX = 0, this.lastTouchY = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.lastWheelEvent = 0, this.pendingIOSKey = void 0, this.lastIOSMomentumScroll = 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, w.safari && e.contentDOM.addEventListener("input", () => null), w.gecko && Su(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !du(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || (this.view.updateState != 0 ? Promise.resolve().then(() => this.runHandlers(e.type, e)) : this.runHandlers(e.type, e));
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let s of i.observers)
        s(this.view, t);
      for (let s of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (s(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = ou(e), i = this.handlers, s = this.view.contentDOM;
    for (let r in t)
      if (r != "scroll") {
        let o = !t[r].handlers.length, l = i[r];
        l && o != !l.handlers.length && (s.removeEventListener(r, this.handleEvent), l = null), l || s.addEventListener(r, this.handleEvent, { passive: o });
      }
    for (let r in i)
      r != "scroll" && !t[r] && s.removeEventListener(r, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && e.keyCode != 27 && oa.indexOf(e.keyCode) < 0 && (this.tabFocusMode = -1), w.android && w.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    if (w.ios && !e.synthetic && !e.altKey && !e.metaKey && (ra.some((t) => t.keyCode == e.keyCode) && !e.ctrlKey || lu.indexOf(e.key) > -1 && e.ctrlKey)) {
      let t = { ctrlKey: e.ctrlKey, altKey: e.altKey, metaKey: e.metaKey, shiftKey: e.shiftKey };
      return t.shiftKey && w.ios && !/^(off|none)$/.test(this.view.contentDOM.autocapitalize) && ru(this.view.win) && (t.shiftKey = !1), this.pendingIOSKey = { key: e.key, keyCode: e.keyCode, mods: t }, setTimeout(() => this.flushIOSKey(), 250), !0;
    }
    return e.keyCode != 229 && this.view.observer.forceFlush(), !1;
  }
  flushIOSKey(e) {
    let t = this.pendingIOSKey;
    return !t || t.key == "Enter" && e && e.from < e.to && /^\S+$/.test(e.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, qt(this.view.contentDOM, t.key, t.keyCode, t.mods));
  }
  ignoreDuringComposition(e) {
    return !/^key/.test(e.type) || e.synthetic ? !1 : this.composing > 0 ? !0 : w.safari && !w.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.view.observer.update(e), this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function ru(n) {
  return n.visualViewport ? n.visualViewport.height * n.visualViewport.scale / n.document.documentElement.clientHeight < 0.85 : !1;
}
function eo(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (s) {
      De(t.state, s);
    }
  };
}
function ou(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let s = i.spec, r = s && s.plugin.domEventHandlers, o = s && s.plugin.domEventObservers;
    if (r)
      for (let l in r) {
        let a = r[l];
        a && t(l).handlers.push(eo(i.value, a));
      }
    if (o)
      for (let l in o) {
        let a = o[l];
        a && t(l).observers.push(eo(i.value, a));
      }
  }
  for (let i in Te)
    t(i).handlers.push(Te[i]);
  for (let i in fe)
    t(i).observers.push(fe[i]);
  return e;
}
const ra = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], lu = "dthko", oa = [16, 17, 18, 20, 91, 92, 224, 225], Ti = 6;
function Qi(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function au(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class hu {
  constructor(e, t, i, s) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = s, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParents = Cl(e.contentDOM), this.atoms = e.state.facet(pi).map((o) => o(e));
    let r = e.contentDOM.ownerDocument;
    r.addEventListener("mousemove", this.move = this.move.bind(this)), r.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(N.allowMultipleSelections) && fu(e, t), this.dragging = uu(e, t) && ha(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && au(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let t = 0, i = 0, s = 0, r = 0, o = this.view.win.innerWidth, l = this.view.win.innerHeight;
    this.scrollParents.x && ({ left: s, right: o } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({ top: r, bottom: l } = this.scrollParents.y.getBoundingClientRect());
    let a = Kl(this.view);
    e.clientX - a.left <= s + Ti ? t = -Qi(s - e.clientX) : e.clientX + a.right >= o - Ti && (t = Qi(e.clientX - o)), e.clientY - a.top <= r + Ti ? i = -Qi(r - e.clientY) : e.clientY + a.bottom >= l - Ti && (i = Qi(e.clientY - l)), this.setScrollSpeed(t, i);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    let { x: e, y: t } = this.scrollSpeed;
    e && this.scrollParents.x && (this.scrollParents.x.scrollLeft += e, e = 0), t && this.scrollParents.y && (this.scrollParents.y.scrollTop += t, t = 0), (e || t) && this.view.win.scrollBy(e, t), this.dragging === !1 && this.select(this.lastEvent);
  }
  select(e) {
    let { view: t } = this, i = ta(this.atoms, this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    e.transactions.some((t) => t.isUserEvent("input.type")) ? this.destroy() : this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function fu(n, e) {
  let t = n.state.facet(Bl);
  return t.length ? t[0](e) : w.mac ? e.metaKey : e.ctrlKey;
}
function cu(n, e) {
  let t = n.state.facet(Il);
  return t.length ? t[0](e) : w.mac ? !e.altKey : !e.ctrlKey;
}
function uu(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = ai(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let s = i.getRangeAt(0).getClientRects();
  for (let r = 0; r < s.length; r++) {
    let o = s[r];
    if (o.left <= e.clientX && o.right >= e.clientX && o.top <= e.clientY && o.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function du(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = G.get(t)) && i.isWidget() && !i.isHidden && i.widget.ignoreEvent(e))
      return !1;
  return !0;
}
const Te = /* @__PURE__ */ Object.create(null), fe = /* @__PURE__ */ Object.create(null), la = w.ie && w.ie_version < 15 || w.ios && w.webkit_version < 604;
function pu(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), aa(n, t.value);
  }, 50);
}
function Ss(n, e, t) {
  for (let i of n.facet(e))
    t = i(t, n);
  return t;
}
function aa(n, e) {
  e = Ss(n.state, Zn, e);
  let { state: t } = n, i, s = 1, r = t.toText(e), o = r.lines == t.selection.ranges.length;
  if (Qn != null && t.selection.ranges.every((a) => a.empty) && Qn == r.toString()) {
    let a = -1;
    i = t.changeByRange((h) => {
      let f = t.doc.lineAt(h.from);
      if (f.from == a)
        return { range: h };
      a = f.from;
      let c = t.toText((o ? r.line(s++).text : e) + t.lineBreak);
      return {
        changes: { from: f.from, insert: c },
        range: v.cursor(h.from + c.length)
      };
    });
  } else o ? i = t.changeByRange((a) => {
    let h = r.line(s++);
    return {
      changes: { from: a.from, to: a.to, insert: h.text },
      range: v.cursor(a.from + h.length)
    };
  }) : i = t.replaceSelection(r);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
fe.scroll = (n) => {
  let e = n.inputState;
  e.lastScrollTop = n.scrollDOM.scrollTop, e.lastScrollLeft = n.scrollDOM.scrollLeft, w.ios && !e.touchActive && (e.lastIOSMomentumScroll = Date.now());
};
fe.wheel = fe.mousewheel = (n) => {
  n.inputState.lastWheelEvent = Date.now();
};
Te.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && n.inputState.tabFocusMode != 0 && (n.inputState.tabFocusMode = Date.now() + 2e3), !1);
fe.touchstart = (n, e) => {
  let t = n.inputState, i = e.targetTouches[0];
  t.touchActive = !0, t.lastTouchTime = Date.now(), i && (t.lastTouchX = i.clientX, t.lastTouchY = i.clientY), t.setSelectionOrigin("select.pointer");
};
fe.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
fe.touchend = (n, e) => {
  n.inputState.touchActive = !1;
};
Te.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(Nl))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = mu(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new hu(n, e, t, i)), i && n.observer.ignore(() => {
      Al(n.contentDOM);
      let r = n.root.activeElement;
      r && !r.contains(n.contentDOM) && r.blur();
    });
    let s = n.inputState.mouseSelection;
    if (s)
      return s.start(e), s.dragging === !1;
  } else
    n.inputState.setSelectionOrigin("select.pointer");
  return !1;
};
function to(n, e, t, i) {
  if (i == 1)
    return v.cursor(e, t);
  if (i == 2)
    return Fc(n.state, e, t);
  {
    let s = n.docView.lineAt(e, t), r = n.state.doc.lineAt(s ? s.posAtEnd : e), o = s ? s.posAtStart : r.from, l = s ? s.posAtEnd : r.to;
    return l < n.state.doc.length && l == r.to && l++, v.undirectionalRange(o, l);
  }
}
const gu = w.ie && w.ie_version <= 11;
let io = null, so = 0, no = 0;
function ha(n) {
  if (!gu)
    return n.detail;
  let e = io, t = no;
  return io = n, no = Date.now(), so = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (so + 1) % 3 : 1;
}
function mu(n, e) {
  let t = n.posAndSideAtCoords({ x: e.clientX, y: e.clientY }, !1), i = ha(e), s = n.state.selection;
  return {
    update(r) {
      r.docChanged && (t.pos = r.changes.mapPos(t.pos), s = s.map(r.changes));
    },
    get(r, o, l) {
      let a = n.posAndSideAtCoords({ x: r.clientX, y: r.clientY }, !1), h, f = to(n, a.pos, a.assoc, i);
      if (t.pos != a.pos && !o) {
        let c = to(n, t.pos, t.assoc, i), u = Math.min(c.from, f.from), d = Math.max(c.to, f.to);
        f = u < f.from ? v.range(u, d, f.assoc) : v.range(d, u, f.assoc);
      }
      return o ? s.replaceRange(s.main.extend(f.from, f.to, f.assoc)) : l && i == 1 && s.ranges.length > 1 && (h = Ou(s, a.pos)) ? h : l ? s.addRange(f) : v.create([f]);
    }
  };
}
function Ou(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: s } = n.ranges[t];
    if (i <= e && s >= e)
      return v.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
Te.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let s = n.docView.tile.nearest(e.target);
    if (s && s.isWidget()) {
      let r = s.posAtStart, o = r + s.length;
      (r >= t.to || o <= t.from) && (t = v.undirectionalRange(r, o));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", Ss(n.state, Yn, n.state.sliceDoc(t.from, t.to))), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
Te.dragend = (n) => (n.inputState.draggedContent = null, !1);
function ro(n, e, t, i) {
  if (t = Ss(n.state, Zn, t), !t)
    return;
  let s = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: r } = n.inputState, o = i && r && cu(n, e) ? { from: r.from, to: r.to } : null, l = { from: s, insert: t }, a = n.state.changes(o ? [o, l] : l);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(s, -1), head: a.mapPos(s, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
Te.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), s = 0, r = () => {
      ++s == t.length && ro(n, e, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < t.length; o++) {
      let l = new FileReader();
      l.onerror = r, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), r();
      }, l.readAsText(t[o]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return ro(n, e, i, !0), !0;
  }
  return !1;
};
Te.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = la ? null : e.clipboardData;
  return t ? (aa(n, t.getData("text/plain") || t.getData("text/uri-list")), !0) : (pu(n), !1);
};
function yu(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function bu(n) {
  let e = [], t = [], i = !1;
  for (let s of n.selection.ranges)
    s.empty || (e.push(n.sliceDoc(s.from, s.to)), t.push(s));
  if (!e.length) {
    let s = -1;
    for (let { from: r } of n.selection.ranges) {
      let o = n.doc.lineAt(r);
      o.number > s && (e.push(o.text), t.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), s = o.number;
    }
    i = !0;
  }
  return { text: Ss(n, Yn, e.join(n.lineBreak)), ranges: t, linewise: i };
}
let Qn = null;
Te.copy = Te.cut = (n, e) => {
  if (!Yt(n.contentDOM, n.observer.selectionRange))
    return !1;
  let { text: t, ranges: i, linewise: s } = bu(n.state);
  if (!t && !s)
    return !1;
  Qn = s ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let r = la ? null : e.clipboardData;
  return r ? (r.clearData(), r.setData("text/plain", t), !0) : (yu(n, t), !1);
};
const fa = /* @__PURE__ */ bt.define();
function ca(n, e) {
  let t = [];
  for (let i of n.facet(_l)) {
    let s = i(n, e);
    s && t.push(s);
  }
  return t.length ? n.update({ effects: t, annotations: fa.of(!0) }) : null;
}
function ua(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = ca(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
fe.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), ua(n);
};
fe.blur = (n) => {
  n.observer.clearSelectionRange(), ua(n);
};
fe.compositionstart = fe.compositionupdate = (n) => {
  n.observer.editContext || (n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0));
};
fe.compositionend = (n) => {
  n.observer.editContext || (n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, w.chrome && w.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50));
};
fe.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
Te.beforeinput = (n, e) => {
  var t, i;
  if ((e.inputType == "insertText" || e.inputType == "insertCompositionText") && (n.inputState.insertingText = e.data, n.inputState.insertingTextAt = Date.now()), e.inputType == "insertReplacementText" && n.observer.editContext) {
    let r = (t = e.dataTransfer) === null || t === void 0 ? void 0 : t.getData("text/plain"), o = e.getTargetRanges();
    if (r && o.length) {
      let l = o[0], a = n.posAtDOM(l.startContainer, l.startOffset), h = n.posAtDOM(l.endContainer, l.endOffset);
      return er(n, { from: a, to: h, insert: n.state.toText(r) }, null), !0;
    }
  }
  let s;
  if (w.chrome && w.android && (s = ra.find((r) => r.inputType == e.inputType)) && (n.observer.delayAndroidKey(s.key, s.keyCode), s.key == "Backspace" || s.key == "Delete")) {
    let r = ((i = window.visualViewport) === null || i === void 0 ? void 0 : i.height) || 0;
    setTimeout(() => {
      var o;
      (((o = window.visualViewport) === null || o === void 0 ? void 0 : o.height) || 0) > r + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return w.ios && e.inputType == "deleteContentForward" && n.observer.flushSoon(), w.safari && e.inputType == "insertText" && n.inputState.composing >= 0 && setTimeout(() => fe.compositionend(n, e), 20), !1;
};
const oo = /* @__PURE__ */ new Set();
function Su(n) {
  oo.has(n) || (oo.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const lo = ["pre-wrap", "normal", "pre-line", "break-spaces"];
let zt = !1;
function ao() {
  zt = !1;
}
class xu {
  constructor(e) {
    this.lineWrapping = e, this.doc = D.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / Math.max(1, this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return lo.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      s < 0 ? i++ : this.heightSamples[Math.floor(s * 10)] || (t = !0, this.heightSamples[Math.floor(s * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, s, r, o) {
    let l = lo.indexOf(e) > -1, a = Math.abs(t - this.lineHeight) > 0.3 || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = t, this.charWidth = i, this.textHeight = s, this.lineLength = r, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let f = o[h];
        f < 0 ? h++ : this.heightSamples[Math.floor(f * 10)] = !0;
      }
    }
    return a;
  }
}
class wu {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class xe {
  /**
  @internal
  */
  constructor(e, t, i, s, r) {
    this.from = e, this.length = t, this.top = i, this.height = s, this._content = r;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? ie.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof mt ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new xe(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var F = /* @__PURE__ */ (function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
})(F || (F = {}));
const Vi = 1e-3;
class ae {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e) {
    this.height != e && (Math.abs(this.height - e) > Vi && (zt = !0), this.height = e);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return ae.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, s) {
    let r = this, o = i.doc;
    for (let l = s.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: f, toB: c } = s[l], u = r.lineAt(a, F.ByPosNoHeight, i.setDoc(t), 0, 0), d = u.to >= h ? u : r.lineAt(h, F.ByPosNoHeight, i, 0, 0);
      for (c += d.to - h, h = d.to; l > 0 && u.from <= s[l - 1].toA; )
        a = s[l - 1].fromA, f = s[l - 1].fromB, l--, a < u.from && (u = r.lineAt(a, F.ByPosNoHeight, i, 0, 0));
      f += u.from - a, a = u.from;
      let p = tr.build(i.setDoc(o), e, f, c);
      r = as(r, r.replace(a, h, p));
    }
    return r.updateHeight(i, 0);
  }
  static empty() {
    return new pe(0, 0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, s = 0, r = 0;
    for (; ; )
      if (t == i)
        if (s > r * 2) {
          let l = e[t - 1];
          l.break ? e.splice(--t, 1, l.left, null, l.right) : e.splice(--t, 1, l.left, l.right), i += 1 + l.break, s -= l.size;
        } else if (r > s * 2) {
          let l = e[i];
          l.break ? e.splice(i, 1, l.left, null, l.right) : e.splice(i, 1, l.left, l.right), i += 2 + l.break, r -= l.size;
        } else
          break;
      else if (s < r) {
        let l = e[t++];
        l && (s += l.size);
      } else {
        let l = e[--i];
        l && (r += l.size);
      }
    let o = 0;
    return e[t - 1] == null ? (o = 1, t--) : e[t] == null && (o = 1, i++), new vu(ae.of(e.slice(0, t)), o, ae.of(e.slice(i)));
  }
}
function as(n, e) {
  return n == e ? n : (n.constructor != e.constructor && (zt = !0), e);
}
ae.prototype.size = 1;
const ku = /* @__PURE__ */ B.replace({});
class da extends ae {
  constructor(e, t, i) {
    super(e, t), this.deco = i, this.spaceAbove = 0;
  }
  mainBlock(e, t) {
    return new xe(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0);
  }
  blockAt(e, t, i, s) {
    return this.spaceAbove && e < i + this.spaceAbove ? new xe(s, 0, i, this.spaceAbove, ku) : this.mainBlock(i, s);
  }
  lineAt(e, t, i, s, r) {
    let o = this.mainBlock(s, r);
    return this.spaceAbove ? this.blockAt(0, i, s, r).join(o) : o;
  }
  forEachLine(e, t, i, s, r, o) {
    e <= r + this.length && t >= r && o(this.lineAt(0, F.ByPos, i, s, r));
  }
  setMeasuredHeight(e) {
    let t = e.heights[e.index++];
    t < 0 ? (this.spaceAbove = -t, t = e.heights[e.index++]) : this.spaceAbove = 0, this.setHeight(t);
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more && this.setMeasuredHeight(s), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class pe extends da {
  constructor(e, t, i) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = i;
  }
  mainBlock(e, t) {
    return new xe(t, this.length, e + this.spaceAbove, this.height - this.spaceAbove, this.breaks);
  }
  replace(e, t, i) {
    let s = i[0];
    return i.length == 1 && (s instanceof pe || s instanceof J && s.flags & 4) && Math.abs(this.length - s.length) < 10 ? (s instanceof J ? s = new pe(s.length, this.height, this.spaceAbove) : s.height = this.height, this.outdated || (s.outdated = !1), s) : ae.of(i);
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more ? this.setMeasuredHeight(s) : (i || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight)), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class J extends ae {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, s = e.doc.lineAt(t + this.length).number, r = s - i + 1, o, l = 0;
    if (e.lineWrapping) {
      let a = Math.min(this.height, e.lineHeight * r);
      o = a / r, this.length > r + 1 && (l = (this.height - a) / (this.length - r - 1));
    } else
      o = this.height / r;
    return { firstLine: i, lastLine: s, perLine: o, perChar: l };
  }
  blockAt(e, t, i, s) {
    let { firstLine: r, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(t, s);
    if (t.lineWrapping) {
      let h = s + (e < t.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length)), f = t.doc.lineAt(h), c = l + f.length * a, u = Math.max(i, e - c / 2);
      return new xe(f.from, f.length, u, c, 0);
    } else {
      let h = Math.max(0, Math.min(o - r, Math.floor((e - i) / l))), { from: f, length: c } = t.doc.line(r + h);
      return new xe(f, c, i + l * h, l, 0);
    }
  }
  lineAt(e, t, i, s, r) {
    if (t == F.ByHeight)
      return this.blockAt(e, i, s, r);
    if (t == F.ByPosNoHeight) {
      let { from: d, to: p } = i.doc.lineAt(e);
      return new xe(d, p - d, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, r), h = i.doc.lineAt(e), f = l + h.length * a, c = h.number - o, u = s + l * c + a * (h.from - r - c);
    return new xe(h.from, h.length, Math.max(s, Math.min(u, s + this.height - f)), f, 0);
  }
  forEachLine(e, t, i, s, r, o) {
    e = Math.max(e, r), t = Math.min(t, r + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, r);
    for (let f = e, c = s; f <= t; ) {
      let u = i.doc.lineAt(f);
      if (f == e) {
        let p = u.number - l;
        c += a * p + h * (e - r - p);
      }
      let d = a + h * u.length;
      o(new xe(u.from, u.length, c, d, 0)), c += d, f = u.to + 1;
    }
  }
  replace(e, t, i) {
    let s = this.length - t;
    if (s > 0) {
      let r = i[i.length - 1];
      r instanceof J ? i[i.length - 1] = new J(r.length + s) : i.push(null, new J(s - 1));
    }
    if (e > 0) {
      let r = i[0];
      r instanceof J ? i[0] = new J(e + r.length) : i.unshift(new J(e - 1), null);
    }
    return ae.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new J(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new J(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, s) {
    let r = t + this.length;
    if (s && s.from <= t + this.length && s.more) {
      let o = [], l = Math.max(t, s.from), a = -1;
      for (s.from > t && o.push(new J(s.from - t - 1).updateHeight(e, t)); l <= r && s.more; ) {
        let f = e.doc.lineAt(l).length;
        o.length && o.push(null);
        let c = s.heights[s.index++], u = 0;
        c < 0 && (u = -c, c = s.heights[s.index++]), a == -1 ? a = c : Math.abs(c - a) >= Vi && (a = -2);
        let d = new pe(f, c, u);
        d.outdated = !1, o.push(d), l += f + 1;
      }
      l <= r && o.push(null, new J(r - l).updateHeight(e, l));
      let h = ae.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= Vi || Math.abs(a - this.heightMetrics(e, t).perLine) >= Vi) && (zt = !0), as(this, h);
    } else (i || this.outdated) && (this.setHeight(e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class vu extends ae {
  constructor(e, t, i) {
    super(e.length + t + i.length, e.height + i.height, t | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, s) {
    let r = i + this.left.height;
    return e < r ? this.left.blockAt(e, t, i, s) : this.right.blockAt(e, t, r, s + this.left.length + this.break);
  }
  lineAt(e, t, i, s, r) {
    let o = s + this.left.height, l = r + this.left.length + this.break, a = t == F.ByHeight ? e < o : e < l, h = a ? this.left.lineAt(e, t, i, s, r) : this.right.lineAt(e, t, i, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let f = t == F.ByPosNoHeight ? F.ByPosNoHeight : F.ByPos;
    return a ? h.join(this.right.lineAt(l, f, i, o, l)) : this.left.lineAt(l, f, i, s, r).join(h);
  }
  forEachLine(e, t, i, s, r, o) {
    let l = s + this.left.height, a = r + this.left.length + this.break;
    if (this.break)
      e < a && this.left.forEachLine(e, t, i, s, r, o), t >= a && this.right.forEachLine(e, t, i, l, a, o);
    else {
      let h = this.lineAt(a, F.ByPos, i, s, r);
      e < h.from && this.left.forEachLine(e, h.from - 1, i, s, r, o), h.to >= e && h.from <= t && o(h), t > h.to && this.right.forEachLine(h.to + 1, t, i, l, a, o);
    }
  }
  replace(e, t, i) {
    let s = this.left.length + this.break;
    if (t < s)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - s, t - s, i));
    let r = [];
    e > 0 && this.decomposeLeft(e, r);
    let o = r.length;
    for (let l of i)
      r.push(l);
    if (e > 0 && ho(r, o - 1), t < this.length) {
      let l = r.length;
      this.decomposeRight(t, r), ho(r, l);
    }
    return ae.of(r);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, s = i + this.break;
    if (e >= s)
      return this.right.decomposeRight(e - s, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < s && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? ae.of(this.break ? [e, null, t] : [e, t]) : (this.left = as(this.left, e), this.right = as(this.right, t), this.setHeight(e.height + t.height), this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, s) {
    let { left: r, right: o } = this, l = t + r.length + this.break, a = null;
    return s && s.from <= t + r.length && s.more ? a = r = r.updateHeight(e, t, i, s) : r.updateHeight(e, t, i), s && s.from <= l + o.length && s.more ? a = o = o.updateHeight(e, l, i, s) : o.updateHeight(e, l, i), a ? this.balanced(r, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function ho(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof J && (i = n[e + 1]) instanceof J && n.splice(e - 1, 3, new J(t.length + 1 + i.length));
}
const Tu = 5;
class tr {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), s = this.nodes[this.nodes.length - 1];
      s instanceof pe ? s.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new pe(i - this.pos, -1, 0)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let s = i.widget ? i.widget.estimatedHeight : 0, r = i.widget ? i.widget.lineBreaks : 0;
      s < 0 && (s = this.oracle.lineHeight);
      let o = t - e;
      i.block ? this.addBlock(new da(o, s, i)) : (o || r || s >= Tu) && this.addLineDeco(s, r, o);
    } else t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new pe(this.pos - e, -1, 0)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new J(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof pe)
      return e;
    let t = new pe(0, -1, 0);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let s = this.ensureLine();
    s.length += i, s.collapsed += i, s.widgetHeight = Math.max(s.widgetHeight, e), s.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof pe) && !this.isCovered ? this.nodes.push(new pe(0, -1, 0)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let s of this.nodes)
      s instanceof pe && s.updateHeight(this.oracle, i), i += s ? s.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, s) {
    let r = new tr(i, e);
    return $.spans(t, i, s, r, 0), r.finish(i);
  }
}
function Qu(n, e, t) {
  let i = new Pu();
  return $.compare(n, e, t, i, 0), i.changes;
}
class Pu {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, s) {
    (e < t || i && i.heightRelevant || s && s.heightRelevant) && Rt(e, t, this.changes, 5);
  }
}
function Cu(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, s = i.defaultView || window, r = Math.max(0, t.left), o = Math.min(s.innerWidth, t.right), l = Math.max(0, t.top), a = Math.min(s.innerHeight, t.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (h.nodeType == 1) {
      let f = h, c = window.getComputedStyle(f);
      if ((f.scrollHeight > f.clientHeight || f.scrollWidth > f.clientWidth) && c.overflow != "visible") {
        let u = f.getBoundingClientRect();
        r = Math.max(r, u.left), o = Math.min(o, u.right), l = Math.max(l, u.top), a = Math.min(h == n.parentNode ? s.innerHeight : a, u.bottom);
      }
      h = c.position == "absolute" || c.position == "fixed" ? f.offsetParent : f.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: r - t.left,
    right: Math.max(r, o) - t.left,
    top: l - (t.top + e),
    bottom: Math.max(l, a) - (t.top + e)
  };
}
function Au(n) {
  let e = n.getBoundingClientRect(), t = n.ownerDocument.defaultView || window;
  return e.left < t.innerWidth && e.right > 0 && e.top < t.innerHeight && e.bottom > 0;
}
function Ru(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class Ds {
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.size = i, this.displaySize = s;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i], r = t[i];
      if (s.from != r.from || s.to != r.to || s.size != r.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return B.replace({
      widget: new qu(this.displaySize * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class qu extends St {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class fo {
  constructor(e, t) {
    this.view = e, this.state = t, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scaleX = 1, this.scaleY = 1, this.scrollOffset = 0, this.scrolledToBottom = !1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = co, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = H.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let i = t.facet(Kn).some((s) => typeof s != "function" && s.class == "cm-lineWrapping");
    this.heightOracle = new xu(i), this.stateDeco = uo(t), this.heightMap = ae.empty().applyChanges(this.stateDeco, D.empty, this.heightOracle.setDoc(t.doc), [new Se(0, 0, 0, t.doc.length)]);
    for (let s = 0; s < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); s++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = B.set(this.lineGaps.map((s) => s.draw(this, !1))), this.scrollParent = e.scrollDOM, this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let s = i ? t.head : t.anchor;
      if (!e.some(({ from: r, to: o }) => s >= r && s <= o)) {
        let { from: r, to: o } = this.lineBlockAt(s);
        e.push(new Pi(r, o));
      }
    }
    return this.viewports = e.sort((i, s) => i.from - s.from), this.updateScaler();
  }
  updateScaler() {
    let e = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? co : new ir(this.heightOracle, this.heightMap, this.viewports), e.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(Ht(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = uo(this.state);
    let s = e.changedRanges, r = Se.extendWithRanges(s, Qu(i, this.stateDeco, e ? e.changes : Y.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollOffset);
    ao(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), r), (this.heightMap.height != o || zt) && (e.flags |= 2), l ? (this.scrollAnchorPos = e.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = o);
    let a = r.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < a.from || t.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, t));
    let h = a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, e.flags |= this.updateForViewport(), (h || !e.changes.empty || e.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(e.changes), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && (e.selectionSet || e.focusChanged) && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(Fl) && (this.mustEnforceCursorAssoc = !0);
  }
  measure() {
    let { view: e } = this, t = e.contentDOM, i = window.getComputedStyle(t), s = this.heightOracle, r = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? H.RTL : H.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(r) || this.mustMeasureContent === "refresh", l = t.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, f = 0;
    if (l.width && l.height) {
      let { scaleX: k, scaleY: T } = Pl(t, l);
      (k > 5e-3 && Math.abs(this.scaleX - k) > 5e-3 || T > 5e-3 && Math.abs(this.scaleY - T) > 5e-3) && (this.scaleX = k, this.scaleY = T, h |= 16, o = a = !0);
    }
    let c = (parseInt(i.paddingTop) || 0) * this.scaleY, u = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != c || this.paddingBottom != u) && (this.paddingTop = c, this.paddingBottom = u, h |= 18), this.editorWidth != e.scrollDOM.clientWidth && (s.lineWrapping && (a = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 16);
    let d = Cl(this.view.contentDOM, !1).y;
    d != this.scrollParent && (this.scrollParent = d, this.scrollAnchorHeight = -1, this.scrollOffset = 0);
    let p = this.getScrollOffset();
    this.scrollOffset != p && (this.scrollAnchorHeight = -1, this.scrollOffset = p), this.scrolledToBottom = Rl(this.scrollParent || e.win);
    let g = (this.printing ? Ru : Cu)(t, this.paddingTop), m = g.top - this.pixelViewport.top, O = g.bottom - this.pixelViewport.bottom;
    this.pixelViewport = g;
    let b = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (b != this.inView && (this.inView = b, b && (a = !0)), !this.inView && !this.scrollTarget && !Au(e.dom))
      return 0;
    let Q = l.width;
    if ((this.contentDOMWidth != Q || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 16), a) {
      let k = e.docView.measureVisibleLineHeights(this.viewport);
      if (s.mustRefreshForHeights(k) && (o = !0), o || s.lineWrapping && Math.abs(Q - this.contentDOMWidth) > s.charWidth) {
        let { lineHeight: T, charWidth: x, textHeight: W } = e.docView.measureTextSize();
        o = T > 0 && s.refresh(r, T, x, W, Math.max(5, Q / x), k), o && (e.docView.minWidth = 0, h |= 16);
      }
      m > 0 && O > 0 ? f = Math.max(m, O) : m < 0 && O < 0 && (f = Math.min(m, O)), ao();
      for (let T of this.viewports) {
        let x = T.from == this.viewport.from ? k : e.docView.measureVisibleLineHeights(T);
        this.heightMap = (o ? ae.empty().applyChanges(this.stateDeco, D.empty, this.heightOracle, [new Se(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(s, 0, o, new wu(T.from, x));
      }
      zt && (h |= 2);
    }
    let R = !this.viewportIsAppropriate(this.viewport, f) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return R && (h & 2 && (h |= this.updateScaler()), this.viewport = this.getViewport(f, this.scrollTarget), h |= this.updateForViewport()), (h & 2 || R) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), s = this.heightMap, r = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new Pi(s.lineAt(o - i * 1e3, F.ByHeight, r, 0, 0).from, s.lineAt(l + (1 - i) * 1e3, F.ByHeight, r, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < a.from || h > a.to) {
        let f = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), c = s.lineAt(h, F.ByPos, r, 0, 0), u;
        t.y == "center" ? u = (c.top + c.bottom) / 2 - f / 2 : t.y == "start" || t.y == "nearest" && h < a.from ? u = c.top : u = c.bottom - f, a = new Pi(s.lineAt(u - 1e3 / 2, F.ByHeight, r, 0, 0).from, s.lineAt(u + f + 1e3 / 2, F.ByHeight, r, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), s = t.mapPos(e.to, 1);
    return new Pi(this.heightMap.lineAt(i, F.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(s, F.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: s } = this.heightMap.lineAt(e, F.ByPos, this.heightOracle, 0, 0), { bottom: r } = this.heightMap.lineAt(t, F.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (e == 0 || s <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || r >= l + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && s > o - 2 * 1e3 && r < l + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let s of e)
      t.touchesRange(s.from, s.to) || i.push(new Ds(t.mapPos(s.from), t.mapPos(s.to), s.size, s.displaySize));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, s = i ? 1e4 : 2e3, r = s >> 1, o = s << 1;
    if (this.defaultTextDirection != H.LTR && !i)
      return [];
    let l = [], a = (f, c, u, d) => {
      if (c - f < r)
        return;
      let p = this.state.selection.main, g = [p.from];
      p.empty || g.push(p.to);
      for (let O of g)
        if (O > f && O < c) {
          a(f, O - 10, u, d), a(O + 10, c, u, d);
          return;
        }
      let m = Mu(e, (O) => O.from >= u.from && O.to <= u.to && Math.abs(O.from - f) < r && Math.abs(O.to - c) < r && !g.some((b) => O.from < b && O.to > b));
      if (!m) {
        if (c < u.to && t && i && t.visibleRanges.some((Q) => Q.from <= c && Q.to >= c)) {
          let Q = t.moveToLineBoundary(v.cursor(c), !1, !0).head;
          Q > f && (c = Q);
        }
        let O = this.gapSize(u, f, c, d), b = i || O < 2e6 ? O : 2e6;
        m = new Ds(f, c, O, b);
      }
      l.push(m);
    }, h = (f) => {
      if (f.length < o || f.type != ie.Text)
        return;
      let c = Eu(f.from, f.to, this.stateDeco);
      if (c.total < o)
        return;
      let u = this.scrollTarget ? this.scrollTarget.range.head : null, d, p;
      if (i) {
        let g = s / this.heightOracle.lineLength * this.heightOracle.lineHeight, m, O;
        if (u != null) {
          let b = Ai(c, u), Q = ((this.visibleBottom - this.visibleTop) / 2 + g) / f.height;
          m = b - Q, O = b + Q;
        } else
          m = (this.visibleTop - f.top - g) / f.height, O = (this.visibleBottom - f.top + g) / f.height;
        d = Ci(c, m), p = Ci(c, O);
      } else {
        let g = c.total * this.heightOracle.charWidth, m = s * this.heightOracle.charWidth, O = 0;
        if (g > 2e6)
          for (let T of e)
            T.from >= f.from && T.from < f.to && T.size != T.displaySize && T.from * this.heightOracle.charWidth + O < this.pixelViewport.left && (O = T.size - T.displaySize);
        let b = this.pixelViewport.left + O, Q = this.pixelViewport.right + O, R, k;
        if (u != null) {
          let T = Ai(c, u), x = ((Q - b) / 2 + m) / g;
          R = T - x, k = T + x;
        } else
          R = (b - m) / g, k = (Q + m) / g;
        d = Ci(c, R), p = Ci(c, k);
      }
      d > f.from && a(f.from, d, f, c), p < f.to && a(p, f.to, f, c);
    };
    for (let f of this.viewportLines)
      Array.isArray(f.type) ? f.type.forEach(h) : h(f);
    return l;
  }
  gapSize(e, t, i, s) {
    let r = Ai(s, i) - Ai(s, t);
    return this.heightOracle.lineWrapping ? e.height * r : s.total * this.heightOracle.charWidth * r;
  }
  updateLineGaps(e) {
    Ds.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = B.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges(e) {
    let t = this.stateDeco;
    this.lineGaps.length && (t = t.concat(this.lineGapDeco));
    let i = [];
    $.spans(t, this.viewport.from, this.viewport.to, {
      span(r, o) {
        i.push({ from: r, to: o });
      },
      point() {
      }
    }, 20);
    let s = 0;
    if (i.length != this.visibleRanges.length)
      s = 12;
    else
      for (let r = 0; r < i.length && !(s & 8); r++) {
        let o = this.visibleRanges[r], l = i[r];
        (o.from != l.from || o.to != l.to) && (s |= 4, e && e.mapPos(o.from, -1) == l.from && e.mapPos(o.to, 1) == l.to || (s |= 8));
      }
    return this.visibleRanges = i, s;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || Ht(this.heightMap.lineAt(e, F.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return e >= this.viewportLines[0].top && e <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((t) => t.top <= e && t.bottom >= e) || Ht(this.heightMap.lineAt(this.scaler.fromDOM(e), F.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  getScrollOffset() {
    return (this.scrollParent == this.view.scrollDOM ? this.scrollParent.scrollTop : (this.scrollParent ? this.scrollParent.getBoundingClientRect().top : 0) - this.view.contentDOM.getBoundingClientRect().top) * this.scaleY;
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return Ht(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class Pi {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function Eu(n, e, t) {
  let i = [], s = n, r = 0;
  return $.spans(t, n, e, {
    span() {
    },
    point(o, l) {
      o > s && (i.push({ from: s, to: o }), r += o - s), s = l;
    }
  }, 20), s < e && (i.push({ from: s, to: e }), r += e - s), { total: r, ranges: i };
}
function Ci({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let s = 0; ; s++) {
    let { from: r, to: o } = e[s], l = o - r;
    if (i <= l)
      return r + i;
    i -= l;
  }
}
function Ai(n, e) {
  let t = 0;
  for (let { from: i, to: s } of n.ranges) {
    if (e <= s) {
      t += e - i;
      break;
    }
    t += s - i;
  }
  return t / n.total;
}
function Mu(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const co = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1,
  eq(n) {
    return n == this;
  }
};
function uo(n) {
  let e = n.facet(Os).filter((i) => typeof i != "function"), t = n.facet(Jn).filter((i) => typeof i != "function");
  return t.length && e.push($.join(t)), e;
}
class ir {
  constructor(e, t, i) {
    let s = 0, r = 0, o = 0;
    this.viewports = i.map(({ from: l, to: a }) => {
      let h = t.lineAt(l, F.ByPos, e, 0, 0).top, f = t.lineAt(a, F.ByPos, e, 0, 0).bottom;
      return s += f - h, { from: l, to: a, top: h, bottom: f, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - s) / (t.height - s);
    for (let l of this.viewports)
      l.domTop = o + (l.top - r) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), r = l.bottom;
  }
  toDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.top)
        return s + (e - i) * this.scale;
      if (e <= r.bottom)
        return r.domTop + (e - r.top);
      i = r.bottom, s = r.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.domTop)
        return i + (e - s) / this.scale;
      if (e <= r.domBottom)
        return r.top + (e - r.domTop);
      i = r.bottom, s = r.domBottom;
    }
  }
  eq(e) {
    return e instanceof ir ? this.scale == e.scale && this.viewports.length == e.viewports.length && this.viewports.every((t, i) => t.from == e.viewports[i].from && t.to == e.viewports[i].to) : !1;
  }
}
function Ht(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new xe(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((s) => Ht(s, e)) : n._content);
}
const Ri = /* @__PURE__ */ P.define({ combine: (n) => n.join(" ") }), Pn = /* @__PURE__ */ P.define({ combine: (n) => n.indexOf(!0) > -1 }), Cn = /* @__PURE__ */ rt.newName(), pa = /* @__PURE__ */ rt.newName(), ga = /* @__PURE__ */ rt.newName(), ma = { "&light": "." + pa, "&dark": "." + ga };
function An(n, e, t) {
  return new rt(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (s) => {
        if (s == "&")
          return n;
        if (!t || !t[s])
          throw new RangeError(`Unsupported selector: ${s}`);
        return t[s];
      }) : n + " " + i;
    }
  });
}
const $u = /* @__PURE__ */ An("." + Cn, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0,
    overflowAnchor: "none"
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // Issue #456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    userSelect: "none",
    // #1708
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#ddd"
  },
  ".cm-selectionHandle": {
    backgroundColor: "currentColor",
    width: "1.5px"
  },
  ".cm-selectionHandle-start::before, .cm-selectionHandle-end::before": {
    content: '""',
    backgroundColor: "inherit",
    borderRadius: "50%",
    width: "8px",
    height: "8px",
    position: "absolute",
    left: "-3.25px"
  },
  ".cm-selectionHandle-start::before": { top: "-8px" },
  ".cm-selectionHandle-end::before": { bottom: "-8px" },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    zIndex: 200
  },
  ".cm-gutters-before": { insetInlineStart: 0 },
  ".cm-gutters-after": { insetInlineEnd: 0 },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    border: "0px solid #ddd",
    "&.cm-gutters-before": { borderRightWidth: "1px" },
    "&.cm-gutters-after": { borderLeftWidth: "1px" }
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0,
    zIndex: 300
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  ".cm-panels-top": { top: "0" },
  ".cm-panels-bottom": { bottom: "0" },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-dialog": {
    padding: "2px 19px 4px 6px",
    position: "relative",
    "& label": { fontSize: "80%" }
  },
  ".cm-dialog-close": {
    position: "absolute",
    top: "3px",
    right: "4px",
    backgroundColor: "inherit",
    border: "none",
    font: "inherit",
    fontSize: "14px",
    padding: "0"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top",
    userSelect: "none"
  },
  ".cm-highlightSpace": {
    backgroundImage: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",
    backgroundPosition: "center"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, ma), Wu = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, zs = w.ie && w.ie_version <= 11;
class Du {
  constructor(e) {
    this.view = e, this.active = !1, this.editContext = null, this.selectionRange = new cc(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (w.ie && w.ie_version <= 11 || w.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && w.android && e.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(w.chrome && w.chrome_version < 126) && (this.editContext = new Bu(e), e.state.facet(Fe) && (e.contentDOM.editContext = this.editContext.editContext)), zs && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(e) {
    (e.type == "change" || !e.type) && !e.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, s = this.selectionRange;
    if (i.state.facet(Fe) ? i.root.activeElement != this.dom : !Yt(this.dom, s))
      return;
    let r = s.anchorNode && i.docView.tile.nearest(s.anchorNode);
    if (r && r.isWidget() && r.widget.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (w.ie && w.ie_version <= 11 || w.android && w.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    s.focusNode && Kt(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = ai(e.root);
    if (!t)
      return !1;
    let i = w.safari && e.root.nodeType == 11 && e.root.activeElement == this.dom && zu(this.view, t) || t;
    if (!i || this.selectionRange.eq(i))
      return !1;
    let s = Yt(this.dom, i);
    return s && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && dc(this.dom, i) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(i), s && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, Wu), zs && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), zs && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let s = () => {
        let r = this.delayedAndroidKey;
        r && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = r.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && r.force && qt(this.dom, r.key, r.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(s);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, s = !1;
    for (let r of e) {
      let o = this.readMutation(r);
      o && (o.typeOver && (s = !0), t == -1 ? { from: t, to: i } = o : (t = Math.min(o.from, t), i = Math.max(o.to, i)));
    }
    return { from: t, to: i, typeOver: s };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), s = this.selectionChanged && Yt(this.dom, this.selectionRange);
    if (e < 0 && !s)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let r = new eu(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: r.newSel ? r.newSel.main : null }, r;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, s = sa(this.view, t);
    return this.view.state == i && (t.domChanged || t.newSel && !ls(this.view.state.selection, t.newSel.main)) && this.view.update([]), s;
  }
  readMutation(e) {
    let t = this.view.docView.tile.nearest(e.target);
    if (!t || t.isWidget())
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "childList") {
      let i = po(t, e.previousSibling || e.target.previousSibling, -1), s = po(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: s ? t.posBefore(s) : t.posAtEnd,
        typeOver: !1
      };
    } else return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(e) {
    this.editContext && (this.editContext.update(e), e.startState.facet(Fe) != e.state.facet(Fe) && (e.view.contentDOM.editContext = e.state.facet(Fe) ? this.editContext.editContext : null));
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let s of this.scrollTargets)
      s.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
  }
}
function po(n, e, t) {
  for (; e; ) {
    let i = G.get(e);
    if (i && i.parent == n)
      return i;
    let s = e.parentNode;
    e = s != n.dom ? s : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function go(n, e) {
  let t = e.startContainer, i = e.startOffset, s = e.endContainer, r = e.endOffset, o = n.docView.domAtPos(n.state.selection.main.anchor, 1);
  return Kt(o.node, o.offset, s, r) && ([t, i, s, r] = [s, r, t, i]), { anchorNode: t, anchorOffset: i, focusNode: s, focusOffset: r };
}
function zu(n, e) {
  if (e.getComposedRanges) {
    let s = e.getComposedRanges(n.root)[0];
    if (s)
      return go(n, s);
  }
  let t = null;
  function i(s) {
    s.preventDefault(), s.stopImmediatePropagation(), t = s.getTargetRanges()[0];
  }
  return n.contentDOM.addEventListener("beforeinput", i, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", i, !0), t ? go(n, t) : null;
}
class Bu {
  constructor(e) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = /* @__PURE__ */ Object.create(null), this.composing = null, this.resetRange(e.state);
    let t = this.editContext = new window.EditContext({
      text: e.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, e.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(e.state.selection.main.head)
    });
    this.handlers.textupdate = (i) => {
      let s = e.state.selection.main, { anchor: r, head: o } = s, l = this.toEditorPos(i.updateRangeStart), a = this.toEditorPos(i.updateRangeEnd);
      e.inputState.composing >= 0 && !this.composing && (this.composing = { contextBase: i.updateRangeStart, editorBase: l, drifted: !1 });
      let h = a - l > i.text.length;
      l == this.from && r < this.from ? l = r : a == this.to && r > this.to && (a = r);
      let f = na(e.state.sliceDoc(l, a), i.text, (h ? s.from : s.to) - l, h ? "end" : null);
      if (!f) {
        let u = v.single(this.toEditorPos(i.selectionStart), this.toEditorPos(i.selectionEnd));
        ls(u, s) || e.dispatch({ selection: u, userEvent: "select" });
        return;
      }
      let c = {
        from: f.from + l,
        to: f.toA + l,
        insert: D.of(i.text.slice(f.from, f.toB).split(`
`))
      };
      if ((w.mac || w.android) && c.from == o - 1 && /^\. ?$/.test(i.text) && e.contentDOM.getAttribute("autocorrect") == "off" && (c = { from: l, to: a, insert: D.of([i.text.replace(".", " ")]) }), this.pendingContextChange = c, !e.state.readOnly) {
        let u = this.to - this.from + (c.to - c.from + c.insert.length);
        er(e, c, v.single(this.toEditorPos(i.selectionStart, u), this.toEditorPos(i.selectionEnd, u)));
      }
      this.pendingContextChange && (this.revertPending(e.state), this.setSelection(e.state)), c.from < c.to && !c.insert.length && e.inputState.composing >= 0 && !/[\\p{Alphabetic}\\p{Number}_]/.test(t.text.slice(Math.max(0, i.updateRangeStart - 1), Math.min(t.text.length, i.updateRangeStart + 1))) && this.handlers.compositionend(i);
    }, this.handlers.characterboundsupdate = (i) => {
      let s = [], r = null;
      for (let o = this.toEditorPos(i.rangeStart), l = this.toEditorPos(i.rangeEnd); o < l; o++) {
        let a = e.coordsForChar(o);
        r = a && new DOMRect(a.left, a.top, a.right - a.left, a.bottom - a.top) || r || new DOMRect(), s.push(r);
      }
      t.updateCharacterBounds(i.rangeStart, s);
    }, this.handlers.textformatupdate = (i) => {
      let s = [];
      for (let r of i.getTextFormats()) {
        let o = r.underlineStyle, l = r.underlineThickness;
        if (!/none/i.test(o) && !/none/i.test(l)) {
          let a = this.toEditorPos(r.rangeStart), h = this.toEditorPos(r.rangeEnd);
          if (a < h) {
            let f = `text-decoration: underline ${/^[a-z]/.test(o) ? o + " " : o == "Dashed" ? "dashed " : o == "Squiggle" ? "wavy " : ""}${/thin/i.test(l) ? 1 : 2}px`;
            s.push(B.mark({ attributes: { style: f } }).range(a, h));
          }
        }
      }
      e.dispatch({ effects: Ul.of(B.set(s)) });
    }, this.handlers.compositionstart = () => {
      e.inputState.composing < 0 && (e.inputState.composing = 0, e.inputState.compositionFirstChange = !0);
    }, this.handlers.compositionend = () => {
      if (e.inputState.composing = -1, e.inputState.compositionFirstChange = null, this.composing) {
        let { drifted: i } = this.composing;
        this.composing = null, i && this.reset(e.state);
      }
    };
    for (let i in this.handlers)
      t.addEventListener(i, this.handlers[i]);
    this.measureReq = { read: (i) => {
      let s = ai(i.root);
      s && s.rangeCount && this.editContext.updateSelectionBounds(s.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(e) {
    let t = 0, i = !1, s = this.pendingContextChange;
    return e.changes.iterChanges((r, o, l, a, h) => {
      if (i)
        return;
      let f = h.length - (o - r);
      if (s && o >= s.to)
        if (s.from == r && s.to == o && s.insert.eq(h)) {
          s = this.pendingContextChange = null, t += f, this.to += f;
          return;
        } else
          s = null, this.revertPending(e.state);
      if (r += t, o += t, o <= this.from)
        this.from += f, this.to += f;
      else if (r < this.to) {
        if (r < this.from || o > this.to || this.to - this.from + h.length > 3e4) {
          i = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(r), this.toContextPos(o), h.toString()), this.to += f;
      }
      t += f;
    }), s && !i && this.revertPending(e.state), !i;
  }
  update(e) {
    let t = this.pendingContextChange, i = e.startState.selection.main;
    this.composing && (this.composing.drifted || !e.changes.touchesRange(i.from, i.to) && e.transactions.some((s) => !s.isUserEvent("input.type") && s.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = e.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(e) || !this.rangeIsValid(e.state) ? (this.pendingContextChange = null, this.reset(e.state)) : (e.docChanged || e.selectionSet || t) && this.setSelection(e.state), (e.geometryChanged || e.docChanged || e.selectionSet) && e.view.requestMeasure(this.measureReq);
  }
  resetRange(e) {
    let { head: t } = e.selection.main;
    this.from = Math.max(
      0,
      t - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      e.doc.length,
      t + 1e4
      /* CxVp.Margin */
    );
  }
  reset(e) {
    this.resetRange(e), this.editContext.updateText(0, this.editContext.text.length, e.doc.sliceString(this.from, this.to)), this.setSelection(e);
  }
  revertPending(e) {
    let t = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(t.from), this.toContextPos(t.from + t.insert.length), e.doc.sliceString(t.from, t.to));
  }
  setSelection(e) {
    let { main: t } = e.selection, i = this.toContextPos(Math.max(this.from, Math.min(this.to, t.anchor))), s = this.toContextPos(t.head);
    (this.editContext.selectionStart != i || this.editContext.selectionEnd != s) && this.editContext.updateSelection(i, s);
  }
  rangeIsValid(e) {
    let { head: t } = e.selection.main;
    return !(this.from > 0 && t - this.from < 500 || this.to < e.doc.length && this.to - t < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(e, t = this.to - this.from) {
    e = Math.min(e, t);
    let i = this.composing;
    return i && i.drifted ? i.editorBase + (e - i.contextBase) : e + this.from;
  }
  toContextPos(e) {
    let t = this.composing;
    return t && t.drifted ? t.contextBase + (e - t.editorBase) : e - this.from;
  }
  destroy() {
    for (let e in this.handlers)
      this.editContext.removeEventListener(e, this.handlers[e]);
  }
}
class A {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return !!this.inputState && this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return !!this.inputState && this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    var t;
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: i } = e;
    this.dispatchTransactions = e.dispatchTransactions || i && ((s) => s.forEach((r) => i(r, this))) || ((s) => this.update(s)), this.dispatch = this.dispatch.bind(this), this._root = e.root || uc(e.parent) || document, this.viewState = new fo(this, e.state || N.create(e)), e.scrollTo && e.scrollTo.is(vi) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(vt).map((s) => new qs(s));
    for (let s of this.plugins)
      s.update(this);
    this.observer = new Du(this), this.inputState = new nu(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Yr(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), !((t = document.fonts) === null || t === void 0) && t.ready && document.fonts.ready.then(() => {
      this.viewState.mustMeasureContent = "refresh", this.requestMeasure();
    });
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof te ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, s, r = this.state;
    for (let u of e) {
      if (u.startState != r)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      r = u.state;
    }
    if (this.destroyed) {
      this.viewState.state = r;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    e.some((u) => u.annotation(fa)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = ca(r, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, f = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), f = this.observer.readChange(), (f && !this.state.doc.eq(r.doc) || !this.state.selection.eq(r.selection)) && (f = null)) : this.observer.clear(), r.facet(N.phrases) != this.state.facet(N.phrases))
      return this.setState(r);
    s = ns.create(this, r, e), s.flags |= l;
    let c = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let u of e) {
        if (c && (c = c.map(u.changes)), u.scrollIntoView) {
          let { main: d } = u.state.selection, { x: p, y: g } = this.state.facet(A.cursorScrollMargin);
          c = new Et(d.empty ? d : v.cursor(d.head, d.head > d.anchor ? -1 : 1), "nearest", "nearest", g, p);
        }
        for (let d of u.effects)
          d.is(vi) && (c = d.value.clip(this.state));
      }
      this.viewState.update(s, c), this.bidiCache = hs.update(this.bidiCache, s.changes), s.empty || (this.updatePlugins(s), this.inputState.update(s)), t = this.docView.update(s), this.state.facet(Ut) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((u) => u.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (s.startState.facet(Ri) != s.state.facet(Ri) && (this.viewState.mustMeasureContent = !0), (t || i || c || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), t && this.docViewUpdate(), !s.empty)
      for (let u of this.state.facet(wn))
        try {
          u(s);
        } catch (d) {
          De(this.state, d, "update listener");
        }
    (a || f) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), f && !sa(this, f) && h.force && qt(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new fo(this, e), this.plugins = e.facet(vt).map((i) => new qs(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new Yr(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(vt), i = e.state.facet(vt);
    if (t != i) {
      let s = [];
      for (let r of i) {
        let o = t.indexOf(r);
        if (o < 0)
          s.push(new qs(r));
        else {
          let l = this.plugins[o];
          l.mustUpdate = e, s.push(l);
        }
      }
      for (let r of this.plugins)
        r.mustUpdate != e && r.destroy(this);
      this.plugins = s, this.pluginMap.clear();
    } else
      for (let s of this.plugins)
        s.mustUpdate = e;
    for (let s = 0; s < this.plugins.length; s++)
      this.plugins[s].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let e of this.plugins) {
      let t = e.value;
      if (t && t.docViewUpdate)
        try {
          t.docViewUpdate(this);
        } catch (i) {
          De(this.state, i, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.viewState.scrollParent, s = this.viewState.getScrollOffset(), { scrollAnchorPos: r, scrollAnchorHeight: o } = this.viewState;
    Math.abs(s - this.viewState.scrollOffset) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (Rl(i || this.win))
            r = -1, o = this.viewState.heightMap.height;
          else {
            let d = this.viewState.scrollAnchorAt(s);
            r = d.from, o = d.top;
          }
        this.updateState = 1;
        let a = this.viewState.measure();
        if (!a && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (l > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let f = h.map((d) => {
          try {
            return d.read(this);
          } catch (p) {
            return De(this.state, p), mo;
          }
        }), c = ns.create(this, this.state, []), u = !1;
        c.flags |= a, t ? t.flags |= a : t = c, this.updateState = 2, c.empty || (this.updatePlugins(c), this.inputState.update(c), this.updateAttrs(), u = this.docView.update(c), u && this.docViewUpdate());
        for (let d = 0; d < h.length; d++)
          if (f[d] != mo)
            try {
              let p = h[d];
              p.write && p.write(f[d], this);
            } catch (p) {
              De(this.state, p);
            }
        if (u && this.docView.updateSelection(!0), !c.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let p = ((r < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(r).top) - o) / this.scaleY;
              if ((p > 1 || p < -1) && !(w.ios && this.inputState.lastIOSMomentumScroll > Date.now() - 100) && (i == this.scrollDOM || this.hasFocus || Math.max(this.inputState.lastWheelEvent, this.inputState.lastTouchTime) > Date.now() - 100)) {
                s = s + p, i ? i.scrollTop += p : this.win.scrollBy(0, p), o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let l of this.state.facet(wn))
        l(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return Cn + " " + (this.state.facet(Pn) ? ga : pa) + " " + this.state.facet(Ri);
  }
  updateAttrs() {
    let e = Oo(this, Hl, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      writingsuggestions: "false",
      translate: "no",
      contenteditable: this.state.facet(Fe) ? "true" : "false",
      class: "cm-content",
      style: `${w.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), Oo(this, Kn, t);
    let i = this.observer.ignore(() => {
      let s = Fr(this.contentDOM, this.contentAttrs, t), r = Fr(this.dom, this.editorAttrs, e);
      return s || r;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let s of i.effects)
        if (s.is(A.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let r = this.announceDOM.appendChild(document.createElement("div"));
          r.textContent = s.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(Ut);
    let e = this.state.facet(A.cspNonce);
    rt.mount(this.root, this.styleModules.concat($u).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.plugin != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.plugin == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt)) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line break, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return Ws(this, e, Kr(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return Ws(this, e, Kr(this, e, t, (i) => Hc(this, e.head, i)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, t) {
    let i = this.bidiSpans(e), s = this.textDirectionAt(e.from), r = i[t ? i.length - 1 : 0];
    return v.cursor(r.side(t, s) + e.from, r.forward(!t, s) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return Uc(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return Ws(this, e, Gc(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e, t = 1) {
    return this.docView.domAtPos(e, t);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    this.readMeasured();
    let i = Tn(this, e, t);
    return i && i.pos;
  }
  posAndSideAtCoords(e, t = !0) {
    return this.readMeasured(), Tn(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.state.doc.lineAt(e), s = this.bidiSpans(i), r = s[We.find(s, e - i.from, -1, t)];
    return this.docView.coordsAt(e, t, r.dir == H.RTL);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(Xl) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > Iu)
      return Dl(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let r of this.bidiCache)
      if (r.from == e.from && r.dir == t && (r.fresh || Wl(r.isolates, i = Hr(this, e))))
        return r.order;
    i || (i = Hr(this, e));
    let s = Sc(e.text, t, i);
    return this.bidiCache.push(new hs(e.from, e.to, t, i, !0, s)), s;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || w.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      Al(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    var i, s, r, o;
    return vi.of(new Et(typeof e == "number" ? v.cursor(e) : e, (i = t.y) !== null && i !== void 0 ? i : "nearest", (s = t.x) !== null && s !== void 0 ? s : "nearest", (r = t.yMargin) !== null && r !== void 0 ? r : 5, (o = t.xMargin) !== null && o !== void 0 ? o : 5));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return vi.of(new Et(v.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(e) {
    e == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof e == "boolean" ? this.inputState.tabFocusMode = e ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + e);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return ge.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return ge.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = rt.newName(), s = [Ri.of(i), Ut.of(An(`.${i}`, e))];
    return t && t.dark && s.push(Pn.of(!0)), s;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return ci.lowest(Ut.of(An("." + Cn, e, ma)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), s = i && G.get(i) || G.get(e);
    return ((t = s == null ? void 0 : s.root) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
A.styleModule = Ut;
A.inputHandler = Vl;
A.clipboardInputFilter = Zn;
A.clipboardOutputFilter = Yn;
A.scrollHandler = jl;
A.focusChangeEffect = _l;
A.perLineTextDirection = Xl;
A.exceptionSink = Ll;
A.updateListener = wn;
A.editable = Fe;
A.mouseSelectionStyle = Nl;
A.dragMovesSelection = Il;
A.clickAddsSelectionRange = Bl;
A.decorations = Os;
A.blockWrappers = Gl;
A.outerDecorations = Jn;
A.atomicRanges = pi;
A.bidiIsolatedRanges = Zl;
A.cursorScrollMargin = /* @__PURE__ */ P.define({
  combine: (n) => {
    let e = 5, t = 5;
    for (let i of n)
      typeof i == "number" ? e = t = i : { x: e, y: t } = i;
    return { x: e, y: t };
  }
});
A.scrollMargins = Yl;
A.darkTheme = Pn;
A.cspNonce = /* @__PURE__ */ P.define({ combine: (n) => n.length ? n[0] : "" });
A.contentAttributes = Kn;
A.editorAttributes = Hl;
A.lineWrapping = /* @__PURE__ */ A.contentAttributes.of({ class: "cm-lineWrapping" });
A.announce = /* @__PURE__ */ j.define();
const Iu = 4096, mo = {};
class hs {
  constructor(e, t, i, s, r, o) {
    this.from = e, this.to = t, this.dir = i, this.isolates = s, this.fresh = r, this.order = o;
  }
  static update(e, t) {
    if (t.empty && !e.some((r) => r.fresh))
      return e;
    let i = [], s = e.length ? e[e.length - 1].dir : H.LTR;
    for (let r = Math.max(0, e.length - 10); r < e.length; r++) {
      let o = e[r];
      o.dir == s && !t.touchesRange(o.from, o.to) && i.push(new hs(t.mapPos(o.from, 1), t.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function Oo(n, e, t) {
  for (let i = n.state.facet(e), s = i.length - 1; s >= 0; s--) {
    let r = i[s], o = typeof r == "function" ? r(n) : r;
    o && Un(o, t);
  }
  return t;
}
const Nu = w.mac ? "mac" : w.windows ? "win" : w.linux ? "linux" : "key";
function Lu(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let s, r, o, l;
  for (let a = 0; a < t.length - 1; ++a) {
    const h = t[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      s = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      r = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? l = !0 : r = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return s && (i = "Alt-" + i), r && (i = "Ctrl-" + i), l && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function qi(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const Vu = /* @__PURE__ */ ci.default(/* @__PURE__ */ A.domEventHandlers({
  keydown(n, e) {
    return ba(ya(e.state), n, e, "editor");
  }
})), Oa = /* @__PURE__ */ P.define({ enables: Vu }), yo = /* @__PURE__ */ new WeakMap();
function ya(n) {
  let e = n.facet(Oa), t = yo.get(e);
  return t || yo.set(e, t = Xu(e.reduce((i, s) => i.concat(s), []))), t;
}
function Cp(n, e, t) {
  return ba(ya(n.state), e, n, t);
}
let tt = null;
const _u = 4e3;
function Xu(n, e = Nu) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), s = (o, l) => {
    let a = i[o];
    if (a == null)
      i[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, r = (o, l, a, h, f) => {
    var c, u;
    let d = t[o] || (t[o] = /* @__PURE__ */ Object.create(null)), p = l.split(/ (?!$)/).map((O) => Lu(O, e));
    for (let O = 1; O < p.length; O++) {
      let b = p.slice(0, O).join(" ");
      s(b, !0), d[b] || (d[b] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(Q) => {
          let R = tt = { view: Q, prefix: b, scope: o };
          return setTimeout(() => {
            tt == R && (tt = null);
          }, _u), !0;
        }]
      });
    }
    let g = p.join(" ");
    s(g, !1);
    let m = d[g] || (d[g] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((u = (c = d._any) === null || c === void 0 ? void 0 : c.run) === null || u === void 0 ? void 0 : u.slice()) || []
    });
    a && m.run.push(a), h && (m.preventDefault = !0), f && (m.stopPropagation = !0);
  };
  for (let o of n) {
    let l = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of l) {
        let f = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        f._any || (f._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: c } = o;
        for (let u in f)
          f[u].run.push((d) => c(d, Rn));
      }
    let a = o[e] || o.key;
    if (a)
      for (let h of l)
        r(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && r(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return t;
}
let Rn = null;
function ba(n, e, t, i) {
  Rn = e;
  let s = rc(e), r = fl(s, 0), o = Vf(r) == s.length && s != " ", l = "", a = !1, h = !1, f = !1;
  tt && tt.view == t && tt.scope == i && (l = tt.prefix + " ", oa.indexOf(e.keyCode) < 0 && (h = !0, tt = null));
  let c = /* @__PURE__ */ new Set(), u = (m) => {
    if (m) {
      for (let O of m.run)
        if (!c.has(O) && (c.add(O), O(t)))
          return m.stopPropagation && (f = !0), !0;
      m.preventDefault && (m.stopPropagation && (f = !0), h = !0);
    }
    return !1;
  }, d = n[i], p, g;
  return d && (u(d[l + qi(s, e, !o)]) ? a = !0 : o && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(w.windows && e.ctrlKey && e.altKey) && // Alt-combinations on macOS tend to be typed characters
  !(w.mac && e.altKey && !(e.ctrlKey || e.metaKey)) && (p = ot[e.keyCode]) && p != s ? (u(d[l + qi(p, e, !0)]) || e.shiftKey && (g = oi[e.keyCode]) != s && g != p && u(d[l + qi(g, e, !1)])) && (a = !0) : o && e.shiftKey && u(d[l + qi(s, e, !0)]) && (a = !0), !a && u(d._any) && (a = !0)), h && (a = !0), a && f && e.stopPropagation(), Rn = null, a;
}
class pt {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, s, r) {
    this.className = e, this.left = t, this.top = i, this.width = s, this.height = r;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let s = e.coordsAtPos(i.head, i.assoc || 1);
      if (!s)
        return [];
      let r = Sa(e);
      return [new pt(t, s.left - r.left, s.top - r.top, null, s.bottom - s.top)];
    } else
      return Fu(e, t, i);
  }
}
function Sa(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == H.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function bo(n, e, t, i) {
  let s = n.coordsAtPos(e, t * 2);
  if (!s)
    return i;
  let r = n.dom.getBoundingClientRect(), o = (s.top + s.bottom) / 2, l = n.posAtCoords({ x: r.left + 1, y: o }), a = n.posAtCoords({ x: r.right - 1, y: o });
  return l == null || a == null ? i : { from: Math.max(i.from, Math.min(l, a)), to: Math.min(i.to, Math.max(l, a)) };
}
function Fu(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), s = Math.min(t.to, n.viewport.to), r = n.textDirection == H.LTR, o = n.contentDOM, l = o.getBoundingClientRect(), a = Sa(n), h = o.querySelector(".cm-line"), f = h && window.getComputedStyle(h), c = l.left + (f ? parseInt(f.paddingLeft) + Math.min(0, parseInt(f.textIndent)) : 0), u = l.right - (f ? parseInt(f.paddingRight) : 0), d = vn(n, i, 1), p = vn(n, s, -1), g = d.type == ie.Text ? d : null, m = p.type == ie.Text ? p : null;
  if (g && (n.lineWrapping || d.widgetLineBreaks) && (g = bo(n, i, 1, g)), m && (n.lineWrapping || p.widgetLineBreaks) && (m = bo(n, s, -1, m)), g && m && g.from == m.from && g.to == m.to)
    return b(Q(t.from, t.to, g));
  {
    let k = g ? Q(t.from, null, g) : R(d, !1), T = m ? Q(null, t.to, m) : R(p, !0), x = [];
    return (g || d).to < (m || p).from - (g && m ? 1 : 0) || d.widgetLineBreaks > 1 && k.bottom + n.defaultLineHeight / 2 < T.top ? x.push(O(c, k.bottom, u, T.top)) : k.bottom < T.top && n.elementAtHeight((k.bottom + T.top) / 2).type == ie.Text && (k.bottom = T.top = (k.bottom + T.top) / 2), b(k).concat(x).concat(b(T));
  }
  function O(k, T, x, W) {
    return new pt(e, k - a.left, T - a.top, Math.max(0, x - k), W - T);
  }
  function b({ top: k, bottom: T, horizontal: x }) {
    let W = [];
    for (let M = 0; M < x.length; M += 2)
      W.push(O(x[M], k, x[M + 1], T));
    return W;
  }
  function Q(k, T, x) {
    let W = 1e9, M = -1e9, V = [];
    function q(z, X, re, ue, Qe) {
      let K = n.coordsAtPos(z, z == x.to ? -2 : 2), me = n.coordsAtPos(re, re == x.from ? 2 : -2);
      !K || !me || (W = Math.min(K.top, me.top, W), M = Math.max(K.bottom, me.bottom, M), Qe == H.LTR ? V.push(r && X ? c : K.left, r && ue ? u : me.right) : V.push(!r && ue ? c : me.left, !r && X ? u : K.right));
    }
    let C = k ?? x.from, I = T ?? x.to;
    for (let z of n.visibleRanges)
      if (z.to > C && z.from < I)
        for (let X = Math.max(z.from, C), re = Math.min(z.to, I); ; ) {
          let ue = n.state.doc.lineAt(X);
          for (let Qe of n.bidiSpans(ue)) {
            let K = Qe.from + ue.from, me = Qe.to + ue.from;
            if (K >= re)
              break;
            me > X && q(Math.max(K, X), k == null && K <= C, Math.min(me, re), T == null && me >= I, Qe.dir);
          }
          if (X = ue.to + 1, X >= re)
            break;
        }
    return V.length == 0 && q(C, k == null, I, T == null, n.textDirection), { top: W, bottom: M, horizontal: V };
  }
  function R(k, T) {
    let x = l.top + (T ? k.top : k.bottom);
    return { top: x, bottom: x, horizontal: [] };
  }
}
function ju(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class Uu {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(_i) != e.state.facet(_i) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(e) {
    this.layer.updateOnDocViewUpdate !== !1 && e.requestMeasure(this.measureReq);
  }
  setOrder(e) {
    let t = 0, i = e.facet(_i);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !ju(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let s of e)
        s.update && t && s.constructor && this.drawn[i].constructor && s.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(s.draw(), t);
      for (; t; ) {
        let s = t.nextSibling;
        t.remove(), t = s;
      }
      this.drawn = e, w.webkit && (this.dom.style.display = this.dom.firstChild ? "" : "none");
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const _i = /* @__PURE__ */ P.define();
function xa(n) {
  return [
    ge.define((e) => new Uu(e, n)),
    _i.of(n)
  ];
}
const Bt = /* @__PURE__ */ P.define({
  combine(n) {
    return gs(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0,
      iosSelectionHandles: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function Ap(n = {}) {
  return [
    Bt.of(n),
    Hu,
    Gu,
    Yu,
    Fl.of(!0)
  ];
}
function wa(n) {
  return n.startState.facet(Bt) != n.state.facet(Bt);
}
const Hu = /* @__PURE__ */ xa({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(Bt), i = [];
    for (let s of e.selection.ranges) {
      let r = s == e.selection.main;
      if (s.empty || t.drawRangeCursor && !(r && w.ios && t.iosSelectionHandles)) {
        let o = r ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = s.empty ? s : v.cursor(s.head, s.assoc);
        for (let a of pt.forRange(n, o, l))
          i.push(a);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = wa(n);
    return t && So(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    So(e.state, n);
  },
  class: "cm-cursorLayer"
});
function So(n, e) {
  e.style.animationDuration = n.facet(Bt).cursorBlinkRate + "ms";
}
const Gu = /* @__PURE__ */ xa({
  above: !1,
  markers(n) {
    let e = [], { main: t, ranges: i } = n.state.selection;
    for (let s of i)
      if (!s.empty)
        for (let r of pt.forRange(n, "cm-selectionBackground", s))
          e.push(r);
    if (w.ios && !t.empty && n.state.facet(Bt).iosSelectionHandles) {
      for (let s of pt.forRange(n, "cm-selectionHandle cm-selectionHandle-start", v.cursor(t.from, 1)))
        e.push(s);
      for (let s of pt.forRange(n, "cm-selectionHandle cm-selectionHandle-end", v.cursor(t.to, 1)))
        e.push(s);
    }
    return e;
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || wa(n);
  },
  class: "cm-selectionLayer"
}), Zu = w.gecko && w.gecko_version >= 153 ? "#ffffff01" : "transparent", Yu = /* @__PURE__ */ ci.highest(/* @__PURE__ */ A.theme({
  ".cm-line": {
    "& ::selection, &::selection": { backgroundColor: `${Zu} !important` },
    caretColor: "transparent !important"
  },
  ".cm-content": {
    caretColor: "transparent !important",
    "& :focus": {
      caretColor: "initial !important",
      "&::selection, & ::selection": {
        backgroundColor: "Highlight !important"
      }
    }
  }
}));
function xo(n, e, t, i, s) {
  e.lastIndex = 0;
  for (let r = n.iterRange(t, i), o = t, l; !r.next().done; o += r.value.length)
    if (!r.lineBreak)
      for (; l = e.exec(r.value); )
        s(o + l.index, l);
}
function Ku(n, e) {
  let t = n.visibleRanges;
  if (t.length == 1 && t[0].from == n.viewport.from && t[0].to == n.viewport.to)
    return t;
  let i = [];
  for (let { from: s, to: r } of t)
    s = Math.max(n.state.doc.lineAt(s).from, s - e), r = Math.min(n.state.doc.lineAt(r).to, r + e), i.length && i[i.length - 1].to >= s ? i[i.length - 1].to = r : i.push({ from: s, to: r });
  return i;
}
class Ju {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: i, decorate: s, boundary: r, maxLength: o = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, s)
      this.addMatch = (l, a, h, f) => s(f, h, h + l[0].length, l, a);
    else if (typeof i == "function")
      this.addMatch = (l, a, h, f) => {
        let c = i(l, a, h);
        c && f(h, h + l[0].length, c);
      };
    else if (i)
      this.addMatch = (l, a, h, f) => f(h, h + l[0].length, i);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = r, this.maxLength = o;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new $t(), i = t.add.bind(t);
    for (let { from: s, to: r } of Ku(e, this.maxLength))
      xo(e.state.doc, this.regexp, s, r, (o, l) => this.addMatch(l, e, o, i));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let i = 1e9, s = -1;
    return e.docChanged && e.changes.iterChanges((r, o, l, a) => {
      a >= e.view.viewport.from && l <= e.view.viewport.to && (i = Math.min(l, i), s = Math.max(a, s));
    }), e.viewportMoved || s - i > 1e3 ? this.createDeco(e.view) : s > -1 ? this.updateRange(e.view, t.map(e.changes), i, s) : t;
  }
  updateRange(e, t, i, s) {
    for (let r of e.visibleRanges) {
      let o = Math.max(r.from, i), l = Math.min(r.to, s);
      if (l >= o) {
        let a = e.state.doc.lineAt(o), h = a.to < l ? e.state.doc.lineAt(l) : a, f = Math.max(r.from, a.from), c = Math.min(r.to, h.to);
        if (this.boundary) {
          for (; o > a.from; o--)
            if (this.boundary.test(a.text[o - 1 - a.from])) {
              f = o;
              break;
            }
          for (; l < h.to; l++)
            if (this.boundary.test(h.text[l - h.from])) {
              c = l;
              break;
            }
        }
        let u = [], d, p = (g, m, O) => u.push(O.range(g, m));
        if (a == h)
          for (this.regexp.lastIndex = f - a.from; (d = this.regexp.exec(a.text)) && d.index < c - a.from; )
            this.addMatch(d, e, d.index + a.from, p);
        else
          xo(e.state.doc, this.regexp, f, c, (g, m) => this.addMatch(m, e, g, p));
        t = t.update({ filterFrom: f, filterTo: c, filter: (g, m) => g < f || m > c, add: u });
      }
    }
    return t;
  }
}
const qn = /x/.unicode != null ? "gu" : "g", ed = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, qn), td = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let Bs = null;
function id() {
  var n;
  if (Bs == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    Bs = ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
  }
  return Bs || !1;
}
const Xi = /* @__PURE__ */ P.define({
  combine(n) {
    let e = gs(n, {
      render: null,
      specialChars: ed,
      addSpecialChars: null
    });
    return (e.replaceTabs = !id()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, qn)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, qn)), e;
  }
});
function Rp(n = {}) {
  return [Xi.of(n), sd()];
}
let wo = null;
function sd() {
  return wo || (wo = ge.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = B.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(Xi)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new Ju({
        regexp: n.specialChars,
        decoration: (e, t, i) => {
          let { doc: s } = t.state, r = fl(e[0], 0);
          if (r == 9) {
            let o = s.lineAt(i), l = t.state.tabSize, a = kl(o.text, l, i - o.from);
            return B.replace({
              widget: new ld((l - a % l) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[r] || (this.decorationCache[r] = B.replace({ widget: new od(n, r) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let e = n.state.facet(Xi);
      n.startState.facet(Xi) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const nd = "•";
function rd(n) {
  return n >= 32 ? nd : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class od extends St {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = rd(this.code), i = e.state.phrase("Control character") + " " + (td[this.code] || "0x" + this.code.toString(16)), s = this.options.render && this.options.render(this.code, i, t);
    if (s)
      return s;
    let r = document.createElement("span");
    return r.textContent = t, r.title = i, r.setAttribute("aria-label", i), r.className = "cm-specialChar", r;
  }
  ignoreEvent() {
    return !1;
  }
}
class ld extends St {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
function qp() {
  return hd;
}
const ad = /* @__PURE__ */ B.line({ class: "cm-activeLine" }), hd = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.decorations = this.getDeco(n);
  }
  update(n) {
    (n.docChanged || n.selectionSet) && (this.decorations = this.getDeco(n.view));
  }
  getDeco(n) {
    let e = -1, t = [];
    for (let i of n.state.selection.ranges) {
      let s = n.lineBlockAt(i.head);
      s.from > e && (t.push(ad.range(s.from)), e = s.from);
    }
    return B.set(t);
  }
}, {
  decorations: (n) => n.decorations
}), ko = /* @__PURE__ */ P.define({
  combine(n) {
    let e, t;
    for (let i of n)
      e = e || i.topContainer, t = t || i.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function Ep(n, e) {
  let t = n.plugin(ka), i = t ? t.specs.indexOf(e) : -1;
  return i > -1 ? t.panels[i] : null;
}
const ka = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(En), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(n));
    let e = n.state.facet(ko);
    this.top = new Ei(n, !0, e.topContainer), this.bottom = new Ei(n, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(n) {
    let e = n.state.facet(ko);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new Ei(n.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new Ei(n.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = n.state.facet(En);
    if (t != this.input) {
      let i = t.filter((a) => a), s = [], r = [], o = [], l = [];
      for (let a of i) {
        let h = this.specs.indexOf(a), f;
        h < 0 ? (f = a(n.view), l.push(f)) : (f = this.panels[h], f.update && f.update(n)), s.push(f), (f.top ? r : o).push(f);
      }
      this.specs = i, this.panels = s, this.top.sync(r), this.bottom.sync(o);
      for (let a of l)
        a.dom.classList.add("cm-panel"), a.mount && a.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => A.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class Ei {
  constructor(e, t, i) {
    this.view = e, this.top = t, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = vo(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = vo(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function vo(n) {
  let e = n.nextSibling;
  return n.remove(), e;
}
const En = /* @__PURE__ */ P.define({
  enables: ka
});
function Mp(n, e) {
  let t, i = new Promise((o) => t = o), s = (o) => fd(o, e, t);
  n.state.field(Is, !1) ? n.dispatch({ effects: va.of(s) }) : n.dispatch({ effects: j.appendConfig.of(Is.init(() => [s])) });
  let r = Ta.of(s);
  return { close: r, result: i.then((o) => ((n.win.queueMicrotask || ((a) => n.win.setTimeout(a, 10)))(() => {
    n.state.field(Is).indexOf(s) > -1 && n.dispatch({ effects: r });
  }), o)) };
}
const Is = /* @__PURE__ */ Ye.define({
  create() {
    return [];
  },
  update(n, e) {
    for (let t of e.effects)
      t.is(va) ? n = [t.value].concat(n) : t.is(Ta) && (n = n.filter((i) => i != t.value));
    return n;
  },
  provide: (n) => En.computeN([n], (e) => e.field(n))
}), va = /* @__PURE__ */ j.define(), Ta = /* @__PURE__ */ j.define();
function fd(n, e, t) {
  let i = e.content ? e.content(n, () => o(null)) : null;
  if (!i) {
    if (i = wt("form"), e.input) {
      let l = wt("input", e.input);
      /^(text|password|number|email|tel|url)$/.test(l.type) && l.classList.add("cm-textfield"), l.name || (l.name = "input"), i.appendChild(wt("label", (e.label || "") + ": ", l));
    } else
      i.appendChild(document.createTextNode(e.label || ""));
    i.appendChild(document.createTextNode(" ")), i.appendChild(wt("button", { class: "cm-button", type: "submit" }, e.submitLabel || "OK"));
  }
  let s = i.nodeName == "FORM" ? [i] : i.querySelectorAll("form");
  for (let l = 0; l < s.length; l++) {
    let a = s[l];
    a.addEventListener("keydown", (h) => {
      h.keyCode == 27 ? (h.preventDefault(), o(null)) : h.keyCode == 13 && (h.preventDefault(), o(a));
    }), a.addEventListener("submit", (h) => {
      h.preventDefault(), o(a);
    });
  }
  let r = wt("div", i, wt("button", {
    onclick: () => o(null),
    "aria-label": n.state.phrase("close"),
    class: "cm-dialog-close",
    type: "button"
  }, ["×"]));
  e.class && (r.className = e.class), r.classList.add("cm-dialog");
  function o(l) {
    r.contains(r.ownerDocument.activeElement) && n.focus(), t(l);
  }
  return {
    dom: r,
    top: e.top,
    mount: () => {
      if (e.focus) {
        let l;
        typeof e.focus == "string" ? l = i.querySelector(e.focus) : l = i.querySelector("input") || i.querySelector("button"), l && "select" in l ? l.select() : l && "focus" in l && l.focus();
      }
    }
  };
}
class at extends nt {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
at.prototype.elementClass = "";
at.prototype.toDOM = void 0;
at.prototype.mapMode = le.TrackBefore;
at.prototype.startSide = at.prototype.endSide = -1;
at.prototype.point = !0;
const Fi = /* @__PURE__ */ P.define(), cd = /* @__PURE__ */ P.define(), ji = /* @__PURE__ */ P.define(), To = /* @__PURE__ */ P.define({
  combine: (n) => n.some((e) => e)
});
function ud(n) {
  return [
    dd
  ];
}
const dd = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.view = n, this.domAfter = null, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters cm-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(ji).map((e) => new Po(n, e)), this.fixed = !n.state.facet(To);
    for (let e of this.gutters)
      e.config.side == "after" ? this.getDOMAfter().appendChild(e.dom) : this.dom.appendChild(e.dom);
    this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  getDOMAfter() {
    return this.domAfter || (this.domAfter = document.createElement("div"), this.domAfter.className = "cm-gutters cm-gutters-after", this.domAfter.setAttribute("aria-hidden", "true"), this.domAfter.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.domAfter.style.position = this.fixed ? "sticky" : "", this.view.scrollDOM.appendChild(this.domAfter)), this.domAfter;
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    if (n.geometryChanged) {
      let e = this.view.contentHeight / this.view.scaleY + "px";
      this.dom.style.minHeight = e, this.domAfter && (this.domAfter.style.minHeight = e);
    }
    this.view.state.facet(To) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && (this.dom.remove(), this.domAfter && this.domAfter.remove());
    let t = $.iter(this.view.state.facet(Fi), this.view.viewport.from), i = [], s = this.gutters.map((r) => new pd(r, this.view.viewport, -this.view.documentPadding.top));
    for (let r of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(r.type)) {
        let o = !0;
        for (let l of r.type)
          if (l.type == ie.Text && o) {
            Mn(t, i, l.from);
            for (let a of s)
              a.line(this.view, l, i);
            o = !1;
          } else if (l.widget)
            for (let a of s)
              a.widget(this.view, l);
      } else if (r.type == ie.Text) {
        Mn(t, i, r.from);
        for (let o of s)
          o.line(this.view, r, i);
      } else if (r.widget)
        for (let o of s)
          o.widget(this.view, r);
    for (let r of s)
      r.finish();
    n && (this.view.scrollDOM.insertBefore(this.dom, e), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter));
  }
  updateGutters(n) {
    let e = n.startState.facet(ji), t = n.state.facet(ji), i = n.docChanged || n.heightChanged || n.viewportChanged || !$.eq(n.startState.facet(Fi), n.state.facet(Fi), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let s of this.gutters)
        s.update(n) && (i = !0);
    else {
      i = !0;
      let s = [];
      for (let r of t) {
        let o = e.indexOf(r);
        o < 0 ? s.push(new Po(this.view, r)) : (this.gutters[o].update(n), s.push(this.gutters[o]));
      }
      for (let r of this.gutters)
        r.dom.remove(), s.indexOf(r) < 0 && r.destroy();
      for (let r of s)
        r.config.side == "after" ? this.getDOMAfter().appendChild(r.dom) : this.dom.appendChild(r.dom);
      this.gutters = s;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove(), this.domAfter && this.domAfter.remove();
  }
}, {
  provide: (n) => A.scrollMargins.of((e) => {
    let t = e.plugin(n);
    if (!t || t.gutters.length == 0 || !t.fixed)
      return null;
    let i = t.dom.offsetWidth * e.scaleX, s = t.domAfter ? t.domAfter.offsetWidth * e.scaleX : 0;
    return e.textDirection == H.LTR ? { left: i, right: s } : { right: i, left: s };
  })
});
function Qo(n) {
  return Array.isArray(n) ? n : [n];
}
function Mn(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class pd {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = $.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: s } = this, r = (t.top - this.height) / e.scaleY, o = t.height / e.scaleY;
    if (this.i == s.elements.length) {
      let l = new Qa(e, o, r, i);
      s.elements.push(l), s.dom.appendChild(l.dom);
    } else
      s.elements[this.i].update(e, o, r, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let s = [];
    Mn(this.cursor, s, t.from), i.length && (s = s.concat(i));
    let r = this.gutter.config.lineMarker(e, t, s);
    r && s.unshift(r);
    let o = this.gutter;
    s.length == 0 && !o.config.renderEmptyElements || this.addElement(e, t, s);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t), s = i ? [i] : null;
    for (let r of e.state.facet(cd)) {
      let o = r(e, t.widget, t);
      o && (s || (s = [])).push(o);
    }
    s && this.addElement(e, t, s);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class Po {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (s) => {
        let r = s.target, o;
        if (r != this.dom && this.dom.contains(r)) {
          for (; r.parentNode != this.dom; )
            r = r.parentNode;
          let a = r.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = s.clientY;
        let l = e.lineBlockAtHeight(o - e.documentTop);
        t.domEventHandlers[i](e, l, s) && s.preventDefault();
      });
    this.markers = Qo(t.markers(e)), t.initialSpacer && (this.spacer = new Qa(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = Qo(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let s = this.config.updateSpacer(this.spacer.markers[0], e);
      s != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [s]);
    }
    let i = e.view.viewport;
    return !$.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class Qa {
  constructor(e, t, i, s) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, s);
  }
  update(e, t, i, s) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), gd(this.markers, s) || this.setMarkers(e, s);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", s = this.dom.firstChild;
    for (let r = 0, o = 0; ; ) {
      let l = o, a = r < t.length ? t[r++] : null, h = !1;
      if (a) {
        let f = a.elementClass;
        f && (i += " " + f);
        for (let c = o; c < this.markers.length; c++)
          if (this.markers[c].compare(a)) {
            l = c, h = !0;
            break;
          }
      } else
        l = this.markers.length;
      for (; o < l; ) {
        let f = this.markers[o++];
        if (f.toDOM) {
          f.destroy(s);
          let c = s.nextSibling;
          s.remove(), s = c;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? s = s.nextSibling : this.dom.insertBefore(a.toDOM(e), s)), h && o++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function gd(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const md = /* @__PURE__ */ P.define(), Od = /* @__PURE__ */ P.define(), Tt = /* @__PURE__ */ P.define({
  combine(n) {
    return gs(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let s in t) {
          let r = i[s], o = t[s];
          i[s] = r ? (l, a, h) => r(l, a, h) || o(l, a, h) : o;
        }
        return i;
      }
    });
  }
});
class Ns extends at {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function Ls(n, e) {
  return n.state.facet(Tt).formatNumber(e, n.state);
}
const yd = /* @__PURE__ */ ji.compute([Tt], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(md);
  },
  lineMarker(e, t, i) {
    return i.some((s) => s.toDOM) ? null : new Ns(Ls(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: (e, t, i) => {
    for (let s of e.state.facet(Od)) {
      let r = s(e, t, i);
      if (r)
        return r;
    }
    return null;
  },
  lineMarkerChange: (e) => e.startState.facet(Tt) != e.state.facet(Tt),
  initialSpacer(e) {
    return new Ns(Ls(e, Co(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = Ls(t.view, Co(t.view.state.doc.lines));
    return i == e.number ? e : new Ns(i);
  },
  domEventHandlers: n.facet(Tt).domEventHandlers,
  side: "before"
}));
function $p(n = {}) {
  return [
    Tt.of(n),
    ud(),
    yd
  ];
}
function Co(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
const bd = /* @__PURE__ */ new class extends at {
  constructor() {
    super(...arguments), this.elementClass = "cm-activeLineGutter";
  }
}(), Sd = /* @__PURE__ */ Fi.compute(["selection"], (n) => {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let s = n.doc.lineAt(i.head).from;
    s > t && (t = s, e.push(bd.range(s)));
  }
  return $.of(e);
});
function Wp() {
  return Sd;
}
var Vs;
const Qt = /* @__PURE__ */ new E();
function xd(n) {
  return P.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const wd = /* @__PURE__ */ new E();
class ve {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], s = "") {
    this.data = e, this.name = s, N.prototype.hasOwnProperty("tree") || Object.defineProperty(N.prototype, "tree", { get() {
      return ze(this);
    } }), this.parser = t, this.extension = [
      Nt.of(this),
      N.languageData.of((r, o, l) => {
        let a = Ao(r, o, l), h = a.type.prop(Qt);
        if (!h)
          return [];
        let f = r.facet(h), c = a.type.prop(wd);
        if (c) {
          let u = a.resolve(o - a.from, l);
          for (let d of c)
            if (d.test(u, r)) {
              let p = r.facet(d.facet);
              return d.type == "replace" ? p : p.concat(f);
            }
        }
        return f;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return Ao(e, t, i).type.prop(Qt) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(Nt);
    if ((t == null ? void 0 : t.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], s = (r, o) => {
      if (r.prop(Qt) == this.data) {
        i.push({ from: o, to: o + r.length });
        return;
      }
      let l = r.prop(E.mounted);
      if (l) {
        if (l.tree.prop(Qt) == this.data) {
          if (l.overlay)
            for (let a of l.overlay)
              i.push({ from: a.from + o, to: a.to + o });
          else
            i.push({ from: o, to: o + r.length });
          return;
        } else if (l.overlay) {
          let a = i.length;
          if (s(l.tree, l.overlay[0].from + o), i.length > a)
            return;
        }
      }
      for (let a = 0; a < r.children.length; a++) {
        let h = r.children[a];
        h instanceof U && s(h, r.positions[a] + o);
      }
    };
    return s(ze(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
ve.setState = /* @__PURE__ */ j.define();
function Ao(n, e, t) {
  let i = n.facet(Nt), s = ze(n).topNode;
  if (!i || i.allowsNesting)
    for (let r = s; r; r = r.enter(e, t, L.ExcludeBuffers | L.EnterBracketed))
      r.type.isTop && (s = r);
  return s;
}
class fs extends ve {
  constructor(e, t, i) {
    super(e, t, [], i), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = xd(e.languageData);
    return new fs(t, e.parser.configure({
      props: [Qt.add((i) => i.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new fs(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function ze(n) {
  let e = n.field(ve.state, !1);
  return e ? e.tree : U.empty;
}
class kd {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let Ft = null;
class cs {
  constructor(e, t, i = [], s, r, o, l, a) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = s, this.treeLen = r, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new cs(e, t, [], U.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new kd(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != U.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let s = Date.now() + e;
        e = () => Date.now() > s;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let s = this.parse.advance();
        if (s)
          if (this.fragments = this.withoutTempSkipped(Ue.addTree(s, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = s, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(Ue.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = Ft;
    Ft = this;
    try {
      return e();
    } finally {
      Ft = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = Ro(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: s, treeLen: r, viewport: o, skipped: l } = this;
    if (this.takeTree(), !e.empty) {
      let a = [];
      if (e.iterChangedRanges((h, f, c, u) => a.push({ fromA: h, toA: f, fromB: c, toB: u })), i = Ue.applyChanges(i, a), s = U.empty, r = 0, o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let f = e.mapPos(h.from, 1), c = e.mapPos(h.to, -1);
          f < c && l.push({ from: f, to: c });
        }
      }
    }
    return new cs(this.parser, t, i, s, r, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: s, to: r } = this.skipped[i];
      s < e.to && r > e.from && (this.fragments = Ro(this.fragments, s, r), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends jo {
      createParse(t, i, s) {
        let r = s[0].from, o = s[s.length - 1].to;
        return {
          parsedPos: r,
          advance() {
            let a = Ft;
            if (a) {
              for (let h of s)
                a.tempSkipped.push(h);
              e && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, e]) : e);
            }
            return this.parsedPos = o, new U(he.none, [], [], o - r);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return Ft;
  }
}
function Ro(n, e, t) {
  return Ue.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class It {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new It(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = cs.create(e.facet(Nt).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new It(i);
  }
}
ve.state = /* @__PURE__ */ Ye.define({
  create: It.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(ve.setState))
        return t.value;
    return e.startState.facet(Nt) != e.state.facet(Nt) ? It.init(e.state) : n.apply(e);
  }
});
let Pa = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (Pa = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const _s = typeof navigator < "u" && (!((Vs = navigator.scheduling) === null || Vs === void 0) && Vs.isInputPending) ? () => navigator.scheduling.isInputPending() : null, vd = /* @__PURE__ */ ge.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(ve.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(ve.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = Pa(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: s } } = this.view, r = i.field(ve.state);
    if (r.tree == r.context.tree && r.context.isDone(
      s + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, e && !_s ? Math.max(25, e.timeRemaining() - 5) : 1e9), l = r.context.treeLen < s && i.doc.length > s + 1e3, a = r.context.work(() => _s && _s() || Date.now() > o, s + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (a || this.chunkBudget <= 0) && (r.context.takeTree(), this.view.dispatch({ effects: ve.setState.of(new It(r.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(r.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => De(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), Nt = /* @__PURE__ */ P.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    ve.state,
    vd,
    A.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class Td {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
class Ca {
  constructor(e, t, i, s, r, o = void 0) {
    this.name = e, this.alias = t, this.extensions = i, this.filename = s, this.loadFunc = r, this.support = o, this.loading = null;
  }
  /**
  Start loading the the language. Will return a promise that
  resolves to a [`LanguageSupport`](https://codemirror.net/6/docs/ref/#language.LanguageSupport)
  object when the language successfully loads.
  */
  load() {
    return this.loading || (this.loading = this.loadFunc().then((e) => this.support = e, (e) => {
      throw this.loading = null, e;
    }));
  }
  /**
  Create a language description.
  */
  static of(e) {
    let { load: t, support: i } = e;
    if (!t) {
      if (!i)
        throw new RangeError("Must pass either 'load' or 'support' to LanguageDescription.of");
      t = () => Promise.resolve(i);
    }
    return new Ca(e.name, (e.alias || []).concat(e.name).map((s) => s.toLowerCase()), e.extensions || [], e.filename, t, i);
  }
  /**
  Look for a language in the given array of descriptions that
  matches the filename. Will first match
  [`filename`](https://codemirror.net/6/docs/ref/#language.LanguageDescription.filename) patterns,
  and then [extensions](https://codemirror.net/6/docs/ref/#language.LanguageDescription.extensions),
  and return the first language that matches.
  */
  static matchFilename(e, t) {
    for (let s of e)
      if (s.filename && s.filename.test(t))
        return s;
    let i = /\.([^.]+)$/.exec(t);
    if (i) {
      for (let s of e)
        if (s.extensions.indexOf(i[1]) > -1)
          return s;
    }
    return null;
  }
  /**
  Look for a language whose name or alias matches the the given
  name (case-insensitively). If `fuzzy` is true, and no direct
  matchs is found, this'll also search for a language whose name
  or alias occurs in the string (for names shorter than three
  characters, only when surrounded by non-word characters).
  */
  static matchLanguageName(e, t, i = !0) {
    t = t.toLowerCase();
    for (let s of e)
      if (s.alias.some((r) => r == t))
        return s;
    if (i)
      for (let s of e)
        for (let r of s.alias) {
          let o = t.indexOf(r);
          if (o > -1 && (r.length > 2 || !/\w/.test(t[o - 1]) && !/\w/.test(t[o + r.length])))
            return s;
        }
    return null;
  }
}
const Qd = /* @__PURE__ */ P.define(), sr = /* @__PURE__ */ P.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function Pd(n) {
  let e = n.facet(sr);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function zp(n, e) {
  let t = "", i = n.tabSize, s = n.facet(sr)[0];
  if (s == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    s = " ";
  }
  for (let r = 0; r < e; r++)
    t += s;
  return t;
}
function Bp(n, e) {
  n instanceof N && (n = new Aa(n));
  for (let i of n.state.facet(Qd)) {
    let s = i(n, e);
    if (s !== void 0)
      return s;
  }
  let t = ze(n.state);
  return t.length >= e ? Cd(n, t, e) : null;
}
class Aa {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = Pd(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: s, simulateDoubleBreak: r } = this.options;
    return s != null && s >= i.from && s <= i.to ? r && s == e ? { text: "", from: e } : (t < 0 ? s < e : s <= e) ? { text: i.text.slice(s - i.from), from: s } : { text: i.text.slice(0, s - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: s } = this.lineAt(e, t);
    return i.slice(e - s, Math.min(i.length, e + 100 - s));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.countColumn(i, e - s), o = this.options.overrideIndentation ? this.options.overrideIndentation(s) : -1;
    return o > -1 && (r += o - this.countColumn(i, i.search(/\S|$/))), r;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return kl(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.options.overrideIndentation;
    if (r) {
      let o = r(s);
      if (o > -1)
        return o;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Ra = /* @__PURE__ */ new E();
function Cd(n, e, t) {
  let i = e.resolveStack(t), s = e.resolveInner(t, -1).resolve(t, 0).enterUnfinishedNodesBefore(t);
  if (s != i.node) {
    let r = [];
    for (let o = s; o && !(o.from < i.node.from || o.to > i.node.to || o.from == i.node.from && o.type == i.node.type); o = o.parent)
      r.push(o);
    for (let o = r.length - 1; o >= 0; o--)
      i = { node: r[o], next: i };
  }
  return qa(i, n, t);
}
function qa(n, e, t) {
  for (let i = n; i; i = i.next) {
    let s = Rd(i.node);
    if (s)
      return s(nr.create(e, t, i));
  }
  return 0;
}
function Ad(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function Rd(n) {
  let e = n.type.prop(Ra);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop(E.closedBy))) {
    let s = n.lastChild, r = s && i.indexOf(s.name) > -1;
    return (o) => Ea(o, !0, 1, void 0, r && !Ad(o) ? s.from : void 0);
  }
  return n.parent == null ? qd : null;
}
function qd() {
  return 0;
}
class nr extends Aa {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new nr(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (Ed(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return qa(this.context.next, this.base, this.pos);
  }
}
function Ed(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function Md(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let s = n.options.simulateBreak, r = n.state.doc.lineAt(t.from), o = s == null || s <= r.from ? r.to : Math.min(r.to, s);
  for (let l = t.to; ; ) {
    let a = e.childAfter(l);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped) {
      if (a.from >= o)
        return null;
      let h = /^ */.exec(r.text.slice(t.to - r.from))[0].length;
      return { from: t.from, to: t.to + h };
    }
    l = a.to;
  }
}
function Xs({ closing: n, align: e = !0, units: t = 1 }) {
  return (i) => Ea(i, e, t, n);
}
function Ea(n, e, t, i, s) {
  let r = n.textAfter, o = r.match(/^\s*/)[0].length, l = i && r.slice(o, o + i.length) == i || s == n.pos + o, a = e ? Md(n) : null;
  return a ? l ? n.column(a.from) : n.column(a.to) : n.baseIndent + (l ? 0 : n.unit * t);
}
const Ip = (n) => n.baseIndent;
function Np({ except: n, units: e = 1 } = {}) {
  return (t) => {
    let i = n && n.test(t.textAfter);
    return t.baseIndent + (i ? 0 : e * t.unit);
  };
}
const Lp = /* @__PURE__ */ P.define(), $d = /* @__PURE__ */ new E();
function Wd(n) {
  let e = n.firstChild, t = n.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? n.to : t.from } : null;
}
class xs {
  constructor(e, t) {
    this.specs = e;
    let i;
    function s(l) {
      let a = rt.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const r = typeof t.all == "string" ? t.all : t.all ? s(t.all) : void 0, o = t.scope;
    this.scope = o instanceof ve ? (l) => l.prop(Qt) == o.data : o ? (l) => l == o : void 0, this.style = Zo(e.map((l) => ({
      tag: l.tag,
      class: l.class || s(Object.assign({}, l, { tag: null }))
    })), {
      all: r
    }).style, this.module = i ? new rt(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new xs(e, t || {});
  }
}
const $n = /* @__PURE__ */ P.define(), Ma = /* @__PURE__ */ P.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function Fs(n) {
  let e = n.facet($n);
  return e.length ? e : n.facet(Ma);
}
function Vp(n, e) {
  let t = [zd], i;
  return n instanceof xs && (n.module && t.push(A.styleModule.of(n.module)), i = n.themeType), e != null && e.fallback ? t.push(Ma.of(n)) : i ? t.push($n.computeN([A.darkTheme], (s) => s.facet(A.darkTheme) == (i == "dark") ? [n] : [])) : t.push($n.of(n)), t;
}
class Dd {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = ze(e.state), this.decorations = this.buildDeco(e, Fs(e.state)), this.decoratedTo = e.viewport.to;
  }
  update(e) {
    let t = ze(e.state), i = Fs(e.state), s = i != Fs(e.startState), { viewport: r } = e.view, o = e.changes.mapPos(this.decoratedTo, 1);
    t.length < r.to && !s && t.type == this.tree.type && o >= r.to ? (this.decorations = this.decorations.map(e.changes), this.decoratedTo = o) : (t != this.tree || e.viewportChanged || s) && (this.tree = t, this.decorations = this.buildDeco(e.view, i), this.decoratedTo = r.to);
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return B.none;
    let i = new $t();
    for (let { from: s, to: r } of e.visibleRanges)
      xh(this.tree, t, (o, l, a) => {
        i.add(o, l, this.markCache[a] || (this.markCache[a] = B.mark({ class: a })));
      }, s, r);
    return i.finish();
  }
}
const zd = /* @__PURE__ */ ci.high(/* @__PURE__ */ ge.fromClass(Dd, {
  decorations: (n) => n.decorations
})), _p = /* @__PURE__ */ xs.define([
  {
    tag: y.meta,
    color: "#404740"
  },
  {
    tag: y.link,
    textDecoration: "underline"
  },
  {
    tag: y.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: y.emphasis,
    fontStyle: "italic"
  },
  {
    tag: y.strong,
    fontWeight: "bold"
  },
  {
    tag: y.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: y.keyword,
    color: "#708"
  },
  {
    tag: [y.atom, y.bool, y.url, y.contentSeparator, y.labelName],
    color: "#219"
  },
  {
    tag: [y.literal, y.inserted],
    color: "#164"
  },
  {
    tag: [y.string, y.deleted],
    color: "#a11"
  },
  {
    tag: [y.regexp, y.escape, /* @__PURE__ */ y.special(y.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ y.definition(y.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ y.local(y.variableName),
    color: "#30a"
  },
  {
    tag: [y.typeName, y.namespace],
    color: "#085"
  },
  {
    tag: y.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ y.special(y.variableName), y.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ y.definition(y.propertyName),
    color: "#00c"
  },
  {
    tag: y.comment,
    color: "#940"
  },
  {
    tag: y.invalid,
    color: "#f00"
  }
]), Bd = /* @__PURE__ */ A.baseTheme({
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
  "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" }
}), $a = 1e4, Wa = "()[]{}", Da = /* @__PURE__ */ P.define({
  combine(n) {
    return gs(n, {
      afterCursor: !0,
      brackets: Wa,
      maxScanDistance: $a,
      renderMatch: Ld
    });
  }
}), Id = /* @__PURE__ */ B.mark({ class: "cm-matchingBracket" }), Nd = /* @__PURE__ */ B.mark({ class: "cm-nonmatchingBracket" });
function Ld(n) {
  let e = [], t = n.matched ? Id : Nd;
  return e.push(t.range(n.start.from, n.start.to)), n.end && e.push(t.range(n.end.from, n.end.to)), e;
}
function qo(n) {
  let e = [], t = n.facet(Da);
  for (let i of n.selection.ranges) {
    if (!i.empty)
      continue;
    let s = Mi(n, i.head, -1, t) || i.head > 0 && Mi(n, i.head - 1, 1, t) || t.afterCursor && (Mi(n, i.head, 1, t) || i.head < n.doc.length && Mi(n, i.head + 1, -1, t));
    s && (e = e.concat(t.renderMatch(s, n)));
  }
  return B.set(e, !0);
}
const Vd = /* @__PURE__ */ ge.fromClass(class {
  constructor(n) {
    this.paused = !1, this.decorations = qo(n.state);
  }
  update(n) {
    (n.docChanged || n.selectionSet || this.paused) && (n.view.composing ? (this.decorations = this.decorations.map(n.changes), this.paused = !0) : (this.decorations = qo(n.state), this.paused = !1));
  }
}, {
  decorations: (n) => n.decorations
}), _d = [
  Vd,
  Bd
];
function Xp(n = {}) {
  return [Da.of(n), _d];
}
const Xd = /* @__PURE__ */ new E();
function Wn(n, e, t) {
  let i = n.prop(e < 0 ? E.openedBy : E.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let s = t.indexOf(n.name);
    if (s > -1 && s % 2 == (e < 0 ? 1 : 0))
      return [t[s + e]];
  }
  return null;
}
function Dn(n) {
  let e = n.type.prop(Xd);
  return e ? e(n.node) : n;
}
function Mi(n, e, t, i = {}) {
  let s = i.maxScanDistance || $a, r = i.brackets || Wa, o = ze(n), l = o.resolveInner(e, t);
  for (let a = l; a; a = a.parent) {
    let h = Wn(a.type, t, r);
    if (h && a.from < a.to) {
      let f = Dn(a);
      if (f && (t > 0 ? e >= f.from && e < f.to : e > f.from && e <= f.to))
        return Fd(n, e, t, a, f, h, r);
    }
  }
  return jd(n, e, t, o, l.type, s, r);
}
function Fd(n, e, t, i, s, r, o) {
  let l = i.parent, a = { from: s.from, to: s.to }, h = 0, f = l == null ? void 0 : l.cursor();
  if (f && (t < 0 ? f.childBefore(i.from) : f.childAfter(i.to)))
    do
      if (t < 0 ? f.to <= i.from : f.from >= i.to) {
        if (h == 0 && r.indexOf(f.type.name) > -1 && f.from < f.to) {
          let c = Dn(f);
          return { start: a, end: c ? { from: c.from, to: c.to } : void 0, matched: !0 };
        } else if (Wn(f.type, t, o))
          h++;
        else if (Wn(f.type, -t, o)) {
          if (h == 0) {
            let c = Dn(f);
            return {
              start: a,
              end: c && c.from < c.to ? { from: c.from, to: c.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? f.prevSibling() : f.nextSibling());
  return { start: a, matched: !1 };
}
function jd(n, e, t, i, s, r, o) {
  if (t < 0 ? !e : e == n.doc.length)
    return null;
  let l = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, f = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), c = 0;
  for (let u = 0; !f.next().done && u <= r; ) {
    let d = f.value;
    t < 0 && (u += d.length);
    let p = e + u * t;
    for (let g = t > 0 ? 0 : d.length - 1, m = t > 0 ? d.length : -1; g != m; g += t) {
      let O = o.indexOf(d[g]);
      if (!(O < 0 || i.resolveInner(p + g, 1).type != s))
        if (O % 2 == 0 == t > 0)
          c++;
        else {
          if (c == 1)
            return { start: h, end: { from: p + g, to: p + g + 1 }, matched: O >> 1 == a >> 1 };
          c--;
        }
    }
    t > 0 && (u += d.length);
  }
  return f.done ? { start: h, matched: !1 } : null;
}
const Ud = /* @__PURE__ */ Object.create(null), Eo = [he.none], Mo = [], $o = /* @__PURE__ */ Object.create(null), Hd = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  Hd[n] = /* @__PURE__ */ Gd(Ud, e);
function js(n, e) {
  Mo.indexOf(n) > -1 || (Mo.push(n), console.warn(e));
}
function Gd(n, e) {
  let t = [];
  for (let l of e.split(" ")) {
    let a = [];
    for (let h of l.split(".")) {
      let f = n[h] || y[h];
      f ? typeof f == "function" ? a.length ? a = a.map(f) : js(h, `Modifier ${h} used at start of tag`) : a.length ? js(h, `Tag ${h} used as modifier`) : a = Array.isArray(f) ? f : [f] : js(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), s = i + " " + t.map((l) => l.id), r = $o[s];
  if (r)
    return r.id;
  let o = $o[s] = he.define({
    id: Eo.length,
    name: i,
    props: [Ho({ [i]: t })]
  });
  return Eo.push(o), o.id;
}
H.RTL, H.LTR;
class Fp {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, t, i, s) {
    this.state = e, this.pos = t, this.explicit = i, this.view = s, this.abortListeners = [], this.abortOnDocChange = !1;
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let t = ze(this.state).resolveInner(this.pos, -1);
    for (; t && e.indexOf(t.name) < 0; )
      t = t.parent;
    return t ? {
      from: t.from,
      to: this.pos,
      text: this.state.sliceDoc(t.from, this.pos),
      type: t.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let t = this.state.doc.lineAt(this.pos), i = Math.max(t.from, this.pos - 250), s = t.text.slice(i - t.from, this.pos - t.from), r = s.search(Jd(e));
    return r < 0 ? null : { from: i + r, to: this.pos, text: s.slice(r) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  
  By default, running queries will not be aborted for regular
  typing or backspacing, on the assumption that they are likely to
  return a result with a
  [`validFor`](https://codemirror.net/6/docs/ref/#autocomplete.CompletionResult.validFor) field that
  allows the result to be used after all. Passing `onDocChange:
  true` will cause this query to be aborted for any document
  change.
  */
  addEventListener(e, t, i) {
    e == "abort" && this.abortListeners && (this.abortListeners.push(t), i && i.onDocChange && (this.abortOnDocChange = !0));
  }
}
function Wo(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function Zd(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: s } of n) {
    e[s[0]] = !0;
    for (let r = 1; r < s.length; r++)
      t[s[r]] = !0;
  }
  let i = Wo(e) + Wo(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function Yd(n) {
  let e = n.map((s) => typeof s == "string" ? { label: s } : s), [t, i] = e.every((s) => /^\w+$/.test(s.label)) ? [/\w*$/, /\w+$/] : Zd(e);
  return (s) => {
    let r = s.matchBefore(i);
    return r || s.explicit ? { from: r ? r.from : s.pos, options: e, validFor: t } : null;
  };
}
function Kd(n, e) {
  return (t) => {
    for (let i = ze(t.state).resolveInner(t.pos, -1); i; i = i.parent) {
      if (n.indexOf(i.name) > -1)
        return null;
      if (i.type.isTop)
        break;
    }
    return e(t);
  };
}
function Jd(n, e) {
  var t;
  let { source: i } = n, s = i[i.length - 1] != "$";
  return s ? new RegExp(`(?:${i})${s ? "$" : ""}`, (t = n.flags) !== null && t !== void 0 ? t : n.ignoreCase ? "i" : "") : n;
}
const ep = /* @__PURE__ */ bt.define(), tp = /* @__PURE__ */ A.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center",
    cursor: "pointer"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box",
    whiteSpace: "pre-line"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
});
class ip {
  constructor(e, t, i, s) {
    this.field = e, this.line = t, this.from = i, this.to = s;
  }
}
class rr {
  constructor(e, t, i) {
    this.field = e, this.from = t, this.to = i;
  }
  map(e) {
    let t = e.mapPos(this.from, -1, le.TrackDel), i = e.mapPos(this.to, 1, le.TrackDel);
    return t == null || i == null ? null : new rr(this.field, t, i);
  }
}
class or {
  constructor(e, t) {
    this.lines = e, this.fieldPositions = t;
  }
  instantiate(e, t) {
    let i = [], s = [t], r = e.doc.lineAt(t), o = /^\s*/.exec(r.text)[0];
    for (let a of this.lines) {
      if (i.length) {
        let h = o, f = /^\t*/.exec(a)[0].length;
        for (let c = 0; c < f; c++)
          h += e.facet(sr);
        s.push(t + h.length - f), a = h + a.slice(f);
      }
      i.push(a), t += a.length + 1;
    }
    let l = this.fieldPositions.map((a) => new rr(a.field, s[a.line] + a.from, s[a.line] + a.to));
    return { text: i, ranges: l };
  }
  static parse(e) {
    let t = [], i = [], s = [], r;
    for (let o of e.split(/\r\n?|\n/)) {
      for (; r = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(o); ) {
        let l = r[1] ? +r[1] : null, a = r[2] || r[3] || "", h = -1;
        l === 0 && (l = 1e9);
        let f = a.replace(/\\[{}]/g, (c) => c[1]);
        for (let c = 0; c < t.length; c++)
          (l != null ? t[c].seq == l : f && t[c].name == f) && (h = c);
        if (h < 0) {
          let c = 0;
          for (; c < t.length && (l == null || t[c].seq != null && t[c].seq < l); )
            c++;
          t.splice(c, 0, { seq: l, name: f }), h = c;
          for (let u of s)
            u.field >= h && u.field++;
        }
        for (let c of s)
          if (c.line == i.length && c.from > r.index) {
            let u = r[2] ? 3 + (r[1] || "").length : 2;
            c.from -= u, c.to -= u;
          }
        s.push(new ip(h, i.length, r.index, r.index + f.length)), o = o.slice(0, r.index) + a + o.slice(r.index + r[0].length);
      }
      o = o.replace(/\\([{}])/g, (l, a, h) => {
        for (let f of s)
          f.line == i.length && f.from > h && (f.from--, f.to--);
        return a;
      }), i.push(o);
    }
    return new or(i, s);
  }
}
let sp = /* @__PURE__ */ B.widget({ widget: /* @__PURE__ */ new class extends St {
  toDOM() {
    let n = document.createElement("span");
    return n.className = "cm-snippetFieldPosition", n;
  }
  ignoreEvent() {
    return !1;
  }
}() }), np = /* @__PURE__ */ B.mark({ class: "cm-snippetField" });
class Lt {
  constructor(e, t) {
    this.ranges = e, this.active = t, this.deco = B.set(e.map((i) => (i.from == i.to ? sp : np).range(i.from, i.to)), !0);
  }
  map(e) {
    let t = [];
    for (let i of this.ranges) {
      let s = i.map(e);
      if (!s)
        return null;
      t.push(s);
    }
    return new Lt(t, this.active);
  }
  selectionInsideField(e) {
    return e.ranges.every((t) => this.ranges.some((i) => i.field == this.active && i.from <= t.from && i.to >= t.to));
  }
}
const gi = /* @__PURE__ */ j.define({
  map(n, e) {
    return n && n.map(e);
  }
}), rp = /* @__PURE__ */ j.define(), fi = /* @__PURE__ */ Ye.define({
  create() {
    return null;
  },
  update(n, e) {
    for (let t of e.effects) {
      if (t.is(gi))
        return t.value;
      if (t.is(rp) && n)
        return new Lt(n.ranges, t.value);
    }
    return n && e.docChanged && (n = n.map(e.changes)), n && e.selection && !n.selectionInsideField(e.selection) && (n = null), n;
  },
  provide: (n) => A.decorations.from(n, (e) => e ? e.deco : B.none)
});
function lr(n, e) {
  return v.create(n.filter((t) => t.field == e).map((t) => v.range(t.from, t.to)));
}
function op(n) {
  let e = or.parse(n);
  return (t, i, s, r) => {
    let { text: o, ranges: l } = e.instantiate(t.state, s), { main: a } = t.state.selection, h = {
      changes: { from: s, to: r == a.from ? a.to : r, insert: D.of(o) },
      scrollIntoView: !0,
      annotations: i ? [ep.of(i), te.userEvent.of("input.complete")] : void 0
    };
    if (l.length && (h.selection = lr(l, 0)), l.some((f) => f.field > 0)) {
      let f = new Lt(l, 0), c = h.effects = [gi.of(f)];
      t.state.field(fi, !1) === void 0 && c.push(j.appendConfig.of([fi, cp, up, tp]));
    }
    t.dispatch(t.state.update(h));
  };
}
function za(n) {
  return ({ state: e, dispatch: t }) => {
    let i = e.field(fi, !1);
    if (!i || n < 0 && i.active == 0)
      return !1;
    let s = i.active + n, r = n > 0 && !i.ranges.some((o) => o.field == s + n);
    return t(e.update({
      selection: lr(i.ranges, s),
      effects: gi.of(r ? null : new Lt(i.ranges, s)),
      scrollIntoView: !0
    })), !0;
  };
}
const lp = ({ state: n, dispatch: e }) => n.field(fi, !1) ? (e(n.update({ effects: gi.of(null) })), !0) : !1, ap = /* @__PURE__ */ za(1), hp = /* @__PURE__ */ za(-1), fp = [
  { key: "Tab", run: ap, shift: hp },
  { key: "Escape", run: lp }
], Do = /* @__PURE__ */ P.define({
  combine(n) {
    return n.length ? n[0] : fp;
  }
}), cp = /* @__PURE__ */ ci.highest(/* @__PURE__ */ Oa.compute([Do], (n) => n.facet(Do)));
function Ie(n, e) {
  return { ...e, apply: op(n) };
}
const up = /* @__PURE__ */ A.domEventHandlers({
  mousedown(n, e) {
    let t = e.state.field(fi, !1), i;
    if (!t || (i = e.posAtCoords({ x: n.clientX, y: n.clientY })) == null)
      return !1;
    let s = t.ranges.find((r) => r.from <= i && r.to >= i);
    return !s || s.field == t.active ? !1 : (e.dispatch({
      selection: lr(t.ranges, s.field),
      effects: gi.of(t.ranges.some((r) => r.field > s.field) ? new Lt(t.ranges, s.field) : null),
      scrollIntoView: !0
    }), !0);
  }
}), Ba = /* @__PURE__ */ new class extends nt {
}();
Ba.startSide = 1;
Ba.endSide = -1;
const zo = /* @__PURE__ */ new Ka(), Ia = /* @__PURE__ */ new Set([
  "Script",
  "Body",
  "FunctionDefinition",
  "ClassDefinition",
  "LambdaExpression",
  "ForStatement",
  "MatchClause"
]);
function $i(n) {
  return (e, t, i) => {
    if (i)
      return !1;
    let s = e.node.getChild("VariableName");
    return s && t(s, n), !0;
  };
}
const dp = {
  FunctionDefinition: /* @__PURE__ */ $i("function"),
  ClassDefinition: /* @__PURE__ */ $i("class"),
  ForStatement(n, e, t) {
    if (t) {
      for (let i = n.node.firstChild; i; i = i.nextSibling)
        if (i.name == "VariableName")
          e(i, "variable");
        else if (i.name == "in")
          break;
    }
  },
  ImportStatement(n, e) {
    var t, i;
    let { node: s } = n, r = ((t = s.firstChild) === null || t === void 0 ? void 0 : t.name) == "from";
    for (let o = s.getChild("import"); o; o = o.nextSibling)
      o.name == "VariableName" && ((i = o.nextSibling) === null || i === void 0 ? void 0 : i.name) != "as" && e(o, r ? "variable" : "namespace");
  },
  AssignStatement(n, e) {
    for (let t = n.node.firstChild; t; t = t.nextSibling)
      if (t.name == "VariableName")
        e(t, "variable");
      else if (t.name == ":" || t.name == "AssignOp")
        break;
  },
  ParamList(n, e) {
    for (let t = null, i = n.node.firstChild; i; i = i.nextSibling)
      i.name == "VariableName" && (!t || !/\*|AssignOp/.test(t.name)) && e(i, "variable"), t = i;
  },
  CapturePattern: /* @__PURE__ */ $i("variable"),
  AsPattern: /* @__PURE__ */ $i("variable"),
  __proto__: null
};
function Na(n, e) {
  let t = zo.get(e);
  if (t)
    return t;
  let i = [], s = !0;
  function r(o, l) {
    let a = n.sliceString(o.from, o.to);
    i.push({ label: a, type: l });
  }
  return e.cursor(L.IncludeAnonymous).iterate((o) => {
    if (o.name) {
      let l = dp[o.name];
      if (l && l(o, r, s) || !s && Ia.has(o.name))
        return !1;
      s = !1;
    } else if (o.to - o.from > 8192) {
      for (let l of Na(n, o.node))
        i.push(l);
      return !1;
    }
  }), zo.set(e, i), i;
}
const Bo = /^[\w\xa1-\uffff][\w\d\xa1-\uffff]*$/, La = ["String", "FormatString", "Comment", "PropertyName"];
function pp(n) {
  let e = ze(n.state).resolveInner(n.pos, -1);
  if (La.indexOf(e.name) > -1)
    return null;
  let t = e.name == "VariableName" || e.to - e.from < 20 && Bo.test(n.state.sliceDoc(e.from, e.to));
  if (!t && !n.explicit)
    return null;
  let i = [];
  for (let s = e; s; s = s.parent)
    Ia.has(s.name) && (i = i.concat(Na(n.state.doc, s)));
  return {
    options: i,
    from: t ? e.from : n.pos,
    validFor: Bo
  };
}
const gp = /* @__PURE__ */ [
  "__annotations__",
  "__builtins__",
  "__debug__",
  "__doc__",
  "__import__",
  "__name__",
  "__loader__",
  "__package__",
  "__spec__",
  "False",
  "None",
  "True"
].map((n) => ({ label: n, type: "constant" })).concat(/* @__PURE__ */ [
  "ArithmeticError",
  "AssertionError",
  "AttributeError",
  "BaseException",
  "BlockingIOError",
  "BrokenPipeError",
  "BufferError",
  "BytesWarning",
  "ChildProcessError",
  "ConnectionAbortedError",
  "ConnectionError",
  "ConnectionRefusedError",
  "ConnectionResetError",
  "DeprecationWarning",
  "EOFError",
  "Ellipsis",
  "EncodingWarning",
  "EnvironmentError",
  "Exception",
  "FileExistsError",
  "FileNotFoundError",
  "FloatingPointError",
  "FutureWarning",
  "GeneratorExit",
  "IOError",
  "ImportError",
  "ImportWarning",
  "IndentationError",
  "IndexError",
  "InterruptedError",
  "IsADirectoryError",
  "KeyError",
  "KeyboardInterrupt",
  "LookupError",
  "MemoryError",
  "ModuleNotFoundError",
  "NameError",
  "NotADirectoryError",
  "NotImplemented",
  "NotImplementedError",
  "OSError",
  "OverflowError",
  "PendingDeprecationWarning",
  "PermissionError",
  "ProcessLookupError",
  "RecursionError",
  "ReferenceError",
  "ResourceWarning",
  "RuntimeError",
  "RuntimeWarning",
  "StopAsyncIteration",
  "StopIteration",
  "SyntaxError",
  "SyntaxWarning",
  "SystemError",
  "SystemExit",
  "TabError",
  "TimeoutError",
  "TypeError",
  "UnboundLocalError",
  "UnicodeDecodeError",
  "UnicodeEncodeError",
  "UnicodeError",
  "UnicodeTranslateError",
  "UnicodeWarning",
  "UserWarning",
  "ValueError",
  "Warning",
  "ZeroDivisionError"
].map((n) => ({ label: n, type: "type" }))).concat(/* @__PURE__ */ [
  "bool",
  "bytearray",
  "bytes",
  "classmethod",
  "complex",
  "float",
  "frozenset",
  "int",
  "list",
  "map",
  "memoryview",
  "object",
  "range",
  "set",
  "staticmethod",
  "str",
  "super",
  "tuple",
  "type"
].map((n) => ({ label: n, type: "class" }))).concat(/* @__PURE__ */ [
  "abs",
  "aiter",
  "all",
  "anext",
  "any",
  "ascii",
  "bin",
  "breakpoint",
  "callable",
  "chr",
  "compile",
  "delattr",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "exec",
  "exit",
  "filter",
  "format",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "hex",
  "id",
  "input",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "license",
  "locals",
  "max",
  "min",
  "next",
  "oct",
  "open",
  "ord",
  "pow",
  "print",
  "property",
  "quit",
  "repr",
  "reversed",
  "round",
  "setattr",
  "slice",
  "sorted",
  "sum",
  "vars",
  "zip"
].map((n) => ({ label: n, type: "function" }))), mp = [
  /* @__PURE__ */ Ie("def ${name}(${params}):\n	${}", {
    label: "def",
    detail: "function",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie("for ${name} in ${collection}:\n	${}", {
    label: "for",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie("while ${}:\n	${}", {
    label: "while",
    detail: "loop",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie("try:\n	${}\nexcept ${error}:\n	${}", {
    label: "try",
    detail: "/ except block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie(`if \${}:
	
`, {
    label: "if",
    detail: "block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie("if ${}:\n	${}\nelse:\n	${}", {
    label: "if",
    detail: "/ else block",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie("class ${name}:\n	def __init__(self, ${params}):\n			${}", {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie("import ${module}", {
    label: "import",
    detail: "statement",
    type: "keyword"
  }),
  /* @__PURE__ */ Ie("from ${module} import ${names}", {
    label: "from",
    detail: "import",
    type: "keyword"
  })
], Op = /* @__PURE__ */ Kd(La, /* @__PURE__ */ Yd(/* @__PURE__ */ gp.concat(mp)));
function Us(n) {
  let { node: e, pos: t } = n, i = n.lineIndent(t, -1), s = null;
  for (; ; ) {
    let r = e.childBefore(t);
    if (r)
      if (r.name == "Comment")
        t = r.from;
      else if (r.name == "Body" || r.name == "MatchBody")
        n.baseIndentFor(r) + n.unit <= i && (s = r), e = r;
      else if (r.name == "MatchClause")
        e = r;
      else if (r.type.is("Statement"))
        e = r;
      else
        break;
    else break;
  }
  return s;
}
function Hs(n, e) {
  let t = n.baseIndentFor(e), i = n.lineAt(n.pos, -1), s = i.from + i.text.length;
  return /^\s*($|#)/.test(i.text) && n.node.to < s + 100 && !/\S/.test(n.state.sliceDoc(s, n.node.to)) && n.lineIndent(n.pos, -1) <= t || /^\s*(else:|elif |except |finally:|case\s+[^=:]+:)/.test(n.textAfter) && n.lineIndent(n.pos, -1) > t ? null : t + n.unit;
}
const Ui = /* @__PURE__ */ fs.define({
  name: "python",
  parser: /* @__PURE__ */ $f.configure({
    props: [
      /* @__PURE__ */ Ra.add({
        Body: (n) => {
          var e;
          let t = /^\s*(#|$)/.test(n.textAfter) && Us(n) || n.node;
          return (e = Hs(n, t)) !== null && e !== void 0 ? e : n.continue();
        },
        MatchBody: (n) => {
          var e;
          let t = Us(n);
          return (e = Hs(n, t || n.node)) !== null && e !== void 0 ? e : n.continue();
        },
        IfStatement: (n) => /^\s*(else:|elif )/.test(n.textAfter) ? n.baseIndent : n.continue(),
        "ForStatement WhileStatement": (n) => /^\s*else:/.test(n.textAfter) ? n.baseIndent : n.continue(),
        TryStatement: (n) => /^\s*(except[ :]|finally:|else:)/.test(n.textAfter) ? n.baseIndent : n.continue(),
        MatchStatement: (n) => /^\s*case /.test(n.textAfter) ? n.baseIndent + n.unit : n.continue(),
        "TupleExpression ComprehensionExpression ParamList ArgList ParenthesizedExpression": /* @__PURE__ */ Xs({ closing: ")" }),
        "DictionaryExpression DictionaryComprehensionExpression SetExpression SetComprehensionExpression": /* @__PURE__ */ Xs({ closing: "}" }),
        "ArrayExpression ArrayComprehensionExpression": /* @__PURE__ */ Xs({ closing: "]" }),
        MemberExpression: (n) => n.baseIndent + n.unit,
        "String FormatString": () => null,
        Script: (n) => {
          var e;
          let t = Us(n);
          return (e = t && Hs(n, t)) !== null && e !== void 0 ? e : n.continue();
        }
      }),
      /* @__PURE__ */ $d.add({
        "ArrayExpression DictionaryExpression SetExpression TupleExpression": Wd,
        Body: (n, e) => ({ from: n.from + 1, to: n.to - (n.to == e.doc.length ? 0 : 1) }),
        "String FormatString": (n, e) => ({ from: e.doc.lineAt(n.from).to, to: n.to })
      })
    ]
  }),
  languageData: {
    closeBrackets: {
      brackets: ["(", "[", "{", "'", '"', "'''", '"""'],
      stringPrefixes: [
        "f",
        "fr",
        "rf",
        "r",
        "u",
        "b",
        "br",
        "rb",
        "F",
        "FR",
        "RF",
        "R",
        "U",
        "B",
        "BR",
        "RB"
      ]
    },
    commentTokens: { line: "#" },
    // Indent logic logic are triggered upon below input patterns
    indentOnInput: /^\s*([\}\]\)]|else:|elif |except |finally:|case\s+[^:]*:?)$/
  }
});
function jp() {
  return new Td(Ui, [
    Ui.data.of({ autocomplete: pp }),
    Ui.data.of({ autocomplete: Op })
  ]);
}
function Va(n) {
  const e = Ui.parser.parse(n), t = [];
  let i = !1;
  if (e.iterate({ enter(l) {
    if (l.type.isError && (i = !0), l.name !== "CallExpression") return;
    const a = l.node.firstChild;
    if (!a || !["oan.configure", "configure"].includes(n.slice(a.from, a.to).replace(/\s/g, ""))) return;
    const h = a.nextSibling, f = [];
    for (let c = h == null ? void 0 : h.firstChild; c; c = c.nextSibling) ["(", ")"].includes(c.name) || f.push(c);
    if (f.length !== 1 || f[0].name !== "String") throw new Error("Configuration cell must call oan.configure() with one triple-quoted literal JSON string; edit setup in Python.");
    t.push({ from: f[0].from, to: f[0].to, text: n.slice(f[0].from, f[0].to) });
  } }), i || t.length !== 1) throw new Error("Setup needs one unambiguous oan.configure() call in valid Python. Edit setup in Python.");
  const s = t[0], r = s.text.match(/^([rRuU]*)("""|''')/);
  if (!r) throw new Error("Configuration must use a triple-quoted literal JSON string; edit setup in Python.");
  let o = s.text.slice(r[0].length, -3);
  /r/i.test(r[1]) || (o = o.replace(/\\(\r?\n|[\\'"abfnrtv]|x[\da-fA-F]{2}|u[\da-fA-F]{4}|U[\da-fA-F]{8}|[0-7]{1,3})/g, (l, a) => {
    const h = { "\\": "\\", "'": "'", '"': '"', a: "\x07", b: "\b", f: "\f", n: `
`, r: "\r", t: "	", v: "\v" };
    return a in h ? h[a] : a.includes(`
`) ? "" : String.fromCodePoint(parseInt(/[xuU]/.test(a[0]) ? a.slice(1) : a, /[xuU]/.test(a[0]) ? 16 : 8));
  }));
  try {
    return { ...s, value: JSON.parse(o) };
  } catch {
    throw new Error("Configuration is not literal JSON; edit setup in Python.");
  }
}
function Up(n, e) {
  const t = Va(n), i = JSON.stringify(e, null, 2).replace(/'/g, "\\u0027");
  return n.slice(0, t.from) + "r'''" + i + "'''" + n.slice(t.to);
}
const Gs = "nl.bioimaging.omero-analysis-notebook.v1", yp = "omero-analysis-config", _a = /* @__PURE__ */ new Set([
  "duckdb",
  "matplotlib",
  "numpy",
  "pandas",
  "pyarrow",
  "pypdf",
  "python-calamine",
  "scikit-image",
  "scipy",
  "seaborn",
  "xlrd"
]);
function bp(n) {
  return Array.isArray(n.source) ? n.source.join("") : n.source;
}
function Io(n, e, t) {
  if (typeof n != "string" || !n.trim()) throw new Error(`${t} must be a relative path`);
  const i = n.replace(/\\/g, "/"), s = i.split("/");
  if (i.startsWith("/") || s[0] !== e || s.includes(".."))
    throw new Error(`${t} must stay inside ${e}/`);
  return i;
}
function No(n) {
  if (typeof n != "string" || !n.trim()) throw new Error("choices_query.sql is required");
  const e = n.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, " ").trim();
  if (!/^(select|with)\b/i.test(e) || e.replace(/;\s*$/, "").includes(";"))
    throw new Error("choices_query must contain one SELECT or WITH … SELECT statement");
  if (/\b(attach|copy|pragma|install|load|create|alter|drop|insert|update|delete|merge|call|set|reset)\b/i.test(e))
    throw new Error("choices_query contains a prohibited operation");
  if (/\b(read_csv|read_csv_auto|read_parquet|read_json|sqlite_scan|postgres_scan|httpfs|delta_scan|iceberg_scan|shell|system)\s*\(/i.test(e))
    throw new Error("choices_query contains a prohibited file or external function");
  return n;
}
function Sp(n) {
  return Va(n).value;
}
function xp(n, e = !1) {
  if (!n || typeof n != "object" || Array.isArray(n)) throw new Error("Notebook configuration must be an object");
  const t = n;
  if (t.schema !== Gs) throw new Error(`schema must equal ${Gs}`);
  if (!Array.isArray(t.inputs) || !t.inputs.length) throw new Error("inputs must be a non-empty list");
  const i = /* @__PURE__ */ new Set(), s = t.inputs.map((f, c) => {
    if (!f || typeof f != "object" || Array.isArray(f)) throw new Error(`inputs[${c}] must be an object`);
    if (typeof f.id != "string" || !/^[a-z][a-z0-9_-]{0,63}$/.test(f.id)) throw new Error(`inputs[${c}].id is invalid`);
    if (i.has(f.id)) throw new Error(`Duplicate input id: ${f.id}`);
    i.add(f.id);
    const u = Io(f.path, "input", `Input ${f.id} path`), d = f.required ?? !0;
    if (typeof d != "boolean") throw new Error(`Input ${f.id} required must be boolean`);
    if (f.filename_globs !== void 0 && (!Array.isArray(f.filename_globs) || !f.filename_globs.length || f.filename_globs.length > 20 || f.filename_globs.some((p) => typeof p != "string" || !p.trim() || p.length > 180 || /[\\/\x00-\x1f\[\]]/.test(p))))
      throw new Error(`Input ${f.id} filename_globs must contain 1..20 basename patterns using * or ?`);
    if (f.kind === "query") {
      const p = /* @__PURE__ */ new Set(["duckdb", "sqlite", "sqlite3", "csv"]);
      if (!Array.isArray(f.formats) || !f.formats.length || f.formats.some((g) => !p.has(g)))
        throw new Error(`Input ${f.id} formats are invalid`);
      if (f.readiness !== void 0) {
        if (!Array.isArray(f.readiness) || f.readiness.length > 4)
          throw new Error("readiness must contain at most 4 checks");
        for (const g of f.readiness) {
          if (!g || typeof g != "object" || typeof g.sql != "string" || !g.sql.trim() || g.sql.length > 16384 || typeof g.message != "string" || !g.message.trim() || g.message.length > 500)
            throw new Error("Each readiness check needs bounded SQL and an explanation");
          No(g.sql);
        }
      }
      return { ...f, path: u, required: d, formats: Array.from(new Set(f.formats)) };
    }
    if (f.kind === "file") {
      if (!Array.isArray(f.extensions) || !f.extensions.length || f.extensions.some((p) => typeof p != "string" || !/^\.[A-Za-z0-9][A-Za-z0-9._-]*$/.test(p)))
        throw new Error(`Input ${f.id} extensions are invalid`);
      if (f.readiness !== void 0) throw new Error("Readiness checks require a query input");
      return { ...f, path: u, required: d, extensions: f.extensions.map((p) => p.toLowerCase()) };
    }
    throw new Error(`Input ${f.id} kind must be query or file`);
  });
  if (!t.results || typeof t.results != "object" || Array.isArray(t.results)) throw new Error("results must be an object");
  const r = { ...t.results, path: Io(t.results.path, "results", "results.path") };
  if (t.parameters != null && !Array.isArray(t.parameters)) throw new Error("parameters must be a list");
  const o = /* @__PURE__ */ new Set(), l = (t.parameters || []).map((f, c) => {
    if (!f || typeof f != "object" || Array.isArray(f)) throw new Error(`parameters[${c}] must be an object`);
    if (typeof f.name != "string" || !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(f.name)) throw new Error(`parameters[${c}].name is invalid`);
    if (o.has(f.name)) throw new Error(`Duplicate parameter name: ${f.name}`);
    if (o.add(f.name), !["boolean", "integer", "number", "string", "choice"].includes(f.type)) throw new Error(`Parameter ${f.name} type is invalid`);
    if (f.label != null && typeof f.label != "string") throw new Error(`Parameter ${f.name} label must be a string`);
    if (f.help != null && typeof f.help != "string") throw new Error(`Parameter ${f.name} help must be a string`);
    if (f.type === "boolean" && f.default != null && typeof f.default != "boolean") throw new Error(`Parameter ${f.name} default must be boolean`);
    if (f.type === "integer" && f.default != null && !Number.isSafeInteger(f.default)) throw new Error(`Parameter ${f.name} default must be integer`);
    if (f.type === "number" && f.default != null && (typeof f.default != "number" || !Number.isFinite(f.default))) throw new Error(`Parameter ${f.name} default must be numeric`);
    if (f.type === "string" && f.default != null && typeof f.default != "string") throw new Error(`Parameter ${f.name} default must be a string`);
    if (["integer", "number"].includes(f.type)) {
      for (const u of ["minimum", "maximum", "step"])
        if (f[u] != null && (typeof f[u] != "number" || !Number.isFinite(f[u]))) throw new Error(`Parameter ${f.name} ${u} must be numeric`);
      if (f.minimum != null && f.maximum != null && f.minimum > f.maximum) throw new Error(`Parameter ${f.name} minimum exceeds maximum`);
      if (f.step != null && f.step <= 0) throw new Error(`Parameter ${f.name} step must be positive`);
    }
    if (f.type === "choice") {
      if (!f.choices && !f.choices_query) throw new Error(`Parameter ${f.name} requires choices or choices_query`);
      if (f.choices && (!Array.isArray(f.choices) || !f.choices.length || f.choices.some((u) => !["boolean", "number", "string"].includes(typeof u))))
        throw new Error(`Parameter ${f.name} choices must be a non-empty scalar list`);
      if (f.default != null && !["boolean", "number", "string"].includes(typeof f.default)) throw new Error(`Parameter ${f.name} default must be scalar`);
      if (f.choices_query) {
        if (!i.has(f.choices_query.source)) throw new Error(`Parameter ${f.name} choices_query source is unknown`);
        if (typeof f.choices_query.sql != "string" || !f.choices_query.sql.trim()) throw new Error(`Parameter ${f.name} choices_query sql is required`);
        for (const d of ["value_column", "label_column"])
          if (f.choices_query[d] != null && typeof f.choices_query[d] != "string") throw new Error(`Parameter ${f.name} choices_query ${d} must be a string`);
        const u = f.choices_query.limit ?? 100;
        if (!Number.isSafeInteger(u) || u < 1 || u > 1e3) throw new Error(`Parameter ${f.name} choices_query limit must be 1..1000`);
        f = { ...f, choices_query: { ...f.choices_query, limit: u, sql: No(f.choices_query.sql) } };
      }
    }
    return { ...f };
  });
  if (t.requirements != null && (!Array.isArray(t.requirements) || t.requirements.some((f) => typeof f != "string" || !/^[A-Za-z0-9][A-Za-z0-9._<>=!~,-]*$/.test(f))))
    throw new Error("requirements must contain package requirement strings");
  const a = Array.from(new Set(t.requirements || [])), h = a.map((f) => f.split(/[<>=!~]/, 1)[0].toLowerCase().replace(/[_.]/g, "-")).filter((f) => !_a.has(f));
  if (h.length && !e)
    throw new Error(`Unsupported package requirement(s): ${Array.from(new Set(h)).sort().join(", ")}`);
  return { ...t, schema: Gs, inputs: s, results: r, parameters: l, requirements: a };
}
function Hp(n, e = !1) {
  var r, o;
  const t = n.cells.filter(
    (l) => {
      var a;
      return l.cell_type === "code" && Array.isArray((a = l.metadata) == null ? void 0 : a.tags) && l.metadata.tags.includes(yp);
    }
  );
  if (!t.length) return null;
  if (t.length !== 1 || n.cells[0] !== t[0]) throw new Error("The configuration cell must be the first cell and uniquely tagged omero-analysis-config");
  const i = xp(Sp(bp(t[0])), e), s = (o = (r = n.metadata) == null ? void 0 : r.omero_analysis) == null ? void 0 : o.schema_requirements;
  return !s || typeof s != "object" || Array.isArray(s) ? i : {
    ...i,
    inputs: i.inputs.map((l) => {
      var a;
      return l.kind === "query" && ((a = s[l.id]) != null && a.tables) ? { ...l, schema: { ...l.schema, tables: s[l.id].tables } } : l;
    })
  };
}
function Gp(n) {
  const e = { ...n.metadata };
  return delete e.widgets, {
    ...n,
    metadata: e,
    cells: n.cells.map((t) => t.cell_type === "code" ? { ...t, execution_count: null, outputs: [] } : t)
  };
}
function wp(n) {
  return Object.fromEntries(n.parameters.map((e) => [e.name, e.default ?? null]));
}
function Zp(n, e, t = {}) {
  const i = wp(n);
  for (const s of n.parameters) {
    const r = e[s.name] ?? i[s.name];
    if (r == null) {
      i[s.name] = null;
      continue;
    }
    if (s.type === "boolean" && typeof r != "boolean") throw new Error(`Parameter ${s.name} must be boolean`);
    if (s.type === "integer" && !Number.isSafeInteger(r)) throw new Error(`Parameter ${s.name} must be integer`);
    if (s.type === "number" && (typeof r != "number" || !Number.isFinite(r))) throw new Error(`Parameter ${s.name} must be numeric`);
    if (s.type === "string" && typeof r != "string") throw new Error(`Parameter ${s.name} must be a string`);
    if ((s.type === "integer" || s.type === "number") && typeof r == "number") {
      if (s.minimum != null && r < s.minimum) throw new Error(`Parameter ${s.name} is below its minimum`);
      if (s.maximum != null && r > s.maximum) throw new Error(`Parameter ${s.name} exceeds its maximum`);
    }
    if (s.type === "choice") {
      const o = s.choices || t[s.name] || [];
      if (o.length && !o.some((l) => Object.is(l, r))) throw new Error(`Parameter ${s.name} is not an available choice`);
    }
    i[s.name] = r;
  }
  return i;
}
function Xa(n) {
  var e;
  return ((e = n.toLowerCase().match(/(\.[^.\\/]+)$/)) == null ? void 0 : e[1]) || "";
}
function Yp(n, e, t) {
  return e.filter((i) => i.source !== "result" && !i.deletedAt && i.state === "ready" && Fa(i.id === t ? { ...n, filename_globs: void 0 } : n, i.name));
}
function Fa(n, e) {
  var i;
  return (n.kind === "query" ? n.formats.flatMap((s) => s === "sqlite" ? [".sqlite"] : s === "sqlite3" ? [".sqlite3"] : [`.${s}`]) : n.extensions).includes(Xa(e)) ? !n.filename_globs || e.toLowerCase() === ((i = n.path.split(/[\\/]/).at(-1)) == null ? void 0 : i.toLowerCase()) ? !0 : n.filename_globs.some((s) => {
    const r = e.toLowerCase(), o = s.toLowerCase();
    let l = 0, a = 0, h = -1, f = 0;
    for (; l < r.length; )
      if (o[a] === "?" || o[a] === r[l])
        l++, a++;
      else if (o[a] === "*")
        h = a++, f = l;
      else if (h >= 0)
        a = h + 1, l = ++f;
      else return !1;
    for (; o[a] === "*"; ) a++;
    return a === o.length;
  }) : !1;
}
function Lo(n) {
  const e = n.trim().toLowerCase().replace(/\(.*/, "");
  return /^(varchar|text|str|string|object)$/.test(e) ? "string" : /^(tinyint|smallint|integer|int|bigint|int\d+|uint\d+)$/.test(e) ? "integer" : /^(float\d*|double|real|decimal|numeric)$/.test(e) ? "number" : /^(bool|boolean)$/.test(e) ? "boolean" : e;
}
function Vo(n, e) {
  var i, s, r, o, l, a;
  if (!(n.kind === "query" ? n.formats.map((h) => `.${h}`) : n.extensions).includes(Xa(e.name))) return { status: "incompatible", reasons: ["File format does not match"] };
  if (!Fa(n, e.name)) return { status: "incompatible", reasons: [`${n.id}: filename does not match the declared requirements`] };
  if (e.error) return { status: "unchecked", reasons: [e.error] };
  if (n.kind === "query" && ((s = (i = n.schema) == null ? void 0 : i.tables) != null && s.length)) {
    if (!((r = e.schema) != null && r.tables)) return { status: "unchecked", reasons: [`${n.id}: schema not checked`] };
    for (const h of n.schema.tables) {
      const f = e.schema.tables.find((c) => c.name === h.name);
      if (!f) return { status: "incompatible", reasons: [`${n.id}: missing table ${h.name}`] };
      for (const c of h.columns || []) {
        if (!f.columns) return { status: "unchecked", reasons: [`${n.id}: columns not checked for ${h.name}`] };
        const u = f.columns.find((d) => d.name === c.name);
        if (!u)
          return { status: "incompatible", reasons: [`${n.id}: missing column ${h.name}.${c.name}`] };
        if (c.type && !u.type) return { status: "unchecked", reasons: [`${n.id}: type not checked for ${c.name}`] };
        if (c.type && u.type && Lo(c.type) !== Lo(u.type))
          return { status: "incompatible", reasons: [`${n.id}: ${c.name} requires ${c.type}, found ${u.type}`] };
      }
    }
  }
  if (n.kind === "query" && ((o = n.readiness) != null && o.length))
    for (const h of n.readiness) {
      if (((l = e.readiness) == null ? void 0 : l[h.sql]) === !1) return { status: "incompatible", reasons: [h.message] };
      if (((a = e.readiness) == null ? void 0 : a[h.sql]) !== !0) return { status: "unchecked", reasons: [e.error || `Not checked: ${h.message}`] };
    }
  return { status: "compatible", reasons: [] };
}
function Kp(n, e, t) {
  if (!n) return { status: "unchecked", reasons: ["Legacy notebook: no portable input contract"] };
  const i = (n.requirements || []).map((l) => l.split(/[<>=!~]/)[0].toLowerCase().replace(/[_.]/g, "-")).filter((l) => !_a.has(l));
  if (i.length) return { status: "incompatible", reasons: [`Unsupported packages: ${i.join(", ")}`] };
  const s = [], r = [], o = [];
  (n.requirements || []).some((l) => /[<>=!~]/.test(l)) && r.push("Package version constraints must be checked against the runtime");
  for (const l of n.inputs.filter((a) => a.required)) {
    const a = e.map((f) => Vo(l, f)), h = a.filter((f) => f.status === "compatible");
    if (h.length)
      h.length > 1 && !e.some((f) => f.id === t && Vo(l, f).status === "compatible") && o.push(`${l.id}: choose between ${h.length} matching inputs`);
    else if (a.some((f) => f.status === "unchecked")) r.push(`${l.id}: schema not checked`);
    else {
      const f = a.flatMap((c) => c.reasons).filter((c) => c !== "File format does not match");
      s.push(...f.length ? [...new Set(f)] : [`Needs a matching input for ${l.id}`]);
    }
  }
  return s.length ? { status: "incompatible", reasons: s } : r.length ? { status: "unchecked", reasons: r } : o.length ? { status: "choose", reasons: o } : { status: "compatible", reasons: ["Declared input requirements match"] };
}
const Jp = { compatible: "Ready", incompatible: "Missing requirements", unchecked: "Not checked", choose: "Choose input" };
export {
  ah as $,
  bt as A,
  Ap as B,
  Y as C,
  H as D,
  A as E,
  P as F,
  Vp as G,
  Oa as H,
  Aa as I,
  _p as J,
  jo as K,
  he as L,
  ye as M,
  E as N,
  zn as O,
  ci as P,
  Ho as Q,
  $t as R,
  Ye as S,
  te as T,
  U,
  ge as V,
  vp as W,
  y as X,
  Yi as Y,
  us as Z,
  ph as _,
  gs as a,
  fs as a0,
  Ra as a1,
  Np as a2,
  $d as a3,
  Wd as a4,
  Td as a5,
  Ka as a6,
  L as a7,
  wd as a8,
  Ip as a9,
  Yp as aA,
  _a as aB,
  wp as aC,
  Gp as aD,
  Kp as aE,
  Vo as aF,
  Fa as aG,
  Xa as aH,
  Xs as aa,
  Kd as ab,
  Yd as ac,
  xd as ad,
  Ie as ae,
  Xd as af,
  Lp as ag,
  ve as ah,
  Fp as ai,
  Qt as aj,
  Ca as ak,
  cs as al,
  Ui as am,
  jp as an,
  $p as ao,
  Wp as ap,
  qp as aq,
  Xp as ar,
  xs as as,
  Gs as at,
  xp as au,
  Hp as av,
  Zp as aw,
  yp as ax,
  Va as ay,
  Up as az,
  v as b,
  Jp as c,
  j as d,
  He as e,
  kl as f,
  Bp as g,
  D as h,
  zp as i,
  we as j,
  Pd as k,
  sr as l,
  Mi as m,
  Ep as n,
  Mp as o,
  B as p,
  En as q,
  fl as r,
  ze as s,
  Vf as t,
  je as u,
  N as v,
  Qp as w,
  wt as x,
  Cp as y,
  Rp as z
};
